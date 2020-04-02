// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define(['sap/ui/core/Renderer','sap/m/ButtonRenderer'],
	function(Renderer, ButtonRenderer) {
	"use strict";

    /**
     * @name sap.ushell.ui.footerbar.UserPreferencesButtonRenderer
     * @static
     * @private
     */
    var UserPreferencesButtonRenderer = Renderer.extend(ButtonRenderer);

    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     * 
     * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
     * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
     */

    return UserPreferencesButtonRenderer;

}, /* bExport= */ true);
