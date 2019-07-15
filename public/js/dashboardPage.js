$(document).ready(() => {
    $(".sideMenuToggler").on("click", () => {
        $(".wrapper").toggleClass("active");
        $(".arrow-right").toggleClass("show-item");
        $(".arrow-left").toggleClass("hide-item");
    });

    $("#uploadButton").on("click", () => {
        /** SUCCESS UPLOAD EVENTS */

        // add new card with success uploads into card-wrapper.
        var $cardWrapper = $(".card-wrapper");
        $cardWrapper.append(addMediaCard());
        // Hide modal upon successful upload.
        $("#addCardModal").modal("toggle");
        $("#successAlert").show();
        setTimeout(() => {
            $("#successAlert").hide();
        }, 2500);
    });
});

function addMediaCard() {
    let mediaBlock = `<div class="display-card">
                    <img src="/media/stock_image_1.jpg" alt="Display Image 1">
                    <div></div>
                </div>`;
    return mediaBlock;
}
