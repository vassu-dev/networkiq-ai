import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, MapPin, Phone, Send, MessageSquare, User, Building2,
  CheckCircle2, Clock, Globe, Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SectionHeading } from '@/components/ui/primitives';
import { useApp } from '@/context/AppContext';

const CONTACTS = [
  { icon: Mail, label: 'Email', value: 'team@networkiq.ai', href: 'mailto:team@networkiq.ai' },
  { icon: Phone, label: 'Phone', value: '+91 90000 12345', href: 'tel:+919000012345' },
  { icon: MapPin, label: 'Location', value: 'Hyderabad, Telangana, India', href: null },
  { icon: Clock, label: 'Response time', value: 'Within 24 hours', href: null },
];

export function ContactPage() {
  const { pushNotification } = useApp();
  const [form, setForm] = useState({ name: '', email: '', company: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSubmitting(true);
    // Simulated submission — this is a demo contact form
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      pushNotification({
        title: 'Message sent',
        message: `Thanks ${form.name.split(' ')[0]} — we'll get back to you within 24 hours.`,
        type: 'success',
      });
      setForm({ name: '', email: '', company: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    }, 1100);
  };

  const update = (k: keyof typeof form) => (v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: '' }));
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Get in touch"
        subtitle="Questions, feedback, or partnership ideas — the NetworkIQ team is listening."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Contact info column */}
        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="relative overflow-hidden rounded-2xl border glass p-6">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary to-chart-2 text-white shadow-lg">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold">Let's talk inventory</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Whether you want a guided demo, a custom integration, or have a question about the AI engine, drop us a line.
              </p>

              <div className="mt-6 space-y-3">
                {CONTACTS.map(({ icon: I, label, value, href }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <I className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      {href ? (
                        <a href={href} className="text-sm font-medium hover:text-primary">{value}</a>
                      ) : (
                        <p className="text-sm font-medium">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-muted/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Globe className="h-4 w-4 text-primary" /> Operating hours
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Mon – Fri · 9:00 AM – 7:00 PM IST</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form column */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-3"
        >
          <form onSubmit={handleSubmit} className="rounded-2xl border glass p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" icon={User} error={errors.name} required>
                <Input
                  value={form.name}
                  onChange={(e) => update('name')(e.target.value)}
                  placeholder="Jane Doe"
                  className={fieldCls(errors.name)}
                />
              </Field>
              <Field label="Email" icon={Mail} error={errors.email} required>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email')(e.target.value)}
                  placeholder="jane@company.com"
                  className={fieldCls(errors.email)}
                />
              </Field>
              <Field label="Company" icon={Building2} error={errors.company}>
                <Input
                  value={form.company}
                  onChange={(e) => update('company')(e.target.value)}
                  placeholder="Acme Retail (optional)"
                />
              </Field>
              <Field label="Subject" icon={MessageSquare} error={errors.subject} required>
                <Input
                  value={form.subject}
                  onChange={(e) => update('subject')(e.target.value)}
                  placeholder="How can we help?"
                  className={fieldCls(errors.subject)}
                />
              </Field>
            </div>

            <div className="mt-4">
              <Label className="mb-1.5 block">Message <span className="text-chart-5">*</span></Label>
              <Textarea
                value={form.message}
                onChange={(e) => update('message')(e.target.value)}
                placeholder="Tell us about your inventory network and what you'd like to optimize…"
                rows={6}
                className={fieldCls(errors.message)}
              />
              {errors.message && <p className="mt-1 text-xs text-chart-5">{errors.message}</p>}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">We'll never share your details. Promise.</p>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <><Send className="mr-2 h-4 w-4 animate-pulse" /> Sending…</>
                ) : (
                  <><Send className="mr-2 h-4 w-4" /> Send message</>
                )}
              </Button>
            </div>

            <AnimatePresence>
              {sent && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="mt-4 flex items-center gap-2 rounded-xl border border-chart-3/30 bg-chart-3/10 px-4 py-3 text-sm text-chart-3"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Message sent successfully — we'll be in touch shortly.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

function Field({
  label, icon: I, error, required, children,
}: { label: string; icon: typeof User; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 flex items-center gap-1.5">
        <I className="h-3.5 w-3.5 text-muted-foreground" /> {label} {required && <span className="text-chart-5">*</span>}
      </Label>
      {children}
      {error && <p className="mt-1 text-xs text-chart-5">{error}</p>}
    </div>
  );
}

function fieldCls(error?: string) {
  return error ? 'border-chart-5 focus-visible:ring-chart-5' : '';
}
