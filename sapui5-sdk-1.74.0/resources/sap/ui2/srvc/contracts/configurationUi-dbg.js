// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The <code>configurationUi</code> contract.
 */
(function () {
  "use strict";
  /*global jQuery, sap */

  // Note: jQuery might not yet be available!
  if (typeof jQuery === "function" && jQuery.sap) {
    jQuery.sap.declare("sap.ui2.srvc.contracts.configurationUi");
    jQuery.sap.require("sap.ui2.srvc.chip");
  }

  /**
   * @namespace The namespace for the CHIP API's <code>configurationUi</code> contract, which
   * allows you to provide a CHIP-specific configuration UI with all related functionality.
   * @name chip.configurationUi
   * @since 1.11.0
   */

  sap.ui2.srvc.Chip.addContract("configurationUi", function (oChipInstance) {
    var fnCancelHandler,
      fnDisplayHandler,
      fnDirtyProvider,
      bEnabled = false,
      fnSaveHandler,
      fnUiProvider;

    /**
     * Attaches the given event handler to the "cancel" event which is fired whenever the user
     * chooses to cancel configuration. You can inform the user about unsaved changes by
     * setting a "dirty" provider.
     *
     * Use <code>Function.prototype.bind()</code> to determine the event handler's
     * <code>this</code> or some of its arguments.
     *
     * Note: Without such an event handler, it will not be possible to cancel the configuration UI
     * for this CHIP.
     *
     * @name chip.configurationUi.attachCancel
     * @function
     * @since 1.11.0
     * @param {function} fnEventHandler
     *   event handler for canceling configuration
     *
     * @see chip.configurationUi.attachSave
     * @see chip.configurationUi.setDirtyProvider
     */
    this.attachCancel = function (fnEventHandler) {
      if (typeof fnEventHandler !== "function") {
        throw new sap.ui2.srvc.Error("Cancel event handler is not a function",
          "chip.configurationUi");
      }
      fnCancelHandler = fnEventHandler;
    };

    /**
     * Attaches the given event handler to the "save" event which is fired whenever the user
     * chooses to save the current configuration. The event handler should return a
     * <code>jQuery.Deferred</code> object's promise to inform the caller whether the save
     * operation has been successful or not. In the latter case an error message is provided.
     *
     * Use <code>Function.prototype.bind()</code> to determine the event handler's
     * <code>this</code> or some of its arguments.
     *
     * Note: Without such an event handler, it will not be possible to save configurations for this
     * CHIP.
     *
     * @name chip.configurationUi.attachSave
     * @function
     * @since 1.11.0
     * @param {function} fnEventHandler
     *   event handler for saving the current configuration; returns a <code>jQuery.Deferred</code>
     *   object's promise
     *
     * @see chip.configurationUi.attachCancel
     */
    this.attachSave = function (fnEventHandler) {
      if (typeof fnEventHandler !== "function") {
        throw new sap.ui2.srvc.Error("Save event handler is not a function",
          "chip.configurationUi");
      }
      fnSaveHandler = fnEventHandler;
    };

    /**
     * Inform the embedding application that the user has triggered configuration of this CHIP.
     * The embedding application will get this CHIP's configuration UI from the callback determined
     * via <code>chip.configurationUi.setUiProvider()</code> and display it with
     * additional "save" and "cancel" buttons. If these are pressed, the CHIP instance is informed
     * via the corresponding "save" and "cancel" events.
     *
     * @name chip.configurationUi.display
     * @function
     * @since 1.11.0
     *
     * @see chip.configurationUi.attachCancel
     * @see chip.configurationUi.attachSave
     * @see chip.configurationUi.setUiProvider
     */
    this.display = function () {
      if (fnDisplayHandler) {
        fnDisplayHandler();
      }
    };

    /**
     * Tells whether configuration of CHIPs is enabled. Note that this value is constant throughout
     * a CHIP's lifetime. If configuration is enabled, CHIPs should provide a way for the user to
     * trigger configuration and should not display live data (as administrators will not have the
     * corresponding permissions). This trigger should then inform the embedding application to
     * display the configuration UI.
     *
     * @name chip.configurationUi.isEnabled
     * @function
     * @since 1.11.0
     * @returns {boolean}
     *   whether configuration is enabled
     *
     * @see chip.configurationUi.display
     */
    this.isEnabled = function () {
      return bEnabled;
    };

    /**
     * Tells whether this CHIP is readOnly.
     * Before calling this method please ensure that it is available.
     * (Extension of an already existing contract)
     *
     * @name chip.configurationUi.isReadOnly
     * @function
     * @returns {boolean}
     *   whether this CHIP instance is readOnly
     * @since 1.32.0
     */
    this.isReadOnly = function () {
      return oChipInstance.isReadOnly();
    };

    /**
     * Determines the callback function which provides the configuration UI's "dirty" state for
     * this CHIP. The callback has to return a <code>boolean</code> value telling whether this
     * CHIP's configuration UI is currently in a "dirty" state, i.e. contains unsaved changes.
     *
     * An embedding application calls this function each time the user wants to cancel the CHIP's
     * configuration UI. A confirmation dialog will be presented to the user in case the UI is
     * "dirty".
     *
     * Use <code>Function.prototype.bind()</code> to determine the callback's <code>this</code> or
     * some of its arguments.
     *
     * Note: Without such a callback, it will not be possible to inform the user about unsaved
     * changes.
     *
     * @name chip.configurationUi.setDirtyProvider
     * @function
     * @since 1.11.0
     * @param {function} fnProvider
     *   a callback which returns a <code>boolean</code> value telling whether this CHIP's
     *   configuration UI is currently in a "dirty" state
     *
     * @see chip.configurationUi.attachCancel
     */
    this.setDirtyProvider = function (fnProvider) {
      fnDirtyProvider = fnProvider;
    };

    /* eslint-disable valid-jsdoc*/ // &lt; &gt; are confusing eslint
    /**
     * Determines the callback function which provides the configuration UI for this CHIP. The
     * callback has to return an SAPUI5 control (<code>sap.ui.core.Control</code>), which, for
     * example, can be a view or a component wrapped into a
     * <code>sap.ui.core.ComponentContainer</code>.
     *
     * An embedding application calls this function each time it wants to display the CHIP's
     * configuration UI. Once the user chooses to save or cancel the configuration, the UI will be
     * removed from the embedding application's UI, but not destroyed! Use the event handlers for
     * the corresponding "save" and "cancel" events to clean up the UI as necessary (e.g. destroy
     * it).
     *
     * Use <code>Function.prototype.bind()</code> to determine the callback's <code>this</code> or
     * some of its arguments.
     *
     * Note: Without such a callback, it will not be possible to configure this CHIP.
     *
     * @name chip.configurationUi.setUiProvider
     * @function
     * @since 1.11.0
     * @param {function (map &lt;string,string&gt;)} fnProvider
     *   a callback which returns an SAPUI5 control (<code>sap.ui.core.Control</code>)
     *   representing this CHIP's configuration UI.
     *   Since 1.21.0 an optional parameter map can be passed to the UI provider. This map can be
     *   used for example to pass default configuration values to the UI.
     *
     * @see chip.configurationUi.attachCancel
     * @see chip.configurationUi.attachSave
     */
    this.setUiProvider = function (fnProvider) {
      fnUiProvider = fnProvider;
    };
    /* eslint-enable valid-jsdoc*/

    /**
     * @namespace The namespace for the contract interface (to be used by a page builder) for
     * the <code>configurationUi</code> contract, which allows you to use a CHIP-specific
     * configuration UI with all related functionality.
     * @name contract.configurationUi
     * @since 1.11.0
     */
    return {
      /**
       * Attaches the given event handler to the "display" event which is fired by the
       * CHIP instance whenever the user has triggered configuration of this CHIP.
       *
       * @param {function} fnEventHandler
       *   the event handler for the "display" event
       *
       * @name contract.configurationUi.attachDisplay
       * @function
       * @since 1.11.0
       *
       * @see chip.configurationUi.display
       */
      attachDisplay: function (fnEventHandler) {
        if (typeof fnEventHandler !== "function") {
          throw new sap.ui2.srvc.Error("Display event handler is not a function",
            "sap.ui2.srvc.ChipInstance");
        }
        fnDisplayHandler = fnEventHandler;
      },

      /**
       * Fires the "cancel" event on this CHIP instance's configuration UI.
       *
       * @name contract.configurationUi.fireCancel
       * @function
       * @since 1.11.0
       *
       * @see chip.configurationUi.attachCancel
       */
      fireCancel: function () {
        if (fnCancelHandler) {
          fnCancelHandler();
        }
      },

      /**
       * Fires the "save" event on this CHIP instance's configuration UI.
       *
       * @returns {object}
       *   a <code>jQuery.Deferred</code> object's promise as returned by the "save" event handler
       *
       * @name contract.configurationUi.fireSave
       * @function
       * @since 1.11.0
       *
       * @see chip.configurationUi.attachSave
       */
      fireSave: function () {
        return fnSaveHandler ? fnSaveHandler() : undefined;
      },

      /* eslint-disable valid-jsdoc*/ // &lt; &gt; are confusing eslint
      /**
       * Returns this CHIP's configuration UI, if available.
       *
       * @param {map &lt;string,string&gt;} [mParameters]
       *   Since 1.21.0 an optional parameter map can be passed to the UI provider. This map can be
       *   used for example to pass default configuration values to the UI.
       *
       * @returns {sap.ui.core.Control}
       *   this CHIP's configuration UI or <code>undefined</code>
       *
       * @name contract.configurationUi.getUi
       * @function
       * @since 1.11.0
       *
       * @see chip.configurationUi.setUiProvider
       */
      getUi: function (mParameters) {
        return fnUiProvider ? fnUiProvider(mParameters) : undefined;
      },
      /* eslint-enable valid-jsdoc*/

      /**
       * Tells whether this CHIP's configuration UI is currently in a "dirty" state (contains
       * unsaved changes).
       *
       * @returns {boolean}
       *   whether this CHIP's configuration UI is currently in a "dirty" state; returns
       *   <code>undefined</code> in case the CHIP instance has not set a corresponding provider
       *   function
       *
       * @name contract.configurationUi.isDirty
       * @function
       * @since 1.11.0
       *
       * @see chip.configurationUi.setDirtyProvider
       */
      isDirty: function () {
        return fnDirtyProvider ? fnDirtyProvider() : undefined;
      },

      /**
       * Determines whether this CHIP instance's configuration UI is enabled by the page builder.
       * <b>Note:</b> Changing this setting after <code>getImplementationAsSapui5()</code> has been
       * called violates the contract of <code>chip.configurationUi.isEnabled()</code>!
       *
       * @param {boolean} bNewEnabled
       *   whether this CHIP instance's configuration UI is enabled by the page builder
       *
       * @name contract.configurationUi.setEnabled
       * @function
       * @since 1.11.0
       *
       * @see sap.ui2.srvc.ChipInstance#getImplementationAsSapui5()
       * @see chip.configurationUi.isEnabled
       */
      setEnabled: function (bNewEnabled) {
        bEnabled = bNewEnabled;
      }
    };
  });
}());