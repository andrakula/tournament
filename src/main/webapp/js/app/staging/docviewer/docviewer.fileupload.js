$(function() {

    $(document.body).append('<div id="firefox-fileupload-temp" style="height:1px;width:1px;" contenteditable="true" ></div>');
    $(document.body).append(
            '<div class="canvas" style="display:none;"><canvas id="pasteImgCanvas" width="1" height="1" class="empty"></canvas></div>');

    if (document.body.addEventListener) {
        document.body.addEventListener('paste', function(e) {

            var visiblePasteContainer = $('.pasteContainer:visible');

            if (visiblePasteContainer.length == 1) {
                var visibleFileupload = visiblePasteContainer.find('input[type=file]');
                var visibleFileAttachmentName = visiblePasteContainer.find('input[name=fileAttachementName]');
                var visibleFileAttachmentAsStringField = visiblePasteContainer.find('input[name=fileAttachementAsString]');

                if ($.browser.mozilla) {
                    $('#firefox-fileupload-temp').focus();
                    $('#firefox-fileupload-temp img').remove();
                    setTimeout(function() {
                        loadCanvas($('#firefox-fileupload-temp img').attr('src'), visiblePasteContainer);

                    }, 1);

                } else {

                    for (var i = 0; i < e.clipboardData.items.length; i++) {
                        if (e.clipboardData.items[i].kind == "file" && e.clipboardData.items[i].type == "image/png") {

                            var imageFile = e.clipboardData.items[i].getAsFile();
                            var fileReader = new FileReader();
                            fileReader.onloadend = function(eventOnLoadEnd) {

                                visibleFileAttachmentName.val("screenshot_" + moment.utc().format('DD-MMM-YYYY_HH-mm-ss').toUpperCase());
                                visibleFileAttachmentAsStringField.val(this.result);
                                showPastedImageLink(visibleFileupload, visibleFileAttachmentName, visibleFileAttachmentAsStringField);
                            };

                            fileReader.readAsDataURL(imageFile);
                        }
                        e.preventDefault();
                        break;

                    }
                }
            }
            return false;
        });
    }

});

(function($) {
    $.fn.pasteFileUpload = function() {

        this.each(function() {
            var filename = $(this).find('input[name=fileAttachementName]');
            var fileupload = $(this).find('input[type=file]');
            var base64Attachment = $(this).find('input[name=fileAttachementAsString]');

            if (filename.val()) {
                showPastedImageLink(fileupload, filename, base64Attachment);

            } else {
                filename.attr('disabled', 'disabled');
                base64Attachment.attr('disabled', 'disabled');
            }

        });
    };

})(jQuery);

function showPastedImageLink(fileupload, filename, base64Attachment) {
    fileupload.attr('disabled', 'disabled').hide();
    filename.removeAttr('disabled');
    base64Attachment.removeAttr('disabled');

    var screenLink = fileupload.parent().find('.screenShotName');

    if (screenLink.length > 0) {
        screenLink.text(filename.val());
    } else {
        fileupload.parent().append('<a href="#" class="screenShotName">' + filename.val() + '</a>');
        fileupload.parent().append('<a href="#" class="delFileAttachement">x</a>');
    }
    if (base64Attachment.val()) {
        fileupload.parent().find('a.screenShotName').click(function() {
            displayScreenshotOnClick(base64Attachment, filename);
        });

    }

    fileupload.parent().find('a.delFileAttachement').click(function() {
        fileupload.removeAttr('disabled').show();
        filename.attr('disabled', 'disabled');
        base64Attachment.attr('disabled', 'disabled');
        fileupload.parent().find('a.screenShotName').remove();
        fileupload.parent().find('a.delFileAttachement').remove();
        fileupload.parent().find('input[name=deleteAttachement]').val(true);
    });
}

function loadCanvas(dataURL, pasteContainer) {

    var canvas = document.getElementById('pasteImgCanvas');
    var ctx = canvas.getContext('2d');

    var imageObj = new Image();
    imageObj.onload = function() {
        var width = this.width;
        var height = this.height;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(this, 0, 0, width, height);
        var visibleFileupload = pasteContainer.find('input[type=file]');
        var visibleFileAttachmentName = pasteContainer.find('input[name=fileAttachementName]');
        var visibleFileAttachmentAsStringField = pasteContainer.find('input[name=fileAttachementAsString]');

        visibleFileAttachmentName.val("screenshot_" + moment.utc().format('DD-MMM-YYYY_HH-mm-ss').toUpperCase());
        visibleFileAttachmentAsStringField.val(dataURL);
        showPastedImageLink(visibleFileupload, visibleFileAttachmentName, visibleFileAttachmentAsStringField);
    };
    imageObj.src = dataURL;

}

function displayScreenshotOnClick(base64AttachmentField, filenameField) {

    $('<div id="dialog" title="' + filenameField.val() + '"><img id="dialogImg"/></div>"').dialog({
        dialogClass : 'dialog-window',
        width : 800,
        height : 650,
        modal : true,
        close : function(event, ui) {
            $(this).dialog('destroy').remove();
        }
    });
    $("div.dialog-window div button:nth-child(1)").addClass("standard");
    $('#dialogImg').attr('src', base64AttachmentField.val()).attr('width', '750').attr('height', '600');

}