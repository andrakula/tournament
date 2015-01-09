(function($) {

    $.fn.docViewerGrid = function(config) {

        var options = $.extend({
            // Should be overwritten when used
            url : null,
            colNames : null,
            colModel : null,
            pager : null,
            sortname : null,
            sortorder : null,
            afterGridComplete : function() {
            },

            // default ajax vales
            datatype : 'json',
            mtype : 'POST',

            // default grid values
            jsonReader : {
                page : "pageIdx",
                total : "totalPages",
                records : "totalRecords",
                root : "data",
                repeatitems : false,
                id : "0"
            },
            rowNum : 10,
            rowList : [ 5, 10, 20 ],
            height : 'auto',
            // autowidth : true,
            gridview : true,
            altRows : true,
            altclass : 'gridAltRowClass',
            multiselect : false,
            subGrid : false,
            caption : false,
            shrinkToFit : true,
            viewrecords : true,
            width : 950 - 10 - 5,
            postData : defaultPostParametersDocViewer(),
            gridComplete : function() {
                $(this).setLabel('status', '', '', {
                    'text-align' : 'center'
                });
                $(this).setLabel('isActive', '', '', {
                    'text-align' : 'center'
                });
                $(this).closest('.ui-jqgrid-bdiv').width($(this).closest('.ui-jqgrid-bdiv').width() + 1);
                $(this).getGridParam().afterGridComplete();
            }

        }, arguments[0] || {});

        this.each(function() {
            $(this).jqGrid(options);
        });
    };

    /**
     * DocViewerAdmin form submit
     */
    $.fn.docViewerSubmitForm = function(config) {

        var options = $.extend({
            // Should be overwritten when used
            data : {},
            beforeSending : function(toBeSubmittedFormFields, toBeSubmittedForm, pluginOptions) {
            },
            afterSuccess : function(responseText, statusText, xhr, submittedForm) {
            },
            // successMessage : 'The operation returned successfully.',
            dataType : 'html',
            enctype : 'multipart/form-data',
            errorWrapper : '#errorMsg',
            warningWrapper : '#warningMsg',
            successWrapper : '#successMsg',
            successMessage : 'Successful!',
            displayDefaultSuccessMessage : false,

            // default ajax options
            type : 'post',
            beforeSubmit : function(toBeSubmittedFormFields, toBeSubmittedForm, pluginOptions) {
                $(this.errorWrapper).hide();
                $(this.warningWrapper).hide();
                $(this.successWrapper).hide();
                removeEmptyFileFormFields(toBeSubmittedFormFields);
                toBeSubmittedForm.block({
                    message : '<h1>Saving changes.</h1>'
                });
                this.beforeSending(toBeSubmittedFormFields, toBeSubmittedForm, pluginOptions);
            },
            success : function(responseText, statusText, xhr, submittedForm) {
                if (navigator.userAgent.search("MSIE") > 0 && typeof responseText.documentElement !== "undefined") {
                    submittedForm.parent().html(new XMLSerializer().serializeToString(responseText));
                } else {
                    submittedForm.parent().html(responseText);
                }

                var errorsContObj = $("#docViewerErrorMessages");
                if (errorsContObj.length > 0 && errorsContObj.text().length > 0) {
                    $(this.errorWrapper).html(errorsContObj.html()).show();
                    errorsContObj.remove();
                } else if (this.displayDefaultSuccessMessage) {
                    $(this.successWrapper).html(this.successMessage).show();
                }

                submittedForm.unblock();
                this.afterSuccess(responseText, statusText, xhr, submittedForm);

            },
            error : function(xhr, statusText, responseText, submittedForm) {

                submittedForm.unblock();
                alert("Problem occurred while executing the operation.");
            }

        }, arguments[0] || {});

        this.each(function() {
            $(this).ajaxSubmit(options);
        });
    };

    /**
     * DocViewerAdmin form submit
     */
    $.fn.dialogFormSubmit = function(config) {

        var options = $.extend({
            // Should be overwritten when used
            data : {},
            blockMessage : 'Saving changes.',

            beforeSending : function(toBeSubmittedFormFields, toBeSubmittedForm, pluginOptions) {
            },
            afterSuccess : function(responseText, statusText, xhr, submittedForm) {
            },
            dataType : 'html',
            enctype : 'multipart/form-data',
            errorWrapper : '#errorMsg',
            warningWrapper : '#warningMsg',
            successWrapper : '#successMsg',
            successMessage : 'Successful!',
            displayDefaultSuccessMessage : false,

            // default ajax options
            type : 'post',
            beforeSubmit : function(toBeSubmittedFormFields, toBeSubmittedForm, pluginOptions) {
                $(this.errorWrapper).hide();
                $(this.warningWrapper).hide();
                $(this.successWrapper).hide();
                removeEmptyFileFormFields(toBeSubmittedFormFields);
                toBeSubmittedForm.block({
                    message : '<h1>' + this.message + '</h1>'
                });
                this.beforeSending(toBeSubmittedFormFields, toBeSubmittedForm, pluginOptions);
            },
            success : function(responseText, statusText, xhr, submittedForm) {

                if (navigator.userAgent.search("MSIE") > 0 && typeof responseText.documentElement !== "undefined") {
                    submittedForm.parent().html(new XMLSerializer().serializeToString(responseText));
                } else {
                    submittedForm.parent().html(responseText);
                }

                var errorsContObj = $(this.errorWrapper);
                var successContObj = $(this.successWrapper);
                if (errorsContObj.length > 0 && errorsContObj.text().length > 0) {
                    errorsContObj.show();
                } else if (successContObj.length > 0 && successContObj.text().length > 0) {
                    successContObj.show();
                }

                submittedForm.unblock();
                this.afterSuccess(responseText, statusText, xhr, submittedForm);

            },
            error : function(xhr, statusText, responseText, submittedForm) {

                submittedForm.unblock();
                alert("Problem occurred while executing the operation.");
            }

        }, arguments[0] || {});

        this.each(function() {
            $(this).ajaxSubmit(options);
        });
    };

})(jQuery);

/**
 * @returns post data object from tree and filter selection
 */
function defaultPostParametersDocViewer() {
    var requestParameter = {
        selectedNodeId : function() {
            if ($("#docTree").dynatree("getActiveNode") !== null && $("#docTree").dynatree("getActiveNode") != 'undefined') {
                return $("#docTree").dynatree("getActiveNode").data.key;
            }
        },
        selectedNodeType : function() {
            var activeNode = $("#docTree").dynatree("getActiveNode");
            return activeNode != null ? (activeNode.data.isCustomer ? 'CUSTOMER' : (activeNode.data.isDocType ? 'DOCTYPE' : 'ISSUER')) : null;
        },
        filteredFleetIds : function() {
            return buildSelectedMultiselectBoxString('fleetFilter');
        },
        filteredDoctypeIds : function() {
            return buildSelectedMultiselectBoxString('docTypeFilter');
        },
        filteredOperatorNo : function() {
            return buildSelectedMultiselectBoxString('customerFilter');
        },
        filteredFleetText : function() {
            return buildSelectedMultiselectBoxStringWithNames('fleetFilter');
        },
        filteredDoctypeText : function() {
            return buildSelectedMultiselectBoxStringWithNames('docTypeFilter');
        },
        filteredOperatorCode : function() {
            return buildSelectedMultiselectBoxStringWithNames('customerFilter');
        },
        filteredDocnumberText : function() {
            return buildSelectedMultiselectBoxStringWithNames('docNrFilter');
        }

    };

    return requestParameter;
}