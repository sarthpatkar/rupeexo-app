export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-700">
      <div className="max-w-4xl mx-auto px-6 py-16">

        <h1 className="text-3xl font-semibold text-[#0f172a] mb-6">
          Privacy Policy
        </h1>

        <p className="mb-6">
          Last updated: {new Date().getFullYear()}
        </p>

        <section className="space-y-6 text-sm leading-relaxed">

          <p>
            We collect only the information necessary to operate the Rupeexo
            platform, including account details and portfolio data entered by users.
          </p>

          <p>
            Your financial data is never sold to third parties.
          </p>

          <p>
            We use industry-standard security practices to protect user data,
            but no system can guarantee absolute security.
          </p>

          <p>
            By using Rupeexo, you consent to the collection and use of information
            as described in this policy.
          </p>

        </section>
      </div>
    </main>
  );
}