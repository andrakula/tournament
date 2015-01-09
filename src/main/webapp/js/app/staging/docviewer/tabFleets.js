$(function() {

    /**
     * bind add comment form submit event
     */
    $(document).on('click', '#tabFleetsContent #saveFleet', function(e) {
        $('#selectedCustomerFleets option').prop('selected', true);
        $('#docViewerFleetForm').docViewerSubmitForm({
            afterSuccess : function() {
                tabContent.docViewerFleetForm = '';
                reloadTree('DOCTYPE', $("#docTree").dynatree("getActiveNode").data.key);

            }
        });
    });

});

function moveSelectedOnly(src, dest) {
    $(src + ' option:selected').each(function() {
        $(this).detach().appendTo($(dest));
    });
    sort(dest.substring(1));
    tabContent.docViewerFleetForm = "changed";
}

function moveAll(src, dest) {
    $(src + ' option').each(function() {
        $(this).detach().appendTo($(dest));
    });
    sort(dest.substring(1));
    tabContent.docViewerFleetForm = "changed";
}

function sort(id) {
    var selectElementId = $("#" + id);
    selectElementId.html($("option", selectElementId).sort(function(a, b) {
        return a.text == b.text ? 0 : a.text < b.text ? -1 : 1;
    }));
}