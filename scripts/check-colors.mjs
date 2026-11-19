import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from '@astrojs/compiler';
import postcss from 'postcss';
import values from 'postcss-value-parser';
import ts from 'typescript';
import { Color } from 'three';
import roles from '../src/styles/colors.json' with { type: 'json' };
import { checkAssets } from './color-assets.mjs';

const paints = /^(?:color|fill|stroke|(?:stop|flood|lighting)-color|.*-color)$/i;
const composite = /^(?:background(?:-image)?|border(?:-(?:top|right|bottom|left|inline|block))?|outline|(?:box|text)-shadow|filter|text-decoration|caret-color)$/i;
const neutral = /^(?:none|transparent|currentcolor|inherit|initial|unset)$/i;
const pigment = /^(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|device-cmyk|light-dark)$/i;
const names = Object.keys(roles).join('|');
const semantic = new RegExp('^rgb\\(\\s*var\\(--(?:'+names+')\\)\\s*(?:/\\s*(?:[.\\d]+%?|var\\(--hair-a\\)))?\\s*\\)$','i');
const systemColors = /^(?:AccentColor(?:Text)?|ActiveText|Button(?:Border|Face|Text)|Canvas(?:Text)?|Field(?:Text)?|GrayText|Highlight(?:Text)?|LinkText|Mark(?:Text)?|SelectedItem(?:Text)?|VisitedText)$/i;
const isNamed = v => Object.hasOwn(Color.NAMES,v.toLowerCase()) || systemColors.test(v);
const hues = /^(?:black|white|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:-\d+)?)$/;
const sink = /^(?:fillStyle|strokeStyle|shadowColor|color|backgroundColor|borderColor|background|emissive|specular)$/;

