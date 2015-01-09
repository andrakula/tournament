$(function() {

    /**
     * bind add comment form submit event
     */
    $(document).on('click', '#tabStatusContent #saveStatus', function(e) {
        $('#statusForm').docViewerSubmitForm({
            afterSuccess : function() {
                var successMsg = $('#successMessagesStatus').val();
                var successElement = $('#successMsg');
                if (successMsg) {
                    successElement.html(successMsg);
                    successElement.show();
                } else {
                    successElement.hide();
                    successElement.empty();
                }

                $('#status-grid').trigger("reloadGrid");
                initStatusDatePicker();
            }
        });
    });

    $(document).on('change', '#completenessCheckTypeId', function(e) {
        $('#StatusUpper #completenessCheckTypeId').attr("title", $('#completenessCheckTypeId option:selected').text());
    });

    $(document).on('click', '#tabStatusContent #status-grid td.delete input[type=button]', function(e) {
        var confirmation = confirm("The selected subscription will be deleted permanently! Do you really want to continue?");
        if (confirmation) {
            $.ajax({
                type : 'POST',
                data : {
                    completenessCheckDefinitionId : this.id
                },
                success : function() {
                    jQuery("#status-grid").trigger("reloadGrid");
                },
                url : contextPath + '/app/staging/docvieweradmin/status/table/delete'
            });
        }
    });
});

function initTabStatus() {

    var oldNotificationThreshold = 0;
    $(document.body).on('change', '#checkModusId', function() {

        // create title for dropDown
        $('#StatusUpper #checkModusId').attr("title", $('#checkModusId option:selected').text());

        var checkModusId = $(this).val();
        if (checkModusId == '2') {
            $("#notificationThreshold").prop('disabled', true);
            oldNotificationThreshold = $("#notificationThreshold").val();
            $("#notificationThreshold").val(0);
        } else if (checkModusId == '1') {
            $("#notificationThreshold").val(oldNotificationThreshold);
            $("#notificationThreshold").prop('disabled', false);
        }
    });

    initStatusGrid();
    initStatusDatePicker();

    $('#StatusUpper #checkModusId').attr("title", $('#checkModusId option:first').text());
    $('#StatusUpper #completenessCheckTypeId').attr("title", $('#completenessCheckTypeId option:first').text());
}

function initStatusDatePicker() {
    $("#startDate").datepicker({
        dateFormat : 'dd-M-yy',
        minDate : 0
    });
}

function initStatusGrid() {

    $('#status-grid').docViewerGrid(
            {
                url : contextPath + '/app/staging/docvieweradmin/status/table',
                pager : '#status-grid-pager',
                sortname : 'nextDueDate',
                sortorder : 'desc',
                colNames : [ 'Level', 'Check Modus', 'Check Cycle', 'Reminder Threshold', 'Start Date', 'Estimated Visit Date', 'Created by',
                        'Delete', 'Id' ],
                colModel : [ {
                    name : 'level',
                    index : 'level',
                    sortable : true,
                    width : 80
                }, {
                    name : 'checkCyclusName',
                    index : 'checkCyclusName',
                    sortable : false,
                    width : 140
                }, {
                    name : 'completenessCheckTypeName',
                    index : 'completenessCheckTypeName',
                    sortable : false,
                    width : 90
                }, {
                    name : 'notificationThreshold',
                    index : 'notificationThreshold',
                    sortable : true,
                    width : 100,
                    align : 'center'
                }, {
                    name : 'startDate',
                    index : 'startDate',
                    sortable : true,
                    width : 110,
                    align : 'center'
                }, {
                    name : 'nextDueDate',
                    index : 'nextDueDate',
                    sortable : true,
                    width : 110,
                    align : 'center'
                }, {
                    name : 'createdBy',
                    index : 'createdBy',
                    sortable : false,
                    width : 192
                }, {
                    name : 'delete',
                    index : 'delete',
                    sortable : false,
                    width : 115,
                    classes : 'delete',
                    formatter : deleteButtonFormatter,
                    align : 'center'
                }, {
                    name : 'completenessCheckDefinitionId',
                    index : 'completenessCheckDefinitionId',
                    sortable : false,
                    hidden : true,
                    key : true,
                    width : 1
                } ]
            });
}