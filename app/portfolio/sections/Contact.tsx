'use client';
import { useState } from 'react';
import { sendContactEmail } from '@/app/actions/email';
import { SOCIAL } from '@/app/data/portfolio';

type FieldKey = 'name' | 'email' | 'message';
const validators: Record<FieldKey, (v: string) => boolean> = {
  name: (v) => v.trim().length >= 2,
  email: (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v),
  message: (v) => v.trim().length >= 10,
};
const okMsg: Record<FieldKey, string> = { name: 'ok', email: 'valid', message: 'received' };

export default function Contact() {
  const [values, setValues] = useState<Record<FieldKey, string>>({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({ name: false, email: false, message: false });
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [hint, setHint] = useState('all fields required · encrypted in transit');
  const [hintColor, setHintColor] = useState<string | undefined>(undefined);

  const set = (k: FieldKey, v: string) => setValues((s) => ({ ...s, [k]: v }));
  const cls = (k: FieldKey) => {
    if (!touched[k] || !values[k]) return 'field';
    return `field ${validators[k](values[k]) ? 'ok' : 'err'}`;
  };
  const valText = (k: FieldKey) => {
    if (!touched[k] || !values[k]) return '';
    return validators[k](values[k]) ? `✓ ${okMsg[k]}` : '✗ check';
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allOk = (Object.keys(validators) as FieldKey[]).every((k) => validators[k](values[k]));
    setTouched({ name: true, email: true, message: true });
    if (!allOk) {
      setHint('✗ some fields need attention');
      setHintColor('#ff5f56');
      return;
    }
    setState('sending');
    setHint('establishing secure channel…');
    setHintColor(undefined);
    try {
      const res = await sendContactEmail({
        name: values.name,
        email: values.email,
        message: values.message,
        service: 'Portfolio enquiry',
        budget: 'To discuss',
      });
      if (res.success) {
        setState('sent');
        setHint(`✓ thanks ${values.name.split(' ')[0]} — I’ll be in touch soon`);
        setHintColor('#27c93f');
        setValues({ name: '', email: '', message: '' });
        setTouched({ name: false, email: false, message: false });
      } else {
        setState('idle');
        setHint(`✗ ${res.message}`);
        setHintColor('#ff5f56');
      }
    } catch {
      setState('idle');
      setHint('✗ could not send — WhatsApp +91 94538 78422 instead');
      setHintColor('#ff5f56');
    }
  }

  const aside = [
    SOCIAL.email && { href: `mailto:${SOCIAL.email}`, label: `✉ ${SOCIAL.email}`, ext: false },
    SOCIAL.github && { href: SOCIAL.github, label: '↗ GitHub', ext: true },
    SOCIAL.whatsapp && { href: SOCIAL.whatsapp, label: '↗ WhatsApp', ext: true },
    SOCIAL.linkedin && { href: SOCIAL.linkedin, label: '↗ LinkedIn', ext: true },
    SOCIAL.youtube && { href: SOCIAL.youtube, label: '↗ YouTube', ext: true },
  ].filter(Boolean) as { href: string; label: string; ext: boolean }[];

  return (
    <section id="contact">
      <div className="wrap">
        <div className="section-head reveal" style={{ textAlign: 'center', margin: '0 auto clamp(40px,6vw,72px)' }}>
          <span className="eyebrow" style={{ justifyContent: 'center' }}>
            <span className="idx">06</span> Contact
          </span>
          <h2>
            Let&apos;s build something <em>alive</em>.
          </h2>
        </div>

        <div className="term reveal">
          <div className="term-bar">
            <div className="dots">
              <i />
              <i />
              <i />
            </div>
            <div className="path">ashraf@portfolio ~ /new-project</div>
            <div className="status">
              <span className="led" />
              online
            </div>
          </div>
          <div className="term-body">
            <div className="term-line">
              <span className="pr">➜</span> <b>./start-conversation</b> --with=you
            </div>
            <div className="term-line">
              <span className="ok">✓</span> channel secured · usually replies within a day
            </div>
            <form className="term-form" onSubmit={onSubmit} noValidate>
              {(['name', 'email', 'message'] as FieldKey[]).map((k) => (
                <div className={cls(k)} key={k}>
                  <label>
                    <span className="pr">~</span> {k === 'name' ? 'your name' : k === 'email' ? 'email' : 'what are you building?'}{' '}
                    <span className="val">{valText(k)}</span>
                  </label>
                  <div className="ctrl">
                    {k === 'message' ? (
                      <textarea
                        name={k}
                        rows={3}
                        value={values[k]}
                        placeholder="Tell me about the product, timeline, and what success looks like…"
                        onChange={(e) => set(k, e.target.value)}
                        onBlur={() => setTouched((s) => ({ ...s, [k]: true }))}
                      />
                    ) : (
                      <input
                        type={k === 'email' ? 'email' : 'text'}
                        name={k}
                        value={values[k]}
                        autoComplete={k}
                        placeholder={k === 'email' ? 'you@company.com' : 'e.g. Jordan Rivera'}
                        onChange={(e) => set(k, e.target.value)}
                        onBlur={() => setTouched((s) => ({ ...s, [k]: true }))}
                      />
                    )}
                  </div>
                </div>
              ))}
              <div className="term-foot">
                <button type="submit" className={`term-send${state === 'sent' ? ' sent' : ''}`} disabled={state !== 'idle'}>
                  <span>{state === 'sent' ? '✓ message sent' : state === 'sending' ? 'transmitting…' : 'transmit message'}</span>
                  {state === 'idle' && <span>↵</span>}
                </button>
                <span className="term-hint" style={{ color: hintColor }}>
                  {hint}
                </span>
              </div>
            </form>
          </div>
        </div>

        <div className="contact-aside reveal">
          {aside.map((a) => (
            <a key={a.label} href={a.href} {...(a.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              {a.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
