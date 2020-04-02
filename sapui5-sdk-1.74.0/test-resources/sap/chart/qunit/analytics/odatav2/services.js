anaChartFakeService.addResponse({
	uri: "", //empty string is a query against the base uri, meaning the service document
	header: anaChartFakeService.headers.JSON,
	content: "{ \"d\": { \"EntitySets\": [\"nhl\"] } }"
});
