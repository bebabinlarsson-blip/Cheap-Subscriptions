const faqItems = [
  {
    question: "How are keys delivered?",
    answer: "After the server verifies a successful PayPal capture, the order is marked paid and the assigned redemption keys appear in the buyer inbox.",
  },
  {
    question: "Can I buy coming soon products?",
    answer: "No. Products without confirmed pricing are clearly marked Coming Soon and their purchase buttons stay disabled.",
  },
  {
    question: "Is this compatible with Vercel?",
    answer: "Yes. The app uses Next.js App Router, Prisma, PostgreSQL, Auth.js, and environment variables suitable for Vercel deployment.",
  },
  {
    question: "What legal checks should the owner make?",
    answer: "Confirm resale rights for every license and confirm you have permission to use any referenced brand names or logos.",
  },
];

export function FAQSection() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">FAQ</p>
        <h2 className="mt-2 text-3xl font-black text-white">Built for safe digital fulfillment</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {faqItems.map((item) => (
          <div key={item.question} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white">{item.question}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
