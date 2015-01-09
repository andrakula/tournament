$.extend($.jgrid.defaults, {
    prmNames : {
        page : "pageIdx",
        rows : "pageSize",
        sort : "sortCol",
        order : "sortDirection"
    }
});

function objectTypeFormatter(cellvalue, options, rowObject) {
    var result = "";
    if (cellvalue != null) {
        result = cellvalue + ":";
    }

    return result;
}

function customField1Formatter(cellvalue, options, rowObject) {
    var result = "";
    if (cellvalue == null) {
        cellvalue = "";
    }
    switch (rowObject.praefix) {
    case 'AC':
        result = 'MSN: ' + cellvalue;
        break;
    case 'SER':
        result = 'PNR: ' + cellvalue;
        break;
    case 'MS':
        result = 'Revision: ' + cellvalue;
        break;
    case 'ESN':
        result = 'Engine Type: ' + cellvalue;
        break;
    case 'PUBL':
        result = 'URL: ' + cellvalue;
        break;
    case 'SD':
        result = 'Document Type: ' + cellvalue;
        break;
    case 'ST':
        result = 'Revision: ' + cellvalue;
        break;
    case 'WO':
        result = 'Description: ' + cellvalue;
        break;
    case 'WOP':
        result = 'Location: ' + cellvalue;
        break;
    case 'AMT':
        result = 'Title: ' + cellvalue;
        break;
    case 'CMT':
        result = 'Title: ' + cellvalue;
        break;
    case 'EMT':
        result = 'Title: ' + cellvalue;
        break;
    case 'MOD':
        result = 'Title: ' + cellvalue;
        break;
    default:
        break;

    }
    return result;
}

function customField2Formatter(cellvalue, options, rowObject) {
    var result = "";
    if (cellvalue == null) {
        cellvalue = "";
    }
    switch (rowObject.praefix) {
    case 'AC':
        result = 'Fleet: ' + cellvalue;
        break;
    case 'SER':
        result = 'A/C: ' + cellvalue;
        break;
    case 'MS':
        result = 'Status: ' + cellvalue;
        break;
    case 'ESN':
        result = 'A/C: ' + cellvalue;
        break;
    case 'PUBL':
        result = 'EMAIL: ' + cellvalue;
        break;
    case 'SD':
        result = 'Revision: ' + cellvalue;
        break;
    case 'ST':
        result = 'Title: ' + cellvalue;
        break;
    case 'WO':
        result = 'Step: ' + cellvalue;
        break;
    case 'WOP':
        result = 'A/C: ' + cellvalue;
        break;
    case 'AMT':
        result = 'Revision: ' + cellvalue;
        break;
    case 'CMT':
        result = 'Fleet: ' + cellvalue;
        break;
    case 'MOD':
        result = 'Revision: ' + cellvalue;
        break;
    default:
        break;

    }
    return result;
}

function customField3Formatter(cellvalue, options, rowObject) {
    var result = "";
    if (cellvalue == null) {
        cellvalue = "";
    }
    switch (rowObject.praefix) {
    case 'AC':
        result = 'A/C Type: ' + cellvalue;
        break;
    case 'SER':
        result = 'Position: ' + cellvalue;
        break;
    case 'PNR':
        result = 'Desc.: ' + cellvalue;
        break;
    case 'MS':
        result = 'Release Date: ' + cellvalue;
        break;
    case 'ESN':
        result = 'Position: ' + cellvalue;
        break;
    case 'SD':
        result = 'Publisher: ' + cellvalue;
        break;
    case 'ST':
        result = 'Source Document: ' + cellvalue;
        break;
    case 'WO':
        result = 'Operator: ' + cellvalue;
        break;
    case 'WOP':
        result = 'Status: ' + cellvalue;
        break;
    case 'AMT':
        result = 'Fleet: ' + cellvalue;
        break;
    case 'MOD':
        result = 'Fleet: ' + cellvalue;
        break;

    default:
        break;

    }
    return result;
}

function customField4Formatter(cellvalue, options, rowObject) {
    var result = "";
    if (cellvalue == null) {
        cellvalue = "";
    }
    switch (rowObject.praefix) {
    case 'SER':
        result = 'ATA: ' + cellvalue;
        break;
    case 'PNR':
        result = 'FSCM: ' + cellvalue;
        break;
    case 'MS':
        result = 'Approval Date: ' + cellvalue;
        break;
    case 'MOD':
        result = "Task No: " + cellvalue;
        break;
    default:
        break;
    }
    return result;
}

