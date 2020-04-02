/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */

// Provides control sap.landvisz.OptionEntity.
sap.ui.define([
	"sap/landvisz/library",
	"sap/landvisz/OptionSource",
	"sap/ui/commons/RadioButton",
	"sap/ui/commons/TextView",
	"./OptionEntityRenderer"
], function(landviszLibrary, OptionSource, RadioButton, TextView, OptionEntityRenderer) {
	"use strict";


	/**
	 * Constructor for a new OptionEntity.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Options for solution entities
	 * @extends sap.landvisz.OptionSource
	 *
	 * @constructor
	 * @public
	 * @alias sap.landvisz.OptionEntity
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var OptionEntity = OptionSource.extend("sap.landvisz.OptionEntity", /** @lends sap.landvisz.OptionEntity.prototype */ { metadata : {

		library : "sap.landvisz",
		properties : {

			/**
			 * label for option entity
			 */
			label : {type : "string", group : "Data", defaultValue : null},

			/**
			 * determines current selected option
			 */
			selected : {type : "boolean", group : "Accessibility", defaultValue : false},

			/**
			 * enabling/disabling options
			 */
			enable : {type : "boolean", group : "Identification", defaultValue : true},

			/**
			 * tooltip for options
			 */
			optionTextTooltip : {type : "string", group : "Data", defaultValue : null}
		},
		aggregations : {

			/**
			 * Option Renderer Control
			 */
			optionSources : {type : "sap.landvisz.OptionSource", multiple : true, singularName : "optionSource"}
		},
		events : {

			/**
			 * Select event for option entity
			 */
			selectOption : {}
		}
	}});

	OptionEntity.prototype.init = function() {
		this.optionText = "1";
		this.optionSrcEntityId;
		this.optionRepEntityId;
		this.optionOn;
		this.isSelected;
		this.initializationDone = false;
		this.left = 0;
		this.top = 0;
	};

	OptionEntity.prototype.initControls = function() {
		var optionID = this.getId();
		if (!this.optionTextView)
			this.optionTextView = new TextView(optionID + "-optionText");
		var that = this;
		if (!this.optionBtn){
			this.optionBtn = new RadioButton(optionID+ "-optionBtn",{
				groupName: optionID+ "-optionBtn"
			});
			this.optionBtn.attachSelect(function(oEvent) {
				//private event used when option is clicked
				that.fireEvent("optionSelected");
				//public event used when option is clicked
				that.fireSelectOption();
			});
		}
	};

	OptionEntity.prototype.onclick = function(oEvent) {
		if(oEvent.srcControl instanceof RadioButton)
			return;
		if(this.getEnable() == true){
			//private event used when option is clicked
			this.fireEvent("optionSelected");
			//public event used when option is clicked
			this.fireSelectOption();
		}
	};

	OptionEntity.prototype.onAfterRendering = function() {
		if(this.getSelected()==true){
			this.optionBtn.setSelected(true);
		}
	};
});