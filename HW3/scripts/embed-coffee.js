import { qdrant, COFFEE_COLLECTION, EMBEDDING_DIM, embed } from "../lib/qdrant.js";

// 準備 8 筆豐富的咖啡知識內容
const coffees = [
  {
    id: 1,
    name: "美式咖啡 (Americano)",
    description: "由義式濃縮咖啡加入大量熱水稀釋而成，口感較為清爽，帶有淡淡的咖啡香氣與微苦滋味，適合喜歡順口、大容量咖啡的人。"
  },
  {
    id: 2,
    name: "拿鐵 (Latte)",
    description: "義式濃縮咖啡加上大量的熱牛奶，並在頂部鋪上一層薄薄的綿密奶泡。口感溫潤滑順，奶香與咖啡香完美融合。"
  },
  {
    id: 3,
    name: "卡布奇諾 (Cappuccino)",
    description: "由等比例的義式濃縮咖啡、熱牛奶與厚實綿密的奶泡組成。風味較拿鐵濃厚，能品嘗到強烈的咖啡苦甜與奶泡口感。"
  },
  {
    id: 4,
    name: "摩卡 (Mocha)",
    description: "結合了義式濃縮咖啡、香濃巧克力醬與熱牛奶，通常最後會擠上鮮奶油或撒上可可粉。風味香甜濃郁，帶有豐富的巧克力層次。"
  },
  {
    id: 5,
    name: "義式濃縮 (Espresso)",
    description: "透過高壓高溫在短時間內快速萃取出的極濃咖啡，分量少但口感強烈、香氣撲鼻，表面帶有一層金黃色的乳化油脂 crema。"
  },
  {
    id: 6,
    name: "焦糖瑪奇朵 (Caramel Macchiato)",
    description: "在香濃熱牛奶與義式濃縮咖啡中加入香草糖漿，最後在奶泡上畫上漂亮的焦糖網格。口感層次豐富，帶有甜美的焦糖香氣。"
  },
  {
    id: 7,
    name: "冷萃咖啡 (Cold Brew)",
    description: "使用常溫水或冷水經過 12 到 24 小時長時間低溫浸泡萃取而成的咖啡。口感滑順、酸度極低且幾乎沒有苦澀味。"
  },
  {
    id: 8,
    name: "手沖咖啡 (Pour Over)",
    description: "將熱水緩慢倒在濾紙內的咖啡粉上進行過濾萃取。能完美呈現單品咖啡豆獨特的花香、果香或明亮酸值，風味最為純粹乾淨。"
  }
];

async function main() {
  console.log("正在檢查或建立 Qdrant Collection...");
  
  // 檢查 collection 是否存在，不存在則建立
  const collections = await qdrant.getCollections();
  const exists = collections.collections.some((c) => c.name === COFFEE_COLLECTION);

  if (!exists) {
    await qdrant.createCollection(COFFEE_COLLECTION, {
      vectors: {
        size: EMBEDDING_DIM,
        distance: "Cosine",
      },
    });
    console.log(`已成功建立 Collection: ${COFFEE_COLLECTION}`);
  } else {
    console.log(`Collection ${COFFEE_COLLECTION} 已存在`);
  }

  console.log("正在將咖啡資料轉為向量並上傳...");

  const points = [];
  for (const item of coffees) {
    // 將名稱與描述組合成一段文字進行 embedding
    const textToEmbed = `${item.name}: ${item.description}`;
    const vector = await embed(textToEmbed);

    points.push({
      id: item.id,
      vector,
      payload: {
        name: item.name,
        description: item.description,
      },
    });
  }

  // 批次上傳到 Qdrant
  await qdrant.upsert(COFFEE_COLLECTION, {
    points,
  });

  console.log("🎉 所有咖啡資料已成功灌入 Qdrant 知識庫！");
}

main().catch((err) => {
  console.error("執行失敗：", err);
});