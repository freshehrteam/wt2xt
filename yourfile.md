# Template: TEST - Complete template

Template Id: **TEST - Complete template**

Version: **1.0.0**

Created: **Mon Aug 11 2025**

## Composition: **TEST - Complete template**

Interaction, contact or care event between a subject of care and
healthcare provider(s).

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 50%" />
<col style="width: 30%" />
</colgroup>
<thead>
<tr class="header">
<th style="text-align: left;">Data item</th>
<th style="text-align: left;">Description</th>
<th style="text-align: left;">Allowed values</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;"><p><strong>composer</strong><br />
Type: <code>Party</code> (<em>mandatory</em>)</p></td>
<td style="text-align: left;"><p>The person primarily responsible for
the content of the Composition (but not necessarily its committal into
the EHR system). This is the identifier which should appear on the
screen. It may or may not be the person who entered the data. When it is
the patient, the special self instance of <code>PARTY_SELF</code> will
be used.</p></td>
<td style="text-align: left;"></td>
</tr>
</tbody>
</table>

### context

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 50%" />
<col style="width: 30%" />
</colgroup>
<thead>
<tr class="header">
<th style="text-align: left;">Data item</th>
<th style="text-align: left;">Description</th>
<th style="text-align: left;">Allowed values</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;"><p><strong>start_time</strong><br />
Type: <code>Date/time</code> (<em>mandatory</em>)</p></td>
<td style="text-align: left;"><p>COMPOSITION.context.start_time - Start
time of the clinical session or other kind of event during which a
provider performs a service of any kind for the patient.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>setting</strong><br />
Type: <code>Coded text</code> (<em>mandatory</em>)</p></td>
<td style="text-align: left;"><p>The setting in which the clinical
session took place. Coded using the openEHR Terminology, setting
group.</p></td>
<td style="text-align: left;"></td>
</tr>
</tbody>
</table>

## **Reason for encounter**

The reason for initiation of any healthcare encounter or contact by the
individual who is the subject of care.

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 50%" />
<col style="width: 30%" />
</colgroup>
<thead>
<tr class="header">
<th style="text-align: left;">Data item</th>
<th style="text-align: left;">Description</th>
<th style="text-align: left;">Allowed values</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## **Translation requirement**

The need for language translation in order to provide delivery of health
care or related services.

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 50%" />
<col style="width: 30%" />
</colgroup>
<thead>
<tr class="header">
<th style="text-align: left;">Data item</th>
<th style="text-align: left;">Description</th>
<th style="text-align: left;">Allowed values</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## **Observations**

A generic section header which should be renamed in a template to suit a
specific clinical context.

## **Blood pressure**

The local measurement of arterial blood pressure which is a surrogate
for arterial pressure in the systemic circulation.

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 50%" />
<col style="width: 30%" />
</colgroup>
<thead>
<tr class="header">
<th style="text-align: left;">Data item</th>
<th style="text-align: left;">Description</th>
<th style="text-align: left;">Allowed values</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td colspan="3" style="text-align: left;"><h3
id="_any_event_multiple">Any event <strong>[multiple]</strong></h3>
<p><code>EVENT: at0006</code></p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Time</strong><br />
Type: <code>Date/time</code> (<em>mandatory</em>)</p></td>
<td style="text-align: left;"><p><code>OBSERVATION.EVENT.time</code> -
Time of this Observation event. If the width is non-zero, it is the time
point of the trailing edge of the event.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td colspan="3" style="text-align: left;"><h3 id="_24_hour_average">24
hour average</h3>
<p><code>INTERVAL_EVENT: at1042</code></p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>math_function</strong><br />
Type: <code>Coded text</code> (<em>mandatory</em>)</p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"><ul>
<li><p>mean<br />
<code>openehr:146</code></p></li>
</ul></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>width</strong><br />
Type: <code>Duration</code> (<em>mandatory</em>)</p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Time</strong><br />
Type: <code>Date/time</code> (<em>mandatory</em>)</p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td colspan="3" style="text-align: left;"><h3
id="_medical_device">Medical device</h3></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Device name</strong><br />
Type: <code>Text</code> (<em>mandatory</em>)</p></td>
<td style="text-align: left;"><p>Identification of the medical device,
preferably by a common name, a formal fully descriptive name or, if
required, by class or category of device.</p></td>
<td style="text-align: left;"></td>
</tr>
</tbody>
</table>

## **Demonstration**

