var batchReportColNames = [ 'Report', 'Start Time', 'End Time', 'Status', 'File size', 'Id' ];

var batchReportColModel = [ {
    name : 'reportName',
    index : 'reportName',
    sortable : true,
    align : 'left',
    width : 100
}, {
    name : 'startTime',
    index : 'startTime',
    sortable : true,
    align : 'left',
    width : 100
}, {
    name : 'endTime',
    index : 'endTime',
    sortable : true,
    align : 'left',
    width : 100
}, {
    name : 'status',
    index : 'status',
    sortable : true,
    align : 'left',
    width : 20,
    formatter : statusIconFormatter
}, {
    name : 'fileSize',
    index : 'fileSize',
    sortable : true,
    align : 'left',
    width : 40
}, {
    name : 'id',
    index : 'id',
    sortable : false,
    hidden : true,
    key : true,
    width : 1
} ];

$(document).ready(function() {

    $("#buttonTestReport").click(function() {
        $.get($(this).attr("href"), function(data) {
            showStickyNotification(data);
        }).fail(function(e) {
            showStickyError(e.responseText);
        });

        return false;
    });

    $('#batchreports-grid').jqGrid({
        url : contextPath + '/app/staging/batchreports',
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
        colNames : batchReportColNames,
        colModel : batchReportColModel,
        pager : '#batchreports-grid-pager',
        viewrecords : true,
        height : 'auto',
        gridview : true,
        rowNum : 50,
        altRows : true,
        altclass : 'gridAltRowClass'
    });

});

function statusIconFormatter(cellvalue, options, rowObject) {
    var result = '';
    switch (cellvalue) {
    case 'DONE':
        result = '<div title="Done" class="batch-report-status-icon done"><i class="fa fa-check-square-o"></i></div>';
        break;
    case 'PROCESSING':
        result = '<div title="Processing" class="batch-report-status-icon processing"><i class="fa fa-cog fa-spin"></i></div>';
        break;
    case 'ERROR':
        result = '<div title="Error" class="batch-report-status-icon report-error"><i class="fa fa-times"></i></div>';
        break;
    default:
        result = '';
    }
    return result;
}
