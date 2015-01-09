var initialReportingDocument_json_text;

function toggleReportingDataEditorButton() {
    if ($('#docNumberFilter').select2("data").length > 0 && $('#acRegFilter').select2("data").length > 0) {
        $('#reportingDataEditor').removeAttr('disabled');
        $('#reportingDataEditor').removeClass('disabled');
    } else {
        $('#reportingDataEditor').addClass('disabled');
        $('#reportingDataEditor').attr('disabled', 'disabled');
    }
}

function initReportingDataEditor() {
    hideAllMessages();
    initialReportingDocument_json_text = undefined;
    toggleFunctionButtons(true);
    initLegendToggleButtons();
    // $('#adSbStatusQCGrid').unblock();
    restoreToggleLegend(toggleLegendMemory);
    // restoreSortOrderSetting();
    // window.scrollTo(0, 0);

    addAddButtonToSourceTaskDeviationItems($('#adSbStatusQCGrid .canAddNewItem'), 'qcSTCell-editable');

    addEditableClassToSourceTaskDeviationItems($('#adSbStatusQCGrid .editTextArea'), $('#adSbStatusQCGrid .editText'));

    /**
     * Es werden die Buttons/Funktionen Confirm, Reject und Delete funktionen
     * behandelt
     */
    $('.buttonQCDocumentBrowsing').click(function(e) {
        e.preventDefault();
        closeDialogs();
        var browsingParams = {
            'text' : $(this).data('text'),
            'path' : $(this).data('path')
        };
        var id = $(this).attr('id');
        if (id === 'updateReportingDocument') {
            saveReportingDocument(browsingParams);
        } else if (id === 'deleteReportingDocument') {
            showMessageDialog("Delete Reporting Document?", "Please note the document will be deleted!", deleteReportingDocument, browsingParams);
        } else if (id === 'reloadReportingDocument') {
            showReportingDataEditor();
        }
        return false;
    });

    // create json for checkForUnsavedReportingDocumentChanges after gui
    // (editable) initializations
    var initialReportingDocumentForm = getReportingDocumentForm();
    initialReportingDocument_json_text = JSON.stringify(initialReportingDocumentForm);

    window.onbeforeunload = function(e) {
        if (hasUnsavedReportingDocumentChanges()) {
            return "This page has unsaved changes. Do you want to leave this page?";
            // return "You have attempted to leave this page. You have made
            // changes for the Document without saving, your changes will be
            // lost. Are you sure you want to exit this page?";
        }
    };

}

function hasUnsavedReportingDocumentChanges() {
    if (!initialReportingDocument_json_text) {
        return false;
    }

    var actualReportingDocumentForm = getReportingDocumentForm();
    actualReportingDocument_json_text = JSON.stringify(actualReportingDocumentForm);

    return (actualReportingDocument_json_text !== initialReportingDocument_json_text);

}

/**
 * Entfernt das Reporting Document auf dem Server
 * 
 * @param browsingParams
 */
function deleteReportingDocument(browsingParams) {

    hideAllMessages();
    var requestParameter = getReportingDocumentForm();

    $('#adSbStatusQCGrid').block({
        message : '<h1>' + browsingParams.text + '</h1>'
    });

    $.ajax({
        url : browsingParams.path,
        type : 'POST',
        dataType : "json",
        data : requestParameter
    }).done(function(data) {
        $('#adSbStatusQCGrid').unblock();
        iterateMessages(data);
        if (hasMessages(data.success)) {
            initialReportingDocument_json_text = undefined;
        }

        if (!hasMessages(data.errors)) {
            $('#adSbStatusQCGrid').empty();
        }

    }).fail(function(jqXHR, textStatus, errorThrown) {
        setMessages([ 'Failed to delete the Reporting Document: ' + errorThrown ], '#errorMsg');
        $('#adSbStatusQCGrid').unblock();
    });

    return false;
}

/**
 * Sendet/Speichert die Document Header- und SourceTask-Daten an den Server
 * 
 * @param browsingParams
 */
function saveReportingDocument(browsingParams) {

    if (!validateDocFormData($('#adSbReportingDocumentForm'))) {
        return;
    }

    hideAllMessages();
    var requestParameter = getReportingDocumentForm();

    $('#adSbStatusQCGrid').block({
        message : '<h1>' + browsingParams.text + '</h1>'
    });

    $.ajax({
        url : browsingParams.path,
        type : 'POST',
        dataType : "json",
        data : requestParameter
    }).done(function(data) {
        $('#adSbStatusQCGrid').unblock();
        iterateMessages(data);
        if (hasMessages(data.success)) {
            initialReportingDocument_json_text = undefined;
        }

        if (!hasMessages(data.errors)) {
            $('#adSbStatusQCGrid').empty();
        }

    }).fail(function(jqXHR, textStatus, errorThrown) {
        setMessages([ 'Failed to save the Reporting Document: ' + errorThrown ], '#errorMsg');
        $('#adSbStatusQCGrid').unblock();
    });

    return false;

}
function reportingDocumentActionCallBack(response, status, xhr) {
    iterateMessages(response);
    if (status == "error") {
        var msg = "Sorry but there was an error: ";
        console.log(msg + xhr.status + " " + xhr.statusText);
        showMessage("Error at Confirm", "Failed to save the Reporting Document");
    } else {
        if (response.success) {
            console.log("success response in reportingDocumentActionCallBack");
        } else {
            console.log("failed message in response at reportingDocumentActionCallBack");
            showMessage("Error at Confirm", "Failed to save the Reporting Document");
            setMessages([ 'Validation for save Reporting Data failed' ], '#errorMsg');
        }
    }

    $('#adSbStatusQCGrid').unblock();
    initReportingDataEditor();
    // toggleFunctionButtons(true);
    // restoreToggleLegend(toggleLegendMemory);
    // restoreSortOrderSetting();
    // window.scrollTo(0, 0);

}

