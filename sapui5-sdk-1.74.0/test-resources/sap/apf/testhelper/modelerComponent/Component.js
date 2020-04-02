//Component, that extends the modeler component and uses the LREP persistence.
(function() {
	'use strict';

	jQuery.sap.declare('sap.apf.testhelper.modelerComponent.Component');
	sap.ui.getCore().loadLibrary("sap.apf");
	jQuery.sap.require('sap.apf.modeler.Component');

	sap.apf.modeler.Component.extend("sap.apf.testhelper.modelerComponent.Component", {
		metadata : {
			"config" : {
				"fullWidth" : true
			},
			"name" : "sap.apf.testhelper.modelerComponent.Component",
			"version" : "1.3.0",
			"manifest" : "json"
		},
		/**
		 * Initialize the application
		 * 
		 * @returns {sap.ui.core.Control} the content
		 */
		init : function() {
			sap.apf.modeler.Component.prototype.init.apply(this, arguments);
		},
		/**
		 * Creates the application layout and returns the outer layout of APF 
		 * @returns
		 */
		createContent : function() {
			var disableCreateContentForUnitTest = jQuery.sap.getUriParameters().get('createContent');
			if (disableCreateContentForUnitTest) {
				return new sap.m.App();
			}
			sap.apf.modeler.Component.prototype.createContent.apply(this, arguments);
		},
		getInjections : function () {
			return {
				exits : {
					getRuntimeUrl : this.getRuntimeUrl
				}
			};
		},
		getRuntimeUrl : function() {
			return "testURL";
		}
	});
}());