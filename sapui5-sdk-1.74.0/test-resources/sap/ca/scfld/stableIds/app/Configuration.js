// Copyright (C) 2015 SAP SE or an SAP affiliate company. All rights reserved
(function () {
    "use strict";
    /*global jQuery, sap*/
    jQuery.sap.declare("sap.ca.scfld.stableids.app.Configuration");
    jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
    jQuery.sap.require("sap.ca.scfld.md.app.Application");

    sap.ca.scfld.md.ConfigurationBase.extend("sap.ca.scfld.stableids.app.Configuration", {
        oServiceParams : {
            serviceList : [{
                name : "SRA004_SRV",
                masterCollection : "Travels",
                serviceUrl : "/sap/opu/odata/sap/SRA004_SRV/",
                isDefault : true,
                metadataParams : "sap-documentation=heading,quickinfo&foo=bar=b%61z&%62az&",
                mockedDataSource : "./model/metadata.xml",
                // let Javascript convert the array of results (if available) to a string; use ==
                useV2ODataModel :
                    jQuery.sap.getUriParameters().mParams["useV2ODataModel"] == "true"
            }]
        },

        getServiceParams : function () {
            return this.oServiceParams;
        },

        /**
         * @inherit
         */
        getServiceList : function () {
            return this.getServiceParams().serviceList;
        },

        getMasterKeyAttributes : function () {
            return ["Id"];
        },

        getExcludedQueryStringParameters : function () {
            return []; //["sap-language"];
        },

        keepMultiSelection : function () {
            return jQuery.sap.getUriParameters().mParams["keepMultiSelection"] == "true";
        },

        isUsingStableIds : function () {
            return jQuery.sap.getUriParameters().mParams["stableIDs"] == "true";
        }
    });
}());