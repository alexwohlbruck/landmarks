/**
 * Anderson House, Little & Browne, 1902–05. Original procedural study.
 * OSM way/66646611 (May 2026 extract): https://www.openstreetmap.org/way/66646611
 * Published architectural description: NPS NHL nomination pp.4–5:
 * https://npgallery.nps.gov/NRHP/GetAsset/548abe2d-6b5f-498c-bf0f-eb61942fac68
 * 85 ft central facade, 30 ft wings projecting 40 ft; rear terrace recess 15 ft.
 * DC OCTO 2022 lidar DSM above footprint p10 ground (23.686 m NAVD88): main
 * roof median 19.98m, wings 19.07/19.16m, portico 12.59m, rear terrace 6.69m.
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 * Cornices, small windows, gateway dimensions and chimney positions are estimates.
 * Visual references supplied by the user on 2026-11-20:
 * https://commons.wikimedia.org/wiki/File:Larz_Anderson_House_-_Society_of_the_Cincinatti.jpg
 * APK, CC BY 4.0: front bay counts, cornices, column proportions, roof profile.
 * Look-only: Society of the Cincinnati virtual-tour rear photo; rear features
 * are grounded in the NHL description, not measured from that photograph.
 * https://www.societyofthecincinnati.org/anderson-house-virtual-tour/
 * Additional identified references:
 * https://commons.wikimedia.org/wiki/File:Larz_Anderson_House_-_Washington,_D.C..jpg
 * AgnosticPreachersKid, CC BY-SA 3.0, 2008.
 * https://www.loc.gov/pictures/item/dc0009.photos.027161p/ — HABS DC-255,
 * northeast front, National Park Service, public domain.
 * The 2008 and HABS URL images remain unfetched. The user-supplied front
 * photograph is the inspectable, openly licensed comparison reference.
 * The documented U court, semicircular four-column portico, paired gateway
 * arches and garden terrace are modeled. Capitals/pediments are abstract;
 * fine sculpture, exact masonry joints, interior rooms and dormers are omitted.
 * Intricate-model allowance: 6,500 triangles maximum; five materials, no textures.
 * Window glow is a presentation convention, not a verified lighting survey.
 */
