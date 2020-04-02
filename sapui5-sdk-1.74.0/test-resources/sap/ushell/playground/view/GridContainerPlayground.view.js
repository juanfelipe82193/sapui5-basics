// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ushell/ui/launchpad/GridContainer",
    "sap/ushell/ui/launchpad/Tile",
    "sap/f/library",
    "sap/ui/integration/widgets/Card",
    "sap/ushell/playground/mock/ContainerMock",
    "sap/ushell/playground/mock/UserFrequentsMock",
    "sap/ushell/playground/mock/UserRecentsMock",
    "sap/ushell/playground/test/integration/UserFrequentsCardManifest",
    "sap/ushell/playground/test/integration/UserRecentsCardManifest"
], function (GridContainer, Tile, Library, Card, ContainerMock, UserFrequentsMock, UserRecentsMock, UserFrequentsCardManifest, UserRecentsCardManifest) {
    "use strict";

    jQuery.sap.initMobile();
    sap.ui.jsview("sap.ushell.playground.view.GridContainerPlayground", {
        createContent: function (oController) {
            sap.ushell.Container = new ContainerMock();
            sap.ushell.Container.registerMockService("UserFrequents", UserFrequentsMock);
            sap.ushell.Container.registerMockService("UserRecents", UserRecentsMock);

            var oPage = this._createPage();
            return oPage;
        },
        _createPage: function () {
            var oData = {
                headerText: "headerText",
                showHeader: true,

                iconDisplayShape: Library.AvatarShape.Circle,
                iconSrc: "sap-icon://email",
                iconInitials: "",
                sRows: "span 3",
                sCols: "span 3"
            };

            var oModel = new sap.ui.model.json.JSONModel(oData);

            var oGenericTile = new Tile({
                tileViews: new sap.m.GenericTile ({
                    header: "Generic tile",
                    subheader: "Inside of a tile",
                    headerImage: "{/iconSrc}"
                })
            });

            var oStaticTile1 = new Tile({
                tileViews: new sap.ushell.ui.tile.StaticTile ({
                    title: "Static Tile",
                    subtitle: "Inside of a tile",
                    infoState: "Neutral",
                    info: "0 days running without bugs",
                    icon: "{/iconSrc}",
                    targetURL: "#Action-todefaultapp"
                })
            });

            var oStaticTile2 = new Tile({
                tileViews: new sap.ushell.ui.tile.StaticTile ({
                    title: "Long Static Tile",
                    subtitle: "Inside of a tile",
                    infoState: "Neutral",
                    info: "0 days running without bugs",
                    icon: "{/iconSrc}",
                    targetURL: "#Action-todefaultapp"
                }),
                long: true
            });

            var oRecentCard = new Card({
                manifest: UserRecentsCardManifest
            });

            var oFrequentCard = new Card({
                manifest: UserFrequentsCardManifest
            });

            var oGridContainer = new GridContainer({
                headerText: "{/headerText}",
                showHeader: "{/showHeader}",
                tiles: [
                    oGenericTile,
                    oStaticTile1,
                    oStaticTile2,
                    oRecentCard,
                    oFrequentCard
                ]
            });

            var oGrid = new sap.ui.layout.Grid({
                defaultSpan: "XL4 L4 M6 S12",
                content: [oGridContainer]
            });

            var oGridContainerConfigurationForm = new sap.ui.layout.form.SimpleForm({
                layout: "ColumnLayout",
                title: "Modify Grid Container",
                editable: true,
                content: [
                    new sap.m.Label({
                        text: "Grid Container Header Text"
                    }),
                    new sap.m.Input({
                        type: sap.m.InputType.Text,
                        placeholder: "Enter grid container headerText ..."
                    }).bindValue("/headerText"),
                    new sap.m.Label({
                        text: "Grid Container Show Header"
                    }),
                    new sap.m.Switch({
                        state: {
                            path: "/showHeader",
                            type: new sap.ui.model.type.Boolean()
                        }
                    })
                ]
            });

            var oGridItemConfigurationForm = new sap.ui.layout.form.SimpleForm({
                layout: "ColumnLayout",
                title: "Modify Items",
                editable: true,
                content: [
                    new sap.m.Label({
                        text: "Items Icon Source"
                    }),
                    new sap.m.Input({
                        type: sap.m.InputType.Text,
                        placeholder: "Enter icon source ..."
                    }).bindValue("/iconSrc"),
                    new sap.m.Label({
                        text: "Items Icon Initials"
                    }),
                    new sap.m.Input({
                        type: sap.m.InputType.Text,
                        placeholder: "Enter icon initials ..."
                    }).bindValue("/iconInitials"),
                    new sap.m.Label({
                        text: "Items Icon Display Shape"
                    }),
                    new sap.m.Select({
                        items: [
                            new sap.ui.core.Item({
                                key: Library.AvatarShape.Circle,
                                text: "Circle"
                            }),
                            new sap.ui.core.Item({
                                key: Library.AvatarShape.Square,
                                text: "Square"
                            })
                        ],
                        change: function (oEvt) {
                            oData.iconDisplayShape = oEvt.getParameter("selectedItem").getKey();
                            oModel.checkUpdate();
                        }.bind(this)
                    })
                ]
            });

            var oControlPanel = new sap.m.Panel({
                backgroundDesign: "Solid",
                content: oGrid,
                height: "400px"
            });

            var oPage = new sap.m.Page("GridContainerPage", {
                title: "Grid Container Demo",
                content: [oControlPanel, oGridContainerConfigurationForm, oGridItemConfigurationForm]
            }).setModel(oModel);

            return oPage;
        }
    });
});