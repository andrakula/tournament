if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

Object.size = function(obj) {
    var size = 0;
    for ( var key in obj) {
        if (obj.hasOwnProperty(key)) {
            size++;
        }
    }
    return size;
};

$.ajaxSetup({
    cache : false,
    data : {
        'isAjax' : 'true'
    }
});

function removeEmptyFileFormFields(formFields) {
    $.each(formFields, function(index, value) {
        if (value && value.type === 'file') {
            if (value.value.length === 0) {
                formFields.splice(index, 1);
            }
        }
    });
}

function onTreeDblClick(node, event) {
    node._onClick(event);
    node.toggleExpand();
    node.focus();

    var aTag = node.span.getElementsByTagName("a");
    if (aTag[0]) {
        // issue 154, 313
        // if(!($.browser.msie && parseInt($.browser.version, 10) < 9)){
        if (!(BROWSER.msie && parseInt(BROWSER.version, 10) < 9)) {
            aTag[0].focus();
        }
    } else {
        // 'noLink' option was set
        return true;
    }
}

function initToUppercase() {
    $('.to-uppercase').bind('keydown keyup change', function(event) {
        elementToUppercase(this);
    });
}

function elementToUppercase(element) {
    if (element !== null && element.value !== null) {
        var up = element.value.toUpperCase();
        if (up != element.value) {
            element.value = up;
        }
    }
}

function getHomeBaseUrl() {
    return window.location.protocol + '//' + window.location.host + contextPath;
}

function openResultDetail(praefix, name, objectTyp, objectId) {
    switch (praefix) {
    case 'AC':
        var url = getHomeBaseUrl() + '/app/groundtime/detail/ac/' + name;
        window.location.href = url;
        break;
    case 'SER':
        var url = getHomeBaseUrl() + '/app/staging/ser/' + objectId + '/general';
        window.location.href = url;
        break;
    case 'CF':
        var url = getHomeBaseUrl() + '/app/cmaint/ac-overview?fleet=' + name;
        window.location.href = url;
        break;
    case 'SD':
        alert('Not supported at the moment');
        break;
    case 'ESN':
        var url = getHomeBaseUrl() + '/app/staging/engine/' + objectId;
        window.location.href = url;
        break;
    case 'PUBL':
        alert('Not supported at the moment');
        break;
    case 'PNR':
        var url = getHomeBaseUrl() + '/app/staging/pnr/' + objectId;
        window.location.href = url;
        break;
    case 'AMT':
        var url = getHomeBaseUrl() + '/app/staging/mainttask/' + objectId + '/type/' + objectTyp + '/number/' + name;
        window.location.href = url;
        break;
    case 'WO':
        alert('Not supported at the moment');
        break;
    case 'WOP':
        alert('Not supported at the moment');
        break;
    default:
        alert('Not supported at the moment');
    }
}

function openEDocDocumentViewer(docViewerUrl) {
    var eDocPopup = window.open(docViewerUrl, 'DocumentListPopup', 'width=800, height=600, left=100, top=100, scrollbars=yes, resizable=yes');
    eDocPopup.focus();
    return false;
}

function checkIfNullValue(value) {
    var result = "";
    if (value != null) {
        result = value;
    }
    return result;
};

