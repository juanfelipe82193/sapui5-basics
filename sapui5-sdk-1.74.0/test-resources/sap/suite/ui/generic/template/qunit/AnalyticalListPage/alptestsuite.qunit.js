window.suite = 			function () {
    var suite = new parent.jsUnitTestSuite(),
        contextPath = "/" + window.location.pathname.split("/")[1];


    //TODO : commented text are failing so need to revisit	
    //qunit @/AnalyticalListPage/control/visualfilterbar
    suite.addTestPage(contextPath + "/test-resources/sap/suite/ui/generic/template/qunit/AnalyticalListPage/control/visualfilterbar/FilterItemMicroChartTest.qunit.html");
    suite.addTestPage(contextPath + "/test-resources/sap/suite/ui/generic/template/qunit/AnalyticalListPage/control/visualfilterbar/SmartVisualFilterBarTest.qunit.html");
    //suite.addTestPage(contextPath + "/test-resources/sap/suite/ui/generic/template/qunit/AnalyticalListPage/control/visualfilterbar/VisualFilterProviderTest.qunit.html");

    //qunit @/AnalyticalListPage/control
    suite.addTestPage(contextPath + "/test-resources/sap/suite/ui/generic/template/qunit/AnalyticalListPage/control/KpiTagTest.qunit.html");
    suite.addTestPage(contextPath + "/test-resources/sap/suite/ui/generic/template/qunit/AnalyticalListPage/control/visualfilterbar/FilterItemMicroChartTest.qunit.html");

    //qunit @/AnalyticalListPage/controller
    //suite.addTestPage(contextPath + "/test-resources/sap/suite/ui/generic/template/qunit/AnalyticalListPage/controller/FilterBarControllerTest.qunit.html");

    //qunit @/AnalyticalListPage/util
    suite.addTestPage(contextPath + "/test-resources/sap/suite/ui/generic/template/qunit/AnalyticalListPage/util/AnnotationHelperTest.qunit.html");
    suite.addTestPage(contextPath + "/test-resources/sap/suite/ui/generic/template/qunit/AnalyticalListPage/util/FilterUtilTest.qunit.html");



    return suite;
}