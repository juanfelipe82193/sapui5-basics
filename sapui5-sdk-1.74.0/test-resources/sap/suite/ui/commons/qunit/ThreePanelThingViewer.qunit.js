/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/CountingNavigationItem",
	"sap/ui/commons/Link",
	"sap/ui/ux3/ThingGroup",
	"sap/ui/commons/layout/MatrixLayout",
	"sap/ui/commons/layout/MatrixLayoutRow",
	"sap/ui/commons/layout/MatrixLayoutCell",
	"sap/ui/commons/library",
	"sap/ui/commons/Label",
	"sap/ui/commons/TextView",
	"sap/ui/commons/RowRepeater",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/commons/ThreePanelThingViewer",
	"sap/ui/thirdparty/jquery"
], function(
	QUnitUtils,
	createAndAppendDiv,
	CountingNavigationItem,
	Link,
	ThingGroup,
	MatrixLayout,
	MatrixLayoutRow,
	MatrixLayoutCell,
	commonsLibrary,
	Label,
	TextView,
	RowRepeater,
	JSONModel,
	ThreePanelThingViewer,
	jQuery
) {
	"use strict";

	// shortcut for sap.ui.commons.layout.VAlign
	var VAlign = commonsLibrary.layout.VAlign;

	// shortcut for sap.ui.commons.layout.HAlign
	var HAlign = commonsLibrary.layout.HAlign;

	createAndAppendDiv("uiArea1");


	var oNavBarData = [
		{
			key: "overview",
			text: "Overview",
			tooltip: "Custom tooltip for Overview"
		}, {
			key: "contacts",
			text: "Contacts Lorem Ipsum Dolores",
			quantity: 3
		}, {
			key: "items",
			text: "Items",
			quantity: 3,
			tooltip: "Custom tooltip for Items"
		}, {
			key: "related_documents",
			text: "Related Documents",
			quantity: 0
		}, {
			key: "addresses",
			text: "Addresses",
			quantity: 0
		}, {
			key: "activities",
			text: "Activities",
			quantity: 0
		}, {
			key: "analytics",
			text: "Analytics",
			quantity: 0
		}
	];

	var oNavBarItemTemplate = new CountingNavigationItem({
		key: "{key}",
		text: "{text}",
		quantity: "{quantity}",
		tooltip: "{tooltip}"
	});
	/*********************************************/
	var oMenuData = [
		{
			text: "1st Transaction Lorem Ipsum Dolor Sit Amet Lorem Ipsum",
			href: "http://www.sap.com"
		}, {
			text: "2nd Transaction Dolor Sit Amet Tempor",
			href: "http://www.sap.com"
		}, {
			text: "3rd Transaction Takimata Nonumy Duo Elitr",
			href: "#"
		}, {
			text: "4th Transaction Sanctus Invidunt Nonumy",
			href: "#"
		}, {
			text: "5th Transaction Labore Magna Accusam At",
			href: "#"
		}, {
			text: "6th Transaction Vero Conseteur Duo Justo",
			href: "#"
		}, {
			text: "7th Transaction Nagsy Nonumy Duo Elitr",
			href: "#"
		}
	];

	var oMenuTemplate = new Link({
		text: "{text}",
		href: "{href}"
	});
	/***********************************************/
	var oHeaderData = [
		{
			title: "General Information",
			content: [
				{
					label: "Delivery Status",
					text: "Ordered"
				}, {
					label: "Invoice Status",
					text: "Partially Invoiced"
				}, {
					label: "Total Value",
					text: "91.680,00 USD"
				}, {
					label: "Sales",
					text: "Global Sales"
				}, {
					label: "Organization",
					text: "Consumer Industries"
				}
			]
		}, {
			title: "Sub-Header",
			content: [
				{
					label: "Customer",
					text: "Bortelli Corp"
				}, {
					label: "Recipient",
					text: "John Bradford"
				}, {
					label: "Ordered On",
					text: "Nov. 11, 2012"
				}, {
					label: "Last Changed On",
					text: "Jan. 1, 2013"
				}, {
					label: "Created By",
					text: "Steven Tyler"
				}
			]
		}, {
			title: "Lorem Ipsum",
			content: [
				{
					label: "Lorem",
					text: "Rebum"
				}, {
					label: "Ipsum",
					text: "Tempor"
				}, {
					label: "At Vero",
					text: "Invidunt"
				}, {
					label: "Voluptua",
					text: "Nonumy"
				}
			]
		}
	];

	var oHeaderTemplate = new ThingGroup({
		title: "{title}",
		content: new MatrixLayout({
			rows: {
				path: "content",
				template: new MatrixLayoutRow({
					cells: [
						new MatrixLayoutCell({
							hAlign: HAlign.End,
							vAlign: VAlign.Top,
							content: new Label({
								text: {
									path: "label",
									formatter: function(fValue) {
										return fValue + ":";
									}
								}
							})
						}),
						new MatrixLayoutCell({
							hAlign: HAlign.Begin,
							vAlign: VAlign.Top,
							content: new TextView({
								text: "{text}"
							})
						})
					]
				}),
				templateShareable: true
			}
		})
	});
	/********************************************/
	var oContactsData = [
		{
			title: "Contacts",
			colspan: true,
			type: 2,
			content: [
				{
					name: "Jag, Mick",
					phone: "+1 (692) 742-2633"
				}, {
					name: "Bradford, John",
					phone: "+1 (635) 457-2875"
				}, {
					name: "Stiff, Clark",
					phone: "+1 (703) 515-8363"
				}
			]
		}
	];

	var oItemsData = [
		{
			title: "Items",
			colspan: true,
			type: 1,
			content: [
				{
					number: 1,
					unit: "20 ea",
					name: "LED & Smd BA9S",
					price: "$ 19.95"
				}, {
					number: 2,
					unit: "35 ea",
					name: "LED & Smd Tfl Canbus",
					price: "$ 29.91"
				}, {
					number: 3,
					unit: "40 ea",
					name: "LED Angel Eyes",
					price: "$ 21.90"
				}
			]
		}
	];

	var oRelDocsData = [
		{
			title: "Related Documents",
			colspan: true
		}
	];

	var oOverviewData = oContactsData.concat(oItemsData, oRelDocsData);

	var oFacetContentTemplate = new ThingGroup({
		title: "{title}",
		colspan: "{colspan}",
		content: new RowRepeater({
			rows: {
				path: "content",
				factory: function(sId, oContext) {
					var iNumber = oContext.getProperty("number");

					if (iNumber) {
						return new MatrixLayout({
							rows: new MatrixLayoutRow({
								cells: [
									new MatrixLayoutCell({
										content: new Label({ text: "{number}" })
									}),
									new MatrixLayoutCell({
										content: new Label({ text: "{unit}" })
									}),
									new MatrixLayoutCell({
										content: new Label({ text: "{name}" })
									}),
									new MatrixLayoutCell({
										content: new Label({ text: "{price}" })
									})
								]
							})
						});
					} else {
						return new MatrixLayout({
							rows: [
								new MatrixLayoutRow({
									cells: new MatrixLayoutCell({
										content: new Label({ text: "{name}" })
									})
								}),
								new MatrixLayoutRow({
									cells: new MatrixLayoutCell({
										content: new Label({ text: "{phone}" })
									})
								})
							]
						});
					}
				}
			}
		})
	});
	/******************************************************/
	var oData = {
		type: "Sales Order",
		title: "440000126411117000112345004318",
		subtitle: "Sales Title Nestle Lorem Ipsum Dolor Sit Amet",
		icon: "../images/gen_bo_img.png",
		logo: "../images/img_key_company.png",
		showHeader: true,
		sidebarWidth: "224px",
		facets: oNavBarData,
		menuContent: oMenuData,
		headerContent: oHeaderData,
		facetContent: oOverviewData
	};

	var oModel = new JSONModel();
	oModel.setData(oData);

	var oThingViewer = new ThreePanelThingViewer({
		id: "thingview1",
		type: "{/type}",
		title: "{/title}",
		subtitle: "{/subtitle}",
		icon: "{/icon}",
		logo: "{/logo}",
		showHeader: "{/showHeader}",
		sidebarWidth: "{/sidebarWidth}",
		facets: {
			path: "/facets",
			template: oNavBarItemTemplate,
			templateShareable: true
		},
		menuContent: {
			path: "/menuContent",
			template: oMenuTemplate,
			templateShareable: true
		},
		headerContent: {
			path: "/headerContent",
			template: oHeaderTemplate,
			templateShareable: true
		},
		facetContent: {
			path: "/facetContent",
			template: oFacetContentTemplate,
			templateShareable: true
		},
		facetSelected: function(oEvent) {
			var sFacetKey = oEvent.getParameters().key;
			// setContent(sFacetKey); // TODO this method didn't exist in the HTML version of the test, can the call be removed?
			this.setShowHeader(sFacetKey == "overview");
		}
	});

	oThingViewer.setModel(oModel);
	oThingViewer.setSelectedFacet(oThingViewer.getFacets()[0]);
	// oThingViewer.setShowHeader(true);
	oThingViewer.placeAt("uiArea1");



	QUnit.module("Appearance");

	QUnit.test("ThreePanelThingViewer exists", function(assert) {
		// oOverlay.open();
		var oDomRef = oThingViewer.getDomRef();
		assert.ok(oDomRef, "Rendered ThreePanelThingViewer should exist in the page");
		assert.equal(oDomRef.className, "sapUiUx3TV", "Rendered ThreePanelThingViewer should have the class 'sapUiUx3TV'");
	});

	QUnit.test("Title Icon is rendered", function(assert) {
		var oSwatch = oThingViewer.getDomRef("swatch");
		assert.ok(oSwatch, "Title Icon should exist in the page");
		assert.equal(oSwatch.className, "sapSuiteTvTitleIcon", "Rendered title icon should have the class 'sapSuiteTvTitleIcon'");
	});

	QUnit.test("Title bar is rendered", function(assert) {
		var oTitle = oThingViewer.getDomRef("header");
		assert.ok(oTitle, "Title should exist in the page");
		assert.equal(oTitle.className, "sapSuiteTvTitle", "Rendered title should have the class 'sapSuiteTvTitle'");
	});

	QUnit.test("Menu button exists", function(assert) {
		var menuButton = oThingViewer.getDomRef("menu-button");
		assert.notDeepEqual(menuButton, [], "menu button found: " + menuButton);
	});

	QUnit.test("Vertical navigation exists", function(assert) {
		var oNavBar = oThingViewer.getDomRef("navigation");
		assert.ok(oNavBar, "Vertical navigation should exist in the page");
		assert.equal(oNavBar.className, "sapSuiteTvNav", "Rendered vertical navigation bar should have the class 'sapSuiteTvNav'");
	});

	QUnit.test("Items", function(assert) {
		//number of navigation items must be the same as number of facets
		var facets = oThingViewer.getFacets();
		for (var i = 0; i < facets.length; i++) {
			assert.ok(facets[i].getDomRef(), "Rendered ThingViewer Item " + facets[i].sId + " should exist in the page");
		}
	});

	QUnit.test("Header exists", function(assert) {
		var oHeader = oThingViewer.getDomRef("headerContent");
		assert.ok(oHeader, "Header should exist in the page");
		assert.equal(oHeader.className, "sapSuiteTvHeader", "Rendered header should have the class 'sapSuiteTvHeader'");
	});

	QUnit.test("Facet content exists", function(assert) {
		var oFacetContent = oThingViewer.getDomRef("facetContent");
		assert.ok(oFacetContent, "Facet content should exist in the page");
		assert.equal(oFacetContent.className, "sapSuiteTvFacet", "Rendered facet content should have the class 'sapSuiteTvFacet'");
	});

	QUnit.module("Behaviour");

	QUnit.test("Show header content", function(assert) {
		var done = assert.async();
		var oHeader = oThingViewer.getDomRef("headerContent");
		oThingViewer.setShowHeader(false);
		setTimeout(function() {
			assert.equal(oHeader.style.display, "none", "Header not rendered");
			done();
		}, 100);
	});

	QUnit.test("Hide header content", function(assert) {
		var done = assert.async();
		var oHeader = oThingViewer.getDomRef("headerContent");
		oThingViewer.setShowHeader(true);
		setTimeout(function() {
			assert.notEqual(oHeader.style.display, "none", "Header is rendered");
			done();
		}, 100);
	});

	QUnit.test("Show menu popup", function(assert) {
		var done = assert.async();
		var oMenuPopup = oThingViewer.getDomRef("menu-popup");
		var oMenuButton = oThingViewer.getDomRef("menu-button");
		assert.expect(1);
		qutils.triggerMouseEvent(oMenuButton, "click", 1, 1, 1, 1);
		setTimeout(function() {
			assert.equal(oMenuPopup.style.display, "block", "Menu popup opened");
			done();
		}, 100);
	});

	QUnit.test("menu down", function(assert) {
		var $oMenuPopup = oThingViewer.$("menu-popup");
		var ev;

		//has 7 items
		oThingViewer._iSelectedMenuItem = 5;

		ev = jQuery.Event("keydown", { keyCode: 40 /*ARROW DOWN*/ });
		$oMenuPopup.trigger(ev);
		assert.equal(oThingViewer._iSelectedMenuItem, 6, "Next menu item selected.");

		ev = jQuery.Event("keydown", { keyCode: 39 /*ARROW RIGHT*/ });
		$oMenuPopup.trigger(ev);
		assert.equal(oThingViewer._iSelectedMenuItem, 0, "Jump to the first after the last.");

	});

	QUnit.test("menu up", function(assert) {
		var $oMenuPopup = oThingViewer.$("menu-popup");
		var ev;

		//has 7 items
		oThingViewer._iSelectedMenuItem = 1;

		ev = jQuery.Event("keydown", { keyCode: 37 /*ARROW LEFT*/ });
		$oMenuPopup.trigger(ev);
		assert.equal(oThingViewer._iSelectedMenuItem, 0, "Previous menu item selected.");

		ev = jQuery.Event("keydown", { keyCode: 38 /*ARROW UP*/ });
		$oMenuPopup.trigger(ev);
		assert.equal(oThingViewer._iSelectedMenuItem, 6, "Jump to the last after the first.");

	});

	QUnit.test("Hide menu popup", function(assert) {
		var done = assert.async();
		var oMenuPopup = oThingViewer.getDomRef("menu-popup");
		var $oMenuPopup = jQuery(oMenuPopup);
		var ev;
		ev = jQuery.Event("keydown", { keyCode: 27 /*ESCAPE*/ });
		$oMenuPopup.trigger(ev);

		setTimeout(function() {
			assert.equal(oMenuPopup.style.display, "none", "Menu popup closed");
			done();
		}, 100);
	});
});