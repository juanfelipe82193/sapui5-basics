// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/base/EventProvider",
    "sap/ushell/EventHub",
    "sap/base/util/isPlainObject",
    "sap/base/Log",
    "sap/base/util/Version"
], function (EventProvider, EventHub, isPlainObject, Log, Version) {
    "use strict";

    return function (oSettings) {
        var ServiceFactoryRegistry = oSettings.serviceRegistry,
            ServiceFactory = oSettings.serviceFactory,
            Service = oSettings.service;

        var oEventProvider = new EventProvider(),
            sActiveComponentId;

        var oAppLifeCycle;

        var AppIsolationService = Service.extend("sap.ushell.ui5service.AppIsolationService", /** @lends sap.ushell.ui5service.AppIsolationService# */ {
            init: function () {
                /*
                 * Service injection
                 */
                var that = this,
                    oPublicInterface = this.getInterface();

                // Only one component can set/get at a given time. Here we try to
                // avoid that no yet-to-be-destroyed apps call set/get methods by
                // giving priority to the last instantiated component.
                oPublicInterface.init = function () {
                    that._amendPublicServiceInstance.call(
                        that, // always the "private" service
                        this // public service instance
                    );
                };

                ServiceFactoryRegistry.register(
                    "sap.ushell.ui5service.AppIsolationService",
                    new ServiceFactory(oPublicInterface)
                );

            },
            /**
             * Sets the id of the active component, that is, the component allowed
             * to call public methods of this service. This method is mainly here
             * for supportability purposes.
             *
             * @param {string} sId
             *    The id of the active component.
             * @private
             * @since 1.38.0
             */
            _setActiveComponentId: function (sId) {
                sActiveComponentId = sId;
            },
            /**
             * Getter for the id of the active component.  This method is mainly
             * here for supportability purposes.
             *
             * @returns {string}
             *   The id of the component currently active in the Launchpad.
             * @private
             * @since 1.38.0
             */
            _getActiveComponentId: function () {
                return sActiveComponentId;
            },

            /**
             * Getter for the event provider.  This method is mainly
             * here for supportability purposes.
             *
             * @returns {object}
             *   The event provider
             * @private
             * @since 1.38.0
             */
            _getEventProvider: function () {
                return oEventProvider;
            },

            /**
             * Ensures that the given argument is an array of object, having all string values.
             * This method logs an error message in case this is not the case.
             *
             * <pre>
             * IMPORTANT: this method must not rely on its context when called or
             * produce side effects.
             * </pre>
             *
             * @param {variant} vArg
             *   Any value.
             * @param {string} sMethodName
             *   The name of the method that called this function.
             * @returns {boolean}
             *   Whether <code>vArg</code> is a string. Logs an error message
             *   reporting <code>sMethodName</code> in case <code>vArg</code> is
             *   not a string.
             *
             * @private
             * @since 1.38.0
             */
            _ensureArrayOfObjectOfStrings: function (vArg, sMethodName) {
                var bValidates = Array.isArray(vArg) && vArg.every(function (oObject) {
                    return isPlainObject(oObject)
                        && Object.keys(oObject).length > 0
                        && Object.keys(oObject).every(function (sKey) {
                            return typeof oObject[sKey] === "string";
                        });
                });

                if (!bValidates) {
                    Log.error(
                        "'" + sMethodName + "' was called with invalid parameters",
                        "An array of non-empty objects with string values is expected",
                        "sap.ushell.ui5service.AppIsolationService"
                    );
                }

                return bValidates;
            },

            /**
             * Ensures that the given argument is a function, logging an error
             * message in case it's not.
             *
             * <pre>
             * IMPORTANT: this method must not rely on its context when called or
             * produce side effects.
             * </pre>
             *
             * @param {variant} vArg
             *   Any value.
             * @param {string} sMethodName
             *   The name of the method that called this function.
             * @returns {boolean}
             *   Whether <code>vArg</code> is a function. Logs an error message
             *   reporting <code>sMethodName</code> in case <code>vArg</code> is
             *   not a function.
             *
             * @private
             * @since 1.38.0
             */
            _ensureFunction: function (vArg, sMethodName) {
                var sType = typeof vArg;
                if (sType !== "function") {
                    Log.error(
                        "'" + sMethodName + "' was called with invalid arguments",
                        "the parameter should be a function, got '" + sType + "' instead",
                        "sap.ushell.ui5service.AppIsolationService"
                    );
                    return false;
                }
                return true;
            },

            /**
             * Ensures that the given argument is a string, logging an error
             * message in case it's not.
             *
             * <pre>
             * IMPORTANT: this method must not rely on its context when called or
             * produce side effects.
             * </pre>
             *
             * @param {variant} vArg
             *   Any value.
             * @param {string} sMethodName
             *   The name of the method that called this function.
             * @returns {boolean}
             *   Whether <code>vArg</code> is a string. Logs an error message
             *   reporting <code>sMethodName</code> in case <code>vArg</code> is
             *   not a string.
             *
             * @private
             * @since 1.38.0
             */
            _ensureString: function (vArg, sMethodName) {
                var sType = typeof vArg;
                if (sType !== "string") {
                    Log.error(
                        "'" + sMethodName + "' was called with invalid arguments",
                        "the parameter should be a string, got '" + sType + "' instead",
                        "sap.ushell.ui5service.AppIsolationService"
                    );
                    return false;
                }
                return true;
            },
            /**
             * Wraps a given public service interface method with a check that
             * determines whether the method can be called. This helps preventing
             * cases in which calling the method would disrupt the functionality of
             * the currently running app.  For example, this check would prevent a
             * still alive app to change the header title while another app is
             * being displayed.
             *
             * @param {object} oPublicServiceInstance
             *  The instance of the public service interface.
             * @param {string} sPublicServiceMethod
             *  The method to be wrapped with the check.
             *
             * @private
             * @since 1.38.0
             */
            _addCallAllowedCheck: function (oPublicServiceInstance, sPublicServiceMethod) {
                var that = this;
                oPublicServiceInstance[sPublicServiceMethod] = function () {
                    var oContext = oPublicServiceInstance.getContext(); // undefined -> don't authorize
                    if (!oContext || oContext.scopeObject.getId() !== sActiveComponentId) {
                        Log.warning(
                            "Call to " + sPublicServiceMethod + " is not allowed",
                            "This may be caused by an app component other than the active '" + sActiveComponentId + "' that tries to call the method",
                            "sap.ushell.ui5service.AppIsolationService"
                        );
                        return undefined; // eslint
                    }

                    return that[sPublicServiceMethod].apply(oPublicServiceInstance, arguments);
                };
            },
            /**
             * Adjusts the method of the public service instance.
             * Specifically:
             * <ul>
             * <li>Adds safety checks to public methods</li>
             * <li>Register the component that called <code>.getService</code> as
             *     the currently active component.
             * </ul>
             *
             * @param {sap.ui.base.Interface} oPublicServiceInstance
             *    The public service interface.
             *
             * @private
             * @since 1.38.0
             */
            _amendPublicServiceInstance: function (oPublicServiceInstance) {
                var //that = this,
                    oContext;

                var oParams = {
                    AppLifeCycle: undefined
                };
                sap.ui.getCore().getEventBus().publish("sap.ushell", "getAppLifeCycle", oParams);
                oAppLifeCycle = oParams.AppLifeCycle;

                // attempt to register this as the "active component"
                oContext = oPublicServiceInstance.getContext();
                if (typeof oContext === "undefined") {
                    // ServiceFactoryRegistry#get static method was used on the
                    // service factory to obtain the service. Don't record the
                    // currently active component so that future call from an
                    // active app succeed. E.g., on view change.
                    //
                    return;
                }

                // must re-bind all public methods to the public interface
                // instance, as they would be otherwise called in the context of
                // the service instance.
                //["TODO"].forEach(function (sMethodToSetup) {
                //    that._addCallAllowedCheck(oPublicServiceInstance, sMethodToSetup);
                //});

                if (oContext.scopeType === "component") {
                    this._setActiveComponentId(oContext.scopeObject.getId());
                    return;
                }

                Log.error(
                    "Invalid context for AppIsolationService interface",
                    "The context must be empty or an object like { scopeType: ..., scopeObject: ... }",
                    "sap.ushell.ui5service.AppIsolationService"
                );
            },

            /**
             * Returns version number in use (e.g. 2 for Fiori 2.0). Will be used
             * for checking whether the Fiori 2.0 header should be used or not.
             *
             * @returns {number}
             *    the version number
             *
             * @since 1.38.0
             * @private
             */
            getUxdVersion: function () {
                // use 1.37.0 to include cases where the snapshot is used
                if ((new Version(sap.ui.version).compareTo("1.37.0")) >= 0) {
                    return 2;
                }
                return 1;
            },

	        //-------------------------------------------------------------------------------------
            // event delegation strategy
            //-------------------------------------------------------------------------------------

	        registerTunnels: function (oTunnels) {
	            oAppLifeCycle.registerTunnels(oTunnels);
            },

	        registerEvents: function (oEvents) {
	            oAppLifeCycle.registerEvents(oEvents);
            },


            //-------------------------------------------------------------------------------------
            // service public methods
            //-------------------------------------------------------------------------------------

            registerShellCommunicationHandler: function (oCommunicationHandlers) {
                oAppLifeCycle.registerShellCommunicationHandler(oCommunicationHandlers);
            },

            registerIframeCommunicationHandler: function (sHandlers, sAppType) {
                oAppLifeCycle.registerIframeCommunicationHandler(sHandlers, sAppType);
            },

            getCurrentAppHash: function () {
                return oAppLifeCycle.getCurrentApplication().hash;
            },

            getCurrentAppTargetResolution: function () {
                return oAppLifeCycle.getCurrentApplication().target;
            },

            createTunnel: function (fnCallback, oCtx, oMeta) {
                return oAppLifeCycle.createTunnel(fnCallback, oCtx, oMeta);
            },

            getIframeHandelrs: function () {
                return oAppLifeCycle.getCurrentApplication().container.getIframeHandlers();
            },

            jsonStringifyFn: function (oJson) {
                var sResult = JSON.stringify(oJson, function (key, value) {
                    return (typeof value === "function") ? value.toString() : value;
                });

                return sResult;
            }


        });

        return AppIsolationService;
    };
});