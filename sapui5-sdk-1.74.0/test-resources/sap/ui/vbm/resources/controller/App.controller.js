sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";
	return Controller.extend("vbm-regression.controller.App", {

		onInit: function() {

			this.page = this.byId("main-page");

			$.getJSON("./test_structure.json", function(tests) {
				this.tests = tests;
				this.currentTest = 0;
				setTimeout(function() {
					this.loadTest(this.page, this.tests[this.currentTest]);
					console.log("load");
				}.bind(this), 4000);
			}.bind(this))

			
		},

		onNavigateLeft: function(event) {


		},

		onNavigateRight: function(event) {


		},

		loadTest: function(page, testInfo) {

			var component = new sap.ui.core.ComponentContainer({
				name: testInfo.componentName,
				height: "100%",
				width: "100%"
			});

			page.removeAllContent();
			page.addContent(component);
//			var testTitle = page.getCustomHeader().getContentMiddle()[0];
//			testTitle.setText(testInfo.name);
//			var testDescription = page.getSubHeader().getContentMiddle()[0];
//			testDescription.setText(testInfo.description);

		}
	});

})
