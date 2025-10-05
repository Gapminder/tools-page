import {sync, syncprogress} from "./waffle-helpers.js"
      

function formatSyncEvent(events) {
  return events.length > 0 ? events.at(-1).comment : "";
}

export async function syncDataset({selectedServerId, selectedServerUrl, slug, branch, good, info, progress, bad, refresh}){
  
  const syncResponse = await sync(selectedServerUrl, slug, branch);

  progress(formatSyncEvent(syncResponse.events))
  
  const interval = setInterval(async ()=>{
    const syncProgressResponse = await syncprogress(selectedServerUrl);
    if(syncProgressResponse.ongoing) {
      progress(formatSyncEvent(syncProgressResponse.events))
    } else {
      good(formatSyncEvent(syncProgressResponse.events))
      setTimeout(() => {
        info();
        refresh();
      }, 3000); //reset after 3s
      clearInterval(interval);
    }
  }, 500);
  
}