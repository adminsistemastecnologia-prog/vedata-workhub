# Frontend Setup - TaskFlow React

## 🚀 Iniciar o Desenvolvimento

### 1. Instalar Dependências

```bash
cd frontend
npm install
```

### 2. Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse: **http://localhost:5173**

### 3. Credenciais de Teste

- Email: `admin@vedata-workhub.com`
- Senha: `password`

## 📁 Estrutura do Frontend

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Navbar.tsx       # Barra de navegação
│   │   └── ProtectedRoute   # Proteção de rotas autenticadas
│   ├── pages/               # Páginas (telas) da aplicação
│   │   ├── LoginPage        # Tela de login
│   │   ├── RegisterPage     # Tela de registro
│   │   ├── DashboardPage    # Dashboard principal
│   │   ├── ProjectsPage     # Lista de projetos
│   │   └── KanbanPage       # Quadro Kanban
│   ├── services/
│   │   └── api.ts           # Cliente Axios - chamadas HTTP para backend
│   ├── context/
│   │   └── AuthContext.tsx  # Context para autenticação global
│   ├── hooks/
│   │   └── useAuth.ts       # Hook para acessar autenticação
│   ├── types/
│   │   └── index.ts         # Tipos TypeScript compartilhados
│   ├── App.tsx              # Componente raiz
│   └── main.tsx             # Entrada da aplicação
├── public/
│   └── index.html           # HTML principal
├── vite.config.ts           # Configuração Vite + proxy para API
├── tsconfig.json            # Configuração TypeScript
├── package.json             # Dependências
└── README.md                # Documentação detalhada
```

## 🔗 Integração Backend-Frontend

### Como Funciona

```
Browser (React)  ←→  Vite Dev Server  ←→  Spring Boot Backend
localhost:5173        (proxy)              localhost:8080
```

- Requisições para `/api/*` são automaticamente redirecionadas para o backend
- Exemplo: `POST /api/auth/login` → `POST http://localhost:8080/auth/login`

### Serviço API

No `src/services/api.ts` tem a classe `apiClient` com todos os métodos:

```typescript
// Autenticação
await apiClient.login(email, password)
await apiClient.register(email, password, name)
await apiClient.logout()

// Projetos
await apiClient.getProjects()
await apiClient.createProject(name, description)
await apiClient.deleteProject(id)

// Tarefas
await apiClient.getTasks(projectId)
await apiClient.createTask(projectId, title, description, priority)
```

## 🔐 Autenticação com Context API

```typescript
import { useAuth } from '../hooks/useAuth'

export default function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth()
  
  return (
    <div>
      {isAuthenticated && <p>Logado como: {user?.email}</p>}
    </div>
  )
}
```

## 🎨 Tecnologias Usadas

- **React 18** - Biblioteca UI
- **TypeScript** - Segurança de tipos
- **Vite** - Bundler rápido (dev em <100ms)
- **React Router** - Navegação entre páginas
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Estilos utilitários
- **Lucide React** - Ícones

## 📦 Scripts NPM

```bash
npm run dev        # Inicia servidor de desenvolvimento
npm run build      # Build para produção
npm run preview    # Preview do build
npm run lint       # Verifica erros de código
npm run format     # Formata código com Prettier
```

## ⚙️ Antes de Iniciar

**Certifique-se de que:**

1. ✅ Backend Spring Boot está rodando: `mvn spring-boot:run`
2. ✅ Node.js 16+ está instalado: `node -v`
3. ✅ Dependências npm instaladas: `npm install`
4. ✅ Database Supabase configurada (application-local.yml)

## 🚀 Próximas Funcionalidades para Implementar

- [ ] Drag-and-drop de tarefas no Kanban
- [ ] Filtros e busca de projetos
- [ ] Editar projeto
- [ ] Comentários em tarefas
- [ ] Notificações em tempo real
- [ ] Upload de anexos nas tarefas
- [ ] Gráficos de progresso
- [ ] Dark mode (já tem estilos base)

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### CORS Error ao chamar API
- Certifique-se que o backend tem CORS habilitado
- Verifique se `vite.config.ts` tem proxy configurado
- Backend deve estar em `http://localhost:8080`

### Porta 5173 já está em uso
```bash
npm run dev -- --port 5174
```

## 📚 Documentação Completa

Veja [frontend/README.md](../frontend/README.md) para documentação detalhada.
