// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for ClientSideTargetResolution's InboundList
 */
sap.ui.require([
    "sap/ushell/services/_ClientSideTargetResolution/InboundIndex",
    "sap/ushell/services/_ClientSideTargetResolution/Formatter",
    "sap/ushell/test/utils",
    "sap/ushell/utils"
], function (InboundIndex, oFormatter, testUtils, utils) {
    "use strict";

    /* global QUnit */

    var Q = QUnit;
    var mkInb = oFormatter.parseInbound;

    Q.module("InboundIndex", {
        setup: function () {
        },
        teardown: function () {
        }
    });

    Q.test("InboundIndex: can construct from an empty array", 4, function (assert) {
        var oIndex = InboundIndex.private.createIndex([]);

        ["index", "getSegment", "getSegmentByTags"].forEach(function (sMember) {
            assert.ok(oIndex[sMember], true,
                "Index object contains a member '" + sMember + "' as own or in its prototypal chain");
        });

        assert.deepEqual(oIndex.index, {
            segment: {},
            all: [],
            always: [],
            tag: {}
        }, "got the expected structure");
    });

    Q.test("InboundIndex: constructing an index leaves the original object intact", function (assert) {
        var aInbounds = [
            mkInb("#So1-a1"),
            mkInb("#So2-a2"),
            mkInb("#So3-a3"),
            mkInb("#SoX-aX"),
            mkInb("#SoX-aY"),
            mkInb("#SoX-aZ")
        ];

        var aInboundsClone = jQuery.extend(true, [], aInbounds);

        InboundIndex.private.createIndex(aInbounds);

        // Note: if an item of aInbounds is mutated by adding a new property to
        // it such that the new property is not enumerable this assertion will
        // yet not throw.
        Object.defineProperty( aInbounds, "If this was a number like <aInbounds.length.toString()> assertion would remain effective", {
            value: Object.create( null, {
                whatever: { value: "duh" }
            } )
        });
        Object.defineProperty( aInbounds[0], "assertion doesn't see this difference", {
            value: Object.create( null, {
                whatever: { value: "duh" }
            } )
        });
        assert.deepEqual(aInbounds, aInboundsClone);
    });

    Q.test("InboundIndex: can construct from a non empty array", 1, function (assert) {
        var aInbounds = [
            mkInb("#So1-a1"),
            mkInb("#So2-a2"),
            mkInb("#So3-a3"),
            mkInb("#SoX-aX"),
            mkInb("#SoX-aY"),
            mkInb("#SoX-aZ")
        ];

        var oIndex = InboundIndex.private.createIndex(aInbounds);

        assert.deepEqual(oIndex.index, {
            segment: {
                "So1": [aInbounds[0]],
                "So2": [aInbounds[1]],
                "So3": [aInbounds[2]],
                "SoX": [aInbounds[3], aInbounds[4], aInbounds[5]]
            },
            all: aInbounds,
            always: [],
            tag: {}
        });

    });

    Q.test("InboundIndex: can construct with tags", 1, function (assert) {
        var oIndex,
            oInbound1,
            oInbound2,
            oInbound3,
            oInbound4,
            oInbound5,
            oInbound6;

        oInbound1 = mkInb("#So1-a1");
        oInbound2 = mkInb("#So2-a2{[sap-tag:[tag1]]}");
        oInbound3 = mkInb("#So3-a3{[sap-tag:[tag2]]}");
        oInbound4 = mkInb("#So3-a4{[sap-tag:[tagA,tagB]]}"); // now interpreted as a single tag
        oInbound5 = mkInb("#So3-a5{sap-tag:tagC}"); // now interpreted as a single tag
        oInbound6 = mkInb("#So3-a6{[sap-tag:[tag2]]}");

        oIndex = InboundIndex.private.createIndex([
            oInbound1,
            oInbound2,
            oInbound3,
            oInbound4,
            oInbound5,
            oInbound6
        ]);

        assert.deepEqual(oIndex.index, {
            segment: {
                "So1": [oInbound1],
                "So2": [oInbound2],
                "So3": [oInbound3, oInbound4, oInbound5, oInbound6]
            },
            tag: {
                "tag1": [oInbound2],
                "tag2": [oInbound3, oInbound6],
                "tagA,tagB": [oInbound4]
            },
            all: [oInbound1, oInbound2, oInbound3, oInbound4, oInbound5, oInbound6],
            always: []
        });
    });

    Q.test("GetSegment: returns the expected segment", 1, function (assert) {
        var oIndex,
            oInbound6,
            oInbound5,
            oInbound4,
            oInbound3,
            oInbound2,
            oInbound1;

        oInbound1 = { semanticObject: "SoZ", action: "a1" };
        oInbound2 = { semanticObject: "SoZ", action: "a2" };
        oInbound3 = { semanticObject: "SoY", action: "a3" };
        oInbound4 = { semanticObject: "SoX", action: "aX" };
        oInbound5 = { semanticObject: "SoX", action: "aY" };
        oInbound6 = { semanticObject: "SoX", action: "aZ" };

        oIndex = InboundIndex.private.createIndex([
            oInbound1, oInbound2, oInbound3, oInbound4, oInbound5, oInbound6
        ]);

        assert.deepEqual(oIndex.getSegment("SoZ"), [
            oInbound1, oInbound2
        ], "Got the expected segment");
    });

    Q.test("GetSegment: appends the 'always' set to the response if any", 1, function (assert) {
        var oIndex,
            oInbound6,
            oInbound5,
            oInbound4,
            oInbound3,
            oInbound2,
            oInbound1;

        oInbound1 = { semanticObject: "SoZ", action: "a1" };
        oInbound2 = { semanticObject: "SoZ", action: "a2" };
        oInbound3 = { semanticObject: "SoY", action: "a3" };
        oInbound4 = { semanticObject: "SoX", action: "aX" };
        oInbound5 = { semanticObject: "*", action: "aY" };
        oInbound6 = { semanticObject: "*", action: "aZ" };

        oIndex = InboundIndex.private.createIndex([
            oInbound1, oInbound2, oInbound3, oInbound4, oInbound5, oInbound6
        ]);

        assert.deepEqual(oIndex.getSegment("SoZ"), [
            oInbound1, oInbound2, oInbound5, oInbound6
        ], "Got the expected segment plus the 'always' set");
    });

    Q.test("GetSegment: does not put '*' into a segment", 1, function (assert) {
        var oIndex,
            oInbound6,
            oInbound5,
            oInbound4,
            oInbound3,
            oInbound2,
            oInbound1;

        oInbound1 = { semanticObject: "SoZ", action: "a1" };
        oInbound2 = { semanticObject: "SoZ", action: "a2" };
        oInbound3 = { semanticObject: "SoY", action: "a3" };
        oInbound4 = { semanticObject: "SoX", action: "aX" };
        oInbound5 = { semanticObject: "*", action: "aY" };
        oInbound6 = { semanticObject: "*", action: "aZ" };

        oIndex = InboundIndex.private.createIndex([
            oInbound1, oInbound2, oInbound3, oInbound4, oInbound5, oInbound6
        ]);

        assert.deepEqual(oIndex.getSegment("*"), [
            oInbound1, oInbound2, oInbound3, oInbound4, oInbound5, oInbound6
        ], "Got the expected segment plus the 'always' set");
    });

    Q.test("private#tagInbound extracts tags from a given inbound", function ( assert ) {
        var aInbounds = [
            mkInb("#So1-a1{[sap-tag:[tag-1]]}"),
            mkInb("#So2-a2{[sap-tag:[tag-2]]}"),
            mkInb("#So3-a3"),
            mkInb("#So2-a4{[sap-tag:[tag-2]]}"),
            mkInb("#So2-identical:[tag-3]"),
            mkInb("#So2-identical:[tag-3]")
        ];

        (function() {
            var oIndex = {
                all: aInbounds,
                segment: {},
                always: [],
                tag: {}
            };

            aInbounds.forEach(function(oInbound) {
                InboundIndex.private.tagInbound(oInbound, oIndex);
            });

            [{
                got: oIndex.tag["tag-1"],
                expected: [
                    mkInb("#So1-a1{[sap-tag:[tag-1]]}")
                ],
                message: "the only inbound with tag-1 extracted"

            }, {
                got: oIndex.tag["tag-2"],
                expected: [
                    mkInb("#So2-a2{[sap-tag:[tag-2]]}"),
                    mkInb("#So2-a4{[sap-tag:[tag-2]]}")
                ],
                message: "the two inbounds with tag-2 were extracted"

            }, {
                got: oIndex.tag["tag-4"],
                expected: undefined,
                message: "no inbounds with tag-4 were extracted"

            }].forEach(function(oTest) {
                assert.deepEqual(oTest.got, oTest.expected, oTest.message);
            });
        })();
    });

    Q.test( "private#segmentInbound extracts tags from given inbound", function ( assert ) {
        var fnSegmentInbound = InboundIndex.private.segmentInbound;

        [
            {
                input: {
                    aInbounds: [ ]
                },
                expected: {
                    segment: { },
                    always: [ ]
                },
                message: "When inbounds list is empty, then calling \
segmentInbound does not change the given index"
            },
            {
                input: {
                    aInbounds: [ mkInb( "#So1-a1" ) ]
                },
                expected: {
                    segment: {
                        "So1": [ mkInb( "#So1-a1" ) ]
                    },
                    always: [ ]
                },
                message: "When inbounds list contains a single entry '#So1-a1', \
segmentation is performed as expected"
            },
            {
                input: {
                    aInbounds: [ mkInb( "#*-any" ) ]
                },
                expected: {
                    segment: { },
                    always: [ mkInb( "#*-any" ) ]
                },
                message: "When inbounds list contains a single entry '#*-any', \
segmentation is performed as expected"
            },
            {
                input: {
                    aInbounds: [
                        mkInb( "#So1-a1" ),
                        mkInb( "#So1-a2" ),
                        mkInb( "#So2-a2" ),
                        mkInb( "#So3-a3" ),
                        mkInb( "#*-always1" ),
                        mkInb( "#*-always1" )
                    ]
                },
                expected: {
                    segment: {
                        "So1": [
                            mkInb( "#So1-a1" ),
                            mkInb( "#So1-a2" )
                        ],
                        "So2": [ mkInb( "#So2-a2" ) ],
                        "So3": [ mkInb( "#So3-a3" ) ]
                    },
                    always: [
                        mkInb( "#*-always1" ),
                        mkInb( "#*-always1" )
                    ]
                },
                message: "When inbounds list contains multiple items of all \\n\
sorts, segmentation is performed as expected"
            }
        ].forEach( function ( oFixture ) {

            var oIndex = {
                segment: { },
                always: [ ]
            };

            oFixture.input.aInbounds.forEach( function ( oInbound ) {
                fnSegmentInbound( oInbound, oIndex );
            } );

            assert.deepEqual( oIndex, oFixture.expected, oFixture.message );
        } );
    } );

    Q.test( "#getSegmentByTags returns a union of inbounds in the segments identified by its given list of tags", function ( assert ) {
        var oIndex = InboundIndex.private.createIndex([
            mkInb("#So1-a1"),
            mkInb("#So2-a2{[sap-tag:[tag-1]]}"),
            mkInb("#So3-a3{[sap-tag:[tag-5]]}"),
            mkInb("#Un-taggedA"),
            mkInb("#Foo-bar"),
            mkInb("#SoX-aX{[sap-tag:[tag-1]]}"),
            mkInb("#SoX-aY{[sap-tag:[tag-1]]}"),
            mkInb("#SoX-aZ"),
            mkInb("#*-any1"),
            mkInb("#Un-taggedB"),
            mkInb("#Soy-milk{[sap-tag:[tag-4]]}")
        ]);

        [
            {
                input: {
                    tags: [ ]
                },
                message: "When given an empty list of tags the returned segment is empty",
                expectedSegment: [ ]
            },
            {
                input: {
                    tags: [ "tag-N/A" ]
                },
                message: "When given a list containing a single but non-existing\
 tag the returned segment is empty",
                expectedSegment: [ ]
            },
            {
                input: {
                    tags: [ "tag-1" ]
                },
                message: "When given a list containing a single tag, inbounds \
associated with the single tag is correctly returned in a segment",
                expectedSegment: [
                    mkInb("#So2-a2{[sap-tag:[tag-1]]}"),
                    mkInb("#SoX-aX{[sap-tag:[tag-1]]}"),
                    mkInb("#SoX-aY{[sap-tag:[tag-1]]}")
                ]
            },
            {
                input: {
                    tags: [
                        "tag-4",
                        "tag-5",
                        "tag-N/A"
                    ]
                },
                message: "When given an list of tags including a non-existing \
tag, only inbounds associated with the tags which are existing are returned",
                expectedSegment: [
                    mkInb("#Soy-milk{[sap-tag:[tag-4]]}"),
                    mkInb("#So3-a3{[sap-tag:[tag-5]]}")
                ]
            }
        ].forEach( function ( oFixture ) {
            var aActualSegment = oIndex.getSegmentByTags( oFixture.input.tags );

            assert.deepEqual( aActualSegment, oFixture.expectedSegment, oFixture.message );
        } );
    } );
});
