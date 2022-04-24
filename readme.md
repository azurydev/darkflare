## darkflare

⚡ **A highly opinionated TypeScript framework for Cloudflare Workers.**

### Setup

1. Install darkflare using your favorite package manager.

    ```sh-session
    npm i darkflare
    ```

2. Add a build script to your `package.json` file.

    ```json
    "build": "darkflare"
    ```

3. Add a `darkflare.json` file to the root of your project.
    
    ```json
    {
      "base": "/api",
      "origin": "*"
    }
    ```
    
4. Add a new `routes` folder into your `src` folder.
5. Add a new route, e.g. `[id].ts` or `hello-world.ts`

    ```typescript
    import { Handler } from 'darkflare'
    
    export default {
      get: async () => {
        return 'Hello World'
      }
    } as Handler
   ```
   
### Routing

**darkflare's** routing is pretty similar to [the way Next.js does](https://nextjs.org/docs/routing/introduction). Instead of the `pages` directory, **darkflare** uses the `routes` directory.
  
### Request

- `query` - a parsed object of the request query
- `params` - a parsed object of the request params
- `headers` - a parsed object of the request headers
- `cookies` - a parsed object of cookies
- `body` - a parsed object of the request body
- `raw` - the incoming `Request` object
- [`...more`](https://developers.cloudflare.com/workers/runtime-apis/request/#incomingrequestcfproperties)

### Protected Routes

Add the routes which should be protected to your `darkflare.json` config.

```json
"protect": {
  "strict": ["/protect/strictly"],
  "flexible": ["/protect/maybe/:id", "/and/not/for/sure"]
}
```

-> **strict** = must return no json object/string  
-> **flexible** = can or cannot return a json object/string

Add a `hooks` directory in your `src` directory. Create a new file called `preValidate.ts` in this folder.

```typescript
import { Hook } from 'darkflare'

const preValidation: Hook = async (req, res) => {
  // restrict access to users from Germany
  if (req.country !== 'DE') return {
    code: 403,
    message: 'Access Denied'
  }

  // add some data to the request object, if the users comes from Germany
  req.hello = 'world'
}

export default preValidation
```

### Response

- `redirect(destination, code)` - a asynchronous method for redirecting *(status code defaults to 307)*
- `code(code)` - a asynchronous method for setting the status code for the response
- `header(name, value)` - a asynchronous method for adding a header to the response object
- `cookie(name, value, config)` - a asynchronous method for setting a cookie

### Tips

By default the status code is 200, but you can change it easily to any number.

```typescript
import { Handler } from 'darkflare'

export default {
  put: async (req, res) => {
    return {
      code: 400 // set the status code to 400 and send a json object with the code as response body
    }
    
    // alternatively, you can also set it via a method
    await res.code(400)
  }
} as Handler
```



