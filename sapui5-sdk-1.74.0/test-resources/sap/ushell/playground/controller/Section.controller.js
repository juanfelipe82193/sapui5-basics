// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/GenericTile",
    "sap/m/ImageContent",
    "sap/m/library",
    "sap/m/MessageToast",
    "sap/m/TileContent",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/resources",
    "sap/ushell/playground/controller/BaseController"
], function (
    GenericTile,
    ImageContent,
    library,
    MessageToast,
    TileContent,
    JSONModel,
    resources,
    BaseController
) {
    "use strict";

    var TileSizeBehavior = library.TileSizeBehavior;

    var oModel,
        oSection,
        iCounter = 1;

    return BaseController.extend("sap.ushell.playground.controller.Section", {
        onInit: function () {
            oModel = new JSONModel({
                editable: false,
                enableAddButton: true,
                enableDeleteButton: true,
                enableGridBreakpoints: false,
                enableResetButton: true,
                enableShowHideButton: true,
                enableVisualizationReordering: false,
                noVisualizationsText: resources.i18n.getText("Section.NoVisualizationsText"),
                title: "",
                showNoVisualizationsText: false,
                showSection: true,
                sizeBehavior: TileSizeBehavior.Small,
                visualizations: []
            });

            oSection = this.getView().byId("playgroundSection");

            this.getView().setModel(oModel);
        },

        addVisualization: function () {
            MessageToast.show("Add Visualization Button pressed");
            var aVisualizations = oModel.getProperty("/visualizations");

            aVisualizations.push({
                header: "Sales Fulfillment " + iCounter,
                subheader: "abc",
                info: "some text",
                icon: "sap-icon://activities"
            });

            iCounter++;

            oModel.setProperty("/visualizations", aVisualizations);
        },

        resetVisualizations: function () {
            MessageToast.show("Reset Button pressed");
            iCounter = 1;
            oModel.setProperty("/visualizations", []);
        },

        titleChange: function () {
            MessageToast.show("Title was changed");
        },

        _generateVisualizations: function (sId, oContext) {
            return new GenericTile({
                mode: "{= ${mode} || (${icon} ? 'ContentMode' : 'HeaderMode') }",
                header: "{header}",
                subheader: "{subheader}",
                scope: "{= ${/editable} ? 'Actions' : 'Display'}",
                tileContent: [new TileContent({
                    footer: "{info}",
                    content: [new ImageContent({ // Static Tile
                        src: "{icon}"
                    })]
                })],
                sizeBehavior: "{/sizeBehavior}",
                press: function (oEvent) {
                    if (oEvent.getParameter("action") === "Remove") {
                        var aVisualizations = oModel.getProperty("/visualizations");

                        aVisualizations.splice(oSection.indexOfVisualization(oEvent.getSource()), 1);

                        oModel.setProperty("/visualizations", aVisualizations);
                    }
                }
            });
        },

        setSizeBehavior: function (oEvent) {
            var sSetting = oEvent.getParameter("selectedItem").getText();
            oModel.setProperty("/sizeBehavior", TileSizeBehavior[sSetting]);
        },

        deleteSection: function () {
            MessageToast.show("Delete Button pressed");
        },

        reorderVisualizations: function (oEvent) {
            var oDragged = oEvent.getParameter("draggedControl"),
                oDropped = oEvent.getParameter("droppedControl"),
                sInsertPosition = oEvent.getParameter("dropPosition"),
                iDragPosition = oSection.indexOfVisualization(oDragged),
                iDropPosition = oSection.indexOfVisualization(oDropped);

            if (sInsertPosition === "After") {
                if (iDropPosition < iDragPosition) {
                    iDropPosition++;
                }
            } else if (iDropPosition > iDragPosition) {
                iDropPosition--;
            }

            var aVisualizations = oModel.getProperty("/visualizations"),
                oVisualizationModelEntity = aVisualizations.splice(iDragPosition, 1)[0];


            aVisualizations.splice(iDropPosition, 0, oVisualizationModelEntity);
            oModel.setProperty("/visualizations", aVisualizations);
        }

    });
});