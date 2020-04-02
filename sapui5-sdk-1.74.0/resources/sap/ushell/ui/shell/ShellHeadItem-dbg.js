// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

// Provides control sap.ushell.ui.shell.ShellHeadItem.
sap.ui.define([
    "sap/ui/core/Control",
    "sap/ui/core/IconPool",
    "sap/base/util/ObjectPath"
], function (
    Control,
    IconPool,
    ObjectPath
) {
    "use strict";

    /**
     * Constructor for a new ShellHeadItem.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @class
     * Header Action item of the Shell.
     * @extends sap.ui.core.Control
     *
     * @author SAP SE
     * @version 1.74.0
     *
     * @constructor
     * @private
     * @since 1.15.1
     * @alias sap.ushell.ui.shell.ShellHeadItem
     * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
     */
    var ShellHeadItem = Control.extend("sap.ushell.ui.shell.ShellHeadItem", /** @lends sap.ushell.ui.shell.ShellHeadItem.prototype */ {
        metadata: {
            properties: {
                /**
                 * If set to true, a divider is displayed before the item.
                 * @deprecated Since version 1.18.
                 * Dividers are not supported anymore.
                 */
                startsSection: {
                    type: "boolean",
                    group: "Appearance",
                    defaultValue: false,
                    deprecated: true
                },
                /**
                 * If set to true, a separator is displayed after the item.
                 * @since 1.22.5
                 * @deprecated since version 1.62, this property is never used in Fiori 2+ and is ignored
                 */
                showSeparator: {
                    type: "boolean",
                    group: "Appearance",
                    defaultValue: false,
                    deprecated: true
                },
                /**
                 * If set to false, the button isn't clickable and displayed as disabled.
                 * @since 1.38
                 */
                enabled: {
                    type: "boolean",
                    group: "Appearance",
                    defaultValue: true
                },
                /**
                 * If set to true, the item gets a special design.
                 */
                selected: {
                    type: "boolean",
                    group: "Appearance",
                    defaultValue: false
                },
                /**
                 * If set to true, a theme dependent marker is shown on the item.
                 * @deprecated Since version 1.18.
                 * Markers should not be used anymore.
                 */
                showMarker: {
                    type: "boolean",
                    group: "Appearance",
                    defaultValue: false,
                    deprecated: true
                },
                /**
                 * The icon of the item, either defined in the sap.ui.core.IconPool or an URI to a custom image. An icon must be set.
                 */
                icon: {
                    type: "sap.ui.core.URI",
                    group: "Appearance",
                    defaultValue: null
                },
                target: {
                    type: "sap.ui.core.URI",
                    group: "Appearance",
                    defaultValue: null
                },
                ariaLabel: {
                    type: "string",
                    group: "Appearance",
                    defaultValue: null
                },
                addAriaHiddenFalse: {
                    type: "boolean",
                    group: "Appearance",
                    defaultValue: false
                },
                /**
                 * The text of the item. Text is only visible if the item is not rendered as part of the Header
                 * i.e. if it is rendered as part of an overflow button in a Popover
                 * @since 1.38
                 */
                text: {
                    type: "string",
                    group: "Appearance",
                    defaultValue: null
                },
                floatingNumber: {
                    type: "int",
                    group: "Appearance",
                    defaultValue: null
                },
                floatingNumberMaxValue: {
                    type: "int",
                    group: "Appearance",
                    defaultValue: 999
                }
            },
            events: {
                /**
                 * Event is fired when the user presses the item.
                 */
                press: {}
            }
        },
        renderer: {
            apiVersion: 2,
            render: function (rm, shellHeadItem) {
                var oAccessabilityState = {
                    role: "button"
                };

                if (shellHeadItem.getAriaLabel()) {
                    oAccessabilityState.label = shellHeadItem.getAriaLabel();
                }

                if (shellHeadItem.getAddAriaHiddenFalse()) {
                    oAccessabilityState.hidden = false;
                }

                rm.openStart("a", shellHeadItem);
                rm.attr("tabindex", "0");
                if ((shellHeadItem.getTarget() || "") !== "") {
                    rm.attr("href", shellHeadItem.getTarget());
                }

                rm.accessibilityState(oAccessabilityState);

                if (shellHeadItem.getFloatingNumber() > 0) {
                    rm.class("sapUshellShellHeadItmCounter");
                    rm.attr("data-counter-content", shellHeadItem.getDisplayFloatingNumber());
                }

                rm.class("sapUshellShellHeadItm");

                if (!shellHeadItem.getEnabled()) {
                    rm.class("sapUshellShellHeadItmDisabled");
                }

                if (!shellHeadItem.getVisible()) {
                    rm.class("sapUshellShellHidden");
                }

                if (shellHeadItem.getSelected()) {
                    rm.class("sapUshellShellHeadItmSel");
                }

                if (shellHeadItem.getTooltip_AsString()) {
                    rm.attr("title", shellHeadItem.getTooltip_AsString());
                }
                rm.openEnd(); // a - tag

                rm.openStart("span"); // actual icon is placed into the span
                rm.class("sapUshellShellHeadItmCntnt");

                var oIcon = shellHeadItem.getIcon();
                var oIconInfo = IconPool.isIconURI(oIcon) && IconPool.getIconInfo(oIcon);
                if (oIconInfo) {
                    rm.style("font-family", oIconInfo.fontFamily);
                    rm.openEnd(); // span - tag
                    rm.text(oIconInfo.content);
                } else {
                    rm.openEnd(); // span - tag
                    rm.voidStart("img");
                    rm.attr("id", shellHeadItem.getId() + "-img-inner");
                    rm.attr("src", oIcon);
                    rm.voidEnd(); // img - tag
                }

                rm.close("span");
                rm.close("a");
            }
        }
    });

    ShellHeadItem.prototype.getDisplayFloatingNumber = function () {
        var iNumber = this.getFloatingNumber(),
            iMaxValueNumber = this.getFloatingNumberMaxValue();
        var sDisplayNumber = iNumber + "";
        if (iNumber > iMaxValueNumber) {
            sDisplayNumber = iMaxValueNumber + "+";
        }
        return sDisplayNumber;
    };

    ShellHeadItem.prototype.onclick = function (oEvent) {
        if (this.getEnabled()) {
            this.firePress();
            // IE always interprets a click on an anker as navigation and thus triggers the
            // beforeunload-event on the window. Since a ShellHeadItem never has a valid href-attribute,
            // the default behavior should never be triggered
            if (!this.getTarget()) {
                oEvent.preventDefault();
            }
        }
    };

    ShellHeadItem.prototype.onsapspace = ShellHeadItem.prototype.onclick;

    ShellHeadItem.prototype.onsapenter = ShellHeadItem.prototype.onclick;

    // in case someone already using the API sap.ushell.renderers.fiori2.RendererExtensions.addHeaderItem
    // with sap.ui.unified.ShellHeadItem() instance
    ObjectPath.set("sap.ui.unified.ShellHeadItem", ShellHeadItem);

    return ShellHeadItem;

}, true /* bExport */);