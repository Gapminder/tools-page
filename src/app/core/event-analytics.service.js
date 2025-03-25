//gtag is a global variable from index.html
//configure google analytics with the active tool, which would be counted as a "page view" of our single-page-application
if (gtag) gtag("config", poduction ? GAPMINDER_TOOLS_GA_ID_PROD : GAPMINDER_TOOLS_GA_ID_DEV, { "page_title": tool, "page_path": "/" + tool });



function googleAnalyticsLoadEvents(viz, toolsetEntry) {
    const markers = viz.model.markers;
    const marker = markers[toolsetEntry.mainMarker];
    const splashMarker = viz.splashMarker;
  
    registerLoadFinish(marker, "FULL", !!splashMarker);
  
    function registerLoadFinish(loadMarker, id, splashed) {
      let splashReady = false;
      if (splashed) console.time("SPLASH");
      console.time(id);
      const dispose = reaction(
        () => {
          if (loadMarker.state != "fulfilled") return;
          return loadMarker.id;
        },
        () => {
          const logById = id => {
            console.timeEnd(id);
            const time = timeLogger.snapOnce(id);
            if (gtag && time) gtag("event", "timing_complete", {
              "name": time < 30000 ? `${id} load` : `${id} load above 30s`,
              "value": time,
              "event_category": "Page load",
              "event_label": state.getTool()
            });
          };
  
          if (splashed && loadMarker.id.split("-").pop() == "splash") {
            splashReady = true;
            logById("SPLASH");
          } else {
            dispose();
            if (splashed && !splashReady) logById("SPLASH");
            logById(id);
          }
        },
        { name: id + " google load registration",
          onError: err => {
            console.log(err);
            window.Rollbar && Rollbar.critical(err);
          }
        }
      );
      disposers.push(dispose);
    }
  }

  registerLoadFinish(marker, "FULL", !!splashMarker);

  function registerLoadFinish(loadMarker, id, splashed) {
    let splashReady = false;
    if (splashed) console.time("SPLASH");
    console.time(id);
    const dispose = reaction(
      () => {
        if (loadMarker.state != "fulfilled") return;
        return loadMarker.id;
      },
      () => {
        const logById = id => {
          console.timeEnd(id);
          const time = timeLogger.snapOnce(id);
          if (gtag && time) gtag("event", "timing_complete", {
            "name": time < 30000 ? `${id} load` : `${id} load above 30s`,
            "value": time,
            "event_category": "Page load",
            "event_label": state.getTool()
          });
        };

        if (splashed && loadMarker.id.split("-").pop() == "splash") {
          splashReady = true;
          logById("SPLASH");
        } else {
          dispose();
          if (splashed && !splashReady) logById("SPLASH");
          logById(id);
        }
      },
      { name: id + " google load registration",
        onError: err => {
          console.log(err);
          window.Rollbar && Rollbar.critical(err);
        }
      }
    );
    disposers.push(dispose);
  }
}


//   'change_hook_which': function(evt, arg) {
//     if (gtag) gtag('event', 'indicator selected', {
//       'event_label': arg.which,
//       'event_category': arg.hook
//     });
//   },
//   'load_error': function(evt, error) {
//     if (gtag) gtag('event', 'error', {
//       'event_label': JSON.stringify(error).substring(0, 500), //500 characters is the limit of GA field
//       'event_category': this._name
//     });
//     if (gtag) gtag('event', 'exception', {
//       'description': JSON.stringify(error).substr(0,150), //150 characters is the limit of GA field
//       'fatal': true
//     });


/*
CUSTOM EVENT ANALYTICS CODE
see https://github.com/Gapminder/tools-page-analytics-server

        const searchInput =  viz.element.select("input.vzb-treemenu-search");
        viz.element.select(".vzb-treemenu-wrap").on("click.tm", function(e) {
          const sourceData = d3.select(e.srcElement).datum();
          if (sourceData.concept_type !== "measure" && sourceData.concept_type !== "string") return;

          // if (gtag) gtag("event", "concept_request", {
          //   "name": searchInput.node().value ? "search" : "menu",
          //   "value": sourceData.id,
          //   "event_category": sourceData?.byDataSources?.[0]?.dataSource?.id,
          //   "event_label": state.getTool()
          // });

          const options = `\
concept=${sourceData.id}\
&space=${sourceData?.byDataSources?.[0]?.spaces?.[0]}\
&tool=${state.getTool()}\
&dataset=${sourceData?.byDataSources?.[0]?.dataSource?.id}\
&type=${searchInput.node().value ? "search" : "menu"}\
&referer=${window.location.host}\
`;

          fetch(`https://tools-page-analytics-server.gapminder.org/record?${options}`);
        }, { capture: true });
*/

        // const mainMarkerName = toolsetEntry.mainMarker;
        // if (mainMarkerName) {
        //   const ignoredConcepts = [
        //     'time',
        //     'name',
        //     'geo',
        //     'country',
        //     'world_4region',
        //     'world_6region',
        //     'is--',
        //     'un_sdg_region',
        //     'g77_and_oecd_countries',
        //     'global',
        //     'income_3groups',
        //     'income_groups',
        //     'landlocked',
        //     'main_religion_2008',
        //     'un_sdg_ldc',
        //     'unhcr_region',
        //     'unicef_region',
        //     'west_and_rest',
        //     'age',
        //     'gender',
        //     'latitude',
        //     'longitude'
        //   ];
        //   const defaultSource = VIZABI_MODEL.model.markers[mainMarkerName].data.source;
        //   const encodings = VIZABI_MODEL.model.markers[mainMarkerName].encoding;
        //   const passedConcepts = [];
        //   Object.keys(encodings).filter(enc => enc !== "frame").forEach(encKey => {
        //     const encData = encodings[encKey]?.data;
        //     const concept = encData?.concept;
        //     if (!concept || passedConcepts.includes(concept) || encData.constant || ignoredConcepts.includes(concept)) return;
        //     passedConcepts.push(concept);

//     if (gtag) gtag("event", "concept_request", {
//       "name": "url",
//       "value": concept,
//       "event_category": encData.source || defaultSource,
//       "event_label": state.getTool()
//     });
//   });
// }
