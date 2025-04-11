export async function onRequestPost({ request }) {
  const url = new URL(request.url);
  const basicKnot = url.searchParams.get("basicKnot");
  const body = await request.text();
  const result = body
    .split(/\r?\n/)
    .filter(line => line.trim())
    .map(ip => basicKnot.replace(/@.*?:/, `@${ip.trim()}:`))
    .join("\n");
  return new Response(result, { status: 200 });
}
