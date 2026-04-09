import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type MealDbMeal = {
  idMeal: string;
  strMeal?: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strMealThumb?: string;
  strTags?: string;
  strYoutube?: string;
  strSource?: string;
  [key: string]: string | undefined;
};

const queryAliases: Record<string, string> = {
  阿拉比亚塔: "Arrabiata",
  阿拉比亚塔意面: "Arrabiata",
  番茄辣味通心粉: "Arrabiata",
  鸡肉: "Chicken",
  牛肉: "Beef",
  猪肉: "Pork",
  羊肉: "Lamb",
  海鲜: "Seafood",
  意面: "Pasta",
  面食: "Pasta",
  咖喱: "Curry",
  早餐: "Breakfast",
  甜点: "Dessert",
  素食: "Vegetarian",
};

const titleTranslations: Record<string, string> = {
  "Spicy Arrabiata Penne": "香辣阿拉比亚塔通心粉",
  "Chicken Handi": "手抓鸡肉咖喱",
  "Beef and Mustard Pie": "芥末牛肉派",
  "Tandoori chicken": "坦都里烤鸡",
  "Corba": "土耳其浓汤",
  "Kapsalon": "荷兰烤肉薯条拼盘",
};

const categoryTranslations: Record<string, string> = {
  Beef: "牛肉",
  Chicken: "鸡肉",
  Dessert: "甜点",
  Lamb: "羊肉",
  Miscellaneous: "其他",
  Pasta: "意面",
  Pork: "猪肉",
  Seafood: "海鲜",
  Side: "配菜",
  Starter: "前菜",
  Vegan: "纯素",
  Vegetarian: "素食",
  Breakfast: "早餐",
  Goat: "山羊肉",
};

const areaTranslations: Record<string, string> = {
  American: "美式",
  British: "英式",
  Canadian: "加拿大",
  Chinese: "中式",
  Croatian: "克罗地亚",
  Dutch: "荷兰",
  Egyptian: "埃及",
  Filipino: "菲律宾",
  French: "法式",
  Greek: "希腊",
  Indian: "印度",
  Irish: "爱尔兰",
  Italian: "意式",
  Jamaican: "牙买加",
  Japanese: "日式",
  Kenyan: "肯尼亚",
  Malaysian: "马来西亚",
  Mexican: "墨西哥",
  Moroccan: "摩洛哥",
  Polish: "波兰",
  Portuguese: "葡萄牙",
  Russian: "俄罗斯",
  Spanish: "西班牙",
  Thai: "泰式",
  Tunisian: "突尼斯",
  Turkish: "土耳其",
  Unknown: "未知地区",
  Vietnamese: "越南",
};

const tagTranslations: Record<string, string> = {
  Pasta: "意面",
  Curry: "咖喱",
  Meat: "肉类",
  Spicy: "辣味",
  Vegetarian: "素食",
  Dessert: "甜点",
  Breakfast: "早餐",
  SideDish: "配菜",
};

const ingredientTranslations: Record<string, string> = {
  "penne rigate": "斜管通心粉",
  "olive oil": "橄榄油",
  garlic: "大蒜",
  "chopped tomatoes": "番茄碎",
  "red chilli flakes": "辣椒碎",
  "italian seasoning": "意式香料",
  basil: "罗勒",
  "Parmigiano-Reggiano": "帕玛森干酪",
  chicken: "鸡肉",
  beef: "牛肉",
  pork: "猪肉",
  lamb: "羊肉",
  onion: "洋葱",
  tomato: "番茄",
  tomatoes: "番茄",
  potato: "土豆",
  potatoes: "土豆",
  carrot: "胡萝卜",
  rice: "米饭",
  butter: "黄油",
  milk: "牛奶",
  flour: "面粉",
  egg: "鸡蛋",
  eggs: "鸡蛋",
  sugar: "糖",
  salt: "盐",
  pepper: "黑胡椒",
  parsley: "欧芹",
  cheese: "奶酪",
  cream: "奶油",
  paprika: "红椒粉",
  cumin: "孜然",
  coriander: "香菜籽",
  ginger: "姜",
  chilli: "辣椒",
  mushroom: "蘑菇",
  mushrooms: "蘑菇",
  spinach: "菠菜",
  lemon: "柠檬",
  lime: "青柠",
  coconut: "椰子",
};

const phraseTranslations: Array<[string, string]> = [
  ["Bring a large pot of water to a boil.", "准备一大锅水并煮沸。"],
  ["Add kosher salt to the boiling water, then add the pasta.", "在沸水中加入盐，再下入意面。"],
  ["Cook according to the package instructions", "按照包装说明煮至合适熟度"],
  ["In a large skillet over medium-high heat", "取一只大平底锅，用中大火加热"],
  ["add the olive oil", "加入橄榄油"],
  ["heat until the oil starts to shimmer", "加热到油微微发亮"],
  ["Add the garlic and cook, stirring, until fragrant", "加入蒜末翻炒至出香味"],
  ["Add the chopped tomatoes", "加入番茄碎"],
  ["Bring to a boil and cook for", "煮沸后继续烹煮"],
  ["Remove from the heat", "离火"],
  ["Drain the pasta and add it to the sauce.", "将意面沥干后拌入酱汁。"],
  ["Garnish with", "最后撒上"],
  ["serve warm", "趁热食用"],
];

