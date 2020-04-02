// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The <code>refresh</code> contract.
 */
(function () {
  "use strict";
  /*global jQuery, sap */

  // Note: jQuery might not yet be available!
  if (typeof jQuery === "function" && jQuery.sap) {
    jQuery.sap.declare("sap.ui2.srvc.contracts.refresh");
    jQuery.sap.require("sap.ui2.srvc.chip");
  }

  /**
   * @namespace The namespace for the CHIP API's <code>refresh</code> contract, which allows you to
   * handle refresh events.
   * @name chip.refresh
   * @since 1.2.0
   */

  sap.ui2.srvc.Chip.addContract("refresh", function (oChipInstance) {
    /**
     * Attaches the given event handler to the "refresh" event which is fired
     * whenever the user requests a refresh of this CHIP's content.
     *
     * Use <code>Function.prototype.bind()</code> to determine the event handler's
     * <code>this</code> or some of its arguments.
     *
     * Note: Without such an event handler, the CHIP will be recreated to enforce a refresh!
     *
     * @name chip.refresh.attachRefresh
     * @function
     * @since 1.2.0
     * @param {function} fnEventHandler
     *   the event handler for the "refresh" event
     */
    this.attachRefresh = function (fnEventHandler) {
      oChipInstance.attachRefresh(fnEventHandler);
    };
  });
}());
