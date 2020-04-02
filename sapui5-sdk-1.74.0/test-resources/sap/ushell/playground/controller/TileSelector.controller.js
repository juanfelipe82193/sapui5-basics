// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/playground/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/applications/PageComposer/controller/TileSelector",
    "sap/ushell/playground/i18n/pageComposer/resources"
], function (
    BaseController,
    JSONModel,
    TileSelector,
    resources
) {
    "use strict";

    var oView,
        aCatalogTree = [
            {
                catalogTitle: "Catalog Title 2",
                tiles: [
                    {
                        vizId: "Tile ID #03",
                        title: "Deficit in Bank Accounts",
                        subTitle: "Subtitle for Deficit in Bank Accounts",
                        iconUrl: "sap-icon://soccor",
                        deviceDesktop: true,
                        deviceTablet: true,
                        devicePhone: false,
                        tileType: "Static Tile",
                        fioriId: "F1234",
                        semanticObject: "Bank",
                        semanticAction: "manage"
                    },
                    {
                        vizId: "Tile ID #04",
                        title: "Travel Expence Report",
                        subTitle: "Subtitle for Travel Expence Report",
                        iconUrl: "sap-icon://travel-expense-report",
                        deviceDesktop: true,
                        deviceTablet: true,
                        devicePhone: true,
                        tileType: "Dynamic Tile",
                        fioriId: "F7777",
                        semanticObject: "Travel",
                        semanticAction: "control"
                    }
                ]
            },
            {
                "catalogTitle": "Catalog Title 1",
                "tiles": [
                    {
                        vizId: "Tile ID #00",
                        title: "Completed Tasks",
                        subTitle: "Subtitle for Completed Tasks",
                        iconUrl: "sap-icon://task",
                        deviceDesktop: true,
                        deviceTablet: false,
                        devicePhone: false,
                        tileType: "Card",
                        fioriId: "F9999",
                        semanticObject: "Tasks",
                        semanticAction: "overview"
                    },
                    {
                        vizId: "Tile ID #01",
                        title: "Erroneous Tasks",
                        subTitle: "Subtitle for Erroneous Tasks",
                        iconUrl: "sap-icon://error",
                        deviceDesktop: false,
                        deviceTablet: true,
                        devicePhone: true,
                        tileType: "Custom Tile",
                        fioriId: "",
                        semanticObject: "Tasks",
                        semanticAction: "show"
                    },
                    {
                        vizId: "Tile ID #02",
                        title: "Family Care",
                        subTitle: "Subtitle for Family Care",
                        iconUrl: "sap-icon://family-care",
                        deviceDesktop: false,
                        deviceTablet: false,
                        devicePhone: true,
                        tileType: "Card",
                        fioriId: "",
                        semanticObject: "Family",
                        semanticAction: "manage"
                    }
                ]
            }
        ],
        aSectionList = [
            { "title": "Section 1", "id": "Section ID: 1" },
            { "title": "Section 2", "id": "Section ID: 2" },
            { "title": "Section 3", "id": "Section ID: 3" }
        ];

    return BaseController.extend("sap.ushell.playground.controller.TileSelector", {
        onInit: function () {
            oView = this.getView();
            oView.setModel(resources.i18nModel, "i18n");
            oView.setModel(new JSONModel({ page: { content: { sections: aSectionList } } }));

            this.TileSelector.init(this);
            this.TileSelector.initTiles({ aTreeOverride: aCatalogTree });
            this.TileSelector.setAddTileHandler(function (aTilesToAdd/*, aSectionsIndexes*/) {
                var aAddedTiles = oView.getModel().getProperty("/added") || [];
                aTilesToAdd.forEach(function (tileToAdd) {
                    aAddedTiles.push(tileToAdd);
                    oView.getModel().setProperty("/added", aAddedTiles);
                });
            });
        },

        getResourceBundle: function () {
            return resources.i18n;
        },

        TileSelector: new TileSelector()
    });
});
