> Middlewares allow you to run a function before passing the request to the respective route. This way you can add additional data to the `req` object, validate the incoming request, and much more.

### Usage

1. Create a new file named `_middleware.ts` in your `routes` directory.

2. Add custom data to the `req` object:
    ```typescript
    import type { Middleware } from 'darkflare'

    const middleware: Middleware = async req => {
      req.custom = 'Awesome!'
    }

    export default middleware
    ```
    
    Or, validate the request:
    
    ```typescript
    import type { Middleware } from 'darkflare'

    const middleware: Middleware = async (req, res) => {
      // Redirect all incoming requests which are from the United States to Google
      if (req.country === 'US')
        await res.redirect('https://google.com')
    }

    export default middleware
    ```
 
### Notice
 
> You can have as many middlewares as you want, but **only one at the utmost gets added to each route**. darkflare searches internally for the closest middleware and adds it to the route.
