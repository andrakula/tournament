function htmlToTxt(html) {
    return $('<div>').html(html).text();
}

/**
 * This function toggle between disabled and enabled state for the function
 * Buttons Start QS, Show Open Tasks, Export Quality Report, Show RepDB Document
 * (ReportingDataEditor).
 * 
 * @param enable
 */
function toggleFunctionButtons(enable) {
    if (enable) {
        $('#startAdSbStatusQS').attr('disabled', false).removeClass("disabled");
        toggleShowOpenTasksButton();
        toggleReportingDataEditorButton();
        $('#exportQualityReport').attr('disabled', false).removeClass("disabled");
    } else {
        $('#startAdSbStatusQS').attr('disabled', true).addClass("disabled");
        $('#showOpenTasks').attr('disabled', true).addClass("disabled");
        $('#exportQualityReport').attr('disabled', true).addClass("disabled");
    }

}

/**
 * This function makes it possible that a table cell show a multiline input
 * Field on click into the cell for edit the content.
 * 
 * @param editabelObject
 */
function initEditableArea(editabelObject) {
    editabelObject.editable(function(value, settings) {
        var retval = value.replace(/\n/gi, "<br>");

        // apply button deaktiviert solange editboxen sichtbar sind
        // #qcDocView_Status_new
        var countEditboxes = $('form input[name=value], textarea[name=value]').size();
        if (countEditboxes < 2) {
            toggleApplyOrConfirmButton(true);
        }
        return retval;
    }, {
        type : 'textarea',
        onblur : 'submit',
        placeholder : '',
        data : function(value, settings) {
            /* Convert <br> to newline. */
            var retval = value.replace(/<br[\s\/]?>/gi, '\n');

            // apply button deaktiviert solange editboxen sichtbar sind
            toggleApplyOrConfirmButton(false);
            return retval;
        }
    });
}

/**
 * This function makes it possible that a table cell show an input Field (not
 * multiline) on click into the cell for edit the content.
 * 
 * @param editabelObject
 */
function initEditable(editabelObject) {
    editabelObject.editable(function(value, settings) {
        // apply button deaktiviert solange editboxen sichtbar sind
        var countEditboxes = $('form input[name=value], textarea[name=value]').size();
        if (countEditboxes < 2) {
            toggleApplyOrConfirmButton(true);
        }
        return value;
    }, {
        type : 'text',
        onblur : 'submit',
        placeholder : '',
        data : function(value, settings) {
            // apply button deaktiviert solange editboxen sichtbar sind
            toggleApplyOrConfirmButton(false);
            return value;
        },
        callback : function(value, settings) {
            // apply button deaktiviert solange editboxen sichtbar sind
            if (!validateDocFormData($('#qcSourceDocNewForm'))) {
                toggleApplyOrConfirmButton(false);
            }
            if (!validateDocFormData($('#adSbReportingDocumentForm'))) {
                toggleApplyOrConfirmButton(false);
            }
        }
    });
}

/**
 * toggle between disabled and enabled for the Apply Or Confirm Button
 * 
 * @param enabled
 */
function toggleApplyOrConfirmButton(enabled) {
    if (enabled) {
        $('#qcDocView_Status_new #applyNew').attr('disabled', false).removeClass("disabled");
        $('#updateReportingDocument').attr('disabled', false).removeClass("disabled");
    } else {
        $('#qcDocView_Status_new #applyNew').attr('disabled', true).addClass("disabled");
        $('#updateReportingDocument').attr('disabled', true).addClass("disabled");
    }
}

/**
 * This Functions add click Handler To SourceTask Deviation Items that makes it
 * possible to open a PopUp for QC-View.
 * 
 * @returns {Boolean}
 */
