$(document).ready(function() {
    // $('#maintTaskId').tabnav();

    var openTabIdvalue = $('#openTabId').val();

    $("#maintTaskId").tabnav({
        openTabId : (openTabIdvalue === "") ? "tabMaintHistory" : openTabIdvalue
    // "tabMtcActivity"
    });

    initTabMaintHiistoryGrid();
});

// PNR
// SER
// Findings
// Maint. Records
// Comments
var maintHistoryColNames = [ 'Object', 'Workorder', 'Step', 'PNR', 'SER', 'Last Accomp. Date', 'Findings', 'Maintenance Records', 'Comments', 'Id' ];

var maintHistoryColModel = [ {
    name : 'acReg',
    index : 'acReg',
    sortable : true,
    width : 100,
    align : 'left'
}, {
    name : 'workNo',
    index : 'workNo',
    sortable : true,
    width : 100,
    align : 'left'
}, {
    name : 'stepNo',
    index : 'stepNo',
    sortable : false,
    width : 60,
    align : 'left',
    sorttype : 'int'
}, {
    name : 'pnr',
    index : 'pnr',
    sortable : true,
    align : 'left',
    width : 70
}, {
    name : 'ser',
    index : 'ser',
    sortable : true,
    align : 'left',
    width : 70
}, {
    name : 'accompDate',
    index : 'accompDate',
    sortable : true,
    width : 150,
    formatter : 'date',
    formatoptions : {
        srcformat : 'd-M-Y',
        newformat : 'd-M-Y'
    },
    align : 'left',
    sorttype : 'date'
}, {
    name : 'findings',
    index : 'findings',
    sortable : true,
    width : 80,
    align : 'left'
}, {
    name : 'maintRecords',
    index : 'maintRecords',
    width : 150,
    sortable : false,
    align : 'center',
    classes : 'data-grid-cell',
    formatter : historyLinkFormatter
}, {
    name : 'comments',
    index : 'comments',
    width : 200,
    sortable : false,
    align : 'left',
    classes : 'data-grid-cell',
}, {
    name : 'sequenceNo',
    index : 'sequenceNo',
    key : true,
    sortable : false,
    width : 1,
    hidden : true,
    align : 'left'
} ];

function dateFormatter(cellvalue, options, rowObject) {
    var result = "";
    var date = moment.utc(cellvalue);
    if (date != null && date.isValid()) {
        result = moment.utc(cellvalue).format("DD-MMM-YYYY HH:mm").toUpperCase();
    }
    return result;
}

function initTabMaintHiistoryGrid() {

    var maintTaskNr = $('#maintTaskNr').val();
    var maintTaskType = $('#maintTaskType').val();
    var taskId = $('#taskId').val();

    var grid = $('#mainttask-tabMaintHistory-grid');
    grid.jqGrid({
        autowidth : true,
        shrinkToFit : true,
        url : contextPath + '/app/staging/mainttask/' + taskId + '/type/' + maintTaskType + '/number/' + maintTaskNr + '/tabMaintHistory',
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
        // postData : {
        // taskType : maintTaskType
        // pnr : $("#partNumber").text()
        // },
        colNames : maintHistoryColNames,
        colModel : maintHistoryColModel,
        sortname : 'accompDate',
        sortorder : 'desc',
        pager : '#mainttask-tabMaintHistory-grid-pager',
        rowNum : 20,
        rowList : [ 20, 50, 999999 ],
        viewrecords : true,
        height : 'auto',
        gridview : true,
        altRows : true,
        altclass : 'gridAltRowClass',
        onPaging : function(pgButton) {
            var requestedPage = 1;
            if (pgButton == "user") {
                requestedPage = parseInt($("#mainttask-tabMaintHistory-grid-pager .ui-pg-input").val());
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
        loadComplete : function() {
            if (grid.getGridParam("records") == 0) {
                grid.addRowData("blankRow", {
                    "Object" : "No data were found"
                });

            }
        }

    });
    /* css fixes */
    jQuery('#mainttask-tabMaintHistory-grid-pager' + " .ui-pg-selbox").closest("td").before(
            '<td style="padding-left:20px;" dir="ltr">Tablesize </td>');
    jQuery('#mainttask-tabMaintHistory-grid-pager' + ' option:last').text("all");

};

function historyLinkFormatter(cellvalue, options, rowObject) {
    if (cellvalue && parseInt(cellvalue) != 0) {
        return '<a href="' + contextPath + '/app/groundtime/mdlHistory/' + $('#maintTaskType').val() + '/' + cellvalue +
                '" target="_blank" title="open MDL History"><img src="' + contextPath + '/resources/img/lhticonset/copy_16.png"/></a>';
    }
    return '';
}
