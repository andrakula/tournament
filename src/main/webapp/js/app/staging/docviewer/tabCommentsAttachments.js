function initCommentMultiSelectionCustomers() {
    if ($("#commentsAttachmentsUpper #customers option").length == 1) {
        $("#commentsAttachmentsUpper #customers option").first().attr('selected', 'selected');
    }
    $("#commentsAttachmentsUpper #customers").multiselect(
            {
                height : 145,
                header : false,
                classes : 'dti-comments',
                selectedList : 99,
                position : {
                    my : 'left top',
                    at : 'left bottom'
                },
                click : function(event, ui) {
                    if (ui.value === '-1' && ui.checked) {
                        $("#commentsAttachmentsUpper #customers").multiselect("widget").find(
                                ":checkbox:checked:not(#ui-multiselect-customers-option-0)").click();
                    } else if (ui.value != '-1' && ui.checked) {
                        $('#ui-multiselect-customers-option-0:checkbox:checked').click();
                    }

                    // if nothing is selected -> select the all option
                    var checked = $("#commentsAttachmentsUpper #customers").multiselect("getChecked");
                    if (checked && checked.length < 1) {
                        $('#ui-multiselect-customers-option-0:checkbox').click();
                    }
                },
                open : function() {
                    if ($("#commentsAttachmentsUpper #customers option").length == 1) {
                        $("#commentsAttachmentsUpper #customers").multiselect("close");
                    }
                }
            });
}

function initCommentGrid() {
    $('#commentsAttachments-grid').docViewerGrid({
        url : contextPath + '/app/staging/commentsAttachments/table',
        colNames : [ 'Level', 'Comment', 'Created by', 'Created on', 'Attachment', 'Customer', 'Active', 'Id' ],
        colModel : [ {
            name : 'level',
            index : 'level',
            sortable : false,
            width : 80
        }, {
            name : 'comment',
            index : 'comment',
            sortable : true,
            width : 268
        }, {
            name : 'createUser',
            index : 'createUser',
            sortable : true,
            width : 180
        }, {
            name : 'createDate',
            index : 'createDate',
            sortable : true,
            width : 90,
            align : 'center'
        }, {
            name : 'fileName',
            index : 'fileName',
            sortable : true,
            width : 140,
            formatter : attachmentDownloadLinkFormatter
        }, {
            name : 'customer',
            index : 'customer',
            sortable : false,
            width : 100
        }, {
            name : 'active',
            index : 'active',
            width : 80,
            formatter : commentActiveFormatter,
            classes : 'commentActive',
            align : 'center'
        }, {
            name : 'id',
            index : 'commentsAttachmentsId',
            sortable : false,
            hidden : true,
            key : true,
            width : 1
        } ],
        pager : '#commentsAttachments-grid-pager',
        sortname : 'createDate',
        sortorder : 'desc'
    });
}

function initTabComments() {
    initCommentMultiSelectionCustomers();
    initCommentGrid();
    initCommentActivateOnClickEvent();
}

/**
 * bind add comment form submit event
 */
function initCommentAddListener() {
    $(document).on('click', '#tabCommentsAttachmentsContent #saveComment', function(e) {
        $('#commentForm').docViewerSubmitForm({
            afterSuccess : function() {
                var successMsg = $('#successMessagesComments').val();
                var successElement = $('#successMsg');
                if (successMsg) {
                    successElement.html(successMsg);
                    successElement.show();
                } else {
                    successElement.hide();
                    successElement.empty();
                }

                $("#commentsAttachments-grid").trigger("reloadGrid");
                initCommentMultiSelectionCustomers();
            }
        });
    });
}

$(function() {
    initCommentAddListener();
});
/**
 * bind toggle active/inactive comment event
 */
function initCommentActivateOnClickEvent() {
    $(document).on('click', '#tabCommentsAttachmentsContent #commentsAttachments-grid .commentActive input[type=checkbox]', function() {
        $.ajax({
            type : 'POST',
            data : {
                'commentId' : this.id,
                'active' : $(this).is(':checked')
            },
            url : contextPath + '/app/staging/commentsAttachments/table/active/toggle'
        });
    });
}
