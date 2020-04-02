sap.ui.define(["sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/suite/ui/generic/template/designtime/virtualProperties/ColumnType",
		"sap/suite/ui/generic/template/designtime/library.designtime"
	],
	function (Utils, DesigntimeUtils, ColumnType) {
		"use strict";

		var LINEITEM = "com.sap.vocabularies.UI.v1.LineItem";
		var oResourceBundle = sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();

		var getInstanceDataForButton = function(oButton) {
			var sRecordIndex = Utils.getLineItemRecordIndexForButton(oButton),
				sTarget;
			if (sRecordIndex > -1) {
				var oMetaModel = oButton.getModel().getMetaModel();
				var sEntityType = Utils.getEntityType(oButton);
				var oEntityType = sEntityType && oMetaModel.getODataEntityType(sEntityType);
				if (oEntityType) {
					sTarget = oEntityType.namespace + "." + oEntityType.name + "/" + LINEITEM + "/" + sRecordIndex;
				}
			}
			return {
				target: sTarget,
				annotation: LINEITEM,
				qualifier: null
			};
		};

		var addToolbarActionButtonSettingsHandler = function(oSelectedElement, mPropertyBag) {
			var aActions = [];
			if (oSelectedElement.getParent().getId().indexOf("--template::ListReport::TableToolbar") > -1) {
				aActions = oSelectedElement.getParent().getContent();
			} else {
				aActions = oSelectedElement.getContent();
			}
			var sChangeHandler = "addToolbarActionButton";
			return DesigntimeUtils.addSettingsHandler(oSelectedElement, mPropertyBag, aActions, sChangeHandler);
		};

		return {
			'default': {},   // default scope: take original definitions from (smart) controls
			'strict': {      // scope = strict UX compatibility for Fiori Elements
				name: {
					singular: function() {
						return oResourceBundle.getText("FE_TOOLBAR");
					}
				},
				properties: function(oElement) {
					return DesigntimeUtils.ignoreAllProperties(oElement);
				},
				links: {
					developer: [{
						href: "/topic/8ba009d7b8434dc1a4948c9211e30c40.html",
						text: function() {
							return oResourceBundle.getText("FE_SDK_LRP_ACTION");
						}
					}],
					guidelines: [{
						href: "/table-bar/",
						text: function() {
							return oResourceBundle.getText("FE_TOOLBAR_GUIDE");
						}
					}]
				},
				actions: {
					settings: {
						name: "Add Action Button",
						handler: addToolbarActionButtonSettingsHandler,
						icon: "sap-icon://add"
					}
					/*
					 * add not supported for FunctionImports, only for properties.
					 * Workaround: settings handler at overflow toolbar
					 */
				},
				aggregations: {
					content: {
						propagateRelevantContainer : true,
						name: {
							singular: function() {
								return oResourceBundle.getText("FE_TOOLBAR");
							}
						},
						propagateMetadata: function (oElement) {
							switch (oElement.getMetadata().getElementName()) {

								case "sap.m.ToolbarSeparator":
								case "sap.m.ToolbarSpacer":
								case "sap.m.Title":
								case "sap.ui.comp.smartvariants.SmartVariantManagement":
									return {
										actions: null,
										properties: function(oElement) {
											return DesigntimeUtils.ignoreAllProperties(oElement);
										}
									};
								case "sap.m.MenuButton":
								case "sap.m.OverflowToolbarButton":
									return {
										name: {
											singular:  function() {
												return oResourceBundle.getText("FE_BUTTON");
											}
										},
										actions: null,
										properties: function(oElement) {
											return DesigntimeUtils.ignoreAllProperties(oElement);
										},
										annotations: {
											importance: { ignore: true}
										}
									};

								case "sap.m.Button":
									var regEx = /.+(sap.suite.ui.generic.template.ListReport.view.ListReport::).+(--deleteEntry)$/;
									if (regEx.test(oElement.getId())) {
										return {
											actions: null,
											properties: function(oElement) {
												return DesigntimeUtils.getButtonProperties(oElement);
											}
										};
									}
									return {
										getCommonInstanceData: function(oElement) {
											return getInstanceDataForButton(oElement);
										},
										getLabel: function(oElement) {
											return oElement.getText();
										},
										properties: function(oElement) {
											return DesigntimeUtils.ignoreAllProperties(oElement);
										},
										actions: {
											rename: null,
											remove: {
												changeType: "removeToolbarActionButton",
												changeOnRelevantContainer: true
											},
											reveal: {
												changeType: "revealToolbarActionButton",
												changeOnRelevantContainer: true
											},
											settings: {
												name: "Add Action Button",
												handler: addToolbarActionButtonSettingsHandler,
												icon: "sap-icon://add"
											}
										},
										annotations: {
											dataFieldForAction: {
												namespace: "com.sap.vocabularies.UI.v1",
												annotation: "DataFieldForAction",
												whiteList: {
													properties: ["Action", "Label", "Criticality", "InvocationGrouping"],
													mandatory: ["Action"],
													expressionTypes: {
														Action: ["String"],
														Label: ["String"],
														Criticality: ["Path"]
													}
												},
												ignore: function() {
													var oRecord = Utils.getLineItemRecordForButton(oElement);
													return !oRecord || oRecord.RecordType !== "com.sap.vocabularies.UI.v1.DataFieldForAction";
												},
												appliesTo: ["Button"],
												links: {
													developer: [{
														href: "/topic/b623e0bbbb2b4147b2d0516c463921a0",
														text: function() {
															return oResourceBundle.getText("FE_SDK_GUIDE_TABLE_ACTION");
														}
													}]
												}
											},
											dataFieldForIBN: {
												namespace: "com.sap.vocabularies.UI.v1",
												annotation: "DataFieldForIntentBasedNavigation",
												whiteList: {
													properties: ["SemanticObject", "Action", "Label", "Criticality"],
													mandatory: ["SemanticObject"],
													expressionTypes: {
														SemanticObject: ["String"],
														Action: ["String"],
														Label: ["String"],
														Criticality: ["Path"]
													}
												},
												ignore: function() {
													var oRecord = Utils.getLineItemRecordForButton(oElement);
													return !oRecord || oRecord.RecordType !== "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation";
												},
												appliesTo: ["Button"]
											},
											importance: {
												namespace: "com.sap.vocabularies.UI.v1",
												annotation: "Importance",
												defaultValue: null,
												target: ["Record"],
												ignore: function() {
													var sColumnType = ColumnType.getColumnType(oElement);
													return sColumnType === undefined;   // ==> break-out column
												},
												links: {
													developer: [{
														href: "/topic/69efbe747fc44c0fa445b24ed369cb1e",
														text: function() {
															return oResourceBundle.getText("FE_SDK_GUIDE_RESPONSIVENESS");
														}
													}, {
														href: "/api/sap.ui.comp.smarttable.SmartTable/annotations/Importance",
														text: function() {
															return oResourceBundle.getText("FE_API_SMART_TABLE_ANNOTATIONS");
														}
													}]
												}
											}
										}
									};
								default:
									return {
										actions: null
									};
							}
						},
						actions: {
							move: function (oElement) {
								switch (oElement.getMetadata().getElementName()) {
									case "sap.m.ToolbarSeparator":
									case "sap.m.ToolbarSpacer":
									case "sap.m.Title":
									case "sap.m.OverflowToolbarButton":
									case "sap.m.MenuButton":
									case "sap.ui.comp.smartvariants.SmartVariantManagement":
										return null;
									case "sap.m.Button":
										var regEx = /.+(sap.suite.ui.generic.template.ListReport.view.ListReport::).+(--deleteEntry)$/;
										if (regEx.test(oElement.getId())) {
											return null;
										}
										return "moveToolbarActionButtons";
								}
							}
						}
					}
				}
			}
		};
	}
);
