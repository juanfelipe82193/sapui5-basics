// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ui/core/ListItem",
    "sap/m/Select",
    "sap/m/library",
    "sap/m/FlexBox",
    "sap/ui/core/HTML",
    "sap/m/Label",
    "sap/ushell/ui/launchpad/Tile",
    "sap/m/NumericContent",
    "sap/m/TileContent",
    "sap/m/GenericTile",
    "sap/ui/model/BindingMode",
    "sap/m/Input",
    "sap/ushell/resources"
], function (
    jQuery,
    ListItem,
    Select,
    mobileLibrary,
    FlexBox,
    HTML,
    Label,
    Tile,
    NumericContent,
    TileContent,
    GenericTile,
    BindingMode,
    Input,
    resources
) {
    "use strict";

    // shortcut for sap.m.FlexRendertype
    var FlexRendertype = mobileLibrary.FlexRendertype;

    // shortcut for sap.m.FlexJustifyContent
    var FlexJustifyContent = mobileLibrary.FlexJustifyContent;

    // shortcut for sap.m.FlexAlignItems
    var FlexAlignItems = mobileLibrary.FlexAlignItems;

    /* global hasher */

    sap.ui.jsview("sap.ushell.ui.footerbar.SaveAsTile", {
        getControllerName: function () {
            return "sap.ushell.ui.footerbar.SaveAsTile";
        },

        createContent: function (oController) {
            this.oResourceBundle = resources.i18n;
            this.viewData = this.getViewData() || {};
            this.appData = this.viewData.appData || {};
            this.oTitleInput = new Input("bookmarkTitleInput", {
                tooltip: this.oResourceBundle.getText("bookmarkDialogoTitle_tooltip"),
                value: {
                    path: "/title",
                    mode: BindingMode.TwoWay
                }
            }).addStyleClass("sapUshellInputField");
            this.oTitleInput.addAriaLabelledBy("titleLbl");
            this.oSubTitleInput = new Input("bookmarkSubTitleInput", {
                tooltip: this.oResourceBundle.getText("bookmarkDialogoSubTitle_tooltip"),
                value: {
                    path: "/subtitle",
                    mode: BindingMode.TwoWay
                }
            }).addStyleClass("sapUshellInputField");
            this.oSubTitleInput.addAriaLabelledBy("subtitleLbl");
            this.oInfoInput = new Input("bookmarkInfoInput", {
                tooltip: this.oResourceBundle.getText("bookmarkDialogoDescription_tooltip"),
                value: {
                    path: "/info",
                    mode: BindingMode.TwoWay
                },
                visible: "{/showInfo}"
            }).addStyleClass("sapUshellInputField");
            this.oInfoInput.addAriaLabelledBy("infoLbl");

            var tileInitSettings = {
                numberValue: "{/numberValue}",
                title: "{/title}",
                subtitle: "{/subtitle}",
                info: "{/info}",
                icon: "{/icon}",
                infoState: "{/infoState}",
                numberFactor: "{/numberFactor}",
                numberUnit: "{/numberUnit}",
                numberDigits: "{/numberDigits}",
                numberState: "{/numberState}",
                stateArrow: "{/stateArrow}",
                targetURL: "{/targetURL}",
                keywords: "{/keywords}",
                sizeBehavior: "{/sizeBehavior}"
            },
                fnParseTileValueColor = function (tileValueColor) {
                    var returnValue = tileValueColor;

                    switch (tileValueColor) {
                        case "Positive":
                            returnValue = "Good";
                            break;
                        case "Negative":
                            returnValue = "Critical";
                            break;
                    }

                    return returnValue;
                };

            var oTile, serviceUrl;
            // If the viewData contains 'serviceUr', it means we need to instantiate GenericTile as 'dynamic'.
            if (this.viewData.serviceUrl) {
                oTile = new GenericTile({
                    header: tileInitSettings.title,
                    subheader: tileInitSettings.subtitle,
                    sizeBehavior: tileInitSettings.sizeBehavior,
                    size: "Auto",
                    tileContent: [new TileContent({
                        size: "Auto",
                        footer: tileInitSettings.info,
                        unit: tileInitSettings.numberUnit,
                        // We'll utilize NumericContent for the "Dynamic" content.
                        content: [new NumericContent({
                            scale: tileInitSettings.numberFactor,
                            value: tileInitSettings.numberValue,
                            truncateValueTo: 5, // Otherwise, The default value is 4.
                            valueColor: fnParseTileValueColor(tileInitSettings.numberState),
                            indicator: tileInitSettings.stateArrow,
                            icon: tileInitSettings.icon,
                            width: "100%"
                        })]
                    })]
                });
                serviceUrl = (typeof (this.viewData.serviceUrl) === "function") ? this.viewData.serviceUrl() : this.viewData.serviceUrl;
                oController.calcTileDataFromServiceUrl(serviceUrl);
            } else {
                oTile = new GenericTile({
                    header: tileInitSettings.title,
                    subheader: tileInitSettings.subtitle,
                    sizeBehavior: tileInitSettings.sizeBehavior,
                    size: "Auto",
                    tileContent: [new TileContent({
                        size: "Auto",
                        footer: tileInitSettings.info,
                        content: new NumericContent({
                            icon: tileInitSettings.icon,
                            value: " ", // The default value is 'o', That's why we instantiate with empty space.
                            width: "100%"
                        })
                    })]
                });
            }
            this.setTileView(oTile);

            var tileWrapper = new Tile({
                "long": false,
                tileViews: [oTile],
                afterRendering: function (/*oEvent*/) {
                    var jqTile = jQuery(this.getDomRef()),
                        jqGenericTile = jqTile.find(".sapMGT");

                    // remove focus from tile
                    jqGenericTile.removeAttr("tabindex");
                }
            }).addStyleClass("sapUshellBookmarkFormPreviewTileMargin");

            var oPreviewBackgroundElement = new HTML("previewBackgroundElement", {
                content: "<div class='sapUshellShellBG sapContrastPlus sapUiStrongBackgroundColor'></div>"
            });

            var hbox = new FlexBox("saveAsTileHBox", {
                items: [oPreviewBackgroundElement, tileWrapper],
                alignItems: FlexAlignItems.Center,
                justifyContent: FlexJustifyContent.Center,
                renderType: FlexRendertype.Bare,
                visible: "{/showPreview}"
            }).addStyleClass("sapUshellShellBG").addStyleClass("sapUshellBookmarkFormPreviewBoxBottomMargin");

            this.oGroupsSelect = new Select("groupsSelect", {
                tooltip: this.oResourceBundle.getText("bookmarkDialogoGroup_tooltip"),
                items: {
                    path: "/groups",
                    template: new ListItem({ text: "{title}" })
                },
                width: "100%",
                visible: {
                    parts: ["/showGroupSelection", "/groups"],
                    formatter: function (bShowGroupSelection, aGroups) {
                        if (bShowGroupSelection && !(aGroups && aGroups.length)) {
                            this.oController.loadPersonalizedGroups();
                        }
                        return bShowGroupSelection;
                    }.bind(this)
                }
            });
            this.oGroupsSelect.addAriaLabelledBy("groupLbl");

            var oPreview = new Label("previewLbl", {
                text: this.oResourceBundle.getText("previewFld"),
                labelFor: hbox,
                visible: "{/showPreview}"
            });

            var oTitle = new Label("titleLbl", {
                required: true,
                text: " " + this.oResourceBundle.getText("titleFld"),
                labelFor: this.oTitleInput
            }).setLabelFor("bookmarkTitleInput");

            var oSubTitle = new Label("subtitleLbl", {
                text: this.oResourceBundle.getText("subtitleFld"),
                labelFor: this.oSubTitleInput
            }).setLabelFor("bookmarkSubTitleInput");

            var oInfo = new Label("infoLbl", {
                text: this.oResourceBundle.getText("tileSettingsDialog_informationField"),
                labelFor: this.oInfoInput,
                visible: "{/showInfo}"
            }).setLabelFor("bookmarkInfoInput");

            var oGroupsLabel = new Label("groupLbl", {
                text: this.oResourceBundle.getText("GroupListItem_label"),
                labelFor: this.oGroupsSelect,
                visible: "{/showGroupSelection}"
            }).setLabelFor("groupsSelect");

            return [
                oPreview,
                hbox,
                oTitle,
                this.oTitleInput,
                oSubTitle,
                this.oSubTitleInput,
                oInfo,
                this.oInfoInput,
                oGroupsLabel,
                this.oGroupsSelect
            ];
        },

        getTitleInput: function () {
            return this.oTitleInput;
        },

        getTileView: function () {
            return this.tileView;
        },

        setTileView: function (oTileView) {
            this.tileView = oTileView;
        },

        getBookmarkTileData: function () {
            var selectedGroupData;
            if (this.oGroupsSelect && this.oGroupsSelect.getSelectedItem()) {
                selectedGroupData = this.oGroupsSelect.getSelectedItem().getBindingContext().getObject();
            }

            // customUrl - Will be used to navigate from the new tile.
            var sURL;
            // in case customUrl is supplied
            if (this.viewData.customUrl) {
                // check if a function was passed as customUrl
                if (typeof (this.viewData.customUrl) === "function") {
                    // resolve the function to get the value for the customUrl
                    sURL = this.viewData.customUrl();
                } else {
                    // Provided as a string
                    // In case customURL will be provided (as a string) containing an hash part, it must be supplied non-encoded,
                    // or it will be resolved with duplicate encoding and can cause nav errors.
                    sURL = this.viewData.customUrl;
                }
            } else {
                // In case an hash exists, hasher.setHash() is used for navigation. It also adds encoding.
                // Otherwise use window.location.href
                sURL = hasher.getHash() ? ("#" + hasher.getHash()) : window.location.href;
            }

            return {
                title: this.oTitleInput.getValue() ? this.oTitleInput.getValue().substring(0, 256).trim() : "",
                subtitle: this.oSubTitleInput.getValue() ? this.oSubTitleInput.getValue().substring(0, 256).trim() : "",
                url: sURL,
                icon: this.getModel().getProperty("/icon"),
                info: this.oInfoInput.getValue() ? this.oInfoInput.getValue().substring(0, 256).trim() : "",
                numberUnit: this.viewData.numberUnit,
                serviceUrl: typeof (this.viewData.serviceUrl) === "function" ? this.viewData.serviceUrl() : this.viewData.serviceUrl,
                serviceRefreshInterval: this.viewData.serviceRefreshInterval,
                group: selectedGroupData,
                keywords: this.viewData.keywords
            };
        }
    });
});
