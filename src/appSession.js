import express from 'express'
import session from 'express-session'
import router from './routes/views.router'

const User = require("..models/user")
const app = express()
const PORT = 8080

app.post('/register', async (req, res) => {
    const {first_name, last_name, email, age, password} = req.body;
    if (!first_name  || !last_name ||  !email || !age || !password){
        return res.status(400).send({status: "error", error: "Faltas datos"});
    }
    const user = new User ({
        first_name,
        last_name,
        email,
        age,
        password
    });
    console.log(user)
    res.send({status:"ok", message: "Usuario creado", payload: user });
    await user.save()
});



// router.post("register", async (req, res)=>{
//     try{
//         const {first_name, last_name, email, age, password} =req.body
//         const user = new User ({first_name, last_name, email, age, password})
//         await user.save
//         res.redirect("/login")
//         } catch (error){
//             res.status(500).send("Error de registro")
//         }
// })
// app.use(session({
//     secret: 'secretCoder',
//     resave:true,
//     saveUninitialized:true

// }))

app.get('/session', (req, res )=>{
if (req.session.counter){
    req.session.counter++
    res.send(`Se ha visitado el sitio ${req.session.counter} veces`)
}else{
    req.session.counter = 1
    res.send('Bienvenido')
}
})

app.get('/logout', (req, res) =>{
    req.session.destroy(err =>{
        if(!err) res.send('sesion finalizada')
        else res.send({status: "no se pudo finalizar sesion", body: err})
    })
})

function auth (req, res, next){
 if(req.session?.user === 'ani' && req.session?.admin){
    return next()
 }
 return res.status(401).send ("Error de autenticacion")
}

app.get ('/login', (req, res)=>{
    const {username, password} = req.query
    if(username!== "ani" || password!=="vacotti"){
        return res.send('inicio de sesion invalida')
    }

    req.session.user = username
    req.session.admin=true
    res.send('inicio exitoso')
})

app.get ('/privado', auth, (req, res) =>{
res.send("ya estas logueado y sos admin")
})


app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})