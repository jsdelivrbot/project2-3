var express = require('express');
var pgp = require('pg-promise')(/*options*/);
// var db = pgp('postgres://postgres:password123@localhost:8081/project2');
var db = pgp('postgres://esndifdttprtov:17e5dba5acc07e1aec1e002cddff1c82d99f86323ce9741b3d2fae130940c010@ec2-184-73-167-43.compute-1.amazonaws.com:5432/d1plvo0nju7jld?ssl=true');
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

  response.render('pages/index');
});

app.get('/login', function(request, response) {
    response.render('pages/login');
});

app.get('/exs', function(request, response) {
    response.render('pages/ex');
});


app.post('/gooduser', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;
    db.one('SELECT password FROM users WHERE username = $1', [username])
        .then(function (data) {
            console.log(data);
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
                    request.session.user = username;
                    request.session.save();
                    response.writeHead(302, {Location: '/'});
                }).catch(function (err) {
                response.writeHead(302, {Location: '/login'});
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
    console.log(fbid);
    db.one('SELECT * FROM users WHERE fid = $1', [fbid])
        .then(function (data) {
            if (data.fid) {
                response.send({success : true});
                request.session.user = 'FB';
                request.session.fb = fbid;
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

app.post('/del', function (request, response) {
    var id = request.body.id;
    db.none('DELETE FROM photo WHERE id = $1', [id])
        .then(function () {
            response.send({success : true});
        }) .catch (function (err) {
        response.send({success : false});
        console.log(err);
    });
});

app.post('/edit', logedon, function (request, response) {
   id = request.body.id;
   phname = request.body.phName;
   des = request.body.des;
   console.log(request.body);
    db.none('UPDATE photo SET photoname = $1, dec = $2 WHERE id = $3', [phname, des, id])
        .then(function () {
            response.send({success : true});
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
    var phname = request.body.phname;
    var des = request.body.dec;

    var id = -1;
    if (request.session.user == "g") {
        db.one('SELECT id FROM users WHERE gid = $1', [request.session.g])
            .then(function (data) {
                id = data.id;
                db.none('INSERT INTO photo(photoname, url, dec, owner_id, shared) VALUES ($1, $2, $3, $4, $5)', [phname, newFile.name, des, id, false])
                    .then(function () {
                        //response.send('{"add" : true}');
                    }) .catch (function (err) {
                    //response.send('{"add" : false}');
                    console.log(err);
                });
                newFile.mv('./upload/' + newFile.name, function (err) {
                    if (err)
                        return response.status(500).send('{"uploaded" : false}');
                    else
                        response.writeHead(302, {Location: '/'});
                    response.end();
                });
            }).catch (function (err) {
            console.log(err);
        });
    } else if (request.session.user ==  "FB") {
        db.one('SELECT id FROM users WHERE fid = $1', [request.session.fb])
            .then(function (data) {
                id = data.id;
                db.none('INSERT INTO photo(photoname, url, dec, owner_id, shared) VALUES ($1, $2, $3, $4, $5)', [phname, newFile.name, des, id, false])
                    .then(function () {
                        //response.send('{"add" : true}');
                    }) .catch (function (err) {
                    //response.send('{"add" : false}');
                    console.log(err);
                });
                newFile.mv('./upload/' + newFile.name, function (err) {
                    if (err)
                        return response.status(500).send('{"uploaded" : false}');
                    else
                        response.writeHead(302, {Location: '/'});
                    response.end();
                });
            }).catch (function (err) {
            console.log(err);
        });
    } else {
        db.one('SELECT id FROM users WHERE username = $1', [request.session.user])
            .then(function (data) {
                id = data.id;
                db.none('INSERT INTO photo(photoname, url, dec, owner_id, shared) VALUES ($1, $2, $3, $4, $5)', [phname, newFile.name, des, id, false])
                    .then(function () {
                        //response.send('{"add" : true}');
                    }) .catch (function (err) {
                    //response.send('{"add" : false}');
                    console.log(err);
                });
                newFile.mv('./upload/' + newFile.name, function (err) {
                    if (err)
                        return response.status(500).send('{"uploaded" : false}');
                    else
                        response.writeHead(302, {Location: '/'});
                    response.end();
                });
            }).catch (function (err) {
            console.log(err);
        });
    }
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

app.post('/logout', logedon, function (request, response) {
    if (request.session.user == "g") {
        response.json({
            success: true,
            user: 'g'
        });
        request.session.destroy();
    } else if (request.session.user == "FB") {
        response.json({
            success: true,
            user: 'fb'
        });
        request.session.destroy();
    } else {
        response.json({
            success: true,
            user: 'users'
        });
        request.session.destroy();
    }
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
                    response.json({
                        success: false
                    });
                })
            }).catch (function (err) {
            console.log(err);
        });
    } else if (request.session.user ==  "FB") {
        db.one('SELECT id FROM users WHERE fid = $1', [request.session.fb])
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
    } else {
        db.one('SELECT id FROM users WHERE username = $1', [request.session.user])
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
    if (!request.session.user) {
        response.writeHead(302, {Location: '/login'});
        response.end();
    } else {
        next();
    }
}