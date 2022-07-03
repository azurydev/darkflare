export const respondWith = (message: string, code: number) => (
  new Response(JSON.stringify({ code, message }), {
    headers: {
      'content-type': 'application/json; charset=utf-8'
    },
    status: code
  })
)
