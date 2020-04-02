// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The <code>configuration</code> contract.
 */

(function () {
  "use strict";
  /*global jQuery, sap */

  // Note: jQuery might not yet be available!
  if (typeof jQuery === "function" && jQuery.sap) {
    jQuery.sap.declare("sap.ui2.srvc.contracts.configuration");
    jQuery.sap.require("sap.ui2.srvc.chip");
  }

  /**
   * @namespace The namespace for the CHIP API's <code>configuration</code> contract, which allows
   * you to read configuration parameters.
   * @name chip.configuration
   * @since 1.2.0
   */

  sap.ui2.srvc.Chip.addContract("configuration", function (oChipInstance) {
    var fnUpdatedHandler;

    /**
     * Returns the value of the configuration parameter with the given name as a
     * string.
     *
     * Note: Use <code>JSON.parse(sParameterValue)</code> for values which represent
     * objects or arrays, use <code>parseInt(sParameterValue, 10)<code> for values
     * which represent integers, etc.
     *
     * @name chip.configuration.getParameterValueAsString
     * @function
     * @since 1.2.0
     * @param {string} sParameterName
     *   the parameter's name
     * @returns {string}
     *   the parameter's value
     */
    this.getParameterValueAsString = function (sParameterName) {
      return oChipInstance.getConfigurationParameter(sParameterName);
    };

    /**
     * Usually the Page Builder does not know about the internals of a CHIP, but there are special
     * CHIPs (e.g. SAP Fiori Launchpad app launcher tiles, also serving as bookmark tiles) the
     * Page Builder knows about the internals. In certain cases the Page Builder changes the configuration
     * data of the CHIP and is able to notify the CHIP Instance what configuration properties have been updated,
     * so the CHIP instance can update based on the new data.
     *
     * Note: The event must be explicitly triggered by the Page Builder. There is no automatic mechanism.
     *
     * @name chip.configuration.attachConfigurationUpdated
     * @function
     * @param {function(string[])} fnHandler
     *   Handler which is called if the Page Builder updates one or multiple configuration properties on
     *   the CHIP instance. fnHandler receives as first parameter an array containing keys of all first level
     *   configuration properties which have been updated.
     * @since 1.46.0
     * @private
     * @see contract.configuration.fireConfigurationUpdated
     */
    this.attachConfigurationUpdated = function (fnHandler) {
      // Back channel for FLP bookmark tiles, as they are managed by the FLP Bookmark Service.
      // The FLP directly changes the configuration data of the bookmark tile and can notify the bookmark
      // tiles afterwards about the changes, so the bookmark tiles can update themselves with the new data.
      if (typeof fnHandler !== "function") {
        throw new sap.ui2.srvc.Error("The given handler is not a function",
            "chip.configuration");
      }
      fnUpdatedHandler = fnHandler;
    };

    /**
     * @namespace The namespace for the contract interface (to be used by a page builder) for
     * the <code>configuration</code> contract.
     * @name contract.configuration
     * @private
     */
    return { // contract - private as only used by Fiori Launchpad
      /**
       * Allows the page builder to inform the CHIP about changes of certain configuration properties.
       * Note: Usually the page builder should not care about the content of the CHIP's configuration; however,
       * for bookmark tiles in SAP Fiori Launchpad this is required as the SAP Fiori Launchpad manages them.
       *
       * @name contract.configuration.fireConfigurationUpdated
       * @function
       * @param {string[]} aUpdatedConfigKeys
       *   array of first-level configuration property keys which have been updated by the page builder
       * @since 1.46.0
       * @private
       * @see chip.configuration.attachBagsUpdated
       */
      fireConfigurationUpdated : function (aUpdatedConfigKeys) {
        if (!sap.ui2.srvc.isArray(aUpdatedConfigKeys) || aUpdatedConfigKeys.length < 1) {
          throw new sap.ui2.srvc.Error("At least one configuration property key must be given",
              "contract.configuration");
        }
        if (fnUpdatedHandler) {
          fnUpdatedHandler(aUpdatedConfigKeys);
        }
      }
    };
  });

  /**
   * @namespace The namespace for the CHIP API's <code>writeConfiguration</code> contract which
   * allows you to write configuration parameters.
   * @name chip.writeConfiguration
   * @since 1.7.0
   */

  sap.ui2.srvc.Chip.addContract("writeConfiguration", function (oChipInstance) {
    /**
     * Sets the values of the given configuration parameters and persists the updated chip
     * instance. All parameters that actually were defined in the CHIP definition XML are accepted.
     * All others will raise a warning to the log.
     * <p>
     * The configuration is maintained as JSON string in a single property. This has the following
     * consequences regarding the scopes:
     * <ul>
     * <li>If the CHIP instance has never been persisted in the current scope, the configuration is
     *   inherited from lower scopes. If there are no changes either, the properties have their
     *   default values from the CHIP definition.
     * <li>When persisting the CHIP instance in a given scope for the first time (may it be due to
     *   configuration changes or title changes...), the configuration changes are merged with
     *   inherited changes from lower scopes and persisted in the current scope. Subsequent changes
     *   in lower scopes will then remain invisible.
     * <li>A property for which never an update was supplied has the default value from the CHIP
     *   definition. This also applies if you delete the update again by setting it to
     *   <code>undefined</code>.
     * </ul>
     * <b>Example:</b><br>
     * The CHIP has two properties: <code>a</code> with default value "foo" and <code>b</code> with
     * default value "bar". The administrator changes <code>a</code> to "baz" in scope CUST. Later
     * a user changes <code>b</code> in PERS. Then the administrator decides to change
     * <code>a</code> back to "foo", but our user will never see this again, because the system
     * persisted both <code>a</code> and <code>b</code> in PERS.
     *
     * @name chip.writeConfiguration.setParameterValues
     * @function
     * @since 1.7.0
     * @param {map<String,String>} mConfigurationUpdates
     *   The configuration updates. The values must be strings. You can however set a value to
     *   <code>undefined</code>. This removes it from the list of updated properties and effectively
     *   resets it to the default value.
     * @param {function ()} [fnSuccess]
     *   no-args success handler
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   The default error handler is provided by the page builder
     */
    this.setParameterValues = function (mConfigurationUpdates, fnSuccess, fnFailure) {
      oChipInstance.updateConfiguration(mConfigurationUpdates, fnSuccess, fnFailure);
    };
  });
}());
