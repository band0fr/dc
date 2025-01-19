document.getElementById('submitButton').addEventListener('click', function () {
    const botToken = document.getElementById('botToken').value;
    const mainServerId = document.getElementById('mainServerId').value;
    const targetServerId = document.getElementById('targetServerId').value;
    const memberLimit = document.getElementById('memberLimit').value;

    // Clear previous messages
    const messageSection = document.getElementById('message');
    messageSection.classList.add('hidden');
    messageSection.innerHTML = '';

    // Validate inputs
    if (!botToken || !mainServerId || !targetServerId || !memberLimit) {
        messageSection.classList.remove('hidden');
        messageSection.innerHTML = '<p>Please fill all fields correctly.</p>';
        return;
    }

    if (memberLimit > 300) {
        messageSection.classList.remove('hidden');
        messageSection.innerHTML = '<p>Number of members should be 300 or less.</p>';
        return;
    }

    // Show loading spinner
    document.getElementById('loading').classList.remove('hidden');

    // Send data to the backend
    fetch('/pull-members', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            botToken,
            mainServerId,
            targetServerId,
            memberLimit
        })
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('loading').classList.add('hidden');
            messageSection.classList.remove('hidden');
            messageSection.innerHTML = `<p>${data.message}</p>`;
        })
        .catch(error => {
            document.getElementById('loading').classList.add('hidden');
            messageSection.classList.remove('hidden');
            messageSection.innerHTML = `<p>Error: ${error.message}</p>`;
        });
});
