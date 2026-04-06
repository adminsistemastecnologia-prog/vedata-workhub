# Vedata WorkHub — Sistema de Gestão de Projetos e Tarefas

> **Vedata WorkHub** é uma solução web exclusiva e robusta para gerenciamento de projetos e tarefas, desenvolvida para uso interno da empresa. O sistema utiliza uma arquitetura moderna com **Spring Boot** no backend e uma integração fluida com o **Supabase** (PostgreSQL) para persistência de dados.

## 🎯 Objetivo do Projeto
O objetivo deste projeto é fornecer uma plataforma centralizada e privada para a gestão ágil de tarefas, permitindo que a equipe organize seus fluxos de trabalho através de um **Board Kanban** interativo, acompanhe o progresso de projetos e gerencie as demandas internas de forma eficiente.

---

## ⚡ Configuração e Execução

### 1. Banco de Dados (Supabase)
O projeto está configurado para utilizar o Supabase como banco de dados principal.
1.  **Limpeza:** Execute o script `backend/sql/cleanup.sql` para remover estruturas antigas.
2.  **Schema:** Execute o script `backend/sql/schema.sql` no SQL Editor do seu projeto Supabase para criar as tabelas e o usuário único.

### 2. Configuração do Backend
As configurações de conexão estão localizadas em `backend/src/main/resources/application.yml`. Certifique-se de definir a variável de ambiente `JWT_SECRET` ou utilizar o valor padrão configurado para desenvolvimento.

### 3. Execução do Sistema
Navegue até a pasta raiz e execute:
```bash
mvn spring-boot:run
```
O sistema estará disponível em: [http://localhost:8080](http://localhost:8080)

---

## 🔑 Credenciais de Acesso Exclusivas

Esta aplicação é de uso exclusivo da empresa, possuindo um único acesso mestre:

| Perfil | E-mail | Senha |
| :--- | :--- | :--- |
| **Administrador Vedata** | `admin@vedata-workhub.com` | `password` |

---

## 🚀 Funcionalidades Principais

*   **Gestão de Projetos:** Criação de projetos com definição de prazos, cores de identificação e atribuição de responsáveis.
*   **Board Kanban Ágil:** Visualização de tarefas em estágios: *Backlog, Design, Todo, In Progress, Code Review, Testing e Done*.
*   **Gestão de Tarefas:** Atribuição de prioridades (Low a Critical), níveis de progresso e datas de entrega.
*   **Segurança Robusta:** Autenticação via **Spring Security** com proteção de rotas e gerenciamento de sessões.
*   **Dashboard de Métricas:** Visão geral do status dos projetos e tarefas pendentes.

---

## 🏗️ Stack Tecnológica

*   **Backend:** Java 17, Spring Boot 3.2.0, Spring Security, Spring Data JPA.
*   **Frontend:** React, TypeScript, Tailwind CSS.
*   **Banco de Dados:** PostgreSQL (Hospedado via Supabase).
*   **Ferramentas:** Maven para gestão de dependências e build.

---

## 🛠️ Estrutura do Projeto
*   `/backend`: Contém todo o código-fonte do servidor Java, recursos e scripts SQL.
*   `/frontend`: Contém o código-fonte da interface React/TypeScript.
*   `/docs`: Documentação técnica e relatórios do projeto.
*   `pom.xml`: Arquivo mestre de orquestração do build.
