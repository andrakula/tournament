$(document).ready(function() {
    initPlaceHolders();
    clearPlaceholders();

    $("#reportVariants-filter").select2({
        width : 240,
        maximumSelectionSize : 1,
        placeholder : "Report Variants"
    }).bind("change", function() {
        if ($("#reportVariants-filter").select2('data').length == 0) {
            resetFilters();
            $('#deleteReportVariant').hide();
        } else {
            $('#deleteReportVariant').show();
            resetFilters();
            hideMessages();
            fillFilterFormByVariant();
        }
    });

    $("#adSbStatusQCForm #qcFromYearDate,[class^='select2-'][class^='select2-']:not(#reportVariants-filter)").on("change", function(e) {
        filterAttributesChanged();
    });

    $("#docNumberFilter").bind("change", tidyUpDocNumbersFilter);

});

function initPlaceHolders() {
    $('.placeholder').focus(function() {
        var input = $(this);
        if (input.val() == input.attr('placeholderJS')) {
            input.val('');
            input.removeClass('placeholder');
        }
    }).blur(function() {
        var input = $(this);
        if (input.val() == '' || input.val() == input.attr('placeholderJS')) {
            input.addClass('placeholder');
            input.val(input.attr('placeholderJS'));
        } else {
            input.removeClass('placeholder');
        }
    }).blur();
}

function clearPlaceholders() {
    $('.placeholder').parents('form').submit(function() {
        $(this).find('.placeholder').each(function() {
            var input = $(this);
            if (input.val() == input.attr('placeholderJS')) {
                input.val('');
            }
        });
    });
}

function fillFilterFormByVariant() {
    // resetFilters(false);
    var url = contextPath + '/app/staging/adSbStatusQC/filter-variant';
    var postData = {};

    postData["filterName"] = $('#reportVariants-filter').select2("data")[0].text;

    $.ajax({
        type : 'POST',
        data : postData,
        url : url,
        success : function(result) {

            fillFormFields(result);

            if (result.success && result.success.length > 0) {
                $("#successMsg").text(result.success).show();
            }
            if (result.errors && result.errors.length > 0) {
                $("#errorMsg").text(result.errors).show();
            }
            filterAttributesChanged();
        },
        error : function(result) {
            $("#errorMsg").text("General error occurs. Please try again later.").show();
        }
    });

}

function refreshReportVariants(filterName, direction) {
    if (direction == 'insert') {

        $("#reportVariants-filter").append($('<option></option>').val(filterName).html(filterName));

        var options = $('#reportVariants-filter option');
        var arr = options.map(function(_, o) {
            return {
                t : $(o).text(),
                v : o.value
            };
        }).get();
        arr.sort(function(o1, o2) {
            return o1.t.toLowerCase() > o2.t.toLowerCase() ? 1 : o1.t.toLowerCase() < o2.t.toLowerCase() ? -1 : 0;
        });
        options.each(function(i, o) {
            o.value = arr[i].v;
            $(o).text(arr[i].t);
        });
        $('select').html(options);
        $("#reportVariants-filter").select2("val", filterName);
        $('#saveReportVariant').data('savetype', 'Save Filter');
    } else if (direction == 'remove') {
        // $('#reportVariants-filter').select2().close(filterName);
        // $('#reportVariants-filter').remove('<option>' + filterName +
        // '</option>');
        $('#reportVariants-filter').select2('val', '');
        $('#reportVariants-filter option').filter(function() {
            return $(this).html() == filterName;
        }).remove();
    }

}

function fillFormFields(result) {

    var filterValue = {};
    var filterFields = {
        "docTypes" : "docTypeFilter",
        "docNumbers" : "docNumberFilter",
        "operators" : "operatorFilter",
        "fleetIDs" : "fleetFilter",
        "fleets" : "customerFleetFilter",
        "acRegs" : "acRegFilter",
        "qcFromYearDate" : "qcFromYearDate"
    };

    for ( var key in filterFields) {
        var filterData = result[key];
        if (filterData && filterData != "") {
            filterValue[key] = filterData;
            var selectedItems = $("#" + filterFields[key]).select2("val");
            if (key == "fleets") {
                var selectedItemData = [];
                for (var i = 0; i < result[key].length; i++) {
                    selectedItemData.push({
                        id : result[key][i].id,
                        text : result[key][i].value,
                        disabled : false
                    });
                }
                $("#" + filterFields[key]).select2("data", selectedItemData);
                continue;
            } else if (key == "qcFromYearDate") {
                $("#" + filterFields[key]).val(filterData);
            } else {
                selectedItems.push(filterData);
            }
            $("#" + filterFields[key]).select2("val", selectedItems);
        }
    }

}

function getFilterParams() {
    var checkQCCurrentOperatorOnly = $('#checkQCCurrentOperatorOnly:checked').length > 0;

    var filterParams = {
        "docTypes" : buildSelectedMultiselectBoxString('docTypeFilter'),
        "docNumbers" : getDocNumbersFromFilter(),
        "operators" : buildSelectedMultiselectBoxString('operatorFilter'),
        "fleetIDs" : buildSelectedMultiselectBoxID('customerFleetFilter'),
        "acRegs" : buildSelectedMultiselectBoxString('acRegFilter'),
        "qcFromYearDate" : $('#qcFromYearDate').val(),
        "checkQCCurrentOperatorOnly" : checkQCCurrentOperatorOnly
    };
    return filterParams;
}

