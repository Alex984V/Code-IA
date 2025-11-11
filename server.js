'use strict';

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// **IMPORTANTE**: Mantenha esta chave secreta segura e não a exponha publicamente.
const SECRET_KEY = 'segredo_supersecreto'; 

// Conexão MySQL (XAMPP padrão)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // sua senha do root
    database: 'codeai',
    port: 3306   // a porta do MySQL
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err.message);
        return;
    }
    console.log('Conectado ao MySQL!');
});

// Middleware para proteger rotas (checa se o token é válido)
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Token não fornecido' });

    jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token inválido' });
        req.user = decoded; // O ID do usuário fica em req.user.id
        next();
    });
}

// Rota de Cadastro
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email e senha obrigatórios!' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // O campo 'plano' terá o valor padrão 'gratis' definido no seu SQL
    db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err) => {
        if (err) {
            // Código 1062 é para entrada duplicada (email já cadastrado)
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Este email já está cadastrado.' });
            }
            console.error('Erro ao cadastrar:', err);
            return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
        }
        res.json({ message: 'Usuário cadastrado com sucesso!' });
    });
});

// Rota de Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Erro no servidor' });
        if (results.length === 0) return res.status(400).json({ message: 'Email não encontrado!' });

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Senha incorreta!' });

        // Gerar token JWT
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ message: 'Login bem-sucedido!', token });
    });
});

// Rota protegida para buscar dados do perfil
app.get('/user/profile', verifyToken, (req, res) => {
    // Usamos o ID do usuário decodificado pelo token
    const userId = req.user.id; 

    db.query('SELECT nome, email, plano, fotoURL FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar perfil:', err);
            return res.status(500).json({ message: 'Erro ao buscar dados do perfil.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        
        // Retorna os dados do perfil
        const profileData = {
            name: results[0].nome,
            email: results[0].email,
            plan: results[0].plano,
            profilePicUrl: results[0].fotoURL 
        };
        res.json(profileData);
    });
});

// **NOVA ROTA**: Rota protegida para atualizar o plano do usuário no Checkout
app.post('/user/update-plan', verifyToken, (req, res) => {
    // O plano virá no corpo da requisição (ex: 'mensal', 'anual', 'mensal-pendente')
    const { plano } = req.body; 
    // O ID do usuário é pego do token decodificado pelo middleware verifyToken
    const userId = req.user.id; 

    if (!plano) {
        return res.status(400).json({ message: 'O plano é obrigatório.' });
    }

    const sql = 'UPDATE users SET plano = ? WHERE id = ?';
    db.query(sql, [plano, userId], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar plano no banco de dados:', err);
            return res.status(500).json({ message: 'Erro interno do servidor ao atualizar o plano.' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado ou plano já atualizado.' });
        }

        res.json({ message: `Plano atualizado para ${plano} com sucesso!` });
    });
});


// Porta de escuta
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});