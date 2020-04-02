// XML handling

sap = sap || {};
sap.zen = sap.zen || {};
sap.zen.crosstab = sap.zen.crosstab || {};
sap.zen.crosstab.testutils = sap.zen.crosstab.testutils || {};

sap.zen.crosstab.testutils.XMLTools = sap.zen.crosstab.testutils.XMLTools || {};

sap.zen.crosstab.testutils.XMLTools.xmlDocToString = function(xmlDoc) {
	var xmlString = "";
	if (window.ActiveXObject) {
		xmlString = xmlDoc.xml;
	} else {
		xmlString = (new XMLSerializer()).serializeToString(xmlDoc);
	}
	return xmlString;
};

// 1. Load from URL
sap.zen.crosstab.testutils.XMLTools.dispatchResponse = function(xhr, callback, isRequestText) {
	if (isRequestText) {
		callback(xhr.responseText);
	} else {
		callback(xhr.responseXML);
	}
};

sap.zen.crosstab.testutils.XMLTools.loadXmlFromUrl = function(url, isRequestText, callback, isAsync) {
	var xhr;
	if (window.XMLHttpRequest) {
		// newer browsers
		xhr = new XMLHttpRequest();
	} else {
		// old IE
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	if (isAsync) {
		xhr.onreadystatechange = function() {
			// 200 <= status < 300 => OK,
			// 304 => OK from cache,
			// 0 => OK from local file (browser bug)
			if (xhr.readyState === 4 && (xhr.status === 200 && xhr.status < 300 || xhr.status === 304 || xhr.status === 0)) {
				sap.zen.crosstab.testutils.XMLTools.dispatchResponse(xhr, callback, isRequestText);
			}
		};
	}
	xhr.open("GET", url, isAsync);
	xhr.send();

	if (!isAsync) {
		sap.zen.crosstab.testutils.XMLTools.dispatchResponse(xhr, callback, isRequestText);
	}
};

// 2. Load from string representation
sap.zen.crosstab.testutils.XMLTools.loadXmlFromString = function(xmlString) {
	var xmlDoc = null;
	if (window.DOMParser) {
		var parser = new DOMParser();
		xmlDoc = parser.parseFromString(xmlString, "text/xml");
	} else {
		// IE
		// xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc = new ActiveXObject("MSXML2.DOMDocument");
		xmlDoc.async = false;
		xmlDoc.loadXML(xmlString);
	}
	return xmlDoc;
};
