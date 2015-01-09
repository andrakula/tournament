$(document).ready(function() {
    // $('#maintTaskId').tabnav();

    var openTabIdvalue = $('#openTabId').val();

    $("#tabbarEngineDetail").tabnav({
        openTabId : (openTabIdvalue === "") ? "tabOverview" : openTabIdvalue
    });

    initMBCountGrid();
});

function initMBCountGrid() {
    var esn = $('#esn').val();
    var urlString = '/app/staging/engine/' + esn + '/mbitems';
    initMessageBoardSummary(urlString);
};