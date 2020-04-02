sap.ui.define([
	'sap/ui/core/mvc/Controller', "sap/ui/model/json/JSONModel", "./mockData", "sap/ui/mdc/odata/v4/FilterBarDelegate", "./TestTableDelegate"
], function(Controller, JSONModel, mockData, FilterbarDelegate, TestTableDelegate) {
	"use strict";
	return Controller.extend("view.Main", {
		onInit: function() {

			var oModel = new JSONModel({
				Artists: mockData
			});

			this.getView().setModel(oModel);

			//mock the metadata to enable p13n
			var mMetadata = {
				modifiedAt: "ChangedAt",
				createdAt: "CreatedAt",
				createdBy: "CreatedBy",
				modifiedBy: "ChangedBy",
				artistUUID: "artistUUID",
				name: "Name",
				foundingYear: "Founding Year",
				breakupYear: "Breakout Year",
				countryOfOrigin_code: "Country",
				regionOfOrigin_code: "Region",
				cityOfOrigin_city: "City"
			};

			FilterbarDelegate.fetchProperties = function(oFilterBar) {
				var aProperties = [];
				for (var sProperty in mMetadata) {
					aProperties.push({
						name: sProperty,
						label: mMetadata[sProperty],
						sortable: true,
						filterable: true
					});
				}
				return Promise.resolve(aProperties);
			};

		}
	});
});

