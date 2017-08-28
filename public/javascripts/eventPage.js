/**
 * Created by malet on 20-Jul-17.
 */
var app = angular.module('myApp', []);

app.controller('myCtrl', ['$scope', '$http', '$window', function ($scope, $http,$window) {

    $scope.event = {
        eId: "",
        naziv: "",
        opis: "",
        ocena: "",
        cena: "",
        lokacija: "",
        datum: "",
        datumDani: ""
    };

    $http.get('/api/getEvent', {params:{eId: window.location.href.match(/\w{10}$/g)}})
        .then(function (res) {
            $scope.res = res.data;
        });


}]);