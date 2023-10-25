# HarperDB SQL Guide

The purpose of this guide is to describe the available functionality of HarperDB as it relates to supported SQL functionality. The SQL parser is still actively being developed, many SQL features may not be optimized or utilize indexes. This document will be updated as more features and functionality becomes available. Generally, the REST interface provides a more stable, secure, and performant interface for data interaction, but the SQL functionality can be useful for administrative ad-hoc querying, and utilizing existing SQL statements.  **A high-level view of supported features can be found [here](features-matrix.md).**



HarperDB adheres to the concept of database & tables.  This allows developers to isolate table structures from each other all within one database.