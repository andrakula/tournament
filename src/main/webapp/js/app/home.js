$(document).ready(function() {

    $("#grace-login-dialog-message").dialog({
        modal : false,
        buttons : {
            "Change" : function() {
                var win = window.open($("#change-password-url").text(), '_blank');
                win.focus();
            },
            Close : function() {
                $(this).dialog("close");
            }
        }
    });

});