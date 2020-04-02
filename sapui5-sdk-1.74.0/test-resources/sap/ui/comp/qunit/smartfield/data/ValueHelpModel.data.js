sap.ui.define(function(){
	"use strict";

	return {
	"version": "1.0",
	"dataServices": {
		"dataServiceVersion": "2.0",
		"schema": [{
			"namespace": "FAC_FINANCIAL_DOCUMENT_SRV_01",
			"entityType": [{
				"name": "Tax",
				"key": {
					"propertyRef": [{
						"name": "TaxItem"
					},
					{
						"name": "CompanyCode"
					},
					{
						"name": "AccountingDocument"
					},
					{
						"name": "FiscalYear"
					}]
				},
				"property": [{
					"name": "TaxItem",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "6",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Alle Positionen innerhalb eines Buchhaltungsbelegs erhalten eine Nummer, über die sie eindeutig identifiziert werden können. Die Nummern werden beim Erfassen des Belegs vom System fortlaufend vergeben.",
							"attributes": [],
							"children": [],
							"namespace": ""
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": ""
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Position",
						"namespace": ""
					},
					{
						"name": "heading",
						"value": "Pos",
						"namespace": ""
					},
					{
						"name": "quickinfo",
						"value": "Sechsstellige Nummer der Buchungszeile",
						"namespace": ""
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": ""
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": ""
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": ""
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": ""
					}]
				},
				{
					"name": "CompanyCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, der einen Buchungskreis eindeutig identifiziert.",
							"attributes": [],
							"children": [],
							"namespace": ""
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": ""
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Buchungskreis",
						"namespace": ""
					},
					{
						"name": "heading",
						"value": "BuKr",
						"namespace": ""
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": ""
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": ""
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": ""
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": ""
					}]
				},
				{
					"name": "AccountingDocument",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"extensions": [{
						"name": "label",
						"value": "Belegnummer",
						"namespace": ""
					},
					{
						"name": "heading",
						"value": "Belegnr.",
						"namespace": ""
					},
					{
						"name": "quickinfo",
						"value": "Buchhaltungsbelegnummer",
						"namespace": ""
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": ""
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": ""
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": ""
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": ""
					}]
				},
				{
					"name": "FiscalYear",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Zeitraum in der Regel von 12 Monaten, für den das Unternehmen seine Inventur und Bilanz zu erstellen hat. Das Geschäftsjahr kann sich mit dem Kalenderjahr decken, muß es aber nicht.",
							"attributes": [],
							"children": [],
							"namespace": ""
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": ""
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Geschäftsjahr",
						"namespace": ""
					},
					{
						"name": "heading",
						"value": "Jahr",
						"namespace": ""
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": ""
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": ""
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": ""
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": ""
					}]
				},
				{
					"name": "TaxCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcTaxCode",
						"namespace": ""
					},
					{
						"name": "text",
						"value": "TaxCodeName",
						"namespace": ""
					},
					{
						"name": "label",
						"value": "Umsatzsteuer",
						"namespace": ""
					},
					{
						"name": "heading",
						"value": "St",
						"namespace": ""
					},
					{
						"name": "quickinfo",
						"value": "Umsatzsteuerkennzeichen",
						"namespace": ""
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": ""
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": ""
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": ""
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": ""
					}]
				},
				{
					"name": "TaxCodeName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "50",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcTaxCode",
						"namespace": ""
					},
					{
						"name": "label",
						"value": "Beschreibung",
						"namespace": ""
					},
					{
						"name": "quickinfo",
						"value": "Grund für Mahnsperre",
						"namespace": ""
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TaxJurisdictionName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "50",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcTaxJurisdiction",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Beschreibung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Grund für Mahnsperre",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TaxJurisdiction",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "15",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "The tax jurisdiction is used for determining the tax rates in the USA. It defines to which tax authorities you must pay your taxes. It is always the city to which the goods are supplied.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcTaxJurisdiction",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "TaxJurisdictionName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Steuerstandort",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "GLAccount",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "The G/L account number identifies the G/L account in a chart of accounts.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "text",
						"value": "GLAccountName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Sachkonto",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "GLAccountName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "20",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Der Sachkontenkurztext wird für Dialoganzeigen und Auswertungen verwendet, die nicht über ausreichenden Platz für den Langtext verfügen.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Kurztext",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Sachkontenkurztext",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DebitCreditCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "1",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Zeigt, auf welcher Seite des Kontos (S = Soll, H = Haben) die Fortschreibung der Verkehrszahlen erfolgt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcDebitCreditCode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Soll/Haben",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "S/H",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Soll-/Haben-Kennzeichen",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TaxAmountInCoCodeCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Zeigt den gesamten Steuerbetrag, der im angezeigten Beleg auf das genannte Steuerkennzeichen entfällt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcTaxAmountInCoCodeCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "CoCodeCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "HW-Steuer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "HW-Steuerbetrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbetrag in Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TaxAmountInTransactionCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Gezeigt wird der gesamte Steuerbetrag, der im angezeigten Beleg auf das  genannte Steuerkennzeichen entfällt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcTaxAmountInTransactionCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "TransactionCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Betrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbetrag in Belegwährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TaxAmountInAdditionalCrcy1",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"extensions": [{
						"name": "unit",
						"value": "AdditionalCrcy1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Steuer HW 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Steuerbetrag HW 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbetrag in Hauswährung 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TaxAmountInAdditionalCrcy2",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"extensions": [{
						"name": "unit",
						"value": "AdditionalCrcy2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Steuer HW 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Steuerbetrag HW 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbetrag in Hauswährung 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TaxBaseAmountInCoCodeCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "15",
					"scale": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Betrag, aus dem der Steuerbetrag anhand des Steuersatzes ermittelt wird.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcTaxBaseAmountInCoCodeCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "CoCodeCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "HW-Basis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "HW-Steuerbasis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbasisbetrag in Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TaxBaseAmountInTransactionCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "15",
					"scale": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Betrag, aus dem der Steuerbetrag anhand des Steuersatzes ermittelt wird.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcTaxBaseAmountInTransactionCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "TransactionCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Basisbetr.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Steuerbasis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbasisbetrag in Belegwährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TaxBaseAmountInAdditionalCrcy1",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "15",
					"scale": "2",
					"extensions": [{
						"name": "unit",
						"value": "AdditionalCrcy1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Basis HW 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Steuerbasis HW 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbasisbetrag in Hauswährung 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TaxBaseAmountInAdditionalCrcy2",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "15",
					"scale": "2",
					"extensions": [{
						"name": "unit",
						"value": "AdditionalCrcy2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Basis HW 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Steuerbasis HW 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbasisbetrag in Hauswährung 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CreditTaxAmountInCoCodeCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Zeigt den gesamten Steuerbetrag, der im angezeigten Beleg auf das genannte Steuerkennzeichen entfällt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcTaxAmountInCoCodeCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "CoCodeCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "HW-Steuer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "HW-Steuerbetrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbetrag in Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CreditTaxAmountInTransactionCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Gezeigt wird der gesamte Steuerbetrag, der im angezeigten Beleg auf das  genannte Steuerkennzeichen entfällt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcTaxAmountInTransactionCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "TransactionCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Betrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbetrag in Belegwährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CreditTaxAmountInAdditionalCrcy1",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"extensions": [{
						"name": "unit",
						"value": "AdditionalCrcy1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Steuer HW 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Steuerbetrag HW 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbetrag in Hauswährung 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CreditTaxAmountInAdditionalCrcy2",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"extensions": [{
						"name": "unit",
						"value": "AdditionalCrcy2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Steuer HW 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Steuerbetrag HW 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbetrag in Hauswährung 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CreditTaxBaseAmountInCoCodeCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Dieses Feld enthält den Betrag, auf den die Steuer zu berechnen ist.  Der Betrag ist in der Hauswährung des Buchungskreises zu verstehen.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Bei der direkten Erfassung von Steuerzeilen ist der Basisbetrag stets  anzugeben, damit das System den Steuerbetrag prüfen kann. Bei  Buchungen in Fremdwährung reicht die Angabe des Betrages in der  Fremdwährung aus. Der in diesem Feld stehende Hauswährungsbetrag wird  durch Umrechnung ermittelt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcTaxBaseAmountInCoCodeCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "CoCodeCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "HW-Basis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "HW-Steuerbasis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbasisbetrag in Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CreditTaxBaseAmountInTransactionCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "15",
					"scale": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Betrag, aus dem der Steuerbetrag anhand des Steuersatzes ermittelt wird.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcTaxBaseAmountInTransactionCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "TransactionCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Basisbetr.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Steuerbasis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbasisbetrag in Belegwährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CreditTaxBaseAmountInAdditionalCrcy1",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "15",
					"scale": "2",
					"extensions": [{
						"name": "unit",
						"value": "AdditionalCrcy1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Basis HW 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Steuerbasis HW 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbasisbetrag in Hauswährung 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CreditTaxBaseAmountInAdditionalCrcy2",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "15",
					"scale": "2",
					"extensions": [{
						"name": "unit",
						"value": "AdditionalCrcy2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Basis HW 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Steuerbasis HW 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbasisbetrag in Hauswährung 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DebitTaxAmountInCoCodeCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Zeigt den gesamten Steuerbetrag, der im angezeigten Beleg auf das genannte Steuerkennzeichen entfällt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcTaxAmountInCoCodeCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "CoCodeCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "HW-Steuer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "HW-Steuerbetrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbetrag in Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DebitTaxAmountInTransactionCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Gezeigt wird der gesamte Steuerbetrag, der im angezeigten Beleg auf das  genannte Steuerkennzeichen entfällt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcTaxAmountInTransactionCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "TransactionCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Betrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbetrag in Belegwährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DebitTaxAmountInAdditionalCrcy1",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"extensions": [{
						"name": "unit",
						"value": "AdditionalCrcy1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Steuer HW 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Steuerbetrag HW 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbetrag in Hauswährung 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DebitTaxAmountInAdditionalCrcy2",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"extensions": [{
						"name": "unit",
						"value": "AdditionalCrcy2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Steuer HW 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Steuerbetrag HW 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbetrag in Hauswährung 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DebitTaxBaseAmountInCoCodeCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Dieses Feld enthält den Betrag, auf den die Steuer zu berechnen ist.  Der Betrag ist in der Hauswährung des Buchungskreises zu verstehen.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Bei der direkten Erfassung von Steuerzeilen ist der Basisbetrag stets  anzugeben, damit das System den Steuerbetrag prüfen kann. Bei  Buchungen in Fremdwährung reicht die Angabe des Betrages in der  Fremdwährung aus. Der in diesem Feld stehende Hauswährungsbetrag wird  durch Umrechnung ermittelt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcTaxBaseAmountInCoCodeCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "CoCodeCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "HW-Basis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "HW-Steuerbasis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbasisbetrag in Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DebitTaxBaseAmountInTransactionCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "15",
					"scale": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Betrag, aus dem der Steuerbetrag anhand des Steuersatzes ermittelt wird.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcTaxBaseAmountInTransactionCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "TransactionCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Basisbetr.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Steuerbasis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbasisbetrag in Belegwährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DebitTaxBaseAmountInAdditionalCrcy1",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "15",
					"scale": "2",
					"extensions": [{
						"name": "unit",
						"value": "AdditionalCrcy1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Basis HW 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Steuerbasis HW 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbasisbetrag in Hauswährung 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DebitTaxBaseAmountInAdditionalCrcy2",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "15",
					"scale": "2",
					"extensions": [{
						"name": "unit",
						"value": "AdditionalCrcy2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Basis HW 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Steuerbasis HW 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbasisbetrag in Hauswährung 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TaxRate",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "11",
					"scale": "2",
					"extensions": [{
						"name": "label",
						"value": "Prozent",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Prozentsatz",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerprozentsatz",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CoCodeCurrency",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"extensions": [{
						"name": "label",
						"value": "Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "HWähr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TransactionCurrency",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel der Währung, in der die Beträge im System geführt werden.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Währung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Währg",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Währungsschlüssel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AdditionalCrcy1",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"extensions": [{
						"name": "label",
						"value": "Hauswährung 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "HW 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Währungsschlüssel der zweiten Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AdditionalCrcy2",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"extensions": [{
						"name": "label",
						"value": "Hauswährung 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "HW 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Währungsschlüssel der dritten Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcTaxCode",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcTaxJurisdiction",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcDebitCreditCode",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcTaxBaseAmountInCoCodeCrcy",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcTaxBaseAmountInTransactionCrcy",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcTaxAmountInTransactionCrcy",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcTaxAmountInCoCodeCrcy",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				}],
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "WithholdingTax",
				"key": {
					"propertyRef": [{
						"name": "AccountingDocument"
					},
					{
						"name": "AccountingDocumentItem"
					},
					{
						"name": "CompanyCode"
					},
					{
						"name": "FiscalYear"
					},
					{
						"name": "Ledger"
					},
					{
						"name": "WithholdingTaxType"
					}]
				},
				"property": [{
					"name": "AccountingDocument",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcAccountingDocument",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Belegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Belegnr.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Buchhaltungsbelegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AccountingDocumentItem",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "6",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Alle Positionen innerhalb eines Buchhaltungsbelegs erhalten eine Nummer, über die sie eindeutig identifiziert werden können. Die Nummern werden beim Erfassen des Belegs vom System fortlaufend vergeben.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcAccountingDocumentItem",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Position",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Pos",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Sechsstellige Nummer der Buchungszeile",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AdditionalCrcy1",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"extensions": [{
						"name": "label",
						"value": "Hauswährung 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "HW 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Währungsschlüssel der zweiten Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AdditionalCrcy2",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"extensions": [{
						"name": "label",
						"value": "Hauswährung 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "HW 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Währungsschlüssel der dritten Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CoCodeCurrency",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"extensions": [{
						"name": "label",
						"value": "Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "HWähr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CompanyCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, der einen Buchungskreis eindeutig identifiziert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcCompanyCode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Buchungskreis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "BuKr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TransactionCurrency",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel der Währung, in der die Beträge im System geführt werden.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Währung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Währg",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Währungsschlüssel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ExcemptionCertificateNumber",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "25",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Behördlich vergebene Nummer für die Befreiung von der Quellensteuer.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Die Nummer ist folgendermaßen anzugeben:\nkreditorisch bei den Kreditorenstammdaten\ndebitorisch im Customizing bei den Quellensteuerinformationen des Buchungskreises pro Quellensteuertyp",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcExcemptionCertificateNumber",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Befreiungsnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Befr.Num.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Nummer des Befreiungszertifikates",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ExtendedWithholdingTaxCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Einem Quellensteuertyp sind jeweils ein oder mehrere \"Quellensteuerkennzeichen\" zugeordnet, die u.a. verschiedene Prozentsätze für den Quellensteuertyp festlegen.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Es ist zu beachten, daß bei einem Geschäftsvorfall immer nur ein Quellensteuerkennzeichen pro Quellensteuertyp zugewiesen werden kann. Unterliegt der Geschäftsvorfall mehreren Quellensteuern gleichzeitig, so sind diese mittels verschiedener Typen abzubilden.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcExtendedWithholdingTaxCode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "ExtendedWithholdingTaxCodeName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "QSt.Kennzeichen",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "QSt",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Quellensteuerkennzeichen",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ExtendedWithholdingTaxCodeName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "40",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Frei wählbarer, 40stelliger Text.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcExtendedWithholdingTaxCode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Bezeichnung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Text in der Länge 40",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "FiscalYear",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Zeitraum in der Regel von 12 Monaten, für den das Unternehmen seine Inventur und Bilanz zu erstellen hat. Das Geschäftsjahr kann sich mit dem Kalenderjahr decken, muß es aber nicht.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcFiscalYear",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Geschäftsjahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Jahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "InformationText",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "30",
					"extensions": [{
						"name": "label",
						"value": "Bemerkung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Informationstext Quellensteuerdialog",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "IsPostedAsSelfWithholdingTax",
					"type": "Edm.Boolean",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "Selbsteinbehalt",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Kennzeichen: als Selbsteinbehalt buchen?",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Ledger",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Identifiziert ein spezielles Ledger eindeutig.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Ledger",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Ld",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcAccountingDocument",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcAccountingDocumentItem",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcCompanyCode",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcExcemptionCertificateNumber",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcExtendedWithholdingTaxCode",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcFiscalYear",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcWithholdingTaxAmountInCoCodeCrcy",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcWithholdingTaxAmountInTransCrcy",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcWithholdingTaxBaseAmountInCoCodeCrcy",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcWithholdingTaxBaseAmountInTransCrcy",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcWithholdingTaxType",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcWTAmountAlreadyWithheldInCoCodeCrcy",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcWTAmountAlreadyWithheldInTransCrcy",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "WithholdingTaxAmountInAdditionalCrcy1",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "15",
					"scale": "2",
					"extensions": [{
						"name": "unit",
						"value": "AdditionalCrcy1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Qst.Betrag 2. HW",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Qst.Betrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Quellensteuerbetrag in 2. Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "WithholdingTaxAmountInAdditionalCrcy2",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "15",
					"scale": "2",
					"extensions": [{
						"name": "unit",
						"value": "AdditionalCrcy2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Qst.Betrag 3. HW",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Qst.Betrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Quellensteuerbetrag in 3. Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "WithholdingTaxAmountInCoCodeCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "15",
					"scale": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcWithholdingTaxAmountInCoCodeCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "CoCodeCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Qst.Betrag HW",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Qst.Betrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Quellensteuerbetrag in Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "WithholdingTaxAmountInTransCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "15",
					"scale": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcWithholdingTaxAmountInTransCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "TransactionCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "QSt.Betrag FW",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "QSt.Betrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Quellensteuerbetrag in Belegwährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "WithholdingTaxBaseAmountInAdditionaCrcy1",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "15",
					"scale": "2",
					"extensions": [{
						"name": "unit",
						"value": "AdditionalCrcy1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Qst.Basis 2. HW",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Qst.Basis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Quellensteuerbasisbetrag in 2. Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "WithholdingTaxBaseAmountInAdditionaCrcy2",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "15",
					"scale": "2",
					"extensions": [{
						"name": "unit",
						"value": "AdditionalCrcy2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Qst.Basis 3. HW",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Qst.Basis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Quellensteuerbasisbetrag in 3. Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "WithholdingTaxBaseAmountInCoCodeCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "15",
					"scale": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcWithholdingTaxBaseAmountInCoCodeCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "CoCodeCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "QSt.Basis HW",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "QSt.Basis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Quellensteuerbasisbetrag in Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "WithholdingTaxBaseAmountInTransCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "15",
					"scale": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcWithholdingTaxBaseAmountInTransCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "TransactionCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "QSt.Basis FW",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "QSt.Basis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Quellensteuerbasisbetrag in Belegwährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "WithholdingTaxType",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Dient der Klassifizierung verschiedener Quellensteuern.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Dem Quellensteuertyp sind bestimmte Eigenschaften der Quellensteuer zugeordnet, z.B.:\nZeitpunkt der Buchung\nGrundlage für die Basisberechnung\nGrundlage für eine eventuelle Akkumulierung\nDer Quellensteuertyp ist vom Quellensteuerkennzeichen abzugrenzen, dem beispielsweise der Prozentsatz einer Quellensteuer zugeordnet ist.\nNicht immer ist eindeutig bestimmt, ob eine Quellensteuer mittels eines neuen Codes zu einem bestehenden Typ definiert wird oder ob ein neuer Typ definiert werden muß.\nBeachten Sie, daß einem Geschäftsvorfall nur ein Quellensteuerkennzeichen pro Quellensteuertyp zugewiesen werden kann. Unterliegt der Geschäftsvorfall mehreren Quellensteuern gleichzeitig, sind diese mittels verschiedener Typen abzubilden.\nDies ist z.B. in Argentinien der Fall, wo bis zu vier Quellensteuern pro Geschäftsvorfall möglich sind.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcWithholdingTaxType",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Quellensteuertyp",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Kennzeichen für Quellensteuertyp",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "WithholdingTaxTypeName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "40",
					"extensions": [{
						"name": "label",
						"value": "Bezeichnung QSt.Typ",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Bezeichnung Quellensteuertyp",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Bezeichnung Quellensteuertyp",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "WTAmountAlreadyWithheldInAdditionalCrcy1",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "15",
					"scale": "2",
					"extensions": [{
						"name": "unit",
						"value": "AdditionalCrcy1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "einb.Qst.Betrag 2.HW",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "einb.Qst.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Bereits einbehaltener Quellensteuerbetrag in 2. Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "WTAmountAlreadyWithheldInAdditionalCrcy2",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "15",
					"scale": "2",
					"extensions": [{
						"name": "unit",
						"value": "AdditionalCrcy2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "einb.Qst.Betrag 3.HW",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "einb.Qst.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Bereits einbehaltener Quellensteuerbetrag in 3. Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "WTAmountAlreadyWithheldInCoCodeCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "15",
					"scale": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcWTAmountAlreadyWithheldInCoCodeCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "CoCodeCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "einb. Qst.Betrag HW",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "einb.Qst.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Bereits einbehaltener Quellensteuerbetrag in Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "WTAmountAlreadyWithheldInTransCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "15",
					"scale": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcWTAmountAlreadyWithheldInTransCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "TransactionCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "einb. QSt.Betrag FW",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "einb.QSt.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Bereits einbehaltener Quellensteuerbetrag in Belegwährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				}],
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "InitialSelection",
				"key": {
					"propertyRef": [{
						"name": "CompanyCode"
					}]
				},
				"property": [{
					"name": "CompanyCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, der einen Buchungskreis eindeutig identifiziert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Buchungskreis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "BuKr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AcctgDoc",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"extensions": [{
						"name": "label",
						"value": "Belegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Belegnr.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Buchhaltungsbelegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "FiscalYear",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Zeitraum in der Regel von 12 Monaten, für den das Unternehmen seine Inventur und Bilanz zu erstellen hat. Das Geschäftsjahr kann sich mit dem Kalenderjahr decken, muß es aber nicht.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Geschäftsjahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Jahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "FiscalPeriod",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"extensions": [{
						"name": "label",
						"value": "Periode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Pe",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Geschäftsperiode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				}],
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "Attachment",
				"hasStream": "true",
				"key": {
					"propertyRef": [{
						"name": "CompanyCode"
					},
					{
						"name": "AccountingDocument"
					},
					{
						"name": "FiscalYear"
					},
					{
						"name": "AttachmentId"
					}]
				},
				"property": [{
					"name": "CompanyCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, der einen Buchungskreis eindeutig identifiziert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Buchungskreis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "BuKr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AccountingDocument",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"extensions": [{
						"name": "label",
						"value": "Belegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Belegnr.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Buchhaltungsbelegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "FiscalYear",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Zeitraum in der Regel von 12 Monaten, für den das Unternehmen seine Inventur und Bilanz zu erstellen hat. Das Geschäftsjahr kann sich mit dem Kalenderjahr decken, muß es aber nicht.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Geschäftsjahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Jahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AttachmentId",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "46",
					"extensions": [{
						"name": "quickinfo",
						"value": "ID eines Mappeneintrags (Obj+Fol+Forwardername)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Title",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "50",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Maximal 50 Zeichen lange Bezeichnung eines Dokuments, einer Mappe, einer Verteilerliste oder eines Verweises.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Titel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Dokumenttitel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Kurze Beschreibung des Inhaltes",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ObjectType",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "3",
					"extensions": [{
						"name": "label",
						"value": "Typ",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Kürzel für den Dokumenttyp",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CreatedByUser",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "12",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Name des Benutzers, der das Dokument angelegt hat.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "text",
						"value": "CreatedByUserFullName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Erstellt",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Ersteller",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Name des Erstellers",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CreatedByUserFullName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "35",
					"extensions": [{
						"name": "quickinfo",
						"value": "SAPoffice: voller Name des Erstellers",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CreationDateTime",
					"type": "Edm.DateTime",
					"nullable": "false",
					"precision": "0",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Der UTC-Zeitstempel stellt Datum und Uhrzeit bezogen auf UTC  (Universal Time Coordinated) dar.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Um lokale Zeiten in einen UTC-Zeitstempel zu normalisieren und somit vergleichbar zu machen, müssen diese unter Angabe ihrer Zeitzone konvertiert werden. Hierzu steht der ABAP-Befehl convert zur Verfügung.\nAuch wenn sich die dieser Umrechnung zugrundeliegende Zeitzone aus Customizing oder Stammdaten wieder ermitteln läßt, wird empfohlen, die Zeitzone redundant mit abzuspeichern.\nDie interne Struktur des UTC-Zeitstempels ist logisch untergliedert in einen Datums- und Uhrzeitteil im gepackten Ziffernformat <JJJJMMTThhmmss>. Es steht darüber hinaus auch ein hochauflösender UTC-Zeitstempel (10^-7 Sekunden) zur Verfügung.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Zeitstempel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UTC-Zeitstempel in Kurzform (JJJJMMTThhmmss)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DocumentSize",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "12",
					"extensions": [{
						"name": "quickinfo",
						"value": "Größe eines SAPoffice Dokumentes (für API1)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Filename",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "255",
					"extensions": [{
						"name": "label",
						"value": "Dateiname",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Dateiname einer Anlage",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Dateiname einer Anlage",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "MimeType",
					"type": "Edm.String",
					"maxLength": "128",
					"extensions": [{
						"name": "label",
						"value": "Mimetype",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Mimetyp",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				}],
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "RelatedDocument",
				"key": {
					"propertyRef": [{
						"name": "CompanyCode"
					},
					{
						"name": "AccountingDocument"
					},
					{
						"name": "FiscalYear"
					},
					{
						"name": "SequenceNumber"
					}]
				},
				"property": [{
					"name": "CompanyCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, der einen Buchungskreis eindeutig identifiziert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Buchungskreis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "BuKr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AccountingDocument",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"extensions": [{
						"name": "label",
						"value": "Belegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Belegnr.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Buchhaltungsbelegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "FiscalYear",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Zeitraum in der Regel von 12 Monaten, für den das Unternehmen seine Inventur und Bilanz zu erstellen hat. Das Geschäftsjahr kann sich mit dem Kalenderjahr decken, muß es aber nicht.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Geschäftsjahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Jahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SequenceNumber",
					"type": "Edm.Int32",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "Zahl",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Natürliche Zahl",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "BusinessObjectKey",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "70",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Zusammengesetzter Schlüssel eines Objektes.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Der Schlüssel entsteht durch die lückenlose Aneinanderreihung aller Schlüsselfelder, die für Objekte dieses Typs im Business Object Repository definiert sind.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Schlüssel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Objektschlüssel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "BusinessObjectType",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Interner, technischer Schlüssel eines Business-Objekts im Business Object Repository (BOR).",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Business-Objekte im BOR werden sowohl durch den Objekttyp (z.B. BUS2032) als auch durch einen beschreibenden, englischen Namen (z.B. SalesOrder) identifiziert. Beide Bezeichnungen müssen über alle Objekttypen eindeutig sein.\nAus externen Anwendungen werden Business-Objekte häufig über den beschreibenden Namen angesprochen, wogegen sie intern im BOR meist über den Objekttyp identifiziert werden. Ursprünglich wurde nur der interne Schlüssel verwendet, doch aufgrund des verbreiteten Einsatzes von Business-Objekten ergab sich die Anforderung, diese durch einen Namen anzusprechen. Aus Kompatibilitätsgründen werden jetzt beide Bezeichnungen geführt.\nDer Objekttyp kann maximal 10 Zeichen umfassen.\nBeispiele:\nBUS2032\nBUS6026",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Objekttyp",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "LogicalSystem",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "System, in dem Anwendungen integriert auf einer gemeinsamen Datenbasis laufen.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Die Verteilung von Daten zwischen Systemen macht es erforderlich, jedes System innerhalb eines Netzwerkes eindeutig zu identifizieren. Dazu dient das logische System.\nIm SAP-Sinne entspricht der Mandant einem logischen System. In der Mandantenpflege können Sie einem Mandanten ein logisches System zuordnen (über Springen -> Detail).\nDas logische System ist für folgende SAP-Bereiche relevant:\nALE, generell: Eine Kommunikation findet zwischen zwei oder mehreren logischen Systemen statt.\nALE-Geschäftsprozesse (z.B. Kostenstellenrechnung): Definition des Systems, in dem eine bestimmte Anwendung läuft. Nur in diesem System dürfen z.B. Stammdatenänderungen durchgeführt werden.\nWorkflow-Objektwesen: Im Schlüssel eines Workflow-Objekts ist immer das logische System enthalten, in dem sich das Objekt befindet\nBei der Pflege des logischen Systems ist zu beachten:\nDas logische System muß unternehmensweit eindeutig sein. Es darf von keinem anderem System im ALE-Systemverbund benutzt werden.\nIm Produktiv-System darf das logische System nicht mehr geändert werden. Wenn das logische System einer Belegreferenz nicht initial ist und nicht mit dem eigenen übereinstimmt, geht das System davon aus, daß der Beleg sich auf einem anderen System befindet.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Logisches System",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "LogSystem",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "NodeDescription",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "60",
					"extensions": [{
						"name": "label",
						"value": "BItem Beschreibung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Beschreibung zu einem Browser-Item",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Beschreibung zu einem Browser-Item (Anzeige-Attribut)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "BusinessObjectTypeDescription",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "80",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Als Kurzbeschreibung können Sie einen identifizierenden Text von maximal 40 Zeichen angeben.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Kurzbeschrbng",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Kurzbeschreibung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Kurzbeschreibung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "RelatedDocCompanyCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, der einen Buchungskreis eindeutig identifiziert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Buchungskreis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "BuKr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "RelatedDocAccountingDocument",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"extensions": [{
						"name": "label",
						"value": "Belegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Belegnr.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Buchhaltungsbelegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "RelatedDocFiscalYear",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Zeitraum in der Regel von 12 Monaten, für den das Unternehmen seine Inventur und Bilanz zu erstellen hat. Das Geschäftsjahr kann sich mit dem Kalenderjahr decken, muß es aber nicht.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Geschäftsjahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Jahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "RelatedDocAccountingDocumentType",
					"type": "Edm.String",
					"maxLength": "2",
					"extensions": [{
						"name": "text",
						"value": "RelatedDocAccountingDocumentTypeName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Belegart",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "RelatedDocAccountingDocumentTypeName",
					"type": "Edm.String",
					"maxLength": "40",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Text, der das Objekt, auf das er sich bezieht, näher beschreibt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Langtext",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "RelatedDocReferenceDocumentType",
					"type": "Edm.String",
					"maxLength": "5",
					"extensions": [{
						"name": "text",
						"value": "RelatedDocReferenceDocumentTypeName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Referenzvorgang",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "RelatedDocReferenceDocumentTypeName",
					"type": "Edm.String",
					"maxLength": "25",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Dieses Feld enthält die Bezeichnung eines Objekttyps.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Objekttyp",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Objekttyptext",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Objekttyptext",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				}],
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "Note",
				"key": {
					"propertyRef": [{
						"name": "CompanyCode"
					},
					{
						"name": "AccountingDocument"
					},
					{
						"name": "FiscalYear"
					},
					{
						"name": "NoteId"
					}]
				},
				"property": [{
					"name": "CompanyCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, der einen Buchungskreis eindeutig identifiziert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Buchungskreis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "BuKr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AccountingDocument",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"extensions": [{
						"name": "label",
						"value": "Belegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Belegnr.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Buchhaltungsbelegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "FiscalYear",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Zeitraum in der Regel von 12 Monaten, für den das Unternehmen seine Inventur und Bilanz zu erstellen hat. Das Geschäftsjahr kann sich mit dem Kalenderjahr decken, muß es aber nicht.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Geschäftsjahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Jahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Title",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "50",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Maximal 50 Zeichen lange Bezeichnung eines Dokuments, einer Mappe, einer Verteilerliste oder eines Verweises.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Titel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Dokumenttitel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Kurze Beschreibung des Inhaltes",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "NoteText",
					"type": "Edm.String",
					"nullable": "false",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CreatedByUser",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "12",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Name des Benutzers, der das Dokument angelegt hat.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "text",
						"value": "CreatedByUserFullName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Erstellt",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Ersteller",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Name des Erstellers",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CreationDateTime",
					"type": "Edm.DateTime",
					"nullable": "false",
					"precision": "0",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Der UTC-Zeitstempel stellt Datum und Uhrzeit bezogen auf UTC  (Universal Time Coordinated) dar.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Um lokale Zeiten in einen UTC-Zeitstempel zu normalisieren und somit vergleichbar zu machen, müssen diese unter Angabe ihrer Zeitzone konvertiert werden. Hierzu steht der ABAP-Befehl convert zur Verfügung.\nAuch wenn sich die dieser Umrechnung zugrundeliegende Zeitzone aus Customizing oder Stammdaten wieder ermitteln läßt, wird empfohlen, die Zeitzone redundant mit abzuspeichern.\nDie interne Struktur des UTC-Zeitstempels ist logisch untergliedert in einen Datums- und Uhrzeitteil im gepackten Ziffernformat <JJJJMMTThhmmss>. Es steht darüber hinaus auch ein hochauflösender UTC-Zeitstempel (10^-7 Sekunden) zur Verfügung.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Zeitstempel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UTC-Zeitstempel in Kurzform (JJJJMMTThhmmss)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "NoteId",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "46",
					"extensions": [{
						"name": "quickinfo",
						"value": "ID eines Mappeneintrags (Obj+Fol+Forwardername)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CreatedByUserFullName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "35",
					"extensions": [{
						"name": "quickinfo",
						"value": "SAPoffice: voller Name des Erstellers",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				}],
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "Header",
				"key": {
					"propertyRef": [{
						"name": "AccountingDocument"
					},
					{
						"name": "CompanyCode"
					},
					{
						"name": "FiscalYear"
					}]
				},
				"property": [{
					"name": "AccountingDocument",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Belegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Belegnr.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Buchhaltungsbelegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AccountingDocumentCategory",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "1",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "AccountingDocumentCategoryName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Belegstatus",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "S",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AccountingDocumentCategoryName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "60",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AccountingDocumentHeaderText",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "25",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcAccountingDocumentHeaderText",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Kopftext",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Belegkopftext",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AccountingDocumentType",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "AccountingDocumentTypeName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Belegart",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AccountingDocumentTypeName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "40",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Text, der das Objekt, auf das er sich bezieht, näher beschreibt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Langtext",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AdditionalCrcy1",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Hauswährung 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "HW 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Währungsschlüssel der zweiten Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AdditionalCrcy1ExchangeRate",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "9",
					"scale": "5",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Umrechngskurs 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "UmrKurs 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Umrechnungskurs für die zweite Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AdditionalCrcy1Name",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "15",
					"extensions": [{
						"name": "quickinfo",
						"value": "Bezeichner für den Betrag in der dritten Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AdditionalCrcy1Role",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "AdditionalCrcy1RoleName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Währungstyp HW2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "WT",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Währungstyp der zweiten Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AdditionalCrcy1RoleName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "60",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AdditionalCrcy2",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Hauswährung 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "HW 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Währungsschlüssel der dritten Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AdditionalCrcy2ExchangeRate",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "9",
					"scale": "5",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Umrechngskurs 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "UmrKurs 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Umrechnungskurs für die dritte Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AdditionalCrcy2Name",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "15",
					"extensions": [{
						"name": "quickinfo",
						"value": "Bezeichner für den Betrag in der dritten Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AdditionalCrcy2Role",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "AdditionalCrcy2RoleName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Währungstyp HW3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "WT",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Währungstyp der dritten Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AdditionalCrcy2RoleName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "60",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AlternativeReferenceDocument",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "26",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Gibt die alternative Referenzbelegnummer für z.B. das Steuer-Reporting an.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Wenn dieses Feld für italienische Buchungskreise verwendet wird, enthält es die offizielle Belegnummer, die dem Beleg bei der Buchung automatisch zugeordnet wird. Nach den italienischen Bestimmungen muss diese offizielle Belegnummer innerhalb eines kalenderjahresabhängigen Nummernkreises liegen und eine fortlaufende Nummer sein.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Alt. Referenz",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Alt. Referenznr.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Alternative Referenznummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AmountInCoCodeCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "CoCodeCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Hauswährungsbetrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AmountInTransactionCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Betrag der Belegposition in Belegwährung.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Bei der Belegerfassung ist der Betrag manuell einzugeben. In der letzten Belegposition kann '*' eingegeben werden. Als Betrag wird dann vom System der Saldo der zuvor erfaßten Positionen eingesetzt.\nDie erfaßten Beträge können vom System automatisch geändert werden, wenn folgende Buchungen vorzunehmen sind:\nSteuerkorrekturen\nSkontokorrekturen beim Nettobuchen",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "GroupCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Betrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Betrag in Belegwährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CoCodeCurrency",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "HWähr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CompanyCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, der einen Buchungskreis eindeutig identifiziert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "field-control",
						"value": "UxFcCompanyCode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "CompanyCodeName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Buchungskreis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "BuKr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CompanyCodeName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "54",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcCompanyCode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CreatedByUser",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "12",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "CreatedByUserName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Benutzername",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CreatedByUserName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "80",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Dieses Feld enthält den vollständigen Namen der Person. Er wird in der Regel aus den einzelnen Namensteilen (ohne Anrede) generiert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Es gibt zwei Ausnahmefälle:\nDer Feldinhalt wurde bei einer Datenumsetzung (aus dem Vorgängerrelease) aus den vorherigen Feldern für Anredetext und Name zusammengesetzt, weil der Anredetext nicht maschinell einem Anredeschlüssel zugeordnet werden konnte. In diesem Fall steht im Feld CONVERTED (\"Status des Feldes NAME_TEXT\") der Wert 'X'.\nDer Feldinhalt wurde über eine Zusatzfunktion im Dialog manuell gepflegt, z.B. weil der vollständige Name nicht in die vorgegebenen Namensteile aufgeteilt werden kann. In diesem Fall steht im Feld CONVERTED (\"Status des Feldes NAME_TEXT\") der Wert 'M'.\nDas Feld CONVERTED (\"Status des Feldes NAME_TEXT\") hat den Wert SPACE, wenn keiner der beiden Ausnahmefälle zutrifft.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Vollst.Name",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Vollständiger Name",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Vollständiger Name der Person",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CreationDate",
					"type": "Edm.DateTime",
					"precision": "0",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filter-restriction",
						"value": "interval",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Erfasst am",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Erfassungsdatum Buchhaltungsbeleg",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CreationTime",
					"type": "Edm.Time",
					"precision": "0",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filter-restriction",
						"value": "interval",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Erfasst um",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Zeit, zu der Buchhaltungsbeleg erfasst wurde",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DocumentDate",
					"type": "Edm.DateTime",
					"precision": "0",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Das Belegdatum gibt das Ausstellungsdatum des Originalbeleges an.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filter-restriction",
						"value": "interval",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Belegdatum",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Bel.Datum",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Belegdatum im Beleg",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DocumentReferenceID",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "16",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Die Referenzbelegnummer kann die Belegnummer beim Geschäftspartner enthalten. Dies Feld kann aber auch anders gefüllt sein.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Die Referenzbelegnummer dient als Suchkriterium bei Beleganzeige oder -änderung. In der Korrespondenz wird die Referenzbelegnummer teilweise anstelle der Belegnummer gedruckt.\nGeben Sie die vom Partner angegebene Nummer ein. Für den Fall, daß der Beleg in Ihrem Haus erzeugt wird und keine Belegnummer beim Partner bekannt ist, besteht die Möglichkeit, durch Eingabe von '*' die Belegnummer in das Feld Referenznummer zu kopieren.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "field-control",
						"value": "UxFcDocumentReferenceID",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Referenz",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Referenz-Belegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ExchangeRate",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "9",
					"scale": "5",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Exchange rate used for the translation between foreign currency and local currency.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "In entry transactions, you only specify the exchange rate if you want a different rate to the table rate.\nIf you use the option to enter the local currency and the foreign currency amount manually when you are entering an item, a different exchange rate may result than that in the \"Exchange Rate\" field.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "field-control",
						"value": "UxFcExchangeRate",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Umrechnungskurs",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ExchangeRateDate",
					"type": "Edm.DateTime",
					"precision": "0",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "field-control",
						"value": "UxFcExchangeRateDate",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filter-restriction",
						"value": "interval",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Umrechnungsdatum",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Datum der Währungsumrechnung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ExchangeRateForTaxes",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "9",
					"scale": "5",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Hier wird der Kurs gespeichert, der für die Umrechnung der Steuerbeträge verwendet wird. Er ist nur dann gefüllt, wenn über das Customizing des Buchungskreises eine explizite Eingabe ermöglicht wurde, bzw. das Buchungs- oder Belegdatum für die Umrechnung herangezogen werden soll. Der Kurs ist derzeit nur auf dem separaten Steuerbild eingebbar.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Kurs f.Steuern",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Umrechnungskurs für Steuern",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ExchangeRateType",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Umrechnungskursart",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "FiscalPeriod",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Periode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Pe",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Geschäftsperiode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "FiscalYear",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Zeitraum in der Regel von 12 Monaten, für den das Unternehmen seine Inventur und Bilanz zu erstellen hat. Das Geschäftsjahr kann sich mit dem Kalenderjahr decken, muß es aber nicht.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Geschäftsjahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Jahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "GroupCurrency",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Währungsschlüssel, der vom Konzern auf Mandantenebene vorgegeben wird.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Konzernwährg.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "KonzW",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Währungsschlüssel der Konzernwährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "IntercompanyTransaction",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "16",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "field-control",
						"value": "UxFcIntercompanyTransaction",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "GesellschÜbergr. TA",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Gesellschaftsübergreifende Transaktion",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Gesellschaftsübergreifende Transaktionsnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "LastChangeDate",
					"type": "Edm.DateTime",
					"precision": "0",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filter-restriction",
						"value": "interval",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Geändert am",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Geänd.am",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Datum der letzten Änderung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Ledger",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Identifiziert ein spezielles Ledger eindeutig.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Ledger",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Ld",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "LedgerGroup",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Bezeichnet eine Ledger-Gruppe eindeutig.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Wenn Sie keine Ledger-Gruppe angeben, dann wird die Funktion (z.B. Buchen) für alle Ledger ausgeführt, d.h. für das führende Ledger und alle Ledger, die im Buchungskreis zugeordnet sind.\nDie initiale (leere) Ledger-Gruppe ist eine besondere Ledger-Gruppe, die alle Ledger enthält, die innerhalb desselben Buchungskreises definiert wurden. Der Saldo der Konten innerhalb dieser Ledger-Gruppe ist immer gleich dem Saldo der offenen Posten.\nWenn Sie hier eine Ledger-Gruppe angeben, dann wird die Funktion nur für die Ledger dieser Ledger-Gruppe ausgeführt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "field-control",
						"value": "UxFcLedgerGroup",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filter-restriction",
						"value": "multi-value",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "LedgerGroupName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Ledger-Gruppe",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "LedgerGroupName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "35",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Nachname des Mitarbeiters, der den Vorgang ausgeführt hat.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcLedgerGroup",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Nachname",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Nachname eines Mitarbeiters",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OriginalReferenceDocument",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "20",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Wird ein Buchhaltungsbeleg über die Schnittstelle im Rechnungswesen gebucht, übergibt die sendende Anwendung eine eindeutige Referenz. Sie besteht aus Objektschlüssel und Objekttyp. Der Objektschlüssel setzt sich zusammen aus Referenzbelegnummer und Referenzorganisationseinheit. Beispiel:  1000007899  00011996",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "   Referenz-  Referenzorganisationseinheit\n   belegnummer  Mandant und Geschäfsjahr\nDer Objekttyp enthält einen Hinweis auf die Ablage des Originalbeleges.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Ref.Schlüssel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Ref.Schl.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Referenzschlüssel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ParkedByUser",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "12",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "ParkedByUserName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Vorerfasser",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Vorerf.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Benutzer, der den Beleg vorerfaßt hat",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ParkedByUserName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "80",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Dieses Feld enthält den vollständigen Namen der Person. Er wird in der Regel aus den einzelnen Namensteilen (ohne Anrede) generiert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Es gibt zwei Ausnahmefälle:\nDer Feldinhalt wurde bei einer Datenumsetzung (aus dem Vorgängerrelease) aus den vorherigen Feldern für Anredetext und Name zusammengesetzt, weil der Anredetext nicht maschinell einem Anredeschlüssel zugeordnet werden konnte. In diesem Fall steht im Feld CONVERTED (\"Status des Feldes NAME_TEXT\") der Wert 'X'.\nDer Feldinhalt wurde über eine Zusatzfunktion im Dialog manuell gepflegt, z.B. weil der vollständige Name nicht in die vorgegebenen Namensteile aufgeteilt werden kann. In diesem Fall steht im Feld CONVERTED (\"Status des Feldes NAME_TEXT\") der Wert 'M'.\nDas Feld CONVERTED (\"Status des Feldes NAME_TEXT\") hat den Wert SPACE, wenn keiner der beiden Ausnahmefälle zutrifft.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Vollst.Name",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Vollständiger Name",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Vollständiger Name der Person",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PostingDate",
					"type": "Edm.DateTime",
					"precision": "0",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Datum, unter dem der Beleg in der Buchhaltung bzw. in der Kostenrechnung erfaßt wird.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Aus dem Buchungsdatum werden das Geschäftsjahr und die Periode abgeleitet, für die eine Fortschreibung der im Beleg angesprochenen Konten bzw. Kostenarten erfolgt.\nBei der Belegerfassung wird anhand der erlaubten Buchungsperiode überprüft, ob das angegebene Buchungsdatum zulässig ist.\nDas Buchungsdatum kann sich sowohl vom Erfassungsdatum (Tag der Eingabe in das System) als auch vom Belegdatum (Tag der Erstellung des Originalbelegs) unterscheiden.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filter-restriction",
						"value": "interval",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Buchungsdatum",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Buch.dat.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Buchungsdatum im Beleg",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "RecurringAccountingDocument",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Unter dieser Belegnummer wurde der Urbeleg für die Dauerbuchung erfaßt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Dauerb.Beleg",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "DB-Beleg",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Belegnummer der Dauerbuchung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Reference1InDocumentHeader",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "20",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "field-control",
						"value": "UxFcReference1InDocumentHeader",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "RefSchlüssl 1 (Kopf)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Referenzschlüssel 1 (Kopf)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Referenzschlüssel 1 intern für Belegkopf",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Reference2InDocumentHeader",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "20",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "field-control",
						"value": "UxFcReference2InDocumentHeader",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "RefSchl. 2 (Kopf)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Referenzschlüssel 2 (Kopf)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Referenzschlüssel 2 intern für Belegkopf",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ReferenceDocumentType",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "ReferenceDocumentTypeName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Referenzvorgang",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ReferenceDocumentTypeName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "25",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Dieses Feld enthält die Bezeichnung eines Objekttyps.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Objekttyp",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Objekttyptext",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Objekttyptext",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ReverseDocument",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Enthält die Belegnummer des Beleges, mit dem der aktuell angezeigte Beleg storniert worden ist. Das Feld wird beim Stornieren vom System gefüllt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Storniert mit",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Storn.mit",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Belegnummer des Stornobelegs",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ReversalFunction",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "1",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "ReversalFunctionName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Stornoart",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Ob stornierter Beleg oder Stornobeleg",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ReversalFunctionName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "60",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Dieser Text wird u.a. bei der Erstellung von Listen und beim Aufruf der Dokumentation angezeigt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Kurzbeschreibung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Erläuternder Kurztext",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ReversalReason",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Grund für die Durchführung der Umkehrbuchung oder des Stornos",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "ReversalReasonName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Stornogrund",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Stornogrd",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Grund für Storno oder Umkehrbuchung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ReversalReasonName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "40",
					"extensions": [{
						"name": "label",
						"value": "Text",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Text der Länge 40",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TaxBaseAmountIsNetEntry",
					"type": "Edm.Boolean",
					"nullable": "false",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Falls die Steuerbeträge errechnet werden sollen, kann hier angegeben werden, daß die Sachkontenbeträge netto eingegeben werden. Im anderen Fall wird davon ausgegangen, daß die eingegebenen Sachkontenbeträge die zu ermittelnde Steuer enthalten.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Nettoerfassung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Sachkontenbetraege sind Nettobetraege",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TaxIsCalculatedAutomatically",
					"type": "Edm.Boolean",
					"nullable": "false",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Bewirkt, daß das System beim Simulieren bzw. beim Buchen die Steuern automatisch berechnet.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Steuer rechnen",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuer automatisch rechnen?",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TaxReportingDate",
					"type": "Edm.DateTime",
					"precision": "0",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Datum, an dem die Umsatzsteuer fällig ist oder an dem die Umsatzsteuer der Finanzbehörde zu melden ist.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Das Steuermeldedatum kann identisch sein mit dem Buchungsdatum oder dem Belegdatum; es kann jedoch auch nach selbst definierten Regeln bestimmt werden.\nSteuerreporting\nIn erster Linie können Sie das Steuermeldedatum beim Steuerreporting als Selektionskriterium - zusätzlich zum Buchungsdatum oder Belegdatum - verwenden.\nDas Steuermeldedatum ist als Selektionskriterium in der logischen Datenbank BRF enthalten.\nIn den Selektionsbildern einiger Reports ist das Feld standardmäßig verfügbar (z.B. RFUMSV00, RFUMSV10, RDASLM00, RFASLD02, RFASLD20). In den weiteren Reports, die auf der logischen Datenbank BRF basieren, ist das Feld zwar nicht standardmäßig auf dem Selektionsbild verfügbar; Sie können es jedoch aus den freien Abgrenzungen auswählen.\nKursermittlung bei der Umrechnung des Steuerwerts\nAußerdem können Sie das Steuermeldedatum bei der Kursumrechnung des Steuerwerts zur Kursermittlung verwenden. Wählen Sie dazu im Customizing der Umsatzsteuer unter Kursumrechnung ändern die Option Kursermittlung gemäß Steuermeldedatum. Auch wenn Sie diese Option gewählt haben, können Sie später im gebuchten Beleg das Meldedatum zu Reportingzwecken wieder ändern. Der Steuerbetrag wird dadurch natürlich nicht erneut umgerechnet.\nWeitere Informationen\nWeitere Informationen finden Sie im SAP-Hinweis 1232484 sowie in den verwandten Hinweisen.\nDas Steuermeldedatum ist ein Feld im Belegkopf (Tabelle BKPF) und ist damit einheitlich für den gesamten Beleg.\nUm das Feld in Belegen verwenden zu können, müssen Sie die Funktion im Customizing der Globalen Parameter zum Buchungskreis aktivieren. Setzen Sie dazu unter Globale Parameter prüfen und ergänzen das Kennzeichen Steuermeldedatum aktiv.\nWenn Sie das Kennzeichen Steuermeldedatum aktiv nicht gesetzt haben oder der Beleg nicht steuerrelevant ist (kein Steuerkennzeichen enthält), dann speichert das System das Steuermeldedatum ohne Wert (initial) ab.\nBei der Belegerfassung können Sie das Steuermeldedatum im Dialogfenster für Steuern eingeben. Hierfür schlägt das BAdI Bestimmen und Prüfen des Steuermeldedatums (VATDATE_VALUES) einen Wert vor; in der Standardimplementierung ist dies das Buchungsdatum oder alternativ das Belegdatum. In der Transaktion zur Belegänderung (FB02) können Sie dieses Datum ändern. Die Änderbarkeit müssen Sie zuvor im Customizing der Belegänderungsregeln erlaubt haben unter Belegänderungsregeln, Belegkopf. Die Änderungen des Steuermeldedatums im Beleg können mit dem BAdI VATDATE_VALUES überprüft werden.\nMit dem BAdI Ermittlung des Wechselkurses für Steuerzeilen (BADI_TAX_EXCHANGE_RATE) können Sie denjenigen Wechselkurs ermitteln, der in Belegen für Steuerzeilen relevant ist.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filter-restriction",
						"value": "interval",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Steuermeldedat.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Meldedatum",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuermeldedatum",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TransactionCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "20",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Kombination aus alphabetischen und numerischen Zeichen, die eine betriebswirtschaftliche Aufgabe verschlüsselt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Transaktionscode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "TCode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TransactionCurrency",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Transaktionswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcAccountingDocumentHeaderText",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcCompanyCode",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcDocumentReferenceID",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcExchangeRate",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcExchangeRateDate",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcIntercompanyTransaction",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcLedgerGroup",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcReference1InDocumentHeader",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcReference2InDocumentHeader",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				}],
				"navigationProperty": [{
					"name": "Taxes",
					"relationship": "FAC_FINANCIAL_DOCUMENT_SRV_01.HeaderTaxes",
					"fromRole": "FromRole_HeaderTaxes",
					"toRole": "ToRole_HeaderTaxes"
				},
				{
					"name": "Items",
					"relationship": "FAC_FINANCIAL_DOCUMENT_SRV_01.HeaderItems",
					"fromRole": "FromRole_HeaderItems",
					"toRole": "ToRole_HeaderItems"
				},
				{
					"name": "Attachments",
					"relationship": "FAC_FINANCIAL_DOCUMENT_SRV_01.HeaderAttachments",
					"fromRole": "FromRole_HeaderAttachments",
					"toRole": "ToRole_HeaderAttachments"
				},
				{
					"name": "Notes",
					"relationship": "FAC_FINANCIAL_DOCUMENT_SRV_01.HeaderNotes",
					"fromRole": "FromRole_HeaderNotes",
					"toRole": "ToRole_HeaderNotes"
				},
				{
					"name": "RelatedDocuments",
					"relationship": "FAC_FINANCIAL_DOCUMENT_SRV_01.HeaderRelatedDocuments",
					"fromRole": "FromRole_HeaderRelatedDocuments",
					"toRole": "ToRole_HeaderRelatedDocuments"
				},
				{
					"name": "DocumentViews",
					"relationship": "FAC_FINANCIAL_DOCUMENT_SRV_01.HeaderDocumentViews",
					"fromRole": "FromRole_HeaderDocumentViews",
					"toRole": "ToRole_HeaderDocumentViews"
				}],
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "DocumentView",
				"key": {
					"propertyRef": [{
						"name": "CompanyCode"
					},
					{
						"name": "AccountingDocument"
					},
					{
						"name": "FiscalYear"
					},
					{
						"name": "Ledger"
					}]
				},
				"property": [{
					"name": "CompanyCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, der einen Buchungskreis eindeutig identifiziert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Buchungskreis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "BuKr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AccountingDocument",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"extensions": [{
						"name": "label",
						"value": "Belegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Belegnr.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Buchhaltungsbelegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "FiscalYear",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Zeitraum in der Regel von 12 Monaten, für den das Unternehmen seine Inventur und Bilanz zu erstellen hat. Das Geschäftsjahr kann sich mit dem Kalenderjahr decken, muß es aber nicht.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Geschäftsjahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Jahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Ledger",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Identifiziert ein spezielles Ledger eindeutig.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "text",
						"value": "LedgerName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Ledger",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Ld",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "LedgerName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "30",
					"extensions": [{
						"name": "label",
						"value": "Ld-Bezeichn.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Bezeichnung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Ledger-Bezeichnung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "GLDocumentNumber",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Die Belegnummer identifiziert innerhalb der übergeordneten Organisationseinheit eindeutig den Beleg, der durch einen Vorgang erzeugt wurde.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Belegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Beleg",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "LedgerFiscalYear",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Das Geschäftsjahr definiert einen Zeitraum in der Regel von 12 Monaten, welcher mit dem Kalenderjahr identisch sein kann.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Geschäftsjahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Jahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				}],
				"navigationProperty": [{
					"name": "Items",
					"relationship": "FAC_FINANCIAL_DOCUMENT_SRV_01.DocumentViewGLViewItems",
					"fromRole": "FromRole_DocumentViewGLViewItems",
					"toRole": "ToRole_DocumentViewGLViewItems"
				}],
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "Item",
				"key": {
					"propertyRef": [{
						"name": "AccountingDocument"
					},
					{
						"name": "AccountingDocumentItem"
					},
					{
						"name": "CompanyCode"
					},
					{
						"name": "FiscalYear"
					},
					{
						"name": "Ledger"
					}]
				},
				"property": [{
					"name": "AccountingDocument",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcAccountingDocument",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Belegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Belegnr.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Buchhaltungsbelegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AccountingDocumentItem",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "6",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Alle Positionen innerhalb eines Buchhaltungsbelegs erhalten eine Nummer, über die sie eindeutig identifiziert werden können. Die Nummern werden beim Erfassen des Belegs vom System fortlaufend vergeben.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Position",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Pos",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Sechsstellige Nummer der Buchungszeile",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AdditionalCrcy1",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcAdditionalCrcy1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Hauswährung 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "HW 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Währungsschlüssel der zweiten Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AdditionalCrcy2",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcAdditionalCrcy2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Hauswährung 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "HW 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Währungsschlüssel der dritten Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AddressAndBankDataEnteredManually",
					"type": "Edm.Boolean",
					"nullable": "false",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "besagt, daß Anschriftsdaten in der Belegposition erfaßt werden sollen oder erfaßt worden sind.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Anschriftsdaten sind ein notwendiger Bestandteil von Belegpositionen auf CpD-Konten. Bei Buchungen auf anderen Debitoren oder Kreditoren werden Anschriftsdaten dann erfaßt, wenn der maschinelle Zahlungsverkehr über einen abweichenden Geschäftspartner, eine abweichende Adresse oder eine abweichende Bank erfolgen soll.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcAddressAndBankDataEnteredManually",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Individ Ze",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Kennzeichen: Adresse und Bankdaten individuell gesetzt",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AmountInAdditionalCrcy1",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcAmountInAdditionalCrcy1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "HW2-Betrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Betrag in zweiter Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AmountInAdditionalCrcy2",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcAmountInAdditionalCrcy2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "HW3-Betrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Betrag in dritter Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AmountInCoCodeCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcAmountInCoCodeCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "CoCodeCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Hauswährungsbetrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AmountInPaymentCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcAmountInPaymentCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "PaymentCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "ZW-Betrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Zahlungswährungsbetrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Betrag in Zahlungswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AmountInTransactionCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcAmountInTransactionCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "TransactionCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Betrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Belegwährungsbetrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AssetContract",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "13",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Nummer, durch die das Darlehen, der Mietvertrag,... eindeutig identifizierbar ist. Die Vertragsnummer kann extern durch den Anwender vergeben werden oder sie wird intern über das System ermittelt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcAssetContract",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Vertragsnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AssetContractType",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "1",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Die Vertragsart ist ein interner Schlüssel für die verschiedenen Anwendungsbereiche im Treasury.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Eingabemöglichkeiten:\n1 = Darlehen\n2 = Wertpapier\n3 = Mietvertrag - Immobilien\n4 = Devisen\n5 = Geldhandel\n6 = Derivate\n7 = Kontokorrentgeschäfte\n8 = Verwaltungsvertrag - Immobilien\n9 = Allgemeiner Vertrag - Immobilien\nA = nur interne Verwendung\nE = Exposure-Positionen\nY = Reserviert für Kundenerweiterungen\nZ = Reserviert für Kundenerweiterungen\nDie Vertragsart A ist ausschließlich zur internen Verwendung bestimmt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcAssetContractType",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Vertragsart",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AssetTransactionType",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "3",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcAssetTransactionType",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Bewegungsart",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AssetValueDate",
					"type": "Edm.DateTime",
					"precision": "0",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcAssetValueDate",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Bezugsdatum",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "AssignmentReference",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "18",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Die Zuordnung ist eine Zusatzinformation in der Belegposition.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Die Einzelposten eines Kontos können nach dem Inhalt des Feldes sortiert angezeigt werden.\nDen Feldinhalt können Sie entweder manuell eingeben oder er wird automatisch vom System im Stammsatz über das Feld Sortierschlüssel definiert.\nRegeln für den Aufbau des Feldes Zuordnung definieren Sie im Einführungsleitfaden (IMG) unter Standardsortierung für Einzelposten festlegen.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcAssignmentReference",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Zuordnung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Zuordnungsnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "BaseUnit",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "3",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Mengeneinheit, in der die Bestände des Materials geführt werden. In die Basismengeneinheit rechnet das System alle Mengen um, die Sie in anderen Mengeneinheiten (Alternativmengeneinheiten) erfassen.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Die Basismengeneinheit sowie die Alternativmengeneinheiten mit den dazugehörigen Umrechnungsfaktoren legen Sie im Materialstammsatz fest.\nDa alle Datenfortschreibungen in der Basismengeneinheit erfolgen, ist die Eingabe, die Sie hier machen, im Hinblick auf die Umrechnung von Alternativmengeneinheiten besonders wichtig. In einer Alternativmengeinheit kann eine Menge nur dann exakt dargestellt werden, wenn die zur Verfügung stehenden Nachkommastellen zu ihrer Darstellung ausreichen. Damit dies gewährleistet ist, müssen Sie folgendes beachten:\nDie Basismengeneinheit ist die Einheit, die den höchsten notwendigen Genauigkeitsanspruch befriedigt.\nUmrechnungen der Alternativmengeneinheiten in die Basismengeneinheit sollten zu einfachen Dezimalbrüchen führen (also nicht 1/3 = 0,333...).\nBestandsführung\nIn der Bestandsführung ist die Basismengeneinheit gleichbedeutend mit der Lagermengeneinheit.\nDienstleistung\nFür Dienstleistungen gibt es eigene Mengeneinheiten, z.B.\nLeistungseinheit\nMengeneinheit auf der übergeordneten Ebene der Position. Die genauen Mengenangaben der einzelnen Leistungen stehen jeweils auf der detaillierten Ebene der Leistungszeile.\npauschal\nMengeneinheit auf der Ebene der Leistungszeile für einmalig zu erbringende Leistungen, bei denen keine genauen Mengen angegeben werden können oder sollen.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcBaseUnit",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Basis-ME",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "BME",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Basismengeneinheit",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "unit-of-measure",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "BillingDocument",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Nummer, die den Fakturabeleg (z.B. die Rechnung) eindeutig identifiziert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcBillingDocument",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Faktura",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "BranchAccount",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcBranchAccount",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Filialkontonummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Filialkonto",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Kontonummer der Filiale",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "BusinessArea",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, der einen Geschäftsbereich eindeutig identifiziert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcBusinessArea",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "BusinessAreaName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "GeschBereich",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "GsBe",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Geschäftsbereich",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "BusinessAreaName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "30",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcBusinessArea",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Bezeichnung GB",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Bezeichnung Geschäftsbereich",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Bezeichnung Geschäftsbereich",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "BusinessProcess",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "12",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcBusinessProcess",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Geschäftsprozess",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CapitalGoodIsAffected",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "1",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcCapitalGoodIsAffected",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Investitionsgüter",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Kennzeichen: Investitionsgüter betroffen?",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CashDiscount1Days",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "3",
					"scale": "0",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcCashDiscount1Days",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Skonto Tage 1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Sk1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CashDiscount1Percent",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "5",
					"scale": "3",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Skontoprozentsatz, der bei Einhaltung der kürzesten Zahlungsfrist gewährt wird.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcCashDiscount1Percent",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Skonto 1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "SktP 1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Skonto Prozent 1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CashDiscount2Days",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "3",
					"scale": "0",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcCashDiscount2Days",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Skonto Tage 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Sk2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CashDiscount2Percent",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "5",
					"scale": "3",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Skontoprozentsatz, der bei Einhaltung der zweiten Zahlungsfrist gewährt wird.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcCashDiscount2Percent",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Skonto 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "SktP 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Skonto Prozent 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CashDiscountAmount",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcCashDiscountAmount",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "TransactionCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Skontobetrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Skontobetrag in Belegwährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CashDiscountBaseAmount",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcCashDiscountBaseAmount",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "TransactionCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Skontobasis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Skontofähiger Betrag in Belegwährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ChartOfAccounts",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, der einen Kontenplan eindeutig identifiziert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcChartOfAccounts",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Kontenplan",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "KtPl",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ClearingAccountingDocument",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcClearingAccountingDocument",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Ausgleichsbeleg",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ClearingDate",
					"type": "Edm.DateTime",
					"precision": "0",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcClearingDate",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Ausgleichsdatum",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Ausgl.dat.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CoCodeCurrency",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcCoCodeCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "HWähr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CompanyCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, der einen Buchungskreis eindeutig identifiziert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcCompanyCode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "CompanyCodeName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Buchungskreis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "BuKr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CompanyCodeName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "25",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcCompanyCode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Name der Firma",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Buchungskreis- oder Firmen-Bezeichnung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ControllingArea",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Identifiziert einen Kostenrechnungskreis eindeutig.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Der Kostenrechnungskreis stellt im Controlling die oberste Organisationseinheit dar.\nSowohl bei einer 1:1- als auch bei einer 1:n-Beziehung zwischen Kostenrechnungskreis und Buchungskreis muß die Anzahl der Buchungsperioden des Kostenrechnungskreises und der (des) Buchungskreise(s) identisch sein. Eine Abweichung in den Sonderperioden ist möglich.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcControllingArea",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "KostRechKreis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "KKrs",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Kostenrechnungskreis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CostCenter",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, der eine Kostenstelle eindeutig identifiziert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcCostCenter",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "CostCenterName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Kostenstelle",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Kostenst.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CostCenterName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "20",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcCostCenter",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Profitcenterbezchng",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Profitcenterbezeichnung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CostCtrActivityType",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "6",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, welcher  eindeutig identifiziert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Leistungsarten stellen die erbrachte Leistung einer Kostenstelle dar und werden in Zeit- oder Mengeneinheiten gemessen.\nInnerhalb der Leistungsartenplanung können Steuerdaten festlegen, ob der Tarif zur Bewertung der Leistungsarten manuell gesetzt oder iterativ über die Tarifermittlung berechnet wird.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcCostCtrActivityType",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Leistungsart",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "LstArt",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CostObject",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "12",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Begriff, der die Kostenträger-Identnummer identifiziert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Kostenträger sind die Leistungseinheiten des Betriebs, denen Kosten entsprechend ihrer Verursachung zugerechnet werden. Unterschieden wird im SAP-System zwischen:\nKostenträgern, die durch eine Kostenträger-Identnummer dargestellt werden\nKostenträgern, die durch Objekte anderer Anwendungen dargestellt werden wie beispielsweise Fertigungsaufträge oder Kundenauftragspositionen\nKostenträger werden in folgenden Bereichen durch Kostenträger-Identnummern  dargestellt:\nProzeßkostenrechnung\nIn der Prozeßkostenrechnung werden die Gemeinkosten zunächst auf Kostenstellen gebucht und dann auf die Prozesse verrechnet. Von dort werden sie als Prozeßkosten an Kostenträger weiterverrechnet.\nControlling für immaterielle Güter und Dienstleistungen\nBei der Erstellung immaterieller Güter und Dienstleistungen können die Kosten auf einem Kostenträger-allgemein analysiert werden.\nPeriodisches Produkt-Controlling\nIm  Periodischen Produkt-Controlling können Sie u.a. eine Kostenträgerhierarchie aufbauen, um Istkosten zu erfassen, die nicht auf Material- oder Auftragsebene erfaßt werden können. Die auf die Kostenträgerknoten einer Kostenträgerhierarchie kontierten Kosten können am Periodenende auf die den untersten Kostenträgerknoten zugeordneten Einzelobjekte (z.B. Produktkostensammler) verteilt oder aber direkt von der Kostenträgerhierarchie ausgehend an ein Preisdifferenzenkonto abgerechnet werden.\nInformationssystem Produktkosten-Controlling\nSie können des weiteren im Informationssystem des Produktkosten-Controllings Produktgruppen CO anlegen. Sie legen eine Kostenträger-Identnummer für jede Produktgruppe an und ordnen dieser Kostenträger-Identnummer Materialien zu.  Die Kosten für die zugeordneten Materialien werden im Informationssystem verdichtet und pro Produktgruppe angezeigt.\nDiese Produktgruppe CO können Sie für Berichte der Produktrecherche verwenden.\nDie Kostenträgerart bestimmt, welche Funktionen mit diesem Kostenträger durchgeführt werden können. Funktionen für Kostenträgerhierarchien setzen voraus, daß der eingetragene Kostenträger als Hierarchiebeginn gekennzeichnet ist.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcCostObject",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Kostenträger",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Kst.träger",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CreditAmountInAdditionalCrcy1",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Betrag der Belegposition in der Hauswährung des Buchungskreises, sofern  es sich um eine Habenposition handelt. Der Betrag ist mit negativem  Vorzeichen versehen.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcAdditionalCrcy1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "AdditionalCrcy1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Haben-Btrg HW2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Haben-Betrag in HW2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Haben-Betrag in zweiter Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CreditAmountInAdditionalCrcy2",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Betrag der Belegposition in der Hauswährung des Buchungskreises, sofern  es sich um eine Habenposition handelt. Der Betrag ist mit negativem  Vorzeichen versehen.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcAdditionalCrcy2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "AdditionalCrcy2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Haben-Btrg HW3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Haben-Betrag in HW3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Haben-Betrag in dritter Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CreditAmountInCoCodeCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Betrag der Belegposition in der Hauswährung des Buchungskreises, sofern  es sich um eine Habenposition handelt. Der Betrag ist mit negativem  Vorzeichen versehen.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcCreditAmountInCoCodeCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "CoCodeCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Haben-Btrg in HW",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Haben",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Haben-Betrag in Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CreditAmountInTransactionCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Betrag der Belegposition in der Belegwährung, sofern es sich um eine Habenposition handelt. Der Betrag ist mit negativem Vorzeichen versehen. Bei einer Sollposition wird dieses Feld mit '0' gefüllt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Dieses Feld steht nur bei ABAP-Auswertungen über logische Daten zur Verfügung.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcCreditAmountInTransactionCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "TransactionCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Haben-Btrg in Bw",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Haben",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Haben-Betrag in Belegwährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Customer",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Gibt einen alphanumerischen Schlüssel an, der den Kunden bzw. Debitor innerhalb des SAP-Systems eindeutig identifiziert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcCustomer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "CustomerName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Debitor",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Debitorennummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CustomerCountry",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "3",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Länderschlüssel, unter dem Festlegungen getroffen werden, die zur Prüfung von Eingaben verwendet werden, wie z.B. Länge der Postleitzahl oder Länge der Bankkontonummer.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "In der Regel wird der zweistellige ISO-CODE gemäß ISO 3166 verwendet, der von SAP als Vorschlag ausgeliefert wird.\nAndere Möglichkeiten sind der Länderschlüssel für Kraftfahrzeuge oder ein landestypischer Schlüssel, wie z.B. in Deutschland der Schlüssel des statistischen Bundesamtes.\nDie Länderschlüssel werden bei der Systemeinführung bei den globalen Einstellungen festgelegt.\nDie Definition des Länderschlüssels im SAP-System braucht nicht notwendigerweise mit politischen oder staatlichen Einheiten übereinzustimmen.\nWeil der Länderschlüssel nicht in allen Installationen mit dem ISO-Code übereinstimmen muss, dürfen Programme, die nach bestimmten Werten des Länderschlüssels unterscheiden, nicht den Länderschlüssel T005-LAND1 abfragen, sondern müssen auf den ISO-Code T005-INTCA programmieren.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Land",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Lnd",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Länderschlüssel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CustomerName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "35",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Name 1 der Geschäftspartneranschrift",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcCustomer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Name",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Name 1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Name 1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DataExchangeInstruction1",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcDataExchangeInstruction1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Anweisung 1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "W1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Weisungsschlüssel 1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DataExchangeInstruction2",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcDataExchangeInstruction2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Anweisung 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "W2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Weisungsschlüssel 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DataExchangeInstruction3",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcDataExchangeInstruction3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Anweisung 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "W3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Weisungsschlüssel 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DataExchangeInstruction4",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcDataExchangeInstruction4",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Anweisung 4",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "W4",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Weisungsschlüssel 4",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DebitAmountInAdditionalCrcy1",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Betrag der Belegposition in der Hauswährung des Buchungskreises, sofern  es sich um eine Sollposition handelt. Der Betrag ist mit positivem  Vorzeichen versehen.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcAdditionalCrcy1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "AdditionalCrcy1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Soll-Btrg HW2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Soll-Betrag in HW2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Soll-Betrag in zweiter Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DebitAmountInAdditionalCrcy2",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Betrag der Belegposition in der Hauswährung des Buchungskreises, sofern  es sich um eine Sollposition handelt. Der Betrag ist mit positivem  Vorzeichen versehen.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcAdditionalCrcy2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "AdditionalCrcy2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Soll-Btrg HW3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Soll-Betrag in HW3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Soll-Betrag in dritter Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DebitAmountInCoCodeCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Betrag der Belegposition in der Hauswährung des Buchungskreises, sofern  es sich um eine Sollposition handelt. Der Betrag ist mit positivem  Vorzeichen versehen.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcDebitAmountInCoCodeCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "CoCodeCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Soll-Btrg in HW",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Soll",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Soll-Betrag in Hauswährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DebitAmountInTransactionCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Betrag der Belegposition in der Belegwährung, sofern es sich um eine Sollposition handelt. Der Betrag ist mit positivem Vorzeichen versehen. Bei einer Habenposition wird dieses Feld mit '0' gefüllt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Dieses Feld steht nur bei ABAP-Auswertungen über logische Daten zur Verfügung.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcDebitAmountInTransactionCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "TransactionCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Soll-Btrg in Bw",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Soll",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Soll-Betrag in Belegwährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DistributionChannel",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcDistributionChannel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "DistributionChannelName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Vertriebsweg",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DistributionChannelName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "20",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcDistributionChannel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Bezeichnung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DocumentItemText",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "50",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcDocumentItemText",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Positionstext",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DueCalculationBaseDate",
					"type": "Edm.DateTime",
					"precision": "0",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Datum, auf das sich die Fristen für die Skontofälligkeit und die Nettofälligkeit beziehen. Dies ist der Fall bei Belegpositionen auf Kontokorrentkonten.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Bei Belegpositionen auf Sachkonten ist der Posten zu diesem Datum sofort fällig, da es keine Skontoangaben gibt.\nBei der Belegerfassung für Kontokorrentkonten wird das Datum ggf. vorgeschlagen. Voraussetzung ist, daß im Stammsatz des Geschäftspartners ein Zahlungsbedingungsschlüssel vorgegeben wurde, für den ein Vorschlagswert im Beleg gewünscht ist.\nDas vorgeschlagene Datum kann überschrieben werden.\nSind sämtliche Skontoprozentsätze (und Tage) nicht gefüllt, so ist das Zahlungsfristenbasisdatum gleich dem Fälligkeitsdatum.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcDueCalculationBaseDate",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Basisdatum",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Basisdat.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Basisdatum für Fälligkeitsberechnung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DunningArea",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcDunningArea",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Mahnbereich",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Mahnber.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DunningBlockingReasonCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "1",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, der den Grund für eine Mahnsperre wiedergibt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcDunningBlockingReasonCode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Mahnsperre",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Mahnsp",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DunningKey",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "1",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcDunningKey",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Mahnschlüssel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "MhnSchl.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DunningLevel",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "1",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcDunningLevel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Mahnstufe",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Mahnst",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "EmploymentTaxDistrType",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Lohnsteuer in Argentinien:",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Mit Hilfe von Verteilungsarten können regional verschiedene Koeffizienten für die Lohnsteuer behandelt werden.\nDie gebräuchlichste Verteilungsart in Argentinien is die multilaterale Vereinbarung.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcEmploymentTaxDistrType",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Verteilungsart",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Distr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Verteilungsart für Lohnsteuer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "EUTriangularDeal",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "1",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcEUTriangularDeal",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Dreiecksgeschäft EU",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "FinancialAccountType",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "1",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcFinancialAccountType",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Kontoart",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "FinancialTransactionType",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "3",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcFinancialTransactionType",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Bewegungsart",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "FiscalYear",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Zeitraum in der Regel von 12 Monaten, für den das Unternehmen seine Inventur und Bilanz zu erstellen hat. Das Geschäftsjahr kann sich mit dem Kalenderjahr decken, muß es aber nicht.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Geschäftsjahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Jahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "FixedAsset",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Nummer, die (zusammen mit der Anlagenhauptnummer) eine Anlage in der Anlagenbuchhaltung eindeutig identifiziert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Mit Hilfe der Anlagenunternummer ist es möglich\nnachträgliche Zugänge zu einer Anlage gesondert zu verwalten\numfangreiche Wirtschaftsgüter mit Teilanlagen darzustellen\nIm Gegensatz zur Anlagenhauptnummer muß die Anlagenunternummer numerisch sein.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcFixedAsset",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Unternummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "UNr.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Anlagenunternummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "FixedCashDiscount",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "1",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcFixedCashDiscount",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Fixe Zahlungsbeding.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Beding.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Fixe Zahlungsbedingungen",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "FollowOnDocumentType",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "1",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcFollowOnDocumentType",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Folgebelegart",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Folg.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "FunctionalArea",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "16",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Gliederungskriterium für ein Unternehmen oder eine öffentliche Verwaltung nach funktionalen Gesichtspunkten.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Verwendung für das Umsatzkostenverfahren\nDer Funktionsbereich wird benötigt, um in der Finanzbuchhaltung ein Gewinn- und Verlustrechnung nach dem Umsatzkostenverfahren erstellen. Gliederungskriterien könnten beispielsweise sein:\nHerstellung\nVerwaltung\nVertrieb\nForschung und Entwicklung.\nVerwendung für öffentliche Verwaltungen\nDer Funktionsbereich wird im Haushaltsmanagement benötigt, um gesetzliche Anforderungen an ein Reporting nach funktionalen Gesichtspunkten zu erfüllen. Sie können mit dem Funktionsbereich die globalen Ziele und Zwecke (z.B. Öffentliche Sicherheit, Stadtentwicklung etc.) insbesondere von Ausgaben Ihrer Organisation abbilden.\nbei Verwendung für das Umsatzkostenverfahren\nLesen Sie die Dokumentation zur Eingebbarkeit des Felds Funktionsbereich.\nAusführliche Informationen zum Umsatzkostenverfahren und zum Funktionsbereich finden Sie in der SAP-Bibliothek unter Rechnungswesen -> Finanzwesen -> Hauptbuchhaltung -> Umsatzkostenverfahren .\nbei Verwendung für öffentliche Verwaltungen\nWeitere Informationen zum Funktionsbereich finden Sie im Einführungsleitfaden des Haushaltsmanagement Öffentliche Verwaltung  im Abschnitt Kontierungselemente aktivieren.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcFunctionalArea",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "FunctionalAreaName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "FunktBereich",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Funktionsbereich",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Funktionsbereich",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "FunctionalAreaName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "25",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcFunctionalArea",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "FunktionsberTxt",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Bezeichnung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Bezeichnung des Funktionsbereichs",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "GLAccount",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "The G/L account number identifies the G/L account in a chart of accounts.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcGLAccount",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "GLAccountName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Sachkonto",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "GLAccountName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "20",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Der Sachkontenkurztext wird für Dialoganzeigen und Auswertungen verwendet, die nicht über ausreichenden Platz für den Langtext verfügen.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcGLAccount",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Kurztext",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Sachkontenkurztext",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "GoodsDeliveryDestinationCountry",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "3",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Land, in das eine Ware geliefert wird.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Im Feld wird der Länderschlüssel des Debitors vorgeschlagen.\nDen Vorschlagswert müssen Sie ändern, wenn das Bestimmungsland der Ware vom Meldeland (siehe gleichnamiges Feld) abweicht.\nDas Feld wird derzeit noch nicht in Auswertungen verwendet, es ist geplant, dieses Feld bei der Abwicklung von Dreiecksgeschäften zu nutzen.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcGoodsDeliveryDestinationCountry",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Bestimm.Land",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Bestimmungsland",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Bestimmungsland für Warenlieferung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "GrossIncomeTaxActivityCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Steuern in Argentinien:",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Tätigkeitskennzeichen (Produktion, Vertrieb, etc) für Berichte zur Bruttoeinkommenssteuer.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcGrossIncomeTaxActivityCode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Tätigkeitscode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "AC",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Tätigkeitskennzeichen für Bruttoeinkommenssteuer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "GrossIncomeTaxRegion",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "3",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Bildet in einigen Ländern einen Bestandteil der Anschrift. Die jeweilige Bedeutung ist länderspezifisch.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Die automatische Adreßaufbereitung gibt bei Adressen in USA, Kanada, Italien, Brasilien oder Australien den Schlüsselwert des Regionalcodes in der aufbereiteten Adresse mit aus, bei Adressen in Großbritannien die entsprechende Textbezeichnung der Grafschaft.\nSiehe dazu die Beispiele in der Dokumentation zum Schlüssel Adreßaufbau\nBedeutung des Regionalcodes in ...\n  USA             ->  Bundesstaat\n  Italien         ->  Provinz\n  Kanada          ->  Provinz\n  Großbritannien  ->  Grafschaft\n  Brasilien       ->  Bundesstaat\n  Australien      ->  Provinz\n  Deutschland     ->  Bundesland\n  Schweiz         ->  Kanton\n  Japan           ->  Präfektur",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcGrossIncomeTaxRegion",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Region",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Rg",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Region (Bundesstaat, Bundesland, Provinz, Grafschaft)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "HouseBank",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcHouseBank",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Hausbank",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Schlüssel Hausbank",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "HouseBankAccount",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Dieser Schlüssel definiert zusammen mit dem Schlüssel für die Hausbank eindeutig ein Bankkonto.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcHouseBankAccount",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Konto-Id",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Kurzschlüssel für eine Kontenverbindung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Industry",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcIndustry",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "IndustryName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Branche",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Branchenschlüssel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "IndustryName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "20",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcIndustry",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Branchenname",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "InvoiceItemReference",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "3",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcInvoiceItemReference",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Buchungszeile",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "InvoiceList",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "8",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Die Rechnungslistennummer ist ein gemeinsames Ordnungsmerkmal für alle Belegpositionen, die auf einer Sammelrechnung an den Kunden aufgeführt sind.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Die Bezugnahme auf die Rechnungslistennummer ermöglicht beim Zahlungseingang ein schnelles Auffinden der vom Kunden bezahlten Positionen.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcInvoiceList",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "SammelRechnListenNr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "SammRech.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Sammelrechnungslistennummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "InvoiceReference",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Für Belegpositionen, die zu einer anderen Belegposition in Beziehung stehen, enthält dieses Feld die Nummer des Partnerbeleges.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Im Standardsystem wird das Feld verwendet für\nGutschriften, die sich auf eine bestimmte Rechnungsposition beziehen\nFolgerechnungen zu einer Rechnungsposition\nTeilzahlungen zu einer Rechnungsposition\nTeilverrechnungen von Anzahlungen\nIn den beiden erstgenannten Fällen werden die Zahlungsbedingungen aus der referierten Rechnungsposition in die Position kopiert, die Sie gerade bearbeiten. Damit wird sichergestellt, daß die Posten zum gleichen Termin fällig und beim maschinellen Zahlen zusammen reguliert werden.\nEine Sonderregelung gilt für Gutschriften, bei denen in diesem Feld ein 'V' steht. Dadurch erfolgt die Fälligkeitsermittlung wie bei einer Rechnung. Ist das Feld leer (es enthält keine Belegnummer und kein 'V'), ist die Fälligkeit am Zahlungsfristen-Basisdatum.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcInvoiceReference",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Rechnungsbezug",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "RechnBezug",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Belegnummer der Rechnung, zu der die Transaktion gehört",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "InvoiceReferenceFiscalYear",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcInvoiceReferenceFiscalYear",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Geschäftsjahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "IsAutomaticallyCreated",
					"type": "Edm.Boolean",
					"nullable": "false",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "sagt aus, daß die angezeigte Belegposition nicht manuell erfaßt, sondern vom System automatisch erzeugt wurde.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcIsAutomaticallyCreated",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Autom.erzeugt",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Aut",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Kennzeichen: Position automatisch erzeugt",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "IsNotLiableToCashDiscount",
					"type": "Edm.Boolean",
					"nullable": "false",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcIsNotLiableToCashDiscount",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Ohne Skonto",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Kennzeichen: Buchungszeile nicht skontorelevant ?",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "IsServiceActivity",
					"type": "Edm.Boolean",
					"nullable": "false",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcIsServiceActivity",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Dienstleistung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Dienstleistungskennzeichen (Auslandszahlung)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "LastDunningDate",
					"type": "Edm.DateTime",
					"precision": "0",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcLastDunningDate",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Letzte Mahnung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Gemahnt",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Datum der letzten Mahnung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Ledger",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Identifiziert ein spezielles Ledger eindeutig.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcLedger",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Ledger",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Ld",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "MandateReference",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "35",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Identifiziert zusammen mit der Gläubiger-Identifikationsnummer das Mandat eindeutig.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Die Mandatsreferenz kann extern vorgegeben oder durch interne Nummernvergabe ermittelt werden. Bei interner Nummernvergabe ermittelt das System 12-stellige numerische Mandatsreferenzen.\nOb interne oder externe Nummernvergabe oder beides möglich ist, hängt von der jeweiligen Anwendung ab.\nNach Anlage eines Mandats ist dessen Mandatsreferenz nicht mehr änderbar.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcMandateReference",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Mandatsreferenz",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Eindeutige Referenz auf das Mandat je Zahlungsempfänger",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "MasterFixedAsset",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "12",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcMasterFixedAsset",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Anlagenhauptnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Anlage",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Material",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "18",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcMaterial",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "MaterialName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Materialnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Externe lange Materialnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "MaterialName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "40",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Bis zu 40 Stellen langer Text, der das Material näher bezeichnet. Der Materialkurztext ist die Bezeichnung des Materials.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Es kann für beliebig viele Sprachen jeweils genau einen Kurztext geben.\nPrinzipiell erfassen Sie den Materialkurztext auf dem Datenbild des ersten Fachbereichs, für den Sie Daten erfassen, und zwar in der Sprache, in der Sie angemeldet sind. Auf dem Grunddatenbild ist der Materialkurztext überschreibbar.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcMaterial",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Bezeichnung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Materialkurztext",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Materialkurztext",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "MethOfCoCodeCrcyDetn",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "1",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcMethOfCoCodeCurrencyDetn",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "MethOfCoCodeCrcyDetnName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Methode, mit der der Hauswährungsbetrag ermittelt wurde",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "MethOfCoCodeCrcyDetnName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "60",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Dieser Text wird u.a. bei der Erstellung von Listen und beim Aufruf der Dokumentation angezeigt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcMethOfCoCodeCurrencyDetn",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Kurzbeschreibung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Erläuternder Kurztext",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "NetPaymentAmount",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcNetPaymentAmount",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "TransactionCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Zahlungsbetrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "NetPaymentDays",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "3",
					"scale": "0",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcNetPaymentDays",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Tage netto",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Netto",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Frist für Nettokondition",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OneTimeAcctBankAccount",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "18",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Dieses Feld enthält die Nummer, unter der das Konto bei der Bank geführt wird.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOneTimeAcctBankAccount",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Bankkonto",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Bankkontonummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OneTimeAcctBankControlKey",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": " Brasilien, Frankreich, Spanien, Portugal und Italien",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Das Feld enthält einen Prüfschlüssel für die Kombination Bankleitzahl und Bankkontonummer.\n USA\nIn USA wird über dieses Feld entschieden, ob es sich um ein Spar- oder Girokonto handelt (wurde kein Wert angegeben, so wird als Defaultwert 01 verwendet):\n01 Girokonto\n02 Sparkonto\n03 Darlehen\n04 Hauptbuch\n Japan\nIn Japan gibt der Feldinhalt die Art des Kontos an. Diese Information wird vom Zahlungsträgerdruckprogramm in den Zahlungsträger übernommen. Folgende Kontoarten werden z.B. verwendet:\n01 FUTSU (entspricht etwa einem Sparkonto)\n02 TOUZA (entspricht etwa einem Girokonto)\n04 CHOCHIKU (entspricht etwa eimem Anlagekonto)\n09 sonstige Bankkonten\n Südafrika\nIn Südafrika wird über dieses Feld mitgeteilt, welchen Typ das Konto hat. Die hier eingegebene Information wird an die Bank, die den Zahlungsauftrag durchführt, weitergeleitet. Folgende Kontotypen sind im ACB-Format erlaubt:\n01 Current (Cheque) Account\n02 Savings Account\n03 Transmission Account\n04 Bond Account\n06 Subscription Share Account\n Argentinien\nIn Argentinien wird der Typ des Kontos angegeben:\nCC Current Account (Cuenta corriente)\nCA Saving Account (Caja de ahorro)\nCE Special Saving Account (Caja de ahorro especial)\nCS Salary Account (Cuenta sueldos)\n Venezuela\nIn Venezuela wird der Typ des Kontos angegeben:\nCC Checking Account (Cuenta corriente)\nCA Saving Account (Cuenta de ahorro)\nCE Special Saving Account (Cuenta de ahorro especial)\nCS Salary Account (Cuenta sueldos)\n Mexiko\nIn Mexiko enthält dieses Feld einen zweistelligen Schlüssel zur Klassifizierung des Bankkontos, z.B. als Spar- oder Girokonto, der bankenabhängig eine unterschiedliche Definition hat.\n Indien\nIn Indien gibt dieses Feld den Bankkontotyp des Mitarbeiters an. Die Kontotypen sind folgendermaßen festgelegt:\n10 Sparkonto\n11 Girokonto\nHinweis\nIn den Ländern, die nicht hier aufgeführt sind, kann das Feld für kontenspezifische Information verwendet werden.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOneTimeAcctBankControlKey",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Kontrollschl.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "KS",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Bankenkontrollschlüssel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OneTimeAcctBankCountryKey",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "3",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Identifiziert das Land, in dem die Bank ihren Sitz hat.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Der Länderschlüssel bestimmt, nach welchen Regeln die restlichen Bankdaten (z.B. Bankleitzahl und Bankkontonummer) geprüft werden.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOneTimeAcctBankCountryKey",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Bankland",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Land",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Länderschlüssel der Bank",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OneTimeAcctBankNumber",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "15",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "In diesem Feld wird der Bankschlüssel angegeben, unter dem im jeweiligen Land die Bankdaten abgelegt sind.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Die länderspezifische Bedeutung dieses Bankschlüssels wird beim Definieren des Länderschlüssels festgelegt.\nIm Normalfall werden Banken unter ihrer Bankleitzahl geführt, die Bankleitzahl erscheint dann duplikativ bei den Steuerungsdaten der Bank.\nIn bestimmten Ländern übernimmt die Bankkontonummer diese Funktion; es gibt dann keine Bankleitzahlen, die Bankdaten werden unter der Kontonummer geführt.\nFür den Datenträgeraustausch kann es sinnvoll sein, Banken ausländischer Geschäftspartner auch ohne Bankleitzahl erfassen zu können, auch wenn es im betreffenden Land Bankleitzahlen gibt. In diesen Fällen kann der Bankschlüssel intern vergeben werden.\nFalls die Bankdaten unter einem anderen Schlüssel, wie z.B. dem SWIFT-Code geführt werden sollen, kann auch eine externe Nummernvergabe vereinbart werden.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOneTimeAcctBankNumber",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Bankschlüssel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OneTimeAcctCityName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "35",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Name des Orts als Bestandteil der Adresse.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOneTimeAcctCityName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Ort",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OneTimeAcctCountryKey",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "3",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Hier geben Sie den Länderschlüssel zum Debitor oder Kreditor an.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOneTimeAcctCountryKey",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Land",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Lnd",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Länderschlüssel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OneTimeAcctIBAN",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "34",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Gemäß ECBS (European Commitee for Banking Standards) normierte, einheitliche Kennummer zur Darstellung einer Bankverbindung. Eine IBAN enthält maximal 34 alphanumerische Zeichen und setzt sich aus einer Kombination folgender Elemente zusammen:",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Länderschlüssel der Bank (ISO-Code)\nZweistellige Prüfziffer\nLandesspezifische Kontonummer (besteht z. B. in Deutschland aus der Bankleitzahl und der Kontonummer, in Frankreich aus der Bankleitzahl, der Kontonummer und dem Kontrollschlüssel).\nDie Verwendung der IBAN erleichtert grenzüberschreitende Zahlungen, bietet in manchen Ländern aber auch im Inlandszahlungsverkehr Vorteile. Je nach Land können Sie Valuta- und Gebührenvorteile erzielen.\nDie IBAN kann parallel zur Bankverbindung geführt werden, ersetzt diese jedoch nicht. Sie wird unter den Stammdaten des Geschäftspartners gespeichert und kann dann bei der Erstellung der Zahlungsträger verwendet werden.\nDa nur die kontoführende Bank die IBAN generieren darf, die einer Kontonummer entspricht, erzeugt das SAP-System nur einen Vorschlag. Diesen können Sie bestätigen oder ändern. Wenn kein Vorschlag erzeugt werden konnte, geben Sie die IBAN selbst ein.\nSo könnte eine IBAN in Belgien aussehen:\nElektronische Form:\nBE62510007547061\nGedruckte Form, wie sie auf der Rechnung erscheint:\nIBAN BE62 5100 0754 7061",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOneTimeAcctIBAN",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "IBAN",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "IBAN (International Bank Account Number)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OneTimeAcctIBANValidFrom",
					"type": "Edm.DateTime",
					"precision": "0",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOneTimeAcctIBANValidFrom",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "IBAN gültig ab",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Gültigkeitsbeginn der IBAN",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Gültigkeitsbeginn der IBAN",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OneTimeAcctInstrnKeyForDataMdmExch",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Im automatischen Zahlungsverkehr steuert dieses Feld (zusammen mit dem Land der Hausbank und dem durch das Zahlungsprogramm ermittelten Zahlweg), welche Anweisungen an die beteiligten Banken bezüglich der Ausführung des Zahlungsauftrags gegeben werden. Dieses Feld wird unter anderem in Deutschland, Österreich, den Niederlanden, Norwegen, Finnland, Spanien und Japan sowie für das internationale SWIFT-Format MT100 verwendet.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Auswahl des Weisungsschlüssels\nDer Weisungsschlüssel muß bei Verwendung des Datenträgeraustauschs (sowie in Einzelfällen bei beleghaften Zahlungsaufträgen) im Kreditoren- bzw. Debitorenstammsatz oder zu den DTA-Daten zur Hausbank in der Systemeinstellung gepflegt sein. Dabei gilt folgende Reihenfolge:\nIst der Weisungsschlüssel im Stammsatz gepflegt, so wird dieser Weisungsschlüssel verwendet.\nIst im Kreditorenstammsatz kein Weisungsschlüssel vorhanden, so wird der Default-Weisungsschlüssel benutzt, der zur Hausbank hinterlegt ist.\nSomit ist es nicht notwendig, alle Geschäftspartner mit einem Weisungsschlüssel zu versehen; es sind dort nur die Ausnahmen zu pflegen.\n 1\nIst es notwendig, der Hausbank für einen Geschäftspartner eine Weisung mitzugeben, die von der im Stammsatz hinterlegten Weisung abweicht, so ist dies über die Zahlungsvorschlagsbearbeitung möglich.\n 2\nFür CPD-Konten ist der Weisungsschlüssel im Beleg anzugeben.\n 3\nDie vier Weisungsfelder des Weisungsschlüssels können durch Eingabe von Weisungen im Beleg (Bild 'Weitere Daten' der Kreditoren- bzw. Debitorenzeile) übersteuert werden.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOneTimeAcctInstrnKeyForDataMdmExch",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Weisungsschl.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "WS",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Weisungsschlüssel fuer Datenträgeraustausch",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OneTimeAcctIsLiableForVAT",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "1",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Legt fest, ob das Unternehmen umsatzsteuerpflichtig ist.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOneTimeAcctIsLiableForVAT",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Umsatzsteuerpfl",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Umsatzsteuerpfl.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Umsatzsteuerpflichtig",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OneTimeAcctLanguage",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "1",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Der Sprachenschlüssel gibt an",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "- in welcher Sprache Texte angezeigt werden,\n- in welcher Sprache Sie Texte erfassen,\n- in welcher Sprache das System Druckausgaben erstellt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOneTimeAcctLanguage",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Sprache",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Sprachenschlüssel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OneTimeAcctName1",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "35",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Name 1 der Geschäftspartneranschrift",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOneTimeAcctName1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Name",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Name 1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Name 1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OneTimeAcctName2",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "35",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Name 2 der Geschäftspartneranschrift",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOneTimeAcctName2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Name 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OneTimeAcctName3",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "35",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Name 3 der Geschäftspartneranschrift",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOneTimeAcctName3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Name 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OneTimeAcctName4",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "35",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Name 4 der Geschäftspartneranschrift",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOneTimeAcctName4",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Name 4",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OneTimeAcctPOBox",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOneTimeAcctPOBox",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Postfach",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OneTimeAcctPOBoxPostalCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOneTimeAcctPOBoxPostalCode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "PLZ des Postfachs",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "PstfachPLZ",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Postleitzahl des Postfachs",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OneTimeAcctPostalCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOneTimeAcctPostalCode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Postleitzahl",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OneTimeAcctRegion",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "3",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Bildet in einigen Ländern einen Bestandteil der Anschrift. Die jeweilige Bedeutung ist länderspezifisch.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Die automatische Adreßaufbereitung gibt bei Adressen in USA, Kanada, Italien, Brasilien oder Australien den Schlüsselwert des Regionalcodes in der aufbereiteten Adresse mit aus, bei Adressen in Großbritannien die entsprechende Textbezeichnung der Grafschaft.\nSiehe dazu die Beispiele in der Dokumentation zum Schlüssel Adreßaufbau\nBedeutung des Regionalcodes in ...\n  USA             ->  Bundesstaat\n  Italien         ->  Provinz\n  Kanada          ->  Provinz\n  Großbritannien  ->  Grafschaft\n  Brasilien       ->  Bundesstaat\n  Australien      ->  Provinz\n  Deutschland     ->  Bundesland\n  Schweiz         ->  Kanton\n  Japan           ->  Präfektur",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOneTimeAcctRegion",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Region",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Rg",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Region (Bundesstaat, Bundesland, Provinz, Grafschaft)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OneTimeAcctRptKeyForDataMdmExch",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "1",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Wird in der Bundesrepublik Deutschland beim Datenträgeraustausch ins Ausland eine Bundesbankmeldung durch das beauftragte Kreditinstitut durchgeführt, so wird durch dieses Feld gesteuert, ob auch der Inhalt des Einzeldatensatzes an die Bundesbank weitergegeben werden soll.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Wird keine Eingabe gemacht, so wird der Wert aus den DTA-Angaben zur Hausbank ermittelt. Prüfen Sie die Einstellungen im Customizing der Hausbanken, indem Sie dort die Hausbank auswählen und unter Datenträgeraustausch die Meldedaten kontrollieren.\nFunktion ausführen",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOneTimeAcctRptKeyForDataMdmExch",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "DTA-Meldeschl.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "M",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Meldeschlüssel für Datenträgeraustausch",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OneTimeAcctStreetName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "35",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Straße und Hausnummer als Bestandteil der Adresse.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOneTimeAcctStreetName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Straße",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Straße und Hausnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OneTimeAcctSubjectToEqualizationTax",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "1",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Kennzeichen, durch das eine Warnung beim Bebuchen des Kreditorenkontos ausgelöst wird.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Das Kennzeichen wird in Spanien für die Ausgleichssteuer (Recargo de Equivalencia) bei Lieferungen an den Einzelhandel verwendet.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOneTimeAcctSubjectToEqualizationTax",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Ausgl.Steuer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Ausgl.St.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Kennzeichen: Geschäftspartner ausgleichssteuerpflichtig?",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OneTimeAcctTaxID1",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "16",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOneTimeAcctTaxID1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Steuernummer 1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Steuernr.1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OneTimeAcctTaxID2",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "11",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOneTimeAcctTaxID2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Steuernummer 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Order",
					"type": "Edm.String",
					"maxLength": "12",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, der einen Auftrag innerhalb eines Mandanten eindeutig identifiziert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcOrder",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Auftrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Auftragsnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PartnerBankType",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPartnerBankType",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Partnerbanktyp",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PartnerBusinessArea",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "This field contains the business area of the trading partner. Together with the business area to which the posting is made, there is a sender/receiver relationship in each line item.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "This relationship enables the elimination of IC sales at business area level within business area consolidation.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPartnerBusinessArea",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "PartnerBusinessAreaName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "GB Partnergesellsch.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Geschäftsbereich der Partnergesellschaft",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PartnerBusinessAreaName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "30",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPartnerBusinessArea",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Bezeichnung GB",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Bezeichnung Geschäftsbereich",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Bezeichnung Geschäftsbereich",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PartnerCompanyCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "6",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Konzernweit eindeutige Gesellschaftsnummer in Ihrem Konzern",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPartnerCompanyCode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "PartnerCompanyCodeName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "PartnGesellsch",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "PartGs",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Partner Gesellschaftsnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PartnerCompanyCodeName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "30",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Frei wählbarer Name einer Gesellschaft.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPartnerCompanyCode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Name",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Name der Gesellschaft",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Name der Gesellschaft",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PartnerProfitCenter",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "The partner profit center is used to identify exchanges of goods and services between profit centers.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "For a profit center that sends a good or service, the receiver profit center is identified as the partner profit center. For the receiver, the sender is the partner profit center.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPartnerProfitCenter",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "PartnerProfitCenterName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Partnerprofitcenter",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PartnerProfitCenterName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "20",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPartnerProfitCenter",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Profitcenterbezchng",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Profitcenterbezeichnung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PartnerSegment",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPartnerSegment",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "PartnerSegmentName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Partnersegment",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "PSegment",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Partnersegment für Segmentberichterstattung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PartnerSegmentName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "50",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Feld zur Hinterlegung eines erklärenden Textes",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPartnerSegment",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Erklärung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Text",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Textfeld",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PaymentBlockingReason",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "1",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Gibt an, warum ein Beleg zur Zahlung gesperrt wird.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Es sind folgende Zahlsperren zu unterscheiden:\nManuelle Zahlsperre\nWenn Sie manuell eine Zahlsperre aus dem Listfeld auswählen, um die Rechnung zur Zahlung zu sperren, wird im Kopf des Rechnungsbelegs das Feld Zahlsperre mit dem entsprechenden Kennzeichen gefüllt.\nGesperrt wegen Abweichungen\nWenn Rechnungen automatisch wegen Abweichungen in den Rechnungspositionen gesperrt werden, trägt das System die Zahlsperre R in die Kreditorenzeile des Buchhaltungsbelegs ein. Das Feld im Kopf des Rechnungsbelegs bleibt leer.\nStochastische Zahlsperre\nRechnungen, die sonst keinen Sperrgrund aufweisen, können nach dem dem Zufallsprinzip gesperrt werden.  Im Customizing der Logistik-Rechnungsprüfung können Sie die Warscheinlichkeit der Sperre einstellen. Im Kopf des Rechnungsbelegs wird das Kennzeichen für die Logistische Zahlsperre eingetragen.\nWenn Sie eine manuelle Zahlsperre gesetzt haben, und eine Rechnung außerdem automatisch wegen Abweichungen in Rechnungspositionen gesperrt wird, füllt das System die manuelle Zahlsperre in die Kreditorenzeile des Buchhaltungsbelegs.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPaymentBlockingReason",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "PaymentBlockingReasonName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "PositionsZahlSperre",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "PZS",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Zahlungssperre für Position",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PaymentBlockingReasonName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "20",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPaymentBlockingReason",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Bedeutung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Erläuterung des Zahlungssperrgrunds",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PaymentCurrency",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPaymentCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Autom. Zahlungswhrg",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "ZWähr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Währung für automatische Zahlung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PaymentDifferenceReason",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "3",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPaymentDifferenceReason",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Differenzgrund",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Dgr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Differenzgrund bei Zahlungen",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PaymentMethod",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "1",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Zahlweg, über den dieser Posten bezahlt werden soll.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Wenn ein Zahlweg eingetragen ist, kann im automatischen Zahlungsverkehr nur dieser Zahlweg verwendet werden. Wenn kein Zahlweg eingetragen ist, wird im Zahlungsprogramm nach vorgegebenen Regeln einer der Zahlwege ausgewählt, die im Stammsatz erlaubt wurden.\nBei der Belegerfassung oder Belegänderung geben Sie nur dann einen Zahlweg ein, wenn Sie die automatische Zahlwegauswahl des Zahlungsprogramms bewußt ausschalten wollen.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPaymentMethod",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "PaymentMethodName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Zahlweg",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "ZW",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PaymentMethodName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "50",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPaymentMethod",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Beschreibung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Grund für Mahnsperre",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PaymentMethodSupplement",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Merkmal im offenen Posten zur Gruppierung von Zahlungen.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Posten mit unterschiedlichen Zahlwegzusätzen werden getrennt voneinander reguliert. Beim Formulardruck besteht die Möglichkeit, getrennt pro Zahlwegzusatz zu drucken. Damit können z.B. Schecks in mehrere Gruppen unterteilt werden, die z.B. vor dem Postversand unterschiedliche Kontrollverfahren im Haus durchlaufen.\nBei der Erfassung von Rechnungen wird der Zahlwegzusatz aus dem Stammsatz des Kunden oder Lieferanten vorgeschlagen. Sie können diesen Zusatz überschreiben.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPaymentMethodSupplement",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Zahlwegzusatz",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "ZhlWegZs",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PaymentProvider",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"extensions": [{
						"name": "label",
						"value": "ZDL",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Zahlungsdienstleister",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Zahlungsdienstleister",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PaymentReference",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "30",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Für Debitoren-Positionen enthält die Zahlungsreferenz einen Schlüssel, der dem Debitor auf der Rechnung übermittelt wird. Der Debitor soll bei der Zahlung auf die Zahlungsreferenz Bezug nehmen.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Für Kreditoren-Positionen wird in der Zahlungsreferenz der Schlüssel erfaßt, den der Kreditor mit der Rechnung übermittelt. Im automatischen Zahlungsverkehr kann die Zahlungsreferenz wieder an den Zahlungsempfänger übermittelt werden.\nDie Zahlungsreferenz wird beim Zahlungsausgang an das beteiligte Geldinstitut übermittelt und von dort an den Begünstigten weitergegeben.\nBei der Bearbeitung des Kontoauszugs läßt sich über die Zahlungsreferenz eindeutig die betroffene Position bestimmen und ausgleichen.\nDie Verwendung von Zahlungsreferenz-Nummern ist in Finnland, Norwegen und Schweden üblich. In diesen Ländern existieren auch Regeln für den Aufbau der Zahlungsreferenz, deren Einhaltung durch Prüfzifferverfahren kontrolliert wird.\nDTA Finnland: Die Nummer '4477' hat die Prüfziffer '8' und ist als Zeichenkette '44778' abzulegen.\nDTA Norwegen: Die Nummer '12345678' hat bei Verwendung des Modulo-10-Verfahrens die Prüfziffer '2', bei Verwendung des Modulo-11-Verfahrens die Prüfziffer '5'. Entsprechend ist 123456782 oder 123456785 als Zahlungsreferenz zulässig. '\nDTA Schweden: Die Nummer '1234567890' hat die Prüfziffer '3' und ist als Zeichenkette '12345678903' abzulegen. Das verwendete Molulo-Verfahren ist eine Form von Modulo-10 mit Schlüssel '1212121'.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPaymentReference",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Zahlungsreferenz",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PaymentTerms",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, über den Zahlungsbedingungen in Form von Skontoprozentsätzen und Zahlungsfristen definiert werden.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Der Schlüssel wird in Aufträgen, Bestellungen und Rechnungen verwendet. Die zugehörigen Zahlungsbedingungen liefern Informationen für die Finanzdisposition, für das Mahnwesen und den Zahlungsverkehr.\nBeim Erfassen eines Geschäftsvorfalls kann das Feld für den Zahlungsbedingungsschlüssel auf unterschiedliche Weise gefüllt werden:\nBei den meisten Geschäftsvorfällen schlägt das System einen im Stammsatz des Geschäftspartners hinterlegten Schlüssel vor.\nFür die Erfassung von Gutschriften in der Finanzbuchhaltung kann im Stammsatz ein gesonderter Schlüssel hinterlegt werden. Ist kein solcher Schlüssel vorgegeben, können Sie den für Rechnungen vorgesehenen Schlüssel durch Eingabe von \"*\" aus dem Stammsatz des Geschäftspartners übernehmen.\nUnabhängig davon, ob aus dem Stammsatz ein Schlüssel vorgeschlagen wird, können Sie beim Erfassen einen Schlüssel eingeben:\nbei Aufträgen auf Positionsebene\nbei Bestellungen und Rechnungen auf Kopfebene\nStammsätze haben getrennte Bereiche für die Finanzbuchhaltung, den Vertrieb und den Einkauf. In diesen Bereichen können Sie Zahlungsbedingungsschlüssel hinterlegen. Die Anwendungen verwenden beim Erfassen von Geschäftsvorfällen den Schlüssel, der in ihrem Stammsatzbereich steht.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPaymentTerms",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "PaymentTermsName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Zahlungsbedingungen",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "ZBed",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Schlüssel für Zahlungsbedingungen",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PaymentTermsName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "30",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPaymentTerms",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Bezeichnung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Bezeichnung der Zahlungsbedingung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PersonnelNumber",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "8",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Die Personalnummer ist innerhalb eines Mandanten der einzige, eindeutige Schlüssel zur Identifikation eines Mitarbeiters. Sie bildet den Einstieg zur Anzeige und Pflege von Stammdaten und Arbeitszeitdaten (Infotypen) eines Mitarbeiters.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPersonnelNumber",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Personalnr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "PersNr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Personalnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Plant",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, der ein Werk eindeutig identifiziert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPlant",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "PlantName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Werk",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PlantName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "30",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPlant",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Name 1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Name",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PostingDate",
					"type": "Edm.DateTime",
					"precision": "0",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Datum, unter dem der Beleg in der Buchhaltung bzw. in der Kostenrechnung erfaßt wird.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Aus dem Buchungsdatum werden das Geschäftsjahr und die Periode abgeleitet, für die eine Fortschreibung der im Beleg angesprochenen Konten bzw. Kostenarten erfolgt.\nBei der Belegerfassung wird anhand der erlaubten Buchungsperiode überprüft, ob das angegebene Buchungsdatum zulässig ist.\nDas Buchungsdatum kann sich sowohl vom Erfassungsdatum (Tag der Eingabe in das System) als auch vom Belegdatum (Tag der Erstellung des Originalbelegs) unterscheiden.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPostingDate",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Buchungsdatum",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Buch.dat.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Buchungsdatum im Beleg",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PostingKey",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPostingKey",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "PostingKeyName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Buchungsschlüssel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "BS",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PostingKeyName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "40",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Text, der das Objekt, auf das er sich bezieht, näher beschreibt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPostingKey",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Langtext",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ProfitCenter",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcProfitCenter",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "ProfitCenterName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Profitcenter",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ProfitCenterName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "40",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Text, der das Objekt, auf das er sich bezieht, näher beschreibt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcProfitCenter",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Langtext",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ProjectNetwork",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "12",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Ein Netzplan kann den Ablauf eines Projekts bzw. eine Aufgabe des Projekts strukturieren.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Solche Projektstrukturen werden durch Nummern unterschieden.\nMit der Angabe eines Netzplan z.B. bei der Erfassung von Anwesenheiten können Sie festlegen, daß im Controlling eine Belastung des Netzplanes bei Entlastung der Senderkostenstelle bewirkt wird.\nWählen Sie über die Wertehilfetaste die Netzplannummer aus, die für die gewünschte Projektstruktur steht.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcProjectNetwork",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Netzplan",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Netzplannummer für Kontierung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PurchasingDocument",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPurchasingDocument",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Einkaufsbeleg",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PurchasingDocumentItem",
					"type": "Edm.String",
					"maxLength": "5",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcPurchasingDocumentItem",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Einkaufsbelegposit.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "EBPos",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Positionsnummer des Einkaufsbelegs",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Quantity",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "3",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Mengenanteil der Gesamtbestellmenge, den Sie dieser Kontierungsposition zuordnen möchten.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Die eingegebene Menge bestimmt, welchen Anteil der Kosten Sie auf diese Kontierungsposition verteilen möchten.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcQuantity",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "BaseUnit",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Menge",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Reference1IDByBusinessPartner",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "12",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcReference1IDByBusinessPartner",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Referenzschlüssel 1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "RefSchl. 1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Referenzschlüssel 1 des Geschäftspartners",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Reference2IDByBusinessPartner",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "12",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcReference2IDByBusinessPartner",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Referenzschlüssel 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "RefSchl. 2",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Referenzschlüssel 2 des Geschäftspartners",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Reference3IDByBusinessPartner",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "20",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "In diesem Feld können Angaben des Geschäftspartners zum Geschäftsvorfall eingetragen werden.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Als Zusatzinformation, für Korrespondenz mit dem Partner, als Suchkriterium für Posten auf dem Konto des Geschäftspartners.\nTragen Sie gemäß Ihrer firmenindividuellen Regelung die Angaben des Geschäftspartners ein, die Sie für nachfolgende Bearbeitungen benötigen.\nInformationen, die in Frage kommen, sind beispielsweise eine Niederlassungsnummer des Geschäftspartners, oder eine Vorgangsnummer, unter der ein strittiger Vorgang beim Geschäftspartner geführt wird.\n Brasilien\nDebitorisch wird hier die Nummer eines bereits ausgestellten Boletos hinterlegt.\n Finnland\nWenn für eine Fremdwährungsrechnung ein Devisentermingeschäft zur Kurssicherung abgeschlossen wurde, können Sie hier die Kontraktnummer hinterlegen. Sollte von der Bank ein Präfix für die Kontraktnummer verlangt werden, so ist dieses hier der Nummer voranzustellen. Für ein Devisentermingeschäft zur Kurssicherung müssen Sie auch die entsprechende Hausbank-ID angeben. Diese Kontraktnummer wird dann beim Erstellen des Zahlungsträgers mit dem Report RFFOFI_U in die entsprechenden Felder der Formate LUM2 und ULMP übernommen.\n Japan\nWenn für eine Fremdwährungsrechnung ein Devisentermingeschäft zur Kurssicherung abgeschlossen wurde, können Sie hier die Kontraktnummer hinterlegen (max. 16 stellig).\nFür ein Devisentermingeschäft zur Kurssicherung müssen Sie auch die entsprechende Hausbank-ID und die Weisungsnummer für gesicherten Kurs im Feld Weisung 3 angeben.\nDie Kontraktnummer wird beim ErstelIen des Zahlungsträgers mit dem Report RFFOJP_L in das entsprechende Feld des ZENGINKYO-Formats (Buchhaltungsinformation) übernommen.\nWenn eine Fremdwährungsrechnung in mehr als eine jedoch maximal drei buchhalterische Positionen gesplittet werden soll, können Sie hier '*' eingeben. Durch die Angabe von '*' wird ein Fenster für zusätzliche japanische Buchhaltungsinformationen angezeigt. Dort können Sie die notwendigen Buchhaltungsinformation ergänzen. Die Pflege der Zusatzinformation ist nur in der Belegänderung möglich.\nFunktion Belegänderung ausführen\n Thailand\nIdentifikationsnummer fuer das Quellensteuerzertifikat. Diese leitet sich entweder aus Zahlungsbelegnummer und entsprechende Zeilennummer ab oder kann manuell eingetragen werden.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcReference3IDByBusinessPartner",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Referenzschl 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "RefSchl 3",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Referenzschlüssel zur Belegposition",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Region",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "3",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Bildet in einigen Ländern einen Bestandteil der Anschrift. Die jeweilige Bedeutung ist länderspezifisch.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Die automatische Adreßaufbereitung gibt bei Adressen in USA, Kanada, Italien, Brasilien oder Australien den Schlüsselwert des Regionalcodes in der aufbereiteten Adresse mit aus, bei Adressen in Großbritannien die entsprechende Textbezeichnung der Grafschaft.\nSiehe dazu die Beispiele in der Dokumentation zum Schlüssel Adreßaufbau\nBedeutung des Regionalcodes in ...\n  USA             ->  Bundesstaat\n  Italien         ->  Provinz\n  Kanada          ->  Provinz\n  Großbritannien  ->  Grafschaft\n  Brasilien       ->  Bundesstaat\n  Australien      ->  Provinz\n  Deutschland     ->  Bundesland\n  Schweiz         ->  Kanton\n  Japan           ->  Präfektur",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcRegion",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "RegionName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Region",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Rg",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Region (Bundesstaat, Bundesland, Provinz, Grafschaft)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "RegionName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "20",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcRegion",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Bezeichnung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ReportingCountry",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "3",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcReportingCountry",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Meldeland",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Meldeland für Warenlieferung innerhalb der EG",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SalesDocument",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Identifiziert einen Kundenauftrag eindeutig.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Die Selektion der Nachbearbeitungssätze über die Kundenauftragsnummer ist nur für unbewerteten Kundeneinzelbestand möglich.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcSalesDocument",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Kundenauftrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "KundAuft",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Kundenauftragsnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SalesDocumentItem",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "6",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcSalesDocumentItem",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Kundenauftragspos.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Kundenauftragsposition",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Kundenauftragsposition",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SalesOrganization",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Organisatorische Einheit, die für den Vertrieb bestimmter Produkte oder Dienstleistungen verantwortlich ist. Die Verantwortung einer Verkaufsorganisation kann die rechtliche Haftung für Produkte und Regreßansprüche des Kunden einschließen.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Einer Verkaufsorganisation können Sie beliebig viele Vertriebswege und Sparten zuordnen. Eine bestimmte Kombination von Verkaufsorganisation, Vertriebsweg und Sparte wird Vertriebsbereich genannt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcSalesOrganization",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "SalesOrganizationName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Verkaufsorg.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "VkOrg",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Verkaufsorganisation",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SalesOrganizationName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "20",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcSalesOrganization",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Bezeichnung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ScheduleLine",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcScheduleLine",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Kundenauftragseint.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Kundenauftragseinteilung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Kundenauftragseinteilung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Segment",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcSegment",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "SegmentName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Segment",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Segment für Segmentberichterstattung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SegmentName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "50",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Feld zur Hinterlegung eines erklärenden Textes",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcSegment",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Erklärung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Text",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Textfeld",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SettlementFiscalPeriod",
					"type": "Edm.String",
					"maxLength": "6",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcSettlementFiscalPeriod",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Abrechnungsperiode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SpecialGLAccountAssignment",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "18",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcSpecialGLAccountAssignment",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Sonder-HB-Zuordnung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Sonderhauptbuch-Zuordnung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Zuordnungsnummer für Sonderhauptbuchkonten",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SpecialGLCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "1",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcSpecialGLCode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "SpecialGLCodeName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Sonderhauptbuch",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Sonderhauptbuchkennzeichen",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SpecialGLCodeName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "30",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Bezeichnung des Sonderhauptbuchkennzeichens, die als Erläuterung zum Kennzeichen angezeigt wird.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcSpecialGLCode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Bezeichnung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Langbezeichnung Sonderhauptbuchkennzeichen",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "StateCentralBankInd",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "3",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcStateCentralBankInd",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Landeszentralbank",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Landeszentralbank-Kennzeichen",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SupplyingCountry",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "3",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcSupplyingCountry",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Lieferland",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TaxBaseAmountInCoCodeCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcTaxBaseAmountInCoCodeCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "CoCodeCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "HauswährgBasisBetrg",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Hauswährungsbasisbetrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Hauswährungsbasisbetrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TaxBaseAmountInTransactionCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Dieses Feld enthält den Betrag, auf den die Steuer zu berechnen ist.  Der Betrag ist in der Währung des Beleges zu verstehen.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Bei der direkten Erfassung von Steuerzeilen ist der Basisbetrag stets  anzugeben, damit vom System die Richtigkeit des Steuerbetrags geprüft  werden kann.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcTaxBaseAmountInTransactionCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "TransactionCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Basisbetrg.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Steuerbasis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Steuerbasisbetrag in Belegwährung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TaxCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcTaxCode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "TaxCodeName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Umsatzsteuer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "St",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Umsatzsteuerkennzeichen",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TaxCodeName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "50",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcTaxCode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Beschreibung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Grund für Mahnsperre",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TaxJurisdiction",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "15",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "The tax jurisdiction is used for determining the tax rates in the USA. It defines to which tax authorities you must pay your taxes. It is always the city to which the goods are supplied.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcTaxJurisdiction",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "TaxJurisdictionName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Steuerstandort",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TaxJurisdictionName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "50",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcTaxJurisdiction",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Beschreibung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Grund für Mahnsperre",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TaxType",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "1",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Kennzeichen zur Unterscheidung von Ausgangssteuer und Vorsteuer.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Steuerart",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Art",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TransactionCurrency",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel der Währung, in der die Beträge im System geführt werden.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcTransactionCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Währung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Währg",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Währungsschlüssel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcAccountingDocument",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcAdditionalCrcy1",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcAdditionalCrcy2",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcAddressAndBankDataEnteredManually",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcAmountInAdditionalCrcy1",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcAmountInAdditionalCrcy2",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcAmountInCoCodeCrcy",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcAmountInPaymentCrcy",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcAmountInTransactionCrcy",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcAssetContract",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcAssetContractType",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcAssetTransactionType",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcAssetValueDate",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcAssignmentReference",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcBaseUnit",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcBillingDocument",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcBranchAccount",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcBusinessArea",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcBusinessProcess",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcCapitalGoodIsAffected",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcCashDiscount1Days",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcCashDiscount1Percent",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcCashDiscount2Days",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcCashDiscount2Percent",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcCashDiscountAmount",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcCashDiscountBaseAmount",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcChartOfAccounts",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcClearingAccountingDocument",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcClearingDate",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcCoCodeCurrency",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcCompanyCode",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcControllingArea",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcCostCenter",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcCostCtrActivityType",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcCostingSheet",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcCostObject",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcCreditAmountInAdditionalCrcy1",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcCreditAmountInAdditionalCrcy2",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcCreditAmountInCoCodeCrcy",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcCreditAmountInTransactionCrcy",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcCustomer",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcDataExchangeInstruction1",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcDataExchangeInstruction2",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcDataExchangeInstruction3",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcDataExchangeInstruction4",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcDebitAmountInAdditionalCrcy1",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcDebitAmountInAdditionalCrcy2",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcDebitAmountInCoCodeCrcy",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcDebitAmountInTransactionCrcy",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcDistributionChannel",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcDocumentItemText",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcDueCalculationBaseDate",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcDunningArea",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcDunningBlockingReasonCode",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcDunningKey",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcDunningLevel",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcEmploymentTaxDistrType",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcEUTriangularDeal",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcFinancialAccountType",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcFinancialTransactionType",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcFixedAsset",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcFixedCashDiscount",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcFollowOnDocumentType",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcFunctionalArea",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcGLAccount",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcGoodsDeliveryDestinationCountry",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcGrossIncomeTaxActivityCode",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcGrossIncomeTaxRegion",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcHouseBank",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcHouseBankAccount",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcIndustry",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcInvoiceItemReference",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcInvoiceList",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcInvoiceReference",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcInvoiceReferenceFiscalYear",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcIsAutomaticallyCreated",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcIsNotLiableToCashDiscount",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcIsServiceActivity",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcLastDunningDate",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcLedger",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcMandateReference",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcMasterFixedAsset",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcMaterial",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcMethOfCoCodeCurrencyDetn",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcNetPaymentAmount",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcNetPaymentDays",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOneTimeAcctBankAccount",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOneTimeAcctBankControlKey",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOneTimeAcctBankCountryKey",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOneTimeAcctBankNumber",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOneTimeAcctCityName",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOneTimeAcctCountryKey",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOneTimeAcctIBAN",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOneTimeAcctIBANValidFrom",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOneTimeAcctInstrnKeyForDataMdmExch",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOneTimeAcctIsLiableForVAT",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOneTimeAcctLanguage",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOneTimeAcctName1",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOneTimeAcctName2",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOneTimeAcctName3",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOneTimeAcctName4",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOneTimeAcctPOBox",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOneTimeAcctPOBoxPostalCode",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOneTimeAcctPostalCode",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOneTimeAcctRegion",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOneTimeAcctRptKeyForDataMdmExch",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOneTimeAcctStreetName",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOneTimeAcctSubjectToEqualizationTax",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOneTimeAcctTaxID1",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOneTimeAcctTaxID2",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcOrder",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcPartnerBankType",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcPartnerBusinessArea",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcPartnerCompanyCode",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcPartnerProfitCenter",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcPartnerSegment",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcPaymentBlockingReason",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcPaymentCurrency",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcPaymentDifferenceReason",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcPaymentMethod",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcPaymentMethodSupplement",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcPaymentReference",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcPaymentTerms",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcPersonnelNumber",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcPlant",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcPostingDate",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcPostingKey",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcProfitCenter",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcProjectNetwork",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcPurchasingDocument",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcPurchasingDocumentItem",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcQuantity",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcReference1IDByBusinessPartner",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcReference2IDByBusinessPartner",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcReference3IDByBusinessPartner",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcRegion",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcReportingCountry",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcSalesDocument",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcSalesDocumentItem",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcSalesOrganization",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcScheduleLine",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcSegment",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcSettlementFiscalPeriod",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcSpecialGLAccountAssignment",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcSpecialGLCode",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcStateCentralBankInd",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcSupplyingCountry",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcTaxBaseAmountInCoCodeCrcy",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcTaxBaseAmountInTransactionCrcy",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcTaxCode",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcTaxJurisdiction",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcTransactionCurrency",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcValueDate",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcVATRegistration",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcVendor",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcWBSElement",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcWithholdingTaxAmountInTransCrcy",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcWithholdingTaxBaseAmountInTransCrcy",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcWithholdingTaxCertificateNumber",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcWithholdingTaxCode",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "UxFcWithholdingTaxExemptionAmt",
					"type": "Edm.Byte",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "UI-Feldsteuerung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "UI-Feldsteuerung Byte (Sollte zentral definiert werden)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ValueDate",
					"type": "Edm.DateTime",
					"precision": "0",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Tag der Wertstellung.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Auf Geldbestandskonten (Bankkonten, Bankunterkonten) kennzeichnet das Valutadatum den Tag, an dem die Geldbewegung tatsächlich stattfindet.\nIn Zahlungsbuchungen, die vor der Ausführung der Zahlung erzeugt werden, kennzeichnet das Datum den Tag, an dem die Geldbewegung voraussichtlich stattfindet.\nDas Valutadatum ist das maßgebliche Datum für die Darstellung des Tagesfinanzstatus.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcValueDate",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Valutadatum",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Valuta",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "VATRegistration",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "20",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcVATRegistration",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "USt-IdNr.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Umsatzsteuernummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Umsatzsteueridentifikationsnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Vendor",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Gibt einen alphanumerischen Schlüssel an, der den Lieferanten oder Kreditor im SAP-System eindeutig identifiziert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcVendor",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "VendorName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Kreditor",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Kontonummer des Lieferanten bzw. Kreditors",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "VendorCountry",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "3",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Länderschlüssel, unter dem Festlegungen getroffen werden, die zur Prüfung von Eingaben verwendet werden, wie z.B. Länge der Postleitzahl oder Länge der Bankkontonummer.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "In der Regel wird der zweistellige ISO-CODE gemäß ISO 3166 verwendet, der von SAP als Vorschlag ausgeliefert wird.\nAndere Möglichkeiten sind der Länderschlüssel für Kraftfahrzeuge oder ein landestypischer Schlüssel, wie z.B. in Deutschland der Schlüssel des statistischen Bundesamtes.\nDie Länderschlüssel werden bei der Systemeinführung bei den globalen Einstellungen festgelegt.\nDie Definition des Länderschlüssels im SAP-System braucht nicht notwendigerweise mit politischen oder staatlichen Einheiten übereinzustimmen.\nWeil der Länderschlüssel nicht in allen Installationen mit dem ISO-Code übereinstimmen muss, dürfen Programme, die nach bestimmten Werten des Länderschlüssels unterscheiden, nicht den Länderschlüssel T005-LAND1 abfragen, sondern müssen auf den ISO-Code T005-INTCA programmieren.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Land",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Lnd",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Länderschlüssel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "VendorName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "30",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcVendor",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Name 1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Name",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "WBSElement",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "24",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, der ein PSP-Element kennzeichnet.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcWBSElement",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "PSP-Element",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Projektstrukturplanelement (PSP-Element)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "WithholdingTaxAmountInTransCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Betrag der Quellensteuer in der Belegwährung",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Der Betrag wir stets anhand des Quellensteuer-Basisbetrags und des Steuerprozentsatzes vom System errechnet.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcWithholdingTaxAmountInTransCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "TransactionCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Quellsteuer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Quellsteuer-Betrag ( in Belegwährung )",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "WithholdingTaxBaseAmountInTransCrcy",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcWithholdingTaxBaseAmountInTransCrcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "TransactionCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Quellensteuerbasis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Quellensteuerbasisbetrag",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "WithholdingTaxCertificateNumber",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Nummer des Zertifikats, das für eine befristete Befreiung von der Quellensteuer ausgestellt wird.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Bei einer Verlängerung der Befreiung ist das neue Datum zusammen mit der neuen Zertifikatsnummer im Stammsatz einzutragen.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "field-control",
						"value": "UxFcWithholdingTaxCertificateNumber",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Befreiungs-Nr.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Befr.Nr.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Nummer des Zertifikats über die Quellsteuerbefreiung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "WithholdingTaxCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcWithholdingTaxCode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "WithholdingTaxCodeName",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Quellensteuerkennz.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Quellensteuerkennzeichen",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Quellensteuerkennzeichen",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "WithholdingTaxCodeName",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "50",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcWithholdingTaxCode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Beschreibung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Grund für Mahnsperre",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "WithholdingTaxExemptionAmt",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "13",
					"scale": "2",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcWithholdingTaxExemptionAmt",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "unit",
						"value": "TransactionCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Quellensteuerfrei",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Quellensteuerfreier Betrag (in Belegwährung)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				}],
				"navigationProperty": [{
					"name": "NextItem",
					"relationship": "FAC_FINANCIAL_DOCUMENT_SRV_01.ItemNextItem",
					"fromRole": "FromRole_ItemNextItem",
					"toRole": "ToRole_ItemNextItem"
				},
				{
					"name": "PreviousItem",
					"relationship": "FAC_FINANCIAL_DOCUMENT_SRV_01.ItemPreviousItem",
					"fromRole": "FromRole_ItemPreviousItem",
					"toRole": "ToRole_ItemPreviousItem"
				},
				{
					"name": "WithholdingTax",
					"relationship": "FAC_FINANCIAL_DOCUMENT_SRV_01.ItemWithholdingTax",
					"fromRole": "FromRole_ItemWithholdingTax",
					"toRole": "ToRole_ItemWithholdingTax"
				}],
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "VL_SH_H_T003",
				"key": {
					"propertyRef": [{
						"name": "BLART"
					}]
				},
				"property": [{
					"name": "BLART",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "LTEXT",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "LTEXT",
					"type": "Edm.String",
					"maxLength": "20",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Description of the business transaction which is posted using this document type.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}]
				}],
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "VL_SH_SH_TCURC",
				"key": {
					"propertyRef": [{
						"name": "WAERS"
					}]
				},
				"property": [{
					"name": "WAERS",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "LTEXT",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "LTEXT",
					"type": "Edm.String",
					"maxLength": "40",
					"extensions": [{
						"name": "label",
						"value": "Währungsbezeichnung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				}],
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "VL_SH_H_T001",
				"key": {
					"propertyRef": [{
						"name": "BUKRS"
					}]
				},
				"property": [{
					"name": "BUKRS",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "BUTXT",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Buchungskreis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "BUTXT",
					"type": "Edm.String",
					"maxLength": "25",
					"extensions": [{
						"name": "label",
						"value": "Name der Firma",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Name des Buchungskreises",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ORT01",
					"type": "Edm.String",
					"maxLength": "25",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Name des Orts als Bestandteil der Adresse.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Ort",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "WAERS",
					"type": "Edm.String",
					"maxLength": "5",
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				}],
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "VL_SH_FAC_EXCHANGE_RATE_TYPE",
				"key": {
					"propertyRef": [{
						"name": "KURST"
					}]
				},
				"property": [{
					"name": "KURST",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, unter dem Sie Umrechnungskurse im System hinterlegen.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Sie geben Kurstypen an, um unterschiedliche Umrechnungskurse zu hinterlegen.\nSie können den Kurstyp verwenden, um für die Umrechnung von Fremdwährungsbeträgen einen Geld-, Brief- und Mittelkurs zu definieren. Den Mittelkurs können Sie für die Währungsumrechnung, den Geld- und den Briefkurs für die Bewertung von Fremdwährungsbeträgen verwenden.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "CURVW",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Kurstyp",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Ktyp",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CURVW",
					"type": "Edm.String",
					"maxLength": "40"
				}],
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "VL_SH_FAGL_LEDGERGROUP",
				"key": {
					"propertyRef": [{
						"name": "LDGRP"
					},
					{
						"name": "LEDGERNAME"
					},
					{
						"name": "NAME"
					},
					{
						"name": "WITH_APPEND_LEDGER"
					}]
				},
				"property": [{
					"name": "LDGRP",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Bezeichnet eine Ledger-Gruppe eindeutig.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Wenn Sie keine Ledger-Gruppe angeben, dann wird die Funktion (z.B. Buchen) für alle Ledger ausgeführt, d.h. für das führende Ledger und alle Ledger, die im Buchungskreis zugeordnet sind.\nDie initiale (leere) Ledger-Gruppe ist eine besondere Ledger-Gruppe, die alle Ledger enthält, die innerhalb desselben Buchungskreises definiert wurden. Der Saldo der Konten innerhalb dieser Ledger-Gruppe ist immer gleich dem Saldo der offenen Posten.\nWenn Sie hier eine Ledger-Gruppe angeben, dann wird die Funktion nur für die Ledger dieser Ledger-Gruppe ausgeführt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "NAME",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Ledger-Gruppe",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "LEDGERNAME",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "50",
					"extensions": [{
						"name": "label",
						"value": "Ledger der Gruppe",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "enthaltene Ledger",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Ledger einer Ledger-Gruppe",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "NAME",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "50",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Feld zur Hinterlegung eines erklärenden Textes",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Erklärung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Text",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Textfeld",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "WITH_APPEND_LEDGER",
					"type": "Edm.Boolean",
					"nullable": "false",
					"extensions": [{
						"name": "quickinfo",
						"value": "boolsche Variable (X=true, -=false, space=unknown)",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				}],
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "VL_SH_FAC_REVERSAL_REASON",
				"key": {
					"propertyRef": [{
						"name": "STGRD"
					}]
				},
				"property": [{
					"name": "STGRD",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "2",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Grund für die Durchführung der Umkehrbuchung oder des Stornos",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "display-format",
						"value": "UpperCase",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "text",
						"value": "TXT40",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Stornogrund",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Stornogrd",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Grund für Storno oder Umkehrbuchung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "TXT40",
					"type": "Edm.String",
					"maxLength": "40",
					"extensions": [{
						"name": "label",
						"value": "Beschreibung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Beschreibng",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Beschreibung Funktionsbereich",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				}],
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "VL_FV_BSTAT",
				"key": {
					"propertyRef": [{
						"name": "Code"
					}]
				},
				"property": [{
					"name": "Code",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "1",
					"extensions": [{
						"name": "text",
						"value": "Text",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Text",
					"type": "Edm.String",
					"maxLength": "60"
				}],
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "VL_FV_XREVERSAL",
				"key": {
					"propertyRef": [{
						"name": "Code"
					}]
				},
				"property": [{
					"name": "Code",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "1",
					"extensions": [{
						"name": "text",
						"value": "Text",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Text",
					"type": "Edm.String",
					"maxLength": "60"
				}],
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			}],
			"complexType": [{
				"name": "AccountingDocumentKey",
				"property": [{
					"name": "AccountingDocument",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, mit dem auf einen Buchhaltungsbeleg zugegriffen wird.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Die Belegnummer ist eindeutig pro Buchungskreis und Geschäftsjahr. Bei der Erfassung eines Buchhaltungsbeleges kann die Nummer manuell vorgegeben werden oder aus einem vordefinierten Bereich (Nummernkreis) vom System vergeben werden.\nPro Belegart wird in jedem Buchungskreis der zulässige Bereich der Belegnummern (Nummernkreis) festgelegt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Belegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Belegnr.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Buchhaltungsbelegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "CompanyCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, der einen Buchungskreis eindeutig identifiziert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Buchungskreis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "BuKr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "FiscalYear",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Zeitraum in der Regel von 12 Monaten, für den das Unternehmen seine Inventur und Bilanz zu erstellen hat. Das Geschäftsjahr kann sich mit dem Kalenderjahr decken, muß es aber nicht.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Geschäftsjahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Jahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				}]
			},
			{
				"name": "ReversalResult",
				"property": [{
					"name": "OriginalAccountingDocument",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, mit dem auf einen Buchhaltungsbeleg zugegriffen wird.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Die Belegnummer ist eindeutig pro Buchungskreis und Geschäftsjahr. Bei der Erfassung eines Buchhaltungsbeleges kann die Nummer manuell vorgegeben werden oder aus einem vordefinierten Bereich (Nummernkreis) vom System vergeben werden.\nPro Belegart wird in jedem Buchungskreis der zulässige Bereich der Belegnummern (Nummernkreis) festgelegt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Belegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Belegnr.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Buchhaltungsbelegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OriginalCompanyCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, der einen Buchungskreis eindeutig identifiziert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Buchungskreis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "BuKr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "OriginalFiscalYear",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Zeitraum in der Regel von 12 Monaten, für den das Unternehmen seine Inventur und Bilanz zu erstellen hat. Das Geschäftsjahr kann sich mit dem Kalenderjahr decken, muß es aber nicht.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Geschäftsjahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Jahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ReversalAccountingDocument",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, mit dem auf einen Buchhaltungsbeleg zugegriffen wird.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": "Die Belegnummer ist eindeutig pro Buchungskreis und Geschäftsjahr. Bei der Erfassung eines Buchhaltungsbeleges kann die Nummer manuell vorgegeben werden oder aus einem vordefinierten Bereich (Nummernkreis) vom System vergeben werden.\nPro Belegart wird in jedem Buchungskreis der zulässige Bereich der Belegnummern (Nummernkreis) festgelegt.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Belegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Belegnr.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Buchhaltungsbelegnummer",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ReversalCompanyCode",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Schlüssel, der einen Buchungskreis eindeutig identifiziert.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Buchungskreis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "BuKr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ReversalFiscalYear",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "Zeitraum in der Regel von 12 Monaten, für den das Unternehmen seine Inventur und Bilanz zu erstellen hat. Das Geschäftsjahr kann sich mit dem Kalenderjahr decken, muß es aber nicht.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Geschäftsjahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Jahr",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ErrorIndicator",
					"type": "Edm.Boolean",
					"nullable": "false",
					"extensions": [{
						"name": "label",
						"value": "TRUE",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Datenelement zur Domäne BOOLE: TRUE (='X') und FALSE (=' ')",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "MessageText",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "255",
					"extensions": [{
						"name": "label",
						"value": "char255",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				}]
			}],
			"association": [{
				"name": "DocumentViewGLViewItems",
				"end": [{
					"type": "FAC_FINANCIAL_DOCUMENT_SRV_01.DocumentView",
					"multiplicity": "1",
					"role": "FromRole_DocumentViewGLViewItems"
				},
				{
					"type": "FAC_FINANCIAL_DOCUMENT_SRV_01.Item",
					"multiplicity": "*",
					"role": "ToRole_DocumentViewGLViewItems"
				}],
				"referentialConstraint": {
					"principal": {
						"role": "FromRole_DocumentViewGLViewItems",
						"propertyRef": [{
							"name": "Ledger"
						},
						{
							"name": "CompanyCode"
						},
						{
							"name": "AccountingDocument"
						},
						{
							"name": "FiscalYear"
						}]
					},
					"dependent": {
						"role": "ToRole_DocumentViewGLViewItems",
						"propertyRef": [{
							"name": "Ledger"
						},
						{
							"name": "CompanyCode"
						},
						{
							"name": "AccountingDocument"
						},
						{
							"name": "FiscalYear"
						}]
					}
				},
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "ItemNextItem",
				"end": [{
					"type": "FAC_FINANCIAL_DOCUMENT_SRV_01.Item",
					"multiplicity": "1",
					"role": "FromRole_ItemNextItem"
				},
				{
					"type": "FAC_FINANCIAL_DOCUMENT_SRV_01.Item",
					"multiplicity": "*",
					"role": "ToRole_ItemNextItem"
				}],
				"referentialConstraint": {
					"principal": {
						"role": "FromRole_ItemNextItem",
						"propertyRef": [{
							"name": "AccountingDocument"
						},
						{
							"name": "CompanyCode"
						},
						{
							"name": "FiscalYear"
						},
						{
							"name": "AccountingDocumentItem"
						},
						{
							"name": "Ledger"
						}]
					},
					"dependent": {
						"role": "ToRole_ItemNextItem",
						"propertyRef": [{
							"name": "AccountingDocument"
						},
						{
							"name": "CompanyCode"
						},
						{
							"name": "FiscalYear"
						},
						{
							"name": "AccountingDocumentItem"
						},
						{
							"name": "Ledger"
						}]
					}
				},
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "ItemPreviousItem",
				"end": [{
					"type": "FAC_FINANCIAL_DOCUMENT_SRV_01.Item",
					"multiplicity": "1",
					"role": "FromRole_ItemPreviousItem"
				},
				{
					"type": "FAC_FINANCIAL_DOCUMENT_SRV_01.Item",
					"multiplicity": "*",
					"role": "ToRole_ItemPreviousItem"
				}],
				"referentialConstraint": {
					"principal": {
						"role": "FromRole_ItemPreviousItem",
						"propertyRef": [{
							"name": "Ledger"
						},
						{
							"name": "AccountingDocumentItem"
						},
						{
							"name": "AccountingDocument"
						},
						{
							"name": "CompanyCode"
						},
						{
							"name": "FiscalYear"
						}]
					},
					"dependent": {
						"role": "ToRole_ItemPreviousItem",
						"propertyRef": [{
							"name": "Ledger"
						},
						{
							"name": "AccountingDocumentItem"
						},
						{
							"name": "AccountingDocument"
						},
						{
							"name": "CompanyCode"
						},
						{
							"name": "FiscalYear"
						}]
					}
				},
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "ItemWithholdingTax",
				"end": [{
					"type": "FAC_FINANCIAL_DOCUMENT_SRV_01.Item",
					"multiplicity": "1",
					"role": "FromRole_ItemWithholdingTax"
				},
				{
					"type": "FAC_FINANCIAL_DOCUMENT_SRV_01.WithholdingTax",
					"multiplicity": "*",
					"role": "ToRole_ItemWithholdingTax"
				}],
				"referentialConstraint": {
					"principal": {
						"role": "FromRole_ItemWithholdingTax",
						"propertyRef": [{
							"name": "Ledger"
						},
						{
							"name": "FiscalYear"
						},
						{
							"name": "CompanyCode"
						},
						{
							"name": "AccountingDocumentItem"
						},
						{
							"name": "AccountingDocument"
						}]
					},
					"dependent": {
						"role": "ToRole_ItemWithholdingTax",
						"propertyRef": [{
							"name": "Ledger"
						},
						{
							"name": "FiscalYear"
						},
						{
							"name": "CompanyCode"
						},
						{
							"name": "AccountingDocumentItem"
						},
						{
							"name": "AccountingDocument"
						}]
					}
				},
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "HeaderTaxes",
				"end": [{
					"type": "FAC_FINANCIAL_DOCUMENT_SRV_01.Header",
					"multiplicity": "1",
					"role": "FromRole_HeaderTaxes"
				},
				{
					"type": "FAC_FINANCIAL_DOCUMENT_SRV_01.Tax",
					"multiplicity": "*",
					"role": "ToRole_HeaderTaxes"
				}],
				"referentialConstraint": {
					"principal": {
						"role": "FromRole_HeaderTaxes",
						"propertyRef": [{
							"name": "AccountingDocument"
						},
						{
							"name": "CompanyCode"
						},
						{
							"name": "FiscalYear"
						}]
					},
					"dependent": {
						"role": "ToRole_HeaderTaxes",
						"propertyRef": [{
							"name": "AccountingDocument"
						},
						{
							"name": "CompanyCode"
						},
						{
							"name": "FiscalYear"
						}]
					}
				},
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "HeaderItems",
				"end": [{
					"type": "FAC_FINANCIAL_DOCUMENT_SRV_01.Header",
					"multiplicity": "1",
					"role": "FromRole_HeaderItems"
				},
				{
					"type": "FAC_FINANCIAL_DOCUMENT_SRV_01.Item",
					"multiplicity": "*",
					"role": "ToRole_HeaderItems"
				}],
				"referentialConstraint": {
					"principal": {
						"role": "FromRole_HeaderItems",
						"propertyRef": [{
							"name": "FiscalYear"
						},
						{
							"name": "CompanyCode"
						},
						{
							"name": "AccountingDocument"
						}]
					},
					"dependent": {
						"role": "ToRole_HeaderItems",
						"propertyRef": [{
							"name": "FiscalYear"
						},
						{
							"name": "CompanyCode"
						},
						{
							"name": "AccountingDocument"
						}]
					}
				},
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "HeaderAttachments",
				"end": [{
					"type": "FAC_FINANCIAL_DOCUMENT_SRV_01.Header",
					"multiplicity": "1",
					"role": "FromRole_HeaderAttachments"
				},
				{
					"type": "FAC_FINANCIAL_DOCUMENT_SRV_01.Attachment",
					"multiplicity": "*",
					"role": "ToRole_HeaderAttachments"
				}],
				"referentialConstraint": {
					"principal": {
						"role": "FromRole_HeaderAttachments",
						"propertyRef": [{
							"name": "CompanyCode"
						},
						{
							"name": "AccountingDocument"
						},
						{
							"name": "FiscalYear"
						}]
					},
					"dependent": {
						"role": "ToRole_HeaderAttachments",
						"propertyRef": [{
							"name": "CompanyCode"
						},
						{
							"name": "AccountingDocument"
						},
						{
							"name": "FiscalYear"
						}]
					}
				},
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "HeaderNotes",
				"end": [{
					"type": "FAC_FINANCIAL_DOCUMENT_SRV_01.Header",
					"multiplicity": "1",
					"role": "FromRole_HeaderNotes"
				},
				{
					"type": "FAC_FINANCIAL_DOCUMENT_SRV_01.Note",
					"multiplicity": "*",
					"role": "ToRole_HeaderNotes"
				}],
				"referentialConstraint": {
					"principal": {
						"role": "FromRole_HeaderNotes",
						"propertyRef": [{
							"name": "CompanyCode"
						},
						{
							"name": "AccountingDocument"
						},
						{
							"name": "FiscalYear"
						}]
					},
					"dependent": {
						"role": "ToRole_HeaderNotes",
						"propertyRef": [{
							"name": "CompanyCode"
						},
						{
							"name": "AccountingDocument"
						},
						{
							"name": "FiscalYear"
						}]
					}
				},
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "HeaderRelatedDocuments",
				"end": [{
					"type": "FAC_FINANCIAL_DOCUMENT_SRV_01.Header",
					"multiplicity": "1",
					"role": "FromRole_HeaderRelatedDocuments"
				},
				{
					"type": "FAC_FINANCIAL_DOCUMENT_SRV_01.RelatedDocument",
					"multiplicity": "*",
					"role": "ToRole_HeaderRelatedDocuments"
				}],
				"referentialConstraint": {
					"principal": {
						"role": "FromRole_HeaderRelatedDocuments",
						"propertyRef": [{
							"name": "CompanyCode"
						},
						{
							"name": "AccountingDocument"
						},
						{
							"name": "FiscalYear"
						}]
					},
					"dependent": {
						"role": "ToRole_HeaderRelatedDocuments",
						"propertyRef": [{
							"name": "CompanyCode"
						},
						{
							"name": "AccountingDocument"
						},
						{
							"name": "FiscalYear"
						}]
					}
				},
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			},
			{
				"name": "HeaderDocumentViews",
				"end": [{
					"type": "FAC_FINANCIAL_DOCUMENT_SRV_01.Header",
					"multiplicity": "1",
					"role": "FromRole_HeaderDocumentViews"
				},
				{
					"type": "FAC_FINANCIAL_DOCUMENT_SRV_01.DocumentView",
					"multiplicity": "*",
					"role": "ToRole_HeaderDocumentViews"
				}],
				"referentialConstraint": {
					"principal": {
						"role": "FromRole_HeaderDocumentViews",
						"propertyRef": [{
							"name": "CompanyCode"
						},
						{
							"name": "AccountingDocument"
						},
						{
							"name": "FiscalYear"
						}]
					},
					"dependent": {
						"role": "ToRole_HeaderDocumentViews",
						"propertyRef": [{
							"name": "CompanyCode"
						},
						{
							"name": "AccountingDocument"
						},
						{
							"name": "FiscalYear"
						}]
					}
				},
				"extensions": [{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			}],
			"entityContainer": [{
				"name": "FAC_FINANCIAL_DOCUMENT_SRV_01_Entities",
				"isDefaultEntityContainer": "true",
				"entitySet": [{
					"name": "WithholdingTaxes",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.WithholdingTax",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "pageable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "addressable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "InitialSelections",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.InitialSelection",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "pageable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "addressable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Attachments",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.Attachment",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "pageable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "addressable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "RelatedDocuments",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.RelatedDocument",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "pageable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "addressable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Notes",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.Note",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "pageable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "addressable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Headers",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.Header",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "pageable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "addressable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DocumentViews",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.DocumentView",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "pageable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "addressable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "EntryViewItems",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.Item",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "pageable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "addressable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SimulatedAttachments",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.Attachment",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "pageable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "addressable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SimulatedDocumentViews",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.DocumentView",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "pageable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "addressable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SimulatedEntryViewItems",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.Item",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "pageable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "addressable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SimulatedHeaders",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.Header",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "pageable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "addressable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SimulatedDocumentViewItems",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.Item",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "pageable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "addressable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SimulatedNotes",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.Note",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "pageable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "addressable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SimulatedRelatedDocuments",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.RelatedDocument",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "pageable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "addressable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SimulatedTaxes",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.Tax",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "pageable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "addressable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DocumentViewWithholdingTax",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.WithholdingTax",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "pageable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "addressable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SimulatedWithholdingTax",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.WithholdingTax",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "pageable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "addressable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SimulatedGLViewWithholdingTax",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.WithholdingTax",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "pageable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "addressable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "GLViewItems",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.Item",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "pageable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "addressable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "GLViewHeaders",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.Header",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "pageable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "addressable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "VL_SH_H_T003",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.VL_SH_H_T003",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "countable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "VL_SH_SH_TCURC",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.VL_SH_SH_TCURC",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "countable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "VL_SH_H_T001",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.VL_SH_H_T001",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "countable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "VL_SH_FAC_EXCHANGE_RATE_TYPE",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.VL_SH_FAC_EXCHANGE_RATE_TYPE",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "countable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "VL_SH_FAGL_LEDGERGROUP",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.VL_SH_FAGL_LEDGERGROUP",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "countable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "VL_SH_FAC_REVERSAL_REASON",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.VL_SH_FAC_REVERSAL_REASON",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "countable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "VL_FV_BSTAT",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.VL_FV_BSTAT",
					"extensions": [{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "fixed-values",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "VL_FV_XREVERSAL",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.VL_FV_XREVERSAL",
					"extensions": [{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "fixed-values",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "Taxes",
					"entityType": "FAC_FINANCIAL_DOCUMENT_SRV_01.Tax",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "pageable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "addressable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				}],
				"associationSet": [{
					"name": "GLViewHeaderGLViewItemsSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.HeaderItems",
					"end": [{
						"entitySet": "GLViewHeaders",
						"role": "FromRole_HeaderItems"
					},
					{
						"entitySet": "GLViewItems",
						"role": "ToRole_HeaderItems"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SimulatedHeaderGLViewItemsSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.HeaderItems",
					"end": [{
						"entitySet": "SimulatedHeaders",
						"role": "FromRole_HeaderItems"
					},
					{
						"entitySet": "SimulatedDocumentViewItems",
						"role": "ToRole_HeaderItems"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SimulatedHeaderTaxesSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.HeaderTaxes",
					"end": [{
						"entitySet": "SimulatedHeaders",
						"role": "FromRole_HeaderTaxes"
					},
					{
						"entitySet": "SimulatedTaxes",
						"role": "ToRole_HeaderTaxes"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SimulatedHeaderDocumentViewsSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.HeaderDocumentViews",
					"end": [{
						"entitySet": "SimulatedHeaders",
						"role": "FromRole_HeaderDocumentViews"
					},
					{
						"entitySet": "SimulatedDocumentViews",
						"role": "ToRole_HeaderDocumentViews"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "HeaderTaxesSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.HeaderTaxes",
					"end": [{
						"entitySet": "Headers",
						"role": "FromRole_HeaderTaxes"
					},
					{
						"entitySet": "Taxes",
						"role": "ToRole_HeaderTaxes"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SimulatedHeaderAttachmentsSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.HeaderAttachments",
					"end": [{
						"entitySet": "SimulatedHeaders",
						"role": "FromRole_HeaderAttachments"
					},
					{
						"entitySet": "SimulatedAttachments",
						"role": "ToRole_HeaderAttachments"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "GLViewItemNextItemSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.ItemNextItem",
					"end": [{
						"entitySet": "GLViewItems",
						"role": "FromRole_ItemNextItem"
					},
					{
						"entitySet": "GLViewItems",
						"role": "ToRole_ItemNextItem"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SimulatedEntryViewItemNextSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.ItemNextItem",
					"end": [{
						"entitySet": "SimulatedEntryViewItems",
						"role": "FromRole_ItemNextItem"
					},
					{
						"entitySet": "SimulatedEntryViewItems",
						"role": "ToRole_ItemNextItem"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "EntryViewItemWithholdingTaxSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.ItemWithholdingTax",
					"end": [{
						"entitySet": "EntryViewItems",
						"role": "FromRole_ItemWithholdingTax"
					},
					{
						"entitySet": "WithholdingTaxes",
						"role": "ToRole_ItemWithholdingTax"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "GLViewItemWitholdingTaxSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.ItemWithholdingTax",
					"end": [{
						"entitySet": "GLViewItems",
						"role": "FromRole_ItemWithholdingTax"
					},
					{
						"entitySet": "DocumentViewWithholdingTax",
						"role": "ToRole_ItemWithholdingTax"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DocumentViewGLViewItemsSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.DocumentViewGLViewItems",
					"end": [{
						"entitySet": "DocumentViews",
						"role": "FromRole_DocumentViewGLViewItems"
					},
					{
						"entitySet": "GLViewItems",
						"role": "ToRole_DocumentViewGLViewItems"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SimulatedHeaderNotesSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.HeaderNotes",
					"end": [{
						"entitySet": "SimulatedHeaders",
						"role": "FromRole_HeaderNotes"
					},
					{
						"entitySet": "SimulatedNotes",
						"role": "ToRole_HeaderNotes"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "EntryViewItemPreviousItemSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.ItemPreviousItem",
					"end": [{
						"entitySet": "EntryViewItems",
						"role": "FromRole_ItemPreviousItem"
					},
					{
						"entitySet": "EntryViewItems",
						"role": "ToRole_ItemPreviousItem"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "GLViewItemPreviousItemSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.ItemPreviousItem",
					"end": [{
						"entitySet": "GLViewItems",
						"role": "FromRole_ItemPreviousItem"
					},
					{
						"entitySet": "GLViewItems",
						"role": "ToRole_ItemPreviousItem"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SimulatedHeaderRelatedDocumentsSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.HeaderRelatedDocuments",
					"end": [{
						"entitySet": "SimulatedHeaders",
						"role": "FromRole_HeaderRelatedDocuments"
					},
					{
						"entitySet": "SimulatedRelatedDocuments",
						"role": "ToRole_HeaderRelatedDocuments"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "HeaderDocumentViewsSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.HeaderDocumentViews",
					"end": [{
						"entitySet": "Headers",
						"role": "FromRole_HeaderDocumentViews"
					},
					{
						"entitySet": "DocumentViews",
						"role": "ToRole_HeaderDocumentViews"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "EntryViewItemNextItemSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.ItemNextItem",
					"end": [{
						"entitySet": "EntryViewItems",
						"role": "FromRole_ItemNextItem"
					},
					{
						"entitySet": "EntryViewItems",
						"role": "ToRole_ItemNextItem"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SimulatedHeaderEntryItemsSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.HeaderItems",
					"end": [{
						"entitySet": "SimulatedHeaders",
						"role": "FromRole_HeaderItems"
					},
					{
						"entitySet": "SimulatedEntryViewItems",
						"role": "ToRole_HeaderItems"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SimulatedGLViewItemNextSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.ItemNextItem",
					"end": [{
						"entitySet": "SimulatedDocumentViewItems",
						"role": "FromRole_ItemNextItem"
					},
					{
						"entitySet": "SimulatedDocumentViewItems",
						"role": "ToRole_ItemNextItem"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SimulatedEntryViewItemPrevSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.ItemPreviousItem",
					"end": [{
						"entitySet": "SimulatedEntryViewItems",
						"role": "FromRole_ItemPreviousItem"
					},
					{
						"entitySet": "SimulatedEntryViewItems",
						"role": "ToRole_ItemPreviousItem"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "DocumentViewGLViewItems_AssocSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.DocumentViewGLViewItems",
					"end": [{
						"entitySet": "DocumentViews",
						"role": "FromRole_DocumentViewGLViewItems"
					},
					{
						"entitySet": "EntryViewItems",
						"role": "ToRole_DocumentViewGLViewItems"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SimulatedDocumentViewItemsSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.DocumentViewGLViewItems",
					"end": [{
						"entitySet": "SimulatedDocumentViews",
						"role": "FromRole_DocumentViewGLViewItems"
					},
					{
						"entitySet": "SimulatedDocumentViewItems",
						"role": "ToRole_DocumentViewGLViewItems"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "HeaderRelatedDocumentsSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.HeaderRelatedDocuments",
					"end": [{
						"entitySet": "Headers",
						"role": "FromRole_HeaderRelatedDocuments"
					},
					{
						"entitySet": "RelatedDocuments",
						"role": "ToRole_HeaderRelatedDocuments"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SimulatedEntryViewItemWithholdingTaxSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.ItemWithholdingTax",
					"end": [{
						"entitySet": "SimulatedEntryViewItems",
						"role": "FromRole_ItemWithholdingTax"
					},
					{
						"entitySet": "SimulatedWithholdingTax",
						"role": "ToRole_ItemWithholdingTax"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SimulatedGLViewItemWithholdingTaxSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.ItemWithholdingTax",
					"end": [{
						"entitySet": "SimulatedDocumentViewItems",
						"role": "FromRole_ItemWithholdingTax"
					},
					{
						"entitySet": "SimulatedGLViewWithholdingTax",
						"role": "ToRole_ItemWithholdingTax"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "HeaderNotesSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.HeaderNotes",
					"end": [{
						"entitySet": "Headers",
						"role": "FromRole_HeaderNotes"
					},
					{
						"entitySet": "Notes",
						"role": "ToRole_HeaderNotes"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SimulatedGLViewItemPrevSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.ItemPreviousItem",
					"end": [{
						"entitySet": "SimulatedDocumentViewItems",
						"role": "FromRole_ItemPreviousItem"
					},
					{
						"entitySet": "SimulatedDocumentViewItems",
						"role": "ToRole_ItemPreviousItem"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "HeaderItemsSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.HeaderItems",
					"end": [{
						"entitySet": "Headers",
						"role": "FromRole_HeaderItems"
					},
					{
						"entitySet": "EntryViewItems",
						"role": "ToRole_HeaderItems"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "HeaderAttachmentsSet",
					"association": "FAC_FINANCIAL_DOCUMENT_SRV_01.HeaderAttachments",
					"end": [{
						"entitySet": "Headers",
						"role": "FromRole_HeaderAttachments"
					},
					{
						"entitySet": "Attachments",
						"role": "ToRole_HeaderAttachments"
					}],
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "deletable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				}],
				"functionImport": [{
					"name": "SetReadOnly",
					"returnType": "FAC_FINANCIAL_DOCUMENT_SRV_01.Header",
					"entitySet": "Headers",
					"httpMethod": "POST",
					"parameter": [{
						"name": "AccountingDocument",
						"type": "Edm.String",
						"mode": "In",
						"maxLength": "10",
						"documentation": [{
							"text": null,
							"extensions": [{
								"name": "Summary",
								"value": "Belegnummer",
								"attributes": [],
								"children": [],
								"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
							},
							{
								"name": "LongDescription",
								"value": null,
								"attributes": [],
								"children": [],
								"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
							}]
						}]
					},
					{
						"name": "CompanyCode",
						"type": "Edm.String",
						"mode": "In",
						"maxLength": "4",
						"documentation": [{
							"text": null,
							"extensions": [{
								"name": "Summary",
								"value": "Buchungskreis",
								"attributes": [],
								"children": [],
								"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
							},
							{
								"name": "LongDescription",
								"value": null,
								"attributes": [],
								"children": [],
								"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
							}]
						}]
					},
					{
						"name": "FiscalYear",
						"type": "Edm.String",
						"mode": "In",
						"maxLength": "4",
						"documentation": [{
							"text": null,
							"extensions": [{
								"name": "Summary",
								"value": "Geschäftsjahr",
								"attributes": [],
								"children": [],
								"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
							},
							{
								"name": "LongDescription",
								"value": null,
								"attributes": [],
								"children": [],
								"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
							}]
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Feldsteuerungseigenschaften in Anzeigemodus umschalten",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "SetEditable",
					"returnType": "FAC_FINANCIAL_DOCUMENT_SRV_01.Header",
					"entitySet": "Headers",
					"httpMethod": "POST",
					"parameter": [{
						"name": "AccountingDocument",
						"type": "Edm.String",
						"mode": "In",
						"maxLength": "10",
						"documentation": [{
							"text": null,
							"extensions": [{
								"name": "Summary",
								"value": "Belegnummer",
								"attributes": [],
								"children": [],
								"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
							},
							{
								"name": "LongDescription",
								"value": null,
								"attributes": [],
								"children": [],
								"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
							}]
						}]
					},
					{
						"name": "CompanyCode",
						"type": "Edm.String",
						"mode": "In",
						"maxLength": "4",
						"documentation": [{
							"text": null,
							"extensions": [{
								"name": "Summary",
								"value": "Buchungskreis",
								"attributes": [],
								"children": [],
								"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
							},
							{
								"name": "LongDescription",
								"value": null,
								"attributes": [],
								"children": [],
								"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
							}]
						}]
					},
					{
						"name": "FiscalYear",
						"type": "Edm.String",
						"mode": "In",
						"maxLength": "4",
						"documentation": [{
							"text": null,
							"extensions": [{
								"name": "Summary",
								"value": "Geschäftsjahr",
								"attributes": [],
								"children": [],
								"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
							},
							{
								"name": "LongDescription",
								"value": null,
								"attributes": [],
								"children": [],
								"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
							}]
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Feldsteuerungseigenschaften in Bearbeitungsmodus umschalten",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "PostSimulatedDocument",
					"returnType": "FAC_FINANCIAL_DOCUMENT_SRV_01.AccountingDocumentKey",
					"httpMethod": "POST",
					"parameter": [{
						"name": "AccountingDocument",
						"type": "Edm.String",
						"mode": "In",
						"maxLength": "10",
						"documentation": [{
							"text": null,
							"extensions": [{
								"name": "Summary",
								"value": "Belegnummer",
								"attributes": [],
								"children": [],
								"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
							},
							{
								"name": "LongDescription",
								"value": null,
								"attributes": [],
								"children": [],
								"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
							}]
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "Simulierten Beleg buchen",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				{
					"name": "ReverseDocument",
					"returnType": "Collection(FAC_FINANCIAL_DOCUMENT_SRV_01.ReversalResult)",
					"httpMethod": "POST",
					"parameter": [{
						"name": "AccountingDocumentKey",
						"type": "Edm.String",
						"mode": "In",
						"maxLength": "1000",
						"documentation": [{
							"text": null,
							"extensions": [{
								"name": "Summary",
								"value": "Belegnummernschlüssel (flache Liste)",
								"attributes": [],
								"children": [],
								"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
							},
							{
								"name": "LongDescription",
								"value": null,
								"attributes": [],
								"children": [],
								"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
							}]
						}]
					},
					{
						"name": "ReversalReason",
						"type": "Edm.String",
						"mode": "In",
						"maxLength": "2",
						"documentation": [{
							"text": null,
							"extensions": [{
								"name": "Summary",
								"value": "Stornierungsgrund",
								"attributes": [],
								"children": [],
								"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
							},
							{
								"name": "LongDescription",
								"value": null,
								"attributes": [],
								"children": [],
								"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
							}]
						}]
					},
					{
						"name": "PostingDate",
						"type": "Edm.DateTime",
						"mode": "In",
						"precision": "0",
						"documentation": [{
							"text": null,
							"extensions": [{
								"name": "Summary",
								"value": "Buchungsdatum",
								"attributes": [],
								"children": [],
								"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
							},
							{
								"name": "LongDescription",
								"value": null,
								"attributes": [],
								"children": [],
								"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
							}]
						}]
					},
					{
						"name": "FiscalPeriod",
						"type": "Edm.String",
						"mode": "In",
						"maxLength": "2",
						"documentation": [{
							"text": null,
							"extensions": [{
								"name": "Summary",
								"value": "Periode",
								"attributes": [],
								"children": [],
								"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
							},
							{
								"name": "LongDescription",
								"value": null,
								"attributes": [],
								"children": [],
								"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
							}]
						}]
					},
					{
						"name": "IntercompanyIndicator",
						"type": "Edm.Boolean",
						"mode": "In",
						"documentation": [{
							"text": null,
							"extensions": [{
								"name": "Summary",
								"value": "Übergreifend-Kennzeichen",
								"attributes": [],
								"children": [],
								"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
							},
							{
								"name": "LongDescription",
								"value": null,
								"attributes": [],
								"children": [],
								"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
							}]
						}]
					},
					{
						"name": "TaxReportingDate",
						"type": "Edm.DateTime",
						"mode": "In",
						"precision": "0"
					}],
					"extensions": [{
						"name": "label",
						"value": "Beleg stornieren",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				}],
				"extensions": [{
					"name": "supported-formats",
					"value": "atom json xlsx",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}]
			}],
			"annotations": [{
				"target": "FAC_FINANCIAL_DOCUMENT_SRV_01.Header/AccountingDocumentCategory",
				"annotation": [{
					"term": "com.sap.vocabularies.Common.v1.ValueList",
					"record": {
						"propertyValue": [{
							"property": "Label",
							"string": "Document Status"
						},
						{
							"property": "CollectionPath",
							"string": "VL_FV_BSTAT"
						},
						{
							"property": "Parameters",
							"collection": {
								"record": [{
									"type": "com.sap.vocabularies.Common.v1.ValueListParameterInOut",
									"propertyValue": [{
										"property": "LocalDataProperty",
										"propertyPath": "AccountingDocumentCategory"
									},
									{
										"property": "ValueListProperty",
										"string": "Code"
									}]
								},
								{
									"type": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
									"propertyValue": [{
										"property": "ValueListProperty",
										"string": "Text"
									}]
								}]
							}
						}]
					}
				}]
			},
			{
				"target": "FAC_FINANCIAL_DOCUMENT_SRV_01.Header/AccountingDocumentType",
				"annotation": [{
					"term": "com.sap.vocabularies.Common.v1.ValueList",
					"record": {
						"propertyValue": [{
							"property": "Label",
							"string": "Help View for Document Types"
						},
						{
							"property": "CollectionPath",
							"string": "VL_SH_H_T003"
						},
						{
							"property": "SearchSupported",
							"bool": "true"
						},
						{
							"property": "Parameters",
							"collection": {
								"record": [{
									"type": "com.sap.vocabularies.Common.v1.ValueListParameterInOut",
									"propertyValue": [{
										"property": "LocalDataProperty",
										"propertyPath": "AccountingDocumentType"
									},
									{
										"property": "ValueListProperty",
										"string": "BLART"
									}]
								},
								{
									"type": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
									"propertyValue": [{
										"property": "ValueListProperty",
										"string": "LTEXT"
									}]
								}]
							}
						}]
					}
				}]
			},
			{
				"target": "FAC_FINANCIAL_DOCUMENT_SRV_01.Header/CoCodeCurrency",
				"annotation": [{
					"term": "com.sap.vocabularies.Common.v1.ValueList",
					"record": {
						"propertyValue": [{
							"property": "Label",
							"string": "Search help for currency"
						},
						{
							"property": "CollectionPath",
							"string": "VL_SH_SH_TCURC"
						},
						{
							"property": "SearchSupported",
							"bool": "true"
						},
						{
							"property": "Parameters",
							"collection": {
								"record": [{
									"type": "com.sap.vocabularies.Common.v1.ValueListParameterInOut",
									"propertyValue": [{
										"property": "LocalDataProperty",
										"propertyPath": "CoCodeCurrency"
									},
									{
										"property": "ValueListProperty",
										"string": "WAERS"
									}]
								},
								{
									"type": "com.sap.vocabularies.Common.v1.ValueListParameterInOut",
									"propertyValue": [{
										"property": "LocalDataProperty",
										"propertyPath": "AccountingDocumentTypeName"
									},
									{
										"property": "ValueListProperty",
										"string": "LTEXT"
									}]
								}]
							}
						}]
					}
				}]
			},
			{
				"target": "FAC_FINANCIAL_DOCUMENT_SRV_01.Header/CompanyCode",
				"annotation": [{
					"term": "com.sap.vocabularies.Common.v1.ValueList",
					"record": {
						"propertyValue": [{
							"property": "Label",
							"string": "Company Codes"
						},
						{
							"property": "CollectionPath",
							"string": "VL_SH_H_T001"
						},
						{
							"property": "SearchSupported",
							"bool": "true"
						},
						{
							"property": "Parameters",
							"collection": {
								"record": [{
									"type": "com.sap.vocabularies.Common.v1.ValueListParameterInOut",
									"propertyValue": [{
										"property": "LocalDataProperty",
										"propertyPath": "CompanyCode"
									},
									{
										"property": "ValueListProperty",
										"string": "BUKRS"
									}]
								},
								{
									"type": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
									"propertyValue": [{
										"property": "ValueListProperty",
										"string": "BUTXT"
									}]
								},
								{
									"type": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
									"propertyValue": [{
										"property": "ValueListProperty",
										"string": "ORT01"
									}]
								},
								{
									"type": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
									"propertyValue": [{
										"property": "ValueListProperty",
										"string": "WAERS"
									}]
								}]
							}
						}]
					}
				}]
			},
			{
				"target": "FAC_FINANCIAL_DOCUMENT_SRV_01.Header/ExchangeRateType",
				"annotation": [{
					"term": "com.sap.vocabularies.Common.v1.ValueList",
					"record": {
						"propertyValue": [{
							"property": "Label",
							"string": "Search help for exchange rate type"
						},
						{
							"property": "CollectionPath",
							"string": "VL_SH_FAC_EXCHANGE_RATE_TYPE"
						},
						{
							"property": "SearchSupported",
							"bool": "true"
						},
						{
							"property": "Parameters",
							"collection": {
								"record": [{
									"type": "com.sap.vocabularies.Common.v1.ValueListParameterInOut",
									"propertyValue": [{
										"property": "LocalDataProperty",
										"propertyPath": "ExchangeRateType"
									},
									{
										"property": "ValueListProperty",
										"string": "KURST"
									}]
								},
								{
									"type": "com.sap.vocabularies.Common.v1.ValueListParameterInOut",
									"propertyValue": [{
										"property": "LocalDataProperty",
										"propertyPath": "ReversalReasonName"
									},
									{
										"property": "ValueListProperty",
										"string": "CURVW"
									}]
								}]
							}
						}]
					}
				}]
			},
			{
				"target": "FAC_FINANCIAL_DOCUMENT_SRV_01.Header/LedgerGroup",
				"annotation": [{
					"term": "com.sap.vocabularies.Common.v1.ValueList",
					"record": {
						"propertyValue": [{
							"property": "Label",
							"string": "Ledger Groups in General Ledger"
						},
						{
							"property": "CollectionPath",
							"string": "VL_SH_FAGL_LEDGERGROUP"
						},
						{
							"property": "Parameters",
							"collection": {
								"record": [{
									"type": "com.sap.vocabularies.Common.v1.ValueListParameterInOut",
									"propertyValue": [{
										"property": "LocalDataProperty",
										"propertyPath": "LedgerGroup"
									},
									{
										"property": "ValueListProperty",
										"string": "LDGRP"
									}]
								},
								{
									"type": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
									"propertyValue": [{
										"property": "ValueListProperty",
										"string": "LEDGERNAME"
									}]
								},
								{
									"type": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
									"propertyValue": [{
										"property": "ValueListProperty",
										"string": "NAME"
									}]
								}]
							}
						}]
					}
				}]
			},
			{
				"target": "FAC_FINANCIAL_DOCUMENT_SRV_01.Header/ReversalFunction",
				"annotation": [{
					"term": "com.sap.vocabularies.Common.v1.ValueList",
					"record": {
						"propertyValue": [{
							"property": "Label",
							"string": "Whether Reversal Document or Reversed Document"
						},
						{
							"property": "CollectionPath",
							"string": "VL_FV_XREVERSAL"
						},
						{
							"property": "Parameters",
							"collection": {
								"record": [{
									"type": "com.sap.vocabularies.Common.v1.ValueListParameterInOut",
									"propertyValue": [{
										"property": "LocalDataProperty",
										"propertyPath": "ReversalFunction"
									},
									{
										"property": "ValueListProperty",
										"string": "Code"
									}]
								},
								{
									"type": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
									"propertyValue": [{
										"property": "ValueListProperty",
										"string": "Text"
									}]
								}]
							}
						}]
					}
				}]
			},
			{
				"target": "FAC_FINANCIAL_DOCUMENT_SRV_01.Header/ReversalReason",
				"annotation": [{
					"term": "com.sap.vocabularies.Common.v1.ValueList",
					"record": {
						"propertyValue": [{
							"property": "Label",
							"string": "Search help for reversal reason"
						},
						{
							"property": "CollectionPath",
							"string": "VL_SH_FAC_REVERSAL_REASON"
						},
						{
							"property": "SearchSupported",
							"bool": "true"
						},
						{
							"property": "Parameters",
							"collection": {
								"record": [{
									"type": "com.sap.vocabularies.Common.v1.ValueListParameterInOut",
									"propertyValue": [{
										"property": "LocalDataProperty",
										"propertyPath": "ReversalReason"
									},
									{
										"property": "ValueListProperty",
										"string": "STGRD"
									}]
								},
								{
									"type": "com.sap.vocabularies.Common.v1.ValueListParameterInOut",
									"propertyValue": [{
										"property": "LocalDataProperty",
										"propertyPath": "ReversalReasonName"
									},
									{
										"property": "ValueListProperty",
										"string": "TXT40"
									}]
								}]
							}
						}]
					}
				}]
			},
			{
				"target": "FAC_FINANCIAL_DOCUMENT_SRV_01.Header/TransactionCurrency",
				"annotation": [{
					"term": "com.sap.vocabularies.Common.v1.ValueList",
					"record": {
						"propertyValue": [{
							"property": "Label",
							"string": "Search help for currency"
						},
						{
							"property": "CollectionPath",
							"string": "VL_SH_SH_TCURC"
						},
						{
							"property": "SearchSupported",
							"bool": "true"
						},
						{
							"property": "Parameters",
							"collection": {
								"record": [{
									"type": "com.sap.vocabularies.Common.v1.ValueListParameterInOut",
									"propertyValue": [{
										"property": "LocalDataProperty",
										"propertyPath": "TransactionCurrency"
									},
									{
										"property": "ValueListProperty",
										"string": "WAERS"
									}]
								},
								{
									"type": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
									"propertyValue": [{
										"property": "ValueListProperty",
										"string": "LTEXT"
									}]
								}]
							}
						}]
					}
				}]
			}],
			"extensions": [{
				"name": "lang",
				"value": "de",
				"namespace": "http://www.w3.org/XML/1998/namespace"
			},
			{
				"name": "schema-version",
				"value": "2",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "link",
				"value": null,
				"attributes": [{
					"name": "rel",
					"value": "self",
					"namespace": null
				},
				{
					"name": "href",
					"value": "",
					"namespace": null
				}],
				"children": [],
				"namespace": "http://www.w3.org/2005/Atom"
			},
			{
				"name": "link",
				"value": null,
				"attributes": [{
					"name": "rel",
					"value": "latest-version",
					"namespace": null
				},
				{
					"name": "href",
					"value": "",
					"namespace": null
				}],
				"children": [],
				"namespace": "http://www.w3.org/2005/Atom"
			}]
		}]
	}
};
});