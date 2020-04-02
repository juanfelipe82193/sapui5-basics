// define a root UIComponent which exposes the main view
/*global jQuery, sap */
jQuery.sap.declare("sap.ushell.demo.TargetResolutionTool.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.core.routing.Router");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.TargetResolutionTool.Component", {
    oMainView : null,

    // use inline declaration instead of component.json to save 1 round trip
    metadata : {
        "manifest": "json"
    },
    getInnerAppRouter : function () {
        "use strict";
        return this.oRouter;
    },

    createContent : function () {
        "use strict";
        var aRoutes;
        //     oRouter,
        //     oModel,
        //     oModel2,
        //     oComponentData;

        /* *Nav* (1)  declare a route config  */
        aRoutes =  [
            {
                /* we encode the viewname in the path */
                pattern : "{viewName}/",
                name : "toaView" // name of the single route
            },
            {
                /* we encode the viewname in the path */
                pattern : ":all*:", //catchall
                name : "_home"// name of the single route
            }
        ];

        /* *Nav* (2) and construct the router instance */
        this.oRouter = new sap.ui.core.routing.Router(aRoutes);
        this.oRouter.register("sap.ushell.demo.TargetResolutionTool");  // unique name of router (!)

        this.oMainView = sap.ui.view({
            type: sap.ui.core.mvc.ViewType.XML,
            viewName:  "sap.ushell.demo.TargetResolutionTool.Main",
            id: this.createId("MainView")
        });
        this.oRouter.initialize(); // router initialization must be done after view construction

        // oModel = new sap.ui.model.json.JSONModel();
        // /* *StartupParameters* (2)   */
        // /* http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#Action-toappnavsample?AAA=BBB&DEF=HIJ */
        // /* results in   { AAA : [ "BBB"], DEF: ["HIJ"] }  */
        // oComponentData = this.getComponentData && this.getComponentData();

        // oModel.setData(this.createStartupParametersData(oComponentData && oComponentData.startupParameters || {}));
        // this.oMainView.setModel(oModel, "startupParameters");

        // oModel2 = new sap.ui.model.json.JSONModel({ appstate : " no app state "});
        // sap.ushell.Container.getService("CrossApplicationNavigation").getStartupAppState(this).done(function (oAppState) {
        //     var oAppStateData = oAppState.getData(),
        //         oModelData = {"parameters": []};
        //     oModelData.stringifiedAppstate = JSON.stringify(oAppState.getData() || " no app state ");
        //     oModelData.appStateKey = oAppState.getKey();
        //     // array or object
        //     if (typeof oAppStateData === "object") {
        //         Object.keys(oAppStateData).forEach(function (sParamName) {
        //             oModelData.parameters.push({"name": sParamName, "value": JSON.stringify(oAppStateData[sParamName])});
        //         });
        //     }
        //     oModel2.setProperty("/appstate", oModelData);
        // });
        // this.oMainView.setModel(oModel2, "AppState");
        // // if we have a startup parameter View=, we want to navigate to this view
        // // (but only if the route is _Home!");
        // // we handle this when the _home route is handled

        return this.oMainView;
    },

    // createStartupParametersData : function (oComponentData) {
    //     "use strict";
    //     // convert the raw componentData into a model that is consumed by the UI
    //     var aParameters = [],
    //         sKey = null;
    //     if (oComponentData) {
    //         for (sKey in oComponentData) {
    //             if (Object.prototype.hasOwnProperty.call(oComponentData, sKey)) {
    //                 if (sKey === "CRASHME") {
    //                     throw new Error("Deliberately crashed on startup");
    //                 }
    //                 aParameters.push({
    //                     key : sKey,
    //                     value : oComponentData[sKey].toString()
    //                 });
    //             }
    //         }
    //     }
    //     return {
    //         "parameters" : aParameters
    //     };
    // },

    exit : function () {
        "use strict";
        this.oMainView = null;
    }
});
