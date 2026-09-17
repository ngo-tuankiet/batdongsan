async function test() {
  const loginRes = await fetch('https://benthanhland.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'Kiet1234@' }),
  });
  const loginData = await loginRes.json();
  console.log('Login result:', loginData);

  const token = loginData.token;
  const cookie = loginRes.headers.get('set-cookie');
  console.log('Set-Cookie header:', cookie);

  const leadsWithHeader = await fetch('https://benthanhland.com/api/leads', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  console.log('Leads with Auth Header status:', leadsWithHeader.status);
  const leadsData = await leadsWithHeader.json();
  console.log('Leads count:', Array.isArray(leadsData) ? leadsData.length : leadsData);

  const leadsUnauth = await fetch('https://benthanhland.com/api/leads');
  console.log('Leads without Auth status:', leadsUnauth.status);
}

test().catch(console.error);
