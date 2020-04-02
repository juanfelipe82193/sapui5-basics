// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The <code>actions</code> contract.
 *               since 1.32 the <code>types</code> contract.
 */
(function () {
  "use strict";
  /*global jQuery, sap */

  // Note: jQuery might not yet be available!
  if (typeof jQuery === "function" && jQuery.sap) {
    jQuery.sap.declare("sap.ui2.srvc.contracts.actions");
    jQuery.sap.declare("sap.ui2.srvc.contracts.types");
    jQuery.sap.require("sap.ui2.srvc.chip");
  }

  /**
   * @namespace The namespace for the CHIP API's <code>actions</code> contract, which
   * allows you to provide a CHIP's actions with all related functionality.
   * @name chip.actions
   * @since 1.25.0
   */

  sap.ui2.srvc.Chip.addContract("actions", function (oChipInstance) {
    var fnActionsProvider;

    /**
     * Determines the callback function which provides the internal actions for this CHIP. The
     * callback has to return an array of actions. Action is an object with the following
     * properties: text, icon and targetURL or a press handler.
     * @example:
     * <code>[
     *        {
     *            text: "Some Action",
     *            icon: "sap-icon://action",
     *            targetURL: "#SemanticObject-Action"
     *        },
     *        {
     *            text: "Settings",
     *            icon: "sap-icon://action-settings",
     *            press: function (oEvent){
     *                //Open settings UI
     *            }
     *        }
     *       ]
     * </code>.
     *
     * An embedding application calls this function each time it wants to display the CHIP's
     * actions.
     *
     * Use <code>Function.prototype.bind()</code> to determine the callback's <code>this</code> or
     * some of its arguments.
     *
     * @name chip.actions.setActionsProvider
     * @function
     * @since 1.25.0
     * @param {function} fnProvider
     *   a callback which returns an array of action objects representing this CHIP's internal actions.
     */
    this.setActionsProvider = function (fnProvider) {
      if (typeof fnProvider !== "function") {
        throw new sap.ui2.srvc.Error("CHIP actions provider is not a function", "chip.actions");
      }
      fnActionsProvider = fnProvider;
    };

    /**
     * @namespace The namespace for the contract interface (to be used by a page builder) for
     * the <code>actions</code> contract, which allows you to get a CHIP's actions with all related functionality.
     * @name contract.actions
     * @since 1.25.0
     */
    return {
      /**
       * Returns this CHIP's internal actions, if available.
       *
       * @returns {Array}
       *   this CHIP's internal actions array
       *
       * @name contract.actions.getActions
       * @function
       * @since 1.25.0
       *
       * @see chip.actions.setActionsProvider
       */
      getActions: function () {
        if (fnActionsProvider) {
          return fnActionsProvider();
        }
        return [];
      }
    };
  });

  // the "contracts" mechanism requires a host to provide the functionality
  // (it is not "optional")
  // When the EP uses the ABAP JS sources, the contract should be made available.
  // thus we make the contract available in this *file* to avoid
  // having to have a separate script tag within the EP resource
  // (note that contracts due to ancient design can not be required)

  /**
   * @namespace The namespace for the CHIP API's <code>types</code> contract, which allows the CHIP
   * to offer multiple visualizations from which the page builder can choose.
   * @name chip.types
   * @since 1.32.0
   */

  sap.ui2.srvc.Chip.addContract("types", function (oChipInstance) {
    var sCurrentType,
      fnSetTypeHandler;

    /**
     * Attaches the given event handler to the change event which is fired whenever the page builder
     * wants to change the current type of visualization. The CHIP has to react accordingly and
     * change the visualization after the handler is called. The event handler should return a
     * <code>jQuery.Deferred</code> object's promise to inform the caller whether the visualization
     * has been changed (or failed). In the latter case an error message should be provided.
     * In case the type was changed before the handler was attached, the handler gets called
     * immediately after registration. This also works when the handler is overwritten by a
     * different one.
     *
     * Use <code>Function.prototype.bind()</code> to determine the event handler's
     * <code>this</code> or some of its arguments.
     *
     * Note: Without such an event handler, it will not be possible to change the visualization of
     * the CHIP during runtime.
     *
     * @name chip.types.attachTypeChange
     * @function
     *
     * @param {function (string)} fnHandler
     *   the handler for changing the visualization type of the CHIP. The first argument will be
     *   the set type. The function <b>must</b> return a <code>jQuery.Deferred</code>
     *   object's promise.
     *
     * @throws Error if <code>fnHandler</code> is not a function or if fnHandler.
     * @throws If fnHandler is directly called (because a type was cached) and throws an error.
     *
     * @since 1.32.0
     * @see contract.types.setType
     * @see chip.types.getAvailableTypes
     */
    this.attachSetType = function (fnHandler) {
      if (typeof fnHandler !== "function") {
        throw new sap.ui2.srvc.Error("Change event handler is not a function",
          "chip.types");
      }
      if (fnSetTypeHandler === fnHandler) {
        // nothing to do, especially do not call the handler again (assumption: better performance)
        return;
      }
      fnSetTypeHandler = fnHandler;

      // a type was already set, so fire the new handler directly
      if (sCurrentType) {
        // do not catch errors here -> fail early (the CHIP throws the error so it has to catch it)
        fnSetTypeHandler(sCurrentType);
      }
    };

    /**
     * @namespace The namespace for the contract interface (to be used by a page builder) for
     * the <code>types</code> contract, which allows you to change the CHIP's type of visualization.
     * @name contract.types
     * @since 1.32.0
     */
    return { // contract
      /**
       * Returns the list of available types of visualization. The types are always lower case.
       *
       * @name chip.types.getAvailableTypes
       * @function
       * @returns {string[]}
       *   the available tile types in lower case, e.g. <code>["tile", "link"]</code>
       * @since 1.32.0
       */
      getAvailableTypes : function () {
        // note: getAvailableTypes does a toLowerCase
        return oChipInstance.getChip().getAvailableTypes();
      },

      /**
       * Informs the CHIP to change it's visualization type to <code>sType</code>. In case the CHIP
       * has not attached an handler for this event yet, the contract will call the handler directly
       * while attaching it.
       *
       * @param {string} sType
       *   The type to be set.
       *   Note: Before comparison <code>sType.toLowerCase()</code> will be used.
       *
       * @throws Error if <code>sType</code> is not valid.
       *
       * @name contract.types.setType
       * @function
       * @since 1.32.0
       *
       * @see chip.types.attachSetType
       * @see chip.types.getAvailableTypes
       */
      setType: function (sType) {
        var sTypeLowerCase;
        if (typeof sType !== "string" || sType === "") {
          throw new sap.ui2.srvc.Error("The given type is not a string",
            "contract.types");
        }
        sTypeLowerCase = sType.toLowerCase();
        if (this.getAvailableTypes().indexOf(sTypeLowerCase) < 0) {
          throw new sap.ui2.srvc.Error("The CHIP does not support type '" + sTypeLowerCase + "'",
            "contract.types");
        }

        // type is valid. cache it in case a (new) handler is registered
        sCurrentType = sTypeLowerCase;

        if (!fnSetTypeHandler) {
          return;
        }
        try {
          fnSetTypeHandler(sTypeLowerCase);
        } catch (e) {
          jQuery.sap.log.error("Could not set CHIP type '" + sTypeLowerCase + "': "
              + (e.message || e.toString()), null, "chip.types");
        }
      }
    };

  });
}());
