'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="card p-8 text-center">
        <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Message received</h2>
        <p className="text-sm text-slate-600 mt-2">
          This preview does not send email yet. Write us at{' '}
          <a className="font-semibold text-[#0052d9]" href="mailto:research@agents61.com">
            research@agents61.com
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-6 md:p-8 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="mt-1.5 w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0052d9]/30"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1.5 w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0052d9]/30"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider" htmlFor="topic">
          Topic
        </label>
        <select
          id="topic"
          name="topic"
          className="mt-1.5 w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0052d9]/30"
        >
          <option>Product / desk</option>
          <option>Billing / seating</option>
          <option>Affiliate</option>
          <option>Press</option>
          <option>Legal / privacy</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-1.5 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0052d9]/30"
        />
      </div>
      <button type="submit" className="btn-primary justify-center w-full sm:w-auto">
        Send
      </button>
    </form>
  );
}
