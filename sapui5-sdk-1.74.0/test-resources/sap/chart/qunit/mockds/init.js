(function() {
	"use strict";

	jQuery.sap.require("sap/ui/core/util/MockServer");
	var MockServer = sap.ui.core.util.MockServer;

	/* very basic analytics mixin to MockServer, provides sufficient aggregation functionality for analytical chart's usage */
	var ANALYTICS = {
		QUERY_PARAM_ORDER: ["$expand", "$filter", "$inlinecount", "$select", "$orderby", "$skip", "$top", "$format"],
		_applyQueryOnCollection: function(oFilteredData, sQuery, sEntitySetName) {
			MockServer.prototype._applyQueryOnCollection.apply(this, arguments);
			// update __count according to the filtered/aggregated results
			oFilteredData.__count = oFilteredData.results.length;
		},
		_orderQueryOptions: function(aUrlParams) {
			var aOrderdParams = aUrlParams.slice().filter(function(n) {
				return n;
			});

			this._bExplicitSort = aOrderdParams.some(function(sParam) {
				return sParam.split("=")[0] === "$orderby";
			});

			function rank(sParam) {
				var iPos = ANALYTICS.QUERY_PARAM_ORDER.indexOf(sParam.split("=")[0]);
				return (iPos === -1) ? ANALYTICS.QUERY_PARAM_ORDER.length : iPos;
			}

			aOrderdParams.sort(function(sParam0, sParam1) {
				return rank(sParam0) - rank(sParam1);
			});

			return aOrderdParams;
		},
		_getOdataQuerySelect: function(aDataSet, sODataQueryValue, sEntitySetName) {
			function sort(aRecords, aCriteria) {
                return aRecords.sort(function(a, b) {
					for (var i = 0; i < aCriteria.length; i++) {
						if (a[aCriteria[i]] < b[aCriteria[i]]) {
							return -1;
						} else if (a[aCriteria[i]] > b[aCriteria[i]]) {
							return 1;
						}
					}

					return aRecords.indexOf(a) - aRecords.indexOf(b);
				});
			}

			var aOriginalResult = MockServer.prototype._getOdataQuerySelect.apply(this, arguments);
			var mByRoles = sODataQueryValue.split(",").reduce(function(mComb, sName) {
				var sKey = this._aggregationRole(sName);
				if (!mComb[sKey]) {
					mComb[sKey] = [sName];
				} else {
					mComb[sKey].push(sName);
				}
				return mComb;
			}.bind(this), {});

			if (!mByRoles.dimension) {
				mByRoles.dimension = ["measureNames"];
			}
			var aAggregated = [], mAggregated = {};

			aOriginalResult.forEach(function(oData, i) {
				var sKey = mByRoles.dimension.map(function(sColName) {
					return oData[sColName];
				}).join("-"),
					oEntry = mAggregated[sKey];
				if (!oEntry) {
					oEntry = jQuery.extend(true, {}, oData);
					mAggregated[sKey] = oEntry;
					aAggregated.push(oEntry);
				} else {
					mByRoles.measure.forEach(function(sColName) {
						var oValue = oEntry[sColName];
						if (jQuery.type(oValue) === "string") {
							oEntry[sColName] = "" + (parseFloat(oValue) + parseFloat(oData[sColName]));
						} else {
							oEntry[sColName] += oData[sColName];
						}
					});
				}
			});

			return this._bExplicitSort ? aAggregated : sort(aAggregated, mByRoles.dimension || []);
		},
		_aggregationRole: function(sName) {
			if (!this._mAggregationRoles) {
				this._mAggregationRoles = [].reduce.call(this._oMetadata.querySelectorAll("EntityType"), function(mMap, oEntityType) {
					var aProperties = oEntityType.querySelectorAll("Property");
					for (var i = 0, len = aProperties.length; i < len; i++) {
						mMap[aProperties[i].getAttribute("Name")] = aProperties[i].getAttribute("sap:aggregation-role");
					}
					return mMap;
				}, {});
			}
			return this._mAggregationRoles[sName];
		}
	};

	window.mockADataService = function(oConfig, bIsAnalytical) {
		var sRootUrl = oConfig.url;
		sRootUrl = (sRootUrl.replace(/\/$/, "") + "/");
		var oMockServer = new MockServer({
			rootUri: sRootUrl
		});

		if (bIsAnalytical) {
			jQuery.extend(oMockServer, ANALYTICS);
			oMockServer.destroy = function() {
				jQuery.each(ANALYTICS, function(name, func) {
					if (this[name] === func) {
						delete this[name];
					}
				}.bind(this));
				MockServer.prototype.destroy.apply(this, arguments);
			};
		}

		oMockServer.simulate(oConfig.metadata, oConfig.mockdata);
		oMockServer.start();

		return oMockServer;
	};
})();
