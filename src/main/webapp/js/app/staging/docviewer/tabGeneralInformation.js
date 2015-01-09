$(function() {

    /**
     * bind add comment form submit event
     */
    $(document).on('click', '#tabGeneralContent #saveGenInfo', function(e) {
        $("#genInformationForm :input").attr("disabled", false);
        $('#genInformationForm').docViewerSubmitForm({
            afterSuccess : function() {
                initUseParentEvent();
                initSAPShortNamesSelection();
                tabContent.genInformationForm = '';

                // TODO: maybe generalize?
                var successMsg = $('#successMessagesGenInfo').val();
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

    $(document).on('click', '#tabGeneralContent #openUrlAsLink', function(e) {
        var url = $('#genInfoUrl').val();
        if (url.indexOf("http") == -1 && url.indexOf("HTTP") == -1) {
            url = "http://" + url;
        }
        window.open(url, "_blank");
    });

    $(document).on('click', '#tabGeneralContent #editSAPShortNames', function(e) {
        if ($("#tabGeneralContent #editSAPShortNames").hasClass('enable-edit')) {
            $("#saphortname-editing-dialog-confirm").dialog('open');
        }

    });

    $(document).on('click', '#tabGeneralContent #useParent', function() {
        if ($(this).is(':checked')) {
            $("#genInformationForm :input").attr("disabled", true);
            // enable checkbox (dirty solution, but :not-selector doesn't work
            // in IE8)
            $(this).attr("disabled", false);
            // enable save-button
            $('#saveGenInfo').attr("disabled", false);
        } else {
            $("#genInformationForm :input").attr("disabled", false);
        }
    });

    /**
     * Initialize the tab's ui after tabs were refreshed by tree interaction
     */
    $(document).on('docviewerTabRefresh', function(e) {
        initUseParentEvent();
        initSAPShortNamesSelection();
        initSAPShortnameEditingConfirmation();
    });

    // maybe .keydown() is better choise - but keydown doesn't work for
    // checkboxes
    $(document).on('change', '#genInformationForm :input', function() {
        tabContent.genInformationForm = "changed";
    });

});

function initSAPShortnameEditingConfirmation() {
    $("#saphortname-editing-dialog-confirm").dialog({
        autoOpen : false,
        resizable : false,
        modal : true,
        width : 300,
        buttons : [ {
            text : "Proceed",
            class : 'button standard',
            click : function(e) {
                $("#sapShortNames").select2("readonly", !$("#tabGeneralContent #editSAPShortNames").hasClass('enable-edit'));
                $("#tabGeneralContent #editSAPShortNames").toggleClass('enable-edit');
                $(this).dialog("close");
            }
        }, {
            text : "Cancel",
            class : 'button default',
            click : function() {
                $(this).dialog("close");
            }
        } ]
    });

}

function initSAPShortNamesSelection() {
    $("#sapShortNames").select2({
        multiple : true,
        minimumInputLength : 2,
        placeholder : "Enter/Select SAP short names for this issuer",
        tokenSeparators : [ ',' ],
        tags : [],
        dropdownCssClass : 'sapShortNamesDropDown',
        initSelection : function(element, callback) {
            var data = [];
            $(element.val().split(',')).each(function() {
                data.push({
                    id : this,
                    text : this
                });
            });
            callback(data);
        },
        ajax : {
            multiple : true,
            url : contextPath + '/app/staging/docvieweradmin/geninfo/unusednames',
            dataType : "json",
            type : "POST",
            data : function(term, page) {
                return {
                    query : term
                };
            },
            results : function(data, page) {
                return {
                    results : data
                };
            }
        },

    });
    $("#sapShortNames").select2("readonly", true);
}

function initUseParentEvent() {

    // initial
    if ($('#useParent') !== null && $('#useParent').is(':checked')) {
        $("#genInformationForm :input").attr("disabled", true);
        // enable checkbox (dirty solution, but :not-selector doesn't work in
        // IE8)
        $('#useParent').attr("disabled", false);
        // enable save-button
        $('#saveGenInfo').attr("disabled", false);
    } else {
        $("#genInformationForm :input").attr("disabled", false);
    }

}