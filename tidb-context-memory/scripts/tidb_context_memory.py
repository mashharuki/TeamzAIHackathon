#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse

DEFAULT_TABLE = "openclaw_context_chunks"
DEFAULT_MODE = "manual"
DEFAULT_MODEL = "tidbcloud_free/cohere/embed-multilingual-v3"
DEFAULT_VECTOR_DIMS = 1024


@dataclass
class ConnectionConfig:
    host: str
    port: int
    user: str
    password: str
    database: str
    ssl_mode: str


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Generate or execute TiDB SQL for OpenClaw context storage and retrieval."
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    bootstrap = subparsers.add_parser("bootstrap", help="Create the context table and indexes.")
    add_common_sql_args(bootstrap)
    bootstrap.add_argument("--mode", choices=("manual", "auto"), default=env_or("TIDB_CONTEXT_MODE", DEFAULT_MODE))
    bootstrap.add_argument("--model", default=env_or("TIDB_EMBED_MODEL", DEFAULT_MODEL))
    bootstrap.add_argument("--vector-dims", type=int, default=int(env_or("TIDB_VECTOR_DIMS", str(DEFAULT_VECTOR_DIMS))))

    upsert = subparsers.add_parser("upsert", help="Insert or update JSONL records.")
    add_common_sql_args(upsert)
    upsert.add_argument("--mode", choices=("manual", "auto"), default=env_or("TIDB_CONTEXT_MODE", DEFAULT_MODE))
    upsert.add_argument("--input", required=True, help="Path to a JSONL file.")

    search = subparsers.add_parser("search", help="Search the context table before answering.")
    add_common_sql_args(search)
    search.add_argument("--mode", choices=("manual", "auto"), default=env_or("TIDB_CONTEXT_MODE", DEFAULT_MODE))
    search.add_argument("--query-text", help="Natural-language question.")
    search.add_argument("--query-vector", help="JSON array string for manual vector search.")
    search.add_argument("--query-vector-file", help="File containing a JSON array vector.")
    search.add_argument("--topic", help="Optional topic filter.")
    search.add_argument("--source-type", help="Optional source_type filter.")
    search.add_argument("--limit", type=int, default=6)

    return parser


def add_common_sql_args(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--table", default=env_or("TIDB_CONTEXT_TABLE", DEFAULT_TABLE))
    parser.add_argument("--connection-string", default=os.environ.get("TIDB_CONNECTION_STRING"))
    parser.add_argument("--execute", action="store_true", help="Run SQL through the local mysql CLI.")


def env_or(name: str, fallback: str) -> str:
    value = os.environ.get(name)
    return value if value else fallback


def parse_connection_string(connection_string: str) -> ConnectionConfig:
    parsed = urlparse(connection_string)
    if parsed.scheme not in {"mysql", "mysql2"}:
        raise ValueError("Only mysql:// style connection strings are supported.")

    database = parsed.path.lstrip("/")
    if not database:
        raise ValueError("Connection string must include a database name.")

    ssl_mode = "REQUIRED"
    query = parse_qs(parsed.query)
    ssl_mode_value = first_non_empty(
        query.get("ssl-mode", []),
        query.get("sslmode", []),
    )
    ssl_accept_value = first_non_empty(query.get("sslaccept", []))

    if ssl_mode_value:
        ssl_mode = normalize_ssl_mode(ssl_mode_value)
    elif ssl_accept_value:
        ssl_mode = "VERIFY_IDENTITY" if ssl_accept_value.lower() == "strict" else "REQUIRED"

    return ConnectionConfig(
        host=parsed.hostname or "127.0.0.1",
        port=parsed.port or 4000,
        user=unquote(parsed.username or ""),
        password=unquote(parsed.password or ""),
        database=database,
        ssl_mode=ssl_mode,
    )


def first_non_empty(*values: list[str]) -> str | None:
    for candidates in values:
        for value in candidates:
            if value:
                return value
    return None


def normalize_ssl_mode(value: str) -> str:
    normalized = value.strip().lower()
    mapping = {
        "disable": "DISABLED",
        "disabled": "DISABLED",
        "preferred": "PREFERRED",
        "prefer": "PREFERRED",
        "require": "REQUIRED",
        "required": "REQUIRED",
        "verify-ca": "VERIFY_CA",
        "verify_ca": "VERIFY_CA",
        "verify-identity": "VERIFY_IDENTITY",
        "verify_identity": "VERIFY_IDENTITY",
        "strict": "VERIFY_IDENTITY",
    }
    return mapping.get(normalized, "REQUIRED")


def mysql_command(config: ConnectionConfig, table_output: bool) -> list[str]:
    command = [
        "mysql",
        "--protocol=TCP",
        "--default-character-set=utf8mb4",
        "--host",
        config.host,
        "--port",
        str(config.port),
        "--user",
        config.user,
        f"--password={config.password}",
        "--database",
        config.database,
        f"--ssl-mode={config.ssl_mode}",
    ]
    if table_output:
        command.append("--table")
    else:
        command.extend(["--batch", "--raw"])
    return command


def execute_sql(sql: str, connection_string: str, table_output: bool = False) -> int:
    if not connection_string:
        raise ValueError("TIDB_CONNECTION_STRING is required when using --execute.")

    config = parse_connection_string(connection_string)
    result = subprocess.run(
        mysql_command(config, table_output=table_output),
        input=sql,
        text=True,
        check=False,
    )
    return result.returncode


def sql_string(value: object | None) -> str:
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "1" if value else "0"
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, (dict, list)):
        value = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    text = str(value)
    text = text.replace("\\", "\\\\")
    text = text.replace("'", "''")
    text = text.replace("\n", "\\n")
    text = text.replace("\r", "\\r")
    text = text.replace("\t", "\\t")
    return f"'{text}'"


