$(document).ready(() => {
    var apiURL = ""
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        apiURL = "http://" + location.host + "/"
    } else {
        apiURL = "https://" + location.host + "/"
    }

    $.validator.setDefaults({
        errorClass: 'invalid-feedback',
        highlight: (element) => {
            $(element).closest('.form-control').addClass('is-invalid')
        },
        unhighlight: (element) => {
            $(element).closest('.form-control').removeClass('is-invalid')
        }
    })
    validateFormFields()
    validatePasswordMatch()

    $('#signupButton').on('click', function() {
        if (!$('#signup-form').valid() || $('#password-field').val() != $('#confirm_password').val() ) {
            console.log("Boo")
            return
        } 
        var email = $("[name='email']").val()
        var username = $("[name='username']").val()
        var password = $("[name='password']").val()
        
    })
})

function signupUser(email, username, password, callback) {
    $.ajax({
        type: "POST",
        url: apiURL + "createNewUser",
        success: function (result) {
        },
        error: function (err) {
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
            password: "required",
            confirm_password: "required"
        },
        messages: {
            email: {
                required: "Please enter a valid email address."
            },
            username: {
                required: "Please provide a username."
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