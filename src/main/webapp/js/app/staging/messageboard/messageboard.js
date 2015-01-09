$.extend(jQuery.jgrid.defaults, {
    prmNames : {
        page : "pageIdx",
        rows : "pageSize",
        sort : "sortCol",
        order : "sortDirection"
    }
});

function statusFormatter(cellvalue, options, rowObject) {
    return '<div class="status-column-icon status-column-icon-' + cellvalue + '" style="display:block !important; float: left;"></div>';
};

function attachmentsLinkFormatter(cellvalue, options, rowObject) {
    if (cellvalue) {
        return '<a href="#" message-board-id="' + rowObject.id +
                '" title="open Attachment" class="msg-board-attachment"><img style="display: block; text-align: center;" src="' + contextPath +
                '/resources/img/lhticonset/attachment_16.png"/></a>';
    }
    return '';
};

function filterAttributesChanged() {

    $("#messageboard-grid").setGridParam({
        postData : {
            fleet : createRequestString($('#fleet-filter').select2("data")),
            division : createRequestString($('#division-filter').select2("data")),
            acReg : createRequestString($('#ac-reg-filter').select2("data")),
            status : createRequestString($('#status-reason-filter').select2("data"))
        }
    }).trigger("reloadGrid", [ {
        page : 1
    } ]);

};

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
};

/**
 * Init Message-Board Grid GUI
 */
