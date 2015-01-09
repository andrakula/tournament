var tooltip;

function hideVisibletooltip() {
    if (undefined != tooltip && tooltip.is(':visible')) {
        tooltip.hide();
        tooltip = null;
    }
}

// like in app_groundtime_overview.js
function initScrollHandling() {

    // set scrollbar to now -5h +15h
    $("#scrollcontainer").scrollLeft(1100);
    $("#timeline").css("margin-left", "-" + 1100 + "px");

    $("#scrollcontainer").scroll(function() {
        var scrollTop = $(this).scrollTop();
        var scrollLeft = $(this).scrollLeft();

        $("#timeline").css("margin-left", "-" + scrollLeft + "px");
        $("#acRegList").css("margin-top", "-" + scrollTop + "px");
    });

};

function initQtip() {

    // set qtip for all ground times:
    // a) retrieving of extendes status data (OIL, TCH, CAMO NOTED) from staging
    // via Ajax call
    // b) joining common status and off block information (title) and
    // c) setting link to maintenance activity

    var gt = $("div[class*='gi s-']");
    gt.qtip({
        content : {
            title : "Ground Time Details",
            text : function(event, api) {
                $.ajax({
                    url : contextPath + '/app/staging/maintenanceActivity/' + $(this).attr("detailid"),
                    type : 'POST',
                    dataType : 'json',
                    once : false
                }).then(function(data) {
                    var ajaxContent = "";
                    if (checkForKeyValue(data, "type", "OIL")) {
                        ajaxContent += "OIL";
                    }
                    if (checkForKeyValue(data, "type", "TCH")) {
                        if (ajaxContent != "") {
                            ajaxContent += ", ";
                        }
                        ajaxContent += "TCH";
                    }
                    if (checkForKeyValue(data, "invertedGreen", "X")) {
                        if (ajaxContent != "") {
                            ajaxContent += ", ";
                        }
                        ajaxContent += "CAMO Noted";
                    }

                    var titleParts = api.target.context.attributes.oldtitle.value.split("...");

                    var tDiv = {};
                    if (ajaxContent.length > 0) {
                        tDiv = "<div>" + titleParts[0] + ", " + ajaxContent + titleParts[1] + "</div>";
                    } else {
                        tDiv = "<div>" + titleParts[0] + titleParts[1] + "</div>";
                    }
                    api.set('content.text', tDiv);
                });

                return "<div>" + $(this).attr("title") + "</div>";
            }
        },
        show : {
            solo : true,
            delay : 500
        },
        hide : {
            event : 'unfocus load scroll'
        },
        position : {
            target : 'mouse',
            my : 'top left',
            adjust : {
                mouse : false
            }
        },
        style : {
            classes : 'qtip-blue qtip-rounded qtip-shadow camo-qTip',
            tip : {
                corner : false,
                offset : 2
            }
        },
        events : {
            render : function(event, api) {
                tooltip = api.elements.tooltip;
            }
        }
    });

    // set qtip for other flight bubles
    $("div[class='leg-item']").qtip({
        content : {
            title : "Flight Details"
        },
        hide : {
            event : 'unfocus load scroll'
        },
        show : {
            solo : true
        },
        position : {
            target : 'mouse',
            my : 'top left',
            adjust : {
                mouse : false
            }
        },
        style : {
            classes : 'qtip-blue qtip-rounded qtip-shadow camo-qTip',
            tip : {
                corner : false
            }
        },
        events : {
            render : function(event, api) {
                tooltip = api.elements.tooltip;
            }
        }
    });

    $("div[class*='gi s---']").qtip({
        content : {
            title : "Ground Time Details",
        },
        hide : {
            event : 'unfocus load scroll'
        },
        show : {
            solo : true
        },
        position : {
            target : 'mouse',
            my : 'top left',
            adjust : {
                mouse : false
            }
        },
        style : {
            classes : 'qtip-blue qtip-rounded'
        },
        events : {
            render : function(event, api) {
                tooltip = api.elements.tooltip;
            }
        },
    });
}
//
// function checkForUnsavedChanges() {
// return true;
// }

// onclick load new detailside with new Infos to the Groundtime
function oGTD(prodNo) {

    window.open(contextPath + '/app/groundtime/detail/' + prodNo, "_self");
};

/**
 * Function to load actual content of ground time line
 */
function updateGroundTimeGrid() {

    var blockWrapper = $('#groundTimeGridWrapper');

    hideVisibletooltip();

    blockWrapper.block({
        message : '<h1>Updating...</h1>'
    });

    $("#groundTimeGrid").load(contextPath + '/app/groundtime/detail/' + $('#gtId').val() + '/grid', function() {
        setTimeout(function() {
            initScrollHandling();
        }, 300);
        setTimeout(function() {
            blockWrapper.unblock();
        }, 700);

    });

};

$(document).ready(function() {
    // init tab navigation
    var openTabIdvalue = $('#openTabId').val();
    $("#tabbarGroundtimeDetail").tabnav({
        openTabId : (openTabIdvalue === "") ? "tabMtcActivity" : openTabIdvalue
    // "tabMtcActivity"
    });

    initScrollHandling();
    initQtip();

    // init autorefresh ground time line
    setInterval(updateGroundTimeGrid, 60000); // that's 60 seconds
});