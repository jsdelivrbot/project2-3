var express = require('express');
var pgp = require('pg-promise')(/*options*/);
var db = pgp('postgres://postgres:password123@localhost:8081/project2');
var bcrypt = require('bcrypt');
const saltRounds = 10;
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
var session = require('express-session');
var app = express();

app.use(session({
    secret: 'my-super-secret-secret!',
    resave: false,
    saveUninitialized: true
}));

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use("/upload", express.static(__dirname + "/upload"));

app.use(fileUpload());

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', logedon, function(request, response) {
    console.log(request.session);
  response.render('pages/index');
});

app.get('/login', function(request, response) {
    console.log(request.session);
    response.render('pages/login');
});

app.get('/exs', function(request, response) {
    response.render('pages/ex');
});


app.post('/gooduser', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;
    console.log(username + ' ' + password);
    db.one('SELECT password FROM users WHERE username = $1', [username])
        .then(function (data) {

            var hashedpassword = data.password;
            bcrypt.compare(password, hashedpassword, function (err, res) {
               if (res) {
                   response.send({success : true});
                    request.session.user = username;
                    request.session.save();
               } else {
                   response.send({success : false});
               }
            });
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
    if (request.body.password) {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            db.none('INSERT INTO users(name, username, email, password) VALUES($1, $2, $3, $4)', [name, username, email, hash])
                .then(function () {
                    response.send({success: true});
                    request.session.user = username;
                    request.session.save();
                }).catch(function (err) {
                response.send({success: false});
                console.log(err);
            });
        });
    } else {
        response.send({success: false});
    }
});

app.post('/goodGuser', function (request, response) {
    gid = request.body.gid;
    db.one('SELECT * FROM users WHERE gid = $1', [gid])
        .then(function (data) {
            if (data.gid) {
                response.send({success : true});
                request.session.user = 'g';
                request.session.g = gid;
                request.session.save();
            } else {
                response.send({success : false});
            }
        })
        .catch(function (error) {
            console.log('ERROR:', error);
            response.send({success : false});
        })
});

app.post('/newGuser', function (request, response) {
    var name = request.body.names;
    var email = request.body.email;
    var gID = request.body.gid;
    db.none('INSERT INTO users(name, email, gid) VALUES($1, $2, $3)', [name, email, gID])
        .then(function () {
            response.send({success : true});
            request.session.user = 'g';
            request.session.g = gID;
            request.session.save();
        }) .catch (function (err) {
            response.send({success : false});
            console.log(err);
        });
});

app.post('/goodFBuser', function (request, response) {
    fbid = request.body.fbid;
    db.one('SELECT * FROM users WHERE fid = $1', [fbid])
        .then(function (data) {
            if (data.fid) {
                response.send({success : true});
                request.session.user = 'FB';
                request.session.fb = fid;
                request.session.save();
            } else {
                response.send({success : false});
            }
        })
        .catch(function (error) {
            console.log('ERROR:', error);
            response.send({success : false});
        })
});

app.post('/newFBuser', function (request, response) {
    var name = request.body.names;
    var email = request.body.email;
    var fid = request.body.fbid;
    db.none('INSERT INTO users(name, email, fid) VALUES($1, $2, $3)', [name, email, fid])
        .then(function () {
            response.send({success : true});
            request.session.user = 'FB';
            request.session.fb = fid;
            request.session.save();
        }) .catch (function (err) {
        response.send({success : false});
        console.log(err);
    });
});

app.post('/upload', function (request, response) {
    if (!request.files) {
        return response.status(400).send('No files were uploaded.');
    }
    var newFile = request.files.file;
    db.none('INSERT INTO photo(url, dec, owner_id, shared) VALUES ($1, $2, $3, $4)', [newFile.name, 'stuff', 7, false])
        .then(function () {
            //response.send('{"add" : true}');
        }) .catch (function (err) {
            //response.send('{"add" : false}');
        console.log(err);
    });
    newFile.mv('./upload/' + newFile.name, function (err) {
        if (err)
            return response.status(500).send('{"uploaded" : false}');
        response.send('{"uploaded" : true}');
    });
});

app.post('/imgDec', logedon, function (request, response) {
    var id = request.body.id;
    db.one('SELECT * FROM photo WHERE id = $1', [id])
        .then(function (data) {
            response.json({
                success: true,
                data
            });
        }).catch(function (err) {
        console.log(err);
    });
});

app.post('/img', logedon, function (request, response) {
    var id = -1;
    if (request.session.user == "g") {
        db.one('SELECT id FROM users WHERE gid = $1', [request.session.g])
            .then(function (data) {
                id = data.id;
                db.any('SELECT * FROM photo WHERE owner_id = $1', [id])
                    .then(function (data) {
                        response.json({
                            success: true,
                            data
                        });
                    }).catch(function (err) {
                    console.log(err);
                })
            }).catch (function (err) {
            console.log(err);
        });
    } else if (request.session.user ==  "FB") {
        db.one('SELECT id FROM users WHERE fid = $1', [request.session.fb])
            .then(function (data) {
                id = data.id;
            }).catch (function (err) {
            console.log(err);
        });
    } else {
        db.one('SELECT id FROM users WHERE username = $1', [request.session.user])
            .then(function (data) {
                id = data.id;
            }).catch (function (err) {
            console.log(err);
        });
    }
});

function getImg(id) {
    db.any('SELECT * FROM photo WHERE owner_id = $1', [id])
        .then(function (data) {
            console.log(data);
        }).catch(function (err) {
            console.log(err);
        })
}

app.listen(app.get('port'), function() {
  console.log('Node app is running on http:\/\/localhost:' + app.get('port'));
});


function logedon(request, response, next) {
    console.log(request.session.user);
    if (!request.session.user) {
        response.writeHead(302, {Location: '/login'});
        response.end();
    } else {
        next();
    }
}