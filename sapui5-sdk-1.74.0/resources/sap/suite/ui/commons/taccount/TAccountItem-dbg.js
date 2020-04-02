sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/suite/ui/commons/library",
	"sap/ui/core/Control",
	"sap/ui/core/theming/Parameters",
	"sap/suite/ui/commons/taccount/TAccountPanel",
	"sap/suite/ui/commons/taccount/TAccountGroup",
	"sap/ui/core/format/NumberFormat",
	"sap/ui/core/Core",
	"sap/ui/core/library",
	"./TAccountUtils"
], function (jQuery, library, Control, Parameters, TAccountPanel, TAccountGroup, NumberFormat, Core, CoreLibrary, TAccountUtils) {
	"use strict";

	var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");

	/**
	 * Constructor for a new TAccountItem.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The T account item control represents a credit or debit entry on a {@link sap.suite.ui.commons.TAccount}.
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
	 * @alias sap.suite.ui.commons.taccount.TAccountItem
	 * @ui5-metamodel This control/element will also be described in the UI5 (legacy) design time metamodel.
	 */
	var TAccountItem = Control.extend("sap.suite.ui.commons.taccount.TAccountItem", {
		metadata: {
			library: "sap.suite.ui.commons",
			properties: {
				/**
				 * Value of the credit or debit entry.
				 */
				value: {type: "float", group: "Misc", defaultValue: 0},
				/**
				 * Color applied to the debit or credit entry.
				 */
				color: {type: "sap.m.ValueCSSColor", group: "Misc", defaultValue: null},
				/**
				 * Group where this debit or credit entry belongs.<br>
				 * Entries that share the same group are highlighted when the user clicks or taps
				 * one of such entries.
				 */
				group: {type: "string", group: "Misc", defaultValue: ""},
				/**
				 * Aria label for item.
				 */
				ariaLabel: {type: "string", group: "Misc", defaultValue: ""}
			},
			aggregations: {
				/**
				 * Additional properties that define how the entry is displayed.
				 */
				properties: {
					type: "sap.suite.ui.commons.taccount.TAccountItemProperty", multiple: true, singularName: "property"
				}
			},
			events: {
				/**
				 * This event is fired when the user clicks or taps the entry.
				 * It highlights the entry and all other entries that belong to the same group.
				 */
				press: {}
			}
		},
		renderer: function (oRm, oItem) {
			var sColor = oItem.getColor(),
				sUnit = oItem.getParent() && oItem.getParent().getMeasureOfUnit(),
				sValue = TAccountUtils.formatCurrency(oItem.getValue(), sUnit),
				sTextValue = sValue + " " + sUnit;

			oRm.write("<div tabindex=\"0\"");
			oRm.addClass("sapSuiteUiCommonsAccountItem");
			oRm.writeClasses(oItem);
			oRm.writeControlData(oItem);

			if (oItem.getGroup()) {
				oRm.writeAttributeEscaped("group", oItem.getGroup());
			}
			oRm.writeAttribute("aria-selected", "false");
			oRm.writeAttribute("aria-setsize", oItem._indexSize);
			oRm.writeAttribute("aria-posinset", oItem._index);
			oRm.writeAttribute("role", "option");
			oRm.writeAttributeEscaped("aria-label", oItem._getAriaLabel(sTextValue));

			oRm.write(">");

			oRm.write("<div class=\"sapSuiteUiCommonsAccountColorBar\"");

			// sColor is either valid CSS string value or less parameter value
			if (sColor && CoreLibrary.CSSColor.isValid(sColor)) {
				oRm.write("style=\"background-color:" + sColor + "\"");
			} else if (CoreLibrary.CSSColor.isValid(Parameters.get(sColor))) {
				oRm.write("style=\"background-color:" + Parameters.get(sColor) + "\"");
			}

			oRm.write(">");
			oRm.write("</div>");
			oRm.write("<div id=\"" + oItem.getId() + "-content\" class=\"sapSuiteUiCommonsAccountContent\">");

			// title
			oRm.write("<div class=\"sapSuiteUiCommonsAccountItemTitleWrapper\">");
			oRm.write("<span class=\"sapSuiteUiCommonsAccountItemTitle\">");

			oRm.writeEscaped(sTextValue);
			oRm.write("</span>");
			oRm.write("</div>");

			// properties
			oRm.write("<div class=\"sapSuiteUiCommonsAccountItemProperties\">");
			oItem.getProperties().forEach(function (oProperty) {
				oRm.renderControl(oProperty);
			});
			oRm.write("</div>");

			oRm.write("</div>");
			oRm.write("</div>");
		}
	});

	/* =========================================================== */
	/* Events													   */
	/* =========================================================== */
	TAccountItem.prototype.onBeforeRendering = function () {
		this._prepareProperties();
	};

	TAccountItem.prototype.onAfterRendering = function () {
		this.$().on("click", this._click.bind(this));
	};

	/* =========================================================== */
	/* Private methods											   */
	/* =========================================================== */
	TAccountItem.prototype._refreshAriaLabel = function (sValue) {
		this.$().attr("aria-label", this._getAriaLabel());
	};

	TAccountItem.prototype._getAriaLabel = function (sTextValue) {
		var sAriaLabel = this.getAriaLabel();
		if (sAriaLabel) {
			return sAriaLabel;
		}

		if (!sTextValue) {
			var sUnit = this.getParent() && this.getParent().getMeasureOfUnit(),
				sValue = TAccountUtils.formatCurrency(this.getValue(), sUnit),
				sTextValue = sValue + " " + sUnit;
		}

		var sText = (this._bIsDebit ? oResourceBundle.getText("TACCOUNT_DEBIT") : oResourceBundle.getText("TACCOUNT_CREDIT"))
			+ " " + oResourceBundle.getText("TACCOUNT_ITEM");

		sText += " " + sTextValue + " ";

		this.getProperties().forEach(function (oItem) {
			if (oItem.getVisible()) {
				sText += oItem.getLabel() + ":" + oItem.getValue() + " ";
			}
		});

		return sText;
	};

	TAccountItem.prototype._click = function () {
		var bExecuteDefault = this.fireEvent("press", {}, true);
		if (bExecuteDefault) {
			this._highlightItems();
		}
	};

	TAccountItem.prototype._highlightItems = function () {
		var $this = this.$(),
			sGroup = this.getGroup(),
			bSelect = !$this.is(".sapSuiteUiCommonsAccountItemSelected, .sapSuiteUiCommonsAccountItemSelectedByGroup"),
			$selectedItem = jQuery(".sapSuiteUiCommonsAccountItemSelected");

		this._setAriaHighlighted($selectedItem, false);
		this._setAriaHighlighted($this, bSelect);

		$selectedItem.removeClass("sapSuiteUiCommonsAccountItemSelected");
		bSelect ? $this.addClass("sapSuiteUiCommonsAccountItemSelected") : $this.removeClass("sapSuiteUiCommonsAccountItemSelected");

		var oPanel = this._findHighlightParent();
		if (oPanel) {
			var $selectedByGroupItem = jQuery(".sapSuiteUiCommonsAccountItemSelectedByGroup");
			$selectedByGroupItem.removeClass("sapSuiteUiCommonsAccountItemSelectedByGroup");
			this._setAriaHighlighted($selectedByGroupItem, false);
			if (sGroup && bSelect) {
				var aGroups = jQuery(".sapSuiteUiCommonsAccountItem[group=" + sGroup + "]");
				aGroups.addClass("sapSuiteUiCommonsAccountItemSelectedByGroup");

				var that = this;
				// set flag to items' account and group
				aGroups.each(function (i, el) {
					var oElement = sap.ui.getCore().byId(el.id);
					if (oElement) {
						that._setAriaHighlighted(oElement.$(), true);
						var oParent = oElement.getParent();
						if (oParent) {
							oParent.$().addClass("sapSuiteUiCommonsAccountItemSelectedByGroup");

							var oGroup = oParent.getParent();
							if (oGroup instanceof TAccountGroup) {
								oGroup.$().addClass("sapSuiteUiCommonsAccountItemSelectedByGroup");
							}
						}
					}
				});
			}
		}
	};

	TAccountItem.prototype.onsapenter = function () {
		this._highlightItems();
	};

	TAccountItem.prototype.onsapspace = function () {
		this._highlightItems();
	};

	TAccountItem.prototype._setAriaHighlighted = function ($item, bSelect) {
		$item.attr("aria-selected", bSelect);
		$item.attr("aria-label", bSelect ? oResourceBundle.getText("COLORED_ITEM_FROM") + " " + this.getGroup() : this._getAriaLabel());
	};

	TAccountItem.prototype._findHighlightParent = function () {
		var oParent = this.getParent();
		oParent = oParent && oParent.getParent();

		if (oParent instanceof TAccountGroup) {
			var oPanelParent = oParent.getParent();
			return oPanelParent instanceof TAccountPanel || oParent;
		}

		return null;
	};

	TAccountItem.prototype._prepareProperties = function () {
		this._mProperties = {};

		this.getProperties().forEach(function (oProperty) {
			var sKey = oProperty.getKey();
			if (sKey) {
				this._mProperties[sKey] = oProperty;
			}
		}.bind(this));
	};

	/* =========================================================== */
	/* Properties												   */
	/* =========================================================== */
	TAccountItem.prototype.setValue = function (iValue) {
		var iOldValue = this.getValue(),
			iDiff = (this._bIsDebit ? -1 : 1) * (iValue - iOldValue);

		this.setProperty("value", iValue);
		this.getParent() && this.getParent()._valueChanged(iDiff);
	};

	return TAccountItem;

});
