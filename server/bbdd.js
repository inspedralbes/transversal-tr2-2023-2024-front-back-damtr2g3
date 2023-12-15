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
module.exports={obtenirPreguntes, login, ObtenirInfoUsuari, CambiarContrasena, loginProf, dadesAlumnesClasse, classesProf,
     crearAlumne, validarUsuari, eliminarUsuari, ObtenirInscrits, revisarClasses, preguntaContestada, recollirStatsAlumne,
      recollirStatsClasse, recollirStatsPregunta}

async function obtenirPreguntes(numPreguntes){
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("preguntas");
    let preguntes=[]
    if(numPreguntes>0){
        console.log(numPreguntes)
        let preguntes= col.aggregate(
            [
                { $match: { _id: { $nin: preguntes.map(pregunta => pregunta._id) } } },
                { $sample: { size: numPreguntes } } 
            ]
        )
    }
    else
    console.log(numPreguntes)
        preguntes= col.find()

    //preguntes=JSON.parse(preguntes)
    return preguntes
}//obtenir un numero n de preguntes desde mongo
async function login(connection){
        try {
            const [rows, fields] = await connection.execute('SELECT  username, contrasenya FROM alumnes');
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
        const [rows, fields] = await connection.execute('UPDATE contrasenya FROM alumnes WHERE username='+"'"+usuari+"'"+'Set contrasenya='+ "'"+passw+"'");
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
        operacioBBDD=('Select DISTINCT curs, nomClasse From classe JOIN clase_Profesor On clase_Profesor.idProf='+"'"+idProf+"'")
        const [rows, fields] = await connection.execute(operacioBBDD);
        const usuariosJSON = JSON.stringify(rows);
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
        const [rows, fields] = await connection.execute('UPDATE alumnes WHERE idAlum='+"'"+id+"'"+" Set autoritzada true");
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
        const [rows, fields] = await connection.execute('SELECT Nom, username, correu FROM alumnes  WHERE classe='+"'"+classe+"'"+" AND autoritzada=false");
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
async function preguntaContestada(pregunta,resposta, alumne){
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("StatsAlumnes");
    if(resposta){
        db.collection.update(
            idAlum=alumne
        )

    }
    else{

    }
}//insereix a mongo el resultat de la pregunta be/malament i tema
async function recollirStatsAlumne(alumne){
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("Estadistiques");
    dades=col.find({$elemMatch:{idAlum:alumne}}) 
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