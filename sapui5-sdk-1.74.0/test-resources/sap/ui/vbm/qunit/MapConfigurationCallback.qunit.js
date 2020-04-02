sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vbm/GeoMap",
	"sap/ui/vbm/Containers",
	"sap/ui/vbm/Container",
	"sap/m/Text"
], function (jQuery, GeoMap, Containers, Container, Text) {
	'use strict';
	// This unit test is covering basic MapConfiguration as well as the new MapProvider Source callback parameter
	// This tests the following scenarios
	/**
	 * Positive Tests
	 * 1. Map Provider with Source callback function that uses a template URL which will be pushed through the 'No Position' code path
	 * 2. Map Provider with Source callback function that uses a template URL which will be pushed through the 'With Position' code path
	 * 4. Map Provider without source callback
	 * 
	 * Negative Tests
	 * 1. Map Provider with Source callback function that is a string not a function
	 * 2. Map Provider with Source callback function that does not return a string
	 */

	QUnit.test("Map Provider without Source callback parameter should still work", function (assert) {
		var done1 = assert.async();
		var oMapConfigNoCallback = {
			"MapProvider": [
				{
					"name": "NO_CALLBACK_TEST",
					"type": "",
					"description": "",
					"copyright": "Tiles Courtesy of Test",
					"Source": [{
						"id": "s1",
						"url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==",
					}]
				}],
			"MapLayerStacks": [
				{
					"name": "Default",
					"MapLayer": [
						{
							"name": "NO_CALLBACK_TEST",
							"refMapProvider": "NO_CALLBACK_TEST"
						}]
				}]
		};

		var geoMap3 = new GeoMap();
		geoMap3.setMapConfiguration(oMapConfigNoCallback);
		geoMap3.placeAt("content");

		var checker1 = setInterval(waitAndCheck1, 1000);
		function waitAndCheck1() {
			
			var geoMapCanvasObjects = jQuery('canvas[id^="' + geoMap3.getId() + '-MainScene-layer"]');
			if (geoMapCanvasObjects[0]) {
				var ctx1 = geoMapCanvasObjects[0].getContext('2d');
				var c1 = ctx1.getImageData(1, 1, 1, 1).data;

				var ctx2 = geoMapCanvasObjects[1].getContext('2d');
				var c2 = ctx2.getImageData(1, 1, 1, 1).data;
				var aCanvasIsRed = (c1[0] == 255) || (c2[0] == 255);
				assert.ok(aCanvasIsRed, "The map should be red");
				
				//cleanup
				clearInterval(checker1);
				geoMap3.destroy();
				done1();
			}
		}
	});

	QUnit.test("Map Provider with Source callback function that does not return a string", function (assert) {
		var done2 = assert.async();
		assert.expect(1);

		// Bad callback function that does not return a string 
		var callbackNonString = function (templateUrl, x, y, lod, width, height, quad, negY, numt) {
			//Red image tile
			return function() { console.log("The callback function should only return a string")};
		}

		var oMapConfigBadCallback = {
			"MapProvider": [
				{
					"name": "NO_CALLBACK_TEST",
					"type": "",
					"description": "",
					"copyright": "Tiles Courtesy of Test",
					"Source": [{
						"id": "s1",
						"url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==",
						"callback": callbackNonString
					}]
				}],
			"MapLayerStacks": [
				{
					"name": "Default",
					"MapLayer": [
						{
							"name": "NO_CALLBACK_TEST",
							"refMapProvider": "NO_CALLBACK_TEST"
						}]
				}]
		};

		var geoMap4 = new GeoMap();
		geoMap4.setMapConfiguration(oMapConfigBadCallback);
		geoMap4.placeAt("content");

		var checker2 = setInterval(waitAndCheck, 1000);

		function waitAndCheck() {
			var geoMapCanvasObjects = jQuery('canvas[id^="' + geoMap4.getId() + '-MainScene-layer"]');
			if (geoMapCanvasObjects[0]) {
				var ctx1 = geoMapCanvasObjects[0].getContext('2d');
				var c1 = ctx1.getImageData(1, 1, 1, 1).data;

				var ctx2 = geoMapCanvasObjects[1].getContext('2d');
				var c2 = ctx2.getImageData(1, 1, 1, 1).data;

				var aCanvasColorExpected = (c1[2] == 255) || (c2[2] == 255);
				assert.ok(aCanvasColorExpected, "The map should be blue");
				
				//cleanup
				clearInterval(checker2);
				geoMap4.destroy();
				done2();
			}
		}
	});

	// Need to be sure that a MapConfiguration passed as a string from a backend system does not contain a callback function that might execute
	QUnit.test("Sanity check of JSON string MapConfiguration with source callback function should fail to parse and is not a valid MapConfiguration", function (assert) {
		var done3 = assert.async();
		assert.expect(1);

		// The callback function 
		var oMapConfigWithStringCallbackFunction = '{"MapProvider": [{"name": "CALLBACK_TEST","type": "","description": "","tileX": "512","tileY": "512","maxLOD": "20","copyright": "Tiles Courtesy of Test","Source": [{"id": "s1","url": "http://test/{X}{Y}{Z}{NUMT}{QUAD}{WIDTH}{HEIGHT}.png","callback": function(templateUrl, x, y, lod, width, height, quad, negY, numt) { assert.strictEqual(true, false, "Should not execute"); console.log("Not OK");}}]}],"MapLayerStacks":[{"name": "Default","MapLayer": [{"name": "CALLBACK_TEST","refMapProvider": "CALLBACK_TEST"}]}]}';
		assert.throws(
			function () {
				JSON.parse(oMapConfigWithStringCallbackFunction);
			},
			function (err) {
				return err.name === "SyntaxError";
			},
			"Raises SyntaxError for JSON string Map Configuration with embedded function"
		);
		done3();
	});

	QUnit.test("Configure Map Provider with Source callback parameter (no position)", function (assert) {
		var done4 = assert.async();

		var combineUrlXYZ = function (templateUrl, x, y, lod, quad, negY, numt) {
			// Tile Width and Height are always 256 in vb
			assert.strictEqual(templateUrl, "http://test/{X}{Y}{Z}{NUMT}{QUAD}.png", "templateUrl equals 'http://test/{X}{Y}{Z}{NUMT}{QUAD}.png'");
			assert.ok([0, 1, 2, 3].includes(x), "x is within the expected range");
			assert.ok([0, 1, 2, 3].includes(y), "y is within the expected range");
			assert.strictEqual(lod, 2, "lod equals 1");

			// The implementation ignores the tileX, tileY from the configuration and just uses the mapmanager default
			// so although the map configurations used here say 512, the expected value is 256

			assert.ok(["00", "01", "02", "03", "10", "20", "30", "11", "12", "13", "21", "22", "23", "31", "32", "33"].includes(quad), "quad is within the expected range");
			assert.ok([0, 1, 2, 3].includes(negY), "negY is within the expected range");
			
			//fixing NUM / NUMT issue
			assert.ok([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].includes(numt), "numt is within the expected range");

			//Red image tile
			return ("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAEBgIApD5fRAAAAABJRU5ErkJggg==");
		}

		//This callback template URL specifies X, Y, Z only (no BBox), so it will trigger simple CombineUrl which 
		//calculates fewer parameters
		var oMapConfigCombineUrlXYZ = {
			"MapProvider": [
				{
					"name": "CALLBACK_TEST",
					"type": "",
					"description": "",
					"tileX": "512",
					"tileY": "512",
					"maxLOD": "20",
					"copyright": "Tiles Courtesy of Test",
					"Source": [{
						"id": "s1",
						"url": "http://test/{X}{Y}{Z}{NUMT}{QUAD}.png",
						"callback": combineUrlXYZ
					}]
				}],
			"MapLayerStacks":
				[
					{
						"name": "Default",
						"MapLayer": [
							{
								"name": "CALLBACK_TEST",
								"refMapProvider": "CALLBACK_TEST"
							}]
					}]
		};

		var geoMap = new GeoMap();
		geoMap.setMapConfiguration(oMapConfigCombineUrlXYZ);
		geoMap.placeAt("content");

		setTimeout(function () {
			done4();
		}, 1000);
	});


	QUnit.test("Configure Map Provider with Source callback parameter (with position)", function (assert) {
		var done5 = assert.async();
		var combineUrlWPos = function (templateUrl, x, y, lod, xTileSize, yTileSize, quad, negY, numt, lu_long, lu_lat, rl_long, rl_lat) {
			assert.strictEqual(templateUrl, "http://test/{X}{Y}{Z}{NUMT}{QUAD}{WIDTH}{HEIGHT}{LU_LAT}{LU_LONG}{RL_LAT}{RL_LONG}.png", "templateUrl equals 'http://test/{X}{Y}{Z}{NUMT}{QUAD}{WIDTH}{HEIGHT}{LU_LAT}{LU_LONG}{RL_LAT}{RL_LONG}.png'");
			assert.ok([0, 1, 2, 3].includes(x), "x is within the expected range");
			assert.ok([0, 1, 2, 3].includes(y), "y is within the expected range");
			assert.strictEqual(lod, 2, "lod equals 1");

			// The implementation ignores the tileX, tileY from the configuration and just uses the mapmanager default
			// so although the map configurations used here say 512, the expected value is 256
			assert.strictEqual(xTileSize, 256, "width equals 256 from mapmanager.m_tileWidth");
			assert.strictEqual(yTileSize, 256, "height equals 256 mapmanager.m_tileHeight");

			assert.ok(["00", "01", "02", "03", "10", "20", "30", "11", "12", "13", "21", "22", "23", "31", "32", "33"].includes(quad), "quad is within the expected range");
			assert.ok([0, 1, 2, 3].includes(negY), "negY is within the expected range");

			//fixing NUM / NUMT issue
			assert.ok([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].includes(numt), "numt is within the expected range");
			
			assert.ok([0, -0, -180, 180, 90, -90, 45, -45].includes(lu_long), "lu_long is within the expected range");
			assert.ok([0, -0, -180, 180, 90, -90, 45, -45].includes(lu_lat), "lu_lat is within the expected range");
			assert.ok([0, -0, -180, 180, 90, -90, 45, -45].includes(rl_long), "rl_long is within the expected range");
			assert.ok([0, -0, -180, 180, 90, -90, 45, -45].includes(rl_lat), "rl_lat is within the expected range");

			return ("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAEBgIApD5fRAAAAABJRU5ErkJggg==");
		}

		//This callback template URL specifies bounding box parameters, so it will trigger CombineUrlWPos which 
		//calculates more parameters for replacement
		var oMapConfigCombineUrlWPos = {
			"MapProvider": [
				{
					"name": "CALLBACK_TEST",
					"type": "",
					"description": "",
					"tileX": "512",
					"tileY": "512",
					"maxLOD": "20",
					"copyright": "Tiles Courtesy of Test",
					"Source": [{
						"id": "s1",
						"url": "http://test/{X}{Y}{Z}{NUMT}{QUAD}{WIDTH}{HEIGHT}{LU_LAT}{LU_LONG}{RL_LAT}{RL_LONG}.png",
						"callback": combineUrlWPos
					}]
				}],
			"MapLayerStacks": [
				{
					"name": "Default",
					"MapLayer": [
						{
							"name": "CALLBACK_TEST",
							"refMapProvider": "CALLBACK_TEST"
						}]
				}]
		};

		var geoMap2 = new GeoMap();
		geoMap2.setMapConfiguration(oMapConfigCombineUrlWPos);
		geoMap2.placeAt("content");
		setTimeout(function () {
			done5();
		}, 1000);
	});
});