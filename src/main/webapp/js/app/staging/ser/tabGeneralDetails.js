$.extend(jQuery.jgrid.defaults, {
    prmNames : {
        page : "pageIdx",
        rows : "pageSize",
        sort : "sortCol",
        order : "sortDirection"
    }
});

var taskIntervalsColNames = [ 'Status', 'Type', 'Task Number', 'Next Due', 'Remaining', 'Id' ];

var taskIntervalsColModel = [ {
    name : 'status',
    index : 'status',
    width : 10,
    sortable : false,
    formatter : statusFormatter,
    align : 'center'
}, {
    name : 'taskType',
    sortable : false,
    index : 'taskType',
    width : 15,
    align : 'left'
}, {
    name : 'taskNumber',
    sortable : false,
    index : 'taskNumber',
    width : 25,
    align : 'left'
}, {
    name : 'due',
    sortable : false,
    index : 'due',
    width : 35,
    align : 'left'
}, {
    name : 'remaining',
    sortable : false,
    index : 'remaining',
    width : 35,
    align : 'left'
}, {
    name : 'id',
    index : 'id',
    hidden : true,
    key : true,
    width : 1
} ];

var compOpCountersColNames = [ 'Taskcode', 'OPH', 'OPC', 'OPD', 'Calendar Days', 'Accomplishment Date', 'Shop Certificate', 'Id' ];

var compOpCountersColModel = [ {
    name : 'taskCode',
    index : 'taskCode',
    width : 20,
    sortable : false,
    align : 'center'
}, {
    name : 'opHours',
    index : 'opHours',
    width : 20,
    sortable : false,
    align : 'left'
}, {
    name : 'opCycles',
    index : 'opCycles',
    width : 20,
    sortable : false,
    align : 'left'
}, {
    name : 'opDays',
    index : 'opDays',
    width : 20,
    sortable : false,
    align : 'left'
}, {
    name : 'calendarDays',
    index : 'calendarDays',
    width : 20,
    sortable : false,
    align : 'left'
}, {
    name : 'accomplishmentDate',
    index : 'accomplishmentDate',
    width : 20,
    sortable : false,
    align : 'left'
}, {
    name : 'shopCertificate',
    index : 'shopCertificate',
    width : 20,
    sortable : false
}, {
    name : 'id',
    index : 'id',
    hidden : true,
    key : true,
    width : 1
} ];

var instCountersColNames = [ 'Installation Date', 'At Installation Date A/C (Total)', 'At Installation Date Component (Total)',
        'Since Installation Date Component Delta', 'Id', 'InstallationDateUtc' ];

var instCountersColModel = [ {
    name : 'rowName',
    index : 'rowName',
    width : 70,
    sortable : false
}, {
    name : 'acData',
    index : 'acData',
    width : 70,
    sortable : false
}, {
    name : 'componentData',
    index : 'componentData',
    width : 70,
    sortable : false
}, {
    name : 'delta',
    index : 'delta',
    width : 70,
    sortable : false
}, {
    name : 'id',
    index : 'id',
    hidden : true,
    key : true,
    width : 1
}, {
    name : 'installationDateUtc',
    index : 'installationDateUtc',
    hidden : true,
    width : 1
} ];

function statusFormatter(cellvalue, options, rowObject) {
    return '<div class="status-column-icon status-column-icon-' + cellvalue + '" style="display:block !important; 7px;"></div>';
}

function initTaskIntervalTable() {

    var grid = $('#taskIntervalsTable');
    grid.jqGrid({
        autowidth : true,
        shrinkToFit : true,
        height : 'auto',
        url : contextPath + '/app/staging/ser/' + $("#serPartId").text() + '/task-and-intervals',
        colNames : taskIntervalsColNames,
        colModel : taskIntervalsColModel,
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
        ajaxGridOptions : {
            timeout : 60000,
            error : function(xhr, statusRequestAjax, error) {
                errorPartTotalCounterLoaded();
            },
        },
        viewrecords : true,
        gridview : true,
        altRows : true,
        altclass : 'gridAltRowClass',
        multiselect : false,
        subGrid : false,
        caption : false,
        rowNum : 9999
    });

};
function initInstCountersTable() {

    var grid = $('#installation-counters-table');
    grid.jqGrid({
        autowidth : true,
        shrinkToFit : true,
        height : 'auto',
        url : contextPath + '/app/staging/ser/' + $("#serPartId").text() + '/installation-counters',
        colNames : instCountersColNames,
        colModel : instCountersColModel,
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
        ajaxGridOptions : {
            timeout : 60000,
            error : function(xhr, statusRequestAjax, error) {
                errorPartTotalCounterLoaded();
            },
        },
        viewrecords : true,
        gridview : true,
        altRows : true,
        altclass : 'gridAltRowClass',
        multiselect : false,
        subGrid : false,
        caption : false,
        // pager : '#installation-counters-pager',
        rowNum : 5,
        gridComplete : function() {
            var installationDateUtc = grid.jqGrid('getRowData', 1).installationDateUtc;
            var colNameObj = $("#jqgh_installation-counters-table_rowName");
            if (installationDateUtc != '' && installationDateUtc != null) {
                colNameObj.text("Installation Date: " + installationDateUtc);
            }

            loadPartTotalCounterLoaded();

        }
    });

};

function initCompOpCountersTable() {

    var grid = $("#compOpCountersTable");
    grid.jqGrid({
        autowidth : true,
        shrinkToFit : true,
        height : 'auto',
        url : contextPath + '/app/staging/ser/' + $("#serPartId").text() + '/component-operatings-counters',
        colNames : compOpCountersColNames,
        colModel : compOpCountersColModel,
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
        ajaxGridOptions : {
            timeout : 60000,
            error : function(xhr, statusRequestAjax, error) {
                errorPartTotalCounterLoaded();
            },
        },
        viewrecords : true,
        gridview : true,
        altRows : true,
        altclass : 'gridAltRowClass',
        multiselect : false,
        subGrid : false,
        caption : false,
        rowNum : 10,
        gridComplete : function() {
            loadPartTotalCounterLoaded();
        }
    });

};

var partTotalCounterLoaded = false;
function loadPartTotalCounterLoaded() {
    if (!partTotalCounterLoaded) {
        $("#partTotalCounter").load(contextPath + '/app/staging/ser/' + $("#serPartId").text() + '/part-total-counter', function() {
        });
        partTotalCounterLoaded = true;
    }
}

function errorPartTotalCounterLoaded() {
    $("#partTotalCounter div").text("Internal communication error.");
}

$(document).ready(function() {
    // init tab navigation
    $("#tabbarInfoForItem").tabnav();

    initTaskIntervalTable();
    initInstCountersTable();
    initCompOpCountersTable();

});
