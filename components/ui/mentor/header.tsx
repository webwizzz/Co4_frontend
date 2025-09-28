
import { useRouter } from "next/navigation"

interface MentorHeaderProps {
  onBack?: () => void
  onNext?: () => void
  canGoBack?: boolean
  canGoNext?: boolean
}

export default function MentorHeader({ onBack, onNext, canGoBack, canGoNext }: MentorHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    // Clear localStorage and redirect to login
    localStorage.clear()
    router.push("/login")
  }

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow px-6 py-4 flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-foreground">Mentor Panel</span>
        <span className="text-sm text-muted-foreground hidden sm:inline">Empowering Student Innovation</span>
      </div>
      <div className="flex items-center gap-4">
        {onBack && (
          <button
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 disabled:opacity-50"
            onClick={onBack}
            disabled={!canGoBack}
          >
            Previous
          </button>
        )}
        {onNext && (
          <button
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 disabled:opacity-50"
            onClick={onNext}
            disabled={!canGoNext}
          >
            Next
          </button>
        )}
        <button
          className="px-4 py-1 rounded bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  )
}
