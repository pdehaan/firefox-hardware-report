To Deploy
=========
The Spark job will automatically fetch the previous state from S3, append the new data to it,
and upload it back.

Weekly aggregation
------------------

1. Log in to Telemetry Self-Serve Data Analysis
2. Click 'Schedule a Spark Job'
3. Edit or create a job with the following parameters:
    Job Name:              firefox-hw-survey-weekly
    Notebook or Jar:       summarize_json.ipynb
    Spark Submission Args: N/A
    Cluster Size:          5
    Output Visibility:     Public
    Schedule Frequency:    Weekly
    Day of Week:           N/A (Sunday)
    Day of Month:          N/A (1)
    Time of Day (UTC):     4am
    Job Timeout (minutes): 300
 