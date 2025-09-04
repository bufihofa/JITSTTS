/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For more information on configuration, check out:
 * https://sailsjs.com/config/http
 */

module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Sails/Express middleware to run for every HTTP request.                   *
  *                                                                           *
  ****************************************************************************/

  middleware: {

    /***************************************************************************
    *                                                                          *
    * The order in which middleware should be run for HTTP requests.           *
    *                                                                          *
    ***************************************************************************/

    order: [
      'requestTimer', // Add our custom middleware at the beginning
      'cookieParser',
      'session',
      'bodyParser',
      'compress',
      'poweredBy',
      'router',
      'www',
      'favicon',
    ],


    /**
     * Request timer middleware to track request processing time
     */
    requestTimer: (req, res, next) => {
      // Record start time
      const startTime = process.hrtime();
      
      // Once the response is finished, calculate and log the time taken
      res.on('finish', () => {
        const diff = process.hrtime(startTime);
        const time = diff[0] * 1000 + diff[1] / 1000000; // Convert to milliseconds
        
        // Log the request method, URL, and time taken
        //console.log(`${req.method} ${req.originalUrl || req.url} - ${time.toFixed(2)}ms`);
      });
      
      // Continue to the next middleware
      return next();
    },

    /***************************************************************************
    *                                                                          *
    * The body parser that will handle incoming multipart HTTP requests.       *
    *                                                                          *
    * https://sailsjs.com/config/http#?customizing-the-body-parser             *
    *                                                                          *
    ***************************************************************************/

    // bodyParser: (function _configureBodyParser(){
    //   var skipper = require('skipper');
    //   var middlewareFn = skipper({ strict: true });
    //   return middlewareFn;
    // })(),

  },

};
