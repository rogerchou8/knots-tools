export async function onRequestPost({ request }) {
  const body = await request.text();
  const result = body
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => {
      const match = line.match(/@([^:]+):/);
      return match ? match[1] : null;
    })
    .filter(Boolean)
    .join("\n");

  return new Response(result, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  });
}
