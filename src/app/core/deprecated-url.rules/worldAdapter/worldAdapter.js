import geoproperties from "./geoproperties";
import countries from "./countries";
import scaletypes from "./scaletypes";
import indicators from "./indicators";

const rule = {
  test(url) {
    return /#\$majorMode/.test(url);
  },

  use(url) {
    const hashIndex = url.indexOf("#");
    const hashPrefix = url.substr(0, hashIndex);
    const hash = url.substr(hashIndex);

    const gwHash = parseHash(hash);
    const gtHash = createToolsHash(gwHash);

    return hashPrefix + "#" + urlon.stringify(gtHash);
  }
};

function parseHash(hashString) {

  const obj = {};
  hashString = hashString.slice(hashString.lastIndexOf("#") + 1);
  const parts = hashString.split("$");
  parts.forEach(part => {

    if (part == "") return; // ignore empty
    const subparts = part.split(";");
    const firstSubpart = subparts.shift().split("=");
    if (firstSubpart[1]) subparts.unshift(firstSubpart[1]);


    subparts.forEach(subpart => {
      let values = subpart.split("=");
      if (values[1] || firstSubpart[0] == "inds") {
        if (!obj[firstSubpart[0]]) {
          obj[firstSubpart[0]] = {};
        }
        if (firstSubpart[0] == "inds" && !values[1]) {
          values = values[0].split("_");
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

  const use = {
    "ind": "indicator",
    "grp": "property",
    "const": "constant"
  };
  const which = {
    "ind": indicators,
    "grp": geoproperties,
    "const": "_default"
  };

  const hooks = ["x", "y", "c", "s"];
  const maps = { "inc_x": "map_x", "inc_y": "map_y" };
  const gt_hooks = {};
  // set generic id instead of iid and gid
  hooks.forEach(hook => {
    const inc = "inc_" + hook;
    const map = "map_" + hook;
    gt_hooks[hook] = {};

    if (gwHash[inc] && gwHash[inc].by) {
      gt_hooks[hook].use = use[gwHash[inc].by];
      gt_hooks[hook].which = (gwHash[inc].by == "ind") ? which[gwHash[inc].by][gwHash[inc].iid] : which[gwHash[inc].by][gwHash[inc].gid];
    }

    if (gt_hooks[hook].which == "time") {
      gt_hooks[hook].allow = {
        scales: ["linear", "log", "time"]
      };
      gt_hooks[hook].scaleType = "time";
    }

    if (gwHash[map]) {
      if (hook == "s") {
        gt_hooks[hook].extent = [(gwHash[map].smi / 120), (gwHash[map].sma / 120)];
        gt_hooks[hook].domainMin = null;
        gt_hooks[hook].domainMax = null;
      } else {
        gt_hooks[hook].scaleType = scaletypes[gwHash[map].scale] || gt_hooks[hook].scaleType || gwHash[map].scale; // if time it's already set
        gt_hooks[hook].zoomedMin = gwHash[map].dataMin || null;
        gt_hooks[hook].zoomedMax = gwHash[map].dataMax || null;
        gt_hooks[hook].domainMin = null;
        gt_hooks[hook].domainMax = null;
      }
    }
  });

  const geo_ids = Object.keys(gwHash.inds || {});
  const select = [];
  let trails = false;
  geo_ids.forEach(geo_id => {
    if (countries[geo_id]) {
      const trailStartTime = gwHash.inds[geo_id].substring(3, 7);
      if (/^\d+$/.test(trailStartTime)) {
        select.push({
          country: countries[geo_id],
          trailStartTime
        });
        trails = true;
      }
      else
        select.push({
          country: countries[geo_id]
        });
    }

  });

  let obj;
  if (gwHash.majorMode == "chart") {
    obj = {
      "chart-type": "bubbles",
      state: {
        time: {
          value: gwHash.ts.ti || null,
          delay: 300 - gwHash.ts.sp * 20 || 100
        },
        entities: {
        },
        marker: {
          select,
          opacitySelectDim: (gwHash.is.al / 100),
          axis_x: gt_hooks.x,
          axis_y: gt_hooks.y,
          size: gt_hooks.s,
          color: gt_hooks.c
        }
      },
      ui: {
        chart: {
          trails
        }
      }
    };
  } else {
    obj = {
      "chart-type": "map",
      state: {
        time: {
          value: gwHash.ts.ti || null,
          delay: 500 - gwHash.ts.sp * 40 || 100
        },
        marker: {
          select,
          opacitySelectDim: (gwHash.is.al / 100),
          hook_lat: {
            use: "property",
            which: "latitude"
          },
          hook_lng: {
            use: "property",
            which: "longitude"
          },
          size: gt_hooks.s,
          color: gt_hooks.c
        }
      }
    };
  }
  return obj;
}


export default rule;
