import { useEffect, useState } from 'react'
import { api } from '../../../shared/services/api'
import { DashboardStats } from '../../../shared/types'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/dashboard/stats')
        setStats(response.data.data)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      {error && <div className="bg-red-900 text-red-100 p-4 rounded mb-8">{error}</div>}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-900 p-6 rounded-lg">
            <p className="text-gray-300">Total de Projetos</p>
            <p className="text-3xl font-bold text-blue-400">{stats.totalProjects}</p>
          </div>
          <div className="bg-purple-900 p-6 rounded-lg">
            <p className="text-gray-300">Total de Tarefas</p>
            <p className="text-3xl font-bold text-purple-400">{stats.totalTasks}</p>
          </div>
          <div className="bg-green-900 p-6 rounded-lg">
            <p className="text-gray-300">Tarefas Concluídas</p>
            <p className="text-3xl font-bold text-green-400">{stats.completedTasks}</p>
          </div>
          <div className="bg-yellow-900 p-6 rounded-lg">
            <p className="text-gray-300">Em Progresso</p>
            <p className="text-3xl font-bold text-yellow-400">{stats.inProgressTasks}</p>
          </div>
        </div>
      )}
    </div>
  )
}
