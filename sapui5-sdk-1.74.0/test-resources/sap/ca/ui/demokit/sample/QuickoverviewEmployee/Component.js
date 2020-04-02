jQuery.sap.declare("sap.ca.ui.sample.QuickoverviewEmployee.Component");

sap.ui.core.UIComponent.extend("sap.ca.ui.sample.QuickoverviewEmployee.Component", {

    metadata: {
        rootView: "sap.ca.ui.sample.QuickoverviewEmployee.Quickoverview",
        dependencies: {
            libs: [
                "sap.m",
                "sap.ca.ui"
            ]
        },
        config: {
            sample: {
                stretch: true,
                files: [
                    "Quickoverview.view.xml",
                    "Quickoverview.controller.js"
                ]
            }
        }
    }
});