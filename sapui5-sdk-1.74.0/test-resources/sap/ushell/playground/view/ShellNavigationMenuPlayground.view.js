// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ushell/ui/shell/ShellNavigationMenu",
    "sap/ushell/ui/shell/NavigationMiniTile",
    "sap/m/StandardListItem"
], function (ShellNavigationMenu, NavigationMiniTile, StandardListItem) {
    "use strict";

    jQuery.sap.initMobile();

    sap.ui.jsview("sap.ushell.playground.view.ShellNavigationMenuPlayground", {
        createContent: function (oController) {
            var oPage = this._createPage();
            return oPage;
        },

        _createPage: function () {
            var oData = {
                title: "",
                icon: "",
                showTitle: false,
                showRelatedApps: true,
                itemcount: 0,
                itemIcon: "sap-icon://home",
                itemText: "Home",
                miniTileCount: 0,
                miniTileHeader: "Related App 1",
                tileIcon: "sap-icon://documents"
            };

            var oModel = new sap.ui.model.json.JSONModel(oData);

            function checkAggregationUpdate () {
                var tmp = oData.title;
                oData.title = oData.title + "something";
                oModel.checkUpdate();

                oData.title = tmp;
                oModel.checkUpdate();
            }

            function addShellNavigaionMenuControls (oForm) {
                oForm.addContent(new sap.m.Label({
                    text: "Title"
                }));

                oForm.addContent(new sap.m.Input({
                    placeholder: "Enter title ...",
                    value: {
                        path: "/title",
                        type: new sap.ui.model.type.String()
                    },
                    liveChange: function (oEvt) {
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new sap.m.Label({
                    text: "Icon"
                }));

                oForm.addContent(new sap.m.Select("navigation-menu-icon-select", {
                    items: [
                        new sap.ui.core.Item({
                            key: "",
                            text: "none"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://world",
                            text: "world"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://customer-financial-fact-sheet",
                            text: "customer-financial-fact-sheet"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://delete",
                            text: "delete"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://refresh",
                            text: "refresh"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://email",
                            text: "email"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://hide",
                            text: "hide"
                        }),
                        new sap.ui.core.Item("SNV-home-icon", {
                            key: "sap-icon://home",
                            text: "home"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://documents",
                            text: "documents"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://copy",
                            text: "copy"
                        })
                    ],
                    change: function (oEvt) {
                        oData.icon = oEvt.getParameter("selectedItem").getKey();
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new sap.m.Label({
                    text: "Show title"
                }));

                oForm.addContent(new sap.m.Switch("showTitleSwitch", {
                    state: {
                        path: "/showTitle",
                        type: new sap.ui.model.type.Boolean()
                    }
                }));

                oForm.addContent(new sap.m.Label({
                    text: "Show related apps"
                }));

                oForm.addContent(new sap.m.Switch("showRelatedApps", {
                    state: {
                        path: "/showRelatedApps",
                        type: new sap.ui.model.type.Boolean()
                    }
                }));
            }

            function addListItemControls (oForm) {
                oForm.addContent(new sap.m.Label({
                    text: "List-Item Text"
                }));

                oForm.addContent(new sap.m.Input({
                    placeholder: "Enter text ...",
                    value: {
                        path: "/itemText",
                        type: new sap.ui.model.type.String()
                    },
                    liveChange: function (oEvt) {
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new sap.m.Label({
                    text: "List-Item Icon"
                }));

                oForm.addContent(new sap.m.Select("navigation-menu-item-select", {
                    items: [
                        new sap.ui.core.Item({
                            key: "",
                            text: "none"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://world",
                            text: "world"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://customer-financial-fact-sheet",
                            text: "customer-financial-fact-sheet"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://delete",
                            text: "delete"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://refresh",
                            text: "refresh"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://email",
                            text: "email"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://hide",
                            text: "hide"
                        }),
                        new sap.ui.core.Item("SNM-std-list-icon", {
                            key: "sap-icon://home",
                            text: "home"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://documents",
                            text: "documents"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://copy",
                            text: "copy"
                        })
                    ],
                    selectedItem: "SNM-std-list-icon",
                    change: function (oEvt) {
                        oData.itemIcon = oEvt.getParameter("selectedItem").getKey();
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new sap.m.Label({
                    text: "Add or Remove a Item"
                }));

                oForm.addContent(new sap.m.Button({
                    text: "Add Item",
                    press: function (oEvt) {
                        oData.itemcount++;
                        oShellNavigationMenu.addItem(new StandardListItem({
                            type: sap.m.ListType.Inactive, //"Active",
                            title: oData.itemText,
                            icon: oData.itemIcon
                        })).addStyleClass("sapUshellNavigationMenuListItems");
                        checkAggregationUpdate();
                    }
                }));

                oForm.addContent(new sap.m.Button({
                    text: "Remove Item",
                    type: sap.m.ButtonType.Reject,
                    press: function (oEvt) {
                        if (oData.itemcount > 0) {
                            oData.itemcount--;
                        } else {
                            oData.itemcount = 0;
                        }
                        oShellNavigationMenu.removeItem(oData.itemcount);
                        checkAggregationUpdate();
                    }
                }));
            }

            function addMiniTileControls (oForm) {
                oForm.addContent(new sap.m.Label({
                    text: "Mini-Tile Header"
                }));

                oForm.addContent(new sap.m.Input({
                    placeholder: "Enter mini-tile header ...",
                    value: {
                        path: "/miniTileHeader",
                        type: new sap.ui.model.type.String()
                    },
                    liveChange: function (oEvt) {
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new sap.m.Label({
                    text: "Mini-Tile Icon"
                }));

                oForm.addContent(new sap.m.Select("navigation-menu-mini-tile-icon-select", {
                    items: [
                        new sap.ui.core.Item({
                            key: "",
                            text: "none"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://world",
                            text: "world"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://customer-financial-fact-sheet",
                            text: "customer-financial-fact-sheet"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://delete",
                            text: "delete"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://refresh",
                            text: "refresh"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://email",
                            text: "email"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://hide",
                            text: "hide"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://home",
                            text: "home"
                        }),
                        new sap.ui.core.Item("SNV-std-mt-icon", {
                            key: "sap-icon://documents",
                            text: "documents"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://copy",
                            text: "copy"
                        })
                    ],
                    selectedItem: "SNV-std-mt-icon",
                    change: function (oEvt) {
                        oData.tileIcon = oEvt.getParameter("selectedItem").getKey();
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new sap.m.Label({
                    text: "Add or Remove a Mini-Tile"
                }));

                oForm.addContent(new sap.m.Button({
                    text: "Add Mini-Tile",
                    press: function (oEvt) {
                        oData.miniTileCount++;
                        oShellNavigationMenu.addMiniTile(new NavigationMiniTile({
                            title: oData.miniTileHeader,
                            icon: oData.tileIcon
                        }));
                        checkAggregationUpdate();
                    }
                }));

                oForm.addContent(new sap.m.Button({
                    text: "Remove Mini-Tile",
                    type: sap.m.ButtonType.Reject,
                    press: function (oEvt) {
                        if (oData.miniTileCount > 0) {
                            oData.miniTileCount -= 1;
                        } else {
                            oData.miniTileCount = 0;
                        }
                        oShellNavigationMenu.removeMiniTile(oData.miniTileCount);
                        checkAggregationUpdate();
                    }
                }));
            }

            var oShellNavigationMenu = new ShellNavigationMenu({
                title: "{/title}",
                icon: "{/icon}",
                showTitle: "{/showTitle}",
                showRelatedApps: "{/showRelatedApps}",
                visible: true
            });

            oShellNavigationMenu._createItemsList();
            oShellNavigationMenu._createMiniTilesBox();
            oShellNavigationMenu._beforeOpen();
            oShellNavigationMenu._afterOpen();
            oShellNavigationMenu._extendInnerControlsForAccKeyboard();
            oShellNavigationMenu.onAfterRendering();

            var oGrid = new sap.ui.layout.Grid({
                width: "1100px",
                content: [oShellNavigationMenu]
            });

            var oForm = new sap.ui.layout.form.SimpleForm({
                layout: "ColumnLayout",
                editable: true,
                title:"Modify Shell Navigation Menu"
            });

            addShellNavigaionMenuControls(oForm);
            addListItemControls(oForm);
            addMiniTileControls(oForm);

            var oControlPanel = new sap.m.Panel({
                backgroundDesign: "Solid",
                content: oGrid,
                height: "400px"
            });

            var oPage = new sap.m.Page("shellNavigationMenuPage", {
                title: "Shell Navigation Menu Demo",
                content: [oControlPanel, oForm]
            }).setModel(oModel);

            return oPage;
        }
    });
});