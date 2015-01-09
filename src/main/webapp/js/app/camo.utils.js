// isDate in DD-MMM-YYYY Format
function isValidDateFormat(value) {

    if (value == '') {
        return false;
    }

    // Declare Regex
    var rxDatePattern = /^(\d{2})-(?:|(JAN)|(FEB)|(MAR)|(APR)|(MAY)|(JUN)|(JUL)|(AUG)|(SEP)|(OCT)|(NOV)|(DEC))-(\d{4})$/;

    var dtArray = value.match(rxDatePattern);

    if (dtArray == null) {
        return false;
    }

    var dtDay = parseInt(dtArray[1]);
    var dtMonth = parseInt(dtArray[2]);
    var dtYear = parseInt(dtArray[14]);

    if (isNaN(dtMonth)) {
        for (var i = 2; i <= 15; i++) {
            if ((dtArray[i])) {
                dtMonth = i - 1;
                break;
            }
        }
    }

    if (dtMonth < 1 || dtMonth > 12) {
        return false;
    } else if (dtDay < 1 || dtDay > 31) {
        return false;
    } else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31) {
        return false;
    } else if (dtMonth == 2) {
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay > 29 || (dtDay == 29 && !isleap)) {
            return false;
        }
    }

    return true;
}

// serialize a form for jqgrid to apply also paging parameter
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [ o[this.name] ];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

(function($) {
    /**
     * DocViewerAdmin form submit
     */
    $.fn.submitForm = function(config) {

        var options = $.extend({
            type : 'post',
            dataType : 'text',
            enctype : 'multipart/form-data',
            beforeSubmit : function(toBeSubmittedFormFields, toBeSubmittedForm) {
                removeEmptyFileFormFields(toBeSubmittedFormFields);
                toBeSubmittedForm.block({
                    message : '<h1>Saving changes.</h1>'
                });
            },
            success : function(responseText, statusText, xhr, submittedForm) {
                if (navigator.userAgent.search("MSIE 9") > 0) {
                    if (typeof xhr.responseText === "undefined") {
                        submittedForm.reset();
                        submittedForm.find("[class*='input-error']").removeClass('input-error');
                        submittedForm.find("textarea").text('');
                    } else {
                        submittedForm.parent().html(xhr.responseText);
                    }
                } else if (navigator.userAgent.search("MSIE") > 0) {
                    if (typeof responseText.documentElement !== 'undefined') {
                        submittedForm.parent().html(responseText.documentElement.xml);
                    } else {
                        submittedForm.parent().html(xhr.responseText);
                    }
                } else {
                    submittedForm.parent().html(responseText);
                }

                var errorMessagesWrapper = $('#' + this.errorWrapperId);
                var errorMessagesContent = $('#' + this.errorContentId);
                var successMessagesWrapper = $('#' + this.successWrapperId);
                var successMessagesContent = $('#' + this.successContentId);

                if (errorMessagesContent.length > 0) {
                    errorMessagesWrapper.html(errorMessagesContent.html()).show();
                    errorMessagesContent.remove();
                } else if (successMessagesContent.length > 0) {
                    successMessagesWrapper.html(successMessagesContent.html()).show();
                    successMessagesContent.remove();
                } else if (this.successMessage.length > 0) {
                    successMessagesWrapper.html('<h1> ' + this.successMessage + '</h1>').show();
                }

                submittedForm.unblock();
                this.afterSuccess(responseText, statusText, xhr, submittedForm);

            },
            error : function(xhr, statusText, responseText, submittedForm) {

                submittedForm.unblock();
                alert("Problem occurred while executing the operation.");
            },

            afterSuccess : function(responseText, statusText, xhr, submittedForm) {
            },
            successMessage : 'The operation returned successfully.'
        }, arguments[0] || {});

        this.each(function() {
            $(this).ajaxSubmit(options);
        });
    };
})(jQuery);

function checkForKeyValue(json, key, value) {
    for (i in json) {
        if (json[i].hasOwnProperty(key) && json[i][key] === value) {
            return true;
        }
    }
    return false;
}