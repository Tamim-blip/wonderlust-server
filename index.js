
import express from "express"
import cors from "cors"
import 'dotenv/config'
import { MongoClient, ObjectId } from 'mongodb';


const app = express()
const PORT = process.env.PORT || 3001


app.use(cors())
app.use(express.json())


const client = new MongoClient(process.env.DB_CONNECTION_ARI);


export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const connectedDB = await connectToMongoDB()
const db = connectedDB.db("wonder-lust")
const destinition = db.collection("destinition")


app.post("/add-destinition", async(req, res) => {
    
    const data = req.body
    const result = await destinition.insertOne(data)
    res.send(result)

})

app.get("/destination", async(req, res) => {
    const result = await destinition.find({}).toArray()
    res.send(result)
})


app.get("/destination/:id", async(req, res) => {

    const id = req.params.id

    const query = {_id : new ObjectId(id)}
    const result = await destinition.findOne(query)
    res.send(result)
})

app.patch("/destination/:id", async(req, res) => {
   const  id = req.params.id
   const updatedData = req.body
    const result = await destinition.updateOne(
        {_id : new ObjectId(id)},
        {
            $set : updatedData
        }
    )

    res.send(result)
})


app.delete("/destination/:id", async(req, res) => {

    const id = req.params.id
    const result = await destinition.deleteOne({_id : new ObjectId(id)})
    res.send(result)

})


app.listen(PORT , () => {
    console.log("Server is running on port", PORT)
})