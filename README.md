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

### Subir em outra máquina sem Render (mais fácil)

Se o Render estiver dando trabalho, use Docker na outra máquina (VPS/servidor).

1. Instale Docker na máquina de destino.
2. Faça clone do repositório.
3. Rode os comandos abaixo:

```bash
docker build -t organizavida .
docker run -d --name organizavida -p 3000:3000 -v organizavida_data:/app/data organizavida
```

4. Acesse no navegador:

```text
http://IP_DA_MAQUINA:3000/home.html
```

> Se quiser acesso público (internet), abra/encaminhe a porta 3000 no firewall/roteador ou coloque um proxy com domínio.

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


### Se aparecer o erro `disks are not supported in free tier services`

No Render Blueprint, confirme estes pontos antes de clicar em **Apply**:

1. **Branch**: `main` (ou a branch onde está o arquivo atualizado).
2. **Blueprint Path**: `render.yaml` (com ponto, exatamente assim).
3. O YAML **não** pode ter bloco `disk:` no plano free.

Trecho esperado do arquivo:

```yaml
services:
  - type: web
    name: organizavida
    runtime: node
    plan: free
    buildCommand: "npm install"
    startCommand: "npm start"
    envVars:
      - key: NODE_ENV
        value: production
      - key: HOST
        value: 0.0.0.0
      - key: DATA_DIR
        value: /tmp/organizavida
```

Se ainda mostrar `disk`, normalmente é porque a branch no GitHub ainda está com versão antiga. Nesse caso, faça `git push origin main` e recrie o Blueprint.

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
- `Dockerfile`: empacotamento para rodar em qualquer máquina com Docker
- `.dockerignore`: arquivos ignorados na build Docker
- `Procfile`: compatibilidade com plataformas PaaS
- `*.html`, `*.css`, `*.js`: frontend
