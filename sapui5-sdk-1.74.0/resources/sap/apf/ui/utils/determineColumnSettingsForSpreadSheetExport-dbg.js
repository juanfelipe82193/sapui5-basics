jQuery.sap.declare("sap.apf.ui.utils.determineColumnSettingsForSpreadSheetExport");
jQuery.sap.require("sap.ui.export.Spreadsheet");
(function() {
	"use strict";

	/**
	 * determine the settings for a column, that are required by sap.ui.export.SpreadSheet
	 * @param {String} propertyName  name of property in the metadata
	 * @param {sap.apf.core.EntityTypeMetadata} metadata
	 * @returns {object} exportDataTypeSettings
	 */
	sap.apf.ui.utils.determineColumnSettingsForSpreadSheetExport = function(propertyName, metadata) {
		var exportDataTypeSettings = {};
		var propertyMetadata, unitPropertyMetadata;

		if (metadata) {
			propertyMetadata = metadata.getPropertyMetadata(propertyName);
			var edmType = propertyMetadata.dataType.type;

			if (edmType === "Edm.Int32") {
				exportDataTypeSettings.type = sap.ui.export.EdmType.Number;
				exportDataTypeSettings.scale = 0;
			} else if (edmType === "Edm.Decimal") {
				exportDataTypeSettings.type = sap.ui.export.EdmType.Number;
				exportDataTypeSettings.precision = parseInt(propertyMetadata.precision, 10);
				exportDataTypeSettings.scale = parseInt(propertyMetadata.scale, 10);
				if (propertyMetadata["sap:unit"]) {
					unitPropertyMetadata = metadata.getPropertyMetadata(propertyMetadata["sap:unit"]);
					if (unitPropertyMetadata && unitPropertyMetadata["sap:semantics"] && unitPropertyMetadata["sap:semantics"] === "currency-code") {
							exportDataTypeSettings.type = sap.ui.export.EdmType.Currency;
							exportDataTypeSettings.unitProperty = unitPropertyMetadata.name;
							exportDataTypeSettings.displayUnit = true;
						}
				}
			} else if (edmType === "Edm.DateTime") {
				if (propertyMetadata["sap:display-format"] && propertyMetadata["sap:display-format"] === "Date") {
					exportDataTypeSettings.type = sap.ui.export.EdmType.Date;
				} else {
					exportDataTypeSettings.type = sap.ui.export.EdmType.DateTime;
				}
			} else if (edmType === "Edm.DateTimeOffset") {
				exportDataTypeSettings.type = sap.ui.export.EdmType.DateTime;
			} else if (edmType === "Edm.String") {
				exportDataTypeSettings.type = sap.ui.export.EdmType.String;
				if (propertyMetadata.MaxLength) {
					exportDataTypeSettings.width = parseInt(propertyMetadata.MaxLength, 10);
				}
			} else {
				exportDataTypeSettings.type = sap.ui.export.EdmType.String;
			}
		}
		return exportDataTypeSettings;
	};
}());
