// The viewport meta tag must be inserted to the DOM before the “DOMContentLoaded” event is published.
// The initMobile function is responsible to insert the correct viewport according to the current device.
// For iPhone running ios 7.1 and above a "minimal-ui" property is added to the viewport meta tag which allows minimizing the top and bottom bars of the browser.
jQuery.sap.initMobile({preventScroll: false});