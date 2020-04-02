/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// Provides control sap.ui.comp.smarttable.SmartTable.
sap.ui.define([
	'sap/ui/thirdparty/jquery', 'sap/m/library', 'sap/ui/core/library', 'sap/ui/core/Core', 'sap/ui/events/KeyCodes', 'sap/ui/comp/util/DateTimeUtil', 'sap/ui/comp/util/FilterUtil', 'sap/m/Column', 'sap/m/ColumnListItem', 'sap/m/Label', 'sap/m/MessageBox', 'sap/m/Table', 'sap/m/Text', 'sap/m/Title', 'sap/m/OverflowToolbar', 'sap/m/ToolbarSpacer', 'sap/m/OverflowToolbarButton', 'sap/m/ToolbarSeparator', 'sap/m/VBox', 'sap/m/FlexItemData', 'sap/ui/comp/library', 'sap/ui/comp/providers/TableProvider', 'sap/ui/comp/smartfilterbar/FilterProvider', 'sap/ui/comp/smartvariants/SmartVariantManagement', 'sap/ui/model/Sorter', 'sap/ui/model/Filter', 'sap/ui/model/FilterOperator', 'sap/ui/model/json/JSONModel', 'sap/ui/table/AnalyticalColumn', 'sap/ui/table/AnalyticalTable', 'sap/ui/table/Column', 'sap/ui/table/Table', 'sap/ui/table/TreeTable', 'sap/ui/comp/personalization/Controller', 'sap/ui/comp/personalization/Util', 'sap/ui/comp/util/FormatUtil', 'sap/ui/comp/util/FullScreenUtil', 'sap/ui/comp/odata/ODataModelUtil', 'sap/ui/comp/odata/ODataType', 'sap/ui/comp/state/UIState', 'sap/ui/comp/smartvariants/PersonalizableInfo', 'sap/ui/core/format/NumberFormat', 'sap/ui/Device', 'sap/base/Log', 'sap/base/util/deepEqual', 'sap/base/util/merge', "sap/m/ColumnHeaderPopover", 'sap/m/ColumnPopoverActionItem', 'sap/m/ColumnPopoverSortItem', 'sap/m/Menu', 'sap/m/MenuButton', 'sap/m/MenuItem'
], function(jQuery, MLibrary, coreLibrary, Core, KeyCodes, DateTimeUtil, FilterUtil, Column1, ColumnListItem, Label, MessageBox, ResponsiveTable, Text, Title, OverflowToolbar, ToolbarSpacer, OverflowToolbarButton, ToolbarSeparator, VBox, FlexItemData, library, TableProvider, FilterProvider, SmartVariantManagement, Sorter, Filter, FilterOperator, JSONModel, AnalyticalColumn, AnalyticalTable, Column, Table, TreeTable, Controller, PersonalizationUtil, FormatUtil, FullScreenUtil, ODataModelUtil, ODataType, UIState, PersonalizableInfo, NumberFormat, Device, Log, deepEqual, merge, ColumnHeaderPopover, ColumnPopoverActionItem, ColumnPopoverSortItem, Menu, MenuButton, MenuItem) {
	"use strict";

	// Shortcut for sap.m.ButtonType
	var ButtonType = MLibrary.ButtonType;

	// Shortcut for sap.m.MenuButtonMode
	var MenuButtonMode = MLibrary.MenuButtonMode;

	// shortcut for sap.m.ToolbarDesign
	var ToolbarDesign = MLibrary.ToolbarDesign;

	// shortcut for sap.ui.core.SortOrder
	var SortOrder = coreLibrary.SortOrder;

	// shortcut for sap.ui.comp.smarttable.InfoToolbarBehavior
	var InfoToolbarBehavior = library.smarttable.InfoToolbarBehavior;

	/**
	 * Constructor for a new smarttable/SmartTable.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class The SmartTable control creates a table based on OData metadata and the configuration specified. The entitySet attribute must be
	 *        specified to use the control. This attribute is used to fetch fields from OData metadata, from which columns will be generated; it can
	 *        also be used to fetch the actual table data.<br>
	 *        Based on the tableType property, this control will render a standard, analytical, tree, or responsive table.<br>
	 *        <b><i>Note:</i></b><br>
	 *        Most of the attributes/properties are not dynamic and cannot be changed once the control has been initialized.
	 * @extends sap.m.VBox
	 * @author SAP SE
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.smarttable.SmartTable
	 * @see {@link topic:bed8274140d04fc0b9bcb2db42d8bac2 Smart Table}
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SmartTable = VBox.extend("sap.ui.comp.smarttable.SmartTable", /** @lends sap.ui.comp.smarttable.SmartTable.prototype */
	{
		metadata: {

			library: "sap.ui.comp",

			designtime: "sap/ui/comp/designtime/smarttable/SmartTable.designtime",

			properties: {

				/**
				 * The entity set name from which to fetch data and generate the columns. Note that this is not a dynamic UI5 property
				 *
				 * @since 1.26.0
				 */
				entitySet: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * ID of the corresponding SmartFilter control; When specified, the SmartTable searches for the SmartFilter (also in the closest
				 * parent View) and attaches to the relevant events of the SmartFilter; to fetch data, show overlay etc.
				 *
				 * @since 1.26.0
				 */
				smartFilterId: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Comma-separated value of fields that must be ignored in the OData metadata by the <code>SmartTable</code> control.<br>
				 * The <code>SmartTable</code> control will not create built-in columns for the fields defined by this property
				 * and will not offer these fields in table personalization.
				 *
				 * <i>Note:</i><br>
				 * Please ensure that you do not add spaces or special characters as no validation is done for this property.
				 *
				 * @since 1.26.0
				 */
				ignoredFields: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Comma-separated value of fields that must be shown initially in the SmartTable as visible columns and in the order specified.<br>
				 * This property is mainly meant to be used when no LineItem annotation exists.<br>
				 * If you have fields in the XMLView they are always shown first; then, the columns are added based on the LineItem annotation and
				 * finally based on this property.<br>
				 * <i>Note:</i><br>
				 * If both this property and the LineItem annotation exist, the order of fields cannot be guaranteed to be as mentioned here.<br>
				 * Please ensure that you do not add spaces or special characters as no validation is done for this property.
				 *
				 * @since 1.32.0
				 */
				initiallyVisibleFields: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Comma-separated value of fields that must be always requested from the backend<br>
				 * This property is mainly meant to be used when there is no PresentationVariant annotation.<br>
				 * If both this property and the PresentationVariant annotation exist, the select request sent to the backend would be a combination
				 * of both.<br>
				 * <i>Note:</i><br>
				 * For <code>AnalyticalTable</code> (supported since 1.54), the following restrictions apply:
				 * <ul>
				 * <li>The property name(s) must not point to a new dimension or a measure.</li>
				 * <li>The property name(s) must not point to a navigationProperty/association path, as this might not supported by analytical
				 * services.</li>
				 * </ul>
				 * Please ensure that you do not add spaces or special characters as no validation is done for this property.
				 *
				 * @since 1.32.0
				 */
				requestAtLeastFields: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Comma-separated value of fields that is not shown in the personalization dialog.<br>
				 * This property must only be used with <code>AnalyticalTable</code> for use cases
				 * where a technical field/column is required to fetch some data from the backend but is hidden in the table personalization and on the UI.
				 *
				 * <i>Note:</i><br>
				 * <ul>
				 * <li>Please ensure that you do not add spaces or special characters as no validation is done for this property.</li>
				 * <li>Visible fields/columns cannot be included in this property as this is not supported by the <code>SmartTable</code> control.</li>
				 * </ul>
				 *
				 * @since 1.32.0
				 */
				ignoreFromPersonalisation: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Specifies the type of table to be created in the SmartTable control.<br>
				 * <i>Note:</i><br>
				 * If you add a table to the content of the SmartTable in the view, this property has no effect.
				 *
				 * @since 1.26.0
				 */
				tableType: {
					type: "sap.ui.comp.smarttable.TableType",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * The useVariantManagement attribute can be set to true or false depending on whether you want to use variants. As a prerequisite you
				 * need to specify the persistencyKey property.
				 *
				 * @since 1.26.0
				 */
				useVariantManagement: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * The showVariantManagement attribute can be set to true or false for controlling the visibility of VariantManagement button.
				 *
				 * @since 1.38.0
				 */
				showVariantManagement: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * Can be set to true or false depending on whether you want to export data to a spreadsheet application, for example Microsoft Excel.<br>
				 * <i>Note:</i><br>
				 * If <code>exportType</code> is <code>sap.ui.comp.smarttable.ExportType.GW</code>, any $expand parameters are removed when
				 * sending the request to generate the spreadsheet.<br>
				 * As of UI5 version 1.56: If <code>exportType</code> is <code>sap.ui.comp.smarttable.ExportType.UI5Client</code> and
				 * <code>TreeTable</code> is used, the <code>worksheet.hierarchyLevel</code> property (see {@link sap.ui.export.Spreadsheet}) is
				 * filled from the binding, if the relevant information is available there for exporting hierarchical data in the spreadsheet.
				 *
				 * @since 1.26.0
				 */
				useExportToExcel: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * Specifies the type of export to be used in the <code>SmartTable</code> control.
				 *
				 * @since 1.50.0
				 */
				exportType: {
					type: "sap.ui.comp.smarttable.ExportType",
					group: "Misc",
					defaultValue: "UI5Client"
				},

				/**
				 * The useTablePersonalisation attribute can be set to true or false depending on whether you want to define personalized table
				 * settings. If you want to persist the table personalization, you need to specify the persistencyKey property.
				 *
				 * @since 1.26.0
				 */
				useTablePersonalisation: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * The showTablePersonalisation attribute can be set to true or false for controlling the visibility of the TablePersonalisation
				 * button.
				 *
				 * @since 1.38.0
				 */
				showTablePersonalisation: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * If set to <code>true</code> (default), the number of rows is shown along with the header text.<br>
				 * If set to <code>false</code>, the number of rows will not be shown on the user interface.<br>
				 * <i>Note:</i><br>
				 * To avoid sending dedicated OData requests in order to improve your application's performance, you must configure the binding of the
				 * table as required.
				 *
				 * @since 1.26.0
				 */
				showRowCount: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * Specifies header text that is shown in table
				 *
				 * @since 1.26.0
				 */
				header: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * A style class which is defined for the toolbar of the table.
				 *
				 * @since 1.26.0
				 */
				toolbarStyleClass: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Can be used to override the filter behavior. If set to true (default), instead of the filter input box a button is rendered. When
				 * pressing this button, the SmartTable control opens the filter panel directly in the table personalization dialog.
				 *
				 * @deprecated Since 1.40.0. After personalization dialog has been introduced in SmartTable the property
				 *             <code>enableCustomFilter</code> does not make sense. When setting the property to <code>false</code>, the entered
				 *             custom filter value will not be shown in personalization dialog and will also not be persisted in variant management.
				 *             The custom filter will also be overwritten when rebindTable is called on the SmartTable.
				 * @since 1.26.0
				 */
				enableCustomFilter: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * Key used to access personalization data.
				 *
				 * @since 1.26.0
				 */
				persistencyKey: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * If set to true, the standard toolbar and custom toolbar will be merged into one toolbar. The combined toolbar will have a solid
				 * style.
				 *
				 * @since 1.26.0
				 * @deprecated Since 1.29. This property has no effect
				 */
				useOnlyOneSolidToolbar: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * Specifies whether the <code>Toolbar</code> control of the <code>SmartTable</code> is placed inside the corresponding
				 * aggregation of the inner UI5 table control.
				 *
				 * @since 1.56
				 */
				placeToolbarInTable: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * Retrieves or sets the current variant.
				 *
				 * @since 1.28.0
				 */
				currentVariantId: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * This attribute can be used to specify if the controls created by the SmartTable control are editable. (The automatic toggle of
				 * controls works only for the SmartField/SmartToggle scenario)
				 *
				 * @since 1.28.0
				 */
				editable: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * When set to true, this enables automatic binding of the table using the tableBindingPath (if it exists) or entitySet property. This
				 * happens just after the <code>initialise</code> event has been fired.
				 *
				 * @since 1.28.0
				 */
				enableAutoBinding: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * This attribute can be used to specify the path that is used during the binding of the table. If not specified, the entitySet
				 * attribute is used instead. (used only if binding is established internally/automatically - See enableAutoBinding)
				 *
				 * @since 1.28.0
				 */
				tableBindingPath: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Specifies whether the editable property can be toggled via a button on the toolbar. (The automatic toggle of controls works only
				 * for the SmartField/SmartToggle scenario)
				 *
				 * @since 1.28.0
				 */
				editTogglable: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * The demandPopin attribute can be set to true or false depending on whether you want to display columns as popins on the responsive
				 * table
				 *
				 * @since 1.30.0
				 */
				demandPopin: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * Controls the visibility of the FullScreen button.
				 *
				 * @since 1.38
				 */
				showFullScreenButton: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * The text shown initially before the control is bound and initialized. The special values <code>$FILTERBAR</code> or
				 * <code>$NO_FILTERBAR</code> can be specified to make the <code>SmartTable</code> control show the initial text as if the
				 * <code>SmartFilterBar</code> control were associated with it. If nothing is specified, the default behavior is to show the initial
				 * text based on whether the <code>SmartFilterBar</code> control is actually associated with the <code>SmartTable</code> control.
				 *
				 * @since 1.58
				 */
				initialNoDataText: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Shows an info toolbar.<br>
				 * Filters that are applied using the table personalization dialog are shown in the info toolbar.<br>
				 * <b>Note:</b><br>
				 * <ul>
				 * <li>The default value for the property is <code>Auto</code>, which means that the info toolbar is shown by default if table
				 * type is <code>ResponsiveTable</code>.</li>
				 * <li>The info toolbar is hidden if the property is set to <code>Off</code>.</li>
				 * <li>The info toolbar is visible if the property is set to <code>On</code>. Currently the info toolbar is only available for the
				 * table type <code>ResponsiveTable</code>.</li>
				 * <li>If multiple filters are applied to the same column, then the info toolbar contains the column name only once.</li>
				 * <li>In case there is a custom info toolbar used for the responsive table control, then the property must be set to
				 * <code>Off</code>. Otherwise, an error is logged in the browser console.</li>
				 * </ul>
				 *
				 * @since 1.70
				 */
				useInfoToolbar: {
					type: "sap.ui.comp.smarttable.InfoToolbarBehavior",
					group: "Behavior",
					defaultValue: InfoToolbarBehavior.Auto
				}
			},
			associations: {
				/**
				 * Identifies the SmartVariant control which should be used for the personalization. Will be ignored if the advanced mode is set.
				 *
				 * @since 1.38
				 */
				smartVariant: {
					type: "sap.ui.core.Control",
					multiple: false
				}
			},
			aggregations: {

				/**
				 * A toolbar that can be added by the user to define their own custom buttons, icons, etc. If this is specified, the SmartTable
				 * control does not create an additional toolbar, but makes use of this one.<br>
				 * <i>Note:</i><br>
				 * The CSS class sapMTBHeader-CTX is applied on the given toolbar.
				 *
				 * @since 1.26.0
				 */
				customToolbar: {
					type: "sap.m.Toolbar",
					multiple: false
				},

				/**
				 * The Semantic Object Controller allows the user to specify and overwrite functionality for semantic object navigation.
				 *
				 * @since 1.28.0
				 */
				semanticObjectController: {
					type: "sap.ui.comp.navpopover.SemanticObjectController",
					multiple: false
				},

				/**
				 * The value for the noData aggregation can be either a string value or a control instance.<br>
				 * The control is shown, in case there is no data for the Table available. In case of a string value this will simply replace the no
				 * data text.<br>
				 * Currently the Responsive Table only supports string values.
				 *
				 * @since 1.32.0
				 */
				noData: {
					type: "sap.ui.core.Control",
					altTypes: [
						"string"
					],
					multiple: false
				},
				/**
				 * Allows users to specify an additional control that will be added to a VBox for the first semantic key field.<br>
				 * <i>Note:</i><br>
				 * This property is not meant for public use.
				 *
				 * @since 1.38.0
				 */
				semanticKeyAdditionalControl: {
					type: "sap.ui.core.Control",
					multiple: false
				}
			},
			events: {

				/**
				 * This event is fired once the control has been initialized.
				 *
				 * @since 1.26.0
				 */
				initialise: {},

				/**
				 * This event is fired just before the binding is being done.
				 *
				 * @name sap.ui.comp.smarttable.SmartTable#beforeRebindTable
				 * @event
				 * @param {sap.ui.base.Event} oControlEvent
				 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
				 * @param {object} oControlEvent.getParameters
				 * @param {object} oControlEvent.getParameters.bindingParams The bindingParams object contains filters, sorters and other binding
				 *        related information for the table.
				 * @param {boolean} oControlEvent.getParameters.bindingParams.preventTableBind If set to <code>true</code> by the listener, binding
				 *        is prevented
				 * @param {sap.ui.model.Filter[]} oControlEvent.getParameters.bindingParams.filters The combined filter array containing a set of
				 *        sap.ui.model.Filter instances of the SmartTable and SmartFilter controls; can be modified by users to influence filtering
				 * @param {sap.ui.model.Sorter[]} oControlEvent.getParameters.bindingParams.sorter An array containing a set of sap.ui.model.Sorter
				 *        instances of the SmartTable control (personalization); can be modified by users to influence sorting
				 * @param {object} oControlEvent.getParameters.bindingParams.parameters a map of parameters which is passed to the binding
				 * @param {object} oControlEvent.getParameters.bindingParams.events map of event listeners for the binding events (since 1.56). The
				 *        events listeners can only be registered while the binding is created. So, ensure that the events parameter is filled from
				 *        the beginning, so that the registration can be done while the binding is created.
				 * @since 1.26.0
				 * @public
				 */
				beforeRebindTable: {},

				/**
				 * This event is fired when display/edit button is clicked.
				 *
				 * @since 1.28.0
				 */
				editToggled: {},

				/**
				 * This event is fired when data is requested after binding. The event is fired if the binding for the table is done by the SmartTable
				 * itself.
				 *
				 * @since 1.52.0
				 * @deprecated Since 1.56. Use <code>beforeRebindTable</code> event to attach/listen to the binding "events" directly
				 */
				dataRequested: {},

				/**
				 * This event is fired when data is received after binding. The event is fired if the binding for the table is done by the SmartTable
				 * itself.
				 *
				 * @since 1.28.0
				 * @deprecated Since 1.56. Use <code>beforeRebindTable</code> event to attach/listen to the binding "events" directly
				 */
				dataReceived: {},

				/**
				 * This event is fired after variant management in the SmartTable has been initialized.
				 *
				 * @since 1.28.0
				 */
				afterVariantInitialise: {},

				/**
				 * This event is fired after a variant has been saved. This event can be used to retrieve the ID of the saved variant.
				 *
				 * @since 1.28.0
				 */
				afterVariantSave: {
					parameters: {
						/**
						 * ID of the currently selected variant
						 */
						currentVariantId: {
							type: "string"
						}
					}
				},

				/**
				 * This event is fired after a variant has been applied.
				 *
				 * @since 1.28.0
				 */
				afterVariantApply: {
					parameters: {
						/**
						 * ID of the currently selected variant
						 */
						currentVariantId: {
							type: "string"
						}
					}
				},

				/**
				 * This event is fired just before the overlay is being shown.
				 *
				 * @name sap.ui.comp.smarttable.SmartTable#showOverlay
				 * @event
				 * @param {sap.ui.base.Event} oControlEvent
				 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
				 * @param {object} oControlEvent.getParameters
				 * @param {object} oControlEvent.getParameters.overlay The overlay object contains information related to the table's overlay
				 * @param {boolean} oControlEvent.getParameters.overlay.show If set to <code>false</code> by the listener, overlay is not shown
				 * @since 1.32.0
				 * @public
				 */
				showOverlay: {},

				/**
				 * This event is fired when an editable field, created internally by the SmartTable control, is changed.
				 *
				 * @since 1.34.0
				 */
				fieldChange: {},

				/**
				 * This event is fired right after the full screen mode of the SmartTable control has been changed.
				 *
				 * @since 1.46
				 */
				fullScreenToggled: {
					parameters: {
						/**
						 * If <code>true</code>, control is in full screen mode
						 */
						fullScreen: {
							type: "boolean"
						}
					}
				},
				/**
				 * This event is fired just before export is triggered.
				 *
				 * @since 1.50
				 * @public
				 */
				beforeExport: {
					parameters: {
						/**
						 * Contains workbook.columns, dataSource and other export-related information
						 */
						exportSettings: {
							type: "object"
						},
						/**
						 * Contains the export settings defined by the user
						 */
						userExportSettings: {
							type: "object"
						}
					}
				},
				/**
				 * This event is fired just before the paste event is triggered and can be used to prevent the default paste behavior.
				 *
				 * @experimental since 1.64. This API is experimental and subject to change
				 */
				beforePaste: {
					allowPreventDefault: true,
					parameters: {
						/**
						 * Contains array of column info object as determined by the SmartTable
						 */
						columnInfos: {
							type: "object[]"
						}
					}
				},
				/**
				 * This event is fired when paste is triggered.
				 *
				 * @experimental since 1.64. This API is experimental and subject to change
				 */
				paste: {

					parameters: {
						/**
						 * Contains parsed/validated paste information returned by PasteHelper.parse API
						 */
						result: {
							type: "object"
						}
					}
				}
			}
		},
		renderer: {
			apiVersion: 2
		},
		constructor: function() {
			VBox.apply(this, arguments);
			this._aExistingColumns = [];
			this._aAlwaysSelect = [];
			this._oTemplate = null;
			this._mFieldMetadataByKey = {};
			this._createToolbar();
			// Check and parse the p13nDialog settings custom data
			this._oP13nDialogSettings = this.data("p13nDialogSettings");
			if (typeof this._oP13nDialogSettings === "string") {
				try {
					this._oP13nDialogSettings = JSON.parse(this._oP13nDialogSettings);
				} catch (e) {
					this._oP13nDialogSettings = null;
					// Invalid JSON!
				}
			}
			this._bIsFilterPanelEnabled = (this._oP13nDialogSettings && this._oP13nDialogSettings.filter) ? this._oP13nDialogSettings.filter.visible !== false : true;
			this._createTable();
			this.attachModelContextChange(this._initialiseMetadata, this);
		}
	});

	// **
	// * This file defines behaviour for the control,
	// */
	SmartTable.prototype.init = function() {
		VBox.prototype.init.call(this);
		this.addStyleClass("sapUiCompSmartTable");
		this.setFitContainer(true);
		this._aColumnKeys = [];
		this._aDeactivatedColumns = [];
		this._mLazyColumnMap = {};
	};

	SmartTable.prototype._getVariantManagementControl = function(oSmartVariantId) {
		var oSmartVariantControl = null;
		if (oSmartVariantId) {
			if (typeof oSmartVariantId === 'string') {
				oSmartVariantControl = Core.byId(oSmartVariantId);
			} else {
				oSmartVariantControl = oSmartVariantId;
			}

			if (oSmartVariantControl) {
				if (!(oSmartVariantControl instanceof SmartVariantManagement)) {
					Log.error("Control with the id=" + oSmartVariantId.getId ? oSmartVariantId.getId() : oSmartVariantId + " not of expected type");
					return null;
				}
			}
		}

		return oSmartVariantControl;
	};

	/**
	 * instantiates the SmartVariantManagementControl
	 *
	 * @private
	 */
	SmartTable.prototype._createVariantManagementControl = function() {

		// Do not create variant management when it is not needed!
		if (this._oVariantManagement || (!this.getUseVariantManagement() && !this.getUseTablePersonalisation()) || !this.getPersistencyKey()) {
			return;
		}

		// always create VariantManagementControl, in case it is not used, it will take care of persisting the personalisation
		// without visualization
		var oPersInfo = new PersonalizableInfo({
			type: "table",
			keyName: "persistencyKey",
			dataSource: "TODO"
		});

		oPersInfo.setControl(this);

		var sSmartVariantId = this.getSmartVariant();
		if (sSmartVariantId) {
			this._oVariantManagement = this._getVariantManagementControl(sSmartVariantId);
		} else if (this._oSmartFilter && this._oSmartFilter.data("pageVariantPersistencyKey")) {
			sSmartVariantId = this._oSmartFilter.getSmartVariant();
			if (sSmartVariantId) {
				this._oVariantManagement = this._getVariantManagementControl(sSmartVariantId);
			}
		} else {
			this._oVariantManagement = new SmartVariantManagement(this.getId() + "-variant", {
				showShare: true
			});
		}

		if (this._oVariantManagement) {
			this._oVariantManagement.addPersonalizableControl(oPersInfo);

			// Current variant could have been set already (before initialise) by the SmartVariant, in case of GLO/Industry specific variant
			// handling
			this._oVariantManagement.attachSave(this._variantSaved, this);
			this._oVariantManagement.attachAfterSave(this._variantAfterSave, this);

			this._oVariantManagement.initialise(this._variantInitialised, this);
		}

	};

	SmartTable.prototype._variantInitialised = function() {
		if (!this._oCurrentVariant) {
			this._oCurrentVariant = "STANDARD";
		}
		this.fireAfterVariantInitialise();
		/*
		 * If VariantManagement is disabled (no LRep connectivity) trigger the binding
		 */
		if (this._oVariantManagement && !this._oVariantManagement.getEnabled()) {
			this._checkAndTriggerBinding();
		}
	};

	SmartTable.prototype._variantSaved = function() {
		if (this._oPersController) {
			this._oPersController.setPersonalizationData(this._oCurrentVariant, true);
		}
	};

	SmartTable.prototype._variantAfterSave = function() {
		this.fireAfterVariantSave({
			currentVariantId: this.getCurrentVariantId()
		});
	};

	SmartTable.prototype.setTableBindingPath = function(sPath) {
		// only to prevent invalidation!
		this.setProperty("tableBindingPath", sPath, true);
		return this;
	};

	SmartTable.prototype.setShowTablePersonalisation = function(bShowTablePersonalisation) {
		this.setProperty("showTablePersonalisation", bShowTablePersonalisation, true);
		if (this._oTablePersonalisationButton) {
			this._oTablePersonalisationButton.setVisible(bShowTablePersonalisation);
		}
		return this;
	};

	SmartTable.prototype.setUseVariantManagement = function(bUseVariantManagement) {
		this.setProperty("useVariantManagement", bUseVariantManagement, true);
		if (this._oPersController) {
			this._oPersController.setResetToInitialTableState(!bUseVariantManagement);
		}
		return this;
	};

	SmartTable.prototype.setShowVariantManagement = function(bShowVariantManagement) {
		this.setProperty("showVariantManagement", bShowVariantManagement, true);
		if (this._oVariantManagement && !this._oVariantManagement.isPageVariant()) {
			this._oVariantManagement.setVisible(bShowVariantManagement);
			// Hide ToolbarSeparator if VariantManagement button is hidden.
			if (this._oSeparator) {
				this._oSeparator.setVisible(bShowVariantManagement);
			}
		}
		return this;
	};

	SmartTable.prototype.setToolbarStyleClass = function(sStyleClass) {
		this.setProperty("toolbarStyleClass", sStyleClass, true);
		return this;
	};

	SmartTable.prototype.setCustomToolbar = function(oCustomToolbar) {
		this._oCustomToolbar = oCustomToolbar;
		return this;
	};

	SmartTable.prototype.getCustomToolbar = function() {
		return this._oCustomToolbar;
	};

	SmartTable.prototype.setHeader = function(sText) {
		var sOldText = this.getProperty("header"), bPreventUpdateContent;
		this.setProperty("header", sText, true);
		if (this.bIsInitialised && this._oToolbar) {
			// Update Toolbar content to show/hide separator only if text changes from empty to some value -or- from some value to empty
			// else there could be a re-render triggered on the inner table!
			bPreventUpdateContent = (!sOldText === !sText);
			if (!bPreventUpdateContent) {
				this._createToolbarContent();
			} else {
				this._refreshHeaderText();
			}
		}
		return this;
	};

	SmartTable.prototype.setShowRowCount = function(bShow) {
		this.setProperty("showRowCount", bShow, true);
		this._refreshHeaderText();
		return this;
	};

	SmartTable.prototype.setEditable = function(bEdit) {
		this.setProperty("editable", bEdit, true);
		// Update local EditModel's property
		if (this._oEditModel) {
			this._oEditModel.setProperty("/editable", bEdit);
		}
		if (this._oEditButton) {
			this._oEditButton.setIcon(bEdit ? "sap-icon://display" : "sap-icon://edit");
		}
		// update keyboard handling for sap.m.Table
		if (this._isMobileTable && this._oTable.setKeyboardMode) {
			this._oTable.setKeyboardMode(bEdit ? "Edit" : "Navigation");
		}
		return this;
	};

	SmartTable.prototype.setDemandPopin = function(bDemandPopin) {
		var bOldValue = this.getDemandPopin();
		if (bOldValue === bDemandPopin) {
			return this;
		}

		this.setProperty("demandPopin", bDemandPopin, true);

		if (this.bIsInitialised) {
			if (bDemandPopin) {
				this._updateColumnsPopinFeature();
			} else {
				this._deactivateColumnsPopinFeature();
			}
		}
		return this;
	};

	/**
	 * sets the header text
	 *
	 * @private
	 */
	SmartTable.prototype._refreshHeaderText = function() {
		if (!this._headerText) {
			return;
		}

		if (!this._oNumberFormatInstance) {
			this._oNumberFormatInstance = NumberFormat.getFloatInstance();
		}

		var sText = this.getHeader();
		this._headerText.setVisible(!!sText);
		if (this.getShowRowCount()) {
			var iRowCount = parseInt(this._getRowCount(true));
			var sValue = this._oNumberFormatInstance.format(iRowCount);

			sText += " (" + sValue + ")";
		}

		this._headerText.setText(sText);
	};

	/**
	 * creates the fullscreen button and adds it into toolbar
	 */
	SmartTable.prototype._addFullScreenButton = function() {
		// always remove content first
		if (this._oFullScreenButton) {
			this._oToolbar.removeContent(this._oFullScreenButton);
		}
		if (this.getShowFullScreenButton()) {
			if (!this._oFullScreenButton) {
				this._oFullScreenButton = new OverflowToolbarButton(this.getId() + "-btnFullScreen", {
					press: [
						function() {
							this._toggleFullScreen(!this.bFullScreen);
						}, this
					]
				});
			}
			this._renderFullScreenButton();
			this._oToolbar.addContent(this._oFullScreenButton);
		}
	};
	/**
	 * creates the toolbar
	 *
	 * @private
	 */
	SmartTable.prototype._createToolbar = function() {
		var oCustomToolbar = null;
		if (!this._oToolbar) {
			oCustomToolbar = this.getCustomToolbar();
			if (oCustomToolbar) {
				this._oToolbar = oCustomToolbar;
			} else {
				this._oToolbar = new OverflowToolbar({
					design: ToolbarDesign.Transparent
				});
				this._oToolbar.addStyleClass("sapUiCompSmartTableToolbar");
				if (this.getToolbarStyleClass()) {
					this._oToolbar.addStyleClass(this.getToolbarStyleClass());
				}
			}
			this._oToolbar.setLayoutData(new FlexItemData({
				shrinkFactor: 0
			}));
		}
	};

	/**
	 * Toggles between fullscreen and normal view mode
	 *
	 * @param {boolean} bValue - the new value of FullScreen
	 * @param {boolean} bForced - whether setting FullScreen is forced
	 * @private
	 */
	SmartTable.prototype._toggleFullScreen = function(bValue, bForced) {
		if (!this._oFullScreenButton || (bValue === this.bFullScreen && !bForced)) {
			return;
		}

		this.bFullScreen = bValue;

		FullScreenUtil.toggleFullScreen(this, this.bFullScreen, this._oFullScreenButton, this._toggleFullScreen);

		this._renderFullScreenButton();
		// Fire the fullScreen Event
		this.fireFullScreenToggled({
			fullScreen: bValue
		});
	};

	/**
	 * Renders the look and feel of the full screen button
	 */
	SmartTable.prototype._renderFullScreenButton = function() {
		var resourceB = Core.getLibraryResourceBundle("sap.ui.comp"), sText;

		sText = this.bFullScreen ? resourceB.getText("CHART_MINIMIZEBTN_TOOLTIP") : resourceB.getText("CHART_MAXIMIZEBTN_TOOLTIP");
		this._oFullScreenButton.setTooltip(sText);
		this._oFullScreenButton.setText(sText);
		this._oFullScreenButton.setIcon(this.bFullScreen ? "sap-icon://exit-full-screen" : "sap-icon://full-screen");
	};

	/**
	 * creates the toolbar content
	 *
	 * @private
	 */
	SmartTable.prototype._createToolbarContent = function() {
		if (!this._oToolbar) {
			this._createToolbar();
		}

		// insert the items in the custom toolbar in reverse order => insert always at position 0
		this._addVariantManagementToToolbar();
		this._addSeparatorToToolbar();
		this._addHeaderToToolbar();

		// add spacer to toolbar
		this._addSpacerToToolbar();

		// First show Display/Edit icon, then Personalisation and finally Excel Export
		this._addEditTogglableToToolbar();
		this._addTablePersonalisationToToolbar();
		this._addExportToExcelToToolbar();
		this._addFullScreenButton();

		this._bToolbarInsertedIntoItems = true;
		this._placeToolbar();
	};

	/**
	 * Places the toolbar in the right place
	 */
	SmartTable.prototype._placeToolbar = function() {
		if (!this.getPlaceToolbarInTable()) {
			this.insertItem(this._oToolbar, 0);
		} else if (this._isMobileTable) {
			this._oTable.setHeaderToolbar(this._oToolbar);
		} else {
			this._oTable.addExtension(this._oToolbar);
		}
	};

	/**
	 * Returns the <code>Toolbar</code> instance used inside the <code>SmartTable</code> control.
	 *
	 * @returns {sap.m.Toolbar} The <code>Toolbar</code> instance
	 * @since 1.56
	 * @public
	 */
	SmartTable.prototype.getToolbar = function() {
		return this._oToolbar;
	};

	/**
	 * Adds the button to change between edit and read only mode
	 *
	 * @private
	 */
	SmartTable.prototype._addEditTogglableToToolbar = function() {
		var sButtonLabel;
		// always remove content first
		if (this._oEditButton) {
			this._oToolbar.removeContent(this._oEditButton);
		}
		if (this.getEditTogglable()) {
			if (!this._oEditButton) {
				sButtonLabel = Core.getLibraryResourceBundle("sap.ui.comp").getText("TABLE_EDITTOGGLE_TOOLTIP");
				this._oEditButton = new OverflowToolbarButton(this.getId() + "-btnEditToggle", {
					icon: this.getEditable() ? "sap-icon://display" : "sap-icon://edit",
					text: sButtonLabel,
					tooltip: sButtonLabel,
					press: [
						function() {
							var bEditable = this.getEditable();
							// toggle property editable and set it on the smart table
							bEditable = !bEditable;
							this.setEditable(bEditable, true);
							// notify any listeners
							this.fireEditToggled({
								editable: bEditable
							});
						}, this
					]
				});
			}
			this._oToolbar.addContent(this._oEditButton);
		}
	};

	/**
	 * adds the header line to the toolbar
	 *
	 * @private
	 */
	SmartTable.prototype._addHeaderToToolbar = function() {
		// always remove content first
		if (this._headerText) {
			this._oToolbar.removeContent(this._headerText);
		}

		if (!this._headerText) {
			this._headerText = new Title(this.getId() + "-header");
			this._headerText.addStyleClass("sapMH4Style");
			this._headerText.addStyleClass("sapUiCompSmartTableHeader");
		}

		this._refreshHeaderText();
		this._oToolbar.insertContent(this._headerText, 0);
	};

	/**
	 * adds a separator between header and variantmanagement to the toolbar
	 *
	 * @private
	 */
	SmartTable.prototype._addSeparatorToToolbar = function() {
		// always remove content first
		if (this._oSeparator) {
			this._oToolbar.removeContent(this._oSeparator);
		}
		if (this.getHeader() && this.getUseVariantManagement() && this._oVariantManagement && !this._oVariantManagement.isPageVariant()) {
			if (!this._oSeparator) {
				this._oSeparator = new ToolbarSeparator(this.getId() + "-toolbarSeperator");
				// Hide ToolbarSeparator if VariantManagement button is hidden
				if (!this.getShowVariantManagement()) {
					this._oSeparator.setVisible(false);
				}
			}
			this._oToolbar.insertContent(this._oSeparator, 0);
		}

		if (this._oToolbar) {
			this._oToolbar.addStyleClass("sapMTBHeader-CTX");
		}
	};

	/**
	 * adds the VarientManagement to the toolbar
	 *
	 * @private
	 */
	SmartTable.prototype._addVariantManagementToToolbar = function() {
		if (this._oVariantManagement && !this._oVariantManagement.isPageVariant()) {
			// always remove content first
			this._oToolbar.removeContent(this._oVariantManagement);
			if (this.getUseVariantManagement()) {
				this._oToolbar.insertContent(this._oVariantManagement, 0);
				if (!this._oVariantManagement.isPageVariant()) {
					this._oVariantManagement.setVisible(this.getShowVariantManagement());
				}
			}
		}
	};

	/**
	 * adds a spacer to the toolbar
	 *
	 * @private
	 */
	SmartTable.prototype._addSpacerToToolbar = function() {
		var bFoundSpacer = false, aItems = this._oToolbar.getContent(), i, iLength;
		if (aItems) {
			iLength = aItems.length;
			i = 0;
			for (i; i < iLength; i++) {
				if (aItems[i] instanceof ToolbarSpacer) {
					bFoundSpacer = true;
					break;
				}
			}
		}

		if (!bFoundSpacer) {
			this._oToolbar.addContent(new ToolbarSpacer(this.getId() + "-toolbarSpacer"));
		}
	};

	/**
	 * adds the Table Personalisation button to the toolbar
	 *
	 * @private
	 */
	SmartTable.prototype._addTablePersonalisationToToolbar = function() {
		var sButtonLabel;
		// always remove content first
		if (this._oTablePersonalisationButton) {
			this._oToolbar.removeContent(this._oTablePersonalisationButton);
		}
		if (this.getUseTablePersonalisation()) {
			if (!this._oTablePersonalisationButton) {
				sButtonLabel = Core.getLibraryResourceBundle("sap.ui.comp").getText("TABLE_PERSOBTN_TOOLTIP");
				this._oTablePersonalisationButton = new OverflowToolbarButton(this.getId() + "-btnPersonalisation", {
					icon: "sap-icon://action-settings",
					text: sButtonLabel,
					tooltip: sButtonLabel,
					press: [
						function(oEvent) {
							this._oPersController.openDialog();
						}, this
					]
				});
				this._oTablePersonalisationButton.setVisible(this.getShowTablePersonalisation());
			}
			this._oToolbar.addContent(this._oTablePersonalisationButton);
		}
	};

	/**
	 * Trigger export using Gateway service.
	 *
	 * @private
	 */
	SmartTable.prototype._triggerGWExport = function() {
		var oResourceBundle = Core.getLibraryResourceBundle("sap.ui.comp");
		var fDownloadXls = function() {
			var oRowBinding = this._getRowBinding();
			var sUrl = oRowBinding.getDownloadUrl("xlsx");
			sUrl = this._removeExpandParameter(sUrl);
			// check for length of URL -> URLs longer than 2048 chars aren't supported in some browsers (e.g. Internet Explorer)
			if (sUrl && sUrl.length > 2048 && Device.browser.msie) {
				// thrown info to user!
				MessageBox.error(oResourceBundle.getText("DOWNLOAD_TOO_COMPLEX_TEXT"));
				return;
			}
			var mExportSettings = {
				url: sUrl
			};
			// Fire event to enable export url manipulation
			this.fireBeforeExport({
				exportSettings: mExportSettings
			});
			window.open(mExportSettings.url);
		}.bind(this);

		var iRowCount = this._getRowCount(true);

		if (iRowCount > 10000) {
			MessageBox.confirm(oResourceBundle.getText("DOWNLOAD_CONFIRMATION_TEXT", iRowCount), {
				actions: [
					MessageBox.Action.YES, MessageBox.Action.NO
				],
				onClose: function(oAction) {
					if (oAction === MessageBox.Action.YES) {
						fDownloadXls();
					}
				}
			});
		} else {
			fDownloadXls();
		}
	};

	/**
	 * Adds the Export to Excel button to the toolbar
	 *
	 * @private
	 */
	SmartTable.prototype._addExportToExcelToToolbar = function() {
		// always remove content first
		if (this._oUseExportToExcel) {
			this._oToolbar.removeContent(this._oUseExportToExcel);
		}

		if (!this.getUseExportToExcel()) {
			return;
		}

		if (!this._oUseExportToExcel) {
			var sButtonId = this.getId() + "-btnExcelExport";
			var sIconUrl = "sap-icon://excel-attachment";
			var oResourceBundle = Core.getLibraryResourceBundle("sap.ui.comp");

			if (this.getExportType() === "UI5Client") {
				this._oUseExportToExcel = this._createClientExportButton(sButtonId, sIconUrl);
			}

			if (this._bTableSupportsExcelExport && this.getExportType() === "GW") {
				var sButtonLabel;

				sButtonLabel = oResourceBundle.getText("TABLE_EXPORT_TEXT");

				this._oUseExportToExcel = new OverflowToolbarButton(sButtonId, {
					icon: sIconUrl,
					text: sButtonLabel,
					tooltip: sButtonLabel,
					press: [
						this._triggerGWExport, this
					]
				});
			}
			this._setExcelExportEnableState();
		}
		this._oToolbar.addContent(this._oUseExportToExcel);
	};

	SmartTable.prototype._openExportSettings = function() {
		var that = this;

		this._loadExportLibrary().then(function() {
			sap.ui.require(['sap/ui/export/ExportUtils'], function(ExportUtils) {
				ExportUtils.getExportSettingsViaDialog(that._cachedExcelSettings, that).then(function(oUserInput) {
					that._cachedExcelSettings = oUserInput;
					that._triggerUI5ClientExport(oUserInput);
				});
			});
		});
	};

	/**
	 * This function creates a menuButton that provides the export
	 * functionality in the SmartTable.
	 *
	 * *** IMPORTANT ***
	 * All changes to this method need to be in sync with the
	 * corresponding functionality in the sap.ui.mdc.Table
	 *
	 * @param {string} sButtonId - The ID that gets applied to the button
	 * @param {string} sIconUrl -
	 * @return {sap.m.MenuButton} - MenuButton that provides the export functionality
	 * @private
	 */
	SmartTable.prototype._createClientExportButton = function(sButtonId, sIconUrl) {
		var oResourceBundle = Core.getLibraryResourceBundle("sap.ui.comp");
		var mDefaultExportSettings = { fileName: this.getHeader() };

		if (!this._cachedExcelSettings) {
			this._cachedExcelSettings = mDefaultExportSettings;
		}

		return new MenuButton(sButtonId, {
			icon: sIconUrl,
			tooltip: oResourceBundle.getText("TABLE_EXPORT_TEXT"),
			type: ButtonType.Ghost,
			buttonMode: MenuButtonMode.Split,
			useDefaultActionOnly: true,
			defaultAction: [
				function() {
					this._triggerUI5ClientExport(mDefaultExportSettings);
				}, this
			],
			menu: [
				new Menu({
					items: [
						new MenuItem({
							text: oResourceBundle.getText("QUICK_EXPORT"),
							press: [
								function() {
									this._triggerUI5ClientExport(mDefaultExportSettings);
								}, this
							]
						}),
						new MenuItem({
							text: oResourceBundle.getText("EXPORT_WITH_SETTINGS"),
							press: [
								this._openExportSettings,
								this
							]
						})
					]
				})
			]
		});
	};

	SmartTable.prototype.onkeydown = function(oEvent) {
		if (oEvent.isMarked()) {
			return;
		}

		if ((oEvent.metaKey || oEvent.ctrlKey) && oEvent.shiftKey && oEvent.which === KeyCodes.E) {
			// CTRL (or Cmd) + SHIFT + E key combination to open the Export settings dialog
			if (this.getUseExportToExcel() && this.getExportType() === "UI5Client" && this._oUseExportToExcel && this._oUseExportToExcel.getEnabled()) {
				this._openExportSettings();
				// Mark the event to ensure that parent handlers (e.g. FLP) can skip their processing if needed. Also prevent potential browser defaults.
				oEvent.setMarked();
				oEvent.preventDefault();
			}
		} else if ((oEvent.metaKey || oEvent.ctrlKey) && oEvent.which === KeyCodes.COMMA) {
			// CTRL (or Cmd) + COMMA key combination to open the table personalisation dialog
			if (this.getUseTablePersonalisation() && this._oTablePersonalisationButton && this._oTablePersonalisationButton.getVisible()) {
				this._oPersController.openDialog();
				// Mark the event to ensure that parent handlers (e.g. FLP) can skip their processing if needed. Also prevent potential browser defaults
				// (e.g. Cmd+, opens browser settings on Mac).
				oEvent.setMarked();
				oEvent.preventDefault();
			}
		}
	};

	/**
	 * Returns promise after loading the export library. The Promise
	 * will be resolved with a reference to the export library.
	 *
	 * @returns {Promise} export library promise
	 * @private
	 */
	SmartTable.prototype._loadExportLibrary = function() {
		if (!this._oExportLibLoadPromise) {
			this._oExportLibLoadPromise = Core.loadLibrary("sap.ui.export", true);
		}
		return this._oExportLibLoadPromise;
	};

	/**
	 * Returns the label/header text of the column
	 *
	 * @param {Object|string} oColumn column object or column key
	 * @returns {string|null} column label/header text. Returns null if no column or header/label text is available.
	 * @private
	 */
	SmartTable.prototype._getColumnLabel = function(oColumn) {
		var oLabel;

		if (typeof oColumn === 'string') {
			oColumn = this._getColumnByKey(oColumn);
		}

		if (!oColumn) {
			return null;
		}

		if (oColumn.getLabel) {
			oLabel = oColumn.getLabel();
		}

		if (oColumn.getHeader) {
			oLabel = oColumn.getHeader();
		}

		return (oLabel && oLabel.getText) ? oLabel.getText() : null;
	};

	/**
	 * Returns the column width as number
	 *
	 * @param {String} sWidth column width as a string
	 * @returns {Number} width of the column as number
	 * @private
	 */
	SmartTable.prototype._getColumnWidthNumber = function(sWidth) {
		if (sWidth.indexOf("em") > 0) {
			return Math.round(parseFloat(sWidth));
		}
		if (sWidth.indexOf("px") > 0) {
			return Math.round(parseInt(sWidth) / 16);
		}
		return "";
	};

	/**
	 * Triggers export via "sap.ui.export"/"Document Export Services" export functionality
	 *
	 * @param {Object} mCustomConfig Custom config for the spreadsheet export
	 * @private
	 */
	SmartTable.prototype._triggerUI5ClientExport = function(mCustomConfig) {
		var aSheetColumns = this._createExportColumnConfiguration(mCustomConfig);

		// If no columns exist, show message and return without exporting
		if (!aSheetColumns || !aSheetColumns.length) {
			MessageBox.error(Core.getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_NO_COLS_EXPORT"), {
				styleClass: (this.$() && this.$().closest(".sapUiSizeCompact").length) ? "sapUiSizeCompact" : ""
			});
			return;
		}

		var oRowBinding = this._getRowBinding();
		var fnGetColumnLabel = this._getColumnLabel.bind(this);
		var mExportSettings = {
			workbook: {
				columns: aSheetColumns,
				hierarchyLevel: (this._isTreeTable && oRowBinding.getTreeAnnotation) ? oRowBinding.getTreeAnnotation("hierarchy-level-for") : undefined
			},
			dataSource: oRowBinding,
			fileName: mCustomConfig ? mCustomConfig.fileName : this.getHeader()
		};

		this._loadExportLibrary().then(function() {
			sap.ui.require(['sap/ui/export/ExportUtils', 'sap/ui/export/Spreadsheet'], function(ExportUtils, Spreadsheet) {
				var oProcessor = Promise.resolve();

				if (mCustomConfig.includeFilterSettings) {
					oProcessor = ExportUtils.parseFilterConfiguration(oRowBinding, fnGetColumnLabel)
						.then(function(oFilterConfig) {
							if (mCustomConfig.includeFilterSettings && oFilterConfig) {
								mExportSettings.workbook.context = {
									metaSheetName: oFilterConfig.name,
									metainfo: [
										oFilterConfig
									]
								};
							}
						});
				}

				oProcessor.then(function() {
					var mUserSettings = {
						splitCells: false,
						includeFilterSettings: false
					};

					if (mCustomConfig) {
						mUserSettings.splitCells = mCustomConfig.splitCells;
						mUserSettings.includeFilterSettings = mCustomConfig.includeFilterSettings;
					}

					var oSheet = new Spreadsheet(mExportSettings);
					oSheet.attachBeforeExport(function(oEvent) {
						this.fireBeforeExport({
							exportSettings: oEvent.getParameter('exportSettings'),
							userExportSettings: mUserSettings
						});
					}, this);

					// Replace Promise.finally with Promise.then to avoid Eclipse IDE formatting issue
					var fAfterSheetBuild = function() {
						oSheet.destroy();
					};
					oSheet.build().then(fAfterSheetBuild, fAfterSheetBuild);
				}.bind(this));
			}.bind(this));
		}.bind(this));
	};

	SmartTable.prototype._createExportColumnConfiguration = function(mCustomConfig) {
		var aColumns, i, iLen, oColumn, oColumnData, sLabel, sPath, sTemplate, sAdditionalPath, oAdditionalColumn, sSplitLabel, oAdditionalProperty, sHAlign, nWidth, sType, inputFormat, oType, aSheetColumns = [];
		var bSplitCells = mCustomConfig && mCustomConfig.splitCells;

		// The parameter will be ignored in case of sap.ui.table.Table and ensures the correct order in case of sap.m.Table
		aColumns = this._isMobileTable ? this._oTable.getColumns(true) : this._oTable.getColumns();
		iLen = aColumns.length;

		for (i = 0; i < iLen; i++) {
			sPath = null;
			sTemplate = null;
			sAdditionalPath = null;
			oColumn = aColumns[i];
			if (oColumn.getVisible()) {
				if (oColumn.getLeadingProperty) {
					sPath = oColumn.getLeadingProperty();
				}
				oColumnData = oColumn.data("p13nData");
				if (!sPath && oColumnData) {
					sPath = oColumnData["leadingProperty"];
				}
				if (Array.isArray(sPath)) {
					sPath = sPath[0];
				}
				if (sPath) {
					sLabel = this._getColumnLabel(oColumn);
					nWidth = oColumn.getWidth().toLowerCase() || oColumnData.width || "";
					nWidth = this._getColumnWidthNumber(nWidth);
					sType = oColumnData.type === "numeric" ? "number" : oColumnData.type;
					oType = null;
					inputFormat = null;
					if (oColumnData.unit) {
						sType = oColumnData.isCurrency ? "currency" : "number";
						if (bSplitCells) {
							sAdditionalPath = oColumnData.unit;
						}
					} else if (sType != "date" && ODataType.isDateOrTime(oColumnData.edmType)) {
						// set type as expected by excel for OData specific Date/Time fields
						sType = ODataType.getTypeName(oColumnData.edmType);
						if (sType === "DateTimeOffset") {
							sType = "DateTime";
						}
					} else if (sType === "stringdate") {
						sType = "date";
						inputFormat = "YYYYMMDD";
					} else if (sType === "boolean") {
						oType = ODataType.getType(oColumnData.edmType);
					} else if (oColumnData.description) { // check this after unit/date as at times unit, date other fields too might have a description (BCP: 0020751294 0000453653 2018)
						// Exception is for numeric fields, where we now support description handling (BCP: 1970521945)
						sType = "string";
						if (bSplitCells && oColumnData.displayBehaviour !== "idOnly") {
							sAdditionalPath = oColumnData.description;
						} else {
							sTemplate = FormatUtil.getFormattedExpressionFromDisplayBehaviour(oColumnData.displayBehaviour, "{0}", "{1}");
						}
					} else if (oColumnData.isDigitSequence) {
						sType = "number";
					}
					aSheetColumns.push({
						columnId: oColumn.getId(),
						property: sTemplate ? [
							sPath, oColumnData.description
						] : sPath,
						type: sType,
						inputFormat: inputFormat,
						label: sLabel ? sLabel : sPath,
						width: nWidth,
						textAlign: oColumn.getHAlign(),
						template: sTemplate,
						trueValue: (sType === "boolean" && oType) ? oType.formatValue(true, "string") : undefined,
						falseValue: (sType === "boolean" && oType) ? oType.formatValue(false, "string") : undefined,
						unitProperty: (sType === "currency" || (sType === "number" && !bSplitCells)) ? oColumnData.unit : undefined,
						displayUnit: sType === "currency" && !bSplitCells,
						precision: oColumnData.precision,
						scale: oColumnData.scale
					});

					if (sAdditionalPath) {
						oAdditionalColumn = this._getColumnByKey(sAdditionalPath);
						sSplitLabel = sLabel;
						sLabel = null;
						if (oAdditionalColumn) {
							sLabel = this._getColumnLabel(oAdditionalColumn);
							nWidth = oAdditionalColumn.getWidth().toLowerCase() || "";
							nWidth = this._getColumnWidthNumber(nWidth);
							sHAlign = oAdditionalColumn.getHAlign();
						} else {
							oAdditionalProperty = this._mFieldMetadataByKey[sAdditionalPath];
							if (oAdditionalProperty) {
								sLabel = oAdditionalProperty.label;
								nWidth = oAdditionalProperty.width;
							}
						}

						aSheetColumns.push({
							columnId: oColumn.getId() + "-additionalProperty",
							property: sAdditionalPath,
							type: "string",
							label: sLabel || (sSplitLabel ? sSplitLabel + " (2)" : sAdditionalPath),
							width: nWidth,
							textAlign: sHAlign
						});
					}
				}
			}
		}

		return aSheetColumns;
	};

	/**
	 * removes the given Url's expand parameter
	 *
	 * @param {string} sUrl the original url
	 * @private
	 * @returns {string} the resolved url string
	 */
	SmartTable.prototype._removeExpandParameter = function(sUrl) {
		var sFinalUrl = sUrl.replace(new RegExp("([\\?&]\\$expand=[^&]+)(&?)"), function(result, match1, match2) {
			return match2 ? match1.substring(0, 1) : "";
		});
		return sFinalUrl;
	};

	/**
	 * gets table's row count
	 *
	 * @param {boolean} bConsiderTotal whether to consider total
	 * @private
	 * @returns {int} the row count
	 */
	SmartTable.prototype._getRowCount = function(bConsiderTotal) {
		var oRowBinding = this._getRowBinding();

		if (!oRowBinding) {
			return 0;
		}

		var iRowCount = 0;
		if (bConsiderTotal && oRowBinding.getTotalSize) {
			iRowCount = oRowBinding.getTotalSize();
		} else {
			iRowCount = oRowBinding.getLength();
		}

		if (iRowCount < 0 || iRowCount === "0") {
			iRowCount = 0;
		}

		return iRowCount;
	};

	/**
	 * disables the export to excel button if no data is present, otherwise enables it
	 *
	 * @private
	 */
	SmartTable.prototype._setExcelExportEnableState = function() {
		if (this._oUseExportToExcel) {
			var iRowCount = this._getRowCount();
			this._oUseExportToExcel.setEnabled(iRowCount > 0);
		}
	};

	/**
	 * creates the personalization controller if not yet done
	 *
	 * @private
	 */
	SmartTable.prototype._createPersonalizationController = function() {
		if (this._oPersController || !this.getUseTablePersonalisation()) {
			return;
		}

		var oSettings = this._oP13nDialogSettings;

		oSettings = this._setIgnoreFromPersonalisationToSettings(oSettings);

		if (this._isTreeTable) {
			//The first column of the TreeTable should never be visible in p13n, as the reordering/toggling makes no sense
			oSettings = oSettings || {};
			oSettings.stableColumnKeys = [];
			oSettings.stableColumnKeys.push(this._aColumnKeys[0]);
		}

		this._oPersController = new Controller(this.getId() + "-persoController", {
			table: this._oTable,
			columnKeys: this._aColumnKeys,
			setting: oSettings,
			resetToInitialTableState: !this.getUseVariantManagement(),
			beforePotentialTableChange: [
				this._beforePersonalisationModelDataChange, this
			],
			afterPotentialTableChange: [
				this._afterPersonalisationModelDataChange, this
			],
			afterP13nModelDataChange: [
				this._personalisationModelDataChange, this
			],
			requestColumns: [
				this._personalisationRequestColumns, this
			]
		});
	};

	/**
	 * adds the ignoreFromPersonalisation fields to the given setting
	 *
	 * @param {object} oSettings the former settings object
	 * @private
	 * @returns {object} the changed settings object
	 */
	SmartTable.prototype._setIgnoreFromPersonalisationToSettings = function(oSettings) {
		var aIgnoreFields = PersonalizationUtil.createArrayFromString(this.getIgnoreFromPersonalisation());
		if (aIgnoreFields.length) {
			if (!oSettings) {
				oSettings = {};
			}

			var fSetArray = function(sSubName) {
				if (!oSettings[sSubName]) {
					oSettings[sSubName] = {};
				}
				oSettings[sSubName].ignoreColumnKeys = aIgnoreFields;
			};

			fSetArray("filter");
			fSetArray("sort");
			fSetArray("group");
			fSetArray("columns");
		}
		return oSettings;
	};

	/**
	 * returns the row/items binding of the currently used internal table
	 *
	 * @private
	 * @returns {sap.ui.model.Binding} the row/items binding
	 */
	SmartTable.prototype._getRowBinding = function() {
		if (this._oTable) {
			return this._oTable.getBinding(this._sAggregation);
		}
	};

	/**
	 * The entity set name from OData metadata, with which the table should be bound to
	 *
	 * @param {string} sEntitySetName The entity set
	 * @returns {Object} the control instance
	 * @public
	 */
	SmartTable.prototype.setEntitySet = function(sEntitySetName) {
		this.setProperty("entitySet", sEntitySetName, true);
		this._initialiseMetadata();
		return this;
	};

	/**
	 * Initialises the OData metadata necessary to create the table
	 *
	 * @param {Object} oEvt The event object
	 * @private
	 */
	SmartTable.prototype._initialiseMetadata = function(oEvt) {
		var that = this, oControl = that;
		// If this is called as a result of modelContextChange event -- the event may be triggered by a clone.
		// E.g. when SmartTable is used inside another bound aggregation e.g. TabContainer items
		// Hence trigger the call on the "right" clone instance and not "this"/the original control that registered the event!
		if (oEvt) {
			oControl = oEvt.getSource();
		}
		if (!oControl.bIsInitialised) {
			ODataModelUtil.handleModelInit(oControl, oControl._onMetadataInitialised);
		}
	};

	/**
	 * Called once the necessary Model metadata is available
	 *
	 * @private
	 */
	SmartTable.prototype._onMetadataInitialised = function() {
		this._bMetaModelLoadAttached = false;
		if (!this.bIsInitialised) {
			this._createTableProvider();
			if (this._oTableProvider) {
				this._aTableViewMetadata = this._oTableProvider.getTableViewMetadata();
				if (this._aTableViewMetadata) {
					if (!this._isMobileTable && this.getDemandPopin()) {
						this.setDemandPopin(false);
						Log.error("use SmartTable property 'demandPopin' only  with responsive table, property has been set to false");
					}
					this.detachModelContextChange(this._initialiseMetadata, this);
					// Indicates the control is initialised and can be used in the initialise event/otherwise!
					this.bIsInitialised = true;
					this._bTableSupportsExcelExport = this._oTableProvider.getSupportsExcelExport();
					this._bMultiUnitBehaviorEnabled = this._oTableProvider.getMultiUnitBehaviorEnabled();
					this._listenToSmartFilter();
					this._createVariantManagementControl(); // creates VariantMngmntCtrl if useVariantManagement OR useTablePersonalisation is true.
					// Control is only added to toolbar if useVariantManagement is set otherwise it acts as
					// hidden persistance helper
					this._createToolbarContent();
					this._aAlwaysSelect = this._oTableProvider.getRequestAtLeastFields();
					this._createContent();
					this._createPersonalizationController();
					// Create a local JSONModel to handle editable switch
					this._oEditModel = new JSONModel({
						editable: this.getEditable()
					});
					// Set the local model on the SmartTable
					this.setModel(this._oEditModel, "sm4rtM0d3l");

					this.attachEvent("_change", this._onPropertyChange, this);

					this.fireInitialise();
					// Trigger initial binding if no Variant exists -or- if it is already initialised
					if (!this._oVariantManagement || (this._oVariantManagement && this._bVariantInitialised)) {
						this._checkAndTriggerBinding();
					}
				}
			}
		}
	};

	/**
	 * Check if control needs to be bound and trigger binding accordingly.
	 *
	 * @private
	 */
	SmartTable.prototype._checkAndTriggerBinding = function() {
		if (!this._bAutoBindingTriggered) {
			this._bAutoBindingTriggered = true;
			if (this.getEnableAutoBinding()) {
				if (this._oSmartFilter) {
					if (this._oSmartFilter.isInitialised()) {
						this._oSmartFilter.search();
					} else {
						this._oSmartFilter.attachEventOnce("initialise", function() {
							this._oSmartFilter.search();
						}, this);
					}
				} else {
					this._reBindTable();
				}
			}
		}
	};

	SmartTable.prototype._aStaticProperties = [
		"entitySet", "ignoredFields", "initiallyVisibleFields", "ignoreFromPersonalisation", "tableType", "useTablePersonalisation", "enableAutoBinding", "persistencyKey", "smartFilterId"
	];

	SmartTable.prototype._aToolbarRelatedProperties = [
		"useExportToExcel", "exportType", "showFullScreenButton", "editTogglable", "placeToolbarInTable"
	];

	/**
	 * Callback when the property changes for the SmartTable control.
	 *
	 * @param {object} oEvent - the event object
	 * @private
	 */
	SmartTable.prototype._onPropertyChange = function(oEvent) {
		var sProperty = oEvent.getParameter("name");
		if (this._aStaticProperties.indexOf(sProperty) > -1) {
			Log.error("Property " + sProperty + " cannot be changed after the SmartTable with id " + this.getId() + " is initialised");
		}
		if (this._oToolbar && this._aToolbarRelatedProperties.indexOf(sProperty) > -1) {
			if (sProperty === "exportType" && this._oUseExportToExcel) {
				this._oUseExportToExcel.destroy(); // needed because we now need to switch between menu and button depending on exportType
				this._oUseExportToExcel = null;
			}
			this._createToolbarContent();
		}
	};

	/**
	 * Creates an instance of the table provider
	 *
	 * @private
	 */
	SmartTable.prototype._createTableProvider = function() {
		var oModel, sEntitySetName, sIgnoredFields;
		sEntitySetName = this.getEntitySet();
		sIgnoredFields = this.getIgnoredFields();
		oModel = this.getModel();

		if (oModel && sEntitySetName) {
			if (this._aExistingColumns.length) {
				if (sIgnoredFields) {
					sIgnoredFields += "," + this._aExistingColumns.toString();
				} else {
					sIgnoredFields = this._aExistingColumns.toString();
				}
			}
			this._oTableProvider = new TableProvider({
				entitySet: sEntitySetName,
				ignoredFields: sIgnoredFields,
				initiallyVisibleFields: this.getInitiallyVisibleFields(),
				isEditableTable: this.getEditable(),
				smartTableId: this.getId(),
				isAnalyticalTable: !!this._isAnalyticalTable,
				isMobileTable: !!this._isMobileTable,
				dateFormatSettings: this.data("dateFormatSettings"),
				useUTCDateTime: this.data("useUTCDateTime"),
				currencyFormatSettings: this.data("currencyFormatSettings"),
				defaultDropDownDisplayBehaviour: this.data("defaultDropDownDisplayBehaviour"),
				useSmartField: this.data("useSmartField"),
				useSmartToggle: this.data("useSmartToggle"),
				skipAnnotationParse: this.data("skipAnnotationParse"),
				lineItemQualifier: this.data("lineItemQualifier"),
				presentationVariantQualifier: this.data("presentationVariantQualifier"),
				enableInResultForLineItem: this.data("enableInResultForLineItem"),
				_semanticKeyAdditionalControl: this.getAggregation("semanticKeyAdditionalControl"),
				model: oModel,
				semanticObjectController: this.getSemanticObjectController()
			});
		}
	};

	/**
	 * Listen to changes on the corresponding SmartFilter (if any)
	 *
	 * @private
	 */
	SmartTable.prototype._listenToSmartFilter = function() {
		var sSmartFilterId, sInitialNoDataText, bWithFilterBar = false;
		// Register for SmartFilter Search
		sSmartFilterId = this.getSmartFilterId();

		this._oSmartFilter = this._findControl(sSmartFilterId, "sap.ui.comp.filterbar.FilterBar");

		if (this._oSmartFilter) {
			this._oSmartFilter.attachSearch(this._reBindTable, this);
			this._oSmartFilter.attachFilterChange(this._filterChangeEvent, this);
			bWithFilterBar = true;
		}

		sInitialNoDataText = this.getInitialNoDataText();

		if (sInitialNoDataText) {
			bWithFilterBar = sInitialNoDataText === "$FILTERBAR";
			if (!bWithFilterBar && sInitialNoDataText !== "$NO_FILTERBAR") {
				// If the text is not one of the "special" values simply use it and return
				this._setNoDataText(sInitialNoDataText);
				return;
			}
		}

		if (bWithFilterBar) {
			// Set initial empty text only if a valid SmartFilter is found
			this._setNoDataText(Core.getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_NO_DATA"));
		} else {
			// Set initial empty text for the case when no SmartFilter is attached to SmartTable
			this._setNoDataText(Core.getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_NO_DATA_WITHOUT_FILTERBAR"));
		}
	};

	SmartTable.prototype._filterChangeEvent = function() {
		if (this._isTableBound() && this._oSmartFilter && !this._oSmartFilter.getLiveMode() && !this._oSmartFilter.isDialogOpen()) {
			this._showOverlay(true);
		}
	};

	/**
	 * sets the ShowOverlay property on the inner table, fires the ShowOverlay event
	 *
	 * @param {boolean} bShow true to display the overlay, otherwise false
	 * @private
	 */
	SmartTable.prototype._showOverlay = function(bShow) {
		if (bShow) {
			var oOverlay = {
				show: true
			};
			this.fireShowOverlay({
				overlay: oOverlay
			});
			bShow = oOverlay.show;
		}

		this._oTable.setShowOverlay(bShow);
	};

	/**
	 * searches for a certain control by its ID
	 *
	 * @param {string} sId the control's ID
	 * @param {string} sType the named type of the control
	 * @returns {sap.ui.core.Control} The control found by the given Id
	 * @private
	 */
	SmartTable.prototype._findControl = function(sId, sType) {
		var oResultControl, oView;
		if (sId) {
			// Try to get SmartFilter from Id
			oResultControl = Core.byId(sId);

			// Try to get SmartFilter from parent View!
			if (!oResultControl || !oResultControl.isA(sType)) {
				oView = this._getView();

				if (oView) {
					oResultControl = oView.byId(sId);
				}
			}
			// Check if the control is an instance of the specified type (Smart/FilterBar)
			if (oResultControl && !oResultControl.isA(sType)) {
				oResultControl = undefined;
			}
		}

		return oResultControl;
	};

	/**
	 * searches for the controls view
	 *
	 * @returns {sap.ui.core.mvc.View} The found parental View
	 * @private
	 */
	SmartTable.prototype._getView = function() {
		if (!this._oView) {
			var oObj = this.getParent();
			while (oObj) {
				if (oObj.isA("sap.ui.core.mvc.View")) {
					this._oView = oObj;
					break;
				}
				oObj = oObj.getParent();
			}
		}
		return this._oView;
	};

	/**
	 * This can be used to trigger binding on the table used in the SmartTable
	 *
	 * @param {boolean} bForceRebind - force bind call to be triggered on the inner table
	 * @protected
	 */
	SmartTable.prototype.rebindTable = function(bForceRebind) {
		this._reBindTable(null, bForceRebind);
	};

	/**
	 * Re-binds the table
	 *
	 * @param {object} mEventParams - the event parameters
	 * @param {boolean} bForceRebind - force bind call to be triggered on the table
	 * @private
	 */
	SmartTable.prototype._reBindTable = function(mEventParams, bForceRebind) {
		var oTableBinding, sTableBindingPath, mTablePersonalisationData, i, iLen, aSmartFilters, aProcessedFilters = [], aFilters, oExcludeFilters, aAlwaysSelect, aSelect, mSelectExpand, aExpand, aSorters, mParameters = {}, mBindingParams = {
			preventTableBind: false
		};

		mTablePersonalisationData = this._getTablePersonalisationData() || {};
		aFilters = mTablePersonalisationData.filters;
		oExcludeFilters = mTablePersonalisationData.excludeFilters;
		aSorters = mTablePersonalisationData.sorters;

		// Get Filters and parameters from SmartFilter
		if (this._oSmartFilter) {
			aSmartFilters = this._oSmartFilter.getFilters();
			mParameters = this._oSmartFilter.getParameters() || {};
		}

		// If filters from SmartFilter exist --> process them first with SmartTable exclude filters
		// since we need to manually AND multiple multi filters!
		if (aSmartFilters && aSmartFilters.length) {
			if (oExcludeFilters) {
				aProcessedFilters = [
					new Filter([
						aSmartFilters[0], oExcludeFilters
					], true)
				];
			} else {
				aProcessedFilters = aSmartFilters;
			}
		} else if (oExcludeFilters) {
			aProcessedFilters = [
				oExcludeFilters
			];
		}
		// Combine the resulting processed filters with SmartTable include filters
		if (aFilters) {
			aFilters = aProcessedFilters.concat(aFilters);
		} else {
			aFilters = aProcessedFilters;
		}
		aAlwaysSelect = this._getRequestAtLeastFields();
		mSelectExpand = this._getRelevantColumnPaths();
		aSelect = mSelectExpand["select"];
		// handle fields that shall always be selected
		if (!aSelect || !aSelect.length) {
			aSelect = aAlwaysSelect;
		} else {
			iLen = aAlwaysSelect.length;
			for (i = 0; i < iLen; i++) {
				if (aSelect.indexOf(aAlwaysSelect[i]) < 0) {
					aSelect.push(aAlwaysSelect[i]);
				}
			}
		}
		if (this._mSelectExpandForGroup && this._mSelectExpandForGroup.select) {
			this._mSelectExpandForGroup.select.forEach(function(sGroupSelect) {
				if (aSelect.indexOf(sGroupSelect) < 0) {
					aSelect.push(sGroupSelect);
				}
			});
		}
		if (aSelect.length) {
			mParameters["select"] = aSelect.toString();

			// Expand handling for navigationProperties
			aExpand = mSelectExpand["expand"] || [];
			if (this._mSelectExpandForGroup && this._mSelectExpandForGroup.expand) {
				this._mSelectExpandForGroup.expand.forEach(function(sGroupExpand) {
					if (aExpand.indexOf(sGroupExpand) < 0) {
						aExpand.push(sGroupExpand);
					}
				});
			}
			if (aExpand.length) {
				mParameters["expand"] = aExpand.join(",");
			}
		}

		// Enable batch requests (used by AnalyticalTable)
		mParameters["useBatchRequests"] = true;

		if (!aSorters) {
			aSorters = [];
		}

		mBindingParams.filters = aFilters;
		mBindingParams.sorter = aSorters;
		mBindingParams.parameters = mParameters;
		mBindingParams.length = undefined;
		mBindingParams.startIndex = undefined;
		mBindingParams.events = {};
		// fire event to enable user modification of certain binding options (Ex: Filters)
		this.fireBeforeRebindTable({
			bindingParams: mBindingParams
		});

		if (!mBindingParams.preventTableBind) {
			aSorters = mBindingParams.sorter;
			aFilters = mBindingParams.filters;
			mParameters = mBindingParams.parameters;
			aSelect = mBindingParams.parameters["select"];
			if (!aSelect || !aSelect.length) {
				MessageBox.error(Core.getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_NO_COLS"), {
					styleClass: (this.$() && this.$().closest(".sapUiSizeCompact").length) ? "sapUiSizeCompact" : ""
				});
				return;
			}
			sTableBindingPath = this.getTableBindingPath() || ("/" + this.getEntitySet());

			// Reset Suppress refresh
			if (this._oTable.resumeUpdateAnalyticalInfo) {
				// resumeUpdateAnalyticalInfo forces binding change if not explicitly set to false
				this._oTable.resumeUpdateAnalyticalInfo(true, false);
			}
			this._bDataLoadPending = true;
			this._bIgnoreChange = false; // if a 2nd request is sent while the 1st one is in progress the dataReceived event may not be fired!
			// Check if table has to be forcefully bound again!
			if (this._bForceTableUpdate) {
				bForceRebind = true;
				// Reset force update
				this._bForceTableUpdate = false;
			}
			// Only check if binding exists, if table is not being forcefully rebound
			if (!bForceRebind) {
				oTableBinding = this._oTable.getBinding(this._sAggregation);
				if (oTableBinding && oTableBinding.mParameters) {
					// Check if binding needs to be redone!
					// Evaluate to true if:
					// binding parameters change -or- custom binding parameters change -or- if length, startIndex or tableBindingPath change!
					bForceRebind = !(deepEqual(mParameters, oTableBinding.mParameters, true) && deepEqual(mParameters.custom, oTableBinding.mParameters.custom) && !mBindingParams.length && !mBindingParams.startIndex && sTableBindingPath === oTableBinding.getPath());
				}
			}

			// Update No data text (first time), just before triggering the binding!
			if (!this._bNoDataUpdated) {
				this._bNoDataUpdated = true;
				this._setNoDataText();
			}

			// do the binding if no binding is already present or if it is being forced!
			if (!oTableBinding || !this._bIsTableBound || bForceRebind) {
				SmartTable._addBindingListener(mBindingParams, "change", this._onBindingChange.bind(this));
				SmartTable._addBindingListener(mBindingParams, "dataRequested", this._onDataRequested.bind(this));
				SmartTable._addBindingListener(mBindingParams, "dataReceived", this._onDataReceived.bind(this));

				// if the cell contains an aggregation binding that could lead to multiple requests even for hidden cells
				// therefore here we suppress the binding of invisible column cells for the responsive table
				if (this._isMobileTable) {
					var aColumns = this._oTable ? this._oTable.getColumns() : [];
					var aCells = this._oTemplate ? this._oTemplate.getCells() : [];

					// The relationship between columns and cells cannot be determined if the number of columns and cells do not match. In this
					// case, the optimization cannot be performed.
					if (aColumns.length === aCells.length) {
						aColumns.forEach(function(oColumn, iIndex) {
							aCells[iIndex].setBindingContext(oColumn.getVisible() ? undefined : null);
						});
					}
				}

				this._oTable.bindRows({
					path: sTableBindingPath,
					filters: aFilters,
					sorter: aSorters,
					parameters: mParameters,
					length: mBindingParams.length,
					startIndex: mBindingParams.startIndex,
					template: this._oTemplate,
					events: mBindingParams.events
				});
				// Flag to indicate if table was bound (data fetch triggered) at least once
				this._bIsTableBound = true;
			} else {
				oTableBinding.sort(aSorters);
				oTableBinding.filter(aFilters, "Application");
			}
			this._showOverlay(false);
		}
	};

	/**
	 * Event handler for binding dataRequested
	 *
	 * @param {object} oEvt - the event instance
	 * @private
	 */
	SmartTable.prototype._onDataRequested = function(oEvt) {
		// AnalyticalBinding fires dataRequested too often/early
		if (oEvt && oEvt.getParameter && oEvt.getParameter("__simulateAsyncAnalyticalBinding")) {
			return;
		}
		this._bIgnoreChange = true;
		// notify any listeners about dataRequested
		this.fireDataRequested(oEvt.getParameters());
	};

	/**
	 * Event handler for binding dataReceived
	 *
	 * @param {object} oEvt - the event instance
	 * @private
	 */
	SmartTable.prototype._onDataReceived = function(oEvt) {
		// AnalyticalBinding fires dataReceived too often/early
		if (oEvt && oEvt.getParameter && oEvt.getParameter("__simulateAsyncAnalyticalBinding")) {
			return;
		}
		this._bIgnoreChange = false;
		this._onDataLoadComplete(oEvt, true);
		// notify any listeners about dataReceived
		this.fireDataReceived(oEvt);
	};

	/**
	 * Event handler for binding change
	 *
	 * @param {object} oEvt - the event instance
	 * @private
	 */
	SmartTable.prototype._onBindingChange = function(oEvt) {
		if (this._bIgnoreChange) {
			return;
		}
		var sReason, bForceUpdate = false;
		sReason = (oEvt && oEvt.getParameter) ? oEvt.getParameter("reason") : undefined;
		// Force update state if reason for binding change is "context" or "filter" -or- not defined -or- if binding changes due to a model update
		// (e.g. $expand on a parent entity)
		if (!sReason || sReason === "filter" || sReason === "context" || (!this._bDataLoadPending && sReason === "change")) {
			bForceUpdate = true;
		}
		if (sReason === "change" || bForceUpdate) {
			this._onDataLoadComplete(oEvt, bForceUpdate);
		}
	};

	/**
	 * Static method for checking and wrapping binding event listeners
	 *
	 * @param {object} oBindingInfo - the bindingInfo (or binding parameter) instance
	 * @param {object} sEventName - the event name
	 * @param {object} fHandler - the handler to be called internally
	 * @private
	 */
	SmartTable._addBindingListener = function(oBindingInfo, sEventName, fHandler) {
		if (!oBindingInfo.events) {
			oBindingInfo.events = {};
		}

		if (!oBindingInfo.events[sEventName]) {
			oBindingInfo.events[sEventName] = fHandler;
		} else {
			// Wrap the event handler of the other party to add our handler.
			var fOriginalHandler = oBindingInfo.events[sEventName];
			oBindingInfo.events[sEventName] = function() {
				fHandler.apply(this, arguments);
				fOriginalHandler.apply(this, arguments);
			};
		}
	};

	/**
	 * Called once data is loaded in the binding (i.e. either backend fetch or once change event is fired)
	 *
	 * @param {object} mEventParams - the event parameters
	 * @param {boolean} bForceUpdate - force update
	 * @private
	 */
	SmartTable.prototype._onDataLoadComplete = function(mEventParams, bForceUpdate) {
		if (this._bDataLoadPending || bForceUpdate) {
			this._bDataLoadPending = false;
			this.updateTableHeaderState();
		}
	};

	/**
	 * Returns true if the inner UI5 table was bound at least once by the SmartTable -or- if binding was done by the app.
	 *
	 * @returns {boolean} whether the inner UI5 table is bound
	 * @private
	 */
	SmartTable.prototype._isTableBound = function() {
		if (this._bIsTableBound) {
			return true;
		}
		if (this._oTable) {
			return this._oTable.isBound(this._sAggregation);
		}
		return false;
	};

	SmartTable.prototype.setNoData = function(oNoData) {
		// overwrite the original aggregation setter, otherwise parent relationship will be destroyed when a control is set to the inner table's
		// noData aggregation
		this._oNoData = oNoData;
		if (this._bNoDataUpdated || this._isTableBound()) {
			this._setNoDataText();
		}
		return this;
	};

	SmartTable.prototype.getNoData = function() {
		return this._oNoData;
	};

	/**
	 * Sets the no data text to the internal table
	 *
	 * @param {string} sOverwriteText - optional text to set on the table
	 * @private
	 */
	SmartTable.prototype._setNoDataText = function(sOverwriteText) {
		var fSetFunction = this._oTable.setNoData;
		if (!fSetFunction) {
			fSetFunction = this._oTable.setNoDataText;
		}

		if (!fSetFunction) {
			return;
		}

		var oNoData = sOverwriteText;
		if (!oNoData) {
			oNoData = this.getNoData();
		}

		if (!oNoData) {
			oNoData = Core.getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_NO_RESULTS");
		}

		fSetFunction.call(this._oTable, oNoData, true);
	};

	/**
	 * This can be called once data is received to update table header (count) and toolbar buttons(e.g. Excel Export) enabled state
	 *
	 * @public
	 */
	SmartTable.prototype.updateTableHeaderState = function() {
		this._refreshHeaderText();
		this._setExcelExportEnableState();
	};

	/**
	 * Creates the content based on the metadata/configuration
	 *
	 * @private
	 */
	SmartTable.prototype._createContent = function() {
		var i, iLen = 0, oField, aIndexedColumns, oColumn, aRemainingColumnKeys = [];

		// Sync the current table columns with the _aColumnKeys array
		if (this._aExistingColumns && this._aExistingColumns.length) {
			this._aColumnKeys = [].concat(this._aExistingColumns.reverse());
		}

		aIndexedColumns = this._parseIndexedColumns();

		iLen = this._aTableViewMetadata.length;
		for (i = 0; i < iLen; i++) {
			oField = this._aTableViewMetadata[i];
			// Fill only inititally visible columns coming from metadata
			if (oField.isInitiallyVisible) {
				this._aColumnKeys.push(oField.name);
			} else {
				aRemainingColumnKeys.push(oField.name);
			}

			// Store the non-relevant columns in a map
			if (!(oField.isInitiallyVisible || oField.inResult)) {
				this._mLazyColumnMap[oField.name] = oField;
			} else {
				oColumn = this._createColumnForField(oField);
				// Add the column to the table
				this._oTable.addColumn(oColumn);
			}

			// Add field metadata to internal named map for later quick access
			this._mFieldMetadataByKey[oField.name] = oField;
		}

		this._insertIndexedColumns(aIndexedColumns);

		// Fill remaining columns from metadata into the column keys array
		this._aColumnKeys = this._aColumnKeys.concat(aRemainingColumnKeys);

		this._updateColumnsPopinFeature();

		this._storeInitialColumnSettings();
	};

	/**
	 * Creates the column from the field metadata and returns it
	 *
	 * @param {object} oField - the field metadata from which we create the columns
	 * @returns {object} the created column
	 * @private
	 */
	SmartTable.prototype._createColumnForField = function(oField) {
		var oColumn, sId;
		// Replace invalid chars in name (e.g: "/") with "_"
		sId = this.getId() + "-" + oField.name.replace(/[^A-Za-z0-9_.:-]+/g, "_");
		oColumn = this._createColumn(oField, sId);
		// Mark field as created
		oField.isColumnCreated = true;
		// Set the persoData - relevant for personalisation
		oColumn.data("p13nData", {
			columnKey: oField.name,
			leadingProperty: oField.name, // used to fetch data, by adding this to $select param of OData request
			additionalProperty: oField.additionalProperty, // additional data to fetch in $select
			navigationProperty: oField.navigationProperty, // navigationProperty that has to be expanded in $expand
			sortProperty: oField.sortable ? oField.name : undefined,
			filterProperty: oField.filterable ? oField.name : undefined,
			isGroupable: oField.sortable && oField.filterable && oField.aggregationRole === "dimension",
			fullName: oField.hasValueListAnnotation ? oField.fullName : null,
			type: oField.filterType,
			typeInstance: oField.modelType, // used by p13n - Filter/Condition handling
			maxLength: oField.maxLength,
			precision: oField.precision,
			scale: oField.scale,
			align: oField.align,
			edmType: oField.type,
			displayBehaviour: oField.displayBehaviour,
			description: oField.description,
			isDigitSequence: oField.isDigitSequence,
			isCurrency: oField.isCurrencyField,
			unit: oField.unit,
			width: oField.width,
			aggregationRole: oField.aggregationRole,
			nullable: oField.nullable !== "false"
		});

		if (oField.filterable && oColumn.setFilterProperty) {
			oColumn.setFilterProperty(oField.name);
		}

		if (oField.sortable && oColumn.setSortProperty) {
			oColumn.setSortProperty(oField.name);
		}

		this._registerContentTemplateEvents(oField.template);

		return oColumn;
	};

	/**
	 * searches for columns which contains a columnIndex custom data property. Removes those columns from the table and returns them
	 *
	 * @returns {array} the found columns together with their index
	 * @private
	 */
	SmartTable.prototype._parseIndexedColumns = function() {
		var i, iLength, oColumn, aIndexedColumns, oCustomData, sIndex, sColumnKey, iIndex, oTemplateCell;
		var aColumns = this._oTable.getColumns();
		var aCells = null;
		if (this._oTemplate && this._oTemplate.getCells) {
			aCells = this._oTemplate.getCells();
		}

		if (!aColumns) {
			return null;
		}

		aIndexedColumns = [];
		iLength = aColumns.length;

		for (i = 0; i < iLength; i++) {
			oColumn = aColumns[i];
			oCustomData = oColumn.data("p13nData");
			sIndex = null;
			sColumnKey = null;
			if (oCustomData) {
				sIndex = oCustomData.columnIndex;
				sColumnKey = oCustomData.columnKey;
			}
			iIndex = -1;
			if (sIndex !== null && sIndex !== undefined) {
				iIndex = parseInt(sIndex);
			}
			if (!isNaN(iIndex) && iIndex > -1) {
				if (aCells) {
					oTemplateCell = aCells[i];
					this._oTemplate.removeCell(oTemplateCell);
				} else {
					oTemplateCell = null;
				}
				// Keep in sync with table - remove the columns from existing column array
				this._aColumnKeys.splice(i - aIndexedColumns.length, 1);

				aIndexedColumns.push({
					index: iIndex,
					columnKey: sColumnKey,
					column: oColumn,
					template: oTemplateCell
				});

				this._oTable.removeColumn(oColumn);
			}
		}

		aIndexedColumns.sort(function(col1, col2) {
			return col1.index - col2.index;
		});

		return aIndexedColumns;
	};

	/**
	 * inserts columns containing an index back to the table
	 *
	 * @param {Array} aIndexedColumns - an array containing objects with index and columns
	 * @private
	 */
	SmartTable.prototype._insertIndexedColumns = function(aIndexedColumns) {
		var i, iLength, oColumn;

		if (!aIndexedColumns) {
			return;
		}

		iLength = aIndexedColumns.length;
		for (i = 0; i < iLength; i++) {
			oColumn = aIndexedColumns[i];
			// Keep in sync with table - add column at the specified location
			this._aColumnKeys.splice(oColumn.index, 0, oColumn.columnKey);
			// we keep also invisible columns in order not to loose information on the index within the table
			this._oTable.insertColumn(oColumn.column, oColumn.index);
			if (oColumn.template) {
				this._oTemplate.insertCell(oColumn.template, oColumn.index);
			}
		}
	};

	/**
	 * on sap.m.Table, this function activates the popin feature for the visible columns
	 *
	 * @private
	 */
	SmartTable.prototype._updateColumnsPopinFeature = function() {
		if (!this._isMobileTable || !this.getDemandPopin()) { // popin only available on mobile table
			return;
		}

		var aColumns = this._oTable.getColumns();
		if (!aColumns) {
			return;
		}

		// get only visible columns
		aColumns = aColumns.filter(function(col) {
			return col.getVisible();
		});

		// sort columns according to their order property
		aColumns.sort(function(col1, col2) {
			return col1.getOrder() - col2.getOrder();
		});

		var oColumn, vWidth, fTotalWidth = 0, iLength = aColumns.length, fBaseFontSize = parseFloat(MLibrary.BaseFontSize);

		for (var i = 0; i < iLength; i++) {
			oColumn = aColumns[i];
			vWidth = oColumn.getWidth();

			if (vWidth && vWidth.endsWith("px")) {
				vWidth = parseFloat(vWidth) / fBaseFontSize;
			} else if (vWidth && (vWidth.endsWith("rem") || vWidth.endsWith("em"))) {
				vWidth = parseFloat(vWidth);
			} else {
				vWidth = 10;
			}

			fTotalWidth = fTotalWidth + vWidth;

			if (i < 2) { // ensure always two columns
				oColumn.setDemandPopin(false);
				oColumn.setMinScreenWidth("1px");
			} else {
				oColumn.setDemandPopin(true);
				if (oColumn.getPopinDisplay() != "WithoutHeader") {
					oColumn.setPopinDisplay("Inline");
				}
				oColumn.setMinScreenWidth(fTotalWidth + "rem");
			}
		}
	};

	/**
	 * stores the initial column settings
	 *
	 * @private
	 */
	SmartTable.prototype._storeInitialColumnSettings = function() {
		this._aInitialSorters = [];
		PersonalizationUtil.createSort2Json(this._oTable, this._aInitialSorters, PersonalizationUtil.createArrayFromString(this.getIgnoreFromPersonalisation()));
	};

	/**
	 * on sap.m.Table, this function deactivates the popin feature for all columns
	 *
	 * @private
	 */
	SmartTable.prototype._deactivateColumnsPopinFeature = function() {
		if (!this._isMobileTable) { // popin only available on mobile table
			return;
		}

		var aColumns = this._oTable.getColumns();
		if (!aColumns) {
			return;
		}

		var oColumn, iLength = aColumns.length;

		for (var i = 0; i < iLength; i++) {
			oColumn = aColumns[i];
			oColumn.setDemandPopin(false);
			oColumn.setMinScreenWidth("1px");
		}
	};

	/**
	 * registers events on the template controls which are exposed by the SmartTable
	 *
	 * @param {sap.ui.core.Control} oTemplateControl - the control on which to register the events
	 * @private
	 */
	SmartTable.prototype._registerContentTemplateEvents = function(oTemplateControl) {
		// When SmartToggle is used - get the edit content that is inside the SmartToggle
		if (oTemplateControl.isA("sap.ui.comp.SmartToggle")) {
			oTemplateControl = oTemplateControl.getEdit();
		}

		if (oTemplateControl && oTemplateControl.attachChange) {
			oTemplateControl.attachChange(function(oEventParams) {
				this.fireFieldChange({
					changeEvent: oEventParams
				});
			}, this);
		}
	};

	/**
	 * stores a list of initially created columns (if any)
	 *
	 * @private
	 */
	SmartTable.prototype._updateInitialColumns = function() {
		var aColumns = this._oTable.getColumns(), iLen = aColumns ? aColumns.length : 0, oColumn, oColumnData, sColumnKey;
		while (iLen--) {
			sColumnKey = null;
			oColumn = aColumns[iLen];
			// Retrieve path from the property
			if (oColumn) {
				oColumnData = oColumn.data("p13nData");
				if (typeof oColumnData === "string") {
					try {
						oColumnData = JSON.parse(oColumnData);
					} catch (e) {
						// Invalid JSON
					}
					// Set back the object for faster access later
					if (oColumnData) {
						oColumn.data("p13nData", oColumnData);
					}
				}
				if (oColumnData) {
					sColumnKey = oColumnData["columnKey"];
				}
				if (sColumnKey) {
					this._aExistingColumns.push(sColumnKey);
				}
			}
		}
	};

	/**
	 * gets the array of visible and inResult column path, that will used to create the select query
	 *
	 * @private
	 * @returns {object} Map containing array of column paths to be selected and expanded
	 */
	SmartTable.prototype._getRelevantColumnPaths = function() {
		var mResult = {}, aSelect = [], aExpand = [], aColumns = this._oTable.getColumns(), i, iLen = aColumns ? aColumns.length : 0, oColumn, oColumnData, sPath, sAdditionalPath, sExpandPath;

		var fExtractAndInsertPathToArray = function(sPath, aArray) {
			var iPathLen, aPath;
			if (sPath) {
				aPath = sPath.split(",");
				iPathLen = aPath.length;
				// extract and add the additional paths if they don't already exist
				while (iPathLen--) {
					sPath = aPath[iPathLen];
					if (sPath && aArray.indexOf(sPath) < 0) {
						aArray.push(sPath);
					}
				}
			}
		};

		for (i = 0; i < iLen; i++) {
			oColumn = aColumns[i];
			sPath = null;
			if (oColumn.getVisible() || (oColumn.getInResult && oColumn.getInResult())) {
				if (oColumn.getLeadingProperty) {
					sPath = oColumn.getLeadingProperty();
				}

				oColumnData = oColumn.data("p13nData");
				if (oColumnData) {
					if (!sPath) {
						sPath = oColumnData["leadingProperty"];
					}
					sAdditionalPath = oColumnData["additionalProperty"];
					sExpandPath = oColumnData["navigationProperty"];
				}

				if (sPath && aSelect.indexOf(sPath) < 0) {
					aSelect.push(sPath);
				}
				// Check if additionalPath contains an array of fields
				fExtractAndInsertPathToArray(sAdditionalPath, aSelect);

				// Check if additionalPath contains an array of fields
				fExtractAndInsertPathToArray(sExpandPath, aExpand);
			}
		}
		mResult["select"] = aSelect;
		mResult["expand"] = aExpand;
		return mResult;
	};

	/**
	 * Creates a table based on the configuration, if necessary. This also prepares the methods to be used based on the table type.
	 *
	 * @private
	 */
	SmartTable.prototype._createTable = function() {
		var aContent = this.getItems(), iLen = aContent ? aContent.length : 0, oTable, sId;
		this._sAggregation = "rows";
		// Check if a Table already exists in the content (Ex: from view.xml)
		while (iLen--) {
			oTable = aContent[iLen];
			if (oTable instanceof Table || oTable instanceof ResponsiveTable) {
				break;
			}
			oTable = null;
		}

		// If a Table exists determine its type else create one based on the tableType property!
		if (oTable) {
			this._oTable = oTable;
			if (oTable instanceof AnalyticalTable) {
				this._isAnalyticalTable = true;
			} else if (oTable instanceof ResponsiveTable) {
				this._isMobileTable = true;
				// get the item template from the view
				this._oTemplate = (oTable.getItems() && oTable.getItems().length > 0) ? oTable.getItems()[0] : new ColumnListItem();
				oTable.removeAllItems();
			} else if (oTable instanceof TreeTable) {
				this._isTreeTable = true;
			}
			// If a table already exists --> get the list of columns to ignore
			this._updateInitialColumns();
		} else {
			sId = this.getId() + "-ui5table";
			// Create table based on tableType
			if (this.getTableType() === "AnalyticalTable") {
				this._isAnalyticalTable = true;
				this._oTable = new AnalyticalTable(sId, {
					enableCustomFilter: true
				});
			} else if (this.getTableType() === "ResponsiveTable") {
				this._isMobileTable = true;
				this._oTable = new ResponsiveTable(sId, {
					growing: true
				});
				this._oTemplate = new ColumnListItem();
			} else if (this.getTableType() === "TreeTable") {
				this._isTreeTable = true;
				this._oTable = new TreeTable(sId, {
					selectionMode: "MultiToggle"
				});
			} else {
				this._oTable = new Table(sId, {
					selectionMode: "MultiToggle"
				});
			}

			if (this._oTable.setVisibleRowCountMode) {
				this._oTable.setVisibleRowCountMode("Auto");
			}

			this.insertItem(this._oTable, 2);
		}
		if (!this._oTable.getLayoutData()) {
			// Checking if Table is of type sap.m.Table and visibleRowCountMode is not set to Auto
			// Then baseSize is set to auto. This check is to ensure corrent rendering of SmartTable in IE and Safari
			if (this._oTable instanceof ResponsiveTable || (this._oTable.getVisibleRowCountMode && this._oTable.getVisibleRowCountMode() !== "Auto")) {
				this._oTable.setLayoutData(new FlexItemData({
					growFactor: 1,
					baseSize: "auto"
				}));
			} else {
				// baseSize="0%" for tables that are not of type sap.m.Table
				this._oTable.setLayoutData(new FlexItemData({
					growFactor: 1,
					baseSize: "0%"
				}));
			}
		}
		// Set ariaLabelledBy on the inner UI5 table
		if (this._oTable.addAriaLabelledBy) {
			this._oTable.addAriaLabelledBy(this.getId() + "-header");
		}
		this._oTable.addStyleClass("sapUiCompSmartTableInnerTable");

		this._oTable.setEnableBusyIndicator(true);
		this._oTable.setBusyIndicatorDelay(100);

		if (this._oTable.setEnableCustomFilter) {
			this._oTable.setEnableCustomFilter(this.getEnableCustomFilter());
		}

		// Always disable Column Visiblilty menu item
		if (this._oTable.setShowColumnVisibilityMenu) {
			this._oTable.setShowColumnVisibilityMenu(false);
		}

		if (this._oTable.getEnableCustomFilter && this._oTable.getEnableCustomFilter() && this._bIsFilterPanelEnabled) {
			// disable the cell filter if custom filter is enabled
			if (this._oTable.setEnableCellFilter) {
				this._oTable.setEnableCellFilter(false);
			}
			if (this._oTable.attachCustomFilter) {
				this._oTable.attachCustomFilter(this._onCustomFilter, this);
			}
		}

		// Replace the prototype methods to suit the table being used!
		if (this._isAnalyticalTable) {
			this._createColumn = this._createAnalyticalColumn;
		} else if (this._isMobileTable) {
			// enable active headers for ResponsiveTable and attach columnPress event to it
			// active headers are only enabled if useTablePersonalisation=true
			if (this.getUseTablePersonalisation()) {
				this._oTable.bActiveHeaders = true;
				this._oTable.attachEvent("columnPress", this._onColumnPress, this);
				// simulate sort event on the ResponsiveTable
				this._oTable.attachSort = function() {
					this.attachEvent("sort", arguments[0], arguments[1], arguments[2]);
				};
				this._oTable.detachSort = function() {
					this.detachEvent("sort", arguments[0], arguments[1]);
				};
			}
			this._sAggregation = "items";
			this._createColumn = this._createMobileColumn;
			// map bindItems to bindRows for Mobile Table to enable reuse of rebind mechanism
			this._oTable.bindRows = this._oTable.bindItems;
		}

		if (!this._isMobileTable) {
			this._oTable.attachEvent("_rowsUpdated", function() {
				this._setExcelExportEnableState();
			}, this);
		}
		// Always enable the better scroll behaviour - so that scroll/data request only happens once scrollbar is released
		if (this._oTable._setLargeDataScrolling) {
			this._oTable._setLargeDataScrolling(true);
		}
		// Always attach to paste event of inner table
		this._oTable.attachPaste(this._onInnerTablePaste, this);
	};

	/**
	 * Create ResponsivePopover
	 *
	 * @private
	 */
	SmartTable.prototype._createResponsivePopover = function() {
		this._oFilterButton = new ColumnPopoverActionItem({
			text: Core.getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_RP_FILTER"),
			icon: "sap-icon://filter",
			press: [
				function(oEvent) {
					this._onCustomFilter(oEvent);
				}, this
			]
		});

		this._oSortButton = new ColumnPopoverSortItem({
			sort: [
				function(oEvent) {
					this._onCustomSort(oEvent);
				}, this
			]
		});

		this._oColumnHeaderPopover = new ColumnHeaderPopover({
			items: [
				this._oSortButton, this._oFilterButton
			]
		});
	};

	/**
	 * Event handler for the "columnPress" event of the Responsive Table.
	 *
	 * @param {Object} oEvent The event object
	 * @private
	 */
	SmartTable.prototype._onColumnPress = function(oEvent) {
		this._oColumnClicked = oEvent.getParameter("column");
		var oColumnData = this._oColumnClicked.data("p13nData");
		if (!oColumnData) {
			return;
		}

		var sFilterProperty = oColumnData.filterProperty;
		var sSortProperty = oColumnData.sortProperty;

		if (!this._oColumnHeaderPopover) {
			this._createResponsivePopover();
		}

		// hide filter button in the popover if filter panel is disabled in p13nDialog
		this._oFilterButton.setVisible(!!sFilterProperty && this._bIsFilterPanelEnabled);
		this._oSortButton.setVisible(!!sSortProperty);

		if ((sFilterProperty && this._bIsFilterPanelEnabled) || sSortProperty) {
			this._oColumnHeaderPopover.removeAllAriaLabelledBy();
			this._oColumnHeaderPopover.addAriaLabelledBy(this._oColumnClicked.getHeader());
			this._oColumnHeaderPopover.openBy(this._oColumnClicked);
		}
	};

	/**
	 * Event handler when the custom sort is triggered. Handler is only used in case of Responsive table
	 *
	 * @private
	 */
	SmartTable.prototype._onCustomSort = function() {
		var oColumnData = this._oColumnClicked.data("p13nData");

		if (oColumnData) {
			if (!oColumnData.sorted) {
				oColumnData.sorted = {
					"ascending": true
				};
				this._oColumnClicked.data("p13nData", oColumnData);
			} else {
				oColumnData.sorted.ascending = !oColumnData.sorted.ascending;
			}
		}

		var oSorted = oColumnData.sorted;
		var bAscending = oSorted && oSorted.ascending;

		// fire the simulated sort event on the ResponsiveTable for p13n to trigger the sort
		this._oTable.fireEvent("sort", {
			column: this._oColumnClicked,
			sortOrder: bAscending ? SortOrder.Ascending : SortOrder.Descending,
			columnAdded: false
		});
	};

	/**
	 * Event handler when the custom filter is triggered.
	 *
	 * @param {Object} oEvent event object
	 * @private
	 */
	SmartTable.prototype._onCustomFilter = function(oEvent) {
		this._showTableFilterDialog(oEvent.getParameter("column") || this._oColumnClicked);
	};

	/**
	 * returns the internally used table object
	 *
	 * @public
	 * @returns {object} the table
	 */
	SmartTable.prototype.getTable = function() {
		return this._oTable;
	};

	/**
	 * Shows the filter dialog via the Personalisation controller
	 *
	 * @param {object} oColumn The column instance
	 * @private
	 */
	SmartTable.prototype._showTableFilterDialog = function(oColumn) {
		if (this._oPersController && oColumn) {
			this._oPersController.openDialog({
				filter: {
					visible: true,
					payload: {
						column: oColumn
					}
				}
			});
		}
	};

	/**
	 * Creates and returns a Column that can be added to the table, based on the metadata provided by the TableProvider
	 *
	 * @param {object} oField The column's metadata
	 * @param {string} sId The id to be set on the column
	 * @private
	 * @returns {object} the column that is created
	 */
	SmartTable.prototype._createColumn = function(oField, sId) {
		var oColumn;
		oColumn = new Column(sId, {
			autoResizable: true,
			hAlign: oField.align,
			width: oField.width,
			visible: oField.isInitiallyVisible,
			label: new Label(sId + "-header", {
				textAlign: oField.align,
				text: oField.label
			}),
			sorted: oField.sorted,
			sortOrder: oField.sortOrder,
			tooltip: oField.quickInfo,
			showSortMenuEntry: oField.sortable,
			showFilterMenuEntry: oField.filterable && this._bIsFilterPanelEnabled,
			name: oField.fieldName,
			template: oField.template
		});
		return oColumn;
	};

	/**
	 * Creates and returns an AnalyticalColumn that can be added to the AnalyticalTable, based on the metadata provided by the TableProvider
	 *
	 * @param {object} oField The column's metadata
	 * @param {string} sId The id to be set on the column
	 * @private
	 * @returns {object} the column that is created
	 */
	SmartTable.prototype._createAnalyticalColumn = function(oField, sId) {
		var oColumn;
		if (oField.aggregationRole !== "measure" && oField.isMeasureField && oField.unit && oField.template.addStyleClass) {
			// Add special style class to hide sum for measure fields that have non-measure aggregation role
			oField.template.addStyleClass("sapUiAnalyticalTableSumCellHidden sapUiAnalyticalTableGroupCellHidden");
		} else if (oField.isCurrencyField && oField.template.addStyleClass) {
			// Add a special style class to make currency fields bold in sum/total row
			oField.template.addStyleClass("sapUiCompCurrencyBold");
		}

		oColumn = new AnalyticalColumn(sId, {
			autoResizable: true,
			hAlign: oField.align,
			width: oField.width,
			visible: oField.isInitiallyVisible,
			inResult: oField.inResult,
			label: new Label(sId + "-header", {
				textAlign: oField.align,
				text: oField.label
			}),
			tooltip: oField.quickInfo,
			sorted: oField.sorted,
			sortOrder: oField.sortOrder,
			grouped: oField.grouped,
			showIfGrouped: oField.grouped,
			showSortMenuEntry: oField.sortable,
			showFilterMenuEntry: oField.filterable && this._bIsFilterPanelEnabled,
			summed: oField.summed,
			leadingProperty: oField.name,
			template: oField.template,
			groupHeaderFormatter: FormatUtil.getInlineGroupFormatterFunction(oField, true)
		});
		return oColumn;
	};

	/**
	 * Creates and returns a MobileColumn that can be added to the mobile table, based on the metadata provided by the TableProvider
	 *
	 * @param {object} oField The column's metadata
	 * @param {string} sId The id to be set on the column
	 * @private
	 * @returns {object} the column that is created
	 */
	SmartTable.prototype._createMobileColumn = function(oField, sId) {
		var oColumn;
		oColumn = new Column1(sId, {
			hAlign: oField.align,
			visible: oField.isInitiallyVisible,
			header: new Text(sId + "-header", {
				textAlign: oField.align,
				text: oField.label,
				tooltip: oField.quickInfo,
				wrappingType: MLibrary.WrappingType.Hyphenated
			}),
			tooltip: oField.quickInfo,
			width: oField.isImageURL ? "3em" : undefined
		});

		if (this._oTemplate) {
			this._oTemplate.addCell(oField.template);
		}
		return oColumn;
	};

	/**
	 * Interface function for SmartVariantManagement control, returns the current used variant data
	 *
	 * @public
	 * @returns {object} The currently set variant
	 */
	SmartTable.prototype.fetchVariant = function() {
		if (this._oCurrentVariant === "STANDARD" || this._oCurrentVariant === null) {
			return {};
		}

		return this._oCurrentVariant;
	};

	/**
	 * Interface function for SmartVariantManagement control, sets the current variant. <b>Note:</b> If an application default variant exists, then
	 * all other variants are extended from this application default variant.
	 *
	 * @param {object} oVariantJSON The variants json
	 * @param {string} sContext Describes the context in which the apply was executed
	 * @public
	 */
	SmartTable.prototype.applyVariant = function(oVariantJSON, sContext) {

		this._oCurrentVariant = oVariantJSON;
		if (this._oCurrentVariant === "STANDARD") {
			this._oCurrentVariant = null;
		}

		// Set instance flag to indicate that we are currently in the process of applying the changes
		this._bApplyingVariant = true;
		// Suppress refresh to prevent backend roundtrips
		if (this._oTable._setSuppressRefresh) {
			this._oTable._setSuppressRefresh(true);
		}

		if (this._oPersController) {
			if (this._oCurrentVariant === null || jQuery.isEmptyObject(this._oCurrentVariant)) {
				this._oPersController.resetPersonalization("ResetFull");
			} else {
				this._oPersController.setPersonalizationData(this._oCurrentVariant, true);
			}
		}
		// Clear apply variant flag!
		this._bApplyingVariant = false;

		this.fireAfterVariantApply({
			currentVariantId: this.getCurrentVariantId()
		});
	};

	/**
	 * Interface function for SmartVariantManagement control. It indicates, that the variant management is fully initialized.
	 *
	 * @internal
	 */
	SmartTable.prototype.variantsInitialized = function() {
		this._bVariantInitialised = true;
		this._checkAndTriggerBinding();
	};

	/**
	 * Returns the current UI state of the <code>SmartTable</code> control.<br>
	 * <b>Note:</b><br>
	 * The following limitations apply:
	 * <ul>
	 * <li>Visualizations can only be used to modify the visibility and order of columns, the template or importance of the column cannot be changed</li>
	 * <li>MaxItems is not supported</li>
	 * <li>RequestAtLeast contains values that are combined from both the <code>SmartTable</code> control property and PresentationVariant
	 * annotation, but when it is updated it only affects the internal array. The property in the <code>SmartTable</code> stays the same as before</li>
	 * <li>Changes to RequestAtLeast alone will not lead to a new data request</li>
	 * <li>RequestAtLeast is not supported in <code>AnalyticalTable</code> scenario</li>
	 * <li>Any other limitations, like the ones mentioned in {@link sap.ui.comp.state.UIState}, also apply</li>
	 * </ul>
	 *
	 * @returns {sap.ui.comp.state.UIState} Current UI state
	 * @public
	 * @since 1.52
	 */
	SmartTable.prototype.getUiState = function() {
		var oUIStateP13n = this._oPersController ? this._oPersController.getDataSuiteFormatSnapshot() : null;
		return new UIState({
			presentationVariant: {
				SortOrder: oUIStateP13n ? oUIStateP13n.SortOrder : [],
				GroupBy: oUIStateP13n ? oUIStateP13n.GroupBy : [],
				Total: oUIStateP13n ? oUIStateP13n.Total : [],
				RequestAtLeast: this._getRequestAtLeastFields(),
				Visualizations: oUIStateP13n ? oUIStateP13n.Visualizations : []
			},
			selectionVariant: {
				SelectOptions: oUIStateP13n ? oUIStateP13n.SelectOptions : []
			},
			variantName: this.getCurrentVariantId()
		});
	};

	/**
	 * Replaces the current UI state of the <code>SmartTable</code> control with the data represented in {@link sap.ui.comp.state.UIState}.<br>
	 * <b>Note:</b><br>
	 * The following limitations apply:
	 * <ul>
	 * <li>Visualizations can only be used to modify the visibility and order of columns, the template or importance of the column cannot be changed</li>
	 * <li>MaxItems is not supported</li>
	 * <li>RequestAtLeast contains values that are combined from both the <code>SmartTable</code> control property and PresentationVariant
	 * annotation, but when it is updated it only affects the internal array. The property in the <code>SmartTable</code> stays the same as before</li>
	 * <li>Changes to RequestAtLeast alone will not lead to a new data request</li>
	 * <li>RequestAtLeast is not supported in <code>AnalyticalTable</code> scenario</li>
	 * <li>Any other limitations, like the ones mentioned in {@link sap.ui.comp.state.UIState}, also apply</li>
	 * </ul>
	 *
	 * @param {sap.ui.comp.state.UIState} oUIState the new representation of UI state
	 * @public
	 * @since 1.52
	 */
	SmartTable.prototype.setUiState = function(oUIState) {
		this._setUiState(oUIState, false);
	};

	/**
	 * Replaces the current UI state of the <code>SmartTable</code> control with the data represented in {@link sap.ui.comp.state.UIState}. The UI
	 * state is handled as a variant.<br>
	 * <b>Note:</b><br>
	 * The following limitations apply:
	 * <ul>
	 * <li>Visualizations can only be used to modify the visibility and order of columns, the template or importance of the column cannot be changed</li>
	 * <li>MaxItems is not supported</li>
	 * <li>RequestAtLeast contains values that are combined from both the <code>SmartTable</code> control property and PresentationVariant
	 * annotation, but when it is updated it only affects the internal array. The property in the <code>SmartTable</code> stays the same as before</li>
	 * <li>Changes to RequestAtLeast alone will not lead to a new data request</li>
	 * <li>RequestAtLeast is not supported in <code>AnalyticalTable</code> scenario</li>
	 * <li>Any other limitations, like the ones mentioned in {@link sap.ui.comp.state.UIState}, also apply</li>
	 * </ul>
	 *
	 * @param {sap.ui.comp.state.UIState} oUIState the new representation of UI state
	 * @private
	 * @since 1.54
	 */
	SmartTable.prototype.setUiStateAsVariant = function(oUIState) {
		this._setUiState(oUIState, true);
	};

	SmartTable.prototype._setUiState = function(oUIState, bApplyAsVariant) {
		var aRequestAtLeast = oUIState.getPresentationVariant() && oUIState.getPresentationVariant().RequestAtLeast ? [].concat(oUIState.getPresentationVariant().RequestAtLeast) : [];
		if (!deepEqual(aRequestAtLeast, this._getRequestAtLeastFields())) {
			this._aAlwaysSelect = aRequestAtLeast;
		}

		if (this._oPersController) {
			if (bApplyAsVariant) {
				this._oPersController.setPersonalizationDataAsDataSuiteFormat(merge({}, oUIState.getPresentationVariant(), oUIState.getSelectionVariant()), true);
			} else {
				var oPersistentDataVariant = (this._oVariantManagement && oUIState.getVariantName()) ? this._oVariantManagement.getVariantContent(this, oUIState.getVariantName()) : {};
				this._oPersController.setDataSuiteFormatSnapshot(merge({}, oUIState.getPresentationVariant(), oUIState.getSelectionVariant()), oPersistentDataVariant, true);
			}
		}
	};

	/**
	 * Returns an Array containing the RequestAtLeast fields that includes both "requestAtLeast" property and back-end annotation fields
	 *
	 * @private
	 * @returns {Array} an Array containing the RequestAtLeast fields
	 */
	SmartTable.prototype._getRequestAtLeastFields = function() {
		var sRequestAtLeastFields = this.getRequestAtLeastFields();
		var aAlwaysSelect = sRequestAtLeastFields ? sRequestAtLeastFields.split(",") : [];
		return aAlwaysSelect.concat(this._aAlwaysSelect);
	};

	/**
	 * Event handler fired when a column is requested by Personalisation/VariantManagement
	 *
	 * @param {object} oEvent The event parameter
	 */
	SmartTable.prototype._personalisationRequestColumns = function(oEvent) {
		var aColumnKeys = oEvent.getParameter("columnKeys"), sColumnKey, i, iLength, oField, oColumn, oColumnKey2ColumnMap = {};

		iLength = aColumnKeys.length;
		for (i = 0; i < iLength; i++) {
			sColumnKey = aColumnKeys[i];
			oField = this._mLazyColumnMap[sColumnKey];
			if (oField) {
				oColumn = this._createColumnForField(oField);
				if (this._isMobileTable) {
					// Add the column to the table
					this._oTable.addColumn(oColumn);
				}
				oColumnKey2ColumnMap[oField.name] = oColumn;
			}
		}

		this._oPersController.addColumns(oColumnKey2ColumnMap);
	};

	/**
	 * eventhandler fired before personalisation changes are applied to the table
	 *
	 * @param {object} oEvent The event arguments
	 * @private
	 */
	SmartTable.prototype._beforePersonalisationModelDataChange = function(oEvent) {
		// Suppress refresh to prevent backend roundtrips
		if (this._oTable.suspendUpdateAnalyticalInfo) {
			this._oTable.suspendUpdateAnalyticalInfo();
		}
	};

	/**
	 * eventhandler fired after personalisation changes are potentially applied to the table. Event will be fired before the event
	 * "afterP13nModelDataChange"
	 *
	 * @param {object} oEvent The event arguments
	 * @private
	 */
	SmartTable.prototype._afterPersonalisationModelDataChange = function(oEvent) {
		this._updateColumnsPopinFeature();
	};

	/**
	 * eventhandler for personalisation changed
	 *
	 * @param {object} oEvent The event arguments
	 * @private
	 */
	SmartTable.prototype._personalisationModelDataChange = function(oEvent) {
		this._oCurrentVariant = oEvent.getParameter("persistentData");
		var oChangeInfo = oEvent.getParameter("runtimeDeltaDataChangeType");
		var changeStatus = this._getChangeStatus(oChangeInfo);

		if (changeStatus === "Unchanged") {
			return;
		}

		if (!(this._bApplyingVariant || this._bDeactivatingColumns)) {
			if (!this.getUseVariantManagement()) {
				this._persistPersonalisation();
			} else if (this._oVariantManagement) {
				this._oVariantManagement.currentVariantSetModified(true);
			}
		}

		if (changeStatus === "ModelChanged" && this._isTableBound()) {
			if (oChangeInfo && oChangeInfo.columns === "ModelChanged") {
				this._bForceTableUpdate = true;
			}
			// if table was bound already -and:
			// If a SmartFilter is associated with SmartTable - trigger search on the SmartFilter
			if (this._oSmartFilter) {
				this._oSmartFilter.search();
			} else {
				// Rebind Table only if data was set on it once or no smartFilter is attached!
				this._reBindTable(null);
			}
		}

		// sync sort action on the ResponsiveTable with p13n and render filter info toolbar
		if (this._isMobileTable) {
			this._adaptCustomSort();
		}

		// creates or updates the info toolbar for the SmartTable
		this._createInfoToolbar();
	};

	/**
	 * Adapt the custom sort so that the sortItems in the p13n are also in sync.
	 *
	 * @private
	 */
	SmartTable.prototype._adaptCustomSort = function() {
		if (this._oCurrentVariant) {
			var oColumnData, sColumnKey, aFoundSortItem, aSortItems = [], oMSortItem;

			if (this._oCurrentVariant.sort && this._oCurrentVariant.sort.sortItems) {
				aSortItems = this._oCurrentVariant.sort.sortItems;
			}

			this._oTable.getColumns().forEach(function(oColumn) {
				oColumnData = oColumn.data("p13nData");
				sColumnKey = oColumnData && oColumnData.columnKey;
				if (sColumnKey) {
					aFoundSortItem = aSortItems.filter(function(oSortItem) {
						return sColumnKey === oSortItem.columnKey;
					});

					oMSortItem = aFoundSortItem[0];
					if (oMSortItem) {
						if (!oColumnData.sorted) {
							oColumnData.sorted = {
								"ascending": false
							};
						}
						if (oMSortItem.operation !== SortOrder.Descending) {
							oColumnData.sorted = {
								"ascending": true
							};
						}
						oColumn.setSortIndicator(oMSortItem.operation);
					} else if (oColumnData && oColumnData.sorted) {
						oColumnData.sorted = null;
						oColumn.setSortIndicator(coreLibrary.None);
					}
				} else if (oColumn.getSortIndicator() !== SortOrder.None) {
					// executed when all the sorter are removed from the table personalisation sort dialog
					oColumn.setSortIndicator(SortOrder.None);
				}
			}, this);
		}
	};

	SmartTable.prototype.setUseInfoToolbar = function(sValue) {
		this.setProperty("useInfoToolbar", sValue, true);
		this._createInfoToolbar();
		return this;
	};

	/**
	 * Creates & updates the info toolbar to show the applied filters on the SmartTable via the table personalization dialog.
	 *
	 * @private
	 */
	SmartTable.prototype._createInfoToolbar = function() {
		var sUseInfoToolbar = this.getUseInfoToolbar(), oTable = this.getTable(), sInfoToolbarTextId = this.getId() + "-infoToolbarText";

		if (sUseInfoToolbar === InfoToolbarBehavior.Off) {
			if (this._oInfoToolbar && this._oInfoToolbar.getVisible()) {
				this._oInfoToolbar.setVisible(false);
				oTable.removeAriaLabelledBy(sInfoToolbarTextId);
			}
			return;
		}

		if (this._isMobileTable) {
			if (oTable.getInfoToolbar() && !this._oInfoToolbar) {
				Log.error("Custom infoToolbar is used, hence set useInfoToolbar property on the SmartTable with id='" + this.getId() + "' to Off");
				return;
			}

			var aFilters = this._oCurrentVariant && this._oCurrentVariant.filter && this._oCurrentVariant.filter.filterItems, iFiltersLength = aFilters && aFilters.length, aTableAriaLabelledBy = oTable.getAriaLabelledBy();

			if (iFiltersLength) {
				var aFiltersColumnLabel = [], oResourceBundle = Core.getLibraryResourceBundle("sap.ui.comp"), sFilterText = oResourceBundle.getText("SMARTTABLE_FILTERED_BY") + " ";
				aFilters.forEach(function(oFilter) {
					var sFilterColumnLabel = this._getColumnLabel(oFilter.columnKey);
					if (sFilterColumnLabel && aFiltersColumnLabel.indexOf(sFilterColumnLabel) === -1) {
						aFiltersColumnLabel.push(sFilterColumnLabel);
					}
				}, this);

				sFilterText += aFiltersColumnLabel.join(", ");

				if (!this._oInfoToolbar) {
					this._oInfoToolbar = new OverflowToolbar({
						active: true,
						design: ToolbarDesign.Info,
						content: [
							new Text({
								id: sInfoToolbarTextId,
								text: sFilterText,
								wrapping: false
							})
						],
						press: function() {
							this._showTableFilterDialog(this._getColumnByKey(aFilters[0].columnKey));
						}.bind(this)
					});
				} else {
					this._oInfoToolbar.getContent()[0].setText(sFilterText);

					if (!this._oInfoToolbar.getVisible()) {
						this._oInfoToolbar.setVisible(true);
					}
				}

				if (!oTable.getInfoToolbar()) {
					oTable.setInfoToolbar(this._oInfoToolbar);
				}

				if (aTableAriaLabelledBy.indexOf(sInfoToolbarTextId) === -1) {
					oTable.addAriaLabelledBy(sInfoToolbarTextId);
				}
			} else if (this._oInfoToolbar && this._oInfoToolbar.getVisible()) {
				this._oInfoToolbar.setVisible(false);
				oTable.removeAriaLabelledBy(sInfoToolbarTextId);
			}
		}
	};

	/**
	 * returns the current filter and sorting options from the table personalisation/variants
	 *
	 * @private
	 * @param {object} oChangeInfo The change info given by the personalization controller
	 * @returns {sap.ui.comp.personalization.ChangeType} the merged change status
	 */
	SmartTable.prototype._getChangeStatus = function(oChangeInfo) {
		if (!oChangeInfo) {
			// change info not provided return ModelChanged to indicate that we need to update everything internally
			return "ModelChanged";
		}

		if (oChangeInfo.sort === "ModelChanged" || oChangeInfo.filter === "ModelChanged" || oChangeInfo.columns === "ModelChanged" || oChangeInfo.group === "ModelChanged") {
			// model has changed and was not applied to table
			return "ModelChanged";
		}

		if (oChangeInfo.sort === "TableChanged" || oChangeInfo.filter === "TableChanged" || oChangeInfo.columns === "TableChanged" || oChangeInfo.group === "TableChanged") {
			// change was already applied to table
			return "TableChanged";
		}

		return "Unchanged";
	};

	/**
	 * returns the current filter and sorting options from the table personalisation/variants
	 *
	 * @private
	 * @returns {object} current variant's filter and sorting options
	 */
	SmartTable.prototype._getTablePersonalisationData = function() {
		// Clear the fields that are part of $select due to grouping (sap.m.Table)
		this._mSelectExpandForGroup = null;

		if (!this._oCurrentVariant) {
			return null;
		}

		var aSorters = [], aFilters = [], aExcludeFilters = [], oExcludeFilters, oGroupItem, oGroupSorter, aSortData, oColumn, oColumnData, sGroupPath, sAdditionalGroupPath, sAdditionalPath, sPath, mAdditionalSorters = {}, mExistingSorters = {}, sColumnsText = "", bIsTimeField;

		// group handling
		if (this._isMobileTable && this._oCurrentVariant.group && this._oCurrentVariant.group.groupItems) {
			oGroupItem = this._oCurrentVariant.group.groupItems[0];
			// Exclude deactivated columns
			if (this._aDeactivatedColumns.indexOf(oGroupItem.columnKey) < 0) {
				oColumn = this._getColumnByKey(oGroupItem.columnKey);
				if (oColumn) {
					sColumnsText = oColumn.getHeader().getText();
				}
				sPath = this._getPathFromColumnKeyAndProperty(oGroupItem.columnKey, "sortProperty");
			}
			// Path can be null if the variant data is invalid/contains only invalid information
			if (sPath) {
				// Initialise the GroupPath(s) to new variable(s) as they are being used in the formatter function
				sGroupPath = sPath;
				sAdditionalGroupPath = null;
				var oFieldMetadata = this._mFieldMetadataByKey[oGroupItem.columnKey], fnGroupFunction;
				if (oFieldMetadata) {
					sAdditionalGroupPath = oFieldMetadata.unit || oFieldMetadata.description;
					fnGroupFunction = FormatUtil.getInlineGroupFormatterFunction(oFieldMetadata);
				}
				oGroupSorter = new Sorter(sGroupPath, oGroupItem.operation === "GroupDescending", function(oContext) {
					var sKey = oContext.getProperty(sGroupPath), sAdditionalValue;
					if (fnGroupFunction) {
						if (sAdditionalGroupPath) {
							sAdditionalValue = oContext.getProperty(sAdditionalGroupPath);
						}
						sKey = fnGroupFunction(sKey, sAdditionalValue);
					}
					// Until there is a better empty handling concept use "" for empty values in grouping!
					if (sKey === undefined || sKey === null) {
						sKey = "";
					}
					return {
						key: sKey,
						text: sColumnsText ? sColumnsText + ": " + sKey : sKey
					};
				});

				// Add the necessary group field(s) to a select/expand group map, so that it can be added to $select, $expand
				this._mSelectExpandForGroup = {
					select: [
						sGroupPath
					]
				};
				if (oFieldMetadata) {
					if (oFieldMetadata.additionalProperty) {
						this._mSelectExpandForGroup.select.push(oFieldMetadata.additionalProperty);
					}
					if (oFieldMetadata.navigationProperty) {
						this._mSelectExpandForGroup.expand = [
							oFieldMetadata.navigationProperty
						];
					}
				}
				aSorters.push(oGroupSorter);
			}
		}

		// sort handling
		if (this._oCurrentVariant.sort) {
			aSortData = this._oCurrentVariant.sort.sortItems;
		} else {
			aSortData = this._aInitialSorters;
		}

		if (aSortData) {
			aSortData.forEach(function(oModelItem, iIndex) {
				var bDescending = oModelItem.operation === "Descending";
				// Path has be re-calculated below
				sPath = null;
				sAdditionalPath = null;
				// Exclude deactivated columns
				if (this._aDeactivatedColumns.indexOf(oModelItem.columnKey) < 0) {
					sPath = this._getPathFromColumnKeyAndProperty(oModelItem.columnKey, "sortProperty");
				}
				// Path can be null if the variant data is invalid/contains only invalid information
				if (sPath) {
					if (oGroupSorter && oGroupSorter.sPath === sPath) {
						oGroupSorter.bDescending = bDescending;
					} else {
						var oFieldMetadata = this._mFieldMetadataByKey[oModelItem.columnKey];

						// check for custom column
						// !oFieldMetadata indicates that sPath is a custom column
						if (!oFieldMetadata) {
							oColumn = this._getColumnByKey(oModelItem.columnKey);
							oColumnData = oColumn.data("p13nData");
						}

						if (this._bMultiUnitBehaviorEnabled && ((oFieldMetadata && oFieldMetadata.isCurrencyField) || (oColumnData && oColumnData.isCurrency))) {
							sAdditionalPath = oFieldMetadata ? oFieldMetadata.unit : oColumnData.unit;

							if (sAdditionalPath && !mAdditionalSorters[sAdditionalPath]) {
								mAdditionalSorters[sAdditionalPath] = {
									index: iIndex,
									descending: bDescending
								};
							}
						}

						mExistingSorters[sPath] = {};

						if (mExistingSorters[sAdditionalPath]) {
							delete mAdditionalSorters[sAdditionalPath];
						} else if (mAdditionalSorters[sPath]) {
							delete mAdditionalSorters[sPath];
						}

						aSorters.push(new Sorter(sPath, bDescending));
					}
				}
			}, this);

			var aAdditionalSorterPaths = Object.keys(mAdditionalSorters),
				iAdditionalSorterIndex;
			if (aAdditionalSorterPaths.length) {
				aAdditionalSorterPaths.reverse().forEach(function(sAdditionalSorterPath) {
					iAdditionalSorterIndex = oGroupSorter ? mAdditionalSorters[sAdditionalSorterPath].index + 1 : mAdditionalSorters[sAdditionalSorterPath].index;
					aSorters.splice(iAdditionalSorterIndex, 0, new Sorter(sAdditionalSorterPath, mAdditionalSorters[sAdditionalSorterPath].descending));
				});
			}
		}

		// Filter Handling
		if (this._oCurrentVariant.filter) {
			this._oCurrentVariant.filter.filterItems.forEach(function(oModelItem) {
				var oValue1 = oModelItem.value1,
					oValue2 = oModelItem.value2,
					sOperation;

				// Filter path has be re-calculated below
				sPath = null;
				bIsTimeField = false;
				oColumn = null;
				// Exclude deactivated columns
				if (this._aDeactivatedColumns.indexOf(oModelItem.columnKey) < 0) {
					oColumn = this._getColumnByKey(oModelItem.columnKey);
				}
				if (oColumn) {
					if (oColumn.getFilterProperty) {
						sPath = oColumn.getFilterProperty();
					}
					oColumnData = oColumn.data("p13nData");
					if (oColumnData) {
						bIsTimeField = oColumnData.type === "time";
						if (!sPath) {
							sPath = oColumnData["filterProperty"];
						}
					}
				}
				// Path can be null if the variant data is invalid/contains only invalid information
				if (sPath) {
					if (bIsTimeField) {
						if (oValue1 instanceof Date) {
							oValue1 = FormatUtil.getEdmTimeFromDate(oValue1);
						}
						if (oValue2 instanceof Date) {
							oValue2 = FormatUtil.getEdmTimeFromDate(oValue2);
						}
					} else {
						var bIsTypeDateTimeOffset = oColumnData && oColumnData.typeInstance && oColumnData.typeInstance.getName() === "sap.ui.model.odata.type.DateTimeOffset";
						if (oValue1 instanceof Date && !bIsTypeDateTimeOffset && this._oTableProvider && this._oTableProvider.getIsUTCDateHandlingEnabled()) {
							// only update the time of the values when it is not of type DateTimeOffset
							// this is similar to the date value handling inside the FilterProvider. For type DateTimeOffset we do NOT correct the
							// time.
							oValue1 = DateTimeUtil.localToUtc(oValue1);
							oValue2 = oValue2 ? DateTimeUtil.localToUtc(oValue2) : oValue2;
						}
					}

					var aFilterArrReference = (oModelItem.exclude ? aExcludeFilters : aFilters);
					if (oModelItem.operation === "Empty") {
						var sFilterOperator = oModelItem.exclude ? FilterOperator.NE : FilterOperator.EQ;

						if (oColumnData.edmType === "Edm.String") {
							aFilterArrReference.push(new Filter(sPath, sFilterOperator, ""));
						}
						if (oColumnData.nullable) {
							// When the field is nullable we should also add the eq null filter
							aFilterArrReference.push(new Filter(sPath, sFilterOperator, null));
						}
					} else {
						sOperation = oModelItem.exclude ? FilterUtil.getTransformedExcludeOperation(oModelItem.operation) : oModelItem.operation;
						aFilterArrReference.push(new Filter(sPath, sOperation, oValue1, oValue2));
					}

				}
			}, this);

			if (aExcludeFilters.length) {
				oExcludeFilters = new Filter(aExcludeFilters, true);
			}
		}

		return {
			filters: aFilters,
			excludeFilters: oExcludeFilters,
			sorters: aSorters
		};
	};

	/**
	 * Returns the column for the given column key
	 *
	 * @param {string} sColumnKey - the column key for the required column
	 * @returns {object} The found column or null
	 * @private
	 */
	SmartTable.prototype._getColumnByKey = function(sColumnKey) {
		var aColumns, oColumn, iLength, i, oCustomData;
		if (this._oTable) {
			aColumns = this._oTable.getColumns();
			iLength = aColumns.length;
			for (i = 0; i < iLength; i++) {
				oColumn = aColumns[i];
				oCustomData = oColumn.data("p13nData");
				if (oCustomData && oCustomData.columnKey === sColumnKey) {
					return oColumn;
				}
			}
		}

		return null;
	};

	/**
	 * Retrieves the path for the specified property and column key from the array of table columns
	 *
	 * @param {string} sColumnKey - the column key specified on the table
	 * @param {string} sProperty - the property path that needs to be retrieved from the column
	 * @returns {string} The path that can be used by sorters, filters etc.
	 * @private
	 */
	SmartTable.prototype._getPathFromColumnKeyAndProperty = function(sColumnKey, sProperty) {
		var sPath = null, oColumn, oColumnData;
		oColumn = this._getColumnByKey(sColumnKey);

		// Retrieve path from the property
		if (oColumn) {
			if (sProperty == "sortProperty" && oColumn.getSortProperty) {
				sPath = oColumn.getSortProperty();
			} else if (sProperty == "filterProperty" && oColumn.getFilterProperty) {
				sPath = oColumn.getFilterProperty();
			} else if (sProperty == "leadingProperty" && oColumn.getLeadingProperty) {
				sPath = oColumn.getLeadingProperty();
			}

			if (!sPath) {
				oColumnData = oColumn.data("p13nData");
				if (oColumnData) {
					sPath = oColumnData[sProperty];
				}
			}
		}

		return sPath;
	};

	/**
	 * triggers (hidden) VariantManagementControl to persist personalisation this function is called in case no VariantManagementControl is used
	 *
	 * @private
	 */
	SmartTable.prototype._persistPersonalisation = function() {
		if (this._oVariantManagement && !this._oVariantManagement.isPageVariant()) {
			var sPersonalisationVariantKey = this.getCurrentVariantId();
			// It seems Save is triggered again during Save by perso controller!
			if (!this._bSaving) {
				this._bSaving = true;
				this._oVariantManagement.fireSave({
					name: "Personalisation",
					implicit: true,
					global: false,
					overwrite: !!sPersonalisationVariantKey,
					key: sPersonalisationVariantKey,
					def: true
				});
				delete this._bSaving;
			}
		}
	};

	/**
	 * returns the id of the currently selected variant.
	 *
	 * @public
	 * @returns {string} id of the currently selected variant
	 */
	SmartTable.prototype.getCurrentVariantId = function() {
		return this._oVariantManagement ? this._oVariantManagement.getCurrentVariantId() : "";
	};

	/**
	 * Set the current variant according to the sVariantId. In case an empty string or null or undefined was passed the STANDARD will be set. STANDARD
	 * will also be set, in case the passed sVariantId could not be found. In case neither a flexibility variant, nor the content for the standard
	 * variant could not be obtained, nor the personalisable control obtained nothing will be executed/changed
	 *
	 * @public
	 * @param {string} sVariantId id of the currently selected variant
	 * @returns {Object} the control instance
	 */
	SmartTable.prototype.setCurrentVariantId = function(sVariantId) {
		if (this._oVariantManagement && !this._oVariantManagement.isPageVariant()) {
			this._oVariantManagement.setCurrentVariantId(sVariantId);
		} else {
			Log.error("sap.ui.comp.smarttable.SmartTable.prototype.setCurrentVariantId: VariantManagement does not exist, or is a page variant");
		}
		return this;
	};

	/**
	 * Checks whether the control is initialised
	 *
	 * @returns {boolean} returns whether control is already initialised
	 * @protected
	 */
	SmartTable.prototype.isInitialised = function() {
		return !!this.bIsInitialised;
	};

	SmartTable.prototype._aAvailablePanels = [
		"Columns", "Sort", "Filter", "Group"
	];

	/**
	 * Opens the desired panel of the personalization dialog.<br>
	 * <i>Note:</i> Calling this for panels that are globally hidden (E.g. manually by the application, or due to unavailability of functionality)
	 * leads to an empty dialog being shown.
	 *
	 * @param {string} sPanel The desired panel; the value is either "Columns", "Sort", "Filter" or "Group"
	 * @public
	 * @since 1.48.0
	 */
	SmartTable.prototype.openPersonalisationDialog = function(sPanel) {
		if (!sPanel || this._aAvailablePanels.indexOf(sPanel) < 0) {
			Log.warning("sap.ui.comp.smarttable.SmartTable.prototype.openPersonalisationDialog: " + sPanel + " is not a valid panel!");
			return;
		}
		if (this._oPersController) {
			var oPanel = {};
			oPanel[sPanel.toLowerCase()] = {
				visible: true
			};
			this._oPersController.openDialog(oPanel);
		}
	};

	/**
	 * Deactivates existing columns in the personalization dialog based on the provided column keys.<br>
	 * <i>Note:</i> The columns are set to invisible and excluded from all panels in the table personalization. Any existing sorting, filtering or
	 * grouping in the personalization dialog for such columns will no longer be taken into account.
	 *
	 * @param {string[]|null|undefined} aColumnKeys An array of column keys by which the corresponding columns are deactivated. If <code>null</code>
	 *        or <code>undefined</code> or an empty array is passed, no column is deactivated, and all previously deactivated columns will be reset
	 * @public
	 * @since 1.54.0
	 */
	SmartTable.prototype.deactivateColumns = function(aColumnKeys) {
		this._aDeactivatedColumns = aColumnKeys || [];

		this._bDeactivatingColumns = true;
		// When there is no perso controller - nothing will be done as the user cannot even use settings and can simply remove the column via code
		if (this._oPersController) {
			this._oPersController.addToSettingIgnoreColumnKeys(aColumnKeys);
		}
		this._bDeactivatingColumns = false;
	};

	/**
	 * Handler for inner/UI5 table paste event
	 *
	 * @param {object} oEvent - the event object
	 * @private
	 */
	SmartTable.prototype._onInnerTablePaste = function(oEvent) {
		// No callback/listeners for both --> not need for paste event; return
		if (!this.hasListeners("beforePaste") && !this.hasListeners("paste")) {
			return;
		}

		var aPastedData = oEvent.getParameter("data");
		var aPastedDataCopy = aPastedData.slice(0); // copy to avoid changing original event array
		var aColumnInfo = this._getColumnInfoForPaste();
		// Proceed if default is not prevented
		if (this.fireBeforePaste({
			columnInfos: aColumnInfo
		})) {
			sap.ui.require([
				"sap/ui/core/util/PasteHelper"
			], function(PasteHelper) {
				PasteHelper.parse(aPastedDataCopy, aColumnInfo).then(function(oResult) {
					this.firePaste({
						result: oResult
					});
				}.bind(this));
			}.bind(this));
		}
	};

	/**
	 * Get ColumnInfo array for paste handling
	 *
	 * @returns {Array} array of columnInfo objects
	 * @private
	 */
	SmartTable.prototype._getColumnInfoForPaste = function() {
		var aColumnInfo = [], aColumns = this._oTable.getColumns(), i, iLen = aColumns.length, oColumn, oColumnData, sPath, sType, oType, sAdditionalPath;

		if (this._isMobileTable && aColumns.length) {
			aColumns = aColumns.sort(function(oCol1, oCol2) {
				return oCol1.getOrder() - oCol2.getOrder();
			});
		}

		for (i = 0; i < iLen; i++) {
			oColumn = aColumns[i];
			sPath = null;
			sAdditionalPath = null;
			if (oColumn.getVisible()) {
				if (oColumn.getLeadingProperty) {
					sPath = oColumn.getLeadingProperty();
				}
				oColumnData = oColumn.data("p13nData");
				if (!sPath && oColumnData) {
					sPath = oColumnData["leadingProperty"];
				}
				sType = oColumnData.type === "numeric" ? "number" : oColumnData.type;
				// Use typeInstance which is as of now used for p13n alone
				oType = oColumnData["typeInstance"];

				if (oColumnData.isCurrency || sType === "number") {
					sAdditionalPath = oColumnData.unit;
				} else if (oColumnData.description && oColumnData.displayBehaviour !== "idOnly") { // check this last as at times numeric, date other
					// fields too might have a description
					sAdditionalPath = oColumnData.description;
				}
			}
			// This is the leadingProperty
			aColumnInfo.push({
				columnId: oColumn.getId(),
				property: sPath,
				ignore: !sPath, // generate a dummy columnInfo --> if there is no leadingProperty
				type: oType
			});

			// Description/Unit
			oType = ODataType.getType("Edm.String"); // assume string for Unit, Description.
			if (sAdditionalPath) {
				aColumnInfo.push({
					columnId: oColumn.getId(),
					additionalProperty: true, // present/set for UoM, currency and ID/Desc scenarios
					property: sAdditionalPath,
					type: oType
				});
			}
		}

		return aColumnInfo;
	};

	/**
	 * Cleans up the control
	 *
	 * @protected
	 */
	SmartTable.prototype.exit = function() {
		var i, oField;
		this.detachEvent("_change", this._onPropertyChange, this);
		// Cleanup smartFilter events as it can be used again stand-alone without being destroyed!
		if (this._oSmartFilter) {
			this._oSmartFilter.detachSearch(this._reBindTable, this);
			this._oSmartFilter.detachFilterChange(this._filterChangeEvent, this);
			this._oSmartFilter = null;
		}
		if (this._oTableProvider && this._oTableProvider.destroy) {
			this._oTableProvider.destroy();
		}
		this._oTableProvider = null;
		if (this._oPersController && this._oPersController.destroy) {
			this._oPersController.destroy();
		}
		this._oPersController = null;
		if (this._oVariantManagement) {
			this._oVariantManagement.detachSave(this._variantSaved, this);
			this._oVariantManagement.detachAfterSave(this._variantAfterSave, this);
			if (!this._oVariantManagement.isPageVariant() && this._oVariantManagement.destroy) {
				this._oVariantManagement.destroy();
			}
		}
		this._oNumberFormatInstance = null;
		FullScreenUtil.cleanUpFullScreen(this);

		if (this._oEditModel) {
			this._oEditModel.destroy();
		}

		if (this._oNoData && this._oNoData.destroy) {
			this._oNoData.destroy();
		}
		this.oNoData = null;

		// Destroy template controls for fields that have not been added as columns
		if (this._aTableViewMetadata) {
			i = this._aTableViewMetadata.length;
			while (i--) {
				oField = this._aTableViewMetadata[i];
				if (oField && !oField.isColumnCreated && oField.template) {
					oField.template.destroy();
				}
			}
		}
		this._aTableViewMetadata = null;
		this._mFieldMetadataByKey = null;
		this._mSelectExpandForGroup = null;
		this._oEditModel = null;
		this._oVariantManagement = null;
		this._oCurrentVariant = null;
		this._aExistingColumns = null;
		this._mLazyColumnMap = null;
		this._aColumnKeys = null;
		this._aDeactivatedColumns = null;
		this._aAlwaysSelect = null;
		this._oCustomToolbar = null;
		// Destroy the toolbar if it is not already inserted into items; else it will automatically be destroyed
		if (this._oToolbar && !this._bToolbarInsertedIntoItems) {
			this._oToolbar.destroy();
		}
		this._oToolbar = null;
		if (this._oUseExportToExcel && !this.getUseExportToExcel()) {
			this._oUseExportToExcel.destroy();
		}
		this._oUseExportToExcel = null;
		this._oTablePersonalisationButton = null;
		this._oP13nDialogSettings = null;
		// Destroy the template always as templateShareable=true (default =1)!
		if (this._oTemplate) {
			this._oTemplate.destroy();
		}
		this._oTemplate = null;
		// Delete reference to InterceptService
		this._InterceptService = null;
		// Destory ResponsivePopover and set its buttons to null
		if (this._oColumnHeaderPopover) {
			this._oColumnHeaderPopover.destroy();
		}
		this._oColumnHeaderPopover = null;
		this._oFilterButton = null;
		this._oSortButton = null;
		this._oInfoToolbar = null;
		this._oView = null;
		this._oTable = null;
	};

	return SmartTable;

});
