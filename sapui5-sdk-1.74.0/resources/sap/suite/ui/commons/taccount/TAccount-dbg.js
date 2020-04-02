sap.ui.define([
	"sap/suite/ui/commons/library",
	"sap/ui/Device",
	"sap/ui/core/Control",
	"sap/ui/core/delegate/ItemNavigation",
	"./TAccountGroup",
	"sap/ui/core/IconPool",
	"sap/ui/core/Icon",
	"sap/ui/core/InvisibleText",
	"sap/base/security/encodeXML",
	"./TAccountUtils",
	"sap/suite/ui/commons/Utils",
	"sap/ui/thirdparty/jqueryui/jquery-ui-core",
	"sap/ui/thirdparty/jqueryui/jquery-ui-widget",
	"sap/ui/thirdparty/jqueryui/jquery-ui-mouse",
	"sap/ui/thirdparty/jqueryui/jquery-ui-draggable",
	"sap/ui/thirdparty/jqueryui/jquery-ui-droppable",
	"sap/ui/thirdparty/jqueryui/jquery-ui-selectable"
], function (library, Device, Control, ItemNavigation, TAccountGroup, IconPool, Icon, InvisibleText, encodeXML, TAccountUtils, Utils) {
	"use strict";

	var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");

	var Direction = Object.freeze({
		UP: "UP",
		DOWN: "DOWN",
		PREVIOUS: "PREVIOUS",
		NEXT: "NEXT"
	});

	// On macOS, the Cmd key is used instead of the Ctrl key.
	var sControlKeyName = Device.os.macintosh ? "metaKey" : "ctrlKey";

	/**
	 * Constructor for a new TAccount.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The T account control displays debit and credit entries on a general ledger account.
	 * It can be used to visualize the flow of transactions through the accounts where these transactions are stored.
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
	 * @alias sap.suite.ui.commons.taccount.TAccount
	 * @see {@link topic:fe6792fa673c4b0fba91d35fd6493c86 T Account}
	 * @ui5-metamodel This control/element will also be described in the UI5 (legacy) design time metamodel.
	 */
	var TAccount = Control.extend("sap.suite.ui.commons.taccount.TAccount", {
		metadata: {
			library: "sap.suite.ui.commons",
			properties: {
				/**
				 * Unit of measurement. Can be set to a currency or any other applicable unit of measurement.<br>
				 * Please note that if multi-currency accounts are used, the T account control will not
				 * convert the values to the currency defined in this property.
				 */
				measureOfUnit: {type: "string", group: "Misc", defaultValue: ""},
				/**
				 * Defines whether the T account should appear as collapsed.<br>By default, it appears as expanded.
				 */
				collapsed: {type: "boolean", group: "Misc", defaultValue: false},
				/**
				 * Title of the T account.
				 */
				title: {type: "string", group: "Misc", defaultValue: null},
				/**
				 * Subtitle of the T account.
				 */
				subtitle: {type: "string", group: "Misc", defaultValue: null},
				/**
				 * TAccount property's key, which is used for ordering. If not set, order mode is not enabled. Only supports <code>DateTime</code> properties.
				 */
				orderBy: {type: "string", group: "Misc", defaultValue: ""},
				/**
				 * Mode with opening and closing balance of the T account.
				 */
				opening: {type: "boolean", group: "Misc", defaultValue: false},
				/**
				 * Opening debit balance of the T account.
				 */
				openingDebit: {type: "float", group: "Misc", defaultValue: 0},
				/**
				 * Opening credit balance of the T account.
				 */
				openingCredit: {type: "float", group: "Misc", defaultValue: 0}
			},
			aggregations: {
				/**
				 * Debit entries.
				 */
				debit: {
					type: "sap.suite.ui.commons.taccount.TAccountItem", multiple: true, singularName: "debit"
				},
				/**
				 * Credit entries.
				 */
				credit: {
					type: "sap.suite.ui.commons.taccount.TAccountItem", multiple: true, singularName: "credit"
				}

			}
		},
		renderer: function (oRm, oAccount) {
			var fnWriteColumn = function (aItems, bIsDebit) {
				aItems.forEach(function (oItem, i) {
					oItem._bIsDebit = bIsDebit;
					oItem._index = i + 1;
					oItem._indexSize = aItems.length;
					oRm.renderControl(oItem);
				});
			};

			var fnWriteOrderedColumn = function (aItems) {
				var sOrderBy = oAccount.getOrderBy();
				aItems.forEach(function (oItem) {
					var aProperties = oItem.getProperties();

					oItem._sOrderBy = "";
					for (var i = 0; i < aProperties.length; i++) {
						if (aProperties[i].getKey().toLowerCase() === sOrderBy.toLowerCase()) {
							oItem._sOrderBy = aProperties[i].getValue();
							break;
						}
					}
				});

				aItems.sort(function (oItem1, oItem2) {
					return new Date(oItem1._sOrderBy) >= new Date(oItem2._sOrderBy) ? 1 : -1;
				});

				oAccount._setItemsAttrs(aItems);

				aItems.forEach(function (oItem) {
					oRm.renderControl(oItem.addStyleClass(oItem._bIsDebit ? "sapSuiteUiCommonsAccountItemLeft" : "sapSuiteUiCommonsAccountItemRight"));
				});
			};

			var fnCountBalance = function (bIsDebit) {
				var aItems = bIsDebit ? oAccount.getDebit() : oAccount.getCredit(),
					iSumItems = bIsDebit ? oAccount.getOpeningDebit() : oAccount.getOpeningCredit();

				aItems.forEach(function (oItem) {
					iSumItems += oItem.getValue();
				});
				return TAccountUtils.formatCurrency(iSumItems, oAccount.getMeasureOfUnit());
			};

			var sUnit = oAccount.getMeasureOfUnit(),
				sOpeningDebit = TAccountUtils.formatCurrency(oAccount.getOpeningDebit(), sUnit),
				sOpeningCredit = TAccountUtils.formatCurrency(oAccount.getOpeningCredit(), sUnit),
				bHasData = (oAccount.getDebit().length > 0 || oAccount.getCredit().length > 0);

			oRm.write("<div");
			if (oAccount.getCollapsed()) {
				oRm.addClass("sapSuiteUiCommonsAccountCollapsed");
			}
			oRm.addClass("sapSuiteUiCommonsAccount");

			if (!bHasData) {
				oRm.addClass("sapSuiteUiCommonsAccountEmpty");
			}

			oRm.writeClasses(oAccount);
			oRm.writeControlData(oAccount);
			oRm.writeAttribute("role", "region");
			oRm.writeAttribute("aria-labelledby", oAccount.getId() + "-title" + " " + oAccount.getId() + "-sum");
			oRm.writeAttribute("aria-describedby", oAccount.getId());
			oRm.writeAttributeEscaped("aria-label", oAccount._getAriaLabelText());
			oRm.writeAttribute("tabindex", "0");
			oRm.write(">");

			oRm.write("<div class=\"sapSuiteUiCommonsTAccountDropZoneTop\"></div>");
			oRm.write("<div class=\"sapSuiteUiCommonsTAccountDropZoneBottom\"></div>");

			oRm.write("<div class=\"sapSuiteUiCommonsTAccountInfoIconWrapper sapSuiteUiCommonsTAccountBaseInfoIconWrapper\" aria-labelledby=\"" + oAccount.getId() + "-mark-text\" title=\"" + oResourceBundle.getText("TACCOUNT_SELECTED") + "\">");
			oRm.renderControl(oAccount._getAriaMarkText());
			oRm.write("<div class=\"sapSuiteUiCommonsInfoIcon\">");

			oRm.write("!");

			oRm.write("</div>");
			oRm.write("</div>");

			// header
			oRm.write("<div class=\"sapSuiteUiCommonsAccountHeader\">");
			oRm.write("<div class=\"sapSuiteUiCommonsAccountHeaderFirst\">");
			oRm.write("<div");
			oRm.addClass("sapSuiteUiCommonsAccountHeaderExpandWrapper");
			oRm.writeClasses();
			oRm.write(">");
			oRm.renderControl(oAccount._getDownArrow());
			oRm.write("</div>");

			var sTitleValue = encodeXML(oAccount.getTitle()).replace(/&#xa;|\n/g, "<br>");
			if (oAccount.getSubtitle()) {
				var sSubtitleValue = encodeXML(oAccount.getSubtitle()).replace(/&#xa;|\n/g, "<br>");
				oRm.write("<div class=\"sapSuiteUiCommonsAccountHeaderTitleWrapper\">");
				oRm.write("<div id=\"" + oAccount.getId() + "-title" + "\" class=\"sapSuiteUiCommonsAccountHeaderTitleWithSubtitle\">" + sTitleValue + "</div>");
				oRm.write("<div class=\"sapSuiteUiCommonsAccountHeaderSubtitle\">" + sSubtitleValue + "</div>");
				oRm.write("</div>");
			} else {
				oRm.write("<span id=\"" + oAccount.getId() + "-title" + "\" class=\"sapSuiteUiCommonsAccountHeaderTitle\">" + sTitleValue + "</span>");
			}

			oRm.write("</div>");
			oRm.write("<div class=\"sapSuiteUiCommonsAccountHeaderSecond\">");
			oRm.write("<span id=\"" + oAccount.getId() + "-sum" + "\" class=\"sapSuiteUiCommonsAccountHeaderSUM\">" + oAccount._getSumText() + "</span>");
			oRm.write("</div>");
			oRm.write("</div>");

			// sub-header
			oRm.write("<div id=\"" + oAccount.getId() + "-content" + "\" class=\"sapSuiteUiCommonsAccountTWrapper\"");
			if (oAccount.getCollapsed()) {
				oRm.write("style=\"display:none\"");
			}

			oRm.write(">");

			if (bHasData || oAccount.getOpening()) {
				oRm.write("<div");
				oRm.addClass("sapSuiteUiCommonsAccountTHeader");
				if (oAccount.getOpening()) {
					oRm.addClass("sapSuiteUiCommonsAccountTHeaderOpening");
				}

				oRm.writeClasses();
				oRm.write(">");
				oRm.write("<span id=\"" + oAccount.getId() + "-debit-text" + "\" class=\"sapSuiteUiCommonsAccountTHeaderTitle\">" + oResourceBundle.getText("TACCOUNT_DEBIT") + "</span>");
				oRm.write("<span id=\"" + oAccount.getId() + "-credit-text" + "\" class=\"sapSuiteUiCommonsAccountTHeaderTitle\">" + oResourceBundle.getText("TACCOUNT_CREDIT") + "</span>");
				oRm.write("</div>");

				// body
				if (bHasData) {
					if (oAccount.getOpening()) {
						oRm.write("<div class=\"sapSuiteUiCommonsAccountOpeningHeader\">");
						oRm.write("<span id=\"" + oAccount.getId() + "-opening-debit-text" + "\" class=\"sapSuiteUiCommonsAccountTHeaderOpeningDebitTitle\">" + sOpeningDebit + " " + sUnit + "</span>");
						oRm.write("<span id=\"" + oAccount.getId() + "-opening-credit-text" + "\" class=\"sapSuiteUiCommonsAccountTHeaderOpeningCreditTitle\">" + sOpeningCredit + " " + sUnit + "</span>");
						oRm.write("</div>");
					}

					oRm.write("<div class=\"sapSuiteUiCommonsAccountTBody\"");
					oRm.writeAttribute("role", "listbox");
					oRm.write(">");

					if (oAccount._isOrdered()) {
						oRm.write("<div class=\"sapSuiteUiCommonsAccountDebitCredit\"");
						oRm.writeAttribute("role", "listbox");
						oRm.writeAttribute("aria-labelledby", oAccount.getId() + "-debit-text " + oAccount.getId() + "-credit-text");
						oRm.write(">");
						oRm.write("<div class=\"sapSuiteUiCommonsAccountMiddleBorder\"></div>");
						fnWriteOrderedColumn(oAccount.getDebit().concat(oAccount.getCredit()));
					} else {
						oRm.write("<div class=\"sapSuiteUiCommonsAccountDebit\"");
						oRm.writeAttribute("role", "listbox");
						oRm.writeAttribute("aria-labelledby", oAccount.getId() + "-debit-text");
						oRm.write(">");
						fnWriteColumn(oAccount.getDebit(), true);
					}
					oRm.write("</div>");

					if (!oAccount._isOrdered()) {
						oRm.write("<div class=\"sapSuiteUiCommonsAccountCredit\"");
						oRm.writeAttribute("role", "listbox");
						oRm.writeAttribute("aria-labelledby", oAccount.getId() + "-credit-text");
						oRm.write(">");
						fnWriteColumn(oAccount.getCredit(), false);
						oRm.write("</div>");
					}

					oRm.write("</div>");
				}
			} else {
				oRm.write("<div class=\"sapSuiteUiCommonsAccountNoData\">");
				oRm.write(oResourceBundle.getText("TACCOUNT_NO_DATA"));
				oRm.write("</div>");
			}

			if (oAccount.getOpening()) {
				oRm.write("<div class=\"sapSuiteUiCommonsAccountClosingHeaderLine\"></div>");
				oRm.write("<div class=\"sapSuiteUiCommonsAccountClosingHeader\">");
				oRm.write("<span id=\"" + oAccount.getId() + "-closing-debit-text" + "\" class=\"sapSuiteUiCommonsAccountTHeaderOpeningDebitTitle\">" + fnCountBalance(true) + " " + sUnit + "</span>");
				oRm.write("<span id=\"" + oAccount.getId() + "-closing-credit-text" + "\" class=\"sapSuiteUiCommonsAccountTHeaderOpeningCreditTitle\">" + fnCountBalance(false) + " " + sUnit + "</span>");
				oRm.write("</div>");
			}

			oRm.write("</div>");
			oRm.write("</div>");
		}
	});

	/* =========================================================== */
	/* Events													   */
	/* =========================================================== */
	TAccount.prototype.onBeforeRendering = function () {
		this._bRendered = false;
		this._iOldSum = this._iSum;
		this._iSum = null;
	};

	TAccount.prototype.onAfterRendering = function () {
		var oParent = this.getParent();

		this._bRendered = true;

		this._setupDraggable();
		this._setupKeyboard();

		if (oParent && this._hasGroupParent(oParent)) {
			if (!oParent._bRendered) {
				oParent.addEventDelegate({
					onAfterRendering: this._setupTooltips.bind(this)
				});
			}

			// sum data may be somehow manupulated (by adding or removing items) we have to let group know
			if (oParent._bRendered && this._iOldSum != null) {
				var iDiff = this._iSum - this._iOldSum;
				oParent._valueChanged(iDiff);
			}
		} else {
			this._setupTooltips();
		}
		this.$().find(".sapSuiteUiCommonsAccountGroupCollapseIcon").attr("aria-pressed", !this.getCollapsed());
	};

	TAccount.prototype.onsapdownmodifiers = function (oEvent) {
		if (oEvent[sControlKeyName]) {
			this._handleArrowMoveEvent(oEvent, Direction.DOWN);
		}
	};

	TAccount.prototype.onsapupmodifiers = function (oEvent) {
		if (oEvent[sControlKeyName]) {
			this._handleArrowMoveEvent(oEvent, Direction.UP);
		}
	};

	TAccount.prototype.onsappreviousmodifiers = function (oEvent) {
		if (oEvent[sControlKeyName]) {
			this._handleArrowMoveEvent(oEvent, Direction.PREVIOUS);
		}
	};

	TAccount.prototype.onsapnextmodifiers = function (oEvent) {
		if (oEvent[sControlKeyName]) {
			this._handleArrowMoveEvent(oEvent, Direction.NEXT);
		}
	};

	/* =========================================================== */
	/* Public methods											   */
	/* =========================================================== */
	/**
	 * Resets the internal state of the T account.
	 * @since 1.68
	 * @public
	 */
	TAccount.prototype.reset = function () {
		this._oSum = null;
	};

	/* =========================================================== */
	/* Private methods											   */
	/* =========================================================== */
	TAccount.prototype._isOrdered = function () {
		return !!this.getOrderBy();
	};

	TAccount.prototype._setupKeyboard = function () {
		if (!this._oItemNavigation) {
			this._oItemNavigation = new ItemNavigation();
			this.addDelegate(this._oItemNavigation);
		}

		this._oItemNavigation.setRootDomRef(this.$().find(".sapSuiteUiCommonsAccountTBody")[0]);
		this._oItemNavigation.setItemDomRefs(this.$().find(".sapSuiteUiCommonsAccountItem"));
		this._oItemNavigation.setCycling(true);
	};

	TAccount.prototype._isInGroup = function () {
		return this.getParent() instanceof TAccountGroup;
	};

	TAccount.prototype._setupDraggable = function () {
		if (this._isInGroup()) {
			var $this = this.$(),
				oParent = this.getParent();

			// check whether parent is group
			$this.draggable({
				revert: "invalid",
				delay: 100,
				helper: function () {
					return $this.clone().width($this.width()).css("z-index", 500);
				},
				opacity: 0.6,
				scope: oParent.getId() + "-content",
				handle: ".sapSuiteUiCommonsAccountHeader",
				start: function () {
					$this.addClass("sapSuiteUiCommonsAccountItemDragging");
					oParent.$().find(".sapSuiteUiCommonsAccountGroupDroppingArea").addClass("sapSuiteUiCommonsAccountGroupDroppingAreaHighlight");
					oParent.$().find(".sapSuiteUiCommonsAccountHeader").css("cursor", "grabbing");
				},
				stop: function () {
					$this.removeClass("sapSuiteUiCommonsAccountItemDragging");
					oParent.$().find(".sapSuiteUiCommonsAccountGroupDroppingArea").removeClass("sapSuiteUiCommonsAccountGroupDroppingAreaHighlight");
					oParent.$().find(".sapSuiteUiCommonsAccountHeader").css("cursor", "grab");
				}
			});

			Utils._setupMobileDraggable($this);
		}
	};

	TAccount.prototype._setItemsAttrs = function (aConcatItems) {
		aConcatItems.forEach(function (oItem, i) {
			oItem._index = i + 1;
			oItem._indexSize = aConcatItems.length;
		});

		this.getDebit().forEach(function (oItem) {
			oItem._bIsDebit = true;
		});
	};

	TAccount.prototype._getExpandAltText = function (bCollapse) {
		return (bCollapse ? oResourceBundle.getText("TACCOUNT_COLLAPSE") : oResourceBundle.getText("TACCOUNT_EXPAND")) + " " + oResourceBundle.getText("TACCOUNT_TITLE");
	};

	TAccount.prototype._getDownArrow = function () {
		var bCollapsed = this.getCollapsed();
		if (!this._oArrowDown) {
			this._oArrowDown = new Icon({
				alt: this._getExpandAltText(!bCollapsed),
				tooltip: this._getExpandAltText(!bCollapsed),
				decorative: false,
				src: !bCollapsed ? "sap-icon://navigation-right-arrow" : "sap-icon://navigation-down-arrow",
				press: function () {
					this.setCollapsed(!this.getCollapsed());
				}.bind(this)
			}).addStyleClass("sapSuiteUiCommonsAccountGroupCollapseIcon");
		}
		this._oArrowDown.$().attr("aria-pressed", !this.getCollapsed());
		return this._oArrowDown;
	};

	TAccount.prototype._getAriaMarkText = function () {
		if (!this._oMarkText) {
			this._oMarkText = new InvisibleText({
					id: this.getId() + "-mark-text",
					text: oResourceBundle.getText("TACCOUNT_SELECTED")
				}
			);
			this.addDependent(this._oMarkText);
		}
		return this._oMarkText;
	};

	TAccount.prototype._getSum = function () {
		if (this._iSum == null) {
			var iSum = 0;
			this.getCredit().forEach(function (oItem) {
				iSum += oItem.getValue();
			});

			this.getDebit().forEach(function (oItem) {
				iSum -= oItem.getValue();
			});

			if (this.getOpening()) {
				iSum += this.getOpeningCredit();
				iSum -= this.getOpeningDebit();
			}

			this._iSum = iSum;
		}

		return this._iSum;
	};

	TAccount.prototype._getAriaLabelText = function () {
		return "T account " + this.getTitle() + " " + this._getSumText();
	};

	TAccount.prototype._getSumText = function () {
		var sCurrency = this.getMeasureOfUnit(),
			sValue = TAccountUtils.formatCurrency(Math.abs(this._getSum()), sCurrency);

		return (this._getSum() > 0 ? oResourceBundle.getText("TACCOUNT_CREDIT") : oResourceBundle.getText("TACCOUNT_DEBIT")) + ": " + sValue + " " + encodeXML(sCurrency);
	};

	TAccount.prototype._valueChanged = function (iDiff) {
		if (this._bRendered) {
			this._iSum = this._getSum() + iDiff;
			this.$("sum").text(this._getSumText());

			var oParent = this.getParent();
			if (this._hasGroupParent(oParent)) {
				oParent._valueChanged(iDiff);
			}
		}
	};

	TAccount.prototype._hasGroupParent = function (oParent) {
		return (oParent || this.getParent()) instanceof TAccountGroup;
	};

	TAccount.prototype._handleArrowMoveEvent = function (oEvent, oDirection) {
		this._moveTAccount(oDirection);

		// stop ItemNavigation and stop previous/next arrow event that is fired after up/down arrow event
		oEvent.preventDefault();
		oEvent.stopImmediatePropagation();
	};

	TAccount.prototype._moveTAccount = function (oDirection) {
		var $dropArea, $nextAccount, $nextGroup, aMoveFunctionSet,
			bIsDirectionUp = oDirection === Direction.UP,
			bSetFocus = true,
			$this = this.$();

		var fnMoveToGroup = function (sAddFunction) {
			if ($nextGroup.length === 0) {
				bSetFocus = false;
				return;
			}

			$this.detach();
			$dropArea.detach();
			$nextGroup[sAddFunction]($this);
			$nextGroup[sAddFunction]($dropArea);
		};

		if (bIsDirectionUp || oDirection === Direction.DOWN) {
			aMoveFunctionSet = bIsDirectionUp ? ["next", "prev", "insertBefore", "append"] : ["prev", "next", "insertAfter", "prepend"];
			$dropArea = $this[aMoveFunctionSet[0]](".sapSuiteUiCommonsAccountGroupDroppingArea");
			$nextAccount = $this[aMoveFunctionSet[1]]()[aMoveFunctionSet[1]](".sapSuiteUiCommonsAccount");

			if ($nextAccount.length !== 0) {
				$this.detach()[aMoveFunctionSet[2]]($nextAccount);
				$dropArea.detach()[aMoveFunctionSet[2]]($nextAccount);
			} else {
				$nextGroup = $this.parent()[aMoveFunctionSet[1]](".sapSuiteUiCommonsAccountGroupColumn");
				fnMoveToGroup(aMoveFunctionSet[3]);
			}
		} else {
			$dropArea = $this.prev(".sapSuiteUiCommonsAccountGroupDroppingArea");
			$nextGroup = $this.parent()[oDirection === Direction.NEXT ? "next" : "prev"](".sapSuiteUiCommonsAccountGroupColumn");
			fnMoveToGroup("append");
		}

		if (bSetFocus) {
			// set correct focus order
			$this.focus();
		}
	};

	TAccount.prototype._setControlKeyName = function (sKeyName) {
		sControlKeyName = sKeyName;
	};

	TAccount.prototype._setupTooltips = function () {
		var fnCheckTooltip = function (sClass) {
			var oElement = this.$().find(sClass);

			if (oElement[0] && oElement[0].clientHeight < oElement[0].scrollHeight) {
				oElement.attr("title", oElement.html());
			}
		}.bind(this);

		if (this.getSubtitle()) {
			fnCheckTooltip(".sapSuiteUiCommonsAccountHeaderTitleWithSubtitle");
			fnCheckTooltip(".sapSuiteUiCommonsAccountHeaderSubtitle");
		} else {
			fnCheckTooltip(".sapSuiteUiCommonsAccountHeaderTitle");
		}
	};

	TAccount.prototype.updateBindingContext = function () {
		this.reset();
		return Control.prototype.updateBindingContext.apply(this, arguments);
	};

	/* =========================================================== */
	/* Properties												   */
	/* =========================================================== */
	TAccount.prototype.setMeasureOfUnit = function (sValue) {
		// first set up property without invalidation (it's important for parent calculations)
		this.setProperty("measureOfUnit", sValue, true);

		if (this._bRendered) {
			this.$("sum").text(this._getSumText());

			var oParent = this.getParent();
			if (this._hasGroupParent(oParent)) {
				oParent._measureChanged(sValue);
			}
		}

		// invalidate at the end as the items has extension created from measure
		this.invalidate();
		return this;
	};

	TAccount.prototype.invalidate = function () {
		this._bRendered = false;
		Control.prototype.invalidate.apply(this, arguments);
	};

	TAccount.prototype.setCollapsed = function (bValue) {
		this.setProperty("collapsed", bValue, true);

		var sText = this._getExpandAltText(!bValue);

		this._getDownArrow().setTooltip(sText);
		this._getDownArrow().$().attr("aria-label", sText);
		this._getDownArrow().setSrc(!bValue ? "sap-icon://navigation-down-arrow" : "sap-icon://navigation-right-arrow");
		this.$()[bValue ? "addClass" : "removeClass"]("sapSuiteUiCommonsAccountCollapsed");
		this.$().find(".sapSuiteUiCommonsAccountGroupCollapseIcon").attr("aria-pressed", !bValue);

		if (this.getDomRef()) {
			this.$("content")[bValue ? "hide" : "show"]("medium");
		}

		return this;
	};

	return TAccount;

});
