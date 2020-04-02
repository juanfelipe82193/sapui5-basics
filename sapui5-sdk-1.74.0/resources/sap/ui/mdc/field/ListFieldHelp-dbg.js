/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	'sap/ui/mdc/field/FieldHelpBase',
	'sap/ui/mdc/condition/Condition',
	'sap/ui/model/FormatException',
	'sap/ui/model/ParseException',
	'sap/ui/model/base/ManagedObjectModel',
	'sap/ui/base/ManagedObjectObserver',
	'sap/ui/mdc/library'
], function(
		FieldHelpBase,
		Condition,
		FormatException,
		ParseException,
		ManagedObjectModel,
		ManagedObjectObserver,
		library) {
	"use strict";

	var List;
	var DisplayListItem;
	var mLibrary;
	var Filter;

	/**
	 * Constructor for a new ListFieldHelp.
	 *
	 * This fieldHelp supports only single selection.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class A field help used in the <code>FieldFelp</code> association in <code>Field</code> controls that shows a list of items
	 * @extends sap.ui.mdc.field.FieldHelpBase
	 * @version 1.74.0
	 * @constructor
	 * @private
	 * @since 1.54.0
	 * @alias sap.ui.mdc.field.ListFieldHelp
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ListFieldHelp = FieldHelpBase.extend("sap.ui.mdc.field.ListFieldHelp", /** @lends sap.ui.mdc.field.ListFieldHelp.prototype */
	{
		metadata: {
			library: "sap.ui.mdc",
			aggregations: {
				/**
				 * items of the Field help
				 */
				items: {
					type: "sap.ui.core.ListItem",
					multiple: true,
					singularName : "item"
				}
			},
			defaultAggregation: "items"
		}
	});

	ListFieldHelp.prototype.init = function() {

		FieldHelpBase.prototype.init.apply(this, arguments);

		this._oManagedObjectModel = new ManagedObjectModel(this);

		this._oObserver = new ManagedObjectObserver(_observeChanges.bind(this));

		this._oObserver.observe(this, {
			properties: ["filterValue", "conditions"],
			aggregations: ["items"]
		});

		this._oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");

	};

	ListFieldHelp.prototype.exit = function() {

		FieldHelpBase.prototype.exit.apply(this, arguments);

		this._oManagedObjectModel.destroy();
		delete this._oManagedObjectModel;

		this._oObserver.disconnect();
		this._oObserver = undefined;

	};

	ListFieldHelp.prototype._createPopover = function() {

		var oPopover = FieldHelpBase.prototype._createPopover.apply(this, arguments);

		if ((!List || !DisplayListItem || !mLibrary) && !this._bListRequested) {
			List = sap.ui.require("sap/m/List");
			DisplayListItem = sap.ui.require("sap/m/DisplayListItem");
			mLibrary = sap.ui.require("sap/m/library");
			Filter = sap.ui.require("sap/ui/model/Filter");
			if (!List || !DisplayListItem || !mLibrary) {
				sap.ui.require(["sap/m/List", "sap/m/DisplayListItem", "sap/m/library", "sap/ui/model/Filter"], _ListLoaded.bind(this));
				this._bListRequested = true;
			}
		}

		if (oPopover) { // empty if loaded async
			var oField = this._getField();
			if (oField) {
				oPopover.setInitialFocus(this._getControlForSuggestion());
			}

			_createList.call(this);
		}

		return oPopover;

	};

	function _createList() {

		if (!this._oList && List && DisplayListItem && mLibrary && !this._bListRequested) {
			var oItemTemplate = new DisplayListItem({
				type: mLibrary.ListType.Active,
				label: "{$field>text}",
				value: "{$field>additionalText}"
			});

			var oFilter = new Filter("text", _suggestFilter.bind(this));

			this._oList = new List(this.getId() + "-List", {
				width: "100%",
				showNoData: false,
				mode: mLibrary.ListMode.SingleSelectMaster,
				rememberSelections: false,
				items: {path: "$field>items", template: oItemTemplate, filters: oFilter},
				itemPress: _handleItemPress.bind(this) // as selected item can be pressed
			});

			this._oList.setModel(this._oManagedObjectModel, "$field");
			this._oList.bindElement({ path: "/", model: "$field" });
			_updateSelection.call(this);

			this._setContent(this._oList);

			if (this._bNavigate) {
				this._bNavigate = false;
				this.navigate(this._iStep);
				this._iStep = null;
			}
		}

	}

	function _ListLoaded(fnList, fnDisplayListItem, fnLibrary, fnFilter) {

		List = fnList;
		DisplayListItem = fnDisplayListItem;
		mLibrary = fnLibrary;
		Filter = fnFilter;
		this._bListRequested = false;

		if (!this._bIsBeingDestroyed) {
			_createList.call(this);
		}

	}

	ListFieldHelp.prototype.open = function(bSuggestion) {

		// focus should stay on Field
		var oPopover = this.getAggregation("_popover");
		if (oPopover) {
			oPopover.setInitialFocus(this._getControlForSuggestion());
		}

		FieldHelpBase.prototype.open.apply(this, arguments);

		return this;

	};

	ListFieldHelp.prototype._handleAfterClose = function(oEvent) {

		FieldHelpBase.prototype._handleAfterClose.apply(this, arguments);

		if (this._bUpdateFilterAfterClose) {
			this._bUpdateFilterAfterClose = false;
			_updateFilter.call(this);
		}

	};

	function _observeChanges(oChanges) {

		if (oChanges.object === this) {
			// it's the FieldHelp
			if (oChanges.name === "items") {
				if (oChanges.mutation === "insert") {
					this._oObserver.observe(oChanges.child, {properties: true});
				} else {
					this._oObserver.unobserve(oChanges.child);
				}
				this.fireDataUpdate();
			}

			if (oChanges.name === "conditions") {
				if (!this._bConditionUpdate) {
					_updateSelection.call(this);
				}
			}

			if (oChanges.name === "filterValue") {
				if (this._oList) {
					if (this._bClosing) {
						this._bUpdateFilterAfterClose = true;
					} else {
						_updateFilter.call(this);
					}
				}
			}
		} else {
			// must be an item
			this.fireDataUpdate();
		}

	}

	ListFieldHelp.prototype.openByTyping = function() {

		return true;

	};

	ListFieldHelp.prototype.navigate = function(iStep) {

		var oPopover = this._getPopover();

		if (!oPopover || !this._oList) {
			// Popover or List not loaded right now
			this._bNavigate = true;
			this._iStep = iStep;
			return;
		}

		var oSelectedItem = this._oList.getSelectedItem();
		var aItems = this._oList.getItems();
		var iItems = aItems.length;
		var iSelectedIndex = 0;

		if (oSelectedItem) {
			iSelectedIndex = this._oList.indexOfItem(oSelectedItem);
			iSelectedIndex = iSelectedIndex + iStep;
			if (iSelectedIndex < 0) {
				iSelectedIndex = 0;
			} else if (iSelectedIndex >= iItems - 1) {
				iSelectedIndex = iItems - 1;
			}
		} else if (iStep >= 0){
			iSelectedIndex = iStep - 1;
		} else {
			iSelectedIndex = iItems + iStep;
		}

		var oItem = aItems[iSelectedIndex];
		if (oItem && oItem !== oSelectedItem) {
			var oOriginalItem = _getOriginalItem.call(this, oItem);
			var vKey = _getKey.call(this, oOriginalItem);
			oItem.setSelected(true);
			var oCondition = _setConditions.call(this, vKey, oItem.getLabel());

			if (!oPopover.isOpen()) {
				this.open();
			}

			this.fireNavigate({key: vKey, value: oItem.getLabel(), condition: oCondition});
		}

	};

	ListFieldHelp.prototype.getTextForKey = function(vKey) {

		if (vKey === null || vKey === undefined) { // TODO: support boolean?
			return null;
		}

		var aItems = this.getItems();

		for (var i = 0; i < aItems.length; i++) {
			var oItem = aItems[i];
			if (_getKey.call(this, oItem) === vKey) {
				return oItem.getText();
			}
		}

		if (vKey === "") {
			// empty key and no item with empty key
			return null;
		}

		var sError = this._oResourceBundle.getText("valuehelp.VALUE_NOT_EXIST", [vKey]);
		throw new FormatException(sError);

	};

	ListFieldHelp.prototype.getKeyForText = function(sText) {

		if (!sText) {
			return null;
		}

		var aItems = this.getItems();

		for (var i = 0; i < aItems.length; i++) {
			var oItem = aItems[i];
			if (oItem.getText() === sText) {
				return _getKey.call(this, oItem);
			}
		}

		var sError = this._oResourceBundle.getText("valuehelp.VALUE_NOT_EXIST", [sText]);
		throw new ParseException(sError);

	};

	function _handleItemPress(oEvent) {
		var oItem = oEvent.getParameter("listItem");
		var bSelected = oItem.getSelected();

		if (bSelected) {
			var oOriginalItem = _getOriginalItem.call(this, oItem);
			var vKey = _getKey.call(this, oOriginalItem);
			_setConditions.call(this, vKey, oItem.getLabel());
			this.close();
			this.fireSelect({conditions: this.getConditions(), add: true});
		}
	}

	// returns ListFieldHelp item for inner list item
	function _getOriginalItem(oItem) {

		var sPath = oItem.getBindingContextPath();
		return this._oManagedObjectModel.getProperty(sPath);

	}

	function _updateFilter() {

		var oBinding = this._oList.getBinding("items");
		oBinding.update();
		this._oList.updateItems();
		this._oList.invalidate();
		_updateSelection.call(this); // to update selection

	}

	function _suggestFilter(sText) {

		var sFilterValue = this.getFilterValue();

		if (!sFilterValue || (typeof sFilterValue === "string" && sText.toLowerCase().startsWith(sFilterValue.toLowerCase()))) {
			return true;
		} else {
			return false;
		}

	}

	function _updateSelection() {

		if (this._oList) {
			var aConditions = this.getConditions();
			var vSelectedKey;

			if (aConditions.length > 0 && (aConditions[0].operator === "EEQ" || aConditions[0].operator === "EQ")) {
				vSelectedKey = aConditions[0].values[0];
			}

			var aItems = this._oList.getItems();
			for (var i = 0; i < aItems.length; i++) {
				var oItem = aItems[i];
				var oOriginalItem = _getOriginalItem.call(this, oItem);
				if (_getKey.call(this, oOriginalItem) === vSelectedKey) {
					oItem.setSelected(true);
				} else {
					oItem.setSelected(false);
				}
			}
		}

	}

	function _getKey(oItem) {

		// as key could have internally another type - use initial value of binding
		// TODO: better logic?
		var oBinding = oItem.getBinding("key");
		if (oBinding) {
			return oBinding.getInternalValue();
		} else {
			return oItem.getKey();
		}

	}

	function _setConditions(vKey, sValue) {

		this._bConditionUpdate = true;

		var oCondition = Condition.createItemCondition(vKey, sValue);
		this.setProperty("conditions", [oCondition], true);

		this._bConditionUpdate = false;

		return oCondition;

	}

	return ListFieldHelp;

});
