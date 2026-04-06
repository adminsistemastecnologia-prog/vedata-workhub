import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import logo from '../../../assets/logo-login.jpeg'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      navigate('/tarefas')
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Erro ao fazer login. Verifique as suas credenciais.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-vedata-bg p-4">
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-0 w-full max-w-[900px] bg-vedata-white rounded-2xl shadow-2xl overflow-hidden border border-vedata-accent">
        
        {/* Coluna Esquerda: Logótipo */}
        <div className="hidden md:flex flex-1 bg-vedata-bg items-center justify-center p-8 border-r border-vedata-accent">
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={logo} 
              alt="Vedata WorkHub Logo" 
              className="rounded-xl shadow-lg object-cover w-full h-full max-h-[500px]"
            />
          </div>
        </div>

        {/* Coluna Direita: Card de Login */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <div className="w-full max-w-[360px] mx-auto">
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-bold text-vedata-text tracking-tight mb-2">
                Vedata WorkHub
              </h1>
              <p className="text-vedata-text opacity-70 text-sm font-medium">
                Digite as suas credenciais para entrar no seu quadro de tarefas.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm animate-pulse">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-vedata-text uppercase tracking-wider ml-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-vedata-accent bg-vedata-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-vedata-primary focus:border-transparent transition-all text-vedata-text"
                  placeholder="exemplo@vedata.pt"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-vedata-text uppercase tracking-wider ml-1">
                  Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-vedata-accent bg-vedata-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-vedata-primary focus:border-transparent transition-all text-vedata-text"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-vedata-primary hover:bg-vedata-hover text-white font-bold py-3.5 rounded-xl shadow-lg shadow-vedata-accent transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
              >
                {isLoading ? 'A autenticar...' : 'ENTRAR'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-xs text-vedata-text opacity-40">
                &copy; 2026 Vedata WorkHub. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
