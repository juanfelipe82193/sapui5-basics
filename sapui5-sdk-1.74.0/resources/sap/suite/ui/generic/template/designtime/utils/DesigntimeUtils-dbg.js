sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/js/AnnotationHelper",
	"sap/base/util/deepExtend",
	"sap/base/util/isEmptyObject"
], function (AnnotationChangeUtils, ChangeHandlerUtils, AnnotationHelper, deepExtend, isEmptyObject) {
	"use strict";

	var DesigntimeUtils = {},

		DATAPOINT = "com.sap.vocabularies.UI.v1.DataPoint",
		CHART = "com.sap.vocabularies.UI.v1.Chart",
		DATAFIELDFORANNOTATION = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";

	/**
	 * Defines an object ignoring all properties of the given control
	 *
	 * @param {sap.ui.base.ManagedObject} oManagedObject - SAPUI5 control
	 * @returns {object} Object comprising all properties with ignore tag set to true
	 * @public
	 */
	DesigntimeUtils.ignoreAllProperties = function (oManagedObject) {

		var oAllProperties = oManagedObject.getMetadata().getAllProperties(),
			oProperties4Designtime = {};

		for (var sKey in oAllProperties) {
			oProperties4Designtime[sKey] = {
				ignore: true
			};
		}

		return oProperties4Designtime;
	};

	/**
	 * Defines the valid control properties for a button
	 *
	 * @param {sap.m.Button} oButton - Button
	 * @returns {object} Object comprising all black or white-listed properties
	 */
	DesigntimeUtils.getButtonProperties = function (oButton) {
		var oPropertiesBlackList = DesigntimeUtils.ignoreAllProperties(oButton);
		var oPropertiesWhiteList = {
			//Control Properties:
			visible: {
				ignore: false
			}
		};

		return deepExtend({}, oPropertiesBlackList, oPropertiesWhiteList);
	};

	/**
	 * Defines the valid control properties for sap.m.Table
	 *
	 * @param {sap.m.Table} oTable - Table
	 * @returns {object} Object comprising all black or white-listed properties
	 */
	DesigntimeUtils.getTableProperties = function (oTable) {
		var oPropertiesBlackList = DesigntimeUtils.ignoreAllProperties(oTable);
		var oPropertiesWhiteList = {
			//Control Properties:
			mode: {
				ignore: false
			},
			sticky: {
				ignore: false
			}
		};

		return deepExtend({}, oPropertiesBlackList, oPropertiesWhiteList);

		/*	tableType: {   //deactivated, as late feature
				virtual: true,
				ignore: false,
				type: "string",
				group: "header",
				defaultValue: "ResponsiveTable",
				proposedValue: "ResponsiveTable",
				possibleValues: {
					"AnalyticalTable": {
						displayName: "FE_ANALYTICAL_TABLE"
					},
					"GridTable": {
						displayName: "FE_GRID_TABLE"
					},
					"ResponsiveTable": {
						displayName: "FE_RESPONSIVE_TABLE"
					},
					"TreeTable": {
						displayName: "FE_TREE_TABLE"
					}
				},
				get: function(oElement) {
					var oComponent = Utils.getComponent(oElement);
					var sTableType;
					if (oComponent) {
						var oManifestSettings = Utils.getManifestSettings(oComponent);
						if (oManifestSettings.tableType) {
							sTableType = oManifestSettings.tableType;
						} else if (oManifestSettings.treeTable) {
							sTableType = "TreeTable";
						} else if (oManifestSettings.gridTable) {
							sTableType = "GridTable";
						} else if (Utils.getOdataEntityType(oComponent) && Utils.getOdataEntityType(oComponent)["sap:semantics"] === "aggregate") {
							sTableType = "AnalyticalTable";
						}
					}
					return sTableType;
				},
				set: function(oElement, sValue) {
					// via dt change, or on tool level
					/*var oComponent = Utils.getComponent(oElement);
					if (oComponent) {
						var oManifestSettings = ManifestHandler.getSettings(oComponent);
						oManifestSettings.tableType = sValue;
						ManifestHandler.setSettings(oComponent, oManifestSettings);
					}
				}
			} */
	};

	/**
	 * Looks for a DataPoint based on the given annotation path.
	 * If found, updates its values.
	 * If not found: creates a new one
	 *
	 * @param {string} sTarget EntityType of the ODataMetaModel as string
	 * @param {object} oEntityType EntityType of the ODataMetaModel as object
	 * @param {string} oNewMeasure The new record of virtual property vMeasures
	 * @param {object} aCustomChanges The array of annotation changes, to be extended by this method
	 * @public
	 */
	DesigntimeUtils.modifyDataPointForChart = function (sTarget, oEntityType, oNewMeasure, aCustomChanges) {

		var oCustomChange = {},
			oOldDataPoint,
			oNewDataPoint,
			sDataPoint,
			sQualifier;

		var sAnnotationPath = oNewMeasure.DataPointAnnotationPath && oNewMeasure.DataPointAnnotationPath.AnnotationPath;

		// Determine the right qualifier
		if (sAnnotationPath) {
			sQualifier = sAnnotationPath.split("#").reverse()[0];
		} else {
			if (oNewMeasure.Measure && oNewMeasure.Measure.PropertyPath && oNewMeasure.Measure.PropertyPath !== "") {
				// No DataPoint reference given, but the property path of the measure attributes' item ==> take it.
				// This is the variant which is compliant to CDS and works for the push-down as well.
				sQualifier = oNewMeasure.Measure.PropertyPath;
			} else {
				// Only create a new DataPoint with calculated qualifier if there had been any properties supplied
				if (!oNewMeasure.DataPoint || isEmptyObject(oNewMeasure.DataPoint)) {
					return;
				}
				// Take the first Chart+n qualifier that does not exist yet
				var iIndex = 0;
				for (var sKey in oEntityType) {
					if (sKey.indexOf(DATAPOINT) === 0) {
						var sQualifier = sKey.split("#")[1];
						if (sQualifier.indexOf("Chart") > -1) {
							var iExistingIndex = parseInt(sQualifier.split("Chart")[1], 10);
							if (isNaN(iExistingIndex)) {
								iExistingIndex = 0;
							}
							iIndex = Math.max(iExistingIndex, iIndex);
						}
					}
				}
				iIndex++;
				sQualifier = "Chart" + iIndex;
			}
		}
		sDataPoint = DATAPOINT + "#" + sQualifier;
		oOldDataPoint = oEntityType[sDataPoint];
		if (oOldDataPoint) {
			oNewDataPoint = deepExtend({}, oOldDataPoint, oNewMeasure.DataPoint);
		} else {
			oNewDataPoint = deepExtend(DesigntimeUtils.createNewDataPointForChart(), oNewMeasure.DataPoint);
		}
		if (!oNewDataPoint.Value && oNewMeasure.Measure && oNewMeasure.Measure.PropertyPath && oNewMeasure.Measure.PropertyPath !== "") {
			oNewDataPoint.Value = {
				Path: oNewMeasure.Measure.PropertyPath
			};
		}
		oNewMeasure.DataPoint = oNewDataPoint;

		oCustomChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sTarget, oNewDataPoint, oOldDataPoint, sDataPoint);
		aCustomChanges.push(oCustomChange);

		return sQualifier;
	};

	/**
	 * Creates the basic annotation data for a new Contact
	 *
	 * @returns {object} The new contact
	 * @public
	 */
	DesigntimeUtils.createNewContact = function () {

		return {
			"RecordType": "com.sap.vocabularies.Communication.v1.ContactType"
		};
	};

	/**
	 * Creates the basic annotation data for a new Address
	 *
	 * @returns {object} The new address
	 * @public
	 */
	DesigntimeUtils.createNewAddress = function () {

		return {
			"RecordType": "com.sap.vocabularies.Communication.v1.AddressType"
		};
	};

	/**
	 * Creates the basic annotation data for a new Chart
	 *
	 * @returns {object} The new data chart
	 * @public
	 */
	DesigntimeUtils.createNewChart = function () {

		var oNewChart = {
			"ChartType": {
				"EnumMember": "com.sap.vocabularies.UI.v1.ChartType/Area"
			},
			"Measures": [{
				"PropertyPath": ""
			}],
			"MeasureAttributes": [{
				"Measure": {
					"PropertyPath": ""
				},
				"Role": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType"
			}],
			"RecordType": "com.sap.vocabularies.UI.v1.ChartDefinitionType"
		};

		return oNewChart;
	};

	/**
	 * Creates the basic DataPoint annotation for a new Chart
	 * @returns {object} The new DataPoint
	 * @public
	 */
	DesigntimeUtils.createNewDataPointForChart = function () {
		return {
			"CriticalityCalculation": {
				"ImprovementDirection": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.CriticalityCalculationType"
			},
			"RecordType": "com.sap.vocabularies.UI.v1.DataPointType"
		};
	};

	/**
	 * Writes the adjusted values to the instance-specific metadata of the column
	 *
	 * @param {sap.m.Column} oColumn - The element of the old column
	 * @param {object} oNewColumnData - Data of the new column
	 * @private
	 */
	DesigntimeUtils._setP13nData = function (oColumn, oNewColumnData) {

		// get instance-specific metadata
		var oP13nData = oColumn.data("p13nData");
		if (oNewColumnData.RecordType === "com.sap.vocabularies.UI.v1.DataFieldWithUrl") {
			oP13nData.columnKey = oNewColumnData.Value && oNewColumnData.Value.Path;
		} else {
			oP13nData.columnKey = AnnotationHelper.createP13NColumnKey(oNewColumnData);
		}
		if (!oP13nData.columnKey) {
			oP13nData.columnKey = "";
		}
		if (oNewColumnData.Value && oNewColumnData.Value.Path) {
			oP13nData.leadingProperty = oNewColumnData.Value.Path;
		} else {
			oP13nData.leadingProperty = "";
		}
		// write back
		oColumn.data("p13nData", oP13nData);
	};

	/**
	 * Retrieves the Chart from the ODataMetaModel that corresponds to the given column
	 *
	 * @param {sap.m.Column} oColumn The current column
	 * @returns {object} An object comprising the chart identifier and the right ODataEntityType
	 * @public
	 */
	DesigntimeUtils.getChartFromColumn = function (oColumn) {
		var oRecord = ChangeHandlerUtils.getLineItemRecordForColumn(oColumn),
			oChart;
		if (oRecord && oRecord.RecordType === DATAFIELDFORANNOTATION && oRecord.Target &&
			oRecord.Target.AnnotationPath.indexOf("Chart") >= 0) {

			var sQualifier;
			if (oRecord.Target.AnnotationPath.indexOf("#") !== -1) {
				sQualifier = oRecord.Target.AnnotationPath.split("#").reverse()[0];
			}
			var sChart = sQualifier ? CHART + "#" + sQualifier : CHART,
				oDataEntityType = ChangeHandlerUtils.getEntityTypeFromAnnotationPath(oColumn, oRecord.Target.AnnotationPath);
			if (oDataEntityType) {
				oChart = {
					chartID: sChart,
					entityType: oDataEntityType
				};
			}
		}

		return oChart;
	};

	/**
	 * Retrieves the current value of the chart type property for a given element from
	 * various annotations.
	 *
	 * @param {sap.m.VBox} oElement The current chart header facet.
	 * @returns {string} The technical key of the chart type property, as comprised in the list of possible values
	 * @private
	 */
	DesigntimeUtils.getChartFromFacet = function (oElement) {
		var oTempInfo = ChangeHandlerUtils.getTemplatingInfo(oElement);
		var sTarget = oTempInfo && oTempInfo.value;
		if (sTarget) {
			var oEntityType = ChangeHandlerUtils.getEntityTypeFromAnnotationPath(oElement, sTarget);
			var iQualifierIndex = sTarget.search("#");
			var sQualifier = sTarget.substring(iQualifierIndex + 1);
			var sChart = sQualifier ? CHART + "#" + sQualifier : CHART;
			var oChart = {
				chartID: sChart,
				entityType: oEntityType
			};
			return oChart;
		}
	};

	/**
	 * Retrieves the current value of the chart type property for a given element from
	 * various annotations.
	 *
	 * @param {object} oElement The current chart element - column or header facet
	 * @returns {string} The technical key of the chart type property, as comprised in the list of possible values
	 * @private
	 */
	DesigntimeUtils.getChartFromParent = function (oElement) {
		var oChartFromParent;
		if (oElement && oElement.getMetadata) {
			if (oElement.getMetadata().getElementName() === "sap.m.Column") {
				oChartFromParent = DesigntimeUtils.getChartFromColumn(oElement);
			} else {
				oChartFromParent = DesigntimeUtils.getChartFromFacet(oElement);
			}
		}
		return oChartFromParent;
	};

	DesigntimeUtils.addSettingsHandler = function (oTargetButton, mPropertyBag, aActions, sChangeHandler) {
		return new Promise(function (resolve, reject) {
			var oMetaModel = sap.ui.fl.Utils.getAppComponentForControl(oTargetButton).getModel().getMetaModel();
			var oEntityContainer = oMetaModel.getODataEntityContainer();
			var aFunctionImport = oEntityContainer.functionImport;

			var oExcludeFilter = {};

			var oModel = new sap.ui.model.json.JSONModel(aFunctionImport);

			var oDialog = sap.ui.xmlfragment("sap.suite.ui.generic.template.changeHandler.customSelectDialog.SelectDialog", this);
			oDialog.attachConfirm(function (oEvent) {
				var aContexts = oEvent.getParameter("selectedContexts");
				var aFunctionImports = [],
					sFunctionImport;
				for (var i = 0; i < aContexts.length; i++) {
					sFunctionImport = oEntityContainer.namespace + "." + oEntityContainer.name + "/" + aContexts[i].getObject().name;
					aFunctionImports[i] = {
						selectorControl: oTargetButton,
						changeSpecificData: {
							changeType: sChangeHandler,
							content: {
								newFunctionImport: sFunctionImport
							}
						}
					};
				}
				resolve(aFunctionImports);
			});
			oDialog.attachSearch(function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oSearchFilter = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, sValue);
				var oFilter = new sap.ui.model.Filter({
					filters: [oSearchFilter, oExcludeFilter],
					and: true
				});
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter(oFilter);
			});

			oDialog.setModel(oModel);

			// exclude FunctionImports that are already represented on the UI
			var oBinding = oDialog.getBinding("items");
			var aExcludeFilters = [];
			for (var i in aActions) {
				var oCustomData = ChangeHandlerUtils.getCustomDataObject(aActions[i]);
				if (oCustomData && oCustomData.Action) {
					var sFunctionImportName = oCustomData.Action.substring(oCustomData.Action.lastIndexOf("/") + 1);
					aExcludeFilters.push(new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.NE, sFunctionImportName));
				}
			}
			oExcludeFilter = new sap.ui.model.Filter({
				filters: aExcludeFilters,
				and: true
			});
			oBinding.filter(oExcludeFilter);

			oDialog.addStyleClass(mPropertyBag.styleClass);
			oDialog.open();
		});
	};

	DesigntimeUtils.getFacetIndexFromID = function (sSectionId, aFacets) {
		var sId;

		for (var i = 0; i < aFacets.length; i++) {
			sId = aFacets[i].ID && aFacets[i].ID.String;
			if (sId === sSectionId) {
				return i;
			}

			sId = aFacets[i].Target && aFacets[i].Target.AnnotationPath;
			sId = sId && sId.replace(/@/g, "").replace(/\//g, "::").replace(/#/g, "::");
			if (sId === sSectionId) {
				return i;
			}
		}
	};

	/**
	 * Determines the "right" (i.e. the first non-existing) qualifier for a term.
	 * This means in detail: check if a valid target already exists, and if it is not used in a different record,
	 * auto-populate it into the target field; else create a new target
	 *
	 * @param {object} aAnnotations The array of annotation records
	 * @param {string} sTerm Annotation term name
	 * @param {string} sBasicQualifier Default qualifier like "Rating"
	 * @param {integer} iCurrentIndex Index of the record for which the qualifier has to be fixed.
	 * @returns {string} Full qualifier for the annotation term
	 */
	DesigntimeUtils.fixQualifierForAnnotationPath = function (aAnnotations, sTerm, sBasicQualifier, iCurrentIndex) {
		var sFullQualifier = sBasicQualifier,
			sFullTerm,
			iMaxIndex = -1,
			iIndex,
			sQualifierIndex,
			aPathParts,
			sOtherFullTerm,
			sAnnotationPath;

		if (aAnnotations && iCurrentIndex > -1) {
			for (var j = 0; j < aAnnotations.length; j++) {
				if (j === iCurrentIndex) {
					continue;
				}
				sQualifierIndex = -1;
				sAnnotationPath = aAnnotations[j].Target && aAnnotations[j].Target.AnnotationPath;
				if (sAnnotationPath && sAnnotationPath.indexOf(sTerm) !== -1) {
					aPathParts = sAnnotationPath.split("/");
					sOtherFullTerm = aPathParts[aPathParts.length - 1].substr(1);

					if (!sBasicQualifier && sOtherFullTerm.indexOf("#") === -1) {
						sQualifierIndex = 0;
					} else if (!sBasicQualifier && sOtherFullTerm.indexOf("#") > -1) {
						sQualifierIndex = sOtherFullTerm.split("#")[1];
					} else if (sOtherFullTerm.indexOf(sBasicQualifier) > -1) {
						sQualifierIndex = sOtherFullTerm.split(sBasicQualifier)[1];
					}
					iIndex = parseInt(sQualifierIndex, 10);
					if (isNaN(iIndex)) {
						iIndex = 0;
					}
					iMaxIndex = Math.max(iIndex, iMaxIndex);
				}
			}
		}
		if (iMaxIndex !== -1) {
			iMaxIndex++;
			sFullQualifier = sBasicQualifier ? sBasicQualifier + iMaxIndex.toString() : iMaxIndex.toString();
		}
		sFullTerm = sFullQualifier ? sTerm + "#" + sFullQualifier : sTerm;

		return sFullTerm;
	};

	/**
	 * Gets and formats the items to to shown in the custom pop up for amart Filter bar
	 *
	 * @param {object} oControl The control on which the add handler is attached
	 * @returns {array} formatted Array of items to be displayed in custom popup
	 */
	DesigntimeUtils.getItemsForSmartFilterCustomPopUp = function (oControl) {
		//create a map of binded property and id to set for custom add items
		var oIdMap = {};
		var sParentId = oControl.getParent().sId;
		oControl.getContent().map(function (oElement) {
			var aStrArr = oElement.getContent()[1].sId.split('-');
			oIdMap[aStrArr[aStrArr.length - 1]] = oElement.getContent()[1].sId.replace(sParentId + '-', '');
		});
		var customItems = ChangeHandlerUtils.getPropertiesForCustomPopUp(oControl, 'filter');
		var i = 0;
		var customItemsForPopup = customItems.map(function (item) {
			return {
				label: item["sap:label"] ? (item["sap:label"] + " (" + item["name"] + ")") : item["name"],
				tooltip: item["sap:quickinfo"] || item["sap:label"],
				id: oIdMap[item.name] ? oIdMap[item.name] : "customId" + i++,
				changeSpecificData: {
					changeOnRelevantContainer: true,
					changeType: "addFilterItem",
					content: item
				}
			};
		});
		return customItemsForPopup;
	};

	return DesigntimeUtils;
});
