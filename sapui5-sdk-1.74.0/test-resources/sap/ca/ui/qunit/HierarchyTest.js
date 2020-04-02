window.addEventListener("load", function () {
    // require dialog module
    jQuery.sap.require("sap.ca.ui.Hierarchy");

    var HIERARCHY_ID = "hierarchy";

    var oData = {
        items: [
            {
                title: "Title 1",
                activity: "Activity 1",
                id: 1,
                link: "Link 1",
                icon: "refresh"
            },
            {
                title: "Title 2",
                activity: "Activity 2",
                id: 2,
                link: "Link 2",
                icon: "refresh"
            },
            {
                title: "Title 3",
                activity: "Activity 3",
                id: 3,
                link: "Link 3",
                icon: "refresh"
            },
            {
                title: "Title 4",
                activity: "Activity 4",
                id: 4,
                link: "Link 4",
                icon: "refresh"
            },
            {
                title: "Title 5",
                activity: "Activity 5",
                id: 5,
                link: "Link 5",
                icon: "refresh"
            }
        ]
    };

    var oModel = new sap.ui.model.json.JSONModel(oData);

    var oHtml = new sap.ui.core.HTML(
        {
            content: '<div id="contentHolder"></div><h1 id="qunit-header">Fiori Wave 2: Test Page for Hierarchy</h1><h2 id="qunit-banner"></h2><h2 id="qunit-userAgent"></h2><ol id="qunit-tests"></ol>',
            afterRendering: function () {
                oHierarchy.placeAt("contentHolder");
            }
        });

    var page = new sap.m.Page("myFirstPage", {
        title: "Fiori - Hierarchy Test",
        showNavButton: true,
        enableScrolling: true,
        content: oHtml
    });

    var oHierarchy = new sap.ca.ui.Hierarchy({
        id: HIERARCHY_ID
    });

    oHierarchy.bindItems("/items", new sap.ca.ui.HierarchyItem({
        title: "{title}",
        icon: "{icon}",
        identifier: "{id}",
        link: "{link}",
        activity: "{activity}"
    }));

    oHierarchy.setModel(oModel);

    var app = new sap.m.App("myApp", {
        initialPage: "myFirstPage"
    });

    app.addPage(page).placeAt("content");

    ///////////////
    //Testing Part: Hierarchy
    ///////////////
    module("Hierarchy - Object Create");

    test("Object Creation with Id", function () {
        strictEqual(oHierarchy.getId(), HIERARCHY_ID, "Hierarchy has ID " + HIERARCHY_ID);
    });

    test("Items aggregation", function () {
        strictEqual(oHierarchy.getItems().length, oData.items.length, "Nb of items is not matching");
    });
});


