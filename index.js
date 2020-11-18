const express = require('express')
const app = express()
const port = 9000
const bodyParser = require('body-parser')
const cors = require("cors");
require('dotenv').config()


app.use(cors());
app.use(bodyParser.json());
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pgiio.mongodb.net/waMessages?retryWrites=true&w=majority`;
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
        const accountSid = process.env.ACCOUNT_SID;
        const authToken = process.env.AUTH_TOKEN;
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
    app.listen(process.env.PORT || port)



});




