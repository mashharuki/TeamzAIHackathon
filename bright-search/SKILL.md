---
name: bright-search
description: >
  Bright Data SERP API を使って必要な情報を集め、Markdown に整理する
  OpenClaw 向けのリサーチスキル。人物、サービス、競合、料金、実績、
  導入手順などの下調べに使い、検索結果を根拠付きの調査メモへ落とし込む。
  Soul や Skill を作る前の情報収集にも向く。
  Use when: 必要な情報を集めて整理したい、Bright Data で調査したい、
  OpenClaw 用の材料を集めたい、Soul/Skill の前に下調べしたい。
  Triggers: "bright-search", "Bright Data で調べる", "必要な情報を集めて整理",
  "OpenClaw の調査", "Soul 用に情報収集", "人物の材料を集める"
---

# bright-search

Bright Data を使って Web 検索し、必要な情報を
「使える調査メモ」に整理するためのスキル。

## 目的

- 検索で見つけた情報を、あとで Soul や Skill に流し込める形にする
- 事実、仮説、不明点、参照元を分けて残す
- OpenClaw デモで必要な「この人に相談できるサービス」の材料を集める

## セットアップ

以下の環境変数が必要:

```bash
export BRIGHTDATA_API_KEY="your-api-key"
export BRIGHTDATA_UNLOCKER_ZONE="your-zone-name"
```

`bright-search/.env` に書いておけば、`scripts/bright_search.sh` 実行時に自動で読み込まれる。

検索スクリプト:

```bash
bash scripts/bright_search.sh "query" [cursor]
```

## 使い方

### 1. 調査のゴールを先に固定する

最初に以下を 1〜3 行で定義する:

- 何を調べるか
- 最終的に何を作るか
- 何が分かれば前に進めるか

例:

```text
Haruki の知見を元に「この人に相談できる」OpenClaw デモを作る。
Soul と Skill に必要な専門領域、相談スタイル、料金感、実績、話し方を集める。
```

### 2. クエリを 3〜8 本に分解する

広すぎる 1 本ではなく、観点ごとに分ける。

推奨カテゴリ:

- 基本プロフィール
- 専門領域
- 実績、登壇、記事
- 相談テーマ、支援内容
- 料金やプラン
- 話し方、思想、よく使う表現

例:

```bash
bash scripts/bright_search.sh "Haruki consultant profile"
bash scripts/bright_search.sh "Haruki interview marketing strategy"
bash scripts/bright_search.sh "Haruki pricing consulting"
```

### 3. 生データを残す

検索結果はトピックごとに保存する。

```bash
mkdir -p research/raw/haruki
bash scripts/bright_search.sh "Haruki consultant profile" > research/raw/haruki/01-profile.json
bash scripts/bright_search.sh "Haruki pricing consulting" > research/raw/haruki/02-pricing.json
```

### 4. Markdown に整理する

`references/research-template.md` を元に、最低限以下を埋める:

- 調査目的
- 検索クエリ一覧
- 事実
- 仮説
- 未確認事項
- 参照 URL

保存先の目安:

```text
research/{topic}.md
```

例:

```text
research/haruki.md
```

### 5. OpenClaw 用に整形する

人物ベースのデモなら、特に以下を明確にする:

- この人は誰か
- 何の専門家か
- どんな相談に強いか
- どういう話し方をするか
- いくらで相談を受ける想定か
- 何を言い切れて、何はまだ仮説か

必要に応じて、この調査メモを `soul-generator` に渡して Soul 化する。

## 出力品質の基準

- 重要な主張には参照 URL を付ける
- 事実と推測を混ぜない
- 「分からないこと」は未確認として残す
- そのまま Soul や Skill の素材として再利用できる粒度にする

## OpenClaw デモ向けの観点

「この人に相談できるサービス」を作るときは、以下の観点で整理する:

- **Identity**: 経歴、立ち位置、肩書き
- **Expertise**: 何に強いか、どこまで深いか
- **Consulting Themes**: 何を相談できるか
- **Tone**: どういう口調か、どう説明するか
- **Commercials**: 料金感、支援メニュー
- **Evidence**: 実績、記事、登壇、紹介文
- **Gaps**: まだ取れていない情報

## やらないこと

- 参照元なしで断定しない
- 一つの検索結果だけで人物像を決め切らない
- 情報を集めただけで終わらせず、必ず Markdown に再構成する