/**
 * Liefert die Document Header- und SourceTask-Daten die gespeichert werden
 * sollen
 * 
 * @returns getReportingDocumentForm
 */
function getReportingDocumentForm() {
    var reportingDocumentForm = undefined;
    var sourceTaskArray = new Array();

    // Source Tasks/DocDetails
    sourceTasks = $('#qcDocSourceTasksTable tr.rowQCSourceTask');

    if (sourceTasks.size() == 0) {
        // Keine Abweichungen in docDetails, also nix zu apply'en in den Details
        sourceTasks = $('#qcDocSourceTasksTable tr.rowQCSourceTask');
        // oder tr.rowQCSourceTaskReporting
    }

    $.each(sourceTasks, function() {
        // Source Task Values auslesen
        var matRefsArray = new Array();
        var mtRefs = $(this).find('div[name=mtRef]');
        $.each(mtRefs, function(index, element) {
            matRefsArray.push($(this).text());
        });

        var sourceTaskJsonData = {
            id : $(this).attr('id'),
            staskNumber : $(this).find('div[name=staskNumber]').text(),
            stDocument : $(this).find('div[name=stDocument]').text(),
            methodOfCompliance : htmlToTxt($(this).find('div[name=methodOfCompliance]').html().replace(/<br[\s\/]?>/gi, '\n')),
            acReg : $(this).find('div[name=acReg]').text(),
            complTimeMT : htmlToTxt($(this).find('div[name=complTimeMT]').html().replace(/<br[\s\/]?>/gi, '\n')),
            mtRefs : matRefsArray.toString(),
            repeatIntervalDays : $(this).find('div[name=repeatIntervalDays]').text(),
            repeatIntervalFH : $(this).find('div[name=repeatIntervalFH]').text(),
            repeatIntervalFC : $(this).find('div[name=repeatIntervalFC]').text(),
            completionDate : $(this).find('div[name=completionDate]').text(),
            completionFH : $(this).find('div[name=completionFH]').text(),
            completionFC : $(this).find('div[name=completionFC]').text(),
            nextDueDat : $(this).find('div[name=nextDueDat]').text(),
            nextDueFH : $(this).find('div[name=nextDueFH]').text(),
            nextDueFC : $(this).find('div[name=nextDueFC]').text(),
            staskStatus : $(this).find('div[name=staskStatus]').text()
        };

        sourceTaskArray.push(sourceTaskJsonData);

    });
    // console.log("QCSourceTaskJSONData: " + JSON.stringify(sourceTaskArray));

    // Document Header Values auslesen
    $.each($('#adSbStatusQCDocHeadTable tr.rowQCDocumentHeader'), function() {
        // console.log("ActualQCDocumentIndex:" +
        // $("#hiddenActualQCDocumentIndex").val());

        var refRemarkArray = new Array();
        var refRemarks = $(this).find('div[name=refRemark]');
        $.each(refRemarks, function(index, element) {
            refRemarkArray.push($(this).text());
        });

        var aarRefArray = new Array();
        var aarRefs = $(this).find('div[name=aarRef]');
        $.each(aarRefs, function(index, element) {
            aarRefArray.push($(this).text());
        });

        reportingDocumentForm = {
            docNumber : $(this).find('div[name=docNumber]').text(),
            adEffectDate : $(this).find('div[name=adEffectDate]').text(),
            revisionIssue : $(this).find('div[name=revisionIssue]').text(),
            docTempType : $(this).find('div[name=docTempType]').text(),
            revisionIssueTempDoc : $(this).find('div[name=revisionIssueTempDoc]').text(),
            adAmendment : $(this).find('div[name=adAmendment]').text(),
            docTitle : htmlToTxt($(this).find('div[name=docTitle]').html().replace(/<br[\s\/]?>/gi, '\n')),
            complTimeSD : htmlToTxt($(this).find('div[name=complTimeSD]').html().replace(/<br[\s\/]?>/gi, '\n')),
            refRemarks : refRemarkArray.toString(),
            aarRefs : aarRefArray.toString()
        };

        for (var i = 0; i < sourceTaskArray.length; i++) {

            for ( var p in sourceTaskArray[i]) {
                if (sourceTaskArray[i].hasOwnProperty(p)) {
                    reportingDocumentForm["reportingDetails[" + i + "]." + p] = sourceTaskArray[i][p];
                }
            }

        }

        // console.log("reportingDocumentForm: " +
        // JSON.stringify(reportingDocumentForm));
    });
    return reportingDocumentForm;
}