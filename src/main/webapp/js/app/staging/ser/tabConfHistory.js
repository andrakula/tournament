var confHistoryColNames = [ 'Sequence', 'Type', 'Installation Date', 'Form 1', 'Installation Counter', 'Removal Date', 'Removal Counter',
        'Configuration', 'Id' ];

var confHistoryColModel = [ {
    name : 'sequence',
    index : 'sequence',
    width : 120,
    classes : 'defects-grid-cell',
    sortable : false
}, {
    name : 'type',
    index : 'type',
    width : 70,
    sortable : false
}, {
    name : 'installDate',
    index : 'installDate',
    width : 165,
    sortable : false
}, {
    name : 'form1',
    index : 'form1',
    width : 100,
    sortable : false
}, {
    name : 'installationCounter',
    index : 'installationCounter',
    width : 75,
    sortable : false
}, {
    name : 'removalDate',
    index : 'removalDate',
    width : 75,
    sortable : false
}, {
    name : 'removalCounter',
    index : 'removalCounter',
    width : 75,
    sortable : false
}, {
    name : 'configuration',
    index : 'configuration',
    width : 80,
    sortable : false
}, {
    name : 'id',
    index : 'id',
    hidden : true,
    key : true,
    width : 1
} ];

function initTabConfHistory() {

    initTabConfHistoryGrid();

};

function initTabConfHistoryGrid() {
    var grid = $('#conf-history-grid');

    $('#conf-history-grid').jqGrid({
        url : contextPath + '/app/staging/ser-details/inst-conf-history',
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
        autowidth : true,
        shrinkToFit : true,
        colNames : confHistoryColNames,
        colModel : confHistoryColModel,
        rowNum : 20,
        rowList : [ 20, 50, 999999 ],
        pager : '#conf-history-grid-pager',
        viewrecords : true,
        height : 'auto',
        gridview : true,
        altRows : true,
        altclass : 'gridAltRowClass',
        onPaging : function(pgButton) {
            var requestedPage = 1;
            if (pgButton == "user") {
                requestedPage = parseInt($("#conf-history-grid-pager .ui-pg-input").val());
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
                    "sequence" : "No data were found"
                });

            }
        }

    });
    /* css fixes */
    jQuery('#conf-history-grid-pager' + " .ui-pg-selbox").closest("td").before('<td style="padding-left:20px;" dir="ltr">Tablesize </td>');
    jQuery('#conf-history-grid-pager' + ' option:last').text("all");

};

