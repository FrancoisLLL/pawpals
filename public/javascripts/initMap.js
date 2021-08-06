

function initMap() {
    const myLatLng = {
      lat: 48.856614,
      lng: 2.3522219
    };
  
    const lat = document.getElementById("lat");
    const lng = document.getElementById("lng");
    const address = document.getElementById("address");

    const markerLat = {
        lat: Number(lat.innerText),
        lng: Number(lng.innerText)
    }

    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 12,
      center: markerLat,
    });
  
    console.log(markerLat);
    new google.maps.Marker({
      position: markerLat,
      map,
      title: address.innerText,
    });
  }