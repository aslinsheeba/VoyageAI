import { useAuth } from "../context/AuthContext"

export default function Login() {
  const { loginWithGoogle } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 w-[360px]">
        <h1 className="text-white text-2xl font-bold">VoyageAI</h1>
        <p className="text-slate-300 text-sm mt-1">Sign in to continue</p>

        <button
          onClick={loginWithGoogle}
          className="mt-6 w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-xl font-semibold"
        >
          Continue with Google
        </button>
      </div>
    </div>
  )
}
