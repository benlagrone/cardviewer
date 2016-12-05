angular.module('data', ['ngRoute', 'ngCookies','toaster','LocalStorageModule','ngAnimate','ui.bootstrap','angularMoment'])
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
    .controller('configureController',function($scope,httpService,localStorageService,moment){
        function getItem(key) {
            return localStorageService.get(key);
        }
        $scope.enableFeature = {
            addActivity : true,
            addField : true
        };
        $scope.makeTime = {
            time:moment().format('L')
        };
        $scope.userId = getItem('userId');
        $scope.userName = getItem('userName');
        $scope.departmentNiceName = getItem('departmentNiceName');
        $scope.departmentId = getItem('departmentId');
        $scope.fields = [];
        $scope.activities = [];
        $scope.restore = {
            fields : [],
            activities : []
        };
        $scope.newData = {
            field:{
                edit:true,
                hide:true
            },
            activity:{
                edit:true,
                hide:true,
                hideRow:true,
                fields:[]
            }
        };
        $scope.dataTypesList = [];
        $scope.addSymbol = 'fa-plus-square';
        $scope.hideNewActivity = true;
        $scope.hideNewField = true;
        $scope.hideDrawer = true;
        $scope.drawerSymbol ='fa-list';
        $scope.closeDrawerSymbol = 'fa-times-circle';
        $scope.hideFieldSearch = true;
        $scope.addFieldstoActivityTitle;
        $scope.workingActivity;
        $scope.addMouseOver = function(){
            $scope.addSymbol = 'fa-pencil-square';
        };
        $scope.searchFields;
        $scope.addMouseLeave = function(){
            $scope.addSymbol = 'fa-plus-square';
        };
        $scope.addClick = function(){
        };
        $scope.clearNewActivity = function(){
            $scope.newActivity = {};
            $scope.hideNewActivity = true;
            $scope.workingActivity=undefined;
        };
        $scope.clearNewField = function(){
            $scope.newField = {};
            $scope.hideNewField = true;
            $scope.workingField=undefined;
        };
        httpService.getUser().then(function(response){
            $scope.userInfo = response.data;
        },function errorCallback(response){
        });
        httpService.getData('Data/Activities').then(function(response){
            angular.forEach(response.data,function(value,key){
                value.hide = true;
                value.edit = false;
                value.hideRow = false;
                value.openCloseDrawerControls = false;
                    var valTmp = value;
                $scope.activities.push(value);
                $scope.restore.activities.push(valTmp);
            })
        },function errorCallBack(response){
            // console.log(response)
        });
        httpService.getData('Data/Field/DataTypes').then(function(response){
            $scope.dataTypesList = response.data;
        },function errorCallback(response){

        });
        httpService.getData('Data/Fields').then(function(response){
            angular.forEach(response.data,function(value,key){
                value.hide = true;
                value.edit = false;
                value.showIncluded = false;
                $scope.fields.push(value);
                $scope.restore.fields.push(value);
            })
        },function errorCallBack(response){
        });
        $scope.getFieldDataType = function(fileTypeID){
            var usedID;
            angular.forEach($scope.dataTypesList,function(value,index){
              if (value.id===fileTypeID){
                  usedID = value.name
              }
          });
            return usedID;
        };
        $scope.postNewActivity = function(){
            console.log($scope.newData.activity);
            var postData = {
                "fields": $scope.newData.activity.fields,
                "id": $scope.newData.activity.id,
                "name": $scope.newData.activity.name,
                "category": $scope.newData.activity.category,
                "description": $scope.newData.activity.description,
                "isMasterActivity": $scope.newData.activity.isMasterActivity,
                "departmentId": $scope.newData.activity.departmentId,
                "createdById": $scope.newData.activity.createdById,
                "createdDate": $scope.newData.activity.createdDate,
                "modifiedById": $scope.newData.activity.modifiedById,
                "modifiedDate": $scope.newData.activity.modifiedDate
            };
            httpService.postData('Data/Field/',postData).then(function(response){
                console.log(response)
            },function errorCallabck(response){
                console.log(response)
            })
        };
        $scope.submitActivityChanges = function(activity){
            console.log(activity);
            var putData = {
                "fields":[],
                "id": activity.id,
                "name": activity.name,
                "category": activity.category,
                "description": activity.description,
                "isMasterActivity": activity.isMasterActivity,
                "departmentId": activity.departmentId,
                "createdById": activity.createdById,
                "createdDate": activity.createdDate,
                "modifiedById": $scope.userId,
                "modifiedDate": moment().format('L')
            };
            angular.forEach(activity.fields,function(value,index){
               var fieldData = {
                   canBeAutomated:value.canBeAutomated,
                   categoryId:value.categoryId,
                   categoryName:value.categoryName,
                   childFields:value.childFields,
                   createdById:value.createdById,
                   createdDate:value.createdDate,
                   displayName:value.displayName,
                   fieldDataType:value.fieldDataType,
                   fieldParentId:value.fieldParentId,
                   id :value.id,
                   instructions : value.instructions,
                   isMasterField : value.isMasterField,
                   listId:value.listId,
                   modifiedById :value.modifiedById,
                   modifiedDate: value.modifiedDate,
                   name:value.name
               }
               postData.fields.push(fieldData);
            });
            console.log(putData)
            //ready to PUT postData
        };
        $scope.submitFieldChanges = function(field){
            console.log(field);
            var putData = {
                "id": field.id,
                "name": field.name,
                "instructions": field.instructions,
                "fieldDataType": field.fieldDataType,
                "listId": field.listId,
                "fieldParentId": field.fieldParentId,
                "isMasterField": field.isMasterField,
                "canBeAutomated": field.canBeAutomated,
                "categoryId": field.categoryId,
                "categoryName": field.categoryName,
                "createdById": field.createdById,
                "createdDate": field.createdDate,
                "modifiedById": $scope.userId,
                "modifiedDate": moment().format('L'),
                "childFields": field.childFields
            }
            console.log(putData)
            //ready to put postdatas
        };
        $scope.drawerMouseLeave = function(){
            $scope.drawerSymbol = 'fa-list'
        };
        $scope.drawerMouseOver = function(){
            $scope.drawerSymbol = 'fa-arrow-left'
        };
        $scope.closeDrawerMouseOver = function(){
            if($scope.closeDrawerSymbol != 'fa-arrow-circle-right')
            $scope.closeDrawerSymbol = 'fa-arrow-circle-right';
        };
        $scope.closeDrawerMouseLeave = function(){
            if($scope.closeDrawerSymbol != 'fa-times-circle')
            $scope.closeDrawerSymbol = 'fa-times-circle';
        };
        $scope.showFieldSearch = function(){
            $scope.hideFieldSearch = false;
        };
        $scope.searchFieldsMouseLeave = function(){
            // if(!$scope.searchFields)
            // $scope.hideFieldSearch = true;
        };
        $scope.closeFieldsSearch = function(){
            // if(!$scope.searchFields)
            $scope.hideFieldSearch = true;
            $scope.searchFields = undefined;
        };
        $scope.showDrawerClose = function(){
            $scope.hideDrawer=true;
            $scope.searchFields = undefined;
            $scope.hideFieldSearch = true;
        };
        $scope.showFieldInDrawer = function(fieldId){
            $scope.hideDrawer = false;
            $scope.searchFields = fieldId;
            $scope.hideFieldSearch = false;
        };
        $scope.addAFieldToActivity = function(activity){
            $scope.workingActivity = activity;
            $scope.hideDrawer = false;
            $scope.addFieldstoActivityTitle = activity.name;
            angular.forEach($scope.fields,function(value,index){
                $scope.fields[index].showIncluded = false;
                angular.forEach(activity.fields,function(value2,index2){
                    if(value2.id===value.id){
                        $scope.fields[index].showIncluded = true;
                    }
                })
            })
        };
        $scope.addThisFieldToActivity = function(obj,field){
            angular.forEach($scope.activities,function(value,index){
                if(value.id===$scope.workingActivity.id){
                    if(obj.target.attributes.data.value==="add"){
                        field.fieldName = field.name;
                        value.fields.push(field);
                        value.edit=true;
                    }
                    if(obj.target.attributes.data.value==="remove"){
                        var foundIndex = undefined;
                        angular.forEach(value.fields,function(Fvalue,Findex){
                            if(Fvalue.id===field.id){
                                foundIndex = Findex;
                            }
                        });
                        value.fields.splice(foundIndex,1);
                        value.edit=true;
                    }
                }
            })
        };
        $scope.toggleFieldsLabel = function(obj,activity){
            angular.forEach($scope.activities,function(value,index){
                if(value.id!=activity.id){
                    $scope.activities[index].openCloseDrawerControls = false;
                } else if (value.id===activity.id){
                    console.log(obj.target.attributes.data.value)
                    if(obj.target.attributes.data.value==='open'){
                        activity.openCloseDrawerControls = true;
                    }
                    if(obj.target.attributes.data.value==='close'){
                        activity.openCloseDrawerControls = false;
                    }
                }
            })
        };
        $scope.addNewActivity = function(){
            $scope.hideNewActivity=!$scope.hideNewActivity;
            console.log($scope.hideNewActivity);
            $scope.activities.push($scope.newData.activity)
        };
        $scope.clearWorkingActivity = function(activity){

            if(!activity){
                $scope.workingActivity = activity;
                angular.forEach($scope.activities,function(value,index){
                    value.openCloseDrawerControls = false;
                })
            } else if(activity){
                if (activity.isMasterActivity!=true){
                }
            }
            var allClosed = true;
            angular.forEach($scope.activities,function(value,index){
                if(value.hide===false){
                    allClosed = false;
                }
            });
            if(allClosed===true){
                angular.forEach($scope.activities,function(value,index){
                   if($scope.workingActivity===value.id){
                       value.openCloseDrawerControls=false;
                   }
                });
                $scope.workingActivity=undefined;
            };
        };
        $scope.undoChanges = function(activity){
            angular.forEach($scope.restore.activities,function(value,key){
                if(value.id===activity.id){
                    httpService.getData('Data/Activity/',activity.id).then(function(response){
                        activity.fields = response.data.fields;
                        $scope.workingActivity.fields = response.data.fields;
                        angular.forEach($scope.fields,function(value,index){
                            value.showIncluded = false;
                            console.log(response.data);
                            angular.forEach(response.data.fields,function(Fvalue,Findex){
                                if(Fvalue.id===value.id){
                                    value.showIncluded = true;
                                }
                            });
                        });
                    },function errorCallback(response){
                        console.log(response)
                    })
                }
            })
        };
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
    .directive('navigation', function ($route,logoutService,trackPageAccess,httpService,$location,localStorageService) {
        return {
            restrict: 'E',
            templateUrl: 'templates/components/navigation.html',
            link: function ($scope,scope, $element, $attrs) {
                httpService.checkAuthLogOut();
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
                        $scope.userInfo = response.data;
                        function submit(key, val) {
                            return localStorageService.set(key, val);
                        }
                        submit('userName',$scope.userInfo.fullName);
                        submit('userId',$scope.userInfo.id);
                        submit('departmentId',$scope.userInfo.departmentId);
                        submit('departmentNiceName',$scope.userInfo.departmentNiceName);
                    },function errorCallback(response){
                        // console.log(response)
                    });
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
                httpWorker.reqSpecs.headers.ARC_UserToken=httpWorker.checkCookie('ARC_UserToken');
                httpWorker.checkAuthLogOut();
                return $http({
                    method:'GET',
                    url:httpWorker.apiRoot.getPath()+'/Data/Fields',
                    headers:httpWorker.reqSpecs.headers
                })
            } else {
                logoutService.logout()
            }
        };
        httpWorker.getUser = function(){
            return httpWorker.getData('User/',httpWorker.checkCookie('ARC_UserToken'))
        };
        httpWorker.postData = function(path1,data){
            if(httpWorker.checkCookie('ARC_UserToken')!=null){
                httpWorker.reqSpecs.headers.ARC_UserToken=httpWorker.checkCookie('ARC_UserToken');
                httpWorker.checkAuthLogOut();
                return $http({
                    method:'POST',
                    url:httpWorker.apiRoot.getPath()+path1,
                    data:data,
                    headers:httpWorker.reqSpecs.headers
                })
            } else {
                // console.log('not logged in');
                logoutService.logout()
            }
        };
        httpWorker.putData = function(path1,param,data){
            param = param?param:'';
            //path2 = path2?path2:'';
            if(httpWorker.checkCookie('ARC_UserToken')!=null){
                httpWorker.reqSpecs.headers.ARC_UserToken=httpWorker.checkCookie('ARC_UserToken');
                httpWorker.checkAuthLogOut();
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
                httpWorker.checkAuthLogOut();
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
        httpWorker.checkAuthLogOut = function(){
            httpWorker.getAuth(httpWorker.checkCookie('ARC_UserToken')).then(function(response){
                if(response.data!=true){
                    console.log('not logged in');
                    logoutService.logout()
                }

            },function errorCallback(response){
                console.log(response)
            });
        };
        httpWorker.getAuth = function(myCookie){
            return $http({
                    method:'GET',
                    url:httpWorker.apiRoot.getPath()+'Authorize/' + myCookie,
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
    })
    .config(function (localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('data')
            .setNotify(true, true)
    });
