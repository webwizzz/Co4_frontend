"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password,
      })

      const data = res.data;
      console.log(data);

      if (res.status !== 200) {
        setError(data?.message || "Login failed")
        setLoading(false)
        return
      }

      // Expecting { token: string, role: string }
      const { token, user } = data
      if (!token) {
        setError("No token returned from server")
        setLoading(false)
        return
      }

      localStorage.setItem("token", token)
      if (user) {
        localStorage.setItem("role", user.role)
        localStorage.setItem("_id", user._id)
      }

      // Redirect based on role
      if (user.role === "student") {
        router.push("/student")
      } else {
        // default fallback
        router.push("/")
      }
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      setError((err as Error)?.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="w-full max-w-md p-8 border-2 border-black rounded-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-black rounded-md bg-white text-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-black rounded-md bg-white text-black focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-black text-white font-medium rounded-md hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">Use your student credentials to sign in.</p>
      </div>
    </div>
  )
}
