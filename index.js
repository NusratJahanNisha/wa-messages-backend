const express = require('express')
const app = express()
const port = 9000
const bodyParser = require('body-parser')
const cors = require("cors");
require('dotenv').config()


app.use(cors());
app.use(bodyParser.json());
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://waMessages:nusrat123@cluster0.pgiio.mongodb.net/waMessages?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

    // ---------------sending in the database
    const messageCollection = client.db("waMessages").collection("user");
    console.log("db connected successfully");
    app.post('/message', (req, res) => {
        const newMessage = req.body;
        messageCollection.insertOne(newMessage)
            .then(result => { res.send(result.insertedCount > 0) })
        console.log(req.body)
        console.log(err);


        // ----------sending in the whatsapp------------
        const accountSid = 'ACb0551dcdd5fc61dff85580783ee8d0ab';
        const authToken = 'bddc75ba6103f70021615f4a77627590';
        const clientWa = require('twilio')(accountSid, authToken);
        clientWa.messages
            .create({
                body: newMessage.message,
                from: 'whatsapp:+14155238886',
                to: 'whatsapp:+8801304957103'
            })
            .then(message => console.log(message.sid))
            .done();
    })

    app.get('/', (req, res) => {
        res.send("hello world !")
    })
    app.listen(port)





});




