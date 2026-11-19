import test from 'node:test';
import assert from 'node:assert/strict';
import { inspect } from './check-colors.mjs';

const denied = [
  ['css', '.bad { background: linear-gradient(white, rgb(var(--bg))); }'],
  ['css', '.bad { border: 1px solid oklch(50% .2 40); }'],
  ['css', '.bad { color: rgb(var(--typo)); }'],
  ['css', '.bad { --accent: 255 0 0; }'],
  ['css', '.bad { @apply dark:hover:border-l-sky-600/50; }'],
  ['astro', '<div class:list={[active && "dark:bg-[#abcdef]"]}/>'],
  ['astro', '<div class="bg-[linear-gradient(red,blue)]"/>'],
  ['astro', '<div style="border-color: hsl(1 2% 3%)"/>'],
  ['astro', '<div style={`color: red`}/>'],
  ['astro', "<div style={{ color: 'violet' }}/>"],
  ['svg', '<svg><stop stop-color="#fff"/></svg>'],
  ['md', 'ordinary prose\n\n<b style="color:blue">annotation</b>'],
  ['tsx', '<path stroke="peru"/>'],
  ['astro', "<div style={'color:#abc'}/>"],
  ['ts', "el.style.cssText = 'background:salmon';"],
  ['ts', "el.setAttribute('style','color:#bad');"],
  ['ts', 'ctx.fillStyle = arbitraryValue;'],
  ['ts', "grad.addColorStop(0, 'rebeccapurple');"],
  ['ts', 'new THREE.MeshLambertMaterial({ color: 0xff00ff });'],
  ['ts', 'new THREE.Color(0.1, 0.2, 1);'],
  ['ts', 'renderer.setClearColor(0x123456);'],
  ['ts', 'mat.color.setHex(255);'],
  // The retired pink correction ink is no longer a role anywhere.
  ['css', '.bad { stroke: rgb(var(--accent-2)); }'],
  ['ts', "ctx.strokeStyle = palette['accent-2'];"],
  ['astro', '<div class="text-pink-500 bg-rose-400"/>'],
];
const allowed = [
  ['css', '.ok { background: linear-gradient(transparent, rgb(var(--bg) / .2)); color: currentColor; }'],
  ['css', '.ok { background: url(/photo.png#c0ffee); }'],
  ['astro', '<div class="dark:hover:text-accent/80 text-[12px] bg-transparent"/>'],
  ['svg', '<path fill="none" stroke="rgb(var(--accent))"/>'],
  ['md', 'The literal #badbad and [an anchor](/x#fff).\n\n```css\np {color:red}\n```'],
  ['ts', "const id='#c0ffee'; ctx.strokeStyle=palette['accent'];"],
  ['ts', "new THREE.MeshBasicMaterial({color:palette['metal']});"],
];
for(const [expected,cases] of [[true,denied],[false,allowed]]) {
  for(const [ext, sample] of cases) test((expected?'reject ':'allow ')+sample, async()=>{
    const messages=await inspect('sample.'+ext,sample);
    assert.equal(messages.length>0,expected,messages.join('\n'));
    if(expected) assert.match(messages[0],/^sample\.\w+:\d+:/);
  });
}
