/*global sap, jQuery, JSONModel*/
// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.controller("sap.ushell.demo.UserDefaults.view.SimpleEditor", {


    /**
    * Called when a controller is instantiated and its View controls (if available) are already created.
    * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
    * @memberOf view.Detail
    */
    onInit: function () {
        "use strict";
        this.oModel = new sap.ui.model.json.JSONModel({
            aUserDef: [ //actually not used - is there to become an idea of the metaData structure
                       {
                            "parameterName" : "InitialParameterName",
                            "valueObject" : {
                                "value" : "InitialFromApplication"
                            },
                            "editorMetadata" : {
                                "displayText" : "InitialDisplayTextFromApp",
                                "description": "InitialDescriptionFromApp",
                                "parameterIndex": "InitialParameterIndex",
                                "groupId": "InitialGROUP-IDFromApp",
                                "groupTitle" : "InitialGroupTitleFromApp"
                            }
                       }
                    ]
        });
        this.getView().setModel(this.oModel);
        // fill the parameters directly on startup
        this.handleRefreshParameters();
   },

    getRouter: function () {
        "use strict";
        return this.getOwnerComponent().getRouter();
    },

    getParameterViaEvent: function (oEvent) {
        var sPath = oEvent.oSource.getParent().getBindingContext().sPath,
        oParameter;

        oParameter = this.oModel.getProperty(sPath);
        console.log(oParameter);
        return oParameter;
    },

    handleSaveParameters : function (oEvent) {
        var oParameter = jQuery.extend(true, {}, this.getParameterViaEvent(oEvent));

        if (oParameter.valueObject) {
            if (oParameter.valueObject.extendedValue) {
                oParameter.valueObject.extendedValue = JSON.parse(oParameter.valueObject.extendedValue);
            } else {
                delete oParameter.valueObject.extendedValue;
            }
        }

        sap.ushell.Container.getService("UserDefaultParameters")
              .editorSetValue(oParameter.parameterName, oParameter.valueObject);
    },
    handleResetParameters : function (oEvent) {
        var that = this,
            oParameter = this.getParameterViaEvent(oEvent);

        // set entire object to undefined means delete it from FES
        sap.ushell.Container.getService("UserDefaultParameters")
        .editorSetValue(oParameter.parameterName, {value: undefined})
            .done(function () {
                // refresh the related UI controls
                that.handleRefreshParameters();
            });
    },

    handleRefreshParameters : function () {
        var that = this;

        sap.ushell.Container.getService("UserDefaultParameters").editorGetParameters().done(function(oParameters) {
            that.updateParametersForModel(oParameters, that.oModel);
        });
    },

    updateParametersForModel : function (oParameters, oModel) {
        var aUserDefTmp = []; // use an empty array to be able to delete parameters

        //for each property name -> push all array elements into aUserDef
        for (var sParameter in oParameters) {
            //copy the parameter name because we want to show it in the UI later
            oParameters[sParameter].parameterName = sParameter;

            // if no display text is available, use the parameter name
            // note: save ignores the metadata
            if (!oParameters[sParameter].editorMetadata) {
                oParameters[sParameter].editorMetadata = {
                    "displayText" : oParameters[sParameter].parameterName
                };
            }
            if (oParameters[sParameter].valueObject && oParameters[sParameter].valueObject.extendedValue) {
                oParameters[sParameter].valueObject.extendedValue = JSON.stringify(oParameters[sParameter].valueObject.extendedValue);
            }
            aUserDefTmp.push(oParameters[sParameter]);
        }

        // sort by groupid, parameterindex
        aUserDefTmp.sort(function(oDefault1, oDefault2) {
            //first by groupId
            var returnValueOfCompareByGroupId = compareByGroupId(oDefault1, oDefault2);
            if (returnValueOfCompareByGroupId === 0) {
                //then by parameterIdx
                return compareByParameterIndex(oDefault1, oDefault2);
            }

            return returnValueOfCompareByGroupId;
        });
        
        // compare by groupId
        function compareByGroupId(oDefault1, oDefault2) {
            // handle default without metadata
            if (!(oDefault2.editorMetadata && oDefault2.editorMetadata.groupId)) {
                return -1; // keep order
            }
            if (!(oDefault1.editorMetadata && oDefault1.editorMetadata.groupId)) {
                return 1; // move oDefault1 to the end
            }

            if (oDefault1.editorMetadata.groupId < oDefault2.editorMetadata.groupId) return -1;
            if (oDefault1.editorMetadata.groupId > oDefault2.editorMetadata.groupId) return 1;

            return 0;
        };
        
        // compare by parameterIndex
        function compareByParameterIndex(oDefault1, oDefault2) {
            // handle default without metadata
            if (!(oDefault2.editorMetadata && oDefault2.editorMetadata.parameterIndex)) {
                return -1; // keep order
            }
            if (!(oDefault1.editorMetadata && oDefault1.editorMetadata.parameterIndex)) {
                return 1; // move oDefault1 to the end
            }
            return oDefault1.editorMetadata.parameterIndex - oDefault2.editorMetadata.parameterIndex;
        };

        oModel.setData({ "aUserDef": aUserDefTmp}, false); // false -> do not merge
    }

});
