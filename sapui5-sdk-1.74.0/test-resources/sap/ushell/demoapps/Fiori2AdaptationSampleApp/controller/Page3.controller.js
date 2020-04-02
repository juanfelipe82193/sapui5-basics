sap.ui.define([
   "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
   "use strict";
   return Controller.extend("sap.ui.demo.wt.controller.Page3", {

      onUpdateMasterTitle : function() {
          this.getView().byId("master1").setTitle("Master1Updated");
      },
      toMaster2Page : function () {
          var oMaster2 = this.getView().byId("master2");
          this.getView().byId("splitContainer").toMaster(oMaster2);
      },
      backMaster : function () {
          this.getView().byId("splitContainer").backMaster();
      },
      onUpdateDetailTitle : function() {
           this.getView().byId("detail1").setTitle("Detail1Updated");
      },
      toDetail2Page : function () {
          var oDetail2 = this.getView().byId("detail2");
          this.getView().byId("splitContainer").toDetail(oDetail2);
      },
      backDetail : function () {
          this.getView().byId("splitContainer").backDetail();
      },
      toPage4 : function () {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("page4");
      },
      back : function () {
          //this.getView().byId("app").back();
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("page2");
          MessageToast.show("Page3CustomBack")
      }
   });
});