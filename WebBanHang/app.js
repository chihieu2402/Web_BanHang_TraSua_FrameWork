angular
    .module('myapp', ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'home.html',
                controller: 'homeCtrl'
            })
            .when('/list', {
                templateUrl: 'list.html',
                controller: 'listCtrl'
            })
            .when('/about', {
                templateUrl: 'about.html'
            })
            .when('/contact', {
                templateUrl: 'contact.html'
            })
            .when('/detail/:id', {
                templateUrl: 'detail.html',
                controller: 'detailCtrl'
            })
            .when('/cart', {
                templateUrl: 'cart.html',
                controller: 'cartCtrl'
            })
            .when('/signup', {
                templateUrl: 'dangki.html',
                controller: 'signupCtrl'
            })
            .when('/login', {
                templateUrl: 'login.html',
                controller: 'loginCtrl'
            })
            .otherwise({
                redirectTo: '/home'
            })
    })
    .controller('loginCtrl',function($scope,$rootScope,$location){
        $scope.login = {};
        $scope.checkLogin = false;
        $scope.loginUser = function() {
            var user = $rootScope.registeredUsers.find(function(registeredUser) {
              return registeredUser.username === $scope.login.username && registeredUser.password === $scope.login.password;
            });
    
            if (user) {
              alert("Đăng nhập thành công!");
              $location.path('/home');
              $scope.checkLogin = true;
            } else {
              alert("Đăng nhập không thành công. Vui lòng kiểm tra lại tên người dùng và mật khẩu.");
            }
          };
    })
    .controller('signupCtrl', function ($scope,$rootScope) {
        $scope.register = function () {
            // Kiểm tra xem người dùng đã tồn tại hay chưa
            var isUserExists = $rootScope.registeredUsers.some(function (registeredUser) {
                return registeredUser.username === $scope.user.username;
            });

            // Kiểm tra xác nhận mật khẩu
            if ($scope.user.password !== $scope.user.confirmPassword) {
                alert("Mật khẩu và xác nhận mật khẩu không khớp!");
                return;
            }

            if (!isUserExists) {
                // Thêm người dùng mới vào mảng
                $rootScope.registeredUsers.push(angular.copy($scope.user));
                alert('Đăng kí thành công!')
                // Xóa dữ liệu nhập sau khi đăng ký thành công
                $scope.user = {};
            } else {
                alert("Người dùng đã tồn tại!");
            }
        };

    })
    .controller('cartCtrl', function ($scope, $rootScope, $http) {
        $scope.getAmount = function () {
            var amount = 0;
            for (var i = 0; i < $rootScope.cart.length; i++) {
                if ($rootScope.cart[i].buy) {
                    amount += ($rootScope.cart[i].price * $rootScope.cart[i].quantity);
                }
            }
            if ($scope.voucherShop == $scope.voucher) {
                amount = amount * 0.9;
            }
            return amount;
        }
        $scope.voucherShop = 'coanhdimthayCuong';
        $scope.voucher = '';
        $scope.xoaAll = function () {
            $rootScope.cart = [];
        }
        $scope.check = true;
        $scope.chon = function () {
            for (var i = 0; i < $rootScope.cart.length; i++) {
                if ($scope.check == true) {
                    $rootScope.cart[i].buy = true;
                }
            }
            $scope.check = false;
        }
        $scope.bochon = function () {
            for (var i = 0; i < $rootScope.cart.length; i++) {
                if ($scope.check == false) {
                    $rootScope.cart[i].buy = false;
                }
            }
            $scope.check = true;
        }
        $scope.dsTinh = [];
        $http.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json').then(function (res) {
            $scope.dsTinh = res.data;
        },
            function (res) {
                alert('Lỗi tải dữ liệu')
            }
        );
        $scope.xoaSP = function () {
            $rootScope.cart.splice($rootScope.cart, 1);
        }
    })
    .controller('myCtrl', function ($scope, $http, $rootScope) {
        $rootScope.registeredUsers = [];

        $scope.products = [];
        $http.get('products.json').then(function (response) {
            $scope.products = response.data;
        })
        $rootScope.cart = [];
        $rootScope.addToCart = function (sp) {
            var inCart = false;
            // sản phẩm đã có trong cart --> Tăng số lượng
            for (var i = 0; i < $rootScope.cart.length; i++) {
                if ($rootScope.cart[i].id == sp.id) {
                    $rootScope.cart[i].quantity++;
                    inCart = true;
                    break;
                }
            }
            // sản phẩm chưa có trong cart --> Thêm mới
            if (!inCart) {
                sp.quantity = 1;
                $rootScope.cart.push(sp);
            }
            console.log($rootScope.cart)

        }
        $rootScope.addToCartct = function (sp, soluong) {
            var inCart = false;
            // sản phẩm đã có trong cart --> Tăng số lượng
            for (var i = 0; i < $rootScope.cart.length; i++) {
                if ($rootScope.cart[i].id == sp.id) {
                    $rootScope.cart[i].quantity += Number(soluong);
                    inCart = true;
                    break;
                }
            }
            // sản phẩm chưa có trong cart --> Thêm mới
            if (!inCart) {
                sp.quantity = 0;
                sp.quantity += Number(soluong);
                $rootScope.cart.push(sp);
            }
            console.log($rootScope.cart)

        }
    })
    .controller('listCtrl', function ($scope) {
        $scope.page = 1;
        $scope.limit = 4;
        $scope.start = $scope.limit * ($scope.page - 1);
        $scope.totalPage = Math.ceil($scope.products.length / $scope.limit);
        $scope.chuyenTrang = function (trang) {
            $scope.page = trang;
            $scope.start = $scope.limit * ($scope.page - 1);
        }
        $scope.dsTrang = [];
        for (var i = 1; i <= $scope.totalPage; i++) {
            $scope.dsTrang.push(i);
        }
        $scope.byCatelogy = function (sp) {
            return !$scope.theloai || sp.catelory == $scope.theloai;
        }
    })
    .controller('detailCtrl', function ($scope, $routeParams) {
        $scope.id = $routeParams.id;
        $scope.sp = {};
        for (const sp of $scope.products) {
            if (sp.id == $scope.id) {
                $scope.sp = sp;
                break;
            }
        }
    })
    .controller('homeCtrl', function ($scope) {

    })