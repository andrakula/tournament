$(document).ready(function() {
    // $('#maintTaskId').tabnav();

    var openTabIdvalue = $('#openTabId').val();

    $("#maintTaskId").tabnav({
        openTabId : (openTabIdvalue === "") ? "tabMaintList" : openTabIdvalue
    // "tabMtcActivity"
    });

    initTabMaintListGrid();
});

var mainttaskGridId = 'mainttask-tabMaintList-grid';

var maintListColNames = [ 'Status', 'Object', 'Workorder', 'Step', 'PNR', 'PNRID', 'SER', 'Next Due FC', 'Next Due FH', 'Next Due Date',
        'Planned Workorder Package', 'History', 'Id', 'groundTimeId', 'groundTimeIdInInfo' ];

var maintListColModel = [ {
    name : 'status',
    index : 'status',
    sortable : true,
    width : 40,
    formatter : statusFormatter,
    align : 'left'
}, {
    name : 'acReg',
    index : 'acReg',
    sortable : true,
    align : 'left',
    width : 50,
    formatter : acRegLinkFormatter,
    sorttype : function(cellObj, rowObj) {
        return sortStrNullsLast(mainttaskGridId, cellObj, rowObj);
    }
}, {
    name : 'workOrder',
    index : 'workOrder',
    sortable : true,
    align : 'left',
    width : 80,
    sorttype : function(cellObj, rowObj) {
        return sortStrNullsLast(mainttaskGridId, cellObj, rowObj);
    },
    formatter : workOrderF40ReportLinkFormatter
}, {
    name : 'step',
    index : 'step',
    sortable : false,
    align : 'left',
    width : 30,
    sorttype : function(cellObj, rowObj) {
        return sortIntNullsLast(mainttaskGridId, cellObj, rowObj);
    }
}, {
    name : 'pnr',
    index : 'pnr',
    sortable : true,
    align : 'left',
    width : 70,
    formatter : pnrLinkFormatter,
    sorttype : function(cellObj, rowObj) {
        return sortStrNullsLast(mainttaskGridId, cellObj, rowObj);
    }
}, {
    name : 'pnrID',
    index : 'pnrID',
    hidden : true
}, {
    name : 'ser',
    index : 'ser',
    sortable : true,
    align : 'left',
    width : 70,
    sorttype : function(cellObj, rowObj) {
        return sortStrNullsLast(mainttaskGridId, cellObj, rowObj);
    }
}, {
    name : 'nextDueFC',
    index : 'nextDueFC',
    sortable : true,
    align : 'left',
    sorttype : 'int',
    width : 90,
    sorttype : function(cellObj, rowObj) {
        return sortIntNullsLast(mainttaskGridId, cellObj, rowObj);
    }
}, {
    name : 'nextDueFH',
    index : 'nextDueFH',
    sortable : true,
    align : 'left',
    sorttype : 'number',
    width : 90,
    sorttype : function(cellObj, rowObj) {
        return sortIntNullsLast(mainttaskGridId, cellObj, rowObj);
    }
}, {
    name : 'nextDueDateStr',
    index : 'nextDueDateStr',
    sortable : true,
    align : 'left',
    width : 90,
    formatter : 'date',
    formatoptions : {
        srcformat : 'd-M-Y',
        newformat : 'd-M-Y'
    },
    sorttype : function(cellObj, rowObj) {
        return sortDateNullsLast(mainttaskGridId, cellObj, rowObj);
    },
    stype : 'date'
}, {
    name : 'planWoPackage',
    index : 'planWoPackage',
    sortable : true,
    align : 'left',
    formatter : planWoPackageLinkFormatter,
    sorttype : function(cellObj, rowObj) {
        return sortIntNullsLast(mainttaskGridId, cellObj, rowObj);
    }
}, {
    name : 'hasHistory',
    index : 'hasHistory',
    sortable : false,
    align : 'center',
    classes : 'data-grid-cell',
    formatter : historyLinkFormatter
}, {
    name : 'id',
    index : 'id',
    key : true,
    sortable : false,
    hidden : true,
    width : 1
}, {
    name : 'groundTimeId',
    index : 'groundTimeId',
    key : false,
    sortable : false,
    hidden : true,
    width : 1
}, {
    name : 'groundTimeIdInInfo',
    index : 'groundTimeIdInInfo',
    key : true,
    sortable : false,
    width : 1,
    hidden : true
} ];

