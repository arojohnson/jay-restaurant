$(document).on("pagecreate", "#clock", function () {
    myVar = setInterval(updateTime, 1000);
    $("#clkpause").click(function () {
        pauseClock();
    });

});

function updateTime() {
    // Create a Date object containing current time
    var d = new Date();
    // Convert to short time format and update
    // the label, LED
    $("#LED").html(d.toLocaleTimeString());
}

function pauseClock() {
    if (myVar != null) {
        //Timer running
        clearInterval(myVar);
        //using JQuery to modify the text of pause btn
        $("#clkpause").text("Con't");
        // Change the pause button to green color
        $("#clkpause").css("color", "rgb(0, 255, 0)");
        // set myVar to null
        myVar = null;
    } else {
        //Start timer again
        myVar = setInterval(updateTime, 1000);
        $("#clkpause").text("Pause");
        $("#clkpause").css("color", "red");
    }
}








