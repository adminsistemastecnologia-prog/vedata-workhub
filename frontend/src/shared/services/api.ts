import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

// CORREÇÃO: Usar URL relativa ('') como baseURL.
// - Em desenvolvimento (Vite dev server na porta 5173): o proxy do vite.config.ts
//   intercepta chamadas para /api/* e as encaminha para http://localhost:8080/api/*.
// - Em produção (Spring Boot na porta 8080): as chamadas para /api/* chegam
//   diretamente ao backend sem necessidade de URL absoluta.
// Usar URL absoluta 'http://localhost:8080' bypassava o proxy do Vite e causava
// problemas de CORS em desenvolvimento.
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de request: injeta o token JWT em todas as requisições autenticadas
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor de response: trata erros de autenticação
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpar token inválido
      localStorage.removeItem('token')
      // Redirecionar para login apenas se não estiver já na página de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const api = instance
export default instance