function addClickHandlerToSourceTaskDeviationItems() {
    $("#adSbStatusQCDocHeadTable .qcSTCell-Deviation-true").click(function() {
        // find parent tr and data attribute qcst_rowkey
        openPopUpQCView(undefined);
    });

    $("#qcDocSourceTasksTable .qcSTCell-Deviation-true").click(
            function(e) {
                e.preventDefault();
                // erst prüfen ob im Header noch Abweichungen vorhanden sind und
                // ggf. Meldung dazu anzeigen
                if ($("#adSbStatusQCDocHeadTable .qcSTCell-Deviation-true").size() > 0 ||
                        (!$(this).hasClass("eoHeaderValue") && $($.find('.eoHeaderValue.qcSTCell-Deviation-true')).size() > 0)) {
                    showMessage("Quality Control", "Es sind noch Abweichungen im Source Document vorhanden");
                    return false;
                }

                // find parent tr and data attribute qcst_rowkey
                var selectedQCstRowKey = $(this).parents('tr').data("qcst_rowkey");
                if (!selectedQCstRowKey) {
                    alert("Konnte SourceTask nicht ermitteln");
                    return false;
                }

                openPopUpQCView(selectedQCstRowKey);
            });
    return false;
}

/**
 * This function add the possibility for table cells to show a multiline and not
 * multiline input Fields on click into the cells for edit the contents.
 * 
 * @param editTextAreaElements
 * @param editTextElements
 * @returns {Boolean}
 */
function addEditableClassToSourceTaskDeviationItems(editTextAreaElements, editTextElements) {
    $.each(editTextAreaElements, function() {
        initEditableArea($(this));
    });

    $.each(editTextElements, function() {
        initEditable($(this));
    });
    return false;
}

/**
 * This function add icon-buttons and handler for the possibility to add new
 * references for Documents.
 * 
 * @param elements
 * @param cssClass
 * @returns {Boolean}
 */
function addAddButtonToSourceTaskDeviationItems(elements, cssClass) {
    $.each(elements, function() {
        var label = $(this).data("label");
        if (!label) {
            label = "";
        }
        var span = $('<span class="fa fa-plus fa-2x" style="color: blue;"><span style="font-size: 14px;">' + label + '</span></span>').click(
                function() {
                    var elemName = $(this).parent().data('childname');
                    var size = $(this).parent().children().length;
                    var div;
                    $(this).parent().children().find('.newRef-first-child').length;
                    if ($(this).parent().find('.newRef-first-child').length == 1) {
                        div = $('<div class="newRef ' + cssClass + '" name="' + elemName + '" data-' + elemName + '="' + size + '"></div>');
                    } else {
                        div = $('<div class="newRef-first-child ' + cssClass + '" name="' + elemName + '" data-' + elemName + '="' + size +
                                '"></div>');
                    }
                    $($(this)).parent().append(div);
                    initEditable(div);
                });

        $(this).append(span);
    });

    return false;
}

/**
 * This function toggle between 'Show only deviations' and 'Show all' Source
 * Tasks.
 */
function showHideDocSourceTasksItems() {

    if (showAllSorceTasksOfDocDetails) {
        $("table#qcDocSourceTasksTable tr.rowQCSourceTask.docDetailVOitem-deviation-false").show();
        $('#showAllQSDocSourceTasks').attr('value', 'Show only deviations');
        showAllSorceTasksOfDocDetails = false;
    } else {
        $("table#qcDocSourceTasksTable tr.rowQCSourceTask.docDetailVOitem-deviation-false").hide();
        $('#showAllQSDocSourceTasks').attr('value', 'Show all');
        showAllSorceTasksOfDocDetails = true;
    }
}

function toggleDocSourceBetween_ERD_and_Reporting(showReporting) {

    if (showReporting) {
        $("table#adSbStatusQCDocHeadTable tr.rowQCDocumentHeaderReporting").show();
        $("table#adSbStatusQCDocHeadTable tr.rowQCDocumentHeader").hide();
        $("table#qcDocSourceTasksTable tr.rowQCSourceTaskReporting").show();
        $("table#qcDocSourceTasksTable tr.rowQCSourceTask").hide();
    } else {
        $("table#adSbStatusQCDocHeadTable tr.rowQCDocumentHeaderReporting").hide();
        $("table#adSbStatusQCDocHeadTable tr.rowQCDocumentHeader").show();
        $("table#qcDocSourceTasksTable tr.rowQCSourceTaskReporting").hide();
        $("table#qcDocSourceTasksTable tr.rowQCSourceTask").show();
    }
}

/**
 * This function initialize the Legend and Icon-Buttons that make it possible to
 * show and hide the table legend for the Document Header and Source Tasks.
 */
