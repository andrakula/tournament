var qcPopupWindow = null;
var showAllSorceTasksOfDocDetails = false;
var selectedQCstRowKey_forPopView = null;
var toggleLegendMemory = new Array();
var startSQAlreadyBinded = false;
var qcDocChanged = false;

function initAdSbStatusSQC() {

    qcDocChanged = false;
    initialReportingDocument_json_text = undefined;
    showAllSorceTasksOfDocDetails = false;
    toggleDocSourceBetween_ERD_and_Reporting(false);
    showHideDocSourceTasksItems();
    addClickHandlerToSourceTaskDeviationItems();
    $('#confirmQC').attr('disabled', true).addClass("disabled");
    // initAdSbStatusSQCTabEvents();

    // init tab navigation
    $("#tabbarInfoForAdSbStatus").tabnav({
        openTabId : $("#hiddenCurrentTab").val(),
        validatorCallback : checkForUnsavedChanges
    // disabledTabs : ${AdSbStatusSQCVO.disabledTabsAsJsonArray}
    });

    clearMessageToQCpopUpWindow();
    if (!startSQAlreadyBinded) {
        startSQAlreadyBinded = true;
        $('#saveReportVariant, #deleteReportVariant, #resetReportFilters').hide();
        $('#saveReportVariant').click(function() {

            if (getPropertyNames(getFilterValues()) === "") {
                showMessage("Report Variants", "Nothing to save");
                return;
            }

            if ($('#saveReportVariant').data('savetype') == 'New Filter') {
                showSaveNewReportVariantDialog(saveFilter);
            } else {
                var filterName = '';
                if ($('#reportVariants-filter').select2('data').length != 0) {
                    filterName = $('#reportVariants-filter').select2('data')[0].text;
                }
                saveFilter(filterName);
            }
        });

        $('#deleteReportVariant').click(function() {
            showDeleteReportVariantDialog($('#reportVariants-filter').select2('data')[0].text, deleteReportVariant);
        });

        $('#resetReportFilters').click(function() {
            resetFilters(true);
            return false;
        });

        $('#startAdSbStatusQS').click(
                function() {
                    hideAllMessages();
                    if (qcDocChanged) {
                        indicateDialogForDocChange("Quality Control Document Changes",
                                "This page has unsaved changes. Do you want to leave this page?", startQC, undefined);
                    } else if (hasUnsavedReportingDocumentChanges()) {
                        indicateDialogForDocChange("Reporting Document Changes", "This page has unsaved changes. Do you want to leave this page?",
                                startQC, undefined);
                    } else {
                        startQC();
                    }
                });

        $('#showOpenTasks').click(
                function() {
                    hideAllMessages();
                    if (qcDocChanged) {
                        indicateDialogForDocChange("Quality Control Document Changes",
                                "This page has unsaved changes. Do you want to leave this page?", showOpenTasks, undefined);
                    } else if (hasUnsavedReportingDocumentChanges()) {
                        indicateDialogForDocChange("Reporting Document Changes", "This page has unsaved changes. Do you want to leave this page?",
                                showOpenTasks, undefined);
                    } else {
                        showOpenTasks();
                    }

                });

        $('#reportingDataEditor').click(
                function() {
                    hideAllMessages();
                    if (qcDocChanged) {
                        indicateDialogForDocChange("Quality Control Document Changes",
                                "This page has unsaved changes. Do you want to leave this page?", showReportingDataEditor, undefined);
                    } else if (hasUnsavedReportingDocumentChanges()) {
                        indicateDialogForDocChange("Reporting Document Changes", "This page has unsaved changes. Do you want to leave this page?",
                                showReportingDataEditor, undefined);
                    } else {
                        showReportingDataEditor();
                    }
                });

    }

    $(window).bind('beforeunload', function() {
        if (qcPopupWindow != null && !qcPopupWindow.closed) {
            qcPopupWindow.close();
        }
    });

    initSQCDocButtons();

    $('#hideFilter').click(function() {
        $('#hideFilter').hide();
        $('#showFilter').show();
        $('#filters').hide();
    });

    $('#showFilter').click(function() {
        $('#showFilter').hide();
        $('#hideFilter').show();
        $('#filters').show();
    });

    window.onbeforeunload = function(e) {
        if (qcDocChanged) {
            return "This page has unsaved changes. Do you want to leave this page?";
            // return "You have attempted to leave this page. You have made
            // changes for the Document without saving, your changes will be
            // lost. Are you sure you want to exit this page?";
        }
    };
}

function resetFilters(closeReportVariantTag) {
    if (closeReportVariantTag) {
        $('#reportVariants-filter').select2('val', "");
    }
    // $("#adSbStatusQCForm [class^='select2-']
    // [class^='select2-']:not(#reportVariants-filter)").select2('val', "");
    $("#adSbStatusQCForm [class^='select2-']:not(.reportVariantsSelection)").select2('val', "");
    $('#qcFromYearDate').val("");
    filterAttributesChanged();
}

function initSQCDocButtons() {
    $('#showAllQSDocSourceTasks').click(function() {
        showHideDocSourceTasksItems();
    });

    /**
     * Es werden die Buttons/Funktionen Confirm, Reject und die Dokumentblättern
     * funktionen vor und zurück behandelt
     */
    $('.buttonQCDocumentBrowsing').click(function(e) {
        e.preventDefault();
        closeDialogs();
        var browsingParams = {
            'text' : $(this).data('text'),
            'path' : $(this).data('path')
        };
        var id = $(this).attr('id');
        if (id === 'confirmQC' || id === 'rejectQC') {
            if (id === 'confirmQC') {
                saveAfterServerValidation(browsingParams);
            } else {
                getNextOrPreviousQCDocument(browsingParams);
            }

        } else {
            checkForUnsavedQCDocumentChanges(browsingParams);
        }
        return false;
    });

    initLegendToggleButtons();
    initSortOrderToggleButtons();
}

