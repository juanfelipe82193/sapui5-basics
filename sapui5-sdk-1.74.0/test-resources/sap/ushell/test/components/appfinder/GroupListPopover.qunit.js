// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.appfinder.GroupListPopover
 */
(function () {
    "use strict";
    /* eslint-disable */ // TBD: make ESLint conform

    /*global asyncTest, equal, expect, module,
     ok, start, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    jQuery.sap.require("sap.ushell.services.Container");

    var oController;

    module("sap.ushell.components.appfinder.GroupListPopover", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(function () {
                oController = new sap.ui.controller("sap.ushell.components.appfinder.GroupListPopover");
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

    var testData = [
        {selected: true, initiallySelected: false},
        {selected: false, initiallySelected: true}
    ];

    var noop = function () {};

    test("okButtonHandler Test", function () {
        oController.oPopoverModel = new sap.ui.model.json.JSONModel({userGroupList: testData});
        var returnData,
            oPopover = {
            close: noop
        };
        var popupClose = sinon.spy(oPopover, "close"),
            oView = {
            oPopover: oPopover,
            deferred: {
                resolve: function (d) {
                    returnData = d;
                }
            }
        };
        oController.getView = function () {
            return oView;
        };
        oController.okButtonHandler(jQuery.Event("click"));

        assert.ok(returnData.addToGroups.length === 1);
        assert.ok(returnData.removeFromGroups.length === 1);
        assert.ok(returnData.newGroups.length === 0);
        assert.equal(popupClose.callCount, 1);

        oView.newGroupInput = {
            getValue: function () {
                return "group name";
            }
        };

        oController.okButtonHandler(jQuery.Event("click"));
        assert.ok(returnData.addToGroups.length === 1);
        assert.ok(returnData.removeFromGroups.length === 1);
        assert.ok(returnData.newGroups.length === 1);
    });

    //Test if click on displayListItem add and remove tile from group.
    test("groupListItemClickHandler Test", function () {
        oController.oPopoverModel = new sap.ui.model.json.JSONModel({userGroupList: testData});
        var getBindingContextPathResponse = "p",
            getModelResponse = "m",
            getSelectedResponse = true,
            obj={
            oSource:{
                setSelected: noop,
                getSelected: function(){
                    return getSelectedResponse;
                },
                getBindingContextPath:function(){
                    return getBindingContextPathResponse;
                },
                getModel:function(){
                    return getModelResponse;
                }
            }
        },
         AddRemoveTileFromGroupStub = sinon.stub(oController, "addRemoveTileFromGroup").returns({});
         oController.groupListItemClickHandler(obj);

         assert.equal(AddRemoveTileFromGroupStub.callCount, 1);
         assert.equal(AddRemoveTileFromGroupStub.args[0][0], getBindingContextPathResponse);
         assert.equal(AddRemoveTileFromGroupStub.args[0][1], getModelResponse);
         assert.equal(AddRemoveTileFromGroupStub.args[0][2], getSelectedResponse);


    });

    test("checkboxClickHandler Test", function () {
        oController.oPopoverModel = new sap.ui.model.json.JSONModel({userGroupList: testData});
        var oView = {
            getViewData: function () {
                return {
                    sourceContext : {
                        sPath : "NOTHING"
                    }
                }
            }
        },
            getModelResponse = "m",
            getPathResponse = "/userGroupList/0",
            getParameterResponse = true,
            data = {
                oSource:{
                    getModel:function(){
                        return getModelResponse;
                    }
                },
                getParameter: function(){
                    return getParameterResponse;
                },
                getPath:function(){
                    return getPathResponse;
            }
        };
        oController.getView = function () {
            return oView;
        };

        var getBeforeChangesStub = sinon.stub(oController, "getGroupsBeforeChanges").returns([
            "g1"
        ]),
            getAfterChangesStub = sinon.stub(oController, "getGroupsAfterChanges").returns([
            {
                selected : true,
                oGroup : {
                    object : {
                        id : "g1"
                    }
                }
            }, {
                selected : true,
                oGroup : {
                    object : {
                        id : "g2"
                    }
                }
            }
        ]),
            getServiceStub = sinon.stub(sap.ushell.Container, "getService").returns({
                isGroupLocked : function (oGroup) {
                    return false;
                },
                getGroupId : function (oGroup) {
                    return "g2";
                }
        }),
            popoverModel = {x : "p"},
        // Data of unchecked checkbox
            data = {
            oSource : {
                getModel : function () {
                    return "m";
                }},
            getParameter: function (sParamName) {
                    if (sParamName === "selected") {
                        return true;
                    }
                }
            },
        AddRemoveTileFromGroupStub = sinon.stub(oController, "addRemoveTileFromGroup").returns({});
        oController.checkboxClickHandler(data);

        assert.equal(AddRemoveTileFromGroupStub.callCount, 1);
        assert.equal(AddRemoveTileFromGroupStub.args[0][0], getPathResponse);
        assert.equal(AddRemoveTileFromGroupStub.args[0][1], getModelResponse);
        assert.equal(AddRemoveTileFromGroupStub.args[0][2], getParameterResponse);
        getServiceStub.restore();
        AddRemoveTileFromGroupStub.restore();
    });

    //Test if click on checkbox add and remove tile from group.
/*    test("checkboxClickHandler", function () {
      oController.oPopoverModel = new sap.ui.model.json.JSONModel({userGroupList: testData});
  });*/

    test("_closeButtonHandler Test", function () {
        oController.oPopoverModel = new sap.ui.model.json.JSONModel({userGroupList: testData});
        var oPopover = {
            close: noop
        };
        var popupClose = sinon.spy(oPopover, "close");
        var oDeferred = {
            reject: noop
        };
        var deferredReject = sinon.spy(oDeferred, "reject");
        var oView = {
            oPopover: oPopover,
            deferred: oDeferred
        };
        oController.getView = function () {
            return oView;
        };

        oController._closeButtonHandler(jQuery.Event("click"));
        assert.equal(popupClose.callCount, 1);
        assert.equal(deferredReject.callCount, 1);
    });

    test("_navigateToCreateNewGroupPane Test", function () {
        oController.oPopoverModel = new sap.ui.model.json.JSONModel({userGroupList: testData});
        var oPopover = {
            removeAllContent: noop,
            addContent: noop,
            setCustomHeader: noop,
            getEndButton: noop,
            getBeginButton: noop,
            setContentHeight: noop
        };
        var removeAllContent = sinon.spy(oPopover, "removeAllContent");
        var addContent = sinon.spy(oPopover, "addContent");
        var setCustomHeader = sinon.spy(oPopover, "setCustomHeader");
        var getEndButtonStub = sinon.stub(oPopover, "getEndButton").returns({
                setText : noop,
                setVisible: noop
        });
        var getBeginButtonStub = sinon.stub(oPopover, "getBeginButton").returns({
                setText : noop
        });
        var setContentHeight = sinon.spy(oPopover, "setContentHeight");
        var setFooterVisibility =  sinon.spy(oController, "_setFooterVisibility");
        var oView = {
            oPopover: oPopover,
            _createHeadBarForNewGroup: noop,
            _createNewGroupInput: noop,
            newGroupInput: {
                focus: noop
            },
            getViewData: function(){
                return {singleGroupSelection: true};
            }
        };
        oController.getView = function () {
            return oView;
        };

        oController._navigateToCreateNewGroupPane();
        assert.equal(removeAllContent.callCount, 1);
        assert.equal(addContent.callCount, 1);
        assert.equal(setCustomHeader.callCount, 1);
        assert.equal(setContentHeight.callCount, 1);
        assert.equal(getEndButtonStub.callCount, 2);
        assert.equal(getBeginButtonStub.callCount, 0);
        assert.equal(setFooterVisibility.callCount, 1);
        assert.equal(setFooterVisibility.args[0][0], true);

    });

    test("_afterCloseHandler Test", function () {
        oController.oPopoverModel = new sap.ui.model.json.JSONModel({userGroupList: testData});

        var oView = {
            oGroupsContainer: {
                destroy: noop
            },
            newGroupInput: {
                destroy: noop
            },
            oPopover: {
                destroy: noop
            },
            destroy: noop,
            getViewData: function () {
                return {
                	catalogModel : {
                		getProperty : function (sPropertyName) {
                			return [];
                		}
                    },
                    catalogController : {
                    	prepareDetailedMessage : function () {}
                    }
                };
            }
        };
        var removeAllContentDestroy = sinon.spy(oView.oGroupsContainer, "destroy");
        var newGroupInputDestroy = sinon.spy(oView.newGroupInput, "destroy");
        var oPopoverDestroy = sinon.spy(oView.oPopover, "destroy");
        var viewDestroy = sinon.spy(oView, "destroy");

        oController.getView = function () {
            return oView;
        };
        oController.setSelectedStart([]);
        oController._afterCloseHandler();
        assert.equal(removeAllContentDestroy.callCount, 1);
        assert.equal(newGroupInputDestroy.callCount, 1);
        assert.equal(oPopoverDestroy.callCount, 1);
        assert.equal(viewDestroy.callCount, 1);
    });

    test("_backButtonHandler Test", function () {
        oController.oPopoverModel = new sap.ui.model.json.JSONModel({userGroupList: testData});

        var oPopover = {
            removeAllContent: noop,
            setContentHeight: noop,
            setVerticalScrolling: noop,
            setHorizontalScrolling: noop,
            addContent: noop,
            getBeginButton: noop,
            setTitle: noop,
            setCustomHeader: noop
        };
        var removeAllContent = sinon.spy(oPopover, "removeAllContent");
        var setVerticalScrolling = sinon.spy(oPopover, "setVerticalScrolling");
        var setHorizontalScrolling = sinon.spy(oPopover, "setHorizontalScrolling");
        var addContent = sinon.spy(oPopover, "addContent");
        var getBeginButtonStub = sinon.stub(oPopover, "getBeginButton").returns({
                setText : noop
        });
        var setTitle = sinon.spy(oPopover, "setTitle");
        var setCustomHeader = sinon.spy(oPopover, "setCustomHeader");
        var setFooterVisibility =  sinon.spy(oController, "_setFooterVisibility");

        var oView = {
            oPopover: oPopover,
            newGroupInput: {
                setValue: noop
            },
            getViewData: function(){
                return {singleGroupSelection: true};
            }
        };

        var setValue = sinon.spy(oView.newGroupInput, "setValue");
        oController.getView = function () {
            return oView;
        };

        oController._backButtonHandler();
        assert.equal(removeAllContent.callCount, 1);
        assert.equal(setVerticalScrolling.callCount, 1);
        assert.equal(setHorizontalScrolling.callCount, 1);
        assert.equal(addContent.callCount, 1);
        assert.equal(setTitle.callCount, 1);
        assert.equal(setCustomHeader.callCount, 1);
        assert.equal(setValue.callCount, 1);
        assert.equal(setFooterVisibility.callCount, 1);
        assert.equal(setFooterVisibility.args[0][0], false);

    });
}());
