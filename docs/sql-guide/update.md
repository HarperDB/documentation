# Update

HarperDB supports updating existing table row(s) via UPDATE statements. Multiple conditions can be applied to filter the row(s) to update. At this time selecting from one table to update another is not supported.



```bash
UPDATE dev.dog
    SET owner_name = 'Kyle'
    WHERE id IN (1, 2)
```
