## Configuration

> You need to create a file named `darkflare.json` at the root of your project to adjust darkflare to your desire.

### Options

- `base` - The base for your API, e.g. **/api**.   
  ***→ defaults to `/`***
  
- `origin` - The allowed request origin for CORS.  
  ***→ defaults to `*`***
  
- `handlePreflightRequests` - Automatically handle preflight requests sent by browsers.  
  ***→ defaults to `true`***
  
- `modules` - Build your app for a module worker.  
  ***→ defaults to `true`***
  
- `minify` - Minify your app. *(automatically disabled when running the build command under dev flag)*  
  ***→ defaults to `true`***
  
**Tip:** Add `"$schema": "https://darkflare.run/schema.json"` at the top of your configuration to get auto-completion.
