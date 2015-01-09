/**
 * this file has dependency to moment.js
 */

/*
 * Sort Strings and Numbers and append NULL values at the end of list
 */
function sortIntNullsLast(gridId, cellObj, rowObj) {

    var sortOrder = getGridSortOrder(gridId);

    if (sortOrder === 'desc') {
        return isCellObjNull(cellObj) ? -Number.MAX_VALUE : Number(cellObj);
    } else if (sortOrder === 'asc') {
        return isCellObjNull(cellObj) ? Number.MAX_VALUE : Number(cellObj);
    }
};

function sortStrNullsLast(gridId, cellObj, rowObj) {

    var sortOrder = getGridSortOrder(gridId);

    if (sortOrder === 'desc') {
        return isCellObjNull(cellObj) ? ' ' : cellObj;
    } else if (sortOrder === 'asc') {
        return isCellObjNull(cellObj) ? '~' : cellObj;
    }
};

/*
 * Sort Dates and Append NULL values at the end of list
 */
function sortDateNullsLast(gridId, cellObj, rowObj, dateFormat) {

    var sortOrder = getGridSortOrder(gridId);

    dateFormat = typeof dateFormat !== 'undefined' ? dateFormat : 'DD-MM-YYYY';

    if (sortOrder === 'desc') {
        return isCellObjNull(cellObj) ? -Number.MAX_VALUE : moment(cellObj, dateFormat).valueOf();
    } else if (sortOrder === 'asc') {
        return isCellObjNull(cellObj) ? Number.MAX_VALUE : moment(cellObj, dateFormat).valueOf();
    }
};

function getGridSortOrder(gridId) {
    return $("#" + gridId).jqGrid('getGridParam', 'sortorder');
};

function isCellObjNull(cellObj) {
    return cellObj === null || cellObj === '';
};

