describe('sap.gantt.GanttChartContainer_Complex', function() {

	it('Should load Gantt Chart Container Complex test page',function(){
		expect(takeScreenshot()).toLookAs('GanttComplex');
	}, 30000);

	it('Should display Legend popup', function () {
		// click on Show legend button if available
		element(by.xpath("//button[contains(@title,\'Show legend\')  or contains(@title, \'Show Legend\')]")).click();
		browser.sleep(1000);
		expect(takeScreenshot(element(by.xpath("//div[contains(@id, \'container\')]/div[contains(@class, \'sapMPageBgStandard\')]")))).toLookAs("CanttContainer_Complex_Leg");
		element(by.xpath("//div[contains(@id,\"container\")]/div[contains(@id, \"page\")]//div[text()=\"ACTIVITIES\"]")).click();
		browser.sleep(1000);
		expect(takeScreenshot(element(by.xpath("//div[contains(@id, \'container\')]/div[contains(@class, \'sapMPageBgSolid\')]")))).toLookAs("CanttContainer_Complex_Act");
	}, 30000);

	it('Should display Settings dialog', function () {
		// click on Settings button if available
		element(by.xpath("//button[contains(@title,\'Settings\')]")).click();
		browser.sleep(3000);
		expect(takeScreenshot(element(by.css('.sapMDialogSection')))).toLookAs('GanttComplexSettings');
		element(by.css('button[id*=\'cancelbutton\']')).click();
	}, 30000);

	it('Should display single resouces view', function () {
		// click on the view layout dropdown list
		browser.sleep(1000);
		element(by.xpath("//div[contains(@title, \"Global hierarchy resources\") or contains(@title, \"Global Hierarchy Resources\")]/span[contains(@id, \"arrow\")]")).click();
		browser.sleep(1000);
		element(by.xpath("//li[contains(text(), \"Single: Resources\")]")).click();
		browser.sleep(1000);
		expect(takeScreenshot()).toLookAs('GanttComplexSingleView');
	}, 30000);
});
