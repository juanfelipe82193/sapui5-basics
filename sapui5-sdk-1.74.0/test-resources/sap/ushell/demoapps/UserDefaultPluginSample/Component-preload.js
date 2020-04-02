//@ui5-bundle sap/ushell/demo/UserDefaultPluginSample/Component-preload.js
sap.ui.require.preload({
	"sap/ushell/demo/UserDefaultPluginSample/Component.js":function(){(function () {
    "use strict";

    /*global jQuery, sap */
    jQuery.sap.declare("sap.ushell.demo.UserDefaultPluginSample.Component");
    jQuery.sap.require("sap.ui.core.Component");

    /**
     * This promise is used in getUserDefaultsPromise to determine whether
     * retrieveUserDefaults was already called.
     */
    var oRetrievedUserDefaultsPromise;

    //Attach private functions which should be testable via unit tests to the public namespace
    //to make them available outside for testing.
    sap = sap || {};
    sap.ushell = sap.ushell || {};
    sap.ushell.demo.__UserDefaultPluginSample__ = sap.ushell.demo.__UserDefaultPluginSample__ || {};

    sap.ushell.demo.__UserDefaultPluginSample__._retrieveUserDefaults = retrieveUserDefaults;

    /**
     * Retrieves the user defaults object (calling the OData service if
     * necessary).
     *
     * @returns {jQuery.promise}
     *    a promise that is resolved with an object containing the user
     *    default parameters, or rejected with an error message. The object
     *    this promise resolves with is in the following format:
     *
     * <pre>
     *    {
     *        "<nameOfDefaultValue>": {
     *          "value"       : "<defaultValue>",
     *          "noStore"     : "<boolean>",
     *          "noEdit"      : "<boolean>",
     *          "description" : "<description>",
     *          "sortOrder"   : "<sortOrderString>"
     *        }
     *    }
     * </pre>
     */
    function getUserDefaultsPromise() {
        if (!oRetrievedUserDefaultsPromise) {
            oRetrievedUserDefaultsPromise = sap.ushell.demo.__UserDefaultPluginSample__._retrieveUserDefaults();
        }

        return oRetrievedUserDefaultsPromise;
    }

    /**
     * Simulate an oData request that will retrieve the data from a backend
     * server. The data will be kept in a private object.
     *
     * @returns {jQuery.Deferred.promise}
     *     Returns the requested user defaults object.
     */
    function retrieveUserDefaults() {
        var oDeferred = new jQuery.Deferred(),
            oTestData = {
                // typical "former SET GET PARAMETER", stored on frontendserver
                // subsequently maintained there via UserDefault editor
               "UshellSampleCompanyCode": {
                   "valueObject" : {
                       "value": "0815"
                   },
                   "editorMetadata" : {
                       // metadata request only
                       "displayText" : "Company code",
                       "description": "This is the company code",
                       "groupId": "EXAMPLE-FIN-GRP1",
                       "groupTitle" : "FIN User Defaults (UShell examples)",
                       "parameterIndex" : 4,
                       "editorInfo" : {
                           // this info is opaque between editor and plugin
                           // assumption is that the editor attempts to bind a smart control to
                           // the given odata service and url
                           "odataURL" : "/sap/opu/odata/sap/ZFIN_USER_DEFAULTPARAMETER_SRV",
                           "entityName" : "Defaultparameter",
                           "propertyName" : "CompanyCode",
                           "bindingPath" : "/Defaultparameters('FIN')"
                   }
                   }
               },
               "UshellSampleCostCenter": {
                   "valueObject" : {
                       "value": "1000"
                   },
                   "editorMetadata" : {
                       // metadata request only
                       "displayText" : "Cost center",
                       "description": "This is the cost center",
                       "groupId": "EXAMPLE-FIN-GRP1",
                       "groupTitle" : "FIN User Defaults (UShell examples)",
                       "parameterIndex" : 2,
                       "editorInfo" : {
                           // this info is opaque between editor and plugin
                           // assumption is that the editor attempts to bind a smart control to
                           // the given odata service and url
                           "odataURL" : "/sap/opu/odata/sap/ZFIN_USER_DEFAULTPARAMETER_SRV",
                           "entityName" : "Defaultparameter",
                           "propertyName" : "CostCenter",
                           "bindingPath" : "/Defaultparameters('FIN')"
                       }
                   }
               },
               "UshellSampleControllingArea": {
                   "valueObject" : {
                       "value": "0010"
                   },
                   "editorMetadata" : {
                       // metadata request only
                       "displayText" : "Controlling Area",
                       "description": "This is the controlling Area",
                       "groupId": "EXAMPLE-FIN-GRP1",
                       "groupTitle" : "FIN User Defaults (UShell examples)",
                       "parameterIndex" : 3,
                       "editorInfo" : {
                           // this info is opaque between editor and plugin
                           // assumption is that the editor attempts to bind a smart control to
                           // the given odata service and url
                           "odataURL" : "/sap/opu/odata/sap/ZFIN_USER_DEFAULTPARAMETER_SRV",
                           "entityName" : "Defaultparameter",
                           "propertyName" : "ControllingArea",
                           "bindingPath" : "/Defaultparameters('FIN')"
                       }
                   }
               },
               "UshellTest1" : {
                   "valueObject": {
                       "value": "InitialFromPlugin"
                   },
                   "editorMetadata" : {
                       // metadata request only
                       "displayText" : "Test Default 1",
                       "description": "Description of the test default 1",
                       "groupId": "EXAMPLE-FIN-GRP1",
                       "groupTitle" : "FIN User Defaults (UShell examples)",
                       "parameterIndex" : 1
                   }
               },
               "UshellTest2" : {
                   "valueObject": {
                       "value": undefined
                   },
                   "editorMetadata" : {
                       // metadata request only
                       "displayText" : "Test Default 2 ( no value)",
                       "description": "Description of the test default 2",
                       "groupId": "EXAMPLE-FIN-GRP1",
                       "groupTitle" : "FIN User Defaults (UShell examples)",
                       "parameterIndex" : 2
                   }
               },
               "UshellTest3" : {
                   "valueObject": {
//                       "value": "1000",
//                       "extendedValue" : {
//                           "Ranges" : [ { "Sign": "I", "Option" : "EQ", "Low" : "2000", "High" : null   },
//                                        { "Sign": "I", "Option" : "BT", "Low" : "3000", "High" : "4000" }
//                                      ]
//                       }
                   },
                   "editorMetadata" : {
                       // metadata request only
                       "displayText" : "Test Default 3 (extended and simple value)",
                       "description": "Description of the test default 3",
                       "groupId": "EXAMPLE-FIN-GRP1",
                       "groupTitle" : "FIN User Defaults (UShell examples)",
                       "parameterIndex" : 3
                   }
               },
               "CommunityActivity" : {
                   "valueObject": {},
                   "editorMetadata" : {
                       // metadata request only
                       "displayText" : "Community Activity",
                       "description": "Describes how active you are on JAM",
                       "groupId": "EXAMPLE-FIN-GRP1",
                       "groupTitle" : "FIN User Defaults (UShell examples)",
                       "parameterIndex" : 10
                   }
               },
               "FirstName" : {
                   "valueObject": {},
                   "editorMetadata" : {
                       // metadata request only
                       "displayText" : "First Name",
                       "description": "Describes your first name",
                       "groupId": "EXAMPLE-FIN-GRP1",
                       "groupTitle" : "FIN User Defaults (UShell examples)",
                       "parameterIndex" : 11
                   }
               },
               "LastName" : {
                   "valueObject": {},
                   "editorMetadata" : {
                       // metadata request only
                       "displayText" : "Last Name",
                       "description": "Describes your last name",
                       "groupId": "EXAMPLE-FIN-GRP1",
                       "groupTitle" : "FIN User Defaults (UShell examples)",
                       "parameterIndex" : 12
                   }
               },
               "ExtendedUserDefaultWithPlugin" : {
                   "valueObject": {
                       "value": "1000",
                       "extendedValue" : {
                           "Ranges" : [
                                        { "Sign": "I", "Option" : "BT", "Low" : "0", "High" : "4000" }
                                      ]
                       }
                   },
                   "editorMetadata" : {
                       // metadata request only
                       "displayText" : "ExtendedUserDefaultWithPlugin",
                       "description": "Describes the value for ExtendedUserDefaultWithPlugin",
                       "groupId": "EXAMPLE-FIN-GRP1",
                       "groupTitle" : "FIN User Defaults (UShell examples)",
                       "parameterIndex" : 13
                   }
               },
               "UshellSamplePlant": {
                   "valueObject": {
                       "value": "Plant1000",
                       "noStore": true,
                       "noEdit": true
                   },
                   "editorMetadata" : {
                       // metadata request only
                       "displayText": "Plant",
                       "description": "This is the plant code",
                       "groupTitle" : "UserDefaultSamplePlugin group2",
                       "groupId": "SamplePlugin-GRP2",
                       "parameterIndex" : 1,
                       "editorInfo" : {
                           // this info is opaque between editor and plugin
                           // assumption is that the editor attempts to bind a smart control to
                           // the given odata service and url
                           "odataURL" : "/sap/opu/odata/sap/ZMM_USER_DEFAULTPARAMETER_SRV",
                           "entityName" : "Defaultparameter",
                           "propertyName" : "Plant",
                           "bindingPath" : "/Defaultparameters('MM')"
                       }
                   }
               }
           };

        // create an artificial asynchrony
        setTimeout(function () {
            oDeferred.resolve(jQuery.extend({}, oTestData));
        }, 0);

        return oDeferred.promise();
    }

    /**
     * A unified shell plugin to support the UserDefaultParameter mechanism
     *
     * By contributing plugins to the unified shell's UserDefaultParameter an
     * application can provide a retrieval mechanism to e.g. initially migrate
     * SU01 set get parameter settings configured at a Back-End to the
     * Front-End-Server
     *
     *
     * These components are shipped similar to configuring them as UI5
     * Application with the Intent "Shell-plugin" will and assigning this
     * intent to a user will (at least at time of writing on an ABAP FES)
     * assure the plugin is instantiated in the unified shell.
     *
     * Per configured TargetMapping, a single instance of the component will be
     * instantiated.  The plugins is passed startupParameters configured at the
     * intent.
     *
     * The component instance lives as long as the unified shell window lives
     *
     * Thus a plugin may store ("cache") internal state (e.g. results of a
     * previous request) within the instance to avoid repetitive roundtrips.
     *
     */
    sap.ui.core.Component.extend("sap.ushell.demo.UserDefaultPluginSample.Component", {

        metadata : {
            manifest: "json"
        },

        /**
         * Register this plugin at the user default service.
         */
        init: function () {
            oRetrievedUserDefaultsPromise = undefined;
            sap.ushell.Container.getService("UserDefaultParameters").registerPlugin(this);
            this.oManagedParameters = {
                    "UshellSampleCompanyCode": true,
                    "UshellSamplePlant": true,
                    "UshellTest1": true,
                    "UshellTest2": true,
                    "UshellTest3": true,
                    "CommunityActivity" : true,
                    "UshellSampleControllingArea" : true,
                    "UshellSampleCostCenter" : true,
                    "FirstName" : true,
                    "LastName" : true,
                    "ExtendedUserDefaultWithPlugin" : true
                };
        },

        /**
         * The function is invoked by the Service to allow a plugin
         * to retrieve or alter a value of the unified shell to use for
         * a parameter
         *
         * The parameter oCurrentParameter is always provided, it may be
         * <code>{ value: undefined }</code>, indicating initial, or a value
         * read from the Front-End-Server storage, or a value already determined
         * by another plugin in the invocation sequence before.
         *
         *
         * The function may resolve and return a new object with altered
         * property values.
         *  Currently relevant property values
         * <code>value,noStore</code>
         *
         * The plugin should first test whether the sParameterName is relevant
         * for it, otherwise it should resolve with the passed object
         *
         * The general pattern for plugins realizing the "provide value only if
         * initial" pattern, is to resolve with the passed object if
         * <code>{ value: xxx }</code>
         * is already filled, thus giving precedence to a value determined
         * before.  (e.g. set by user).
         *
         * If an initial state is detected, (indicated by "value ===
         * undefined"), a plugin responsible for the parameter may attempt to
         * retrieve a value from e.g. a backend persistence and set it.
         *
         * This function is used in the runtime scenario.  It will be
         * exclusively invoked by the unified shells services.
         * It is of utmost importance that the promise is resolved quickly
         * (esp. if the parameter is not relevant for this plugin),
         * as it is frequently invoked ( potentially before initial navigation)
         * or tile display!
         *
         *
         *If the plugin detects a fatal error during processing, it should
         *log relevant information as detailed as possible using jQuery.sap.log.error
         *and subsequently reject.
         *The unified shell will *not* continue processing.
         *
         * @param {string} sParameterName
         *     Name of the user default to be retrieved.
         * @param {object} oCurrentParameter
         *     Object to be modified with current values and returned
         * @returns {jQuery.Deferred.promise}
         *     Either as first argument a new object or a modified version of oCurrentParameter in case of success
         *     or as string message in case of failure
         */
        getUserDefault: function (sParameterName, oCurrentParameter) {
            // A deferred resolved or rejected when the user default is obtained
            var that = this,
                oDeferred = new jQuery.Deferred();

            // Resolve immediately if sParameterName is not managed by this plugin.
            if (!this.oManagedParameters.hasOwnProperty(sParameterName)) {
                return oDeferred
                    .resolve(oCurrentParameter)
                    .promise();
            }

            // Resolve immediately if a value for sParameterName was previously determined.
            if (oCurrentParameter && oCurrentParameter.value !== undefined) {
                return oDeferred
                    .resolve(oCurrentParameter)
                    .promise();
            }

            getUserDefaultsPromise()
                .done(function (oUserDefaults) {
                    if (!oUserDefaults.hasOwnProperty(sParameterName)) {
                        oDeferred.resolve(oCurrentParameter);
                    } else {
                        var oValueObject = oUserDefaults[sParameterName].valueObject; 
                        oDeferred.resolve(oValueObject);
                    }
                })
                .fail(function (sReason) {
                    // deep trouble, reject, indication to ushell to terminate.
                    jQuery.sap.log.error("unable to resolve parameter" + sParameterName,that.getMetadata().getName());
                    oDeferred.reject(sReason);
                });

            return oDeferred.promise();
        },

        /**
         * Amends an object pre-filled with user default values (possibly from
         * other plugins) with the default values served by this plugin.
         *
         * @param {object} oEditorMetadata
         *    the editor metadata object to be amended default values.
         *
         * @returns {jQuery.promise}
         *    a jQuery promise that is resolved with the amended editor
         *    metadata object.
         *
         * reject or throw only in abnormal cases after exhaustive console logging,
         * indicating serious trouble and terminate ushell processing
         *
         * <pre>
         *     {
         *     "UshellSampleCostCenter": {
         *         "valueObject" : {
         *             "value": "1000"
         *         },
         *         "editorMetadata" : {
         *             // metadata request only
         *             "displayText" : "Cost center",
         *             "description": "This is the cost center",
         *             "groupId": "EXAMPLE-FIN-GRP1",
         *             "groupTitle" : "FIN User Defaults (UShell examples)",
         *             "parameterIndex" : 2,
         *             "editorInfo" : {
         *                 // this info is opaque between editor and plugin
         *                 // assumption is that the editor attempts to bind a smart control to
         *                 // the given odata service and url
         *                 "odataURL" : "/sap/opu/odata/sap/ZFIN_USER_DEFAULTPARAMETER_SRV",
         *                 "entityName" : "Defaultparameter",
         *                 "propertyName" : "CostCenter",
         *                 "bindingPath" : "/Defaultparameters('FIN')"
         *             }
         *         }
         *     },
         *     "UshellSampleControllingArea": {
         *         "valueObject" : {
         *             "value": "0010"
         *         },
         *         "editorMetadata" : {
         *             // metadata request only
         *             "displayText" : "Controlling Area",
         *             "description": "This is the controlling Area",
         *             "groupId": "EXAMPLE-FIN-GRP1",
         *             "groupTitle" : "FIN User Defaults (UShell examples)",
         *             "parameterIndex" : 3,
         *             "editorInfo" : {
         *                 // this info is opaque between editor and plugin
         *                 // assumption is that the editor attempts to bind a smart control to
         *                 // the given odata service and url
         *                 "odataURL" : "/sap/opu/odata/sap/ZFIN_USER_DEFAULTPARAMETER_SRV",
         *                 "entityName" : "Defaultparameter",
         *                 "propertyName" : "ControllingArea",
         *                 "bindingPath" : "/Defaultparameters('FIN')"
         *             }
         *         }
         *      }
         *     }
         * </pre>
         */
        getEditorMetadata : function(oEditorMetadata) {
            var oDeferred = new jQuery.Deferred(), 
                that = this;

            getUserDefaultsPromise()
                .done(function (oUserDefaults) {
                    // Add an editorMetadata section for managed parameters
                    Object.keys(that.oManagedParameters).forEach(function (sPropertyName) {
                        if (oEditorMetadata.hasOwnProperty(sPropertyName)) {
                            oEditorMetadata[sPropertyName].editorMetadata = oUserDefaults[sPropertyName] && oUserDefaults[sPropertyName].editorMetadata;
                        }
                    });

                    oDeferred.resolve(oEditorMetadata);
                })
                .fail(function (sReason) {
                    jQuery.sap.log.error("Fatal error obtaining metadata for editing,","sap.ushell.demo.UserDefaultPluginSample.Component ");
                    oDeferred.reject(sReason);
                });

            return oDeferred.promise();
        }
    });
})();
},
	"sap/ushell/demo/UserDefaultPluginSample/manifest.json":'{\n    "_version": "1.4.0",\n    "sap.app": {\n        "_version": "1.1.0",\n        "i18n": "messagebundle.properties",\n        "id": "sap.ushell.demo.UserDefaultPluginSample",\n        "type": "component",\n        "embeddedBy": "",\n        "title": "{{title}}",\n        "description": "{{description}}",\n        "applicationVersion": {\n            "version": "1.1.0"\n        },\n        "ach": "CA-UI2-INT-FE",\n        "crossNavigation": {\n            "inbounds": {\n                "Shell-plugin" :{\n                    "semanticObject": "Shell",\n                    "action": "plugin",\n                    "signature": {\n                        "parameters": {},\n                        "additionalParameters": "allowed"\n                    }\n                }\n            }\n        }\n    },\n    "sap.ui": {\n        "_version": "1.1.0",\n        "technology": "UI5",\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        }\n    },\n    "sap.ui5": {\n        "componentName": "sap.ushell.demo.UserDefaultPluginSample",\n        "dependencies": {\n            "minUI5Version":"1.28",\n            "libs": {\n                "sap.m": {\n                    "minVersion": "1.28"\n                }\n            }\n        },\n        "contentDensities": {\n            "compact": true,\n            "cozy": true\n        }\n    },\n    "sap.flp": {\n        "type": "plugin"\n    }\n}\n',
	"sap/ushell/demo/UserDefaultPluginSample/messagebundle.properties":'\r\n# Copyright (c) 2009-2015 SAP SE, All Rights Reserved\r\n# See Translation Guide for SAPUI5 Application Developers in the\r\n# sap help portal for details\r\n# http://help.sap.com/saphelp_uiaddon10/helpdata/en/b9/a2a70596e241ebad8901f1d19fe28e/content.htm?frameset=/en/0c/5f019e130e45ceb8914d72fb0257dd/frameset.htm&current_toc=/en/e4/843b8c3d05411c83f58033bac7f072/plain.htm&node_id=652\r\n\r\n# XTIT: Dialog title\r\ntitle=User Default Plugin Sample\r\n\r\n# XTXT: description\r\ndescription=Sample plugin for user defaults\r\n'
},"sap/ushell/demo/UserDefaultPluginSample/Component-preload"
);
