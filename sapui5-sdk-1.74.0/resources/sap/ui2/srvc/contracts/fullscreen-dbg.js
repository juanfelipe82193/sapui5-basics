// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The <code>fullscreen</code> contract.
 */
(function () {
  "use strict";
  /*global jQuery, sap */

  // Note: jQuery might not yet be available!
  if (typeof jQuery === "function" && jQuery.sap) {
    jQuery.sap.declare("sap.ui2.srvc.contracts.fullscreen");
    jQuery.sap.require("sap.ui2.srvc.chip");
  }

  /**
   * @namespace The namespace for the CHIP API's <code>fullscreen</code> contract, which allows you
   * to deal with toggling of fullscreen mode.
   * @name chip.fullscreen
   * @since 1.2.0
   */

  sap.ui2.srvc.Chip.addContract("fullscreen", function (oChipInstance) {
    /**
     * Tells whether fullscreen mode is currently turned on.
     *
     * @name chip.fullscreen.getFullscreen
     * @function
     * @since 1.2.0
     * @returns {boolean}
     *   whether fullscreen mode is turned on
     */
    this.getFullscreen = function () {
      return oChipInstance.getFullscreen();
    };

    /**
     * Turns fullscreen mode on as specified.
     *
     * @name chip.fullscreen.setFullscreen
     * @function
     * @since 1.2.0
     * @param {boolean} bOn
     *   whether fullscreen mode is turned on
     */
    this.setFullscreen = function (bOn) {
      oChipInstance.setFullscreen(bOn);
    };

    /**
     * Attaches the given event handler to the "fullscreen" event which is fired
     * whenever fullscreen mode is toggled.
     *
     * Use <code>Function.prototype.bind()</code> to determine the event handler's
     * <code>this</code> or some of its arguments.
     *
     * Note: Without such an event handler, the CHIP will simply continue to display the
     * same content, no matter whether fullscreen mode is on or off.
     *
     * @name chip.fullscreen.attachFullscreen
     * @function
     * @since 1.2.0
     * @param {function} fnEventHandler
     *   the event handler for the "fullscreen" event
     */
    this.attachFullscreen = function (fnEventHandler) {
      oChipInstance.attachFullscreen(fnEventHandler);
    };
  });
}());
