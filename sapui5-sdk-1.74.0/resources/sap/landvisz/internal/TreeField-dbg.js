/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */

// Provides control TreeField.
sap.ui.define([
	"sap/landvisz/library",
	"sap/ui/core/Control",
	"sap/ui/commons/Tree",
	"sap/ui/commons/TreeNode",
	"sap/ui/model/json/JSONModel",
	"./TreeFieldRenderer"
], function(landviszLibrary, Control, Tree, TreeNode, JSONModel, TreeFieldRenderer) {
	"use strict";


	/**
	 * Constructor for a new internal/TreeField.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A control to render tree field in the control
	 * @extends sap.ui.core.Control
	 *
	 * @constructor
	 * @public
	 * @alias sap.landvisz.internal.TreeField
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var TreeField = Control.extend("sap.landvisz.internal.TreeField", /** @lends TreeField.prototype */ { metadata : {

		library : "sap.landvisz",
		properties : {

			/**
			 * treeModel to be rendered in the control
			 */
			treeModel : {type : "object", group : "Data", defaultValue : null},

			/**
			 * binding name
			 */
			bindingName : {type : "string", group : "Data", defaultValue : null},

			/**
			 * rendering size of the control
			 */
			renderingSize : {type : "sap.landvisz.EntityCSSSize", group : "Dimension", defaultValue : null}
		},
		aggregations : {

			/**
			 * aggregation on the tree field to render tree nodes
			 */
			treeNode : {type : "sap.ui.commons.TreeNode", multiple : true, singularName : "treeNode"}
		}
	}});

	TreeField.prototype.init = function(){
		this.initializationDone = false;
	};

	TreeField.prototype.exit = function() {

		this.tree && this.tree.destroy();
		this.oTreeNodeTemplate && this.oTreeNodeTemplate.destroy();
		this.jsonModel && this.jsonModel.destroy();
	};

	TreeField.prototype.initControls = function() {

		var oNavigationAreaID = this.getId();
		if(!this.tree)
		this.tree = new Tree(oNavigationAreaID+"CLVTree");
			if(!this.jsonModel)
		this.jsonModel = new JSONModel();
			if(!this.oTreeNodeTemplate)
		this.oTreeNodeTemplate = new TreeNode(oNavigationAreaID+"CLVTreeNode");

	};

	return TreeField;

});
