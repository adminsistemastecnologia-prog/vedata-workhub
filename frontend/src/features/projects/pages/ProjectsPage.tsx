import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../../shared/services/api'
import { Project } from '../../../shared/types'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/api/projects')
        setProjects(response.data.data)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar projetos')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Projetos</h1>
        <button
          onClick={() => navigate('/projects/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          + Novo Projeto
        </button>
      </div>

      {error && <div className="bg-red-900 text-red-100 p-4 rounded mb-8">{error}</div>}

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Nenhum projeto encontrado</p>
          <button
            onClick={() => navigate('/projects/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Criar Primeiro Projeto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}/kanban`)}
              className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition"
            >
              <h3 className="text-xl font-bold text-blue-400 mb-2">{project.name}</h3>
              <p className="text-gray-300 text-sm">{project.description}</p>
              <p className="text-gray-500 text-xs mt-4">
                Criado em {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
