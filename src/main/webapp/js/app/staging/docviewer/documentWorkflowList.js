$(function() {

    /**
     * handle open add dialog button
     */
    $(document).on('click', '#openAddDialog', function(e) {
        e.preventDefault();
        $("#addDocumentDialog").dialog('open');
    });

    /**
     * submit new document data
     */
    $(document).on('click', '#addDocument', function(e) {
        e.preventDefault();
        $('#tpDocumentAddForm').dialogFormSubmit({
            errorWrapper : '#dialogErrors',
            successWrapper : '#dialogSuccess',
            message : 'Loading ...',
            afterSuccess : function() {
                initDatePicker();
                disableFileUploads();
            }
        });
    });

    $(document).on('click', '.removeaircraft', function(e) {
        e.preventDefault();
        var acNo = $(this).data('acno');
        var currentAcNos = $('#effectiveAircraft').val();

        $('#effectiveAircraft').val(removeValueFromString(currentAcNos, acNo));
        loadGrid($('#aircraft-grid'), {
            effectiveAircraft : $('#effectiveAircraft').val(),
        });

    });

    /**
     * accepting document to pass quality gate
     */
    $(document).on('click', '#acceptDocument', function(e) {
        e.preventDefault();
        $('#tpDocumentQSForm').attr('action', $('#tpDocumentQSForm').data('accepturl'));
        $('#tpDocumentQSForm').dialogFormSubmit({
            errorWrapper : '#dialogErrors',
            successWrapper : '#dialogSuccess',
            message : 'passing quality gate ...'
        });
    });

    /**
     * rejecting document in quality gate
     */
    $(document).on('click', '#rejectDocument', function(e) {
        e.preventDefault();
        $('#tpDocumentQSForm').attr('action', $('#tpDocumentQSForm').data('rejecturl'));
        $('#tpDocumentQSForm').dialogFormSubmit({
            errorWrapper : '#dialogErrors',
            successWrapper : '#dialogSuccess',
            message : 'rejecting document... '
        });
    });

    /**
     * submit updated document data
     */
    $(document).on('click', '#editDocument', function(e) {
        e.preventDefault();
        $('#tpDocumentEditForm').dialogFormSubmit({
            errorWrapper : '#dialogErrors',
            successWrapper : '#dialogSuccess',
            message : 'saving changes... ',
            afterSuccess : function() {
                initDatePicker();
                disableFileUploads();
            }
        });
    });

    $(document).on('click', '#manageEffectivity', function(e) {
        e.preventDefault();
        $("#effectivityDialog").dialog('open');
    });

    /**
     * show history dialog for selected document
     */
    $(document).on('click', '.button.workflow.history', function(e) {
        e.preventDefault();
        $("#documentHistoryDialog").dialog('open');

        loadGrid($('#history-grid'), {
            sapDocKey : $(this).data('sapdockey')
        });
    });

    /**
     * show history dialog for selected document
     */
    $(document).on('click', '.button.workflow.attachment', function(e) {
        e.preventDefault();
        window.location.href = $(this).data('href');
    });

    $(document).on('click', '#addAircraft', function(e) {
        e.preventDefault();
        $('#effectiveAircraft').val(function(i, val) {
            return val + (val ? ',' : '') + $('#tabAircraft input[name=addAcNO]').val();
        });
        loadGrid($('#aircraft-grid'), {
            effectiveAircraft : $('#effectiveAircraft').val(),
        });

    });

    $(document).on('click', '#addPart', function(e) {
        e.preventDefault();
        $('#effectivePart').val(function(i, val) {
            return val + (val ? ',' : '') + $('#tabPart input').val();
        });

        loadGrid('#part-grid', {
            effectivePart : $('#effectivePart').val(),
        });
    });

    $(document).on('click', '#addEngine', function(e) {
        e.preventDefault();
        $('#effectiveEngine').val(function(i, val) {
            return val + (val ? ',' : '') + $('#tabEngine input').val();
        });
        loadGrid('#engine-grid', {
            effectiveEngine : $('#effectiveEngine').val(),
        });
    });

    $(document).on('click', '#closeAddDialog', function(e) {
        e.preventDefault();
        if ($("#addDocumentDialog").dialog('widget').length > 0) {
            // assume dialog was loaded in jquery dialog
            $("#addDocumentDialog").dialog('close');
        } else if (window.opener) {
            // assume dialog was loaded in seperate browser window
            self.close();
        }

    });

    $(document).on('click', '#closeMatchDialog', function(e) {
        e.preventDefault();
        $("#matchDialog").dialog('close');
        loadGrid($('#workflowitems-grid'), null);
    });

    $(document).on('click', '#closeEditDialog', function(e) {
        e.preventDefault();
        $("#editDocumentDialog").dialog('close');
        loadGrid($('#workflowitems-grid'), null);
    });

    $(document).on('click', '#closeQsDialog', function(e) {
        e.preventDefault();
        $("#documentQSDialog").dialog('close');
        loadGrid($('#workflowitems-grid'), null);
    });

    $(document).on('click', '#useSapData', function(e) {
        e.preventDefault();
        $('#tpDocumentMatchForm').attr('action', $('#tpDocumentMatchForm').data('matchmpst'));
        $('#tpDocumentMatchForm').dialogFormSubmit({
            errorWrapper : '#dialogErrors',
            successWrapper : '#dialogSuccess',
            message : 'saving changes... '
        });
    });

    $(document).on('click', '#keepDocData', function(e) {
        e.preventDefault();
        $('#tpDocumentMatchForm').attr('action', $('#tpDocumentMatchForm').data('matchoverlay'));
        $('#tpDocumentMatchForm').dialogFormSubmit({
            errorWrapper : '#dialogErrors',
            successWrapper : '#dialogSuccess',
            message : 'saving changes... '
        });
    });

    $(document).on('click', '#closeEffectivityDialog', function(e) {
        e.preventDefault();
        $("#effectivityDialog").dialog('close');
    });

    /**
     * handle workflow action button edit document
     */
    $(document).on('click', '.button.workflow.edit', function(e) {
        e.preventDefault();
        $("#editDocumentDialog").dialog('option', 'documentid', $(this).data('documentid'));
        $("#editDocumentDialog").dialog('open');
    });

    /**
     * handle workflow action button edit document
     */
    $(document).on('click', '.button.workflow.remove', function(e) {
        e.preventDefault();
        if (confirm('This document will be not be processed any further. Are you sure?')) {
            $.post(contextPath + '/app/staging/docvieweradmin/document/workflow/delete', {
                documentId : $(this).data('documentid')
            }).done(function(data) {
                if (data.errors.length > 0) {
                    alert(data.errors.join());
                } else {
                    loadGrid($('#workflowitems-grid'), null);
                }
            });
        }
    });

    /**
     * handle workflow action button quality gate document
     */
    $(document).on('click', '.button.workflow.qs', function(e) {
        e.preventDefault();
        $("#documentQSDialog").dialog('option', 'documentid', $(this).data('documentid'));
        $("#documentQSDialog").dialog('open');
    });

    /**
     * handle workflow action button quality gate document
     */
    $(document).on('click', '.button.workflow.match', function(e) {
        e.preventDefault();
        $("#matchDialog").dialog('option', 'sapdockey', $(this).data('sapdockey'));
        $("#matchDialog").dialog('open');
    });

    $(document).on('click', '.button.workflow.match', function(e) {
        e.preventDefault();
        $("#openMatchDialog").dialog('open');
    });

    $(document).on('click', '.fileuploadstoredinsession a', function(e) {
        e.preventDefault();
        if (confirm('Do you really want to replace the attachment?')) {
            $(this).parent().hide();
            fileupload = $(this).parent().next('.restorefileupload');
            fileupload.show();
            fileupload.find('input[type=file]').removeAttr('disabled');
        }
    });

    initWorkflowItemsGrid();
    initDatePicker();
    initAddDialog();
    initEditDialog();
    initHistoryDialog();
    initQSDialog();
    initEffectiveDialog();
    initMatchDialog();
});