function initLegendToggleButtons() {
    $.each($('.toggleLegend'), function() {

        var hierarchicID = $(this).parent().parent().parent().parent().parent().attr('id') + "§" + $(this).attr('id');
        if (toggleLegendMemory[hierarchicID] == undefined) {
            toggleLegendMemory[hierarchicID] = $(this).parent().parent().parent().find('.tblRowLegend').is(":visible");
        }

        if (!hasHandler($(this)[0], 'click')) {

            $(this).on("click", function() {
                var hierarchicID = $(this).parent().parent().parent().parent().parent().attr('id') + "§" + $(this).attr('id');
                $(this).parent().parent().parent().find('.tblRowLegend').toggle();
                $(this).children().first().toggleClass("fa fa-plus-square-o").toggleClass("fa fa-minus-square-o");
                if (window.opener) {
                    var params = {
                        'hierarchicID' : hierarchicID,
                        'visibleLegend' : $(this).parent().parent().parent().find('.tblRowLegend').is(":visible")
                    };
                    $.triggerParentEvent("updateVariables", JSON.stringify(params));

                } else {
                    toggleLegendMemory[hierarchicID] = $(this).parent().parent().parent().find('.tblRowLegend').is(":visible");
                }
            });
        }
    });
}

/**
 * This function restore the state of the Legend of the tables. It show or hide
 * the table legend and toggle between plus and minus icon-Buttons for the
 * Document Header and Source Tasks.
 * 
 * @param toggleLegendArray
 */
function restoreToggleLegend(toggleLegendArray) {
    for ( var i in toggleLegendArray) {
        var arr = new Array();
        arr = i;
        arr = arr.split("§");

        if (arr[0].indexOf("adSbStatusQCForm") >= 0) {
            if (toggleLegendArray[i] || toggleLegendArray[i] === undefined) {
                toggleLegend($('#' + arr[1]), true);
            } else {
                toggleLegend($('#' + arr[1]), false);
            }
        } else {
            // else is indexOf("box") fuer popUp
            if (toggleLegendArray[i] || toggleLegendArray[i] == undefined) {
                toggleLegend($('#' + arr[0]).find('#' + arr[1]), true);
            } else {
                toggleLegend($('#' + arr[0]).find('#' + arr[1]), false);
            }
        }
    }
}

/**
 * This function hide or show the Legend of the tables and toggle between plus
 * and minus icon-Buttons for the Document Header and Source Tasks.
 * 
 * @param element
 * @param show
 */
function toggleLegend(element, show) {
    if (show) {
        element.parent().parent().parent().find('.tblRowLegend').show();
        element.children().first().removeClass("fa fa-plus-square-o");
        element.children().first().addClass("fa fa-minus-square-o");
    } else {
        element.parent().parent().parent().find('.tblRowLegend').hide();
        element.children().first().removeClass("fa fa-minus-square-o");
        element.children().first().addClass("fa fa-plus-square-o");
    }
}

/**
 * This function initialize the sort order icon-Buttons (asc, desc) and add a
 * handler for sorting.
 */
function initSortOrderToggleButtons() {
    if ($('#qcDocSourceTasksTable tr.rowQCSourceTask').size() > 1) {
        $.each($('.toggleSortOrder'), function() {
            if (!hasHandler($(this)[0], 'click')) {
                $(this).on(
                        "click",
                        function() {
                            obj = $(this);
                            if (qcDocChanged) {
                                indicateDialogForDocChange("Quality Control Document Changes",
                                        "If you proceed with sorting changes will not be saved.", sortOrder, obj);
                            } else {
                                sortOrder(obj);
                            }
                        });
            }
        });
    }

}

/**
 * This function handle the sorting and toggle icons between asc and desc.
 * 
 * @param el
 */
function sortOrder(el) {
    if (el.find('i').is(':hidden')) {
        el.find('i').show();
    } else {
        el.children().first().toggleClass("fa fa-sort-asc").toggleClass("fa fa-sort-desc");
    }

    var sortOrder = "asc";
    if (el.children().first().attr('class').indexOf("asc") >= 0) {
        // asc icon ist fuer desc-Sortierung und desc icon ist
        // fuer
        // asc-Sortierung, also umgekehrt benannt weil
        // US-Stil/Font-Awesome-icons-Stil
        sortOrder = "desc";
    }

    if (el.attr('id') === "toggleSortOrderSTNo") {
        getDocWithSortedSTs("STNo", sortOrder);
    } else {
        getDocWithSortedSTs("AcReg", sortOrder);
    }
}

