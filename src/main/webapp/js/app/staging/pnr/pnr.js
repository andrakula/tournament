$.extend(jQuery.jgrid.defaults, {
    prmNames : {
        page : "pageIdx",
        rows : "pageSize",
        sort : "sortCol",
        order : "sortDirection"
    }
});

$(document).ready(function() {

    $('#pnrDetailsTab').tabnav();

    initTabPnrGeneralListGrid();

});

var pnrGridId = 'pnr-tabGeneralList-grid';

var maintListColNames = [ 'SER', 'A/C Reg', 'ESN', 'Position', 'Installation Date' ];

var maintListColModel = [ {
    name : 'ser',
    index : 'serial',
    sortable : true,
    align : 'left',
    width : 25,
    sorttype : function(cellObj, rowObj) {
        return sortStrNullsLast(pnrGridId, cellObj, rowObj);
    }
}, {
    name : 'ac',
    index : 'airCraft',
    sortable : true,
    align : 'left',
    width : 20,
    formatter : acRegLinkFormatter,
    sorttype : function(cellObj, rowObj) {
        return sortStrNullsLast(pnrGridId, cellObj, rowObj);
    }
}, {
    name : 'esn',
    index : 'engineApu',
    sortable : true,
    align : 'left',
    sorttype : 'number',
    width : 15,
    sorttype : function(cellObj, rowObj) {
        return sortStrNullsLast(pnrGridId, cellObj, rowObj);
    }
}, {
    name : 'posLocation',
    index : 'position, location',
    sortable : true,
    align : 'left',
    width : 95,
    sorttype : function(cellObj, rowObj) {
        return sortStrNullsLast(pnrGridId, cellObj, rowObj);
    }
}, {
    name : 'installationDate',
    index : 'installationDate',
    sortable : true,
    width : 20,
    formatter : 'date',
    formatoptions : {
        srcformat : 'd-M-Y',
        newformat : 'd-M-Y'
    },
    sorttype : function(cellObj, rowObj) {
        return sortDateNullsLast(pnrGridId, cellObj, rowObj);
    },
    stype : 'date'
} ];

function initTabPnrGeneralListGrid() {

    var pnrid = $("#pnrView").data("pnrid");

    var grid = $('#pnr-tabGeneralList-grid');
    grid.jqGrid({
        autowidth : true,
        shrinkToFit : true,
        url : contextPath + '/app/staging/pnr/' + pnrid + '/tabPnrGeneral',
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
        colNames : maintListColNames,
        colModel : maintListColModel,
        sortname : 'serial',
        sortorder : 'desc',
        pager : '#pnr-tabGeneralList-grid-pager',
        rowNum : 50,
        rowList : [ 50, 100, 200 ],
        viewrecords : true,
        height : 'auto',
        gridview : true,
        altRows : true,
        altclass : 'gridAltRowClass'

    });
};

function acRegLinkFormatter(cellvalue, options, rowObject) {

    if (cellvalue != null) {
        return '<a href="' + contextPath + '/app/groundtime/detail/ac/' + cellvalue + '" target="_self">' + cellvalue + '</a>';
    }
    return ''; // PNR is not rendered on view because of missing pnrID
}