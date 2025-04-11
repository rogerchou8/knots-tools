export async function onRequestPost({ request }) {
  const body = await request.text();
  try {
    const json = JSON.parse(body);
    const list = json?.data?.assets?.map(item => item.ip).filter(Boolean) || [];
    return new Response(list.join("\n"), { status: 200 });
  } catch (e) {
    return new Response("JSON 解析失败", { status: 400 });
  }
}
