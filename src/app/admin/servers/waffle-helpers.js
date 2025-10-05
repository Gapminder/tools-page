
const {observable} = mobx;
import { supabaseClient } from "./../../auth/supabase.service";


let update = 0;
let refresh = 0;

export async function getServerData(){ 
  const { data, error } = await supabaseClient
    .from('servers')
    .select('*')
    .neq('id', '__all__'); 

  if (error) console.error(error);
  return data;
}

export async function getWaffleDatasources(selectedServerURL){
  const { data, error } = await supabaseClient
    .from('datasources')
    .select("reader_properties")
    .eq("reader", "ddfbw")
  if (error) console.error(error);
  return data.filter(f => f.reader_properties.service === selectedServerURL);
}

export async function getWaffle(selectedServerId){
  const { data, error } = await supabaseClient
    .from('waffle')
    .select('*')
    .in("server", ["__all__", selectedServerId])

  if (error) console.error(error);
  return data.map(m => ({
    slug: m.id, 
    githubRepoId: m.github_repo_id,
    default_branch: m.default_branch,
    is_private: m.is_private,
    waffleFetcherAppInstallationId: m.waffle_fetcher_app_installation_id,
    branches: m.branches.split(","),
    host: "supa"
  }));
}

export async function getEvents(url) {
  update; refresh;
  const events = await d3.json(url + "events/");
  return events;
}

export async function getStatus(url) {
  update; refresh;
  const status = await d3.json(url + "status/");
  if (!status.datasetControlList) status.datasetControlList = status.allowedDatasets
  status.datasetControlList.forEach(ds => {ds.host = "waffle"})
  return status;
}

export async function getDatasets(url) {
  update; refresh;
  const status = await getStatus(url);
  return status.datasetControlList.map(m => ({
    ...m, 
    url: "https://github.com/" + m.githubRepoId,
    branches: m.branches.map(b => ({[b]: status.availableDatasets[m.slug][b].substr(0,7)}))
  }));
}

export async function getAvailableDatasets(url) {
  update; refresh;
  const status = await getStatus(url);
  return Object.entries(status.availableDatasets).reduce((result, [key, value]) => {
    Object.keys(value).forEach(v => {
      result.push(`${key}/${v}`);
    })
    return result;
  }, []);
}

