sap.ui.define(["sap/ui/generic/app/AppComponent"], function (AppComponent) {
  "use strict";
  sap.ui.getCore().loadLibrary("sap.ui.generic.app");
  return AppComponent.extend("sap.ushell.plugins.ghostapp.Component", {
    metadata: {
      "manifest": "json"
    }
  });
});
