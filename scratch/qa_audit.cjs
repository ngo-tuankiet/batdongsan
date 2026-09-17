const baseUrl = 'https://benthanhland.com';

async function runQaAudit() {
  const results = [];

  function record(testCase, category, status, details) {
    results.push({ testCase, category, status, details });
    console.log(`[${status}] [${category}] ${testCase}: ${details}`);
  }

  // 1. HTTP Status & Headers
  try {
    const res = await fetch(`${baseUrl}/`);
    record('Trang chủ (Home)', 'Public Pages', res.status === 200 ? 'PASS' : 'FAIL', `HTTP Status ${res.status}`);
  } catch (e) {
    record('Trang chủ (Home)', 'Public Pages', 'FAIL', e.message);
  }

  const pages = ['/nha-pho', '/du-an', '/tin-tuc', '/ky-gui', '/ve-chung-toi', '/admin'];
  for (const p of pages) {
    try {
      const res = await fetch(`${baseUrl}${p}`);
      record(`Trang ${p}`, 'Public Pages', res.status === 200 ? 'PASS' : 'FAIL', `HTTP Status ${res.status}`);
    } catch (e) {
      record(`Trang ${p}`, 'Public Pages', 'FAIL', e.message);
    }
  }

  // 2. SEO & Crawlers
  try {
    const sitemapRes = await fetch(`${baseUrl}/sitemap.xml`);
    const xml = await sitemapRes.text();
    const isValidXml = xml.includes('<urlset') && xml.includes('</urlset>');
    record('Sitemap XML Endpoint', 'SEO & Indexing', isValidXml ? 'PASS' : 'FAIL', `Size: ${xml.length} bytes, Status: ${sitemapRes.status}`);
  } catch (e) {
    record('Sitemap XML Endpoint', 'SEO & Indexing', 'FAIL', e.message);
  }

  try {
    const robotsRes = await fetch(`${baseUrl}/robots.txt`);
    const robotsText = await robotsRes.text();
    const hasSitemap = robotsText.includes('sitemap.xml');
    record('Robots.txt Endpoint', 'SEO & Indexing', hasSitemap ? 'PASS' : 'FAIL', `Contains sitemap directive: ${hasSitemap}`);
  } catch (e) {
    record('Robots.txt Endpoint', 'SEO & Indexing', 'FAIL', e.message);
  }

  // 3. Security Check: Unauthenticated /api/leads
  try {
    const unauthLeads = await fetch(`${baseUrl}/api/leads`);
    if (unauthLeads.status === 401) {
      record('Bảo mật dữ liệu khách hàng (GET /api/leads không token)', 'Security', 'PASS', 'Chặn 401 Unauthorized thành công');
    } else {
      record('Bảo mật dữ liệu khách hàng (GET /api/leads không token)', 'Security', 'FAIL', `Lỗ hổng: trả về HTTP ${unauthLeads.status}`);
    }
  } catch (e) {
    record('Bảo mật dữ liệu khách hàng', 'Security', 'WARN', e.message);
  }

  // 4. Auth & Admin Login
  let adminToken = '';
  try {
    const wrongLogin = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'sai_mat_khau_123' }),
    });
    record('Từ chối mật khẩu sai', 'Authentication', wrongLogin.status === 401 ? 'PASS' : 'FAIL', `Status ${wrongLogin.status}`);

    const correctLogin = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'Kiet1234@' }),
    });
    const loginData = await correctLogin.json();
    if (correctLogin.status === 200 && loginData.success && loginData.token) {
      adminToken = loginData.token;
      record('Đăng nhập Admin mật khẩu Kiet1234@', 'Authentication', 'PASS', `Token nhận diện hợp lệ: ${adminToken.substring(0, 20)}...`);
    } else {
      record('Đăng nhập Admin mật khẩu Kiet1234@', 'Authentication', 'FAIL', JSON.stringify(loginData));
    }
  } catch (e) {
    record('Đăng nhập Admin', 'Authentication', 'FAIL', e.message);
  }

  // 5. Authenticated Admin Leads Fetch
  if (adminToken) {
    try {
      const authLeads = await fetch(`${baseUrl}/api/leads`, {
        headers: { 'Authorization': `Bearer ${adminToken}` },
      });
      const leads = await authLeads.json();
      record('Admin đọc danh sách Leads với Token', 'Admin CMS API', authLeads.status === 200 && Array.isArray(leads) ? 'PASS' : 'FAIL', `HTTP ${authLeads.status}, Tổng ${leads.length || 0} leads`);
    } catch (e) {
      record('Admin đọc danh sách Leads với Token', 'Admin CMS API', 'FAIL', e.message);
    }
  }

  // 6. Public APIs
  try {
    const propsRes = await fetch(`${baseUrl}/api/properties`);
    const props = await propsRes.json();
    record('API Bất động sản (GET /api/properties)', 'Core APIs', propsRes.status === 200 && Array.isArray(props) ? 'PASS' : 'FAIL', `Tổng ${props.length} BĐS đang mở bán`);
  } catch (e) {
    record('API Bất động sản', 'Core APIs', 'FAIL', e.message);
  }

  try {
    const agentsRes = await fetch(`${baseUrl}/api/agents`);
    const agents = await agentsRes.json();
    record('API Chuyên viên tư vấn (GET /api/agents)', 'Core APIs', agentsRes.status === 200 && Array.isArray(agents) ? 'PASS' : 'FAIL', `Tổng ${agents.length} chuyên viên`);
  } catch (e) {
    record('API Chuyên viên tư vấn', 'Core APIs', 'FAIL', e.message);
  }

  try {
    const articlesRes = await fetch(`${baseUrl}/api/articles`);
    const articles = await articlesRes.json();
    record('API Tin tức (GET /api/articles)', 'Core APIs', articlesRes.status === 200 && Array.isArray(articles) ? 'PASS' : 'FAIL', `Tổng ${articles.length} bài viết`);
  } catch (e) {
    record('API Tin tức', 'Core APIs', 'FAIL', e.message);
  }

  try {
    const bannersRes = await fetch(`${baseUrl}/api/banners`);
    const banners = await bannersRes.json();
    record('API Banner Quảng Cáo (GET /api/banners)', 'Core APIs', bannersRes.status === 200 && Array.isArray(banners) ? 'PASS' : 'FAIL', `Tổng ${banners.length} banner`);
  } catch (e) {
    record('API Banner Quảng Cáo', 'Core APIs', 'FAIL', e.message);
  }

  console.log('\n--- AUDIT SUMMARY ---');
  console.log(`Total test cases: ${results.length}`);
  console.log(`Passed: ${results.filter(r => r.status === 'PASS').length}`);
  console.log(`Failed: ${results.filter(r => r.status === 'FAIL').length}`);
  console.log(`Warnings: ${results.filter(r => r.status === 'WARN').length}`);
}

runQaAudit().catch(console.error);
