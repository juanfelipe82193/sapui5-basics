// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

// Provides control sap.ushell.ui.shell.ShellHeadItem.
sap.ui.define([
    "sap/ui/core/CustomData",
    "sap/base/Log",
    "sap/ui/events/F6Navigation",
    "sap/ui/core/library"
], function (
    CustomData,
    Log,
    F6Navigation,
    coreLibrary
) {
    "use strict";

    // shortcut for sap.ui.core.ID
    var ID = coreLibrary.ID;

    var AccessibilityCustomData = CustomData.extend("sap.ushell.ui.launchpad.AccessibilityCustomData"),
        fnOrigcheckWriteToDom = CustomData.prototype._checkWriteToDom;

    AccessibilityCustomData.prototype._checkWriteToDom = function (oRelated) {
        var sKey = this.getKey().toLowerCase(),
            bIsAccessibilityOn = sap.ui.getCore().getConfiguration().getAccessibility();
        if (!bIsAccessibilityOn) {
            return;
        }
        if (sKey.indexOf("aria") === 0 || sKey === "role" || sKey === "tabindex") {
            if (!this.getWriteToDom()) {
                return null;
            }
            var value = this.getValue();

            if (typeof value !== "string") {
                Log.error("CustomData with key " + sKey + " should be written to HTML of " + oRelated + " but the value is not a string.");
                return null;
            }

            if (!(ID.isValid(sKey)) || (sKey.indexOf(":") != -1)) {
                Log.error("CustomData with key " + sKey + " should be written to HTML of " + oRelated + " but the key is not valid (must be a valid sap.ui.core.ID without any colon).");
                return null;
            }

            if (sKey == F6Navigation.fastNavigationKey) {
                value = /^\s*(x|true)\s*$/i.test(value) ? "true" : "false"; // normalize values
            } else if (sKey.indexOf("sap-ui") == 0) {
                Log.error("CustomData with key " + sKey + " should be written to HTML of " + oRelated + " but the key is not valid (may not start with 'sap-ui').");
                return null;
            }
            return { key: sKey, value: value };
        }
        return fnOrigcheckWriteToDom.apply(this, arguments);
    };

    return AccessibilityCustomData;
});
