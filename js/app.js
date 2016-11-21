angular.module('data', ['ngRoute', 'ngCookies','toaster', 'ngAnimate'])
    .controller('homeController', function ($scope,httpService) {
        httpService.getSomething().then(function(response){
            console.log(response)
        },function errorCallback(response){
            console.log(response)
        })
        $scope.message = 'Hello Home';
        $scope.foo = null;
    })
    .controller('loginController',function($scope,httpService,$location,$cookies){
        $scope.user = {
            userName:'',
            password:''
        };
        $scope.login = function(){
            httpService.getLogin($scope.user).then(function(response){
                if(response.data.status===true){
                    $cookies.put('ARC_UserToken',response.data.token)
                    $location.path('/home')
                }
            })
        }
    })
    .controller('configureController',function($scope,httpService){

    })
    .controller('planController',function($scope,httpService){

    })
    .controller('patientController',function($scope,httpService){

    })
    .controller('protocolController',function($scope,httpService){

    })
    .controller('requestaccountController',function($scope,httpService){

    })
    .directive('navigation', function ($route,logoutService,trackPageAccess) {
        return {
            restrict: 'E',
            templateUrl: 'templates/components/navigation.html',
            link: function (scope) {
                trackPageAccess.postData();
                scope.routesArray = [];
                scope.logOut = function(){
                    logoutService.logout()
                };
                angular.forEach($route.routes, function (value, key) {
                    value.url = "#" + value.originalPath;
                    if (value.name != undefined) {
                        scope.routesArray.push(value)
                    }
                });
            }
        };
    })
    .service('logoutService',function($cookies,$location){
        var logoutWorker = {}
        logoutWorker.logout = function(){
            console.log('logging out now');
            $cookies.put('ARC_UserToken','')
            $location.path('/login')
        };
        return logoutWorker;
    })
    .service('httpService', function ($http,$cookies,logoutService){
        var httpWorker = {};
        httpWorker.getSomething = function(){
            if(httpWorker.checkCookie('ARC_UserToken')!=null){
                console.log('logged in')
                httpWorker.reqSpecs.headers.ARC_UserToken=httpWorker.checkCookie('ARC_UserToken');
                return $http({
                    method:'GET',
                    url:httpWorker.apiRoot.dev+'/foo',
                    headers:httpWorker.reqSpecs.headers
                })
            } else {
                console.log('not logged in')
                logoutService.logout()
            }
            // return $http({
            //     method:'GET',
            //     url:''
            //     // headers:
            // })
        };
        httpWorker.getAuth = function(myCookie){
            return $http({
                    method:'GET',
                    url:httpWorker.apiRoot.dev+'/Authorize/' + myCookie,
                    headers:httpWorker.reqSpecs.headers
                }
            )
        };
        httpWorker.checkCookie = function(token){
            return $cookies.get(token)
        };
        httpWorker.getLogin = function(user){
            return $http({
                url:httpWorker.apiRoot.dev+'/Authorize/login/'+user.userName+'/'+user.password,
                method:'GET',
                headers:''
            })
        };
        httpWorker.apiRoot = {
            prod: "https://prometheus.mdanderson.edu/dataapi",
            dev: "https://gumedonc-dev.mdanderson.edu/dataapi",
            local: "http://localhost:56700/",
            prodRoot: "https://prometheus.mdanderson.edu",
            devRoot: "https://gumedonc-dev.mdanderson.edu",
            localRoot: "http://localhost:56700"
        };
        httpWorker.keys = {
            id:'beb4f299-cdeb-4de6-a993-05e7f593505e',
            appSecret:'dd84b31f-9bef-4b98-95a8-8953ebc9a50f'
        };
        httpWorker.reqSpecs = {
            method:'',
            url:'',
            headers:{
                'content-type':'application/json',
                'cache-control':'no-cache',
                //'Cookie':'',
                'ARC_UserToken':'',
                // 'ArcAppPublicKey':'beb4f299-cdeb-4de6-a993-05e7f593505e',
                //private key for app
                'ArcAppPrivateKey':'a48ddc36-dd81-49b6-95fe-dbaaa6a272ac'
            }
        };
        return httpWorker;
    })
    .service('ajaxService',function(){
        var ajaxWorker = {}
        ajaxWorker.apiRoot = {
            prod: "https://prometheus.mdanderson.edu/dataapi",
            dev: "https://gumedonc-dev.mdanderson.edu/dataapi",
            local: "http://localhost:56700/",
            prodRoot: "https://prometheus.mdanderson.edu",
            devRoot: "https://gumedonc-dev.mdanderson.edu",
            localRoot: "http://localhost:56700"
        };
        ajaxWorker.keys = {
            id:'beb4f299-cdeb-4de6-a993-05e7f593505e',
            appSecret:'dd84b31f-9bef-4b98-95a8-8953ebc9a50f'
        };
        ajaxWorker.reqSpecs = {
            method:'',
            url:'',
            headers:{
                'content-type':'application/json',
                'cache-control':'no-cache',
                //'Cookie':'',
                'ARC_UserToken':'',
                'ArcAppPublicKey':'beb4f299-cdeb-4de6-a993-05e7f593505e',
                'ArcAppPrivateKey':'da0300e5-fde0-4392-938e-02dc71610e93'
            }
        };
        return ajaxWorker;
    })
    .service('trackPageAccess',function($window,$http){
        var trackingWorker = {};
        var trackingObject = {
            path : window.location.href,
            width : $window.window.innerWidth,
            height : $window.window.innerHeight
        };
        trackingWorker.postData = function(){
            console.log(trackingObject)
            return $http({
                data:{URL:trackingObject.path,height:trackingObject.height,width:trackingObject.width},
                method:'POST',
                url:'/Prometheus/Administration/Tracking/TrackPageAccess'
            })
        };
        return trackingWorker;
    })
    .config(function ($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: '/templates/home.html',
                controller: 'homeController',
                icon:'fa-home'
            })
            .when('/configure', {
                templateUrl: '/templates/configure.html',
                controller: 'configureController',
                icon:'fa-cogs',
                name: 'Configure',
                menu:'main'
            })
            .when('/plan', {
                templateUrl: '/templates/plan.html',
                controller: 'planController',
                icon:'fa-file-text',
                name: 'Plan',
                menu:'main'
            })
            .when('/patient', {
                templateUrl: '/templates/patient.html',
                controller: 'patientController',
                icon:'fa-users',
                name: 'Patient',
                menu:'main'
            })
            .when('/requestaccount', {
                templateUrl: '/templates/requestaccount.html',
                controller: 'requestaccountController',
                icon:'fa-share-alt'
            })
            .when('/protocol', {
                templateUrl: '/templates/protocol.html',
                controller: 'protocolController',
                icon:'fa-share-alt',
                name: 'Protocol',
                menu:'main'
            })
            .when('/login', {
                templateUrl: '/templates/login.html',
                controller: 'loginController',
                icon:''
            })
            .otherwise({
                redirectTo: '/login'
            })
    });
