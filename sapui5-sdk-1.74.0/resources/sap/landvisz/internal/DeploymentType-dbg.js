/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */

// Provides control DeploymentType.
sap.ui.define([
	"sap/landvisz/library",
	"sap/ui/core/Control",
	"sap/ui/commons/Image",
	"./DeploymentTypeRenderer"
], function(landviszLibrary, Control, Image, DeploymentTypeRenderer) {
	"use strict";


	/**
	 * Constructor for a new internal/DeploymentType.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A control to render deployment type of a component
	 * @extends sap.ui.core.Control
	 *
	 * @constructor
	 * @public
	 * @alias sap.landvisz.internal.DeploymentType
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var DeploymentType = Control.extend("sap.landvisz.internal.DeploymentType", /** @lends sap.landvisz.internal.DeploymentType.prototype */ { metadata : {

		library : "sap.landvisz",
		properties : {

			/**
			 * icon type of data
			 */
			type : {type : "string", group : "Data", defaultValue : null}
		}
	}});

	DeploymentType.prototype.init = function() {
		this.left = 0;
		this.top = 0;
		this.initializationDone = false;
		this.entityId = "";
		this.count = 0;
		this.type ="";
		this.standardWidth = 0;
		this.srcEntityId ="";
	};

	DeploymentType.prototype.initControls = function() {

		var controlID = this.getId();
		this.iconType && this.iconType.destroy();
		this.iconType = new Image(controlID + "-solutionCategoryImg");
		this.iconLeft && this.iconLeft.destroy();
		this.iconLeft = new Image(controlID + "-solutionCategoryLeftImg");
		this.iconRight && this.iconRight.destroy();
		this.iconRight = new Image(controlID + "-solutionCategoryRightImg");
	};

	return DeploymentType;

});
