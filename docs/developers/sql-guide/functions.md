{% hint style="warning" %}
Harper encourages developers to utilize other querying tools over SQL for performance purposes. Harper SQL is intended for data investigation purposes and uses cases where performance is not a priority. SQL optimizations are on our roadmap for the future.
{% endhint %}

# Harper SQL Functions

This SQL keywords reference contains the SQL functions available in Harper.

## Functions

### Aggregate

| Keyword          | Syntax                                                              | Description                                                                                                                                             |
| ---------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AVG              | AVG(_expression_)                                                   | Returns the average of a given numeric expression.                                                                                                      |
| COUNT            | SELECT COUNT(_column_name_) FROM _database.table_ WHERE _condition_ | Returns the number records that match the given criteria. Nulls are not counted.                                                                        |
| GROUP_CONCAT     | GROUP*CONCAT(\_expression*)                                         | Returns a string with concatenated values that are comma separated and that are non-null from a group. Will return null when there are non-null values. |
| MAX              | SELECT MAX(_column_name_) FROM _database.table_ WHERE _condition_   | Returns largest value in a specified column.                                                                                                            |
| MIN              | SELECT MIN(_column_name_) FROM _database.table_ WHERE _condition_   | Returns smallest value in a specified column.                                                                                                           |
| SUM              | SUM(_column_name_)                                                  | Returns the sum of the numeric values provided.                                                                                                         |
| ARRAY\*          | ARRAY(_expression_)                                                 | Returns a list of data as a field.                                                                                                                      |
| DISTINCT_ARRAY\* | DISTINCT*ARRAY(\_expression*)                                       | When placed around a standard ARRAY() function, returns a distinct (deduplicated) results set.                                                          |