Demonstration archetype with descriptions and explanations.

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 50%" />
<col style="width: 30%" />
</colgroup>
<thead>
<tr class="header">
<th style="text-align: left;">Data item</th>
<th style="text-align: left;">Description</th>
<th style="text-align: left;">Allowed values</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td colspan="3" style="text-align: left;"><h3 id="_any_event">Any
Event</h3>
<p><code>EVENT: at0002</code></p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Data -
Definition</strong><br />
Type: <code>Choice</code></p></td>
<td style="text-align: left;"><p>All archetypes of the OBSERVATION class
contain a DATA model which contains the core information e.g. the
systolic and diastolic pressures when measuring a blood
pressure.</p></td>
<td style="text-align: left;"><p><em>All data types
allowed</em></p></td>
</tr>
<tr class="odd">
<td colspan="3" style="text-align: left;"><h3
id="_heading1_multiple">Heading1 <strong>[multiple]</strong></h3></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Free Text or
Coded</strong><br />
Type: <code>Text</code></p></td>
<td style="text-align: left;"><p>Text data type in which free text can
be entered or coding can be incorporated either in the template or at
run time.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Text That Uses Internal
Codes</strong><br />
Type: <code>Coded text</code> (<em>multiple</em>)</p></td>
<td style="text-align: left;"><p>Text data type which can use an
internal vocabulary. Each of these 'internal codes' can be bound to a
terminology code.</p></td>
<td style="text-align: left;"><ul>
<li><p>Lying</p></li>
<li><p>Reclining</p></li>
<li><p>Sitting</p></li>
<li><p>Standing</p></li>
</ul></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Text That is Sourced From an
External Terminology</strong><br />
Type: <code>Coded text</code> (<em>mandatory</em>)</p></td>
<td style="text-align: left;"><p>Text data type utilising codes derived
from an external terminology source eg a SNOMED-CT, LOINC or ICD
subset.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Quantity</strong><br />
Type: <code>Quantity</code></p></td>
<td style="text-align: left;"><p>A quantity data type used to record a
measurement associated with its' appropriate units. These are derived
from ISO standards and the Reference model enables conversion between
these units. The example shown here is length.</p></td>
<td style="text-align: left;"><p>Valid units:<br />
</p>
<ul>
<li><p>cm</p></li>
<li><p>mm</p></li>
<li><p>[in_i]</p></li>
<li><p>[ft_i]</p></li>
</ul></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Count</strong><br />
Type: <code>Count</code></p></td>
<td style="text-align: left;"><p>Count data types are composed of an
integer with no units eg for recording the number of children - in this
example the minimum is set at 0 and the maximum not specified.</p></td>
<td style="text-align: left;"><p>Range:<br />
</p>
<ul>
<li><p>&gt;= 0 and undefined undefined</p></li>
</ul></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Proportion</strong><br />
Type: <code>Proportion</code></p></td>
<td style="text-align: left;"><p>Proportion datatypes allow for ratios,
percent, fractions and proportions to be modelled.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Date/Time</strong><br />
Type: <code>Date/time</code></p></td>
<td style="text-align: left;"><p>Date/Time datatype allows recording of
a date and/or time, including partial dates such as year only or month
and year only. Allow all is the default - so all forms of date/time are
permitted.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Duration</strong><br />
Type: <code>Duration</code></p></td>
<td style="text-align: left;"><p>Duration datatype allows recording of
the duration of clinical concepts. 'Allow all time units' is the
default, although specific time units can be explicitly modelled.
Maximum and minum values can be set for each time unit.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Ordinal</strong><br />
Type: <code>Ordinal</code></p></td>
<td style="text-align: left;"><p>Ordinal datatypes pair a number and
text - in this way scores can be calculated in software, or progression
can be assessed eg if used in a pain score.</p></td>
<td style="text-align: left;"><ul>
<li><p>[0] No pain<br />
<code>local:at0038</code></p></li>
<li><p>[1] Slight pain<br />
<code>local:at0039</code></p></li>
<li><p>[2] Mild pain<br />
<code>local:at0040</code></p></li>
<li><p>[5] Moderate pain<br />
<code>local:at0041</code></p></li>
<li><p>[9] Severe pain<br />
<code>local:at0042</code></p></li>
<li><p>[10] Most severe pain imaginable<br />
<code>local:at0043</code></p></li>
</ul></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Boolean</strong><br />
Type: <code>Choice</code></p></td>
<td style="text-align: left;"><p>Boolean datatype that allows for true
or false answers.</p></td>
<td style="text-align: left;"><p><em>Multiple data types
allowed</em></p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><em>SubTypes</em></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p>Type: <code>Boolean</code></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>Type: <code>Coded text</code></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"><ul>
<li><p>no information<br />
<code>openehr:271</code></p></li>
<li><p>masked<br />
<code>openehr:272</code></p></li>
<li><p>not applicable<br />
<code>openehr:273</code></p></li>
<li><p>unknown<br />
<code>openehr:253</code></p></li>
</ul></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Any</strong><br />
Type: <code>Choice</code></p></td>
<td style="text-align: left;"><p>The datatype for this 'any' element can
be specified or constrained in a template or at run-time, but is not
explicitly modelled in the archetype.</p></td>
<td style="text-align: left;"><p><em>All data types
allowed</em></p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Choice</strong><br />
Type: <code>Choice</code></p></td>
<td style="text-align: left;"><p>Choice datatype allows for a number of
types of element to be specified simultaneously and which can
constrained or selected within a template or at run-time. In this
example, a text datatype set to Free text or Coded and another that is
constrained to Terminology record data about the same data
element.</p></td>
<td style="text-align: left;"><p><em>Multiple data types
allowed</em></p></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><em>SubTypes</em></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>Type: <code>Quantity</code></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"><p>Valid units:<br />
</p>
<ul>
<li><p>g</p></li>
<li><p>[foz_us]</p></li>
</ul></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p>Type: <code>Coded text</code></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Multimedia</strong><br />
Type: <code>Multimedia</code></p></td>
<td style="text-align: left;"><p>Multimedia datatypes allow for the
recording of many types of multimedia files to be captured. All
available types have been explicitly selected in this example.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>URI - resource
identifier</strong><br />
Type: <code>External URI</code></p></td>
<td style="text-align: left;"><p>URI datatypes allow for recording of
relationships from this data to data recorded elsewhere. These links can
be within the same EHR, or external eg to a URL.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Identifier</strong><br />
Type: <code>Identifier</code></p></td>
<td style="text-align: left;"><p>Identifier datatypes enable recording
of formal data identifiers.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>State -
Definition</strong><br />
Type: <code>Choice</code></p></td>
<td style="text-align: left;"><p>All archetypes of the OBSERVATION class
can contain a STATE model which contains information about the subject
of data at the time the information was collected, and this information
is required for safe clinical interpretation of the core information. An
example is the position of the patient at the time of measuring a blood
pressure. Datatypes are identical to those explained in the Data model,
above.</p></td>
<td style="text-align: left;"><p><em>All data types
allowed</em></p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Time</strong><br />
Type: <code>Date/time</code> (<em>mandatory</em>)</p></td>
<td style="text-align: left;"><p><code>OBSERVATION.EVENT.time</code> -
Time of this Observation event. If the width is non-zero, it is the time
point of the trailing edge of the event.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td colspan="3" style="text-align: left;"><h3
id="_named_point_in_time">Named Point In Time</h3>
<p><code>POINT_EVENT: at0033</code></p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Data -
Definition</strong><br />
Type: <code>Choice</code></p></td>
<td style="text-align: left;"><p>All archetypes of the OBSERVATION class
contain a DATA model which contains the core information e.g. the
systolic and diastolic pressures when measuring a blood
pressure.</p></td>
<td style="text-align: left;"><p><em>All data types
allowed</em></p></td>
</tr>
<tr class="odd">
<td colspan="3" style="text-align: left;"><h3
id="_heading1_multiple_2">Heading1 <strong>[multiple]</strong></h3></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Free Text or
Coded</strong><br />
Type: <code>Text</code></p></td>
<td style="text-align: left;"><p>Text data type in which free text can
be entered or coding can be incorporated either in the template or at
run time.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Text That Uses Internal
Codes</strong><br />
Type: <code>Coded text</code> (<em>multiple</em>)</p></td>
<td style="text-align: left;"><p>Text data type which can use an
internal vocabulary. Each of these 'internal codes' can be bound to a
terminology code.</p></td>
<td style="text-align: left;"><ul>
<li><p>Lying</p></li>
<li><p>Reclining</p></li>
<li><p>Sitting</p></li>
<li><p>Standing</p></li>
</ul></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Text That is Sourced From an
External Terminology</strong><br />
Type: <code>Coded text</code> (<em>mandatory</em>)</p></td>
<td style="text-align: left;"><p>Text data type utilising codes derived
from an external terminology source eg a SNOMED-CT, LOINC or ICD
subset.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Quantity</strong><br />
Type: <code>Quantity</code></p></td>
<td style="text-align: left;"><p>A quantity data type used to record a
measurement associated with its' appropriate units. These are derived
from ISO standards and the Reference model enables conversion between
these units. The example shown here is length.</p></td>
<td style="text-align: left;"><p>Valid units:<br />
</p>
<ul>
<li><p>cm</p></li>
<li><p>mm</p></li>
<li><p>[in_i]</p></li>
<li><p>[ft_i]</p></li>
</ul></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Count</strong><br />
Type: <code>Count</code></p></td>
<td style="text-align: left;"><p>Count data types are composed of an
integer with no units eg for recording the number of children - in this
example the minimum is set at 0 and the maximum not specified.</p></td>
<td style="text-align: left;"><p>Range:<br />
</p>
<ul>
<li><p>&gt;= 0 and undefined undefined</p></li>
</ul></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Proportion</strong><br />
Type: <code>Proportion</code></p></td>
<td style="text-align: left;"><p>Proportion datatypes allow for ratios,
percent, fractions and proportions to be modelled.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Date/Time</strong><br />
Type: <code>Date/time</code></p></td>
<td style="text-align: left;"><p>Date/Time datatype allows recording of
a date and/or time, including partial dates such as year only or month
and year only. Allow all is the default - so all forms of date/time are
permitted.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Duration</strong><br />
Type: <code>Duration</code></p></td>
<td style="text-align: left;"><p>Duration datatype allows recording of
the duration of clinical concepts. 'Allow all time units' is the
default, although specific time units can be explicitly modelled.
Maximum and minum values can be set for each time unit.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Ordinal</strong><br />
Type: <code>Ordinal</code></p></td>
<td style="text-align: left;"><p>Ordinal datatypes pair a number and
text - in this way scores can be calculated in software, or progression
can be assessed eg if used in a pain score.</p></td>
<td style="text-align: left;"><ul>
<li><p>[0] No pain<br />
<code>local:at0038</code></p></li>
<li><p>[1] Slight pain<br />
<code>local:at0039</code></p></li>
<li><p>[2] Mild pain<br />
<code>local:at0040</code></p></li>
<li><p>[5] Moderate pain<br />
<code>local:at0041</code></p></li>
<li><p>[9] Severe pain<br />
<code>local:at0042</code></p></li>
<li><p>[10] Most severe pain imaginable<br />
<code>local:at0043</code></p></li>
</ul></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Boolean</strong><br />
Type: <code>Choice</code></p></td>
<td style="text-align: left;"><p>Boolean datatype that allows for true
or false answers.</p></td>
<td style="text-align: left;"><p><em>Multiple data types
allowed</em></p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><em>SubTypes</em></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p>Type: <code>Boolean</code></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>Type: <code>Coded text</code></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"><ul>
<li><p>no information<br />
<code>openehr:271</code></p></li>
<li><p>masked<br />
<code>openehr:272</code></p></li>
<li><p>not applicable<br />
<code>openehr:273</code></p></li>
<li><p>unknown<br />
<code>openehr:253</code></p></li>
</ul></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Any</strong><br />
Type: <code>Choice</code></p></td>
<td style="text-align: left;"><p>The datatype for this 'any' element can
be specified or constrained in a template or at run-time, but is not
explicitly modelled in the archetype.</p></td>
<td style="text-align: left;"><p><em>All data types
allowed</em></p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Choice</strong><br />
Type: <code>Choice</code></p></td>
<td style="text-align: left;"><p>Choice datatype allows for a number of
types of element to be specified simultaneously and which can
constrained or selected within a template or at run-time. In this
example, a text datatype set to Free text or Coded and another that is
constrained to Terminology record data about the same data
element.</p></td>
<td style="text-align: left;"><p><em>Multiple data types
allowed</em></p></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><em>SubTypes</em></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>Type: <code>Quantity</code></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"><p>Valid units:<br />
</p>
<ul>
<li><p>g</p></li>
<li><p>[foz_us]</p></li>
</ul></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p>Type: <code>Coded text</code></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Multimedia</strong><br />
Type: <code>Multimedia</code></p></td>
<td style="text-align: left;"><p>Multimedia datatypes allow for the
recording of many types of multimedia files to be captured. All
available types have been explicitly selected in this example.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>URI - resource
identifier</strong><br />
Type: <code>External URI</code></p></td>
<td style="text-align: left;"><p>URI datatypes allow for recording of
relationships from this data to data recorded elsewhere. These links can
be within the same EHR, or external eg to a URL.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Identifier</strong><br />
Type: <code>Identifier</code></p></td>
<td style="text-align: left;"><p>Identifier datatypes enable recording
of formal data identifiers.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>State -
Definition</strong><br />
Type: <code>Choice</code></p></td>
<td style="text-align: left;"><p>All archetypes of the OBSERVATION class
can contain a STATE model which contains information about the subject
of data at the time the information was collected, and this information
is required for safe clinical interpretation of the core information. An
example is the position of the patient at the time of measuring a blood
pressure. Datatypes are identical to those explained in the Data model,
above.</p></td>
<td style="text-align: left;"><p><em>All data types
allowed</em></p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Time</strong><br />
Type: <code>Date/time</code> (<em>mandatory</em>)</p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td colspan="3" style="text-align: left;"><h3 id="_named_interval">Named
Interval</h3>
<p><code>INTERVAL_EVENT: at0034</code></p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>math_function</strong><br />
Type: <code>Coded text</code> (<em>mandatory</em>)</p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"><ul>
<li><p>change<br />
<code>openehr:147</code></p></li>
</ul></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Data -
Definition</strong><br />
Type: <code>Choice</code></p></td>
<td style="text-align: left;"><p>All archetypes of the OBSERVATION class
contain a DATA model which contains the core information e.g. the
systolic and diastolic pressures when measuring a blood
pressure.</p></td>
<td style="text-align: left;"><p><em>All data types
allowed</em></p></td>
</tr>
<tr class="even">
<td colspan="3" style="text-align: left;"><h3
id="_heading1_multiple_3">Heading1 <strong>[multiple]</strong></h3></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Free Text or
Coded</strong><br />
Type: <code>Text</code></p></td>
<td style="text-align: left;"><p>Text data type in which free text can
be entered or coding can be incorporated either in the template or at
run time.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Text That Uses Internal
Codes</strong><br />
Type: <code>Coded text</code> (<em>multiple</em>)</p></td>
<td style="text-align: left;"><p>Text data type which can use an
internal vocabulary. Each of these 'internal codes' can be bound to a
terminology code.</p></td>
<td style="text-align: left;"><ul>
<li><p>Lying</p></li>
<li><p>Reclining</p></li>
<li><p>Sitting</p></li>
<li><p>Standing</p></li>
</ul></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Text That is Sourced From an
External Terminology</strong><br />
Type: <code>Coded text</code> (<em>mandatory</em>)</p></td>
<td style="text-align: left;"><p>Text data type utilising codes derived
from an external terminology source eg a SNOMED-CT, LOINC or ICD
subset.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Quantity</strong><br />
Type: <code>Quantity</code></p></td>
<td style="text-align: left;"><p>A quantity data type used to record a
measurement associated with its' appropriate units. These are derived
from ISO standards and the Reference model enables conversion between
these units. The example shown here is length.</p></td>
<td style="text-align: left;"><p>Valid units:<br />
</p>
<ul>
<li><p>cm</p></li>
<li><p>mm</p></li>
<li><p>[in_i]</p></li>
<li><p>[ft_i]</p></li>
</ul></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Count</strong><br />
Type: <code>Count</code></p></td>
<td style="text-align: left;"><p>Count data types are composed of an
integer with no units eg for recording the number of children - in this
example the minimum is set at 0 and the maximum not specified.</p></td>
<td style="text-align: left;"><p>Range:<br />
</p>
<ul>
<li><p>&gt;= 0 and undefined undefined</p></li>
</ul></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Proportion</strong><br />
Type: <code>Proportion</code></p></td>
<td style="text-align: left;"><p>Proportion datatypes allow for ratios,
percent, fractions and proportions to be modelled.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Date/Time</strong><br />
Type: <code>Date/time</code></p></td>
<td style="text-align: left;"><p>Date/Time datatype allows recording of
a date and/or time, including partial dates such as year only or month
and year only. Allow all is the default - so all forms of date/time are
permitted.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Duration</strong><br />
Type: <code>Duration</code></p></td>
<td style="text-align: left;"><p>Duration datatype allows recording of
the duration of clinical concepts. 'Allow all time units' is the
default, although specific time units can be explicitly modelled.
Maximum and minum values can be set for each time unit.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Ordinal</strong><br />
Type: <code>Ordinal</code></p></td>
<td style="text-align: left;"><p>Ordinal datatypes pair a number and
text - in this way scores can be calculated in software, or progression
can be assessed eg if used in a pain score.</p></td>
<td style="text-align: left;"><ul>
<li><p>[0] No pain<br />
<code>local:at0038</code></p></li>
<li><p>[1] Slight pain<br />
<code>local:at0039</code></p></li>
<li><p>[2] Mild pain<br />
<code>local:at0040</code></p></li>
<li><p>[5] Moderate pain<br />
<code>local:at0041</code></p></li>
<li><p>[9] Severe pain<br />
<code>local:at0042</code></p></li>
<li><p>[10] Most severe pain imaginable<br />
<code>local:at0043</code></p></li>
</ul></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Boolean</strong><br />
Type: <code>Choice</code></p></td>
<td style="text-align: left;"><p>Boolean datatype that allows for true
or false answers.</p></td>
<td style="text-align: left;"><p><em>Multiple data types
allowed</em></p></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><em>SubTypes</em></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>Type: <code>Boolean</code></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p>Type: <code>Coded text</code></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"><ul>
<li><p>no information<br />
<code>openehr:271</code></p></li>
<li><p>masked<br />
<code>openehr:272</code></p></li>
<li><p>not applicable<br />
<code>openehr:273</code></p></li>
<li><p>unknown<br />
<code>openehr:253</code></p></li>
</ul></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Any</strong><br />
Type: <code>Choice</code></p></td>
<td style="text-align: left;"><p>The datatype for this 'any' element can
be specified or constrained in a template or at run-time, but is not
explicitly modelled in the archetype.</p></td>
<td style="text-align: left;"><p><em>All data types
allowed</em></p></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Choice</strong><br />
Type: <code>Choice</code></p></td>
<td style="text-align: left;"><p>Choice datatype allows for a number of
types of element to be specified simultaneously and which can
constrained or selected within a template or at run-time. In this
example, a text datatype set to Free text or Coded and another that is
constrained to Terminology record data about the same data
element.</p></td>
<td style="text-align: left;"><p><em>Multiple data types
allowed</em></p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><em>SubTypes</em></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p>Type: <code>Quantity</code></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"><p>Valid units:<br />
</p>
<ul>
<li><p>g</p></li>
<li><p>[foz_us]</p></li>
</ul></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>Type: <code>Coded text</code></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Multimedia</strong><br />
Type: <code>Multimedia</code></p></td>
<td style="text-align: left;"><p>Multimedia datatypes allow for the
recording of many types of multimedia files to be captured. All
available types have been explicitly selected in this example.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>URI - resource
identifier</strong><br />
Type: <code>External URI</code></p></td>
<td style="text-align: left;"><p>URI datatypes allow for recording of
relationships from this data to data recorded elsewhere. These links can
be within the same EHR, or external eg to a URL.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Identifier</strong><br />
Type: <code>Identifier</code></p></td>
<td style="text-align: left;"><p>Identifier datatypes enable recording
of formal data identifiers.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>State -
Definition</strong><br />
Type: <code>Choice</code></p></td>
<td style="text-align: left;"><p>All archetypes of the OBSERVATION class
can contain a STATE model which contains information about the subject
of data at the time the information was collected, and this information
is required for safe clinical interpretation of the core information. An
example is the position of the patient at the time of measuring a blood
pressure. Datatypes are identical to those explained in the Data model,
above.</p></td>
<td style="text-align: left;"><p><em>All data types
allowed</em></p></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Width</strong><br />
Type: <code>Duration</code> (<em>mandatory</em>)</p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Time</strong><br />
Type: <code>Date/time</code> (<em>mandatory</em>)</p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td colspan="3" style="text-align: left;"><h3
id="_offset_point_in_time">Offset Point In Time</h3>
<p><code>POINT_EVENT: at0035</code></p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Data -
Definition</strong><br />
Type: <code>Choice</code></p></td>
<td style="text-align: left;"><p>All archetypes of the OBSERVATION class
contain a DATA model which contains the core information e.g. the
systolic and diastolic pressures when measuring a blood
pressure.</p></td>
<td style="text-align: left;"><p><em>All data types
allowed</em></p></td>
</tr>
<tr class="odd">
<td colspan="3" style="text-align: left;"><h3
id="_heading1_multiple_4">Heading1 <strong>[multiple]</strong></h3></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Free Text or
Coded</strong><br />
Type: <code>Text</code></p></td>
<td style="text-align: left;"><p>Text data type in which free text can
be entered or coding can be incorporated either in the template or at
run time.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Text That Uses Internal
Codes</strong><br />
Type: <code>Coded text</code> (<em>multiple</em>)</p></td>
<td style="text-align: left;"><p>Text data type which can use an
internal vocabulary. Each of these 'internal codes' can be bound to a
terminology code.</p></td>
<td style="text-align: left;"><ul>
<li><p>Lying</p></li>
<li><p>Reclining</p></li>
<li><p>Sitting</p></li>
<li><p>Standing</p></li>
</ul></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Text That is Sourced From an
External Terminology</strong><br />
Type: <code>Coded text</code> (<em>mandatory</em>)</p></td>
<td style="text-align: left;"><p>Text data type utilising codes derived
from an external terminology source eg a SNOMED-CT, LOINC or ICD
subset.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Quantity</strong><br />
Type: <code>Quantity</code></p></td>
<td style="text-align: left;"><p>A quantity data type used to record a
measurement associated with its' appropriate units. These are derived
from ISO standards and the Reference model enables conversion between
these units. The example shown here is length.</p></td>
<td style="text-align: left;"><p>Valid units:<br />
</p>
<ul>
<li><p>cm</p></li>
<li><p>mm</p></li>
<li><p>[in_i]</p></li>
<li><p>[ft_i]</p></li>
</ul></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Count</strong><br />
Type: <code>Count</code></p></td>
<td style="text-align: left;"><p>Count data types are composed of an
integer with no units eg for recording the number of children - in this
example the minimum is set at 0 and the maximum not specified.</p></td>
<td style="text-align: left;"><p>Range:<br />
</p>
<ul>
<li><p>&gt;= 0 and undefined undefined</p></li>
</ul></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Proportion</strong><br />
Type: <code>Proportion</code></p></td>
<td style="text-align: left;"><p>Proportion datatypes allow for ratios,
percent, fractions and proportions to be modelled.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Date/Time</strong><br />
Type: <code>Date/time</code></p></td>
<td style="text-align: left;"><p>Date/Time datatype allows recording of
a date and/or time, including partial dates such as year only or month
and year only. Allow all is the default - so all forms of date/time are
permitted.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Duration</strong><br />
Type: <code>Duration</code></p></td>
<td style="text-align: left;"><p>Duration datatype allows recording of
the duration of clinical concepts. 'Allow all time units' is the
default, although specific time units can be explicitly modelled.
Maximum and minum values can be set for each time unit.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Ordinal</strong><br />
Type: <code>Ordinal</code></p></td>
<td style="text-align: left;"><p>Ordinal datatypes pair a number and
text - in this way scores can be calculated in software, or progression
can be assessed eg if used in a pain score.</p></td>
<td style="text-align: left;"><ul>
<li><p>[0] No pain<br />
<code>local:at0038</code></p></li>
<li><p>[1] Slight pain<br />
<code>local:at0039</code></p></li>
<li><p>[2] Mild pain<br />
<code>local:at0040</code></p></li>
<li><p>[5] Moderate pain<br />
<code>local:at0041</code></p></li>
<li><p>[9] Severe pain<br />
<code>local:at0042</code></p></li>
<li><p>[10] Most severe pain imaginable<br />
<code>local:at0043</code></p></li>
</ul></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Boolean</strong><br />
Type: <code>Choice</code></p></td>
<td style="text-align: left;"><p>Boolean datatype that allows for true
or false answers.</p></td>
<td style="text-align: left;"><p><em>Multiple data types
allowed</em></p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><em>SubTypes</em></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p>Type: <code>Boolean</code></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>Type: <code>Coded text</code></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"><ul>
<li><p>no information<br />
<code>openehr:271</code></p></li>
<li><p>masked<br />
<code>openehr:272</code></p></li>
<li><p>not applicable<br />
<code>openehr:273</code></p></li>
<li><p>unknown<br />
<code>openehr:253</code></p></li>
</ul></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Any</strong><br />
Type: <code>Choice</code></p></td>
<td style="text-align: left;"><p>The datatype for this 'any' element can
be specified or constrained in a template or at run-time, but is not
explicitly modelled in the archetype.</p></td>
<td style="text-align: left;"><p><em>All data types
allowed</em></p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Choice</strong><br />
Type: <code>Choice</code></p></td>
<td style="text-align: left;"><p>Choice datatype allows for a number of
types of element to be specified simultaneously and which can
constrained or selected within a template or at run-time. In this
example, a text datatype set to Free text or Coded and another that is
constrained to Terminology record data about the same data
element.</p></td>
<td style="text-align: left;"><p><em>Multiple data types
allowed</em></p></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><em>SubTypes</em></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>Type: <code>Quantity</code></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"><p>Valid units:<br />
</p>
<ul>
<li><p>g</p></li>
<li><p>[foz_us]</p></li>
</ul></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p>Type: <code>Coded text</code></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Multimedia</strong><br />
Type: <code>Multimedia</code></p></td>
<td style="text-align: left;"><p>Multimedia datatypes allow for the
recording of many types of multimedia files to be captured. All
available types have been explicitly selected in this example.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>URI - resource
identifier</strong><br />
Type: <code>External URI</code></p></td>
<td style="text-align: left;"><p>URI datatypes allow for recording of
relationships from this data to data recorded elsewhere. These links can
be within the same EHR, or external eg to a URL.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Identifier</strong><br />
Type: <code>Identifier</code></p></td>
<td style="text-align: left;"><p>Identifier datatypes enable recording
of formal data identifiers.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>State -
Definition</strong><br />
Type: <code>Choice</code></p></td>
<td style="text-align: left;"><p>All archetypes of the OBSERVATION class
can contain a STATE model which contains information about the subject
of data at the time the information was collected, and this information
is required for safe clinical interpretation of the core information. An
example is the position of the patient at the time of measuring a blood
pressure. Datatypes are identical to those explained in the Data model,
above.</p></td>
<td style="text-align: left;"><p><em>All data types
allowed</em></p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Time</strong><br />
Type: <code>Date/time</code> (<em>mandatory</em>)</p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Protocol -
Definition</strong><br />
Type: <code>Choice</code></p></td>
<td style="text-align: left;"><p>All archetypes of the OBSERVATION class
can contain a PROTOCOL model which records information on how the
information was gathered or measured, and any other information that is
not required for safe clinical interpretation of the core Data.
Datatypes are identical to those explained in the Data model,
above.</p></td>
<td style="text-align: left;"><p><em>All data types
allowed</em></p></td>
</tr>
</tbody>
</table>

