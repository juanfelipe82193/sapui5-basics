/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// Provides control sap.ui.comp.valuehelpdialog.ValueHelpDialog.
sap.ui.define([
	'sap/base/Log',
	'sap/ui/comp/library',
	'sap/m/Dialog',
	'sap/m/MessageBox',
	'sap/m/Token',
	'./ItemsCollection',
	'sap/ui/core/library',
	'sap/ui/core/Control',
	'sap/ui/core/format/DateFormat',
	'sap/ui/core/format/NumberFormat',
	'sap/m/VBox',
	'sap/m/HBox',
	'sap/ui/comp/util/FormatUtil',
	'sap/m/DialogRenderer',
	'sap/m/FlexItemData',
	'sap/m/Title',
	'sap/m/Text',
	'sap/m/Label',
	'sap/m/Button',
	'sap/m/Bar',
	'sap/m/OverflowToolbarLayoutData',
	'sap/m/Tokenizer',
	'sap/m/Panel',
	'sap/m/StandardListItem',
	'sap/m/IconTabBar',
	'sap/m/IconTabFilter',
	'sap/m/library',
	'sap/ui/core/InvisibleText',
	'sap/ui/core/IconPool',
	'sap/ui/layout/HorizontalLayout',
	'sap/ui/layout/Grid',
	'sap/ui/Device',
	'sap/m/List',
	'sap/m/Link',
	'sap/m/P13nFilterPanel',
	'sap/m/P13nConditionPanel',
	'sap/m/P13nItem',
	'sap/m/P13nAnyFilterItem',
	'sap/m/CheckBox',
	'sap/ui/model/odata/type/String'
], function(
	Log,
	library,
	Dialog,
	MessageBox,
	Token,
	ItemsCollection,
	coreLibrary,
	Control,
	DateFormat,
	NumberFormat,
	VBox,
	HBox,
	FormatUtil,
	DialogRenderer,
	FlexItemData,
	Title,
	Text,
	Label,
	Button,
	Bar,
	OverflowToolbarLayoutData,
	Tokenizer,
	Panel,
	StandardListItem,
	IconTabBar,
	IconTabFilter,
	mLibrary,
	InvisibleText,
	IconPool,
	HorizontalLayout,
	Grid,
	Device,
	List,
	Link,
	P13nFilterPanel,
	P13nConditionPanel,
	P13nItem,
	P13nAnyFilterItem,
	CheckBox,
	String
) {
	"use strict";

	var tableLibrary;
	var uiTable;
	var UiTableColumn;
	var AnalyticalColumn;
	var mTable;
	var mTableColumn;

	// shortcut for sap.m.ButtonType
	var ButtonType = mLibrary.ButtonType;

	// shortcut for sap.m.OverflowToolbarPriority
	var OverflowToolbarPriority = mLibrary.OverflowToolbarPriority;

	// shortcut for sap.m.ListMode
	var ListMode = mLibrary.ListMode;
	var ListType = mLibrary.ListType;

	// shortcut for sap.ui.table.SelectionMode
	var SelectionMode;

	// shortcut for sap.ui.table.SelectionBehavior
	var SelectionBehavior;

	// shortcut for sap.ui.table.VisibleRowCountMode
	var VisibleRowCountMode;

	// shortcut for sap.ui.core.HorizontalAlign
	var HorizontalAlign = coreLibrary.HorizontalAlign;

	// shortcut for sap.ui.comp.smartfilterbar.DisplayBehaviour
	var DisplayBehaviour = library.smartfilterbar.DisplayBehaviour;


	var _ValueHelpViewMode = {
		DESKTOP_LIST_VIEW: "DESKTOP_LIST_VIEW",
		DESKTOP_CONDITIONS_VIEW: "DESKTOP_CONDITIONS_VIEW",
		PHONE_MAIN_VIEW: "PHONE_MAIN_VIEW",
		PHONE_SEARCH_VIEW: "PHONE_SEARCH_VIEW",
		PHONE_LIST_VIEW: "PHONE_LIST_VIEW",
		PHONE_CONDITIONS_VIEW: "PHONE_CONDITIONS_VIEW"
	};

	/**
	 * Constructor for a new valuehelpdialog/ValueHelpDialog.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 * @class The ValueHelpDialog control can be used to implement a value help for an input field.
	 * @extends sap.m.Dialog
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.valuehelpdialog.ValueHelpDialog
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ValueHelpDialog = Dialog.extend("sap.ui.comp.valuehelpdialog.ValueHelpDialog", /** @lends sap.ui.comp.valuehelpdialog.ValueHelpDialog.prototype */ {
		metadata: {

			library: "sap.ui.comp",
			properties: {
				/**
				 * Defines the value for the basic search field. The value is set into the basic search field of the filter bar used.
				 *
				 * @since 1.24
				 */
				basicSearchText: {
					type: "string",
					group: "Misc",
					defaultValue: ""
				},

				/**
				 * Enables multi-selection in the table used.
				 *
				 * @since 1.24
				 */
				supportMultiselect: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * Enables the ranges (conditions) feature in the dialog.
				 *
				 * @since 1.24
				 */
				supportRanges: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * If this property is set to <code>true</code>, the value help dialog only supports the ranges (conditions) feature.
				 *
				 * @since 1.24
				 */
				supportRangesOnly: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * Defines the key of the column used for the internal key handling. The value of the column is used for the token key and also to
				 * identify the row in the table.
				 *
				 * @since 1.24
				 */
				key: {
					type: "string",
					group: "Misc",
					defaultValue: ""
				},

				/**
				 * Defines the list of additional keys of the column used for the internal key handling.
				 *
				 * @since 1.24
				 */
				keys: {
					type: "string[]",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Defines the key of the column used for the token text.
				 *
				 * @since 1.24
				 */
				descriptionKey: {
					type: "string",
					group: "Misc",
					defaultValue: ""
				},

				/**
				 * Defines the maximum number of include ranges.
				 *
				 * @since 1.24
				 */
				maxIncludeRanges: {
					type: "string",
					group: "Misc",
					defaultValue: '-1'
				},

				/**
				 * Defines the maximum number of exclude ranges.
				 *
				 * @since 1.24
				 */
				maxExcludeRanges: {
					type: "string",
					group: "Misc",
					defaultValue: '-1'
				},

				/**
				 * Represents the display format of the range values. With the <code>displayFormat</code> value UpperCase, the entered value of the
				 * range (condition) is converted to uppercase letters.
				 *
				 * @since 1.24
				 */
				displayFormat: {
					type: "string",
					group: "Misc",
					defaultValue: ""
				},

				/**
				 * Represents how the item token text should be displayed in ValueHelpDialog. Use one of the valid
				 * <code>sap.ui.comp.smartfilterbar.DisplayBehaviour</code> values.
				 *
				 * @since 1.24
				 */
				tokenDisplayBehaviour: {
					type: "string",
					group: "Misc",
					defaultValue: ""
				},

				/**
				 * Sets the dialog into a filter mode, which only shows ranges (conditions) and hides the tokens.
				 *
				 * @since 1.24
				 */
				filterMode: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * Used by the ValueHelpProvider to enable enhanced exclude operations
				 * @private
				 * @since 1.74
				 */
				_enhancedExcludeOperations: {
					type: "boolean",
					group: "Misc",
					defaultValue: false,
					visibility: "hidden"
				}
			},
			aggregations: {

				/**
				 * Allows you to add a {@link sap.ui.comp.filterbar.FilterBar FilterBar} or
				 * {@link sap.ui.comp.smartfilterbar.SmartFilterBar SmartFilterBar} control to the value help dialog.
				 */
				filterBar: {
					type: "sap.ui.comp.filterbar.FilterBar",
					multiple: false
				}
			},
			events: {

				/**
				 * This event is fired when the OK button is pressed.
				 *
				 * @since 1.24
				 */
				ok: {
					parameters: {
						/**
						 * The array of tokens created or modified on the ValueHelpDialog.
						 */
						tokens: {
							type: "sap.m.Token[]"
						}
					}
				},

				/**
				 * This event is fired when the Cancel button is pressed.
				 *
				 * @since 1.24
				 */
				cancel: {},

				/**
				 * This event is fired when the user selects an item in the items table.
				 *
				 * <b>Note:</b> The event will only be raised when the dialog gets a table
				 * instance from outside via <code>setTable</code>.
				 *
				 * @since 1.32
				 */
				selectionChange: {
					parameters: {
						/**
						 * The RowSelectionChange event parameter from the hosted table that contains the selected items.
						 */
						tableSelectionParams: {
							type: "object"
						},

						/**
						 * Returns an array of objects which represents all selected row tokens. The object contains the token key, the row object
						 * data from the model, and the information if the token is selected. <code>
						 *  [{sKey, oRow, bSelect}, ...]
						 *  </code>
						 */
						updateTokens: {
							type: "object[]"
						},

						/**
						 * Can be set to <code>true</code> to execute the default behaviour of the ValueHelpDialog.
						 */
						useDefault: {
							type: "boolean",
							defaultValue: false
						},

						/**
						 * The table instance used
						 * @since 1.58
						 */
						table: {
							type: "object"
						}
					}
				},

				/**
				 * This event is fired when the user removes one or multiple existing token(s) from the dialog.
				 *
				 * <b>Note:</b> The event will only be raised when the dialog gets a table
				 * instance from outside via <code>setTable</code>.
				 *
				 * @since 1.32
				 */
				tokenRemove: {
					parameters: {
						/**
						 * The array of token keys that has been removed.
						 */
						tokenKeys: {
							type: "string[]"
						},

						/**
						 * Can be set to true to execute the default behaviour of ValueHelpDialog.
						 */
						useDefault: {
							type: "boolean",
							defaultValue: false
						}
					}

				},

				/**
				 * This event is fired when the table gets an update and all existing tokens must be selected in the table.
				 *
				 * <b>Note:</b> The event will only be raised when the dialog gets a table
				 * instance from outside via <code>setTable</code>.
				 *
				 * @since 1.32
				 */
				updateSelection: {
					parameters: {
						/**
						 * The array of existing token keys for which the selection in the table has to be updated.
						 */
						tokenKeys: {
							type: "string[]"
						},

						/**
						 * Can be set to true to execute the default behavior of ValueHelpDialog.
						 */
						useDefault: {
							type: "boolean",
							defaultValue: false
						}
					}

				}
			}
		},
		renderer: DialogRenderer.render
	});

	ValueHelpDialog.prototype.setSupportMultiselect = function(bEnabled) {
		this.setProperty("supportMultiselect", bEnabled);

		this._updatePropertySupportMultiselect(bEnabled);

		this._oTokenizerGrid.setVisible(bEnabled);
		this._oButtonOk.setVisible(bEnabled);
		return this;
	};

	ValueHelpDialog.prototype._updatePropertySupportMultiselect = function(bEnabled) {
		if (!this._oTable) {
			return undefined;
		}

		if (!this._isPhone()) {
			if (this._oTable.setSelectionMode) {
				this._oTable.setSelectionMode(bEnabled ? SelectionMode.MultiToggle : SelectionMode.Single);
			}
		} else if (this._oTable.setMode) {
			this._oTable.setMode(bEnabled ? ListMode.MultiSelect : ListMode.SingleSelectLeft);
		}

		return this;
	};

	ValueHelpDialog.prototype.setSupportRanges = function(bEnabled) {
		this.setProperty("supportRanges", bEnabled);

		this._updateNavigationControl();

		return this;
	};

	ValueHelpDialog.prototype.setSupportRangesOnly = function(bEnabled) {
		this.setProperty("supportRangesOnly", bEnabled);

		this._updateNavigationControl();
		return this;
	};

	// Sets the Title of the dialog.
	// The value is used for the different titles which we display during runtime on the dialog header.
	// The dialog title changes depending on the content.
	ValueHelpDialog.prototype.setTitle = function(sTitle) {
		this.setProperty("title", sTitle);

		this._updateDlgTitle();

		return this;
	};

	ValueHelpDialog.prototype.setFilterBar = function(oCtrl) {
		this.setAggregation("filterBar", oCtrl);

		if (this._oMainLayout && oCtrl) {
			if (this._isPhone()) {
				if (this._oFilterBar) {
					// Remove the old filterbar.
					this._oVBox.removeItem(this._oFilterBar);
					this._oFilterBar.detachInitialise(this._handleFilterBarInitialize);
				}

			} else if (this._oFilterBar) {
				// Remove the old filterbar.
				this._oMainLayout.removeItem(this._oFilterBar);
				this._oFilterBar.detachInitialise(this._handleFilterBarInitialize);
			}

			this._oFilterBar = oCtrl;

			this._oFilterBar.attachInitialise(this._handleFilterBarInitialize, this);

			if (this._oFilterBar) {

				this._oFilterBar.addStyleClass("compVHSearch");

				if (this._isPhone()) {
					// Let the Search Field on a phone show the search icon.
					var oSearchField = sap.ui.getCore().byId(this._oFilterBar.getBasicSearch());
					if (oSearchField && oSearchField.isA("sap.m.SearchField")) {
						oSearchField.setShowSearchButton(true);
						oSearchField.attachSearch(function(oEvent) {
							if (oEvent.mParameters.refreshButtonPressed !== undefined) { // Workaround to ignore the remove icon click on the
								// Search control.
								this.getFilterBar().search();
							}
						}.bind(this));
					}
					this._oFilterBar.setShowGoOnFB(false);

					// Add the Collective Search as first item into the VBox.
					this._oColSearchBox.setLayoutData(new FlexItemData({
						shrinkFactor: 0
					}));
					this._oVBox.insertItem(this._oColSearchBox, 0);

					// The Filterbar with the Basic Search is the second item.
					this._oFilterBar.setLayoutData(new FlexItemData({
						shrinkFactor: 0
					}));
					this._oVBox.insertItem(this._oFilterBar, 1);

					// On the phone listen on the Search event to show the LIST_VIEW.
					this._oFilterBar.attachSearch(function(oEvent) {
						this._updateView(_ValueHelpViewMode.PHONE_LIST_VIEW);
					}.bind(this));

					if (this._currentViewMode === _ValueHelpViewMode.PHONE_LIST_VIEW) {
						// update the Filterbar states
						this._oFilterBar.setVisible(true);
						this._oFilterBar.setFilterBarExpanded(false);
						this._handleFilterBarInitialize();
					}
				} else {
					// for Tablet and Desktop add the Filterbar into the mainGrid and place the CollectiveSearch inside the Filterbar.
					this._oFilterBar._setCollectiveSearch(this._oColSearchBox);
					this._oMainLayout.insertItem(this._oFilterBar, 0);
				}
			}

			// set the initial Focus on the Search/Go button
			if (this._oFilterBar._oSearchButton) {
				this.setInitialFocus(this._oFilterBar._oSearchButton);
			}

			// Try to fill the basic search text into the SmartFilterBar and set the initial Focus.
			if (this._oFilterBar._oBasicSearchField) {
				var oBasicSearchField = this._oFilterBar._oBasicSearchField;
				oBasicSearchField.setValue(this.getBasicSearchText());

				this.setInitialFocus(oBasicSearchField);
			}
		}

		return this;
	};

	ValueHelpDialog.prototype._handleFilterBarInitialize = function() {
		if (this._currentViewMode === _ValueHelpViewMode.PHONE_LIST_VIEW) {
			// update the Filterbar states
			this._oFilterBar._handleVisibilityOfToolbar();
			var bShowAdvancedSearch = this._oFilterBar && this._oFilterBar.getFilterGroupItems() && this._oFilterBar.getFilterGroupItems().length > 0;
			this._oAdvancedSearchLink.setVisible(bShowAdvancedSearch);
			this._oFilterBar.setShowGoButton(!(this._oFilterBar && this._oFilterBar.getBasicSearch()));
		}
	};

	ValueHelpDialog.prototype.getFilterBar = function() {
		return this._oFilterBar;
	};

	ValueHelpDialog.prototype.setBasicSearchText = function(sText) {
		this.setProperty("basicSearchText", sText);

		if (this._oFilterBar && this._oFilterBar._oBasicSearchField) {
			this._oFilterBar._oBasicSearchField.setValue(sText);
		}

		return this;
	};

	/**
	 * Sets the array of tokens. The <code>sap.m.Tokens</code> are added to the dialog tokenizer Selected Items or Excluded Items. Normal tokens are added to the
	 * Selected Items tokenizer only and are selected in the table. <code>
	 * new sap.m.Token({key: "0001", text:"SAP A.G. (0001)"});
	 * </code> Tokens with
	 * the extra data with value 'range' are handled as range tokens or exclude range tokens. <code>
	 * new sap.m.Token({key: "i1", text: "ID: a..z"}).data("range", { "exclude": false, "operation": sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.BT, "keyField": "CompanyCode", "value1": "a", "value2": "z"});
	 * </code>
	 * The selected items or range tokens are returned in the event parameters of the Ok event.
	 *
	 * @public
	 * @since 1.24
	 * @param {sap.m.Token[]} aTokens An array of token controls
	 */
	ValueHelpDialog.prototype.setTokens = function(aTokens) {
		var bUpdateTokens = true;

		if (aTokens.length) {
			var n = 0,
				sKey;
			for (var i = 0; i < aTokens.length; i++) {
				var token = aTokens[i];
				if (token.data("range")) {
					var range = token.data("range");
					sKey = token.getKey();
					if (!sKey) {
						do {
							sKey = "range_" + n;
							n++;
						} while (this._oSelectedRanges[sKey]);
					}
					var theTokenText = this._getFormatedRangeTokenText(range.operation, range.value1, range.value2, range.exclude, range.keyField);
					this._addToken2Tokenizer(sKey, theTokenText, range.exclude ? this._oExcludedTokens : this._oSelectedTokens, range.keyField);

					this._oSelectedRanges[sKey] = range;
					bUpdateTokens = false; // because is done in _addToken2Tokenizer
				} else {
					sKey = token.getKey();
					var sText = token.getText();
					var sLongKey = token.data("longKey");
					var oRowData = token.data("row");
					if (!sLongKey) {
						sLongKey = sKey;
					}

					this._oSelectedItems.add(sLongKey, oRowData ? oRowData : token.getText());

					var oToken = new Token(_getTokenId.call(this, sLongKey));
					oToken.setKey(sLongKey);
					oToken.setText(sText);
					oToken.setTooltip(sText);
					this._oSelectedTokens.addToken(oToken);
				}
			}
		} else {
			this._oSelectedItems.removeAll();
			this._oSelectedRanges = {};
			this._oSelectedTokens.destroyTokens();
			this._oExcludedTokens.destroyTokens();
		}

		if (bUpdateTokens) {
			this._updateTokenizer();
		}
	};

	ValueHelpDialog.prototype.open = function() {

		// if table not loaded -> load is async and open dialog afterwards
		if (!this._oTable && !(this._isPhone() && (this.getSupportRangesOnly() || this.getFilterMode()))) {
			_createDefaultTableAsync.call(this).then(function() {
				this.open();
				return this;
			}.bind(this));
			return this;
		}

		this._bIgnoreSelectionChange = false;

		// take the current visibility of the title and button for the visibility of the colSearchBox
		this.bCollectiveSearchActive = this.oSelectionTitle.getVisible() && this.oSelectionButton.getVisible();
		if (this._oColSearchBox) {
			this._oColSearchBox.setVisible(this.bCollectiveSearchActive);
		}

		if (!this._isPhone()) {
			if (this.getSupportRangesOnly() || this.getFilterMode()) {
				this._updateView(_ValueHelpViewMode.DESKTOP_CONDITIONS_VIEW);
			}

			// set the default dialog width for Tablet/Desktop
			this.setContentWidth(this._getDefaultContentWidth());
		} else {
			this._updateView(_ValueHelpViewMode.PHONE_MAIN_VIEW);
		}

		Dialog.prototype.open.apply(this);
		return this;
	};

	/**
	 * Gives access to the internal table instance.
	 *
	 * @public
	 * @returns {object} the used table instance
	 * @since 1.28
	 * @deprecated As of version 1.60.0, replaced by {@link sap.ui.comp.valuehelpdialog.ValueHelpDialog#getTableAsync} to prevent synchronous calls.
	 */
	ValueHelpDialog.prototype.getTable = function() {
		Log.warning("Please use getTableAsync to prevent synchronous calls.", this);
		if (!this._oTable) {
			this._createDefaultTable();
		}

		return this._oTable;
	};

	/**
	 * Gives access to the internal table instance.
	 *
	 * @public
	 * @returns {Promise} Promise that, if resolved, returns the table object
	 * @since 1.58
	 */
	ValueHelpDialog.prototype.getTableAsync = function() {
		if (this._oTablePromise) {
			return this._oTablePromise;
		} else if (!this._oTable) {
			return _createDefaultTableAsync.call(this);
		} else {
			return new Promise(function(fResolve) {
				fResolve(this._oTable);
			}.bind(this));
		}

	};

	/**
	 * Sets the table used in the value help dialog. If not used, the dialog creates a sap.ui.table.Table or sap.m.Table instance internally.
	 *
	 * @param {object} oTable The used table control instance
	 *
	 * @since 1.32
	 * @public
	 */
	ValueHelpDialog.prototype.setTable = function(oTable) {
		if (this._oTable) {
			this._oMainLayout.removeItem(this._oTable);
			if (this._bTableCreatedInternal) {
				this._oTable.destroy();
				this._oTable = null;
			}
		}

		this._bTableCreatedInternal = (arguments.length > 1) && (arguments[1] == true);

		if (oTable && oTable.isA("sap.ui.comp.smarttable.SmartTable")) {
			this._oTable = oTable.getTable();
		} else {
			this._oTable = oTable;
		}

		if (this._oTable && this._oTable.isA("sap.ui.table.Table") && !uiTable) {
			// a UiTable is used -> Table library must be loaded -> initialize globals
			tableLibrary = sap.ui.require("sap/ui/table/library");
			uiTable = sap.ui.require("sap/ui/table/Table");
			UiTableColumn = sap.ui.require("sap/ui/table/Column");
			SelectionMode = tableLibrary.SelectionMode;
			SelectionBehavior = tableLibrary.SelectionBehavior;
			VisibleRowCountMode = tableLibrary.VisibleRowCountMode;

			this._oTable.setEnableBusyIndicator(true);

			if (this._oTable.isA("sap.ui.table.AnalyticalTable")) {
				AnalyticalColumn = sap.ui.require("sap/ui/table/AnalyticalColumn");
			}
		} else if (this._oTable && this._oTable.isA("sap.m.Table") && !mTable) {
			mTable = sap.ui.require("sap/m/Table");
			mTableColumn = sap.ui.require("sap/m/Column");
		}

		this._oTable.setLayoutData(new FlexItemData({
			shrinkFactor: 0,
			growFactor: 1
		}));

		this.theTable = this._oTable; // support old public theTable property for usage outside the class

		this._initializeTable();
		this._oMainLayout.addItem(oTable);
	};

	/**
	 * return the default ContentWidth for the dialog
	 *
	 * @private
	 * @returns {string} The width in px
	 */
	ValueHelpDialog.prototype._getDefaultContentWidth = function() {
		var nColumns = 0;
		if (this._oTable) {
			nColumns = this._oTable.getColumns().length;
		}
		var nWidth = Math.max(1080, nColumns * 130);
		return nWidth + "px";
	};

	/**
	 * Resets the table binding and changes the table NoDataText to "Please press Search Button".
	 *
	 * @private
	 * @since 1.24
	 */
	ValueHelpDialog.prototype.resetTableState = function() {
		if (this._oTable) {
			if (this._oTable.unbindRows) {
				this._oTable.unbindRows();
			}
			this._updateNoDataText(this._oRb.getText("VALUEHELPDLG_TABLE_PRESSSEARCH"));
		}
	};

	/**
	 * Changes the table NoDataText to "Please press Search Button".
	 *
	 * @private
	 * @since 1.24
	 */
	ValueHelpDialog.prototype.TableStateSearchData = function() {
		this._updateNoDataText(this._oRb.getText("VALUEHELPDLG_TABLE_PRESSSEARCH"));
	};

	/**
	 * Changes the table NoDataText.
	 *
	 * @param {string} sNoDataText Text for "no data" information
	 * @private
	 * @since 1.40
	 */
	ValueHelpDialog.prototype._updateNoDataText = function(sNoDataText) {
		if (this._oTable) {
			if (this._oTable.setNoData) {
				this._oTable.setNoData(sNoDataText);
			} else if (this._oTable.setNoDataText) {
				this._oTable.setNoDataText(sNoDataText);
			}
		}
	};

	/**
	 * Changes the table NoDataText to "No Data found!".
	 *
	 * @private
	 * @since 1.24
	 */
	ValueHelpDialog.prototype.TableStateDataFilled = function() {
		this._updateNoDataText(this._oRb.getText("VALUEHELPDLG_TABLE_NODATA"));
	};

	/**
	 * Changes the table NoDataText to "Searching...".
	 *
	 * @private
	 * @since 1.28
	 */
	ValueHelpDialog.prototype.TableStateDataSearching = function() {
		this._updateNoDataText(this._oRb.getText("VALUEHELPDLG_TABLE_SEARCHING"));
	};

	/*
	 * Initializes the control.
	 */
	ValueHelpDialog.prototype.init = function() {
		Dialog.prototype.init.apply(this);

		this._oTokenIdCount = {};

		this._bTableCreatedInternal = false;

		this._aIncludeRangeOperations = {};
		this._aExcludeRangeOperations = {};

		this.setStretch(this._isPhone());
		this.setResizable(!this._isPhone());
		this.setDraggable(!this._isPhone());

		this.bCollectiveSearchActive = false;

		// init the Dialog itself
		this.addStyleClass("compValueHelpDialog");

		// init some resources
		this._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");
		this._sTableTitle1 = this._oRb.getText("VALUEHELPDLG_TABLETITLE1");
		this._sTableTitle2 = this._oRb.getText("VALUEHELPDLG_TABLETITLE2");
		this._sTableTitleNoCount = this._oRb.getText("VALUEHELPDLG_TABLETITLENOCOUNT");

		this._currentViewMode = null;
		this._oSelectedItems = new ItemsCollection();
		this._oSelectedRanges = {};

		this._createHeaderBar();

		this._createCollectiveSearch();

		this._createTokenizer();
		this._updateTokenizer();

		this._oVBox = new VBox(this.getId() + "-vbox", {
			fitContainer: true
		});
		this.addContent(this._oVBox);

		this._oMainLayout = new VBox(this.getId() + "-mainLayout", {
			fitContainer: true,
			items: [
				this._oFilterBar
			],
			layoutData: new FlexItemData({
				growFactor: 1,
				shrinkFactor: 0
			})
		});

		this._createNavigationControl();
		this._updateNavigationControl();

		this._oVBox.addItem(this._oMainLayout);

		if (this.getMaxIncludeRanges() === "-1" && this.getMaxExcludeRanges() !== "0" && !this.getFilterMode()) {
			this._oVBox.addItem(this._oTokenizerGrid);
		}

		this._createFooterControls();

		// vertical scrolling of the dialog content is disabled to get the expected layout of the used VBox in the content.
		// scrolling itself is enabled via css overflow-y: auto
		this.setVerticalScrolling(false);
		this.setHorizontalScrolling(false);

		// to support touch scrolling we have to set the event to marked, otherwise when using a sap.m.App touch events are not handled.
		if (!Device.system.desktop) {
			this._oVBox.attachBrowserEvent("touchmove", function(event) {
				event.setMarked();
			});
		}

		if (!this._isPhone()) {
			this._updateView(_ValueHelpViewMode.DESKTOP_LIST_VIEW);
		}
	};

	/**
	 * Update the visible view of the dialog. The method is changing the visibility of the used controls to only show the required parts of the view.
	 *
	 * @private
	 * @param {_ValueHelpViewMode} newViewMode View mode which should be shown
	 */
	ValueHelpDialog.prototype._updateView = function(newViewMode) {
		if (this._currentViewMode === newViewMode) {
			return;
		}

		switch (newViewMode) {
			case _ValueHelpViewMode.DESKTOP_LIST_VIEW:
				this._validateRanges(function() {
					// when valid show the Items Table
					this._oTokenizerGrid.setVisible(this.getSupportMultiselect());
					this._oMainLayout.removeAllItems();
					if (this._oTabBar && this._oTabBar.getSelectedKey() !== _ValueHelpViewMode.DESKTOP_LIST_VIEW) {
						this._oTabBar.setSelectedKey(_ValueHelpViewMode.DESKTOP_LIST_VIEW);
					}
					this._oMainLayout.addItem(this._oFilterBar);
					this._oMainLayout.addItem(this._oTable);
					this._updateDlgTitle();
				}.bind(this), function() {
					// if not valid go back to the Ranges Tab
					this._oTabBar.setSelectedKey(_ValueHelpViewMode.DESKTOP_CONDITIONS_VIEW);
					this._updateView(_ValueHelpViewMode.DESKTOP_CONDITIONS_VIEW);
				}.bind(this));
				break;

			case _ValueHelpViewMode.DESKTOP_CONDITIONS_VIEW:

				if (this.getSupportRanges()) {
					this.bCollectiveSearchActive = this.oSelectionTitle.getVisible() && this.oSelectionButton.getVisible();
					this._oMainLayout.removeAllItems();
					if (this._oTabBar && this._oTabBar.getSelectedKey() !== _ValueHelpViewMode.DESKTOP_CONDITIONS_VIEW) {
						this._oTabBar.setSelectedKey(_ValueHelpViewMode.DESKTOP_CONDITIONS_VIEW);
					}
					this._createAddRanges();
					this._oButtonOk.setVisible(this.getSupportRangesOnly() || this.getSupportMultiselect());

					this._oTokenizerGrid.setVisible(this.getSupportMultiselect());
					if (!(this.getMaxIncludeRanges() === "-1" && this.getMaxExcludeRanges() !== "0" && !this.getFilterMode())) {
						this._oTokenizerGrid.setVisible(false);
					}
				}
				break;

			case _ValueHelpViewMode.PHONE_MAIN_VIEW:
				this.setVerticalScrolling(false);

				this._oColSearchBox.setVisible(false);
				this._oMainListMenu.setVisible(true);
				this._updateNavigationControl();
				this._oAdvancedSearchLink.setVisible(false);
				if (this._oFilterBar) {
					this._oFilterBar.setVisible(false);
					this._oFilterBar.setFilterBarExpanded(false);
				}
				if (this._oTable) {
					this._oTable.setVisible(false);
				}

				this._oTokenizerGrid.setVisible(this.getSupportMultiselect());
				if (!(this.getMaxIncludeRanges() === "-1" && this.getMaxExcludeRanges() !== "0" && !this.getFilterMode())) {
					this._oTokenizerGrid.setVisible(false);
				}

				if (this._oRanges) {
					this._oRanges.setVisible(false);
				}

				this._oButtonGo.setVisible(false);
				this._oButtonClear.setVisible(false);
				this._oButtonOk.setVisible(true);
				this._oButtonCancel.setVisible(true);
				this._oBackButton.setVisible(false);

				this._bNoneMainView = false;
				// if we do not show the Tokenizer (Selected/Excluded Items and only have either a List or the Condition part as ListItem we directly
				// open the List or Condition view in the dialog
				if (!this._oTokenizerGrid.getVisible() && !(this._oSelectItemLI.getVisible() && this._oDefineConditionsLI.getVisible())) {
					this._bNoneMainView = true; // used to not show the backbutton on the list and condition view
					if (this._oSelectItemLI.getVisible()) {
						// make the Selection Table visible by default
						this._updateView(_ValueHelpViewMode.PHONE_LIST_VIEW);
					}
					if (this._oDefineConditionsLI.getVisible()) {
						// make the condition screen visible by default
						this._updateView(_ValueHelpViewMode.PHONE_CONDITIONS_VIEW);
					}
					return;
				}

				break;

			case _ValueHelpViewMode.PHONE_LIST_VIEW:
				this.setVerticalScrolling(true);

				this._oColSearchBox.setVisible(this.bCollectiveSearchActive);
				this._oMainListMenu.setVisible(false);
				if (this._oFilterBar) {
					var bShowAdvancedSearch = this._oFilterBar && this._oFilterBar.getFilterGroupItems() && this._oFilterBar.getFilterGroupItems().length > 0;
					this._oAdvancedSearchLink.setVisible(bShowAdvancedSearch);
					this._oFilterBar.setShowGoButton(!(this._oFilterBar && this._oFilterBar.getBasicSearch()));
					this._oFilterBar.setVisible(true);
					this._oFilterBar.setFilterBarExpanded(false);
				}
				if (this._oTable) {
					this._oTable.setVisible(true);
				}
				this._oTokenizerGrid.setVisible(false);
				if (this._oRanges) {
					this._oRanges.setVisible(false);
				}

				this._oButtonGo.setVisible(false);
				this._oButtonClear.setVisible(false);
				this._oButtonOk.setVisible(this.getSupportMultiselect());
				this._oButtonCancel.setVisible(true);
				this._oBackButton.setVisible(!this._bNoneMainView);
				break;

			case _ValueHelpViewMode.PHONE_SEARCH_VIEW:
				this.setVerticalScrolling(true);

				this._oColSearchBox.setVisible(false);
				this._oMainListMenu.setVisible(false);
				if (this._oFilterBar) {
					this._oFilterBar.setVisible(true);
					this._oFilterBar.setFilterBarExpanded(true);
				}
				this._oAdvancedSearchLink.setVisible(false);
				if (this._oTable) {
					this._oTable.setVisible(false);
				}
				this._oTokenizerGrid.setVisible(false);
				if (this._oRanges) {
					this._oRanges.setVisible(false);
				}

				this._oButtonGo.setVisible(true);
				this._oButtonClear.setVisible(true);
				this._oButtonOk.setVisible(false);
				this._oButtonCancel.setVisible(true);
				this._oBackButton.setVisible(true);
				break;

			case _ValueHelpViewMode.PHONE_CONDITIONS_VIEW:
				this.setVerticalScrolling(true);

				this._oColSearchBox.setVisible(false);
				this._oMainListMenu.setVisible(false);
				if (this._oFilterBar) {
					this._oFilterBar.setVisible(false);
				}
				this._oAdvancedSearchLink.setVisible(false);
				if (this._oTable) {
					this._oTable.setVisible(false);
				}
				this._oTokenizerGrid.setVisible(false);
				if (!this._oRanges) {
					this._createAddRanges();
				}
				if (this._oRanges) {
					this._oRanges.setVisible(true);
				}

				this._oButtonGo.setVisible(false);
				this._oButtonClear.setVisible(false);
				this._oButtonOk.setVisible(true);
				this._oButtonCancel.setVisible(true);
				this._oBackButton.setVisible(!this._bNoneMainView);
				break;

			default:
				break;
		}

		if (this._oMainListMenu && this._oVBox) {

			// check if the Toolbar of the FilterBar is empty and make the toolbar invisible
			if (this._oFilterBar) {
				this._oFilterBar._handleVisibilityOfToolbar();
			}

			this._oVBox.rerender();
		}

		this._currentViewMode = newViewMode;
		this._updateDlgTitle();
	};

	/**
	 * select or deselect the row in the table with the given key
	 *
	 * @private
	 * @param {string} sKey the key of the row
	 * @param {boolean} bSelect specifies if the row should be selected or deselected
	 */
	ValueHelpDialog.prototype._changeTableRowSelectionForKey = function(sKey, bSelect) {
		var i;
		var oTable = this._oTable;

		this._bIgnoreSelectionChange = true;

		if (oTable && oTable.isA("sap.ui.table.Table")) {
			var rows = oTable.getBinding("rows");
			if (rows) {
				if (rows.aKeys) {
					for (i = 0; i < rows.aKeys.length; i++) {
						if (decodeURIComponent(rows.aKeys[i]) === sKey) {
							if (bSelect) {
								oTable.addSelectionInterval(i, i);
							} else {
								oTable.removeSelectionInterval(i, i);
							}
							break;
						}
					}
				} else {
					this.oRows = oTable.getBinding("rows");
					if (this.oRows.aIndices) {
						for (i = 0; i < this.oRows.aIndices.length; i++) {
							var oContext = oTable.getContextByIndex(this.oRows.aIndices[i]);
							if (oContext) {
								var oRow = oContext.getObject();
								if (oRow[this.getKey()] === sKey) {
									if (bSelect) {
										oTable.addSelectionInterval(i, i);
									} else {
										oTable.removeSelectionInterval(i, i);
									}
									break;
								}
							}
						}
					}
				}
			}
		} else {

			// Handle selection update of the m.table
			for (i = 0; i < oTable.getItems().length; i++) {
				var oColListItem = oTable.getItems()[i];
				var oRowData = oColListItem.getBindingContext().getObject();
				if (oRowData[this.getKey()] === sKey) {
					oTable.setSelectedItem(oColListItem, bSelect);
					break;
				}
			}

		}

		this._bIgnoreSelectionChange = false;

	};

	/**
	 * Updates the selection of rows in the table. This function must be called after a first binding or binding update of the table. It will set a
	 * table row as selected if a token for this row exists.
	 *
	 * @public
	 * @since 1.24
	 */
	ValueHelpDialog.prototype.update = function() {
		var i, j, oRow, oContext;
		var sKey;
		var aItems = this._oSelectedItems.getItems();
		var eventArgs = {
			tokenKeys: aItems,
			useDefault: false
		};

		this._bIgnoreSelectionChange = true;

		if (this._hasListeners("updateSelection")) {
			this.fireUpdateSelection(eventArgs);
		} else {
			eventArgs.useDefault = true;
		}

		if (eventArgs.useDefault) {

			if (this._oTable && this._oTable.isA("sap.ui.table.Table")) {

				this.oRows = this._oTable.getBinding("rows");
				this._oTable.clearSelection();

				if (this.oRows && this.oRows.aKeys) {
					var aKeys = this.getKeys();
					var sRowKeyPartPrefix = aKeys && aKeys.length > 1 ? this.getKey() + "=" : "";

					// in case of an oDataModel binding the aKeys exist and the row will be found via the keys.
					for (j = 0; j < aItems.length; j++) {
						sKey = aItems[j];
						//sKeyEncoded = encodeURIComponent(sKey); //key of the item must be encoded before we search the item in the table row keys.

						//TODO instead of using encodeURI of the Token key we could try to use the oDataModel.createKey function to build the row key from the Token
						//var sPath = this.oRows.sPath.slice(1);
						//var oRowData = this._oSelectedItems.getItem(aItems[j]);
						//var sKey2 = this.getModel().createKey(sPath, oRowData);

						var sRowKeyPart = sRowKeyPartPrefix + "'" + sKey + "'";

						for (i = 0; i < this.oRows.aKeys.length; i++) {
							var sRowKey = this.oRows.aKeys[i];
							if (sRowKey === undefined) {
								continue;
							}
							sRowKey = decodeURIComponent(sRowKey);
							var bIsRow = sRowKey === sKey;
							if (bIsRow || // either the rowKey is equal the token key or we search if the main key with the value is part of the rowKey
								sRowKey.indexOf(sRowKeyPart) >= 0) {

								if (!bIsRow) { // in this case we will update the old key and use the longKey from the rows
									this._oSelectedItems.remove(sKey); // remove the old key
									// and update the Token key
									var token = this._getTokenByKey(sKey, this._oSelectedTokens);
									if (token) {
										token.setKey(sRowKey);
									}
								}

								// update the row data in the selectedItems List
								oContext = this._oTable.getContextByIndex(i);
								if (oContext) {
									oRow = oContext.getObject();
									this._oSelectedItems.add(sRowKey, oRow);
								}

								// make the row selected
								this._oTable.addSelectionInterval(i, i);
								break;
							}
						}
					}
				} else if (this.oRows && this.oRows.aIndices) {
					this._oTable.clearSelection();

					for (j = 0; j < aItems.length; j++) {
						var key = aItems[j];
						for (i = 0; i < this.oRows.aIndices.length; i++) {
							oContext = this._oTable.getContextByIndex(this.oRows.aIndices[i]);
							if (oContext) {
								oRow = oContext.getObject();
								if (oRow[this.getKey()] === key) {
									this._oSelectedItems.add(oRow[this.getKey()], oRow);
									this._oTable.addSelectionInterval(i, i);
									break;
								}
							}
						}
					}
				}

			} else {
				// Handle selection update of the m.table
				var oTable = this._oTable;
				for (j = 0; j < aItems.length; j++) {
					sKey = aItems[j];
					for (i = 0; i < oTable.getItems().length; i++) {
						var oColListItem = oTable.getItems()[i];
						var oRowData = oColListItem.getBindingContext().getObject();
						if (oRowData[this.getKey()] === sKey) {
							oTable.setSelectedItem(oColListItem, true);
							break;
						}
					}
				}

			}
		}

		this._bIgnoreSelectionChange = false;

		this._updateTitles();
	};

	/**
	 * Create the header bar, the controls for the header and adds it into the custom header.
	 *
	 * @private
	 */
	ValueHelpDialog.prototype._createHeaderBar = function() {
		this._oTitle = new Title(this.getId() + "-title");

		var oBackButton = null;
		if (this._isPhone()) {
			oBackButton = new Button(this.getId() + "-back", {
				visible: false,
				type: ButtonType.Back,
				press: function(oEvent) {
					if (this._currentViewMode === _ValueHelpViewMode.PHONE_SEARCH_VIEW) {
						this._updateView(_ValueHelpViewMode.PHONE_LIST_VIEW);
					} else {
						this._updateView(_ValueHelpViewMode.PHONE_MAIN_VIEW);
					}
				}.bind(this)
			});

			this._oBackButton = oBackButton;
		}

		this.setCustomHeader(new Bar(this.getId() + "-header", {
			contentLeft: oBackButton,
			contentMiddle: this._oTitle
		}));
		this.getCustomHeader().addStyleClass("sapContrastPlus");
	};

	/**
	 * Creates the collective search elements which are placed beside the <code>FilterBar</code>.
	 *
	 * @private
	 */
	ValueHelpDialog.prototype._createCollectiveSearch = function() {
		// the oSelectionText and oSelectionButton are accessed outside the dialog!!!
		this.oSelectionTitle = new Text(this.getId() + "-selTitle", {
			visible: false,
			wrapping: false
		}).addStyleClass("compVHColSearchText");

		if (Device.system.tablet && !Device.system.desktop) {
			this.oSelectionTitle.addStyleClass("compVHColSearchTextTabletMaxWidth");
		} else {
			this.oSelectionTitle.addStyleClass("compVHColSearchTextMaxWidth");
		}

		this.oSelectionButton = new Button(this.getId() + "-selButton", {
			icon: "sap-icon://arrow-down",
			tooltip: this._oRb.getText("VALUEHELPVALDLG_SEARCHTEMPLATES_TOOLTIP"), // "Search Templates",
			type: ButtonType.Transparent,
			visible: false,
			ariaLabelledBy: this.oSelectionTitle
		}).addStyleClass("compVHColSearchBtn");

		this._oColSearchBox = new HBox(this.getId() + "-selBox", {
			fitContainer: true,
			visible: this.oSelectionButton.getVisible(),
			items: [
				this.oSelectionTitle, this.oSelectionButton
			]
		}).addStyleClass("compVHColSearchVBox");
	};

	/**
	 * Creates the footer buttons.
	 *
	 * @private
	 */
	ValueHelpDialog.prototype._createFooterControls = function() {
		this._oButtonOk = new Button(this.getId() + "-ok", {
			text: this._oRb.getText("VALUEHELPDLG_OK"),
			press: this._onCloseAndTakeOverValues.bind(this),
			visible: this.getSupportMultiselect(),
			type: ButtonType.Emphasized,
			layoutData: new OverflowToolbarLayoutData({
				priority: OverflowToolbarPriority.NeverOverflow
			})
		});

		this._oButtonCancel = new Button(this.getId() + "-cancel", {
			text: this._oRb.getText("VALUEHELPDLG_CANCEL"),
			press: this._onCancel.bind(this),
			layoutData: new OverflowToolbarLayoutData({
				priority: OverflowToolbarPriority.NeverOverflow
			})
		});

		if (this._isPhone()) {
			this._oButtonGo = new Button(this.getId() + "-go", {
				text: this._oRb.getText("VALUEHELPDLG_GO"),
				type: ButtonType.Emphasized,
				press: this._onGo.bind(this),
				visible: false,
				layoutData: new OverflowToolbarLayoutData({
					priority: OverflowToolbarPriority.NeverOverflow
				})
			});

			this._oButtonClear = new Button(this.getId() + "-clear", {
				text: this._oRb.getText("VALUEHELPDLG_CLEAR"),
				press: this._onClear.bind(this),
				visible: false,
				layoutData: new OverflowToolbarLayoutData({
					priority: OverflowToolbarPriority.NeverOverflow
				})
			});

			this.addButton(this._oButtonGo);
			this.addButton(this._oButtonClear);
		}
		this.addButton(this._oButtonOk);
		this.addButton(this._oButtonCancel);
	};

	/**
	 * Creates the tokenizer part of the dialog.
	 *
	 * @private
	 * @returns {sap.ui.layout.Grid} with all elements
	 */
	ValueHelpDialog.prototype._createTokenizer = function() {
		if (this._oTokenizerGrid) {
			return this._oTokenizerGrid;
		}

		this._oSelectedTokenTitle = new InvisibleText(this.getId() + "-selectedTokenTitle");

		this._oSelectedTokens = new Tokenizer(this.getId() + "-selectedTokens", {
			tokenUpdate: function(oControlEvent) {
				if (this._ignoreRemoveToken) {
					return;
				}

				if (oControlEvent.getParameter("type") === Tokenizer.TokenChangeType.Removed) {
					var aRemovedTokens = oControlEvent.getParameter("removedTokens");
					var aTokenKeys = [];
					var aRangeTokenKeys = [];

					for (var j = 0; j < aRemovedTokens.length; j++) {
						var oToken = aRemovedTokens[j];
						var sKey = oToken.getKey();

						if (this._oSelectedRanges && this._oSelectedRanges[sKey]) {
							aRangeTokenKeys.push(sKey);
							this._removeToken(sKey);
						} else {
							aTokenKeys.push(sKey);

							// remove single selected item
							this._oSelectedItems.remove(sKey);
							this._removeTokenFromTokenizer(sKey, this._oSelectedTokens);
						}
					}

					// remove range tokens
					this._removeRangeByKey(aRangeTokenKeys, false);
					// this._updateTitles();

					var eventArgs = {
						tokenKeys: aTokenKeys,
						useDefault: false
					};

					if (this._hasListeners("tokenRemove")) {
						this._bIgnoreSelectionChange = true;
						this.fireTokenRemove(eventArgs);
						this._bIgnoreSelectionChange = false;

						// if (eventArgs.useDefault) {
						// sap.m.MessageToast.show("useDefault");
						// }

					} else {
						eventArgs.useDefault = true;
					}

					if (eventArgs.useDefault) {
						aTokenKeys.forEach(function(sTokenKey) {
							this._changeTableRowSelectionForKey(sTokenKey, false);
						}.bind(this));
					}

					// try to set the focus to other token - Workaround because the Tokenizer does not set the focus to other token
					if (aRemovedTokens.length === 1) {
						setTimeout(function() {
							if (this._oSelectedTokens.getTokens()) {
								var i = this._oSelectedTokens.getTokens().length - 1;
								if (i >= 0) {
									this._oSelectedTokens.getTokens()[i].focus();
								}
							}
						}.bind(this));
					}

					this._updateTitles();
				}

			}.bind(this),
			ariaLabelledBy: this._oSelectedTokenTitle
		}).addStyleClass("compVHTokensDiv");

		// this "remove all" button is a workaround and should be part of the Tokenizer itself
		this._oRemoveAllSelectedItemsBtn = new Button(this.getId() + "-removeSelItems", {
			type: ButtonType.Transparent,
			icon: IconPool.getIconURI("sys-cancel"),
			tooltip: this._oRb.getText("VALUEHELPVALDLG_REMOVETOKENS_TOOLTIP"),
			press: function() {
				this._oSelectedTokens.destroyTokens();

				this._removeRangeByKey(Object.keys(this._oSelectedRanges), false);

				this._oSelectedItems.removeAll();
				this._bIgnoreSelectionChange = true;
				if (this._oTable && this._oTable.clearSelection) {
					this._oTable.clearSelection();
				}
				if (this._oTable && this._oTable.removeSelections) {
					this._oTable.removeSelections();
				}
				this._bIgnoreSelectionChange = false;

				this._updateTitles();
			}.bind(this),
			ariaLabelledBy: this._oSelectedTokenTitle
		}).addStyleClass("compVHRemoveAllBtn");

		var oHContainer1 = new HorizontalLayout(this.getId() + "-selItemsBox", {
			content: [
				this._oSelectedTokens, this._oRemoveAllSelectedItemsBtn
			]
		}).addStyleClass("compVHTokenizerHLayout");

		this._oIncludeTokenGrid = new Grid(this.getId() + "-selItemsGrid", {
			width: "100%",
			defaultSpan: "L12 M12 S12",
			hSpacing: 0,
			vSpacing: 0,
			content: [
				this._oSelectedTokenTitle, oHContainer1
			]
		}).addStyleClass("sapUiRespGridOverflowHidden");

		this._oExcludedTokenTitle = new Text(this.getId() + "-excludedTokenTitle").addStyleClass("compVHSelectedItemsText");

		this._oExcludedTokens = new Tokenizer(this.getId() + "-excludedTokens", {
			tokenChange: function(oControlEvent) {
				if (this._ignoreRemoveToken) {
					return;
				}

				if (oControlEvent.getParameter("type") === Tokenizer.TokenChangeType.Removed || oControlEvent.getParameter("type") === Tokenizer.TokenChangeType.RemovedAll) {
					var aRemovedTokens = oControlEvent.getParameter("removedTokens");
					var aTokenKeys = [];

					if (!aRemovedTokens || aRemovedTokens.length == 0) {
						aRemovedTokens = [oControlEvent.getParameter("token")];
					}

					if (!aRemovedTokens || aRemovedTokens.length == 0) {
						aRemovedTokens = [oControlEvent.getParameter("tokens")];
					}

					for (var j = 0; j < aRemovedTokens.length; j++) {
						var oToken = aRemovedTokens[j];
						var sKey = oToken.getKey();
						if (this._oSelectedRanges && this._oSelectedRanges[sKey]) {
							aTokenKeys.push(sKey);
						}
					}

					// remove range
					this._removeRangeByKey(aTokenKeys, true);
					this._updateTitles();
				}

			}.bind(this),
			ariaLabelledBy: this._oExcludedTokenTitle
		}).addStyleClass("compVHTokensDiv");

		// this "remove all" button is a workaround and should be part of the Tokenizer itself
		this._oRemoveAllExcludeItemsBtn = new Button(this.getId() + "-removeExclItems", {
			type: ButtonType.Transparent,
			icon: IconPool.getIconURI("sys-cancel"),
			tooltip: this._oRb.getText("VALUEHELPVALDLG_REMOVETOKENS_TOOLTIP"),
			press: function() {
				this._oExcludedTokens.destroyTokens();

				this._removeRangeByKey(Object.keys(this._oSelectedRanges), true);
				this._updateTitles();
			}.bind(this),
			ariaLabelledBy: this._oExcludedTokenTitle
		}).addStyleClass("compVHRemoveAllBtn");

		var oHContainer2 = new HorizontalLayout(this.getId() + "-exclItemsBox", {
			content: [
				this._oExcludedTokens, this._oRemoveAllExcludeItemsBtn
			]
		}).addStyleClass("compVHTokenizerHLayout");

		this._oExcludeTokenGrid = new Grid(this.getId() + "-exclItemsGrid", {
			width: "100%",
			defaultSpan: "L12 M12 S12",
			hSpacing: 0,
			vSpacing: 0,
			content: [
				this._oExcludedTokenTitle, oHContainer2
			]
		}).addStyleClass("sapUiRespGridOverflowHidden");

		// only on tablet and desktop we use the expandable panel
		this._oTokenizerPanel = new Panel(this.getId() + "-tokenPanel", {
			expanded: Device.system.desktop,
			expandable: true, // this._isPhone() ? false : true,
			expandAnimation: true,
			headerText: "",
			width: "auto",
			content: [
				this._oIncludeTokenGrid, this._oExcludeTokenGrid
			],
			expand: function(oEvent) {
				this._updateTokenizer();

				if (oEvent.mParameters.expand && this._oTable && !(this._oTable.isA("sap.m.Table"))) {
					// when we open the tokens scroll the dialog content to the end
					var oScrollDiv = window.document.getElementById(this.getId() + "-scrollCont");
					if (oScrollDiv && oScrollDiv.scrollTop) {
						oScrollDiv.stop().animate({
							scrollTop: "1000" // oScrollDiv.prop("scrollHeight") - oScrollDiv.height()
						}, 1000);
					}
				}
			}.bind(this)
		}).addStyleClass("compVHBackgroundTransparent").addStyleClass("compVHTokensPanel").addStyleClass("compValueHelpDialogTokens");

		if (this._isPhone()) {
			// workaround to get a vertical layout of the Tokens in the tokenizer
			this._oSelectedTokens.addStyleClass("sapMTokenizerMultiLine");
			this._oExcludedTokens.addStyleClass("sapMTokenizerMultiLine");
		}

		this._oTokenizerGrid = new Grid(this.getId() + "-tokenizerGrid", {
			width: "100%",
			defaultSpan: "L12 M12 S12",
			hSpacing: 0,
			vSpacing: 0,
			content: this._oTokenizerPanel
		}).addStyleClass("compVHDarkBackground").addStyleClass("sapUiRespGridOverflowHidden");

		return this._oTokenizerGrid;
	};

	/**
	 * Add/Modify a token in a tokenizer control.
	 *
	 * @private
	 * @param {string} sKey of the token
	 * @param {string} sText the token text
	 * @param {sap.m.Tokenizer} oTokenizer the Tokenizer which contain the token
	 * @param {string} sKeyField the token key field (if range)
	 */
	ValueHelpDialog.prototype._addToken2Tokenizer = function(sKey, sText, oTokenizer, sKeyField) {
		var sTooltip = (typeof sText === "string") ? sText : "";
		var oToken = this._getTokenByKey(sKey, oTokenizer);
		if (!oToken) {
			// create a new token
			oToken = new Token(_getTokenId.call(this, sKey, sKeyField));
			oToken.setKey(sKey);
			oTokenizer.addToken(oToken);
			this._updateTokenizer();
		}

		if (oToken) {
			// update existing/new token text
			oToken.setText(sText);
			oToken.setTooltip(sTooltip);
		}
	};

	/**
	 * Search a token by key in the given tokenizer.
	 *
	 * @private
	 * @param {string} sKey of the token
	 * @param {sap.m.Tokenizer} oTokenizer the Tokenizer which contain the token
	 * @returns {sap.m.Token} the found token instance or null
	 */
	ValueHelpDialog.prototype._getTokenByKey = function(sKey, oTokenizer) {
		var aTokens = oTokenizer.getTokens();
		for (var i = 0; i < aTokens.length; i++) {
			var token = aTokens[i];
			if (token.getKey() === sKey) {
				return token;
			}
		}
		return null;
	};

	/**
	 * Removes a token from the selected or excluded tokenizer.
	 *
	 * @private
	 * @param {string} sKey of the token
	 */
	ValueHelpDialog.prototype._removeToken = function(sKey) {
		if (!this._removeTokenFromTokenizer(sKey, this._oSelectedTokens)) {
			this._removeTokenFromTokenizer(sKey, this._oExcludedTokens);
		}
	};

	/**
	 * Removes a token from a tokenizer.
	 *
	 * @private
	 * @param {string} sKey of the token
	 * @param {sap.m.Tokenizer} oTokenizer the Tokenizer which contain the token
	 * @returns {boolean} true when the token has been found and removed, else false
	 */
	ValueHelpDialog.prototype._removeTokenFromTokenizer = function(sKey, oTokenizer) {
		var token = this._getTokenByKey(sKey, oTokenizer);
		if (token) {
			this._ignoreRemoveToken = true;
			oTokenizer.removeToken(token);
			token.destroy();
			this._ignoreRemoveToken = false;
			this._updateTokenizer();
			return true;
		}
		return false;
	};

	/**
	 * Updating the tokenizer title and RemoveAll buttons.
	 *
	 * @private
	 */
	ValueHelpDialog.prototype._updateTokenizer = function() {
		var bExpanded = false;
		if (this._oTokenizerPanel) {
			bExpanded = this._oTokenizerPanel.getExpanded();
			// this._oSelectedTokenTitle.setVisible(false);
		}

		var n1 = this._oSelectedTokens.getTokens().length;
		var n2 = this._oExcludedTokens.getTokens().length;

		var sSelectedItemsTitle = this._oRb.getText("VALUEHELPDLG_SELECTEDITEMS");
		var sNoneSelectedItemsTitle = this._oRb.getText("VALUEHELPDLG_NONESELECTEDITEMS");

		var sSelectedItemsText = sSelectedItemsTitle.replace("{0}", n1.toString());
		var sExcludedItemsText = this._oRb.getText("VALUEHELPDLG_EXCLUDEDITEMS", n2.toString());
		var sText = n1 === 0 ? sNoneSelectedItemsTitle : sSelectedItemsText;

		if (this._oTokenizerPanel) {
			if (!bExpanded) {
				if (this._isPhone()) {
					sSelectedItemsText = this._oRb.getText("VALUEHELPDLG_SELECTEDITEMS_SHORT", n1.toString());
					sExcludedItemsText = this._oRb.getText("VALUEHELPDLG_EXCLUDEDITEMS_SHORT", n2.toString());
				}
				sText = "";
				if (n1 !== 0) {
					sText = sSelectedItemsText;
				}
				if (n2 !== 0) {
					sText += (n1 !== 0 ? " / " : "") + sExcludedItemsText;
				}
				if (sText === "") {
					sText = sNoneSelectedItemsTitle;
				}
			} else if (n1 === 0 && n2 !== 0) {
				sText = sExcludedItemsText;
				sExcludedItemsText = "";
			}
			this._oTokenizerPanel.setHeaderText(sText);
			this._oSelectedTokenTitle.setText(sText);
		} else {
			this._oSelectedTokenTitle.setText(sText);
		}
		this._oRemoveAllSelectedItemsBtn.setEnabled(n1 !== 0);
		this._oRemoveAllExcludeItemsBtn.setEnabled(n2 !== 0);

		this._oExcludedTokenTitle.setText(sExcludedItemsText);

		if (n1 === 0 && n2 !== 0) {
			// hide all when only exclude items exist
			this._oIncludeTokenGrid.addStyleClass("displayNone");
			if (!this._isPhone()) {
				this._oExcludedTokenTitle.addStyleClass("displayNone");
			}
		} else {
			this._oIncludeTokenGrid.removeStyleClass("displayNone");
			this._oExcludedTokenTitle.removeStyleClass("displayNone");
		}

		if (n2 === 0) {
			this._oExcludeTokenGrid.addStyleClass("displayNone");
		} else {
			this._oExcludeTokenGrid.removeStyleClass("displayNone");
		}
	};

	/**
	 * Create the TabBar or on Phone the ListItems as navigation control.
	 *
	 * @private
	 */
	ValueHelpDialog.prototype._createNavigationControl = function() {
		if (!this._isPhone()) {
			this._oTabBar = new IconTabBar(this.getId() + "-navigation", {
				upperCase: true,
				expandable: false,
				items: [
					new IconTabFilter(this.getId() + "-itemstable", {
						visible: true,
						text: this._oRb.getText("VALUEHELPDLG_ITEMSTABLE"),
						key: _ValueHelpViewMode.DESKTOP_LIST_VIEW
					}), new IconTabFilter(this.getId() + "-ranges", {
						visible: true,
						text: this._oRb.getText("VALUEHELPDLG_RANGES"),
						key: _ValueHelpViewMode.DESKTOP_CONDITIONS_VIEW
					})
				],
				select: function(oControlEvent) {
					this._updateView(oControlEvent.getParameters().key);
				}.bind(this)
			});

			this._oTabBar.setLayoutData(new FlexItemData({
				shrinkFactor: 0
			}));
			this._oVBox.addItem(this._oTabBar);

		} else {

			this._oSelectItemLI = new StandardListItem(this.getId() + "-itemstable", {
				type: ListType.Navigation,
				title: this._oRb.getText("VALUEHELPDLG_ITEMSTABLE")
			}).data("key", _ValueHelpViewMode.PHONE_LIST_VIEW);

			this._oDefineConditionsLI = new StandardListItem(this.getId() + "-ranges", {
				type: ListType.Navigation,
				title: this._oRb.getText("VALUEHELPDLG_RANGES")
			}).data("key", _ValueHelpViewMode.PHONE_CONDITIONS_VIEW);

			this._oMainListMenu = new List(this.getId() + "-navigation", {
				mode: ListMode.None,
				items: [
					this._oSelectItemLI, this._oDefineConditionsLI
				],
				itemPress: function(oEvent) {
					if (oEvent) {
						this._updateView(oEvent.mParameters.listItem.data("key"));
					}
				}.bind(this)
			});

			this._oMainListMenu.setLayoutData(new FlexItemData({
				shrinkFactor: 0
			}));
			this._oVBox.addItem(this._oMainListMenu);

			this._oAdvancedSearchLink = new Link(this.getId() + "-advancedSearchLink", {
				text: this._oRb.getText("VALUEHELPDLG_ADVANCEDSEARCH"),
				press: function() {
					this._updateView(_ValueHelpViewMode.PHONE_SEARCH_VIEW);
				}.bind(this)
			}).addStyleClass("compVHAdvancedSearchLink");

			this._oAdvancedSearchLink.setLayoutData(new FlexItemData({
				shrinkFactor: 0
			}));
			this._oVBox.addItem(this._oAdvancedSearchLink);
		}
	};

	/**
	 * Update the TabBar or on Phone the Listitems.
	 *
	 * @private
	 */
	ValueHelpDialog.prototype._updateNavigationControl = function() {
		var bListTabVisible = !this.getSupportRangesOnly();
		var bRangesTabVisible = this.getSupportRangesOnly() || this.getSupportRanges();

		if (this._oTabBar) {

			var aTabItems = this._oTabBar.getItems();
			aTabItems[0].setVisible(bListTabVisible);
			aTabItems[1].setVisible(bRangesTabVisible);

			this._oTabBar.setVisible(bListTabVisible && bRangesTabVisible);
			this._updateDlgTitle();
		}

		if (this._oMainListMenu) {
			this._oSelectItemLI.setVisible(bListTabVisible);
			this._oDefineConditionsLI.setVisible(bRangesTabVisible);
		}

	};

	/**
	 * Remove a single/multiple range(s) from the UI and the internal selectedRanges list.
	 *
	 * @param {string|array} sKey Single or multiple sKey of the range
	 * @param {boolean} isExclude specifies if the removed range must be an included or excluded range
	 *
	 * @private
	 */
	ValueHelpDialog.prototype._removeRangeByKey = function(sKey, isExclude) {
		var aKeys = sKey;

		if (typeof aKeys === "string") {
			aKeys = [
				aKeys
			];
		}

		aKeys.forEach(function(sKey, index, aKeys) {
			var range = this._oSelectedRanges[sKey];
			if (range.exclude === isExclude) {
				if (!range._oGrid) {
					delete this._oSelectedRanges[sKey];

					if (this._oFilterPanel) {
						var oConditionPanel = range.exclude ? this._oFilterPanel._oExcludeFilterPanel : this._oFilterPanel._oIncludeFilterPanel;

						if (aKeys.length == 1) {
							// only in case of a single key we remove the condition
							oConditionPanel.removeCondition(sKey);
						} else {
							// to make it faster we only remove the key from the internal oConditionMap and later make a refresh on the conditionPanel
							oConditionPanel._removeConditionFromMap(sKey);
						}
					}
				}
			}
		}, this);

		if (aKeys.length > 1 && this._oFilterPanel) {
			var oConditionPanel = isExclude ? this._oFilterPanel._oExcludeFilterPanel : this._oFilterPanel._oIncludeFilterPanel;
			oConditionPanel._clearConditions();
			oConditionPanel._fillConditions();
		}
	};

	// ################################################################################
	// Start Ranges handling
	// ################################################################################

	/**
	 * Create a new instance of ranges grid and adds it into the main layout.
	 *
	 * @private
	 */
	ValueHelpDialog.prototype._createAddRanges = function() {
		if (!this._oRanges) {
			if (!sap.ui.require('sap/m/P13nFilterPanel')) {
				sap.ui.require(['sap/m/P13nFilterPanel'], function() {
					this._oRanges = this._createRanges();
					this._oMainLayout.addItem(this._oRanges);
				}.bind(this));
			} else {
				this._oRanges = this._createRanges();
				this._oMainLayout.addItem(this._oRanges);
			}
		} else {
			this._oMainLayout.addItem(this._oRanges);
		}
	};

	/**
	 * Create a new instance of ranges grid with all inner controls.
	 *
	 * @private
	 * @returns {sap.ui.layout.Grid} the ranges grid
	 */
	ValueHelpDialog.prototype._createRanges = function() {
		this._oFilterPanel = new P13nFilterPanel(this.getId() + "-filterPanel", {
			maxIncludes: this.getMaxIncludeRanges(),
			maxExcludes: this.getMaxExcludeRanges(),
			containerQuery: true,
			enableEmptyOperations: true,
			filterItemChanged: function(oEvent) {
				var sReason = oEvent.getParameter("reason");
				var sKey = oEvent.getParameter("key");
				var oItem = oEvent.getParameter("itemData");

				if (oItem && sReason === "added") {
					var oRange = {
						exclude: oItem.exclude,
						keyField: oItem.columnKey,
						operation: oItem.operation,
						value1: oItem.value1,
						value2: oItem.value2
					};
					this._oSelectedRanges[sKey] = oRange;

					// the new added filterItemData instance must be passed back into the filterpanel aggregation, otherwise the index of the add, update
					// or remove events is not correct.
					//oIDs[rangeData.keyField]++;
					var oFilterItem = new P13nAnyFilterItem({ //this.getId() + "-item_" + oItem.keyField + oIDs[oItem.keyField], {
						key: sKey,
						exclude: oItem.exclude,
						columnKey: oItem.columnKey,
						operation: oItem.operation
					});
					oFilterItem.setValue1(oItem.value1);
					oFilterItem.setValue2(oItem.value2);
					this._oFilterPanel.addFilterItem(oFilterItem);


					var sTokenText = this._getFormatedRangeTokenText(oRange.operation, oRange.value1, oRange.value2, oRange.exclude, oRange.keyField);
					this._addToken2Tokenizer(sKey, sTokenText, oRange.exclude ? this._oExcludedTokens : this._oSelectedTokens, oRange.keyField);
					this._updateTokenizer();
				}

				if (oItem && sReason === "updated") {
					var oRange = this._oSelectedRanges[sKey];
					oRange.exclude = oItem.exclude;
					oRange.keyField = oItem.columnKey;
					oRange.operation = oItem.operation;
					oRange.value1 = oItem.value1;
					oRange.value2 = oItem.value2;

					var sTokenText = this._getFormatedRangeTokenText(oRange.operation, oRange.value1, oRange.value2, oRange.exclude, oRange.keyField);
					this._addToken2Tokenizer(sKey, sTokenText, oRange.exclude ? this._oExcludedTokens : this._oSelectedTokens, oRange.keyField);
					this._updateTokenizer();
				}

				if (sReason === "removed") {
					delete this._oSelectedRanges[sKey];
					this._removeToken(sKey);
					this._updateTokenizer();
				}
			}.bind(this)
		});

		// Enable enhanced exclude operations
		if (this.getProperty("_enhancedExcludeOperations")) {
			this._oFilterPanel._enableEnhancedExcludeOperations();
		}

		this._oFilterPanel._oIncludeFilterPanel.setDisplayFormat(this.getDisplayFormat());
		this._oFilterPanel._oExcludeFilterPanel.setDisplayFormat(this.getDisplayFormat());

		this._oFilterPanel._oIncludeFilterPanel._fSuggestCallback = this._fSuggestCallback;
		this._oFilterPanel._oExcludeFilterPanel._fSuggestCallback = this._fSuggestCallback;

		this._oFilterPanel._oIncludeFilterPanel._sAddRemoveIconTooltipKey = "CONDITION";
		this._oFilterPanel._oExcludeFilterPanel._sAddRemoveIconTooltipKey = "CONDITION";
		var sType;
		if (this._aIncludeRangeOperations) {
			for (sType in this._aIncludeRangeOperations) {
				this._oFilterPanel.setIncludeOperations(this._aIncludeRangeOperations[sType], sType);
			}
		}

		if (this._aExcludeRangeOperations) {
			for (sType in this._aExcludeRangeOperations) {
				this._oFilterPanel.setExcludeOperations(this._aExcludeRangeOperations[sType], sType);
			}
		}

		// this._oFilterPanel.setKeyFields([{key: "KeyField1", text: "Field1"}, {key: "KeyField2", text: "Field2", type : "date", isDefault: true}]);
		if (this._aRangeKeyFields) {
			this._aRangeKeyFields.forEach(function(item) {
				this._oFilterPanel.addItem(new P13nItem({
					columnKey: item.key,
					text: item.label,
					typeInstance: item.typeInstance,
					type: item.type,
					maxLength: item.maxLength,
					formatSettings: item.formatSettings,
					scale: item.scale,
					precision: item.precision,
					isDefault: item.isDefault,
					values: null,
					nullable: item.nullable !== "false"
				}));
			}, this);
		}

		if (this._oSelectedRanges) {
			for (var rangeId in this._oSelectedRanges) {
				var rangeData = this._oSelectedRanges[rangeId];
				var oFilterItem = new P13nAnyFilterItem({
					key: rangeId,
					exclude: rangeData.exclude,
					columnKey: rangeData.keyField,
					operation: rangeData.operation
				});
				oFilterItem.setValue1(rangeData.value1);
				oFilterItem.setValue2(rangeData.value2);
				this._oFilterPanel.addFilterItem(oFilterItem);
			}
		}

		var oRangeFieldsGrid = new Grid(this.getId() + "-rangeFieldsGrid", {
			width: "100%",
			defaultSpan: "L12 M12 S12",
			vSpacing: 0,
			hSpacing: 0,
			content: [
				this._oFilterPanel
			]
		}).addStyleClass("sapUiRespGridOverflowHidden");


		this._sValidationDialogTitle = this._oRb.getText("VALUEHELPVALDLG_TITLE");
		this._sValidationDialogMessage = this._oRb.getText("VALUEHELPVALDLG_MESSAGE");
		this._sValidationDialogFieldMessage = this._oRb.getText("VALUEHELPVALDLG_FIELDMESSAGE");

		return oRangeFieldsGrid;
	};

	ValueHelpDialog.prototype.suggest = function(fSuggestProviderCallback) {
		this._fSuggestCallback = fSuggestProviderCallback;

		if (this._oFilterPanel) {
			if (this._oFilterPanel._oIncludeFilterPanel) {
				this._oFilterPanel._oIncludeFilterPanel._fSuggestCallback = this._fSuggestCallback;
			}
			if (this._oFilterPanel._oExcludeFilterPanel) {
				this._oFilterPanel._oExcludeFilterPanel._fSuggestCallback = this._fSuggestCallback;
			}
		}
	};

	/**
	 * returns the KeyField definition with the key sKey
	 *
	 * @param {string} sKey Key of the field
	 *
	 * @returns {object} Key field definition
	 *
	 * @private
	 */
	ValueHelpDialog.prototype._getKeyFieldByKey = function(sKey) {
		var oCurrentKeyField;
		if (this._aRangeKeyFields) {
			// search the current KeyField
			this._aRangeKeyFields.some(function(keyField) {
				if (typeof keyField !== "string") {
					if (keyField.key === sKey) {
						oCurrentKeyField = keyField;
						return true;
					}
				}
				return false;
			});
		}
		return oCurrentKeyField;
	};

	/**
	 * Check if the entered/modified ranges are correct, marks invalid fields yellow (Warning state) and opens a popup message dialog to give the user
	 * the feedback that some values are wrong or missing.
	 *
	 * @private
	 * @param {function} fnCallback will be called when all ranges are valid or the user ignores the wrong/missing fields by pressing Ok on a message
	 *        dialog
	 * @param {function} fnCancelCallback will be called when ranges are invalid and the user press Cancel on a message dialog
	 */
	ValueHelpDialog.prototype._validateRanges = function(fnCallback, fnCancelCallback) {
		if (this._oRanges) {
			if (!this._oRanges.getParent()) {
				fnCallback();
				return;
			}

			// show warnings on invalid fields.
			var bIsIncludeRangesValid = this._oFilterPanel.validateConditions();

			if (!bIsIncludeRangesValid) {
				// open a simple confirm box
				MessageBox.show(this._sValidationDialogMessage, {
					icon: MessageBox.Icon.WARNING,
					title: this._sValidationDialogTitle,
					actions: [
						MessageBox.Action.OK, MessageBox.Action.CANCEL
					],
					styleClass: this.$().closest(".sapUiSizeCompact").length ? "sapUiSizeCompact" : "",
					onClose: function(sResult) {
						if (sResult === MessageBox.Action.OK && fnCallback) {
							fnCallback();
						}
						if (sResult === MessageBox.Action.CANCEL && fnCancelCallback) {
							fnCancelCallback();
						}
					}
				});
				return;
			}

		}

		fnCallback();
	};

	// ################################################################################
	// Start Selected Items handling
	// ################################################################################

	/**
	 * Setter for the singleRowCallback function.
	 *
	 * @param {function} fSingleRowCallback Callback function
	 * @private
	 * @deprecated
	 * @since 1.30
	 */
	ValueHelpDialog.prototype.setUpdateSingleRowCallback = function(fSingleRowCallback) {
		this.fSingleRowCallback = fSingleRowCallback;

		this._updateNavigationControl();
	};

	// ################################################################################
	// Start main Table handling
	// ################################################################################

	ValueHelpDialog.prototype._createDefaultTable = function() {
		if (!this._isPhone()) {
			if (!tableLibrary || !uiTable || !UiTableColumn) {
				sap.ui.getCore().loadLibrary('sap.ui.table');
				tableLibrary = sap.ui.requireSync("sap/ui/table/library");
				uiTable = sap.ui.requireSync("sap/ui/table/Table");
				UiTableColumn = sap.ui.requireSync("sap/ui/table/Column");
				SelectionMode = tableLibrary.SelectionMode;
				SelectionBehavior = tableLibrary.SelectionBehavior;
				VisibleRowCountMode = tableLibrary.VisibleRowCountMode;
			}
			this.setTable(new uiTable(this.getId() + "-table"), true);
		} else {
			if (!mTable) {
				mTable = sap.ui.requireSync("sap/m/Table");
				mTableColumn = sap.ui.requireSync("sap/m/Column");
			}
			this.setTable(new mTable(this.getId() + "-table"), true);
			this.TableStateSearchData();
		}
	};

	function _createDefaultTableAsync() {

		if (!this._oTablePromise) {
			if (!this._isPhone()) {
				// use UiTable
				if (!tableLibrary || !uiTable || !UiTableColumn) {
					this._oTablePromise = sap.ui.getCore().loadLibrary('sap.ui.table', {async: true}).then(function() {
						return new Promise(function(fResolve) {
							sap.ui.require([
							                "sap/ui/table/library",
							                "sap/ui/table/Table",
							                "sap/ui/table/Column"
							                ], function(fnLibrary, fnTable, fnColumn) {
								if (!this._oTable) {
									// if Table was created meanwhile do not create it again
									tableLibrary = fnLibrary;
									uiTable = fnTable;
									UiTableColumn = fnColumn;
									SelectionMode = tableLibrary.SelectionMode;
									SelectionBehavior = tableLibrary.SelectionBehavior;
									VisibleRowCountMode = tableLibrary.VisibleRowCountMode;
									var oTable = new uiTable(this.getId() + "-table");
									this.setTable(oTable, true);
								}
								fResolve(this._oTable);
							}.bind(this));
						}.bind(this));
					}.bind(this));
					return this._oTablePromise;
				} else {
					this._oTablePromise =  new Promise(function(fResolve) {
						var oTable = new uiTable(this.getId() + "-table");
						this.setTable(oTable, true);
						fResolve(oTable);
					}.bind(this));
				}
			} else {
				// use mTable
				if (!mTable) {
					this._oTablePromise = new Promise(function(fResolve) {
						sap.ui.require([
						                "sap/m/Table",
						                "sap/m/Column"
						                ], function(fnTable, fnColumn) {
							if (!this._oTable) {
								// if Table was created meanwhile do not create it again
								mTable = fnTable;
								mTableColumn = fnColumn;
								var oTable = new mTable(this.getId() + "-table");
								this.setTable(oTable, true);
								this.TableStateSearchData();
							}
							fResolve(this._oTable);
						}.bind(this));
					}.bind(this));
					return this._oTablePromise;
				} else {
					this._oTablePromise =  new Promise(function(fResolve) {
						var oTable = new mTable(this.getId() + "-table");
						this.setTable(oTable, true);
						this.TableStateSearchData();
						fResolve(oTable);
					}.bind(this));
				}
			}
		}

		return this._oTablePromise;

	}

	/**
	 * initialize the table instance
	 *
	 * @private
	 */
	ValueHelpDialog.prototype._initializeTable = function() {

		if (this._oTable && this._oTable.isA("sap.ui.table.Table")) {

			this._oTable.setTitle(Device.system.desktop ? this._sTableTitleNoCount : null);

			if (this._bTableCreatedInternal) {
				this._oTable.setSelectionBehavior(SelectionBehavior.Row);
			}
			this._oTable.setSelectionMode(this.getSupportMultiselect() ? SelectionMode.MultiToggle : SelectionMode.Single);
			this._updateNoDataText(this._oRb.getText("VALUEHELPDLG_TABLE_PRESSSEARCH"));
			// initial we use Fixed mode to give the table the chance to render and calculate the correct height
			this._oTable.setVisibleRowCountMode(VisibleRowCountMode.Fixed);
			this._oTable.setMinAutoRowCount(Device.system.desktop ? 5 : 4);

			this._oTable.attachRowSelectionChange(function(oControlEvent) {
				if (this._bIgnoreSelectionChange || !oControlEvent.getParameter("userInteraction")) {
					return;
				}

				var eventArgs = {
					tableSelectionParams: oControlEvent.mParameters,
					updateTokens: [], // [{sKey, oRow, bSelect}, {}],
					useDefault: false,
					table: this._oTable
				};

				if (this._hasListeners("selectionChange")) {
					this._bIgnoreSelectionChange = true;
					this.fireSelectionChange(eventArgs);
					this._bIgnoreSelectionChange = false;
					eventArgs.updateTokens.forEach(function(currentValue) {
						this._addRemoveTokenByKey(currentValue.sKey, currentValue.oRow, currentValue.bSelected);
					}.bind(this));

				} else {
					eventArgs.useDefault = true;
				}

				if (eventArgs.useDefault) {
					// collect all the new selected or removed items
					var oTable = oControlEvent.getSource();
					var oBinding = oTable.getBinding("rows");
					var aSelectedIndices = oTable.getSelectedIndices();
					var aChangedIndices = oControlEvent.getParameter("rowIndices");
					var bSelectAll = oControlEvent.getParameter("selectAll");
					var bIsLengthFinal = oBinding.isLengthFinal ? oBinding.isLengthFinal() : true;
					var i, n = aSelectedIndices.length;
					var index;

					var iMissingItems = 0;
					if (bIsLengthFinal) {
						// in case of a model with a CountMode check if all items exist and can be selected.
						if (oBinding.aKeys) {
							for (i = 0; i < n; i++) {
								index = aSelectedIndices[i];
								if (!oBinding.aKeys[index]) {
									iMissingItems++;
								}
							}
						}
					} else if (bSelectAll) {
						// in case the length is not known and the user SelectAll items we have to load missing items
						iMissingItems = 99999999;
					}


					// if not, we show a dialog and give the user the option to load missing items
					if (iMissingItems !== 0) {

						var loadMissingContexts = function() {
							oBinding.attachEventOnce("dataReceived", function() {
								if (bSelectAll && !bIsLengthFinal) {
									oTable.selectAll();
									aChangedIndices = oTable.getSelectedIndices();
								}
								// now all contexts should exist and we can select all items.
								this._handleSelectionUpdateTokens(oTable, aChangedIndices);
							}.bind(this));

							// trigger the load of all Contexts
							if (bSelectAll) {
								if (bIsLengthFinal) {
									oBinding.getContexts(0, n);
								} else {
									oBinding.getContexts(0, iMissingItems);
								}
							} else {
								//select range (Shift select) with missing items
								oBinding.getContexts(aChangedIndices[0], aChangedIndices[aChangedIndices.length - 1]);
							}

						}.bind(this);

						if (iMissingItems <= 400) {
							loadMissingContexts();
							return;
						} else {
							MessageBox.show(this._oRb.getText("VALUEHELPDLG_SELECTIONFAILEDLOAD"), {
								icon: MessageBox.Icon.WARNING,
								title:  this._oRb.getText("VALUEHELPDLG_SELECTIONFAILEDLOADTITLE"),
								actions: [
									MessageBox.Action.OK,
									MessageBox.Action.CANCEL
								],
								initialFocus: MessageBox.Action.CANCEL,
								styleClass: this.$().closest(".sapUiSizeCompact").length ? "sapUiSizeCompact" : "",
								onClose: function(oAction) {
									if (oAction === MessageBox.Action.OK) {
										loadMissingContexts();
									} else {
										this.update();
									}
								}.bind(this)
							});

							return;
						}
					}

					this._handleSelectionUpdateTokens(oTable, aChangedIndices);
				}

				this._updateTitles();

				if (!this.getSupportMultiselect()) {
					// in case of single select we fireOk and close the dialog
					this._bIgnoreSelectionChange = true; // set to true, to avoid a double(second) click and deselect the item.
					this._onCloseAndTakeOverValues();
				}
			}.bind(this));

			this._oTable.addStyleClass("compVHMainTable");

			if (!this._oTable.getParent() || !this._oTable.getParent().isA("sap.ui.comp.smarttable.SmartTable")) {
				this._oTable.bindAggregation("columns", "columns>/cols", function(sId, oContext) {
					var ctrl, oTooltip;

					// Tooltip is only possible for certain (string) fields
					// ignore it for all types other than string!
					if (oContext.getProperty("type") === "string") {
						oTooltip = {
							path: oContext.getProperty("template")
						};
					}

					if (oContext.getProperty("type") === "boolean") {
						ctrl = new CheckBox(sId + "-control", {
							enabled: false,
							selected: {
								path: oContext.getProperty("template")
							}
						});
					} else {
						ctrl = new Text(sId + "-control", {
							wrapping: false,
							text: {
								path: oContext.getProperty("template"),
								type: oContext.getProperty("oType")
							},
							tooltip: oTooltip
						});
					}

					if (this._oTable.isA("sap.ui.table.AnalyticalTable")) {
						return new AnalyticalColumn(sId, {
							label: "{columns>label}",
							tooltip: "{columns>tooltip}",
							template: ctrl,
							width: "{columns>width}",
							hAlign: ctrl instanceof CheckBox ? HorizontalAlign.Center : HorizontalAlign.Begin,
							filterProperty: oContext.getProperty("filter")
						});

					} else {
						return new UiTableColumn(sId, {
							label: "{columns>label}",
							tooltip: "{columns>tooltip}",
							template: ctrl,
							width: "{columns>width}",
							hAlign: ctrl instanceof CheckBox ? HorizontalAlign.Center : HorizontalAlign.Begin,
							// sorting is removed at the moment
							sortProperty: oContext.getProperty("sort"),
							sorted: oContext.getProperty("sorted"),
							sortOrder: oContext.getProperty("sortOrder"),
							filterProperty: oContext.getProperty("filter")
						});
					}
				}.bind(this));
			}
		} else {

			this._oTable.setMode(this.getSupportMultiselect() ? ListMode.MultiSelect : ListMode.SingleSelectLeft);
			this._oTable.setGrowing(true);

			this._oTable.attachSelectionChange(function(oControlEvent) {
				if (this._bIgnoreSelectionChange) {
					return;
				}

				var eventParams = oControlEvent.mParameters;

				var eventArgs = {
					tableSelectionParams: oControlEvent.mParameters,
					updateTokens: [], // [{sKey, oRow, bSelect}, {}],
					useDefault: false,
					table: this._oTable
				};

				if (this._hasListeners("selectionChange")) {
					this._bIgnoreSelectionChange = true;
					this.fireSelectionChange(eventArgs);
					this._bIgnoreSelectionChange = false;

					eventArgs.updateTokens.forEach(function(currentValue) {
						this._addRemoveTokenByKey(currentValue.sKey, currentValue.oRow, currentValue.bSelected);
					}.bind(this));

				} else {
					eventArgs.useDefault = true;
				}

				if (eventArgs.useDefault) {
					var bSelected = eventParams.selected;
					var i, n = eventParams.listItems.length;

					for (i = 0; i < n; i++) {
						var oColListItem = eventParams.listItems[i];
						var oContext = oColListItem.getBindingContext();
						var oRow = oContext ? oContext.getObject() : null;

						if (oRow) {
							var sKey = oRow[this.getKey()];
							if (!this.getSupportMultiselect()) {
								// remove all existing token, before adding the new select token
								this._oSelectedItems.removeAll();
							}
							this._addRemoveTokenByKey(sKey, oRow, bSelected);
						}
					}
				}

				if (!this.getSupportMultiselect()) {
					// in case of single select we fireOk
					this._onCloseAndTakeOverValues();
				}
			}.bind(this));

			if (!this._oTable.getParent() || !this._oTable.getParent().isA("sap.ui.comp.smarttable.SmartTable")) {
				var iColumns = 0;
				this._oTable.bindAggregation("columns", "columns>/cols", function(sId, oContext) {
					var colLabel = oContext.getProperty("label");
					var bDemandPopin = this._oTable.getColumns().length >= 2;

					iColumns++;
					return new mTableColumn(this._oTable.getId() + "-column" + iColumns, {
						header: new Label(this._oTable.getId() + "-column" + iColumns + "-label", {
							text: colLabel
						}),
						demandPopin: bDemandPopin,
						minScreenWidth: bDemandPopin ? (this._oTable.getColumns().length + 1) * 10 + "rem" : "1px"
					});
				}.bind(this));
			}
		}
	};

	ValueHelpDialog.prototype._handleSelectionUpdateTokens = function(oTable, aIndices) {
		var i, n = aIndices.length;
		var index;
		var oContext;
		var oRow;
		var bUsePath = false;
		if (oTable.getBinding("rows").aKeys) {
			bUsePath = true;
		}

		if (!this.getSupportMultiselect()) {
			// in case of single Select Table mode remove all existing selected items
			this._oSelectedItems.removeAll();
		}

		for (i = 0; i < n; i++) {
			index = aIndices[i];
			oContext = oTable.getContextByIndex(index);
			oRow = oContext ? oContext.getObject() : null;

			if (oRow) {
				var sKey;
				if (bUsePath) {
					sKey = oContext.sPath.substring(1);
				} else {
					sKey = oRow[this.getKey()];
				}

				this._addRemoveTokenByKey(sKey, oRow, oTable.isIndexSelected(index));
			}
		}
	};

	ValueHelpDialog.prototype._addRemoveTokenByKey = function(sKey, oRow, bAdd) {
		sKey = decodeURIComponent(sKey); // key of the added or removed item must be decoded
		if (bAdd) {
			this._oSelectedItems.add(sKey, oRow);
			this._addToken2Tokenizer(sKey, this._getFormatedTokenText(sKey), this._oSelectedTokens);
		} else {
			this._oSelectedItems.remove(sKey);
			this._removeTokenFromTokenizer(sKey, this._oSelectedTokens);
		}
	};

	/**
	 * Handler for the Ok close handling. The function prepares the list of all selected items and token and fires the Ok event.
	 *
	 * @private
	 */
	ValueHelpDialog.prototype._onCloseAndTakeOverValues = function() {
		var that = this;

		var fnCallback = function() {
			var range;
			var aTokens = that._oSelectedItems.getSelectedItemsTokenArray(that.getKey(), that.getDescriptionKey(), that.getTokenDisplayBehaviour());

			if (that._oSelectedRanges) {
				var i = 0;
				// if the user has changed the ranges we return the new ranges from the selectedRanges
				for (var rangeId in that._oSelectedRanges) {
					range = that._oSelectedRanges[rangeId];
					var sTokenValue = range.tokenValue;
					if (!sTokenValue) {
						sTokenValue = that._getFormatedRangeTokenText(range.operation, range.value1, range.value2, range.exclude, range.keyField);
					}

					if (!range._oGrid || range._oGrid.select.getSelected()) {
						var oToken = new Token({
							key: "range_" + i
						}).data("range", {
							"exclude": range.exclude,
							"operation": range.operation,
							"keyField": range.keyField,
							"value1": range.value1,
							"value2": range.value2
						});
						oToken.setText(sTokenValue);
						oToken.setTooltip(typeof sTokenValue === "string" ? sTokenValue : null);
						aTokens.push(oToken);
						i++;
					}
				}
			}

			that.fireOk({
				"tokens": aTokens
			});
		};

		this._validateRanges(fnCallback);
	};

	/**
	 * Handler for the cancel button. The function fires the Cancel event.
	 *
	 * @private
	 */
	ValueHelpDialog.prototype._onCancel = function() {
		this.fireCancel();
	};

	/**
	 * Handler for the Go button. Go button is used on Phone Device and calls the search of the integrated filterbar
	 *
	 * @private
	 */
	ValueHelpDialog.prototype._onGo = function() {
		this._oFilterBar.search();
	};

	/**
	 * Handler for the Clear button. Clear button is used on Phone Device and calls the clear of the integrated filterbar.
	 *
	 * @private
	 */
	ValueHelpDialog.prototype._onClear = function() {
		this._oFilterBar.clear();
	};

	/**
	 * Update all titles (table and tokenizer).
	 *
	 * @private
	 */
	ValueHelpDialog.prototype._updateTitles = function() {
		this._updateTableTitle();
		this._updateTokenizer();
	};

	/**
	 * Update the dialog title.
	 *
	 * @private
	 */
	ValueHelpDialog.prototype._updateDlgTitle = function() {
		var sMsgKey = "";
		var sMsg;

		if (this._oTitle) {

			if (this._oTabBar && !this._oTabBar.getVisible() && !this.getFilterMode()) {
				// title handling on a normal dialog (on Dekstop and Tablet) when the tabBar is not visible
				if (this._oTabBar.getSelectedKey() === _ValueHelpViewMode.DESKTOP_LIST_VIEW) {
					sMsgKey = "VALUEHELPDLG_TITLE";
				} else if (this._oTabBar.getSelectedKey() === _ValueHelpViewMode.DESKTOP_CONDITIONS_VIEW) {
					if (this.getMaxIncludeRanges() === "1" && this.getMaxExcludeRanges() === "0") {
						sMsgKey = "VALUEHELPDLG_SINGLECONDITION_TITLE";
					} else {
						sMsgKey = "VALUEHELPDLG_RANGESTITLE";
					}
				}
			} else if (this._isPhone() && !this.getFilterMode()) {
				// on a phone we show the title which depends on the current viewmode
				switch (this._currentViewMode) {
					case _ValueHelpViewMode.PHONE_MAIN_VIEW:
						sMsgKey = "";
						break;
					case _ValueHelpViewMode.PHONE_LIST_VIEW:
						sMsgKey = "VALUEHELPDLG_ITEMSTABLE";
						break;
					case _ValueHelpViewMode.PHONE_SEARCH_VIEW:
						sMsgKey = "VALUEHELPDLG_ADVANCEDSEARCH";
						break;
					case _ValueHelpViewMode.PHONE_CONDITIONS_VIEW:
						if (this.getMaxIncludeRanges() === "1" && this.getMaxExcludeRanges() === "0") {
							sMsgKey = "VALUEHELPDLG_SINGLECONDITION_TITLE";
						} else {
							sMsgKey = "VALUEHELPDLG_RANGES";
						}
						break;
					default:
						break;
				}
			}

			if (!sMsg) {
				sMsg = this.getTitle();
			}

			if (sMsgKey) {
				sMsg = this._oRb.getText(sMsgKey, sMsg);
			}

			if (sMsg) {
				this._oTitle.setText(sMsg);
			}
		}
	};

	/**
	 * Update title of the main table.
	 *
	 * @private
	 */
	ValueHelpDialog.prototype._updateTableTitle = function() {
		if (!this._oTable) {
			return;
		}
		var iLength = 0;
		this.oRows = this._oTable.getBinding("rows");

		if (this.oRows) {
			iLength = this.oRows.getLength();
		}

		if (iLength > 0 && this.oRows.isLengthFinal && this.oRows.isLengthFinal()) {
			this._setTableTitle(this._sTableTitle1.replace("{0}", iLength));
		} else {
			this._setTableTitle(this._sTableTitleNoCount);
		}
	};

	/**
	 * Setting the title of the table will remove the focus on a table cell. Because of this we check if the Title control exist and set the Text of
	 * the title instead.
	 *
	 * @param {string} sTitle Title text for the table
	 *
	 * @private
	 */
	ValueHelpDialog.prototype._setTableTitle = function(sTitle) {
		if (Device.system.desktop && this._oTable && !(this._oTable.isA("sap.m.Table"))) {
			if (this._oTable.getTitle()) {
				this._oTable.getTitle().setText(sTitle);
			} else {
				this._oTable.setTitle(sTitle);
			}
		}
	};

	ValueHelpDialog.prototype.onAfterRendering = function() {
		Dialog.prototype.onAfterRendering.apply(this);

		if (this._oTable) {
			this._updateTitles();
		}

		if (!this._isPhone() && this.getContentHeight() === "") {
			if (this.getSupportRangesOnly() && (this.getMaxExcludeRanges() === "-1" || this.getMaxIncludeRanges() === "-1")) { //} && this._oSelectedTokens.getTokens().length <= 2) {
				// in case of a conditions only with multiple condition rows we give the dialog a height of 70%
				this.setContentHeight("70%");
			} else {
				// if the content height is not set we fetch the current clientHeight from the ScrollContainer and set it as fixed height
				var oResizeDomRef = this.getDomRef("scroll");
				var _iResizeDomHeight = oResizeDomRef.clientHeight;
				this.setContentHeight(_iResizeDomHeight + "px");
			}
			// correct the minRowCount
			if (this._oTable && this._oTable.isA("sap.ui.table.Table")) {
				this._oTable.setVisibleRowCountMode(VisibleRowCountMode.Auto);
			}
		}
	};

	// Overwriting the Dialog._getDialogOffset function. In our case we will return some other left and top margin values!
	ValueHelpDialog.prototype._getDialogOffset = function(windowWidth) {
		var iWindowWidth = windowWidth || this._$Window.width();
		var screenSizes = {
			small: 600,
			large: 1024
		};
		var remToPixelMargin = function(rem) {
			var iRemInPx = parseInt(window.getComputedStyle(document.body).fontSize);
			return (rem * iRemInPx) * 2;
		};
		var rem = 1;

		if (iWindowWidth > screenSizes.small && iWindowWidth < screenSizes.large) {
			rem = 2;
		} else if (iWindowWidth >= screenSizes.large) {
			rem = 2;
		}

		return {
			top: remToPixelMargin(rem),
			left: remToPixelMargin(rem)
		};
	};

	ValueHelpDialog.prototype.exit = function() {

		Dialog.prototype.exit.apply(this);

		var destroyHelper = function(o) {
			if (o && o.destroy) {
				o.destroy();
			}
			return null;
		};

		this._oTokenizerGrid = destroyHelper(this._oTokenizerGrid);
		this._oRanges = destroyHelper(this._oRanges);
		this._oFilterPanel = destroyHelper(this._oFilterPanel);
		if (this._bTableCreatedInternal) {
			this._oTable = destroyHelper(this._oTable);
		}
		this._oTable = null;
		this.theTable = null;

		this._oTabBar = destroyHelper(this._oTabBar);
		this._oMainListMenu = destroyHelper(this._oMainListMenu);
		this._oVBox = destroyHelper(this._oVBox);
		this._oVarManagment = destroyHelper(this._oVarManagment);

		this._aRangeKeyFields = destroyHelper(this._aRangeKeyFields);
		this._aIncludeRangeOperations = destroyHelper(this._aIncludeRangeOperations);
		this._aExcludeRangeOperations = destroyHelper(this._aExcludeRangeOperations);

		if (this._oFilterBar) {
			this._oFilterBar.detachInitialise(this._handleFilterBarInitialize);
			this._oFilterBar = destroyHelper(this._oFilterBar);
		}

		this._oRb = destroyHelper(this._oRb);
		this._sTableTitle1 = destroyHelper(this._sTableTitle1);
		this._sTableTitle2 = destroyHelper(this._sTableTitle2);
		this._sTableTitleNoCount = destroyHelper(this._sTableTitleNoCount);

		this._sValidationDialogTitle = destroyHelper(this._sValidationDialogTitle);
		this._sValidationDialogMessage = destroyHelper(this._sValidationDialogMessage);
		this._sValidationDialogFieldMessage = destroyHelper(this._sValidationDialogFieldMessage);

		this._oSelectedItems = destroyHelper(this._oSelectedItems);
		this._oSelectedRanges = destroyHelper(this._oSelectedRanges);

		this._oButtonOk = destroyHelper(this._oButtonOk);
		this._oButtonCancel = destroyHelper(this._oButtonCancel);
		if (this._oButtonGo) {
			this._oButtonGo = destroyHelper(this._oButtonGo);
		}
		if (this._oButtonClear) {
			this._oButtonClear = destroyHelper(this._oButtonClear);
		}
		if (this._oColSearchBox) {
			this._oColSearchBox = destroyHelper(this._oColSearchBox);
		}
	};

	/**
	 * Sets a RangeKeyFields array. This method allows you to specify the KeyFields for the ranges. You can set an array of objects with Key and Label
	 * properties to define the key fields.
	 *
	 * @public
	 * @since 1.24
	 * @param {object[]} aRangeKeyFields An array of range KeyFields
	 *        <code>[{key: "CompanyCode", label: "ID"}, {key:"CompanyName", label : "Name"}]</code>
	 */
	ValueHelpDialog.prototype.setRangeKeyFields = function(aRangeKeyFields) {
		this._aRangeKeyFields = aRangeKeyFields;

		// TODO when the type is a DateTime type and isDateOnly==true, the type internal might use UTC=true
		// result is that date values which we format via formatValue(oDate, "string") are shown as the wrong date.
		// The current Date format is yyyy-mm-ddT00:00:00 GMT+01
		// Workaround: changing the oFormat.oFormatOptions.UTC to false!
		if (this._aRangeKeyFields) {
			this._aRangeKeyFields.some(function(keyField) {
				if (keyField.typeInstance && keyField.typeInstance.isA("sap.ui.model.odata.type.DateTime")) {
					var oType = keyField.typeInstance;
					if (!oType.oFormat) {
						// create a oFormat of the type by formating a dummy date
						oType.formatValue(new Date(), "string");
					}
					if (oType.oFormat) {
						// if (oType.oFormatOptions.UTC == false && oType.oFormat.oFormatOptions.UTC == true) {
							oType.oFormat.oFormatOptions.UTC = false;
						// }
					}
				}
			});
		}

	};

	ValueHelpDialog.prototype.getRangeKeyFields = function() {
		return this._aRangeKeyFields;
	};

	/**
	 * Sets the array for the supported include range operations.
	 *
	 * @public
	 * @since 1.24
	 * @param {sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation[]} aOperation An array of range operations
	 * @param {string} sType the type for which the operations are defined
	 */
	ValueHelpDialog.prototype.setIncludeRangeOperations = function(aOperation, sType) {
		sType = sType || "default";
		this._aIncludeRangeOperations[sType] = aOperation;

		if (this._oFilterPanel) {
			this._oFilterPanel.setIncludeOperations(this._aIncludeRangeOperations[sType], sType);
		}
	};

	/**
	 * Sets the array for the supported exclude range operations.
	 *
	 * @public
	 * @since 1.24
	 * @param {sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation[]} aOperation An array of range operations
	 * @param {string} sType the type for which the operations are defined
	 */
	ValueHelpDialog.prototype.setExcludeRangeOperations = function(aOperation, sType) {
		sType = sType || "default";
		this._aExcludeRangeOperations[sType] = aOperation;

		if (this._oFilterPanel) {
			this._oFilterPanel.setExcludeOperations(this._aExcludeRangeOperations[sType], sType);
		}
	};

	/**
	 * Creates and returns the token text for the selected item.
	 *
	 * @private
	 * @param {string} sKey the key of the selectedItems item
	 * @returns {string} the token text for the selected items with the sKey
	 */
	ValueHelpDialog.prototype._getFormatedTokenText = function(sKey) {
		var oItem = this._oSelectedItems.getItem(sKey);
		var sTokenText = oItem[this.getDescriptionKey()];
		var sDisplayKey = oItem[this.getKey()];
		if (sTokenText === undefined) {
			if (typeof oItem === "string") {
				sTokenText = oItem;
			} else {
				sTokenText = sKey;
			}
		} else {
			sTokenText = FormatUtil.getFormattedExpressionFromDisplayBehaviour(this.getTokenDisplayBehaviour() ? this.getTokenDisplayBehaviour() : DisplayBehaviour.descriptionAndId, sDisplayKey, sTokenText);
		}

		return sTokenText;
	};

	/**
	 * Creates and returns the token text for a range.
	 *
	 * @private
	 * @param {string} sOperation the operation type sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation
	 * @param {any} oValue1 text of the first range field
	 * @param {any} oValue2 text of the second range field
	 * @param {boolean} bExclude indicates if the range is a Exclude range
	 * @param {string} sKeyField id
	 * @returns {string} the range token text
	 */
	ValueHelpDialog.prototype._getFormatedRangeTokenText = function(sOperation, oValue1, oValue2, bExclude, sKeyField) {
		var oCurrentKeyField = this._getKeyFieldByKey(sKeyField);
		var sValue1 = oValue1;
		var sValue2 = oValue2;
		if (oCurrentKeyField) {
			if (!oCurrentKeyField.typeInstance && P13nConditionPanel._createKeyFieldTypeInstance) {
				P13nConditionPanel._createKeyFieldTypeInstance(oCurrentKeyField);
			}

			if (oCurrentKeyField.typeInstance) {
				sValue1 = oCurrentKeyField.typeInstance.formatValue(oValue1, "string");
				sValue2 = oCurrentKeyField.typeInstance.formatValue(oValue2, "string");
			}
		}

		var sTokenText = FormatUtil.getFormattedRangeText(sOperation, sValue1, sValue2, bExclude);

		if (this._aRangeKeyFields && this._aRangeKeyFields.length > 1 && oCurrentKeyField && oCurrentKeyField.label && sTokenText !== "") {
			sTokenText = oCurrentKeyField.label + ": " + sTokenText;
		}

		return sTokenText;
	};

	ValueHelpDialog.prototype._isPhone = function() {
		return Device.system.phone;
	};

	ValueHelpDialog.prototype._hasListeners = function(sEventName) {
		if (this._bTableCreatedInternal) {
			return false;
		}

		return this.hasListeners(sEventName);
	};

	ValueHelpDialog.prototype._rotateSelectionButtonIcon = function(bFlag) {
		if (!Device.system.phone) {
			var oCtrl = sap.ui.getCore().byId(this.oSelectionButton.$("img")[0].id);

			if (bFlag) {
				oCtrl.addStyleClass("sapUiVHImageExpand");
			} else {
				oCtrl.removeStyleClass("sapUiVHImageExpand");
			}
		}
	};

	function _getTokenId(sKey, sKeyField) {
		if (!sKeyField) {
			sKeyField = this.getKey();
		}

		sKey = sKey.replace(/[^a-zA-Z0-9]/g, "");
		sKeyField = sKeyField.replace(/[^a-zA-Z0-9]/g, "");

		var sId = sKeyField ? sKeyField + "-" + sKey : sKey;

		if (!this._oTokenIdCount[sId]) {
			this._oTokenIdCount[sId] = 0;
		}

		this._oTokenIdCount[sId]++;

		return this.getId() + "-token-" + sId + "_" + this._oTokenIdCount[sId];
	}

	return ValueHelpDialog;

});