function customField5Formatter(cellvalue, options, rowObject) {
    var result = "";
    if (cellvalue == null) {
        cellvalue = "";
    }
    switch (rowObject.praefix) {
    case 'SER':
        result = 'ESN: ' + cellvalue;
        break;
    default:
        break;

    }
    return result;
}

var searchGridLoaded = false;

$(document).ready(
        function() {

            $('#searchResultTable').jqGrid(
                    {
                        url : contextPath + '/app/searchTableResults',
                        autowidth : true,
                        shrinkToFit : true,
                        datatype : 'json',
                        mtype : 'POST',
                        loadonce : true,
                        jsonReader : {
                            page : "pageIdx",
                            total : "totalPages",
                            records : "totalRecords",
                            root : "data",
                            repeatitems : false,
                            id : "0"
                        },
                        height : 'auto',
                        pager : '#search-grid-pager',
                        viewrecords : true,
                        gridview : true,
                        altRows : true,
                        altclass : 'gridAltRowClass',
                        rowNum : 20,
                        rowList : [ 20, 50, 100 ],
                        postData : {
                            searchTextHidden : $('input[name="searchTextHidden"]').val(),
                            type : function() {
                                return $('input[name="type"]').val();
                            }
                        },
                        colModel : [ {
                            name : 'id',
                            index : 'id',
                            hidden : true
                        }, {
                            name : 'praefix',
                            index : 'praefix',
                            hidden : true
                        }, {
                            name : 'objectTyp',
                            index : 'objectTyp',
                            align : 'right',
                            formatter : objectTypeFormatter,
                            width : 80
                        }, {
                            name : 'objectName',
                            index : 'objectName',
                            width : 150
                        }, {
                            name : 'customField1',
                            index : 'customField1',
                            formatter : customField1Formatter,
                            width : 150
                        }, {
                            name : 'customField2',
                            index : 'customField2',
                            formatter : customField2Formatter,
                            width : 150
                        }, {
                            name : 'customField3',
                            index : 'customField3',
                            formatter : customField3Formatter,
                            width : 300
                        }, {
                            name : 'customField4',
                            index : 'customField4',
                            formatter : customField4Formatter,
                            width : 250
                        }, {
                            name : 'customField5',
                            index : 'customField5',
                            formatter : customField5Formatter,
                            width : 150
                        } ],
                        beforeProcessing : function(data, status, xhr) {

                            if (data.length > 1 && data[data.length - 1] == null) {
                                alert("Maximum number (" + eval(data.length - 1) + ") of data rows exceeded, please refine your search!");
                            }
                        },
                        onCellSelect : function(rowid) {
                            var rowData = $('#searchResultTable').getRowData(rowid);
                            openResultDetail(rowData.praefix, rowData.objectName, rowData.objectTyp.replace(":", ""), rowData.id);
                        },
                        gridComplete : function() {
                            $('.jqgfirstrow td', this).css('padding', 0);
                            $('.jqgfirstrow td', this).css('border', 'none');
                            $('.jqgfirstrow', this).css('height', 0);
                            searchGridLoaded = true;
                        },
                        loadError : function(jqXHR, textStatus, errorThrown) {
                            // alert("Search failed! Please try later again!");
                            $('#searchResultTable tbody').append(
                                    '<tr><td colspan="9"><div id="errorMsg" class="error">Search failed! Please try later again!</div></td></tr>');
                        }
                    });

            $('#gview_searchResultTable .ui-jqgrid-hdiv').remove();

            $('.searchFilter').click(function() {
                if (searchGridLoaded) {
                    searchGridLoaded = false;
                    $('.searchFilter').removeClass('activeSearchFilter');
                    $(this).addClass('activeSearchFilter');
                    $('input[name="type"]').val($(this).attr('praefix'));
                    $('#searchResultTable').setGridParam({
                        datatype : 'json',
                        page : 1
                    }).trigger('reloadGrid');
                }
            });

            $('.searchFilter[praefix=\'' + $('input[name="type"]').val() + '\']').addClass('activeSearchFilter');

        });