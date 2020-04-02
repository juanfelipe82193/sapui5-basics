/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	'sap/ui/core/Control', './library', 'sap/m/library', './ActionToolbar', 'sap/m/Text', 'sap/m/Title', 'sap/ui/core/format/NumberFormat', 'sap/ui/model/Sorter', 'sap/ui/core/dnd/DragDropInfo', "./table/TableSettings", "./table/GridTableType", "./table/ResponsiveTableType", "sap/m/ColumnHeaderPopover", "sap/ui/core/Item", "sap/m/ColumnPopoverSortItem"
], function(Control, library, MLibrary, ActionToolbar, Text, Title, NumberFormat, Sorter, DragDropInfo, TableSettings, GridTableType, ResponsiveTableType, ColumnHeaderPopover, Item, ColumnPopoverSortItem) {
	"use strict";

	var SelectionMode = library.SelectionMode;
	var TableType = library.TableType;
	var RowAction = library.RowAction;

	var sFilterInterface = "sap.ui.mdc.IFilter";

	function showMessage(sTextKey, aValues) {
		sap.ui.require([
			"sap/m/MessageToast"
		], function(MessageToast) {
			var oRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");
			MessageToast.show(oRb.getText(sTextKey, aValues));
		});
	}

	/**
	 * Constructor for a new Table.
	 *
	 * @param {string} [sId] Optional ID for the new control; generated automatically if no non-empty ID is given
	 * @param {object} [mSettings] Object with initial settings for the new control
	 * @class A metadata-driven table to simplify the usage of existing tables, such as the <code>sap.m.Table</code> and <code>sap.ui.table</code>
	 *        controls.
	 *        <h3>Overview</h3>
	 *        The <code>Table</code> control creates a <code>ResponsiveTable</code> or <code>GridTable</code> based on the configuration
	 *        specified.
	 *        <h3>Structure</h3>
	 *        The <code>columns</code> aggregation must be specified with the columns you require, along with with the template for the cell. The
	 *        cell template can also be created lazily via the {@link #getDelegate table delegate}.<br>
	 *        <b>Note:</b> The control is experimental and the API/behavior is not finalized and hence this should not be used for productive usage.
	 * @extends sap.ui.core.Control
	 * @author SAP SE
	 * @constructor The API/behavior is not finalized and hence this control should not be used for productive usage.
	 * @private
	 * @experimental
	 * @since 1.58
	 * @alias sap.ui.mdc.Table
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Table = Control.extend("sap.ui.mdc.Table", {
		library: "sap.ui.mdc",
		metadata: {
			designtime: "sap/ui/mdc/designtime/Table.designtime",
			defaultAggregation: "columns",
			properties: {
				/**
				 * Width of the table.
				 */
				width: {
					type: "sap.ui.core.CSSSize",
					group: "Dimension",
					defaultValue: null,
					invalidate: true
				},
				/**
				 * Height of the table.
				 */
				height: {
					type: "sap.ui.core.CSSSize",
					group: "Dimension",
					defaultValue: null,
					invalidate: true
				},
				/**
				 * Specifies the actions available for a table row.
				 *
				 * @since 1.60
				 */
				rowAction: {
					type: "sap.ui.mdc.RowAction[]"
				},
				/**
				 * Specifies the personalization options for the table.<br>
				 * <b>Note:</b> The order of the options does not influence the position on the UI.
				 *
				 * @since 1.62
				 */
				p13nMode: {
					type: "sap.ui.mdc.TableP13nMode[]"
				},
				/**
				 * Path to <code>TableDelegate</code> module that provides the required APIs to create table content.<br>
				 * <b>Note:</b> Ensure that the related file can be requested (any required library has to be loaded before that).<br>
				 * Do not bind or modify the module. Once the required module is associated, this property might not be needed any longer.
				 *
				 * @experimental
				 */
				delegate: {
					type: "object",
					defaultValue: {
						name: "sap/ui/mdc/TableDelegate",
						payload : {}
					}
				},
				/**
				 * Contains the information required for binding the rows/items of the table. Changes to this property are only reflected once the
				 * next complete rebind on the table occurs.<br>
				 * <b>Note:</b> Do not add filters and sorters here as they will not be shown on the <code>p13n</code> panels of the table.
				 *
				 * @experimental
				 */
				rowsBindingInfo: {
					type: "object",
					defaultValue: null
				},
				/**
				 * Binds the table automatically after the initial creation or re-creation of the table using the relevant <code>metadataInfo</code>
				 * and <code>rowBindingInfo</code>.
				 */
				autoBindOnInit: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},
				/**
				 * Specifies the header text that is shown in the table.
				 */
				header: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},
				/**
				 * Determines whether the header text is shown in the table. Even when set to <code>false</code>, the given header text is used to
				 * label the table correctly for accessibility purposes.
				 *
				 * @since 1.63
				 */
				headerVisible: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},
				initiallyVisibleFields: {
					type: "string[]"
				},
				/**
				 * Selection mode of the Table. This property controls whether single or multiple rows can be selected and how the selection can be
				 * extended. It may also influence the visual appearance.
				 */
				selectionMode: {
					type: "sap.ui.mdc.SelectionMode",
					defaultValue: SelectionMode.None
				},
				/**
				 * If set to <code>true</code> (default), the number of rows is shown along with the header text.<br>
				 * If set to <code>false</code>, the number of rows is not shown on the user interface.<br>
				 * <b>Note:</b><br>
				 * To improve the performance of your application, you do not want to send dedicated OData requests. Therefore, you must configure the
				 * count mode either in the model or in the binding of the table.<br>
				 * This property can only be used if the back-end service supports row count.
				 */
				showRowCount: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * Defines the number of records to be requested from the model. If the <code>type</code> property is set to
				 * <code>ResponsiveTable</code>, then this property refers to the {@link sap.m.ListBase#getGrowingThreshold growingThreshold}
				 * property of <code>sap.m.Table</code> If the <code>type</code> property is set to the <code>Table</code>, then this property
				 * refers to the {@link sap.ui.table.Table#getThreshold threshold} property of <code>sap.ui.table.Table</code><br>
				 * <b>Note:</b> This property only takes effect if it is set to a positive integer value. Otherwise the table uses the default value
				 * of the corresponding table types.
				 *
				 * @since 1.63
				 */
				threshold: {
					type: "int",
					group: "Appearance",
					defaultValue: -1
				},

				/**
				 * Defines the no data text shown in the table.
				 *
				 * @since 1.63
				 */
				noDataText: {
					type: "string"
				},

				/**
				 * Defines the sort conditions.
				 *
				 * <b>Note:</b> This property is exclusively used for handling flexibility changes. Do not use it for anything else.
				 *
				 * @since 1.73
				 */
				sortConditions: {
					type: "object"
				}
			},
			aggregations: {
				_content: {
					type: "sap.ui.core.Control",
					multiple: false,
					visibility: "hidden"
				},
				/**
				 * Type of the table.
				 */
				type: {
					type: "sap.ui.mdc.table.TableTypeBase",
					altTypes: [
						"sap.ui.mdc.TableType"
					],
					multiple: false
				},
				/**
				 * Columns of the table.
				 */
				columns: {
					type: "sap.ui.mdc.table.Column",
					multiple: true
				},

				/**
				 * This row can be used for user input to create new data if {@link sap.ui.mdc.TableType TableType} is "<code>Table</code>".
				 */
				creationRow: {
					type: "sap.ui.mdc.table.CreationRow",
					multiple: false
				},

				/**
				 * Additional/external actions available for the table.
				 */
				actions: {
					type: "sap.ui.core.Control",
					multiple: true,
					forwarding: {
						getter: "_createToolbar",
						aggregation: "actions"
					}
				},

				/**
				 * <code>VariantManagement<code> control for the table.
				 */
				variant: {
					type: "sap.ui.fl.variants.VariantManagement",
					multiple: false,
					forwarding: {
						getter: "_createToolbar",
						aggregation: "between"
					}
				}
			},
			associations: {
				/**
				 * Control or object which enables the table to do filtering, such as {@link sap.ui.mdc.FilterBar}. Also see
				 * {@link sap.ui.mdc.IFilter}.
				 */
				filter: {
					type: sFilterInterface,
					multiple: false
				}
			},
			events: {
				/**
				 * Fired if a row in the table is pressed.
				 */
				rowPress: {
					parameters: {
						bindingContext: {
							type: "sap.ui.model.Context"
						}
					}
				},
				/**
				 * Fired if the selection in the table is changed.
				 */
				selectionChange: {
					parameters: {
						bindingContext: {
							type: "sap.ui.model.Context"
						},
						selected: {
							type: "boolean"
						},
						selectAll: {
							type: "boolean"
						}
					}
				}
			}
		},
		constructor: function() {
			this._oTableReady = new Promise(this._resolveTable.bind(this));
			Control.apply(this, arguments);
			this.bCreated = true;
			this._doOneTimeOperations();
			this._initializeContent();
		},
		renderer: {
			apiVersion: 2,
			render: function(oRm, oControl) {
				oRm.openStart("div", oControl);
				oRm.class("sapUiMdcTable");
				oRm.style("height", oControl.getHeight());
				oRm.style("width", oControl.getWidth());
				oRm.openEnd();
				oRm.renderControl(oControl.getAggregation("_content"));
				oRm.close("div");
			}
		}
	});

	Table.prototype.done = function() {
		return this._oTableReady;
	};

	Table.prototype._resolveTable = function(resolve, reject) {
		this._fResolve = resolve;
		this._fReject = reject;
	};

	// ----Type----
	Table.prototype._getStringType = function(oTypeInput) {
		var sType, oType = sType = oTypeInput || this.getType();
		if (!oType) {
			sType = TableType.Table; // back to the default behaviour
		} else if (typeof oType === "object") {
			sType = oType.isA("sap.ui.mdc.table.ResponsiveTableType") ? TableType.ResponsiveTable : TableType.Table;
		}
		return sType;
	};

	Table.prototype._updateTypeSettings = function() {
		var oType = this.getType();
		if (oType && typeof oType === "object") {
			oType.updateTableSettings();
		} else {
			oType = oType === "ResponsiveTable" ? ResponsiveTableType : GridTableType;
			// Use defaults from Type
			oType.updateDefault(this._oTable);
		}
	};

	Table.prototype.setType = function(vType) {
		var sType = this._getStringType(vType);
		var sOldType = this._getStringType();

		this.setAggregation("type", vType, true);

		if (sType === sOldType && this._oTable) {
			// Update settings of inner table
			this._updateTypeSettings();
			return this;
		}

		if (this.bCreated) {
			if (this._oTable) {
				if (sOldType === "ResponsiveTable") {
					this._oTable.setHeaderToolbar();
				} else {
					this._oTable.removeExtension(this._oToolbar);
				}
				this._oTable.destroy("KeepDom");
				this._oTable = null;
				this._bTableExists = false;
			} else {
				// reject any pending promise
				this._onAfterTableCreated();
			}
			if (this._oTemplate) {
				this._oTemplate.destroy();
				this._oTemplate = null;
			}
			// recreate the promise when switching table
			this._oTableReady = new Promise(this._resolveTable.bind(this));
			this._initializeContent();
		}
		return this;
	};
	// ----End Type----

	/**
	 * Sets the busy state on the inner table. The busy state will not be
	 * applied to the sap.ui.mdc.Table itself.
	 *
	 * @param {boolean} bBusy Busy state that is applied to the inner table
	 * @returns {sap.ui.mdc.Table} Returns <code>this</code> to allow method chaining
	 */
	Table.prototype.setBusy = function(bBusy) {
		this.setProperty('busy', bBusy, true);

		if (this._oTable) {
			this._oTable.setBusy(bBusy);
		}

		return this;
	};

	Table.prototype.setSelectionMode = function(sMode) {
		var sOldMode = this.getSelectionMode();
		this.setProperty("selectionMode", sMode, true);
		if (this._oTable && sOldMode != this.getSelectionMode()) {
			this._updateSelectionBehavior();
		}
		return this;
	};

	Table.prototype.setRowAction = function(aActions) {
		var aOldActions = this.getRowAction();
		this.setProperty("rowAction", aActions, true);
		// As there is only 1 possible action right now simply check for length and the 1st/only item
		if (((aActions && aActions.length) != (aOldActions && aOldActions.length)) || aOldActions[0] != aActions[0]) {
			this._updateRowAction();
		}
		return this;
	};

	Table.prototype.setCreationRow = function(oCreationRow) {
		this.setAggregation("creationRow", oCreationRow, true);

		if (oCreationRow) {
			oCreationRow.update();
		}

		return this;
	};

	Table.prototype.setP13nMode = function(aMode) {
		var aOldMode = this.getP13nMode();
		this.setProperty("p13nMode", aMode, true);
		this._updatep13nSettings(aOldMode, aMode);
		return this;
	};

	Table.prototype.setThreshold = function(iThreshold) {
		this.setProperty("threshold", iThreshold, true);
		if (!this._oTable) {
			return this;
		}

		iThreshold = this.getThreshold() > -1 ? this.getThreshold() : undefined;
		if (this._bMobileTable) {
			this._oTable.setGrowingThreshold(iThreshold);
		} else {
			this._oTable.setThreshold(iThreshold);
		}
		return this;
	};

	Table.prototype.setNoDataText = function(sNoData) {
		this.setProperty("noDataText", sNoData, true);
		if (!this._oTable) {
			return this;
		}

		var sNoDataText = this._getNoDataText();
		if (this._bMobileTable) {
			this._oTable.setNoDataText(sNoDataText);
		} else {
			this._oTable.setNoData(sNoDataText);
		}
		return this;
	};

	Table.prototype._getNoDataText = function() {
		if (!this._sFallbackNoData) {
			var oRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");
			this._sFallbackNoData = oRb.getText("table.NO_DATA", "No items available.");
		}
		return this.getNoDataText() || this._sFallbackNoData;
	};

	Table.prototype._updateRowAction = function() {
		if (!this._oTable) {
			return;
		}
		var bNavigation = (this.getRowAction() || []).indexOf(RowAction.Navigation) > -1;
		var oType = this._bMobileTable ? ResponsiveTableType : GridTableType;
		// For ResponsiveTable itemPress event is registered during creation
		oType.updateRowAction(this, bNavigation, this._bMobileTable ? undefined : this._onRowActionPress);
	};

	Table.prototype._initializeContent = function() {
		var sType = this._getStringType();
		var oType = sType === "ResponsiveTable" ? ResponsiveTableType : GridTableType;
		// Load the necessary modules via the corresponding TableType
		Promise.all([
			this.oTableDelegateLoaded, oType.loadTableModules()
		]).then(function() {
			// The table type might be switched while the necessary libs, modules are being loaded; hence the below checks
			if (this.bIsDestroyed) {
				return;
			}
			// The table type might be switched while the necessary libs, modules are being loaded; hence the below checks
			if (!this._bTableExists && sType === this._getStringType()) {
				this._bMobileTable = sType === "ResponsiveTable";
				this._createContent();
				this._bTableExists = true;
			}
		}.bind(this));
	};

	Table.prototype._doOneTimeOperations = function() {
		// Load the delegate once after init
		if (!this.oTableDelegateLoaded) {
			this.oTableDelegateLoaded = new Promise(function(resolve, reject) {
				var sTableDelegateModule = this.getDelegate().name;
				sap.ui.require([
					sTableDelegateModule
				], function(TableDelegate) {
					this.oTableDelegate = TableDelegate;
					resolve();
				}.bind(this), function() {
					reject("Faled to load delegate");
				});
			}.bind(this));
		}
		// Order the Columns once after init
		if (!this.bColumnsOrdered) {
			this.bColumnsOrdered = true;
			this._orderColumns();
		}
	};

	Table.prototype._onAfterTableCreated = function(bResult) {
		if (bResult && this._fResolve) {
			this._fResolve(this);
		} else if (this._fReject) {
			this._fReject(this);
		}
		delete this._fResolve;
		delete this._fReject;
	};

	Table.prototype._createContent = function() {
		this._createToolbar();
		this._createTable();

		this._updateRowAction();

		var oCreationRow = this.getCreationRow();
		if (oCreationRow) {
			oCreationRow.update();
		}

		var aMDCColumns = this.getColumns();

		aMDCColumns.forEach(this._insertInnerColumn, this);

		this.setAggregation("_content", this._oTable);

		if (this.getAutoBindOnInit()) {
			this.rebindTable();
		}

		// Resolve any pending promise if table exists
		this._onAfterTableCreated(true);
	};

	Table.prototype.setHeader = function(sText) {
		this.setProperty("header", sText, true);
		this._updateHeaderText();
		return this;
	};

	Table.prototype.setHeaderVisible = function(bVisible) {
		this.setProperty("headerVisible", bVisible, true);
		if (this._oTitle) {
			this._oTitle.setWidth(this.getHeaderVisible() ? undefined : "0px");
		}
		return this;
	};

	Table.prototype._createToolbar = function() {
		if (!this._oToolbar) {
			// Create Title
			this._oTitle = new Title(this.getId() + "-title", {
				text: this.getHeader(),
				width: this.getHeaderVisible() ? undefined : "0px"
			});
			// Create Toolbar
			this._oToolbar = new ActionToolbar(this.getId() + "-toolbar", {
				design: "Transparent",
				begin: [
					this._oTitle
				],
				end: this._getP13nButtons()
			});
		}
		return this._oToolbar;
	};

	Table.prototype._getP13nButtons = function() {
		var aP13nMode = this.getP13nMode() || [], aButtons = [];
		if (aP13nMode.length > 0) {
			// Order should be: Sort, Filter, Group and then Columns as per UX spec
			if (aP13nMode.indexOf("Sort") > -1) {
				aButtons.push(TableSettings.createSortButton(this.getId(), [
					this._showSort, this
				]));
			}
			if (aP13nMode.indexOf("Column") > -1) {
				aButtons.push(TableSettings.createColumnsButton(this.getId(), [
					this._showSettings, this
				]));
			}
		}
		return aButtons;
	};

	Table.prototype._updatep13nSettings = function(aOldMode, aMode) {
		// TODO: consider avoiding destroy and some other optimization if nothing changed
		if (this._oToolbar) {
			this._oToolbar.destroyEnd();
			var aButtons = this._getP13nButtons();
			aButtons.forEach(function(oButton) {
				this._oToolbar.addEnd(oButton);
			}, this);
		}

		if (this._oTable) {
			var oDnDColumns = this._oTable.getDragDropConfig()[0];
			if (oDnDColumns) {
				oDnDColumns.setEnabled((aMode || []).indexOf("Column") > -1);
			}
		}
	};

	Table.prototype._createTable = function() {
		var iThreshold = this.getThreshold() > -1 ? this.getThreshold() : undefined;
		if (this._bMobileTable) {
			this._oTable = ResponsiveTableType.createTable(this.getId() + "-innerTable", {
				growing: true,
				sticky: [
					"ColumnHeaders", "HeaderToolbar"
				],
				itemPress: [
					this._onItemPress, this
				],
				selectionChange: [
					this._onSelectionChange, this
				],
				growingThreshold: iThreshold,
				noDataText: this._getNoDataText(),
				headerToolbar: this._oToolbar,
				ariaLabelledBy: [
					this._oTitle
				]
			});
			this._oTemplate = ResponsiveTableType.createTemplate(this.getId() + "-innerTableRow");
			this._createColumn = Table.prototype._createMobileColumn;
			this._sAggregation = "items";
			// map bindItems to bindRows for Mobile Table to enable reuse of rebind mechanism
			this._oTable.bindRows = this._oTable.bindItems;
			// Enable active column headers by default
			this._oTable.bActiveHeaders = true;
			this._oTable.attachEvent("columnPress", this._onResponsiveTableColumnPress, this);

		} else {
			this._oTable = GridTableType.createTable(this.getId() + "-innerTable", {
				enableBusyIndicator: true,
				enableColumnReordering: false,
				threshold: iThreshold,
				cellClick: [
					this._onCellClick, this
				],
				noData: this._getNoDataText(),
				extension: [
					this._oToolbar
				],
				ariaLabelledBy: [
					this._oTitle
				],
				plugins: [
					GridTableType.createMultiSelectionPlugin(this, [
						this._onRowSelectionChange, this
					])
				],
				columnSelect: [
					this._onGridTableColumnPress, this
				]
			});
			this._createColumn = Table.prototype._createColumn;
			this._sAggregation = "rows";
		}

		// Update defaults from TableType
		this._updateTypeSettings();

		// Update the selection handlers
		this._updateSelectionBehavior();

		var oDDI = new DragDropInfo({
			sourceAggregation: "columns",
			targetAggregation: "columns",
			dropPosition: "Between",
			enabled: (this.getP13nMode() || []).indexOf("Column") > -1,
			drop: [
				this._onColumnRearrange, this
			]
		});
		oDDI.bIgnoreMetadataCheck = true;
		this._oTable.addDragDropConfig(oDDI);
	};

	Table.prototype._updateSelectionBehavior = function() {
		var oType = this._bMobileTable ? ResponsiveTableType : GridTableType;

		// For ResponsiveTable - The event handler of the selection event must not be reset here. It is set once during initialization.
		oType.updateSelection(this, this._bMobileTable ? undefined : this._onRowSelectionChange);
	};

	Table.prototype._onColumnRearrange = function(oEvent) {
		var oDraggedColumn = oEvent.getParameter("draggedControl");
		var oDroppedColumn = oEvent.getParameter("droppedControl");
		if (oDraggedColumn === oDroppedColumn) {
			return;
		}
		var sDropPosition = oEvent.getParameter("dropPosition");
		var iDraggedIndex = this._oTable.indexOfColumn(oDraggedColumn);
		var iDroppedIndex = this._oTable.indexOfColumn(oDroppedColumn);
		var iNewIndex = iDroppedIndex + (sDropPosition == "Before" ? 0 : 1) + (iDraggedIndex < iDroppedIndex ? -1 : 0);

		TableSettings.moveColumn(this, iDraggedIndex, iNewIndex);
	};

	Table.prototype._onColumnPress = function(oColumn) {
		// Sort disabled by settings
		var aP13nMode = this.getP13nMode() || [];
		if (aP13nMode.indexOf("Sort") < 0) {
			return;
		}

		var iIndex;
		if (oColumn.getParent()) {
			iIndex = oColumn.getParent().indexOfColumn(oColumn);
		}

		// TODO: collect only sortable properties
		var aSortProperties = this.getColumns()[iIndex].getDataProperties();
		if (!aSortProperties.length) {
			return;
		}

		var oSortChild, aSortChildren = [];

		// create sort items
		for (var i = 0; i < aSortProperties.length; i++) {
			oSortChild = new Item({
				text: aSortProperties[i],
				key: aSortProperties[i]
			});

			aSortChildren.push(oSortChild);
		}

		// create ColumnHeaderPopover
		if (aSortChildren.length > 0) {
			// TODO: introduce a WeakMap and save reference to ColumnHeaderPopover there to enable re-use
			if (this._oPopover) {
				// currently the inner popover can not be accessed from outside
				// there should be only one CHP instance for all MDC Table instances
				this._oPopover.destroy();
			}
			this._oPopover = new ColumnHeaderPopover({
				items: [
					new ColumnPopoverSortItem({
						sortChildren: aSortChildren, // TBD Remove
						items: aSortChildren,
						sort: [
							this._onCustomSort, this
						]
					})
				]
			});

			this._oPopover.openBy(oColumn);
			oColumn.addDependent(this._oPopover);
		}
	};

	Table.prototype._onCustomSort = function(oEvent) {
		var sSortProperty = oEvent.getParameter("property");

		TableSettings.createSort(this, sSortProperty, true);
	};

	Table.prototype._insertInnerColumn = function(oMDCColumn, iIndex) {
		if (!this._oTable) {
			return;
		}

		var oColumn = this._createColumn(oMDCColumn);
		this._setColumnTemplate(oMDCColumn, oColumn, iIndex);

		if (iIndex === undefined) {
			this._oTable.addColumn(oColumn);
		} else {
			this._oTable.insertColumn(oColumn, iIndex);
		}

		this._updatePopinDelayed();
	};

	Table.prototype._orderColumns = function() {
		var iInitialIndex, aColumnInfos = [], aMDCColumns = this.getColumns();
		aMDCColumns.forEach(function(oColumn) {
			iInitialIndex = oColumn.getInitialIndex();
			if (iInitialIndex > -1) {
				aColumnInfos.push({
					index: iInitialIndex,
					column: this.removeColumn(oColumn)
				});
			}
		}, this);

		aColumnInfos.sort(function(oColInfo1, oColInfo2) {
			return oColInfo1 - oColInfo2;
		});

		aColumnInfos.forEach(function(oColumnInfo) {
			this.insertColumn(oColumnInfo.column, oColumnInfo.index);
		}, this);
	};

	Table.prototype._setColumnTemplate = function(oMDCColumn, oColumn, iIndex) {
		var oCellTemplate = oMDCColumn.getTemplate(true), oCreationTemplateClone;
		if (!this._bMobileTable) {
			// TODO: move creationRow stuff into own method --> out of here.
			oCreationTemplateClone = oMDCColumn.getCreationTemplate(true);

			// Grid Table content cannot be wrapped!
			[
				oCellTemplate, oCreationTemplateClone
			].forEach(function(oTemplate) {
				if (!oTemplate) {
					return;
				}

				if (oTemplate.setWrapping) {
					oTemplate.setWrapping(false);
				}

				if (oTemplate.setRenderWhitespace) {
					oTemplate.setRenderWhitespace(false);
				}
			});

			oColumn.setTemplate(oCellTemplate);
			oColumn.setCreationTemplate(oCreationTemplateClone);
		} else if (iIndex >= 0) {
			this._oTemplate.insertCell(oCellTemplate, iIndex);
		} else {
			this._oTemplate.addCell(oCellTemplate);
		}
	};

	/**
	 * Creates and returns a Column that can be added to the grid table, based on the provided MDCColumn
	 *
	 * @param {object} oMDCColumn - the mdc column instance using which the GridTable column will be created
	 * @private
	 * @returns {object} the column that is created
	 */
	Table.prototype._createColumn = function(oMDCColumn) {
		return GridTableType.createColumn(oMDCColumn.getId() + "-innerColumn", {
			width: oMDCColumn.getWidth(),
			hAlign: oMDCColumn.getHAlign(),
			label: oMDCColumn.getHeader(),
			showSortMenuEntry: false,
			showFilterMenuEntry: false,
			sortProperty: oMDCColumn.getDataProperties()[0],
			filterProperty: oMDCColumn.getDataProperties()[0]
		});
	};

	/**
	 * Creates and returns a MobileColumn that can be added to the mobile table, based on the provided MDCColumn
	 *
	 * @param {object} oMDCColumn - the mdc column instance using which the ResponsiveTable column will be created
	 * @private
	 * @returns {object} the column that is created
	 */
	Table.prototype._createMobileColumn = function(oMDCColumn) {
		return ResponsiveTableType.createColumn(oMDCColumn.getId() + "-innerColumn", {
			width: oMDCColumn.getWidth(),
			hAlign: oMDCColumn.getHAlign(),
			header: new Text(oMDCColumn.getId() + "-innerColumnHeader", {
				textAlign: oMDCColumn.getHAlign(),
				text: oMDCColumn.getHeader(),
				wrappingType: "Hyphenated"
			})
		});
	};

	/**
	 * Runtime API for JS flex change to avoid rebind.
	 *
	 * @param {object} oMDCColumn - the mdc column instance which should be moved
	 * @param {int} iIndex - the index to which the column should be moved to
	 * @private
	 */
	Table.prototype.moveColumn = function(oMDCColumn, iIndex) {
		var oColumn;
		// move column in mdc Table
		this.removeAggregation("columns", oMDCColumn, true);
		this.insertAggregation("columns", oMDCColumn, iIndex, true);
		if (this._oTable) {
			// move column in inner table
			oColumn = this._oTable.removeColumn(oMDCColumn.getId() + "-innerColumn");
			this._oTable.insertColumn(oColumn, iIndex);

			// update template for ResponsiveTable
			if (this._bMobileTable) {
				this._updateColumnTemplate(oMDCColumn, iIndex);
			}
		}
	};

	Table.prototype.removeColumn = function(oMDCColumn) {
		oMDCColumn = this.removeAggregation("columns", oMDCColumn, true);
		if (this._oTable) {
			var oColumn = this._oTable.removeColumn(oMDCColumn.getId() + "-innerColumn");
			oColumn.destroy(); // TODO: avoid destroy

			// update template for ResponsiveTable
			if (this._bMobileTable) {
				this._updateColumnTemplate(oMDCColumn, -1);
			}
		}
		return oMDCColumn;
	};

	Table.prototype.addColumn = function(oMDCColumn) {
		this.addAggregation("columns", oMDCColumn, true);

		this._insertInnerColumn(oMDCColumn);

		return this;
	};

	Table.prototype.insertColumn = function(oMDCColumn, iIndex) {
		this.insertAggregation("columns", oMDCColumn, iIndex, true);

		this._insertInnerColumn(oMDCColumn, iIndex);

		return this;
	};

