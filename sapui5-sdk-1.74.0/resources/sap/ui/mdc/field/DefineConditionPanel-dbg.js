/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/XMLComposite",
	"sap/ui/mdc/condition/Condition",
	"sap/ui/model/Filter",
	"sap/ui/model/type/String",
	"sap/ui/base/ManagedObjectObserver",
	"sap/m/FlexItemData",
	"sap/base/util/merge",
	"sap/ui/mdc/condition/FilterOperatorUtil",
	"sap/ui/mdc/util/BaseType",
	"sap/ui/mdc/Field"
], function(
		XMLComposite,
		Condition,
		Filter,
		StringType,
		ManagedObjectObserver,
		FlexItemData,
		merge,
		FilterOperatorUtil,
		BaseType,
		Field
		) {
	"use strict";

	// translation utils
	var oMessageBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");
	sap.ui.getCore().attachLocalizationChanged(function() {
		oMessageBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");
	});


	var DefineConditionPanel = XMLComposite.extend("sap.ui.mdc.field.DefineConditionPanel", {
		metadata: {
			properties: {
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

				// TODO: better way to pass MaxConditions, Operators, ...
				/**
				 * The formatOptions for the ConditionType used to format tokens
				 *
				 * @since 1.62.0
				 */
				formatOptions: {
					type: "object",
					defaultValue: {}
				}
			},
			events: {}

		},
		fragment: "sap.ui.mdc.field.DefineConditionPanel",

		init: function() {
			sap.ui.getCore().getMessageManager().registerObject(this, true);
			this._oObserver = new ManagedObjectObserver(_observeChanges.bind(this));

			this._oObserver.observe(this, {
				properties: ["conditions", "formatOptions"]
			});
			var oVLayout = this.byId("defineCondition");
			this._oObserver.observe(oVLayout, {
				aggregations: ["content"]
			});
		},

		exit: function() {
			sap.ui.getCore().getMessageManager().unregisterObject(this, true);
			this._oObserver.disconnect();
			this._oObserver = undefined;

			if (this._oDefaultType) {
				this._oDefaultType.destroy();
				delete this._oDefaultType;
			}

		},

		onBeforeRendering: function() {
			if (!this.oOperatorModel) {
				var oType = _getType.call(this);
				// assert(oOperatorConfig == null, "oOperatorConfig does not exist - no operators for Select control can be added");
				var aOperators = _getOperators.call(this);

				var sInclude = oMessageBundle.getText("valuehelp.INCLUDE");
				var sExclude = oMessageBundle.getText("valuehelp.EXCLUDE");

				var aOperatorsData = [];
				aOperators.forEach(function(sOperator) {
					var oOperator = FilterOperatorUtil.getOperator(sOperator);
					if (oOperator.showInSuggest !== undefined && oOperator.showInSuggest == false) {
						return;
					}
					var sTxtKey = oOperator.textKey || "operators." + oOperator.name + ".longText";
					var sText = oOperator.getTypeText(sTxtKey, oType.getName().toLowerCase());
					if (sText === sTxtKey) {
						sText = oOperator.longText;
					}

					aOperatorsData.push({
						key: oOperator.name,
						additionalText: sText,
						info: oOperator.exclude ? sExclude : sInclude
					});
				}, this);

				this.oOperatorModel = new sap.ui.model.json.JSONModel();
				this.oOperatorModel.setData(aOperatorsData);
				this.setModel(this.oOperatorModel, "om");
			}

			if (this.getConditions().length === 0) {
				// as observer must not be called in the initial case
				this.updateDefineConditions();
				this._updateButtonVisibility();
			}

		},

		_updateButtonVisibility: function(oCondition) {

			var oVLayout = this.byId("defineCondition");

			if (!oVLayout) {
				return;
			}

			var aRows = oVLayout.getContent();
			var oFormatOptions = this.getFormatOptions();
			var iMaxConditions = oFormatOptions.maxConditions;

			for (var i = 0; i < aRows.length; i++) {
				var oRow = aRows[i];
				var oHBox = oRow.getContent()[2];
				var oButton = oHBox.getItems()[1];
				oButton.setVisible((i === aRows.length - 1) && (iMaxConditions == -1 || i < iMaxConditions - 1));
			}

		},

		removeCondition: function(oEvent) {
			var oSource = oEvent.oSource;
			var oCondition = oSource.getBindingContext("$this").getObject();
			var iIndex = Condition.indexOfCondition(oCondition, this.getConditions());
			var aConditions = this.getConditions();

			this._bUpdateConditionsInternal = true;
			aConditions.splice(iIndex, 1);
			this.setProperty("conditions", aConditions, true); // do not invalidate whole DefineConditionPanel
			this.updateDefineConditions();
			this._updateButtonVisibility();
			this.invalidate(); // to remove row
		},

		addCondition: function(oEvent) {
			var oSource = oEvent.oSource;
			var oCondition = oSource.getBindingContext("$this").getObject();
			var aConditions = this.getConditions();

			var iIndex = Condition.indexOfCondition(oCondition, aConditions);
			var oFormatOptions = this.getFormatOptions();
			var iMaxConditions = oFormatOptions.maxConditions;

			if (iMaxConditions == -1 || aConditions.length < iMaxConditions) {
				// create a new dummy condition for a new condition on the UI - must be removed later if not used or filled correct
				this._bUpdateConditionsInternal = true;
				this.addDummyCondition(iIndex + 1);
			}
		},

		addDummyCondition: function(index) {
			var aOperators = _getOperators.call(this);
			var oCondition = Condition.createCondition("EQ", [null]);
			FilterOperatorUtil.checkConditionsEmpty(oCondition, aOperators);
			var aConditions = this.getConditions();
			if (index !== undefined) {
				aConditions.splice(index, 0, oCondition);
			} else {
				aConditions.push(oCondition);
			}
			this.setProperty("conditions", aConditions, true); // do not invalidate whole DefineConditionPanel
			this._updateButtonVisibility();
		},

		updateDefineConditions: function() {
			var aConditions = this.getConditions().filter(function(oCondition) {
				return oCondition.operator !== "EEQ";
			});

			if (aConditions.length === 0) {
				this._bUpdateConditionsInternal = true;
				this.addDummyCondition();
			}
		},

		// called via the ManagedObjectModel binding and creates a value field for each condition
		valueCtrlFactory: function(sId, oContext) {
			var oModel = oContext.oModel;
			var sPath = oContext.sPath;
			var index = parseInt(sPath.split("/")[sPath.split("/").length - 1]);
			sPath = sPath.slice(0, sPath.lastIndexOf("/"));
			sPath = sPath.slice(0, sPath.lastIndexOf("/"));
			var oCondition = oModel.getProperty(sPath);
			var aOperators = _getOperators.call(this);
			var oOperator = FilterOperatorUtil.getOperator(oCondition.operator, aOperators);
			var oDataType = _getType.call(this);

			var oValueControl = _createControl.call(this, oDataType, oOperator, "$this>", index);
			oValueControl.addStyleClass("sapUiSmallPaddingBegin"); //TODO styleclass for boolean select control does not work!
			oValueControl.setLayoutData(new FlexItemData({
				shrinkFactor: 0,
				growFactor: 1
			}));
			if (oValueControl.attachChange) {
				oValueControl.attachChange(this.onChange.bind(this));
				oValueControl.onpaste = this.onPaste.bind(this);
			}

			return oValueControl;
		},

		// called when the user has change the value of the condition field
		onChange: function(oEvent) {
			var aOperators = _getOperators.call(this);
			var aConditions = this.getConditions();
			FilterOperatorUtil.checkConditionsEmpty(aConditions, aOperators);
			FilterOperatorUtil.updateConditionsValues(aConditions, aOperators);
			this.setProperty("conditions", aConditions, true); // do not invalidate whole DefineConditionPanel

		},

		onPaste: function(oEvent) {
			var sOriginalText, oSource = oEvent.srcControl;

			// for the purpose to copy from column in excel and paste in MultiInput/MultiComboBox
			if (window.clipboardData) {
				//IE
				sOriginalText = window.clipboardData.getData("Text");
			} else {
				// Chrome, Firefox, Safari
				sOriginalText = oEvent.originalEvent.clipboardData.getData('text/plain');
			}
			var aSeparatedText = sOriginalText.split(/\r\n|\r|\n/g);

			if (aSeparatedText && aSeparatedText.length > 1) {
				setTimeout(function() {
					var aOperators = _getOperators.call(this);
					var oType = _getType.call(this);
					var sType = _getBaseType.call(this, oType);

					var iLength = aSeparatedText.length;
					var aConditions = this.getConditions();
					for (var i = 0; i < iLength; i++) {
						if (aSeparatedText[i]) {
							var sValue = aSeparatedText[i];
							var aValues = sValue.split(/\t/g); // if two values exist, use it as Between
							var oOperator;
							if (aValues.length == 2 && aValues[0] && aValues[1]) {
								oOperator = FilterOperatorUtil.getOperator("BT", aOperators);
							} else {
								aValues = [sValue.trim()];
								oOperator = FilterOperatorUtil.getDefaultOperator(sType);
							}
							sValue = oOperator ? oOperator.format(aValues) : aValues[0];

							if (oOperator) {
								var oCondition = oOperator.getCondition(sValue, oType);
								if (oCondition) {
									FilterOperatorUtil.checkConditionsEmpty(oCondition, aOperators);
									aConditions.push(oCondition);
								}
							}
						}
					}
					this.setProperty("conditions", aConditions, true); // do not invalidate whole DefineConditionPanel

					if (oSource.setDOMValue) {
						oSource.setDOMValue("");
					}

				}.bind(this), 0);
			}
		}

	});

	function _observeChanges(oChanges) {

		if (oChanges.name === "content" && oChanges.mutation === "insert") {
			// suspend the listBinding of field HBoxes to avoid recreation of controls if not needed
			_suspendListBinding.call(this, oChanges.child);
		}

		if (oChanges.name === "selectedKey") {
			// operator changed -> update controls
			_operatorChanged.call(this, oChanges.object);
		}

		if (oChanges.name === "formatOptions") {
			// type or maxConditions might changed -> resume ListBinding
			var aConditions = this.getConditions();
			if (aConditions.length > 0) {
				_resumeListBinding.call(this);
				// TODO: suspend afterwards. Workaround delete conditions and add new
				this.setConditions([]);
				this.setConditions(aConditions);
			}
		}

		if (oChanges.name === "conditions") {
			if (this._bUpdateConditionsInternal) {
				// conditions updated from DefineConditionPanel itelf -> no new check for dummy needed
				this._bUpdateConditionsInternal = false;
				return;
			}

			if (this._sConditionsTimer) {
				clearTimeout(this._sConditionsTimer);
				this._sConditionsTimer = null;
			}
			this._sConditionsTimer = setTimeout(function () {
				// update conditions after model/binding update has finished. Otherwise it might not update the binding.
				this._sConditionsTimer = null;
				this.updateDefineConditions();
				this._updateButtonVisibility();
			}.bind(this), 0);
		}

	}

	function _suspendListBinding(oGrid) {

		// suspend the listBinding of field HBoxes to avoid recreation of controls if not needed
		var aContent = oGrid.getContent();
		var oSelect = aContent[0];
		var oHBox = aContent[1];
		var oListBinding = oHBox.getBinding("items");
		oListBinding.suspend();

		// as selected key can be changed by reopening dialog listen on property change not on change event
		this._oObserver.observe(oSelect, {
			properties: ["selectedKey"]
		});

	}

	function _resumeListBinding() {

		// resume the listBinding of field HBoxes to allow recreation of controls
		var oVLayout = this.byId("defineCondition");
		var aGrids = oVLayout.getContent();

		for (var i = 0; i < aGrids.length; i++) {
			var oGrid = aGrids[i];
			var aContent = oGrid.getContent();
			var oHBox = aContent[1];
			var oListBinding = oHBox.getBinding("items");
			oListBinding.resume();
		}

	}

	function _operatorChanged(oSelect) {

		var oGrid = oSelect.getParent();
		var aContent = oGrid.getContent();
		var oHBox = aContent[1];
		var oListBinding = oHBox.getBinding("items");

		this.onChange();
		oListBinding.checkUpdate(true); // force update

	}

	function _createControl(oDataType, oOperator, sPath, index) {

		if (oOperator.valueTypes[index] && oOperator.valueTypes[index] !== "self") {
			oDataType = oOperator._createLocalType(oOperator.valueTypes[index]);
		}

		if (oOperator.createControl) {
			return oOperator.createControl(oDataType, oOperator, sPath, index);
		}

		var sType = _getBaseType.call(this, oDataType);
		var oNullableType;
		var Type;
		var oFormatOptions;
		var oConstraints;

		switch (sType) {
			case BaseType.Boolean:
				// normally boolean makes no sense for DefineConditionPanel
				// in sap.ui.model.odata.type.Boolean nullable is default, if set to false try to create nullable type
				if (oDataType.oConstraints && oDataType.oConstraints.hasOwnProperty("nullable") && oDataType.oConstraints.nullable === false) {
					// "clone" type and make nullable
					Type = sap.ui.require(oDataType.getMetadata().getName().replace(/\./g, "/")); // type is already loaded because instance is provided
					oFormatOptions = merge({}, oDataType.oFormatOptions);
					oConstraints = merge(oDataType.oConstraints, { nullable: true });
					oNullableType = new Type(oFormatOptions, oConstraints);
				} else {
					// given type can be used
					oNullableType = oDataType;
				}

				break;
			case BaseType.Numeric:
				if (oDataType.oFormatOptions && oDataType.oFormatOptions.hasOwnProperty("emptyString") && oDataType.oFormatOptions.emptyString === null) {
					// given type can be used
					oNullableType = oDataType;
				} else {
					// "clone" type and make nullable
					Type = sap.ui.require(oDataType.getMetadata().getName().replace(/\./g, "/")); // type is already loaded because instance is provided
					oFormatOptions = merge(oDataType.oFormatOptions, { emptyString: null });
					//TODO oConstraints like maximum are not used inside the Double type
					oNullableType = new Type(oFormatOptions, oDataType.oConstraints);
				}

				break;
			case BaseType.Date:
			case BaseType.Time:
			case BaseType.DateTime:
				oNullableType = oDataType;

				break;
			//TODO: how to handle unit fields?
			default:
				oNullableType = oDataType; // use given type or default string type
				break;
		}

		var oControl = new Field({
			value: { path: sPath, type: oNullableType, mode: 'TwoWay', targetType: 'raw' },
			width: "100%"
		});

		return oControl;

	}

	function _getOperators() {

		var oFormatOptions = this.getFormatOptions();
		var aOperators = oFormatOptions && oFormatOptions.operators;

		if (!aOperators || aOperators.length === 0) {
			// TODO: better default
			aOperators = FilterOperatorUtil.getOperatorsForType(BaseType.String);
		}

		return aOperators;

	}

	function _getType() {
		var oFormatOptions = this.getFormatOptions();
		var oType = oFormatOptions && oFormatOptions.valueType;
		if (!oType) {
			if (!this._oDefaultType) {
				this._oDefaultType = new StringType();
			}
			oType = this._oDefaultType;
		}

		return oType;
	}

	function _getBaseType(oType) {

		var sType = oType.getMetadata().getName();
		var oFormatOptions = oType.oFormatOptions;
		var oConstraints = oType.oConstraints;
		var oDelegate = this.getFormatOptions().delegate;
		var oPayload = this.getFormatOptions().payload;
		var sBaseType = oDelegate ? oDelegate.getBaseType(oPayload, sType, oFormatOptions, oConstraints) : BaseType.String; // if not configured use string

		if (sBaseType === BaseType.Unit) {
			sBaseType = BaseType.Numeric;
		}

		return sBaseType;

	}

	return DefineConditionPanel;

});
