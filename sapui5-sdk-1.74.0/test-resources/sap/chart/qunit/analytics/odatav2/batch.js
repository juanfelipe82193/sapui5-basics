var _resps = [{
    query: "nhl?$select=SHOOTS,POSITION,GOALS,PLUS_MINUS&$inlinecount=allpages",
    content: "--AAD136757C5CF75E21C04F59B8682CEA0\r\n" +
    "Content-Type: application/http\r\n" +
    "Content-Length: 1937\r\n" +
    "content-transfer-encoding: binary\r\n" +
    "\r\n" +
    "HTTP/1.1 200 OK\r\n" +
    "Content-Type: application/json\r\n" +
    "content-language: en\r\n" +
    "Content-Length: 1842\r\n" +
    "\r\n" +
    "{\"d\":{\"results\":[{\"__metadata\": {\"uri\":\"http://anaChartFakeService:8080/UI5/ODataServices/nhl.xsodata/nhl('104588114703164911')\",\"type\":\"UI5.ODataServices.nhl.nhlType\"},\"POSITION\":\"Center\",\"SHOOTS\":\"Left\",\"GOALS\":1496,\"PLUS_MINUS\":-229},{\"__metadata\": {\"uri\":\"http://anaChartFakeService:8080/UI5/ODataServices/nhl.xsodata/nhl('104588114703164912')\",\"type\":\"UI5.ODataServices.nhl.nhlType\"},\"POSITION\":\"Center\",\"SHOOTS\":\"Right\",\"GOALS\":662,\"PLUS_MINUS\":28},{\"__metadata\": {\"uri\":\"http://anaChartFakeService:8080/UI5/ODataServices/nhl.xsodata/nhl('104588114703164913')\",\"type\":\"UI5.ODataServices.nhl.nhlType\"},\"POSITION\":\"Defence\",\"SHOOTS\":\"Left\",\"GOALS\":550,\"PLUS_MINUS\":25},{\"__metadata\": {\"uri\":\"http://anaChartFakeService:8080/UI5/ODataServices/nhl.xsodata/nhl('104588114703164914')\",\"type\":\"UI5.ODataServices.nhl.nhlType\"},\"POSITION\":\"Defence\",\"SHOOTS\":\"Right\",\"GOALS\":377,\"PLUS_MINUS\":53},{\"__metadata\": {\"uri\":\"http://anaChartFakeService:8080/UI5/ODataServices/nhl.xsodata/nhl('104588114703164915')\",\"type\":\"UI5.ODataServices.nhl.nhlType\"},\"POSITION\":\"Left Wing\",\"SHOOTS\":\"Left\",\"GOALS\":1517,\"PLUS_MINUS\":2},{\"__metadata\": {\"uri\":\"http://anaChartFakeService:8080/UI5/ODataServices/nhl.xsodata/nhl('104588114703164916')\",\"type\":\"UI5.ODataServices.nhl.nhlType\"},\"POSITION\":\"Left Wing\",\"SHOOTS\":\"Right\",\"GOALS\":234,\"PLUS_MINUS\":33},{\"__metadata\": {\"uri\":\"http://anaChartFakeService:8080/UI5/ODataServices/nhl.xsodata/nhl('104588114703164917')\",\"type\":\"UI5.ODataServices.nhl.nhlType\"},\"POSITION\":\"Right Wing\",\"SHOOTS\":\"Left\",\"GOALS\":429,\"PLUS_MINUS\":3},{\"__metadata\": {\"uri\":\"http://anaChartFakeService:8080/UI5/ODataServices/nhl.xsodata/nhl('104588114703164918')\",\"type\":\"UI5.ODataServices.nhl.nhlType\"},\"POSITION\":\"Right Wing\",\"SHOOTS\":\"Right\",\"GOALS\":1279,\"PLUS_MINUS\":-192}],\"__count\":\"8\"}}\r\n" +
    "--AAD136757C5CF75E21C04F59B8682CEA0--\r\n" +
    "\r\n"
}];

_resps.forEach(function(r) {
	var allPossibleURIs = [r.query];
	allPossibleURIs.forEach(function(uri) {
		anaChartFakeService.addResponse({
			batch: true,
			header: anaChartFakeService.headers.BATCH,
			uri: [uri],
			content: r.content
		});
	});
});