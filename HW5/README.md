# AI Agent 實作工作坊 v8（JavaScript 版）

by eddie@5xcampus.com

JavaScript / Node.js 版的 AI Agent 教學課程，用 OpenAI Node SDK v6
（Responses API）、`@openai/agents`、Qdrant 與 MCP 實作。

## 章節進度（分支）

| 分支 | 主題 |
|------|------|
| `0.1-hello-world` | 起步 |
| `1.1-setup-env` | dotenv 環境變數 |
| `1.2-openai-api` | 第一次 Responses API 呼叫 |
| `1.3-openai-api-loop` | 對話迴圈 |
| `1.4-openai-api-with-memory` | lowdb 對話記憶 |
| `2.1-tool-calling-1` | tool calling 概念 |
| `2.2-tool-calling-2` | 真實 OpenWeather tool |
| `2.3-tool-calling-3` | 多 tool + 有上限的多輪 loop |
| `2.4-tool-calling-youbike` | YouBike API + Haversine |
| `2.5-tool-calling-current-time` | Zod schema 與執行期驗證 |
| `3.1-rag-text-to-vector` | Qdrant + Netflix embedding |
| `3.2-rag-search-text` | 語意搜尋 |
| `3.3-rag-tool` | RAG 包成 tool |
| `3.4-rag-for-pdf` | PDF RAG + recursive splitting |
| `4.1-agents-sdk` | Agents SDK 多 agent + handoff |

## 開發環境

GitHub Codespaces 會依 `.devcontainer/devcontainer.json` 建立 Node.js 22
環境。也可以在本機使用 Node.js 22+。

```bash
npm install
cp .env.example .env
npm start
```

章節 3 起另需 Qdrant；天氣工具另需 OpenWeather API key。金鑰只放在
`.env` 或 Codespaces secrets，不要提交到 Git。


```

@WENHEWHSHEN ➜ /workspaces/Homework/HW5 (main) $ npm start

> ai-agent-js-v8@0.1.0 start
> node main.js

[AGENTS.md] 已載入 /workspaces/Homework/HW5/AGENTS.md
[tenlong-tools MCP server] running on stdio
✔ 請輸入你的問題： 請問什麼是 git commit？它跟 git add 有什麼差別？

[由 Git 老師 回答]
當然可以。

## 什麼是 `git commit`？
`git commit` 的意思是：  
**把你目前暫存區（staging area）裡的變更，正式存成一個版本紀錄。**

你可以把它想成：

- 你先把修改好的檔案「打包整理」
- 再用 `commit` 把這個整理好的狀態存進 Git 歷史中
- 之後可以回看、比較、回復到這個版本

每個 commit 都會有：
- 一個唯一的 ID
- 作者資訊
- 時間
- 提交訊息（commit message）
- 當時專案的檔案快照

---

## `git add` 跟 `git commit` 的差別

### `git add`
`git add` 是把檔案的變更**加入暫存區**。

意思是告訴 Git：

> 「這些修改我準備好了，等一下要一起提交。」

它不是正式存檔，只是先放到「待提交名單」。

---

### `git commit`
`git commit` 是把**暫存區**的內容真正做成一個版本。

意思是告訴 Git：

> 「好，現在把剛剛暫存的內容存成一個歷史版本。」

---

## 簡單比喻
可以把它想成寫報告：

- `git add` = 把你想交的內容放進資料夾
- `git commit` = 把這個資料夾正式交出去並留存紀錄

---

## 流程範例

```bash
git status
```

看到某個檔案被修改後：

```bash
git add index.html
git commit -m "更新首頁內容"
```

意思是：

1. `index.html` 有變更
2. `git add index.html`：把它加入暫存區
3. `git commit -m "..."`
   ：把暫存區內容存成一個 commit

---

## 更直觀地說
Git 裡有三個常見區域：

1. **工作區（Working Directory）**  
   你正在修改的檔案

2. **暫存區（Staging Area）**  
   已經準備好要提交的變更

3. **儲存庫（Repository）**  
   已經被 `commit` 的正式歷史版本

`git add` 是把東西從工作區放到暫存區，  
`git commit` 是把東西從暫存區存進儲存庫。

---

## 一句話總結
- **`git add`**：準備提交
- **`git commit`**：正式提交

---

如果你要，我也可以接著幫你畫一張「工作區 / 暫存區 / commit」的流程圖，會更好懂。

✔ 請輸入你的問題： Python 的 list 跟 tuple 有什麼不一樣？

[由 Python 老師 回答]
`list` 和 `tuple` 都是 Python 用來存放一組資料的容器，差別主要在於：

## 1. 可不可以修改
### `list`：可以修改
你可以新增、刪除、替換裡面的元素。

```python
a = [1, 2, 3]
a[0] = 10
a.append(4)
print(a)  # [10, 2, 3, 4]
```

### `tuple`：不能修改
建立後內容固定，不能直接改元素。

```python
b = (1, 2, 3)
# b[0] = 10  # 這會報錯
```

---

## 2. 表示方式
- `list` 用 `[]`
- `tuple` 用 `()`

```python
a = [1, 2, 3]
b = (1, 2, 3)
```

---

## 3. 使用情境
### `list` 適合：
- 資料需要經常變動
- 要新增、刪除、排序
- 例如購物車清單、待辦事項

### `tuple` 適合：
- 資料不希望被修改
- 表示固定資料
- 例如座標 `(x, y)`、日期時間資訊

---

## 4. 效能與特性
- `tuple` 通常比 `list` **更省記憶體**
- 在某些情況下，`tuple` 讀取速度也會稍快一點
- 因為不可變，所以更適合拿來當「固定資料」

---

## 5. 可不可以當字典的 key
### `tuple` 可以
如果 tuple 裡的內容也都是不可變的，它可以當 `dict` 的 key。

```python
d = {(1, 2): "point"}
```

### `list` 不行
因為 list 是可變的。

```python
# d = {[1, 2]: "point"}  # 會報錯
```

---

## 簡單總結
| 特性 | list | tuple |
|---|---|---|
| 可變嗎 | 可以 | 不可以 |
| 語法 | `[]` | `()` |
| 適合用途 | 常變動資料 | 固定資料 |
| 能當 dict key | 不行 | 可以（條件成立時） |

---

## 怎麼選？
- **會改動資料 → 用 `list`**
- **不會改動、想保護資料 → 用 `tuple`**

如果你願意，我也可以順便補充 `list`、`tuple` 跟 `set` 的差別，這三個很常一起比較。

✔ 請輸入你的問題： 現在幾點幾分？

[由 班導師 回答]
現在台灣時間是 **下午 1:42:07**。

✔ 請輸入你的問題： EXIT
再會~

```