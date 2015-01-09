function toggleShowOpenTasksButton() {
    if ($('#acRegFilter').select2("data").length > 0) {
        $('#showOpenTasks').removeAttr('disabled');
        $('#showOpenTasks').removeClass('disabled');
    } else {
        $('#showOpenTasks').addClass('disabled');
        $('#showOpenTasks').attr('disabled', 'disabled');
    }
}

function initShowOpenTask() {
    toggleFunctionButtons(true);
    $('#buttonPreviousDocument').click(function() {
        $('#adSbStatusQCGrid').load('adSbStatusQC/previousShowOpenTasks', function() {
            initShowOpenTask();
        });
    });

    $('#buttonNextDocument').click(function() {
        $('#adSbStatusQCGrid').load('adSbStatusQC/nextShowOpenTasks', function() {
            initShowOpenTask();
        });
    });

    $('#toggleLegendDocHead').click(function() {
        var element = $(this).find('i');

        if (element.hasClass('fa-minus-square-o')) {
            element.removeClass('fa-minus-square-o');
            element.addClass('fa-plus-square-o');
            $('#showOpenTaskTableHeader').hide();
        } else {
            element.removeClass('fa-plus-square-o');
            element.addClass('fa-minus-square-o');
            $('#showOpenTaskTableHeader').show();
        }
    });

    $('#toggleLegendST').click(function() {
        var element = $(this).find('i');

        if (element.hasClass('fa-minus-square-o')) {
            element.removeClass('fa-minus-square-o');
            element.addClass('fa-plus-square-o');
            $('#showOpenTaskSubTableHeader').hide();
        } else {
            element.removeClass('fa-plus-square-o');
            element.addClass('fa-minus-square-o');
            $('#showOpenTaskSubTableHeader').show();
        }
    });

    $('#showAllTaskButton').click(function() {
        $(this).hide();
        $('#showOnlyOpenTaskButton').show();
        $('.closeSubDocument').show();
    });

    $('#showOnlyOpenTaskButton').click(function() {
        $(this).hide();
        $('#showAllTaskButton').show();
        $('.closeSubDocument').hide();
    });
}