/**
 * This function restore the state of the icon-Buttons (asc, desc) for sorting.
 */
function restoreSortOrderSetting() {
    if ($("#hiddenSortField").val() === "AcReg") {
        if ($("#hiddenSortOrder").val() === "desc") {
            $('#toggleSortOrderSTAcReg').children().first().toggleClass("fa fa-sort-asc").toggleClass("fa fa-sort-desc");
        }
        $('#toggleSortOrderSTNo i').hide();
    } else {
        if ($("#hiddenSortOrder").val() === "desc") {
            $('#toggleSortOrderSTNo').children().first().toggleClass("fa fa-sort-asc").toggleClass("fa fa-sort-desc");
        }
        $('#toggleSortOrderSTAcReg i').hide();
    }

}

/**
 * Get the To Skip Duplicated eo Issue Details IDs. Return not relevant/not
 * applied eo Issue Details IDs.
 * 
 * @param details
 * @returns
 */
function getToSkipDuplicatedEOissueDetailIDs(details) {
    var seen = {};
    var duplicates = new Array();
    $.each(details, function() {
        var qcst_rowkey = $(this).data('qcst_rowkey');
        if (seen[qcst_rowkey]) {
            duplicates.push(qcst_rowkey);
        } else {
            seen[qcst_rowkey] = true;
        }
    });

    var toSkipEOissueDetailIDs = new Array();
    for (var i = 0; i < duplicates.length; i++) {
        toSkipEOissueDetailIDs.push($(details).filter("[data-qcst_rowkey='" + duplicates[i] + "']:not('.applied')")[0].id);
    }
    return toSkipEOissueDetailIDs;
}

/**
 * Appliete EO Daten aus PopUp ins Hauptfenster einfuegen
 * 
 * @param stRowContent
 * @param stRowId
 * @param toHideOppositeRowID
 * @param editEOHeaderMode
 * @returns
 */
