var express = require('express');
var pgp = require('pg-promise')(/*options*/);
var db = pgp('postgres://postgres:FortWorth@localhost:5432/project2');
var passwordHash = require('password-hash');
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(fileUpload());

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.post('/gooduser', function (request, response) {
    var username = request.body.username;
    var hashedPassword = request.body.password;
    console.log(username + ' ' + hashedPassword);
    db.any('SELECT password FROM users WHERE username = $1', [username])
        .then(function (data) {
            if(passwordHash.verify(data.password, hashedPassword)) {
                response.send('{"good" : true}');
            } else {
                response.send('{"good" : false}');
            }
        })
        .catch(function (error) {
            console.log('ERROR:', error)
        })
});

app.post('/newuser', function (request, response) {
    var name = request.body.names;
    var username = request.body.username;
    var email = request.body.email;
    var password = request.body.password;
    db.none('INSERT INTO users(name, username, email, password) VALUES($1, $2, $3, $4)', [name, username, email, password])
        .then(function () {
            response.send('{"add" : true}');
        }) .catch (function (err) {
        response.send('{"add" : false}');
        console.log(err);
    })
});

app.post('/upload', function (request, response) {
    if (!request.files) {
        return response.status(400).send('No files were uploaded.');
    }
    var newFile = request.files.file;
    newFile.mv('./upload/' + , function(err) {
        if (err)
            return res.status(500).send(err);
        res.send('File uploaded!');
    });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on http:\/\/localhost:' + app.get('port'));
});


