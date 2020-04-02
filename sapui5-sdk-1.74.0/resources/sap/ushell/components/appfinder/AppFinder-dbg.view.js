// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ui/core/ListItem",
    "sap/ui/model/Sorter",
    "sap/m/MultiComboBox",
    "sap/ui/model/BindingMode",
    "sap/m/SearchField",
    "sap/m/FlexBox",
    "sap/m/SegmentedButton",
    "sap/m/SegmentedButtonItem",
    "sap/m/ToggleButton",
    "sap/ushell/ui/launchpad/AccessibilityCustomData",
    "sap/m/Toolbar",
    "sap/m/Page",
    "sap/ushell/resources",
    "sap/ui/Device",
    "sap/ui/core/Component"
], function (
    jQuery,
    ListItem,
    Sorter,
    MultiComboBox,
    BindingMode,
    SearchField,
    FlexBox,
    SegmentedButton,
    SegmentedButtonItem,
    ToggleButton,
    AccessibilityCustomData,
    Toolbar,
    Page,
    resources,
    Device,
    Component
) {
    "use strict";

    sap.ui.jsview("sap.ushell.components.appfinder.AppFinder", {
        createContent: function () {
            this.oController = this.getController();
            this.parentComponent = Component.getOwnerComponentFor(this);
            this.setModel(this.parentComponent.getModel());
            this.enableEasyAccessSAPMenu = this.getModel().getProperty("/enableEasyAccessSAPMenu");
            this.enableEasyAccessUserMenu = this.getModel().getProperty("/enableEasyAccessUserMenu");

            if ((!this.enableEasyAccessSAPMenu && !this.enableEasyAccessUserMenu) || //show only catalog in case both menus are not enabled
                (Device.system.phone || Device.system.tablet && (!Device.system.combi))) {
                this.showEasyAccessMenu = false;
            } else {
                this.showEasyAccessMenu = true;
            }
            var oResourceBundle = resources.i18n;

            this.oPage = new Page("appFinderPage", {
                showHeader: false,
                showSubHeader: false,
                showFooter: false,
                showNavButton: false,
                enableScrolling: false,
                title: {
                    parts: ["/groupContext/title"],
                    formatter: function (title) {
                        return !title ? oResourceBundle.getText("appFinderTitle") : oResourceBundle.getText("appFinder_group_context_title", title);
                    }
                }
            });
            return this.oPage;
        },

        /*
         * This method checks according to the menu id if search is enabled according to the configuration.
         * Empty menu id is treated as 'catalog' as when loading the appFinder if no menu
         * identified as a routing parameter then we load catalog by default
         */
        _showSearch: function (sMenu) {
            var sModelProperty = "enableCatalogSearch";
            if (sMenu === "userMenu") {
                sModelProperty = "enableEasyAccessUserMenuSearch";
            } else if (sMenu === "sapMenu") {
                sModelProperty = "enableEasyAccessSAPMenuSearch";
            }

            return this.getModel().getProperty("/" + sModelProperty);
        },

        /*
         * This method checks according to the menu id if tags is enabled according to the configuration.
         * Empty menu id is treated as 'catalog' as when loading the appFinder if no menu
         * identified as a routing parameter then we load catalog by default
         */
        _showSearchTag: function (sMenu) {
            if (sMenu === "userMenu" || sMenu === "sapMenu") {
                return false;
            }
            return this.getModel().getProperty("/enableCatalogTagFilter");
        },

        createSubHeader: function () {
            this.oToolbar = new Toolbar("appFinderSubHeader", {
            });

            if (Device.system.desktop) {
                this.oToolbar.addEventDelegate({
                    onsapskipback: function (oEvent) {
                        oEvent.preventDefault();
                        sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                        sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                    },
                    onsapskipforward: function (oEvent) {
                        var openCloseSplitAppButton = sap.ui.getCore().byId("openCloseButtonAppFinderSubheader");
                        if (openCloseSplitAppButton.getVisible() && !openCloseSplitAppButton.getPressed()) {
                            oEvent.preventDefault();
                            sap.ushell.components.ComponentKeysHandler.setFocusOnCatalogTile();
                        }
                    },
                    onAfterRendering: function () {
                        jQuery("#catalog-button").attr("accesskey", "a");
                    }
                });
            }

            this.oToolbar.addCustomData(new AccessibilityCustomData({
                key: "role",
                value: "heading",
                writeToDom: true
            }));

            this.oToolbar.addCustomData(new AccessibilityCustomData({
                key: "aria-level",
                value: "2",
                writeToDom: true
            }));

            this.oToolbar.addStyleClass("sapUshellAppFinderHeader");
            this.oPage.setSubHeader(this.oToolbar);
            this.oPage.setShowSubHeader(true);

            if (!this.openCloseSplitAppButton) {
                // create toggle button for open/close the master part of the splitApp control
                this.openCloseSplitAppButton = new ToggleButton("openCloseButtonAppFinderSubheader", {
                    icon: "sap-icon://menu2",
                    visible: "{/openCloseSplitAppButtonVisible}",
                    pressed: "{/openCloseSplitAppButtonToggled}",
                    press: function (oEvent) {
                        this.getController().oSubHeaderModel.setProperty("/openCloseSplitAppButtonToggled", oEvent.getSource().getPressed());
                        this.openCloseSplitAppButton.setTooltip(oEvent.getParameter("pressed") ?
                            resources.i18n.getText("ToggleButtonHide") :
                            resources.i18n.getText("ToggleButtonShow"));
                    }.bind(this),
                    tooltip: resources.i18n.getText("ToggleButtonShow")
                });

                if (Device.system.desktop) {
                    this.openCloseSplitAppButton.addEventDelegate({
                        onsaptabprevious: function (oEvent) {
                            oEvent.preventDefault();
                            sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                            sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                        }
                    });
                }

                this.openCloseSplitAppButton.setModel(this.getController().oSubHeaderModel);
                this.oToolbar.addContent(this.openCloseSplitAppButton);
            }
        },

        updateSubHeader: function (sMenu, bEasyAccess) {
            var segmentedButtons,
                searchControl;

            // clear content from toolbar
            this.oToolbar.removeAllContent();
            this.oToolbar.addContent(this.openCloseSplitAppButton);

            // bEasyAccess means that we need the segmented button easy access menu entries
            if (bEasyAccess) {
                segmentedButtons = this.createSegmentedButtons(sMenu);
                this.oPage.addStyleClass("sapUshellAppFinderWithEasyAccess");
                this.oToolbar.addContent(segmentedButtons);
            }

            // render the search control in the sub-header
            if (this._showSearch(sMenu)) {
                searchControl = this.createSearchControl(sMenu);
                this.oToolbar.addContent(searchControl);
            }
            // make sure we always update the current menu when updating the sub header
            this.getController()._updateCurrentMenuName(sMenu);
        },

        createSegmentedButtons: function (sMenu) {
            var oController,
                oResourceBundle,
                segmentedButtonsArray,
                aButtons,
                button,
                i;

            if (this.segmentedButton) {
                this.segmentedButton.setSelectedButton(sMenu);
                return this.segmentedButton;
            }

            oController = this.getController();
            oResourceBundle = resources.i18n;
            segmentedButtonsArray = [];
            segmentedButtonsArray.push(new SegmentedButtonItem("catalog", {
                text: oResourceBundle.getText("appFinderCatalogTitle"),
                press: function (oEvent) {
                    oController.onSegmentButtonClick(oEvent);
                }
            }));
            if (this.enableEasyAccessUserMenu) {
                segmentedButtonsArray.push(new SegmentedButtonItem("userMenu", {
                    text: oResourceBundle.getText("appFinderUserMenuTitle"),
                    press: function (oEvent) {
                        oController.onSegmentButtonClick(oEvent);
                    }
                }));
            }
            if (this.enableEasyAccessSAPMenu) {
                segmentedButtonsArray.push(new SegmentedButtonItem("sapMenu", {
                    text: oResourceBundle.getText("appFinderSapMenuTitle"),
                    press: function (oEvent) {
                        oController.onSegmentButtonClick(oEvent);
                    }
                }));
            }
            this.segmentedButton = new SegmentedButton("appFinderSegmentedButtons", {
                items: segmentedButtonsArray
            });

            if (Device.system.desktop) {
                this.segmentedButton.addEventDelegate({
                    onsaptabprevious: function (oEvent) {
                        var openCloseSplitAppButton = sap.ui.getCore().byId("openCloseButtonAppFinderSubheader");
                        if (!openCloseSplitAppButton.getVisible()) {
                            oEvent.preventDefault();
                            sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                            sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                        }
                    }
                });
            }

            this.segmentedButton.setSelectedButton(sMenu);
            aButtons = this.segmentedButton.getItems();
            for (i = 0; i < aButtons.length; i++) {
                button = aButtons[i];
                button.addCustomData(new AccessibilityCustomData({
                    key: "aria-controls",
                    value: button.getId() + "View",
                    writeToDom: true
                }));
            }

            return this.segmentedButton;
        },

        _handleSearch: function () {
            // invoke the search handler on the controller
            this.getController().searchHandler.apply(this.getController(), arguments);
            // select text right after search executed
            jQuery("#appFinderSearch input").select();
        },

        createSearchControl: function (sMenu) {
            if (!this.oAppFinderSearchContainer) {
                this.oAppFinderSearchContainer = new FlexBox("appFinderSearchContainer");
            }

            this.oAppFinderSearchContainer.removeAllItems();

            if (sMenu === "catalog" && this._showSearchTag("catalog")) {
                this.createTagControl();
                this.oAppFinderSearchContainer.addItem(this.oAppFinderTagFilter);
            }

            if (!this.oAppFinderSearchControl) {
                this.oAppFinderSearchControl = new SearchField("appFinderSearch", {
                    search: this._handleSearch.bind(this),
                    value: {
                        path: "subHeaderModel>/search/searchTerm",
                        mode: BindingMode.OneWay
                    }
                }).addStyleClass("help-id-catalogSearch"); // xRay help ID;

                this.oAppFinderSearchControl.addCustomData(new AccessibilityCustomData({
                    key: "aria-controls",
                    value: "",
                    writeToDom: true
                }));

                if (Device.system.desktop) {
                    this.oAppFinderSearchControl.addEventDelegate({
                        onsaptabnext: function (oEvent) {
                            var openCloseSplitAppButton = sap.ui.getCore().byId("openCloseButtonAppFinderSubheader");
                            if (openCloseSplitAppButton.getVisible() && !openCloseSplitAppButton.getPressed()) {
                                oEvent.preventDefault();
                                sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                                sap.ushell.components.ComponentKeysHandler.setFocusOnCatalogTile();
                            }
                        }
                    });
                }
            }
            this.oAppFinderSearchContainer.addItem(this.oAppFinderSearchControl);

            this._updateSearchWithPlaceHolder(sMenu);
            return this.oAppFinderSearchContainer;
        },

        _updateSearchWithPlaceHolder: function (sMenu) {
            var sSearchPlaceHolderKey = "";
            if (sMenu === "catalog") {
                sSearchPlaceHolderKey = "EasyAccessMenu_SearchPlaceHolder_Catalog";
            } else if (sMenu === "userMenu") {
                sSearchPlaceHolderKey = "EasyAccessMenu_SearchPlaceHolder_UserMenu";
            } else if (sMenu === "sapMenu") {
                sSearchPlaceHolderKey = "EasyAccessMenu_SearchPlaceHolder_SAPMenu";
            }

            if (sSearchPlaceHolderKey && this.oAppFinderSearchControl) {
                this.oAppFinderSearchControl.setPlaceholder(resources.i18n.getText(sSearchPlaceHolderKey));
                this.oAppFinderSearchControl.setTooltip(resources.i18n.getText(sSearchPlaceHolderKey));
            }
        },

        createTagControl: function () {
            if (this.oAppFinderTagFilter) {
                return this.oAppFinderTagFilter;
            }
            this.oAppFinderTagFilter = new MultiComboBox("appFinderTagFilter", {
                selectedKeys: {
                    path: "subHeaderModel>/tag/selectedTags"
                },
                tooltip: "{i18n>catalogTilesTagfilter_tooltip}",
                placeholder: "{i18n>catalogTilesTagfilter_HintText}",
                visible: {
                    path: "/tagList",
                    formatter: function (aTagList) {
                        return aTagList.length > 0;
                    }
                },
                // Use catalogs model as a demo content until the real model is implemented
                items: {
                    path: "/tagList",
                    sorter: new Sorter("tag", false, false),
                    template: new ListItem({
                        text: "{tag}",
                        key: "{tag}"
                    })
                },
                selectionChange: [this.oController.onTagsFilter, this.oController]
            }).addStyleClass("help-id-catalogTagFilter"); // xRay help ID;

            return this.oAppFinderTagFilter;
        },

        getControllerName: function () {
            return "sap.ushell.components.appfinder.AppFinder";
        }
    });
});
