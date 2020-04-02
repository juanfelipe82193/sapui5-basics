sap.ui.define(["sap/ui/core/Control",
            "sap/ui/thirdparty/jquery",
            "sap/ui/Device",
            "sap/ui/core/ResizeHandler",
            "sap/ovp/app/resources",
            "sap/ovp/app/OVPUtils",
            "sap/ui/events/KeyCodes",
            "sap/ui/events/F6Navigation"],
    function (Control, jQuery, Device, ResizeHandler, OvpResources, OVPUtils, KeyCodes, F6Navigation) {
        "use strict";

        var DashboardLayout = Control.extend("sap.ovp.ui.DashboardLayout", {

            metadata: {
                designTime: true,
                library: "sap.ovp",
                aggregations: {
                    content: {
                        type: "sap.ui.core.Control",
                        multiple: true,
                        singularName: "content"
                    }
                },
                defaultAggregation: "content",
                events: {
                    afterRendering: {},
                    afterDragEnds: {}
                },
                properties: {
                    dragAndDropRootSelector: {
                        group: "Misc",
                        type: "string"
                    },
                    dragAndDropEnabled: {
                        group: "Misc",
                        type: "boolean",
                        defaultValue: true
                    },
                    debounceTime: {
                        group: "Misc",
                        type: "int",
                        defaultValue: 150
                    }
                }
            },

            renderer: {

                render: function (oRm, oControl) {
                    // get viewport width depending layout data
                    var ctrlWidth = oControl.$().width();
                    var bRTL = sap.ui.getCore().getConfiguration().getRTL();
                    var oLayoutData = oControl.dashboardLayoutUtil.updateLayoutData(ctrlWidth ? ctrlWidth : jQuery(window).width());
                    var aCards = oControl.dashboardLayoutUtil.getCards(oLayoutData.colCount);

                    function filterVisibleCards(element) {
                        return element.getVisible();
                    }

                    function filterById(element) {
                        return element.id === this.getId().split("--")[1];
                    }

                    var filteredItems = oControl.getContent().filter(filterVisibleCards);
                    oRm.write("<div");
                    oRm.writeControlData(oControl);
                    oRm.addClass("sapUshellEasyScanLayout");
                    if (!Device.system.phone) {
                        oRm.addClass("sapOvpDashboardDragAndDrop");
                    }
                    oRm.addClass("sapOvpDashboard");
                    oRm.writeClasses();
                    bRTL ? oRm.addStyle("margin-right", oLayoutData.marginPx + "px") : oRm.addStyle("margin-left", oLayoutData.marginPx + "px");
                    oRm.writeStyles();
                    oRm.write(">");
                    oRm.write("<div class='sapUshellEasyScanLayoutInner' role='list' aria-label='Cards' tabindex='0'>");

                    if (aCards.length > 0) {
                        var card = {}, counter, iLength, bSideCard,
                            colCount = oControl.getDashboardLayoutModel().getColCount();

                        for (counter = 0, iLength = filteredItems.length; counter < iLength; counter++) {
                            var aStyleClasses = ['easyScanLayoutItemWrapper', 'sapOvpDashboardLayoutItem'];
                            card = aCards.filter(filterById.bind(filteredItems[counter]))[0];
                            //re-set css values for current card
                            oControl.dashboardLayoutUtil.setCardCssValues(card);
                            bSideCard = card.dashboardLayout.column + card.dashboardLayout.colSpan === colCount + 1;
                            if (bSideCard) {
                                card.dashboardLayout.colSpan === 1 ? aStyleClasses.push('sapOvpNotResizableLeftRight') : aStyleClasses.push('sapOvpNotResizableRight');
                            }
                            if (card.template === 'sap.ovp.cards.stack' || card.settings.stopResizing || !Device.system.desktop) {
                                aStyleClasses.push('sapOvpDashboardLayoutItemNoDragIcon');
                            }

                            oRm.write("<div id='" + oControl.dashboardLayoutUtil.getCardDomId(card.id) +
                            "' class='" + aStyleClasses.join(' ') + "' style='" +
                            "; transform:translate3d(" + card.dashboardLayout.left + " ," + card.dashboardLayout.top + " ,0px)" +
                            "; -ms-transform:translate3d(" + card.dashboardLayout.left + " ," + card.dashboardLayout.top + " ,0px)" +
                            "; -moz-transform:translate3d(" + card.dashboardLayout.left + " ," + card.dashboardLayout.top + " ,0px)" +
                            "; -webkit-transform:translate3d(" + card.dashboardLayout.left + " ," + card.dashboardLayout.top + " ,0px)" +
                            "; height:" + card.dashboardLayout.height + "; width:" + card.dashboardLayout.width + ";'" +
                            " tabindex='0'; aria-setsize=" + iLength + " aria-posinset=" + ( counter + 1 ));
                            oRm.writeAccessibilityState(undefined, { role: "listitem" });
                            oRm.write(">");
                            oRm.renderControl(filteredItems[counter]);
                            oRm.write("<div class='lastElement' tabindex='0'></div>");
                            oRm.write("</div>");
                        }
                    }

                    oRm.write("</div>");
                    // dummy after focusable area
                    oRm.write("<div class='after' tabindex='0'></div>");
                    oRm.write("</div>");
                }
            },

            init: function () {
                this.data("sap-ui-fastnavgroup", "true", true);
                this.oColumnLayoutData = {};
                this.resizeHandlerId = this.initResizeHandler();

                var oComponent = sap.ui.getCore().getComponent(this._sOwnerId);
                this.dashboardLayoutUtil = oComponent.getDashboardLayoutUtil();
                this.dashboardLayoutUtil.setLayout(this);
            },

            exit: function () {
                //de-register event handler
                if (this.resizeHandlerId) {
                    ResizeHandler.deregister(this.resizeHandlerId);
                }
                //delete rearrange instance (incl. its ui actions)
                if (this.layoutDragAndDrop) {
                    this.layoutDragAndDrop.destroy();
                    delete this.layoutDragAndDrop;
                }
            },

            onBeforeRendering: function () {
            },

            onAfterRendering: function () {
                this.keyboardNavigation = new KeyboardNavigation(this);
                if (!this.getDragAndDropRootSelector()) {
                    this.setDragAndDropRootSelector("#" + this.getId());
                }
                if (this.layoutDragAndDrop) {
                    this.layoutDragAndDrop.destroy();
                }
                if (this.getDragAndDropEnabled()) {

                    this.layoutDragAndDrop = this.dashboardLayoutUtil.getRearrange({
                        rootSelector: this.getDragAndDropRootSelector(),
                        layout: this
                    });

                    this.fireAfterRendering();
                }
            },

            /**
             * get the DashboardLayout variants in JSON format
             * @method getLayoutVariantsJSON
             * @returns {Object} JSON containing the layout variants
             */
            getLayoutDataJSON: function () {
                //JSON.stringify(...?
                return this.dashboardLayoutUtil.getDashboardLayoutModel().getLayoutVariants4Pers();
            },

            filterVisibleCards: function (element) {
                return element.getVisible();
            },

            getDashboardLayoutUtil: function () {
                return this.dashboardLayoutUtil;
            },

            getDashboardLayoutModel: function () {
                return this.dashboardLayoutUtil.getDashboardLayoutModel();
            },

            getVisibleLayoutItems: function () {
                //layout items could be hidden, so we filter them and receive only visible
                var content = this.getContent();
                var filteredItems = content.filter(this.filterVisibleCards);
                return filteredItems;
            },

            initResizeHandler: function () {
                var resizeHandlerTimerId;
                var debounceTime = this.getDebounceTime();
                var resizeHandlerDebounce = function (evt) {
                    window.clearTimeout(resizeHandlerTimerId);
                    resizeHandlerTimerId = window.setTimeout(this.oControl.resizeHandler.bind(this, evt), debounceTime);
                };

                return ResizeHandler.register(this, resizeHandlerDebounce);
            },

            resizeHandler: function (evt) {
                this.oControl.dashboardLayoutUtil.resizeLayout(evt.size.width);
            },

            setActive: function (bSetActive) {
                if (bSetActive) {
                    this.removeStyleClass("ovpOverlay");
                } else {
                    this.addStyleClass("ovpOverlay");
                }
            },

            getActive: function () {
                return !this.hasStyleClass("ovpOverlay");
            }
        });

        var KeyboardNavigation = function (ovpLayout) {
            this.init(ovpLayout);
        };

        KeyboardNavigation.prototype.init = function (ovpLayout) {
            this.layoutUtil = ovpLayout.getDashboardLayoutUtil();
            this.layoutModel = ovpLayout.getDashboardLayoutModel();
            this.keyCodes = KeyCodes;
            this.jqElement = ovpLayout.$();
            this.bIgnoreSelfFocus = false;
            this.sLastFocusableCard = null;
            this.lastFocussedElement = null;
            this.jqElement.on('keydown', this.keyDownHandler.bind(this));
            this.jqElement.on('keyup', this.keyUpHandler.bind(this));
            this.jqElement.find(".sapUshellEasyScanLayoutInner").on("focus.keyboardNavigation", this.layoutFocusHandler.bind(this));
            this.jqElement.on("focus.keyboardNavigation", ".easyScanLayoutItemWrapper", this.layoutItemFocusHandler.bind(this));
            jQuery('body').on('keyup',this.bodyKeyupHandler.bind(this));
            jQuery('body').on('keydown',this.bodyKeydownHandler.bind(this));
            jQuery(".sapFDynamicPageContent").on("click", this.layoutClickHandler.bind(this));
            this.jqElement.find(".after").on("focus.keyboardNavigation", this.afterFocusHandler.bind(this));
        };

        KeyboardNavigation.prototype.spacebarHandler = function (e) {
            OVPUtils.bCRTLPressed = e.ctrlKey || e.metaKey;
            // checking if the item has a press event associated and explicitly firing the press event on the item
            var item = sap.ui.getCore().byId(e.target.id);
            if (item && item.mEventRegistry.hasOwnProperty('press')) {
                jQuery('#' + e.target.id).addClass('sapMLIBActive');
                jQuery('#' + e.target.id + ' span').css('color', '#FFFFFF');
                item.firePress();
            }
        };

        KeyboardNavigation.prototype.bodyKeyupHandler = function (e) {
            if (e.ctrlKey || e.metaKey) {
                OVPUtils.bCRTLPressed = false;
            }
        };
        KeyboardNavigation.prototype.bodyKeydownHandler = function (e) {
            if (e.ctrlKey || e.metaKey) {
                OVPUtils.bCRTLPressed = true;
            }
        };

        KeyboardNavigation.prototype.layoutItemFocusHandler = function () {
            var jqFocused = jQuery(document.activeElement);

            // Check that focus element exits, id this item exits it will be easyScanLayoutItemWrapper (because the jQuery definitions
            // After we have the element we want to add to his aria-labelledby attribute all the IDs of his sub elements that have aria-label and role headind
            if (jqFocused) {

                // Select all sub elements with aria-label
                var labelledElement = jqFocused.find("[aria-label]");
                var i, strIdList = "";


                // code to add the aria label for the ObjectNumber having state.
                // We need to add both the value state as well as the text to be added to the aria-label
                if (jqFocused.find('.valueStateText').length == 1) {
                    var sText = jqFocused.find('.valueStateText').find('.sapMObjectNumberText').text();
                    var sValueState = jqFocused.find('.valueStateText').find('.sapUiInvisibleText').text();
                    jqFocused.find('.valueStateText').attr('aria-label', sText + " " + sValueState);
                    jqFocused.find('.valueStateText').attr('aria-labelledby', "");
                }

                jqFocused.find("[role='listitem']").attr('aria-label', "");

                // creating a dummy div that contains the position of the card in the application and refering it's id in the aria-labelledby for the card container
                if (jqFocused.hasClass('easyScanLayoutItemWrapper')) {
                    var sCountDivId = "";
                    var cardCountDiv = jqFocused.find('.cardCount');
                    var sCardPositionText = OvpResources.getText("cardPositionInApp", [jqFocused.attr('aria-posinset'), jqFocused.attr('aria-setsize')]);
                    if (cardCountDiv.length === 0) {
                        sCountDivId = "countDiv_" + new Date().getTime();
                        var sDummyDivForCardCount = '<div id="' + sCountDivId + '" class="cardCount" aria-label="' + sCardPositionText + '" hidden></div>';
                        jqFocused.append(sDummyDivForCardCount);
                    } else {
                        sCountDivId = cardCountDiv[0].id;
                        cardCountDiv.attr('aria-label', sCardPositionText);
                    }
                    strIdList += sCountDivId + " ";
                    var oCardType = jqFocused.find('.cardType');
                    if (oCardType.length !== 0) {
                        strIdList += oCardType[0].id + " ";
                    }
                }

                // adding the text card header before if the focus is on the header section
                if (jqFocused.hasClass('sapOvpCardHeader') && !jqFocused.hasClass('sapOvpStackCardContent')) {
                    var sCardHeaderTypeDivId = "";
                    var cardHeaderDiv = jqFocused.find('.cardHeaderType');
                    if (cardHeaderDiv.length === 0) {
                        var sCardHeaderType = OvpResources.getText("CardHeaderType");
                        sCardHeaderTypeDivId = "cardHeaderType_" + new Date().getTime();
                        var sDummyDivForCardHeader = '<div id="' + sCardHeaderTypeDivId + '" class="cardHeaderType" aria-label="' + sCardHeaderType + '" hidden></div>';
                        jqFocused.append(sDummyDivForCardHeader);
                    } else {
                        sCardHeaderTypeDivId = cardHeaderDiv[0].id;
                    }

                    strIdList += sCardHeaderTypeDivId + " ";
                }

                //  Add every element id with aria label and e heading inside the LayoutItemWrapper to string list
                for (i = 0; i < labelledElement.length; i++) {
                    if (labelledElement[i].getAttribute("role") === "heading") {
                        strIdList += labelledElement[i].id + " ";
                    }
                }

                if (jqFocused.hasClass('sapOvpCardHeader')) {
                    var cardHeaders = jqFocused.find('.cardHeaderText');
                    if (cardHeaders.length !== 0) {
                        for (var i = 0; i < cardHeaders.length; i++) {
                            if (strIdList.indexOf(cardHeaders[i].id) === -1) {
                                strIdList += cardHeaders[i].id + " ";
                            }
                        }
                    }
                }

                // add the id string list to the focus element (warpper) aria-labelledby attribute
                if (strIdList.length) {
                    jqFocused.attr("aria-labelledby", strIdList);
                }

                //if the focussed element is li and belongs to a dynamic link list which has the action for popover
                // creating a hidden element with "has details" text and adding it to the LI
                if (jqFocused.prop('nodeName') === "LI" && jqFocused.find('.linkListHasPopover').length !== 0) {
                    if (jqFocused.find('#hasDetails').length === 0) {
                        jqFocused.append("<div id='hasDetails' hidden>" + OvpResources.getText("HAS_DETAILS") + "</div>");
                        jqFocused.attr('aria-describedby', "hasDetails");
                    }
                }

                //if the focussed element is link and belongs to a table then column header has to be read along with the link text
                var table = jqFocused.attr("id");
                if (( table && table.indexOf("ovpTable") != -1) && jqFocused.find("[role='Link']") && !jqFocused.hasClass('sapUiCompSmartLink')) {
                    var itemColumn = jqFocused.closest("td").attr("data-sap-ui-column"),
                        headerColumns = jqFocused.closest("tbody").siblings().children().filter("tr").children();
                    for (var i = 0; i < headerColumns.length; i++) {
                        if (headerColumns[i].getAttribute("data-sap-ui") == itemColumn && headerColumns[i].hasChildNodes("span")) {
                            var headerTextId = headerColumns[i].firstElementChild.getAttribute("id");
                            jqFocused.attr("aria-labelledby", headerTextId);
                        }
                    }
                }
            }
        };


        // 1 - on click of side area first time the focus should be on first card
        // 2 - after changing the focus from first card and moving focus to other card and move focus out of the app and came back and click on side area
        // that time the focus should be on last focused card
        KeyboardNavigation.prototype.layoutFocusHandler = function (event) {
            if (jQuery(event.relatedTarget).hasClass('easyScanLayoutItemWrapper')) {
                return;
            }
            if (this.sLastFocusableCard) {
                this.sLastFocusableCard.focus();
                this.layoutUtil.sLastFocusableCard = this.sLastFocusableCard;
                return;
            }
            this.jqElement.find(".easyScanLayoutItemWrapper").first().focus();
            this.sLastFocusableCard = this.jqElement.find(".easyScanLayoutItemWrapper").first();
            this.layoutUtil.sLastFocusableCard = this.sLastFocusableCard;
        };

        // left side area is margin on click of that above function is not getting called so explicitly added click handler
        KeyboardNavigation.prototype.layoutClickHandler = function (e) {
            if (e && e.target && e.target.getAttribute("id") && e.target.getAttribute("id").indexOf("mainView") !== -1) {
                if (this.sLastFocusableCard) {
                    //console.log("last focused item from layoutFocusHandler : ");
                    //console.dir(this.sLastFocusableCard);
                    this.sLastFocusableCard.focus();
                    this.layoutUtil.sLastFocusableCard = this.sLastFocusableCard;
                    return;
                }
                this.jqElement.find(".easyScanLayoutItemWrapper").first().focus();
                this.sLastFocusableCard = this.jqElement.find(".easyScanLayoutItemWrapper").first();
                this.layoutUtil.sLastFocusableCard = this.sLastFocusableCard;
            }
        };

        KeyboardNavigation.prototype.ctrlArrowHandler = function (oCard, cardId) {
            var oOtherCard = this.layoutUtil.dashboardLayoutModel.getCardById(cardId),
                oldCardRow = oCard.dashboardLayout.row,
                oOtherCardRow = oOtherCard.dashboardLayout.row,
                newColumn = oOtherCard.dashboardLayout.column,
                affectedCards = [], newRow;
            if (oOtherCardRow > oldCardRow && oOtherCard.dashboardLayout.rowSpan >= oCard.dashboardLayout.rowSpan) {
                newRow = oldCardRow + oOtherCard.dashboardLayout.rowSpan;
            } else {
                newRow = oOtherCardRow;
            }
            this.layoutUtil.dashboardLayoutModel._arrangeCards(oCard, {
                row: newRow,
                column: newColumn
            }, 'drag', affectedCards);
            this.layoutUtil.dashboardLayoutModel._removeSpaceBeforeCard(affectedCards);
            this.layoutUtil._positionCards(this.layoutModel.aCards);
            this.layoutUtil.oLayoutCtrl.fireAfterDragEnds({positionChanges: affectedCards});
        };

        //Resize using Key strokes
        KeyboardNavigation.prototype.shiftArrowHandler = function (oCard, oSpan, cardElement) {
            if (oCard.template === "sap.ovp.cards.stack") {
                return;
            }
            this.resizeStartHandler(oCard, cardElement);
            //show only header at maximum vertical resize
            var oCardProperties = this.layoutUtil.calculateCardProperties(oCard.id),
            iLeastHeight = oCardProperties.leastHeight + 2 * this.layoutUtil.CARD_BORDER_PX,
            iLeastRowSpan = Math.ceil(iLeastHeight / this.layoutUtil.getRowHeightPx());
            if (oSpan.rowSpan <= iLeastRowSpan) {
                oSpan.rowSpan = iLeastRowSpan;
                oSpan.showOnlyHeader = true;
                cardElement.classList.add("sapOvpMinHeightContainer");
            } else {
                oSpan.showOnlyHeader = false;
                cardElement.classList.remove("sapOvpMinHeightContainer");
            }
            var oResizeObj = this.layoutUtil.dashboardLayoutModel.resizeCard(oCard.id, oSpan, true, this.layoutUtil.dragOrResizeChanges);
            this.resizeStopHandler(oResizeObj.resizeCard, cardElement);
        };
        KeyboardNavigation.prototype.resizeStartHandler = function(oCard, cardElement) {
            this.layoutUtil.dragOrResizeChanges = [];
            this.layoutUtil.resizeStartCard = {
                cardId: oCard.id,
                rowSpan: oCard.dashboardLayout.rowSpan,
                colSpan: oCard.dashboardLayout.colSpan,
                maxColSpan: oCard.dashboardLayout.maxColSpan,
                noOfItems: oCard.dashboardLayout.noOfItems,
                autoSpan: oCard.dashboardLayout.autoSpan,
                showOnlyHeader: oCard.dashboardLayout.showOnlyHeader
            };
            cardElement.classList.add('sapOvpCardResize');
            oCard.dashboardLayout.autoSpan = false;
        };
        KeyboardNavigation.prototype.resizeStopHandler = function(oCard, cardElement) {
            cardElement.classList.remove('sapOvpCardResize');
            cardElement.style.zIndex = 'auto';
            this.layoutUtil._sizeCard(oCard);
            this.layoutUtil._positionCards(this.layoutModel.aCards);
            //Save all the layout changes to LREP
            oCard.dashboardLayout.maxColSpan = oCard.dashboardLayout.colSpan;
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
                        oldShowOnlyHeader: this.layoutUtil.resizeStartCard.showOnlyHeader
                    }
                },
                isUserDependent: true
            });
            this.layoutUtil.getDashboardLayoutModel().extractCurrentLayoutVariant();
            this.layoutUtil.oLayoutCtrl.fireAfterDragEnds({positionChanges: this.layoutUtil.dragOrResizeChanges});
        };
        KeyboardNavigation.prototype.keyUpHandler = function (e) {
            switch (e.keyCode) {
                case this.keyCodes.SPACE:
                    this.spacebarHandler(e);
                    break;
                default: break;
            }
        };
        // Key Down Handler
        KeyboardNavigation.prototype.keyDownHandler = function (e) {
            var activeItem = document.activeElement,
                sCardId = this.layoutUtil.getCardId(activeItem.id),
                aCards = jQuery.extend([], this.layoutModel.aCards),
                oCard = this.layoutModel.getCardById(sCardId),
                columnCount = this.layoutModel.iColCount,
                tempCards = {}, column, colSpan, columnIndex, rowIndex, cardId, cardsLength, currentCard, oSpan,
                bIsRTL = sap.ui.getCore().getConfiguration().getRTL(),
                jqFocusedElement = jQuery(document.activeElement);
            this.layoutModel._sortCardsByRow(aCards);
            for (var i = 1; i <= columnCount; i++) {
                tempCards[i] = [];
            }
            for (var j = 0; j < aCards.length; j++) {
                column = aCards[j].dashboardLayout.column;
                colSpan = aCards[j].dashboardLayout.colSpan;
                if (colSpan === 1) {
                    tempCards[column].push(aCards[j]);
                } else {
                    for (var k = column; k < column + colSpan; k++) {
                        tempCards[k].push(aCards[j]);
                    }
                }
            }
            rowIndex = this.getCardPosition(sCardId, tempCards[oCard.dashboardLayout.column]);
            switch (e.keyCode) {
                case this.keyCodes.TAB:
                    if (e.shiftKey) {
                        this.shiftTabButtonHandler(e);
                    } else {
                        this.tabButtonHandler(e);
                    }
                    break;
                case this.keyCodes.F6:
                    if (e.shiftKey) {
                        this.bIgnoreSelfFocus = true;
                        this.jqElement.find(".sapUshellEasyScanLayoutInner").focus();
                        F6Navigation.handleF6GroupNavigation(e);
                    } else {
                        this.bIgnoreSelfFocus = true;
                        var beforeScrollLocation = this.jqElement.scrollTop();
                        this.jqElement.find(".after").focus();
                        F6Navigation.handleF6GroupNavigation(e);
                        this.jqElement.scrollTop(beforeScrollLocation);
                    }
                    break;
                case this.keyCodes.F7:
                    e.preventDefault();
                    //If focus is on a Item, move focus to the control inside the Item. Default: first control in the tab chain inside the Item.
                    //If focus is on a control inside a Item, move focus to the Item.
                    if (jqFocusedElement.hasClass("easyScanLayoutItemWrapper")) {
                        //focus on item we place on first element inside
                        jqFocusedElement.find(":sapTabbable").first().focus();
                    } else {
                        //focus inside item, we put it on item itself
                        jqFocusedElement.closest(".easyScanLayoutItemWrapper").focus();
                    }
                    break;
                case this.keyCodes.ARROW_UP:
                    e.preventDefault();
                    columnIndex = oCard.dashboardLayout.column;
                    rowIndex--;
                    cardId = tempCards[columnIndex][rowIndex] && tempCards[columnIndex][rowIndex].id;
                    if (cardId && e.ctrlKey) {
                        this.ctrlArrowHandler(oCard, cardId);
                        this.setFocusOnCard(sCardId);
                    } else if (e.shiftKey) {
                        oSpan = {
                            rowSpan:  oCard.dashboardLayout.rowSpan - 3,
                            colSpan :  oCard.dashboardLayout.colSpan
                        };
                        this.shiftArrowHandler(oCard, oSpan, e.target);
                        this.setFocusOnCard(sCardId);
                    } else if (jqFocusedElement && jqFocusedElement.hasClass("easyScanLayoutItemWrapper")) {
                        this.setFocusOnCard(cardId);
                    }
                    break;
                case this.keyCodes.ARROW_DOWN:
                    e.preventDefault();
                    columnIndex = oCard.dashboardLayout.column;
                    rowIndex++;
                    cardId = tempCards[columnIndex][rowIndex] && tempCards[columnIndex][rowIndex].id;
                    if (cardId && e.ctrlKey) {
                        this.ctrlArrowHandler(oCard, cardId);
                        this.setFocusOnCard(sCardId);
                    } else if (e.shiftKey) {
                        if ((oCard.template === "sap.ovp.cards.linklist" && oCard.settings.listFlavor === 'carousel' && oCard.dashboardLayout.rowSpan >= 45)) {
                            return;
                        }
                        oSpan = {
                            rowSpan:  oCard.dashboardLayout.rowSpan + 3,
                            colSpan :  oCard.dashboardLayout.colSpan
                        };
                        this.shiftArrowHandler(oCard, oSpan, e.target);
                        this.setFocusOnCard(sCardId);
                    } else {
                        this.setFocusOnCard(cardId);
                    }
                    break;
                case this.keyCodes.ARROW_LEFT:
                    var jqFocused = jQuery(document.activeElement);
                    // Handle event only if the focus is on the card
                    if (!jqFocused.hasClass('easyScanLayoutItemWrapper')) {
                        return;
                    }
                    e.preventDefault();
                    columnIndex = oCard.dashboardLayout.column;
                    columnIndex--;
                    if (!tempCards[columnIndex] || !tempCards[columnIndex][rowIndex]) {
                        do {
                            if (columnIndex === 0) {
                                columnIndex = columnCount;
                                rowIndex--;
                                break;
                            }
                            if (rowIndex < 0) {
                                break;
                            }
                            columnIndex--;
                        } while (!tempCards[columnIndex] || !tempCards[columnIndex][rowIndex])
                    }
                    cardId = tempCards[columnIndex][rowIndex] && tempCards[columnIndex][rowIndex].id;
                    if (cardId && e.ctrlKey) {
                        this.ctrlArrowHandler(oCard, cardId);
                        this.setFocusOnCard(sCardId);
                    } else if (e.shiftKey) {
                        if (bIsRTL) {
                            if ((oCard.template === "sap.ovp.cards.list" && oCard.dashboardLayout.colSpan === 2) || (oCard.template === "sap.ovp.cards.linklist" && oCard.settings.listFlavor === 'carousel' && oCard.dashboardLayout.colSpan === 3)) {
                                return;
                            }
                            oSpan = {
                                rowSpan:  oCard.dashboardLayout.rowSpan,
                                colSpan :  oCard.dashboardLayout.colSpan + 1
                            };
                        } else {
                            if (oCard.dashboardLayout.colSpan === 1) {
                                return;
                            }
                            oSpan = {
                                rowSpan:  oCard.dashboardLayout.rowSpan,
                                colSpan :  oCard.dashboardLayout.colSpan - 1
                            };
                        }
                        this.shiftArrowHandler(oCard, oSpan, e.target);
                        this.setFocusOnCard(sCardId);
                    } else {
                        this.setFocusOnCard(cardId);
                    }
                    break;
                case this.keyCodes.ARROW_RIGHT:
                    e.preventDefault();
                    columnIndex = oCard.dashboardLayout.column + oCard.dashboardLayout.colSpan;
                    if (!tempCards[columnIndex] || !tempCards[columnIndex][rowIndex]) {
                        do {
                            if (columnIndex > columnCount) {
                                columnIndex = 1;
                                rowIndex++;
                                break;
                            }
                            columnIndex++;
                        } while (!tempCards[columnIndex] || !tempCards[columnIndex][rowIndex])
                    }
                    cardId = tempCards[columnIndex][rowIndex] && tempCards[columnIndex][rowIndex].id;
                    if (cardId && e.ctrlKey) {
                        this.ctrlArrowHandler(oCard, cardId);
                        this.setFocusOnCard(sCardId);
                    } else if (e.shiftKey) {
                        if (bIsRTL) {
                            if (oCard.dashboardLayout.colSpan === 1) {
                                return;
                            }
                            oSpan = {
                                rowSpan:  oCard.dashboardLayout.rowSpan,
                                colSpan :  oCard.dashboardLayout.colSpan - 1
                            };
                        } else {
                            if ((oCard.template === "sap.ovp.cards.list" && oCard.dashboardLayout.colSpan === 2) || (oCard.template === "sap.ovp.cards.linklist" && oCard.settings.listFlavor === 'carousel' && oCard.dashboardLayout.colSpan === 3)) {
                                return;
                            }
                            oSpan = {
                                rowSpan:  oCard.dashboardLayout.rowSpan,
                                colSpan :  oCard.dashboardLayout.colSpan + 1
                            };
                        }
                        this.shiftArrowHandler(oCard, oSpan, e.target);
                        this.setFocusOnCard(sCardId);
                    } else {
                        this.setFocusOnCard(cardId);
                    }
                    break;
                case this.keyCodes.PAGE_UP:
                    e.preventDefault();
                    columnIndex = oCard.dashboardLayout.column;
                    if (e.altKey == true) {
                        (columnIndex === 1) ? rowIndex = 0 : columnIndex = 1;
                        cardId = tempCards[columnIndex][rowIndex] && tempCards[columnIndex][rowIndex].id;
                    } else {
                        cardsLength = tempCards[columnIndex].length - 1;
                        for (var i = cardsLength; i > 0; i--) {
                            currentCard = document.getElementById(this.layoutUtil.getCardDomId(tempCards[columnIndex][i].id));
                            if (currentCard.getBoundingClientRect().bottom < 0) {
                                cardId = tempCards[columnIndex][i].id;
                                break;
                            }
                        }
                        if (!cardId) {
                            cardId = tempCards[columnIndex][0].id;
                        }
                    }
                    this.setFocusOnCard(cardId);
                    break;
                case this.keyCodes.PAGE_DOWN:
                    e.preventDefault();
                    columnIndex = oCard.dashboardLayout.column;
                    if (e.altKey == true) {
                        cardId = (columnIndex + oCard.dashboardLayout.colSpan) > columnCount ? aCards[aCards.length - 1].id : tempCards[columnCount][rowIndex] && tempCards[columnCount][rowIndex].id;
                    } else {
                        var windowHeight = jQuery(window).height();
                        cardsLength = tempCards[columnIndex].length;
                        for (var i = 0; i < cardsLength; i++) {
                            currentCard = document.getElementById(this.layoutUtil.getCardDomId(tempCards[columnIndex][i].id));
                            if (currentCard.getBoundingClientRect().top > windowHeight) {
                                cardId = tempCards[columnIndex][i].id;
                                break;
                            }
                        }
                        if (!cardId) {
                            cardId = tempCards[columnIndex][cardsLength - 1].id;
                        }
                    }
                    this.setFocusOnCard(cardId);
                    break;
                case this.keyCodes.HOME:
                    e.preventDefault();
                    columnIndex = oCard.dashboardLayout.column;
                    if (e.ctrlKey == true) {
                        (rowIndex === 0) ? columnIndex = 1 : rowIndex = 0;
                    } else {
                        (columnIndex === 1) ? rowIndex = 0 : columnIndex = 1;
                    }
                    cardId = tempCards[columnIndex][rowIndex] && tempCards[columnIndex][rowIndex].id;
                    this.setFocusOnCard(cardId);
                    break;
                case this.keyCodes.END:
                    e.preventDefault();
                    columnIndex = oCard.dashboardLayout.column;
                    if (e.ctrlKey == true) {
                        var lastCardInColumn = tempCards[columnIndex].length - 1;
                        cardId = (lastCardInColumn === rowIndex) ? aCards[aCards.length - 1].id : tempCards[columnIndex][lastCardInColumn] && tempCards[columnIndex][lastCardInColumn].id;
                    } else {
                        cardId = (columnIndex + oCard.dashboardLayout.colSpan) > columnCount ? aCards[aCards.length - 1].id : tempCards[columnCount][rowIndex] && tempCards[columnCount][rowIndex].id;
                    }
                    this.setFocusOnCard(cardId);
                    break;
                case this.keyCodes.ENTER:
                    this.spacebarHandler(e);
                    break;
                default: break;
            }
        };

        /**
         * Method to set focus on card
         *
         * @method setFocusOnCard
         * @param {String} cardId - card id on which focus is to be set
         */
        KeyboardNavigation.prototype.setFocusOnCard = function (cardId) {
            if (cardId) {
                var card = document.getElementById(this.layoutUtil.getCardDomId(cardId));
                card && card.focus();
                this.sLastFocusableCard = card;
                this.layoutUtil.sLastFocusableCard = this.sLastFocusableCard;
            }
        };

        /**
         * Method to calculate the card position in a array
         *
         * @method getCardPosition
         * @param {String} cardId - card id of card which position is to be determined
         * @param {Array} allCards - card array from which position to be determined
         * @return {Integer} i - position of card in the card array
         */
        KeyboardNavigation.prototype.getCardPosition = function (cardId, allCards) {
            for (var i = 0; i < allCards.length; i++) {
                if (allCards[i].id === cardId) {
                    break;
                }
            }
            return i;
        };

        KeyboardNavigation.prototype.tabButtonHandler = function (e) {
            // Forward navigation:
            // On enter first time, move focus to the first Item (as a whole).
            // On enter any consecutive time, move focus to the Item which had the focus before.
            // If focus is on a Item, move focus to the first control in the tab chain inside the Item.
            // If focus is on a control inside a Item, move focus to the next control in the tab chain inside the same Item.
            // If focus is on the last control inside a Item, move focus to the next control in the tab chain after the Item Container
            var jqFocusedElement = jQuery(document.activeElement);
            this.lastFocussedElement = jqFocusedElement;
            if (jqFocusedElement.hasClass("easyScanLayoutItemWrapper")) {
                return;
            }
            var jqItem = jqFocusedElement.closest(".easyScanLayoutItemWrapper");
            // need to check if focus is inside layout item
            if (!jqItem.length) {
                return;
            }
            var lastTabbableItem = jqItem.find(jQuery(".lastElement"));
            // if currently focused element is item's last one, then we place focus outside of layout
            if (jqFocusedElement.is(lastTabbableItem)) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                var beforeScrollLocation = this.jqElement.scrollTop();
                this._ignoreSelfFocus = true;
                this.jqElement.find(".after").focus();
                this.jqElement.scrollTop(beforeScrollLocation);
            }
        };

        KeyboardNavigation.prototype.shiftTabButtonHandler = function (e) {
            // Backward navigation:
            // On enter first time, move focus to the last control of the first Item.
            // If focus is on a control inside a Item, move focus to the previous control in the tab chain inside the same Item.
            // If focus is on the first control inside a Item, move focus to the corresponding Item (as a whole).
            // If focus is on a Item, move focus to the previous control in the tab chain before the Item Container.
            var jqFocusedElement = jQuery(document.activeElement);
            if (jqFocusedElement.hasClass('after') && this.lastFocussedElement) {
                this.lastFocussedElement.focus();
                return;
            }

            if (!jqFocusedElement.hasClass("easyScanLayoutItemWrapper")) {
                return;
            }
            // focus was on the Item, move focus to the previous control in the tab chain before the Item Container
            // we  put focus on layout itself, so browser will move it outside of layout
            this._ignoreSelfFocus = true;
            this.lastFocussedElement = jqFocusedElement;
            this.jqElement.find(".sapUshellEasyScanLayoutInner").focus();
        };

        KeyboardNavigation.prototype.afterFocusHandler = function () {
            // Two options are possible, or focus came to us from outside, as a result of outside navigation (Shift+tab Shift+F6 etc...)
            // or we put focus as a result of Tab button inside layout, to maintain Accessibility guide:
            // If focus is on the last control inside a Item, move focus to the next control in the tab chain after the Item Container
            if (this._ignoreSelfFocus) {
                // focus was on the last control inside a Item, move focus to the next control in the tab chain after the Item Container
                // so, this function was called from tabButtonHandler,  we put focus on after element, so browser will move it outside of layout
                this._ignoreSelfFocus = false;
                return;
            }
            var jqItem, lastTabbable;
            if (this.lastFocussedElement && this.lastFocussedElement.hasClass('lastElement')) {
                jqItem = this.jqElement.find(this.lastFocussedElement.parent());
                lastTabbable = jqItem.find(":sapTabbable").last();
            } else if (this.lastFocussedElement && this.lastFocussedElement.hasClass('easyScanLayoutItemWrapper')){
                // if the focus last was on the card and the user used shift + tab to navigate back to the card layout
                lastTabbable = this.lastFocussedElement;
            } else {
                // focus came to us from outside, as a result of outside navigation (Shift+tab Shift+F6 etc...)
                // On enter first time, move focus to the last control of the first Item.
                // On enter any consecutive time, move focus to the last control of the Item which had the focus before
                jqItem = this.jqElement.find(".easyScanLayoutItemWrapper:sapTabbable").first();
                lastTabbable = jqItem.find(":sapTabbable").last();
            }
            if (!lastTabbable.length) {
                lastTabbable = jqItem;
            }
            lastTabbable.focus();
        };

        return DashboardLayout;
    });
