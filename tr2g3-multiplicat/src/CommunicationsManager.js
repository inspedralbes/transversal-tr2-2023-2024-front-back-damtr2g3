export async function getUserInfo(user, isLogged){
    const response = await fetch('http://localhost:3001/infoUser');
    const userInfo = await response.json();
    return userInfo;
}

export async function validateLogin(username, password){
    
var dades ={
    user: username,
    passwd: password
}

const response = await fetch(`http://localhost:3001/login`,
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

const validation = await response.json();
return validation;

}

