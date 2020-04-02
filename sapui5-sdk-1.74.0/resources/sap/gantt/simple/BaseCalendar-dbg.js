/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/gantt/simple/BaseRectangle"
], function (BaseRectangle) {
	"use strict";

	/**
	 * Creates a Calendar shape which consumes pattern from Calendar in the 'def' package.
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * BaseCalendar shape.
	 *
	 * <p>
	 * The Calendar shape must be used in combination with Calendar def class {@link sap.gantt.def.cal.Calendar} which draws the SVG 'defs' tag.
	 * </p>
	 *
	 * @extends sap.gantt.simple.BaseRectangle
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.BaseCalendar
	 */
	var BaseCalendar = BaseRectangle.extend("sap.gantt.simple.BaseCalendar", /** @lends sap.gantt.simple.BaseCalendar.prototype */ {
		metadata: {
			properties: {
				calendarName: {type: "string"}
			}
		}
	});

	BaseCalendar.prototype.applySettings = function(mSettings, oScope) {
		mSettings = mSettings || {};
		mSettings.height = mSettings.height || "inherit";
		BaseRectangle.prototype.applySettings.call(this, mSettings, oScope);
	};

	/**
	 * Gets current value of property <code>x</code>.
	 *
	 * @return {number} Value of property <code>x</code>.
	 * @public
	 */
	BaseCalendar.prototype.getX = function () {
		return 0;
	};

	/**
	 * Calendar is not a selectable shape. getSelectable always returns false
	 *
	 * @public
	 * @returns {boolean} false calendar is NOT selectable
	 */
	BaseCalendar.prototype.getSelectable = function () {
		return false;
	};

	/**
	 * Calendar is rendering cross the entire gantt visible area
	 * @public
	 * @returns {float} width of the calendar shape
	 */
	BaseCalendar.prototype.getWidth = function () {
		return this.getGanttChartBase().iGanttRenderedWidth;
	};

	/**
	 * Gets current value of property <code>fill</code>.
	 *
	 * We recommend that you do not configure or code against this property. Calendar is treated as a bulk shape filled with pattern occupying the visible area.
	 * Your application must implement their own shape if a selectable calendar is expected.
	 *
	 * @return {string} Value of property <code>fill</code>.
	 * @public
	 */
	BaseCalendar.prototype.getFill = function () {
		var sCalendarName = this.getCalendarName();
		var oPaintServerDef = this.getGanttChartBase().getCalendarDef();
		if (oPaintServerDef) {
			return oPaintServerDef.getRefString(sCalendarName);
		} else {
			return this.getProperty("fill");
		}
	};

	BaseCalendar.prototype.isVisible = function() { return true; };

	return BaseCalendar;
}, true);
