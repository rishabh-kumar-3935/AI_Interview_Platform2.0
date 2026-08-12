import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, Loader2, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import axiosInstance from '../api/axios'
// // logoIcon removed - file does not exist in assets

function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  const checkPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, text: '', color: 'bg-zinc-800' }

    let score = 0
    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++

    const levels = ['', 'Weak', 'Fair', 'Good', 'Strong']
    const colors = ['bg-zinc-800', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
    return { score, text: levels[score] || '', color: colors[score] || 'bg-zinc-800' }
  }

  const strength = checkPasswordStrength(form.password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (strength.score < 3) {
      const msg = 'Password needs to be stronger'
      setError(msg)
      toast.error(msg)
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await axiosInstance.post('/api/v1/users/register', form)
      if (res.status >= 200 && res.status < 300) {
        toast.success('Account created! Login now.')
        navigate('/login')
      }
    } catch (err) {
      let msg = err.response?.data?.message || 'Signup failed'

      if (!err.response) {
        msg = 'Unable to reach the server. Make sure the backend is running on port 4000.'
      }

      if (err.response?.status === 409) {
        if (msg.toLowerCase().includes('email')) {
          toast.error('Email already registered')
        } else if (msg.toLowerCase().includes('username')) {
          toast.error('Username taken')
        } else {
          toast.error(msg)
        }
      } else {
        toast.error(msg)
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4 py-24 md:py-28">
      <div className="w-full max-w-xl bg-zinc-900/30 backdrop-blur-xl p-8 md:p-12 rounded-[3.5rem] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full"></div>

        <div className="flex flex-col items-center text-center mb-10 relative z-10">
          <div className="relative w-16 h-16 flex items-center justify-center mb-4">
            <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-xl opacity-30"></div>
            {/* <img src={logoIcon} alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]" /> */}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
            AI<span className="text-green-500 ml-1">INTERVIEW</span><span className = "text-blue-300 ml-1">PLATFORM</span>
          </h2>
        </div>

        {error && (
          <div className="flex items-center gap-3 text-red-400 bg-red-400/5 border border-red-400/10 p-4 rounded-2xl mb-8 text-xs font-bold relative z-10">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-400 ml-2">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-black/40 border border-white/4 p-4 rounded-2xl focus:border-green-600/50 outline-none text-sm text-white"
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-400 ml-2">Username</label>
              <input
                type="text"
                placeholder="johndoe"
                className={`w-full bg-black/40 border p-4 rounded-2xl focus:border-green-600/50 outline-none text-sm text-white ${
                  error.includes('username') ? 'border-red-500/50' : 'border-white/5'
                }`}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 ml-2">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              className={`w-full bg-black/40 border p-4 rounded-2xl focus:border-green-600/50 outline-none text-sm text-white ${
                error.includes('email') ? 'border-red-500/50' : 'border-white/5'
              }`}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase text-zinc-400 ml-2">Password</label>
              {strength.text && (
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${strength.color}/10 text-white`}>
                  {strength.text}
                </span>
              )}
            </div>
            <div className="relative flex items-center">
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="Min 8 chars"
                autoComplete="new-password"
                className="w-full bg-black/40 border border-white/5 p-4 pr-12 rounded-2xl focus:border-green-600/50 outline-none text-sm text-white"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 text-zinc-500 hover:text-zinc-300"
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {form.password && (
              <div className="pt-2">
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color}`} style={{ width: `${(strength.score / 4) * 100}%` }}></div>
                </div>
                <ul className="text-[9px] text-zinc-500 mt-2 ml-2 space-y-1">
                  <li className={form.password.length >= 8 ? 'text-emerald-500' : ''}>✓ 8+ characters</li>
                  <li className={/[A-Z]/.test(form.password) ? 'text-emerald-500' : ''}>✓ Uppercase</li>
                  <li className={/[0-9]/.test(form.password) ? 'text-emerald-500' : ''}>✓ Number</li>
                  <li className={/[^A-Za-z0-9]/.test(form.password) ? 'text-emerald-500' : ''}>✓ Special char</li>
                </ul>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-white text-black hover:bg-zinc-200 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] mt-8 shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Create Account <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center relative z-10">
          <p className="text-zinc-500 text-[11px] font-black uppercase">
            Already have an account?{' '}
            <Link to="/login" className="text-green-500 hover:text-green-400">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup