# 📋 Relatório de Snapshot Técnico: Vedata WorkHub

Este documento serve como a fonte oficial da verdade para a estrutura técnica e visual do projeto **Vedata WorkHub**, garantindo a continuidade e evitando edições em ficheiros obsoletos.

---

## 1. 📂 Mapeamento de Caminhos (Ficheiros Editados)

Para evitar a edição de "ficheiros fantasmas" ou de cópias de backup, os ficheiros exatos que compõem a nova interface são:

| Componente | Caminho Completo (a partir da raiz do projeto) |
|------------|-----------------------------------------------|
| **PageHeader** | `/frontend/src/shared/components/PageHeader.tsx` |
| **KanbanColumn** | `/frontend/src/features/tasks/components/KanbanColumn.tsx` |
| **KanbanCard** | `/frontend/src/features/tasks/components/KanbanCard.tsx` |
| **KanbanPage** | `/frontend/src/features/tasks/pages/KanbanPage.tsx` |
| **Navbar** | `/frontend/src/shared/components/Navbar.tsx` |
| **LoginPage** | `/frontend/src/features/auth/pages/LoginPage.tsx` |
| **Index HTML** | `/frontend/index.html` |

---

## 2. 🎨 Alterações de CSS e Layout Aplicadas

### **Grid do Kanban (Crítico)**
*   **Container Pai** (`KanbanPage.tsx`): Aplicadas as classes `flex w-full gap-6 pb-4 overflow-x-auto`.
*   **Colunas** (`KanbanColumn.tsx`): Cada coluna utiliza `flex-1` para garantir que ocupam 100% da largura do ecrã de forma equilibrada.

### **Cores de Status (Tailwind)**
Configuradas no objeto `statusConfig` dentro de `KanbanColumn.tsx`:
*   **Backlog**: `bg-slate-600` (Slate)
*   **TODO**: `bg-blue-600` (Blue)
*   **In Progress**: `bg-amber-500` (Amber)
*   **DONE**: `bg-emerald-600` (Emerald)

### **Estilo dos Cards**
*   Removido o ícone 'U'.
*   Aplicada a classe `hover:scale-[1.03]` para animação de destaque.
*   Aplicada sombra suave com `shadow-sm` e `hover:shadow-md`.

---

## 3. 🏷️ Estado do Rebranding

O nome **'Vedata WorkHub'** foi injetado nos seguintes locais:
1.  **Metadados**: `<title>` no `/frontend/index.html`.
2.  **Header**: Componente `Navbar.tsx` com gradiente `from-indigo-600 to-purple-700`.
3.  **Login**: Título `<h1>` no `LoginPage.tsx`.
4.  **Projeto**: Campo `name` no `/frontend/package.json` e `pom.xml`.

---

## 4. 🔗 Conexão Localhost (Frontend -> Backend)

*   **URL Base**: O frontend comunica com o backend via proxy configurado em `vite.config.ts`.
*   **Target**: `http://localhost:8080`
*   **Prefixo**: Todas as chamadas para `/api/*` são encaminhadas para o backend Spring Boot.

---

## 5. 🐛 Correções Aplicadas (04 de Abril de 2026)

### **Problema 1 — Loop de Redirecionamento (ERR_TOO_MANY_REDIRECTS)**

| Campo | Detalhe |
|-------|---------|
| **Arquivo** | `src/main/java/com/vedata-workhub/config/SecurityConfig.java` |
| **Causa** | O `authenticationEntryPoint` redirecionava requisições de página não autenticadas para `/`, que redirecionava para `/tarefas` (protegida), que redirecionava para `/login`, criando um loop infinito. |
| **Correção** | Alterado `SessionCreationPolicy` para `STATELESS`. O `authenticationEntryPoint` agora retorna sempre `401 JSON` (nunca redireciona). Todas as rotas SPA (`/login`, `/tarefas`, `/dashboard`) foram declaradas como `permitAll()` — o React cuida da autenticação no frontend. Apenas `/api/**` requer autenticação no backend. |

### **Problema 2 — Proxy do Vite com Rewrite Incorreto**

| Campo | Detalhe |
|-------|---------|
| **Arquivo** | `frontend/vite.config.ts` |
| **Causa** | O proxy removia o prefixo `/api` antes de encaminhar ao backend (`/api/auth/login` → `/auth/login`), mas o `AuthRestController` está mapeado em `/api/auth`. Todas as chamadas de API falhavam com 404. |
| **Correção** | Removida a linha `rewrite: (path) => path.replace(/^\/api/, '')`. O prefixo `/api` é agora preservado. |