export async function getDatasetInfo(url, token) {
    update; refresh;
    const datasets = await getDatasets(url);
    const promises = []
    datasets.forEach(dataset => dataset.branches.forEach(branch => promises.push({
      slug: dataset.slug,
      branch: Object.keys(branch)[0],
      promise: d3.json(url + "info/" + dataset.slug + "/" + Object.keys(branch)[0], {headers: {Authorization: `Bearer ${token}`, Accept: "application/json"}})
    }) ))
  
    const resolved = await Promise.all(promises.map(m => m.promise));
  
    const result = {};
    for(let i in resolved) {
      result[promises[i].slug + " " + promises[i].branch] = resolved[i]
    }
    return result
  }

  export async function sync(url, slug, branch) {
    if (url && slug && branch) return d3.json(`${url}sync/${slug}/${branch}`);
    if (url && slug) return d3.json(`${url}sync/${slug}`);
    if (url) return d3.json(`${url}sync`);
    return console.error("bad params supplied to sync", {url, slug, branch});
  }

  export async function syncprogress(url) {
    return d3.json(url + "syncprogress");
  } 

  export async function getConceptsInDataset(datasetSlug){
    update; refresh;
    if (!datasetSlug) return [];
    const queryString = `_language=en&select_key@=concept;&value@=concept/_type&=domain&=name&=name/_catalog&=name/_short&=tags;;&from=concepts`
    const response = await d3.json(`${url}${datasetSlug}?${queryString}`);
    return response.rows.map(c => {
      const concept = {};
      c.forEach( (d,i) => concept[response.header[i]] = d );
      return concept;
    })
  }

  export async function getGeosDictionaryInDataset(datasetSlug) {
    update; refresh;
    if (!datasetSlug) return {};
    const queryString = `_language=en&select_key@=geo;&value@=geo&=name&=world/_4region&=is--country;;&from=entities`;
    const response = await d3.json(`${url}${datasetSlug}?${queryString}`);
    const entries = response.rows.map(c => {
      const geo = {};
      c.forEach( (d,i) => geo[response.header[i]] = d );
      return [geo.geo, geo];
    })
    
    return Object.fromEntries(entries) 
  }

  // eventData = {
  //   const events = await getEvents();
  //   return events.map(([key, value]) => {
  //     const parsedQuery = parseQuery(value.queryString);
  //     return {
  //       key, 
  //       ...value, 
  //       status: "http "+value.status, 
  //       query: parsedQuery,
  //       earliest: new Date(value.earliest_ms),
  //       latest: new Date(value.latest_ms),
  //       from: parsedQuery?.from,
  //       nSelectValue: parsedQuery?.select?.value?.length,
  //       nSelectKey: parsedQuery?.select?.key?.length
  //     }
  //   })
  // }

  // summaryBreakdowns = {
  //   const data = await eventData;
    
  //   const byDatasets = toTidy(d3.rollup(eventData, v => d3.sum(v, d => d.count), d => d.datasetSlug));
    
  //   const byStatusCode = toTidy(d3.rollup(eventData, v => d3.sum(v, d => d.count), d => d.status));
  
  //   const status = await getStatus();
  //   const allowed = new Set(status.allowedDatasets.map(m => m.slug));
  //   const byQueryTypeAndDatasetAndStatus = d3
  //     .flatRollup(eventData, v => d3.sum(v, d=>d.count), d => d.query?.from || d.type, d => d.datasetSlug, d => d.status)
  //     .map(([type, dataset, status, count])=>({type, dataset, status, count}))
  //     .filter(f => allowed.has(f.dataset));
  
  //   return {byDatasets, byStatusCode, byQueryTypeAndDatasetAndStatus};
  // }


  // toTidy = (map) => [...map].map(([k,v])=>({k,v}))

  // parseQuery = (queryString = "") => {
  //   if(queryString[0] !== "_") return null;
  //   try { return urlon2.parse(queryString) } catch(err) {return null};
  // }

  // urlon2 = require('urlon@2.1.0/lib/urlon.js').catch(() => window["URLON"])

  export function timediff(time, emo = true, ago = false){

    const parsed = new Date(time)
    const now = new Date();
  
    let attempt;
  
    function diff(time, now, counter, limit, fraction, firstLabel, secondLabel, emoSymbol){
      const count = counter.count(time, now);
      if (count <= limit) return false;
      const first = Math.floor(count / fraction);
      const second = count % fraction;
      const firstS = (""+first).at(-1) !== "1" && firstLabel.length > 1 ? "s":"";
      const secondS = (""+second).at(-1) !== "1" && secondLabel.length > 1 ? "s":"";
      return `${emo ? emoSymbol + " " : ""}${first}${firstLabel}${firstS} ${second?second:""}${second?secondLabel:""}${second?secondS:""} ${ago ? "ago":""}`
    }
  
    attempt = diff(parsed, now, d3.timeMonth, 12, 12, " year", " month", "🌚") // over a year ago
    if (attempt) return attempt;
  
    attempt = diff(parsed, now, d3.timeWeek, 6*4, 4, " month", " week", "🌑") // over 6x4 weeks ago
    if (attempt) return attempt;
  
    attempt = diff(parsed, now, d3.timeWeek, 4, 4, " month", " week", "🌘") // over 4 weeks ago
    if (attempt) return attempt;
  
    attempt = diff(parsed, now, d3.timeDay, 2*7, 7, " week", " day", "🌗") // over 2 weeks ago
    if (attempt) return attempt;
  
    attempt = diff(parsed, now, d3.timeDay, 7, 7, " week", " day", "🌖") // over 7 days ago
    if (attempt) return attempt;
  
    attempt = diff(parsed, now, d3.timeHour, 24, 24, " day", "h", "🌕") // over 24 hours ago
    if (attempt) return attempt;
  
    attempt = diff(parsed, now, d3.timeMinute, 60, 60, "h", "m", "🔥") // over an hour ago
    if (attempt) return attempt;
  
    attempt = diff(parsed, now, d3.timeSecond, 60, 60, "m", "s", "🔥🔥") // over 60s ago
    if (attempt) return attempt;
  
    const diffS = d3.timeSecond.count(parsed, now)
    if (diffS > 1) return (emo ? "🔥🔥🔥 ":"") + diffS + "s" + (ago ? " ago":"") // under a minute ago
  }