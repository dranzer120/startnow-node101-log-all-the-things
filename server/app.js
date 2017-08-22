const express = require('express');
const fs = require('fs');
const app = express();

var date = new Date().toISOString();
var logjson = [];

app.use((req, res, next) => {
// write your logging code here
    var userAgent = req.headers['user-agent'];
    userAgent = userAgent.replace(/\,/g,"");
    
    var csv ='\n'+ userAgent +','+ date +',' + req.method +',' + req.path +',HTTP/' + req.httpVersion +',' + res.statusCode; 
    
    fs.appendFile('log.csv', csv, function (err) {
        if (err) throw err;
    });
    console.log(csv);

    // json = JSON.parse(json)
    // json.push(csv)

    next();
})

app.get('/', (req, res) => {
// write your code to respond "ok" here
    res.sendStatus(200);
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
    fs.readFile('./log.csv', {encoding: "utf8"}, function(err, data){
        if(err){
            // console.log(err)
         }              
           var arrayLines = data.split('\n');
           arrayLines.shift();

     //console.log(arrayLines);
   
        arrayLines.forEach(function (lines){
           var Line = lines.split(',');
           //This object is created an object/
           var dataLog = {
               'Agent':Line[0],
               'Time':Line[1],
               'Method':Line[2],
               'Resource':Line[3],
               'Version':Line[4],
               'Status':Line[5]
           };
           logjson.push(dataLog);
       
        });

       res.json(logjson);
       });
    });

module.exports = app;
