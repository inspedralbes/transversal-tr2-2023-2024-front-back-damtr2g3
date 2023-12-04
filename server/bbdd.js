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

module.exports={obtenirPreguntes, login, ObtenirInfoUsuari, CambiarContrasena, loginProf}

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
        const [rows, fields] = await connection.execute('SELECT  correu, contrasenya FROM Profesors');
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