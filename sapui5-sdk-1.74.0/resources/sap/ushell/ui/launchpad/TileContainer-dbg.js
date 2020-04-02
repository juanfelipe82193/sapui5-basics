// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

// Provides control sap.ushell.ui.launchpad.TileContainer.
sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ui/base/ManagedObject",
    "sap/ui/core/Control",
    "sap/m/library",
    "sap/ui/core/Icon",
    "sap/m/Text",
    "sap/ushell/override",
    "sap/ushell/resources",
    "sap/ushell/ui/launchpad/PlusTile",
    "sap/base/Log",
    "sap/ushell/utils",
    "sap/ui/Device",
    "sap/ushell/ui/launchpad/TileContainerRenderer"
], function (
    jQuery,
    ManagedObject,
    Control,
    MobileLibrary,
    Icon,
    Text,
    override,
    resources,
    PlusTile,
    Log,
    utils,
    Device
    // TileContainerRenderer
) {
    "use strict";

    var HeaderLevel = MobileLibrary.HeaderLevel;

    /**
     * Constructor for a new ui/launchpad/TileContainer.
     *
     * @param {string} [sId] The ID for the new control, generated automatically if no ID is given
     * @param {object} [mSettings] The initial settings for the new control
     * @class A container that arranges Tile controls.
     * @extends sap.ui.core.Control
     * @constructor
     * @name sap.ushell.ui.launchpad.TileContainer
     * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
     */
    var TileContainer = Control.extend("sap.ushell.ui.launchpad.TileContainer", /** @lends sap.ushell.ui.launchpad.TileContainer.prototype */ {
        metadata: {
            library: "sap.ushell",
            properties: {
                scrollType:
                    { type: "string", group: "Misc", defaultValue: "item" },
                // Animation Speed in milliseconds (ms)
                animationSpeed:
                    { type: "int", group: "Misc", defaultValue: 500 },
                groupId:
                    { type: "string", group: "Misc", defaultValue: null },
                showHeader:
                    { type: "boolean", group: "Misc", defaultValue: true },
                showPlaceholder:
                    { type: "boolean", group: "Misc", defaultValue: true },
                defaultGroup:
                    { type: "boolean", group: "Misc", defaultValue: false },
                isLastGroup:
                    { type: "boolean", group: "Misc", defaultValue: false },
                headerText:
                    { type: "string", group: "Misc", defaultValue: null },
                headerLevel:
                    { type: "sap.m.HeaderLevel", group: "Misc", defaultValue: HeaderLevel.H2 },
                // Header level (H1-H6) used for headers of tile groups.
                groupHeaderLevel:
                    { type: "sap.m.HeaderLevel", group: "Misc", defaultValue: HeaderLevel.H4 },
                showGroupHeader:
                    { type: "boolean", group: "Misc", defaultValue: true },
                homePageGroupDisplay:
                    { type: "string", defaultValue: null },
                visible:
                    { type: "boolean", group: "Misc", defaultValue: true },
                sortable:
                    { type: "boolean", group: "Misc", defaultValue: true },
                showNoData:
                    { type: "boolean", group: "Misc", defaultValue: false },
                noDataText:
                    { type: "string", group: "Misc", defaultValue: null },
                isGroupLocked:
                    { type: "boolean", group: "Misc", defaultValue: null },
                isGroupSelected:
                    { type: "boolean", group: "Misc", defaultValue: false },
                editMode:
                    { type: "boolean", group: "Misc", defaultValue: false },
                showBackground:
                    { type: "boolean", group: "Misc", defaultValue: false },
                icon:
                    { type: "string", group: "Misc", defaultValue: "sap-icon://locked" },
                showIcon:
                    { type: "boolean", group: "Misc", defaultValue: false },
                deluminate:
                    { type: "boolean", group: "Misc", defaultValue: false },
                showMobileActions:
                    { type: "boolean", group: "Misc", defaultValue: false },
                enableHelp:
                    { type: "boolean", group: "Misc", defaultValue: false },
                tileActionModeActive:
                    { type: "boolean", group: "Misc", defaultValue: false },
                ieHtml5DnD:
                    { type: "boolean", group: "Misc", defaultValue: false },
                showEmptyLinksArea:
                    { type: "boolean", group: "Misc", defaultValue: false },
                showEmptyLinksAreaPlaceHolder:
                    { type: "boolean", group: "Misc", defaultValue: false },
                hidden:
                    { type: "boolean", group: "Misc", defaultValue: false },
                transformationError:
                    { type: "boolean", group: "Misc", defaultValue: false },
                // Set to true if the LaunchPageAdapter supports link personalization.
                supportLinkPersonalization: { type: "boolean", group: "Misc", defaultValue: false }
            },
            aggregations: {
                tiles:
                    { type: "sap.ui.core.Control", multiple: true, singularName: "tile" },
                links:
                    { type: "sap.ui.core.Control", multiple: true, singularName: "link" },
                beforeContent:
                    { type: "sap.ui.core.Control", multiple: true, singularName: "beforeContent" },
                afterContent:
                    { type: "sap.ui.core.Control", multiple: true, singularName: "afterContent" },
                footerContent:
                    { type: "sap.ui.core.Control", multiple: true, singularName: "footerContent" },
                headerActions:
                    { type: "sap.ui.core.Control", multiple: true, singularName: "headerAction" }
            },
            events: {
                afterRendering: {},
                // This Event triggered when the tile/card placeholder is pressed.
                add: {},
                // This Event is triggered when the group title is modified.
                titleChange: {}
            }
        }
    });

    /**
     * @name sap.ushell.ui.launchpad.TileContainer
     * @private
     */
    TileContainer.prototype.init = function () {
        this.bIsFirstTitleChange = true;

        this._sDefaultValue = resources.i18n.getText("new_group_name");
        this._sOldTitle = "";

        this.oNoLinksText = new Text({
            text: resources.i18n.getText("emptyLinkContainerInEditMode")
        }).addStyleClass("sapUshellNoLinksAreaPresentTextInner");

        this.oTransformationErrorText = new Text({
            text: resources.i18n.getText("transformationErrorText")
        }).addStyleClass("sapUshellTransformationErrorText");

        this.oTransformationErrorIcon = new Icon({
            src: "sap-icon://message-error"
        }).addStyleClass("sapUshellTransformationErrorIcon");

        this.oIcon = new Icon({ src: this.getIcon() });
        this.oIcon.addStyleClass("sapUshellContainerIcon");

        this.oPlusTile = new PlusTile({
            groupId: this.getGroupId(),
            enableHelp: this.getEnableHelp(),
            press: [this.fireAdd, this]
        });
        this.oPlusTile.setParent(this);

        if (sap.ushell.Container !== undefined) {
            if (sap.ushell.Container.getService("LaunchPage").isLinkPersonalizationSupported()) {
                TileContainer.prototype.isLinkPersonalizationOveride();
            }
        }
    };

    TileContainer.prototype.onAfterRendering = function () {
        var oTitleText = window.document.getElementById(this.getId() + "-titleText");
        if (oTitleText) {
            oTitleText.addEventListener("click", function () {
                var bEnableRenameLockedGroup = this.getModel() && this.getModel().getProperty("/enableRenameLockedGroup"),
                    bEditMode = (bEnableRenameLockedGroup || !this.getIsGroupLocked())
                        && !this.getDefaultGroup()
                        && this.getTileActionModeActive();
                this.setEditMode(bEditMode);
            }.bind(this));
        }

        var aCards = this.getTiles().filter(function (tile) {
            return tile.isA("sap.ui.integration.widgets.Card");
        });

        this._resizeCards(aCards);

        var oEventBus = sap.ui.getCore().getEventBus();
        oEventBus.publish("launchpad", "GroupHeaderVisibility");

        this.fireAfterRendering();
    };

    TileContainer.prototype.getTransformationErrorText = function () {
        return this.oTransformationErrorText;
    };

    TileContainer.prototype.getTransformationErrorIcon = function () {
        return this.oTransformationErrorIcon;
    };

    TileContainer.prototype.getNoLinksText = function () {
        return this.oNoLinksText;
    };

    TileContainer.prototype.setTransformationError = function (bTransformationError) {
        this.setProperty("transformationError", bTransformationError, true); // suppress rerendering

        if (bTransformationError) {
            this.$().find(".sapUshellTransformationError").show();
        } else {
            this.$().find(".sapUshellTransformationError").hide();
        }
        this.$().find(".sapUshellNoLinksAreaPresent").toggleClass("sapUshellNoLinksAreaPresentError", bTransformationError);
        return this;
    };

    // Improve handling of aggregation updates
    TileContainer.prototype.updateAggregation = override.updateAggregation;

    // Override setters
    TileContainer.prototype.setNoDataText = function (oNoDataText) {
        this.setProperty("noDataText", oNoDataText, true); // suppress rerendering
        if (this.getShowNoData()) {
            this.$().find(".sapUshellNoFilteredItems").text(oNoDataText);
        }
        return this;
    };

    TileContainer.prototype.setGroupId = function (v) {
        this.setProperty("groupId", v, true); // set property, but suppress rerendering
        if (this.oPlusTile) {
            this.oPlusTile.setGroupId(v);
        }
        return this;
    };

    TileContainer.prototype.setHeaderText = function (sHeaderText) {
        this.setProperty("headerText", sHeaderText, true); // set property, but suppress rerendering
        this.$().find(".sapUshellContainerTitle").text(sHeaderText);
        return this;
    };

    TileContainer.prototype.setVisible = function (bVisible) {
        this.setProperty("visible", bVisible, true); // suppress rerendering
        this.toggleStyleClass("sapUshellHidden", !bVisible);
        return this;
    };

    TileContainer.prototype.setShowMobileActions = function (bShowMobileActions) {
        var bSupressRerendering = true;

        if (this.oHeaderButton) {
            this.oHeaderButton.setVisible(bShowMobileActions);
        } else if (bShowMobileActions) {
            bSupressRerendering = false;
        }
        this.setProperty("showMobileActions", bShowMobileActions, bSupressRerendering);
    };

    TileContainer.prototype.setShowIcon = function (bShowIcon) {
        this.setProperty("showIcon", bShowIcon, true); // suppress rerendering
        this.$().find(".sapUshellContainerIcon").toggleClass("sapUshellContainerIconHidden", !bShowIcon);
    };

    TileContainer.prototype.setDeluminate = function (bDeluminate) {
        this.setProperty("deluminate", bDeluminate, true); // suppress rerendering
        this.toggleStyleClass("sapUshellDisableLockedGroupDuringDrag", bDeluminate);
        return this;
    };

    TileContainer.prototype.setHidden = function (bHidden) {
        this.setProperty("hidden", !!bHidden, true);
        this.toggleStyleClass("sapUshellTileContainerEditModeHidden", !!bHidden);
        return this;
    };

    TileContainer.prototype.groupHasTiles = function () {
        var sPath = "",
            tiles = this.getTiles(),
            links = [];
        if (this.getBindingContext()) {
            sPath = this.getBindingContext().sPath;
            tiles = this.getModel().getProperty(sPath).tiles;
        }
        return utils.groupHasVisibleTiles(tiles, links);
    };

    TileContainer.prototype.getInnerContainerDomRef = function () {
        return this.$().find(".sapUshellTilesContainer-sortable")[0];
    };

    TileContainer.prototype.getInnerContainersDomRefs = function () {
        var oDomRef = this.getDomRef();

        if (!oDomRef) {
            return null;
        }

        return [
            oDomRef.querySelector(".sapUshellTilesContainer-sortable"),
            oDomRef.querySelector(".sapUshellLineModeContainer")
        ];
    };

    TileContainer.prototype.setEditMode = function (bValue) {
        if (bValue) {
            this.addStyleClass("sapUshellEditing");
            this._startEdit();
        } else {
            this.setProperty("editMode", bValue, false);
            this.removeStyleClass("sapUshellEditing");
        }
    };

    /**
     * This updateLinks override is handling for Personalization Links  only and not for sap.m.link.
     *
     * When convert tile is called - we need to update the tiles and links aggregation.
     * There is a problem with updating links aggregation since its entities are not bound to any properties in the model and aggregation is populated by factory function.
     * When override.updateAggregation is called, the GenericTile properties are not updated with new binding context simply because it does not have any bindings,
     * but the number of links in the model is reflected in the control. That causes only the last link to be removed in the UI while links are not updated with their new context.
     */
    TileContainer.prototype.isLinkPersonalizationOveride = function () {
        TileContainer.prototype.updateLinks = function (sReason) {
            var oGroupsBox = this.getParent(),
                bTabsMode = oGroupsBox && oGroupsBox.getDisplayMode && oGroupsBox.getDisplayMode() === "tabs";

            if (bTabsMode && !this.getTileActionModeActive()) {
                // updateAggregation causes all aggregations of the tile containers to be destroyed by calling "destroy" of each
                // entry and not by "destroyAll" method of the control. Since links are not controlled by GLP, we cannot allow to destroy them.
                // In order to prevent destruction of all links, we remove all links from all tile containers except for the selected one.
                oGroupsBox.removeLinksFromUnselectedGroups();
            }
            if (this.getLinks().length > 0) {
                this.removeAllLinks();
            }
            ManagedObject.prototype.updateAggregation.call(this, "links");
        };

        TileContainer.prototype.destroyLinks = function (sReason) {
            Log.debug("link is destroyed because: " + sReason, null, "sap.ushell.ui.launchpad.TileContainer");
        };
    };

    TileContainer.prototype.setShowEmptyLinksArea = function (bValue) {
        this.setProperty("showEmptyLinksArea", bValue, true);
        this.toggleStyleClass("sapUshellLinksAreaHidden", !bValue);
    };

    TileContainer.prototype.setShowEmptyLinksAreaPlaceHolder = function (bValue) {
        this.setProperty("showEmptyLinksArea", bValue, true);
        this.toggleStyleClass("sapUshellTileContainerEditMode", bValue);
        this.toggleStyleClass("sapUshellTileContainerTabsModeEmptyLinksArea", bValue);
        this.toggleStyleClass("sapUshellEmptyLinksAreaPlaceHolder", !bValue);
    };

    TileContainer.prototype._resizeCards = function (cards) {
        var oCard,
            oManifest,
            fSingleCellSize = 5.35,
            fTileMargin = 0.5,
            iCardRows,
            iCardCols,
            sCardWidth,
            sCardHeight;

        for (var i = 0; i < cards.length; i++) {
            oCard = cards[i];
            oManifest = oCard.getManifest();

            iCardRows = oManifest["sap.flp"].rows;
            iCardCols = oManifest["sap.flp"].columns;
            sCardWidth = iCardCols * fSingleCellSize + (iCardCols - 1) * fTileMargin + "rem";
            sCardHeight = iCardRows * fSingleCellSize + (iCardRows - 1) * fTileMargin + "rem";

            oCard.setHeight(sCardHeight);
            oCard.setWidth(sCardWidth);
        }
    };

    TileContainer.prototype._startEdit = function () {
        var that = this;

        // create Input for header text editing if not exists
        if (this.getModel() && !this.getModel().getProperty("/editTitle")) {
            this.getModel().setProperty("/editTitle", true, false);
        }

        if (!this.oEditInputField) {
            sap.ui.require(["sap/m/Input"], function (Input) {
                that.setProperty("editMode", true, false);
                that.oEditInputField = new Input({
                    placeholder: that._sDefaultValue,
                    value: that.getHeaderText()
                }).addStyleClass("sapUshellTileContainerTitleInput");

                that.oEditInputField.addEventDelegate({
                    // after rendering - if edit had been invoked on this input field - focus the title & select the text
                    // that was done before in a setTimeout of 100 millis and not after the actual rendering, which resulted in - when the system
                    // is very heavy (bad connectivity/many content) the text was not selected.
                    onAfterRendering: function () {
                        /*
                            * We do it within the set time out as  there might be a situation where,
                            * adding the new group at the end of the screen, causes a scroll which removes the text-selection
                            * Thus we use setTimeOut to ensure the input had been rendered to ensure any auto scroll is done before
                            * we select the text and focus the input
                            */
                        setTimeout(function () {
                            // as on after rendering might be called several times, we reselect the text in case input is visible
                            // that can only be in case the new group title is edited
                            if (that.oEditInputField.$().is(":visible")) {
                                setTimeout(function () {
                                    that.oEditInputField.$().find("input").focus();
                                }, 100);

                                var windowHeight = jQuery(window).height(),
                                    jsGroup = that.getDomRef(),
                                    groupOffsetHeight = jsGroup.offsetHeight,
                                    groupTop = jsGroup.getBoundingClientRect().top,
                                    groupsOffset = jsGroup.offsetTop;

                                if (groupOffsetHeight + groupTop > windowHeight) {
                                    jQuery(".sapUshellDashboardView section").stop().animate({ scrollTop: groupsOffset }, 0);
                                }
                            }
                        }, 100);
                    },
                    onfocusout: function (/*oEvent*/) {
                        that._stopEdit();
                        jQuery.proxy(that.setEditMode, that, false)();
                    },
                    onsapenter: function (oEvent) {
                        that._stopEdit();
                        jQuery.proxy(that.setEditMode, that, false)();
                        setTimeout(function () {
                            var oTileContainerTitle = oEvent.srcControl,
                                jqGroupTitle = oTileContainerTitle.$().prev();

                            jqGroupTitle.focus();
                        }, 0);
                    }
                });
                that.oEditInputField.setValue(that.getHeaderText());
            });
        } else {
            this.oEditInputField.setValue(this.getHeaderText());
            that.setProperty("editMode", true, false);
        }

        this._sOldTitle = this._sDefaultValue;

        // Text Selection & focus on input field
        if (Device.system.phone) {
            setTimeout(function () {
                var oEventBus = sap.ui.getCore().getEventBus();
                oEventBus.publish("launchpad", "scrollToGroup", {
                    group: that,
                    groupChanged: false,
                    focus: false
                });
            }, 100);
        }
    };

    TileContainer.prototype._stopEdit = function () {
        var sCurrentTitle = this.getHeaderText();
        var sNewTitle = this.oEditInputField.getValue(),
            bHasChanged;

        sNewTitle = sNewTitle.substring(0, 256).trim() || this._sDefaultValue;
        bHasChanged = sNewTitle !== sCurrentTitle;

        if (this.bIsFirstTitleChange && sNewTitle === this.oEditInputField.getPlaceholder()) {
            bHasChanged = true;
        }
        this.bIsFirstTitleChange = false;
        if (this.getModel() && this.getModel().getProperty("/editTitle")) {
            this.getModel().setProperty("/editTitle", false, false);
        }

        if (!this._sOldTitle) {
            this._sOldTitle = sCurrentTitle;
            this.setHeaderText(sCurrentTitle);
        } else if (bHasChanged) {
            this.fireTitleChange({
                newTitle: sNewTitle
            });
            this.setHeaderText(sNewTitle);
        }
    };

    TileContainer.prototype.exit = function () {
        if (this.oPlusTile) {
            this.oPlusTile.destroy();
        }
        if (this.oHeaderButton) {
            this.oHeaderButton.destroy();
        }
        if (this.oActionSheet) {
            this.oActionSheet.destroy();
        }

        if (Control.prototype.exit) {
            Control.prototype.exit.apply(this, arguments);
        }
    };

    return TileContainer;
});
