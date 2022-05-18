## Response

### Methods

- `redirect(destination, code)` to redirect the incoming request
- `code(code)` to modify the status code of the response
- `header(name, value)` to set a valid HTTP header
- `cookie(name, value, config)` to add a cookie
- `json(data)` to set the body of the response *(json object)*
- `text(data)` to set the body of the response *(string)*

### Easter Egg

> You won't ever need to use the `code()` method, alternatively you can just return a JSON object which includes the code. darkflare will then use this code for the status code of the response.

```typescript
import type { Handler } from 'darkflare'

export const Get: Handler = async () => {
  return {
    code: 500, // this will set the status code (and will also be included in the response body)
    message: 'Something Went Wrong'
  }
}
```
