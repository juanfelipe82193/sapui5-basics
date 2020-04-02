/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/base/ManagedObject",
	"./AggregationUtils",
	"./GanttUtils"
],
	function(jQuery, ManagedObject, AggregationUtils, GanttUtils) {
	"use strict";

	/**
	 * Creates and initializes a new ExpandModel class.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * ExpandModel manages the internal states on expand charts
	 *
	 * @extends sap.gantt.simple.ExpandModel
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @private
	 * @alias sap.gantt.simple.ExpandModel
	 */
	var ExpandModel = ManagedObject.extend("sap.gantt.simple.ExpandModel", /** @lends sap.gantt.simple.ExpandModel.prototype */ {
		metadata: {
			properties: {
				baseRowHeight: {type : "int", group : "Appearance", defaultValue : null}
			}
		},
		constructor : function() {
			ManagedObject.apply(this, arguments);

			/***
			 * {
			 *   "row_uid_1": [
			 *   	 {scheme: "ac_main", metadata: {rowSpan: 1, main: true, rowSpanSum: 4}},
			 *   	 {scheme: "ac_overlap", metadata: { rowSpan: 1, main: false, numberOfRows: 3}},
			 *   	 {scheme: "ac_utilization", metadata: { rowSpan: 3, main: false, numberOfRows: 1}}
			 *   ]
			 *   ...
			 * }
			 */
			this.mExpanded = {};
		}
	});

	ExpandModel.prototype.isTableRowHeightNeedChange = function(bExpanded, oTable, aSelectedIndices, oPrimaryScheme, oExpandScheme) {
		var bExpandToggled = false;

		var iFirstVisibleRow = oTable.getFirstVisibleRow();

		var sShapeScheme = oExpandScheme.getKey();
		for (var iIndex = 0; iIndex < aSelectedIndices.length; iIndex++) {
			var iSelectedIndex = aSelectedIndices[iIndex];

			var bSelectedRowInvisible = iFirstVisibleRow > iSelectedIndex;
			if (bSelectedRowInvisible) {
				// do nothing if the selected row is not visible
				break;
			}

			var oRowSettings = GanttUtils.getSelectedTableRowSettings(oTable, iSelectedIndex);

			if (oRowSettings == null) {
				// possible that the Control haven't been placed At anywhere
				break;
			}
			var aExpandableShapes = oRowSettings.getAllExpandableShapes();

			var aLength = [];

			aExpandableShapes.forEach(function(oMainshape){ // eslint-disable-line
				var aChild = AggregationUtils.getLazyElementsByScheme(oMainshape, sShapeScheme);
				aLength.push(aChild.length);
			});

			var iMaxLength = Math.max.apply(null, aLength);
			if (iMaxLength > 0) {
				this.toggle(bExpanded, oRowSettings, oPrimaryScheme, oExpandScheme, iMaxLength);
				bExpandToggled = true;
			}
		}

		return bExpandToggled;
	};

	ExpandModel.prototype.refreshRowYAxis = function(oTable) {
		if (this.hasExpandedRows() === false) {
			return;
		}
		var aRows = oTable.getRows();

		var aRowHeight = oTable.getParent().getTableRowHeights();

		var fAccumulateHeight = 0;
		for (var i = 0; i < aRows.length; i++) {
			var oRow = aRows[i],
				oRowSettings = oRow.getAggregation("_settings"),
				sRowUid = oRowSettings.getRowUid();

			fAccumulateHeight += (aRowHeight[i - 1] || 0);

			if (!this.isRowExpanded(sRowUid)) {
				continue;
			}

			this.calcExpandRowYAxis({
				uid: oRowSettings.getRowUid(),
				rowIndex: i,
				rowY: fAccumulateHeight,
				baseRowHeight: this.getBaseRowHeight(),
				allRowHeights: aRowHeight
			});
		}
	};

	ExpandModel.prototype.toggle = function(bExpanded, oRowSettings, oMainScheme, oExpandScheme, iMaxLength) {
		if (bExpanded) {
			this.expand(oRowSettings, oMainScheme, oExpandScheme, iMaxLength);
		} else {
			this.collapse(oRowSettings, oExpandScheme);
		}
	};

	ExpandModel.prototype.expand = function(oRowSettings, oMainScheme, oExpandScheme, iMaxNumberOfDetails) {
		jQuery.sap.assert(typeof iMaxNumberOfDetails === "number", "iMaxNumberOfDetails must be a number");

		var sUid = oRowSettings.getRowUid(),
			sMainSchemeKey = oMainScheme.getKey(),
			iMainRowSpan = oMainScheme.getRowSpan();

		var sExpandSchemeKey = oExpandScheme.getKey(),
			iExpandRowSpan = oExpandScheme.getRowSpan();

		var aItems = this.mExpanded[sUid];
		if (!aItems || aItems.length === 0) {
			this.mExpanded[sUid] = [{
				scheme: sMainSchemeKey,
				metadata: {rowSpan: iMainRowSpan, main: true }
			}];
		}

		if (!this.hasExpandScheme(sUid, sExpandSchemeKey)) {
			this.mExpanded[sUid].push({
				scheme: sExpandSchemeKey,
				metadata: {
					numberOfRows: iMaxNumberOfDetails,
					rowSpan: iExpandRowSpan
				}
			});
		}

		this.updateVisibleRowSpan(sUid);
	};

	ExpandModel.prototype.collapse = function(oRowSettings, oExpandScheme) {
		var sUid = oRowSettings.getRowUid();
		if (sUid && this.mExpanded[sUid] == null) {
			// the row haven't been expanded, thus return immediately
			return;
		}

		var sExpandScheme = oExpandScheme.getKey();

		var aItems = this.mExpanded[sUid];
		for (var iIndex = 0; iIndex < aItems.length; iIndex++) {
			var oItem = aItems[iIndex];
			if (oItem.scheme === sExpandScheme) {
				aItems.splice(iIndex, 1);
			}
			if (this.hasNoExpandRows(sUid)) {
				delete this.mExpanded[sUid];
				break;
			} else {
				this.updateVisibleRowSpan(sUid);
			}
		}
	};

	ExpandModel.prototype.hasExpandScheme = function(sUid, sScheme) {
		return this.mExpanded[sUid].filter(function(oItem){
			return oItem.scheme === sScheme;
		}).length > 0;
	};

	ExpandModel.prototype.hasExpandedRows = function() {
		return !jQuery.isEmptyObject(this.mExpanded);
	};

	ExpandModel.prototype.isRowExpanded = function(sUid) {
		return !this.hasNoExpandRows(sUid);
	};

	ExpandModel.prototype.hasNoExpandRows = function(sUid) {
		var aItems = this.mExpanded[sUid] || [];
		return aItems.every(function(oItem){
			return oItem.metadata.main;
		});
	};

	ExpandModel.prototype.updateVisibleRowSpan = function(sUid) {
		var aItems = this.mExpanded[sUid] || [];

		var sMainKey, oMain, iSum = 0;
		for (var iIndex = 0; iIndex < aItems.length; iIndex++) {
			var oItem = aItems[iIndex];
			var sKey = oItem.scheme;
			var oValue = oItem.metadata;
			if (oValue.main) {
				sMainKey = sKey;
				oMain = oValue;
				iSum += oValue.rowSpan;
			} else {
				iSum += oValue.rowSpan * (oValue.numberOfRows || 1);
			}
		}

		oMain.rowSpanSum = iSum;
		this.mExpanded[sUid][0] = {
			scheme: sMainKey,
			metadata: oMain
		};
	};

	ExpandModel.prototype.getMainRowScheme = function(sUid) {
		var aItems = this.mExpanded[sUid] || [];
		return aItems.filter(function(oItem){
			return oItem.metadata.main;
		}).map(function(oMain){
			return {
				key: oMain.scheme,
				value: oMain.metadata
			};
		})[0];
	};

	ExpandModel.prototype.getExpandSchemeKeys = function(sUid) {
		var aItems = this.mExpanded[sUid] || [];
		return aItems.filter(function(oItem){
			return !oItem.metadata.main;
		}).map(function(oItem){
			return oItem.scheme;
		});
	};

	/**
	 * Calculate the row height based on the row expand scheme and fallback to default row height
	 * if row has not expanded
	 *
	 * @private
	 * @param {@sap.gantt.GanttRowSettings} oRowSettings RowSettings
	 * @param {int} iBaseRowHeight the fallback rowheight if row is not expanded
	 * @returns {int} return the calculated the row height on expand chart
	 */
	ExpandModel.prototype.getCalculatedRowHeight = function(oRowSettings, iBaseRowHeight) {
		var iResult = iBaseRowHeight;
		if (this.hasExpandedRows()) {
			var sUid = oRowSettings.getRowUid();
			if (!sUid) { return iResult; }

			var aItems = this.mExpanded[sUid];
			if (aItems) {
				var oMain = this.getMainRowScheme(sUid);
				iResult = iBaseRowHeight * oMain.value.rowSpanSum;
			}
		}
		return iResult;
	};

	ExpandModel.prototype.getRowHeightByIndex = function(oTable, iIndex, iTableRowHeight) {
		if (oTable == null) {
			return iTableRowHeight;
		}

		var aRows = oTable.getRows(),
			oRowSettings = aRows[iIndex].getAggregation("_settings");
		return this.getCalculatedRowHeight(oRowSettings, iTableRowHeight);
	};

	ExpandModel.prototype.calcExpandRowYAxis = function(mParam) {
		var sUid = mParam.uid,
			iBaseRowHeight = mParam.baseRowHeight;

		var iFirstStartY = mParam.rowY;

		var oMainRowScheme,
			sMainSchemeKey,
			aExpandSchemeKey = [];

		var aExpandSchemes = [];

		var aItems = this.mExpanded[sUid];
		if (jQuery.isEmptyObject(aItems)) { return; }

		for (var iIndex = 0; iIndex < aItems.length; iIndex++) {
			var oExpandItem = aItems[iIndex],
				sKey = oExpandItem.scheme,
				oValue = oExpandItem.metadata;
			if (oValue.main) {
				oMainRowScheme = oValue;
				sMainSchemeKey = sKey;
			} else {
				aExpandSchemes.push(oValue);
				aExpandSchemeKey.push(sKey);
			}
		}
		var iMainRowSpan = oMainRowScheme ? oMainRowScheme.rowSpan : 1;

		var oItem = {};
		oItem[sMainSchemeKey] = [iMainRowSpan];
		var aRowSpans = [oItem];

		for (var i = 0; i < aExpandSchemes.length; i++) {
			var oExpandScheme = aExpandSchemes[i],
				iRowSpan = oExpandScheme.rowSpan,
				iMaxLength = oExpandScheme.numberOfRows;
			var aSpans = [];
			for (var j = 0; j < iMaxLength; j++) {
				aSpans.push(iRowSpan);
			}
			oItem = {};
			oItem[aExpandSchemeKey[i]] = aSpans;
			aRowSpans.push(oItem);
		}

		var iRelativeY = iFirstStartY;
		for (var m = 0; m < aRowSpans.length; m++) {
			var oSpanItem = aRowSpans[m],
				sScheme = Object.keys(oSpanItem)[0],
				aSubSpans = oSpanItem[sScheme];

			if (m === 0) {
				this._updateRowYAxis(sUid, sScheme, {
					rowYAxis: [iRelativeY].slice()
				});
			} else {
				var aSubRowYStart = [];

				if (aSubSpans.length === 1) {
					aSubRowYStart.push(iRelativeY + iBaseRowHeight);
					iRelativeY += (aSubSpans[0] * iBaseRowHeight);
				} else {
					for (var n = 0; n < aSubSpans.length; n++) {
						iRelativeY = iRelativeY + (aSubSpans[n] * iBaseRowHeight);
						aSubRowYStart.push(iRelativeY);
					}
				}

				//expand row
				this._updateRowYAxis(sUid, sScheme, {
					rowYAxis: aSubRowYStart.slice()
				});
			}
		}

	};

	ExpandModel.prototype._updateRowYAxis = function(sUid, sSchemeKey, vValue) {
		var aRowYAxis = vValue.rowYAxis;
		var aItems = this.mExpanded[sUid] || [];
		for (var iIndex = 0; iIndex < aItems.length; iIndex++) {
			var oItem = aItems[iIndex];
			if (oItem.scheme === sSchemeKey) {
				oItem.metadata.yAxis = aRowYAxis;
				break;
			}
		}
	};

	ExpandModel.prototype.getRowYCenterByUid = function(sUid, iMainRowYCenter, sSchemeKey, iExpandIndex) {
		var bRowExpanded = this.isRowExpanded(sUid);
		if (bRowExpanded === false) {
			// non expand mode
			return iMainRowYCenter;
		}

		var aItems = this.mExpanded[sUid],
			sScheme = sSchemeKey || this.getMainRowScheme(sUid).key;

		for (var iIndex = 0; iIndex < aItems.length; iIndex++) {
			var oItem = aItems[iIndex];
			if (oItem.scheme === sScheme) {
				var aYAxis = oItem.metadata.yAxis;
				var iBaseRowHeight = this.getBaseRowHeight(),
					iShapeHeight = iBaseRowHeight * oItem.metadata.rowSpan;
				var aRowYCenters = aYAxis.map(function(iValue){ //eslint-disable-line
					return iValue + (iShapeHeight / 2);
				});

				var i = iExpandIndex === undefined ? 0 : iExpandIndex;
				return aRowYCenters[i];
			}
		}
	};

	ExpandModel.prototype.getExpandShapeHeightByUid = function(sUid, sShapeScheme, iFallbackHeight) {
		var aItems = this.mExpanded[sUid];
		var oFoundItem = aItems.filter(function(oItem){
			return oItem.scheme === sShapeScheme;
		})[0];
		return oFoundItem ? oFoundItem.metadata.rowSpan * this.getBaseRowHeight() : iFallbackHeight;
	};

	ExpandModel.prototype.intersectRows = function(aLeft, aRight) {
		return jQuery.grep(aLeft, function(sLeft){
			return jQuery.inArray(sLeft, aRight) > -1;
		});
	};

	ExpandModel.prototype.collectExpandedBgData = function(aRowUid) {
		var aIntersectRows = this.intersectRows(aRowUid, Object.keys(this.mExpanded));
		if (jQuery.isEmptyObject(this.mExpanded)
				|| jQuery.isEmptyObject(aRowUid)
				|| jQuery.isEmptyObject(aIntersectRows)) {
			return [];
		}

		var iRowHeight = this.getBaseRowHeight();
		var aResult = [];
		for (var iIndex = 0; iIndex < aIntersectRows.length; iIndex++) {
			var sUid = aIntersectRows[iIndex],
				aItems = this.mExpanded[sUid] || [];

			for (var i = 0; i < aItems.length; i++) {
				var oItem = aItems[i],
					aYAxis = oItem.metadata.yAxis || [],
					bMain = oItem.metadata.main;
				if (!bMain) {
					var aSubResult = [];
					aYAxis.forEach(function(iY){ //eslint-disable-line
						aSubResult.push({
							x: 0,
							y: iY,
							rowUid: sUid,
							rowHeight: iRowHeight * oItem.metadata.rowSpan
						});
					});

					aResult.push(aSubResult);
				}
			}
		}
		return aResult;
	};

	return ExpandModel;

}, true /**bExport*/);
