'use strict'

var apiURL = ""
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    apiURL = "http://" + location.host + "/"
} else {
    apiURL = "https://" + location.host + "/"
}

$(document).ready(() => {
    setupValidation()
    validateFormFields()
    validatePasswordMatch()

    $('#signupButton').on('click', function () {
        if (!$('#signup-form').valid()) {
            return
        } else if ($('#password-field').val() != $('#confirm_password').val()) {
            alert("Password does not match")
            return
        }
        var email = $("[name='email']").val()
        var username = $("[name='username']").val()
        var password = $("[name='password']").val()
        signupUser(apiURL, email, username, password)
    })
})

function getProjectConfig(callback) {
    $.ajax({
        type: "GET",
        url: apiURL + "getProjectConfig",
        success: function (result) {
            console.log(result.config)
            return callback(null, result.config)
        },
        error: function (error) {
            return callback(error)
        }
    })

}

function setupValidation() {
    $.validator.setDefaults({
        errorClass: 'invalid-feedback',
        highlight: (element) => {
            $(element).closest('.form-control').addClass('is-invalid')
        },
        unhighlight: (element) => {
            $(element).closest('.form-control').removeClass('is-invalid')
        }
    })
}

function signupUser(apiURL, email, username, password, callback) {
    let body = {
        email: email,
        username: username,
        password: password
    }
    $.ajax({
        type: "POST",
        url: apiURL + "createNewUser",
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(body),
        success: function (result) {
            alert(result.message)
            window.location.replace(apiURL);
        },
        error: function (error) {
            alert(error.responseJSON.message)
        }
    })
}


function validateFormFields() {
    $('#signup-form').validate({
        rules: {
            email: {
                required: true,
                email: true,
            },
            username: "required",
            password: {
                required: true,
                minlength: 6
            },
            confirm_password: "required"
        },
        messages: {
            email: {
                required: "Please enter a valid email address."
            },
            username: {
                required: "Please provide a username.",
                minlength: "Password needs to be at least 6 characters."
            },
            password: {
                required: "Please provide a password."
            },
            confirm_password: {
                required: "Please confirm your password."
            }
        }
    })
}

function validatePasswordMatch() {
    $('#password-field, #confirm_password').on('keyup', () => {
        if ($('#password-field').val() == $('#confirm_password').val()) {
            ($(".password-mismatch"))[0].style.display = "none"
        } else {
            ($(".password-mismatch"))[0].style.display = "block"
        }
    })
}

function onSignIn(googleUser) {
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.getAuthResponse().id_token);
            // Sign in with credential from the Google user.
            firebase.auth().signInWithCredential(credential).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                alert(errorMessage)
            });
        } else {
            console.log('User already signed-in Firebase.');
        }
    });
}

function isUserEqual(googleUser, firebaseUser) {
    if (firebaseUser) {
        var providerData = firebaseUser.providerData;
        for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
                // We don't need to reauth the Firebase connection.
                return true;
            }
        }
    }
    return false;
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}