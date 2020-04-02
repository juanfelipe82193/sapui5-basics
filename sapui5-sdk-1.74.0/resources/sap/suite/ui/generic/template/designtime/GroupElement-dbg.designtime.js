sap.ui.define([
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
		"sap/suite/ui/generic/template/designtime/virtualProperties/GroupElementType",
		"./library.designtime", // provides designtime i18n model
		"sap/base/util/deepExtend"
	],
	function(Utils, DesigntimeUtils, AnnotationChangeUtils, GroupElementType, designtime, deepExtend) {
		"use strict";

		var GROUP_ELEMENT_TYPE_DATAFIELD = "Datafield",
			GROUP_ELEMENT_TYPE_CONTACT = "Contact",
			GROUP_ELEMENT_TYPE_ADDRESS = "Address",
			GROUP_ELEMENT_TYPE_INTENTBASEDNAV = "DataFieldWithIntentBasedNavigation",
			GROUP_ELEMENT_TYPE_DATAFIELDWITHURL = "DatafieldWithUrl",
			GROUP_ELEMENT_TYPE_DATAFIELDWITHNAVPATH = "DataFieldWithNavigationPath",

			oResourceBundle = sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle(),

			GroupElementDesigntime = {};

		/**
		 * Defines the valid control properties for sap.ui.comp.smartform.GroupElement
		 *
		 * @param {sap.ui.comp.smartform.GroupElement} oGroupElement - Element of a field group
		 * @returns {object} Object comprising all black or white-listed properties
		 */
		GroupElementDesigntime.getGroupElementProperties = function(oGroupElement) {
			var oPropertiesBlackList = DesigntimeUtils.ignoreAllProperties(oGroupElement);
			var oPropertiesWhiteList = {
				//Virtual Properties:
				groupElementType: {
					name: oResourceBundle.getText("FE_GROUP_ELEMENT_TYPE"),
					virtual: true,
					ignore: false,
					type: "EnumType",
					possibleValues: GroupElementType.getGroupElementTypeValues(oGroupElement),
					get: function(oGroupElement) {
						return GroupElementType.getGroupElementType(oGroupElement);
					},
					set: function(oGroupElement, sNewGroupElementType, oChange) {
						return GroupElementType.setGroupElementType(oGroupElement, sNewGroupElementType, oChange);
					}
				}
			};

			return deepExtend({}, oPropertiesBlackList, oPropertiesWhiteList);
		};

		/**
		 * Retrieves the propagated and redefined designtime for a smartform group element on an object page
		 *
		 * @param {sap.ui.comp.smartform.GroupElement} oElement The group element instance
		 * @param {boolean} bOnlyBasicData Indicator: Only fill name and set all properties ro read-only
		 * @returns {object} The designtime metadata containing embedded functions
		 * @public
		 */
		GroupElementDesigntime.getDesigntime = function (oElement, bOnlyBasicData) {
			var oResourceBundle = sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();
			var oGroupElementData = {
				name: {
					singular: function() {
						return oResourceBundle.getText("FE_GROUP_ELEMENT");
					},
					plural: function() {
						return oResourceBundle.getText("FE_GROUP_ELEMENTS");
					}
				},
				properties: function(oElement) {
					return GroupElementDesigntime.getGroupElementProperties(oElement);
				}
			};

			if (bOnlyBasicData) {
				return oGroupElementData;
			}

			var oExtendedGroupElementData = {
				getCommonInstanceData: function(oElement) {
					//Get template info of the element
					var oTemplData = Utils.getTemplatingInfo(oElement);
					//Get the list of group elements
					var aGroupElements = Utils.getGroupElements(oElement, oTemplData);
					//Get the index if the item in the list
					var sRecordIndex = Utils.getGroupElementRecordIndex(oElement, aGroupElements);
					if (oTemplData && oTemplData.path && (sRecordIndex !== -1)) {
						//Logic to replace the incorrect index in target starts
						var dataPath = oTemplData.path.substr(oTemplData.path.indexOf(oTemplData.annotation));
						var dataPathArr = dataPath.split("/");
						dataPathArr[dataPathArr.length - 1] = sRecordIndex;
						var sTarget = oTemplData.target + '/' + dataPathArr.join("/");
						//Logic to replace the incorrect index in target ends
						return {
							target: sTarget,
							annotation: oTemplData.annotation,
							qualifier: null
						};
					} else {
						return null;
					}
				},
				actions: {
					remove: {
						changeType: "removeGroupElement",
						changeOnRelevantContainer: true
					},
					rename: null
				},
				annotations: {
					dataField: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataField",
						ignore: function () {
							var sGroupElementType = GroupElementType.getGroupElementType(oElement);
							return sGroupElementType !== GROUP_ELEMENT_TYPE_DATAFIELD;
						},
						whiteList: {
							properties: ["Value", "Label", "Criticality", "CriticalityRepresentation"],
							mandatory: ["Value"],
							expressionTypes: {
								Value: ["Path"],
								Label: ["String"],
								Criticality: ["Path"]
							}
						},
						appliesTo: ["GroupElement"],
						links: {
							developer: [{
								href: "/api/sap.ui.comp.smartform.GroupElement",
								text: function() {
									return oResourceBundle.getText("FE_GROUP_ELEMENT");
								}
							}]
						}
					},
					dataFieldWithUrl: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataFieldWithUrl",
						ignore: function () {
							var sGroupElementType = GroupElementType.getGroupElementType(oElement);
							return sGroupElementType !== GROUP_ELEMENT_TYPE_DATAFIELDWITHURL;
						},
						whiteList: {
							mandatory: ["Url", "Value"],
							expressionTypes: {
								Value: ["Path"]
							}
						},
						appliesTo: ["GroupElement"],
						links: {
							developer: [{
								href: "/api/sap.ui.comp.smartform.GroupElement",
								text: function() {
									return oResourceBundle.getText("FE_GROUP_ELEMENT");
								}
							}, {
								href: "/topic/1d4a0f94bfee48d1b50ca8084a76beec.html",
								text: function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_EXT_NAVI");
								}
							}]
						}
					},
					dataFieldForAnnotationContact: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataFieldForAnnotation",
						ignore: function () {
							var sGroupElementType = GroupElementType.getGroupElementType(oElement);
							return sGroupElementType !== GROUP_ELEMENT_TYPE_CONTACT;
						},
						whiteList: {
							properties: ["Target", "Label"],
							expressionTypes: {
								Label: ["String"]
							},
							mandatory: ["Target"]
						},
						appliesTo: ["GroupElement"],
						links: {
							developer: [{
								href: "/api/sap.ui.comp.smartform.GroupElement",
								text: function() {
									return oResourceBundle.getText("FE_GROUP_ELEMENT");
								}
							}, {
								href: "/topic/a6a8c0c4849b483eb10e87f6fdf9383c",
								text: function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_CONTACT_FACET");
								}
								}
							]
						},
						refersTo: [{
							annotation: "contact",
							referredBy: "Target"
						}]
					},
					dataFieldForAnnotationAddress: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataFieldForAnnotation",
						ignore: function () {
							var sGroupElementType = GroupElementType.getGroupElementType(oElement);
							return sGroupElementType !== GROUP_ELEMENT_TYPE_ADDRESS;
						},
						whiteList: {
							properties: ["Target", "Label"],
							expressionTypes: {
								Label: ["String"]
							},
							mandatory: ["Target"]
						},
						appliesTo: ["GroupElement"],
						links: {
							developer: [{
								href: "/api/sap.ui.comp.smartform.GroupElement",
								text: function() {
									return oResourceBundle.getText("FE_GROUP_ELEMENT");
								}
							}, {
								href: "/topic/9eb3aaecc09b431ca27f97eb1ee5d861",
								text: function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_ADDRESS_FACET");
								}
								}
							]
						},
						refersTo: [{
							annotation: "address",
							referredBy: "Target"
						}]
					},
					dataFieldWithIntentBasedNavigation: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataFieldWithIntentBasedNavigation",
						ignore: function () {
							var sGroupElementType = GroupElementType.getGroupElementType(oElement);
							return sGroupElementType !== GROUP_ELEMENT_TYPE_INTENTBASEDNAV;
						},
						whiteList: {
							properties: ["SemanticObject", "Action", "Label", "Value"],
							expressionTypes: {
								SemanticObject: ["String"],
								Action: ["String"],
								Label: ["String"]
							},
							mandatory: ["SemanticObject"]
						},
						appliesTo: ["GroupElement"],
						links: {
							developer: [
								{
								href: "/api/sap.ui.comp.smartform.GroupElement",
								text: function() {
									return oResourceBundle.getText("FE_GROUP_ELEMENT");
								}
							}, {
									href: "/topic/1d4a0f94bfee48d1b50ca8084a76beec.html",
									text: function() {
										return oResourceBundle.getText("FE_SDK_GUIDE_EXT_NAVI");
									}
								}
							]
						}
					},
					dataFieldWithNavigationPath: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataFieldWithNavigationPath",
						ignore: function () {
							var sGroupElementType = GroupElementType.getGroupElementType(oElement);
							return sGroupElementType !== GROUP_ELEMENT_TYPE_DATAFIELDWITHNAVPATH;
						},
						whiteList: {
							properties: ["Target", "Value", "Label"],
							expressionTypes: {
								Label: ["String"]
							},
							mandatory: ["Target", "Value"]
						},
						defaultValue: null,
						appliesTo: ["GroupElement"],
						links: {
							developer: [{
								href: "/api/sap.ui.comp.smartform.GroupElement",
								text: function() {
									return oResourceBundle.getText("FE_GROUP_ELEMENT");
								}
							}, {
								href: "/topic/2c65f07f44094012a511d6bd83f50f2d",
								text: function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_INT_NAVI");
								}
							}]
						}
					},
					contact: {
						namespace: "com.sap.vocabularies.Communication.v1",
						annotation: "Contact",
						ignore: function () {
							var sGroupElementType = GroupElementType.getGroupElementType(oElement);
							return sGroupElementType !== GROUP_ELEMENT_TYPE_CONTACT;
						},
						target: ["EntityType"],
						whiteList: {
							properties: [
								"fn", "n", "tel", "email", "photo", "title", "org", "role"
							],
							expressionTypes: {
								fn: ["Path"],
								photo: ["Path"],
								title: ["Path"],
								org: ["Path"],
								role: ["Path"]
							}
						},
						appliesTo: ["GroupElement"]
					},
					address: {
						namespace: "com.sap.vocabularies.Communication.v1",
						annotation: "Address",
						ignore: function () {
							var sGroupElementType = GroupElementType.getGroupElementType(oElement);
							return sGroupElementType !== GROUP_ELEMENT_TYPE_ADDRESS;
						},
						target: ["EntityType"],
						appliesTo: ["GroupElement"]
					},
					importance: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "Importance",
						defaultValue: null,
						target: ["Record"],
						appliesTo: ["GroupElement"],
						links: {
							developer: [{
								href: "/topic/69efbe747fc44c0fa445b24ed369cb1e",
								text: function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_RESPONSIVENESS");
								}
							}]
						}
					}
				}
			};

			return deepExtend(oGroupElementData, oExtendedGroupElementData);
		};

		return GroupElementDesigntime;
});
