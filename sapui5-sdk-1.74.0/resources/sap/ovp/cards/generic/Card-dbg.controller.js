sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ovp/cards/ActionUtils",
        "sap/ui/generic/app/navigation/service/SelectionVariant",
        "sap/ui/generic/app/navigation/service/PresentationVariant",
        "sap/ovp/cards/CommonUtils", "sap/ovp/cards/OVPCardAsAPIUtils",
        "sap/ui/core/ResizeHandler", "sap/ui/core/format/NumberFormat",
        "sap/ovp/cards/AnnotationHelper", "sap/ui/model/odata/AnnotationHelper",
        "sap/m/MessageBox", "sap/ui/generic/app/navigation/service/NavError",
        "sap/ui/core/CustomData", "sap/ui/model/FilterOperator","sap/ui/model/json/JSONModel",
        "sap/m/Dialog", "sap/m/Button", "sap/m/MessageToast", "sap/ui/core/TextDirection",
        "sap/ui/generic/app/library", "sap/ui/thirdparty/jquery", "sap/ovp/app/resources",
        "sap/ovp/app/OVPUtils", "sap/base/Log", "sap/ui/events/KeyCodes", "sap/base/util/isPlainObject"],
    function (Controller, ActionUtils, SelectionVariant, PresentationVariant,
              CommonUtils, OVPCardAsAPIUtils, ResizeHandler, NumberFormat, CardAnnotationHelper,
              OdataAnnotationHelper, MessageBox, NavError, CustomData, FilterOperator,
              JSONModel, Dialog, Button, MessageToast, TextDirection, GenericAppLibrary, jQuery, OvpResources, OVPUtils, Log, KeyCodes, isPlainObject) {
        "use strict";
        return Controller.extend("sap.ovp.cards.generic.Card", {
            initKeyboardNavigation: function () {

                var KeyboardNavigation = function (cardLayout) {
                    this.init(cardLayout);
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

                KeyboardNavigation.prototype.init = function (cardLayout) {
                    this.cardLayout = cardLayout;
                    this.keyCodes = KeyCodes;
                    this.jqElement = jQuery(cardLayout.getView().$());
                    this.jqElement = this.jqElement.parent().parent().parent();
                    this.jqElement.on("focus.keyboardNavigation", this.layoutItemFocusHandler.bind(this));

                };
                this.keyboardNavigation = new KeyboardNavigation(this);
            },


            onInit: function () {
                this.oCardComponent = this.getOwnerComponent();
                this.oCardComponentData = this.oCardComponent && this.oCardComponent.getComponentData();
                this.oMainComponent = this.oCardComponentData && this.oCardComponentData.mainComponent;
                this.sCardId = this.oCardComponentData.cardId;
                /**
                 *If the state is 'Loading' or 'Error', we do not render the header. Hence, this is no oHeader.
                 */
                var sState = this.getView().mPreprocessors.xml[0].ovpCardProperties.oData.state;
                if (sState !== "Error") {
                    var oHeader = this.getView().byId("ovpCardHeader");
                    if (!!oHeader) {
                        oHeader.attachBrowserEvent("click", this.onHeaderClick.bind(this));
                        oHeader.addEventDelegate({
                            onkeydown: function (oEvent) {
                                if (!oEvent.shiftKey && oEvent.keyCode == 13) {
                                    oEvent.preventDefault();
                                    this.onHeaderClick(oEvent);
                                } else if (!oEvent.shiftKey && oEvent.keyCode == 32) {
                                    oEvent.preventDefault();
                                }
                            }.bind(this)
                        });
                        oHeader.addEventDelegate({
                            onkeyup: function (oEvent) {
                                if (!oEvent.shiftKey && oEvent.keyCode == 32) {
                                    oEvent.preventDefault();
                                    this.onHeaderClick(oEvent);
                                }
                            }.bind(this)
                        });
                    }
                }
                var oNumericControl = this.getView().byId("kpiNumberValue");
                if (oNumericControl) {
                    oNumericControl.addEventDelegate({
                        onAfterRendering: function () {
                            var $numericControl = oNumericControl.$();
                            var $number = $numericControl.find(".sapMNCValueScr");
                            var $scale = $numericControl.find(".sapMNCScale");
                            $number.attr("aria-label", $number.text());
                            $scale.attr("aria-label", $scale.text());
                            /*
                             For restricting target and deviation in KPI Header to move towards the right
                             */
                            var $header = this.getView().byId("ovpCardHeader").getDomRef();
                            var oCompData = this.getOwnerComponent().getComponentData();
                            if (!!oCompData && !!oCompData.appComponent) {
                                var oAppComponent = oCompData.appComponent;
                                if (!!oAppComponent.getModel("ui")) {
                                    var oUiModel = oAppComponent.getModel("ui");
                                    if (!!oUiModel.getProperty("/containerLayout") && oUiModel.getProperty("/containerLayout") === "resizable") {
                                        var oDashboardLayoutUtil = oCompData.appComponent.getDashboardLayoutUtil();
                                        if (!!oDashboardLayoutUtil) {
                                            oDashboardLayoutUtil.setKpiNumericContentWidth($header);
                                        }
                                    }
                                }
                            }
                        }.bind(this)
                    });
                }
            },

            exit: function () {
                //de-register event handler
                if (this.resizeHandlerId) {
                    ResizeHandler.deregister(this.resizeHandlerId);
                }
            },

            onAfterRendering: function () {
                var oCardPropertiesModel = this.getCardPropertiesModel();
                //Flag added to enable click on header/line item
                this.enableClick = true;
                var sContentFragment = oCardPropertiesModel.getProperty("/contentFragment");
                var oCompData = this.getOwnerComponent().getComponentData();
                this._handleCountHeader();
                this._handleKPIHeader();
                var sSelectedKey = oCardPropertiesModel.getProperty("/selectedKey");
                if (sSelectedKey && oCardPropertiesModel.getProperty("/state") !== 'Loading') {
                    var oDropDown = this.getView().byId("ovp_card_dropdown");
                    if (oDropDown) {
                        oDropDown.setSelectedKey(sSelectedKey);
                    }
                }

                //if this card is owned by a Resizable card layout, check if autoSpan is required and register event handler
                try {
                    var oCompData = this.getOwnerComponent().getComponentData();
                    if (oCompData && oCompData.appComponent) {
                        var oAppComponent = oCompData.appComponent;
                        if (oAppComponent.getModel('ui')) {
                            var oUiModel = oAppComponent.getModel('ui');
                            //Check Added for Resizable card layout
                            if (oUiModel.getProperty('/containerLayout') === 'resizable') {
                                var oDashboardLayoutUtil = oAppComponent.getDashboardLayoutUtil();
                                if (oDashboardLayoutUtil) {
                                    this.oDashboardLayoutUtil = oDashboardLayoutUtil;
                                    this.cardId = oCompData.cardId;
                                    if (oDashboardLayoutUtil.isCardAutoSpan(oCompData.cardId)) {
                                        this.resizeHandlerId = ResizeHandler.register(this.getView(), function (oEvent) {
                                            Log.info('DashboardLayout autoSize:' + oEvent.target.id + ' -> ' + oEvent.size.height);
                                            oDashboardLayoutUtil.setAutoCardSpanHeight(oEvent);
                                        });
                                    }
                                }
                            }
                        }
                    }
                } catch (err) {
                    Log.error("DashboardLayout autoSpan check failed.");
                }

                //Resizable card layout: autoSpan cards - size card wrapper to card height
                if (this.oDashboardLayoutUtil && this.oDashboardLayoutUtil.isCardAutoSpan(this.cardId)) {
                    var $wrapper = jQuery("#" + this.oDashboardLayoutUtil.getCardDomId(this.cardId));
                    if (this.oView.$().outerHeight() > $wrapper.innerHeight()) {
                        this.oDashboardLayoutUtil.setAutoCardSpanHeight(null, this.cardId, this.oView.$().height());
                    }
                }

                var bIsNavigable = 0;
                if (oCompData && oCompData.mainComponent) {
                    var oMainComponent = oCompData.mainComponent;
                    //Flag bGlobalFilterLoaded is set only when the oGlobalFilterLodedPromise is resolved
                    if (oMainComponent.bGlobalFilterLoaded) {
                        bIsNavigable = this.checkNavigation();
                    }
                } else if (OVPCardAsAPIUtils.checkIfAPIIsUsed(this)) {
                    bIsNavigable = this.checkAPINavigation();
                }

                // checking if header is non navigable then removing the view all link from the stack card
                var oCardPropertyModel = this.getCardPropertiesModel();
                var sState = oCardPropertyModel.getProperty("/state");
                if (sState !== "Loading" && sState !== "Error") {
                    var cardType = oCardPropertyModel.getProperty("/template");
                    if (cardType === "sap.ovp.cards.stack") {
                        if (!bIsNavigable) {
                            var viewAllLink = this.getView().byId('ViewAll');
                            if (viewAllLink) {
                                viewAllLink = viewAllLink.getDomRef();
                                jQuery(viewAllLink).remove();
                            }
                        }
                    }
                }

                //var sContentFragment = this.getCardPropertiesModel().getProperty("/contentFragment");
                if (bIsNavigable) {
                    /**
                     * If it's a Quickview card, it should not have "cursor: pointer" set.
                     * Only the header and footer action items of Quickview card are navigable.
                     */
                    if (sContentFragment ? sContentFragment !== "sap.ovp.cards.quickview.Quickview" : true) {
                        if (sContentFragment === "sap.ovp.cards.stack.Stack") {
                            var oCardRef = this.getView().getDomRef();
                            var stackContainer = jQuery(oCardRef).find('.sapOvpCardContentRightHeader');
                            if (stackContainer.length !== 0) {
                                stackContainer.addClass('sapOvpCardNavigable');
                            }
                        } else {
                            this.getView().addStyleClass("sapOvpCardNavigable");
                        }
                    }
                    if (sContentFragment && sContentFragment === "sap.ovp.cards.quickview.Quickview") {
                        var oHeader = this.byId("ovpCardHeader");
                        if (oHeader) {
                            oHeader.addStyleClass("sapOvpCardNavigable");
                        }
                    }
                } else {
                    if (sContentFragment) {
                        this.getView().addStyleClass("ovpNonNavigableItem");
                        // removing the role=button if the navigation for the header is not available
                        var oHeader = this.byId("ovpCardHeader");
                        if (oHeader) {
                            oHeader.$().removeAttr('role');
                            oHeader.addStyleClass('ovpNonNavigableItem');
                        }

                        var bIsLineItemNavigable = this.checkLineItemNavigation();
                        if (!bIsLineItemNavigable) {
                            // setting the list item to inactive if the navigation is not available for the card.
                            switch (sContentFragment) {
                                case "sap.ovp.cards.list.List" :
                                    var listItem = this.getView().byId("listItem");
                                    if (listItem) {
                                        listItem.setType("Inactive");
                                    }
                                    break;
                                case "sap.ovp.cards.table.Table" :
                                    var listItem = this.getView().byId("tableItem");
                                    if (listItem) {
                                        listItem.setType("Inactive");
                                    }
                                    break;
                                case "sap.ovp.cards.linklist.LinkList" :
                                    if (!this.checkNavigationForLinkedList()) {
                                        var listItem = this.getView().byId("ovpCLI");
                                        if (listItem) {
                                            listItem.setType("Inactive");
                                        }
                                    }
                                    break;
                            }
                        }
                    }
                }

                var dropDown = this.getView().byId("ovp_card_dropdown");
                var invisibleText = this.getView().byId("ovp_card_dropdown_label");
                if (dropDown) {
                    dropDown.addAriaLabelledBy(invisibleText.getId());
                }


                if (OVPCardAsAPIUtils.checkIfAPIIsUsed(this)) {

                    this.initKeyboardNavigation();

                }

            },

            checkNavigation: function () {
                var oCardPropsModel = this.getCardPropertiesModel();
                if (this.checkHeaderNavForChart()) {
                    return 0;
                }
                var oEntityType = this.getEntityType();
                if (oEntityType) {
                    if (oCardPropsModel) {
                        var sIdentificationAnnotationPath = oCardPropsModel.getProperty("/identificationAnnotationPath");
                        var sAnnotationPath = sIdentificationAnnotationPath;
                        /* In case of Stack Card, there can be two entries for the identification annotation path
                         When more than one IdentificationAnnotationPath exists, they need to be split and assigned accordingly to Stack and Quickview Cards */
                        var sContentFragment = oCardPropsModel.getProperty("/contentFragment");
                        if (sContentFragment && (sContentFragment === "sap.ovp.cards.stack.Stack" || sContentFragment === "sap.ovp.cards.quickview.Quickview")) {
                            var aAnnotationPath = (sIdentificationAnnotationPath) ? sIdentificationAnnotationPath.split(",") : [];
                            if (aAnnotationPath && aAnnotationPath.length > 1) {
                                if (sContentFragment === "sap.ovp.cards.stack.Stack") {
                                    sAnnotationPath = aAnnotationPath[0];
                                } else {
                                    sAnnotationPath = aAnnotationPath[1];
                                }
                            }
                        }
                        // if we have an array object e.g. we have records
                        var aRecords = oEntityType[sAnnotationPath];
                        if (this.isNavigationInAnnotation(aRecords)) {
                            return 1;
                        }

                        if (oCardPropsModel && oCardPropsModel.getProperty("/template") === "sap.ovp.cards.charts.analytical") {
                            var sKpiAnnotationPath = oCardPropsModel.getProperty("/kpiAnnotationPath");
                            if (oEntityType && sKpiAnnotationPath) {
                                var oRecord = oEntityType[sKpiAnnotationPath];
                                if (oRecord && oRecord.Detail) {
                                    var sSemanticObject = oRecord.Detail.SemanticObject && oRecord.Detail.SemanticObject.String;
                                    var sAction = oRecord.Detail.Action && oRecord.Detail.Action.String;
                                    if (sSemanticObject && sAction) {
                                        return 1;
                                    }
                                }
                            }
                        }

                    }
                } else if (oCardPropsModel && oCardPropsModel.getProperty("/template") === "sap.ovp.cards.linklist" &&
                    oCardPropsModel.getProperty("/staticContent") &&
                    oCardPropsModel.getProperty("/targetUri")) {
                    return 1;
                }
                return 0;
            },

            checkNavigationForLinkedList: function () {
                if (this.getEntityType()) {
                    var oEntityType = this.getEntityType();
                    var oLineItemRecords = oEntityType['com.sap.vocabularies.UI.v1.LineItem'];
                    if (oLineItemRecords && (oLineItemRecords[0].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction" ||
                        oLineItemRecords[0].RecordType === "com.sap.vocabularies.UI.v1.DataFieldWithUrl")) {
                        return true;
                    }
                    //commented because in case contact annotation only title should be clickable to show quick view popover
                    //return oEntityType.hasOwnProperty('com.sap.vocabularies.Communication.v1.Contact');
                }
                return false;
            },

            checkLineItemNavigation: function () {
                if (this.getEntityType()) {
                    var oEntityType = this.getEntityType();
                    var oCardPropsModel = this.getCardPropertiesModel();
                    if (oCardPropsModel) {
                        var sAnnotationPath = oCardPropsModel.getProperty("/annotationPath");
                        var aRecords = oEntityType[sAnnotationPath];
                        return this.isNavigationInAnnotation(aRecords);
                    }
                }
            },

            isNavigationInAnnotation: function (aRecords) {
                if (aRecords && aRecords.length) {
                    for (var i = 0; i < aRecords.length; i++) {
                        var oItem = aRecords[i];
                        if (oItem.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" ||
                            oItem.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction" ||
                            oItem.RecordType === "com.sap.vocabularies.UI.v1.DataFieldWithUrl") {
                            return 1;
                        }
                    }
                }
                return 0;
            },

            checkAPINavigation: function () {
                var oComponentData = this.getOwnerComponent().getComponentData(),
                    bCheckIfValidArg = oComponentData.fnCheckNavigation && typeof oComponentData.fnCheckNavigation === "function",
                    fnCheckNavigation = bCheckIfValidArg ? oComponentData.fnCheckNavigation : null;

                if (fnCheckNavigation) {
                    if (fnCheckNavigation()){
                        return true;
                    }
                } else {
                    if (this.checkNavigation()){
                        return true;
                    }
                }

                return false;
            },

            onHeaderClick: function (oEvent) {

                //removing check for bCTRLPressed as any pressed with control key or command key will be either ctrlKey or metaKey for windows and mac respectively
                var sNavMode = oEvent.ctrlKey || oEvent.metaKey ? OVPUtils.constants.explace : OVPUtils.constants.inplace;
                /*
                 On Header click of OVP Cards used as an API in other Applications
                 */
                if (OVPCardAsAPIUtils.checkIfAPIIsUsed(this)) {
                    if (this.checkAPINavigation()){
                        //The function is only called when there is a valid semantic object and action is available
                        CommonUtils.onHeaderClicked();
                    }
                } else {
                    //Only for static linklist cards, the navigation destination is the URL specified as the targetUri property's value in the manifest.
                    var oCardPropertiesModel = this.getCardPropertiesModel();
                    var template = oCardPropertiesModel.getProperty("/template");
                    var sTargetUrl = oCardPropertiesModel.getProperty("/targetUri");

                    if (template == "sap.ovp.cards.linklist" && oCardPropertiesModel.getProperty("/staticContent") !== undefined && sTargetUrl) {
                        window.location.href = sTargetUrl;
                    } else if (oCardPropertiesModel.getProperty("/staticContent") !== undefined && sTargetUrl === "") {
                        return;
                    } else if (this.checkHeaderNavForChart()) {
                        return;
                    }else {
                        //call the navigation with the binded context to support single object cards such as quickview card
                        this.doNavigation(this.getView().getBindingContext(), null, sNavMode);
                    }
                }
            },
            checkHeaderNavForChart: function () {
                var oCardPropertiesModel = this.getCardPropertiesModel();
                var template = oCardPropertiesModel.getProperty("/template");
                var navigation = oCardPropertiesModel.getProperty("/navigation");
                if (navigation == "noHeaderNav" && (template == "sap.ovp.cards.charts.analytical" || "sap.ovp.cards.charts.smart.chart")) {
                    return true;
                } else {
                    return false;
                }
            },

            resizeCard: function (cardSpan) {
                Log.info(cardSpan);
                //card was manually resized --> de-register handler
                if (this.resizeHandlerId) {
                    ResizeHandler.deregister(this.resizeHandlerId);
                    this.resizeHandlerId = null;
                }
            },
            /*_handleCountFooter: function () {
             var countFooter = this.getView().byId("ovpCountFooter");

             if (countFooter) {
             var countFooterParent = countFooter.$().parent();
             countFooterParent.addClass("sapOvpCardFooterBorder");
             }

             if (countFooter) {
             //Gets the card items binding object
             var oItemsBinding = this.getCardItemsBinding();
             if (oItemsBinding) {
             oItemsBinding.attachDataReceived(function () {
             var iTotal = oItemsBinding.getLength();
             var iCurrent = oItemsBinding.getCurrentContexts().length;
             var countFooterText = OvpResources.getText("Count_Zero_Footer");
             if (iTotal !== 0) {
             countFooterText = OvpResources.getText("Count_Footer", [iCurrent, iTotal]);
             }
             countFooter.setText(countFooterText);
             var countFooterDomRef = countFooter.$();
             countFooterDomRef.attr("aria-label", countFooterText);
             });
             }
             }
             },*/
            //Function to display header counter
            _handleCountHeader: function () {
                var countFooter = this.getView().byId("ovpCountHeader");
                if (countFooter) {
                    //Gets the card items binding object
                    var oItemsBinding = this.getCardItemsBinding();
                    if (oItemsBinding) {
                        /*There have been instances when the data is received before attaching the event "attachDataReceived"
                         is made.As a result, no counter comes in the header on intital load.Therefore, an explicit
                         call is made to set the header counter.*/
                         if (oItemsBinding.getLength() > 0) {
                            this.setHeaderCounter(oItemsBinding, countFooter);
                         }
                        oItemsBinding.attachDataReceived(function () {
                            this.setHeaderCounter(oItemsBinding, countFooter);
                        }.bind(this));
                        oItemsBinding.attachChange(function () {
                            this.setHeaderCounter(oItemsBinding, countFooter);
                        }.bind(this));
                    }
                }

            },

            setHeaderCounter: function (oItemsBinding, countFooter) {
                var iTotal = oItemsBinding.getLength();
                var iCurrent = oItemsBinding.getCurrentContexts().length;
                var oCard, countFooterText = "";
                var numberFormat = NumberFormat.getIntegerInstance({
                    minFractionDigits: 0,
                    maxFractionDigits: 1,
                    decimalSeparator: ".",
                    style: "short"
                });
                iCurrent = parseFloat(iCurrent, 10);
                var oCompData = this.getOwnerComponent().getComponentData();
                //Check Added for Fixed card layout
                if (oCompData && oCompData.appComponent) {
                    var oAppComponent = oCompData.appComponent;
                    if (oAppComponent.getModel('ui')) {
                        var oUiModel = oAppComponent.getModel('ui');
                        //Check Added for Resizable card layout
                        if (oUiModel.getProperty('/containerLayout') !== 'resizable') {
                            if (iTotal !== 0) {
                                iTotal = numberFormat.format(Number(iTotal));
                            }
                            if (iCurrent !== 0) {
                                iCurrent = numberFormat.format(Number(iCurrent));
                            }
                        } else {
                            oCard = oAppComponent.getDashboardLayoutUtil().dashboardLayoutModel.getCardById(oCompData.cardId);
                        }
                    }
                }
                /*Set counter in header if
                 * (i)   All the items are not displayed
                 * (ii) Card is resized to its header
                 */
                if (iCurrent === 0) {
                    countFooterText = "";
                } else if (oCard && oCard.dashboardLayout.showOnlyHeader) {
                    //Display only total indication in case the card is resized to its header
                    countFooterText = OvpResources.getText("Count_Header_Total", [iTotal]);
                } else if (iTotal != iCurrent) {
                    //Display both current and total indication in the other scenarios
                    countFooterText = OvpResources.getText("Count_Header", [iCurrent, iTotal]);
                }
                countFooter.setText(countFooterText);
                var countFooterDomRef = countFooter.$();
                countFooterDomRef.attr("aria-label", countFooterText);
            },

            /*
             *   Hide the KPI Header when there is no Data to be displayed
             */
            _handleKPIHeader: function () {
                var kpiHeader, subTitle;
                if (this.getView() && this.getView().getDomRef()) {
                    kpiHeader = this.getView().getDomRef().getElementsByClassName("numericContentHbox");
                    subTitle = this.getView().getDomRef().getElementsByClassName("noDataSubtitle");
                } else {
                    return;
                }
                if (kpiHeader || subTitle) {
                    var oKPIBinding = this.getKPIBinding();
                    if (oKPIBinding) {
                        oKPIBinding.attachDataReceived(function (oEvent) {
                            var UoM = oEvent.getParameter("data") && oEvent.getParameter("data").results && oEvent.getParameter("data").results[0];
                            var iTotal = oKPIBinding.getLength();
                            if (kpiHeader[0]) {
                                kpiHeader[0].style.visibility = null;
                                if (iTotal === 0) {
                                    kpiHeader[0].style.visibility = 'hidden';
                                } else {
                                    this._setSubTitleWithUnitOfMeasure(UoM);
                                    kpiHeader[0].style.visibility = 'visible';
                                }
                            }
                            if (subTitle.length !== 0) {
                                subTitle[0].style.display = "none";
                                if (iTotal === 0) {
                                    subTitle[0].style.display = "flex";
                                }
                            }
                        }.bind(this));
                    }
                }
            },

            /*
             *  Get KPI Binding to display in Card Header
             */
            getKPIBinding: function(){
                var oNumericBox = this.byId("kpiHBoxNumeric"),
                oKPIBinding = oNumericBox && oNumericBox.getBindingInfo("items") && oNumericBox.getBindingInfo("items").binding;
                return oKPIBinding;
            },

            /*
             *  SubTitle with unit of measure
             */
            _setSubTitleWithUnitOfMeasure: function (UoM) {
                var oCardPropertiesModel = this.getCardPropertiesModel();
                if (!!oCardPropertiesModel) {
                    var oData = oCardPropertiesModel.getData();
                    var oSubtitleTextView = this.getView().byId("SubTitle-Text");
                    if (!!oSubtitleTextView) {
                        oSubtitleTextView.setText(oData.subTitle);
                        if (!!oData && !!oData.entityType && !!oData.dataPointAnnotationPath) {
                            var oEntityType = oCardPropertiesModel.getData().entityType;
                            var oDataPointAnnotationPathSplit = oData.dataPointAnnotationPath.split("/");
                            var oDataPoint = oDataPointAnnotationPathSplit.length === 1 ? oEntityType[oData.dataPointAnnotationPath] : oEntityType[oDataPointAnnotationPathSplit[0]][oDataPointAnnotationPathSplit[1]];
                            var measure;
                            if (oDataPoint && oDataPoint.Value && oDataPoint.Value.Path) {
                                measure = oDataPoint.Value.Path;
                            } else if (oDataPoint && oDataPoint.Description && oDataPoint.Description.Value && oDataPoint.Description.Value.Path) {
                                measure = oDataPoint.Description.Value.Path;
                            }
                            if (!!measure) {
                                var sPath = CommonUtils.getUnitColumn(measure, oEntityType);
                                var unitOfMeasure;
                                if (!!sPath && !!UoM) {
                                    unitOfMeasure = UoM[sPath];
                                } else {
                                    unitOfMeasure = CommonUtils.getUnitColumn(measure, oEntityType, true);
                                }
                                var subTitleInText = OvpResources.getText("SubTitle_IN");
                                if (!!oData.subTitle && !!subTitleInText && !!unitOfMeasure) {
                                    oSubtitleTextView.setText(oData.subTitle + " " + subTitleInText + " " + unitOfMeasure);
                                    var aCustomData = oSubtitleTextView.getAggregation("customData");
                                    if (aCustomData) {
                                        var index;
                                        for (index in aCustomData) {
                                            var oCustomData = aCustomData[index];
                                            if (oCustomData.getKey() === "aria-label") {
                                                oCustomData.setValue(oData.subTitle + " " + subTitleInText + " " + unitOfMeasure);
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },

            /**
             * default empty implementation for the count footer
             */
            getCardItemsBinding: function () {
            },

            onActionPress: function (oEvent) {
                var sourceObject = oEvent.getSource(),
                    oCustomData = this._getActionObject(sourceObject),
                    context = sourceObject.getBindingContext();
                if (oCustomData.type.indexOf("DataFieldForAction") !== -1) {
                    this.doAction(context, oCustomData);
                } else {
                    this.doNavigation(context, oCustomData);
                }
            },
            _getActionObject: function (sourceObject) {
                var aCustomData = sourceObject.getCustomData();
                var oCustomData = {};
                for (var i = 0; i < aCustomData.length; i++) {
                    oCustomData[aCustomData[i].getKey()] = aCustomData[i].getValue();
                }
                return oCustomData;
            },

            doNavigation: function (oContext, oNavigationField, sNavMode) {
                if (!sNavMode) {
                    sNavMode = OVPUtils.constants.inplace;
                }
                //handle multiple clicks of line item/header
                if (!this.enableClick) {
                    return;
                }
                this.enableClick = false;
                setTimeout(function () {
                    this.enableClick = true;
                }.bind(this), 1000);

                //Main Component is required for further processing
                if (!this.oMainComponent) {
                    return;
                }
                if (!oNavigationField) {
                    oNavigationField = this.getEntityNavigationEntries(oContext)[0];
                }

                //Create copy of objects so that they are not altered from extension function
                var oContextCopy = jQuery.extend(true, {}, oContext);
                var oNavigationFieldCopy = jQuery.extend(true, {}, oNavigationField);

                //Get custom navigation entry from extension controller
                //Custom navigation entry should be object with properties {type, semanticObject, action, url, label}
                //url property to be used for type DataFieldWithUrl else semanticObject & action can be used
                var oCustomNavigationEntry = this.oMainComponent.doCustomNavigation &&
                    this.oMainComponent.doCustomNavigation(this.sCardId, oContextCopy, oNavigationFieldCopy);


                //Get custom navigation entry from adaptation controller
                //Custom navigation entry should be object with properties {type, semanticObject, action, url, label}
                //url property to be used for type DataFieldWithUrl else semanticObject & action can be used
                var oExtensonNavigationEntry = this.oMainComponent.templateBaseExtension && this.oMainComponent.templateBaseExtension.provideExtensionNavigation &&
                    this.oMainComponent.templateBaseExtension.provideExtensionNavigation(this.sCardId, oContextCopy, oNavigationFieldCopy);

                var oFinalNavigationEntry;
                if (oCustomNavigationEntry) {
                    oFinalNavigationEntry = oCustomNavigationEntry;
                }
                if (oExtensonNavigationEntry) {
                    oFinalNavigationEntry = oExtensonNavigationEntry;
                }

                //If custom navigation is defined in extension, then override standard navigation with custom
                if (oFinalNavigationEntry) {
                    var sType = oFinalNavigationEntry.type;
                    if (sType && typeof sType === "string" && sType.length > 0) {
                        //Refine any inconsistent value coming from custom method
                        sType = sType.split(".").pop().split("/").pop().toLowerCase();
                        switch (sType) {
                            case "datafieldwithurl":
                                oFinalNavigationEntry.type = "com.sap.vocabularies.UI.v1.DataFieldWithUrl";
                                break;
                            case "datafieldforintentbasednavigation":
                                oFinalNavigationEntry.type = "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation";
                                break;
                        }
                        oNavigationField = oFinalNavigationEntry;
                    }
                }

                function fnProcessNavigation(sNavMode) {
                    if (!sNavMode) {
                        sNavMode = OVPUtils.constants.inplace;
                    }
                    if (oNavigationField) {
                        switch (oNavigationField.type) {
                            case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
                                this.doNavigationWithUrl(oContext, oNavigationField, sNavMode);
                                break;
                            case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
                                this.doIntentBasedNavigation(oContext, oNavigationField, false, sNavMode);
                                break;
                            case "com.sap.vocabularies.UI.v1.KPIDetailType":
                                this.doIntentBasedNavigation(oContext, oNavigationField, false, sNavMode);
                                break;
                        }
                    }
                }

                //The inner appState required for back navigation is already created in main controller
                //during filter change/search, the same old appstate will be used during navigation
                if (!this.oMainComponent.oAppStatePromise) {
                    fnProcessNavigation.call(this, sNavMode);
                } else {
                    this.oMainComponent.oAppStatePromise.then(fnProcessNavigation.bind(this, sNavMode));
                }
            },

            doNavigationWithUrl: function (oContext, oNavigationField, sNavMode) {
                if (!sNavMode) {
                    sNavMode = OVPUtils.constants.inplace;
                }

                //Container comes from FLP. For apps without FLP, the container will be missing
                if (!sap.ushell.Container) {
                    return;
                }
                var oParsingSerivce = sap.ushell.Container.getService("URLParsing");

                //Checking if navigation is external or IntentBasedNav with paramters
                //If Not a internal navigation, navigate in a new window
                if (!(oParsingSerivce.isIntentUrl(oNavigationField.url))) {
                    window.open(oNavigationField.url);
                } else {
                    var oParsedShellHash = oParsingSerivce.parseShellHash(oNavigationField.url);
                    //Url can also contain an intent based navigation with route, route can be static or dynamic with paramters
                    //Url navigation without app specific route will trigger storing of appstate
                    var bWithRoute = oParsedShellHash.appSpecificRoute ? true : false;
                    this.doIntentBasedNavigation(oContext, oParsedShellHash, bWithRoute, sNavMode);
                }
            },

            fnHandleError: function (oError) {
                if (oError instanceof NavError) {
                    if (oError.getErrorCode() === "NavigationHandler.isIntentSupported.notSupported") {
                        MessageBox.show(OvpResources.getText("OVP_NAV_ERROR_NOT_AUTHORIZED_DESC"), {
                            title: OvpResources.getText("OVP_GENERIC_ERROR_TITLE")
                        });
                    } else {
                        MessageBox.show(oError.getErrorCode(), {
                            title: OvpResources.getText("OVP_GENERIC_ERROR_TITLE")
                        });
                    }
                }
            },

            doCrossApplicationNavigation: function (oIntent, oNavArguments) {
                var sIntent = "#" + oIntent.semanticObject + '-' + oIntent.action;
                if (oIntent.params) {
                    var oComponentData = this.oCardComponent && this.oCardComponent.getComponentData();
                    var oAppComponent = oComponentData && oComponentData.appComponent;
                    if (oAppComponent) {
                        var sParams = oAppComponent._formParamString(oIntent.params);
                        sIntent = sIntent + sParams;
                    }
                }
                var that = this;
                //Container comes from FLP. For apps without FLP, the container will be missing
                if (!sap.ushell.Container) {
                    return;
                }
                sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported([sIntent])
                    .done(function (oResponse) {
                        if (oResponse[sIntent].supported === true) {
                            // enable link
                            if (!!oNavArguments.params) {
                                if (typeof oNavArguments.params == 'string') {
                                    try {
                                        oNavArguments.params = JSON.parse(oNavArguments.params);
                                    } catch (err) {
                                        Log.error("Could not parse the Navigation parameters");
                                        return;
                                    }
                                }
                            }
                            /*
                             Adding Global filters to Navigation Parameters
                             */
                            var oComponentData = that.getOwnerComponent().getComponentData();
                            var oGlobalFilter = oComponentData ? oComponentData.globalFilter : undefined;
                            var oUiState = oGlobalFilter && oGlobalFilter.getUiState({
                                    allFilters: false
                                });
                            var sSelectionVariant = oUiState ? JSON.stringify(oUiState.getSelectionVariant()) : "{}";
                            oGlobalFilter = jQuery.parseJSON(sSelectionVariant);

                            var mFilterPreference = that._getFilterPreference();
                            oGlobalFilter = that._removeFilterFromGlobalFilters(mFilterPreference, oGlobalFilter);

                            if (!oNavArguments.params) {
                                oNavArguments.params = {};
                            }
                            if (!!oGlobalFilter && !!oGlobalFilter.SelectOptions) {
                                for (var i = 0; i < oGlobalFilter.SelectOptions.length; i++) {
                                    var oGlobalFilterValues = oGlobalFilter.SelectOptions[i].Ranges;
                                    if (!!oGlobalFilterValues) {
                                        var values = [];
                                        for (var j = 0; j < oGlobalFilterValues.length; j++) {
                                            if (oGlobalFilterValues[j].Sign === "I" && oGlobalFilterValues[j].Option === "EQ") {
                                                values.push(oGlobalFilterValues[j].Low);
                                            }
                                        }
                                        oNavArguments.params[oGlobalFilter.SelectOptions[i].PropertyName] = values;
                                    }
                                }
                            }
                            sap.ushell.Container.getService("CrossApplicationNavigation").toExternal(oNavArguments);
                        } else {
                            var oError = new NavError("NavigationHandler.isIntentSupported.notSupported");
                            that.fnHandleError(oError);
                        }
                    })
                    .fail(function () {
                        Log.error("Could not get authorization from isIntentSupported");
                    });
            },

            doIntentBasedNavigation: function (oContext, oIntent, oUrlWithIntent, sNavMode) {

                if (!sNavMode) {
                    sNavMode = OVPUtils.constants.inplace;
                }

                //Navigation handler constructor uses ushell container to retrieve app
                //services, without container the instance creation will fall with error
                if (sap.ushell && !sap.ushell.Container) {
                    return;
                }
                var oParameters,
                    oNavArguments,
                    oAllData,
                    oEntity = oContext ? oContext.getObject() : null;

                //For Analytical card Custom Navigation only
                var oCardPropertiesModel = this.getCardPropertiesModel(),
                sCustomParams = oCardPropertiesModel.getProperty("/customParams");
                if (oContext && typeof oContext.getAllData === "function" && sCustomParams) {
                    //This is for custom navigation of analytical card to pass data apart from bound dimensions
                    oAllData = oContext.getAllData();
                } else if (oCardPropertiesModel.getProperty("/staticContent")) {
                    oAllData = {
                        iStaticLinkListIndex: oIntent.iStaticLinkListIndex,
                        bStaticLinkListIndex: true
                    };
                }
                if (oEntity && oEntity.__metadata) {
                    delete oEntity.__metadata;
                }

                var oNavigationHandler = CommonUtils.getNavigationHandler();
                if (oNavigationHandler) {
                    if (oIntent) {
                        oParameters = this._getEntityNavigationParameters(oEntity, oAllData, oContext); //oAllData is only for the case of custom navigation in analytical card
                        oNavArguments = {
                            target: {
                                semanticObject: oIntent.semanticObject,
                                action: oIntent.action
                            },
                            appSpecificRoute: oIntent.appSpecificRoute,
                            params: oParameters.sNavSelectionVariant
                        };
                        var oAppExternalData = {};
                        //Create inner data only if presentation variant is present
                        if (oParameters.sNavPresentationVariant) {
                            oAppExternalData.presentationVariant = oParameters.sNavPresentationVariant;
                        }

                        if (oUrlWithIntent) {
                            if (oIntent && oIntent.semanticObject && oIntent.action) {
                                var oParams = this.getCardPropertiesModel().getProperty("/staticParameters");
                                oNavArguments.params = (!!oParams) ? oParams : {};
                                this.doCrossApplicationNavigation(oIntent, oNavArguments);
                            }
                        } else {
                            oNavigationHandler.navigate(oNavArguments.target.semanticObject, oNavArguments.target.action, oNavArguments.params,
                                null, this.fnHandleError, oAppExternalData, sNavMode);
                        }
                    }
                }
            },

            doAction: function (oContext, action) {
                this.actionData = ActionUtils.getActionInfo(oContext, action, this.getEntityType());
                if (this.actionData.allParameters.length > 0) {
                    this._loadParametersForm();
                } else {
                    this._callFunction();
                }
            },

            getEntityNavigationEntries: function (oContext, sAnnotationPath) {
                var aNavigationFields = [];
                var oEntityType = this.getEntityType();
                var oCardPropsModel = this.getCardPropertiesModel();
                var sCardType = oCardPropsModel.getProperty("/template");

                if (!oEntityType) {
                    return aNavigationFields;
                }
                /**
                 * In the case where oContext and sAnnotationPath are undefined, then it is the case of header navigation
                 * We check if the card is analytical in this case and check if the relevant semantic object
                 * and action are present as part of the KPI annotation and assign it to the navigation fields.
                 */
                if (!sAnnotationPath && !oContext) {
                    /**
                     If the user has mentioned identification annotation as part of the card settings, then ignore the KPI annotation navigation
                     */
                    if (!this.oCardComponentData.settings.identificationAnnotationPath) {
                        var kpiAnnotationPath = oCardPropsModel.getProperty("/kpiAnnotationPath");
                        if (kpiAnnotationPath && sCardType === "sap.ovp.cards.charts.analytical") {
                            sAnnotationPath = kpiAnnotationPath;
                            var oRecord = oEntityType[sAnnotationPath];
                            var oDetail = oRecord && oRecord.Detail;
                            var sSemanticObject = oDetail.SemanticObject && oDetail.SemanticObject.String;
                            var sAction = oDetail.Action && oDetail.Action.String;
                            if (oDetail.RecordType === "com.sap.vocabularies.UI.v1.KPIDetailType") {
                                if (sSemanticObject && sAction) {
                                    aNavigationFields.push({
                                        type: oDetail.RecordType,
                                        semanticObject: sSemanticObject,
                                        action: sAction,
                                        label: ""
                                    });
                                } else {
                                    Log.error("Invalid Semantic object and action configured for annotation " + oDetail.RecordType);
                                }
                            }
                        }
                    }
                }
                if (!sAnnotationPath) {
                    var sIdentificationAnnotationPath = oCardPropsModel.getProperty("/identificationAnnotationPath");
                    /**
                     * In the case of stack card there can be 2 entries for the identification annotation path.
                     * The second entry corresponds to the object stream, so we avoid this entry (it is processed separately).
                     */
                    var aAnnotationPath = (sIdentificationAnnotationPath) ? sIdentificationAnnotationPath.split(",") : [];
                    if (aAnnotationPath && aAnnotationPath.length > 1) {
                        sAnnotationPath = aAnnotationPath[0];
                    } else {
                        sAnnotationPath = sIdentificationAnnotationPath;
                    }
                }
                // if we have an array object e.g. we have records
                var aRecords = oEntityType[sAnnotationPath];
                if (Array.isArray(aRecords)) {
                    // sort the records by Importance - before we initialize the navigation-actions of the card
                    aRecords = CardAnnotationHelper.sortCollectionByImportance(aRecords);

                    for (var i = 0; i < aRecords.length; i++) {
                        if (aRecords[i].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") {
                            aNavigationFields.push({
                                type: aRecords[i].RecordType,
                                semanticObject: aRecords[i].SemanticObject.String,
                                action: aRecords[i].Action.String,
                                label: aRecords[i].Label ? aRecords[i].Label.String : null
                            });
                        }
                        if (aRecords[i].RecordType === "com.sap.vocabularies.UI.v1.DataFieldWithUrl" && !aRecords[i].Url.UrlRef) {

                            var oModel = this.getView().getModel();
                            var oMetaData = oModel.oMetaModel;
                            var oEntityBindingContext = oMetaData.createBindingContext(oEntityType.$path);
                            var sBindingString = OdataAnnotationHelper.format(oEntityBindingContext, aRecords[i].Url);
                            var oCustomData = new CustomData({
                                key: "url",
                                value: sBindingString
                            });
                            /**
                             * In case of analytical cards new analyticalModel is created for aggregated data.
                             * Hence the context data doesn't come from card model
                             * So we have to replace card model with the new analyticalModel which is present in oContext
                             */
                            if (oContext && sCardType === "sap.ovp.cards.charts.analytical") {
                                oModel = oContext.getModel();
                            }
                            oCustomData.setModel(oModel);
                            oCustomData.setBindingContext(oContext);
                            var oUrl = oCustomData.getValue();

                            aNavigationFields.push({
                                type: aRecords[i].RecordType,
                                url: oUrl,
                                value: aRecords[i].Value.String,
                                label: aRecords[i].Label ? aRecords[i].Label.String : null
                            });
                        }
                    }
                }
                return aNavigationFields;
            },

            getModel: function () {
                return this.getView().getModel();
            },

            getMetaModel: function () {
                if (this.getModel()) {
                    return this.getModel().getMetaModel();
                }
            },

            getCardPropertiesModel: function () {
                if (!this.oCardPropertiesModel || jQuery.isEmptyObject(this.oCardPropertiesModel)) {
                    this.oCardPropertiesModel = this.getView().getModel("ovpCardProperties");
                }
                return this.oCardPropertiesModel;
            },

            getEntitySet: function () {
                if (!this.entitySet) {
                    var sEntitySet = this.getCardPropertiesModel().getProperty("/entitySet");
                    this.entitySet = this.getMetaModel().getODataEntitySet(sEntitySet);
                }

                return this.entitySet;
            },

            getEntityType: function () {
                if (!this.entityType) {
                    if (this.getMetaModel() && this.getEntitySet()) {
                        this.entityType = this.getMetaModel().getODataEntityType(this.getEntitySet().entityType);
                    }
                }

                return this.entityType;
            },

            getCardContentContainer: function () {
                if (!this.cardContentContainer) {
                    this.cardContentContainer = this.getView().byId("ovpCardContentContainer");
                }
                return this.cardContentContainer;
            },

            //_saveAppState: function(sFilterDataSuiteFormat) {
            //	var oDeferred = jQuery.Deferred();
            //	var oAppState = sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(this.getOwnerComponent());
            //	var sAppStateKey = oAppState.getKey();
            //	var oAppDataForSave = {
            //		selectionVariant: sFilterDataSuiteFormat
            //	};
            //	oAppState.setData(oAppDataForSave);
            //	var oSavePromise = oAppState.save();
            //
            //	oSavePromise.done(function() {
            //       oDeferred.resolve(sAppStateKey,oAppDataForSave);
            //	});
            //
            //	return oDeferred.promise();
            //},

            /**
             * This function connects to custom functions and evaluates custom navigation parameters
             * @private
             * @returns boolean
             */
            _processCustomParameters: function (oContextData, oSelectionData, oContextParameters) {
                var oCardPropertiesModel = this.getCardPropertiesModel();
                if (!this.oMainComponent || !oCardPropertiesModel) {
                    return;
                }
                var sCustomParams;
                if (oContextData && oContextData.bStaticLinkListIndex) {
                    var aStaticParameters = oCardPropertiesModel.getProperty("/staticContent");
                    sCustomParams = aStaticParameters[oContextData.iStaticLinkListIndex]["customParams"];
                    oContextData = null;
                } else {
                    sCustomParams = oCardPropertiesModel.getProperty("/customParams");
                }
                //If custom params settings not provided in descriptor or if custom param function
                //not defined in extension, then return without processing
                if (!sCustomParams || !this.oMainComponent.templateBaseExtension.provideCustomParameter || !this.oMainComponent.onCustomParams) {
                    return;
                }
                //The custom extension function onCustomParams should return a custom function
                //based on the descriptor setting sCustomParams
                var fnGetParameters = this.oMainComponent.templateBaseExtension.provideCustomParameter(sCustomParams) ? this.oMainComponent.templateBaseExtension.provideCustomParameter(sCustomParams) : this.oMainComponent.onCustomParams(sCustomParams);
                if (!fnGetParameters || !jQuery.isFunction(fnGetParameters)) {
                    return;
                }
                //Create Copy of input objects so that they are not modified by extension
                var oContextDataCopy = jQuery.extend(true, {}, oContextData);
                var oSelectionDataCopy = jQuery.extend(true, {}, oSelectionData);
                var oCustomParams = fnGetParameters(oContextDataCopy, oSelectionDataCopy);

                //Type of oCustomParams should be either object or array
                if (!oCustomParams || (!Array.isArray(oCustomParams) && !isPlainObject(oCustomParams))) {
                    return;
                }
                //If oCustomParams is object with no properties, then stop processing
                var bIsObject = isPlainObject(oCustomParams);
                if (bIsObject && jQuery.isEmptyObject(oCustomParams)) {
                    return;
                }
                //From 1.54, ignoreEmptyString and selectionVariant are deprecated
                //From 1.54, Use bIgnoreEmptyString and aSelectionVariant
                var bIgnoreEmptyString = bIsObject && (oCustomParams.bIgnoreEmptyString || oCustomParams.ignoreEmptyString);
                var aCustomSelectionVariant = bIsObject ? (oCustomParams.aSelectionVariant || oCustomParams.selectionVariant) : oCustomParams;
                //aCustomSelectionVariant should always be an array of selection variants
                if (!Array.isArray(aCustomSelectionVariant)) {
                    return;
                }
                //Process the custom selection variants
                var i, iLength, oCustomSelectionVariant, sPath, sValue1, sValue2;
                iLength = aCustomSelectionVariant.length;
                for (i = 0; i < iLength; i++) {
                    oCustomSelectionVariant = aCustomSelectionVariant[i];
                    if (!oCustomSelectionVariant) {
                        continue;
                    }
                    sPath = oCustomSelectionVariant.path;
                    sValue1 = oCustomSelectionVariant.value1;
                    sValue2 = oCustomSelectionVariant.value2;
                    //Property path is mandatory
                    if (!sPath || typeof sPath !== "string" || sPath === "") {
                        Log.error("Custom Variant property path '" + sPath + "' should be valid string");
                        continue;
                    }
                    //Value1 is mandatory except when ignore is set explicitly.
                    //0 is allowed, "" is allowed with ignore flag set
                    if (!(sValue1 || sValue1 === 0 || (sValue1 === "" && bIgnoreEmptyString))) {
                        continue;
                    }
                    sValue1 = sValue1.toString();
                    sValue2 = sValue2 && sValue2.toString();
                    //Update oSelectionData and oContextData. Since they are object references, they will also get
                    //updated in calling function
                    if (sValue1 === "" && bIgnoreEmptyString) {
                        oSelectionData.removeSelectOption(sPath);
                    }
                    if (oContextData) {
                        delete oContextData[sPath];
                    }
                    if (oContextParameters) {
                        delete oContextParameters[sPath];
                    }
                    oSelectionData.addSelectOption(sPath, oCustomSelectionVariant.sign, oCustomSelectionVariant.operator,
                        sValue1, sValue2);
                }
                //Remove selections with empty strings in value field, object reference is passed so object is modified directly
                //Only oSelectionData is modified, oContextData will be taken care later by function mixAttributesAndSelectionVariant
                if (bIgnoreEmptyString) {
                    this._removeEmptyStringsFromSelectionVariant(oSelectionData);
                }
                return bIgnoreEmptyString;
            },

            /**
             * Retrieve entity parameters (if exists) and add xAppState from oComponentData.appStateKeyFunc function (if exists)
             * @param oEntity
             * @returns {*}
             * @private
             */
            _getEntityNavigationParameters: function (oEntity, oCustomParameters, oContext) {
                var oContextParameters = {};
                var oSelectionVariant, oPresentationVariant, oStaticParameters;
                var oComponentData = this.getOwnerComponent().getComponentData();
                var oGlobalFilter = oComponentData ? oComponentData.globalFilter : undefined;
                var oCardPropertiesModel = this.getCardPropertiesModel();
                var oStaticLinkList = oCardPropertiesModel && oCardPropertiesModel.getProperty("/staticContent");
                if (!oStaticLinkList) {
                    var oCardSelections = CardAnnotationHelper.getCardSelections(this.getCardPropertiesModel());

                    var aCardFilters = oCardSelections.filters;
                    var aCardParameters = oCardSelections.parameters;
                    var oEntityType = this.getEntityType();

                    //When filters are passed as navigation params, '/' should be replaced with '.'
                    //Eg. to_abc/xyz should be to_abc.xyz
                    aCardFilters && aCardFilters.forEach(function (oCardFilter) {
                        oCardFilter.path = oCardFilter.path.replace("/", ".");

                        // NE operator is not supported by selction variant
                        // so we are changing it to exclude with EQ operator.
                        // Contains operator is not supported by selection variant
                        // so we are changing it to CP operator
                        switch (oCardFilter.operator) {
                            case FilterOperator.NE:
                                oCardFilter.operator = FilterOperator.EQ;
                                oCardFilter.sign = "E";
                                break;
                            case FilterOperator.Contains:
                                oCardFilter.operator = "CP";
                                var sValue = oCardFilter.value1;
                                oCardFilter.value1 = "*" + sValue + "*";
                                break;
                            case FilterOperator.EndsWith:
                                oCardFilter.operator = "CP";
                                var sValue = oCardFilter.value1;
                                oCardFilter.value1 = "*" + sValue;
                                break;
                            case FilterOperator.StartsWith:
                                oCardFilter.operator = "CP";
                                var sValue = oCardFilter.value1;
                                oCardFilter.value1 = sValue + "*";
                        }

                    });
                    oCardSelections.filters = aCardFilters;

                    //on click of other section in donut card pass the dimensions which are shown as selection variant with exclude value
                    if (oContext && oEntity && oEntity.hasOwnProperty("$isOthers")) {
                        var oDimensions = oContext.getOtherNavigationDimensions();
                        for (var key in oDimensions) {
                            var aDimensionValues = oDimensions[key];
                            for (var i = 0; i < aDimensionValues.length; i++) {
                                oCardSelections.filters.push({
                                    path: key,
                                    operator: "EQ",
                                    value1: aDimensionValues[i],
                                    sign: "E"
                                });
                            }
                        }
                    }

                    aCardParameters && aCardParameters.forEach(function (oCardParameter) {
                        oCardParameter.path = oCardParameter.path.replace("/", ".");
                    });
                    oCardSelections.parameters = aCardParameters;

                    var oCardSorters = CardAnnotationHelper.getCardSorters(this.getCardPropertiesModel());

                    // Build result object of card parameters
                    if (oEntity) {
                        var key;
                        for (var i = 0; oEntityType.property && i < oEntityType.property.length; i++) {
                            key = oEntityType.property[i].name;
                            var vAttributeValue = oEntity[key];

                            if (oEntity.hasOwnProperty(key)) {
                                if (Array.isArray(oEntity[key]) && oEntity[key].length === 1) {
                                    oContextParameters[key] = oEntity[key][0];
                                } else if (jQuery.type(vAttributeValue) !== "object") {
                                    oContextParameters[key] = vAttributeValue;
                                }
                            }
                        }
                    }
                    // add the KPI ID to the navigation parameters if it's present
                    var sKpiAnnotationPath = oCardPropertiesModel && oCardPropertiesModel.getProperty("/kpiAnnotationPath");
                    var sCardType = oCardPropertiesModel && oCardPropertiesModel.getProperty("/template");

                    if (sKpiAnnotationPath && sCardType === "sap.ovp.cards.charts.analytical") {
                        var oRecord = oEntityType[sKpiAnnotationPath];
                        var oDetail = oRecord && oRecord.Detail;
                        if (oDetail && oDetail.RecordType === "com.sap.vocabularies.UI.v1.KPIDetailType") {
                            oContextParameters["kpiID"] = oRecord.ID.String;
                        }
                    }

                    //Build selection variant object from global filter, card filter and card parameters
                    oPresentationVariant = oCardSorters && new PresentationVariant(oCardSorters);
                    oSelectionVariant = this._buildSelectionVariant(oGlobalFilter, oCardSelections);
                    oStaticParameters = oCardPropertiesModel && oCardPropertiesModel.getProperty("/staticParameters");
                } else {
                    var oUiState = oGlobalFilter && oGlobalFilter.getUiState({
                            allFilters: false
                        });
                    var sSelectionVariant = oUiState ? JSON.stringify(oUiState.getSelectionVariant()) : "{}";
                    oSelectionVariant = new SelectionVariant(sSelectionVariant);

                    var mFilterPreference = this._getFilterPreference();
                    oSelectionVariant = this._removeFilterFromGlobalFilters(mFilterPreference, oSelectionVariant);

                    if (oStaticLinkList[oCustomParameters.iStaticLinkListIndex].params) {  //Backward compatibility (params)
                        oStaticParameters = oStaticLinkList[oCustomParameters.iStaticLinkListIndex].params;
                    } else if (oStaticLinkList[oCustomParameters.iStaticLinkListIndex].staticParameters) { //to sync with other cards (staticParameters)
                        oStaticParameters = oStaticLinkList[oCustomParameters.iStaticLinkListIndex].staticParameters;
                    }
                }

                //Process Custom parameters
                var bIgnoreEmptyString;
                if (oCustomParameters && !oCustomParameters.bStaticLinkListIndex) {
                    //Only in case of custom navigation in analytical cards
                    bIgnoreEmptyString = this._processCustomParameters(oCustomParameters, oSelectionVariant, oContextParameters);
                } else if (oCustomParameters && oCustomParameters.bStaticLinkListIndex) {
                    bIgnoreEmptyString = this._processCustomParameters(oCustomParameters, oSelectionVariant);
                } else {
                    bIgnoreEmptyString = this._processCustomParameters(oContextParameters, oSelectionVariant);
                }
                var iSuppressionBehavior = bIgnoreEmptyString ? GenericAppLibrary.navigation.service.SuppressionBehavior.ignoreEmptyString : undefined;

                //If there is a clash of static parameters with context or selection parameters, then static
                //parameters get lowest priority
                //If any value for oContextParameters[key] is already set, static parameter should not overwrite it

                if (oStaticParameters) {
                    for (var key in oStaticParameters) {
                        if (!oContextParameters.hasOwnProperty(key)) {
                            oContextParameters[key] = oStaticParameters[key];
                        }
                    }
                }
                var oNavigationHandler = CommonUtils.getNavigationHandler();
                var oNavSelectionVariant = oNavigationHandler &&
                    oNavigationHandler.mixAttributesAndSelectionVariant(oContextParameters, oSelectionVariant.toJSONString(), iSuppressionBehavior);

                // remove selection Variant property which are marked sensitive
                if (!oStaticLinkList) {
                    this._removeSensitiveAttributesFromNavSelectionVariant(oEntityType, oNavSelectionVariant);
                }

                return {
                    sNavSelectionVariant: oNavSelectionVariant ? oNavSelectionVariant.toJSONString() : null,
                    sNavPresentationVariant: oPresentationVariant ? oPresentationVariant.toJSONString() : null
                };
            },

            _removeSensitiveAttributesFromNavSelectionVariant: function (oEntityType, oNavSelectionVariant) {
                for (var i = 0; i < oEntityType.property.length; i++) {
                    if (oEntityType.property[i]["com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"] && oEntityType.property[i]["com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"].Bool) {
                        delete oNavSelectionVariant._mSelectOptions[oEntityType.property[i].name];
                    }
                }
            },

            _removeEmptyStringsFromSelectionVariant: function (oSelectionVariant) {
                //remove parameters that have empty string
                var aParameters = oSelectionVariant.getParameterNames();
                for (var i = 0; i < aParameters.length; i++) {
                    if (oSelectionVariant.getParameter(aParameters[i]) === "") {
                        oSelectionVariant.removeParameter(aParameters[i]);
                    }
                }

                //remove selOptions that have empty string
                var aSelOptionNames = oSelectionVariant.getSelectOptionsPropertyNames();
                for (i = 0; i < aSelOptionNames.length; i++) {
                    var aSelectOption = oSelectionVariant.getSelectOption(aSelOptionNames[i]);
                    //remove every range in the current select option having empty string
                    for (var j = 0; j < aSelectOption.length; j++) {
                        if (aSelectOption[j].Low === "" && !aSelectOption[j].High) {
                            aSelectOption.splice(j, 1);
                            j--;
                        }
                    }
                    //remove selOption if there are no ranges in it
                    if (aSelectOption.length === 0) {
                        oSelectionVariant.removeSelectOption(aSelOptionNames[i]);
                    }
                }

                return oSelectionVariant;
            },

            /**
             * This function check's if card filter named sPropertyName is valid
             *
             * @param {Object} mFilterPreference - Filter Preference
             * @param {String} sPropertyName - Card filter name
             * @returns {Boolean}
             * @private
             */
            _checkIfCardFiltersAreValid: function (mFilterPreference, sPropertyName) {
                var bFlag = true;
                if (mFilterPreference && mFilterPreference.filterAll === "global") {
                    bFlag = false;
                } else if (mFilterPreference && mFilterPreference.globalFilter) {
                    if (mFilterPreference.globalFilter.indexOf(sPropertyName) >= 0) {
                        bFlag = false;
                    }
                }

                return bFlag;
            },

            /**
             * This function get filter preference for a card from Main.controller.js
             *
             * @returns {Object}
             * @private
             */
            _getFilterPreference: function () {
                var oCompData = this.getOwnerComponent() ? this.getOwnerComponent().getComponentData() : null;
                var mFilterPreference;
                if (oCompData && oCompData.mainComponent) {
                    mFilterPreference = oCompData.mainComponent._getFilterPreference(oCompData.cardId);
                }

                return mFilterPreference;
            },

            /**
             * This function removes invalid filters from Global filters w.r.t filter preference
             *
             * @param {Object} mFilterPreference - Filter Preference
             * @param {Object} oSelectionVariant - Selection Variant Object
             * @returns {Object}
             * @private
             */
            _removeFilterFromGlobalFilters: function (mFilterPreference, oSelectionVariant) {
                var aAllPropertyNames = [];
                if (mFilterPreference && mFilterPreference.filterAll === "card") {
                    aAllPropertyNames = oSelectionVariant.getSelectOptionsPropertyNames();
                } else if (mFilterPreference && mFilterPreference.cardFilter) {
                    aAllPropertyNames = mFilterPreference.cardFilter;
                }

                aAllPropertyNames.forEach(function (sPropertyName) {
                    if (sPropertyName !== "$.basicSearch") {
                        oSelectionVariant.removeSelectOption(sPropertyName);
                    }
                });

                return oSelectionVariant;
            },

            _buildSelectionVariant: function (oGlobalFilter, oCardSelections) {
                var oUiState = oGlobalFilter && oGlobalFilter.getUiState({
                        allFilters: false
                    });
                var sSelectionVariant = oUiState ? JSON.stringify(oUiState.getSelectionVariant()) : "{}";
                var oSelectionVariant = new SelectionVariant(sSelectionVariant);
                var oFilter, sValue1, sValue2, oParameter;

                var mFilterPreference = this._getFilterPreference();
                oSelectionVariant = this._removeFilterFromGlobalFilters(mFilterPreference, oSelectionVariant);

                var aCardFilters = oCardSelections.filters;
                var aCardParameters = oCardSelections.parameters;

                // Add card filters to selection variant
                for (var i = 0; i < aCardFilters.length; i++) {
                    oFilter = aCardFilters[i];
                    //value1 might be typeof number, hence we check not typeof undefined
                    if (oFilter.path && oFilter.operator && typeof oFilter.value1 !== "undefined") {
                        //value2 is optional, hence we check it separately
                        sValue1 = oFilter.value1.toString();
                        sValue2 = (typeof oFilter.value2 !== "undefined") ? oFilter.value2.toString() : undefined;
                        if (this._checkIfCardFiltersAreValid(mFilterPreference, oFilter.path)) {
                            oSelectionVariant.addSelectOption(oFilter.path, oFilter.sign, oFilter.operator, sValue1, sValue2);
                        }
                    }
                }
                // Add card parameters to selection variant
                var sName, sNameWithPrefix, sNameWithoutPrefix;
                for (var j = 0; j < aCardParameters.length; j++) {
                    oParameter = aCardParameters[j];
                    //If parameter name or value is missing, then ignore
                    if (!oParameter.path || !oParameter.value) {
                        continue;
                    }
                    sName = oParameter.path.split("/").pop();
                    sName = sName.split(".").pop();
                    //P_ParameterName and ParameterName should be treated as same
                    if (sName.indexOf("P_") === 0) {
                        sNameWithPrefix = sName;
                        sNameWithoutPrefix = sName.substr(2); // remove P_ prefix
                    } else {
                        sNameWithPrefix = "P_" + sName;
                        sNameWithoutPrefix = sName;
                    }

                    //If parameter already part of selection variant, this means same parameter came from global
                    //filter and we should not send card parameter again, because parameter will always contain
                    //single value, multiple parameter values will confuse target application
                    if (oSelectionVariant.getParameter(sNameWithPrefix)) {
                        continue;
                    }
                    if (oSelectionVariant.getParameter(sNameWithoutPrefix)) {
                        continue;
                    }
                    oSelectionVariant.addParameter(sName, oParameter.value);
                }
                return oSelectionVariant;
            },

            _loadParametersForm: function () {
                var oParameterModel = new JSONModel();
                oParameterModel.setData(this.actionData.parameterData);
                var that = this;

                // first create dialog
                var oParameterDialog = new Dialog('ovpCardActionDialog', {
                    title: this.actionData.sFunctionLabel,
                    afterClose: function () {
                        oParameterDialog.destroy();
                    }
                }).addStyleClass("sapUiNoContentPadding");

                // action button (e.g. BeginButton)
                var actionButton = new Button({
                    text: this.actionData.sFunctionLabel,
                    press: function (oEvent) {
                        var mParameters = ActionUtils.getParameters(oEvent.getSource().getModel(), that.actionData.oFunctionImport);
                        oParameterDialog.close();
                        that._callFunction(mParameters, that.actionData.sFunctionLabel);
                    }
                });

                // cancel button (e.g. EndButton)
                var cancelButton = new Button({
                    text: "Cancel",
                    press: function () {
                        oParameterDialog.close();
                    }
                });
                // assign the buttons to the dialog
                oParameterDialog.setBeginButton(actionButton);
                oParameterDialog.setEndButton(cancelButton);

                // preparing a callback function which will be invoked on the Form's Fields-change
                var onFieldChangeCB = function (oEvent) {
                    var missingMandatory = ActionUtils.mandatoryParamsMissing(oEvent.getSource().getModel(), that.actionData.oFunctionImport);
                    actionButton.setEnabled(!missingMandatory);
                };

                // get the form assign it the Dialog and open it
                var oForm = ActionUtils.buildParametersForm(this.actionData, onFieldChangeCB);

                oParameterDialog.addContent(oForm);
                oParameterDialog.setModel(oParameterModel);
                oParameterDialog.open();
            },

            _callFunction: function (mUrlParameters, actionText) {
                var mParameters = {
                    batchGroupId: "Changes",
                    changeSetId: "Changes",
                    urlParameters: mUrlParameters,
                    forceSubmit: true,
                    context: this.actionData.oContext,
                    functionImport: this.actionData.oFunctionImport
                };
                var that = this;
                var oPromise = new Promise(function (resolve, reject) {
                    var model = that.actionData.oContext.getModel();
                    var sFunctionImport;
                    sFunctionImport = "/" + mParameters.functionImport.name;
                    model.callFunction(sFunctionImport, {
                        method: mParameters.functionImport.httpMethod,
                        urlParameters: mParameters.urlParameters,
                        batchGroupId: mParameters.batchGroupId,
                        changeSetId: mParameters.changeSetId,
                        headers: mParameters.headers,
                        success: function (oData, oResponse) {
                            resolve(oResponse);
                        },
                        error: function (oResponse) {
                            oResponse.actionText = actionText;
                            reject(oResponse);
                        }
                    });
                });
                //Todo: call translation on message toast
                oPromise.then(function (oResponse) {
                    return MessageToast.show(OvpResources.getText("Toast_Action_Success"), {
                        duration: 1000
                    });
                }, function (oError) {
                    var errorMessage = CommonUtils.showODataErrorMessages(oError);
                    if (errorMessage === "" && oError.actionText) {
                        errorMessage = OvpResources.getText("Toast_Action_Error") + ' "' + oError.actionText + '"' + ".";
                    }
                    return MessageBox.error(errorMessage, {
                        title: OvpResources.getText("OVP_GENERIC_ERROR_TITLE"),
                        onClose: null,
                        styleClass: "",
                        initialFocus: null,
                        textDirection: TextDirection.Inherit
                    });
                });
            },

            /**
             * In case of error card implementation can call this method to display
             * card error state.
             * Current instance of the card will be destroied and instead loading card
             * will be presenetd with the 'Cannot load card' meassage
             */
            setErrorState: function () {
                //get the current card component
                var oCurrentCard = this.getOwnerComponent();
                //If oCurrentCard is undefined, it means the original card has been created and the loading card
                //has been destroyed.
                //Thus, there is no need of creating an error card on top of the loading card.
                if (!oCurrentCard || !oCurrentCard.oContainer) {
                    return;
                }
                //get the component container
                var oComponentContainer = oCurrentCard.oContainer;
                //prepare card configuration, i.e. category, title, description and entitySet
                //which are required for the loading card. in addition set the card state to error
                //so no loading indicator will be presented
                var oCardPropertiesModel = this.getCardPropertiesModel();
                var oComponentConfig = {
                    name: "sap.ovp.cards.loading",
                    componentData: {
                        model: this.getView().getModel(),
                        settings: {
                            category: oCardPropertiesModel.getProperty("/category"),
                            title: oCardPropertiesModel.getProperty("/title"),
                            description: oCardPropertiesModel.getProperty("/description"),
                            entitySet: oCardPropertiesModel.getProperty("/entitySet"),
                            state: OVPUtils.loadingState.ERROR,
                            template: oCardPropertiesModel.getProperty("/template")
                        }
                    }
                };
                //create the loading card
                var oLoadingCard = sap.ui.component(oComponentConfig);
                //set the loading card in the container
                oComponentContainer.setComponent(oLoadingCard);
                //destroy the current card
                setTimeout(function () {
                    oCurrentCard.destroy();
                }, 0);
            },

            changeSelection: function (selectedKey, bAdaptUIMode, oCardProperties) {
                //Selected key will be provided for bAdaptUIMode= true case.
                //get the index of the combo box
                if (!bAdaptUIMode) {
                    var oDropdown = this.getView().byId("ovp_card_dropdown");
                    selectedKey = parseInt(oDropdown.getSelectedKey(), 10);
                }

                var oTabValue = {};
                if (!bAdaptUIMode) {
                    //update the card properties
                    oTabValue = this.getCardPropertiesModel().getProperty("/tabs")[selectedKey - 1];
                } else {
                    oTabValue = oCardProperties.tabs[selectedKey - 1];
                }
                var oUpdatedCardProperties = {
                    cardId: this.getOwnerComponent().getComponentData().cardId,
                    selectedKey: selectedKey
                };
                for (var prop in oTabValue) {
                    oUpdatedCardProperties[prop] = oTabValue[prop];
                }

                if (OVPCardAsAPIUtils.checkIfAPIIsUsed(this)) {
                    OVPCardAsAPIUtils.recreateCard(oUpdatedCardProperties, this.getOwnerComponent().getComponentData());
                } else {
                    this.getOwnerComponent().getComponentData().mainComponent.recreateCard(oUpdatedCardProperties);
                    this.getOwnerComponent().getComponentData().mainComponent.setOrderedCardsSelectedKey(this.getOwnerComponent().getComponentData().cardId, selectedKey);
                }
            },

            /**
             * Calculate the offset height of any card component(e.g- header, footer, container, toolbar or each item)
             *
             * @method getItemHeight
             * @param {Object} oGenCardCtrl - Card controller
             * @param {String} sCardComponentId - Component id which height is to be calculated
             * @return {Object} iHeight- Height of the component
             */
            getItemHeight: function (oGenCardCtrl, sCardComponentId, bFlag) {
                if (!!oGenCardCtrl) {
                    var aAggregation = oGenCardCtrl.getView().byId(sCardComponentId);
                    var iHeight = 0;
                    //Null check as some cards does not contain toolbar or footer.
                    if (!!aAggregation) {
                        if (bFlag) {
                            //if the height is going to be calculated for any item like <li> in List or <tr> in Table card
                            if (aAggregation.getItems()[0] && aAggregation.getItems()[0].getDomRef()) {
                                iHeight = jQuery(aAggregation.getItems()[0].getDomRef()).outerHeight(true);
                            }
                        } else {
                            if (aAggregation.getDomRef()) {
                                iHeight = jQuery(aAggregation.getDomRef()).outerHeight(true);
                            }
                        }
                    }
                    return iHeight;
                }
            },

            /**
             * Method to return the height of the header component
             *
             * @method getHeaderHeight
             * @return {Integer} iHeaderHeight - Height of the header component
             */
            getHeaderHeight: function () {
                var iHeight = this.getItemHeight(this, 'ovpCardHeader'),
                    oCompData = this.getOwnerComponent() ? this.getOwnerComponent().getComponentData() : null;
                if (oCompData && oCompData.appComponent) {
                    var oDashboardLayoutUtil = oCompData.appComponent.getDashboardLayoutUtil(),
                        oCard = oDashboardLayoutUtil.getDashboardLayoutModel().getCardById(oCompData.cardId);
                    if (iHeight !== 0) {
                        oCard.dashboardLayout.headerHeight = iHeight;
                    }
                }
                return iHeight;
            }

        });
    }
);
