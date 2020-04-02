sap.ui.define([ 'sap/ui/core/Item', 'sap/m/MessageToast', 'sap/ui/layout/VerticalLayout', 'sap/m/Button', 'sap/m/Text', 'sap/m/Image' ],
	function(Item, MessageToast, VerticalLayout, Button, Text, Image) {
	"use strict";

	return {
		/**
		 * Fills the SelectionDetails Popover with actions.
		 *
		 * @param {Object} chartContainerContent The instance of the ChartContainerContent used
		 */
		_initializeSelectionDetails: function(chartContainerContent) {
			var oSelectionDetails = chartContainerContent.getSelectionDetails();
			oSelectionDetails.addAction(
				new Item({
						key: "Action 1",
						text: "First List Action"
					}
				)
			);
			oSelectionDetails.addAction(
				new Item({
						key: "Action 2",
						text: "Second List Action"
					}
				)
			);
			oSelectionDetails.attachBeforeOpen(this._onSelectionDetailsBeforeOpen, this);
			oSelectionDetails.attachActionPress(function(oEvent) {
				MessageToast.show(oEvent.getParameter("action").getText() + " is pressed.\nAt the moment of press " + oEvent.getParameter("items").length + " items were selected.");
			});
			oSelectionDetails.attachNavigate(this._onSelectionDetailsNavigate, this);
		},

		/**
		 * Fills the SelectionDetails items with actions.
		 *
		 * @param {sap.ui.base.Event} event The SAPUI5 event instance
		 */
		_onSelectionDetailsBeforeOpen: function(event) {
			var aItems = event.getSource().getItems();
			for (var i = 0; i < aItems.length; i++) {
				aItems[i].setEnableNav(true);
				aItems[i].addAction(new Item({
					key: i,
					text: "Item Action " + i
				}));
			}
		},

		/**
		 * Fills the contents of the next pages.
		 *
		 * @param {Object} chartContainerContent The instance of the ChartContainerContent used
		 * @param {sap.ui.base.Event} event The SAPUI5 event object.
		 */
		_onSelectionDetailsNavigate: function(event) {
			if (event.getParameter("direction") === "back") {
				return;
			}
			var oSelectionDetails = event.getSource();
			var oText = new Text({
				text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua." +
				"At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet." +
				"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua." +
				"At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
			});
			var VBox2 = new VerticalLayout({
				content: [
					new Image({
						src: "test-resources/sap/suite/ui/commons/demokit/images/strawberries_frozen.jpg"
					}),
					new Text({
						text: "More information can be displayed here."
					})
				]
			}).addStyleClass("sapUiSmallMargin");
			var oButton = new Button({
				text: "More Details",
				press: function() {
					oSelectionDetails.navTo("Second Level of Navigation", VBox2);
				}
			});
			var oVBox1 = new VerticalLayout({
				content: [ oText, oButton ]
			}).addStyleClass("sapUiSmallMargin");
			oSelectionDetails.navTo("First Level of Navigation", oVBox1);
		}
	};
});