function saveFilter(filterName, newReportVariant) {

    if (getPropertyNames(getFilterValues()) === "") {
        showMessage("Report Variants", "Nothing to save");
        return;
    }

    var filterValue = getFilterValues();
    var postData = {};
    postData["viewName"] = "ADSBSTATUSSQC";
    postData["filterName"] = filterName;
    var url = contextPath + '/app/staging/filter/save/filter-name';

    // if ($.isEmptyObject(filterValue)) {
    // url = contextPath + '/app/staging/filter/delete/filter-name';
    // } else {
    // }
    postData["filterValue"] = JSON.stringify(filterValue);

    $.ajax({
        type : 'POST',
        data : postData,
        url : url,
        success : function(result) {
            if (result.success.length > 0) {
                if (newReportVariant) {
                    refreshReportVariants(filterName, 'insert');
                }

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

function deleteReportVariant() {
    var url = contextPath + '/app/staging/filter/delete/filter-name/';
    var postData = {};
    var filterName = $('#reportVariants-filter').select2("data")[0].text;
    postData["viewName"] = "ADSBSTATUSSQC";
    postData["filterName"] = filterName;

    $.ajax({
        type : 'POST',
        data : postData,
        url : url,
        success : function(result) {
            if (result.success.length > 0) {
                refreshReportVariants(filterName, 'remove');
                resetFilters();
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

}

function getFilterValues() {
    var filterValue = {};

    var filterFields = {
        "docTypes" : "docTypeFilter",
        "docNumbers" : "docNumberFilter",
        "operators" : "operatorFilter",
        "fleetIDs" : "fleetFilter",
        "fleets" : "customerFleetFilter",
        "acRegs" : "acRegFilter",
        "qcFromYearDate" : "qcFromYearDate"
    // "checkQCCurrentOperatorOnly" : checkQCCurrentOperatorOnly
    };

    for ( var key in filterFields) {
        var filterData;
        if (key == "fleets") {
            filterData = createRequestStringForKeyValueVO($("#" + filterFields[key]).select2("data"));
        } else if (key == "qcFromYearDate") {
            filterData = $('#qcFromYearDate').val();
        } else {
            filterData = createRequestString($("#" + filterFields[key]).select2("data")).split(",");
        }

        if (filterData && filterData != "") {
            filterValue[key] = filterData;
        }
    }

    return filterValue;
};

function getPropertyNames(obj) {
    var txt = "";
    for ( var x in obj) {
        txt = txt + obj[x] + " ";
    }
    return txt;
}

function createRequestStringForKeyValueVO(dataArray) {
    var selectedValues = new Array();

    var totalItems = dataArray.length;

    for (var i = 0; i < totalItems; i++) {

        if (dataArray.length > 0) {
            var customerFleet = {};
            customerFleet['id'] = $.trim(dataArray[i].id);
            customerFleet['value'] = $.trim(dataArray[i].text);
            customerFleet['label'] = $.trim(dataArray[i].text);

            selectedValues.push(customerFleet);
        }
    }
    return selectedValues;

}

function createRequestString(dataArray) {

    var selectedValues = '';

    var totalItems = dataArray.length;

    for (var i = 0; i < totalItems; i++) {

        if (dataArray.length > 0) {
            if (i == 0) {
                if (typeof dataArray[i] === 'object') {
                    selectedValues += $.trim(dataArray[i].id);
                } else {
                    selectedValues += dataArray[i];
                }

            } else {
                if (typeof dataArray[i] === 'object') {
                    selectedValues += ",";
                    selectedValues += $.trim(dataArray[i].id);
                } else {
                    selectedValues += ",";
                    selectedValues += dataArray[i];
                }
            }
        }
    }
    return selectedValues;
};

function buildSelectedMultiselectBoxString(elementId, maxNumberOfElements) {
    var filterBox = $('#' + elementId).select2("data");

    var elementCount = 0;
    var selectedValues = '';
    for (var i = 0; i < filterBox.length; i++) {
        elementCount++;
        if (typeof (maxNumberOfElements) != 'undefined' && elementCount > maxNumberOfElements) {
            selectedValues += "...";
            return selectedValues;
        }

        if (selectedValues.length > 0) {
            selectedValues += ", ";
        }
        selectedValues += filterBox[i].text;
    }

    return selectedValues;
}

function filterAttributesChanged() {
    $("#successMsg").hide();
    var filterModeSelected = buildSelectedMultiselectBoxString('reportVariants-filter', 1).length > 0;

    if (filterModeSelected) {
        $('#saveReportVariant').data('savetype', 'Save Filter');
    } else {
        $('#saveReportVariant').data('savetype', 'New Filter');
    }

    if (getPropertyNames(getFilterValues()) === "") {
        $('#saveReportVariant, #resetReportFilters, #deleteReportVariant').hide();
    } else {
        $('#saveReportVariant, #resetReportFilters').show();
        if ($('#reportVariants-filter').select2('data').length != 0) {
            $('#deleteReportVariant').show();
        }
    }
}

function buildSelectedMultiselectBoxID(elementId, maxNumberOfElements) {
    var filterBox = $('#' + elementId).select2("data");

    var elementCount = 0;
    var selectedValues = '';
    for (var i = 0; i < filterBox.length; i++) {
        elementCount++;
        if (typeof (maxNumberOfElements) != 'undefined' && elementCount > maxNumberOfElements) {
            selectedValues += "...";
            return selectedValues;
        }

        if (selectedValues.length > 0) {
            selectedValues += ", ";
        }
        selectedValues += filterBox[i].id;
    }

    return selectedValues;
}

function hideMessages() {
    $('#errorMsg').hide();
    $('#successMsg').hide();
}
