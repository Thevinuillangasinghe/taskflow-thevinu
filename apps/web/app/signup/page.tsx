"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(event: React.FormEvent) {
    event.preventDefault();

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      const response = await fetch(`${apiUrl}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        toast.error("Backend returned invalid response");
        return;
      }

      if (!response.ok) {
        toast.error(data.error || "Signup failed");
        return;
      }

      toast.success("Signup successful. Please login.");
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 px-4 text-white">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur"
      >
        <h1 className="mb-6 text-2xl font-bold text-white">
          Create Account
        </h1>

        <label className="mb-2 block text-sm font-medium text-gray-300">
          Name
        </label>

        <input
          className="mb-4 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

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
          placeholder="Create password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button className="w-full rounded-xl bg-white p-3 font-semibold text-black transition hover:bg-gray-200">
          Sign Up
        </button>
        <p className="mt-5 text-center text-sm text-gray-400">
  Already have an account?{" "}
  <Link href="/login" className="font-medium text-white hover:underline">
    Log in
  </Link>
</p>
      </form>
    </main>
  );
}