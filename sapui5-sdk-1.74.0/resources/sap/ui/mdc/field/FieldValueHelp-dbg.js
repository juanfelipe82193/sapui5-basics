/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	'sap/ui/mdc/library',
	'sap/ui/mdc/field/FieldHelpBase',
	'sap/ui/mdc/condition/Condition',
	'sap/ui/base/ManagedObjectObserver',
	'sap/base/util/ObjectPath',
	'sap/base/util/deepEqual',
	'sap/base/util/merge',
	'sap/ui/model/resource/ResourceModel'
], function(
		library,
		FieldHelpBase,
		Condition,
		ManagedObjectObserver,
		ObjectPath,
		deepEqual,
		merge,
		ResourceModel
	) {
	"use strict";

	var OutParameterMode = library.OutParameterMode;
	var Dialog;
	var Button;
	var ValueHelpPanel;
	var DefineConditionPanel;
	var ConditionModel;
	var ManagedObjectModel;
	var FilterOperatorUtil;

	/**
	 * Constructor for a new FieldValueHelp.
	 *
	 * If a more complex value help is needed the application can put a complete table into this field help.
	 * As in this case the behavior depends on the used control a wrapper is used between.
	 *
	 * <b>Note:</b> If a FieldValueHelp is connected to a field it gets the BindingContext of this field.
	 * So the in- and out-parameters are done in this context. So bind the content table in a way that it finds
	 * its data also in the BindingContext of the field.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class A field help used in the <code>FieldFelp</code> association in <code>Field</code> controls that shows a value help dialog
	 * @extends sap.ui.mdc.field.FieldHelpBase
	 * @version 1.74.0
	 * @constructor
	 * @private
	 * @since 1.58.0
	 * @alias sap.ui.mdc.field.FieldValueHelp
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var FieldValueHelp = FieldHelpBase.extend("sap.ui.mdc.field.FieldValueHelp", /** @lends sap.ui.mdc.field.FieldValueHelp.prototype */
	{
		metadata: {
			library: "sap.ui.mdc",
			properties: {

				/**
				 * The fields for what the content should filter. If not set a $search request is used for filtering.
				 */
				filterFields: {
					type: "string",
					defaultValue: "$search"
				},

				/**
				 * The path of the key field in the content binding.
				 * If a table is used as content this is the binding path of the key of the items.
				 *
				 * If not set the FieldPath of the assigned field will be used.
				 */
				keyPath: {
					type: "string",
					defaultValue: ""
				},

				/**
				 * The path of the description field in the content binding.
				 * If a table is used as content this is the binding path of the description of the items.
				 */
				descriptionPath: {
					type: "string",
					defaultValue: ""
				},

				/**
				 * if set, a condition panel is shown
				 *
				 * @since 1.60.0
				 */
				showConditionPanel: {
					type: "boolean",
					defaultValue: false
				},

				/**
				 * Title text appears in the Dialog header.
				 *
				 * @since 1.60.0
				 */
				title: {
					type: "string",
					group: "Appearance",
					defaultValue: ""
				},

				/**
				 * if set, the FieldHelp don't open a value help dialog, just displays the content.
				 * This means, it behaves like the suggestion but without any filter.
				 *
				 * @since 1.60.0
				 */
				noDialog: {
					type: "boolean",
					group: "Appearance",
					defaultValue: false
				}
			},
			aggregations: {
				/**
				 * content of the Field help
				 *
				 * To support different types of content (e.g sap.m.Table) a specific wrapper is used
				 * to map the functionality of the content control to the field help. The content control
				 * is assigned to the wrapper.
				 *
				 * To allow filtering a ListBinding must be used in the content.
				 * If the ListBinding is initially created to be suspended no filtering or selection is triggered. (The table is empty.)
				 * On an user interaction (type ahead, search request or search from FilterBar) the ListBinding is resumed so the filter
				 * is executed. (If FilterBar is in LiveMode and In-Parameters are used this also executes a filter.)
				 *
				 * @since 1.60.0
				 */
				content: {
					type: "sap.ui.mdc.field.FieldValueHelpContentWrapperBase",
					multiple: false
				},

				/**
				 * FilterBar of the Field help
				 *
				 * @since 1.60.0
				 */
				filterBar: {
					type: "sap.ui.mdc.FilterBar",
					multiple: false
				},

				/**
				 * Sets the in-parameters of a fieldHelp.
				 *
				 * If set, the fieldHelp reads the data of these entities in the model and uses it to filter in the value help.
				 * @since 1.66.0
				 */
				inParameters: {
					type: "sap.ui.mdc.field.InParameter",
					group: "Data",
					multiple: true
				},

				/**
				 * Sets the out-parameters of a fieldHelp.
				 *
				 * If set, the fields sets the data of these entities in the model according to the selected values.
				 * @since 1.66.0
				 */
				outParameters: {
					type: "sap.ui.mdc.field.OutParameter",
					group: "Data",
					multiple: true
				},

				/**
				 * internal dialog
				 */
				_dialog: {
					type: "sap.m.Dialog",
					multiple: false,
					visibility: "hidden"
				}
			},
			defaultAggregation: "content",
			events: {
				/**
				 * This event is fired when a description for a key or a key for a description is requested and
				 * no data table with list binding is assigned.
				 *
				 * This is the case if a <code>Field</code> or <code>FilterField</code> shows the description of the value
				 * and the value is formatted or a new input is parsed.
				 *
				 * @since 1.67.0
				 */
				dataRequested: {}
			}
		}
	});

	FieldValueHelp.prototype.init = function() {

		FieldHelpBase.prototype.init.apply(this, arguments);

		this._oObserver = new ManagedObjectObserver(_observeChanges.bind(this));

		this._oObserver.observe(this, {
			properties: ["filterValue", "conditions", "showConditionPanel", "title", "filterFields"],
			aggregations: ["content", "filterBar", "inParameters"]
		});

	};

	FieldValueHelp.prototype.exit = function() {

		FieldHelpBase.prototype.exit.apply(this, arguments);

		if (this._oManagedObjectModel) {
			this._oManagedObjectModel.destroy();
			delete this._oManagedObjectModel;
		}

		if (this._oFilterConditionModel) {
			this._oFilterConditionModel.destroy();
			delete this._oFilterConditionModel;
		}

		this._oObserver.disconnect();
		this._oObserver = undefined;

	};

	FieldValueHelp.prototype.invalidate = function(oOrigin) {

		if (oOrigin) {
			var oDialog = this.getAggregation("_dialog");
			var oFilterBar = this.getFilterBar();
			if ((oDialog && oOrigin === oDialog) ||
					(oFilterBar && oOrigin === oFilterBar)) {
				if (oOrigin.bOutput && !this._bIsBeingDestroyed) {
					// Content changed but no UiArea found, this should not happen.
					// now invalidate parent to trigger re-rendering somehow.
					var oParent = this.getParent();
					if (oParent) {
						oParent.invalidate(this);
					}
				}
				return;
			}
		}

		FieldHelpBase.prototype.invalidate.apply(this, arguments);

	};

	FieldValueHelp.prototype.connect = function(oField) {

		FieldHelpBase.prototype.connect.apply(this, arguments);

		// update BindingContext for in/out-parameter
		_updateBindingContext.call(this);

		// new Field might not support define conditions
		_toggleDefineConditions.call(this, this.getShowConditionPanel());

		return this;

	};

	FieldValueHelp.prototype.getIcon = function() {

		if (this.getNoDialog()) {
			return "sap-icon://slim-arrow-down";
		} else {
			return "sap-icon://value-help";
		}

	};

	FieldValueHelp.prototype._createPopover = function() {

		var oPopover = FieldHelpBase.prototype._createPopover.apply(this, arguments);

		if (oPopover) { // empty if loaded async
			var oField = this._getField();
			if (oField) {
				oPopover.setInitialFocus(this._getControlForSuggestion());
			}

			// use Wrapper content in Popover -> overwrite hook
			var oWrapper = this.getContent();
			if (oWrapper) {
				oWrapper.initialize(true);
			}

			oPopover._getAllContent = function() {
				var oParent = this.getParent();
				var aContent = [];

				if (oParent) {
					var oContent = _getSuggestionContent.call(oParent);
					if (oContent) {
						aContent.push(oContent);
					}
				}
				return aContent;
			};

			if (this._bNavigate) {
				this._bNavigate = false;
				this.navigate(this._iStep);
				this._iStep = null;
			}
		}

		return oPopover;

	};

	FieldValueHelp.prototype._handleAfterOpen = function(oEvent) {

		FieldHelpBase.prototype._handleAfterOpen.apply(this, arguments);

		var oWrapper = this.getContent();
		if (oWrapper) {
			oWrapper.fieldHelpOpen(true);
		}

	};

	FieldValueHelp.prototype.open = function(bSuggestion) {

		if (this.getNoDialog() && !bSuggestion) {
			bSuggestion = true;
		}

		this._bUseFilterBar = !bSuggestion; // FilterBar should be used for filtering (if exist)

		// as BindingContext of Field might change (happens in table) update if needed
		_updateBindingContext.call(this);

		var oWrapper = this.getContent();

		if (oWrapper && oWrapper.getFilterEnabled() && !this._bNavigateRunning) { //in running navigation already filtered
			if (!oWrapper.isSuspended()) {
				// apply use in-parameter filters
				this._bApplyFilter = true;
			}
			if (!this._oFilterConditionModel) {
				_createFilterConditionModel.call(this);
			} else {
				_setInParameterFilters.call(this);
			}
		}

		if (this._bUpdateFilterAfterClose) {
			// filter was updated by closing -> perform it now
			this._bUpdateFilterAfterClose = false;
			_filterContent.call(this, this.getFilterValue());
		}

		var oPopover = this.getAggregation("_popover");

		if (bSuggestion) {
			this._bApplyFilter = true; // applyFilter even if suspended (resume)

			// remove all filters from FilterBar (not used in suggestion). But let in-parameter filters active
			_removeFilterBarFilters.call(this);

			if (!oWrapper) {
				// do not create Popover if no content
				this._bOpenIfContent = true;
				this.fireOpen({suggestion: bSuggestion});
			} else {
				// focus should stay on Field
				if (oPopover) {
					oPopover.setInitialFocus(this._getControlForSuggestion());
				}

				//call the fieldHelpOpen before the open to update the table width and avoid rerender and flickering of suggest popover
				oWrapper.fieldHelpOpen(bSuggestion);

				if (this._oFilterConditionModel && !this.getFilterValue() && !this._bNavigateRunning) {
					// if no filter call filters to search for all (use in-parameters)
					// use checkUpdate to call _applyFilters not twice
					this._oFilterConditionModel.checkUpdate(true, true);
				}

				FieldHelpBase.prototype.open.apply(this, [bSuggestion]);
			}
		} else {
			// use FilterBar filters
			_updateFiltersFromFilterBar.call(this);

			if (oPopover) {
				if (oPopover.isOpen()) {
					this.close();
				}
				oPopover.$().remove(); // destroy DOM of Wrapper content to not have it twice
			}

			var oDialog = _getDialog.call(this);

			if (oDialog) {
				var oValueHelpPanel = oDialog.getContent()[0];
				oValueHelpPanel.setShowTokenizer(this.getMaxConditions() !== 1 && !!oWrapper);
				oValueHelpPanel.setFormatOptions(this._getFormatOptions());
				oValueHelpPanel.bindProperty("conditions", {path: "$help>/conditions"});
				var sFilterFields = this.getFilterFields();
				if (sFilterFields) {
					oValueHelpPanel.bindProperty("filterConditions", {path: "filter>/conditions/" + sFilterFields});
				}

				this.fireOpen({suggestion: bSuggestion});

				if (oWrapper) {
					oWrapper.fieldHelpOpen(false);
					_updateSelectedItems.call(this);
				}
				this._aOldConditions = this.getConditions();
				oDialog.open();
			} else {
				this._bOpen = true;
			}
		}

		return;

	};

	FieldValueHelp.prototype.toggleOpen = function(bSuggestion) {

		if (this.getNoDialog() && !bSuggestion) {
			bSuggestion = true;
		}

		if (bSuggestion) {
			FieldHelpBase.prototype.toggleOpen.apply(this, [bSuggestion]);
		} else {
			var oDialog = _getDialog.call(this);

			if (oDialog) {
				if (oDialog.isOpen()) {
					var eOpenState = oDialog.oPopup.getOpenState();
					if (eOpenState !== "CLOSED" && eOpenState !== "CLOSING") { // TODO: better logic
						this.close();
					} else {
						this._bReopen = true;
					}
				} else {
					this.open(bSuggestion);
				}
			} else {
				this._bOpen = !this._bOpen;
			}

		}

	};

	FieldValueHelp.prototype.close = function() {

		if (!this._bDialogOpen) {
			FieldHelpBase.prototype.close.apply(this, arguments);
		} else {
			this._bUseFilterBar = false;
			var oDialog = this.getAggregation("_dialog");

			if (oDialog) {
				this._bClosing = true;
				oDialog.close();
				var oWrapper = this.getContent();
				if (oWrapper) {
					oWrapper.fieldHelpClose();
					if (!oWrapper.getAsyncKeyText()) {
						// to have the full list if key or text are requested only from table
						_cleanupFilters.call(this);
					}
				}
			}

			this._bReopen = false;
		}

	};

	FieldValueHelp.prototype.isOpen = function(bCheckClosing) {

		var bIsOpen = FieldHelpBase.prototype.isOpen.apply(this, arguments);

		if (!bIsOpen && (!bCheckClosing || !this._bClosing)) { //
			var oDialog = this.getAggregation("_dialog");
			if (oDialog) {
				bIsOpen = oDialog.isOpen();
			}
		}

		return bIsOpen;

	};


	function _cleanupFilters() {

		if (!this._oFilterConditionModel) {
			return;
		}

		// remove filters: update table only if filter exist
		var oConditions = this._oFilterConditionModel.getAllConditions();
		var bRemove = false;
		for (var sMyFieldPath in oConditions) {
			if (oConditions[sMyFieldPath].length > 0) {
				bRemove = true;
				break;
			}
		}

		if (bRemove) {
			this._oFilterConditionModel.removeAllConditions(/*sFilterFields*/);
			// _applyFilters called from _handleFilterModelChange after all filters set
		}

	}

	FieldValueHelp.prototype._handleAfterClose = function(oEvent) {

		FieldHelpBase.prototype._handleAfterClose.apply(this, arguments);

		var oWrapper = this.getContent();

		if (oWrapper) {
			if (!oWrapper.getAsyncKeyText()) {
				// to have the full list if key or text are requested only from table
				_cleanupFilters.call(this);
			}
			oWrapper.fieldHelpClose();
		}

		this._bApplyFilter = false;

	};

	function _observeChanges(oChanges) {

		if (oChanges.object == this) { // FieldValueHelp
			var oDialog;

			if (oChanges.name === "content") {
				_contentChanged.call(this, oChanges.mutation, oChanges.child);
			}

			if (oChanges.name === "filterBar") {
				_updateFilterBar.call(this, oChanges.mutation, oChanges.child);
			}

			if (oChanges.name === "conditions") {
				_updateConditions.call(this, oChanges.current);
			}

			if (oChanges.name === "filterValue") {
				if (this._bClosing) {
					this._bUpdateFilterAfterClose = true;
				} else {
					_filterContent.call(this, oChanges.current);
				}
			}

			if (oChanges.name === "showConditionPanel") {
				_toggleDefineConditions.call(this, oChanges.current);
			}

			if (oChanges.name === "title") {
				oDialog = this.getAggregation("_dialog");
				if (oDialog) {
					oDialog.setTitle(oChanges.current);
				}
			}

			if (oChanges.name === "filterFields") {
				oDialog = this.getAggregation("_dialog");
				if (oDialog) {
					var oValueHelpPanel = oDialog.getContent()[0];
					oValueHelpPanel.setSearchEnabled(!!oChanges.current);
					if (oDialog.isOpen()) {
						if (oChanges.current) {
							oValueHelpPanel.bindProperty("filterConditions", {path: "filter>/conditions/" + oChanges.current});
						} else {
							oValueHelpPanel.unbindProperty("filterConditions", true);
						}
					}
				}
			}

			if (oChanges.name === "inParameters") {
				_inParametersChanged.call(this, oChanges.child, oChanges.mutation);
			}
		} else if (oChanges.object.isA("sap.ui.mdc.field.InParameter")){
			if (oChanges.name === "value") {
				_inParameterValueChanged.call(this, oChanges.object.getHelpPath(), oChanges.current, oChanges.old, oChanges.object.getUseConditions());
			}
			if (oChanges.name === "helpPath") {
				_inParameterPathChanged.call(this, oChanges.current, oChanges.old, oChanges.object.getValue(), oChanges.object.getUseConditions());
			}
		}

	}

	FieldValueHelp.prototype.openByTyping = function() {

		// if no search is defined no suggestion is possible
		return !!this.getFilterFields();

	};

	FieldValueHelp.prototype.navigate = function(iStep) {

		var oWrapper = this.getContent();
		var oPopover;

		// as BindingContext of Field might change (happens in table) update if needed
		_updateBindingContext.call(this);

		if (oWrapper) {
			// only create popover if content
			oPopover = this._getPopover();
			// apply use in-parameter filters
			this._bApplyFilter = true;
			this._bNavigateRunning = true;
			if (!this._oFilterConditionModel) {
				_createFilterConditionModel.call(this);
			} else {
				_setInParameterFilters.call(this);
			}
			this._oFilterConditionModel.checkUpdate(true, true); // if no filter set and no in-parameters, trigger initial select (if suspended)
		}

		if (!oPopover) {
			// Popover not loaded right now
			this._bNavigate = true;
			this._iStep = iStep;
			if (!oWrapper) {
				this.fireOpen({suggestion: true}); // to let application set content
			}
			return;
		} else if (!oPopover.isOpen()) {
			this.fireOpen({suggestion: true}); // to let application set content
		}

		if (oWrapper) {
			oWrapper.navigate(iStep);
		}

	};

	function _handleNavigate(oEvent) {

		var oPopover = this._getPopover();
		var vKey = oEvent.getParameter("key");
		var sDescription = oEvent.getParameter("description");
		var oInParameters = oEvent.getParameter("inParameters");
		var oOutParameters = oEvent.getParameter("outParameters");
		var oCondition;

		if (!oPopover.isOpen()) {
			this.open(true); // as navigation opens suggestion
		}

		this._bNavigateRunning = false;

		oCondition = Condition.createItemCondition(vKey, sDescription);
		if (oInParameters) {
			oCondition.inParameters = _mapInParametersToField.call(this, oInParameters);
		}
		if (oOutParameters) {
			oCondition.outParameters = _mapOutParametersToField.call(this, oOutParameters);
		}
		this.setProperty("conditions", [oCondition], true); // do not invalidate whole FieldHelp
		this.fireNavigate({value: sDescription, key: vKey, condition: oCondition});

	}

	FieldValueHelp.prototype.getTextForKey = function(vKey, oInParameters, oOutParameters, oBindingContext) {

		var vResult = "";
		var oWrapper = this.getContent();
		if (oWrapper) {
			var oListBinding = oWrapper.getListBinding();

			if (!oListBinding) {
				this.fireDataRequested();
			}

			// The FieldHelp might be connected to another Field or not connected at all.
			// To determine the right value of the In/Out-parameters the BindingContext must be the right one
			// This is only needed if default In/Out-parameters are used.
			var oMyBindingContext = this.getBindingContext();
			var bBindingContextSet = false;
			if (!this.isOpen() && oBindingContext && oMyBindingContext !== oBindingContext &&
					((!oInParameters && this.getInParameters().length > 0) || (!oOutParameters && this.getOutParameters().length > 0))) {
				bBindingContextSet = true;
				this._bNoInOutFilterUpdate = true;
				this.setBindingContext(oBindingContext);
			}

			vResult = oWrapper.getTextForKey(vKey, _mapInParametersToHelp.call(this, oInParameters), _mapOutParametersToHelp.call(this, oOutParameters, true));

			if (vResult instanceof Promise) {
				var oPromise = vResult;
				vResult = new Promise(function(fResolve, fReject) {
					oPromise.then(function(vResult) {
						fResolve(_adjustWrapperResult.call(this, vResult));
					}.bind(this)).catch(function(oException) {
						fReject(oException);
					});
				}.bind(this));
			} else {
				vResult = _adjustWrapperResult.call(this, vResult);
			}

			if (bBindingContextSet) {
				var oField = this._getField();
				if (oField) {
					// if not connected to a Field BindingConext can be left on this one, will be set by connecting to Field
					this.setBindingContext(oField.getBindingContext());
				}
				this._bNoInOutFilterUpdate = false;
			}
		}

		return vResult;

	};

	FieldValueHelp.prototype.getKeyForText = function(sText, oBindingContext) {

		var vResult;
		var oWrapper = this.getContent();

		if (oWrapper) {
			var oListBinding = oWrapper.getListBinding();

			if (!oListBinding) {
				this.fireDataRequested();
			}

			// The FieldHelp might be connected to another Field or not connected at all.
			// To determine the right value of the In-parameters the BindingContext must be the right one
			// This is only needed if default In-parameters are used.
			var oMyBindingContext = this.getBindingContext();
			var bBindingContextSet = false;
			if (!this.isOpen() && oBindingContext && oMyBindingContext !== oBindingContext && this.getInParameters().length > 0) {
				bBindingContextSet = true;
				this._bNoInOutFilterUpdate = true;
				this.setBindingContext(oBindingContext);
			}

			// use default in-parameters for check
			vResult = oWrapper.getKeyForText(sText, _mapInParametersToHelp.call(this));

			if (vResult instanceof Promise) {
				var oPromise = vResult;
				vResult = new Promise(function(fResolve, fReject) {
					oPromise.then(function(vResult) {
						fResolve(_adjustWrapperResult.call(this, vResult));
					}.bind(this)).catch(function(oException) {
						fReject(oException);
					});
				}.bind(this));
			} else {
				vResult = _adjustWrapperResult.call(this, vResult);
			}

			if (bBindingContextSet) {
				var oField = this._getField();
				if (oField) {
					// if not connected to a Field BindingConext can be left on this one, will be set by connecting to Field
					this.setBindingContext(oField.getBindingContext());
				}
				this._bNoInOutFilterUpdate = false;
			}
		}

		return vResult;

	};

	function _adjustWrapperResult(vResult) {

		if (vResult && typeof vResult === "object") {
			// map in/out parameters to external keys
			vResult = merge({}, vResult); // do not modify original object, could have strange side effects
			if (vResult.inParameters) {
				vResult.inParameters = _mapInParametersToField.call(this, vResult.inParameters);
			}
			if (vResult.outParameters) {
				vResult.outParameters = _mapOutParametersToField.call(this, vResult.outParameters);
			}
		}

		return vResult;

	}

	function _handleSelectionChange(oEvent) {

		var aSelectedItems = oEvent.getParameter("selectedItems");
		var oItem;
		var aConditions = this.getConditions();
		var oCondition;
		var i = 0;
		var j = 0;
		var bFound = false;
		var iMaxConditions = this.getMaxConditions();

		// try to keep order stable
		// remove only EEQ selections that can be changed from content control
		for (i = aConditions.length - 1; i >= 0; i--) {
			oCondition = aConditions[i];
			oCondition.inParameters = _mapInParametersToHelp.call(this, oCondition.inParameters);
			oCondition.outParameters = _mapOutParametersToHelp.call(this, oCondition.outParameters);
			if (oCondition.operator === "EEQ") {
				bFound = false;
				for (j = 0; j < aSelectedItems.length; j++) {
					oItem = aSelectedItems[j];
					if (oCondition.values[0] === oItem.key
							&& (!oCondition.inParameters || !oItem.inParameters || deepEqual(oCondition.inParameters, oItem.inParameters))
							&& (!oCondition.outParameters || !oItem.outParameters || deepEqual(oCondition.outParameters, oItem.outParameters))) {
						bFound = true;
						break;
					}
				}
				if (!bFound) {
					aConditions.splice(i, 1);
				}
			}
		}

		for (i = 0; i < aSelectedItems.length; i++) {
			oItem = aSelectedItems[i];
			bFound = false;

			for (j = 0; j < aConditions.length; j++) {
				oCondition = aConditions[j];
				if (oCondition.operator === "EEQ" && oCondition.values[0] === oItem.key
						&& (!oCondition.inParameters || deepEqual(oCondition.inParameters, oItem.inParameters))
						&& (!oCondition.outParameters || deepEqual(oCondition.outParameters, oItem.outParameters))) {
					bFound = true;
					oCondition.inParameters = oItem.inParameters; // to add if not already set
					oCondition.outParameters = oItem.outParameters; // to add if not already set
					break;
				}
			}

			if (!bFound) {
				oCondition = Condition.createItemCondition(oItem.key, oItem.description, oItem.inParameters, oItem.outParameters);
				aConditions.push(oCondition);
			}
		}

		if (iMaxConditions > 0 && aConditions.length > iMaxConditions) {
			aConditions.splice(0, aConditions.length - iMaxConditions);
		}

		for (i = 0; i < aConditions.length; i++) {
			oCondition = aConditions[i];
			if (oCondition.inParameters) {
				oCondition.inParameters = _mapInParametersToField.call(this, oCondition.inParameters);
			} else {
				delete oCondition.inParameters;
			}
			if (oCondition.outParameters) {
				oCondition.outParameters = _mapOutParametersToField.call(this, oCondition.outParameters);
			} else {
				delete oCondition.outParameters;
			}
		}

		if (this._bDialogOpen) {
			this.setProperty("conditions", aConditions, true); // do not invalidate whole FieldHelp
		} else {
			// suggestion -> fire select event directly
			this.close();
			this.setProperty("conditions", aConditions, true); // do not invalidate whole FieldHelp
			this.fireSelect({conditions: aConditions, add: true});
		}

	}

	function _handleDataUpdate(oEvent) {

		var bContentChange = oEvent.getParameter("contentChange");
		var oWrapper = this.getContent();
		var bAsyncKeyText = oWrapper.getAsyncKeyText();

		if (bContentChange) {
			var oPopover = this.getAggregation("_popover");
			var oDialog = this.getAggregation("_dialog");
			if (oWrapper) {
				if (oWrapper.getFilterEnabled() && !this._oFilterConditionModel && ((oPopover && this._bOpenIfContent) || oDialog)) {
					_createFilterConditionModel.call(this);
				}
				if (oPopover && this._bOpenIfContent) {
					var oField = this._getField();
					if (oField) {
						oWrapper.fieldHelpOpen(true);
						oPopover.openBy(this._getControlForSuggestion());
						// apply filters now
						_applyFilters.call(this);
					}
					this._bOpenIfContent = false;
				} else if (oDialog) {
					var oValueHelpPanel = oDialog.getContent()[0];
					_setContentOnValueHelpPanel.call(this, oValueHelpPanel, oWrapper.getDialogContent());
				}
			}
		}

		if (!bAsyncKeyText) {
			// if asynchronously loading of key or description is supported fields needs no update on data change
			// Format or parse promise waits until table is set and request returned.
			this.fireDataUpdate();
		}

	}

	function _updateConditions(aConditions) {

		_updateSelectedItems.call(this);

	}

	function _updateSelectedItems() {

		if (!this._oField) {
			return; // makes only sense if connected
		}

		var oWrapper = this.getContent();

		if (oWrapper) {
			var aConditions = this.getConditions();
			var aItems = [];
			for (var i = 0; i < aConditions.length; i++) {
				var oCondition = aConditions[i];
				if (oCondition.operator === "EEQ") {
					aItems.push({
						key: oCondition.values[0],
						description: oCondition.values[1],
						inParameters: _mapInParametersToHelp.call(this, oCondition.inParameters),
						outParameters: _mapOutParametersToHelp.call(this, oCondition.outParameters)
					});
				}
			}
			if (!deepEqual(aItems, oWrapper.getSelectedItems())) {
				oWrapper.setSelectedItems(aItems);
			}
		}

	}

	function _filterContent(sFilterText) {

		if (!this._oFilterConditionModel) {
			return;
		}

		var sFilterFields = this.getFilterFields();

		if (!sFilterFields) {
			return; // we don't know how to filter
		}

		if (sFilterText) {
			this._bOwnFilterChange = true; // do not filter twice;
		}

		this._oFilterConditionModel.removeAllConditions(sFilterFields);
		sFilterText = sFilterText.trim();
		if (sFilterText) {
			this._bOwnFilterChange = false;
			var oCondition = Condition.createCondition("StartsWith", [sFilterText]);
			this._oFilterConditionModel.addCondition(sFilterFields, oCondition);
		}

	}

	// IN/OUT handling
	function _inParametersChanged(oInParameter, sMutation) {

		var sFilterPath = oInParameter.getHelpPath();
		var bUpdate = false;

		if (sMutation === "remove") {
			this._oObserver.unobserve(oInParameter);
			if (this._getField() && this.isOpen()) {
				bUpdate = _removeInFilter.call(this, sFilterPath);
			}
		} else {
			this._oObserver.observe(oInParameter, {properties: true});
			if (this._getField() && this.isOpen()) {
				var vValue = oInParameter.getValue();
				var bUseConditions = oInParameter.getUseConditions();
				bUpdate = _removeInFilter.call(this, sFilterPath); // if exist, remove old filter
				bUpdate = _addInFilter.call(this, sFilterPath, vValue, bUseConditions) || bUpdate;
				_updateSelectedItems.call(this); // as mapping of in-parametrs could change
			}
		}

		// _applyFilters called from _handleFilterModelChange after all filters set

	}

	function _addInFilter(sFilterPath, vValue, bUseConditions) {

		var oFilterBar;
		var oConditions;
		var oCondition;
		var bUpdate = false;

		if (this._oFilterConditionModel && sFilterPath && vValue) { // TODO: support boolean?
			oFilterBar = this.getFilterBar();

			if (this._bUseFilterBar && oFilterBar) {
				// update in FilterBar and in FilterConditionModel
				oConditions = oFilterBar.getConditions();
				if (!oConditions[sFilterPath]) {
					oConditions[sFilterPath] = [];
				}
			}

			if (bUseConditions) {
				if (Array.isArray(vValue)) {
					for (var i = 0; i < vValue.length; i++) {
						oCondition = merge({}, vValue[i]);
						// change paths of in- and out-parameters
						if (oCondition.inParameters) {
							oCondition.inParameters = _mapInParametersToHelp.call(this, oCondition.inParameters);
						}
						if (oCondition.outParameters) {
							oCondition.outParameters = _mapOutParametersToHelp.call(this, oCondition.outParameters);
						}

						this._oFilterConditionModel.addCondition(sFilterPath, oCondition);
						if (this._bUseFilterBar && oFilterBar) {
							oConditions[sFilterPath].push(vValue[i]);
						}
						bUpdate = true;
					}
				}
			} else {
				// TODO: way to provide description on InParameter
				// EEQ to let FilterField determine desrciption if visible on FilterBar.
				// Also to show it as selected on table in FieldHelp of FilterField.
				oCondition = Condition.createItemCondition(vValue);
				this._oFilterConditionModel.addCondition(sFilterPath, oCondition);
				if (this._bUseFilterBar && oFilterBar) {
					oConditions[sFilterPath].push(oCondition);
				}
				bUpdate = true;
			}
		}

		if (bUpdate && this._bUseFilterBar && oFilterBar) {
			oFilterBar.setConditions(oConditions);
		}

		return bUpdate;

	}

	function _removeInFilter(sFilterPath) {

		var bUpdate = false;

		if (this._oFilterConditionModel && sFilterPath && this._oFilterConditionModel.getConditions(sFilterPath).length > 0) {
			this._oFilterConditionModel.removeAllConditions(sFilterPath); // TODO: remove only filters from In-parameters, not from FilterBar
			bUpdate = true;
		}

		var oFilterBar = this.getFilterBar();

		if (this._bUseFilterBar && oFilterBar) {
			// update in FilterBar and in FilterConditionModel
			var oConditions = oFilterBar.getConditions();
			if (oConditions[sFilterPath] && oConditions[sFilterPath].length > 0) {
				oConditions[sFilterPath] = [];
				oFilterBar.setConditions(oConditions);
				bUpdate = true;
			}
		}

		return bUpdate;

	}

	function _inParameterValueChanged(sFilterPath, vValue, vOldValue, bUseConditions) {

		if (this._bNoInOutFilterUpdate) {
			// just a updaste of BindingContext during formatting/parsing -> do not update Filter as it will changed back soon.
			return;
		}

		if (!this.sUpdateTimer) { // do async as it can take a while until model updates all bindings.
			this.sUpdateTimer = setTimeout(function() {
				this.sUpdateTimer = undefined;
				this.fireDataUpdate(); // to update text
			}.bind(this), 0);
		}

		if (!this._getField() || !this.isOpen()) {
			return;
		}

		var bUpdate = false;

		bUpdate = _removeInFilter.call(this, sFilterPath); // if exist, remove old filter
		bUpdate = _addInFilter.call(this, sFilterPath, vValue, bUseConditions) || bUpdate;

		// _applyFilters called from _handleFilterModelChange after all filters set

	}

	function _inParameterPathChanged(sFilterPath, sOldFilterPath, vValue, bUseConditions) {

		if (!this._getField() || !this.isOpen()) {
			return;
		}

		var bUpdate = false;

		bUpdate = _removeInFilter.call(this, sOldFilterPath); // if exist, remove old filter
		bUpdate = _addInFilter.call(this, sFilterPath, vValue, bUseConditions) || bUpdate;

		// _applyFilters called from _handleFilterModelChange after all filters set

	}

	function _setInParameterFilters() {

		var aInParameters = this.getInParameters();
		var bUpdate = false;

		for (var i = 0; i < aInParameters.length; i++) {
			var oInParameter = aInParameters[i];
			var sFilterPath = oInParameter.getHelpPath();
			var vValue = oInParameter.getValue();
			var bUseConditions = oInParameter.getUseConditions();
			bUpdate = _removeInFilter.call(this, sFilterPath) || bUpdate; // if exist, remove old filter
			bUpdate = _addInFilter.call(this, sFilterPath, vValue, bUseConditions) || bUpdate;
		}

		// _applyFilters called from _handleFilterModelChange after all filters set

	}

	FieldValueHelp.prototype.onFieldChange = function() {

		// apply out-parameters
		var aOutParameters = this.getOutParameters();
		var aConditions = this.getConditions();

		// as BindingContext of Field might change (happens if fast typed and FieldHelp not opened) update if needed
		_updateBindingContext.call(this);

		for (var i = 0; i < aConditions.length; i++) {
			var oCondition = aConditions[i];
			if (oCondition.outParameters) {
				for ( var sPath in oCondition.outParameters) {
					for (var j = 0; j < aOutParameters.length; j++) {
						var oOutParameter = aOutParameters[j];
						var vValue = oOutParameter.getValue();
						var bUseConditions = oOutParameter.getUseConditions();
						var bUpdate = true;
						if (oOutParameter.getMode() === OutParameterMode.WhenEmpty) {
							if (bUseConditions) {
								bUpdate = !vValue || (Array.isArray(vValue) && vValue.length === 0);
							} else {
								bUpdate = !vValue;
							}
						}
						if (bUpdate) {
							if (bUseConditions) {
								var oNewCondition;
								if (!oOutParameter.getHelpPath()) {
									oNewCondition = Condition.createCondition("EEQ", [oOutParameter.getFixedValue()]);
								} else if (oOutParameter.getFieldPath() === sPath) { // in Conditions fieldPath is used
									oNewCondition = Condition.createCondition("EEQ", [oCondition.outParameters[sPath]]);

									// TODO: handle in/out Parameters in ConditionModel (to let the condition know it's out-Parameters)
									var oBinding = oOutParameter.getBinding("value");
									var oCM = oBinding && oBinding.getModel();

									if (oCM && oCM.isA("sap.ui.mdc.condition.ConditionModel")) {
										// TODO: what if In-parameters are set late (by open) ?
										var oFilterField = oCM.getFilterField(sPath);
										var sFieldHelpID = oFilterField && oFilterField.getFieldHelp();
										var oFieldHelp = sFieldHelpID && sap.ui.getCore().byId(sFieldHelpID);

										if (oFieldHelp) {
											// set in/out parameter to new condition.
											var aParameters = oFieldHelp.getInParameters();
											var k = 0;
											var sFieldPath;
											var oFilterFieldParameter;
											for (k = 0; k < aParameters.length; k++) {
												oFilterFieldParameter = aParameters[k];
												sFieldPath = oFilterFieldParameter.getFieldPath();
												if (oCondition.outParameters[sFieldPath]) {
													if (!oNewCondition.inParameters) {
														oNewCondition.inParameters = {};
													}
													oNewCondition.inParameters[sFieldPath] = oCondition.outParameters[sFieldPath];
												}
											}
											aParameters = oFieldHelp.getOutParameters();
											for (k = 0; k < aParameters.length; k++) {
												oFilterFieldParameter = aParameters[k];
												sFieldPath = oFilterFieldParameter.getFieldPath();
												if (oCondition.outParameters[sFieldPath]) {
													if (!oNewCondition.outParameters) {
														oNewCondition.outParameters = {};
													}
													oNewCondition.outParameters[sFieldPath] = oCondition.outParameters[sFieldPath];
												}
											}
										}
									}
								} else {
									continue;
								}
								if (!vValue) {
									vValue = [];
								}
								if (!Array.isArray(vValue)) {
									throw new Error("Value on OutParameter must be an array " + oOutParameter);
								}
								if (Condition.indexOfCondition(oNewCondition, vValue) < 0) {
									vValue.push(oNewCondition);
									oOutParameter.setValue(vValue);
								}
							} else {
								if (!oOutParameter.getHelpPath()) {
									oOutParameter.setValue(oOutParameter.getFixedValue());
								} else if (oOutParameter.getFieldPath() === sPath) { // in Conditions fieldPath is used
									oOutParameter.setValue(oCondition.outParameters[sPath]);
								}
							}
						}
					}
				}
			}
		}

	};

	function _mapInParametersToField(oInParameters) {

		return _mapParametersToField.call(this, oInParameters, this.getInParameters());

	}

	function _mapOutParametersToField(oOutParameters) {

		return _mapParametersToField.call(this, oOutParameters, this.getOutParameters());

	}

	function _mapParametersToField(oParameters, aParameters) {

		if (!oParameters || aParameters.length === 0) {
			return null;
		}

		var oFieldParameters = {};

		for (var i = 0; i < aParameters.length; i++) {
			var oParameter = aParameters[i];
			var sHelpPath = oParameter.getHelpPath();
			var sFieldPath = oParameter.getFieldPath();
			if (sHelpPath && sFieldPath) {
				for (var sMyFieldPath in oParameters) {
					if (sHelpPath === sMyFieldPath) {
						oFieldParameters[sFieldPath] = oParameters[sMyFieldPath];
						break;
					}
				}
			} else if (!sHelpPath && sFieldPath && oParameter.getFixedValue) {
				// if helpPath is not set we expect a fix value for out-parameter
				oFieldParameters[sFieldPath] = oParameter.getFixedValue();
			}
		}

		return oFieldParameters;

	}

	function _mapInParametersToHelp(oInParameters) {

		return _mapParametersToHelp.call(this, oInParameters, this.getInParameters());

	}

	function _mapOutParametersToHelp(oOutParameters, bNoDefault) {

		return _mapParametersToHelp.call(this, oOutParameters, this.getOutParameters(), bNoDefault);

	}

	function _mapParametersToHelp(oParameters, aParameters, bNoDefault) {

		var oHelpParameters;
		var oParameter;
		var sHelpPath;
		var sFieldPath;
		var i = 0;

		if (aParameters.length > 0) {
			if (!oParameters) {
				if (!bNoDefault) {
					// use current values of in/out-parameters as default
					// in case of getTextForKey only out-parameters set by condition are from interest (To find manual selected entry again if no in-paramters are used)
					// in this case only provided parameters are from interest.
					for (i = 0; i < aParameters.length; i++) {
						oParameter = aParameters[i];
						sHelpPath = oParameter.getHelpPath();
						var vValue = oParameter.getValue();
						if (sHelpPath && vValue) {
							if (!oHelpParameters) {
								oHelpParameters = {};
							}
							if (oParameter.getUseConditions()) {
								// TODO: What if there are multiple conditions or not EEQ?
								oHelpParameters[sHelpPath] = vValue[0] && vValue[0].values[0];
							} else {
								oHelpParameters[sHelpPath] = vValue;
							}
						}
					}
				}
			} else {
				for (var sMyFieldPath in oParameters) {
					for (i = 0; i < aParameters.length; i++) {
						oParameter = aParameters[i];
						sHelpPath = oParameter.getHelpPath();
						sFieldPath = oParameter.getFieldPath();
						if (sFieldPath && sFieldPath === sMyFieldPath && sHelpPath) {
							if (!oHelpParameters) {
								oHelpParameters = {};
							}
							oHelpParameters[sHelpPath] = oParameters[sMyFieldPath];
						}
					}
				}
			}
		}

		return oHelpParameters;

	}

	function _applyFilters() {

		if (!this._oFilterConditionModel || (!this.isOpen() && !this._bNavigateRunning && !this._bOpen) || !this._bApplyFilter) {
			// apply filters only if open (no request on closed FieldHelp)
			return;
		}

		if (this._oFilterConditionModel.isValid(true)) {
			var oWrapper = this.getContent();
			if (oWrapper) {
				var oFilter = this._oFilterConditionModel.getFilters();
				var aFilters = [];
				var aSearchConditions = this._oFilterConditionModel.getConditions("$search");
				var sSearch;

				if (oFilter) {
					aFilters.push(oFilter);
				}

				if (aSearchConditions.length > 0) {
					sSearch = aSearchConditions[0].values[0];
				}

				oWrapper.applyFilters(aFilters, sSearch);
			}
		}

	}

	function _handleFilterModelChange(oEvent) {

		if (this._bOwnFilterChange) {
			return;
		}

		_applyFilters.call(this);

	}

	function _createFilterConditionModel() {

		if (!ConditionModel && !this._bFilterConditionModelRequested) {
			ConditionModel = sap.ui.require("sap/ui/mdc/condition/ConditionModel");
			if (!ConditionModel) {
				sap.ui.require(["sap/ui/mdc/condition/ConditionModel"], _FilterConditionModelLoaded.bind(this));
				this._bFilterConditionModelRequested = true;
			}
		}

		if (ConditionModel) {
			var sFilterValue = this.getFilterValue();

			this._oFilterConditionModel = new ConditionModel();
			if (sFilterValue) {
				_filterContent.call(this, sFilterValue);
			}

			//IN/OUT handling
			_setInParameterFilters.call(this);

			var oConditionChangeBinding = this._oFilterConditionModel.bindProperty("/conditions", this._oFilterConditionModel.getContext("/conditions"));
			oConditionChangeBinding.attachChange(_handleFilterModelChange.bind(this));

			this.setModel(this._oFilterConditionModel, "filter");
		}

	}

	function _FilterConditionModelLoaded(fnConditionModel) {

		ConditionModel = fnConditionModel;
		this._bFilterConditionModelRequested = false;

		if (!this._bIsBeingDestroyed) {
			_createFilterConditionModel.call(this);
		}

	}

	FieldValueHelp.prototype.getMaxConditions = function() {

		if (this._oField && this._oField.getMaxConditionsForHelp) {
			// if Field or FilterField -> use it's MaxConditions
			return this._oField.getMaxConditionsForHelp();
		} else if (this._oField && this._oField.getMaxConditions) {
			// if Field or FilterField -> use it's MaxConditions
			return this._oField.getMaxConditions();
		} else {
			// TODO: how to set if field not provide MaxConditions?
			return 1;
		}

	};

	FieldValueHelp.prototype.getDisplay = function() {

		if (this._oField && this._oField.getDisplay) {
			// if Field or FilterField -> use it's Display
			return this._oField.getDisplay();
		}

	};

	FieldValueHelp.prototype.getRequired = function() {

		if (this._oField && this._oField.getRequired) {
			// if Field or FilterField -> use it's Required
			return this._oField.getRequired();
		} else {
			// TODO: default false?
			return false;
		}

	};

	FieldValueHelp.prototype.getDataType = function() {

		if (this._oField.getDataType) {
			// if Field or FilterField -> use it's DataType
			return this._oField.getDataType();
		} else {
			// TODO: default case?
			return "sap.ui.model.type.String";
		}

	};

	FieldValueHelp.prototype._getFormatOptions = function() {

		if (this._oField && this._oField._getFormatOptions) {
			// if Field or FilterField -> use it's DataType, Delegate....
			return this._oField._getFormatOptions();
		} else {
			return {};
		}

	};

	FieldValueHelp.prototype._getKeyPath = function() {

		var sKeyPath = this.getKeyPath();

		if (!sKeyPath && this._oField && this._oField.getFieldPath && this._oField.getFieldPath()) {
			sKeyPath = this._oField.getFieldPath();
		}

		return sKeyPath;

	};

	FieldValueHelp.prototype.clone = function(sIdSuffix, aLocalIds) {

		// detach event handler before cloning to not have it twice on the clone
		// attach it after clone again
		var oWrapper = this.getContent();
		var oFilterBar = this.getFilterBar();

		if (oWrapper) {
			oWrapper.detachEvent("navigate", _handleNavigate, this);
			oWrapper.detachEvent("selectionChange", _handleSelectionChange, this);
			oWrapper.detachEvent("dataUpdate", _handleDataUpdate, this);
		}

		if (oFilterBar) {
			oFilterBar.detachEvent("search", _updateFiltersFromFilterBar, this);
		}

		var oClone = FieldHelpBase.prototype.clone.apply(this, arguments);

		if (oWrapper) {
			oWrapper.attachEvent("navigate", _handleNavigate, this);
			oWrapper.attachEvent("selectionChange", _handleSelectionChange, this);
			oWrapper.attachEvent("dataUpdate", _handleDataUpdate, this);
		}

		if (oFilterBar) {
			oFilterBar.attachEvent("search", _updateFiltersFromFilterBar, this);
		}

		return oClone;

	};

	function _createDialog() {

		var oDialog;

		if ((!Dialog || !Button || !ValueHelpPanel || !DefineConditionPanel) && !this._bDialogRequested) {
			Dialog = sap.ui.require("sap/m/Dialog");
			Button = sap.ui.require("sap/m/Button");
			ValueHelpPanel = sap.ui.require("sap/ui/mdc/field/ValueHelpPanel");
			DefineConditionPanel = sap.ui.require("sap/ui/mdc/field/DefineConditionPanel"); // TODO: load only if needed
			ManagedObjectModel = sap.ui.require("sap/ui/model/base/ManagedObjectModel");
			FilterOperatorUtil = sap.ui.require("sap/ui/mdc/condition/FilterOperatorUtil");
			if (!Dialog || !Button || !ValueHelpPanel || !DefineConditionPanel || !ConditionModel) {
				sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel",
				                "sap/ui/mdc/field/DefineConditionPanel", "sap/ui/model/base/ManagedObjectModel",
				                "sap/ui/mdc/condition/FilterOperatorUtil"], _DialogLoaded.bind(this));
				this._bDialogRequested = true;
			}
		}
		if (Dialog && Button && ValueHelpPanel && DefineConditionPanel && !this._bDialogRequested) {
			if (!this._oResourceBundle) {
				this._oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");
			}

			var oButtonOK = new Button(this.getId() + "-ok", {
				text: this._oResourceBundle.getText("valuehelp.OK"),
				press: _dialogOk.bind(this)
			});

			var oButtonCancel = new Button(this.getId() + "-cancel", {
				text: this._oResourceBundle.getText("valuehelp.CANCEL"),
				press: _dialogCancel.bind(this)
			});

			this._oManagedObjectModel = new ManagedObjectModel(this);

			var oValueHelpPanel = _createValueHelpPanel.call(this);

			oDialog = new Dialog(this.getId() + "-dialog", {
				contentHeight: "600px",
				contentWidth: "1000px",
				horizontalScrolling: false,
				verticalScrolling: false,
				title: this.getTitle(),
				resizable: true,
				draggable: true,
				content: [oValueHelpPanel],
				afterOpen: _handleDialogAfterOpen.bind(this),
				afterClose: _handleDialogAfterClose.bind(this),
				buttons: [oButtonOK, oButtonCancel]
			});

			this.setAggregation("_dialog", oDialog, true);
			// TODO
			oDialog.setModel(new ResourceModel({ bundleName: "sap/ui/mdc/messagebundle", async: false }), "$i18n");

			_toggleDefineConditions.call(this, this.getShowConditionPanel());
		}

		return oDialog;

	}

	function _DialogLoaded(fnDialog, fnButton, fnValueHelpPanel, fnDefineConditionPanel, fnManagedObjectModel, fnFilterOperatorUtil) {

		Dialog = fnDialog;
		Button = fnButton;
		ValueHelpPanel = fnValueHelpPanel;
		DefineConditionPanel = fnDefineConditionPanel;
		ManagedObjectModel = fnManagedObjectModel;
		FilterOperatorUtil = fnFilterOperatorUtil;
		this._bDialogRequested = false;

		if (!this._bIsBeingDestroyed) {
			_createDialog.call(this);
			if (this._bOpen) {
				this.open();
				delete this._bOpen;
			}
		}

	}

	function _createValueHelpPanel() {

		var oWrapper = this.getContent();
		var oFilterBar = this.getFilterBar();

		var oValueHelpPanel = new ValueHelpPanel(this.getId() + "-VHP", {
			height: "100%",
			showFilterbar: !!oFilterBar,
			searchEnabled: !!this.getFilterFields(),
			formatOptions: this._getFormatOptions(),
			search: _handleSearch.bind(this)
		});
		oValueHelpPanel.setModel(this._oManagedObjectModel, "$help");

		if (oWrapper) {
			oWrapper.initialize(false);
			_setContentOnValueHelpPanel.call(this, oValueHelpPanel, oWrapper.getDialogContent());
		}
		if (oFilterBar) {
			oValueHelpPanel.setFilterbar(oFilterBar);
		}

		return oValueHelpPanel;

	}

	function _setContentOnValueHelpPanel(oValueHelpPanel, oContent) {

		oValueHelpPanel.setTable(oContent);

	}

	function _contentChanged(sMutation, oWrapper) {

		var oPopover = this.getAggregation("_popover");
		var oDialog = this.getAggregation("_dialog");
		if (sMutation === "remove") {
			oWrapper.detachEvent("navigate", _handleNavigate, this);
			oWrapper.detachEvent("selectionChange", _handleSelectionChange, this);
			oWrapper.detachEvent("dataUpdate", _handleDataUpdate, this);
			oWrapper = undefined;
		} else {
			oWrapper.attachEvent("navigate", _handleNavigate, this);
			oWrapper.attachEvent("selectionChange", _handleSelectionChange, this);
			oWrapper.attachEvent("dataUpdate", _handleDataUpdate, this);
			_updateSelectedItems.call(this);
		}
		this.fireDataUpdate();
		if (this._bNavigate) {
			this._bNavigate = false;
			this.navigate(this._iStep);
			this._iStep = null;
		} else if (oPopover) {
			oPopover.invalidate();
			var sFilterValue = this.getFilterValue();
			if (sFilterValue) {
				_filterContent.call(this, sFilterValue);
			}
			_setInParameterFilters.call(this);

			if (oWrapper && oWrapper.getFilterEnabled() && !this._oFilterConditionModel) {
				_createFilterConditionModel.call(this);
			}
			if (oWrapper && this._bOpenIfContent) {
				oWrapper.initialize(true);

				var oField = this._getField();
				if (oField) {
					oWrapper.fieldHelpOpen(true);
					oPopover.openBy(this._getControlForSuggestion());
				}
				this._bOpenIfContent = false;
			}
		} else if (oWrapper && this._bOpenIfContent) {
			this._bOpenIfContent = false;
			this.open(true);
		}
		if (oDialog) {
			// update ValueHelpPanel
			if (oWrapper) {
				oWrapper.initialize(false);
				if (oWrapper.getFilterEnabled() && !this._oFilterConditionModel) {
					_createFilterConditionModel.call(this);
				}
				var oValueHelpPanel = oDialog.getContent()[0];
				_setContentOnValueHelpPanel.call(this, oValueHelpPanel, oWrapper.getDialogContent());
				if (oDialog.isOpen()) {
					oWrapper.fieldHelpOpen(false);
				}
			}
		}

	}

	function _getDialog() {

		var oDialog = this.getAggregation("_dialog");

		if (!oDialog) {
			oDialog = _createDialog.call(this);
		}

		return oDialog;

	}

	function _dialogOk(oEvent) {

		this.close();

		var aConditions = this.getConditions();
		aConditions = Condition._removeEmptyConditions(aConditions);

		this._bNoConditionModelUpdate = true;
		this.setProperty("conditions", aConditions, true); // do not invalidate whole FieldHelp
		this.fireSelect({conditions: aConditions, add: false});

	}

	function _dialogCancel(oEvent) {

		this.close();

		this.setProperty("conditions", this._aOldConditions, true); // do not invalidate whole FieldHelp

	}

	function _handleDialogAfterOpen(oEvent) {

		this._bDialogOpen = true;

	}

	function _handleDialogAfterClose(oEvent) {

		this._bDialogOpen = false;
		this._aOldConditions = undefined;
		this._bUseFilterBar = false; // to be sure
		this._bApplyFilter = false;

		var oWrapper = this.getContent();
		if (oWrapper) {
			oWrapper.fieldHelpClose();
		}

		var oDialog = this.getAggregation("_dialog");
		var oValueHelpPanel = oDialog.getContent()[0];
		// remove binding of conditions to prevent updates on ValueHelpPanel and DefineConditionPanel while closed. (e.g. empty row)
		oValueHelpPanel.unbindProperty("conditions", true);
		oValueHelpPanel.unbindProperty("filterConditions", true);

		this._handleAfterClose(oEvent);

	}

	function _toggleDefineConditions(bActive) {
		var oDialog = this.getAggregation("_dialog");
		if (oDialog && this._oField) {
			var oValueHelpPanel = oDialog.getContent()[0];
			var aOperators = this._getFormatOptions().operators;
			if (bActive && !FilterOperatorUtil.onlyEEQ(aOperators)) {
				if (!oValueHelpPanel._oDefineConditionPanel) { //TODO: use API?
					var oDefineConditionPanel = new DefineConditionPanel(this.getId() + "-DCP");
					oValueHelpPanel.setDefineConditions(oDefineConditionPanel);
				}
			} else {
				oValueHelpPanel.setDefineConditions();
			}
		}
	}

	function _updateFilterBar(sMutation, oFilterBar) {

		if (sMutation === "remove") {
			oFilterBar.detachEvent("search", _updateFiltersFromFilterBar, this);
			oFilterBar = undefined;
		} else {
			oFilterBar.attachEvent("search", _updateFiltersFromFilterBar, this);
		}

		var oDialog = this.getAggregation("_dialog");
		if (oDialog) {
			var oValueHelpPanel = oDialog.getContent()[0];
			oValueHelpPanel.setFilterbar(oFilterBar);
			oValueHelpPanel.setShowFilterbar(!!oFilterBar);
			_setInParameterFilters.call(this);
			_updateFiltersFromFilterBar.call(this); // to add initial filters
		}

	}

	function _updateFiltersFromFilterBar(oEvent) {

		if (!this._oFilterConditionModel || !this._bUseFilterBar) {
			return;
		}

		var oFilterBar = this.getFilterBar();

		if (oFilterBar) {
			// use filters from FilterBar (in-parameters are there included)
			// first remove all filters not in FilterBar, except suggestion
			var oFilterConditions = this._oFilterConditionModel.getAllConditions();
			var oConditions = oFilterBar.getConditions();
			var sFilterFields = this.getFilterFields();
			var i = 0;
			var sMyFieldPath;
			var oCondition;
			for (sMyFieldPath in oFilterConditions) {
				if (sMyFieldPath !== sFilterFields) {
					for (i = 0; i < oFilterConditions[sMyFieldPath].length; i++) {
						oCondition = merge({}, oFilterConditions[sMyFieldPath][i]);
						// change paths of in- and out-parameters
						if (oCondition.inParameters) {
							oCondition.inParameters = _mapInParametersToField.call(this, oCondition.inParameters);
						}
						if (oCondition.outParameters) {
							oCondition.outParameters = _mapOutParametersToField.call(this, oCondition.outParameters);
						}
						if (!oConditions[sMyFieldPath] || Condition.indexOfCondition(oCondition, oConditions[sMyFieldPath]) < 0) {
							this._oFilterConditionModel.removeCondition(sMyFieldPath, oCondition);
						}
					}
				}
			}

			// add conditions from FilterBar
			for (sMyFieldPath in oConditions) {
				for (i = 0; i < oConditions[sMyFieldPath].length; i++) {
					oCondition = merge({}, oConditions[sMyFieldPath][i]);
					// change paths of in- and out-parameters
					if (oCondition.inParameters) {
						oCondition.inParameters = _mapInParametersToHelp.call(this, oCondition.inParameters);
					}
					if (oCondition.outParameters) {
						oCondition.outParameters = _mapOutParametersToHelp.call(this, oCondition.outParameters);
					}

					if (!oFilterConditions[sMyFieldPath] || Condition.indexOfCondition(oCondition, oFilterConditions[sMyFieldPath]) < 0) {
						this._oFilterConditionModel.addCondition(sMyFieldPath, oCondition);
					}
				}
			}

			// if conditions are changed in _oFilterConditionModel an update is triggered.
			// But initially the filter must set active
			if (!this._bApplyFilter && (oEvent || oFilterBar.getLiveMode())) {
				// user triggers search or liveMode -> resume
				// use checkUpdate to call _applyFilters not twice
				this._bApplyFilter = true; // applyFilter even if suspended (resume)
				this._oFilterConditionModel.checkUpdate(true, true);
			}
		}

	}

	function _removeFilterBarFilters() {

		if (!this._oFilterConditionModel) {
			return;
		}

		var oFilterBar = this.getFilterBar();

		if (!oFilterBar) {
			return;
		}

		var oFilterConditions = this._oFilterConditionModel.getAllConditions();
		var sFilterFields = this.getFilterFields();
		var sMyFieldPath;
		for (sMyFieldPath in oFilterConditions) {
			if (sMyFieldPath !== sFilterFields) {
				this._oFilterConditionModel.removeAllConditions(sMyFieldPath);
			}
		}

		// add conditions from In-Parameters
		_setInParameterFilters.call(this);

	}

	function _getSuggestionContent() {

		var oWrapper = this.getContent();
		if (oWrapper) {
			return oWrapper.getSuggestionContent();
		}

	}

	function _updateBindingContext() {

		var oField = this._getField();
		var oBindingContext = oField && oField.getBindingContext();
		if (this.getBindingContext() !== oBindingContext) {
			this.setBindingContext(oBindingContext);
		}

	}

	function _handleSearch(oEvent) {

		this._bApplyFilter = true; // applyFilter even if suspended (resume)
		this._oFilterConditionModel.checkUpdate(true, true); // to trigger _applyFilters even if no search string is entered

	}

	FieldValueHelp.prototype.getScrollDelegate = function () {

		var oDialog = this.getAggregation("_dialog");

		if (oDialog && (oDialog.isOpen() || oDialog.oPopup.getOpenState() === "Opening")) { // TODO: better way to get opening state
			var oWrapper = this.getContent();
			var oContent = oWrapper && oWrapper.getDialogContent();
			if (oContent && oContent.getScrollDelegate) {
				return oContent.getScrollDelegate();
			} else {
				return undefined;
			}
		} else {
			return FieldHelpBase.prototype.getScrollDelegate.apply(this, arguments);
		}

	};

	return FieldValueHelp;

});
