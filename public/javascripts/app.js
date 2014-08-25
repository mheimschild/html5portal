var framework = angular.module('Framework', []);

framework.service('Share', function() {
    if (!window.Share) {
        window.Share = {
            callbacks: [],
            values: {},
            setValue: function(name, value) {
                this.values[name] = value;
                for (var i = this.callbacks.length; i--; ) {
                    if (this.callbacks[i].name === name) {
                        this.callbacks[i].cb(value);
                    }
                }
            },
            
            registerListener: function(name, cb) {
                this.callbacks.push({ name: name, cb: cb});
            }
        };
    }
    
    return window.Share;
});

var app1 = angular.module('App1', ['Framework', 'ngRoute']);
var app2 = angular.module('App2', ['Framework', 'ngRoute']);

app1.config(function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/app1/index.html', controller: 'App1.CustomerSearch'});
    $routeProvider.when('/customer/:name', {templateUrl: 'partials/app1/customer.html', controller: 'App1.Customer', resolve: {customer: function($route) {
        return $route.current.params.name;
    }}});
});

app1.controller('App1.CustomerSearch', function($scope, $location) {
    $scope.search = function() {
        if ($scope.name) {
            $location.path('/customer/' + $scope.name);
        }
    };
});

app1.controller('App1.Customer', function($scope, customer, Share, $location) {
    $scope.select = function() {
        Share.setValue('customerId', $scope.customerId);
    };
    
    $scope.back = function() {
        $location.path('/');
    };
});

app2.controller('App2.Calculation', function(customerId) {
    console.log('here we are...');
    $scope.customerId = customerId;
});

app2.config(function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/app2/index.html'});
    $routeProvider.when('/app2/customer/:customerId', {templateUrl: 'partials/app1/customer.html', controller: 'App2.Calculation', resolve: {customerId: function($route) {
        console.log('?????');
        return $route.current.params.customerId;
    }}});
});

app2.run(function(Share, $location) {
    Share.registerListener('customerId', function(customerId) {
        $location.path('/app2/customer/' + customerId);
        console.log($location.path());
    });
});

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById('app1'), ['App1']);
    angular.bootstrap(document.getElementById('app2'), ['App2']);
});

// controller names must be prefixed
// framework must be bootstraped manually