function disableFileUploads() {
    $('.restorefileupload').hide();
    $('.restorefileupload input[type=file]').attr('disabled', 'disabled');
}

function initMatchDialog() {
    $("#matchDialog").dialog({
        autoOpen : false,
        modal : true,
        resizable : false,
        width : 650,
        open : function(event, ui) {
            $("#matchDialog").empty();
            $("#matchDialog").block({
                message : '<h1>loading ...</h1>'
            });
            $("#matchDialog").load(contextPath + '/app/staging/docvieweradmin/document/workflow/show/unmatched', {
                sapDocKey : $(this).dialog('option', 'sapdockey')
            }, function() {
                initDatePicker();
                prepareUnmatched();
                $("#matchDialog").unblock();
            });
        },
        close : function(event, ui) {
            loadGrid($('#workflowitems-grid'), null);
        }
    });
}

function prepareUnmatched() {
    $('#matchDialog tr.unmatched td > input').addClass('input-error');
    $('#matchDialog tr.unmatched td > textarea').addClass('input-error');
    $('#matchDialog tr.unmatched td > select').addClass('input-error');
}

function initAddDialog() {
    $("#addDocumentDialog").dialog({
        autoOpen : false,
        modal : true,
        resizable : false,
        width : 650,
        open : function(event, ui) {
            $("#addDocumentDialog").empty();
            $("#addDocumentDialog").block({
                message : '<h1>loading ...</h1>'
            });
            $("#addDocumentDialog").load(contextPath + '/app/staging/docvieweradmin/document/workflow/show/add', function() {
                initDatePicker();
                disableFileUploads();
                $("#addDocumentDialog").unblock();
            });
        },
        close : function(event, ui) {
            loadGrid($('#workflowitems-grid'), null);
        }
    });
}

