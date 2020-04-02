/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */

// Provides control sap.landvisz.OptionSource.
sap.ui.define([
	"sap/landvisz/library",
	"sap/ui/core/Control",
	"./OptionSourceRenderer"
], function(landviszLibrary, Control, OptionSourceRenderer) {
	"use strict";


	/**
	 * Constructor for a new OptionSource.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Options source for solution entities
	 * @extends sap.ui.core.Control
	 *
	 * @constructor
	 * @public
	 * @alias sap.landvisz.OptionSource
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var OptionSource = Control.extend("sap.landvisz.OptionSource", /** @lends sap.landvisz.OptionSource.prototype */ { metadata : {

		library : "sap.landvisz",
		properties : {

			/**
			 * source for option entity
			 */
			source : {type : "string", group : "Data", defaultValue : null}
		}
	}});

	OptionSource.prototype.init = function() {
		this.viewType;
	};

	return OptionSource;

 });
