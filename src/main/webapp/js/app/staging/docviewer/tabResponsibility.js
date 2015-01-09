$(function() {

    /**
     * bind add comment form submit event
     */
    $(document).on('click', '#tabResponsibilityContent #saveResponsibility', function(e) {
        $('#responsibilityForm').docViewerSubmitForm({
            afterSuccess : function() {
                initUseParentRespEvent();
                tabContent.responsibilityForm = "";
                var successMsg = $('#successMessagesResponsibility').val();
                var successElement = $('#successMsg');
                if (successMsg) {
                    successElement.html(successMsg);
                    successElement.show();
                } else {
                    successElement.hide();
                    successElement.empty();
                }

            }
        });
    });

    $(document).on('change', '#responsibilityId', function() {
        var id = $("#responsibilityId").val();

        if (id) {
            $("table#responsibilityTable tr.toHide:not(.item-" + id + ")").hide();
            $("table#responsibilityTable tr.item-" + id + "").show();
        } else {
            $("table#responsibilityTable tr.toHide").hide();
            $("table#responsibilityTable tr.item-blank").show();
        }
        tabContent.responsibilityForm = "changed";
    });

    $(document).on('change', '#tabResponsibilityContent #useParentResp, #tabResponsibilityContent #furtherInfoResp', function() {
        tabContent.responsibilityForm = "changed";
    });

    $(document).on('click', '#tabResponsibilityContent #useParentResp', function() {
        if ($(this).is(':checked')) {
            $("#responsibilityForm select").attr("disabled", true);
            // enable checkbox (dirty solution, but :not-selector doesn't work
            // in IE8)
            $("#responsibilityId").css('background-color', 'rgb(235, 235, 228)');
            $(this).attr("disabled", false);
            // enable save-button
            $('#saveResponsibility').attr("disabled", false);
        } else {
            $("#responsibilityForm select").attr("disabled", false);
            $("#responsibilityId").css('background-color', 'rgb(255, 255, 255)');
        }
    });

    /**
     * Initialize the tab's ui after tabs were refreshed by tree interaction
     */
    $(document).on('docviewerTabRefresh', function(e) {
        initUseParentRespEvent();
    });

});

function initUseParentRespEvent() {

    // initial
    if ($('#useParentResp') !== null && $('#useParentResp').is(':checked')) {
        $("#responsibilityForm select").attr("disabled", true);
        // enable checkbox (dirty solution, but :not-selector doesn't work in
        // IE8)
        $('#useParentResp').attr("disabled", false);
        $("#responsibilityId").css('background-color', 'rgb(235, 235, 228)');
        // enable save-button
        $('#saveResponsibility').attr("disabled", false);
    } else {
        $("#responsibilityForm select").attr("disabled", false);
    }

    var id = $("#responsibilityId").val();

    if (id) {
        $("table#responsibilityTable tr.toHide:not(.item-" + id + ")").hide();
        $("table#responsibilityTable tr.item-" + id + "").show();
    } else {
        $("table#responsibilityTable tr.toHide").hide();
        $("table#responsibilityTable tr.item-blank").show();
    }

}
