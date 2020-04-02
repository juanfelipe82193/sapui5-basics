/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
// Provides the design time metadata for the sap.suite.ui.generic.template.ObjectPage component

// load flexibility utils and designtime library, including resource bundle
sap.ui.define([
		"sap/suite/ui/generic/template/designtime/SmartForm.designtime",
		"sap/suite/ui/generic/template/designtime/Group.designtime",
		"sap/suite/ui/generic/template/designtime/ObjectPageLayout.designtime",
		"sap/suite/ui/generic/template/designtime/ObjectPageSection.designtime",
		"sap/suite/ui/generic/template/designtime/GroupElement.designtime",
		"sap/suite/ui/generic/template/designtime/ObjectPageHeader.designtime",
		"sap/suite/ui/generic/template/designtime/ObjectPageHeaderActionButton.designtime",
		"sap/suite/ui/generic/template/designtime/ObjectPageDynamicHeaderTitle.designtime",
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/suite/ui/generic/template/designtime/ObjectPageSubSection.designtime",
		"sap/suite/ui/generic/template/designtime/HeaderFacet.designtime",
		"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
		"sap/suite/ui/generic/template/designtime/Column.designtime",
		"sap/suite/ui/generic/template/designtime/virtualProperties/DeterminingActionType",
		"sap/suite/ui/generic/template/designtime/Table.designtime",
		"sap/suite/ui/generic/template/designtime/SmartTable.designtime",
		"sap/suite/ui/generic/template/lib/testableHelper",
		"sap/base/util/deepExtend",
		"sap/suite/ui/generic/template/designtime/library.designtime"
	],
	function(SmartForm, Group, ObjectPageLayout, ObjectPageSection, GroupElement, ObjectPageHeader, ObjectPageHeaderActionButton,
			 ObjectPageDynamicHeaderTitle, Utils, DesigntimeUtils, ObjectPageSubSection, HeaderFacet,
			AnnotationChangeUtils, Column, DeterminingActionType, Table, SmartTable, testableHelper, deepExtend) {
		"use strict";

		var oResourceBundle = sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();

		/**
		 * Defines the valid control properties for smart tables of the object page
		 *
		 * @param {sap.ui.comp.smarttable.SmartTable} oSmartTable - Smart Table
		 * @returns {object} Object comprising all black or white-listed properties
		 */
		var getSmartTableProperties = function(oSmartTable) {
			var oPropertiesBlackList = DesigntimeUtils.ignoreAllProperties(oSmartTable);
			var oPropertiesWhiteList = {
				//Control Properties:
				editable: { ignore: false }
			};

			return deepExtend({}, oPropertiesBlackList, oPropertiesWhiteList);
		};

		/**
		 * Defines the valid control properties for sap.ui.layout.GridData
		 *
		 * @param {sap.ui.layout.GridData} oGridData - Data of a grid layout
		 * @returns {object} Object comprising all black or white-listed properties
		 */
		var getGridProperties = function(oGridData) {
			var oPropertiesBlackList = DesigntimeUtils.ignoreAllProperties(oGridData);
			var oPropertiesWhiteList = {
				//Control Properties:
				span: { ignore: false },
				spanS: { ignore: false },
				spanM: { ignore: false },
				spanL: { ignore: false },
				spanXL: { ignore: false }
			};

			return deepExtend({}, oPropertiesBlackList, oPropertiesWhiteList);
		};

		/**
		 * Defines the valid control properties for an avatar (as present in the object page header)
		 *
		 * @param {sap.f.Avatar} oAvatar - Avatar
		 * @returns {object} Object comprising all black or white-listed properties
		 */
		var getAvatarProperties = function(oAvatar) {
			var oPropertiesBlackList = DesigntimeUtils.ignoreAllProperties(oAvatar);
			var oPropertiesWhiteList = {
				//Control Properties:
				displayShape: { ignore: false }
			};

			return deepExtend({}, oPropertiesBlackList, oPropertiesWhiteList);
		};

		/**
		 * Gets the parent control of the UI Element.
		 *
		 * @param {object} oElement The UI5 element (in overlay mode)
		 * @param {string} sParent The name of the parent control
		 * @returns {object} oElement is the parent (not necessarily immediate) of the UI5 element.
		 * @public
		 */
		var getParentControl = function (oElement, sParent) {
			while (oElement) {
				if (oElement.getMetadata().getElementName() === sParent) {
					return oElement;
				} else if (oElement.getMetadata().getElementName() === 'sap.ui.core.mvc.XMLView') {
					break;
				} else if (oElement.getParent()) {
					oElement = oElement.getParent();
				} else {
					break;
				}
			}
			return undefined;
		};

		/**
		 * Defines the virtual properties for Determining action button
		 *
		 * @param {object} oButton The UI5 element (in overlay mode)
		 * @returns {object} oElement is the parent (not necessarily immediate) of the UI5 element.
		 * @public
		 */
		var getDeterminingActionProperties = function (oButton) {
			var oPropertiesBlackList = DesigntimeUtils.ignoreAllProperties(oButton);
			var oPropertiesWhiteList = {
				//Control Properties:
				visible: { ignore: false },
				//Virtual Properties:
				determiningActionType: {
					name: "Footer Action Type",
					virtual: true,
					ignore: false,
					type: "EnumType",
					possibleValues: DeterminingActionType.getActionTypeValues(),
					get: function(oButton) {
						return DeterminingActionType.get(oButton);
					},
					set: function(oButton, sNewActionElementType, oChange) {
						return DeterminingActionType.set(oButton, sNewActionElementType, oChange);
					}
				}
			};
			return deepExtend({}, oPropertiesBlackList, oPropertiesWhiteList);
		};

		testableHelper.testableStatic(getParentControl, "ObjectPageDesigntime_getParentControl");

		/**
		 * Add settings handler for footer button
		 * @param {object} oTargetButton The button
		 * @param {object} mPropertyBag Property bag of the RTA change
		 */
		var addFooterActionButtonSettingsHandler = function(oTargetButton, mPropertyBag) {
			var aActions = [];
			if (oTargetButton.getId().indexOf("-template::ObjectPage::FooterToolbar") > -1) {
				aActions = oTargetButton.getContent();
			} else {
				aActions = oTargetButton.getParent().getContent();
			}
			var sChangeHandler = "addFooterActionButton";
			return DesigntimeUtils.addSettingsHandler(oTargetButton, mPropertyBag, aActions, sChangeHandler);
		};

		/**
		 * Retrieves the propagated and redefined designtime for a smart field on the object page
		 *
		 * @param {sap.ui.comp.smartfield.SmartField} oElement The current UI element
		 * @returns {object} designtime metadata, with embedded functions
		 * @public
		 */
		var getSmartFieldDesigntime = function(oElement) {
			return {
				name: {
					singular: function() {
						return oResourceBundle.getText("FE_FIELD");
					},
					plural: function() {
						return oResourceBundle.getText("FE_FIELDS");
					}
				},
				properties: function(oElement) {
					return DesigntimeUtils.ignoreAllProperties(oElement);
				},
				annotations: {
					dataType: { ignore: true }, //not an annotation
					fieldCreatable: { ignore: true },
					fieldLabel: { ignore: true },
					fieldCurrencyCode: { ignore: true }, //property annotations, not supported yet
					fieldUnitOfMeasure: { ignore: true }, //property annotations, not supported yet
					fieldScale: { ignore: true }, //property annotations, not supported yet
					fieldQuickInfo: { ignore: true }, //property annotations, not supported yet
					fieldMultiLineText: { ignore: true }, //property annotations, not supported yet
					fieldUpperCase: { ignore: true }, //property annotations, not supported yet
					fieldDigitSequence: { ignore: true }, //property annotations, not supported yet
					fieldCalendarDate: { ignore: true }, //property annotations, not supported yet
					fieldEmailAddress: { ignore: true }, //property annotations, not supported yet
					fieldPhoneNumber: { ignore: true }, //property annotations, not supported yet
					fieldUrl: { ignore: true }, //property annotations, not supported yet
					fieldComputed: { ignore: true }, //property annotations, not supported yet
					fieldControl: { ignore: true }, //property annotations, not supported yet
					fieldVisible: { ignore: true }, //redundant definition
					fieldImmutable: { ignore: true }, //property annotations, not supported yet
					fieldMandatory: { ignore: true },//property annotations, not supported yet
					fieldMasked: { ignore: true },//property annotations, not supported yet
					fieldReadOnly: { ignore: true },//property annotations, not supported yet
					fieldRecommendationState: { ignore: true },//property annotations, not supported yet
					fieldSideEffects: { ignore: true },//property annotations, not supported yet
					fieldText: { ignore: true },//property annotations, not supported yet
					fieldUpdatableEntitySet:{ ignore: true },//property annotations, not supported yet
					textArrangement: { ignore: true },//property annotations, not supported yet
					valueListWithFixedValues: { ignore: true }, //property annotations, not supported yet
					valueList: { ignore: true } //complex, rather defined on BO view
				},
				aggregations: {
					configuration: {actions: null},
					semanticObjectController: {actions: null}
				}
			};
		};

		/**
		 * Retrieves the propagated and redefined designtime for an overflow toolbar on the object page
		 *
		 * @param {sap.m.OverflowToolbar} oElement The current UI element
		 * @returns {object} designtime metadata, with embedded functions
		 * @public
		 */
		var getOverFlowToolbarDesigntime = function(oElement) {
			var oToolbarData = {
				actions: {},
				properties: function(oElement) {
					return DesigntimeUtils.ignoreAllProperties(oElement);
				},
				name: {
					singular: function () {
						return oResourceBundle.getText("FE_TOOLBAR");
					}
				}
			};
			if (oElement.getId().indexOf("--template::ObjectPage::FooterToolbar") >= 0) {
				var oFooterToolbarData =  {
					actions: {
						settings: {
							name: "Add Action Button",
							handler: addFooterActionButtonSettingsHandler,
							icon: "sap-icon://add"
						},
						reveal: null
					},
					aggregations: {
						content: {
							propagateRelevantContainer: true,
							actions: {
								move: function (oElement) {
									switch (oElement.getMetadata().getElementName()) {
										case "sap.m.Button":
											if (oElement.getId().indexOf("::Determining") >= 0) {
												return "moveHeaderAndFooterActionButton";
											}
									}
								}
							}
						}
					}
				};
				deepExtend(oToolbarData, oFooterToolbarData);
			}
			return oToolbarData;
		};

		/**
		 * Retrieves the propagated and redefined designtime for a button on the object page
		 *
		 * @param {sap.ui.comp.navpopover.SmartLink} oElement The current UI element
		 * @returns {object} designtime metadata, with embedded functions
		 * @public
		 */
		var getSmartLinkDesigntime = function(oElement) {
			return {
				name: {
					singular: function() {
						return oResourceBundle.getText("FE_LINK");
					},
					plural: function() {
						return oResourceBundle.getText("FE_LINKS");
					}
				},
				properties: function(oElement) {
					return DesigntimeUtils.ignoreAllProperties(oElement);
				},
				annotations: {
					semanticObjectMapping: { ignore: true }, //property annotations, not supported yet
					semanticObjectUnavailableActions: { ignore: true },//property annotations, not supported yet
					contact: { ignore: true } //property annotations, not supported yet
				},
				actions: {}
			};
		};
		/**
		 * Retrieves the propagated and redefined designtime for a button on the object page
		 *
		 * @param {sap.m.Button} oElement The current UI element
		 * @returns {object} designtime metadata, with embedded functions
		 * @public
		 */
		var getButtonDesigntime = function(oElement) {
			var oButtonData = {
				name: {
					singular: function () {
						return oResourceBundle.getText("FE_BUTTON");
					}
				},
				properties: function() {
					return DesigntimeUtils.getButtonProperties(oElement);
				},
				actions: null
			};
			if (oElement.getId().indexOf("::Determining") >= 0) {
				var oDeterminingButtonData = {
					getCommonInstanceData: function(oElement) {
						var oTemplData = Utils.getTemplatingInfo(oElement);
						if (oTemplData && oTemplData.path) {
							var sTarget = oTemplData.target + '/' + oTemplData.path.substr(oTemplData.path.indexOf("com.sap.vocabularies.UI.v1.Identification"));
							return {
								target: sTarget,
								annotation: oTemplData.annotation,
								qualifier: null
							};
						}
					},
					links: {
						developer: [{
							href: "/topic/1743323829e5474eb3829d2e9ab022ae",
							text: function() {
								return oResourceBundle.getText("FE_SDK_GUIDE_DETERMINING_ACTIONS");
							}
						}]
					},
					actions: {
						remove: {
							changeType: "removeHeaderAndFooterActionButton",
							changeOnRelevantContainer: true
						},
						rename: null,
						reveal: null,
						settings: {
							name: "Add Action Button",
							handler: addFooterActionButtonSettingsHandler,
							icon: "sap-icon://add"
						}
					},
					properties: getDeterminingActionProperties(oElement),
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
								var oTempInfo = Utils.getTemplatingInfo(oElement);
								var oRecord = oTempInfo && oTempInfo.annotationContext;
								return !oRecord || oRecord.RecordType !== "com.sap.vocabularies.UI.v1.DataFieldForAction";
							},
							appliesTo: ["Button"],
							links: {
								developer: [{
									href: "/topic/1743323829e5474eb3829d2e9ab022ae",
									text: function() {
										return oResourceBundle.getText("FE_SDK_GUIDE_DETERMINING_ACTIONS");
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
								var oTempInfo = Utils.getTemplatingInfo(oElement);
								var oRecord = oTempInfo && oTempInfo.annotationContext;
								return !oRecord || oRecord.RecordType !== "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation";
							},
							appliesTo: ["Button"],
							links: {
								developer: [{
									href: "/topic/1743323829e5474eb3829d2e9ab022ae",
									text: function() {
										return oResourceBundle.getText("FE_SDK_GUIDE_DETERMINING_ACTIONS");
									}
								}]
							}
						},
						importance: {
							namespace: "com.sap.vocabularies.UI.v1",
							annotation: "Importance",
							defaultValue: null,
							target: ["Record"],
							appliesTo: ["Button"],
							links: {
								developer: [{
									href: "/topic/1743323829e5474eb3829d2e9ab022ae",
									text: function() {
										return oResourceBundle.getText("FE_SDK_GUIDE_DETERMINING_ACTIONS");
									}
								}]
							}
						}
					}
				};
				deepExtend(oButtonData, oDeterminingButtonData);
			}
			return oButtonData;
		};

		/**
		 * Retrieves the propagated and redefined designtime for the object page header content
		 *
		 * @param {sap.uxap.ObjectPageHeaderContent} oElement The current UI element
		 * @returns {object} designtime metadata, with embedded functions
		 * @public
		 */
		var getHeaderContentDesigntime = function(oElement) {
			return {
				name: {
					singular: function () {
						return oResourceBundle.getText("FE_OBJECT_PAGE_HEADER_CONTENT");
					}
				},
				properties: function(oElement) {
					return DesigntimeUtils.ignoreAllProperties(oElement);
				},
				aggregations: {
					content: {
						childNames: {
							singular: function () {
								return oResourceBundle.getText("FE_OBJECT_PAGE_HEADER_FACET");
							}
						},
						actions: {
							move: function (oElement) {
								if (oElement.getId().indexOf("Extension") === -1 && oElement.getMetadata().getElementName() !== "sap.m.Image") {
									return "moveHeaderFacet";
								}
							},
							createContainer: {
								changeType: "addHeaderFacet",
								changeOnRelevantContainer: true,
								getCreatedContainerId: function (sNewControlID) {
									return sNewControlID;
								}
							}
						}
					}
				}
			};
		};

		/**
		 * Retrieves the propagated and redefined designtime for a flexbox on the object page
		 *
		 * @param {sap.m.FlexBox} oElement The current UI element
		 * @param {boolean} bOnlyBasicData Indicator: Only fill name and set all properties ro read-only
		 * @returns {object} designtime metadata, with embedded functions
		 * @public
		 */
		var getFlexBoxDesigntime = function(oElement, bOnlyBasicData) {
			var oResourceBundle = sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();
			var oFlexboxData = {
				name: {
					singular: function () {
						return oResourceBundle.getText("FE_DYNAMIC_HEADER_CONTENT_FLEXBOX");
					}
				},
				properties: function(oElement) {
					return DesigntimeUtils.ignoreAllProperties(oElement);
				},
				items: {
					childNames: {
						singular: function () {
							return oResourceBundle.getText("FE_OBJECT_PAGE_HEADER_FACET");
						}
					}
				}
			};
			if (bOnlyBasicData) {
				return oFlexboxData;
			}
			var oExtendedFlexboxData =  {
				aggregations: {
					items: {
						childNames: {
							singular: function () {
								return oResourceBundle.getText("FE_OBJECT_PAGE_HEADER_FACET");
							}
						},
						actions: {
							move: function (oElement) {
								if (oElement.getId().indexOf("Extension") === -1 && oElement.getMetadata().getElementName() !== "sap.f.Avatar") {
									return "moveHeaderFacet";
								}
							},
							createContainer: {
								changeType: "addHeaderFacet",
								changeOnRelevantContainer: true,
								getCreatedContainerId: function (sNewControlID) {
									return sNewControlID;
								}
							}
						}
					}
				}
			};

			return deepExtend(oFlexboxData, oExtendedFlexboxData);
		};

		/**
		 * Fills the designtime metadata with a given label and a black list for all control properties
		 * @param {object} oElement The current UI element
		 * @param {string} sName The display name of the element in singular
		 * @returns {object} designtime metadata, with label, no control properties, no annotations. no actions
		 * @private
		 */
		var _onlyLabel = function(oElement, sName) {
			return {
				name: {
					singular: sName
				},
				properties: function(oElement) {
					return DesigntimeUtils.ignoreAllProperties(oElement);
				},
				actions: null,
				annotations: null
			};
		};

		/**********************************
		 * The Object page designtime
		 * ********************************/

		return {
			'default': {
				controllerExtensionTemplate : "sap/suite/ui/generic/template/designtime/ObjectPageControllerExtensionTemplate"//Template for ObjectPage Extensibility via UI Adaptation Editor tool
			},
			'strict': {		// scope = strict UX compatibility for Fiori Elements.
				name: {
					singular: function() {
						return oResourceBundle.getText("FE_OBJECT_PAGE");
					}
				},
				actions: null,
				annotations: null,
				properties: function(oElement) {
					return DesigntimeUtils.ignoreAllProperties(oElement);
				},
				aggregations: {
					content: {
						ignore: false,
						// indicates, that this (FlexEnabler) is the control that contains the definition of changetypes
						// used by descendant controls that set changeOnRelevantContainer
						propagateRelevantContainer: true,
						// definition of metadata for descendant controls. Called for all descendants (not only direct children),
						// therefore no need for deep nesting

						propagateMetadata: function (oElement) {
							var oSection, oTemplData, oHeaderContent, bOnlyBasicData;
							if (oElement.getMetadata().getElementName) {
								switch (oElement.getMetadata().getElementName()) {
									case "sap.uxap.ObjectPageLayout":
										return ObjectPageLayout.getDesigntime(oElement);
									case "sap.uxap.ObjectPageSection":
										return ObjectPageSection.getDesigntime(oElement);
									case "sap.uxap.ObjectPageSubSection":
										oTemplData = Utils.getTemplatingInfo(oElement);
										bOnlyBasicData = !oTemplData ? true : false;
										return ObjectPageSubSection.getDesigntime(oElement, bOnlyBasicData);
									case "sap.ui.comp.smartform.SmartForm":
										oSection = getParentControl(oElement, "sap.uxap.ObjectPageSection");
										oTemplData = Utils.getTemplatingInfo(oSection);
										bOnlyBasicData = !oTemplData ? true : false;
										return SmartForm.getDesigntime(oElement,bOnlyBasicData);
									case "sap.ui.comp.smartform.Group":
										oSection = getParentControl(oElement, "sap.uxap.ObjectPageSection");
										oTemplData = Utils.getTemplatingInfo(oSection);
										bOnlyBasicData = !oTemplData ? true : false;
										return Group.getDesigntime(oElement, bOnlyBasicData);
									case "sap.ui.comp.smartform.GroupElement":
										oSection = getParentControl(oElement, "sap.uxap.ObjectPageSection");
										oTemplData = Utils.getTemplatingInfo(oSection);
										bOnlyBasicData = !oTemplData ? true : false;
										return GroupElement.getDesigntime(oElement, bOnlyBasicData);
									case "sap.m.Table":
									case "sap.ui.table.AnalyticalTable":
									case "sap.ui.table.Table":
										return Table.getDesigntime(oElement);
									case "sap.ui.table.Column":
									case "sap.ui.table.AnalyticalColumn":
									case "sap.m.Column":
										return Column.getDesigntime(oElement);
									case "sap.ui.comp.smarttable.SmartTable":
										//Reuse LRP SmartTable, but with redefined control properties
										var oSmartTableData = SmartTable.getDesigntime(oElement);
										oSmartTableData.properties = getSmartTableProperties(oElement);
										return oSmartTableData;
									case "sap.uxap.ObjectPageHeaderContent":
										return getHeaderContentDesigntime(oElement);
									case "sap.m.FlexBox":
										oHeaderContent = getParentControl(oElement, "sap.uxap.ObjectPageDynamicHeaderContent");
										bOnlyBasicData = !oHeaderContent ? true : false;
										return getFlexBoxDesigntime(oElement, bOnlyBasicData);
                                    case "sap.ui.layout.GridData":
                                        return {
                                            properties: getGridProperties(oElement)
                                        };
									case "sap.m.VBox":
										oHeaderContent = getParentControl(oElement, "sap.uxap.ObjectPageHeaderContent")
											|| getParentControl(oElement, "sap.uxap.ObjectPageDynamicHeaderContent");
										bOnlyBasicData = !oHeaderContent ? true : false;
										return HeaderFacet.getDesigntime(oElement, bOnlyBasicData);
									case "sap.uxap.ObjectPageHeader":
										return ObjectPageHeader.getDesigntime(oElement);
									case "sap.uxap.ObjectPageDynamicHeaderTitle":
										return ObjectPageDynamicHeaderTitle.getDesigntime(oElement);
									case "sap.uxap.ObjectPageHeaderActionButton":
										return ObjectPageHeaderActionButton.getDesigntime(oElement);
									case "sap.ui.comp.smartfield.SmartField":
										return getSmartFieldDesigntime(oElement);
									case "sap.ui.comp.navpopover.SmartLink":
										return getSmartLinkDesigntime(oElement);
									case "sap.m.SearchField":
										return _onlyLabel(oElement, "Search Field");
									case "sap.ui.comp.smartfield.SmartLabel":
										return {
											properties: function(oElement) {
												return DesigntimeUtils.ignoreAllProperties(oElement);
											}
										};
									case "sap.f.Avatar":
										return {
											name: {
												singular: "Avatar"
											},
											properties: getAvatarProperties(oElement)
										};
									case "sap.ui.comp.smartmicrochart.SmartMicroChart":
										return {
											name: {
												singular: "Smart Micro Chart"
											},
											properties: function(oElement) {
												return DesigntimeUtils.ignoreAllProperties(oElement);
											}
										};
									case "sap.ui.core.mvc.XMLView":
										return _onlyLabel(oElement, "XML View");
									case "sap.m.DraftIndicator":
										return _onlyLabel(oElement, "Draft Indicator");
									case "sap.m.Breadcrumbs":
										return _onlyLabel(oElement, "Bread Crumb");
									case "sap.ui.core.InvisibleText":
										return _onlyLabel(oElement, "Invisible Text");
									case "sap.ui.fl.variants.VariantManagement":
										return {
											name: {
												singular: "Variant Management"
											},
											properties: function(oElement) {
												return DesigntimeUtils.ignoreAllProperties(oElement);
											},
											annotations: null
										};
									case "sap.m.Button":
										return getButtonDesigntime(oElement);
                                    case "sap.m.OverflowToolbar":
										return getOverFlowToolbarDesigntime(oElement);
									case "sap.m.Title":
										return _onlyLabel(oElement, "Title");
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
									default:
										return  _onlyLabel(oElement, oElement.getMetadata().getElementName());
								}
							} else {
								return {
									actions: null,
									annotations: null,
									properties: function(oElement) {
										return DesigntimeUtils.ignoreAllProperties(oElement);
									}
								};
							}
						}
					}
				}
			}
		};
	}, /* bExport= */ true);
