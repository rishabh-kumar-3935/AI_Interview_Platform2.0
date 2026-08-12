import axios from "axios"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:4000",
  withCredentials: true,
})

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const authRaw = window.localStorage.getItem('auth')
    if (authRaw) {
      try {
        const auth = JSON.parse(authRaw)
        const token = auth?.token || auth?.accessToken || auth?.data?.accessToken
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (e) {
        // ignore
      }
    }
  }
  return config
}, (err) => Promise.reject(err))

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default axiosInstance