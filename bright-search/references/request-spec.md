# Bright Data SERP Request Spec

`bright-search` が使っている Bright Data のリクエスト部分を、
モデルがそのまま読める形で残したメモ。

## 元の curl イメージ

```bash
curl https://api.brightdata.com/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $BRIGHTDATA_API_KEY" \
  -d '{
    "zone": "serp_api1",
    "url": "https://www.google.com/search?q=pizza",
    "format": "raw"
  }'
```

## このスキルでの対応

- 認証: `BRIGHTDATA_API_KEY`
- zone: `BRIGHTDATA_UNLOCKER_ZONE`
- endpoint: `https://api.brightdata.com/request`
- 対象 URL: Google 検索 URL

## 使い分け

- `scripts/request_google_serp.sh`
  - Bright Data の生レスポンスに近い形で返す
  - API リクエストの挙動確認向け
- `scripts/bright_search.sh`
  - 生レスポンスから `organic[].title/link/description` に絞って返す
  - 調査フロー本体向け

## 例

生リクエスト確認:

```bash
bash scripts/request_google_serp.sh "pizza"
```

整理済み検索:

```bash
bash scripts/bright_search.sh "pizza"
```

## 返り値の前提

- `format: raw`
  - Bright Data API の基本形式
- `data_format: parsed_light`
  - HTML を検索結果 JSON に寄せて返すために利用
  - `bright_search.sh` はこれを前提に `organic` を抜き出す

## 注意

- `.env` に本番キーを書く場合は git に含めない
- 大きい調査では、必ず JSON を保存してから Markdown に再構成する
