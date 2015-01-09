function initTabCompletenessRecording() {
    initCompletenessRecordingGrid();
    $('#tabCompletenessRecordingContent .pasteContainer').pasteFileUpload();
    initCompletenessRecordingDatePicker();
    initExportButtonsForCompletenessGrid();
    initCompletenessSearchDialog();
    initDatepickerForComplRecord();
    setTitleForGridExportButtons();
}

function initCompletenessRecordingGrid() {

    $('#completeness-grid').docViewerGrid(
            {
                url : contextPath + '/app/staging/docvieweradmin/complrecord/table',
                ondblClickRow : function(rowid) {
                    var grid = $('#completeness-grid');
                    var estimateCD = grid.jqGrid('getCell', rowid, 'estimateCheckDate');

                    if (estimateCD != null && estimateCD != 'undefined' && estimateCD != '') {
                        $("#checkDate").val(grid.jqGrid('getCell', rowid, 'estimateCheckDate'));
                    }
                    // select entry in dropDown list by text and get the id
                    $('#completenessCheckTypeId option').each(function() {
                        if ($(this).text() == grid.jqGrid('getCell', rowid, 'completenessCheckTypeName')) {
                            $('#completenessCheckTypeId').val($(this).val());
                            return false;
                        }
                    });
                },

                colNames : [ 'Level', 'Check Cycle', 'Estimated Visit Date', 'Actual Visit (UTC)', 'Department', 'Status', 'Attachment', 'Comment',
                        'Active', 'Id' ],
                colModel : [ {
                    name : 'level',
                    index : 'level',
                    sortable : true,
                    width : 80
                }, {
                    name : 'completenessCheckTypeName',
                    index : 'completenessCheckTypeName',
                    sortable : false,
                    width : 80
                }, {
                    name : 'estimateCheckDate',
                    index : 'estimateCheckDate',
                    sortable : true,
                    width : 91,
                    align : 'center'
                }, {
                    name : 'actuallyCheckDate',
                    index : 'actuallyCheckDate',
                    sortable : true,
                    width : 142,
                    align : 'center'
                }, {
                    name : 'department',
                    index : 'department',
                    sortable : true,
                    width : 105
                }, {
                    name : 'status',
                    index : 'status',
                    sortable : true,
                    width : 68,
                    formatter : statusFormatter,
                    align : 'center'
                }, {
                    name : 'fileName',
                    index : 'fileName',
                    sortable : true,
                    width : 142,
                    attachId : 'completenessCheckId',
                    formatter : attachmentFormatter
                }, {
                    name : 'comments',
                    index : 'comments',
                    sortable : true,
                    width : 171
                }, {
                    name : 'isActive',
                    index : 'isActive',
                    sortable : false,
                    width : 57,
                    formatter : isActiveFormatter,
                    classes : 'activerecord',
                    align : 'center'
                }, {
                    name : 'completenessCheckId',
                    index : 'completenessCheckId',
                    sortable : false,
                    hidden : true,
                    key : true,
                    width : 1
                } ],
                pager : '#completeness-grid-pager',
                sortname : 'estimateCheckDate',
                sortorder : 'desc'
            });
}

function initCompletenessRecordingDatePicker() {
    $("#checkDate").datepicker({
        dateFormat : 'dd-M-yy',
        maxDate : 0
    });
}

function initExportButtonsForCompletenessGrid() {
    $('#completeness-grid').navGrid('#completeness-grid-pager', {
        edit : false,
        add : false,
        del : false,
        search : false
    }).navButtonAdd('#completeness-grid-pager', {
        caption : "",
        buttonicon : "ui-icon-pdf-small",
        id : "reportComplPdf",
        onClickButton : function() {
            $("#limitCompletenessReport").dialog("open");
            $('#exportTypeId').val("pdf");
        }
    }).navButtonAdd('#completeness-grid-pager', {
        caption : "",
        buttonicon : "ui-icon-excel-small",
        id : "reportComplExcel",
        onClickButton : function() {
            $("#limitCompletenessReport").dialog("open");
            $('#exportTypeId').val("excel");
        }
    });
}

