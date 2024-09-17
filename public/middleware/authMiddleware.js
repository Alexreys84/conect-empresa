const jwt = require('jsonwebtoken');

// Middleware de autenticação JWT
function authenticateToken(req, res, next) {
    const token = req.cookies.authToken; // Obter o token do cookie

    if (!token) {
        return res.status(401).json({ success: false, message: 'Acesso negado. Token não fornecido.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Token inválido.' });
        }

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
