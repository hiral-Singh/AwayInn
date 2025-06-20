
   mapboxgl.accessToken = mapToken;

  const map = new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: listing.geometry.coordinates, // starting position [lng, lat]
    // center: coordinates,
    zoom: 9 // starting zoom
  });



  // Create a default Marker and add it to the map.

const marker1 = new mapboxgl.Marker({color:"red"})
    .setLngLat(listing.geometry.coordinates)
    // .setLngLat(coordinates)

    .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h4>${listing.location}</h4><p>Exact location will be provided after booking</p>`))
    .addTo(map);
 