import build from '../src/commands/build'
import { Miniflare } from 'miniflare'
import { join } from 'path'

let mf: Miniflare

test('build process', async () => {
  await build(__dirname, { dev: false, testing: 1 })

  mf = new Miniflare({
    scriptPath: join(__dirname, './dist/worker.js'),
    modules: true
  })
})

test('basic routes', async () => {
  const getResponse = await mf.dispatchFetch('http://localhost:8787')
  expect(await getResponse.text()).toBe('Hello World')

  const postResponse = await mf.dispatchFetch('http://localhost:8787', {
    method: 'POST'
  })
  expect(await postResponse.text()).toBe('Hello World')

  const putResponse = await mf.dispatchFetch('http://localhost:8787', {
    method: 'PUT'
  })
  expect(await putResponse.text()).toBe('Hello World')

  const patchResponse = await mf.dispatchFetch('http://localhost:8787', {
    method: 'PATCH'
  })
  expect(await patchResponse.text()).toBe('Hello World')

  const deleteResponse = await mf.dispatchFetch('http://localhost:8787', {
    method: 'DELETE'
  })
  expect(await deleteResponse.text()).toBe('Hello World')

  const headResponse = await mf.dispatchFetch('http://localhost:8787', {
    method: 'HEAD'
  })
  expect(headResponse.status).toBe(200)
})

test('redirects', async () => {
  const response = await mf.dispatchFetch('http://localhost:8787/redirectToGoogle')
  expect(response.headers.get('location')).toBe('https://google.com')
})

test('parsed request', async () => {
  const response1 = await mf.dispatchFetch('http://localhost:8787/testParsedRequest?firstname=John&lastname=Doe', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'stupidheader': 'some stupid value',
      'cookie': 'coo=k1e; co2=k2e'
    },
    body: JSON.stringify({
      firstname: 'Jane',
      lastname: 'Doe'
    })
  })

  const json = await response1.json() as { [key: string]: any }

  expect(json.body).toStrictEqual({
    firstname: 'Jane',
    lastname: 'Doe'
  })
  expect(json.query).toStrictEqual({
    firstname: 'John',
    lastname: 'Doe'
  })
  expect(json.cookies).toStrictEqual({
    coo: 'k1e',
    co2: 'k2e'
  })
  expect(json.stupidheader).toBe('some stupid value')

  const response2 = await mf.dispatchFetch('http://localhost:8787/nested/something')
  
  expect(await response2.json()).toStrictEqual({
    someParameter: 'something'
  })
})

test('response methods', async () => {
  const response1 = await mf.dispatchFetch('http://localhost:8787/testResponseMethods')
  
  expect(response1.status).toBe(400)
  expect(response1.headers.get('accept')).toBe('application/json')
  expect(response1.headers.get('set-cookie')).toBe('a cookie=super duper secret; httpOnly;')

  const response2 = await mf.dispatchFetch('http://localhost:8787/testJsonMethod')
  expect(await response2.json()).toStrictEqual({ message: 'Hello World' })
  expect(response2.headers.get('content-type')).toBe('application/json; charset=utf-8')

  const response3 = await mf.dispatchFetch('http://localhost:8787/testTextMethod')
  expect(await response3.text()).toBe('Hello World')
  expect(response3.headers.get('content-type')).toBe('text/plain; charset=utf-8')
})

test('not found handling', async () => {
  const response = await mf.dispatchFetch('http://localhost:8787/notFound')
  
  expect(response.status).toBe(404)
  expect(await response.json()).toStrictEqual({ code: 404, message: 'Not Found' })
})

test('error handling', async () => {
  const response = await mf.dispatchFetch('http://localhost:8787/error')
  
  expect(response.status).toBe(500)
  expect(await response.json()).toStrictEqual({ code: 500, message: 'Something Went Wrong' })
})

test('middlewares', async () => {
  const response1 = await mf.dispatchFetch('http://localhost:8787/testMiddleware')
  expect(await response1.text()).toBe('something awesome')

  const response2 = await mf.dispatchFetch('http://localhost:8787/nested/testMiddleware')
  expect(await response2.text()).toBe('something cool')

  const response3 = await mf.dispatchFetch('http://localhost:8787/nested/deeply/testMiddleware')
  expect(await response3.text()).toBe('something nice')
})
