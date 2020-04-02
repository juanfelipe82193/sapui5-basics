/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

/**
 * Initialization Code and shared classes of library sap.ui.mdc.
 */
sap.ui.define([],
	function () {
	"use strict";

	/**
	 * UI5 library: sap.ui.mdc containing controls that can be easily connected to rest service based models providing metadata.
	 *
	 * @namespace
	 * @name sap.ui.mdc
	 * @author SAP SE
	 * @version 1.74.0
	 * @public
	 */

	sap.ui.getCore().initLibrary({
		version: "1.74.0",
		name: "sap.ui.mdc",
		dependencies: ["sap.ui.core", "sap.m"],
		designtime: "sap/ui/mdc/designtime/library.designtime",
		types: [
			"sap.ui.mdc.TableType",
			"sap.ui.mdc.TableP13Mode",
			"sap.ui.mdc.GrowingMode",
			"sap.ui.mdc.RowCountMode",
			"sap.ui.mdc.SelectionMode",
			"sap.ui.mdc.TableRowAction",
			"sap.ui.mdc.FieldDisplay",
			"sap.ui.mdc.EditMode",
			"sap.ui.mdc.FilterExpression",
			"sap.ui.mdc.OutParameterMode"
			],
		interfaces: [
			"sap.ui.mdc.IFilter"
		],
		controls: [
			"sap.ui.mdc.Chart",
			"sap.ui.mdc.Table",
			"sap.ui.mdc.FilterBar",
			"sap.ui.mdc.field.FieldBase",
			"sap.ui.mdc.Field",
			"sap.ui.mdc.FilterField",
			"sap.ui.mdc.field.ValueHelpPanel",
			"sap.ui.mdc.field.DefineConditionPanel",
			"sap.ui.mdc.link.Panel",
			"sap.ui.mdc.link.ContactDetails"
			],
		elements: [
			"sap.ui.mdc.table.Column",
			"sap.ui.mdc.table.CreationRow",
			"sap.ui.mdc.table.TableTypeBase",
			"sap.ui.mdc.table.GridTableType",
			"sap.ui.mdc.table.ResponsiveTableType",
			"sap.ui.mdc.chart.DimensionItem",
			"sap.ui.mdc.chart.MeasureItem",
			"sap.ui.mdc.field.CustomFieldHelp",
			"sap.ui.mdc.field.CustomFieldInfo",
			"sap.ui.mdc.field.FieldHelpBase",
			"sap.ui.mdc.field.FieldInfo",
			"sap.ui.mdc.field.FieldInfoBase",
			"sap.ui.mdc.field.FieldValueHelp",
			"sap.ui.mdc.field.FieldValueHelpContentWrapperBase",
			"sap.ui.mdc.field.FieldValueHelpMTableWrapper",
			"sap.ui.mdc.field.ListFieldHelp",
			"sap.ui.mdc.field.BoolFieldHelp",
			"sap.ui.mdc.filterbar.FilterItemLayout",
			"sap.ui.mdc.link.ContactDetailsAddressItem",
			"sap.ui.mdc.link.ContactDetailsEmailItem",
			"sap.ui.mdc.link.ContactDetailsItem",
			"sap.ui.mdc.link.ContactDetailsPhoneItem",
			"sap.ui.mdc.link.ContentHandler",
			"sap.ui.mdc.link.LinkHandler",
			"sap.ui.mdc.link.LinkItem",
			"sap.ui.mdc.link.PanelItem",
			"sap.ui.mdc.link.FlpLinkHandler",
			"sap.ui.mdc.link.SemanticObjectUnavailableAction",
			"sap.ui.mdc.link.SemanticObjectMapping",
			"sap.ui.mdc.link.SemanticObjectMappingItem",
			"sap.ui.mdc.field.InParameter",
			"sap.ui.mdc.field.OutParameter"
		],
		extensions: {
			flChangeHandlers: {
				"sap.ui.mdc.Table": "sap/ui/mdc/flexibility/Table",
				"sap.ui.mdc.Chart": "sap/ui/mdc/flexibility/Chart",
				"sap.ui.mdc.FilterBar": "sap/ui/mdc/flexibility/FilterBar",
				"sap.ui.mdc.link.PanelItem": "sap/ui/mdc/flexibility/PanelItem",
				"sap.ui.mdc.link.Panel": "sap/ui/mdc/flexibility/Panel"
			}
		},
		noLibraryCSS: false
	});

	/**
	 *
	 * Interface for controls or entities which can serve as filters in the <code>sap.ui.mdc.Table</code>.
	 * The controls or entities have to implement the following APIs: <code>getSearch</code> & <code>getFilters</code> methods along with the <code>search</code> & <code>filtersChanged</code> events
	 *
	 * @since 1.70
	 * @name sap.ui.mdc.IFilter
	 * @interface
	 * @private
	 * @ui5-metamodel This interface also will be described in the UI5 (legacy) designtime metamodel
	 */

	/* eslint-disable no-undef */
	/**
	 * The SAPUI5 library that contains the metadata-driven controls and other entities.
	 *
	 * @namespace
	 * @alias sap.ui.mdc
	 * @author SAP SE
	 * @version 1.74.0
	 * @public
	 */
	var thisLib = sap.ui.mdc;
	/* eslint-enable no-undef */

	/**
	 * Defines the personalization mode of the filter bar.
	 *
	 * @enum {string}
	 * @private
	 * @since 1.74
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.FilterBarP13nMode = {
		/**
		 * FilterItem personalization is enabled.
		 *
		 * @public
		 */
		Item: "Item",
		/**
		 * Condition personalization is enabled.
		 *
		 * @public
		 */
		Value: "Value"
	};

	/**
	 * Defines the type of table used in the MDC table.
	 *
	 * @enum {string}
	 * @private
	 * @since 1.58
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.TableType = {
		/**
		 * Grid table ({@link sap.ui.table.Table} control) is used (default)
		 *
		 * @public
		 */
		Table: "Table",
		/**
		 * Responsive table ({@link sap.m.Table} control) is used.
		 *
		 * @public
		 */
		ResponsiveTable: "ResponsiveTable"
	};

	/**
	 * Defines the personalization mode of the table.
	 *
	 * @enum {string}
	 * @private
	 * @since 1.62
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.TableP13nMode = {
		/**
		 * Column personalization is enabled.
		 *
		 * @public
		 */
		Column: "Column",
		/**
		 * Sort personalization is enabled.
		 *
		 * @public
		 */
		Sort: "Sort"
	};

	/**
	 * Defines the growing options of the responsive table.
	 *
	 * @enum {string}
	 * @private
	 * @since 1.65
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.GrowingMode = {
		/**
		 * Basic growing (<code>growing</code> is set in responsive table)
		 *
		 * @public
		 */
		Basic: "Basic",
		/**
		 * Growing with scrolling (<code>growing</code> & <code>growingScrollToLoad</code> are set in responsive table)
		 *
		 * @public
		 */
		Scroll: "Scroll"
	};


	/**
	 * Defines the row count mode of the GridTable.
	 *
	 * @enum {string}
	 * @private
	 * @since 1.65
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.RowCountMode = {
		/**
		 * The table automatically fills the height of the surrounding container.
		 *
		 * @public
		 */
		Auto: "Auto",
		/**
		 * The table always has as many rows as defined in the <code>rowCount</code> property of <code>GridTableType</code>.
		 *
		 * @public
		 */
		Fixed: "Fixed"
	};

	/**
	 * Defines the types of chart actions in the toolbar.
	 *
	 * @enum {string}
	 * @private
	 * @since 1.64
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.ChartToolbarActionType = {
		/**
		 * Zoom in and zoom out action.
		 *
		 * @public
		 */
		ZoomInOut: "ZoomInOut",
		/**
		 * Drill down and up action.
		 *
		 * @public
		 */
		DrillDownUp: "DrillDownUp",
		/**
		 * Legend action.
		 *
		 * @public
		 */
		Legend: "Legend",
		/**
		 * Full screen action.
		 *
		 * @public
		 */
		FullScreen: "FullScreen",
		/**
		 * Personalization of visibility of dimensions and measures.
		 *
		 * @public
		 */
		P13nOfVisibility: "Visibility",
		/**
		 * Sort personalization.
		 *
		 * @public
		 */
		P13nOfSort: "Sort",
		/**
		 * Filter personalization.
		 *
		 * @public
		 */
		P13nOfFilter: "Filter",
		/**
		 * Chart type personalization.
		 *
		 * @public
		 */
		P13nOfChartType: "ChartType"
	};

	/**
	 * Defines the mode of the table.
	 *
	 * @enum {string}
	 * @private
	 * @since 1.58
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.SelectionMode = {
		/**
		 * No rows/items can be selected (default).
		 * @public
		 */
		None: "None",
		/**
		 * Only one row/item can be selected at a time.
		 * @public
		 */
		Single: "Single",
		/**
		 * Multiple rows/items can be selected at a time.
		 * @public
		 */
		Multi: "Multi"
	};

	/**
	 * Defines the actions that can be used in the table.
	 *
	 * @enum {string}
	 * @private
	 * @since 1.60
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.RowAction = {
		/**
		 * Navigation arrow (chevron) is shown in the table rows/items.
		 *
		 * @public
		 */
		Navigation: "Navigation"
	};

	/**
	 * Defines how the fields display text should be formatted.
	 *
	 * @enum {string}
	 * @private
	 * @since 1.48.0
	 */
	thisLib.FieldDisplay = {
		/**
		 * Only the value is displayed
		 * @public
		 */
		Value: "Value",
		/**
		 * Only the description is displayed
		 *
		 * if a <code>FieldHelp</code> is assigned to the <code>Field</code> the value is used as key for the <code>FieldHelp</code> items.
		 * @public
		 */
		Description: "Description",
		/**
		 * The value and the description is displayed in the field. The description is displayed after the value with brackets.
		 * @public
		 */
		ValueDescription: "ValueDescription",
		/**
		 * The description and the value is displayed in the field. The value is displayed after the description with brackets.
		 * @public
		 */
		DescriptionValue: "DescriptionValue"
	};

	/**
	 * Defines in what mode Fields are rendered
	 *
	 * @enum {string}
	 * @private
	 * @since 1.48.1
	 */
	thisLib.EditMode = {
		/**
		 * Field is rendered in display mode
		 * @public
		 */
		Display: "Display",
		/**
		 * Field is rendered editable
		 * @public
		 */
		Editable: "Editable",
		/**
		 * Field is rendered readonly
		 * @public
		 */
		ReadOnly: "ReadOnly",
		/**
		 * Field is rendered disabled
		 * @public
		 */
		Disabled: "Disabled",
		/**
		 * If there are more then one control is rendered by the <code>Field</code> or <code>FilterField</code>
		 * the first part is editable and the other parts are read-only.
		 * @since 1.72.0
		 * @public
		 */
		EditableReadOnly: "EditableReadOnly",
		/**
		 * If there are more then one control is rendered by the <code>Field</code> or <code>FilterField</code>
		 * the first part is editable and the other parts are in display mode.
		 * @since 1.72.0
		 * @public
		 */
		EditableDisplay: "EditableDisplay"
	};

	/**
	 * Defines the filter expression types.
	 *
	 * @enum {string}
	 * @private
	 * @since 1.61
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.FilterExpression = {
		/**
		 * Single interval value.
		 * @public
		 */
		Interval : "Interval",
		/**
		 * Single value.
		 * @public
		 */
		Single : "Single",
		/**
		 * Multiple value
		 * @public
		 */
		Multi : "Multi"
	};

	/**
	 * Defines the mode of the out-parameter
	 *
	 * @enum {string}
	 * @private
	 * @since 1.66.0
	 */
	thisLib.OutParameterMode = {
		/**
		 * The value in the out-parameter is always set
		 * @public
		 */
		Always: "Always",
		/**
		 * The value in the out-parameter is only set if it is empty before
		 * @public
		 */
		WhenEmpty: "WhenEmpty"
	};

	thisLib.ChartItemType = {
		/**
		 * Dimension Item
		 * @public
		 */
		Dimension: "Dimension",
		/**
		 * Measure Item
		 * @public
		 */
		Measure: "Measure"
	};

	thisLib.ChartItemRoleType = {
		/**
		 * All dimensions with role "category" are assigned to the feed uid "categoryAxis".
		 *
		 * <b>NOTE:</b> If the chart type requires at least one dimension on the feed "categoryAxis" (true for all chart types except pie and donut), but no dimension has the role "category" or "category2", then the first visible dimension is assigned to the "categoryAxis".
		 *
		 * @public
		 */
		category: "category",
		/**
		 * All dimensions with role "series" are assigned to the feed uid "color".
		 * @public
		 */
		series: "series",
		/**
		 * If a chart type does not use the feed uid "categoryAxis2", then all dimensions with role "category2" are treated as dimension with role "category" (appended).
		 * @public
		 */
		category2: "category2",
		/**
		 * General Rules for all chart types
		 * <ol>
		 *   <li>All measures with role "axis1" are assigned to feed uid "valueaxis". All measures with role "axis2" are assigned to feed uid "valueaxis2". All measures with role "axis3" are assigned to feed uid "bubbleWidth".</li>
		 *   <li>If a chart type does not use the feed uid "valueaxis2", then all measures with role "axis2" are treated as measures with role "axis1".</li>
		 *   <li>If a chart type requires at least 1 measure on the feed uid "valueaxis" (true for all non-"dual" chart types), but there is no measure with role "axis1", then the first measure with role "axis2" is assigned to feed uid "valueaxis"</li>
		 *   <li>If the chart type requires at least one measure on the feed uid "valueaxis2" (true for all "dual" chart types"), but there is no measure with role "axis2", then the first measure with role "axis3" or "axis4" or (if not exists) the last measure with role "axis1" is assigned to feed uid "valueaxis2".</li>
		 * </ol>
		 * @public
		 */
		axis1: "axis1",
		/**
		 * Measures with role "axis2" are assigned to feed uid "valueaxis2" if used.
		 * If a chart type does not use the feed uid "bubbleWidth" (true for all chart types except bubble and radar), then all measures with role "axis3" or "axis4" are treated as measures with role "axis2".
		 * @public
		 */
		axis2: "axis2",
		/**
		 * Measures with role "axis3" are assigned to feed uid "bubbleWidth" if used.
		 * @public
		 */
		axis3: "axis3"
	};
	/**
	 * Defines supported address types in ContactDetails control.
	 *
	 * @enum {string}
	 * @private
	 * @since 1.64
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.ContactDetailsAddressType = {
		work: "work",
		home: "home",
		preferred: "preferred"
	};
	/**
	 * Defines supported email types in ContactDetails control.
	 *
	 * @enum {string}
	 * @private
	 * @since 1.64
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.ContactDetailsEmailType = {
		work: "work",
		home: "home",
		preferred: "preferred"
	};
	/**
	 * Defines supported phone types in ContactDetails control.
	 *
	 * @enum {string}
	 * @private
	 * @since 1.64
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.ContactDetailsPhoneType = {
		work: "work",
		home: "home",
		cell: "cell",
		fax: "fax",
		preferred: "preferred"
	};

	return thisLib;
});
