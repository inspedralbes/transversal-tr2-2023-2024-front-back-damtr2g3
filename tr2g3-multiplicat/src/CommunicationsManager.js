export async function getUserInfo(user){
    const dades={
        student: user,
    };
    const response = await fetch('http://localhost:3001/infoUser', 
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

const response = await fetch(`http://localhost:3001/login`,
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
    
    const response = await fetch(`http://localhost:3001/restablirPasswd`,
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
    
    const response = await fetch(`http://localhost:3001/registrarUsuari`,
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
    const response = await fetch('http://localhost:3001/obtenirClassesRegistre');
    const classes = await response.json();
    return classes
      
}//recupera un llistat de totes les classes

export async function obtenirStats(username){
    const dades ={
        username: username,
    }
    
    const response = await fetch(`http://localhost:3001/obtenirDadesAlumneVue`,
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