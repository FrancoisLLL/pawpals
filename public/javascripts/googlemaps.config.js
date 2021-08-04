function initializeAutocomplete(id) {
    const element = document.getElementById(id);
    console.log(element)
    if (element) {
      new google.maps.places.Autocomplete(element, { types: ['geocode'] });
    }
  }

  google.maps.event.addDomListener(window, 'load', function() {
    initializeAutocomplete('address');
  });