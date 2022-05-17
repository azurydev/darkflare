## Request

### Properties

- `query`
- `params`
- `headers`
- `cookies`
- `body`
- `env` *(module workers only)*
- `ctx` *(module workers only)*
  - `waitUntil()`
  - `passThroughOnException()`
- `raw` - the incoming `Request` object  
[...more](https://developers.cloudflare.com/workers/runtime-apis/request/#incomingrequestcfproperties)

### Good to Know

- darkflare parses the `body`, `cookies`, `headers`, `query`, and `params` of incoming requests for convenience
- darkflare **can only parse bodies of type JSON** at the moment
