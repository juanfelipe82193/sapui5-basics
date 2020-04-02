sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
	"sap/suite/ui/generic/template/designtime/virtualProperties/ColumnType",
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/designtime/virtualProperties/ChartMeasures",
	"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
	"sap/base/util/deepExtend",
	"sap/base/util/extend",
	"sap/base/util/isEmptyObject"
], function (AnnotationChangeUtils, ColumnType, ChangeHandlerUtils, ChartMeasures, DesigntimeUtils, deepExtend, extend, isEmptyObject) {
	"use strict";

	var ConnectedFieldData = {},

		ITEMTYPE_DATAFIELD = "DataField",
		ITEMTYPE_DATAFIELDFORACTION = "DataFieldForAction",
		ITEMTYPE_INTENTBASEDNAV = "DataFieldForIntentBasedNavigation",
		ITEMTYPE_NAVIGATION_PATH = "DataFieldWithNavigationPath",
		ITEMTYPE_CONTACT = "DataFieldForAnnotationContact",
		ITEMTYPE_CHART = "DataFieldForAnnotationChartWithDimensions",
		ITEMTYPE_RATING = "DataFieldForAnnotationRating",
		ITEMTYPE_PROGRESS = "DataFieldForAnnotationProgress",

		UI_DATAFIELD = "com.sap.vocabularies.UI.v1.DataField",
		UI_DATAPOINT = "com.sap.vocabularies.UI.v1.DataPoint",
		UI_CHART = "com.sap.vocabularies.UI.v1.Chart",
		UI_CONTACT = "com.sap.vocabularies.Communication.v1.Contact",
		UI_DATAFIELDWITHNAVPATH = "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath",
		UI_DATAFIELDFORANNOTATION = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
		UI_DATAFIELDFORACTION = "com.sap.vocabularies.UI.v1.DataFieldForAction",
		UI_FORINTENTBASEDNAV = "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
		CHARTTYPE_AREA = "com.sap.vocabularies.UI.v1.ChartType/Area",
		CHARTTYPE_DONUT = "com.sap.vocabularies.UI.v1.ChartType/Donut",
		CHARTTYPE_BULLET = "com.sap.vocabularies.UI.v1.ChartType/Bullet";

	/**
	 * Returns the field group information for a column of type ConnectedFields
	 * @param oColumn
	 * @returns {{data: *, fieldGroup: string, target: string}} Field group information
	 */
	ConnectedFieldData.getFieldGroupOfConnectedField = function (oColumn) {
		var oRecord = ChangeHandlerUtils.getLineItemRecordForColumn(oColumn),
			oFieldGroup;
		if (oRecord && oRecord.RecordType === UI_DATAFIELDFORANNOTATION && oRecord.Target &&
			oRecord.Target.AnnotationPath.indexOf("FieldGroup") >= 0) {
			var sFieldGroup = oRecord.Target.AnnotationPath,
				oDataEntityType = ChangeHandlerUtils.getEntityTypeFromAnnotationPath(oColumn, sFieldGroup);
			if (oDataEntityType) {
				sFieldGroup = sFieldGroup.substring(1);
				oFieldGroup = {
					target: oDataEntityType.namespace + "." + oDataEntityType.name,
					fieldGroup: sFieldGroup,
					data: oDataEntityType[sFieldGroup]
				};
			}
		}

		return oFieldGroup;
	};

	/**
	 * Determines the "right" (i.e. the first non-existing) qualifier for a term.
	 * This means in detail: check if a valid target already exists, and if it is not used in a different column,
	 * auto-populate it into the target field; else create a new target
	 *
	 * @param {sap.m.Column} oColumn The column element (in overlay mode)
	 * @param {string} sTerm Annotation term name
	 * @param {object} oChange the change content
	 * @param {string} sBasicQualifier Default qualifier like "Rating"
	 * @returns {string} Full qualifier for the annotation term
	 */
	ConnectedFieldData.fixQualifierForNewItem = function (oColumn, sTerm, oChange, sBasicQualifier) {

		var oEntitySet = ChangeHandlerUtils.getODataEntityType(oColumn),
			sFullTerm,
			sMaxFullTerm,
			iQualifierNumber,
			maxIndex,
			maxNum = -1;

		for (var sKey in oEntitySet) {
			if (sKey.indexOf("FieldGroup") !== -1) {
				var oFieldGroup = oEntitySet[sKey],
					aData = oFieldGroup.Data;

				maxIndex = aData.length + 1;
				sFullTerm = DesigntimeUtils.fixQualifierForAnnotationPath(aData, sTerm, sBasicQualifier, maxIndex);
				iQualifierNumber = isNaN(parseInt(sFullTerm.split("#")[1].substring(2), 10)) ? 0 : parseInt(sFullTerm.split("#")[1].substring(2), 10);

				if (iQualifierNumber > maxNum) {
					maxNum = iQualifierNumber;
					sMaxFullTerm = sFullTerm;
				}
			}
		}

		return sMaxFullTerm;
	};
	/**
	 * Creates the basic annotation data  for a new DataPoint at a column, for rating or progress indicator
	 *
	 * @param {sap.m.Column} oColumn The given table column
	 * @param {string} sQualifier The qualifier of the new datapoint
	 * @param {string} sTargetValue The target value for the DataPoint
	 * * @param {int} iIndex The index for the Data
	 * @returns {object} The new data point
	 * @public
	 */
	ConnectedFieldData.createNewDataPointForItem = function (oColumn, sQualifier, sTargetValue, iIndex) {
		var sVisualization = "com.sap.vocabularies.UI.v1.VisualizationType/" + sQualifier,
			// oRecord = ChangeHandlerUtils.getLineItemRecordForColumn(oColumn),
			aLineItems = ConnectedFieldData.getFieldGroupOfConnectedField(oColumn).data.Data;

		var oNewDataPoint = {
			TargetValue: {
				String: sTargetValue
			},
			Visualization: {
				EnumMember: sVisualization
			},
			RecordType: UI_DATAPOINT + "Type",
			Title: {
				String: sQualifier
			}
		};

		if (aLineItems[iIndex] && aLineItems[iIndex].Value && aLineItems[iIndex].Value.Path && (aLineItems[iIndex].RecordType === UI_DATAFIELD ||
			aLineItems[iIndex].RecordType === UI_FORINTENTBASEDNAV)) {
			oNewDataPoint.Value = {
				Path: aLineItems[iIndex].Value.Path
			};
		}

		return oNewDataPoint;
	};
	/**
	 * Retrieves the current value of the column type property for a given column from
	 * various annotations.
	 *
	 * @param {object} oElement The UI5 element (in overlay mode)
	 * @returns {string} The technical key of the column type property, as comprised in the list of possible values
	 * @public
	 */
	ConnectedFieldData.getItemType = function (oElement, index) {
		var oFieldGroup = ConnectedFieldData.getFieldGroupOfConnectedField(oElement),
			oItemOld = oFieldGroup.data,
			aData = [],
			sItem;

		if (oItemOld) {
			aData = JSON.parse(JSON.stringify(oItemOld.Data));
		}
		var sItemType = aData[index].RecordType;
		switch (sItemType) {
			case UI_DATAFIELD:
				sItem = ITEMTYPE_DATAFIELD;
				break;
			case UI_DATAFIELDFORACTION:
				sItem = ITEMTYPE_DATAFIELDFORACTION;
				break;
			case UI_FORINTENTBASEDNAV:
				sItem = ITEMTYPE_INTENTBASEDNAV;
				break;
			case UI_DATAFIELDWITHNAVPATH:
				sItem = ITEMTYPE_NAVIGATION_PATH;
				break;
			case UI_CONTACT:
				sItem = ITEMTYPE_CONTACT;
				break;
			case UI_DATAFIELDFORANNOTATION:
				var sAnnotationPath = aData[index].Target && aData[index].Target.AnnotationPath;
				if (sAnnotationPath) {
					if (sAnnotationPath.indexOf(UI_DATAPOINT) >= 0) {
						var oEntityType = ChangeHandlerUtils.getEntityTypeFromAnnotationPath(oElement, sAnnotationPath);
						var iQualifierIndex = sAnnotationPath.search("#");
						var sQualifier = sAnnotationPath.substring(iQualifierIndex);
						var sDataPoint = sQualifier ? UI_DATAPOINT + sQualifier : UI_DATAPOINT;
						var oDataPoint = oEntityType[sDataPoint];
						if (oDataPoint) {
							if (oDataPoint.Visualization.EnumMember === "com.sap.vocabularies.UI.v1.VisualizationType/Rating") {
								sItem = ITEMTYPE_RATING;
							}
							if (oDataPoint.Visualization.EnumMember === "com.sap.vocabularies.UI.v1.VisualizationType/Progress") {
								sItem = ITEMTYPE_PROGRESS;
							}
						}
					} else if (sAnnotationPath.indexOf(UI_CONTACT) >= 0) {
						sItem = ITEMTYPE_CONTACT;
					} else if (sAnnotationPath.indexOf(UI_CHART) >= 0) {
						sItem = ITEMTYPE_CHART;
					}
				}
				break;
			default:
				break;
		}
		return sItem;
	};
	/**
	 * Updates the value of the column type property for a given column by updating
	 * different annotations
	 *
	 * @param {sap.m.Column} oColumn The column element (in overlay mode)
	 * @param {string} sNewColumnType The new value for the columnType
	 * @returns{object} The change content, comprising old an new values of the columnType but also
	 *                  the implicitly changed annotations.
	 * @public
	 */
	ConnectedFieldData.setData = function (oColumn, aNewData, oChange) {
		var sIndex,
			iIndex,
			aCustomChanges = [],
			oFieldGroup = ConnectedFieldData.getFieldGroupOfConnectedField(oColumn),
			oItemOld = oFieldGroup.data;

		if (!oItemOld || isEmptyObject(oItemOld) || !oFieldGroup || !aNewData) {
			return aCustomChanges;
		}

		var oItemNew = deepExtend({}, oItemOld),
			sTarget = oFieldGroup.target;
		sIndex = oChange.metadataPath.replace('vData/children/', '');
		iIndex = parseInt(sIndex, 10);
		if (oChange.propertyContent.propertyValue === undefined && oChange.propertyContent.propertyName === "vData") {
			// check for addition
			var oDataField = {
				RecordType: UI_DATAFIELD
			};
			oItemNew.Data.push(oDataField);
		} else if (oChange.propertyContent.propertyValue === "-1") {
			// check for deletions
			oItemNew.Data.splice(iIndex, 1);
		} else {
			var
				sFullTerm;
			if (oChange.propertyContent.propertyName === "vItemType") {
				var
					sRecordType,
					sNewItemType = oChange.propertyContent.propertyValue,
					oCustomChange = {};
				var iIndex2 = oChange.metadataPath.match(/\d+/g).map(Number);

				var sOldItemType = ConnectedFieldData.getItemType(oColumn, iIndex2);

				if (sNewItemType === sOldItemType) {
					return;
				}
				sTarget = ChangeHandlerUtils.getEntityType(ChangeHandlerUtils.getComponent(oColumn));

				switch (sNewItemType) {
					case ITEMTYPE_DATAFIELD:
						sRecordType = UI_DATAFIELD;
						break;
					case ITEMTYPE_DATAFIELDFORACTION:
						sRecordType = UI_DATAFIELDFORACTION;
						break;
					case ITEMTYPE_INTENTBASEDNAV:
						sRecordType = UI_FORINTENTBASEDNAV;
						break;
					case ITEMTYPE_NAVIGATION_PATH:
						sRecordType = UI_DATAFIELDWITHNAVPATH;
						break;
					case ITEMTYPE_CHART:
						sFullTerm = ConnectedFieldData.fixQualifierForNewItem(oColumn, UI_CHART, oChange, "FE");
						var sQualifierIndex = sFullTerm.split("#")[1];
						var sDataPointQualifier = sQualifierIndex ? "#Chart" + sQualifierIndex : "#Chart";
						var oChart = DesigntimeUtils.createNewChart();
						oCustomChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sTarget, oChart, {}, sFullTerm);
						aCustomChanges.push(oCustomChange);
						var oDataPoint = DesigntimeUtils.createNewDataPointForChart();
						oCustomChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sTarget, oDataPoint, {}, UI_DATAPOINT + sDataPointQualifier);
						aCustomChanges.push(oCustomChange);
						sRecordType = UI_DATAFIELDFORANNOTATION;
						break;
					case ITEMTYPE_RATING:
						sFullTerm = ConnectedFieldData.fixQualifierForNewItem(oColumn, UI_DATAPOINT, oChange, "FE");
						oDataPoint = ColumnType.createNewDataPointForColumn(oColumn, "Rating", "4");
						oCustomChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sTarget, oDataPoint, {}, sFullTerm);
						aCustomChanges.push(oCustomChange);
						sRecordType = UI_DATAFIELDFORANNOTATION;
						break;
					case ITEMTYPE_PROGRESS:
						sFullTerm = ConnectedFieldData.fixQualifierForNewItem(oColumn, UI_DATAPOINT, oChange, "FE");
						oDataPoint = ConnectedFieldData.createNewDataPointForItem(oColumn, "Progress", "100", iIndex2);
						oCustomChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sTarget, oDataPoint, {}, sFullTerm);
						aCustomChanges.push(oCustomChange);
						sRecordType = UI_DATAFIELDFORANNOTATION;
						break;
					case ITEMTYPE_CONTACT:
						sFullTerm = ConnectedFieldData.fixQualifierForNewItem(oColumn, UI_CONTACT, oChange, "FE");
						var oContact = DesigntimeUtils.createNewContact();
						oCustomChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sTarget, oContact, {}, sFullTerm);
						aCustomChanges.push(oCustomChange);
						sRecordType = UI_DATAFIELDFORANNOTATION;
						break;
					default:
						break;
				}

				if (!sRecordType) {
					return;
				}
				var oOldLineItemRecord = oItemOld.Data[iIndex2];
				var oNewItemData = ColumnType.createNewColumn(sRecordType, oOldLineItemRecord);
				switch (sNewItemType) {
					case ITEMTYPE_PROGRESS:
						oNewItemData.Target = {
							AnnotationPath: "@" + sFullTerm
						};
						oNewItemData.Criticality = {
							Path: ""
						};
						break;
					case ITEMTYPE_RATING:
					case ITEMTYPE_CHART:
						oNewItemData.Target = {
							AnnotationPath: "@" + sFullTerm
						};
						break;
					case ITEMTYPE_CONTACT:
						oNewItemData.Target = {
							AnnotationPath: "@" + sFullTerm
						};
						if (!oNewItemData.Label) {
							oNewItemData.Label = {
								"String": "New Contact"
							};
						}
						break;
					default:
						break;
				}

				oItemNew.Data.splice(iIndex2, 1, oNewItemData);
				oChange.noRefreshOnChange = true;
				oChange.refreshPropertiesPane = true;
				oCustomChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sTarget, oItemNew, oItemOld, oFieldGroup.fieldGroup);
				aCustomChanges.push(oCustomChange);

				return aCustomChanges;
			}
			if (oChange.propertyContent.propertyName === "vChartType") {
				oChange.noRefreshOnChange = true;
				oChange.refreshPropertiesPane = true;
				var aData = [],
					oChartNew = {},
					sChartID,
					sNewChartType = oChange.newValue,
					oItemFromModel = oFieldGroup.data;
				if (oItemFromModel) {
					aData = JSON.parse(JSON.stringify(oItemFromModel.Data));
				}
				var sAnnotationPath = aData[iIndex].Target && aData[iIndex].Target.AnnotationPath;
				var oChart;
				var oReferredEntityType = ChangeHandlerUtils.getEntityTypeFromAnnotationPath(oColumn, sAnnotationPath);
				sTarget = oReferredEntityType.namespace ? oReferredEntityType.namespace + "." + oReferredEntityType.name : oReferredEntityType.name;
				if (sAnnotationPath.search("/") >= 0) {
					var iQualifierIndex = sAnnotationPath.search("/");
					var sQualifier = sAnnotationPath.substring(iQualifierIndex);
					sChartID = sQualifier.substr(2);
					oChart = oReferredEntityType[sChartID];
				} else {
					oChart = oReferredEntityType[sAnnotationPath.substr(1)];
				}
				oChartNew.Description = oChart.Description;
				oChartNew.Measures = oChart.Measures;
				oChartNew.MeasureAttributes = oChart.MeasureAttributes;

				switch (sNewChartType) {
					case "Area":
						oChartNew.ChartType = {
							EnumMember: "com.sap.vocabularies.UI.v1.ChartType/Area"
						};
						oChartNew.Dimensions = oChart && oChart.Dimensions;
						break;
					case "Bullet":
						oChartNew.ChartType = {
							EnumMember: "com.sap.vocabularies.UI.v1.ChartType/Bullet"
						};
						break;
					case "Donut":
						oChartNew.ChartType = {
							EnumMember: "com.sap.vocabularies.UI.v1.ChartType/Donut"
						};
						break;
					default:
						return aCustomChanges;
				}

				// Prepare annotation term change
				oCustomChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sTarget, oChartNew, oChart, sChartID);
				aCustomChanges.push(oCustomChange);
				return aCustomChanges;
			}
			if (oChange.propertyContent.rootProperty && oChange.propertyContent.rootProperty === "vData") {
				var aPathParts = this._getMetadataPathParts(oChange),
					iIndex = aPathParts[0],
					sTermName = aPathParts[1],
					oNewElement = {},
					aNewDataCopy = aNewData.slice();

				for (var i = 0; i < aPathParts.length; i++) {
					var sPart = aPathParts[i];
					aNewDataCopy = aNewDataCopy[sPart];
					oNewElement = aNewDataCopy;
				}
				if (sTermName === "DataPointRating" || sTermName === "DataPointProgress") {
					var sAnnotationPath = oItemOld.Data[iIndex].Target && oItemOld.Data[iIndex].Target.AnnotationPath;

					var oEntityType = ChangeHandlerUtils.getEntityTypeFromAnnotationPath(oColumn, sAnnotationPath);
					var iQualifierIndex = sAnnotationPath.search("#");
					var sQualifier = sAnnotationPath.substring(iQualifierIndex);
					var sDataPoint = sQualifier ? UI_DATAPOINT + sQualifier : UI_DATAPOINT;
					var oOldElement = oEntityType[sDataPoint];

					var oCustomChange = AnnotationChangeUtils.createCustomAnnotationTermChange(
						sTarget,
						oNewElement,
						oOldElement,
						sDataPoint
					);
					aCustomChanges.push(oCustomChange);

					return aCustomChanges;
				} else {
					if (oChange.propertyContent.propertyName === "Target") {
						var oContent = oChange.propertyContent,
							NEW = "(New)";

						if (oContent.propertyType !== "AnnotationPath" //only treat annotation paths
							|| (oContent.valueTargetElement !== null && oContent.valueTargetElement.indexOf(NEW) === -1)
							|| !oContent.refersTo) { //and only if refersTo is defined so that we now what to generate
							oItemNew = deepExtend({}, oItemOld);
							oItemNew.Data[iIndex] = oNewElement;
							oChange.refreshPropertiesPane = true;
						} else {
							var oControl = sap.ui.getCore().byId(oChange.stableId);

							// Determine the target annotation and its new qualifier
							var sAnnotationPath = oContent.propertyValue.replace(NEW, " "),
								oReferredTermEntityType = ChangeHandlerUtils.getEntityTypeFromAnnotationPath(oControl, sAnnotationPath);

							if (!oReferredTermEntityType) {
								oContent.propertyValue = oContent.propertyValue.replace(NEW, "");

								return;
							}
							var sReferredEntityType = oReferredTermEntityType.namespace + '.' + oReferredTermEntityType.name,
								sNewItemType = oChange.metadataPath;

							if (sNewItemType.search("DataFieldForAnnotationRating") >= 1 || sNewItemType.search("DataFieldForAnnotationProgress") >= 1) {
								sFullTerm = ConnectedFieldData.fixQualifierForNewItem(oColumn, UI_DATAPOINT, oChange, "FE");
							} else if (sNewItemType.search("DataFieldForAnnotationChart") >= 1) {
								sFullTerm = ConnectedFieldData.fixQualifierForNewItem(oColumn, UI_CHART, oChange, "FE");
							} else {
								sFullTerm = ConnectedFieldData.fixQualifierForNewItem(oColumn, UI_CONTACT, oChange, "FE");
							}

							// Fetch the old content for the new annotation
							var sModifiedAnnotationPath,
								oAnnotationCopy,
								oOldProperty = oFieldGroup.data.Data[iIndex],
								sOldAnnotationPath = oOldProperty && oOldProperty.Target.AnnotationPath;

							if (sOldAnnotationPath.search("/") > 0){
								sModifiedAnnotationPath = sOldAnnotationPath.substr(sOldAnnotationPath.search("/") + 2);
							} else {
								sModifiedAnnotationPath = sOldAnnotationPath.substr(1);
							}
							oAnnotationCopy = deepExtend({}, oReferredTermEntityType[sModifiedAnnotationPath]);

							// Create change content for new annotation
							var oCustomChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sReferredEntityType, oAnnotationCopy, {}, sFullTerm);

							// Enhance the original property content by the new target
							oContent.valueTargetElement = sFullTerm;
							oContent.propertyValue = oContent.propertyValue.replace(NEW, "@" + sFullTerm);
							oChange.refreshPropertiesPane = true;
							if (oCustomChange) {
								aCustomChanges.push(oCustomChange);
								oChange.delayRefresh = false; // refresh immediately, as we need the new instance specific metadata
							}

							oItemNew = deepExtend({}, oItemOld);
							oItemNew.Data[iIndex] = oNewElement;
							oNewElement.Target.AnnotationPath = oContent.propertyValue;
						}

					} else {
						oItemNew = deepExtend({}, oItemOld);
						oItemNew.Data[iIndex] = oNewElement;
					}

				}
			}
		}

		var oCustomChange = AnnotationChangeUtils.createCustomAnnotationTermChange(
			sTarget,
			oItemNew,
			oItemOld,
			oFieldGroup.fieldGroup
		);
		aCustomChanges.push(oCustomChange);

		return aCustomChanges;
	};

	ConnectedFieldData._getMetadataPathParts = function (oChange) {
		var aParts = [];
		var aPathParts = oChange.metadataPath.split("/");

		if (aPathParts) {
			for (var i = 0; i < aPathParts.length; i++) {
				var sPart = aPathParts[i];

				if (sPart === "vData" || sPart === "children" || sPart === oChange.propertyContent.propertyName) {
					continue;
				} else {
					aParts.push(sPart);
				}
			}
		}

		return aParts;
	};
	/**
	 * Retrieves the current value of the column type property for a given column from
	 * various annotations.
	 *
	 * @param {object} oElement The UI5 element (in overlay mode)
	 * @returns {string} The technical key of the column type property, as comprised in the list of possible values
	 * @public
	 */
	ConnectedFieldData.getData = function (oElement) {
		var aData = [],
			aItem = [],
			oVData = {},
			oFieldGroup = ConnectedFieldData.getFieldGroupOfConnectedField(oElement);

		if (!oFieldGroup) {
			return aItem;
		}

		var oItemFromModel = oFieldGroup.data;
		if (oItemFromModel) {
			aData = JSON.parse(JSON.stringify(oItemFromModel.Data));
		}
		for (var i = 0; i < aData.length; i++) {
			var sRecordType = aData[i].RecordType;
			switch (sRecordType) {
				case UI_DATAFIELD:
					oVData = {
						vItemType: {
							EnumMember: ITEMTYPE_DATAFIELD
						},
						DataField: aData[i]
					};
					break;
				case UI_DATAFIELDFORACTION:
					oVData = {
						vItemType: {
							EnumMember: ITEMTYPE_DATAFIELDFORACTION
						},
						DataFieldForAction: aData[i]
					};
					break;
				case UI_FORINTENTBASEDNAV:
					oVData = {
						vItemType: {
							EnumMember: ITEMTYPE_INTENTBASEDNAV
						},
						DataFieldForIntentBasedNavigation: aData[i]
					};
					break;
				case UI_DATAFIELDWITHNAVPATH:
					oVData = {
						vItemType: {
							EnumMember: ITEMTYPE_NAVIGATION_PATH
						},
						DataFieldWithNavigationPath: aData[i]
					};
					break;
				case UI_DATAFIELDFORANNOTATION:
					oVData = {};
					var sAnnotationPath = aData[i].Target && aData[i].Target.AnnotationPath;
					if (sAnnotationPath) {
						if (sAnnotationPath.indexOf(UI_DATAPOINT) >= 0) {
							var oEntityType = ChangeHandlerUtils.getEntityTypeFromAnnotationPath(oElement, sAnnotationPath);
							var iQualifierIndex = sAnnotationPath.search("#");
							var sQualifier = sAnnotationPath.substring(iQualifierIndex);
							var sDataPoint = sQualifier ? UI_DATAPOINT + sQualifier : UI_DATAPOINT;
							var oDataPoint = extend({}, oEntityType[sDataPoint]);
							if (oDataPoint) {
								if (oDataPoint.Visualization.EnumMember === "com.sap.vocabularies.UI.v1.VisualizationType/Rating") {
									oVData.vItemType = {
										EnumMember: ITEMTYPE_RATING
									};
									oVData.DataFieldForAnnotationRating = aData[i];
									oVData.DataPointRating = oDataPoint;
								}
								if (oDataPoint.Visualization.EnumMember === "com.sap.vocabularies.UI.v1.VisualizationType/Progress") {
									oVData.vItemType = {
										EnumMember: ITEMTYPE_PROGRESS
									};
									oVData.DataFieldForAnnotationProgress = aData[i];
									oVData.DataPointProgress = oDataPoint;
								}
							}
						} else if (sAnnotationPath.indexOf(UI_CONTACT) >= 0) {
							var oReferredEntityType = ChangeHandlerUtils.getEntityTypeFromAnnotationPath(oElement, sAnnotationPath);
							// var iQualifierIndex = sAnnotationPath.search("/");
							// var sQualifier = sAnnotationPath.substring(iQualifierIndex);
							var oContact = oReferredEntityType[sAnnotationPath.substr(1)];
							oVData.vItemType = {
								EnumMember: ITEMTYPE_CONTACT
							};
							oVData.DataFieldForAnnotationContact = aData[i];
							oVData.Contact = oContact;
						} else if (sAnnotationPath.indexOf(UI_CHART) >= 0) {
							var aMeasure = ChartMeasures.getMeasures(oElement, i);
							var sChartType;
							var oChart;
							var oReferredEntityType = ChangeHandlerUtils.getEntityTypeFromAnnotationPath(oElement, sAnnotationPath);
							if (sAnnotationPath.search("/") >= 0) {
								var iQualifierIndex = sAnnotationPath.search("/");
								var sQualifier = sAnnotationPath.substring(iQualifierIndex);
								oChart = oReferredEntityType[sQualifier.substr(2)];
							} else {
								oChart = oReferredEntityType[sAnnotationPath.substr(1)];
							}

							if (oChart.ChartType.EnumMember === CHARTTYPE_AREA) {
								sChartType = "Area";
							} else if (oChart.ChartType.EnumMember === CHARTTYPE_DONUT) {
								sChartType = "Donut";
							} else if (oChart.ChartType.EnumMember === CHARTTYPE_BULLET) {
								sChartType = "Bullet";
							}

							oVData.vItemType = {
								EnumMember: ITEMTYPE_CHART
							};
							oVData.vChartType = {
								EnumMember: sChartType
							};
							if (oChart.Dimensions) {
								oVData.DataFieldForAnnotationChartWithDimensions = aData[i];
								oVData.ChartWithDimensions = oChart;
								oVData.vDimensions = {
									value: oChart.Dimensions
								};
							} else {
								oVData.DataFieldForAnnotationChartNoDimensions = aData[i];
								oVData.ChartNoDimensions = oChart;
							}

							oVData.vMeasures = {
								value: aMeasure
							};
						}
					}
					break;
				default:
					break;
			}
			aItem.push(oVData);
		}
		return aItem;

	};

	/**
	 * Retrieves a list of possible values of the column type property, e.g. for filling a drop-down in the UI.
	 * @param {sap.m.Column} oColumn The column element (in overlay mode)
	 *
	 * @returns {object} An object comprising the values (as a technical key) and their labels (displayName)
	 * @public
	 */
	ConnectedFieldData.getPossibleValues = function (oElement) {
		var oVdata = {
			vItemType: {
				displayName: "Field Type",
				virtual: true,
				type: "EnumType",
				whiteList: {
					properties: ["vItemType"]
				},
				possibleValues: {
					DataField: {
						displayName: "Data Field"
					},
					DataFieldForAction: {
						displayName: "DataField For Action"
					},
					DataFieldForIntentBasedNavigation: {
						displayName: "Data Field For Intent Based Navigation"
					},
					DataFieldWithNavigationPath: {
						displayName: "Data Field With Navigation Path"
					},
					DataFieldForAnnotationContact: {
						displayName: "Contact"
					},
					DataFieldForAnnotationRating: {
						displayName: "Rating Indicator"
					},
					DataFieldForAnnotationProgress: {
						displayName: "Progress Indicator"
					},
					DataFieldForAnnotationChartWithDimensions: {
						displayName: "Chart"
					}
				}
			},
			vChartType: {
				displayName: "Chart Type",
				virtual: true,
				type: "EnumType",
				whiteList: {
					properties: ["vChartType"]
				},
				possibleValues: {
					Area: {
						displayName: "Smart Area Micro Chart"
					},
					Bullet: {
						displayName: "Smart Bullet Micro Chart"
					},
					Donut: {
						displayName: "Smart Radial Micro Chart"
					}
				}
			},
			DataField: {
				displayName: "Data Field",
				namespace: "com.sap.vocabularies.UI.v1",
				annotation: "DataField",
				type: "ComplexType",
				whiteList: {
					properties: [
						"vItemType",
						"Value",
						"Label",
						"Criticality",
						"CriticalityRepresentation"
					],
					mandatory: ["vItemType", "Value"],
					expressionTypes: {
						Value: ["Path"],
						Criticality: ["Path"]
					}
				}
			},
			DataFieldForAction: {
				displayName: "Data Field For Action",
				namespace: "com.sap.vocabularies.UI.v1",
				annotation: "DataFieldForAction",
				type: "ComplexType",
				whiteList: {
					properties: [
						"vItemType",
						"Action",
						"Label",
						"Criticality",
						"InvocationGrouping"
					],
					mandatory: ["vItemType", "Action"],
					expressionTypes: {
						Criticality: ["Path"]
					}
				}
			},
			DataFieldForIntentBasedNavigation: {
				displayName: "Data Field For Intent Based Navigation",
				namespace: "com.sap.vocabularies.UI.v1",
				annotation: "DataFieldForIntentBasedNavigation",
				type: "ComplexType",
				whiteList: {
					properties: ["vItemType", "SemanticObject", "Action", "RequiresContext", "Label"],
					mandatory: ["vItemType", "SemanticObject", "RequiresContext"]
				}

			},

			DataFieldWithNavigationPath: {
				displayName: "Data Field With Navigation Path",
				namespace: "com.sap.vocabularies.UI.v1",
				annotation: "DataFieldWithNavigationPath",
				type: "ComplexType",
				whiteList: {
					properties: ["vItemType", "Target", "Value", "Label"],
					mandatory: ["vItemType", "Target", "Value"]
				}
			},
			DataFieldForAnnotationContact: {
				displayName: "Data Field For Annotation",
				namespace: "com.sap.vocabularies.UI.v1",
				annotation: "DataFieldForAnnotation",
				type: "ComplexType",
				whiteList: {
					properties: ["vItemType", "Target", "Label"],
					mandatory: ["Target"]
				},
				refersTo: [{
					annotation: "Contact",
					referredBy: "Target"
				}]
			},
			Contact: {
				namespace: "com.sap.vocabularies.Communication.v1",
				annotation: "Contact",
				type: "ComplexType",
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
				appliesTo: ["vItemType"]
			},
			DataFieldForAnnotationRating: {
				displayName: "Data Field For Annotation",
				namespace: "com.sap.vocabularies.UI.v1",
				annotation: "DataFieldForAnnotation",
				type: "ComplexType",
				whiteList: {
					properties: ["vItemType", "Target", "Label"],
					mandatory: ["Target"]
				},
				refersTo: {
					annotation: "DataPoint",
					namespace: "com.sap.vocabularies.UI.v1"
				}
			},
			DataPointRating: {
				displayName: "Data Point",
				namespace: "com.sap.vocabularies.UI.v1",
				annotation: "DataPoint",
				type: "ComplexType",
				whiteList: {
					properties: ["Value", "TargetValue"],
					mandatory: ["Value"],
					expressionTypes: {
						Value: ["Path"],
						TargetValue: ["Path", "String", "Int", "Decimal"]
					}
				}
			},
			DataFieldForAnnotationProgress: {
				displayName: "Data Field For Annotation",
				namespace: "com.sap.vocabularies.UI.v1",
				annotation: "DataFieldForAnnotation",
				type: "ComplexType",
				whiteList: {
					properties: ["vItemType", "Target", "Label", "Criticality", "DataPointProgress"],
					mandatory: ["Target"]
				},
				refersTo: {
					annotation: "DataPoint",
					namespace: "com.sap.vocabularies.UI.v1"
				}
			},
			DataPointProgress: {
				displayName: "Data Point",
				namespace: "com.sap.vocabularies.UI.v1",
				annotation: "DataPoint",
				target: ["EntityType"],
				type: "ComplexType",
				whiteList: {
					properties: ["Value", "TargetValue"],
					mandatory: ["Value"],
					expressionTypes: {
						Value: ["Path"],
						TargetValue: ["Path", "String", "Int", "Decimal"]
					}
				}
			},
			DataFieldForAnnotationChartWithDimensions: {
				displayName: "Data Field For Annotation",
				namespace: "com.sap.vocabularies.UI.v1",
				annotation: "DataFieldForAnnotation",
				type: "ComplexType",
				whiteList: {
					properties: ["vItemType", "Target", "Label", "ChartWithDimensions"],
					mandatory: ["Target"]
				},
				refersTo: {
					annotation: "DataPoint",
					namespace: "com.sap.vocabularies.UI.v1"
				}
			},
			ChartWithDimensions: {
				displayName: "Chart",
				namespace: "com.sap.vocabularies.UI.v1",
				annotation: "Chart",
				type: "ComplexType",
				whiteList: {
					properties: [
						"Description",
						"vDimensions",
						"vMeasures" //virtual property
					],
					mandatory: ["vMeasures"]
				}
			},
			DataFieldForAnnotationChartNoDimensions: {
				displayName: "Data Field For Annotation",
				namespace: "com.sap.vocabularies.UI.v1",
				annotation: "DataFieldForAnnotation",
				type: "ComplexType",
				whiteList: {
					properties: ["vItemType", "Target", "Label", "ChartNoDimensions"],
					mandatory: ["Target"]
				},
				refersTo: {
					annotation: "DataPoint",
					namespace: "com.sap.vocabularies.UI.v1"
				}
			},
			ChartNoDimensions: {
				displayName: "Chart",
				namespace: "com.sap.vocabularies.UI.v1",
				annotation: "Chart",
				target: ["EntityType"],
				type: "ComplexType",
				whiteList: {
					properties: [
						"Description",
						"vMeasures" //virtual property
					],
					mandatory: ["vMeasures"]
				}
			},
			vDimensions: {
				displayName: "Dimensions",
				virtual: true,
				type: "Collection",
				nullable: false,
				visible: false,
				multiple: true,
				possibleValues: {},
				whiteList: {
					properties: [
						"Dimensions"
					]

				}
			},
			vMeasures: {
				displayName: "Measures and Attributes",
				virtual: true,
				type: "Collection",
				nullable: false,
				visible: false,
				multiple: true,
				possibleValues: {
					Measure: {
						displayName: "Measure",
						type: "Edm.PropertyPath",
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "Chart",
						nullable: false
					},
					Role: {
						displayName: "Role",
						type: "EnumType",
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "Chart",
						possibleValues: {
							Axis1: {
								displayName: "Axis 1"
							},
							Axis2: {
								displayName: "Axis 2"
							},
							Axis3: {
								displayName: "Axis 3"
							}
						}
					},
					DataPointAnnotationPath: {
						displayName: "Data Point Reference",
						type: "Edm.AnnotationPath",
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "Chart",
						nullable: false
					},
					DataPoint: {
						displayName: "Data Point Properties",
						type: "ComplexType",
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataPoint",
						whiteList: {
							properties: [
								"Value",
								"TargetValue",
								"ForecastValue",
								"MinimumValue",
								"MaximumValue",
								"Criticality",
								"CriticalityCalculation"
							],
							mandatory: ["Value"],
							expressionTypes: {
								Value: ["Path"],
								TargetValue: ["Path", "String", "Int", "Decimal"],
								ForecastValue: ["Path", "String", "Int", "Decimal"],
								Criticality: ["Path"]
							},
							CriticalityCalculation: {
								properties: [
									"ImprovementDirection",
									"DeviationRangeLowValue",
									"DeviationRangeHighValue",
									"ToleranceRangeLowValue",
									"ToleranceRangeHighValue"
								]
							}
						}
					},
					DataPointDonut: {
						displayName: "Data Point Properties",
						type: "ComplexType",
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataPoint",
						whiteList: {
							properties: ["Value", "TargetValue", "Criticality", "CriticalityCalculation"],
							mandatory: ["Value"],
							expressionTypes: {
								Value: ["Path"],
								TargetValue: ["Path", "String", "Int", "Decimal"],
								Criticality: ["Path"]
							},
							CriticalityCalculation: {
								properties: [
									"ImprovementDirection",
									"DeviationRangeLowValue",
									"DeviationRangeHighValue",
									"ToleranceRangeLowValue",
									"ToleranceRangeHighValue"
								]
							}
						}
					},
					DataPointArea: {
						displayName: "Data Point Properties",
						type: "ComplexType",
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataPoint",
						whiteList: {
							properties: [
								"Value",
								"TargetValue",
								"CriticalityCalculation"
							],
							mandatory: ["Value", "TargetValue"],
							expressionTypes: {
								Value: ["Path"],
								TargetValue: ["Path", "String", "Int", "Decimal"]
							},
							CriticalityCalculation: {
								properties: [
									"ImprovementDirection",
									"DeviationRangeLowValue",
									"DeviationRangeHighValue",
									"ToleranceRangeLowValue",
									"ToleranceRangeHighValue"
								]
							}
						}
					}
				},
				whiteList: {
					properties: [
						"DataPoint", "DataPointAnnnotationPath", "Measure", "Role"
					],
					mandatory: ["Measure"]

				}
			}

		};
		return oVdata;
	};

	return ConnectedFieldData;
});
