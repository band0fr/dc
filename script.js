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

  // Simulate fetching user data (replace with actual API call)
  fetchUserData(discordUser).then(data => {
    if (data.valid) {
      userDetails.innerHTML = `
        <p><strong>Username:</strong> ${data.username}</p>
        <p><strong>Discriminator:</strong> ${data.discriminator}</p>
        <p><strong>Joined Server:</strong> ${data.joinedServer}</p>
      `;
      userInfo.classList.remove('hidden');
    } else {
      errorMessage.classList.remove('hidden');
    }
  }).catch(err => {
    errorMessage.classList.remove('hidden');
  });
});

// Simulate fetching user data from an API
function fetchUserData(username) {
  return new Promise((resolve, reject) => {
    // Simulate a delay of 2 seconds for the "API call"
    setTimeout(() => {
      // Example: you could call a real API here to get the user data
      const fakeDatabase = {
        'User#1234': {
          valid: true,
          username: 'User',
          discriminator: '1234',
          joinedServer: 'January 2023'
        },
        'AnotherUser#5678': {
          valid: true,
          username: 'AnotherUser',
          discriminator: '5678',
          joinedServer: 'December 2022'
        }
      };

      if (fakeDatabase[username]) {
        resolve(fakeDatabase[username]);
      } else {
        reject('User not found');
      }
    }, 2000); // Simulate 2 seconds delay
  });
}
