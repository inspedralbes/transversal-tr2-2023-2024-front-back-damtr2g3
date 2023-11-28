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



export async function obtenirPreguntes(numPreguntes){
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("preguntas");
    let preguntes=[]
    if(numPreguntes>0){
        let preguntes= db.col.aggregate(
            [
                { $match: { _id: { $nin: preguntes.map(pregunta => pregunta._id) } } },
                { $sample: { size: numPreguntes } } 
            ]
        )
    }
    else
        preguntes=db.preguntas.find()

    preguntes=JSON.parse(preguntes)
    return preguntes
}//obtenir un numero n de preguntes desde mongo