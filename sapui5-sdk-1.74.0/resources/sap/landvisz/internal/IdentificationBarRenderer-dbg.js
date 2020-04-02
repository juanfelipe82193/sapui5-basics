/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */

sap.ui.define([
	"sap/landvisz/library",
	"sap/landvisz/EntityConstants",
	"sap/ui/commons/Button",
	"sap/ui/commons/Callout",
	"sap/ui/commons/library"
], function(landviszLibrary, EntityConstants, Button, Callout, commonsLibrary) {
	"use strict";

	// shortcut for sap.ui.commons.TextViewDesign
	var TextViewDesign = commonsLibrary.TextViewDesign;

	// shortcut for sap.landvisz.ComponentType
	var ComponentType = landviszLibrary.ComponentType;

	// shortcut for sap.landvisz.EntityCSSSize
	var EntityCSSSize = landviszLibrary.EntityCSSSize;

	// shortcut for sap.landvisz.LandscapeObject
	var LandscapeObject = landviszLibrary.LandscapeObject;

	// shortcut for sap.landvisz.TechnicalSystemType
	var TechnicalSystemType = landviszLibrary.TechnicalSystemType

	/**
	 * IdentificationBar renderer.
	 * @namespace
	 */
	var IdentificationBarRenderer = {

	};

	IdentificationBarRenderer.render = function(oRm, oControl) {
		this.tSize = null;
		this.sEntityIconSizePath = "32x32",
		this.tSIDTextSize = TextViewDesign.H4;
		this.squalifierTextSize = null;
		this.sQualifierIconSizePath = null;
		var rb = sap.ui.getCore().getLibraryResourceBundle("sap.landvisz");
		var identificationHdrID = oControl.getId();
		var size = oControl.getRenderingSize();
		if (!this.initializationDone) {
			oControl.initControls();
			oControl.initializationDone = true;

			oRm.write("<div");
			oRm.writeControlData(oControl); // writes the Control ID and enables
			// event handling - important!
			this._renderObjectType(oRm, oControl);
			// oRm.writeStyles();

			var title = oControl._oBundle.getText(oControl.getType());

			oRm.writeAttributeEscaped('title', title);
			if (oControl.entityMaximized != true) {
			oRm.addClass("sapLandVisIdentificationBarSize");
				if (size == EntityCSSSize.Small) {
					oRm.addClass("sapLandVisIdentificationBarSmallSize");
					this.sEntityIconSizePath = "32x32";
				} else if (size == EntityCSSSize.RegularSmall) {
				oRm.addClass("sapLandVisIdentificationBarRegularSmallSize");
				this.sEntityIconSizePath = "48x48";
				} else if (size == EntityCSSSize.Regular) {
					oRm.addClass("sapLandVisIdentificationBarRegularSize");
					this.sEntityIconSizePath = "48x48";

				} else if (size == EntityCSSSize.Medium) {
					oRm.addClass("sapLandVisIdentificationBarMediumSize");
					this.sEntityIconSizePath = "48x48";
				}
				if (size == EntityCSSSize.Large) {
					oRm.addClass("sapLandVisIdentificationBarLargeSize");
					this.sEntityIconSizePath = "48x48";
				}
			} else if (oControl.entityMaximized == true) {
				oRm.addClass("sapLandVisIdentificationBarSize");
				oRm.addClass("sapLandVisIdentificationBarMaximizeSize");
				if (oControl.maxHeight && oControl.maxHeight != 0)
					oRm.addStyle("height", oControl.maxHeight + "px")
				this.sEntityIconSizePath = "48x48";
			}
			// add a CSS class for styles common to all control instances
			oRm.writeStyles();
			oRm.writeClasses();
			oRm.write(">");
			this._renderIdentificationProperties(oRm, oControl);

			if (oControl.getType() == LandscapeObject.TechnicalSystem
					|| oControl.getType() == LandscapeObject.SapComponent)
				this._renderQualifierProperties(oRm, oControl);
			this._renderDescriptionCallOut(oRm, oControl);

			oRm.write("</div>");

		}

	};

	IdentificationBarRenderer._renderObjectType = function(
			oRm, oControl) {

		var type = oControl.getType();

		switch (type) {
		case LandscapeObject.TechnicalSystem:
			oRm.addStyle("background-color", "rgb(0, 143, 211)");
			break;
		case LandscapeObject.ProductSystem:
			oRm.addStyle("background-color", "rgb(243, 155, 2)");
			break;
		case LandscapeObject.Database:
			oRm.addStyle("background-color", "rgb(0, 0, 0)");
			break;
		case LandscapeObject.Product:
			oRm.addStyle("background-color", "rgb(137, 124, 98)");
			break;
		case LandscapeObject.ProductVersion:
			oRm.addStyle("background-color", "rgb(137, 124, 98)");
			break;
		case LandscapeObject.SapComponent:
			oRm.addStyle("background-color", "rgb(102, 102, 102)");
			break;
		}

	};

	IdentificationBarRenderer._renderIdentificationProperties = function(
			oRm, oControl) {
		if (oControl) {
			var type = oControl.getType();
			oControl.oIdentifierText.setText(oControl.getText());
			oControl.oIdentifierText.setTooltip(oControl.getTooltip());
			oControl.oIdentifierText.addStyleClass("IdentificationText");
			oControl.oIdentifierText.attachBrowserEvent("mouseclick", function(event) {
				EntityConstants.internalEvent = true;
			});
			var srcPath = this._renderIdentifireIcon(oControl, "enable");
			oControl.oIdentifierIcon.setSrc(srcPath).addStyleClass("img");

			oControl.oIdentifierIcon.attachPress(function(event) {
				EntityConstants.internalEvent = true;
			});

			oControl.oIdentifierIcon.setAlt("landscape Entity Image");
			var title = oControl._oBundle.getText(oControl.getType());
			var componentType = oControl.getComponentType();

			if (oControl.getType() == LandscapeObject.SapComponent
					&& componentType == ComponentType.onDemand)
				title = title + "-" + oControl.OnDemandText;
			else if (oControl.getType() == LandscapeObject.SapComponent
					&& componentType == ComponentType.onPremise)
				title = title + "-" + oControl.OnPremiseText;

			oControl.oIdentifierIcon.setTooltip(title);

			// Render to Render Manager
			oRm.write("<div");
			oRm.addClass("entityIcon");
			oRm.writeClasses();

			oRm.write(">");
			var that = this;
			oControl.oIdentifierIcon.attachBrowserEvent("mouseenter", function(event) {
				event.currentTarget.src = that._renderIdentifireIcon(oControl,"hover");
			});

			oControl.oIdentifierIcon.attachBrowserEvent("mouseleave", function(event) {
				event.currentTarget.src = that._renderIdentifireIcon(oControl,"enable");
			});

			oRm.renderControl(oControl.oIdentifierIcon);
			oRm.write("</div>");
			oRm.write("<div");

			var idnHeight = 0;
			if (oControl.maxHeight != 0)
				idnHeight = oControl.maxHeight - 175;
			if (oControl.entityMaximized == true) {
				if (idnHeight != 0)
					oRm.addStyle("height", idnHeight + "px");
			} else
				oRm.addStyle("height", "auto");
			oRm.addStyle("text-align", "center");
			oRm.writeStyles();
			oRm.write(">");

	//		if (type == LandscapeObject.SapComponent) {
	//		oRm.write("<div");

	//		if (oControl.entityMaximized == true) {
	//		if (idnHeight != 0)
	//		oRm.addStyle("height", idnHeight + "px");
	//		} else
	//		oRm.addStyle("height", "auto");
	//		oRm.addStyle("text-align", "center");
	//		oRm.writeStyles();
	//		oRm.write(">");
	//		oRm.renderControl(oControl.oIdentifierTextIcon);
	//		oRm.write("</div>");
	//		} else

			oRm.renderControl(oControl.oIdentifierText);
			oRm.write("</div>");
		}
	};

	IdentificationBarRenderer._renderIdentifireIcon = function(
			oControl, apendText) {

		var iconPath = sap.ui.resource("sap.landvisz",
				"themes/base/img/landscapeobjects/");

		if (oControl.getRenderingSize() == EntityCSSSize.Small)
			iconPath = iconPath + "32x32";
		else
			iconPath = iconPath + "48x48";

		var type = oControl.getType();
		var componentType = oControl.getComponentType();

		switch (type) {
		case LandscapeObject.TechnicalSystem:
			iconPath = iconPath + "/TechnicalSystem_" + apendText + ".png";
			break;
		case LandscapeObject.ProductSystem:
			iconPath = iconPath + "/ProductSystem_" + apendText + ".png";
			break;
		case LandscapeObject.Database:
			iconPath = iconPath + "/Database_" + apendText + ".png";
			break;
		case LandscapeObject.Product:
			iconPath = iconPath + "/Product_" + apendText + ".png";
			break;
		case LandscapeObject.ProductVersion:
			iconPath = iconPath + "/ProductVersion_" + apendText + ".png";
			break;
		case LandscapeObject.SapComponent:
			if (componentType == ComponentType.onDemand)
				iconPath = iconPath + "/sap_on_demand.png";
			else if (componentType == ComponentType.onPremise)
				iconPath = iconPath + "/sap_on_premise.png";
			break;
		}

		return iconPath;
	};

	IdentificationBarRenderer._renderQualifierProperties = function(
			oRm, oControl) {
		if (oControl) {
			// Qualifier Text
			oControl.oQualifierText.setText(oControl.getQualifierText());
			oControl.oIdentifierText.setTooltip(oControl.getQualifierTooltip());
			var tooltip = oControl._oBundle.getText(oControl.getQualifierText());
			oControl.oQualifierText.addStyleClass("qualifierText");
			oControl.oQualifierText.setTooltip(tooltip);

			oControl.oQualifierText.attachBrowserEvent("mouseclick",
					function(event) {
						EntityConstants.internalEvent = true;
					});
			// Qualifier Icon

			this._setQualifierIconSrc(oRm, oControl);
			oControl.oQualifierIcon.setTooltip(tooltip);
			oControl.oQualifierIcon.attachPress(function(event) {
				EntityConstants.internalEvent = true;
			});
			oRm.write("<div");
			oRm.addClass("qualifierIcon");
			oRm.writeClasses();
			oRm.write(">");
			oRm.renderControl(oControl.oQualifierIcon);
			oRm.write("</div>");
			oRm.write("<div");
			oRm.addClass("");
			oRm.writeClasses();
			oRm.write(">");
			oRm.renderControl(oControl.oQualifierText);
			oRm.write("</div>");
		}
	};

	IdentificationBarRenderer._setQualifierIconSrc = function(
			oRm, oControl) {

		// Assign type icon
		var qualType = oControl.getQualifierType();

		switch (qualType) {
		case TechnicalSystemType.ABAP:
			oControl.oQualifierIcon.setSrc(sap.ui.resource("sap.landvisz",
					"themes/base/img/technicaltypes/" + this.sEntityIconSizePath
							+ "/ABAPApplicationServer.png"));
			break;
		case TechnicalSystemType.JAVA:
			oControl.oQualifierIcon.setSrc(sap.ui.resource("sap.landvisz",
					"themes/base/img/technicaltypes/" + this.sEntityIconSizePath
							+ "/ApplicationServerJava.png"));
			break;
		case TechnicalSystemType.HANADB:
			oControl.oQualifierIcon.setSrc(sap.ui.resource("sap.landvisz",
					"themes/base/img/technicaltypes/" + this.sEntityIconSizePath
							+ "/HanaDatabase.png"));
			break;
		case TechnicalSystemType.SBOP:
			oControl.oQualifierIcon.setSrc(sap.ui.resource("sap.landvisz",
					"themes/base/img/technicaltypes/" + this.sEntityIconSizePath
							+ "/BusinessObjectsCluster.png"));
			break;
		case TechnicalSystemType.DUAL:
			oControl.oQualifierIcon.setSrc(sap.ui.resource("sap.landvisz",
					"themes/base/img/technicaltypes/" + this.sEntityIconSizePath
							+ "/DualStackSystem.png"));
			break;
		case TechnicalSystemType.SUP:
			oControl.oQualifierIcon.setSrc(sap.ui.resource("sap.landvisz",
					"themes/base/img/technicaltypes/" + this.sEntityIconSizePath
							+ "/SybaseUnwiredPlatform.png"));
			break;
		case TechnicalSystemType.GENERIC:
			oControl.oQualifierIcon.setSrc(sap.ui.resource("sap.landvisz",
					"themes/base/img/technicaltypes/" + this.sEntityIconSizePath
							+ "/GenaricApplications.png"));
			break;
		case TechnicalSystemType.INTROSCOPEMGR:
			oControl.oQualifierIcon.setSrc(sap.ui.resource("sap.landvisz",
					"themes/base/img/technicaltypes/" + this.sEntityIconSizePath
							+ "/IntroscopeManagerCluster.png"));
			break;
		case TechnicalSystemType.INTROSCOPESTD:
			oControl.oQualifierIcon.setSrc(sap.ui.resource("sap.landvisz",
					"themes/base/img/technicaltypes/" + this.sEntityIconSizePath
							+ "/IntroscopeManagerStandalone.png"));
			break;
		case TechnicalSystemType.LIVECACHESAP:
			oControl.oQualifierIcon.setSrc(sap.ui.resource("sap.landvisz",
					"themes/base/img/technicaltypes/" + this.sEntityIconSizePath
							+ "/LiveCache.png"));
			break;
		case TechnicalSystemType.MDM:
			oControl.oQualifierIcon.setSrc(sap.ui.resource("sap.landvisz",
					"themes/base/img/technicaltypes/" + this.sEntityIconSizePath
							+ "/MasterDataManagement.png"));
			break;
		case TechnicalSystemType.TREX:
			oControl.oQualifierIcon.setSrc(sap.ui.resource("sap.landvisz",
					"themes/base/img/technicaltypes/" + this.sEntityIconSizePath
							+ "/TREX.png"));
			break;
		case TechnicalSystemType.UNSP3TIER:
			oControl.oQualifierIcon.setSrc(sap.ui.resource("sap.landvisz",
					"themes/base/img/technicaltypes/" + this.sEntityIconSizePath
							+ "/Unspecific3LayerSystem.png"));
			break;
		case TechnicalSystemType.UNSPCLUSTER:
			oControl.oQualifierIcon.setSrc(sap.ui.resource("sap.landvisz",
					"themes/base/img/technicaltypes/" + this.sEntityIconSizePath
							+ "/UnspecificCluster.png"));
			break;
		case TechnicalSystemType.UNSPAPP:
			oControl.oQualifierIcon.setSrc(sap.ui.resource("sap.landvisz",
					"themes/base/img/technicaltypes/" + this.sEntityIconSizePath
							+ "/UnspecificStandaloneApplication.png"));
			break;
		case TechnicalSystemType.MSNET:
			oControl.oQualifierIcon.setSrc(sap.ui.resource("sap.landvisz",
					"themes/base/img/technicaltypes/" + this.sEntityIconSizePath
							+ "/VendorSpecificServer.png"));
			break;

		case TechnicalSystemType.APACHESERVER:
			oControl.oQualifierIcon.setSrc(sap.ui.resource("sap.landvisz",
					"themes/base/img/technicaltypes/" + this.sEntityIconSizePath
							+ "/VendorSpecificServer.png"));
			break;
		case TechnicalSystemType.WEBSPHERE:
			oControl.oQualifierIcon.setSrc(sap.ui.resource("sap.landvisz",
					"themes/base/img/technicaltypes/" + this.sEntityIconSizePath
							+ "/VendorSpecificServer.png"));
			break;
		case TechnicalSystemType.MSIISINST:
			oControl.oQualifierIcon.setSrc(sap.ui.resource("sap.landvisz",
					"themes/base/img/technicaltypes/" + this.sEntityIconSizePath
							+ "/VendorSpecificServer.png"));
			break;
		case TechnicalSystemType.WEBDISP:
			oControl.oQualifierIcon.setSrc(sap.ui.resource("sap.landvisz",
					"themes/base/img/technicaltypes/" + this.sEntityIconSizePath
							+ "/WebDispatcher.png"));
			break;
		}

	};

	IdentificationBarRenderer._renderDescriptionCallOut = function(
			oRm, oControl) {
		if (oControl) {
			if (oControl.getDescription()) {
				function createCallout(sText) {
					oControl.oButton = new Button({
						text : sText,
						lite : true
					});
					oControl.oCallout = new Callout({
						content : oControl.oButton
					});
					return oControl.oCallout;
				}
				;
				oControl.oIdentifierIcon.setTooltip(createCallout(oControl
						.getDescription()));

			}
		}
	};

	return IdentificationBarRenderer;

}, /* bExport = */ true);
