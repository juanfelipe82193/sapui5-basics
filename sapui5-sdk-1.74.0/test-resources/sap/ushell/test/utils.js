// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview This file contains miscellaneous test utility functions.
 */

sap.ui.define([
    "sap/ushell/utils",
    "sap/ui/thirdparty/URI"
], function (
    oUtils,
    URI
) {
    "use strict";
    /* global QUnit ok deepEqual strictEqual start */

    var fnErrorConstructor = oUtils.Error;

    // window.onerror no longer necessary with QUnit

    function assertOk (/* arguments */) {
        // QUnit 2.x
        if (QUnit) {
            return QUnit.assert.ok(QUnit.assert, arguments);
        }

        // QUnit 1.x
        return ok.apply(null, arguments);
    }

    /*
     * The standard error handler for test cases. Reports the error message.
     */
    function onError (sError) {
        start();
        assertOk(false, typeof sError === 'object' ? JSON.stringify(sError) : sError);
    }

    /*
     * Modifies the constructor of oUtils.Error so that the component is mandatory.
     */
    oUtils.Error = function (sMessage, sComponent) {
        if (!sComponent || typeof sComponent !== "string") {
            throw new Error("Missing component");
        }
        return fnErrorConstructor.apply(this, arguments);
    };
    oUtils.Error.prototype = fnErrorConstructor.prototype;

    /*
     * Creates a mock object for tracing and assigns it to jQuery.sap.log.
     * Return an object to control the mock.
     */
    function createLogMock () {
        var aExpectedCalls = [],
            oOriginalLog = jQuery.sap.log,
            sWatchedComponent,
            bSloppy = false;

        /**
         * Checks whether one log call argument matches
         * @param {string} sActual
         *   the actual value
         * @param {string|RegExp} vExpected
         *   the expected value (either as string or as regular expression)
         * @returns {boolean}
         *   <code>true</code> if the actual value matches the expected value
         */
        function argumentMatches (sActual, vExpected) {
            return vExpected instanceof RegExp ? vExpected.test(sActual) : sActual === vExpected;
        }

        /**
         * Checks whether the actual log call arguments match the expected ones
         *
         * @param {array} aActual
         *   the arguments list of a log call
         * @param {string[]|RegExp[]} aExpected
         *   the array of expected arguments
         * @returns {boolean}
         *   <code>true</code> if the actual values matches the expected values
         */
        function argumentsMatch (aActual, aExpected) {
            var i;

            if (aActual.length !== aExpected.length) {
                return false;
            }
            for (i = 0; i < aActual.length; i += 1) {
                if (!argumentMatches(aActual[i], aExpected[i])) {
                    return false;
                }
            }
            return true;
        }

        function record (sMethodName, aArguments) {
            aExpectedCalls.push({
                name: sMethodName,
                args: aArguments
            });
        }

        function replay (sMethodName, aArguments) {
            var oExpectedCall = aExpectedCalls.shift();

            if (oExpectedCall && sMethodName === oExpectedCall.name && argumentsMatch(aArguments, oExpectedCall.args)) {
                return;
            }
            if (bSloppy || (sWatchedComponent && sWatchedComponent !== aArguments[2])) {
                if (oExpectedCall) {
                    aExpectedCalls.unshift(oExpectedCall);
                }
                return;
            }
            if (!oExpectedCall) {
                assertOk(false, "Unexpected call to method " + sMethodName + " with arguments " + Array.prototype.join.call(aArguments));
                return;
            }

            strictEqual(sMethodName, oExpectedCall.name, "Method name");
            deepEqual(aArguments, oExpectedCall.args, "Call to method " + sMethodName);
        }

        var oMethods = {
            trace: function () {
                replay("trace", arguments);
            },

            debug: function () {
                replay("debug", arguments);
            },

            error: function () {
                replay("error", arguments);
            },

            info: function () {
                replay("info", arguments);
            },

            // cf. sinon
            restore: function () {
                jQuery.sap.log = oOriginalLog;
            },

            warning: function () {
                replay("warning", arguments);
            },

            fatal: function () {
                replay("fatal", arguments);
            }
        };

        jQuery.sap.log = Object.keys(oOriginalLog).reduce(function (oFinalLogMock, sNextProperty) {
            oFinalLogMock[sNextProperty] = oOriginalLog[sNextProperty];
            return oFinalLogMock;
        }, {});

        Object.keys(oMethods).forEach(function (sMethod) {
            jQuery.sap.log[sMethod] = oMethods[sMethod];
        });

        return {
            trace: function () {
                record("trace", arguments);
                return this;
            },

            debug: function () {
                record("debug", arguments);
                return this;
            },

            info: function () {
                record("info", arguments);
                return this;
            },

            error: function () {
                record("error", arguments);
                return this;
            },

            warning: function () {
                record("warning", arguments);
                return this;
            },

            fatal: function () {
                record("fatal", arguments);
                return this;
            },

            /**
             * Activates a filter for the given component. Only logs for that component are observed.
             *
             * @param {string} sComponentName
             *   the name of the component, <code>null</code> to switch the filter off (which is default)
             * @returns {object}
             *   this
             */
            filterComponent: function (sComponentName) {
                sWatchedComponent = sComponentName;
                return this;
            },

            /**
             * Turns the "sloppy" mode on as indicated. In "sloppy" mode, additional
             * calls to the mock are tolerated.
             *
             * @param {boolean} bNewSloppy
             *   new "sloppy" mode (default: true)
             * @returns {object}
             *   this
             */
            sloppy: function (bNewSloppy) {
                bSloppy = arguments.length > 0 ? bNewSloppy : true;
                return this;
            },

            verify: function () {
                if (jQuery.sap.log.restore) { // sometimes verify() is called twice...
                    jQuery.sap.log.restore();
                }
                if (aExpectedCalls.length === 0) {
                    assertOk(true, "Tracing is complete");
                } else {
                    aExpectedCalls.forEach(function (oExpectedCall) {
                        function format (oCall) {
                            var aParts = [oCall.name, '('],
                                i,
                                sSep = '';
                            for (i = 0; i < oCall.args.length; i += 1) {
                                aParts.push(sSep, oCall.args[i]);
                                sSep = ', ';
                            }
                            aParts.push(')');
                            return aParts.join('');
                        }
                        assertOk(false, "Missing trace call: " + format(oExpectedCall));
                    });
                }
            }

        };

    }


    /**
     * Restores all potential Sinon spies that are passed as arguments to the function. Additionally
     * restores the spies created via {@link sap.ushell.test.createLogMock()}.
     * @param {...function} [fnPotentialSpy] A potential spy to restore; nothing happens if the function is not spied upon
     */
    function restoreSpies () {

        function restoreSpy (fnPotentialSpy) {
            if (fnPotentialSpy && fnPotentialSpy.restore) {
                fnPotentialSpy.restore();
            }
        }

        for (var i = 0; i < arguments.length; i += 1) {
            restoreSpy(arguments[i]);
        }
        restoreSpy(jQuery.sap.log); // see sap.ushell.test.createLogMock
    }

    /*
     * Returns the directory path of a resource file in which the function is called.
     * The function should not be called inside the elementary unit tests because this could lead to errors.
     * It should be called on the top.
     *
     * Remember: Defining a relative path inside a JavaScript file (myFile) is dangerous.
     * It then tries to load the desired resource relative to the html file which is embedding myFile in a script tag.
     */
    function getOwnScriptDirectory () {
        // get the URL of our own script; if included by ui2 qunitrunner, a global variable is filled
        var sOwnScriptUrl = window["sap-ushell-qunitrunner-currentTestScriptUrl"],
            oAllScripts,
            oOwnScript;

        if (!sOwnScriptUrl) {
            // no qunitrunner - expect direct embedding into HTML
            oAllScripts = window.document.getElementsByTagName('script');
            oOwnScript = oAllScripts[oAllScripts.length - 1];
            sOwnScriptUrl = oOwnScript.src;
        }

        return new URI(sOwnScriptUrl).directory() + "/";
    }

    /**
     * Will do an deep equal of two object repesenting key-object maps
     *
     * @param {object} assert
     *   QUnit assert object
     * @param {string} [sPrefix]
     *   Prefix for the test description
     * @param {object} oActual
     *   actual object
     * @param {object} oExpected
     *   expected Common Data Model Site
     * @param {string} sTestDescription
     *  test description
     */
    function prettyDeepEqualOfObjectMaps (assert, sPrefix, oActual, oExpected, sTestDescription) {
        var aActualKeys = Object.keys(oActual),
            aExpectedKeys = Object.keys(oExpected);

        sPrefix = sPrefix || "";

        assert.strictEqual(
            aActualKeys.length,
            aExpectedKeys.length,
            sPrefix + sTestDescription + " same number of items: " + aActualKeys.length
        );
        assert.deepEqual(
            aActualKeys,
            aExpectedKeys,
            sPrefix + sTestDescription + " same list of keys"
        );

        // compare the map content
        aExpectedKeys.forEach(function (sKey) {
            assert.deepEqual(
                oActual[sKey],
                oExpected[sKey],
                sPrefix + sTestDescription + " item with key '" + sKey + "'"
            );
        });
    }

    /**
     * Will do an deep equal of the given path of both sites
     *
     * @param {object} assert
     *   QUnit assert object
     * @param {string} [sPrefix]
     *   Prefix for the test description
     * @param {object} oActualSite
     *   actual Common Data Model Site
     * @param {object} oExpectedSite
     *   expected Common Data Model Site
     * @param {string} sPath
     *   e.g.: "site.payload.config"
     */
    function deepEqualByNamespace (assert, sPrefix, oActualSite, oExpectedSite, sPath) {
        sPrefix = sPrefix || "";

        assert.deepEqual(
            oUtils.getMember(oActualSite, sPath),
            oUtils.getMember(oExpectedSite, sPath),
            sPrefix + sPath
        );
    }

    /**
     * Compares two CDM sites a in parts one by one. This is beneficial if you compare two large sites which
     * are not equal. The classic Qunit assert will output a huge diff which is hard to read:
     * you have to scroll for ages or if the order is wrong it will be hard to detect.
     *
     * The function will do a classic assert.deepEqual(oActualSite, oExpectedSite) at the end
     * to detect issues with the custom compare logic
     *
     * @param {object} assert
     *   QUnit assert object
     * @param {object} oActualSite
     *   actual Common Data Model Site
     * @param {object} oExpectedSite
     *   expected Common Data Model Site
     * @param {string} sTestDescription
     */
    function prettyCdmSiteDeepEqual (assert, oActualSite, oExpectedSite, sTestDescription) {
        var fnDeepEqualSitesPart,
            fnPrettyDeepEqualOfObjectMaps,
            sMethodPrefix = "[sap.ushell.test.utils#prettyCdmSiteDeepEqual] ",
            sTestDescriptionPrefix = sMethodPrefix + sTestDescription + ": ",
            oSiteCloneA = jQuery.extend({}, oActualSite),
            oSiteCloneE = jQuery.extend({}, oExpectedSite);

        // function shortcuts
        fnDeepEqualSitesPart = deepEqualByNamespace.bind(this, assert, sTestDescriptionPrefix,
            oSiteCloneA, oSiteCloneE);
        fnPrettyDeepEqualOfObjectMaps = prettyDeepEqualOfObjectMaps.bind(this, assert, sTestDescriptionPrefix);

        fnDeepEqualSitesPart("_version");

        // compare site
        fnDeepEqualSitesPart("site.identification");
        fnDeepEqualSitesPart("site.payload.homeApp");
        fnDeepEqualSitesPart("site.payload.config");
        fnDeepEqualSitesPart("site.payload.groupsOrder");

        // compare catalogs
        fnPrettyDeepEqualOfObjectMaps(
            oSiteCloneA.catalogs,
            oSiteCloneE.catalogs,
            "catalogs"
        );

        // compare applications
        fnPrettyDeepEqualOfObjectMaps(
            oSiteCloneA.applications,
            oSiteCloneE.applications,
            "applications"
        );

        // compare systemAliases
        fnPrettyDeepEqualOfObjectMaps(
            oSiteCloneA.systemAliases,
            oSiteCloneE.systemAliases,
            "systemAliases"
        );

        // compare groups
        fnPrettyDeepEqualOfObjectMaps(
            oSiteCloneA.groups,
            oSiteCloneE.groups,
            "groups"
        );

        // do classic deepEqual as well to detect issues with testUtils.prettyCdmSiteDeepEqual
        assert.deepEqual(oActualSite, oExpectedSite,
            sMethodPrefix + "SELF-CHECK (this should not be the only red assertion -> prettyCdmSiteDeepEqual bug)");
    }

    /**
     * Allows to set a value for a nested member of a plain object or array.
     *
     * Example (object):
     * <pre>
     *    var oMyObject = { a: { b: "c" } };
     *    setObjectValue(oMyObject, "/a/b/d", "hello");
     *
     *    // oMyObject becomes: { a: { b: "c", d: "hello" } }
     * </pre>
     *
     * Example (array):
     * <pre>
     *    var aMyArray = [1, { b: "hi" }, 3];
     *    setObjectValue(aMyArray, "/1/b", "hello");
     *
     *    // aMyArray becomes: [1, {b: "hello"}, 3]
     * </pre>
     *
     * @param {object|array} oObjectOrArray
     *   An object that can be modified.
     *
     * @param {string} sPath
     *   The path to an object member starting from the root. For example,
     *   like: <code>/path/to/deeply/nested/member</code>. Note that the path
     *   is created if it does not exist.
     *
     * @param {variant} vValue
     *   The value to assign to the object identified by the given path
     *
     * @throws {Error} When the given path does not start with the root '/', or
     *   when a non-numeric index is found in the path for an array.
     */
    function setObjectValue (oObjectOrArray, sPath, vValue) {
        if (sPath.indexOf("/") !== 0) {
            throw new Error("Invalid path. Please ensure path starts with '/'");
        }

        var aPath = sPath.split("/");
        aPath.shift(); // initial '/'
        var sLastKey = aPath.pop();

        var oLastItem = aPath.reduce(function (oCurrentObject, sKey) {
            if (oUtils.isArray(oCurrentObject) && isNaN(parseInt(sKey, 10))) {
                throw new Error("Invalid array index '" + sKey + "' provided in path '" + sPath + "'");
            }

            if (!oUtils.isPlainObject(oCurrentObject[sKey]) && !oUtils.isArray(oCurrentObject[sKey])) {
                oCurrentObject[sKey] = {};  // overrides in case a non-object is set!
            }

            return oCurrentObject[sKey];
        }, oObjectOrArray);

        if (oUtils.isArray(oLastItem) && isNaN(parseInt(sLastKey, 10))) {
            throw new Error("Invalid array index '" + sLastKey + "' provided in path '" + sPath + "'");
        }

        oLastItem[sLastKey] = vValue;
    }

    /**
     * Overrides (nested) properties of an object, without changing the
     * original object.
     *
     * Example:
     * <pre>
     *   var oObject = { a: { b: "c" } };
     *   var oObjectEnhanced = overrideObject(oObject, {
     *      "/a/b" : "foo",
     *      "/a/d/c": "fie"
     *   });
     *   // oObjectEnhanced is: { a: { b: "foo", d: { c: "fie" } } }
     * </pre>
     *
     * @param {object} oObject
     *   The object to override.
     *
     * @param {object} oProperties
     *   The path to properties to override and the corresponding value.
     *
     * @return {object}
     *   A new object like the original object, with the specified values
     *   assigned.
     *
     * @throws {Error} When the given path does not start with the root '/', or
     *   when a non-numeric index is found in the path for an array.
     */
    function overrideObject (oObject, oProperties) {
        var oObjectClone = oUtils.clone(oObject);

        Object.keys(oProperties).sort(function (sA, sB) {
            if (sA.indexOf(sB) >= 0) { return 1; }
            if (sB.indexOf(sA) >= 0) { return -1;  }

            return 0;
        }).forEach(function (sPath) {
            var sTargetValue = oProperties[sPath];
            setObjectValue(oObjectClone, sPath, sTargetValue);
        });

        return oObjectClone;
    }

    function resetConfigChannel (oUshellConfig) {
        // require here, not in define due to sandbox case
        var CommonCreateConfigcontract = sap.ui.require("sap/ushell/bootstrap/common/common.create.configcontract.core");
        var Config = sap.ui.require("sap/ushell/Config");

        var oContract = CommonCreateConfigcontract.createConfigContract(oUshellConfig);

        Config._reset();
        Config.registerConfiguration("core", oContract);
    }

    return {
        onError: onError,
        createLogMock: createLogMock,
        restoreSpies: restoreSpies,
        getOwnScriptDirectory: getOwnScriptDirectory,
        prettyCdmSiteDeepEqual: prettyCdmSiteDeepEqual,
        setObjectValue: setObjectValue,
        overrideObject: overrideObject,
        resetConfigChannel: resetConfigChannel
    };

});
