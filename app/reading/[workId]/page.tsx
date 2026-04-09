import ReadingDetail from "./ReadingDetail";

export default async function ReadingDetailPage(props: PageProps<"/reading/[workId]">) {
  const { workId } = await props.params;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(52,211,153,0.2),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(125,211,252,0.18),_transparent_32%),linear-gradient(180deg,_#ecfeff_0%,_#ffffff_100%)]">
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 sm:px-6 sm:py-10">
        <div className="rounded-[32px] border border-emerald-200/70 bg-white/85 p-8 shadow-[0_30px_80px_rgba(15,118,110,0.08)] backdrop-blur">
          <ReadingDetail workId={workId} />
        </div>
      </section>
    </main>
  );
}
