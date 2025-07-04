{% hint style="warning" %}
Harper encourages developers to utilize other querying tools over SQL for performance purposes. Harper SQL is intended for data investigation purposes and uses cases where performance is not a priority. SQL optimizations are on our roadmap for the future.
{% endhint %}

# Harper SQL Reserved Words

This is a list of reserved words in the SQL Parser. Use of these words or symbols may result in unexpected behavior or inaccessible tables/attributes. If any of these words must be used, any SQL call referencing a database, table, or attribute must have backticks (`…`) or brackets ([…]) around the variable.

For Example, for a table called `ASSERT` in the `data` database, a SQL select on that table would look like:

```
SELECT * from data.`ASSERT`
```

Alternatively:

```
SELECT * from data.[ASSERT]
```

### RESERVED WORD LIST

- ABSOLUTE
- ACTION
- ADD
- AGGR
- ALL
- ALTER
- AND
- ANTI
- ANY
- APPLY
- ARRAY
- AS
- ASSERT
- ASC
- ATTACH
- AUTOINCREMENT
- AUTO_INCREMENT
- AVG
- BEGIN
- BETWEEN
- BREAK
- BY
- CALL
- CASE
- CAST
- CHECK
- CLASS
- CLOSE
- COLLATE
- COLUMN
- COLUMNS
- COMMIT
- CONSTRAINT
- CONTENT
- CONTINUE
- CONVERT
- CORRESPONDING
- COUNT
- CREATE
- CROSS
- CUBE
- CURRENT_TIMESTAMP
- CURSOR
- DATABASE
- DECLARE
- DEFAULT
- DELETE
- DELETED
- DESC
- DETACH
- DISTINCT
- DOUBLEPRECISION
- DROP
- ECHO
- EDGE
- END
- ENUM
- ELSE
- EXCEPT
- EXISTS
- EXPLAIN
- FALSE
- FETCH
- FIRST
- FOREIGN
- FROM
- GO
- GRAPH
- GROUP
- GROUPING
- HAVING
- HDB_HASH
- HELP
- IF
- IDENTITY
- IS
- IN
- INDEX
- INNER
- INSERT
- INSERTED
- INTERSECT
- INTO
- JOIN
- KEY
- LAST
- LET
- LEFT
- LIKE
- LIMIT
- LOOP
- MATCHED
- MATRIX
- MAX
- MERGE
- MIN
- MINUS
- MODIFY
- NATURAL
- NEXT
- NEW
- NOCASE
- NO
- NOT
- NULL
- OFF
- ON
- ONLY
- OFFSET
- OPEN
- OPTION
- OR
- ORDER
- OUTER
- OVER
- PATH
- PARTITION
- PERCENT
- PLAN
- PRIMARY
- PRINT
- PRIOR
- QUERY
- READ
- RECORDSET
- REDUCE
- REFERENCES
- RELATIVE
- REPLACE
- REMOVE
- RENAME
- REQUIRE
- RESTORE
- RETURN
- RETURNS
- RIGHT
- ROLLBACK
- ROLLUP
- ROW
- SCHEMA
- SCHEMAS
- SEARCH
- SELECT
- SEMI
- SET
- SETS
- SHOW
- SOME
- SOURCE
- STRATEGY
- STORE
- SYSTEM
- SUM
- TABLE
- TABLES
- TARGET
- TEMP
- TEMPORARY
- TEXTSTRING
- THEN
- TIMEOUT
- TO
- TOP
- TRAN
- TRANSACTION
- TRIGGER
- TRUE
- TRUNCATE
- UNION
- UNIQUE
- UPDATE
- USE
- USING
- VALUE
- VERTEX
- VIEW
- WHEN
- WHERE
- WHILE
- WITH
- WORK
