import { useEffect, useState } from 'react'
import { X, Calendar, Tag, AlignLeft, Layers, User } from 'lucide-react'
import { Task } from '../../../shared/types'
import PageHeader from '../../../shared/components/PageHeader'
import KanbanColumn from '../components/KanbanColumn'

interface ExtendedTask extends Omit<Task, 'createdAt' | 'updatedAt'> {
  projectType?: 'App' | 'Web' | 'Design System'
  startDate?: string
  endDate?: string
  notes?: string
  responsible?: string
  observations?: string
  createdAt: string
  updatedAt: string
}

const PROJECT_TYPES = ['App', 'Web', 'Design System']

export default function KanbanPage() {
  const [tasks, setTasks] = useState<ExtendedTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)
  const [selectedTask, setSelectedTask] = useState<ExtendedTask | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editFormData, setEditFormData] = useState<ExtendedTask | null>(null)
  const [filterProject, setFilterProject] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    projectType: 'App' as const,
    startDate: '',
    endDate: '',
    notes: '',
    responsible: '',
    observations: '',
    status: 'BACKLOG',
    priority: 'MEDIUM',
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const mockTasks: ExtendedTask[] = [
        {
          id: 'task-1',
          title: 'Setup Inicial',
          description: 'Configurar ambiente de desenvolvimento',
          status: 'BACKLOG' as any,
          priority: 'HIGH' as any,
          projectType: 'App',
          startDate: '2026-03-31',
          endDate: '2026-04-02',
          notes: 'Instalar dependências',
          responsible: 'João Silva',
          observations: 'Verificar compatibilidade com Node.js v22',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          projectId: 'default',
          userId: 'current-user',
        },
        {
          id: 'task-2',
          title: 'Design da Interface',
          description: 'Criar wireframes',
          status: 'DEVELOPMENT' as any,
          priority: 'MEDIUM' as any,
          projectType: 'Design System',
          startDate: '2026-03-30',
          endDate: '2026-04-05',
          notes: 'Usar Figma',
          responsible: 'Maria Santos',
          observations: 'Seguir o design system corporativo',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          projectId: 'default',
          userId: 'current-user',
        },
        {
          id: 'task-3',
          title: 'Deploy em Produção',
          description: 'Fazer release v1.0',
          status: 'DONE' as any,
          priority: 'HIGH' as any,
          projectType: 'Web',
          startDate: '2026-03-25',
          endDate: '2026-03-28',
          notes: 'Versão estável',
          responsible: 'Pedro Costa',
          observations: 'Backup realizado com sucesso',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          projectId: 'default',
          userId: 'current-user',
        },
      ]
      setTasks(mockTasks)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar tarefas')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      alert('Título é obrigatório')
      return
    }
    
    const task: ExtendedTask = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      status: newTask.status as any,
      priority: newTask.priority as any,
      projectType: newTask.projectType as any,
      startDate: newTask.startDate,
      endDate: newTask.endDate,
      notes: newTask.notes,
      responsible: newTask.responsible,
      observations: newTask.observations,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      projectId: 'default',
      userId: 'current-user',
    }
    setTasks([...tasks, task])
    setNewTask({
      title: '',
      description: '',
      projectType: 'App',
      startDate: '',
      endDate: '',
      notes: '',
      responsible: '',
      observations: '',
      status: 'BACKLOG',
      priority: 'MEDIUM',
    })
    setShowNewTaskForm(false)
  }

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId)
  }

  const handleDragEnd = () => {
    setDraggedTaskId(null)
  }

  const handleDropOnColumn = (newStatus: string) => {
    if (!draggedTaskId) return
    
    setTasks(tasks.map(t => 
      t.id === draggedTaskId 
        ? { ...t, status: newStatus as any }
        : t
    ))
    setDraggedTaskId(null)
  }

  const handleDeleteTask = (taskId: string) => {
    if (!window.confirm('Deseja excluir esta tarefa permanentemente?')) {
      return
    }
    setTasks(tasks.filter(t => t.id !== taskId))
    setSelectedTask(null)
    setIsEditMode(false)
  }

  const handleOpenTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      setSelectedTask(task)
      setEditFormData(null)
      setIsEditMode(false)
    }
  }

  const handleEditTask = () => {
    if (selectedTask) {
      setEditFormData({ ...selectedTask })
      setIsEditMode(true)
    }
  }

  const handleSaveTask = () => {
    if (!editFormData) return
    if (!editFormData.title.trim()) {
      alert('Título é obrigatório')
      return
    }

    setTasks(tasks.map(t => 
      t.id === editFormData.id 
        ? { ...editFormData, updatedAt: new Date().toISOString() }
        : t
    ))
    setSelectedTask(editFormData)
    setIsEditMode(false)
  }

  const handleCloseModal = () => {
    setSelectedTask(null)
    setEditFormData(null)
    setIsEditMode(false)
  }

  const filteredTasks = tasks.filter(task => {
    if (filterProject !== 'all' && task.projectType !== filterProject) return false
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false
    return true
  })

  const transformTaskToCard = (task: ExtendedTask) => ({
    id: task.id,
    title: task.title,
    project: task.projectType || 'App',
    assignee: 'Usuário',
    priority: task.priority
  })

  const backlogTasks = filteredTasks
    .filter((t) => (t.status as any) === 'BACKLOG' || (t.status as any) === 'Backlog')
    .map(transformTaskToCard)

  const developmentTasks = filteredTasks
    .filter((t) => (t.status as any) === 'DEVELOPMENT' || (t.status as any) === 'Em Andamento' || (t.status as any) === 'IN_PROGRESS')
    .map(transformTaskToCard)

  const doneTasks = filteredTasks
    .filter((t) => (t.status as any) === 'DONE' || (t.status as any) === 'Concluído')
    .map(transformTaskToCard)

  const priorityLabel: Record<string, string> = {
    LOW: 'Baixa',
    MEDIUM: 'Média',
    HIGH: 'Alta',
  }

  const statusLabel: Record<string, string> = {
    BACKLOG: 'Backlog',
    DEVELOPMENT: 'Desenvolvimento',
    DONE: 'Concluído',
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-vedata-bg">
        <div className="text-vedata-text text-xl font-bold">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-vedata-bg p-4 md:p-8">
      <PageHeader 
        title="Quadro de Tarefas"
        description="Controle o progresso das suas tarefas por etapas."
        buttonText="Nova Tarefa"
        onButtonClick={() => setShowNewTaskForm(!showNewTaskForm)}
      />

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:gap-4 bg-vedata-white p-4 rounded-lg shadow-sm border border-vedata-accent">
        <div className="flex flex-col gap-2 md:flex-row md:gap-4 flex-1">
          <div className="flex flex-col">
            <label className="text-xs font-bold text-vedata-text mb-1 uppercase tracking-wider">Projeto</label>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="px-3 py-2 text-sm border border-vedata-accent rounded-lg bg-vedata-bg text-vedata-text hover:border-vedata-primary transition-colors focus:outline-none focus:ring-2 focus:ring-vedata-primary"
            >
              <option value="all">Todos</option>
              {PROJECT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-vedata-text mb-1 uppercase tracking-wider">Prioridade</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 text-sm border border-vedata-accent rounded-lg bg-vedata-bg text-vedata-text hover:border-vedata-primary transition-colors focus:outline-none focus:ring-2 focus:ring-vedata-primary"
            >
              <option value="all">Todas</option>
              <option value="LOW">Baixa</option>
              <option value="MEDIUM">Média</option>
              <option value="HIGH">Alta</option>
            </select>
          </div>
        </div>
        <div className="text-xs text-vedata-text opacity-60 font-medium">
          {filteredTasks.length} tarefa{filteredTasks.length !== 1 ? 's' : ''} exibida{filteredTasks.length !== 1 ? 's' : ''}
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">{error}</div>}

      {showNewTaskForm && (
        <div className="bg-vedata-white p-4 md:p-6 rounded-lg mb-6 border border-vedata-accent shadow-md">
          <h2 className="text-lg md:text-xl font-bold text-vedata-text mb-4 uppercase tracking-tight">Criar Nova Tarefa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-vedata-text mb-1 uppercase tracking-wider">Título *</label>
              <input
                type="text"
                placeholder="Título da tarefa"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-vedata-accent rounded-lg bg-vedata-bg text-vedata-text placeholder-vedata-text placeholder-opacity-40 focus:outline-none focus:ring-2 focus:ring-vedata-primary"
                autoFocus
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-vedata-text mb-1 uppercase tracking-wider">Descrição</label>
              <textarea
                placeholder="Descrição da tarefa"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-vedata-accent rounded-lg bg-vedata-bg text-vedata-text placeholder-vedata-text placeholder-opacity-40 focus:outline-none focus:ring-2 focus:ring-vedata-primary"
                rows={2}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-vedata-text mb-1 uppercase tracking-wider">Responsável</label>
              <input
                type="text"
                placeholder="Nome do responsável"
                value={newTask.responsible}
                onChange={(e) => setNewTask({ ...newTask, responsible: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-vedata-accent rounded-lg bg-vedata-bg text-vedata-text placeholder-vedata-text placeholder-opacity-40 focus:outline-none focus:ring-2 focus:ring-vedata-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-vedata-text mb-1 uppercase tracking-wider">Data de Início</label>
              <input
                type="date"
                value={newTask.startDate}
                onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-vedata-accent rounded-lg bg-vedata-bg text-vedata-text focus:outline-none focus:ring-2 focus:ring-vedata-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-vedata-text mb-1 uppercase tracking-wider">Data de Entrega</label>
              <input
                type="date"
                value={newTask.endDate}
                onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-vedata-accent rounded-lg bg-vedata-bg text-vedata-text focus:outline-none focus:ring-2 focus:ring-vedata-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-vedata-text mb-1 uppercase tracking-wider">Tipo de Projeto</label>
              <select
                value={newTask.projectType}
                onChange={(e) => setNewTask({ ...newTask, projectType: e.target.value as any })}
                className="w-full px-3 py-2 text-sm border border-vedata-accent rounded-lg bg-vedata-bg text-vedata-text focus:outline-none focus:ring-2 focus:ring-vedata-primary"
              >
                {PROJECT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-vedata-text mb-1 uppercase tracking-wider">Prioridade</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                className="w-full px-3 py-2 text-sm border border-vedata-accent rounded-lg bg-vedata-bg text-vedata-text focus:outline-none focus:ring-2 focus:ring-vedata-primary"
              >
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-vedata-text mb-1 uppercase tracking-wider">Observações</label>
              <textarea
                placeholder="Adicione observações, links ou informações adicionais"
                value={newTask.observations}
                onChange={(e) => setNewTask({ ...newTask, observations: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-vedata-accent rounded-lg bg-vedata-bg text-vedata-text placeholder-vedata-text placeholder-opacity-40 focus:outline-none focus:ring-2 focus:ring-vedata-primary"
                rows={3}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setShowNewTaskForm(false)}
              className="px-4 py-2 text-sm font-bold text-vedata-text hover:bg-vedata-bg rounded-lg transition-colors uppercase tracking-wider"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddTask}
              className="px-6 py-2 text-sm font-bold text-white bg-vedata-primary hover:bg-vedata-hover rounded-lg shadow-md transition-all uppercase tracking-widest"
            >
              Criar Tarefa
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4">
        <KanbanColumn 
          title="Backlog" 
          status="BACKLOG" 
          tasks={backlogTasks}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={() => handleDropOnColumn('BACKLOG')}
          onTaskClick={handleOpenTask}
          onTaskDelete={handleDeleteTask}
        />
        <KanbanColumn 
          title="Desenvolvimento" 
          status="DEVELOPMENT" 
          tasks={developmentTasks}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={() => handleDropOnColumn('DEVELOPMENT')}
          onTaskClick={handleOpenTask}
          onTaskDelete={handleDeleteTask}
        />
        <KanbanColumn 
          title="Concluído" 
          status="DONE" 
          tasks={doneTasks}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={() => handleDropOnColumn('DONE')}
          onTaskClick={handleOpenTask}
          onTaskDelete={handleDeleteTask}
        />
      </div>

      {/* =========================================================
          MODAL DE VISUALIZAÇÃO/EDIÇÃO DA TAREFA
          Abre ao clicar no card. Botão "X" exclusivo desta visualização.
      ========================================================= */}
      {selectedTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-vedata-white rounded-xl shadow-2xl w-full max-w-2xl border border-vedata-accent overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho do Modal */}
            <div className="flex items-start justify-between gap-3 px-6 py-4 border-b border-vedata-accent sticky top-0 bg-vedata-white">
              <h2
                id="modal-title"
                className="text-base font-bold text-vedata-text uppercase tracking-tight leading-snug flex-1"
              >
                {isEditMode ? 'Editar Tarefa' : selectedTask.title}
              </h2>

              {/* Botão X — fecha o modal (exclusivo desta visualização) */}
              <button
                type="button"
                title="Fechar"
                aria-label="Fechar detalhes da tarefa"
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg hover:bg-vedata-bg text-vedata-text hover:text-vedata-primary transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corpo do Modal */}
            <div className="px-6 py-5 space-y-4">
              {!isEditMode ? (
                // Modo Visualização
                <>
                  {/* Descrição */}
                  {selectedTask.description && (
                    <div className="flex gap-3">
                      <AlignLeft className="w-4 h-4 text-vedata-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-vedata-text opacity-50 uppercase tracking-widest mb-1">
                          Descrição
                        </p>
                        <p className="text-sm text-vedata-text">{selectedTask.description}</p>
                      </div>
                    </div>
                  )}

                  {/* Responsável */}
                  {selectedTask.responsible && (
                    <div className="flex gap-3">
                      <User className="w-4 h-4 text-vedata-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-vedata-text opacity-50 uppercase tracking-widest mb-1">
                          Responsável
                        </p>
                        <p className="text-sm font-semibold text-vedata-text">{selectedTask.responsible}</p>
                      </div>
                    </div>
                  )}

                  {/* Projeto, Prioridade e Status */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex gap-3">
                      <Layers className="w-4 h-4 text-vedata-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-vedata-text opacity-50 uppercase tracking-widest mb-1">
                          Projeto
                        </p>
                        <p className="text-sm font-semibold text-vedata-text">
                          {selectedTask.projectType || '—'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Tag className="w-4 h-4 text-vedata-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-vedata-text opacity-50 uppercase tracking-widest mb-1">
                          Prioridade
                        </p>
                        <p className="text-sm font-semibold text-vedata-text">
                          {priorityLabel[selectedTask.priority as string] || selectedTask.priority}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Tag className="w-4 h-4 text-vedata-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-vedata-text opacity-50 uppercase tracking-widest mb-1">
                          Status
                        </p>
                        <p className="text-sm font-semibold text-vedata-text">
                          {statusLabel[selectedTask.status as string] || selectedTask.status}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Datas */}
                  {(selectedTask.startDate || selectedTask.endDate) && (
                    <div className="flex gap-3">
                      <Calendar className="w-4 h-4 text-vedata-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-vedata-text opacity-50 uppercase tracking-widest mb-1">
                          Período
                        </p>
                        <p className="text-sm text-vedata-text">
                          <strong>Início:</strong> {selectedTask.startDate || '—'} | <strong>Entrega:</strong> {selectedTask.endDate || '—'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Observações */}
                  {selectedTask.observations && (
                    <div className="flex gap-3">
                      <AlignLeft className="w-4 h-4 text-vedata-accent mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-vedata-text opacity-50 uppercase tracking-widest mb-1">
                          Observações
                        </p>
                        <p className="text-sm text-vedata-text whitespace-pre-wrap break-words">{selectedTask.observations}</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // Modo Edição
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-vedata-text mb-1 uppercase tracking-wider">Título *</label>
                    <input
                      type="text"
                      value={editFormData?.title || ''}
                      onChange={(e) => setEditFormData(editFormData ? { ...editFormData, title: e.target.value } : null)}
                      className="w-full px-3 py-2 text-sm border border-vedata-accent rounded-lg bg-vedata-bg text-vedata-text focus:outline-none focus:ring-2 focus:ring-vedata-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-vedata-text mb-1 uppercase tracking-wider">Descrição</label>
                    <textarea
                      value={editFormData?.description || ''}
                      onChange={(e) => setEditFormData(editFormData ? { ...editFormData, description: e.target.value } : null)}
                      className="w-full px-3 py-2 text-sm border border-vedata-accent rounded-lg bg-vedata-bg text-vedata-text focus:outline-none focus:ring-2 focus:ring-vedata-primary"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-vedata-text mb-1 uppercase tracking-wider">Responsável</label>
                    <input
                      type="text"
                      value={editFormData?.responsible || ''}
                      onChange={(e) => setEditFormData(editFormData ? { ...editFormData, responsible: e.target.value } : null)}
                      className="w-full px-3 py-2 text-sm border border-vedata-accent rounded-lg bg-vedata-bg text-vedata-text focus:outline-none focus:ring-2 focus:ring-vedata-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-vedata-text mb-1 uppercase tracking-wider">Data de Início</label>
                      <input
                        type="date"
                        value={editFormData?.startDate || ''}
                        onChange={(e) => setEditFormData(editFormData ? { ...editFormData, startDate: e.target.value } : null)}
                        className="w-full px-3 py-2 text-sm border border-vedata-accent rounded-lg bg-vedata-bg text-vedata-text focus:outline-none focus:ring-2 focus:ring-vedata-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-vedata-text mb-1 uppercase tracking-wider">Data de Entrega</label>
                      <input
                        type="date"
                        value={editFormData?.endDate || ''}
                        onChange={(e) => setEditFormData(editFormData ? { ...editFormData, endDate: e.target.value } : null)}
                        className="w-full px-3 py-2 text-sm border border-vedata-accent rounded-lg bg-vedata-bg text-vedata-text focus:outline-none focus:ring-2 focus:ring-vedata-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-vedata-text mb-1 uppercase tracking-wider">Projeto</label>
                      <select
                        value={editFormData?.projectType || 'App'}
                        onChange={(e) => setEditFormData(editFormData ? { ...editFormData, projectType: e.target.value as any } : null)}
                        className="w-full px-3 py-2 text-sm border border-vedata-accent rounded-lg bg-vedata-bg text-vedata-text focus:outline-none focus:ring-2 focus:ring-vedata-primary"
                      >
                        {PROJECT_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-vedata-text mb-1 uppercase tracking-wider">Prioridade</label>
                      <select
                        value={editFormData?.priority || 'MEDIUM'}
                        onChange={(e) => setEditFormData(editFormData ? { ...editFormData, priority: e.target.value as any } : null)}
                        className="w-full px-3 py-2 text-sm border border-vedata-accent rounded-lg bg-vedata-bg text-vedata-text focus:outline-none focus:ring-2 focus:ring-vedata-primary"
                      >
                        <option value="LOW">Baixa</option>
                        <option value="MEDIUM">Média</option>
                        <option value="HIGH">Alta</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-vedata-text mb-1 uppercase tracking-wider">Observações</label>
                    <textarea
                      value={editFormData?.observations || ''}
                      onChange={(e) => setEditFormData(editFormData ? { ...editFormData, observations: e.target.value } : null)}
                      className="w-full px-3 py-2 text-sm border border-vedata-accent rounded-lg bg-vedata-bg text-vedata-text focus:outline-none focus:ring-2 focus:ring-vedata-primary"
                      rows={3}
                      placeholder="Adicione observações, links ou informações adicionais"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé do Modal */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-vedata-accent bg-vedata-bg sticky bottom-0">
              <button
                type="button"
                onClick={() => handleDeleteTask(selectedTask.id)}
                className="px-4 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-md transition-all uppercase tracking-widest"
              >
                Excluir
              </button>

              <div className="flex gap-3">
                {isEditMode ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditMode(false)}
                      className="px-4 py-2 text-sm font-bold text-vedata-text hover:bg-vedata-white rounded-lg transition-colors uppercase tracking-wider border border-vedata-accent"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveTask}
                      className="px-6 py-2 text-sm font-bold text-white bg-vedata-primary hover:bg-vedata-hover rounded-lg shadow-md transition-all uppercase tracking-widest"
                    >
                      Salvar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 text-sm font-bold text-vedata-text hover:bg-vedata-white rounded-lg transition-colors uppercase tracking-wider border border-vedata-accent"
                    >
                      Fechar
                    </button>
                    <button
                      type="button"
                      onClick={handleEditTask}
                      className="px-6 py-2 text-sm font-bold text-white bg-vedata-primary hover:bg-vedata-hover rounded-lg shadow-md transition-all uppercase tracking-widest"
                    >
                      Editar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
