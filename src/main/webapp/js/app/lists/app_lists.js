$.extend(jQuery.jgrid.defaults, {
    prmNames : {
        page : "pageIdx",
        rows : "pageSize",
        sort : "sortCol",
        order : "sortDirection"
    }

});

function initSearchDataGrid(url, colNames, colModel, sortname, sortorder, gridname, gridpager) {

    var grid = $(gridname);

    grid.jqGrid({
        autowidth : true,
        shrinkToFit : true,
        url : url,
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
        colNames : colNames,
        colModel : colModel,
        rowNum : 50,
        rowList : [ 50, 100, 200, 999999 ],
        pager : gridpager,
        sortname : sortname,
        sortorder : sortorder,
        viewrecords : true,
        height : 'auto',
        gridview : true,
        altRows : true,
        altclass : 'gridAltRowClass',
        multiselect : false,
        subGrid : false,
        caption : false,
        onPaging : function(pgButton) {
            var requestedPage = 1;
            if (pgButton == "user") {
                requestedPage = parseInt($(gridpager + " .ui-pg-input").val());
            } else {
                requestedPage = parseInt(grid.getGridParam("page"));
            }

            var lastPage = parseInt(grid.getGridParam("lastpage"));

            if (requestedPage > lastPage) {
                grid.setGridParam({
                    page : lastPage
                }).trigger("reloadGrid");
            }
        }

    });

    /* css fixes */
    jQuery(gridpager + " .ui-pg-selbox").closest("td").before('<td style="padding-left:20px;" dir="ltr">Tablesize </td>');
    jQuery(gridpager + ' option:last').text("all");
};

