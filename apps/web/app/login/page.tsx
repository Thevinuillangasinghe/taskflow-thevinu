"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        toast.error("Backend returned invalid response");
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        toast.error(data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("workspaceId", String(data.workspace.id));

      toast.success("Login successful");

      router.push("/board");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 px-4 text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur"
      >
        <h1 className="mb-6 text-2xl font-bold text-white">
          Login to TaskFlow
        </h1>

        <label className="mb-2 block text-sm font-medium text-gray-300">
          Email
        </label>

        <input
          className="mb-4 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label className="mb-2 block text-sm font-medium text-gray-300">
          Password
        </label>

        <input
          className="mb-6 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button
          disabled={isLoading}
          className="w-full rounded-xl bg-white p-3 font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-5 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-white hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </main>
  );
}