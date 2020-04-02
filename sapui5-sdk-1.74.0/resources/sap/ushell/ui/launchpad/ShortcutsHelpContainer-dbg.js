/*!
 * Copyright (c) 2009-2017 SAP SE, All Rights Reserved
 */

// Provides control sap.ushell.ui.launchpad.ShortcutsHelpContainer
sap.ui.define([ "sap/ui/core/Control", "./ShortcutsHelpContainerRenderer" ], function (Control /*, ShortcutsHelpContainerRenderer */) {
    "use strict";

    /**
     * Constructor for a new ui/launchpad/ShortcutsHelpContainer.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @class
     * A container that arranges the helper for shortcuts (open by ctrl+f1).
     * @extends sap.ui.core.Control
     *
     * @constructor
     * @public
     * @name sap.ushell.ui.launchpad.ShortcutsHelpContainer
     */
    var ShortcutsHelpContainer = Control.extend("sap.ushell.ui.launchpad.ShortcutsHelpContainer", {metadata : {
        aggregations : {
            content: {type : "sap.ui.core.Element", multiple : true, singularName : "content"}
        }
    }});

    return ShortcutsHelpContainer;
});