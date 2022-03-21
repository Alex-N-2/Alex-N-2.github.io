// This part adds the base map
mapboxgl.accessToken = 'pk.eyJ1IjoiYWxleC1uIiwiYSI6ImNsMGk4MjBidDAwNHcza3A2N2FreTBzcWMifQ.a9KuJy-gQL75eDLobB8xrQ';
const map = new mapboxgl.Map({
 container: 'map', // container element id
 style: 'mapbox://styles/alex-n/cl0tjj9t300k714qybgiosdj5',
 center: [-3.9594802, 55.0711366],
 zoom: 9
})

// This part links to the mapbox dataset
const data_url = "https://api.mapbox.com/datasets/v1/alex-n/cl0i72f6d0dj227p9sm8yli9x/features?access_token=pk.eyJ1IjoiYWxleC1uIiwiYSI6ImNsMGk4MjBidDAwNHcza3A2N2FreTBzcWMifQ.a9KuJy-gQL75eDLobB8xrQ"

// This part adds the layer to the map
map.on('load', () => {
 map.addLayer({
 id: 'buildings',
 type: 'circle',
 source: {
 type: 'geojson',
 data: data_url 
 },
 paint: {
 'circle-radius': 4,
 'circle-color': ['match',['get', 'CATEGORY'],
'A','red',
'B','blue',
'C','magenta',
/* other */ 'grey'],
 'circle-opacity': 1
 }
 });

// This part create an event listener and zooms to the selected point
map.on('click', (event) => {
  // If the user clicked on one of your markers, get its information.
  const features = map.queryRenderedFeatures(event.point, {
    layers: ['buildings'] // replace with your layer name
  });
  if (!features.length) {
    return;
  }
  const feature = features[0];
  //Fly to the point when clicked
  map.flyTo({
    center: feature.geometry.coordinates, //keep this
    zoom: 15 //change fly to zoom level
  });
  
  // Code from the next step will go here.
  //Create a new pop up with the style defined in the CSS as my-popup.
  //
  const popup = new mapboxgl.Popup({ offset: [0, -40], className: "my-popup" })
    .setLngLat(feature.geometry.coordinates) //Set the loctaion of the pop up to the marker's long and lat using
    .setHTML(
      //Create some html with a heading h3, and two paragraphs p to display some properties of the marker.
      `<h3>${feature.properties.ENT_TITLE}</h3> 
  <p>Category ${feature.properties.CATEGORY}</p>
  <p><a href=${feature.properties.LINK}>Click for more information</a></p>`
    ) //${feature.properties.xxx} is used to refer to a certain property in the data.
    .addTo(map); //Add this pop up to the map.
  
});  
  
  
  document.getElementById('filters').addEventListener('change', (event) => {
    
    filterC = ['==', ['get', 'CATEGORY'], 'C'];
    
    //for checkbox A, if checked, get category A buildings
    //Else, do nothing
    var checkBoxA = document.getElementById("ACheck");
    if (checkBoxA.checked == true){
      filterA = ['==', ['get', 'CATEGORY'], 'A'];
    } else {
      filterA = ['==', ['get', 'CATEGORY'], 'placeholder'];
    }
    
    //for checkbox B, if checked, get category B buildings
    //Else, do nothing
    var checkBoxB = document.getElementById("BCheck");
    if (checkBoxB.checked == true){
      filterB = ['==', ['get', 'CATEGORY'], 'B'];
    } else {
      filterB = ['==', ['get', 'CATEGORY'], 'placeholder'];
    }  
    
    //for checkbox C, if checked, get category C buildings
    //Else, do nothing
    var checkBoxC = document.getElementById("CCheck");
    if (checkBoxC.checked == true){
      filterC = ['==', ['get', 'CATEGORY'], 'C'];
    } else {
      filterC = ['==', ['get', 'CATEGORY'], 'placeholder'];
    }   
    
    //Set the filter based on the applied filter rules
    map.setFilter('buildings', ['any', filterA,filterB,filterC]);
});



//This changes the cursor when mousing over a point

 map.on('mouseenter', 'buildings', (e) => {
map.getCanvas().style.cursor = 'default';
}); 
  
map.on('mouseleave', 'buildings', () => {
map.getCanvas().style.cursor = '';
});
  
const geocoder = new MapboxGeocoder({
  // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  placeholder: "Search for a place in D&G!", // Placeholder text for the search bar
  proximity: {
    longitude: -3.9594802,
    latitude: 55.0711366,
  } // Coordinates of D&G center
});

map.addControl(geocoder, "top-right");

 //This adds the find my location control
map.addControl(new mapboxgl.GeolocateControl());

//This adds navigation control
map.addControl(new mapboxgl.NavigationControl());
  
 });