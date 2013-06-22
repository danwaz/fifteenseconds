module.exports = function(grunt) {

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

  uglify: {
    my_target: {
      files: {
        'js/build/main.js': ['js/main.js']
      }
    }
  }

  });

  grunt.registerTask('default', 'uglify');

}