function pasteEODocValues(stRowContent, stRowId, toHideOppositeRowID, editEOHeaderMode) {
    var stRowContent = $(stRowContent);
    var eoNumber = $('#' + stRowId).find('div[name=eoNumber]').text();
    if (!eoNumber) {
        // appliete EO-Details einfuegen und HeaderDaten leeren weil auf der
        // Hauptseite die Detail-Row ohne HeaderDaten anzeigt wird
        stRowContent.find('div[name=eoNumber]').text("");
        stRowContent.find('div[name=eoIssue]').text("");
        stRowContent.find('div[name=eoType]').text("");
        stRowContent.find('div[name=eoTitle]').text("");
        stRowContent.find('div[name=complTimeMT]').text("");
        stRowContent.find('div[name=mtRef]').html("");

        $('#' + stRowId).addClass('applied').html($('<div>').append(stRowContent.clone()).html()).show();

        $('#' + stRowId + ' .qcSTCell-Deviation-true').removeClass('qcSTCell-Deviation-true').addClass('qcSTCell-Deviation-false');
        $('#' + stRowId + ' span.fa').remove();
        $('#' + stRowId + ' .newRef').removeClass('newRef');

        if (toHideOppositeRowID != undefined) {
            $('#' + toHideOppositeRowID).hide();
            $('#' + toHideOppositeRowID).removeClass('applied');
            $('#' + toHideOppositeRowID + ' .qcSTCell-Deviation-true').removeClass('qcSTCell-Deviation-true').addClass('qcSTCell-Deviation-false');
        }

    } else if ($("#hiddenEOissueVOdeviation").val() === "true" && ($("#hiddenEOissueVOdeviationApplied").val() === "false" || editEOHeaderMode)) {
        // EO Header Daten einfuegen
        var mtRefs = $(stRowContent).find('div[name=mtRef]');
        var mtRefsTxt = "";
        $.each(mtRefs, function() {
            mtRefsTxt += $('<div>').append($(this).clone()).html();
        });

        $('#' + stRowId).find('div[name=eoNumber]').html($(stRowContent).find('div[name=eoNumber]').html());
        $('#' + stRowId).find('div[name=eoIssue]').html($(stRowContent).find('div[name=eoIssue]').html());
        $('#' + stRowId).find('div[name=eoType]').html($(stRowContent).find('div[name=eoType]').html());
        $('#' + stRowId).find('div[name=eoTitle]').html($(stRowContent).find('div[name=eoTitle]').html());
        $('#' + stRowId).find('div[name=complTimeMT]').html($(stRowContent).find('div[name=complTimeMT]').html());
        $('#' + stRowId).find('td[name=mtRefs]').html(mtRefsTxt);

        $('#' + toHideOppositeRowID).find('div[name=eoNumber]').html($(stRowContent).find('div[name=eoNumber]').html());
        $('#' + toHideOppositeRowID).find('div[name=eoIssue]').html($(stRowContent).find('div[name=eoIssue]').html());
        $('#' + toHideOppositeRowID).find('div[name=eoType]').html($(stRowContent).find('div[name=eoType]').html());
        $('#' + toHideOppositeRowID).find('div[name=eoTitle]').html($(stRowContent).find('div[name=eoTitle]').html());
        $('#' + toHideOppositeRowID).find('div[name=complTimeMT]').html($(stRowContent).find('div[name=complTimeMT]').html());
        $('#' + toHideOppositeRowID).find('td[name=mtRefs]').html(mtRefsTxt);

        $('#' + stRowId).addClass('applied');

        $('#' + stRowId + ' .eoHeaderValue .qcSTCell-Deviation-true').removeClass('qcSTCell-Deviation-true').addClass('qcSTCell-Deviation-false');
        $('#' + stRowId + ' .eoHeaderValue.qcSTCell-Deviation-true').removeClass('qcSTCell-Deviation-true').addClass('qcSTCell-Deviation-false');

        $('#' + toHideOppositeRowID + ' .eoHeaderValue .qcSTCell-Deviation-true').removeClass('qcSTCell-Deviation-true').addClass(
                'qcSTCell-Deviation-false');
        $('#' + toHideOppositeRowID + ' .eoHeaderValue.qcSTCell-Deviation-true').removeClass('qcSTCell-Deviation-true').addClass(
                'qcSTCell-Deviation-false');

        $('#' + stRowId + ' span.fa').remove();
        $('#' + stRowId + ' .newRef').removeClass('newRef');

        $('#' + toHideOppositeRowID + ' span.fa').remove();
        $('#' + toHideOppositeRowID + ' .newRef').removeClass('newRef');

        if (toHideOppositeRowID != undefined) {
            $('#' + toHideOppositeRowID).removeClass('applied');
            $('#' + toHideOppositeRowID + '.eoHeaderValue .qcSTCell-Deviation-true').removeClass('qcSTCell-Deviation-true').addClass(
                    'qcSTCell-Deviation-false');
            $('#' + toHideOppositeRowID + '.eoHeaderValue.qcSTCell-Deviation-true').removeClass('qcSTCell-Deviation-true').addClass(
                    'qcSTCell-Deviation-false');
        }

        $("#hiddenEOissueVOdeviationApplied").val(true);
    } else {
        // Header wurde schon applied.
        // Appliete EO-Details einfuegen und HeaderDaten belassen weil auf der
        // Hauptseite die Detail-Row mit HeaderDaten anzeigt wird
        $('#' + stRowId).html($('<div>').append(stRowContent.clone()).html());

        $('#' + stRowId).addClass('applied').show();

        $('#' + stRowId + ' .qcSTCell-Deviation-true').removeClass('qcSTCell-Deviation-true').addClass('qcSTCell-Deviation-false');
        $('#' + stRowId + ' span.fa').remove();
        $('#' + stRowId + ' .newRef').removeClass('newRef');

        if (toHideOppositeRowID != undefined) {
            $('#' + toHideOppositeRowID).hide();
            $('#' + toHideOppositeRowID).removeClass('applied');
            $('#' + toHideOppositeRowID + ' .qcSTCell-Deviation-true').removeClass('qcSTCell-Deviation-true').addClass('qcSTCell-Deviation-false');
        }
    }
}

