var assemblyGridId = 'eassembly-grid';

var eassemblyColNames = [ 'Status', 'Title', 'Position', 'SER', 'SERID', 'PNR', 'PNRID', 'FSCM', 'Inst. Date', 'MFR Date', 'Sched. Removal', 'Id' ];

var eassemblyColModel = [ {
    name : 'status',
    index : 'status',
    sortable : true,
    width : 42,
    formatter : statusFormatter,
    sorttype : 'int',
    stype : 'int'
}, {
    name : 'title',
    index : 'title',
    sortable : true,
    width : 100,
    align : 'left'
}, {
    name : 'position',
    index : 'position',
    sortable : true,
    width : 220,
    align : 'left',
}, {
    name : 'ser',
    index : 'ser',
    sortable : true,
    width : 70,
    formatter : serLinkFormatter,
    align : 'left'
}, {
    name : 'serId',
    index : 'serId',
    hidden : true,
    hidedlg : true
}, {
    name : 'pnr',
    index : 'pnr',
    sortable : true,
    width : 70,
    formatter : pnrLinkFormatter,
    align : 'left'
}, {
    name : 'pnrId',
    index : 'pnrId',
    hidden : true,
    hidedlg : true
}, {
    name : 'fscm',
    index : 'fscm',
    sortable : true,
    align : 'left',
    width : 115
}, {
    name : 'installationDateString',
    index : 'installationDateString',
    sortable : true,
    align : 'left',
    formatter : 'date',
    formatoptions : {
        srcformat : 'd-M-Y',
        newformat : 'd-M-Y'
    },
    width : 55
}, {
    name : 'manufactoringDateString',
    index : 'manufactoringDateString',
    sortable : true,
    align : 'left',
    width : 55,
    formatter : 'date',
    formatoptions : {
        srcformat : 'd-M-Y',
        newformat : 'd-M-Y'
    }
}, {
    name : 'minExpDateString',
    index : 'minExpDateString',
    sortable : true,
    align : 'left',
    width : 80,
    formatter : 'date',
    formatoptions : {
        srcformat : 'd-M-Y',
        newformat : 'd-M-Y'
    },
    stype : 'date'
}, {
    name : 'id',
    index : 'id',
    key : true,
    sortable : false,
    hidden : true,
    width : 1,
    hidedlg : true
} ];

function statusFormatter(cellvalue, options, rowObject) {
    return '<div class="status-column-icon status-column-icon-' + cellvalue +
            '" style="display:block !important; float: left; margin-left: 7px;"></div>';
}

function pnrLinkFormatter(cellvalue, options, rowObject) {

    if (cellvalue != null && parseInt(rowObject['pnrId']) != 0) {
        return '<a href="' + contextPath + '/app/staging/pnr/' + rowObject['pnrId'] + '" target="_self">' + cellvalue + '</a>';
    }
    return ''; // PNR is not rendered on view because of missing pnrID
}

function serLinkFormatter(cellvalue, options, rowObject) {

    if (cellvalue != null && parseInt(rowObject['serId']) != 0) {
        return '<a href="' + contextPath + '/app/staging/ser/' + rowObject['serId'] + '/general" target="_self">' + cellvalue + '</a>';
    }
    return ''; // SER is not rendered on view because of missing pnrID
}

// "global" variables
var rtime = new Date(1, 1, 2000, 12, 00, 00);
var timeout = false;
var delta = 200;
var resizeEnd = new Date();

var assemblyFilterAlredyInitialised = false;

var initassemblyHeight = 80;

function initEngineTabAssembly() {
    var esn = $("#esn").val();
    var grid = $("#eassembly-grid");

    grid.jqGrid({
        autowidth : true,
        shrinkToFit : true,
        url : contextPath + '/app/staging/engine/' + esn + '/assembly/grid',
        datatype : 'json',
        mtype : 'POST',
        postData : createPostData(),
        jsonReader : {
            page : "pageIdx",
            total : "totalPages",
            records : "totalRecords",
            root : "data",
            repeatitems : false,
            id : "0"
        },
        search : true,
        // loadonce : true,
        colNames : eassemblyColNames,
        colModel : eassemblyColModel,
        rowNum : 50,
        rowList : [ 50, 100, 200 ],
        pager : '#eassembly-grid-pager',
        sortname : 'status',
        sortorder : 'asc',
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
        },
        gridComplete : function() {
            initEngineAssemblyFilter();
            setAssemblyColumnHeaderTooltip('fscm', 'Manufacturer | Manufacturer Code');
            setAssemblyColumnHeaderTooltip('instFh', 'Installation OH');
            setAssemblyColumnHeaderTooltip('instFc', 'Installation OC');
            setAssemblyColumnHeaderTooltip('manufactoringDateString', 'Manufacture Date');
            setAssemblyColumnHeaderTooltip('componentType', 'Component Type');
            setAssemblyColumnHeaderTooltip('installationDateString', 'Installation Date');
            // resizeassemblyToolbar();
        }

    });

    /* css fixes */
    jQuery('#eassembly-grid-pager .ui-pg-selbox').closest("td").before('<td style="padding-left:20px;" dir="ltr">Tablesize </td>');

};

