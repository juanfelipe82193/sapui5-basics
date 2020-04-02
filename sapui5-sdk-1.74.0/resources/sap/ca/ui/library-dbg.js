/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/**
 * Initialization Code and shared classes of library sap.ca.ui.
 */
sap.ui.define([
	"sap/ui/core/library", // library dependency
	"sap/m/library", // library dependency
	"sap/ui/core/Core"
], function() {

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "sap.ca.ui",
		dependencies : ["sap.ui.core","sap.m"],
		types: [
			"sap.ca.ui.charts.ChartColor",
			"sap.ca.ui.charts.ChartSelectionMode",
			"sap.ca.ui.charts.ChartSemanticColor"
		],
		interfaces: [],
		controls: [
			"sap.ca.ui.AddPicture",
			"sap.ca.ui.CustomerContext",
			"sap.ca.ui.CustomerControlListItem",
			"sap.ca.ui.DatePicker",
			"sap.ca.ui.ExpansibleFeedListItem",
			"sap.ca.ui.FileUpload",
			"sap.ca.ui.GrowingTileContainer",
			"sap.ca.ui.HierarchicalSelectDialog",
			"sap.ca.ui.Hierarchy",
			"sap.ca.ui.HierarchyItem",
			"sap.ca.ui.InPlaceEdit",
			"sap.ca.ui.Notes",
			"sap.ca.ui.OverflowContainer",
			"sap.ca.ui.OverviewTile",
			"sap.ca.ui.PictureItem",
			"sap.ca.ui.PictureTile",
			"sap.ca.ui.PictureTileContainer",
			"sap.ca.ui.PictureViewer",
			"sap.ca.ui.PictureViewerItem",
			"sap.ca.ui.ZoomableScrollContainer",
			"sap.ca.ui.charts.BarListItem",
			"sap.ca.ui.charts.BubbleChart",
			"sap.ca.ui.charts.Chart",
			"sap.ca.ui.charts.ChartToolBar",
			"sap.ca.ui.charts.ClusterListItem",
			"sap.ca.ui.charts.CombinedChart",
			"sap.ca.ui.charts.HorizontalBarChart",
			"sap.ca.ui.charts.LineChart",
			"sap.ca.ui.charts.StackedHorizontalBarChart",
			"sap.ca.ui.charts.StackedVerticalColumnChart",
			"sap.ca.ui.charts.VerticalBarChart"
		],
		elements: [
			"sap.ca.ui.HierarchicalSelectDialogItem"
		],
		version: "1.66.0-SNAPSHOT"
	});

	/**
	 * SAP UI library: Fiori Commons
	 *
	 * @namespace
	 * @alias sap.ca.ui
	 * @public
	 * @deprecated Since version 1.28.
	 * 
	 * All controls and helpers in this library meanwhile have been deprecated. Check the individual
	 * classes or packages for actual replacements. 
	 */

	var thisLib = sap.ca.ui;

	/**
	 * @namespace
	 * @public
	 * @deprecated Since version 1.24. 
	 * 
	 * Sap.ca charts have been replaced with sap.viz and VizFrame in 1.24.
	 * The UI5 control "sap.viz.ui5.controls.VizFrame" serves as a single point of entry for all the new charts.
	 * Now that 1.24 is available you are asked to use sap.viz charts and the VizFrame instead!
	 * This control will not be supported anymore from 1.24.
	 */
	thisLib.charts = thisLib.charts || {};

	/**
	 * Enumeration of available color to be used in sap.ca.ui charts.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 * @deprecated Since version 1.24. 
	 * 
	 * Sap.ca charts have been replaced with sap.viz and VizFrame in 1.24.
	 * The UI5 control "sap.viz.ui5.controls.VizFrame" serves as a single point of entry for all the new charts.
	 * Now that 1.24 is available you are asked to use sap.viz charts and the VizFrame instead!
	 * This control will not be supported anymore from 1.24.
	 */
	thisLib.charts.ChartColor = {

		/**
		 * Sap Ui Chart 1
		 * @public
		 */
		sapUiChart1 : "sapUiChart1",

		/**
		 * Sap Ui Chart 2
		 * @public
		 */
		sapUiChart2 : "sapUiChart2",

		/**
		 * Sap Ui Chart 3
		 * @public
		 */
		sapUiChart3 : "sapUiChart3",

		/**
		 * Sap Ui Chart 4
		 * @public
		 */
		sapUiChart4 : "sapUiChart4",

		/**
		 * Sap Ui Chart 5
		 * @public
		 */
		sapUiChart5 : "sapUiChart5",

		/**
		 * Sap Ui Chart 6
		 * @public
		 */
		sapUiChart6 : "sapUiChart6",

		/**
		 * Sap Ui Chart 7
		 * @public
		 */
		sapUiChart7 : "sapUiChart7",

		/**
		 * Sap Ui Chart 8
		 * @public
		 */
		sapUiChart8 : "sapUiChart8",

		/**
		 * Sap Ui Chart 9
		 * @public
		 */
		sapUiChart9 : "sapUiChart9",

		/**
		 * Sap Ui Chart 10
		 * @public
		 */
		sapUiChart10 : "sapUiChart10",

		/**
		 * Sap Ui Chart 11
		 * @public
		 */
		sapUiChart11 : "sapUiChart11"

	};

	/**
	 * Determines the selection mode of a Chart.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 * @deprecated Since version 1.24. 
	 * 
	 * Sap.ca charts have been replaced with sap.viz and VizFrame in 1.24.
	 * The UI5 control "sap.viz.ui5.controls.VizFrame" serves as a single point of entry for all the new charts.
	 * Now that 1.24 is available you are asked to use sap.viz charts and the VizFrame instead!
	 * This control will not be supported anymore from 1.24.
	 */
	sap.ca.ui.charts.ChartSelectionMode = {

		/**
		 * The chart will not allow any selection
		 * @public
		 */
		None : "None",

		/**
		 * The chart will only allow single selection
		 * @public
		 */
		Single : "Single",

		/**
		 * The chart will allow multi selection.
		 * @public
		 */
		Multiple : "Multiple"

	};
	/**
	 * Enumeration of available semantic color to be used in sap.Ca.ui
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 * @deprecated Since version 1.24. 
	 * 
	 * Sap.ca charts have been replaced with sap.viz and VizFrame in 1.24.
	 * The UI5 control "sap.viz.ui5.controls.VizFrame" serves as a single point of entry for all the new charts.
	 * Now that 1.24 is available you are asked to use sap.viz charts and the VizFrame instead!
	 * This control will not be supported anymore from 1.24.
	 */
	sap.ca.ui.charts.ChartSemanticColor = {

		/**
		 * Darker Neutral color
		 * @public
		 */
		NeutralDark : "NeutralDark",

		/**
		 * Neutral color
		 * @public
		 */
		Neutral : "Neutral",

		/**
		 * Lighter Neutral color
		 * @public
		 */
		NeutralLight : "NeutralLight",

		/**
		 * Darker Good color
		 * @public
		 */
		GoodDark : "GoodDark",

		/**
		 * Good color
		 * @public
		 */
		Good : "Good",

		/**
		 * Lighter Good color
		 * @public
		 */
		GoodLight : "GoodLight",

		/**
		 * Darker Critical color
		 * @public
		 */
		CriticalDark : "CriticalDark",

		/**
		 * Critical colro
		 * @public
		 */
		Critical : "Critical",

		/**
		 * Lighter Critical color
		 * @public
		 */
		CriticalLight : "CriticalLight",

		/**
		 * Darker Bad color
		 * @public
		 */
		BadDark : "BadDark",

		/**
		 * Bad color
		 * @public
		 */
		Bad : "Bad",

		/**
		 * Lighter Bad color
		 * @public
		 */
		BadLight : "BadLight"

	};

	/**
	 * @namespace
	 * @name sap.ca.ui.dialog
	 * @public
	 * @deprecated Since version 1.26. 
	 * 
	 * The content of this package is deprecated since 1.26 as per central UX requirements.
	 * Please use {@link sap.m.Dialog} instead.
	 */

	/**
	 * @namespace
	 * @name sap.ca.ui.model
	 * @public
	 * @deprecated Since version 1.28. 
	 */

	/**
	 * @namespace
	 * @name sap.ca.ui.model.format
	 * @public
	 * @deprecated Since version 1.28. 
	 * 
	 * Please refer to the individual formatters to learn about their replacement.
	 */

	/**
	 * @namespace
	 * @name sap.ca.ui.model.type
	 * @public
	 * @deprecated Since version 1.28. 
	 * 
	 * Please refer to the individual types to learn about their replacement.
	 */

	/**
	 * @namespace
	 * @name sap.ca.ui.utils
	 * @public
	 * @deprecated Since version 1.26. 
	 * 
	 * The content of this package is deprecated since 1.26 as per central UX requirements.
	 * Please use {@link sap.m.BusyDialog} instead.
	 */

	return thisLib;

});
