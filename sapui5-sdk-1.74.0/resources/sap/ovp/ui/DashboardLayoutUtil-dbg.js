sap.ui.define([
	"sap/ovp/ui/DashboardLayoutRearrange",
	"sap/ovp/ui/DashboardLayoutModel",
    "sap/ovp/cards/CommonUtils",
    "sap/ui/Device",
    "sap/ui/thirdparty/jquery",
    "sap/base/Log"
], function(Rearrange, DashboardLayoutModel, CommonUtils, Device, jQuery, Log) {
	"use strict";
	var DashboardLayoutUtil = function(uiModel) {
        this.aCards = null;
        this.ROW_HEIGHT_PX = 16; //176;
        this.MIN_COL_WIDTH_PX = 320;
        this.CARD_BORDER_PX = 8; //--> css class .sapOvpDashboardLayoutItem
        this.EXTRA_MARGIN = 8; //dynamicpageheader had 8px less margin
        this.oLayoutData = {
            layoutWidthPx: 1680,
            contentWidthPx: 1600,
            colCount: 5,
            previousColCount: 0,
            colWidthPx: this.MIN_COL_WIDTH_PX,
            rowHeightPx: this.ROW_HEIGHT_PX,
            marginPx: this.convertRemToPx(3) - this.CARD_BORDER_PX
        };
        this.dashboardLayoutModel = new DashboardLayoutModel(uiModel, this.oLayoutData.colCount, this.ROW_HEIGHT_PX, this.CARD_BORDER_PX);
		this.layoutDomId = "";
		this.oLayoutCtrl = {};
		this.componentDomId = "";
		this.lastTriggeredColWidth = 0.0;
        this.changedCards = {};
        this.isRTLEnabled = sap.ui.getCore().getConfiguration().getRTL();
        switch (true) {
            case Device.browser.webkit:
                this.cssVendorTransition = "-webkit-transition";
                this.cssVendorTransform = "-webkit-transform";
                break;
            case Device.browser.msie:
                this.cssVendorTransition = "-ms-transition";
                this.cssVendorTransform = "-ms-transform";
                break;
            case Device.browser.mozilla:
                this.cssVendorTransition = "-moz-transition";
                this.cssVendorTransform = "-moz-transform";
                break;
            default:
                this.cssVendorTransition = "transition";
                this.cssVendorTransform = "transform";
        }
	};

	DashboardLayoutUtil.prototype.setLayout = function(layout) {
		this.oLayoutCtrl = layout;
		this.layoutDomId = layout.getId();
		this.componentDomId = this.layoutDomId.split("--")[0];
	};

	DashboardLayoutUtil.prototype.getDashboardLayoutModel = function() {
		return this.dashboardLayoutModel;
	};

	DashboardLayoutUtil.prototype.updateCardVisibility = function(aChgCards) {
		this.dashboardLayoutModel.updateCardVisibility(aChgCards);
		this.aCards = this.dashboardLayoutModel.getCards(this.oLayoutData.colCount);
        this.dashboardLayoutModel._removeSpaceBeforeCard();
		this._setCardsCssValues(this.aCards);
        this._positionCards(this.aCards);
	};

	DashboardLayoutUtil.prototype.updateLayoutData = function(iDashboardWidth) {
		var iDashboardMargin = this.oLayoutData.marginPx,
			iExtraSpaceForDesktop = 0,
			iSmallScreenWidth = 320,
			iMiddleScreenWidth = 1024,
			iCardMargin = this.CARD_BORDER_PX,
			iMargin = this.EXTRA_MARGIN,
			iNewScreenWidth = iDashboardWidth + iDashboardMargin,
			iDashboardMarginLeft,
			iDashboardMarginRight; //iDashboardWidth is without left margin
		this.oLayoutData.layoutWidthPx = iDashboardWidth;

		if (iNewScreenWidth <= iSmallScreenWidth) {
			iDashboardMargin = this.convertRemToPx(0.5) - iCardMargin;
			iExtraSpaceForDesktop = Device.system.desktop ? 16 : 0; //considering vertical scrollbar on the desktop
		} else if (iNewScreenWidth <= iMiddleScreenWidth) {
			iDashboardMargin = this.convertRemToPx(1) - iCardMargin;
			iExtraSpaceForDesktop = Device.system.desktop ? 8 : 0;
		} else {
			iDashboardMargin = this.convertRemToPx(3) - iCardMargin;
		}
		if (iDashboardMargin !== this.oLayoutData.marginPx) {
			this.oLayoutData.marginPx = iDashboardMargin;
			jQuery(".sapUshellEasyScanLayout").css({
				"margin-left": iDashboardMargin + "px"
			});
		}

		//calculates content width excluding symmetric margin space on the right
		//and the extra space for vertical scrollbar on the desktop
		this.oLayoutData.contentWidthPx = iDashboardWidth - iDashboardMargin - iExtraSpaceForDesktop;
        this.oLayoutData.previousColCount = this.oLayoutData.colCount;
		this.oLayoutData.colCount = Math.round(this.oLayoutData.contentWidthPx / this.MIN_COL_WIDTH_PX);
		if (this.oLayoutData.colCount === 0) {
			this.oLayoutData.colCount = 1;
		}
		this.oLayoutData.colWidthPx = this.oLayoutData.contentWidthPx / this.oLayoutData.colCount;
		if (jQuery(".sapOvpDashboardDragAndDrop").length > 0 && jQuery(".easyScanLayoutItemWrapper").length > 0) {
            iDashboardMarginLeft = jQuery(".sapOvpDashboardDragAndDrop")[0].offsetLeft + iMargin;
            if (jQuery(".sapOvpDashboardDragAndDrop")[0].offsetLeft < 40) {
                iDashboardMarginRight = iDashboardMarginLeft + 8;
            } else {
                iDashboardMarginRight = iDashboardMarginLeft;
            }
        } else {
            iDashboardMarginLeft = iDashboardMargin + iMargin;
            iDashboardMarginRight = iDashboardMargin + iExtraSpaceForDesktop + iMargin;
        }
		jQuery('.sapFDynamicPageTitle').css({"margin-left": iDashboardMarginLeft + "px", "margin-right": iDashboardMarginRight + "px","visibility": "visible"});
		jQuery('.sapFDynamicPageHeader').css({"margin-left": iDashboardMarginLeft + "px", "margin-right": iDashboardMarginRight + "px"});

		return this.oLayoutData;
	};

	DashboardLayoutUtil.prototype.getRearrange = function(settings) {
		var defaultSettings = {
			containerSelector: ".sapUshellEasyScanLayoutInner",
			wrapper: ".sapUshellEasyScanLayout",
			draggableSelector: ".easyScanLayoutItemWrapper",
			placeHolderClass: "dashboardLayoutItemWrapper-placeHolder",
			cloneClass: "easyScanLayoutItemWrapperClone",
			moveTolerance: 10,
			switchModeDelay: 500,
			isTouch: !Device.system.desktop,
			debug: false,
			aCards: this.aCards,
			layoutUtil: this,
			rowHeight: this.oLayoutData.rowHeightPx,
			colWidth: this.oLayoutData.colWidthPx
		};
		return new Rearrange(jQuery.extend(true, defaultSettings, settings));
	};

    /**
     * Method called upon when the window is resized
     *
     * @method resizeLayout
     * @param {Int} iWidth - layout width in pixel
     */
    DashboardLayoutUtil.prototype.resizeLayout = function (iWidth) {
        var iBeforeCol = this.oLayoutData.colCount;
        var bTriggerResize = false;
        if (this.oLayoutData.layoutWidthPx !== iWidth) {
            this.updateLayoutData(iWidth);
            bTriggerResize = Math.abs(this.lastTriggeredColWidth - this.oLayoutData.colWidthPx) > this.convertRemToPx(0.5);
            // column width can grow pixel by pixel --> render even if number of columns stays same
            this.aCards = this.dashboardLayoutModel.getCards(this.oLayoutData.colCount);
            for (var i = 0; i < this.aCards.length; i++) {
                //re-set css values for current card
                var oCard = this.aCards[i];
                this.setCardCssValues(oCard);
                var element = document.getElementById(this.getCardDomId(oCard.id));
                if (element) {
                    element.style.width = oCard.dashboardLayout.width;
                    element.style.height = oCard.dashboardLayout.height;
                    //If there is change in column then there should be animation for card movement else not
                    if (iBeforeCol !== this.oLayoutData.colCount) {
                        element.style[this.cssVendorTransition] = 'all 0.25s ease';
                    } else {
                        element.style[this.cssVendorTransition] = '';
                    }
                    element.style[this.cssVendorTransform] = 'translate3d(' + oCard.dashboardLayout.left + ' ,' + oCard.dashboardLayout.top + ', 0px)';
                    this.setKpiNumericContentWidth(element);
                }
                if (iBeforeCol !== this.oLayoutData.colCount && bTriggerResize) {
                    //if number of columns changed --> trigger card resize
                    this._triggerCardResize(oCard);
                }
            }
            this.dashboardLayoutModel._removeSpaceBeforeCard();
            this.oLayoutCtrl.fireAfterDragEnds();
            if (bTriggerResize) {
                this.lastTriggeredColWidth = this.oLayoutData.colWidthPx;
            }
        }
    };

	/**
	 * get cards for specified number of columns
	 *
	 * @method getCards
	 * @param {Int} iColCount - number of columns
	 * @returns {Array} cards
	 */
	DashboardLayoutUtil.prototype.getCards = function(iColCount) {
		if (this.aCards && this.oLayoutData.previousColCount === iColCount) {
			return this.aCards;
		}
		this._setColCount(iColCount);
		this.aCards = this.dashboardLayoutModel.getCards(iColCount);
		this._setCardsCssValues(this.aCards);
		return this.aCards;
	};

	DashboardLayoutUtil.prototype.resetToManifest = function() {
		this.aCards = [];
		this.dashboardLayoutModel.resetToManifest();
	};

    /**
     * get card at pixel position in it's container
     *
     * @method getCardDomId
     * @param {String} cardId - ID of a card
     * @returns {String} card dom id
     */
    DashboardLayoutUtil.prototype.getCardDomId = function (cardId) {
        // card00 --> mainView--ovpLayout--card00
        return this.layoutDomId + "--" + cardId;
    };

    /**
     * get the manifest id of the card from the HTML DOM id of the card
     *
     * @method getCardId
     * @param {String} cardDomId - card dom id
     * @returns {String}  manifest id of the card
     */
    DashboardLayoutUtil.prototype.getCardId = function (cardDomId) {
        // mainView--ovpLayout--card00 --> card00
        return cardDomId ? cardDomId.split("--")[2] : '';
    };

    /**
     * get the manifest id of the card from the card component id
     *
     * @method getCardIdFromComponent
     * @param {String} cardComponentId - card component id
     * @returns {String}  manifest id of the card
     */
    DashboardLayoutUtil.prototype.getCardIdFromComponent = function (cardComponentId) {
        // mainView--card00 --> card00
        return cardComponentId ? cardComponentId.split("--")[1] : '';
    };

	DashboardLayoutUtil.prototype.isCardAutoSpan = function(cardId) {
		return this.dashboardLayoutModel.getCardById(cardId).dashboardLayout.autoSpan;
	};

    /**
     * Method called to increase the height of the card automatically on initial load(auto span is true)
     *
     * @method setAutoCardSpanHeight
     * @param {Object} evt - event object from resize handler
     * @param {String} cardId - id of the card which is to be resized
     * @param {Number} height - height of the card
     */
    DashboardLayoutUtil.prototype.setAutoCardSpanHeight = function (evt, cardId, height) {
        var iRows, layoutChanges, oCard;
        if (!cardId && evt && evt.target.parentElement) {
            cardId = evt.target.parentElement.parentElement.id.split("--")[1];
        }
        var iHeight = height;
        if (!iHeight && evt) {
            iHeight = evt.size.height;
        }

        //verify that card is autoSpan and resize it
        if (this.isCardAutoSpan(cardId)) {
            oCard = this.dashboardLayoutModel.getCardById(cardId);
            if (oCard.dashboardLayout.showOnlyHeader) {
                iRows = Math.ceil((iHeight + 2 * this.CARD_BORDER_PX) / this.getRowHeightPx());
            } else {
                iRows = Math.round((iHeight + 2 * this.CARD_BORDER_PX) / this.getRowHeightPx());
            }
            //resizeCard mathod called upon on first time loading
            layoutChanges = this.dashboardLayoutModel.resizeCard(cardId, {
                rowSpan: iRows,
                colSpan: 1
            }, /*manual resize*/ false);
            this._sizeCard(layoutChanges.resizeCard);
            this._positionCards(layoutChanges.affectedCards);
        }
    };

    /**
     * Method called for calculating different parameters of card for resize
     *
     * @method calculateCardProperties
     * @param {string} sCardId - card id
     * @returns {Object} object - object which returns the properties like Header / Dropdown / Item height / Minimum card height / Least card height
     */
    DashboardLayoutUtil.prototype.calculateCardProperties = function (sCardId) {
        var oGenCardCtrl = this._getCardController(sCardId);
        var oCard = this.dashboardLayoutModel.getCardById(sCardId);
        var iChartHeight = 250, iHeaderHeight, iDropDownHeight, iLineItemHeight, minCardHeight, iHeight;
        if (oGenCardCtrl) {
            iHeight = oGenCardCtrl.getItemHeight(oGenCardCtrl, 'ovpCardHeader');
            iHeaderHeight = iHeight === 0 ? oCard.dashboardLayout.headerHeight : iHeight;
            iDropDownHeight = oGenCardCtrl.getItemHeight(oGenCardCtrl, 'toolbar');
            if (oCard.template === 'sap.ovp.cards.list') {
                iHeight = oGenCardCtrl.getItemHeight(oGenCardCtrl, 'ovpList', true);
                iLineItemHeight = iHeight === 0 ? oCard.dashboardLayout.itemHeight : iHeight;
                minCardHeight = iHeaderHeight + iDropDownHeight + iLineItemHeight;
            } else if (oCard.template === 'sap.ovp.cards.table') {
                iLineItemHeight = oCard.dashboardLayout.itemHeight;
                minCardHeight = iHeaderHeight + iDropDownHeight + 2 * iLineItemHeight;
            } else if (oCard.template === 'sap.ovp.cards.linklist') {
                if (oCard.settings.listFlavor === 'carousel') {
                    minCardHeight = iHeaderHeight + jQuery('.sapOvpCarouselContentHeader').outerHeight() + 240 + jQuery('.sapMCrslControlsBottom.sapMCrslControls').outerHeight();
                } else {
                    //For link list card Minimum height = header height + item height + upperListPadding
                    iLineItemHeight = oGenCardCtrl.getItemHeight(oGenCardCtrl, 'ovpLinkList', true);
                    var densityType = oGenCardCtrl.getView().getModel('ovpCardProperties').getProperty('/densityStyle');
                    if (densityType === 'cozy') {
                        minCardHeight = iHeaderHeight + iDropDownHeight + iLineItemHeight + 8; //8px padding for 'cozy' mode
                    } else {
                        minCardHeight = iHeaderHeight + iDropDownHeight + iLineItemHeight + 4; //4px padding for 'compact' mode
                    }
                }
            } else if (oCard.template === 'sap.ovp.cards.charts.analytical') {
                var iBubbleTextHeight = oGenCardCtrl.getView().byId('bubbleText') ? 43 : 0;
                minCardHeight = iHeaderHeight + iDropDownHeight + iChartHeight + iBubbleTextHeight + 50; //20px is the text height + 14px is the top padding + 16px is the chart top margin
            } else {
                //Else header height + dropdown height
                minCardHeight = iHeaderHeight + iDropDownHeight;
            }
            return {
                headerHeight: iHeaderHeight,
                dropDownHeight: iDropDownHeight,
                itemHeight: iLineItemHeight,
                minCardHeight: minCardHeight,
                leastHeight: iHeaderHeight
            };
        }
    };

	DashboardLayoutUtil.prototype._sizeCard = function(oCard) {
		if (!oCard) {
			return;
		}
        var $card = document.getElementById(this.getCardDomId(oCard.id));
        oCard.dashboardLayout.width = oCard.dashboardLayout.colSpan * this.oLayoutData.colWidthPx + "px";
        oCard.dashboardLayout.height = oCard.dashboardLayout.rowSpan * this.oLayoutData.rowHeightPx + "px";
        if ($card) {
            $card.style.height = oCard.dashboardLayout.height;
            $card.style.width = oCard.dashboardLayout.width;
            this._triggerCardResize(oCard);
        }
        this.dashboardLayoutModel._removeSpaceBeforeCard();
        //Calculate the height of the container upon card resize
        var iContainerHeight = (this.dashboardLayoutModel._findHighestOccupiedRow() * this.ROW_HEIGHT_PX) + 32;
        jQuery(".sapUshellEasyScanLayoutInner").css({"height": iContainerHeight + "px"});
    };

    /**
     * Method to trigger the resize of card
     *
     * @method _triggerCardResize
     * @param {Object} oCard - object contains all resizable layout properties of card
     */
    DashboardLayoutUtil.prototype._triggerCardResize = function (oCard) {
        var cardLayout = oCard.dashboardLayout,
            cardId = oCard.id,
            cardComponentId = this._getCardComponentDomId(cardId),
            $card = document.getElementById(cardComponentId),
            oGenCardCtrl = this._getCardController(cardId),
            cardSizeProperties, oCardBinding, iContainerHeight;
        try {
            if ((cardLayout.autoSpan || !cardLayout.visible) && oGenCardCtrl) {
                //no trigger for autoSpan and hidden cards
                oCardBinding = oGenCardCtrl.getCardItemsBinding();
                cardSizeProperties = this.calculateCardProperties(cardId);
                if (oCardBinding && cardSizeProperties) {
                    var iNoOfItems = oCardBinding.getLength();
                    var itemLength = iNoOfItems ? Math.min(iNoOfItems, oCard.dashboardLayout.noOfItems) : oCard.dashboardLayout.noOfItems;
                    var iActualNoOfItems = (iNoOfItems === 0) ? oCard.dashboardLayout.noOfItems : itemLength;
                    var iCardHeight = cardLayout.rowSpan * this.ROW_HEIGHT_PX;
                    var iAvailableSpace = iCardHeight - (cardSizeProperties.headerHeight + 2 * this.CARD_BORDER_PX);
                    //var $CardContentContainer = $card.getElementsByClassName('sapOvpWrapper')[0];
                    if (oCard.template === 'sap.ovp.cards.table') {
                        //Table card has the header also. So it's included in height calculation
                        //iContainerHeight = (iActualNoOfItems + 1) * cardSizeProperties.itemHeight + cardSizeProperties.dropDownHeight;
                        oGenCardCtrl.addColumnInTable($card, cardLayout);
                    } else if (oCard.template === 'sap.ovp.cards.list') {
                        iContainerHeight = iActualNoOfItems * cardSizeProperties.itemHeight + cardSizeProperties.dropDownHeight;
                        $card.style.height = Math.min(iContainerHeight, iAvailableSpace) + oCard.dashboardLayout.headerHeight + "px";
                    }
                }
                return;
            }
        } catch (error) {
            Log.warning("Card auto span failed for card " + cardId + " and error is  " + error.toString());
        }
        //set height px data and layout (compatibility to card property model)
        cardLayout.iRowHeightPx = this.getRowHeightPx();
        cardLayout.iCardBorderPx = this.CARD_BORDER_PX;
        try {
            if (oGenCardCtrl) {
                cardSizeProperties = this.calculateCardProperties(cardId);
                oGenCardCtrl.resizeCard(cardLayout, cardSizeProperties);
            } else {
                Log.warning("OVP resize: no controller found for " + cardId);
            }
        } catch (err) {
            Log.warning("OVP resize: " + cardId + " catch " + err.toString());
        }
    };

    /**
     * Method to position the cards according to the layout value
     *
     * @method _positionCards
     * @param {Array} aCards - array of objects each one containing the resizable layout properties of card
     */
    DashboardLayoutUtil.prototype._positionCards = function (aCards) {
        if (!aCards) {
            return;
        }
        var pos = {}, bSideCard = false;
        aCards.forEach(function (oCardObj) {
            if (!oCardObj.dashboardLayout.visible) {
                return; //skip invisible cards
            }
            pos = this._mapGridToPositionPx(oCardObj.dashboardLayout);
            oCardObj.dashboardLayout.top = pos.top;
            oCardObj.dashboardLayout.left = pos.left;
            var element = document.getElementById(this.getCardDomId(oCardObj.id));
            if (element) {
                element.classList.remove('sapOvpNotResizableLeftRight', 'sapOvpNotResizableRight', 'sapOvpNotResizableDown');
                element.style[this.cssVendorTransition] = 'all 0.15s ease';
                element.style[this.cssVendorTransform] = 'translate3d(' + pos.left + ' ,' + pos.top + ', 0px)';
                bSideCard = oCardObj.dashboardLayout.column + oCardObj.dashboardLayout.colSpan === this.oLayoutData.colCount + 1;
                if (bSideCard) {
                    if (oCardObj.dashboardLayout.colSpan === 1) {
                        element.classList.add('sapOvpNotResizableLeftRight');
                    } else {
                        element.classList.add('sapOvpNotResizableRight');
                    }
                }
                if ((oCardObj.template === "sap.ovp.cards.list" && oCardObj.dashboardLayout.colSpan === 2) ||
                    (oCardObj.template === "sap.ovp.cards.linklist" && oCardObj.settings.listFlavor === 'carousel' && oCardObj.dashboardLayout.colSpan === 3)) {
                    element.classList.add('sapOvpNotResizableRight');
                }
                if (oCardObj.template === "sap.ovp.cards.linklist" && oCardObj.settings.listFlavor === 'carousel' && oCardObj.dashboardLayout.rowSpan === 45) {
                    element.classList.add('sapOvpNotResizableDown');
                }
            }
        }.bind(this));
    };

    DashboardLayoutUtil.prototype.updateCardSize = function (sCardId, ghostHeight, ghostWidth) {
        var oCard = this.dashboardLayoutModel.getCardById(sCardId);
        var oCardController = this._getCardController(sCardId);
        var $card = document.getElementById(this.getCardDomId(sCardId));
        $card.style.height = ghostHeight + 'px';
        $card.style.width = ghostWidth + 'px';
        $card.style[this.cssVendorTransition] = 'none';
        $card.style.zIndex = 10;
        if (oCard.template === 'sap.ovp.cards.linklist' && oCard.settings.listFlavor === 'carousel') {
            oCardController.getView().byId('pictureCarousel').$().css('height', ghostHeight - (oCard.dashboardLayout.headerHeight + 2 * this.CARD_BORDER_PX) + 'px');
        }
    };

	DashboardLayoutUtil.prototype.resizeCard = function(cardDomId, span, aDragOrResizeChange) {
		this.changedCards = this.dashboardLayoutModel.resizeCard(this.getCardId(cardDomId), span, /*manual resize*/ true, aDragOrResizeChange);
		this._positionCards(this.changedCards.affectedCards);
	};

	// map grid coords to position coords
	DashboardLayoutUtil.prototype._mapGridToPositionPx = function (gridPos) {
	    var iLeftValue = (gridPos.column - 1) * this.getColWidthPx();
	    var pos = {
	        top: (gridPos.row - 1) * this.getRowHeightPx() + "px",
	        left: (this.isRTLEnabled ? -iLeftValue : iLeftValue) + "px"
	    };
	    return pos;
	};

	DashboardLayoutUtil.prototype._getCardComponentDomId = function(cardId) {
		return this.componentDomId + "--" + cardId;
	};

    DashboardLayoutUtil.prototype._getCardController = function (cardId) {
        var oCtrl = null;
        var oComponent = sap.ui.getCore().byId(this._getCardComponentDomId(cardId));
        if (oComponent) {
            var oCompInst = oComponent.getComponentInstance();
            if (oCompInst) {
                oCtrl = oCompInst.getAggregation("rootControl").getController();
            }
        }
        return oCtrl;
    };

	DashboardLayoutUtil.prototype._setCardsCssValues = function(aCards) {
		var i = 0;
		for (i = 0; i < aCards.length; i++) {
			this.setCardCssValues(aCards[i]);
		}
	};

    DashboardLayoutUtil.prototype.setCardCssValues = function (oCard) {
        var iLeftValue = (oCard.dashboardLayout.column - 1) * this.oLayoutData.colWidthPx;
        oCard.dashboardLayout.top = ((oCard.dashboardLayout.row - 1) * this.oLayoutData.rowHeightPx) + 'px';
        oCard.dashboardLayout.width = (oCard.dashboardLayout.colSpan * this.oLayoutData.colWidthPx) + 'px';
        oCard.dashboardLayout.height = (oCard.dashboardLayout.rowSpan * this.oLayoutData.rowHeightPx) + 'px';
        oCard.dashboardLayout.left = (this.isRTLEnabled ? -iLeftValue : iLeftValue) + 'px';
    };

	DashboardLayoutUtil.prototype.convertRemToPx = function(value) {
		var val = value;
		if (typeof value === "string" || value instanceof String) { //take string with a rem unit
			val = value.length > 0 ? parseInt(value.split("rem")[0], 10) : 0;
		}
		return val * CommonUtils.getPixelPerRem();
	};

	DashboardLayoutUtil.prototype.convertPxToRem = function(value) {
		var val = value;
		if (typeof value === "string" || value instanceof String) { //take string with a rem unit
			val = value.length > 0 ? parseFloat(value.split("px")[0], 10) : 0;
		}
		return val / CommonUtils.getPixelPerRem();
	};

    DashboardLayoutUtil.prototype.setKpiNumericContentWidth = function($element) {
        /*
         For restricting target and deviation in KPI Header to move towards the right
         */
        var aOvpKpiContent = $element.getElementsByClassName("sapOvpKpiContent");
        if (!!aOvpKpiContent && aOvpKpiContent.length > 0) {
            var $ovpKpiContent = aOvpKpiContent[0];
            var iColumnPadding = 8;
            var iParentPadding = 16;
            $ovpKpiContent.style.width = (this.getColWidthPx() - (2 * iColumnPadding + 2 * iParentPadding))  + "px";
        }
    };

	DashboardLayoutUtil.prototype.getLayoutWidthPx = function() {
		return this.oLayoutData.colCount * this.oLayoutData.colWidthPx;
	};

	DashboardLayoutUtil.prototype.getColWidthPx = function() {
		return this.oLayoutData.colWidthPx;
	};

	DashboardLayoutUtil.prototype.getRowHeightPx = function() {
		return this.oLayoutData.rowHeightPx;
	};

	DashboardLayoutUtil.prototype._setColCount = function(iColCount) {
		this.oLayoutData.colCount = iColCount;
	};

    return DashboardLayoutUtil;
}, /* bExport*/ true);