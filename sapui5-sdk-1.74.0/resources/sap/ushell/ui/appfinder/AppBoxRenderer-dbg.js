/*!
 * Copyright (c) 2009-2017 SAP SE, All Rights Reserved
 */

sap.ui.define(['sap/ushell/resources', 'sap/ui/core/Icon'],
    function (resources, Icon) {
    "use strict";

    /**
     * AppBox renderer.
     * @namespace
     */
    var AppBoxRenderer = {};

    /**
     * Renders the HTML for the given AppBox control, using the provided
     * {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager} rm
     *            the RenderManager that can be used for writing to
     *            the Render-Output-Buffer
     * @param {sap.ui.core.Control} oAppBox
     *            the AppBox to be rendered
     */
    AppBoxRenderer.render = function (rm, oAppBox) {
        var oCatalogContainer = oAppBox.getParent(),
            oAppBoxes = oCatalogContainer.getAppBoxesContainer ? oCatalogContainer.getAppBoxesContainer() : [],
            oVisibleAppBoxes = oAppBoxes.filter(function (oAppBox) {
                return oAppBox.getVisible();
            }),
            iCurrentItemIndex = oVisibleAppBoxes.indexOf(oAppBox) > -1 ? oVisibleAppBoxes.indexOf(oAppBox) + 1 : "",
            sAriaLabelText = oAppBox.getTitle();

        sAriaLabelText = oAppBox.getSubtitle() ? sAriaLabelText + " " + oAppBox.getSubtitle() : sAriaLabelText;
        var sNavigaitonMode = oAppBox.getNavigationMode();
        if (sNavigaitonMode) {
            sAriaLabelText = resources.i18n.getText(sNavigaitonMode + "NavigationMode") + " " + sAriaLabelText;
        }
        rm.write("<li");
        rm.writeControlData(oAppBox);
        rm.addClass("sapUshellAppBox");
        rm.writeAccessibilityState(oAppBox, {role: "option", posinset : iCurrentItemIndex, setsize : oVisibleAppBoxes.length});
        rm.writeAttributeEscaped("aria-label", sAriaLabelText);
        rm.writeAttribute("aria-describedby", oAppBox.getId());
        rm.writeClasses();
        rm.write(">");
        rm.write("<div");
        rm.addClass("sapUshellAppBoxInner");
        rm.writeClasses();
        rm.write(">");

        // icon
        var bHasIcon = oAppBox.getIcon();
        if (bHasIcon) {
            var oIcon = new Icon({src: oAppBox.getIcon()});
            oIcon.addStyleClass("sapUshellAppBoxIcon");
            rm.renderControl(oIcon);
        }

        rm.write("<div");
        if (bHasIcon) {
            rm.addClass("sapUshellAppBoxHeader");
        } else {
            rm.addClass("sapUshellAppBoxHeaderNoIcon");
        }
        rm.writeClasses();
        rm.write(">");

        // title
        rm.write("<div");
        rm.addClass("sapUshellAppBoxTitle");
        rm.writeClasses();
        rm.write(">");
        rm.writeEscaped(oAppBox.getTitle());
        rm.write("</div>");

        // subtitle
        if (oAppBox.getSubtitle()) {
            rm.write("<div");
            rm.addClass("sapUshellAppBoxSubtitle");
            rm.writeClasses();
            rm.write(">");
            rm.writeEscaped(oAppBox.getSubtitle());
            rm.write("</div>");
        }

        rm.write("</div>");
        rm.write("</div>");

        rm.write("<div");
        rm.addClass("sapUshellAppBoxActionsArea");
        rm.writeClasses();
        if (oAppBox.getTitle) {
            rm.writeAccessibilityState(oAppBox, {role: "toolbar", label: oAppBox.getTitle()});
        }
        rm.write(">");

        rm.renderControl(oAppBox.getPinButton());

        rm.write("</div>");
        rm.write("</li>");

    };


    return AppBoxRenderer;

}, /* bExport= */ true);
