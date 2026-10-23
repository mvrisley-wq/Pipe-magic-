const assert=require("assert");
const Calc=require("../app/src/main/assets/calc.js");

function eq(actual,expected,label){
  assert.strictEqual(actual,expected,label+" — expected "+expected+", got "+actual);
  console.log("PASS:",label,"=",actual);
}

eq(Calc.calculate({mode:"DIRECT",m1:2000,size:"3/4",e1:{fit:"Elbow"},e2:{fit:"Elbow"},items:[]}).cut,1964,"direct 2000, 3/4, elbow + elbow");
eq(Calc.calculate({mode:"DIRECT",m1:2000,size:"3/4",e1:{fit:"Bend"},e2:{fit:"Bend"},items:[]}).cut,1930,"direct 2000, 3/4, bend + bend");
eq(Calc.calculate({mode:"DIRECT",m1:3000,size:"1/2",e1:{fit:"Equal tee"},e2:{fit:"Elbow"},items:[]}).cut,2970,"direct 3000, 1/2, equal tee + elbow");
eq(Calc.calculate({mode:"DIRECT",m1:2875,size:"3/4",e1:{fit:"Tee",access:"Middle",F:"1",B:"1",M:"3/4"},e2:{fit:"Equal tee"},items:[]}).cut,2836,"reducing tee middle + equal tee");
eq(Calc.calculate({mode:"CX",m1:300,m2:850,size:"3/4",e1:{fit:"Elbow"},e2:{fit:"Elbow"},items:[]}).cut,514,"Centre to X derives 550 C-C with elbows");
eq(Calc.calculate({mode:"DIRECT",m1:1000,size:"3/4",e1:{fit:"End of pipe"},e2:{fit:"Face of fitting"},items:[]}).cut,1015,"face of fitting adds 15 mm insertion");

eq(Calc.itemAllowance("3/4",{type:"Union"}).ded,38,"3/4 union automatic take-off");
eq(Calc.itemAllowance("3/4",{type:"Close taper nipple"}).ded,24,"3/4 close taper automatic take-off");
eq(Calc.itemAllowance("3/4",{type:"Barrel nipple",length:100}).ded,85,"3/4 x 100 barrel automatic take-off");

eq(Calc.calculate({mode:"DIRECT",m1:2000,size:"1",e1:{fit:"Elbow"},e2:{fit:"End of pipe"},items:[{type:"Union"},{type:"Close taper nipple"}]}).cut,1909,"auto union + close taper");
eq(Calc.calculate({mode:"DIRECT",m1:1000,size:"3/4",e1:{fit:"End of pipe"},e2:{fit:"End of pipe"},items:[{type:"Barrel nipple",length:100}]}).cut,915,"barrel nipple selected length");

const impossible=Calc.calculate({mode:"DIRECT",m1:2000,size:"1/2",e1:{fit:"Tee",access:"Middle",F:"1",B:"1",M:"3/4"},e2:{fit:"End of pipe"},items:[]});
assert.ok(impossible.note.includes("MUST MATCH")||impossible.note.includes("NOT LISTED"),"Impossible tee warning");
console.log("PASS: impossible tee warning =",impossible.note);

const missing=Calc.calculate({mode:"DIRECT",m1:1000,size:"1",e1:{fit:"End of pipe"},e2:{fit:"End of pipe"},items:[{type:"Barrel nipple",length:""}]});
assert.ok(missing.note.includes("SELECT BARREL NIPPLE LENGTH"),"Missing barrel length warning");
console.log("PASS: barrel length selection required");

assert.ok(Calc.COMPONENT_BRANDS.includes("Brymec"),"Brymec is available as a valve/component brand");
console.log("PASS: Brymec component brand available");
assert.ok(["Crane","Hattersley","TGL","Smith","Pegler","Brymec","Custom"].every(b=>Calc.COMPONENT_BRANDS.includes(b)),"all site/component brands available");
console.log("PASS: all site/component brands available");
eq(Calc.componentCatalogue("Crane","IV","1/2").overall,55,"Crane D171 1/2 catalogue length");
eq(Calc.componentCatalogue("Crane","DRV","2").overall,146,"Crane D921 2in catalogue length");
eq(Calc.componentCatalogue("Crane","Strainer","2").overall,176,"Crane D297 2in catalogue length");
eq(Calc.componentCatalogue("Crane","NRV","1").overall,80,"Crane D140 1in catalogue length");
eq(Calc.componentCatalogue("Crane","DRV + CS","2").overall,146,"Crane D931 DRV + CS catalogue length");
eq(Calc.componentCatalogue("Hattersley","IV","1/2").overall,58.9,"Hattersley Fig 100 half-inch catalogue length");
eq(Calc.componentCatalogue("Hattersley","DRV","2").overall,146,"Hattersley Fig 1432 2in catalogue length");
eq(Calc.componentCatalogue("Hattersley","DRV + CS","1").overall,100,"Hattersley Fig 1732 DRV + CS catalogue length");
eq(Calc.componentCatalogue("Hattersley","Strainer","2").overall,176,"Hattersley Fig 807 2in catalogue length");
eq(Calc.componentCatalogue("Hattersley","NRV","3").overall,190,"Hattersley Fig 47 3in catalogue length");
eq(Calc.componentAllowance("1/2",{type:"IV",brand:"Hattersley",overall:""}).ded,32.9,"Hattersley IV automatic catalogue deduction");

