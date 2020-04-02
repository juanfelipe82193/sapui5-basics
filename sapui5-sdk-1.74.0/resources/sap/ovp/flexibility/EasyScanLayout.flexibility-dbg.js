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
                        oCard = oMainView.byId(oCardProperties.id);

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
                        oCard = oMainView.byId(oCardProperties.id);

                    if (oCard) {
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
                    } else {
                        oCardProperties.settings.cloneCard = true;
                    }
                    var iIndex = -1, i;
                    for (i = 0; i < aCards.length; i++) {
                        if (oCardProperties.id.lastIndexOf(CommonUtils._getLayerNamespace() + "." + aCards[i].id, 0) === 0) {
                            iIndex = i;
                            break;
                        }
                    }
                    aCards.splice(iIndex + 1, 0, oCardProperties);
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
                        oMainLayout = oMainController.getLayout();

                    var iIndex = -1, i;
                    for (i = 0; i < aCards.length; i++) {
                        if (sCardId === aCards[i].id) {
                            iIndex = i;
                            break;
                        }
                    }
                    aCards.splice(iIndex, 1);
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
        "dragAndDropUI" : {
            changeHandler: {
                applyChange: function (oChange, oPanel, mPropertyBag) {
                    var oMainController = mPropertyBag.appComponent.getRootControl().getController(),
                        oContent = oChange.getContent(),
                        oCopyContent = jQuery.extend(true, {}, oContent),
                        oUIModel = oMainController.getUIModel(),
                        aCards = oUIModel.getProperty("/cards"),
                        oMainLayout = oMainController.getLayout(), val;

                    // Swapping position to create data for undo operation
                    val = oCopyContent.position;
                    oCopyContent.position = oCopyContent.oldPosition;
                    oCopyContent.oldPosition = val;
                    oChange.setRevertData(oCopyContent); // Here the information is stored on the change

                    // Swapping position of the cards array
                    val = aCards[oContent.position];
                    aCards[oContent.position] = aCards[oContent.oldPosition];
                    aCards[oContent.oldPosition] = val;
                    oUIModel.setProperty("/cards", aCards);

                    var oTargetComponentContainer = oMainLayout.getContent()[oContent.position],
                        oComponentContainer = oMainLayout.getContent()[oContent.oldPosition];

                    oMainLayout.removeContent(oComponentContainer);
                    oMainLayout.insertContent(oComponentContainer, oContent.position);

                    oMainLayout.removeContent(oTargetComponentContainer);
                    oMainLayout.insertContent(oTargetComponentContainer, oContent.oldPosition);

                    setTimeout(function () {
                        var oOverLay = OverlayRegistry.getOverlay(oComponentContainer);
                        oOverLay.setSelected(true);
                        oOverLay.focus();
                    }, 0);

                    return true;
                },
                revertChange : function(oChange, oControl, mPropertyBag) {
                    var oMainController = mPropertyBag.appComponent.getRootControl().getController(),
                        oContent = oChange.getRevertData(),
                        oUIModel = oMainController.getUIModel(),
                        aCards = oUIModel.getProperty("/cards"),
                        oMainLayout = oMainController.getLayout(), val;

                    // Swapping position of the cards array
                    val = aCards[oContent.position];
                    aCards[oContent.position] = aCards[oContent.oldPosition];
                    aCards[oContent.oldPosition] = val;
                    oUIModel.setProperty("/cards", aCards);

                    var oTargetComponentContainer = oMainLayout.getContent()[oContent.position],
                        oComponentContainer = oMainLayout.getContent()[oContent.oldPosition];

                    oMainLayout.removeContent(oComponentContainer);
                    oMainLayout.insertContent(oComponentContainer, oContent.position);

                    oMainLayout.removeContent(oTargetComponentContainer);
                    oMainLayout.insertContent(oTargetComponentContainer, oContent.oldPosition);

                    setTimeout(function () {
                        var oOverLay = OverlayRegistry.getOverlay(oComponentContainer);
                        oOverLay.setSelected(true);
                        oOverLay.focus();
                    }, 0);

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
                "USER": true  // enables personalization which is by default disabled
            }
        },
        /**
         * Personalization change handlers
         */
        "viewSwitch": CardChangeHandler.PersonalizationConfigEmpty,
        "visibility": CardChangeHandler.PersonalizationConfigEmpty,
        "position": CardChangeHandler.PersonalizationConfigEmpty
    };
}, /* bExport= */true);