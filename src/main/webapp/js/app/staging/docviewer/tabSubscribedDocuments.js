var oldTempSubscribedRevisionNumber = '';

$(function() {

    $(document).on('click', '#openSearchDocumentDialog', function(e) {
        e.preventDefault();
        if (!$("#docTree").dynatree("getActiveNode").data.isIssuer) {
            $("#searchDocumentDialog").dialog('open');
        } else {
            alert('You need to select at least a doctype level in the tree to use the search.');
        }
    });

    $(document).on('documentSelectedEvent', function(e, data) {
        $('#documentNr').html(data.docNr);
        $('#documentName').html(data.documentName);
        $('#documentRevision').html(data.revision);
        $('#documentIssuerName').html(data.issuer);
        $('#documentDocTypeName').html(data.docType);

        $('#selectedSapDocKey').val(data.sapDocKey);
        $('#selectedDocumentNr').val(data.docNr);
        $('#selectedDocumentName').val(data.documentName);
        $('#selectedDocumentRevision').val(data.revision);
        $('#selectedDocumentPublisherName').val(data.issuer);
        $('#selectedDocumentDocTypeName').val(data.docType);
    });

    $(document).on('click', '#tabSubscribedDocumentsContent .triggerOpenSearchDialog', function() {
        $("#findSubscribedDocument").dialog("open");
    });

    /**
     * bind add comment form submit event
     */
    $(document).on('click', '#tabSubscribedDocumentsContent #saveSubscribed', function(e) {
        $('#subscribedForm').docViewerSubmitForm({
            afterSuccess : function() {
                $('#subscribed-grid').trigger("reloadGrid");
                initDocumentsMultiselectCustomerFleets();
            }
        });
    });

    $(document).on('change', 'input:radio[name=allOrNewestSubscribedDocs]', function(e) {
        if (this.value == 1) {
            $("#searchDocumentVersion").prop('disabled', true);
            oldTempSubscribedRevisionNumber = $("#searchDocumentVersion").val();
            $("#searchDocumentVersion").val('');
        } else if (this.value == 2) {
            $("#searchDocumentVersion").prop('disabled', false);
            $("#searchDocumentVersion").val(oldTempSubscribedRevisionNumber);
        }
    });

    $(document).on('click', '#tabSubscribedDocumentsContent #subscribed-grid td.futureRevisions input[type=checkbox]', function(e) {
        $.ajax({
            type : 'POST',
            data : {
                'subscribedId' : $(this).closest('tr').attr('id'),
                'active' : $(this).is(':checked')
            },
            url : contextPath + '/app/staging/docvieweradmin/subscribed/table/futureToggle',
            cache : false,
            success : function(responseText, statusText, xhr, form) {
                iterateMessages(responseText);

                $("#subscribed-grid tr#" + responseText.id + " td.futureRevisions input[type=checkbox]").prop('checked', responseText.checkBox);
            }
        });
    });

    $(document).on('click', '#tabSubscribedDocumentsContent #subscribed-grid td.delete input[type=button]', function(e) {
        var confirmation = confirm("The selected subscription will be deleted permanently! Do you really want to continue?");
        if (confirmation) {
            $.ajax({
                type : 'POST',
                data : {
                    'subscribedId' : $(this).closest('tr').attr('id')
                },
                success : function(responseText) {
                    $('#subscribed-grid').trigger("reloadGrid");
                    iterateMessages(responseText);
                },
                url : contextPath + '/app/staging/docvieweradmin/subscribed/table/delete',
                cache : false
            });
        }
    });

    $(document).on(
            'click',
            '#findSubscribedDocument #findSubscribedDocumentsButton',
            function(e) {
                $("#subscribed-overlay-grid").setGridParam(
                        {
                            datatype : "json",
                            postData : {
                                searchDocNr : $("#searchDocumentNr").val(),
                                searchDocVers : $("#searchDocumentVersion").val(),
                                searchName : $("#searchDocumentName").val(),
                                searchTo : $("#searchDateTo").val(),
                                searchFrom : $("#searchDateFrom").val(),
                                newOrAllRev : $('input:radio[name=allOrNewestSubscribedDocs]:checked').val(),
                                documentStatus : $('#subscribedDocumentStatusId').val(),
                                nodeId : $("#docTree").dynatree("getActiveNode").data.key,
                                nodeType : $("#docTree").dynatree("getActiveNode").data.isIssuer ? 'ISSUER'
                                        : $("#docTree").dynatree("getActiveNode").data.isDocType ? 'DOCTYPE' : 'CUSTOMER'
                            }
                        });

                $("#subscribed-overlay-grid").trigger("reloadGrid");
            });
});

