/*global QUnit */
sap.ui.define([
	"sap/base/Log",
	"sap/base/util/LoaderExtensions",
	"sap/ui/core/Locale",
	"sap/ui/core/LocaleData",
	"sap/ui/thirdparty/jquery"
], function(Log, LoaderExtensions, Locale, LocaleData, jQuery) {
	"use strict";
	
	var CLDR_LOCALES = "ar,ar_EG,ar_SA,bg,ca,cs,da,de,de_AT,de_CH,el,el_CY,en,en_AU,en_GB,en_HK,en_IE,en_IN,en_NZ,en_PG,en_SG,en_ZA,es,es_AR,es_BO,es_CL,es_CO,es_MX,es_PE,es_UY,es_VE,et,fi,fr,fr_BE,fr_CA,fr_CH,fr_LU,he,hi,hr,hu,it,it_CH,ja,ko,lt,lv,nb,nl,nl_BE,pl,pt,pt_PT,ro,ru,ru_UA,sk,sl,sr,sv,th,tr,uk,vi,zh_CN,zh_HK,zh_SG,zh_TW".split(",");
	
	var M_SPECIAL = {
		"nb": "no",
		"zh_CN": "zh_CN",
		"zh_HK": "zh_CN",
		"zh_SG": "zh_CN",
		"zh_TW": "zh_TW",
		"he" : "iw",
		"yi" : "ji",
		"id" : "in",
		"sr" : "sh"
	};

	function keyCount(obj) {
		var count = 0,
			name;
		for (name in obj) {
			if ( obj.hasOwnProperty(name) ) {
				if ( obj[name] != null && typeof obj[name] === 'object' ) {
					count += keyCount(obj[name]);
				} else {
					count++;
				}
			}
		}
		return count;
	}

	function size(obj) {
		return obj == null ? 0 : JSON.stringify(obj).length;
	}

	function loadOriginalCLDR(sLocale) {
		var data = null;
		// load the data via jQuery.ajax to bypass the preload cache
		jQuery.ajax({
			url: sap.ui.require.toUrl("sap/ui/core/cldr/" + sLocale + ".json"),
			async: false,
			dataType : 'json',
			success: function (xhrdata) {
				data = xhrdata;
			}
		});
		if ( data == null ) {
			throw new Error("failed to load CLDR data for locale " + sLocale);
		}
		return data;
	}

	var measures = {};

	QUnit.module("Optimized CLDR Data");

	CLDR_LOCALES.forEach(function makeTest(sLocale) {

		QUnit.test("Minimized Data for Locale " + sLocale, function(assert) {

			var oLocale = new Locale(sLocale);
			var sBundleLanguage = M_SPECIAL[sLocale] || M_SPECIAL[oLocale.getLanguage()] || oLocale.getLanguage();

			var done = assert.async();
			sap.ui.require(["sap/fiori/messagebundle-preload_" + sBundleLanguage], function() {

				var oLocaleData = LocaleData.getInstance(oLocale);
				assert.ok(oLocaleData, "locale data could be loaded");

				var actual = oLocaleData.mData;
				var expected = loadOriginalCLDR(sLocale);
				assert.deepEqual(actual, expected, "data loaded from delta file + fallback should match the uncompressed original data");
			
				var delta = LoaderExtensions.loadResource("sap/ui/core/cldr/" + sLocale + ".json");
				var measure = measures[sLocale] = {
					keys : keyCount(delta),
					size : size(delta),
					origKeys : keyCount(expected),
					origSize : size(expected)
				};

				measure.keyReduction = measure.origKeys === 0 ? 0 : (measure.origKeys - measure.keys) / measure.origKeys;
				measure.sizeReduction = measure.origSize === 0 ? 0 : (measure.origSize - measure.size) / measure.origSize;

				done();
			});
			
		});
		
	});

	QUnit.test("size reduction", function(assert) {
		var sizeReduction = 0;
		var keyReduction = 0;
		var overallSize = 0;
		var overallOrigSize = 0;
		var count = 0;
		
		Log.info(JSON.stringify(measures));

		CLDR_LOCALES.forEach(function(sLocale) {
			var measure = measures[sLocale];
			var oLocale = new Locale(sLocale);
			if ( measure && !/zh_/.test(sLocale) && oLocale.getRegion() ) {
				keyReduction += measure.keyReduction;
				sizeReduction += measure.sizeReduction;
				count++;
			} 
			overallSize += measure.size;
			overallOrigSize += measure.origSize;
		});
		
		keyReduction /= count;
		sizeReduction /= count;
	
		var overallSizeReduction = (overallOrigSize - overallSize) / overallOrigSize;
		
		Log.info("avg. key reduction:" + Math.round(keyReduction * 100) + "%");
		Log.info("avg. size reduction:" + Math.round(sizeReduction * 100) + "%");
		Log.info("overall size reduction:" + Math.round(overallSizeReduction * 100) + "%");

		assert.ok(keyReduction > 0.7, "avg. key reduction for region files should be at least 70%");
		assert.ok(sizeReduction > 0.7, "avg. size reduction for region files should be at least 70%");

	});
	
});
