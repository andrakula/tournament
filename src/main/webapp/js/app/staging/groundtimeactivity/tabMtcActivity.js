var mtcActivityGridId = "data-grid";

var mtcActivityColNames = [ 'Type', 'Pos', 'Ch.', 'Reference', 'Cl.', 'Rectific. Date', 'Rem. FH', 'Rem. FC', 'Rem. Days', 'Status', 'MR', 'Id',
        'complNoHidden', 'd1Tmst', 'woOrigin', 'workNo', '', '', '', '', '' ];

var mtcActivityColModel = [ {
    name : 'type',
    index : 'type',
    sortable : true,
    width : 70,
    align : 'left',
    fixed : true,
    formatter : jssFormatter,
}, {
    name : 'position',
    index : 'position',
    sortable : true,
    width : 65,
    align : 'center',
    fixed : true,
    sorttype : function(cellObj, rowObj) {
        return sortIntNullsLast(mtcActivityGridId, cellObj, rowObj);
    }
}, {
    name : 'chapter',
    index : 'chapter',
    sortable : true,
    width : 45,
    align : 'center',
    fixed : true,
    sorttype : function(cellObj, rowObj) {
        return sortStrNullsLast(mtcActivityGridId, cellObj, rowObj);
    }
}, {
    name : 'orderNo',
    index : 'orderNo',
    sortable : true,
    width : 680,
    align : 'left',
    formatter : orderNoFormatter,
    sorttype : function(cellObj, rowObj) {
        return sortStrNullsLast(mtcActivityGridId, cellObj, rowObj);
    }
}, {
    name : 'classification',
    index : 'classification',
    sortable : true,
    width : 45,
    align : 'left',
    fixed : true,
    sorttype : function(cellObj, rowObj) {
        return sortStrNullsLast(mtcActivityGridId, cellObj, rowObj);
    }
}, {
    name : 'rectificationDate',
    index : 'rectificationDate',
    sortable : true,
    width : 120,
    align : 'left',
    fixed : true,
    formatter : dateFormatter,
    sorttype : function(cellObj, rowObj) {
        return sortDateNullsLast(mtcActivityGridId, cellObj, rowObj, 'DD-MM-YYYY HH:mm');
    }
}, {
    name : 'remainingFH',
    index : 'remainingFH',
    sortable : true,
    width : 95,
    align : 'center',
    sorttype : 'int',
    formatter : deadlineFhFormatter,
    fixed : true,
    sorttype : function(cellObj, rowObj) {
        return sortIntNullsLast(mtcActivityGridId, cellObj, rowObj);
    }
}, {
    name : 'remainingFC',
    index : 'remainingFC',
    sortable : true,
    width : 95,
    align : 'center',
    sorttype : 'int',
    formatter : deadlineFcFormatter,
    fixed : true,
    sorttype : function(cellObj, rowObj) {
        return sortIntNullsLast(mtcActivityGridId, cellObj, rowObj);
    }
}, {
    name : 'remainingHours',
    index : 'remainingHours',
    sortable : true,
    width : 110,
    align : 'center',
    sorttype : 'int',
    formatter : deadlineDatFormatter,
    fixed : true,
    sorttype : function(cellObj, rowObj) {
        return sortIntNullsLast(mtcActivityGridId, cellObj, rowObj);
    }
}, {
    name : 'statusSymbol',
    index : 'statusSymbol',
    sortable : true,
    width : 100,
    align : 'center',
    classes : 'data-grid-cell',
    formatter : statusFormatter,
    cellattr : function(rowId, tv, rawObject, cm, rdata) {
        return ' title="' + rdata.statusSymbol.symbolDesc + '"';
    },
    sorttype : function(cellObj, rowObj) {
        var sortOrder = getGridSortOrder(mtcActivityGridId);
        if (sortOrder === 'desc') {
            return isCellObjNull(cellObj) ? -Number.MAX_VALUE : cellObj.sortRank;
        } else if (sortOrder === 'asc') {
            return isCellObjNull(cellObj) ? Number.MAX_VALUE : cellObj.sortRank;
        }
    },
    fixed : true
}, {
    name : 'printAttachment',
    index : 'printAttachment',
    sortable : true,
    width : 80,
    align : 'center',
    classes : 'data-grid-cell',
    formatter : attachmentFormatter,
    fixed : true
}, {
    name : 'id',
    index : 'id',
    sortable : false,
    hidden : true,
    key : true,
    width : 1
}, {
    name : 'complNo',
    index : 'complNo',
    hidden : true,
    width : 1
}, {
    name : 'd1Tmst',
    index : 'd1Tmst',
    hidden : true,
    width : 1
}, {
    name : 'woOrigin',
    index : 'woOrigin',
    hidden : true,
    width : 1
}, {
    name : 'workNo',
    index : 'workNo',
    hidden : true,
    width : 1
}, {
    name : 'pwoNo',
    index : 'pwoNo',
    hidden : true,
    width : 1
}, {
    name : 'deadlineFh',
    index : 'deadlineFh',
    sortable : false,
    hidden : true,
    width : 1
}, {
    name : 'deadlineFc',
    index : 'deadlineFc',
    sortable : false,
    hidden : true,
    width : 1
}, {
    name : 'marisStatus',
    index : 'marisStatus',
    sortable : false,
    hidden : true,
    width : 1
}, {
    name : 'deadlineDat',
    index : 'deadlineDat',
    sortable : false,
    hidden : true,
    formatter : 'date',
    formatoptions : {
        srcformat : 'd-M-Y',
        newformat : 'd-M-Y'
    },
    width : 1
} ];

