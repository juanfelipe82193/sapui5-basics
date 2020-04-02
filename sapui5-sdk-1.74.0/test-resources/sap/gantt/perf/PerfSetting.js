/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/base/ManagedObject", 'sap/ui/core/format/DateFormat'
], function (ManagedObject, DateFormat) {
	"use strict";

	var iOneDayDuration = 24 * 60 * 60 * 1000; // one day

	var PerfSetting = ManagedObject.extend("sap.gantt.perf.PerfSetting", {
		constructor: function(sId, mSettings) {
			ManagedObject.apply(this, arguments);
		},
		metadata: {
			library: "sap.gantt",
			properties: {
				/**
				 * Number of Row Data
				 */
				numberOfRow: { type: 'int', defaultValue: 1 },

				/**
				 * Number of Shapes per row
				 */
				numberOfShape: { type: 'int', defaultValue: 1 },

				/**
				 * Number of Data set
				 */
				numberOfView: { type: 'int', defaultValue: 1 },

				/**
				 * includeToolbar.
				 */
				includeToolbar: { type: 'boolean', defaultValue: false },

				/**
				 * Level of Hierarchy
				 */
				levelOfHierarchy: { type: 'int', defaultValue: 1 },

				/**
				 * Show Calendar.
				 */
				showCalendar: { type: 'boolean', defaultValue: true },

				/**
				 * Relationship.
				 */
				showRelationship: { type: 'boolean', defaultValue: false },

				/**
				 * Show warning.
				 */
				showWarning: { type: 'boolean', defaultValue: false }

			}
		}
	});

	PerfSetting.prototype.init = function() {
		this.oDateFormat = DateFormat.getDateInstance({pattern: 'yyyyMMdd000000'});
	};

	PerfSetting.prototype.getTimeHorizon = function() {
		var oStartTime = new Date();
		var oEndTime = new Date();
		oEndTime.setDate(oStartTime.getDate() + this.getNumberOfShape() * 2 + 1);
		return {
			startTime: this.oDateFormat.format(oStartTime),
			endTime: this.oDateFormat.format(oEndTime)
		};
	};

	PerfSetting.prototype.generate = function() {

		var iStartLevel = 1,
			oChildren = [],
			sPrefix = 'R';

		var oRowData = this._generateRowData(iStartLevel, oChildren, sPrefix);

		var aCalendars = [];
		if (this.getShowCalendar()) {
			aCalendars = this._createCalendarData();
		}

		var aRelationship = [];
		if (this.getShowRelationship()) {
			aRelationship = this._createRelationship(iStartLevel, aRelationship, sPrefix);
		}

		var oCompleteData = {};

		var iLength = this.getNumberOfView();
		if (this.getIncludeToolbar()) {
			// more than one gantt chart instance is needed
			oCompleteData = {
				containerLayoutKey: "d3",
				view: [],
				toolbarScheme :
					[
						{
							type: "1",
							text: "Custome Button"
						}
					],
				calendar: aCalendars
			};
			for (var iIndex = 0; iIndex < iLength; iIndex++) {
				oCompleteData.view.push({
						hierarchyKey: "TOL",
						root: {
							id: "root",
							type: "root",
							children: oRowData,
							relationships: aRelationship
						},
						toolbarScheme :[
								{
									type: "1",
									text: "Order 1"
								}
						],
						calendar: aCalendars
				});
			}
		} else {
			oCompleteData = {
					"hierarchyKey": "TOL",
					"root": {
						"id": "root",
						"type": "root",
						"children": oRowData,
						"relationships": aRelationship
					},
					"toolbarScheme" :[
							{
								"type": "1",
								"text": "Order 1"
							}
					],
					"calendar": aCalendars
			};
		}

		return oCompleteData;
	};

	PerfSetting.prototype._createShapesData = function() {
		var iTotal = this.getNumberOfShape();
		var aActivities = [];
		var oDate = new Date();

		for (var iIndex = 0; iIndex < iTotal; iIndex++) {
			oDate.setDate(oDate.getDate() + 1);
			var sStartTime = this.oDateFormat.format(oDate);

			var oEndDate = new Date(oDate.getTime() + iOneDayDuration);
			var sEndTime = this.oDateFormat.format(oEndDate);

			aActivities.push({
				id: jQuery.sap.uid(),
				startTime : sStartTime,
				endTime: sEndTime,
				status: 2, //Math.floor(Math.random() * 3), // random from [0, 2]
				type: "03", //Math.floor(Math.random() * 6), // random from [0, 5]
				tooltip: 'Activity from ' + sStartTime + ' to ' + sEndTime,
				'start_loc_id': 'WDF',
				'end_loc_id': 'BERLIN',
				description: 'Text'
			});
			oDate = oEndDate;
		}

		return aActivities;
	};

	PerfSetting.prototype._createCalendarData = function() {
		var iTotal = this.getNumberOfShape();
		var aCalendars = [];
		var oDate = new Date();

		for (var iIndex = 0; iIndex < iTotal; iIndex++) {
			var sStartTime = this.oDateFormat.format(oDate);

			var oEndDate = new Date(oDate.getTime() + iOneDayDuration);
			// duration 1 day
			var sEndTime = this.oDateFormat.format(oEndDate);

			aCalendars.push({
				startTime : sStartTime,
				endTime: sEndTime
			});
			oEndDate.setDate(oEndDate.getDate() + 1);
			oDate = oEndDate;
		}
		return [{
			id: 'dayInEveryTwoDays',
			data: aCalendars
		}];
	};

	PerfSetting.prototype._createWarnings = function() {
		var iTotal = this.getNumberOfShape();
		var aWarnings = [];
		var oDate = new Date();
		for (var iIndex = 0; iIndex < iTotal; iIndex++) {
			oDate.setDate(oDate.getDate() + 2);
			var sStartTime = this.oDateFormat.format(oDate);

			aWarnings.push({
				iconName : 'warning',
				time: sStartTime
			});
		}
		return aWarnings;
	};

	PerfSetting.prototype._createRelationship = function(iLevel, aRelationship, sPrefix) {
		var iTotalRow = this.getNumberOfRow();
		var sRelPrefix = sPrefix || 'R';
		for (var iIndex = 0; iIndex < iTotalRow; iIndex++) {
			aRelationship.push({
				"fromDataId": sRelPrefix + "_" + iIndex,
				"fromObjectPath": sRelPrefix + "_" + iIndex,
				"toDataId": sRelPrefix + "_" + (iIndex + 1),
				"toObjectPath": sRelPrefix + "_" + (iIndex + 1),
				"relation_type": 0,
				"fromShapeId": "ActivityKey",
				"toShapeId": "ActivityKey",
				"style": 0,
				"stroke": "#000000",
				"tooltip": "Finish-to-Start",
				"id": "rls" + "_" + iIndex
			});
			if (iLevel < this.getLevelOfHierarchy()) {
				this._createRelationship(iLevel + 1, aRelationship, sRelPrefix + '_' + iIndex);
			}
		}
		return aRelationship;
	};


	PerfSetting.prototype._generateRowData = function(iLevel, aChildren, sPrefix) {
		var iTotalRow = this.getNumberOfRow();
		var sOrderPrefix = sPrefix || 'R';


		for (var iIndex = 0; iIndex < iTotalRow; iIndex++) {

			var aActivities = this._createShapesData();

			var aWarnings = [];
			if (this.getShowWarning()) {
				aWarnings = this._createWarnings();
			}

			aChildren.push({
				"status": 1,
				"start_loc_id": "WDF",
				"end_loc_id": "BERLIN",
				"id": sOrderPrefix + "_" + iIndex,
				"type": "TOL",
				"uuid": sOrderPrefix + "_" + iIndex,
				"style": "critical",
				"order": [{
					"id": "OREDER" + sOrderPrefix + "_" + iIndex,
					"description": "order description",
					"status": 2,
					"type": "TOL",
					"uuid": "000" + "_" + iIndex,
					"startTime": "20150919000000",
					"endTime": "20151012000000",
					"selected": false
				}],
				"selected": false,
				"activity": aActivities,
				"nwt": [{"id": "dayInEveryTwoDays"}],
				"mode": "01,02,03",
				"warning": aWarnings,
				"children": []
			});

			if (iLevel < this.getLevelOfHierarchy()) {
				this._generateRowData(iLevel + 1, aChildren[iIndex].children, sOrderPrefix + '_' + iIndex);
			}

		}
		return aChildren;
	};

	return PerfSetting;
}, true);
