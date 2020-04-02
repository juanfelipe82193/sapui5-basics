sap.ui.define(["sap/ovp/ui/UIActions",
    "sap/ui/Device",
    "sap/ui/thirdparty/jquery",
    "sap/base/Log"],
    function(UIActions, Device, jQuery, Log) {
	"use strict";

	var Rearrange = function(settings) {
		this.init(settings);
	};

	Rearrange.prototype.init = function(settings) {
		settings.beforeDragCallback = this._beforeDragHandler.bind(this);
		settings.dragStartCallback = this._dragStartHandler.bind(this);
		settings.dragMoveCallback = this._dragMoveHandler.bind(this);
		settings.dragEndCallback = this._dragEndHandler.bind(this);
		settings.resizeStartCallback = this._resizeStartHandler.bind(this);
		settings.resizeMoveCallback = this._resizeMoveHandler.bind(this);
		settings.resizeEndCallback = this._resizeEndHandler.bind(this);
		settings.endCallback = this._endHandler.bind(this);

		this.placeHolderClass = settings.placeHolderClass;
		this.layout = settings.layout;
		this.settings = settings;
		this.destroy(); //destroy the previous instance of UIActions
		this.uiActions = new UIActions(this.settings).enable();
		this.aCardsOrder = null; //DOM elements array
		this.aCards = settings.aCards; //cards properties persistence
		this.layoutUtil = settings.layoutUtil;
		this.verticalMargin = null; //space vertical between items
		this.horizontalMargin = null; //horizontal space vertical between items
		this.top = null; //space between layout top and first card
		this.left = null; //space between layout left and first card
		this.width = null; //item width
		this.layoutOffset = null; //layout coordinates on screen, needed to normalize mouse position to layout
		this.jqLayout = null; //layout jQuery reference
		this.jqLayoutInner = null; //layout inner wrapper jQuery reference
		this.isRTLEnabled = null; //RTL flag
		this.rowHeight = settings.rowHeight;
		this.floaterData = null; //id, position and width of the currently dragged card
		this.resizeData = {}; //card resize data (ghost values)
        this.updatedScrollTop = 0;
        this.SCROLL_OFFSET = 16;
	};

	Rearrange.prototype.destroy = function() {
		if (this.uiActions) {
			this.uiActions.disable();
			this.uiActions = null;
		}
	};

    //*******************************Resizing Card handlers************************************************//

    /**
     * Callback for UIActions resizeStartCallback, every time when resize starts
     *
     * @method {Private} _resizeStartHandler
     * @param {Object} evt - Event object
     * @param {Object} cardElement - jquery element object on which resize is triggered
     */

    Rearrange.prototype._resizeStartHandler = function (evt, cardElement) {
        if (!Device.system.desktop) {
            return;
        }
        //on resize start remove focus from current focused card
        if (this.layoutUtil && this.layoutUtil.sLastFocusableCard) {
            jQuery(this.layoutUtil.sLastFocusableCard).blur();
        }
        var oCard = this.layoutUtil.dashboardLayoutModel.getCardById(this.layoutUtil.getCardId(cardElement.id));
        if (oCard.template === "sap.ovp.cards.stack" || oCard.settings.stopResizing) {
            return;
        }
        //Array to store position/resizing delta changes
        this.layoutUtil.dragOrResizeChanges = [];
        this.layoutUtil.resizeStartCard = {
            cardId: oCard.id,
            rowSpan: oCard.dashboardLayout.rowSpan,
            colSpan: oCard.dashboardLayout.colSpan,
            maxColSpan: oCard.dashboardLayout.maxColSpan,
            noOfItems: oCard.dashboardLayout.noOfItems,
            autoSpan: oCard.dashboardLayout.autoSpan,
            showOnlyHeader: oCard.dashboardLayout.showOnlyHeader,
            row: oCard.dashboardLayout.row,
            column: oCard.dashboardLayout.column
        };
        //Prevent selection of text on tiles and groups
        if (jQuery(window).getSelection) {
            var selection = jQuery(window).getSelection();
            selection.removeAllRanges();
        }
        cardElement.classList.add('sapOvpCardResize');
        oCard.dashboardLayout.autoSpan = false;
        this.initCardsSettings();
    };

    /**
     * Callback for UIActions resizeEndCallback, every time when resize ends
     *
     * @method {Private} _resizeEndHandler
     * @param {Object} evt - Event object
     * @param {Object} cardElement - jquery element object on which resize is triggered
     */

    Rearrange.prototype._resizeEndHandler = function (evt, cardElement) {
        if (cardElement) {
            cardElement.classList.remove('sapOvpCardResize');
            if (this.uiActions.isResizeX && !this.uiActions.isResizeY && cardElement.classList.contains('sapOvpNotResizableLeftRight')) {
                return;
            }
            this.updatedScrollTop = 0;
            cardElement.style.zIndex = 'auto';
            var oCard = this.layoutUtil.changedCards.resizeCard;
            if (oCard) {
                oCard.dashboardLayout.maxColSpan = oCard.dashboardLayout.colSpan;
                this.layoutUtil._sizeCard(oCard);
                this.layoutUtil.dragOrResizeChanges.push({
                    changeType: "dragOrResize",
                    content: {
                        cardId: oCard.id,
                        dashboardLayout: {
                            rowSpan: oCard.dashboardLayout.rowSpan,
                            oldRowSpan: this.layoutUtil.resizeStartCard.rowSpan,
                            colSpan: oCard.dashboardLayout.colSpan,
                            oldColSpan: this.layoutUtil.resizeStartCard.colSpan,
                            maxColSpan: oCard.dashboardLayout.maxColSpan,
                            oldMaxColSpan: this.layoutUtil.resizeStartCard.maxColSpan,
                            noOfItems: oCard.dashboardLayout.noOfItems,
                            oldNoOfItems: this.layoutUtil.resizeStartCard.noOfItems,
                            autoSpan: oCard.dashboardLayout.autoSpan,
                            oldAutoSpan: this.layoutUtil.resizeStartCard.autoSpan,
                            showOnlyHeader: oCard.dashboardLayout.showOnlyHeader,
                            oldShowOnlyHeader: this.layoutUtil.resizeStartCard.showOnlyHeader,
                            row : oCard.dashboardLayout.row,
                            oldRow : this.layoutUtil.resizeStartCard.row,
                            column : oCard.dashboardLayout.column,
                            oldColumn : this.layoutUtil.resizeStartCard.column
                        }
                    },
                    isUserDependent: true
                });
            }
            this.layoutUtil.changedCards = {};
            if (Device.system.desktop) {
                jQuery("body").removeClass("sapOVPDisableUserSelect sapOVPDisableImageDrag");
            }
            jQuery(this.settings.wrapper).removeClass("dragAndDropMode");
            jQuery("#sapOvpOverlayDivForCursor").remove();
            jQuery("#ovpResizeRubberBand").remove();
            //Save all the layout changes to LREP
            this.layoutUtil.getDashboardLayoutModel().extractCurrentLayoutVariant();
            this.layoutUtil.oLayoutCtrl.fireAfterDragEnds({positionChanges: this.layoutUtil.dragOrResizeChanges});
            if (jQuery(window).getSelection) {
                var selection = jQuery(window).getSelection();
                selection.removeAllRanges();
            }
        }
    };

    /**
     * Callback for UIActions resizeMoveCallback, every time when mouse pointer moves in resize mode
     *
     * @method {Private} _resizeMoveHandler
     * @param {Object} actionObject - jquery element object on which resize is triggered
     */

    Rearrange.prototype._resizeMoveHandler = function (actionObject) {
        if (!Device.system.desktop) {
            return;
        }
        if (actionObject.element) {
            var cardDetails, cardSizeProperties, ghostWidth, ghostHeight,
                oCard = this.layoutUtil.dashboardLayoutModel.getCardById(this.layoutUtil.getCardId(actionObject.element.id));
            //If the card is stack card or resizing has been disabled for the card then return
            if (oCard.template === "sap.ovp.cards.stack" || oCard.settings.stopResizing) {
                return;
            }
            //To calculate the scroll height
            var viewElement = document.getElementsByClassName("sapFDynamicPageContentWrapper")[0];
            var viewHeight = viewElement.offsetHeight;
            var viewRect = viewElement.getBoundingClientRect();
            if ((actionObject.evt.clientY - viewElement.offsetTop + this.SCROLL_OFFSET) > viewHeight) {
                viewElement.scrollTop = viewElement.scrollTop + this.SCROLL_OFFSET;
                this.updatedScrollTop += this.SCROLL_OFFSET;
            } else if (((actionObject.evt.clientY - viewElement.offsetTop) < viewRect.top + this.SCROLL_OFFSET) && viewElement.scrollTop !== 0) {
                viewElement.scrollTop = viewElement.scrollTop - this.SCROLL_OFFSET;
                this.updatedScrollTop -= this.SCROLL_OFFSET;
            }

            cardSizeProperties = this.layoutUtil.calculateCardProperties(oCard.id);
            cardDetails = this._calculateMinimumCardHeight(actionObject);
            //If the user is doing resizing in -X direction and the card has only 1 column then return
            if (cardDetails.ghostWidthCursor <= this.layoutUtil.getColWidthPx() && this.uiActions.isResizeX && !this.uiActions.isResizeY) {
                return;
            }
            ghostHeight = cardDetails.ghostHeightCursor;
            ghostWidth = cardDetails.ghostWidthCursor <= this.layoutUtil.getColWidthPx() ? this.layoutUtil.getColWidthPx() : cardDetails.ghostWidthCursor;
            if (!this.uiActions.isResizeY) {//If the resize is done only in X-direction
                //Stop resizing for a Card with single colSpan and if the card has multiple colSpan then user should not resize only case when he is increasing the size
                if (actionObject.element.classList.contains('sapOvpNotResizableLeftRight') ||
                    (actionObject.element.classList.contains('sapOvpNotResizableRight') && cardDetails.ghostWidthCursor > oCard.dashboardLayout.colSpan * this.layoutUtil.getColWidthPx())) {
                    return;
                } else {
                    Log.info('Not a valid scenario');
                }
                //For list card user can not resize more than two columns
                if (oCard.template === "sap.ovp.cards.list" && ghostWidth > this.layoutUtil.getColWidthPx() * 2 ||
                    (oCard.template === "sap.ovp.cards.linklist" && oCard.settings.listFlavor === 'carousel' &&
                    (ghostWidth > this.layoutUtil.getColWidthPx() * 3))) {
                    return;
                }
            }
            //for linklist card carousel flavour its three columns and 45 rows
            if (oCard.template === "sap.ovp.cards.linklist" && oCard.settings.listFlavor === 'carousel' &&
                 ghostHeight > this.layoutUtil.getRowHeightPx() * 45) {
                actionObject.element.classList.add('sapOvpNotResizableDown');
                return;
            }

            var leastHeight = cardSizeProperties.leastHeight + 2 * this.layoutUtil.CARD_BORDER_PX;
            var minCardHeight = cardSizeProperties.minCardHeight + 2 * this.layoutUtil.CARD_BORDER_PX;
            actionObject.element.classList.remove("sapOvpMinHeightContainer");
            if (ghostHeight <= leastHeight) {
                ghostHeight = leastHeight;
                actionObject.element.classList.add("sapOvpMinHeightContainer");
                this.resizeData.showOnlyHeader = true;
            } else if (ghostHeight > leastHeight && ghostHeight <= minCardHeight) {
                var cutOffPoint = (leastHeight + minCardHeight) / 2;
                if (ghostHeight > cutOffPoint) {
                    ghostHeight = minCardHeight;
                    this.resizeData.showOnlyHeader = false;
                } else {
                    ghostHeight = leastHeight;
                    actionObject.element.classList.add("sapOvpMinHeightContainer");
                    this.resizeData.showOnlyHeader = true;
                }

            } else {
                //If the resize is not done in X-direction and card type is list/table then increment the ghost
                //by line item height Else increase the ghost height by 16px
                if (!this.uiActions.isResizeX && (oCard.template === 'sap.ovp.cards.list' || oCard.template === 'sap.ovp.cards.table')) {
                    var iContentWithoutHeader = cardSizeProperties.headerHeight + cardSizeProperties.dropDownHeight + 2 * this.layoutUtil.CARD_BORDER_PX;
                    var iPredictedNoOfItems = Math.round((ghostHeight - iContentWithoutHeader) / cardSizeProperties.itemHeight);
                    ghostHeight = iPredictedNoOfItems * cardSizeProperties.itemHeight + iContentWithoutHeader;
                }
                this.resizeData.showOnlyHeader = false;
            }
            this._addOverLay(cardDetails.cursor);
            this.resizeData.colSpan = Math.round(ghostWidth / this.layoutUtil.getColWidthPx());
            this.resizeData.rowSpan = Math.ceil(ghostHeight / this.layoutUtil.getRowHeightPx());
            this.layoutUtil.updateCardSize(oCard.id, ghostHeight, ghostWidth, this.resizeData.rowSpan);
            this.showGhostWhileResize(actionObject, oCard);
            if (this.resizeData.colSpan && this.resizeData.rowSpan) {
                //get card controller and send resize data
                this.layoutUtil.resizeCard(actionObject.element.getAttribute("id"), this.resizeData, this.layoutUtil.dragOrResizeChanges);
            }
            this.resizeData = {};
            this.layoutUtil.setKpiNumericContentWidth(actionObject.element);
        }
    };

    //************************************* Drag and Drop Card handlers*****************************************//

    /**
     * Callback for beforeDragCallback in UIActions before clone created
     *
     * @method {Private} _beforeDragHandler
     * @param {Object} evt - Event object
     * @param {Object} cardElement - jquery element object on which drag is triggered
     */

    Rearrange.prototype._beforeDragHandler = function (evt, cardElement) {

        if (evt.type === "mousedown") {
            evt.preventDefault();
        }

        //Prevent text selection menu and magnifier on mobile devices
        if (Device.browser.mobile) {
            this.selectableElemets = jQuery(cardElement).find(".sapUiSelectable");
            this.selectableElemets.removeClass("sapUiSelectable");
        }
        jQuery(this.settings.wrapper).addClass("dragAndDropMode");
    };

    /**
     * Callback for UIActions dragStartCallback, every time when before drag starts
     *
     * @method {Private} _dragStartHandler
     * @param {Object} evt - Event object
     * @param {Object} cardElement - jquery element object on which drag event is triggered
     */

    Rearrange.prototype._dragStartHandler = function (evt, cardElement) {

        //Prevent the browser to mark any elements while dragging
        if (Device.system.desktop) {
            jQuery("body").addClass("sapOVPDisableUserSelect sapOVPDisableImageDrag");
        }
        //on drag start remove focus from current focused card
        if (this.layoutUtil && this.layoutUtil.sLastFocusableCard) {
            jQuery(this.layoutUtil.sLastFocusableCard).blur();
        }
        //Array to store position/resizing delta changes
        this.layoutUtil.dragOrResizeChanges = [];
        var sCardId = this.layoutUtil.getCardId(cardElement.id);
        var oCard = this.layoutUtil.dashboardLayoutModel.getCardById(sCardId);
        this.layoutUtil.dragStartCard = {
            cardId: oCard.id,
            row: oCard.dashboardLayout.row,
            column: oCard.dashboardLayout.column,
            rowSpan: oCard.dashboardLayout.rowSpan,
            colSpan: oCard.dashboardLayout.colSpan,
            maxColSpan: oCard.dashboardLayout.maxColSpan,
            noOfItems: oCard.dashboardLayout.noOfItems,
            autoSpan: oCard.dashboardLayout.autoSpan,
            showOnlyHeader: oCard.dashboardLayout.showOnlyHeader
        };
        //Prevent selection of text on tiles and groups
        Log.info(cardElement);
        if (jQuery(window).getSelection) {
            var selection = jQuery(window).getSelection();
            selection.removeAllRanges();
        }
        this.initCardsSettings();
        //store the width and height of the card for ghost size
        var oCardRect = cardElement.children[0].getBoundingClientRect();
        this.floaterData = {
            width: oCardRect.width,
            height: oCardRect.height,
            startLeft: oCardRect.left - this.layoutOffset.left,
            startTop: oCardRect.top - this.layoutOffset.top
        };
    };

    /**
     * Callback for UIActions dragMoveCallback, every time when mouse is moved in drag mode
     *
     * @method {Private} _dragMoveHandler
     * @param {Object} actionObject - jquery element object on which drag event is triggered
     */

    Rearrange.prototype._dragMoveHandler = function (actionObject) {
        if (actionObject.element) {
            var mainHeaderWrapperHeight = 0;
            var uShellHeadHeight = 0;
            var viewElement = document.getElementsByClassName("sapFDynamicPageContentWrapper")[0];
            var viewTitleHeight = document.getElementsByClassName("sapFDynamicPageTitleWrapper")[0].offsetHeight;
            if (document.getElementsByClassName("sapUshellShellHeadSearchContainer")[0]) {
                uShellHeadHeight = document.getElementsByClassName("sapUshellShellHeadSearchContainer")[0].offsetHeight;
            }
            var viewHeight = viewElement.offsetHeight;
            var viewRect = viewElement.getBoundingClientRect();
            var updatedScrollTop;
            if (document.getElementsByClassName("sapFDynamicPageHeader")[0]) {
                mainHeaderWrapperHeight = document.getElementsByClassName("sapFDynamicPageHeader")[0].offsetHeight;
            }
            if ((actionObject.evt.clientY - viewElement.offsetTop + this.SCROLL_OFFSET) > viewHeight) {
                viewElement.scrollTop = viewElement.scrollTop + this.SCROLL_OFFSET;
                updatedScrollTop = viewElement.scrollTop;
            } else if (((actionObject.evt.clientY - viewElement.offsetTop) < viewRect.top + this.SCROLL_OFFSET) && viewElement.scrollTop !== 0) {
                viewElement.scrollTop = viewElement.scrollTop - this.SCROLL_OFFSET;
                updatedScrollTop = viewElement.scrollTop;
            } else {
                updatedScrollTop = viewElement.scrollTop;
            }
            this.floaterData.id = actionObject.element.id;
            this.floaterData.left = actionObject.clone.getBoundingClientRect().left;
            this.floaterData.top = actionObject.clone.getBoundingClientRect().top + updatedScrollTop - (viewTitleHeight + mainHeaderWrapperHeight + uShellHeadHeight);

            var iColumnValue = Math.round(this.floaterData.left / this.layoutUtil.getColWidthPx());
            var newCardPosition = {
                row: Math.round(this.floaterData.top / this.layoutUtil.getRowHeightPx()) + 1,
                column: this.isRTLEnabled ? this.columnCount - iColumnValue : iColumnValue + 1
            };
            newCardPosition.row = newCardPosition.row <= 0 ? 1 : newCardPosition.row;
            newCardPosition.column = newCardPosition.column <= 1 ? 1 : newCardPosition.column;
            var oCard = this.layoutUtil.dashboardLayoutModel.getCardById(this.layoutUtil.getCardId(this.floaterData.id));
            //If the new position is beyond the viewport then move the card to the desired position
            if (newCardPosition.column + oCard.dashboardLayout.colSpan > this.columnCount) {
                newCardPosition.column = (this.columnCount - oCard.dashboardLayout.colSpan) + 1;
            }
            this.floaterData.row = newCardPosition.row;
            this.floaterData.column = newCardPosition.column;
            jQuery.when(this.layoutUtil.dashboardLayoutModel._arrangeCards(oCard, this.floaterData, 'drag', this.layoutUtil.dragOrResizeChanges)).done(function () {
                this.layoutUtil._positionCards(this.aCards);
                this.layoutUtil.dashboardLayoutModel._removeSpaceBeforeCard();
            }.bind(this));
            this.showGhostWhileDragMove({
                row: oCard.dashboardLayout.row,
                column: oCard.dashboardLayout.column
            }, actionObject);
        }
    };

    /**
     * Callback for UIActions dragEndCallback, every time after drag and drop finished
     *
     * @method {Private} _dragEndHandler
     * @param {Object} evt - Event object
     * @param {Object} cardElement - jquery element object on which drag event is triggered
     */

    Rearrange.prototype._dragEndHandler = function (evt, cardElement, cloneObj) {
        if (cardElement) {
            var cardRect = cardElement.getBoundingClientRect();
            var cloneRect = cloneObj.getBoundingClientRect();
            var cloneObjTransform = window.getComputedStyle(cloneObj).transform.split(",");
            var topDiff = cardRect.top - cloneRect.top;
            var leftDiff = cardRect.left - cloneRect.left;
            var translateX = parseInt(cloneObjTransform[4], 10) + leftDiff;
            var translateY = parseInt(cloneObjTransform[5], 10) + topDiff;
            cloneObj.style[this.layoutUtil.cssVendorTransition] = 'transform 0.3s cubic-bezier(0.46, 0, 0.44, 1)';
            translateX = Math.abs(translateX) - 8 < 0 ? 0 : translateX - 8;
            translateY = Math.abs(translateY) - 8 < 0 ? 0 : translateY - 8;
            cloneObj.style[this.layoutUtil.cssVendorTransform] = 'translate3d(' + translateX + 'px, ' + translateY + 'px, 0px) ';
            this.layoutUtil._positionCards(this.aCards);
            // Do something when the transition ends
            jQuery(cloneObj).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function (event) {
                //Save all the layout changes to LREP
                jQuery("#ovpDashboardLayoutMarker").remove(); //remove insert marker
                this.layoutUtil.getDashboardLayoutModel().extractCurrentLayoutVariant();
                var sCardId = this.layoutUtil.getCardId(cardElement.id);
                var oCard = this.layoutUtil.dashboardLayoutModel.getCardById(sCardId);
                this.layoutUtil.dragOrResizeChanges.push({
                    changeType: "dragOrResize",
                    content: {
                        cardId: sCardId,
                        dashboardLayout: {
                            row: oCard.dashboardLayout.row,
                            oldRow: this.layoutUtil.dragStartCard.row,
                            column: oCard.dashboardLayout.column,
                            oldColumn: this.layoutUtil.dragStartCard.column,
                            rowSpan: oCard.dashboardLayout.rowSpan,
                            oldRowSpan: this.layoutUtil.dragStartCard.rowSpan,
                            colSpan: oCard.dashboardLayout.colSpan,
                            oldColSpan: this.layoutUtil.dragStartCard.colSpan,
                            maxColSpan: oCard.dashboardLayout.maxColSpan,
                            oldMaxColSpan: this.layoutUtil.dragStartCard.maxColSpan,
                            noOfItems: oCard.dashboardLayout.noOfItems,
                            oldNoOfItems: this.layoutUtil.dragStartCard.noOfItems,
                            autoSpan: oCard.dashboardLayout.autoSpan,
                            oldAutoSpan: this.layoutUtil.dragStartCard.autoSpan,
                            showOnlyHeader: oCard.dashboardLayout.showOnlyHeader,
                            oldShowOnlyHeader: this.layoutUtil.dragStartCard.showOnlyHeader
                        }
                    },
                    isUserDependent: true
                });
                this.layoutUtil.oLayoutCtrl.fireAfterDragEnds({positionChanges: this.layoutUtil.dragOrResizeChanges});
                // Cleanup added classes and styles before drag
                if (Device.system.desktop) {
                    jQuery("body").removeClass("sapOVPDisableUserSelect sapOVPDisableImageDrag");
                }
                jQuery(this.settings.wrapper).removeClass("dragAndDropMode");
                if (jQuery(window).getSelection) {
                    var selection = jQuery(window).getSelection();
                    selection.removeAllRanges();
                }
                this.uiActions.removeClone();
                cardElement.classList.remove(this.placeHolderClass);
                //Calculate the height of the container upon card resize
                var iContainerHeight = (this.layoutUtil.dashboardLayoutModel._findHighestOccupiedRow() * this.layoutUtil.ROW_HEIGHT_PX) + 32;
                jQuery(".sapUshellEasyScanLayoutInner").css({"height": iContainerHeight + "px", "z-index": "1"});
            }.bind(this));
        }
    };

    /**
     * Callback for UIActions endCallback, after completion of event
     *
     * @method {Private} _endHandler
     * @param {Object} evt - Event object
     * @param {Object} cardElement - jquery element object on which drag event is triggered
     */

    Rearrange.prototype._endHandler = function (evt, cardElement) {
        Log.info(cardElement);
        //Prevent text selection menu and magnifier on mobile devices
        if (Device.browser.mobile && this.selectableElemets) {
            this.selectableElemets.addClass("sapUiSelectable");
        }
    };

    //******** ***********************************Helper functions ***************************************************//

    /**
     *  Get the card and the viewport settings when the drag and resize starts
     *
     * @method initCardsSettings
     */

	Rearrange.prototype.initCardsSettings = function() {
		this.jqLayout = this.layout.$();
		this.jqLayoutInner = this.jqLayout.children().first();
		var layoutScroll = this.jqLayout.scrollTop();
		var layoutHeight = this.jqLayoutInner.height();
		this.isRTLEnabled = sap.ui.getCore().getConfiguration().getRTL();
		this.aCardsOrder = [];
		this.layoutOffset = this.jqLayout.offset();
		this.corrY = this.jqLayout.get(0).getBoundingClientRect().top + this.jqLayout.scrollTop();
		this.corrX = this.layoutOffset.left;
		this.columnCount = this.layoutUtil.oLayoutData.colCount;
		var visibleLayoutItems = this.layout.getVisibleLayoutItems();
		if (!visibleLayoutItems) {
			return;
		}
        function getCardParent(element) {
            return element.$().parent()[0];
        }

        this.aCardsOrder = visibleLayoutItems.map(getCardParent);
		var jqFirstColumn = this.jqLayoutInner.children().first();
		var marginProp = this.isRTLEnabled ? "margin-left" : "margin-right";
		this.verticalMargin = parseInt(jqFirstColumn.css(marginProp), 10);
		var firstItemEl = this.aCardsOrder[0];
        var oFirstElementClientRect = firstItemEl.getBoundingClientRect();
        var oJqLayoutInnerClientRect = this.jqLayoutInner[0].getBoundingClientRect();
		this.horizontalMargin = parseInt(jQuery(firstItemEl).css("margin-bottom"), 10);
		this.verticalMargin = this.horizontalMargin;
		this.top = oFirstElementClientRect.top - oJqLayoutInnerClientRect.top;
		this.left = oFirstElementClientRect.left - oJqLayoutInnerClientRect.left;
		this.width = firstItemEl.offsetWidth;
		jQuery(this.aCardsOrder).css("position", "absolute");
		this.drawLayout(this.aCardsOrder);
		//all elements are switched to position absolute to prevent layout from collapsing we put height on it like it was before change.
		//and fix scroll, so user will not see position changes on the screen.
		this.jqLayoutInner.height(layoutHeight);
		this.jqLayout.scrollTop(layoutScroll);
	};

	/**
	 * put all items to new positions
	 *
	 * @method drawLayout
	 * @param {Array} aCardsLayout - card layout
	 */
    Rearrange.prototype.drawLayout = function (aCardsLayout) {
        function updateCSS(domElement) {
            var $element = jQuery(domElement).position();
            domElement.style[this.layoutUtil.cssVendorTransition] = 'all 300ms ease';
            domElement.style[this.layoutUtil.cssVendorTransform] = 'translate3d(' + $element.left + ',' + $element.top + ', 0px) ';
        }

        var iCardsLength = aCardsLayout.length;
        if (iCardsLength > 0) {
            for (var i = 0; i < iCardsLength; i++) {
                requestAnimationFrame(updateCSS.bind(this, aCardsLayout[i]));
            }
        }
    };

    Rearrange.prototype.showGhostWhileDragMove = function (newCardPosition, actionObject) {
        var element = document.getElementById('ovpDashboardLayoutMarker'),
            iColumnValue = (newCardPosition.column - 1) * this.layoutUtil.getColWidthPx(),
            pos = {
                top: (newCardPosition.row - 1) * this.layoutUtil.getRowHeightPx() + this.layoutUtil.CARD_BORDER_PX,
                left: this.isRTLEnabled ? -iColumnValue - this.layoutUtil.CARD_BORDER_PX : iColumnValue + this.layoutUtil.CARD_BORDER_PX
            };
        if (!element) {
            var oDiv = document.createElement('div');
            oDiv.id = 'ovpDashboardLayoutMarker';
            oDiv.position = 'absolute';
            oDiv.style.height = this.floaterData.height + 'px';
            oDiv.style.width = this.floaterData.width + 'px';
            oDiv.style[this.layoutUtil.cssVendorTransform] = 'translate3d(' + pos.left + 'px,' + pos.top + 'px, 0px) ';
            document.getElementsByClassName('sapUshellEasyScanLayoutInner')[0].appendChild(oDiv);
        } else {
            element.style[this.layoutUtil.cssVendorTransition] = 'all 300ms ease';
            element.style[this.layoutUtil.cssVendorTransform] = 'translate3d(' + pos.left + 'px,' + pos.top + 'px, 0px) ';
        }
        actionObject.element.style[this.layoutUtil.cssVendorTransition] = 'all 300ms ease';
        actionObject.element.style[this.layoutUtil.cssVendorTransform] = 'translate3d(' + pos.left + 'px,' + pos.top + 'px, 0px) ';
    };

    Rearrange.prototype.showGhostWhileResize = function (actionObject, oCard) {
        var element = document.getElementById('ovpResizeRubberBand'),
            iColumnValue = (oCard.dashboardLayout.column - 1) * this.layoutUtil.getColWidthPx(),
            pos = {
                top: (oCard.dashboardLayout.row - 1) * this.layoutUtil.getRowHeightPx() + this.layoutUtil.CARD_BORDER_PX,
                left: this.isRTLEnabled ? -iColumnValue - this.layoutUtil.CARD_BORDER_PX : iColumnValue + this.layoutUtil.CARD_BORDER_PX
            },
            height = this.resizeData.rowSpan * this.layoutUtil.getRowHeightPx() - 2 * this.layoutUtil.CARD_BORDER_PX + 2,
            width = this.resizeData.colSpan * this.layoutUtil.getColWidthPx() - 2 * this.layoutUtil.CARD_BORDER_PX + 2;
        if (!element) {
            //Create the ghost element and append to the layout
            var oDiv = document.createElement('div');
            oDiv.id = 'ovpResizeRubberBand';
            oDiv.classList.add('ovpResizeRubberBand');
            oDiv.position = 'absolute';
            oDiv.style.height = height + 'px';
            oDiv.style.width = width + 'px';
            oDiv.style[this.layoutUtil.cssVendorTransition] = 'all 300ms ease';
            oDiv.style[this.layoutUtil.cssVendorTransform] = 'translate3d(' + pos.left + 'px,' + pos.top + 'px, 0px) ';
            actionObject.element.parentElement.appendChild(oDiv);
        } else {
            element.style.height = height + 'px';
            element.style.width = width + 'px';
        }
    };
    /**
     * Method to add respective cursor while doing resize operation
     *
     * @method {Private} _addOverLay
     * @param {String} cursor - respective cursor to be applied upon the resized element
     */
    Rearrange.prototype._addOverLay = function (cursor) {
        var element = document.getElementById('sapOvpOverlayDivForCursor');
        if (!element) {
            var overlayDiv = document.createElement('div');
            overlayDiv.id = 'sapOvpOverlayDivForCursor';
            overlayDiv.style.cursor = cursor;
            this.jqLayout[0].appendChild(overlayDiv);
        } else {
            element.style.cursor = cursor;
        }
    };

    /**
     * Function to calculate resize-direction(X, Y or both XY) , minimum card height and the wrapper height and cursor
     *
     * @method {Private} _calculateMinimumCardHeight
     * @param {Object} actionObject - Element object on which resize is triggered
     * @return {Object} - Object containing properties like ghost height , ghost width, cursor, top and left position of the ghost
     */

    Rearrange.prototype._calculateMinimumCardHeight = function (actionObject) {
        var $elemPosition = actionObject.element.getBoundingClientRect(),
            fElementPosTop = $elemPosition.top,
            iCardRight = $elemPosition.right,
            ghostWidthCursor, ghostHeightCursor, cursor;
        //if X-direction resize then ghost height is same as card height
        if (this.uiActions.isResizeX && !this.uiActions.isResizeY) {
            ghostWidthCursor = this.isRTLEnabled ? iCardRight - actionObject.moveX : actionObject.moveX - $elemPosition.left;
            ghostHeightCursor = $elemPosition.height;
            cursor = 'ew-resize';
            //if Y-direction resize then ghost width is same as card width
        } else if (!this.uiActions.isResizeX && this.uiActions.isResizeY) {
            ghostWidthCursor = $elemPosition.width;
            ghostHeightCursor = actionObject.moveY - fElementPosTop;
            cursor = 'ns-resize';
        } else {
            ghostWidthCursor = this.isRTLEnabled ? iCardRight - actionObject.moveX : actionObject.moveX - $elemPosition.left;
            ghostHeightCursor = actionObject.moveY - fElementPosTop;
            cursor = this.isRTLEnabled ? 'nesw-resize' : 'nwse-resize';
        }
        return {
            ghostWidthCursor: ghostWidthCursor,
            ghostHeightCursor: ghostHeightCursor,
            cursor: cursor
        };
    };
	return Rearrange;
});
