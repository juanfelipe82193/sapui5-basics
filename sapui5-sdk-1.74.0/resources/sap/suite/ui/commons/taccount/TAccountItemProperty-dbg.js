sap.ui.define([
	"sap/suite/ui/commons/library",
	"sap/ui/core/Control",
	"sap/ui/core/theming/Parameters"
], function (library, Control, Parameters) {
	"use strict";

	/**
	 * Constructor for a new TAccountItemProperty.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * An additional property that defines how a {@link sap.suite.ui.commons.TAccountItem} is displayed.
	 *
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 * @since 1.58.0
	 *
	 * @constructor
	 * @public
	 *
	 * @alias sap.suite.ui.commons.taccount.TAccountItemProperty
	 * @ui5-metamodel This control/element will also be described in the UI5 (legacy) design time metamodel.
	 */
	var TAccountItemProperty = Control.extend("sap.suite.ui.commons.taccount.TAccountItemProperty", {
		metadata: {
			library: "sap.suite.ui.commons",
			properties: {
				/**
				 * Key of the property.
				 */
				key: {type: "string", group: "Misc", defaultValue: null},
				/**
				 * Value of the property.
				 */
				value: {type: "string", group: "Misc", defaultValue: null},
				/**
				 * Label of the property.<br>Can be hidden or displayed using the <code>displayLabel</code> property.
				 */
				label: {type: "string", group: "Misc", defaultValue: null},
				/**
				 * Defines whether the label should be displayed.<br>
				 * This property can be overridden by the {@link sap.suite.ui.commons.TAccountPanel} settings.
				 */
				displayLabel: {type: "boolean", group: "Misc", defaultValue: true},
				/**
				 * Defines whether the T account property should be visible or hidden.
				 */
				visible: {type: "boolean", group: "Misc", defaultValue: true}
			}
		},
		renderer: function (oRm, oProperty) {
			var sValue = oProperty.getValue(),
				sLabel = oProperty.getLabel(),
				sDisplayNone = oProperty.getVisible() ? "" : "style=\"display:none\"",
				sKey = "key=" + oProperty.getKey();

			oRm.write("<div class=\"sapSuiteUiCommonsAccountPropertyWrapper\"" + sKey + " " + sDisplayNone);
			oRm.writeControlData(oProperty);
			oRm.write(">");

			if (sLabel && oProperty.getDisplayLabel()) {
				oRm.write("<div class=\"sapSuiteUiCommonsAccountItemLabel\">" + sLabel + ":</div>");
			}

			oRm.write("<div class=\"sapSuiteUiCommonsAccountItemProperty\">" + sValue + "</div>");
			oRm.write("</div>");
		}
	});

	TAccountItemProperty.prototype._getLabel = function () {
		return this.getValue() || this.getKey();
	};

	return TAccountItemProperty;

});