function initMessageBoardDataGrid() {

    var grid = $('#messageboard-grid');

    grid.jqGrid({
        autowidth : true,
        shrinkToFit : true,
        url : contextPath + '/app/staging/messageboard/',
        datatype : 'json',
        mtype : 'POST',
        jsonReader : {
            page : "pageIdx",
            total : "totalPages",
            records : "totalRecords",
            root : "data",
            repeatitems : false,
            id : "0"
        },
        postData : {
            fleet : createRequestString($('#fleet-filter').select2("data")),
            division : createRequestString($('#division-filter').select2("data")),
            acReg : createRequestString($('#ac-reg-filter').select2("data")),
            status : createRequestString($('#status-reason-filter').select2("data"))
        },
        colNames : [ 'Status', 'CheckName and WorkStatus', 'Comment and Author', 'Custom Col1', 'Custom Col2', 'Custom Col3', 'Custom Col4',
                'Due Date', 'Attachments', 'GroundTimeLink', 'Id', 'workNo', 'stepNo', 'acReg' ],
        colModel : [ {
            name : 'status',
            index : 'status',
            sortable : false,
            formatter : statusFormatter,
            width : 30
        }, {
            name : 'checkNameAndWorkStatus',
            index : 'checkNameAndWorkStatus',
            sortable : true,
            cellattr : function(rowId, val, rawObject, cm, rdata) {
                var toolTip = replaceAll(rawObject.checkNameAndWorkStatus, "<br>", "; ");
                return ' title="' + toolTip + '"';
            },
            width : 180
        }, {
            name : 'commentAndAuthor',
            index : 'commentAndAuthor',
            sortable : true,
            width : 200
        }, {
            name : 'customCol1',
            index : 'customCol1',
            sortable : true,
            cellattr : function(rowId, val, rawObject, cm, rdata) {
                var toolTip = replaceAll(rawObject.customCol1, "<br>", "; ");
                return ' title="' + toolTip + '"';
            },
            classes : "grid-col",
            width : 150,
            formatter : acRegLinkFormatter
        }, {
            name : 'customCol2',
            index : 'customCol2',
            sortable : true,
            cellattr : function(rowId, val, rawObject, cm, rdata) {
                var toolTip = replaceAll(rawObject.customCol2, "<br>", "; ");
                toolTip = toolTip.replace("MO:", "Maintenance Order:");
                toolTip = toolTip.replace("Dep.:", "Departure:");
                toolTip = toolTip.replace("Desc.:", "Description:");
                toolTip = toolTip.replace("Rect. Date:", "Rectification Date:");
                return ' title="' + toolTip + '"';
            },
            classes : "grid-col",
            formatter : customCol2LinkFormatter,
            width : 180
        }, {
            name : 'customCol3',
            index : 'customCol3',
            sortable : false,
            cellattr : function(rowId, val, rawObject, cm, rdata) {
                var toolTip = replaceAll(rawObject.customCol3, "<br>", "; ");
                toolTip = toolTip.replace("MO:", "Maintenance Order:");
                toolTip = toolTip.replace("Desc.:", "Description:");
                toolTip = toolTip.replace("Deadl.:", "Deadline:");
                toolTip = toolTip.replace("Dep.:", "Departure:");
                return ' title="' + toolTip + '"';
            },
            classes : "grid-col",
            formatter : customCol2LinkFormatter,
            width : 200
        }, {
            name : 'customCol4',
            index : 'customCol4',
            cellattr : function(rowId, val, rawObject, cm, rdata) {
                var toolTip = replaceAll(rawObject.customCol4, "<br>", "; ");
                toolTip = toolTip.replace("Deadl.:", "Deadline:");
                return ' title="' + toolTip + '"';
            },
            classes : "grid-col",
            width : 150
        }, {
            name : 'resetDate',
            index : 'resetDate',
            classes : "grid-col",
            width : 170
        }, {
            name : 'hasAttachments',
            index : 'hasAttachments',
            width : 25,
            align : 'center',
            formatter : attachmentsLinkFormatter
        }, {
            name : 'customCol2',
            index : 'customCol2',
            width : 25,
            align : 'center',
            formatter : detailViewLinkFormatter
        }, {
            name : 'id',
            index : 'id',
            sortable : false,
            hidden : true,
            key : true,
            width : 1
        }, {
            name : 'workNo',
            index : 'workNo',
            sortable : false,
            hidden : true,
            width : 1
        }, {
            name : 'stepNo',
            index : 'stepNo',
            sortable : false,
            hidden : true,
            width : 1
        }, {
            name : 'acReg',
            index : 'acReg',
            sortable : false,
            hidden : true,
            width : 1
        } ],
        rowNum : 20,
        rowList : [ 20, 50, 100 ],
        pager : '#messageboard-grid-pager',
        viewrecords : true,
        height : 'auto',
        gridview : true,
        altRows : true,
        altclass : 'gridAltRowClass',
        multiselect : (typeof hasRoleMessageboardWrite !== 'undefined'),
        subGrid : false,
        caption : false,
        onSelectRow : function(id, status) {
            var statusBlock = $(".status-msg:visible");
            if (statusBlock.length > 0) {
                statusBlock.fadeOut('slow');
            }
        },
        onPaging : function(pgButton) {
            var requestedPage = 1;
            if (pgButton == "user") {
                requestedPage = parseInt($("#messageboard-grid-pager .ui-pg-input").val());
            } else {
                requestedPage = parseInt(grid.getGridParam("page"));
            }

            var lastPage = parseInt(grid.getGridParam("lastpage"));

            if (requestedPage > lastPage) {
                grid.setGridParam({
                    page : lastPage
                }).trigger("reloadGrid");
            }
        },
        beforeRequest : function() {
            $("#confirm-filter-button").prop('disabled', true).addClass("button-disabled");

        },
        gridComplete : function() {
            $("a.msg-board-attachment").click(function() {
                openAttachmentDialogBox($(this).attr('message-board-id'));
                return false;
            });
            $("#confirm-filter-button").prop('disabled', false).removeClass("button-disabled");
        }
    });

};

