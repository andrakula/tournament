var mdlGridId = 'engine-mdl-grid';
var initGridData = null;

var pluckMany = function() {
    // get the property names to pluck
    var source = arguments[0];
    var propertiesToPluck = arguments[1];
    return _.map(source, function(item) {
        var obj = {};
        _.each(propertiesToPluck, function(property) {
            obj[property] = item[property];
        });
        return obj;
    });
};
_.mixin({
    'pluckMany' : pluckMany
});

var relatedColums = [ {
    'columnName' : 'History',
    'relatedTo' : [ 'Task-No' ]
} ];

var mdlColNames = [ 'Status', 'Type', 'Task-No', 'Task-Desc.', 'PNR', 'PNRID', 'SER', 'MO', 'Step', 'Next Due FC', 'Next Due FH', 'Next Due Date',
        'Est. Due Date', 'Fst.', 'MO Package', 'History', 'Id', 'techId', 'groundTimeId', 'serId', 'groundTimeIdInInfo' ];

var mdlColModel = [ {
    name : 'status',
    index : 'status',
    align : 'left',
    sortable : true,
    width : 40,
    formatter : statusFormatter,
    stype : 'int'
}, {
    name : 'taskType',
    index : 'taskType',
    sortable : true,
    align : 'left',
    width : 50
}, {
    name : 'taskNo',
    index : 'taskNo',
    sortable : true,
    width : 70,
    align : 'left',
    formatter : taskNoLinkFormatter
}, {
    name : 'taskDesc',
    index : 'taskDesc',
    sortable : true,
    hidden : true,
    width : 110,
    align : 'left'
}, {
    name : 'pnr',
    index : 'pnr',
    sortable : true,
    width : 70,
    align : 'left',
    formatter : pnrLinkFormatter
}, {
    name : 'pnrID',
    index : 'pnrID',
    align : 'left',
    hidden : true,
    hidedlg : true
}, {
    name : 'ser',
    index : 'ser',
    sortable : true,
    align : 'left',
    width : 70,
    formatter : serLinkFormatter
}, {
    name : 'workOrder',
    index : 'workOrder',
    sortable : true,
    width : 90,
    align : 'left',
    formatter : workOrderF40ReportLinkFormatter
}, {
    name : 'step',
    index : 'step',
    sortable : true,
    align : 'left',
    width : 40
}, {
    name : 'nextDueFc',
    index : 'nextDueFc',
    sortable : true,
    width : 65,
    align : 'left',
    stype : 'int'
}, {
    name : 'nextDueFH',
    index : 'nextDueFH',
    sortable : true,
    width : 65,
    align : 'left',
    stype : 'int'
}, {
    name : 'nextDueDateStr',
    index : 'nextDueDateStr',
    sortable : true,
    align : 'left',
    width : 75
}, {
    name : 'estDueDate',
    index : 'estDueDate',
    sortable : true,
    align : 'left',
    width : 75
}, {
    name : 'comesFirst',
    index : 'comesFirst',
    sortable : true,
    hidden : false,
    align : 'left',
    width : 20
}, {
    name : 'planWoPackage',
    index : 'planWoPackage',
    sortable : true,
    width : 105,
    align : 'left',
    formatter : planWoPackageLinkFormatter,
    stype : 'int'
}, {
    name : 'hasHistory',
    index : 'hasHistory',
    width : 50,
    align : 'center',
    classes : 'data-grid-cell',
    formatter : historyLinkFormatterAA
}, {
    name : 'id',
    index : 'id',
    key : true,
    sortable : false,
    hidden : true,
    width : 1,
    hidedlg : true
}, {
    name : 'techId',
    index : 'techId',
    key : false,
    sortable : false,
    hidden : true,
    width : 1,
    hidedlg : true
}, {
    name : 'groundTimeId',
    index : 'groundTimeId',
    key : false,
    sortable : false,
    hidden : true,
    width : 1,
    hidedlg : true
}, {
    name : 'serId',
    index : 'serId',
    key : false,
    sortable : false,
    hidden : true,
    width : 1,
    hidedlg : true
}, {
    name : 'groundTimeIdInInfo',
    index : 'groundTimeIdInInfo',
    key : true,
    sortable : false,
    width : 1,
    hidden : true
} ];

function statusFormatter(cellvalue, options, rowObject) {
    return '<div class="status-column-icon status-column-icon-' + cellvalue +
            '" style="display:block !important; float: left; margin-left: 7px;"></div>';
}

