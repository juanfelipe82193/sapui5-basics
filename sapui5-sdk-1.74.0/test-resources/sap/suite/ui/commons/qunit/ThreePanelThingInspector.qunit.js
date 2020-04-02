(sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/commons/Label",
	"sap/ui/commons/TextView",
	"sap/ui/commons/layout/MatrixLayoutCell",
	"sap/ui/commons/library",
	"sap/ui/commons/layout/MatrixLayoutRow",
	"sap/suite/ui/commons/ThreePanelThingInspector",
	"sap/ui/ux3/NavigationItem",
	"sap/ui/ux3/ThingGroup",
	"sap/ui/commons/layout/MatrixLayout",
	"sap/ui/commons/Link"
], function(
	QUnitUtils,
	createAndAppendDiv,
	Label,
	TextView,
	MatrixLayoutCell,
	commonsLibrary,
	MatrixLayoutRow,
	ThreePanelThingInspector,
	NavigationItem,
	ThingGroup,
	MatrixLayout,
	Link
) {
	"use strict";

	// shortcut for sap.ui.commons.layout.VAlign
	var VAlign = commonsLibrary.layout.VAlign;

	// shortcut for sap.ui.commons.layout.HAlign
	var HAlign = commonsLibrary.layout.HAlign;

	createAndAppendDiv("uiArea1");

	// helper function to create a row with label and text
	function createLMatrixLayoutRowRow(sLabel, sText) {
		var oLabel = new Label({
			text: sLabel + ":"
		});
		var oTextView = new TextView({
			text: sText
		});

		var oMLCell1 = new MatrixLayoutCell({
			hAlign: HAlign.End,
			vAlign: VAlign.Top,
			content: [oLabel]
		});
		var oMLCell2 = new MatrixLayoutCell({
			hAlign: HAlign.Begin,
			vAlign: VAlign.Top,
			content: [oTextView]
		});

		return new MatrixLayoutRow({
			cells: [oMLCell1, oMLCell2]
		});
	}

	//event handler for facet event, action and standard action events, for close and open event
	function facetSelectedEventHandler(oEvent) {
		QUnit.config.current.assert.ok(true, "facet select event handler has been executed."); // this test tests by just being counted in the respective test
		var sKey = oEvent.getParameter("key");
		QUnit.config.current.assert.equal(sKey, "overview", "overview facet should be selected");
	}

	function openEventHandler(oEvent) {
		QUnit.config.current.assert.ok(true, "open event handler has been executed."); // this test tests by just being counted in the respective test
	}

	function createThingInspector(sID) {
		var oTI1 = new ThreePanelThingInspector({
			id: sID,
			icon: "../images/Account_48.png", // put the Account icon
			firstTitle: "My Thing Inspector", // give a title
			type: "Account", // give thing type
			//enableFollowAction:false,
			facets: [ // add some facets
				new NavigationItem({
					key: "overview",
					text: "Overview"
				}),
				new NavigationItem({
					key: "activities",
					text: "Activities"
				})
			]
		});
		oTI1.setLogo("../images/Account_48.png");
		oTI1.setSidebarWidth("300px");
		var oTC1 = new ThingGroup({
			title: "About"
		});
		var oTC2 = new ThingGroup({
			title: "Contact"
		});
		var oLayout = new MatrixLayout();
		oLayout.addRow(createLMatrixLayoutRowRow("Status", "active"));
		oLayout.addRow(createLMatrixLayoutRowRow("Owner", "Erwin M."));
		oLayout.addRow(createLMatrixLayoutRowRow("Territory", "a Contact"));
		oLayout.addRow(createLMatrixLayoutRowRow("Prim. Contact", "Hugo"));
		oLayout.addRow(createLMatrixLayoutRowRow("Web Site", "link!!!"));
		oLayout.addRow(createLMatrixLayoutRowRow("Classification", "a classification"));
		oTC1.addContent(oLayout);
		oTI1.addHeaderContent(oTC1);

		var oLayout2 = new MatrixLayout();
		oLayout2.addRow(createLMatrixLayoutRowRow("Address", "Irgendwo, Strasse + HNr."));
		oLayout2.addRow(createLMatrixLayoutRowRow("Phone", "06221/23428374"));
		oLayout2.addRow(createLMatrixLayoutRowRow("Fax", "06221/23423432"));
		oLayout2.addRow(createLMatrixLayoutRowRow("Email", "hugo.m@web.de"));
		oTC2.addContent(oLayout2);
		oTI1.addHeaderContent(oTC2);

		return oTI1;
	}

	var oThingInspector = createThingInspector("ti1");
	oThingInspector.attachFacetSelected(facetSelectedEventHandler);
	oThingInspector.attachOpen(openEventHandler);
	oThingInspector.placeAt("uiArea1");

	QUnit.module("sap.suite.ui.commons.ThreePanelThingInspector", {
		beforeEach: function() {
			oThingInspector.open();
		},
		afterEach: function() {
			oThingInspector.close();
		}
	});

	QUnit.test("Test initializing and rendering", function(assert) {
		var done = assert.async();
		setTimeout(function() {
			assert.ok(oThingInspector.getId() ? window.document.getElementById(oThingInspector.getId()) : null, "ThreePanelThingInspector outer HTML Element is rendered.");
			assert.ok(oThingInspector.getId() + "-thingViewer" ? window.document.getElementById(oThingInspector.getId() + "-thingViewer") : null, "ThreePanelThingViewer outer HTML Element is rendered.");
			done();
		}, 100);
	});

	QUnit.test("Test menu item methods", function(assert) {
		var done = assert.async();
		var oLink1 = new Link({ text: "Item1", href: "http://www.sap.com" });
		var oLink2 = new Link({ text: "Item2", href: "http://www.sap.com" });
		oThingInspector.addMenuContent(oLink1);
		oThingInspector.insertMenuContent(oLink2, 0);
		setTimeout(function() {
			assert.equal(oThingInspector.indexOfMenuContent(oLink1), 1, "Item 1 moved to second position");
			assert.equal(oThingInspector.indexOfMenuContent(oLink2), 0, "Item 2 inserted to first position");
			done();
		}, 100);
	});
}));