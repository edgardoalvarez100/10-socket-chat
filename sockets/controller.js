const { Socket } = require("socket.io")
const {comprobarJWT} = require("../helpers");
const {ChatMensajes} = require("../models");

const socketController = async(socket = new Socket(), io ) => {
    const token = socket.handshake.headers['x-token'];
    const usuario = await comprobarJWT(token);
    if(!usuario){
        return socket.disconnect();
    }
    ChatMensajes.conectarUsuario(usuario);
    io.emit("usuarios-activos", ChatMensajes.usuariosArr)
}

module.exports = {socketController}