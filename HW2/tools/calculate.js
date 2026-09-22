import { z } from "zod";
import { defineTool } from "../utils/func-tool.js";

// 1. 撰寫計算函式，接收帶有 expression 的物件
function calculateExpression({ expression }) {
  try {
    // 使用 eval 進行簡單的數學運算
    const result = eval(expression);
    return String(result);
  } catch (error) {
    return "計算錯誤，請檢查算式格式";
  }
}

// 2. 用 defineTool 定義工具並匯出
export const calculateTool = defineTool({
  name: "calculate",
  description: "進行數學計算",
  fn: calculateExpression,
  parameters: z.object({
    expression: z.string().describe("要計算的數學表達式，例如 '10 + 5 * 2'"),
  }),
});
