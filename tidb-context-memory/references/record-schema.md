# Record Schema

`tidb-context-memory` は、上流スキルから以下の JSONL を受け取る前提で動く。

1 行に 1 レコード。最低限 `record_id` と `content` が必要。

```json
{
  "record_id": "haruki-pricing-001",
  "source_type": "web",
  "topic": "haruki-pricing",
  "search_query": "Haruki pricing consulting",
  "title": "Haruki Consulting Pricing",
  "source_url": "https://example.com/pricing",
  "summary": "Pricing and offer overview",
  "content": "Main chunk text used for retrieval",
  "tags": ["pricing", "consulting"],
  "metadata": {
    "lang": "en",
    "confidence": "medium"
  },
  "source_captured_at": "2026-04-07T15:00:00Z",
  "embedding": [0.1, 0.2, 0.3]
}
```

## 必須フィールド

- `record_id`: 一意キー。upsert の軸になる
- `content`: 検索対象の本文

## 推奨フィールド

- `source_type`: `web`, `note`, `pdf`, `tool-output` など
- `topic`: 回答前検索で絞り込む軸
- `search_query`: どの検索クエリ由来か
- `title`
- `source_url`
- `summary`
- `tags`: 配列
- `metadata`: オブジェクト

## 任意フィールド

- `source_captured_at`: 取得時刻の文字列
- `embedding`: manual モードでベクトルを自前管理するときに使う

## チャンク設計の目安

- 1 チャンクは 400〜1,200 文字程度を目安にする
- 1 チャンク 1 主張に寄せる
- 参照元 URL とトピックはできるだけ持たせる
- 同じ URL でも論点が違うなら別レコードに分ける

## record_id の例

- `haruki-profile-001`
- `haruki-pricing-002`
- `saas-trend-2026-01`

`record_id` は URL の hash でもよいが、topic が分かる命名の方が運用しやすい。
