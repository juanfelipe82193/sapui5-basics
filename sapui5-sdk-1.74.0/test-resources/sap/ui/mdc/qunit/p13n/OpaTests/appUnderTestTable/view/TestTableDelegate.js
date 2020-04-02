sap.ui.define([
	"sap/ui/mdc/odata/v4/TableDelegate"
], function (TableDelegate) {
	"use strict";

	var oCustomDelegate = Object.assign({}, TableDelegate);

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

	oCustomDelegate.fetchProperties = function(oTable) {
		var aProperties = [];
		var iCount = 0;
		for (var sProperty in mMetadata) {
			aProperties.push({
				name: sProperty,
				label: mMetadata[sProperty],
				type: "string",
				sortable: true,
				filterable: true,
				groupLabel: iCount > 4 ? "Product" : "Supplier"
			});
			iCount++;
		}
		return Promise.resolve(aProperties);
	};

	oCustomDelegate.beforeAddColumnFlex = function(sPropertyInfoName, oTable, mPropertyBag) {
		var oModifier = mPropertyBag.modifier;
		var sId = mPropertyBag.id + "--" + sPropertyInfoName;

		if (oTable.isA === undefined) {

			return oModifier.createControl("sap.m.Text", mPropertyBag.appComponent, mPropertyBag.view, sId + "--text--" + sPropertyInfoName,{
				text: "{" + sPropertyInfoName + "}"
			}, true).then(function(oTemplate){
				var oColumn = oModifier.createControl("sap.ui.mdc.table.Column", mPropertyBag.appComponent, mPropertyBag.view, sId, {
					dataProperties: sPropertyInfoName,
					width:"150px",
					header: sPropertyInfoName
				});
				oColumn.appendChild(oTemplate);
				return oColumn;
			});
		} else {
			return this._createColumn(sPropertyInfoName, oTable);
		}

	};

	return oCustomDelegate;

});
