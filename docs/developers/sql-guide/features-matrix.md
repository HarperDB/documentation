# SQL Features Matrix

{% hint style="warning" %}
Harper encourages developers to utilize other querying tools over SQL for performance purposes. Harper SQL is intended for data investigation purposes and uses cases where performance is not a priority. SQL optimizations are on our roadmap for the future.
{% endhint %}

## SQL Features Matrix

Harper provides access to most SQL functions, and we’re always expanding that list. Check below to see if we cover what you need.

| INSERT                             |     |
| ---------------------------------- | --- |
| Values - multiple values supported | ✔  |
| Sub-SELECT                         | ✗   |

| UPDATE           |     |
| ---------------- | --- |
| SET              | ✔  |
| Sub-SELECT       | ✗   |
| Conditions       | ✔  |
| Date Functions\* | ✔  |
| Math Functions   | ✔  |

| DELETE     |     |
| ---------- | --- |
| FROM       | ✔  |
| Sub-SELECT | ✗   |
| Conditions | ✔  |

| SELECT               |     |
| -------------------- | --- |
| Column SELECT        | ✔  |
| Aliases              | ✔  |
| Aggregator Functions | ✔  |
| Date Functions\*     | ✔  |
| Math Functions       | ✔  |
| Constant Values      | ✔  |
| Distinct             | ✔  |
| Sub-SELECT           | ✗   |

| FROM             |     |
| ---------------- | --- |
| Multi-table JOIN | ✔  |
| INNER JOIN       | ✔  |
| LEFT OUTER JOIN  | ✔  |
| LEFT INNER JOIN  | ✔  |
| RIGHT OUTER JOIN | ✔  |
| RIGHT INNER JOIN | ✔  |
| FULL JOIN        | ✔  |
| UNION            | ✗   |
| Sub-SELECT       | ✗   |
| TOP              | ✔  |

| WHERE                      |     |
| -------------------------- | --- |
| Multi-Conditions           | ✔  |
| Wildcards                  | ✔  |
| IN                         | ✔  |
| LIKE                       | ✔  |
| Bit-wise Operators AND, OR | ✔  |
| Bit-wise Operators NOT     | ✔  |
| NULL                       | ✔  |
| BETWEEN                    | ✔  |
| EXISTS,ANY,ALL             | ✔  |
| Compare columns            | ✔  |
| Compare constants          | ✔  |
| Date Functions\*           | ✔  |
| Math Functions             | ✔  |
| Sub-SELECT                 | ✗   |

| GROUP BY              |     |
| --------------------- | --- |
| Multi-Column GROUP BY | ✔  |

| HAVING                        |     |
| ----------------------------- | --- |
| Aggregate function conditions | ✔  |

| ORDER BY              |     |
| --------------------- | --- |
| Multi-Column ORDER BY | ✔  |
| Aliases               | ✔  |
| Date Functions\*      | ✔  |
| Math Functions        | ✔  |
