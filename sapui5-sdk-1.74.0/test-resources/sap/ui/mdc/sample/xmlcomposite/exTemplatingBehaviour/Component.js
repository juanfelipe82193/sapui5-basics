sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/mdc/XMLComposite",
	"sap/ui/core/util/XMLPreprocessor"
], function (UIComponent, JSONModel, XMLComposite, XMLPreprocessor) {
	"use strict";
	return UIComponent.extend("sap.ui.mdc.sample.xmlcomposite.exTemplatingBehaviour.Component",
		{
			metadata:
			{
				rootView: "sap.ui.mdc.sample.xmlcomposite.exTemplatingBehaviour.Test"
			},
			init: function () {
				XMLPreprocessor.plugIn(function (oNode, oVisitor) {
					return oVisitor.visitAttributes(oNode)
					.then(function () {
						return XMLComposite.initialTemplating(oNode, oVisitor, "sap.ui.mdc.sample.xmlcomposite.exTemplatingBehaviour.comp.field");
					});
				}, "sap.ui.mdc.sample.xmlcomposite.exTemplatingBehaviour.comp", "field");

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
				sap.ui.Device.system.desktop = "x";
				sap.ui.Device.system.tablet = "";
				var oDeviceModel = new JSONModel(sap.ui.Device.system);

				var oViewSettings = {
					async: true,
					viewName: "sap.ui.mdc.sample.xmlcomposite.exTemplatingBehaviour.Test",
					// models: {
					// 	deviceModel: oDeviceModel
					// },
					preprocessors:
					{
						xml:
						{
							models:
							{
								deviceModel: oDeviceModel
							}
						}
					}
				};

				return sap.ui.xmlview(oViewSettings);
			}

		});
});
