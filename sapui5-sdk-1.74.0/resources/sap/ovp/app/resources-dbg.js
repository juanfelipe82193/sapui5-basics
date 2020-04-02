/**
 * @fileOverview This file handles the resource bundles for ovp framework.
 */
sap.ui.define(["sap/ui/model/resource/ResourceModel",
            "sap/base/Log"
        ],
    function (ResourceModel, Log) {
        "use strict";

        //Until resources.pResourcePromise is resolved, the corresponding resource bundles should not be read
        var resources = {};
        resources.oResourceBundle = null;
        resources.oResourceModel = null;

        //sap.ui.getCore().getLibraryResourceBundle("sap.ovp", /*Async*/true) returns a promise
        //Promise.then again returns a promise
        resources.pResourcePromise = sap.ui.getCore().getLibraryResourceBundle("sap.ovp", /*Async*/true)
            .then(function (oBundle) {
                if (!oBundle) {
                    //This will reject the pResourcePromise and invoke catch statement
                    return Promise.reject("Bundle creation failure");
                }
                resources.oResourceBundle = oBundle;
                resources.oResourceModel = new ResourceModel({
                    bundleUrl: oBundle.oUrlInfo.url,
                    bundle: oBundle  //Reuse created bundle to stop extra network calls
                });
                //Since object properties are now set, we can resolve the main promise pResourcePromise
                return Promise.resolve(); //Resolve value not required
            }, function (oError) {
                //'throw Error' and 'return Promise.reject()' will behave same here
                throw oError; //Will be finally caught in catch statement
            });
        resources.pResourcePromise.catch(function (oError) {
            Log.error("sap.ovp resource library bundle error:" + oError);
        });

        /**
         * Users of this file (as return Module) can retrieve the text values using any of the following options
         * Module.getText(key)
         * Module.getProperty(key)
         * Module.oResourceBundle.getText(key)
         * Module.oResourceModel.getProperty(key)
         */
        resources.getText = function (sTextKey, aStrings) {
            if (aStrings && aStrings.length > 0) {
                return this.oResourceBundle ? this.oResourceBundle.getText(sTextKey, aStrings) : null;
            } else {
                return this.oResourceBundle ? this.oResourceBundle.getText(sTextKey) : null;
            }
        };
        resources.getProperty = function (sTextKey) {
            return this.oResourceModel ? this.oResourceModel.getProperty(sTextKey) : null;
        };
        return resources;
    }, /* bExport= */ true);