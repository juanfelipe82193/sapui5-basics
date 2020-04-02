/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/fl/apply/api/FlexRuntimeInfoAPI"], function(FlexRuntimeInfoAPI) {
	"use strict";
	var fRebindControl = function(oControl) {
		var bExecuteRebindForTable = oControl && oControl.isA && oControl.isA("sap.ui.mdc.Table") && oControl.isTableBound();
		var bExecuteRebindForChart = oControl && oControl.isA && oControl.isA("sap.ui.mdc.Chart");
		if (bExecuteRebindForTable || bExecuteRebindForChart) {
			if (!oControl._bWaitForBindChanges) {
				oControl._bWaitForBindChanges = true;
				FlexRuntimeInfoAPI.waitForChanges({
					element: oControl
				}).then(function() {
					if (bExecuteRebindForTable) {
						oControl.rebindTable();
					} else if (bExecuteRebindForChart) {
						oControl._rebind();
					}
					delete oControl._bWaitForBindChanges;
				});

			}
		}
	};

	var fParseObjectToArray = function(mValue) {
		var aValue = [];

		/*
		* In case the sorters are empty, mValue will contain 'null' as value,
		* since an empty object leads to further errors during XML when using the XMLTreeModifier.
		* In case a sorter is removed and no sorter is going to be set on the property "sortConditions",
		* it has to be stored as 'null' due to the later logic from ManagedObject + BindingParser
		*/
		if (!mValue) {
			return aValue;
		}

		Object.keys(mValue).forEach(function(sName) {
			aValue.push({
				name: sName,
				descending: mValue[sName].descending
			});
		});
		return aValue;
	};

	var fParseArrayToObject = function(aValue) {
		var mValue = aValue.reduce(function(map, obj) {
			map[obj.name] = { descending: obj.descending };
			return map;
		}, {});
		return mValue || {};
	};

	var fFinalizeSortChange = function(oChange, oControl, oSortContent, bIsRevert) {
		if (bIsRevert) {
			// Clear the revert data on the change
			oChange.resetRevertData();
		} else {
			// Set revert data on the change
			oChange.setRevertData({
				sortContent: oSortContent
			});
		}
		// Rebind Table if needed
		fRebindControl(oControl);
	};

	var fAddSort = function(oChange, oControl, mPropertyBag, bIsRevert) {
		return new Promise(function(resolve, reject) {
			var oModifier = mPropertyBag.modifier;
			var oChangeContent = bIsRevert ? oChange.getRevertData() : oChange.getContent();
			var mValue = oModifier.getProperty(oControl, "sortConditions");

			var aValue = fParseObjectToArray(mValue);

			var oSortContent = {
				name: oChangeContent.name,
				descending: oChangeContent.descending
			};

			aValue.splice(oChangeContent.index, 0, oSortContent);

			mValue = fParseArrayToObject(aValue);

			oModifier.setProperty(oControl, "sortConditions", mValue);

			fFinalizeSortChange(oChange, oControl, oSortContent, bIsRevert);
			resolve();
		});
	};

	var fRemoveSort = function(oChange, oControl, mPropertyBag, bIsRevert) {
		return new Promise(function(resolve, reject) {
			var oModifier = mPropertyBag.modifier;
			var oChangeContent = bIsRevert ? oChange.getRevertData() : oChange.getContent();
			var mValue = oModifier.getProperty(oControl, "sortConditions");

			var aValue = fParseObjectToArray(mValue);

			if (!aValue) {
				// Nothing to remove
				reject();
			}

			var aFoundValue = aValue.filter(function(o) {
				return o.name === oChangeContent.name;
			});
			var iIndex = aValue.indexOf(aFoundValue[0]);

			aValue.splice(iIndex, 1);

			mValue = fParseArrayToObject(aValue);

			//In case a sorter is removed after it has been added, it has to be checked whether there is any sorter left
			if (Object.keys(mValue).length === 0 && mValue.constructor === Object) {
				mValue = null;
			}

			oModifier.setProperty(oControl, "sortConditions", mValue);

			fFinalizeSortChange(oChange, oControl, oChangeContent, bIsRevert);
			resolve();
		});
	};

	var fMoveSort = function(oChange, oControl, mPropertyBag, bIsRevert) {
		return new Promise(function(resolve, reject) {
			var oModifier = mPropertyBag.modifier;
			var oChangeContent = bIsRevert ? oChange.getRevertData() : oChange.getContent();
			var mValue = oModifier.getProperty(oControl, "sortConditions");

			var aValue = fParseObjectToArray(mValue);

			var aFoundValue = aValue.filter(function(o) {
				return o.name === oChangeContent.name;
			});

			//remove the item from the 'sortConditions' array, insert it at the new position
			var iOldIndex = aValue.indexOf(aFoundValue[0]);
			aValue.splice(oChangeContent.index, 0, aValue.splice(iOldIndex, 1)[0]);

			mValue = fParseArrayToObject(aValue);

			oModifier.setProperty(oControl, "sortConditions", mValue);

			//finalize the 'moveSort' change (only persist name + index)
			fFinalizeSortChange(oChange, oControl, oChangeContent, bIsRevert);
			resolve();
		});
	};

	var Sort = {};
	Sort.removeSort = {
		"changeHandler": {
			applyChange: function(oChange, oControl, mPropertyBag) {
				return fRemoveSort(oChange, oControl, mPropertyBag, false);
			},
			completeChangeContent: function(oChange, mChangeSpecificInfo, mPropertyBag) {
				// Not used, but needs to be there
			},
			revertChange: function(oChange, oControl, mPropertyBag) {
				return fAddSort(oChange, oControl, mPropertyBag, true);
			}
		},
		"layers": {
			"USER": true
		}
	};

	Sort.addSort = {
		"changeHandler": {
			applyChange: function(oChange, oControl, mPropertyBag) {
				return fAddSort(oChange, oControl, mPropertyBag, false);
			},
			completeChangeContent: function(oChange, mChangeSpecificInfo, mPropertyBag) {
				// Not used, but needs to be there
			},
			revertChange: function(oChange, oControl, mPropertyBag) {
				return fRemoveSort(oChange, oControl, mPropertyBag, true);
			}
		},
		"layers": {
			"USER": true
		}
	};

	Sort.moveSort = {
		"changeHandler": {
			applyChange: function(oChange, oControl, mPropertyBag) {
				return fMoveSort(oChange, oControl, mPropertyBag);
			},
			completeChangeContent: function(oChange, mChangeSpecificInfo, mPropertyBag) {
				// Not used, but needs to be there
			},
			revertChange: function(oChange, oControl, mPropertyBag) {
				return fMoveSort(oChange, oControl, mPropertyBag, true);
			}
		},
		"layers": {
			"USER": true
		}
	};
	return Sort;
});
