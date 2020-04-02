sap.ui.define(["./DataMaker"], function (DataMaker) {
	"use strict";

	function TRUCKULCDataMaker(sHierarchyId, oTimePattern, oInterval, oCalendarPattern, oUtil) {
		DataMaker.call(this, sHierarchyId, oTimePattern, oInterval, oCalendarPattern, oUtil);
	}
	TRUCKULCDataMaker.prototype = new DataMaker();

	TRUCKULCDataMaker.prototype.makeData = function () {

		this._createHierarchyResource({ id: "root", type: "root" });
		this.addRow("root", "01_0", {
			"text": "truck01_0",
			"plate": "EF20110",
			"plate_expire": "20200819000000",
			"id": "0000",
			"type": "06",
			"selected": false
		});
		this.addRowNode("01_0", "root-ulc_01_0", "ulc", { "rowIndex": 1 });
		this.addRowNode("root-ulc_01_0", "order_01_0", "order", {});
		this.addRowNode("order_01_0", "order-util-volume_01_0", "util", { dimension: "util_volume" });
		var ulcAct140 = {
			"startTime": "20141002000000",
			"endTime": "20141005000000",
			"type": 1
		};
		var ulcAct141 = {
			"startTime": "20141005000000",
			"endTime": "20141020000000",
			"util_volume": 25,
			"util_mass": 50,
			"type": 0
		};
		var ulcAct142 = {
			"startTime": "20141020000000",
			"endTime": "20141024000000",
			"type": 2
		};
		this.addULCToNode("order-util-volume_01_0", "order-util-volume_01_0-data", "values", [ulcAct140, ulcAct141, ulcAct142], "util_volume");
		this.addRowNode("order_01_0", "order-util-mass_01_0", "util", { dimension: "util_mass" });
		this.addRowNodeByGroup("order-util-mass_01_0", "order-util-mass_01_0-data", "values", [ulcAct140, ulcAct141, ulcAct142], "util_mass");
		this.addRow("root", "01_1", {
			"text": "truck01_1",
			"plate": "EF20112",
			"plate_expire": "20201219000000",
			"id": "0001",
			"type": "06",
			"selected": false
		});
		this.addRowNode("01_1", "root-ulc_01_1", "ulc", { "rowIndex": 1 });
		this.addRowNode("root-ulc_01_1", "order_01_1", "order", {});
		this.addRowNode("order_01_1", "order-util-volume_01_1", "util", { dimension: "util_volume" });
		var ulcAct110 = {
			"startTime": "20140916000000",
			"endTime": "20140918000000",
			"type": 1
		};
		var ulcAct111 = {
			"startTime": "20140918000000",
			"endTime": "20140930000000",
			"util_volume": 90,
			"util_mass": 98,
			"type": 0
		};
		var ulcAct112 = {
			"startTime": "20140930000000",
			"endTime": "20141002000000",
			"type": 2
		};
		var ulcAct113 = {
			"startTime": "20141002000000",
			"endTime": "20141010000000",
			"util_volume": 50,
			"util_mass": 30,
			"type": 0
		};
		var ulcAct114 = {
			"startTime": "20141010000000",
			"endTime": "20141012000000",
			"type": 2
		};
		this.addULCToNode("order-util-volume_01_1", "order-util-volume_01_1-data", "values", [ulcAct110, ulcAct111, ulcAct112, ulcAct113, ulcAct114], "util_volume");
		this.addRowNode("order_01_1", "order-util-mass_01_1", "util", { dimension: "util_mass" });
		this.addULCToNode("order-util-mass_01_1", "order-util-mass_01_1-data", "values", [ulcAct110, ulcAct111, ulcAct112, ulcAct113, ulcAct114], "util_mass");
		return this;

	};

	TRUCKULCDataMaker.prototype.addULCToNode = function (sTargetRowUUID, sNodeInfoUUID, sType, oNodeInfo, sULCType) {

		var oTargetRow = this._searchObjectByUUID(sTargetRowUUID);
		if (!oTargetRow[sType]) {
			oTargetRow[sType] = [];
		}
		var oValuesGroup = this._produceULCGroup(sNodeInfoUUID, sType, oNodeInfo, sULCType);
		oTargetRow[sType] = oTargetRow[sType].concat(oValuesGroup);
		var oParent = this._searchParentByUUID(sTargetRowUUID);
		var oTooltip = this._addTooltipToULCOrder(oParent, oValuesGroup, oTargetRow.dimension);
		oParent = this._searchParentByUUID(oParent.uuid);
		this._addTooltipToULC(oParent, oTooltip);
		return oTargetRow[sType];

	};

	TRUCKULCDataMaker.prototype._produceULCGroup = function (sNodeInfoUUID, sType, oObjectInfo, sULCType) {

		var aGroup = [];
		for (var i = 0; i < oObjectInfo.length; i++) {
			var aULCNode = [];
			if (oObjectInfo.length == 1) {
				aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].startTime, oObjectInfo[i].startTime, 0));
				aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].endTime, oObjectInfo[i].endTime, oObjectInfo[i][sULCType] || 0));
			} else {
				if (i == 0) {
					if (oObjectInfo[i].type == 1) {
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].startTime, oObjectInfo[i].startTime, oObjectInfo[i][sULCType] || 0));
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].endTime, oObjectInfo[i].endTime, oObjectInfo[i + 1][sULCType] || 0));
					} else if (oObjectInfo[i].type == 2) {
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].startTime, oObjectInfo[i].startTime, oObjectInfo[i][sULCType] || 0));
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].endTime, oObjectInfo[i].endTime, oObjectInfo[i + 1][sULCType] || 0));
					} else {
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].startTime, oObjectInfo[i + 1].startTime, oObjectInfo[i][sULCType] || 0));
					}
				} else if (i == oObjectInfo.length - 1) {
					if (oObjectInfo[i].type == 1) {
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].startTime, oObjectInfo[i].startTime, oObjectInfo[i - 1][sULCType] || 0));
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].endTime, oObjectInfo[i].endTime, oObjectInfo[i][sULCType] || 0));
					} else if (oObjectInfo[i].type == 2) {
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].startTime, oObjectInfo[i].startTime, oObjectInfo[i - 1][sULCType] || 0));
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].endTime, oObjectInfo[i].endTime, oObjectInfo[i][sULCType] || 0));
					} else {
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].startTime, oObjectInfo[i].startTime, oObjectInfo[i - 1][sULCType] || 0));
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].endTime, oObjectInfo[i].endTime, oObjectInfo[i][sULCType] || 0));
					}
				} else {
					if (oObjectInfo[i].type == 1 || oObjectInfo[i].type == 2) {
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i - 1].endTime, oObjectInfo[i].startTime, oObjectInfo[i - 1][sULCType] || 0));
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].startTime, oObjectInfo[i].startTime, oObjectInfo[i - 1][sULCType] || 0));
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].endTime, oObjectInfo[i].endTime, oObjectInfo[i + 1][sULCType] || 0));
					} else {
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i - 1].endTime, oObjectInfo[i].endTime, oObjectInfo[i][sULCType] || 0));
					}
				}
			}
			aGroup = aGroup.concat(aULCNode);
		}
		aGroup[0].firstOne = true;
		aGroup[aGroup.length - 1].lastOne = true;
		return aGroup;

	};

	TRUCKULCDataMaker.prototype._addTooltipToULCOrder = function (oOrderRow, oValuesGroup, sDimension) {

		var aGroup = [];
		var oTooltip = {};
		var aTemp = [];
		var bHasTooltip = true;
		if (!oOrderRow.tooltip) {
			oOrderRow.tooltip = [];
			bHasTooltip = false;
		}
		for (var i = 0; i < oValuesGroup.length; i++) {
			if (oValuesGroup[i].from == oValuesGroup[i].to) {
				aTemp.push(oValuesGroup[i]);
			}
		}
		for (var i = 1; i < aTemp.length; i++) {
			oTooltip = this._clone(oTooltip);
			if (!bHasTooltip) {
				oTooltip = this._produceULCTooltipNode(aTemp[i - 1].from, aTemp[i].to);
			} else {
				oTooltip = oOrderRow.tooltip[i - 1];
			}
			if (aTemp[i].value == aTemp[i - 1].value) {
				oTooltip[sDimension] = {};
				oTooltip[sDimension].value = aTemp[i].value;
			} else {
				oTooltip[sDimension] = {};
				oTooltip[sDimension].previous = aTemp[i - 1].value;
				oTooltip[sDimension].next = aTemp[i].value;
			}
			aGroup.push(oTooltip);
			if (!bHasTooltip) {
				oOrderRow.tooltip.push(oTooltip);
			}
		}
		aGroup[0].firstOne = true;
		aGroup[aGroup.length - 1].lastOne = true;
		return aGroup;
	};

	TRUCKULCDataMaker.prototype._addTooltipToULC = function (oULCRow, oValuesGroup) {

		if (!oULCRow.tooltip) {
			oULCRow.tooltip = [];
			for (var i = 0; i < oValuesGroup.length; i++) {
				oULCRow.tooltip.push(this._clone(oValuesGroup[i]));
			}
		} else {
			for (var j = 0; j < oValuesGroup.length; j++) {
				oULCRow.tooltip[j] = this._clone(oValuesGroup[j]);
			}
		}

	};

	TRUCKULCDataMaker.prototype._produceDefaultULCValuesNode = function (sStartTime, sEndTime, sValue) {

		var oDefaultULCValuesNode = {};
		oDefaultULCValuesNode.from = sStartTime;
		oDefaultULCValuesNode.to = sEndTime;
		oDefaultULCValuesNode.value = parseFloat(sValue);
		return oDefaultULCValuesNode;

	};

	TRUCKULCDataMaker.prototype._produceULCTooltipNode = function (sFromTime, sToTime) {

		var oULCTooltipNode = {};
		oULCTooltipNode.from = sFromTime;
		oULCTooltipNode.to = sToTime;
		return oULCTooltipNode;

	};

	TRUCKULCDataMaker.prototype._searchParentByUUID = function (sUUID) {

		if (sUUID === "root") {
			return null;
		} else {
			return this._searchParentNode(this._data.root, null, sUUID);
		}

	};

	TRUCKULCDataMaker.prototype._searchParentNode = function (oNode, oParent, sUUID) {

		var node;
		if (oNode.uuid || oNode.type === "root") {
			if (oNode.uuid === sUUID) {
				return oParent;
			} else {
				for (var propertyName in oNode) {
					node = this._searchParentNode(oNode[propertyName], oNode, sUUID);
					if (node) {
						return node;
					}
				}
			}
		} else if (oNode instanceof Array) {
			for (var i = 0; i < oNode.length; i++) {
				node = this._searchParentNode(oNode[i], oParent, sUUID);
				if (node) {
					return node;
				}
			}
		} else {
			return null;
		}
	};

	return TRUCKULCDataMaker;
}, true);
