$(document).ready(function() {
    // $('#maintTaskId').tabnav();

    var openTabIdvalue = $('#openTabId').val();

    $("#maintTaskId").tabnav({
        openTabId : (openTabIdvalue === "") ? "tabRevisionHistory" : openTabIdvalue
    // "tabMtcActivity"
    });

    initTabRevisionHiistoryGrid();
});

// PNR
// SER
// Findings
// Maint. Records
// Comments
var maintRevisionHistoryColNames = [ 'Task Number', 'Rev.', 'Rev. Date', 'Zone', 'Description', 'Reference', 'Threshold FH', 'Threshold FC',
        'Threshold Time', 'Threshold Check', 'Interval FH', 'Interval FC', 'Interval Time', 'Interval Check', 'Interval Logic', 'Short Effectivity',
        'Class', 'RM', 'Id' ];

var maintRevisionHistoryColModel = [ {
    name : 'taskNo',
    index : 'taskNo',
    sortable : true,
    width : 100,
    align : 'left'
}, {
    name : 'rev',
    index : 'rev',
    sortable : true,
    sortorder : 'desc',
    width : 60,
    align : 'left'
}, {
    name : 'revisionDate',
    index : 'revisionDate',
    sortable : true,
    width : 120,
    formatter : 'date',
    formatoptions : {
        srcformat : 'd-M-Y',
        newformat : 'd-M-Y'
    },
    align : 'left',
    sorttype : 'date'
}, {
    name : 'zone',
    index : 'zone',
    width : 50,
    sortable : false,
    align : 'left',
    classes : 'data-grid-cell',
}, {
    name : 'description',
    index : 'description',
    width : 180,
    sortable : false,
    align : 'left',
    classes : 'data-grid-cell',
}, {
    name : 'reference',
    index : 'reference',
    sortable : false,
    align : 'left',
    width : 90
}, {
    name : 'thresholdFH',
    index : 'thresholdFH',
    sortable : false,
    align : 'left',
    width : 100
}, {
    name : 'thresholdFC',
    index : 'thresholdFC',
    sortable : false,
    align : 'left',
    width : 100
}, {
    name : 'thresholdTime',
    index : 'thresholdTime',
    sortable : false,
    width : 120,
    formatter : 'date',
    formatoptions : {
        srcformat : 'd-M-Y',
        newformat : 'd-M-Y'
    },
    align : 'left',
}, {
    name : 'thresholdCheck',
    index : 'thresholdCheck',
    sortable : true,
    width : 120,
    align : 'left'
}, {
    name : 'intervalFH',
    index : 'intervalFH',
    sortable : false,
    align : 'left',
    width : 100
}, {
    name : 'intervalFC',
    index : 'intervalFC',
    sortable : false,
    align : 'left',
    width : 100
}, {
    name : 'intervalTime',
    index : 'intervalTime',
    sortable : false,
    width : 120,
    formatter : 'date',
    formatoptions : {
        srcformat : 'd-M-Y',
        newformat : 'd-M-Y'
    },
    align : 'left',
}, {
    name : 'intervalCheck',
    index : 'intervalCheck',
    sortable : true,
    width : 120,
    align : 'left'
}, {
    name : 'intervalLogic',
    index : 'intervalLogic',
    sortable : false,
    width : 110,
    align : 'center',
    classes : 'data-grid-cell',
    formatter : historyLinkFormatter
}, {
    name : 'shortEffectivity',
    index : 'shortEffectivity',
    sortable : false,
    width : 120,
    align : 'left'
}, {
    name : 'revHistClass',
    index : 'revHistClass',
    sortable : true,
    width : 60,
    align : 'left'
}, {
    name : 'rm',
    index : 'rm',
    sortable : true,
    width : 60,
    align : 'left'
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

function initTabRevisionHiistoryGrid() {

    var maintTaskNr = $('#maintTaskNr').val();
    var maintTaskType = $('#maintTaskType').val();
    var taskId = $('#taskId').val();

    var grid = $('#mainttask-tabRevisionHistory-grid');
    grid.jqGrid({
        autowidth : true,
        shrinkToFit : true,
        url : contextPath + '/app/staging/mainttask/' + taskId + '/type/' + maintTaskType + '/number/' + maintTaskNr + '/tabRevisionHistory',
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
        colNames : maintRevisionHistoryColNames,
        colModel : maintRevisionHistoryColModel,
        sortname : 'rev',
        sortorder : 'desc',
        pager : '#mainttask-tabRevisionHistory-grid-pager',
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
                requestedPage = parseInt($("#mainttask-tabRevisionHistory-grid-pager .ui-pg-input").val());
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
    jQuery('#mainttask-tabRevisionHistory-grid-pager' + " .ui-pg-selbox").closest("td").before(
            '<td style="padding-left:20px;" dir="ltr">Tablesize </td>');
    jQuery('#mainttask-tabRevisionHistory-grid-pager' + ' option:last').text("all");

};

function historyLinkFormatter(cellvalue, options, rowObject) {
    if (cellvalue && parseInt(cellvalue) != 0) {
        return '<a href="' + contextPath + '/app/groundtime/mdlHistory/' + $('#maintTaskType').val() + '/' + cellvalue +
                '" target="_blank" title="open MDL History"><img src="' + contextPath + '/resources/img/lhticonset/copy_16.png"/></a>';
    }
    return '';
}
