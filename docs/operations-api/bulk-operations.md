# Bulk Operations 


## CSV Data Load
Ingests CSV data, provided directly in the operation, as an insert, update, or upsert into the specified database table.

<ul>

<li><b>operation </b><i>(required)</i> - must always be csv_data_load</li>

<li><b>action </b><i>(optional)</i> - type of action you want to perform - 'insert', 'update', or 'upsert'. The default is 'insert'.</li>

<li><b>schema</b><i> (required)</i> - name of the schema where you are loading your data </li>

<li><b>table </b><i>(required)</i> - name of the table where you are loading your data</li>

<li><b>data</b><i> (required)</i> - csv data to import into HarperDB </li>

### Body

```json
{
    "operation": "csv_data_load",
    "schema": "dev",
    "action": "insert",
    "table": "breed",
    "data": "id,name,section,country,image\n1,ENGLISH POINTER,British and Irish Pointers and Setters,GREAT BRITAIN,http://www.fci.be/Nomenclature/Illustrations/001g07.jpg\n2,ENGLISH SETTER,British and Irish Pointers and Setters,GREAT BRITAIN,http://www.fci.be/Nomenclature/Illustrations/002g07.jpg\n3,KERRY BLUE TERRIER,Large and medium sized Terriers,IRELAND,\n"
}
```

### Response: 200
```json
{
    "message": "Starting job with id 2fe25039-566e-4670-8bb3-2db3d4e07e69"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## CSV File Load
Ingests CSV data, provided via a path on the local filesystem, as an insert, update, or upsert into the specified database table. *Note: The CSV file must reside on the same machine on which HarperDB is running. For example, the path to a CSV on your computer will produce an error if your HarperDB instance is a cloud instance.*

<ul>

<li><b>operation </b><i>(required)</i> - must always be csv_file_load</li>

<li><b>action </b><i>(optional)</i> - type of action you want to perform - 'insert', 'update', or 'upsert'. The default is 'insert'.</li>

<li><b>schema</b><i> (required)</i> - name of the schema where you are loading your data </li>

<li><b>table </b><i>(required)</i> - name of the table where you are loading your data</li>

<li><b>file_path</b><i> (required)</i> - path to the csv file on the host running harperdb</li>

### Body

```json
{
    "operation": "csv_file_load",
    "action": "insert",
    "schema": "dev",
    "table": "breed",
    "file_path": "/home/user/imports/breeds.csv"
}
```

### Response: 200
```json
{
    "message": "Starting job with id 3994d8e2-ec6a-43c4-8563-11c1df81870e"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## CSV URL Load
Ingests CSV data, provided via URL, as an insert, update, or upsert into the specified database table.

<ul>

<li><b>operation </b><i>(required)</i> - must always be csv_url_load</li>

<li><b>action </b><i>(optional)</i> - type of action you want to perform - 'insert', 'update', or 'upsert'. The default is 'insert'.</li>

<li><b>schema</b><i> (required)</i> - name of the schema where you are loading your data </li>

<li><b>table </b><i>(required)</i> - name of the table where you are loading your data</li>

<li><b>csv_url</b><i> (required)</i> - URL to the csv </li>

### Body

```json
{
    "operation": "csv_url_load",
    "action": "insert",
    "schema": "dev",
    "table": "breed",
    "csv_url": "https://s3.amazonaws.com/complimentarydata/breeds.csv"
}
```

### Response: 200
```json
{
    "message": "Starting job with id 332aa0a2-6833-46cd-88a6-ae375920436a"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Import from S3
This operation allows users to import CSV or JSON files from an AWS S3 bucket as an insert, update, or upsert.

<ul><li><p><b>operation </b><i>(required)</i> - must always be import_from_s3</p></li><li><p><b>action </b><i>(optional)</i> - type of action you want to perform - 'insert', 'update', or 'upsert'. The default is 'insert'.</p></li><li><p><b>schema</b><i> (required)</i> - name of the schema where you are loading your data</p></li><li><p><b>table </b><i>(required)</i> - name of the table where you are loading your data</p></li><li><p><b>s3</b><i> (required)</i> - object containing required AWS S3 bucket infor for operation<br></p><ul><li><p><b>aws_access_key_id</b> - AWS access key for authenticating into your S3 bucket</p></li><li><p><b>aws_secret_access_key</b> - AWS secret for authenticating into your S3 bucket</p></li><li><p><b>bucket</b> - AWS S3 bucket to import from</p></li><li><p><b>key</b> - the name of the file to import - <i>the file must include a valid file extension ('.csv' or '.json')</i></p></li><li><p><b>region</b> - the region of the bucket</p></li></ul></li></ul>

### Body

```json
{
    "operation": "import_from_s3",
    "action": "insert",
    "schema": "dev",
    "table": "dog",
    "s3": {
        "aws_access_key_id": "YOUR_KEY",
        "aws_secret_access_key": "YOUR_SECRET_KEY",
        "bucket": "BUCKET_NAME",
        "key": "OBJECT_NAME",
        "region": "BUCKET_REGION"
    }
}
```

### Response: 200
```json
{
    "message": "Starting job with id 062a1892-6a0a-4282-9791-0f4c93b12e16"
}
```

