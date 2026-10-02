import { useState, FormEvent } from 'react';
import { Send, Check, CheckCheck, Clock, Lock, Shield, ArrowRight, Eye, RefreshCw } from 'lucide-react';
import { ChatMessage, MessageStatus } from '../types';

export function MessageSimulator() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-001',
      senderId: 'alice',
      senderName: 'Alice (Client A)',
      recipientId: 'bob',
      ciphertext: '4f9a1b2c3d8e4f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a',
      plaintext: 'Architecture Phase 0: Gateway & WebSocket handshakes verified.',
      timestamp: Date.now() - 60000,
      status: 'read',
      encryptionNonce: '9f8e7d6c5b4a',
    },
    {
      id: 'msg-002',
      senderId: 'bob',
      senderName: 'Bob (Client B)',
      recipientId: 'alice',
      ciphertext: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      plaintext: 'Dev server running cleanly on port 3000. Ready for ACK protocol.',
      timestamp: Date.now() - 30000,
      status: 'delivered',
      encryptionNonce: '3c2b1a0f9e8d',
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'crypto'>('chat');
  const [selectedMsg, setSelectedMsg] = useState<ChatMessage | null>(messages[0]);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    // Generate random pseudo-nonce and hex ciphertext
    const nonce = Math.random().toString(16).substring(2, 14);
    const mockCipher = Array.from(inputVal)
      .map((char: string) => char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
      .padEnd(48, 'f');

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'alice',
      senderName: 'Alice (Client A)',
      recipientId: 'bob',
      ciphertext: mockCipher,
      plaintext: inputVal.trim(),
      timestamp: Date.now(),
      status: 'sent',
      encryptionNonce: nonce,
    };

    setMessages(prev => [...prev, newMsg]);
    setInputVal('');
    setSelectedMsg(newMsg);

    // Simulate WhatsApp state progression: Sent -> Delivered -> Read
    setTimeout(() => {
      setMessages(prev =>
        prev.map(m => (m.id === newMsg.id ? { ...m, status: 'delivered' } : m))
      );
    }, 1200);

    setTimeout(() => {
      setMessages(prev =>
        prev.map(m => (m.id === newMsg.id ? { ...m, status: 'read' } : m))
      );
    }, 2500);
  };

  const renderStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3.5 h-3.5 text-slate-400" title="Queued locally" />;
      case 'sent':
        return <Check className="w-3.5 h-3.5 text-slate-400" title="Sent to gateway (1 check)" />;
      case 'delivered':
        return <CheckCheck className="w-3.5 h-3.5 text-slate-400" title="Delivered to peer socket (2 gray checks)" />;
      case 'read':
        return <CheckCheck className="w-3.5 h-3.5 text-sky-400" title="Read by recipient (2 blue checks)" />;
      case 'failed':
        return <span className="text-xs text-rose-500 font-bold">!</span>;
    }
  };

  return (
    <div id="message-simulator-card" className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
      {/* Header */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/30">
            WA
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              WhatsApp-Scale Protocol Simulator
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800 font-mono">
                ACK Lifecycle
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">Channel: room_direct_alice_bob</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
          <button
            id="tab-btn-chat"
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'chat' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Chat View
          </button>
          <button
            id="tab-btn-crypto"
            onClick={() => setActiveTab('crypto')}
            className={`px-3 py-1 rounded-md flex items-center gap-1 transition-colors ${
              activeTab === 'crypto' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3 h-3 text-amber-400" />
            Payload / E2EE
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {activeTab === 'chat' ? (
          <div className="flex-1 flex flex-col bg-slate-950/60 p-4">
            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              <div className="text-center my-2">
                <span className="text-[11px] bg-slate-900 text-amber-400 px-3 py-1 rounded-full border border-amber-900/50 inline-flex items-center gap-1.5">
                  <Shield className="w-3 h-3" />
                  Messages simulated with AES-GCM / E2EE payload envelopes
                </span>
              </div>

              {messages.map(msg => {
                const isMe = msg.senderId === 'alice';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      onClick={() => setSelectedMsg(msg)}
                      className={`cursor-pointer max-w-[85%] sm:max-w-[70%] rounded-2xl px-3.5 py-2.5 shadow-sm transition-all hover:ring-2 hover:ring-indigo-500/50 ${
                        isMe
                          ? 'bg-emerald-900/40 text-emerald-50 border border-emerald-800/60 rounded-br-none'
                          : 'bg-slate-800/80 text-slate-100 border border-slate-700/70 rounded-bl-none'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400 mb-0.5 font-medium">
                        {msg.senderName}
                      </div>
                      <p className="text-sm leading-relaxed">{msg.plaintext}</p>
                      <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                        <span>
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {isMe && renderStatusIcon(msg.status)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-800">
              <input
                id="input-chat-message"
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Type a message to test WebSocket transmission & ACK states..."
                className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-500 placeholder-slate-500"
              />
              <button
                id="btn-send-message"
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                disabled={!inputVal.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col bg-slate-950 p-4 font-mono text-xs overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-slate-300">
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="font-semibold">Cryptographic Wire Inspector</span>
              </div>
              <span className="text-[11px] text-slate-500">Zero-Plaintext Server Policy</span>
            </div>

            {selectedMsg ? (
              <div className="space-y-4">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-1">Message ID & Envelope</span>
                  <p className="text-indigo-300">{selectedMsg.id}</p>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-1">AES-256-GCM / Ratchet Ciphertext (Over-The-Wire)</span>
                  <p className="text-rose-400 break-all bg-slate-950 p-2 rounded border border-rose-950">
                    {selectedMsg.ciphertext}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-1">IV / Nonce</span>
                    <p className="text-cyan-300">{selectedMsg.encryptionNonce}</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-1">Delivery ACK State</span>
                    <p className="text-emerald-400 font-bold uppercase">{selectedMsg.status}</p>
                  </div>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-1">Client-Side Decrypted Plaintext</span>
                  <p className="text-slate-200 bg-slate-950 p-2 rounded border border-slate-800">
                    {selectedMsg.plaintext}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500">Select a message to inspect its cryptographic envelope.</p>
            )}
          </div>
        )}

        {/* Sidebar Info */}
        <div className="w-full md:w-64 bg-slate-900/70 border-t md:border-t-0 md:border-l border-slate-800 p-4 flex flex-col justify-between text-xs">
          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-2">
              Receipt State Protocol
            </h4>
            <ul className="space-y-2 text-slate-400 font-mono text-[11px]">
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Pending (Local SQLite/IndexedDB)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-slate-400" />
                <span>Sent (Gateway Ingested)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Delivered (Peer Socket ACK)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Read (Viewport Focus ACK)</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
            Click any message bubble to load its encrypted envelope into the wire inspector.
          </div>
        </div>
      </div>
    </div>
  );
}
