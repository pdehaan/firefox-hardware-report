# Firefox Hardware Report
The [Firefox Hardware Report](https://hardware.metrics.mozilla.com) is a public monthly report of the hardware used by a representative sample of the population from Firefox's release channel on desktop. This information can be used by developers to improve the Firefox experience for users. This repo contains the code for the Firefox Hardware Survey.

# How is the report created?
The data for this report comes from Firefox’s built-in Telemetry data system. Firefox automatically collects information about desktop hardware and operating system configurations and sends this to Mozilla roughly daily, unless users disable this collection. This raw data is processed to remove corrupted or inaccurate entries and is then aggregated. This aggregation anonymizes the data, removing indicators that might be used to identify individual users.

During the aggregation step, less common screen resolutions and OS versions are handled as special cases—resolutions are rounded to the nearest hundred and version numbers are collapsed together in a generic group. Any reported configurations that account for less than 1% of the data are grouped together in an “Other” bucket. At the end of the process, the aggregated, anonymized data is exported to a public JSON file and published on the Mozilla Metrics website.

# Helpful links
* [Data file format](https://github.com/mozilla/firefox-hardware-report/blob/master/report/format.md)

# About us

[Andre Vrignaud](https://github.com/avrignaud) — Product manager

[Rebecca Weiss](https://github.com/rjweiss) — Data

[Frank Bertsch](https://github.com/fbertsch) - Data engineering

[John Karahalis](https://github.com/openjck) - Web development
