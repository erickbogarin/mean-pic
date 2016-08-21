module.exports = function(app) {

	var api = app.api.grupos;
	app.get('/v1/grupos', api.lista);

};