import { client, DEFAULT_MODEL } from "./lib/openai.js";
import { spinner } from "./utils/spinner.js";
import { toOpenAITool } from "./utils/func-tool.js";
import * as allTools from "./tools/index.js";

const toolList = Object.values(allTools);
const tools = toolList.map(toOpenAITool);
const TOOLS_BY_NAME = Object.fromEntries(toolList.map((tool) => [tool.name, tool]));
const MAX_TOOL_ROUNDS = 8;

// 作業 4 測試問題：可以隨時切換這幾種情境來驗證
const history = [
  {
    role: "user",
    content: "現在幾點？台北天氣好嗎？", // 測試同時呼叫時間與天氣工具
  },
];

let completed = false;

for (let round = 1; round <= MAX_TOOL_ROUNDS; round += 1) {
  const spin = spinner("思考中...").start();

  const response = await client.responses.create({
    model: DEFAULT_MODEL,
    instructions: "你是一個聰明的助理，當使用者同時詢問多個不同面向的問題（例如時間與天氣）時，請務必同時呼叫對應的多個工具來取得資訊。",
    input: history,
    tools,
    tool_choice: "auto",
  });

  spin.stop();

  history.push(...response.output);

  const functionCalls = response.output.filter(
    (item) => item.type === "function_call",
  );

  if (functionCalls.length === 0) {
    console.log(response.output_text);
    completed = true;
    break;
  }

  for (const functionCall of functionCalls) {
    const fnName = functionCall.name;
    const tool = TOOLS_BY_NAME[fnName];
    if (!tool) {
      throw new Error(`模型要求了未註冊的工具：${fnName}`);
    }

    const args = tool.parameters.parse(JSON.parse(functionCall.arguments));
    console.log(`\n[呼叫 tool] ${fnName}(${JSON.stringify(args)})`);

    const result = await tool.fn(args);

    history.push({
      type: "function_call_output",
      call_id: functionCall.call_id,
      output: JSON.stringify(result),
    });
  }
}

if (!completed) {
  throw new Error(`Tool calling 超過 ${MAX_TOOL_ROUNDS} 輪，已停止執行`);
}