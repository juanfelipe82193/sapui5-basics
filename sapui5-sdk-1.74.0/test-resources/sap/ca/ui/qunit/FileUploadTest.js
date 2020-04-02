window.addEventListener("load", function () {
    ///////////////
    //Testing Part: File Upload
    ///////////////
    module("File Upload");

    jQuery.sap.registerModulePath("fileupload", "fileupload");
    jQuery.sap.require("sap.ui.layout.HorizontalLayout");
    jQuery.sap.require("sap.ca.ui.FileUpload");

    var oView = sap.ui.xmlview("FileUploadTest", "fileupload.FileUploadTest");
    var oController = oView.getController();
    var oFileUpload = oController.byId("fileupload");
    oFileUpload.onAfterRendering = function () {
    };

    var oHtml = new sap.ui.core.HTML(
        {
            content: '<div id="contentHolder"></div><h1 id="qunit-header">Fiori Wave 2: Test Page for File Upload</h1><h2 id="qunit-banner"></h2><h2 id="qunit-userAgent"></h2><ol id="qunit-tests"></ol>',
            afterRendering: function () {
                oView.placeAt("contentHolder");
            }
        });

    var page = new sap.m.Page("myFirstPage", {
        title: "Fiori - File Upload",
        showNavButton: true,
        enableScrolling: true,
        content: oHtml
    });

    var app = new sap.m.App("myApp", {
        initialPage: "myFirstPage"
    });

    app.addPage(page).placeAt("content");

    test("Setting Contributor", function () {
        oFileUpload.setContributor("User1");
        equal(oFileUpload.getContributor(), "User1", "Setting initial contributor");
        oFileUpload.setContributor("User1");
        equal(oFileUpload.getContributor(), "User1", "Setting same contributor contributor");
        oFileUpload.setContributor("User3");
        equal(oFileUpload.getContributor(), "User3", "Setting new contributor");
    });

    test("uploadEnabled undefined", function () {
        equal(false, oFileUpload._oAddButton.getVisible(), "undefined uploadEnabled, default is false");
    });

    test("uploadEnabled false", function () {
        var oFF = oController.byId("fuue_false");
        equal(false, oFF._oAddButton.getVisible(), "uploadEnabled false");
    });

    test("uploadEnabled true", function () {
        var oFT = oController.byId("fuue_true");
        equal(true, oFT._oAddButton.getVisible(), "uploadEnabled true");
    });

    test("setModel - BCP 002075129500004678982018", function () {
        var mockData1 = {
            Attachments: [{
                name: 'selected file.xls',
                url: 'http://localhost/test',
                size: '912 KB',
                uploadedDate: 'Jan 1, 2013',
                contributor: 'You'
            }, {
                name: 'word_document_01.doc',
                size: '912 KB',
                url: 'http://localhost/test',
                uploadedDate: 'Jan 1, 2013',
                contributor: 'You'
            }]
        };
        var mockData2 = {
            Attachments: [{
                name: 'picture.jpg',
                size: '23 KB',
                url: 'http://localhost/test',
                uploadedDate: 'Jan 1, 2013',
                contributor: 'You'
            }, {
                name: 'powerpoint_document.ppt',
                size: '1.23 MB',
                url: 'http://localhost/test',
                uploadedDate: 'Jan 8, 2013',
                contributor: 'You'
            }, {
                name: 'excel_file.xls',
                size: '2.41 MB',
                url: 'http://localhost/test',
                uploadedDate: 'Jan 9, 2013',
                contributor: 'Alex Manchewski'
            }]
        };
 
        var mockDataModel1 = new sap.ui.model.json.JSONModel(mockData1);
        var mockDataModel2 = new sap.ui.model.json.JSONModel(mockData2);
        var oFU = new sap.ca.ui.FileUpload({
            id: "idFileUpload",
            items: "/Attachments",
            editMode: true,
            uploadEnabled: true,
            fileName: "name",
           size: "size",
            url: "url",
            uploadedDate: "uploadedDate",
            contributor: "contributor",
            mimeType: "mimeType",
            fileId: "fileId"
        });
 
        oFU.setModel(mockDataModel1);
        deepEqual(oFU.getModel(), mockDataModel1);
 
        oFU.setModel(mockDataModel2);
        deepEqual(oFU.getModel(), mockDataModel2);
    });
});
