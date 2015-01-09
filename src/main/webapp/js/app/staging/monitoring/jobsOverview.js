function statusFormatter(cellvalue, options, rowObject) {
    var result = cellvalue;
    if (cellvalue === "FAILED") {
        result = '<span style="color:red;">' + cellvalue + '</span>';
    }
    return result;
}

$(document).ready(function() {

    tableToGrid(("#oracle-jobs"), {
        autowidth : true,
        shrinkToFit : true,
        colNames : [ 'Job Name', 'Last Rund Date', 'Next Run Date', 'Repeat Interval', 'Run Duration', 'CPU Used', 'Status', 'Addtional Info' ],
        colModel : [ {
            name : 'col1',
            index : 'col1',
            sortable : false,
            width : 170
        }, {
            name : 'col2',
            index : 'col2',
            sortable : false,
            width : 120
        }, {
            name : 'col3',
            index : 'col3',
            sortable : false,
            width : 120
        }, {
            name : 'col4',
            index : 'col4',
            sortable : false,
            width : 200
        }, {
            name : 'col5',
            index : 'col5',
            sortable : false,
            width : 100
        }, {
            name : 'col6',
            index : 'col6',
            sortable : false,
            width : 100

        }, {
            name : 'col7',
            index : 'col7',
            sortable : false,
            width : 100,
            formatter : statusFormatter
        }, {
            name : 'col8',
            index : 'col8',
            sortable : false,
            width : 150
        } ],
        viewrecords : true,
        height : 'auto',
        gridview : true,
        altRows : true,
        altclass : 'gridAltRowClass',
        multiselect : false,
        subGrid : false,
        caption : false,
        pager : '#oracle-jobs-grid-pager',
        rowList : [], // disable page size dropdown
        pgbuttons : false, // disable page control like next, back button
        pgtext : null,
        viewrecords : true,
        recordtext : 'Total: {2}'
    });

    tableToGrid(("#matviews"), {
        autowidth : true,
        shrinkToFit : true,
        colNames : [ 'Refresh Group', 'Matview Name', 'DB-Link', 'Last Refresh Type', 'Last Refresh Date' ],
        colModel : [ {
            name : 'col1',
            index : 'col1',
            sortable : false,
            width : 120
        }, {
            name : 'col2',
            index : 'col2',
            sortable : false,
            width : 120
        }, {
            name : 'col3',
            index : 'col3',
            sortable : false,
            width : 120
        }, {
            name : 'col4',
            index : 'col4',
            sortable : false,
            width : 120
        }, {
            name : 'col5',
            index : 'col5',
            sortable : false,
            width : 120
        } ],
        viewrecords : true,
        height : 'auto',
        gridview : true,
        altRows : true,
        altclass : 'gridAltRowClass',
        multiselect : false,
        subGrid : false,
        caption : false,
        pager : '#matviews-grid-pager',
        rowList : [], // disable page size dropdown
        pgbuttons : false, // disable page control like next, back button
        pgtext : null,
        viewrecords : true,
        recordtext : 'Total: {2}'

    });

});
