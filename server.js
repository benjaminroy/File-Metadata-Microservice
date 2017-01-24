var express = require('express');
var path = require("path");
var multer = require('multer'); // https://www.npmjs.com/package/multer#multer-opts
var fs = require('fs');

var port = 8080;
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
        
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
var upload = multer({ storage : storage}).single('fileinput');

var app = express();
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/bower_components')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/upload', function (req, res) {
    fs.readdir(__dirname + '/uploads', function(err, files) {
        if (err) {
            console.log(err);
        } else {
            files.forEach(function(file) {
                fs.unlinkSync(__dirname + '/uploads/' + file, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(file + 'deleted successfully');
                    }
                });
            });
        }
    });
    
    upload(req, res, function(err) {
        if (err || !req.file) {
            console.log("Error uploading file");
            return res.send("Error uploading file");
        } 
        console.log("File is uploaded");
        return res.send(JSON.stringify({ size : req.file.size }));
    });    
});

app.listen(process.env.PORT || port, function () {
    console.log('App listening on port ' + port.toString() + '...');
});