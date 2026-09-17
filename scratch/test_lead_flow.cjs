const baseUrl = 'https://benthanhland.com';

async function testLeadSubmission() {
  console.log('Testing Lead submission flow...');
  
  // 1. Submit consultation lead
  const testLead = {
    name: 'Khách Hàng QA Test',
    phone: '0901234567',
    demand: 'Nhà phố mặt tiền',
    budget: '50 Tỷ',
    propertyInterest: 'Nhà phố Quận 11 Test',
    note: 'Kiểm thử tự động QA Tester',
  };

  const submitRes = await fetch(`${baseUrl}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testLead),
  });
  const submitData = await submitRes.json();
  console.log('Lead submission response status:', submitRes.status, 'ID:', submitData.id);

  // 2. Verify with Admin token that the new lead is received
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'Kiet1234@' }),
  });
  const { token } = await loginRes.json();

  const leadsRes = await fetch(`${baseUrl}/api/leads`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const leads = await leadsRes.json();
  const found = leads.find(l => l.phone === '0901234567');
  console.log('Lead found in Admin leads list:', !!found, 'Lead Name:', found?.name);
}

testLeadSubmission().catch(console.error);
