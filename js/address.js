/*
  File: js/address.js
  Purpose: Mock address/service search for nearby citizen services.
*/

(function initAddressSearch() {
  const form = document.getElementById("address-search-form");
  const input = document.getElementById("address-query");
  const results = document.getElementById("address-results");

  if (!form || !input || !results) {
    return;
  }

  // MOCK: Static service inventory for wireframe demo.
  const services = [
    { name: "Family Support Center", city: "Indianapolis", zip: "46204", distance: "1.4 mi" },
    { name: "Workforce Career Hub", city: "Fort Wayne", zip: "46802", distance: "3.1 mi" },
    { name: "Child Care Access Office", city: "Bloomington", zip: "47404", distance: "2.0 mi" },
    { name: "Community Health Desk", city: "South Bend", zip: "46601", distance: "4.3 mi" }
  ];

  function render(items) {
    if (!items.length) {
      results.innerHTML = '<p class="card">No matches found. Try another city or ZIP.</p>';
      return;
    }

    results.innerHTML = items
      .map(function toCard(item) {
        return (
          '<article class="card">' +
          '<h3>' + item.name + '</h3>' +
          '<p><strong>City:</strong> ' + item.city + '</p>' +
          '<p><strong>ZIP:</strong> ' + item.zip + '</p>' +
          '<p><span class="badge">' + item.distance + '</span></p>' +
          '</article>'
        );
      })
      .join("");
  }

  render(services);

  form.addEventListener("submit", function onSearch(event) {
    event.preventDefault();
    const query = input.value.trim().toLowerCase();

    const filtered = services.filter(function byAddress(item) {
      return item.city.toLowerCase().includes(query) || item.zip.includes(query);
    });

    render(filtered);
  });
})();
