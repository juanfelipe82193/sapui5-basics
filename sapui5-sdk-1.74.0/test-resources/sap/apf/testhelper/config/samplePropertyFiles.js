sap.ui.define([], function() {
	'use strict';

	var module = {
		files: {
			dev:
			"#FIORI: insert Fiori-Id\n" +
			"# __ldi.translation.uuid=applicationId\n" +
			"#ApfApplicationId=applicationId\n\n" +
			"#XTIT,60:Hint\n" +
			"14395631782976233920652753624875=Category 1.1.1\n" +
			"# LastChangeDate=2014/10/07 15:56:42\n\n" +
			"#XTIT,60:Hint\n" +
			"14395631877028739882768245665019=Category 1.1.2\n" +
			"# LastChangeDate=2014/10/07 15:56:42\n\n" +
			"#XTIT,60:Hint\n" +
			"14395631877028739882768245665031=Category 1.1.5\n" +
			"# LastChangeDate=2014/10/07 15:56:42\n\n",

			en: "#FIORI: insert Fiori-Id\n" +
			"# __ldi.translation.uuid=applicationId\n" +
			"#ApfApplicationId=applicationId\n\n" +
			"#XTIT,60:Hint\n" +
			"14395631877028739882768245665019=En-Category 1.1.2\n" +
			"# LastChangeDate=2014/10/07 15:56:42\n\n" +
			"#XTIT,60:Hint\n" +
			"14395631877028739882768245665031=En-Category 1.1.5\n" +
			"# LastChangeDate=2014/10/07 15:56:42\n\n",

			de: "#FIORI: insert Fiori-Id\n" +
			"# __ldi.translation.uuid=applicationId\n" +
			"#ApfApplicationId=applicationId\n\n" +
			"#XTIT,60:Hint\n" +
			"14395631782976233920652753624875=Kategorie 1.1.1\n" +
			"# LastChangeDate=2014/10/07 15:56:42\n\n" +
			"#XTIT,60:Hint\n" +
			"14395631877028739882768245665019=Kategorie 1.1.2\n" +
			"# LastChangeDate=2014/10/07 15:56:42\n\n",

			alt: "#FIORI: insert Fiori-Id\n" +
			"# __ldi.translation.uuid=applicationId\n" +
			"#ApfApplicationId=applicationId\n\n" +
			"#XTIT,60:Hint\n" +
			"14395631877028739882768245665019=Alt-Category 1.1.2\n" +
			"# LastChangeDate=2014/10/07 15:56:42\n\n" +
			"#XTIT,60:Hint\n" +
			"14395631877028739882768245665031=Alt-Category 1.1.5\n" +
			"# LastChangeDate=2014/10/07 15:56:42\n\n"

		},
		getPropertyFile: function(language, applicationId) {
			var file = module.files[language].replace(/applicationId/g, applicationId);
			return file;
		}
	};
	jQuery.sap.declare('sap.apf.testhelper.config.samplePropertyFiles');
	sap.apf.testhelper.config.getPropertyFile = module.getPropertyFile;
	return module;
});