sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	return Controller.extend("vbm-regression.tests.06.controller.App", {

		onInit: function() {

			var vbi1 = this.byId("vbi1"),
				vbi2 = this.byId("vbi2"),
				vbi3 = this.byId("vbi3"),
				vbi4 = this.byId("vbi4"),
				blankImageDataURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAADCAIAAADQoYKSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAQSURBVBhXY/iPDRAv+v8/ABebPsKYC0aHAAAAAElFTkSuQmCC";


			$.getJSON("media/Copyright/main.json", function(data) {

				vbi1.load(data);

			});

			$.getJSON("media/Copyright/LinkImage.json", function(data) {
			
				
				vbi2.load(data);
			});

			$.getJSON("media/Copyright/Image.json", function(data) {
				
				
				vbi3.load(data);
			});

			$.getJSON("media/Copyright/LinkImage2Layer.json", function(data) {
				
				
				vbi4.load(data);
			});

		}

	});
});
