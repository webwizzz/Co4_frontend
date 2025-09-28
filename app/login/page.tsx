"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { motion } from "framer-motion"

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

      const data = res.data
      console.log(data)

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
      } else if (user.role === "mentor") {
        router.push("/mentor")
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white">
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-black/5 rounded-full blur-xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-20 right-20 w-24 h-24 bg-black/5 rounded-full blur-xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 30, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="absolute top-1/2 left-10 w-16 h-16 bg-black/3 rounded-full blur-lg"
        animate={{
          x: [0, 60, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <motion.div
        className="absolute top-10 right-1/3 w-20 h-20 bg-black/4 rounded-full blur-xl"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 7,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      <motion.div
        className="w-full max-w-md p-8 relative z-10"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <motion.div
          className="backdrop-blur-xl bg-white/70 border border-black/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
          whileHover={{
            scale: 1.02,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
            borderColor: "rgba(0, 0, 0, 0.2)",
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 rounded-2xl bg-black/30 via-transparent to-black/5 blur-sm"
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          <div className="relative z-10">
            <motion.h1
              className="text-3xl font-bold mb-8 text-center text-black drop-shadow-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Unfair Advantage 
            </motion.h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <label className="block text-sm font-medium mb-2 text-black/80">Email</label>
                <motion.input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 backdrop-blur-md bg-white/60 border border-black/20 rounded-xl text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-black/30 focus:border-black/40 transition-all duration-300"
                  placeholder="Enter your email"
                  whileFocus={{
                    scale: 1.02,
                    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
                  }}
                  whileHover={{
                    borderColor: "rgba(0, 0, 0, 0.3)",
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <label className="block text-sm font-medium mb-2 text-black/80">Password</label>
                <motion.input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 backdrop-blur-md bg-white/60 border border-black/20 rounded-xl text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-black/30 focus:border-black/40 transition-all duration-300"
                  placeholder="Enter your password"
                  whileFocus={{
                    scale: 1.02,
                    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
                  }}
                  whileHover={{
                    borderColor: "rgba(0, 0, 0, 0.3)",
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              {error && (
                <motion.p
                  className="text-sm text-red-600 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-lg p-3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.p>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-black text-white font-semibold rounded-xl shadow-lg disabled:opacity-60 relative overflow-hidden backdrop-blur-sm"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.3)",
                    backgroundColor: "rgba(0, 0, 0, 0.9)",
                  }}
                  whileTap={{
                    scale: 0.98,
                    boxShadow: "0 10px 20px -8px rgba(0, 0, 0, 0.2)",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">
                    {loading ? (
                      <motion.span
                        className="flex items-center justify-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        />
                        Signing in...
                      </motion.span>
                    ) : (
                      "Sign in"
                    )}
                  </span>
                </motion.button>
              </motion.div>
            </form>

            <motion.p
              className="text-center text-sm text-black/60 mt-6 backdrop-blur-sm bg-white/30 rounded-lg p-3 border border-black/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Use your credentials to sign in.
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
