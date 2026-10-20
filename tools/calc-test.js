const assert=require("assert");
const Calc=require("../app/src/main/assets/calc.js");

function eq(actual,expected,label){
  assert.strictEqual(actual,expected,label+" — expected "+expected+", got "+actual);
  console.log("PASS:",label,"=",actual);
}

eq(Calc.calculate({mode:"DIRECT",m1:2000,size:"3/4",e1:{fit:"Elbow"},e2:{fit:"Elbow"},items:[]}).cut,1930,"direct 2000, 3/4, elbow + elbow");
eq(Calc.calculate({mode:"DIRECT",m1:3000,size:"1/2",e1:{fit:"Equal tee"},e2:{fit:"Elbow"},items:[]}).cut,2953,"direct 3000, 1/2, equal tee + elbow");
eq(Calc.calculate({mode:"DIRECT",m1:2875,size:"3/4",e1:{fit:"Tee",access:"Middle",F:"1",B:"1",M:"3/4"},e2:{fit:"Equal tee"},items:[]}).cut,2836,"reducing tee middle + equal tee");
eq(Calc.calculate({mode:"CX",m1:300,m2:850,size:"3/4",e1:{fit:"Elbow"},e2:{fit:"Elbow"},items:[]}).cut,480,"Centre to X derives 550 C-C");
eq(Calc.calculate({mode:"DIRECT",m1:1000,size:"3/4",e1:{fit:"End of pipe"},e2:{fit:"Face of fitting"},items:[]}).cut,1015,"face of fitting adds 15 mm insertion");
eq(Calc.calculate({mode:"DIRECT",m1:2000,size:"1",e1:{fit:"Elbow"},e2:{fit:"End of pipe"},items:[{type:"Union",mm:60},{type:"Close taper nipple",mm:20}]}).cut,1874,"subtract union and close taper nipple fitted lengths");

const impossible=Calc.calculate({mode:"DIRECT",m1:2000,size:"1/2",e1:{fit:"Tee",access:"Middle",F:"1",B:"1",M:"3/4"},e2:{fit:"End of pipe"},items:[]});
assert.ok(impossible.note.includes("MUST MATCH")||impossible.note.includes("NOT LISTED"),"Impossible tee warning");
console.log("PASS: impossible tee warning =",impossible.note);

const missing=Calc.calculate({mode:"DIRECT",m1:1000,size:"1",e1:{fit:"End of pipe"},e2:{fit:"End of pipe"},items:[{type:"Union",mm:""}]});
assert.ok(missing.note.includes("FITTED mm"),"Missing add-on length warning");
console.log("PASS: add-on fitted length required");

console.log("ALL PIPE MAGIC TESTS PASSED");
