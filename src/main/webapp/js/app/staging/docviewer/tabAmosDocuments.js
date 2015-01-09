$(function() {
    initAmosDocumentsAddListener();
});

function initTabAmosDocuments() {
    initAmosDocumentsGrid();
}

function initAmosDocumentsAddListener() {
    /**
     * bind add comment form submit event
     */
    $(document).on('change', '#amos-grid .datepicker', function(e) {
        var oldValue = $(this).data('old');
        var newValue = $(this).val();
        if (oldValue !== newValue) {
            var shouldSave = confirm("You changed the value of the AMOS registration date. Do you want to save the new date?");
            if (shouldSave) {
                $.post(contextPath + '/app/staging/docvieweradmin/amos/save', {
                    amosId : $(this).data('amos-id'),
                    registrationDate : newValue
                }).done(function(data) {
                    iterateMessages(data);
                    $("#amos-grid").trigger("reloadGrid");
                }).fail(function() {
                    setMessages([ 'AMOS document registration date was not saved, due to date conversion problem.' ], '#errorMsg');
                });
            } else {
                $(this).val(oldValue);
            }
        }

    });
}

function editableDateTimeFormatter(cellvalue, options, rowObject) {
    return '<input name="amosRegistrationDate" style="margin-top: 3px; vertical-align: middle;  position: relative; padding-bottom: 0px" type="text" size="12" data-old="' +
            cellvalue + '" data-amos-id="' + rowObject.amosId + '" value="' + cellvalue + '" class="datepicker"/>';
}

// SUBSCRIBED DOCUMENTS RULES GRID
function initAmosDocumentsGrid() {
    $('#amos-grid').docViewerGrid(
            {
                headertitles : true,
                url : contextPath + '/app/staging/docvieweradmin/amos/table',
                colNames : [ 'SAP Registration Date', 'AMOS Registration Date', 'Customer', 'Publisher', 'DocType', 'Document Number', 'Revision',
                        'Customer Fleet', 'Issue Date', 'Department', '', 'id' ],
                pager : '#amos-grid-pager',
                sortname : 'ADATUM',
                sortorder : 'desc',
                afterGridComplete : function() {
                    $('#amos-grid .datepicker').datepicker({
                        dateFormat : 'dd-M-yy',
                        maxDate : 0
                    });
                    $('#amos-grid a.edoc').click(function(event) {
                        event.preventDefault();
                        openEDocDocumentViewer($(this).attr('href'));
                        return false;
                    });
                },
                colModel : [ {
                    name : 'sapRegistrationDate',
                    index : 'ADATUM',
                    sortable : true,
                    width : 90,
                    align : 'center'
                }, {
                    name : 'amosRegistrationDate',
                    index : 'AMOS_REGISTRATION',
                    sortable : true,
                    width : 105,
                    formatter : editableDateTimeFormatter,
                    align : 'center'
                }, {
                    name : 'operatorCode',
                    index : 'OPERATOR_CODE',
                    sortable : true,
                    width : 90
                }, {
                    name : 'issuerName',
                    index : 'ISSUER_NAME',
                    sortable : true,
                    width : 90
                }, {
                    name : 'doctypeName',
                    index : 'DOCTYPE_NAME',
                    sortable : true,
                    width : 75
                }, {
                    name : 'documentNr',
                    index : 'DOCNR',
                    sortable : true,
                    width : 110
                }, {
                    name : 'revNr',
                    index : 'REVNR',
                    sortable : true,
                    align : 'center',
                    width : 70
                }, {
                    name : 'fleetName',
                    index : 'CUSTOMER_FLEET_NAME',
                    sortable : true,
                    width : 120
                }, {
                    name : 'issueDate',
                    index : 'REVDT',
                    width : 90,
                    sortable : true,
                    align : 'center'
                }, {
                    name : 'createDepartment',
                    index : 'CREATE_DEPARTMENT',
                    sortable : true,
                    width : 100
                }, {
                    name : 'edocURL',
                    formatter : eDocLink,
                    classes : 'icon',
                    sortable : false,
                    width : 20
                }, {
                    name : 'amosId',
                    index : 'id',
                    sortable : false,
                    hidden : true,
                    key : true,
                    width : 1
                } ]

            });
}