eq(Calc.componentAllowance("1/2",{type:"IV",brand:"Crane",overall:""}).ded,29,"Crane D171 auto catalogue deduction");
eq(Calc.calculate({mode:"DIRECT",m1:1000,size:"1/2",e1:{fit:"End of pipe"},e2:{fit:"End of pipe"},items:[],components:[{type:"Strainer",brand:"Crane",overall:""}]}).cut,955,"Crane strainer auto catalogue cut");
eq(Calc.componentAllowance("1/2",{type:"Strainer",brand:"Crane",overall:71}).ded,45,"1/2 inline component uses two 13 mm engagements");
eq(Calc.componentAllowance("1/2",{type:"IV",brand:"Brymec",overall:71}).ded,45,"Brymec component uses normal thread engagement");
eq(Calc.calculate({mode:"DIRECT",m1:1000,size:"1/2",e1:{fit:"End of pipe"},e2:{fit:"End of pipe"},items:[],components:[{type:"Strainer",brand:"Crane",overall:71}]}).cut,955,"inline component reduces total pipe cut");
const missingComponent=Calc.calculate({mode:"DIRECT",m1:1000,size:"1/2",e1:{fit:"End of pipe"},e2:{fit:"End of pipe"},items:[],components:[{type:"IV",brand:"TGL",overall:""}]});
assert.ok(missingComponent.note.includes("OVERALL LENGTH"),"component length required for an unverified catalogue make");

const f40=Calc.drainageFall({run:4000,mode:"40"});
eq(f40.mmPerM,25,"1:40 fall per metre");
eq(f40.drop,100,"1:40 over 4000 mm total drop");
assert.ok(Math.abs(f40.trueLength-4001.2498047485115)<0.001,"1:40 true run length");
console.log("PASS: 1:40 true run length =",f40.trueLength);

const f60=Calc.drainageFall({run:6000,mode:"60"});
assert.ok(Math.abs(f60.mmPerM-(1000/60))<0.0001,"1:60 fall per metre");
eq(f60.drop,100,"1:60 over 6000 mm total drop");

const custom=Calc.drainageFall({run:4000,mode:"CUSTOM",customMmPerM:20});
eq(custom.drop,80,"custom 20 mm/m over 4000 mm");
eq(custom.ratio,50,"custom 20 mm/m equals 1:50");

const off=Calc.drainageFall({run:3200,mode:"OFF"});
eq(off.drop,0,"fall off drop");
eq(off.trueLength,3200,"fall off true length");

const dc40=Calc.drainageCut({measureMode:"DIRECT",m1:4000,fallMode:"40",takeoff1:50,takeoff2:50});
assert.equal(dc40.state,"ok","drainage cut state");
assert.ok(Math.abs(dc40.trueCentre-4001.2498047485115)<0.001,"drainage true centre");
assert.ok(Math.abs(dc40.cut-3901.2498047485115)<0.001,"drainage fitting deductions");

const dcx=Calc.drainageCut({measureMode:"CX",m1:1000,m2:5000,fallMode:"100",takeoff1:0,takeoff2:75});
eq(dcx.horizontal,4000,"drainage C-X horizontal C-C");
eq(dcx.drop,40,"drainage C-X fall drop");
assert.ok(Math.abs(dcx.cut-3925.19999500025)<0.001,"drainage C-X cut");

eq(Calc.drainNominal("1 1/2 in / 40 mm"),"40","drainage nominal size");
eq(Calc.drainTakeoff("200 Solvent Waste","1 1/2 in / 40 mm","SWEEP91","",0).takeoff,38,"Terrain 40 waste swept bend 91 take-off");
eq(Calc.drainTakeoff("200 Solvent Waste","1 1/2 in / 40 mm","BRANCH91","2",0).takeoff,22,"Terrain 40 waste branch side take-off");
eq(Calc.drainTakeoff("100 Solvent Soil","4 in / 110 mm","SWEEP92","0",0).takeoff,75,"Terrain 110 soil bend side A");
eq(Calc.drainTakeoff("100 Solvent Soil","4 in / 110 mm","SWEEP92","1",0).takeoff,83,"Terrain 110 soil bend side B");
eq(Calc.drainTakeoff("100 Solvent Soil","4 in / 110 mm","DOUBLE92","2",0).takeoff,50,"Terrain 110 double branch A");
eq(Calc.drainTakeoff("100 Solvent Soil","4 in / 110 mm","DOUBLE92","3",0).takeoff,50,"Terrain 110 double branch B");

const autoDrain=Calc.drainageAutoCut({
  system:"200 Solvent Waste",size:"1 1/2 in / 40 mm",
  measureMode:"DIRECT",m1:2000,fallMode:"OFF",
  fit1:"SWEEP91",leg1:"",fit2:"BRANCH91",leg2:"2"
});
eq(autoDrain.state,"ok","Terrain automatic drainage cut state");
eq(autoDrain.cut,1940,"Terrain automatic drainage cut");

console.log("ALL PIPE MAGIC TESTS PASSED");
