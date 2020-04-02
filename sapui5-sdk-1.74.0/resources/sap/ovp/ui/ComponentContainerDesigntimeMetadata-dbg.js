/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */

sap.ui.define([
        "sap/ui/thirdparty/jquery",
        "sap/ovp/cards/CommonUtils",
        "sap/ovp/cards/SettingsUtils",
        "sap/ui/dt/plugin/ElementMover",
        "sap/ui/dt/OverlayRegistry",
        'sap/ui/dt/OverlayUtil',
        'sap/ui/rta/plugin/Plugin',
        'sap/ui/rta/util/BindingsExtractor',
        'sap/ui/dt/MetadataPropagationUtil',
        'sap/ui/rta/Utils',
        "sap/ovp/app/resources",
        "sap/ovp/app/OVPUtils",
        "sap/base/Log"
    ], function (jQuery, CommonUtils, SettingsUtils, ElementMover, OverlayRegistry, OverlayUtil, Plugin, BindingsExtractor, MetadataPropagationUtil, Utils, OvpResources, OVPUtils, Log) {
        "use strict";
        var oAppMain = CommonUtils.getApp();

        var bIfThereIsKPIForSSB = false;
        var _getKPIForSSBApp = function () {
            var sUrl = "https://" + window.location.host + "/sap/opu/odata/SSB/SMART_BUSINESS_DESIGNTIME_SRV/KPIs";
            jQuery.ajax({
                type : "GET",
                url : sUrl,
                dataType : "json",
                async: false,
                headers: "",
                success : function(data,textStatus, jqXHR) {
                    var oData = {
                        'd': {
                            'results': []
                        }
                    };
                    oData.d.results = data.d.results.filter(function (oKPIData) {
                        return !!oKPIData.ModelURI;
                    });
                    bIfThereIsKPIForSSB = (oData.d.results.length > 0);
                    if (bIfThereIsKPIForSSB) {
                        var oModel = new sap.ui.model.json.JSONModel();
                        oModel.setData(oData);
                        oAppMain.getView().setModel(oModel, "JSONModelForSSB");
                    }
                },
                error: function(oEvent) {
                    Log.error(oEvent);
                }
            });
        };
        _getKPIForSSBApp();
        var oElementMover = new ElementMover(),
            _deactivateTargetZone = function (oOverlay) {
                oOverlay.setTargetZone(false);
            },
            _activateValidTargetZone = function (oOverlay) {
                oOverlay.setTargetZone(true);
            },
            _getTargetZoneAggregation = function(oTargetOverlay) {
                var aAggregationOverlays = oTargetOverlay.getAggregationOverlays();
                var aPossibleTargetZones = aAggregationOverlays.filter(function(oAggregationOverlay) {
                    return oAggregationOverlay.isTargetZone();
                });
                if (aPossibleTargetZones.length > 0) {
                    return aPossibleTargetZones[0];
                } else {
                    return null;
                }
            },
            _executePaste = function (oTargetOverlay) {
                var oCutOverlay = oElementMover.getMovedOverlay();
                if (!oCutOverlay) {
                    return false;
                }

                var bResult = false;
                if (!(oTargetOverlay.getElement() === oCutOverlay.getElement())) {
                    var oTargetZoneAggregation = _getTargetZoneAggregation(oTargetOverlay);
                    if (oTargetZoneAggregation) {
                        //oElementMover.insertInto(oCutOverlay, oTargetZoneAggregation);
                        bResult = true;
                    } else if (OverlayUtil.isInTargetZoneAggregation(oTargetOverlay)) {
                        //oElementMover.repositionOn(oCutOverlay, oTargetOverlay);
                        bResult = true;
                    }
                }

                if (bResult) {
                    oCutOverlay.setSelected(true);
                    setTimeout(function () {
                        oCutOverlay.focus();
                    }, 0);
                }

                return bResult;
            },
            _iterateOverAllAggregationOverlays = function (oOverlay, fnStep) {
                var aAggregationOverlays = oOverlay.getAggregationOverlays();
                aAggregationOverlays.forEach(function(oAggregationOverlay) {
                    fnStep(oAggregationOverlay);
                });
            },
            _iterateOverAllSiblings = function (oSelectedElement, fnStep) {
                var oOverlay = OverlayRegistry.getOverlay(oSelectedElement),
                    oParentOverlay = oOverlay.getParentElementOverlay(),
                    aSiblingOverlays = OverlayUtil.findAllSiblingOverlaysInContainer(oOverlay, oParentOverlay);

                aSiblingOverlays.forEach(function (oSiblingOverlays) {
                    _iterateOverAllAggregationOverlays(oSiblingOverlays, fnStep);
                });
            };

        // "checkTargetZone" function overriding
        var fCheckTargetZone = ElementMover.prototype.checkTargetZone;

        ElementMover.prototype.checkTargetZone = function (oAggregationOverlay, oOverlay, bOverlayNotInDom) {
            var oMovedOverlay = oOverlay ? oOverlay : this.getMovedOverlay();

            var bTargetZone = fCheckTargetZone.apply(this, arguments);
            if (!bTargetZone) {
                return Promise.resolve(false);
            }

            var oMovedElement = oMovedOverlay.getElement();
            var oTargetOverlay = oAggregationOverlay.getParent();
            var oMovedRelevantContainer = oMovedOverlay.getRelevantContainer();
            var oTargetElement = oTargetOverlay.getElement();
            var oAggregationDtMetadata = oAggregationOverlay.getDesignTimeMetadata();

            // determine target relevantContainer
            var vTargetRelevantContainerAfterMove = MetadataPropagationUtil.getRelevantContainerForPropagation(oAggregationDtMetadata.getData(), oMovedElement);
            vTargetRelevantContainerAfterMove = vTargetRelevantContainerAfterMove ? vTargetRelevantContainerAfterMove : oTargetElement;

            // check for same relevantContainer
            if (
                !oMovedRelevantContainer
                || !vTargetRelevantContainerAfterMove
                || !Plugin.prototype.hasStableId(oTargetOverlay)
                || oMovedRelevantContainer !== vTargetRelevantContainerAfterMove
            ) {
                return Promise.resolve(false);
            }

            // Binding context is not relevant if the element is being moved inside its parent
            if (oMovedOverlay.getParent().getElement() !== oTargetElement) {
                // check if binding context is the same
                var aBindings = BindingsExtractor.getBindings(oMovedElement, oMovedElement.getModel());
                if (Object.keys(aBindings).length > 0 && oMovedElement.getBindingContext() && oTargetElement.getBindingContext()) {
                    var sMovedElementBindingContext = Utils.getEntityTypeByPath(
                        oMovedElement.getModel(),
                        oMovedElement.getBindingContext().getPath()
                    );
                    var sTargetElementBindingContext = Utils.getEntityTypeByPath(
                        oTargetElement.getModel(),
                        oTargetElement.getBindingContext().getPath()
                    );
                    if (!(sMovedElementBindingContext === sTargetElementBindingContext)) {
                        return Promise.resolve(false);
                    }
                }
            }

            return Promise.resolve(true);
        };

        ElementMover.prototype.deactivateAllTargetZones = function (oSelectedElement) {
            _iterateOverAllSiblings(oSelectedElement, _deactivateTargetZone);
        };

        ElementMover.prototype.activateAllValidTargetZones = function (oSelectedElement) {
            _iterateOverAllSiblings(oSelectedElement, _activateValidTargetZone);
        };

        var oComponentContainerDesigntimeMetadata = {
            name: {
                singular: OvpResources.getText("Card"),
                plural: OvpResources.getText("Cards")
            },
            actions: {
                remove: {
                    name: OvpResources.getText("OVP_KEYUSER_MENU_HIDE_CARD") ,
                    changeType: "hideCardContainer",
                    changeOnRelevantContainer: true
                },
                reveal: {
                    changeType: "unhideCardContainer",
                    changeOnRelevantContainer: true,
                    getLabel: function (oControl) {
                        var sCardId = this._getCardId(oControl.getId()),
                            oComponentData = this._getCardFromManifest(sCardId);
                        if (oComponentData) {
                            var cardSettings = oComponentData.settings;
                            if (cardSettings.title) {
                                return cardSettings.title;
                            } else if (cardSettings.category) {
                                return (cardSettings.category);
                            } else if (cardSettings.subTitle) {
                                return cardSettings.subTitle;
                            }
                            return oComponentData.cardId;
                        } else {
                            Log.error("Card id " + sCardId + " is not present in the manifest");
                            return "";
                        }
                    }.bind(oAppMain)
                }
            }
        };
        /**
         *  These actions should only be shown if layer is "CUSTOMER"
         *  or not defined. In case of not defined default layer is "CUSTOMER"
         */
        var sLayer = CommonUtils._getLayer();
            oComponentContainerDesigntimeMetadata.actions["settings"] = function (oElement) {
                if (!oElement.getComponentInstance()) { //Adding this check to skip card containers that don't have card components. Case of hidden cards in DTA
                    return {};
                }
                var oComponentData = oElement.getComponentInstance().getComponentData(),
                    oMainController = oComponentData.mainComponent,
                    oCard = oMainController._getCardFromManifest(oComponentData.cardId);
                if (!oCard || !CommonUtils.checkIfCardTypeSupported(oCard.template)) {
                    return {};
                }
                var oSettings = {
                    "EditCard": {
                        icon: "sap-icon://edit",
                        name: OvpResources.getText("OVP_KEYUSER_MENU_EDIT_CARD"),
                        isEnabled: function (oSelectedElement) {
                            return true;
                        },
                        changeOnRelevantContainer: true,
                        handler: SettingsUtils.fnEditCardHandler
                    },
                    "CloneCard": {
                        icon: "sap-icon://value-help",
                        name: OvpResources.getText("OVP_KEYUSER_MENU_CLONE_CARD"),
                        isEnabled: function (oSelectedElement) {
                            return true;
                        },
                        handler: SettingsUtils.fnCloneCardHandler
                    }
                };
                if (!sLayer || sLayer === OVPUtils.Layers.customer) {
                    oSettings["Cut"] = {
                        icon: "sap-icon://scissors",
                        name: OvpResources.getText("OVP_KEYUSER_MENU_CUT_CARD"),
                        isEnabled: function (oSelectedElement) {
                            return true;
                        },
                        changeOnRelevantContainer: true,
                        handler: function (oSelectedElement, fGetUnsavedChanges) {
                            var oOverlay = OverlayRegistry.getOverlay(oSelectedElement),
                                oCutOverlay = oElementMover.getMovedOverlay();
                            if (oCutOverlay) {
                                oCutOverlay.removeStyleClass("sapUiDtOverlayCutted");
                                oElementMover.setMovedOverlay(null);
                                oElementMover.deactivateAllTargetZones(oSelectedElement);
                            }

                            oElementMover.setMovedOverlay(oOverlay);
                            oOverlay.addStyleClass("sapUiDtOverlayCutted");

                            oElementMover.activateAllValidTargetZones(oSelectedElement);
                            return Promise.resolve([]).then(function () {
                                return [];
                            });
                        }
                    };
                    oSettings["Paste"] = {
                        icon: "sap-icon://paste",
                        name: OvpResources.getText("OVP_KEYUSER_MENU_PASTE_CARD"),
                        isEnabled: function (oSelectedElement) {
                            var oOverlay = OverlayRegistry.getOverlay(oSelectedElement),
                                oTargetZoneAggregation = _getTargetZoneAggregation(oOverlay);
                            return !!((oTargetZoneAggregation) || (OverlayUtil.isInTargetZoneAggregation(oOverlay)));
                        },
                        changeOnRelevantContainer: true,
                        handler: function (oSelectedElement, fGetUnsavedChanges) {
                            var oOverlay = OverlayRegistry.getOverlay(oSelectedElement),
                                oCutOverlay = oElementMover.getMovedOverlay();

                            if (oCutOverlay) {
                                var oMovedElement = oCutOverlay.getElement(),
                                    oTargetElement = oOverlay.getElement(),
                                    oSource = OverlayUtil.getParentInformation(oCutOverlay),
                                    oTarget = OverlayUtil.getParentInformation(oOverlay),
                                    oMainComponent = oSelectedElement.getComponentInstance().getComponentData().mainComponent,
                                    oMainLayout = oMainComponent.getLayout(),
                                    oUIModel = oMainComponent.getUIModel(),
                                    oPayLoadData = {}, oUIData = {}, aChanges = [];

                                if (oUIModel.getProperty('/containerLayout') === 'resizable') {
                                    var oLayoutModel = oMainLayout.getDashboardLayoutModel(),
                                        sSourceCardId = oMainComponent._getCardId(oMovedElement.getId()),
                                        sTargetCardId = oMainComponent._getCardId(oSelectedElement.getId()),
                                        oSourceCardObj = oLayoutModel.getCardById(sSourceCardId),
                                        oTargetCardObj = oLayoutModel.getCardById(sTargetCardId),
                                        iColumnCount = oLayoutModel.getColCount(),
                                        sLayoutKey = 'C' + iColumnCount,
                                        affectedCards = [];

                                    oPayLoadData.cardId = sSourceCardId;
                                    oPayLoadData.dashboardLayout = {};
                                    oPayLoadData.dashboardLayout[sLayoutKey] = {
                                        row: oTargetCardObj.dashboardLayout.row,
                                        oldRow: oSourceCardObj.dashboardLayout.row,
                                        column: oTargetCardObj.dashboardLayout.column,
                                        oldColumn: oSourceCardObj.dashboardLayout.column
                                    };
                                    //If the moved card can not be into the new position(going out of layout) then save the colSpan/rowSpan
                                    if (oTargetCardObj.dashboardLayout.column + oSourceCardObj.dashboardLayout.colSpan > iColumnCount + 1) {
                                        oPayLoadData.dashboardLayout[sLayoutKey].colSpan = oTargetCardObj.dashboardLayout.colSpan;
                                        oPayLoadData.dashboardLayout[sLayoutKey].oldColSpan = oSourceCardObj.dashboardLayout.colSpan;
                                        oPayLoadData.dashboardLayout[sLayoutKey].rowSpan = oSourceCardObj.dashboardLayout.rowSpan;
                                        oPayLoadData.dashboardLayout[sLayoutKey].oldRowSpan = oSourceCardObj.dashboardLayout.rowSpan;
                                    }
                                    aChanges.push({
                                        selectorControl: oSelectedElement.getComponentInstance().getComponentData().appComponent.getRootControl().getController().getLayout(),
                                        changeSpecificData: {
                                            changeType: "dragOrResize",
                                            content: oPayLoadData
                                        }
                                    });
                                    aChanges.push({
                                        selectorControl: oSelectedElement.getComponentInstance().getComponentData().appComponent.getRootControl().getController().getLayout(),
                                        changeSpecificData: {
                                            runtimeOnly: true, //UI change would be used only at runtime to modify the app; it will not be persisted
                                            changeType: "dragAndDropUI",
                                            content: oPayLoadData
                                        }
                                    });
                                    oLayoutModel._arrangeCards(oSourceCardObj, {
                                        row: oTargetCardObj.dashboardLayout.row,
                                        column: oTargetCardObj.dashboardLayout.column
                                    }, 'drag', affectedCards);
                                    oLayoutModel._removeSpaceBeforeCard(affectedCards);
                                    affectedCards.forEach(function (item) {
                                        var obj = {};
                                        obj.dashboardLayout = {};
                                        obj.cardId = item.content.cardId;
                                        obj.dashboardLayout[sLayoutKey] = item.content.dashboardLayout;
                                        aChanges.push({
                                            selectorControl: oSelectedElement.getComponentInstance().getComponentData().appComponent.getRootControl().getController().getLayout(),
                                            changeSpecificData: {
                                                changeType: "dragOrResize",
                                                content: obj
                                            }
                                        });
                                    });
                                } else {
                                    /**
                                     *  Only in case of Fixed Layout
                                     *  Removing all the hidden cards to get correct position
                                     *  and old position of the card being moved
                                     */
                                    var aVisibleContent = oTarget.parent.getContent().filter(function (oCard) {
                                        return oCard.getVisible();
                                    });
                                    oPayLoadData = {
                                        cardId: oMainComponent._getCardId(oMovedElement.getId()),
                                        position: aVisibleContent.indexOf(oTargetElement),
                                        oldPosition: aVisibleContent.indexOf(oMovedElement)
                                    };
                                    aChanges.push({
                                        selectorControl: oSelectedElement.getComponentInstance().getComponentData().appComponent.getRootControl().getController().getLayout(),
                                        changeSpecificData: {
                                            changeType: "position",
                                            content: oPayLoadData
                                        }
                                    });

                                    /**
                                     *  Only in case of Fixed Layout
                                     *  For UI Changes we need to get index for position
                                     *  and old position from the array of cards including
                                     *  all the hidden cards
                                     */
                                    oUIData = {
                                        cardId: oMainComponent._getCardId(oMovedElement.getId()),
                                        position: oTarget.index,
                                        oldPosition: oSource.index
                                    };
                                    aChanges.push({
                                        selectorControl: oSelectedElement.getComponentInstance().getComponentData().appComponent.getRootControl().getController().getLayout(),
                                        changeSpecificData: {
                                            runtimeOnly: true, //UI change would be used only at runtime to modify the app; it will not be persisted
                                            changeType: "dragAndDropUI",
                                            content: oUIData
                                        }
                                    });
                                }
                            }

                            _executePaste(oOverlay);

                            /*this.fireElementModified({
                             "command" : this.getElementMover().buildMoveCommand()
                             });*/

                            if (oCutOverlay) {
                                oCutOverlay.removeStyleClass("sapUiDtOverlayCutted");
                                oElementMover.setMovedOverlay(null);
                                oElementMover.deactivateAllTargetZones(oSelectedElement);

                                return Promise.resolve(aChanges).then(function (aLayoutChanges) {
                                    return aLayoutChanges;
                                });
                            }
                        }
                    };
                    oSettings["AddStaticLinkListCard"] = {
                        icon: "sap-icon://form",
                        name: OvpResources.getText("OVP_KEYUSER_MENU_CREATE_LINK_LIST_CARD"),
                        isEnabled: function (oSelectedElement) {
                            return true;
                        },
                        handler: SettingsUtils.fnAddStaticLinkListCardHandler
                    };
                    if (bIfThereIsKPIForSSB) {
                        oSettings["AddKPICard"] = {
                            icon: "sap-icon://kpi-corporate-performance",
                            name: OvpResources.getText("OVP_KEYUSER_MENU_ADD_KPI_CARD"),
                            isEnabled: function (oSelectedElement) {
                                return true;
                            },
                            handler: SettingsUtils.fnAddKPICardHandler
                        };
                    }
                } else if (sLayer && (sLayer === OVPUtils.Layers.vendor || sLayer === OVPUtils.Layers.customer_base)) {
                    oSettings["AddCard"] = {
                        icon: "sap-icon://add-activity",
                        name: OvpResources.getText("OVP_KEYUSER_MENU_AddCard"),
                        isEnabled: function (oSelectedElement) {
                            return true;
                        },
                        handler: SettingsUtils.fnAddNewCardHandler
                    };
                }
                oSettings["RemoveCard"] = {
                    icon: "sap-icon://delete",
                    name: OvpResources.getText("OVP_KEYUSER_MENU_REMOVE_CARD"),
                    isEnabled: function (oSelectedElement) {
                        var oSettings = oSelectedElement.getComponentInstance().getComponentData().settings;
                        return oSelectedElement.getId().indexOf(CommonUtils._getLayerNamespace() + ".") !== -1 && !oSettings.cloneCard && !oSettings.newCard;
                    },
                    handler: SettingsUtils.fnRemoveCardHandler
                };
            return oSettings;
            };
        return oComponentContainerDesigntimeMetadata;
    },
    /* bExport= */true);
