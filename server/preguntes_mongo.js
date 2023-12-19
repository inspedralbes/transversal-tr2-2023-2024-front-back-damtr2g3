const partides_mongo = require("./partides_mongo")

let preguntes;

async function connectToPreguntes(){
    return new Promise((resolve, reject) => {
        partides_mongo.client.connect()
            .then(() => {
                let database = partides_mongo.client.db(partides_mongo.dbName);
                preguntes = database.collection('preguntas');
                resolve();
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

//obtenir totes les preguntes desde mongo
async function getAllPreguntes(){
    return new Promise((resolve, reject) => {
        preguntes.find().toArray()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

//obtenir una pregunta per id desde mongo
async function getPregunta(pregunta_id){
    return new Promise((resolve, reject) => {
        preguntes.findOne({ id: pregunta_id })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

//insertar una pregunta a mongo
async function insertPregunta(pregunta){
    return new Promise((resolve, reject) => {
        preguntes.insertOne(pregunta)
            .then(result => {
                resolve();
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

//eliminar una pregunta desde mongo
async function deletePregunta(pregunta_id){
    return new Promise((resolve, reject) => {
        pregunta_id = parseInt(pregunta_id);
        preguntes.deleteOne({ id: pregunta_id })
            .then(result => {
                console.log(result);
                resolve();
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

//modificar una pregunta desde mongo
async function updatePregunta(pregunta_id, pregunta_nova){
    return new Promise((resolve, reject) => {
        pregunta_id = parseInt(pregunta_id);
        preguntes.updateOne({ id: pregunta_id }, { $set: pregunta_nova })
            .then(result => {
                resolve();
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}
module.exports = { connectToPreguntes, getAllPreguntes, getPregunta, insertPregunta, deletePregunta, updatePregunta }