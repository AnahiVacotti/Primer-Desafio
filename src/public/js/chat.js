const socket = io()

let user //Este user será con el que el cliente se identificará para saber quien escribio el mensaje
let chatBox = document.getElementById('chatBox') //Obtenemos la referencia del cuadro donde se escribirá

Swal.fire({
    title: "Identifícate",
    input: "text",
    text: "Ingresa un CORREO para identificarte en el chat",
    inputValidator: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
            return 'Necesitas escribir un nombre de usuario para continuar';
        } else if (!emailRegex.test(value)) {
            return 'Por favor, ingresa un correo electrónico válido';
        }
    },
    allowOutsideClick: false //Impide que el usuario salga de la alerta al dar click fuera de la alerta

}).then(result => {
    //Una vez que el usuario se identifica, lo asignamos a la variable user
    user = result.value

    socket.emit('updateMessages')
})

// Input
chatBox.addEventListener('keyup', evt => {
    if (evt.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            // Emitir el mensaje al servidor
            socket.emit('message', { email: user, message: chatBox.value })
            chatBox.value = ''
        } else {
            console.log('El mensaje está vacío')
        }
    }
})

/* SOCKET LISTENERS */
socket.on('messageLogs', data => {
    let log = document.getElementById('messageLogs')
    let messages = ''

    data.forEach(message => {
        messages = messages + `${message.email} dice: ${message.message} </br>`
    })

    log.innerHTML = messages
})

//Alert new user conected
socket.on('newUserConnected', () => {
    Swal.fire({
        text: "Nuevo usuario conectado",
        toast: true,
        position: "top-right"
    })
})