function stagingDocViewerTreeSelection() {
    var node = $("#docTree").dynatree("getActiveNode");
    var treeSelection = {};
    if (node.data.isDocType) {
        treeSelection['docTypeIssuer'] = node.data.key;
    } else if (node.data.isCustomer) {
        treeSelection['docTypeIssuer'] = node.getParent().data.key;
    }
    return treeSelection;
}

function initTabSubscribedDocuments() {
    initDocumentsMultiselectCustomerFleets();
    initDocumentsGrid();
    initSearchDialog();
}

/**
 * Initialize the multiselection option for customer fleet selection
 */
function initDocumentsMultiselectCustomerFleets() {
    if ($("#subscribedDocumentsUpper #customerFleets option").length == 1) {
        $("#subscribedDocumentsUpper #customerFleets option").first().attr('selected', 'selected');
    }
    $("#subscribedDocumentsUpper #customerFleets").multiselect({
        height : 'auto',
        header : false,
        classes : 'subscribeds-doc-multi',
        selectedList : 5,
        position : {
            my : 'center top',
            at : 'center top'
        },
        open : function() {
            if ($("#subscribedDocumentsUpper #customerFleets option").length == 1) {
                $("#subscribedDocumentsUpper #customerFleets").multiselect("close");
            }
        }
    });
}

function initSearchDialog() {

    initDocumentSearchResultGrid();

    $("#findSubscribedDocument").dialog({
        dialogClass : 'dialog-window',
        autoOpen : false,
        resizable : false,
        modal : true,
        width : 'auto',
        close : function() {
            $('#findSubscribedDocument #dialogErrorMsg').hide();
            $('#findSubscribedDocument #dialogSuccessMsg').hide();
            $("#subscribed-overlay-grid").clearGridData();
            $("#subscribed-overlay-grid").setGridParam({
                datatype : "local",
                postData : {}
            });
            $('#subscribedOverlayForm')[0].reset();
            $("#searchDocumentVersion").prop('disabled', false);
            oldTempSubscribedRevisionNumber = '';
            $("#searchDocumentVersion").val('');
        },
        buttons : [ {
            text : "Accept",
            class : 'button default',
            click : function() {
                var rowData = $("#subscribed-overlay-grid").jqGrid('getRowData', $("#subscribed-overlay-grid input[name=selection]:checked").val());
                if (rowData) {
                    $('#documentNr').html(rowData.docNr);
                    $('#documentName').html(rowData.documentName);
                    $('#documentRevision').html(rowData.revision);
                    $('#documentIssuerName').html(rowData.issuer);
                    $('#documentDocTypeName').html(rowData.docType);

                    $('#selectedSapDocKey').val(rowData.sapDocKey);
                    $('#selectedDocumentNr').val(rowData.docNr);
                    $('#selectedDocumentName').val(rowData.documentName);
                    $('#selectedDocumentRevision').val(rowData.revision);
                    $('#selectedDocumentPublisherName').val(rowData.issuer);
                    $('#selectedDocumentDocTypeName').val(rowData.docType);

                    $(this).dialog("close");
                }
            }
        }, {
            text : 'Cancel',
            class : 'button standard',
            click : function() {
                $(this).dialog("close");
            }
        } ]

    });

    $("#searchDateFrom").datepicker({
        dateFormat : 'dd-M-yy'
    });
    $("#searchDateTo").datepicker({
        dateFormat : 'dd-M-yy'
    });

    // buildSelectedString('searchDocumentNr');

    $("#searchDocumentNr").autocomplete(
            {
                delay : 40,
                minLength : 3,
                dataType : "json",

                source : function(request, response) {

                    $.getJSON(contextPath + '/app/staging/docvieweradmin/subscribed/docNr', {
                        searchTerm : request.term,
                        nodeType : $("#docTree").dynatree("getActiveNode").data.isIssuer ? 'ISSUER'
                                : $("#docTree").dynatree("getActiveNode").data.isDocType ? 'DOCTYPE' : 'CUSTOMER',
                        nodeId : $("#docTree").dynatree("getActiveNode").data.key
                    }, function(data) {
                        var array = $.map(data, function(m) {
                            return {
                                label : m.text,
                                url : m.id
                            };
                        });
                        response(array);
                    });
                },
                focus : function(event, ui) {
                    // prevent autocomplete from updating the textbox
                    event.preventDefault();
                },
                open : function() {
                    // adds own css class to DropDown ul-container
                    $(this).data("uiAutocomplete").menu.element.addClass("200px-dropdown");
                }
            });
}

function subscribedDocumentSearchRadioFormatter(cellvalue, options, rowObject) {
    return '<input type="radio" name="selection" value="' + rowObject.sapDocKey + '"/>';
}

