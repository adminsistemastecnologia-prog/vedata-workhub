# TaskFlow - Guia de Configuração Supabase

## 📋 Estrutura de Configuração

A aplicação utiliza uma arquitetura de configuração flexível que separa credenciais de código:

```
application.yml          → Configuração padrão (com variáveis de ambiente)
application-dev.yml      → Perfil de desenvolvimento (valores locais)
.env                     → Credenciais do Supabase (NÃO versionado no Git)
.env.example             → Template com instruções
```

## 🔐 Passo 1: Configurar Credenciais do Supabase

### 1.1 Copie o arquivo template:
```powershell
copy .env.example .env
```

### 1.2 Obtenha suas credenciais no Supabase:

1. Acesse https://app.supabase.com → Seu Projeto
2. Vá para **Settings** → **Database**
3. Adicione sua senha do banco de dados
4. Copie a **Connection String** no formato:

```
postgresql://postgres.[projectId]:[password]@[host]:[port]/postgres
```

### 1.3 Preencha o arquivo `.env`:

```bash
DB_HOST=aws-1-us-east-1.pooler.supabase.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres.seuProjectId
DB_PASSWORD=suaSenhaAqui
DB_POOL_SIZE=5
JWT_SECRET=sua_chave_super_segura
```

## 🚀 Passo 2: Executar

### Opção A: Usar perfil de desenvolvimento (banco local)
```powershell
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

### Opção B: Usar variáveis de ambiente do Supabase
```powershell
# 1. Primeiro configure as variáveis
.\setup-env.ps1

# 2. Depois execute
mvn spring-boot:run
```

## 🔍 Como Verificar a Conexão

Os logs mostrarão informações detalhadas:

```
DEBUG com.vedata-workhub.TaskFlowApplication - Banco de dados: jdbc:postgresql://...
DEBUG org.postgresql - Conectando ao servidor PostgreSQL
```

## ⚠️ Troubleshooting

### Erro: "Connection refused"
- Verifique se a URL do host está correta
- Verifique se não há firewall bloqueando (Supabase deve estar acessível)
- Verifique credenciais no `.env`

### Erro: "password authentication failed"
- Redefina a senha do banco em Supabase Settings → Database
- Atualize `DB_PASSWORD` no `.env`

### Erro: "database does not exist"
- Verifique se `DB_NAME=postgres` está correto
- Use sempre `postgres` como Database Name (é o default do Supabase)

## 📁 Segurança

- ✅ `.env` está no `.gitignore` (não será commitado)
- ✅ Credenciais como variáveis de ambiente (não no código)
- ⚠️ Nunca commit o arquivo `.env` com credenciais reais
- ⚠️ Use JWT_SECRET forte em produção

## 🎯 Padrão Recomendado

Para equipes, use este fluxo:

1. **Desenvolvimento local**: Use `application-dev.yml` com PostgreSQL local
2. **Staging/Produção**: Use variáveis de ambiente do Supabase
3. **CI/CD**: Configure secrets no GitHub Actions / Azure DevOps
