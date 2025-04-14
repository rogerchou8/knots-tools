export async function onRequestPost({ request }) {
    try {
        const raw = await request.text();
        const ipList = raw
            .split(/\r?\n/)
            .map(ip => ip.trim())
            .filter(ip => ip !== "");

        if (ipList.length === 0) {
            return new Response("请提供至少一个 IP", { status: 400 });
        }

        const results = await Promise.all(
            ipList.map(async ip => {
                try {
                    const res = await fetch(`https://freeipapi.com/api/json/${ip}`);
                    const data = await res.json();
                    if (!data || !data.countryCode || data.countryCode === "-") {
                        return { ip, info: `${padIP(ip)}  定位失败`, country: "未知" };
                    }

                    return {
                        ip,
                        info: `${padIP(ip)}  ${data.countryCode}： ${data.regionName || ''} ${data.cityName || ''}`,
                        country: data.countryCode
                    };
                } catch (e) {
                    return { ip, info: `${padIP(ip)}  查询失败`, country: "未知" };
                }
            })
        );

        return new Response(JSON.stringify(results, null, 2), {
            status: 200,
            headers: { "Content-Type": "application/json; charset=utf-8" }
        });

    } catch (err) {
        return new Response("请求处理失败", {
            status: 500,
            headers: { "Content-Type": "text/plain" }
        });
    }
}

// 填充 IP 为固定长度（默认15字符）
function padIP(ip, width = 15) {
    return ip.padEnd(width, ' ');
}
