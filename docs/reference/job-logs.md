# Job Logs

HarperDB maintains a log of jobs that have been started through the system. Log messages can be used for diagnostics and auditing purposes. The job logs are maintained via a HarperDB system table. Job logs can be accessed via the `get_job` and `search_jobs_by_start_date` operations.

## Job Log Metadata

When a job is kicked off the following metadata items are tracked in the job log:

* **id**: A GUID generated to identify the job. This will be returned in the response of the operation that initially kicked off the job.

* **user**: The username of the HarperDB user who kicked off the job.

* **type**: The type of job. For example, csv_data_load.

* **status**: The status of the job. Values include: IN_PROGRESS, COMPLETE, and ERROR.

* **start_datetime**: The time the job started in [Unix Epoch with milliseconds format](https://www.epochconverter.com/).

* **end_datetime**: The time the job completed in [Unix Epoch with milliseconds format](https://www.epochconverter.com/).

* **job_body**: The body of the job, if applicable.

* **message**: Message associated with the job, including confirmation, error, and/or other details.

* **created_datetime**: The time the job was received in [Unix Epoch with milliseconds format](https://www.epochconverter.com/).

* **\_\_createdtime__**: The time the job database record was created in [Unix Epoch with milliseconds format](https://www.epochconverter.com/).

* **\_\_updatedtime__**: The time the job database record was updated in [Unix Epoch with milliseconds format](https://www.epochconverter.com/).

## Example Job Log Message

```json
{
    "id": "59f9cd79-08c1-4154-84fc-86289306b5ee",
    "user": "HDB_ADMIN",
    "type": "csv_data_load",
    "status": "COMPLETE",
    "start_datetime": 1607031575775,
    "end_datetime": 1607031577379,
    "job_body": null,
    "message": "successfully loaded 350 of 350 records",
    "created_datetime": 1607031575760,
    "__createdtime__": 1607031575764,
    "__updatedtime__": 1607031577379,
    "start_datetime_converted": "2020-12-03T21:39:35.775Z",
    "end_datetime_converted": "2020-12-03T21:39:37.379Z"
}
```