function hasHandler(element, event) {
    var ev = $._data(element, 'events');
    return (ev && ev[event]) ? true : false;
}

// called before tab-change - returns true, if tab-change is allowed
function checkForUnsavedChanges(tabId) {
    $('#lastSelectedTab').val(tabId);
    return true;
}

function startQC() {
    toggleFunctionButtons(false);
    clearMessageToQCpopUpWindow();

    var requestParameter = getFilterParams();

    // $('#adSbStatusQCGrid').block({
    // message : '<h1>Start QS</h1>'
    // });
    $('#adSbStatusQCGrid').empty();
    $('#adSbStatusQCGrid').append('<div style="margin-left:15px"><img src="../resources/img/lhtcontrols/loading.gif" /> Loading..</div>');

    $('#adSbStatusQCGrid').load('adSbStatusQC/startQS', requestParameter, nextOrPreviousQCDocumentCallBack);

}

function showOpenTasks() {
    qcDocChanged = false;
    initialReportingDocument_json_text = undefined;
    toggleFunctionButtons(false);
    var requestParameter = getFilterParams();
    $('#adSbStatusQCGrid').empty();
    $('#adSbStatusQCGrid').append('<div style="margin-left:15px"><img src="../resources/img/lhtcontrols/loading.gif" /> Loading..</div>');
    $('#adSbStatusQCGrid').load('adSbStatusQC/showOpenTasks', requestParameter, function() {
        initShowOpenTask();
    });
}

function showReportingDataEditor() {
    hideAllMessages();
    qcDocChanged = false;
    initialReportingDocument_json_text = undefined;
    toggleFunctionButtons(false);
    var requestParameter = getFilterParams();
    $('#adSbStatusQCGrid').empty();
    $('#adSbStatusQCGrid').append('<div style="margin-left:15px"><img src="../resources/img/lhtcontrols/loading.gif" /> Loading..</div>');
    $('#adSbStatusQCGrid').load('adSbReportingDB/startReportingDocumentEditor', requestParameter, function() {
        // initShowOpenTask();
        initReportingDataEditor();
    });
}

function getNextOrPreviousQCDocument(browsingParams) {
    $('#adSbStatusQCGrid').block({
        message : '<h1>' + browsingParams.text + '</h1>'
    });
    $('#adSbStatusQCGrid').load('adSbStatusQC/' + $("#hiddenActualQCDocumentIndex").val() + browsingParams.path, nextOrPreviousQCDocumentCallBack);
}

function getDocWithSortedSTs(sortField, sortOrder) {
    $('#adSbStatusQCGrid').block({
        message : '<h1> Sort.... </h1>'
    });
    $('#adSbStatusQCGrid').load(
            'adSbStatusQC/' + $("#hiddenActualQCDocumentIndex").val() + '/sortQCDocumentSTs?sortField=' + sortField + '&sortOrder=' + sortOrder,
            nextOrPreviousQCDocumentCallBack);
}

function checkForUnsavedQCDocumentChanges(browsingParams) {
    if ($("#adSbStatusQCDocHeadTable div.qcSTCell-Deviation-true").size() == 0 && $("tr.rowQCSourceTask div.qcSTCell-Deviation-true").size() == 0) {
        // Wenn es keine Abweichungen mehr im Kopf und STs gibt nachfragen ob
        // Änderungen gespeichert werden sollen.
        showSaveChangesDialog("Sollen die Änderungen gespeichert werden?", browsingParams);
    } else {
        if (qcDocChanged) {
            indicateDialogForDocChange("Quality Control Document Changes", "If you page to the next document changes will not be saved.",
                    getNextOrPreviousQCDocument, browsingParams);
        } else {
            getNextOrPreviousQCDocument(browsingParams);
        }

    }
    return true;
}

function nextOrPreviousQCDocumentCallBack(response, status, xhr) {
    hideAllMessages();
    if (status == "error") {
        var msg = "Error at Quality Control, failed to load the documents ";
        console.log(msg + xhr.status + " " + xhr.statusText);
        showMessage("Error at Quality Control", "Failed to load the documents");
    }

    initAdSbStatusQCGrid();
    $('#adSbStatusQCGrid').unblock();
    initAdSbStatusSQC();
    restoreToggleLegend(toggleLegendMemory);
    restoreSortOrderSetting();
    window.scrollTo(0, 0);
    toggleFunctionButtons(true);
    var selectedQCstRowKey = undefined;

    // Blättert der User zwischen den Dokumenten sollen ihm im Vergleichsfenster
    // bei vorhandenen Abweichungen in den Kopfdaten immer diese zuerst zur
    // Ansicht gebracht werden.
    if ($("#adSbStatusQCDocHeadTable .qcSTCell-Deviation-true").size() > 0) {
        selectedQCstRowKey = undefined;
    } else {
        // Wenn es keine Abweichungen im Kopf gibt dann die erste ST mit
        // Abweichungen im popUp anzeigen
        selectedQCstRowKey = $("table#qcDocSourceTasksTable tr.docDetailVOitem-deviation-true").first().data("qcst_rowkey");
        if (!selectedQCstRowKey) {// wenn keine abweichende Source Tasks
            // vorhanden, dann nehme id von einen nicht
            // abweichenden ST
            selectedQCstRowKey = $("table#qcDocSourceTasksTable tr.docDetailVOitem-deviation-false").first().data("qcst_rowkey");
        }
    }

    if (qcPopupWindow != null && !qcPopupWindow.closed) {
        openPopUpQCView(selectedQCstRowKey);
    }

}

