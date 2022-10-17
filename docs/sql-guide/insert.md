# Insert

HarperDB supports inserting 1 to n records into a table.  The only constraint is the hash_attribute must be defined and supplied a unique value per row. HarperDB does not support selecting from one table to insert into another at this time.



```bash
INSERT INTO dev.dog (id, dog_name, age, breed_id)
  VALUES(1, 'Penny', 5, 347), (2, 'Kato', 4, 347)
```