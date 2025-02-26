---
tags:
    - value1
    - value2
    - value3
fake flag: update-flag
title: update-or-create-new-key-value-from-key
update me: update-value
---
Testing file for updating (or creating if not present) key/values if a key exists
In this case, no `update-flag` is present in `tags` so nothing should be updated or created

When done, the yaml should look like this:
```
---
tags: [value1, value2, value3]
fake flag: update-flag
title: update-or-create-new-key-value-from-key
update me: update-value
---
```