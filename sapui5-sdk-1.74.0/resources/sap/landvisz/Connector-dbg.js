/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */

// Provides control sap.landvisz.Connector.
sap.ui.define([
	"sap/landvisz/library",
	"sap/ui/core/Control",
	"./ConnectorRenderer"
], function(landviszLibrary, Control, ConnectorRenderer) {
	"use strict";


	/**
	 * Constructor for a new Connector.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Connector of the entities
	 * @extends sap.ui.core.Control
	 *
	 * @constructor
	 * @public
	 * @alias sap.landvisz.Connector
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Connector = Control.extend("sap.landvisz.Connector", /** @lends sap.landvisz.Connector.prototype */ { metadata : {

		library : "sap.landvisz",
		properties : {

			/**
			 * source of a connection to be drawn
			 */
			source : {type : "string", group : "Data", defaultValue : null},

			/**
			 * destination of the connection
			 */
			target : {type : "string", group : "Data", defaultValue : null}
		}
	}});

	Connector.prototype.init = function() {
		this.viewType;
	};

	return Connector;

});
