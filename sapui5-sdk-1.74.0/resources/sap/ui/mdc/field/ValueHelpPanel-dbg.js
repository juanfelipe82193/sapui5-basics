/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/XMLComposite",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/base/ManagedObjectObserver",
	"sap/base/strings/formatMessage",
	"sap/ui/model/resource/ResourceModel",
	"sap/m/Tokenizer"
	], function(
			XMLComposite,
			JSONModel,
			Filter,
			ManagedObjectObserver,
			formatMessage,
			ResourceModel,
			Tokenizer
		) {
	"use strict";

	var ValueHelpPanel = XMLComposite.extend("sap.ui.mdc.field.ValueHelpPanel", {
		metadata: {
			properties: {
				showTokenizer: {
					type: "boolean",
					group: "Data",
					defaultValue: true
				},
				showFilterbar: {
					type: "boolean",
					group: "Data",
					defaultValue: true
				},

				/**
				 * Sets the conditions that represents the selected values of the help.
				 *
				 * @since 1.62.0
				 */
				conditions: {
					type: "object[]",
					group: "Data",
					defaultValue: [],
					byValue: true
				},

				/**
				 * Sets the conditions for the SearchField.
				 *
				 * @since 1.62.0
				 */
				filterConditions: {
					type: "object[]",
					group: "Data",
					defaultValue: []
				},

				/**
				 * If set, a SearchField will be shown.
				 *
				 * @since 1.74.0
				 */
				searchEnabled: {
					type: "boolean",
					group: "Data",
					defaultValue: true
				},

				/**
				 * The formatOptions for the ConditionType used to format tokens
				 *
				 * @since 1.62.0
				 */
				formatOptions: {
					type: "object",
					defaultValue: {}
				},

				/**
				 * Internal property to bind corresponding controls to the visibility of the FilterBar section
				 */
				_filterBarVisible: {
					type: "boolean",
					group: "Appearance",
					defaultValue: false,
					visibility: "hidden"
				}
			},
			events: {
				/**
				 * This event is fired when a search is triggered from the SearchField
				 *
				 * @since 1.72.0
				 */
				search: {
				}
			}

		},
		fragment: "sap.ui.mdc.field.ValueHelpPanel",

		init: function() {
			var oManagedObjectModel = this._getManagedObjectModel();
			oManagedObjectModel.setSizeLimit(1000000); // TOTO: better solution to allow more than 100 Tokens

			if (!this._oTokenizer) {
				this._oTokenizer = this.byId("VHPTokenizer");
				this._oTokenizer.updateTokens = function() {
					Tokenizer.prototype.updateTokens.apply(this, arguments);
					this.invalidate(); // as VHP could be supressed but Tokenizer needs to be updated
				};
				this._oTokenizer._oScroller.setHorizontal(false);
				this._oTokenizer._oScroller.setVertical(true); // enable vertical scrolling
			}
			this._oTokenizerPanel = this.byId("VHPTokenizerPanel");

			// TOCO: better logic to get FieldPath or decide when to render a SearchField in FieldBase
			var oSearchField = this.byId("SearchField");
			oSearchField.getFieldPath = _getSearchFieldPath.bind(this);

			this._oAdvButton = this.byId("AdvancedFilter");

			// overwrite getContentAreas to not change Parent of Table and FilterBar
			this._oFilterSplitter = this.byId("filterbarSplitter");
			this._oFilterSplitter._oValueHelpPanel = this;
			this._oFilterSplitter.getContentAreasOriginal = this._oFilterSplitter.getContentAreas;
			this._oFilterSplitter.getContentAreas = function() {
				var aContentAreas = [];

				if (this._oValueHelpPanel._oFilterbar && this._oValueHelpPanel.getProperty("_filterBarVisible")) {
					aContentAreas = this.getContentAreasOriginal();
				}

				if (this._oValueHelpPanel._oTable) {
					aContentAreas.push(this._oValueHelpPanel._oTable);
				}

				return aContentAreas;
			};
			this._oFilterVBox = this.byId("filterbarVBox");
			this._oFilterVBox._oValueHelpPanel = this;
			this._oFilterVBox.getItemsOriginal = this._oFilterVBox.getItems;
			this._oFilterVBox.getItems = function() {
				var aItems = this.getItemsOriginal();
				if (this._oValueHelpPanel._oFilterbar && this._oValueHelpPanel.getProperty("_filterBarVisible")) {
					aItems.push(this._oValueHelpPanel._oFilterbar);
				}
				return aItems;
			};

			this._oObserver = new ManagedObjectObserver(_observeChanges.bind(this));

			this._oObserver.observe(this, {
				properties: ["formatOptions", "showFilterbar", "showTokenizer", "_filterBarVisible"]
			});

			this._oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");

		},

		exit: function() {
			// if tokenizer is not part of the VHP content
			if (!this.getShowTokenizer()) {
				this._oTokenizerPanel.destroy();
			}

			if (this._oDefineConditionPanel && !this._oDefineConditionPanel.getParent()) {
				//DefineConditionPanel never displayed -> destroy it now
				this._oDefineConditionPanel.destroy();
			}

			this._oObserver.disconnect();
			this._oObserver = undefined;
		},

		onBeforeRendering: function() {

			if (!this.getModel("$i18n")) {
				// if ResourceModel not provided from outside create own one
				this.setModel(new ResourceModel({ bundleName: "sap/ui/mdc/messagebundle", async: false }), "$i18n");
			}

		},

		setFilterbar: function(oFilterbar) {

			var bShowFilterBar = this.getShowFilterbar();

			if (this._oFilterbar) {
				this._oFilterbar.removeStyleClass("sapMdcValueHelpPanelFilterbar");
				if (this._bFilterbarParentSet) {
					this._oFilterbar.setParent();
					delete this._bFilterbarParentSet;
				}
			}
			this._oFilterbar = oFilterbar;

			if (oFilterbar) { //If a new Filterbar exist, set the layoutData and add it into the splitter
				// give the Filterbar a left/top margin when we show it in the splitter container
				oFilterbar.addStyleClass("sapMdcValueHelpPanelFilterbar");

				if (!oFilterbar.getParent()) {
					// if not in control tree set as child
					oFilterbar.setParent(this);
					this._bFilterbarParentSet = true;
				}

				// TODO: hack for FlexBoxStylingHelper.writeStyle in IE11
				oFilterbar.getParent().getDirection = this._oFilterVBox.getDirection.bind(this._oFilterVBox);
			}

			//update the IconTabbar header visibility
			var oITBar = this.byId("iconTabBar");
			oITBar.getItems()[0].setVisible(oITBar.getItems()[0].getContent().length > 0);
			oITBar.setSelectedKey("selectFromList");
			this._updateITBHeaderVisiblity();

			this.setProperty("_filterBarVisible", bShowFilterBar && !!this._oFilterbar, true);

		},

		setTable: function(oTable) {
			if (this._oTable) {
				if (this._bTableParentSet && this._oTable.getParent()) {
					this._oTable.setParent();
				}
				delete this._bTableParentSet;
			}
			this._oTable = oTable;

			if (oTable) { //If a new table exist, set the layoutData and add it into the splitter
				oTable.setLayoutData(new sap.ui.layout.SplitterLayoutData({
					size: "auto"
				}));

				if (!oTable.getParent()) {
					// if not in control tree set as child
					oTable.setParent(this);
					this._bTableParentSet = true;
				}
			}
			this._oFilterSplitter.invalidate();

			//update the IconTabbar header visibility
			var oITBar = this.byId("iconTabBar");
			oITBar.getItems()[0].setVisible(oITBar.getItems()[0].getContent().length > 0);
			oITBar.setSelectedKey("selectFromList");
			this._updateITBHeaderVisiblity();
		},

		getTable: function() {
			if (this._oTable) {
				return this._oTable;
			} else {
				return undefined;
			}
		},

		setDefineConditions: function(oDefineConditionPanel) {
			var oITBar = this.byId("iconTabBar");
			if (this._oDefineConditionPanel) {
				oITBar.getItems()[1].removeContent(this._oDefineConditionPanel);
				this._oDefineConditionPanel.destroy();
			}
			this._oDefineConditionPanel = oDefineConditionPanel;

			//update the IconTabbar header visibility
			oITBar.getItems()[1].setVisible(!!this._oDefineConditionPanel);
			this._updateITBHeaderVisiblity();
		},

		_updateITBHeaderVisiblity: function() {
			var oITBar = this.byId("iconTabBar");
			if (oITBar.getItems()[0].getVisible() && oITBar.getItems()[1].getVisible()) {
				oITBar.removeStyleClass("sapMdcNoHeader");
			} else {
				oITBar.addStyleClass("sapMdcNoHeader");
			}

			if (oITBar.getItems()[1].getVisible() && oITBar.getSelectedKey() !== "selectFromList") {
				_bindDefineConditionPanel.call(this);
			}

		},

		_handleTokenUpdate: function(oEvent) {

			if (oEvent.getParameter("type") === "removed") {
				var aRemovedTokens = oEvent.getParameter("removedTokens");
				var aConditions = this.getConditions();
				var i;

				for (i = 0; i < aRemovedTokens.length; i++) {
					var oRemovedToken = aRemovedTokens[i];
					var sPath = oRemovedToken.getBindingContext("$this").sPath;
					var iIndex = parseInt(sPath.slice(sPath.lastIndexOf("/") + 1));
					aConditions[iIndex].delete = true;
				}

				for (i = aConditions.length - 1; i >= 0; i--) {
					if (aConditions[i].delete) {
						aConditions.splice(i, 1);
					}
				}

				this.setProperty("conditions", aConditions, true); // do not invalidate whole panel
			}

		},

		_handleCloseFilterbar: function(oEvent) {
			this._oAdvButton.setPressed(false);
			this._oAdvButton.focus(); // as close button will disappear
		},

		iconTabSelect: function(oEvent) {

			var sKey = oEvent.getParameter("key");
			if (sKey === "defineCondition") {
				_bindDefineConditionPanel.call(this);
			}

		},

		_formatListTabTitle: function(sText, aConditions) {

			var iCount = 0;

			for (var i = 0; i < aConditions.length; i++) {
				var oCondition = aConditions[i];
				if (oCondition.isEmpty !== true && oCondition.operator === "EEQ") {
					iCount++;
				}
			}

			if (iCount === 0) {
				// in case of no items do not show a number
				sText = this._oResourceBundle.getText("valuehelp.SELECTFROMLISTNONUMBER");
			}

			return formatMessage(sText, iCount);

		},

		_formatDefineTabTitle: function(sText, aConditions) {

			var iCount = 0;

			for (var i = 0; i < aConditions.length; i++) {
				var oCondition = aConditions[i];
				if (oCondition.isEmpty !== true && oCondition.operator !== "EEQ") {
					iCount++;
				}
			}

			if (iCount === 0) {
				// in case of no items do not show a number
				sText = this._oResourceBundle.getText("valuehelp.DEFINECONDITIONSNONUMBER");
			}

			return formatMessage(sText, iCount);

		},

		_formatTokenizerTitle: function(sText, aConditions) {

			var iCount = 0;

			for (var i = 0; i < aConditions.length; i++) {
				var oCondition = aConditions[i];
				if (oCondition.isEmpty !== true) {
					iCount++;
				}
			}

			if (iCount === 0) {
				// in case of no items do not show a number
				sText = this._oResourceBundle.getText("valuehelp.TOKENIZERTITLENONUMBER");
			}

			return formatMessage(sText, iCount);

		},

		_handleSearch: function(oEvent) {

			this.fireSearch();

		}

	});

	function _observeChanges(oChanges) {

		if (oChanges.name === "formatOptions") {
			var oBindingInfo = this._oTokenizer.getBindingInfo("tokens");
			if (oBindingInfo && oBindingInfo.template) {
				oBindingInfo = oBindingInfo.template.getBindingInfo("text");
				if (oBindingInfo && oBindingInfo.type) {
					oBindingInfo.type.setFormatOptions(oChanges.current);
				}
			}
		}

		if (oChanges.name === "showTokenizer") {
			var oSplitter = this.byId("rootSplitter");
			var oListBinding = this._oTokenizer.getBinding("tokens");
			if (oChanges.current) {
				oListBinding.resume();
				oSplitter.insertContentArea(this._oTokenizerPanel, 1);
			} else {
				oListBinding.suspend(); // don't create Tokens
				oSplitter.removeContentArea(this._oTokenizerPanel);
			}
		}

		if (oChanges.name === "showFilterbar") {
			this.setProperty("_filterBarVisible", oChanges.current && !!this._oFilterbar, true);
		}

		if (oChanges.name === "_filterBarVisible") {
			this._oFilterSplitter.invalidate();
		}

	}

	function _getSearchFieldPath() {

		var sBindingPath = this.getBindingPath("filterConditions");
		if (sBindingPath && sBindingPath.startsWith("/conditions/")) {
			return sBindingPath.slice(12);
		} else {
			return "";
		}

	}

	function _bindDefineConditionPanel() {

		if (this._oDefineConditionPanel) {
			if (!this._oDefineConditionPanel.getModel("$VHP")) {
				var oManagedObjectModel = this._getManagedObjectModel();
				this._oDefineConditionPanel.setModel(oManagedObjectModel, "$VHP");
				var oMetadata = this._oDefineConditionPanel.getMetadata();
				if (oMetadata.hasProperty("formatOptions") && !this._oDefineConditionPanel.getBindingPath("formatOptions") && this._oDefineConditionPanel.isPropertyInitial("formatOptions")) {
					this._oDefineConditionPanel.bindProperty("formatOptions", {path: "$VHP>/formatOptions"});
				}
				if (oMetadata.hasProperty("conditions") && !this._oDefineConditionPanel.getBindingPath("conditions") && this._oDefineConditionPanel.isPropertyInitial("conditions")) {
					this._oDefineConditionPanel.bindProperty("conditions", {path: "$VHP>/conditions"});
				}
			}
			// add content only after binding, otherwise onBeforeRendering type is missing
			var oITBar = this.byId("iconTabBar");
			oITBar.getItems()[1].addContent(this._oDefineConditionPanel);
		}

	}

	return ValueHelpPanel;

});
