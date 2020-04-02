// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ushell/ui/shell/NavigationMiniTile",
    "sap/m/MessageToast"
], function (NavigationMiniTile, MessageToast) {
    "use strict";

    jQuery.sap.initMobile();

    sap.ui.jsview("sap.ushell.playground.view.NavigationMiniTilePlayground", {
        createContent: function (oController) {
            var oPage = this._createPage();
            return oPage;
        },

        _createPage: function () {

            var oData = {
                title: "Related App 1",
                subtitle: "Application view number 2",
                icon: "sap-icon://documents",
                intent: ""
            };

            var oModel = new sap.ui.model.json.JSONModel(oData);

            function addNavigationMiniTileControls (oForm) {
                oForm.addContent(new sap.m.Label({
                    text: "Title"
                }));

                oForm.addContent(new sap.m.Input({
                    width: "16rem",
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
                    text: "Subtitle"
                }));

                oForm.addContent(new sap.m.Input({
                    width: "16rem",
                    placeholder: "Enter subtitle ...",
                    value: {
                        path: "/subtitle",
                        type: new sap.ui.model.type.String()
                    },
                    liveChange: function (oEvt) {
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new sap.m.Label({
                    text: "Icon"
                }));

                oForm.addContent(new sap.m.Select("mini-tile-icon-select", {
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
                        new sap.ui.core.Item("NMT-std-icon", {
                            key: "sap-icon://documents",
                            text: "documents"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://copy",
                            text: "copy"
                        })
                    ],
                    selectedItem: "NMT-std-icon",
                    change: function (oEvt) {
                        oData.icon = oEvt.getParameter("selectedItem").getKey();
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new sap.m.Label({
                    text: "Intent"
                }));

                oForm.addContent(new sap.m.Input({
                    placeholder: "Enter intent ...",
                    value: {
                        path: "/intent",
                        type: new sap.ui.model.type.String()
                    },
                    liveChange: function (oEvt) {
                        oModel.checkUpdate();
                    }
                }));
            }

            var oNavigationMiniTile = new NavigationMiniTile({
                title: "{/title}",
                subtitle: "{/subtitle}",
                icon: "{/icon}",
                intent: "{/intent}",
                visible: true,
                press: function () {
                    MessageToast.show("Intent: " + oData.intent);
                }
            });

            var oNavigationMiniTile2 = new NavigationMiniTile({
                title: "{/title}",
                subtitle: "{/subtitle}",
                icon: "",
                intent: "{/intent}",
                visible: true,
                press: function () {
                    MessageToast.show("Intent: " + oData.intent);
                }
            });

            var oGrid = new sap.ui.layout.Grid({
                defaultSpan: "XL4 L4 M6 S12",
                content: [oNavigationMiniTile, oNavigationMiniTile2]
            });

            var oForm = new sap.ui.layout.form.SimpleForm({
                layout: "ColumnLayout",
                title: "Modify Navigation Mini Tile",
                editable: true
            });

            addNavigationMiniTileControls(oForm);

            var oControlPanel = new sap.m.Panel({
                backgroundDesign: "Solid",
                content: oGrid,
                height: "400px"
            });

            var oPage = new sap.m.Page("navigationMiniTitlePage", {
                title: "Navigation Mini Tile Demo",
                content: [oControlPanel, oForm]
            }).setModel(oModel);

            return oPage;
        }
    });
});