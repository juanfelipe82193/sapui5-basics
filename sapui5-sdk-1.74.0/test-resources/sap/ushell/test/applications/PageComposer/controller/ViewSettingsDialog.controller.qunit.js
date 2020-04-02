// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.require([
    "sap/ushell/applications/PageComposer/controller/ViewSettingsDialog.controller"
], function (ViewSettingsDialogController) {
    "use strict";

    /* global QUnit sinon */

    QUnit.module("handleDialogConfirm", {
        beforeEach: function () {
            this.fnApplyCombinedFiltersStub = sinon.stub();
            this.fnSortStub = sinon.stub();
            this.fnSetVisibleStub = sinon.stub();
            this.fnSetDateValueStub = sinon.stub();
            this.fnSetSecondDateValueStub = sinon.stub();

            this.oPageOverviewController = {
                _applyCombinedFilters: this.fnApplyCombinedFiltersStub,
                byId: function (sId) {
                    switch (sId) {
                        case "table":
                            return {
                                getBinding: function () {
                                    return {
                                        sort: this.fnSortStub
                                    };
                                }.bind(this)
                            };
                        case "infoFilterBar":
                            return {
                                setVisible: this.fnSetVisibleStub
                            };
                        case "infoFilterLabel":
                            return {
                                setText: function () {}
                            };
                        default:
                            return undefined;
                    }
                }.bind(this),
                getResourceBundle: function () {
                    return {
                        getText: function (sText) {
                            return sText;
                        }
                    };
                }
            };

            this.oController = new ViewSettingsDialogController(this.oPageOverviewController);
        }
    });

    [
        {
            testDescription: "no sorter, no filters and no group selected",
            mParameters: {
                filterItems: []
            },
            aExpectedSorters: [
                {
                    sPath: "content/modifiedOn",
                    bDescending: true
                }
            ],
            aExpectedViewSettingsFilter: []
        },
        {
            testDescription: "createdBy descending sorter, no filters and no group selected",
            mParameters: {
                sortItem: {
                    getKey: function () {
                        return "content/createdBy";
                    }
                },
                sortDescending: true,
                filterItems: []
            },
            aExpectedSorters: [
                {
                    sPath: "content/createdBy",
                    bDescending: true
                }
            ],
            aExpectedViewSettingsFilter: []
        },
        {
            testDescription: "createdBy ascending sorter, no filters and package descending group selected",
            mParameters: {
                sortItem: {
                    getKey: function () {
                        return "content/createdBy";
                    }
                },
                sortDescending: false,
                filterItems: [],
                groupItem: {
                    getKey: function () {
                        return "metadata/devclass";
                    }
                },
                groupDescending: true
            },
            aExpectedSorters: [
                {
                    sPath: "metadata/devclass",
                    bDescending: true
                },
                {
                    sPath: "content/createdBy",
                    bDescending: false
                }
            ],
            aExpectedViewSettingsFilter: []
        },
        {
            testDescription: "no sorter, no filters and editAllowed group selected",
            mParameters: {
                filterItems: [],
                groupItem: {
                    getKey: function () {
                        return "content/editAllowed";
                    }
                },
                groupDescending: false
            },
            aExpectedSorters: [
                {
                    sPath: "content/editAllowed",
                    bDescending: false
                },
                {
                    sPath: "content/modifiedOn",
                    bDescending: true
                }
            ],
            aExpectedViewSettingsFilter: []
        },
        {
            testDescription: "no sorter, a editAllowed = true filter and no group selected",
            mParameters: {
                filterItems: [
                    {
                        getKey: function () {
                            return "content/editAllowed___EQ___true";
                        }
                    }
                ]
            },
            aExpectedSorters: [
                {
                    sPath: "content/modifiedOn",
                    bDescending: true
                }
            ],
            aExpectedViewSettingsFilter: [
                {
                    sPath: "content/editAllowed",
                    sOperator: "EQ",
                    oValue1: true
                }
            ]
        },
        {
            testDescription: "no sorter, editAllowed = false filter and a package = $TMP filter and no group selected",
            mParameters: {
                filterItems: [
                    {
                        getKey: function () {
                            return "metadata/devclass___EQ___$TMP";
                        }
                    },
                    {
                        getKey: function () {
                            return "content/editAllowed___EQ___false";
                        }
                    }
                ]
            },
            aExpectedSorters: [
                {
                    sPath: "content/modifiedOn",
                    bDescending: true
                }
            ],
            aExpectedViewSettingsFilter: [
                {
                    sPath: "metadata/devclass",
                    sOperator: "EQ",
                    oValue1: "$TMP"
                },
                {
                    sPath: "content/editAllowed",
                    sOperator: "EQ",
                    oValue1: false
                }
            ]
        },
        {
            testDescription: "no sorter, both custom filter and modifiedOn group selected",
            mParameters: {
                filterItems: [
                    {
                        getKey: function () {
                            return "content/createdOn";
                        },
                        getCustomControl: function () {
                            return {
                                getDateValue: function () {},
                                getSecondDateValue: function () {}
                            };
                        }
                    },
                    {
                        getKey: function () {
                            return "content/modifiedOn";
                        },
                        getCustomControl: function () {
                            return {
                                getDateValue: function () {},
                                getSecondDateValue: function () {}
                            };
                        }
                    }
                ],
                groupItem: {
                    getKey: function () {
                        return "content/modifiedOn";
                    }
                },
                groupDescending: false
            },
            aExpectedSorters: [
                {
                    sPath: "content/modifiedOn",
                    bDescending: false
                },
                {
                    sPath: "content/modifiedOn",
                    bDescending: true
                }
            ],
            aExpectedViewSettingsFilter: [
                {
                    sPath: "content/createdOn",
                    sOperator: "BT",
                    oValue1: undefined,
                    oValue2: undefined
                },
                {
                    sPath: "content/modifiedOn",
                    sOperator: "BT",
                    oValue1: undefined,
                    oValue2: undefined
                }
            ]
        }
    ].forEach(function (oFixture) {
        QUnit.test(oFixture.testDescription, function (assert) {
            // Arrange
            var oEvent = {
                getParameters: function () {
                    return oFixture.mParameters;
                }
            };

            // Action
            this.oController.handleDialogConfirm(oEvent);

            // Assert
            assert.strictEqual(this.fnSortStub.callCount, 1, "Sorting was performed on the binding exactly one time.");
            assert.strictEqual(this.fnApplyCombinedFiltersStub.callCount, 1, "Filtering was performed on the binding exactly one time.");
            assert.strictEqual(this.fnSetVisibleStub.callCount, 1, "Infobar was updated exactly one time.");

            assert.strictEqual(
                this.fnSetVisibleStub.getCall(0).args[0],
                !!oFixture.aExpectedViewSettingsFilter.length,
                "Infobar is correctly set to visible / not visible."
            );

            var aSorters = this.fnSortStub.getCall(0).args[0],
                aFilters = this.oPageOverviewController.aViewSettingsFilters;

            assert.strictEqual(aSorters.length, oFixture.aExpectedSorters.length, "Correct amount of Sorters.");
            oFixture.aExpectedSorters.forEach(function (oSorterProperties, index) {
                var oSorter = aSorters[index];
                assert.deepEqual(
                    oSorter.sPath,
                    oSorterProperties.sPath,
                    "Sorter " + (index + 1) + " has correct sPath property."
                );
                assert.deepEqual(
                    oSorter.bDescending,
                    oSorterProperties.bDescending,
                    "Sorter " + (index + 1) + " has correct bDescending property."
                );
            });
            assert.strictEqual(aFilters.length, oFixture.aExpectedViewSettingsFilter.length, "Correct amount of Filters.");
            oFixture.aExpectedViewSettingsFilter.forEach(function (oFilterProperties, index) {
                var oFilter = aFilters[index];
                assert.deepEqual(
                    oFilter.sPath,
                    oFilterProperties.sPath,
                    "Filter " + (index + 1) + " has correct sPath property."
                );
                assert.deepEqual(
                    oFilter.sOperator,
                    oFilterProperties.sOperator,
                    "Filter " + (index + 1) + " has correct sOperator property."
                );
                assert.deepEqual(
                    oFilter.oValue1,
                    oFilterProperties.oValue1,
                    "Filter " + (index + 1) + " has correct oValue1 property."
                );
                assert.deepEqual(
                    oFilter.oValue2,
                    oFilterProperties.oValue2,
                    "Filter " + (index + 1) + " has correct oValue2 property."
                );
            });
        });
    });

    QUnit.module("handleDateRangeSelectionChanged", {
        beforeEach: function () {
            this.fnSetFilterCountStub = sinon.stub();
            this.fnSetSelectedStub = sinon.stub();
            this.fnGetCoreStub = sinon.stub(sap.ui, "getCore").returns({
                byId: function () {
                    return {
                        setFilterCount: this.fnSetFilterCountStub,
                        setSelected: this.fnSetSelectedStub
                    };
                }.bind(this)
            });
            this.oController = new ViewSettingsDialogController(this.oPageOverviewController);
        },
        afterEach: function () {
            this.fnGetCoreStub.restore();
        }
    });

    QUnit.test("Data range is empty", function (assert) {
        // Arrange
        var oEvent = {
            getParameters: function () {
                return {
                    id: "CreatedOnDateRangeSelection",
                    from: ""
                };
            }
        };

        // Action
        this.oController.handleDateRangeSelectionChanged(oEvent);

        // Assert
        assert.strictEqual(this.fnSetFilterCountStub.getCall(0).args[0], 0, "The filter count removed correctly.");
        assert.strictEqual(this.fnSetSelectedStub.getCall(0).args[0], false, "The filter was set to deselected.");
    });

    QUnit.test("Data range is set", function (assert) {
        // Arrange
        var oEvent = {
            getParameters: function () {
                return {
                    id: "CreatedOnDateRangeSelection",
                    from: "19.12.2019"
                };
            }
        };

        // Action
        this.oController.handleDateRangeSelectionChanged(oEvent);

        // Assert
        assert.strictEqual(this.fnSetFilterCountStub.getCall(0).args[0], 1, "The filter count was set correctly.");
        assert.strictEqual(this.fnSetSelectedStub.getCall(0).args[0], true, "The filter was set to selected.");
    });

    QUnit.module("handleCancel", {
        beforeEach: function () {
            this.fnSetFilterCountStub = sinon.stub();
            this.fnSetSelectedStub = sinon.stub();
            this.fnSetFilterCountStub2 = sinon.stub();
            this.fnSetSelectedStub2 = sinon.stub();
            this.fnSetDateValueStub = sinon.stub();
            this.fnSetSecondDateValueStub = sinon.stub();
            this.fnSetDateValueStub2 = sinon.stub();
            this.fnSetSecondDateValueStub2 = sinon.stub();
            this.fnGetCoreStub = sinon.stub(sap.ui, "getCore").returns({
                byId: function (sId) {
                    switch (sId) {
                        case "CreatedOnFilter":
                            return {
                                setFilterCount: this.fnSetFilterCountStub,
                                setSelected: this.fnSetSelectedStub
                            };
                        case "ChangedOnFilter":
                            return {
                                setFilterCount: this.fnSetFilterCountStub2,
                                setSelected: this.fnSetSelectedStub2
                            };
                        case "CreatedOnDateRangeSelection":
                            return {
                                setDateValue: this.fnSetDateValueStub,
                                setSecondDateValue: this.fnSetSecondDateValueStub
                            };
                        case "ChangedOnDateRangeSelection":
                            return {
                                setDateValue: this.fnSetDateValueStub2,
                                setSecondDateValue: this.fnSetSecondDateValueStub2
                            };
                        default:
                            return undefined;
                    }
                }.bind(this)
            });
            this.oController = new ViewSettingsDialogController(this.oPageOverviewController);
        },
        afterEach: function () {
            this.fnGetCoreStub.restore();
        }
    });

    QUnit.test("Both date ranges are empty", function (assert) {
        // Arrange
        this.oController._createdOnFromFilter = undefined;
        this.oController._createdOnToFilter = undefined;
        this.oController._changedOnFromFilter = undefined;
        this.oController._changedOnToFilter = undefined;

        // Action
        this.oController.handleCancel();

        // Assert
        assert.strictEqual(this.fnSetFilterCountStub.getCall(0).args[0], 0, "The createdOn filter count was removed correctly.");
        assert.strictEqual(this.fnSetSelectedStub.getCall(0).args[0], false, "The createdOn filter was set to deselected.");
        assert.strictEqual(this.fnSetDateValueStub.getCall(0).args[0], undefined, "The createdOn filter count was removed correctly.");
        assert.strictEqual(this.fnSetSecondDateValueStub.getCall(0).args[0], undefined, "The createdOn filter was set to deselected.");

        assert.strictEqual(this.fnSetFilterCountStub2.getCall(0).args[0], 0, "The changedOn filter count was removed correctly.");
        assert.strictEqual(this.fnSetSelectedStub2.getCall(0).args[0], false, "The changedOn filter was set to deselected.");
        assert.strictEqual(this.fnSetDateValueStub2.getCall(0).args[0], undefined, "The changedOn filter count was removed correctly.");
        assert.strictEqual(this.fnSetSecondDateValueStub2.getCall(0).args[0], undefined, "The changedOn filter was set to deselected.");
    });

    QUnit.test("createdOn date range is given, the changedOn is empty", function (assert) {
        // Arrange
        this.oController._createdOnFromFilter = "1.1.2020";
        this.oController._createdOnToFilter = "1.2.2020";
        this.oController._changedOnFromFilter = undefined;
        this.oController._changedOnToFilter = undefined;

        // Action
        this.oController.handleCancel();

        // Assert
        assert.strictEqual(this.fnSetFilterCountStub.getCall(0).args[0], 1, "The createdOn filter count was set correctly.");
        assert.strictEqual(this.fnSetSelectedStub.getCall(0).args[0], true, "The createdOn filter was set to selected.");
        assert.strictEqual(this.fnSetDateValueStub.getCall(0).args[0], "1.1.2020", "The createdOn filter count was removed correctly.");
        assert.strictEqual(this.fnSetSecondDateValueStub.getCall(0).args[0], "1.2.2020", "The createdOn filter was set to deselected.");

        assert.strictEqual(this.fnSetFilterCountStub2.getCall(0).args[0], 0, "The changedOn filter count was removed correctly.");
        assert.strictEqual(this.fnSetSelectedStub2.getCall(0).args[0], false, "The changedOn filter was set to deselected.");
        assert.strictEqual(this.fnSetDateValueStub2.getCall(0).args[0], undefined, "The changedOn filter count was removed correctly.");
        assert.strictEqual(this.fnSetSecondDateValueStub2.getCall(0).args[0], undefined, "The changedOn filter was set to deselected.");
    });

    QUnit.test("createdOn is given, the changedOn date range is given", function (assert) {
        // Arrange
        this.oController._createdOnFromFilter = undefined;
        this.oController._createdOnToFilter = undefined;
        this.oController._changedOnFromFilter = "1.1.2020";
        this.oController._changedOnToFilter = "1.2.2020";

        // Action
        this.oController.handleCancel();

        // Assert
        assert.strictEqual(this.fnSetFilterCountStub.getCall(0).args[0], 0, "The createdOn filter count was set correctly.");
        assert.strictEqual(this.fnSetSelectedStub.getCall(0).args[0], false, "The createdOn filter was set to selected.");
        assert.strictEqual(this.fnSetDateValueStub.getCall(0).args[0], undefined, "The createdOn filter count was removed correctly.");
        assert.strictEqual(this.fnSetSecondDateValueStub.getCall(0).args[0], undefined, "The createdOn filter was set to deselected.");

        assert.strictEqual(this.fnSetFilterCountStub2.getCall(0).args[0], 1, "The changedOn filter count was removed correctly.");
        assert.strictEqual(this.fnSetSelectedStub2.getCall(0).args[0], true, "The changedOn filter was set to deselected.");
        assert.strictEqual(this.fnSetDateValueStub2.getCall(0).args[0], "1.1.2020", "The changedOn filter count was removed correctly.");
        assert.strictEqual(this.fnSetSecondDateValueStub2.getCall(0).args[0], "1.2.2020", "The changedOn filter was set to deselected.");
    });

    QUnit.test("Both date ranges are given", function (assert) {
        // Arrange
        this.oController._createdOnFromFilter = "1.1.2020";
        this.oController._createdOnToFilter = "1.2.2020";
        this.oController._changedOnFromFilter = "1.3.2020";
        this.oController._changedOnToFilter = "1.4.2020";

        // Action
        this.oController.handleCancel();

        // Assert
        assert.strictEqual(this.fnSetFilterCountStub.getCall(0).args[0], 1, "The createdOn filter count was set correctly.");
        assert.strictEqual(this.fnSetSelectedStub.getCall(0).args[0], true, "The createdOn filter was set to selected.");
        assert.strictEqual(this.fnSetDateValueStub.getCall(0).args[0], "1.1.2020", "The createdOn filter count was removed correctly.");
        assert.strictEqual(this.fnSetSecondDateValueStub.getCall(0).args[0], "1.2.2020", "The createdOn filter was set to deselected.");

        assert.strictEqual(this.fnSetFilterCountStub2.getCall(0).args[0], 1, "The changedOn filter count was removed correctly.");
        assert.strictEqual(this.fnSetSelectedStub2.getCall(0).args[0], true, "The changedOn filter was set to deselected.");
        assert.strictEqual(this.fnSetDateValueStub2.getCall(0).args[0], "1.3.2020", "The changedOn filter count was removed correctly.");
        assert.strictEqual(this.fnSetSecondDateValueStub2.getCall(0).args[0], "1.4.2020", "The changedOn filter was set to deselected.");
    });

    QUnit.module("handleResetFilters", {
        beforeEach: function () {
            this.fnSetFilterCountStub = sinon.stub();
            this.fnSetSelectedStub = sinon.stub();
            this.fnSetFilterCountStub2 = sinon.stub();
            this.fnSetSelectedStub2 = sinon.stub();
            this.fnSetDateValueStub = sinon.stub();
            this.fnSetSecondDateValueStub = sinon.stub();
            this.fnSetDateValueStub2 = sinon.stub();
            this.fnSetSecondDateValueStub2 = sinon.stub();
            this.fnGetCoreStub = sinon.stub(sap.ui, "getCore").returns({
                byId: function (sId) {
                    switch (sId) {
                        case "CreatedOnFilter":
                            return {
                                setFilterCount: this.fnSetFilterCountStub,
                                setSelected: this.fnSetSelectedStub
                            };
                        case "ChangedOnFilter":
                            return {
                                setFilterCount: this.fnSetFilterCountStub2,
                                setSelected: this.fnSetSelectedStub2
                            };
                        case "CreatedOnDateRangeSelection":
                            return {
                                setDateValue: this.fnSetDateValueStub,
                                setSecondDateValue: this.fnSetSecondDateValueStub
                            };
                        case "ChangedOnDateRangeSelection":
                            return {
                                setDateValue: this.fnSetDateValueStub2,
                                setSecondDateValue: this.fnSetSecondDateValueStub2
                            };
                        default:
                            return undefined;
                    }
                }.bind(this)
            });
            this.oController = new ViewSettingsDialogController(this.oPageOverviewController);
        },
        afterEach: function () {
            this.fnGetCoreStub.restore();
        }
    });

    QUnit.test("All values are reset", function (assert) {
        this.oController._createdOnFromFilter = "1.1.2020";

        // Action
        this.oController.handleResetFilters();

        // Assert
        assert.strictEqual(this.fnSetFilterCountStub.getCall(0).args[0], 0, "The createdOn filter count was removed correctly.");
        assert.strictEqual(this.fnSetSelectedStub.getCall(0).args[0], false, "The createdOn filter was set to deselected.");
        assert.strictEqual(this.fnSetDateValueStub.getCall(0).args[0], undefined, "The createdOn filter count was removed correctly.");
        assert.strictEqual(this.fnSetSecondDateValueStub.getCall(0).args[0], undefined, "The createdOn filter was set to deselected.");

        assert.strictEqual(this.fnSetFilterCountStub2.getCall(0).args[0], 0, "The changedOn filter count was removed correctly.");
        assert.strictEqual(this.fnSetSelectedStub2.getCall(0).args[0], false, "The changedOn filter was set to deselected.");
        assert.strictEqual(this.fnSetDateValueStub2.getCall(0).args[0], undefined, "The changedOn filter count was removed correctly.");
        assert.strictEqual(this.fnSetSecondDateValueStub2.getCall(0).args[0], undefined, "The changedOn filter was set to deselected.");

        assert.strictEqual(this.oController._createdOnFromFilter, "1.1.2020", "Internal variables are not reset!");
    });
});