// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview Tile action mode implementation.
 *
 * In tile action mode the user can launch an action associated with a tile.
 * The mode is launched when clicking on the Edit button in the user menu.
 *
 * Tile action mode can be activated only from the launchpad. it is not accessible from the catalog or from an application.
 * When the mode is active and the user clicks on a tile - the tile's corresponding actions are presented in an action sheet
 *  and the user can click/launch any of them.
 *
 * Every user action (e.g. menu buttons, drag-and-drop) except for clicking a tile - stops/deactivates the action mode.
 *
 * This module Contains the following:
 *  - Constructor function that creates action mode activation buttons
 *  - Activation handler
 *  - Deactivation handler
 *  - Rendering tile action menu
 *
 * @version 1.74.0
 */
/**
 * @namespace
 * @name sap.ushell.components.homepage.ActionMode
 * @since 1.26.0
 * @private
 */
sap.ui.define([
    "sap/ushell/resources",
    "sap/m/library",
    "sap/m/Button",
    "sap/ui/thirdparty/jquery"
], function (
    resources,
    mobileLibrary,
    Button,
    jQuery
) {
    "use strict";

    // shortcut for sap.m.PlacementType
    var PlacementType = mobileLibrary.PlacementType;

    /* global hasher */

    /**
     * Constructor function
     * Creates action mode activation buttons:
     *  1. A new button in the user menu
     *  2. A floating button
     */
    var ActionMode = function () {
        this.oEventBus = sap.ui.getCore().getEventBus();

        this.init = function (oModel) {
            this.oModel = oModel;
        };
    };

    /**
     * Activation handler of tile actions mode
     *
     * Performs the following actions:
     * - Shows a toast message indicating the activated mode
     * - Sets the feature's model property to indicate that the feature is activated
     * - Registers deactivation click handler, called when the user clicks outside of a tile
     * - Adds the cover DIV to all tiles adding the mode's grey opacity and click handler for opening the actions menu
     * - Disables drag capability on tiles
     * - Changes the appearance of the floating activation button
     */
    ActionMode.prototype._activate = function () {
        this.oModel.setProperty("/tileActionModeActive", true);
        this.aOrigHiddenGroupsIds = this.getHomepageManager().getCurrentHiddenGroupIds(this.oModel);
        var oDashboardGroups = sap.ui.getCore().byId("dashboardGroups");
        oDashboardGroups.addLinksToUnselectedGroups();

        // Change action mode button display in the user actions menu
        var oTileActionsButton = sap.ui.getCore().byId("ActionModeBtn");
        if (oTileActionsButton) {
            oTileActionsButton.setTooltip(resources.i18n.getText("exitEditMode"));
            oTileActionsButton.setText(resources.i18n.getText("exitEditMode"));
            // only avaiable if the action mode button is in the shell header
            if (oTileActionsButton.setSelected) {
                oTileActionsButton.setSelected(true);
            }
        }
        this.oEventBus.publish("launchpad", "actionModeActive");
    };

    /**
     * Deactivation handler of tile actions mode
     *
     * Performs the following actions:
     * - Unregisters deactivation click handler
     * - Sets the feature's model property to indicate that the feature is deactivated
     * - Enables drag capability on tiles
     * - Destroys the tile actions menu control
     * - Removed the cover DIV from to all the tiles
     * - Adds the cover DIV to all tiles adding the mode's grey opacity and click handler for opening the actions menu
     * - Changes the appearance of the floating activation button
     */
    ActionMode.prototype._deactivate = function () {
        this.oModel.setProperty("/tileActionModeActive", false);
        this.oEventBus.publish("launchpad", "actionModeInactive", this.aOrigHiddenGroupsIds);

        var tileActionsMenu = sap.ui.getCore().byId("TileActions");
        if (tileActionsMenu !== undefined) {
            tileActionsMenu.destroy();
        }
        sap.ui.require(["sap/m/MessageToast"], function (MessageToast) {
            MessageToast.show(resources.i18n.getText("savedChanges"), { duration: 4000 });
        });

        // Change action mode button display in the user actions menu
        var oTileActionsButton = sap.ui.getCore().byId("ActionModeBtn");
        if (oTileActionsButton) {
            oTileActionsButton.setTooltip(resources.i18n.getText("activateEditMode"));
            oTileActionsButton.setText(resources.i18n.getText("activateEditMode"));
            // only avaiable if the action mode button is in the shell header
            if (oTileActionsButton.setSelected) {
                oTileActionsButton.setSelected(false);
            }
        }
    };

    ActionMode.prototype.toggleActionMode = function (oModel, sSource, dashboardGroups) {
        dashboardGroups = dashboardGroups || [];

        var visibleGroups = dashboardGroups.filter(function (group) {
            return group.getVisible();
        });

        var oData = {
            group: visibleGroups[oModel.getProperty("/topGroupInViewPortIndex")],
            restoreLastFocusedTile: true
        };

        if (oModel.getProperty("/tileActionModeActive")) {
            this._deactivate();

            // if the TileContainer header was focused, we need to restore focus to the closest tile
            var jqLastFocusedHeader = jQuery(".sapUshellTileContainerHeader[tabindex=0]");
            if (jqLastFocusedHeader.length) {
                var jqTileContainer = jqLastFocusedHeader[0].closest(".sapUshellTileContainer");
                if (jqTileContainer) {
                    oData.restoreLastFocusedTileContainerById = jqTileContainer.id;
                }
            }
        } else {
            this._activate();
        }

        this.oEventBus.publish("launchpad", "scrollToGroup", oData);
    };

    /**
     * Apply action/edit mode CSS classes on a group.
     * This function is called when in edit/action mode and tiles were dragged,
     *  since the group is being re-rendered and the dashboard is still in action/edit mode
     */
    ActionMode.prototype.activateGroupEditMode = function (oGroup) {
        var jqGroupElement = jQuery(oGroup.getDomRef()).find(".sapUshellTileContainerContent");

        jqGroupElement.addClass("sapUshellTileContainerEditMode");
    };
    ActionMode.prototype.getHomepageManager = function () {
        if (!this.oHomepageManager) {
            this.oHomepageManager = sap.ushell.components.getHomepageManager();
        }
        return this.oHomepageManager;
    };

    /**
     * Opens the tile menu, presenting the tile's actions
     *
     * Performs the following actions:
     * - Returning the clicked tile to its original appearance
     * - Tries to get an existing action sheet in case actions menu was already opened during this session of action mode
     * - If this is the first time the user opens actions menu during this session of action mode - lazy creation a new action sheet
     * - Gets the relevant tile's actions from launch page service and create buttons accordingly
     * - Open the action sheet by the clicked tile
     *
     * @param oEvent Event object of the tile click action
     */
    ActionMode.prototype._openActionsMenu = function (oEvent, oView) {
        var that = this,
            oTileControl = oView || oEvent.getSource(),
            aActions = [],
            oActionSheet = sap.ui.getCore().byId("TileActions"),
            oActionSheetTarget,
            index,
            aActionsButtons = [],
            noActionsButton,
            oButton,
            oAction,
            oTile,
            fnHandleActionPress,
            coverDiv;

        if (oTileControl) {
            oTile = oTileControl.getBindingContext().getObject().object;
            aActions = this.getHomepageManager().getTileActions(oTile);
        }
        that.oTileControl = oTileControl;
        jQuery(".sapUshellTileActionLayerDivSelected").removeClass("sapUshellTileActionLayerDivSelected");

        coverDiv = jQuery(oEvent.getSource().getDomRef()).find(".sapUshellTileActionLayerDiv");
        coverDiv.addClass("sapUshellTileActionLayerDivSelected");

        //in a locked group we do not show any action
        //(this is here to prevent the tile-settings action added by Dynamic & Static tiles from being opened)
        //NOTE - when removing this check (according to requirements by PO)
        //- we must disable the tileSettings action in a different way
        var oTileModel = oTileControl.getModel();
        var sGroupBindingPath = oTileControl.getParent().getBindingContext().getPath();
        if (aActions.length === 0 || oTileModel.getProperty(sGroupBindingPath + "/isGroupLocked")) {
            // Create a single button for presenting "Tile has no actions" message to the user
            noActionsButton = new Button({
                text: resources.i18n.getText("tileHasNoActions"),
                enabled: false
            });
            aActionsButtons.push(noActionsButton);
        } else {
            for (index = 0; index < aActions.length; index++) {
                oAction = aActions[index];
                // The press handler of a button (representing a single action) in a tile's action sheet
                fnHandleActionPress = (function (oAction) {
                    return function () {
                        that._handleActionPress(oAction, oTileControl);
                    };
                }(oAction));
                oButton = new Button({
                    text: oAction.text,
                    icon: oAction.icon,
                    press: fnHandleActionPress
                });
                aActionsButtons.push(oButton);
            }
        }

        //For tiles - actions menu is opened by "more" icon, for links, there is an action button
        //Which cannot be controlled by FLP code.
        //In case of link, we first try to access the "more" button and open an action sheet by it.
        //Otherwise the action sheet will not be located under the "more" button and other weird things will happen.
        oActionSheetTarget = oEvent.getSource().getActionSheetIcon ? oEvent.getSource().getActionSheetIcon() : undefined;
        if (!oActionSheetTarget) {
            var oMoreAction = sap.ui.getCore().byId(oEvent.getSource().getId() + "-action-more");
            if (oMoreAction) {
                oActionSheetTarget = oMoreAction;
            } else {
                oActionSheetTarget = oEvent.getSource();
            }
        }

        if (!oActionSheet) {
            sap.ui.require(["sap/m/ActionSheet"], function (ActionSheet) {
                oActionSheet = new ActionSheet("TileActions", {
                    placement: PlacementType.Bottom,
                    afterClose: function () {
                        jQuery(".sapUshellTileActionLayerDivSelected").removeClass("sapUshellTileActionLayerDivSelected");
                        var oEventBus = sap.ui.getCore().getEventBus();
                        oEventBus.publish("dashboard", "actionSheetClose", that.oTileControl);
                    }
                });
                that._openActionSheet(oActionSheet, aActionsButtons, oActionSheetTarget);
            });
        } else {
            that._openActionSheet(oActionSheet, aActionsButtons, oActionSheetTarget);
        }
    };

    /*
     *  This function is used to open the Action Sheet on the given target with the provided buttons.
     */
    ActionMode.prototype._openActionSheet = function (oActionSheet, aButtons, oTarget) {
        aButtons = aButtons || [];
        oActionSheet.destroyButtons();
        aButtons.forEach(function (oButton) {
            oActionSheet.addButton(oButton);
        });
        oActionSheet.openBy(oTarget);
    };

    /**
     * Press handler of a button (representing a single action) in a tile's action sheet
     *
     * @param {Object} oAction The event object initiated by the click action on an element in the tile's action sheet.
     *   In addition to the text and icon properties, oAction contains one of the following:
     *     1. A "press" property that includes a callback function.
     *        In this case the action (chosen by the user) is launched by calling the callback is called
     *     2. A "targetUrl" property that includes either a hash part of a full URL.
     *        In this case the action (chosen by the user) is launched by navigating to the URL
     */
    ActionMode.prototype._handleActionPress = function (oAction, oTileControl) {
        if (oAction.press) {
            oAction.press.call(oAction, oTileControl);
        } else if (oAction.targetURL) {
            if (oAction.targetURL.indexOf("#") === 0) {
                hasher.setHash(oAction.targetURL);
            } else {
                window.open(oAction.targetURL, "_blank");
            }
        } else {
            sap.ui.require([
                "sap/m/MessageToast"
            ], function (MessageToast) {
                MessageToast.show("No Action");
            });
        }
    };

    return new ActionMode();
}, /* bExport= */ true);
