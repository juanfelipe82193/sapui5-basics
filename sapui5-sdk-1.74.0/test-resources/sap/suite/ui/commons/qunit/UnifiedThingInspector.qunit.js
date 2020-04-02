/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/m/MessageToast",
	"sap/ui/core/format/DateFormat",
	"sap/suite/ui/commons/UnifiedThingGroup",
	"sap/m/List",
	"sap/m/Column",
	"sap/m/Text",
	"sap/m/ColumnListItem",
	"sap/m/library",
	"sap/m/Page",
	"sap/m/ObjectHeader",
	"sap/m/ObjectAttribute",
	"sap/ui/commons/form/SimpleForm",
	"sap/ui/commons/Title",
	"sap/m/Link",
	"sap/m/HBox",
	"sap/m/ObjectStatus",
	"sap/m/FlexItemData",
	"sap/m/Image",
	"sap/ui/layout/Grid",
	"sap/m/VBox",
	"sap/m/Label",
	"sap/ui/layout/GridData",
	"sap/m/StandardListItem",
	"sap/suite/ui/commons/FacetOverview",
	"sap/ui/commons/form/Form",
	"sap/ui/commons/form/ResponsiveLayout",
	"sap/ui/commons/form/FormContainer",
	"sap/ui/commons/form/FormElement",
	"sap/suite/ui/commons/UnifiedThingInspector",
	"sap/suite/ui/commons/KpiTile",
	"sap/m/Button",
	"sap/ui/thirdparty/jquery",
	"sap/ui/util/Mobile",
	"sap/ui/Device",
	"sap/ui/events/KeyCodes"
], function(
	QUnitUtils,
	createAndAppendDiv,
	MessageToast,
	DateFormat,
	UnifiedThingGroup,
	List,
	Column,
	Text,
	ColumnListItem,
	mobileLibrary,
	Page,
	ObjectHeader,
	ObjectAttribute,
	SimpleForm,
	Title,
	Link,
	HBox,
	ObjectStatus,
	FlexItemData,
	Image,
	Grid,
	VBox,
	Label,
	GridData,
	StandardListItem,
	FacetOverview,
	Form,
	ResponsiveLayout,
	FormContainer,
	FormElement,
	UnifiedThingInspector,
	KpiTile,
	Button,
	jQuery,
	Mobile,
	Device,
	KeyCodes
) {
	"use strict";

	// shortcut for sap.m.ListType
	var ListType = mobileLibrary.ListType;

	document.body.insertBefore(createAndAppendDiv("content"), document.body.firstChild).setAttribute("style", "width: 100%; height: 50%;");

    Mobile.init();

	var oUTI;
	var oFacetData;

	function prepareUTI(sId, iKpis) {
		var oListOrdersFormGroup = new UnifiedThingGroup({
			title : "Internal Orders",
			description : "4711, Marketing",
			content : new List({
			inset : false,
			showUnread : true,
			columns : [	new Column({
				hAlign : "Left",
				header : new Text({text : "Order Number"})
			})],
			items: [
				new ColumnListItem({
					type : ListType.Navigation,
					press : function(oEvent) {
						oUTI.navigateToPage(
							new Page(sId + "-order-detail-page", {
								title : "Order Detail",
								showNavButton : true,
								content : [
									new ObjectHeader({
										title : oEvent.getSource().getCells()[1].getText(),
										number : oEvent.getSource().getCells()[0].getText(),
										attributes : [
											new ObjectAttribute({text : oEvent.getSource().getCells()[2].getText() }),
											new ObjectAttribute({text : oEvent.getSource().getCells()[3].getText() })
										]
									}),
									new SimpleForm({
										minWidth : 1024,
										maxContainerCols : 2,
										content : [	new Title({ text: "Company Address" }) ]
									})
								]
							}), true);
						},
					unread : false,
					cells : [
						new Link({id: sId + "-order-detail-link" , text : "23000"}),
						new Text({text : "CeBit Demo"}),
						new Text({text : "040 Event"}),
						new Text({text : "Planned"})
					]
				})]
			})
		});

	  var oSalesQuotationFormGroup = new UnifiedThingGroup({
		title : "Sales Quotation",
		description : "27, Standard Order",
		content : new HBox({
			items: [
				new ObjectHeader({
					title: "40000019",
					titleActive: true,
					number: "70,000.00",
					numberUnit: "EUR",
					attributes: [ new ObjectAttribute({ text: "Quantity Contract" }) ],
					firstStatus: new ObjectStatus({ text: "Being processed"}),
					secondStatus: new ObjectStatus({ text: "01/01/2013 - 05/31/2014"}),
					layoutData: new FlexItemData({ growFactor: 1 })
				}).addStyleClass("sapSuiteUtiWhiteBackground")
			]
		})
	});

	var oContactsWithImagesFormGroup = new UnifiedThingGroup({
		title : "Contacts",
		description: "4711, Marketing",
		content: new List({
			inset : false,
			showUnread : true,
			columns : [
				new Column({
					hAlign: "Left",
					header: new Text({text: ""})
				}),
				new Column({
					hAlign : "Left",
					header : new Text({text : "Name"})
				}),
				new Column({
					hAlign : "Left",
					header : new Text({text : "Job Title"}),
					minScreenWidth : "Tablet",
					demandPopin : true
				})
			],
			items: [
				new ColumnListItem({
					type: mobileLibrary.Inactive,
					unread: false,
					cells: [
						new Image({src: "../demokit/images/people/female_BaySu.jpg", width: "74px", height: "74px"}),
						new Link({text: "White, Helen"}),
						new Text({text: "Internal Sales Rep"})
					]
				})
			]
		})
	});

	var oLocale = sap.ui.getCore().getConfiguration().getLocale();
	var oDateFormat = DateFormat.getDateTimeInstance({style: "short"}, oLocale);

	oDateFormat = DateFormat.getDateTimeInstance({style: "short"}, oLocale);
	oDateFormat.format(new Date());

	var oAttachmentContentFacet = new Grid(sId + "-attachment-grid");
	var genHBox = new VBox({
		items: [
			new Label({text: "fioriBon.pdf"}),
			new Text({text:oDateFormat.format(new Date())})
		],
		layoutData: new GridData({ span: "L4 M4 S6" })
	});
	oAttachmentContentFacet.addContent(genHBox);

	var oAttachmentsContent = new UnifiedThingGroup({
		title : "Attchments",
		description : "4711, Marketing",
		content: new List({
			items : [
					new StandardListItem({
						title : "fioriBon.pdf, 40KB",
						iconInset : false,
						icon : "sap-icon://pdf-attachment",
						info : oDateFormat.format(new Date()),
						type : ListType.Active
					})
				]
			})
	});

	var oAttachmentsFacet = new FacetOverview(sId + "-facet-attachments-types", {
		title: "Attachments",
		quantity: 5,
		height: "5rem",
		content : oAttachmentContentFacet,
		press: function() {
			setFacetContent("attachments");
		}
	});

	oFacetData = {
		overview: new UnifiedThingGroup({
			title : "General",
			description : "4711, Marketing",
			content : new VBox({
				items: [new Label({ text: "Locked for" })]
			})
		}),
		contacts: new UnifiedThingGroup({
			title : "Contacts",
			description : "4711, Marketing",
			content : new List({
				headerText : "Contacts"
			})
		}),
		orders: oListOrdersFormGroup,
		quotation: oSalesQuotationFormGroup,
		contactsImages: oContactsWithImagesFormGroup,
		attachments : oAttachmentsContent
	};

	function setFacetContent(sKey) {
			oUTI.navigateToDetailWithContent(oFacetData[sKey]);
	}


	var image1 = new Image({
		src: "../demokit/images/people/female_BaySu.jpg",
		width: "64px",
		height: "64px"
	});
	image1.addStyleClass("sapUtiImagePaddingRight");
	image1.addStyleClass("sapUtiImagePaddingLeft");

	var oContactsContent = new HBox(sId + "-hbox");
	oContactsContent.addItem(image1);

	var oContactsFacet = new FacetOverview(sId + "-contacts-facet", {
		title: "Contacts",
		quantity: 6,
		content: oContactsContent,
		height: "11rem",
		press: function() {
			setFacetContent("contactsImages");
		}
	});

	var oGeneralFacet =	new FacetOverview(sId + "-facet-general", {
		title: "General",
		content: new Grid(sId + "-overview-grid", {
			content: [
				new VBox({
					items:[
						new Label({text:"Sold-To Party:"}),
						new Text({text:"1 - Being processed"})
					],
					layoutData: new GridData({ span: "L4 M4 S6" })
				})
			]
		}),
		quantity: 14,
		height: "21rem",
		press: function() {
			setFacetContent("overview");
		}
	});

	var oOrdersContent = new Form(sId + "-form-orders", {
		layout: new ResponsiveLayout()
	});

	var oOrdersElement = new FormContainer(sId + "-FOrdC1", {
		formElements: [
			new FormElement({
				label: new Label({text: "CeBit Demo"}),
				fields: [ new Text({text: "040 Event"}) ]
			})
		]
	});
	oOrdersContent.addFormContainer(oOrdersElement);

	var oOrdersFacet = new FacetOverview(sId + "-facet-orders", {
		title: "Internal Orders",
		quantity: 3,
		content: oOrdersContent,
		height: "4rem",
		press: function() {
			setFacetContent("orders");
		}
	});

	var oDocumentsContent = new Form(sId + "-form-docs", {
		layout: new ResponsiveLayout()
	});

	var oDocumentElement = new FormContainer(sId + "-FDocC1", {
		formElements: [
			new FormElement({
				label: new Label({text: "4711000"}),
				fields: [ new Text({text: "240 USD"}) ]
			})
		]
	});
	oDocumentsContent.addFormContainer(oDocumentElement);

	if (!Device.system.phone) {
		oDocumentElement = new FormContainer(sId + "-FDocC2", {
			formElements: [
				new FormElement({
					label: new Label({text: "4711002"}),
					fields: [ new Text({text: "320 USD"}) ]
				})
			]
		});
		oDocumentsContent.addFormContainer(oDocumentElement);
	}

	var oDocumentsFacet = new FacetOverview(sId + "-facet-documents", {
		title: "Controlling Documents",
		quantity: 99,
		content: oDocumentsContent,
		height: "10rem",
		press: function() {
			setFacetContent("contacts");
		}
	});

	var oActivityTypesContent = new Form(sId + "-form-activity-types", {
		layout: new ResponsiveLayout()
	});

	var oActivityTypesElement = new FormContainer(sId + "-form-activity-types-content-1", {
		formElements: [
			new FormElement({
				label: new Label({text: "Type"}),
				fields: [ new Text({text: "588"}) ]
			})
		]
	});
	oActivityTypesContent.addFormContainer(oActivityTypesElement);

	if (!Device.system.phone) {
		oActivityTypesElement = new FormContainer(sId + "-form-activity-types-content-2", {
			formElements: [
				new FormElement({
					label: new Label({text: "Type"}),
					fields: [ new Text({text: "644"}) ]
				})
			]
		});
		oActivityTypesContent.addFormContainer(oActivityTypesElement);
	}

	var oActivityTypesFacet = new FacetOverview(sId + "-facet-activity-types", {
		title: "Activity Types",
		quantity: 8,
		content: oActivityTypesContent,
		height: "10rem",
		press: function() {
			setFacetContent("quotation");
		}
	});

		oUTI = new UnifiedThingInspector({
			id: sId,
			title: "Cost Center",
			name: "4711",
			description: "Marketing",
			actionsVisible : true,
			transactionsVisible : true,
			kpis: [
				new KpiTile({
					value: "280",
					description: "Square Meters, 4771",
					doubleFontSize: false,
					valueScale: "m",
					valueUnit: "%"
				})
			],
			facets: [
				oGeneralFacet,
				oOrdersFacet,
				oDocumentsFacet,
				oActivityTypesFacet,
				oContactsFacet,
				oAttachmentsFacet
			],
			backAction: function() {
				MessageToast.show("Back action pressed.");
			},
			icon: "../images/strawberries_frozen.jpg",
			transactions : [
				new Link({
					text : "Link 1",
					href : "http://www.sap.com"
				})
			],
			actions : [new Button({ text : "Button 1"	})]
		});

		if (iKpis > 1) {
			oUTI.addKpi(new KpiTile({
				value: "28",
				description: "Employees, 8000",
				doubleFontSize: true
			}));
		}

		if (iKpis == 3) {
			oUTI.addKpi(new KpiTile({
				value: "1200h",
				description: "Production Hours, 0815",
				doubleFontSize: true
			}));
		}

		oUTI.placeAt("content","only");
	}

	QUnit.module("Render Tests - sap.suite.ui.commons.UnifiedhingInspector", {
		beforeEach: function() {
			prepareUTI("unified1", 2);
		},

		afterEach: function() {
			oUTI.destroy();
		}
	});

	QUnit.test("Controls rendering tests", function(assert) {
		var done = assert.async();
		setTimeout(function() {

			assert.ok(window.document.getElementById("unified1"), "control was rendered");
			assert.ok(window.document.getElementById("unified1-nav-container"), "navigation area was rendered");
			assert.ok(window.document.getElementById("unified1-kpi-scroll-container"), "kpi scroll container was rendered");
			assert.ok(window.document.getElementById("unified1-facets-grid"), "facets area was rendered");
			assert.ok(window.document.getElementById("unified1-header"), "header area was rendered");
			assert.ok(window.document.getElementById("unified1-master-page"), "master page was rendered");
			assert.ok(window.document.getElementById("unified1-master-footer"), "master footer was rendered");
			assert.ok(window.document.getElementById("unified1-master-settings-button"), "master settings button was rendered");
			assert.ok(window.document.getElementById("unified1-master-action-button"), "master action button was rendered");

			assert.ok(!window.document.getElementById("unified1-detail-page"), "detail page should not be rendered initially");
			assert.ok(!window.document.getElementById("unified1-detail-footer"), "detail footer should not be rendered initially");
			assert.ok(!window.document.getElementById("unified1-detail-settings-button"), "detail settings button should not be rendered initially");
			assert.ok(!window.document.getElementById("unified1-detail-action-button"), "detail actions button should not be rendered initially");

			if (Device.system.desktop) {
				assert.ok(window.document.getElementById("unified1-master-transaction-button"), "master transaction button was rendered");
				assert.ok(!window.document.getElementById("unified1-detail-transaction-button"), "detail transaction button should not be rendered initially");
			} else {
				assert.ok(!window.document.getElementById("unified1-master-transaction-button"), "master transaction button should not be rendered on mobile devices");
				assert.ok(!window.document.getElementById("unified1-detail-transaction-button"), "detail transaction button should not be rendered on mobile devices");
			}
			assert.ok(window.document.getElementById("unified1-header-icon-image"), "icon button was rendered");
			window.document.getElementById("unified1-facet-orders").click();
			setTimeout(function() {
				assert.ok(window.document.getElementById("unified1"), "control is still rendered after click");
				assert.ok(window.document.getElementById("unified1-nav-container"), "navigation area is still rendered after click");
				assert.ok(window.document.getElementById("unified1-kpi-scroll-container"), "kpi scroll container is still rendered after click");
				assert.ok(window.document.getElementById("unified1-facets-grid"), "facets area is still rendered after click");
				assert.ok(window.document.getElementById("unified1-header"), "header area is still rendered after click");
				assert.ok(window.document.getElementById("unified1-master-page"), "master page is still rendered after click");
				assert.ok(window.document.getElementById("unified1-master-footer"), "master footer is still rendered after click");
				assert.ok(window.document.getElementById("unified1-master-settings-button"), "master settings button is still rendered after click");
				assert.ok(window.document.getElementById("unified1-master-action-button"), "master action button is still rendered after click");

				assert.ok(window.document.getElementById("unified1-detail-page"), "detail page is rendered after click");
				assert.ok(window.document.getElementById("unified1-detail-footer"), "detail footer is rendered after click");
				assert.ok(window.document.getElementById("unified1-detail-settings-button"), "detail settings button is rendered after click");
				assert.ok(window.document.getElementById("unified1-detail-action-button"), "detail actions button is rendered after click");

				if (Device.system.desktop) {
					assert.ok(window.document.getElementById("unified1-master-transaction-button"), "master transaction button is still rendered after click");
					assert.ok(window.document.getElementById("unified1-detail-transaction-button"), "detail transaction button is rendered after click");
				} else {
					assert.ok(!window.document.getElementById("unified1-master-transaction-button"), "master transaction button should not be rendered on mobile devices");
					assert.ok(!window.document.getElementById("unified1-detail-transaction-button"), "detail transaction button should not be rendered on mobile devices");
				}
				done();
			}, 1000);
		}, 1000);
	});

	QUnit.module("Behavior Tests - sap.suite.ui.commons.UnifiedhingInspector");

	QUnit.test("Navigation tests", function(assert) {
		var done = assert.async();
		prepareUTI("unified2", 1);
		setTimeout(function() {
			assert.equal(oUTI._oNavContainer.getPages().length, 2, "Initially NavContainer should have 2 pages");
			window.document.getElementById("unified2-facet-orders").click();    // navigate to details page
			setTimeout(function() {
				jQuery(document.getElementById("unified2-order-detail-link")).tap();        // navigate to Order Detail page
				setTimeout(function() {
					jQuery(document.getElementById("unified2-order-detail-page-navButton")).tap();  // navigate back to details page
					setTimeout(function() {
						assert.equal(oUTI._oNavContainer.getPages().length, 2, "Here NavContainer should have 2 pages");
						oUTI._navigateToMaster();
						setTimeout(function() {
							assert.equal(oUTI._oNavContainer.getCurrentPage().sId, "unified2-master-page", "Current page should be master-page");
							jQuery(document.getElementById("unified2-master-page-navButton")).tap();   // navigate back from master page should not change the page
							setTimeout(function() {
								assert.equal(oUTI._oNavContainer.getCurrentPage().sId, "unified2-master-page", "Current page should be master-page");
								oUTI.navigateToDetailWithContent(oFacetData["attachments"]);
								setTimeout(function() {
									assert.equal(oUTI._oNavContainer.getCurrentPage().sId, "unified2-detail-page", "Current page should be detail-page");
									var oPage = new Page("new-order-detail-page", {
										title : "Order Detail",
										showNavButton : true,
										content : [
											new ObjectHeader({
												title : "Test title",
												number : "new_page",
												flagged : true,
												showFlag : true,
												attributes : [
													new ObjectAttribute({text : "Order Type"}),
													new ObjectAttribute({text : "Status"})
												]
											})
										]
									});
									oUTI.navigateToPage(oPage, true);
									setTimeout(function() {
										assert.equal(oUTI._oNavContainer.getCurrentPage().sId, "new-order-detail-page", "Current page should be new-order-detail-page");
										oUTI.navigateToDetail();
										setTimeout(function() {
											assert.equal(oUTI._oNavContainer.getCurrentPage().sId, "unified2-detail-page", "Current page should be unified2-detail-page");
											done();
										}, 1000);
									}, 1000);
								}, 1000);
							}, 1000);
						}, 1000);
					}, 1000);
				}, 1000);
			}, 1000);
		}, 1000);
	});

	QUnit.test("Keyboard navigation tests", function(assert) {
		var done = assert.async();
		prepareUTI("unified21", 0);
		setTimeout(function() {
			jQuery("#unified21-facet-general").focus();
			assert.equal(jQuery(':focus').attr('id'), "unified21-facet-general", "Focused element is General facet");
			qutils.triggerKeyboardEvent(jQuery(':focus'), KeyCodes.ARROW_DOWN);
			setTimeout(function() {
				assert.equal(jQuery(':focus').attr('id'), "unified21-contacts-facet", "Focused element is Contacts facet");
				qutils.triggerKeyboardEvent(jQuery(':focus'), KeyCodes.ARROW_UP);
					setTimeout(function() {
						assert.equal(jQuery(':focus').attr('id'), "unified21-facet-general", "Focused element is General facet");
						qutils.triggerKeyboardEvent(jQuery(':focus'), KeyCodes.ARROW_RIGHT);
						setTimeout(function() {
							assert.equal(jQuery(':focus').attr('id'), "unified21-facet-orders", "Focused element is Orders facet");
							qutils.triggerKeyboardEvent(jQuery(':focus'), KeyCodes.ARROW_LEFT);
							setTimeout(function() {
								assert.equal(jQuery(':focus').attr('id'), "unified21-facet-general", "Focused element is General facet");
								qutils.triggerKeyboardEvent(jQuery(':focus'), KeyCodes.END);
								setTimeout(function() {
									assert.equal(jQuery(':focus').attr('id'), "unified21-facet-attachments-types", "Focused element is Attachment types facet");
									qutils.triggerKeyboardEvent(jQuery(':focus'), KeyCodes.HOME);
									setTimeout(function() {
										assert.equal(jQuery(':focus').attr('id'), "unified21-facet-general", "Focused element is General facet");
										qutils.triggerKeyboardEvent(jQuery(':focus'), KeyCodes.S, false, true, false);     // Alt-S
										setTimeout(function() {
											assert.equal(jQuery(':focus').attr('id'), "unified21-master-settings-button", "Focused element is Settings button");
											qutils.triggerKeyboardEvent(jQuery(':focus'), KeyCodes.K, false, true, false);     // Alt-K
											setTimeout(function() {
												assert.equal(jQuery(':focus').attr('id'), "unified21-master-action-button", "Focused element is Actions button");
												qutils.triggerKeyboardEvent(jQuery(':focus'), KeyCodes.O, false, true, false);     // Alt-O
												setTimeout(function() {
													assert.equal(jQuery(':focus').attr('id'), "unified21-master-transaction-button", "Focused element is Transactions button");
													done();
												}, 2000);
											}, 2000);
										}, 2000);
									}, 2000);
								}, 2000);
							}, 2000);
						}, 2000);
				}, 2000);
			}, 2000);
		}, 2000);
	});

	QUnit.module("Functional Tests - sap.suite.ui.commons.UnifiedhingInspector", {
		beforeEach: function() {
			prepareUTI("unified3", 3);
		}
	});

	QUnit.test("Test functions", function(assert) {
		var done = assert.async();
		var oFacet1 = new FacetOverview("facet-1");
		var genHBox1 = new VBox({
			items: [
				new Label({text:"First facet"})
			],
			layoutData: new GridData({ span: "L4 M4 S6" })
		});
		oFacet1.setContent(genHBox1);

		var oFacet2 = new FacetOverview("facet-2");
		var genHBox2 = new VBox({
			items: [
				new Label({text:"Second facet"})
			],
			layoutData: new GridData({ span: "L4 M4 S6" })
		});
		oFacet2.setContent(genHBox2);

		oUTI.addFacet(oFacet1);
		oUTI.insertFacet(oFacet2, 2);

		oUTI.setTitle("My Title 1");
		oUTI.setName("My Name 1");
		oUTI.setDescription("My Description 1");

		setTimeout(function() {

			assert.equal(jQuery(document.getElementById("unified3-facets-grid")).find(">div>div")[2].id, "facet-2", "Facet-2 should be added as the 3rd facet");
			assert.equal(jQuery(document.getElementById("unified3-facets-grid")).find(">div>div").last().attr("id"), "facet-1", "Facet-1 should be added at the end");
			assert.equal(window.document.getElementById("unified3-master-page-title").textContent, "My Title 1", "Title should appear on master page");
			assert.equal(window.document.getElementById("unified3-header-object-header-titleText").textContent, "My Name 1", "Name should appear on header");
			assert.ok(window.document.getElementById("unified3-header-object-header").innerHTML.indexOf("My Description 1") > -1, "Description should appear on header");

			done();
		}, 3000);
	});

	QUnit.module("Aggregation Tests - sap.suite.ui.commons.UnifiedhingInspector", {
		beforeEach: function() {
			prepareUTI("unified4", 3);
		},
		afterEach: function() {
			oUTI.destroy();
		}
	});

	QUnit.test("Test aggregations", function(assert) {
		assert.equal(oUTI.getAggregation("kpis", undefined).length, 3, "The function should return 3 kpis");
		assert.equal(oUTI.getScrollClass(), "sapSuiteUtiScThree", "The function should return sapSuiteUtiScThree");
		var aKpis = oUTI.getAggregation("kpis", undefined);
		assert.equal(oUTI.validateAggregation("kpis", aKpis[0], true), aKpis[0], "kpi taken from kpis aggregation should be valid for it");
		assert.throws(function() {oUTI.validateAggregation("actions", aKpis[0], true);}, /is not valid for aggregation/, "kpi taken from kpis aggregation should be invalid for actions aggregation");
		assert.equal(oUTI.indexOfAggregation("kpis", aKpis[0]), 0, "index of the first kpi in kpis aggregation should be 0");
		assert.equal(oUTI.indexOfAggregation("facets", aKpis[0]), -1, "index of the first kpi in facets aggregation should be -1");
		oUTI.removeAggregation("kpis", aKpis[0], true);
		assert.equal(oUTI.getAggregation("kpis", undefined).length, 2, "There should be 2 kpis now");
		assert.equal(oUTI.getScrollClass(), "sapSuiteUtiScTwo", "The function should return sapSuiteUtiScTwo");
		oUTI.addAggregation("kpis", aKpis[0], true);
		assert.equal(oUTI.getAggregation("kpis", undefined).length, 3, "There should be 3 kpis now");
		oUTI.removeAggregation("kpis", aKpis[0], true);
		oUTI.insertAggregation("kpis", aKpis[0], 1, true);
		assert.equal(oUTI.getAggregation("kpis", undefined).length, 3, "There should be 3 kpis now");
		assert.equal(oUTI.indexOfAggregation("kpis", aKpis[0]), 1, "The inserted kpi should be on second position now");
		assert.equal(oUTI._callMethodInManagedObject("indexOfAggregation", "kpis", aKpis[0]), 1, "The inserted kpi should be on second position now");
		assert.equal(oUTI.getAggregation("facets", undefined).length, 6, "Initially there should be 6 facets");

		oUTI.removeAllAggregation("facets", true);
		assert.equal(oUTI.getAggregation("facets", undefined), undefined, "All facets should be removed");

		assert.equal(oUTI.getActions().length, 1, "There should be 1 action initially");
		var newAction = new Button({ text : "Button 2"});
		oUTI.insertAction(newAction,0);
		assert.equal(oUTI.getActions().length, 2, "There should be 2 actions now");
		assert.equal(oUTI.indexOfAction(newAction), 0, "New action should have index of 0");
		oUTI.removeAction(newAction);
		assert.equal(oUTI.getActions().length, 1, "There should be 1 action now");
		oUTI.removeAllActions();
		assert.equal(oUTI.getActions().length, 0, "There should be no actions now");
		oUTI.addAction(newAction);
		assert.equal(oUTI.getActions().length, 1, "There should be 1 action now");
		oUTI.destroyActions();
		assert.equal(oUTI.getActions().length, 0, "There should be no actions now");

		assert.equal(oUTI.getTransactions().length, 1, "There should be 1 transaction initially");
		var newTransaction = new Link({ text : "Link 2"});
		oUTI.insertTransaction(newTransaction,0);
		assert.equal(oUTI.getTransactions().length, 2, "There should be 2 transactions now");
		assert.equal(oUTI.indexOfTransaction(newTransaction), 0, "New transaction should have index of 0");
		oUTI.removeTransaction(newTransaction);
		assert.equal(oUTI.getTransactions().length, 1, "There should be 1 transaction now");
		oUTI.removeAllTransactions();
		assert.equal(oUTI.getTransactions().length, 0, "There should be no transactions now");
		oUTI.addTransaction(newTransaction);
		assert.equal(oUTI.getTransactions().length, 1, "There should be 1 transaction now");
		oUTI.destroyTransactions();
		assert.equal(oUTI.getTransactions().length, 0, "There should be no transactions now");

	});

	var sId = "my-page-id";
	var oPagesUTI;
	var oPage;
	QUnit.module("Pages aggregation Tests - sap.suite.ui.commons.UnifiedhingInspector", {
		beforeEach: function() {
			oPagesUTI = new UnifiedThingInspector();
			oPage = new Page(sId);
		},
		afterEach: function() {
			oPagesUTI.destroy();
			oPage.destroy();
		}
	});

	QUnit.test("Test initial size", function(assert) {
		assert.equal(oPagesUTI.getPages().length, 0, "initial capacity");
		assert.equal(oPagesUTI._oNavContainer.getPages().length, 2, "initial capacity of inner aggregation");
	});

	QUnit.test("Test pages adding", function(assert) {
		oPagesUTI.addPage(oPage);

		assert.equal(oPagesUTI.getPages().length, 1, "capacity");
		assert.equal(oPagesUTI._oNavContainer.getPages().length, 3, "inner capacity");
		assert.equal(oPagesUTI._oNavContainer.getPages()[2].getId(), sId, "my page is the last in inner aggregation");
	});

	QUnit.test("Test pages inserting", function(assert) {
		oPagesUTI.insertPage(oPage, 0);

		assert.equal(oPagesUTI._oNavContainer.getPages()[2].getId(), sId, "my page is the last in inner aggregation");

		assert.equal(oPagesUTI.indexOfPage(oPage), 0, "my page is the first");
	});

	QUnit.test("Test indexOf", function(assert) {
		assert.equal(oPagesUTI._oNavContainer.indexOfPage(oPage), -1, "no page");
		assert.equal(oPagesUTI.indexOfPage(oPage), -1, "no page");
	});

	QUnit.test("Test removeAllPages", function(assert) {
		oPagesUTI.addPage(oPage);
		oPagesUTI.removeAllPages();

		assert.equal(oPagesUTI.getPages().length, 0, "pages aggregation is empty");
		assert.equal(oPagesUTI._oNavContainer.getPages().length, 2, "inner aggregation has 2 initial pages");
	});

});