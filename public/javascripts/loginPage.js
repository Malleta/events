var app = angular.module('myApp', []);



app.controller('myCtrl',['$scope', '$http', function ($scope, $http) {

 $scope.uEmail = '';
 $scope.uPassword = '';



    $scope.check = function () {
        $http.post('/api/login',{}, {params: {uEmail: $scope.uEmail, uPassword: $scope.uPassword} })
            .then(function (res) {
                res = res.data;
                if(res.status){
                    window.location = "/profile";
                } else {
                    Materialize.toast(res.msg, 5000);
                }
            });
    }

}]);