function openPopUpQCView(selectedQCstRowKey) {
    selectedQCstRowKey_forPopView = selectedQCstRowKey;// später
    if (qcPopupWindow == null || qcPopupWindow.closed) {
        qcPopupWindow = window.open(window.location.href + "/showPopUpQCDocView", "QualityControlPopUp", 'height=' + screen.height + ' width=' +
                screen.width + ', location=no, menubar=no, scrollbars=yes, status=no, toolbar=no, resizable=yes');
    } else {
        // Content ins PopUp schicken erst wenn PopUp geöffnet und geladen ist
        messageToQCpopUpWindow();
    }
    qcPopupWindow.focus();

    // wenn popUP Rückmeldung gibt wird die selectedQCstRowKey behandelt
    return false;
}

function initAdSbStatusQCGrid(tabId) {

}

$(document).ready(
        function() {
            $.initWindowMsg();
            initAdSbStatusSQC();

            /**
             * Es werden die ProcessDaten gesammelt damit diese im Hauptfenster
             * ersetzt werden sollen.
             */
            $('#qcDocView_Status_new #applyNew').click(function(event) {
                if (!validateDocFormData($('#qcSourceDocNewForm'))) {
                    return;
                }

                var stRow = $('#qcDocView_Status_new #qcDocSourceTasksTable tr[id^=docDetailSourceTask-]');
                var stHeadTable = $('#qcDocView_Status_new #adSbStatusQCDocHeadTable:not(.applied)');
                /**
                 * stHeadTable is undefined --> wenn der Header schon applied
                 * wurde erst garnicht zum ersetzen mitsenden
                 */

                var params = {
                    'stHeadTableId' : stHeadTable.attr('id'),
                    'stHeadTableContent' : stHeadTable.html(),
                    'stRowId' : stRow.attr('id'),
                    'stRowContent' : stRow.html(),
                    'toHideOppositeRowID' : $('#qcDocView_Status_old #qcDocSourceTasksTable tr[id^=docDetailSourceTask-]').attr('id'),
                    'editEOHeaderMode' : $('.eoDocTable').data('editEOHeaderMode')
                };
                $.triggerParentEvent("replaceContent", JSON.stringify(params));

                return false;
            });

            /**
             * Es werden die ReportingDaten gesammelt damit diese im
             * Hauptfenster ersetzt werden sollen.
             */
            $('#qcDocView_Status_old #applyOld').click(function(event) {
                if (!validateDocFormData($('#qcSourceDocOldForm'))) {
                    return;
                }

                var stRow = $('#qcDocView_Status_old #qcDocSourceTasksTable tr[id^=docDetailSourceTask-]');
                var stHeadTable = $('#qcDocView_Status_old #adSbStatusQCDocHeadTable:not(.applied)');
                /**
                 * stHeadTable is undefined --> wenn der Header schon applied
                 * wurde erst garnicht zum ersetzen mitsenden
                 */

                var params = {
                    'stHeadTableId' : stHeadTable.attr('id'),
                    'stHeadTableContent' : stHeadTable.html(),
                    'stRowId' : stRow.attr('id'),
                    'stRowContent' : stRow.html(),
                    'toHideOppositeRowID' : $('#qcDocView_Status_new #qcDocSourceTasksTable tr[id^=docDetailSourceTask-]').attr('id'),
                    'editEOHeaderMode' : $('.eoDocTable').data('editEOHeaderMode')
                };

                // ReportingDaten werden ans Hauptfenster geschickt.
                $.triggerParentEvent("replaceContent", JSON.stringify(params));

                return false;
            });

            /**
             * Die im PopUP applied-ten Daten werden im Hauptfenster ersetzt
             */
            $.windowMsg("replaceContent", function(message) {
                var replacer = jQuery.parseJSON(message);
                qcDocChanged = true;

                /**
                 * stHeadTable is undefined --> wenn der Header schon applied
                 * wurde dann wurde auch der Datensatz erst garnicht zum
                 * ersetzen mitgesendet
                 */
                if (replacer.stHeadTableContent != undefined) {
                    $('#' + replacer.stHeadTableId).addClass('applied').html(replacer.stHeadTableContent);
                    $('#' + replacer.stHeadTableId + ' .qcSTCell-Deviation-true').removeClass('qcSTCell-Deviation-true').addClass(
                            'qcSTCell-Deviation-false');
                    $('#' + replacer.stHeadTableId + ' span.fa').remove();
                    $('#' + replacer.stHeadTableId + ' .newRef').removeClass('newRef');

                    /**
                     * Nachdem der Header applied wurde keine neuen ref Einträge
                     * mehr ermöglichen mit remove canAddNewItem-Class
                     */
                    $('#' + replacer.stHeadTableId + ' .canAddNewItem').removeClass('canAddNewItem');
                }

                if ($(replacer.stRowContent).find("div[name=eoNumber]").size() > 0) {
                    pasteEODocValues(replacer.stRowContent, replacer.stRowId, replacer.toHideOppositeRowID, replacer.editEOHeaderMode);
                } else {
                    $('#' + replacer.stRowId).addClass('applied').html(replacer.stRowContent).show();
                    $('#' + replacer.stRowId + ' .qcSTCell-Deviation-true').removeClass('qcSTCell-Deviation-true').addClass(
                            'qcSTCell-Deviation-false');
                    $('#' + replacer.stRowId + ' span.fa').remove();
                    $('#' + replacer.stRowId + ' .newRef').removeClass('newRef');

                    if (replacer.toHideOppositeRowID != undefined) {
                        $('#' + replacer.toHideOppositeRowID).hide();
                        $('#' + replacer.toHideOppositeRowID).removeClass('applied');
                        $('#' + replacer.toHideOppositeRowID + ' .qcSTCell-Deviation-true').removeClass('qcSTCell-Deviation-true').addClass(
                                'qcSTCell-Deviation-false');
                    }
                }

                // Prüfen ob noch Abweichungen vorhanden sind
                if ($("#adSbStatusQCDocHeadTable div.qcSTCell-Deviation-true").size() == 0 &&
                        $("tr.rowQCSourceTask div.qcSTCell-Deviation-true").size() == 0) {

                    // wenn keine Abweichungen mehr vorhanden
                    // sind dann
                    // confirm
                    // button aktivieren
                    $('#confirmQC').attr('disabled', false).removeClass("disabled");
                } else {
                    $('#confirmQC').attr('disabled', true).addClass("disabled");
                }

                initLegendToggleButtons();
                restoreToggleLegend(toggleLegendMemory);
            });

            $.windowMsg("updateVariables", function(message) {
                // fuer das wiederherstellen des Zustandes fuer das Auf-
                // und
                // Zuklappen
                var updateArray = jQuery.parseJSON(message);
                toggleLegendMemory[updateArray.hierarchicID] = updateArray.visibleLegend;
            });

            /** Callback von PopUp View */
            $.windowMsg("qcPopUpViewReady", function(message) {
                // Content ins PopUp schicken erst wenn PopUp geöffnet
                // und
                // geladen ist.
                messageToQCpopUpWindow();
            });

            /**
             * Die im Hauptfenster ausgewählten SoureTask(s) Process- und
             * Reportingdaten werden im PopUP eingesetzt um ein Vergleich zu
             * ermöglichen
             */
            $.windowMsg("replacePopUpContent", function(message) {
                // do something with message from parent
                var replacer = jQuery.parseJSON(message);

                if (replacer.sourceTaskRowContentReporting !== undefined) {
                    $('#qcDocView_Status_new_box').html(replacer.docHeadRowContent + '<br/>' + replacer.sourceTaskRowContent);
                } else {
                    $('#qcDocView_Status_new_box').html(replacer.docHeadRowContent);
                }

                if (replacer.sourceTaskRowContentReporting !== undefined) {
                    $('#qcDocView_Status_old_box').html(replacer.docHeadRowContentReporting + '<br/>' + replacer.sourceTaskRowContentReporting);
                } else {
                    $('#qcDocView_Status_old_box').html(replacer.docHeadRowContentReporting);
                }
                $("#qcDocView_Status_old_box tr.rowQCDocumentHeaderReporting").show();
                $("#qcDocView_Status_old_box tr.rowQCSourceTaskReporting").show();

                /**
                 * Sind es im Reporting mehrere zusammengesetzte SourceTasks
                 * (isComposedData) dann haben diese die notApplicable class und
                 * damit können nur die ProcessData übernommen werden, in diesem
                 * Fall können die ProcessData auch nicht editiert werden.
                 */
                if ($("#qcDocView_Status_old_box tr.notApplicable").size() > 0) {
                    $('#qcDocView_Status_old #applyOld').attr('disabled', true).addClass("disabled");
                    addEditableClassToSourceTaskDeviationItems($('#qcDocView_Status_new .qcSTCell-Deviation-true.editTextArea'),
                            $('#qcDocView_Status_new .qcSTCell-Deviation-true.editText'));
                    addAddButtonToSourceTaskDeviationItems($('#qcDocView_Status_new .canAddNewItem'), 'qcSTCell-Deviation-true');
                } else {
                    $('#qcDocView_Status_old #applyOld').attr('disabled', false).removeClass("disabled");
                    addEditableClassToSourceTaskDeviationItems($('#qcDocView_Status_new .qcSTCell-Deviation-true.editTextArea'),
                            $('#qcDocView_Status_new .qcSTCell-Deviation-true.editText'));
                    addAddButtonToSourceTaskDeviationItems($('#qcDocView_Status_new .canAddNewItem'), 'qcSTCell-Deviation-true');
                }
                initLegendToggleButtons();

                // wiederherstellen des Zustandes fuer das Auf- und
                // Zuklappen
                var toggleLegendArr = new Array();
                toggleLegendArr['qcDocView_Status_old_box§toggleLegendDocHead'] = replacer.qcDocView_Status_old_box_toggleLegendDocHead;
                toggleLegendArr['qcDocView_Status_old_box§toggleLegendST'] = replacer.qcDocView_Status_old_box_toggleLegendST;
                toggleLegendArr['qcDocView_Status_new_box§toggleLegendDocHead'] = replacer.qcDocView_Status_new_box_toggleLegendDocHead;
                toggleLegendArr['qcDocView_Status_new_box§toggleLegendST'] = replacer.qcDocView_Status_new_box_toggleLegendST;
                restoreToggleLegend(toggleLegendArr);
            });

            /** Der PopUp Vergleichsbereich (new and old) wird geleert */
            $.windowMsg("clearPopUpContent", function(message) {
                // do something with message from parent;
                $('#qcDocView_Status_new_box').html('');
                $('#qcDocView_Status_old_box').html('');
            });

            /**
             * EO Kopfdaten zuerst bearbeiten. Der PopUp Vergleichsbereich (new
             * and old) wird fuer den EO Header editier Modus initialisiert, nur
             * EO-Header Daten werden angezeigt und EO-Details entfernt
             */
            $.windowMsg("initPopUpEODetailContent", function(message) {
                for (var i = 1; i <= 7; i++) {
                    $('table.eoDocTable tr').find('td:last, th:last').remove();
                    $('.eoDocTable').data('editEOHeaderMode', 'true');
                }

            });

            $('#acRegFilter').bind('change', function(event) {
                toggleShowOpenTasksButton();// event.val.length
                toggleReportingDataEditorButton();
            });

            $('#docNumberFilter').bind('change', function(event) {
                toggleReportingDataEditorButton();
            });

            $('#sendAseMailDiv #sendAseMail').click(function() {
                sendEmailToASE();
            });
        });

