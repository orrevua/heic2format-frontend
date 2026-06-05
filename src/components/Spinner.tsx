export default function Spinner() {
  return (
    <div role="status" className="flex justify-center items-center">
      <div className="relative w-10 h-10">
        <div
          className="absolute inset-0 rounded-full border-[3.5px] border-[var(--border)]"
          style={{ borderTopColor: "var(--tangerine)", animation: "spin-slow 0.7s linear infinite" }}
        />
        <div className="absolute inset-[6px] rounded-full bg-[var(--yellow)] border-[2.5px] border-[var(--border)]" />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
