(function () {
    "use strict";

    /*global jQuery, sap */
    jQuery.sap.declare("sap.ushell.demo.UserDefaultTestPlugin.Component");
    jQuery.sap.require("sap.ui.core.Component");

    // new Component
    sap.ui.core.Component.extend("sap.ushell.demo.UserDefaultTestPlugin.Component", {

        metadata: {
            version: "1.74.0",
            library: "sap.ushell.demo.UserDefaultTestPlugin"
        },

        /**
         * Expected format:
         * {
         *   "<nameOfDefaultValue>": {
         *     "value": "<defaultValue>",
         *     "description": "<description>",
         *     "sortOrder": "<sortOrderString>"
         *   }
         * }
         */
        oUserDefaultMap: {},

        /**
         * internal use
         */
        init: function () {
            var oConfig = this.getComponentData().config,
                sUserDefault;

            if (oConfig) {
                for (sUserDefault in oConfig) {
                    if (oConfig.hasOwnProperty(sUserDefault)) {
                        try {
                            this.oUserDefaultMap[sUserDefault] = JSON.parse(oConfig[sUserDefault]);
                        } catch (oException) {
                            jQuery.sap.log.error("UserDefaultTestPlugin: error parsing parameter - " + sUserDefault);
                        }
                    }
                }
            }

            // TODO: register at service
        },


        /**
         * The function returns the user default for a specified value name.
         *
         * The parameter oCurrentParameter is always provided,
         * it may be <code>{ value:undefined }</code>, indicating initial,
         * or a value read from the Frontendserver storage, or a value
         * already determined by another plugin in the invocation sequence before.
         *
         * The function may resolve and return a new
         * object with altered property values.
         * Currently relevant property values <code>value,noStore</code>
         *
         * The plugin should first test whether the sParameterName is relevant for it,
         * otherwise it should resolve with the passed object
         * The general pattern for plugins realizing the "provide value if initial" pattern,
         * that is to resolve with the passed object if <code>{ value : xxx}</code>
         * is already filled.
         *
         * "Act only if initial", initial is indicated by "value === undefined"
         * This function is only used in the runtime scenario.
         *
         * @param {string} sParameterName
         *     Name of the user default to be retrieved.
         * @param {object} oCurrentParameter
         *     Object to be modified with current values and returned
         * @returns {jQuery.Deferred.promise}
         *     Either a new object or a modified version of oCurrentParameter in case of success
         *     or the reason in case of a failure.
         */

        getUserDefault: function (sParameterName, oCurrentParameter) {
            var that = this,
                oDeferred = new jQuery.Deferred(),
                sKey,
                oUserDefault = this.oUserDefaultMap.hasOwnProperty(sParameterName) ? this.oUserDefaultMap[sParameterName] : {};

            // create an artificial asynchrony
            setTimeout(function () {
                if (that.oUserDefaultMap.hasOwnProperty(sParameterName)) {
                    if (oCurrentParameter) {
                        // special case for CompanyCode '0001' - can't be overwritten
                        if (sParameterName === "CompanyCode" && oCurrentParameter.value === "0001") {
                            jQuery.extend(oCurrentParameter, oUserDefault);
                            oCurrentParameter.value = "0001";
                        } else {
                            jQuery.extend(oCurrentParameter, oUserDefault);
                        }
                    }
                    oDeferred.resolve(oCurrentParameter ? oCurrentParameter : oUserDefault);
                } else {
                    oDeferred.resolve(oCurrentParameter);
                }
            }, 0);

            return oDeferred.promise();
        },

        /**
         * TODO: document
         * runtime, designtime
         */
        // TODO: what is the returned promised supposed to do? contract should be specified
        // TODO: maybe data should be separated from metadata
        // TODO: overwrite or merge ???
        persistNewDefaultValues: function (oParameterList) {

            var oDeferred = new jQuery.Deferred(),
                sUserDefault,
                oClonedList = jQuery.extend({}, oParameterList),
                bExceptionOccured = false;

            try {
                for (sUserDefault in oParameterList) {
                    if (oParameterList.hasOwnProperty(sUserDefault) && this.oUserDefaultMap.hasOwnProperty(sUserDefault)) {
                        if (typeof oClonedList[sUserDefault] !== "object") {
                            throw {
                                message: "invalid data"
                            };
                        }
                        this.oUserDefaultMap[sUserDefault] = oClonedList[sUserDefault];
                    } else {
                        delete oClonedList[sUserDefault];
                    }
                }
            } catch (oException){
                bExceptionOccured = true;
            }

            // create an artificial asynchrony
            setTimeout(function () {
                // we assume that we succeeded if at least one positive result exists
                if (!bExceptionOccured) {
                    oDeferred.resolve(oClonedList);
                } else {
                    oDeferred.reject(sap.ushell.services.UserDefaultParameters.prototype.ERROR_DURING_PERSIST);
                }
            }, 0);

            return oDeferred.promise();
        },

        /**
         * TODO: document
         * designtime
         */
        getParameterDescription: function (oParameterList) {

        },

        /**
         * TODO: document
         * designtime
         */
        getParameterValueHelp: function (sValueName, oCurrentParameter, sQueryString) {

        },

        /**
         * TODO: document
         * designtime
         */
        getParameterValueHelpDescriptor: function (sValueName) {

        }
    });
})();
