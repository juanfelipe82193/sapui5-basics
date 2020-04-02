sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
	"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/base/util/deepExtend",
	"sap/base/util/isEmptyObject"
], function(AnnotationChangeUtils, DesigntimeUtils, ChangeHandlerUtils, deepExtend, isEmptyObject) {
	"use strict";

	var ChartMeasures = {},
	bPostponedRetemplating = false,
	MEASURE_ROLE_TYPE = "com.sap.vocabularies.UI.v1.ChartMeasureRoleType",
	DATAPOINT = "com.sap.vocabularies.UI.v1.DataPoint",
	CHARTTYPE_AREA = "com.sap.vocabularies.UI.v1.ChartType/Area",
	CHARTTYPE_DONUT = "com.sap.vocabularies.UI.v1.ChartType/Donut",
	CHARTTYPE_BULLET = "com.sap.vocabularies.UI.v1.ChartType/Bullet";

	/**
	 * Setter for bPostponedRetemplating. Used for testing.
	 *
	 * @param {boolean} bValue The value to set bPostponedRetemplating to
	 * @private
	 */
	ChartMeasures._setPostponedRetemplating = function(bValue) {
		bPostponedRetemplating = bValue;
	};

	/**
	 * Getter for bPostponedRetemplating. Used for testing.
	 *
	 * @return {boolean} The value of bPostponedRetemplating
	 * @private
	 */
	ChartMeasures._getPostponedRetemplating = function() {
		return bPostponedRetemplating;
	};

	/**
	 * Retrieves the type definition of a record of the virtual collection vMeasures for a given chart.
	 * The complex types combines the information from the Measures and MeasureAttributes collections of a
	 * UI.Chart annotation
	 *
	 * @param {object} oElement The chart element (in overlay mode)
	 * @returns {object} An object comprising the definitions, including type and label
	 * @private
	 */
	ChartMeasures.getMeasureDefinition = function(oElement) {
		var oMeasure = {
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
				refersTo: {
					annotation: "DataPoint",
					namespace: "com.sap.vocabularies.UI.v1"
				}
			}
		};
		var oCriticalityCalculation = {
			properties: [
				"ImprovementDirection",
				"DeviationRangeLowValue",
				"DeviationRangeHighValue",
				"ToleranceRangeLowValue",
				"ToleranceRangeHighValue"
			],
			expressionTypes: {
				"DeviationRangeLowValue": ["Path"],
				"DeviationRangeHighValue": ["Path"],
				"ToleranceRangeLowValue": ["Path"],
				"ToleranceRangeHighValue": ["Path"]
			}
		};

		var oChartFromParent = DesigntimeUtils.getChartFromParent(oElement),
			oChart = oChartFromParent && oChartFromParent.entityType[oChartFromParent.chartID];
		if (!oChartFromParent || !oChart || !oChart.ChartType) {
			return oMeasure;
		}

		switch (oChart.ChartType.EnumMember) {
			case CHARTTYPE_AREA:
				oMeasure.Role.nullable = false;

				oMeasure.DataPoint = {
					displayName: "Data Point Properties",
					type: "ComplexType",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "DataPoint",
					whiteList: {
						properties: [
							"Value",
							"TargetValue",
							"CriticalityCalculation"],
						mandatory: ["Value", "TargetValue"],
						expressionTypes: {
							Value: ["Path"],
							TargetValue: ["Path", "String", "Int", "Decimal"]
						},
						CriticalityCalculation: oCriticalityCalculation
					}
				};
				break;
			case CHARTTYPE_BULLET:
				oMeasure.Role.nullable = true;

				oMeasure.DataPoint = {
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
							Value: [ "Path" ],
							TargetValue: ["Path", "String", "Int", "Decimal"],
							ForecastValue: ["Path", "String", "Int", "Decimal"],
							Criticality: ["Path"]
						},
						CriticalityCalculation: oCriticalityCalculation
					}
				};
				break;
			case CHARTTYPE_DONUT:
				oMeasure.Role.nullable = true;

				oMeasure.DataPoint = {
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
						CriticalityCalculation: oCriticalityCalculation
					}
				};
				break;
			default:
				break;
		}
		return oMeasure;
	};

	/**
	 * Retrieves the current value of the chart type property for a given element from
	 * Connected field
	 *
	 * @param {sap.m.VBox} oElement The current chart header facet.
	 * @param {sap.m.VBox} iIndex The current index number for an item.
	 * @returns {array} An array with Chart from parent, chart from model and chart ID
	 * @private
	 */
	ChartMeasures.getChartFromConnectedField = function(oElement, iIndex) {
		var oRecord = ChangeHandlerUtils.getLineItemRecordForColumn(oElement),
			oChartFromParent,
			oFieldGroup;

		if (iIndex === undefined){
			return;
		}
		if (oRecord && oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" && oRecord.Target &&
			oRecord.Target.AnnotationPath.indexOf("FieldGroup") >= 0) {
			var sFieldGroup = oRecord.Target.AnnotationPath,
				oDataEntityType = ChangeHandlerUtils.getEntityTypeFromAnnotationPath(oElement, sFieldGroup);
			if (oDataEntityType) {
				sFieldGroup = sFieldGroup.substring(1);
				oFieldGroup = {
					target: oDataEntityType.namespace + "." + oDataEntityType.name,
					fieldGroup: sFieldGroup,
					data: oDataEntityType[sFieldGroup]
				};
			}
		}

		var oItemOld = oFieldGroup && oFieldGroup.data,
			aData = [];

		if (oItemOld) {
			aData = JSON.parse(JSON.stringify(oItemOld.Data));
		}
		if (iIndex >= 0) {
			var sAnnotationPath = (aData[iIndex].Target && aData[iIndex].Target.AnnotationPath).replace(/@/g, "");
			var oEntityType = ChangeHandlerUtils.getEntityTypeFromAnnotationPath(oElement, sAnnotationPath);
			var iQualifierIndex = sAnnotationPath.search("/");
			var chartId = sAnnotationPath.substring(iQualifierIndex + 1);
			oChartFromParent = {
				chartID: chartId,
				entityType: oEntityType
			};
		}

		return oChartFromParent;
	};

	/**
	 * Retrieves the complex value of the vMeasures property for a given chart element.
	 * The complex types combines the information from the Measures and MeasureAttributes collections of a
	 * UI.Chart annotation
	 *
	 * @param {object} oElement The current chart element
	 * @param {object} iIndex The index for an item
	 * @returns {object} An object comprising the values.
	 * @public
	 */
	ChartMeasures.getMeasures = function(oElement, iIndex) {
		var oMeasure = {},
			aMeasures = [],
			sMeasure,
			sQualifier,
			bAttributesFound,
			oMeasureAttribute,
			sDataPoint,
			oDataPoint = {},
			oDataPointFromModel,
			oChartFromParent,
			oChartFromModel;
		if (oElement.sId.indexOf("FieldGroup") >= 0){
			oChartFromParent = this.getChartFromConnectedField(oElement, iIndex);
		} else {
			oChartFromParent = DesigntimeUtils.getChartFromParent(oElement);
		}
		oChartFromModel = oChartFromParent && oChartFromParent.entityType[oChartFromParent.chartID];

		if (oChartFromModel && oChartFromModel.Measures) {
			var oChart = deepExtend({}, oChart, oChartFromModel);
			for ( var i = 0; i < oChart.Measures.length; i++ ) {
				sMeasure = oChart.Measures[i].PropertyPath;
				bAttributesFound = false;
				if (oChart.MeasureAttributes) {
					for (var j = 0; j < oChart.MeasureAttributes.length; j++) {
						oMeasureAttribute = oChart.MeasureAttributes[j];
						oDataPoint = {};
						if (oMeasureAttribute.Measure && oMeasureAttribute.Measure.PropertyPath === sMeasure) {
							bAttributesFound = true;
							if (oMeasureAttribute.DataPoint && oMeasureAttribute.DataPoint.AnnotationPath) {
								sQualifier = oMeasureAttribute.DataPoint.AnnotationPath.split("#").reverse()[0];
								sDataPoint = sQualifier ? DATAPOINT + "#" + sQualifier : DATAPOINT;
								oDataPointFromModel = oChartFromParent.entityType && oChartFromParent.entityType[sDataPoint] !== undefined ? oChartFromParent.entityType[sDataPoint] : oChartFromParent[sDataPoint];
								if (oDataPointFromModel) {
									deepExtend(oDataPoint, oDataPointFromModel);
								}
							}
							oMeasure = {
								Measure: {
									PropertyPath: oMeasureAttribute.Measure && oMeasureAttribute.Measure.PropertyPath
								},
								DataPointAnnotationPath: {
									AnnotationPath: oMeasureAttribute.DataPoint && oMeasureAttribute.DataPoint.AnnotationPath
								},
								DataPoint: oDataPoint
							};
							if (oMeasureAttribute.Role && oMeasureAttribute.Role.EnumMember) {
								switch (oMeasureAttribute.Role.EnumMember) {
									case "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1":
										oMeasure.Role = {
											EnumMember: "Axis1"
										};
										break;
									case "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis2":
										oMeasure.Role = {
											EnumMember: "Axis2"
										};
										break;
									case "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis3":
										oMeasure.Role = {
											EnumMember: "Axis3"
										};
										break;
									default:
										break;
								}
							}
							aMeasures.push(oMeasure);
							break;
						}
					}
				}
				if (!bAttributesFound) {
					oMeasure = {
						Measure: oChart.Measures[i]
					};
					aMeasures.push(oMeasure);
				}
			}
		}
		return aMeasures;
	};

	/**
	 * Updates the value of the Measures and MeasureAttributes for a given column.
	 * Prerequisite: the chart annotation must exist, a new chart must have been created before.
	 *
	 * @param {sap.m.Column} oColumn The column element (in overlay mode)
	 * @param {object}[] aNewMeasures The new values for the virtual property vMeasures
	 * @param {object} oChange The UI Change (of Run-Time Adaptation)
	 *
	 * @returns{object} The change content, comprising the implicitly changed annotations.
	 * @public
	 */
	ChartMeasures.setMeasures = function(oColumn, aNewMeasures, oChange) {
		var i, j, k,
			sMeasure,
			bExists,
			oNewMeasure,
			sDataPointPath,
			aCustomChanges = [],
			oMeasureFromAttribute,
			oNewMeasureAttribute = {},
			oChartFromColumn,
			oOldChart;

		if (oColumn.sId.indexOf("FieldGroup") >= 0) {
			var iIndex = oChange.metadataPath.match(/\d+/g).map(Number)[0];
			oChartFromColumn = this.getChartFromConnectedField(oColumn, iIndex);
			oOldChart = oChartFromColumn && oChartFromColumn.entityType[oChartFromColumn.chartID];
		} else {
			oChartFromColumn = DesigntimeUtils.getChartFromColumn(oColumn);
			oOldChart = oChartFromColumn && oChartFromColumn.entityType && oChartFromColumn.entityType[oChartFromColumn.chartID];
		}

		if (!oOldChart || isEmptyObject(oOldChart) || !oChartFromColumn || !aNewMeasures) {
			return aCustomChanges;
		}

		if (oChange.delayRefresh) {
			bPostponedRetemplating = true;
		}

		var oNewChart  = deepExtend({}, oOldChart),
			sTarget;

		if (oChartFromColumn.hasOwnProperty("entityType")) {
			if (oChartFromColumn.entityType.hasOwnProperty("namespace") && oChartFromColumn.entityType.hasOwnProperty("name")) {
				sTarget = oChartFromColumn.entityType.namespace + "." + oChartFromColumn.entityType.name;
			} else {
				sTarget = oChartFromColumn.entityType;
			}
		} else {
			sTarget = oChartFromColumn.namespace + "." + oChartFromColumn.name;
		}

		// check for deletions
		if (oNewChart.Measures) {
			for (i = oNewChart.Measures.length - 1; i >= 0; i--) {
				bExists = false;
				sMeasure = oNewChart.Measures[i].PropertyPath;
				for (j = 0; j < aNewMeasures.length; j++) {
					if (aNewMeasures[j].Measure && aNewMeasures[j].Measure.PropertyPath === sMeasure) {
						bExists = true;
						break;
					}
				}
				if (!bExists) {
					oNewChart.Measures.splice(i, 1);
					if (oNewChart.MeasureAttributes) {
						for (j = oNewChart.MeasureAttributes.length - 1; j >= 0; j--) {
							oMeasureFromAttribute = oNewChart.MeasureAttributes[j].Measure;
							if (oMeasureFromAttribute && oMeasureFromAttribute.PropertyPath === sMeasure) {
								oNewChart.MeasureAttributes.splice(j, 1);
								if (!sMeasure && oOldChart.Measures.length > aNewMeasures.length) {
									oChange.noRefreshOnChange = true;
									oChange.refreshPropertiesPane = true;
								}
								break;
							}
						}
					}
				}
			}
		}

		// check for inserts or updates
		for (i = 0; i < aNewMeasures.length; i++) {
			oNewMeasure = aNewMeasures[i];
			if (isEmptyObject(oNewMeasure)) {
				oNewMeasure = {
					Measure: {
						PropertyPath: ""
					}
				};
			}
			bExists = false;

			if (oNewChart.MeasureAttributes) {
				for (j = 0; j < oNewChart.MeasureAttributes.length; j++) {
					oMeasureFromAttribute = oNewChart.MeasureAttributes[j].Measure;
					if (oNewMeasure.Measure && oMeasureFromAttribute && oMeasureFromAttribute.PropertyPath === oNewMeasure.Measure.PropertyPath) {
						bExists = true;
						if (oNewMeasure.DataPointAnnotationPath && (!oNewChart.MeasureAttributes[j].DataPoint ||
							oNewChart.MeasureAttributes[j].DataPoint.AnnotationPath !== oNewMeasure.DataPointAnnotationPath.AnnotationPath)) {
							oChange.refreshPropertiesPane = true;
							bPostponedRetemplating = true;
						}

						break;
					}
				}
			}
			if (oNewMeasure.DataPointAnnotationPath && oNewMeasure.DataPointAnnotationPath.AnnotationPath) {
				sDataPointPath = oNewMeasure.DataPointAnnotationPath.AnnotationPath;
			} else if (oNewMeasure.Measure && oNewMeasure.Measure.PropertyPath) {   //implicitly derive qualifier from property
				sDataPointPath = "@" + DATAPOINT + "#" + oNewMeasure.Measure.PropertyPath;
				oNewMeasure.DataPointAnnotationPath = {
					AnnotationPath: sDataPointPath
				};
				oChange.retemplateAfterPanelRefresh = true;
				oChange.refreshPropertiesPane = true;
			} else {
				sDataPointPath = "";
			}
			oNewMeasureAttribute = {
				Measure: {
					PropertyPath: oNewMeasure.Measure.PropertyPath
				},
				DataPoint: {
					AnnotationPath: sDataPointPath
				},
				RecordType: "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType"
			};
			if (oNewMeasure.Role) {
				switch (oNewMeasure.Role.EnumMember) {
					case "Axis2":
						oNewMeasureAttribute.Role = {
							EnumMember: MEASURE_ROLE_TYPE + "/Axis2"
						};
						break;
					case "Axis3":
						oNewMeasureAttribute.Role = {
							EnumMember: MEASURE_ROLE_TYPE + "/Axis3"
						};
						break;
					default:
						oNewMeasureAttribute.Role = {
							EnumMember: MEASURE_ROLE_TYPE + "/Axis1"
						};
						break;
				}
			} else {
				var sAxis = "Axis1";
				if (oOldChart.MeasureAttributes) {
					var aPossibleAxis = [ "Axis1", "Axis2", "Axis3" ];
					sAxis = "Axis3";
					for (k = 0; k < oOldChart.MeasureAttributes.length; k++) {
						var sRole = oOldChart.MeasureAttributes[k].Role.EnumMember.split("/").reverse()[0];
						var iAxisIndex = aPossibleAxis.indexOf(sRole);
						if (iAxisIndex !== -1) {
							aPossibleAxis.splice(iAxisIndex, 1);
						}
					}
					if (aPossibleAxis.length > 0) {
						sAxis = aPossibleAxis[0];
					}
				}
				oNewMeasure.Role = {
					EnumMember: sAxis
				};
				oNewMeasureAttribute.Role = {
					EnumMember: MEASURE_ROLE_TYPE + "/" + sAxis
				};
			}

			if (!bExists) {
				if (!oNewChart.Measures) {
					oNewChart.Measures = [];
				}
				oNewChart.Measures.push(oNewMeasure.Measure);
				if (!oNewChart.MeasureAttributes) {
					oNewChart.MeasureAttributes = [];
				}
				oNewChart.MeasureAttributes.push(oNewMeasureAttribute);
			} else {
				oNewChart.MeasureAttributes[j] = oNewMeasureAttribute;
			}

			// If there is no DataPoint yet, create one
			// Otherwise, modify the existing one
			var sDataPointQualifier = DesigntimeUtils.modifyDataPointForChart(sTarget, oChartFromColumn.entityType ? oChartFromColumn.entityType : oChartFromColumn , oNewMeasure, aCustomChanges);
			if (sDataPointQualifier) {
				var aDataPoint = ["@", DATAPOINT, sDataPointQualifier];
				oNewChart.MeasureAttributes.DataPoint = {
					AnnotationPath: aDataPoint.join('')
				};
			}

			//Check whether a re-templating was prevented which shall be executed later on
			if (oNewMeasure.Measure.PropertyPath === "") {
				oChange.noRefreshOnChange = true;
				if (oOldChart.Measures.length > oNewChart.Measures.length && !bPostponedRetemplating) {
					k = 0;
					while (!bPostponedRetemplating && k < oOldChart.Measures.length) {
						if (oOldChart.Measures[k].PropertyPath) {
							bPostponedRetemplating = true;
						}
						k++;
					}
				}
			} else if (oNewMeasure.Measure.PropertyPath !== "" && oNewMeasure.DataPoint && oNewMeasure.DataPoint.Value && !oChange.noRefreshOnChange) {
				bPostponedRetemplating = false;
			}
		}

		//Trigger re-templating when there are no empty measures and a re-templating was postponed
		if (bPostponedRetemplating && oChange.noRefreshOnChange) {
			var bHasEmptyMeasures = false;
			k = 0;
			while (!bHasEmptyMeasures && k < oNewChart.Measures.length) {
				if (!oNewChart.Measures[k].PropertyPath) {
					bHasEmptyMeasures = true;
				}
				k++;
			}
			if (!bHasEmptyMeasures) {
				oChange.noRefreshOnChange = false;
				oChange.refreshPropertiesPane = true;
				bPostponedRetemplating = false;
			}
		}

		var oCustomChange = AnnotationChangeUtils.createCustomAnnotationTermChange(
			sTarget,
			oNewChart,
			oOldChart,
			oChartFromColumn.chartID
		);
		aCustomChanges.push(oCustomChange);

		return aCustomChanges;
	};

	return ChartMeasures;
});
