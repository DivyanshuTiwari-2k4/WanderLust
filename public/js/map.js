function initMap() {
    console.log("Google Maps script loaded successfully!");

    const mapDataElement = document.getElementById("map-data");
    const mapTitleElement = document.getElementById("map-title");

    if (!mapDataElement || !mapTitleElement) {
        console.error("Map data elements not found in DOM!");
        return;
    }

    const coordinates = JSON.parse(mapDataElement.textContent);
    console.log("Coordinates: ", coordinates);

    const map = new google.maps.Map(document.getElementById("map"), {
        center: coordinates,
        zoom: 14,
    });

    new google.maps.Marker({
        position: coordinates,
        map: map,
        title: mapTitleElement.textContent,
    });
}