// OVERLAY GRID
function initDocumentSearchResultGrid() {

    $('#subscribed-overlay-grid').docViewerGrid({
        url : contextPath + '/app/staging/docvieweradmin/subscribed/search/table',
        datatype : 'local',
        pager : '#subscribed-overlay-grid-pager',
        sortname : 'REV_DATE',
        sortorder : 'desc',
        shrinkToFit : false,
        width : 616,
        afterGridComplete : function() {
            setColumnHeaderTooltip('#subscribed-overlay-grid', 'revision', 'Revision');
            $('#subscribed-overlay-grid a.edoc').click(function(event) {
                event.preventDefault();
                openEDocDocumentViewer($(this).attr('href'));
                return false;
            });
        },
        colNames : [ 'Document Nr.', 'Document Title', 'Rev.', 'Issue Date', '', '', 'id', 'issuer', 'DocType' ],
        colModel : [ {
            name : 'docNr',
            index : 'DOC_NR',
            sortable : true,
            width : 130
        }, {
            name : 'documentName',
            index : 'DOC_TITLE', // docTitle
            sortable : true,
            width : 280
        }, {
            name : 'revision', // revNr
            index : 'REV_NR',
            sortable : true,
            align : 'center',
            width : 50
        }, {
            name : 'issueDate',
            index : 'REV_DATE', // revisionDate
            sortable : true,
            align : 'center',
            width : 110
        }, {
            name : 'edocURL',
            formatter : eDocLink,
            classes : 'icon',
            sortable : false,
            width : 20
        }, {
            name : 'selection',
            sortable : false,
            formatter : subscribedDocumentSearchRadioFormatter,
            width : 25
        }, {
            name : 'sapDocKey',
            index : 'SAP_DOCKEY',
            sortable : false,
            hidden : true,
            key : true,
            width : 1
        }, {
            name : 'issuer',
            index : 'ISSUER_SHORT_NAME',
            sortable : false,
            hidden : true,
            width : 1
        }, {
            name : 'docType',
            index : 'DT_SHORT_NAME',
            sortable : false,
            hidden : true,
            width : 1
        } ]
    });

}

// SUBSCRIBED DOCUMENTS RULES GRID
function initDocumentsGrid() {
    $('#subscribed-grid').docViewerGrid(
            {
                headertitles : true,
                shrinkToFit : false,
                url : contextPath + '/app/staging/docvieweradmin/subscribed/table',
                colNames : [ 'Level', 'Document Nr.', 'Document Title', 'Rev.', 'Issue Date', 'Customer Fleet', 'Added by', 'Creation Date',
                        'Future Revisions', 'Delete', '', 'id' ],
                pager : '#subscribed-grid-pager',
                sortname : 'CREATE_DATE',
                sortorder : 'desc',
                afterGridComplete : function() {
                    setColumnHeaderTooltip('#subscribed-grid', 'revision', 'Revision');
                    $('#subscribed-grid a.edoc').click(function(event) {
                        event.preventDefault();
                        openEDocDocumentViewer($(this).attr('href'));
                        return false;
                    });
                },
                colModel : [ {
                    name : 'level',
                    index : 'AREA',
                    sortable : false,
                    width : 45
                }, {
                    name : 'documentNr',
                    index : 'DOCUMENT_NUMBER',
                    sortable : true,
                    width : 90
                }, {
                    name : 'documentName',
                    index : 'DOCUMENTNAME',
                    sortable : true,
                    width : 190
                }, {
                    name : 'revision',
                    index : 'REVISION',
                    sortable : true,
                    align : 'center',
                    width : 45
                }, {
                    name : 'issueDate',
                    index : 'ISSUE_DATE',
                    sortable : true,
                    align : 'center',
                    width : 90
                }, {
                    name : 'fleetName',
                    index : 'FLEET_NAME',
                    sortable : true,
                    width : 83
                }, {
                    name : 'createUser',
                    index : 'CREATE_USER',
                    sortable : true,
                    width : 120,
                    align : 'center'
                }, {
                    name : 'creationDate',
                    index : 'CREATE_DATE',
                    sortable : true,
                    align : 'center',
                    width : 90
                }, {
                    name : 'futureRevisions',
                    index : 'FUTURE_REVISIONS',
                    sortable : true,
                    align : 'center',
                    formatter : checkboxFormatter,
                    classes : 'futureRevisions',
                    width : 80
                }, {
                    name : 'delete',
                    index : 'delete',
                    width : 80,
                    classes : 'delete',
                    sortable : false,
                    align : 'center',
                    formatter : deleteButtonSubscribeFormatter
                }, {
                    name : 'edocURL',
                    formatter : eDocLink,
                    classes : 'icon',
                    sortable : false,
                    width : 20
                }, {
                    name : 'id',
                    index : 'subscribedDocumentId',
                    sortable : false,
                    hidden : true,
                    key : true,
                    width : 1
                } ]

            });
}
