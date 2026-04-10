"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

type Meal = {
  id: string;
  name: string;
  nameZh: string;
  category: string;
  categoryZh: string;
  area: string;
  areaZh: string;
  imageUrl: string | null;
  tags: string[];
  tagsZh: string[];
  instructions: string[];
  instructionsZh: string[];
  ingredients: Array<{
    ingredient: string;
    ingredientZh: string;
    measure: string;
  }>;
  youtubeUrl: string | null;
  sourceUrl: string | null;
};

const quickSearches = ["阿拉比亚塔意面", "鸡肉", "牛肉", "意面", "海鲜"];

function shortenInstructions(steps: string[]) {
  return steps.slice(0, 4);
}

export default function CookingLibrary() {
  const [query, setQuery] = useState("Arrabiata");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function performSearch(nextQuery: string) {
    const normalizedQuery = nextQuery.trim();
    if (!normalizedQuery) {
      setError("请输入要搜索的菜名。");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/cooking/search?q=${encodeURIComponent(normalizedQuery)}`);
      const data = (await response.json()) as { meals?: Meal[]; message?: string };

      if (!response.ok) {
        setError(data.message ?? "搜索菜谱失败，请稍后再试。");
        setMeals([]);
        return;
      }

      setMeals(data.meals ?? []);
      setSearchedQuery(normalizedQuery);
    } catch {
      setError("搜索失败，请检查网络连接后重试。");
      setMeals([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await performSearch(query);
  }

  return (
    <div className="space-y-6">
      <section className="premium-panel rounded-[28px] p-6 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-[var(--gold)]">Recipe Search</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            搜索你想做的菜
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base">
            通过 TheMealDB 免费接口搜索菜品，页面会展示图片、配料、步骤和外部参考链接，适合作为菜谱功能的第一版入口。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索菜名，比如 阿拉比亚塔意面、鸡肉、牛肉、海鲜"
            className="h-13 flex-1 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.18)] px-5 text-base text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[rgba(214,179,106,0.4)] focus:ring-4 focus:ring-[rgba(214,179,106,0.12)]"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-13 items-center justify-center rounded-2xl bg-[var(--gold)] px-6 text-sm font-semibold text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "搜索中..." : "搜索菜谱"}
          </button>
        </form>

        <div className="mt-5 flex flex-wrap gap-3">
          {quickSearches.map((keyword) => (
            <button
              key={keyword}
              type="button"
              onClick={() => {
                setQuery(keyword);
                void performSearch(keyword);
              }}
              className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-2 text-sm font-medium text-[var(--muted)] transition hover:border-[rgba(214,179,106,0.26)] hover:text-[var(--gold)]"
            >
              {keyword}
            </button>
          ))}
        </div>
      </section>

      <section className="premium-panel rounded-[28px] p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--gold)]">Recipe Result</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              {searchedQuery ? `“${searchedQuery}” 的菜谱结果` : "等待搜索"}
            </h3>
          </div>
          <p className="text-sm text-[var(--muted)]">
            {loading ? "正在拉取菜谱..." : meals.length > 0 ? `共找到 ${meals.length} 道菜` : "输入菜名开始搜索"}
          </p>
        </div>

        {error ? (
          <div className="mt-5 rounded-[22px] border border-[rgba(214,179,106,0.18)] bg-[rgba(214,179,106,0.08)] p-4 text-sm text-[var(--gold)]">
            {error}
          </div>
        ) : null}

        {!error && meals.length === 0 ? (
          <div className="mt-5 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-8 text-[var(--muted)]">
            {loading
              ? "正在搜索菜谱，请稍候..."
              : "还没有搜索结果。你可以先试试上面的快捷搜索，或者输入一道想做的菜。"}
          </div>
        ) : null}

        {meals.length > 0 ? (
          <div className="mt-6 grid gap-5">
            {meals.map((meal) => (
              <article
                key={meal.id}
                className="grid gap-5 rounded-[26px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.28)] lg:grid-cols-[220px_1fr]"
              >
                <div className="overflow-hidden rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]">
                  {meal.imageUrl ? (
                    <Image
                      src={meal.imageUrl}
                      alt={meal.name}
                      width={440}
                      height={440}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full min-h-[220px] items-center justify-center bg-[linear-gradient(180deg,rgba(214,179,106,0.12)_0%,rgba(255,255,255,0.03)_100%)] px-6 text-center text-sm font-medium leading-7 text-[var(--gold)]">
                      暂无图片
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-[var(--gold)]">Recipe</p>
                      <h4 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                        {meal.nameZh || meal.name}
                      </h4>
                      <p className="mt-3 text-base text-[var(--muted)]">
                        {meal.areaZh || meal.area} · {meal.categoryZh || meal.category}
                      </p>
                      {(meal.nameZh || meal.categoryZh || meal.areaZh) ? (
                        <p className="mt-2 text-sm text-[rgba(245,245,242,0.48)]">
                          {meal.name} · {meal.area} · {meal.category}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {meal.youtubeUrl ? (
                        <a
                          href={meal.youtubeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-11 items-center justify-center rounded-2xl bg-[var(--gold)] px-5 text-sm font-medium text-black transition hover:brightness-105"
                        >
                          看视频
                        </a>
                      ) : null}
                      {meal.sourceUrl ? (
                        <a
                          href={meal.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-11 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-5 text-sm font-medium text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.24)] hover:text-[var(--gold)]"
                        >
                          查看原始菜谱
                        </a>
                      ) : null}
                    </div>
                  </div>

                  {meal.tagsZh.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {meal.tagsZh.map((tag, index) => (
                        <span
                          key={`${meal.id}-${tag}-${index}`}
                          className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-1 text-xs font-medium text-[var(--muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-6 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
                    <div className="rounded-[22px] border border-[rgba(214,179,106,0.14)] bg-[rgba(214,179,106,0.06)] p-5">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">食材清单</p>
                      <ul className="mt-4 space-y-2 text-sm leading-7 text-[rgba(245,245,242,0.82)]">
                        {meal.ingredients.map((item, index) => (
                          <li key={`${meal.id}-${item.ingredient}-${index}`}>
                            {item.measure ? `${item.measure} ` : ""}
                            {item.ingredientZh}
                            {item.ingredientZh !== item.ingredient ? `（${item.ingredient}）` : ""}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">做法步骤</p>
                      <div className="mt-4 space-y-3 text-sm leading-7 text-[rgba(245,245,242,0.82)]">
                        {shortenInstructions(meal.instructionsZh).map((step, index) => (
                          <div key={`${meal.id}-step-${index}`} className="space-y-1">
                            <p>
                              {index + 1}. {step}
                            </p>
                            {meal.instructions[index] ? (
                              <p className="text-xs leading-6 text-[rgba(245,245,242,0.48)]">{meal.instructions[index]}</p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
