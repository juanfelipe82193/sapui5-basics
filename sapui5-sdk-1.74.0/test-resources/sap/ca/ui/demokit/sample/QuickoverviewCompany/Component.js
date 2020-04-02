jQuery.sap.declare("sap.ca.ui.sample.QuickoverviewCompany.Component");

sap.ui.core.UIComponent.extend("sap.ca.ui.sample.QuickoverviewCompany.Component", {

    metadata: {
        rootView: "sap.ca.ui.sample.QuickoverviewCompany.Company",
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
                    "Company.view.xml",
                    "Company.controller.js"
                ]
            }
        }
    }
});