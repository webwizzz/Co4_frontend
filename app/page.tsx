"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    try {
      const token = localStorage.getItem("token")
      const role = localStorage.getItem("role")

      if (token && role) {
        if (role === "student") {
          router.replace("/student")
          return
        }

        // default fallback for other roles
        router.replace("/")
        return
      }
    } catch (e) {
      // ignore errors reading localStorage
    }

    // No token/role: go to login
    router.replace("/login")
  }, [router])

  return null
}
