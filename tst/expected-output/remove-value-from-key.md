---
tags:
    - value1
    - value2
    - value3
title: delete-value-from-key
bad: null
bad list:
    - value4
---
Testing file for deleting values from keys

When done, the yaml should look like this:
```
---
tags: [value1, value2, value3]
title: delete-value-from-key
bad:
bad list: [value4]
---
```