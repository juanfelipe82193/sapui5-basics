/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
// Provides the design time metadata for the sap.suite.ui.generic.template.ListReport component

sap.ui.define(["sap/suite/ui/generic/template/designtime/Column.designtime",
		"sap/suite/ui/generic/template/designtime/Table.designtime",
		"sap/suite/ui/generic/template/designtime/SmartTable.designtime",
		"sap/suite/ui/generic/template/designtime/DynamicPage.designtime",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/suite/ui/generic/template/designtime/library.designtime"
	],
	function (Column, Table, SmartTable, DynamicPage, DesigntimeUtils) {
		"use strict";

		var oResourceBundle = sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();

		return {
			'default': {
				controllerExtensionTemplate : "sap/suite/ui/generic/template/designtime/ListReportControllerExtensionTemplate", //Template for ListReport Extensibility via UI Adaptation Editor tool
				name: {
					singular: function() {
						return oResourceBundle.getText("FE_LIST_REPORT");
					}
				},
				aggregations: {
					content: {
						ignore: false,
						propagateMetadata: function (oElement) {
							if (oElement.getMetadata().getElementName) {
								switch (oElement.getMetadata().getElementName()) {
									case "sap.ui.comp.smarttable.SmartTable":
										return {
											name: {
												singular: function() {
													return oResourceBundle.getText("FE_SMARTTABLE");
												}
											}
										};
									default:
										break;
								}
							}
						}
					}
				}
			},
			'strict': {      // scope = strict UX compatibility
				name: {
					singular: function() {
						return oResourceBundle.getText("FE_LIST_REPORT");
					}
				},
				properties: function(oElement) {
					return DesigntimeUtils.ignoreAllProperties(oElement);
				},
				aggregations: {
					content: {
						ignore: false,
						// indicates, that this is the designtime that contains all definition
						// used by descendant controls that set changeOnRelevantContainer
						propagateRelevantContainer: true,
						// definition of metadata for descendant controls. Called for all descendants (not only dirct children),
						// therefore no need for deep nesting

						links: {
							guidelines: [{
								href: "/list-report-floorplan-sap-fiori-element/",
								text: function() {
									return oResourceBundle.getText("FE_LRP_GUIDE");
								}
							}]
						},
						propagateMetadata: function (oElement) {
							if (oElement.getMetadata().getElementName) {
								switch (oElement.getMetadata().getElementName()) {
									case "sap.f.DynamicPage":
										return DynamicPage.getDesigntime(oElement);
									case "sap.m.Table":
										return Table.getDesigntime(oElement);
									case "sap.m.Button":
										return {
											name: {
												singular:  function() {
													return oResourceBundle.getText("FE_BUTTON");
												}
											},
											properties: DesigntimeUtils.getButtonProperties(oElement),
											actions: {
												rename: null
											}
										};
									case "sap.m.OverflowToolbarButton":
										return {
											aggregations: {
												settings: {
													ignore: true
												}
											},
											name: {
												singular:  function() {
													return oResourceBundle.getText("FE_BUTTON");
												}
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
											properties: DesigntimeUtils.getButtonProperties(oElement),
											annotations: {
												importance: {
													namespace: "com.sap.vocabularies.UI.v1",
													annotation: "Importance",
													target: ["Record"],
													appliesTo: ["OverflowToolbar/Button/OverflowToolbarLayoutData"]
												}
											}
										};
									case "sap.m.MessageView":
										return {
											name: {
												singular: function () {
													return oResourceBundle.getText("FE_MESSAGE_VIEW");
												}
											},
											properties: function(oElement) {
												return DesigntimeUtils.ignoreAllProperties(oElement);
											}
										};
									case "sap.ui.comp.smartfilterbar.SmartFilterBar":
									case "sap.ui.layout.VerticalLayout":
									case "sap.ui.layout.AlignedFlowLayout":
									case "sap.m.OverflowToolbar":
										return;  // designtime is registered separately via instance specific metadata

									case "sap.m.MultiComboBox":
										return {
											aggregations: {
												items: {
													ignore: true
												}
											}
										};

									case "sap.f.DynamicPageHeader":
										return {
											name: {
												singular: function () {
													return oResourceBundle.getText("FE_DYNAMIC_PAGE_HEADER");
												}
											},
											properties: function(oElement) {
												return DesigntimeUtils.ignoreAllProperties(oElement);
											},
											aggregations: {
												items: {
													name: {
														singular:  "Item",
														plural: "Items"
													}
												}
											},
											actions: null
										};
									case "sap.f.DynamicPageTitle":
										return {
											name: {
												singular: function() {
													return oResourceBundle.getText("FE_DYNAMIC_PAGE_TITLE");
												}
											},
											properties: function(oElement) {
												return DesigntimeUtils.ignoreAllProperties(oElement);
											},
											aggregations: {
												actions: {
													ignore: true
												},
												snappedContent: {
													ignore: true
												},
												content: {
													ignore: true
												},
												heading: {
													ignore: true
												}
											},
											actions: null
										};

									case "sap.ui.comp.smarttable.SmartTable":
										return SmartTable.getDesigntime(oElement);
									case "sap.ui.table.AnalyticalTable":
									case "sap.ui.table.Table":
										return Table.getDesigntime(oElement);
									case "sap.ui.table.Column":
									case "sap.ui.table.AnalyticalColumn":
									case "sap.m.Column":
										return Column.getDesigntime(oElement);
									default:
										// don't allow any changes on any other controls
										return {
											actions: null
										};
								}
							} else {
								return {
									actions: null
								};
							}
						}
					}
				},
				actions: {},
				annotations: {}
			}
		};
	}, /* bExport= */  true);
