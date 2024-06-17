function loadTableData(data) {
    const table = document.getElementById('sortableTable');
    const tbody = table.tBodies[0];
    tbody.innerHTML = ''; // Clear any existing rows

    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.songName}</td>
            <td>${row[1]}</td>
            <td>${row[2]}</td>
            <td>${row[3]}</td>
            <td>${row.combined}</td>
            <td>${row.section2twice}</td>
            <td>${row.sectionAvg}</td>
        `;
        tbody.appendChild(tr);
    });

    table.dataset.sortedColumn = "";
}

// Sort table function
function sortTable(columnIndex) {
    const table = document.getElementById('sortableTable');
    const tbody = table.tBodies[0];

    const rows = Array.from(tbody.rows);
    const isNumeric = !isNaN(rows[0].cells[columnIndex].textContent);

    rows.sort((a, b) => {
        const cellA = a.cells[columnIndex].textContent.trim();
        const cellB = b.cells[columnIndex].textContent.trim();
        
        if (isNumeric) {
            return parseFloat(cellA) - parseFloat(cellB);
        } else {
            return cellA.localeCompare(cellB);
        }
    });

    // Toggle the direction if the column is already sorted
    if (table.dataset.sortedColumn == columnIndex) {
        if (table.dataset.isSorted == "true") {
            table.dataset.isSorted = "false";
        } else {
            rows.reverse();
            table.dataset.isSorted = "true";
        }
    }

    table.dataset.sortedColumn = columnIndex;

    // Re-append the sorted rows
    rows.forEach(row => tbody.appendChild(row));
}

function setServer(server) {
    var storage = window.localStorage;
    storage.setItem("server", server);

    if (server === "JP") {
        loadTableData(sectionsJp);
    } else {
        loadTableData(sectionsEn);
    }
}