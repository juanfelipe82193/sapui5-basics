sap.ui.define(["sap/ui/core/mvc/OverrideExecution", "sap/suite/ui/generic/template/lib/TemplateAssembler",
	"sap/suite/ui/generic/template/ListReport/controller/ControllerImplementation", "sap/suite/ui/generic/template/ListReport/controllerFrameworkExtensions"
], function(OverrideExecution, TemplateAssembler, ControllerImplementation, controllerFrameworkExtensions) {
	"use strict";

	function getMethods(oComponent, oComponentUtils) {
		var oViewProxy = {};

		return {
			oControllerSpecification: {
				getMethods: ControllerImplementation.getMethods.bind(null, oViewProxy),
				oControllerDefinition: controllerFrameworkExtensions,
				oControllerExtensionDefinition: { // callbacks for controller extensions
					// will be called when the SmartFilterbar has been initialized
					onInitSmartFilterBar: function(oEvent) {},
					// allows extensions to store their specific state. Therefore, the implementing controller extension must call fnSetAppStateData(oControllerExtension, oAppState).
					// oControllerExtension must be the ControllerExtension instance for which the state should be stored. oAppState is the state to be stored.
					// Note that the call is ignored if oAppState is faulty
					provideExtensionAppStateData: function(fnSetAppStateData){},
					// asks extensions to restore their state according to a state which was previously stored.
					// Therefore, the implementing controller extension can call fnGetAppStateData(oControllerExtension) in order to retrieve the state information which has been stored in the current state for this controller extension.
					// undefined will be returned by this function if no state or a faulty state was stored.
					restoreExtensionAppStateData: function(fnGetAppStateData){},
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
			init: function() {
				var oTemplatePrivate = oComponent.getModel("_templPriv");
				oTemplatePrivate.setProperty("/listReport", {}); // Note that component properties are not yet available here
			},
			onActivate: function() {
				oViewProxy.onComponentActivate();
			},
			refreshBinding: function(bUnconditional, mRefreshInfos) {
				oViewProxy.refreshBinding(bUnconditional, mRefreshInfos);
			},
			getUrlParameterInfo: function() {
				return oViewProxy.getUrlParameterInfo();
			},
			getItems: function(){
				return oViewProxy.getItems();
			},
			displayNextObject: function(aOrderObjects){
				return oViewProxy.displayNextObject(aOrderObjects);
			}
		};
	}

	return TemplateAssembler.getTemplateComponent(getMethods,
		"sap.suite.ui.generic.template.ListReport", {
			metadata: {
				library: "sap.suite.ui.generic.template",
				properties: {
					"templateName": {
						"type": "string",
						"defaultValue": "sap.suite.ui.generic.template.ListReport.view.ListReport"
					},
					// hide chevron for unauthorized inline external navigation?
					"hideChevronForUnauthorizedExtNav": {
						"type": "boolean",
						"defaultValue": "false"
					},
					treeTable: { // obsolete - use tableSettings.type instead
						type: "boolean",
						defaultValue: false
					},
					gridTable: { // obsolete - use tableSettings.type instead
						type: "boolean",
						defaultValue: false
					},
					tableType: { // obsolete - use tableSettings.type instead
						type: "string",
						defaultValue: undefined
					},
					multiSelect: { // obsolete - use tableSettings.multiSelect instead
						type: "boolean",
						defaultValue: false
					},
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
					"createWithFilters": "object",
					"condensedTableLayout": "boolean",
					smartVariantManagement: { // true = one variant for filter bar and table, false = separate variants for filter and table
						type: "boolean",
						defaultValue: false
					},
					hideTableVariantManagement: { // obsolete - use variantManagementHidden instead
						type: "boolean",
						defaultValue: false
					},
					variantManagementHidden: { // hide Variant Management from SmartFilterBar. Use together with smartVariantManagement to create a ListReport without Variant Management
						type: "boolean",
						defaultValue: false
					},
					"creationEntitySet": "string",
					"enableTableFilterInPageVariant":{
						"type": "boolean",
						"defaultValue": false
					},
					"multiContextActions": "object",
					"isWorklist": "boolean",
					"designtimePath": {
						"type": "string",
						"defaultValue": "sap/suite/ui/generic/template/designtime/ListReport.designtime"
					},
					"flexibilityPath": {
						"type": "string",
						"defaultValue": "sap/suite/ui/generic/template/ListReport/flexibility/ListReport.flexibility"
					},
					quickVariantSelectionX: {
						type: "object",
						properties: { // Currently, everything here is just for documentation, but has no functionality. In future, a mechanism to fill default values shall be added
							showCounts: {
								type: "boolean",
								defaultValue: false
							},
							variants: { // A map -  keys to be defined by the application. 
								type: "object",
								mapEntryProperties: { // describes how the entries of the map should look like
									key: {
										type: "string",
										optional: true
									},
									annotationPath: { // annotation path pointing to SelectionPresentationVariant or SelectionVariant
										type: "string"
									},
									entitySet: {
										type: "string",
										optional: true
									}
								}
							}
						}
					},
					quickVariantSelection: {
						type: "object",
						properties: { // Currently, everything here is just for documentation, but has no functionality. In future, a mechanism to fill default values shall be added
							showCounts: {
								type: "boolean",
								defaultValue: false
							},
							variants: {
								type: "object",
								mapEntryProperties: {
									key: {
										type: "string",
										optional: true
									},
									annotationPath: { // annotation path pointing to SelectionVariant
										type: "string"
									}
								}
							}
						}
					}
				},
				"manifest": "json"
			}
		});
});