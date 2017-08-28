let app = angular.module('myApp', []);
app.filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            let lastspace = value.lastIndexOf(' ');
            if (lastspace !== -1) {
                //Also remove . and , so its gives a cleaner result.
                if (value.charAt(lastspace - 1) === '.' || value.charAt(lastspace - 1) === ',') {
                    lastspace = lastspace - 1;
                }
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});
app.controller('myCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.event = {
        eId: "",
        eNaziv: "",
        eOpis: "",
        eOcena: "",
        eCena: "",
        eDatum: "",
        eDatumDani: "",
        eLokacija: "",
        lat: "",
        lng: ""
    };


    $http.get('/api/index', {}, {params: $scope.event})
        .then(function (res) {
            $scope.event = res.data;
            console.log($scope.event);

            let locations = [];
            $scope.event.forEach(function (item) {
                console.log(parseFloat(item.lat),item.lat);
                locations.push({lat: parseFloat(item.lat), lng: parseFloat(item.lng)})
            });
            initMap(locations);
        });

    $http.get('/api/checkSession', {}, {params: $scope.formData})
        .then(function (res) {
            $scope.checkSession = !!res.data;
        });

    let initMap = function initMap(locations) {

        let map = new google.maps.Map(document.getElementById('map'), {
            zoom: 7,
            center: {lat: 44.812045, lng: 20.439453}
        });

        // Create an array of alphabetical characters used to label the markers.
        let labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        // Add some markers to the map.
        // Note: The code uses the JavaScript Array.prototype.map() method to
        // create an array of markers based on a given "locations" array.
        // The map() method here has nothing to do with the Google Maps API.
        let markers = locations.map(function (location, i) {
            return new google.maps.Marker({
                position: location,
                label: labels[i % labels.length]
            });
        });

        // Add a marker clusterer to manage the markers.
        let markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    }
//    todo prekopirati initMAP u event

}]);