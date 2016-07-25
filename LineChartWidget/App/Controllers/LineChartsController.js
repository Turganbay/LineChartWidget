app.controller('LineChartsController', function ($scope, LineChartService) {

    

    GetSales();

    // get all sales
    function GetSales() {
        var Data = LineChartService.getSalesByDate();
        Data.then(function (sales) {
            $scope.salesData = sales.data
        }, function () {
            alert('Error in getting sales record');
        });
    }
    
    $scope.update = function () {

        //var _from = new Date();
        //var _to = new Date();
        var Data = LineChartService.getSalesByDate($scope.from_date, $scope.to_date);
            Data.then(function (sales) {
                $scope.salesData = sales.data
            }, function () {
                alert('Error in getting sales record');
            });
        
    };
    

});