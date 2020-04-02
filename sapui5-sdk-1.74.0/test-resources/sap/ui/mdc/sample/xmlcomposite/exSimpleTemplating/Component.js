sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/mdc/XMLComposite",
	"sap/ui/core/util/XMLPreprocessor"
], function(UIComponent, JSONModel, XMLComposite, XMLPreprocessor) {
	"use strict";
	return UIComponent.extend("sap.ui.mdc.sample.xmlcomposite.exSimpleTemplating.Component",
	{
		metadata:
		{
			rootView: "sap.ui.mdc.sample.xmlcomposite.exSimpleTemplating.Test"
		},
		init: function () {
			XMLPreprocessor.plugIn(function (oNode, oVisitor) {
				return oVisitor.visitAttributes(oNode)
				.then(function () {
					return XMLComposite.initialTemplating(oNode, oVisitor, "sap.ui.mdc.sample.xmlcomposite.exSimpleTemplating.comp.field");
				});
			}, "sap.ui.mdc.sample.xmlcomposite.exSimpleTemplating.comp", "field");

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set data model
			var oData = {
				text: "Hello",
				value: "World"
			};
			var oModel = new JSONModel(oData);
			this.setModel(oModel);
		},
		createContent: function() {
			var oViewSettings = {
				async: true,
				viewName: "sap.ui.mdc.sample.xmlcomposite.exSimpleTemplating.Test",
				// models: {
				// 	deviceModel: oDeviceModel
				// },
				preprocessors:
				{
					xml:{}
				}
			};

			return sap.ui.xmlview(oViewSettings);
		}

	});
});

