/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2019 SAP SE. All rights reserved
 */

// Provides control sap.zen.ValueHelpDialog.
define("zen.rt.components.filterpanel/resources/js/ValueHelpDialog",  [], function() {
	"use strict";

	sap.ui.getCore().loadLibrary("sap.m");
	sap.ui.getCore().loadLibrary("sap.ui.comp");
	//$.sap.require("sap.ui.comp.valuehelpdialog.ValueHelpDialog");
	sap.ui.getCore().loadLibrary("sap.ui.table");
	$.sap.require("sap.m.MultiInput");
	$.sap.require("sap.m.DialogRenderer");
	$.sap.require("sap.ui.comp.valuehelpdialog.ItemsCollection");
    $.sap.require("sap.ui.core.format.DateFormat");
	
	/**
	 * Constructor for a new valuehelpdialog/ValueHelpDialog.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 * @class The ValueHelpDialog control can be used to implement a value help for an input field.
	 * @extends sap.m.Dialog
	 * @constructor
	 * @public
	 * @alias sap.zen.ValueHelpDialog
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ValueHelpDialog = sap.m.Dialog.extend("sap.zen.ValueHelpDialog", /** @lends sap.zen.ValueHelpDialog.prototype */ { metadata : {
	
		//library : "sap.ui.comp",
		properties : {
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
				}
		},
		aggregations : {
	
			/**
			 * Allows you to add a {@link sap.ui.comp.filterbar.FilterBar FilterBar} or
			 * {@link sap.ui.comp.smartfilterbar.SmartFilterBar SmartFilterBar} control to the value help dialog.
			 */
				filterBar: {
					type: "sap.ui.core.Control", //ZEN
					multiple: false
				}
		},
		events : {
	
			/**
			 * This event is fired when the OK button is pressed.
			 *
			 * @since 1.24
			 */
			ok : {
				parameters: {					
					/**
					*  The array of tokens created or modified on the ValueHelpDialog.
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
			cancel : {},
			
			/**
			 * This event is fired when the user selects an item in the items table.
			 *
			 * <b>Note:</b> The event will only be raised when the dialog gets a table
			 * instance from outside via <code>setTable</code>.
			 *
			 * @since 1.32
			 */
			selectionChange : {  
				parameters: {					
					/**
					*  The RowSelectionChange event parameter from the hosted table that contains the selected items.
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
					*  The array of token keys that has been removed.
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
					*  The array of existing token keys for which the selection in the table has to be updated.
				 	*/
						tokenKeys: {
							type: "string[]"
						},
					
					/**
					*  Can be set to true to execute the default behavior of ValueHelpDialog. 
				 	*/
						useDefault: {
							type: "boolean",
							defaultValue: false
						}
				}				
				
			}
		}
	},
	renderer: sap.m.DialogRenderer.render
	});
	
	/**
	 * Update the Control
	 * 
	 * Updates the selection of rows in the table. This function must be called after a first binding or binding update of the table. It will set a
	 * table row as selected if a token for this row exists.
	 * 
	 * @public
	 * @since 1.24
	*/
	ValueHelpDialog.prototype.update = function() {
		this._bIgnoreSelectionChange = true;
		
		var ltSelectedItems = this._oSelectedItems.getItems();
		var loEventArgs = { 
			tokenKeys: ltSelectedItems,
			useDefault: false
		};

		if (this._hasListeners("updateSelection")) {
			this.fireUpdateSelection(loEventArgs);			
		} else {
			loEventArgs.useDefault = true;
		}
		
		if (loEventArgs.useDefault) {	
			if (sap.ui.table.Table && this._oTable instanceof sap.ui.table.Table) {	
				this.oRows = this._oTable.getBinding("rows");
				this._oTable.clearSelection();
			
				if (this.oRows.aKeys) {
					var ltKeys = this.getKeys();
					var lRowKeyPartPrefix = ltKeys && ltKeys.length > 1 ? this.getKey() + "=" : "";

					// in case of an oDataModel binding the aKeys exist and the row will be found via the keys.
					for (var i = 0; i < ltSelectedItems.length; i++) {
						var lKey = ltSelectedItems[j];
						
						//TODO instead of using encodeURI of the Token key we could try to use the oDataModel.createKey function to build the row key from the Token

						var lRowKeyPart = lRowKeyPartPrefix + "'" + lKey + "'";
			
						for (var j = 0; j < this.oRows.aKeys.length; j++) {
							var lRowKey = this.oRows.aKeys[j];
							
							var lIsRow = lRowKey === lKey;
							if (lIsRow || // either the rowKey is equal the token key or we search if the main key with the value is part of the rowKey 
								lRowKey.indexOf(lRowKeyPart) >= 0) {
			
								if (!lIsRow) { // in this case we will update the old key and use the longKey from the rows
									this._oSelectedItems.remove(lKey); // remove the old  key
									// and update the Token key
									var loToken = this._getTokenByKey(lKey, this._oSelectedTokens);
									if (loToken) {
										loToken.setKey(lRowKey);
									}
								}
								
								// update the row data in the selectedItems List
								var loContext = this._oTable.getContextByIndex(j);
								if (loContext) {
									loRow = loContext.getObject();
									this._oSelectedItems.add(lRowKey, loRow);
								}
			
								// make the row selected
								this._oTable.addSelectionInterval(j, j);
								//break;ZEN
							}
						}
					}
					
				} else if (this.oRows.aIndices) {
						this._oTable.clearSelection();
						
						for (var i = 0; i < ltSelectedItems.length; i++) {
							var lKey = ltSelectedItems[i];
							
							for (var j = 0; j < this.oRows.aIndices.length; j++) {
								loContext = this._oTable.getContextByIndex(j);//ZEN
								if (!loContext) {
									continue;
								}
								
								if (loContext) {
									var loRow = loContext.getObject();
									if (loRow[this.getKey()] === lKey) {
										this._oSelectedItems.add(loRow[this.getKey()], loRow);
										this._oTable.addSelectionInterval(j, j);
										//break;ZEN
									}
								}
							}
						}
					}
			
			} else {
				// Handle selection update of the m.table
				var loTable = this._oTable;
				for (var i = 0; i < ltSelectedItems.length; i++) {
					var lKey = ltSelectedItems[i];
					
					for (var j = 0; j < loTable.getItems().length; j++) {
						var loColListItem = loTable.getItems()[j];
						if (!loColListItem) {
							continue;
						}
						
						var loRowData = loColListItem.getBindingContext().getObject();
						if (loRowData[this.getKey()] === lKey) {
							oTable.setSelectedItem(oColListItem, true);						
							//break;ZEN
						}
					}				
				}
	
			}
		}
		
		this._bIgnoreSelectionChange = false;
		
		this._updateTitles();
	};
	
	/**
	 * Initialize (Create, Update)
	 */
	ValueHelpDialog.prototype.init = function() {
		sap.m.Dialog.prototype.init.apply(this);

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
	
		this._currentViewMode = null; // sap.zen._ValueHelpViewMode
		this._oSelectedItems = new sap.ui.comp.valuehelpdialog.ItemsCollection();
		this._oSelectedRanges = {};
	
		this._createHeaderBar();
		
		this._createCollectiveSearch();

		this._createTokenizer();
		this._updateTokenizer();
	
		this._oVBox = new sap.m.VBox({
			fitContainer: true
		});
		this.addContent(this._oVBox);
		
		this._oMainLayout = new sap.m.VBox({
			fitContainer: true,
			items: [
				this._oFilterBar
			],
			layoutData: new sap.m.FlexItemData({
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
		// scrolling itself is enabled  via css overflow-y: auto
		this.setVerticalScrolling(false);
		this.setHorizontalScrolling(false);
		
		// to support touch scrolling we have to set the event to marked, otherwise when using a sap.m.App touch events are not handled.
		if (!sap.ui.Device.system.desktop) {
			this._oVBox.attachBrowserEvent("touchmove", function(oEvent) {
				oEvent.setMarked();
		    });
		}
		
		if (!this._isPhone()) {
			this._updateView(sap.zen._ValueHelpViewMode.DESKTOP_LIST_VIEW);
		}
	};
	
	/**
	 * Update the visible view of the dialog. The method is changing the visibility of the used controls to only show the required parts of the view.
	 * 
	 * @private 
	 * @param {sap.zen.valuehelpdialog._ValueHelpViewMode} newViewMode View mode which should be shown
	 */	
	ValueHelpDialog.prototype._updateView = function(newViewMode) {
		if (this._currentViewMode === newViewMode) {  
			return;
		}
		
		switch (newViewMode) {
			case sap.zen._ValueHelpViewMode.DESKTOP_LIST_VIEW:
				this._validateRanges(function() {
					// when valid show the Items Table
					this._oTokenizerGrid.setVisible(this.getSupportMultiselect());
					this._oMainLayout.removeAllItems();
					if (this._oTabBar && this._oTabBar.getSelectedKey() !== sap.zen._ValueHelpViewMode.DESKTOP_LIST_VIEW) {
						this._oTabBar.setSelectedKey(sap.zen._ValueHelpViewMode.DESKTOP_LIST_VIEW); 
					}
					this._oMainLayout.addItem(this._oFilterBar);
					this._oMainLayout.addItem(this._oTable);
					this._updateDlgTitle();
				}.bind(this), function() {
					// if not valid go back to the Ranges Tab
					this._oTabBar.setSelectedKey(sap.zen._ValueHelpViewMode.DESKTOP_CONDITIONS_VIEW); 
                    this._updateView(sap.zen._ValueHelpViewMode.DESKTOP_CONDITIONS_VIEW);
				}.bind(this));
				break;

			case sap.zen._ValueHelpViewMode.DESKTOP_CONDITIONS_VIEW:
				if (this.getSupportRanges()) {
					this.bCollectiveSearchActive = this.oSelectionTitle.getVisible() && this.oSelectionButton.getVisible();
					this._oMainLayout.removeAllItems();
					if (this._oTabBar && this._oTabBar.getSelectedKey() !== sap.zen._ValueHelpViewMode.DESKTOP_CONDITIONS_VIEW) {
						this._oTabBar.setSelectedKey(sap.zen._ValueHelpViewMode.DESKTOP_CONDITIONS_VIEW); 
					}
					this._oMainLayout.addItem(this._getRanges());
					//ZEN this._oButtonOk.setVisible(this.getSupportRangesOnly() || this.getSupportMultiselect());

					this._oTokenizerGrid.setVisible(this.getSupportMultiselect());
					if (!(this.getMaxIncludeRanges() === "-1" && this.getMaxExcludeRanges() !== "0" && !this.getFilterMode())) {
						this._oTokenizerGrid.setVisible(false);
					}
				}
				break;
			
			case sap.zen._ValueHelpViewMode.PHONE_MAIN_VIEW:
				this.setVerticalScrolling(false);

				this._oColSearchBox.setVisible(false);
				this._oMainListMenu.setVisible(true);
				this._updateNavigationControl();
				this._oAdvancedSearchLink.setVisible(false);
				if (this._oFilterBar 
					&& this._oFilterBar.setFilterBarExpanded) { //ZEN
						this._oFilterBar.setVisible(false); this._oFilterBar.setFilterBarExpanded(false);
				}
				this._oTable.setVisible(false);
			  
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
					this._bNoneMainView = true;  // used to not show the backbutton on the list and condition view
					if (this._oSelectItemLI.getVisible()) {
						// make the Selection Table visible by default
						this._updateView(sap.zen._ValueHelpViewMode.PHONE_LIST_VIEW);
					}
					if (this._oDefineConditionsLI.getVisible()) {
						// make the condition screen visible by default
						this._updateView(sap.zen._ValueHelpViewMode.PHONE_CONDITIONS_VIEW);
					}
					return;
				}
				
				break;
				
			case sap.zen._ValueHelpViewMode.PHONE_LIST_VIEW:
				this.setVerticalScrolling(true);

				this._oColSearchBox.setVisible(this.bCollectiveSearchActive);
				this._oMainListMenu.setVisible(false);
				if (this._oFilterBar && this._oFilterBar.getFilterGroupItems) { //ZEN
					var bShowAdvancedSearch = this._oFilterBar && this._oFilterBar.getFilterGroupItems() && this._oFilterBar.getFilterGroupItems().length > 0;
					this._oAdvancedSearchLink.setVisible(bShowAdvancedSearch);
					this._oFilterBar.setShowGoButton(!(this._oFilterBar && this._oFilterBar.getBasicSearch()));
					this._oFilterBar.setVisible(true); 
					this._oFilterBar.setFilterBarExpanded(false);
				}
				this._oTable.setVisible(true);
				this._oTokenizerGrid.setVisible(false);
				if (this._oRanges) {
					this._oRanges.setVisible(false);
				}
				
				this._oButtonGo.setVisible(false);
				this._oButtonClear.setVisible(false);
				//ZEN this._oButtonOk.setVisible(this.getSupportMultiselect());
				this._oButtonCancel.setVisible(true);
				this._oBackButton.setVisible(!this._bNoneMainView);
				break;
				
			case sap.zen._ValueHelpViewMode.PHONE_SEARCH_VIEW:
				this.setVerticalScrolling(true);

				this._oColSearchBox.setVisible(false);
				this._oMainListMenu.setVisible(false);
				if (this._oFilterBar) {
					this._oFilterBar.setVisible(true); 
					this._oFilterBar.setFilterBarExpanded(true);
				}
				this._oAdvancedSearchLink.setVisible(false); 
				this._oTable.setVisible(false);
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
				
			case sap.zen._ValueHelpViewMode.PHONE_CONDITIONS_VIEW:
				this.setVerticalScrolling(true);

				this._oColSearchBox.setVisible(false);
				this._oMainListMenu.setVisible(false);
				if (this._oFilterBar) {
					this._oFilterBar.setVisible(false);
				}
				this._oAdvancedSearchLink.setVisible(false); 
				this._oTable.setVisible(false);
				this._oTokenizerGrid.setVisible(false);
				if (!this._oRanges) {
					this._oMainLayout.addItem(this._getRanges());
				}
				this._oRanges.setVisible(true);
				
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
			if (this._oFilterBar 
				&& this._oFilterBar._handleVisibilityOfToolbar) { //ZEN
					this._oFilterBar._handleVisibilityOfToolbar();
			}

			this._oVBox.rerender();
		}

		this._currentViewMode = newViewMode;
		this._updateDlgTitle();
		/*
		 * In _updateView() all items of MainLayout are removed and re-added
		 * when the Table is added it calls the _bindAggregation() method of Table
		 * this method resets the binding of the table which in return resets all selections
		 * the update() method ensures that the selections are set according to the tokens
		 */
		if (newViewMode === sap.zen._ValueHelpViewMode.DESKTOP_LIST_VIEW) {
			this.update();
		}
	};
	
	/**
	 * Update Property SupportMultiselect
	 */
	ValueHelpDialog.prototype._updatePropertySupportMultiselect = function(enabled) {
		if (!this._oTable) {
			return undefined;
		}
		
		if (!this._isPhone()) {
			if (this._oTable.setSelectionMode) {
				this._oTable.setSelectionMode(enabled ? sap.ui.table.SelectionMode.MultiToggle : sap.ui.table.SelectionMode.Single);
			}
		} else if (this._oTable.setMode) {
			this._oTable.setMode(enabled ? sap.m.ListMode.MultiSelect : sap.m.ListMode.SingleSelectLeft);
		}
		
		return this;
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
			if (this._oTable.setNoDataText) {
				this._oTable.setNoDataText(sNoDataText);
			} else if (this._oTable.setNoData) {
				this._oTable.setNoData(sNoDataText);
			}
		}
	};
	
	/**
	 * Update the TabBar or on Phone the Listitems.
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._updateNavigationControl = function() {
		var lListTabVisible = !this.getSupportRangesOnly();
		var lRangesTabVisible = this.getSupportRangesOnly() || this.getSupportRanges();

		if (this._oTabBar) {
			var ltTabItems = this._oTabBar.getItems();
			ltTabItems[0].setVisible(lListTabVisible );
			ltTabItems[1].setVisible(lRangesTabVisible);

			this._oTabBar.setVisible(lListTabVisible && lRangesTabVisible);
			this._updateDlgTitle();
		}
		
		if (this._oMainListMenu) {
			this._oSelectItemLI.setVisible(lListTabVisible);
			this._oDefineConditionsLI.setVisible(lRangesTabVisible);
		}
		
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
		var lMsgKey = "";
		if (this._oTitle) {
			if (this._oTabBar && !this._oTabBar.getVisible() && !this.getFilterMode()) {
				// title handling on a normal dialog (on Dekstop and Tablet) when the tabBar is not visible
				if (this._oTabBar.getSelectedKey() === sap.zen._ValueHelpViewMode.DESKTOP_LIST_VIEW) {
					lMsgKey = "VALUEHELPDLG_TITLE";
				} else if (this._oTabBar.getSelectedKey() === sap.zen._ValueHelpViewMode.DESKTOP_CONDITIONS_VIEW) {
					if (this.getMaxIncludeRanges() === "1" && this.getMaxExcludeRanges() === "0") {
						lMsgKey = "VALUEHELPDLG_SINGLECONDITION_TITLE";
					} else {
						lMsgKey = "VALUEHELPDLG_RANGESTITLE";
					}
				}
				
			} else if (this._isPhone() && !this.getFilterMode()) {
					// on a phone we show the title which depends on the current viewmode
				switch (this._currentViewMode) {
				  case sap.zen._ValueHelpViewMode.PHONE_MAIN_VIEW:
					  lMsgKey = "";
					  break;
					  
				  case sap.zen._ValueHelpViewMode.PHONE_LIST_VIEW:
					  lMsgKey = "VALUEHELPDLG_ITEMSTABLE";
					  break;
					  
				  case sap.zen._ValueHelpViewMode.PHONE_SEARCH_VIEW:
					  lMsgKey = "VALUEHELPDLG_ADVANCEDSEARCH";
					  break;
					  
				  case sap.zen._ValueHelpViewMode.PHONE_CONDITIONS_VIEW:
					  if (this.getMaxIncludeRanges() === "1" && this.getMaxExcludeRanges() === "0") {
						  lMsgKey = "VALUEHELPDLG_SINGLECONDITION_TITLE";
					  } else {
						  lMsgKey = "VALUEHELPDLG_RANGES";
					  }
					  break;
					  
				  default:
					  break;
				}
			}
			
			var lMsg = null;
			if (!lMsg) {
				lMsg = this.getTitle();
			}

			if (lMsgKey)  {
				lMsg = this._oRb.getText(lMsgKey, lMsg);
			}

			if (lMsg)  {
				this._oTitle.setText(lMsg);
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
		
		this.oRows = this._oTable.getBinding("rows");
		
		var lSupportCount = false; // at the moment we do not support the Items Count in the table header
		if (lSupportCount && this.getModel() && this.getModel().isCountSupported) {
			lSupportCount = this.getModel().isCountSupported();
		}

		var lLength = 0;
		if (lSupportCount) {
			if (this.oRows) {
				lLength = this.oRows.getLength();
			}
			this._setTableTitle(this._sTableTitle1.replace("{0}", lLength));
		} else {
			this._setTableTitle(this._sTableTitleNoCount);
		}
	};
	
	/**
	 * _updateTokenizer
	 * Updating the tokenizer title and RemoveAll buttons. 
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._updateTokenizer = function() {
		var lExpanded = false;
		if (this._oTokenizerPanel) {
			lExpanded = this._oTokenizerPanel.getExpanded();
		}
		
		var lSelectedTokensCount = this._oSelectedTokens.getTokens().length;
		var lExcludedTokensCount = this._oExcludedTokens.getTokens().length;

		var lSelectedItemsTitle = this._oRb.getText("VALUEHELPDLG_SELECTEDITEMS");
		var lNoneSelectedItemsTitle = this._oRb.getText("VALUEHELPDLG_NONESELECTEDITEMS");

		var lSelectedItemsText = lSelectedItemsTitle.replace("{0}", lSelectedTokensCount.toString());
		var lExcludedItemsText = this._oRb.getText("VALUEHELPDLG_EXCLUDEDITEMS", lExcludedTokensCount.toString());
		
		var lText = lSelectedTokensCount === 0 ? lNoneSelectedItemsTitle : lSelectedItemsText;
		
		if (this._oTokenizerPanel) {
			if (!lExpanded) {
				if (this._isPhone()) { 
					lSelectedItemsText = this._oRb.getText("VALUEHELPDLG_SELECTEDITEMS_SHORT", lSelectedTokensCount.toString());
					lExcludedItemsText = this._oRb.getText("VALUEHELPDLG_EXCLUDEDITEMS_SHORT", lExcludedTokensCount.toString());
				}
				lText = "";
				if (lSelectedTokensCount !== 0) {
					lText = lSelectedItemsText;
				}
				if (lExcludedTokensCount !== 0) {
					lText += (lSelectedTokensCount !== 0 ? " / " : "") + lExcludedItemsText;
				}
				if (lText === "") {
					lText = lNoneSelectedItemsTitle;
				}
			} else if (lSelectedTokensCount === 0 && lExcludedTokensCount !== 0) {
					lText = lExcludedItemsText;
					lExcludedItemsText = "";
				}
			this._oTokenizerPanel.setHeaderText(lText);
			this._oSelectedTokenTitle.setText(lText);
		} else {
			this._oSelectedTokenTitle.setText(lText);
		}
		this._oRemoveAllSelectedItemsBtn.setEnabled(lSelectedTokensCount !== 0);
	
		this._oExcludedTokenTitle.setText(lExcludedItemsText);
			
		if (lSelectedTokensCount === 0 && lExcludedTokensCount !== 0) {
			// hide all when only exclude items exist 
			this._oIncludeTokenGrid.addStyleClass("displayNone");
			if (!this._isPhone()) {
				this._oExcludedTokenTitle.addStyleClass("displayNone");
			}
		} else {
			this._oIncludeTokenGrid.removeStyleClass("displayNone");
			this._oExcludedTokenTitle.removeStyleClass("displayNone");
		}
		
		if (lExcludedTokensCount === 0) {
			this._oExcludeTokenGrid.addStyleClass("displayNone");
		} else {
			this._oExcludeTokenGrid.removeStyleClass("displayNone");
		}
	};
	
	/**
	 * setSupportMultiselect
	 */
	ValueHelpDialog.prototype.setSupportMultiselect = function(enabled) {
		this.setProperty("supportMultiselect", enabled);

		this._updatePropertySupportMultiselect(enabled);

		this._oTokenizerGrid.setVisible(enabled);
		//ZEN this._oButtonOk.setVisible(enabled);
		
		return this;
	};
	
	/**
	 * setSupportRanges
	 */
	ValueHelpDialog.prototype.setSupportRanges = function(enabled) {
		this.setProperty("supportRanges", enabled);
		
		this._updateNavigationControl();
		
		return this;
	};
	
	/**
	 * setSupportRangesOnly
	 */
	ValueHelpDialog.prototype.setSupportRangesOnly = function(enabled) {
		this.setProperty("supportRangesOnly", enabled);

		this._updateNavigationControl(); 
		
		return this;
	};
	
	/**
	 * setTitle
	 * Sets the Title of the dialog.
	 * The value is used for the different titles which we display during runtime on the dialog header.
	 * The dialog title changes depending on the content.
	 */
	ValueHelpDialog.prototype.setTitle = function(title) {
		this.setProperty("title", title);
	
		this._updateDlgTitle();

		return this;
	};
	
	/**
	 * setFilterBar
	 */
	ValueHelpDialog.prototype.setFilterBar = function(oCtrl) {
		this.setAggregation("filterBar", oCtrl);
	
		if (this._oMainLayout && oCtrl) {
			if (this._isPhone()) {
				if (this._oFilterBar) {
					// Remove the old filter bar.
					this._oVBox.removeItem(this._oFilterBar);
					// this._oFilterBar.detachInitialise(this._handleFilterBarInitialize); ZEN
				}
				
			} else if (this._oFilterBar) {
					// Remove the old filter bar.
					this._oMainLayout.removeItem(this._oFilterBar);
					// this._oFilterBar.detachInitialise(this._handleFilterBarInitialize); ZEN
			}
			
			this._oFilterBar = oCtrl;

			// this._oFilterBar.attachInitialise(this._handleFilterBarInitialize, this); ZEN

			if (this._oFilterBar) {
				this._oFilterBar.addStyleClass("compVHSearch");
				
				if (this._isPhone()) {
					// Let the Search Field on a phone show the search icon. 
					if (this._oFilterBar.getBasicSearch) { //ZEN
						var loSearchField = sap.ui.getCore().byId(this._oFilterBar.getBasicSearch());
						if (loSearchField instanceof sap.m.SearchField) {
							loSearchField.setShowSearchButton(true);
							loSearchField.attachSearch(function(oEvent) {
								if (oEvent.mParameters.refreshButtonPressed !== undefined) { // Workaround to ignore the remove icon click on the
									// Search control.
									this.getFilterBar().search();
								}
							}.bind(this));
						}
						this._oFilterBar.setShowGoOnFB(false);	
					} //ZEN				

					
					// Add the Collective Search as first item into the VBox. 
					this._oColSearchBox.setLayoutData(new sap.m.FlexItemData({
						shrinkFactor: 0
					}));					
					this._oVBox.insertItem(this._oColSearchBox, 0);

					if (this._oFilterBar.setLayoutData) { //ZEN
						// The Filterbar with the Basic Search is the second item. 
						this._oFilterBar.setLayoutData(new sap.m.FlexItemData({
							shrinkFactor: 0
						}));		
					}	//ZEN		
					this._oVBox.insertItem( this._oFilterBar, 1);
					
					// On the phone listen on the Search event to show the LIST_VIEW.
					this._oFilterBar.attachSearch(function() {
						this._updateView(sap.zen._ValueHelpViewMode.PHONE_LIST_VIEW);
					}.bind(this));
					
					if (this._currentViewMode === sap.zen._ValueHelpViewMode.PHONE_LIST_VIEW 
						&& this._oFilterBar.setFilterBarExpanded) { //ZEN
							// update the Filterbar states
							this._oFilterBar.setVisible(true); 
							this._oFilterBar.setFilterBarExpanded(false);
							this._handleFilterBarInitialize();
					}
				} else {
					// for Tablet and Desktop add the Filterbar into the mainGrid and place the CollectiveSearch inside the Filterbar.
					if (this._oFilterBar._setCollectiveSearch) {//ZEN
						this._oFilterBar._setCollectiveSearch(this._oColSearchBox);
					} //ZEN
					this._oMainLayout.insertItem(this._oFilterBar, 0);
				}
			}
	
			// set the initial Focus on the Search/Go button
			if (this._oFilterBar._oSearchButton) {
				this.setInitialFocus(this._oFilterBar._oSearchButton);
			}

			// Try to fill the basic search text into the SmartFilterBar and set the initial Focus.
			if (this._oFilterBar._oBasicSearchField) {
				var loBasicSearchField = this._oFilterBar._oBasicSearchField;
				loBasicSearchField.setValue(this.getBasicSearchText());
	
				this.setInitialFocus(loBasicSearchField);
			}
		}

		return this;
	};
	
	/**
	 * setTable
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
		}

		this._bTableCreatedInternal = (arguments.length > 1) && (arguments[1] === true);

		if (oTable instanceof sap.ui.comp.smarttable.SmartTable) {
			this._oTable = oTable.getTable();
		} else {
			this._oTable = oTable;
		}

		this._oTable.setLayoutData(new sap.m.FlexItemData({
			shrinkFactor: 0,
			growFactor: 1
		}));

		this.theTable = this._oTable; // support old public theTable property for usage outside the class
		
		this._initializeTable();
		this._oMainLayout.addItem(oTable);
	};
	
	/**
	 * setBasicSearchText
	 */
	ValueHelpDialog.prototype.setBasicSearchText = function(text) {
		this.setProperty("basicSearchText", text);
	
		if (this._oFilterBar && this._oFilterBar._oBasicSearchField) {
			this._oFilterBar._oBasicSearchField.setValue(text);
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
	ValueHelpDialog.prototype.setTokens = function(tTokens) {
		var loCurrentKeyField = null;
		
		if (!tTokens || !tTokens.length) {
			this._oSelectedItems.removeAll();
			this._oSelectedRanges = {};
			return;
		}
		
		for (var i = 0; i < tTokens.length; i++) {
			var loToken = tTokens[i];
			if (!loToken) {
				continue;
			}
			
			var lKey = loToken.getKey();
			var lText = loToken.getText();
			var lLongKey = loToken.data("longKey");
			var loRowData = loToken.data("row");
			
			// retrieve Range object containing all information required for creating Token
			var loRange = null;
			var lIsRange = false;
			if (loToken.data("range")) {
				loRange = loToken.data("range");
				lIsRange = true;
			} else if (loToken.data("input")) {
				loRange = loToken.data("input");
			}
			
			// retrieve the correct Object based on value and type
			if (loRange) {
				var loCurrentKeyField = this._getKeyFieldByKey(loRange.keyField);
				
				loRange.value1 = this._convertValue2Object(loRange.value1, loCurrentKeyField.type);
				loRange.value2 = this._convertValue2Object(loRange.value2, loCurrentKeyField.type);
			}
			
			if (lIsRange) {
				var lTokenText = this._getFormattedRangeTokenText(loRange.operation, loRange.value1, loRange.value2, loRange.exclude, loRange.keyField);
				this._addToken2Tokenizer(lKey, lTokenText, loRange.exclude ? this._oExcludedTokens : this._oSelectedTokens);

				this._oSelectedRanges[lKey] = loRange;
			} else {
				if (lLongKey) {
					lKey = lLongKey;
				}
				
				this._oSelectedItems.add(lKey, loRowData ? loRowData : lText);
				
				var loNewToken = new sap.m.Token({
					key: lKey,
					text: lText,
					tooltip: lText
				});
				this._oSelectedTokens.addToken(loNewToken);
			}
			
		}
	};

	/**
	 * getFilterBar
	 */
	ValueHelpDialog.prototype.getFilterBar = function() {
		return this._oFilterBar;
	};
	
	/**
	 * getTable
	 * Gives access to the internal table instance.
	 * 
	 * @public
	 * @returns {object} the used table instance
	 * @since 1.28
	 */
	ValueHelpDialog.prototype.getTable = function() {
		if (!this._oTable) { 
			this._createDefaultTable();
		}	
		
		return this._oTable;
	};
	
	/**
	 * getRangeKeyFields
	 */
	ValueHelpDialog.prototype.getRangeKeyFields = function() {
		return this._aRangeKeyFields;
	};
	
	/**
	 * _handleFilterBarInitialize
	 */
	ValueHelpDialog.prototype._handleFilterBarInitialize = function() {
		if (this._currentViewMode === sap.ui.comp.valuehelpdialog._ValueHelpViewMode.PHONE_LIST_VIEW) {
			// update the Filterbar states
			this._oFilterBar._handleVisibilityOfToolbar();
			
			var lShowAdvancedSearch = this._oFilterBar && this._oFilterBar.getFilterGroupItems() && this._oFilterBar.getFilterGroupItems().length > 0;
			this._oAdvancedSearchLink.setVisible(lShowAdvancedSearch);
			
			this._oFilterBar.setShowGoButton(!(this._oFilterBar && this._oFilterBar.getBasicSearch()));
		}
	};
	
	/**
	 * open
	 */
	ValueHelpDialog.prototype.open = function() {
		this._bIgnoreSelectionChange = false;

		// take the current visibility of the title and button for the visibility of the colSearchBox 
		this.bCollectiveSearchActive = this.oSelectionTitle.getVisible() && this.oSelectionButton.getVisible();
		if (this._oColSearchBox) {
			this._oColSearchBox.setVisible(this.bCollectiveSearchActive);
		}
	
		if (!this._isPhone()) {
			if (this.getSupportRangesOnly() || this.getFilterMode()) {
				this._updateView(sap.zen._ValueHelpViewMode.DESKTOP_CONDITIONS_VIEW);
			} else if (!this._oTable) {
					this._createDefaultTable();
			}

			// set the default dialog width for Tablet/Desktop
			this.setContentWidth(this._getDefaultContentWidth());
		} else {
            if (!this._oTable) {
				this._createDefaultTable();
			}
			this._updateView(sap.zen._ValueHelpViewMode.PHONE_MAIN_VIEW);
		}

		sap.m.Dialog.prototype.open.apply(this);
		return this;
	};
	
	/**
	 * _getDefaultContentWidth
	 * return the default ContentWidth for the dialog
	 * 
	 * @private
	 * @returns {string} The width in px
	 */
	ValueHelpDialog.prototype._getDefaultContentWidth = function() {
		var lColumns = 0;
		if (this._oTable) {
			lColumns = this._oTable.getColumns().length;
		}
		
		var lWidth = Math.max(1080, lColumns * 130);
		
		return lWidth + "px";
	};
	
	/**
	 * resetTableState
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
	 * TableStateSearchData
	 * Changes the table NoDataText to "Please press Search Button".
	 * 
	 * @private
	 * @since 1.24
	 */
	ValueHelpDialog.prototype.TableStateSearchData = function() {
		this._updateNoDataText(this._oRb.getText("VALUEHELPDLG_TABLE_PRESSSEARCH"));
	};
	
	/**
	 * TableStateDataFilled
	 * Changes the table NoDataText to "No Data found!".
	 * 
	 * @private
	 * @since 1.24
	 */
	ValueHelpDialog.prototype.TableStateDataFilled = function() {
		this._updateNoDataText(this._oRb.getText("VALUEHELPDLG_TABLE_NODATA"));
	};
	
	/**
	 * TableStateDataSearching
	 * Changes the table NoDataText to "Searching...".
	 * 
	 * @private
	 * @since 1.28
	 */
	ValueHelpDialog.prototype.TableStateDataSearching = function() {
		this._updateNoDataText(this._oRb.getText("VALUEHELPDLG_TABLE_SEARCHING"));
	};
	
	/**
	 * _changeTableRowSelectionForKey
	 * select or deselect the row in the table with the given key
	 * 
	 * @private
	 * @param {string} sKey the key of the row
	 * @param {boolean} bSelect specifies if the row should be selected or deselected
	 */
	ValueHelpDialog.prototype._changeTableRowSelectionForKey = function(key, select) {
		this._bIgnoreSelectionChange = true;
		
		var loTable = this._oTable;
		if (sap.ui.table.Table && loTable instanceof sap.ui.table.Table) {
			var loRows = loTable.getBinding("rows");
		    if (loRows) {
                if (loRows.aKeys) {
                    for (var i = 0; i < loRows.aKeys.length; i++) {
                        if (loRows.aKeys[i] === key) {
                            if (select) {
                                loTable.addSelectionInterval(i, i);
                            } else {
                                loTable.removeSelectionInterval(i, i);
                            }
                            //break;ZEN
                        }
                    }
                } else {
                    this.oRows = loTable.getBinding("rows");
                    if (this.oRows.aIndices) {
                        for (var i = 0; i < this.oRows.aIndices.length; i++) {
                        	//oContext = oTable.getContextByIndex(this.oRows.aIndices[i]); // seems to no longer work
                           	var loContext = loTable.getContextByIndex(i);
                        	
                        	var loRow = null;
                            if (loContext) {
                            	loRow = loContext.getObject();
                            } else { // fallback
                            	loRow = loTable.getBinding("rows").oList[this.oRows.aIndices[i]];
                            }
                            
                         	if (loRow[this.getKey()] === key) {
                                if (select) {
                                    loTable.addSelectionInterval(i, i);
                                } else {
                                    loTable.removeSelectionInterval(i, i);
                                }
                                //break;ZEN
                            }
                        }
                    }
                }
            }
		} else {
			// Handle selection update of the m.table
			for (var i = 0; i < loTable.getItems().length; i++) {
				var loColListItem = loTable.getItems()[i];
				
				var loRowData = loColListItem.getBindingContext().getObject();
				if (loRowData[this.getKey()] === key) {
					loTable.setSelectedItem(loColListItem, select);						
					break;
				}
			}				
			
		}
	
		this._bIgnoreSelectionChange = false;
	};
	
	/**
	 * _createHeaderBar
	 * Create the header bar, the controls for the header and adds it into the custom header.
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._createHeaderBar = function() {
		this._oTitle = new sap.m.Title();
	
		var loBackButton = null;
		if (this._isPhone()) {
			loBackButton = new sap.m.Button({
				visible: false,
				type: sap.m.ButtonType.Back,
				press: function() {
					if (this._currentViewMode === sap.zen._ValueHelpViewMode.PHONE_SEARCH_VIEW) {
						this._updateView(sap.zen._ValueHelpViewMode.PHONE_LIST_VIEW);
					} else {
						this._updateView(sap.zen._ValueHelpViewMode.PHONE_MAIN_VIEW);
					}
				}.bind(this)
			});
			
			this._oBackButton = loBackButton; 
		}
		
		this.setCustomHeader(new sap.m.Bar({
			contentLeft: loBackButton,
			contentMiddle: this._oTitle
		}));
	};
		
	/**
	 * _createCollectiveSearch
	 * Creates the collective search elements which are placed beside the <code>FilterBar</code>.
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._createCollectiveSearch = function() {
		// the oSelectionText and oSelectionButton are accessed outside the dialog!!!
		this.oSelectionTitle = new sap.m.Text({
			visible: false,
			wrapping: false
		}).addStyleClass("compVHColSearchText"); 
	
		this.oSelectionButton = new sap.m.Button({
			icon: "sap-icon://arrow-down",
			tooltip: this._oRb.getText("VALUEHELPVALDLG_SEARCHTEMPLATES_TOOLTIP"), //"Search Templates", 
			type: sap.m.ButtonType.Transparent,
			visible: false,
			ariaLabelledBy: this.oSelectionTitle
		}).addStyleClass("compVHColSearchBtn");
		
		this._oColSearchBox = new sap.m.HBox( { 
			fitContainer: true,
			visible: this.oSelectionButton.getVisible(),
			items: [
				this.oSelectionTitle, this.oSelectionButton
			]
		}).addStyleClass("compVHColSearchVBox");
	};
	
	/**
	 * _createFooterControls
	 * Creates the footer buttons.
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._createFooterControls = function() {
		this._oButtonOk = new sap.m.Button({
			text: this._oRb.getText("VALUEHELPDLG_OK"),
			press: this._onCloseAndTakeOverValues.bind(this),
			//ZEN visible: this.getSupportMultiselect(),
			layoutData: new sap.m.OverflowToolbarLayoutData({
				priority: sap.m.OverflowToolbarPriority.NeverOverflow
			})
		});

		this._oButtonCancel = new sap.m.Button({
			text: this._oRb.getText("VALUEHELPDLG_CANCEL"),
			press: this._onCancel.bind(this),
			layoutData: new sap.m.OverflowToolbarLayoutData({
				priority: sap.m.OverflowToolbarPriority.NeverOverflow
			})
		});

		if (this._isPhone()) {
			this._oButtonGo = new sap.m.Button({
				text: this._oRb.getText("VALUEHELPDLG_GO"), 
				type: sap.m.ButtonType.Emphasized,
				press: this._onGo.bind(this),
				visible: false,
				layoutData: new sap.m.OverflowToolbarLayoutData({
					priority: sap.m.OverflowToolbarPriority.NeverOverflow
				})
			});
		
			this._oButtonClear = new sap.m.Button({
				text: this._oRb.getText("VALUEHELPDLG_CLEAR"), 
				press: this._onClear.bind(this),
				visible: false,
				layoutData: new sap.m.OverflowToolbarLayoutData({
					priority: sap.m.OverflowToolbarPriority.NeverOverflow
				})
			});

			this.addButton(this._oButtonGo);
			this.addButton(this._oButtonClear);
		} 
		this.addButton(this._oButtonOk);
		this.addButton(this._oButtonCancel);
	};
	
	/**
	 * _createTokenizer
	 * Creates the tokenizer part of the dialog.
	 * 
	 * @private
	 * @returns {sap.ui.layout.Grid} with all elements
	 */
	ValueHelpDialog.prototype._createTokenizer = function() {
		if (this._oTokenizerGrid) {
			return this._oTokenizerGrid;
		}
	
		this._oSelectedTokenTitle = new sap.ui.core.InvisibleText();
	
		this._oSelectedTokens = new sap.m.Tokenizer({
			tokenUpdate: function(oControlEvent) {
				if (this._ignoreRemoveToken) {
					return;
				}
	
				if (oControlEvent.getParameter("type") === sap.m.Tokenizer.TokenChangeType.Removed) {
					var ltTokenKeys = [];
					var ltRangeTokenKeys = [];
					
					var ltRemovedTokens = oControlEvent.getParameter("removedTokens");
					for (var i = 0; i < ltRemovedTokens.length; i++) {
						var loToken = ltRemovedTokens[i];
						if (!loToken) {
							continue;
						}
						
						var lKey = loToken.getKey();
		
						if (this._oSelectedRanges && this._oSelectedRanges[lKey]) {
							ltRangeTokenKeys.push(lKey);
							this._removeToken(lKey);
						} else {
							ltTokenKeys.push(lKey);

							// remove single selected item
							this._oSelectedItems.remove(lKey);
							this._removeTokenFromTokenizer(lKey, this._oSelectedTokens);
						}
					}
					
					// remove range tokens
					this._removeRangeByKey(ltRangeTokenKeys, false);

					var loEventArgs = { 
						tokenKeys: ltTokenKeys,
						useDefault: false
					};

					if (this._hasListeners("tokenRemove")) {
						this._bIgnoreSelectionChange = true;
						this.fireTokenRemove(eventArgs);
						this._bIgnoreSelectionChange = false;
					} else {
						loEventArgs.useDefault = true;
					}
					
					if (loEventArgs.useDefault) {
						ltTokenKeys.forEach(function(tokenKey) {
							this._changeTableRowSelectionForKey(tokenKey, false);
						}.bind(this));
					}
					
					// try to set the focus to other token - Workaround because the Tokenizer does not set the focus to other token
					if (ltRemovedTokens.length === 1) {
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
		this._oRemoveAllSelectedItemsBtn = new sap.m.Button({
			type: sap.m.ButtonType.Transparent,
			icon: sap.ui.core.IconPool.getIconURI("sys-cancel"),
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
	
		var loHorizontalLayout1 = new sap.ui.layout.HorizontalLayout({
			content: [this._oSelectedTokens, this._oRemoveAllSelectedItemsBtn]
		}).addStyleClass("compVHTokenizerHLayout");
	
		this._oIncludeTokenGrid = new sap.ui.layout.Grid({
			width: "100%",
			defaultSpan: "L12 M12 S12",
			hSpacing: 0,
			vSpacing: 0,
			content: [this._oSelectedTokenTitle, loHorizontalLayout1]
		});
	
		this._oExcludedTokenTitle = new sap.m.Text().addStyleClass("compVHSelectedItemsText");
	
		this._oExcludedTokens = new sap.m.Tokenizer({
			tokenChange: function(oControlEvent) {
				if (this._ignoreRemoveToken) {
					return;
				}
	
				if (oControlEvent.getParameter("type") === sap.m.Tokenizer.TokenChangeType.Removed || oControlEvent.getParameter("type") === sap.m.Tokenizer.TokenChangeType.RemovedAll) {
					var ltTokenKeys = [];

					var ltRemovedTokens = oControlEvent.getParameter("removedTokens");
					if (!ltRemovedTokens || ltRemovedTokens.length === 0) {
						ltRemovedTokens = [oControlEvent.getParameter("token")];						
					}

					for (var i = 0; i < ltRemovedTokens.length; i++) {
						var loToken = ltRemovedTokens[i];
						if (!loToken) {
							continue;
						}
						
						var lKey = loToken.getKey();
						if (this._oSelectedRanges && this._oSelectedRanges[lKey]) {
							ltTokenKeys.push(lKey);
						}
					}

					// remove range
					this._removeRangeByKey(ltTokenKeys, true);
					this._updateTitles();
				}
			}.bind(this),
			ariaLabelledBy: this._oExcludedTokenTitle
		}).addStyleClass("compVHTokensDiv");

		// this "remove all" button is a workaround and should be part of the Tokenizer itself
		this._oRemoveAllExcludeItemsBtn = new sap.m.Button({
			type: sap.m.ButtonType.Transparent,
			icon: sap.ui.core.IconPool.getIconURI("sys-cancel"),
			tooltip: this._oRb.getText("VALUEHELPVALDLG_REMOVETOKENS_TOOLTIP"),
			press: function() {
				this._oExcludedTokens.destroyTokens();	
				this._removeRangeByKey(Object.keys( this._oSelectedRanges), true);
				this._updateTitles();
			}.bind(this),
			ariaLabelledBy: this._oExcludedTokenTitle
		}).addStyleClass("compVHRemoveAllBtn");
	
		var loHorizontalLayout2 = new sap.ui.layout.HorizontalLayout({
			content: [this._oExcludedTokens, this._oRemoveAllExcludeItemsBtn]
		}).addStyleClass("compVHTokenizerHLayout");
	
		this._oExcludeTokenGrid = new sap.ui.layout.Grid({
			width: "100%",
			defaultSpan: "L12 M12 S12",
			hSpacing: 0,
			vSpacing: 0,
			content: [this._oExcludedTokenTitle, loHorizontalLayout2]
		});
	
		// only on tablet and desktop we use the expandable panel
		this._oTokenizerPanel = new sap.m.Panel({
			expanded: sap.ui.Device.system.desktop,
			expandable: true, //this._isPhone() ? false : true,
			expandAnimation: true,
			headerText: "",
			width: "auto",
			content: [this._oIncludeTokenGrid, this._oExcludeTokenGrid],
			expand: function(oEvent) {
				this._updateTokenizer();
				
				if (oEvent.mParameters.expand && !(this._oTable instanceof sap.m.Table)) {
					// when we open the tokens scroll the dialog content to the end
					var loScrollDiv = jQuery.sap.domById(this.getId() + "-scrollCont");
					if (loScrollDiv && loScrollDiv.scrollTop) {
						loScrollDiv.stop().animate({
							  scrollTop: "1000" //oScrollDiv.prop("scrollHeight") - oScrollDiv.height()
						}, 1000);
					}
				}
			}.bind(this)
		}).addStyleClass("compVHBackgroundTransparent").addStyleClass("compVHTokensPanel").addStyleClass("compValueHelpDialogTokens");
	
		if (this._isPhone()) {
			//workaround to get a vertical layout of the Tokens in the tokenizer 
			this._oSelectedTokens.addStyleClass("sapMTokenizerMultiLine");
			this._oExcludedTokens.addStyleClass("sapMTokenizerMultiLine");
		}
		
		this._oTokenizerGrid = new sap.ui.layout.Grid({
			width: "100%",
			defaultSpan: "L12 M12 S12",
			hSpacing: 0,
			vSpacing: 0,
			content: this._oTokenizerPanel
		}).addStyleClass("compVHDarkBackground");
		
		return this._oTokenizerGrid;
	};
	
	/**
	 * _addToken2Tokenizer
	 * Add/Modify a token in a tokenizer control.
	 * 
	 * @private
	 * @param {string} sKey of the token
	 * @param {string} sText the token text
	 * @param {sap.m.Tokenizer} oTokenizer the Tokenizer which contain the token
	 */
	ValueHelpDialog.prototype._addToken2Tokenizer = function(key, text, oTokenizer) {
		var lTooltip = (typeof text === "string") ? text : "";

		var loToken = this._getTokenByKey(key, oTokenizer);
		if (!loToken) {
			// create a new token
			loToken = new sap.m.Token({
				key: key
			});
			oTokenizer.addToken(loToken);
			this._updateTokenizer();
		}

		if (loToken) {
			// update existing/new token text
			loToken.setText(text);
			loToken.setTooltip(lTooltip);
		}
	};
	
	/**
	 * _getTokenByKey
	 * Search a token by key in the given tokenizer.
	 * 
	 * @private
	 * @param {string} sKey of the token
	 * @param {sap.m.Tokenizer} oTokenizer the Tokenizer which contain the token
	 * @returns {sap.m.Token} the found token instance or null
	 */
	ValueHelpDialog.prototype._getTokenByKey = function(key, oTokenizer) {
		var ltTokens = oTokenizer.getTokens();
		
		for (var i = 0; i < ltTokens.length; i++) {
			var loToken = ltTokens[i];
			if (!loToken) {
				continue;
			}
			
			if (loToken.getKey() === key) {
				return loToken;
			}
		}
		
		return null;
	};
	
	/**
	 * _removeToken
	 * Removes a token from the selected or excluded tokenizer.
	 * 
	 * @private
	 * @param {string} sKey of the token
	 */
	ValueHelpDialog.prototype._removeToken = function(key) {
		if (!this._removeTokenFromTokenizer(key, this._oSelectedTokens)) {
			this._removeTokenFromTokenizer(key, this._oExcludedTokens);
		}
	};
	
	/**
	 * _removeTokenFromTokenizer
	 * Removes a token from a tokenizer.
	 * 
	 * @private
	 * @param {string} sKey of the token
	 * @param {sap.m.Tokenizer} oTokenizer the Tokenizer which contain the token
	 * @returns {boolean} true when the token has been found and removed, else false
	 */
	ValueHelpDialog.prototype._removeTokenFromTokenizer = function(key, oTokenizer) {
		var loToken = this._getTokenByKey(key, oTokenizer);
		
		if (loToken) {
			this._ignoreRemoveToken = true;
			oTokenizer.removeToken(loToken);
			this._ignoreRemoveToken = false;
			this._updateTokenizer();
			return true;
		}
		
		return false;
	};
		
	/**
	 * _createNavigationControl
	 * Create the TabBar or on Phone the ListItems as navigation control.
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._createNavigationControl = function() {
		if (!this._isPhone()) {
			this._oTabBar = new sap.m.IconTabBar({
				upperCase: true,
				expandable: false,
				items: [
					new sap.m.IconTabFilter({
						visible: true,
						text: this._oRb.getText("VALUEHELPDLG_ITEMSTABLE"),
						key: sap.zen._ValueHelpViewMode.DESKTOP_LIST_VIEW
					}), new sap.m.IconTabFilter({
						visible: true,
						text: this._oRb.getText("VALUEHELPDLG_RANGES"),
						key: sap.zen._ValueHelpViewMode.DESKTOP_CONDITIONS_VIEW
					})
				],
				select: function(oControlEvent) {
					this._updateView(oControlEvent.getParameters().key);
				}.bind(this)
			});
	
			this._oTabBar.setLayoutData(new sap.m.FlexItemData({
				shrinkFactor: 0
			}));
			
			this._oVBox.addItem(this._oTabBar);
			
		} else {
			this._oSelectItemLI = new sap.m.StandardListItem({
				type: sap.m.ListType.Navigation,
			    title: this._oRb.getText("VALUEHELPDLG_ITEMSTABLE")
			}).data("key", sap.zen._ValueHelpViewMode.PHONE_LIST_VIEW);
			
			this._oDefineConditionsLI = new sap.m.StandardListItem({
				type: sap.m.ListType.Navigation,
				title: this._oRb.getText("VALUEHELPDLG_RANGES")
			}).data("key", sap.zen._ValueHelpViewMode.PHONE_CONDITIONS_VIEW);
			
			this._oMainListMenu = new sap.m.List({
				mode: sap.m.ListMode.None,
				items: [
					this._oSelectItemLI, this._oDefineConditionsLI
				],
				itemPress: function(oEvent) {
					if (oEvent) {
						this._updateView(oEvent.mParameters.listItem.data("key"));
					}
				}.bind(this)
			});
			
			this._oMainListMenu.setLayoutData(new sap.m.FlexItemData({
				shrinkFactor: 0
			}));
			this._oVBox.addItem(this._oMainListMenu);

			this._oAdvancedSearchLink = new sap.m.Link({
				text: this._oRb.getText("VALUEHELPDLG_ADVANCEDSEARCH"),
				press: function() {
					this._updateView(sap.zen._ValueHelpViewMode.PHONE_SEARCH_VIEW);
				}.bind(this)
			}).addStyleClass("compVHAdvancedSearchLink");
			
			this._oAdvancedSearchLink.setLayoutData(new sap.m.FlexItemData({
				shrinkFactor: 0
			}));
			
			this._oVBox.addItem(this._oAdvancedSearchLink);
		}
	};
		
	/**
	 * _removeRangeByKey
	 * Remove a single/multiple range(s) from the UI and the internal selectedRanges list.
	 * 
	 * @param {string|array} sKey Single or multiple sKey of the range
	 * @param {boolean} isExclude specifies if the removed range must be an included or excluded range
	 *
	 * @private
	 */
	ValueHelpDialog.prototype._removeRangeByKey = function(key, isExclude) {
		var ltKeys = key;

		if (typeof ltKeys === "string") {
			ltKeys = [
				ltKeys
			];
		}

		ltKeys.forEach(function(key, index, tKeys) {
			var loRange = this._oSelectedRanges[key];
			if (loRange.exclude === isExclude && !loRange._oGrid) {
				delete this._oSelectedRanges[key];
				
				if (this._oFilterPanel) {
					var loConditionPanel =  loRange.exclude ? this._oFilterPanel._oExcludeFilterPanel : this._oFilterPanel._oIncludeFilterPanel;

					if (tKeys.length === 1) {
						// only in case  of a single key we remove the condition
						loConditionPanel.removeCondition(key);
					} else {
						// to make it faster we only remove the key from the internal oConditionMap and later make a refresh on the conditionPanel
						loConditionPanel._removeConditionFromMap(key);
					}
				}
			}
		}, this);
	
		if (ltKeys.length > 1 && this._oFilterPanel) {
			var loConditionPanel =  isExclude ? this._oFilterPanel._oExcludeFilterPanel : this._oFilterPanel._oIncludeFilterPanel;
			loConditionPanel._clearConditions();
			loConditionPanel._fillConditions();
		}
	};
	

	// ################################################################################
	// Start Ranges handling
	// ################################################################################
	
	/**
	 * _getRanges
	 * Create and returns the ranges grid
	 * 
	 * @private
	 * @returns {sap.ui.layout.Grid} the ranges grid
	 */
	ValueHelpDialog.prototype._getRanges = function() {
		if (!this._oRanges) {
			this._oRanges = this._createRanges();
		}
		
		return this._oRanges;
	};
	
	/**
	 * _createRanges
	 * Create a new instance of ranges grid with all inner controls.
	 * 
	 * @private
	 * @returns {sap.ui.layout.Grid} the ranges grid
	 */
	ValueHelpDialog.prototype._createRanges = function() {
		jQuery.sap.require("sap.m.P13nConditionPanel");
		jQuery.sap.require("sap.m.P13nFilterPanel");
	
		this._oFilterPanel = new sap.m.P13nFilterPanel({
			maxIncludes: this.getMaxIncludeRanges(),
			maxExcludes: this.getMaxExcludeRanges(),
			containerQuery: true,
			addFilterItem: function(oEvent) {
				var loParams = oEvent.mParameters;
				
				var loRange = {
					exclude: loParams.filterItemData.getExclude(),
					keyField: loParams.filterItemData.getColumnKey(),
					operation: loParams.filterItemData.getOperation(),
					value1: loParams.filterItemData.getValue1(),
					value2: loParams.filterItemData.getValue2()
				};
				
				this._oSelectedRanges[loParams.key] = loRange;
	
				var loCurrentKeyField = this._getKeyFieldByKey(loRange.keyField);
				loRange.value1 = this._convertValue2Object(loRange.value1, loCurrentKeyField.type);
				loRange.value2 = this._convertValue2Object(loRange.value2, loCurrentKeyField.type);
			
				// the new added filterItemData instance must be passed back into the filterpanel aggregation, otherwise the index of the add, update
				// or remove events is not correct.
				this._oFilterPanel.addFilterItem(loParams.filterItemData);
	
				var lTokenText = this._getFormattedRangeTokenText(loRange.operation, loRange.value1, loRange.value2, loRange.exclude, loRange.keyField);
				this._addToken2Tokenizer(loParams.key, lTokenText, loRange.exclude ? this._oExcludedTokens : this._oSelectedTokens);
				this._updateTokenizer();
			}.bind(this),
			
			removeFilterItem: function(oEvent) {
				var loParams = oEvent.mParameters;
				delete this._oSelectedRanges[loParams.key];
				this._removeToken(loParams.key);
				this._updateTokenizer();			
			}.bind(this),
			
			updateFilterItem: function(oEvent) {
				var loParams = oEvent.mParameters;
				
				var loRange = this._oSelectedRanges[loParams.key];
				loRange.exclude = loParams.filterItemData.getExclude();
				loRange.keyField = loParams.filterItemData.getColumnKey();
				loRange.operation = loParams.filterItemData.getOperation();
				loRange.value1 = loParams.filterItemData.getValue1();
				loRange.value2 = loParams.filterItemData.getValue2();
				
				var loCurrentKeyField = this._getKeyFieldByKey(loRange.keyField);
				loRange.value1 = this._convertValue2Object(loRange.value1, loCurrentKeyField.type);
				loRange.value2 = this._convertValue2Object(loRange.value2, loCurrentKeyField.type);
				
				var lTokenText = this._getFormattedRangeTokenText(loRange.operation, loRange.value1, loRange.value2, loRange.exclude, loRange.keyField);
				this._addToken2Tokenizer(loParams.key, lTokenText, loRange.exclude ? this._oExcludedTokens : this._oSelectedTokens);
				this._updateTokenizer();
			}.bind(this)
		});
        
        this._oFilterPanel._oIncludeFilterPanel.setDisplayFormat(this.getDisplayFormat());
		this._oFilterPanel._oExcludeFilterPanel.setDisplayFormat(this.getDisplayFormat());
	
		this._oFilterPanel._oIncludeFilterPanel._fSuggestCallback = this._fSuggestCallback;
		this._oFilterPanel._oExcludeFilterPanel._fSuggestCallback = this._fSuggestCallback;

		this._oFilterPanel._oIncludeFilterPanel._sAddRemoveIconTooltipKey = "CONDITION";
		this._oFilterPanel._oExcludeFilterPanel._sAddRemoveIconTooltipKey = "CONDITION";

		if (this._aIncludeRangeOperations) {
			for (var lType in this._aIncludeRangeOperations) {
				this._oFilterPanel.setIncludeOperations(this._aIncludeRangeOperations[lType], lType);
			}
		}
		if (this._aExcludeRangeOperations) {
			for (var lType in this._aExcludeRangeOperations) {
				this._oFilterPanel.setExcludeOperations(this._aExcludeRangeOperations[lType], lType);
			}
		}
	
		if (this._aRangeKeyFields) {
			this._aRangeKeyFields.forEach( function(oItem) {
				this._oFilterPanel.addItem(new sap.m.P13nItem({
					columnKey: oItem.key,
					text: oItem.label,
					type: oItem.type,
					maxLength: oItem.maxLength,
					formatSettings: oItem.formatSettings,
					scale: oItem.scale,
					precision: oItem.precision,
					isDefault: oItem.isDefault,
					values: oItem.type === "boolean" ? this._getBooleanValues() : null
				}));
			}, this);
		}

		if (this._oSelectedRanges) {
			for (var lRangeId in this._oSelectedRanges) {
				var loRangeData = this._oSelectedRanges[lRangeId];
				var loField = this._getKeyFieldByKey(loRangeData.keyField);
				
				// determine formatter depending on type
				var loFormatter;
				if (loField.type === "date") {
					loFormatter = sap.ui.core.format.DateFormat.getDateInstance();
				} else if (loField.type === "time") {
					loFormatter = sap.ui.core.format.DateFormat.getTimeInstance();
				}
				
				// determine value
				var loValue1 = loRangeData.value1;
				var loValue2 = loRangeData.value2;
				if (loFormatter) {
					loValue1 = loFormatter.format(loValue1);
					loValue2 = loFormatter.format(loValue2);
				}
				
				// create and add Filter Item Input Field
				var loFilterItem = new sap.m.P13nFilterItem({
					key: lRangeId,
					exclude: loRangeData.exclude,
					columnKey: loRangeData.keyField,
					operation: loRangeData.operation
				});
				loFilterItem.setValue1(loValue1);
				loFilterItem.setValue2(loValue2);
				
				this._oFilterPanel.addFilterItem(loFilterItem);
			}
		}
		
		var loRangeFieldsGrid = new sap.ui.layout.Grid({
			width: "100%",
			defaultSpan: "L12 M12 S12",
			vSpacing: 0,
			hSpacing: 0,
			content: [this._oFilterPanel]
		});
	
		this._sValidationDialogTitle = this._oRb.getText("VALUEHELPVALDLG_TITLE");
		this._sValidationDialogMessage = this._oRb.getText("VALUEHELPVALDLG_MESSAGE");
		this._sValidationDialogFieldMessage = this._oRb.getText("VALUEHELPVALDLG_FIELDMESSAGE");
	
		return loRangeFieldsGrid;
	};
	
	/**
	 * suggest
	 */
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
	 * _getBooleanValues
	 * creates an array for boolean value representation (using the odata.type.Boolean) used on the selected control for boolean conditions.
	 *
	 * @returns {string[]} ["", "No", "Yes"]
	 */
	ValueHelpDialog.prototype._getBooleanValues = function() {
		jQuery.sap.require("sap.ui.model.odata.type.Boolean");
		
		var loBooleanType = new sap.ui.model.odata.type.Boolean();
		
		var ltBooleanValues = null;
		if (loBooleanType) {
			ltBooleanValues = [
				"", 
				loBooleanType.formatValue(false, "string"), 
				loBooleanType.formatValue(true, "string")
			];
		}

		return ltBooleanValues;
	};

	/**
	 * _getKeyFieldByKey
	 * returns the KeyField definition with the key sKey
	 *
	 * @param {string} sKey Key of the field
	 *
	 * @returns {object} Key field definition
	 *
  	 * @private
	 */
	ValueHelpDialog.prototype._getKeyFieldByKey = function(key) {
		var loCurrentKeyField;
		
		if (this._aRangeKeyFields) {
			// search the current KeyField 
			this._aRangeKeyFields.some( function(keyField) {
				if (typeof keyField !== "string" && keyField.key === key) {
					loCurrentKeyField = keyField;
					return true;
				}
				return false;
			});
		}
		
		return loCurrentKeyField;
	};
	
	/**
	 * _validateRanges
	 * Check if the entered/modified ranges are correct, marks invalid fields yellow (Warning state) and opens a popup message dialog to give the user
	 * the feedback that some values are wrong or missing.
	 * 
	 * @private
	 * @param {function} fnCallback will be called when all ranges are valid or the user ignores the wrong/missing fields by pressing Ok on a message
	 *         dialog
	 * @param {function} fnCancelCallback will be called when ranges are invalid and the user press Cancel on a message dialog
	 */
	ValueHelpDialog.prototype._validateRanges = function(fnCallback, fnCancelCallback) {
		if (this._oRanges) {
			if (!this._oRanges.getParent()) {
				fnCallback();
				return;
			}
	
			// show warnings on invalid fields.
			var lIsIncludeRangesValid = this._oFilterPanel.validateConditions();
			if (!lIsIncludeRangesValid) {
				// open a simple confirm box
				$.sap.require("sap.m.MessageBox");
				sap.m.MessageBox.show(this._sValidationDialogMessage, {
					icon: sap.m.MessageBox.Icon.WARNING,
					title: this._sValidationDialogTitle,
					actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
					styleClass: this.$().closest(".sapUiSizeCompact").length ? "sapUiSizeCompact" : "",
					onClose: function(result) {
						if (result === sap.m.MessageBox.Action.OK && fnCallback) {
							fnCallback();
						}
						if (result === sap.m.MessageBox.Action.CANCEL && fnCancelCallback) {
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
	 * setUpdateSingleRowCallback
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
	/**
	 * _createDefaultTable
	 */
	ValueHelpDialog.prototype._createDefaultTable = function() {
		//if (!this._isPhone()) {ZEN
			sap.ui.getCore().loadLibrary("sap.ui.table");
			jQuery.sap.require("sap.ui.table.Table");
			
			this.setTable( new sap.ui.table.Table(), true);
			/* ZEN
		} else {
			this.setTable(new sap.m.Table(), true);
			this.TableStateSearchData();
		} ZEN*/
	};
	
	/**
	 * _initializeTable
	 * initialize the table instance
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._initializeTable = function() {
		if (sap.ui.table.Table && this._oTable instanceof sap.ui.table.Table) {
			this._oTable.setTitle( sap.ui.Device.system.desktop ? this._sTableTitleNoCount : null);
			if (this._bTableCreatedInternal) {
				this._oTable.setSelectionBehavior( sap.ui.table.SelectionBehavior.Row);
			}
			this._oTable.setSelectionMode( this.getSupportMultiselect() ? sap.ui.table.SelectionMode.MultiToggle : sap.ui.table.SelectionMode.Single);
			this._updateNoDataText( this._oRb.getText("VALUEHELPDLG_TABLE_PRESSSEARCH"));
			//initial we use Fixed mode to give the table the chance to render and calculate the correct height
			this._oTable.setVisibleRowCountMode( sap.ui.table.VisibleRowCountMode.Fixed);
			this._oTable.setMinAutoRowCount( sap.ui.Device.system.desktop ? 5 : 4);
			
			this._oTable.attachRowSelectionChange(function(oControlEvent) {
				if (this._bIgnoreSelectionChange || !oControlEvent.getParameter("userInteraction")) {
					return;
				}

				var loEventArgs = {
					tableSelectionParams: oControlEvent.mParameters,
					updateTokens: [], //[{sKey, oRow, bSelect}, {}],
					useDefault: false
				};
				
				if (this._hasListeners("selectionChange")) {
					this._bIgnoreSelectionChange = true;
					this.fireSelectionChange(loEventArgs);
					this._bIgnoreSelectionChange = false;
					
					loEventArgs.updateTokens.forEach(function(oCurrentValue) {
						this._addRemoveTokenByKey(oCurrentValue.sKey, oCurrentValue.oRow, oCurrentValue.bSelected);						
					}.bind(this));
					
				} else {
					loEventArgs.useDefault = true;
				}
				
				if (loEventArgs.useDefault) {
					// collect all the new selected or removed items
					var loTable = oControlEvent.getSource();
					var ltRowIndices = oControlEvent.getParameter("rowIndices");
		
					// check if we can select all items, if not we show an error dialog
					for (var i = 0; i < ltRowIndices.length; i++) {
						var lRowIndex = ltRowIndices[i];
						
						var loContext = loTable.getContextByIndex(lRowIndex);
						var loRow = loContext ? loContext.getObject() : null;
						if (!loRow) {
							$.sap.require("sap.m.MessageBox");
							sap.m.MessageBox.show(this._oRb.getText("VALUEHELPDLG_SELECTIONFAILED"), {
								icon: sap.m.MessageBox.Icon.ERROR,
								title: this._oRb.getText("VALUEHELPDLG_SELECTIONFAILEDTITLE"),
								actions: [
									sap.m.MessageBox.Action.OK
								],
								styleClass: this.$().closest(".sapUiSizeCompact").length ? "sapUiSizeCompact" : ""
							});
							return;
						}
					}

					//ZEN in case of single selection destroy all selections first
					if (!this.getSupportMultiselect()) {//ZEN
						this._oSelectedTokens.destroyTokens();//ZEN
						this._oSelectedItems.removeAll();//ZEN
					}//ZEN
					
					var lUsePath = false;
					if (loTable.getBinding("rows").aKeys) {
						lUsePath = true;
					}
					
					for (var i = 0; i < ltRowIndices.length; i++) {
						var lRowIndex = ltRowIndices[i];
						
						var loContext = loTable.getContextByIndex(lRowIndex);
						var loRow = loContext ? loContext.getObject() : null;
						if (loRow) {
							var lKey;
							if (lUsePath) {
								lKey = loContext.sPath.substring(1);
							} else {
								lKey = loRow[this.getKey()];
							}
		
							this._addRemoveTokenByKey(lKey, loRow, loTable.isIndexSelected(lRowIndex));
							this._changeTableRowSelectionForKey(lKey, loTable.isIndexSelected(lRowIndex));//ZEN
						}
					}
				}
				
				this._updateTitles();
				/*ZEN
				if (!this.getSupportMultiselect()) {
					// in case of single select we fireOk and close the dialog
					this._bIgnoreSelectionChange = true; // set to true, to avoid a double(second) click and deselect the item.
					this._onCloseAndTakeOverValues();
				}*/
			}.bind(this));
			
			this._oTable.addStyleClass("compVHMainTable");
		
			if (!(this._oTable.getParent() instanceof sap.ui.comp.smarttable.SmartTable)) { // && !(this._oTable instanceof
				// sap.ui.table.AnalyticalTable) && !(this._oTable
				// instanceof sap.ui.table.TreeTable)) {
				this._oTable.bindAggregation("columns", "columns>/cols", function(sId, oContext) {
					var loControl, loTooltip;
			
					// Tooltip is only possible for certain (string) fields
					// ignore it for all types other than string!
					if (oContext.getProperty("type") === "string") {
						loTooltip = {
							path: oContext.getProperty("template")
						};
					}
			
					if (oContext.getProperty("type") === "boolean") {
						loControl = new sap.m.CheckBox({
							enabled: false,
							selected: {
								path: oContext.getProperty("template")
							}
						});
					} else {
						loControl = new sap.m.Text({
							wrapping: false,
							text: {
								path: oContext.getProperty("template"),
								type: oContext.getProperty("oType")
							},
							tooltip: loTooltip
						});
					}
			
					if (this._oTable instanceof sap.ui.table.AnalyticalTable) {
						return new sap.ui.table.AnalyticalColumn(sId, {
							label: "{columns>label}",
							tooltip: "{columns>tooltip}",
							template: loControl,
							width: "{columns>width}",
							hAlign: loControl instanceof sap.m.CheckBox ? sap.ui.core.HorizontalAlign.Center : sap.ui.core.HorizontalAlign.Begin,
							filterProperty: oContext.getProperty("filter")
						});
						
					} else {
						return new sap.ui.table.Column(sId, {
							label: "{columns>label}",
							tooltip: "{columns>tooltip}",
							template: loControl,
							width: "{columns>width}",
							hAlign: loControl instanceof sap.m.CheckBox ? sap.ui.core.HorizontalAlign.Center : sap.ui.core.HorizontalAlign.Begin,
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
			this._oTable.setMode(this.getSupportMultiselect() ? sap.m.ListMode.MultiSelect : sap.m.ListMode.SingleSelectLeft);
			this._oTable.setGrowing(true);
			
			this._oTable.attachSelectionChange(function(oControlEvent) {
				if (this._bIgnoreSelectionChange) {
					return;
				}

				var loEventParams = oControlEvent.mParameters;

				var loEventArgs = {
					tableSelectionParams: oControlEvent.mParameters,
					updateTokens: [], //[{sKey, oRow, bSelect}, {}],
					useDefault: false
				};

				if (this._hasListeners("selectionChange")) {
					this._bIgnoreSelectionChange = true;
					this.fireSelectionChange(eventArgs);
					this._bIgnoreSelectionChange = false;
					
					loEventArgs.updateTokens.forEach(function(oCurrentValue) {
						this._addRemoveTokenByKey(oCurrentValue.sKey, oCurrentValue.oRow, oCurrentValue.bSelected);						
					}.bind(this));
									
				} else {
					loEventArgs.useDefault = true;
				}
				
				if (loEventArgs.useDefault) {
					for (var i = 0; i < loEventParams.listItems.length; i++) {					
						var loColListItem = loEventParams.listItems[i];
						
						var loContext = loColListItem.getBindingContext();
						var loRow = loContext ? loContext.getObject() : null;
						if (loRow) {
							var lKey = loRow[this.getKey()];
							this._addRemoveTokenByKey(lKey, loRow, loEventParams.selected);
						}					
					}
				}
			
				/*ZEN
				if (!this.getSupportMultiselect()) {
					// in case of single select we fireOk
					this._onCloseAndTakeOverValues();
				}*/
			}.bind(this));

			if (!(this._oTable.getParent() instanceof sap.ui.comp.smarttable.SmartTable)) {  //this._bTableCreatedInternal) {
				this._oTable.bindAggregation("columns", "columns>/cols", function(sId, oContext) {
					var lColLabel = oContext.getProperty("label");
					var lDemandPopin = this._oTable.getColumns().length >= 2;
					
					return new sap.m.Column({ 
						header: new sap.m.Label({
							text: lColLabel
						}),
						demandPopin: lDemandPopin, 
						//popinDisplay: sap.m.PopinDisplay.Inline,
						minScreenWidth: lDemandPopin ? (this._oTable.getColumns().length + 1) * 10 + "rem" : "1px" 
					});
				}.bind(this));
			}
		}
	};

	/**
	 * _addRemoveTokenByKey
	 */
	ValueHelpDialog.prototype._addRemoveTokenByKey = function(key, oRow, add) {
		if (add) {
			this._oSelectedItems.add(key, oRow);
			this._addToken2Tokenizer(key, this._getFormattedTokenText(key), this._oSelectedTokens);
		} else {
			this._oSelectedItems.remove(key);
			this._removeTokenFromTokenizer(key, this._oSelectedTokens);
		}
	};
	
	/**
	 * _onCloseAndTakeOverValues
	 * Handler for the Ok close handling. The function prepares the list of all selected items and token and fires the Ok event.
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._onCloseAndTakeOverValues = function() {
		var that = this;
	
		var fnCallback = function() {
			var ltTokens = that._oSelectedItems.getSelectedItemsTokenArray(that.getKey(), that.getDescriptionKey(), that.getTokenDisplayBehaviour());

			if (that._oSelectedRanges) {
				var i = 0;
				// if the user has changed the ranges we return the new ranges from the selectedRanges
				for (var lRangeId in that._oSelectedRanges) {
					var loRange = that._oSelectedRanges[lRangeId];
					
					var lTokenValue = loRange.tokenValue;
					if (!lTokenValue) {
						lTokenValue = that._getFormattedRangeTokenText(loRange.operation, loRange.value1, loRange.value2, loRange.exclude, loRange.keyField);
					}

					if (!loRange._oGrid || loRange._oGrid.select.getSelected()) {
						var loToken = new sap.m.Token({
							key: "range_" + i}).data(
									"range", {
									"exclude": loRange.exclude,
									"operation": loRange.operation,
									"keyField": loRange.keyField,
									"value1": loRange.value1,
									"value2": loRange.value2
									});
						loToken.setText(lTokenValue);
						loToken.setTooltip(typeof lTokenValue === "string" ? lTokenValue : null);
						ltTokens.push(loToken);
						i++;
					}
				}
			}

			that.fireOk({
				"tokens": ltTokens
			});
		};

		this._validateRanges(fnCallback);
	};
	
	/**
	 * _onCancel
	 * Handler for the cancel button. The function fires the Cancel event.
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._onCancel = function() {
		this.fireCancel();
	};

	/**
	 * _onGo
	 * Handler for the Go button. Go button is used on Phone Device and calls the search of the integrated filterbar
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._onGo = function() {
		this._oFilterBar.search();
	};

	/**
	 * _onClear
	 * Handler for the Clear button. Clear button is used on Phone Device and calls the clear of the integrated filterbar.
	 * 
	 * @private
	 */
	ValueHelpDialog.prototype._onClear = function() {
		this._oFilterBar.clear();
	};
	
	/**
	 * _setTableTitle
	 * Setting the title of the table will remove the focus on a table cell. Because of this we check if the Title control exist and set the Text of
	 * the title instead.
	 *
	 * @param {string} sTitle Title text for the table
	 *
	 * @private
	 */
	ValueHelpDialog.prototype._setTableTitle = function(title) {
		if (sap.ui.Device.system.desktop && !(this._oTable instanceof sap.m.Table)) {
			if (this._oTable.getTitle()) {
				this._oTable.getTitle().setText(title); 
			} else {
				this._oTable.setTitle(title);
			}
		}
	};
	
	/**
	 * onAfterRendering
	 */
	ValueHelpDialog.prototype.onAfterRendering = function() {
		sap.m.Dialog.prototype.onAfterRendering.apply(this);
	
		if (this._oTable) {
			this._updateTitles();
		}

		if (!this._isPhone() &&  this.getContentHeight() === "") {
				if (this.getSupportRangesOnly() && (this.getMaxExcludeRanges() === "-1" || this.getMaxIncludeRanges() === "-1")) { //} && this._oSelectedTokens.getTokens().length <= 2) {
					// in case of a conditions only with multiple condition rows we give the dialog a height of 70%
					this.setContentHeight("70%");
				} else {
					// if the content height is not set we fetch the current clientHeight from the ScrollContainer and set it as fixed height
					var loResizeDomRef = this.getDomRef("scroll");
					var lResizeDomHeight = loResizeDomRef.clientHeight;
					this.setContentHeight(lResizeDomHeight + "px");
				}
				// correct the minRowCount
				if (sap.ui.table.Table && this._oTable && this._oTable instanceof sap.ui.table.Table) {
					this._oTable.setVisibleRowCountMode( sap.ui.table.VisibleRowCountMode.Auto);
				}
		}
	};
	
	/**
	 * _getDialogOffset
	 * Overwriting the Dialog._getDialogOffset function
	 * In our case we will return some other left and top margin values!
	 */
	ValueHelpDialog.prototype._getDialogOffset = function(windowWidth) {
		var lWindowWidth = windowWidth || this._$Window.width();
		
		var loScreenSize = {
			small: 600,
			large: 1024
		};
		
		var lRem = 1;
		if ((lWindowWidth > loScreenSize.small && lWindowWidth < loScreenSize.large) || lWindowWidth >= loScreenSize.large) {
			lRem = 2;
		}
		
		var remToPixelMargin = function(rem) {
			var lRemInPx = parseInt(window.getComputedStyle(document.body).fontSize, 10);
			return (rem * lRemInPx) * 2;
		};
		

		return {
			top: remToPixelMargin(lRem), 
			left: remToPixelMargin(lRem) 
		};
	};

	/**
	 * Exit ValueHelp Dialog
	 */
	ValueHelpDialog.prototype.exit = function() {
		var loDestroyObject = function(oObject) {
			if (oObject && oObject.destroy) {
				oObject.destroy();
			}
			return null;
		};
	
		this._oTokenizerGrid = loDestroyObject(this._oTokenizerGrid);
		this._oRanges = loDestroyObject(this._oRanges);
		this._oFilterPanel = loDestroyObject(this._oFilterPanel);
		if (this._bTableCreatedInternal) {
			this._oTable = loDestroyObject(this._oTable);
		}
		this._oTable = null;
		this.theTable = null;

		this._oTabBar = loDestroyObject(this._oTabBar);
		this._oMainListMenu = loDestroyObject(this._oMainListMenu);
		this._oVBox = loDestroyObject(this._oVBox);
		this._oVarManagment = loDestroyObject(this._oVarManagment);
		
		this._aRangeKeyFields = loDestroyObject(this._aRangeKeyFields);
		this._aIncludeRangeOperations = loDestroyObject(this._aIncludeRangeOperations);
		this._aExcludeRangeOperations = loDestroyObject(this._aExcludeRangeOperations);
	
		if (this._oFilterBar) {
			// this._oFilterBar.detachInitialise(this._handleFilterBarInitialize); ZEN
			this._oFilterBar = loDestroyObject(this._oFilterBar);
		}
	
		this._oRb = loDestroyObject(this._oRb);
		this._sTableTitle1 = loDestroyObject(this._sTableTitle1);
		this._sTableTitle2 = loDestroyObject(this._sTableTitle2);
		this._sTableTitleNoCount = loDestroyObject(this._sTableTitleNoCount);
	
		this._sValidationDialogTitle = loDestroyObject(this._sValidationDialogTitle);
		this._sValidationDialogMessage = loDestroyObject(this._sValidationDialogMessage);
		this._sValidationDialogFieldMessage = loDestroyObject(this._sValidationDialogFieldMessage);
	
		this._oSelectedItems = loDestroyObject(this._oSelectedItems);
		this._oSelectedRanges = loDestroyObject(this._oSelectedRanges);
		
		this._oButtonOk = loDestroyObject(this._oButtonOk);	
		this._oButtonCancel = loDestroyObject(this._oButtonCancel);
		if (this._oButtonGo) {
			this._oButtonGo = loDestroyObject(this._oButtonGo);
		}
		if (this._oButtonClear) {
			this._oButtonClear = loDestroyObject(this._oButtonClear);
		}
		if (this._oColSearchBox) {
			this._oColSearchBox = loDestroyObject(this._oColSearchBox);
		}
	};
	
	/**
	 * setRangeKeyFields
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
	};
	
	/**
	 * setIncludeRangeOperations
	 * Sets the array for the supported include range operations.
	 * 
	 * @public
	 * @since 1.24
	 * @param {sap.zen.ValueHelpRangeOperation[]} aOperation An array of range operations
	 * @param {string} sType the type for which the operations are defined
	 */
	ValueHelpDialog.prototype.setIncludeRangeOperations = function(aOperation, type) {
		type = type || "default";
		this._aIncludeRangeOperations[type] = aOperation;

		if (this._oFilterPanel) {
			this._oFilterPanel.setIncludeOperations(this._aIncludeRangeOperations[type], type);
		}
	};
	
	/**
	 * setExcludeRangeOperations
	 * Sets the array for the supported exclude range operations.
	 * 
	 * @public
	 * @since 1.24
	 * @param {sap.zen.ValueHelpRangeOperation[]} aOperation An array of range operations
	 * @param {string} sType the type for which the operations are defined
	 */
	ValueHelpDialog.prototype.setExcludeRangeOperations = function(tOperations, type) {
		type = type || "default";
		this._aExcludeRangeOperations[type] = tOperations;

		if (this._oFilterPanel) {
			this._oFilterPanel.setExcludeOperations(this._aExcludeRangeOperations[type], type);
		}
	};

	/**
	 * _convertValue2Object
	 * converts a string value (Token Value) back into a real object.
	 *
  	 * @private
	 * @param {string} sValue string representation of the value 
	 * @param {string} sType supported type string, date, time or boolean
	 * @returns {string|date|float} Value as object
	 */
	ValueHelpDialog.prototype._convertValue2Object = function(value, type) {
		if (!value) {
			return value;
		}
		
		var loValue = value;
		
		switch (type) {
			case "date":
				loValue = new Date(value);
				break;
				
			case "time":
				// value is a formatted Date-Time value
				loValue = new Date(value);
				if (!loValue || (loValue.getDate && Number.isNaN(loValue.getDate()))) { // value is a formatted Time value
					loValue = sap.ui.core.format.DateFormat.getTimeInstance().parse(value);
				}
				break;
				
			case "datetime":
				loValue = new Date(value);
				break;
				
			case "numeric":
				loValue = parseFloat(value);
				break;
				
			case "boolean":
				if (value === "") {
					loValue = null;
				} else {
					loValue = value == 'true';
				}
				break;
				
			default:
				break;
		}
		
		return loValue;
	};
	
	/**
	 * _getFormattedTokenText
	 * Creates and returns the token text for the selected item.
	 * 
	 * @private
	 * @param {string} sKey the key of the selectedItems item
	 * @returns {string} the token text for the selected items with the sKey
	 */
	ValueHelpDialog.prototype._getFormattedTokenText = function(key) {
		var loItem = this._oSelectedItems.getItem(key);
		var lTokenText = loItem[this.getDescriptionKey()];		
		var lDisplayKey = loItem["displaykey"];//ZEN
		
		if (!lDisplayKey) {//ZEN
			lDisplayKey = lTokenText;
		}//ZEN
		
		if (lTokenText === undefined) {
			if (typeof loItem === "string") {
				lTokenText = loItem;
			} else {
				lTokenText = "";//ZEN
			}
		}
		
		if (lTokenText === "") {
			lTokenText = lDisplayKey; //ZEN
		} else {
			if (lDisplayKey === lTokenText) {//ZEN
				lTokenText = "";//ZEN
			}//ZEN
			
			// format the token text 
			lTokenText = sap.ui.comp.util.FormatUtil.getFormattedExpressionFromDisplayBehaviour(this.getTokenDisplayBehaviour() ? this.getTokenDisplayBehaviour() : sap.ui.comp.smartfilterbar.ControlConfiguration.DISPLAYBEHAVIOUR.descriptionAndId, lDisplayKey, lTokenText);
		}
	
		return lTokenText;
	};
	
	/**
	 * _getFormattedRangeTokenText
	 * Creates and returns the token text for a range.
	 * 
	 * @private
	 * @param {string} sOperation the operation type sap.zen.ValueHelpRangeOperation
	 * @param {string} sValue1 text of the first range field
	 * @param {string} sValue2 text of the seoncd range field
	 * @param {boolean} bExclude indicates if the range is a Exclude range
	 * @param {string} sKeyField id
	 * @returns {string} the range token text
	 */
	ValueHelpDialog.prototype._getFormattedRangeTokenText = function(operation, value1, value2, exclude, keyField) {
		var lTokenText = "";
		
		var loFormatter = null;		
		var loCurrentKeyField = this._getKeyFieldByKey(keyField);
		if (loCurrentKeyField) {
			switch (loCurrentKeyField.type) {
				case "numc":
					loFormatter = {
						format: function(oValue) {
							return this.oType.formatValue(oValue, "string");
						},
						oType: new sap.ui.model.odata.type.String({}, loCurrentKeyField.formatSettings)
					};
					break;
					
				case "numeric":
					var loFloatFormatOptions;
					if (loCurrentKeyField.precision || loCurrentKeyField.scale) {
						loFloatFormatOptions = {};
						if (loCurrentKeyField.precision) {
							loFloatFormatOptions["maxIntegerDigits"] = parseInt(loCurrentKeyField.precision, 10);
						}
						if (loCurrentKeyField.scale) {
							loFloatFormatOptions["maxFractionDigits"] = parseInt(loCurrentKeyField.scale, 10);
						}
					}
					loFormatter = sap.ui.core.format.NumberFormat.getFloatInstance(loFloatFormatOptions);
					break;
					
				case "date":
					loFormatter = sap.ui.core.format.DateFormat.getDateInstance(jQuery.extend({}, loCurrentKeyField.formatSettings, {strictParsing: true}));
					value1 = new Date(value1);
					value2 = value2 !== "" ? new Date(value2) : null; // value2 can be "" string if the operation != BT.
					break;
					
				case "time":
					loFormatter = sap.ui.core.format.DateFormat.getTimeInstance(jQuery.extend({}, loCurrentKeyField.formatSettings, {strictParsing: true}));
					value1 = new Date(value1);
					value2 = value2 !== "" ? new Date(value2) : null;
					break;
					
				case "datetime":
					loFormatter = sap.ui.core.format.DateFormat.getDateTimeInstance(jQuery.extend({}, loCurrentKeyField.formatSettings, {strictParsing: true}));
					value1 = new Date(value1);
					value2 = value2 !== "" ? new Date(value2) : null;
					break;
					
				case "boolean":
					var ltBooleanValues = this._getBooleanValues();
					value1 = ltBooleanValues[value1 ? 2 :  1];
					value2 = ltBooleanValues[value2 ? 2 :  1];
					break;
					
				case "stringdate":
					if (sap.m.P13nConditionStringDateFormatter) {
						loFormatter = new sap.m.P13nConditionStringDateFormatter(jQuery.extend({}, loCurrentKeyField.formatSettings, {strictParsing: true }));
					}

					break;
					
				default:
					break;
			}
			
			if (loFormatter) {
				if (value1) {
					value1 = loFormatter.format(value1);
				}
				if (value2) {
					value2 = loFormatter.format(value2);
				}
			}
		}
		
		if (value1 !== "") {
			switch (operation) {
				case sap.zen.ValueHelpRangeOperation.Initial:
					lTokenText = "=''";
					break;
					
				case sap.zen.ValueHelpRangeOperation.EQ:
					lTokenText = "=" + value1;
					break;
					
				case sap.zen.ValueHelpRangeOperation.GT:
					lTokenText = ">" + value1;
					break;
					
				case sap.zen.ValueHelpRangeOperation.GE:
					lTokenText = ">=" + value1;
					break;
	
				case sap.zen.ValueHelpRangeOperation.LT:
					lTokenText = "<" + value1;
					break;
	
				case sap.zen.ValueHelpRangeOperation.LE:
					lTokenText = "<=" + value1;
					break;
	
				case sap.zen.ValueHelpRangeOperation.Contains:
					lTokenText = value1;
					if (!lTokenText.startsWith("*")) {
						lTokenText = "*" + lTokenText;
					}
					if (!lTokenText.endsWith("*")) {
						lTokenText = lTokenText + "*";
					}
					break;
	
				case sap.zen.ValueHelpRangeOperation.StartsWith:
					lTokenText = value1;
					if (!lTokenText.endsWith("*")) {
						lTokenText = lTokenText + "*";
					}
					break;
	
				case sap.zen.ValueHelpRangeOperation.EndsWith:
					lTokenText = value1;
					if (!lTokenText.startsWith("*")) {
						lTokenText = "*" + lTokenText;
					}
					break;
	
				case sap.zen.ValueHelpRangeOperation.BT:
					if (value2 !== "") {
						lTokenText = value1 + "..." + value2;
						break;
					}
					break;
					
				default:
					break;
			}
	
		}
	
		if (exclude && lTokenText !== "") {
			lTokenText = "!(" + lTokenText + ")";
		}
	
		if (this._aRangeKeyFields && this._aRangeKeyFields.length > 1 && loCurrentKeyField && loCurrentKeyField.label && lTokenText !== "") {
			lTokenText = loCurrentKeyField.label + ": " + lTokenText;
		}
	
		return lTokenText;
	};
	
	/**
	 * _isPhone
	 */
	ValueHelpDialog.prototype._isPhone = function() {
		return sap.ui.Device.system.phone;
	};
	
	/**
	 * _hasListeners
	 */
	ValueHelpDialog.prototype._hasListeners = function(eventName) {
		if (this._bTableCreatedInternal) {
			return false;
		}
		
		return this.hasListeners(eventName);
	};
	
	/**
	 * _rotateSelectionButtonIcon
	 */
	ValueHelpDialog.prototype._rotateSelectionButtonIcon = function(flag) {
		if (!sap.ui.Device.system.phone) {
			var loCtrl = sap.ui.getCore().byId(this.oSelectionButton.$("img")[0].id);
			if (flag) {
				loCtrl.addStyleClass("sapUiVHImageExpand");
			} else {
				loCtrl.removeStyleClass("sapUiVHImageExpand");
			}
		}
	};

    /**
	 * The range operations supported by the <code>ValueHelpDialog</code> control.
	 *
	 * @enum {string}
	 * @public
	 */
	sap.zen.ValueHelpRangeOperation = {
		/**
		 * The Between operation for the ranges.
		 *
		 * @public
		 */
		BT: "BT",
		/**
		 * The Equals operation for the ranges.
		 *
		 * @public
		 */
		EQ: "EQ",
		/**
		 * The Contains operation for the ranges.
		 *
		 * @public
		 */
		Contains: "Contains",
		/**
		 * The StartsWith operation for the ranges.
		 *
		 * @public
		 */
		StartsWith: "StartsWith",
		/**
		 * The EndsWith operation for the ranges.
		 *
		 * @public
		 */
		EndsWith: "EndsWith",
		/**
		 * The Less operation for the ranges.
		 *
		 * @public
		 */
		LT: "LT",
		/**
		 * The Less or equals operation for the ranges.
		 *
		 * @public
		 */
		LE: "LE",
		/**
		 * The Greater operation for the ranges.
		 *
		 * @public
		 */
		GT: "GT",
		/**
		 * The Between or equals operation for the ranges.
		 *
		 * @public
		 */
		GE: "GE",
		/**
		 * The Initial operation for the ranges.
		 *
		 * @private
		 */
		Initial: "Initial"
	};

	sap.zen._ValueHelpViewMode = {
		DESKTOP_LIST_VIEW: "DESKTOP_LIST_VIEW",
		DESKTOP_CONDITIONS_VIEW: "DESKTOP_CONDITIONS_VIEW",
		PHONE_MAIN_VIEW: "PHONE_MAIN_VIEW",
		PHONE_SEARCH_VIEW: "PHONE_SEARCH_VIEW",
		PHONE_LIST_VIEW: "PHONE_LIST_VIEW",
		PHONE_CONDITIONS_VIEW: "PHONE_CONDITIONS_VIEW"
	};

	return ValueHelpDialog;
});
