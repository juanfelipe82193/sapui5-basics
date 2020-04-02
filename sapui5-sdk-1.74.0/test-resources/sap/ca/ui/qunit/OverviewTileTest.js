window.addEventListener("load", function () {
    // require dialog module
    jQuery.sap.require("sap.m.IconTabBar");
    jQuery.sap.require("sap.ca.ui.OverviewTile");
    var oHtml = new sap.ui.core.HTML(
        {
            content: '<div id="contentHolder"></div><h1 id="qunit-header">Fiori Wave 2: Test Page for OverviewTile</h1><h2 id="qunit-banner"></h2><h2 id="qunit-userAgent"></h2><ol id="qunit-tests"></ol>',
            afterRendering: function () {
                oOverviewTile.placeAt("contentHolder");
            }
        });

    var page = new sap.m.Page("myFirstPage", {
        title: "Fiori - OverviewTile Test",
        showNavButton: true,
        enableScrolling: true,
        content: oHtml
    });

    var oOverviewTile = new sap.ca.ui.OverviewTile("overviewTile", {
        icon: "",
        contact: "Chuck Norris Hotel Particulier Chatillon Paris France",
        title: "Flower Power incorporated that will rock Flower Power incorporated that will rock Flower Power incorporated that will rock",
        address: "Magasin de Luxe, 158 rue Foubourg Saint Honorine, 8e arrondissement de Paris  75008 Paris , France",
        rating: "Diamond",
        opportunities: "Tons of money",
        revenue: "Millions of Millions of Millions of Millions of dollars",
        lastContact: "13 May. 2013",
        nextContact: "24 Oct. 2013",
        press: "onTileTap",
        contactPress: "showContact"
    });


    var app = new sap.m.App("myApp", {
        initialPage: "myFirstPage"
    });

    app.addPage(page).placeAt("content");

    /////////////////////////////////////////
    //   Testing Part: OverviewTile   //
    /////////////////////////////////////////
    module("OverviewTile - Object Create");

    test("Object Creation with Id", function () {
        var oOverviewTile = new sap.ca.ui.OverviewTile("id", {
            icon: "",
            contact: "Chuck Norris Hotel Particulier Chatillon Paris France",
            title: "Flower Power incorporated that will rock Flower Power incorporated that will rock Flower Power incorporated that will rock",
            address: "Magasin de Luxe, 158 rue Foubourg Saint Honorine, 8e arrondissement de Paris  75008 Paris , France",
            rating: "Diamond",
            opportunities: "Tons of money",
            revenue: "Millions of Millions of Millions of Millions of dollars",
            lastContact: "13 May. 2013",
            nextContact: "24 Oct. 2013",
            press: "onTileTap",
            contactPress: "showContact"
        });
        strictEqual(oOverviewTile.getId(), "id", "OverviewTile has ID 'id'");
    });
    test("Object use of CSS class", function () {
        ok(jQuery('.sapCaUiOTAddress'), "");
        ok(jQuery('.sapCaUiOverviewTileTitle'), "");
        ok(jQuery('.sapCaUiOverviewTileContact'), "");
        ok(jQuery('.sapCaUiOTFormLbl'), "");
        ok(jQuery('.sapCaUiOTFormVal'), "");
        ok(jQuery('.sapCaUiOverviewTile'), "");
        ok(jQuery('.sapCaUiOverviewTileHeader'), "");
        ok(jQuery('.sapCaUiOTImageDiv'), "");
        ok(jQuery('.sapCaUiOTTitleContentDiv'), "");
        ok(jQuery('.sapCaUiOTTitleAddressDiv'), "");
        ok(jQuery('.sapCaUiOTTitleContactDiv'), "");
        ok(jQuery('.sapCaUiOverviewTileContent'), "");
    });

    test("Initialization of overviewTile attributes", function () {
        equal(sap.ui.getCore().byId("overviewTile")._getTitleCtrl().getText(), "Flower Power incorporated that will rock Flower Power incorporated that will rock Flower Power incorporated that will rock", "Text of title should be 'Flower Power incorporated that will rock Flower Power incorporated that will rock Flower Power incorporated that will rock'");
        equal(sap.ui.getCore().byId("overviewTile")._getContactCtrl().getText(), "Chuck Norris Hotel Particulier Chatillon Paris France", "Contact text should be 'Chuck Norris Hotel Particulier Chatillon Paris France'");
        equal(sap.ui.getCore().byId("overviewTile")._getAddressCtrl().getText(), "Magasin de Luxe, 158 rue Foubourg Saint Honorine, 8e arrondissement de Paris  75008 Paris , France", "Adress text should be 'Magasin de Luxe, 158 rue Foubourg Saint Honorine, 8e arrondissement de Paris  75008 Paris , France'");
        equal(sap.ui.getCore().byId("overviewTile")._getOppCtrl().getText(), "Tons of money", "Opportunity text should be 'Tons of money'");
        equal(sap.ui.getCore().byId("overviewTile")._getRevenueCtrl().getText(), "Millions of Millions of Millions of Millions of dollars", "Revenue text should be 'Millions of Millions of Millions of Millions of dollars'");
        equal(sap.ui.getCore().byId("overviewTile")._getRatingCtrl().getText(), "Diamond", "Rating text should be 'Diamond'");
        equal(sap.ui.getCore().byId("overviewTile")._getLastCtxCtrl().getText(), "13 May. 2013", "Last contact text should be '13 May. 2013'");
        equal(sap.ui.getCore().byId("overviewTile")._getNextCtxCtrl().getText(), "24 Oct. 2013", "Next contact text should be '24 Oct. 2013'");
    });
});
