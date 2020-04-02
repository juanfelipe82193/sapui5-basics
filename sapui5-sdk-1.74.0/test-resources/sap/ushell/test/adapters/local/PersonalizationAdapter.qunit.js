// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for
 *               sap.ushell.adapters.local.PersonalizationAdapter
 */
(function () {
    "use strict";
    /*global assert, asyncTest, expect, module, start, stop, test,
      jQuery, sap
     */

    jQuery.sap.require("sap.ushell.adapters.local.PersonalizationAdapter");
    jQuery.sap.require("jquery.sap.storage");
    //clear local storage before running the tests
    if (window.localStorage) {
        window.localStorage.clear();
    }

    [
        {storage: sap.ushell.adapters.local.PersonalizationAdapter.prototype.constants.storage.LOCAL_STORAGE},
        {storage: sap.ushell.adapters.local.PersonalizationAdapter.prototype.constants.storage.MEMORY}
    ].forEach(function (oFixture) {
        module("sap.ushell.adapters.local.PersonalizationAdapter - " + oFixture.storage + " - ", {
            setup : function () {
                var oSystem = {};
                try {
                    jQuery.sap.storage.clear();
                    localStorage.clear();
                } catch (e) {
                }
                this.oAdapter = new sap.ushell.adapters.local.PersonalizationAdapter(
                    oSystem,
                    undefined,
                    {storageType: oFixture.storage}
                );
            },
            /**
             * This method is called after each test. Add every restoration
             * code here.
             */
            teardown : function () {
                delete this.oAdapter;
            }
        });

        asyncTest("load non-existent container (" + oFixture.storage + ")", function () {
            var sContainerKey,
                oContainer;

            // Arrange
            expect(1);
            sContainerKey = new Date().toJSON();
            // Act
            oContainer = this.oAdapter.getAdapterContainer(sContainerKey);
            oContainer.load()
                .done(function () {
                    var aKeys;
                    aKeys = oContainer.getItemKeys();
                    start();
                    // Assert
                    assert.equal(aKeys.length, 0, "Success: Container is empty. No errors.");
                })
                .fail(function () {
                    start();
                    assert.ok(false, "Error: Personalization data could not be read");
                });
        });

        asyncTest("delete non-existent container (" + oFixture.storage + ")", function () {
            var sContainerKey;

            // Arrange
            expect(1);
            sContainerKey = new Date().toJSON();
            // Act
            this.oAdapter.delAdapterContainer(sContainerKey)
                .done(function () {
                    start();
                    // Assert
                    assert.ok(true, "Success: Container was deleted. No error.");
                })
                .fail(function () {
                    start();
                    assert.ok(false, "Error: Personalization data could not be deleted.");
                });
        });

        asyncTest("get container, create item, save, load, check item, del container (" + oFixture.storage + ")", function () {
            var sContainerKey,
                sITEM_KEY = "Test_3",
                sITEM_VALUE = "Value_3",
                sReadItemValue,
                oContainer1,
                oContainer2,
                that = this;

            // Arrange
            expect(5);
            sContainerKey = new Date().toJSON();

            try {
                // Get container 1
                oContainer1 = this.oAdapter.getAdapterContainer(sContainerKey);
                assert.ok(true, "Success: Adapter container was loaded.");
            } catch (e1) {
                assert.ok(false, "Error: Exception '" + e1 + "' raised.");
            }
            if (!oContainer1) {
                assert.ok(false, "Error: oContainer1 is undefined.");
            }
            // Load via container 1
            oContainer1.load()
                .done(function () {
                    assert.ok(true, "Success: Container was loaded.");
                    // Set item in container 1
                    oContainer1.setItemValue(sITEM_KEY, sITEM_VALUE);
                    assert.ok(true, "Success: Item value was set to '" + sITEM_VALUE + "'");
                    // Save container 1
                    oContainer1.save()
                        .done(function () {
                            // Get container 2
                            oContainer2 = that.oAdapter.getAdapterContainer(sContainerKey);
                            // Load via container 2
                            oContainer2.load()
                                .done(function () {
                                    // Check if item was actually saved
                                    sReadItemValue = oContainer2.getItemValue(sITEM_KEY);
                                    assert.equal(sITEM_VALUE, sReadItemValue,
                                            "Success: Correct item value was read after loading via a new container object. ");
                                    // Delete the container on the storage
                                    that.oAdapter.delAdapterContainer(sContainerKey)
                                        .done(function () {
                                            start();
                                            assert.ok(true, "Success: Container was deleted. No error.");
                                        })
                                        .fail(function () {
                                            start();
                                            assert.ok(false, "Error: Personalization data could not be deleted.");
                                        });
                                })
                                .fail(function () {
                                    assert.ok(false, "Error: Personalization adapter could not be loaded.");
                                    that.oAdapter.delAdapterContainer(sContainerKey)
                                        .done(function () {
                                            start();
                                            assert.ok(true, "Success: Container was deleted after an error occured.");
                                        })
                                        .fail(function () {
                                            start();
                                            assert.ok(false, "Error: Personalization data could not be deleted.");
                                        });
                                });
                        })
                        .fail(function () {
                            assert.ok(false, "Error: Personalization adapter could not be saved.");
                            that.oAdapter.delAdapterContainer(sContainerKey)
                                .done(function () {
                                    start();
                                    assert.ok(true, "Success: Container was deleted after an error occured.");
                                })
                                .fail(function () {
                                    start();
                                    assert.ok(false, "Error: Personalization data could not be deleted.");
                                });
                        });
                })
                .fail(function () {
                    start();
                    assert.ok(false, "Error: Personalization data could not be read");
                });
        });

        asyncTest("create item in container 1 and delete it via container 2 (" + oFixture.storage + ")", function () {
            var sContainerKey,
                sITEM_KEY = "Test_4",
                sITEM_VALUE = "Value_4",
                oContainer1,
                oContainer2,
                aKeys,
                that = this;

            expect(13);
            sContainerKey = new Date().toJSON();
            oContainer1 = this.oAdapter.getAdapterContainer(sContainerKey);
                // Container 1 is used to create one item and save it
            oContainer1.load()
                .done(function () {
                    assert.ok(true, "Success: Container 1 was loaded.");
                    oContainer1.setItemValue(sITEM_KEY, sITEM_VALUE);
                    assert.deepEqual(oContainer1.getItemValue(sITEM_KEY), sITEM_VALUE,
                            "Success: Item value was set to '" + sITEM_VALUE + "'");
                    aKeys = [];
                    assert.equal(aKeys.length, 0, "Success: aKeys is emptied.");
                    aKeys = oContainer1.getItemKeys();
                    assert.equal(aKeys.length, 1, "Success: Container 1 contains 1 item");
                    assert.ok(oContainer1.containsItem(sITEM_KEY), "Success: Container 1 contains item '" + sITEM_KEY + "'");
                    oContainer1.save()
                        .done(function () {
                            oContainer2 = that.oAdapter.getAdapterContainer(sContainerKey);
                                // Container 2 is used to read the item saved via container 1 and delete it with an
                                // additional save.
                            oContainer2.load()
                                .done(function () {
                                    oContainer2.getItemValue(sITEM_KEY);
                                    aKeys = [];
                                    assert.equal(aKeys.length, 0, "Success: aKeys is emptied.");
                                    aKeys = oContainer2.getItemKeys();
                                    assert.equal(aKeys.length, 1, "Success: Container 2 contains 1 item");
                                    assert.ok(oContainer2.containsItem(sITEM_KEY), "Success: Container 2 contains item '" + sITEM_KEY + "'");
                                    oContainer2.delItem(sITEM_KEY);
                                    aKeys = [];
                                    assert.equal(aKeys.length, 0, "Success: aKeys is emptied.");
                                    aKeys = oContainer2.getItemKeys();
                                    assert.equal(aKeys.length, 0, "Success: Container 2 contains no items");
                                    oContainer1.load()
                                        // check via container 1 if the item was deleted in the storage
                                        .done(function () {
                                            aKeys = [];
                                            assert.equal(aKeys.length, 0, "Success: aKeys is emptied.");
                                            aKeys = oContainer2.getItemKeys();
                                            assert.equal(aKeys.length, 0, "Success: Container 2 contains no items");
                                            that.oAdapter.delAdapterContainer(sContainerKey)
                                                .done(function () {
                                                    start();
                                                    assert.ok(true, "Success: Container was deleted. No error.");
                                                })
                                                .fail(function () {
                                                    start();
                                                    assert.ok(false, "Error: Personalization data could not be deleted.");
                                                });
                                        })
                                        .fail(function () {
                                            start();
                                            assert.ok(false, "Error: Personalization data could not be deleted.");
                                        });
                                })
                                .fail(function () {
                                    assert.ok(false, "Error: Personalization adapter could not be loaded.");
                                    that.oAdapter.delAdapterContainer(sContainerKey)
                                        .done(function () {
                                            start();
                                            assert.ok(true, "Success: Container was deleted after an error occured.");
                                        })
                                        .fail(function () {
                                            start();
                                            assert.ok(false, "Error: Personalization data could not be deleted.");
                                        });
                                });
                        })
                        .fail(function () {
                            assert.ok(false, "Error: Personalization adapter could not be saved.");
                            that.oAdapter.delAdapterContainer(sContainerKey)
                                .done(function () {
                                    start();
                                    assert.ok(true, "Success: Container was deleted after an error occured.");
                                })
                                .fail(function () {
                                    start();
                                    assert.ok(false, "Error: Personalization data could not be deleted.");
                                });
                        });
                })
                .fail(function () {
                    start();
                    assert.ok(false, "Error: Personalization data could not be read");
                });
        });

        asyncTest("delete non-existing item (" + oFixture.storage + ")", function () {
            var sContainerKey,
                sItemKey,
                oContainer,
                that = this;

            expect(3);
            sContainerKey = new Date().toJSON();
            sItemKey = new Date().toJSON();
            oContainer = this.oAdapter.getAdapterContainer(sContainerKey);
            oContainer.load()
                .done(function () {
                    var aKeys;
                    aKeys = oContainer.getItemKeys();
                    // Assert
                    assert.equal(aKeys.length, 0, "Success: Container is loaded and empty."); // 1
                    try {
                        oContainer.delItem(sItemKey);
                        assert.ok(true, "Success: Deletion of non-existent item triggered no error."); // 2
                    } catch (e) {
                        assert.ok(false, "Error: Deletion of non-existent item triggered exception '" + e + "'");
                    }
                    // Clean up
                    that.oAdapter.delAdapterContainer(sContainerKey)
                        .done(function () {
                            start();
                            assert.ok(true, "Success: Container was deleted. No error."); // 3
                        })
                        .fail(function () {
                            start();
                            assert.ok(false, "Error: Personalization data could not be deleted.");
                        });
                })
                .fail(function () {
                    start();
                    assert.ok(false, "Error: Container could not be loaded.");
                });
        });

        asyncTest("item manipulation (" + oFixture.storage + ")", function () {
            var sContainerKey,
                sItemKey1,
                sItemKey2,
                sItemValue1,
                oItemValue2,
                sReadItemValue1,
                oReadItemValue2,
                oContainer,
                that = this;

            // Arrange
            expect(6);
            sContainerKey = new Date().toJSON();
            sItemKey1 = new Date().toJSON() + "-1";
            sItemKey2 = new Date().toJSON() + "-2";
            sItemValue1 = sItemKey1; // the key is used as value also
            oItemValue2 = {
                Ornette: "Coleman",
                Cecil: "Taylor",
                Anthony: "Braxton",
                Number: 1
            };
            // Act
            oContainer = this.oAdapter.getAdapterContainer(sContainerKey);
            oContainer.load()
                .done(function () {
                    var aKeys;

                    // Assert
                    aKeys = oContainer.getItemKeys();
                    assert.equal(aKeys.length, 0, "Success: Container is loaded and empty."); // 1
                    // Act - set item value 1
                    oContainer.setItemValue(sItemKey1, sItemValue1);
                    sReadItemValue1 = oContainer.getItemValue(sItemKey1);
                    // Assert
                    assert.deepEqual(sReadItemValue1, sItemValue1,
                            "Success: Item value 1 was stored locally in the container"); // 2
                    // Act - set item value 2
                    oContainer.setItemValue(sItemKey2, oItemValue2);
                    oReadItemValue2 = oContainer.getItemValue(sItemKey2);
                    // Assert
                    assert.deepEqual(oReadItemValue2, oItemValue2,
                            "Success: Item value2 was stored locally in the container"); // 3
                    // Act - delete item value 2
                    oContainer.delItem(sItemKey2);
                    oReadItemValue2 = undefined;
                    oReadItemValue2 = oContainer.getItemValue(sItemKey2);
                    // Assert
                    assert.deepEqual(oReadItemValue2, undefined,
                            "Success: Item value2 was deleted locally in the container"); // 4
                    // Act - set item value 2 again
                    oContainer.setItemValue(sItemKey2, oItemValue2);
                    oReadItemValue2 = oContainer.getItemValue(sItemKey2);
                    // Assert
                    assert.deepEqual(oReadItemValue2, oItemValue2,
                            "Success: Item value2 was stored locally in the container"); // 5
                    // Clean up
                    that.oAdapter.delAdapterContainer(sContainerKey)
                        .done(function () {
                            start();
                            assert.ok(true, "Success: Container was deleted."); // 6
                        })
                        .fail(function () {
                            start();
                            assert.ok(false, "Error: Personalization data could not be deleted.");
                        });
                })
                .fail(function () {
                    start();
                    assert.ok(false, "Error: Container could not be loaded.");
                });
        });

    });

    [
        {
            storage: sap.ushell.adapters.local.PersonalizationAdapter.prototype.constants.storage.MEMORY,
            personalizationData: {
                "sap.ushell.personalization#sap.ushell.services.UserRecents" : {
                    "ITEM#RecentApps": [
                        {"iCount": 1, "iTimestamp": 1378479383874, "oItem": {"semanticObject": "UI2Fiori2SampleApps", "action": "approvepurchaseorders", "sTargetHash": "#UI2Fiori2SampleApps-approvepurchaseorders", "title" : "Approve Purchase", "url" : "#UI2Fiori2SampleApps-approvepurchaseorders"}},
                        {"iCount": 2, "iTimestamp": 1378479383895, "oItem": {"semanticObject": "Action", "action": "toappnavsample", "sTargetHash": "#Action-toappnavsample", "title" : "Approve Nav Sample 3", "url" : "#Action-toappnavsample"}},
                        {"iCount": 2, "iTimestamp": 1378479383896, "oItem": {"semanticObject": "Action", "action": "toappnavsample2", "sTargetHash": "#Action-toappnavsample2", "title" : "Approve Nav Sample 2", "url" : "#Action-toappnavsample2"}},
                        {"iCount": 1, "iTimestamp": 1378479383899, "oItem": {"semanticObject": "UI2Fiori2SampleApps", "action": "MyLeaveRequest", "sTargetHash": "#UI2Fiori2SampleApps-MyLeaveRequest", "title" : "My Leave Request", "url" : "#UI2Fiori2SampleApps-MyLeaveRequest"}},
                        {"iCount": 2, "iTimestamp": 1378479383878, "oItem": {"semanticObject": "Action", "action": "toappnavsample", "sTargetHash": "#Action-toappnavsample", "title" : "Approve Nav Sample 8", "url" : "#Action-toappnavsample"}},
                        {"iCount": 2, "iTimestamp": 1378479383897, "oItem": {"semanticObject": "Action", "action": "toappnavsample2", "sTargetHash": "#Action-toappnavsample2", "title" : "Approve Nav Sample 1", "url" : "#Action-toappnavsample2"}},
                        {"iCount": 1, "iTimestamp": 1378479383898, "oItem": {"semanticObject": "UI2Fiori2SampleApps", "action": "approvepurchaseorders", "sTargetHash": "#UI2Fiori2SampleApps-approvepurchaseorders", "title" : "Approve first Purchase", "url" : "#UI2Fiori2SampleApps-approvepurchaseorders"}},
                        {"iCount": 2, "iTimestamp": 1378479383863, "oItem": {"semanticObject": "Action", "action": "toappnavsample", "sTargetHash": "#Action-toappnavsample", "title" : "Approve Nav Sample 13", "url" : "#Action-toappnavsample"}},
                        {"iCount": 2, "iTimestamp": 1378479383862, "oItem": {"semanticObject": "Action", "action": "toappnavsample2", "sTargetHash": "#Action-toappnavsample2", "title" : "Approve Nav Sample 12", "url" : "#Action-toappnavsample2"}},
                        {"iCount": 1, "iTimestamp": 1378479383879, "oItem": {"semanticObject": "UI2Fiori2SampleApps", "action": "approvepurchaseorders", "sTargetHash": "#UI2Fiori2SampleApps-approvepurchaseorders", "title" : "Approve Purchase", "url" : "#UI2Fiori2SampleApps-approvepurchaseorders"}},
                        {"iCount": 2, "iTimestamp": 1378479383894, "oItem": {"semanticObject": "Action", "action": "toappnavsample", "sTargetHash": "#Action-toappnavsample", "title" : "Approve Nav Sample 4", "url" : "#UI2Fiori2SampleApps-appnavsample"}},
                        {"iCount": 2, "iTimestamp": 1378479383893, "oItem": {"semanticObject": "Action", "action": "toappnavsample2", "sTargetHash": "#Action-toappnavsample2", "title" : "Approve Nav Sample 5", "url" : "#UI2Fiori2SampleApps-appnavsample2"}}
                    ],
                    "ITEM#RecentSearches": [
                        {"iCount": 1, "iTimestamp": 1378478828152, "oItem": {"sTerm": "Test"}},
                        {"iCount": 1, "iTimestamp": 1378478828151, "oItem": {"sTerm": "Recent search 3"}},
                        {"iCount": 1, "iTimestamp": 1378478828149, "oItem": {"sTerm": "Recent search 4", "oObjectName": {"label": "Business Partners", "value": "Business Partners"}}},
                        {"iCount": 1, "iTimestamp": 1378478828153, "oItem": {"sTerm": "Sally", "oObjectName": {"label": "Employees", "value": "Employees"}}},
                        {"iCount": 1, "iTimestamp": 1378478828148, "oItem": {"sTerm": "Recent search 5"}},
                        {"iCount": 1, "iTimestamp": 1378478828147, "oItem": {"sTerm": "Recent search 6"}},
                        {"iCount": 1, "iTimestamp": 1378478828137, "oItem": {"sTerm": "Recent search 16"}},
                        {"iCount": 1, "iTimestamp": 1378478828136, "oItem": {"sTerm": "Recent search 17"}},
                        {"iCount": 1, "iTimestamp": 1378478828133, "oItem": {"sTerm": "Recent search 20"}},
                        {"iCount": 1, "iTimestamp": 1378478828132, "oItem": {"sTerm": "Recent search 21"}},
                        {"iCount": 1, "iTimestamp": 1378478828131, "oItem": {"sTerm": "Recent search 22"}},
                        {"iCount": 1, "iTimestamp": 1378478828146, "oItem": {"sTerm": "Recent search 7"}},
                        {"iCount": 1, "iTimestamp": 1378478828145, "oItem": {"sTerm": "Recent search 8"}},
                        {"iCount": 1, "iTimestamp": 1378478828144, "oItem": {"sTerm": "Recent search 9"}},
                        {"iCount": 1, "iTimestamp": 1378478828143, "oItem": {"sTerm": "Recent search 10"}},
                        {"iCount": 1, "iTimestamp": 1378478828135, "oItem": {"sTerm": "Recent search 18"}},
                        {"iCount": 1, "iTimestamp": 1378478828134, "oItem": {"sTerm": "Recent search 19"}},
                        {"iCount": 1, "iTimestamp": 1378478828142, "oItem": {"sTerm": "Recent search 11"}},
                        {"iCount": 1, "iTimestamp": 1378478828141, "oItem": {"sTerm": "Recent search 12"}},
                        {"iCount": 1, "iTimestamp": 1378478828140, "oItem": {"sTerm": "Recent search 13"}},
                        {"iCount": 1, "iTimestamp": 1378478828139, "oItem": {"sTerm": "Recent search 14"}},
                        {"iCount": 1, "iTimestamp": 1378478828138, "oItem": {"sTerm": "Recent search 15"}}
                    ]
                }
            }
        }
    ].forEach(function (oFixture) {
        module("sap.ushell.adapters.local.PersonalizationAdapter - provide initial personalization data - "
                + oFixture.storage + " - ", {
                setup : function () {
                    var oSystem = {};

                    this.oAdapter = new sap.ushell.adapters.local.PersonalizationAdapter(
                        oSystem,
                        undefined,
                        { config:
                            {
                                storageType: oFixture.storage,
                                personalizationData: oFixture.personalizationData
                            }
                        }
                    );
                },
                /**
                 * This method is called after each test. Add every restoration
                 * code here.
                 */
                teardown : function () {
                    delete this.oAdapter;
                }
            });

        asyncTest("check init data (" + oFixture.storage + ")", function () {
            var sContainerKey,
                sItemKey,
                oExpectedItemValue,
                oReadItemValue,
                oContainer,
                that = this;

            // Arrange
            expect(3);
            sContainerKey = "sap.ushell.personalization#sap.ushell.services.UserRecents";
            sItemKey = "ITEM#RecentSearches";
            oExpectedItemValue = oFixture.personalizationData &&
                oFixture.personalizationData["sap.ushell.personalization#sap.ushell.services.UserRecents"] &&
                oFixture.personalizationData["sap.ushell.personalization#sap.ushell.services.UserRecents"]["ITEM#RecentSearches"];
            if (oExpectedItemValue) {
                assert.ok(true, "Success: Initialization value contains the test item");
            } else {
                assert.ok(true, "Warning: Initialization value does not contain the test item");
            }
            // Act
            oContainer = this.oAdapter.getAdapterContainer(sContainerKey);
            oContainer.load()
                .done(function () {

                    oReadItemValue = oContainer.getItemValue(sItemKey);
                    // Assert
                    assert.deepEqual(oReadItemValue, oExpectedItemValue,
                            "Success: " + "Initialization value was read from the container. Value: " + JSON.stringify(oReadItemValue)); // 1
                    // Clean up
                    that.oAdapter.delAdapterContainer(sContainerKey)
                        .done(function () {
                            start();
                            assert.ok(true, "Success: Container was deleted. No error."); // 2
                        })
                        .fail(function () {
                            start();
                            assert.ok(false, "Error: Personalization data could not be deleted.");
                        });
                })
                .fail(function () {
                    start();
                    assert.ok(false, "Error: Container could not be loaded.");
                });
        });

    });

    module("sap.ushell.adapters.local.PersonalizationAdapter - adapter tests", {
        setup : function () {
        },
        /**
         * This method is called after each test. Add every restoration
         * code here.
         */
        teardown : function () {
        }
    });

    test("Get the adapter with a wrong storage type", function () {
        expect(1);
        try {
            var oAdapter = new sap.ushell.adapters.local.PersonalizationAdapter(
                undefined,
                undefined,
                { config: { storageType: "NoN-ExIsTiNg" } }
            );
            oAdapter = oAdapter; // for eslint
            assert.ok(false, "Error: No exception was triggered.");
        } catch (e) {
            assert.ok(true, "Success: Exception was triggered.");
        }
    });
}());
