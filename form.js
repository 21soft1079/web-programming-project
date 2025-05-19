document.getElementById('userForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    age: formData.get('age'),
    player: formData.get('player'),
    membership: formData.get('membership'),
    membershipType: formData.get('membership-type') || 'None'
  };

  fetch('/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.text();
  })
  .then(result => {
    alert(' Hala Madrid! Your info has been saved!');
    this.reset();
    document.getElementById('membershipTypeContainer').style.display = 'none';
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error submitting form. Please try again.');
  });
});

document.getElementById('membershipSelect').addEventListener('change', function() {
  const membershipTypeContainer = document.getElementById('membershipTypeContainer');
  membershipTypeContainer.style.display = this.value === 'Yes' ? 'block' : 'none';
});


document.addEventListener('DOMContentLoaded', function() {
  fetch('/memberships')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load memberships');
      return response.json();
    })
    .then(memberships => {
      const list = document.getElementById('membershipsList');
      list.innerHTML = '';

      Object.entries(memberships).forEach(([type, details]) => {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-3';
        
        card.innerHTML = `
          <div class="membership-card">
            <h5>${type} Membership</h5>
            <p class="text-center"><span class="price-badge">${details.price}</span></p>
            <ul>
              ${details.benefits.map(benefit => `<li>✓ ${benefit}</li>`).join('')}
            </ul>
          </div>
        `;
        
        list.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error loading memberships:', error);
      document.getElementById('membershipsList').innerHTML = 
        '<p class="text-center text-danger">Failed to load membership information. Please try again later.</p>';
    });
});