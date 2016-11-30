angular.module('data', ['ngRoute', 'ngCookies','toaster', 'ngAnimate','ui.bootstrap'])
    .controller('homeController', function ($scope,httpService) {
        httpService.getSomething().then(function(response){
            console.log(response)
            $scope.something = response.data
        },function errorCallback(response){
            console.log(response)
        })
        $scope.message = 'Hello Home';
        $scope.foo = null;

        var data = null;

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
        $scope.fields = [];

        httpService.getData('Data/Fields').then(function(response){
            // console.log(response)
            angular.forEach(response.data,function(value,key){
                // console.log(value)
                value.hide = true;
                value.edit = false;
                $scope.fields.push(value)
            })

        },function errorCallBack(response){
            // console.log(response)
        })
        $scope.submitChanges = function(items){
            console.log(items)
            console.log($scope.fields)
            httpService.putData('Data/Field/',items.id,items).then(function(response){
                console.log(response)
            },function errorCallabck(response){
                console.log(response)
            })
        }
        console.log($scope)
    })
    .controller('planController',function($scope,httpService){

    })
    .controller('patientController',function($scope,httpService){

    })
    .controller('protocolController',function($scope,httpService){

    })
    .controller('requestaccountController',function($scope,httpService){

    })
    .directive('navigation', function ($route,logoutService,trackPageAccess,httpService,$location) {
        return {
            restrict: 'E',
            templateUrl: 'templates/components/navigation.html',
            link: function ($scope, $element, $attrs) {
                $scope.location = $location.$$path;
                $scope.open = false;
                $scope.userInfo = {}
                $scope.welcomeButton = function(){
                    $scope.open = !$scope.open;
                }
                $scope.routesArray = [];
                $scope.logOut = function(){
                    logoutService.logout()
                };
                $scope.loggedIn = httpService.checkCookie('ARC_UserToken')!='';

                angular.forEach($route.routes, function (value, key) {
                    value.url = "#" + value.originalPath;
                    if (value.name != undefined) {
                        $scope.routesArray.push(value)
                    }
                });

                $scope.$location = location;
                $scope.$on("$routeChangeSuccess",function(event,current,previous){
                    $scope.loggedIn = httpService.checkCookie('ARC_UserToken')!='';
                    trackPageAccess.postData();
                    httpService.getUser().then(function(response){
                        // console.log(response)
                        $scope.userInfo = response.data;
                    },function errorCallback(response){
                        // console.log(response)
                    })
                    $scope.open = false;

           //          console.log(current)
           // console.log(event)
           //          console.log(previous)
           //          console.log(httpService.checkCookie('ARC_UserToken')!='')
                })
            }
        };
    })
    .service('logoutService',function($cookies,$location){
        var logoutWorker = {}
        logoutWorker.logout = function(){
            console.log('logging out now');
            $cookies.put('ARC_UserToken','')
            $location.path('/login')
            return;
        };
        return logoutWorker;
    })
    .service('httpService', function ($http,$cookies,logoutService){
        var httpWorker = {};
        httpWorker.getSomething = function(){
            if(httpWorker.checkCookie('ARC_UserToken')!=null){
                // console.log('logged in')
                httpWorker.reqSpecs.headers.ARC_UserToken=httpWorker.checkCookie('ARC_UserToken');
                // console.log(httpWorker.reqSpecs.headers)

                httpWorker.getAuth(httpWorker.checkCookie('ARC_UserToken')).then(function(response){
                    console.log(response)
                    if(response.data===true){
                        console.log(response.data)

                    } else {
                        return response;
                        console.log('not logged in');
                        logoutService.logout()
                    }
                },function errorCallback(response){
                    console.log(response)
                });

                return $http({
                    method:'GET',
                    url:httpWorker.apiRoot.getPath()+'/Data/Fields',
                    headers:httpWorker.reqSpecs.headers
                })
            } else {
                // console.log('not logged in')
                logoutService.logout()
            }
        };
        httpWorker.getUser = function(){
            return httpWorker.getData('User/',httpWorker.checkCookie('ARC_UserToken'))
        };
        httpWorker.putData = function(path1,param,data){
            param = param?param:'';
            //path2 = path2?path2:'';
            if(httpWorker.checkCookie('ARC_UserToken')!=null){
                // console.log('logged in')
                httpWorker.reqSpecs.headers.ARC_UserToken=httpWorker.checkCookie('ARC_UserToken');
                // console.log(httpWorker.reqSpecs.headers)
                return $http({
                    method:'PUT',
                    url:httpWorker.apiRoot.getPath()+path1+param,
                    data:data,
                    headers:httpWorker.reqSpecs.headers
                })
            } else {
                // console.log('not logged in');
                logoutService.logout()
            }
        };
        httpWorker.getData = function(path1,param,path2){
            param = param?param:'';
            path2 = path2?path2:'';
            if(httpWorker.checkCookie('ARC_UserToken')!=null){
                httpWorker.reqSpecs.headers.ARC_UserToken=httpWorker.checkCookie('ARC_UserToken');
                httpWorker.getAuth(httpWorker.checkCookie('ARC_UserToken')).then(function(response){
                    if(response.data!=true){
                        console.log('not logged in');
                        logoutService.logout()
                    }

                },function errorCallback(response){
                    console.log(response)
                });
                // console.log(httpWorker.reqSpecs.headers)
                return $http({
                    method:'GET',
                    url:httpWorker.apiRoot.getPath()+path1+param+path2,
                    headers:httpWorker.reqSpecs.headers
                })
            } else {
                // console.log('not logged in');
                logoutService.logout()
            }
        };
        httpWorker.getAuth = function(myCookie){
            return $http({
                    method:'GET',
                    url:httpWorker.apiRoot.getPath()+'/Authorize/' + myCookie,
                    headers:httpWorker.reqSpecs.headers
                }
            )
        };
        httpWorker.checkCookie = function(token){
            return $cookies.get(token)
        };
        httpWorker.getLogin = function(user){
            return $http({
                url:httpWorker.apiRoot.getPath()+'/Authorize/login/'+user.userName+'/'+user.password,
                method:'GET',
                headers:''
            })
        };
        httpWorker.apiRoot = {
            //set setState as dev, prod, or local
            setState:'dev',
            prod: 'https://prometheus.mdanderson.edu/dataapi/',
            dev: 'https://gumedonc-dev.mdanderson.edu/dataapi/',
            local: 'http://localhost:56700/',
            prodRoot: 'https://prometheus.mdanderson.edu',
            devRoot: 'https://gumedonc-dev.mdanderson.edu',
            localRoot: 'http://localhost:56700',
            getPath: function(){
                var thePath = httpWorker.apiRoot.local;

                return thePath;
            }
        };
        httpWorker.reqSpecs = {
            method:'',
            url:'',
            headers:{
                'content-type':'application/json',
                'cache-control':'no-cache',
                //'Cookie':'',
                'ARC_UserToken':'',
                'ArcAppPublicKey':'371507A2-C5FB-4842-9AD5-477BA3A33A68',
                //private key for app
                'ArcAppPrivateKey':'a48ddc36-dd81-49b6-95fe-dbaaa6a272ac'
            }
        };
        return httpWorker;
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
                templateUrl: 'templates/home.html',
                controller: 'homeController',
                icon:'fa-home'
            })
            .when('/configure', {
                templateUrl: 'templates/configure.html',
                controller: 'configureController',
                icon:'fa-cogs',
                name: 'Configure',
                menu:'main'
            })
            // .when('/plan', {
            //     templateUrl: 'templates/plan.html',
            //     controller: 'planController',
            //     icon:'fa-file-text',
            //     name: 'Plan',
            //     menu:'main'
            // })
            .when('/patient', {
                templateUrl: 'templates/patient.html',
                controller: 'patientController',
                icon:'fa-users',
                name: 'Patient',
                menu:'main'
            })
            .when('/requestaccount', {
                templateUrl: 'templates/requestaccount.html',
                controller: 'requestaccountController',
                icon:'fa-share-alt'
            })
            .when('/protocol', {
                templateUrl: 'templates/protocol.html',
                controller: 'protocolController',
                icon:'fa-share-alt',
                name: 'Protocol',
                menu:'main'
            })
            .when('/login', {
                templateUrl: 'templates/login.html',
                controller: 'loginController',
                icon:''
            })
            .otherwise({
                redirectTo: '/login'
            })
    });