function deleteMessagesDialog() {

    var rowData = $("#messageboard-grid").jqGrid('getGridParam', 'selarrrow');

    var text = 'text';
    var header = 'header';

    if (rowData.length > 0) {
        var $dialog = $('<div style="padding-top: 10px; padding-left:10px; font-size:12px;"></div>').html(
                "Do you really want to delete selected items?").dialog({
            title : header,
            autoOpen : false,
            resizable : false,
            height : 115,
            width : 350,
            modal : true,
            closeOnEscape : true,
            buttons : {
                "Yes" : function() {
                    $.ajax({
                        type : 'POST',
                        data : {
                            'messageIds' : createRequestString(rowData)
                        },
                        url : contextPath + '/app/staging/messageboard/delete-messages',
                        success : function(result) {
                            if (result.success.length > 0) {
                                $("#messageboard-grid").trigger("reloadGrid");
                                $("#successMsg").text(result.success).show();
                                $dialog.dialog("close");
                            }

                            if (result.errors.length > 0) {
                                $("#errorMsg").text(result.errors).show();
                            }
                        },
                        error : function(result) {
                            $("#errorMsg").text(result.errors).show();
                        }
                    });

                },
                "No" : function() {
                    $(this).dialog("close");
                }
            },
            close : function(event, ui) {
                $(this).dialog('destroy').remove();
                $("#messageboard-grid").trigger("reloadGrid");
            }
        });
        $dialog.dialog('open');
    } else {
        $(".status-msg").hide();
        $("#warningMsg").text("Please select at least one entry.").fadeIn('fast');
    }

}

function openAttachmentDialogBox(messageId) {

    var text = 'text';
    var header = 'Download attachment(s)';

    if (messageId != null) {

        $('<div id="attachment-dialog-box" style="display:none;padding-top: 10px; padding-left:10px; font-size:12px; height:auto;"></div>').dialog({
            title : header,
            autoOpen : true,
            resizable : false,
            width : 550,
            modal : true,
            closeOnEscape : true,
            open : function() {
                $(this).load(contextPath + '/app/staging/messageboard/attachment/' + messageId + '/show');
            },
            close : function(event, ui) {
                $(this).dialog('destroy').remove();
            }
        });

    } else {
        $("#warningMsg").text("Please select at least one entry.").fadeIn('fast');
    }

}

function editMessagesDialog() {

    var rowData = $("#messageboard-grid").jqGrid('getGridParam', 'selarrrow');

    var text = 'text';
    var header = 'Edit Message(s)';

    if (rowData.length > 0) {

        $(
                '<div id="dialog-box"><div id="dialog-form"><div id="lodingImgEditMessage"><img src="../resources/img/lhtcontrols/loading.gif" /> Loading..</div></div></div>')
                .dialog({
                    title : header,
                    autoOpen : true,
                    resizable : false,
                    height : 630,
                    width : 550,
                    modal : true,
                    closeOnEscape : true,
                    buttons : {
                        'Save' : function() {
                            submitEditFormData();
                            return false;
                        },
                        'Cancel' : function() {
                            $(this).dialog("close");
                        }
                    },
                    open : function() {
                        $(this).load(contextPath + '/app/staging/messageboard/edit-messages/show', {
                            'messageIds' : createRequestString(rowData)
                        }, function() {
                            $('#lodingImgEditMessage').remove();
                            initEditUI();
                        });
                    },
                    close : function(event, ui) {
                        $(this).dialog('destroy').remove();
                    }
                });

        $('#dialog-box').dialog("open");

    } else {
        $("#warningMsg").text("Please select at least one entry.").fadeIn('fast');
    }
}

function createRequestString(dataArray) {

    var selectedValues = '';

    var totalItems = dataArray.length;

    for (var i = 0; i < totalItems; i++) {

        if (dataArray.length > 0) {
            if (i == 0) {
                if (typeof dataArray[i] === 'object') {
                    selectedValues += dataArray[i].id.trim();
                } else {
                    selectedValues += dataArray[i];
                }

            } else {
                if (typeof dataArray[i] === 'object') {
                    selectedValues += ",";
                    selectedValues += dataArray[i].id.trim();
                } else {
                    selectedValues += ",";
                    selectedValues += dataArray[i];
                }
            }
        }
    }
    return selectedValues;
};

