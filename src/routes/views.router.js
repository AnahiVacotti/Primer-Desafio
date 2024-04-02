import express from 'express';
const router = express.Router()

router.get("/profile", (req, res) =>{
    if (!req.session.user) {
        return res.redirect('/login')
    }
    const {first_name, last_name, email, age} = req.session.user
    res.render("profile", {first_name, last_name, email, age})
})
router.get("/login", (req, res)=>{
    res.render("login")
})

router.get("/register", (req, res)=>{
    res.render("register")
})
export default router;






































/* import express from 'express';
import path from 'path';

const viewsRouter = express.Router();
const express =require("express")

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
    // Obtener los datos del usuario de la sesión
    const { firstName, lastName, age, email } = req.session.user;

    // Renderizar la vista de perfil y pasar los datos del usuario
    res.render('profile', { firstName, lastName, age, email });
});

export default viewsRouter; */