$(document).ready(() => {
    $(".sideMenuToggler").on("click", () => {
        $(".wrapper").toggleClass("sidebar-close");
        $(".arrow-right").toggleClass("show-item");
        $(".arrow-left").toggleClass("hide-item");
    });

    // Events after upload button clicked.
    $("#uploadButton").on("click", () => {
        /** SUCCESS UPLOAD EVENTS - to be completed with backend */

        // add new card with success uploads into card-wrapper.
        var $cardWrapper = $(".card-wrapper");
        $cardWrapper.append(addMediaCard());
        // Hide modal upon successful upload.
        $("#addCardModal").modal("toggle");
        $("#successAlert").show();
        setTimeout(() => {
            $("#successAlert").hide();
        }, 2500);

        // On Success of upload new card, delete demo cards
        $(".demo-card").remove();
    });

    // Fetch values from imageUploadBlock.
    $("#imageUploadBlock").change(e => {
        console.log(e);
        enableUploadButton();
    });

    // Fetch values from videoUploadBlock.
    $("#videoUploadBlock").change(e => {
        console.log(e);
        enableUploadButton();
    });

    // When modal is closed, clear input/reset upload modal
    $("#addCardModal").on("hidden.bs.modal", () => {
        $("#imageUploadBlock").val("");
        $("#videoUploadBlock").val("");
        // after values are cleared, reset upload button to disabled
        enableUploadButton();
    });

    // Navbar button
    $("#mobileNavButton").on("click", () => {
        if ($("#mobileNavBar").css("display") == "none") {
            $("#mobileNavBar").show();
            $("#mobileNavBar").css("opacity", 1);
        } else {
            $("#mobileNavBar").css("opacity", 0);
            $("#mobileNavBar").css("display", "none");
        }
    });

    hideMobileNav();
    $(window).on("resize", () => {
        hideMobileNav();
    });
});

// Display card
function addMediaCard() {
    let mediaBlock = `<div class="display-card">
                    <img src="/media/stock_image_1.jpg" alt="Display Image 1">
                    <div></div>
                </div>`;
    return mediaBlock;
}

function enableUploadButton() {
    if (
        $("#imageUploadBlock").val() == "" ||
        $("#videoUploadBlock").val() == ""
    ) {
        // if any field is empty, button is disabled
        $("#uploadButton").attr("disabled", "disabled");
    } else {
        // enable upload button
        $("#uploadButton").removeAttr("disabled");
    }
}

function hideMobileNav() {
    if ($(window).width() >= 950) {
        $("#mobileNavBar").css("display", "none");
    }
}
