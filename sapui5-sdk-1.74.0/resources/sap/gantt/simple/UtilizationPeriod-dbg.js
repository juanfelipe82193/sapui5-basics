/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Element"], function(Element){
	"use strict";

	/**
	 * Constructor for a new <code>UtilizationPeriod</code>
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * <p>
	 * UtilizationPeriod is used by <code>sap.gantt.simple.UtilizationLineChart</code> and <code>sap.gantt.simple.UtilizationBarChart</code>
	 * It represents a time period that a specific resource utilization usages
	 * </p>
	 *
	 * <p> UtilizationPeriod is either defined as a direct aggregation of UtilizationBarChart, or an aggregation of <code>sap.gantt.simple.UtilizationDimension</code>
	 *
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.UtilizationPeriod
	 */
	var UtilizationPeriod = Element.extend("sap.gantt.simple.UtilizationPeriod", {
		metadata: {
			properties: {

				/**
				 * from date time of period
				 */
				from: {type: "object"},

				/**
				 * to date time of period
				 */
				to: {type: "object"},

				/**
				 * The value of the actual consumption capacity.  It's only relevant for UtilizationLineChart
				 */
				value: {type: "float",  group: "Data", defaultValue: 0 },

				/**
				 * The resource supply capacity, it's only used for UtilizationBarChart
				 */
				supply:  { type: "float", group: "Data", defaultValue: 0 },

				/**
				 * The required/demand capacity, it's only used for used for UtilizationBarChart
				 */
				demand:  { type: "float", group: "Data", defaultValue: 0 }
			}
		}
	});

	return UtilizationPeriod;

}, /**bExport*/true);
