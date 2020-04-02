sap.ui.define([
		"sap/ui/fl/changeHandler/ChangeHandlerMediator",
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/suite/ui/generic/template/designtime/virtualProperties/ChartMeasures",
		"sap/suite/ui/generic/template/designtime/virtualProperties/ChartType",
		"sap/base/util/deepExtend",
		"./library.designtime"// provides designtime i18n model
	],
	function(ChangeHandlerMediator, Utils, DesigntimeUtils, ChartMeasures, ChartType, deepExtend) {
		"use strict";

		var HEADER_FACETS = "com.sap.vocabularies.UI.v1.HeaderFacets";
		var FIELDGROUP = "com.sap.vocabularies.UI.v1.FieldGroup";
		var DATAPOINT = "com.sap.vocabularies.UI.v1.DataPoint";
		var IDENTIFICATION = "com.sap.vocabularies.UI.v1.Identification",
		CONTACT = "com.sap.vocabularies.Communication.v1.Contact",
		ADDRESS = "com.sap.vocabularies.Communication.v1.Address",
		FACETTYPE_CHART = "Chart",
		FACETTYPE_RATING_AGGREGATED = "RatingIndicator_Aggregated",
		FACETTYPE_RATING_NONAGGREGATED = "RatingIndicator_NonAggregated",
		FACETTYPE_PROGRESS = "ProgressIndicator",
		FACETTYPE_FORM = "Form",
		FACETTYPE_KEYVALUE = "KeyValue",
		FACETTYPE_CONTACT = "Contact",
		FACETTYPE_ADDRESS = "Address",
		CHART = "com.sap.vocabularies.UI.v1.Chart";

		var HeaderFacetDesigntime = {};

		HeaderFacetDesigntime.getFacetType = function (oElement) {
			var oTempInfo = Utils.getTemplatingInfo(oElement),
				sTarget = oTempInfo && oTempInfo.value;
			if (sTarget) {
				if (sTarget.indexOf(FIELDGROUP) > -1 || sTarget.indexOf(IDENTIFICATION) > -1) {
					return FACETTYPE_FORM;
				} else if (sTarget.indexOf(ADDRESS) > -1) {
					return FACETTYPE_ADDRESS;
				} else if (sTarget.indexOf(CONTACT) > -1) {
					return FACETTYPE_CONTACT;
				} else if (sTarget.indexOf(DATAPOINT) > -1) {
					var oEntityType = Utils.getEntityTypeFromAnnotationPath(oElement, sTarget);
					var iQualifierIndex = sTarget.search("#");
					var	sQualifier = sTarget.substring(iQualifierIndex);
					var sDataPoint = sQualifier ? DATAPOINT + sQualifier : DATAPOINT;
					var oDataPoint = oEntityType[sDataPoint];
					if (oDataPoint) {
						if (oDataPoint.Visualization && oDataPoint.Visualization.EnumMember === "com.sap.vocabularies.UI.v1.VisualizationType/Rating") {
							if (oDataPoint.SampleSize) {
								return FACETTYPE_RATING_AGGREGATED;
							} else {
								return FACETTYPE_RATING_NONAGGREGATED;
							}
						} else if (oDataPoint.Visualization && oDataPoint.Visualization.EnumMember === "com.sap.vocabularies.UI.v1.VisualizationType/Progress") {
							return FACETTYPE_PROGRESS;
						} else {
							return FACETTYPE_KEYVALUE;
						}
					}
				} else if (sTarget.indexOf(CHART) > -1) {
					return FACETTYPE_CHART;
				}
			}
		};

		/**
		 * Defines the valid control properties for a header facet
		 *
		 * @param {sap.m.VBox} oHeaderFacet - Header facet
		 * @returns {object} Object comprising all black or white-listed properties
		 */
		HeaderFacetDesigntime.getHeaderFacetProperties = function(oHeaderFacet) {
			var oPropertiesBlackList = DesigntimeUtils.ignoreAllProperties(oHeaderFacet);
			var oPropertiesWhiteList =  {
				//Control Properties:
				visible: {
					ignore: false
				},
				//Virtual Properties:
				vMeasures: {
					name: "Measures and Attributes",
					virtual: true,
					type: "Collection",
					ignore: function(oHeaderFacet) {
						var sType = HeaderFacetDesigntime.getFacetType(oHeaderFacet);
						return sType !==  FACETTYPE_CHART;
					},
					visible: false,
					multiple: true,
					possibleValues: ChartMeasures.getMeasureDefinition.bind(oHeaderFacet),
					get: function(oHeaderFacet) {
						return ChartMeasures.getMeasures.bind(oHeaderFacet);
					},
					set: function(oHeaderFacet, aNewMeasures, oChange) {
						return ChartMeasures.setMeasures.bind(oHeaderFacet, aNewMeasures, oChange);
					}
				}
			};

			return deepExtend({}, oPropertiesBlackList, oPropertiesWhiteList);
		};

		/*************************************************************************************************
		 * Retrieves the propagated and redefined designtime for a header facet of the object page
		 *
		 * @param {object} oElement The SAPUI5 element instance
		 * @param {boolean} bOnlyBasicData Indicator: Only fill name and set all properties ro read-only
		 * @returns {object} The designtime metadata containing embedded functions
		 * @public
		 */
		HeaderFacetDesigntime.getDesigntime = function (oElement, bOnlyBasicData) {
			var oResourceBundle = sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();

			var oHeaderFacetData = {
				actions: null,
				name: {
					singular: function() {
						return oResourceBundle.getText("FE_OBJECT_PAGE_HEADER_FACET");
					}
				}
			};
			if (bOnlyBasicData) {
				oHeaderFacetData.properties = DesigntimeUtils.ignoreAllProperties(oElement);
				return oHeaderFacetData;
			}

			oHeaderFacetData.properties = HeaderFacetDesigntime.getHeaderFacetProperties(oElement);

			if (oElement.getId().indexOf("Extension") >= 0) {
				return oHeaderFacetData;
			}

			var oExtendedHeaderFacetData = {
				getCommonInstanceData: function(oElement) {
					var oTemplData = Utils.getTemplatingInfo(oElement);

					if (oTemplData && oTemplData.path) {
						var sTarget = oTemplData.target + '/' + oTemplData.path.substr(oTemplData.path.indexOf(HEADER_FACETS));
						return {
							target: sTarget,
							annotation: oTemplData.annotation,
							qualifier: null
						};
					}
				},

				links: {
					developer: [{
							href: "/topic/17dbd5b7a61e4cdcb079062e976cd63f",
							text: function() {
								return oResourceBundle.getText("FE_OBJECT_PAGE_HEADER_FACETS");
							}
						}
					]
				},

				actions: {
					remove: {
						changeType: "removeHeaderFacet",
						changeOnRelevantContainer:true
					},
					reveal: {
						changeType: "revealHeaderFacet",
						changeOnRelevantContainer:true
					}
				},
				annotations: {
					referenceFacetForm: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "ReferenceFacet",
						whiteList: {
							properties: ["Target", "Label", "ID"],
							expressionTypes: {
								Label: ["String"]
							},
							mandatory: ["Target"]
						},
						ignore: function() {
							var sType = this.getFacetType(oElement);
							return sType !== FACETTYPE_FORM;
						}.bind(this),
						links: {
							developer: [ {
								href:"/topic/ebe05d52c43241c19aaf79dd5f1c69f1.html",
								text: function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_FORM_FACET");
								}
							}]
						}
					},
					referenceFacetDataPoint: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "ReferenceFacet",
						whiteList: {
							properties: ["Target", "ID"],
							mandatory: ["Target"]
						},
						links: {
							developer: [{
								href: "/topic/c312735b7417423ea239394b3b4f4018",
								text:  function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_KEYVALUE_FACET");
								}
							}]
						},
						ignore: function() {
							var sType = this.getFacetType(oElement);
							return sType !== FACETTYPE_KEYVALUE;
						}.bind(this),
						refersTo: [{
							annotation: "dataPoint",
							referredBy: "Target"
						}]
					},
					referenceFacetRatingAggregated: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "ReferenceFacet",
						whiteList: {
							properties: ["Target", "ID"],
							mandatory: ["Target"]
						},
						links: {
							developer: [{
								href: "/topic/bcc12cbe038146a2a586ac021a20f3a7",
								text:  function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_RATING_FACET");
								}
							}]
						},
						ignore: function() {
							var sType = this.getFacetType(oElement);
							return sType !== FACETTYPE_RATING_AGGREGATED;
						}.bind(this),
						refersTo: [{
							annotation: "dataPointRatingAggregated",
							referredBy: "Target"
						}]
					},
					referenceFacetRatingNonAggregated: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "ReferenceFacet",
						whiteList: {
							properties: ["Target", "ID"],
							mandatory: ["Target"]
						},
						links: {
							developer: [{
								href: "/topic/bcc12cbe038146a2a586ac021a20f3a7",
								text:  function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_RATING_FACET");
								}
							}]
						},
						ignore: function() {
							var sType = this.getFacetType(oElement);
							return sType !== FACETTYPE_RATING_NONAGGREGATED;
						}.bind(this),
						refersTo: [{
							annotation: "dataPointRatingNonAggregated",
							referredBy: "Target"
						}]
					},
					//Chart
					referenceFacetChartDimensions: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "ReferenceFacet",
						whiteList: {
							properties: ["Target", "ID"],
							mandatory: ["Target"]
						},
						ignore: function() {
							var sType = this.getFacetType(oElement);
							return sType !== FACETTYPE_CHART;
						}.bind(this),
						refersTo: [{
							annotation: "chartWithDimensions",
							referredBy: "Target"
						}],
						links: {
							developer: [ {
								href:"/topic/e219fd0c85b842c69ac3a514e712ece5",
								text: function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_CHART_FACET");
								}
							}]
						}
					},
					referenceFacetChartNoDimensions: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "ReferenceFacet",
						whiteList: {
							properties: ["Target", "ID"],
							mandatory: ["Target"]
						},
						ignore: function() {
							var sType = this.getFacetType(oElement);
							return sType !== FACETTYPE_CHART;
						}.bind(this),
						refersTo: [{
							annotation: "chartNoDimensions",
							referredBy: "Target"
						}],
						links: {
							developer: [ {
								href:"/topic/e219fd0c85b842c69ac3a514e712ece5",
								text: function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_CHART_FACET");
								}
							}]
						}
					},
					chartWithDimensions: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "Chart",
						ignore: function() {
							var sChartType = ChartType.getChartType(oElement);
							return sChartType === undefined || sChartType !== "Area";
						},
						target: ["EntityType"],
						whiteList: {
							properties: [
								"Title",
								"Description",
								"Dimensions",
								"vMeasures"  //virtual property
							],
							mandatory: [
								"Dimensions",
								"vMeasures"
							]
						},
						links: {
							developer: [{
								href: "/topic/e219fd0c85b842c69ac3a514e712ece5",
								text:  function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_CHART_FACET");
								}
							}]
						}
					},
					chartNoDimensions: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "Chart",
						ignore: function() {
							var sChartType = ChartType.getChartType(oElement);
							return sChartType === undefined || sChartType === "Area";
						},
						target: ["EntityType"],
						whiteList: {
							properties: [
								"Title",
								"Description",
								"vMeasures"  //virtual property
							],
							mandatory: [
								"vMeasures"
							]
						},
						links: {
							developer: [{
								href: "/topic/e219fd0c85b842c69ac3a514e712ece5",
								text:  function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_CHART_FACET");
								}
							}]
						}
					},
					referenceFacetProgress: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "ReferenceFacet",
						whiteList: {
							properties: ["Target", "ID"],
							mandatory: ["Target"]
						},
						links: {
							developer: [{
								href: "/topic/3b5e01c647f44ea98655b8c08feba780",
								text:  function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_PROGRESS_FACET");
								}
							}]
						},
						ignore: function() {
							var sType = this.getFacetType(oElement);
							return sType !== FACETTYPE_PROGRESS;
						}.bind(this),
						refersTo: [{
							annotation: "dataPointProgress",
							referredBy: "Target"
						}]
					},
					referenceFacetContact: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "ReferenceFacet",
						whiteList: {
							properties: ["Target", "ID"],
							mandatory: ["Target"]
						},
						links: {
							developer: [{
								href: "/topic/214dc25fb47f42c6a0091dfe71e87950",
								text:  function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_CONTACT_FACET");
								}
							}]
						},
						ignore: function() {
							var sType = this.getFacetType(oElement);
							return sType !== FACETTYPE_CONTACT;
						}.bind(this),
						refersTo: [{
							annotation: "contact",
							referredBy: "Target"
						}]
					},
					referenceFacetAddress: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "ReferenceFacet",
						whiteList: {
							properties: ["Target", "ID"],
							mandatory: ["Target"]
						},
						links: {
							developer: [{
								href: "/topic/0b73cbbeda344d88b5d0f8bea4d4498e",
								text:  function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_ADDRESS_FACET");
								}
							}]
						},
						ignore: function() {
							var sType = this.getFacetType(oElement);
							return sType !== FACETTYPE_ADDRESS;
						}.bind(this),
						refersTo: [{
							annotation: "address",
							referredBy: "Target"
						}]
					},
					dataPointRatingAggregated: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataPoint",
						target: ["EntityType"],
						links: {
							developer: [{
								href: "/topic/bcc12cbe038146a2a586ac021a20f3a7",
								text:  function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_RATING_FACET");
								}
							}]
						},
						ignore: function() {
							var sType = this.getFacetType(oElement);
							return sType !== FACETTYPE_RATING_AGGREGATED;
						}.bind(this),
						whiteList: {
							properties: ["Value", "Title", "TargetValue", "SampleSize"],
							mandatory: ["Value", "Title"]
						}
					},
					dataPointRatingNonAggregated: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataPoint",
						target: ["EntityType"],
						links: {
							developer: [{
								href: "/topic/a797173b84724ef1bc54d59dc575e52f",
								text:  function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_RATING_FACET");
								}
							}]
						},
						ignore: function() {
							var sType = this.getFacetType(oElement);
							return sType !== FACETTYPE_RATING_NONAGGREGATED;
						}.bind(this),
						whiteList: {
							properties: ["Value", "Title", "TargetValue", "Description"],
							mandatory: ["Value", "Title"]
						}
					},
					dataPointProgress: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataPoint",
						target: ["EntityType"],
						links: {
							developer: [{
								href: "/topic/3b5e01c647f44ea98655b8c08feba780",
								text:  function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_PROGRESS_FACET");
								}
							}]
						},
						ignore: function() {
							var sType = this.getFacetType(oElement);
							return sType !== FACETTYPE_PROGRESS;
						}.bind(this),
						whiteList: {
							properties: ["Value", "TargetValue"],
							mandatory: ["Value"],
							expressionTypes: {
								Value: ["Path"],
								TargetValue: ["Path", "String", "Int", "Decimal"]
							}
						}
					},
					dataPoint: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataPoint",
						target: ["EntityType"],
						links: {
							developer: [{
								href: "/topic/c312735b7417423ea239394b3b4f4018",
								text:  function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_KEYVALUE_FACET");
								}
							}]
						},
						ignore: function() {
							var sType = this.getFacetType(oElement);
							return (sType !== FACETTYPE_KEYVALUE);
						}.bind(this),
						whiteList: {
							properties: ["Value", "Title"],
							mandatory: ["Value", "Title"]
						}
					},
					contact: {
						namespace: "com.sap.vocabularies.Communication.v1",
						annotation: "Contact",
						target: ["EntityType"],
						links: {
							developer: [{
								href: "/topic/214dc25fb47f42c6a0091dfe71e87950",
								text:  function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_CONTACT_FACET");
								}
							}]
						},
						ignore: function() {
							var sType = this.getFacetType(oElement);
							return (sType !== FACETTYPE_CONTACT);
						}.bind(this),
						whiteList: {
							properties: [ "fn", "n", "tel", "email", "photo", "title", "org", "role"],
							expressionTypes: {
								fn: ["Path"],
								photo: ["Path"],
								title: ["Path"],
								org: ["Path"],
								role: ["Path"]
							}
						}
					},
					address: {
						namespace: "com.sap.vocabularies.Communication.v1",
						annotation: "Address",
						target: ["EntityType"],
						links: {
							developer: [{
								href: "/topic/0b73cbbeda344d88b5d0f8bea4d4498e",
								text:  function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_ADDRESS_FACET");
								}
							}]
						},
						ignore: function() {
							var sType = this.getFacetType(oElement);
							return (sType !== FACETTYPE_ADDRESS);
						}.bind(this),
						whiteList: {
							properties: ["label"],
							mandatory: ["label"]
						}
					}
				}
			};

			return deepExtend(oHeaderFacetData, oExtendedHeaderFacetData);
		};

		return HeaderFacetDesigntime;
});
