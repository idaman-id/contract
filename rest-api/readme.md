# REST Contract 😇

🤩 Motivations
---
1. Write API specification clearly
2. Standarize REST API response for internal use 

🖖 Index
---
```md
|-- Rest Contract
|  |-- [Specification](#specification)
|  |-- [Example](#example)
|  |-- [Author](#author)
```

🧾 Specification
---
### Code
|Type|Value|Description  |
|--|--|--|
|string| 200 | Success response |
|string| 400 | General error response code |
|string| 422 | Invalid data response code |

Example:
```json
{
  "code": "200"
}
```

### Message
|Type|Value|Description  |
|--|--|--|
|string| [contextual message] | Single string represented |
Example:
```json
{
  "message": "Success retrieve resource"
}
```

### Data
|Type|Value|Description  |
|--|--|--|
|object| [single value] | Single resource |
|array| [multiple value] | Multiple resource |

Example:
```json
/** object **/
{
  "data": {
    "id": "id",
    "name": "name"
  }
}

/** array **/
{
  "data": [
    {
      "id": "id",
      "name": "name"
    }
  ]
}
```

### Error
#### Validation Error
|Type|Value|Description  |
|--|--|--|
|array| [validation-type] | Multiple invalid data error |

Example:
```json
{
  "validation_errors": [
    {
      "field": "name",
      "message": "Invalid value"
    }
  ]
}
```

---

📋 Example
---
### Success Response
```json
{
	"code": "200",
	"message": "ok",
	"data": {
		"name": "service-name",
		"version": "1.0"
	}
}
```

### General error Response
```json
{
	"code": "400",
	"status": "ERROR",
	"message": "error orccured"
}
```

### Invalid data Response
```json
{
	"code": "422",
	"status": "INVALID_DATA",
	"message": "invalid data",
	"validation_errors": [
    {
      "field": "username",
			"message": "Username is already used"
		}
	]
}
```
