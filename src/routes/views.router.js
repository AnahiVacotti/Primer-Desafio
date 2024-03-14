import express from 'express';
import path from 'path';

const viewsRouter = express.Router();

// Middleware de autenticación
const isAuthenticated = (req, res, next) => {
    // Verificar si el usuario está autenticado
    if (req.session.user) {
        // Si el usuario está autenticado, continúa con la solicitud
        next();
    } else {
        // Si el usuario no está autenticado, redirige al formulario de inicio de sesión
        res.redirect('/login');
    }
};

// Middleware de redirección si el usuario está autenticado
const redirectIfAuthenticated = (req, res, next) => {
    // Verificar si el usuario está autenticado
    if (req.session.user) {
        // Si el usuario está autenticado, redirige al perfil
        res.redirect('/profile');
    } else {
        // Si el usuario no está autenticado, continúa con la solicitud
        next();
    }
};

viewsRouter.get('/register', redirectIfAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html')); // Renderiza la vista de registro
});

viewsRouter.get('/login', redirectIfAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html')); // Renderiza la vista de inicio de sesión
});

viewsRouter.get('/profile',isAuthenticated , (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'profile.html')); // Renderiza la vista de perfil
});

export default viewsRouter;