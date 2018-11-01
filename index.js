let json = [];

/* eslint no-alert:0 */
/* global INITIAL_LAT INITIAL_LNG google:true */

$.getScript(`https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`)

function initMap() {
  // main map loading
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: INITIAL_LAT,
      lng: INITIAL_LNG,
    },
    zoom: 10,
  });

  // click listener for adding new markers
  google.maps.event.addListener(map, 'click', (event) => {
    // sending prompt's answer + the click location to the marker creation function
    let name = prompt('Please enter your marker name', 'Home')
    // TODO: add validation to name using regex
    while (json[name]) {
      name += '(1)';
    }

    placeMarker(name, event.latLng)
    addToJson(name, event.latLng);
    addToList(name);

  });

  // loading data from json
  $.getJSON('data.json', (result) => {
    json = result;
    loadFromJson();
  });
}

function loadFromJson() {
  json.forEach((e) => {
    const location = new google.maps.LatLng(e.latitude, e.longitude);

    addToList(e.nome, e.icone, e.status);
    placeMarker(e.nome, location, e.icone);
  });
}

function placeMarker(name, location, icon = null) {

  // creating a marker
  // in case of a null icon, it will load the default
  var marker = new google.maps.Marker({
    position: location,
    animation: google.maps.Animation.DROP,
    map: map,
    title: name,
    icon: icon
  });

  // centering the map to the new marker location
  map.setCenter(location);

  marker.addListener('click', function () {
    infowindow.open(map, marker);
  });

  // the info window (when the marker is clicked) will only display its name
  var infowindow = new google.maps.InfoWindow({
    content: marker.title
  });

}

// adding to the variable list, later will be saved to a json file
function addToJson(name, location) {
  json.push({
    nome: name,
    status: 'ok',
    longitude: location.lng(),
    latitude: location.lat(),
    icone: null
  })

  // TODO: save to json
}

function addToList(name, icone, status) {

  const newButton = document.createElement('button');
  // setting the text color
  const color = status === 'ok' ? 'blue-color' : 'red-color';
  newButton.classList = 'list-group-item list-group-item-action ' + color;
  newButton.textContent = name + " ";
  const icon = document.createElement('img');
  if (icone !== null || icone !== undefined) {
    icon.src = icone;
  }
  newButton.append(icon);

  const group = $('.list-group').append(newButton);

  // on button click this will center the map on that marker
  group.click((e) => {
    e.preventDefault();

    const objName = e.target.textContent;
    let obj = {};

    for (let index = 0; index < json.length; index++) {
      if (json[index].nome == objName) {
        obj = json[index];
        break;
      }
    }

    const location = new google.maps.LatLng(obj.latitude, obj.longitude);
    map.setCenter(location);
  });
}