/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

/**
 * Initialization Code and shared classes of library sap.chart.
 */
sap.ui.define(['sap/viz/ui5/format/ChartFormatter',	// library dependency
'sap/ui/core/library',	'sap/viz/library',	'sap/chart/utils/RoleFitter',	'sap/chart/utils/ChartTypeAdapterUtils',	'sap/chart/ChartType',	'sap/chart/data/Dimension',	'sap/chart/data/Measure',	'sap/chart/AutoScaleMode',	'sap/chart/ScaleBehavior',	'sap/chart/data/MeasureSemantics',	'sap/chart/coloring/CriticalityType',	'sap/chart/ColoringType', 'sap/chart/data/DimensionRoleType', 'sap/chart/data/MeasureRoleType'], function(
	ChartFormatter,
 corelib,
 vizlib,
 RoleFitter,
 ChartTypeAdapterUtils,
 ChartType,
 Dimension,
 Measure,
 AutoScaleMode,
 ScaleBehavior,
 MeasureSemantics
)	{
	"use strict";

	/**
	 * Chart controls based on Vizframe
	 *
	 * @namespace
	 * @name sap.chart
	 * @public
	 */

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name: "sap.chart",
		dependencies: ["sap.ui.core", "sap.viz"],
		types: [
			"sap.chart.data.MeasureSemantics"
		],
		interfaces: [],
		controls: [
			"sap.chart.Chart"
		],
		elements: [
			"sap.chart.data.Dimension",
			"sap.chart.data.TimeDimension",
			"sap.chart.data.HierarchyDimension",
			"sap.chart.data.Measure"
		],
		noLibraryCSS: true,
		version: "1.74.0"
	});


	/**
	 * Enumeration for supported selection mode in analytical chart
	 *
	 * @enum {string}
	 * @public
	 * @alias sap.chart.SelectionMode
	 */
	sap.chart.SelectionMode = {
		/**
		 * Multi selection mode, multiple sets of data points can be selected at once.
		 * @public
		 */
		Multi: "MULTIPLE",
		/**
		 * Single selection mode, only one set of data points can be selected at once.
		 * @public
		 */
		Single: "SINGLE",
		/**
		 * None selection mode, no data points can be selected.
		 * @public
		 */
		None : "NONE"
	};

	/**
	 * Enumeration for supported selection behavior in analytical chart
	 *
	 * @enum {string}
	 * @public
	 * @alias sap.chart.SelectionBehavior
	 */
	sap.chart.SelectionBehavior = {
		/**
		 * Data point selection behavior, only one data point can be selected at once.
		 * @public
		 */
		DataPoint: "DATAPOINT",
		/**
		 * Category selection behavior, one category of data points can be selected at once.
		 * @public
		 */
		Category: "CATEGORY",
		/**
		 * Series selection behavior, one seies of data points can be selected at once.
		 * @public
		 */
		Series: "SERIES"
	};

	/**
	 * Enumeration for supported message types in analytical chart.
	 *
	 * @enum {string}
	 * @public
	 * @alias sap.chart.MessageId
	 */
	sap.chart.MessageId = {
		/**
		 * No data message, metadata is defined but all data values are empty.
		 * @public
		 */
		NoData: "NO_DATA",
		/**
		 * Multiple units message, multiple unites are not allowed in one measure for analytical chart.
		 * @public
		 */
		MultipleUnits: "MULTIPLE_UNITS"
	};

	/**
	 * Package with additional chart APIs
	 * @namespace
	 * @public
	 */
	sap.chart.api = {};

	/**
	 * Returns all chart types currently supported by chart control (subset of viz types).
	 *
	 * @public
	 * @returns {object} a map with chartType as key, localized chart name as value.
	 */
	sap.chart.api.getChartTypes = function() {
		var oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.chart.messages");
		return Object.keys(sap.chart.ChartType).reduce(function(oMap, sChartTypeKey) {
			var sChartType = sap.chart.ChartType[sChartTypeKey];
			oMap[sChartType] = oBundle.getText("info/" + sChartType);
			return oMap;
		}, {});
	};

	/**
	 * Package with additional chart data APIs
	 * @namespace
	 * @public
	 */
	sap.chart.data = sap.chart.data || {};

	/**
	 * Package with colorings enumeration
	 * @namespace
	 * @public
	 */
	sap.chart.coloring = sap.chart.coloring || {};

	/**
	 * Enumeration for supported ImprovementDirection types in analytical chart
	 *
	 * @enum {string}
	 * @public
	 * @alias sap.chart.coloring.ImprovementDirectionType
	 */
	sap.chart.coloring.ImprovementDirectionType = {
		/**
		 * Lower is better.
		 *
		 * Positive if the value is lower than or equal to <code>AcceptanceRangeHighValue</code>.
		 *
		 * Neutral if the value is greater than <code>AcceptanceRangeHighValue</code> and lower than or equal to <code>ToleranceRangeHighValue</code>.
		 *
		 * Critical if the value is greater than <code>ToleranceRangeHighValue</code> and lower than or equal to <code>DeviationRangeHighValue</code>.
		 *
		 * Negative if the value is greater than <code>DeviationRangeHighValue</code>.
		 * @public
		 */
		Minimize: "Minimize",

		/**
		 * Closer to the target is better.
		 *
		 * Positive if the value is greater than or equal to <code>AcceptanceRangeLowValue</code> and lower than or equal to <code>AcceptanceRangeHighValue</code>.
		 *
		 * Neutral if the value is greater than or equal to <code>ToleranceRangeLowValue</code> and lower than <code>AcceptanceRangeLowValue</code> OR greater than <code>AcceptanceRangeHighValue</code> and lower than or equal to <code>ToleranceRangeHighValue</code>.
		 *
		 * Critical if the value is greater than or equal to <code>DeviationRangeLowValue</code> and lower than <code>ToleranceRangeLowValue</code> OR greater than <code>ToleranceRangeHighValue</code> and lower than or equal to <code>DeviationRangeHighValue</code>.
		 *
		 * Negative if the value is lower than <code>DeviationRangeLowValue</code> or greater than <code>DeviationRangeHighValue</code>.
		 * @public
		 */
		Target: "Target",

		/**
		 * Higher is better.
		 *
		 * Positive if the value is greater than or equal to <code>AcceptanceRangeLowValue</code>.
		 *
		 * Neutral if the value is lower than <code>AcceptanceRangeLowValue</code> and greater than or equal to <code>ToleranceRangeLowValue</code>.
		 *
		 * Critical if the value is lower than <code>ToleranceRangeLowValue</code> and greater than or equal to <code>DeviationRangeLowValue</code>.
		 *
		 * Negative if the value is lower than <code>DeviationRangeLowValue</code>.
		 * @public
		 */
		Maximize: "Maximize"
	};

	/**
     * Enumeration for supported Gradation single color scheme in analytical chart
     *
     * @enum {string}
     * @public
     * @alias sap.chart.coloring.GradationSingleColorScheme
     */
    sap.chart.coloring.GradationSingleColorScheme = {
        /**
         * NoSemantics
         * @public
         */
        NoSemantics: "NoSemantics",

        /**
         * Positive
         * @public
         */
        Positive: "Positive",

        /**
         * Negative
         * @public
         */
        Negative: "Negative"
    };

    /**
     * Enumeration for supported Gradation diverging color scheme in analytical chart
     *
     * @enum {string}
     * @public
     * @alias sap.chart.coloring.GradationDivergingColorScheme
     */
    sap.chart.coloring.GradationDivergingColorScheme = {
        /**
         * NoSemantics
         * @public
         */
        NoSemantics: "NoSemantics",

        /**
         * PositiveToNegative
         * @public
         */
        PositiveToNegative: "PositiveToNegative",

        /**
         * NegativeToPositive
         * @public
         */
        NegativeToPositive: "NegativeToPositive",

        /**
         * PositiveToNegative
         * @public
         */
        ColdToHot: "ColdToHot",

        /**
         * HotToCold
         * @public
         */
        HotToCold: "HotToCold"
    };

    /**
     * Enumeration for supported Gradation target color scheme in analytical chart
     *
     * @enum {string}
     * @public
     * @alias sap.chart.coloring.GradationTargetColorScheme
     */
    sap.chart.coloring.GradationTargetColorScheme = {
        /**
         * PositiveTarget
         * @public
         */
        PositiveTarget: "PositiveTarget"
    };

    /**
     * Enumeration for supported Gradation color saturation in analytical chart
     *
     * @enum {string}
     * @public
     * @alias sap.chart.coloring.GradationSaturation
     */
    sap.chart.coloring.GradationSaturation = {
        /**
         * LightToDark
         * @public
         */
        LightToDark: "LightToDark",

        /**
         * DarkToLight
         * @public
         */
        DarkToLight: "DarkToLight"
    };

	/**
	 * Get the Dimensions and Measures layout for a certain ChartType with provided Dimensions and Measures.
	 *
	 * @param {string} sChartType chart type
	 * @param {object[]|sap.chart.data.Dimension[]} aDimensions visible Dimensions of the form {name: sName} or {@link sap.chart.data.Dimension} instance.
	 * @param {object[]|sap.chart.data.Measure[]} aMeasures visible Measures of the form {name: sName} or {@link sap.chart.data.Measure} instance.
	 *
	 * @public
	 * @returns {object} the chart layout object of the following form:
	 * <pre>
	 * {
	 *   dimensions: [],     // names of dimensions that will be rendered
	 *	 measures:	 [],     // names of measures that will be rendered
	 *	 errors:	 [],     // reasons of why the chart cannot be rendered with the given (chartType, dimensions, measures) combination
	 * }
	 * </pre>
	 */
	sap.chart.api.getChartTypeLayout = function(sChartType, aDimensions, aMeasures) {
		var aDims, aMsrs;
		if (!sChartType) {
			throw new Error("Invalid chart type: " + String(sChartType));
		}
		if (aDimensions) {
			aDims = aDimensions.map(function(oDimCfg, i) {
				if (oDimCfg instanceof Dimension) {
					return oDimCfg;
				} else  if (oDimCfg && (oDimCfg.name)) {
					return {
						getName: function() {return oDimCfg.name;},
						getRole: function() {return oDimCfg.role || "category";}
					};
				} else {
					throw new Error("Invalid Dimension at [" + i + "]: " + String(oDimCfg) + ". Dimension should be an object of the format{name:'name'} or an instance of sap.chart.data.Dimension.");
				}
			});
		} else {
			aDims = [];
		}
		if (aMeasures) {
			aMsrs = aMeasures.map(function(oMsrCfg, i) {
				if (oMsrCfg instanceof Measure){
					return oMsrCfg;
				} else if (oMsrCfg && oMsrCfg.name) {
					return {
						getName: function() {return oMsrCfg.name;},
						getRole: function() {return oMsrCfg.role || "axis1";}
					};
				} else {
					throw new Error("Invalid Measure at [" + i + "]: " +  String(oMsrCfg) + ". Measure should be an object of the format{name:'name'} or an instance of sap.chart.data.Measure.");
				}
			});
		} else {
			aMsrs = [];
		}
		var adapteredChartType = ChartTypeAdapterUtils.adaptChartType(sChartType, aDims);
		var oCompatibility = RoleFitter.compatible(adapteredChartType, aDims, aMsrs);

		return {
			dimensions: oCompatibility.used.Dimension || [],
			measures: oCompatibility.used.Measure || [],
			errors: Object.keys(oCompatibility.error || {}).reduce(function(aErrs, sCause) {
				return aErrs.concat({cause: sCause, detail: oCompatibility.error[sCause]});
			}, [])
		};
	};

	var chartFormatter = ChartFormatter.getInstance();

	if (!(sap.viz.api.env.Format.numericFormatter() instanceof ChartFormatter)) {
		sap.viz.api.env.Format.numericFormatter(chartFormatter);
	}

	return sap.chart;

});