import Link from "next/link";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">
              Settings
            </h1>

            <p className="mt-2 text-gray-400">
              Manage your account, workspace, and app preferences.
            </p>
          </div>

          <Link
            href="/board"
            className="rounded-xl bg-white px-5 py-3 font-semibold text-black"
          >
            Back to Board
          </Link>
        </div>

        <div className="grid gap-6">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-2xl font-semibold">
              Profile
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Display Name
                </label>

                <input
                  defaultValue="Thevinu"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Email
                </label>

                <input
                  defaultValue="user@example.com"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-2xl font-semibold">
              Workspace
            </h2>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Workspace Name
              </label>

              <input
                defaultValue="Default Workspace"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-2xl font-semibold">
              Preferences
            </h2>

            <div className="space-y-4">
              <label className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4">
                <span>
                  Email notifications
                </span>

                <input type="checkbox" defaultChecked />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4">
                <span>
                  Task reminders
                </span>

                <input type="checkbox" defaultChecked />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4">
                <span>
                  Dark mode
                </span>

                <input type="checkbox" defaultChecked />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <h2 className="mb-4 text-2xl font-semibold text-red-300">
              Security
            </h2>

            <p className="mb-4 text-gray-400">
              Password reset, two-factor authentication, and session management
              can be added here later.
            </p>

            <button className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-red-300">
              Manage Security
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}