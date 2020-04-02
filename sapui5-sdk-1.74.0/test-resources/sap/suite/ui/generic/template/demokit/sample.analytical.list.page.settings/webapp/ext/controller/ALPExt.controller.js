sap.ui.define("analytics3.ext.controller.ALPExt", [	
], function() {
	"use strict";

	return {
		modifyStartupExtension: function (oStartupObject) {
			var oSelectionVariant = oStartupObject.selectionVariant;
			if (oSelectionVariant.getSelectOption("CustomerCountry") && oSelectionVariant.getSelectOption("CustomerCountry")["0"].Low === "AR") {
				oSelectionVariant.addSelectOption("WBSElement", "I", "EQ", "BLUE PRINT VALIDATION");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "EQ", "SAP");
			}
		}
	
	};
});