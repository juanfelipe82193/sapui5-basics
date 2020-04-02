(function () {
	var __aPrefixMatches = document.location.pathname.match(/(.*)\/test-resources\//);
	var __sPathPrefix = __aPrefixMatches &&  __aPrefixMatches[1] || "";

	document.write('<script src="' + __sPathPrefix + '/resources/sap/ui/qunit/qunit-redirect.js"><' + '/script>');
	document.write('<script src="' + __sPathPrefix + '/resources/sap-ui-core.js"><' + '/script>');
})();