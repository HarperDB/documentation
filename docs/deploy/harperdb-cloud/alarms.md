# Alarms

HarperDB Cloud instance alarms are triggered when certain conditions are met. Once alarms are triggered organization owners will immediately receive an email alert and the alert will be available on the [Instance Configuration](../../admin/harperdb-studio/instance-configuration.md) page. The below table describes each alert and their evaluation metrics.

### Heading Definitions

* **Alarm**: Title of the alarm.
* **Threshold**: Definition of the alarm threshold.
* **Intervals**: The number of occurrences before an alarm is triggered and the period that the metric is evaluated over.
* **Proposed Remedy**: Recommended solution to avoid the alert in the future.

| Alarm   | Threshold  | Intervals | Proposed Remedy                                                                                                         |
| ------- | ---------- | --------- | ----------------------------------------------------------------------------------------------------------------------- |
| Storage | > 90% Disk | 1 x 5min  | [Increased storage volume](../../admin/harperdb-studio/instance-configuration.md#update-instance-storage)               |
| CPU     | > 90% Avg  | 2 x 5min  | [Increase instance size for additional CPUs](../../admin/harperdb-studio/instance-configuration.md#update-instance-ram) |
| Memory  | > 90% RAM  | 2 x 5min  | [Increase instance size](../../admin/harperdb-studio/instance-configuration.md#update-instance-ram)                     |
