document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user || !user.isAdmin) {
    window.location.href = '/login.html';
    return;
  }

  document.getElementById('welcomeMessage').textContent = `Welcome, ${user.name}`;

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
  });

  try {
    const res = await fetch('/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    
    if (res.ok) {
      const tbody = document.getElementById('usersTableBody');
      tbody.innerHTML = '';
      
      data.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${item.name}</td>
          <td>${item.email}</td>
          <td>${item.totalUnits.toFixed(2)}</td>
          <td>$${item.totalCost.toFixed(2)}</td>
          <td>${item.readingCount}</td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Error fetching admin data:', error);
  }
});
