# changelog

### v2.0.0 (upcoming)

#### Breaking Changes:

- [x] package is now **esm-only**
- [x] split packages into separate directories
- [x] renamed build command to `darkflare build`
- [x] removed `preValidation` hook

#### New Features:

- [ ] drastically decreased build output for large projects by adding a custom router
- [x] added unit tests to avoid such bugs in future
- [x] added **middlewares**, a enhanced version of hooks
- [x] added **route settings** to modify specific routes only or give them an alias
- [x] global type declarations

#### Bug Fixes:

- [x] fixed default route `/` to respond properly to requests
- [x] fixed `.redirect()` method which didn't actually redirect
- [x] fixed a issue regarding the build process which led darkflare to think comments are actual route handlers
- [x] fixed type declaration for `.redirect()` method

## v1

### v1.1.0

#### New Features:

- allow strings as return type in routes

#### Changes:

- fixed Darkflare for Linux
- added fallback config

### v1.0.0

Released `@darkflare/new`.
