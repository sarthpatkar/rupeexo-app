export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-700">
      <div className="max-w-4xl mx-auto px-6 py-16">

        <h1 className="text-3xl font-semibold text-[#0f172a] mb-6">
          Terms of Service
        </h1>

        <p className="mb-6">
          Last updated: {new Date().getFullYear()}
        </p>

        <section className="space-y-6 text-sm leading-relaxed">

          <p>
            Rupeexo provides financial data aggregation, analytics, and AI-assisted
            interpretation tools for informational purposes only.
          </p>

          <p>
            By using this platform, you agree that:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>You are solely responsible for your investment decisions.</li>
            <li>Rupeexo does not provide investment advice or recommendations.</li>
            <li>All information is provided “as is” without warranties.</li>
          </ul>

          <p>
            We reserve the right to modify or discontinue services at any time
            without prior notice.
          </p>

          <p>
            Continued use of the platform constitutes acceptance of these terms.
          </p>

        </section>
      </div>
    </main>
  );
}