function planWoPackageLinkFormatter(cellvalue, options, rowObject) {
    if (cellvalue != null && typeof (cellvalue) != 'undefined') {
        if (rowObject.groundTimeId != null && rowObject.groundTimeId != 0) {
            if (rowObject.groundTimeIdInInfo) {
                return '<a href="' + contextPath + '/app/groundtime/detail/' + rowObject.groundTimeId +
                        '" target="_self" class="tooltip" title="Open Maintenance Activity for Groundtime ID [' + rowObject.groundTimeId + ']">' +
                        cellvalue + '</a>';
            }
        }
        return cellvalue;
    }
    return '';
}

function workOrderF40ReportLinkFormatter(cellvalue, options, rowObject) {
    var result = cellvalue;
    if (cellvalue === null || cellvalue === '') {
        result = "";
    } else if (rowObject.taskType === 'MS' || rowObject.taskType === 'EO') {
        var f40ReportParams = {
            workNo : cellvalue,
            stepNo : rowObject.step,
            acReg : $("#acReg").val()
        };

        result = '<a href="' + contextPath + '/app/f40?' + $.param(f40ReportParams) +
                '" target="_blank" class="tooltip" title="Download F40 Report">' + cellvalue + '</a>';
    }

    return result;
}

function historyLinkFormatterAA(cellvalue, options, rowObject) {
    var acReg = $("#acReg").val();
    if (cellvalue && parseInt(cellvalue) != 0) {
        return '<a href="' + contextPath + '/app/groundtime/mdlHistory/' + rowObject.taskType + '/' + cellvalue + "/" + acReg +
                '" target="_blank" class="tooltip" title="open MDL History"><img src="' + contextPath +
                '/resources/img/lhticonset/copy_16.png"/></a>';
    }
    return '';
}

function taskNoLinkFormatter(cellvalue, options, rowObject) {

    var tt = rowObject.taskType;

    if (typeof rowObject.taskType !== 'undefined' && rowObject.taskType !== null) {
        var t_t = tt.replace("-", "_");

        if (cellvalue != null) {
            var title = '';
            if (rowObject.taskDesc != null) {
                title = 'title="' + rowObject.taskDesc + '"';
            }
            return '<a ' + title + ' class="tooltip" href="' + contextPath + '/app/staging/mainttask/' + rowObject.techId + '/type/' + t_t +
                    '/number/' + cellvalue + '" target="_self">' + cellvalue + '</a>';
        }
    }

    return '';
}

