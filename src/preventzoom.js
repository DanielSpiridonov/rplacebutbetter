
document.addEventListener("keydown", function (e) {
    if (
        keyboardCheck.checked &&
        e.ctrlKey &&
        (e.keyCode == "61" ||
            e.keyCode == "107" ||
            e.keyCode == "173" ||
            e.keyCode == "109" ||
            e.keyCode == "187" ||
            e.keyCode == "189")
    ) {
        e.preventDefault();
    }
});
document.addEventListener(
    "wheel",
    function (e) {
        if (scrollCheck.checked && e.ctrlKey) {
            e.preventDefault();
        }
    },
    {
        passive: true
    }
);
