'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Starfield } from '../components/Starfield'
import { LogIn, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const validateForm = () => {
    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      return false
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setLoading(true)
    const { error } = await signIn(email, password)

    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? 'The spirits do not recognize these credentials...'
          : error.message
      )
    } else {
      router.push('/')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[#0f0518]">
      {/* Enhanced Starfield */}
      <Starfield />

      {/* Nebula Clouds */}
      <div
        className="fixed top-0 left-0 w-96 h-96 rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0.15,
          animation: 'drift 20s ease-in-out infinite alternate',
        }}
      />
      <div
        className="fixed bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0.12,
          animation: 'drift 25s ease-in-out infinite alternate-reverse',
        }}
      />
      <div
        className="fixed top-1/2 left-1/3 w-64 h-64 rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0.1,
          animation: 'drift 18s ease-in-out infinite alternate',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <div
          className="rounded-2xl p-8 md:p-10 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 100%)',
            border: '2px solid rgba(157, 78, 221, 0.4)',
            boxShadow:
              '0 0 60px rgba(157, 78, 221, 0.25), inset 0 0 30px rgba(157, 78, 221, 0.05)',
          }}
        >
          {/* Ambient Glow Orbs */}
          <div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-30 blur-3xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle, #9d4edd 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
            }}
          />

          {/* Floating Moon */}
          <motion.div
            className="flex justify-center mb-6"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div
              className="text-5xl"
              style={{ filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.4))' }}
            >
              🌙
            </div>
          </motion.div>

          {/* Title */}
          <h1
            className="font-serif text-4xl text-center mb-2 text-white tracking-wide"
          >
            Welcome Back
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-sm italic mb-8 font-serif"
            style={{
              color: '#e0aaff',
              textShadow: '0 0 15px rgba(224, 170, 255, 0.3)',
            }}
          >
            "The veil between worlds is thin here..."
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="space-y-2">
              <label
                className="block text-sm font-medium ml-1"
                style={{ color: '#c084fc' }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl text-white text-sm transition-all duration-300 focus:outline-none"
                style={{
                  background: 'rgba(15, 5, 24, 0.6)',
                  border: '1px solid rgba(192, 132, 252, 0.2)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(192, 132, 252, 0.6)'
                  e.target.style.boxShadow = '0 0 20px rgba(124, 58, 237, 0.2)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(192, 132, 252, 0.2)'
                  e.target.style.boxShadow = 'none'
                }}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                className="block text-sm font-medium ml-1"
                style={{ color: '#c084fc' }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl text-white text-sm transition-all duration-300 focus:outline-none"
                style={{
                  background: 'rgba(15, 5, 24, 0.6)',
                  border: '1px solid rgba(192, 132, 252, 0.2)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(192, 132, 252, 0.6)'
                  e.target.style.boxShadow = '0 0 20px rgba(124, 58, 237, 0.2)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(192, 132, 252, 0.2)'
                  e.target.style.boxShadow = 'none'
                }}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl text-sm flex items-start gap-3"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                }}
              >
                <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl font-semibold text-white relative overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background:
                  'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)',
                boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3)',
              }}
            >
              <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)',
                }}
              />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: 'linear',
                      }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                    Entering the dream realm...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </span>
            </motion.button>
          </form>

          {/* Divider */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px" style={{ background: 'rgba(192, 132, 252, 0.15)' }} />
            <span className="text-xs" style={{ color: 'rgba(192, 132, 252, 0.4)' }}>
              ✦
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(192, 132, 252, 0.15)' }} />
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-sm" style={{ color: 'rgba(233, 213, 255, 0.6)' }}>
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="font-medium transition-colors duration-300 hover:text-white"
              style={{ color: '#c084fc' }}
            >
              Create one now
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Corner Accent */}
      <div className="fixed bottom-6 left-6 z-10">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-serif"
          style={{
            background: 'rgba(124, 58, 237, 0.2)',
            border: '1px solid rgba(192, 132, 252, 0.3)',
            color: '#c084fc',
          }}
        >
          N
        </div>
      </div>
    </main>
  )
}