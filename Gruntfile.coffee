module.exports = (grunt) ->
  grunt.initConfig
    'jasmine_node':
      projectRoot: '.'
      requirejs: false
      forceExit: true
      jUnit:
        report: false
        savePath: './build/reports/jasmine/'
        useDotNotation: true
        consolidate: true
    'watch':
      src:
        files: ['**/*.js']
        tasks: ['default']

  grunt.loadNpmTasks 'grunt-jasmine-node'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.registerTask 'default', ['jasmine_node']
  grunt.registerTask 'travis', ['jasmine_node']
