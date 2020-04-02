// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define(function () {
	"use strict";

    /**
     * @name AnchorItem renderer.
     * @static
     * @private
     */
    var AnchorItemRenderer = {};

    AnchorItemRenderer.render = function (rm, oAnchorItem) {
        var oDashboardGroupsModel = oAnchorItem.getModel(),
            sItemGroupModelPath = oAnchorItem.getBindingContext().getPath(),
            oItemGroupModelObject = oDashboardGroupsModel.getProperty(sItemGroupModelPath),
            sItemGroupId = oItemGroupModelObject.groupId,
            bSelected = oAnchorItem.getSelected();

        rm.write("<li");
        rm.writeControlData(oAnchorItem);
        rm.writeAttribute("modelGroupId", sItemGroupId);
        rm.writeAccessibilityState(oAnchorItem, {
            role: "option",
            selected: bSelected
        });
        rm.addClass("sapUshellAnchorItem");
        // If help is enabled we write special classes into the DOM
        if (oAnchorItem.getWriteHelpId()) {
            var sClassToAdd = oAnchorItem.getDefaultGroup() ? "help-id-homeAnchorNavigationBarItem" : "help-id-anchorNavigationBarItem";
            rm.addClass(sClassToAdd);
            rm.writeAttribute("data-help-id", oAnchorItem.getGroupId());
        }
        if (bSelected) {
            rm.writeAttribute("tabindex", "0");
            rm.addClass("sapUshellAnchorItemSelected");
        }
        if (!oAnchorItem.getVisible()) {
            rm.addClass("sapUshellShellHidden");
        }
        rm.writeClasses();
        rm.write("><div class=\"sapUshellAnchorItemInner\">");
        rm.writeEscaped(oAnchorItem.getTitle());
        rm.write("</div></li>");
    };


    return AnchorItemRenderer;

}, /* bExport= */ true);
