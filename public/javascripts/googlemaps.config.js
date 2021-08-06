function initializeAutocomplete(id) {
  const element = document.getElementById(id);
  if (element) {
    const autocomplete = new google.maps.places.Autocomplete(element, {
      types: ['geocode']
    });
    google.maps.event.addListener(autocomplete, 'place_changed', onPlaceChanged);

    // console.log(autocomplete);
  }
}

google.maps.event.addDomListener(window, 'load', function () {
  initializeAutocomplete('address');
});

function onPlaceChanged() {
  const place = this.getPlace();
  const lat = place.geometry.location.lat();
  const lng = place.geometry.location.lng();

  const inputLat = document.getElementById("lat");
  const inputLng = document.getElementById("lng");

  inputLat.value = lat;
  inputLng.value = lng;
}
