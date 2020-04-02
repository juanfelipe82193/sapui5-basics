sap.ui.define(["sap/ui/core/mvc/OverrideExecution", "sap/suite/ui/generic/template/lib/TemplateAssembler",
	"sap/suite/ui/generic/template/lib/TemplateComponent", "sap/suite/ui/generic/template/detailTemplates/detailUtils",
	"sap/suite/ui/generic/template/ObjectPage/controller/ControllerImplementation", "sap/suite/ui/generic/template/ObjectPage/controllerFrameworkExtensions", "sap/base/util/extend"
], function(OverrideExecution, TemplateAssembler, TemplateComponent, detailUtils, ControllerImplementation, controllerFrameworkExtensions, extend) {
	"use strict";

	function getMethods(oComponent, oComponentUtils) {
		var oViewProxy = {};

		var oBase = detailUtils.getComponentBase(oComponent, oComponentUtils, oViewProxy);

		var oSpecific = {
			oControllerSpecification: {
				getMethods: ControllerImplementation.getMethods.bind(null, oViewProxy),
				oControllerDefinition: controllerFrameworkExtensions,
				oControllerExtensionDefinition: { // callbacks for controller extensions
					// allows extensions to store their specific state. Therefore, the implementing controller extension must call fnSetExtensionStateData(oControllerExtension, oExtensionState).
					// oControllerExtension must be the ControllerExtension instance for which the state should be stored. oExtensionState is the state to be stored.
					// Note that the call is ignored if oExtensionState is faulty
					// Note that the Lifecycle Object is the part of return from the function getCurrentState(where fnSetExtensionStateData is defined). Values for the Lifecycle Object parameters(Page, Permanent etc.) should be provided in extension implementation
					provideExtensionStateData: function(fnSetExtensionStateData){},
					// asks extensions to restore their state according to a state which was previously stored.
					// Therefore, the implementing controller extension can call fnGetExtensionStateData(oControllerExtension) in order to retrieve the state information which has been stored in the current state for this controller extension.
					// undefined will be returned by this function if no state or a faulty state was stored.
					restoreExtensionStateData: function(fnGetExtensionStateData, bIsSameAsLast){},
					// gives extensions the possibility to make sure that certain fields will be contained in the select clause of the table binding.
					// This should be used, when custom logic of the extension depends on these fields.
					// For each custom field the extension must call fnEnsureSelectionProperty(oControllerExtension, sFieldname).
					// oControllerExtension must be the ControllerExtension instance which ensures the field to be part of the select clause.
					// sFieldname must specify the field to be selected. Note that this must either be a field of the entity set itself or a field which can be reached via a :1 navigation property.
					// In the second case sFieldname must contain the relative path.
					ensureFieldsForSelect: function(fnEnsureSelectionProperty, sControlId){},
					// allows extension to add filters. They will be combined via AND with all other filters
					// For each filter the extension must call fnAddFilter(oControllerExtension, oFilter)
					// oControllerExtension must be the ControllerExtension instance which adds the filter
					// oFilter must be an instance of sap.ui.model.Filter
					addFilters: function(fnAddFilter, sControlId){}
				}
			},
			getTemplateSpecificParameters: function(){
				return {
					breadCrumb: oComponentUtils.getBreadCrumbInfo()
				};
			},
			refreshBinding: function(bUnconditional, mRefreshInfos) {
				// default implementation: invalidate context element binding is bound to
				if (bUnconditional) {
					oComponentUtils.refreshBindingUnconditional();
				} else {
					oViewProxy.refreshFacets(mRefreshInfos);
				}
			},
			presetDisplayMode: function(iDisplayMode, bIsAlreadyDisplayed){
				if (bIsAlreadyDisplayed){
					return; // wait for the data to come for the case that the view is already displayed
				}
				var oTemplateModel = oComponentUtils.getTemplatePrivateModel();
				oTemplateModel.setProperty("/objectPage/displayMode", iDisplayMode);
			},
			showConfirmationOnDraftActivate: function(){
				return oComponent.getShowConfirmationOnDraftActivate();
			},
			beforeRebind: function(){
				oViewProxy.beforeRebind();
			},
			afterRebind: function(){
				oViewProxy.afterRebind();
			},
			enhanceExtensionAPI4Reuse: function(oExtensionAPI, oEmbeddedComponentMeta){
				oExtensionAPI.setSectionHidden = function(bHidden){
					var oTemplateModel = oComponentUtils.getTemplatePrivateModel();
					oTemplateModel.setProperty("/generic/embeddedComponents/" + oEmbeddedComponentMeta.key + "/hidden", bHidden);
				};
				oExtensionAPI.setTagsInHeader = function(aTags){
					var oOverflowToolbar = oViewProxy.oController.byId("template::ObjectPage::OverflowToolbar");
					if (oOverflowToolbar) {
						// destroy content except Object Marker
						var oObjectMarker = oOverflowToolbar.getContent()[0];
						oOverflowToolbar.removeContent(oObjectMarker);
						oOverflowToolbar.destroyContent();
						oOverflowToolbar.addContent(oObjectMarker);
						for (var i = 0; i < aTags.length; i++) {
							oOverflowToolbar.addContent(aTags[i]);
						}
					}
				};
			}
		};
		return extend(oBase, oSpecific);
	}

	return TemplateAssembler.getTemplateComponent(getMethods,
		"sap.suite.ui.generic.template.ObjectPage", {

			metadata: {
				library: "sap.suite.ui.generic.template",
				properties: {
					// reference to smart template
					"templateName": {
						"type": "string",
						"defaultValue": "sap.suite.ui.generic.template.ObjectPage.view.Details"
					},
					// shall button "Related Apps" be visible on the object page?
					"showRelatedApps": {
						"type": "boolean",
						"defaultValue": "false"
					},
					// shall confirmation popup be shown in object page while saving?
					"showConfirmationOnDraftActivate": {
						"type": "boolean",
						"defaultValue": false
					},
					// hide chevron for unauthorized inline external navigation?
					"hideChevronForUnauthorizedExtNav": {
						"type": "boolean",
						"defaultValue": "false"
					},
					// To enable multiselect in tables
					"multiSelect": "boolean",
					"allTableMultiSelect": "boolean",
					// shall it be possible to edit the contents of the header?
					"editableHeaderContent": {
						"type": "boolean",
						"defaultValue": "false"
					},
					"gridTable": "boolean",
					"tableType": "string",
					tableSettings: {
						type: "object",
						properties: { 	// Unfortunately, managed object does not provide any specific support for type "object". We use just properties, and define everything below exactly like the properties of the component.
										// Currently, everything here is just for documentation, but has no functionality. In future, a mechanism to fill default values shall be added
							type: { // Defines the type of table to be used. Possible values: ResponsiveTable, GridTable, TreeTable, AnalyticalTable.
								type: "string",
								defaultValue: undefined // If sap:semantics=aggregate, and device is not phone, AnalyticalTable is used by default, otherwise ResponsiveTable
							},
							multiSelect: { // Defines, whether selection of multiple entries is possible. Only relevant, if actions exist.
								type: "boolean",
								defaultValue: false
							},
							selectAll: { // Defines, whether a button to select all entries is available. Only relevant for table type <> ResponsiveTable, and if multiSelect is true.
								type: "boolean",
								defaultValue: false
							},
							selectionLimit: { // Defines the maximal number of lines to be loaded by a range selection from the backend. Only relevant for table type <> ResponsiveTable, if multiSelect is true, and selectAll is false.
								type: "int",
								defaultValue: 200
							}
						}
					},
					"condensedTableLayout": "boolean",
					"sections": "object",
					// Shall the simple header facets be used?
					"simpleHeaderFacets": {
						"type": "boolean",
						"defaultValue": "false"
					},
					//Allow deep linking to sub object pages?
					"allowDeepLinking": "boolean",
					//Navigate to list report page on draft activation?
					"navToListOnSave": "boolean",
					"designtimePath": {
						"type": "string",
						"defaultValue": "sap/suite/ui/generic/template/designtime/ObjectPage.designtime"
					},
					"flexibilityPath" : {
						"type": "string",
						"defaultValue": "sap/suite/ui/generic/template/ObjectPage/flexibility/ObjectPage.flexibility"
					}
				},
				// app descriptor format
				"manifest": "json"
			}
		});
});