export async function inspect(file, source) {
  const errors = new Set();
  const bad = (line, v) => errors.add(file+':'+line+': '+v+' — use a role from docs/COLOR.md');
  function value(prop, v, line) {
    const direct = paints.test(prop);
    if (!direct && !composite.test(prop) && !prop.startsWith('--')) return;
    if (Object.hasOwn(roles,prop.slice(2)) && prop.startsWith('--')) bad(line,'role override '+prop);
    if (direct && !neutral.test(v) && !semantic.test(v) &&
        !/^url\(#[\w:-]+\)$/.test(v) && !/^color-mix\(/i.test(v)) return bad(line, prop+': '+v);
    values(v).walk(node => {
      if (node.type==='function') {
        if (node.value==='url') return false;
        if (pigment.test(node.value)) {
          if (!semantic.test(values.stringify(node))) bad(line,values.stringify(node));
          return false;
        }
        if (node.value==='var' && !prop.startsWith('--')) bad(line,values.stringify(node));
      }
      if (node.type==='word' && (/^#[\da-f]{3,8}$/i.test(node.value)||isNamed(node.value))) bad(line,node.value);
    });
  }
  function classes(v,line) {
    // Identify candidates in both class lists and literal JS/TS class fragments.
    const re = /(?:^|[^\w-])!?(bg|text|border(?:-[xytrblse])?|outline|ring(?:-offset)?|shadow|drop-shadow|fill|stroke|from|via|to|divide|decoration|placeholder|accent|caret)-(?:(\[[^\]]+\])|([\w-]+))/g;
    for(const m of v.matchAll(re)) {
      if(m[3] && hues.test(m[3])) bad(line,m[0].trim());
      if(m[2]) {
        const x=m[2].slice(1,-1).replaceAll('_',' ');
        if (/^(?:[.\d]+(?:px|r?em|%|vw|vh)?|clamp\([.\d\w,% -]+\))$/.test(x)) continue;
        value(/shadow/.test(m[1])?'box-shadow':m[1]==='bg'?'background':'color',x.replace(/^color:/,''),line);
      }
    }
    for(const m of v.matchAll(/\[([\w-]+):([^\]]+)\]/g)) value(m[1],m[2].replaceAll('_',' '),line);
  }
  function css(v,line) {
    try {
      const root=postcss.parse(v);
      root.walkDecls(d=>value(d.prop,d.value.trim(),line+d.source.start.line-1));
      root.walkAtRules('apply',a=>classes(a.params,line+a.source.start.line-1));
    } catch(e) { bad(line+(e.line||1)-1,'unparsed CSS: '+e.reason); }
  }
  function js(v,line) {
    const ast=ts.createSourceFile(file.endsWith('x')?'inline.tsx':'inline.ts',v,ts.ScriptTarget.Latest,true);
    const visit=n=>{
      const l=line+ast.getLineAndCharacterOfPosition(n.getStart(ast)).line;
      const check=arg=>{
        const s=arg?.getText(ast)??'';
        const m=s.match(/^palette\[['"]([\w-]+)['"]\]$/);
        if(m && Object.hasOwn(roles,m[1])) return;
        if(ts.isNewExpression(arg??n) && /^new Color\(/.test(s)) return; // constructor checked separately
        if(arg && ts.isStringLiteralLike(arg)) return value('color',arg.text,l);
        bad(l,'dynamic or numeric paint: '+s);
      };
      if(ts.isJsxAttribute(n) && paints.test(n.name.getText(ast)) && n.initializer) {
        check(ts.isJsxExpression(n.initializer)?n.initializer.expression:n.initializer);
      }
      if(ts.isBinaryExpression(n) && n.operatorToken.kind===ts.SyntaxKind.EqualsToken && ts.isPropertyAccessExpression(n.left)) {
        if (sink.test(n.left.name.text)) check(n.right);
        if (n.left.name.text==='cssText') {
          if (ts.isStringLiteralLike(n.right)) css(n.right.text,l);
          else bad(l,'dynamic cssText');
        }
      }
      if(ts.isPropertyAssignment(n) && sink.test(n.name.getText(ast).replace(/['"]/g,''))) check(n.initializer);
      if(ts.isNewExpression(n) && /^(?:Color|Fog|AmbientLight|DirectionalLight|PointLight|SpotLight|HemisphereLight)$/.test(n.expression.getText(ast).split('.').pop()) && n.arguments?.length) {
        check(n.arguments[0]); if(n.expression.getText(ast).endsWith('HemisphereLight') && n.arguments.length>1) check(n.arguments[1]);
      }
      if(ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression)) {
        const key=n.expression.name.text, args=n.arguments;
        if(/^(?:setClearColor|setHex|setRGB|setHSL|setStyle)$/.test(key) || key==='set' && /\b(?:color|emissive|specular)$/i.test(n.expression.expression.getText(ast))) check(args[0]);
        if(key==='setColorAt') check(args[1]);
        if(key==='setProperty' && args[0] && ts.isStringLiteralLike(args[0]) && args[0].text.startsWith('--') && Object.hasOwn(roles,args[0].text.slice(2))) bad(l,'role override '+args[0].text);
        if(key==='addColorStop') check(args[1]);
        if(key==='setAttribute' && args[0] && ts.isStringLiteralLike(args[0]) && args[0].text==='style') {
          if(args[1] && ts.isStringLiteralLike(args[1])) css(args[1].text,l);
          else bad(l,'dynamic style attribute');
        }
        if(key==='setAttribute' && args[0] && ts.isStringLiteralLike(args[0]) && paints.test(args[0].text)) check(args[1]);
        if(key==='setProperty' && args[0] && ts.isStringLiteralLike(args[0]) && paints.test(args[0].text)) check(args[1]);
      }
      if(ts.isStringLiteralLike(n) || ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n)) {
        classes(n.text,l);
        if(/<[\w-]+\s/.test(n.text)) for(const m of n.text.matchAll(/\s(fill|stroke|stop-color|style)=["']([^"']+)["']/gi))
          m[1]==='style'?css(m[2],l):value(m[1],m[2],l);
      }
      ts.forEachChild(n,visit);
    };
    visit(ast);
  }
  if(file.endsWith('.css')) css(source,1);
  else if(/\.[cm]?[jt]sx?$/.test(file)) js(source,1);
  else {
    // Do not interpret markdown prose, fences, code spans or YAML as markup.
    if(/\.mdx?$/.test(file)) source=source.replace(/^---\r?\n[\s\S]*?\r?\n---|^ *(`{3,}|~{3,})[^\n]*\n[\s\S]*?^ *\1[^\n]*|`[^`\n]+`/gm,m=>m.replace(/[^\n]/g,' '));
    const ast=(await parse(source,{position:true})).ast;
    const visit=n=>{
      const line=n.position?.start?.line||1;
      if(n.type==='frontmatter') js(n.value,line);
      for(const a of n.attributes??[]) {
        const l=a.position?.start?.line||line;
        if(a.name==='style') {
          if(a.kind==='expression') {
            js('('+a.value+')',l);
            const expr=a.value.trim();
            if (/^(['"])[\s\S]*\1$/.test(expr)) css(expr.slice(1,-1),l);
            else if (!expr.includes('`') && !expr.includes('{')) bad(l,'opaque inline style expression');
            for(const m of a.value.matchAll(/`([^`]*)`/g)) css(m[1].replace(/\$\{[^}]*\}/g,'DYNAMIC'),l);
          } else css(a.value,l);
        } else if(a.name==='class'||a.name==='class:list') classes(a.value,l);
        else if(paints.test(a.name)) value(a.name,a.value,l);
      }
      for(const c of n.children??[]) {
        if(n.name==='style') css(c.value,c.position?.start?.line||line);
        else if(n.type==='expression' && c.type==='text') js(c.value,c.position?.start?.line||line);
        else if(n.name==='script') js(c.value,c.position?.start?.line||line);
        else visit(c);
      }
    };
    visit(ast);
  }
  return [...errors];
}

async function walk(dir) {
  for(const f of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name,'en'))) {
    const file=dir+'/'+f.name;
    if(f.isDirectory()) { await walk(file); continue; }
    if(!/\.(?:css|astro|html|svg|mdx?|[cm]?[jt]sx?)$/.test(file) || /\.(?:test|spec)\.[jt]sx?$/.test(file)) continue;
    if(['src/styles/colors.css','public/favicon.svg','public/favicon-light.svg'].includes(file)) continue; // byte-checked
    for(const msg of await inspect(file,fs.readFileSync(file,'utf8'))) { console.error(msg); process.exitCode=1; }
  }
}
if(process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  checkAssets();
  for(const dir of ['src','public']) await walk(dir);
  if(!process.exitCode) console.log('Palette sources and generated assets agree.');
}
