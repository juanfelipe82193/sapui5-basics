// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * This script adds the current URLs parameters to the URL defined in a meta tag (http-equiv="Refresh") in the HTML page.
 * It does not expect URL parameters in the redirect URL and requires a redirect delay > 0 seconds.
*/
(function () {
    /* global $*/
    "use strict";

    var $metaTag = $("meta[http-equiv='Refresh']");

    var sContentAttribute = $metaTag.attr("content");
    var regexResult = /; url=(.*)$/.exec(sContentAttribute);

    var sTargetUrl = regexResult[1];

    // It is not expected, that the redirected URL contains parameters.
    var sTargetUrlWithParams = sTargetUrl + window.location.search + window.location.hash;

    var sUpdatedContentAttribute = sContentAttribute.replace(sTargetUrl, sTargetUrlWithParams);

    // update the URL in the content attribute while keeping the delay and potential other parts untouched
    $metaTag.attr("content", sUpdatedContentAttribute);
})();