function createPostData() {

    var grid = $("#eassembly-grid");

    var postData = {};

    postData['statuses'] = createRequestString('#eafilter-status');
    postData['pnrs'] = createRequestString('#eafilter-pnr');
    postData['sers'] = createRequestString('#eafilter-ser');
    postData['sortCol'] = grid.jqGrid('getGridParam', 'sortname');
    postData['sortDirection'] = grid.jqGrid('getGridParam', 'sortorder');
    postData['sortCol'] = grid.jqGrid('getGridParam', 'sortname');
    postData['sortDirection'] = grid.jqGrid('getGridParam', 'sortorder');

    return postData;
}

/**
 * add chosen elements by select box to the array and return it as string.
 * 
 * @param f - the id of the select box
 * @returns {String}
 */
function createRequestString(f) {

    var selectedValues = '';
    var dataArray = $(f).val();

    var totalItems = dataArray.length;

    for (var i = 0; i < totalItems; i++) {

        if (dataArray.length > 0) {
            selectedValues += dataArray[i];
        }
    }
    return selectedValues;
};

// Sets a new title name
function setAssemblyColumnHeaderTooltip(columnName, tooltip) {
    $('#eassembly-grid').setLabel(columnName, '', '', {
        'title' : tooltip
    });
}

function initEngineAssemblyFilter() {

    if (!assemblyFilterAlredyInitialised) {

        setTimeout(function() {
            $("#eafilter-status").select2({
                ajax : {
                    url : contextPath + "/app/staging/engine/" + $("#esn").val() + "/filter/Status",
                    dataType : 'json',
                    data : function(term, page) {
                        return {
                            query : term
                        };
                    },
                    results : function(data, page) {
                        return {
                            results : data
                        };
                    }
                },
                width : 150,
                placeholder : "Status",
                multiple : true
            }).bind("change", function() {
                assemblyFilterAttributesChanged();
            });

        }, 50);

        setTimeout(function() {
            $("#eafilter-pnr").select2({
                ajax : {
                    url : contextPath + "/app/staging/engine/" + $("#esn").val() + "/filter/Pnr",
                    dataType : 'json',
                    data : function(term, page) {
                        return {
                            query : term
                        };
                    },
                    results : function(data, page) {
                        return {
                            results : data
                        };
                    }
                },
                width : 150,
                placeholder : "PNR",
                multiple : true
            }).bind("change", function() {
                assemblyFilterAttributesChanged();
            });

        }, 150);

        setTimeout(function() {
            $("#eafilter-ser").select2({
                minimumInputLength : 2, // suche ab 2 chars wegen schlechter
                ajax : {
                    url : contextPath + "/app/staging/engine/" + $("#esn").val() + "/filter/Ser",
                    dataType : 'json',
                    data : function(term, page) {
                        return {
                            query : term
                        };
                    },
                    results : function(data, page) {
                        return {
                            results : data
                        };
                    }
                },
                width : 120,
                placeholder : "SER",
                multiple : true
            }).bind("change", function() {
                assemblyFilterAttributesChanged();
            });
        }, 300);

        assemblyFilterAlredyInitialised = true;

    }
    setTimeout(function() {
        $("#eassembly-toolbar-content").fadeIn('fast');
    }, 500);

}

function getAssemblyGridStatusValues(columnName) {

    var columnData = getColumnData(columnName);

    var result = $.map(_.uniq(columnData), function(value) {
        var valueText;
        if (value == 1) {
            valueText = 'red';
        } else if (value == 2) {
            valueText = 'yellow';
        } else {
            valueText = 'green';
        }
        return {
            'id' : value,
            'text' : valueText
        };
    });
    return result;
};

function getAssemblyGridATAValues(columnName) {

    var columnData = getATAColumnData(columnName);

    var result = $.map(_.uniq(columnData), function(value) {
        return {
            'id' : value,
            'text' : value + ""
        };
    });
    return result;
};

function assemblyFilterAttributesChanged() {

    setTimeout(function() {
        changeEngineAssemblyToolbarHeightOnFilter();
    }, 200);

    var grid = $("#eassembly-grid");

    grid.setGridParam({
        postData : createPostData()
    }).trigger("reloadGrid", [ {
        page : 1
    } ]);

};

function changeEngineAssemblyToolbarHeightOnFilter() {
    var assemblyHeigt = initassemblyHeight - 20 + Math.max.apply(null, $(".select2-container").map(function() {
        return $(this).height();
    }).get());

    $("#eassembly-toolbar").css("height", assemblyHeigt);
}