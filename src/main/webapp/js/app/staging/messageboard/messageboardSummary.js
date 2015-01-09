var oMbColNames = [ 'Status', 'Sum', 'Reason', 'id' ];

var oMbColModel = [ {
    name : 'status',
    index : 'status',
    sortable : true,
    width : 90,
    formatter : statusFormatter,
    sorttype : 'int',
    align : 'left',
    stype : 'int'
}, {
    name : 'counter',
    index : 'counter',
    sortable : true,
    align : 'left',
    width : 90,
    sorttype : 'int',
    stype : 'int'
}, {
    name : 'reason',
    index : 'reason',
    sortable : true,
    align : 'left',
    width : 300
}, {
    name : 'id',
    index : 'id',
    sortable : false,
    hidden : true,
    key : true,
    width : 1
} ];

function statusFormatter(cellvalue, options, rowObject) {
    return '<div class="status-column-icon status-column-icon-' + cellvalue +
            '" style="display:block !important; float: left; margin-left: 7px;"></div>';
}

function initMessageBoardSummary(urlString) {
    // var acReg = $('#acReg').val();
    var grid = $('#overview-mbentries-grid');

    grid.jqGrid({
        autowidth : false,
        shrinkToFit : true,
        url : contextPath + urlString,
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
        colNames : oMbColNames,
        colModel : oMbColModel,
        sortname : 'Status',
        sortorder : 'asc',
        pager : '#overview-mbentries-grid-pager',
        rowNum : 5,
        rowList : [ 5, 10, 20, 50, 999999 ],
        viewrecords : true,
        height : 'auto',
        gridview : true,
        altRows : true,
        altclass : 'gridAltRowClass',
        onPaging : function(pgButton) {
            var requestedPage = 1;
            if (pgButton == "user") {
                requestedPage = parseInt($("#overview-mbentries-grid-pager.ui-pg-input").val());
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
        }

    });

    /* css fixes */
    jQuery('#overview-mbentries-grid-pager' + " .ui-pg-selbox").closest("td").before('<td style="padding-left:20px;" dir="ltr">Tablesize </td>');
    jQuery('#overview-mbentries-grid-pager' + ' option:last').text("all");

};