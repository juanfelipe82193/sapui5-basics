sap.ui.define([
    "sap/ui/core/UIComponent",
       "sap/suite/ui/generic/template/lib/TemplateComponent",
       "sap/ui/generic/app/transaction/TransactionController",
       "sap/ui/generic/app/transaction/DraftController",
       "sap/ui/generic/app/AppComponent",
       "sap/ui/core/mvc/XMLView",
       "sap/ui/core/util/MockServer",
       "sap/ui/model/json/JSONModel",
       "sap/ui/model/odata/v2/ODataModel",
	   "sap/ui/core/CustomData",
	   "sap/suite/ui/generic/template/lib/routingHelper"
    ],function(UIComponent, TemplateComponent) {
    "use strict";
    var _sBindingPath;
    var oMockServer;
    var oGetComponentDataStub;

    QUnit.module("sap.suite.ui.generic.template.lib.TemplateComponent", {
        setup: function() {
            oGetComponentDataStub = sinon.stub(UIComponent.prototype, "getComponentData", function(){
                return {
                    registryEntry: {}
                };
            });
               this.oTemplateComponent = new TemplateComponent();
               this.oTemplateComponent._sBindingPath = "SEPMRA_C_PD_Product(ActiveProduct='HT-1001',ProductDraftUUID=guid'005056A7-004E-1ED5-8EED-C27B5E2595D4')";
        },
        teardown: function() {
            this.oTemplateComponent.destroy();
            oGetComponentDataStub.restore();
        }
    });

    QUnit.test("Shall be instantiable", function(assert) {
        assert.ok(this.oTemplateComponent);
    });
});