import {Part,type V3} from './mesh'
import {PALETTE,finish} from './palette'
import {block,cap,walls,rect,lathe,panel,onWall,save,type XY} from './chi-aon-center'
const stone=new Part(),trim=new Part(),roof=new Part(),glass=new Part(),doors=new Part()
function box(p:Part,x0:number,y0:number,x1:number,y1:number,z0:number,z1:number,b=.08){block(p,p,rect(x0,y0,x1,y1),z0,z1,b)}
function mass(x0:number,y0:number,x1:number,y1:number,h:number){
 block(stone,roof,rect(x0,y0,x1,y1),0,h,.12)
 for(const [z,w] of [[5.65,.14],[h-.65,.24],[h-.35,.38],[h-.12,.48]])box(trim,x0-w,y0-w,x1+w,y1+w,z,z+.18)
}
function hip(x0:number,y0:number,x1:number,y1:number,eave:number,ridge:number){
 const r=rect(x0,y0,x1,y1),d=Math.min((x1-x0)/2,(y1-y0)/2)*.82,top=rect(x0+d,y0+d,x1-d,y1-d)
 walls(roof,r,eave,ridge,top);cap(roof,top,ridge)
}
const footprint:XY[]=[[-21.89,3.36],[-22.2,18.03],[-10.89,17.92],[-11.04,6.43],[-5.26,6.58],[5.06,6.83],[6.94,6.87],[6.89,8.45],[11.02,8.55],[10.74,18.72],[21.37,18.98],[22.25,-12.49],[17.79,-12.68],[17.89,-14.78],[7.17,-15.04],[7.12,-14.3],[-10.57,-14.72],[-10.56,-15.44],[-20.45,-15.88],[-21.02,-14.75]]
footprint.reverse();block(stone,roof,footprint,0,6.65,.08)
mass(-20.8,-10.5,21,6.5,17.7);mass(-21.45,-15.1,-11.3,17.6,18.0);mass(11.2,-13.1,21.3,18.3,18.0);mass(7.3,-14.4,17.6,-9.6,17.7)
hip(-20.8,-10.5,21,6.5,17.7,20.05);hip(-21.45,-15.1,-11.3,17.6,18.0,20.05);hip(11.2,-13.1,21.3,18.3,18.0,20.05);hip(7.3,-14.4,17.6,-9.6,17.7,19.4)
function win(a:XY,b:XY,s:number,w:number,z0:number,z1:number,arch=false){
 const {P}=onWall(a,b)
 if(!arch)panel(glass,a,b,s-w/2,s+w/2,z0,z1)
 else{const spring=z1-w/2;panel(glass,a,b,s-w/2,s+w/2,z0,spring)
 for(let i=0;i<10;i++){const t=i*Math.PI/10,u=(i+1)*Math.PI/10;glass.tri(P(s,spring,.04),P(s+w/2*Math.cos(t),spring+w/2*Math.sin(t),.04),P(s+w/2*Math.cos(u),spring+w/2*Math.sin(u),.04))}}
 if(!arch){
 panel(trim,a,b,s-w/2-.18,s+w/2+.18,z1+.08,z1+.32,.06)
 panel(trim,a,b,s-w/2-.14,s-w/2,z0,z1,.06)
 panel(trim,a,b,s+w/2,s+w/2+.14,z0,z1,.06)
 panel(trim,a,b,s-w/2-.18,s+w/2+.18,z0-.16,z0,.06)
}
}
function elevation(a:XY,b:XY,n:number){const L=onWall(a,b).L;for(let i=0;i<n;i++){const s=(i+.5)*L/n;win(a,b,s,2.05,7,11.5);win(a,b,s,1.6,14.1,16.1)}}
elevation([-11.3,17.6],[-21.45,17.6],2);elevation([21.3,18.3],[11.2,18.3],2)
elevation([-21.45,17.6],[-21.45,-15.1],7);elevation([21.3,-13.1],[21.3,18.3],7)
elevation([-11.3,6.5],[-11.3,17.6],2);elevation([11.2,18.3],[11.2,8.55],2)
// Two small windows on each side of the central arched pair and blind oculus.
const fa:XY=[11.2,6.5],fb:XY=[-11.3,6.5]
for(const x of [-9,-5.8,5.8,9]){win(fa,fb,11.2-x,1.75,7,11.5);win(fa,fb,11.2-x,1.6,14,15.9)}
for(const x of [-2.3,0,2.3])win(fa,fb,11.2-x,1.7,6.9,11.45)
for(const x of [-2.3,2.3])win(fa,fb,11.2-x,1.45,14,16.1,true)
const wall=onWall(fa,fb)
for(let i=0;i<16;i++){const a=i*Math.PI/8,b=(i+1)*Math.PI/8;const P=(r:number,t:number)=>wall.P(11.2+r*Math.cos(t),15.15+r*Math.sin(t),.075);trim.quad(P(.77,a),P(.77,b),P(.55,b),P(.55,a))}
// Door sits on the actual, slightly oblique mapped ground-floor facade.
const da:XY=[5.06,6.83],db:XY=[-5.26,6.58],ds=onWall(da,db).L/2
panel(doors,da,db,ds-1.1,ds+1.1,.4,4.9,.06);win(da,db,ds,2.2,3.7,5.2,true)
function column(x:number,y:number,z0:number,z1:number,r=.42){
 box(trim,x-r*1.5,y-r*1.5,x+r*1.5,y+r*1.5,z0,z0+.65)
 lathe(trim,x,y,[[r*1.15,z0+.65],[r,z0+.83],[r*.87,z1-.70],[r*1.18,z1-.62],[r*1.45,z1-.32],[r*1.4,z1-.16]],8)
 box(trim,x-r*1.5,y-r*1.5,x+r*1.5,y+r*1.5,z1-.18,z1)
}
const curve:XY[]=[];for(let i=0;i<=16;i++){const a=i*Math.PI/16;curve.push([5.15*Math.cos(a),6.6+5.7*Math.sin(a)])}
block(stone,trim,curve,0,3.35,.10)
for(const angle of [27,69,111,153]){const a=angle*Math.PI/180;column(4.7*Math.cos(a),6.6+5.1*Math.sin(a),3.35,10.85,.49)}
block(trim,roof,curve,10.85,11.2,.07)
block(stone,roof,curve,11.2,11.8,.08)
block(trim,roof,curve.map(([x,y])=>[x*1.035,6.6+(y-6.6)*1.035] as XY),11.8,12.2,.10)
// Broad rail and abstract vase-shaped balusters follow the curved balcony.
for(let i=0;i<16;i++){
 const a=curve[i],b=curve[i+1],v=onWall(a,b)
 panel(trim,a,b,0,v.L,12.95,13.16,0)
 const p=v.P(v.L/2,12.2)
 lathe(trim,p[0],p[1],[[.10,12.2],[.16,12.35],[.10,12.63],[.10,12.95]],5)
}
function pediment(cx:number,y:number,width:number,z:number,rise:number){
 const a:V3=[cx-width/2,y,z],b:V3=[cx+width/2,y,z],c:V3=[cx,y,z+rise];trim.tri(b,a,c);trim.tri([a[0],y-.45,z],[b[0],y-.45,z],[cx,y-.45,z+rise]);trim.quad(a,b,[b[0],y-.45,z],[a[0],y-.45,z]);trim.quad(c,a,[a[0],y-.45,z],[cx,y-.45,z+rise]);trim.quad(b,c,[cx,y-.45,z+rise],[b[0],y-.45,z])
}
pediment(0,6.86,10.2,17.75,1.65)
for(let edge=0;edge<footprint.length;edge++){
 const a=footprint[edge],b=footprint[(edge+1)%footprint.length],L=onWall(a,b).L
 if(L<5)continue
 const rear=(a[1]+b[1])/2 < -12
 const n=Math.max(1,Math.round(L/(rear?4.3:5.8)))
 for(let i=0;i<n;i++)win(a,b,(i+.5)*L/n,rear?2.2:1.7,rear?.6:1.5,rear?5.5:4.8,rear)
}
elevation([-11.3,-10.5],[11.2,-10.5],5)
for(const x of [-5,-2,2,5])column(x,-10.65,6.8,15.95,.28)
for(const [a,b] of [[[-20.8,-15.15],[-11.3,-15.15]],[[7.3,-14.45],[17.6,-14.45]]] as [XY,XY][]){const L=onWall(a,b).L;win(a,b,L/2,2.4,7,12,true);for(const dx of [-2.4,2.4])win(a,b,L/2+dx,1.2,7,10.8)}
// Terrace balustrades follow the mapped garden edge, above the arched doors.
for(let edge=0;edge<footprint.length;edge++){
 const a=footprint[edge],b=footprint[(edge+1)%footprint.length],v=onWall(a,b)
 if((a[1]+b[1])/2>-12||v.L<2)continue
 panel(trim,a,b,0,v.L,6.72,6.92,.08);panel(trim,a,b,0,v.L,7.55,7.75,.08)
 const n=Math.max(1,Math.floor(v.L/1.35))
 for(let i=0;i<n;i++){const p=v.P(v.L*(i+.5)/n,6.9,.08);lathe(trim,p[0],p[1],[[.10,6.9],[.15,7.08],[.085,7.35],[.10,7.55]],5)}
}
box(stone,-6.7,17.5,6.7,18.1,0,3.1);box(trim,-6.85,17.4,6.85,18.2,3.1,3.35)
function segmentPediment(cx:number,y:number,w:number,z:number,h:number){
 const radius=w*w/(8*h)+h/2,cy=z+h-radius,theta=Math.asin(w/2/radius)
 const pts:V3[]=Array.from({length:13},(_,i)=>{const a=-theta+2*theta*i/12;return [cx+radius*Math.sin(a),y,cy+radius*Math.cos(a)]})
 const center:V3=[cx,y,z]
 for(let i=0;i<12;i++){const a=pts[i],b=pts[i+1],A:V3=[a[0],y-.45,a[2]],B:V3=[b[0],y-.45,b[2]];trim.tri(center,b,a);trim.tri([cx,y-.45,z],A,B);trim.quad(a,b,B,A)}
}
function gateway(cx:number){const r=1.65,z=3.9,outer=2.25,y=18.05,depth=.65
 for(const side of [-1,1]){box(stone,cx+side*2-.4,y-depth,cx+side*2+.4,y,0,z);column(cx+side*2.35,y+.05,0,6.05,.26)}
 for(let i=0;i<12;i++){const a=i*Math.PI/12,b=(i+1)*Math.PI/12;const P=(rr:number,t:number,yy:number):V3=>[cx+rr*Math.cos(t),yy,z+rr*Math.sin(t)];stone.quad(P(r,b,y),P(r,a,y),P(outer,a,y),P(outer,b,y));stone.quad(P(r,a,y-depth),P(r,b,y-depth),P(outer,b,y-depth),P(outer,a,y-depth));stone.quad(P(r,a,y),P(r,b,y),P(r,b,y-depth),P(r,a,y-depth));stone.quad(P(outer,b,y),P(outer,a,y),P(outer,a,y-depth),P(outer,b,y-depth))}
 box(trim,cx-2.7,y-.7,cx+2.7,y+.2,6.05,6.5);segmentPediment(cx,y+.2,5.3,6.5,.95)
}
gateway(-8.8);gateway(8.8)
for(const [x,y] of [[-17,11],[16,11],[-3.7,1.5],[3.7,1.5]]){box(stone,x-.55,y-.6,x+.55,y+.6,18.3,21.65);box(trim,x-.65,y-.7,x+.65,y+.7,21.5,21.85)}
await save('dc-anderson-house','Anderson House',[-77.04771675,38.91071298],25.4,[{part:stone,material:finish('limestone',0xdacdb8)},{part:trim,material:PALETTE.trim},{part:roof,material:finish('slate-roof',0x777d80)},{part:glass,material:PALETTE.window},{part:doors,material:finish('oak-doors',0x705b49)}],6500)
