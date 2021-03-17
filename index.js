const path = require("path");
const http = require("http");
const request = require("request");
const cheerio = require("cheerio");
const express = require("express");
const socketio = require("socket.io");
const moment = require("moment");
const webpush = require("web-push");
const bodyParser = require("body-parser");


const app = express();
const server = http.createServer(app);
const io = socketio(server);



app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
const publicVapidKey = "BABuG-6utkPEV41GloqLxkmgzfS9u-Wd8rIFFDi0-ubIjo5vPTBbLSe6h2BoALKIS7xIM7ZILvvj1JDfFye8F6s";
const privateVapidKey = "knJ3tQbRkTyqem5kAH3SB3dZvfJQyOMmAdClukPj0mo";
webpush.setVapidDetails("mailto:test@test.com", publicVapidKey, privateVapidKey);

app.post("/subscribe", (req, res) => {
    const subscription = req.body;

    res.status(201).json({});

    const payload = JSON.stringify({ title: "Vaccine Alert"});

    webpush.sendNotification(subscription, payload).catch(err => console.error(err))
})


server.listen(5000, () => console.log("Server running on port 5000"));


io.on("connection", socket => {
    setInterval(() => {
        request("https://www.cvs.com/immunizations/covid-19-vaccine/immunizations/covid-19-vaccine.vaccine-status.NJ.json?vaccineinfo", (error,response, html) => {
            if(!error && response.statusCode == 200){
                const $=cheerio.load(html);

                const body = $("body");
                socket.emit("CVS", {data: body.html()})
            }else{
                console.log(error)
            }
        })
        socket.emit("time", {time: moment().format("MMM D [at] h:mm:ss")})
    }, 1000)

});


