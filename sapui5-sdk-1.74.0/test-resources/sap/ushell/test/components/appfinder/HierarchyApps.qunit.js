// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.appfinder.HierarchyApps
 */
sap.ui.require([
    "sap/ushell/resources",
    "sap/ushell/shells/demo/fioriDemoConfig",
    "sap/ushell/services/Container",
    "sap/ui/thirdparty/hasher",
    "sap/m/Button",
    "sap/ushell/components/HomepageManager",
    "sap/ushell/components/CatalogsManager"
], function () {
    "use strict";
    /* eslint-disable */ // TBD: make ESLint conform
    /*global asyncTest, equal, expect, module,
     ok, start, stop, test,
     jQuery, sap, sinon */
    var oController;

    module("sap.ushell.components.appfinder.HierarchyApps", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(function () {
                oController = new sap.ui.controller("sap.ushell.components.appfinder.HierarchyApps");

                jQuery.sap.flpmeasure = {
                    end: function () {},
                    start: function () {}
                };
                start();
            });
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            delete sap.ushell.Container;
            oController.destroy();
        }
    });

    var testData = {
        id: "someSystem",
        text: "someSystem",
        level: 0,
        folders: [
            {
                id: "id1",
                text: "text1",
                level: 1,
                folders: [
                    {
                        id: "id11",
                        text: "text11",
                        level: 2,
                        folders: [
                            {
                                id: "id111",
                                text: "text111",
                                level: 3,
                                folders: undefined,
                                apps: undefined
                            }

                        ],
                        apps: []
                    },
                    {
                        id: "id12",
                        text: "text12",
                        level: 2,
                        folders: [
                            {
                                id: "id121",
                                text: "text121",
                                level: 3,
                                folders: undefined,
                                apps: undefined
                            },
                            {
                                id: "id122",
                                text: "text122",
                                level: 3,
                                folders: undefined,
                                apps: undefined
                            }
                        ],
                        apps: []
                    }
                ],
                apps: []
            },
            {
                id: "id2",
                text: "text2",
                level: 1,
                folders: [
                    {
                        id: "id21",
                        text: "text21",
                        level: 2,
                        folders: [],
                        apps: []
                    },
                    {
                        id: "id22",
                        text: "text22",
                        level: 2,
                        folders: [
                            {
                                id: "id221",
                                text: "text221",
                                level: 3,
                                folders: undefined,
                                apps: undefined
                            },
                            {
                                id: "id222",
                                text: "text222",
                                level: 3,
                                folders: undefined,
                                apps: undefined
                            }

                        ],
                        apps: [
                            {
                                id: "id223",
                                text: "text223",
                                level: 3,
                                url: "#someIntent?sap-system=LOCAL"
                            }

                        ]
                    }
                ],
                apps: [
                    {
                        id: "id23",
                        text: "text23",
                        level: 2,
                        url: "#someIntent?sap-system=LOCAL"
                    }
                ]
            }

        ],
        apps: [
            {
                id: "id3",
                text: "text3",
                level: 1,
                url: "#someIntent?sap-system=LOCAL"
            }
        ]
    };

    //TODO add init test;

    test("getCrumbsData - with path = \"\" should return []", function () {
        var returnValue = oController.getCrumbsData("",{});
        assert.deepEqual(returnValue,[]);
    });

    test("getCrumbsData - first level", function () {
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData(testData);

        var returnValue = oController.getCrumbsData("/folders/1",oModel);
        assert.deepEqual(returnValue,[{path: "", text:"someSystem"}]);
    });

    test("getCrumbsData - second level", function () {
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData(testData);

        var returnValue = oController.getCrumbsData("/folders/0/folders/1",oModel);
        assert.deepEqual(returnValue,[{path: "", text:"someSystem"},{path: "/folders/0", text: "text1"}]);
    });

    test("getCrumbsData - third level", function () {
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData(testData);

        var returnValue = oController.getCrumbsData("/folders/0/folders/1/folders/1",oModel);
        assert.deepEqual(returnValue,[{path: "", text:"someSystem"},{path: "/folders/0", text: "text1"},{path: "/folders/0/folders/1", text: "text12"}]);
    });

    test("updatePageBindings - first level", function () {
        var oView =  {
            layout : {
                bindAggregation : function(sAggrigation,oBind) {
                    return;
                }
            },
            breadcrumbs : {
                bindProperty : function(sProperty,oBind) {
                    return;
                }
            },
            crumbsModel : new sap.ui.model.json.JSONModel({crumbs:[]}),
            oItemTemplate : {id: "test"},
            getModel: function() {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(testData);
                return oModel;

            },
            updateResultSetMessage: function () {
                return;
            }
        };

        sinon.stub(oController,"getView", function(){return oView;});

        var spyBindAggregation = sinon.spy(oController.getView().layout,"bindAggregation");
        var spyBindProperty = sinon.spy(oController.getView().breadcrumbs,"bindProperty");
        var spyUpdateResultSetMessage = sinon.spy(oController.getView(),"updateResultSetMessage");


        oController.updatePageBindings("/folders/1");

        assert.ok(spyBindAggregation.calledOnce);
        assert.ok(spyBindAggregation.calledWith("items","easyAccess>/folders/1/apps",{id: "test"}));
        assert.ok(spyBindProperty.calledOnce);
        assert.ok(spyBindProperty.calledWith("currentLocationText","easyAccess>/folders/1/text"));

        assert.ok(spyUpdateResultSetMessage.calledOnce);
        assert.ok(spyUpdateResultSetMessage.calledWith(1,false));

        oView.layout.bindAggregation.restore();
        oView.breadcrumbs.bindProperty.restore();
    });

    test("onAppBoxPressed", function () {

        // prepare mock data
        var sMockUrl = "#Shell-startTransaction?sap-system=U1YCLNT120&sap-ui2-tcode=PFCG";
        var oMockEvent = {
            getSource: function () {
                return {
                    getProperty: function (sKey) {
                        if (sKey === "url") {
                            return sMockUrl;
                        }
                    }
                };
            },
            mParameters: {
                srcControl: new sap.m.Button()
            }
        };

        // match the default prependHash defined in the ShellNavigation service
        hasher.prependHash = "";

        // call function under test
        oController.onAppBoxPressed(oMockEvent);

        // assert
        assert.equal(window.location.hash, sMockUrl, "hash changed");

    });

    test("_handleSuccessMessage with one group", function () {

        // prepare mock data
        var oMockApp = {text: "appText"};
        var oMockAddToGroups = {
            addToGroups : [{title: "groupTitle"}]
        };

        // call function under test
        var message = oController._handleSuccessMessage(oMockApp, oMockAddToGroups);

        // assert
        assert.equal(message, "App \"appText\" was added to group \"groupTitle\"");
    });

    test("_handleSuccessMessage with 2 groups", function () {

        // prepare mock data
        var oMockApp = {text: "appText"};
        var oMockAddToGroups = {
            addToGroups: [
                {title: "firstGroupTitle"},
                {title: "secondGroupTitle"}
            ]
        };

        // call function under test
        var message = oController._handleSuccessMessage(oMockApp, oMockAddToGroups);

        // assert
        assert.equal(message, "App \"appText\" was added to 2 groups");
    });


    test("_prepareErrorMessage", function () {
        var appTitle = "appTitle";

        // (1) - one group, add to a new group failed
        var errorActions = [
            { action: "addBookmark_ToNewGroup", group: "newGroupTitle"}
        ];
        var message = oController._prepareErrorMessage(errorActions, appTitle);
        assert.equal(sap.ushell.resources.i18n.getText(message.messageId, message.parameters), 'App \"appTitle\" could not be added to group \"newGroupTitle\"');


        // (2) - one group - create new group failed
        errorActions = [
            { action: "addBookmark_NewGroupCreation", group: "newGroupTitle"}
        ];
        message = oController._prepareErrorMessage(errorActions, appTitle);
        assert.equal(sap.ushell.resources.i18n.getText(message.messageId, message.parameters), 'New group could not be created');


        // (3) - one group - create new group failed
        errorActions = [
            { action: "addBookmark_ToExistingGroup", group: { title : "existingGroupTitle"}}
        ];
        message = oController._prepareErrorMessage(errorActions, appTitle);
        assert.equal(sap.ushell.resources.i18n.getText(message.messageId, message.parameters), 'App \"appTitle\" could not be added to group \"existingGroupTitle\"');


        // (4) - two groups - add to existing groups
        errorActions = [
            { action: "addBookmark_ToExistingGroup", group: { title : "existingGroupTitle"}},
            { action: "addBookmark_ToExistingGroup", group: { title : "existingGroupTitle2"}}
        ];
        message = oController._prepareErrorMessage(errorActions, appTitle);
        assert.equal(sap.ushell.resources.i18n.getText(message.messageId, message.parameters), 'App \"appTitle\" could not be added to multiple groups');


        // (5) - two groups - add to one existing group and one new group
        errorActions = [
            { action: "addBookmark_ToExistingGroup", group: { title : "existingGroupTitle"}},
            { action: "addBookmark_ToNewGroup", group: "newGroupTitle"}
        ];
        message = oController._prepareErrorMessage(errorActions, appTitle);
        assert.equal(sap.ushell.resources.i18n.getText(message.messageId, message.parameters), 'App \"appTitle\" could not be added to multiple groups');


        // (6) - three groups - add to 2 existing groups, and one new group creation failed
        errorActions = [
            { action: "addBookmark_ToExistingGroup", group: { title : "existingGroupTitle1"}},
            { action: "addBookmark_ToExistingGroup", group: { title : "existingGroupTitle2"}},
            { action: "addBookmark_NewGroupCreation", group: "newGroupTitle"}
        ];
        message = oController._prepareErrorMessage(errorActions, appTitle);
        assert.equal(sap.ushell.resources.i18n.getText(message.messageId, message.parameters), 'Could not complete all your actions');
    });

    test("_handleBookmarkAppPopoverResponse - success flow", function () {

        // prepare mock data
        var oMockApp = {text: "appText", url: "appUrl"};
        var oMockPopoverResponse = {
            newGroups: ["group1", "group2"],
            addToGroups: []
        };

        /*
         bResolveCreateGroup - true - meaning stub of createNewGroup will RESOLVE the promise
         bResolveAddBookmark - true - meaning stub of addBookmark will RESOLVE the promise
         bExpectedSuccess    - true - meaning we expect the test to be a success-test, we expect success handling to be triggered
         */
        _testHandleBookmarkAppPopoverResponse(oMockApp,oMockPopoverResponse, true,true,true);
    });

    test("_handleBookmarkAppPopoverResponse - Error flow", function () {

        // prepare mock data
        var oMockApp = {text: "appText", url: "appUrl"};
        var oMockPopoverResponse = {
            newGroups: ["group1", "group2"],
            addToGroups: []
        };

        /*
            bResolveCreateGroup - false - meaning stub of createNewGroup will REJECT the promise
            bResolveAddBookmark - false - meaning stub of addBookmark will REJECT the promise
            bExpectedSuccess    - false - meaning we expect the test to be an error-test, we expect error handling to be triggered
         */
        _testHandleBookmarkAppPopoverResponse(oMockApp,oMockPopoverResponse, false,false,false);

        /*
         bResolveCreateGroup - false - meaning stub of createNewGroup will REJECT the promise
         bResolveAddBookmark - true - meaning stub of addBookmark will RESOLVE the promise
         bExpectedSuccess    - false - meaning we expect the test to be an error-test, we expect error handling to be triggered
         */
        _testHandleBookmarkAppPopoverResponse(oMockApp,oMockPopoverResponse, false,true,false);

        /*
         bResolveCreateGroup - true - meaning stub of createNewGroup will RESOLVE the promise
         bResolveAddBookmark - false - meaning stub of addBookmark will REJECT the promise
         bExpectedSuccess    - false - meaning we expect the test to be an error-test, we expect error handling to be triggered
         */
        _testHandleBookmarkAppPopoverResponse(oMockApp,oMockPopoverResponse, true,false,false);
    });

    /*
        this method does the actual test of handling the add-bookmark popover response
     */
    function _testHandleBookmarkAppPopoverResponse (oMockApp, oMockPopoverResponse, bResolveCreateGroup, bResolveAddBookmark, bExpectedSuccess) {

        var fCreateGroupStub, oAddBookmarkStub, _handleSuccessMessageSpy, _prepareErrorMessageSpy, message;
        new sap.ushell.components.HomepageManager("homepageMgr", {model: new sap.ui.model.json.JSONModel({groups: []})});
        var oCatalogsManager = new sap.ushell.components.CatalogsManager("catalogsMgr", {model: new sap.ui.model.json.JSONModel({groups: []})});

        oController._updateAppBoxedWithPinStatuses = function(){};

        // (1) - both promises are rejected
        _handleSuccessMessageSpy = sinon.spy(oController, "_handleSuccessMessage");
        _prepareErrorMessageSpy = sinon.spy(oController, "_prepareErrorMessage");

        // create new group stub
        fCreateGroupStub = sinon.stub(oCatalogsManager, "createGroup", function() {
            var deferred = jQuery.Deferred();

            // if should resolve the create group promise
            if (bResolveCreateGroup) {
                deferred.resolve({getObject: function () {return {object: "oGroup"}}});
            } else {
                deferred.reject({getObject: function () {return {object: "oGroup"}}});
            }

            return deferred.promise();
        });

        // add bookmark stub
        oAddBookmarkStub = sinon.stub(sap.ushell.Container.getService("Bookmark"), "addBookmark", function(oMockApp) {
            var deferred = jQuery.Deferred();

            // if should resolve the add bookmark
            if (bResolveAddBookmark) {
                deferred.resolve({url: oMockApp.url, title: oMockApp.text});
            } else {
                deferred.reject({url: oMockApp.url, title: oMockApp.text});
            }

            return deferred.promise();
        });

        // call to the method under test
        message = oController._handleBookmarkAppPopoverResponse(oMockApp, oMockPopoverResponse);

        // if expected test result is success
        if (bExpectedSuccess) {
            ok(_handleSuccessMessageSpy.calledOnce);
            ok(_prepareErrorMessageSpy.callCount === 0);
        } else {
            ok(_prepareErrorMessageSpy.calledOnce);
            ok(_handleSuccessMessageSpy.callCount === 0);
        }

        // restore all stubs/spies
        oAddBookmarkStub.restore();
        fCreateGroupStub.restore();
        _handleSuccessMessageSpy.restore();
        _prepareErrorMessageSpy.restore();
    };

    test("showSaveAppPopover with context of some dashboard group", function () {

        // prepare mock data
        var testData = {
            groupContext: {
                path: "/groupContextPath"
            },
            groupContextPath: {
                text: "oGroupContext"
            }
        };
        var oView =  {
            getModel: function() {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(testData);
                return oModel;
            }
        };
        sinon.stub(oController,"getView", function(){return oView;});

        var event = {
            oSource: {
                getParent: function() {
                    return {
                        getBinding: function() {
                            return {
                                getContext: function() {
                                    return {
                                        getObject: function() {
                                            return {text: "appObject"};
                                        }
                                    };
                                }
                            };
                        }
                    };
                }
            }
        };

        var oApp = {text: "appObject"};
        var customResponse = {
            newGroups: [],
            addToGroups: [{text: "oGroupContext"}]
        };

        var _handleBookmarkAppPopoverResponseStub = sinon.stub(oController,"_handleBookmarkAppPopoverResponse", function(app, customResponse){});

        // call function under test
        oController.showSaveAppPopover(event);

        // assert
        ok(_handleBookmarkAppPopoverResponseStub.calledOnce, "_handleBookmarkAppPopoverResponse called once");
        ok(_handleBookmarkAppPopoverResponseStub.calledWith(oApp, customResponse), "_handleBookmarkAppPopoverResponse called with the correct arguments");

        _handleBookmarkAppPopoverResponseStub.restore()
    });

    test("showMoreResultsTextFormatter with apps and total", function () {
        oController.translationBundle = sap.ushell.resources.i18n;
        var result = oController.showMoreResultsTextFormatter([1,2,3],10);
        assert.equal(result,"Show more (3 of 10)")
    });

    test("showMoreResultsVisibilityFormatter", function () {
        assert.equal(oController.showMoreResultsVisibilityFormatter([1,2,3],3),false);
        assert.equal(oController.showMoreResultsVisibilityFormatter([1,2,3],10),true);
        assert.equal(oController.showMoreResultsVisibilityFormatter(),false);
        assert.equal(oController.showMoreResultsVisibilityFormatter([],10),true);
    });
});