sap.ui.define([
    'sap/ui/Device'
    ], function(Device) {
    "use strict";

    return {
        initPageSettings : function(oView) {
            // Hide Settings Panel for phone
            if (Device.system.phone) {
                var oSettingsPanel = oView.byId('settingsPanel');
                if (oSettingsPanel){
                    oSettingsPanel.setExpanded(false);
                }
            }
        }
    };
});