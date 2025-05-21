fetch("http://localhost:3000/api/users")
  .then(res => res.json())
  .then(users => {
    const tbody = document.getElementById("userTableBody");
    tbody.innerHTML = "";

    users.forEach(user => {
      const row = document.createElement("tr");
      const statusText = user.blocked ? 'Blocked' : 'Active';
      const statusColor = user.blocked ? 'red-text' : 'green-text';

      row.innerHTML = `
        <td>${user.username || "Unnamed"}</td>
        <td>${user.email}</td>
        <td><span class="${statusColor}">${statusText}</span></td>
        <td>
          <select class="browser-default status-dropdown" id="status-${user._id}">
            <option value="Active" ${!user.blocked ? 'selected' : ''}>Active</option>
            <option value="Blocked" ${user.blocked ? 'selected' : ''}>Blocked</option>
          </select>
          <button class="btn blue btn-small" onclick="updateStatus('${user._id}')">Submit</button>
        </td>
        <td>
          <button class="btn-small orange" onclick="sendWarning('${user.email}')">Warn</button>
        </td>
      `;

      tbody.appendChild(row);
    });
  });

function updateStatus(userId) {
  const dropdown = document.getElementById(`status-${userId}`);
  const newStatus = dropdown.value;

  const endpoint = newStatus === "Blocked"
    ? `http://localhost:3000/api/users/block/${userId}`
    : `http://localhost:3000/api/users/unblock/${userId}`;

  fetch(endpoint, { method: "PATCH" })
    .then(() => location.reload());
}

function sendWarning(email) {
  const msg = prompt(`Enter warning for ${email}:`);
  if (msg) {
    alert(`Warning sent: ${msg}`);
  }
}
