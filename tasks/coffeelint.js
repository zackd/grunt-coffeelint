/*
 * grunt-coffeelint
 * https://github.com/zackd/grunt-coffeelint
 *
 * Copyright (c) 2012 zackd
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  // External libs.
  var coffeelint = require('coffeelint');

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('coffeelint', 'Validate files with Coffeelint.', function() {
    // Get flags and globals, allowing target-specific options and globals to
    // override the default options and globals.
    var options, globals, tmp;

    tmp = grunt.config(['coffeelint', this.target, 'options']);
    if (typeof tmp === 'object') {
      grunt.verbose.writeln('Using "' + this.target + '" Coffeelint options.');
      options = tmp;
    } else {
      grunt.verbose.writeln('Using master Coffeelint options.');
      options = grunt.config('coffeelint.options');
    }
    grunt.verbose.writeflags(options, 'Options');

    tmp = grunt.config(['coffeelint', this.target, 'globals']);
    if (typeof tmp === 'object') {
      grunt.verbose.writeln('Using "' + this.target + '" Coffeelint globals.');
      globals = tmp;
    } else {
      grunt.verbose.writeln('Using master Coffeelint globals.');
      globals = grunt.config('coffeelint.globals');
    }
    grunt.verbose.writeflags(globals, 'Globals');

    // Lint specified files.
    grunt.file.expandFiles(this.file.src).forEach(function(filepath) {
      grunt.helper('coffeelint', grunt.file.read(filepath), options, globals, filepath);
    });

    // Fail task if errors were logged.
    if (this.errorCount) { return false; }

    // Otherwise, print a success message.
    grunt.log.writeln('Lint free.');
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  // Lint source code with Coffeelint.
  grunt.registerHelper('coffeelint', function(src, options, globals, extraMsg) {
    // JSHint sometimes modifies objects you pass in, so clone them.
    options = grunt.utils._.clone(options);
    globals = grunt.utils._.clone(globals);
    // Enable/disable debugging if option explicitly set.
    if (grunt.option('debug') !== undefined) {
      options.devel = options.debug = grunt.option('debug');
      // Tweak a few things.
      if (grunt.option('debug')) {
        options.maxerr = Infinity;
      }
    }
    var msg = 'Linting' + (extraMsg ? ' ' + extraMsg : '') + '...';
    grunt.verbose.write(msg);

    // Lint.
    var result = coffeelint.lint(src, options || {}, globals || {});
    if (result) {
      // Success!
      grunt.verbose.ok();
    } else {
      // Something went wrong.
      grunt.verbose.or.write(msg);
      grunt.log.error();

      // Iterate over all errors.
      // ... TODO: pretty error display
	/* error format 
		{
	    rule :      'Name of the violated rule',
	    lineNumber: 'Number of the line that caused the violation',
	    level:      'The severity level of the violated rule',
	    message:    'Information about the violated rule',
	    context:    'Optional details about why the rule was violated'
		}
	*/
	
      grunt.log.writeln();
    }
  });

};
