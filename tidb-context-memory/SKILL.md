---
name: tidb-context-memory
description: >
  TiDB を OpenClaw の外部コンテキストメモリとして使い、Web 検索や調査メモから
  作った JSONL レコードを保存し、回答生成の直前に関連チャンクを検索して文脈として
  差し込むスキル。Use when: OpenClaw の返答で過去に収集した情報を参照したい、
  TiDB Cloud Zero / Starter に RAG 用データを保存したい、検索結果を永続化したい、
  JSONL レコードを SQL に流し込みたい、回答前検索の流れを組み込みたい。
---

# TiDB Context Memory

## Overview

検索や調査で集めた知識を TiDB に保存し、OpenClaw が返答を作る前に
必要なチャンクだけを引くためのスキル。

このスキルの責務は次の 3 つ:

- JSONL レコードを TiDB に入れられる形にそろえる
- TiDB 側のスキーマを作る
- ユーザー質問に近いチャンクを回答直前に検索する

## 前提

- `mysql` CLI が使えること
- `TIDB_CONNECTION_STRING` が設定されていること
- 上流の検索スキルが JSONL でレコードを出せること
期待フォーマットは `references/record-schema.md`

環境変数の目安:

```bash
export TIDB_CONNECTION_STRING="mysql://user:pass@host:4000/db"
export TIDB_CONTEXT_TABLE="openclaw_context_chunks"
export TIDB_CONTEXT_MODE="manual"
export TIDB_EMBED_MODEL="tidbcloud_free/cohere/embed-multilingual-v3"
export TIDB_VECTOR_DIMS="1024"
```

`TIDB_CONTEXT_MODE` は以下のどちらか:

- `manual`: もっとも互換性が高い。ベクトルは外部生成または後で追加
- `auto`: TiDB Auto Embedding を使う。回答前の自然文検索まで SQL だけで完結

モード選択の考え方は `references/mode-selection.md` を読む。

## 基本ワークフロー

### 1. テーブルを作る

まずスキーマを作る。`auto` なら生成列で埋め込みを作り、`manual` なら
テキストとメタデータを先に保存する。

```bash
python3 scripts/tidb_context_memory.py bootstrap --mode manual --execute
```

Auto Embedding が使える TiDB なら:

```bash
python3 scripts/tidb_context_memory.py bootstrap --mode auto --execute
```

SQL だけ確認したいときは `--execute` を外す。

### 2. レコードを保存する

上流スキルが吐いた JSONL を TiDB に入れる。

```bash
python3 scripts/tidb_context_memory.py upsert \
  --mode manual \
  --input /path/to/records.jsonl \
  --execute
```

`auto` モードでは `content` から自動で埋め込みが生成される。
`manual` モードでは `embedding` フィールドがあれば一緒に保存し、
なければテキストだけ保存する。

### 3. 回答前に検索する

OpenClaw が返答を作る直前に、ユーザーの質問をそのまま使って検索する。

Auto Embedding が使える場合:

```bash
python3 scripts/tidb_context_memory.py search \
  --mode auto \
  --query-text "Haruki に相談できる BtoB SaaS のテーマは？" \
  --limit 6 \
  --execute
```

Manual モードで埋め込みベクトルを持っている場合:

```bash
python3 scripts/tidb_context_memory.py search \
  --mode manual \
  --query-vector "[0.12,0.98,0.44]" \
  --limit 6 \
  --execute
```

Manual モードでまだ埋め込みがない場合は、テキスト一致の暫定検索を使う:

```bash
python3 scripts/tidb_context_memory.py search \
  --mode manual \
  --query-text "BtoB SaaS pricing strategy" \
  --limit 6 \
  --execute
```

## OpenClaw に組み込むときのルール

回答生成のたびに、毎回 Web を叩く必要はない。まず TiDB を見る。

1. ユーザー質問が過去に収集した知識で答えられそうなら、先に TiDB を検索する
2. 上位 3〜8 件のチャンクだけを回答コンテキストに入れる
3. 情報が薄いときだけ Web 検索へフォールバックする
4. 新しく見つけた有用情報は JSONL 化して TiDB に追記する

回答へ混ぜるときの最低限の形式:

- `title`
- `source_url`
- `summary` または `content` の要点
- 距離または検索理由

保存済みデータだけで断定しないこと。古い可能性がある情報は、
必要に応じて再検索して更新する。

## スクリプト

このスキルには `scripts/tidb_context_memory.py` が付いている。

サブコマンド:

- `bootstrap`: テーブルとインデックスの SQL を作る / 実行する
- `upsert`: JSONL レコードを `INSERT ... ON DUPLICATE KEY UPDATE` に変換する / 実行する
- `search`: 質問文またはベクトルから検索 SQL を作る / 実行する

## 参照ファイル

- `references/record-schema.md`: 上流スキルが出す JSONL の形
- `references/mode-selection.md`: TiDB Cloud Zero / Starter を含むモード選び

## やらないこと

- 生ページ全文をそのまま 1 レコードで入れない
- 参照 URL や topic がない断片を大量投入しない
- 回答前に 20 件以上のチャンクをそのまま詰め込まない
- TiDB に入っているからといって最新と見なさない
