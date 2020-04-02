describe('sap.gantt.GanttChartContainer', function() {

	it('Should load test page',function(){
		browser.sleep(3000);
		expect(takeScreenshot()).toLookAs('GanttChartContainerInitial');
	});

	it('Should display Cozy mode', function () {
		//Click Cozy button on toolbar
		browser.sleep(3000);
		element(by.xpath("//li[contains(text(), \'Cozy\')]")).click();
		browser.sleep(3000);
		expect(takeScreenshot()).toLookAs('GanttChartContainerCozy');
	});

	it('Should display Condense mode', function () {
		//Click Condense button on toolbar
		browser.sleep(3000);
		element(by.xpath("//li[contains(text(), \'Condense\')]")).click();
		browser.sleep(3000);
		expect(takeScreenshot()).toLookAs('GanttChartContainerCondese');
	});

});