// ResponsiveTable
	Table.prototype._updateColumnTemplate = function(oMDCColumn, iIndex) {
		var oCellTemplate, iCellIndex;
		// TODO: Check if this can be moved inside the m.Table.

		// Remove cell template when column is hidden
		// Remove template cell from ColumnListItem (template)
		if (this._oTemplate) {
			oCellTemplate = oMDCColumn.getTemplate(true);
			iCellIndex = this._oTemplate.indexOfCell(oCellTemplate);
			Table._removeItemCell(this._oTemplate, iCellIndex, iIndex);
		}

		// Remove cells from actual rendered items, as this is not done automatically
		if (iCellIndex > -1) {
			this._oTable.getItems().forEach(function(oItem) {
				// Grouping row (when enabled) will not have cells
				if (oItem.removeCell) {
					Table._removeItemCell(oItem, iCellIndex, iIndex);
				}
			});
		}

		this._updatePopinDelayed();
	};

	Table._removeItemCell = function(oItem, iRemoveIndex, iInsertIndex) {
		// remove cell from index
		var oCell = oItem.removeCell(iRemoveIndex);
		if (oCell) {
			// -1 index destroys the inner content
			if (iInsertIndex > -1) {
				oItem.insertCell(oCell, iInsertIndex);
			} else {
				oCell.destroy();
			}
		}
	};

	Table.prototype._updatePopinDelayed = function() {
		if (this._bMobileTable) {
			if (this._iPopinTimeout) {
				clearTimeout(this._iPopinTimeout);
			}
			this._iPopinTimeout = setTimeout(this._updatePopin.bind(this), 0);

		}
	};

	Table.prototype._updatePopin = function() {
		delete this._iPopinTimeout;
		var aColumns, iMinScreenWidth = 0, sColumnWidth, iColumnWidth, fBaseFontSize = parseFloat(MLibrary.BaseFontSize);
		if (this._bMobileTable && this._oTable) {
			aColumns = this._oTable.getColumns();
			aColumns.forEach(function(oColumn, i) {
				sColumnWidth = oColumn.getWidth();
				if (sColumnWidth && sColumnWidth.endsWith("em")) { /* em / rem */
					iColumnWidth = parseFloat(sColumnWidth);
				} else if (sColumnWidth && sColumnWidth.endsWith("px")) {
					iColumnWidth = parseFloat(sColumnWidth) / fBaseFontSize;
				} else {
					iColumnWidth = 10; // assume 10rem by default
				}
				iMinScreenWidth += iColumnWidth;

				// ensure always two columns without popin
				oColumn.setDemandPopin(i >= 2);
				oColumn.setPopinDisplay("Inline");
				oColumn.setMinScreenWidth(iMinScreenWidth + "rem");
			});
		}
	};

	Table.prototype._onItemPress = function(oEvent) {
		this.fireRowPress({
			bindingContext: oEvent.getParameter("listItem").getBindingContext()
		});
	};

	Table.prototype._onSelectionChange = function(oEvent) {
		var bSelectAll = oEvent.getParameter("selectAll");

		this.fireSelectionChange({
			bindingContext: oEvent.getParameter("listItem").getBindingContext(),
			selected: oEvent.getParameter("selected"),
			selectAll: bSelectAll
		});

		if (bSelectAll) {
			var oRowBinding = this.getRowBinding();

			if (oRowBinding && this._oTable) {
				var iBindingRowCount = oRowBinding.getLength();
				var iTableRowCount = this._oTable.getItems().length;
				var bIsLengthFinal = oRowBinding.isLengthFinal();

				if (iTableRowCount != iBindingRowCount || !bIsLengthFinal) {
					showMessage("table.SELECTION_LIMIT_MESSAGE", [
						iTableRowCount
					]);
				}
			}
		}
	};

	Table.prototype._onResponsiveTableColumnPress = function(oEvent) {
		this._onColumnPress(oEvent.getParameter("column"));
	};

