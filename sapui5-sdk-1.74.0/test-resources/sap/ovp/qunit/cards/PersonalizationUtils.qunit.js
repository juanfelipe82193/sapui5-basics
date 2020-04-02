sap.ui.define([
    "sap/ovp/cards/PersonalizationUtils",
    "test-resources/sap/ovp/mockservers",
    "jquery.sap.global"
], function (PersonalizationUtils, mockservers, jquery) {
            "use strict";
            /* module, ok, test, jQuery, sap */

            //jQuery.sap.require("sap.ovp.cards.PersonalizationUtils");
            var oPersonalizationUtils = PersonalizationUtils;


            module("sap.ovp.cards.PersonalizationUtils", {
                /**
                 * This method is called before each test
                 */
                setup: function () {
                },
                /**
                 * This method is called after each test. Add every restoration code here
                 *
                 */
                teardown: function () {
                }
            });

            test("mergeChanges function - ", function () {
                var aCards = [
                    {
                        "id": "i2d.ps.projfincontroller.ovps1_card00",
                        "visibility": true,
                        "dashboardLayout": {
                            "C4": {
                                "row": 1,
                                "col": 1,
                                "rowSpan": 12,
                                "colSpan": 1,
                                "maxColSpan": 1,
                                "noOfItems": 5,
                                "autoSpan": true,
                                "showOnlyHeader": false
                            }
                        }
                    },
                    {
                        "id": "i2d_ps_projfincontroller_ovps1_card05",
                        "visibility": true,
                        "dashboardLayout": {
                            "C4": {
                                "row": 13,
                                "col": 2,
                                "rowSpan": 12,
                                "colSpan": 1,
                                "maxColSpan": 1,
                                "noOfItems": 5,
                                "autoSpan": true,
                                "showOnlyHeader": false
                            }
                        }
                    }
                ];
                var deltachanges = [{
                    getChangeType: function () {
                        return "dragOrResize"
                    },
                    getContent: function () {
                        return {
                            cardId : "i2d_ps_projfincontroller_ovps1_card05",
                            dashboardLayout:{"C4":{"row":9,"oldRow":32,"column":3,"oldColumn":5,
                                "rowSpan": 12,
                                "oldRowSpan":10,
                                "colSpan": 5,
                                "maxColSpan": 2,
                                "oldColSpan": 5,
                                "noOfItems": 8,
                                "autoSpan": false,
                                "showOnlyHeader": true

                            }}
                        }
                    }
                }];
                var expectedResults = {"row":9,"col":3,"rowSpan":12,"colSpan":5,"maxColSpan":2,"noOfItems":8,"autoSpan":false,"showOnlyHeader":true}
                var actualResults = oPersonalizationUtils.mergeChanges(aCards, deltachanges);
                ok(JSON.stringify(actualResults[1].dashboardLayout["C4"]) == JSON.stringify(expectedResults));
            });

            test("mergeChanges function - View switch changes", function () {
                var aCards = [
                    {
                        "id": "i2d.ps.projfincontroller.ovps1_card00",
                        oldKey: 2,
                        selectedKey: 3
                    },
                    {
                        "id": "i2d_ps_projfincontroller_ovps1_card05",
                        oldKey: 3,
                        selectedKey: 1
                    }
                ];
                var deltachanges = [{
                    getChangeType: function () {
                        return "viewSwitch"
                    },
                    getContent: function () {
                        return {
                            cardId: "i2d_ps_projfincontroller_ovps1_card05",
                            selectedKey:5
                        }
                    }
                }];
                var actualResults = oPersonalizationUtils.mergeChanges(aCards, deltachanges);
                ok(JSON.stringify(actualResults[1].selectedKey) == "5")
            });

            test("addMissingmanifest function - two cards of Different Id", function () {
                var oManifestcards = [
                    {
                        "id": "card002",
                        "visibility": true
                    }
                ];
                var oDeltaCards = [
                    {
                        "id": "card005",
                        "visibility": true
                    }
                ];
                var expectedResults = [{"id": "card005", "visibility": true}, {"id": "card002", "visibility": true}];
                var actualResults = oPersonalizationUtils.addMissingCardsFromManifest(oManifestcards, oDeltaCards);
                ok(JSON.stringify(expectedResults) == JSON.stringify(actualResults));

            });

            test("addMissingmanifest function - two cards of same Id", function () {
                var oManifestcards = [
                    {
                        "id": "card002",
                        "visibility": true
                    }
                ];
                var oDeltaCards = [
                    {
                        "id": "card002",
                        "visibility": true
                    }
                ];
                var expectedResults = [{"id": "card002", "visibility": true}];
                var actualResults = oPersonalizationUtils.addMissingCardsFromManifest(oManifestcards, oDeltaCards);
                ok(JSON.stringify(actualResults) == JSON.stringify(expectedResults));

            });

            test("mergeChanges function - Position changes, Cards should not be swapped", function () {
                var aCards = [
                    {
                        "id": "i2d.ps.projfincontroller.ovps1_card00",
                        "visibility": true

                    },
                    {
                        "id": "i2d_ps_projfincontroller_ovps1_card05",
                        "visibility": true
                    }
                ];
                var deltachanges = [{
                    getChangeType: function () {
                        return "position"
                    },
                    getContent: function () {
                        return {
                            cardId: "i2d_ps_projfincontroller_ovps1_card05",
                            index:2
                        }
                    }
                }];
                var actualResults = oPersonalizationUtils.mergeChanges(aCards, deltachanges);
                ok((actualResults[1].visibility) === true)
            });





        });
