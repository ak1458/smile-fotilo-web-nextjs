import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const base='https://smilefotilo.com';
const targets=['/','/pricing','/tools','/marketplace','/services/web-design','/blog'];
const modes=[
  {name:'desktop', viewport:{width:1366,height:768}, isMobile:false, hasTouch:false},
  {name:'mobile', viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:2}
];

const outDir=path.join(process.cwd(),'audit-output','viewport-shots');
await fs.mkdir(outDir,{recursive:true});

const browser=await chromium.launch({headless:true});
for(const mode of modes){
  const context=await browser.newContext(mode);
  for(const p of targets){
    const page=await context.newPage();
    await page.goto(new URL(p,base).toString(),{waitUntil:'networkidle',timeout:60000});
    await page.waitForTimeout(1500);
    const safe = p==='/'?'home':p.replace(/^\//,'').replace(/[\\/]/g,'__');
    await page.screenshot({path:path.join(outDir,`${mode.name}-${safe}-top.png`),fullPage:false});
    await page.mouse.wheel(0,600);
    await page.waitForTimeout(500);
    await page.screenshot({path:path.join(outDir,`${mode.name}-${safe}-scroll.png`),fullPage:false});
    await page.close();
  }
  await context.close();
}
await browser.close();
console.log('done');
