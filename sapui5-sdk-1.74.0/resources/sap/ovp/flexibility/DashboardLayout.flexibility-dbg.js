sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ovp/flexibility/changeHandler/CardChangeHandler",
    "sap/ovp/flexibility/changeHandler/RemoveCardContainer",
    "sap/ui/dt/OverlayRegistry",
    "sap/ui/core/ComponentContainer",
    "sap/m/MessageToast",
    "sap/ovp/cards/rta/SettingsDialogConstants",
    "sap/ovp/cards/SettingsUtils",
    "sap/ovp/cards/CommonUtils",
    "sap/ovp/app/resources"
], function (jQuery, CardChangeHandler, RemoveCardContainer, OverlayRegistry,
             ComponentContainer, MessageToast, SettingsConstants, SettingsUtils, CommonUtils, OvpResources) {
    "use strict";
    return {
        "moveControls": {
            "changeHandler": "default",
            "layers": {
                "CUSTOMER_BASE": true,
                "CUSTOMER": true,
                "USER": true
            }
        },
        "unhideControl": CardChangeHandler.UnhideControlConfig,
        "unhideCardContainer": CardChangeHandler.UnhideCardContainer,
        "hideCardContainer": CardChangeHandler.HideCardContainer,
        "removeCardContainer": RemoveCardContainer,
        "editCardSettings": {
            changeHandler: {
                applyChange : function(oChange, oControl, mPropertyBag) {
                    var oMainView = mPropertyBag.appComponent.getRootControl(),
                        oMainController = oMainView.getController(),
                        oContent = oChange.getContent(),
                        oCardProperties = oContent.newAppDescriptor,
                        oCard = oMainView.byId(oCardProperties.id),
                        oMainLayout = oMainController.getLayout(),
                        oLayoutModel = oMainLayout.getDashboardLayoutModel(),
                        oLayoutUtil = oMainLayout.getDashboardLayoutUtil(),
                        oCardDashboard = oLayoutModel.getCardById(oCardProperties.id),
                        oCardProps = oLayoutUtil.calculateCardProperties(oCardProperties.id),
                        iNewRowValue = oCardProperties.settings.defaultSpan && oCardProperties.settings.defaultSpan.rows,
                        iNewColumnValue = oCardProperties.settings.defaultSpan && oCardProperties.settings.defaultSpan.cols,
                        iMaxColumnValue = oLayoutModel.getColCount() + 1,
                        affectedCards = [], bFlag = false;

                    oChange.setRevertData(oContent.oldAppDescriptor); // Here the information is stored on the change

                    if (oCard) {
                        /**
                         *  If there is Default View changed
                         *  Then cardSettings will change
                         */
                        if (oCardProperties.settings.tabs) {
                            var iDefaultViewSelected = oCardProperties.settings.selectedKey;
                            if (!iDefaultViewSelected || iDefaultViewSelected < 1) {
                                iDefaultViewSelected = 1;
                            }
                            SettingsConstants.tabFields.forEach(function (field) {
                                var value = oCardProperties.settings.tabs[iDefaultViewSelected - 1][field];
                                // Delete field if it exists in oCardProperties - Except when 'entitySet' is not a tab level property
                                if (field !== 'entitySet' || (field === 'entitySet' && value)) {
                                    delete oCardProperties.settings[field];
                                }
                                if (value) {
                                    oCardProperties.settings[field] = value;
                                }
                            });
                        }
                        //code through the code if the there is a new row value(0 is a valid value because for showOnlyHeader new row value will be 0)
                        if (typeof iNewRowValue === 'number') {
                            if (iNewRowValue === 0) {
                                //For showOnlyHeader case set the value of showOnlyHeader in dashboardLayout object to true
                                //And calculate the rowSpan according to the same(card header height / 16)
                                oCardDashboard.dashboardLayout.showOnlyHeader = true;
                                iNewRowValue = Math.ceil((oCardProps.headerHeight + 2 * oLayoutUtil.CARD_BORDER_PX) / oLayoutUtil.getRowHeightPx());
                            } else {
                                //Set the value of showOnlyHeader in dashboardLayout object to false
                                oCardDashboard.dashboardLayout.showOnlyHeader = false;
                                //For list/table card new row value is assigned to the noOfItems and for other Cards its assigned to rowSpan
                                if (oCardProperties.template === 'sap.ovp.cards.list' || oCardProperties.template === 'sap.ovp.cards.table') {
                                    oCardDashboard.dashboardLayout.noOfItems = iNewRowValue;
                                }
                            }
                        }
                        if (iNewColumnValue) {
                            //May be user given column value may be too large for the card to accommodate in the layout
                            if (oCardDashboard.dashboardLayout.column + iNewColumnValue > iMaxColumnValue) {
                                oCardDashboard.dashboardLayout.maxColSpan = iNewColumnValue;
                                iNewColumnValue = iMaxColumnValue - oCardDashboard.dashboardLayout.column;
                            }
                            bFlag = true;
                        }
                        //Resize the card to the new size
                        if (bFlag) {
                            oLayoutModel._arrangeCards(oCardDashboard, {
                                row: iNewRowValue,
                                column: iNewColumnValue
                            }, 'resize', affectedCards);
                            //Align all affected cards
                            oLayoutModel._removeSpaceBeforeCard(affectedCards);
                            //Position all cards
                            oLayoutUtil._positionCards(oLayoutModel.aCards);
                            bFlag = false;
                        }
                        var oComponent = oCard.getComponentInstance();
                        oComponent.destroy();
                    }

                    oMainController.recreateRTAClonedCard(oCardProperties);

                    return true;
                },
                revertChange : function(oChange, oControl, mPropertyBag) {
                    var oMainView = mPropertyBag.appComponent.getRootControl(),
                        oMainController = oMainView.getController(),
                        oCardProperties = oChange.getRevertData(),
                        oCard = oMainView.byId(oCardProperties.id),
                        oMainLayout = oMainController.getLayout(),
                        oLayoutModel = oMainLayout.getDashboardLayoutModel(),
                        oLayoutUtil = oMainLayout.getDashboardLayoutUtil(),
                        oCardDashboard = oLayoutModel.getCardById(oCardProperties.id),
                        iOldRowValue = oCardProperties.settings.defaultSpan && oCardProperties.settings.defaultSpan.rowSpan,
                        iOldColumnValue = oCardProperties.settings.defaultSpan && oCardProperties.settings.defaultSpan.colSpan,
                        bShowOnlyHeader = oCardProperties.settings.defaultSpan && oCardProperties.settings.defaultSpan.showOnlyHeader,
                        affectedCards = [];

                    if (oCard) {
                        oCardDashboard.dashboardLayout.rowSpan = iOldRowValue;
                        oCardDashboard.dashboardLayout.colSpan = iOldColumnValue;
                        oCardDashboard.dashboardLayout.showOnlyHeader = bShowOnlyHeader;
                        oLayoutModel._arrangeCards(oCardDashboard, {
                            row: iOldRowValue,
                            column: iOldColumnValue
                        }, 'resize', affectedCards);
                        oLayoutModel._removeSpaceBeforeCard(affectedCards);
                        oLayoutUtil._positionCards(oLayoutModel.aCards);
                        var oComponent = oCard.getComponentInstance();
                        oComponent.destroy();
                    }

                    oMainController.recreateRTAClonedCard(oCardProperties);

                    oChange.resetRevertData(); // Clear the revert data on the change

                    return true;
                },
                completeChangeContent : function(oChange, oSpecificChangeInfo, mPropertyBag) {
                    return;
                }
            },
            layers: {
                "CUSTOMER_BASE": true,
                "CUSTOMER": true,
                "USER": true
            }
        },
        "newCardSettings": {
            changeHandler: {
                applyChange : function(oChange, oControl, mPropertyBag){
                    var oMainView = mPropertyBag.appComponent.getRootControl(),
                        oMainController = oMainView.getController(),
                        oCardProperties = oChange.getContent();

                    oChange.setRevertData(oCardProperties.id); // Here the information is stored on the change

                    var oNewComponentContainer = new ComponentContainer(oMainView.getId() + "--" + oCardProperties.id),
                        oAppComponent =  mPropertyBag.appComponent,
                        oUIModel = oMainController.getUIModel(),
                        aCards = oUIModel.getProperty("/cards"),
                        oMainLayout = oMainController.getLayout(),
                        oLayoutUtil = oMainLayout.getDashboardLayoutUtil(),
                        oLayoutModel = oMainLayout.getDashboardLayoutModel(),
                        bNewStaticLinkListCard = (oCardProperties.id.indexOf("newStaticLinkListCard_N") !== -1) && !SettingsUtils.checkClonedCard(oCardProperties.id),
                        bNewKPICard = (oCardProperties.id.indexOf("newKPICard_N") !== -1) && !SettingsUtils.checkClonedCard(oCardProperties.id),
                        bAddNewCard = (oCardProperties.id.indexOf("newCard_N") !== -1) && !SettingsUtils.checkClonedCard(oCardProperties.id),
                        bAddNewCardFromNewDataSource = SettingsUtils.newDataSource;
                    if (bNewKPICard) {
                        var oSelectedKPI = oCardProperties.settings.selectedKPI,
                            oNewModel = new sap.ui.model.odata.v2.ODataModel(oSelectedKPI.ODataURI, {
                                'annotationURI': oSelectedKPI.ModelURI,
                                'defaultCountMode': sap.ui.model.odata.CountMode.None
                            }),
                            sModelName = oCardProperties.model;
                        if (oCardProperties.settings["sAnnoKey"]) {
                            SettingsUtils.setDataSources(oCardProperties.settings["sAnnoKey"], oSelectedKPI.ModelURI);
                        }
                        oMainView.setModel(oNewModel, sModelName);
                        oAppComponent.setModel(oNewModel, sModelName);
                    }
                    if (bAddNewCardFromNewDataSource && !oAppComponent.getModel(oCardProperties.model)) {
                        var oNewCardModel = new sap.ui.model.odata.v2.ODataModel(SettingsUtils.newDataSourceModel.serviceURI, {
                            'annotationURI': SettingsUtils.newDataSourceModel.serviceAnnotationURI,
                            'defaultCountMode': sap.ui.model.odata.CountMode.None
                            }),
                        sModelName = oCardProperties.model;
                        SettingsUtils.setDataSources(SettingsUtils.newDataSourceModel.serviceAnnotation, SettingsUtils.newDataSourceModel.serviceAnnotationURI);
                        oMainView.setModel(oNewCardModel, sModelName);
                        oAppComponent.setModel(oNewCardModel, sModelName);
                    }
                    oCardProperties.settings.baseUrl = oMainController._getBaseUrl();
                    if (bNewStaticLinkListCard || bNewKPICard || bAddNewCard) {
                        oCardProperties.settings.newCard = true;
                        oLayoutModel._setCardSpanFromDefault(oCardProperties);
                        oCardProperties.dashboardLayout.row = 1;
                        oCardProperties.dashboardLayout.column = 1;
                    } else {
                        oCardProperties.settings.cloneCard = true;
                    }
                    var iIndex = -1, i;
                    for (i = 0; i < aCards.length; i++) {
                        if (oCardProperties.id.lastIndexOf(CommonUtils._getLayerNamespace() + "." + aCards[i].id, 0) === 0) {
                            iIndex = i;
                            var oCard = oLayoutModel.getCardById(aCards[i].id);
                            oCardProperties.dashboardLayout = jQuery.extend(true, {}, oCard.dashboardLayout);
                            var iCloneCardColumn = oCardProperties.dashboardLayout.column + oCardProperties.dashboardLayout.colSpan;
                            //If the card is present at the last column then the clone card is created at 1st column
                            // else besides to the card
                            oCardProperties.dashboardLayout.column = iCloneCardColumn < oLayoutModel.getColCount() ? iCloneCardColumn : 1;
                            break;
                        }
                    }
                    aCards.splice(iIndex + 1, 0, oCardProperties);
                    oLayoutUtil.getCards().splice(iIndex + 1, 0, oCardProperties);
                    oUIModel.setProperty("/cards", aCards);
                    oMainLayout.insertContent(oNewComponentContainer, iIndex + 1);
                    /**
                     *  Inside RTA Mode
                     *  Waiting for the component container to be created
                     *  Cloned card is selected and focused
                     *  Message Toast is shown when the card has been successfully cloned
                     */
                    setTimeout(function () {
                        var oOverLay = OverlayRegistry.getOverlay(oNewComponentContainer);
                        oOverLay.setSelected(true);
                        oOverLay.focus();
                        var sMessage = (bNewStaticLinkListCard || bNewKPICard || bAddNewCard) ? OvpResources.getText("OVP_KEYUSER_TOAST_MESSAGE_FOR_NEW") :
                            OvpResources.getText("OVP_KEYUSER_TOAST_MESSAGE_FOR_CLONE");

                        MessageToast.show(sMessage, {
                            duration: 10000
                        });
                    }, 0);

                    oMainController.recreateRTAClonedCard(oCardProperties);

                    return true;
                },

                revertChange : function(oChange, oControl, mPropertyBag) {
                    var oMainView = mPropertyBag.appComponent.getRootControl(),
                        oAppComponent =  mPropertyBag.appComponent,
                        oMainController = oMainView.getController(),
                        sCardId = oChange.getRevertData(),
                        oCardProperties = oChange.getContent();

                    var oCard = oMainView.byId(sCardId),
                        oUIModel = oMainController.getUIModel(),
                        aCards = oUIModel.getProperty("/cards"),
                        oMainLayout = oMainController.getLayout(),
                        oLayoutUtil = oMainLayout.getDashboardLayoutUtil(),
                        oLayoutModel = oMainLayout.getDashboardLayoutModel(),
                        oLayoutCards = oLayoutUtil.getCards();

                    var iIndex = -1, i, j, jIndex = -1;
                    for (i = 0; i < aCards.length; i++) {
                        if (sCardId === aCards[i].id) {
                            iIndex = i;
                            break;
                        }
                    }
                    aCards.splice(iIndex, 1);
                    for (j = 0; j < oLayoutCards.length; j++) {
                        if (sCardId === oLayoutCards[j].id) {
                            jIndex = j;
                            break;
                        }
                    }
                    oLayoutCards.splice(jIndex, 1);
                    oLayoutModel._removeSpaceBeforeCard();
                    oUIModel.setProperty("/cards", aCards);
                    if (oCard) {
                        var oComponent = oCard.getComponentInstance(),
                            oComponentData = oComponent.getComponentData(),
                            bNewKPICard = (oComponentData.cardId.indexOf("newKPICard_N") !== -1) && !SettingsUtils.checkClonedCard(sCardId);
                        if (bNewKPICard) {
                            var sModelName = oComponentData.modelName,
                                oNewModel = oMainView.getModel(sModelName);
                            oNewModel.destroy();
                            if (oCardProperties.settings["sAnnoKey"]) {
                                SettingsUtils.removeDataSources(oCardProperties.settings["sAnnoKey"]);
                            }
                            oMainView.setModel(null, sModelName);
                            oAppComponent.setModel(null, sModelName);
                        }
                        oComponent.destroy();
                    }
                    oMainLayout.removeContent(iIndex);
                    oCard.destroy();

                    oChange.resetRevertData(); // Clear the revert data on the change

                    return true;
                },

                completeChangeContent : function(oChange, oSpecificChangeInfo, mPropertyBag) {
                    return;
                }
            },
            layers: {
                "CUSTOMER_BASE": true,
                "CUSTOMER": true,
                "USER": true
            }
        },

        "dragAndDropUI": {
            changeHandler: {
                applyChange: function (oChange, oPanel, mPropertyBag) {
                    var oMainController = mPropertyBag.appComponent.getRootControl().getController(),
                        oContent = oChange.getContent(),
                        oMainLayout = oMainController.getLayout(),
                        oLayoutUtil = oMainLayout.getDashboardLayoutUtil(),
                        oLayoutModel = oMainLayout.getDashboardLayoutModel(),
                        oCard = oLayoutModel.getCardById(oContent.cardId),
                        sLayoutKey = 'C' + oLayoutModel.getColCount(),
                        affectedCards = [];
                    oChange.setRevertData(oContent);

                    oLayoutModel._arrangeCards(oCard, {
                        row: oContent.dashboardLayout[sLayoutKey].row,
                        column: oContent.dashboardLayout[sLayoutKey].column
                    }, 'drag', affectedCards);
                    oLayoutModel._removeSpaceBeforeCard(affectedCards);
                    oLayoutUtil._positionCards(oLayoutModel.aCards);
                    return true;
                },
                revertChange: function (oChange, oControl, mPropertyBag) {
                    var oMainController = mPropertyBag.appComponent.getRootControl().getController(),
                        oContent = oChange.getContent(),
                        oMainLayout = oMainController.getLayout(),
                        oLayoutUtil = oMainLayout.getDashboardLayoutUtil(),
                        oLayoutModel = oMainLayout.getDashboardLayoutModel(),
                        oCard = oLayoutModel.getCardById(oContent.cardId),
                        sLayoutKey = 'C' + oLayoutModel.getColCount(),
                        affectedCards = [];

                    oLayoutModel._arrangeCards(oCard, {
                        row: oContent.dashboardLayout[sLayoutKey].oldRow,
                        column: oContent.dashboardLayout[sLayoutKey].oldColumn
                    }, 'drag', affectedCards);
                    //As the card size was bigger initially(so that not getting fit in the layout), we have to resize the card to its previous size
                    if (oContent.dashboardLayout[sLayoutKey].oldColSpan) {
                        oLayoutModel._arrangeCards(oCard, {
                            row: oContent.dashboardLayout[sLayoutKey].rowSpan,
                            column: oContent.dashboardLayout[sLayoutKey].oldColSpan
                        }, 'resize', affectedCards);
                    }
                    oLayoutModel._removeSpaceBeforeCard(affectedCards);
                    oLayoutUtil._positionCards(oLayoutModel.aCards);
                    oChange.resetRevertData(); // Clear the revert data on the change
                    return true;
                },
                completeChangeContent: function (oChange, oSpecificChangeInfo, mPropertyBag) {
                    return;
                }
            },
            layers: {
                "CUSTOMER_BASE": true,
                "CUSTOMER": true,
                "USER": true  // enables personalization which is by default disabled
            }
        },
        "viewSwitch": CardChangeHandler.PersonalizationConfigEmpty,
        "visibility": CardChangeHandler.PersonalizationConfigEmpty,
        "dragOrResize": CardChangeHandler.PersonalizationConfigEmpty
    };
}, /* bExport= */true);