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
3. Pronto! 🎉 Você está dentro do Vedata WorkHub
