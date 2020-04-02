/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */

// Provides control sap.landvisz.Option.
sap.ui.define([
	"sap/landvisz/library",
	"sap/ui/core/Control",
	"./OptionRenderer"
], function(landviszLibrary, Control, OptionRenderer) {
	"use strict";


	/**
	 * Constructor for a new Option.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Options for solution entities
	 * @extends sap.ui.core.Control
	 *
	 * @constructor
	 * @public
	 * @alias sap.landvisz.Option
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Option = Control.extend("sap.landvisz.Option", /** @lends sap.landvisz.Option.prototype */ { metadata : {

		library : "sap.landvisz",
		properties : {

			/**
			 * type of main entity which has a replacement
			 */
			type : {type : "string", group : "Identification", defaultValue : null},

			/**
			 * Entity on which options are applicable
			 */
			currentEntity : {type : "string", group : "Data", defaultValue : null}
		},
		aggregations : {

			/**
			 * Entity to be rendered as options
			 */
			optionEntities : {type : "sap.landvisz.OptionEntity", multiple : true, singularName : "optionEntity"}
		}
	}});

	Option.prototype.init = function() {
		this.viewType;
	};

	return Option;

});
