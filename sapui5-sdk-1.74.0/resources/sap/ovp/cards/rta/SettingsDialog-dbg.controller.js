sap.ui.define([ "sap/ui/thirdparty/jquery",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ovp/cards/OVPCardAsAPIUtils",
    "sap/ovp/cards/SettingsUtils", "sap/ovp/cards/PayLoadUtils",
    "sap/ovp/cards/rta/SettingsDialogConstants",
    "sap/m/MessageBox", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/model/ChangeReason",
    "sap/ovp/cards/linklist/AnnotationHelper",
    "sap/ovp/cards/AnnotationHelper", "sap/ui/core/IconPool",
    "sap/ui/core/mvc/ViewType", "sap/m/Dialog", "sap/m/Button", "sap/ovp/cards/CommonUtils", "sap/ui/Device", "sap/ovp/app/resources", "sap/ovp/app/OVPUtils", "sap/base/Log", "sap/base/util/deepEqual"],
    function(jQuery, Controller, JSONModel,
            OVPCardAsAPIUtils, settingsUtils, PayLoadUtils, SettingsConstants,
            MessageBox, Filter, FilterOperator, ChangeReason, LinkAnnotationHelper, CardAnnotationHelper,
            IconPool, ViewType, Dialog, Button, CommonUtils, Device, OvpResources, OVPUtils, Log, deepEqual) {
    "use strict";

    return Controller.extend("sap.ovp.cards.rta.SettingsDialog", {

        /* To store manifest setting of selected Card*/
        _oCardManifestSettings : {},
        /*To store the elements that do not require refresh when updated*/
        _aRefreshNotRequired : SettingsConstants._aRefreshNotRequired,
        _aRefreshRequired : SettingsConstants._aRefreshRequired,
        /*To store the element that needs to update the manifest for add new card*/
        _updateManifestProperties : SettingsConstants._updateManifestProperties,
        /*To store all annotation array */
        aVariantNames : SettingsConstants.aVariantNames,
        oOvpResourceBundle: OvpResources,
        oMandatoryPropertiesKey : SettingsConstants.oMandatoryPropertiesKey,

        onInit : function() {
            /*Attaching CreateAndSubmitChange button to oSaveButton*/
            settingsUtils.oSaveButton.attachPress(this.onSaveButtonPress,this);
            settingsUtils.oResetButton.attachPress(this.onResetButton,this);
            settingsUtils.oMessagePopOverButton.attachPress(this.handleMessagePopoverPress, this);
        },

        onAfterRendering : function() {
            settingsUtils.dialogBox.addStyleClass("sapOvpSettingsDialogBox");
            this.setEnablePropertyForResetAndSaveButton(false);
            this._oCardManifestSettings = this.getView().getModel().getData();
            this._oOriginalCardManifestSettings = jQuery.extend(true, {}, this._oCardManifestSettings);
            var oView = this.getView(),
                /*oVisibilityModel = oView.getModel("visibility"),*/
            oCardPropertiesModel = oView.getModel();
            //This is not applicable for "AddNewCard" as preview is not required for new card
            if (!this._oCardManifestSettings.addNewCard) {
                var dialogCard = oView.byId("dialogCard");
                if (!dialogCard.getVisible()) {
                    dialogCard = oView.byId("dialogCardNoPreview");
                }
                dialogCard.getDomRef().style.minHeight = this._oCardManifestSettings.dialogBoxHeight + "px";
                /*var oScrollContainerForForm = oView.byId("SettingsDialogScrollContainerForForm");
                if (oScrollContainerForForm) {
                    oScrollContainerForForm.getDomRef().style.height =
                        (oVisibilityModel.getProperty("/viewSwitchEnabled")) ? this.getValueInRemString(settingsUtils.iContentHeightForDialogWithViewSwitch)
                            : this.getValueInRemString(settingsUtils.iContentHeightForDialog);
                }*/
                oView.byId("dialogCardOverlay").getDomRef().style.minHeight = this._oCardManifestSettings.dialogBoxHeight + "px";
                settingsUtils.settingFormWidth(oView, "calc(100% - " + (this._oCardManifestSettings.dialogBoxWidth + 1) + "rem)");
                setTimeout( function(){
                    var dialogCard = this.getView().byId("dialogCard");
                    if (dialogCard.getVisible()) {
                        dialogCard.setBusy(false);
                    }
                }.bind(this), 2000);
            }

            if (this._oCardManifestSettings.staticContent) {
                // Initial error checks for Link title and Static Link
                this.handleErrorHandling(oCardPropertiesModel, "title", "/staticContent");
                this.handleErrorHandling(oCardPropertiesModel, "targetUri", "/staticContent");
            }
            if (settingsUtils.bNewKPICardFlag) {
                var oModel = oView.getModel();
                var iLength = oView.byId("sapOvpKPITable").getBinding("items").getLength();
                //This Property changes when the search is applied
                oModel.setProperty("/NoOfKPIItem", iLength);
                //This remains constant in the link
                oModel.setProperty("/NoKPI",iLength);
            }
        },

        validateInputField: function (oEvent) {
            var oSource = oEvent.getSource();
            var iLength = oSource.getValue().trim().length;
            if (!iLength) {
                oSource.setValue(oSource.getValue().trim());
            }
            if (!this._oCardManifestSettings.addNewCard) {
                this.updateCard(oEvent);
            } else {
                this.setEnablePropertyForResetAndSaveButton(true);
            }
        },
        addView : function(oEvent) {
            this._oCardManifestSettings.showViewSwitchButton = true;
            //adding Mandatory field as is.
            this.setEnablePropertyForResetAndSaveButton(true);
            var defaultDataPointAnnotationPath,
                oCardManifestSettings = this._oCardManifestSettings,
                oCardPropertiesModel = this.getView().getModel();
            if (!oCardManifestSettings.addNewCard) {
                if (oCardManifestSettings.dataPointAnnotationPath && oCardManifestSettings.dataPoint &&
                    oCardManifestSettings.dataPoint.length) {
                    defaultDataPointAnnotationPath = oCardManifestSettings.dataPoint[0].value;
                }
            }
            if (oCardManifestSettings.tabs && oCardManifestSettings.tabs.length) {
                oCardManifestSettings.newViewCounter++;
                if (!oCardManifestSettings.addNewCard) {
                    if (oCardManifestSettings.template === "sap.ovp.cards.charts.analytical" || oCardManifestSettings.template === "sap.ovp.cards.charts.smart.chart") {
                        oCardManifestSettings.tabs.push({
                            chartAnnotationPath: oCardManifestSettings.chart[0].value,
                            dataPointAnnotationPath: defaultDataPointAnnotationPath,
                            value: this.oOvpResourceBundle && (this.oOvpResourceBundle.getText("OVP_KEYUSER_LABEL_VIEW_NAME") + " " + oCardManifestSettings.newViewCounter)
                        });
                    } else {
                        oCardManifestSettings.tabs.push({
                            annotationPath: oCardManifestSettings.lineItem[0].value,
                            dataPointAnnotationPath: defaultDataPointAnnotationPath,
                            value: this.oOvpResourceBundle && (this.oOvpResourceBundle.getText("OVP_KEYUSER_LABEL_VIEW_NAME") + " " + oCardManifestSettings.newViewCounter)
                        });
                    }
                } else {
                    oCardManifestSettings.tabs.push({
                        entitySet: "",
                        value: this.oOvpResourceBundle && (this.oOvpResourceBundle.getText("OVP_KEYUSER_LABEL_VIEW_NAME") + " " + oCardManifestSettings.newViewCounter)
                    });
                }
                var selectedKey = oCardManifestSettings.tabs.length;
                oCardManifestSettings.aViews.push({
                    text: this.oOvpResourceBundle && (this.oOvpResourceBundle.getText("OVP_KEYUSER_LABEL_VIEW_NAME") + " " + oCardManifestSettings.newViewCounter),
                    key: selectedKey,
                    isLaterAddedView: true,
                    isViewResetEnabled: false
                });
                if (!oCardManifestSettings.addNewCard) {
                    var iDefaultViewSelected = oCardManifestSettings.defaultViewSelected;
                    if (oCardManifestSettings.tabs[iDefaultViewSelected - 1].entitySet) {
                        oCardManifestSettings.tabs[selectedKey - 1].entitySet = oCardManifestSettings.allEntitySet[0].value;
                    }
                }
                this.selectViewSwitch(oEvent, selectedKey);
            } else {
                oCardManifestSettings.tabs = [{}];
                SettingsConstants.tabFields.forEach(function (tabField) {
                if (!oCardManifestSettings.addNewCard) {
                   if (tabField !== 'entitySet') {
                        oCardManifestSettings.tabs[0][tabField] = oCardManifestSettings[tabField];
                   }
                } else {
                    oCardManifestSettings.tabs[0][tabField] = oCardManifestSettings[tabField];
                }
                });
                oCardManifestSettings.tabs[0].value = this.oOvpResourceBundle && (this.oOvpResourceBundle.getText("OVP_KEYUSER_LABEL_VIEW_NAME") + " 1");
                if (!oCardManifestSettings.addNewCard) {
                    if (oCardManifestSettings.template === "sap.ovp.cards.charts.analytical" || oCardManifestSettings.template === "sap.ovp.cards.charts.smart.chart") {
                        oCardManifestSettings.tabs.push({
                            chartAnnotationPath: oCardManifestSettings.chart[0].value,
                            dataPointAnnotationPath: defaultDataPointAnnotationPath,
                            value: this.oOvpResourceBundle && (this.oOvpResourceBundle.getText("OVP_KEYUSER_LABEL_VIEW_NAME") + " 2")
                        });
                    } else {
                        oCardManifestSettings.tabs.push({
                            annotationPath: oCardManifestSettings.lineItem[0].value,
                            dataPointAnnotationPath: defaultDataPointAnnotationPath,
                            value: this.oOvpResourceBundle && (this.oOvpResourceBundle.getText("OVP_KEYUSER_LABEL_VIEW_NAME") + " 2")
                        });
                    }
                } else {
                    oCardManifestSettings.tabs.push({
                        entitySet: "",
                        value: this.oOvpResourceBundle && (this.oOvpResourceBundle.getText("OVP_KEYUSER_LABEL_VIEW_NAME") + " 2")
                    });
                }

                oCardManifestSettings.selectedKey = 1;
                oCardManifestSettings.defaultViewSelected = 1;
                oCardManifestSettings.aViews = [{
                    text: this.oOvpResourceBundle && this.oOvpResourceBundle.getText("OVP_KEYUSER_LABEL_MAIN_VIEW"),
                    key: 0,
                    isLaterAddedView: false,
                    isViewResetEnabled: false
                }, {
                    text: this.oOvpResourceBundle && (this.oOvpResourceBundle.getText("OVP_KEYUSER_LABEL_VIEW_NAME") + " 1 (" + this.oOvpResourceBundle.getText("OVP_KEYUSER_LABEL_DEFAULT_VIEW") + ")"),
                    key: 1,
                    initialSelectedKey: 1,
                    isLaterAddedView: false,
                    isViewResetEnabled: false
                }, {
                    text: this.oOvpResourceBundle && (this.oOvpResourceBundle.getText("OVP_KEYUSER_LABEL_VIEW_NAME") + " 2"),
                    key: 2,
                    isLaterAddedView: true,
                    isViewResetEnabled: false
                }];
                oCardManifestSettings.newViewCounter = 2;
                this.selectViewSwitch(oEvent, 1);
            }
            // Handling errors for Link title and Static Link
            this.handleErrorHandling(oCardPropertiesModel, "value", "/tabs");
        },
        deleteView: function(oEvent) {
            this.setEnablePropertyForResetAndSaveButton(true);
            var oCardManifestSettings = this._oCardManifestSettings,
                selectedKey = parseInt(oCardManifestSettings.selectedKey,10),
                oCardPropertiesModel = this.getView().getModel();
            oCardManifestSettings.tabs.splice(selectedKey - 1, 1);
            oCardManifestSettings.aViews.splice(selectedKey, 1);
            if (selectedKey === oCardManifestSettings.defaultViewSelected) {
                oCardManifestSettings.defaultViewSelected = 1;
                oCardManifestSettings.aViews[selectedKey].text = oCardManifestSettings.aViews[selectedKey].text + " (" + this.oOvpResourceBundle.getText("OVP_KEYUSER_LABEL_DEFAULT_VIEW") + ")";
            }
            oCardManifestSettings.aViews.forEach(function(view,index) {
                if (index >= selectedKey) {
                  view.key--;
               }
            });

            // Handling errors for Link title and Static Link
            this.handleErrorHandling(oCardPropertiesModel, "value", "/tabs");

            if (oCardManifestSettings.tabs.length == 1) {
                SettingsConstants.tabFields.forEach(function (tabField) {
                    var value = oCardManifestSettings.tabs[0][tabField];
                    if (tabField !== 'entitySet' || (tabField === 'entitySet' && value)) {
                        oCardManifestSettings[tabField] = value;
                    }
                });
                delete oCardManifestSettings.selectedKey;
                delete oCardManifestSettings.defaultViewSelected;
                delete oCardManifestSettings.tabs;
                delete oCardManifestSettings.aViews;
                oCardManifestSettings.aViews = [{
                    text: this.oOvpResourceBundle.getText("OVP_KEYUSER_SHOWS_DIFFERENT_VIEWS"),
                    key: 0,
                    initialSelectedKey: 0,
                    isLaterAddedView: false,
                    isViewResetEnabled: false
                }];
                settingsUtils.addManifestSettings(oCardManifestSettings);
                settingsUtils.setVisibilityForFormElements(oCardManifestSettings);
                this.getView().getModel("visibility").refresh();
                this.getView().getModel().refresh();
                if (!oCardManifestSettings.addNewCard) {
                    this._fCardWithRefresh();
                }
            } else {
                oCardManifestSettings.selectedKey = 1;
                this.selectViewSwitch(oEvent, oCardManifestSettings.selectedKey);
            }
        },
        resetView: function() {
            var oCardManifestSettings = this._oCardManifestSettings,
                oCardPropertiesModel = this.getView().getModel(),
                iSelectedKey = parseInt(oCardManifestSettings.selectedKey,10),
                oSelectedView = oCardManifestSettings.aViews[iSelectedKey],
                iDefaultViewSelected = oCardManifestSettings.defaultViewSelected;
            if (!oSelectedView.isLaterAddedView) {
                var kpiStateOfCurrentCard = oCardManifestSettings.dataPointAnnotationPath ? true : false,
                    kpiStateOfOriginalCard = this._oOriginalCardManifestSettings.dataPointAnnotationPath ? true : false;
                if (iSelectedKey) {
                    var initialSelectedKey = oCardManifestSettings.aViews[iSelectedKey].initialSelectedKey;
                    SettingsConstants.tabFields.forEach(function(field) {
                        if (field !== "dataPointAnnotationPath" || kpiStateOfCurrentCard) {
                            /* None of the field is of type object hence direct copy is fine.*/
                            if (this._oOriginalCardManifestSettings.tabs && this._oOriginalCardManifestSettings.tabs.length) {
                                var value = this._oOriginalCardManifestSettings.tabs[initialSelectedKey - 1][field];
                                if (field !== 'entitySet' || (field === 'entitySet' && value)) {
                                    oCardManifestSettings[field] = value;
                                    oCardManifestSettings.tabs[iSelectedKey - 1][field] = oCardManifestSettings[field];
                                }
                            } else {
                                if (field !== 'entitySet') {
                                    oCardManifestSettings[field] = this._oOriginalCardManifestSettings[field];
                                    oCardManifestSettings.tabs[iSelectedKey - 1][field] = oCardManifestSettings[field];
                                }
                            }
                        }
                    }.bind(this));
                    if (!this._oOriginalCardManifestSettings.tabs || !this._oOriginalCardManifestSettings.tabs.length) {
                        oCardManifestSettings.newViewCounter++;
                        oCardManifestSettings.tabs[iSelectedKey - 1].value = this.oOvpResourceBundle && (this.oOvpResourceBundle.getText("OVP_KEYUSER_LABEL_VIEW_NAME") + " " + oCardManifestSettings.newViewCounter);
                    }
                    if (iSelectedKey === oCardManifestSettings.defaultViewSelected) {
                        oCardManifestSettings.aViews[iSelectedKey].text = oCardManifestSettings.tabs[iSelectedKey - 1].value + " (" + this.oOvpResourceBundle.getText("OVP_KEYUSER_LABEL_DEFAULT_VIEW") + ")";
                    } else {
                        oCardManifestSettings.aViews[iSelectedKey].text = oCardManifestSettings.tabs[iSelectedKey - 1].value;
                    }

                } else {
                    SettingsConstants.mainFields.forEach(function(field) {
                        /* None of the field is of type object hence direct copy is fine.*/
                        oCardManifestSettings[field] = this._oOriginalCardManifestSettings[field];
                    }.bind(this));
                    if (kpiStateOfCurrentCard !== kpiStateOfOriginalCard) {
                        if (kpiStateOfOriginalCard) {
                            oCardManifestSettings.tabs.forEach(function (tab) {
                               if (tab.prevDataPointAnnotationPath) {
                                   tab.dataPointAnnotationPath  = tab.prevDataPointAnnotationPath;
                               } else {
                                   tab.dataPointAnnotationPath = oCardManifestSettings.dataPoint[0].value;
                               }
                            });
                            oCardManifestSettings.dataPointAnnotationPath = oCardManifestSettings.tabs[iDefaultViewSelected].dataPointAnnotationPath;
                        } else {
                            oCardManifestSettings.tabs.forEach(function (tab) {
                                tab.prevDataPointAnnotationPath = tab.dataPointAnnotationPath;
                                tab.dataPointAnnotationPath = undefined;
                            });
                        }
                    }
                }
            } else {
                var dataPointAnnotationPath;
                if (oCardManifestSettings.dataPointAnnotationPath) {
                    dataPointAnnotationPath = oCardManifestSettings.dataPoint[0].value;
                }
                oCardManifestSettings.newViewCounter++;
                if (oCardManifestSettings.template === "sap.ovp.cards.charts.analytical" || oCardManifestSettings.template === "sap.ovp.cards.charts.smart.chart") {
                    oCardManifestSettings.tabs[iSelectedKey - 1] = {
                        chartAnnotationPath: oCardManifestSettings.chart[0].value,
                        dataPointAnnotationPath: dataPointAnnotationPath,
                        value: this.oOvpResourceBundle && (this.oOvpResourceBundle.getText("OVP_KEYUSER_LABEL_VIEW_NAME") + " " + oCardManifestSettings.newViewCounter)
                    };
                } else {
                    oCardManifestSettings.tabs[iSelectedKey - 1] = {
                        annotationPath: oCardManifestSettings.lineItem[0].value,
                        dataPointAnnotationPath: dataPointAnnotationPath,
                        value: this.oOvpResourceBundle && (this.oOvpResourceBundle.getText("OVP_KEYUSER_LABEL_VIEW_NAME") + " " + oCardManifestSettings.newViewCounter)
                    };
                }
                if (iSelectedKey === oCardManifestSettings.defaultViewSelected) {
                    oCardManifestSettings.aViews[iSelectedKey].text = this.oOvpResourceBundle && (this.oOvpResourceBundle.getText("OVP_KEYUSER_LABEL_VIEW_NAME") + " " + oCardManifestSettings.newViewCounter + " (" + this.oOvpResourceBundle.getText("OVP_KEYUSER_LABEL_DEFAULT_VIEW") + ")");
                } else {
                    oCardManifestSettings.aViews[iSelectedKey].text = this.oOvpResourceBundle && (this.oOvpResourceBundle.getText("OVP_KEYUSER_LABEL_VIEW_NAME") + " " + oCardManifestSettings.newViewCounter);
                }
                SettingsConstants.tabFields.forEach(function(field) {
                    /* None of the field is of type object hence direct copy is fine.*/
                    var value = oCardManifestSettings.tabs[iSelectedKey - 1][field];
                    if (field !== 'entitySet' || (field === 'entitySet' && value)) {
                        oCardManifestSettings[field] = value;
                    }
                });
            }

            // Handling errors for Link title and Static Link
            this.handleErrorHandling(oCardPropertiesModel, "value", "/tabs");

            oCardManifestSettings.isViewResetEnabled = false;
            oCardManifestSettings.aViews[iSelectedKey].isViewResetEnabled = false;
            settingsUtils.addManifestSettings(oCardManifestSettings);
            settingsUtils.setVisibilityForFormElements(oCardManifestSettings);
            this.getView().getModel("visibility").refresh();
            this.getView().getModel().refresh();
            if (!oCardManifestSettings.addNewCard) {
                this._fCardWithRefresh();
            }
        },
        selectViewSwitch : function(oEvent, selectedKey) {
            var oCardManifestSettings = this._oCardManifestSettings,
                oCardPropertiesModel = this.getView().getModel();
            if (!selectedKey) {
                selectedKey = oEvent.getSource().getSelectedIndex();
            }
            if (this.defaultViewSwitch) {
                this.defaultViewSwitch.setEnabled(true);
            }
            this.setEnablePropertyForResetAndSaveButton(true);

            var oMetaModel = oCardManifestSettings.metaModel,
                oEntitySet,
                iDefaultViewSelected = oCardManifestSettings.defaultViewSelected;

            //If selectedkey is zero then showMain view else subView
            if (!selectedKey) {
                /*By Default value get set to string zero . Setting it to interger zero*/
                /*Show main veiw with properties of the default view selected*/
                oCardManifestSettings.selectedKey = selectedKey;
                oCardManifestSettings.mainViewSelected = true;
                oCardManifestSettings.isViewResetEnabled = oCardManifestSettings.aViews[selectedKey].isViewResetEnabled;
                SettingsConstants.tabFields.forEach(function (field) {
                    var value = oCardManifestSettings.tabs[iDefaultViewSelected - 1][field];
                    if (field !== 'entitySet' || (field === 'entitySet' && value)) {
                        oCardManifestSettings[field] = value;
                    }
                });

                // Handling errors for Link title and Static Link
                this.handleErrorHandling(oCardPropertiesModel, "value", "/tabs");

                if (oCardManifestSettings.tabs[iDefaultViewSelected - 1].entitySet) {
                    oEntitySet = oMetaModel.getODataEntitySet(oCardManifestSettings.tabs[iDefaultViewSelected - 1].entitySet);
                    oCardManifestSettings.entityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
                    this.resetSupportingObjectsOnEntitySetChange(oCardManifestSettings, iDefaultViewSelected);
                }
                settingsUtils.addManifestSettings(oCardManifestSettings);
                settingsUtils.setVisibilityForFormElements(oCardManifestSettings);
                this.getView().getModel("visibility").refresh();
                this.getView().getModel().refresh();
                if (!oCardManifestSettings.addNewCard) {
                    this._fCardWithRefresh();
                }
            } else {
                oCardManifestSettings.mainViewSelected = false;
                oCardManifestSettings.isViewResetEnabled = oCardManifestSettings.aViews[selectedKey].isViewResetEnabled;
                if (!oCardManifestSettings.addNewCard) {
                    var dialogCard = this.getView().byId("dialogCard");
                    if (dialogCard.getVisible()) {
                        var oRootControl = dialogCard.getComponentInstance().getRootControl();
                        var oController = oRootControl.getController();
                        /*this will set the selectedkey for the manifest settings*/
                        oController.changeSelection(selectedKey, true, oCardManifestSettings);

                        // Handling errors for Link title and Static Link
                        this.handleErrorHandling(oCardPropertiesModel, "value", "/tabs");

                        if (oCardManifestSettings.tabs[selectedKey - 1].entitySet) {
                            oEntitySet = oMetaModel.getODataEntitySet(oCardManifestSettings.tabs[selectedKey - 1].entitySet);
                            oCardManifestSettings.entityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
                            this.resetSupportingObjectsOnEntitySetChange(oCardManifestSettings, iDefaultViewSelected);
                        }
                        settingsUtils.addManifestSettings(oCardManifestSettings);
                        settingsUtils.setVisibilityForFormElements(oCardManifestSettings);
                        SettingsConstants.tabFields.forEach(function (field) {
                            var value = oCardManifestSettings.tabs[selectedKey - 1][field];
                            if (field !== 'entitySet' || (field === 'entitySet' && value)) {
                                oCardManifestSettings[field] = value;
                            }
                        });
                        if (!!oCardManifestSettings.kpiAnnotationPath) {
                            this.setAnnotationPathInModel(oCardManifestSettings, "sapOvpSettingsKPIAnnotation", oCardManifestSettings.kpiAnnotationPath);
                        }
                        if (!!oCardManifestSettings.selectionPresentationAnnotationPath) {
                            this.setAnnotationPathInModel(oCardManifestSettings, "sapOvpSettingsFilterAndPresentedBy", oCardManifestSettings.selectionPresentationAnnotationPath);
                        }
                        this.getView().getModel("visibility").refresh();
                        this.getView().getModel().refresh();
                    }
            } else {
                if (!!oCardManifestSettings.tabs[selectedKey - 1].entitySet) {
                    oEntitySet = oMetaModel.getODataEntitySet(oCardManifestSettings.tabs[selectedKey - 1].entitySet);
                    oCardManifestSettings.entityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
                    settingsUtils.addManifestSettings(oCardManifestSettings);
                }

                this.aVariantNames.forEach(function (oVariantName) {
                    if (this._oCardManifestSettings[oVariantName.sPath]) {
                        this._oCardManifestSettings[oVariantName.sPath] = [];
                    }
                }.bind(this));
                this.resetSupportingObjectsOnEntitySetChange(oCardManifestSettings, iDefaultViewSelected);
                oCardManifestSettings.selectedKey = selectedKey;
                SettingsConstants.tabFields.forEach(function (field) {
                var value = oCardManifestSettings.tabs[selectedKey - 1][field];
                    oCardManifestSettings[field] = value;
                });
                settingsUtils.setVisibilityForFormElements(oCardManifestSettings);
                this.getView().byId("sapOVPEntitySetList").setValue(oCardManifestSettings.tabs[selectedKey - 1].entitySet);
                this.getView().getModel().refresh();
                this.getView().getModel("visibility").refresh();

                }
            }
        },

        resetSupportingObjectsOnEntitySetChange : function (oCardManifestSettings, iDefaultViewSelected) {
            oCardManifestSettings = settingsUtils.addSupportingObjects(oCardManifestSettings);
            var defaultSelectedKey = oCardManifestSettings.defaultViewSelected;
            if (defaultSelectedKey) {
                oCardManifestSettings.aViews[defaultSelectedKey].text = oCardManifestSettings.tabs[defaultSelectedKey - 1].value;
            }
            oCardManifestSettings.aViews[iDefaultViewSelected].text += " (" + this.oOvpResourceBundle.getText("OVP_KEYUSER_LABEL_DEFAULT_VIEW") + ")";
            oCardManifestSettings.defaultViewSelected = iDefaultViewSelected;
        },

        setAnnotationPathInModel : function (oCardManifestSettings, sId, SelectedKey) {
            if (oCardManifestSettings.entityType[SelectedKey]) {
                this.setVariant(oCardManifestSettings, SelectedKey);
            }
            if (sId === "sapOvpSettingsKPIAnnotation") {
                settingsUtils.addKPINavApplicationName(oCardManifestSettings);
            }
        },

        setCurrentActivePageForCarouselCard : function (iIndex) {
            var dialogCard = this.getView().byId("dialogCard");
            if (dialogCard.getVisible()) {
                var oComponent = dialogCard.getComponentInstance(),
                    oRootControl = oComponent.getRootControl(),
                    oCarousel = oRootControl.byId("pictureCarousel");
                if (oCarousel) {
                    var aPages = oCarousel.getPages(),
                        newActivePage = aPages[iIndex];
                    oCarousel.setActivePage(newActivePage);
                }
            }
        },

        onSelectionChange : function (oEvent) {
            var oSource = oEvent.getSource(),
                oModel = oSource.getModel(),
                aStaticContent = oModel.getData().staticContent,
                oSelectedItem = oSource.getSelectedItem(),
                oSelectedItemData = oSelectedItem.getBindingContext().getObject(),
                oVisibilityModel = oSource.getModel("visibility");
            for (var i = 0; i < aStaticContent.length; i++) {
                if (aStaticContent[i].id === oSelectedItemData.id) {
                    oVisibilityModel.setProperty("/moveToTheTop", !(aStaticContent.length === 1 || i === 0));
                    oVisibilityModel.setProperty("/moveUp", !(aStaticContent.length === 1 || i === 0));
                    oVisibilityModel.setProperty("/moveDown", !(aStaticContent.length === 1 || i === (aStaticContent.length - 1)));
                    oVisibilityModel.setProperty("/moveToTheBottom", !(aStaticContent.length === 1 || i === (aStaticContent.length - 1)));
                    oVisibilityModel.setProperty("/delete", true);
                    oModel.setProperty("/selectedItemIndex", i);
                    oVisibilityModel.refresh(true);

                    // Setting the Active Page in Case of Carousel Card
                    if (oEvent.getParameter("listItem")) {
                        this.setCurrentActivePageForCarouselCard(i);
                    }

                    break;
                }
            }
        },

        handleErrorForProperty : function (oCardPropertiesModel, sPath, sContextPath) {
            oCardPropertiesModel.firePropertyChange({
                context: oCardPropertiesModel.getContext(sContextPath ? sContextPath : "/"),
                path: sPath,
                value: oCardPropertiesModel.getProperty(sContextPath ? (sContextPath + "/" + sPath) : sPath),
                reason: ChangeReason.Change
            });
        },

        handleErrorHandling : function (oCardPropertiesModel, sPath, sContextPath) {
            var aProperty = oCardPropertiesModel.getProperty(sContextPath);

            // Clean up all the error"s for sPath before adding new one"s for the same sContextPath
            oCardPropertiesModel.firePropertyChange({
                context: oCardPropertiesModel.getContext(sContextPath),
                path: sContextPath + "," + sPath,
                value: oCardPropertiesModel.getProperty(sContextPath),
                reason: ChangeReason.Change
            });

            for (var i = 0; i < aProperty.length; i++) {
                var sCurrentContextPath = sContextPath + "/" + i;
                oCardPropertiesModel.firePropertyChange({
                    context: oCardPropertiesModel.getContext(sCurrentContextPath),
                    path: sPath,
                    value: oCardPropertiesModel.getProperty(sCurrentContextPath + "/" + sPath),
                    reason: ChangeReason.Change
                });
            }
        },

        setEnablePropertyForResetAndSaveButton : function (bEnabled) {
            settingsUtils.enableResetButton(bEnabled);
            settingsUtils.enableSaveButton(bEnabled);
        },

        getValueInRemString : function (iValue) {
            return iValue + "rem";
        },

        _getSelectedItemIndex : function (oModel) {
            return oModel.getProperty("/selectedItemIndex");
        },

        _getLastItemIndex : function (oModel) {
            return this._getStaticContentArray(oModel).length - 1;
        },

        _getStaticContentArray : function (oModel) {
            return oModel.getProperty("/staticContent");
        },

        _setStaticContentArray : function (oModel, aStaticContent) {
            oModel.setProperty("/staticContent", aStaticContent);
        },

        _setSelectedItemAndScrollToElement : function (iIndex, bHaveDelegate) {
            var oView = this.getView(),
                oList = oView.byId("sapOvpStaticLinkListLineItem"),
                oScrollContainer = oView.byId("scrollContainer"),
                oCardPropertiesModel = oView.getModel();

            // Handling errors for Link title and Static Link
            this.handleErrorHandling(oCardPropertiesModel, "title", "/staticContent");
            this.handleErrorHandling(oCardPropertiesModel, "targetUri", "/staticContent");

            var oItem = oList.getItems()[iIndex];
            if (bHaveDelegate) {
                this._oList = oList;
                this._oItem = oItem;
                this._oScrollContainer = oScrollContainer;
                var oDelegateOnAfter = {
                    onAfterRendering: function (oEvent) {
                        this._oList.removeEventDelegate(this._oDelegateOnAfter);
                        this._oScrollContainer.scrollToElement(this._oItem);
                        delete this._oDelegateOnAfter;
                        delete this._oList;
                        delete this._oScrollContainer;
                        delete this._oItem;
                    }
                };
                this._oDelegateOnAfter = oDelegateOnAfter;
                oList.addEventDelegate(oDelegateOnAfter, this);
            } else {
                oScrollContainer.scrollToElement(oItem);
            }
            oList.setSelectedItem(oItem);
            oList.fireSelectionChange();
        },

        _arrangeStaticContent : function (oModel, iFrom, iTo) {
            var aStaticContent = this._getStaticContentArray(oModel);
            // Change Position
            aStaticContent.splice(iTo, 0, aStaticContent.splice(iFrom, 1)[0]);
            this._setStaticContentArray(oModel, aStaticContent);
            this._setSelectedItemAndScrollToElement(iTo);
        },

        getIndexFromIdForStaticLinkList : function (sId) {
            var aSplitIds = sId.split("-");
            return aSplitIds[aSplitIds.length - 1];
        },

        _getImageData : function () {
            var aImageItemList = [];

            aImageItemList.push({
                "Name": "AW.png",
                "Image": LinkAnnotationHelper.formUrl(this.getView().getModel().getProperty("/baseUrl"), "img/AW.png")
            });

            return aImageItemList;
        },

        _getIconData : function (sIconUri) {
            var aIcons = IconPool.getIconNames(),
                aItemList = [];

            if (sIconUri) {
                var sName = sIconUri.split("://")[1],
                    iIndex = aIcons.indexOf(sName);
                aIcons.splice(iIndex, 1);
                aItemList.push({
                    "Name": sName,
                    "Icon": IconPool.getIconURI(sName)
                });
            }

            for (var i = 0; i < aIcons.length; i++) {
                aItemList.push({
                    "Name": aIcons[i],
                    "Icon": IconPool.getIconURI(aIcons[i])
                });
            }
            return aItemList;
        },

        _getLinkListItemId : function (oModel, iIndex) {
            return oModel.getProperty("/staticContent/" + iIndex + "/index");
        },

        _makeLinkListItemId : function (iIndex) {
            return "linkListItem--" + iIndex;
        },

        _makeLinkListItemIndex : function (iIndex) {
            return "Index--" + iIndex;
        },

        getIconAndImageDataModel : function (sIconUri) {
            /*Setting model to the table row*/
            var aIcons = this._getIconData(sIconUri),
                aImages = this._getImageData();

            return new JSONModel({
                "Icons": aIcons,
                "Images": aImages,
                "NoOfIcons": aIcons.length,
                "NoOfImages": aImages.length
            });
        },

        destroyTemplatesAndObjects : function () {
            var oView = this.getView();
            var oTableFilterImage = oView.byId("tableFilterImage");
            if (oTableFilterImage) {
                oTableFilterImage.destroy();
            }
            var oTableFilter = oView.byId("tableFilter");
            if (oTableFilter) {
                oTableFilter.destroy();
            }
            var oTableFilterLinks = oView.byId("tableFilterLinks");
            if (oTableFilterLinks) {
                oTableFilterLinks.destroy();
            }
            delete this._oEvent;
            delete this._iCurrentRow;
            delete this._oModel;
            delete this._oVisibilityModel;
            delete this._oIconsDialogContentView;
            delete this._oLinksDialogContentView;
            delete this._oLineItemDialogContentView;
            delete this._oKPIItemDialogContentView;
        },

        onExternalUrlChange : function (oEvent) {
            this.setEnablePropertyForResetAndSaveButton(true);
        },

        onLinkSourceChange : function (oEvent) {
            var oSource = oEvent.getSource(),
                oModel = oSource.getModel(),
                oVisibilityModel = oSource.getModel("visibility"),
                iIndex = this.getIndexFromIdForStaticLinkList(oSource.getId()),
                iSelectedIndex = oEvent.getParameter("selectedIndex"),
                oStaticLink = oVisibilityModel.getProperty("/staticLink"),
                oLinks = oVisibilityModel.getProperty("/links"),
                sId = this._getLinkListItemId(oModel, parseInt(iIndex, 10));

            if (iSelectedIndex === 0) {
                oStaticLink[sId] = false;
                oLinks[sId] = true;
                oModel.setProperty("/staticContent/" + iIndex + "/targetUri", undefined);
            } else {
                oStaticLink[sId] = true;
                oLinks[sId] = false;
                oModel.setProperty("/staticContent/" + iIndex + "/semanticObject", undefined);
                oModel.setProperty("/staticContent/" + iIndex + "/action", undefined);
                oModel.setProperty("/staticContent/" + iIndex + "/targetUri", "");
            }
            oVisibilityModel.setProperty("/staticLink", oStaticLink);
            oVisibilityModel.setProperty("/links", oLinks);
            oVisibilityModel.refresh(true);
            oModel.refresh(true);
            this.handleErrorForProperty(oModel, "targetUri", "/staticContent/" + iIndex);
            this.setEnablePropertyForResetAndSaveButton(true);
        },

        onRemoveVisualPress : function (oEvent) {
            var oSource = oEvent.getSource(),
                oModel = oSource.getModel(),
                oVisibilityModel = oSource.getModel("visibility"),
                iIndex = this.getIndexFromIdForStaticLinkList(oSource.getId()),
                sId = this._getLinkListItemId(oModel, parseInt(iIndex, 10)),
                oRemoveVisual = oVisibilityModel.getProperty("/removeVisual");

            oRemoveVisual[sId] = false;
            oVisibilityModel.setProperty("/removeVisual", oRemoveVisual);
            oVisibilityModel.refresh(true);
            oModel.setProperty("/staticContent/" + iIndex + "/imageUri", undefined);
            oModel.refresh(true);
            this.updateCard(oEvent, "sapOvpSettingsStaticLinkListRemoveVisual");
        },

        createValueHelpDialogForInternalUrl : function (oEvent) {
            var oSource = oEvent.getSource(),
                oModel = oSource.getModel(),
                oExtraStaticCardPropertiesModel = oSource.getModel("staticCardProperties"),
                oVisibilityModel = oSource.getModel("visibility"),
                iIndex = this.getIndexFromIdForStaticLinkList(oSource.getId());

            this.attachBrowserHeightChangeHandler();

            this._oEvent = jQuery.extend({}, oEvent);
            this._iCurrentRow = iIndex;
            this._oModel = oModel;
            this._oVisibilityModel = oVisibilityModel;

            // links dialog close button
            var oCancelButton = new Button("linksCancelBtn", {
                text: this.oOvpResourceBundle && this.oOvpResourceBundle.getText("cancelBtn")
            });

            // links dialog
            this.linksDialog = new Dialog({
                title: this.oOvpResourceBundle && this.oOvpResourceBundle.getText("OVP_KEYUSER_SELECT_APPLICATION_DIALOG"),
                buttons: [oCancelButton]
            }).addStyleClass("sapOvpSettingsDialogBox");

            oExtraStaticCardPropertiesModel.setProperty("/densityStyle", this.getDensityStyle());

            oExtraStaticCardPropertiesModel.setProperty("/NoOfLinks", oExtraStaticCardPropertiesModel.getProperty("/links").length);

            // Links Dialog
            var oLinksDialogContent = new sap.ui.view("linksDialogContent", {
                viewName: "sap.ovp.cards.rta.SelectLinks",
                type: ViewType.XML,
                preprocessors: {
                    xml: {
                        bindingContexts: {
                            tableRows: oExtraStaticCardPropertiesModel.createBindingContext("/")
                        },
                        models: {
                            tableRows: oExtraStaticCardPropertiesModel
                        }
                    }
                }
            });

            oLinksDialogContent.setModel(oExtraStaticCardPropertiesModel);
            oLinksDialogContent.setModel(this.getView().getModel("ovpResourceModel"), "ovpResourceModel");

            this.linksDialog.addContent(oLinksDialogContent);

            oLinksDialogContent.loaded().then(function (oView) {
                this._oLinksDialogContentView = oView;
                /**
                 *  Don't remove the below implementation because
                 *  This function acts as a bridge between SettingsDialog and SelectLinks Controller
                 *
                 *  Adding new function "updateLinkPath" to SelectLinks controller with 'this' context
                 *  of SettingsDialog controller.
                 */
                oView.getController().updateLinkPath = function (sIntent) {
                    var aIntentParts = sIntent.slice(1).split("-"),
                        sSemanticObject = aIntentParts[0],
                        sAction = aIntentParts[1];

                    this._oModel.setProperty("/staticContent/" + this._iCurrentRow + "/semanticObject", sSemanticObject);
                    this._oModel.setProperty("/staticContent/" + this._iCurrentRow + "/action", sAction);
                    this._oModel.refresh(true);
                    this.setEnablePropertyForResetAndSaveButton(true);

                    this.cleanAndCloseDialog(oCancelButton);
                }.bind(this);

                oCancelButton.attachPress(function () {
                    this.cleanAndCloseDialog(oCancelButton);
                }.bind(this));

                this.linksDialog.open();

                /**
                 *  Set Links Dialog Height for the first time
                 *  This is inside setTimeout because height is not correctly calculated.
                 */
                setTimeout(function () {
                    this.browserHeightChange();
                }.bind(this), 0);
            }.bind(this));
        },

        onChangeVisualPress : function (oEvent) {
            var oSource = oEvent.getSource(),
                oModel = oSource.getModel(),
                oVisibilityModel = oSource.getModel("visibility"),
                iIndex = this.getIndexFromIdForStaticLinkList(oSource.getId()),
                sIconUri = oModel.getProperty("/staticContent/" + iIndex + "/imageUri"),
                bNotIcon = LinkAnnotationHelper.isImageUrlStaticData(sIconUri);

            this.attachBrowserHeightChangeHandler();

            this._oEvent = jQuery.extend({}, oEvent);
            this._iCurrentRow = iIndex;
            this._oModel = oModel;
            this._oVisibilityModel = oVisibilityModel;

            // icons dialog close button
            var oCancelButton = new Button("iconsCancelBtn", {
                text: this.oOvpResourceBundle && this.oOvpResourceBundle.getText("cancelBtn")
            });

            // icons dialog
            this.iconsDialog = new Dialog({
                title: this.oOvpResourceBundle && this.oOvpResourceBundle.getText("OVP_KEYUSER_SELECT_VISUAL_DIALOG"),
                buttons: [oCancelButton]
            }).addStyleClass("sapOvpSettingsDialogBox");

            /*Data to Show in Table*/
            /*Setting model to the table row*/
            var oRowsModel = (bNotIcon) ? this.getIconAndImageDataModel() : this.getIconAndImageDataModel(sIconUri);

            oRowsModel.setProperty("/densityStyle", this.getDensityStyle());

            // Icons Dialog
            var oIconsDialogContent = new sap.ui.view("iconsDialogContent", {
                viewName: "sap.ovp.cards.rta.SelectIcons",
                type: ViewType.XML,
                preprocessors: {
                    xml: {
                        bindingContexts: {
                            tableRows: oRowsModel.createBindingContext("/")
                        },
                        models: {
                            tableRows: oRowsModel
                        }
                    }
                }
            });

            // Initially setting Table Name to "IconTable"
            oRowsModel.setProperty("/tableName", "IconTable");

            oIconsDialogContent.setModel(oRowsModel);
            oIconsDialogContent.setModel(this.getView().getModel("ovpResourceModel"), "ovpResourceModel");

            this.iconsDialog.addContent(oIconsDialogContent);

            oIconsDialogContent.loaded().then(function (oView) {
                this._oIconsDialogContentView = oView;
                /**
                 *  Don't remove the below implementation because
                 *  This function acts as a bridge between SettingsDialog and SelectIcons Controller
                 *
                 *  Adding new function "updateIconPath" to SelectIcons controller with 'this' context
                 *  of SettingsDialog controller.
                 */
                oView.getController().updateIconPath = function (sUri) {
                    var sId = this._getLinkListItemId(this._oModel, parseInt(this._iCurrentRow, 10)),
                        oRemoveVisual = this._oVisibilityModel.getProperty("/removeVisual");

                    oRemoveVisual[sId] = true;
                    this._oVisibilityModel.setProperty("/removeVisual", oRemoveVisual);
                    this._oVisibilityModel.refresh(true);

                    this._oModel.setProperty("/staticContent/" + this._iCurrentRow + "/imageUri", sUri);
                    this._oModel.refresh(true);
                    this.updateCard(this._oEvent, "sapOvpSettingsStaticLinkListChangeVisual");

                    this.cleanAndCloseDialog(oCancelButton);
                }.bind(this);

                oCancelButton.attachPress(function () {
                    this.cleanAndCloseDialog(oCancelButton);
                }.bind(this));

                this.iconsDialog.open();

                /**
                 *  Set Icons Dialog Height for the first time
                 *  This is inside setTimeout because height is not correctly calculated.
                 */
                setTimeout(function () {
                    this.browserHeightChange();
                }.bind(this), 0);
            }.bind(this));

        },

        getDensityStyle : function () {
            if (!Device.support.touch) {
                return "compact";
            } else {
                return "cozy";
            }
        },

        cleanAndCloseDialog : function (oCancelButton) {
            if (this._oIconsDialogContentView) {
                this._oIconsDialogContentView.destroy();
            }
            if (this._oLinksDialogContentView) {
                this._oLinksDialogContentView.destroy();
            }
            if (this._oLineItemDialogContentView) {
                this._oLineItemDialogContentView.destroy();
            }
            if (this._oKPIItemDialogContentView) {
                this._oKPIItemDialogContentView.destroy();
            }
            this.destroyTemplatesAndObjects();
            if (this.iconsDialog) {
                this.iconsDialog.close();
            }
            if (this.linksDialog) {
                this.linksDialog.close();
            }
            if (this.lineItemDialog) {
                this.lineItemDialog.close();
            }
            if (this.KPIItemDialog) {
                this.KPIItemDialog.close();
            }
            oCancelButton.destroy();
            this.detachBrowserHeightChangeHandler();
        },

        attachBrowserHeightChangeHandler : function () {
            Device.resize.attachHandler(this.browserHeightChange, this);
        },

        detachBrowserHeightChangeHandler : function () {
            Device.resize.detachHandler(this.browserHeightChange, this);
        },

        browserHeightChange : function (iBrowser) {
            var oDialog, oDialogContent, sScrollContainerName;
            if (this.iconsDialog && this._oIconsDialogContentView) {
                oDialog = this.iconsDialog;
                oDialogContent = this._oIconsDialogContentView;
                sScrollContainerName = "iconsScrollContainer";
            } else if (this.linksDialog && this._oLinksDialogContentView) {
                oDialog = this.linksDialog;
                oDialogContent = this._oLinksDialogContentView;
                sScrollContainerName = "linksScrollContainer";
            } else if (this.lineItemDialog && this._oLineItemDialogContentView) {
                oDialog = this.lineItemDialog;
                oDialogContent = this._oLineItemDialogContentView;
                sScrollContainerName = "lineItemScrollContainer";
            } else if (this.KPIItemDialog && this._oKPIItemDialogContentView) {
                oDialog = this.KPIItemDialog;
                oDialogContent = this._oKPIItemDialogContentView;
                sScrollContainerName = "KPIItemScrollContainer";
            }

            if (oDialog && oDialogContent && sScrollContainerName) {
                var oDomRef = oDialog.getDomRef(),
                    /**
                     *  Expected Height is coming from the following class
                     *  .sapMDialog:not(.sapMDialog-NoHeader):not(.sapMDialog-NoFooter):not(.sapMDialogWithSubHeader)
                     *  where max-height: calc(100% - 6rem - 7%) ---> roughly translates to 93% of iBrowserHeight
                     *  6rem is ignored because it represents the height of header and footer of the dialog combined
                     */
                    iDialogExpectedHeight = (iBrowser ? (iBrowser.height * 93) / 100 : settingsUtils.dialogBox.getDomRef()
                            .getBoundingClientRect().height),
                    iDialogActualHeight = oDomRef.getBoundingClientRect().height,
                    iHeight = Math.max(iDialogExpectedHeight, iDialogActualHeight) - (CommonUtils.getPixelPerRem() * 9),
                    oScrollContainer = oDialogContent.byId(sScrollContainerName);

                oScrollContainer.setHeight(iHeight + "px");
            }
        },

        handleMessagePopoverPress : function (oEvent) {
            settingsUtils.oMessagePopOver.openBy(oEvent.getSource());
        },

        onShowMorePress : function (oEvent) {
            var oSource = oEvent.getSource(),
                oModel = oSource.getModel(),
                oVisibilityModel = oSource.getModel("visibility"),
                iIndex = this.getIndexFromIdForStaticLinkList(oSource.getId()),
                sId = this._getLinkListItemId(oModel, parseInt(iIndex, 10)),
                bShowMore = oVisibilityModel.getProperty("/showMore/" + sId);

            if (bShowMore) {
                oVisibilityModel.setProperty("/showMore/" + sId, false);
            } else {
                oVisibilityModel.setProperty("/showMore/" + sId, true);
            }
            oVisibilityModel.refresh(true);
        },

        onPressDelete : function (oEvent) {
            this._oEvent = jQuery.extend({}, oEvent);
            MessageBox.confirm(
                this.oOvpResourceBundle.getText("OVP_KEYUSER_MESSAGE_BOX_INFORMATION_MESSAGE_INFO"),
                {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    icon: MessageBox.Icon.INFORMATION,
                    title: this.oOvpResourceBundle.getText("OVP_KEYUSER_MESSAGE_BOX_TITLE_INFO"),
                    initialFocus: MessageBox.Action.CANCEL,
                    onClose: function(sAction) {
                        if (sAction === "OK") {
                            var oSource = this._oEvent.getSource(),
                                oVisibilityModel = oSource.getModel("visibility"),
                                oModel = oSource.getModel(),
                                aStaticContent = this._getStaticContentArray(oModel),
                                iIndex = this._getSelectedItemIndex(oModel),
                                sId = this._getLinkListItemId(oModel, iIndex),
                                oStaticLink = oVisibilityModel.getProperty("/staticLink"),
                                oLinks = oVisibilityModel.getProperty("/links"),
                                oRemoveVisual = oVisibilityModel.getProperty("/removeVisual"),
                                oShowMore = oVisibilityModel.getProperty("/showMore");

                            delete oStaticLink[sId];
                            delete oLinks[sId];
                            delete oRemoveVisual[sId];
                            delete oShowMore[sId];
                            oVisibilityModel.setProperty("/staticLink", oStaticLink);
                            oVisibilityModel.setProperty("/links", oLinks);
                            oVisibilityModel.setProperty("/removeVisual", oRemoveVisual);
                            oVisibilityModel.setProperty("/showMore", oShowMore);
                            aStaticContent.splice(iIndex, 1);
                            this._setStaticContentArray(oModel, aStaticContent);
                            oModel.refresh(true);
                            if (aStaticContent.length > 0) {
                                this._setSelectedItemAndScrollToElement(Math.min(parseInt(iIndex, 10), aStaticContent.length - 1), true);
                            }
                            if (aStaticContent.length <= 1) {
                                oVisibilityModel.setProperty("/delete", false);
                            }
                            oVisibilityModel.refresh(true);
                            this.updateCard(this._oEvent, "sapOvpSettingsStaticLinkListDelete");
                        }
                        delete this._oEvent;
                    }.bind(this)
                }
            );
        },

        onPressAdd : function (oEvent) {
            var oSource = oEvent.getSource(),
                oVisibilityModel = oSource.getModel("visibility"),
                oModel = oSource.getModel(),
                aStaticContent = this._getStaticContentArray(oModel),
                iLineItemIdCounter = oModel.getProperty("/lineItemIdCounter"),
                sId = this._makeLinkListItemId(iLineItemIdCounter + 1),
                sIndex = this._makeLinkListItemIndex(iLineItemIdCounter + 1),
                oStaticLink = oVisibilityModel.getProperty("/staticLink"),
                oLinks = oVisibilityModel.getProperty("/links"),
                oRemoveVisual = oVisibilityModel.getProperty("/removeVisual"),
                oShowMore = oVisibilityModel.getProperty("/showMore");

            oModel.setProperty("/lineItemIdCounter", iLineItemIdCounter + 1);
            aStaticContent.unshift({
                "id": sId,
                "index": sIndex,
                "title": "Default Title",
                "subTitle": "Default SubTitle",
                "imageUri": "",
                "imageAltText": "",
                "targetUri": "",
                "openInNewWindow": ""
            });
            oStaticLink[sIndex] = true;
            oLinks[sIndex] = false;
            oRemoveVisual[sIndex] = false;
            oShowMore[sIndex] = false;
            oVisibilityModel.setProperty("/staticLink", oStaticLink);
            oVisibilityModel.setProperty("/links", oLinks);
            oVisibilityModel.setProperty("/removeVisual", oRemoveVisual);
            oVisibilityModel.setProperty("/showMore", oShowMore);
            oVisibilityModel.refresh(true);
            this._setStaticContentArray(oModel, aStaticContent);
            oModel.refresh(true);
            this._setSelectedItemAndScrollToElement(0);
            this.updateCard(oEvent, "sapOvpSettingsStaticLinkListAdd");
        },

        onPressMoveToTheTop : function (oEvent) {
            var oModel = oEvent.getSource().getModel();
            this._arrangeStaticContent(oModel, this._getSelectedItemIndex(oModel), 0);
            this.updateCard(oEvent, "sapOvpSettingsStaticLinkListSort");
        },

        onPressMoveUp : function (oEvent) {
            var oModel = oEvent.getSource().getModel(),
                iIndex = this._getSelectedItemIndex(oModel);
            this._arrangeStaticContent(oModel, iIndex, iIndex - 1);
            this.updateCard(oEvent, "sapOvpSettingsStaticLinkListSort");
        },

        onPressMoveDown : function (oEvent) {
            var oModel = oEvent.getSource().getModel(),
                iIndex = this._getSelectedItemIndex(oModel);
            this._arrangeStaticContent(oModel, iIndex, iIndex + 1);
            this.updateCard(oEvent, "sapOvpSettingsStaticLinkListSort");
        },

        onPressMoveToTheBottom : function (oEvent) {
            var oModel = oEvent.getSource().getModel(),
                iIndexFrom = this._getSelectedItemIndex(oModel),
                iIndexTo = this._getLastItemIndex(oModel);
            this._arrangeStaticContent(oModel, iIndexFrom, iIndexTo);
            this.updateCard(oEvent, "sapOvpSettingsStaticLinkListSort");
        },

        onResetButton : function () {
            this._oCardManifestSettings = jQuery.extend(true, {}, this._oOriginalCardManifestSettings);
            var oCardPropertiesModel = this.getView().getModel();
            oCardPropertiesModel.setProperty("/", this._oCardManifestSettings);
            settingsUtils.setVisibilityForFormElements(this._oCardManifestSettings);
            this.getView().getModel("visibility").refresh();
            if (this._oCardManifestSettings.layoutDetail === "resizable") {
                if (this._oCardManifestSettings.stopResizing) {
                    this.getView().byId("sapOvpSettingsStopResize").setState(false);
                } else if (!this._oCardManifestSettings.stopResizing) {
                    this.getView().byId("sapOvpSettingsStopResize").setState(true);
                }
            }

            // Resetting Error Handling
            settingsUtils.resetErrorHandling();

            this.setEnablePropertyForResetAndSaveButton(false);
            //Would not refresh preview in case of add new card
            if (!this._oCardManifestSettings.addNewCard) {
                this._fCardWithRefresh();
            }
        },

        handleValueStateofComboBox: function(sErrorText, sProperty, sId, isValueNotExist) {
            var oMessagesModel = settingsUtils.oMessagePopOver.getModel(),
            aMessages = oMessagesModel.getProperty("/Messages"),
            iCounterAll = oMessagesModel.getProperty("/Counter/All"),
            iCounterError = oMessagesModel.getProperty("/Counter/Error");
            this.bError = true;
            var bIsError = true;
            // Mandatory field values are not entered
            if (isValueNotExist) {
				for (var i = 0; i < aMessages.length; i++) {
				    if (aMessages[i].fieldName === sProperty) {
				        bIsError = false;
				    }
				}
				if (bIsError) {
				    aMessages.push({
		                "type": "Error",
		                "title": sErrorText,
		                "fieldName": sProperty,
		                "counter": iCounterError + 1
		            });
				    iCounterAll++;
				    iCounterError++;
				    this.getView().byId(sId).setValueState("Error");
				}
			} else {
				// After entering values removing the error message from aMessage array
				this.bError = false;
				for (var i = 0; i < aMessages.length; i++) {
				    if (aMessages[i].fieldName === sProperty) {
				        aMessages.splice(i, 1);
				        iCounterAll--;
				        iCounterError--;
				        i--;
				    }
				}
				this.getView().byId(sId).setValueState("None");
            }
            if (!aMessages.length) {
                this.setEnablePropertyForResetAndSaveButton(true);
            }
            oMessagesModel.setProperty("/Messages", aMessages);
            oMessagesModel.setProperty("/Counter/All", iCounterAll);
            oMessagesModel.setProperty("/Counter/Error", iCounterError);
            oMessagesModel.refresh(true);
        },

        /*validate ComboBox mandatory fields like title, subtitle, datapoint, valueselection info
         */
        validateComboBox: function(oCardManifestSettings, sPropertyType, bKPICheckboxFlag) {
            var sErrorText;
            // When event is triggered from KPI check box and its selected then we will check first if entity set is selected, then we have to validate
			// title, subtitle, value selection and data point
            if ((sPropertyType === "KPICheckBox" && bKPICheckboxFlag && oCardManifestSettings.entitySet) ||
                (sPropertyType === "entitySet" && oCardManifestSettings.addKPIHeaderCheckBox)) {
                //Validate title
                if (oCardManifestSettings.title === "") {
                    sErrorText = OvpResources.getText("OVP_KEYUSER_INPUT_ERROR");
                    this.handleValueStateofComboBox(sErrorText, OVPUtils.Annotations.title, "sapOvpCardTitle", true);
                } else {
                    this.handleValueStateofComboBox("", OVPUtils.Annotations.title, "sapOvpCardTitle", false);
                }
                    // Validate Subtitle
                if (oCardManifestSettings.subTitle === "") {
                    sErrorText = OvpResources.getText("OVP_KEYUSER_INPUT_ERROR_VALUE_STATE_SUBTITLE");
                    this.handleValueStateofComboBox(sErrorText, OVPUtils.Annotations.subTitle, "sapOvpCardSubTitle", true);
                } else {
                    this.handleValueStateofComboBox("", OVPUtils.Annotations.subTitle, "sapOvpCardSubTitle", false);
                }
                //Validate value selection info
                if (oCardManifestSettings.valueSelectionInfo === "") {
                    sErrorText = OvpResources.getText("OVP_KEYUSER_INPUT_ERROR_VALUE_STATE_SELECTIONVALUEINFO");
                    this.handleValueStateofComboBox(sErrorText, OVPUtils.Annotations.valueSelectionInfo, "sapOvpValueSelectionInfo", true);
                } else {
                    this.handleValueStateofComboBox("", OVPUtils.Annotations.valueSelectionInfo, "sapOvpValueSelectionInfo", false);
                }
                //Validate Data point
                if (oCardManifestSettings.dataPointAnnotationPath === "") {
                    sErrorText = OvpResources.getText("OVP_KEYUSER_INPUT_ERROR_VALUE_STATE_DATAPOINT");
                    this.handleValueStateofComboBox(sErrorText, OVPUtils.Annotations.dataPoint, "sapOvpDataPoint", true);
                } else {
                    this.handleValueStateofComboBox("", OVPUtils.Annotations.dataPoint, "sapOvpDataPoint", false);
                }
            } else if (sPropertyType === "entitySet") {
                // when we select entitySet then value state of title would be error bydefault
                sErrorText = OvpResources.getText("OVP_KEYUSER_INPUT_ERROR");
                this.handleValueStateofComboBox(sErrorText, OVPUtils.Annotations.title, "sapOvpCardTitle", true);
                if (oCardManifestSettings.template === "sap.ovp.cards.linklist"){
                    sErrorText = OvpResources.getText("OVP_KEYUSER_LISTFLAVOR_ERROR");
                    this.handleValueStateofComboBox(sErrorText, OVPUtils.Annotations.listFlavor, "sapOVPLinkListFlavor", true);
                }
			} else if (sPropertyType === "KPICheckBox" && !bKPICheckboxFlag && oCardManifestSettings.entitySet) {
                // When event is triggered from KPI check box and its not selected then we will check first if entity set is selected, then we have to remove
                //validation for subtitle, value selection and data point
                this.handleValueStateofComboBox("", OVPUtils.Annotations.subTitle, "sapOvpCardSubTitle", false);
                this.handleValueStateofComboBox("", OVPUtils.Annotations.valueSelectionInfo, "sapOvpValueSelectionInfo", false);
                this.handleValueStateofComboBox("", OVPUtils.Annotations.dataPoint, "sapOvpDataPoint", false);
            } else {
                if (sPropertyType === "title") {
                    this.onComboBoxSelection(oCardManifestSettings, sPropertyType, "OVP_KEYUSER_INPUT_ERROR", OVPUtils.Annotations.title, "sapOvpCardTitle");
                }
                if (sPropertyType === "subTitle") {
                    this.onComboBoxSelection(oCardManifestSettings, sPropertyType, "OVP_KEYUSER_INPUT_ERROR_VALUE_STATE_SUBTITLE", OVPUtils.Annotations.subTitle, "sapOvpCardSubTitle");
                }
                if (sPropertyType === "valueSelectionInfo") {
                    this.onComboBoxSelection(oCardManifestSettings, sPropertyType, "OVP_KEYUSER_INPUT_ERROR_VALUE_STATE_SELECTIONVALUEINFO", OVPUtils.Annotations.valueSelectionInfo, "sapOvpValueSelectionInfo");
                }
                if (sPropertyType === "dataPointAnnotationPath") {
                    this.onComboBoxSelection(oCardManifestSettings, sPropertyType, "OVP_KEYUSER_INPUT_ERROR_VALUE_STATE_DATAPOINT", OVPUtils.Annotations.dataPoint, "sapOvpDataPoint");
                }
                if (sPropertyType === "listFlavor") {
                    this.onComboBoxSelection(oCardManifestSettings, sPropertyType, "OVP_KEYUSER_LISTFLAVOR_ERROR", OVPUtils.Annotations.listFlavor, "sapOVPLinkListFlavor");
                }
            }
        },

        onComboBoxSelection : function (oCardManifestSettings, sPropertyType, sText, sProperty, sId) {
            var sErrorText;
            if (oCardManifestSettings[sPropertyType] === "") {
                sErrorText = OvpResources.getText(sText);
                this.handleValueStateofComboBox(sErrorText, sProperty, sId, true);
		    } else {
                this.handleValueStateofComboBox(sErrorText, sProperty, sId, false);
		    }
        },

        onSaveButtonPress : function() {
            if (!this._oCardManifestSettings.addNewCard ) {
	            if (settingsUtils.bError || this.bError) {
	                settingsUtils.oMessagePopOverButton.firePress();
	            } else {
	                this.createAndSubmitChange.bind(this)();
	            }
            } else {
                this.createAndSubmitChange.bind(this)();
            }
        },

        onResizingChange: function (oEvent) {
            var bStopResizing = oEvent.getParameter("state");
            this._oCardManifestSettings.stopResizing = !bStopResizing;
            this.updateCard(oEvent);
        },

        onNumberOfRowsChanged: function (oEvent) {
            var iRows = +this._oCardManifestSettings.defaultSpan.rows;
            this._oCardManifestSettings.defaultSpan.rows = iRows;
            this._oCardManifestSettings.defaultSpan.showOnlyHeader = (iRows === 0);
            this._oCardManifestSettings.cardLayout.showOnlyHeader = (iRows === 0);
            var aCardTypeForNoOfItem = ["sap.ovp.cards.list", "sap.ovp.cards.table"];
            if (aCardTypeForNoOfItem.indexOf(this._oCardManifestSettings.template) !== -1) {
                this._oCardManifestSettings.cardLayout.noOfItems = iRows;
            } else {
                this._oCardManifestSettings.cardLayout.rowSpan = iRows;
            }
            this.updateCard(oEvent);
        },

        onNumberOfColumnsChanged : function (oEvent) {
            this._oCardManifestSettings.defaultSpan.cols = +this._oCardManifestSettings.defaultSpan.cols;
            this.updateCard(oEvent);
        },

        setBusy : function (bBusy) {
            if (bBusy) {
//                this.getView().byId("dialogCard").addStyleClass("componentContainerBusy");
                this.getView().addStyleClass("dialogContainerOverlay");
                var dialogCard = this.getView().byId("dialogCard");
                if (dialogCard.getVisible() && dialogCard.getComponentInstance()) {
                    dialogCard.getComponentInstance().getRootControl().setBusy(bBusy);
                }
            } else {
//                this.getView().byId("dialogCard").removeStyleClass("componentContainerBusy");
                this.getView().removeStyleClass("dialogContainerOverlay");
//                this.getView().byId("dialogCard").setBusy(bBusy);
                setTimeout( function(){
                    var dialogCard = this.getView().byId("dialogCard");
                    if (dialogCard.getVisible() && dialogCard.getComponentInstance()) {
                        dialogCard.getComponentInstance().getRootControl().setBusy(bBusy);
                    }
                }.bind(this), 2000);
            }
//            this.getView().byId("dialogCard").setBusy(bBusy);

        },

        _fCardWithoutRefresh : function (oEvent, updatedElementProps) {
            var oView = this.getView(),
                oCardManifestSettings = this._oCardManifestSettings,
                oComponentInstance = oView.byId("dialogCard").getComponentInstance(),
                oRootControl = oComponentInstance.getRootControl(),
                oCardController = oRootControl.getController(),
                oCardPropertiesModel = oCardController.getCardPropertiesModel(),
                oElement, oManifestModel,
                isViewSwitchEnabled = false,
                iSelectedKey;
            if (oCardManifestSettings.tabs && oCardManifestSettings.tabs.length) {
                isViewSwitchEnabled = true;
                iSelectedKey = parseInt(oCardManifestSettings.selectedKey,10);
            }
            if (updatedElementProps.formElementId === "sapOvpSettingsLineItemTitle" ||
                updatedElementProps.formElementId === "sapOvpSettingsLineItemSubTitle") {
                oElement = oRootControl.byId(updatedElementProps.cardElementId + "--" + oView.getModel().getProperty("/lineItemId"));
            } else {
                oElement = oRootControl.byId(updatedElementProps.cardElementId);
                if (!oElement) {
                    this._fCardWithRefresh(oEvent, updatedElementProps.cardElementId);
                }
            }
            switch (updatedElementProps.formElementId) {
                case "sapOvpSettingsLineItemTitle":
                case "sapOvpSettingsLineItemSubTitle":
                case "sapOvpSettingsTitle" :
                case "sapOvpSettingsValueSelectionInfo" :
                    if (oElement) {
                        oElement.setText(oEvent.getSource().getValue());
                    }
                    break;
                case "sapOvpSettingsSubTitle" :
                    oCardPropertiesModel.setProperty("/subTitle", oEvent.getSource().getValue());
                    oCardController._setSubTitleWithUnitOfMeasure();
                    break;
                case "sapOvpSettingsViewName":
                    var viewName = oCardManifestSettings.viewName;
                    oManifestModel = oView.getModel();
                    oElement.getItems()[iSelectedKey - 1].setText(viewName);
                    oCardManifestSettings.tabs[iSelectedKey - 1].value = viewName;
                    if (oCardManifestSettings.defaultViewSelected === iSelectedKey) {
                        viewName = viewName + " (" + this.oOvpResourceBundle.getText("OVP_KEYUSER_LABEL_DEFAULT_VIEW") + ")";
                    }
                    oCardManifestSettings.aViews[iSelectedKey].text = viewName;
                    oManifestModel.refresh();
                    break;
                case "sapOvpDefaultViewSwitch":
                    if (oEvent.getSource().getState()) {
                        var defaultSelectedKey = oCardManifestSettings.defaultViewSelected;
                        oManifestModel = oView.getModel();
                        oCardManifestSettings.defaultViewSelected = iSelectedKey;
                        oCardManifestSettings.aViews[defaultSelectedKey].text = oCardManifestSettings.tabs[defaultSelectedKey - 1].value;
                        oCardManifestSettings.aViews[iSelectedKey].text += " (" + this.oOvpResourceBundle.getText("OVP_KEYUSER_LABEL_DEFAULT_VIEW") + ")";
                        oManifestModel.refresh();
                        this.defaultViewSwitch = oEvent.getSource();
                        this.defaultViewSwitch.setEnabled(false);
                    }
                    break;
                case "sapOvpSettingsIdentification" :
                    if (isViewSwitchEnabled) {
                        oCardManifestSettings.tabs[iSelectedKey - 1][updatedElementProps.updateProperty] = oCardManifestSettings[updatedElementProps.updateProperty];
                    }
                    break;
                case "sapOvpSettingsKPIHeaderSwitch" :
                    var oVisibilityModel = oView.getModel("visibility"),
                        oVisibilityData = oVisibilityModel.getData();
                    oVisibilityData.dataPoint = false;
                    oVisibilityData.valueSelectionInfo = false;
                    if (isViewSwitchEnabled) {
                        oCardManifestSettings.tabs.forEach(function(tab) {
                            tab.prevDataPointAnnotationPath = tab.dataPointAnnotationPath;
                            tab.dataPointAnnotationPath = undefined;
                        });
                    } else {
                        var sDataPointAnnotationPath = oCardManifestSettings.dataPointAnnotationPath;
                        if (sDataPointAnnotationPath) {
                            oCardManifestSettings.prevDataPointAnnotationPath = sDataPointAnnotationPath;
                        }
                        oCardManifestSettings.dataPointAnnotationPath = undefined;
                    }
                    oVisibilityModel.refresh(true);
                    oElement.destroy();
                    break;
                default :
                    break;
            }
        },

        _fCardWithRefresh : function (oEvent, updateProperty) {
            var sPrevDataPointAnnotationPath,defaultViewSelected,oView,oVisibilityModel,oVisibilityData,
                oCardManifestSettings = this._oCardManifestSettings,
                oSettingDialog = this.getView(),
                oComponentContainer = oSettingDialog.byId("dialogCard"),
                card = (!oComponentContainer.getComponentInstance()) ? undefined : oComponentContainer.getComponentInstance().getComponentData(),
                sCardId = (!card) ? "Dialog" : card.cardId,
                modelName = (!card) ? undefined : card.manifest.cards[sCardId].model,
                oManifest = {
                    cards: {}
                },
                isViewSwitchEnabled = false,
                iSelectedKey;
            if (oCardManifestSettings.tabs && oCardManifestSettings.tabs.length) {
                isViewSwitchEnabled = true;
                /*selectedKey gets set to string from UI select Box*/
                iSelectedKey = parseInt(oCardManifestSettings.selectedKey,10);
            }

            switch (updateProperty) {
                case "subTitleSwitch" :
                    oView = this.getView();
                    oVisibilityModel = oView.getModel("visibility");
                    if (oEvent.getSource().getState()) {
                        if (isViewSwitchEnabled) {
                            defaultViewSelected = oCardManifestSettings.defaultViewSelected;
                            oCardManifestSettings.tabs.forEach(function (tab) {
                                sPrevDataPointAnnotationPath = tab.prevDynamicSubtitleAnnotationPath;
                                if (sPrevDataPointAnnotationPath) {
                                    tab.dynamicSubtitleAnnotationPath = sPrevDataPointAnnotationPath;
                                } else {
                                    tab.dynamicSubtitleAnnotationPath = oCardManifestSettings.dynamicSubTitle[0].value;
                                }
                            });
                            oCardManifestSettings.dynamicSubtitleAnnotationPath = oCardManifestSettings.tabs[defaultViewSelected - 1].dynamicSubtitleAnnotationPath;
                        } else {
                            sPrevDataPointAnnotationPath = oCardManifestSettings.prevDynamicSubtitleAnnotationPath;
                            if (sPrevDataPointAnnotationPath) {
                                oCardManifestSettings.dynamicSubtitleAnnotationPath = sPrevDataPointAnnotationPath;
                            } else {
                                oCardManifestSettings.dynamicSubtitleAnnotationPath = oCardManifestSettings.dynamicSubTitle[0].value;
                            }
                        }
                        oSettingDialog.byId("sapOvpSettingsDynamicSubTitle").setSelectedKey(oCardManifestSettings.dynamicSubtitleAnnotationPath);
                    } else {
                        if (isViewSwitchEnabled) {
                            oCardManifestSettings.tabs.forEach(function(tab) {
                                tab.prevDynamicSubtitleAnnotationPath = tab.dynamicSubtitleAnnotationPath;
                                tab.dynamicSubtitleAnnotationPath = undefined;
                            });
                            oCardManifestSettings.dynamicSubtitleAnnotationPath = undefined;
                        } else {
                            var sDataPointAnnotationPath = oCardManifestSettings.dynamicSubtitleAnnotationPath;
                            if (sDataPointAnnotationPath) {
                                oCardManifestSettings.prevDynamicSubtitleAnnotationPath = sDataPointAnnotationPath;
                            }
                            oCardManifestSettings.dynamicSubtitleAnnotationPath = undefined;
                        }
                    }
                    oVisibilityModel.setProperty("/subTitle",
                        settingsUtils.getVisibilityOfElement(oCardManifestSettings, "subTitle", isViewSwitchEnabled));
                    oVisibilityModel.setProperty("/dynamicSubTitle",
                        settingsUtils.getVisibilityOfElement(oCardManifestSettings, "dynamicSubTitle", isViewSwitchEnabled)
                        && !!oCardManifestSettings["dynamicSubTitle"] && !!oCardManifestSettings["dynamicSubTitle"].length);
                    oVisibilityModel.refresh(true);
                    break;
                case "kpiHeader" :
                    oView = this.getView();
                    oVisibilityModel = oView.getModel("visibility");
                    oVisibilityData = oVisibilityModel.getData();
                    oVisibilityData.valueSelectionInfo = true;
                    oVisibilityData.dataPoint = true;
                    if (oCardManifestSettings.tabs && oCardManifestSettings.tabs.length ) {
                        oVisibilityData.dataPoint = settingsUtils.getVisibilityOfElement(oCardManifestSettings, "dataPoint", true);
                    }
                    if (!oCardManifestSettings.valueSelectionInfo) {
                        oCardManifestSettings.valueSelectionInfo = " ";
                    }
                    if (isViewSwitchEnabled) {
                        defaultViewSelected = oCardManifestSettings.defaultViewSelected;
                        oCardManifestSettings.tabs.forEach(function (tab) {
                            sPrevDataPointAnnotationPath = tab.prevDataPointAnnotationPath;
                            if (sPrevDataPointAnnotationPath) {
                                tab.dataPointAnnotationPath = sPrevDataPointAnnotationPath;
                            } else {
                                tab.dataPointAnnotationPath = oCardManifestSettings.dataPoint[0].value;
                            }
                        });
                        oCardManifestSettings.dataPointAnnotationPath = oCardManifestSettings.tabs[defaultViewSelected - 1].dataPointAnnotationPath;
                    } else {
                        sPrevDataPointAnnotationPath = oCardManifestSettings.prevDataPointAnnotationPath;
                        if (sPrevDataPointAnnotationPath) {
                            oCardManifestSettings.dataPointAnnotationPath = sPrevDataPointAnnotationPath;
                        } else {
                            oCardManifestSettings.dataPointAnnotationPath = oCardManifestSettings.dataPoint[0].value;
                        }
                    }
                    oVisibilityModel.refresh(true);
                    break;
                case "listType" :
                    oCardManifestSettings[updateProperty] = (oEvent.getSource().getState()) ? "extended" : "condensed";
                    break;
                case "listFlavor" :
                    oCardManifestSettings[updateProperty] = (oEvent.getSource().getState()) ? "bar" : "";
                    break;
                case "entitySet":
                    if (isViewSwitchEnabled) {
                        oCardManifestSettings.tabs[iSelectedKey - 1][updateProperty] = oCardManifestSettings[updateProperty];
                        SettingsConstants.resetTabFields.forEach(function (field) {
                            delete oCardManifestSettings.tabs[iSelectedKey - 1][field];
                            delete oCardManifestSettings[field];
                        });
                        var oMetaModel = oCardManifestSettings.metaModel,
                            oEntitySet = oMetaModel.getODataEntitySet(oCardManifestSettings.tabs[iSelectedKey - 1].entitySet),
                            iDefaultViewSelected = oCardManifestSettings.defaultViewSelected;
                        oCardManifestSettings.entityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
                        this.resetSupportingObjectsOnEntitySetChange(oCardManifestSettings, iDefaultViewSelected);
                    }
                    break;
                case "kpiAnnotationPath":
                    if (isViewSwitchEnabled) {
                        oCardManifestSettings.tabs[iSelectedKey - 1][updateProperty] = oCardManifestSettings[updateProperty];
                    }
                    var SelectedKey = oSettingDialog.byId("sapOvpSettingsKPIAnnotation").getSelectedKey();
                    if (oCardManifestSettings.entityType[SelectedKey]) {
                        this.setVariant(oCardManifestSettings, SelectedKey);
                    }
                    settingsUtils.addKPINavApplicationName(oCardManifestSettings);
                    this.getView().getModel().refresh(true);
                    break;
                case "selectionPresentationAnnotationPath":
                    if (isViewSwitchEnabled) {
                        oCardManifestSettings.tabs[iSelectedKey - 1][updateProperty] = oCardManifestSettings[updateProperty];
                    }
                    var SelectedKey = oSettingDialog.byId("sapOvpSettingsFilterAndPresentedBy").getSelectedKey();
                    if (oCardManifestSettings.entityType[SelectedKey]) {
                        this.setVariant(oCardManifestSettings, SelectedKey);
                    }
                    this.getView().getModel().refresh(true);
                    break;
                case "listFlavorForLinkList":
                case "annotationPath":
                case "chartAnnotationPath":
                case "presentationAnnotationPath":
                case "selectionAnnotationPath":
                case "dynamicSubtitleAnnotationPath":
                case "dataPointAnnotationPath":
                    if (isViewSwitchEnabled) {
                        oCardManifestSettings.tabs[iSelectedKey - 1][updateProperty] = oCardManifestSettings[updateProperty];
                    }
                    break;
                case "noOfRows":
                case "ovpHeaderTitle":
                case "add":
                case "removeVisual":
                case "changeVisual":
                case "sort":
                case "delete":
                    break;
                default :
                    break;
            }
            oManifest.cards[sCardId] = {
                settings: oCardManifestSettings
            };

            if (settingsUtils.bNewKPICardFlag) {
                oManifest.cards[sCardId].template = oCardManifestSettings.template;
            } else {
                oManifest.cards[sCardId].template = card.template;
            }

            if (settingsUtils.bNewKPICardFlag) {
                if (modelName && oSettingDialog.getModel(modelName)) {
                    oSettingDialog.getModel(modelName).destroy();
                    oSettingDialog.setModel(null, modelName);
                }

                var oSelectedKPI = this._oCardManifestSettings.selectedKPI,
                    oModel = new sap.ui.model.odata.v2.ODataModel(oSelectedKPI.ODataURI, {
                        'annotationURI': oSelectedKPI.ModelURI,
                        'defaultCountMode': sap.ui.model.odata.CountMode.None
                    });
                modelName = CommonUtils._getLayerNamespace() + ".kpi_card_model_" + settingsUtils.getTrimmedDataURIName(oSelectedKPI.ODataURI);
                oSettingDialog.setModel(oModel, modelName);

            }

            if (!!modelName) {
                oManifest.cards[sCardId].model = modelName;
            }

            if (settingsUtils.bNewKPICardFlag) {
                oModel.getMetaModel().loaded().then(function () {
                    var oPromise = OVPCardAsAPIUtils.createCardComponent(oSettingDialog, oManifest, "dialogCard");
                    oPromise.then(function () {
                        oSettingDialog.setBusy(false);
                        this.setBusy(false);
                    }.bind(this)).catch(function () {
                        settingsUtils.setErrorMessage(oManifest.cards[sCardId].settings, "OVP_KEYUSER_ANNOTATION_FAILURE");
                        settingsUtils.createErrorCard(oSettingDialog, oManifest, sCardId);
                    });
                }.bind(this), function (oError) {
                    Log.error(oError);
                    this.setBusy(false);
                    oSettingDialog.setBusy(false);
                }.bind(this));
                oModel.attachMetadataFailed(function () {
                    settingsUtils.setErrorMessage(oManifest.cards[sCardId].settings, "OVP_KEYUSER_METADATA_FAILURE");
                    settingsUtils.createErrorCard(oSettingDialog, oManifest, sCardId);
                });
            } else {
                this.createCard(oSettingDialog, oManifest);
            }
        },

        setVariant: function (oCardManifestSettings, SelectedKey) {
            var SelectedEntity = oCardManifestSettings.entityType[SelectedKey];
            var selectionVariant = SelectedEntity.SelectionVariant && SelectedEntity.SelectionVariant.Path;
            if (/^@/.test(selectionVariant)) {
                selectionVariant = selectionVariant.slice(1);
            }
            oCardManifestSettings.selectionAnnotationPath = selectionVariant;
            var presentationVariant;
            if (SelectedKey.indexOf(".KPI") !== -1) {
                presentationVariant = SelectedEntity.Detail && SelectedEntity.Detail.DefaultPresentationVariant && SelectedEntity.Detail.DefaultPresentationVariant.Path;
            } else if (SelectedKey.indexOf(".SelectionPresentationVariant") !== -1) {
                presentationVariant = SelectedEntity.PresentationVariant && SelectedEntity.PresentationVariant.Path;
            }
            if (/^@/.test(presentationVariant)) {
                presentationVariant = presentationVariant.slice(1);
            }
            oCardManifestSettings.presentationAnnotationPath = presentationVariant;
            var aVisualizations = oCardManifestSettings.entityType[oCardManifestSettings.presentationAnnotationPath] && oCardManifestSettings.entityType[oCardManifestSettings.presentationAnnotationPath].Visualizations;
            for (var index = 0; index < aVisualizations.length; index++) {
                var sVisualizations = aVisualizations[index].AnnotationPath;
                if (sVisualizations) {
                    if (/^@/.test(sVisualizations)) {
                        sVisualizations = sVisualizations.slice(1);
                    }
                    if (/.Chart/.test(sVisualizations)) {
                        oCardManifestSettings.chartAnnotationPath = sVisualizations;
                        break;
                    }
                }
            }
        },

        createCard : function (oSettingDialog, oManifest) {
            this.setBusy(true);
            var oPromise = OVPCardAsAPIUtils.createCardComponent(oSettingDialog, oManifest, "dialogCard");
            oPromise.then(function(){
                this.setBusy(false);

                var oList = this.getView().byId("sapOvpStaticLinkListLineItem");
                if (oList) {
                    var oItem = oList.getSelectedItem();
                    if (oItem) {
                        var sId = oItem.getId(),
                            iIndex = this.getIndexFromIdForStaticLinkList(sId);
                        // Setting the Active Page in Case of Carousel Card
                        this.setCurrentActivePageForCarouselCard(iIndex);
                    }
                }
            }.bind(this));
            oPromise.catch(function(){
                this.setBusy(false);
            }.bind(this));
        },

        updateCard : function(oEvent, sId) {
            /*Reset Card Level Button*/
            var oCardManifestSettings = this._oCardManifestSettings,
                dialogCard = this.getView().byId("dialogCard");
            this.setEnablePropertyForResetAndSaveButton(true);
            if (dialogCard.getVisible()) {
                /*Reset View Level Button*/
                if (oCardManifestSettings.tabs && oCardManifestSettings.tabs.length) {
                    /*selectedKey gets set to string from UI select Box*/
                    var iSelectedKey = parseInt(oCardManifestSettings.selectedKey, 10);
                    oCardManifestSettings.isViewResetEnabled = true;
                    oCardManifestSettings.aViews[iSelectedKey].isViewResetEnabled = true;
                }
                var oSource = oEvent.getSource(),
                    sourceElementId = (sId) ? sId : oSource.getId(),
                    bCardWithoutRefresh = false;
                if (sourceElementId.indexOf("sapOvpStaticLinkListLineItem") !== -1) {
                    var oCardPropertiesModel = oSource.getModel(),
                        aStaticContent = oCardPropertiesModel.getData().staticContent,
                        iIndex = this.getIndexFromIdForStaticLinkList(sourceElementId);

                    // Setting the Active Page in Case of Carousel Card
                    this.setCurrentActivePageForCarouselCard(iIndex);

                    oCardPropertiesModel.setProperty("/lineItemId", aStaticContent[iIndex].id);
                    if (sourceElementId.indexOf("sapOvpSettingsLineItemTitle") !== -1) {
                        sourceElementId = "sapOvpSettingsLineItemTitle";
                    } else if (sourceElementId.indexOf("sapOvpSettingsLineItemSubTitle") !== -1) {
                        sourceElementId = "sapOvpSettingsLineItemSubTitle";
                    }
                }
                for (var i = 0; i < this._aRefreshNotRequired.length; i++) {
                    if (sourceElementId.indexOf(this._aRefreshNotRequired[i].formElementId) > -1) {
                        if (this._aRefreshNotRequired[i].isKpiSwitch && oEvent.getSource().getState()) {
                            break;
                        }
                        this._fCardWithoutRefresh(oEvent, this._aRefreshNotRequired[i]);
                        bCardWithoutRefresh = true;
                        break;
                    }
                }
                if (!bCardWithoutRefresh) {
                    for (var j = 0; j < this._aRefreshRequired.length; j++) {
                        if (sourceElementId.indexOf(this._aRefreshRequired[j].formElementId) > -1) {
                            this.setBusy(true);
                            this._fCardWithRefresh(oEvent, this._aRefreshRequired[j].updateProperty);
                            break;
                        }
                    }
                }
                // This part wouldn't be executed in case of key user
                var layer = CommonUtils._getLayer();
                if (layer === OVPUtils.Layers.vendor) {
                    for (var key in this.oMandatoryPropertiesKey) {
                        if (sourceElementId.indexOf(this.oMandatoryPropertiesKey[key]) > -1) {
                            var bRepeatedText = false,
                                sTitlekey = key + "Key",
                                sTitleProperty = key + "Property";
                            oCardManifestSettings[key]  = oEvent.getParameter("value");
                            oCardManifestSettings[sTitleProperty] = oEvent.getParameter("value");
                            for (var key in oCardManifestSettings.ai18nProperties) {
                                if (oCardManifestSettings.ai18nProperties[key].value === oEvent.getParameter("value")) {
                                    oCardManifestSettings[sTitlekey] = oCardManifestSettings.ai18nProperties[key].key;
                                    bRepeatedText = true;
                                    break;
                                }
                            }
                            if (!bRepeatedText) {
                                oCardManifestSettings[sTitlekey] = "";
                            }
                            break;
                        }
                    }
                }
            }
        },
        onExit: function () {
            settingsUtils.oSaveButton.detachPress(this.onSaveButtonPress,this);
            settingsUtils.oResetButton.detachPress(this.onResetButton,this);
            settingsUtils.oMessagePopOverButton.detachPress(this.handleMessagePopoverPress, this);
        },

        getListItems : function() {
            /*Getting the  iContext for sap.ovp.annotationHelper Function*/
            var aItemList = [],
                oCardManifestSettings = this._oCardManifestSettings,
                oSettingDialog = this.getView(),
                oComponentContainer = oSettingDialog.byId("dialogCard"),
                card = oComponentContainer.getComponentInstance().getComponentData(),
                lineItemBindingPath = oCardManifestSettings.entityType.$path + "/" + oCardManifestSettings.annotationPath,
                oModel = card.model.getMetaModel(),
                iContext = oModel.getContext(oModel.resolve(lineItemBindingPath, this.oView.getBindingContext()));

            /*Forming Visible Fields String*/
            ////For Condensed List
            var maxDataFields = 2,
                maxDataPoints = 1,
                noOfDataFieldsReplaceableByDataPoints = 0;
            if (oCardManifestSettings.listFlavor === "bar") {
                //For Condensed List  Bar Card :- Max Data Fields = 2 and Max DataPoints = 1 and Replaceable fields are 0
                maxDataFields = 1;
                maxDataPoints = 2;
            }

            if (oCardManifestSettings.listType && oCardManifestSettings.listType.toLowerCase() === "extended") {
                //For Extended List Card :- Max Data Fields = 6 and Max DataPoints =  and Replaceable fields are 0
                maxDataFields = 6;
                maxDataPoints = 3;
                noOfDataFieldsReplaceableByDataPoints = 3;
                if (oCardManifestSettings.listFlavor === "bar") {
                    //For Extended Bar List Card
                    maxDataFields = 5;
                }
            } else if (oCardManifestSettings.contentFragment === "sap.ovp.cards.table.Table") {
                //For Table Card Max Data :- Fields = 3 and Max DataPoints = 1 and Replaceable fields are 1
                maxDataFields = 3;
                maxDataPoints = 1;
                noOfDataFieldsReplaceableByDataPoints = 1;
            }
            oCardManifestSettings.lineItem.forEach(function (lineItem) {
                var aDataPointsObjects = CardAnnotationHelper.getSortedDataPoints(iContext,lineItem.fields),
                    aDataFieldsObjects = CardAnnotationHelper.getSortedDataFields(iContext,lineItem.fields),
                    dataFields = [],
                    dataPoints = [],
                    sAnnotationQualifier = settingsUtils.getQualifier(lineItem.value);
                aDataPointsObjects.forEach(function (fields) {
                    if (fields.Title) {
                        dataPoints.push(settingsUtils.checkForEmptyString(fields.Title.String, ""));
                    } else {
                        dataPoints.push(OvpResources.getText("OVP_KEYUSER_LABEL_DEFAULT_LABEL_WITH_QUALIFIER", [sAnnotationQualifier]));
                    }
                });
                aDataFieldsObjects.forEach(function (fields) {
                    if (fields.Label) {
                        dataFields.push(fields.Label.String);
                    } else {
                        dataFields.push(OvpResources.getText("OVP_KEYUSER_LABEL_DEFAULT_LABEL_WITH_QUALIFIER", [sAnnotationQualifier]));
                    }
                });
                var noOfDataPointsUsed = Math.min(dataPoints.length, maxDataPoints),
                    noOfDataPointsOccupyingDataFieldsSpace = Math.min(noOfDataFieldsReplaceableByDataPoints,noOfDataPointsUsed),
                    visibleField = dataFields.slice(0, maxDataFields - noOfDataPointsOccupyingDataFieldsSpace)
                        .concat(dataPoints.slice(0, noOfDataPointsUsed));
                visibleField.map(function(field){
                    return field.charAt(0).toUpperCase() + field.substr(1);
                });
                aItemList.push({
                    Value: lineItem.value,
                    Label: lineItem.name,
                    VisibleFields: visibleField.toString()
                });
            });
            return aItemList;
        },
        onSearch: function (oEvent) {
            var oView = this.getView(),
                oModel = oView.getModel(),
                iLength;
            this._filterTable(oEvent, ["GroupTitle", "KPITitle", "GroupID", "KPIID", "KPIQualifier"], "sapOvpKPITable");
            iLength = oView.byId("sapOvpKPITable").getBinding("items").getLength();
            oModel.setProperty("/NoOfKPIItem", iLength);
            oModel.refresh(true);
        },
        _filterTable: function (oEvent, aFields, sId) {
            var sQuery = oEvent.getParameter("query"),
                oGlobalFilter = null,
                aFilters = [];
            for (var i = 0; i < aFields.length; i++) {
                aFilters.push(new Filter(aFields[i], FilterOperator.Contains, sQuery));
            }
            if (sQuery) {
                oGlobalFilter = new Filter(aFilters, false);
            }
            this.getView().byId(sId).getBinding("items").filter(oGlobalFilter, "Application");
        },
        onItemPress: function (oEvent) {
            this.getView().setBusy(true);
            this.getView().setBusyIndicatorDelay(0);
            var oSelectedItem = oEvent.getSource(),
                oSelectedItemContext = oSelectedItem.getBindingContext(),
                oKPIValue = oSelectedItemContext.getObject();
            this.getView().byId("sapOvpSettingsTitle").setValue(oKPIValue.GroupTitle);
            this.getView().byId("sapOvpSettingsSubTitle").setValue(oKPIValue.KPITitle);
            this.onKPIUpdate(oKPIValue);
            this.updateCard(oEvent, "sapOvpSettingsNewKPICard");
        },
        onKPIUpdate: function (oKPIValue) {
            this._oCardManifestSettings.entitySet = oKPIValue.ODataEntityset;
            this._oCardManifestSettings.kpiAnnotationPath = "com.sap.vocabularies.UI.v1.KPI#" + oKPIValue.KPIQualifier;
            this._oCardManifestSettings.title = oKPIValue.GroupTitle;
            this._oCardManifestSettings.subTitle = oKPIValue.KPITitle;
            this._oCardManifestSettings.template = "sap.ovp.cards.charts.analytical";
            this._oCardManifestSettings.selectedKPI = oKPIValue;
        },
        onSeePress: function () {
            this.attachBrowserHeightChangeHandler();

            var oCancelButton = new Button("KPIItemCancelBtn", {
                text: this.oOvpResourceBundle && this.oOvpResourceBundle.getText("cancelBtn")
            });

            this.KPIItemDialog = new Dialog({
                title: this.oOvpResourceBundle && this.oOvpResourceBundle.getText("OVP_KEYUSER_KPI_DIALOG_TITLE"),
                buttons: [oCancelButton]
            }).addStyleClass("sapOvpSettingsDialogBox");

            var oRowsModel = new JSONModel({
                "KPIItem": this._oCardManifestSettings.KPIData
            });
            oRowsModel.setProperty("/densityStyle", this.getDensityStyle());
            oRowsModel.setProperty("/NoOfKPIItem", oRowsModel.getProperty("/KPIItem").length);
            var oKPIItemDialogContent = new sap.ui.view("KPIItemDialogContent", {
                viewName: "sap.ovp.cards.rta.SelectKPI",
                type: ViewType.XML,
                preprocessors: {
                    xml: {
                        bindingContexts: {
                            tableRows: oRowsModel.createBindingContext("/")
                        },
                        models: {
                            tableRows: oRowsModel
                        }
                    }
                }
            });

            oKPIItemDialogContent.setModel(oRowsModel);
            oKPIItemDialogContent.setModel(this.getView().getModel("ovpResourceModel"), "ovpResourceModel");

            this.KPIItemDialog.addContent(oKPIItemDialogContent);

            oKPIItemDialogContent.loaded().then(function (oView) {
                this._oKPIItemDialogContentView = oView;

                oView.getController().updateKPIItemPath = function (oValue, oEvent) {
                    this.getView().setBusy(true);
                    this.getView().setBusyIndicatorDelay(0);
                    this.getView().byId("sapOvpSettingsTitle").setValue(oValue.GroupTitle);
                    this.getView().byId("sapOvpSettingsSubTitle").setValue(oValue.KPITitle);
                    this.onKPIUpdate(oValue);
                    this.updateCard(oEvent, "sapOvpSettingsNewKPICard");
                    this.cleanAndCloseDialog(oCancelButton);
                }.bind(this);

                oCancelButton.attachPress(function () {
                    this.cleanAndCloseDialog(oCancelButton);
                }.bind(this));

                this.KPIItemDialog.open();

                setTimeout(function () {
                    this.browserHeightChange();
                }.bind(this), 0);
            }.bind(this));
        },

        openLineItemValueHelpDialog: function(oEvent) {
            this.attachBrowserHeightChangeHandler();
            this._oEvent = jQuery.extend({}, oEvent);
            // lineItem dialog close button
            var oCancelButton = new Button("lineItemCancelBtn", {
                text: this.oOvpResourceBundle && this.oOvpResourceBundle.getText("cancelBtn")
            });

            // lineItem dialog
            this.lineItemDialog = new Dialog({
                title: this.oOvpResourceBundle && this.oOvpResourceBundle.getText("OVP_KEYUSER_LINEITEM_ANNO"),
                buttons: [oCancelButton]
            }).addStyleClass("sapOvpSettingsDialogBox");

            var oRowsModel = new JSONModel({
                "lineItem": this.getListItems()
            });

            oRowsModel.setProperty("/densityStyle", this.getDensityStyle());

            oRowsModel.setProperty("/NoOfLineItem", oRowsModel.getProperty("/lineItem").length);

            // LineItem Dialog
            var oLineItemDialogContent = new sap.ui.view("lineItemDialogContent", {
                viewName: "sap.ovp.cards.rta.SelectLineItem",
                type: ViewType.XML,
                preprocessors: {
                    xml: {
                        bindingContexts: {
                            tableRows: oRowsModel.createBindingContext("/")
                        },
                        models: {
                            tableRows: oRowsModel
                        }
                    }
                }
            });

            oLineItemDialogContent.setModel(oRowsModel);
            oLineItemDialogContent.setModel(this.getView().getModel("ovpResourceModel"), "ovpResourceModel");

            this.lineItemDialog.addContent(oLineItemDialogContent);

            oLineItemDialogContent.loaded().then(function (oView) {
                this._oLineItemDialogContentView = oView;
                /**
                 *  Don't remove the below implementation because
                 *  This function acts as a bridge between SettingsDialog and SelectLineItem Controller
                 *
                 *  Adding new function "updateLineItemPath" to SelectLineItem controller with 'this' context
                 *  of SettingsDialog controller.
                 */
                oView.getController().updateLineItemPath = function (oValue) {
                    /*Getting the Value from the value selection info dialog*/
                    var selectedItem = oValue.Value,
                        oCardManifestSettings = this._oCardManifestSettings,
                    /*selectedKey gets set to string from UI select Box*/
                        iSelectedKey;
                    if (oCardManifestSettings.tabs && oCardManifestSettings.tabs.length) {
                        iSelectedKey = parseInt(oCardManifestSettings.selectedKey,10);
                    }
                    /*Updating the selected values to the Model*/
                    oCardManifestSettings.lineItemQualifier = settingsUtils.getQualifier(selectedItem);
                    oCardManifestSettings.annotationPath = selectedItem;
                    if (oCardManifestSettings.tabs && oCardManifestSettings.tabs.length) {
                        oCardManifestSettings.tabs[iSelectedKey - 1].annotationPath =
                            oCardManifestSettings.annotationPath;
                    }
                    /*Updating the Value to lineItem Input*/
                    this.getView().byId("sapOvpSettingsLineItem").setValue(oValue.Label);

                    /*Updating the card view*/
                    this._fCardWithRefresh(this._oEvent, "annotationPath");
                    /*Reset Card Level Button*/
                    this.setEnablePropertyForResetAndSaveButton(true);
                    /*Reset View Level Button*/
                    if (oCardManifestSettings.tabs && oCardManifestSettings.tabs.length) {
                        oCardManifestSettings.isViewResetEnabled = true;
                        oCardManifestSettings.aViews[iSelectedKey].isViewResetEnabled = true;
                    }

                    this.cleanAndCloseDialog(oCancelButton);
                }.bind(this);

                oCancelButton.attachPress(function () {
                    this.cleanAndCloseDialog(oCancelButton);
                }.bind(this));

                this.lineItemDialog.open();

                /**
                 *  Set LineItem Dialog Height for the first time
                 *  This is inside setTimeout because height is not correctly calculated.
                 */
                setTimeout(function () {
                    this.browserHeightChange();
                }.bind(this), 0);
            }.bind(this));
        },

        createAndSubmitChange : function() {
            var oPayLoad;
            if (settingsUtils.bNewStaticLinkListCardFlag) {
                oPayLoad = PayLoadUtils.getPayLoadForNewStaticLinkListCard.bind(this)(settingsUtils);
            } else if (settingsUtils.bNewKPICardFlag) {
                oPayLoad = PayLoadUtils.getPayLoadForNewKPICard.bind(this)(settingsUtils);
            } else if (settingsUtils.bAddNewCardFlag) {
                oPayLoad = PayLoadUtils.getPayLoadForNewCard.bind(this)(settingsUtils);
            } else {
                oPayLoad = PayLoadUtils.getPayLoadForEditCard.bind(this)(settingsUtils);
            }
            this.settingsResolve(oPayLoad);
            settingsUtils.dialogBox.close();
        },
        //Set mandatory fields and state of fields
        setMandatoryFieldState: function(bValue, oVisibilityModel) {
            oVisibilityModel.setProperty("/dataPoint", bValue);
            oVisibilityModel.setProperty("/valueSelectionInfo", bValue);
            oVisibilityModel.setProperty("/requiredSubTitle", bValue);
            var oVisibilityModelData = oVisibilityModel.getData(), bSetAnnotationCardProperties = false;
            for (var index = 0; index < settingsUtils.aVisiblePropertiesForAnnotation.length; index++) {
                if (oVisibilityModelData[settingsUtils.aVisiblePropertiesForAnnotation[index].sProperty]) {
                    bSetAnnotationCardProperties = true;
                    break;
                }
            }
            oVisibilityModel.setProperty("/setAnnotationCardProperties", bSetAnnotationCardProperties);
        },

        /*Change the visibility of data point and valueselectionInfo field based on
         * KPI header checkbox selection
         * Also setting the Subtitle valueState, valueStateText and marking field as mandatory on KPI check box selection
         */
        EnableKPIHeaderFields: function(bSelectedValue) {
            var oVisibilityModel = this.getView().getModel("visibility");
            if (!bSelectedValue) {
                this.setMandatoryFieldState(false, oVisibilityModel);
            } else {
                this.setMandatoryFieldState(true, oVisibilityModel);
            }
        },

        /*
        *  Based on the card selection setting the visiblity of
        *  view switch checkBox and add KPI header checkBox
        */
        onCardTypeSelected: function(oEvent) {
            var sId = oEvent.getParameters().id;
            this._oCardManifestSettings.template = oEvent.getSource().getSelectedKey();
            this.getView().byId("sapOVPAddKpiCheckBoxID").setSelected(false);
            this.getView().byId("sapOVPAddODataSelect").setSelected(false);
            this._oCardManifestSettings.addKPIHeaderCheckBox = false;
            this.EnableKPIHeaderFields(this._oCardManifestSettings.addKPIHeaderCheckBox);
            this.resetPropertiesVisibility(sId, this._oCardManifestSettings);
        },
	/**
	* When selecting an existing datasource,
	* retrieve all details  (metadata, ...)
	* @param {event} oEvent event
	* @returns {boolean} status of combobox
	*/
        onDatasourceComboboxChanged: function(oEvent) {
            var sId = oEvent.getParameters().id;
            this._oCardManifestSettings.model = oEvent.getParameters().value;
            this._oCardManifestSettings.allEntitySet = "";
            if (!settingsUtils.newDataSource) {
                var aDataSources = this._oCardManifestSettings.datasources;
                for (var i = 0; i < aDataSources.length; i++) {
                    if (aDataSources[i].Title === this._oCardManifestSettings.model) {
                        this._oCardManifestSettings.metaModel = aDataSources[i].oMetaModel;
                    }
                }
                settingsUtils.addSupportingObjects(this._oCardManifestSettings);
                if (this._oCardManifestSettings.allEntitySet.length === 0) {
                    this._oCardManifestSettings.model = "";
                    this.resetPropertiesVisibility(sId, this._oCardManifestSettings);
                    var sErrorText = OvpResources.getText("OVP_KEYUSER_NO_RELEVANT_ANNOTATION");
                    this.handleValueStateofComboBox(sErrorText, "datasSourceExisting", "sapOVPDataSourceExistingComboBox", true);
                } else {
                    this.handleValueStateofComboBox("", "datasSourceExisting", "sapOVPDataSourceExistingComboBox", false);
                    this.resetPropertiesVisibility(sId, this._oCardManifestSettings);
                }
            } else {
                var oDataSourceSelected = this._oCardManifestSettings.datasources.filter(function(oDataSource) {
                    return oDataSource.Title === this._oCardManifestSettings.model;
                }.bind(this));
                /* eslint-disable */
                getMetaModelForNewDataSource(oDataSourceSelected, settingsUtils.sApplicationId).then(function(oMetaModel){
                /* eslint-disable */
                	if (oMetaModel) {
                        settingsUtils.newDataSourceModel = oMetaModel.modelInformation;
                        oMetaModel.getODataEntityContainer = function () {
                            return oMetaModel.oEntityContainers;
                        };
                        oMetaModel.getObject = function(sPath) {
                            return oMetaModel.oSchema;
                        };
                        oMetaModel.getODataEntityType = function(sPath) {
                            var aODataEntityType = oMetaModel.oSchema[0].entityType.filter(function(entityTypeobj){
                            var entityTypePath = sPath.substr((oMetaModel.oEntityContainers.namespace + ".").length);
                                return entityTypeobj.name === entityTypePath;
                            });
                            return aODataEntityType[0];
                        };
                        this._oCardManifestSettings.metaModel = oMetaModel;
                        settingsUtils.addSupportingObjects(this._oCardManifestSettings);
                        if (this._oCardManifestSettings.allEntitySet.length === 0) {
                                    this._oCardManifestSettings.model = "";
                                    this.resetPropertiesVisibility(sId, this._oCardManifestSettings);
                                var sErrorText = OvpResources.getText("OVP_KEYUSER_NO_RELEVANT_ANNOTATION");
                                this.handleValueStateofComboBox(sErrorText, "datasSourceNew", "sapOVPDataSourceNewInput", true);
                        } else {
                            this.handleValueStateofComboBox("", "datasSourceNew", "sapOVPDataSourceNewInput", false);
                            this.resetPropertiesVisibility(sId, this._oCardManifestSettings);
                        }
                	} else {
                		//when metamodel is undefined
                		//when the service is unavailable and we didnt not get any service annotation
                		//show the error popup
                		this._oCardManifestSettings.model = "";
                		this.resetPropertiesVisibility(sId, this._oCardManifestSettings);
                		var sErrorText = OvpResources.getText("OVP_KEYUSER_UNAVAILABLE_DATASOURCE");
                		this.handleValueStateofComboBox(sErrorText, "datasSourceNew", "sapOVPDataSourceNewInput", true);
                	}
                }.bind(this));
            }
        },

        /* When selecting entity set from available list
         * @param {event} oEvent event
        */
        onEntitySetChanged: function(sEntityType, sId) {
            var aEntityType = this._oCardManifestSettings.metaModel.getObject('/dataServices/schema')[0].entityType;
            /* Clearing all annotation array when we change the entity set
            */
            this.aVariantNames.forEach(function (oVariantName) {
                if (this._oCardManifestSettings[oVariantName.sPath]) {
                    this._oCardManifestSettings[oVariantName.sPath] = [];
                }
            }.bind(this));
            for (var i in aEntityType) {
                if (aEntityType[i].name === sEntityType) {
                    this._oCardManifestSettings.entityType = aEntityType[i];
                    break;
                }
            }
            settingsUtils.addSupportingObjects(this._oCardManifestSettings);
            this.getView().byId("sapOVPAddODataSelect").setSelected(false);
            this.resetPropertiesVisibility(sId, this._oCardManifestSettings);
        },
        /*
        * Add empty row to add static parameters
        */
        addStaticParameterRow: function() {
            var oCardPropertiesModel = this.getView().getModel();
            var aStaticParameters = oCardPropertiesModel.getProperty("/aAllStaticParameters");
            if (aStaticParameters && aStaticParameters.length) {
                aStaticParameters.push({
                    key :  "",
                    value: ""
                });
            } else {
                aStaticParameters = [];
                aStaticParameters.push({
                    key :  "",
                    value: ""
                });
            }
            oCardPropertiesModel.setProperty("/aAllStaticParameters",aStaticParameters);
        },
        /*
        * Add empty row to add custom actions
        */
        addActionRow: function() {
            var oCardPropertiesModel = this.getView().getModel();
            var aCustomAction = oCardPropertiesModel.getProperty("/objectStreamCardsSettings/customActions");
            if (aCustomAction && aCustomAction.length) {
                aCustomAction.push({
                    text :  "",
                    press: "",
                    position: ""
                });
            } else {
                aCustomAction = [];
                aCustomAction.push({
                    text :  "",
                    press: "",
                    position: ""
                });
            }
            oCardPropertiesModel.setProperty("/objectStreamCardsSettings/customActions",aCustomAction);
        },
        /*
        * Delete static parameters in case of DTA
        */
        onParameterDelete: function(oEvent) {
            var oCardPropertiesModel = this.getView().getModel();
            var aStaticParameters = oCardPropertiesModel.getProperty("/aAllStaticParameters");

            var keyToBeDeleted = oEvent.getSource().getBindingContext().getObject() &&
                oEvent.getSource().getBindingContext().getObject()["key"];
            aStaticParameters = aStaticParameters.filter(function (param) {
                return param["key"] != keyToBeDeleted;
            });
            oCardPropertiesModel.setProperty("/aAllStaticParameters", aStaticParameters);
            if (!deepEqual(this._oCardManifestSettings.staticParameters, this._oOriginalCardManifestSettings.staticParameters)) {
                this.setEnablePropertyForResetAndSaveButton(true);
            }
            this.getView().getModel().refresh();
        },
        /*
        * Delete custom actions in case of DTA
        */
        onActionDelete: function(oEvent) {
            var oCardPropertiesModel = this.getView().getModel();
            var aStaticActions = oCardPropertiesModel.getProperty("/objectStreamCardsSettings/customActions");

            var keyToBeDeleted = oEvent.getSource().getBindingContext().getObject() &&
                oEvent.getSource().getBindingContext().getObject()["text"];

            aStaticActions = aStaticActions.filter(function (param) {
                return param["text"] != keyToBeDeleted;
            });
            oCardPropertiesModel.setProperty("/objectStreamCardsSettings/customActions", aStaticActions);
            if (!deepEqual(this._oCardManifestSettings.objectStreamCardsSettings,this._oOriginalCardManifestSettings.objectStreamCardsSettings)) {
                this.setEnablePropertyForResetAndSaveButton(true);
            }
        },
        /* Updating model based on the selected property
        */
        updateProperty: function(oEvent) {
            var sSourceElementId =  oEvent.getSource().getId();
            var isViewSwitchEnabled = false, iSelectedKey;
            if (this._oCardManifestSettings.tabs && this._oCardManifestSettings.tabs.length) {
                isViewSwitchEnabled = true;
                /*selectedKey gets set to string from UI select Box*/
                iSelectedKey = parseInt(this._oCardManifestSettings.selectedKey,10);
                this._oCardManifestSettings.isViewResetEnabled = true;
                this._oCardManifestSettings.aViews[iSelectedKey].isViewResetEnabled = true;
            }
            for (var i = 0; i < this._updateManifestProperties.length; i++) {
                if (sSourceElementId.indexOf(this._updateManifestProperties[i].formElementId) > -1) {
                    var sFormElement = this._updateManifestProperties[i].formElement;
                    switch (sFormElement){
                        case "entitySet":
                            var sSelectedEntityType = oEvent.getSource().getSelectedKey();
                            if (!isViewSwitchEnabled) {
                                this._oCardManifestSettings["entitySet"] = oEvent.getParameter("value");
                            } else {
                                this._oCardManifestSettings.tabs[iSelectedKey - 1]["entitySet"] = oEvent.getParameter("value");
                            }
                            this.onEntitySetChanged(sSelectedEntityType, sSourceElementId);
                            if (this._oCardManifestSettings["entitySet"].length !== 0) {
                            	this.validateComboBox(this._oCardManifestSettings, "entitySet");
                            }
                        break;
                        case "identificationAnnotationPath":
                            if (!isViewSwitchEnabled) {
                                this._oCardManifestSettings["identificationAnnotationPath"] = oEvent.getParameter("value");
                            } else {
                                this._oCardManifestSettings.tabs[iSelectedKey - 1]["identificationAnnotationPath"] = oEvent.getParameter("value");
                            }
                            break;
                        case "selectionPresentationAnnotationPath":
                            if (!isViewSwitchEnabled) {
                                this._oCardManifestSettings["selectionPresentationAnnotationPath"] = oEvent.getParameter("value");
                            } else {
                                this._oCardManifestSettings.tabs[iSelectedKey - 1]["selectionPresentationAnnotationPath"] = oEvent.getParameter("value");
                            }
                            break;
                        case "selectionAnnotationPath":
                            if (!isViewSwitchEnabled) {
                                this._oCardManifestSettings["selectionAnnotationPath"] = oEvent.getParameter("value");
                            } else {
                                this._oCardManifestSettings.tabs[iSelectedKey - 1]["selectionAnnotationPath"] = oEvent.getParameter("value");
                            }
                            break;
                        case "presentationAnnotationPath":
                            if (!isViewSwitchEnabled) {
                                this._oCardManifestSettings["presentationAnnotationPath"] = oEvent.getParameter("value");
                            } else {
                                this._oCardManifestSettings.tabs[iSelectedKey - 1]["presentationAnnotationPath"] = oEvent.getParameter("value");
                            }
                            break;
                        case "annotationPath":
                            if (!isViewSwitchEnabled) {
                                this._oCardManifestSettings["annotationPath"] = oEvent.getParameter("value");
                            } else {
                                this._oCardManifestSettings.tabs[iSelectedKey - 1]["annotationPath"] = oEvent.getParameter("value");
                            }
                            break;
                        case "listType":
                            this._oCardManifestSettings.listType = oEvent.getSource().getSelectedKey();
                            break;
                        case "listFlavor":
                            this._oCardManifestSettings.listFlavor = oEvent.getSource().getSelectedKey();
                            if (sSourceElementId.indexOf("sapOVPLinkListFlavor") !== -1) {
                                //if LinkList flavour then validate combobox
                                this.validateComboBox(this._oCardManifestSettings, "listFlavor");
                            }
                            break;
                        case "KPICheckBox":
                            this._oCardManifestSettings.addKPIHeaderCheckBox = oEvent.getParameter("selected");
                            this.EnableKPIHeaderFields(this._oCardManifestSettings.addKPIHeaderCheckBox);
                            this.validateComboBox(this._oCardManifestSettings, "KPICheckBox", this._oCardManifestSettings.addKPIHeaderCheckBox);
                            break;
                        case "dataPointAnnotationPath":
                            if (!isViewSwitchEnabled) {
                                this._oCardManifestSettings["dataPointAnnotationPath"] = oEvent.getParameter("value");
                            } else {
                                this._oCardManifestSettings.tabs[iSelectedKey - 1]["dataPointAnnotationPath"] = oEvent.getParameter("value");
                            }
                            this.validateComboBox(this._oCardManifestSettings, "dataPointAnnotationPath");
                            break;
                        case "addODataSelectCheckBox":
                            this._oCardManifestSettings.addODataSelectCheckBox = oEvent.getParameter("selected");
                            break;
                        case "requireAppAuthorization":
                            this._oCardManifestSettings.requireAppAuthorization = oEvent.getParameter("value");
                            break;
                        case "kpiAnnotationPath":
                            if (!isViewSwitchEnabled) {
                                this._oCardManifestSettings["kpiAnnotationPath"] = oEvent.getParameter("value");
                            } else {
                                this._oCardManifestSettings.tabs[iSelectedKey - 1]["kpiAnnotationPath"] = oEvent.getParameter("value");
                            }
                            this._oCardManifestSettings.kpiAnnotationPath = oEvent.getParameter("value");
                            break;
                        case "navigationPath":
                            this._oCardManifestSettings.navigationPath = oEvent.getParameter("value");
                            break;
                        case "title":
                        case "subTitle":
                        case "valueSelectionInfo":
                            var bRepeatedText = false;
                            var sFormElementkey = sFormElement + "Key";
                            var sFormElementProperty = sFormElement + "Property";
                            this._oCardManifestSettings[sFormElement] = oEvent.getParameter("value");
                            this._oCardManifestSettings[sFormElementProperty] = oEvent.getParameter("value");
                            for (var key in this._oCardManifestSettings.ai18nProperties) {
                                if (this._oCardManifestSettings.ai18nProperties[key].value === oEvent.getParameter("value")) {
                                    this._oCardManifestSettings[sFormElementkey] = this._oCardManifestSettings.ai18nProperties[key].key;
                                    bRepeatedText = true;
                                    break;
                                }
                            }
                            if (!bRepeatedText) {
                                this._oCardManifestSettings[sFormElementkey] = "";
                            }
                            this.validateComboBox(this._oCardManifestSettings, sFormElement);
                            break;
                        case "existingDatasSource":
                            if (oEvent.mParameters.selected) {
                                settingsUtils.newDataSource = false;
                                this._oCardManifestSettings.newDataSource = false;
                                this.handleValueStateofComboBox("", "datasSourceExisting", "sapOVPDataSourceExistingComboBox", false);
                                this.resetPropertiesVisibility(sSourceElementId, this._oCardManifestSettings);
                                var oCardPropertiesModel = this.getView().getModel();
                                oCardPropertiesModel.setProperty("/datasources", this._oCardManifestSettings.datasourcesFromManifest);
                            }
                            break;
                        case "newDatasSource":
                            if (oEvent.mParameters.selected) {
                                settingsUtils.newDataSource = true;
                                this._oCardManifestSettings.newDataSource = true;
                                this.handleValueStateofComboBox("", "datasSourceNew", "sapOVPDataSourceNewInput", false);
                                this.resetPropertiesVisibility(sSourceElementId, this._oCardManifestSettings);
                                this.getView().setBusy(true);
                                /* eslint-disable */
                                getNewDataSources(settingsUtils.sApplicationId).then(function(oDataSourceCollection){
                                /* eslint-disable */
                                    this.getView().setBusy(false);
                                    var aServiceCollection = oDataSourceCollection.results;
                                    var oCardPropertiesModel = this.getView().getModel();
                                    oCardPropertiesModel.setSizeLimit(aServiceCollection.length);
                                    oCardPropertiesModel.setProperty("/datasources", aServiceCollection);
                                }.bind(this));
                            }
                            break;
                        default :
                            break;
                    }
                }
            }
       },
       /**
        * Reset all the text fields
        */
    //     resetTextFields: function(oCardProperies) {
    //         oCardProperies.title = this._oOriginalCardManifestSettings.title;
    //         oCardProperies.subTitle = this._oOriginalCardManifestSettings.subTitle;
    //         oCardProperies.valueSelectionInfo = this._oOriginalCardManifestSettings.valueSelectionInfo;
    //    },
       /**Reset and hide the UI fields based on selected model, card type and entity set
        */
       resetPropertiesVisibility : function(ElementId , oCardProperies ){
            //Reset all the fields except Data source dropdown
            if (ElementId.indexOf("sapOVPExistingDataSource") !== -1 || ElementId.indexOf("sapOVPNewDataSource") !== -1) {
                this._updateManifestProperties.forEach(function (oProperty) {
                    if (!oProperty.formElementId.includes("sapOVPExistingDataSource") && !oProperty.formElementId.includes("sapOVPNewDataSource")) {
                        if (oProperty.formElementId.includes("sapOVPAddODataSelect")) {
                            oCardProperies[oProperty.formElement] = false;
                        } else {
                            oCardProperies[oProperty.formElement] = "";
                        }
                    }
                });
                oCardProperies.model = "";
            } else if (ElementId.indexOf("sapOVPDataSource") !== -1) {
                this._updateManifestProperties.forEach(function (oProperty) {
                    if (!oProperty.formElementId.includes("sapOVPExistingDataSource") && !oProperty.formElementId.includes("sapOVPNewDataSource") && !ElementId.includes(oProperty.formElementId)) {
                        if (oProperty.formElementId.includes("sapOVPAddODataSelect")) {
                            oCardProperies[oProperty.formElement] = false;
                        } else {
                            oCardProperies[oProperty.formElement] = "";
                        }
                    }
                });
                // this.resetTextFields(oCardProperies);

            } else if (ElementId.indexOf("sapOVPCardType") !== -1) {     //Reset all the fields except Data source and card type dropdown
                this._updateManifestProperties.forEach(function (oProperty) {
                    if (!(oProperty.formElementId.includes("sapOVPDataSource") || oProperty.formElementId.includes("sapOVPCardType"))) {
                        if (oProperty.formElementId.includes("sapOVPAddODataSelect")) {
                            oCardProperies[oProperty.formElement] = false;
                        } else {
                            oCardProperies[oProperty.formElement] = "";
                        }
                    }
                });
                // this.resetTextFields(oCardProperies);
            } else if (ElementId.indexOf("sapOVPEntitySetList") !== -1) {  //Reset all the fields except Data source, card type and entity set dropdown
                var showViewSwitch = this.getView().getModel("visibility").getData().showViewSwitch;
                this._updateManifestProperties.forEach(function (oProperty) {
                    if (!(oProperty.formElementId.includes("sapOVPDataSource") || oProperty.formElementId.includes("sapOVPCardType") ||
                    oProperty.formElementId.includes("sapOVPEntitySetList"))) {
                        //Deselect addODataSelect checkBox
                        if (oProperty.formElementId.includes("sapOVPAddODataSelect")) {
                            oCardProperies[oProperty.formElement] = false;
                        } else {
                            if (!showViewSwitch) {
                                oCardProperies[oProperty.formElement] = "";
                            } else {
                                SettingsConstants.tabFields.forEach(function (field) {
                                    if (field !== 'entitySet' && field !== 'value') {
                                        oCardProperies[field] = "";
                                    }
                                });
                            }
                        }
                    }
                });
                // if (!showViewSwitch) {
                //     this.resetTextFields(oCardProperies);
                // }
            }
            // Resetting Error Handling
            settingsUtils.resetErrorHandling();
            this.setEnablePropertyForResetAndSaveButton(false);
            settingsUtils.setVisibilityForFormElements(oCardProperies);
            /*We need to refresh the model as we are changing the form elements visibility and updating the binding
            **depending on the selected model, once all the visibility values gets updated then in one go we want to refresh the model
            **instead of refreshing the model after each value set
            */
            this.getView().getModel().refresh();
            this.getView().getModel("visibility").refresh();
    }
    });
});
