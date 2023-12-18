// Initialiserer simuleringen ved at tilføje eventlisteners til belastede elementer
window.addEventListener('load', setupSimulation);

// Nulstiller simuleringen til standardværdier og viser en succesmeddelelse
function setupSimulation() {
    console.log('%cPitch simulator', 'color: #ff6600; font-size: 18px; font-weight: bold;');
    document.querySelector('#onclick').addEventListener('click', runSimulation);
    document.querySelector('#resetSimulation').addEventListener('click', resetSimulation);
}

// Nulstiller inputværdier til standardværdier
function resetSimulation() {
    resetInputValues();
    clearResults();
    showToast('Simulation nulstillet', 'success');
}

// Nulstiller inputværdier til standardværdier
function resetInputValues() {
    document.getElementById('initialSpeed').value = '85';
    document.getElementById('initialAngle').value = '1';
    document.getElementById('rotationSpeed').value = '1800';
    document.getElementById('rotationAngle').value = '0';
    document.getElementById('stepSize').value = '1e-4';
}

// Rydder resultaterne i resultatområdet
function clearResults() {
    document.getElementById('results').innerHTML = '';
}

// Viser en midlertidig meddelelse (toast) til brugeren
function showToast(message, type) {
    const toastElement = document.getElementById('toast');
    toastElement.textContent = message;
    toastElement.className = `toast ${type}`;
    setTimeout(() => {
        toastElement.textContent = '';
    }, 3000);
}

// Kører simuleringen baseret på inputværdier og viser resultaterne
function runSimulation() {
    const simulationType = document.getElementById('simulationType').value;
    const { v0, theta, omega, phi, h } = getInputValues();

    switch (simulationType) {
        default:
            const result = solveEquations(v0, theta, omega, phi, h);
            displayResults(result);
            showToast('Standard-simulation fuldført', 'success');
            break;
    }
}

// Henter inputværdier fra brugerens inputfelter
function getInputValues() {
    return {
        v0: parseFloat(document.getElementById('initialSpeed').value),
        theta: parseFloat(document.getElementById('initialAngle').value),
        omega: parseFloat(document.getElementById('rotationSpeed').value),
        phi: parseFloat(document.getElementById('rotationAngle').value),
        h: parseFloat(document.getElementById('stepSize').value),
    };
}

// Løser differentialligningerne for simuleringen og returnerer resultaterne
function solveEquations(v0, theta, omega, phi, h) {
    let x = 0;
    let y = 0;
    let z = 0;
    let vx = v0 * Math.cos(theta);
    let vy = 0;
    let vz = v0 * Math.sin(theta);
    let v = Math.sqrt(vx ** 2 + vy ** 2 + vz ** 2);

    const g = 9.82;
    const B = 0.00041;
    const l = 18.44;
    const T = l / v0;
    const rho = 1.293;
    const A = 0.00426;

    function updateState() {
        const C = 0.29 + 0.22 / (1 + Math.E ** ((v - 32.37) / 5.2));
        const D = 0.5 * rho * A * C;
        const ax = - D * v * vx + B * omega * (vz * Math.sin(phi) - vy * Math.cos(phi));
        const ay = - D * v * vy + B * omega * vx * Math.cos(phi);
        const az = - g - D * v * vz - B * omega * vx * Math.sin(phi);

        vx += ax * h;
        vy += ay * h;
        vz += az * h;
        x += vx * h;
        y += vy * h;
        z += vz * h;

        if (x >= l) {
            stopSimulation();
        }
    }

    function stopSimulation() {
        const stopTime = results[results.length - 1].t;
        console.log(stopTime);
        const stopVelocity = Math.sqrt(vx ** 2 + vy ** 2 + vz ** 2);
        const stopInfo = `Simuleringen er stoppet ved t = ${stopTime}s med en hastighed på ${stopVelocity.toFixed(2)} m/s`;

        const stopInfoDiv = document.getElementById('stopInfo');
        stopInfoDiv.textContent = stopInfo;
        stopInfoDiv.className = 'stop-info';

        console.log(stopInfo);
    }

    const results = [];

    for (let t = 0; t <= T; t += h) {
        updateState();
        results.push({ t, x, y, z });
    }

    stopSimulation();

    return results;
}

// Viser resultaterne i HTML-dokumentet
function displayResults(results) {
    const resultsDiv = document.querySelector('#results');
    resultsDiv.innerHTML = '';

    if (results.length === 0) {
        resultsDiv.textContent = 'Ingen resultater at vise.';
        return;
    }

    const table = createResultsTable(results);
    resultsDiv.appendChild(table);
}

// Opretter en HTML-tabel baseret på resultatdata
function createResultsTable(results) {
    const table = document.createElement('table');
    const headerRow = table.insertRow(0);

    for (const key in results[0]) {
        const th = document.createElement('th');
        th.textContent = key.toUpperCase();
        headerRow.appendChild(th);
    }

    for (const result of results) {
        const row = table.insertRow();
        for (const key in result) {
            const cell = row.insertCell();
            cell.textContent = result[key];
        }
    }
    return table;
}
