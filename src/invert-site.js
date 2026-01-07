// Description: Inverts the colors of the webpage (dark mode simulator).

(function () {
    var e = document.querySelector("*").style;
    if (e.filter.includes("invert(100%)")) {
        e.filter = "invert(0%)";
    } else {
        e.filter = "invert(100%)";
    }
})();