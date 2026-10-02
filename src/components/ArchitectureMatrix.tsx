import { useState } from 'react';
import { Shield, Database, Cpu, Users, Radio, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import { ArchitectureConfig } from '../types';

export function ArchitectureMatrix() {
  const [config, setConfig] = useState<ArchitectureConfig>({
    topology: 'direct',
    encryption: 'e2ee-ratchet',
    database: 'postgres-drizzle',
    authMethod: 'jwt-refresh',
    fanoutStrategy: 'redis-pubsub',
  });

  return (
    <div id="architecture-matrix-card" className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            Phase 0: Architectural Decision & Trade-Off Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure system parameters before approving Phase 1 core infrastructure code.
          </p>
        </div>
        <span className="text-xs bg-indigo-950 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-800 font-mono">
          Phase 0 Review
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Topology */}
        <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800">
          <div className="flex items-center gap-2 text-slate-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>1. Conversation Topology</span>
          </div>
          <div className="space-y-2 text-xs">
            <label className="flex items-start gap-2 cursor-pointer p-2 rounded hover:bg-slate-900 border border-slate-800/80">
              <input
                type="radio"
                name="topology"
                checked={config.topology === 'direct'}
                onChange={() => setConfig({ ...config, topology: 'direct' })}
                className="mt-0.5 accent-emerald-500"
              />
              <div>
                <strong className="text-slate-200 block">1-on-1 Direct Messaging</strong>
                <span className="text-slate-400 text-[11px]">Strict two-party ratchet sessions with lowest message fanout overhead.</span>
              </div>
            </label>
            <label className="flex items-start gap-2 cursor-pointer p-2 rounded hover:bg-slate-900 border border-slate-800/80">
              <input
                type="radio"
                name="topology"
                checked={config.topology === 'hybrid'}
                onChange={() => setConfig({ ...config, topology: 'hybrid' })}
                className="mt-0.5 accent-emerald-500"
              />
              <div>
                <strong className="text-slate-200 block">Hybrid (1-on-1 + Group Channels)</strong>
                <span className="text-slate-400 text-[11px]">Sender-Keys protocol or server-side fanout for groups up to 1,024 members.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Cryptography */}
        <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800">
          <div className="flex items-center gap-2 text-slate-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>2. Cryptographic Security Model</span>
          </div>
          <div className="space-y-2 text-xs">
            <label className="flex items-start gap-2 cursor-pointer p-2 rounded hover:bg-slate-900 border border-slate-800/80">
              <input
                type="radio"
                name="encryption"
                checked={config.encryption === 'e2ee-ratchet'}
                onChange={() => setConfig({ ...config, encryption: 'e2ee-ratchet' })}
                className="mt-0.5 accent-amber-500"
              />
              <div>
                <strong className="text-slate-200 block">E2EE Double Ratchet (Signal-grade)</strong>
                <span className="text-slate-400 text-[11px]">Zero server-side plaintext access. Forward secrecy & post-compromise security.</span>
              </div>
            </label>
            <label className="flex items-start gap-2 cursor-pointer p-2 rounded hover:bg-slate-900 border border-slate-800/80">
              <input
                type="radio"
                name="encryption"
                checked={config.encryption === 'tls-at-rest'}
                onChange={() => setConfig({ ...config, encryption: 'tls-at-rest' })}
                className="mt-0.5 accent-amber-500"
              />
              <div>
                <strong className="text-slate-200 block">WSS Transport + Encrypted-at-Rest</strong>
                <span className="text-slate-400 text-[11px]">Enables server-side full-text search, moderation, and lightweight clients.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Database */}
        <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800">
          <div className="flex items-center gap-2 text-slate-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>3. Persistence & Ingestion Layer</span>
          </div>
          <div className="space-y-2 text-xs">
            <label className="flex items-start gap-2 cursor-pointer p-2 rounded hover:bg-slate-900 border border-slate-800/80">
              <input
                type="radio"
                name="database"
                checked={config.database === 'postgres-drizzle'}
                onChange={() => setConfig({ ...config, database: 'postgres-drizzle' })}
                className="mt-0.5 accent-cyan-500"
              />
              <div>
                <strong className="text-slate-200 block">PostgreSQL + Redis Ring Cache</strong>
                <span className="text-slate-400 text-[11px]">ACID durability for messages, Redis for session presence and ephemeral queues.</span>
              </div>
            </label>
            <label className="flex items-start gap-2 cursor-pointer p-2 rounded hover:bg-slate-900 border border-slate-800/80">
              <input
                type="radio"
                name="database"
                checked={config.database === 'redis-memory'}
                onChange={() => setConfig({ ...config, database: 'redis-memory' })}
                className="mt-0.5 accent-cyan-500"
              />
              <div>
                <strong className="text-slate-200 block">High-Throughput In-Memory Gateway</strong>
                <span className="text-slate-400 text-[11px]">Zero cold-start overhead, ideal for stateless ephemeral microservices.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Scaling / Fanout */}
        <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800">
          <div className="flex items-center gap-2 text-slate-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <Radio className="w-3.5 h-3.5 text-indigo-400" />
            <span>4. Horizontal Scale & Cluster Fanout</span>
          </div>
          <div className="space-y-2 text-xs">
            <label className="flex items-start gap-2 cursor-pointer p-2 rounded hover:bg-slate-900 border border-slate-800/80">
              <input
                type="radio"
                name="fanoutStrategy"
                checked={config.fanoutStrategy === 'redis-pubsub'}
                onChange={() => setConfig({ ...config, fanoutStrategy: 'redis-pubsub' })}
                className="mt-0.5 accent-indigo-500"
              />
              <div>
                <strong className="text-slate-200 block">Socket.IO Redis Pub/Sub Adapter</strong>
                <span className="text-slate-400 text-[11px]">Transparent cross-node socket broadcasting across multi-container instances.</span>
              </div>
            </label>
            <label className="flex items-start gap-2 cursor-pointer p-2 rounded hover:bg-slate-900 border border-slate-800/80">
              <input
                type="radio"
                name="fanoutStrategy"
                checked={config.fanoutStrategy === 'in-process'}
                onChange={() => setConfig({ ...config, fanoutStrategy: 'in-process' })}
                className="mt-0.5 accent-indigo-500"
              />
              <div>
                <strong className="text-slate-200 block">Single-Node Unified Event Loop</strong>
                <span className="text-slate-400 text-[11px]">Low resource footprint on single container with zero external network hops.</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Trade-off Advisory Box */}
      <div className="mt-4 bg-amber-950/30 border border-amber-900/60 rounded-lg p-3 text-xs flex items-start gap-2.5 text-amber-200">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-semibold">Architectural Advisory:</strong>
          {config.encryption === 'e2ee-ratchet' ? (
            <p className="text-amber-200/90 mt-0.5">
              Double Ratchet E2EE enforces zero-knowledge architecture. Server cannot inspect message payloads for push notifications or server-side query filters. Clients must maintain IndexedDB cryptographic key stores.
            </p>
          ) : (
            <p className="text-amber-200/90 mt-0.5">
              Transport-only encryption allows server-side search indexing and content moderation, but requires rigorous database-at-rest encryption and DB access isolation.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
