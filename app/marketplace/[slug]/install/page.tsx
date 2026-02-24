'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

const STEPS = [
  { id: 'business', name: 'Select Business' },
  { id: 'configure', name: 'Configure' },
  { id: 'integrate', name: 'Connect' },
  { id: 'review', name: 'Review and Launch' },
];

type TemplateRecord = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  price_inr: number | null;
};

type BusinessRecord = {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
};

type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
};

type ManualPaymentDetails = {
  mode: 'manual';
  whatsappNumber: string | null;
  whatsappUrl: string | null;
  referenceCode: string;
  amountInr: number;
  templateName: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function InstallTemplateContent() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slugParam = params.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
  const businessIdFromQuery = useMemo(() => searchParams.get('businessId') ?? '', [searchParams]);

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState<TemplateRecord | null>(null);
  const [businesses, setBusinesses] = useState<BusinessRecord[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState(businessIdFromQuery);
  const [agentName, setAgentName] = useState('');
  const [greetingMessage, setGreetingMessage] = useState(
    'Namaste. I am your AI assistant. How can I help you today?'
  );
  const [language, setLanguage] = useState('hi-EN');
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [calendarEnabled, setCalendarEnabled] = useState(true);
  const [gmbEnabled, setGmbEnabled] = useState(false);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const [order, setOrder] = useState<RazorpayOrder | null>(null);
  const [razorpayKeyId, setRazorpayKeyId] = useState<string | null>(null);
  const [manualPayment, setManualPayment] = useState<ManualPaymentDetails | null>(null);
  const [manualTransactionId, setManualTransactionId] = useState('');
  const [confirmingManualPayment, setConfirmingManualPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [requiresPayment, setRequiresPayment] = useState(false);

  const loadTemplate = useCallback(async (templateSlug: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/marketplace/templates?slug=${templateSlug}`, {
        cache: 'no-store',
      });
      const data = (await response.json()) as { data?: TemplateRecord[]; error?: string };
      if (!response.ok) {
        setError(data.error ?? 'Failed to load template');
        return;
      }

      const found = (data.data ?? [])[0] ?? null;
      if (!found) {
        setError('Template not found');
        return;
      }

      setTemplate(found);
      setAgentName((prev) => prev || found.name);
    } catch {
      setError('Failed to load template');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadBusinesses = useCallback(async () => {
    try {
      const response = await fetch('/api/businesses', {
        cache: 'no-store',
      });
      const data = (await response.json()) as { data?: BusinessRecord[]; error?: string };
      if (!response.ok) {
        setError(data.error ?? 'Failed to load businesses');
        setBusinesses([]);
        return;
      }

      setBusinesses(data.data ?? []);
      setSelectedBusinessId((prev) => prev || data.data?.[0]?.id || '');
    } catch {
      setBusinesses([]);
    }
  }, []);

  useEffect(() => {
    if (!slug) return;
    void loadTemplate(slug);
  }, [slug, loadTemplate]);

  useEffect(() => {
    void loadBusinesses();
  }, [loadBusinesses]);

  async function preparePayment() {
    if (!template) return;
    setError(null);
    setPaymentMessage(null);

    try {
      const response = await fetch('/api/marketplace/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateSlug: template.slug,
          businessId: selectedBusinessId || null,
        }),
      });
      const payload = (await response.json()) as {
        purchaseId?: string;
        requiresPayment?: boolean;
        paymentMessage?: string;
        order?: RazorpayOrder;
        razorpayKeyId?: string | null;
        manualPayment?: ManualPaymentDetails;
        error?: string;
      };

      if (!response.ok) {
        setError(payload.error ?? 'Failed to prepare purchase');
        return;
      }

      setPurchaseId(payload.purchaseId ?? null);
      setRequiresPayment(Boolean(payload.requiresPayment));
      setPaymentMessage(payload.paymentMessage ?? null);
      setOrder(payload.order ?? null);
      setRazorpayKeyId(payload.razorpayKeyId ?? null);
      setManualPayment(payload.manualPayment ?? null);
      setManualTransactionId('');
    } catch {
      setError('Failed to prepare purchase');
    }
  }

  async function loadRazorpaySdk() {
    if (window.Razorpay) return true;
    return new Promise<boolean>((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function payNow() {
    if (!purchaseId || !order || !razorpayKeyId) {
      setError('Payment is not prepared. Please create order again.');
      return;
    }

    setPaying(true);
    setError(null);
    setPaymentMessage(null);

    const sdkLoaded = await loadRazorpaySdk();
    if (!sdkLoaded || !window.Razorpay) {
      setPaying(false);
      setError('Failed to load Razorpay checkout.');
      return;
    }

    const razorpay = new window.Razorpay({
      key: razorpayKeyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: 'Smile Fotilo',
      description: template?.name ?? 'Template Purchase',
      handler: async (response: Record<string, string>) => {
        try {
          const verifyResponse = await fetch('/api/billing/razorpay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'verify_payment',
              purchaseId,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });

          const verifyPayload = (await verifyResponse.json()) as {
            verified?: boolean;
            error?: string;
          };

          if (!verifyResponse.ok || !verifyPayload.verified) {
            setError(verifyPayload.error ?? 'Payment verification failed.');
            return;
          }

          setRequiresPayment(false);
          setPaymentMessage('Payment verified. You can now install this template.');
        } catch {
          setError('Payment verification failed.');
        } finally {
          setPaying(false);
        }
      },
      modal: {
        ondismiss: () => setPaying(false),
      },
      theme: {
        color: '#0f172a',
      },
    });

    razorpay.open();
  }

  async function confirmManualPayment() {
    if (!purchaseId) {
      setError('Purchase is not ready. Please prepare payment first.');
      return;
    }

    if (manualTransactionId.trim().length < 4) {
      setError('Enter the approval/reference code shared on WhatsApp.');
      return;
    }

    setConfirmingManualPayment(true);
    setError(null);
    setPaymentMessage(null);

    try {
      const response = await fetch('/api/marketplace/purchase', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'manual_confirm',
          purchaseId,
          transactionId: manualTransactionId.trim(),
        }),
      });

      const payload = (await response.json()) as {
        verified?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.verified) {
        setError(payload.error ?? 'Manual payment confirmation failed.');
        return;
      }

      setRequiresPayment(false);
      setPaymentMessage('Payment confirmed. You can now install this template.');
    } catch {
      setError('Manual payment confirmation failed.');
    } finally {
      setConfirmingManualPayment(false);
    }
  }

  async function installTemplate() {
    if (!selectedBusinessId) {
      setError('Select a business id first.');
      return;
    }

    if (!slug) {
      setError('Template slug is missing.');
      return;
    }

    if (template?.price_inr && template.price_inr > 0 && !purchaseId) {
      setError('Prepare payment first.');
      return;
    }

    setInstalling(true);
    setError(null);

    try {
      const response = await fetch('/api/marketplace/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateSlug: slug,
          businessId: selectedBusinessId,
          purchaseId,
          configuration: {
            agentName,
            greetingMessage,
            language,
            integrations: {
              whatsapp: whatsappEnabled,
              calendar: calendarEnabled,
              googleBusinessProfile: gmbEnabled,
            },
          },
        }),
      });

      const data = (await response.json()) as { agentId?: string; error?: string };
      if (!response.ok || !data.agentId) {
        setError(data.error ?? 'Installation failed');
        return;
      }

      router.push(`/portal/agents?businessId=${selectedBusinessId}`);
    } catch {
      setError('Installation failed');
    } finally {
      setInstalling(false);
    }
  }

  function next() {
    setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  }

  function back() {
    setStep((prev) => Math.max(prev - 1, 0));
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-semibold text-slate-900">Install AI Agent</h1>

        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-4">
          {STEPS.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  index <= step ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {index + 1}
              </div>
              <p className="text-sm font-medium text-slate-700">{item.name}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          {loading && <p className="text-sm text-slate-500">Loading template...</p>}
          {!loading && template && (
            <p className="mb-4 text-sm text-slate-600">
              Template: <strong>{template.name}</strong> | Price:{' '}
              {template.price_inr && template.price_inr > 0 ? `INR ${template.price_inr}` : 'Free'}
            </p>
          )}

          {step === 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Select Business</h2>
              {!!businesses.length && (
                <div className="space-y-2">
                  {businesses.map((business) => (
                    <label
                      key={business.id}
                      className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3"
                    >
                      <input
                        type="radio"
                        name="business"
                        value={business.id}
                        checked={selectedBusinessId === business.id}
                        onChange={() => setSelectedBusinessId(business.id)}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{business.name}</p>
                        <p className="text-xs text-slate-500">
                          {[business.city, business.state].filter(Boolean).join(', ') || 'Location not set'}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Business Id
                </label>
                <input
                  type="text"
                  value={selectedBusinessId}
                  onChange={(event) => setSelectedBusinessId(event.target.value)}
                  placeholder="Business UUID"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none"
                />
              </div>
            </section>
          )}

          {step === 1 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Configure Agent</h2>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Agent Name
                </label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(event) => setAgentName(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Greeting Message
                </label>
                <textarea
                  value={greetingMessage}
                  onChange={(event) => setGreetingMessage(event.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none"
                >
                  <option value="hi-EN">Hinglish</option>
                  <option value="hi">Hindi</option>
                  <option value="en">English</option>
                  <option value="bn">Bengali</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                </select>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Connect Integrations</h2>
              <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">WhatsApp / SMS</p>
                  <p className="text-xs text-slate-500">
                    Uses Meta WhatsApp Cloud API when available, otherwise Twilio sender fallback.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappEnabled}
                  onChange={(event) => setWhatsappEnabled(event.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">Appointment Calendar</p>
                  <p className="text-xs text-slate-500">Allow reminders and booking flows.</p>
                </div>
                <input
                  type="checkbox"
                  checked={calendarEnabled}
                  onChange={(event) => setCalendarEnabled(event.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">Google Business Profile</p>
                  <p className="text-xs text-slate-500">Draft review responses and local updates.</p>
                </div>
                <input
                  type="checkbox"
                  checked={gmbEnabled}
                  onChange={(event) => setGmbEnabled(event.target.checked)}
                />
              </label>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Review and Launch</h2>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
                <p>
                  <strong>Template:</strong> {template?.name ?? '-'}
                </p>
                <p>
                  <strong>Business Id:</strong> {selectedBusinessId || '-'}
                </p>
                <p>
                  <strong>Agent Name:</strong> {agentName || '-'}
                </p>
                <p>
                  <strong>Language:</strong> {language}
                </p>
                <p>
                  <strong>Integrations:</strong>{' '}
                  {[
                    whatsappEnabled ? 'WhatsApp' : null,
                    calendarEnabled ? 'Calendar' : null,
                    gmbEnabled ? 'Google Business Profile' : null,
                  ]
                    .filter(Boolean)
                    .join(', ') || 'None'}
                </p>
                <p>
                  <strong>Price:</strong>{' '}
                  {template?.price_inr && template.price_inr > 0 ? `INR ${template.price_inr}` : 'Free'}
                </p>
              </div>

              {template?.price_inr && template.price_inr > 0 && !purchaseId && (
                <button
                  type="button"
                  onClick={() => void preparePayment()}
                  disabled={!selectedBusinessId || paying}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
                >
                  Prepare Payment
                </button>
              )}

              {template?.price_inr &&
                template.price_inr > 0 &&
                requiresPayment &&
                purchaseId &&
                order &&
                razorpayKeyId && (
                <button
                  type="button"
                  onClick={() => void payNow()}
                  disabled={paying}
                  className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  {paying ? 'Processing...' : 'Pay Now'}
                </button>
              )}

              {template?.price_inr && template.price_inr > 0 && requiresPayment && purchaseId && manualPayment && (
                <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                  <p className="text-sm font-semibold text-emerald-900">Manual Payment (WhatsApp)</p>
                  <p className="text-sm text-emerald-800">
                    Message us on WhatsApp to complete payment for <strong>{manualPayment.templateName}</strong>{' '}
                    (<strong>INR {manualPayment.amountInr}</strong>).
                  </p>
                  <p className="text-xs text-emerald-700">
                    Share this reference with us: <strong>{manualPayment.referenceCode}</strong>
                  </p>
                  <p className="text-xs text-emerald-700">
                    Contact: <strong>{manualPayment.whatsappNumber ?? 'WhatsApp unavailable'}</strong>
                  </p>
                  {manualPayment.whatsappUrl && (
                    <a
                      href={manualPayment.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-md border border-emerald-700 px-3 py-1.5 text-xs font-semibold text-emerald-900"
                    >
                      Message on WhatsApp
                    </a>
                  )}
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={manualTransactionId}
                      onChange={(event) => setManualTransactionId(event.target.value)}
                      placeholder="Enter approval/reference code from WhatsApp"
                      className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => void confirmManualPayment()}
                      disabled={confirmingManualPayment}
                      className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                    >
                      {confirmingManualPayment ? 'Confirming...' : 'I got approval code'}
                    </button>
                  </div>
                </div>
              )}

              {paymentMessage && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
                  {paymentMessage}
                  {requiresPayment && !manualPayment && (
                    <p className="mt-1">
                      Complete payment from Razorpay checkout. Installation unlocks after verification.
                    </p>
                  )}
                  {requiresPayment && manualPayment && (
                    <p className="mt-1">
                      Message us on WhatsApp and submit your approval/reference code.
                    </p>
                  )}
                </div>
              )}

              {requiresPayment && purchaseId && order && !razorpayKeyId && !manualPayment && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  Online checkout key is unavailable right now. Use manual payment or configure gateway later.
                </div>
              )}
            </section>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={back}
              disabled={step === 0 || installing || paying}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
            >
              Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                disabled={installing || paying}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void installTemplate()}
                disabled={
                  installing ||
                  paying ||
                  confirmingManualPayment ||
                  !selectedBusinessId ||
                  requiresPayment
                }
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {installing ? 'Installing...' : 'Install Agent'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InstallTemplatePage() {
  return (
    <Suspense fallback={<p className="px-4 py-10 text-sm text-slate-500">Loading install flow...</p>}>
      <InstallTemplateContent />
    </Suspense>
  );
}