function closeDatePicker() {
    $("#searchExportDateCompletenessFrom").blur();
    $("#searchExportDateCompletenessTo").blur();
    $("#searchExportDateCompletenessFrom").datepicker("enable");
    $("#searchExportDateCompletenessTo").datepicker("enable");
}

function initCompletenessSearchDialog() {

    $("#limitCompletenessReport").dialog({
        dialogClass : 'dialog-window',
        autoOpen : false,
        resizable : false,
        modal : true,
        width : 'auto',
        open : function(event, ui) {
            closeDatePicker();
            // IE9 - fix to set the position of dialog to the middle of screen
            var width = $(window).width() / 2 - $("#limitCompletenessReport").parent().width / 2;
            $("#limitCompletenessReport").parent().css('left', width + 'px');
        },
        close : function() {
            $('#limitCompletenessReport #dialogErrorMsg').hide();
            $('#limitCompletenessReport #dialogSuccessMsg').hide();
            $('#exportCompletenessForm')[0].reset();
            disableDatepicker();
        },
        buttons : [ {
            text : "Export",
            class : 'button default',
            click : function() {
                var from = $('#searchExportDateCompletenessFrom').val();
                var to = $('#searchExportDateCompletenessTo').val();

                if ($('#exportTypeId').val() !== null && $('#exportTypeId').val() !== "") {
                    $.fileDownload(contextPath + "/app/staging/docvieweradmin/complrecord/" + $('#exportTypeId').val() + "/", {
                        httpMethod : "POST",
                        data : $.extend(defaultPostParametersDocViewer(), {
                            searchExportDateCompletenessFrom : from,
                            searchExportDateCompletenessTo : to,
                            filteredFleets : function() {
                                return buildSelectedMultiselectBoxStringWithNames('fleetFilter');
                            },
                            filteredDoctypes : function() {
                                return buildSelectedMultiselectBoxStringWithNames('docTypeFilter');
                            },
                            filteredCustomers : function() {
                                return buildSelectedMultiselectBoxStringWithNames('customerFilter');
                            }
                        }),
                        prepareCallback : function(url) {
                            $('#tabCompletenessRecordingContent').block({
                                message : '<h1>Generating report.</h1>'
                            });
                        },
                        successCallback : function(url) {
                            $('#tabCompletenessRecordingContent').unblock();
                        },
                        failCallback : function(responseHtml, url) {
                            $('#tabCompletenessRecordingContent').unblock();
                            alert("Problem occurred while generating the report.");
                        }
                    });
                }
                $(this).dialog("close");
            }
        }, {
            text : 'Cancel',
            class : 'button standard',
            click : function() {
                $(this).dialog("close");
            }
        } ]

    });
}

function initDatepickerForComplRecord() {
    $("#searchExportDateCompletenessFrom").datepicker({
        dateFormat : 'dd-M-yy'
    });
    $("#searchExportDateCompletenessTo").datepicker({
        dateFormat : 'dd-M-yy'
    });
    disableDatepicker();
}

function disableDatepicker() {
    $("#searchExportDateCompletenessFrom").datepicker("disable");
    $("#searchExportDateCompletenessTo").datepicker("disable");
}

/**
 * Initialize on document ready
 */
$(function() {

    /**
     * bind add comment form submit event
     */
    $(document).on('click', '#tabCompletenessRecordingContent #saveComplRecord', function(e) {
        $('#complRecordForm').docViewerSubmitForm({
            afterSuccess : function() {

                var successMsg = $('#successMessagesComplCheck').val();
                var successElement = $('#successMsg');
                if (successMsg) {
                    successElement.html(successMsg);
                    successElement.show();
                } else {
                    successElement.hide();
                    successElement.empty();
                }
                $("#completeness-grid").trigger("reloadGrid");
                initCompletenessRecordingDatePicker();
                $('#tabCompletenessRecordingContent .pasteContainer').pasteFileUpload();
            }
        });
    });

    /**
     * bind toggle active/inactive comment event
     */
    $(document).on('click', '#tabCompletenessRecordingContent  #completeness-grid .activerecord input[type=checkbox]', function() {
        $.ajax({
            type : 'POST',
            data : {
                completenessCheckId : this.id,
                isChecked : $(this).is(':checked')
            },
            url : contextPath + '/app/staging/docvieweradmin/complrecord/table/isActive'
        });
    });
});