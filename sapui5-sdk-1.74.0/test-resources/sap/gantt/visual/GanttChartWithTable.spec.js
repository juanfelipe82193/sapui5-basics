describe('sap.gantt.GanttChartWithTable', function() {

	it('Should load test page',function(){
		browser.sleep(3000);
		expect(takeScreenshot()).toLookAs('GanttChartWithTableInitial');
	});

});