## **Service request**

Request for a health-related service or activity to be delivered by a
clinician, organisation or agency.

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 50%" />
<col style="width: 30%" />
</colgroup>
<thead>
<tr class="header">
<th style="text-align: left;">Data item</th>
<th style="text-align: left;">Description</th>
<th style="text-align: left;">Allowed values</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;"><p><strong>narrative</strong><br />
Type: <code>Text</code> (<em>mandatory</em>)</p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td colspan="3" style="text-align: left;"><h3
id="_current_activity_mandatory_multiple">Current Activity
<strong>[mandatory, multiple]</strong></h3>
<p><code>ACTIVITY: at0001</code></p></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><strong>Service name</strong><br />
Type: <code>Text</code> (<em>mandatory</em>)</p></td>
<td style="text-align: left;"><p>The name of the single service or
activity requested.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Timing</strong><br />
Type: <code>Parsable text</code> (<em>mandatory</em>)</p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
<tr class="odd">
<td
style="text-align: left;"><p><strong>Action_archetype_id</strong><br />
Type: <code>String</code> (<em>mandatory</em>)</p></td>
<td style="text-align: left;"></td>
<td
style="text-align: left;"><p><code>Unsupported RM type: STRING</code></p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>expiry_time</strong><br />
Type: <code>Date/time</code></p></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"></td>
</tr>
</tbody>
</table>

