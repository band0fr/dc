document.getElementById('findButton').addEventListener('click', function() {
  const discordUser = document.getElementById('discordUser').value;
  const errorMessage = document.getElementById('errorMessage');
  const userInfo = document.getElementById('userInfo');
  const userDetails = document.getElementById('userDetails');
  
  // Clear previous error and user info
  errorMessage.classList.add('hidden');
  userInfo.classList.add('hidden');
  userDetails.innerHTML = '';

  // Validate input (basic validation for format)
  const discordRegex = /^[a-zA-Z0-9_]+#[0-9]{4}$/;
  if (!discordRegex.test(discordUser)) {
    errorMessage.classList.remove('hidden');
    return;
  }

  // Use the OAuth2 token to fetch user data (after user authentication)
  const token = localStorage.getItem('discord_token');  // Assuming you store the token after authentication
  if (token) {
    fetchUserData(token).then(data => {
      if (data) {
        userDetails.innerHTML = `
          <p><strong>Username:</strong> ${data.username}</p>
          <p><strong>Discriminator:</strong> ${data.discriminator}</p>
          <p><strong>Join Date:</strong> ${data.joinDate}</p>
          <p><strong>Servers:</strong> ${data.guilds.join(', ')}</p>
        `;
        userInfo.classList.remove('hidden');
      } else {
        errorMessage.classList.remove('hidden');
      }
    }).catch(err => {
      errorMessage.classList.remove('hidden');
    });
  } else {
    errorMessage.classList.remove('hidden');
  }
});

// Simulate fetching user data after OAuth2 authentication
function fetchUserData(token) {
  return new Promise((resolve, reject) => {
    // Fetch basic user info from Discord API
    fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(response => response.json())
      .then(userData => {
        if (userData.id) {
          // Get the guilds (servers) the user is part of
          fetch('https://discord.com/api/v10/users/@me/guilds', {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          })
            .then(response => response.json())
            .then(guildsData => {
              resolve({
                username: userData.username,
                discriminator: userData.discriminator,
                joinDate: userData.created_at,
                guilds: guildsData.map(guild => guild.name)
              });
            })
            .catch(reject);
        } else {
          reject('User not found');
        }
      })
      .catch(reject);
  });
}
