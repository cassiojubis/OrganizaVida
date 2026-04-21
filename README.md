# OrganizaVida

Aplicação web full stack para **organização pessoal e controle financeiro**, desenvolvida com foco em simplicidade de uso, produtividade diária e visão clara de gastos.

> Projeto ideal para portfólio/currículo por demonstrar integração entre frontend, backend, persistência de dados e deploy em nuvem.

## ✨ Visão geral

O **OrganizaVida** centraliza quatro fluxos essenciais do dia a dia:

- **Rotina**: cadastro de tarefas com horário, marcação de concluídas e remoção.
- **Salário**: registro de salário mensal e renda extra.
- **Contas**: criação de contas a pagar, alternância de status (paga/pendente) e exclusão.
- **Resumo**: painel consolidado com saldo, gastos, pendências e acompanhamento de tarefas.

## 🧩 Principais diferenciais (para currículo)

- Interface objetiva e responsiva para navegação rápida entre módulos.
- API REST em Node.js para operações CRUD de tarefas, contas e salário.
- Persistência local em JSON, simplificando execução e testes em ambiente de desenvolvimento.
- Estrutura pronta para deploy com `render.yaml` e `Procfile`.

## 🛠️ Tecnologias utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js (HTTP + rotas REST)
- **Persistência:** arquivo JSON (`data/db.json`)
- **Deploy:** Render

## 🚀 Como executar localmente

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Inicie o servidor:

   ```bash
   npm start
   ```

3. Acesse no navegador:

   ```
   http://localhost:3000/home.html
   ```

## 🌐 Deploy

Este projeto está preparado para publicação no Render.

1. Faça push do repositório para o GitHub.
2. No Render, clique em **New + → Blueprint**.
3. Selecione o repositório para importar `render.yaml` automaticamente.
4. Ao concluir, use a URL pública gerada (exemplo):

   ```
   https://organizavida.onrender.com/home.html
   ```

## 🔐 Variáveis de ambiente

- `PORT`: porta do servidor (gerenciada pela plataforma no deploy)
- `HOST`: host de bind (padrão `0.0.0.0`)
- `DATA_DIR`: diretório de persistência de dados

## 📡 Endpoints da API

- `GET /api/health`
- `GET /api/salario`
- `PUT /api/salario`
- `GET /api/tarefas`
- `POST /api/tarefas`
- `PATCH /api/tarefas/:id/toggle`
- `DELETE /api/tarefas/:id`
- `GET /api/contas`
- `POST /api/contas`
- `PATCH /api/contas/:id/toggle`
- `DELETE /api/contas/:id`
- `GET /api/resumo`

## 📁 Estrutura do projeto

- `server.js`: servidor Node.js + API + entrega de arquivos estáticos
- `data/db.json`: base de dados local
- `render.yaml`: configuração de deploy no Render
- `Procfile`: compatibilidade com PaaS
- `*.html`, `*.css`, `*.js`: interface e lógica do frontend

## 📌 Sugestão de descrição para currículo (copiar e colar)

**OrganizaVida — Web App Full Stack (Node.js + JavaScript)**  
Desenvolvi uma aplicação web para gestão de rotina e finanças pessoais, com módulos de tarefas, salário, contas e dashboard consolidado. Implementei API REST, persistência em JSON, regras de cálculo de saldo/gastos e deploy em nuvem (Render), garantindo experiência simples, rápida e orientada à produtividade.
