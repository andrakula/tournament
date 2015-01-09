$(document).ready(function() {

    $("table.jobs a.button").not('.noajax').click(function() {
        $("#check-status").text("Processing...");

        $.get($(this).attr("href"), function(data) {
            $("#check-status").text(data);
        }).fail(function() {
            $("#check-status").text("Error.");
        });

        return false;
    });

});
