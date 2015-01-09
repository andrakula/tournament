$.extend(jQuery.jgrid.defaults, {
    prmNames : {
        page : "pageIdx",
        rows : "pageSize",
        sort : "sortCol",
        order : "sortDirection"
    }
});

var maintHistoryColNames = [ 'Accomp. Date', 'OH', 'OC', 'Task Required', 'Task Performed', 'Old PNR', 'Description', 'Removal Reason Code', 'Fault',
        'Findings', 'Action', 'Workshopreport', 'Id' ];

var maintHistoryColModel = [ {
    name : 'accompDate',
    index : 'accompDate',
    width : 70,
    align : 'left',
    formatter : 'date',
    formatoptions : {
        srcformat : 'd-M-Y',
        newformat : 'd-M-Y'
    },
    sorttype : function(cellObj, rowObj) {
        return sortDateNullsLast('maint-history-grid', cellObj, rowObj);
    }
}, {
    name : 'accompFH',
    index : 'accompFH',
    width : 30,
    align : 'left',
    sorttype : function(cellObj, rowObj) {
        return sortIntNullsLast('maint-history-grid', cellObj, rowObj);
    },
    stype : 'number',
    sortable : true
}, {
    name : 'accompFC',
    index : 'accompFC',
    width : 30,
    align : 'left',
    stype : 'int',
    sorttype : function(cellObj, rowObj) {
        return sortIntNullsLast('maint-history-grid', cellObj, rowObj);
    }
}, {
    name : 'taskRequired',
    index : 'taskRequired',
    width : 70,
    align : 'left',
    sorttype : function(cellObj, rowObj) {
        return sortStrNullsLast('maint-history-grid', cellObj, rowObj);
    }
}, {
    name : 'taskPerformed',
    index : 'taskPerformed',
    width : 75,
    align : 'left',
    sorttype : function(cellObj, rowObj) {
        return sortStrNullsLast('maint-history-grid', cellObj, rowObj);
    }
}, {
    name : 'oldPnr',
    index : 'oldPnr',
    width : 60,
    align : 'left',
    sorttype : function(cellObj, rowObj) {
        return sortStrNullsLast('maint-history-grid', cellObj, rowObj);
    }
}, {
    name : 'description',
    index : 'description',
    width : 120,
    align : 'left',
    sorttype : function(cellObj, rowObj) {
        return sortStrNullsLast('maint-history-grid', cellObj, rowObj);
    }
}, {
    name : 'removalReason',
    index : 'removalReason',
    width : 90,
    align : 'left',
    sorttype : function(cellObj, rowObj) {
        return sortStrNullsLast('maint-history-grid', cellObj, rowObj);
    }
}, {
    name : 'fault',
    index : 'fault',
    width : 40,
    align : 'left',
    sorttype : function(cellObj, rowObj) {
        return sortStrNullsLast('maint-history-grid', cellObj, rowObj);
    }
}, {
    name : 'finding',
    index : 'finding',
    width : 90,
    align : 'left',
    sorttype : function(cellObj, rowObj) {
        return sortStrNullsLast('maint-history-grid', cellObj, rowObj);
    }
}, {
    name : 'action',
    index : 'action',
    width : 90,
    align : 'left',
    sorttype : function(cellObj, rowObj) {
        return sortStrNullsLast('maint-history-grid', cellObj, rowObj);
    }
}, {
    name : 'attachment',
    index : 'attachment',
    width : 70,
    formatter : attachmentFormatter,
    align : 'center',
    sortable : false
}, {
    name : 'id',
    index : 'id',
    key : true,
    sortable : false,
    width : 1,
    hidden : true
} ];

function initTabMaintHistory() {

    initTabMaintHistoryGrid();

};

function attachmentFormatter(cellvalue, options, rowObject) {
    if (rowObject.sequenceNo != null) {
        return '<a class="mdl-history-attachment" href="' + contextPath + '/app/staging/mdl/history/' + rowObject.sequenceNo +
                '/marchive/" target="_blank" title="show workshop report"><img src="' + contextPath + '/resources/img/lhticonset/copy_16.png"/></a>';
    }
    return '';
}

function initTabMaintHistoryGrid() {
    var grid = $('#maint-history-grid');
    grid.jqGrid({
        autowidth : true,
        shrinkToFit : true,
        url : contextPath + '/app/staging/ser/' + $("#serPartId").text() + '/maint-history',
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
        postData : {
            ser : $("#serialNumber").text(),
            pnr : $("#partNumber").text()
        },
        colNames : maintHistoryColNames,
        colModel : maintHistoryColModel,
        pager : '#maint-history-grid-pager',
        rowNum : 20,
        rowList : [ 20, 50, 999999 ],
        viewrecords : true,
        height : 'auto',
        gridview : true,
        altRows : true,
        loadonce : true,
        altclass : 'gridAltRowClass',
        onPaging : function(pgButton) {
            var requestedPage = 1;
            if (pgButton == "user") {
                requestedPage = parseInt($("#maint-history-grid-pager .ui-pg-input").val());
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
                    "zzttOphrs" : "No data were found"
                });

            }
        }

    });
    /* css fixes */
    jQuery('#maint-history-grid-pager' + " .ui-pg-selbox").closest("td").before('<td style="padding-left:20px;" dir="ltr">Tablesize </td>');
    jQuery('#maint-history-grid-pager' + ' option:last').text("all");

};