function buildSelectedMultiselectBoxString(filter, maxNumberOfElements) {

    var elements = $(filter);

    var valueArray = new Array();
    for (var i = 0; i < elements.length; i++) {
        var filterBox = $(elements[i]).select2("data");
        for (var j = 0; j < filterBox.length; j++) {
            if (typeof (filterBox[j].text) != 'undefined') {
                valueArray.push(filterBox[j].text);
            }
        }
    }

    var elementCount = 0;
    var selectedValues = '';
    for (var i = 0; i < valueArray.length; i++) {
        elementCount++;
        if (typeof (maxNumberOfElements) != 'undefined' && elementCount > maxNumberOfElements) {
            selectedValues += "...";
            return selectedValues;
        }

        if (selectedValues.length > 0) {
            selectedValues += ", ";
        }
        selectedValues += valueArray[i];
    }

    return selectedValues;
};

function setFilterTextBoxValues() {
    var fleets = buildSelectedMultiselectBoxString('#fleet-filter', 3);
    var divisions = buildSelectedMultiselectBoxString('#division-filter', 3);
    var acRegs = buildSelectedMultiselectBoxString('#ac-reg-filter', 3);
    var statusReason = buildSelectedMultiselectBoxString('#status-reason-filter', 2);

    $('#fleetFilterText').html(fleets);
    $('#divisionFilterText').html(divisions);
    $('#acRegFilterText').html(acRegs);
    $('#statusReasonFilterText').html(statusReason);
};

function hideFilter() {
    setFilterTextBoxValues();
    $('#headerFilterBoxes').hide();
    $('#headerTextBoxes').show();
};

function submitEditFormData() {
    var rowData = $("#messageboard-grid").jqGrid('getGridParam', 'selarrrow');

    var submitOptions = {
        dataType : 'html',
        enctype : 'multipart/form-data',
        data : {
            messageIds : createRequestString(rowData)
        },
        // default ajax options
        type : 'post',
        beforeSubmit : function(toBeSubmittedFormFields, toBeSubmittedForm) {
            removeEmptyFileFormFields(toBeSubmittedFormFields);
        },
        // success identifies the function to invoke when the server response
        // has been received; here we apply a fade-in effect to the new content
        success : function(result) {

            var result = JSON.parse(result);

            if (result.success.length > 0) {
                $("#successMsg").text(result.success).show();
                $("#messageboard-grid").trigger("reloadGrid");

                $("#messageboard-grid").trigger("reloadGrid");
                $('#dialog-box').dialog('close');
            }

            var errorText = '';
            if (result.errors.length > 0) {
                var cErrorMsg = $('#editErrorMsg').clone();
                $('#editStatusMsgBlock #editErrorMsg').remove();
                for (var i = 0; i < result.errors.length; i++) {
                    var cloneErrorMsg = $(cErrorMsg).clone();
                    errorText = result.errors[i];
                    cloneErrorMsg.text(errorText).show();
                    $('#editStatusMsgBlock').append(cloneErrorMsg);
                }
            }

        },
        error : function(result) {

            var result = JSON.parse(result);
            $("#errorMsg").text(result.errors).show();

            $("#messageboard-grid").trigger("reloadGrid");
            $('#dialog-box').dialog('close');
        }
    };

    $('#editMessagesForm').ajaxSubmit(submitOptions);

}

function cancelEditFormData() {

    $("#messageboard-grid").trigger("reloadGrid");
    $('#dialog-box').dialog('close');

    return false;
}

/**
 * change style of drop zone on drag file on it
 */
function initDropZoneUI(containerId, dropZoneId) {
    $("#" + containerId).bind('dragover', function(e) {
        var dropZone = $('#' + dropZoneId), timeout = window.dropZoneTimeout;
        if (!timeout) {
            dropZone.addClass('in');
        } else {
            clearTimeout(timeout);
        }
        var found = false, node = e.target;
        do {
            if (node === dropZone[0]) {
                found = true;
                break;
            }
            node = node.parentNode;
        } while (node != null);
        if (found) {
            dropZone.addClass('hover');
        } else {
            dropZone.removeClass('hover');
        }
        window.dropZoneTimeout = setTimeout(function() {
            window.dropZoneTimeout = null;
            dropZone.removeClass('in hover');
        }, 100);
    });
};

