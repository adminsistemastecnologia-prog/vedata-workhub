export interface User {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  description: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  projectId: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface TaskComment {
  id: string
  content: string
  taskId: string
  userId: string
  createdAt: string
  updatedAt: string
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
  timestamp: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface DashboardStats {
  totalProjects: number
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
}
