// Funktion til at løse differentialligningerne
function solveEquations(v0, theta, omega, phi, h) {
    // Initialbetingelser
    let x = 0;
    let y = 0;
    let z = 0;
    let vx = v0 * Math.cos(theta);
    let vy = 0;
    let vz = v0 * Math.sin(theta);
    let v = Math.sqrt(vx ** 2 + vy ** 2 + vz ** 2);

    // Andre konstanter
    const g = 9.82;  // Tyngdekraften
    const B = 0.00041;  // Konstant i ligningerne
    const l = 18.44;  // Afstand mellem pitcher og hitter
    const T = l / v0;  // Estimeret tid for flyvning
    const rho = 1.293;
    const A = 0.00426;

    // Funktion til at opdatere position og hastighed
    function updateState() {
        // Opdater position og hastighed baseret på differentialligningerne

        // Erstat disse med dine egne differentialligninger
        const C = 0.29 + 0.22 / (1 + Math.E ** ((v - 32.37) / 5.2));
        const D = 0.5 * rho * A * C;
        const ax = - D * v * vx + B * omega * (vz * Math.sin(phi) - vy * Math.cos(phi));  // Eksempel på differentialligning for acceleration i x-retningen
        const ay = - D * v * vy + B * omega * vx * Math.cos(phi);  // Eksempel på differentialligning for acceleration i y-retningen
        const az = - g - D * v * vz - B * omega * vx * Math.sin(phi);  // Eksempel på differentialligning for acceleration i z-retningen

        vx += ax * h;
        vy += ay * h;
        vz += az * h;
        x += vx * h;
        y += vy * h;
        z += vz * h;


        // Tjek om y er nået eller overskredet l
        if (x >= l) {
            stopSimulation();
        }
    }

    // Funktion til at stoppe simuleringen
    function stopSimulation() {
        // Her kan du håndtere, hvad der skal ske, når simuleringen stopper
        const stopTime = results[results.length - 1].t;
        console.log(stopTime)
        const stopVelocity = Math.sqrt(vx ** 2 + vy ** 2 + vz ** 2);
        const stopInfo = `Simuleringen er stoppet ved t = ${stopTime}s med en hastighed på ${stopVelocity.toFixed(2)} m/s`;

        // Vis stopinformation i DOM'en
        const stopInfoDiv = document.getElementById('stopInfo');
        stopInfoDiv.textContent = stopInfo;
        stopInfoDiv.className = 'stop-info';  // Tilføj en klasse for styling

        console.log(stopInfo);
        // Du kan også gøre andre handlinger her, hvis nødvendigt
    }

    // Array til at gemme resultater
    const results = [];

    // Simulér bevægelse og gem resultater i et array
    for (let t = 0; t <= T; t += h) {
        updateState();
        results.push({ t, x, y, z });
    }

    stopSimulation();  // Kald stopSimulation når simuleringen er færdig

    return results;
}

// Funktion til at vise simulationsresultater
function displayResults(results) {
    const resultsDiv = document.querySelector('#results');
    resultsDiv.innerHTML = '';

    if (results.length === 0) {
        resultsDiv.textContent = 'Ingen resultater at vise.';
        return;
    }

    // Opret en tabel for at vise resultaterne
    const table = document.createElement('table');

    // Opret en række for overskrifter baseret på resultaternes nøgler
    const headerRow = table.insertRow(0);
    for (const key in results[0]) {
        const th = document.createElement('th');
        th.textContent = key.toUpperCase();
        headerRow.appendChild(th);
    }

    // Opret rækker for hver resultat og indsæt celler med værdier
    for (const result of results) {
        const row = table.insertRow();
        for (const key in result) {
            const cell = row.insertCell();
            cell.textContent = result[key];
        }
    }

    // Tilføj tabellen til DOM'en
    resultsDiv.appendChild(table);
}