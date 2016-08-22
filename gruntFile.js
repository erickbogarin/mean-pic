module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['browserify', 'uglify', 'watch']);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      main: {
        src: 'public/js/app.js',
        dest: 'public/dist/js/bundle.js'    
      },  
      vendor: {
        src: 'public/js/app-vendor.js',
        dest: 'public/dist/js/vendor.js'
      }
    },
    uglify:{   
      compress: {
        files: {
          'public/dist/js/vendor.min.js' : ['public/dist/js/vendor.js'],
          'public/dist/js/bundle.min.js' : ['public/dist/js/bundle.js']
        }    
      }
    },
    watch: {
      files: 'public/js/**/*',
      tasks: ['default']
    },
  });
}