def ensure_vector_literal(raw_value: object) -> str:
    if isinstance(raw_value, str):
        parsed = json.loads(raw_value)
    else:
        parsed = raw_value

    if not isinstance(parsed, list) or not parsed:
        raise ValueError("Vector must be a non-empty JSON array.")
    for item in parsed:
        if not isinstance(item, (int, float)):
            raise ValueError("Vector values must be numeric.")

    return sql_string(json.dumps(parsed, ensure_ascii=False, separators=(",", ":")))


def load_jsonl(path: str) -> list[dict]:
    records: list[dict] = []
    for index, line in enumerate(Path(path).read_text().splitlines(), start=1):
        line = line.strip()
        if not line:
            continue
        try:
            payload = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"Invalid JSON on line {index}: {exc}") from exc
        if not isinstance(payload, dict):
            raise ValueError(f"Line {index} must be a JSON object.")
        records.append(payload)
    if not records:
        raise ValueError("Input JSONL did not contain any records.")
    return records


def normalize_record(record: dict, index: int) -> dict:
    record_id = record.get("record_id")
    if not record_id:
        raise ValueError(f"Record {index} is missing record_id.")

    content = record.get("content") or record.get("summary") or record.get("description")
    if not content:
        raise ValueError(f"Record {index} ({record_id}) is missing content.")

    metadata = record.get("metadata")
    if metadata is None:
        metadata = {}
    elif not isinstance(metadata, dict):
        metadata = {"raw_metadata": metadata}

    tags = record.get("tags")
    if tags is None:
        tags = []
    elif not isinstance(tags, list):
        tags = [str(tags)]

    return {
        "record_id": str(record_id),
        "source_type": str(record.get("source_type") or "web"),
        "topic": record.get("topic"),
        "search_query": record.get("search_query"),
        "title": record.get("title"),
        "source_url": record.get("source_url"),
        "summary": record.get("summary") or record.get("description"),
        "content": str(content),
        "tags": tags,
        "metadata": metadata,
        "source_captured_at": record.get("source_captured_at"),
        "embedding": record.get("embedding"),
    }


def render_bootstrap_sql(table: str, mode: str, model: str, vector_dims: int) -> str:
    if vector_dims <= 0:
        raise ValueError("vector_dims must be a positive integer.")

    if mode == "auto":
        embedding_column = (
            f"embedding VECTOR({vector_dims}) GENERATED ALWAYS AS "
            f"(EMBED_TEXT({sql_string(model)}, content)) STORED,"
        )
    else:
        embedding_column = f"embedding VECTOR({vector_dims}) NULL,"

    return f"""-- tidb-context-memory bootstrap ({mode})
CREATE TABLE IF NOT EXISTS `{table}` (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  record_id VARCHAR(191) NOT NULL,
  source_type VARCHAR(64) NOT NULL,
  topic VARCHAR(255) NULL,
  search_query TEXT NULL,
  title TEXT NULL,
  source_url TEXT NULL,
  summary TEXT NULL,
  content LONGTEXT NOT NULL,
  tags JSON NULL,
  metadata JSON NULL,
  source_captured_at VARCHAR(64) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  {embedding_column}
  UNIQUE KEY uq_record_id (record_id),
  KEY idx_source_type (source_type),
  KEY idx_topic (topic),
  VECTOR INDEX idx_embedding ((VEC_COSINE_DISTANCE(embedding)))
);
"""