\*For more information on ARRAY() and DISTINCT_ARRAY() see [this blog](https://www.harperdb.io/post/sql-queries-to-complex-objects).

### Conversion

| Keyword | Syntax                                          | Description                                                            |
| ------- | ----------------------------------------------- | ---------------------------------------------------------------------- |
| CAST    | CAST(_expression AS datatype(length)_)          | Converts a value to a specified datatype.                              |
| CONVERT | CONVERT(_data_type(length), expression, style_) | Converts a value from one datatype to a different, specified datatype. |

### Date & Time

| Keyword           | Syntax            | Description                                                                                                           |
| ----------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| CURRENT_DATE      | CURRENT_DATE()    | Returns the current date in UTC in “YYYY-MM-DD” String format.                                                        |
| CURRENT_TIME      | CURRENT_TIME()    | Returns the current time in UTC in “HH:mm:ss.SSS” string format.                                                      |
| CURRENT_TIMESTAMP | CURRENT_TIMESTAMP | Referencing this variable will evaluate as the current Unix Timestamp in milliseconds. For more information, go here. |

|
| DATE | DATE([_date_string_]) | Formats and returns the date*string argument in UTC in ‘YYYY-MM-DDTHH:mm:ss.SSSZZ’ string format. If a date_string is not provided, the function will return the current UTC date/time value in the return format defined above. For more information, go here. |
|
| DATE_ADD | DATE_ADD(\_date, value, interval*) | Adds the defined amount of time to the date provided in UTC and returns the resulting Unix Timestamp in milliseconds. Accepted interval values: Either string value (key or shorthand) can be passed as the interval argument. For more information, go here. |
|
| DATE*DIFF | DATEDIFF(\_date_1, date_2[, interval]*) | Returns the difference between the two date values passed based on the interval as a Number. If an interval is not provided, the function will return the difference value in milliseconds. For more information, go here. |
|
| DATE*FORMAT | DATE_FORMAT(\_date, format*) | Formats and returns a date value in the String format provided. Find more details on accepted format values in the moment.js docs. For more information, go here. |
|
| DATE*SUB | DATE_SUB(\_date, format*) | Subtracts the defined amount of time from the date provided in UTC and returns the resulting Unix Timestamp in milliseconds. Accepted date*sub interval values- Either string value (key or shorthand) can be passed as the interval argument. For more information, go here. |
|
| DAY | DAY(\_date*) | Return the day of the month for the given date. |
|
| DAYOFWEEK | DAYOFWEEK(_date_) | Returns the numeric value of the weekday of the date given(“YYYY-MM-DD”).NOTE: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, and 6=Saturday. |
| EXTRACT | EXTRACT(_date, date_part_) | Extracts and returns the date*part requested as a String value. Accepted date_part values below show value returned for date = “2020-03-26T15:13:02.041+000” For more information, go here. |
|
| GETDATE | GETDATE() | Returns the current Unix Timestamp in milliseconds. |
| GET_SERVER_TIME | GET_SERVER_TIME() | Returns the current date/time value based on the server’s timezone in `YYYY-MM-DDTHH:mm:ss.SSSZZ` String format. |
| OFFSET_UTC | OFFSET_UTC(\_date, offset*) | Returns the UTC date time value with the offset provided included in the return String value formatted as `YYYY-MM-DDTHH:mm:ss.SSSZZ`. The offset argument will be added as minutes unless the value is less than 16 and greater than -16, in which case it will be treated as hours. |
| NOW | NOW() | Returns the current Unix Timestamp in milliseconds. |
|
| HOUR | HOUR(_datetime_) | Returns the hour part of a given date in range of 0 to 838. |
|
| MINUTE | MINUTE(_datetime_) | Returns the minute part of a time/datetime in range of 0 to 59. |
|
| MONTH | MONTH(_date_) | Returns month part for a specified date in range of 1 to 12. |
|
| SECOND | SECOND(_datetime_) | Returns the seconds part of a time/datetime in range of 0 to 59. |
| YEAR | YEAR(_date_) | Returns the year part for a specified date. |
|

### Logical

| Keyword | Syntax                                          | Description                                                                                |
| ------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------ |
| IF      | IF(_condition, value_if_true, value_if_false_)  | Returns a value if the condition is true, or another value if the condition is false.      |
| IIF     | IIF(_condition, value_if_true, value_if_false_) | Returns a value if the condition is true, or another value if the condition is false.      |
| IFNULL  | IFNULL(_expression, alt_value_)                 | Returns a specified value if the expression is null.                                       |
| NULLIF  | NULLIF(_expression_1, expression_2_)            | Returns null if expression_1 is equal to expression_2, if not equal, returns expression_1. |

### Mathematical

| Keyword | Syntax                         | Description                                                                                         |
| ------- | ------------------------------ | --------------------------------------------------------------------------------------------------- |
| ABS     | ABS(_expression_)              | Returns the absolute value of a given numeric expression.                                           |
| CEIL    | CEIL(_number_)                 | Returns integer ceiling, the smallest integer value that is bigger than or equal to a given number. |
| EXP     | EXP(_number_)                  | Returns e to the power of a specified number.                                                       |
| FLOOR   | FLOOR(_number_)                | Returns the largest integer value that is smaller than, or equal to, a given number.                |
| RANDOM  | RANDOM(_seed_)                 | Returns a pseudo random number.                                                                     |
| ROUND   | ROUND(_number,decimal_places_) | Rounds a given number to a specified number of decimal places.                                      |
| SQRT    | SQRT(_expression_)             | Returns the square root of an expression.                                                           |

### String

| Keyword     | Syntax                                                                                | Description                                                                                                                                                              |
| ----------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| CONCAT      | CONCAT(_string_1, string_2, ...., string_n_)                                          | Concatenates, or joins, two or more strings together, resulting in a single string.                                                                                      |
| CONCAT_WS   | CONCAT*WS(\_separator, string_1, string_2, ...., string_n*)                           | Concatenates, or joins, two or more strings together with a separator, resulting in a single string.                                                                     |
| INSTR       | INSTR(_string_1, string_2_)                                                           | Returns the first position, as an integer, of string_2 within string_1.                                                                                                  |
| LEN         | LEN(_string_)                                                                         | Returns the length of a string.                                                                                                                                          |
| LOWER       | LOWER(_string_)                                                                       | Converts a string to lower-case.                                                                                                                                         |
| REGEXP      | SELECT _column_name_ FROM _database.table_ WHERE _column_name_ REGEXP _pattern_       | Searches column for matching string against a given regular expression pattern, provided as a string, and returns all matches. If no matches are found, it returns null. |
| REGEXP_LIKE | SELECT _column_name_ FROM _database.table_ WHERE REGEXP*LIKE(\_column_name, pattern*) | Searches column for matching string against a given regular expression pattern, provided as a string, and returns all matches. If no matches are found, it returns null. |
| REPLACE     | REPLACE(_string, old_string, new_string_)                                             | Replaces all instances of old_string within new_string, with string.                                                                                                     |
| SUBSTRING   | SUBSTRING(_string, string_position, length_of_substring_)                             | Extracts a specified amount of characters from a string.                                                                                                                 |
| TRIM        | TRIM([_character(s) FROM_] _string_)                                                  | Removes leading and trailing spaces, or specified character(s), from a string.                                                                                           |
| UPPER       | UPPER(_string_)                                                                       | Converts a string to upper-case.                                                                                                                                         |

## Operators

### Logical Operators

| Keyword | Syntax                                                                                            | Description                                                               |
| ------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| BETWEEN | SELECT _column_name(s)_ FROM _database.table_ WHERE _column_name_ BETWEEN _value_1_ AND _value_2_ | (inclusive) Returns values(numbers, text, or dates) within a given range. |
| IN      | SELECT _column_name(s)_ FROM _database.table_ WHERE _column_name_ IN(_value(s)_)                  | Used to specify multiple values in a WHERE clause.                        |
| LIKE    | SELECT _column_name(s)_ FROM _database.table_ WHERE _column_n_ LIKE _pattern_                     | Searches for a specified pattern within a WHERE clause.                   |

## Queries

### General

| Keyword  | Syntax                                                                                                                                 | Description                                                                         |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| DISTINCT | SELECT DISTINCT _column_name(s)_ FROM _database.table_                                                                                 | Returns only unique values, eliminating duplicate records.                          |
| FROM     | FROM _database.table_                                                                                                                  | Used to list the database(s), table(s), and any joins required for a SQL statement. |
| GROUP BY | SELECT _column_name(s)_ FROM _database.table_ WHERE _condition_ GROUP BY _column_name(s)_ ORDER BY _column_name(s)_                    | Groups rows that have the same values into summary rows.                            |
| HAVING   | SELECT _column_name(s)_ FROM _database.table_ WHERE _condition_ GROUP BY _column_name(s)_ HAVING _condition_ ORDER BY _column_name(s)_ | Filters data based on a group or aggregate function.                                |
| SELECT   | SELECT _column_name(s)_ FROM _database.table_                                                                                          | Selects data from table.                                                            |
| WHERE    | SELECT _column_name(s)_ FROM _database.table_ WHERE _condition_                                                                        | Extracts records based on a defined condition.                                      |

### Joins

| Keyword            | Syntax                                                                                                                                                | Description                                                                                                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CROSS JOIN         | SELECT _column_name(s)_ FROM _database.table_1_ CROSS JOIN _database.table_2_                                                                         | Returns a paired combination of each row from _table_1_ with row from _table_2_. _Note: CROSS JOIN can return very large result sets and is generally considered bad practice._ |
| FULL OUTER         | SELECT _column_name(s)_ FROM _database.table_1_ FULL OUTER JOIN _database.table_2_ ON _table_1.column_name_ _= table_2.column_name_ WHERE _condition_ | Returns all records when there is a match in either _table_1_ (left table) or _table_2_ (right table).                                                                          |
| [INNER] JOIN       | SELECT _column_name(s)_ FROM _database.table_1_ INNER JOIN _database.table_2_ ON _table_1.column_name_ _= table_2.column_name_                        | Return only matching records from _table_1_ (left table) and _table_2_ (right table). The INNER keyword is optional and does not affect the result.                             |
| LEFT [OUTER] JOIN  | SELECT _column_name(s)_ FROM _database.table_1_ LEFT OUTER JOIN _database.table_2_ ON _table_1.column_name_ _= table_2.column_name_                   | Return all records from _table_1_ (left table) and matching data from _table_2_ (right table). The OUTER keyword is optional and does not affect the result.                    |
| RIGHT [OUTER] JOIN | SELECT _column_name(s)_ FROM _database.table_1_ RIGHT OUTER JOIN _database.table_2_ ON _table_1.column_name = table_2.column_name_                    | Return all records from _table_2_ (right table) and matching data from _table_1_ (left table). The OUTER keyword is optional and does not affect the result.                    |

### Predicates

| Keyword     | Syntax                                                                        | Description                |
| ----------- | ----------------------------------------------------------------------------- | -------------------------- |
| IS NOT NULL | SELECT _column_name(s)_ FROM _database.table_ WHERE _column_name_ IS NOT NULL | Tests for non-null values. |
| IS NULL     | SELECT _column_name(s)_ FROM _database.table_ WHERE _column_name_ IS NULL     | Tests for null values.     |

### Statements

| Keyword | Syntax                                                                                        | Description                         |
| ------- | --------------------------------------------------------------------------------------------- | ----------------------------------- |
| DELETE  | DELETE FROM _database.table_ WHERE condition                                                  | Deletes existing data from a table. |
| INSERT  | INSERT INTO _database.table(column_name(s))_ VALUES(_value(s)_)                               | Inserts new records into a table.   |
| UPDATE  | UPDATE _database.table_ SET _column_1 = value_1, column_2 = value_2, ....,_ WHERE _condition_ | Alters existing records in a table. |
