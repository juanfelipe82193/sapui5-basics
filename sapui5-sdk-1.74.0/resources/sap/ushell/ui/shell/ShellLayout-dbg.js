/*!
 * Copyright (c) 2009-2017 SAP SE, All Rights Reserved
 */
// Provides control sap.ushell.ui.shell.ShellLayout.

sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ui/Device",
    "sap/ui/core/Control",
    "sap/ushell/Config",
    "sap/ui/util/Storage",
    "sap/base/Log",
    "sap/ushell/library",
    "sap/ushell/ui/shell/ToolArea",
    "sap/ushell/ui/shell/ShellLayoutRenderer"
], function (jQuery, Device, Control, Config, Storage, Log) {
    "use strict";

    /**
     * Constructor for a new ShellLayout.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @class
     * The shell layout is the base for the shell control which is meant as root control (full-screen) of an application.
     * It was build as root control of the Fiori Launchpad application and provides the basic capabilities
     * for this purpose. Do not use this control within applications which run inside the Fiori Lauchpad and
     * do not use it for other scenarios than the root control usecase.
     * @extends sap.ui.core.Control
     *
     * @author SAP SE
     * @version 1.74.0
     *
     * @constructor
     * @private
     * @since 1.25.0
     * @alias sap.ushell.ui.shell.ShellLayout
     * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
     */
    var ShellLayout = Control.extend("sap.ushell.ui.shell.ShellLayout", /** @lends sap.ushell.ui.shell.ShellLayout.prototype */ { metadata: {

        properties: {
            /**
             * Whether the header can be hidden (manually or automatically). This feature is only available when touch events are supported.
             * @deprecated Since version 1.56, this setting always defaults to false.
             */
            headerHiding: {type: "boolean", group: "Appearance", defaultValue: false},

            /**
             * If set to false, no header (and no items, search, ...) is shown.
             */
            headerVisible: {type: "boolean", group: "Appearance", defaultValue: true},

            toolAreaVisible: {type: "boolean", group: "Appearance", defaultValue: false},

            floatingContainerVisible: {type: "boolean", group: "Appearance", defaultValue: false},

            /**
             * @deprecated Since version 1.68, this setting has no effect.
             */
            backgroundColorForce: {type: "boolean", group: "Appearance", defaultValue: true},

            /**
             * @deprecated Since version 1.65, this setting has no effect.
             */
            showBrandLine: {type: "boolean", group: "Appearance", defaultValue: true},

            /**
             * @deprecated Since version 1.68, this setting has no effect.
             */
            showAnimation: {type: "boolean", group: "Appearance", defaultValue: true},

            enableCanvasShapes: {type: "boolean", group: "Appearance", defaultValue: false}
        },
        aggregations: {
            /**
             * The control to appear in the sidebar (left) area.
             */
            toolArea: {type: "sap.ushell.ui.shell.ToolArea", multiple: false},

            /**
             * The control to appear in the (right) area for the alerts.
             */
            rightFloatingContainer: {type: "sap.ushell.ui.shell.RightFloatingContainer", multiple: false},

            /**
             * Private storage for the internal split container for the canvas.
             */
            canvasSplitContainer: {type: "sap.ushell.ui.shell.SplitContainer", multiple: false},

            /**
             * The action button which is rendered floating in the shell content area.
             * If a custom header is set this aggregation has no effect.
             */
            floatingActionsContainer: {type: "sap.ushell.ui.shell.ShellFloatingActions", multiple: false},

            /**
             * Optional shell footer
             * @since 1.56
             * @private
             */
            footer: {type: "sap.ui.core.Control", multiple: false}
        },
        associations: {
            /**
             * The shell header control.
             */
            header: {type: "sap.ushell.ui.shell.ShellHeader", multiple: false},
            floatingContainer: {type: "sap.ushell.ui.shell.FloatingContainer", multiple: false}
        }
    }});

    ShellLayout._SIDEPANE_WIDTH_PHONE = 13;
    ShellLayout._SIDEPANE_WIDTH_TABLET = 13;
    ShellLayout._SIDEPANE_WIDTH_DESKTOP = 15;

    ShellLayout.prototype.getHeader = function () {
        return sap.ui.getCore().byId(this.getAssociation("header"));
    };

    ShellLayout.prototype.init = function () {
        this._rtl = sap.ui.getCore().getConfiguration().getRTL();
        this._showHeader = true;
        this._useStrongBG = false;

        Device.media.attachHandler(this._handleMediaChange, this, Device.media.RANGESETS.SAP_STANDARD);

        // Manage the headerless state:
        this._oDoable = Config.on("/core/shellHeader/headerVisible").do(this.setHeaderVisible.bind(this));

        // TO-DO: global jquery call found
        if (jQuery.sap.storage) {
            this._oStorage = new Storage(Storage.Type.local, "com.sap.ushell.adapters.local.FloatingContainer");
        }
    };

    ShellLayout.prototype.exit = function () {
        Device.media.detachHandler(this._handleMediaChange, this, Device.media.RANGESETS.SAP_STANDARD);
        if (this._oDoable) {
            this._oDoable.off();
            this._oDoable = null;
        }
    };

    ShellLayout.prototype.onAfterRendering = function () {
        this._setSidePaneWidth();
    };

    ShellLayout.prototype.renderFloatingContainerWrapper = function () {
        this._oFloatingContainerWrapper = document.getElementById("sapUshellFloatingContainerWrapper");

        if (!this._oFloatingContainerWrapper) {
            this._oFloatingContainerWrapper = document.createElement("DIV");
            this._oFloatingContainerWrapper.setAttribute("id", "sapUshellFloatingContainerWrapper");
            this._oFloatingContainerWrapper.classList.add("sapUshellShellFloatingContainerWrapper");
            this._oFloatingContainerWrapper.classList.add("sapUshellShellHidden");
            window.document.body.appendChild(this._oFloatingContainerWrapper);
        }

        if (this._oStorage && this._oStorage.get("floatingContainerStyle")) {
            this._oFloatingContainerWrapper.setAttribute("style", this._oStorage.get("floatingContainerStyle"));
        }
    };

    ShellLayout.prototype.renderFloatingContainer = function (oFloatingContainer) {
        this.renderFloatingContainerWrapper();

        if (oFloatingContainer && !oFloatingContainer.getDomRef()) {
            if (!this._oFloatingContainerWrapper.classList.contains("sapUshellShellHidden")) {
                this._oFloatingContainerWrapper.classList.add("sapUshellShellHidden");
            }
            oFloatingContainer.placeAt("sapUshellFloatingContainerWrapper");
        }
    };

    ShellLayout.prototype.onThemeChanged = function () {
        return !!this.getDomRef();
    };

    //***************** API / Overridden generated API *****************
    ShellLayout.prototype.setToolAreaVisible = function (bVisible) {
        this.setProperty("toolAreaVisible", !!bVisible, true);
        if (this.getToolArea()) {
            this.getToolArea().toggleStyleClass("sapUshellShellHidden", !bVisible);
            this.applySplitContainerSecondaryContentSize();
            return this;
        }

        if (bVisible) {
            sap.ui.require(["sap/ushell/EventHub"], function (EventHub) {
                EventHub.emit("CreateToolArea");
            });
            return this;
        }

        Log.debug("Tool area not created but visibility updated", null, "sap.ushell.ShellLayout");
        return this;
    };

    ShellLayout.prototype.getToolAreaSize = function () {
        if (this.getToolAreaVisible()) {
            if (this.getToolArea().hasItemsWithText()) {
                return "15rem";
            }

            return "3.0625rem";
        }

        return "0";
    };

    /**
     * Applies the current status to the content areas (CSS left and width properties).
     *
     * @protected
     */
    ShellLayout.prototype.applySplitContainerSecondaryContentSize = function () {
        var sToolAreaSize = this.getToolAreaSize();
        this.getCanvasSplitContainer().applySecondaryContentSize(sToolAreaSize);
    };

    ShellLayout.prototype.setFloatingContainer = function (oContainer) {
        this.setAssociation("floatingContainer", oContainer, true);
        this.renderFloatingContainer(oContainer);
    };

    ShellLayout.prototype.setFloatingContainerVisible = function (bVisible) {
        // setting the actual ShellLayout property
        this.setProperty("floatingContainerVisible", !!bVisible, true);
        if (this.getDomRef()) {
            var oFloatingContainerWrapper = window.document.getElementById("sapUshellFloatingContainerWrapper");
            // Only in case this is first time the container is opened and there is no style for it in local storage
            if (bVisible && this._oStorage && !this._oStorage.get("floatingContainerStyle")) {
                // TO-DO: global jquery call found
                var emSize = jQuery(".sapUshellShellHeadItm").position() ? jQuery(".sapUshellShellHeadItm").position().left : 0;
                var iLeftPos = (jQuery(window).width() - jQuery("#shell-floatingContainer").width() - emSize) * 100 / jQuery(window).width();
                var iTopPos = jQuery(".sapUshellShellHeader").height() * 100 / jQuery(window).height();
                oFloatingContainerWrapper.setAttribute("style", "left:" + iLeftPos + "%;top:" + iTopPos + "%;position:absolute;");
                this._oStorage.put("floatingContainerStyle", oFloatingContainerWrapper.getAttribute("style"));
            }

            var oSFCW = window.document.querySelector(".sapUshellShellFloatingContainerWrapper");
            if (oSFCW && bVisible === oSFCW.classList.contains("sapUshellShellHidden")) {
                oSFCW.classList.toggle("sapUshellShellHidden");
            }
        }
        return this;
    };

    ShellLayout.prototype.setFloatingActionsContainer = function (oContainer) {
        this.setAggregation("floatingActionsContainer", oContainer, true);
    };

    ShellLayout.prototype._setStrongBackground = function () {};

    //***************** Private Helpers *****************

    ShellLayout.prototype._setSidePaneWidth = function (sRange) {
        var oSplitContainer = this.getCanvasSplitContainer();
        if (oSplitContainer) {
            if (!sRange) {
                sRange = Device.media.getCurrentRange(Device.media.RANGESETS.SAP_STANDARD).name;
            }

            var w = ShellLayout["_SIDEPANE_WIDTH_" + sRange.toUpperCase()] + "rem";
            oSplitContainer.setSecondaryContentSize(w);
        }
    };

    ShellLayout.prototype._handleMediaChange = function (mParams) {
        if (!this.getDomRef()) {
            return false;
        }
        this._setSidePaneWidth(mParams.name);
    };

    return ShellLayout;

}, true /* bExport */);
