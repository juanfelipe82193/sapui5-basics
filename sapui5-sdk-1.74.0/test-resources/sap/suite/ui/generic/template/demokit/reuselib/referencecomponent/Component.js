/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 * Simple (reuse) Component
 * This component shows how a reuse component should be written. It must offer all mandatory properties
 *		uiMode type enum (display, edit)
 *		semanticObject type string
 * It may offer more properties. All properties must be bindable and allow that the values change during the lifetime
 * of the component instance.
 */

sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport",
	"sap/base/Log"
], function(UIComponent, ReuseComponentSupport, Log) {
	"use strict";

	return UIComponent.extend("reuselib.referencecomponent.Component", {
		metadata: {
			properties: {
				/* Mandatory properties for reuse components */
				/* "To be standardized" UI mode accross fiori applications so the component knows in what mode the application is running */
				uiMode: {
					type: "string",
					group: "standard",
					defaultValue: "Display"
				},
				semanticObject: {
					type: "string",
					group: "standard"
				},
				/* Component specific properties */
				/* This is a property set for the specific use case of the response component.
				 * We assume in this example that the property must be set before the reuse component can do
				 * something meaningful.
				 */
				demoPropertyString: {
					type: "string",
					group: "specific",
					defaultValue: "No value has been set"
				}
			}
		},
		setUiMode: function(value) {
			/* make sure to set the value */
			this.setProperty("uiMode", value);
			/* Code to reflect the uiMode. If the reuse components doesn't care about display or edit this function is not needed */
		},
		setSemanticObject: function(value) {
			/* make sure to set the value */
			this.setProperty("semanticObject", value);
			/* Code to reflect the semanticObject. If the reuse components doesn't care about semantic objects this function is not needed */
		},
		setDemoPropertyString: function(value) {
			/* make sure to set the value */
			this.setProperty("demoPropertyString", value);
			/* Component specific code e.g. call some kind of init method of the view controller */
		},
		getView: function() {
			/* Convenience function to get the view from the component. It could also be stored in an instance variable this._oView instead */
			return this.getAggregation("rootControl");
		},
		createContent: function() {
			/* In this simple example we simply create a view that is later bound to a model
			 * It is important to understand that the component has no property values yet
			 * so the view and in particular its controller code must allow to get the values after it has been created
			 */
			var oView = sap.ui.xmlview("reuselib.referencecomponent.view.Default");

			/* Transforms this component into a reuse component for smart templates */
			ReuseComponentSupport.mixInto(this, "component");
			return oView;
		},
		updateHistory: function(oBindingContext) {
			var aContextHistoryOfDefaultModel = this.getModel("component").getProperty("/contextHistoryOfDefaultModel") || [],
				oHistoryEntry = {
					bindingContextPath: oBindingContext ? oBindingContext.getPath() : "creation binding context",
					time: new Date().toISOString()
				};
			aContextHistoryOfDefaultModel.push(oHistoryEntry);
			this.getModel("component").setProperty("/contextHistoryOfDefaultModel", aContextHistoryOfDefaultModel);
		},
		showFeaturesOfExtensionAPI: function(oExtensionAPI) {
			var	sFeatures = "";
			for (var sFunctionName in oExtensionAPI) {
				if (oExtensionAPI.hasOwnProperty(sFunctionName)) {
					sFeatures += sFunctionName + "\n";
				}
			}
			this.getModel("component").setProperty("/extensionAPI", sFeatures);
		},
		checkUnsavedData: function() {
			return !!this.getModel("component").getProperty("/unsavedData");
		},
		/* Smart Template Reuse Component specific functions that can will be called if defined
		 * after ReuseComponentSupport.mixInto has been called
		 */
		stStart: function(oModel, oBindingContext, oExtensionAPI) {
			/* this method is called after the outsided model and the outside context
			 * has been propagated successful
			 */
			Log.info(this.getId() + "->" + this.getMetadata().getName() + ":stStart  -> " + (oBindingContext ? oBindingContext.getPath() : "creation binding context"));
			this.showFeaturesOfExtensionAPI(oExtensionAPI);
			this.updateHistory(oBindingContext);
			//In case of Non-draft we need to register for an UnsavedDataCheck call
			var oTransactionController = oExtensionAPI.getTransactionController();
			if (oTransactionController.registerUnsavedDataCheckFunction) {
				oTransactionController.registerUnsavedDataCheckFunction(this.checkUnsavedData.bind(this));
			}
		},
		stRefresh: function(oModel, oBindingContext) {
			/* this method is called anytime the outside binding context has changed
			 * in case stStart is not defined it is called the first time as well
			 * if stStart is defined it is called only when the initial context changes
			 */
			Log.info(this.getId() + "->" + this.getMetadata().getName() + ":stUpdate -> " + (oBindingContext ? oBindingContext.getPath() : "creation binding context"));
			this.updateHistory(oBindingContext);
		}
	});
}, /* bExport= */ true);