function pnrLinkFormatter(cellvalue, options, rowObject) {

    if (cellvalue != null && parseInt(rowObject['pnrID']) != 0) {
        return '<a href="' + contextPath + '/app/staging/pnr/' + rowObject['pnrID'] + '" target="_self">' + cellvalue + '</a>';
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

var mdlFilterAlredyInitialised = false;

var initMdlHeight = 80;

function resigeGrids() {
    // other minWidth than in the groundtime_detail.jspx (normaly 1135) for
    // exact same look and feel
    var minWidth = 1230;

    doResizeJqGrid('#engine-mdl-grid', 'view-tables', minWidth);
    doResizeJqGrid('#data-grid', 'view-tables', minWidth);
    doResizeJqGrid('#defects-grid', 'view-tables', minWidth);
    doResizeJqGrid('#assembly-grid', 'view-tables', minWidth);

    function resizeEnd() {
        if (new Date() - rtime < delta) {
            setTimeout(resizeEnd, delta);
        } else {
            timeout = false;
        }
    }
}

$(document).ready(function() {

    resigeGrids();

    setTimeout(function() {
        resizeMdlToolbar();
    }, 250);

    $(window).on('resize', function(e) {
        resizeMdlToolbar();
        resigeGrids();

    });

});

function initbutton() {
    $('#exportMdlReport').click(function() {
        exportMdlReport();
    });
}

function resizeMdlToolbar() {
    var windowWidth = $(window).width(); // New width

    if (windowWidth < 1500) {
        initMdlHeight = 100;
    } else if (windowWidth >= 1500 && windowWidth < 1750) {
        initMdlHeight = 100;
    } else if (windowWidth >= 1750) {
        initMdlHeight = 60;
    }

    $("#mdl-toolbar").css("height", initMdlHeight);

}

function doResizeJqGrid(grid_id, div_id, minWidth) {
    width = ($(window).width());
    width = width * 0.95;
    if (minWidth > width) {
        width = minWidth;
    }
    $(grid_id).setGridWidth(width, true); // Back to original width
    $(grid_id).setGridWidth($(div_id).width(), true); // Resized to new width
    // as per window
}

/**
 * add filter and estimated parameter for request as MdlExportForm object.
 * 
 * @returns {___anonymous9640_9641}
 */
function createPostData() {

    var grid = $("#engine-mdl-grid");

    var postData = {};

    postData['chosenColumns'] = createRequestVisibleColNames();
    postData['sortCol'] = grid.jqGrid('getGridParam', 'sortname');
    postData['sortDirection'] = grid.jqGrid('getGridParam', 'sortorder');

    return postData;
}

function checkPostData(varName) {
    var ok = $.isNumeric($(varName).val().replace(',', '.'));
    if (!ok) {
        $(varName + 'B').addClass('error-estimate');
    } else {
        $(varName + 'B').removeClass('error-estimate');
    }
    return ok;
}

function initTabMdl() {

    var esn = $("#esn").val();
    var grid = $("#engine-mdl-grid");

    grid.jqGrid({
        autowidth : true,
        shrinkToFit : true,
        url : contextPath + '/app/staging/engine/' + esn + '/mdl',
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
        colNames : mdlColNames,
        colModel : mdlColModel,
        rowNum : 50,
        rowList : [ 50, 100, 200 ],
        pager : '#engine-mdl-grid-pager',
        sortname : 'estDueDate',
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
            if (initGridData == null) {
                initGridData = grid.jqGrid('getGridParam', 'data');
            }
            setEngineMdlColumnHeaderTooltip('workOrder', 'Maintenance Order');
            setEngineMdlColumnHeaderTooltip('estDueDate', 'Estimated Due Date');
            setEngineMdlColumnHeaderTooltip('planWoPackage', 'Maintenance Order Package');
        }

    });

    grid.jqGrid('navGrid', '#engine-mdl-grid-pager', {
        add : false,
        edit : false,
        del : false,
        search : false,
        refresh : false
    });

    $.extend(true, $.jgrid.col, {
        width : 450,
        msel_opts : {
            dividerLocation : 0.5
        },
        dialog_opts : {
            minWidth : 470,
            show : 'blind',
            hide : 'explode',
            draggable : false,
            modal : true,
            resizable : false,
            hide : {
                effect : "fade",
                duration : 150
            },
            open : function() {
                $(".ui-dialog-buttonpane button.ui-button.ui-widget").addClass('button standard');
                $(".ui-dialog-buttonpane button.ui-button.ui-widget:contains(Ok)").addClass('default');
                $('.ui-widget-overlay').css('position', 'fixed');
                $("#colchooser_engine-mdl-grid").prepend(
                        '<div id="colchooser_engine_mdl_grid_error" style="color:red; padding: 5px; height:25px;"><span></span></div>');
                setTimeout(function() {

                    $(document.body).on(
                            'DOMNodeInserted DOMNodeRemoved',
                            '#colchooser_engine-mdl-grid ul.selected.connected-list.ui-sortable',
                            function() {

                                setTimeout(function() {

                                    var selectedColums = $.map(
                                            $("#colchooser_engine-mdl-grid div.selected ul li.ui-state-default.ui-element:visible"), function(el) {
                                                return $(el).attr('title');
                                            });

                                    $.each($("#colchooser_engine-mdl-grid div.available ul li.ui-state-default.ui-element:hidden"), function() {
                                        selectedColums.push($(el).attr('title'));
                                    });

                                    var error = checkRelatedColumns(selectedColums);

                                    var okButtonObj = $(".ui-dialog-buttonpane button.ui-button.ui-widget:contains(Ok)");
                                    if (error.length > 0) {
                                        // show error message and disable ok
                                        // button
                                        $("#colchooser_engine_mdl_grid_error span").text(error).fadeIn('fast');
                                        okButtonObj.button('disable');
                                    } else {
                                        // hide error message and enable ok
                                        // button
                                        $("#colchooser_engine_mdl_grid_error span").fadeOut('fast').text('');
                                        okButtonObj.button('enable');
                                    }
                                }, 500);
                            });

                }, 500);

            },
            close : function() {
                $('.ui-widget-overlay').css('position', 'absolute');
                $(".column-chooser").remove();

            }
        }
    });

    grid.jqGrid('navButtonAdd', '#engine-mdl-grid-pager', {
        caption : "Columns",
        title : "Reorder Columns",
        onClickButton : function() {
            grid.jqGrid('columnChooser', {
                width : 460,
                height : 370,
                classname : "column-chooser",
                // msel_opts: {$.ui.multiselect.defaults},
                done : function(perm) {
                    if (perm) {
                        $('#engine-mdl-grid').jqGrid("remapColumns", perm, true);

                        doResizeJqGrid('#engine-mdl-grid', 'view-tables', 1230);
                        $('#engine-mdl-grid').setGridParam({
                            postData : createPostData()
                        }).trigger("reloadGrid", [ {
                            page : 1
                        } ]);

                    }
                }
            });

            $("#colchooser_" + $.jgrid.jqID(this.id) + " input.search").hide();
        }
    });

    grid.jqGrid('navButtonAdd', '#engine-mdl-grid-pager', {
        caption : "",
        buttonicon : "ui-icon-excel-small",
        title : "Excel Export",
        onClickButton : function() {
            exportMdlReport();
        }
    });

    /* css fixes */
    jQuery('#engine-mdl-grid-pager .ui-pg-selbox').closest("td").before('<td style="padding-left:20px;" dir="ltr">Tablesize </td>');

    initbutton();

};

// Sets a new title name
function setEngineMdlColumnHeaderTooltip(columnName, tooltip) {
    $('#engine-mdl-grid').setLabel(columnName, '', '', {
        'title' : tooltip
    });
}

function exportMdlReport() {
    var esn = $("#esn").val();

    $.fileDownload(contextPath + "/app/staging/engine/" + esn + "/mdl/export", {
        httpMethod : "POST",
        data : createPostData(),
        prepareCallback : function(url) {
            $('#tabMdlContent').block({
                message : '<h1>Generating report.</h1>'
            });
        }
    }).done(function() {
        $('#tabMdlContent').unblock();
    }).fail(function() {
        $('#tabMdlContent').unblock();
        alert("Problem occurred while generating the report!");
    });

    return false;

}

/**
 * this method is used by excelExport and does the same as
 * createRequestVisibleColNames(). But the order of chosen columns is NOT lost.
 * This is very important for excel export! in ths method.
 * 
 * @returns {String}
 */
function findChoosenColumns() {
    var columns = [];
    $.each($("tr.ui-jqgrid-labels:visible th:visible"), function(index, value) {
        columns.push($(value).text());
    });

    var cc = "";

    for (var i = 0; i < columns.length; i++) {
        cc = cc.concat(columns[i].trim());
        cc = cc.concat(",");
    }
    cc = cc.substring(0, cc.length - 1);

    return cc;
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

/**
 * add visible column names to the array and return it as string. the order of
 * chosen columns is lost in ths method. But this is no problem, because the
 * ordering does jqgrid.
 * 
 * @returns {String}
 */
function createRequestVisibleColNames() {
    var selectedValues = '';
    /**
     * MCG-2556 - take colModel from mdlColModel variable and not from
     * grid.jqGrid(...)
     */
    var colModel = mdlColModel;

    var colNames = _.pluck(colModel, 'name');
    var visibleColNames = getVisibleColNames();
    var x = _.map(visibleColNames, function(num, key) {
        return colNames.indexOf(num);
    });

    var names = _.filter(mdlColNames, function(col) {
        return _.contains(x, mdlColNames.indexOf(col));
    });

    for (var i = 0; i < names.length; i++) {

        if (names.length > 0) {
            selectedValues += names[i];
            selectedValues = selectedValues.concat(",");
        }
    }
    selectedValues = selectedValues.substring(0, selectedValues.length - 1);
    return selectedValues;
};

function getVisibleColNames() {

    var grid = $('#engine-mdl-grid');

    var colModel = grid.jqGrid('getGridParam', 'colModel');

    var visibleColModel = _.filter(colModel, function(col) {
        return !col.hidden;
    });

    return _.pluck(visibleColModel, 'name');
}

function checkRelatedColumns(visibleColNames) {

    var error = "";
    _.each(relatedColums, function(column) {

        var showCol = true;

        if (_.contains(visibleColNames, column.columnName)) {
            _.each(column.relatedTo, function(relatedColName) {
                showCol = showCol && _.contains(visibleColNames, relatedColName);
            });
        }

        if (!showCol) {
            error += column.columnName + "  is only allowed in combination with " + column.relatedTo.toString();
        }

    });

    return error;
}