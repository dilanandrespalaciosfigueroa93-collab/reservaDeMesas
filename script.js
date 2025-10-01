const availableTables = [
    { number: 1, reserved: false },
    { number: 2, reserved: false },
    { number: 3, reserved: false },
    { number: 4, reserved: false },
    { number: 5, reserved: false },
    { number: 6, reserved: false },
    { number: 7, reserved: false },
    { number: 8, reserved: false },
    { number: 9, reserved: false },
    { number: 10, reserved: false },
    { number: 11, reserved: false },
    { number: 12, reserved: false },
];

const occupiedTables = [];

document.addEventListener('DOMContentLoaded', () => {
    renderTables();
    document.getElementById('reserveButton').addEventListener('click', reserveTable);
    document.getElementById('reportButton').addEventListener('click', generateReport);
    setMinDateTime();

});

function renderTables(){
    const availableTablesDiv = document.getElementById('availableTables');
    const occupiedTablesDiv = document.getElementById('occupiedTables');

    availableTablesDiv.innerHTML = '';
    occupiedTablesDiv.innerHTML = '';

    availableTables.forEach(table => {
        const tableDiv  = document.createElement('div');
        tableDiv.className = 'table';
        tableDiv.innerHTML = `<img src="miimagen.webp" alt="Mesa ${table.number}"><div class="table-name">Mesa ${table.number}</div>`;

        const reserveButton = document.createElement('button');
        reserveButton.className = 'button';
        reserveButton.textContent = 'Reservar';
        reserveButton.onclick = () => reserveTable();
        tableDiv.appendChild(reserveButton);
        
        availableTablesDiv.appendChild(tableDiv);
    });

    occupiedTables.forEach(table => { 
        const tableDiv  = document.createElement('div');
        tableDiv.className = 'table';
        tableDiv.innerHTML = `<img src="miimagen.webp" alt="Mesa ${table.number}"><div class="table-name">Mesa ${table.number}</div>`;
        const releaseButton = document.createElement('button');
        releaseButton.className = 'button';
        releaseButton.textContent = 'Liberar';
        releaseButton.onclick = () => releaseTable(table.number);
        tableDiv.appendChild(releaseButton);
        occupiedTablesDiv.appendChild(tableDiv);
    });
}

function reserveTable(){
    const customerName = document.getElementById('customerName').value.trim();
    const tableNumber = parseInt(document.getElementById('tableNumber').value);
    const reservationDate = document.getElementById('reservationDate').value;
    const reservationTime = document.getElementById('reservationTime').value;

    if(!customerName || isNaN(tableNumber) || tableNumber < 1 || tableNumber > availableTables.length || !reservationDate || !reservationTime){
        alert('Por favor, ingrese un nombre válido y un número de mesa válido.');
        return;
    }

    const dateTime = `${reservationDate}T${reservationTime}`;
    
    if (isTimeSlotAvailable(tableNumber, dateTime)) {
        
        availableTables[tableNumber - 1].reserved = true; 

        occupiedTables.push({
            number: tableNumber, 
            customer: customerName,
            dateTime: dateTime
        });
        renderTables();
        document.getElementById('customerName').value = '';
        document.getElementById('tableNumber').value = '';
        document.getElementById('reservationDate').value = '';
        document.getElementById('reservationTime').value = '';
        alert(`Mesa ${tableNumber} reservada para ${customerName} el ${reservationDate} a las ${reservationTime}`);
    } else {
        alert('La mesa no está disponible en ese horario. Debe haber mínimo 3 horas de diferencia.');
    }
}


function setMinDateTime() {
    const now= new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0,5);
    
    document.getElementById('reservationDate').min = today;
    document.getElementById('reservationTime').min = currentTime;
}

function isTimeSlotAvailable(tableNumber, newDateTime) {
    const newTime = new Date(newDateTime);
    const minDifference = 3 * 60 * 60 * 1000; 

    for (let reservation of occupiedTables) {
        if (reservation.number === tableNumber) {
            const existingTime = new Date(reservation.dateTime);

            if (newTime.toDateString() === existingTime.toDateString()) {
            const timeDifference = Math.abs(newTime - existingTime);
            if (timeDifference < minDifference) {
            return false;
            }
            }
        }
    }
    return true;
}

function releaseTable(tableNumber){
    const index = occupiedTables.findIndex(t => t.number === tableNumber);
    if(index !== -1){
        
        occupiedTables.splice(index, 1);
        renderTables();
    }
}

function generateReport(){
    const reportOutput = document.getElementById('reportOutput');
    reportOutput.textContent = 'Reporte de Reservas:\n\n';

    occupiedTables.forEach(table => {
        const date = new Date(table.dateTime);
        const formattedDate = date.toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit'});
        const formattedTime = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        
        reportOutput.textContent += `Mesa ${table.number} - Reservada por: ${table.customer} el día ${formattedDate} a las ${formattedTime}\n`;
    });

    if(occupiedTables.length === 0){
        reportOutput.textContent += 'No hay reservas actuales.';
    }
}
renderTables();
