sap.ui.require([
], function () {
    "use strict";
    /* eslint-disable */ // TBD: make ESLint conform

    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.Layout");
    jQuery.sap.require("sap.ushell.ui.launchpad.TileContainer");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.m.GenericTile");

    var oRenderer;

    function Tile(size, text) {
        this.size = size;
        this._long = this.size=="2x1";
        this.domRef = $('<div></div>').get(0);
        this.oData = {};
        this.metadata = {
            getName: function () {
            }
        }
    }
    Tile.prototype = {
        getSize: function () {
            return size;
        },
        getLong: function () {
            return this._long;
        },
        getDomRef: function () {
            return this.domRef;
        },
        data: function(prop, val){
            this.oData[prop] = val;
        },
        getParent: function () {
        },
        getMetadata: function () {
            return this.metadata;
        }
    }

    function Group(tiles) {
        this._innerContainer = $('<div></div>').get(0);
        this.tiles = tiles;
        this.oData = {};
    }
    Group.prototype =  {
        getInnerContainersDomRefs: function () {
            return this._innerContainer;
        },
        getTiles: function () {
            return this.tiles;
        },
        data: function(prop, val){
            this.oData[prop] = val;
        },
        getShowPlaceholder: function () {
            return false;
        },
        getIsGroupLocked: function() {
            return false;
        }
    }

    module("sap.ushell.components.tiles.layout.Layout", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(function () {
                oRenderer = sap.ushell.Container.getRenderer("fiori2");
                var container = $('<div id="layoutWrapper" style="position: absolute;"></div>').width(1800).appendTo('body'),
                    demiItemData = {
                        showHeader : false,
                        showPlaceholder : false,
                        showGroupHeader : true,
                        groupHeaderLevel : sap.m.HeaderLevel.H3,
                        showNoData : true,
                        tiles : {},
                        supportLinkPersonalization: true
                    };
                this.oTileContainer = new sap.ushell.ui.launchpad.TileContainer(demiItemData);
                sap.ushell.Layout.init({getGroups: function(){return[]}, container: container.get(0) });

                start();
            }.bind(this));
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            $('#layoutWrapper').remove();
            this.oTileContainer.destroy();
            delete sap.ushell.Layout.cfg;
            delete sap.ushell.Layout.container;
            sap.ushell.Layout.isInited = false;
            delete sap.ushell.Container;
        }
    });
    test("Test _getIntersectedLink", function () {
      //TODO
      ok(true);
    });
    test("Test _addLinkToHashMap", function () {
        var collidedLinksHashMap = [],
            done = assert.async(),
            oLink = new sap.m.GenericTile ({
                        mode: sap.m.GenericTileMode.LineMode,
                        subheader: "subtitle 1",
                        header: "header 1"
                    });
      this.oTileContainer.addLink(oLink);
      this.oTileContainer.placeAt($('#layoutWrapper'));
      setTimeout(function() {
          sap.ushell.Layout.layoutEngine._addLinkToHashMap(collidedLinksHashMap, this.oTileContainer, {width: 100}, 0, oLink);
          ok(collidedLinksHashMap[0].length === 7, "link og width 100 should be duplicated 7=((100+20)/20 + 1) times in the map");
          ok(collidedLinksHashMap[0][3].leftSide, "the left area of the link is marked with leftSide flag");
          ok(!collidedLinksHashMap[0][4].leftSide, "the right area of the link is marked with leftSide==flase flag");
          done();
      }.bind(this), 0);
    });
    test("Test handlePlaceHolder", function () {
        var removeLinkDropMarkerStub = sinon.stub(sap.ushell.Layout.layoutEngine, '_removeLinkDropMarker').returns(true),
            handlePlaceholderChangeStub = sinon.stub(sap.ushell.Layout.layoutEngine, 'handlePlaceholderChange').returns(true),
            changeLinkPlaceholderStub = sinon.stub(sap.ushell.Layout.layoutEngine, '_changeLinkPlaceholder').returns(true);

       sap.ushell.Layout.layoutEngine.endAreaChanged = true;
       sap.ushell.Layout.layoutEngine.endArea = "tiles";
       sap.ushell.Layout.layoutEngine.handlePlaceHolder();
       ok(removeLinkDropMarkerStub.calledOnce, "should be called once");
       ok(handlePlaceholderChangeStub.calledOnce, "should be called once");
       ok(!changeLinkPlaceholderStub.calledOnce, "should not be called");
       removeLinkDropMarkerStub.reset();
       handlePlaceholderChangeStub.reset();
       changeLinkPlaceholderStub.reset();

       sap.ushell.Layout.layoutEngine.intersectedLink = true;
       sap.ushell.Layout.layoutEngine.endAreaChanged = true;
       sap.ushell.Layout.layoutEngine.endArea = "links";
       sap.ushell.Layout.layoutEngine.handlePlaceHolder();
       ok(changeLinkPlaceholderStub.calledOnce, "should be called once");
       ok(handlePlaceholderChangeStub.calledOnce, "should be called once");
       ok(!removeLinkDropMarkerStub.calledOnce, "should not be called");
       removeLinkDropMarkerStub.reset();
       handlePlaceholderChangeStub.reset();
       changeLinkPlaceholderStub.reset();

       sap.ushell.Layout.layoutEngine.endArea = "tiles";
       sap.ushell.Layout.layoutEngine.endAreaChanged = false;
       sap.ushell.Layout.layoutEngine.handlePlaceHolder();
       ok(!changeLinkPlaceholderStub.calledOnce, "should not be called");
       ok(handlePlaceholderChangeStub.calledOnce, "should be called once");
       ok(!removeLinkDropMarkerStub.calledOnce, "should not be called");
       removeLinkDropMarkerStub.reset();
       handlePlaceholderChangeStub.reset();
       changeLinkPlaceholderStub.reset();

       sap.ushell.Layout.layoutEngine.endArea = "links";

       sap.ushell.Layout.layoutEngine.handlePlaceHolder();
       ok(changeLinkPlaceholderStub.calledOnce, "should not be called");
       ok(!handlePlaceholderChangeStub.calledOnce, "should be called once");
       ok(!removeLinkDropMarkerStub.calledOnce, "should not be called");

      removeLinkDropMarkerStub.restore();
      handlePlaceholderChangeStub.restore();
      changeLinkPlaceholderStub.restore();
    });
    test("Test _getDestinationIndex", function () {
        var oLink = new sap.m.GenericTile ({
                      mode: sap.m.GenericTileMode.LineMode,
                      subheader: "subtitle 1",
                      header: "header 1"
                  }),
            oGetDestinationTileIndexStub = sinon.stub(sap.ushell.Layout.layoutEngine, '_getDestinationTileIndex').returns(true);

        sap.ushell.Layout.layoutEngine._getDestinationIndex('tiles');
        ok(oGetDestinationTileIndexStub.called, "if the passed param is not 'links' then '_getDestinationTileIndex' function should compute the return value");

        this.oTileContainer.addLink(oLink);
        sap.ushell.Layout.layoutEngine.item = oLink;
        sap.ushell.Layout.layoutEngine.endGroup = this.oTileContainer;

        sap.ushell.Layout.layoutEngine.intersectedLink = undefined;
        ok(sap.ushell.Layout.layoutEngine._getDestinationIndex('links'), "the return value should be the number of links in endGroup");

        sap.ushell.Layout.layoutEngine.intersectedLink = {
            link: oLink,
            leftSide: false
        };
        ok(sap.ushell.Layout.layoutEngine._getDestinationIndex('links') === 0, "the return value should be 0 because intersectedl.id === draggedLink.id and we dropped on the right");

        oGetDestinationTileIndexStub.restore();
    });
    test("Test _handleLinkAreaIntersection", function () {
        var oNewLinkContainerEnabledStub = sinon.stub(sap.ushell.Layout.layoutEngine, '_getIntersectedLink').returns(true),
            oMapGroupLinksStub = sinon.stub(sap.ushell.Layout.layoutEngine, '_mapGroupLinks').returns(true),
            oMarkEmptyLinkArea = sinon.stub(sap.ushell.Layout.layoutEngine, '_markEmptyLinkArea').returns(true);

        sap.ushell.Layout.layoutEngine.matrix = {};
        sap.ushell.Layout.layoutEngine._handleLinkAreaIntersection(this.oTileContainer, 0, 0);

        ok(sap.ushell.Layout.layoutEngine.intersectedLink, "if intersected link is found then we should save it");
        ok(oMapGroupLinksStub.called, "we should map the group links");
        ok(oMarkEmptyLinkArea.called, "we should mark empty lionk area");

        oNewLinkContainerEnabledStub.restore();
        oMapGroupLinksStub.restore();
        oMarkEmptyLinkArea.restore();
    });
    test("Test _isLinksEquals", function () {
      var oLinkA = {
          link: new sap.m.GenericTile ({
                    mode: sap.m.GenericTileMode.LineMode,
                    subheader: "subtitle 1",
                    header: "header 1"
                })
            },
            oLinkB = {
            link: new sap.m.GenericTile ({
                      mode: sap.m.GenericTileMode.LineMode,
                      subheader: "subtitle 2",
                      header: "header 2"
                  })
            };
        ok(!sap.ushell.Layout.layoutEngine._isLinksEquals(oLinkA, oLinkB), "links should be different");
        ok(sap.ushell.Layout.layoutEngine._isLinksEquals(oLinkA, oLinkA), "links should be equal");
        oLinkA.link.destroy();
        oLinkB.link.destroy();
    });
    test("Test _markEmptyLinkArea", function () {
        var done = assert.async();
        this.oTileContainer.placeAt($('#layoutWrapper'));
        setTimeout(function() {
            sap.ushell.Layout.layoutEngine._markEmptyLinkArea(this.oTileContainer);
            ok(jQuery('.sapUshellEmptyLinkAreaHover').length, "there's no links, therefor this container should be marked with 'sapUshellEmptyLinkAreaHover' class");
            done();
        }.bind(this), 0);
    });
    test("Test _removeEmptyLinkAreaMark", function () {
        var done = assert.async();
        this.oTileContainer.placeAt($('#layoutWrapper'));
        setTimeout(function() {
            sap.ushell.Layout.layoutEngine._markEmptyLinkArea(this.oTileContainer);
            ok(jQuery('.sapUshellEmptyLinkAreaHover').length, "there's no links, therefor this container should be marked with 'sapUshellEmptyLinkAreaHover' class");
            sap.ushell.Layout.layoutEngine._removeEmptyLinkAreaMark(this.oTileContainer);
            ok(!jQuery('.sapUshellEmptyLinkAreaHover').length, "this container should not be marked with 'sapUshellEmptyLinkAreaHover' class");
            done();
        }.bind(this), 0);
    });
    test("Test saveLinkBoundingRects", function () {
        var done = assert.async(),
            oLink = new sap.m.GenericTile ({
                      mode: sap.m.GenericTileMode.LineMode,
                      subheader: "subtitle 1",
                      header: "header 1"
                  });
        oLink.placeAt($('#layoutWrapper'));
        setTimeout(function() {
            var oBoundingRects = oLink.getBoundingRects();
            sap.ushell.Layout.layoutEngine.saveLinkBoundingRects(oLink.getDomRef());
            ok(sap.ushell.Layout.layoutEngine.draggedLinkBoundingRects);//we should only test that the object was created (the rest is up to UI5)
            oLink.destroy();
            done();
        }.bind(this), 0);
    });
    test("Test _getLinkDropMarkerElement", function () {
        var elDropMarker = sap.ushell.Layout.layoutEngine._getLinkDropMarkerElement();
        ok(elDropMarker.id === "sapUshellLinkDropMarker", "the id should be 'sapUshellLinkDropMarker' and cannot be change without changing it in all relevant places");
    });
    test("Test _removeLinkDropMarker", function () {
      var elDropMarker = sap.ushell.Layout.layoutEngine._getLinkDropMarkerElement();
      $('#layoutWrapper').append(elDropMarker);
      ok(jQuery("#" + elDropMarker.id).length, "dropmarker should be on dom");
      sap.ushell.Layout.layoutEngine._removeLinkDropMarker();
      ok(!jQuery("#" + elDropMarker.id).length, "dropmarker should not be on dom");
    });
    test("Test _getLinkBoundingRects - case: current dragged item id not equals given link id", function () {
        var done = assert.async(),
            oLinkA = new sap.m.GenericTile ({
                      mode: sap.m.GenericTileMode.LineMode,
                      subheader: "subtitle 1",
                      header: "header 1"
                  }),
                getBoundingRectsStub = sinon.stub(oLinkA, 'getBoundingRects').returns({
                    id: 'identifier2',
                    length: 0
                });
        sap.ushell.Layout.layoutEngine.draggedLinkBoundingRects = {
            id: 'identifier1',
            length: 0
        };
        this.oTileContainer.addLink(oLinkA);
        this.oTileContainer.placeAt($('#layoutWrapper'));
        setTimeout(function() {
            var boundingRects = sap.ushell.Layout.layoutEngine._getLinkBoundingRects(oLinkA, this.oTileContainer);
            ok(boundingRects.id === 'identifier2', "the dragged item is not equal to oLinkA, therefor we should get the bounding rect of oLinkA");
            sap.ushell.Layout.layoutEngine.item = oLinkA;
            boundingRects = sap.ushell.Layout.layoutEngine._getLinkBoundingRects(oLinkA, this.oTileContainer);
            ok(boundingRects.id === 'identifier1', "the dragged item is equal to oLinkA, therefor we should get the bounding rect of the dragged item");
            done();
        }.bind(this), 0);
    });
    test("Test switchLinkWithClone", function () {
        var done = assert.async(),
            oLink = new sap.m.GenericTile ({
                      mode: sap.m.GenericTileMode.LineMode,
                      subheader: "subtitle 1",
                      header: "header 1"
                  });
       oLink.placeAt($('#layoutWrapper'));
      setTimeout(function() {
          ok(oLink.getDomRef(),"oLink should be on the dom");
          sap.ushell.Layout.layoutEngine.switchLinkWithClone(oLink);
          ok(!oLink.getDomRef(),"oLink should not be on the dom");
          ok(jQuery("#sapUshellIntersectedLinkPlaceHolder").length,"the clone should be on the dom");
          oLink.destroy();
          done();
      }.bind(this), 0);
    });
    test("Test isAreaChanged", function () {
        var oLink = new sap.m.GenericTile ({
                      mode: sap.m.GenericTileMode.LineMode,
                      subheader: "subtitle 1",
                      header: "header 1"
                  });
        sap.ushell.Layout.layoutEngine.currentArea = undefined;
        sap.ushell.Layout.layoutEngine.endArea = "links";
        ok(!sap.ushell.Layout.layoutEngine.isAreaChanged(oLink), "area was not changed if currentArea = undefined");
        sap.ushell.Layout.layoutEngine.currentArea = "links";
        sap.ushell.Layout.layoutEngine.endArea = undefined;
        ok(!sap.ushell.Layout.layoutEngine.isAreaChanged(oLink), "area was not changed if endArea = undefined");
        sap.ushell.Layout.layoutEngine.currentArea = "links";
        sap.ushell.Layout.layoutEngine.endArea = "tiles";
        ok(sap.ushell.Layout.layoutEngine.isAreaChanged(oLink), "area has changed");
        sap.ushell.Layout.layoutEngine.currentArea = "links";
        sap.ushell.Layout.layoutEngine.endArea = "links";
        ok(!sap.ushell.Layout.layoutEngine.isAreaChanged(oLink), "area did not change");
        oLink.destroy();
    });
    test("Test _mapGroupLinks", function () {
        var oLink = new sap.m.GenericTile ({
                      mode: sap.m.GenericTileMode.LineMode,
                      subheader: "subtitle 1",
                      header: "header 1"
                  }),
                addLinkToHashMapStub = sinon.stub(sap.ushell.Layout.layoutEngine, '_addLinkToHashMap').returns(true);
        this.oTileContainer.addLink(oLink);
        sap.ushell.Layout.layoutEngine._mapGroupLinks(this.oTileContainer);
        //we test only that the group was added. '_addLinkToHashMap' is responsible for population of the object we added to the map so in it's qUnit we will test the rest of the hash mechanism logic
        ok(sap.ushell.Layout.layoutEngine.collidedLinkAreas[this.oTileContainer.getId()], "group was added to the map");
        addLinkToHashMapStub.restore();
    });
    test("Test _isLinkAreaIntersection", function () {
        var done = assert.async(),
          oLink = new sap.m.GenericTile ({
                    mode: sap.m.GenericTileMode.LineMode,
                    subheader: "subtitle 1",
                    header: "header 1"
                });
      this.oTileContainer.addLink(oLink);
      this.oTileContainer.placeAt($('#layoutWrapper'));
      setTimeout(function() {
          var containerRect = oLink.getDomRef().getBoundingClientRect(),
              bIntesected = sap.ushell.Layout.layoutEngine._isLinkAreaIntersection(this.oTileContainer, containerRect.left, containerRect.top);
          ok(bIntesected, "we intersected link area");
          done();
      }.bind(this), 0);
    });
    test("Test _changeLinkPlaceholder", function () {
        var done = assert.async(),
            oLink = {
                link: new sap.m.GenericTile ({
                          mode: sap.m.GenericTileMode.LineMode,
                          subheader: "subtitle 1",
                          header: "header 1"
                      })
                  };
      this.oTileContainer.addLink(oLink.link);
      sap.ushell.Layout.layoutEngine.aLinksBoundingRects[oLink.link.getId()] = {
          left: 1,
          topLeft: 2,
          right: 3,
          topRight: 4
      };
      this.oTileContainer.placeAt($('#layoutWrapper'));
      setTimeout(function() {
          sap.ushell.Layout.layoutEngine.LinkDropMarker = sap.ushell.Layout.layoutEngine._getLinkDropMarkerElement();
          oLink.leftSide = true;
          sap.ushell.Layout.layoutEngine._changeLinkPlaceholder(oLink, this.oTileContainer);
          ok(jQuery(sap.ushell.Layout.layoutEngine.LinkDropMarker).css('left') === "1px");
          ok(jQuery(sap.ushell.Layout.layoutEngine.LinkDropMarker).css('top') === "2px");
          oLink.leftSide = false;
          sap.ushell.Layout.layoutEngine._changeLinkPlaceholder(oLink, this.oTileContainer);
          ok(jQuery(sap.ushell.Layout.layoutEngine.LinkDropMarker).css('left') === "3px");
          ok(jQuery(sap.ushell.Layout.layoutEngine.LinkDropMarker).css('top') === "4px");
          done();
      }.bind(this), 0);
    });

    test("Test getCollisionObject - behavior when TabBar is active or not", function () {
        var oIsTabBarCollisionStub = sinon.stub(sap.ushell.Layout.getLayoutEngine(), "_isTabBarCollision").returns(true),
            oIsTabBarActiveStub = sinon.stub(sap.ushell.Layout.getLayoutEngine().thisLayout, "isTabBarActive").returns(true),
            oGetGroupCollisionObjectStub = sinon.stub(sap.ushell.Layout.getLayoutEngine(), "_getGroupCollisionObject"),
            clearTimeoutStub = sinon.stub(window, "clearTimeout").returns(true),
            oGetCollisionObjectResult;

        sap.ushell.Layout.oTabBarItemClickTimer = {};
        oGetCollisionObjectResult = sap.ushell.Layout.getLayoutEngine().getCollisionObject();
        ok(oGetCollisionObjectResult.collidedObjectType === "TabBar", "On TabBar collision - the string TabBar is returned");
        ok(clearTimeout.calledOnce === true, "On entering getCollisionObject - clearing the timeout if oTabBarItemClickTimer is true");

        oIsTabBarActiveStub.restore();

        // Not TabBar collision use-case
        oIsTabBarActiveStub = sinon.stub(sap.ushell.Layout.getLayoutEngine().thisLayout, "isTabBarActive").returns(false);
        sap.ushell.Layout.oTabBarItemClickTimer = undefined;

        oGetCollisionObjectResult = sap.ushell.Layout.getLayoutEngine().getCollisionObject(100, 200);
        ok(oGetGroupCollisionObjectStub.calledOnce === true, "When not TabBar collision - _getGroupCollisionObject called");
        ok(oGetGroupCollisionObjectStub.args[0][0] === 100, "When not TabBar collision - _getGroupCollisionObject called with correct moveX");
        ok(oGetGroupCollisionObjectStub.args[0][1] === 200, "When not TabBar collision - _getGroupCollisionObject called with correct moveY");
        ok(clearTimeout.calledOnce === true, "On entering getCollisionObject - not clearing the timeout if oTabBarItemClickTimer is not defined");

        oGetGroupCollisionObjectStub.restore();
        oIsTabBarCollisionStub.restore();
        oIsTabBarActiveStub.restore();
        clearTimeoutStub.restore();
    });

    test("Test _getGroupCollisionObject", function () {
        var bIsGroupLockedResult = true,
            oGetCollidedGroupStub = sinon.stub(sap.ushell.Layout.getLayoutEngine(), "_getCollidedGroup").returns({
                groupId: "group1",
                getIsGroupLocked : function () {
                    return bIsGroupLockedResult;
                },
                getTiles: function () {
                    return [];
                },
                getShowPlaceholder: function () {
                    return null;
                }

            }),
            oIsLinkAreaIntersectionStub = sinon.stub(sap.ushell.Layout.getLayoutEngine(), "_isLinkAreaIntersection").returns(true),
            oGetCollidedGroupResult;

        oGetCollidedGroupResult = sap.ushell.Layout.getLayoutEngine()._getGroupCollisionObject(100, 200);
        ok(oGetCollidedGroupResult === undefined, "_getGroupCollisionObject return undefined when the collided group is locked");

        // Group is not locked
        bIsGroupLockedResult = false;
        oGetCollidedGroupResult = sap.ushell.Layout.getLayoutEngine()._getGroupCollisionObject(100, 200);
        ok(oGetCollidedGroupResult.collidedObjectType === "Group-link", "Returned collidedObjectType is Group-link, according to _isLinkAreaIntersection");
        ok(oGetCollidedGroupResult.collidedObject.groupId === "group1", "Correct group object returned");

        oIsLinkAreaIntersectionStub.restore();
        oIsLinkAreaIntersectionStub = sinon.stub(sap.ushell.Layout.getLayoutEngine(), "_isLinkAreaIntersection").returns(false);
        oGetCollidedGroupResult = sap.ushell.Layout.getLayoutEngine()._getGroupCollisionObject(100, 200);
        ok(oGetCollidedGroupResult.collidedObjectType === "Group-tile", "Returned collidedObjectType is Group-tile, according to _isLinkAreaIntersection");

        oIsLinkAreaIntersectionStub.restore();
        oGetCollidedGroupStub.restore();
    });

    asyncTest("Test _handleTabBarCollision", function () {
    	var oClock = sinon.useFakeTimers(),
    	    oTabBarItem = {
        	    getAttribute : function (sAttrId) {
        	    	if (sAttrId === 'modelGroupId') {
                        return "modelId";
        	    	}
        	    },
        	    classList : {
        	        add : function () {}
        	    }
        	},
        	oTabBarItem2 = {
        	    getAttribute : function (sAttrId) {
        		    if (sAttrId === 'modelGroupId') {
                        return "modelId2";
                    }
        	    },
        	    classList : {
        	        add : function () {}
        	    }
        	},
            oGetPathSpy = sinon.spy(),
        	oItemGetBindingContext = function () {
        		return {
        		    getPath : oGetPathSpy,
    			    oModel : {
    	   		        setProperty : oItemModelSetPropertySpy
                    }
        		};
        	},
            oGetTabBarHoverItemStub = sinon.stub(sap.ushell.Layout.getLayoutEngine(), "_getTabBarHoverItem").returns(oTabBarItem),
    	    oGetTabBarGroupIndexByModelIdStub = sinon.stub(sap.ushell.Layout.getLayoutEngine(), "_getTabBarGroupIndexByModelId").returns(8),
            oSetOnTabBarElementStub = sinon.stub(sap.ushell.Layout, "setOnTabBarElement").returns({}),
            oHandleOverflowCollisionStub = sinon.stub(sap.ushell.Layout.getLayoutEngine(), "_handleOverflowCollision").returns(false),
            oPrepareDomForDragAndDrop = sinon.stub(sap.ushell.Layout.getLayoutEngine(), "_prepareDomForDragAndDrop").returns(),
            oGetSelectedTabBarItemStub = sinon.stub(sap.ushell.Layout.getLayoutEngine(), "_getSelectedTabBarItem").returns(oTabBarItem),
            bIsGroupLockedResult = false,
            oGetDropTargetGroupStub = sinon.stub(sap.ushell.Layout.getLayoutEngine(), "_getDropTargetGroup").returns({
                groupId : "groupId"
            }),
            oGetGroupTilesStub = sinon.stub(sap.ushell.Layout, "getGroupTiles").returns([]),
    	    oGetModelGroupByIdStub = sinon.stub(sap.ushell.Layout.getLayoutEngine(), "_getModelGroupById").returns({
    	    	isGroupLocked : bIsGroupLockedResult
    	    }),
            oToggleAnchorItemHighlightingStub = sinon.stub(sap.ushell.Layout.getLayoutEngine(), '_toggleAnchorItemHighlighting'),
    	    oItemModelSetPropertySpy = sinon.spy(),
    	    oRemoveAggregationSpy = sinon.spy();

    	sap.ushell.Layout.getLayoutEngine().item = {
    		getBindingContext : oItemGetBindingContext,
    	    getDomRef : function () {}
    	};
        sap.ushell.Layout.getLayoutEngine().startGroup = {
        	 removeAggregation : oRemoveAggregationSpy,
        	 getGroupId : function () {
                 return "startGroupId";
        	 }
        };

        // Test flow 1:
        // Calling _handleTabBarCollision, in which passing 800ms are passed and the collided tab is the one which is already highlighted.
        // The test itself is verifying that the function returns before long-drag use-case is being processed
        sap.ushell.Layout.getLayoutEngine().lastHighlitedTabItem = oTabBarItem;
    	sap.ushell.Layout.getLayoutEngine()._handleTabBarCollision();
    	oClock.tick(1000);
    	ok(oGetPathSpy.callCount === 0, "If lastHighlitedTabItem equals _getSelectedTabBarItem - then return");
    	ok(oRemoveAggregationSpy.callCount === 0, "If lastHighlitedTabItem equals _getSelectedTabBarItem - then the tile is not removed from the source group");

        // Test flow 2:
        // Calling _handleTabBarCollision, in which passing 800ms are passed and the collided tab is NOT the one which is already highlighted.
        // The test itself is verifying that the function perform the switch-tab flow
    	oGetTabBarHoverItemStub.restore();
    	oGetTabBarHoverItemStub = sinon.stub(sap.ushell.Layout.getLayoutEngine(), "_getTabBarHoverItem").returns(oTabBarItem2);
    	sap.ushell.Layout.getLayoutEngine()._handleTabBarCollision();
    	oClock.tick(1000);
    	ok(oGetPathSpy.callCount === 1, "If lastHighlitedTabItem does not equal _getSelectedTabBarItem - continue proccessing of long-drag");
    	ok(oRemoveAggregationSpy.callCount === 1, "If lastHighlitedTabItem does not equal _getSelectedTabBarItem - then the tile is removed from the source group");

        // Restore:
        oGetTabBarGroupIndexByModelIdStub.restore();
        oGetSelectedTabBarItemStub.restore();
        oGetGroupTilesStub.restore();
        oPrepareDomForDragAndDrop.restore();
        oGetTabBarHoverItemStub.restore();
        oGetSelectedTabBarItemStub.restore();
        oSetOnTabBarElementStub.restore();
        oHandleOverflowCollisionStub.restore();
        oToggleAnchorItemHighlightingStub.restore();
        oGetDropTargetGroupStub.restore();
	    oGetModelGroupByIdStub.restore();

        start();
        oClock.restore();
    });

    test("styleInfo Test", function () {
        //sap.ushell.Layout.init({getGroups: function(){}, container: document.body});
        var styleInfo = sap.ushell.Layout.getStyleInfo(document.body);
        ok(typeof styleInfo == "object");
        ok(typeof styleInfo.tileMarginWidth == "number");
        ok(typeof styleInfo.tileMarginHeight == "number");
        ok(typeof styleInfo.tileWidth == "number" && styleInfo.tileWidth>0);
        ok(typeof styleInfo.tileHeight == "number" && styleInfo.tileHeight>0);
        ok(typeof styleInfo.containerWidth == "number" && styleInfo.containerWidth>0);
    });

    test("organizeGroup Test", function () {
        var tile1 = new Tile('1x1');
        var tile2 = new Tile('2x1');
        var styleInfo = sap.ushell.Layout.getStyleInfo(document.body);
        sap.ushell.Layout.tilesInRow = 5;
        var matrix = sap.ushell.Layout.organizeGroup([tile1, tile2]);
        ok(matrix[0][0]==tile1);
        ok(matrix[0][1]==tile2);
        ok(matrix[0][2]==tile2);
    });

    test("calcTilesInRow Test", function () {
        var tilesInRow = sap.ushell.Layout.calcTilesInRow(500, 130, 5);
        ok(tilesInRow == 3);
        tilesInRow = sap.ushell.Layout.calcTilesInRow(5000, 130, 5);
        ok(tilesInRow==37);
    });

    test("Layout calculation Test", function () {
        var oController = new sap.ui.controller("sap.ushell.components.homepage.DashboardContent");

        oController.getView = sinon.stub().returns({
            getParent : sinon.stub().returns({
                getCurrentPage: sinon.stub().returns({
                    getViewName: sinon.stub().returns(function () {
                        return "name";
                    })
                })
            }),
            getViewName : sinon.stub().returns(function () {
                return "otherName";
            }),
            getModel : sinon.stub().returns({
                getProperty : sinon.stub().returns('home')
            })
        });

        try {
            oController.resizeHandler();
        } catch (e){
            ok(false,"Layout calculation was done not in home page");
        }

        ok(true,"Layout calculation Test");
        oController.destroy();
    });

    test("reRenderGroupsLayout Test", function () {
        var group1 = new Group([new Tile('2x2'), new Tile('1x1')]);
        var group2 = new Group([new Tile('2x2'), new Tile('1x1')]);
        sap.ushell.Layout.reRenderGroupsLayout([group1,group2], true);
        ok(typeof group1.oData.containerHeight === "undefined");
        ok(typeof group2.oData.containerHeight === "undefined");
        sap.ushell.Layout.reRenderGroupsLayout([group1,group2]);

        var style = sap.ushell.Layout.getStyleInfo(sap.ushell.Layout.container);
        ok(sap.ushell.Layout.styleInfo.containerWidth === style.containerWidth);
        var tilesInRow =  sap.ushell.Layout.calcTilesInRow(style.containerWidth, style.tileWidth, style.tileMarginWidth);
        ok(sap.ushell.Layout.tilesInRow === tilesInRow);
    });

    test("getTilePositionInMatrix Test", function () {
        var tile1 = new Tile('1x1');
        var tile2 = new Tile('2x1');
        var tile3 = new Tile('2x1');
        var tile4 = new Tile('2x1');
        var tile5 = new Tile('2x1');
        var tile6 = new Tile('1x1');
        sap.ushell.Layout.tilesInRow = 2;
        var matrix = sap.ushell.Layout.organizeGroup([tile1, tile2, tile3, tile4, tile5, tile6]);
        var place = sap.ushell.Layout.getTilePositionInMatrix(tile1,matrix);
        deepEqual(place, {row:0,col:0});
        var place = sap.ushell.Layout.getTilePositionInMatrix(tile2,matrix);
        deepEqual(place, {row:1,col:0});
        var place = sap.ushell.Layout.getTilePositionInMatrix(tile5,matrix);
        deepEqual(place, {row:4,col:0});
    });

    test("findTileToPlaceAfter Test", function () {
        var tile1 = new Tile('1x1');
        var tile2 = new Tile('2x1');
        var tile3 = new Tile('1x1');
        var tile4 = new Tile('2x1');
        sap.ushell.Layout.tilesInRow = 4;
        var matrix = sap.ushell.Layout.organizeGroup([tile1, tile2, tile3, tile4]);
        sap.ushell.Layout.layoutEngine.init();
        sap.ushell.Layout.layoutEngine.curTouchMatrixCords.column = 2;
        sap.ushell.Layout.layoutEngine.curTouchMatrixCords.row = 1;
        var maxTileIndex = sap.ushell.Layout.layoutEngine.findTileToPlaceAfter(matrix, [tile1, tile2, tile3, tile4]);
        equal(maxTileIndex, 3);
    });


    test("handlePlaceholderChange Test", function () {
        var le = sap.ushell.Layout.layoutEngine;
        var tile1 = new Tile('1x1');
        var tile2 = new Tile('1x1');
        var tile3 = new Tile('1x1');
        var tile4 = new Tile('1x1');
        var tile5 = new Tile('2x1');
        var group = new Group([tile1, tile2, tile3, tile4]);
        sap.ushell.Layout.tilesInRow = 4;
        var matrix = sap.ushell.Layout.organizeGroup([tile1, tile2, tile3, tile4]);
        le.init();
        le.curTouchMatrixCords.column = 2;
        le.curTouchMatrixCords.row = 1;
        le.startGroup = le.currentGroup = le.endGroup = group;
        le.matrix = matrix;
        le.item = tile5;
        le.reorderTilesInDom = sinon.stub().returns();
        le.handlePlaceholderChange();
        ok(le.matrix[1][1] == tile5);
        le.item = tile4;
        le.curTouchMatrixCords.column = 3;
        le.curTouchMatrixCords.row = 3;
        ok(le.matrix[0][3] == tile4);
    });

    test("changeTilesOrder Test", function () {
        var le = sap.ushell.Layout.layoutEngine;
        var tile1 = new Tile('1x1');
        var tile2 = new Tile('1x2');
        var tile3 = new Tile('1x1');
        var tile4 = new Tile('2x2');
        var tile5 = new Tile('1x1');
        var group = new Group(tile3);
        sap.ushell.Layout.tilesInRow = 4;
        var matrix = sap.ushell.Layout.organizeGroup([tile1, tile2, tile3, tile4, tile5]);
        le.init();
        le.item = tile5;
        var tilesArray = le.changeTilesOrder(tile5, tile3, [tile1, tile2, tile3, tile4, tile5], matrix);
        ok(tilesArray[2] == tile5);
    });

    test("compareArrays Test", function () {
        var le = sap.ushell.Layout.layoutEngine;
        equal(le.compareArrays([0,1,2,3,4], [0,1,2,3,4,5]), false);
        equal(le.compareArrays([0,1,2,3,4], [0,2,2,3,4]), false);
        equal(le.compareArrays([0,1,2,3,4], [0,1,2,3,4]), true);
    });

});
