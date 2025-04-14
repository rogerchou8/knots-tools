
let extractedIPs = [];
let locationResults = []; // 所有 IP 定位数据
let filteredResults = []; // 当前筛选后显示的数据

function extractIPs() {
  const input = document.getElementById("fofaInput").value;
  const json = JSON.parse(input);
  extractedIPs = json?.data?.assets?.map(item => item.ip).filter(Boolean) || [];

  document.getElementById("out4").textContent = extractedIPs.length > 0
    ? `已提取 ${extractedIPs.length} 个 IP：\n` + extractedIPs.join("\n")
    : "未提取到有效 IP。";

  // 清除旧结果
  locationResults = [];
  filteredResults = [];
}

async function lookupLocation() {
  extractedIPs = document.getElementById("fofaInput").value
    .split(/\r?\n/)
    .map(ip => ip.trim())
    .filter(ip => ip !== "");
  if (extractedIPs.length === 0) {
    alert("请先输入 IP！");
    return;
  }

  document.getElementById('out4').textContent = "🌐 正在定位中，请稍等...";

  const results = await Promise.all(
    extractedIPs.map(async ip => {
      try {
        const res = await fetch(`https://freeipapi.com/api/json/${ip}`);
        const data = await res.json();
        if (!data || !data.countryCode) {
          return `${padIP(ip)} - 定位失败`;
        }

        return {
          ip,
          info: `${padIP(ip)} - ${data.countryCode}： ${data.regionName} ${data.cityName}`,  //(${data.isp || '未知运营商'})
          country: data.countryCode || "未知"
        };
      } catch (err) {
        console.error(`IP ${ip} 定位出错:`, err);
        return { ip, info: `${ip} - 定位失败`, country: "未知" };
      }
    })
  );


  locationResults = results;
  updateCountryFilterOptions(); // 🔄 更新国家筛选选项
  applyCountryFilter();         // ✅ 应用当前筛选
}

// 填充 IP 为固定长度（默认15字符）
function padIP(ip, width = 15) {
  return ip.padEnd(width, ' ');
}

function updateCountryFilterOptions() {
  const select = document.getElementById("countryFilter");
  if (!select) return;

  const countries = Array.from(new Set(locationResults.map(r => r.country).filter(Boolean)));

  // 先清空原选项
  select.innerHTML = "";

  // 添加“全部”选项
  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = "🌍 全部";
  select.appendChild(allOption);

  // 添加其他国家选项
  countries.sort().forEach(country => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    select.appendChild(option);
  });
}


function applyCountryFilter() {
  const selectedCountry = document.getElementById("countryFilter").value;
  filteredResults = selectedCountry
    ? locationResults.filter(r => r.country === selectedCountry)
    : locationResults;

  document.getElementById('out4').textContent = filteredResults.map(r => r.info).join("\n");
  document.getElementById('out4-ip').textContent = filteredResults.map(r => r.ip).join("\n");
}

function copyToClipboard(elementId) {
  const text = document.getElementById(elementId).textContent;
  navigator.clipboard.writeText(text)
    .then(() => alert("结果已复制到剪贴板"))
    .catch(() => alert("复制失败"));
}

function downloadExcel() {
  if (filteredResults.length === 0) {
    alert("没有可导出的内容！");
    return;
  }

  const data = filteredResults.map(item => {
    const [ip, ...restParts] = item.info.trim().split(/\s+/);
    const detail = restParts.join(" ");

    return {
      IP地址: ip,
      国家: item.country || "",
      详细信息: detail
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "IP定位结果");
  XLSX.writeFile(workbook, "IP定位结果.xlsx");
}


// 给国家选择框绑定筛选逻辑
window.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById("countryFilter");
  if (select) {
    select.addEventListener("change", applyCountryFilter);
  }
});
