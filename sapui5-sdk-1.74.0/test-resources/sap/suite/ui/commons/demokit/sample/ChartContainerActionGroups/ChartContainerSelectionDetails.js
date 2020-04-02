sap.ui.define([ "sap/ui/core/Item" ], function(Item) {
	"use strict";

	return {
		initializeSelectionDetails: function(chartContainerContent) {
			this.oSelectionDetails = chartContainerContent.getSelectionDetails();
			var oActionGroup1 = new Item({
				key: "1",
				text: "Action Group 1"
			});
			var oActionGroup2 = new Item({
				key: "2",
				text: "Action Group 2"
			});
			this.oSelectionDetails.addActionGroup(oActionGroup1);
			this.oSelectionDetails.addActionGroup(oActionGroup2);
			this.oSelectionDetails.attachActionPress(this._onSelectionDetailsActionPress, this);
		},

		_onSelectionDetailsActionPress: function(oEvent) {
			if (oEvent.getParameter("level") === "Group") {
				var oActionsList1 = sap.ui.xmlfragment("sap.suite.ui.commons.sample.ChartContainerActionGroups.ActionGroups1", this);
				var oActionsList2 = sap.ui.xmlfragment("sap.suite.ui.commons.sample.ChartContainerActionGroups.ActionGroups2", this);
				switch (oEvent.getParameter("action").getKey()) {
					case "1":
						this.oSelectionDetails.navTo("Action list 1", oActionsList1);
						break;
					case "2":
						this.oSelectionDetails.navTo("Action list 2", oActionsList2);
						break;
					default:
						break;
				}
			}
		}
	};
});
