import { searchCoffee } from "../lib/qdrant.js";

async function testSearch() {
  const queries = [
    "請問哪一種咖啡奶泡最多、味道最濃？",
    "有沒有適合夏天喝、冰涼又沒什麼苦味的咖啡？",
    "我想喝帶有巧克力風味的咖啡"
  ];

  for (const query of queries) {
    console.log(`\n==============================`);
    console.log(`🔍 搜尋問法：${query}`);
    console.log(`==============================`);

    const results = await searchCoffee(query, 2); // 取前 2 個最相關的結果

    results.forEach((item, index) => {
      console.log(`[結果 ${index + 1}]`);
      console.log(`- 名稱：${item.name}`);
      console.log(`- 相似度分數 (Score)：${item.score}`);
      console.log(`- 說明：${item.description}`);
    });
  }
}

testSearch().catch((err) => {
  console.error("搜尋測試失敗：", err);
});