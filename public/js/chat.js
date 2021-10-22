const url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080/api/auth/"
  : "https://restserver-curso-fher.herokuapp.com/api/auth/";

let usuario = null;
let socket = null;


//referencias html
const txtUid = document.querySelector("#txtUid");
const txtMensaje = document.querySelector("#txtMensaje");
const ulUsuarios = document.querySelector("#ulUsuarios");
const ulMensajes = document.querySelector("#ulMensajes");

//validar el token del localstorage
const validarJWT = async () => {
    const token = localStorage.getItem("token") || '';

    if (token.length <= 10){
        throw new Error("No hay token en el servidor");
        window.location = "index.html";
    }

    const resp = await fetch(url, {
        headers : {
            'x-token' : token
        }
    });

    const {usuario: UserDB, token:tokenDB} = await resp.json();

    localStorage.setItem("token",tokenDB);
    usuario = UserDB;
    document.title = usuario.nombre;

    await conectarSocket();
}

const conectarSocket = async() => {
     socket = io({
        'extraHeaders' : {
            'x-token' : localStorage.getItem('token')
        }
    });

    socket.on("connect", ()=>{
        console.log('%cchat.js line:47 Socket Conectado', 'color: white; background-color: #007acc;', "socket conectado");
    });

    socket.on("disconnect", ()=>{
        console.log('%cchat.js line:51 Socket Desconectado', 'color: white; background-color: red;', "Socket Desconectado");
    });

    socket.on("recibir-mensaje", () => {

    });

    socket.on("usuarios-activos", (payload) => {
        console.log(payload)
    });

    socket.on("mensaje-privado", () => {

    });

}

const main = async () => {
    await validarJWT();
}


main();

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    localStorage.removeItem("token");
      console.log("User signed out.");
      window.location = "index.html";
    });
  }
  function onLoad() {
    gapi.load('auth2', function() {
      gapi.auth2.init();
    });
  }

