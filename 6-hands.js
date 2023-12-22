class TicketManager {
    #precioBaseDeGanancia = 0.15
    constructor(){
        this.eventos = []
    }

    getEventos(){
        return this.eventos
    }

    agregarEvento( nombre, lugar, precio, capacidad= 50, fecha= Date() ){
        const newEvento = {
            id: this.eventos.length + 1,
            nombre,
            lugar, 
            precio, 
            capacidad,
            fecha
        }
        this.eventos.push(newEvento)
        
    }

    agregarUsuario({eid, uid}){
        
        const eventoIndex = this.eventos.findIndex(evento => evento.id === eid)
        if (eventoIndex === -1 ) {
            return `El evento no existe`
        }
       
        const resultUser = this.eventos[eventoIndex].participantes.includes(uid)
        if (resultUser) {
            return `El usuaiorio ya esta registrado en el evento`
        }

        this.eventos[eventoIndex].participantes.push(uid)
        return `El usuario fué registrado con éxito`
    }

    ponerEventoEnGira(eid, nuevaLocalidad, nuevaFecha){
        const eventoIndex = this.eventos.findIndex(evento => evento.id === eid)
        if (eventoIndex === -1) {
            return `No existe el evento`
        }

        const evento = this.eventos[eventoIndex]
        const newEvento = {
            ...evento,
            id: this.eventos.length + 1,
            lugar: nuevaLocalidad,
            fecha: nuevaFecha,
            participantes: []
        }
        this.eventos.push(newEvento)
        return `nuevo evento creado`
    }
}

const ticketManager = new TicketManager()
console.log(ticketManager.agregarEvento('Asaltando Saltadilla', 'Ciudad de Saltadilla', 1500))
console.log(ticketManager.agregarEvento('Amigos Imaginarios', 'Mansion Foster', 1500))
console.log(ticketManager.agregarEvento('Goku vs Freezer', 'Namek', 1500))
console.log(ticketManager.agregarEvento('Crocodile en aprietos', 'Arabasta', 1500))
console.log(ticketManager.getEventos())