function initEffectiveDialog() {
    $('#effectivityDialog').dialog({
        autoOpen : false,
        modal : true,
        resizable : false,
        width : 650,
        open : function(event, ui) {
            $(this).empty();
            $(this).block({
                message : '<h1>loading ...</h1>'
            });
            $(this).load(contextPath + '/app/staging/docvieweradmin/document/effectivities', function() {
                $('#effectiveTabs').tabnav();
                initEffectiveAircraftGrid();

                $('input[name=addEffectiveAircraft]').autocomplete({
                    source : contextPath + '/app/staging/docvieweradmin/document/effectivities/autocomplete/aircraft',
                    minLength : 2,
                    select : function(eventAutocomplete, uiAutocomplete) {
                        $("#tabAircraft input[name=addAcNO]").val(uiAutocomplete.item.value);
                        $(this).val(uiAutocomplete.item.label);
                        return false;
                    }
                }).autocomplete('widget').removeClass('ui-corner-all');

                $(this).unblock();
            });
        },
        close : function(event, ui) {
            updateEffectedAircraftsVisual();
        }
    });
}

function updateEffectedAircraftsVisual() {
    var val = $("input[name=effectiveAircraft]").val();
    var count = 0;
    if (val.length > 0) {
        count = val.split(',').length;
    }

    $('#effectiveAircraftCount').html(count);
}

function initQSDialog() {
    $("#documentQSDialog").dialog({
        autoOpen : false,
        modal : true,
        resizable : false,
        width : 650,
        open : function(event, ui) {
            $("#documentQSDialog").empty();
            $("#documentQSDialog").block({
                message : '<h1>loading ...</h1>'
            });
            $("#documentQSDialog").load(contextPath + '/app/staging/docvieweradmin/document/workflow/startQS', {
                documentId : $(this).dialog('option', 'documentid')
            }, function() {
                initDatePicker();
                $("#documentQSDialog").unblock();
            });
        },
        close : function(event, ui) {
            loadGrid($('#workflowitems-grid'), null);
        }
    });

}

function initEditDialog() {
    $("#editDocumentDialog").dialog({
        autoOpen : false,
        modal : true,
        resizable : false,
        width : 650,
        open : function(event, ui) {
            $("#editDocumentDialog").empty();
            $("#editDocumentDialog").block({
                message : '<h1>loading ...</h1>'
            });
            $("#editDocumentDialog").load(contextPath + '/app/staging/docvieweradmin/document/workflow/load', {
                documentId : $(this).dialog('option', 'documentid')
            }, function() {
                initDatePicker();
                disableFileUploads();
                $("#editDocumentDialog").unblock();
            });
        },
        close : function(event, ui) {
            loadGrid($('#workflowitems-grid'), null);
        }
    });
}

function initHistoryDialog() {
    initHistoryGrid();
    $("#documentHistoryDialog").dialog({
        autoOpen : false,
        modal : true,
        resizable : false,
        width : 'auto'
    });
}

function initDatePicker() {
    $('.document-workflow.datepicker').datepicker({
        dateFormat : 'dd-M-yy',
        monthNamesShort : [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ]
    });
}

function actionFormatter(cellvalue, options, rowObject) {
    var ui = '<button class="button standard ' + rowObject.stateCss + '" data-sapdockey="' + rowObject.sapDocKey + '" data-documentid="' +
            rowObject.id + '" title="' + rowObject.buttonText + '"><img class="' + rowObject.stateCss + '"/></button>';

    ui += '<button title="open document history" class="button standard workflow history" data-sapdockey=' + rowObject.sapDocKey +
            '><img class="workflow history" /></button>';

    ui += '<button data-href="' + contextPath + '/app/staging/docvieweradmin/document/workflow/document/attachment/' + cellvalue +
            '" class="button standard workflow attachment" title="download attachment"><img class="workflow attachment"/></button>';

    if (rowObject.removable === true) {
        ui += '<button class="button standard workflow remove" data-sapdockey="' + rowObject.sapDocKey + '" data-documentid="' + rowObject.id +
                '"><img class="workflow remove"/></button>';
    }

    return ui;
}

