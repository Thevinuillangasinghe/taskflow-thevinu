"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(event: React.FormEvent) {
    event.preventDefault();

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:4000";

      const response = await fetch(
        `${apiUrl}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Signup failed");
        return;
      }

      alert("Signup successful. Please login.");

      router.push("/login");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow"
      >
        <h1 className="mb-6 text-2xl font-bold">
          Create Account
        </h1>

        <label className="mb-2 block text-sm font-medium">
          Name
        </label>

        <input
          className="mb-4 w-full rounded-md border p-3"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
        />

        <label className="mb-2 block text-sm font-medium">
          Email
        </label>

        <input
          className="mb-4 w-full rounded-md border p-3"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
        />

        <label className="mb-2 block text-sm font-medium">
          Password
        </label>

        <input
          className="mb-6 w-full rounded-md border p-3"
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
        />

        <button className="w-full rounded-md bg-black p-3 text-white">
          Sign Up
        </button>
      </form>
    </main>
  );
}