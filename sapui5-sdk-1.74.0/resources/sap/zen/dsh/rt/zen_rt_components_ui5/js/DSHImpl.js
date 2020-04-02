var com_sap_ip_bi_contributionxml = '<?xml version="1.0" encoding="UTF-8"?><sdkExtension	xmlns="http://www.sap.com/bi/zen/sdk"	id="com.sap.ip.bi"	title="Design Studio SDK Extension ui5"	version="1.0"	vendor="SAP">	<component		id="FormattedTextView"		title="Formatted Text View"		handlerType="sapui5"		tooltip="Enables application of text formatting"		icon="res/zen.rt.components.ui5/formattedtextview.png"		propertySheetPath="res/zen.rt.components.ui5/additional_properties_sheet/additional_properties_sheet_formattedtextview.html"		group="2_CMPGR_STANDARD_COMPONENTS_ZEN">		<jsInclude>res/zen.rt.components.ui5/js/components.js</jsInclude>		<property			id="htmlText"			title="HTML Text"		  visible="false"			tooltip="Text with placeholders"			type="String"/>		<initialization>		  <defaultValue property="LEFT_MARGIN">30</defaultValue>			<defaultValue property="TOP_MARGIN">20</defaultValue>			<defaultValue property="WIDTH">100</defaultValue>			<defaultValue property="HEIGHT">60</defaultValue>			<defaultValue property="htmlText">&lt;h1&gt;Sample text&lt;/h1&gt;</defaultValue>		</initialization>	</component></sdkExtension>';

var com_sap_ip_bi_FormattedTextView = 	"var com_sap_ip_bi_FormattedTextView = {\r\n" + 
"	\r\n" + 
"	/* Sets the HTML text. */\r\n" + 
"	setHtmlText : function(/* HTML text */ htmlText) {\r\n" + 
"		this.htmlText = htmlText;	\r\n" + 
"	},\r\n" + 
"	\r\n" + 
"	/* Returns the HTML text. */\r\n" + 
"	getHtmlText : function() {\r\n" + 
"		return this.htmlText;	\r\n" + 
"	}\r\n" + 
"};";
