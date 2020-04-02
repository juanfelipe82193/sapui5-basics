var ResultsGraph = function (sTestTitle) {
    this.sTestDate = this._getCurrentDate();
    this.sTestTitle = sTestTitle;
};


ResultsGraph.prototype.addResultToPerformanceTestResults = function (oResult) {
    if (!this.oTestResults) {
        this.oTestResults = [{}];
        this.oTestResults[0] = oResult;
    } else {
        this.oTestResults.push(oResult);
    }
};

ResultsGraph.prototype.getPerformanceTestResults = function () {
    this.oTestResults.splice(0, 0);
    return this.oTestResults;
};
ResultsGraph.prototype._getCurrentDate = function() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
};

ResultsGraph.prototype.showResults = function () {
    var chart = new CanvasJS.Chart("chartContainer",
	{
	    animationEnabled: true,
	    title: {
	        text: this.sTestTitle + ' @ ' + this.sTestDate
	    },
	    data: [
		{
		    type: "column", //change type to bar, line, area, pie, etc
		    dataPoints: this.getPerformanceTestResults()
		}
		]
	});
    chart.render();
};

ResultsGraph.prototype.sendResults = function () {
    console.error(this);
    var sLink = "../../../../../../../MyPerformance/saveData.php?test_date=" + this.sTestDate + "&table_name=" + this.sTestTitle + "&render_rulebuilder=" + this.oTestResults[0].y + "&read_rule=" + this.oTestResults[1].y + "&open_setting=" + this.oTestResults[2].y + "&add_column=" + this.oTestResults[3].y + "&remove_column=" + this.oTestResults[4].y + "&close_setting=" + this.oTestResults[5].y + "&add_row=" + this.oTestResults[6].y + "&remove_row=" + this.oTestResults[7].y;;
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.error(this.responseText);
        }
    };
    xhttp.open("GET", sLink, true);
    xhttp.send();
    
};


