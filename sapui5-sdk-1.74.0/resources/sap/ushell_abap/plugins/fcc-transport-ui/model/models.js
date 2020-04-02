sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(J,D){"use strict";return{createDeviceModel:function(){var m=new J(D);m.setDefaultBindingMode("OneWay");return m;}};});
