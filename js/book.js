window.flipNext = function() {
    let secondPage = document.querySelectorAll(".book .page")[1];
    $(secondPage).removeClass('no-anim').toggleClass('flipped');
    window.reorder();
}
window.reorder = function() {
    $(".book").each(function () {
        var pages = $('.book').find(".page")
        var pages_flipped = $('.book').find(".flipped")
        pages.each(function (i) {
            $(this).css("z-index", pages.length - i)
        })
        pages_flipped.each(function (i) {
            $(this).css("z-index", i + 1)
        })
    });
}

// //  document.getElementById("startGame").onclick = function() {
// //     alert("button was clicked");
// //  }​;​