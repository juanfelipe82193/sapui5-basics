describe('sap.gantt.GanttChart', function() {

	it('Should load test page',function(){
		browser.sleep(3000);
		expect(takeScreenshot()).toLookAs('GanttChartInitial');
	});

});
