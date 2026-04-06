import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './features/auth/context/AuthContext'
import ProtectedRoute from './shared/components/ProtectedRoute'
import Navbar from './shared/components/Navbar'
import LoginPage from './features/auth/pages/LoginPage'
// import RegisterPage from './features/auth/pages/RegisterPage'
import KanbanPage from './features/tasks/pages/KanbanPage'

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rota pública de login */}
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/register" element={<RegisterPage />} /> */}

          {/* Rota protegida principal */}
          <Route
            path="/tarefas"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <KanbanPage />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />

          {/*
            CORREÇÃO: A rota raiz "/" redireciona para "/tarefas".
            O ProtectedRoute cuida do redirecionamento para "/login" se não autenticado.
            A rota wildcard "*" redireciona para "/" (e não diretamente para "/tarefas")
            para evitar loops caso uma rota inválida seja acessada durante o carregamento.
          */}
          <Route path="/" element={<Navigate to="/tarefas" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
