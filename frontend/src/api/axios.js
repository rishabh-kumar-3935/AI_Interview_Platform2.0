import axios from "axios"

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_BACKEND_URL ||
    "https://ai-interview-platform2-0.onrender.com",
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const authRaw = window.localStorage.getItem("auth")

      if (authRaw) {
        try {
          const auth = JSON.parse(authRaw)
          const token =
            auth?.token ||
            auth?.accessToken ||
            auth?.data?.accessToken

          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        } catch (e) {
          // Ignore invalid localStorage data
        }
      }
    }

    return config
  },
  (err) => Promise.reject(err)
)

let isRefreshing = false
let refreshSubscribers = []

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback)
}

const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !originalRequest?.url?.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(axiosInstance(originalRequest))
          })
        })
      }

      isRefreshing = true

      try {
        const response = await axiosInstance.post(
          "/api/auth/refresh-token"
        )

        const newAccessToken =
          response.data?.data?.accessToken

        if (!newAccessToken) {
          throw new Error("No access token received")
        }

        // Update stored authentication
        const authRaw = window.localStorage.getItem("auth")

        if (authRaw) {
          const auth = JSON.parse(authRaw)

          const updatedAuth = {
            ...auth,
            token: newAccessToken,
          }

          window.localStorage.setItem(
            "auth",
            JSON.stringify(updatedAuth)
          )
        }

        onRefreshed(newAccessToken)

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`

        return axiosInstance(originalRequest)

      } catch (refreshError) {
        refreshSubscribers = []

        if (typeof window !== "undefined") {
          window.localStorage.removeItem("auth")

          if (window.location.pathname !== "/login") {
            window.location.href = "/login"
          }
        }

        return Promise.reject(refreshError)

      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance