import Link from "next/link";

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">
              Analytics
            </h1>
            <p className="mt-2 text-gray-400">
              Task performance insights and productivity overview.
            </p>
          </div>

          <Link
            href="/board"
            className="rounded-xl bg-white px-5 py-3 font-semibold text-black"
          >
            Back to Board
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-gray-400">Completion Rate</p>
            <h2 className="mt-3 text-4xl font-bold text-green-400">72%</h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-gray-400">Average Tasks / Day</p>
            <h2 className="mt-3 text-4xl font-bold text-blue-400">4.8</h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-gray-400">Overdue Tasks</p>
            <h2 className="mt-3 text-4xl font-bold text-red-400">2</h2>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Coming Soon
          </h2>
          <p className="text-gray-400">
            This page can later be connected to real task data from the database.
          </p>
        </div>
      </div>
    </main>
  );
}