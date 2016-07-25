app.factory('LineChartService', function ($http) {
    var fac = {};

    // get all sales
    fac.getSales = function (d) {
        return $http({ url: 'Home/GetSales' });
    }

    // get sales by date
    fac.getSalesByDate = function (from_date, to_date) {
        var response = $http({
            method: "post",
            url: "Home/GetSalesByDate",
            params: {
                from_date: JSON.stringify(from_date),
                to_date: JSON.stringify(to_date),
            }
        });
        return response;
    }

    return fac;

});