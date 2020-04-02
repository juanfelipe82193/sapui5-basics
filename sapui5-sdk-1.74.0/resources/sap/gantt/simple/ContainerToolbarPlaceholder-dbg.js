/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/gantt/library",
	"sap/ui/core/Control",
	"sap/ui/base/Object",
	"sap/m/OverflowToolbarAssociativePopoverControls"
], function(library, Control, BaseObject, OverflowToolbarAssociativePopoverControls) {
	"use strict";

	var PlaceholderType = library.simple.ContainerToolbarPlaceholderType;

	/**
	 * Constructor for a new placeholder used in the container toolbar.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Placeholder is used to represent some of the buttons in a <code>sap.gantt.simple.ContainerToolbar</code> control.
	 *
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 * @since 1.66.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.ContainerToolbarPlaceholder
	 * @ui5-metamodel This control/element will also be described in the UI5 (legacy) design time metamodel.
	 */
	var ContainerToolbarPlaceholder = Control.extend("sap.gantt.simple.ContainerToolbarPlaceholder", /** @lends sap.gantt.simple.ContainerToolbarPlaceholder.prototype */ {
		metadata: {
			library: "sap.gantt",
			interfaces : [
				"sap.m.IOverflowToolbarContent"
			],
			properties: {
				/**
				 * Defines the type of represented control.
				 */
				type: {type: "sap.gantt.simple.ContainerToolbarPlaceholderType", defaultValue: null},

				/**
				 * Shows or hides the represented control.
				 * @private
				 */
				_show: {type: "boolean", defaultValue: false}
			},
			aggregations: {
				/**
				 * Represented control.
				 * @private
				 */
				_control: {type: "sap.ui.core.Control", multiple: false}
			}
		},
		renderer: function (oRm, oContainerToolbarPlaceholder) {
			var oControl = oContainerToolbarPlaceholder._getControl();

			if (!oControl || !oContainerToolbarPlaceholder._getShow()) {
				return;
			}

			if (oContainerToolbarPlaceholder.getType() === "Spacer") {
				oRm.renderControl(oControl);
			} else {
				oRm.write("<div");
				oRm.writeControlData(oContainerToolbarPlaceholder);
				oRm.writeClasses();
				oRm.write(">");
				oRm.renderControl(oControl);
				oRm.write("</div>");
			}
		}
	});

	ContainerToolbarPlaceholder.prototype.init = function () {
		this._oOverflowToolbarAssociativePopoverControls = new OverflowToolbarAssociativePopoverControls();
		this._aControlAutoCloseEvents = [];
	};

	/**
	 * Enables the <code>sap.m.ContainerToolbarPlaceholder</code> to move inside the {@link sap.m.OverflowToolbar}.
	 * Required by the {@link sap.m.IOverflowToolbarContent} interface.
	 *
	 * @public
	 * @returns {object} Configuration information for the <code>sap.m.IOverflowToolbarContent</code> interface.
	 */
	ContainerToolbarPlaceholder.prototype.getOverflowToolbarConfig = function () {
		var oControl = this._getControl(),
			sStyleClass = "sapGanttSimpleContainerToolbarPlaceholderInPopover",
			oConfig = this._mapOverflowToolbarConfig();

		if (!oControl) {
			return oConfig;
		}

		if (BaseObject.isA(oControl, "sap.m.SegmentedButton")) {
			oConfig.onBeforeEnterOverflow = function() {
				oControl._onBeforeEnterOverflow(oControl);
				this.addStyleClass(sStyleClass);
			}.bind(this);
			oConfig.onAfterExitOverflow = function() {
				oControl._onAfterExitOverflow(oControl);
				this.removeStyleClass(sStyleClass);
			}.bind(this);
		} else if (BaseObject.isA(oControl, "sap.m.OverflowToolbarButton")) {
			oConfig.onBeforeEnterOverflow = function() {
				this.addStyleClass(sStyleClass);
				this._oOverflowToolbarAssociativePopoverControls._preProcessSapMButton(oControl);
				oControl._bInOverflow = true;
			}.bind(this);
			oConfig.onAfterExitOverflow = function() {
				this.removeStyleClass(sStyleClass);
				delete oControl._bInOverflow;
				this._oOverflowToolbarAssociativePopoverControls._postProcessSapMButton(oControl);
			}.bind(this);
		}

		if (oConfig.autoCloseEvents) {
			this._attachAutoCloseEvents(oConfig.autoCloseEvents);
			oConfig.autoCloseEvents = ["_controlAutoCloseEvent"];
		}
		return oConfig;
	};

	ContainerToolbarPlaceholder.prototype._mapOverflowToolbarConfig = function () {
		var oControl = this._getControl(),
			oConfig = { canOverflow: !(this._isTypeSpacer() || this._isTypeTimeZoomControl()) },
			oControlConfig;

		if (!oControl) {
			return oConfig;
		}

		if (oControl.getMetadata().getInterfaces().indexOf("sap.m.IOverflowToolbarContent") !== -1) {
			return oControl.getOverflowToolbarConfig();
		}

		oControlConfig = OverflowToolbarAssociativePopoverControls.getControlConfig(oControl);
		if (oControlConfig) {
			oConfig = {
				canOverflow: oControlConfig.canOverflow,
				autoCloseEvents: oControlConfig.listenForEvents,
				propsUnrelatedToSize: oControlConfig.noInvalidationProps,
				onBeforeEnterOverflow: oControlConfig.preProcess,
				onAfterExitOverflow: oControlConfig.postProcess
			};
		}
		return oConfig;
	};

	ContainerToolbarPlaceholder.prototype._attachAutoCloseEvents = function (aControlEvents) {
		var oControl = this._getControl(),
			sAttachFnName;

		aControlEvents.forEach(function(sEventType) {
			sAttachFnName = "attach" + this._capitalize(sEventType);
			if (oControl[sAttachFnName]) {
				oControl[sAttachFnName](this._fireAutoCloseEvent.bind(this));
			} else {
				oControl.attachEvent(sEventType, this._fireAutoCloseEvent.bind(this));
			}
		}.bind(this));

		// Store events for detach
		this._aControlAutoCloseEvents = aControlEvents;
	};

	ContainerToolbarPlaceholder.prototype._detachAutoCloseEvents = function () {
		var oControl = this._getControl(),
			sDetachFnName;

		this._aControlAutoCloseEvents.forEach(function(sEventType) {
			sDetachFnName = "detach" + this._capitalize(sEventType);
			if (oControl[sDetachFnName]) {
				oControl[sDetachFnName](this._fireAutoCloseEvent, this);
			} else {
				oControl.detachEvent(sEventType, this._fireAutoCloseEvent, this);
			}
		}, this);
		this._aControlAutoCloseEvents = [];
	};

	ContainerToolbarPlaceholder.prototype._toSelectMode = function () {
		this._getControl()._toSelectMode();
	};

	ContainerToolbarPlaceholder.prototype._toNormalMode = function () {
		this._getControl()._toNormalMode();
	};

	ContainerToolbarPlaceholder.prototype.getIcon = function () {
		return this._getControl().getIcon();
	};

	ContainerToolbarPlaceholder.prototype.getLayoutData = function () {
		var oControl = this._getControl();
		return oControl ? oControl.getLayoutData() : null;
	};

	ContainerToolbarPlaceholder.prototype._getControl = function () {
		return this.getAggregation("_control");
	};

	ContainerToolbarPlaceholder.prototype._setControl = function (oControl) {
		this.setAggregation("_control", oControl);
	};

	ContainerToolbarPlaceholder.prototype._getShow = function () {
		return this.getProperty("_show");
	};

	ContainerToolbarPlaceholder.prototype._isTypeSpacer = function () {
		return this.getType() === PlaceholderType.Spacer;
	};

	ContainerToolbarPlaceholder.prototype._isTypeTimeZoomControl = function () {
		return this.getType() === PlaceholderType.TimeZoomControl;
	};

	ContainerToolbarPlaceholder.prototype._fireAutoCloseEvent = function () {
		this.fireEvent("_controlAutoClose");
	};

	ContainerToolbarPlaceholder.prototype._capitalize = function (sText) {
		return sText.substring(0, 1).toUpperCase() + sText.substring(1);
	};

	ContainerToolbarPlaceholder.prototype.setType = function (sType) {
		var oParent = this.getParent();

		if (oParent && sType !== this.getType()) {
			this._detachAutoCloseEvents();
			this._setControl(null);
			oParent.bShallUpdateContent = true;
			oParent.invalidate();
		}
		this.setProperty("type", sType, true);
	};

	return ContainerToolbarPlaceholder;
});
