sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessagePopover",
	"sap/m/MessagePopoverItem",
	"sap/m/Label",
	"sap/ui/core/message/ControlMessageProcessor",
	"sap/ui/model/Filter",
	"sap/ui/core/message/Message"
], function (Controller, JSONModel, MessagePopover, MessagePopoverItem, Label, ControlMessageProcessor, Filter, Message) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.filterbar.DynamicPageAnalyticalTable.DynamicPageAnalyticalTable", {
		onInit: function () {
			this.oModel = new JSONModel();
			this.oModel.loadData(sap.ui.require.toUrl("sap/ui/comp/sample/filterbar/DynamicPageListReport/model.json"), null, false);
			this.getView().setModel(this.oModel);

			this.aKeys = ["Name", "Category", "SupplierName"];
			this.oSelectName = this.getSelect("slName");
			this.oSelectCategory = this.getSelect("slCategory");
			this.oSelectSupplierName = this.getSelect("slSupplierName");
			this.oModel.setProperty("/Filter/text", "Filtered by None");
			this.addSnappedLabel();

			this._oMessageProcessor = new ControlMessageProcessor();
			this._oMessageManager = sap.ui.getCore().getMessageManager();
			this._oMessageManager.registerMessageProcessor(this._oMessageProcessor);

			// Initializing popover
			this.initializePopover();
		},
		onExit: function () {
			this.aKeys = [];
			this.aFilters = [];
			this.oModel = null;
		},
		onToggleFooter: function () {
			this.getPage().setShowFooter(!this.getPage().getShowFooter());
		},
		onToggleHeader: function () {
			this.getPage().setHeaderExpanded(!this.getPage().getHeaderExpanded());
		},
		onSelectChange: function() {
			var aCurrentFilterValues = [];

			aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectName));
			aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectCategory));
			aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectSupplierName));

			this.updateFilterCriteria(this.getFilterCriteria(aCurrentFilterValues));
		},
		formatToggleButtonText: function (bValue) {
			return bValue ? "Hide Filters" : "Show Filters";
		},
		updateFilterCriteria: function (aFilterCriteria) {
				this.removeSnappedLabel();
				/* because in case of label with an empty text, */
				this.addSnappedLabel();
				/* a space for the snapped content will be allocated and can lead to title misalignment */
				this.oModel.setProperty("/Filter/text", this.getFormattedSummaryText(aFilterCriteria));
		},
		addSnappedLabel: function () {
			var oSnappedLabel = this.getSnappedLabel();
			oSnappedLabel.attachBrowserEvent("click", this.onToggleHeader, this);
			this.getPageTitle().addSnappedContent(oSnappedLabel);
		},
		removeSnappedLabel: function () {
			this.getPageTitle().destroySnappedContent();
		},
		getFilters: function (aCurrentFilterValues) {
			this.aFilters = [];

			this.aFilters = this.aKeys.map(function (sCriteria, i) {
				return new Filter(sCriteria, sap.ui.model.FilterOperator.Contains, aCurrentFilterValues[i]);
			});

			return this.aFilters;
		},
		getFilterCriteria: function (aCurrentFilterValues) {
			return this.aKeys.filter(function (el, i) {
				if (aCurrentFilterValues[i] !== "") {
					return el;
				}
			});
		},
		getFormattedSummaryText: function (aFilterCriterias) {
			if (aFilterCriterias.length > 0) {
				return "Filtered by (" + aFilterCriterias.length + "): " + aFilterCriterias.join(", ");
			} else {
				return "Filtered by None";
			}
		},
		getSelect: function (sId) {
			return this.getView().byId(sId);
		},
		getSelectedItemText: function (oSelect) {
			return oSelect.getSelectedItem() ? oSelect.getSelectedItem().getKey() : "";
		},
		getPage: function () {
			return this.getView().byId("dynamicPageId");
		},
		getPageTitle: function () {
			return this.getPage().getTitle();
		},
		getSnappedLabel: function () {
			return new Label({text: "{/Filter/text}"});
		},
		// Function returning random message each time it is called
		getRandomMessage: function () {
			// Creating several options for messages, to make sure that different messages are added
			var messageOptions = [{
				message: "Error message",
				description: "Error message description",
				type: sap.ui.core.MessageType.Error,
				processor: this._oMessageProcessor
			}, {
				message: "Information message",
				description: "Information message description",
				type: sap.ui.core.MessageType.Information,
				processor: this._oMessageProcessor
			}, {
				message: "Success message",
				description: "Success message description",
				type: sap.ui.core.MessageType.Success,
				processor: this._oMessageProcessor
			}, {
				message: "Warning message",
				description: "Warning message description",
				type: sap.ui.core.MessageType.Warning,
				processor: this._oMessageProcessor
			}];
			return messageOptions[Math.floor(Math.random() * 4)];
		},
		initializePopover: function (oControl) {
			this._messagePopover = new MessagePopover({
				models: {message: this._oMessageManager.getMessageModel()},
				items: {
					path: "message>/",
					template: new MessagePopoverItem({
						type: "{message>type}",
						title: "{message>message}",
						description: "{message>description}"
					})
				}
			});
		},
		onMessageButtonPress: function (oEvent) {
			var oMessagesButton = oEvent.getSource();
			// Either open the created popover if it isn't opened, or close it
			this._messagePopover.toggle(oMessagesButton);
		},
		onAddMessage: function (oEvent) {
			// Show footer if this is the first message
			if (!this.oModel.getProperty("/messagesLength")) {
				this.getPage().setShowFooter(true);
			}
			// Add a random message
			this._oMessageManager.addMessages(
				new Message(this.getRandomMessage())
			);
			// Update messages' length
			this.oModel.setProperty("/messagesLength", this._oMessageManager.getMessageModel().getData().length);
		},
		onDeleteMessages: function () {
			// Removing current messages
			this._oMessageManager.removeAllMessages();
			// Update messages' length
			this.oModel.setProperty("/messagesLength", this._oMessageManager.getMessageModel().getData().length);
			// Close both the popover and the footer, since there are no messages left
			if (this._messagePopover) {
				this._messagePopover.close();
			}
			this.getPage().setShowFooter(false);
		}
	});
});