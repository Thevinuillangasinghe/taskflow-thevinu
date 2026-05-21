export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="w-full max-w-sm rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold mb-6">Login to TaskFlow</h1>

        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          className="w-full rounded-md border p-3 mb-4"
          type="email"
          placeholder="you@example.com"
        />

        <label className="block mb-2 text-sm font-medium">Password</label>
        <input
          className="w-full rounded-md border p-3 mb-6"
          type="password"
          placeholder="Enter password"
        />

        <button className="w-full rounded-md bg-black p-3 text-white">
          Login
        </button>
      </form>
    </main>
  );
}