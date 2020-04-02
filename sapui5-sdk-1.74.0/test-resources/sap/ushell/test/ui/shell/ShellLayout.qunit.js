// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ui.shell.ShellLayout
 */

(function () {
    "use strict";
    /* global equal, module, ok, test, my */

    jQuery.sap.require("sap.ushell.ui.shell.ShellLayout");
    jQuery.sap.require("sap.ushell.ui.shell.SplitContainer");
    jQuery.sap.require("sap.ushell.ui.shell.ToolAreaItem");
	jQuery.sap.require("sap.ushell.ui.shell.ShellHeadItem");
	jQuery.sap.require("sap.ushell.ui.ShellHeader");
	jQuery.sap.require("sap.ushell.ui.shell.ShellFloatingAction");
	jQuery.sap.require("sap.ushell.ui.shell.ShellFloatingActions");
	jQuery.sap.require("sap.ushell.ui.shell.FloatingContainer");
	jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.resources");
	jQuery.sap.require("jquery.sap.storage");

    sap.ui.core.Control.extend("my.Test", {
        renderer: function (rm, ctrl) {
            rm.write("<div style='width:10px;height:10px;background-color:gray;'");
            rm.writeControlData(ctrl);
            rm.write("></div>");
        }
    });

    var oShell,
        oShell2,
		oSearchButton,
		oShellHeader,
		oShellHeader2,
		oShellFloatingContainer,
		oShellFloatingContainer2;

    module("sap.ushell.ui.shell.ShellLayout", {
        setup: function () {
            jQuery("<div id=\"canvas\"></div>").appendTo("body");
			jQuery.sap.storage.clear();
            var oShellSplitContainer,
                oShellToolArea,
                oShellFloatingActions,
                oShellSplitContainer2,
                oShellToolArea2,
                oShellFloatingActions2;

            oShellSplitContainer = new sap.ushell.ui.shell.SplitContainer({
                id: "shell-split",
                secondaryContent: [new my.Test("_pane_ctnt")],
                content: [new my.Test("_ctnt")],
                subHeader: [new my.Test("_subheader_ctnt")]
            });
            oShellToolArea = new sap.ushell.ui.shell.ToolArea({
                id: "shell-toolArea",
                toolAreaItems: [new sap.ushell.ui.shell.ToolAreaItem("_toolarea_itm")]
            });


            oSearchButton = new sap.ushell.ui.shell.ShellHeadItem("sf");

            oShellHeader = new sap.ushell.ui.ShellHeader({
                id: 'shell-header',
                headItems: [new sap.ushell.ui.shell.ShellHeadItem("_itm"), oSearchButton],
                headEndItems: [new sap.ushell.ui.shell.ShellHeadItem("_end_itm")],
                title: "",
                search: new my.Test("search")
            });

            oShellFloatingActions = new sap.ushell.ui.shell.ShellFloatingActions({
                id: "shell-floatingActions",
                floatingActions: [new sap.ushell.ui.shell.ShellFloatingAction("_floatingAction")]
            });

            oShellFloatingContainer = new sap.ushell.ui.shell.FloatingContainer({
                id: "shell-floatingContainer",
                content: [new sap.m.Button("testButton", {test: "testButton"})]
            });

            oShell = new sap.ushell.ui.shell.ShellLayout({
                id: "shell",
                header: oShellHeader,
                toolArea: oShellToolArea,
                canvasSplitContainer: oShellSplitContainer,
                floatingContainer: oShellFloatingContainer,
                floatingActionsContainer: oShellFloatingActions
            });

            oShellSplitContainer2 = new sap.ushell.ui.shell.SplitContainer({
                showSecondaryContent: true
            });

            oShellToolArea2 = new sap.ushell.ui.shell.ToolArea({
                textVisible: false
            });


            oShellHeader2 = new sap.ushell.ui.ShellHeader({
                title: "TITLE",
                searchState: sap.ushell.ui.ShellHeader.prototype.SearchState.COL,
                logo: "../icon.png"
            });

            oShellFloatingContainer2 = new sap.ushell.ui.shell.FloatingContainer({
                id: "shell-floatingContainer2",
                content: [new sap.m.Button("testButton2", {test: "testButton"})]
            });

            oShellFloatingActions2 = new sap.ushell.ui.shell.ShellFloatingActions({
                isFooterVisible: true
            });

            oShell2 = new sap.ushell.ui.shell.ShellLayout({
                id: "shell2",
                header: oShellHeader2,
                toolArea: oShellToolArea2,
                canvasSplitContainer: oShellSplitContainer2,
                floatingActionsContainer: oShellFloatingActions2,
                floatingContainer: oShellFloatingContainer2,
                headerVisible: false,
                toolAreaVisible: true
            });
            oShellHeader2.setShellLayout(oShell2);

            oShell.placeAt("canvas");
            oShellHeader.setShellLayout(oShell);
            oShellHeader.createUIArea();
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            oShell.destroy();
            oShell2.destroy();
            oSearchButton.destroy();
            jQuery("#canvas").remove();
            oShellFloatingContainer.destroy();
            oShellFloatingContainer2.destroy();
            oShellHeader.destroy();
            oShellHeader2.destroy();
        }
    });

    /** ----------**/
    /** Rendering **/
    /** ----------**/
    test("Content", function (assert) {
		var done = assert.async();
        setTimeout(function () {
            ok(!!jQuery("#shell-header-hdr-search").length, "Search rendered correctly");
            ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-header-hdr-begin"), jQuery.sap.domById("_itm")), "Header Items rendered correctly");
            ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-header-hdr-end"), jQuery.sap.domById("_end_itm")), "Header End Items rendered correctly");
            ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-split-canvas"), jQuery.sap.domById("_ctnt")), "Content rendered correctly");
            ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-split-pane"), jQuery.sap.domById("_pane_ctnt")), "Pane Content rendered correctly");
            ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-floatingContainer"), jQuery.sap.domById("testButton")), "FloatingContainer rendered correctly");
			oShell.destroy();
			done();
        }, 500);
    });

    /** ----**/
    /** API **/
	/** ----**/
	var _sNoLogo = "data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="; // default logo

    test("Properties - Default Values", function () {
        equal(oShell.getHeaderVisible(), true, "Default 'headerVisible'");
        equal(oShell.getToolAreaVisible(), false, "Default 'toolAreaVisible'");
        equal(oShell.getHeader().getLogo(), _sNoLogo, "Default 'icon'");
        equal(oShell.getFloatingContainerVisible(), false, "Default FloatingContainer visiblity 'false'");
        equal(oShell.getHeader().getSearchState(), sap.ushell.ui.ShellHeader.prototype.SearchState.COL, "Default 'searchVisible'");
        equal(oShell.getHeader().getTitle(), "", "Default Title");
        equal(oShell.getFloatingActionsContainer().getIsFooterVisible(), false, "Default 'isFooterVisible'");
    });

    test("Properties - Custom Values", function () {
        equal(oShell2.getHeaderVisible(), false, "Default 'headerVisible'");
        equal(oShell2.getToolAreaVisible(), true, "Default 'toolAreaVisible'");
        equal(oShell2.getHeader().getLogo(), "../icon.png", "Custom 'icon'");
        equal(oShell2.getHeader().getSearchState(), sap.ushell.ui.ShellHeader.prototype.SearchState.COL, "Custom 'searchVisible'");
        equal(oShell2.getHeader().getTitle(), "TITLE", "Default Title");
        equal(oShell2.getFloatingActionsContainer().getIsFooterVisible(), true, "Custom 'isFooterVisible'");
    });

    test("Set/Get title", function () {
        equal(oShell.getHeader().getTitle(), "", "Default Title - no value exist");// default
        oShell.getHeader().setTitle("DEMO_TITLE");
        equal(oShell.getHeader().getTitle(), "DEMO_TITLE", "Custom Title");// set a new value
        oShell.getHeader().setTitle("");
        equal(oShell.getHeader().getTitle(), "", "Empty Title");// empty value
        oShell.setFloatingContainerVisible(true);
        equal(oShell.getFloatingContainerVisible(), true, "Floating Container visibility was set to true");
    });

    test("Set/Get logo", function () {
        equal(oShell.getHeader().getLogo(), _sNoLogo, "Default logo - invisible");// default
        oShell.getHeader().setLogo("../icon.png");
        equal(oShell2.getHeader().getLogo(), "../icon.png", "Custom Logo");
        oShell.getHeader().setLogo("");
        equal(oShell.getHeader().getLogo(), _sNoLogo, "invisible");// default
    });

	test("Shell Header Types", function () {
		var oHeader = oShell.getHeader();
		ok(oHeader instanceof sap.ushell.ui.ShellHeader, "Header type is correct");

		var oHeadItems = oHeader.getMetadata().getAllAggregations().headItems;
		equal(oHeadItems.type, "sap.ushell.ui.shell.ShellHeadItem", "Head Items type is correct");

		var oHeadEndItems = oHeader.getMetadata().getAllAggregations().headEndItems;
		equal(oHeadEndItems.type, "sap.ushell.ui.shell.ShellHeadItem", "Head End Items type is correct");
	});

	test("Shell Header - add / remove HeadItems", function () {
		var oHeader = oShell.getHeader(),
			oHeadItems = oHeader.getHeadItems(),
			headItem = sap.ui.getCore().byId("_itm"),
			newHeadItem = new sap.ushell.ui.shell.ShellHeadItem("_itm2");

		equal(oHeadItems.length, 2, "Initial number of headItems controls");

		oHeader.addHeadItem(newHeadItem);
		oHeadItems = oHeader.getHeadItems();
		equal(oHeadItems.length, 3, "number of headItems controls after add");

		oHeader.removeHeadItem(newHeadItem);
		oHeadItems = oHeader.getHeadItems();
		equal(oHeadItems.length, 2, "number of headItems controls after remove");

		oHeader.removeAllHeadItems();
		oHeadItems = oHeader.getHeadItems();
		equal(oHeadItems.length, 0, "number of headItems controls after removeAll");

		headItem.destroy();
		newHeadItem.destroy();
	});

	test("Shell Header - add / remove HeadEndItems", function () {
		var oHeader = oShell.getHeader(),
			oHeadEndItems = oHeader.getHeadEndItems(),
			headEndItem = sap.ui.getCore().byId("_end_itm"),
			newHeadEndItem = new sap.ushell.ui.shell.ShellHeadItem("_end_itm2");

		equal(oHeadEndItems.length, 1, "Initial number of headEndItems controls");

		oHeader.addHeadEndItem(newHeadEndItem);
		oHeadEndItems = oHeader.getHeadEndItems();
		equal(oHeadEndItems.length, 2, "number of headEndItems controls after add");

		oHeader.removeHeadEndItem(newHeadEndItem);
		oHeadEndItems = oHeader.getHeadEndItems();
		equal(oHeadEndItems.length, 1, "number of headEndItems controls after remove");

		oHeader.removeAllHeadEndItems();
		oHeadEndItems = oHeader.getHeadEndItems();
		equal(oHeadEndItems.length, 0, "number of headEndItems controls after removeAll");

		headEndItem.destroy();
		newHeadEndItem.destroy();
	});

	test("Shell Header - set / destroy Search", function () {
		var oHeader = oShell.getHeader(),
			oSearch = oHeader.getSearch(),
			newSearch = new sap.ui.core.Control();

		ok(oSearch, "search control exists");

		oHeader.destroySearch();
		oSearch = oHeader.getSearch();
		ok(!oSearch, "No search control after destroy");

		oHeader.setSearch(newSearch);
		oSearch = oHeader.getSearch();
		ok(!!oSearch, "Search control available after set");
	});

	test("Floating Actions - types ", function () {
		var oFloatingActionsContainer = oShell.getFloatingActionsContainer();
		ok(oFloatingActionsContainer instanceof sap.ushell.ui.shell.ShellFloatingActions, "Floating Actions type is correct");

		var oFloatingActions = oFloatingActionsContainer.getMetadata().getAllAggregations().floatingActions;
		equal(oFloatingActions.type, "sap.ushell.ui.shell.ShellFloatingAction", "Floating Action type is correct");
	});

	test("Floating Actions - add / remove floatingAction items", function () {
		var oFloatingActionsContainer = oShell.getFloatingActionsContainer(),
			oFloatingActions = oFloatingActionsContainer.getFloatingActions(),
			floatingAction = sap.ui.getCore().byId("_floatingAction"),
			newFloatingAction = new sap.ushell.ui.shell.ShellFloatingAction("_floatingAction2");

		equal(oFloatingActions.length, 1, "Initial number of floatingAction controls");

		oFloatingActionsContainer.addFloatingAction(newFloatingAction);
		oFloatingActions = oFloatingActionsContainer.getFloatingActions();
		equal(oFloatingActions.length, 2, "number of floatingAction controls after add");

		oFloatingActionsContainer.removeFloatingAction(newFloatingAction);
		oFloatingActions = oFloatingActionsContainer.getFloatingActions();
		equal(oFloatingActions.length, 1, "number of floatingAction controls after remove");

		oFloatingActionsContainer.removeAllFloatingActions();
		oFloatingActions = oFloatingActionsContainer.getFloatingActions();
		equal(oFloatingActions.length, 0, "number of floatingAction controls after removeAll");

		floatingAction.destroy();
		newFloatingAction.destroy();
	});

	test("Floating Actions - isFooterVisible property", function () {
		ok(!oShell.getFloatingActionsContainer().getIsFooterVisible(), "Default isFooterVisible - false");
		oShell.getFloatingActionsContainer().setIsFooterVisible(true);
		ok(oShell.getFloatingActionsContainer().getIsFooterVisible(), "isFooterVisible - true");
		oShell.getFloatingActionsContainer().setIsFooterVisible(false);
		ok(!oShell.getFloatingActionsContainer().getIsFooterVisible(), "isFooterVisible - false");
	});

	test("Split Container - types ", function () {
		var oCanvasSplitContainer = oShell.getCanvasSplitContainer();
		ok(oCanvasSplitContainer instanceof sap.ushell.ui.shell.SplitContainer, "Split Actions type is correct");

		var oContent = oCanvasSplitContainer.getMetadata().getAllAggregations().content;
		equal(oContent.type, "sap.ui.core.Control", "Content type is correct");

		var oSecondaryContent = oCanvasSplitContainer.getMetadata().getAllAggregations().secondaryContent;
		equal(oSecondaryContent.type, "sap.ui.core.Control", "Secondary Content type is correct");

		var oSubHeader = oCanvasSplitContainer.getMetadata().getAllAggregations().subHeader;
		equal(oSubHeader.type, "sap.ui.core.Control", "Sub Header type is correct");
	});

	test("Split Container - set / destroy Sub Header", function () {
		var oCanvasSplitContainer = oShell.getCanvasSplitContainer(),
			oSubHeader = oCanvasSplitContainer.getSubHeader(),
			newSubHeader = new my.Test("_subheader_ctnt2");

		ok(oSubHeader, "subheader control exists");

		oCanvasSplitContainer.destroySubHeader();
		oSubHeader = oCanvasSplitContainer.getSubHeader();
		equal(oSubHeader.length, 0, "No subheader controls after destroy");

		oCanvasSplitContainer.addSubHeader(newSubHeader);
		oSubHeader = oCanvasSplitContainer.getSubHeader();
		ok(oSubHeader, "subheader exists after set");
	});

	test("Split Container - add / remove content items", function () {
		var oCanvasSplitContainer = oShell.getCanvasSplitContainer(),
			oContent = oCanvasSplitContainer.getContent(),
			control = sap.ui.getCore().byId("_ctnt"),
			newControl = new my.Test("_ctnt2");

		equal(oContent.length, 1, "Initial number of content controls");

		oCanvasSplitContainer.addContent(newControl);
		oContent = oCanvasSplitContainer.getContent();
		equal(oContent.length, 2, "number of content controls after add");

		oCanvasSplitContainer.removeContent(newControl);
		oContent = oCanvasSplitContainer.getContent();
		equal(oContent.length, 1, "number of content controls after remove");

		oCanvasSplitContainer.removeAllContent();
		oContent = oCanvasSplitContainer.getContent();
		equal(oContent.length, 0, "number of content controls after removeAll");

		control.destroy();
		newControl.destroy();
	});

	test("Split Container - add / remove secondaryContent items", function () {
		var oCanvasSplitContainer = oShell.getCanvasSplitContainer(),
			oSecondaryContent = oCanvasSplitContainer.getSecondaryContent(),
			control = sap.ui.getCore().byId("_pane_ctnt"),
			newControl = new my.Test("_pane_ctnt2");

		equal(oSecondaryContent.length, 1, "Initial number of secondaryContent controls");

		oCanvasSplitContainer.addSecondaryContent(newControl);
		oSecondaryContent = oCanvasSplitContainer.getSecondaryContent();
		equal(oSecondaryContent.length, 2, "number of secondaryContent controls after add");

		oCanvasSplitContainer.removeSecondaryContent(newControl);
		oSecondaryContent = oCanvasSplitContainer.getSecondaryContent();
		equal(oSecondaryContent.length, 1, "number of secondaryContent controls after remove");

		oCanvasSplitContainer.removeAllSecondaryContent();
		oSecondaryContent = oCanvasSplitContainer.getSecondaryContent();
		equal(oSecondaryContent.length, 0, "number of secondaryContent controls after removeAll");

		control.destroy();
		newControl.destroy();
	});

	test("Tool Area - types ", function () {
		var oToolArea = oShell.getToolArea();
		ok(oToolArea instanceof sap.ushell.ui.shell.ToolArea, "Tool Area type is correct");

		var oToolAreaItems = oToolArea.getMetadata().getAllAggregations().toolAreaItems;
		equal(oToolAreaItems.type, "sap.ushell.ui.shell.ToolAreaItem", "toolarea item type is correct");
	});

	test("Tool Area - add / remove toolarea items", function () {
		var oToolArea = oShell.getToolArea(),
			aToolAreaItems = oToolArea.getToolAreaItems(),
			toolareaItem = sap.ui.getCore().byId("_toolarea_itm"),
			newToolareaItem = new sap.ushell.ui.shell.ToolAreaItem("_toolarea_itm2");

		equal(aToolAreaItems.length, 1, "Initial number of toolarea controls");

		oToolArea.addToolAreaItem(newToolareaItem);
		aToolAreaItems = oToolArea.getToolAreaItems();
		equal(aToolAreaItems.length, 2, "number of toolarea controls after add");

		oToolArea.removeToolAreaItem(newToolareaItem);
		aToolAreaItems = oToolArea.getToolAreaItems();
		equal(aToolAreaItems.length, 1, "number of toolarea controls after remove");

		oToolArea.removeAllToolAreaItems();
		aToolAreaItems = oToolArea.getToolAreaItems();
		equal(aToolAreaItems.length, 0, "number of toolarea controls after removeAll");

		toolareaItem.destroy();
		newToolareaItem.destroy();
	});

    module("sap.ushell.ui.shell.ShellLayout with Fiori 2.0 ON", {
		beforeEach: function () {
			jQuery("<div id=\"canvas\"></div>").appendTo("body");
			var oShellSplitContainer;


			oShellHeader = new sap.ushell.ui.ShellHeader({
				id: 'shell-header',
				headItems: [new sap.ushell.ui.shell.ShellHeadItem("_itm")],
				headEndItems: [new sap.ushell.ui.shell.ShellHeadItem("_end_itm")],
				search: new my.Test("search")
			});

            oShellSplitContainer = new sap.ushell.ui.shell.SplitContainer({
                id: "shell-split",
                secondaryContent: [new my.Test("_pane_ctnt")],
                content: [new my.Test("_ctnt")],
                subHeader: [new my.Test("_subheader_ctnt")]
            });

			oShell = new sap.ushell.ui.shell.ShellLayout({
				id: "shell",
				header: oShellHeader,
                canvasSplitContainer: oShellSplitContainer
			});

            oShell.placeAt("canvas");
            oShellHeader.setShellLayout(oShell);
			oShellHeader.createUIArea();
		},
		/**
		 * This method is called after each test. Add every restoration code here.
		 */
		afterEach: function () {
			oShell.destroy();
			oShellHeader.destroy();
			jQuery("#canvas").remove();
		}
    });

    test("Test ShellLayout and ShellHeader - Fiori 2.0 is ON", function (assert) {
        assert.expect(4);
        var done1 = assert.async();

        oShell.assertFunction = function () {
            var oShellDomRef = this.getDomRef();
            ok(!oShellDomRef.querySelector(".sapUshellShellBrand"), "Brand line should not be added to shell on Firoi 2.0");
            ok(!oShellDomRef.querySelector(".sapUiGlobalBackgroundColorForce"), "Background Color Force should not be added to shell on Fiori 2.0");
            ok(!oShellDomRef.querySelector(".sapUiShellBackground"), "Global Background Color should not be added to shell on Fiori 2.0");
            ok(!oShellDomRef.querySelector(".sapUshellShellAnim"), "Animation should not be added to shell on Fiori 2.0");
            done1();
        };

        oShell.addEventDelegate({onAfterRendering: oShell.assertFunction.bind(oShell)});
    });

}());