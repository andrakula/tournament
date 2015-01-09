function editFormatter(cellvalue, options, rowObject) {

    return '<a id="helpFiles-edit-' + rowObject.menueId + '" class="button standard addHelpFile" title="Add" helpId="' + rowObject.menueId +
            '">Add</a>';
}

function deleteFormatter(cellvalue, options, rowObject) {
    var val = '';
    if (rowObject.hasHelpFile) {
        val = '<a id="helpFiles-delete-' + rowObject.menueId + '" class="button standard deleteHelpFile" title="Delete" helpId="' +
                rowObject.menueId + '">Delete</a>';
    }
    return val;
}

function editHelpFiles(menueIdStr) {

    var header = 'Add help file';
    $(
            '<div id="hfdialog-box"><div id="hfdialog-form"><div id="lodingImgEditMessage"><img src="../resources/img/lhtcontrols/loading.gif" /> Loading..</div></div></div>')
            .dialog({
                title : header,
                autoOpen : true,
                resizable : false,
                height : 230,
                width : 450,
                modal : true,
                closeOnEscape : true,
                buttons : {
                    'Close' : function() {
                        $(this).dialog("close");
                        return false;
                    }
                },
                open : function() {
                    $(this).load(contextPath + '/app/help/' + menueIdStr + '/edit', {}, function() {
                        $('#lodingImgEditMessage').remove();
                        initFileUpload("fileupload", menueIdStr, "progress");
                    });
                },
                close : function(event, ui) {
                    $(this).dialog('destroy').remove();
                }
            });

    $('#hfdialog-box').dialog("open");
}

function deleteHelpFiles(menueIdStr) {
    var text = 'text';
    var header = 'header';

    var $dialog = $('<div style="padding-top: 10px; padding-left:10px; font-size:12px;"></div>').html("Do you really want to delete this pfd file?")
            .dialog({
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
                            type : 'GET',
                            url : contextPath + "/app/help/" + menueIdStr + "/delete",
                            success : function(result) {
                                if (result.success.length > 0) {
                                    $("#successMsg").text(result.success).show();
                                }
                                if (result.errors.length > 0) {
                                    $("#errorMsg").text(result.errors).show();
                                }

                                $("#helpFiles-grid").trigger("reloadGrid");
                            },
                            error : function(result) {
                                $("#errorMsg").text("General error occurs. Please try again later.").show();
                                $("#helpFiles-grid").trigger("reloadGrid");
                                $(this).dialog("close");
                            }
                        });
                        $(this).dialog("close");
                        return false;
                    },
                    "No" : function() {
                        $(this).dialog("close");
                    }
                },
                close : function(event, ui) {
                    $(this).dialog('destroy').remove();
                }
            });
    $dialog.dialog('open');
};

function downloadHelpFile(menueIdStr) {
    $.fileDownload(contextPath + "/app/help/" + menueIdStr + "/download", {
        httpMethod : 'GET',
        data : {},
        success : function() {
        },
        error : function() {
            $("#errorMsg").text("General error occurs. Please try again later.").show();
        }
    });
    return false;

}

function initFileUpload(fileUploadId, menueId, progressId) {

    $('#' + fileUploadId).fileupload({
        dropZone : $('#dropzone'),
        replaceFileInput : false,
        formData : {},
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

            var goUpload = true;
            var uploadFile = data.files[0];
            // check - load only pdf files
            if (!(/\.(pdf)$/i).test(uploadFile.name)) {
                alert('Please select a PDF file only');
                goUpload = false;
            }
            // check file size
            if (uploadFile.size > 10000000) { // 2mb
                alert('Please upload a smaller file, max size is 10 MB');
                goUpload = false;
            }
            if (goUpload == true) {
                data.submit().success(function(result, textStatus, jqXHR) {/* ... */
                }).error(function(jqXHR, textStatus, errorThrown) {/* ... */
                }).complete(function(response, textStatus, jqXHR) {

                    $("#" + progressId).hide();

                    $("#hfdialog-box").dialog("close");
                    $("#helpFiles-grid").trigger("reloadGrid");

                    return false;
                });
            }
        },
        progressall : function(e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);

            $("#" + progressId).progressbar({
                value : progress
            });

        }
    });

};

$(document).ready(function() {

    $('#helpFiles-grid').jqGrid({
        url : contextPath + '/app/help/list',
        autowidth : true,
        shrinkToFit : true,
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
        colNames : [ 'ID', 'Help File', 'Last Update', 'Delete', 'Add' ],
        colModel : [ {
            name : 'menueId',
            index : 'menueId',
            sortable : false,
            width : 60
        }, {
            name : 'hasHelpFile',
            index : 'hasHelpFile',
            width : 20,
            align : 'center',
            sortable : false,
            formatter : pdfFileFormatter
        }, {
            name : 'updatedStr',
            index : 'updatedStr',
            sortable : false,
            width : 40
        }, {
            name : 'button',
            index : 'button',
            sortable : false,
            formatter : deleteFormatter,
            width : 15
        }, {
            name : 'button',
            index : 'button',
            sortable : false,
            formatter : editFormatter,
            width : 15
        } ],
        pager : '#helpFiles-grid-pager',
        viewrecords : true,
        height : 'auto',
        gridview : true,
        rowNum : 9999,
        altRows : true,
        altclass : 'gridAltRowClass',
        gridComplete : function() {
            $('.addHelpFile').click(function() {
                var helpID = $(this).attr('helpId');
                editHelpFiles(helpID);
                return false;
            });
            $('.deleteHelpFile').click(function() {
                var helpID = $(this).attr('helpId');
                deleteHelpFiles(helpID);
                return false;
            });
            $('.downloadHelpFile').click(function() {
                var helpID = $(this).attr('helpId');
                downloadHelpFile(helpID);
                return false;
            });
        }
    }).navGrid('#helpFiles-grid-pager', {
        view : false,
        del : false,
        edit : false,
        add : false,
        search : false
    });
});

function pdfFileFormatter(cellvalue, options, rowObject) {
    var r = '';
    if (cellvalue == true) {
        r = '<a id="helpFiles-download-' + rowObject.menueId + '" class="downloadHelpFile" helpId="' + rowObject.menueId + '"><img src="' +
                contextPath + '/resources/img/PDF_16.png" width="16px" height="16px" border="0" alt="PDF"></a>';
    }
    return r;
}