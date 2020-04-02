/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
		'sap/ui/mdc/condition/ConditionModelPropertyBinding',
		'sap/ui/model/json/JSONModel',
		'sap/ui/model/Filter',
		'sap/ui/model/ChangeReason',
		'sap/ui/mdc/condition/FilterOperatorUtil',
		'sap/base/util/merge',
		'sap/base/util/deepEqual',
		'sap/base/Log',
		'sap/ui/mdc/condition/Condition'
	],
	function (
		ConditionModelPropertyBinding,
		JSONModel,
		Filter,
		ChangeReason,
		FilterOperatorUtil,
		merge,
		deepEqual,
		Log,
		Condition
	) {
		"use strict";

		/**
		 *
		 * @class JSON based Model for sap.ui.mdc.FilterField controls. The model stores the entered values as condition objects.
		 * @extends sap.ui.model.json.JSONModel
		 *
		 * @author SAP SE
		 * @version 1.74.0
		 * @since 1.48.0
		 * @alias sap.ui.mdc.condition.ConditionModel
		 *
		 * @private
		 * @experimental
		 * @sap-restricted
		 */
		var ConditionModel = JSONModel.extend("sap.ui.mdc.condition.ConditionModel", {
			constructor: function () {
				JSONModel.apply(this, arguments);
				this.setSizeLimit(1000);

				this._oMessageBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");
				sap.ui.getCore().attachLocalizationChanged(function () {
					this._oMessageBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");
				}.bind(this));

				if (!this.getProperty("/conditions")) { // might already be initialized in the constructor.
					this.setProperty("/conditions", {});
				}
				if (!this.getProperty("/fieldPath")) {
					this.setProperty("/fieldPath", {});
				}

				// map to store added FilterField instance
				this._mFieldPath = {};
			}
		});

		ConditionModel.prototype.bindProperty = function (sPath, oContext, mParameters) {

			if (sPath.startsWith("/conditions/")) {
				var sFieldPath = sPath.slice(12);
				this._getFieldPathProperty(sFieldPath); // to initialize FieldPath
				sFieldPath = _escapeFieldPath.call(this, sFieldPath);
				sPath = "/conditions/" + sFieldPath;
			}

			var oBinding = new ConditionModelPropertyBinding(this, sPath, oContext, mParameters);
			return oBinding;
		};

		ConditionModel.prototype.getContext = function (sPath) {

			if (sPath.startsWith("/conditions/")) {
				var sFieldPath = sPath.slice(12);
				sFieldPath = _escapeFieldPath.call(this, sFieldPath);
				sPath = "/conditions/" + sFieldPath;
			}

			return JSONModel.prototype.getContext.apply(this, [sPath]);

		};

		ConditionModel.prototype.bindList = function (sPath, oContext, aSorters, aFilters, mParameters) {
			var oBinding = JSONModel.prototype.bindList.apply(this, arguments);
			oBinding.enableExtendedChangeDetection(true); // to force deep compare of data
			return oBinding;
		};

		ConditionModel.prototype.destroy = function () {

			JSONModel.prototype.destroy.apply(this, arguments);

			delete this._mFieldPath;
			delete this._oMessageBundle;
		};


		/**
		 * creates a clone of the ConditionModel which contains the conditions for the sFieldPath
		 * @param {string} sFieldPath specifies which conditions should be copied into the clone. If not specified all conditions will be copied.
		 * @return {sap.ui.mdc.condition.ConditionModel} instance of new ConditionModel
		 * @public
		 */
		ConditionModel.prototype.clone = function (sFieldPath) {
			var oCM = new ConditionModel();

			oCM._sName = this._sName + "_clone";
			if (sFieldPath === undefined) {
				var aFF = this.getFilterFields();
				if (aFF) {
					aFF.forEach(function (oFF) {
						oCM.addFilterField(oFF);
					}, this);
				}
			} else {
				var oFF = this.getFilterField(sFieldPath);
				if (oFF) {
					oCM.addFilterField(oFF);
				} else {
					Log.error("ConditionModel", "clone of ConditionModel for fieldPath '" + sFieldPath + "' failed!");
					return oCM;
				}
			}

			var oClonedConditions = {};
			if (typeof sFieldPath === "string") {
				var aConditions = this.getConditions(sFieldPath);
				for (var i = 0; i < aConditions.length; i++) {
					var oCondition = aConditions[i];
					var sMyFieldPath = _escapeFieldPath.call(this, sFieldPath);
					if (!oClonedConditions[sMyFieldPath]) {
						oClonedConditions[sMyFieldPath] = [];
					}
					oClonedConditions[sMyFieldPath].push(merge({}, oCondition));
				}
			} else {
				oClonedConditions = merge({}, this.getAllConditions());
			}
			oCM.setConditions(oClonedConditions);

			return oCM;
		};

		/**
		 * merge conditions from the source conditionModel into this instance
		 * @param {string} sFieldPath specifies which conditions should be removed and replaced by the conditions from the source ConditionModel
		 * @param {sap.ui.mdc.condition.ConditionModel} oSourceConditionModel source ConditionModel.
		 * @param {string} sSourceFieldPath specifies which conditions from the source should be merged.
		 * @public
		 */
		ConditionModel.prototype.merge = function (sFieldPath, oSourceConditionModel, sSourceFieldPath) {
			this.removeAllConditions(sFieldPath);
			var oSourceConditions = merge({}, oSourceConditionModel.getAllConditions());
			for (var sMyFieldPath in oSourceConditions) {
				if (!(typeof sSourceFieldPath === "string") || sMyFieldPath === sSourceFieldPath) {
					var aCleanedConditions = Condition._removeEmptyConditions(oSourceConditions[sMyFieldPath]);
					for (var i = 0; i < aCleanedConditions.length; i++) {
						var oCondition = aCleanedConditions[i];
						this.addCondition(sMyFieldPath, oCondition);
					}
				}
			}

			this.checkUpdate(true, true);
		};



		/**
		 * Returns conditions for a specified FieldPath.
		 *
		 * @param {string} sFieldPath fieldPath of the condition
		 * @return {object[]} array of conditions
		 * @public
		 */
		ConditionModel.prototype.getConditions = function (sFieldPath) {
			//TODO: only works for simple flat condition model content
			return _getConditions.call(this, sFieldPath);
		};

		function _getConditions(sFieldPath, bCreateIfEmpty) {

			var oConditions = this.getProperty("/conditions");
			var aConditions;

			if (typeof sFieldPath == "string") { // to support empty string
				sFieldPath = _escapeFieldPath.call(this, sFieldPath);
				if (!oConditions[sFieldPath] && bCreateIfEmpty) {
					oConditions[sFieldPath] = [];
				}
				aConditions = oConditions[sFieldPath] || [];
			} else {
				Log.error("ConditionModel", "getConditions without FieldPath is not supported!");
				aConditions = [];
				for (var sMyFieldPath in oConditions) {
					for (var i = 0; i < oConditions[sMyFieldPath].length; i++) {
						var oCondition = oConditions[sMyFieldPath][i];
						aConditions.push(oCondition);
					}
				}
			}

			return aConditions;
		}

		/**
		 * Returns all conditions.
		 *
		 * @param {string} sFieldPath fieldPath of the condition
		 * @return {object} object with array of conditions for each FieldPath
		 * @public
		 */
		ConditionModel.prototype.getAllConditions = function (sFieldPath) {

			var oConditions = this.getProperty("/conditions");
			var oResult = {};

			// use unescaped fieldPath for outside
			for (var sMyFieldPath in oConditions) {
				var oFieldPath = this.getProperty("/fieldPath");
				var oFildPathInfo = oFieldPath[sMyFieldPath]; // to get unescaped fieldPath
				var sFieldPath = oFildPathInfo ? oFildPathInfo.fieldPath : sMyFieldPath;
				oResult[sFieldPath] = merge([], oConditions[sMyFieldPath]);
			}

			return oResult;

		};

		/**
		 * Determines the index of a condition for a specified FieldPath.
		 *
		 * @param {string} sFieldPath fieldPath of the condition
		 * @param {object} oCondition condition to be searched
		 * @return {object} index of condition (-1 if not found)
		 * @public
		 */
		ConditionModel.prototype.indexOf = function (sFieldPath, oCondition) {

			if (typeof sFieldPath !== "string") {
				throw new Error("sFieldPath must be a string " + this);
			}

			var iIndex = -1;
			var aConditions = this.getConditions(sFieldPath);
			var sCondition = JSON.stringify(oCondition, ['operator', 'values']);
			aConditions.some(function (oCondition, i) {
				if (JSON.stringify(oCondition, ['operator', 'values']) === sCondition) {
					iIndex = i;
					return true;
				}
				return false;
			});
			return iIndex;

		};

		ConditionModel.prototype.exist = function (oCondition, sFieldPath) {
			if (typeof sFieldPath === "string") {
				return this.indexOf(sFieldPath, oCondition) >= 0;
			} else {
				throw new Error("sFieldPath must be provided " + this);
			}
		};

		/**
		 * Sets conditions. All already existing conditions will be removed
		 *
		 * @param {object} oConditions object of conditions for corresponding fieldPaths
		 * @return {sap.ui.mdc.condition.ConditionModel} Reference to <code>this</code> to allow method chaining.
		 * @public
		 */
		ConditionModel.prototype.setConditions = function (oConditions) {

			var i = 0;
			var oCondition;

			this.setProperty("/conditions", {});

			if (Array.isArray(oConditions)) {
				throw new Error("setConditions with an Array of condition is not supported! " + this);
			} else {
				this._bNoSingleEvent = true;
				for (var sMyFieldPath in oConditions) {
					this._getFieldPathProperty(sMyFieldPath); // to initialize FieldPath
					for (i = 0; i < oConditions[sMyFieldPath].length; i++) {
						oCondition = oConditions[sMyFieldPath][i];
						this.insertCondition(sMyFieldPath, -1, oCondition, true);
					}
					sMyFieldPath = _escapeFieldPath.call(this, sMyFieldPath);
					this.firePropertyChange({ reason: ChangeReason.Add, path: "/conditions/" + sMyFieldPath, context: undefined, value: oConditions[sMyFieldPath] });
				}
				this.checkUpdate(true, true);
				this._bNoSingleEvent = false;
			}

			return this;

		};

		/**
		 * Adds a condition for a specified FieldPath.
		 *
		 * @param {string} sFieldPath fieldPath of the condition
		 * @param {object} oCondition condition to be added
		 * @param {boolean} bForce if set the condition will be added even if it already exist
		 * @return {sap.ui.mdc.condition.ConditionModel} Reference to <code>this</code> to allow method chaining.
		 * @public
		 */
		ConditionModel.prototype.addCondition = function (sFieldPath, oCondition, bForce) {

			if (typeof sFieldPath !== "string") {
				throw new Error("sFieldPath must be a string " + this);
			}
			return this.insertCondition(sFieldPath, -1, oCondition, bForce);

		};

		/**
		 * Inserts a condition for a specified FieldPath.
		 *
		 * @param {string} sFieldPath fieldPath of the condition
		 * @param {int} iIndex index where the condition should be inserted
		 * @param {object} oCondition condition to be inserted
		 * @param {boolean} bForce if set the condition will be inserted even if it already exist
		 * @return {sap.ui.mdc.condition.ConditionModel} Reference to <code>this</code> to allow method chaining.
		 * @public
		 */
		ConditionModel.prototype.insertCondition = function (sFieldPath, iIndex, oCondition, bForce) {

			if (typeof sFieldPath !== "string") {
				throw new Error("sFieldPath must be a string " + this);
			}

			var aConditions;

			FilterOperatorUtil.checkConditionsEmpty(oCondition);
			this._updateValues(oCondition);
			this._getFieldPathProperty(sFieldPath); // to create if not exist

			if (!bForce) {
				var i = this.indexOf(sFieldPath, oCondition);
				if (i >= 0) {
					return this;
				}
			}

			// add condition to model
			aConditions = _getConditions.call(this, sFieldPath, true);
			if (iIndex == -1) {
				aConditions.push(oCondition);
			} else {
				aConditions.splice(iIndex, 0, oCondition);
			}

			this._checkMaxConditions(sFieldPath);

			if (!this._bNoSingleEvent) {
				this.checkUpdate(true, true);
				sFieldPath = _escapeFieldPath.call(this, sFieldPath);
				this.firePropertyChange({ reason: ChangeReason.Add, path: "/conditions/" + sFieldPath, context: undefined, value: aConditions });
			}

			return this;
		};

		/**
		 * creates a condition instance for the Item condition
		 *
		 * @param {string} sFieldPath the fieldPath name of the condition
		 * @param {string} sKey the operator for the condition
		 * @param {string} sDescription the description of the operator
		 * @return {object} the new condition object with the given fieldPath, the operator EEQ and the sKey and sDescription as aValues.
		 * @public
		 * @deprecated use the sap.ui.mdc.condition.Condition.createItemCondition
		 */
		ConditionModel.prototype.createItemCondition = function (sFieldPath, sKey, sDescription) {
			Log.error("ConditionModel", "createItemCondition is deprecated");
			return Condition.createItemCondition(sKey, sDescription);
		};

		/**
		 * creates a condition instance for the condition model
		 *
		 * @param {string} sFieldPath the fieldPath name of the condition
		 * @param {string} sOperator the operator for the condition
		 * @param {any[]} aValues the array of values for the condition
		 * @return {object} the new condition object with the given fieldPath, operator and values.
		 * @public
		 * @deprecated use the sap.ui.mdc.condition.Condition.createCondition
		 */
		ConditionModel.prototype.createCondition = function (sFieldPath, sOperator, aValues) {
			Log.error("ConditionModel", "createCondition is deprecated");
			return Condition.createCondition(sOperator, aValues);
		};

		/**
		 * Removes a condition for a specified FieldPath.
		 *
		 * @param {string} sFieldPath fieldPath of the condition
		 * @param {int | object} vCondition condition or index of the condition
		 * @return {boolean} flag if condition was removed.
		 * @public
		 */
		ConditionModel.prototype.removeCondition = function (sFieldPath, vCondition) {

			if (typeof sFieldPath !== "string") {
				throw new Error("sFieldPath must be a string " + this);
			}

			var iIndex = -1;

			if (typeof vCondition === "object") {
				iIndex = this.indexOf(sFieldPath, vCondition);
			} else if (typeof vCondition === "number") {
				iIndex = vCondition;
			}

			var aConditions = this.getConditions(sFieldPath);
			if (aConditions.length > iIndex) {
				aConditions.splice(iIndex, 1);
				this.checkUpdate(true, true);
				this._checkMaxConditions(sFieldPath);
				sFieldPath = _escapeFieldPath.call(this, sFieldPath);
				this.firePropertyChange({ reason: ChangeReason.Remove, path: "/conditions/" + sFieldPath, context: undefined, value: aConditions });
				return true;
			}

			return false;

		};

		/**
		 * Removes all conditions for a specified FieldPath.
		 *
		 * @param {string} sFieldPath fieldPath of the condition
		 * @return {sap.ui.mdc.condition.ConditionModel} Reference to <code>this</code> to allow method chaining.
		 * @public
		 */
		ConditionModel.prototype.removeAllConditions = function (sFieldPath) {

			var oConditions = this.getProperty("/conditions");

			if (typeof sFieldPath === "string") {
				sFieldPath = _escapeFieldPath.call(this, sFieldPath);
				delete oConditions[sFieldPath];
				this.firePropertyChange({ reason: ChangeReason.Remove, path: "/conditions/" + sFieldPath, context: undefined, value: oConditions[sFieldPath] });
			} else {
				for (var sMyFieldPath in oConditions) {
					delete oConditions[sMyFieldPath];
					sMyFieldPath = _escapeFieldPath.call(this, sMyFieldPath);
					this.firePropertyChange({ reason: ChangeReason.Remove, path: "/conditions/" + sMyFieldPath, context: undefined, value: oConditions[sMyFieldPath] });
				}
			}

			this.checkUpdate(true, true);

			return this;

		};

		ConditionModel.prototype._updateValues = function (aConditions) {

			aConditions = aConditions || this.getConditions();
			FilterOperatorUtil.updateConditionsValues(aConditions);

		};

		/**
		 * This function makes a required check for the given sFieldPath (or all).
		 * It only works when the Filterfields are attached to the ConditionModel.
		 * The function is checking that for a required FilterField at least one condition exists.
		 *
		 * @param {boolean} bShowMessage true, when an error message should be shown on the field
		 * @param {string} sFieldPath
		 * @return {boolean} true, if for a sFieldPath the FilterField with required=true no condition exists.
		 *
		 * @private
		 */
		ConditionModel.prototype._checkRequiredConditions = function (bShowMessage, sFieldPath) {
			var aFields = sFieldPath ? [sFieldPath] : Object.keys(this._mFieldPath || {});
			var bError = false;
			var sMsg = this._oMessageBundle.getText("conditionmodel.REQUIRED_CONDITION_MISSING");
			aFields.forEach(function (sFieldPath) {
				if (this._mFieldPath && this._mFieldPath[sFieldPath]) {
					var oFilterField = this._mFieldPath[sFieldPath];
					if (oFilterField.getRequired() && this.getConditions(sFieldPath).length <= 0) {
						if (bShowMessage) {
							this.addFieldPathMessage(sFieldPath, sMsg);
						}
						bError = true;
					} else {
						this.removeFieldPathMessage(sFieldPath, sMsg);
					}
				}
			}, this);

			return !bError;
		};

		/**
		 * This function makes a maxConditions check for the given sFieldPath (or all).
		 * It only works when the Filterfields are attached to the ConditionModel.
		 * The function is checking that for a FilterField the number of conditions is <=maxCondition.
		 *
		 * @param {string} sFieldPath
		 *
		 * @private
		 */
		ConditionModel.prototype._checkMaxConditions = function (sFieldPath) {
			var aFields = sFieldPath ? [sFieldPath] : Object.keys(this._mFieldPath || {});

			aFields.forEach(function (sFieldPath) {
				if (this._mFieldPath && this._mFieldPath[sFieldPath]) {
					var oFilterField = this._mFieldPath[sFieldPath];
					var aConditions = this.getConditions(sFieldPath);
					var iLength = 0;
					// TODO: ignore empty conditions????
					for (var i = 0; i < aConditions.length; i++) {
						if (!aConditions[i].isEmpty) {
							iLength++;
						}
					}

					while (oFilterField.getMaxConditions() >= 0 && iLength > oFilterField.getMaxConditions()) {
						this.removeCondition(sFieldPath, 0);
						iLength--;
					}
				}
			}, this);
		};

		ConditionModel.prototype.addFilterField = function (oFilterField) {
			var sFieldPath = oFilterField.getFieldPath();
			this._mFieldPath[sFieldPath] = oFilterField;

			this._getFieldPathProperty(sFieldPath);
		};

		ConditionModel.prototype.getFilterField = function (sFieldPath) {
			var aFields = Object.keys(this._mFieldPath || {});
			return this._mFieldPath[sFieldPath || aFields[0]];
		};

		ConditionModel.prototype.getFilterFields = function () {
			var aFields = Object.keys(this._mFieldPath || {});
			var aFilterFields = [];
			aFields.forEach(function (sFieldPath) {
				aFilterFields.push(this._mFieldPath[sFieldPath]);
			}, this);
			return aFilterFields;
		};

		ConditionModel.prototype.removeFilterField = function (oFilterField) {
			var sFieldPath = oFilterField.getFieldPath();
			if (this._mFieldPath && this._mFieldPath[sFieldPath]) {
				delete this._mFieldPath[sFieldPath];
			}

			var oFieldPath = this.getProperty("/fieldPath");
			if (oFieldPath && oFieldPath[sFieldPath]) {
				delete oFieldPath[sFieldPath];
			}
		};

		ConditionModel.prototype._getFieldPathProperty = function (sFieldPath) {
			var sEscapedFieldPath = _escapeFieldPath.call(this, sFieldPath);
			var oFieldPath = this.getProperty("/fieldPath");
			if (!oFieldPath[sEscapedFieldPath]) {
				oFieldPath[sEscapedFieldPath] = {
					fieldPath: sFieldPath, // to store unescaped FieldPath (needed for Filter)
					valueState: "None",
					valueStateText: "",
					messages: []
				};
			}

			// create initial conditions array (to have it always for binding)
			var oConditions = this.getProperty("/conditions");
			if (!oConditions[sEscapedFieldPath]) {
				oConditions[sEscapedFieldPath] = [];
			}

			return oFieldPath[sEscapedFieldPath];
		};

		ConditionModel.prototype.addFieldPathMessage = function (sFieldPath, sMsg) {
			var oFieldPath = this._getFieldPathProperty(sFieldPath);

			if (!oFieldPath.messages.some(function (sItem, i) {
				if (sItem === sMsg) {
					return true;
				}
				return false;
			})) {
				oFieldPath.messages.push(sMsg);
			}

			this._updateValueState(sFieldPath);
		};

		ConditionModel.prototype.setUIMessage = function (sFieldPath, sMsg) {
			var oFieldPath = this._getFieldPathProperty(sFieldPath);

			oFieldPath.uiMessage = sMsg;

			this._updateValueState(sFieldPath);
		};

		ConditionModel.prototype.removeFieldPathMessage = function (sFieldPath, sMsg) {
			var iIndex;
			var oFieldPath = this._getFieldPathProperty(sFieldPath);
			if (oFieldPath.messages.some(function (sItem, i) {
				if (sItem === sMsg) {
					iIndex = i;
					return true;
				}
				return false;
			})) {
				oFieldPath.messages.splice(iIndex, 1);
				this._updateValueState(sFieldPath);
			}

		};

		ConditionModel.prototype.removeUIMessage = function (sFieldPath) {
			var oFieldPath = this._getFieldPathProperty(sFieldPath);

			delete oFieldPath.uiMessage;

			this._updateValueState(sFieldPath);
		};

		ConditionModel.prototype._updateValueState = function (sFieldPath) {
			var bUpdate = false,
				oFieldPath = this._getFieldPathProperty(sFieldPath),
				sValueState = "None",
				sValueStateText = "";

			if (oFieldPath.uiMessage) {
				sValueState = "Error";
				sValueStateText = oFieldPath.uiMessage;
			} else if (oFieldPath.messages.length > 0) {
				sValueState = "Error";
				sValueStateText = oFieldPath.messages[oFieldPath.messages.length - 1];
			}

			if (oFieldPath.valueState !== sValueState) {
				oFieldPath.valueState = sValueState;
				bUpdate = true;
			}

			if (oFieldPath.valueStateText !== sValueStateText) {
				oFieldPath.valueStateText = sValueStateText;
				bUpdate = true;
			}

			if (bUpdate) {
				this.checkUpdate(true, true);
			}
		};

		ConditionModel.prototype.isValid = function (bValidate, sFieldPath) {
			var aFields = sFieldPath ? [sFieldPath] : Object.keys(this._mFieldPath || {});
			var bValid = this._checkRequiredConditions(bValidate);
			aFields.forEach(function (sFieldPath) {
				var oFieldPath = this._getFieldPathProperty(sFieldPath);
				bValid = bValid && oFieldPath.valueState == "None";
			}, this);

			return bValid;
		};


		ConditionModel.prototype._prettyPrintFilters = function (oFilter) {
			var sRes;
			if (!oFilter) {
				return "";
			}
			if (oFilter._bMultiFilter) {
				sRes = "";
				var bAnd = oFilter.bAnd;
				oFilter.aFilters.forEach(function (oFilter, index, aFilters) {
					sRes += this._prettyPrintFilters(oFilter);
					if (aFilters.length - 1 != index) {
						sRes += bAnd ? " and " : " or ";
					}
				}, this);
				return "(" + sRes + ")";
			} else {
				sRes = oFilter.sPath + " " + oFilter.sOperator + " '" + oFilter.oValue1 + "'";
				if (oFilter.sOperator === "BT") {
					sRes += "...'" + oFilter.oValue2 + "'";
				}
				return sRes;
			}
		};

		ConditionModel.prototype.getFilters = function (sFieldPath) {
			var i, aLocalFilters, aLocalNEFilters, aOverallFilters = [],
				oConditions,
				oToAnyFilterParam, aSections, sNavPath, sPropertyPath;

			if (sFieldPath === undefined) {
				oConditions = this.getAllConditions();
			} else if (typeof sFieldPath === "string") {
				oConditions = {};
				oConditions[sFieldPath] = this.getConditions(sFieldPath);
			} else {
				oConditions = {};
			}

			var oOperator, oFilter;

			// OR-combine filters for each property
			for (var sMyFieldPath in oConditions) {
				aLocalFilters = [];
				aLocalNEFilters = [];
				oToAnyFilterParam = null;
				var aConditions = oConditions[sMyFieldPath];
				var oFieldPath = this.getProperty("/fieldPath");
				var oFildPathInfo = oFieldPath[sMyFieldPath]; // to get unescaped fieldPath
				var sFilterPath = oFildPathInfo ? oFildPathInfo.fieldPath : sMyFieldPath;

				for (i = 0; i < aConditions.length; i++) {
					// only collect conditions for fieldPath and operator != NE
					oOperator = FilterOperatorUtil.getOperator(aConditions[i].operator);
					oFilter = oOperator.getModelFilter(aConditions[i], sFilterPath);

					if (!oOperator.exclude) {

						if (oFilter.sPath === "$search") {
							//ignore the $search conditions
							continue;
						}

						// basic search condition handling split the oFilter with sPath == "*xxx,yyy*" into multiple filter
						// e.g. fieldPath "*title,year*" - such fieldPath onlyworks with type  string and an operation with a single value (e.g. contains)
						//TODO this should be removed. Only $search will be supported as sPath. This mapping of a *fieldPath1,FieldPath2* is currently only used on the mockServer
						var $searchfilters = /^\*(.+)\*$/.exec(oFilter.sPath);
						if ($searchfilters) {
							// $search mapping
							var aFieldPath = $searchfilters[1].split(',');
							for (var j = 0; j < aFieldPath.length; j++) {
								aLocalFilters.push(new Filter(aFieldPath[j], oFilter.sOperator, oFilter.oValue1));
							}
							continue;
						}

						// ANY condition handling e.g. fieldPath "navPath*/propertyPath"
						if (oFilter.sPath && oFilter.sPath.indexOf('*/') > -1) {
							aSections = oFilter.sPath.split('*/');
							if (aSections.length === 2) {
								sNavPath = aSections[0];
								sPropertyPath = aSections[1];
								oFilter.sPath = 'L1/' + sPropertyPath;

								if (!oToAnyFilterParam) {
									oToAnyFilterParam = {
										path: sNavPath,
										operator: 'Any',
										variable: 'L1'
									};
								}
								aLocalFilters.push(oFilter);
							} else {
								throw new Error("Not Implemented");
							}
						} else {
							aLocalFilters.push(oFilter);
						}
					} else {
						//collect all exclude (NE) conditions as AND fieldPath != "value"
						aLocalNEFilters.push(oFilter);
					}
				}

				if (oToAnyFilterParam) {
					if (aLocalFilters.length === 1) {
						oToAnyFilterParam.condition = aLocalFilters[0];
					} else if (aLocalFilters.length > 1) {
						oToAnyFilterParam.condition = new Filter({ filters: aLocalFilters, and: false });
					}
					aLocalFilters = [new Filter(oToAnyFilterParam)];
				}

				// take the single Filter or combine all with OR
				oFilter = undefined;
				if (aLocalFilters.length === 1) {
					oFilter = aLocalFilters[0]; // could omit this and have an OR-ed array with only one filter, but it's nice this way.
				} else if (aLocalFilters.length > 1) {
					oFilter = new Filter({ filters: aLocalFilters, and: false });
				}

				// merge Include-filter and all NE-filter into the Overallfilter, they will be AND added to the result
				if (oFilter) {
					aLocalNEFilters.unshift(oFilter); // add in-filters to the beginning (better to read)
				}

				if (aLocalNEFilters.length === 1) {
					aOverallFilters.push(aLocalNEFilters[0]);
				} else if (aLocalNEFilters.length > 1) {
					aOverallFilters.push(new Filter({ filters: aLocalNEFilters, and: true })); // to have all filters for one path grouped
				}
			}

			// AND-combine filters for different properties and apply filters
			if (aOverallFilters.length === 1) {
				return aOverallFilters[0]; // could omit this and have an ORed array with only one filter, but it's nice this way.
			} else if (aOverallFilters.length > 1) {
				return new Filter({ filters: aOverallFilters, and: true });
			} else { // no filters
				return null;
			}
		};

		ConditionModel.prototype.serialize = function () {
			var oConditions = merge({}, this.getAllConditions());

			for (var sMyFieldPath in oConditions) {
				var aConditions = oConditions[sMyFieldPath];
				aConditions.forEach(function (oCondition) {
					delete oCondition.isEmpty;
				}, this);

				if (aConditions.length === 0) {
					delete oConditions[sMyFieldPath];
				}
			}

			return '{"conditions":' + JSON.stringify(oConditions) + "}";
		};

		ConditionModel.prototype.serializeMeta = function () {
			var aFields = Object.keys(this._mFieldPath || {});
			var r = "";
			aFields.forEach(function (sFieldPath) {
				if (this.getData().fieldPath[sFieldPath].valueState !== "None") {
					r += JSON.stringify(this.getData().fieldPath[sFieldPath]);
				}
			}, this);

			return '{"fieldPath":' + r + "}";
		};

		ConditionModel.prototype.parse = function (sObjects) {
			var dateTimeReviver = function (key, value) {
				var a;
				if (!isNaN(parseInt(key)) && (typeof value === 'string')) {
					a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z$/.exec(value);
					if (a) {
						return new Date(value);
					}
				}
				return value;
			};

			this.setConditions(JSON.parse(sObjects, dateTimeReviver).conditions);
		};

		function _escapeFieldPath(sFieldPath) {

			if (sFieldPath) {
				var aParts = sFieldPath.split("/");

				if (aParts.length > 1) {
					sFieldPath = "";

					for (var i = 0; i < aParts.length; i++) {
						var sPart = aParts[i];
						if (i > 0) {
							if (!isNaN(sPart) || !isNaN(aParts[i - 1])) {
								sFieldPath = sFieldPath + "/";
							} else {
								sFieldPath = sFieldPath + "_";
							}
						}
						sFieldPath = sFieldPath + sPart;
					}
				}

			}

			return sFieldPath;

		}

		return ConditionModel;
		});
