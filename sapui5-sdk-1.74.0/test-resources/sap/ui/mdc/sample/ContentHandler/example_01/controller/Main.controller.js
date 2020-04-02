sap.ui.define([
	'sap/ui/core/mvc/Controller', 'sap/ui/mdc/link/ContentHandler', 'sap/ui/mdc/link/FlpLinkHandler', 'sap/ui/mdc/link/LinkItem', 'sap/ui/mdc/link/ContactDetails', 'sap/ui/mdc/link/ContactDetailsItem', 'sap/ui/mdc/link/ContactDetailsPhoneItem', 'sap/ui/mdc/link/ContactDetailsEmailItem', 'sap/ui/mdc/link/ContactDetailsAddressItem', 'sap/ui/mdc/link/SemanticObjectMapping', 'sap/ui/mdc/link/SemanticObjectMappingItem', 'sap/ui/mdc/link/SemanticObjectUnavailableAction', 'sap/base/Log', 'sap/ui/layout/library', 'sap/ui/layout/form/SimpleForm', 'sap/ui/core/Title'
], function(Controller, ContentHandler, FlpLinkHandler, LinkItem, ContactDetails, ContactDetailsItem, ContactDetailsPhoneItem, ContactDetailsEmailItem, ContactDetailsAddressItem, SemanticObjectMapping, SemanticObjectMappingItem, SemanticObjectUnavailableAction, Log, layoutLibrary, SimpleForm, CoreTitle) {
	"use strict";

	// shortcut for sap.ui.layout.form.SimpleFormLayout
	var SimpleFormLayout = layoutLibrary.form.SimpleFormLayout;

	return Controller.extend("sap.ui.mdc.sample.ContentHandler.example_01.controller.Main", {
		onInit: function() {
			this.getView().bindElement("/ProductCollection('38094020.2')");
		},
		modifyItemsCallback: function(oContextObject, oLinkHandler) {
			var oView = this.getView();
			// Note: this callback may be called several times during an execution round.
			return new Promise(function(resolve) {
				if (!oContextObject) {
					return resolve();
				}

				// 1. First we have to calculate semantic attributes for enhanced/given context, if required
				var oContextObjectNew = jQuery.extend(true, {
					CalculatedID: oContextObject["ProductId"] + "-" + oContextObject["Category"] + "-" + oContextObject["Name"]
				}, oContextObject);
				var oSemanticAttributes = oLinkHandler.calculateSemanticAttributes(oContextObjectNew);

				// 2. Second we have to read FLP links for the calculated semantic attributes
				return oLinkHandler.retrieveNavigationTargets("AppStateKey_12345", oSemanticAttributes).then(function(aLinks, oOwnNavigationLink) {

					// 3. Now we have to add FLP links to the 'items' aggregation.
					// In this example we replace the the main item coming from the FLP by a new one.
					aLinks.filter(function(oLink) {
						return !oLink.getIsMain();
					}).forEach(function(oLink) {
						oLinkHandler.addItem(oLink);
					});
					oLinkHandler.addItem(new LinkItem({
						key: oView.createId("IDIiyama"),
						isMain: true,
						text: "Prolite B2791QSU-B1",
						description: "iiyama",
						href: "https://iiyama.com/",
						icon: "/testsuite/test-resources/sap/ui/documentation/sdk/images/HT-1037.jpg"
					}));
					return resolve();
				}, function() {
					Log.error("sap.ui.mdc.sample.ContentHandler.example_01.Main: retrieveNavigationTargets() failed");
					return resolve();
				});
			});
		},
		modifyAdditionalContent: function(oContentHandler) {
			// Note: this callback may be called several times during an execution round.
			return new Promise(function(resolve) {
				if (sap.ui.getCore().byId("IDMySimpleForm") || oContentHandler.indexOfAdditionalContent(sap.ui.getCore().byId("IDMySimpleForm")) > -1) {
					return resolve();
				}
				var oSimpleForm = new SimpleForm("IDMySimpleForm", {
					layout: SimpleFormLayout.ResponsiveGridLayout,
					content: [
						new CoreTitle({
							text: "You never want to miss this additional account"
						})
					]
				});
				oSimpleForm.addStyleClass("mdcbaseinfoPanelDefaultAdditionalContent");
				oContentHandler.addAdditionalContent(oSimpleForm);
				return resolve();
			});
		},
		onExpand: function(oEvent) {
			var oPanel = oEvent.getSource();
			if (!oEvent.getParameter("expand")) {
				oPanel.destroyContent();
				this.oContentHandler.destroy();
				return;
			}

			this.oContentHandler = new ContentHandler({
				sourceControl: oPanel,
				modifyAdditionalContentCallback: this.modifyAdditionalContent.bind(this),
				linkHandler: new FlpLinkHandler({
					sourceControl: oPanel,
					textOfMainItem: "{Name}",
					descriptionOfMainItem: "{Category}",
					iconOfMainItem: "/testsuite/test-resources/sap/ui/documentation/sdk/images/HT-1031.jpg",
					semanticObjects: [
						"ProductCollection"
					],
					items: new LinkItem({
						key: this.getView().createId("IDInfoPanelItem04"),
						text: "Superior",
						description: "Transaction SHELL",
						href: "https://www.shell.de/",
						target: "_blank",
						icon: "sap-icon://mileage"
					}),
					modifyItemsCallback: this.modifyItemsCallback.bind(this)
				}),
				additionalContent: new ContactDetails({
					items: new ContactDetailsItem({
						photo: "/testsuite/test-resources/sap/ui/documentation/sdk/images/johnDoe.png",
						formattedName: "John Doe",
						title: "Developer",
						role: "Research & Development",
						org: "New Economy",
						phones: [
							new ContactDetailsPhoneItem({
								uri: "+0049 175 123456",
								types: [
									"cell", "preferred"
								]
							}), new ContactDetailsPhoneItem({
								uri: "+001 6101 34869-9",
								types: [
									"fax"
								]
							}), new ContactDetailsPhoneItem({
								uri: "+001 6101 34869-0",
								types: [
									"work"
								]
							})
						],
						emails: new ContactDetailsEmailItem({
							uri: "john.doe@neweconomy.com",
							types: [
								"preferred", "work"
							]
						}),
						addresses: new ContactDetailsAddressItem({
							street: "800 E 3rd St.",
							code: "90013",
							locality: "Los Angeles",
							region: "CA",
							country: "USA",
							types: "work"
						})
					})
				})
			});

			this.oContentHandler.setModel(this.getView().getModel());
			this.oContentHandler.setBindingContext(this.getView().getBindingContext());

			this.oContentHandler.getContent().then(function(oContent) {
				oPanel.addContent(oContent);
			});
		}
	});
});
