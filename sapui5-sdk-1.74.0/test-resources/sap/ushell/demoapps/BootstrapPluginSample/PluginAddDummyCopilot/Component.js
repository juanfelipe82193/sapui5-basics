// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/Component",
    "sap/ui/core/UIComponent",
    "sap/ui/core/ComponentContainer"
], function (Component, UIComponent, ComponentContainer) {
    "use strict";

    return Component.extend("sap.ushell.demo.PluginAddDummyCopilot.Component", {
        metadata : {
            manifest: "json"
        },

        init: function () {
            sap.ui.getCore().getEventBus()
                .subscribe("launchpad", "shellFloatingContainerIsDocked", this._handleDocking, this)
                .subscribe("launchpad", "shellFloatingContainerIsUnDocked", this._handleDocking, this)
                .subscribe("launchpad", "shellFloatingContainerIsUnDockedOnResize", this._handleDocking, this);

            this._addCopilotButton(this._openCopilot);
        },

        _handleDocking: function (sChannelId, sEventId, oData) {
            if (sChannelId === "launchpad") {
                if (sEventId === "shellFloatingContainerIsDocked" || sEventId === "shellFloatingContainerIsUnDocked" || sEventId === "shellFloatingContainerIsUnDockedOnResize") {
                    if (this._oCopilotCoreComponentContainer && this._oCopilotCoreComponentContainer.getParent()) {
                        this._oCopilotCoreComponentContainer.$().css("height", this._calculateCopilotContainerHeight());
                    }
                }
            }
        },

        _openCopilot: function () {
            var oRenderer = this._getFioriRenderer();

            if (oRenderer.getFloatingContainerVisiblity()) {
                oRenderer.setFloatingContainerVisibility(false);
                return;
            }

            var oComponent = sap.ui.getCore().createComponent({
                name: "sap.ushell.demo.PluginAddDummyCopilot.component",
            });

            this._oCopilotCoreComponentContainer = new ComponentContainer({
                height: this._calculateCopilotContainerHeight(),
                width: this._calculateCopilotContainerWidth(),
                component: oComponent
            });

            oRenderer.setFloatingContainerContent(this._oCopilotCoreComponentContainer);
            oRenderer.setFloatingContainerVisibility(true);
            setTimeout(function () {
                oRenderer.setFloatingContainerDragSelector(".copilotDragableHandle");
            }, 1000);
        },

        _addCopilotButton: function (pressHandler) {
            var renderer = this._getFioriRenderer();
            renderer.addHeaderEndItem(
                "sap.ushell.ui.shell.ShellHeadItem", {
                    tooltip: "Dummy copilot",
                    ariaLabel: "Dummy copilot",
                    text: "Dummy copilot",
                    icon: sap.ui.core.IconPool.getIconURI("co"),
                    id: "copilotBtn",
                    press: jQuery.proxy(pressHandler, this)
                },
                true,
                false);
        },

        _getFioriRenderer: function () {
            return sap.ushell.Container.getRenderer("fiori2");
        },

        _calculateCopilotContainerWidth: function () {
            if (sap.ui.Device.system.phone) {
                return Math.min(jQuery(window).width() / parseFloat(jQuery("html").css("font-size")), 26) + "rem";
            }
            return "100%";
        },

        _isDocked: function () {
            var sDockingState = this._getFioriRenderer().getFloatingContainerState();
            return sDockingState === "docked:left" || sDockingState === "docked:right";
        },

        _calculateCopilotContainerHeight: function (iModify) {
            iModify = (typeof iModify !== 'undefined' && jQuery.isNumeric(iModify)) ? iModify : 0;

            if (sap.ui.Device.system.phone) {
                return (jQuery(window).height() / parseFloat(jQuery("html").css("font-size"))) + iModify + "rem";
            }

            if (this._isDocked()) {
                return "100%";
            }

            var nWindowREMHeight = parseInt(jQuery(window).height() / parseFloat(jQuery("html").css("font-size")), 10) - 8; // -8 because the copilot window starts top:8rem
            return Math.min(nWindowREMHeight, 46) + iModify + "rem";
        },

        exit: function () {
        }

    });
});
