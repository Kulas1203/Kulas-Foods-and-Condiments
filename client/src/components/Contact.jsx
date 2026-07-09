import { useState } from 'react';
import { motion } from 'framer-motion';
import { joinNewsletter, sendContact } from '../lib/api.js';
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion.js';

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative bg-gradient-to-b from-coal to-coal-soft px-5 py-28 md:px-8"
    >
      <div className="absolute inset-x-0 top-0 mx-auto h-px max-w-4xl bg-ember-line" />

      <motion.div
        variants={staggerContainer(0.15)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto max-w-6xl"
      >
        <motion.span variants={fadeUp} className="section-eyebrow">
          Get In Touch
        </motion.span>
        <motion.h2
          variants={fadeUp}
          className="max-w-2xl text-3xl font-extrabold text-cream md:text-5xl"
        >
          Bring the heat{' '}
          <span className="font-script font-normal text-amber-glow">
            to your table
          </span>
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 max-w-xl text-cream/60">
          Wholesale inquiries, stockist questions, or just want to tell us how
          much you love the sauce — we read everything.
        </motion.p>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <ContactForm />
          <NewsletterCard />
        </div>
      </motion.div>
    </section>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ state: 'idle' });

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'loading' });
    try {
      await sendContact(form);
      setStatus({
        state: 'success',
        message: "Message received — we'll get back to you soon. 🌶️",
      });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ state: 'error', message: err.message });
    }
  };

  return (
    <motion.form
      variants={fadeUp}
      onSubmit={submit}
      className="glass rounded-3xl p-8 md:p-10"
    >
      <h3 className="text-lg font-bold text-cream">Wholesale &amp; hello's</h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <input
          className="input-dark"
          placeholder="Your name"
          value={form.name}
          onChange={update('name')}
          required
          minLength={2}
        />
        <input
          className="input-dark"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={update('email')}
          required
        />
      </div>
      <textarea
        className="input-dark mt-4 min-h-32 resize-y"
        placeholder="Tell us what you're cooking up…"
        value={form.message}
        onChange={update('message')}
        required
        minLength={10}
      />
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <motion.button
          type="submit"
          disabled={status.state === 'loading'}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="btn-primary disabled:opacity-60"
        >
          {status.state === 'loading' ? 'Sending…' : 'Send Message'}
        </motion.button>
        <FormStatus status={status} />
      </div>
    </motion.form>
  );
}

function NewsletterCard() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ state: 'idle' });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'loading' });
    try {
      const res = await joinNewsletter(email);
      setStatus({
        state: 'success',
        message: res.message || "You're on the list. Stay spicy. 🔥",
      });
      setEmail('');
    } catch (err) {
      setStatus({ state: 'error', message: err.message });
    }
  };

  return (
    <motion.div
      variants={fadeUp}
      className="glass flex flex-col justify-between rounded-3xl bg-gradient-to-b from-chili-deep/40 to-transparent p-8 md:p-10"
    >
      <div>
        <h3 className="text-lg font-bold text-cream">Join the waitlist</h3>
        <p className="mt-3 text-sm leading-relaxed text-cream/65">
          New batches sell out fast. Get first dibs on drops, restocks, and
          subscriber-only ferments.
        </p>
      </div>

      <form onSubmit={submit} className="mt-8">
        <input
          className="input-dark"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <motion.button
          type="submit"
          disabled={status.state === 'loading'}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="btn-primary mt-4 w-full justify-center disabled:opacity-60"
        >
          {status.state === 'loading' ? 'Joining…' : 'Get Early Access'}
        </motion.button>
        <div className="mt-4">
          <FormStatus status={status} />
        </div>
        <p className="mt-4 text-[11px] text-cream/35">
          No spam — only heat. Unsubscribe anytime.
        </p>
      </form>
    </motion.div>
  );
}

function FormStatus({ status }) {
  if (status.state === 'success') {
    return <p className="text-sm text-amber-glow">{status.message}</p>;
  }
  if (status.state === 'error') {
    return <p className="text-sm text-chili-bright">{status.message}</p>;
  }
  return null;
}