function jssFormatter(cellvalue, options, rowObject) {
    var s = cellvalue;
    if (s.indexOf("JSS") > -1 && rowObject.d1Tmst != null) {
        var d = moment.utc(rowObject.d1Tmst).format("DD-MMM-YYYY HH:mm").toUpperCase();
        s = '<span title="JSS-D1-Timestamp: ' + d + '">' + cellvalue + '</span>';
    }
    return s;
};

function dateFormatter(cellvalue, options, rowObject) {
    var result = "";
    var date = moment.utc(cellvalue);
    if (date != null && date.isValid()) {
        result = moment.utc(cellvalue).format("DD-MMM-YYYY HH:mm").toUpperCase();
    }
    return result;
};

function statusFormatter(cellvalue, options, rowObject) {
    if (cellvalue != null) {
        return '<div class="maint-act-status-column-icon maint-act-status-column-icon-' + cellvalue.symbolId + '" title2="' + cellvalue.symbolId +
                '(' + cellvalue.sortRank + ')"></div>';
    }
    return "";

}

function orderNoFormatter(cellvalue, options, rowObject) {
    var result = cellvalue;

    if (cellvalue === null || cellvalue === '') {
        result = "";
    } else if (rowObject.woOrigin == 'T' && rowObject.workNo != null && rowObject.marisStatus != null && rowObject.marisStatus != '') {
        result = '<a href="#" onclick="openMTechlogReport(\'' + rowObject.workNo + '\');">' + cellvalue + '</a>';
    } else if (rowObject.complNo != null && rowObject.marisStatus != null && rowObject.marisStatus != '') {
        result = '<a href="#" onclick="openMTechlogReport(\'' + rowObject.complNo + '\');">' + cellvalue + '</a>';
    } else if (rowObject.woOrigin != 'T' && rowObject.workNo != null) {
        var f40ReportParams = {
            workNo : rowObject.workNo,
            pwoNo : rowObject.pwoNo,
            acReg : $("#acReg").val()
        };
        result = '<a href="' + contextPath + '/app/f40?' + $.param(f40ReportParams) + '" target="_blank" title="' + cellvalue + '">' + cellvalue +
                '</a>';

    }
    return result;
}

function deadlineFhFormatter(cellvalue, options, rowObject) {
    var red_class = "";
    var ret = "";
    if (cellvalue != null && cellvalue < 0) {
        red_class = "class=\"rem_red\"";
    }
    if (cellvalue != null) {
        ret = '<span title="Deadline FH: ' + rowObject.deadlineFh + '" ' + red_class + ' >' + cellvalue + '</span>';
    }
    return ret;
}

function deadlineFcFormatter(cellvalue, options, rowObject) {
    var red_class = "";
    var ret = "";
    if (cellvalue < 0) {
        red_class = "class=\"rem_red\"";
    }
    if (cellvalue != null) {
        return '<span title="Deadline FC: ' + rowObject.deadlineFc + '" ' + red_class + ' >' + cellvalue + '</span>';
    }
    return ret;
}

