$(function() {
    window.swaggerUi = new SwaggerUi({

        url : window.location.protocol + '//' + window.location.host + contextPath + "/app/api-docs",
        dom_id : "swagger-ui-container",
        supportedSubmitMethods : [ 'get', 'post', 'put', 'delete' ],
        onComplete : function(swaggerApi, swaggerUi) {
            $('pre code').each(function(i, e) {
                hljs.highlightBlock(e);
            });
        },
        onFailure : function(data) {
            log("Unable to Load SwaggerUI");
        },
        docExpansion : "none"
    });

    $('#input_apiKey').change(function() {
        var key = $('#input_apiKey')[0].value;
        log("key: " + key);
        if (key && key.trim() != "") {
            log("added key " + key);
            window.authorizations.add("key", new ApiKeyAuthorization("api_key", key, "query"));
        }
    });
    window.swaggerUi.load();
});