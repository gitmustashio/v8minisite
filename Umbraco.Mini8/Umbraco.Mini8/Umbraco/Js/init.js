/** Executed when the application starts, binds to events and set global state */
app.run(['userService', '$q', '$log', '$rootScope', '$route', '$location', 'urlHelper', 'navigationService', 'appState', 'editorState', 'fileManager', 'assetsService', 'eventsService', '$cookies', '$templateCache', 'localStorageService', 'tourService', 'dashboardResource',
    function (userService, $q, $log, $rootScope, $route, $location, urlHelper, navigationService, appState, editorState, fileManager, assetsService, eventsService, $cookies, $templateCache, localStorageService, tourService, dashboardResource) {

        //This sets the default jquery ajax headers to include our csrf token, we
        // need to user the beforeSend method because our token changes per user/login so
        // it cannot be static
        $.ajaxSetup({
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-UMB-XSRF-TOKEN", $cookies["UMB-XSRF-TOKEN"]);
                var queryStrings = urlHelper.getQueryStringParams();
                if (queryStrings.umbDebug === "true" || queryStrings.umbdebug === "true") {
                    xhr.setRequestHeader("X-UMB-DEBUG", "true");
                }
            }
        });

        /** Listens for authentication and checks if our required assets are loaded, if/once they are we'll broadcast a ready event */
        eventsService.on("app.authenticated", function (evt, data) {

            assetsService._loadInitAssets().then(function () {

                appReady(data);

                tourService.registerAllTours().then(function () {
                    // Auto start intro tour
                    tourService.getTourByAlias("umbIntroIntroduction").then(function (introTour) {
                        // start intro tour if it hasn't been completed or disabled
                        if (introTour && introTour.disabled !== true && introTour.completed !== true) {
                            tourService.startTour(introTour);
                        }
                    });
                });
            });

        });

        function appReady(data) {
            appState.setGlobalState("isReady", true);
            //send the ready event with the included returnToPath,returnToSearch data
            eventsService.emit("app.ready", data);
            returnToPath = null, returnToSearch = null;
        }

        var currentRouteParams = null;
        var globalQueryStrings = ["mculture"];

        /** execute code on each successful route */
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {

            currentRouteParams = angular.copy(current.params); //store this so we can reference it in $routeUpdate

            var deployConfig = Umbraco.Sys.ServerVariables.deploy;
            var deployEnv, deployEnvTitle;
            if (deployConfig) {
                deployEnv = Umbraco.Sys.ServerVariables.deploy.CurrentWorkspace;
                deployEnvTitle = "(" + deployEnv + ") ";
            }

            if (current.params.section) {

                //Uppercase the current section, content, media, settings, developer, forms
                var currentSection = current.params.section.charAt(0).toUpperCase() + current.params.section.slice(1);

                var baseTitle = currentSection + " - " + $location.$$host;

                //Check deploy for Global Umbraco.Sys obj workspace
                if (deployEnv) {
                    $rootScope.locationTitle = deployEnvTitle + baseTitle;
                }
                else {
                    $rootScope.locationTitle = baseTitle;
                }

            }
            else {

                if (deployEnv) {
                    $rootScope.locationTitle = deployEnvTitle + "Umbraco - " + $location.$$host;
                }

                $rootScope.locationTitle = "Umbraco - " + $location.$$host;
            }

            //reset the editorState on each successful route chage
            editorState.reset();

            //reset the file manager on each route change, the file collection is only relavent
            // when working in an editor and submitting data to the server.
            //This ensures that memory remains clear of any files and that the editors don't have to manually clear the files.
            fileManager.clearFiles();
        });

        /** When the route change is rejected - based on checkAuth - we'll prevent the rejected route from executing including
            wiring up it's controller, etc... and then redirect to the rejected URL.   */
        $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {

            if (rejection.path) {
                event.preventDefault();

                var returnPath = null;
                if (rejection.path == "/login" || rejection.path.startsWith("/login/")) {
                    //Set the current path before redirecting so we know where to redirect back to
                    returnPath = encodeURIComponent($location.url());
                }

                $location.path(rejection.path)
                if (returnPath) {
                    $location.search("returnPath", returnPath);
                }
            }

        });

        //Bind to $routeUpdate which will execute anytime a location changes but the route is not triggered.
        //This is the case when a route uses reloadOnSearch: false which is the case for many or our routes so that we are able to maintain
        //global state query strings without force re-loading views.
        //We can then detect if it's a location change that should force a route or not programatically.
        $rootScope.$on('$routeUpdate', function (event, next) {

            if (!currentRouteParams) {
                //if there is no current route then always route which is done with reload
                $route.reload();
            }
            else {
                //check if the location being changed is only the mculture query string, if so, cancel the routing since this is just
                //used as a global persistent query string that does not change routes.

                var currUrlParts = currentRouteParams;
                var nextUrlParts = next.params;

                var allowRoute = true;

                //the only time that we want to cancel is if any of the globalQueryStrings have changed
                //in which case the number of parts need to be equal before comparing values
                if (_.keys(currUrlParts).length == _.keys(nextUrlParts).length) {
                    var partsChanged = 0;
                    _.each(currUrlParts, function (value, key) {
                        if (globalQueryStrings.indexOf(key) === -1) {
                            if (value.toLowerCase() !== nextUrlParts[key].toLowerCase()) {
                                partsChanged++;
                            }
                        }
                    });
                    if (partsChanged === 0) {
                        allowRoute = false; //nothing except our query strings chagned, so don't continue routing
                    }
                }

                if (allowRoute) {
                    //continue the route
                    $route.reload();
                }
            }
        });

        //check for touch device, add to global appState
        //var touchDevice = ("ontouchstart" in window || window.touch || window.navigator.msMaxTouchPoints === 5 || window.DocumentTouch && document instanceof DocumentTouch);
        var touchDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|touch/i.test(navigator.userAgent.toLowerCase());
        appState.setGlobalState("touchDevice", touchDevice);

    }]);
