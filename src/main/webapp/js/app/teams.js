$(document).ready(function() {
    initTabMaintListGrid();
});

var oDefectsColNames = [ 'Team', 'Games', 'Points', 'id' ];

var oDefectsColModel = [ {
    name : 'name',
    index : 'name',
    align : 'left',
    sortable : true,
    width : 85
}, {
    name : 'games',
    index : 'games',
    sortable : true,
   
    sorttype : 'int',
    stype : 'int'
}, {
    name : 'points',
    index : 'points',
    sortable : true,
   
    sorttype : 'int',
    stype : 'int'
}, {
    name : 'id',
    index : 'id',
    sortable : false,
    hidden : true,
    key : true,
    width : 1
} ];

function initTabMaintListGrid() {
    var grid = $('#overview-teams-grid');

    grid.jqGrid({
        autowidth : true,
        shrinkToFit : true,
        url : contextPath + '/teams/grid',
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
        colNames : oDefectsColNames,
        colModel : oDefectsColModel,
        sortname : 'Text',
        sortorder : 'asc',
        pager : '#overview-teams-grid-pager',
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
                requestedPage = parseInt($("#overview-teams-grid-pager.ui-pg-input").val());
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
            // if (grid.getGridParam("records") == 0) {
            // grid.addRowData("blankRow", {
            // "complaintNo" : "No data were found"
            // });
            //
            // }
        }

    });

    /* css fixes */
    jQuery('#overview-teams-grid-pager' + " .ui-pg-selbox").closest("td").before('<td style="padding-left:20px;" dir="ltr">Tablesize </td>');
    jQuery('#overview-teams-grid-pager' + ' option:last').text("all");

};