def render_upsert_sql(table: str, mode: str, records: list[dict]) -> str:
    statements: list[str] = [f"-- tidb-context-memory upsert ({mode})"]

    for index, raw_record in enumerate(records, start=1):
        record = normalize_record(raw_record, index)
        columns = [
            "record_id",
            "source_type",
            "topic",
            "search_query",
            "title",
            "source_url",
            "summary",
            "content",
            "tags",
            "metadata",
            "source_captured_at",
        ]
        values = [
            sql_string(record["record_id"]),
            sql_string(record["source_type"]),
            sql_string(record["topic"]),
            sql_string(record["search_query"]),
            sql_string(record["title"]),
            sql_string(record["source_url"]),
            sql_string(record["summary"]),
            sql_string(record["content"]),
            sql_string(record["tags"]),
            sql_string(record["metadata"]),
            sql_string(record["source_captured_at"]),
        ]

        update_columns = [
            "source_type",
            "topic",
            "search_query",
            "title",
            "source_url",
            "summary",
            "content",
            "tags",
            "metadata",
            "source_captured_at",
        ]

        if mode == "manual":
            columns.append("embedding")
            embedding = record.get("embedding")
            values.append(ensure_vector_literal(embedding) if embedding is not None else "NULL")
            update_columns.append("embedding")

        insert_columns = ", ".join(f"`{column}`" for column in columns)
        insert_values = ", ".join(values)
        update_clause = ", ".join(f"`{column}` = VALUES(`{column}`)" for column in update_columns)

        statements.append(
            f"INSERT INTO `{table}` ({insert_columns})\n"
            f"VALUES ({insert_values})\n"
            f"ON DUPLICATE KEY UPDATE {update_clause};"
        )

    statements.append("")
    return "\n\n".join(statements)


def build_filters(topic: str | None, source_type: str | None) -> str:
    filters: list[str] = []
    if topic:
        filters.append(f"topic = {sql_string(topic)}")
    if source_type:
        filters.append(f"source_type = {sql_string(source_type)}")
    return f"WHERE {' AND '.join(filters)}" if filters else ""


def render_search_sql(
    table: str,
    mode: str,
    query_text: str | None,
    query_vector: str | None,
    topic: str | None,
    source_type: str | None,
    limit: int,
) -> str:
    if limit <= 0:
        raise ValueError("limit must be a positive integer.")

    filters = build_filters(topic, source_type)
    select_prefix = (
        "SELECT record_id, source_type, topic, title, source_url, summary, "
        "LEFT(content, 400) AS content_preview"
    )

    if mode == "auto":
        if not query_text:
            raise ValueError("auto mode requires --query-text.")
        distance_expr = f"VEC_EMBED_COSINE_DISTANCE(embedding, {sql_string(query_text)})"
        return (
            f"-- tidb-context-memory search (auto)\n"
            f"{select_prefix}, {distance_expr} AS distance\n"
            f"FROM `{table}`\n"
            f"{filters}\n"
            f"ORDER BY distance\n"
            f"LIMIT {limit};\n"
        )

    if query_vector:
        distance_expr = f"VEC_COSINE_DISTANCE(embedding, {ensure_vector_literal(query_vector)})"
        return (
            f"-- tidb-context-memory search (manual vector)\n"
            f"{select_prefix}, {distance_expr} AS distance\n"
            f"FROM `{table}`\n"
            f"{filters}\n"
            f"ORDER BY distance\n"
            f"LIMIT {limit};\n"
        )

    if query_text:
        lexical_terms = extract_query_terms(query_text)
        if not lexical_terms:
            raise ValueError("query_text did not contain usable lexical terms.")
        text_match = " OR ".join(
            f"CONCAT(COALESCE(title, ''), ' ', COALESCE(summary, ''), ' ', content) LIKE {sql_string('%' + term + '%')}"
            for term in lexical_terms
        )
        lexical_where = f"({text_match})"
        if filters:
            lexical_where = f"{filters[6:]} AND {lexical_where}"
            where_clause = f"WHERE {lexical_where}"
        else:
            where_clause = f"WHERE {lexical_where}"
        return (
            f"-- tidb-context-memory search (manual lexical fallback)\n"
            f"{select_prefix}, NULL AS distance\n"
            f"FROM `{table}`\n"
            f"{where_clause}\n"
            f"ORDER BY updated_at DESC\n"
            f"LIMIT {limit};\n"
        )

    raise ValueError("manual mode requires --query-vector, --query-vector-file, or --query-text.")


def extract_query_terms(query_text: str) -> list[str]:
    seen: set[str] = set()
    terms: list[str] = []
    for raw_term in query_text.replace("　", " ").split():
        term = raw_term.strip()
        if len(term) < 2:
            continue
        if term in seen:
            continue
        seen.add(term)
        terms.append(term)
        if len(terms) >= 5:
            break
    return terms


def maybe_load_query_vector(args: argparse.Namespace) -> str | None:
    if args.query_vector:
        return args.query_vector
    if args.query_vector_file:
        return Path(args.query_vector_file).read_text().strip()
    return None


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    try:
        if args.command == "bootstrap":
            sql = render_bootstrap_sql(
                table=args.table,
                mode=args.mode,
                model=args.model,
                vector_dims=args.vector_dims,
            )
        elif args.command == "upsert":
            records = load_jsonl(args.input)
            sql = render_upsert_sql(
                table=args.table,
                mode=args.mode,
                records=records,
            )
        elif args.command == "search":
            sql = render_search_sql(
                table=args.table,
                mode=args.mode,
                query_text=args.query_text,
                query_vector=maybe_load_query_vector(args),
                topic=args.topic,
                source_type=args.source_type,
                limit=args.limit,
            )
        else:
            parser.error("Unknown command")
            return 2
    except ValueError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    if args.execute:
        return execute_sql(sql, args.connection_string, table_output=(args.command == "search"))

    print(sql)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