var searchForTopResults = function searchForTopResults(search, praefix) {

    $('#searchResultDivHome>ul').children().remove();
    var loadgif = "<div><img src='../resources/img/lhtcontrols/loading.gif' /> Loading..</div>";
    $('#searchResultDivHome>ul').append(loadgif);

    $.ajax({
        url : contextPath + '/app/searchTopResults',
        type : 'POST',
        data : {
            searchText : search,
            praefix : praefix
        },
        success : function(data) {
            $('#searchResultDivHome>ul').children().remove();
            $.each(data, function(index, object) {
                var entry = "";
                switch (object.praefix) {
                case 'AC':
                    entry = "<div class='objectName'>" + checkIfNullValue(object.objectName) + "</div>" + "<div class='objectFloatRight'>Fleet: " +
                            checkIfNullValue(object.customField2) + "</div><br>" + "<div class='objectFloatLeft'>" +
                            checkIfNullValue(object.objectTyp) + "</div>";
                    break;
                case 'SER':
                    entry = "<div class='objectName'>" + checkIfNullValue(object.objectName) + "</div>" + "<div class='objectFloatRight'>PNR: " +
                            object.customField1 + "</div><br>" + "<div class='objectFloatLeft'>" + checkIfNullValue(object.objectTyp) +
                            "</div><div class='objectFloatRight'>A/C: " + checkIfNullValue(object.customField2) + "</div>";
                    break;
                case 'CF':
                    entry = "<div class='objectName'>" + checkIfNullValue(object.objectName) + "</div><br>" + "<div class='objectFloatLeft'>" +
                            checkIfNullValue(object.objectTyp) + "</div>";
                    break;
                case 'MS':
                    entry = "<div class='objectName'>" + checkIfNullValue(object.objectName) + "</div><div class='objectFloatRight'>Revision: " +
                            checkIfNullValue(object.customField1) + "</div><br>" + "<div class='objectFloatLeft'>" +
                            checkIfNullValue(object.objectTyp) + "</div>";
                    break;
                case 'PUBL':
                    entry = "<div class='objectName'>" + checkIfNullValue(object.objectName) + "</div><br><div class='objectFloatLeft'>" +
                            checkIfNullValue(object.objectTyp) + "</div>";
                    break;
                case 'SD':
                    entry = "<div class='objectName'>" + checkIfNullValue(object.objectName) + "</div><div class='objectFloatRight'>Document Type: " +
                            checkIfNullValue(object.customField1) + "</div><br>" + "<div class='objectFloatLeft'>" +
                            checkIfNullValue(object.objectTyp) + "</div><div class='objectFloatRight'>Revision: " +
                            checkIfNullValue(object.customField2) + "</div>";
                    break;
                case 'ESN':
                    entry = "<div class='objectName'>" + checkIfNullValue(object.objectName) + "</div><div class='objectFloatRight'>A/C: " +
                            checkIfNullValue(object.customField2) + "</div><br>" + "<div class='objectFloatLeft'>" +
                            checkIfNullValue(object.objectTyp) + "</div><div class='objectFloatRight'>Position: " +
                            checkIfNullValue(object.customField3) + "</div>";
                    break;
                case 'PNR':
                    entry = "<div class='objectName'>" + checkIfNullValue(object.objectName) + "</div><br>" + "<div class='objectFloatLeft'>" +
                            checkIfNullValue(object.objectTyp) + "</div>";
                    break;
                case 'ST':
                    entry = "<div class='objectName'>" + checkIfNullValue(object.objectName) + "</div><br>" + "<div class='objectFloatLeft'>" +
                            checkIfNullValue(object.objectTyp) + "</div>";
                    break;
                case 'WO':
                    entry = "<div class='objectName'>" + checkIfNullValue(object.objectName) + "</div><div class='objectFloatRight'>Step: " +
                            checkIfNullValue(object.customField2) + "</div><br>" + "<div class='objectFloatLeft'>" +
                            checkIfNullValue(object.objectTyp) + "</div>";
                    break;
                case 'WOP':
                    entry = "<div class='objectName'>" + checkIfNullValue(object.objectName) + "</div><div class='objectFloatRight'>A/C: " +
                            checkIfNullValue(object.customField2) + "</div><br>" + "<div class='objectFloatLeft'>" +
                            checkIfNullValue(object.objectTyp) + "</div><div class='objectFloatRight'>Status: " +
                            checkIfNullValue(object.customField3) + "</div>";
                    break;
                case 'AMT':
                    entry = "<div class='objectName'>" + checkIfNullValue(object.objectName) + "</div><div class='objectFloatRight'>Revision: " +
                            checkIfNullValue(object.customField2) + "</div><br>" + "<div class='objectFloatLeft'>" +
                            checkIfNullValue(object.objectTyp) + "</div><div class='objectFloatRight'>Fleet: " +
                            checkIfNullValue(object.customField3) + "</div>";
                    break;
                case 'CMT':
                    entry = "<div class='objectName'>" + checkIfNullValue(object.objectName) + "</div><div class='objectFloatRight'>Revision: " +
                            checkIfNullValue(object.customField2) + "</div><br>" + "<div class='objectFloatLeft'>" +
                            checkIfNullValue(object.objectTyp) + "</div>";
                    break;
                case 'EMT':
                    entry = "<div class='objectName'>" + checkIfNullValue(object.objectName) + "</div><br>" + "<div class='objectFloatLeft'>" +
                            checkIfNullValue(object.objectTyp) + "</div>";
                    break;
                case 'MOD':
                    entry = "<div class='objectName'>" + checkIfNullValue(object.objectName) + "</div><div class='objectFloatRight'>Revision: " +
                            checkIfNullValue(object.customField2) + "</div><br>" + "<div class='objectFloatLeft'>" +
                            checkIfNullValue(object.objectTyp) + "</div><div class='objectFloatRight'>Fleet: " +
                            checkIfNullValue(object.customField3) + "</div>";
                    break;
                default:
                    entry = "No Results";
                    break;
                }
                $('#searchResultDivHome>ul').append(
                        "<li onclick=\"openResultDetail('" + object.praefix + "','" + object.objectName + "','" + object.objectTyp + "','" +
                                object.id + "')\">" + entry + "</li>");

            });
        },
        error : function() {
            $('#searchResultDivHome').hide();
        }
    });
    $('#searchResultDivHome').show();

};

function showStickyError(text) {
    var message = {
        title : "Error",
        text : text
    };
    showStickyNotification(message);
};

