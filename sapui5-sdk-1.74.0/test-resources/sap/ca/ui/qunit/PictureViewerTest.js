window.addEventListener("load", function () {
    // require dialog module
    jQuery.sap.require("sap.ca.ui.PictureViewer");

    // first test, picture with uri
    var oPictureViewer = new sap.ca.ui.PictureViewer({
        id: PICTURE_VIEWER_ITEM_ID + '1',
        width: "200px",
        height: "200px"
    });


    var oPictureViewer2 = new sap.ca.ui.PictureViewer({
        id: PICTURE_VIEWER_ITEM_ID + '2',
        width: "200px",
        height: "200px"
    });

    var oPictureViewerItem;
    for (var i = 2; i < 9; i++) {
        oPictureViewerItem = new sap.ca.ui.PictureViewerItem({
            src: myURIBase
        });
        oPictureViewer2.addItem(oPictureViewerItem);
    }

    var oHtml = new sap.ui.core.HTML({
        content: '<h1 id="qunit-header">Fiori Wave 2: Test Page for PictureViewer</h1><h2 id="qunit-banner"></h2><h2 id="qunit-userAgent"></h2><ol id="qunit-tests"></ol><div id="contentHolder"></div>',
        afterRendering: function () {
            oPictureViewer.placeAt("contentHolder");
            oPictureViewer2.placeAt("contentHolder")
        }
    });

    var app = new sap.m.App("myApp", {
        initialPage: "myFirstPage"
    });

    var page = new sap.m.Page("myFirstPage", {
        title: "Fiori - PictureViewer Test",
        showNavButton: true,
        enableScrolling: true,
        content: oHtml
    });
    app.addPage(page).placeAt("content");

    ///////////////
    //Testing Part: PictureViewer
    ///////////////
    var PICTURE_VIEWER_ITEM_ID = "CA_VIEW_PICTILE--PICTILE";
    var myURIBase = "../../../../sap/ca/ui/images/SAPUI_URI.png";

    function selectPicture(oPictureViewer, i) {
        oPictureViewer.selectPicture(i);
        var selectedIndexAfterRendering = oPictureViewer._selectedIndex;
        return selectedIndexAfterRendering;
    }

    test("addItem function", function () {
        var oPictureViewer = sap.ui.getCore().byId(PICTURE_VIEWER_ITEM_ID + '1');
        var oPictureViewerItem = new sap.ca.ui.PictureViewerItem({
            src: myURIBase
        });

        oPictureViewer.addItem(oPictureViewerItem);
        equal(oPictureViewer.getItems().length, 1, "1 image was added");
    });

    test("insertItem function", function () {
        var oPictureViewer = sap.ui.getCore().byId(PICTURE_VIEWER_ITEM_ID + '1');
        var nbPictures = oPictureViewer.getItems().length;
        var oPictureViewerItem = new sap.ca.ui.PictureViewerItem({
            src: myURIBase
        });

        oPictureViewer.insertItem(oPictureViewerItem, 0);
        equal(oPictureViewer.getItems().length - nbPictures, 1, "1 image was added");
    });

    test("deletePicture function", function () {
        var oPictureViewer = sap.ui.getCore().byId(PICTURE_VIEWER_ITEM_ID + '1');

        var nbPictures = oPictureViewer.getItems().length;
        oPictureViewer.deletePicture(0);

        equal(nbPictures - oPictureViewer.getItems().length, 1, "1 image was deleted");
    });

    test("editable property (should be always false)", function () {
        var oPictureViewer = sap.ui.getCore().byId(PICTURE_VIEWER_ITEM_ID + '1');

        var editable;
        oPictureViewer.setEditable(true);
        editable = oPictureViewer.getEditable();
        ok(editable === false, "editable is false");

        oPictureViewer.setEditable(false);
        editable = oPictureViewer.getEditable();
        ok(editable === false, "editable is false");
    });

    test("removable property", function () {
        var oPictureViewer = sap.ui.getCore().byId(PICTURE_VIEWER_ITEM_ID + '1');
        oPictureViewer.setRemovable(true);

        var removable = oPictureViewer.getRemovable();
        ok(removable === true, "removable is true");

        oPictureViewer.setRemovable(false);
        removable = oPictureViewer.getRemovable();
        ok(removable === false, "removable is false");
    });

    test("PictureDeleted event", function () {
        var oPictureViewer = sap.ui.getCore().byId(PICTURE_VIEWER_ITEM_ID + '2');
        oPictureViewer.setRemovable(true);
        oPictureViewer.rerender();
        var currentPictureIndex = oPictureViewer.getCurrentPictureIndex();
        var currentPictureTile = oPictureViewer.getTiles()[currentPictureIndex];

        var msg = "";
        oPictureViewer.attachPictureDeleted(function (oEvent) {

            oEvent.cancelBubble();
            oEvent.preventDefault();
            msg = "pressed";
        });

        oPictureViewer._bRendered = false;
        currentPictureTile._oDeletePictureButton.firePress();

        ok(msg == "pressed", "PictureDeleted event is ok");
    });

    test("selectPicture function - in range values", function () {
        var oPictureViewer = sap.ui.getCore().byId(PICTURE_VIEWER_ITEM_ID + '2');

        var currentPictureIndex;
        for (var i = 0; i < oPictureViewer.getTiles().length; i++) {
            currentPictureIndex = selectPicture(oPictureViewer, i);
            equal(currentPictureIndex, i, "image " + i.toString() + " is selected");
        }
    });

    test("selectPicture function - out of range values", function () {
        var oPictureViewer = sap.ui.getCore().byId(PICTURE_VIEWER_ITEM_ID + '2');

        var currentPictureIndex;
        currentPictureIndex = selectPicture(oPictureViewer, null);
        equal(currentPictureIndex, 0, "parameter value null, image 0 is selected");

        currentPictureIndex = selectPicture(oPictureViewer, undefined);
        equal(currentPictureIndex, 0, "parameter value undefined, image 0 is selected");

        currentPictureIndex = selectPicture(oPictureViewer, "toto");
        equal(currentPictureIndex, 0, "parameter value toto, image 0 is selected");

        currentPictureIndex = selectPicture(oPictureViewer, -50);
        equal(currentPictureIndex, 0, "parameter value -50 image 0 is selected");

        currentPictureIndex = selectPicture(oPictureViewer, oPictureViewer.getItems().length + 150);
        equal(currentPictureIndex, oPictureViewer.getTiles().length - 1, "parameter value maxValue + 150 last image is selected");
    });
});
