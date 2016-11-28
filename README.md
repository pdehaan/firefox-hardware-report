# Firefox Hardware Survey
The Firefox Hardware Survey is a public report of the hardware used by a representative sample of the population from Firefox's release channel. Firefox collects raw, anonymous data that comes from users who have not disabled the Firefox Health Report feature in their browser. We use this data to prioritize development efforts and to power this survey. This survey aims to help game developers understand what hardware configurations their titles might want to target. This repo contains the code for the Firefox Hardware Survey.

[https://metrics.mozilla.com/firefox-hardware-survey/](metrics.mozilla.com/firefox-hardware-survey)

# How is the survey created?
Firefox collects information about your hardware and operating system configuration and sends it to us roughly daily. This raw data is processed to remove corrupted or inaccurate entries and is then aggregated. This aggregation anonymizes the data, removing indicators that might be used to identify individual users.

During the aggregation step, less common screen resolutions and OS versions are handled as special cases—resolutions are rounded to the nearest hundred and version numbers are collapsed together in a generic group. Any reported configurations that account for less than 1% of the data are grouped together in an Other bucket. At the end of the process, the aggregated, anonymized data is exported to a public JSON file and published on the Mozilla Games Website. For further details about our data retention policies, please refer to our [data policy](https://www.mozilla.org/en-US/privacy/).

# About us
Andre Vrignaud — Product manager

[Rebecca Weiss](https://github.com/rjweiss) — Data

[Alessio Placitelli](https://github.com/Dexterp37) — Data engineering

[Ali Almossawi](https://github.com/almossawi) — Data visualization
