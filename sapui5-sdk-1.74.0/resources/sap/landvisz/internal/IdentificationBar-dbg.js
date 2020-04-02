/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */

// Provides control IdentificationBar.
sap.ui.define([
	"sap/landvisz/library",
	"sap/landvisz/EntityConstants",
	"sap/ui/core/Control",
	"sap/ui/core/library",
	"sap/ui/commons/Image",
	"sap/ui/commons/TextView",
	"./IdentificationBarRenderer"
], function(
	landviszLibrary,
	EntityConstants,
	Control,
	coreLibrary,
	Image,
	TextView,
	IdentificationBarRenderer
) {
	"use strict";

	// shortcut for sap.ui.core.AccessibleRole
	var AccessibleRole = coreLibrary.AccessibleRole;

	// shortcut for sap.landvisz.EntityCSSSize
	var EntityCSSSize = landviszLibrary.EntityCSSSize;

	/**
	 * Constructor for a new internal/IdentificationBar.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Acontrol to render identification bar of a system
	 * @extends sap.ui.core.Control
	 *
	 * @constructor
	 * @public
	 * @alias sap.landvisz.internal.IdentificationBar
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var IdentificationBar = Control.extend("sap.landvisz.internal.IdentificationBar", /** @lends sap.landvisz.internal.IdentificationBar.prototype */ { metadata : {

		library : "sap.landvisz",
		properties : {

			/**
			 * text that identifies a system
			 */
			text : {type : "string", group : "Data", defaultValue : null},

			/**
			 * type of system rendered
			 */
			type : {type : "string", group : "Data", defaultValue : null},

			/**
			 * text that identifies the server
			 */
			qualifierText : {type : "string", group : "Data", defaultValue : null},

			/**
			 * tooltip to identify the server
			 */
			qualifierTooltip : {type : "string", group : "Data", defaultValue : null},

			/**
			 * icon to identify the server
			 */
			qualifierType : {type : "string", group : "Data", defaultValue : null},

			/**
			 * rendering size of the control
			 */
			renderingSize : {type : "sap.landvisz.EntityCSSSize", group : "Dimension", defaultValue : EntityCSSSize.Regular},

			/**
			 * determines the default state of the control
			 */
			defaultState : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * despriction of the identification region of a control
			 */
			description : {type : "string", group : "Data", defaultValue : null},

			/**
			 * Component type of the entity
			 */
			componentType : {type : "sap.landvisz.ComponentType", group : "Identification", defaultValue : null}
		},
		events : {

			/**
			 * fires click event on selection
			 */
			select : {}
		}
	}});


	/**
	 * returns identification properties
	 *
	 * @alias sap.landvisz.internal.IdentificationBar#getIdentificationProperties
	 * @function
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */

	IdentificationBar.prototype.init = function() {
		this.initializationDone = false;
	};

	IdentificationBar.prototype.exit = function() {
		this.oIdentifierIcon && this.oIdentifierIcon.destroy();
		this.oQualifierIcon && this.oQualifierIcon.destroy();
		this.oDescriptionText && this.oDescriptionText.destroy();
		this.oIdentifierText && this.oIdentifierText.destroy();
		this.oQualifierText && this.oQualifierText.destroy();
	};

	/**
	 * Create the composite parts out of the current settings. Called by the renderer just before rendering
	 *
	 * @private
	 */
	IdentificationBar.prototype.initControls = function() {

		var identificationHdrID = this.getId();

		this._oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.landvisz");
		this.OnDemandText = this._oBundle.getText("On_Demand");
		this.OnPremiseText = this._oBundle.getText("On_Premise");



		// Identification Region Icon
		this.oIdentifierIcon && this.oIdentifierIcon.destroy();
		this.oIdentifierIcon = new Image(identificationHdrID
				+ "-CLVIdnImg");
		this.oIdentifierIcon.setParent(this);

		// Identification Text display
		this.oIdentifierText && this.oIdentifierText.destroy();
		this.oIdentifierText = new TextView(identificationHdrID
				+ "-CLVIdnTxt");
		this.oIdentifierText.setAccessibleRole(AccessibleRole.Heading);
		this.oIdentifierText.setParent(this);

		// Identification Region Qualifier Icon
		this.oQualifierIcon && this.oQualifierIcon.destroy();
		this.oQualifierIcon = new Image(identificationHdrID
				+ "-CLVQuaImg").addStyleClass("sapLandviszCursor");
		this.oQualifierIcon.setParent(this);

		// Identification Description display - Make it as Call out
		this.oDescriptionText && this.oDescriptionText.destroy();
		this.oDescriptionText = new TextView(identificationHdrID
				+ "-CLVDesTxt");
		this.oDescriptionText.setParent(this);

		// Identification Text display
		this.oQualifierText && this.oQualifierText.destroy();
		this.oQualifierText = new TextView(identificationHdrID
				+ "-CLVQuaTxt");

		this.oIdentifierTextIcon && this.oIdentifierTextIcon.destroy();

		this.oIdentifierTextIcon = new Image(identificationHdrID
		+ "-CLVIdnSIDImg");

		this.oQualifierText.setAccessibleRole(AccessibleRole.Heading);
		this.oQualifierText.setParent(this);

		this.oButton;
		this.oCallout;
		this.maxHeight;
		this.entityMaximized;

	};
	IdentificationBar.prototype.select = function(oEvent) {
		this.fireSelect();
	};

	sap.landvisz.LandscapeEntity.prototype.select = function(oEvent) {
		this.fireSelect();
	};

	IdentificationBar.prototype.onclick = function(oEvent) {
		EntityConstants.internalEvent = true;
		this.fireSelect();
	};

	return IdentificationBar;

});