function validateDocFormData(formObj) {

    $.each(formObj.find('#qcDocSourceTasksTable .validationErr'), function(index, value) {
        $(this).removeClass('validationErr');
    });

    var errors = new Array();
    $.each(formObj.find('#qcDocSourceTasksTable .rowQCSourceTask'), function(index, value) {

        validateRepeatIntervalDays($(this).find('div[name=repeatIntervalDays]'), errors);
        validate_FH_and_FC_Input($(this).find('div[name=repeatIntervalFH]'), errors);
        validate_FH_and_FC_Input($(this).find('div[name=repeatIntervalFC]'), errors);
        validate_FH_and_FC_Input($(this).find('div[name=completionFH]'), errors);
        validate_FH_and_FC_Input($(this).find('div[name=completionFC]'), errors);
        validate_FH_and_FC_Input($(this).find('div[name=nextDueFH]'), errors);
        validate_FH_and_FC_Input($(this).find('div[name=nextDueFC]'), errors);

        validateDate($(this).find('div[name=completionDate]'), errors);
        validateDate($(this).find('div[name=nextDueDat]'), errors);

        validateStatus($(this).find('div[name=staskStatus]'), errors);

        validateStatus($(this).find('div[name=docStatus]'), errors);
    });

    validationResult = {
        errors : errors,
        warnings : [],
        success : []
    };

    iterateMessages(validationResult);

    if (hasMessages(validationResult.errors)) {
        return false;
    }

    return true;
}

function validateStatus(elem, errors) {
    if (!elem.text().trim()) {
        // is empty or whitespace
        return;
    }

    if ("OPEN" === elem.text()) {
        return;

    } else if ("CLOSED" === elem.text()) {
        return;
    } else if ("CANX." === elem.text()) {
        return;
    } else {
        elem.addClass("validationErr");
        var errTxt = "* Please insert correct value for Source Task Status.";
        if ($.inArray(errTxt, errors) == -1) {
            errors.push(errTxt);
        }
    }
}

function validateDate(elem, errors) {
    if (!elem.text().trim()) {
        // is empty or whitespace
        return;
    }

    if (!isValidDateFormat(elem.text())) {
        elem.addClass("validationErr");
        var errTxt = "* Please insert date in format DD-MMM-YYYY.";
        if ($.inArray(errTxt, errors) == -1) {
            errors.push(errTxt);
        }
    }
}

function validateRepeatIntervalDays(elem, errors) {
    if (!elem.text().trim()) {
        // is empty or whitespace
        return;
    }

    if (!isNumeric(elem.text())) {
        elem.addClass("validationErr");
        var errTxt = "REPEAT INTERVAL:* Please insert correct value for Repeat Interval Days.";
        if ($.inArray(errTxt, errors) == -1) {
            errors.push(errTxt);
        }
    }
}

function validate_FH_and_FC_Input(elem, errors) {
    if (!elem.text().trim()) {
        // is empty or whitespace
        return;
    }

    if (!isNumeric(elem.text())) {
        elem.addClass("validationErr");
        var errTxt = "FH/FC:* Please insert correct values for FH and FC.";
        if ($.inArray(errTxt, errors) == -1) {
            errors.push(errTxt);
        }
    }
}

function isNumeric(value) {
    if (value == null || !value.toString().match(/^[-]?\d*\.?\d*$/)) {
        return false;
    }
    return true;
}

function iterateMessages(responseText) {
    hideAllMessages();
    setMessages(responseText.success, '#successMsg');
    setMessages(responseText.errors, '#errorMsg');
    setMessages(responseText.warnings, '#warningMsg');
}

function setMessages(responseTextType, messageId) {
    $(messageId).text('');
    if (responseTextType !== null && $.isArray(responseTextType)) {
        if (responseTextType.length > 0) {
            $.each(responseTextType, function(index, value) {
                $(messageId).append(value);
                $(messageId).append('<br/>');
            });
            $(messageId).show();
        }
    }
}

function hasMessages(responseTextType) {
    if (responseTextType !== null && $.isArray(responseTextType)) {
        if (responseTextType.length > 0) {
            return true;
        }
    }
    return false;
}
function hideAllMessages() {
    $('#successMsg').hide();
    $('#successMsg').empty();
    $('#errorMsg').hide();
    $('#errorMsg').empty();
    $('#warningMsg').hide();
    $('#warningMsg').empty();
}

