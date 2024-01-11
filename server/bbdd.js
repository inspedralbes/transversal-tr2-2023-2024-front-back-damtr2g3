const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://a22celgariba:5xaChqdY3ei4ukcp@cluster0.2skn7nc.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const dbName = "G3-Proj2";
//connexio mongo

//contrasenya:adminADMIN1 bbdd:a22celgariba_Proj2-G3 user:a22celgariba_admin--------dades MySql
//	idPartida	idClasse	idAlumne	idProfesor	capacitat	puntuacio	tema
module.exports={ login, ObtenirInfoUsuari, CambiarContrasena, loginProf, dadesAlumnesClasse, classesProf,
     crearAlumne, validarUsuari, eliminarUsuari, ObtenirInscrits, revisarClasses, recollirStatsAlumne,
    recollirStatsClasse, recollirStatsPregunta, recollirColors}

async function login(connection){
        try {
            const [rows, fields] = await connection.execute('SELECT  username, contrasenya, autoritzada, idAlum FROM alumnes');
            const usuariosJSON = JSON.stringify(rows);
            return usuariosJSON;
        } catch (error) {
            console.error('Error al obtener usuarios:', error.message);
            throw error;
        }
}//revisar llista alumnes per trobar un match de user
async function loginProf(connection){
    try {
        const [rows, fields] = await connection.execute('SELECT  correu, contrasenya, idProf FROM Profesors');
        const usuariosJSON = JSON.stringify(rows);
        return usuariosJSON;
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        throw error;
    }
}//revisar llista alumnes per trobar un match de user
async function ObtenirInfoUsuari(usuari, connection){
    try {
        const [rows, fields] = await connection.execute('SELECT * FROM alumnes  WHERE username='+"'"+usuari+"'");
        const usuariosJSON = JSON.stringify(rows);
        return usuariosJSON;
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        throw error;
    }
}//retornar la informacio del usuari desitjat 
async function CambiarContrasena(usuari, passw, connection){
    try {
        const [rows, fields] = await connection.execute('UPDATE alumnes Set contrasenya='+ "'"+passw+"'"+' WHERE username='+"'"+usuari+"'");
        const usuariosJSON = JSON.stringify(rows);
        return usuariosJSON;
    } catch (error) {
        console.error('Error al actualitzar contrasenya:', error.message);
        throw error;
    }
}//cambia la contrasenya del usuari per una nova
async function dadesAlumnesClasse(classe, connection){
    try {
        const [rows, fields] = await connection.execute('SELECT Nom, username, fotoPerfil, correu FROM alumnes  WHERE classe='+"'"+classe+"'"+" AND autoritzada=true");
        const usuariosJSON = JSON.stringify(rows);
        return usuariosJSON;
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        throw error;
    }
}//retorna tots els alumnes que pertanyen a una classe en concret
async function classesProf(idProf, connection){
    try{
        operacioBBDD=('Select DISTINCT curs, nomClasse as nom, c.idClasse as id From classe c JOIN clase_Profesor On clase_Profesor.idProf='+"'"+idProf+"'")
        const [rows, fields] = await connection.execute(operacioBBDD);
        const usuariosJSON = JSON.stringify(rows);
        console.log(usuariosJSON)
        return usuariosJSON;
    }catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        throw error;
    }

}//join de clase_profesor amb classe per retornar info de totes les classes que dona un profesor especific
async function crearAlumne(alumne, connection){
    try {
        console.log(alumne)
        const {username, nom, contrasenya, fotoPerfil, correu, classe }=alumne
        const [result] = await connection.execute('INSERT INTO alumnes (username, correu, contrasenya, fotoPerfil, classe, Nom) VALUES(?,?,?,?,?,?)',[username, correu, contrasenya, fotoPerfil, classe, nom])
       
    } catch (error) {
        console.error('Error al insertar usuarios:', error.message);
        throw error;
    }
}//insereix un alumne sense validar a la bbdd
async function validarUsuari(id, connection){
    try {
        const [rows, fields] = await connection.execute('UPDATE alumnes Set autoritzada = true WHERE idAlum='+id);
        const usuariosJSON = JSON.stringify(rows);
        return usuariosJSON;
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        throw error;
    }
}//cambia la conta a autoritzada
async function eliminarUsuari(id, connection){
    try {
        const [rows, fields] = await connection.execute('Delete FROM alumnes  WHERE idAlum='+"'"+id+"'");
        const usuariosJSON = JSON.stringify(rows);
        return usuariosJSON;
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        throw error;
    }
}//elimina el usuari designat
async function ObtenirInscrits(classe, connection) {
    try {
        const [rows, fields] = await connection.execute('SELECT Nom, username, idAlum, correu FROM alumnes  WHERE classe='+"'"+classe+"'"+" AND autoritzada=false");
        const usuariosJSON = JSON.stringify(rows);
        return usuariosJSON;
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        throw error;
    }
}//mostrar llista d'alumnes de una classe concreta que no estan validats
async function revisarClasses(connection){
    try {
        const [rows, fields] = await connection.execute('SELECT idClasse FROM classe');
        const usuariosJSON = JSON.stringify(rows);
        return usuariosJSON;
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        throw error;
    }
}//comproba totes les classes existents per poder fer la seleccio al registrarse
async function recollirStatsAlumne(alumne){
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("StatsAlumnes");
    dades=col.find({$elemMatch:{playerId:alumne}}) 
    return dades
}//obte les estadistiques d'un alumne en concret
async function recollirStatsClasse(classe){
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("Estadistiques");
    dades=col.find({$elemMatch:{idClasse:classe}}) 
    return dades
}//obte les estadistiques d'una classe en concret
async function recollirStatsPregunta(){
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("Preguntes");
    dades=col.find() 
    return dades
}//obte les estadistiques de les preguntes per poder fer el cluster
async function recollirColors(alumne){
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("Gacha");
    dades=col.find({$elemMatch:{idAlum:alumne}}) 
    return dades
}//agafa els colors de mongo