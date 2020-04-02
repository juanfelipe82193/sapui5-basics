sap.ui.define([
   "sap/ui/core/mvc/Controller"
], function (Controller) {
   "use strict";
   return Controller.extend("sap.ui.demo.wt.controller.App", {
       toMaster2Page : function () {
           var oMaster2 = this.getView().byId("master2");
           this.getView().byId("splitContainer").toMaster(oMaster2);
       },
       backMaster : function () {
           this.getView().byId("splitContainer").backMaster();
       },
       toDetail2Page : function () {
           var oDetail2 = this.getView().byId("detail2");
           this.getView().byId("splitContainer").toDetail(oDetail2);
       },
       backDetail : function () {
           this.getView().byId("splitContainer").backDetail();
       },
       toPage2 : function () {
           var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           oRouter.navTo("page2");
       },
       back : function () {
           window.history.back();
       }
   });
});