### **Problema 3 — `baseURL` Absoluto no Cliente Axios**

| Campo | Detalhe |
|-------|---------|
| **Arquivo** | `frontend/src/shared/services/api.ts` |
| **Causa** | O cliente Axios usava `http://localhost:8080` como `baseURL`, ignorando o proxy do Vite em desenvolvimento e causando problemas de CORS. |
| **Correção** | `baseURL` alterado para `''` (string vazia). Em desenvolvimento, o proxy do Vite intercepta `/api/*`. Em produção, o Spring Boot serve diretamente. |

### **Problema 4 — `index.html` Estático Corrompido**

| Campo | Detalhe |
|-------|---------|
| **Arquivo** | `src/main/resources/static/index.html` |
| **Causa** | O arquivo referenciava `/main.tsx` (entrypoint de desenvolvimento), não os assets compilados do Vite. O frontend nunca havia sido buildado para produção. |
| **Correção** | Executado `npm run build` na pasta `frontend/`. Os arquivos compilados foram copiados para `src/main/resources/static/`. |

### **Problema 5 — Conflito de Mapeamento no DashboardController**

| Campo | Detalhe |
|-------|---------|
| **Arquivo** | `src/main/java/com/vedata-workhub/domain/dashboard/controller/DashboardController.java` |
| **Causa** | O `DashboardController` era um `@Controller` MVC mapeado em `"/"` e `"/dashboard"`, conflitando com o `SpaController` que também mapeava `"/"`. Isso causava `HTTP 500 - Ambiguous handler methods`. |
| **Correção** | Convertido para `@RestController` com mapeamento em `/api/dashboard`. O dashboard é agora renderizado pelo React, e os dados são fornecidos via API REST. |

### **Problema 6 — SpaController Interceptando Assets Estáticos**

| Campo | Detalhe |
|-------|---------|
| **Arquivo** | `src/main/java/com/vedata-workhub/config/SpaController.java` |
| **Causa** | O padrão `/{path:[^\\.]+}/**` capturava `/assets/index-DeKribOo.js` e retornava `index.html` em vez do arquivo JS. O React não conseguia carregar. |
| **Correção** | Adicionada exclusão explícita de prefixos reservados (`api`, `assets`, `h2-console`, `actuator`, `admin`, `static`) na regex do `SpaController`. |

### **Problema 7 — Banco de Dados Supabase Inacessível**

| Campo | Detalhe |
|-------|---------|
| **Arquivo** | `src/main/resources/application.properties` e `application.yml` |
| **Causa** | O host `db.drstjqohcglxhszcddgg.supabase.co` não estava acessível no ambiente de desenvolvimento, causando falha na inicialização do Spring Boot. |
| **Correção** | Configurado H2 in-memory como banco padrão para desenvolvimento. As configurações do Supabase foram comentadas e podem ser reativadas para produção. |

---

## 6. 🛠️ Como Executar o Projeto

### **Modo Desenvolvimento (Frontend + Backend separados):**
```bash
# Terminal 1: Backend Spring Boot (porta 8080)
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
mvn spring-boot:run -DskipTests

# Terminal 2: Frontend Vite (porta 5173, com proxy para 8080)
cd frontend
npm run dev
```

### **Modo Produção (Build completo em localhost:8080):**
```bash
# 1. Build do frontend
cd frontend
npm install
npm run build

# 2. Copiar build para o static do Spring
cp -r dist/. ../src/main/resources/static/

# 3. Compilar e executar o backend
cd ..
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
mvn package -DskipTests
java -jar target/vedata-workhub-1.0.0.war
```

### **Para usar Supabase em produção:**
Edite `src/main/resources/application.properties` e descomente as linhas do PostgreSQL, comentando as linhas do H2.

---

## 7. ✅ Validação Final

| Rota | HTTP Status | Redirects | Resultado |
|------|-------------|-----------|-----------|
| `GET /` | 200 | 0 | ✅ Serve index.html → React redireciona para `/login` |
| `GET /login` | 200 | 0 | ✅ Página de login renderizada |
| `GET /tarefas` | 200 | 0 | ✅ Serve index.html → React verifica auth |
| `GET /assets/*.js` | 200 | 0 | ✅ JavaScript servido com `text/javascript` |
| `GET /assets/*.css` | 200 | 0 | ✅ CSS servido com `text/css` |
| `POST /api/auth/login` | 401/200 | 0 | ✅ API REST funcional |

---

**Data do Snapshot**: 04 de Abril de 2026
**Responsável**: Manus (Engenheiro Sénior)
**Versão**: 2.0 (Pós-Correção ERR_TOO_MANY_REDIRECTS)
