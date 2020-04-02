/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	'sap/ui/mdc/p13n/Util', 'sap/ui/core/Control', 'sap/base/util/merge', 'sap/base/util/deepEqual', 'sap/ui/model/PropertyBinding', 'sap/ui/model/Context', 'sap/ui/model/base/ManagedObjectModel', 'sap/ui/base/ManagedObjectObserver', 'sap/base/Log', 'sap/ui/mdc/library', 'sap/ui/mdc/filterbar/FilterItemLayout', 'sap/ui/mdc/condition/ConditionModel', 'sap/ui/mdc/condition/Condition', 'sap/ui/mdc/FilterField', 'sap/ui/mdc/field/FieldValueHelp', 'sap/ui/mdc/util/IdentifierUtil', 'sap/ui/mdc/util/ConditionUtil', 'sap/ui/layout/AlignedFlowLayout', 'sap/m/library', 'sap/m/Button', 'sap/ui/model/json/JSONModel', "sap/ui/fl/write/api/ControlPersonalizationWriteAPI", "sap/ui/fl/apply/api/FlexRuntimeInfoAPI", "sap/base/util/UriParameters"
], function(p13nUtil, Control, merge, deepEqual, PropertyBinding, Context, ManagedObjectModel, ManagedObjectObserver, Log, mdcLibrary, FilterItemLayout, ConditionModel, Condition, FilterField, FieldValueHelp, IdentifierUtil, ConditionUtil, AlignedFlowLayout, mLibrary, Button, JSONModel, ControlPersonalizationWriteAPI, FlexRuntimeInfoAPI, UriParameters) {
	"use strict";

	var ButtonType = mLibrary.ButtonType;

	/**
	 * Constructor for a new FilterBar.
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class The FilterBar control is used to display filter properties.
	 * @extends sap.ui.core.Control
	 * @author SAP SE
	 * @version 1.74.0
	 * @constructor
	 * @private
	 * @since 1.61.0
	 * @alias sap.ui.mdc.FilterBar
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var FilterBar = Control.extend("sap.ui.mdc.FilterBar", /** @lends sap.ui.mdc.FilterBar.prototype */
	{
		metadata: {
			library: "sap.ui.mdc",
			designtime: "sap/ui/mdc/designtime/FilterBar.designtime",
			defaultAggregation: "filterItems",
			interfaces : [
				"sap.ui.mdc.IFilter"
			],
			properties: {

				/**
				 * Defines the path to the metadata retrieval class for the FilterBar.
				 * Note: this property shall not be bound.
				 * Note: this property has to be set during the FilterBar initialization and may not be changed afterwards.
				 */
				delegate: {
					type: "object",
					defaultValue: {
						name: "sap/ui/mdc/FilterBarDelegate",
						payload: {
							modelName: undefined,
							collectionName: ""
						}}
				},

				/**
				 * If set the search will be automatically triggered, when a filter value was changed.
				 * Note: is set the 'Go' button will not be displayed.
				 */
				liveMode: {
					type: "boolean",
					defaultValue: false
				},

				/**
				 * Handles visibility of the Go button on the FilterBar.
				 * Note: if property <code>liveMode</code> is set to true, this property will be ignored.
				 */
				showGoButton: {
					type: "boolean",
					defaultValue: true
				},

				/**
				 * Handles visibility of the 'Adapt Filters' button on the FilterBar.
				 * Note: if property <code>p13nMode</code> does not contain the value <code>'Item'</code>, this property will be ignored.
				 */
				showAdaptFiltersButton: {
					type: "boolean",
					defaultValue: true
				},

				/**
				 * Specifies the personalization options for the filter bar.<br>
				 *
				 * @since 1.74
				 */
				p13nMode: {
					type: "sap.ui.mdc.FilterBarP13nMode[]"
				},

				/**
				 * Specifies the filter conditions. This property is exclusive used for changes handling. Do not use it otherwise.
				 * Note: this property may only be used in the xml-view to specify an initial filters condition.
				 * Note: this property shall not be bound
				 *
				 * @since 1.66.0
				 */
				filterConditions: {
					type: "object",
					defaultValue: {}
				},

				/**
				 * used for binding of the text of the adapt filters button
				 */
				_filterCount: {
					type: "string",
					visibility: "hidden"
				},

				/**
				 * Specifies if the the personalization mode for filter item is supported.
				 */
				_p13nModeItem: {
					type: "boolean",
					visibility: "hidden",
					defaultValue: false
				},

				/**
				 * Specifies if the the personalization mode for filter condition is supported.
				 */
				_p13nModeValue: {
					type: "boolean",
					visibility: "hidden",
					defaultValue: false
				}
			},
			aggregations: {

				/**
				 * Contains all FilterBar filters.
				 */
				filterItems: {
					type: "sap.ui.mdc.FilterField",
					multiple: true
				},

				/**
				 * Contains eventual basic search field.
				 */
				basicSearchField: {
					type: "sap.ui.mdc.FilterField",
					multiple: false
				}
			},
			events: {

				/**
				 * This event is fired when the Go button is pressed.
				 */
				search: {
					conditions: {
						type: "object"   // map of "filterName": [ Conditions ]
					}
				},

				/**
				 * This event is fired when the Reset button is pressed.
				 */
				reset: {},

				/**
				 * This event is fired when a filter value was changed.
				 */
				filtersChanged: {
					filtersText: { // optional
						type: "string"
					}
				}
			}
		},
		renderer: function(oRm, oControl) {
			oRm.write("<div ");
			oRm.writeControlData(oControl);
			oRm.writeClasses();
			oRm.write(">");
			oRm.renderControl(oControl._getContent());
			oRm.write("</div>");
		}
	});

	FilterBar.INNER_MODEL_NAME = "$sap.ui.mdc.FilterBar";
	FilterBar.CONDITION_MODEL_NAME = "$filters";

	FilterBar.prototype.init = function() {

		this.addStyleClass("sapUiMdcBaseFilterBar");
		this._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");

		this._createInnerModel();

		this._oObserver = new ManagedObjectObserver(this._observeChanges.bind(this));

		this._oObserver.observe(this, {
			aggregations: [
				"filterItems"
			]
		});

		this._oFilterBarLayout = new AlignedFlowLayout();

		this._addButtons();

		this._clearChanges();

		this._aProperties = null;

		// This modification via URL parameter 'AdvancedFB' is only temporary for validation purposes for FilterBar personalization
		var oUriParameters = new UriParameters(window.location.href);
		this._bAdvancedDialog = oUriParameters.get("AdvancedFB") === "true";

		this._fResolveMetadataApplied = undefined;
		this._oMetadataAppliedPromise = new Promise(function(resolve) {
			this._fResolveMetadataApplied = resolve;
		}.bind(this));

		this._fResolveInitialFiltersApplied = undefined;
		this._oInitialFiltersAppliedPromise = new Promise(function(resolve) {
			this._fResolveInitialFiltersApplied  = resolve;
		}.bind(this));

		this._bIgnoreChanges = false;
	};


	FilterBar.prototype._getConditionModel = function() {
		return this._oConditionModel;
	};

	/**
	 * Returns the name of the inner FilterBar condition model.
	 * @public
	 * @returns {string} name the inner FilterBar condition model
	 */
	FilterBar.prototype.getConditionModelName = function() {
		return this._getConditionModelName();
	};

	FilterBar.prototype._getConditionModelName = function() {
		return  FilterBar.CONDITION_MODEL_NAME;
	};

	FilterBar.prototype._createConditionModel = function() {
		this._oConditionModel = new ConditionModel();
		this.setModel(this._oConditionModel, this._getConditionModelName());
	};

	FilterBar.prototype._getMetaModelName = function() {
		var oDelegate = this.getDelegate();
		if (oDelegate && oDelegate.payload && oDelegate.payload.hasOwnProperty("modelName")) {

			return this.getDelegate().payload.modelName === null ? undefined : this.getDelegate().payload.modelName ;
		}
		return null;
	};
	FilterBar.prototype._getEntitySetName = function() {
		var oDelegate = this.getDelegate();
		if (oDelegate && oDelegate.payload && oDelegate.payload.collectionName) {
			return this.getDelegate().payload.collectionName;
		}
		return null;
	};


	FilterBar.prototype.applySettings = function(mSettings, oScope) {
		var oFiltersRestriction;

		Control.prototype.applySettings.apply(this, arguments);

		this._createConditionModel();

		this._oConditionChangeBinding = this._oConditionModel.bindProperty("/conditions", this._oConditionModel.getContext("/conditions"));
		this._oConditionChangeBinding.attachChange(this._handleConditionModelChange, this);

		oFiltersRestriction = this.getFilterConditions();
		if (oFiltersRestriction && Object.keys(oFiltersRestriction).length > 0) {

			if (!this._oMetadataPromise) {
				this._oMetadataPromise = this._retrieveMetadata();
			}

			Promise.all([this._oMetadataAppliedPromise]).then(function() {
				this._applyInitialFilterConditions();
			}.bind(this));
		} else {
			this._fResolveInitialFiltersApplied();
		}
	};

	FilterBar.prototype.setP13nMode = function(aMode) {
		var aOldMode = this.getP13nMode();
		this.setProperty("p13nMode", aMode || [], false);

		aMode && aMode.forEach(function(sMode) {
			if (!aOldMode || aOldMode.indexOf(sMode) < 0) {
				this._setP13nMode(sMode, true);
			}
		}.bind(this));
		aOldMode && aOldMode.forEach(function(sMode) {
			if (!aMode || aMode.indexOf(sMode) < 0) {
				this._setP13nMode(sMode, false);
			}
		}.bind(this));

		return this;
	};

	FilterBar.prototype._setP13nMode = function(sMode, bValue) {
		switch (sMode) {
			case "Item":  this._setP13nModeItem(bValue); break;
			case "Value": this._setP13nModeValue(bValue); break;
		}
	};

	FilterBar.prototype._getP13nModeItem = function() {
		return this._oModel.getProperty("/_p13nModeItem");
	};
	FilterBar.prototype._setP13nModeItem = function(bValue) {
		this._oModel.setProperty("/_p13nModeItem", bValue, true);
	};
	FilterBar.prototype._getP13nModeValue = function() {
		return this._oModel.getProperty("/_p13nModeValue");
	};
	FilterBar.prototype._setP13nModeValue = function(bValue) {
		this._oModel.setProperty("/_p13nModeValue", bValue, false);
	};


	FilterBar.prototype._createInnerModel = function() {
		this._oModel = new ManagedObjectModel(this);
		this.setModel(this._oModel, FilterBar.INNER_MODEL_NAME);
		return this;
	};

	FilterBar.prototype._addButtons = function() {

		if (this._oFilterBarLayout) {

			this.setProperty("_filterCount", this._oRb.getText("filterbar.ADAPT"), false);

			this._btnAdapt = new Button(this.getId() + "-btnAdapt", {
				text: "{" + FilterBar.INNER_MODEL_NAME + ">/_filterCount}",
				press: this.onAdaptFilters.bind(this)
			});
			this._btnAdapt.setModel(this._oModel, FilterBar.INNER_MODEL_NAME);

			this._btnAdapt.bindProperty("visible", {
				parts: [
					{
						path: '/showAdaptFiltersButton',
						model: FilterBar.INNER_MODEL_NAME
					}, {
						path: "/_p13nModeItem",
						model: FilterBar.INNER_MODEL_NAME
					}
				],
				formatter: function(bValue1, bValue2) {
					return bValue1 && bValue2;
				}
			});
			this._btnAdapt.addStyleClass("sapUiMdcBaseFilterBarButtonPaddingRight");

			this._oFilterBarLayout.addEndContent(this._btnAdapt);

			this._btnSearch = new Button(this.getId() + "-btnSearch", {
				text: this._oRb.getText("filterbar.GO"),
				press: this.onSearch.bind(this),
				type: ButtonType.Emphasized
			});
			this._btnSearch.setModel(this._oModel, FilterBar.INNER_MODEL_NAME);
			this._btnSearch.bindProperty("visible", {
				parts: [
					{
						path: '/showGoButton',
						model: FilterBar.INNER_MODEL_NAME
					}, {
						path: "/liveMode",
						model: FilterBar.INNER_MODEL_NAME
					}
				],
				formatter: function(bValue1, bValue2) {
					return bValue1 && !bValue2;
				}
			});
			this._oFilterBarLayout.addEndContent(this._btnSearch);
		}
	};


	FilterBar.prototype._initializeProvider = function() {
		var oDelegate = this.getDelegate();
		if (oDelegate) {
			var sDelegatePath = oDelegate.name;
			if (!sDelegatePath) {
				return Promise.resolve(null);
			}

			return this._loadProvider(sDelegatePath);
		} else {
			Log.error("not able to obtain the delegate.");
			return Promise.resolve(null);
		}
	};

	FilterBar.prototype._loadProvider = function(sDelegate) {
		return new Promise(function(fResolve) {
			sap.ui.require([
				sDelegate
			], function(Provider) {
				fResolve(Provider);
			});
		});
	};

	FilterBar.prototype.onAdaptFilters = function(oEvent) {
		this.prepareAndShowDialog();
	};

	FilterBar.prototype._afterSettingsDone = function() {
		delete this._settingsTriggered;
	};

	FilterBar.prototype._getAssignedFilterNames = function() {
		var oConditions, sName, aFilterNames = null, oModel = this._getConditionModel(), oFilterField;
		if (oModel) {
			oConditions = oModel.getAllConditions();
			aFilterNames = [];

			for (sName in oConditions) {

				if (aFilterNames.indexOf(sName) < 0) {
					var aConditions = oModel.getConditions(sName);
					if (aConditions && aConditions.length > 0) {

						if (sName === "$search") {
							aFilterNames.push(this._oRb.getText("filterbar.ADAPT_SEARCHTERM"));
						} else {

							oFilterField = this._getFilterField(sName);
							if (oFilterField) {
								if (oFilterField.getVisible()) {
									aFilterNames.push(sName);
								}
							} else {
								aFilterNames.push(sName);
							}
						}
					}
				}
			}
		}

		return aFilterNames;
	};

	FilterBar.prototype._getAssignedFiltersText = function(aFilterNames) {
		var sAssignedFiltersText, aMaxFilterNames;

		aFilterNames = aFilterNames || [];

		// if basic search is available - first entry
		if (aFilterNames.length > 5) {
			aMaxFilterNames = aFilterNames.slice(0, 5);
			aMaxFilterNames.push("...");
		} else {
			aMaxFilterNames = aFilterNames;
		}

		sAssignedFiltersText = Object.keys(aMaxFilterNames).map(function(i) {return aMaxFilterNames[i];}).join(", ");

		if (aFilterNames.length) {
			return this._oRb.getText("filterbar.ADAPT_FILTERED", [
				aFilterNames.length, sAssignedFiltersText
			]);
		}

		return this._oRb.getText("filterbar.ADAPT_NOTFILTERED");
	};

	/**
	 * Returns a summary string that contains information about the filters currently assigned. The string starts with "Filtered By", followed by the number of set filters and their labels.<br>
	 * Example:<br>
	 * <i>Filtered By (3): Company Code, Fiscal Year, Customer</i>
	 * @public
	 * @returns {string} A string that contains the number of set filters and their names
	 */
	FilterBar.prototype.getAssignedFiltersText = function() {
		return this._getAssignedFiltersText(this._getAssignedFilterNames());
	};

	FilterBar.prototype._handleConditionModelChange = function(oEvent) {
		if (!this._bIgnoreChanges) {
			this._handleAssignedFilterNames(oEvent);
			this._handleCalculateDifferences();
		}
	};

	FilterBar.prototype._handleCalculateDifferences = function(aShadowConditions, oCModel) {
		var aPrevState = merge({}, this.getProperty("filterConditions"));
		this._calculateConditionsDiffsToPrevStateAndSave(aPrevState, this._getConditionModel());
	};

	FilterBar.prototype._calculateConditionsDiffsToPrevState = function(aPreviousConditions, oCModel) {

		var i, sFieldPath, oChange, aConditions, aChanges = [], aDeleteFieldPath = [];

		if (oCModel) {

			aConditions = this._getConditions(oCModel);

			if (!deepEqual(aConditions, aPreviousConditions)) {
				for (sFieldPath in aConditions) {
					if (!aPreviousConditions[sFieldPath]) {
						for (i = 0; i < aConditions[sFieldPath].length; i++) {
							oChange = this._createAddRemoveConditionChangeWithFieldPath("addCondition", sFieldPath, aConditions[sFieldPath][i]);
							if (oChange) {
								aChanges.push(oChange);
							}
						}
					} else {
						aChanges = aChanges.concat(this._calculateConditionsDifference(sFieldPath, aConditions, aPreviousConditions));
						aDeleteFieldPath.push(sFieldPath);
					}
				}

				for (i = 0; i < aDeleteFieldPath.length; i++) {
					delete aConditions[aDeleteFieldPath[i]];
					delete aPreviousConditions[aDeleteFieldPath[i]];
				}


				for (sFieldPath in aPreviousConditions) {
					if (!aConditions[sFieldPath]) {
						for (i = 0; i < aPreviousConditions[sFieldPath].length; i++) {
							oChange = this._createAddRemoveConditionChangeWithFieldPath("removeCondition", sFieldPath, aPreviousConditions[sFieldPath][i]);
							if (oChange) {
								aChanges.push(oChange);
							}
						}
					}
				}
			}
		}

		return aChanges;
	};

	FilterBar.prototype._calculateConditionsDiffsToPrevStateAndSave = function(aPreviousConditions, oCModel) {

		if (!this._getP13nModeValue()) {
			return;
		}

		var aChanges = this._calculateConditionsDiffsToPrevState(aPreviousConditions, oCModel);
		if (aChanges.length > 0) {
			this._aChanges = this._aChanges.concat(aChanges);
			this._storeChanges();
		}
	};

	FilterBar.prototype._determineType = function(sFieldPath) {
			var oPI, oFF = this._getFilterField(sFieldPath);
			if (oFF) {
				return oFF;
			}
			oPI = this._getPropertyByName(sFieldPath);
			if (oPI) {
				return oPI;
			}

			Log.error("not able to resolve metadata for " + sFieldPath);
			return null;
	};

	FilterBar.prototype._calculateConditionsDifference = function(sFieldPath, aOrigConditions, aOrigShadowConditions) {

		var sType, oFormatOptions, oConstraints, oObj, aChanges = [];

		var aConditions = aOrigConditions[sFieldPath]  ? merge([], aOrigConditions[sFieldPath]) : [];
		var aShadowConditions = aOrigShadowConditions[sFieldPath] ? merge([], aOrigShadowConditions[sFieldPath]) : [];

		if (deepEqual(aConditions, aShadowConditions)) {
			return aChanges;
		}

		this._removeSameConditions(aConditions, aShadowConditions);

		if ((aConditions.length > 0) || (aShadowConditions.length > 0)) {

			oObj = this._determineType(sFieldPath);
			if (oObj) {
				if (oObj.isA && oObj.isA("sap.ui.mdc.FilterField")) {
					sType = oObj.getDataType();
					oFormatOptions = oObj.getDataTypeFormatOptions();
					oConstraints = oObj.getDataTypeConstraints();
				} else  {
					sType = oObj.type;
					oFormatOptions = oObj.formatOptions;
					oConstraints = oObj.constraints;
				}
			}

			aConditions.forEach(function(oCondition) {
				oCondition = ConditionUtil.toExternal(oCondition, sType, oFormatOptions, oConstraints);
			});

			aShadowConditions.forEach(function(oCondition) {
				aChanges.push(this._createAddRemoveConditionChange("removeCondition", sFieldPath, sType, oFormatOptions, oConstraints, oCondition));
			}.bind(this));

			aConditions.forEach(function(oCondition) {
				aChanges.push(this._createAddRemoveConditionChange("addCondition", sFieldPath, sType, oFormatOptions, oConstraints, oCondition));
			}.bind(this));

		}

		return aChanges;
	};


	FilterBar.prototype._cleanupConditions = function(aConditions) {
		if (aConditions) {
			aConditions.forEach( function(oCondition) {
				if (oCondition.hasOwnProperty("isEmpty")) {
					delete oCondition.isEmpty;
				}
			});
		}
	};

	FilterBar.prototype._strigifyConditions = function(sFieldPath, aConditions) {


		var oProperty = this._getPropertyByName(sFieldPath);
		var aResultConditions = aConditions;

		if (oProperty && aConditions) {
			aResultConditions = [];

			aConditions.forEach( function(oCondition) {
				if (oCondition && oCondition.values && oCondition.values.length > 0) {
					var oResultCondition = ConditionUtil.toExternal(oCondition, oProperty.type, oProperty.formatOptions, oProperty.constraints);
					aResultConditions.push(oResultCondition);
				}
			});
		}

		return aResultConditions;
	};

	FilterBar.prototype._removeSameConditions = function(aConditions, aShadowConditions) {
		var bRunAgain;

		do  {
			bRunAgain = false;

			for (var i = 0; i < aConditions.length; i++) {
				for (var j = 0; j < aShadowConditions.length; j++) {
					if (deepEqual(aConditions[i], aShadowConditions[j])) {
						aConditions.splice(i, 1);
						aShadowConditions.splice(j, 1);
						bRunAgain = true;
						break;
					}
				}

				if (bRunAgain) {
					break;
				}
			}
		}  while (bRunAgain);
	};

	FilterBar.prototype._handleAssignedFilterNames = function(oEvent) {

		var oObj = {}, aFilterNames = this._getAssignedFilterNames();
		if (aFilterNames) {
			if (this._btnAdapt) {
				this.setProperty("_filterCount", this._oRb.getText(aFilterNames.length ? "filterbar.ADAPT_NONZERO" : "filterbar.ADAPT", aFilterNames.length), false);
				//TODO: waiting for a public solution
				this._oFilterBarLayout.reflow();
			}

			oObj.filtersText = this._getAssignedFiltersText(aFilterNames);

			this.fireFiltersChanged(oObj);

			if (this.getLiveMode()) {
				this.fireSearch();
			}
		}
	};

	FilterBar.prototype.onReset = function(oEvent) {
		this.fireReset();
	};
	FilterBar.prototype.onSearch = function(oEvent) {
		this.fireSearch();
	};

	FilterBar.prototype.fireSearch = function(oEvent) {
		var mConditions = this.getConditions(true);
		this.fireEvent("search", {conditions: mConditions });
	};

	/**
	 * Returns the conditions of the inner condition model.
	 * This method may only be used for value help scenarios.
	 * @protected
	 * @param {boolean} bDoNotCleanUp indicates if the returning conditions should remove secondary information
	 * @returns {map} a map containing the conditions.
	 */
	FilterBar.prototype.getConditions = function(bDoNotCleanUp) {
		return this._getConditions(this._getConditionModel(), bDoNotCleanUp);
	};

	FilterBar.prototype._getConditions = function(oModel, bDoNotCleanUp) {
		var mConditions = {};
		if (oModel) {
			var aAllConditions = oModel.getAllConditions();
			for (var sFieldPath in aAllConditions) {
				if (aAllConditions[sFieldPath] && (aAllConditions[sFieldPath].length > 0)) {
					mConditions[sFieldPath] = merge([], aAllConditions[sFieldPath]);
					if (!bDoNotCleanUp) {
						this._cleanupConditions(mConditions[sFieldPath]);
						var aFieldConditions = this._strigifyConditions(sFieldPath, mConditions[sFieldPath]);
						mConditions[sFieldPath] = aFieldConditions;
					}
				}
			}
		}

		return mConditions;
	};

	/**
	 * Allows the settings of conditions for the inner condition model.
	 * This method will only be called for filling the in-parameters for value help scenarios.
	 * @protected
	 * @param {map} mConditions - a map containing the conditions
	 */
	FilterBar.prototype.setConditions = function(mConditions) {
		var oModel = this._getConditionModel();
		if (oModel) {
			for (var sFieldPath in mConditions) {

				oModel.removeAllConditions(sFieldPath);

				var aConditions = mConditions[sFieldPath];

				 /* eslint-disable no-loop-func */
				aConditions.forEach(function(oCondition) {
					oModel.addCondition(sFieldPath, oCondition);
				});
				 /* eslint-enable no-loop-func */
			}
		}
	};


	FilterBar.prototype.prepareAndShowDialog = function() {

		if (!this._oMetadataPromise) {
			this._oMetadataPromise = this._retrieveMetadata();
		}

		return this._oMetadataAppliedPromise.then(function() {

			var aControlPromises = [], aFilterItemWithPromises = [], aItems = this._setItemsForAdaptFiltersDialog();

			if (aItems && aItems.length > 0) {
				aItems.forEach(function(oItem) {
					if (oItem.control instanceof Promise) {
						aControlPromises.push(oItem.control);
						aFilterItemWithPromises.push(oItem);
					}
				});

				if (aControlPromises.length > 0) {

					return Promise.all(aControlPromises).then(function(aResolvedFilterItems) {
						aControlPromises.forEach(function(oPromise, nIdx) {
							var oItem = aFilterItemWithPromises[nIdx];
							//TODO: consider providing a parameter for the item creation in the delegate to avoid unnecessary cloning
							var oFF = aResolvedFilterItems[nIdx];
							oItem.control = oFF.clone();
							/*
							* The destroying is currently necessary for the 'AdvancedFB' mode,
							* as many openings of the dialog will trigger duplicate id errors.
							* without the FilterFields, the whole cloning is not necessary.
							* This should be removed, as soon as the creation of FilterFields
							* for the personalization is not going to be considered.
							*/
							aResolvedFilterItems[nIdx].destroy();

							oItem.control.setVisible(true);

							oItem.control.bindProperty("conditions", {
								path: "$cmodel>/conditions/" + oItem.name
							});

							oItem.visible = false;
						});

						return this._showFiltersDialog(aItems);
					}.bind(this));

				} else {
					return Promise.resolve().then(function() {
						return this._showFiltersDialog(aItems);
					}.bind(this));
				}
			}
		}.bind(this));
	};

	FilterBar.prototype._showFiltersDialog = function (aItems) {

		this._clearChanges();

		var oJSONModel = new JSONModel({
			showResetEnabled: false,
			items: aItems
		});

		if (!this._settingsTriggered) {
			this._settingsTriggered = true;
			return p13nUtil.showAdaptFilters(this, this._btnAdapt, oJSONModel.getData(), this._afterSettingsDone.bind(this), this._bAdvancedDialog).then(function(oAdaptFiltersPanel){
				this._oAdaptFiltersPanel = oAdaptFiltersPanel;
				this._oAdaptFiltersPanel.setAdaptFilterPanelColumns(this._bAdvancedDialog);
				if (this._bAdvancedDialog){
					var oAdaptDialogConditionModel = this._getConditionModel().clone();
					oAdaptFiltersPanel.setAdvancedMode(true);
					oAdaptFiltersPanel.setModel(oAdaptDialogConditionModel, "$cmodel");
					oAdaptFiltersPanel.insertFilterItems(false);
					oAdaptFiltersPanel.attachChange(function(oEvent){
						//in case the user wants to save the changes, we take over the stuff from p13n condition model
						var oModel = oAdaptFiltersPanel.getModel("$cmodel");
						this._calculateConditionsDiffsToPrevStateAndSave(this._getConditionModel().getAllConditions(), oModel);
					}.bind(this));
				}
				return oAdaptFiltersPanel;
			}.bind(this));
		}

	};

	FilterBar.prototype._createFilterVisibilityChangeContent = function(sId, sName) {
		return {
			id: sId,
			name: sName
		};
	};

	FilterBar.prototype._createAddRemoveConditionChangeWithFieldPath = function(sChangeType, sFieldPath, oCondition) {

		var oObj = this._determineType(sFieldPath);
		if (!oObj) {
			return null;
		}

		if (oObj.isA && oObj.isA("sap.ui.mdc.FilterField")) {
			return this._createAddRemoveConditionChangeWithField(sChangeType, oObj, oCondition);
		} else {
			return this._createAddRemoveConditionChange(sChangeType, sFieldPath, oObj.type, oObj.formatOptions, oObj.constraints, oCondition);
		}
	};

	FilterBar.prototype._createAddRemoveConditionChange = function(sChangeType, sFieldPath, sType, oFormatOptions, oConstraints, oCondition, aOutConditions, nIndex) {

		var oConditionExternalValue = oCondition;

		if (oCondition && oCondition.values && oCondition.values.length > 0) {
			oConditionExternalValue = ConditionUtil.toExternal(oCondition, sType, oFormatOptions, oConstraints);
		}

		var oChange = {
			selectorElement: this,
			changeSpecificData: {
				changeType: sChangeType,
				content: {
					name: sFieldPath,
					condition: oConditionExternalValue,
					outConditions: aOutConditions ? aOutConditions : null
				}
			}
		};

		return oChange;
	};

	FilterBar.prototype._createAddRemoveConditionChangeWithField = function(sChangeType, oFilterField, oCondition, aOutConditions, nIndex) {
		return this._createAddRemoveConditionChange(sChangeType, oFilterField.getFieldPath(), oFilterField.getDataType(), oFilterField.getDataTypeFormatOptions(), oFilterField.getDataTypeConstraints(), oCondition, aOutConditions, nIndex);
	};

	FilterBar.prototype._clearChanges = function() {
		this._aChanges = [];
	};

	FilterBar.prototype._storeChanges = function() {
		if (!this._getP13nModeItem() && !this._getP13nModeValue()) {
			this._clearChanges();
			return;
		}

		if (this._aChanges && this._aChanges.length) {
			var bHasVariantManagement = FlexRuntimeInfoAPI.hasVariantManagement({element: this});

			try {

				ControlPersonalizationWriteAPI.add({
					changes: this._aChanges,
					ignoreVariantManagement: !bHasVariantManagement
				});
			} catch (ex) {
				Log.error("error while saving changes - " + ex.message);
			}

			this._clearChanges();
		}
	};



	FilterBar.prototype._setItemsForAdaptFiltersDialog = function() {
		var aFilterItems = this.getFilterItems();

		if (this._getNonHiddenPropertyInfoSet().length > 0) {


			return this._getNonHiddenPropertyInfoSet().map(function(oProperty, iIndex) {

				var sKey = IdentifierUtil.getPropertyKey(oProperty);
				var oFilterField = this._getFilterField(sKey);
				var iPosition = aFilterItems.indexOf(oFilterField);
				var oFilterItem = null, bVisible = false;

				if (this._bAdvancedDialog) {
					if (oFilterField) {
						oFilterItem = oFilterField.clone();
					} else {
						oFilterItem = this._oDelegate.beforeAddFilterFlex(sKey, this);
					}

					if (!oFilterItem) {
						Log.error("_setItemsForAdaptFiltersDialog: not able to dermine/create a filter item for property: '" + sKey + "'");
					}
				} else {
					oFilterItem = oFilterField || undefined;
				}

				if (oFilterItem && oFilterItem.isA && oFilterItem.isA("sap.ui.mdc.FilterField")) {
					oFilterItem.setVisible(true);

					if (this._bAdvancedDialog) {
						oFilterItem.bindProperty("conditions", {
							path: "$cmodel>/conditions/" + sKey
						});
					}

					bVisible = (iPosition > -1) && oFilterField.getVisible();
				}

				return {
					id: bVisible ? oFilterItem.getId() : undefined,
					name: sKey,
					label: oProperty.label,
					isFiltered: this.getConditions()[sKey] && !this._bAdvancedDialog ? true : false,
					tooltip: oProperty.tooltip,
					groupLabel: oProperty.groupLabel,
					required: oProperty.required,
					position: iPosition,
					selected: bVisible, // Assumption: all filter items existing in the filterItems aggregation are visible
					control: oFilterItem
				};
			}.bind(this));

		}

	};

	FilterBar.prototype._getContent = function() {
		return this._oFilterBarLayout;
	};

	FilterBar.prototype._insertFilterFieldtoContent = function(oFilterItem, nIdx) {

		if (!FilterItemLayout) {
			return;
		}

		var oLayoutItem = new FilterItemLayout();
		oLayoutItem.setFilterField(oFilterItem);

		this._oFilterBarLayout.insertContent(oLayoutItem, nIdx);
	};

	FilterBar.prototype._filterItemInserted = function(oFilterField) {

		if (!oFilterField.getVisible()) {
			return;
		}

		if (oFilterField.setWidth) {
			oFilterField.setWidth("");
		}

		if (this._isChangeApplying()) {
			this._suspendBinding(oFilterField);
		}

		this._applyFilterItemInserted(oFilterField);
	};

	FilterBar.prototype._applyFilterItemInserted = function(oFilterField) {
		var nIndex, iIndex;

		iIndex = this.indexOfAggregation("filterItems", oFilterField);
		if (this.getAggregation("basicSearchField")) {
			iIndex++;
		}

		nIndex = iIndex;
		var aFilterFields = this.getFilterItems();
		for (var i = 0; i < nIndex; i++) {
			if (!aFilterFields[i].getVisible()) {
				iIndex--;
			}
		}

		this._insertFilterFieldtoContent(oFilterField, iIndex);

		if (!this._oObserver.isObserved(oFilterField, {properties: ["visible"]})) {
			this._oObserver.observe(oFilterField, {properties: ["visible"]});
		}
	};

	FilterBar.prototype._filterItemRemoved = function(oFilterItem) {
		this._applyFilterItemRemoved(oFilterItem.getFieldPath());
	};

	FilterBar.prototype._applyFilterItemRemoved = function(sFieldPath) {
		this._removeFilterFieldFromContentByName(sFieldPath);
	};

	FilterBar.prototype._removeFilterFieldFromContent = function(oFilterItem) {
		this._removeFilterFieldFromContentByName(oFilterItem.getFieldPath());
	};

	FilterBar.prototype._removeFilterFieldFromContentByName = function(sFieldPath) {
		var oLayoutItem = this._getFilterItemLayoutByName(sFieldPath);

		if (oLayoutItem) {
			this._oFilterBarLayout.removeContent(oLayoutItem);
			oLayoutItem.destroy();
		}
	};

	FilterBar.prototype._observeChanges = function(oChanges) {

		if (oChanges.type === "aggregation" && oChanges.name === "filterItems") {

			switch (oChanges.mutation) {
				case "insert":
					this._filterItemInserted(oChanges.child);
					break;
				case "remove":
					this._filterItemRemoved(oChanges.child);
					break;
				default:
					Log.error("operation " + oChanges.mutation + " not yet implemented");
			}
		} else if (oChanges.type === "property") {
			var oFilterField;

			if (oChanges.object.isA && oChanges.object.isA("sap.ui.mdc.FilterField")) { // only visible is considered
				oFilterField = oChanges.object; //this._getFilterField(oChanges.object.getFieldPath());
				if (oFilterField) {
					if (oChanges.current) {
						this._filterItemInserted(oFilterField);
					} else {
						this._filterItemRemoved(oFilterField);
					}

					this._oFilterBarLayout.rerender();
				}
			}
		}
	};

	FilterBar.prototype._getFilterItemLayout = function(oFilterField) {
		return this._getFilterItemLayoutByName(oFilterField.getFieldPath());
	};
	FilterBar.prototype._getFilterItemLayoutByName = function(sFieldPath) {
		var oFilterItemLayout = null;

		this._oFilterBarLayout.getContent().some(function(oItemLayout) {
			if (oItemLayout._getFieldPath() === sFieldPath) {
				oFilterItemLayout = oItemLayout;
			}

			return oFilterItemLayout !== null;
		});

		return oFilterItemLayout;
	};

	FilterBar.prototype._getFilterField = function(sName) {
		var oFilterField = null;
		this.getFilterItems().some(function(oFilterItem) {
			if (oFilterItem && oFilterItem.getFieldPath && (oFilterItem.getFieldPath() === sName)) {
				oFilterField = oFilterItem;
			}

			return oFilterField !== null;
		});

		return oFilterField;
	};


	FilterBar.prototype._retrieveMetadata = function() {

		return new Promise(function(resolve) {
			Promise.all([ this._initializeProvider()]).then(function(aArgs) {

					if (!this._bIsBeingDestroyed) {

						this._oDelegate = aArgs[0];

						this._aProperties = [];

						if (this._oDelegate && this._oDelegate.fetchProperties) {
							try {
								this._oDelegate.fetchProperties(this).then(function(aProperties) {
									this._aProperties = aProperties;

									this._fResolveMetadataApplied();
								}.bind(this), function(sMsg) {
									Log.error(sMsg);
									this._fResolveMetadataApplied();
								}.bind(this));
							} catch (ex) {
								Log.error("Exception during fetchProperties occured: " + ex.message);
								this._fResolveMetadataApplied();
							}
						} else {
							Log.error("Provided delegate '" + this.getDelegate().path + "' not valid.");
							this._fResolveMetadataApplied();
						}
					}

					resolve();

				}.bind(this));
		}.bind(this));
	};



	FilterBar.prototype.setBasicSearchField = function(oBasicSearchField) {

		var oOldBasicSearchField = this.getAggregation("basicSearchField");
		if (oOldBasicSearchField) {
			this._removeFilterFieldFromContent(oOldBasicSearchField);
		}

		this.setAggregation("basicSearchField", oBasicSearchField);

		if (oBasicSearchField) {

			if (!this._oObserver.isObserved(oBasicSearchField, {properties: ["visible"]})) {
				this._oObserver.observe(oBasicSearchField, {properties: ["visible"]});
			}

			this._insertFilterFieldtoContent(oBasicSearchField, 0);
		}

		return this;
	};


	FilterBar.prototype.getPropertyInfoSet = function() {
		return this._aProperties || [];
	};

	FilterBar.prototype._getNonHiddenPropertyInfoSet = function() {
		var aVisibleProperties = [];
		this.getPropertyInfoSet().every(function(oProperty) {
			if (!oProperty.hiddenFilter) {

				if (IdentifierUtil.getPropertyKey(oProperty) !== "$search") {
					aVisibleProperties.push(oProperty);
				}
			}

			return true;
		});

		return aVisibleProperties;
	};


	FilterBar.prototype._getNonHiddenPropertyByName = function(sName) {
		var oProperty = null;
		this._getNonHiddenPropertyInfoSet().some(function(oProp) {
			if (IdentifierUtil.getPropertyKey(oProp) === sName) {
				oProperty = oProp;
			}

			return oProperty != null;
		});

		return oProperty;
	};

	FilterBar.prototype._getPropertyByName = function(sName) {
		var oProperty = null;
		this.getPropertyInfoSet().some(function(oProp) {
			if (IdentifierUtil.getPropertyKey(oProp) === sName) {
				oProperty = oProp;
			}

			return oProperty != null;
		});

		return oProperty;
	};


	FilterBar.prototype.applyConditionsAfterChangesApplied = function() {
		if (this._isChangeApplying()) {
			return;
		}
		this._bIgnoreChanges = true;

		var aFilterFields = this.getFilterItems();
		aFilterFields.forEach( function(oFilterField) {
			this._suspendBinding(oFilterField);
		}.bind(this));

		// Wait until all changes have been applied
		this._oFlexPromise = FlexRuntimeInfoAPI.waitForChanges({element: this});
		//this._bIgnoreChanges = true;

		Promise.all([this._oFlexPromise, this._oInitialFiltersAppliedPromise]).then(function(vArgs) {

			this._applyFilterConditionsChanges();

			this._resumeBindings();

			this._oFlexPromise = null;

			if (!this._iShadowModelResolveTimer && !this._iShadowModelTimer) {
				this._iShadowModelTimer = setTimeout(function() {
					delete this._iShadowModelTimer;
					this._createShadowModel();
				}.bind(this), 0);
			}

		}.bind(this));
	};

	FilterBar.prototype.waitForInitialFiltersApplied = function() {
		return this._oInitialFiltersAppliedPromise;
	};

	FilterBar.prototype._suspendBinding = function(oFilterField) {

		if (oFilterField) {
			var oBinding = oFilterField.getBinding("conditions");
			if (oBinding) {
				if (!this._aBindings) {
					this._aBindings = [];
				}
				oBinding.suspend();
				this._aBindings.push(oFilterField);
			}
		}
	};

	FilterBar.prototype._resumeBindings = function() {
		if (this._aBindings) {
			this._aBindings.forEach(function(oFilterField) {
				if (!oFilterField.bIsDestroy) {
					var oBinding = oFilterField.getBinding("conditions");
					if (oBinding) {
						oBinding.resume();
					}
				}
			});

			this._aBindings = null;
		}
	};


	FilterBar.prototype._isChangeApplying = function() {
		return  !!this._oFlexPromise;
	};

	FilterBar.prototype._applyInitialFilterConditions = function() {

		this._bIgnoreChanges = true;

		this._applyFilterConditionsChanges();

		if (!this._iShadowModelResolveTimer) {
			if (this._iShadowModelTimer) {
				// shadow model is created here too, do not need twice
				clearTimeout(this._iShadowModelTimer);
				delete this._iShadowModelTimer;
			}
			this._iShadowModelResolveTimer = setTimeout(function() {
				delete this._iShadowModelResolveTimer;
				this._createShadowModel();

				this._fResolveInitialFiltersApplied();
			}.bind(this), 0);
		}

	};

	FilterBar.prototype._applyFilterConditionsChanges = function() {

		var aConditions, aConditionsData, oConditionModel, oObj, sType, oFormatOptions, oConstraints;

		var mSettings = this.getProperty("filterConditions");
		if (Object.keys(mSettings).length > 0) {

			aConditionsData = merge([], mSettings);
			oConditionModel = this._getConditionModel();


			oConditionModel.removeAllConditions(); //TODO: needs more consideration.


			if (aConditionsData) {
				for ( var sFieldPath in aConditionsData) {
					aConditions = aConditionsData[sFieldPath];

					oObj = this._determineType(sFieldPath);
					if (oObj) {
						if (oObj.isA && oObj.isA("sap.ui.mdc.FilterField")) {
							sType = oObj.getDataType();
							oFormatOptions = oObj.getDataTypeFormatOptions();
							oConstraints = oObj.getDataTypeConstraints();
						} else {
							sType = oObj.type;
							oFormatOptions = oObj.formatOptions;
							oConstraints = oObj.constraints;
						}

						/* eslint-disable no-loop-func */
						aConditions.forEach(function(oCondition) {
							oCondition = ConditionUtil.toInternal(oCondition, sType, oFormatOptions, oConstraints);
							var oNewCondition = Condition.createCondition(oCondition.operator, oCondition.values);
							oConditionModel.addCondition(sFieldPath, oNewCondition);
						});
						/* eslint-enable no-loop-func */
					}
				}
			}
		}
	};

	FilterBar.prototype._createShadowModel = function() {
		var aConditions, mSettings = {};
		var oConditionModel = this._getConditionModel();

		var aConditionsModelData = this._getConditions(oConditionModel);

		for (var sFieldPath in aConditionsModelData) {
			 aConditions = aConditionsModelData[sFieldPath];

			 /* eslint-disable no-loop-func */
			 aConditions.forEach(function(oCondition) {

				 if (!mSettings[sFieldPath]) {
					 mSettings[sFieldPath] = [];
				 }
				 mSettings[sFieldPath].push(oCondition);
			 });
			 /* eslint-enable no-loop-func */


			 this._cleanupConditions(mSettings[sFieldPath]);
		}

		this.setProperty("filterConditions", mSettings);

		this._bIgnoreChanges = false;

		this._handleConditionModelChange();
	};

	FilterBar.prototype._getView = function() {
		return IdentifierUtil.getView(this);
	};

	/**
	 * Returns array of model Filter instances from the inner ConditionModel.
	 *
	 * @public
	 * @returns {sap.ui.model.Filter[]} Array containing model filters or empty.
	 */
	FilterBar.prototype.getFilters = function() {
		return this._getConditionModel() ? this._getConditionModel().getFilters() : [];
	};

	/**
	 * Returns the value of the basic search condition that is taken from the inner <code>ConditionModel</code>.
	 *
	 * @public
	 * @returns {string} Value of search condition or empty
	 */
	FilterBar.prototype.getSearch = function() {
		var aSearchConditions = this._getConditionModel() ? this._getConditionModel().getConditions("$search") : [];
		return aSearchConditions[0] ? aSearchConditions[0].values[0] : "";
	};

	FilterBar.prototype.exit = function() {

		Control.prototype.exit.apply(this, arguments);

		if (this._oFilterBarLayout) {
			this._oFilterBarLayout.destroy();
			this._oFilterBarLayout = null;
		}

		this._btnAdapt = undefined;
		this._btnSearch = undefined;

		this._oRb = null;

		if (this._oModel) {
			this._oModel.destroy();
			this._oModel = null;
		}

		if (this._oConditionChangeBinding) {
			this._oConditionChangeBinding.detachChange(this._handleConditionModelChange, this);
			this._oConditionChangeBinding = null;
		}

		if (this._oConditionModel) {
			this._oConditionModel.destroy();
			this._oConditionModel = null;
		}

		this._oObserver.disconnect();
		this._oObserver = undefined;

		this._oDelegate = null;
		this._aProperties = null;

		this._oFlexPromise = null;
		this._oMetadataPromise = null;

		this._fResolveMetadataApplied = undefined;
		this._oMetadataAppliedPromise = null;

		this._fResolveInitialFiltersApplied = undefined;
		this._oInitialFiltersAppliedPromise = null;

		if (this._iShadowModelTimer) {
			clearTimeout(this._iShadowModelTimer);
			delete this._iShadowModelTimer;
		}

		if (this._iShadowModelResolveTimer) {
			clearTimeout(this._iShadowModelResolveTimer);
			delete this._iShadowModelResolveTimer;
		}

		this._aChanges = null;
		this._oView = null;
		this._aBindings = null;
	};

	return FilterBar;

});
