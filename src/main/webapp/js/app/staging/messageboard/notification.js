function editFormatter(cellvalue, options, rowObject) {
    if (cellvalue) {
        return '<a id="notification-edit" class="button standard" title="Edit Notification" onclick="editNotification(' + rowObject.id +
                ')">Edit</a><a id="notification-delete" class="button standard" title="Delete Notification" onclick="deleteNotifiaction(' +
                rowObject.id + ',\'' + rowObject.name + '\'' + ')">Delete</a>';
    }
    return '';
}

function activFormatter(cellvalue, options, rowObject) {
    var result = '<input type="checkbox" name="isActive" title="Activate / Deactivate Notification" id="' + rowObject.id + '"';
    if (cellvalue) {
        result += " checked";
    }
    result += ">";
    return result;
}

function dayFormatter(cellvalue, options, rowObject) {
    var result = '';
    if (cellvalue) {
        result = 'X';
    }
    return result;
}

function initStatusFilter() {
    $("#notification-status-reason-filter").select2({
        width : 330,
        placeholder : "Status Reason"
    }).on("select2-open", function() {
        $("#dialog-box").scrollTop($("#dialog-box").height());
    });
};
function setEditNotificationFilter() {
    $('#fleet').val($('#notification-fleet-filter').val());
    $('#division').val($('#notification-division-filter').val());
    $('#acReg').val($.trim($('#notification-ac-reg-filter').val()));
}

function editNotification(id) {
    $(
            '<div id="dialog-box"><div id="dialog-form"><div id="lodingImgEditNotification"><img src="../resources/img/lhtcontrols/loading.gif" /> Loading..</div></div></div>')
            .dialog(
                    {
                        title : 'Notification',
                        autoOpen : true,
                        resizable : false,
                        height : 400,
                        width : 380,
                        modal : true,
                        closeOnEscape : true,
                        buttons : {
                            'Save' : function() {
                                var options = {
                                    success : function(data) {

                                        if (data.success.length > 0) {
                                            $('#successMsg').text(data.success).show();
                                            $('#notification-grid').trigger("reloadGrid");

                                            $('#dialog-box').dialog('close');
                                        }
                                        if (data.errors.length > 0) {
                                            $('#editWarningNotificationList').children().remove();

                                            for ( var i = 0; i < data.errors.length; i++) {
                                                $('#editWarningNotificationList').append(
                                                        '<div id="editWarningNotification" class="error status-msg">' + data.errors[i] + '</div>');
                                            }
                                            $('#editWarningNotificationList').show();
                                        }
                                    }
                                };
                                setEditNotificationFilter();

                                $('#editNotificationForm').ajaxSubmit(options);
                            },
                            'Cancel' : function() {
                                $(this).dialog("close");
                            }
                        },
                        open : function() {
                            if (typeof id != 'undefined') {
                                $(this).load(contextPath + '/app/staging/editNotification', {
                                    'notificationId' : id
                                }, function() {
                                    $('#lodingImgEditNotification').remove();
                                    $('#dayCheckBoxes').buttonset();
                                    $('#dayCheckBoxes').buttonset("refresh");

                                    initStatusFilter();

                                });
                            } else {
                                $(this).load(contextPath + '/app/staging/newNotification', function() {
                                    $('#dayCheckBoxes').buttonset();
                                    initStatusFilter();

                                });

                            }
                        },
                        close : function(event, ui) {
                            $(this).dialog('destroy').remove();
                        }
                    });

    $('#dialog-box').dialog("open");

}

function deleteNotifiaction(id, name) {

    var $dialog = $('<div style="padding-top: 10px; padding-left:10px; font-size:12px;"></div>').html(
            "Do you really want to delete the Notification \"" + name + "\"?").dialog({
        title : 'Delete Notification',
        autoOpen : false,
        resizable : false,
        height : 130,
        width : 350,
        modal : true,
        closeOnEscape : true,
        buttons : {
            "Yes" : function() {
                $.ajax({
                    type : 'POST',
                    url : contextPath + "/app/staging/deleteNotification",
                    data : {
                        notificationId : id
                    },
                    success : function(data) {
                        if (data.success.length >= 0) {
                            $("#notification-grid").trigger("reloadGrid");
                            $("#successMsg").text(data.success).show();
                        }

                    },
                    error : function() {
                        $("#errorMsg").text("General error occurs. Please try again later.").show();
                    }
                });

                $(this).dialog("close");

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
}

$(document).ready(function() {

    $('#notification-grid').jqGrid({
        url : contextPath + '/app/staging/notificationsData',
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
        colNames : [ 'Notification', 'Filter', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Time', 'Active', ' ', 'Id' ],
        colModel : [ {
            name : 'name',
            index : 'name',
            width : 250
        }, {
            name : 'filter',
            index : 'filter',
            sortable : false,
            width : 385
        }, {
            name : 'monday',
            index : 'monday',
            width : 38,
            align : 'center',
            sortable : false,
            formatter : dayFormatter
        }, {
            name : 'tuesday',
            index : 'tuesday',
            width : 38,
            align : 'center',
            sortable : false,
            formatter : dayFormatter
        }, {
            name : 'wednesday',
            index : 'wednesday',
            width : 38,
            align : 'center',
            sortable : false,
            formatter : dayFormatter
        }, {
            name : 'thursday',
            index : 'thursday',
            width : 38,
            align : 'center',
            sortable : false,
            formatter : dayFormatter
        }, {
            name : 'friday',
            index : 'friday',
            width : 38,
            align : 'center',
            sortable : false,
            formatter : dayFormatter
        }, {
            name : 'saturday',
            index : 'saturday',
            width : 38,
            align : 'center',
            sortable : false,
            formatter : dayFormatter
        }, {
            name : 'sunday',
            index : 'sunday',
            width : 38,
            align : 'center',
            sortable : false,
            formatter : dayFormatter
        }, {
            name : 'timeString',
            index : 'timeString',
            sortable : false,
            width : 90
        }, {
            name : 'active',
            index : 'active',
            width : 55,
            formatter : activFormatter,
            sortable : false,
            align : 'center'
        }, {
            name : 'button',
            index : 'button',
            width : 140,
            sortable : false,
            formatter : editFormatter
        }, {
            name : 'id',
            index : 'id',
            width : 1,
            sortable : false,
            key : true,
            hidden : true
        } ],
        pager : '#notification-grid-pager',
        viewrecords : true,
        height : 'auto',
        gridview : true,
        altRows : true,
        altclass : 'gridAltRowClass'
    }).navGrid('#notification-grid-pager', {
        view : false,
        del : false,
        edit : false,
        add : false,
        search : false
    });

    $(document).on('click', '#notification-grid input[type=checkbox]', function() {
        $.ajax({
            type : 'POST',
            data : {
                'notificationId' : this.id,
                'active' : $(this).is(':checked')
            },
            url : contextPath + '/app/staging/activateNotification'
        });
    });
});