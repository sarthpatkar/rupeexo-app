export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-700">
      <div className="max-w-4xl mx-auto px-6 py-16">

        <h1 className="text-3xl font-semibold text-[#0f172a] mb-6">
          Financial Disclaimer
        </h1>

        <section className="space-y-6 text-sm leading-relaxed">

          <p>
            Rupeexo is a financial data and analytics platform designed to provide
            structured information, visualisations, and AI-assisted summaries based
            on publicly available data sources.
          </p>

          <p className="font-medium text-[#0f172a]">
            Rupeexo is NOT a SEBI-registered investment adviser, broker,
            research analyst, or portfolio manager.
          </p>

          <p>
            The platform does not provide investment advice, stock recommendations,
            buy or sell signals, or personalised financial guidance of any kind.
          </p>

          <p>
            All content is provided strictly for informational and educational
            purposes. Users should conduct their own research or consult a
            SEBI-registered financial professional before making investment decisions.
          </p>

          <p>
            Investing in securities involves risk. Past performance does not
            guarantee future results.
          </p>

        </section>
      </div>
    </main>
  );
}