(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./main');
require('./controllers/fotos-controller');
require('./controllers/foto-controller');
require('./controllers/grupos-controller');
require('./controllers/login-controller');
require('./directives/minhas-diretivas');
require('./services/meus-servicos');
require('./services/token-interceptor');
},{"./controllers/foto-controller":2,"./controllers/fotos-controller":3,"./controllers/grupos-controller":4,"./controllers/login-controller":5,"./directives/minhas-diretivas":6,"./main":7,"./services/meus-servicos":8,"./services/token-interceptor":9}],2:[function(require,module,exports){
angular.module('alurapic')
	.controller('FotoController', function($scope, recursoFoto, $routeParams, cadastroDeFotos) {

		$scope.foto = {};
		$scope.mensagem = '';

		if($routeParams.fotoId) {
			recursoFoto.get({fotoId: $routeParams.fotoId}, function(foto) {
				$scope.foto = foto; 
			}, function(erro) {
				console.log(erro);
				$scope.mensagem = 'Não foi possível obter a foto'
			});
		}

		$scope.submeter = function() {

			if ($scope.formulario.$valid) {
				cadastroDeFotos.cadastrar($scope.foto)
				.then(function(dados) {
					$scope.mensagem = dados.mensagem;
					if (dados.inclusao) $scope.foto = {};
				})
				.catch(function(erro) {
					$scope.mensagem = erro.mensagem;
				});
			}
		};
	});
},{}],3:[function(require,module,exports){
angular.module('alurapic').controller('FotosController', function($scope, recursoFoto) {
	
	$scope.fotos = [];
	$scope.filtro = '';
	$scope.mensagem = '';

	recursoFoto.query(function(fotos) {
		$scope.fotos = fotos;
	}, function(erro) {
		console.log(erro);
	});

	$scope.remover = function(foto) {

		recursoFoto.delete({fotoId: foto._id}, function() {
			var indiceDaFoto = $scope.fotos.indexOf(foto);
			$scope.fotos.splice(indiceDaFoto, 1);
			$scope.mensagem = 'Foto ' + foto.titulo + ' removida com sucesso!';
		}, function(erro) {
			console.log(erro);
			$scope.mensagem = 'Não foi possível apagar a foto ' + foto.titulo;
		});
	};

});
},{}],4:[function(require,module,exports){
angular.module('alurapic')
	.controller('GruposController', function($scope, $http) {
		$http.get('/v1/grupos')
			.success(function(grupos) {
			$scope.grupos = grupos;
		})
		.error(function(erro) {
			console.log(erro);
		});
	});
},{}],5:[function(require,module,exports){
angular.module('alurapic').controller('LoginController', function($scope, $http, $location, $window) {

	$scope.usuario = {};
	
	$scope.autenticar = function() {

		var usuario = $scope.usuario;	

		$http.post('/autenticar', {login: usuario.login, senha: usuario.senha})
			.then(function() {
				$location.path('/');
			}, function(error) {
				console.log(usuario.login);
				$scope.usuario = {};
				$scope.mensagem = "Login/Senha incorretos";
			});
	};

	$scope.logout = function() {
		delete $window.sessionStorage.token;
		$location.path('/');
	}

	$scope.check = function() {
		return $window.sessionStorage.token;
		 
	}

});
},{}],6:[function(require,module,exports){
angular.module('minhasDiretivas', [])
	.directive('meuPainel', function() {

		var ddo = {};

		ddo.restrict = "AE";
        ddo.transclude = true;


		ddo.scope = {
            titulo: '@',
            descricao: '@'
        };

        ddo.templateUrl = 'js/directives/meu-painel.html';

		return ddo;
	})
    .directive('minhaFoto', function() {

        var ddo = {};

        ddo.restrict = "AE";

        ddo.scope = {
            titulo: '@',
            url: '@'
        };

        ddo.template = '<img width="100%" height="100%" src="{{url}}" alt="{{titulo}}">';           
        
        return ddo;
    })
    .directive('meuBotaoPerigo', function() {
        var ddo = {};
        ddo.restrict = "E";
        ddo.scope = {
            nome: '@',
            acao : '&'
        }
        ddo.template = '<button class="btn btn-danger btn-block" ng-click="acao()">{{nome}}</button>';

        return ddo;
    });
},{}],7:[function(require,module,exports){
angular.module('alurapic', ['minhasDiretivas','ngAnimate', 'ngRoute', 'ngResource', 'meusServicos'])
	.config(function($routeProvider, $locationProvider, $httpProvider) {
	
        $httpProvider.interceptors.push('tokenInterceptor');
		
		$routeProvider.when('/fotos', {
			templateUrl: 'partials/principal.html',
			controller: 'FotosController'
		});

		$routeProvider.when('/fotos/new', {
			templateUrl: 'partials/foto.html',
			controller: 'FotoController'
		});

		$routeProvider.when('/fotos/edit/:fotoId', {
			templateUrl: 'partials/foto.html',
			controller: 'FotoController'
		});
		
		$routeProvider.when('/login', {
			templateUrl: 'partials/login.html',
			controller: 'LoginController'
		});

		$routeProvider.otherwise({redirectTo: '/fotos'});
		
	});
},{}],8:[function(require,module,exports){
angular.module('meusServicos', ['ngResource'])
	.factory('recursoFoto', function($resource) {

		return $resource('/v1/fotos/:fotoId', null, {
			'update' : { 
				method: 'PUT'
			}
		});
	})
	.factory("cadastroDeFotos", function(recursoFoto, $q) {
		var service = {};
		service.cadastrar = function(foto) {
			return $q(function(resolve, reject) {

				if(foto._id) {
					recursoFoto.update({fotoId: foto._id}, foto, function() {
						resolve({
							mensagem: 'Foto ' + foto.titulo + ' atualizada com sucesso',
							inclusao: false
						});
					}, function(erro) {
						console.log(erro);
						reject({
							mensagem: 'Não foi possível atualizar a foto ' + foto.titulo
						});
					});

				} else {
					recursoFoto.save(foto, function() {
						resolve({
							mensagem: 'Foto ' + foto.titulo + ' incluída com sucesso',
							inclusao: true
						});
					}, function(erro) {
						console.log(erro);
						reject({
							mensagem: 'Não foi possível incluir a foto ' + foto.titulo
						});
					});
				}
			});
		};
		return service;
    });
},{}],9:[function(require,module,exports){
angular.module('alurapic')
    .factory('tokenInterceptor', function($q, $window, $location) {

        var interceptor = {};

        interceptor.request = function(config) {
            // enviar o token na requisição
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                console.log('Enviando token já obtido em cada requisição');
                config.headers['x-access-token'] = $window.sessionStorage.token;
            }
            return config;
        },

        interceptor.response = function (response) {
            var token = response.headers('x-access-token');
            if (token != null) {
                $window.sessionStorage.token = token;
                console.log('Token no session storage: ', token);
            } 
            return response;
        },

        interceptor.responseError = function(rejection) {

            if (rejection != null && rejection.status === 401) {
                console.log('Removendo token da sessão')
                delete $window.sessionStorage.token;
                $location.path("/login");
            } 
            return $q.reject(rejection);
        }

    return interceptor;

});

},{}]},{},[1]);
