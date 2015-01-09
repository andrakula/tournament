var tooltip;

function hideVisibleTooltip() {
    if (undefined != tooltip && tooltip.is(':visible')) {
        tooltip.hide();
        tooltip = null;
    }
}

function initScrollHandling() {

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

                // return "<div>" + $(this).attr("title") + "</div><div><a
                // href=\"#t\" onclick=\"oGTD(\'" + $(this).attr("detailid") +
                // "\');\" >Maintenance Activity</a></div>";
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
    $("div[class*='lip bob']").qtip({
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

    // set scrollbar to now -5h +15h
    $("#scrollcontainer").scrollLeft(1100);
    $("#timeline").css("margin-left", "-" + 1100 + "px");

    $("#scrollcontainer").scroll(function() {
        var scrollTop = $(this).scrollTop();
        var scrollLeft = $(this).scrollLeft();

        $("#timeline").css("margin-left", "-" + scrollLeft + "px");
        $("#acRegList").css("margin-top", "-" + scrollTop + "px");
    });

    // Hide qtip if scrolling
    $("#scrollcontainer").scroll(function() {
        hideVisibleTooltip();
    });

}

function resizeGroundtimeGrid() {
    var viewportHeight = $(window).height();
    var posY = $('#groundTimeGrid').position().top;
    var gridHeight = viewportHeight - posY - 20;
    $('#height-setter').css('height', gridHeight + 'px');
    // console.log("viewportHeight=" + viewportHeight + " posY=" + posY + "
    // gridHeight=" + gridHeight);
}

function refreshGrid() {
    // Hide qtip if refreshing
    // $('div.qtip:visible').hide();
    hideVisibleTooltip();
    filterAttributesChanged();
}

function activateAutoRefresh() {
    window.setInterval("refreshGrid()", 60000);
}

function initGroundtimeGrid() {
    initScrollHandling();
    resizeGroundtimeGrid();

    // do mark the acReg from hovered AC-lane
    $('.ac-lane').hover(function() {
        $('#' + $(this).attr('acreg')).css("background-color", "#E5E5E5");
    }, function() {
        $('#' + $(this).attr('acreg')).css("background-color", "");
    });
}

$(document).ready(function() {

    activateAutoRefresh();
    // Prevents Firefox from filling the checkboxes from cache on manual page
    // reload
    // document.getElementById('toggleFilterRules').checked = false;

    $('#hideFilter').click(function() {
        var operators = buildSelectedMultiselectBoxString('#operator', 3);
        var fleets = buildSelectedMultiselectBoxString('#fleet, .hiddenFleetDivisionFilterGroup:visible input.fleetBox', 1);
        var divisions = buildSelectedMultiselectBoxString('#division, .hiddenFleetDivisionFilterGroup:visible input.divisionBox', 3);
        var series = buildSelectedMultiselectBoxString('#series, .hiddenFleetDivisionFilterGroup:visible input.seriesBox', 3);
        var acRegs = buildSelectedMultiselectBoxString('#acReg', 3);

        var disableFilterRules = $('#toggleFilterRules:checked').length > 0;

        $('#operatorFilterText').html(operators);
        $('#fleetFilterText').html(fleets);
        $('#divisionFilterText').html(divisions);
        $('#seriesFilterText').html(series);
        $('#acRegFilterText').html(acRegs);
        $('#disableRulesFilterText').html(disableFilterRules ? 'Yes' : 'No');

        $('#headerFilterBoxes').addClass('hide');
        $('#headerTextBoxes').removeClass('hide');

        resizeGroundtimeGrid();
    });
    $('#showFilter').click(function() {
        $('#headerFilterBoxes').removeClass('hide');
        $('#headerTextBoxes').addClass('hide');

        resizeGroundtimeGrid();
    });
    $('#toggleFilterRules').click(function() {
        filterAttributesChanged();
    });

    $("#saveFilter").click(function() {
        saveFilter();
        return false;
    });

    $('#filter').on('click', '.addFilterGroup', function() {
        var hiddenFilterGroup = $('.hiddenFleetDivisionFilterGroup:hidden').first();
        var newFilterGroup = $('.hiddenFleetDivisionFilterGroup:hidden').first().clone();
        var groupCount = $('#headerFilterBoxes .hiddenFleetDivisionFilterGroup:visible').length;

        var baseUrl = contextPath + '/app/groundtime/';

        newFilterGroup.find('.fleetBox').attr('id', 'fleetBox' + groupCount);
        newFilterGroup.find('.divisionBox').attr('id', 'divisionBox' + groupCount);
        newFilterGroup.find('.seriesBox').attr('id', 'seriesBox' + groupCount);

        newFilterGroup.insertBefore(hiddenFilterGroup).show();

        activateMultiselectBox('#fleetBox' + groupCount, 'Fleet', '2', baseUrl + 'fleetFilter');
        activateMultiselectBox('#divisionBox' + groupCount, 'Division', '1', baseUrl + 'divisionFilter');
        activateMultiselectBox('#seriesBox' + groupCount, 'A/C Series', '1', baseUrl + 'seriesFilter');

    });

    $('#filter').on('click', '.removeFilterGroup', function() {
        var groupElement = $(this).parentsUntil('div.hiddenFleetDivisionFilterGroup').parent();
        if (groupElement.hasClass('hiddenFleetDivisionFilterGroup')) {
            // hide group
            groupElement.detach();

            filterAttributesChanged();
        } else {
            // just clear select-fields
            $('#fleet').select2("val", "");
            $('#division').select2("val", "");
            $('#series').select2("val", "");

            filterAttributesChanged();
        }
    });

    initGroundtimeGrid();

    $(window).resize(function() {
        resizeGroundtimeGrid();
    });
});

function activateMultiselectBox(selectElementId, placeHolder, minInputLength, url) {
    $(selectElementId).select2({
        multiple : true,
        placeholder : placeHolder,
        minimumInputLength : minInputLength,
        ajax : {
            url : url,
            dataType : "json",
            data : function(term, page) {
                return {
                    searchTerm : term
                };
            },
            results : function(data, page) {
                return data;
            }
        }
    }).bind('change', function() {
        filterAttributesChanged();
    });
}

function filterAttributesChanged() {

    var disableFilterRules = $('#toggleFilterRules:checked').length > 0;

    var requestParameter = {
        "customers" : buildSelectedMultiselectBoxString('#operator'),
        // "fleetDivisonFilters[0].divisions[0]" : "LZP",
        "acRegs" : buildSelectedMultiselectBoxString('#acReg'),
        "disableFilterRules" : disableFilterRules
    };

    addFleetDivisionFilterMapping(requestParameter);

    $('#groundTimeGrid').block({
        message : '<h1>Filter List.</h1>'
    });
    $('#groundTimeGrid').load('grid', requestParameter, function() {
        initGroundtimeGrid();
        $('#groundTimeGrid').unblock();
    });
}

function addFleetDivisionFilterMapping(requestParameter) {

    var fleetDivisionFilters = new Array();
    var groupNumber = 0;

    var parentDivision = buildSelectedMultiselectBoxString('#division').split(', ');
    var parentFleet = buildSelectedMultiselectBoxString('#fleet').split(', ');
    var parentSeries = buildSelectedMultiselectBoxString('#series').split(', ');

    addMappingToRequestParameters(requestParameter, groupNumber, "divisions", parentDivision);
    addMappingToRequestParameters(requestParameter, groupNumber, "fleet", parentFleet);
    addMappingToRequestParameters(requestParameter, groupNumber, "series", parentSeries);

    // child filter groups:
    $('.hiddenFleetDivisionFilterGroup').each(function() {
        var fleetId = $(this).find('.fleetBox').attr("id");
        var divisionId = $(this).find('.divisionBox').attr("id");
        var seriesId = $(this).find('.seriesBox').attr("id");

        var parentDivision = buildSelectedMultiselectBoxString('#' + divisionId).split(', ');
        var parentFleet = buildSelectedMultiselectBoxString('#' + fleetId).split(', ');
        var parentSeries = buildSelectedMultiselectBoxString('#' + seriesId).split(', ');

        if (parentDivision.length > 0 || parentFleet.length > 0 || parentSeries.length > 0) {
            groupNumber++;
        }

        addMappingToRequestParameters(requestParameter, groupNumber, "divisions", parentDivision);
        addMappingToRequestParameters(requestParameter, groupNumber, "fleet", parentFleet);
        addMappingToRequestParameters(requestParameter, groupNumber, "series", parentSeries);
    });

    return fleetDivisionFilters;
}

function addMappingToRequestParameters(requestParameter, groupNumber, fieldName, fieldValues) {
    for (var i = 0; i < fieldValues.length; i++) {
        if (typeof (fieldValues[i]) != 'undefined' && fieldValues[i] != '') {
            var mapping = "fleetDivisonFilters[" + groupNumber + "]." + fieldName + "[" + i + "]";
            requestParameter[mapping] = fieldValues[i];
        }
    }
}

/*
 * "divisions" : buildSelectedMultiselectBoxString('#division,
 * .hiddenFleetDivisionFilterGroup:visible input.divisionBox'), "fleets" :
 * buildSelectedMultiselectBoxString('#fleet,
 * .hiddenFleetDivisionFilterGroup:visible input.fleetBox'),
 */

function buildSelectedMultiselectBoxString(filter, maxNumberOfElements) {

    var elements = $(filter);

    var valueArray = new Array();
    for (var i = 0; i < elements.length; i++) {
        var filterBox = $(elements[i]).select2("data");
        for (var j = 0; j < filterBox.length; j++) {
            if (typeof (filterBox[j].text) != 'undefined') {
                valueArray.push(filterBox[j].text);
            }
        }
    }

    var elementCount = 0;
    var selectedValues = '';
    for (i = 0; i < valueArray.length; i++) {
        elementCount++;
        if (typeof (maxNumberOfElements) != 'undefined' && elementCount > maxNumberOfElements) {
            selectedValues += "...";
            return selectedValues;
        }

        if (selectedValues.length > 0) {
            selectedValues += ", ";
        }
        selectedValues += valueArray[i];
    }

    return selectedValues;
}

function oGTD(prodNo) {
    window.open(contextPath + '/app/groundtime/detail/' + prodNo).focus();
    // window.location.href = contextPath + '/app/groundtime/detail/' + prodNo;

}

function createRequestString(dataArray) {

    var selectedValues = '';

    var totalItems = dataArray.length;

    for (var i = 0; i < totalItems; i++) {

        if (dataArray.length > 0) {
            if (i == 0) {
                if (typeof dataArray[i] === 'object') {
                    selectedValues += dataArray[i].id.trim();
                } else {
                    selectedValues += dataArray[i];
                }

            } else {
                if (typeof dataArray[i] === 'object') {
                    selectedValues += ",";
                    selectedValues += dataArray[i].id.trim();
                } else {
                    selectedValues += ",";
                    selectedValues += dataArray[i];
                }
            }
        }
    }
    return selectedValues;
};

function getGroundTimeViewFilterValues() {

    var filters = [];

    // Static filter line
    var filterFields = {
        "fleet" : "fleet",
        "division" : "division",
        "series" : "series",
        "acReg" : "acReg"
    };

    var filterItem = {};
    var visible = false;
    for ( var ff in filterFields) {
        var filterData = createRequestString($("#" + filterFields[ff]).select2("data")).split(",");
        if (filterData && filterData != "") {
            filterItem[ff] = filterData;
            visible = true;
        }
    }

    var disableFilterCheck = $('#toggleFilterRules:checked').length > 0;

    if (visible || disableFilterCheck) {
        filterItem['disableFilterCheck'] = disableFilterCheck;
        filters.push(filterItem);
    }

    // Dynamic filter lines

    var filterFields = {
        "fleet" : "fleetBox",
        "division" : "divisionBox",
        "series" : "seriesBox",
    };

    var filterCount = $('#headerFilterBoxes .hiddenFleetDivisionFilterGroup').length;
    for (var fc = 0; fc < filterCount; fc++) {
        var filterItem = {};
        var visible = false;
        for ( var ff in filterFields) {
            if (!jQuery.isEmptyObject($('#headerFilterBoxes .hiddenFleetDivisionFilterGroup:visible #fleetBox' + fc))) {
                var filterData = createRequestString($("#" + filterFields[ff] + fc).select2("data")).split(",");
                if (filterData && filterData != "") {
                    filterItem[ff] = filterData;
                    visible = true;
                }
            }
        }

        if (visible) {
            // filterItem['disableFilterCheck'] = disableFilterCheck;
            filters.push(filterItem);
        }

    }

    return filters;
};

function saveFilter() {

    var filterValue = getGroundTimeViewFilterValues();

    var postData = {};
    postData["viewName"] = "GROUND_TIME_OVERVIEW";
    var url = contextPath + '/app/features/filter/save/view-name';

    if ($.isEmptyObject(filterValue)) {
        url = contextPath + '/app/features/filter/delete/view-name';
    } else {
        postData["filterValue"] = JSON.stringify(filterValue);
    }

    $.ajax({
        type : 'POST',
        data : postData,
        url : url,
        success : function(result) {
            if (result.success.length > 0) {
                $("#successMsg").text(result.success).show();
            }
            if (result.errors.length > 0) {
                $("#errorMsg").text(result.errors).show();
            }
        },
        error : function(result) {
            $("#errorMsg").text("General error occurs. Please try again later.").show();
        }
    });

};