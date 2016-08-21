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