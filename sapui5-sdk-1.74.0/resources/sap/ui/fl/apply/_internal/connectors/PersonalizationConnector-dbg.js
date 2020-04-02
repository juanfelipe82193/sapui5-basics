/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/base/util/merge",
	"sap/ui/fl/apply/_internal/connectors/BackendConnector"
], function(
	merge,
	BackendConnector
) {
	"use strict";

	var PREFIX = "/flex/personalization";
	var API_VERSION = "/v1";

	/**
	 * Connector for requesting data from SAPUI5 Flexibility Personalization service.
	 *
	 * @namespace sap.ui.fl.apply._internal.connectors.PersonalizationConnector
	 * @since 1.70
	 * @private
	 * @ui5-restricted sap.ui.fl.apply._internal.Storage, sap.ui.fl.write._internal.Storage
	 */
	var PersonalizationConnector = merge({}, BackendConnector, { /** @lends sap.ui.fl.apply._internal.connectors.PersonalizationConnector */
		ROUTES: {
			DATA: PREFIX + API_VERSION + "/data/"
		}
	});

	return PersonalizationConnector;
}, true);