async function translateBatch(texts: string[]) {
  const normalizedTexts = texts.map((text) => trimText(text));

  if (normalizedTexts.length === 0) {
    return [];
  }

  const joined = normalizedTexts.join("\n|||\n");

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(joined)}&langpair=en|zh-CN`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return normalizedTexts;
    }

    const data = (await response.json()) as {
      responseData?: {
        translatedText?: string;
      };
    };

    const translated = data.responseData?.translatedText
      ?.split("\n|||\n")
      .map((item) => item.trim());

    if (!translated || translated.length !== normalizedTexts.length) {
      return normalizedTexts;
    }

    return translated;
  } catch {
    return normalizedTexts;
  }
}

async function translateSingle(text: string) {
  const [translated] = await translateBatch([text]);
  return translated ?? text;
}

async function translateInstructionText(step: string) {
  const trimmed = trimText(step);
  if (!trimmed) {
    return trimmed;
  }

  const sentences = trimmed
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length <= 1) {
    return translateSingle(trimmed);
  }

  const translatedSentences = await translateBatch(sentences);
  return translatedSentences.join(" ");
}

function normalizeQuery(query: string) {
  const trimmed = query.trim();
  if (queryAliases[trimmed]) {
    return queryAliases[trimmed];
  }

  const aliasEntry = Object.entries(queryAliases).find(([key]) => trimmed.includes(key));
  return aliasEntry ? aliasEntry[1] : trimmed;
}

function translateValue(
  value: string,
  dictionary: Record<string, string>,
  fallbackPrefix?: string
) {
  const trimmed = trimText(value);
  if (!trimmed) {
    return "";
  }

  const direct = dictionary[trimmed];
  if (direct) {
    return direct;
  }

  const lower = trimmed.toLowerCase();
  const partialEntry = Object.entries(dictionary).find(([key]) => lower.includes(key.toLowerCase()));
  if (partialEntry) {
    return fallbackPrefix ? `${partialEntry[1]}（${trimmed}）` : partialEntry[1];
  }

  return fallbackPrefix ? `${fallbackPrefix}（${trimmed}）` : trimmed;
}

function translateInstruction(step: string) {
  let translated = trimText(step);

  for (const [source, target] of phraseTranslations) {
    const pattern = new RegExp(source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    translated = translated.replace(pattern, target);
  }

  translated = Object.entries(ingredientTranslations).reduce((current, [source, target]) => {
    const pattern = new RegExp(`\\b${source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    return current.replace(pattern, target);
  }, translated);

  return translated;
}

function trimText(value: string | undefined) {
  return value?.trim() ?? "";
}

function extractIngredients(meal: MealDbMeal) {
  const ingredients: Array<{ ingredient: string; ingredientZh: string; measure: string }> = [];

  for (let index = 1; index <= 20; index += 1) {
    const ingredient = trimText(meal[`strIngredient${index}`]);
    const measure = trimText(meal[`strMeasure${index}`]);

    if (!ingredient) {
      continue;
    }

    ingredients.push({
      ingredient,
      ingredientZh: translateValue(ingredient, ingredientTranslations, "食材"),
      measure,
    });
  }

  return ingredients;
}

function splitInstructions(text: string) {
  return text
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ message: "请提供要搜索的菜名。" }, { status: 400 });
  }

  const normalizedQuery = normalizeQuery(query);

  let response: Response;

  try {
    response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(normalizedQuery)}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(12000),
      }
    );
  } catch {
    return NextResponse.json(
      { message: "菜谱服务连接超时，请稍后重试。" },
      { status: 502 }
    );
  }

  if (!response.ok) {
    return NextResponse.json({ message: "菜谱接口暂时不可用，请稍后再试。" }, { status: 502 });
  }

  const data = (await response.json()) as { meals?: MealDbMeal[] | null };
  const meals = await Promise.all(
    (data.meals ?? []).map(async (meal) => {
      const name = trimText(meal.strMeal) || "未命名菜谱";
      const category = trimText(meal.strCategory) || "未分类";
      const area = trimText(meal.strArea) || "未知地区";
      const tags = trimText(meal.strTags)
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      const instructions = splitInstructions(trimText(meal.strInstructions));
      const ingredients = extractIngredients(meal);

      const [translatedMeta, translatedTags, translatedIngredients, translatedInstructionPreview] =
        await Promise.all([
          translateBatch([name, category, area]),
          translateBatch(tags),
          translateBatch(ingredients.map((item) => item.ingredient)),
          Promise.all(instructions.slice(0, 4).map((step) => translateInstructionText(step))),
        ]);

      const [translatedName, translatedCategory, translatedArea] = translatedMeta;

      return {
        id: meal.idMeal,
        name,
        nameZh:
          translatedName && translatedName !== name
            ? translatedName
            : translateValue(name, titleTranslations, "菜谱"),
        category,
        categoryZh: translateValue(category, categoryTranslations, translatedCategory),
        area,
        areaZh: translateValue(area, areaTranslations, translatedArea),
        imageUrl: trimText(meal.strMealThumb) || null,
        tags,
        tagsZh: tags.map((tag, index) => {
          const translated = translatedTags[index];
          return translated && translated !== tag
            ? translated
            : translateValue(tag, tagTranslations);
        }),
        instructions,
        instructionsZh: instructions.map((step, index) => {
          const translated = translatedInstructionPreview[index];
          if (translated && translated !== step) {
            return translated;
          }
          return translateInstruction(step);
        }),
        ingredients: ingredients.map((item, index) => {
          const translated = translatedIngredients[index];
          return {
            ...item,
            ingredientZh:
              translated && translated !== item.ingredient
                ? translated
                : item.ingredientZh,
          };
        }),
        youtubeUrl: trimText(meal.strYoutube) || null,
        sourceUrl: trimText(meal.strSource) || null,
      };
    })
  );

  return NextResponse.json({
    query,
    meals,
  });
}
