'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Message = {
  id: string;
  sender_type: 'customer' | 'ai' | 'human' | 'system';
  content: string;
  created_at: string | null;
};

type Conversation = {
  id: string;
  customer_phone: string;
  source: string | null;
  status: string | null;
  last_message_at: string | null;
  messages?: Message[];
};

function PortalConversationsContent() {
  const searchParams = useSearchParams();
  const businessId = useMemo(() => searchParams.get('businessId') ?? '', [searchParams]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (!businessId) return;
    void loadConversations(businessId);
  }, [businessId]);

  async function loadConversations(targetBusinessId: string) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/conversations?businessId=${targetBusinessId}&limit=50`, {
        method: 'GET',
        cache: 'no-store',
      });
      const payload = (await response.json()) as { data?: Conversation[]; error?: string };

      if (!response.ok) {
        setError(payload.error ?? 'Failed to load conversations');
        setConversations([]);
        return;
      }

      setConversations(payload.data ?? []);
    } catch {
      setError('Failed to load conversations');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }

  if (!businessId) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">Conversations</h2>
        <p className="text-sm text-slate-600">Pass <code>businessId</code> in URL to view chat history.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Conversations</h2>
          <p className="text-sm text-slate-600">Business id: {businessId}</p>
        </div>
        <button
          type="button"
          onClick={() => void loadConversations(businessId)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading conversations...</p>
      ) : (
        <div className="space-y-3">
          {conversations.map((conversation) => {
            const messages = conversation.messages ?? [];
            const lastMessage = messages[messages.length - 1];
            return (
              <div key={conversation.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{conversation.customer_phone}</p>
                  <p className="text-xs text-slate-500">
                    {conversation.last_message_at
                      ? new Date(conversation.last_message_at).toLocaleString('en-IN')
                      : '-'}
                  </p>
                </div>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-600">
                  <span>Source: {conversation.source ?? 'unknown'}</span>
                  <span>Status: {conversation.status ?? 'active'}</span>
                  <span>Messages: {messages.length}</span>
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  {lastMessage?.content ?? 'No messages yet.'}
                </p>
              </div>
            );
          })}
          {!conversations.length && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
              No conversations found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PortalConversationsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading conversations...</p>}>
      <PortalConversationsContent />
    </Suspense>
  );
}
