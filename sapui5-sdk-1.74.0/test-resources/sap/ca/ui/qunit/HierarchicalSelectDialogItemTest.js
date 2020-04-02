window.addEventListener("load", function () {
    // require dialog module
    jQuery.sap.require("sap.ca.ui.HierarchicalSelectDialog");

    // set global models
    var mJSON = new sap.ui.model.json.JSONModel({
        "WorkItems": [
            {
                name: "WorkItem_1",
                description: "My_WorkItem1",
                ItemDetails: [
                    {
                        name: "WI-1-Item-1",
                        description: "First subitem",
                        ItemSubDetails: [
                            {
                                name: "WI-1-I-1-Sub-1",
                                description: "Sub item detail 1"
                            },
                            {
                                name: "WI-1-I-1-Sub-2",
                                description: "Sub item detail 2"
                            }
                        ]
                    },
                    {
                        name: "WI-1-Item-2",
                        description: "Other subitem",
                        ItemSubDetails: [
                            {
                                name: "WI-1-I-2-Sub-1",
                                description: "Sub item detail 1"
                            },
                            {
                                name: "WI-1-I-2-Sub-2",
                                description: "Sub item detail 2"
                            }
                        ]
                    }
                ]
            },
            {
                name: "WorkItem_2",
                description: "My other workitem",
                ItemDetails: [
                    {
                        name: "WI-2-Item-1",
                        description: "First subitem",
                        ItemSubDetails: [
                            {
                                name: "WI-2-I-1-Sub-1",
                                description: "Sub item detail 1"
                            },
                            {
                                name: "WI-2-I-1-Sub-2",
                                description: "Sub item detail 2"
                            }
                        ]
                    },
                    {
                        name: "WI-2-Item-2",
                        description: "Other subitem",
                        ItemSubDetails: [
                            {
                                name: "WI-2-I-2-Sub-1",
                                description: "Sub item detail 1"
                            },
                            {
                                name: "WI-2-I-2-Sub-2",
                                description: "Sub item detail 2"
                            }
                        ]
                    }
                ]
            },
            {
                name: "WorkItem_3",
                description: "My third workitem",
                ItemDetails: [
                    {
                        name: "WI-3-Item-1",
                        description: "First subitem",
                        ItemSubDetails: [
                            {
                                name: "WI-3-I-1-Sub-1",
                                description: "Sub item detail 1"
                            },
                            {
                                name: "WI-3-I-1-Sub-2",
                                description: "Sub item detail 2"
                            }
                        ]
                    },
                    {
                        name: "WI-1-Item-2",
                        description: "Other subitem",
                        ItemSubDetails: [
                            {
                                name: "WI-3-I-2-Sub-1",
                                description: "Sub item detail 1"
                            },
                            {
                                name: "WI-3-I-2-Sub-2",
                                description: "Sub item detail 2"
                            }
                        ]
                    }
                ]
            }
        ]
    });

    var xml = '<ui:HierarchicalSelectDialog' +
        ' xmlns="sap.m" xmlns:ui="sap.ca.ui"' +
        ' title="Hierarchical Select Dialog"  ' +
        ' width="300px"                       ' +
        ' height="300px"                      ' +
        ' select="onItemSelected"             ' +
        ' cancel="onCancel">                  ' +
        '        <ui:HierarchicalSelectDialogItem title="Work Items" entityName="json>/WorkItems">' +
        '        <ui:listItemTemplate>                                                             ' +
        '<StandardListItem title="{json>name}" description="{json>description}" icon="sap-icon://lab"/>' +
        '        </ui:listItemTemplate>                                                                 ' +
        '        </ui:HierarchicalSelectDialogItem>                                                     ' +
        '        <ui:HierarchicalSelectDialogItem title="Page 2" entityName="json>ItemDetails">         ' +
        '        <ui:listItemTemplate>                                                                  ' +
        '<StandardListItem title="{json>name}" description="{json>description}" icon="sap-icon://lab"/> ' +
        '        </ui:listItemTemplate>                                                                 ' +
        '        </ui:HierarchicalSelectDialogItem>                                                     ' +
        '        <ui:HierarchicalSelectDialogItem title="Page 3" entityName="json>ItemSubDetails">      ' +
        '        <ui:listItemTemplate>                                                                  ' +
        '<StandardListItem title="{json>name}" description="{json>description}" icon="sap-icon://lab"/> ' +
        '        </ui:listItemTemplate>                                                                 ' +
        '        </ui:HierarchicalSelectDialogItem>                                                     ' +
        '        </ui:HierarchicalSelectDialog>                                                         ';

    oHierchicalSelectDialog = sap.ui.xmlfragment({id: HIERARCHY_SELECT_DIALOG_ID, fragmentContent: xml}, this);

    oHierchicalSelectDialog.setModel(mJSON, "json");

    var oButton = new sap.m.Button({
        id: "ButtonId",
        tap: function () {
            oHierchicalSelectDialog.open()
        },
        text: "Open Dialog"
    });

    var oHtml = new sap.ui.core.HTML({
        content: '<h1 id="qunit-header">Fiori Wave 2: Test Page for Hierarchical Select Dialog</h1>' +
            '<h2 id="qunit-banner"></h2>' +
            '<h2 id="qunit-userAgent"></h2>' +
            '<ol id="qunit-tests"></ol>' +
            '<h4></h4>' +
            '<h5>Button to display Hierarchical Select Dialog Box</h5>' +
            '<div id="contentHolder"></div>',
        afterRendering: function () {
            oButton.placeAt("contentHolder");
        }
    });

    var app = new sap.m.App("myApp", {
        initialPage: "myFirstPage"
    });

    var page = new sap.m.Page("myFirstPage", {
        title: "Fiori - Hierarchical Select Dialog",
        showNavButton: true,
        enableScrolling: true,
        content: oHtml
    });
    app.addPage(page).placeAt("content");


///////////////
//Testing Part: HierarchyItem
///////////////
    var HIERARCHICAL_SELECT_DIALOG_ITEM_ID = "CA_VIEW_HIERARCHICALSELECTDIALOGITEM--HIERARCHICALSELECTDIALOGITEM";

    module("HierarchySelectDialogItem - Object Creation");

    test("Object Creation with Id", function () {
        var oHierarchicalSelectDialogItem = new sap.ca.ui.HierarchicalSelectDialogItem("id", {});
        strictEqual(oHierarchicalSelectDialogItem.getId(), "id", "HierarchicalSelectDialogItem has ID 'id'");
    });

    test("Object Creation from dom", function () {
        var oHierarchicalSelectDialogItem = sap.ui.getCore().byId(HIERARCHICAL_SELECT_DIALOG_ITEM_ID);
        strictEqual(oHierarchicalSelectDialogItem.getId(), HIERARCHICAL_SELECT_DIALOG_ITEM_ID, "HierarchicalSelectDialogItem has ID " + HIERARCHICAL_SELECT_DIALOG_ITEM_ID);
        strictEqual(oHierarchicalSelectDialogItem.getEntityName(), "myEntity", "HierarchicalSelectDialogItem should have 'myEntity' as entity name");
        strictEqual(oHierarchicalSelectDialogItem.getTitle(), "myTitle", "HierarchicalSelectDialogItem should have 'myTitle' as title");
    });
});
