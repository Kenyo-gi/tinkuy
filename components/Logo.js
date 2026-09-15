export default function Logo({ size = "md" }) {
  const isSmall = size === "sm";
  const markSize = isSmall ? "w-8 h-8 text-sm" : "w-10 h-10 text-lg";
  const wordSize = isSmall ? "text-sm" : "text-lg";

  return (
    <span className="inline-flex items-center gap-2">
      <span className={`${markSize} rounded-xl bg-zinc-900 border-2 border-blue-600 text-white font-extrabold flex items-center justify-center`}>T</span>
      <span className={`${wordSize} font-extrabold tracking-wide text-zinc-900`}>TINKUY</span>
    </span>
  );
}