// for disable/enable scrolling z.B. für Modal-Dialog öffen/schließen
function wheel(e) {
    e = e || window.event;
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.returnValue = false;
};

// for disable scrolling z.B. wenn Modal-Dialog geöffnet wird.
function disable_scroll() {
    if (window.addEventListener) {
        window.addEventListener('DOMMouseScroll', wheel, false);
    }
    window.onmousewheel = document.onmousewheel = wheel;

};

// for enable scrolling z.B. wenn Modal-Dialog geschlossen wird.
function enable_scroll() {
    if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', wheel, false);
    }
    window.onmousewheel = document.onmousewheel = document.onkeydown = null;
};

function showMessage(title, message) {

    closeDialogs();
    var text = '<p><span style="padding-top: 5px; font-size:1.2em;">' + message + '</span></p>';

    var $dialog = $('<div id="dialogBox"></div>').html(text).dialog({
        title : title,
        autoOpen : false,
        resizable : false,
        width : 'auto',
        modal : true,
        position : "center",
        autoReposition : true,
        closeOnEscape : true,
        draggable : false,
        create : function(event, ui) {
            // for disable scrolling
            $('body').css({
                overflow : 'hidden'
            });
            disable_scroll();
        },
        close : function(event, ui) {
            closeDialogs();
        },
        buttons : {
            "OK" : function() {
                $(this).dialog("close");
            }
        }
    });

    // width speziell für den ie9
    var width = $(window).width() / 2 - $dialog.parent().width() / 2;
    $dialog.parent().css('left', width + 'px');
    $dialog.dialog('open');
};

function showMessageDialog(title, message, okFN, okParams, cancelFN, cancelParams) {

    closeDialogs();
    var text = '<p><span style="padding-top: 5px; font-size:1.2em;">' + message + '</span></p>';

    var $dialog = $('<div id="dialogBox"></div>').html(text).dialog({
        title : title,
        autoOpen : false,
        resizable : false,
        width : 'auto',
        modal : true,
        position : "center",
        autoReposition : true,
        closeOnEscape : true,
        draggable : false,
        create : function(event, ui) {
            // for disable scrolling
            $('body').css({
                overflow : 'hidden'
            });
            disable_scroll();
        },
        close : function(event, ui) {
            closeDialogs();
        },
        buttons : {
            "OK" : function() {
                $(this).dialog("close");
                okFN(okParams);
            },
            "Cancel" : function() {
                $(this).dialog("close");
                if (cancelFN) {
                    cancelFN(cancelParams);
                }
            }
        }
    });

    // width speziell für den ie9
    var width = $(window).width() / 2 - $dialog.parent().width() / 2;
    $dialog.parent().css('left', width + 'px');
    $dialog.dialog('open');
};

function showSaveChangesDialog(message, browsingParams) {

    closeDialogs();
    var text = '<p><span style="padding-top: 5px; font-size:1.2em;">' + message + '</span></p>';

    var $dialog = $('<div id="dialogBox"></div>').html(text).dialog({
        title : 'Quality Control',
        autoOpen : false,
        resizable : false,
        width : 'auto',
        modal : true,
        position : "center",
        autoReposition : true,
        closeOnEscape : true,
        draggable : false,
        create : function(event, ui) {
            // for disable scrolling
            $('body').css({
                overflow : 'hidden'
            });
            disable_scroll();
        },
        close : function(event, ui) {
            closeDialogs();
        },
        buttons : {
            "Ja" : function() {
                $(this).dialog("close");
                saveAfterServerValidation(browsingParams);
            },
            "Nein" : function() {
                $(this).dialog("close");
                getNextOrPreviousQCDocument(browsingParams);
            }
        }
    });
    var width = $(window).width() / 2 - $dialog.parent().width() / 2;
    $dialog.parent().css('left', width + 'px');
    $dialog.dialog('open');
};

