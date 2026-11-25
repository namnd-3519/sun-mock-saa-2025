// Live board skeleton while the server loads kudos (MoMorph MaZUn5xHXZ loading state).
const block = "animate-pulse rounded-2xl bg-white/10";

export default function KudosLoading() {
  return (
    <main aria-busy="true" className="mx-auto flex w-full max-w-[1152px] flex-1 flex-col gap-16 px-4 pt-32 pb-24 md:px-10 lg:px-0">
      <div className={`${block} h-40 w-full max-w-[593px]`} />
      <div className={`${block} h-[72px] w-full`} />
      <div className="flex gap-6 overflow-hidden">
        {[0, 1, 2].map((index) => (
          <div key={index} className={`${block} h-[525px] w-[528px] shrink-0`} />
        ))}
      </div>
      <div className="flex flex-col gap-6 lg:w-[680px]">
        {[0, 1].map((index) => (
          <div key={index} className={`${block} h-[400px] w-full rounded-3xl`} />
        ))}
      </div>
    </main>
  );
}