function initFileUpload(fileUploadId, fileListId, progressId) {

    $('#' + fileUploadId).fileupload(
            {
                dropZone : $('#dropzone'),
                replaceFileInput : false,
                formData : {
                    messageIds : createRequestString($("#messageboard-grid").jqGrid('getGridParam', 'selarrrow'))
                },
                drop : function(e, data) {
                    $("#progress").show().progressbar({
                        value : 0
                    });
                },
                change : function(e, data) {
                    $("#progress").show().progressbar({
                        value : 0
                    });
                },

                add : function(e, data) {
                    var jqXHR = data.submit().success(function(result, textStatus, jqXHR) {/* ... */
                    }).error(function(jqXHR, textStatus, errorThrown) {/* ... */
                    }).complete(
                            function(response, textStatus, jqXHR) {

                                var data = JSON.parse(response.responseText);

                                $("#" + fileListId).append(
                                        '<li><a href="' + contextPath + '/app/staging/messageboard/attachment/  ' + data.id + '" target="_blank">' +
                                                data.fileName + '</a></li>');

                                $("#" + progressId).hide();
                            });
                },
                progressall : function(e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);

                    $("#" + progressId).progressbar({
                        value : progress
                    });

                }
            });

};

function deleteAttachmentUI() {

    $(".msg-board-att-delete").click(function() {

        var deleteButtonObj = $(this);
        var attachmentId = parseInt(deleteButtonObj.attr("id").replace("msg-board-att-", ""));

        $.ajax({
            type : 'GET',
            url : contextPath + "/app/staging/messageboard/attachment/" + attachmentId + "/delete",
            success : function(result) {
                if (result.success.length > 0) {
                    $("#successMsg").text(result.success).show();
                    deleteButtonObj.parent().fadeOut();
                    deleteButtonObj.parent().remove();

                }
                if (result.errors.length > 0) {
                    $("#errorMsg").text(result.errors).show();
                }
            },
            error : function(result) {
                $("#errorMsg").text("General error occurs. Please try again later.").show();
            }
        });
        return false;
    });

};

function initEditUI() {
    $('#resetDate').datepicker({
        dateFormat : 'dd.mm.yy',
        changeMonth : true,
        changeYear : true,
        yearRange : '0:+10',
        minDate : +1,
        onClose : function(dateText, inst) {
            if (dateText != $(this).attr('placeholder')) {
                $(this).removeClass('placeholder');
            }
        }
    });

    initDropZoneUI("file-container", "dropzone");
    initDropZoneUI("internal-file-container", "internal-dropzone");

    initFileUpload("fileupload", "fileList", "progress");
    initFileUpload("internal-fileupload", "internal-fileList", "internal-progress");

    deleteAttachmentUI();
};

function copyFilter() {
    var filterValue = getMessageBoardFilterValues();

    var url = getHomeBaseUrl() + '/app/staging/messageboard';
    var paramsUrl = "";
    if (Object.size(filterValue) > 0) {
        paramsUrl = "?";
        for ( var key in filterValue) {
            if (paramsUrl != "") {
                paramsUrl += "&";
            }
            paramsUrl += key + "=" + filterValue[key];
        }
        url += paramsUrl;
    }

    window.prompt("Copy to clipboard: Ctrl+C, Enter", url);

};

function saveFilter() {

    var filterValue = getMessageBoardFilterValues();

    var postData = {};
    postData["viewName"] = "MESSAGEBOARD";
    var url = contextPath + '/app/staging/filter/save/view-name';

    if ($.isEmptyObject(filterValue)) {
        url = contextPath + '/app/staging/filter/delete/view-name';
    } else {
        postData["filterValue"] = JSON.stringify(filterValue);
    }

    $.ajax({
        type : 'POST',
        data : postData,
        url : url,
        success : function(result) {
            if (result.success.length > 0) {
                $("#successMsg").text(result.success).show();
            }
            if (result.errors.length > 0) {
                $("#errorMsg").text(result.errors).show();
            }
        },
        error : function(result) {
            $("#errorMsg").text("General error occurs. Please try again later.").show();
        }
    });

};

