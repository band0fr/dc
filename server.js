const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Your Discord bot token
let botToken = '';
let mainServerId = '';
let targetServerId = '';
let memberLimit = 300;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

// Bot login
client.once('ready', () => {
  console.log('Bot is ready!');
});

// Route for the web interface
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Discord Member Puller</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Roboto', sans-serif;
            background-color: black;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            flex-direction: column;
          }
          .container {
            text-align: center;
            padding: 20px;
            background-color: #222;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            width: 100%;
            max-width: 500px;
          }
          input, button {
            background-color: #333;
            color: white;
            padding: 10px;
            border-radius: 5px;
            margin: 5px;
            border: none;
            width: 80%;
            font-size: 1rem;
          }
          button {
            background-color: #ff4081;
            cursor: pointer;
          }
          button:hover {
            background-color: #ff80ab;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Discord Member Puller</h1>
          <input id="botToken" type="text" placeholder="Enter Bot Token" /><br>
          <input id="mainServerId" type="text" placeholder="Enter Main Server ID" /><br>
          <input id="targetServerId" type="text" placeholder="Enter Target Server ID" /><br>
          <input id="memberLimit" type="number" placeholder="Enter Number of Members to Pull (Max 300)" /><br>
          <button id="submitButton">Pull Members</button>
        </div>
        <script>
          document.getElementById('submitButton').addEventListener('click', function() {
            const botToken = document.getElementById('botToken').value;
            const mainServerId = document.getElementById('mainServerId').value;
            const targetServerId = document.getElementById('targetServerId').value;
            const memberLimit = document.getElementById('memberLimit').value;
            fetch('/pull-members', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                botToken, mainServerId, targetServerId, memberLimit
              })
            }).then(response => response.json())
              .then(data => {
                alert(data.message);
              });
          });
        </script>
      </body>
    </html>
  `);
});

// Route to handle pulling members
app.post('/pull-members', async (req, res) => {
  const { botToken, mainServerId, targetServerId, memberLimit } = req.body;

  if (!botToken || !mainServerId || !targetServerId || !memberLimit) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  botToken = botToken;
  mainServerId = mainServerId;
  targetServerId = targetServerId;
  memberLimit = Math.min(memberLimit, 300); // Limit the number of members to 300

  // Log in the bot with the token
  await client.login(botToken);

  try {
    const guild = await client.guilds.fetch(mainServerId); // Fetch the main server
    const members = await guild.members.fetch(); // Fetch all members
    const memberList = members.array().slice(0, memberLimit); // Limit the number of members to pull

    const targetGuild = await client.guilds.fetch(targetServerId); // Fetch the target server

    // Add members to the target server (by sending invites)
    for (const member of memberList) {
      const user = member.user;
      const invite = await targetGuild.invites.create(targetGuild.channels.cache.find(ch => ch.type === 'text').id, {
        maxAge: 0, // Permanent invite
        maxUses: 1, // Only 1 use
      });
      user.send(`You have been invited to join a new server! Here is your invite: ${invite.url}`);
    }

    res.json({ message: `${memberList.length} members have been invited to the new server.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Your Discord bot token
let botToken = '';
let mainServerId = '';
let targetServerId = '';
let memberLimit = 300;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

// Bot login
client.once('ready', () => {
  console.log('Bot is ready!');
});

// Route for the web interface
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Discord Member Puller</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Roboto', sans-serif;
            background-color: black;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            flex-direction: column;
          }
          .container {
            text-align: center;
            padding: 20px;
            background-color: #222;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            width: 100%;
            max-width: 500px;
          }
          input, button {
            background-color: #333;
            color: white;
            padding: 10px;
            border-radius: 5px;
            margin: 5px;
            border: none;
            width: 80%;
            font-size: 1rem;
          }
          button {
            background-color: #ff4081;
            cursor: pointer;
          }
          button:hover {
            background-color: #ff80ab;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Discord Member Puller</h1>
          <input id="botToken" type="text" placeholder="Enter Bot Token" /><br>
          <input id="mainServerId" type="text" placeholder="Enter Main Server ID" /><br>
          <input id="targetServerId" type="text" placeholder="Enter Target Server ID" /><br>
          <input id="memberLimit" type="number" placeholder="Enter Number of Members to Pull (Max 300)" /><br>
          <button id="submitButton">Pull Members</button>
        </div>
        <script>
          document.getElementById('submitButton').addEventListener('click', function() {
            const botToken = document.getElementById('botToken').value;
            const mainServerId = document.getElementById('mainServerId').value;
            const targetServerId = document.getElementById('targetServerId').value;
            const memberLimit = document.getElementById('memberLimit').value;
            fetch('/pull-members', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                botToken, mainServerId, targetServerId, memberLimit
              })
            }).then(response => response.json())
              .then(data => {
                alert(data.message);
              });
          });
        </script>
      </body>
    </html>
  `);
});

// Route to handle pulling members
app.post('/pull-members', async (req, res) => {
  const { botToken, mainServerId, targetServerId, memberLimit } = req.body;

  if (!botToken || !mainServerId || !targetServerId || !memberLimit) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  botToken = botToken;
  mainServerId = mainServerId;
  targetServerId = targetServerId;
  memberLimit = Math.min(memberLimit, 300); // Limit the number of members to 300

  // Log in the bot with the token
  await client.login(botToken);

  try {
    const guild = await client.guilds.fetch(mainServerId); // Fetch the main server
    const members = await guild.members.fetch(); // Fetch all members
    const memberList = members.array().slice(0, memberLimit); // Limit the number of members to pull

    const targetGuild = await client.guilds.fetch(targetServerId); // Fetch the target server

    // Add members to the target server (by sending invites)
    for (const member of memberList) {
      const user = member.user;
      const invite = await targetGuild.invites.create(targetGuild.channels.cache.find(ch => ch.type === 'text').id, {
        maxAge: 0, // Permanent invite
        maxUses: 1, // Only 1 use
      });
      user.send(`You have been invited to join a new server! Here is your invite: ${invite.url}`);
    }

    res.json({ message: `${memberList.length} members have been invited to the new server.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
