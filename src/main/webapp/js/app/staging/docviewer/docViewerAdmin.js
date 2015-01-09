var selectedTreeByConfirm = false;

var tabContent = {
    genInformationForm : '',
    completenessRecordingForm : '',
    responsibilityForm : '',
    statusForm : '',
    docViewerFleetForm : '',
    commentForm : '',
    subscribedForm : '',
    amosForm : ''
};

function filterAttributesChanged(currentNodeType, currentNodeID, currentTab) { // reload
    reloadTree(currentNodeType, currentNodeID);

    if (currentNodeType === '') {
        currentNodeType = $('#currentNodeType').val();
    }
}

// Sets the title Attribute for the export Buttons
function setTitleForGridExportButtons() {
    $('.ui-icon-excel-small').prop('title', 'Excel Export');
    $('.ui-icon-pdf-small').prop('title', 'PDF Export');
}

function fillTreeFilterData(currentNodeType, currentNodeID, isExpanded) {
    // build an object which contains all selected filter criterias

    var selectCustomerString = buildSelectedMultiselectBoxString('customerFilter');
    var selectFleetString = buildSelectedMultiselectBoxString('fleetFilter');
    var selectDocTypeString = buildSelectedMultiselectBoxString('docTypeFilter');
    var selectDocNrsString = buildSelectedMultiselectBoxString('docNrFilter');
    currentNodeType = $('#currentNodeType').val();
    currentNodeID = $('#currentNodeID').val();

    return {
        "customers" : selectCustomerString,
        "customerFleets" : selectFleetString,
        "docTypes" : selectDocTypeString,
        "docNrs" : selectDocNrsString,
        "currentNodeType" : currentNodeType,
        "currentNodeID" : currentNodeID,
        "nodeExpanded" : isExpanded
    };
}

function buildSelectedMultiselectBoxString(elementId) {
    var filterBox = $('#' + elementId).select2("data");

    var selectedValues = '';
    for (var i = 0; i < filterBox.length; i++) {
        if (selectedValues.length > 0) {
            selectedValues += ",";
        }
        selectedValues += filterBox[i].id;
    }

    return selectedValues;
}

function buildSelectedMultiselectBoxStringWithNames(elementId) {
    var filterBox = $('#' + elementId).select2("data");

    var selectedValues = '';
    for (var i = 0; i < filterBox.length; i++) {
        if (selectedValues.length > 0) {
            selectedValues += ",";
        }
        selectedValues += filterBox[i].text;
    }

    return selectedValues;
}

function reloadTree(currentNodeType, currentNodeID) {
    var tree = $('#docTree').dynatree("getTree");
    var node = $("#docTree").dynatree("getActiveNode");
    var isExpanded = false;
    if (node !== null && node != 'undefined') {
        isExpanded = node.isExpanded();
    }
    tree.options.ajaxDefaults.data = fillTreeFilterData(currentNodeType, currentNodeID, isExpanded);
    tree.reload();
}

function treeNodeSelected(node) {
    var doNotLoadTabContent = false;

    if (selectedTreeByConfirm) {
        doNotLoadTabContent = true;
    }

    if (someTabContentChanged() && false === selectedTreeByConfirm) {
        // ask for save
        var dontWantToSave = confirm("There are unsaved changes, that will be lost. Do you want to go to next element? ");
        if (false === dontWantToSave) {
            selectedTreeByConfirm = true;
            $("#docTree").dynatree("getTree").activateKey($('#currentNodeID').val());
            return false;
        }
        resetTabContentChanged();
    } else {
        selectedTreeByConfirm = false;
    }

    if (doNotLoadTabContent) {
        return false;
    }

    var nodeType = '';
    var key = '';
    var currentTab = '';
    key = node.data.key;

    if (node.data.isDocType) {
        // docType was selected
        nodeType = 'DOCTYPE';
    } else if (node.data.isIssuer) {
        // issuer was selected
        nodeType = 'ISSUER';
    } else if (node.data.isCustomer) {
        // customer was selected
        nodeType = 'CUSTOMER';
    } else {
        alert("Invalid data structure, please refresh Document Viewer Page.");
    }

    $('#currentNodeType').val(nodeType);
    $('#currentNodeID').val(key);

    if ($('#hiddenCurrentTab') !== null) {
        // get currentTab from the hiddenfield
        currentTab = $('#lastSelectedTab').val();
    }

    var selectCustomerString = buildSelectedMultiselectBoxString('customerFilter');
    var selectFleetString = buildSelectedMultiselectBoxString('fleetFilter');
    var selectDocTypeString = buildSelectedMultiselectBoxString('docTypeFilter');

    refreshDocViewerTabs(selectCustomerString, selectFleetString, selectDocTypeString, nodeType, key, currentTab);
}

function refreshDocViewerTabs(selectCustomerString, selectFleetString, selectDocTypeString, nodeType, key, currentTab) {

    hideAllMessages();

    var requestParameter = {
        "filterCustomers" : selectCustomerString,
        "filterFleets" : selectFleetString,
        "filterDocTyps" : selectDocTypeString,
        "key" : key,
        "nodeType" : nodeType,
        "currentTab" : currentTab
    };

    $('#details').load(contextPath + '/app/staging/docvieweradmin/tabs', requestParameter, function() {
        $(document).trigger('docviewerTabRefresh');
    });

}

function resetTabContentChanged() {
    for ( var prop in tabContent) {
        tabContent[prop] = '';
    }
}

function someTabContentChanged() {

    for ( var prop in tabContent) {
        if ('' !== tabContent[prop]) {
            return true;
        }
    }

    return false;
}

// called before tab-change - returns true, if tab-change is allowed
function checkForUnsavedChanges(tabId) {
    $('#lastSelectedTab').val(tabId);
    hideAllMessages();
    return true;
}

function onPostInit(isReloading, isError) {
    $("#docTree").dynatree('getRoot').visit(function(node) {
        if (node.data.isActivate && node.data.isExpand) {
            node.activate();
            node.expand(true);
            node.makeVisible();
            scrollToActiveNode(node, -40);
        } else if (node.data.isActivate) {
            node.activate();
            scrollToActiveNode(node, -40);
        }
    });
}

// parameters: activeNode and offset-value
function scrollToActiveNode(node, offset) {
    var nodeLi = node.li;
    $("#docTree ul").scrollTo($(nodeLi), {
        offset : offset
    });
}

function hideAllMessages() {
    $('#successMsg').hide();
    $('#successMsg').empty();
    $('#errorMsg').hide();
    $('#errorMsg').empty();
    $('#warningMsg').hide();
    $('#warningMsg').empty();
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

/**
 * Function to move content with error messages from hidden div inside tab on
 * top over tabs
 */
function handleDocViewerErrorMessages() {

    var errorsContObj = $("#docViewerErrorMessages");
    if (errorsContObj.length > 0 && errorsContObj.text().length > 0) {
        $("#errorMsg").html(errorsContObj.html()).show();
        errorsContObj.remove();
    }
}