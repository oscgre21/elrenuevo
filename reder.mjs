import { selectComposition, renderMedia } from "@remotion/renderer";
 
import { bundle } from "@remotion/bundler";
  
const compositionId = "Audiogram";
 
const bundleLocation = await bundle({
  entryPoint: "./src/index.ts", 
});
 
 
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: compositionId,
    inputProps: {},
  });
 
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: `out/test.mp4`,
    inputProps: {},
  });
 