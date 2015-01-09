$(document).ready(function(){

	$("#ac-status-select").select2({
		placeholder: "Status"		
	}).bind("change", function(){
		filterAttributesChanged();
	});
	
	
//	var request = $.ajax({
//		  url: contextPath + "/app/cmaint/ac-overview",
//		  type: "POST",
//		  data: { "foo": "bar" },
//		  dataType: "html"
//		});
//
//		request.done(function( data ) {
//			 $("#ac-status-overview-content").html(data);
//		});
//
//		request.fail(function( jqXHR, textStatus ) {
//		  alert( "Request failed: " + textStatus );
//		});


});