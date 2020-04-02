// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/*global jQuery, sap*/
/**
 * @class ShellFloatingAction renderer.
 * @static
 * 
 * @private
 */
sap.ui.define(['sap/ui/core/Renderer', 'sap/m/ButtonRenderer'],
    function (Renderer, ButtonRenderer) {
        "use strict";


        /**
         * Renderer for the sap.ushell.ui.shell.ShellFloatingAction
         * @namespace
         */
        var ShellFloatingActionRenderer = Renderer.extend(ButtonRenderer);


        return ShellFloatingActionRenderer;

    }, /* bExport= */ true);
