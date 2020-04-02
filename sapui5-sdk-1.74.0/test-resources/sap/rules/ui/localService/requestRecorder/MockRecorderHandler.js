sap.ui.define(['jquery.sap.global', 'sap/ui/core/util/MockServer'],
	function(jQuery, MockServer) {
		'use strict';
		
		var MockRecorderHandler = function() {
			this.isRecording = false;
			this.oMockServer = new MockServer({});
		};
		
		MockRecorderHandler.prototype.onStart = function() {
			this.oMockServer.start();
			this.isRecording = true;
		};
		
		MockRecorderHandler.prototype.onStop = function() {

			var data = {};
			$.grep(this.oMockServer._oServer.requests, function(r) {
				var filterOut = new RegExp(/(\.js$|\.json$|\.xml$|\.css$|\.less$|\.properties$)/);
				if (!filterOut.test(r.url)) {
					var response  = {};
					response.contentType = r.getResponseHeader("Content-Type");
					response.status = r.status;
					response.responseText = r.responseText;
					if (data[r.method + " " + r.url]) {
						data[r.method + " " + r.url].unshift(response);
					} else {
						data[r.method + " " + r.url] = [response];
					}
				}
			});
          
			this.oMockServer.stop();
			this.isRecording = false;
			var fileName = window.prompt("enter file name","mock.json");
			this.saveData(data, fileName);
       };

		jQuery(document).ready( function () {
           var a = document.createElement("a");
           document.body.appendChild(a);
           //a.style = "display: none";
           
           MockRecorderHandler.prototype.saveData = function (data, fileName) {
               var json = JSON.stringify(data,null,4),
                   blob = new Blob([json], {type: "octet/stream"}),
                   url = window.URL.createObjectURL(blob);
               a.href = url;
               a.download = fileName;
               a.click();
               window.URL.revokeObjectURL(url);
           };
       });
       
       return MockRecorderHandler;
});