import { useEffect, useState } from 'react';
import { Activity, Server, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { SystemHealth } from '../types';

interface DiagnosticsBarProps {
  health: SystemHealth;
  onRefreshPing: () => void;
}

export function DiagnosticsBar({ health, onRefreshPing }: DiagnosticsBarProps) {
  const [isPinging, setIsPinging] = useState(false);

  const handlePing = () => {
    setIsPinging(true);
    onRefreshPing();
    setTimeout(() => setIsPinging(false), 400);
  };

  return (
    <div id="diagnostics-bar" className="w-full bg-slate-900 border-b border-slate-800 text-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            {health.serverStatus === 'online' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                health.serverStatus === 'online'
                  ? 'bg-emerald-500'
                  : health.serverStatus === 'degraded'
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
            ></span>
          </span>
          <span className="font-semibold tracking-wide text-slate-100 uppercase">
            {health.serverStatus === 'online' ? 'Dev Server Active' : health.serverStatus}
          </span>
        </div>

        <span className="text-slate-600">|</span>

        <div className="flex items-center gap-1 text-slate-400">
          <Server className="w-3.5 h-3.5 text-indigo-400" />
          <span>Port: <strong className="text-slate-200">{health.port}</strong> (Ingress 0.0.0.0)</span>
        </div>

        <span className="text-slate-600 hidden sm:inline">|</span>

        <div className="hidden sm:flex items-center gap-1 text-slate-400">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Transport: <strong className="text-slate-200">{health.transport}</strong></span>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <div className="flex items-center gap-1.5">
          {health.serverStatus === 'online' ? (
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-rose-400" />
          )}
          <span>
            Round-Trip Latency:{' '}
            <span className="text-emerald-400 font-bold">
              {health.pingMs !== null ? `${health.pingMs} ms` : 'Testing...'}
            </span>
          </span>
        </div>

        <button
          id="btn-refresh-ping"
          onClick={handlePing}
          title="Measure Gateway RTT Latency"
          className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded transition-colors border border-slate-700 disabled:opacity-50"
          disabled={isPinging}
        >
          <RefreshCw className={`w-3 h-3 ${isPinging ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Ping Gateway</span>
        </button>
      </div>
    </div>
  );
}
