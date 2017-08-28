var app = angular.module('myApp', []);

app.controller('myCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.formData = {
        firstName: "",
        lastName: "",
        location: "",
        password: "",
        email: ""
    };

    $http.get('/api/profile', {}, {params: $scope.formData})
        .then(function (res) {
            $scope.res = res.data;
        });





}]);