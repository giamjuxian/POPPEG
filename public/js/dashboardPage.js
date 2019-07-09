$(document).ready(() => {
    $(".sideMenuToggler").on("click", () => {
        $(".wrapper").toggleClass("active");
        $(".arrow-right").toggleClass("show-item");
        $(".arrow-left").toggleClass("hide-item");
    });
});
