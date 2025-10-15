
import {getVideoIframeHTMLTemplate} from "../core/utils";

const VideoBlock = function({ dom, videoSrc = ""}) {
  const template = `  
    <img src="assets/images/ibf_video_thumb.png"/>
  `;

  const placeHolder = d3.select(dom).html(template).style("display", videoSrc ? "null" : "none");
  placeHolder.on("click", () => {
    placeHolder.html(getVideoIframeHTMLTemplate(videoSrc));
  });


};

export default VideoBlock;


