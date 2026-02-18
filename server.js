const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

const DEFAULT_DB = {
  salario: {
    salario: 0,
    rendaExtra: 0
  },
  tarefas: [],
  contas: []
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

async function ensureDbFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
  }
}

async function readDb() {
  const raw = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

async function writeDb(data) {
  const tempPath = `${DB_PATH}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(data, null, 2));
  await fs.rename(tempPath, DB_PATH);
}

function newId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      if (!body) return resolve({});

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('JSON inválido'));
      }
    });

    req.on('error', reject);
  });
}

function isSafePath(targetPath) {
  const normalized = path.normalize(targetPath);
  return normalized.startsWith(ROOT);
}

async function serveStatic(req, res) {
  const reqPath = req.url === '/' ? '/home.html' : req.url;
  const cleanPath = reqPath.split('?')[0];
  const filePath = path.join(ROOT, cleanPath);

  if (!isSafePath(filePath)) {
    sendJson(res, 403, { erro: 'Acesso negado' });
    return;
  }

  try {
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      sendJson(res, 404, { erro: 'Arquivo não encontrado' });
      return;
    }

    const ext = path.extname(filePath);
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
    const data = await fs.readFile(filePath);

    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  } catch {
    sendJson(res, 404, { erro: 'Arquivo não encontrado' });
  }
}

async function handleApi(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || `localhost:${PORT}`}`);
  const pathname = url.pathname;

  if (req.method === 'GET' && pathname === '/api/health') {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === 'GET' && pathname === '/api/salario') {
    const db = await readDb();
    return sendJson(res, 200, db.salario);
  }

  if (req.method === 'PUT' && pathname === '/api/salario') {
    const body = await readBody(req);
    const salario = Number(body.salario);
    const rendaExtra = Number(body.rendaExtra);

    if (!Number.isFinite(salario) || !Number.isFinite(rendaExtra) || salario < 0 || rendaExtra < 0) {
      return sendJson(res, 400, { erro: 'Valores inválidos' });
    }

    const db = await readDb();
    db.salario = { salario, rendaExtra };
    await writeDb(db);
    return sendJson(res, 200, db.salario);
  }

  if (req.method === 'GET' && pathname === '/api/tarefas') {
    const db = await readDb();
    return sendJson(res, 200, db.tarefas);
  }

  if (req.method === 'POST' && pathname === '/api/tarefas') {
    const body = await readBody(req);
    if (!body.nome || !body.hora) {
      return sendJson(res, 400, { erro: 'Nome e hora são obrigatórios' });
    }

    const db = await readDb();
    const tarefa = {
      id: newId(),
      nome: String(body.nome).trim(),
      hora: String(body.hora).trim(),
      concluida: false
    };

    db.tarefas.push(tarefa);
    await writeDb(db);
    return sendJson(res, 201, tarefa);
  }

  if (req.method === 'PATCH' && /^\/api\/tarefas\/\d+\/toggle$/.test(pathname)) {
    const id = Number(pathname.split('/')[3]);
    const db = await readDb();
    const tarefa = db.tarefas.find((t) => t.id === id);

    if (!tarefa) {
      return sendJson(res, 404, { erro: 'Tarefa não encontrada' });
    }

    tarefa.concluida = !tarefa.concluida;
    await writeDb(db);
    return sendJson(res, 200, tarefa);
  }

  if (req.method === 'DELETE' && /^\/api\/tarefas\/\d+$/.test(pathname)) {
    const id = Number(pathname.split('/')[3]);
    const db = await readDb();
    const original = db.tarefas.length;
    db.tarefas = db.tarefas.filter((t) => t.id !== id);

    if (db.tarefas.length === original) {
      return sendJson(res, 404, { erro: 'Tarefa não encontrada' });
    }

    await writeDb(db);
    res.writeHead(204);
    return res.end();
  }

  if (req.method === 'GET' && pathname === '/api/contas') {
    const db = await readDb();
    return sendJson(res, 200, db.contas);
  }

  if (req.method === 'POST' && pathname === '/api/contas') {
    const body = await readBody(req);

    if (!body.nome || !body.vencimento || !Number.isFinite(Number(body.valor)) || Number(body.valor) <= 0) {
      return sendJson(res, 400, { erro: 'Dados da conta inválidos' });
    }

    const db = await readDb();
    const conta = {
      id: newId(),
      nome: String(body.nome).trim(),
      valor: Number(body.valor),
      vencimento: String(body.vencimento).trim(),
      paga: false
    };

    db.contas.push(conta);
    await writeDb(db);
    return sendJson(res, 201, conta);
  }

  if (req.method === 'PATCH' && /^\/api\/contas\/\d+\/toggle$/.test(pathname)) {
    const id = Number(pathname.split('/')[3]);
    const db = await readDb();
    const conta = db.contas.find((c) => c.id === id);

    if (!conta) {
      return sendJson(res, 404, { erro: 'Conta não encontrada' });
    }

    conta.paga = !conta.paga;
    await writeDb(db);
    return sendJson(res, 200, conta);
  }

  if (req.method === 'DELETE' && /^\/api\/contas\/\d+$/.test(pathname)) {
    const id = Number(pathname.split('/')[3]);
    const db = await readDb();
    const original = db.contas.length;
    db.contas = db.contas.filter((c) => c.id !== id);

    if (db.contas.length === original) {
      return sendJson(res, 404, { erro: 'Conta não encontrada' });
    }

    await writeDb(db);
    res.writeHead(204);
    return res.end();
  }

  if (req.method === 'GET' && pathname === '/api/resumo') {
    const db = await readDb();
    return sendJson(res, 200, db);
  }

  return sendJson(res, 404, { erro: 'Endpoint não encontrado' });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith('/api/')) {
      await handleApi(req, res);
    } else {
      await serveStatic(req, res);
    }
  } catch (error) {
    sendJson(res, 500, { erro: 'Erro interno', detalhe: error.message });
  }
});

async function start() {
  await ensureDbFile();

  server.listen(PORT, HOST, () => {
    console.log(`OrganizaVida backend rodando em http://${HOST}:${PORT}`);
  });
}

start();
