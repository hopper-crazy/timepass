import { Wifi, WifiOff } from "lucide-react";

export default function ConnectionStatus({ status }) {
  const connected = status === "connected";

  return (
    <div
      className={`flex items-center gap-2 text-xs font-medium ${
        connected ? "text-emerald-700" : "text-red-700"
      }`}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-md ${
          connected ? "bg-emerald-50" : "bg-red-50"
        }`}
      >
        {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
      </span>

      <div className="hidden sm:block">
        <div className="text-[10px] uppercase tracking-wider text-slate-400">
          Backend
        </div>

        <div>{connected ? "Connected" : "Disconnected"}</div>
      </div>
    </div>
  );
}
