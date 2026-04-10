import ReadingDetail from "./ReadingDetail";

export default async function ReadingDetailPage(props: PageProps<"/reading/[workId]">) {
  const { workId } = await props.params;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(214,179,106,0.1),transparent_22%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_20%),linear-gradient(180deg,#050505_0%,#09090b_100%)]">
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 sm:px-6 sm:py-10">
        <div className="premium-panel rounded-[32px] p-8">
          <ReadingDetail workId={workId} />
        </div>
      </section>
    </main>
  );
}
