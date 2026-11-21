/**
 * Circa, 1200 S Figueroa Street, Los Angeles. Creator: Coping3174.
 * Original procedural draft by Codex (GPT-6); bun generators/la-circa.ts.
 * Frame: local x along the long tower faces, y toward Figueroa, z up;
 * bearing -52.3 degrees; ground anchor (-118.2665426,34.0410945).
 *
 * Sources and measured facts:
 * - OSM ways 582055207 (outline), 641096673/674 (east/west towers),
 *   1497498041 (7-level podium), downloaded 2026-11-20; ODbL-1.0.
 *   https://www.openstreetmap.org/way/582055207
 *   Podium plan follows the outline; tower positions/dimensions follow parts.
 * - User-supplied roof/sign elevations supersede the earlier approximate 406 ft:
 *   roof 394 ft 3 in; screen low 403 ft 9.5 in / high 416 ft 11 in;
 *   letters top 416 ft 2 in; octagon top 417 ft 11 in. Levels are relative
 *   drawing heights; parenthesized surveyed site elevations are not model Z.
 * - CKC structural engineer describes two elliptical towers over 8 levels,
 *   420 ft total: https://www.ckcps.com/projects/circa . Height conventions
 *   disagree with OSM and other summaries; do not claim survey accuracy.
 * - https://downtownla.com/building/circa : 35 floors, completion 2018.
 * - User-supplied amenity plan, night exterior, approved west/north elevation,
 *   daytime Figueroa exterior and two Flower Street views, 2026-11-19.
 *   User explicitly directed modeling from these. Licenses unverified;
 *   Flower views contain Google watermarks. They are not redistributed.
 *   This draft is NOT cleared for Open Landmarks/publication; independently
 *   replace/verify image-derived geometry with eligible evidence first.
 *
 * Identifying features: offset curved twin towers (OSM/plan), shallow blue
 * curtainwall and stacked balcony slots (elevation/photos), sloped crowns
 * and raised west sign (elevation), wraparound Figueroa LED fascia (photos),
 * contrasting slatted Flower podium and round/lap pools (Flower views/plan).
 * Revision: user-supplied north/northeast night photos added 2026-11-19.
 * Recessed column arcade, charcoal slatted screen surrounds, warm garage
 * slots, sparse individual occupied windows and rose tower strips. Their
 * dimensions are photo estimates. Eight materials preserve distinct display whites, the separate
 * blue CHASE mark and pink architectural lights (draft palette exception).
 * Billboard revision: continuous rounded corner with a shortened 12th Street
 * return and a separate southern Figueroa panel, estimated from user aerial.
 * Estimates: podium 27 m, 27 equal curtainwall floor intervals,
 * balcony projection 1.3 m, screen extent, crown slope, sign mounting,
 * pool/landscape sizes and pavilion. Oval screen plan 50 x 27 m and panel
 * spacing are photo estimates; vertical screen/sign levels follow drawings.
 * All 27 tower rows retained in High; Low groups 9 rows. Plain display
 * faces stand in for changing advertisements. CHASE sign geometry follows the
 * user-supplied approved elevation; mark and lettering are draft approximations.
 * Southwest revision: through-drive (12 m wide, 5.3 m soffit), woven garage
 * screen, clerestory and external billboard lamps inferred from user photos.
 * Flower-side full-height setback follows the supplied sign plan and street
 * photos; it wraps the lower east tower between the garage and billboard.
 * Tower revision follows supplied penthouse plan: west-end notch, rounded
 * east nose, bowed sides and four recessed balcony stacks. Balcony depths
 * and regular-floor repetition are photo estimates, not surveyed geometry.
 * Sign revision: dimensioned channel-letter artwork sets 75 ft overall width,
 * 58 ft 11 in word, 11 ft letters, 14 ft 6 in octagons and 9.5 in depth.
 * Keyline thickness and sampled material colors are artwork estimates.
 * Exact setback depths and portal/interior dimensions remain estimates. Fourteen materials
 * retain cyan rear tower lights and dark balcony glazing (draft palette exception). Parking stalls,
 * roof equipment, furnishings and adjacent buildings omitted.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { Pen, strokes } from './lettering'
import { ShapeUtils, Vector2 } from 'three'
import { rect, prism, facePanel, type XY } from './nyc-432-park'
import { ccw, cap, walls } from './la-getty-center'

const ID='la-circa', DECK=27, TOP=(394+3/12)*.3048
const SCREEN_LOW=(403+9.5/12)*.3048, SCREEN_HIGH=(416+11/12)*.3048
const LETTER_TOP=(416+2/12)*.3048, LOGO_TOP=(417+11/12)*.3048
// Photo-estimated rounded Figueroa/12th corner, shared by podium and LED skin.
const corner: XY[] = Array.from({length:13},(_,i)=>{
 const t=i/12,u=1-t;
 return [u*u*42+2*u*t*38.4+t*t*34,u*u*49.3+2*u*t*58.16+t*t*58.16]
})
// Flower setback follows the east tower south curve between the garage and
// billboard, with full-height returns. Depths estimated from the supplied plan.
const podium: XY[] = [[-26.03, 59.04], [-26.14, 47.56], [-23.73, 16.95], [-23.75, 13.29], [-23.77, 9.58], [-70.11, 10.31], [-70.97, -31.96], [-13.27, -32.51], [10, -32.357], [10, -22.9], [14, -25.9], [21, -27.9], [33, -28.6], [49, -28.6], [59, -26.6], [59, -32.035], [76.36, -31.92], [82.89, -31.64], [84.64, -30.14], [85.54, -27.97], [85.74, -24.45], [82.8, -17.04], [78.87, -9.77], [70.7, 3.98], [69.58, 1.49], [64.79, 2.84], [60.51, 5.24], [57.14, 7.93], [54.57, 12.12], [53.74, 23.62], [47.98, 34.71], ...corner, [-12.49, 58.81]]
// Plan-traced asymmetric tower: bowed sides, rounded east nose and west notch.
// Balcony slots are part of the envelope, not boxes applied over intact glass.
const template: XY[] = [[-29,-11.5],[-23,-14],[-15,-16],[-7,-17.2],
 [0,-17.6],[0,-15.2],[4.5,-15.2],[4.5,-17.6],[12,-17],[20,-15.2],
 [20,-13],[24,-11.5],[25,-13],[28,-9],[30,-4],[30,2],[28.5,7],[25,11],
 [23,12.5],[21.5,10.7],[17.5,12.2],[18.5,14.4],[10,16.5],[0,17.5],
 [-5,17.4],[-5,15.1],[-9.5,15],[-9.5,17],[-18,15.2],[-25,12.8],
 [-29,10],[-29,4],[-25,3.5],[-25,-3.5],[-29,-4]]
const balconyPlans:XY[][]=[
 [[0,-15.2],[4.5,-15.2],[4.5,-18.4],[0,-18.4]],
 [[20,-13],[24,-11.5],[26,-14.2],[20.2,-16.4]],
 [[21.5,10.7],[17.5,12.2],[18.7,15.6],[24,13.4]],
 [[-5,15.1],[-9.5,15],[-9.5,18],[-5,18.4]]
]
const centres: XY[]=[[12.5,33.2],[39,-10.9]]
const circle=(x:number,y:number,r:number,n=20):XY[]=>Array.from({length:n},(_,i)=>[x+r*Math.cos(i*2*Math.PI/n),y+r*Math.sin(i*2*Math.PI/n)])
function build(detail:boolean,massing=false){
 const trim=new Part(), glass=new Part(), dark=new Part(), deck=trim, green=new Part(), glow=new Part(), occupied=new Part(), pink=new Part(), screens=new Part(), cyan=new Part(), railGlass=new Part(), roofMetal=new Part(), signFace=new Part(), signBlue=new Part(), signEdge=new Part()
 const block=(p:Part,x:number,y:number,w:number,d:number,z0:number,z1:number)=>prism(p,rect(x-w/2,x+w/2,y-d/2,y+d/2),z0,z1,{bevel:detail?.18:0,bottom:true})
 // Through-drive dimensions are photo estimates; clearance bar reads 13 ft 6 in.
 const GX0=-22,GX1=-10,GH=5.3
 const panel=(p:Part,a:XY,b:XY,s0:number,s1:number,z0:number,z1:number,off=0.04)=>{
  const L=Math.hypot(b[0]-a[0],b[1]-a[1]),ux=(b[0]-a[0])/L;
  if(z0>=GH || Math.abs(ux)<1e-6){facePanel(p,a,b,s0,s1,z0,z1,off);return}
  const cuts=[s0,s1,...[GX0,GX1].map(x=>(x-a[0])/ux).filter(v=>v>s0&&v<s1)].sort((a,b)=>a-b);
  for(let j=0;j<cuts.length-1;j++){
   const l=cuts[j],r=cuts[j+1],x=a[0]+ux*(l+r)/2;
   const bottom=x>GX0&&x<GX1?Math.max(z0,GH):z0;
   if(z1>bottom)facePanel(p,a,b,l,r,bottom,z1,off);
  }
 }
 const isLobbyEdge=(a:XY,b:XY)=>a[0]>=10 && a[0]<=59 && b[0]>=10 && b[0]<=59 && a[1]>-29 && b[1]>-29 && a[1]<-20 && b[1]<-20
 const ring=ccw(podium)
 // Recess the long Figueroa frontage behind an actual column arcade.
 for(let i=0;i<ring.length;i++){
  const a=ring[i],b=ring[(i+1)%ring.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);
  const arcade=(a[1]+b[1])/2>45 && L>20
  if(isLobbyEdge(a,b)){
   panel(trim,a,b,0,L,6,DECK,0);
   panel(glass,a,b,0,L,0,6,-1.1);
   const ux=(b[0]-a[0])/L,uy=(b[1]-a[1])/L;
   trim.quad([a[0],a[1],6],[a[0]-uy*1.1,a[1]+ux*1.1,6],[b[0]-uy*1.1,b[1]+ux*1.1,6],[b[0],b[1],6]);
   continue;
  }
  if(!arcade){panel(trim,a,b,0,L,0,DECK,0);continue}
  panel(trim,a,b,0,L,6.8,DECK,0)
  panel(occupied,a,b,0,L,0,6.8,-2.4)
  const ux=(b[0]-a[0])/L,uy=(b[1]-a[1])/L
  for(let d=1;d<L;d+=6)if(a[0]+ux*d<GX0-.5||a[0]+ux*d>GX1+.5)block(trim,a[0]+ux*d-uy*.5,a[1]+uy*d+ux*.5,.8,.8,0,6.8)
  for(let d=2;d<L-2;d+=8)panel(occupied,a,b,d,d+3,6.15,6.4,-.8)
 }
 cap(deck,ring,DECK);cap(trim,ring,0,false)
 if(!massing){
  // Ground floor glazing and Flower street parking louvers.
  for(let i=0;i<ring.length;i++){
   const a=ring[i],b=ring[(i+1)%ring.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);
   if(!isLobbyEdge(a,b) && !((a[1]+b[1])/2>45 && L>20))panel(dark,a,b,.25,L-.25,1,6,.04)
   const bays=Math.max(1,Math.round(L/6));
   for(let j=1;j<bays;j++)if(!isLobbyEdge(a,b))panel(trim,a,b,j*L/bays-.25,j*L/bays+.25,0,6.5,.055)
   const flower=(a[1]+b[1])/2 < -20
   const fig=(a[1]+b[1])/2>45 || ((a[0]+b[0])/2>45 && (a[1]+b[1])/2>0)
   const returnWall=Math.abs(b[0]-a[0])<.01 && a[0]>=10 && a[0]<=59 && a[1]<-20 && b[1]<-20;
   const recessed=isLobbyEdge(a,b);
   if(returnWall){
    panel(trim,a,b,0,L,6.5,DECK,.07);
    for(let z=7;z<DECK;z+=3.4)panel(dark,a,b,0,L,z,z+.045,.08);
    for(let d=1;d<L;d+=2.5)panel(dark,a,b,d,d+.035,6.5,DECK,.08);
    if(a[0]===59 && detail){
     panel(dark,a,b,.3,L-.3,7,DECK-.4,.09);
     for(let d=.5;d<L-.3;d+=.45)panel(trim,a,b,d,d+.11,7,DECK-.4,.24);
    }
   }else if(flower){
    const fullL=Math.hypot(b[0]-a[0],b[1]-a[1]),dx=(b[0]-a[0])/fullL;
    const garageL=dx>0?Math.max(0,Math.min(fullL,(10-a[0])/dx)):fullL;
    if(garageL<fullL){
     panel(recessed?dark:glass,a,b,garageL,fullL,6,DECK,.05);
     if(!recessed)for(let d=garageL;d<fullL;d+=detail?2.8:7)panel(trim,a,b,d,Math.min(fullL,d+.14),6.5,26,.065);
    }
    if(recessed){
     // Deep charcoal mullions, narrow glass bays and visible parking slabs.
     const count=detail?Math.ceil(fullL/1.7):Math.ceil(fullL/7);
     for(let j=0;j<count;j++){
      const l=j*fullL/count+.13,r=(j+1)*fullL/count-.13;
      panel(glass,a,b,l,r,6.3,DECK,.075);
      if(detail)for(let z=7;z<DECK-1;z+=3.48){
       panel(dark,a,b,l,r,z,z+.55,.09);
       if(j%3===1)panel(screens,a,b,l+.1,Math.min(r,l+.8),z+2.1,z+2.23,.1);
      }
     }
     panel(a[0]>=33?occupied:glass,a,b,.15,fullL-.15,.2,5.85,-1.05);
     for(let d=2;d<fullL;d+=detail?2.4:7)panel(dark,a,b,d,d+.14,.2,5.85,-1);
     // A projecting entrance head with round columns, as in the close view.
     panel(trim,a,b,0,fullL,5.85,6.25,.25);
     if(detail){
      const ux=(b[0]-a[0])/fullL,uy=(b[1]-a[1])/fullL;
      for(let d=2;d<fullL;d+=7){
       const x=a[0]+ux*d+uy*.3,y=a[1]+uy*d-ux*.3;
       prism(trim,circle(x,y,.38,10),0,5.85,{bottom:true});
      }
     }
     // Strong faceted corner: cyan strip continues down to the lobby canopy.
     if(a[0]===49){
      panel(dark,a,b,0,.65,6.25,DECK,.24);
      panel(cyan,a,b,.26,.42,6.4,DECK,.25);
     }
    }
    const L=garageL;
    if(L>.5){
    panel(dark,a,b,0,L,7,DECK-.3,.045)
    // Slab edges, luminous parking fixtures and the woven metal veil.
    for(let z=8;z<DECK-2.6;z+=3.4){
     panel(trim,a,b,0,L,z,z+.27,.07)
     for(let d=2;d<L-1;d+=detail?7:18)panel(screens,a,b,d,Math.min(L-.1,d+1.4),z+2.3,z+2.55,.2)
    }
    const n=Math.floor(L/(detail?.7:7));
    for(let j=1;j<n;j++){
     const d=j*L/n;
     panel(trim,a,b,d-.09,d+.09,7,DECK-.3,.13)
     if(detail)for(let z=7.2+(j%3)*.23;z<DECK-.65;z+=1.05)
      panel(trim,a,b,d+.1,Math.min(L,d+.42),z,z+.37,.14)
    }
    // The woven screen reaches the podium parapet. The roof pavilion sits
    // behind it; there is no continuous glazed band interrupting this face.
    panel(trim,a,b,0,L,DECK-.3,DECK,.16)
    }
   }else if(fig){
    panel(dark,a,b,0,L,6.8,26.4,.045)
    // Perforated charcoal parking skin remains visible around the displays.
    const gap=detail?.75:3.0
    for(let d=.5;d<L;d+=gap)panel(glass,a,b,d,Math.min(L,d+.12),7,26,.055)
    // Exposed garage light slots below the screen and beside its edges.
    for(let z=8;z<25;z+=3.5){
     panel(occupied,a,b,.4,Math.min(1.6,L-.2),z,z+.15,.066)
     if(L>20)panel(occupied,a,b,L-1.6,L-.4,z,z+.15,.066)
    }
   }
   panel(trim,a,b,0,L,flower?DECK-.3:26,DECK,.06)
  }
  // Explicit display routes, never inferred from every east-facing podium edge.
  // The 12th return stops before the west tower, leaving the connector unlit.
  // Shared, miter-offset vertices keep the LED face continuous around the bend.
  const strip=(path:XY[],surface:Part=screens,standOff=.085)=>{
   const normals=path.slice(1).map((b,i)=>{
    const a=path[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]);
    return [(b[1]-a[1])/L,-(b[0]-a[0])/L] as XY
   })
   const offset=path.map(([x,y],i)=>{
    const a=normals[Math.max(0,i-1)],b=normals[Math.min(i,normals.length-1)];
    const d=1+a[0]*b[0]+a[1]*b[1];
    return [x+standOff*(a[0]+b[0])/d,y+standOff*(a[1]+b[1])/d] as XY
   })
   for(let i=0;i<offset.length-1;i++){
    const a=offset[i],b=offset[i+1];
    surface.quad([a[0],a[1],9.5],[b[0],b[1],9.5],[b[0],b[1],24.5],[a[0],a[1],24.5])
   }
  }
  // 12th end is ~11 m beyond the rounded corner, estimated from the aerial.
  const endY=39.5,endX=42+(47.98-42)*(49.3-endY)/(49.3-34.71);
  const frontY=(x:number)=>58.16+(58.81-58.16)*(34-x)/(34+12.49);
  strip([[endX,endY],...corner,[4,frontY(4)]]);
  // Separate southern Figueroa panel, divided from the wrap by a solid pier.
  strip([[-1,frontY(-1)],[-12.49,58.81],[-23.5,58.997]]);
  // Flower/12th printed billboard: metal backing, lit by projecting lamps.
  const printPath:XY[]=[[59,-32.035],[76.36,-31.92],[82.89,-31.64],[84.64,-30.14],[85.54,-27.97],[85.74,-24.45],[82.8,-17.04]];
  strip(printPath,dark,.22);
  for(let i=0;i<printPath.length-1;i++){
   const a=printPath[i],b=printPath[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]),ux=(b[0]-a[0])/L,uy=(b[1]-a[1])/L;
   for(let d=.5;d<L;d+=detail?3:10){
    const x=a[0]+ux*d,y=a[1]+uy*d;
    block(trim,x+uy*.7,y-ux*.7,.15,1.4,25,25.13);
    block(screens,x+uy*1.3,y-ux*1.3,.4,.4,24.9,25.02);
   }
  }
  // An open, continuous drive aisle, with sidewalls and a downward-facing soffit.
  facePanel(trim,[GX0,59],[GX0,-32.5],0,91.5,0,GH,0);
  facePanel(trim,[GX1,-32.5],[GX1,59],0,91.5,0,GH,0);
  cap(dark,rect(GX0,GX1,-32.5,59),.03);
  cap(trim,rect(GX0,GX1,-32.5,59),GH,false);
  for(let y=-29;y<58;y+=detail?7:45){
   block(trim,GX0+.4,y,.6,.6,.03,GH);
   block(trim,GX1-.4,y,.6,.6,.03,GH);
   block(screens,(GX0+GX1)/2,y,5,.22,GH-.12,GH-.06);
  }
  if(detail){
   const glyphs:Record<string,number[][][]>={
    P:[[[0,0],[0,1],[.55,1],[.7,.85],[.7,.6],[.55,.5],[0,.5]]],
    U:[[[0,1],[0,.15],[.15,0],[.55,0],[.7,.15],[.7,1]]],
    B:[[[0,0],[0,1],[.5,1],[.7,.85],[.7,.65],[.5,.5],[0,.5]],[[.5,.5],[.7,.35],[.7,.15],[.5,0],[0,0]]],
    L:[[[0,1],[0,0],[.7,0]]],I:[[[.35,0],[.35,1]]],
    C:[[[.7,.85],[.55,1],[.15,1],[0,.85],[0,.15],[.15,0],[.55,0],[.7,.15]]],
    A:[[[0,0],[.28,1],[.42,1],[.7,0]],[[.15,.4],[.55,.4]]],
    R:[[[0,0],[0,1],[.55,1],[.7,.85],[.7,.6],[.55,.5],[0,.5]],[[.35,.5],[.7,0]]],
    K:[[[0,0],[0,1]],[[.7,1],[0,.45],[.7,0]]],
    N:[[[0,0],[0,1],[.7,0],[.7,1]]],
    G:[[[.7,.85],[.55,1],[.15,1],[0,.85],[0,.15],[.15,0],[.7,0],[.7,.45],[.4,.45]]]
   };
   for(const side of [-1,1]){
    const letters=new Pen();
    [...'PUBLIC PARKING'].forEach((c,i)=>{
     for(const path of glyphs[c]??[]){letters.moveTo([i*.79+path[0][0]*.7,path[0][1]*.65]);
      for(const [x,y] of path.slice(1))letters.lineTo([i*.79+x*.7,y*.65]);}
    });
    strokes(trim,letters.paths,{width:.065,depth:.06,back:true,
     place:(u,v,w):V3=>[side<0?GX0+.55+u:GX1-.55-u,side<0?-32.94-w:59.39+w,5.37+v]});
   }
  }
  for(const y of [-32.7,59.15]){
   block(dark,(GX0+GX1)/2,y,12.7,.35,5.3,6);
   block(trim,(GX0+GX1)/2,y,11.2,.16,4.1148,4.23);
   for(const x of [GX0+.7,GX1-.7])block(trim,x,y,.22,.22,0,1.1);
  }

 }
 for(let t=0;t<2;t++){
  const [cx,cy]=centres[t]; const r=ccw(template.map(([x,y])=>[x+cx,y+cy] as XY))
  prism(glass,r,DECK,TOP,{top:deck,bottom:true})
  if(!massing){
   const pitch=(TOP-DECK)/27, step=detail?1:9
   for(let k=0;k<=27;k+=step){
    const z=DECK+k*pitch
    walls(dark,r,z,Math.min(z+(detail?.20:.35),TOP+.25))
   }
   for(let i=0;i<r.length;i++){
    const a=r[i],b=r[(i+1)%r.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);
    const n=detail?Math.max(1,Math.round(L/3)):1
    if(L>4) for(let k=1;k<27;k+=step){
     const cells=detail?Math.max(1,Math.floor(L/3)):1
     for(let j=0;j<cells;j++)if(Math.abs(Math.sin(i*127.1+k*311.7+j*74.7+t*63.3)*43758.5453)%1<.19)
      facePanel(occupied,a,b,j*L/cells+.3,(j+1)*L/cells-.3,DECK+k*pitch+.45,Math.min(TOP-.2,DECK+(k+step)*pitch-.6),.055)
    }
    if([0,7,12].includes(i))facePanel(cyan,a,b,.08,.32,DECK+.4,TOP-.2,.10)
    // Photo-evidenced rose light strips at the outer balcony/curved bays.
    if([18,24,28].includes(i))facePanel(pink,a,b,.08,.43,DECK+.4,TOP-.2,.09)
    for(let j=0;j<n;j++)facePanel(dark,a,b,j*L/n,Math.min(L,j*L/n+(detail?.13:.25)),DECK,TOP,.04)
   }
   // Open balcony stacks with separate slab soffits and three-sided rails.
   for(const shape of balconyPlans){
    const q=shape.map(([x,y])=>[x+cx,y+cy] as XY);
    facePanel(shape[0][1]>0?pink:cyan,q[3],q[2],0,.16,DECK+.3,TOP,.035);
    for(let k=0;k<27;k+=step){
     const z=DECK+k*pitch;
     prism(trim,ccw(q),z,z+.22,{bottom:true});
     // Rear sliding doors sit at the back of the recess.
     const a=q[0],b=q[1],L=Math.hypot(b[0]-a[0],b[1]-a[1]);
     facePanel(dark,a,b,0,L,z+.23,Math.min(z+step*pitch-.25,TOP),.02);
     if(detail)facePanel(glass,a,b,.35,L*.48,z+.4,Math.min(z+step*pitch-.4,TOP),.03);
     for(let j=1;j<4;j++){
      const a=q[(j+1)%4],b=q[j],L=Math.hypot(b[0]-a[0],b[1]-a[1]);
      facePanel(railGlass,a,b,0,L,z+.22,z+.95,0);
      facePanel(dark,a,b,0,L,z+1.1,z+1.17,.015);
     }
    }
   }
  }
  // Sloped oval metal screen, with levels read from the supplied sign drawings.
  // The rounded north end is high; the opposite end drops toward the roof.
  const segments=detail?96:20;
  const cr=Array.from({length:segments},(_,i)=>{const a=i*2*Math.PI/segments;return [cx+25*Math.cos(a),cy+13.5*Math.sin(a)] as XY});
  const top=(x:number)=>SCREEN_LOW+(SCREEN_HIGH-SCREEN_LOW)*Math.max(0,Math.min(1,(x-cx+25)/50));
  for(let i=0;i<cr.length;i++){
   const a=cr[i],b=cr[(i+1)%cr.length];
   const ai:XY=[cx+(a[0]-cx)*.993,cy+(a[1]-cy)*.987],bi:XY=[cx+(b[0]-cx)*.993,cy+(b[1]-cy)*.987];
   roofMetal.quad([a[0],a[1],TOP],[b[0],b[1],TOP],[b[0],b[1],top(b[0])],[a[0],a[1],top(a[0])]);
   roofMetal.quad([bi[0],bi[1],TOP],[ai[0],ai[1],TOP],[ai[0],ai[1],top(a[0])],[bi[0],bi[1],top(b[0])]);
   roofMetal.quad([a[0],a[1],top(a[0])],[b[0],b[1],top(b[0])],[bi[0],bi[1],top(b[0])],[ai[0],ai[1],top(a[0])]);
   if(detail){
    // Fine standing seams add metal panel texture without a raster image.
    facePanel(railGlass,a,b,0,.035,TOP+.12,Math.min(top(a[0]),top(b[0]))-.06,.012);
   }
  }
  cap(deck,cr,TOP+.12);
  if(t===0){
   // Channel sign fabrication drawing: exact outside dimensions in metres.
   // Gray Fog keyline aluminum .125 in; black perforated letter faces;
   // blue 3M 3630-127 vinyl octagon faces. Fine vinyl perforations are
   // represented by the matte finish, not oversized holes at map scale.
   const wordWidth=(58+11/12)*.3048, letterHeight=11*.3048;
   const logoSize=14.5*.3048, totalWidth=75*.3048, depth=9.5*.0254;
   const keyline=.065; // outline thickness estimated from the supplied artwork
   const xRight=cx+21, signY=cy+13.75;
   type Placement=(u:number,v:number,w:number)=>V3;
   // Offset each edge inward; preserves constant-width keylines and counters.
   function inset(poly:XY[],d:number):XY[]{
    const r=ccw(poly);
    return r.map((b,i)=>{
     const a=r[(i+r.length-1)%r.length],c=r[(i+1)%r.length];
     const dx=b[0]-a[0],dy=b[1]-a[1],ex=c[0]-b[0],ey=c[1]-b[1];
     const l=Math.hypot(dx,dy),m=Math.hypot(ex,ey);
     const px=b[0]-dy/l*d,py=b[1]+dx/l*d,qx=b[0]-ey/m*d,qy=b[1]+ex/m*d;
     const det=dx*ey-dy*ex;
     if(Math.abs(det)<1e-8)return [px,py];
     const t=((qx-px)*ey-(qy-py)*ex)/det;
     return [px+t*dx,py+t*dy];
    });
   }
   function face(part:Part,outer:XY[],holes:XY[][],z:number,place:Placement){
    const all=[...outer,...holes.flat()];
    const tris=ShapeUtils.triangulateShape(outer.map(p=>new Vector2(...p)),holes.map(h=>h.map(p=>new Vector2(...p))));
    for(const tri of tris){
     let [a,b,c]=tri.map(i=>all[i]);
     if((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])<0)[b,c]=[c,b];
     part.tri(place(...a,z),place(...b,z),place(...c,z));
    }
   }
   function channel(outer:XY[],holes:XY[][],part:Part,place:Placement){
    face(signEdge,outer,holes,depth-.003175,place);
    face(part,inset(outer,keyline),holes.map(h=>inset(h,-keyline)),depth,place);
    for(const contour of [ccw(outer),...holes.map(h=>ccw(h).reverse())]){
     for(let i=0;i<contour.length;i++){
      const a=contour[i],b=contour[(i+1)%contour.length];
      signEdge.quad(place(...a,0),place(...b,0),place(...b,depth-.003175),place(...a,depth-.003175));
     }
    }
   }
   // Outline-traced custom letter silhouettes with chamfered terminals.
   // Normalized y is up. A has a true triangular counter.
   const glyphs: {outer:XY[],holes?:XY[][]}[]=[
    {outer:[[1,1],[.30,1],[.16,.96],[.06,.86],[0,.70],[0,.28],[.05,.13],[.16,.04],[.30,0],[1,0],[.86,.23],[.32,.23],[.25,.27],[.23,.34],[.23,.67],[.25,.74],[.32,.77],[.85,.77]]},
    {outer:[[0,0],[.25,0],[.25,.39],[.75,.39],[.75,0],[1,0],[1,1],[.75,1],[.75,.62],[.25,.62],[.25,1],[0,1]]},
    {outer:[[0,0],[.25,0],[.34,.22],[.69,.22],[.78,0],[1,0],[.61,1],[.40,1]],holes:[[[.43,.44],[.60,.44],[.515,.69]]]},
    {outer:[[1,1],[.30,1],[.16,.96],[.06,.86],[.02,.70],[.02,.60],[.07,.48],[.17,.41],[.33,.38],[.69,.38],[.75,.35],[.76,.29],[.72,.24],[.17,.24],[0,0],[.73,0],[.87,.04],[.96,.15],[1,.29],[1,.42],[.95,.53],[.85,.60],[.70,.62],[.32,.62],[.26,.65],[.25,.72],[.29,.77],[.85,.77]]},
    {outer:[[0,0],[1,0],[.85,.23],[.26,.23],[.26,.39],[.88,.39],[.88,.62],[.26,.62],[.26,.77],[.85,.77],[1,1],[0,1]]}
   ];
   // Relative widths/gaps traced from west elevation; normalize exact overall span.
   const widths=[1.03,1,1.09,1.03,.92],gap=.045;
   const scale=wordWidth/(widths.reduce((a,b)=>a+b,0)+4*gap);
   let offset=0;
   for(let i=0;i<glyphs.length;i++){
    const transform=(r:XY[])=>r.map(([u,v])=>[offset+u*widths[i]*scale,v*letterHeight] as XY);
    const g=glyphs[i];
    channel(transform(g.outer),(g.holes??[]).map(transform),signFace,
     (u,v,w)=>[xRight-u,signY+w,LETTER_TOP-letterHeight+v]);
    offset+=(widths[i]+gap)*scale;
   }
   function octagon(place:Placement){
    const r=logoSize/2,c=Math.SQRT2-1;
    // Four separate keyline-backed trapezoids, with square open centre.
    const q:XY[]=[[-c,1],[c,1],[1,c],[-c,c]];
    for(let k=0;k<4;k++){
     const a=k*Math.PI/2;
     const pts=q.map(([x,y])=>[(x*Math.cos(a)-y*Math.sin(a))*r,(x*Math.sin(a)+y*Math.cos(a))*r] as XY);
     channel(pts,[],signBlue,place);
    }
   }
   const logoCentre=xRight-totalWidth+logoSize/2;
   octagon((u,v,w)=>[logoCentre-u,signY+w,LOGO_TOP-logoSize/2+v]);
   octagon((u,v,w)=>[cx+25.2+w,cy+u,LOGO_TOP-logoSize/2+v]);

  }
 }
 if(!massing){
  // Amenity areas registered to the user plan: Flower-side round pool,
  // southern lap pool, and the pavilion at the Pico end.
  prism(trim,circle(-14,-13,12.7),DECK,DECK+.35,{bevel:.1})
  cap(glass,circle(-14,-13,10.7),DECK+.37)
  block(trim,-49,-12,26,7,DECK,DECK+.35);cap(glass,rect(-61,-37,-14.5,-9.5),DECK+.37)
  block(trim,-52,-26,35,9,DECK,DECK+4.5)
  facePanel(glass,[-69.5,-21.45],[-34.5,-21.45],1,34,DECK+.5,DECK+3.8,.04)
  for(const [x,y,w,d] of [[-14,3,22,4],[-29,-12,4,18],[1,-15,4,18],[-50,4,27,5],[-6,9,7,4],[5,1,8,5],[-20,-28,10,4]])
   block(green,x,y,w,d,DECK+.1,DECK+.8)
  // A few structural shade pergolas; no furniture or street trees.
  if(detail)for(const [x,y] of [[-25,3],[-2,4],[-48,3]]){
   for(const dx of [-2,2])for(const dy of [-2,2])block(trim,x+dx,y+dy,.3,.3,DECK,DECK+3)
   for(let j=-2;j<=2;j++)block(trim,x+j,y,.23,5,DECK+3,DECK+3.25)
  }
 }
 return [{part:trim,material:{...finish('trim',0xd6d9d9),floodlight:(p:V3)=>p[2]>9&&p[2]<25&&((p[1]>45)||(p[0]>45&&p[1]>0))?1:0}},
 {part:glass,material:finish('glass',0x719bb0)},
 {part:dark,material:finish('metal',0x4d5963)},
 {part:occupied,material:finish('window',0x819eaa)},
 {part:green,material:finish('garden',0x84967c)},
 {part:glow,material:finish('neon-screen',0x117acb)},
 {part:pink,material:finish('neon-rose',0xe9a7bc)},
 {part:cyan,material:finish('neon-cyan',0x9de8ed)},
 {part:railGlass,material:finish('glass-railing',0x465865)},
 {part:roofMetal,material:finish('metal-screen',0xbec3c8,.4)},
 {part:signEdge,material:finish('sign-gray-fog',0xa6aaa5,.55)},
 {part:signFace,material:finish('neon-chase-perforated-black',0x303633,.72)},
 {part:signBlue,material:finish('neon-chase-intense-blue',0x23549d,.68)},
 {part:screens,material:finish('neon-display',0xe5e6df)}].filter(p=>p.part.triangles)
}
if(import.meta.main){
 for(const detail of [false,true]){
  const parts=build(detail,process.argv.includes('--massing'))
  const n=parts.reduce((s,p)=>s+p.part.triangles,0)
  const bytes=writeGlb('Circa Los Angeles',parts,{creator:'Coping3174',license:'CC0-1.0',reviewStatus:'draft',note:'User-supplied image provenance unverified; not cleared for upstream publication.'})
  if(n>(detail?40000:8000)||bytes.length>(detail?1500000:250000))throw Error(`Budget: ${n} triangles, ${bytes.length} bytes`)
  await Bun.write(new URL(`../models/${ID}${detail?'.detail':''}.glb`,import.meta.url),bytes)
  console.log(`${detail?'High':'Low'}: ${n} triangles, ${bytes.length} bytes`)
 }
}