function showSaveNewReportVariantDialog(saveFunction) {

    closeDialogs();
    var text = '<p style="padding-bottom: 7px;"><span style="padding-top: 5px; font-size:1.2em;"> Report Variant save as: </span></p>';
    text += '<p><span style="padding-top: 5px; font-size:1.2em;"> <input type="text" id="newReportVariantName" /></span></p>';
    text += '<p style="padding-top: 9px;"><span id="reportVariantNameExists" style="padding-top: 9px; font-size:1.2em; color: red;"> The name for a Report Variant already exist. Please enter a different. </span></p>';

    var $dialog = $('<div id="dialogBox"></div>').html(text).dialog({
        title : 'New Report Variant',
        autoOpen : false,
        resizable : false,
        modal : true,
        position : "center",
        autoReposition : true,
        closeOnEscape : true,
        draggable : false,
        open : function() {
            $(this).find('#reportVariantNameExists').hide();
        },
        create : function(event, ui) {
            // for disable scrolling
            $('body').css({
                overflow : 'hidden'
            });
            disable_scroll();
        },
        close : function(event, ui) {
            closeDialogs();
        },
        buttons : {
            "Save" : function() {
                var newReportVariantName = $(this).find('#newReportVariantName').val();
                var exists = $('#reportVariants-filter option').filter(function() {
                    return $(this).html() == newReportVariantName;
                }).html();
                if (exists) {
                    $(this).find('#reportVariantNameExists').show();
                } else {
                    saveFunction(newReportVariantName, true);
                    $(this).dialog("close");
                }
            },
            "Cancel" : function() {
                $(this).dialog("close");
            }
        }
    });
    var width = $(window).width() / 2 - $dialog.parent().width() / 2;
    $dialog.parent().css('left', width + 'px');
    $dialog.dialog('open');
};

function showDeleteReportVariantDialog(reportVariantName, deleteFunction) {

    closeDialogs();
    var text = '<p style="padding-bottom: 7px;"><span style="padding-top: 5px; font-size:1.2em;"> Delete Report Variant "' + reportVariantName +
            '"? </span></p>';

    var $dialog = $('<div id="dialogBox"></div>').html(text).dialog({
        title : 'Delete Report Variant',
        autoOpen : false,
        resizable : false,
        modal : true,
        position : "center",
        autoReposition : true,
        closeOnEscape : true,
        draggable : false,
        open : function() {
            $(this).find('#reportVariantNameExists').hide();
        },
        create : function(event, ui) {
            // for disable scrolling
            $('body').css({
                overflow : 'hidden'
            });
            disable_scroll();
        },
        close : function(event, ui) {
            closeDialogs();
        },
        buttons : {
            "Delete" : function() {
                deleteFunction();
                $(this).dialog("close");
            },
            "Cancel" : function() {
                $(this).dialog("close");
            }
        }
    });
    var width = $(window).width() / 2 - $dialog.parent().width() / 2;
    $dialog.parent().css('left', width + 'px');
    $dialog.dialog('open');
};

function indicateDialogForDocChange(title, message, callBackFunction, el) {

    closeDialogs();

    var text = '<p><span style="padding-top: 5px; font-size:1.2em;">' + message + '</span></p>';

    var $dialog = $('<div id="dialogBox"></div>').html(text).dialog({
        title : title,
        autoOpen : false,
        resizable : false,
        modal : true,
        position : "center",
        autoReposition : true,
        closeOnEscape : true,
        draggable : false,
        open : function() {
            $(this).find('#reportVariantNameExists').hide();
        },
        create : function(event, ui) {
            // for disable scrolling
            $('body').css({
                overflow : 'hidden'
            });
            disable_scroll();
        },
        close : function(event, ui) {
            closeDialogs();
        },
        buttons : {
            "OK" : function() {
                callBackFunction(el);
                $(this).dialog("close");
            },
            "Cancel" : function() {
                $(this).dialog("close");
            }
        }
    });
    // width speziell für den ie9
    var width = $(window).width() / 2 - $dialog.parent().width() / 2;
    $dialog.parent().css('left', width + 'px');
    $dialog.dialog('open');
};

/**
 * Schließt das geöffnete dialog --> verhindert das dialog wiederholt geöffnet
 * wird wenn dialog schon offen ist und man wieder eine Abweichung anklickt.
 * Close Dialogs and enable scrolling
 */
function closeDialogs() {
    $("#dialogBox").dialog("destroy");

    // enable scrolling
    $('body').css({
        overflow : 'inherit'
    });
    enable_scroll();
}