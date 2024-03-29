const BASEURL = 'http://multiplicatg3.dam.inspedralbes.cat:3817';
const localURL = 'http://localhost:3817'

export async function getUserInfo(user){
    const dades={
        username: user,
    };
    const response = await fetch(BASEURL + '/infoUser', 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dades),
        mode: "cors"
    });
    const userInfo = await response.json();
    return userInfo;
} //obtenir dades del usuari

export async function validateLogin(username, password){

const dades ={
    user: username,
    passwd: password
}

const response = await fetch(BASEURL + '/login',
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dades),
        mode: "cors"
    }
);

const validation = await response.json();
return validation;
}//comprobar si el usuari i la contrasenya pertanyen a un usuari registrat

export async function CambiarContrasenya(user, novaPasswd){
    var dades ={
        user: user,
        passwd: novaPasswd
    }
    
    const response = await fetch(BASEURL + '/restablirPasswd',
        {
            method: 'POST',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dades),
            mode: "cors"
        }
    );
}//envia la nova contrasenya per actualitzar el registre

export async function nouUsuari(nom,user, contrasenya, foto, email, classe){

    const alumne ={
        username:user,
        nom:nom,
        contrasenya:contrasenya,
        fotoPerfil:foto,
        correu:email,
        classe:classe
    }
    
    const response = await fetch(BASEURL + '/registrarUsuari',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(alumne),
            mode: "cors"
        }
    );
}//envia un objecte alumne a node per inserir-lo en la bbdd

export async function revisarClasses(){
    const response = await fetch(BASEURL + '/obtenirClassesRegistre');
    const classes = await response.json();
    return classes
      
}//recupera un llistat de totes les classes

export async function obtenirStats(username){
    console.log("comunications manager")
    const dades ={
        username: username,
    }
    
    const response = await fetch(localURL + '/obtenirDadesAlumneVue',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dades),
            mode: "cors"
        })
    const stats = await response.json();
    return stats;
}//envia l'usuari i recupera un json de les estadistiques

export async function geColorsGacha(user){
    console.log("comunications manager")
    const dades={
        student: user,
    };
    const response = await fetch(BASEURL + '/colorsGacha', 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dades),
        mode: "cors"
    });
    const userInfo = await response.json();
    console.log(userInfo)
    return userInfo;
}//obte els colors que pot seleccinar el usuari
