// server.js (ou o nome do seu arquivo principal)
const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const authenticateToken = require('./public/middleware/authMiddleware.js'); // Importando o middleware
require('dotenv').config();

const app = express();
const port = 3000;


app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuração do MongoDB
const uri = process.env.MONGODB_URI || "mongodb+srv://admin:123senac@conecta.rqjpi.mongodb.net/?retryWrites=true&w=majority&appName=Conecta";
let db;
MongoClient.connect(uri)
    .then(client => {
        db = client.db('conectaDB');
        console.log('Conectado ao MongoDB Atlas');
    })
    .catch(error => console.error(error));

// Rotas
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.post('/register', (req, res) => {
    if (!db) {
        return res.status(500).json({ success: false, message: 'Erro ao conectar ao banco de dados.' });
    }

    const { username, email, password } = req.body;

    // Gerar o hash da senha
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Erro ao processar a senha:', err);
            return res.status(500).json({ success: false, message: 'Erro ao processar a senha.' });
        }

        const collection = db.collection('users');

        // Guardar o horário de compra
        const currentDate = new Date();

        collection.insertOne({
            username,
            email,
            password: hashedPassword
        })
        .then(result => {
            res.json({ success: true, message: 'Usuário cadastrado com sucesso!' });
        })
        .catch(error => {
            console.error('Erro ao cadastrar o usuário:', error);
            res.status(500).json({ success: false, message: 'Erro ao cadastrar o usuário.' });
        });
    });
});

// Função para criar um pagamento
app.post('/criar-pagamento', (req, res) => {
    const { itemTitle, itemPrice } = req.body; // Dados do frontend

    // Definindo a preferência de pagamento
    let preference = {
        items: [
            {
                title: itemTitle,  // Nome do item
                quantity: 1,       // Quantidade
                currency_id: 'BRL', // Moeda
                unit_price: parseFloat(itemPrice) // Preço unitário
            }
        ],
        back_urls: {
            "success": "https://www.seusite.com/success",
            "failure": "https://www.seusite.com/failure",
            "pending": "https://www.seusite.com/pending"
        },
        auto_return: "approved" // Redirecionamento automático em caso de sucesso
    };

    // Criando a preferência
    mercadopago.preferences.create(preference)
        .then(function (response) {
            res.json({ id: response.body.id }); // Envia o ID da preferência ao frontend
        }).catch(function (error) {
            console.log(error);
            res.status(500).json({ error: 'Erro ao criar pagamento' });
        });
});




app.post('/login', (req, res) => {
    if (!db) {
        return res.json({ success: false, message: 'Erro ao conectar ao banco de dados.' });
    }

    const { username, password } = req.body;

    const collection = db.collection('users');
    collection.findOne({ username })
        .then(user => {
            if (!user) {
                return res.redirect('/login-error');
            }

            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    return res.json({ success: false, message: 'Erro ao comparar a senha.' });
                }

                if (result) {
                    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

                    // Armazena o token no cookie
                    res.cookie('authToken', token, { httpOnly: false, secure: false }); // Coloque 'secure: true' se estiver usando HTTPS

                    const tokenHTML = `
                        <!DOCTYPE html>
                        <html lang="pt-BR">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Token JWT</title>
                            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                            <link rel="stylesheet" href="styles.css">
                            <style>
                                body {
                                    margin: 0;
                                    font-family: Arial, sans-serif;
                                    background: url('img/login.jpeg') no-repeat center center fixed;
                                    background-size: cover;
                                }

                                .error-banner {
                                    background-color: rgba(0, 0, 0, 0.7); /* Fundo semitransparente para destacar o texto */
                                }

                                .text-white {
                                    color: white !important;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container-fluid d-flex flex-column align-items-center justify-content-center vh-100 text-center text-white">
                                <div class="error-banner p-5 rounded shadow">
                                    <h1 class="display-1">Token JWT</h1>
                                    <p class="lead">Seu token JWT é:</p>
                                    <p id="jwt-token" class="text-white">${token}</p>
                                    <input type="hidden" id="hidden-token" value="${token}">
                                    <a href="/logado" class="btn btn-dark mt-4">Ir para tela de Compras.</a>
                                </div>
                            </div>
                            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
                            <script>
                                // Exemplo: Usar o token no JavaScript
                                const token = document.getElementById('hidden-token').value;
                                console.log('Token JWT:', token);
                            </script>
                        </body>
                        </html>
                    `;

                    // Enviar a página HTML com o token embutido
                    res.send(tokenHTML);
                } else {
                    res.redirect('/login-error');
                }
            });
        })
        .catch(error => {
            res.json({ success: false, message: 'Erro ao realizar login.' });
            console.error(error);
        });
});

app.get('/logado', authenticateToken, (req, res) => {
    res.sendFile(__dirname + '/public/logado.html');
});

app.get('/home', authenticateToken, (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// rota do usuário
app.get('/get-username', authenticateToken, (req, res) => {
    res.json({ username: req.user.username });
});


// Rota protegida para pacotes com parâmetros dinâmicos
app.get('/:setor', authenticateToken, (req, res) => {
    const setor = req.params.setor;

    // Mapeia o setor para o arquivo HTML correspondente
    const pacotes = {
        'imobiliario': '/public/pacote1.html',
        'automotivo': '/pacotes/pacote2.html',
        'agro': '/pacotes/pacote3.html',
        'beleza-cosmeticos': '/pacotes/pacote4.html',
        'construcao': '/pacotes/pacote5.html',
        'tecnologia': '/pacotes/pacote6.html'
    };

    const filePath = pacotes[setor];

    if (filePath) {
        res.sendFile(__dirname + filePath);
    } else {
        res.status(404).send('Pacote não encontrado');
    }
});




app.get('/login-error', (req, res) => {
    res.sendFile(__dirname + '/public/error.html');
});

app.get('/logout', (req, res) => {
    res.clearCookie('authToken'); // Limpa o cookie ao fazer logout
    res.redirect('/login');
});


app.get('/check-token', (req, res) => {
    const token = req.cookies.authToken; // Obter o token do cookie

    if (token) {
        res.json({ success: true, message: 'Token encontrado!', token: token });
    } else {
        res.json({ success: false, message: 'Nenhum token encontrado.' });
    }
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
