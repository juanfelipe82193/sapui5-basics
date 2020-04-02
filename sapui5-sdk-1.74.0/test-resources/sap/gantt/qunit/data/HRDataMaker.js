sap.ui.define(["./DataMaker"], function (DataMaker) {
	"use strict";

	function HRDataMaker(sHierarchyId, oTimePattern, oInterval, oCalendarPattern, oUtil) {
		DataMaker.call(this, sHierarchyId, oTimePattern, oInterval, oCalendarPattern, oUtil);
	}
	HRDataMaker.prototype = new DataMaker();

	HRDataMaker.prototype.makeData = function () {

		this._createHierarchyResource({ id: "root", type: "root" });
		this.addRow("root", "root-ubc", {
			"text": "Handling R00",
			"location": "UIO",
			"id": "0000",
			"type": "05"
		});
		this.addRowNode("root-ubc", "root-ubc-children", "ubc", {});
		this.addRowNodeByGroup("root-ubc-children", "ubc-1", "ubc_tooltip", 10, 1, [{
			"start_date": "20160106012641",
			"supply": 9,
			"demand": 19,
			"end_date": "20160106050241"
		}, {
			"start_date": "20160106050241",
			"supply": 13,
			"demand": 7,
			"end_date": "20160106095041"
		}]);
		this.addRow("root", "root-ubc2", {
			"text": "Handling R01",
			"location": "UI1",
			"id": "0001",
			"type": "05"
		});
		this.addRowNode("root-ubc2", "root-ubc2-children", "ubc", {});
		this.addRowNodeByGroup("root-ubc2-children", "ubc-2", "ubc_tooltip", 20, 1, [{
			"start_date": "20160106012641",
			"supply": 2,
			"demand": 10,
			"end_date": "20160106050241"
		}, {
			"start_date": "20160106050241",
			"supply": 20,
			"demand": 7,
			"end_date": "20160106095041"
		}]);
		this.addRow("root", "root-ubc3", {
			"text": "Handling R03",
			"location": "UI3",
			"id": "0003",
			"type": "05"
		});
		this.addRowNode("root-ubc3", "root-ubc3-children", "ubc", {});
		this.addRowNodeByGroup("root-ubc3-children", "ubc-3", "ubc_tooltip", 29, 1, [{
			"start_date": "20160106012641",
			"supply": 9,
			"demand": 19,
			"end_date": "20160106050241"
		}, {
			"start_date": "20160106050241",
			"supply": 13,
			"demand": 7,
			"end_date": "20160106095041"
		}]);
		this.addRow("root", "root-ubc4", {
			"text": "Handling R04",
			"location": "UI4",
			"id": "0004",
			"type": "05"
		});
		this.addRowNode("root-ubc4", "root-ubc4-children", "ubc", {});
		this.addRowNodeByGroup("root-ubc4-children", "ubc-4", "ubc_tooltip", 23, 1, [{
			"start_date": "20160106012641",
			"supply": 9,
			"demand": 19,
			"end_date": "20160106050241"
		}, {
			"start_date": "20160106050241",
			"supply": 13,
			"demand": 7,
			"end_date": "20160106095041"
		}]);

		this.addRow("root", "root-ubc5", {
			"text": "Handling R05",
			"location": "UI5",
			"id": "0005",
			"type": "05"
		});
		this.addRowNode("root-ubc5", "root-ubc-children5", "ubc", {});
		this.addRowNodeByGroup("root-ubc-children5", "ubc-5", "ubc_tooltip", 10, 1, [{
			"start_date": "20160106012641",
			"supply": 9,
			"demand": 19,
			"end_date": "20160106050241"
		}, {
			"start_date": "20160106050241",
			"supply": 13,
			"demand": 7,
			"end_date": "20160106095041"
		}]);
		this.addRow("root", "root-ubc6", {
			"text": "Handling R06",
			"location": "UI6",
			"id": "0006",
			"type": "05"
		});
		this.addRowNode("root-ubc6", "root-ubc-children6", "ubc", {});
		this.addRowNodeByGroup("root-ubc-children6", "ubc-6", "ubc_tooltip", 10, 1, [{
			"start_date": "20160106012641",
			"supply": 9,
			"demand": 19,
			"end_date": "20160106050241"
		}, {
			"start_date": "20160106050241",
			"supply": 13,
			"demand": 7,
			"end_date": "20160106095041"
		}]);
		return this;

	};

	//if have oNodeInfo, loop oNodeInfo for group
	//if not, produce default data
	HRDataMaker.prototype.addRowNodeByGroup = function (sTargetRowUUID, sNodeInfoUUID, sType, nGroupNumber, nObjectPerGroup, oNodeInfo) {

		var oTargetRow = this._searchObjectByUUID(sTargetRowUUID);
		if (!oTargetRow[sType]) {
			oTargetRow[sType] = [];
		}
		switch (sType) {
			case "ubc_tooltip":
				var oTooltipGroup = this._produceBCGroup(sNodeInfoUUID, sType, nGroupNumber, nObjectPerGroup, oNodeInfo);
				oTargetRow[sType] = oTargetRow[sType].concat(oTooltipGroup);
				this._addCapacityNodeToBC(oTargetRow, oTooltipGroup);
				var oParent = this._searchParentByUUID(sTargetRowUUID);
				this.addRowNode(oParent.uuid || oParent.id, "ubc-overcapacity-" + sNodeInfoUUID, "ubc_overcapacity", {});
				this._genOverCapacity("ubc-overcapacity-" + sNodeInfoUUID, oTooltipGroup);
				var aActGreedy = this._genActGreedyOfBC(oTooltipGroup);
				this._addGreedy(oParent.uuid || oParent.id, "activity", aActGreedy);
				break;
			case "activity":
				var aAct = this._produceDefaultGroup(sNodeInfoUUID, sType, nGroupNumber, nObjectPerGroup, oNodeInfo);
				oTargetRow[sType] = oTargetRow[sType].concat(aAct);
				this._genDifferentTypeOfActivity(aAct);
				this._genDifferentUtilOfActivity(aAct);
				break;
			default:
				oTargetRow[sType] = oTargetRow[sType].concat(this._produceDefaultGroup(sNodeInfoUUID, sType, nGroupNumber, nObjectPerGroup, oNodeInfo));
				break;
		}
		return oTargetRow[sType];

	};

	HRDataMaker.prototype._produceBCGroup = function (sNodeInfoUUID, sType, nGroupNumber, nObjectPerGroup, oObjectInfo) {

		if (!oObjectInfo) {
			oObjectInfo = this._produceDefaultBCTooltipNode();
		}
		return this._genDataGroup(sNodeInfoUUID, oObjectInfo, nGroupNumber, nObjectPerGroup, sType);

	};

	//generate data group, use timepattern to determin how to get time
	//no interval between group
	HRDataMaker.prototype._genDataGroup = function (sNodeInfoUUID, oObjectInfo, nGroupNumber, nObjectPerGroup, sTimePattern) {

		var aGroup = [];
		var interval = 0;
		var oTempObject = {};
		var nLength = oObjectInfo.length || 0;
		for (var i = 0; i < nGroupNumber; i++) {
			for (var j = 0; j < nObjectPerGroup; j++) {
				if (i == 0 && j == 0) {
					if (jQuery.isArray(oObjectInfo)) {
						oTempObject = this._clone(oObjectInfo[0]);
					} else {
						oTempObject = this._clone(oObjectInfo);
					}
					oTempObject.uuid = sNodeInfoUUID + "-" + (i + j);
					this._adjustTime(oTempObject, sTimePattern);
					aGroup.push(oTempObject);
				} else {
					var oLastTime;
					if (jQuery.isArray(oObjectInfo) && oObjectInfo.length != 1) {
						if (nObjectPerGroup == 1) {
							oTempObject = this._clone(oObjectInfo[i % nLength]);
						} else {
							oTempObject = this._clone(oObjectInfo[(i * j + j) % nLength]);
						}
						this._adjustTime(oTempObject, sTimePattern);
						oLastTime = this._abapTsToDate(aGroup[aGroup.length - 1][this._timePattern[sTimePattern][1]]);
					} else if (jQuery.isArray(oObjectInfo) && oObjectInfo.length == 1) {
						oTempObject = this._clone(oObjectInfo[0]);
						this._adjustTime(oTempObject, sTimePattern);
						oLastTime = this._abapTsToDate(aGroup[aGroup.length - 1][this._timePattern[sTimePattern][1]]);
					} else {
						oTempObject = this._clone(oObjectInfo);
						this._adjustTime(oTempObject, sTimePattern);
						oLastTime = this._abapTsToDate(aGroup[aGroup.length - 1][this._timePattern[sTimePattern][1]]);
					}

					oTempObject.uuid = sNodeInfoUUID + "-" + (i + j);
					this._resetDateOfNode(oTempObject, interval, oLastTime, sTimePattern);
					aGroup.push(oTempObject);
				}
			}
		}
		return aGroup;

	};

	HRDataMaker.prototype._addCapacityNodeToBC = function (oParentRow, oTooltipGroup) {

		if (!oParentRow["ubc_capacity"]) {
			oParentRow["ubc_capacity"] = {};
		}
		oParentRow["ubc_capacity"].id = "capacity-" + oParentRow.uuid;
		oParentRow["ubc_capacity"].period = [];
		for (var i = 0; i < oTooltipGroup.length; i++) {
			var oTemp = {};
			oTemp["start_date"] = oTooltipGroup[i].start_date;
			oTemp.supply = oTooltipGroup[i].supply;
			oTemp.demand = oTooltipGroup[i].demand;
			oParentRow["ubc_capacity"].period.push(oTemp);
		}

	};

	//if overcapacity, add to overcapacity
	HRDataMaker.prototype._genOverCapacity = function (sTargetRow, oTooltipGroup) {

		var oTargetRow = this._searchObjectByUUID(sTargetRow);
		var aGroup = [];
		if (jQuery.isArray(oTooltipGroup)) {
			for (var i = 0; i < oTooltipGroup.length; i++) {
				if (oTooltipGroup[i].supply < oTooltipGroup[i].demand) {
					var oClone = this._clone(oTooltipGroup[i]);
					oClone.uuid = "overcapacity-" + oClone.uuid;
					aGroup.push(oClone);
				}
			}
		}
		if (!oTargetRow["ubc_overcapacity"]) {
			oTargetRow["ubc_overcapacity"] = [];
		}
		oTargetRow["ubc_overcapacity"] = oTargetRow["ubc_overcapacity"].concat(aGroup);

	};

	//generate activity_greedy of ubc
	HRDataMaker.prototype._genActGreedyOfBC = function (oTooltipGroup) {

		var aGroup = [];
		if (jQuery.isArray(oTooltipGroup)) {
			for (var i = 0; i < oTooltipGroup.length; i++) {
				var handlingResource = "Handling R0" + oTooltipGroup.length % 4;
				var handlingConsumption = oTooltipGroup[i].demand;
				var type = i % 2 + 1;
				var startTime = oTooltipGroup[i].start_date;
				var endTime = oTooltipGroup[i].end_date;
				var status = i % 3;
				var rowIndex = i % 3;
				var oActivity = {
					"type": type,
					"status": status,
					"startTime": startTime,
					"endTime": endTime,
					"handling_resource": handlingResource,
					"handling_comsumption": handlingConsumption,
					"rowIndex": rowIndex
				};
				aGroup.push(oActivity);
			}
		}
		return aGroup;

	};

	//add greedy to overlap
	HRDataMaker.prototype._addGreedy = function (sTargetRowUUID, sType, aGreedy) {
		if (jQuery.isArray(aGreedy)) {
			for (var i = 0; i < aGreedy.length; i++) {
				aGreedy[i].tooltip = "overlap_activity_" + i;
				this.addRowNode(sTargetRowUUID, "overlap-" + sType + "-greedy" + i, sType + "_greedy", aGreedy[i]);
			}
		}
	};

	HRDataMaker.prototype._searchParentByUUID = function (sUUID) {

		if (sUUID === "root") {
			return null;
		} else {
			return this._searchParentNode(this._data.root, null, sUUID);
		}

	};

	HRDataMaker.prototype._searchParentNode = function (oNode, oParent, sUUID) {

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

	return HRDataMaker;
}, true);
