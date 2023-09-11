# `localStudio`

The `localStudio` section configures the local HarperDB Studio, a simplified GUI for HarperDB hosted on the server. A more comprehensive GUI is hosted by HarperDB at https://studio.harperdb.io. Note, all database traffic from either `localStudio` or HarperDB Studio is made directly from your browser to the instance.

`enabled` - _Type_: boolean; _Default_: false

Enabled the local studio or not.

```yaml
localStudio:
  enabled: false
```