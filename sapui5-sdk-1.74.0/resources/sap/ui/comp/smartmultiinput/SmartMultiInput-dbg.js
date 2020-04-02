/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/m/library",
	"sap/m/List",
	"sap/m/Popover",
	"sap/m/StandardListItem",
	'sap/m/MultiInput',
	'sap/m/MultiComboBox',
	'sap/m/Token',
	'sap/m/Tokenizer',
	'sap/ui/comp/smartfield/SmartField',
	'sap/ui/comp/odata/MetadataAnalyser',
	"sap/ui/model/ParseException",
	"sap/ui/model/ValidateException",
	'sap/ui/model/BindingMode',
	'sap/ui/comp/odata/ODataType',
	'sap/ui/comp/providers/ValueHelpProvider',
	"sap/ui/comp/util/FormatUtil",
	"sap/ui/core/format/DateFormat",
	"sap/ui/comp/smartfilterbar/FilterProvider",
	"sap/base/Log",
	"sap/base/util/deepEqual",
	"sap/ui/comp/library",
	"sap/ui/core/library",
	"sap/ui/core/ResizeHandler"
], function(
	MLibrary, List, Popover, StandardListItem, MultiInput, MultiComboBox, Token, Tokenizer, SmartField,
	MetadataAnalyser, ParseException, ValidateException, BindingMode, ODataType, ValueHelpProvider, FormatUtil,
	DateFormat, FilterProvider, Log, deepEqual, library, coreLibrary, ResizeHandler
) {
	"use strict";

	// shortcut for sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation
	var ValueHelpRangeOperation = library.valuehelpdialog.ValueHelpRangeOperation;

	// shortcut for sap.ui.comp.smartfilterbar.DisplayBehaviour
	var DisplayBehaviour = library.smartfilterbar.DisplayBehaviour;

	// shortcut for sap.ui.core.ValueState
	var ValueState = coreLibrary.ValueState;

	var PlacementType = MLibrary.PlacementType;

	var sIdSuffix = "-mInput";
	var sDisplayIdSuffix = "-mInputTokenizer";

	/**
	 * Constructor for a new <code>sap.ui.comp.smartfield.SmartMultiInput</code>.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class The <code>SmartMultiInput</code> control is a wrapper for other controls that extends the
	 * {@link sap.ui.comp.smartfield.SmartField} control and supports the same settings and annotations.<br>
	 * It interprets OData metadata to create multi-input controls, such as {@link sap.m.MultiInput} and
	 * {@link sap.m.MultiComboBox}.<br>
	 * The OData entity property that is changed or displayed in the control is derived from the control's
	 * <code>value</code> property.
	 * You can use the <code>SmartMultiInput</code> control in two ways:
	 * <ul>
	 * <li>With data binding - the <code>value</code> property is bound to a navigation property
	 * (1:N relationship).</li>
	 * <li>Without data binding - the <code>value</code> property is bound to an arbitrary property of the entity set
	 * that is specified in the <code>entitySet</code> property.</li>
	 * </ul>
	 * Both cases are shown in the example bellow as well as in the samples.
	 * Tokens selected in <code>SmartMultiInput</code> can be retrieved using either the {@link #getTokens}
	 * or the {@link #getValue} method.
	 *
	 * <pre>
	 * &lt;sap.ui.comp.smartmultiinput.SmartMultiInput value=&quot;{Categories/CategoryId}&quot;/&gt;
	 * &lt;sap.ui.comp.smartmultiinput.SmartMultiInput entitySet=&quot;Categories&quot; value=&quot;{CategoryId}&quot;/&gt;
	 * </pre>
	 *
	 * For more details, see the {@link https://ui5.sap.com/#/entity/sap.ui.comp.smartmultiinput.SmartMultiInput samples}.
	 *
	 * Note: Just as the rest of the {@link sap.ui.comp} library, this control supports only OData V2
	 * (see {@link sap.ui.model.odata.v2.ODataModel}) and default models.
	 *
	 * @extends sap.ui.comp.smartfield.SmartField
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @public
	 * @since 1.56.0
	 * @alias sap.ui.comp.smartmultiinput.SmartMultiInput
	 * @see {@link topic:5644169deb76438f800f269b0cb715fc Smart Multi Input}
	 */
	var SmartMultiInput = SmartField.extend("sap.ui.comp.smartmultiinput.SmartMultiInput",
		{
			metadata: {
				library: "sap.ui.comp",
				properties: {
					/**
					 * Enables value help with conditions. Can only be used without binding context. Otherwise, has no effect.
					 */
					supportRanges: {
						type: "boolean",
						defaultValue: false
					},
					/**
					 * Enables multiple selection in value help dialog.
					 */
					supportMultiSelect: {
						type: "boolean",
						defaultValue: true
					}
				},
				events: {
					/**
					 * This event is fired before the OData model's <code>create</code> method is called.
					 * Provides object with parameters of the call for editing.
					 */
					beforeCreate: {
						allowPreventDefault: true,
						parameters: {
							/**
							 * Data of the entry that should be created.
							 */
							oData: {type: "object"},
							/**
							 * Parameter map that will be passed to the OData model's <code>create</code> method, accepts the same properties as mParameters of the <code>create</code> method.
							 * Parameters <code>success</code> and <code>error</code> have no meaning as they are changed and used internally.
							 */
							mParameters: {type: "object"}
						}
					},
					/**
					 * This event is fired before the OData model's <code>remove</code> method is called.
					 * Provides object with parameters of the call in key:value format for editing.
					 */
					beforeRemove: {
						allowPreventDefault: true,
						parameters: {
							/**
							 * Parameter map that will be passed to the OData model's <code>remove</code> method, accepts the same properties as mParameters of the <code>remove</code> method.
							 * Parameters <code>success</code> and <code>error</code> have no meaning as they are changed and used internally.
							 */
							mParameters: {type: "object"}
						}
					},
					/**
					 * This event is fired when the tokens aggregation is changed due to a user action (add / remove token).
					 * This event is fired only for token changes in non-bound <code>SmartMultiInput</code> elements.
					 */
					tokenUpdate: {
						parameters: {
							/**
							 Type of TokenUpdate event.
							 There are two TokenUpdate types: <code>added</code> and <code>removed</code>.
							 Use Tokenizer.TokenUpdateType.Added for "added" and Tokenizer.TokenUpdateType.Removed for "removed".
							 See {@link sap.m.Tokenizer} for details.
							 */
							type: {
								type: "string"
							},
							/**
							 * The array of tokens that are added.
							 * This parameter is used when tokenUpdate type is "added".
							 */
							addedTokens: {type: "sap.m.Token[]"},

							/**
							 * The array of tokens that are removed.
							 * This parameter is used when tokenUpdate type is "removed".
							 */
							removedTokens: {type: "sap.m.Token[]"}
						}
					},
					/**
					 * This event is fired when item selection is changed.
					 * It is relevant only for selection changes on non-bound <code>SmartMultiInput</code> elements with fixed values, such as {@link sap.m.MultiComboBox}.
					 */
					selectionChange: {
						parameters: {

							/**
							 * Item that was selected or deselected.
							 */
							changedItem: {type: "sap.ui.core.Item"},

							/**
							 * Selection state: <code>true</code> if the item is selected, <code>false</code> if
							 * item is not selected.
							 */
							selected: {type: "boolean"}
						}
					}
				}
			},

			renderer: function (oRm, oControl) {
				SmartField.getMetadata().getRenderer().render(oRm, oControl);
			}

		});


	/**
	 * Returns tokens selected in <code>SmartMultiInput</code>
	 *
	 * @return {sap.m.Token[]} Selected tokens
	 * @public
	 */
	SmartMultiInput.prototype.getTokens = function () {
		if (this._isReadMode() && this._oTokenizer) {
			return this._oTokenizer.getTokens();
		} else if (this._oMultiComboBox) {
			return this._oMultiComboBox._oTokenizer.getTokens();
		} else if (this._oMultiInput){
			return this._oMultiInput.getTokens();
		}

	};

	/**
	 * Returns tokens selected in <code>SmartMultiInput</code>
	 *
	 * @return {sap.m.Token[]} Selected tokens
	 * @public
	 */
	SmartMultiInput.prototype.getValue = function () {
		return this.getTokens();
	};

	SmartMultiInput.prototype._createMultiInput = function () {
		var mAttributes = this._createAttributes();
		// in version 1.61 new property 'autocomplete' was added to sap.m.Input
		// this property is true by default
		// autocomplete is somehow connected to suggestions popover and in combination with ValueHelpProvider that is used on the MultiInput
		// and which does its own validation, causes repeated TokenUpdate calls when user writes text into MultiInput
		// and suggestions popover is already opened and than use for example tab key to change focus
		mAttributes.autocomplete = false;

		this._oMultiInput = new MultiInput(this.getId() + sIdSuffix, mAttributes);

		this._oMultiInput.attachChange(function (oEvent) {
			this._validateValueOnChange(oEvent.getParameter("value"));
		}, this);
		this._oMultiInput.attachSuggestionItemSelected(function (oEvent) {
			this._validateValueOnChange(oEvent.getSource().getValue());
		}, this);

		// create CRUD requests when used with binding context
		if (this.getBindingContext()) {
			this._bindMultiInput();
		}

		// re-fire token update from inner MultiInput
		this._oMultiInput.attachTokenUpdate(function (oEvent) {
			var mParameters = oEvent.getParameters();
			delete mParameters.id;

			this.fireTokenUpdate(mParameters);
		}, this);

		var mParams = {
			control: this._oMultiInput,
			onCreate: "_onMultiInputCreate", // because we need to override function inside value help provider
			params: {
				// getValue: "getTokens",
				type: {
					type: this._getType(),
					property: this._oFactory._oMetaData.property
				}
			}
		};

		this._initMultiInputValueHelp(mParams);

		return mParams;
	};

	SmartMultiInput.prototype._createMultiComboBox = function () {
		var mAttributes = this._createAttributes();


		this._oMultiComboBox = new MultiComboBox(this.getId() + "mComboBox", mAttributes);

		if (this.getBindingContext()) {
			this._bindMultiComboBox();

		} else {
			// for display mode
			this._oMultiInput = this._oMultiComboBox._oTokenizer;
			// re-fire selectionChange from inner MultiComboBox for unbound filter
			this._oMultiComboBox.attachSelectionChange(function (oEvent) {
				var mParameters = oEvent.getParameters();
				delete mParameters.id;

				this.fireSelectionChange(mParameters);
			}, this);
		}

		var mParams = {
			control: this._oMultiComboBox,
			onCreate: "_onCreate",
			params: {
				// getValue: "getSelectedKeys",
				type: {
					type: this._getType(),
					property: this._oFactory._oMetaData.property
				},
				valuehelp: {
					annotation: this._getValueListAnnotation(),
					aggregation: "items",
					noDialog: true,
					noTypeAhead: true
				}
			}
		};

		return mParams;
	};

	SmartMultiInput.prototype._createAttributes = function () {
		var mNames = {
			width: true,
			textAlign: true,
			placeholder: true,
			tooltip: true,
			name: true,
			valueState: true,
			valueStateText: true
		};

		// attaches change event to change event of inner multiInput
		var mAttributes = this._oFactory.createAttributes(null, this._oFactory._oMetaData.property, mNames, {
			event: "change",
			parameter: "value"
		});

		return mAttributes;
	};

	function onOK(oControlEvent) {
		var aTokens = oControlEvent.getParameter("tokens"), oRangeData, sKey, i = 0, aRowData = [], oRowData = null,
			oFormat;
		// First close the dialog, since when used in an aggregation - some model updates (setting IN/OUT params to ODataModel) destroy this
		// instance/control!
		this._onCancel();
		if (this.oControl instanceof sap.m.MultiInput) {
			// Clearing typed text if value is not selected from suggestion list but rather from ValueHelpDialog
			this.oControl.setValue("");

			var aOldTokens = this.oControl.getTokens();
			var aAddedTokens = [];
			var aRemovedTokens = [];
			// we need to set to controls old instances of the tokens, so that they could be in right time correctly destroyed
			var aNewTokens = [];

			aOldTokens.forEach(function (oOldToken) {
				var bFound = aTokens.some(function (oToken) {
					return oOldToken.getKey() === oToken.getKey();
				});

				if (!bFound) {
					aRemovedTokens.push(oOldToken);
				} else {
					aNewTokens.push(oOldToken);
				}
			});

			aTokens.forEach(function (oToken) {
				var bFound = aOldTokens.some(function (oOldToken) {
					return oOldToken.getKey() === oToken.getKey();
				});

				if (!bFound) {
					aAddedTokens.push(oToken);
					aNewTokens.push(oToken);
				}
			});

			this.oControl.setTokens(aNewTokens);
			this.oControl.fireTokenUpdate({
				type: "tokensChanged",
				removedTokens: aRemovedTokens,
				addedTokens: aAddedTokens
			});
			i = aTokens.length;
			while (i--) {
				oRowData = aTokens[i].data("row");
				if (oRowData) {
					aRowData.push(oRowData);
				}
			}
		} else {
			if (aTokens[0]) {
				// Single Interval
				if (this.bIsSingleIntervalRange) {
					oRangeData = aTokens[0].data("range");
					if (oRangeData) {
						// check if data is in the format: "2005-2014"
						if (this._sType === "datetime") {
							oFormat = DateFormat.getDateTimeInstance(Object.assign({}, this._oDateFormatSettings, {
								UTC: false
							}));

							if (typeof oRangeData.value1 === "string") {
								oRangeData.value1 = new Date(oRangeData.value1);
							}
							if (oRangeData.operation === "BT") {
								if (typeof oRangeData.value2 === "string") {
									oRangeData.value2 = new Date(oRangeData.value2);
								}
								sKey = oFormat.format(oRangeData.value1) + "-" + oFormat.format(oRangeData.value2);
							} else {
								sKey = oFormat.format(oRangeData.value1);
							}
						} else {
							if (oRangeData.operation === "BT") {
								sKey = oRangeData.value1 + "-" + oRangeData.value2;
							} else {
								sKey = oRangeData.value1;
							}
						}
					}
				} else {
					sKey = aTokens[0].getKey();
				}
				oRowData = aTokens[0].data("row");
				if (oRowData) {
					aRowData.push(oRowData);
				}
			}
			this.oControl.setValue(sKey);

			// Manually trigger the change event on sapUI5 control since it doesn't do this internally on setValue!
			this.oControl.fireChange({
				value: sKey,
				validated: true
			});
		}
		this._calculateAndSetFilterOutputData(aRowData);
	}

	SmartMultiInput.prototype._initMultiInputValueHelp = function (mParams) {
		var sFilterType = this._getFilterType(this._oFactory._oMetaData.property.property),
			oDialog = {},
			oDateFormatSettings = this._getDateFormatSettings(),
			oValueHelpProvider;

		this._oFactory._getValueHelpDialogTitle(oDialog);

		if (this._getValueListAnnotation()) {
			// there is no way how to set display behavior, ControlFactoryBase uses "defaultDropDownDisplayBehaviour" internally
			// can causes problem when value help is generated from annotaion for smart multi input without binding
			// because there can be mismatch between the configuration of the text format of the value help and the smart multi input
			mParams.params.valuehelp = {
				annotation: this._getValueListAnnotation(),
				aggregation: "suggestionRows",
				noDialog: false,
				noTypeAhead: false,
				supportMultiSelect: this.getSupportMultiSelect(),
				supportRanges: this.getBindingContext() ? false : this.getSupportRanges(),
				type: sFilterType,
				displayBehaviour: this._getDisplayBehaviour()
			};
		} else if (this.getSupportRanges() && !this.getBindingContext()) {
			oValueHelpProvider = new ValueHelpProvider({ // eslint-disable-line no-unused-vars
				fieldName: this._getPropertyName(),
				preventInitialDataFetchInValueHelpDialog: true,
				model: this.getModel(),
				control: this._oMultiInput,
				title: oDialog.dialogtitle,
				supportMultiSelect: this.getSupportMultiSelect(),
				supportRanges: true,
				type: sFilterType,
				dateFormatSettings: oDateFormatSettings,
				isUnrestrictedFilter: this._isTimeType(sFilterType),
				displayBehaviour: this._getDisplayBehaviour()
			});

			oValueHelpProvider._onOK = onOK;
			this._oMultiInput.addValidator(this._validateToken.bind(this));
		} else {
			this._oMultiInput.setShowValueHelp(false);
			this._oMultiInput.addValidator(this._validateToken.bind(this));
		}
	};

	SmartMultiInput.prototype._bindMultiInput = function () {
		var sBindingMode = this.getBinding("value").getBindingMode();

		switch (sBindingMode) {
			case BindingMode.OneTime:
				this._bindMultiInputOneTime();
				break;

			case BindingMode.OneWay:
				this._bindMultiInputOneWay();
				break;

			case BindingMode.TwoWay:
			default:
				this._bindMultiInputTwoWay();
		}
	};

	SmartMultiInput.prototype._bindMultiInputOneTime = function () {
		var that = this;

		this._readNavigationPropertySet().then(function (oResults) {
			oResults.results.forEach(function (oResult) {
				var sKey = oResult[that._getPropertyName()];
				var sDescriptionFieldName = that._getDescriptionFieldName();
				var sDescription = sDescriptionFieldName ? oResult[sDescriptionFieldName] : "";

				that._oMultiInput.addToken(that._createToken(sKey, sDescription));
			});
		});
	};

	SmartMultiInput.prototype._bindMultiInputOneWay = function () {
		this._bindMultiInputTokens();
	};

	SmartMultiInput.prototype._bindMultiInputTwoWay = function () {
		this._bindMultiInputTokens();

		this._oMultiInput.attachTokenUpdate(function (oEvent) {
			// is not called when token is added from value help
			// fireTokenChange is commented out in ValueHelpProvider
			oEvent.getParameter("addedTokens").forEach(this._addToken.bind(this));
			oEvent.getParameter("removedTokens").forEach(this._removeToken.bind(this));
		}, this);
	};

	SmartMultiInput.prototype._bindMultiInputTokens = function () {
		var sNavigationPath = this._getNavigationPath();

		this._oMultiInput.bindAggregation("tokens", {
			path: sNavigationPath,
			// create token for each entity from the navigation property
			factory: this._tokensFactory.bind(this)
		});

	};

	SmartMultiInput.prototype._bindMultiComboBox = function () {
		var sBindingMode = this.getBinding("value").getBindingMode();

		switch (sBindingMode) {
			case BindingMode.OneTime:
				this._bindMultiComboBoxOneTime();
				break;

			case BindingMode.OneWay:
				this._bindMultiComboBoxOneWay();
				break;

			case BindingMode.TwoWay:
			default:
				this._bindMultiComboBoxTwoWay();
		}
	};

	SmartMultiInput.prototype._bindMultiComboBoxOneTime = function () {
		var that = this;

		this._readNavigationPropertySet().then(function (oResults) {
			var aKeys = oResults.results.map(function (oResult) {
				return oResult[that._getPropertyName()];
			});

			that._oMultiComboBox.setSelectedKeys(aKeys);
		});
	};

	SmartMultiInput.prototype._bindMultiComboBoxOneWay = function () {
		this._createAndAttachHelperMultiInput();
	};

	SmartMultiInput.prototype._bindMultiComboBoxTwoWay = function () {
		this._createAndAttachHelperMultiInput();

		this._oMultiComboBox.attachSelectionChange(function (oEvent) {
			var bSelected = oEvent.getParameter("selected"),
				oItem = oEvent.getParameter("changedItem"),
				oData = {},
				oProperties, oToken;

			if (bSelected) {
				oProperties = oItem.getBindingContext().getProperty();
			} else {
				// retrieve corresponding token from the stubbed multiInput and use its correct bindingContext for removal
				oToken = this._oMultiInput.getTokens().filter(function(oTok) {
					return oTok.getKey() === oItem.getKey();
				})[0];

				if (oToken) {
					oProperties = oToken.getBindingContext().getProperty();
				}
			}

			this._getEntityType().key.propertyRef.forEach(function(oKey) {
				if (oProperties && oProperties[oKey.name]) {
					oData[oKey.name] = oProperties[oKey.name];
				}
			});

			if (bSelected) {
				this._createEntity(oData);
			} else {
				this._removeEntity(oData);
			}
		}, this);
	};

	SmartMultiInput.prototype._readNavigationPropertySet = function () {
		var that = this;

		return new Promise(function (resolve, reject) {
			var oContext = that.getBindingContext(),
				oModel = that._getModel(),
				sNavigationPath = that._getNavigationPath();

			oModel.read(
				sNavigationPath,
				{
					context: oContext,
					success: function (oResults) {
						resolve(oResults);
					},
					error: function (oError) {
						that.setValueState(ValueState.Error);
						that.setValueStateText(oError.responseText);
						reject(oError);
					}
				}
			);
		});
	};

	SmartMultiInput.prototype._createAndAttachHelperMultiInput = function () {
		var sNavigationPath = this._getNavigationPath();

		// "stub" multiinput to get list binding
		this._oMultiInput = new MultiInput();
		this._oMultiInput.setBindingContext(this.getBindingContext());
		this._oMultiInput.setModel(this._getModel());
		this._oMultiInput.bindAggregation("tokens", {
			path: sNavigationPath,
			factory: this._tokensFactory.bind(this)
		});

		var oBinding = this._oMultiInput.getBinding("tokens");
		oBinding.attachChange(function () {
			var aKeys = this._oMultiInput.getTokens().map(function (oToken) {
				return oToken.getKey();
			});

			this._oMultiComboBox.setSelectedKeys(aKeys);
		}, this);
	};

	SmartMultiInput.prototype._getReadTokenList = function() {
		if (!this.oReadTokenList) {
			this.oReadTokenList = new List();
			this.addDependent(this.oReadTokenList);
		}

		return this.oReadTokenList;
	};


	SmartMultiInput.prototype._getReadTokenListPopover = function() {
		if (!this.oReadTokenListPopover) {
			this.oReadTokenListPopover = new Popover({
				showArrow: true,
				placement: PlacementType.Auto,
				showHeader: false,
				contentMinWidth: "auto",
				content: [this.oReadTokenList]
			});
			this.addDependent(this.oReadTokenListPopover);
		}

		return this.oReadTokenListPopover;
	};

	SmartMultiInput.prototype._handleNMoreIndicatorPress = function() {
		var aTokens = this.getTokens();
		if (!aTokens) {
			return;
		}

		var oTokenList = this._getReadTokenList();
		var oReadTokenPopover = this._getReadTokenListPopover();

		oTokenList.removeAllItems();
		for ( var i = 0, aItemsLength = aTokens.length; i < aItemsLength; i++) {
			var oToken = aTokens[i],
				oListItem = new StandardListItem({
					title: oToken.getText()
				});

			oTokenList.addItem(oListItem);
		}

		if (this._oTokenizer._oIndicator && this._oTokenizer._oIndicator.length > 0) {
			oReadTokenPopover.openBy(this._oTokenizer._oIndicator[0]);
		}
	};

	SmartMultiInput.prototype._onResize = function () {
		if (this._isReadMode() && this._oTokenizer) {
			// prevent rerendering during resizing
			this._deregisterResizeHandler();

			// for some reason tokenizer uses parsed maxWidth style value instead of its actuall width to calculate the number of visible tokens
			// thats why the maxWidth has to be set here to the actual width and maxWidth value of 100% cannot be used
			this._oTokenizer.setMaxWidth(this.$().width() + "px");
			// collapsed mode has to be reenabled everytime tokenizer is changed
			this._oTokenizer._useCollapsedMode(true);
			this._oTokenizer.scrollToEnd();

			this._registerResizeHandler();
		}
	};

	SmartMultiInput.prototype._initTokenizerCollapseMode = function () {
		this._oTokenizer._handleNMoreIndicatorPress(this._handleNMoreIndicatorPress.bind(this));

		this._oTokenizer._useCollapsedMode(true); // enable N-more button for overflowing tokens

		this._oTokenizer.addEventDelegate({
			onAfterRendering: this._onResize.bind(this)
		});
	};

	SmartMultiInput.prototype.onBeforeRendering = function () {
		if (SmartField.prototype.onBeforeRendering) {
			SmartField.prototype.onBeforeRendering.apply(this, arguments);
		}

		this._deregisterResizeHandler();
	};

	SmartMultiInput.prototype.onAfterRendering = function () {
		if (SmartField.prototype.onAfterRendering) {
			SmartField.prototype.onAfterRendering.apply(this, arguments);
		}

		this._registerResizeHandler();
	};

	SmartMultiInput.prototype._registerResizeHandler = function () {
		if (!this._iResizeHandlerId) {
			this._iResizeHandlerId = ResizeHandler.register(this, this._onResize.bind(this));
		}
	};

	SmartMultiInput.prototype._deregisterResizeHandler = function () {
		if (this._iResizeHandlerId) {
			ResizeHandler.deregister(this._iResizeHandlerId);
			this._iResizeHandlerId = null;
		}
	};

	SmartMultiInput.prototype._createTokenizer = function () {
		var sNavigationPath = this._getNavigationPath();

		this._oTokenizer = new Tokenizer(this.getId() + sDisplayIdSuffix, {
			editable: false,
			width: "100%" // enables token swiping
		});

		this._initTokenizerCollapseMode();

		if (this.getBindingContext()) {
			this._oTokenizer.bindAggregation("tokens", {
				path: sNavigationPath,
				// create token for each entity from the navigation property
				factory: this._tokensFactory.bind(this)
			});
		} else {
			// has to be called every time display mode is changed
			this.attachInnerControlsCreated(this._mirrorTokensToDisplayTokenizer, this);
		}

		return {
			control: this._oTokenizer,
			onCreate: "_onCreate"
		};
	};

	/**
	 * Mirrors current tokens from MultiInput to display mode Tokenizer
	 *
	 * @private
	 */
	SmartMultiInput.prototype._mirrorTokensToDisplayTokenizer = function () {
		if (this.getMode() === "display" && typeof this._oMultiInput !== "undefined") {
			this._oTokenizer.removeAllTokens();
			this._oMultiInput.getTokens().forEach(function (oToken) {
				// new token has to be created, otherwise managed objects decides to remove tokens from the _oMultiInput
				var oNewToken = new Token({
					text: oToken.getText(),
					key: oToken.getKey()
				});
				this._oTokenizer.addToken(oNewToken);
			}, this);
		}
	};

	SmartMultiInput.prototype._tokensFactory = function (sControlId, oContext) {
		var vValue = oContext.getProperty(this._getPropertyName());
		var sKey = this._formatValue(vValue);
		var sDescriptionFieldName = this._getDescriptionFieldName();
		var sDescription = sDescriptionFieldName ? oContext.getProperty(sDescriptionFieldName) : "";

		var oToken = this._createToken(sKey, sDescription, oContext);

		return oToken;
	};

	SmartMultiInput.prototype._createToken = function (sKey, sDescription, oContext) {
		var sFormatted = this._getFormattedText(sKey, sDescription);
		var oToken;

		oToken = new Token();

		oToken.setKey(sKey);
		oToken.setText(sFormatted);

		return oToken;
	};

	SmartMultiInput.prototype._addToken = function (oToken) {
		var oData = {},
			oContext,
			oRowData = oToken.data("row"),
			oRangeData = oToken.data("range"); // range data from ranges value help,

		// only send the key of the new entity and backend will do the rest
		oData[this._getPropertyName()] = oToken.getKey();

		// the key of the new entity can be formed from multiple properties, in that case take the rest from value help data
		if (oRowData) {
			this._getEntityType().key.propertyRef.forEach(function(oKey) {
				if (oRowData[oKey.name]) {
					oData[oKey.name] = oRowData[oKey.name];
				}
			});
		}

		if (oRangeData) {
			oData["range"] = oRangeData;
		}

		this.setValueState(ValueState.None);

		oContext = this._createEntity(oData);
		oToken.setBindingContext(oContext);
	};

	SmartMultiInput.prototype._createEntity = function (oData) {
		var oModel = this._getModel(),
			sAggregationEntitySet = this._getEntitySetName(),
			// correct group need to be added to createEntry parameters so that
			// if sAggregationEntitySet is set to have deferred request it is taken into account
			mParameters = oModel._resolveGroup(sAggregationEntitySet),
			sPath = this._getNavigationPath(),
			bShouldContinue = this.fireBeforeCreate({
			oData: oData,
			mParameters: mParameters
		});

		// force model update, so that newly added entity is properly shown as a new token
		mParameters.refreshAfterChange = true;
		mParameters.context = this.getBindingContext();

		if (bShouldContinue) {
			mParameters.properties = oData;
			var oContext = oModel.createEntry(
				sPath,
				mParameters
			);

			return oContext;
		}
	};

	SmartMultiInput.prototype._removeToken = function (oToken) {
		this._removeEntity(oToken.getBindingContext());

		// prevent memory leak and same id reusage error
		oToken.destroy();
	};

	SmartMultiInput.prototype._removeEntity = function (oContext) {
		var oModel = this._getModel(),
			sAggregationEntitySet = this._getEntitySetName(),
			mParameters = oModel._resolveGroup(sAggregationEntitySet),
			bShouldContinue = this.fireBeforeRemove({
				mParameters: mParameters
			});

		// in case of deferred groups, model.create and model.remove would create conflicting changes
		var bIsInDeferredGroup = oModel.getDeferredGroups().indexOf(mParameters.groupId) >= 0 ||
			oModel.getDeferredBatchGroups().indexOf(mParameters.groupId) >= 0;
		if (bIsInDeferredGroup && this._entityHasPendingCreateChange(oModel, oContext)) {
			// removes entry and cancels the pending create request; does nothing if it does not exist
			oModel.deleteCreatedEntry(oContext);
			// skip calling .remove as the entry was not created on OData service
			bShouldContinue = false;
		}

		// force model update, so that removed entity token is is properly removed
		mParameters.refreshAfterChange = true;
		mParameters.context = oContext;

		if (bShouldContinue) {
			var sPath = ""; // instead of building absolute path, it is taken from the context parameter

			oModel.remove(
				sPath,
				mParameters
			);
		}
	};

	SmartMultiInput.prototype._entityHasPendingCreateChange = function(oModel, oContext) {
		var oPendingChanges = oModel.getPendingChanges();
		var sKey = oModel.getKey(oContext);

		return !!oPendingChanges[sKey] && deepEqual(oPendingChanges[sKey], oContext.getObject());
	};

	SmartMultiInput.prototype._getEntityKeyProperties = function (oContext) {
		var oModel = this._getModel(),
			oEntityType = oModel.oMetadata._getEntityTypeByPath(oContext.getPath()),
			mKeyProperties = {};

		oEntityType.key.propertyRef.forEach(function (oKeyProperty) {
			var sProperty = oKeyProperty.name;
			mKeyProperties[sProperty] = oContext.getProperty(sProperty);
		});

		return mKeyProperties;
	};

	/**
	 * Checks whether a client error has been detected. In addition, this method displays an error message, if it is not already displayed.
	 *
	 * @returns {boolean} <code>true</code>, if a client error has been detected, <code>false</code> otherwise
	 * @public
	 */
	SmartMultiInput.prototype.checkClientError = function () {
		// in display mode: no error.
		if (this.getMode() === "display") {
			return false;
		}

		return !this._validateMultiInput();
	};

	/**
	 * Returns an array of token values in range format.
	 * @returns {Array} array of range values, one for each token
	 * @public
	 */
	SmartMultiInput.prototype.getRangeData = function () {
		var aTokens = this.getTokens(),
			aRangeData = [];

		aTokens.forEach(function (oToken) {
			var mRangeData;
			if (oToken.data("range")) {
				mRangeData = oToken.data("range");
			} else {
				mRangeData = this._getDefaultTokenRangeData(oToken);
			}

			aRangeData.push(mRangeData);
		}, this);

		return aRangeData;
	};

	/** Sets tokens based on given objects with range data. Can only be used without a data binding. Otherwise, has no effect.
	 *
	 * @param {object|array} vRangeData Object or array of objects with range data. Tokens will be created based on this data and fed into the smart multi input.
	 * @public
	 */
	SmartMultiInput.prototype.setRangeData = function(vRangeData) {
		if (!this.getBindingContext()) {
			var aRangeData = Array.isArray(vRangeData) ? vRangeData : [vRangeData];

			if (!this._oMultiInput) {
				// initialise _oMultiInput in "editable" mode
				// change everything to editable so that _createMultiInput gets called and then restore the original state
				var bEditable = this.getEditable(),
					bEnabled = this.getEnabled(),
					bContextEditable = this.getContextEditable();

				this.setEditable(true);
				this.setEnabled(true);
				this.setContextEditable(true);

				this.setEditable(bEditable);
				this.setEnabled(bEnabled);
				this.setContextEditable(bContextEditable);
			}

			this._oMultiInput.removeAllTokens();

			aRangeData.forEach(function(oRangeData) {
				var sText = this._getTokenTextFromRangeData(oRangeData);
				var oToken = new Token({text: sText, key: sText});

				oToken.data("range", oRangeData);
				this._oMultiInput.addToken(oToken);
			}, this);

			this._mirrorTokensToDisplayTokenizer();
		} else {
			Log.warning("setRangeData can only be used without property binding");
		}
	};

	SmartMultiInput.prototype._getTokenTextFromRangeData = function(oParams) {
		var sTokenText = "";

		switch (oParams.operation) {
			case ValueHelpRangeOperation.EQ:
				sTokenText = "=" + oParams.value1;
				break;

			case ValueHelpRangeOperation.GT:
				sTokenText = ">" + oParams.value1;
				break;

			case ValueHelpRangeOperation.GE:
				sTokenText = ">=" + oParams.value1;
				break;

			case ValueHelpRangeOperation.LT:
				sTokenText = "<" + oParams.value1;
				break;

			case ValueHelpRangeOperation.LE:
				sTokenText = "<=" + oParams.value1;
				break;

			case ValueHelpRangeOperation.Contains:
				sTokenText = "*" + oParams.value1 + "*";
				break;

			case ValueHelpRangeOperation.StartsWith:
				sTokenText = oParams.value1 + "*";
				break;

			case ValueHelpRangeOperation.EndsWith:
				sTokenText = "*" + oParams.value1;
				break;

			case ValueHelpRangeOperation.BT:
				sTokenText = oParams.value1 + "...";
				if (oParams.value2) {
					sTokenText += oParams.value2;
				}

				break;

			default:
				sTokenText = "";
		}

		if (oParams.exclude && sTokenText !== "") {
			sTokenText = "!(" + sTokenText + ")";
		}

		return sTokenText;
	};

	/**
	 * Returns a filter that can be applied to restrict the OData query.
	 * @returns {sap.ui.model.Filter} filter object based on current SmartMultiInput values
	 * @public
	 */
	SmartMultiInput.prototype.getFilter = function () {
		var aFieldNames = [this._getPropertyName()],
			oData = {},
			aRanges = this.getRangeData(),
			aFilters;

		oData[this._getPropertyName()] = {
			ranges: aRanges,
			items: []
		};


		aFilters =  FilterProvider.generateFilters(aFieldNames, oData);

		return aFilters && aFilters.length === 1 && aFilters[0];
	};

	SmartMultiInput.prototype._getDefaultTokenRangeData = function (oToken) {
		var mRangeData = {
			exclude: false,
			operation: ValueHelpRangeOperation.EQ,
			value1: this._parseValue(oToken.getKey()),
			value2: "",
			keyField: this._getPropertyName()
		};

		return mRangeData;
	};

	SmartMultiInput.prototype._validateToken = function (oArgs) {
		var sText = oArgs.text;
		var bValid = this._validateValue(sText);

		if (bValid) {
			var oToken = new Token({key: sText, text: sText});

			// extend the token with range data if added to smart multi input that supports them but is added directly, without value help
			// if added via value help, the value help provides the range data
			if (this.getSupportRanges()) { // EQ is default operation when condition value help is used
				var mRangeData = this._getDefaultTokenRangeData(oToken);
				oToken.data("range", mRangeData);
				oToken.setText("=" + sText);
			}

			return oToken;
		}
	};
	SmartMultiInput.prototype._validateMultiInput = function () {
		if (this._oMultiInput.getValueState() !== ValueState.None) {
			return false;
		}

		if (this.getRequired() && this.getTokens().length === 0) {
			this.setValueStateText(
				sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("VALUEHELPVALDLG_FIELDMESSAGE")
			);
			this.setValueState(ValueState.Error);
			return false;
		} else {
			this.setValueState(ValueState.None);
			return true;
		}
	};

	SmartMultiInput.prototype._validateValueOnChange = function (sValue) {
		if (sValue === "") {
			this.setValueState(ValueState.None);
			this._validateMultiInput();
		} else {
			this._validateValue(sValue);
		}
	};

	SmartMultiInput.prototype._parseValue = function (sValue) {
		return this._getType().parseValue(sValue, "string"); // always parsing value from string
	};

	SmartMultiInput.prototype._formatValue = function (vValue) {
		return this._getType().formatValue(vValue, "string"); // always formatValue to string
	};

	SmartMultiInput.prototype._validateValue = function (sValue) {
		try {
			// smartfield uses internal type of the inner control, smartfield itself is any
			var sParsedValue = this._parseValue(sValue);
			this._getType().validateValue(sParsedValue);
			this.setValueState(ValueState.None);

			return true;
		} catch (oException) {
			this.setValueState(ValueState.Error);
			this.setValueStateText(oException.message);

			var mParameters = {
				element: this._oMultiInput,
				property: "value",
				type: this._getType(),
				newValue: sValue,
				oldValue: null,
				exception: oException,
				message: oException.message
			};

			if (oException instanceof ParseException) {
				this.fireParseError(mParameters);
			} else if (oException instanceof ValidateException) {
				this.fireValidationError(mParameters);
			}

			return false;
		}
	};

	SmartMultiInput.prototype._getModel = function () {
		if (this._oFactory) {
			return this._oFactory._oModel;
		}
	};

	SmartMultiInput.prototype._getDateFormatSettings = function () {
		var oDateFormatSettings = this.data("dateFormatSettings");

		if (typeof oDateFormatSettings === "string") {
			try {
				oDateFormatSettings = JSON.parse(oDateFormatSettings);
			} catch (ex) {
				// Invalid dateformat settings provided, Ignore!
			}
		}

		return oDateFormatSettings;
	};

	SmartMultiInput.prototype._getNavigationPath = function () {
		return this._oFactory._oMetaData.navigationPath;
	};

	SmartMultiInput.prototype._getDescriptionFieldName = function () {
		var oDescriptionField = this._oFactory._oMetaData.annotations.text;
		if (oDescriptionField) {
			return oDescriptionField.property.property.name;
		}
	};

	SmartMultiInput.prototype._getType = function () {
		if (!this._oType) {
			var oDateFormatSettings;

			if (this._isEdmTimeType()) {
				oDateFormatSettings = this._getDateFormatSettings();
			}

			this._oType = this._oFactory._oTypes.getType(this._oFactory._oMetaData.property, oDateFormatSettings);
		}

		return this._oType;
	};

	SmartMultiInput.prototype._isEdmTimeType = function () {
		var aTimeEdmTypes = ["Edm.DateTime", "Edm.DateTimeOffset", "Edm.Time"];

		return aTimeEdmTypes.indexOf(this._oFactory._oMetaData.property.property.type) > -1;
	};

	SmartMultiInput.prototype._isTimeType = function (sType) {
		var aTimeTypes = ["date", "datetime", "time"];

		return aTimeTypes.indexOf(sType) > -1;
	};

	SmartMultiInput.prototype._getPropertyName = function () {
		return this._oFactory._oMetaData.property.property.name;
	};

	SmartMultiInput.prototype._getEntitySetName = function () {
		return this._oFactory._oMetaData.entitySet.name;
	};

	SmartMultiInput.prototype._getEntityType = function() {
		return this._oFactory._oMetaData.entityType;
	};

	SmartMultiInput.prototype._getValueListAnnotation = function () {
		return this._oFactory._oMetaData.annotations.valuelist;
	};


	SmartMultiInput.prototype._getDisplayBehaviour = function () {
		var sDisplayBehaviour = this._oFactory._getDisplayBehaviourConfiguration("defaultInputFieldDisplayBehaviour");

		if (!sDisplayBehaviour || sDisplayBehaviour === DisplayBehaviour.auto) {
			sDisplayBehaviour = DisplayBehaviour.descriptionAndId;
		}

		return sDisplayBehaviour;
	};

	/**
	 * Returns text formatted according to display behavior.
	 *
	 * @param {string} sKey key of the property
	 * @param {string} sDescription description for the property
	 * @return {string} formatted text
	 * @private
	 */
	SmartMultiInput.prototype._getFormattedText = function (sKey, sDescription) {
		// taken from BaseValueListProvider

		var sDisplayBehaviour = this._getDisplayBehaviour();

		return FormatUtil.getFormattedExpressionFromDisplayBehaviour(
			sDisplayBehaviour,
			sKey,
			sDescription
		);
	};

	// taken from FilterProvider, edited
	SmartMultiInput.prototype._getFilterType = function (oProperty) {
		if (ODataType.isNumeric(oProperty.type)) {
			return "numeric";
		} else if (oProperty.type === "Edm.DateTime" && oProperty["sap:display-format"] === "Date") {
			return "date";
		} else if (oProperty.type === "Edm.String") {
			return "string";
		} else if (oProperty.type === "Edm.Boolean") {
			return "boolean";
		} else if (oProperty.type === "Edm.Time") {
			return "time";
		} else if (oProperty.type === "Edm.DateTimeOffset") {
			return "datetime";
		}
		return undefined;
	};

	// setEntitySet has to trigger updateBindingContext so that the SmartMultiInput is initialized even without element binding
	SmartMultiInput.prototype.setEntitySet = function () {
		SmartField.prototype.setEntitySet.apply(this, arguments);

		this.updateBindingContext(false, this._getModel());

		return this;
	};

	// same reason as for setEntitySet
	SmartMultiInput.prototype.bindProperty = function (sProperty, oArguments) {
		SmartField.prototype.bindProperty.apply(this, arguments);

		if (sProperty === "value") {
			this.updateBindingContext(false, this._getModel());
		}

		return this;
	};

	SmartMultiInput.prototype._checkComboBox = function () {
		var oCombobox = this._oFactory._oSelector.checkComboBox();

		return oCombobox && oCombobox.combobox;
	};

	SmartMultiInput.prototype._isReadMode = function () {
		return !this.getEditable() || !this.getEnabled() || !this.getContextEditable();
	};


	// get inside ValueHelpProvider instance to override its _onOk function
	function _onMultiInputCreate() {
		this._onCreate.apply(this, arguments);
		if (this._aProviders.length > 0) {
			this._aProviders[0]._onOK = onOK;
		}

	}

	SmartMultiInput.prototype._init = function () {
		var that = this;

		SmartField.prototype._init.apply(this, arguments);

		if (this._oFactory) {
			this._oFactory._createMultiInput = this._createMultiInput.bind(this);
			this._oFactory._createMultiComboBox = this._createMultiComboBox.bind(this);
			this._oFactory._createTokenizer = this._createTokenizer.bind(this);

			this._oFactory._onMultiInputCreate = _onMultiInputCreate;

			this._oFactory._oSelector.getCreator = function () {
				if (that._isReadMode()) {
					return "_createTokenizer";
				} else if (that._checkComboBox()) {
					return "_createMultiComboBox";
				} else {
					return "_createMultiInput";
				}
			};
		}
	};

	SmartMultiInput.prototype.exit = function () {
		this._deregisterResizeHandler();

		SmartField.prototype.exit.apply(this, arguments);
	};

	return SmartMultiInput;

});
