// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/resources",
    "sap/ushell/ui/launchpad/AccessibilityCustomData",
    "sap/ushell/utils",
    "sap/ushell/Config"
], function (resources, AccessibilityCustomData, utils, Config) {
    "use strict";

    /**
     * @name GridContainer renderer.
     * @static
     * @private
     */
    var GridContainerRenderer = {};

    /**
     * Renders the HTML for the given control, using the provided
     * {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager}
     *            oRm the RenderManager that can be used for writing to the render
     *            output buffer
     * @param {sap.ui.core.Control}
     *            oControl an object representation of the control that should be
     *            rendered
     */
    GridContainerRenderer.render = function (oRm, oControl) {
        var aHeaderActions = oControl.getHeaderActions(),
            aBeforeContent = oControl.getBeforeContent(),
            aAfterContent = oControl.getAfterContent(),
            aFootItems = oControl.getFooterContent() || [],
            oGrid = oControl.getAggregation("_grid"),
            containerHeight,
            aLinks = oControl.getLinks(),
            i;

        //WRAPPER start
        oRm.write("<div");
        oRm.writeControlData(oControl);
        oRm.addClass("sapUshellTileContainer");
        oRm.writeClasses();

        oRm.write(">");

        //BEFORE CONTENT start
        if (aBeforeContent.length && oControl.getTileActionModeActive()) {
            oRm.write("<div");
            oRm.addClass("sapUshellTileContainerBeforeContent");
            oRm.addClass("sapContrastPlus");
            oRm.writeClasses();
            oRm.write(">");
            aBeforeContent.forEach(function (oControl) {
                oRm.renderControl(oControl);
            });
            oRm.write("</div>");
        }
        //BEFORE CONTENT end

        //CONTENT start
        oRm.write("<div");
        oRm.addClass("sapUshellTileContainerContent");
        oRm.addClass("sapUshellGridContainerContent");
        if (oControl.getIsGroupLocked()) {
            oRm.addClass("sapUshellTileContainerLocked");
        }
        if (oControl.getDefaultGroup()) {
            oRm.addClass("sapUshellTileContainerDefault");
        }
        if (oControl.getShowBackground()) {
            oRm.addClass("sapUshellTileContainerEditMode");
        }
        oRm.writeClasses();
        oRm.writeAttribute("tabindex", "-1");
        oRm.write(">");
        if (oControl.getShowBackground()) {
            oRm.write("<div");
            oRm.addClass("sapUshellGroupBackgroundContainer sapContrastPlus");
            oRm.writeClasses();
            oRm.write(">");
            oRm.write("</div>");
        }
        if (oControl.getShowHeader()) {
            // Title
            oRm.write("<div");
            oRm.addClass("sapUshellTileContainerHeader sapContrastPlus");

            if (!oControl.getShowGroupHeader()) {
                oRm.addClass("sapUshellFirstGroupHeaderHidden sapUiPseudoInvisibleText");
            }

            oRm.writeAttribute("id", oControl.getId() + "-groupheader");
            oRm.writeClasses();

            if (oControl.getIeHtml5DnD() && !oControl.getIsGroupLocked() && !oControl.getDefaultGroup() && oControl.getTileActionModeActive()) {
                oRm.writeAttribute("draggable", "true");
            }

            var sAccMsg;
            // group is default case (Home group)
            if (oControl.getDefaultGroup()) {
                sAccMsg = resources.i18n.getText("ariaLabelEditModeGroupDefault", oControl.getHeaderText());
                // locked group case
            } else if (oControl.getIsGroupLocked()) {
                sAccMsg = resources.i18n.getText("ariaLabelEditModeGroupLocked", oControl.getHeaderText());
            } else {
                // general group case
                sAccMsg = resources.i18n.getText("ariaLabelEditModeGroup", oControl.getHeaderText());
            }
            oRm.writeAccessibilityState(oControl, {label: sAccMsg});
            oRm.write(">");
            oRm.write("<div");
            oRm.writeAttribute("id", oControl.getId() + "-title");
            oRm.addClass("sapUshellContainerTitleFlex");
            oRm.writeClasses();
            oRm.write(">");
            oRm.write("<");
            oRm.write(oControl.getHeaderLevel().toLowerCase());
            oRm.addClass("sapUshellContainerTitle");
            oRm.writeClasses();

            oRm.writeAttributeEscaped("title", oControl.getHeaderText());
            oRm.writeAttribute("id", oControl.getId() + "-titleText");
            oRm.writeAttribute("data-role", "group");
            oRm.write(">");
            oRm.writeEscaped(oControl.getHeaderText());
            oRm.write("</");
            oRm.write(oControl.getHeaderLevel().toLowerCase());
            oRm.writeAttribute("id", oControl.getId() + "-groupheader");
            oRm.write(">");
            if (oControl.getShowIcon()) {
                oControl.oIcon.removeStyleClass("sapUshellContainerIconHidden");
            } else {
                oControl.oIcon.addStyleClass("sapUshellContainerIconHidden");
            }
            oRm.renderControl(oControl.oEditInputField);
            if (oControl.getIsGroupLocked()) {
                oRm.renderControl(oControl.oIcon);
            } else if (oControl.getTileActionModeActive()) {
                //Header Actions
                //Header Action Start
                oRm.write("<div");
                oRm.addClass("sapUshellContainerHeaderActions");
                oRm.writeClasses();
                oRm.write(">");

                for (i = 0; i < aHeaderActions.length; i++) {
                    oRm.renderControl(aHeaderActions[i]);
                }

                //Header Action End
                oRm.write("</div>");
            }
            oRm.write("</div>");

            // Title END
            oRm.write("</div>");
        }

        //SORTABLE start
        oRm.write("<ul");
        containerHeight = oControl.data("containerHeight");
        if (containerHeight) {
            oRm.writeAttribute("style", "height:" + containerHeight);
        }
        oRm.addClass("sapUshellTilesContainer-sortable");
        oRm.addClass("sapUshellInner");
        oRm.writeClasses();
        oRm.writeAccessibilityState(oControl, {role: "listbox"});
        oRm.write(">");

        var aVisibleContent = [];
        oControl.getTiles().forEach(function (oTile) {
            if (oTile.getVisible()) {
                aVisibleContent.push(oTile);
            }
        });

        aVisibleContent.forEach(function (oContent, iPos) {
            oContent.addCustomData(new AccessibilityCustomData({
                key: "aria-posinset",
                value: (iPos + 1).toString(),
                writeToDom: true
            }));
            oContent.addCustomData(new AccessibilityCustomData({
                key: "aria-setsize",
                value: aVisibleContent.length.toString(),
                writeToDom: true
            }));

            if (this._isUserActivityCard(oContent)) {
                this._updateUserActivityCardVisibility(oContent);
            }
        }.bind(this));

        oRm.renderControl(oGrid);

        //SORTABLE end
        oRm.write("</ul>");

        // Links rendering
        var bLineModeContainer = oControl.getSupportLinkPersonalization();
        if (aLinks.length > 0 || bLineModeContainer) {

            oRm.write("<div aria-hidden='true'");
            var containerClassName = bLineModeContainer ? "sapUshellLineModeContainer" : "sapUshellLinksContainer";
            oRm.addClass(containerClassName);
            if (!aLinks.length && bLineModeContainer) {
                oRm.addClass("sapUshellNoLinksAreaPresent");
                oRm.writeClasses();
                oRm.write(">");
                oRm.write("<div");
                oRm.addClass("sapUshellNoLinksAreaPresentText");
                oRm.writeClasses();
                oRm.write(">");
                oRm.renderControl(oControl.oNoLinksText);
                oRm.write("</div>");
            } else {
                oRm.writeClasses();
                oRm.write(">");
            }

            if (bLineModeContainer) {
                //Transformation Error
                oRm.write("<div");
                oRm.addClass("sapUshellTransformationError");
                oRm.writeClasses();
                if (!oControl.transformationError) {
                    oRm.writeAttribute("style", "display: none;");
                }
                oRm.write(">");

                oRm.write("<div");
                oRm.addClass("sapUshellTransformationErrorInnerWrapper");
                oRm.writeClasses();
                oRm.write(">");
                oRm.renderControl(oControl.oTransformationErrorIcon);
                oRm.renderControl(oControl.oTransformationErrorText);
                oRm.write("</div>");

                oRm.write("</div>");

                oRm.write("<div class='sapUshellLinksInnerContainer'>");

                for (i = 0; i < aLinks.length; i++) {
                    var oLink = aLinks[i],
                        aCustomData = oLink.getCustomData(),
                        sTabIndex = "-1";

                    for (var j = 0; j < aCustomData.length; j++) {
                        if (aCustomData[j].getKey() === "tabindex") {
                            sTabIndex = aCustomData[j].getValue();
                        }
                        oLink.removeCustomData(aCustomData[j]);
                    }

                    oLink.addCustomData(new AccessibilityCustomData({
                        key: "aria-posinset",
                        value: (i + 1).toString(),
                        writeToDom: true
                    }));
                    oLink.addCustomData(new AccessibilityCustomData({
                        key: "aria-setsize",
                        value: aLinks.length.toString(),
                        writeToDom: true
                    }));
                    oLink.addCustomData(new AccessibilityCustomData({
                        key: "tabindex",
                        value: sTabIndex,
                        writeToDom: true
                    }));
                    oLink.addStyleClass("sapUshellLinkTile");
                    if (oControl.getIsGroupLocked()) {
                        oLink.addStyleClass("sapUshellLockedTile");
                    }

                    oRm.renderControl(oLink);
                }

                oRm.write("</div>");
            }

            oRm.write("</div>");
        }
        // FOOTER start
        if (aFootItems.length > 0) {
            oRm.write("<footer");
            oRm.addClass("sapUshellTilesContainerFtr");
            oRm.writeClasses();
            oRm.write(">");
            aFootItems.forEach(function (oControl) {
                oRm.renderControl(oControl);
            });
            oRm.write("</footer>");
        }
        // FOOTER end

        //CONTENT end
        oRm.write("</div>");

        //AFTER CONTENT start
        if (aAfterContent.length && oControl.getTileActionModeActive()) {
            oRm.write("<div");
            oRm.addClass("sapUshellTileContainerAfterContent");
            oRm.addClass("sapContrastPlus ");
            oRm.writeClasses();
            oRm.write(">");
            aAfterContent.forEach(function (oControl) {
                oRm.renderControl(oControl);
            });
            oRm.write("</div>");
        }
        //AFTER CONTENT end

        //WRAPPER end
        oRm.write("</div>");
        utils.setPerformanceMark("FLP -- tile container renderer");
    };

    GridContainerRenderer._updateUserActivityCardVisibility = function (oCard) {
        oCard.setVisible(Config.last("/core/shell/model/enableTrackingActivity"));
        Config.on("/core/shell/model/enableTrackingActivity").do(function (bEnableTrackingActivity) {
            oCard.setVisible(bEnableTrackingActivity);
        });
    };

    GridContainerRenderer._isUserActivityCard = function (oCard) {
        if (typeof oCard.getManifest !== "function") {
            return false;
        }

        var oManifest = oCard.getManifest();
        var sCardTitle = oManifest && oManifest["sap.card"] && oManifest["sap.card"].header && oManifest["sap.card"].header.title;
        return sCardTitle === resources.i18n.getText("recentActivities") || sCardTitle === resources.i18n.getText("frequentActivities");
    };

    return GridContainerRenderer;

}, /* bExport= */ true);