/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define("sap.gantt2.simple.PerfSetting", [
	"sap/ui/base/ManagedObject", 'sap/ui/core/format/DateFormat'
], function (ManagedObject, DateFormat) {
	"use strict";

	var iOneDayDuration = 24 * 60 * 60 * 1000; // one day

	var PerfSetting = ManagedObject.extend("sap.gantt2.simple.PerfSetting", {
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
				showWarning: { type: 'boolean', defaultValue: false },

				/**
				 * Show text.
				 */
				showText: { type: 'boolean', defaultValue: false }

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

		var oCompleteData = {};

		var iLength = this.getNumberOfView();
		if (this.getIncludeToolbar()) {
			// more than one gantt chart instance is needed
			oCompleteData = {
				view: [],
				Calendars: aCalendars
			};
			for (var iIndex = 0; iIndex < iLength; iIndex++) {
				oCompleteData.view.push({
						root: {
							ObjectID: "root",
							type: "root",
							children: oRowData
						},
						Calendars: aCalendars
				});
			}
		} else {
			oCompleteData = {
					"root": {
						"ObjectID": "root",
						"type": "root",
						"children": oRowData
					},
					"Calendars": aCalendars
			};
		}

		return oCompleteData;
	};

	PerfSetting.prototype._createShapesData = function(sPrefix) {
		var iTotal = this.getNumberOfShape();
		var aTasks = [];
		var oDate = new Date();

		for (var iIndex = 0; iIndex < iTotal; iIndex++) {
			oDate.setDate(oDate.getDate() + 1);
			var sStartTime = new Date(oDate);

			var oEndDate = new Date(oDate.getTime() + iOneDayDuration);
			var sEndTime = oEndDate;

			aTasks.push({
				TaskID: sPrefix + "_" + iIndex ,
				StartDate : sStartTime,
				EndDate: sEndTime,
				tooltip: 'Task from ' + sStartTime + ' to ' + sEndTime,
				'start_loc_id': 'WDF',
				'end_loc_id': 'BERLIN',
				description: 'Text'
			});
			oDate.setDate(oDate.getDate() + 1);
			// oDate.setDate(oEndDate.getDate());
		}

		return aTasks;
	};

	PerfSetting.prototype._createCalendarData = function() {
		var iTotal = this.getNumberOfShape();
		var aCalendars = [];
		var oDate = new Date();

		for (var iIndex = 0; iIndex < iTotal; iIndex++) {
			var oTime = new Date(oDate.setDate(oDate.getDate() + 2));
			aCalendars.push({
				StartDate : new Date(oTime.setDate(oTime.getDate() + 0)),
				EndDate: new Date(oTime.setDate(oTime.getDate() + 1))
			});
		}
		return [{
			CalendarInterval: aCalendars
		}];
	};

	PerfSetting.prototype._createWarnings = function() {
		var iTotal = this.getNumberOfShape();
		var aWarnings = [];
		var oDate = new Date();
		for (var iIndex = 0; iIndex < iTotal; iIndex++) {
			aWarnings.push({
				src: "sap-icon://warning2",
				time: new Date(oDate.setDate(oDate.getDate() + 2))
			});
		}
		return aWarnings;
	};

	PerfSetting.prototype._createTexts = function(sPrefix) {
		var iTotal = this.getNumberOfShape();
		var aTexts = [];
		var oDate = new Date();

		for (var iIndex = 0; iIndex < iTotal; iIndex++) {
			oDate.setDate(oDate.getDate() + 1);
			var sStartTime = new Date(oDate);

			var oEndDate = new Date(oDate.getTime() + iOneDayDuration);
			var sEndTime = oEndDate;

			aTexts.push({
				TextID: sPrefix + "_" + iIndex ,
				StartDate : sStartTime,
				EndDate: sEndTime,
				'start_loc_id': 'WDF',
				'end_loc_id': 'BERLIN',
				Content: 'Perf testing',
				description: 'Text'
			});
			oDate.setDate(oDate.getDate() + 1);
		}

		return aTexts;
	};

	PerfSetting.prototype._createRelationship = function(sPrefix) {
		// var iTotalRow = this.getNumberOfRow();
		var aRelationship = [];
		var sRelPrefix = sPrefix || 'R';
		var iIndex = 0;
		// for (var iIndex = 0; iIndex < iTotalRow; iIndex++) {
			aRelationship.push({
				"PredecTaskID": sRelPrefix + "_" + iIndex,
				"SuccTaskID": sRelPrefix + "_" + (iIndex + 1),
				"RelationType": "FinishToStart",
				"style": 0,
				"stroke": "#000000",
				"tooltip": "Finish-to-Start",
				"RelationID": sRelPrefix + "rls" + "_" + iIndex,
				"ObjectID": sRelPrefix + "rls" + "_" + iIndex + "-1"
			});

			aRelationship.push({
				"PredecTaskID": sRelPrefix + "_" + iIndex,
				"SuccTaskID": sRelPrefix + "_" + (iIndex + 1),
				"RelationType": "FinishToStart",
				"style": 0,
				"stroke": "#000000",
				"tooltip": "Finish-to-Start",
				"RelationID": sRelPrefix + "rls" + "_" + iIndex,
				"ObjectID": sRelPrefix + "rls" + "_" + iIndex + "-2"
			});


		// }
		return aRelationship;
	};


	PerfSetting.prototype._generateRowData = function(iLevel, aChildren, sPrefix) {
		var iTotalRow = this.getNumberOfRow();
		sPrefix = sPrefix || 'R';


		for (var iIndex = 0; iIndex < iTotalRow; iIndex++) {

			var aTasks = this._createShapesData(sPrefix + "_task_" + iIndex);
			var aTexts = this._createTexts(sPrefix + "_text_" + iIndex);
			var aWarnings = [];
			if (this.getShowWarning()) {
				aWarnings = this._createWarnings(sPrefix + "_task_" + iIndex);
			}

			var oRowData = {
				"status": 1,
				"start_loc_id": "WDF",
				"end_loc_id": "BERLIN",
				"ObjectID": sPrefix + "_" + iIndex,
				"uuid": sPrefix + "_" + iIndex,
				"Tasks": aTasks,
				"Texts": aTexts,
				"Warnings": aWarnings,
				"children": []
			};

			if (this.getShowRelationship()) {
				var aRelationship = this._createRelationship(sPrefix + "_task_" + iIndex);
				oRowData.Relationships = aRelationship;
			}

			aChildren.push(oRowData);


			if (iLevel < this.getLevelOfHierarchy()) {
				this._generateRowData(iLevel + 1, aChildren[iIndex].children, sPrefix + '_' + iIndex);
			}

		}
		return aChildren;
	};

	return PerfSetting;
}, true);
