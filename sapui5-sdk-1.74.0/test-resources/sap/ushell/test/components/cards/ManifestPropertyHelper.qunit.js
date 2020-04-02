// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.cards.ManifestPropertyHelper.js
 */
sap.ui.define([
    "sap/ushell/components/cards/ManifestPropertyHelper",
    "sap/base/util/ObjectPath",
    "sap/ushell/utils"
], function (ManifestPropertyHelper, ObjectPath, utils) {
    "use strict";

    /*global QUnit, sap, sinon*/

    QUnit.module("extractCardData", {
        beforeEach: function () {
            this.URLParsing = {
                paramsToString: function () {}
            };
            ObjectPath.set("ushell.Container", {}, sap);

            sap.ushell.Container.getService = sinon.stub().withArgs("URLParsing").returns(this.URLParsing);

            // the insertion of the placeholders is tested in a different module
            sinon.stub(ManifestPropertyHelper, "_replaceDataWithPlaceholders");
        },
        afterEach: function () {
            delete sap.ushell.Container;
            ManifestPropertyHelper._replaceDataWithPlaceholders.restore();
        }
    });

    QUnit.test("extractCardData: Extract card data from manifest", function (assert) {
        var oManifest,
            oCardData,
            oExpectedCardData,
            oURLParameterStub;

        oManifest = {
            "sap.app": {
                "tags": {
                    "keywords": [
                        "foo",
                        "bar"
                    ]
                }
            },
            "sap.card": {
                "header": {
                    "title": "Sales Orders",
                    "subTitle": "Static Data",
                    "icon": {
                        "src": "sap-icon://sales-order"
                    },
                    "actions": [
                        {
                            "type": "Navigation",
                            "enabled": true,
                            "service": "IntentBasedNavigation",
                            "parameters": {
                                "intentSemanticObject": "SalesOrder",
                                "intentAction": "display",
                                "intentParameters": {
                                    "a": 1000,
                                    "b": "foo"
                                }
                            }
                        }
                    ]
                }
            }
        };

        oURLParameterStub = sinon.stub(utils, "urlParametersToString").returns("a=1000&b=foo");

        oExpectedCardData = {
            bagProperties: {
                "display_title_text": "Sales Orders",
                "display_subtitle_text": "Static Data",
                "display_search_keywords": "foo,bar"
            },
            tileConfiguration: JSON.stringify({
                "display_icon_url": "sap-icon://sales-order",
                "navigation_semantic_object": "SalesOrder",
                "navigation_semantic_action": "display",
                "navigation_semantic_parameters": "a=1000&b=foo",
                "navigation_use_semantic_object": true,
                "navigation_target_url": "#SalesOrder-display?a=1000&b=foo"
            })
        };

        oCardData = ManifestPropertyHelper.extractCardData(oManifest);

        assert.deepEqual(oCardData.bagProperties, oExpectedCardData.bagProperties, "The bag properties were extracted from the manifest");
        assert.deepEqual(oCardData.tileConfiguration, oExpectedCardData.tileConfiguration, "The tile configuration was extracted from the manifest");
        assert.deepEqual(utils.urlParametersToString.getCall(0).args[0], { "a": 1000, "b": "foo" }, "The parameter conversion was called with the correct arguments");

        oURLParameterStub.restore();
    });

    QUnit.test("extractCardData: Extract card data from manifest when manifest is empty", function (assert) {
        var oManifest,
            oCardData,
            oExpectedCardData;

        oManifest = {};

        oExpectedCardData = {
            bagProperties: {
                "display_title_text": undefined,
                "display_subtitle_text": undefined,
                "display_search_keywords": undefined
            },
            tileConfiguration: undefined
        };

        oCardData = ManifestPropertyHelper.extractCardData(oManifest);

        assert.deepEqual(oCardData.bagProperties, oExpectedCardData.bagProperties, "The bag properties were extracted from the manifest");
        assert.deepEqual(oCardData.tileConfiguration, oExpectedCardData.tileConfiguration, "The tile configuration was extracted from the manifest");
    });

    QUnit.test("extractCardData: Extract card data from manifest when there are multiple actions", function (assert) {
        var oManifest,
            oCardData,
            oExpectedCardData,
            oURLParameterStub;

        oManifest = {
            "sap.card": {
                "header": {
                    "actions": [
                        {
                            "type": "foo"
                        },
                        {
                            "type": "Navigation",
                            "enabled": true,
                            "service": "IntentBasedNavigation",
                            "parameters": {
                                "intentSemanticObject": "SalesOrder",
                                "intentAction": "display",
                                "intentParameters": {
                                    "a": 1000,
                                    "b": "foo"
                                }
                            }
                        }
                    ]
                }
            }
        };

        oURLParameterStub = sinon.stub(utils, "urlParametersToString").returns("a=1000&b=foo");

        oExpectedCardData = {
            bagProperties: {
                "display_title_text": undefined,
                "display_subtitle_text": undefined,
                "display_search_keywords": undefined
            },
            tileConfiguration: JSON.stringify({
                "navigation_semantic_object": "SalesOrder",
                "navigation_semantic_action": "display",
                "navigation_semantic_parameters": "a=1000&b=foo",
                "navigation_use_semantic_object": true,
                "navigation_target_url": "#SalesOrder-display?a=1000&b=foo"
            })
        };

        oCardData = ManifestPropertyHelper.extractCardData(oManifest);

        assert.deepEqual(oCardData.bagProperties, oExpectedCardData.bagProperties, "The bag properties were extracted from the manifest");
        assert.deepEqual(oCardData.tileConfiguration, oExpectedCardData.tileConfiguration, "The tile configuration was extracted from the manifest");
        assert.deepEqual(utils.urlParametersToString.getCall(0).args[0], { "a": 1000, "b": "foo" }, "The parameter conversion was called with the correct arguments");

        oURLParameterStub.restore();
    });

    QUnit.test("extractCardData: Extract card data from manifest when target url is provided", function (assert) {
        var oManifest,
            oCardData,
            oExpectedCardData;

        oManifest = {
            "sap.card": {
                "header": {
                    "actions": [
                        {
                            "type": "foo"
                        },
                        {
                            "type": "Navigation",
                            "enabled": true,
                            "service": "IntentBasedNavigation",
                            "parameters": {
                                "url": "foo"
                            }
                        }
                    ]
                }
            }
        };

        oExpectedCardData = {
            bagProperties: {
                "display_title_text": undefined,
                "display_subtitle_text": undefined,
                "display_search_keywords": undefined
            },
            tileConfiguration: JSON.stringify({
                "navigation_use_semantic_object": false,
                "navigation_target_url": "foo"
            })
        };

        oCardData = ManifestPropertyHelper.extractCardData(oManifest);

        assert.deepEqual(oCardData.bagProperties, oExpectedCardData.bagProperties, "The bag properties were extracted from the manifest");
        assert.deepEqual(oCardData.tileConfiguration, oExpectedCardData.tileConfiguration, "The tile configuration was extracted from the manifest");
    });

    QUnit.test("extractCardData: Extract card data from manifest when target url AND semantic object+action are provided", function (assert) {
        var oManifest,
            oCardData,
            oExpectedCardData,
            oURLParameterStub;

        oManifest = {
            "sap.card": {
                "header": {
                    "actions": [
                        {
                            "type": "foo"
                        },
                        {
                            "type": "Navigation",
                            "enabled": true,
                            "service": "IntentBasedNavigation",
                            "parameters": {
                                "intentSemanticObject": "SalesOrder",
                                "intentAction": "display",
                                "intentParameters": {
                                    "a": 1000,
                                    "b": "foo"
                                },
                                "url": "foo"
                            }
                        }
                    ]
                }
            }
        };

        oURLParameterStub = sinon.stub(utils, "urlParametersToString").returns("a=1000&b=foo");

        oExpectedCardData = {
            bagProperties: {
                "display_title_text": undefined,
                "display_subtitle_text": undefined,
                "display_search_keywords": undefined
            },
            tileConfiguration: JSON.stringify({
                "navigation_semantic_object": "SalesOrder",
                "navigation_semantic_action": "display",
                "navigation_semantic_parameters": "a=1000&b=foo",
                "navigation_use_semantic_object": false,
                "navigation_target_url": "foo"
            })
        };

        oCardData = ManifestPropertyHelper.extractCardData(oManifest);

        assert.deepEqual(oCardData.bagProperties, oExpectedCardData.bagProperties, "The bag properties were extracted from the manifest");
        assert.deepEqual(oCardData.tileConfiguration, oExpectedCardData.tileConfiguration, "The tile configuration was extracted from the manifest");
        assert.deepEqual(utils.urlParametersToString.getCall(0).args[0], { "a": 1000, "b": "foo" }, "The parameter conversion was called with the correct arguments");

        oURLParameterStub.restore();
    });

    QUnit.test("extractCardData: Extract card data from manifest when no intent based navigation is to be used and no target url is provided", function (assert) {
        var oManifest,
            oCardData,
            oExpectedCardData,
            oURLParameterStub;

        oManifest = {
            "sap.card": {
                "header": {
                    "actions": [
                        {
                            "type": "foo"
                        },
                        {
                            "type": "Navigation",
                            "enabled": true,
                            "service": "IntentBasedNavigation",
                            "parameters": {
                                "intentParameters": {
                                    "a": 1000,
                                    "b": "foo"
                                }
                            }
                        }
                    ]
                }
            }
        };

        oURLParameterStub = sinon.stub(utils, "urlParametersToString").returns("a=1000&b=foo");

        oExpectedCardData = {
            bagProperties: {
                "display_title_text": undefined,
                "display_subtitle_text": undefined,
                "display_search_keywords": undefined
            },
            tileConfiguration: JSON.stringify({
                "navigation_semantic_object": undefined,
                "navigation_semantic_action": undefined,
                "navigation_semantic_parameters": "a=1000&b=foo",
                "navigation_use_semantic_object": undefined,
                "navigation_target_url": undefined
            })
        };

        oCardData = ManifestPropertyHelper.extractCardData(oManifest);

        assert.deepEqual(oCardData.bagProperties, oExpectedCardData.bagProperties, "The bag properties were extracted from the manifest");
        assert.deepEqual(oCardData.tileConfiguration, oExpectedCardData.tileConfiguration, "The tile configuration was extracted from the manifest");
        assert.deepEqual(utils.urlParametersToString.getCall(0).args[0], { "a": 1000, "b": "foo" }, "The parameter conversion was called with the correct arguments");

        oURLParameterStub.restore();
    });


    QUnit.module("ManifestPropertyHelper");

    QUnit.test("replaceDataWithPlaceholders: replace manifest data with placeholders", function (assert) {

        var oManifest = {
            "sap.app": {
                "tags": {
                    "keywords": [
                        "foo",
                        "bar"
                    ]
                }
            },
            "sap.card": {
                "header": {
                    "title": "Sales Orders",
                    "subTitle": "Static Data",
                    "icon": {
                        "src": "sap-icon://sales-order"
                    },
                    "actions": [
                        {
                            "type": "Navigation",
                            "enabled": true,
                            "service": "IntentBasedNavigation",
                            "parameters": {
                                "intentSemanticObject": "SalesOrder",
                                "intentAction": "display",
                                "intentParameters": {
                                    "a": 1000,
                                    "b": "foo"
                                }
                            }
                        }
                    ]
                }
            }
        };

        var oExpectedManifest = {
            "sap.app": {
                "tags": {
                    "keywords": "<keywords>"
                }
            },
            "sap.card": {
                "header": {
                    "title": "<title>",
                    "subTitle": "<subtitle>",
                    "icon": {
                        "src": "<icon>"
                    },
                    "actions": [
                        {
                            "type": "Navigation",
                            "enabled": true,
                            "service": "IntentBasedNavigation",
                            "parameters": {
                                "intentSemanticObject": "<semantic object>",
                                "intentAction": "<action>",
                                "intentParameters": "<parameters>"
                            }
                        }
                    ]
                }
            }
        };

        var oActualManifest = ManifestPropertyHelper._replaceDataWithPlaceholders(oManifest);

        assert.deepEqual(oActualManifest, oExpectedManifest, "The manifest properties were replaced by placeholders");
        assert.notStrictEqual(oActualManifest, oExpectedManifest, "The manifest was copied");
    });

    QUnit.test("replaceDataWithPlaceholders: don't add a property with placeholder if the property is not present", function (assert) {
        var oManifest = {};
        var oExpectedManifest = {};

        var oActualManifest = ManifestPropertyHelper._replaceDataWithPlaceholders(oManifest);

        assert.deepEqual(oActualManifest, oExpectedManifest, "No manifest properties with placeholders were added");
    });

    QUnit.test("mergeCardData: Merge card data with manifest", function (assert) {
        var oCardData,
            oManifest,
            oExpectedManifest,
            oMergedManifest;

        oCardData = {
            "display_title_text": "Sales Orders",
            "display_subtitle_text": "Static Data",
            "display_search_keywords": "foo,bar",
            "display_icon_url": "sap-icon://sales-order",
            "navigation_semantic_object": "SalesOrder",
            "navigation_target_url": "#SalesOrder-display?a=1000&b=foo",
            "navigation_semantic_action": "display",
            "navigation_semantic_parameters_as_object": { a: 1000, b: "foo" }
        };

        oManifest = {
            "sap.app": {
                "tags": {
                    "keywords": "<keywords>"
                }
            },
            "sap.card": {
                "header": {
                    "title": "<title>",
                    "subTitle": "<subtitle>",
                    "icon": {
                        "src": "<icon>"
                    },
                    "actions": [
                        {
                            "type": "Navigation",
                            "enabled": true,
                            "service": "IntentBasedNavigation",
                            "parameters": {
                                "intentSemanticObject": "<semantic object>",
                                "intentAction": "<action>",
                                "intentParameters": "<parameters>"
                            }
                        }
                    ]
                }
            }
        };

        oExpectedManifest = {
            "sap.app": {
                "tags": {
                    "keywords": [
                        "foo",
                        "bar"
                    ]
                }
            },
            "sap.card": {
                "header": {
                    "title": "Sales Orders",
                    "subTitle": "Static Data",
                    "icon": {
                        "src": "sap-icon://sales-order"
                    },
                    "actions": [
                        {
                            "type": "Navigation",
                            "enabled": true,
                            "service": "IntentBasedNavigation",
                            "parameters": {
                                "intentSemanticObject": "SalesOrder",
                                "intentAction": "display",
                                "intentParameters": {
                                    "a": 1000,
                                    "b": "foo"
                                }
                            }
                        }
                    ]
                }
            }
        };

        oMergedManifest = ManifestPropertyHelper.mergeCardData(oManifest, oCardData);

        assert.deepEqual(oMergedManifest, oExpectedManifest, "Card data was merged into manifest");
    });

    QUnit.test("mergeCardData: Merge card data with manifest when a URL is specified instead of intent based navigation", function (assert) {
        var oCardData,
        oManifest,
        oExpectedManifest,
        oMergedManifest;

        oCardData = {
            "navigation_target_url": "http://www.sap.com"
        };

        oManifest = {
            "sap.card": {
                "header": {
                    "actions": [
                        {
                            "type": "Navigation",
                            "enabled": true,
                            "service": "IntentBasedNavigation",
                            "parameters": {
                                "url": "<url>"
                            }
                        }
                    ]
                }
            }
        };

        oExpectedManifest = {
            "sap.card": {
                "header": {
                    "actions": [
                        {
                            "type": "Navigation",
                            "enabled": true,
                            "service": "IntentBasedNavigation",
                            "parameters": {
                                "url": "http://www.sap.com"
                            }
                        }
                    ]
                }
            }
        };

        oMergedManifest = ManifestPropertyHelper.mergeCardData(oManifest, oCardData);

        assert.deepEqual(oMergedManifest, oExpectedManifest, "Card data was merged into manifest");
    });

    QUnit.test("mergeCardData: Merge card data with manifest when properties don't exist in manifest", function (assert) {
        var oCardData,
            oManifest,
            oExpectedManifest,
            oMergedManifest;

        oCardData = {
            "display_title_text": "Sales Orders",
            "display_subtitle_text": "Static Data",
            "display_search_keywords": "foo,bar"
        };

        oManifest = {};

        oExpectedManifest = {
            "sap.app": {
                "tags": {
                    "keywords": [
                        "foo",
                        "bar"
                    ]
                }
            },
            "sap.card": {
                "header": {
                    "title": "Sales Orders",
                    "subTitle": "Static Data"
                }
            }
        };

        oMergedManifest = ManifestPropertyHelper.mergeCardData(oManifest, oCardData);

        assert.deepEqual(oMergedManifest, oExpectedManifest, "Card data was merged into manifest");
    });

    QUnit.test("mergeCardData: Merge card data with manifest when properties don't exist in the card data", function (assert) {
        var oCardData,
            oManifest,
            oExpectedManifest,
            oMergedManifest;

        oCardData = {};

        oManifest = {
            "sap.card": {
                "header": {
                    "title": "Sales Orders untranslated",
                    "subTitle": "Static Data untranslated"
                }
            }
        };

        oExpectedManifest = {
            "sap.card": {
                "header": {
                    "title": "Sales Orders untranslated",
                    "subTitle": "Static Data untranslated"
                }
            }
        };

        oMergedManifest = ManifestPropertyHelper.mergeCardData(oManifest, oCardData);

        assert.deepEqual(oMergedManifest, oExpectedManifest, "The properties in the manifest are not set to undefined");
    });

    QUnit.test("getTranslatablePropertiesFromBag returns the expected texts when title and subtitle are available", function (assert) {
        // Arrange
        var oBag = {
                getTextNames: sinon.stub(),
                getText: sinon.stub()
            },
            oExpectedResult = {
                "display_title_text": "Some Title",
                "display_subtitle_text": "Some Subtitle"
            },
            oResult;

        oBag.getTextNames.returns(["display_title_text", "display_subtitle_text"]);
        oBag.getText.withArgs("display_title_text").returns("Some Title");
        oBag.getText.withArgs("display_subtitle_text").returns("Some Subtitle");
        oBag.getText.withArgs("display_search_keywords").returns("display_search_keywords");

        // Act
        oResult = ManifestPropertyHelper.getTranslatablePropertiesFromBag(oBag);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "The expected texts were returned");
    });

    QUnit.test("getTranslatablePropertiesFromBag returns the expected texts when title, subtitle and search keywords are available", function (assert) {
        // Arrange
        var oBag = {
                getTextNames: sinon.stub(),
                getText: sinon.stub()
            },
            oExpectedResult = {
                "display_title_text": "Some Title",
                "display_subtitle_text": "Some Subtitle",
                "display_search_keywords": "Some,Seach,Keywords,Separated,By,Comma"
            },
            oResult;

        oBag.getTextNames.returns(["display_title_text", "display_subtitle_text", "display_search_keywords"]);
        oBag.getText.withArgs("display_title_text").returns("Some Title");
        oBag.getText.withArgs("display_subtitle_text").returns("Some Subtitle");
        oBag.getText.withArgs("display_search_keywords").returns("Some,Seach,Keywords,Separated,By,Comma");

        // Act
        oResult = ManifestPropertyHelper.getTranslatablePropertiesFromBag(oBag);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "The expected texts were returned");
    });

    QUnit.test("getTranslatablePropertiesFromBag returns empty when no texts are available", function (assert) {
        // Arrange
        var oBag = {
                getTextNames: sinon.stub(),
                getText: sinon.stub()
            },
            oExpectedResult = {},
            oResult;

        oBag.getTextNames.returns([]);
        oBag.getText.withArgs("display_title_text").returns("display_title_text");
        oBag.getText.withArgs("display_subtitle_text").returns("display_subtitle_text");
        oBag.getText.withArgs("display_search_keywords").returns("display_search_keywords");

        // Act
        oResult = ManifestPropertyHelper.getTranslatablePropertiesFromBag(oBag);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "The expected texts were returned");
    });

    QUnit.test("getTranslatablePropertiesFromBag returns empty when no bag was provided", function (assert) {
        // Arrange
        var oExpectedResult = {},
            oResult;

        // Act
        oResult = ManifestPropertyHelper.getTranslatablePropertiesFromBag();

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "The expected texts were returned");
    });

    QUnit.test("getCardData: get the card data from the chip instance's bag and config in the FLPD", function (assert) {
        var oTileConfiguration = {
            "navigation_semantic_object": "SemanticObject",
            "navigation_semantic_parameters": "a=1000&b=foo"
        };
        var sTileConfiguration = JSON.stringify(oTileConfiguration);
        var oBag = {
            getTextNames: sinon.stub().returns(["display_title_text"]),
            getText: sinon.stub().withArgs("display_title_text").returns("title")
        };
        var oChipInstance = {
            bag: {
                getBag: sinon.stub().withArgs("tileProperties").returns(oBag)
            },
            configuration: {
                getParameterValueAsString: sinon.stub().withArgs("tileConfiguration").returns(sTileConfiguration)
            }
        };
        sinon.stub(ManifestPropertyHelper, "_parseParameters").withArgs( "a=1000&b=foo").returns({ a: 1000, b: "foo"});

        var oExpectedCardData = {
            "display_title_text": "title",
            "navigation_semantic_object": "SemanticObject",
            "navigation_semantic_parameters": "a=1000&b=foo",
            "navigation_semantic_parameters_as_object": {
                a: 1000,
                b: "foo"
            }
        };

        var oCardData = ManifestPropertyHelper.getCardData(oChipInstance);

        assert.deepEqual(oCardData, oExpectedCardData);
    });

    QUnit.test("getCardData: get the card data from the chip instance's bag and config in the FLP", function (assert) {
        var sTileConfiguration = JSON.stringify({ "intent_semantic_object": "SemanticObject"});
        var oBag = {
            getTextNames: sinon.stub().returns(["display_title_text"]),
            getText: sinon.stub().withArgs("display_title_text").returns("title")
        };
        var oChipInstance = {
            getBag: sinon.stub().withArgs("tileProperties").returns(oBag),
            getConfigurationParameter: sinon.stub().withArgs("tileConfiguration").returns(sTileConfiguration)
        };

        var oExpectedCardData = {
            "display_title_text": "title",
            "intent_semantic_object": "SemanticObject"
        };

        var oCardData = ManifestPropertyHelper.getCardData(oChipInstance);

        assert.deepEqual(oCardData, oExpectedCardData);
    });
});