// GridTable
	Table.prototype._onCellClick = function(oEvent) {
		this.fireRowPress({
			bindingContext: oEvent.getParameter("rowBindingContext")
		});
	};

	Table.prototype._onRowActionPress = function(oEvent) {
		var oRow = oEvent.getParameter("row");
		this.fireRowPress({
			bindingContext: oRow.getBindingContext()
		});
	};

	Table.prototype._onRowSelectionChange = function(oEvent) {
		if (!this._bSelectionChangedByAPI) { // TODO Table / Plugin needs to ensure that events are only fired when "relevant" for the app.
			this.fireSelectionChange({
				bindingContext: oEvent.getParameter("rowContext"),
				selected: oEvent.getSource().isIndexSelected(oEvent.getParameter("rowIndex")),
				selectAll: oEvent.getParameter("selectAll")
			});
		}
	};

	Table.prototype._onGridTableColumnPress = function(oEvent) {
		oEvent.preventDefault();
		this._onColumnPress(oEvent.getParameter("column"));
	};

	// TODO: maybe selectedContexts should be an association
	// TODO: The API is unstable/unreliable in GridTable scenarios and has to be worked upon
	/**
	 * Gets contexts from the table that have been selected by the user.
	 *
	 * @returns {Array} Contexts of rows/items selected by the user
	 * @private
	 * @experimental The API is unstable/unreliable in GridTable scenarios
	 */
	Table.prototype.getSelectedContexts = function() {
		if (this._oTable) {
			if (this._bMobileTable) {
				return this._oTable.getSelectedContexts();
			}

			var aSelectedIndices = this._oTable.getPlugins()[0].getSelectedIndices();

			return aSelectedIndices.map(function(iIndex) {
				return this._oTable.getContextByIndex(iIndex);
			}, this);
		}
		return [];
	};

	/**
	 * API to get clear selection from the table.
	 *
	 * @private
	 */
	Table.prototype.clearSelection = function() {
		if (this._oTable) {
			if (this._bMobileTable) {
				this._oTable.removeSelections(true);
			} else {
				this._bSelectionChangedByAPI = true;
				this._oTable.getPlugins()[0].clearSelection();
				this._bSelectionChangedByAPI = false;
			}
		}
	};

	Table.prototype.setFilter = function(vFilter) {
		if (this._validateFilter(vFilter)) {
			this._deregisterFilter();

			this.setAssociation("filter", vFilter, true);

			this._registerFilter();
		}

		return this;
	};

	Table.prototype._validateFilter = function(vFilter) {
		var oFilter = typeof vFilter === "object" ? vFilter : sap.ui.getCore().byId(vFilter);
		if (!oFilter || oFilter.isA(sFilterInterface)) {
			return true;
		}
		throw new Error("\"" + vFilter + "\" is not valid for association \"filter\" of mdc.Table. Please use an object that implements \"" + sFilterInterface + "\" interface");
	};

	Table.prototype._deregisterFilter = function() {
		var oFilter = sap.ui.getCore().byId(this.getFilter());
		if (oFilter) {
			oFilter.detachSearch(this.rebindTable, this);
			oFilter.detachFiltersChanged(this._onFiltersChanged, this);
		}
	};

	Table.prototype._registerFilter = function() {
		var oFilter = sap.ui.getCore().byId(this.getFilter());
		if (oFilter) {
			oFilter.attachSearch(this.rebindTable, this);
			oFilter.attachFiltersChanged(this._onFiltersChanged, this);
		}
	};

	Table.prototype._onFiltersChanged = function() {
		if (this.isTableBound()) {
			this._oTable.setShowOverlay(true);
		}
	};

	Table.prototype._getFilterInfo = function() {
		var oFilterInfo = {};
		var oFilter = sap.ui.getCore().byId(this.getFilter());
		if (oFilter) {
			oFilterInfo.filters = oFilter.getFilters();
			oFilterInfo.searchText = oFilter.getSearch();
		}
		return oFilterInfo;
	};

	Table.prototype.isTableBound = function() {
		return this._oTable ? this._oTable.isBound(this._bMobileTable ? "items" : "rows") : false;
	};

	Table.prototype.bindRows = function(oBindingInfo) {
		var oFilterInfo, sSearchText;
		if (!this.oTableDelegate || !this._oTable) {
			return;
		}
		// update path from the delegate
		this.oTableDelegate.updateBindingInfo(this.getDelegate().payload, oBindingInfo);

		if (oBindingInfo.path) {
			this._oTable.setShowOverlay(false);
			if (this._bMobileTable && this._oTemplate) {
				oBindingInfo.template = this._oTemplate;
			} else {
				delete oBindingInfo.template;
			}

			if (!oBindingInfo.parameters) {
				oBindingInfo.parameters = {};
			}
			// Update sorters
			oBindingInfo.sorter = this._getSorters();
			// Update filters
			if (this.getFilter()) {
				oFilterInfo = this._getFilterInfo();
				oBindingInfo.filters = oFilterInfo.filters;
				sSearchText = oFilterInfo.searchText;
			}
			if (this.getShowRowCount()) {
				Table._addBindingListener(oBindingInfo, "dataReceived", this._onDataReceived.bind(this));
				Table._addBindingListener(oBindingInfo, "change", this._updateHeaderText.bind(this));
			}
			this._updateColumnsBeforeBinding(oBindingInfo);

			this.oTableDelegate.rebindTable(this, oBindingInfo, sSearchText);
		}
		return this;
	};

	/**
	 * Event handler for binding dataReceived
	 *
	 * @param {object} oEvt - the event instance
	 * @private
	 */
	Table.prototype._onDataReceived = function(oEvt) {
		// AnalyticalBinding fires dataReceived too often/early
		if (oEvt && oEvt.getParameter && oEvt.getParameter("__simulateAsyncAnalyticalBinding")) {
			return;
		}

		this._updateHeaderText();
	};

	Table.prototype._updateHeaderText = function() {
		var sHeader, sRowCount;

		if (this._oTitle && this.getHeader()) {
			sHeader = this.getHeader();
			if (this.getShowRowCount()) {
				sRowCount = this._getRowCount();
				if (sRowCount) {
					sHeader += " (" + sRowCount + ")";
				}
			}

			this._oTitle.setText(sHeader);
		}
	};

	Table.prototype._updateColumnsBeforeBinding = function(oBindingInfo) {
		var aSorters = [].concat(oBindingInfo.sorter || []);
		var aMDCColumns = this.getColumns();
		var bMobileTable = this._bMobileTable;

		aMDCColumns.forEach(function(oMDCColumn) {
			var oInnerColumn = sap.ui.getCore().byId(oMDCColumn.getId() + "-innerColumn");
			if (bMobileTable) {
				oInnerColumn.setSortIndicator("None");
			} else {
				oInnerColumn.setSorted(false);
			}
		});

		aSorters.forEach(function(oSorter) {
			var sSortOrder = (oSorter.bDescending) ? "Descending" : "Ascending";
			aMDCColumns.some(function(oMDCColumn) {
				var oInnerColumn = sap.ui.getCore().byId(oMDCColumn.getId() + "-innerColumn");
				if (oMDCColumn.getDataProperties().indexOf(oSorter.sPath) > -1) {
					if (bMobileTable) {
						oInnerColumn.setSortIndicator(sSortOrder);
					} else {
						oInnerColumn.setSorted(true).setSortOrder(sSortOrder);
					}
					return true;
				}
			});
		});
	};

	/**
	 * gets table's row count
	 *
	 * @param {boolean} bConsiderTotal whether to consider total
	 * @private
	 * @returns {int} the row count
	 */
	Table.prototype._getRowCount = function() {
		var oRowBinding = this.getRowBinding(), iRowCount, sValue = "";

		if (oRowBinding) {
			iRowCount = oRowBinding.getLength();

			if (!this._oNumberFormatInstance) {
				this._oNumberFormatInstance = NumberFormat.getFloatInstance();
			}

			if (oRowBinding.isLengthFinal()) {
				sValue = this._oNumberFormatInstance.format(iRowCount);
			}
		}
		return sValue;
	};

	/**
	 * Returns the row/items binding of the internal table.<br>
	 * <i>Note</i>:
	 * <li>Do not use this API to keep the reference of the binding.</li>
	 * <li>Also, do not use it to trigger sort/filter on the binding.</li>
	 *
	 * @private
	 * @ui5-restricted sap.fe
	 * @returns {sap.ui.model.Binding} the row/items binding
	 */
	Table.prototype.getRowBinding = function() {
		return this._getRowBinding();
	};

	/**
	 * Returns the row/items binding of the internal table.
	 *
	 * @private
	 * @returns {sap.ui.model.Binding} the row/items binding
	 */
	Table.prototype._getRowBinding = function() {
		if (this._oTable) {
			return this._oTable.getBinding(this._sAggregation);
		}
	};

	// TODO Util
	/**
	 * Static method for checking and wrapping binding event listeners
	 *
	 * @param {object} oBindingInfo - the bindingInfo (or binding parameter) instance
	 * @param {object} sEventName - the event name
	 * @param {object} fHandler - the handler to be called internally
	 * @private
	 */
	Table._addBindingListener = function(oBindingInfo, sEventName, fHandler) {
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

	Table.prototype.rebindTable = function() {
		// Rebind table rows to update data/cells properly
		this.bindRows(this.getRowsBindingInfo() || {});
	};

	/**
	 * Just for test purpose --> has to be finalised
	 *
	 * @param {object} oEvt Event object that gets processed
	 * @experimental
	 */
	Table.prototype._showSettings = function(oEvt) {
		this._showPanel("Columns", oEvt.getSource());
	};

	Table.prototype._showSort = function(oEvt) {
		this._showPanel("Sort", oEvt.getSource());
	};

	Table.prototype._showPanel = function(sPanel, oSource) {
		if (!this._settingsTriggered) {
			this._settingsTriggered = true;
			TableSettings.showPanel(this, sPanel, oSource).then(this._afterSettingsDone.bind(this));
		}
	};

	Table.prototype._afterSettingsDone = function() {
		delete this._settingsTriggered;
	};

	// TODO: move to a base util that can be used by most aggregations
	Table.prototype._getSorters = function() {
		var mSortedProperties = this.getSortConditions() || {};

		var aSorters = [];

		Object.keys(mSortedProperties).forEach(function(sName){
			aSorters.push(new Sorter(sName, mSortedProperties[sName].descending));
		});

		return aSorters;
	};

	Table.prototype.exit = function() {
		// Always destroy the template
		if (this._oTemplate) {
			this._oTemplate.destroy();
		}
		this._oTemplate = null;
		this._oTable = null;
		this._oToolbar = null;
		this._oTitle = null;
		this._oNumberFormatInstance = null;

		this._oTableReady = null;
		this.oTableDelegateLoaded = null;
		this._fReject = null;
		this._fResolve = null;
	};

	return Table;

});
