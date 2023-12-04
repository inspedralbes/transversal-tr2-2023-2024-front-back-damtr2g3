export async function getUserInfo(user, isLogged){
    const dades={
        user: user,
        logged: isLogged 
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

