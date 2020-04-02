// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/resources",
    "sap/ushell/utils",
    "sap/ushell/bootstrap/common/common.load.model",
    "sap/ushell/Config",
    "sap/ushell/ui/launchpad/AccessibilityCustomData",
    "sap/ui/core/CustomData"
], function (
    resources,
    utils,
    oModelWrapper,
    Config,
    AccessibilityCustomData,
    CustomData
) {
    "use strict";

    /**
     * @name TileContainer renderer.
     * @static
     * @private
     */
    var TileContainerRenderer = {};

    TileContainerRenderer.oModel = oModelWrapper.getModel();

    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
     * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
     */
    TileContainerRenderer.render = function (oRm, oControl) {
        var aHeaderActions = oControl.getHeaderActions(),
            aBeforeContent = oControl.getBeforeContent(),
            aAfterContent = oControl.getAfterContent(),
            aFootItems = oControl.getFooterContent() || [],
            containerHeight,
            aLinks = oControl.getLinks(),
            that = this;

        // WRAPPER start
        oRm.write("<div");
        oRm.writeControlData(oControl);
        oRm.addClass("sapUshellTileContainer");
        oRm.writeClasses();

        oRm.write(">");

        // BEFORE CONTENT start
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
        // BEFORE CONTENT end

        // CONTENT start
        oRm.write("<div");
        oRm.addClass("sapUshellTileContainerContent");
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
            oRm.writeAccessibilityState(oControl, { label: sAccMsg });
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
                // Header Actions
                // Header Action Start
                oRm.write("<div");
                oRm.addClass("sapUshellContainerHeaderActions");
                oRm.writeClasses();
                oRm.write(">");

                aHeaderActions.forEach(function (oControl) {
                    oRm.renderControl(oControl);
                });

                // Header Action End
                oRm.write("</div>");
            }
            oRm.write("</div>");

            // Title END
            oRm.write("</div>");
        }

        // SORTABLE start
        oRm.write("<ul");
        containerHeight = oControl.data("containerHeight");
        if (containerHeight) {
            oRm.writeAttribute("style", "height:" + containerHeight);
        }
        oRm.addClass("sapUshellTilesContainer-sortable");
        oRm.addClass("sapUshellInner");
        oRm.writeClasses();
        oRm.writeAccessibilityState(oControl, {
            role: "listbox"
        });
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

            if (that._isUserActivityCard(oContent)) {
                that._updateUserActivityCardVisibility(oContent);
            }

            oRm.renderControl(oContent);
        });

        // If no tiles in group or default group
        if (oControl.getShowPlaceholder()) {
            oRm.renderControl(oControl.oPlusTile);
        }

        // hook method to render no data
        if (oControl.getShowNoData()) {
            this.renderNoData(oRm, oControl, !aVisibleContent.length);
        }

        // SORTABLE end
        oRm.write("</ul>");

        // Links rendering
        var bLineModeContainer = oControl.getSupportLinkPersonalization();
        if (aLinks.length > 0 || bLineModeContainer) {
            if (oControl.getShowBackground() && !(oControl.getIsGroupLocked() && !aVisibleContent.length)) {
                // Links Separator start.
                oRm.write("<div");
                oRm.addClass("sapUshellTilesContainerSeparator");
                oRm.writeClasses();
                oRm.write(">");
                // Links Separator end.
                oRm.write("</div>");
            }

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
                oRm.renderControl(oControl.getNoLinksText());
                oRm.write("</div>");
            } else {
                oRm.writeClasses();
                oRm.write(">");
            }

            if (bLineModeContainer) {
                // Transformation Error
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
                oRm.renderControl(oControl.getTransformationErrorIcon());
                oRm.renderControl(oControl.getTransformationErrorText());
                oRm.write("</div>");

                oRm.write("</div>");
            }

            if (bLineModeContainer) {
                oRm.write("<div class='sapUshellLinksInnerContainer'>");
            }

            aLinks.map(function (link, index, aLinks) {
                if (bLineModeContainer) {
                    var tabIndexData = new AccessibilityCustomData({
                        key: "tabindex",
                        value: "-1",
                        writeToDom: true
                    });
                    link.getCustomData().map(function (customData) {
                        if (customData.getKey() == "tabindex" && customData.getValue("0")) {
                            tabIndexData = customData;
                        }
                        link.removeCustomData(customData);
                    });
                    link.addCustomData(new AccessibilityCustomData({
                        key: "aria-posinset",
                        value: (index + 1).toString(),
                        writeToDom: true
                    }));
                    link.addCustomData(new AccessibilityCustomData({
                        key: "aria-setsize",
                        value: aLinks.length.toString(),
                        writeToDom: true
                    }));
                    link.addCustomData(tabIndexData);
                    if (link.getModel() && link.getModel().getProperty("/enableHelp")) {
                        link.addCustomData(new CustomData({
                            key: "help-id",
                            value: link.getBindingContext() && link.getBindingContext().getProperty("tileCatalogId"),
                            writeToDom: true
                        }));
                    }
                    link.addStyleClass("sapUshellLinkTile");
                    if (oControl.getIsGroupLocked()) {
                        link.addStyleClass("sapUshellLockedTile");
                    }
                }
                oRm.renderControl(link);
            });

            if (bLineModeContainer) {
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

        // CONTENT end
        oRm.write("</div>");

        // AFTER CONTENT start
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
        // AFTER CONTENT end

        // WRAPPER end
        oRm.write("</div>");
        utils.setPerformanceMark("FLP -- tile container renderer");
    };

    // Rendering a message in case no Tiles are visible after applying the user filter
    TileContainerRenderer.renderNoData = function (oRm, oControl, displayData) {
        oRm.write("<div id='" + oControl.getId() + "-listNoData' class='sapUshellNoFilteredItems sapUiStrongBackgroundTextColor'>");
        if (displayData) {
            if (oControl.getNoDataText()) {
                oRm.writeEscaped(oControl.getNoDataText());
            } else {
                oRm.writeEscaped(oControl.getNoDataText(resources.i18n.getText("noFilteredItems")));
            }
        } else {
            oRm.writeEscaped("");
        }
        oRm.write("</div>");
    };

    TileContainerRenderer._isUserActivityCard = function (oCard) {
        if (typeof oCard.getManifest !== "function") {
            return false;
        }

        var oManifest = oCard.getManifest();
        var sCardTitle = oManifest && oManifest["sap.card"] && oManifest["sap.card"].header && oManifest["sap.card"].header.title;
        return sCardTitle === resources.i18n.getText("recentActivities") || sCardTitle === resources.i18n.getText("frequentActivities");
    };

    TileContainerRenderer._updateUserActivityCardVisibility = function (oCard) {
        oCard.setVisible(Config.last("/core/shell/model/enableTrackingActivity"));
        Config.on("/core/shell/model/enableTrackingActivity").do(function (bEnableTrackingActivity) {
            oCard.setVisible(bEnableTrackingActivity);
        });
    };

    return TileContainerRenderer;
}, /* bExport= */ true);
