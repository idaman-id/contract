# REST Contract

## Specification
### Code
|Type|Value|Description  |
|--|--|--|
|string| 200 | Success response with zero exit code |
|string| 400 | General error response code |
|...| ... | ... |


### Status
|Type|Value|Description  |
|--|--|--|
|string| SUCCESS| Success response with zero exit code |
|string| ERROR| General error response |
|string| INVALID_DATA | General invalid data provided by client |
|string| NOT_FOUND | General not found resources (endpoint, data, etc) |
|string| FORBIDDEN | General forbidden access to protected resources |
|string| UNAUTHENTICATE | General unauthenticate access to protected resources |
|string| REQUEST_TIMEOUT | Network request timeout |
|string| BAD_GATEWAY | Failed connect to host |
|...| ... | ... |

### Message
|Type|Value|Description  |
|--|--|--|
|string| [contextual action] | Single string represented |

### Error
|Type|Value|Description  |
|--|--|--|
|array| [multiple value] | Multiple error |
|object| [single value] | Single error |
|...| ... | ... |

### Data
|Type|Value|Description  |
|--|--|--|
|object| [single value] | Single resource |
|array| [multiple value] | Multiple resource |
|...| ... | ... |

## Example
### Success Response
```json
{
	"code": "200",
	"status": "SUCCESS",
	"message": "ping success",
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
	"message": "error orccured",
	"error": {
		"code": "S102",
		"message": "Specified error case provided by application"
	}
}
```

### Invalid data Response
```json
{
	"code": "422",
	"status": "INVALID_DATA",
	"message": "invalid data",
	"error": [
		{
			"message": "Username is already used",
			"field": "username"
		}
	]
}
```

## Author
- [Raka Suryaardi Widjaja](https://gitlab.com/kokoraka "Raka Suryaardi Widjaja")
- You're the next contributor?