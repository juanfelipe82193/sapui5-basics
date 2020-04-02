sap.ui.define(["sap/ui/core/mvc/OverrideExecution","sap/suite/ui/generic/template/lib/TemplateAssembler",
	"sap/suite/ui/generic/template/AnalyticalListPage/controller/ControllerImplementation",
	"sap/ui/model/json/JSONModel", "sap/suite/ui/generic/template/AnalyticalListPage/controllerFrameworkExtensions"
], function(OverrideExecution, TemplateAssembler, ControllerImplementation, JSONModel, controllerFrameworkExtensions) {
	"use strict";

	function getMethods(oComponent,oComponentUtils) {
		var oViewProxy = {};

		return {
			oControllerSpecification: {
				getMethods: ControllerImplementation.getMethods.bind(null, oViewProxy),
				oControllerDefinition: controllerFrameworkExtensions,
				oControllerExtensionDefinition: { // callbacks for controller extensions
					metadata: {
						methods: {
							onInitSmartFilterBar: { "public": true, "final": false, overrideExecution: OverrideExecution.After},
							provideExtensionAppStateData: { "public": true, "final": false, overrideExecution: OverrideExecution.After},
							restoreExtensionAppStateData: { "public": true, "final": false, overrideExecution: OverrideExecution.After},
							ensureFieldsForSelect: { "public": true, "final": false, overrideExecution: OverrideExecution.After},
							addFilters: { "public": true, "final": false, overrideExecution: OverrideExecution.After}
						}
					},
					// will be called when the SmartFilterbar has been initialized
					onInitSmartFilterBar: function(oEvent) {},
					// allows extensions to strore their specific state. Therefore, the implementing controller extension must call fnSetAppStateData(oControllerExtension, oAppState).
					// oControllerExtension must be the ControllerExtension instance for which the state should be stored. oAppState is the state to be stored.
					// Note that the call is ignored if oAppState is faulty
					provideExtensionAppStateData: function(fnSetAppStateData){},
					// asks extensions to restore their state according to a state which was previously stored.
					// Therefore, the implementing controller extension can call fnGetAppStateData(oControllerExtension) in order to retrieve the state information which has been stored in the current state for this controller extension.
					// undefined will be returned by this function if no state or a faulty state was stored.
					restoreExtensionAppStateData: function(fnGetAppStateData){},
					// give extensions the possibility to make sure that certain fields will be contained in the select clause of the table binding. 
					// This should be used, when custom logic of the extension depends on these fields.
					// For each custom field the extension must call fnEnsureSelectionProperty(oControllerExtension, sFieldname).
					// oControllerExtension must be the ControllerExtension instance which ensures the field to be part of the select clause.
					// sFieldname must specify the field to be selected. Note that this must either be a field of the entity set itself or a field which can be reached via a :1 navigation property.
					// In the second case sFieldname must contain the relative path.
					ensureFieldsForSelect: function(fnEnsureSelectionProperty, sControlId){},
					// allow extension to add filters. They will be combined via AND with all other filters
					// For each filter the extension must call fnAddFilter(oControllerExtension, oFilter)
					// oControllerExtension must be the ControllerExtension instance which adds the filter
					// oFilter must be an instance of sap.ui.model.Filter
					addFilters: function(fnAddFilter, sControlId){}
				}
			},
			init: function() {
				var oTemplatePrivate = oComponent.getModel("_templPriv");
				// Note that component properties are not yet available here
				oTemplatePrivate.setProperty("/listReport", {});
				// Property to store UI settings of ALP
				oTemplatePrivate.setProperty("/alp", {
					visualFilter: {}
				}); // Note that component properties are not yet available here

				//Filter model
				var filterModel = new JSONModel();
				//Model is bound to the component as it affects various controls
				oComponent.setModel(filterModel, "_filter");
			},
			//Adds Pageheader to the FIORI shell
			onActivate: function() {
				oViewProxy.onComponentActivate();
			},
			refreshBinding: function() {
				oViewProxy.refreshBinding();
			},
			getUrlParameterInfo: function() {
				return oViewProxy.getUrlParameterInfo();
			},
			getTemplateSpecificParameters: function(){
				return {
					isAnalyticalListPage: true
				};
			},
			overwrite: {
				updateBindingContext: function() {

					sap.suite.ui.generic.template.lib.TemplateComponent.prototype.updateBindingContext.apply(oComponent, arguments);

					//commented below as here we get the metamodel only if the oBindingContext is present.
					/*var oBindingContext = oComponent.getBindingContext();
					if (oBindingContext) {
						oComponent.getModel().getMetaModel().loaded()
						.then(
							function() {
								//var oUIModel = oComponent.getModel("ui");

									// set draft status to blank according to UI decision
									// oUIModel.setProperty("/draftStatus", "");

									var oActiveEntity = oBindingContext.getObject();
									if (oActiveEntity) {

										var oDraftController = oComponent.getAppComponent().getTransactionController()
										.getDraftController();
										var oDraftContext = oDraftController.getDraftContext();
										var bIsDraft = oDraftContext.hasDraft(oBindingContext) && !oActiveEntity.IsActiveEntity;
										//var bHasActiveEntity = oActiveEntity.HasActiveEntity;
										if (bIsDraft) {
											oUIModel.setProperty("/editable", true);
											oUIModel.setProperty("/enabled", true);
										}
									}
								});
						//fnBindBreadCrumbs();
					}*/
				}
			}
		};
	}

	return TemplateAssembler.getTemplateComponent(getMethods,
		"sap.suite.ui.generic.template.AnalyticalListPage", {
			metadata: {
				library: "sap.suite.ui.generic.template",
				properties: {
					"templateName": {
						"type": "string",
						"defaultValue": "sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage"
					},
					"qualifier": {
						/*
							optional qualifier for a SelectionPresentationVariant or a PresentationVariant
							annotation. If no SelectionPresentationVariant exists with or without qualifier
							a PresentationVariant with the qualifier is searched. It always falls back to default
							of first SPV and than PV if qualifier can not be found
						 */
						"type": "string",
						"defaultValue": ""
					},
					"chartPresentationQualifier": {
						/*
							optional qualifier for a PresentationVariant
							annotation for chart in content area
						 */
						"type": "string",
						"defaultValue": ""
					},
					"gridTable": { // obsolete - use tableSettings.type instead
						/*
							This setting allows app developer to use GridTable in content area
							If sap:semantics=aggregate then AnalyticalTable is used and this setting have no effect
							If the display type is not desktop but mobile or tablet or other devices always responsive table is shown.
							Note: This Property is depricated. Use tableType Property to achieve the same henceforth.
							using tableType to get gridTable --> instead of using gridTable === true, use tableType === GridTable.
						 */
						"type": "boolean",
						"defaultValue": false
					},
					"tableType": { // obsolete - use tableSettings.type instead
						/*
							This setting allows developer to define the table type of their choice.
							It takes more precedence from any other settings like gridTable.
							Eg : if gridTable == true and tableType === AnalyticalTable it takes more precedence and render Analytical table.
							@since 1711
							Valid values: AnalyticalTable, GridTable or ResponsiveTable
						 */
						"type": "string",
						"defaultValue": ""
					},
					"multiSelect": { // obsolete - use tableSettings.multiSelect instead
						/*
							This setting allows app developer to show checkbox for selecting multiple items in table.
							Only if there are Actions (annotation or manifest), this setting would come into effect.
						 */
						"type": "boolean",
						"defaultValue": false
					},
					"tableSettings": {
						type: "object",
						properties: { 	// Unfortunately, managed object does not provide any specific support for type "object". We use just properties, and define everything below exactly like the properties of the component.
							type: { // Defines the type of table to be used. Possible values: ResponsiveTable, GridTable, TreeTable, AnalyticalTable. 
								type: "string",
								defaultValue: undefined // If sap:semantics:aggregate, and device is not phone, analyticalTable is used by default, otherwise responsiveTable
							},
							multiSelect: { // Defines, whether selection of multiple entries is possible. Only relevant, if actions exist.
								type: "boolean",
								defaultValue: false
							},
							selectAll: { // Defines, whether a button to select all entries is available. Only relevant for tableType gridTable and analyticalTable and if multiselect is true.
								type: "boolean",
								defaultValue: true
							},
							selectionLimit: { // Defines the maximal number of lines to be loaded by a range selection from the backend. Only relevant for tableType gridTable, if multiselect is true, and selectAll is false.  
								type: "int",
								defaultValue: 200
							}
						}
					},
					"smartVariantManagement": {
						/*
							This setting allows developer to choose Control level variant instead of Page Variant
							CAUTION: Change in this setting would require app developer to recreate all previously
							saved variants.
						 */
						"type": "boolean",
						"defaultValue": true
					},
					"defaultContentView":{
						/*
							This setting allows developer to set the content view which will be displayed on app launch
							If the end user has chosen any other view in their default variants then that will have priority
							over this setting.
							Default is hybrid view (charttable).
							Valid values "charttable", "chart", "table"
						 */
						"type": "string",
						"defaultValue": "charttable"
					},
					"lazyLoadVisualFilter":{
						/*
							This setting allows developer to delay the loading of visual filter.
							It ensure to make a oData request only when the user switches to visual filter or on initial load.
							If user clicks on adapt filter if the default mode is compact then the call is blocked unless user switches to visual filter.
						 */
						"type": "boolean",
						"defaultValue": false
					},
					"defaultFilterMode": {
						/*
							This setting allows developer to set the default filter mode which will be displayed on app launch
							If the end user has chosen a different filter mode in their default variants then that will have priority
							over this setting.
							Default is visual filter.
							Valid values "visual", "compact"
						 */
						"type": "string",
						"defaultValue": "visual"
					},
					/*
						This setting allows developer to define KPI Tags in ALP, e.g.
						"ActualCosts": {
							"model": "kpi",	//model defined in the manifest sap.ui5.models
							"entitySet": "CZ_PROJECTKPIS",	//name of the entity set, in case of parameterized set please mention result entity set name
							"qualifier": "ActualCosts",	//Qualifier of SelectionPresentationVariant which have a DataPoint and Chart visualization
							"detailNavigation": "ActualCostsKPIDetails"	//[Optional] Key of Outbound navigation defined in sap.app.crossNavigation.outbounds
						}
					*/
					"keyPerformanceIndicators": "array",
					"autoHide": {
						/*
							This setting allows developer to determine chart / table interaction. 'true' would mean chart act as
							filter for table, 'false' would mean that matching table rows are highlighted but table is not
							filtered.
						 */
						"type": "boolean",
						"defaultValue": true
					},
					"showAutoHide": {
						/*
							This setting allows developer to hide the autoHide segmented button. When the button is hidden, default
							chart/table interaction is filter.
						 */
						"type": "boolean",
						"defaultValue": true
					},
					"hideVisualFilter": {
						/*
							DEPRECATED:	This setting allows developer to hide the visual filters.
							PLEASE DO NOT USE THIS SETTING IN NEW PROJECTS
						 */
						"type": "boolean",
						"defaultValue": false
					},
					"showGoButtonOnFilterBar": {
						/*
							This setting allows developer to run ALP in non live mode. When it is set to true, app have a "GO"
							button in the Filter Bar and the filter selections are not applied till Go is pressed.
						 */
						"type": "boolean",
						"defaultValue": false
					},
					"uniqueHierarchyNodeIDForTreeTable": {
						/*
							This setting allows developer to define the unique parent tree node Id from which the parsing of hierarchy service takes place for tree table
							Taking uniqueHierarchyNodeIDForTreeTable, it's corresponding childs and properties are parsed and saved.
							All the dimension except which is linked to hierarchy service attributes are been put into ignoreFields.
						 */
						"type": "string",
						"defaultValue": ""
					},
					"showItemNavigationOnChart": {
						/*
							This setting allows developer to display a Item Navigation on SmartChart's "Detail" popover list.
						 */
						"type": "boolean",
						"defaultValue": false
					},
					"condensedTableLayout": {
						/*
							This setting allows user to display SmartTable in condensed mode. More line items are visible
							in this mode compared to compact.
						 */
						"type": "boolean",
						"defaultValue": true
					},
					"contentTitle": {
						/*
							This setting allows developer to display Contentarea Title.
						 */
						"type": "string",
						"defaultValue": undefined
					},
					"enableTableFilterInPageVariant": {
						/*
							This setting allows developer to enable/disable filter option on table columns incase of Page level variant is enabled.
						 */
						"type": "boolean",
					"defaultValue": false
					},
					"dshQueryName" : {
						/*
							Setting to enable DSH crosstable
						*/
						"type" : "string",
						"defaultValue": undefined
					},
					"filterDefaultsFromSelectionVariant" : {
						/*
							This setting allows developer to choose SV from annotation
						*/
						"type": "boolean",
						"defaultValue": false
					},
					"designtimePath": {
						"type": "string",
						"defaultValue": "sap/suite/ui/generic/template/designtime/AnalyticalListPage.designtime"
					}

				},
				"manifest": "json"
			}
		});
});