const fs = require('fs');
const path = require('path');
var requests = require('requests');
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public/assets'));
app.use(express.static(__dirname + '/lib'));
const homeFile =  fs.readFileSync(`${__dirname}/public/index.html`,"utf-8");
const replaceData = (htmlFile,jsonFile) => {
    let weatherCast = htmlFile.replace("{%weather%}",jsonFile.weather[0].main);
    let tempInCel = jsonFile.main.temp - 273.15;
    weatherCast =  weatherCast.replace("{%temp%}",tempInCel.toFixed(2));
    weatherCast =  weatherCast.replace("{%icon%}",jsonFile.weather[0].icon);
    weatherCast =  weatherCast.replace("{%city%}",jsonFile.name);
    weatherCast =  weatherCast.replace("{%country%}",jsonFile.sys.country);
    weatherCast =  weatherCast.replace("Montgomery","Sahiwal");
    return weatherCast;
}
app.get('/', (req, res) => {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Sahiwal,pakistan&APPID=fd0f7edce23578b563454d0631c2718e")
        .on('data', function (chunk) {
            const objData = JSON.parse(chunk);
            const arrayData = [objData];
            const realData = arrayData.map((val) => replaceData(homeFile,val)).join("");
            res.send(realData);
        })
        .on('end', function (err) {
        if (err) return console.log('connection closed due to errors', err);
        res.end();
        });
});
app.listen(3000,() =>{
    console.log("Server has been created........")
});