## **Procedure**

A clinical activity carried out for screening, investigative,
diagnostic, curative, therapeutic, evaluative or palliative purposes.

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 50%" />
<col style="width: 30%" />
</colgroup>
<thead>
<tr class="header">
<th style="text-align: left;">Data item</th>
<th style="text-align: left;">Description</th>
<th style="text-align: left;">Allowed values</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;"><p><strong>time</strong><br />
Type: <code>Date/time</code> (<em>mandatory</em>)</p></td>
<td style="text-align: left;"><p><code>ACTION.time</code> - Point in
time at which this action took place.</p></td>
<td style="text-align: left;"></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><strong>Procedure name</strong><br />
Type: <code>Text</code> (<em>mandatory</em>)</p></td>
<td style="text-align: left;"><p>Identification of the procedure by
name.</p></td>
<td style="text-align: left;"></td>
</tr>
</tbody>
</table>

# Archetype provenance

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th style="text-align: left;">Local archetypes</th>
<th style="text-align: left;">Archetypes published or managed
externally</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;"><p><strong>Total: 9
(100%)</strong></p></td>
<td style="text-align: left;"><p><strong>Total: 0 (%)</strong></p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>COMPOSITION.encounter.v1
EVALUATION.reason_for_encounter.v1
ADMIN_ENTRY.translation_requirements.v1 SECTION.adhoc.v1
OBSERVATION.blood_pressure.v2 CLUSTER.device.v1 OBSERVATION.demo.v1
INSTRUCTION.service_request.v1 ACTION.procedure.v1</p></td>
<td style="text-align: left;"></td>
</tr>
</tbody>
</table>
