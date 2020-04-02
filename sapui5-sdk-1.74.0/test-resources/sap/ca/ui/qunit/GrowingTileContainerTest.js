window.addEventListener("load", function () {
    // require dialog module
    jQuery.sap.require("sap.m.IconTabBar");
    jQuery.sap.require("sap.m.StandardTile");
    jQuery.sap.require("sap.ui.layout.GridData");
    jQuery.sap.require("sap.ui.model.json.JSONModel");
    jQuery.sap.require("sap.ca.ui.GrowingTileContainer");
    jQuery.sap.require("sap.ui.app.MockServer");

    var oMockServer = new sap.ui.app.MockServer({
        rootUri: "/sap/customers/"
    });
    oMockServer.simulate("models/CustomersMetadata.xml");
    oMockServer.start();

    var m = new sap.ui.model.odata.ODataModel("/sap/customers/", true);
    sap.ui.getCore().setModel(m);

    var oTemplate = new sap.m.StandardTile({
        width: "100%",
        icon: "images/action.png",
        layoutData: new sap.ui.layout.GridData({
            span: "L4 M6 S12"
        })
    });

    oTemplate.bindProperty("title", "FIRST_NAME");
    oTemplate.bindProperty("info", "LAST_NAME");

    var oHtml = new sap.ui.core.HTML(
        {
            content: '<div id="contentHolder"></div><h1 id="qunit-header">Fiori Wave 2: Test Page for GrowingTileContainer</h1><h2 id="qunit-banner"></h2><h2 id="qunit-userAgent"></h2><ol id="qunit-tests"></ol>',
            afterRendering: function () {
                oTileContainer.placeAt("contentHolder");
            }
        });

    var page = new sap.m.Page("myFirstPage", {
        title: "Fiori - GrowingTileContainer Test",
        showNavButton: true,
        enableScrolling: true,
        content: oHtml
    });


    var oTileContainer = new sap.ca.ui.GrowingTileContainer("idGrowing", {
        growingThreshold: 10,
        growing: true,
        growingScrollToLoad: true
    });
    oTileContainer.bindAggregation("content", "/CUSTOMERS", oTemplate);

    var app = new sap.m.App("myApp", {
        initialPage: "myFirstPage"
    });

    app.addPage(page).placeAt("content");


/////////////////////////////////////////
//   Testing Part: GrowingTileContainer   //
/////////////////////////////////////////

    module("GrowingTileContainer");

    test("Object creation", function () {

        var oTileContainer = sap.ui.getCore().byId('idGrowing');

        strictEqual(oTileContainer.getId(), "idGrowing", "GrowingTileContainer has ID 'idGrowing'");
        var $grid = jQuery.sap.byId(oTileContainer.getId() + "-grid");
        var count = $grid.find(".sapMTile").length;
        strictEqual(count, oTileContainer.getGrowingThreshold(), "GrowingTileContainer contains " + oTileContainer.getGrowingThreshold() + " tiles");
    });

    asyncTest("TileContainer after growing", function () {
        var oTileContainer = sap.ui.getCore().byId('idGrowing');
        var $grid = jQuery.sap.byId(oTileContainer.getId() + "-grid");
        var count = $grid.find(".sapMTile").length;
        oTileContainer._triggerLoadingByScroll();
        setTimeout(function () {
            var newCount = $grid.find(".sapMTile").length;
            equal(newCount, count + oTileContainer.getGrowingThreshold(), "Tiles added after scroll: " + oTileContainer.getGrowingThreshold());
            start();
        }, 1000);
    });
});