function fDiv(n1, n2) {
    if (n1 * n2 > 0) {
        return Math.floor(n1 / n2);
    }
    return Math.ceil(n1 / n2);
}

/**
 * show deadline date, if the cell value isn`t empty. set the color of the
 * value, if the cell value < 0
 * 
 * @param cellvalue
 * @param options
 * @param rowObject
 * @returns {String}
 */
function deadlineDatFormatter(cellvalue, options, rowObject) {
    if (cellvalue != null) {
        var d = "";
        if (rowObject.deadlineDat != null && rowObject.deadlineDat != "") {
            d = moment.utc(rowObject.deadlineDat).format("DD-MMM-YYYY").toUpperCase();
        }
        var red_class = "";
        if (cellvalue != null && cellvalue < 0) {
            red_class = "class=\"rem_red\"";
        }

        var days = fDiv(cellvalue, 24);
        var output = "";
        if (days != 0) {
            var remainingHours = Math.abs(cellvalue % 24);
            output = days + "d " + remainingHours + "h";
        } else {
            var remainingHours = cellvalue % 24;
            output = remainingHours + "h";
        }

        return '<span title="Deadline Date: ' + d + '" ' + red_class + '>' + output + '</span>';
    }
    return "";
}

function openMTechlogReport(complNo) {
    var gtId = $("#gtId").val();
    window.open(contextPath + '/app/groundtime/mtechlog/report?complaintNumber=' + complNo + '&groundTimeId=' + gtId, 'mtechlog',
            'width=1000,height=680,left=0,top=0');
}

function attachmentFormatter(cellvalue, options, rowObject) {
    if (typeof (cellvalue) != 'undefined' && cellvalue != 0) {
        return '<a href="' + contextPath + '/app/groundtime/mr/' + cellvalue + '" target="_blank" title="open attachment"><img src="' + contextPath +
                '/resources/img/lhticonset/attachment_16.png"/></a>';
        '" target="_blank" title="open attachment"><img src="' + contextPath + '/resources/img/lhticonset/attachment_16.png"/></a>';
    }
    return '';
}

function initTabMTCActivity() {
    var gtId = $("#gtId").val();
    initSearchDataGrid(contextPath + '/app/staging/maintenanceActivity/' + gtId, mtcActivityColNames, mtcActivityColModel, 'type', 'asc',
            '#data-grid', '#data-grid-pager');

    var grid = $("#data-grid");
    grid.jqGrid('setGridParam', {
        loadonce : true,
        shrinkToFit : false,
        onCellSelect : function(rowid, iCol, cellcontent, e) {
            if (e.shiftKey && iCol == 9) {
                alert($(cellcontent).attr('title2'));
            }
        }

    });

    grid.jqGrid('setLabel', 'position', '', {
        'text-align' : 'center'
    });
    grid.jqGrid('setLabel', 'remainingFH', '', {
        'text-align' : 'center'
    });
    grid.jqGrid('setLabel', 'remainingFC', '', {
        'text-align' : 'center'
    });
    grid.jqGrid('setLabel', 'remainingDays', '', {
        'text-align' : 'center'
    });
    grid.jqGrid('setLabel', 'status', '', {
        'text-align' : 'center'
    }, {
        'title' : 'Status of Activity'
    });
    grid.jqGrid('setLabel', 'printAttachment', '', {
        'text-align' : 'center'
    }, {
        'title' : 'Set via Webservice'
    });
    grid.jqGrid('setLabel', 'chapter', '', {
        'text-align' : 'center'
    }, {
        'title' : 'Chapter'
    });
}

$("#mtcactivity-setstatus").click(function() {

    setStatus();
    return false;
});

function setStatus() {

    var tmpStatus = $("#status-reason-filter").val();
    var gtId = $("#gtId").val();
    // $(document).on('click', '#notification-grid input[type=checkbox]',
    // function() {
    $.ajax({
        type : 'POST',
        data : {
        // 'notificationId' : this.id,
        // 'active' : $(this).is(':checked')
        },
        url : contextPath + '/app/staging/maintenanceActivity/' + gtId + '/setStatus/' + tmpStatus
    }).done(function(d) {
        // alert("Saved " + d);
        $("#updatedtime").empty().append(d);
        $("#updatedWord").empty().append("<b>Updated:&#160;&#160;</b>");

        updateGroundTimeGrid();
    });
    ;
    // });

};