import geoproperties from "./geoproperties";
import countries from "./countries";
import scaletypes from "./scaletypes";
import indicators from "./indicators";

const rule = {
  test: function(url) {
    return /#\$majorMode/.test(url);
  },

  use: function(url) {
    const hashIndex = url.indexOf("#");
    const hashPrefix = url.substr(0, hashIndex);
    const hash = url.substr(hashIndex);

  	var gwHash = parseHash(hash);
	var gtHash = createToolsHash(gwHash);

	// not related to URL, but relevant for people coming from Gapminder World:
	const tpMessage = document.getElementById('tp-message');
	tpMessage.style.display = "block";
	document.getElementById('tp-message-text').innerHTML = `<strong>Welcome to Gapminder Tools!</strong><br>
        You came to this page using a link to Gapminder World, our old charts. What you see now is its replacement with newer data and better looks.<br> 
        If you really need to go back to Gapminder World: <a href="//www.gapminder.org/world/?use_gapminder_world${hash}">click here</a>. Also, please let us know why by emailing <a href="mailto:angie@gapminder.org">angie@gapminder.org</a>.`

    // continue url related things

    return hashPrefix + "#" + urlon.stringify(gtHash);
  }
}

function parseHash(hashString) {

	var obj = {};
	hashString = hashString.slice(hashString.lastIndexOf('#')+1);
	var parts = hashString.split('$');
	parts.forEach(function(part) {
		
		if (part=="") return; // ignore empty
		var subparts = part.split(';');
		var firstSubpart = subparts.shift().split('=');
		if (firstSubpart[1]) subparts.unshift(firstSubpart[1]);
		

		subparts.forEach(function(subpart) {
			var values = subpart.split('=');
			if (values[1] || firstSubpart[0] == 'inds') {
				if (!obj[firstSubpart[0]]) {
					obj[firstSubpart[0]] = {};
				}
				if (firstSubpart[0] == 'inds' && !values[1]) {
					values = values[0].split('_');
				}
				obj[firstSubpart[0]][values[0]] = values[1];
			}
			else {
				if (!obj[firstSubpart[0]]) {
					obj[firstSubpart[0]] = [];
				}
				obj[firstSubpart[0]].push(values[0]);
			}
		});

		if (!obj[firstSubpart[0]]) obj[firstSubpart[0]] = {};
		
	});
	return obj;
}

function createToolsHash(gwHash) {

	var use = {
		'ind': 'indicator',
		'grp': 'property',
		'const': 'constant'
	};
	var which = {
		'ind': indicators,
		'grp': geoproperties,
		'const': '_default'
	}

	var hooks = ['x', 'y', 'c', 's'];
	var maps = { 'inc_x': 'map_x', 'inc_y': 'map_y'}
	var gt_hooks = {};
	// set generic id instead of iid and gid
	hooks.forEach(function(hook) {
		var inc = 'inc_' + hook;
		var map = 'map_' + hook;
		gt_hooks[hook] = {};

		gt_hooks[hook].use = use[gwHash[inc].by];
		gt_hooks[hook].which = (gwHash[inc].by == 'ind') ? which[gwHash[inc].by][gwHash[inc].iid] : which[gwHash[inc].by][gwHash[inc].gid];

		if (gt_hooks[hook].which == 'time') {
			gt_hooks[hook].allow = {
				scales: ["linear", "log", "time"]
			};
			gt_hooks[hook].scaleType = 'time'
		}

		if (gwHash[map]) {
			if (hook == 's') {
				gt_hooks[hook].extent = [(gwHash[map].smi/120),(gwHash[map].sma/120)];
				gt_hooks[hook].domainMin = null;
				gt_hooks[hook].domainMax = null;
			} else {
				gt_hooks[hook].scaleType = scaletypes[gwHash[map].scale] || gt_hooks[hook].scaleType || gwHash[map].scale; // if time it's already set
					gt_hooks[hook].zoomedMin = gwHash[map].dataMin;
				gt_hooks[hook].zoomedMax = gwHash[map].dataMax;
				gt_hooks[hook].domainMin = null;
				gt_hooks[hook].domainMax = null;
			}
		}
	});

	var geo_ids = Object.keys(gwHash.inds);
	var select = [];
	var trails = false;
	geo_ids.forEach(function(geo_id) {
		if (countries[geo_id]) {
			var trailStartTime = gwHash.inds[geo_id].substring(3,7);
			if (/^\d+$/.test(trailStartTime)) {
				select.push({
					geo: countries[geo_id],
					trailStartTime: trailStartTime
				});
				trails = true;
			}
			else
				select.push({
					geo: countries[geo_id]
				});
		}

	});

	var obj;
	if (gwHash.majorMode == 'chart') {
		obj = {
			"chart-type": "bubbles",
			state: {
				time: {
					value: gwHash.ts.ti || null,
					delay: 300 - gwHash.ts.sp*20 || 100
				},
				entities: {
				},
				marker: {
					select: select,
					opacitySelectDim: (gwHash.is.al/100),
					axis_x: gt_hooks.x,
					axis_y: gt_hooks.y,
					size: gt_hooks.s,
					color: gt_hooks.c
				}
			},
			ui: {
				chart: {
					trails: trails
				}
			}
		}
	} else {
		obj = {
			"chart-type": "map",
			state: {
				time: {
					value: gwHash.ts.ti || null,
					delay: 500 - gwHash.ts.sp*40 || 100
				},
				marker: {
					select: select,
					opacitySelectDim: (gwHash.is.al/100),
					hook_lat: {
						use: 'property',
						which: 'latitude'
					},
					hook_lng: {
						use: 'property',
						which: 'longitude'
					},
					size: gt_hooks.s,
					color: gt_hooks.c
				}
			}
		}			
	}
	return obj;
}



export default rule;