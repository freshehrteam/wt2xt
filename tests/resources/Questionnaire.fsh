Alias: $usage-context-type = http://terminology.hl7.org/CodeSystem/usage-context-type
Alias: $activity-codes = http://fhir.org/guides/nachc/hiv-cds/CodeSystem/activity-codes

Instance: ASLPA1
InstanceOf: Questionnaire
Usage: #example
* meta.versionId = "1"
* meta.lastUpdated = "2025-01-13T11:02:45.121+00:00"
* meta.source = "#88cd2180adf0c983"
* extension[0].url = "http://hl7.org/fhir/uv/cpg/StructureDefinition/cpg-knowledgeCapability"
* extension[=].valueCode = #shareable
* extension[+].url = "http://hl7.org/fhir/uv/cpg/StructureDefinition/cpg-knowledgeCapability"
* extension[=].valueCode = #computable
* extension[+].url = "http://hl7.org/fhir/uv/cpg/StructureDefinition/cpg-knowledgeCapability"
* extension[=].valueCode = #publishable
* extension[+].url = "http://hl7.org/fhir/uv/cpg/StructureDefinition/cpg-knowledgeRepresentationLevel"
* extension[=].valueCode = #structured
* extension[+].url = "http://hl7.org/fhir/StructureDefinition/cqf-library"
* extension[=].valueCanonical = "http://example.org/sdh/dtr/aslp/Library/ASLPDataElements"
* url = "http://example.org/sdh/dtr/aslp/Questionnaire/ASLPA1"
* name = "ASLPA1"
* title = "ASLP.A1 Adult Sleep Studies"
* status = #active
* experimental = false
* description = "Adult Sleep Studies Prior Authorization Form"
* useContext.code = $usage-context-type#task "Workflow Task"
* useContext.valueCodeableConcept = $activity-codes#ASLP.A1 "Adult Sleep Studies"
* item[0].extension.url = "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-itemPopulationContext"
* item[=].extension.valueExpression.language = #text/cql-identifier
* item[=].extension.valueExpression.expression = "Sleep Study"
* item[=].linkId = "0"
* item[=].definition = "http://example.org/sdh/dtr/aslp/StructureDefinition/aslp-sleep-study-order"
* item[=].text = "A sleep study procedure being ordered"
* item[=].type = #group
* item[=].repeats = true
* item[=].item[0].linkId = "1"
* item[=].item[=].definition = "http://example.org/sdh/dtr/aslp/StructureDefinition/aslp-sleep-study-order#ServiceRequest.code"
* item[=].item[=].text = "A sleep study procedure being ordered"
* item[=].item[=].type = #choice
* item[=].item[=].answerValueSet = "http://example.org/sdh/dtr/aslp/ValueSet/aslp-a1-de1-codes-grouper"
* item[=].item[+].linkId = "2"
* item[=].item[=].definition = "http://example.org/sdh/dtr/aslp/StructureDefinition/aslp-sleep-study-order#ServiceRequest.occurrence[x]"
* item[=].item[=].text = "Date of the procedure"
* item[=].item[=].type = #dateTime
* item[+].extension.url = "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression"
* item[=].extension.valueExpression.language = #text/cql-identifier
* item[=].extension.valueExpression.expression = "Diagnosis of Obstructive Sleep Apnea"
* item[=].linkId = "3"
* item[=].definition = "http://example.org/sdh/dtr/aslp/StructureDefinition/aslp-diagnosis-of-obstructive-sleep-apnea#Condition.code"
* item[=].text = "Diagnosis of Obstructive Sleep Apnea"
* item[=].type = #choice
* item[=].answerValueSet = "http://example.org/sdh/dtr/aslp/ValueSet/aslp-a1-de17"
* item[+].extension.url = "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression"
* item[=].extension.valueExpression.language = #text/cql-identifier
* item[=].extension.valueExpression.expression = "History of Hypertension"
* item[=].linkId = "4"
* item[=].definition = "http://example.org/sdh/dtr/aslp/StructureDefinition/aslp-history-of-hypertension#Observation.value[x]"
* item[=].text = "History of Hypertension"
* item[=].type = #boolean
* item[+].extension.url = "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression"
* item[=].extension.valueExpression.language = #text/cql-identifier
* item[=].extension.valueExpression.expression = "History of Diabetes"
* item[=].linkId = "5"
* item[=].definition = "http://example.org/sdh/dtr/aslp/StructureDefinition/aslp-history-of-diabetes#Observation.value[x]"
* item[=].text = "History of Diabetes"
* item[=].type = #boolean
* item[+].extension.url = "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression"
* item[=].extension.valueExpression.language = #text/cql-identifier
* item[=].extension.valueExpression.expression = "Neck Circumference"
* item[=].linkId = "6"
* item[=].definition = "http://example.org/sdh/dtr/aslp/StructureDefinition/aslp-height#Observation.value[x]"
* item[=].text = "Neck circumference (in inches)"
* item[=].type = #quantity
* item[+].extension.url = "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression"
* item[=].extension.valueExpression.language = #text/cql-identifier
* item[=].extension.valueExpression.expression = "Height"
* item[=].linkId = "7"
* item[=].definition = "http://example.org/sdh/dtr/aslp/StructureDefinition/aslp-height#Observation.value[x]"
* item[=].text = "Height (in inches)"
* item[=].type = #quantity
* item[+].extension.url = "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression"
* item[=].extension.valueExpression.language = #text/cql-identifier
* item[=].extension.valueExpression.expression = "Weight"
* item[=].linkId = "8"
* item[=].definition = "http://example.org/sdh/dtr/aslp/StructureDefinition/aslp-weight#Observation.value[x]"
* item[=].text = "Weight (in pounds)"
* item[=].type = #quantity
* item[+].extension.url = "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression"
* item[=].extension.valueExpression.language = #text/cql-identifier
* item[=].extension.valueExpression.expression = "BMI"
* item[=].linkId = "9"
* item[=].definition = "http://example.org/sdh/dtr/aslp/StructureDefinition/aslp-bmi#Observation.value[x]"
* item[=].text = "Body mass index (BMI)"
* item[=].type = #quantity