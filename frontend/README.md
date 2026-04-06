# TaskFlow Frontend

Frontend React + TypeScript para o sistema de gerenciamento de projetos TaskFlow.

## 📁 Estrutura do Projeto

```
frontend/
├── public/                 # Arquivos estáticos (HTML, ícones, etc)
│   └── index.html         # Arquivo HTML principal
├── src/
│   ├── components/        # Componentes React reutilizáveis
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── context/           # Context API para estado global
│   │   └── AuthContext.tsx
│   ├── pages/            # Páginas (telas) da aplicação
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ProjectsPage.tsx
│   │   └── KanbanPage.tsx
│   ├── services/         # Serviços (chamadas HTTP para API)
│   │   └── api.ts        # Cliente Axios para comunicação com Spring Boot
│   ├── hooks/            # Custom React hooks
│   │   └── useAuth.ts    # Hook para acessar contexto de autenticação
│   ├── types/            # Tipos e interfaces TypeScript
│   │   └── index.ts      # Definições de tipos compartilhados
│   ├── App.tsx           # Componente raiz da aplicação
│   ├── main.tsx          # Entrada da aplicação React
│   └── index.css         # Estilos globais
├── vite.config.ts        # Configuração do Vite (bundler)
├── tsconfig.json         # Configuração do TypeScript
├── package.json          # Dependências do projeto
└── README.md             # Este arquivo
```

## 🚀 Quick Start

### Pré-requisitos

- Node.js 16+ e npm/yarn
- Backend Spring Boot rodando em `http://localhost:8080`

### Instalação

```bash
cd frontend
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Aplicação estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
npm run preview
```

## 🔌 Integração com Backend Spring Boot

O frontend comunica com o backend via **API REST** através do Axios.

### Configuração do Proxy

O arquivo `vite.config.ts` configura um proxy que redireciona todas as requisições `/api/*` para o backend:

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

**Exemplo:** Requisição `/api/projects` no frontend → `/projects` no backend

### Serviço API (`src/services/api.ts`)

Classe `ApiClient` centraliza todas as chamadas HTTP:

```typescript
// Login
const user = await apiClient.login(email, password)

// Projetos
const projects = await apiClient.getProjects()
const project = await apiClient.getProject(id)
await apiClient.createProject(name, description)

// Tarefas
const tasks = await apiClient.getTasks(projectId)
await apiClient.createTask(projectId, title, description, priority)
```

## 🔐 Autenticação

### Context API para Estado Global

`AuthContext` (em `src/context/AuthContext.tsx`) gerencia:
- `user` - Usuário autenticado
- `isAuthenticated` - Se está logado
- `login()` - Função para fazer login
- `logout()` - Função para fazer logout
- `register()` - Função para criar conta

### Uso em Componentes

```typescript
import { useAuth } from '../hooks/useAuth'

export default function MyComponent() {
  const { user, login, logout } = useAuth()
  
  // Usar user, login, logout...
}
```

### Rotas Protegidas

Componente `ProtectedRoute` protege rotas que exigem autenticação:

```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

## 📝 Páginas Principais

### LoginPage (`src/pages/LoginPage.tsx`)
- Formulário de login (email + senha)
- Link para criar conta
- Tratamento de erros

### RegisterPage (`src/pages/RegisterPage.tsx`)
- Formulário de registro (nome + email + senha)
- Link para fazer login

### DashboardPage (`src/pages/DashboardPage.tsx`)
- Overview com estatísticas
- Cards: Projetos, Tarefas, Membros da equipe

### ProjectsPage (`src/pages/ProjectsPage.tsx`)
- Lista de projetos do usuário
- Criar novo projeto
- Deletar projeto

### KanbanPage (`src/pages/KanbanPage.tsx`)
- Quadro Kanban com 4 colunas: TODO, IN_PROGRESS, REVIEW, DONE
- Tarefas agrupadas por status
- Prioridades com cores

## 🎨 Estilos

Projeto usa **Tailwind CSS** (pré-configurado no `index.css` com variáveis CSS customizadas).

### Temas de Cores

```css
--primary: #3b82f6        (Azul)
--secondary: #10b981      (Verde)
--danger: #ef4444         (Vermelho)
--warning: #f59e0b        (Amarelo)
--gray-{50..900}          (Escala de cinzas)
```

## 📦 Dependências Principais

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.2",
  "lucide-react": "^0.294.0",
  "typescript": "^5.2.2",
  "vite": "^5.0.2"
}
```

## 🐛 Troubleshooting

### CORS Errors
Se receber erro de CORS, verifique se:
1. Backend está rodando em `http://localhost:8080`
2. Backend tem CORS configurado para aceitar requisições do frontend
3. Proxy no `vite.config.ts` está correto

### Requisição retorna 401 (Unauthorized)
- Token de autenticação pode estar expirado
- Usuário precisa fazer login novamente
- AuthContext automaticamente redireciona para `/login`

### Módulos não encontrados após install
```bash
rm -rf node_modules
npm install
npm run dev
```

## 🔄 Workflow de Desenvolvimento

1. **Componente novo** → criar em `src/components/` ou `src/pages/`
2. **Tipo TypeScript novo** → adicionar em `src/types/index.ts`
3. **Chamar API** → usar `apiClient` de `src/services/api.ts`
4. **Estado global** → usar `AuthContext` ou estender com novo Context
5. **Estilos** → usar classes Tailwind no JSX

## 📚 Documentação Útil

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Router](https://reactrouter.com)
- [Axios Docs](https://axios-http.com)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)

## 🤝 Contributing

1. Criar branch: `git checkout -b feature/minha-feature`
2. Commit: `git commit -m "feat: descrição"`
3. Push: `git push origin feature/minha-feature`
4. Pull Request

## 📄 License

MIT
