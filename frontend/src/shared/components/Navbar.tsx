import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'

export default function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
  <nav className="w-full bg-vedata-white border-b border-vedata-accent shadow-sm">
  <div className="w-full px-6 py-4 flex justify-between items-center">
    {/* Lado Esquerdo - Colado na margem esquerda */}
    <div>
      <h1 className="text-xl font-bold text-vedata-text tracking-tight select-none">
        Vedata WorkHub
      </h1>
    </div>

    {/* Lado Direito - Colado na margem direita */}
    <div className="flex items-center">
      {user && (
        <button
          onClick={handleLogout}
          className="bg-vedata-primary hover:bg-vedata-hover text-white font-bold py-1.5 px-4 rounded-lg transition-all duration-200 shadow-sm text-sm uppercase tracking-wider"
        >
          Sair
        </button>
      )}
    </div>
  </div>
  </nav>
  )
}
