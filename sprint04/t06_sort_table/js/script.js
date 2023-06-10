window.addEventListener('DOMContentLoaded', () => {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const headers = ['Name', 'Strength', 'Age'];
  const data = [
    ['Black Panther', '66', '53'],
    ['Captain Marvel', '97', '26'],
    ['Hulk', '80', '49'],
    ['Spider-Man', '78', '16'],
    ['Thanos', '95', '1000'],
    ['Thor', '95', '1000'],
    ['Yon-Rogg', '73', '52'],
    ['Iron Man', '88', '48'],
    ['Captain America', '79', '137'],
  ];

  const headerRow = document.createElement('tr');
  headers.forEach((header, index) => {
    const th = document.createElement('th');
    th.textContent = header;
    th.addEventListener('click', () => sortTable(index));
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  data.forEach(rowData => {
    const row = document.createElement('tr');
    rowData.forEach(cellData => {
      const td = document.createElement('td');
      td.textContent = cellData;
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });

  table.appendChild(tbody);

  const main = document.querySelector('main');
  const placeholder = document.getElementById('placeholder');

  placeholder.innerHTML = '';
  placeholder.appendChild(table);

  table.sortedColumn = -1;
  table.sortedOrder = '';
});

function sortTable(columnIndex) {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.rows);

  rows.sort((a, b) => {
    const cellA = a.cells[columnIndex].textContent.trim();
    const cellB = b.cells[columnIndex].textContent.trim();

    if (columnIndex === 1 || columnIndex === 2) {
      const numericA = parseFloatCustom(cellA);
      const numericB = parseFloatCustom(cellB);

      if (isNaNCustom(numericA) || isNaNCustom(numericB)) {
        return cellA.localeCompare(cellB);
      }

      return numericA - numericB;
    }

    return cellA.localeCompare(cellB);
  });

  if (table.sortedColumn === columnIndex && table.sortedOrder === 'ASC') {
    rows.reverse();
    table.sortedOrder = 'DESC';
  } else {
    table.sortedColumn = columnIndex;
    table.sortedOrder = 'ASC';
  }

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  rows.forEach(row => tbody.appendChild(row));

  const notification = document.getElementById('notification');
  notification.textContent = `Sorting by ${table.rows[0].cells[columnIndex].textContent}, order: ${table.sortedOrder}`;
}

function parseFloatCustom(value) {
  const floatValue = +value;
  return !isNaNCustom(floatValue) ? floatValue : NaN;
}

function isNaNCustom(value) {
  return value !== value;
}

