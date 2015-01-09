var doctypesWidth = null;

$(function() {

    $(document).on('docviewerTabRefresh', function(e) {
        initCreateIssuerDTIOverlay();
        updateDoctypeMultiselection();
    });

    $(document).on('click', '#createIssuer #overlayCreateIssuerDTI', function() {
        $("#createIssuerDocTypeIssuer").dialog("open");

    });

    $(document).on('change', '#createTypeId', function() {
        setOverlayFields();
        hideMessages();
    });

    $(document).on('change', '#allPublisherId', function() {
        updateDoctypeMultiselection();
    });
});

function updateDoctypeMultiselection() {
    $("#createIssuerOverlayForm select[name=docTypes]").multiselect('uncheckAll');

    sortDocTypesOptions();

    doctypes = $('#allPublisherId option:selected').data('doctypes');
    if (doctypes != null) {
        for (var i = 0; i < doctypes.length; i++) {
            $("#createIssuerDocTypeIssuer #docTypes").multiselect("widget").find("input:checkbox[value=" + doctypes[i] + "]").click();
        }
    }
    $('#createIssuerOverlayForm select[name=docTypes] option:selected').prependTo('#createIssuerOverlayForm select[name=docTypes] #ref');
    $('#createIssuerOverlayForm select[name=docTypes] option:not(:selected)').prependTo('#createIssuerOverlayForm select[name=docTypes] #notref');

    $("#createIssuerOverlayForm select[name=docTypes]").multiselect('refresh');

    updateMultiSelectWidth();
}

function sortDocTypesOptions() {

    var options = $('#createIssuerOverlayForm select[name=docTypes] option');
    var arr = options.map(function(_, o) {
        return {
            t : $(o).text(),
            v : o.value
        };
    }).get();

    arr.sort(function(o1, o2) {
        return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0;
    });

    options.each(function(i, o) {
        o.value = arr[i].v;
        $(o).text(arr[i].t);
    });
}

function setOverlayFields() {
    var createTypeId = $("#createTypeId").val();
    if (createTypeId == '1') {

        $("#publisherCreateDiv").show();
        $("#webpageCreateDiv").show();
        $("#responsibleCreateDiv").show();
        $("#contactCreateDiv").show();
        $("#shortNameCreateDiv").show();
        $("#furtherInfoCreateDiv").show();

        $("#hideOrShowDocTypes").hide();
        $("#allPublisherIdDiv").hide();

        enOrDisableElementsCreateDTI(false);

    } else if (createTypeId == '2') {

        $("#publisherCreateDiv").hide();
        $("#webpageCreateDiv").hide();
        $("#responsibleCreateDiv").hide();
        $("#contactCreateDiv").hide();
        $("#shortNameCreateDiv").hide();
        $("#furtherInfoCreateDiv").hide();

        $("#hideOrShowDocTypes").show();
        $("#allPublisherIdDiv").show();

        enOrDisableElementsCreateDTI(true);

    }
    updateMultiSelectWidth();
}

function enOrDisableElementsCreateDTI(enabled) {
    $("#publisherCreateDiv").prop('disabled', enabled);
    $("#webpageCreateDiv").prop('disabled', enabled);
    $("#responsibleCreateDiv").prop('disabled', enabled);
    $("#contactCreateDiv").prop('disabled', enabled);
    $("#shortNameCreateDiv").prop('disabled', enabled);
    $("#furtherInfoCreateDiv").prop('disabled', enabled);

    $("#allPublisherId").prop('disabled', !enabled);
    $("#hideOrShowDocTypes").prop('disabled', !enabled);
}

function hideMessages() {
    $('#dtimanagementErrorMsg').hide();
    $('#dtimanagementSuccessMsg').hide();
    $('#createIssuerOverlayForm').find("[class*='input-error']").removeClass('input-error');
}

