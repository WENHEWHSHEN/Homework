# AI Agent 實作工作坊 v8（JavaScript 版）

by eddie@5xcampus.com

這個 repo 以 Git 分支保存每一個教學進度。切到教材對應的
分支後，開啟 GitHub Codespaces 即可直接使用 Node.js 22。

```
@WENHEWHSHEN ➜ /workspaces/Homework/HW4 (main) $ node function_call.js

[呼叫 tool] get_current_time({})
現在是台灣時間 **下午 4:45**。
@WENHEWHSHEN ➜ /workspaces/Homework/HW4 (main) $ node function_call.js

[呼叫 tool] get_weather({"city":"Taipei"})
台北目前天氣晴朗，氣溫約 **28.6°C**，相對濕度約 **38%**。
@WENHEWHSHEN ➜ /workspaces/Homework/HW4 (main) $ node function_call.js

[呼叫 tool] get_current_time({})

[呼叫 tool] get_weather({"city":"Taipei"})
現在是台灣時間 **2026 年 9 月 22 日下午 4:46**。

台北目前天氣不錯，**晴天、約 28.6°C，濕度 38%**。
```