(function() {
  const lat = -16.503831;
  const lng = -68.1317191;
  const mapa = L.map('mapa').setView([lat, lng ], 15);
  

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapa);


})()
