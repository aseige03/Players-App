// Fetch and display the roster by week, sectioned by team_side and position
const csvFile = 'roster_info.csv';
const weekSelect = document.getElementById('week-select');
const rosterDisplay = document.getElementById('roster-display');

// Helper: Parse CSV to array of objects
function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    // Handle quoted URLs
    const values = [];
    let current = '', inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') inQuotes = !inQuotes;
      else if (char === ',' && !inQuotes) { values.push(current); current = ''; }
      else current += char;
    }
    values.push(current);
    const obj = {};
    headers.forEach((h, idx) => obj[h.trim()] = values[idx]?.replace(/^"|"$/g, ''));
    return obj;
  });
}

// Helper: Group by key
function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    (acc[item[key]] = acc[item[key]] || []).push(item);
    return acc;
  }, {});
}

// Load CSV and initialize
fetch(csvFile)
  .then(res => res.text())
  .then(text => {
    const data = parseCSV(text);
    const weeks = [...new Set(data.map(row => row.week))].sort((a, b) => +a - +b);
    // Populate week select
    weekSelect.innerHTML = weeks.map(w => `<option value="${w}">${w}</option>`).join('');
    weekSelect.value = weeks[0];
    weekSelect.addEventListener('change', () => renderRoster(data, weekSelect.value));
    renderRoster(data, weekSelect.value);
  });

function renderRoster(data, week) {
  const weekRoster = data.filter(row => row.week === week);
  const bySide = groupBy(weekRoster, 'team_side');
  const sections = ['Offense', 'Defense', 'Special Teams'];
  let html = '';
  sections.forEach(side => {
    if (!bySide[side]) return;
    html += `<div class="section"><h2>${side}</h2>`;
    const byPosition = groupBy(bySide[side], 'position');
    html += '<div class="positions">';
    Object.keys(byPosition).sort().forEach(pos => {
      html += `<div class="position"><h3>${pos}</h3><div class="players">`;
      byPosition[pos].forEach(player => {
        html += `<div class="player">
          <img src="${player.headshot_url}" alt="${player.player_name}">
          <div class="player-info">
            <span class="player-name">${player.player_name}</span>
            <span class="player-details">#${player.jersey_number} &mdash; ${player.position}</span>
          </div>
        </div>`;
      });
      html += '</div></div>';
    });
    html += '</div></div>';
  });
  rosterDisplay.innerHTML = html;
}
