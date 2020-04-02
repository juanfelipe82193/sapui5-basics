/* eslint-disable */
var oContactsWithImagesData = {
	navigation: [
		{
			image: "demokit/images/people/img_contacts_01.png",
			name: "Megan Miller",
			title: "Sales Representative",
			phone: "+382832838238",
			email: "megan.miller@sap.com"
		},
		{
			image: "demokit/images/people/img_contacts_02.png",
			name: "Peter McNamara",
			title: "Sales Executive",
			phone: "1-800-1002030",
			email: "peter.mcnamara@sap.com"
		},
		{
			image: "demokit/images/people/img_contacts_03.png",
			name: "George W.Brunick",
			title: "Cash Manager",
			phone: "1(605)-1232-123-1",
			email: "george.brunick@sap.com"
		},
		{
			image: "demokit/images/people/img_contacts_04.png",
			name: "Lilian R.Owens",
			title: "Cash Manager",
			phone: "1(789)-1232-123-1",
			email: "lilian.owens@sap.com"
		}
	]
};

var oTemplateContactsWithImagesData = new sap.m.ColumnListItem({
	type: sap.m.Inactive,
	unread: false,
	cells: [
		new sap.m.Image({ src: "{image}", width: "74px", height: "74px" }),
		new sap.m.Link({ text: "{name}" }),
		new sap.m.Text({ text: "{title}" }),
		new sap.m.Link({ text: "{phone}" }),
		new sap.m.Link({ text: "{email}" })
	]
});

var oListContactsWithImagesForm = new sap.m.Table({
	threshold: 2,
	inset: false,
	showUnread: true,
	scrollToLoad: true,
	columns: [
		new sap.m.Column({
			hAlign: sap.ui.core.TextAlign.Begin,
			header: new sap.m.Text({ text: "" })
		}),
		new sap.m.Column({
			hAlign: sap.ui.core.TextAlign.Begin,
			header: new sap.m.Text({ text: "Name" })
		}),
		new sap.m.Column({
			hAlign: sap.ui.core.TextAlign.Begin,
			header: new sap.m.Text({ text: "Job Title" }),
			minScreenWidth: "Tablet",
			demandPopin: true
		}),
		new sap.m.Column({
			hAlign: sap.ui.core.TextAlign.Begin,
			width: "30%",
			header: new sap.m.Text({ text: "Phone" }),
			minScreenWidth: "Tablet",
			demandPopin: true
		}),
		new sap.m.Column({
			hAlign: sap.ui.core.TextAlign.Begin,
			width: "30%",
			header: new sap.m.Text({ text: "Email" }),
			minScreenWidth: "Tablet",
			demandPopin: true
		})
	],
	items: {
		path: "/navigation",
		template: oTemplateContactsWithImagesData
	}
});

var oModelContactsWithImages = new sap.ui.model.json.JSONModel();
oModelContactsWithImages.setData(oContactsWithImagesData);
oListContactsWithImagesForm.setModel(oModelContactsWithImages);

var oContactsWithImagesFormGroup = new sap.suite.ui.commons.UnifiedThingGroup("contacts", {
	title: "Contacts",
	description: "4711, Marketing",
	content: oListContactsWithImagesForm,
	design: sap.suite.ui.commons.ThingGroupDesign.TopIndent
});

var image1 = new sap.m.Image({
	src: "demokit/images/people/img_contacts_01.png",
	width: "48px",
	height: "48px"
});
image1.addStyleClass("sapUtiContactsImage");
var image2 = new sap.m.Image({
	src: "demokit/images/people/img_contacts_02.png",
	width: "48px",
	height: "48px"
});
image2.addStyleClass("sapUtiContactsImage");
var image3 = new sap.m.Image({
	src: "demokit/images/people/img_contacts_03.png",
	width: "48px",
	height: "48px"
});
image3.addStyleClass("sapUtiContactsImage");
var image4 = new sap.m.Image({
	src: "demokit/images/people/img_contacts_04.png",
	width: "48px",
	height: "48px"
});
image4.addStyleClass("sapUtiContactsImage");

var oContactsContent = new sap.ui.layout.Grid("form-contacts", {
	defaultSpan: "L6 M6 S6",
	content: [
		new sap.m.HBox({
			items: [
				image1,
				new sap.m.VBox({
					items: [
						new sap.m.Text({ text: "Megan Miller" }).addStyleClass("sapUtiTextName"),
						new sap.m.Text({ text: "Sales Representative" }).addStyleClass("sapUtiTextValue")
					]
				})
			]
		}).addStyleClass("sapUtiContactsBox"),
		new sap.m.HBox({
			items: [
				image2,
				new sap.m.VBox({
					items: [
						new sap.m.Text({ text: "Peter McNamara" }).addStyleClass("sapUtiTextName"),
						new sap.m.Text({ text: "Sales Executive" }).addStyleClass("sapUtiTextValue")
					]
				})
			]
		}).addStyleClass("sapUtiContactsBox"),
		new sap.m.HBox({
			items: [
				image3,
				new sap.m.VBox({
					items: [
						new sap.m.Text({ text: "George W.Brunick" }).addStyleClass("sapUtiTextName"),
						new sap.m.Text({ text: "Cash Manager" }).addStyleClass("sapUtiTextValue")
					]
				})
			]
		}).addStyleClass("sapUtiContactsBox"),
		new sap.m.HBox({
			items: [
				image4,
				new sap.m.VBox({
					items: [
						new sap.m.Text({ text: "Lilian R.Owens" }).addStyleClass("sapUtiTextName"),
						new sap.m.Text({ text: "Cash Manager" }).addStyleClass("sapUtiTextValue")
					]
				})
			]
		}).addStyleClass("sapUtiContactsBox")
	]
}).addStyleClass("sapUtiContactsGrid");

if (isPhone) {
	oContactsContent.setDefaultSpan("L12 M12 S12");
}

var oContactsFacet = new sap.suite.ui.commons.FacetOverview("contacts-facet", {
	title: "Contacts",
	quantity: 6,
	content: oContactsContent,
	heightType: isPhone ? "Auto" : "L",
	press: function() {
		setFacetContent("contactsImages");
	}
});
