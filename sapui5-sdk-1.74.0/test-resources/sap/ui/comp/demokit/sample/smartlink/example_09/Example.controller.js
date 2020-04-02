sap.ui.define([
	'sap/ui/core/mvc/Controller', 'sap/ui/comp/navpopover/SemanticObjectController'
], function(Controller, SemanticObjectController) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartlink.example_09.Example", {

		onInit: function() {
			SemanticObjectController.destroyDistinctSemanticObjects();
			this.getView().bindElement("/ProductCollection('1239102')");
		}
	});
});
