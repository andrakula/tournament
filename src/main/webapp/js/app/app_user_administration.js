function checkForUnsavedChanges() {
    return true;
}

$(document).ready(function() {
    // init tab navigation
    $("#tabbarUserRole").tabnav({
        openTabId : $("#hiddenCurrentTab").val(),
        validatorCallback : checkForUnsavedChanges
    });

    initEvents();

    // set style of toggle-button
    var btn = $("#allOperatorBtn");
    if (btn.attr("down") == "Y") {
        btn.attr("class", "toggle-button");
        // disable Operator selection
        $("#selectedAssignedOperatorList").attr("disabled", "disabled");
        $("#selectedOperators").attr("disabled", "disabled");
        $('.btnShuffleCF').hide();
    } else {
        btn.attr("class", "button standard");
        // enable Operator selection
        $("#selectedAssignedOperatorList").removeAttr("disabled");
        $("#selectedOperators").removeAttr("disabled");
    }

    $('#users').focus();

    $("#users, #refusers").autocomplete({
        source : function(request, response) {
            $.post(contextPath + '/app/admin/user/autocomplete', {
                term : request.term,
                nd : Math.round(new Date().getTime())
            }, response);
        },
        minLength : 1,
        matchContains : true,
        select : function(event, ui) {
            $(this).val(ui.item.id);
            return false;
        }
    });

});

// submit
function submitCommand(command) {
    // check if user was added, and should be deleted
    if ('delete' == command) {
        if ('' == $('#currentUserId').val()) {
            alert("You have to select a User.");
            return false;
        } else if ('false' == $('#newUserProfile').val()) {
            // show confirm, if user is an existing user in m/compliance
            var answer = confirm("Really delete User?");
            if (false == answer) {
                // no submit
                return false;
            }
        }
    } else if ('deleteRole' == command) {
        var roleName = $('#hiddenRoleTabCurrentRoleName').val();
        // show confirm
        var answer = confirm("Really delete Role '" + roleName + "?");
        if (false == answer) {
            // no submit
            return false;
        }
    } else if ('saveRole' == command) {
        var roleName = $('#hiddenRoleTabCurrentRoleName').val();
        // show confirm
        var answer = confirm("Really save Role '" + roleName + "''?");
        if (false == answer) {
            // no submit
            return false;
        }
    }

    $('#task').val(command);
    $('#INSTANCE_ID').val("${INSTANCE_ID}");

    // TODO: showLoadingPanel()

    if ('save' == command) {
        // *** Check if at least 1 Operator and a Role is selected. If not, show
        // alert.
        var alertMsg = "";
        if (0 == $('#selectedAssignedOperatorList').children('option').length) {
            if ("N" == $("#allOperatorBtn").attr("down")) {
                alertMsg = "You have to assign at least 1 Customer Fleet to this User.\n";
            }
        }
        var selecctedRole = $('#selectedAssignedRoleList').val();
        if (selecctedRole == '') {
            alertMsg = alertMsg + "You have to assign a role to this user.";
        }
        if ("" != alertMsg) {
            alert(alertMsg);
            return false;
        }

        // assigned customer fleets, so they are stored in the
        // UserAdministrationForm
        $('#selectedAssignedOperatorList').children('option').each(function() {
            $(this).prop('selected', true);
        });
    }

    $('#userAdministrationForm').submit();
} // end of submitCommand(..)

function initEvents() {
    // [return] button triggers [search]
    $('#users').keypress(function(event) {
        if (event.which == 13) {
            $('#search').click();
        }
    });

    // do submit when these elements are clicked
    // $('#delete, #save, #search, #download, #add,
    // #copyauth').click(function(){
    $('.button').click(function() {
        submitCommand(this.id);
    });

    // toggle [All Operators] button
    $("#allOperatorBtn").click(function() {
        if ($(this).attr("down") == "Y") {
            $(this).attr("class", "button standard");
            $(this).attr("down", "N");
            $('.btnShuffleCF').show();
            $("#allOperator").attr("value", "N");
            $("#selectedAssignedOperatorList").removeAttr("disabled");
            $("#selectedOperators").removeAttr("disabled");
        } else {
            $(this).attr("class", "toggle-button");
            $(this).attr("down", "Y");
            $("#allOperator").attr("value", "Y");
            $('.btnShuffleCF').hide();
            $("#selectedAssignedOperatorList").attr("disabled", "disabled");
            $("#selectedOperators").attr("disabled", "disabled");
        }
    });
}

// enable [Add] button if more than 1 character in newUser field
function enableAddButton() {
    var newUser = $('#newUser');
    if (newUser.length > 0) {
        if (0 < newUser.val().length) {
            // enable
            $('#add').removeAttr('disabled');
            $('#add').removeClass('disabled');
        } else {
            // disable
            $('#add').attr('disabled', 'disabled');
            $('#add').attr('class', 'button standard disabled');
        }
    }
}

function focusTextfield() {
    $('#users').focus();
}

function moveSelectedOnly(src, dest) {
    $(src + ' option:selected').each(function() {
        $(this).detach().appendTo($(dest));
    });
    sort(dest.substring(1));
    focusTextfield();
}

function moveAll(src, dest) {
    $(src + ' option').each(function() {
        $(this).detach().appendTo($(dest));
    });
    sort(dest.substring(1));
    focusTextfield();
}

function sort(id) {
    var selectElementId = $("#" + id);
    selectElementId.html($("option", selectElementId).sort(function(a, b) {
        return a.text == b.text ? 0 : a.text < b.text ? -1 : 1;
    }));
}
