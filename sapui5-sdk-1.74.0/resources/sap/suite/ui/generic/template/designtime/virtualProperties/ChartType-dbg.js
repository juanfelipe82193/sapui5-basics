sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils"
], function(AnnotationChangeUtils, ChangeHandlerUtils, DesigntimeUtils) {
	"use strict";

	var ChartType = {},

		CHARTTYPE_AREA = "com.sap.vocabularies.UI.v1.ChartType/Area",
		CHARTTYPE_DONUT = "com.sap.vocabularies.UI.v1.ChartType/Donut",
		CHARTTYPE_BULLET = "com.sap.vocabularies.UI.v1.ChartType/Bullet";

	/**
	 * Retrieves a list of possible values of the chart type property, e.g. for filling a drop-down in the UI.
	 * The original vocabulary enum member is redefined in order to have the right descriptions
	 *
	 * @returns {object} An object comprising the values (as a technical key) and their labels (displayName)
	 * @private
	 */
	ChartType.getChartTypeValues = function() {

		return {
			Area: {
				displayName: "Smart Area Micro Chart"
			},
			Donut: {
				displayName: "Smart Radial Micro Chart"
			},
			Bullet: {
				displayName: "Smart Bullet Micro Chart"
			}
		};
	};

	/**
	 * Retrieves the current value of the chart type property for a given element from
	 * various annotations.
	 *
	 * @param {sap.m.Column} oElement The current chart element
	 * @returns {string} The technical key of the chart type property, as comprised in the list of possible values
	 * @private
	 */
	ChartType.getChartType =  function(oElement) {
		var oChart = DesigntimeUtils.getChartFromParent(oElement),
			sChartType;

		if (!oChart || !oChart.entityType[oChart.chartID] || !oChart.entityType[oChart.chartID].ChartType) {
			return sChartType;
		}
		switch (oChart.entityType[oChart.chartID].ChartType.EnumMember) {
			case CHARTTYPE_AREA:
				sChartType = "Area";
				break;
			case CHARTTYPE_BULLET:
				sChartType =  "Bullet";
				break;
			case CHARTTYPE_DONUT:
				sChartType =  "Donut";
				break;
			default:
				break;
		}
		return sChartType;
	};

	/**
	 * Updates the value of the chart type property for a given column
	 *
	 * @param {sap.m.Column} oColumn The column element (in overlay mode)
	 * @param {string} sNewChartType The new value for the chartType
	 * @param {object} oChange The UI Change (of Run-Time Adaptation)
	 *
	 * @returns{object} The change content, comprising old an new values of the columnType but also
	 *                  the implicitly changed annotations.
	 * @private
	 */
	ChartType.setChartType = function(oColumn, sNewChartType, oChange) {

		oChange.noRefreshOnChange = true;
		oChange.retemplateAfterPanelRefresh = true;
		oChange.delayRefresh = false;

		var aCustomChanges = [],
			sOldValue = ChartType.getChartType(oColumn);

		if (sOldValue === sNewChartType) {
			return aCustomChanges;
		}

		oChange.refreshPropertiesPane = true;

		var sTarget,
			oChartFromColumn = DesigntimeUtils.getChartFromColumn(oColumn);

		if (oChartFromColumn && oChartFromColumn.chartID) {
			var oChartOld = oChartFromColumn && oChartFromColumn.entityType && oChartFromColumn.entityType[oChartFromColumn.chartID],
				oChartNew = {};

			if (oChartOld) {
				sTarget = oChartFromColumn.entityType.namespace ? oChartFromColumn.entityType.namespace + "." + oChartFromColumn.entityType.name : oChartFromColumn.entityType.name;
				oChartNew.Description = oChartOld.Description;
				oChartNew.Measures = oChartOld.Measures;
				oChartNew.MeasureAttributes = oChartOld.MeasureAttributes;
			} else {
				sTarget = ChangeHandlerUtils.getEntityType(ChangeHandlerUtils.getComponent(oColumn));
			}

			switch (sNewChartType) {
				case "Area":
					oChartNew.ChartType = {
						EnumMember: "com.sap.vocabularies.UI.v1.ChartType/Area"
					};
					oChartNew.Dimensions = oChartOld && oChartOld.Dimensions;
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
			var oCustomChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sTarget, oChartNew, oChartOld, oChartFromColumn.chartID);
			aCustomChanges.push(oCustomChange);
		}

		return aCustomChanges;
	};

	return ChartType;
});
