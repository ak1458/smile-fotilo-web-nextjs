export default function AgentBuilderPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="text-3xl font-semibold text-slate-900">AI Agent Builder</h1>
        <p className="text-sm text-slate-600">
          Drag-and-drop builder surface for non-technical users. This is the initial scaffold.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="font-medium">Step 1</h2>
            <p className="mt-2 text-sm text-slate-600">Connect channel (Website/WhatsApp).</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="font-medium">Step 2</h2>
            <p className="mt-2 text-sm text-slate-600">Upload knowledge base and define behavior.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="font-medium">Step 3</h2>
            <p className="mt-2 text-sm text-slate-600">Test and deploy to production.</p>
          </div>
        </div>
      </div>
    </div>
  );
}