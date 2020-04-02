// define a root UIComponent which exposes the main view
/*global jQuery, sap */
jQuery.sap.declare("sap.ushell.demo.ReceiveParametersTestApp.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.core.routing.Router");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.ReceiveParametersTestApp.Component", {

    oMainView : null,

    // use inline declaration instead of component.json to save 1 round trip
    metadata : {
        "manifest": "json"
    },

    createContent : function () {
        "use strict";
        var oModel,
            oModel2,
            oComponentData;
        jQuery.sap.log.info("sap.ushell.demo.ReceiveParametersTestApp: Component.createContent");

//        this.oRouter.initialize(); // router initialization must be done after view construction

        oModel = new sap.ui.model.json.JSONModel();

        /* *StartupParameters* (2)   */
        /* http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#Action-toappnavsample?AAA=BBB&DEF=HIJ */
        /* results in   { AAA : [ "BBB"], DEF: ["HIJ"] }  */
        oComponentData = this.getComponentData && this.getComponentData();
        jQuery.sap.log.info("sap.ushell.demo.ReceiveParametersTestApp: app was started with parameters " + JSON.stringify(oComponentData.startupParameters || {}));

        oModel.setData(this.createStartupParametersData(oComponentData && oComponentData.startupParameters || {}));
        this.setModel(oModel, "startupParameters");

        this.oMainView = sap.ui.xmlview("sap.ushell.demo.ReceiveParametersTestApp.Main");
        this.oMainView.setHeight("100%");
        oModel2 = new sap.ui.model.json.JSONModel({ appstate : " no app state "});
        sap.ushell.Container.getService("CrossApplicationNavigation").getStartupAppState(this).done(function (oAppState) {
            oModel2.setProperty("/appstate", JSON.stringify(oAppState.getData() || " no app state ", undefined, 2));
        });
        this.oMainView.setModel(oModel2, "AppState");
        var that = this;
        if(oComponentData && oComponentData.startupParameters && oComponentData.startupParameters["block"]
        || oComponentData && oComponentData.startupParameters && oComponentData.startupParameters["block-count"]
        || oComponentData && oComponentData.startupParameters && oComponentData.startupParameters["block-waves"]) {
            var block =       oComponentData && oComponentData.startupParameters && oComponentData.startupParameters["block"] && oComponentData.startupParameters["block"][0] || 1000;
            var block_count = oComponentData && oComponentData.startupParameters && oComponentData.startupParameters["block-count"] &&  oComponentData && oComponentData.startupParameters && oComponentData.startupParameters["block-count"][0] || 1;
            var block_waves = oComponentData && oComponentData.startupParameters && oComponentData.startupParameters["block-waves"] &&  oComponentData && oComponentData.startupParameters && oComponentData.startupParameters["block-waves"][0] || 1;
            var block_delay = oComponentData && oComponentData.startupParameters && oComponentData.startupParameters["block-delay"] &&  oComponentData && oComponentData.startupParameters && oComponentData.startupParameters["block-delay"][0]  || 1;


            function makeBlock(i,w,block) {
            var fname = "w" + w + "_" + i;
                that[fname] = function() {
                    var tmI = new Date().getTime();
                    var ts = 0;
                    var k = 3;
                    while(ts < block) {
                        k = k + 1; 
                        ts = (new Date().getTime()) - tmI;
                        k = k + ts;
                    };
                    jQuery.sap.log.error("wavew" + w + "_" + i + " done " + k);
                    if( i === 0 ) {
                        makeWave(w+1,block);
                    }
                };
                jQuery.sap.log.error("schedule wave" + fname);
                setTimeout(that[fname],block_delay);
            }
            function makeWave(w,block) {
                if (w >= block_waves ) {
                    return;
                }
                for(i = 0; i < block_count; ++i) {
                    makeBlock(i,w,block);
                }
            }
            makeWave(0,block);
            function a() {
                var tmI = new Date().getTime();
                var ts = 0;
                var k = 3;
                while(ts < block) {
                    k = k + 1;
                    ts = (new Date().getTime()) - tmI;
                    k = k + ts;
                };
            };
            a(); // block once synchronous
        }
        return this.oMainView;
    },

    createStartupParametersData : function (oComponentData) {
        "use strict";
        // convert the raw componentData into a model that is consumed by the UI
        var aParameters = [],
            sKey = null;
        if (oComponentData) {
            for (sKey in oComponentData) {
                if (Object.prototype.hasOwnProperty.call(oComponentData, sKey)) {
                    if (sKey === "CRASHME") {
                        throw new Error("Deliberately crashed on startup");
                    }
                    aParameters.push({
                        key : sKey,
                        value : oComponentData[sKey].toString()
                    });
                }
            }
        }
        return {
            "parameters" : aParameters
        };
    },

    exit : function () {
        "use strict";
        jQuery.sap.log.info("sap.ushell.demo.ReceiveParametersTestApp: Component.js exit called : this.getId():" + this.getId());

        this.oMainView = null;
    }
});