function doCloseActions() {
    var activeNode = $("#docTree").dynatree("getActiveNode");
    if (activeNode.data.isIssuer) {
        reloadTree('ISSUER', activeNode.data.key);
    } else if (activeNode.data.isDocType) {
        reloadTree('DOCTYPE', activeNode.data.key);
    } else {
        reloadTree('CUSTOMER', activeNode.data.key);
    }

    $('#createIssuerDocTypeIssuer #allPublisherIdDiv select option:first-child').attr("selected", "selected");
    $('#createIssuerOverlayForm select[name=docTypes]').multiselect("uncheckAll");
    $('#createTypeId').val(1);
    $('#publisherCreate').val('');
    $('#webpageCreate').val('');
    $('#responsibleCreate').val('');
    $('#contactCreate').val('');
    $('#shortNameCreate').val('');
    $('#furtherInfoCreate').val('');
    hideMessages();
}
function updateMultiSelectWidth() {
    if (doctypesWidth === null && $('#createTypeId:visible').length > 0) {
        doctypesWidth = $('#createTypeId').width();
    }
    $("#createIssuerOverlayForm select[name=docTypes]").multiselect('getButton').width(doctypesWidth);

}

function initCreateIssuerDialog() {
    $("#createIssuerDocTypeIssuer").dialog({
        autoOpen : false,
        resizable : false,
        modal : true,
        width : 'auto',
        dialogClass : 'dialog-window',
        open : function() {
            updateMultiSelectWidth();
        },
        close : function() {
            doCloseActions();
        },
        buttons : [ {
            text : "Close",
            class : 'button standard',
            click : function() {
                $(this).dialog("close");
            }
        }, {
            text : 'Save',
            class : 'button default',
            click : function() {
                var activeNode = $("#docTree").dynatree("getActiveNode");
                if (activeNode.data.isIssuer) {
                    $("#currentIssuerId").val(activeNode.data.nodeId);
                    $("#currentNodeType").val('ISSUER');
                } else if (activeNode.data.isDocType) {
                    $("#currentIssuerId").val(activeNode.parent.data.nodeId);
                    $("#currentDocTypeId").val(activeNode.data.nodeId);
                    $("#currentNodeType").val('DOCTYPE');
                } else {
                    $("#currentIssuerId").val(activeNode.parent.parent.data.nodeId);
                    $("#currentDocTypeId").val(activeNode.parent.data.nodeId);
                    $("#currentCustomerId").val(activeNode.data.nodeId);
                    $("#currentNodeType").val('CUSTOMER');
                }

                $('#createIssuerOverlayForm').docViewerSubmitForm({
                    errorWrapper : '#dtimanagementErrorMsg',
                    successWrapper : '#dtimanagementSuccessMsg',
                    successMessage : 'Doctype un/linking was successfull!',
                    displayDefaultSuccessMessage : true,
                    afterSuccess : function() {
                        initCreateIssuerDTIOverlay();
                        updateDoctypeMultiselection();
                    }
                });
            }
        } ]
    });
    $("#createIssuerDocTypeIssuer").show();

}

function initCreateIssuerDTIOverlay() {
    initCreateIssuerDialog();
    initDocTypeMultiSelect();
    setOverlayFields();
}

/**
 * Initialize the multiselection option for customer fleet selection
 */
function initDocTypeMultiSelect() {
    if ($("#createIssuerOverlayForm select[name=docTypes] option").length == 1) {
        $("#createIssuerOverlayForm select[name=docTypes] option").first().attr('selected', 'selected');
    }

    $("#createIssuerOverlayForm select[name=docTypes]").multiselect({
        noneSelectedText : 'Select DocTypes',
        minWidth : 'auto',
        height : 'auto',
        header : false,
        selectedList : 10,
        position : {
            my : 'left top',
            at : 'left bottom'
        },
        open : function() {
            $(this).multiselect('widget').width($(this).multiselect('getButton').width());
            if ($("#createIssuerOverlayForm select[name=docTypes] option").length == 1) {
                $("#createIssuerOverlayForm select[name=docTypes]").multiselect("close");
            }
        }
    });

}