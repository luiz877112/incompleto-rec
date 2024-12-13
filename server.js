const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Banco de dados SQLite
const db = new sqlite3.Database('./db.sqlite', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite');
    }
});

// Cria a tabela se não existir
db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL
    )
`);

// Middleware para proteger rotas com API Key
const authenticate = (req, res, next) => {
    const key = req.headers['x-api-key'];
    if (key === API_KEY) {
        next();
    } else {
        res.status(403).json({ message: 'API key inválida' });
    }
};

// Rota para cadastrar dados (protegida)
app.post('/api/cadastrar', authenticate, (req, res) => {
    const { nome, email } = req.body;
    if (!nome || !email) {
        return res.status(400).json({ message: 'Nome e email são obrigatórios' });
    }

    const query = `INSERT INTO usuarios (nome, email) VALUES (?, ?)`;
    db.run(query, [nome, email], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Erro ao inserir dados' });
        }
        res.json({ message: 'Cadastro realizado com sucesso', id: this.lastID });
    });
});

// Rota para consultar dados (protegida)
app.get('/api/consultar', authenticate, (req, res) => {
    db.all(`SELECT * FROM usuarios`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao buscar dados' });
        }
        res.json(rows);
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
