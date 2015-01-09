function eDocLink(cellValue, options, rowObject) {
    return '<a href="' + cellValue + '" class="edoc" target="_blank" title="Open document in eDoc"/>';
}

// Refactor fin

function dateTimeFormatter(cellvalue, options, rowObject) {

    // Default Time Format
    var timeFormat = 'DD-MMM-YYYY';

    var result = "";
    var date = moment.utc(cellvalue);

    if (options.colModel.timeFormat) {
        timeFormat = options.colModel.timeFormat;
    }
    if (date !== null && date.isValid()) {
        result = moment.utc(cellvalue).format(timeFormat).toUpperCase();
    }
    return result;
}

function statusFormatter(cellvalue, options, rowObject) {
    return '<div class="status-column-icon status-column-icon-' + cellvalue + '" style="display:block !important;">&#160;</div>';
}

// Sets a new title name
function setColumnHeaderTooltip(gridName, columnName, tooltip) {
    $(gridName).setLabel(columnName, '', '', {
        'title' : tooltip
    });
}

// /complrecord/table/attachement/{completenessCheckId}
function attachmentFormatter(cellvalue, options, rowObject) {

    var id = 'id';

    if (options.colModel.attachId) {
        id = options.colModel.attachId;
    }
    var result = "";
    if (cellvalue) {
        result = '<a class="highlightLink" style="text-decoration: underline" href="' + contextPath +
                '/app/staging/docvieweradmin/complrecord/table/attachement/' + rowObject[id] + '" target="_blank">' + cellvalue + '</a>';
    }

    return result;
}

// STAGING

function attachmentDownloadLinkFormatter(cellvalue, options, rowObject) {
    if (cellvalue === null) {
        cellvalue = '';
    }
    var result = '<a class="highlightLink" style="text-decoration: underline" href="' + contextPath +
            '/app/staging/commentsAttachments/table/attachment/download/' + rowObject.id + '" target="_blank">' + cellvalue + '</a>';
    return result;
}

function deleteButtonFormatter(cellvalue, options, rowObject) {
    var result = '<input type="button" id="' + rowObject['completenessCheckDefinitionId'] +
            '" class="buttondelete button standard delete" value="delete" style="margin-top: 4px;" />';

    return result;
}

function isActiveFormatter(cellvalue, options, rowObject) {
    var result = '<input type="checkbox" name ="isActive" class="isActiveCheckbox" id="' + rowObject['completenessCheckId'] + '"';
    if (eval(cellvalue) == true) {
        result += " checked>";
    } else {
        result += ">";
    }
    return result;
}

function commentActiveFormatter(cellvalue, options, rowObject) {
    var result = '<input type="checkbox" name="isActive" id="' + rowObject.id + '"';
    if (eval(cellvalue) === true) {
        result += " checked";
    }
    result += ">";
    return result;
}

function deleteButtonSubscribeFormatter(cellvalue, options, rowObject) {
    var result = '<input type="button" class="button standard" value="delete" style="margin-top: 4px;" />';

    return result;
}
function checkboxFormatter(cellvalue, options, rowObject) {
    var result = '<input type="checkbox"';
    if (eval(cellvalue) === true) {
        result += " checked";
    }

    result += "/>";
    return result;
}

function radioButtonFormatter(cellvalue, options, rowObject) {
    var result = '<input type="radio" name="selection" value="' + rowObject.id + '"';
    if (eval(cellvalue) === true) {
        result += " checked";
    }

    result += "/>";
    return result;
}
