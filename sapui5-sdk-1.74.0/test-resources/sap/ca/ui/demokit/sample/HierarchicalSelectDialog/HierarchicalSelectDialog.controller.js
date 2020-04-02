jQuery.sap.require("sap.ui.core.util.MockServer");
sap.ui.controller("sap.ca.ui.sample.HierarchicalSelectDialog.HierarchicalSelectDialog", {

    onInit : function() {
		// set global models
		var oMockServer = new sap.ui.core.util.MockServer({
			rootUri : "/sap/hierarchicalData/"});
		oMockServer.simulate("test-resources/sap/ca/ui/demokit/sample/HierarchicalSelectDialog/HierarchicalSelectDialogMetadata.xml");
		oMockServer.start();

		var m = new sap.ui.model.odata.ODataModel("/sap/hierarchicalData/", true);
		this.getView().setModel(m, "odata");

        var m = new sap.ui.model.json.JSONModel({
            "WorkItems" : [
                {
                    name:"WorkItem_1",
                    description:"My_WorkItem1",
                    ItemDetails : [
                        {
                            name:"WI-1-Item-1",
                            description:"First subitem",
                            ItemSubDetails:[
                                {
                                    name:"WI-1-I-1-Sub-1",
                                    description:"Sub item detail 1"
                                },
                                {
                                    name:"WI-1-I-1-Sub-2",
                                    description:"Sub item detail 2"
                                }
                            ]
                        },
                        {
                            name:"WI-1-Item-2",
                            description:"Other subitem",
                            ItemSubDetails:[
                                {
                                    name:"WI-1-I-2-Sub-1",
                                    description:"Sub item detail 1"
                                },
                                {
                                    name:"WI-1-I-2-Sub-2",
                                    description:"Sub item detail 2"
                                }
                            ]
                        }
                    ]
                },
                {
                    name:"WorkItem_2",
                    description:"My other workitem",
                    ItemDetails : [
                        {
                            name:"WI-2-Item-1",
                            description:"First subitem",
                            ItemSubDetails:[
                                {
                                    name:"WI-2-I-1-Sub-1",
                                    description:"Sub item detail 1"
                                },
                                {
                                    name:"WI-2-I-1-Sub-2",
                                    description:"Sub item detail 2"
                                }
                            ]
                        },
                        {
                            name:"WI-2-Item-2",
                            description:"Other subitem",
                            ItemSubDetails:[
                                {
                                    name:"WI-2-I-2-Sub-1",
                                    description:"Sub item detail 1"
                                },
                                {
                                    name:"WI-2-I-2-Sub-2",
                                    description:"Sub item detail 2"
                                }
                            ]
                        }
                    ]
                },
                {
                    name:"WorkItem_3",
                    description:"My third workitem",
                    ItemDetails : [
                        {
                            name:"WI-3-Item-1",
                            description:"First subitem",
                            ItemSubDetails:[
                                {
                                    name:"WI-3-I-1-Sub-1",
                                    description:"Sub item detail 1"
                                },
                                {
                                    name:"WI-3-I-1-Sub-2",
                                    description:"Sub item detail 2"
                                }
                            ]
                        },
                        {
                            name:"WI-1-Item-2",
                            description:"Other subitem",
                            ItemSubDetails:[
                                {
                                    name:"WI-3-I-2-Sub-1",
                                    description:"Sub item detail 1"
                                },
                                {
                                    name:"WI-3-I-2-Sub-2",
                                    description:"Sub item detail 2"
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        this.getView().setModel(m, "json");

        this.oHierchicalSelectDialog = sap.ui.xmlfragment("sap.ca.ui.sample.HierarchicalSelectDialog.HierarchicalSelectDialog", this);
    },

	openHierarchicalSelectDialog : function(oEvent) {

        this.oHierchicalSelectDialog.setModel(this.getView().getModel("odata"), "odata");
        this.oHierchicalSelectDialog.setModel(this.getView().getModel("json"), "json");
        this.oHierchicalSelectDialog.open();

	}

});
