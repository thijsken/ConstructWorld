async function loadServerStatus() {
    try {
        const data = await fetch("http://localhost:3001/api/server").then(r => r.json());
        const card = document.getElementById("serverStatus");
        card.querySelector("p:nth-child(2)").textContent = `Status: ${data.online ? "Online ✅" : "Offline ❌"}`;
        card.querySelector("p:nth-child(3)").textContent = `Players: ${data.players} / ${data.maxPlayers}`;
        card.querySelector("p:nth-child(4)").textContent = `Version: ${data.version || '-'}`;
    } catch(e){console.error(e);}
}

async function loadBotStatus() {
    try {
        const data = await fetch("http://localhost:3001/api/bot").then(r => r.json());
        const card = document.getElementById("botStatus");
        card.querySelector("p:nth-child(2)").textContent = `Status: ${data.online ? "Online ✅" : "Offline ❌"}`;
        card.querySelector("p:nth-child(3)").textContent = `Commands: ${data.commandsActive}`;
        card.querySelector("p:nth-child(4)").textContent = `Ping: ${data.ping}ms`;
    } catch(e){console.error(e);}
}

// Initial load
loadServerStatus();
loadBotStatus();

// Update elke 10 seconden
setInterval(loadServerStatus, 10000);
setInterval(loadBotStatus, 10000);