function detailViewLinkFormatter(cellvalue, options, rowObject) {
    if (cellvalue != null && rowObject.taskNo != null) {
        return '<a href="' + contextPath + '/app/groundtime/detail/' + rowObject.taskNo +
                '" title="link to Ground Time Detail View" target="_blank"><i class="fa fa-external-link-square fa-lg"></i></a>';
    }
    return '';
}

function getMessageBoardFilterValues() {
    var filterValue = {};

    var filterFields = {
        "fleet" : "fleet-filter",
        "division" : "division-filter",
        "acReg" : "ac-reg-filter",
        "status" : "status-reason-filter"
    };

    for ( var key in filterFields) {
        var filterData = createRequestString($("#" + filterFields[key]).select2("data")).split(",");
        if (filterData && filterData != "") {
            filterValue[key] = filterData;
        }
    }

    return filterValue;
};

$(document).ready(function() {

    $("#tabbarInfoForItem").tabnav();

    $("#messageboard-delete").click(function() {
        deleteMessagesDialog();
        return false;
    });

    $("#messageboard-edit").click(function() {
        editMessagesDialog();
        return false;
    });

    $("#confirm-filter-button").click(function() {
        filterAttributesChanged();
        return false;
    });

    $("#status-reason-filter").select2({
        width : 230,
        placeholder : "Status Reason"
    });

    if ($("#headerTextBoxes").is(':visible')) {
        setFilterTextBoxValues();
    }

    initMessageBoardDataGrid();

    $(".save-filter").click(function() {
        saveFilter();
        return false;
    });

    $('.hide-filter').click(function() {
        hideFilter();
        return false;
    });

    $('.show-filter').click(function() {
        $('#headerTextBoxes').hide();
        $('#headerFilterBoxes').show();
        return false;
    });

    $('.copy-filter').click(function() {
        copyFilter();
        return false;
    });

    $('thead').remove();

    $('#select-all').change(function() {
        var grid = $('#messageboard-grid');
        if ($(this).is(':checked')) {
            grid.jqGrid('resetSelection');
            var ids = grid.getDataIDs();
            for (var i = 0, il = ids.length; i < il; i++) {
                grid.jqGrid('setSelection', ids[i], true);
            }
        } else {
            grid.jqGrid('resetSelection');
        }
    });
});

// MCG-2503 - link to the ac general info page
function acRegLinkFormatter(cellvalue, options, rowObject) {

    if (cellvalue != null && cellvalue.indexOf('A/C Reg: ') > -1) {
        cellvalue = cellvalue.replace('A/C Reg: ', '');
        var s = cellvalue.split('<br>');
        var s2 = '';
        if (s.length > 1) {
            s2 = s[1];
        }
        return 'A/C Reg: ' + '<a href="' + contextPath + '/app/groundtime/detail/ac/' + s[0] + '" target="_blank">' + s[0] + '</a>' + '<br>' + s2;
    }
    return cellvalue;
};

function customCol2LinkFormatter(cellvalue, options, rowObject) {

    var result = cellvalue;

    if (cellvalue === null || cellvalue === '') {
        result = "";
    } else if (rowObject.workNo !== null && rowObject.stepNo != null && rowObject.acReg !== null) {
        var f40ReportParams = {
            workNo : rowObject.workNo,
            stepNo : rowObject.stepNo,
            acReg : rowObject.acReg
        };
        if (cellvalue.indexOf('MO: ') > -1) {
            cellvalue = cellvalue.replace('MO: ', '');
            var s = cellvalue.split('<br>');
            var s2 = '';
            if (s.length > 1) {
                s2 = s[1];
            }

            result = 'MO:' + '<a href="' + contextPath + '/app/f40?' + $.param(f40ReportParams) + '" target="_blank" >' + s[0] + '</a>' + '<br>' + s2;
        }
    }
    return result;
};