function workOrderF40ReportLinkFormatter(cellvalue, options, rowObject) {
    var result = cellvalue;
    var maintTaskType = $('#maintTaskType').val();

    if (cellvalue === null || cellvalue === '') {
        result = "";
    } else if (maintTaskType === 'MS' || maintTaskType === 'EO') {
        var f40ReportParams = {
            workNo : cellvalue,
            stepNo : rowObject.step,
            acReg : rowObject.acReg
        };
        result = '<a href="' + contextPath + '/app/f40?' + $.param(f40ReportParams) + '" target="_blank" title="' + cellvalue + '">' + cellvalue +
                '</a>';
    }
    return result;
};

function initTabMaintListGrid() {

    var maintTaskNr = $('#maintTaskNr').val();
    var taskId = $('#taskId').val();
    var maintTaskType = $('#maintTaskType').val();

    var grid = $('#mainttask-tabMaintList-grid');
    grid.jqGrid({
        autowidth : true,
        shrinkToFit : true,
        url : contextPath + '/app/staging/mainttask/' + taskId + '/type/' + maintTaskType + '/number/' + maintTaskNr + '/tabMaintList',
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
        colNames : maintListColNames,
        colModel : maintListColModel,
        sortname : 'status',
        sortorder : 'asc',
        pager : '#mainttask-tabMaintList-grid-pager',
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
                requestedPage = parseInt($("#mainttask-tabMaintList-grid-pager .ui-pg-input").val());
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
                    "status" : "No data were found"
                });

            }
        }

    });
    /* css fixes */
    jQuery('#mainttask-tabMaintList-grid-pager' + " .ui-pg-selbox").closest("td").before('<td style="padding-left:20px;" dir="ltr">Tablesize </td>');
    jQuery('#mainttask-tabMaintList-grid-pager' + ' option:last').text("all");

};

function statusFormatter(cellvalue, options, rowObject) {
    return '<div class="status-column-icon status-column-icon-' + cellvalue +
            '" style="display:block !important; float: left; margin-left: 7px;"></div>';
}

function planWoPackageLinkFormatter(cellvalue, options, rowObject) {
    if (cellvalue != null && typeof (cellvalue) != 'undefined') {
        if (rowObject.groundTimeId != null && rowObject.groundTimeId != 0) {
            if (rowObject.groundTimeIdInInfo) {
                return '<a href="' + contextPath + '/app/groundtime/detail/' + rowObject.groundTimeId +
                        '" target="_self" title="Open Maintenance Activity for Groundtime ID [' + rowObject.groundTimeId + ']">' + cellvalue + '</a>';
            }
        }
        return cellvalue;
    }
    return '';
}

function historyLinkFormatter(cellvalue, options, rowObject) {
    // var acReg = $("#acReg").val();
    if (cellvalue && parseInt(cellvalue) != 0) {
        return '<a href="' + contextPath + '/app/groundtime/mdlHistory/' + $('#maintTaskType').val() + '/' + cellvalue + "/" + rowObject.acReg +
                '" target="_blank" title="open MDL History"><img src="' + contextPath + '/resources/img/lhticonset/copy_16.png"/></a>';
    }
    return '';
}

function pnrLinkFormatter(cellvalue, options, rowObject) {

    if (cellvalue != null && parseInt(rowObject['pnrID']) != 0) {
        return '<a href="' + contextPath + '/app/staging/pnr/' + rowObject['pnrID'] + '" target="_self">' + cellvalue + '</a>';
    }
    return ''; // PNR is not rendered on view because of missing pnrID
}

function acRegLinkFormatter(cellvalue, options, rowObject) {

    if (cellvalue != null) {
        return '<a href="' + contextPath + '/app/groundtime/detail/ac/' + cellvalue + '" target="_self">' + cellvalue + '</a>';
    }
    return ''; // PNR is not rendered on view because of missing pnrID
}