function showStickyNotification(message) {
    $.notific8(message.text, {
        life : 5000,
        heading : message.title,
        theme : 'smoke',
        sticky : true,
        horizontalEdge : 'bottom',
        verticalEdge : 'right',
        zindex : 1500,
        closeText : 'close'
    });
};

// long polling ajax get function, repeat every 500ms
function getReportingStatus() {
    setTimeout(function() {
        $.ajax({
            url : contextPath + "/app/staging/sticky-notification",
            type : "GET",
            dataType : 'html',
            success : function(response) {
                // showStickyNotification(response);
            },
            complete : getReportingStatus,
            timeout : 30000,
            cache : false
        });
    }, 5000);
};
$(document).ready(function() {

    // getReportingStatus();

    /*
     * Export-Menu code.
     */
    $('.nav-items li').hover(function() {
        $(this).find('ul').show();
    }, function() {
        $(this).find('ul').hide();
    });
    /**
     * Search
     */

    var availableTags = [ {
        label : "AC: ...",
        value : "AC:"
    }, {
        label : "CF: ...",
        value : "CF:"
    }, {
        label : "ESN: ...",
        value : "ESN:"
    }, {
        label : "MS: ...",
        value : "MS:"
    }, {
        label : "MT (Aircraft, Engine): ...",
        value : "MT:"
    }, {
        label : "PNR: ...",
        value : "PNR:"
    }, {
        label : "PUBL: ...",
        value : "PUBL:"
    }, {
        label : "SER: ...",
        value : "SER:"
    } ];

    $("#searchInputFieldHome").autocomplete({
        source : availableTags,
        minLength : 0
    }).focus(function() {
        $(this).autocomplete('search', $(this).val());
    });

    $('#searchInputFieldHome').keydown(function(e) {

        var keyCode = e.keyCode || e.which;
        if (keyCode != 16 && keyCode != 8 && keyCode != 32) {
            var regex = /[a-zA-Z0-9äöüÄÖÜß\,\.\_\-\:\|\#\x47\x92]/;
            return regex.test(e.key);
        }
        return true;
    });

    var timeout;

    $('#searchInputFieldHome').keyup(function(e) {
        var praefixArray = [ 'AC', 'SER', 'ESN', 'CF', 'MS', 'PNR', 'PUBL', 'SD', 'ST', 'MT', 'WO', 'WOP' ];
        var input = $(this).val();
        var position = input.indexOf(':');
        var search = "";
        var praefix = "ALL";
        if (position == -1) {
            search = $(this).val();
        } else {
            if ($.inArray(input.substr(0, position).toUpperCase(), praefixArray) >= 0) {
                search = $.trim(input.substr(position + 1, input.length));
                praefix = input.substr(0, position).toUpperCase();
            } else {
                search = $(this).val();
            }
        }
        switch (e.keyCode) {
        case 13:
            if ($('#searchResultDivHome>ul').find('li').hasClass('active')) {
                $('#searchResultDivHome>ul').find('li.active').trigger("click");
            } else {
                $('#searchResultDivHome>ul').children().remove();
                $('input[name="searchText"]').val(search);
                $('input[name="praefix"]').val(praefix);
                $("#searchForm").ajaxSubmit().submit();
            }
            break;
        case 40:
            if ($('#searchResultDivHome>ul').find('li').hasClass('active')) {
                var obj = $('#searchResultDivHome>ul').find('li.active');

                if (obj.next().length > 0) {
                    obj.removeClass('active');
                    obj.next().addClass('active');
                } else {
                    obj.removeClass('active');
                    $('#searchResultDivHome>ul').find('li').first().addClass('active');
                }
            } else {
                $('#searchResultDivHome>ul').find('li').first().addClass('active');
            }
            break;
        case 38:
            if ($('#searchResultDivHome>ul').find('li').hasClass('active')) {
                var obj = $('#searchResultDivHome>ul').find('li.active');

                if (obj.prev().length > 0) {
                    obj.removeClass('active');
                    obj.prev().addClass('active');
                } else {
                    obj.removeClass('active');
                    $('#searchResultDivHome>ul').find('li').last().addClass('active');
                }
            }
            break;
        default:
            // $('#searchResultDivHome>ul').children().remove();
            // var loadgif = "<div><img
            // src='../resources/img/lhtcontrols/loading.gif' />
            // Loading..</div>";
            // $('#searchResultDivHome>ul').append(loadgif);
            if (search.length >= 2) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                // timeout = setTimeout(function(s, p) {
                // alert('Search:' + s + ' Pre:' + p);
                // }, 1000, search, praefix);

                timeout = setTimeout(searchForTopResults, 2000, search, praefix);

            } else {
                $('#searchResultDivHome').hide();
            }
            break;
        }
    });

    $(document).click(function() {
        $('#searchResultDivHome').hide();
        $('#searchResultDivHome>ul').children().remove();
    });
});