function sendEmailToASE() {

    var acNo = '';
    if ($('#qcDocView_Status_new div [name="acReg"]').data('acno') != null) {
        acNo = $('#qcDocView_Status_new div [name="acReg"]').data('acno');
    }

    $.ajax({
        url : contextPath + "/app/staging/adSbStatusQC/emailParams",
        type : 'GET',
        dataType : "json",
        data : {
            acNo : acNo
        },
        success : function(params) {

            var acInfo = "";
            if (params.operatorCode != null) {
                acInfo = params.operatorCode + '/' + params.acType + '/' + params.acReg + '/';
            }

            var subject = params.subjectPrefix + acInfo;
            if ($('#qcDocView_Status_new div [name="eoNumber"]').text() !== "") {
                var doctype = "EO";
                var eoNumber = $('#qcDocView_Status_new div [name="eoNumber"]').text();
                var eoIssue = $('#qcDocView_Status_new div [name="eoIssue"]').text();
                subject += doctype + ' ' + eoNumber;
                if (eoIssue !== "") {
                    subject += '/' + eoIssue;
                }

            } else {
                var doctype = $('#qcDocView_Status_new div [name="docType"]').text();
                var docnumber = $('#qcDocView_Status_new div [name="docNumber"]').text();
                var revisionIssue = $('#qcDocView_Status_new div [name="revisionIssue"]').text();
                var docTempType = $('#qcDocView_Status_new div [name="docTempType"]').text();
                var revisionIssueTempDoc = $('#qcDocView_Status_new div [name="revisionIssueTempDoc"]').text();
                subject += doctype + ' ' + docnumber;
                if (revisionIssue !== "") {
                    subject += '/' + revisionIssue;
                }
                if (docTempType !== "") {
                    subject += '/' + docTempType;
                }
                if (revisionIssueTempDoc !== "") {
                    subject += '/' + revisionIssueTempDoc;
                }
            }

            var body = params.text.split("\\n").join("\n");
            window.location = 'mailto:?cc=' + params.addressCC + '&subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        },
        error : function(xhr, statusText, responseText) {
            alert("Problem occurred while executing the operation for send E-Mail to ASE!\n" + statusText + ", " + responseText + "");
        }
    });

}

/**
 * Es werden die Header und DocDetails, Process und Reporting Daten zu den
 * SourceTask(s) gesammelt und an das PopUp gesendet, damit diese im Pop
 * eingefügt werden sollen.
 */

function messageToQCpopUpWindow() {

    var docHeadRowReporting = undefined;
    var docHeadRow = undefined;
    var sourceTaskRowContent = undefined;
    var sourceTaskRowContentReporting = undefined;

    if ($('table.applied').size() == 1) {
        // wenn der Header schon applied wurde dann auch den appliedten header
        // anzeigen bei der Anzeige der DocDetails/SourceTasks
        docHeadRow = $('<div>').append($('table.applied').clone()).html();
        docHeadRow = $(docHeadRow);

        docHeadRowReporting = docHeadRow;
        // da nur einer applied sein kann ist docHeadRow und docHeadRowReporting
        // gleich

    } else {
        // Header noch nicht applied, für den Vergleichfenster/PopUp beide also
        // Process und Reporting anzeigen
        docHeadRow = $('<div>').append($('table#adSbStatusQCDocHeadTable').clone()).html();
        docHeadRow = $(docHeadRow);
        docHeadRow.find('tr.rowQCDocumentHeaderReporting').remove();

        docHeadRowReporting = $('<div>').append($('table#adSbStatusQCDocHeadTable').clone()).html();
        docHeadRowReporting = $(docHeadRowReporting);
        docHeadRowReporting.find('tr.rowQCDocumentHeader').remove();
    }

    // Die relevanten DocDetails werden für die Anzeige im PopUp gesammelt.
    /**
     * Wenn eine Abweichung im Header angeklickt wird soll nur der Header
     * bearbeitbar sein, also nur Header anzeigen, selectedQCstRowKey_forPopView
     * ist dann undefined.
     */
    if (selectedQCstRowKey_forPopView != undefined) {
        // Es wurde eine Abweichung bei den DocDetails angeklickt
        var sourceTaskRow = $('<div>').append($('table#qcDocSourceTasksTable').clone()).html();// tr.rowQCSourceTask

        sourceTaskRow = $(sourceTaskRow);
        sourceTaskRow.find('tr.rowQCSourceTaskReporting').remove();
        sourceTaskRow.find('tr.rowQCSourceTask:not([data-qcst_rowkey=' + selectedQCstRowKey_forPopView + '])').remove();

        if (!sourceTaskRow.find('td').html()) {
            // keine abweichende Source Tasks vorhanden, Abweichung nur im Kopf
            sourceTaskRowContent = undefined;
        } else {
            sourceTaskRowContent = $('<div>').append(sourceTaskRow.clone()).html();
        }

        var sourceTaskRowReporting = $('<div>').append($('table#qcDocSourceTasksTable').clone()).html();// tr.rowQCSourceTaskReporting

        sourceTaskRowReporting = $(sourceTaskRowReporting);
        sourceTaskRowReporting.find('tr.rowQCSourceTask').remove();
        sourceTaskRowReporting.find('tr.rowQCSourceTaskReporting:not([data-qcst_rowkey=' + selectedQCstRowKey_forPopView + '])').remove();

        if (!sourceTaskRowReporting.find('td').html()) {
            // keine abweichende Source Tasks vorhanden, Abweichung nur im Kopf
            sourceTaskRowContentReporting = undefined;
        } else {
            sourceTaskRowContentReporting = $('<div>').append(sourceTaskRowReporting.clone()).html();
        }

        if ($(sourceTaskRowContent).find("div[name=eoNumber]").size() > 0 && !$(sourceTaskRowContent).find("div[name=eoNumber]").text()) {
            // Ist ein Eo Document. Hierbei ist die Struktur ohne wie sonst mit
            // einer Extra Tabelle für den Header
            // Hier ist der Header in der gleichen Row wie die Details
            // Deswegen applyte Header-Values mit zum PopUp schicken

            var eoissueValueTR = $('table#qcDocSourceTasksTable').find(
                    "[data-eoissuecount='" + $(sourceTaskRowContent).find("tr.rowQCSourceTask").data("eoissuecount") + "'].applied")[0];

            if ($(eoissueValueTR).size() == 0) {
                // kein Abweichungen im Header dann auch kein applied'ten Header
                eoissueValueTR = $('table#qcDocSourceTasksTable ').find(
                        "[data-eoissuecount='" + $(sourceTaskRowContent).find("tr.rowQCSourceTask").data("eoissuecount") + "']")[0];
            }

            if ($(eoissueValueTR).size() > 0) {
                var eoNumber = $(eoissueValueTR).find('div[name=eoNumber]').text();
                var eoIssue = $(eoissueValueTR).find('div[name=eoIssue]').text();
                var eoType = $(eoissueValueTR).find('div[name=eoType]').text();
                var eoTitle = $(eoissueValueTR).find('div[name=eoTitle]').text();
                var complTimeMT = $(eoissueValueTR).find('div[name=complTimeMT]').text();
                var mtRefs = $(eoissueValueTR).find('td[name=mtRefs]');
                mtRefs.removeClass('canAddNewItem');
                var mtRefsTxt = "";
                $.each(mtRefs, function() {
                    mtRefsTxt += $('<div>').append($(this).clone()).html();
                });

                sourceTaskRow.find('div[name=eoNumber]').text(eoNumber);
                sourceTaskRow.find('div[name=eoIssue]').text(eoIssue);
                sourceTaskRow.find('div[name=eoType]').text(eoType);
                sourceTaskRow.find('div[name=eoTitle]').text(eoTitle);
                sourceTaskRow.find('div[name=complTimeMT]').text(complTimeMT);
                sourceTaskRow.find('td[name=mtRefs]').replaceWith(mtRefsTxt);
                sourceTaskRowContent = $('<div>').append(sourceTaskRow.clone()).html();

                sourceTaskRowReporting.find('div[name=eoNumber]').text(eoNumber);
                sourceTaskRowReporting.find('div[name=eoIssue]').text(eoIssue);
                sourceTaskRowReporting.find('div[name=eoType]').text(eoType);
                sourceTaskRowReporting.find('div[name=eoTitle]').text(eoTitle);
                sourceTaskRowReporting.find('div[name=complTimeMT]').text(complTimeMT);
                sourceTaskRowReporting.find('td[name=mtRefs]').replaceWith(mtRefsTxt);
                sourceTaskRowContentReporting = $('<div>').append(sourceTaskRowReporting.clone()).html();
            }

        }

    }

    // Werte setzten die im PoPUp eingefügt werden sollen
    var params = {
        'docHeadRowContent' : $('<div>').append(docHeadRow.clone()).html(),
        'docHeadRowContentReporting' : $('<div>').append(docHeadRowReporting.clone()).html(),
        'sourceTaskRowContent' : sourceTaskRowContent,
        'sourceTaskRowContentReporting' : sourceTaskRowContentReporting,
        // zum wiederherstellen des Zustandes fuer das Auf- und Zuklappen
        'qcDocView_Status_old_box_toggleLegendDocHead' : toggleLegendMemory['qcDocView_Status_old_box§toggleLegendDocHead'],
        'qcDocView_Status_old_box_toggleLegendST' : toggleLegendMemory['qcDocView_Status_old_box§toggleLegendST'],
        'qcDocView_Status_new_box_toggleLegendDocHead' : toggleLegendMemory['qcDocView_Status_new_box§toggleLegendDocHead'],
        'qcDocView_Status_new_box_toggleLegendST' : toggleLegendMemory['qcDocView_Status_new_box§toggleLegendST']
    };

    // Gesammelte Daten an das PopUp senden
    $.triggerWindowEvent(qcPopupWindow, "replacePopUpContent", JSON.stringify(params));

    if ($("#hiddenEOissueVOdeviation").val() === "true" && $("#hiddenEOissueVOdeviationApplied").val() === "false") {
        $.triggerWindowEvent(qcPopupWindow, "initPopUpEODetailContent", JSON.stringify(params));
    }

    return false;
}

/**
 * Message an das PopUp senden damit der PopUp Vergleichsbereich (new and old)
 * geleert werden
 */
function clearMessageToQCpopUpWindow() {
    if (qcPopupWindow != null && !qcPopupWindow.closed) {
        $.triggerWindowEvent(qcPopupWindow, "clearPopUpContent", null);
    }
    return false;
}

function saveAfterServerValidation(browsingParams) {
    hideAllMessages();

    var docForm;
    var validateDocument;
    var saveDocumentType;
    var actualQCDocumentIndex = $("#hiddenActualQCDocumentIndex").val();
    var nextOrPreviousDoc = browsingParams.path;

    if ($('#qcDocSourceTasksTable.eoDocTable').size() > 0) {
        docForm = getEODocumentForm();
        if (!docForm) {
            alert("Can not submit EO Document Form");
            return;
        }
        // === '/previousQCDocument'
        validateDocument = "validateEODocument";
        saveDocumentType = "saveEODocument";
    } else {
        docForm = getQCDocumentForm();
        validateDocument = "validateQCDocument";
        saveDocumentType = "saveQCDocument";
    }

    $('#adSbStatusQCGrid').block({
        message : '<h1> Validate the QC Document </h1>'
    });

    $.ajax({
        url : 'adSbStatusQC/' + validateDocument,
        type : 'POST',
        dataType : "json",
        data : docForm
    }).done(function(data) {
        $('#adSbStatusQCGrid').unblock();
        iterateMessages(data);
        if (hasMessages(data.success)) {
            saveQCDocument(browsingParams, docForm, saveDocumentType, actualQCDocumentIndex, nextOrPreviousDoc);
            return;
        }

        if (hasMessages(data.errors)) {
            showMessage("Error at Confirm", "Failed to save the QC document");
        }

    }).fail(function(jqXHR, textStatus, errorThrown) {
        showMessage("Error at Confirm", "Failed to save the QC document");
        setMessages([ 'Failed to validate the QC Document: ' + errorThrown ], '#errorMsg');
        $('#adSbStatusQCGrid').unblock();
    });
}

/**
 * Sendet/Speichert die Document Header- und SourceTask-Daten an den Server
 * 
 * @param browsingParams
 */
function saveQCDocument(browsingParams, docForm, saveDocumentType, actualQCDocumentIndex, nextOrPreviousDoc) {

    $('#adSbStatusQCGrid').block({
        message : '<h1>' + browsingParams.text + '</h1>'
    });

    $('#adSbStatusQCGrid').load('adSbStatusQC/' + saveDocumentType + 'AndGetNext' + '/' + actualQCDocumentIndex + nextOrPreviousDoc + '/', docForm,
            nextOrPreviousQCDocumentCallBack);

}

/**
 * Liefert die EO Document Header- und SourceTask-Daten die gespeichert werden
 * sollen
 * 
 * @returns eoDocumentForm
 */
function getEODocumentForm() {
    var eoDocumentForm = undefined;

    // Source Tasks/DocDetails

    var eoIssueRow = $('#qcDocSourceTasksTable tr.applied')[0];
    eoIssueRow = $(eoIssueRow);
    var eoIssueRowIndex = eoIssueRow.data('eoissuecount');

    var eoNumber = eoIssueRow.find('div[name=eoNumber]').text();
    if (!eoNumber) {
        eoIssueRow = $.find("[data-eoissuecount='" + eoIssueRowIndex + "'].eoIssueHeaderRow-true")[0];
        eoIssueRow = $(eoIssueRow);
    }

    // eoDetails
    var eoIssueDetailDataArray = new Array();

    var deviationsOnlyInHead = null;

    if ($("#hiddenEOissueVOdeviation").val() === "true" && $("#hiddenEOdetailsVOdeviations").val() === "false") {
        // Keine Abweichungen in docDetails, also nix zu apply'en in den Details
        deviationsOnlyInHead = true;
    }

    var eoIssueDetails = undefined;
    if ($("#hiddenEOissueVOdeviation").val() === "true") {
        // Abweichungen auch im Kopf, dann auch alle Details dazu mitschicken
        eoIssueDetails = $.find("[data-eoissuecount='" + eoIssueRowIndex + "'].applied, [data-eoissuecount='" + eoIssueRowIndex +
                "'].rowQCSourceTask.eoDetailVOitem-deviation-false");
    } else {
        // Keine Abweichungen im Kopf, dann nur die applyten Details schicken
        eoIssueDetails = $.find("[data-eoissuecount='" + eoIssueRowIndex + "'].applied");
    }

    var toSkipEOissueDetailIDs = getToSkipDuplicatedEOissueDetailIDs(eoIssueDetails);

    $.each(eoIssueDetails, function() {

        if ($.inArray($(this).attr('id'), toSkipEOissueDetailIDs) > -1) {
            // Duplikate nicht mitschicken, ist der Fall wenn Header applyt
            // wurde und die Details mitgeschickt werden sollen
            return true;// continue
        }

        var eoIssueDetailData = {
            rowKey : $(this).data('qcst_rowkey'),
            viewID : $(this).attr('id'),
            appliedFromProcess : $(this).data('applied_from_process'),
            stProcessID : $(this).data('st_process_id'),
            stReportingID : $(this).data('st_reporting_id'),
            complianceComments : htmlToTxt($(this).find('div[name=complianceComments]').html().replace(/<br[\s\/]?>/gi, '\n')),
            acReg : $(this).find('div[name=acReg]').text(),
            repeatIntervalDays : $(this).find('div[name=repeatIntervalDays]').text(),
            repeatIntervalFH : $(this).find('div[name=repeatIntervalFH]').text(),
            repeatIntervalFC : $(this).find('div[name=repeatIntervalFC]').text(),
            completionDate : $(this).find('div[name=completionDate]').text(),
            completionFH : $(this).find('div[name=completionFH]').text(),
            completionFC : $(this).find('div[name=completionFC]').text(),
            nextDueDat : $(this).find('div[name=nextDueDat]').text(),
            nextDueFH : $(this).find('div[name=nextDueFH]').text(),
            nextDueFC : $(this).find('div[name=nextDueFC]').text(),
            station : $(this).find('div[name=station]').text(),
            staskStatus : $(this).find('div[name=staskStatus]').text()
        };

        if (deviationsOnlyInHead === true || $(this).hasClass("eoDetailVOitem-deviation-false")) {
            // Abweichungen nur im Kopf, also nix zu apply'en bei den
            // Details
            eoIssueDetailData["appliedFromProcess"] = null;
        }

        eoIssueDetailDataArray.push(eoIssueDetailData);
    });

    // eoIssue
    var matRefsArray = new Array();
    var mtRefs = eoIssueRow.find('div[name=mtRef]');
    $.each(mtRefs, function(index, element) {
        matRefsArray.push($(this).text());
    });
    eoDocumentForm = {
        appliedFromProcess : eoIssueRow.data('applied_from_process'),
        deviationsOnlyInHead : deviationsOnlyInHead,
        eoNumber : eoIssueRow.find('div[name=eoNumber]').text(),
        eoIssue : eoIssueRow.find('div[name=eoIssue]').text(),
        eoType : eoIssueRow.find('div[name=eoType]').text(),
        eoTitle : htmlToTxt(eoIssueRow.find('div[name=eoTitle]').html().replace(/<br[\s\/]?>/gi, '\n')),
        complTimeMT : htmlToTxt(eoIssueRow.find('div[name=complTimeMT]').html().replace(/<br[\s\/]?>/gi, '\n')),
        mtRefs : matRefsArray.toString()
    };

    if ($("#hiddenEOissueVOdeviation").val() === "false") {
        // Keine Abweichungen im Kopf, also nix zu apply'en fuer den Kopf
        eoDocumentForm["appliedFromProcess"] = null;
    }

    for (var i = 0; i < eoIssueDetailDataArray.length; i++) {

        for ( var p in eoIssueDetailDataArray[i]) {
            if (eoIssueDetailDataArray[i].hasOwnProperty(p)) {
                eoDocumentForm["eoDetails[" + i + "]." + p] = eoIssueDetailDataArray[i][p];
            }
        }

    }

    return eoDocumentForm;
}

/**
 * Liefert die QC Document Header- und SourceTask-Daten die gespeichert werden
 * sollen
 * 
 * @returns qcDocumentForm
 */
function getQCDocumentForm() {
    var qcDocumentForm = undefined;
    var sourceTaskArray = new Array();
    var docDataRow = $('tr.rowQCDocumentHeader');
    // Source Tasks/DocDetails
    var sourceTasks;
    if (docDataRow.data("applied_from_process") == true) {
        sourceTasks = $('#qcDocSourceTasksTable tr.applied.rowQCSourceTask, tr.applied.rowQCSourceTaskReporting, tr.docDetailVOitem-deviation-false');
    } else {
        sourceTasks = $('#qcDocSourceTasksTable tr.applied.rowQCSourceTask, tr.applied.rowQCSourceTaskReporting');
    }
    var deviationsOnlyInHead = null;

    if (sourceTasks.size() == 0) {
        // Keine Abweichungen in docDetails, also nix zu apply'en in den Details
        deviationsOnlyInHead = true;
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
            rowKey : $(this).data('qcst_rowkey'),
            viewID : $(this).attr('id'),
            appliedFromProcess : $(this).data('applied_from_process'),
            stProcessID : $(this).data('st_process_id'),
            stReportingID : $(this).data('st_reporting_id'),
            pdIDs : $(this).data('pdids').toString(),
            rdIDs : $(this).data('rdids').toString(),
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

        if (deviationsOnlyInHead === true || $(this).hasClass("docDetailVOitem-deviation-false")) {
            // Abweichungen nur im Kopf, also nix zu apply'en bei den Details
            sourceTaskJsonData["appliedFromProcess"] = null;
        }

        sourceTaskArray.push(sourceTaskJsonData);

    });
    // console.log("QCSourceTaskJSONData: " + JSON.stringify(sourceTaskArray));

    // Document Header Values auslesen
    $.each($('#adSbStatusQCDocHeadTable tr.rowQCDocumentHeader, tr.rowQCDocumentHeaderReporting'), function() {

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

        qcDocumentForm = {
            appliedFromProcess : $(this).data('applied_from_process'),
            deviationsOnlyInHead : deviationsOnlyInHead,
            docNumber : $(this).find('div[name=docNumber]').text(),
            adEffectDate : $(this).find('div[name=adEffectDate]').text(),
            revisionIssue : $(this).find('div[name=revisionIssue]').text(),
            docTempType : $(this).find('div[name=docTempType]').text(),
            revisionIssueTempDoc : $(this).find('div[name=revisionIssueTempDoc]').text(),
            adAmendment : $(this).find('div[name=adAmendment]').text(),
            docTitle : htmlToTxt($(this).find('div[name=docTitle]').html().replace(/<br[\s\/]?>/gi, '\n')),
            complTimeSD : htmlToTxt($(this).find('div[name=complTimeSD]').html().replace(/<br[\s\/]?>/gi, '\n')),
            refRemarks : refRemarkArray.toString(),
            aarRefs : aarRefArray.toString(),
            docStatus : $(this).find('div[name=docStatus]').text()
        };

        if ($("#hiddenDocDataVOdeviation").val() === "false") {
            // Keine Abweichungen im Kopf, also nix zu apply'en fuer den Kopf
            qcDocumentForm["appliedFromProcess"] = null;
        }

        for (var i = 0; i < sourceTaskArray.length; i++) {

            for ( var p in sourceTaskArray[i]) {
                if (sourceTaskArray[i].hasOwnProperty(p)) {
                    qcDocumentForm["docDetailForms[" + i + "]." + p] = sourceTaskArray[i][p];
                }
            }

        }

        // console.log("qcDocumentForm: " + JSON.stringify(qcDocumentForm));
    });
    return qcDocumentForm;
}