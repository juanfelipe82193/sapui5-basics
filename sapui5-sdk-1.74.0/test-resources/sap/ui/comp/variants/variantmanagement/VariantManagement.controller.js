sap.ui.define([
	'sap/ui/core/mvc/Controller', "sap/m/MessageToast", 'sap/ui/model/resource/ResourceModel'
], function(Controller, MessageToast, ResourceModel) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.variantmanagement.VariantManagement", {

		onInit: function() {

			var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
			var oResourceModel = new ResourceModel({
				bundleUrl: "i18n/i18n.properties",
				bundleLocale: sLocale
			});

			this.getView().setModel(oResourceModel, "i18n");
		},

		onSave: function(oEvent) {
			var params = oEvent.getParameters();
			var sMessage = "New Name: " + params.name + "\nDefault: " + params.def + "\nOverwrite:" + params.overwrite + "\nSelected Item Key: " + params.key;
			MessageToast.show(sMessage);
		},

		onManage: function(oEvent) {
			var params = oEvent.getParameters();
			var renamed = params.renamed;
			var deleted = params.deleted;
			var sMessage = "renamed: \n";
			for (var h = 0; h < renamed.length; h++) {
				sMessage += renamed[h].key + "=" + renamed[h].name + "\n";
			}
			sMessage += "\n\ndeleted: ";
			for (var f = 0; f < deleted.length; f++) {
				sMessage += deleted[f] + ",";
			}

			MessageToast.show(sMessage);
		},

		onSelect: function(oEvent) {
			var params = oEvent.getParameters();
			var sMessage = "New Variant Selected: " + params.key;
			MessageToast.show(sMessage);
		}
	});
});
