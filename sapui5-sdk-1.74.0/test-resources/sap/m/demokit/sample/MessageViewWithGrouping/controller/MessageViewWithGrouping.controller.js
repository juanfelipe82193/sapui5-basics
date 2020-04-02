sap.ui.define([
	'sap/m/MessageView',
	'sap/m/MessagePopoverItem',
	'sap/m/Link',
	'sap/m/Dialog',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/m/Button',
	'sap/m/Bar',
	'sap/m/Text'
], function(MessageView, MessagePopoverItem, Link, Dialog, Controller, JSONModel, Button, Bar, Text) {
	"use strict";

	var oLink = new Link({
		text: "Show more information",
		href: "http://sap.com",
		target: "_blank"
	});

	var oMessageTemplate = new MessagePopoverItem({
		type: '{type}',
		title: '{title}',
		description: '{description}',
		subtitle: '{subtitle}',
		counter: '{counter}',
		groupName: '{group}',
		link: oLink
	});

	return Controller.extend("sap.m.sample.MessageViewWithGrouping.controller.MessageViewWithGrouping", {
		onInit: function () {
			var that = this;
			// create any data and a model and set it to the view

			var sErrorDescription = 'First Error message description. \n' +
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod' +
				'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,' +
				'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo' +
				'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse' +
				'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non' +
				'proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

			var aMockMessages = [{
				type: 'Error',
				title: 'Account 801 requires an assignment',
				description: sErrorDescription,
				subtitle: 'Role is invalid',
				group: "Purchase Order 450001"
			}, {
				type: 'Warning',
				title: 'Account 821 requires a check',
				description: sErrorDescription,
				subtitle: 'Undefined task',
				group: "Purchase Order 450001"
			}, {
				type: 'Warning',
				title: 'Enter a text with maximum 6 characters length',
				description: sErrorDescription,
				group: "Purchase Order 450002"
			}, {
				type: 'Warning',
				title: 'Enter a text with maximum 8 characters length',
				description: sErrorDescription,
				group: "Purchase Order 450002"
			}, {
				type: 'Error',
				title: 'Account 802 requires an assignment',
				description: sErrorDescription,
				subtitle: 'Role is invalid',
				group: "Purchase Order 450002"
			}, {
				type: 'Error',
				title: 'Technical message without object relation',
				description: sErrorDescription,
				group: "General"
			}, {
				type: 'Warning',
				title: 'Global System will be down on Sunday',
				description: sErrorDescription,
				group: "General"
			}, {
				type: 'Error',
				title: 'Global System will be down on Sunday',
				description: sErrorDescription,
				group: "General"
			}, {
				type: 'Error',
				title: 'An Error',
				subtitle: "Ungrouped message",
				description: sErrorDescription
			}, {
				type: 'Warning',
				title: 'A Warning',
				subtitle: "Ungrouped message",
				description: sErrorDescription
			}];

			var oModel = new JSONModel();
			oModel.setData(aMockMessages);

			var viewModel = new JSONModel();
			viewModel.setData({
				messagesLength: aMockMessages.length + ''
			});

			this.getView().setModel(viewModel);

			this.oMessageView = new MessageView({
					showDetailsPageHeader: false,
					itemSelect: function () {
						oBackButton.setVisible(true);
					},
					items: {
						path: '/',
						template: oMessageTemplate
					},
					groupItems: true
				});
			var oBackButton = new Button({
					icon: sap.ui.core.IconPool.getIconURI("nav-back"),
					visible: false,
					press: function () {
						that.oMessageView.navigateBack();
						this.setVisible(false);
					}
				});

			this.oMessageView.setModel(oModel);

			this.oDialog = new Dialog({
				content: this.oMessageView,
				contentHeight: "440px",
				contentWidth: "640px",
				endButton: new Button({
					text: "Close",
					press: function() {
						this.getParent().close();
					}
				}),
				customHeader: new Bar({
					contentMiddle: [
						new Text({ text: "Publish order"})
					],
					contentLeft: [oBackButton]
				}),
				verticalScrolling: false
			});
		},

		handleMessageViewPress: function (oEvent) {
			this.oMessageView.navigateBack();
			this.oDialog.open();
		}
	});
});