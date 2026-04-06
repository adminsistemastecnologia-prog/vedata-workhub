# 🚀 Vedata WorkHub: Quick Start Guide

Bem-vindo ao Vedata WorkHub! Este documento combina instruções rápidas, configuração local e troubleshooting.

---

## 📋 Prerequisites

- ✅ Java 21 (ou superior) instalado
- ✅ Maven 3.9+ instalado
- ✅ Node.js 18+ e npm instalado
- ✅ Git instalado
- ✅ Arquivo `.env` configurado (veja seção "Local Setup")

---

## ⚡ Quick Start - 2 Terminais PowerShell

### Terminal 1️⃣ - Backend (Spring Boot)

Abra PowerShell e cole:

```powershell
cd C:\Users\samar\vedata-workhub-fixed
$env:SPRING_PROFILES_ACTIVE="local"
mvn spring-boot:run
```

**Aguarde até ver:**
```
Tomcat initialized with port(s): 8080 (http)
```

✅ **Backend rodando em http://localhost:8080**

---

### Terminal 2️⃣ - Frontend (React)

Abra **novo** PowerShell e cole:

```powershell
cd C:\Users\samar\vedata-workhub-fixed\frontend
npm run dev
```

**Aguarde até ver:**
```
VITE v5.4.21  ready in XXX ms
Local: http://localhost:5173/
```

✅ **Frontend rodando em http://localhost:5173**

---

## 🌐 Acessar a Aplicação

1. Abra seu navegador: **http://localhost:5173**
2. Faça login com credenciais padrão:
   - **Email:** `admin@vedata-workhub.com`
   - **Senha:** `admin123`
3. Pronto! 🎉 Você está dentro do TaskFlow

---

## 🤖 Automatic Scripts (Opcional)

Se preferir não abrir 2 terminais manualmente:

### Opção A - PowerShell automático (Recomendado)

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\run-dev-servers.ps1
```

Isso abre 2 terminais automaticamente. Ambos os serviços iniciarão em paralelo.

---

## 🔧 Local Setup - Configurar Credenciais

### Passo 1: Preparar arquivo de configuração

```powershell
cp src/main/resources/application-local.yml.example src/main/resources/application-local.yml
```

### Passo 2: Escolher sua fonte de dados

**Opção A - PostgreSQL Local (ATIVO POR PADRÃO)**

Arquivo `application-local.yml` já está configurado para:
- Host: `localhost:5432`
- Database: `vedata-workhub_dev`
- Username: `postgres`
- Password: `postgres`

Se seu PostgreSQL local usa essas credenciais, **nenhuma mudança necessária**.

**Opção B - Supabase Cloud**

Se preferir usar Supabase:

1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Abra seu projeto → Settings → Database
3. Copie as credenciais (Connection Pooler host)
4. Edite `application-local.yml` e descomente a Opção 2:

```yaml
# Descomente a seção abaixo para Supabase Cloud
# datasource:
#   url: jdbc:postgresql://aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require
#   username: postgres.drstjqohcglxhszcddgg
#   password: CxvyXasW4G7YSLjE
```

Substitua pelos seus valores reais.

### Passo 3 (Se usar Supabase): Configurar `.env`

Crie arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8080/api
DB_HOST=aws-1-us-east-1.pooler.supabase.com
DB_USER=postgres.seu_project_id
DB_PASSWORD=sua_senha_aqui
```

⚠️ **IMPORTANTE**: Arquivo `.env` está no `.gitignore` - nunca será versionado.

---

## 📸 Expected Output

### Terminal 1 (Backend) ✅
```
INFO  com.vedata-workhub.TaskFlowApplication - Starting TaskFlowApplication using Java 21
INFO  com.vedata-workhub.TaskFlowApplication - The following 1 profile is active: "local"
...
INFO  o.s.b.w.e.tomcat.TomcatWebServer - Tomcat started on port(s): 8080 (http)
```

### Terminal 2 (Frontend) ✅
```
VITE v5.4.21  ready in 467 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Browser ✅
```
[TaskFlow Logo]
Email: _______________
Senha: _______________
[Entrar] [Criar uma conta]
```

---

## 🐛 Troubleshooting

### ❌ Terminal 1: "Cannot execute Maven"
**Solução**: Maven não está instalado ou não está no PATH
```powershell
# Verificar Maven
mvn --version

# Se não funcionar, instale Maven 3.9+
# Download: https://maven.apache.org/download.cgi
```

### ❌ Terminal 2: "npm: command not found"
**Solução**: Node.js não está instalado
```powershell
# Download e instale: https://nodejs.org/
# Depois reinicie o PowerShell
node --version
npm --version
```

### ❌ Port 5173 already in use
**Solução**: Outra aplicação está usando a porta
```powershell
# Kill processo na porta 5173
netstat -ano | findstr "5173"
taskkill /PID <PID_NUMBER> /F

# Ou mude a porta no vite.config.ts
```

### ❌ Port 8080 already in use
**Solução**: Outro serviço está usando a porta backend
```powershell
# Kill processo na porta 8080
netstat -ano | findstr "8080"
taskkill /PID <PID_NUMBER> /F
```

### ❌ "Cannot find module" (Frontend)
**Solução**: Dependências npm não instaladas
```powershell
cd C:\Users\samar\vedata-workhub-fixed\frontend
rm -r node_modules package-lock.json
npm install
npm run dev
```

### ❌ "Driver org.postgresql.Driver claims to not accept jdbcUrl"
**Solução**: Credenciais de banco incorretas ou arquivo não encontrado
```powershell
# Verifique se application-local.yml foi criado
Get-Item src/main/resources/application-local.yml

# Se não existir, copie novamente
cp src/main/resources/application-local.yml.example src/main/resources/application-local.yml

# Verifique se PostgreSQL está rodando (se usar local)
```

### ❌ Frontend conecta mas mostra página branca
**Solução**: Erro no console do navegador
1. Abra DevTools: Pressione **F12**
2. Vá para aba **Console**
3. Procure por mensagens de erro
4. Verifique se backend está respondendo: `curl http://localhost:8080`

### ❌ Login falha com "Invalid credentials"
**Solução**: Usuário padrão não foi criado no banco
```powershell
# O arquivo sql/schema.sql já inclui insert do admin@vedata-workhub.com
# Se não aparecer:

# 1. Verifique se banco foi criado:
Get-Item sql/schema.sql

# 2. Manual execute no seu PostgreSQL:
psql -U postgres -d vedata-workhub_dev -f sql/schema.sql

# 3. Tente login novamente com admin@vedata-workhub.com / admin123
```

---

## 🔐 Boas Práticas de Segurança

1. ✅ Nunca committe `application-local.yml` (já no `.gitignore`)
2. ✅ Nunca compartilhe senhas via chat/email  
3. ✅ Supabase: Mude a senha padrão do banco imediatamente
4. ✅ Em produção: Use variáveis de ambiente, nunca credenciais em arquivos

---

## 📚 Estrutura de Configuração

```
src/main/resources/
├── application.yml                 # Configuração Base (porta, profiles ativa)
├── application-local.yml           # Configuração LOCAL (seu computador)
├── application-local.yml.example   # Template (safe to share)
├── application-prod.yml            # Configuração PROD (Firebase deployment)
└── logback-spring.xml              # Logging config
```




Se nenhum dos passos acima funcionar, me envie:
1. Screenshot do erro
2. Qual terminal deu o erro?
3. Qual sistema operacional?
