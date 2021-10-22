const url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080/api/auth/"
  : "https://chat-socket-node-ed.herokuapp.com/api/auth/";

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

    socket.on("recibir-mensajes", dibujarMensajes);

    socket.on("usuarios-activos", dibujarUsuarios);

    socket.on("mensaje-privado", (payload) => {
        console.log(payload)
    });

}

const dibujarUsuarios = (usuarios = []) => {
    let userHtml = '';
    usuarios.forEach( ({nombre, uid}) => {
        userHtml += `
        <li>
            <p>
             <h5 class="text-success"> ${nombre}</h5>
             <span class="fs-6 text-muted">${uid}</span>
            </p>        
        </li>
        `;
    });
    ulUsuarios.innerHTML= userHtml;
}

const dibujarMensajes = (mensajes = []) => {
    let mensajesHtml = '';
    mensajes.forEach( ({nombre, mensaje}) => {
        mensajesHtml += `
        <li>
            <p>
             <span class="text-primary"> ${nombre}:</span>
             <span >${mensaje}</span>
            </p>        
        </li>
        `;
    });
    ulMensajes.innerHTML= mensajesHtml;
}

const main = async () => {
    await validarJWT();
}

txtMensaje.addEventListener("keyup", ({keyCode}) => {
    
    if(keyCode !== 13){ return;}

    const mensaje = txtMensaje.value;
    const uid = txtUid.value;
    if(mensaje.length === 0){return;}
    
    socket.emit("enviar-mensaje",{uid,mensaje});
    txtMensaje.value = '';
    
})

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

