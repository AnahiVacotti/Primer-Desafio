import express from 'express'
import session from 'express-session'

const app = express()
const PORT = 8080

app.use(session({
    secret: 'secretCoder',
    resave:true,
    saveUninitialized:true

}))

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