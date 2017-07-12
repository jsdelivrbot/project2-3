/**
 * Created by jmp on 7/6/17.
 */

function logan() {
    console.log("login hello");
    var username = $("#username").val();
    var password = $("#password").val();
    var params = {
        username: username,
        password: password
    };

    $.post("/gooduser", params, function(result) {
    if (result && result.success) {
        window.location = "/"
    } else {
        console.log("Error logging in.");
    }
    });
};

function newGuser(params) {
    $.post("/newGuser", params, function(result) {
        if (result && result.success) {
            //window.location = "/"
        } else {
            console.log("Error logging in.");
        }
    });
}

function onSuccess(googleUser) {
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    var params = {
      gid: googleUser.getBasicProfile().getId()
    };
    $.post("/goodGuser", params, function(result) {
        if (result && result.success) {
            window.location = "/"
        } else {
            params = {
                names: googleUser.getBasicProfile().getName(),
                email: googleUser.getBasicProfile().getEmail(),
                gid: googleUser.getBasicProfile().getId()
            };
            newGuser(params);
        }
    });
}

function onFailure(error) {
    console.log(error);
}

function renderButton() {
    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 40,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}

function goodFBuser() {
    FB.api('/me?fields=id,name,email', function(response) {
        console.log(response.id + " " + response.name + " " + response.email);
        var params = {
            fbid: response.id
        };
        $.post("/goodFBuser", params, function(result) {
            if (result && result.success) {
                window.location = "/"
            } else {
                console.log(result);
                params = {
                    names: response.name,
                    email: response.email,
                    fbid: response.id
                };
                newFBuser(params);
            }
        });
    });
}

function newFBuser(params) {
    $.post("/newFBuser", params, function(result) {
        if (result && result.success) {
            window.location = "/"
        } else {
            console.log("Error logging in.");
        }
    });
}

function logedin() {
    $.post("/logedon", function(result) {
        if (result && result.success) {
            // window.location = "/"
        }
    });
}

function getImg() {
    $.post("/img", function(result) {
        if (result) {
            console.log(result);
            $.each(result.data, function (index, value) {
                $('#img').append("<a onclick='imgMenu(" + value.id + ")'><img class='img' id='" + value.id + "' onload='resize(" + value.id + ", 400, 400)' src='/upload/" + value.url + "'></a>");
            });
        } else {
            $("#status").text("Error logging in.");
        }
        resize();
    });
}

function imgMenu(id) {
    var params = {
        id: id
    }
    $.post("/imgDec", params, function(result) {
        if (result && result.success) {
            var re = {
                names: result.data.photoname,
                dec: result.data.dec
            };
            var img = 400;
            $('.pic').css("visibility", "visible");
            $('.pic').append("<div id='name'>" + re.names + "</div>");
            $('.pic').append("<a href='#' class='close' onclick='cl()'>X</a>");
            $('.pic').append("<img class='imgMenu' id='" + img + "' onload='resize(" + img + ", 550, 550)' src='" + $("#" + id).attr('src') + "'>");
            $('.pic').append("<div id='dec'>" + re.dec + "</div>");
            $('.pic').append('<button id="edit" type="button">Edit</button>');
            $('.pic').append('<button id="del" type="button" onclick="del(' + id + ')">Delete</button>');
        } else {
            $("#status").text("Error logging in.");
        }
    });
}

function resize(id, maxWidth, maxHeight) {
        var ratio = 0;  // Used for aspect ratio
        var width = $("#" + id).width();    // Current image width
        var height = $("#" + id).height();  // Current image height

        // Check if the current width is larger than the max
        if (width > maxWidth) {
            ratio = maxWidth / width;   // get ratio for scaling image
            $("#" + id).css("width", maxWidth); // Set new width
            $("#" + id).css("height", height * ratio);  // Scale height based on ratio
            height = height * ratio;    // Reset height to match scaled image
            width = width * ratio;    // Reset width to match scaled image
        }

        // Check if current height is larger than max
        if (height > maxHeight) {
            ratio = maxHeight / height; // get ratio for scaling image
            $("#" + id).css("height", maxHeight);   // Set new height
            $("#" + id).css("width", width * ratio);    // Scale width based on ratio
            width = width * ratio;    // Reset width to match scaled image
        }
};

function cl() {
    $('.pic').css("visibility", "hidden");
    $('.upload').css("visibility", "hidden");
    $('.pic').empty();
}

function logout() {
    $.post("/logout", function(result) {
        if (result && result.success) {
            if(result.user == "g") {
                var auth2 = gapi.auth2.getAuthInstance();
                auth2.signOut().then(function () {
                    console.log('User signed out.');
                    window.location = "/login";
                });
            } else if (result.user == "FB") {
                FB.logout(function (response) {
                    console.log(response);
                    window.location = "/login";
                })
            } else {
                window.location = "/login";
            }
        }
    });
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('.blah').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function del(id) {
    var params = {
        id: id
    };
    $.post("/imgDec", params, function(result) {
        if (result && result.success) {

        } else {
            $("#status").text("Error logging in.");
        }
    });

}