function removeAircraft(cellvalue, options, rowObject) {
    return '<button class="button standard removeaircraft" data-acno="' + rowObject.id + '">Remove</button>';
}

function removePart(cellvalue, options, rowObject) {
    return '<button class="button standard removepart" data-part="' + rowObject.id + '">Remove</button>';
}
function removeEngine(cellvalue, options, rowObject) {
    return '<button class="button standard removeengine" data-engine="' + rowObject.id + '">Remove</button>';
}

function removeValueFromString(list, value) {
    var separator = ",";
    var values = list.split(separator);
    for (var i = 0; i < values.length; i++) {
        if (values[i] == value) {
            values.splice(i, 1);
            return values.join(separator);
        }
    }
    return list;
}

function initEffectiveAircraftGrid() {
    $('#aircraft-grid').docViewerGrid({
        url : contextPath + '/app/staging/docvieweradmin/document/effectivities/aircrafts',
        pager : '#aircraft-grid-pager',
        sortname : 'id',
        sortorder : 'desc',
        shrinkToFit : true,
        autowidth : true,
        postData : {
            effectiveAircraft : $('input[name=effectiveAircraft]').val(),
        },
        colNames : [ 'MSN', 'AC-Reg', 'Operator', 'AC-Type', 'AC-Series', 'AC-Model', 'Engine-Version', '' ],
        colModel : [ {
            name : 'msn',
            index : 'msn',
            sortable : true,
            width : 12
        }, {
            name : 'acReg',
            index : 'acReg',
            sortable : true,
            width : 12
        }, {
            name : 'customer',
            index : 'customer',
            sortable : true,
            width : 12
        }, {
            name : 'acType',
            index : 'acType',
            sortable : true,
            width : 12
        }, {
            name : 'acSeries',
            index : 'acSeries',
            sortable : false,
            width : 12
        }, {
            name : 'acModel',
            index : 'acModel',
            sortable : false,
            width : 12
        }, {
            name : 'engineVersion',
            index : 'engineVersion',
            sortable : false,
            width : 12
        }, {
            name : 'id',
            index : 'id',
            key : true,
            formatter : removeAircraft,
            width : 16
        } ]
    });
}
function initWorkflowItemsGrid() {

    $('#workflowitems-grid').docViewerGrid({
        url : contextPath + '/app/staging/docvieweradmin/document/workflow/items',
        pager : '#workflowitems-grid-pager',
        sortname : 'created',
        sortorder : 'desc',
        shrinkToFit : true,
        autowidth : true,
        postData : {},
        colNames : [ 'Order System', 'Creator', 'Reason', 'Date of Registration', 'Document', 'Responsible', 'TAN', 'Action' ],
        colModel : [ {
            name : 'initiator',
            index : 'initiator',
            sortable : true,
            width : 7
        }, {
            name : 'createdByName',
            index : 'createdByName',
            sortable : true,
            width : 10
        }, {
            name : 'reason',
            index : 'reason',
            sortable : true,
            width : 10
        }, {
            name : 'created',
            index : 'created',
            sortable : true,
            align : 'center',
            width : 9
        }, {
            name : 'document',
            index : 'document',
            sortable : false,
            width : 19
        }, {
            name : 'responsible',
            index : 'responsible',
            sortable : true,
            width : 6
        }, {
            name : 'sapDocKey',
            index : 'sapDocKey',
            sortable : true,
            width : 10
        }, {
            name : 'id',
            index : 'id',
            sortable : false,
            align : 'center',
            key : true,
            formatter : actionFormatter,
            width : 20
        } ]
    });

}

function loadGrid(gridElement, postData) {
    if (postData !== null) {
        gridElement.setGridParam({
            datatype : 'json',
            postData : postData
        });
    }
    gridElement.trigger("reloadGrid");
}

function initHistoryGrid() {

    $('#history-grid').docViewerGrid({
        url : contextPath + '/app/staging/docvieweradmin/document/workflow/history',
        pager : '#history-grid-pager',
        datatype : 'local',
        sortname : 'id',
        sortorder : 'desc',
        width : 722,
        shrinkToFit : true,
        postData : null,
        colNames : [ 'Timestamp', 'Responsible', 'Reason', '' ],
        colModel : [ {
            name : 'created',
            index : 'created',
            align : 'center',
            sortable : true,
            width : 18
        }, {
            name : 'createdByName',
            index : 'createdByName',
            sortable : true,
            width : 25
        }, {
            name : 'message',
            index : 'message',
            sortable : true,
            width : 57
        }, {
            name : 'id',
            index : 'id',
            sortable : false,
            key : true,
            hidden : true,
            width : 1
        } ]
    });

}