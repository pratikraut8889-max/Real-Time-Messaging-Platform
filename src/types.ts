export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  ciphertext: string;
  plaintext: string;
  timestamp: number;
  status: MessageStatus;
  encryptionNonce: string;
}

export interface SystemHealth {
  serverStatus: 'online' | 'degraded' | 'offline';
  port: number;
  pingMs: number | null;
  uptimeSeconds: number;
  activeSockets: number;
  transport: 'WebSocket' | 'Polling' | 'Direct HTTP';
  lastPingTimestamp: number | null;
}

export interface ArchitectureConfig {
  topology: 'direct' | 'group' | 'hybrid';
  encryption: 'e2ee-ratchet' | 'tls-at-rest' | 'hybrid-envelope';
  database: 'redis-memory' | 'postgres-drizzle' | 'firestore-cloud';
  authMethod: 'jwt-refresh' | 'phone-otp' | 'session-cookie';
  fanoutStrategy: 'redis-pubsub' | 'kafka-cluster' | 'in-process';
}
