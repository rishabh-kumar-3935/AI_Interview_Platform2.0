import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import axiosInstance from '../api/axios'

import { login as authLogin } from '../store/authSlice'


function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await axiosInstance.post('/api/v1/users/login', form)
      const user = res.data?.data?.user || res.data?.user
      const token = res.data?.data?.accessToken || res.data?.token
      const authPayload = { status: true, userData: user, token, accessToken: token }

      dispatch(authLogin({ user, token }))
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('auth', JSON.stringify(authPayload))
        }
      } catch (e) {
        // ignore
      }
      toast.success('Logged in!')
      navigate('/dashboard')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4 py-24 md:py-28">
      <div className="w-full max-w-[440px] bg-zinc-900/30 backdrop-blur-xl p-8 md:p-10 rounded-[3rem] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full"></div>

        <div className="flex flex-col items-center mb-10 text-center relative z-10">
          <div className="relative w-16 h-16 flex items-center justify-center mb-4">
            <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-xl opacity-30"></div>
           
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-white">
            AI<span className="ml-1 text-green-500">INTERVIEW</span>
          </h2>
        </div>

        {error && (
          <div className="flex items-center gap-3 text-red-400 bg-red-400/5 border border-red-400/10 p-4 rounded-2xl mb-8 text-xs font-bold relative z-10">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 ml-2">Email or Username</label>
            <div className="relative group">
              <Mail size={18} className="absolute left-4 top-4 text-zinc-600 group-focus-within:text-blue-500" />
              <input
                type="text"
                autoComplete="email"
                placeholder="john@example.com"
                className="w-full bg-black/40 border border-white/5 p-4 pl-12 rounded-2xl focus:border-green-600/50 outline-none text-sm text-white"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 ml-2">Password</label>
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-4 text-zinc-600 group-focus-within:text-blue-500" />
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-black/40 border border-white/5 p-4 pl-12 rounded-2xl focus:border-green-600/50 outline-none text-sm text-white"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-white text-black hover:bg-zinc-200 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] mt-6 shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Login <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center relative z-10">
          <p className="text-zinc-500 text-[11px] font-black uppercase">
            New to this? <Link to="/signup" className="text-green-500 hover:text-green-400">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login