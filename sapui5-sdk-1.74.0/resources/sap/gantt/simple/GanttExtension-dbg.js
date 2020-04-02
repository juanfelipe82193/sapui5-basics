/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

// Provides helper sap.gantt.simple.GanttExtension.
sap.ui.define([ "sap/ui/base/Object" ],function(BaseObject) {
		"use strict";

		/**
		 * Base class of extensions for sap.gantt.simple gantt charts.
		 * <b>This is an internal class that is only intended to be used inside the sap.ui.table library! Any usage outside the sap.ui.table library is
		 * strictly prohibited!</b>
		 *
		 * @class Base class of extensions for sap.gantt.simple gantts.
		 * @abstract
		 * @extends sap.ui.base.Object
		 * @author SAP SE
		 * @version 1.74.0
		 * @constructor
		 * @private
		 * @alias sap.gantt.simple.GanttExtension
		 */
		var GanttExtension = BaseObject.extend("sap.gantt.simple.GanttExtension", /** @lends sap.gantt.simple.GanttExtension.prototype */ {
			/**
			 * Instance of the table this extension is applied to.
			 *
			 * @type {sap.gantt.simple.GanttChartWithTable}
			 * @protected
			 */
			_gantt: null,

			/**
			 * The settings this extension instance has been initialized with.
			 *
			 * @type {Object}
			 * @protected
			 */
			_settings: null,

			constructor: function(oGantt, mSettings) {
				BaseObject.call(this);

				this._gantt = oGantt;
				this._settings = mSettings || {};

				var sExtensionName = this._init(this._gantt, this._settings);

				// Attach a getter to the table to get the instance of this extension.
				if (sExtensionName) {
					var that = this;
					oGantt["_get" + sExtensionName] = function() { return that; };
				}
			},

			/**
			 * @override
			 * @inheritDoc
			 */
			destroy: function() {
				this._detachEvents();
				this._gantt = null;
				BaseObject.prototype.destroy.apply(this, arguments);
			},

			/*
			 * @override
			 * @inheritDoc
			 */
			getInterface: function() { return this; }
		});

		/**
		 * Return the gantt instances associated with the current extension
		 *
		 * @returns {sap.gantt.simple.GanttChartWithTable} Gantt chart instance
		 */
		GanttExtension.prototype.getGantt = function() {
			return this._gantt;
		};

		/**
		 * DOM elements shared by all extensions in Gantt
		 *
		 * @returns {object} object has gantt header and body DOM elements
		 */
		GanttExtension.prototype.getDomRefs = function() {
			var fnById = function(sSurfix){
				return jQuery.sap.domById( this.getGantt().getId() + sSurfix );
			}.bind(this);

			var oHeaderSvg = fnById("-header-svg"),
				oHeader = null;
			if (oHeaderSvg) {
				oHeader = oHeaderSvg.parentNode;
			}

			return {
				gantt: fnById("-gantt"),
				ganttSvg: fnById("-svg"),
				header: oHeader,
				headerSvg: oHeaderSvg
			};
		};

		/**
		 * Initialize the extension.
		 *
		 * @param {sap.gantt.simple.GanttChartWithTable} oGantt Instance of the gantt.
		 * @param {Object} [mSettings] Additional settings.
		 * @returns {string|null} Derived classes should return the name of the extension.
		 * @abstract
		 * @protected
		 */
		GanttExtension.prototype._init = function(oGantt, mSettings) { return null; };

		/**
		 * Hook which allows the extension to attach for additional native event listeners after the rendering of the table control.
		 *
		 * @abstract
		 * @see sap.gantt.simple.GanttChartWithTable#_attachEvents
		 * @protected
		 */
		GanttExtension.prototype._attachEvents = function() {};

		/**
		 * Hook which allows the extension to detach previously attached native event listeners.
		 *
		 * @abstract
		 * @see sap.gantt.simple.GanttChartWithTable#_detachEvents
		 * @protected
		 */
		GanttExtension.prototype._detachEvents = function() {};

		/**
		 * Informs all registered extensions of the table to attach their native event listeners.
		 *
		 * @param {sap.gantt.simple.GanttChartWithTable} oGantt Instance of the gantt.
		 * @see sap.gantt.GanttExtension#_attachEvents
		 * @public
		 * @static
		 */
		GanttExtension.attachEvents = function(oGantt) {
			if (!oGantt._aExtensions) {
				return;
			}

			for (var i = 0; i < oGantt._aExtensions.length; i++) {
				oGantt._aExtensions[i]._attachEvents();
			}
		};

		/**
		 * Informs all registered extensions of the given table to detach their previously attached native event listeners.
		 *
		 * @param {sap.gantt.simple.GanttChartWithTable} oGantt Instance of the gantt.
		 * @see sap.gantt.GanttExtension#_detachEvents
		 * @public
		 * @static
		 */
		GanttExtension.detachEvents = function(oGantt) {
			if (!oGantt._aExtensions) {
				return;
			}
			for (var i = 0; i < oGantt._aExtensions.length; i++) {
				oGantt._aExtensions[i]._detachEvents();
			}
		};

		/**
		 * Initializes an extension and attaches it to the given Table control.
		 *
		 * @param {sap.gantt.simple.GanttChartWithTable} oGantt Instance of the table.
		 * @param {sap.gantt.GanttExtension} ExtensionClass The class of the extension to instantiate.
		 * @param {Object} mSettings Additional settings used during initialization of the extension.
		 * @returns {sap.gantt.GanttExtension} Returns the created extension instance.
		 * @public
		 * @static
		 */
		GanttExtension.enrich = function(oGantt, ExtensionClass, mSettings) {
			if (!ExtensionClass || !(ExtensionClass.prototype instanceof GanttExtension)) {
				return null;
			}

			var oExtension = new ExtensionClass(oGantt, mSettings);
			if (!oGantt._aExtensions) {
				oGantt._aExtensions = [];
			}
			oGantt._aExtensions.push(oExtension);
			return oExtension;
		};

		/**
		 * Detaches and destroy all registered extensions of the table.
		 *
		 * @param {sap.gantt.simple.GanttChartWithTable} oGantt Instance of the Gantt Chart.
		 * @public
		 * @static
		 */
		GanttExtension.cleanup = function(oGantt) {
			if (!oGantt._bExtensionsInitialized || !oGantt._aExtensions) {
				return;
			}
			for (var i = 0; i < oGantt._aExtensions.length; i++) {
				oGantt._aExtensions[i].destroy();
			}
			delete oGantt._aExtensions;
			delete oGantt._bExtensionsInitialized;
		};

		return GanttExtension;
	});
