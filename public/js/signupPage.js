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