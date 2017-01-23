var express = require('express');
var path = require("path");
var multer = require('multer');
var port = 8080;
var app = express();

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
        
    },
    filename: function (req, file, callback) {
        callback(null,Date.now() + file.originalname);
        
    }
});
var upload = multer({ storage : storage}).single('myfile.txt');

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/bower_components')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/upload', function (req, res) {
    upload(req, res, function(err) {
        if (err) {
            console.log("Error uploading file.");
            return res.end("Error uploading file.");
            
        }
        console.log("File is uploaded");
        console.log(req.files);
        res.end("File is uploaded");
    });    
});


app.listen(port, function () {
    console.log('App listening on port ' + port.toString() + '...');
});