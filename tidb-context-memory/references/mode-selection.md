# Mode Selection

2026-04-07 時点の公式情報ベースでは、TiDB 周りは次のように考えると安全。

## `manual` モード

最も互換性が高い方式。

- `content` や `summary` を保存する
- `embedding` は外部で生成できるなら一緒に入れる
- まだ埋め込みがない段階では、暫定的にテキスト一致検索で使う

このモードが向くケース:

- TiDB Cloud Zero でまず試作したい
- 埋め込みモデルは別で用意する予定
- 先にストレージと retrieval の流れだけ作りたい

## `auto` モード

TiDB の Auto Embedding が使える環境向け。

公式ドキュメントでは以下が案内されている:

- `EMBED_TEXT("model_name", text_content)` で埋め込み生成
- `VEC_EMBED_COSINE_DISTANCE(vector_column, "query_text")` で自然文検索
- Auto Embedding は TiDB Cloud Starter hosted on AWS で利用可能

このモードが向くケース:

- 保存時に自動で埋め込みを作りたい
- 回答前検索を SQL だけで完結させたい
- OpenClaw 側の手数を最小化したい

## 実務上の選び方

1. TiDB Cloud Zero で今すぐ試すなら、まず `manual`
2. Starter 側で Auto Embedding が使えるなら、`auto` に寄せる
3. 最終的に `manual -> auto` へ移行してもよい

## OpenClaw での推奨フロー

1. Web や外部ソースから情報収集
2. JSONL レコードへ正規化
3. TiDB へ upsert
4. 回答前に TiDB から 3〜8 件取得
5. 足りないときだけ再検索

## 注意点

- TiDB Cloud Zero は 30 日 TTL の使い捨て前提
- `v1alpha1` API は 2026-04-06 に削除予定と案内されているため、Zero API を使うなら `v1beta1` を前提にする
- Auto Embedding とベクトル検索の提供条件は変わり得るため、環境ごとに一度小さな検証クエリを流して確認する
