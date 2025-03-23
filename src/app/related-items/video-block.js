
import * as utils from "../core/utils";

const VideoBlock = function({ dom }) {
  const template = `  
    <img src="assets/images/ibf_video_thumb.png"/>
  `;

  const placeHolder = d3.select(dom).html(template);
  placeHolder.on("click", () => {
    placeHolder.html(`
      <iframe src="https://player.vimeo.com/video/1065445795?badge=0&amp;autoplay=1&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" style="width:100%;height:100%;" title="Boendebarometern"></iframe>
      <script src="https://player.vimeo.com/api/player.js"></script>
    `);
  });


};

export default VideoBlock;


