// Function to reset the simulation parameters and display a success message
function resetSimulation() {
    // Resetting input values to default
    document.getElementById('initialSpeed').value = '85';
    document.getElementById('initialAngle').value = '1';
    document.getElementById('rotationSpeed').value = '1800';
    document.getElementById('rotationAngle').value = '0';
    document.getElementById('stepSize').value = '1e-4';

    // Clearing simulation results and displaying a success toast message
    document.getElementById('results').innerHTML = '';
    showToast('Simulation nulstillet', 'success');
}

// Function to display toast messages
function showToast(message, type) {
    // Retrieving the toast element
    const toastElement = document.getElementById('toast');

    // Setting the message and class for styling
    toastElement.textContent = message;
    toastElement.className = `toast ${type}`;

    // Setting a timeout to clear the toast message after 3 seconds
    setTimeout(() => {
        toastElement.textContent = '';
    }, 3000);
}

// Function to run the simulation based on user input
function runSimulation() {
    // Retrieving simulation parameters from user input
    const simulationType = document.getElementById('simulationType').value;
    const v0 = parseFloat(document.getElementById('initialSpeed').value);
    const theta = parseFloat(document.getElementById('initialAngle').value);
    const omega = parseFloat(document.getElementById('rotationSpeed').value);
    const phi = parseFloat(document.getElementById('rotationAngle').value);
    const h = parseFloat(document.getElementById('stepSize').value);

    // Running different simulations based on the selected type
    switch (simulationType) {
        case 'magnus':
            // Running Magnus simulation and displaying results
            const resultWithMagnus = solveEquationsWithMagnus(v0, theta, omega, phi, h, 0.145);
            displayResults(resultWithMagnus);
            showToast('Magnus-simulation fuldført', 'success');
            break;
        case 'airDrag':
            // Running Air Drag simulation and displaying results
            const resultWithAirDrag = solveEquationsWithAirDrag(v0, theta, omega, phi, h);
            displayResults(resultWithAirDrag);
            showToast('Air Drag-simulation fuldført', 'success');
            break;
        default:
            // Running default simulation and displaying results
            const result = solveEquations(v0, theta, omega, phi, h);
            displayResults(result);
            showToast('Standard-simulation fuldført', 'success');
            break;
    }
}

// Event listener to run the simulation when the window is loaded
window.addEventListener('load', main);

// Main function to set up the event listener for the simulation button
function main() {
    document.querySelector('button').addEventListener('click', runSimulation);
}