# changelog

### v2.0.0 (upcoming)

#### Breaking Changes:

- [x] package is now **esm-only**
- [x] split packages into separate directories
- [x] renamed build command to `darkflare build`

#### New Features:

- [ ] drastically decreased build output for large projects by adding a custom router
- [ ] added `darkflare dev` command for easy out-of-the-box development using miniflare
- [ ] added unit tests to avoid such bugs in future

#### Bug Fixes:

- [ ] fixed default route `/` to respond properly to requests
- [ ] fixed `.redirect()` method which didn't actually redirect
- [ ] fixed a issue regarding the build process which led darkflare to think comments are actual route handlers
- [ ] fixed type declaration for `.redirect()` method

## v1

### v1.1.0

#### New Features:

- allow strings as return type in routes

#### Changes:

- fixed Darkflare for Linux
- added fallback config

### v1.0.0

Released `@darkflare/new`.
