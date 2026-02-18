# OrganizaVida

OrganizaVida é uma aplicação web para organizar rotina diária e controlar finanças pessoais. O projeto possui backend em Node.js com persistência local em JSON.

## Funcionalidades

- **Rotina**: adicione tarefas com horário, marque como concluída e exclua.
- **Salário**: registre salário mensal e renda extra.
- **Contas**: cadastre contas, alterne entre paga/pendente e remova itens.
- **Resumo**: visão consolidada de finanças, contas pendentes e tarefas.

## Tecnologias

- HTML5
- CSS3
- JavaScript (ES6+)
- Node.js

## Como executar localmente

1. Inicie o servidor:

   ```bash
   npm start
   ```

2. Abra no navegador:

   ```
   http://localhost:3000/home.html
   ```

## Deploy para acesso de outra cidade (internet)

Este projeto já está pronto para deploy e acesso público por URL.

### Opção recomendada: Render

1. Suba este repositório para o GitHub.
2. Crie conta no Render e clique em **New + > Blueprint**.
3. Selecione o repositório.
4. O Render vai usar automaticamente o arquivo `render.yaml`.
5. Após o deploy, acesse a URL pública gerada, por exemplo:

   ```
   https://organizavida.onrender.com/home.html
   ```

> **Importante (plano free):** o Render Free não usa disco persistente neste projeto, então o `DATA_DIR` está configurado para `/tmp/organizavida`. Isso permite rodar sem erro no plano grátis, mas os dados podem ser perdidos após reinício/redeploy.

### Variáveis de ambiente

- `PORT`: porta do servidor (fornecida automaticamente no deploy).
- `HOST`: host de bind (padrão `0.0.0.0`, ideal para nuvem).
- `DATA_DIR`: pasta do `db.json` (no Render Free: `/tmp/organizavida`).

## API backend

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

## Estrutura

- `server.js`: servidor API + arquivos estáticos
- `data/db.json`: persistência local para ambiente de desenvolvimento
- `render.yaml`: configuração de deploy no Render
- `Procfile`: compatibilidade com plataformas PaaS
- `*.html`, `*.css`, `*.js`: frontend
