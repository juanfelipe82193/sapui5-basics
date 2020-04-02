// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ushell/resources",
    "sap/ushell/playground/controller/BaseController"
], function (
    JSONModel,
    resources,
    BaseController
) {
    "use strict";

    var oUshellPage,
        oModel;

    return BaseController.extend("sap.ushell.playground.controller.Page", {
        onInit: function () {
            this.getView().setModel(resources.i18nModel, "i18n");

            oUshellPage = this.getView().byId("playgroundUshellPage");

            oModel = new JSONModel({
                "sections": [],
                "edit": true,
                "enableSectionReordering": true,
                "noSectionsText": "",
                "showNoSectionsText": true,
                "showTitle": true,
                "title": "Page Title"
            });
            this.getView().setModel(oModel);
        },

        genericTilePress: function (oEvent) {
            if (oEvent.getParameter("action") === "Remove") {
                oEvent.getSource().destroy();
            }
        },

        addSection: function (oEvent) {
            var aSections = oModel.getProperty("/sections"),
                iSectionIndex = oEvent.getParameter("index");

            aSections.splice(iSectionIndex, 0, {});

            oModel.setProperty("/sections", aSections);
        },

        onSectionDrop: function (oInfo) {
            var oDragged = oInfo.getParameter("draggedControl"),
                oDropped = oInfo.getParameter("droppedControl"),
                sInsertPosition = oInfo.getParameter("dropPosition"),
                iDragPosition = oUshellPage.indexOfSection(oDragged),
                iDropPosition = oUshellPage.indexOfSection(oDropped);

            if (sInsertPosition === "After") {
                if (iDropPosition < iDragPosition) {
                    iDropPosition++;
                }
            } else if (iDropPosition > iDragPosition) {
                iDropPosition--;
            }

            var aSections = oModel.getProperty("/sections"),
                oSectionToBeMoved = aSections.splice(iDragPosition, 1)[0];

            aSections.splice(iDropPosition, 0, oSectionToBeMoved);
            oModel.setProperty("/sections", aSections);
        },

        onVisualizationDrop: function (oInfo) {
            var oDragged = oInfo.getParameter("draggedControl"),
                oDropped = oInfo.getParameter("droppedControl"),
                sInsertPosition = oInfo.getParameter("dropPosition"),
                oOldSection = oDragged.getParent().getParent().getParent(),
                oNewSection = oDropped.getParent().getParent().getParent(),
                iDragPosition = oOldSection.indexOfVisualization(oDragged),
                iDropPosition = oNewSection.indexOfVisualization(oDropped),
                iDragSectionPosition = oUshellPage.indexOfSection(oOldSection),
                iDropSectionPosition = oUshellPage.indexOfSection(oNewSection);

            if (iDragSectionPosition === iDropSectionPosition) {
                if (iDragPosition < iDropPosition && sInsertPosition === "Before") {
                    iDropPosition--;
                }
            } else if (sInsertPosition === "After") {
                iDropPosition++;
            }

            oOldSection.removeVisualization(oDragged);
            oNewSection.insertVisualization(oDragged, iDropPosition);
        },

        deleteSection: function (oEvent) {
            var oSection = oEvent.getSource(),
                iSectionIndex = oUshellPage.indexOfSection(oSection);

            var aSections = oModel.getProperty("/sections");
            aSections.splice(iSectionIndex, 1);
            oModel.setProperty("/sections", aSections);
        }
    });
});