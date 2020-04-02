// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.GroupsHelper.
 */

sap.ui.require([
    "sap/ushell/components/GroupsHelper"
],function (oGroupsHelper) {
    "use strict";

    /*global module test jQuery sap  */

    var aGroups;

    module("sap.ushell.components.GroupsHelper", {
        setup: function () {
            aGroups = [
                {
                    id: "group_0",
                    groupId: "group 0",
                    title: "group_0",
                    isGroupVisible: true,
                    isRendered : false,
                    index: 0,
                    tiles: [],
                    pendingLinks : [],
                    links : []
                },
                {
                    id: "group_1",
                    groupId: "group_1",
                    title: "group_1",
                    isGroupVisible: true,
                    isRendered : false,
                    index: 1,
                    tiles: [],
                    pendingLinks : [],
                    links : []
                },
                {
                    id: "group_2",
                    groupId: "group_2",
                    title: "group_2",
                    isGroupVisible: true,
                    isRendered : false,
                    index: 2,
                    tiles: [],
                    pendingLinks : [],
                    links : []
                },
                {
                    id: "group_hidden",
                    groupId: "group_hidden",
                    title: "group_hidden",
                    isGroupVisible: false,
                    isRendered : false,
                    index: 3,
                    tiles: [],
                    pendingLinks : [],
                    links : []
                },
                {
                    id: "group_03",
                    groupId: "group_03",
                    title: "group_03",
                    isGroupVisible: true,
                    isRendered : false,
                    index: 4,
                    tiles: [],
                    pendingLinks : [],
                    links : []
                }
            ];
        },

        teardown: function () {
        }
    });

    [
        {
            description: "group was found",
            sGroupId: "group 0",
            expectedResult: 0
        },
        {
            description: "group was not found",
            sGroupId: "group not found",
            expectedResult: -1
        }
    ].forEach(function (oTestCase) {
        test("getIndexOfGroup: " + oTestCase.description, function (assert) {
            var iGroupIndex = oGroupsHelper.getIndexOfGroup(aGroups, oTestCase.sGroupId);
            assert.equal(iGroupIndex, oTestCase.expectedResult, "The expected index: " + oTestCase.expectedResult);
        });

    });

    [
        {
            description: "group was found",
            sGroupId: "group 0",
            expectedResult: "/groups/0"
        },
        {
            description: "group was not found",
            sGroupId: "group not found",
            expectedResult: null
        }
    ].forEach(function (oTestCase) {
        test("getModelPathOfGroup: " + oTestCase.description, function (assert) {
            var iGroupIndex = oGroupsHelper.getModelPathOfGroup(aGroups, oTestCase.sGroupId);
            assert.equal(iGroupIndex, oTestCase.expectedResult, "The expected index: " + oTestCase.expectedResult);
        });

    });

});