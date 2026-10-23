(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined" && module.exports) module.exports=api;
  root.PipeMagic=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  const THREAD={"1/2":13,"3/4":15,"1":17,"1 1/4":19,"1 1/2":19,"2":24,"2 1/2":27,"3":30,"4":36};
  const ELBOW={"1/2":28,"3/4":33,"1":38,"1 1/4":45,"1 1/2":50,"2":58,"2 1/2":69,"3":78,"4":96};
  const BEND={"1/2":45,"3/4":50,"1":63,"1 1/4":76,"1 1/2":85,"2":102,"2 1/2":114,"3":127,"4":165};
  const SOCKET={"1/2":34,"3/4":39,"1":42,"1 1/4":49,"1 1/2":54,"2":64,"2 1/2":73,"3":81,"4":94};
  const EQTEE={"1/2":28,"3/4":33,"1":38,"1 1/4":45,"1 1/2":50,"2":58,"2 1/2":69,"3":78,"4":96};
  const SIZES=Object.keys(THREAD);
  const FITTINGS=["","End of pipe","Face of fitting","Elbow","Bend","Equal tee","Tee","Coupling","Reducer"];
  const ACCESS=["","Front","Back","Middle"];
  const ITEM_TYPES=["","Union","Close taper nipple","Barrel nipple"];
  const COMPONENT_TYPES=["","IV","DRV","DRV + CS","Strainer","NRV","Custom component"];
  const COMPONENT_BRANDS=["Crane","Hattersley","TGL","Smith","Pegler","Brymec","Custom"];
  const COMPONENT_CATALOGUE={
    "Crane":{
      "IV":{model:"D171",values:{"1/2":55,"3/4":64,"1":77,"1 1/4":91,"1 1/2":103,"2":122,"2 1/2":153}},
      "DRV":{model:"D921",values:{"1/2":87,"3/4":96,"1":100,"1 1/4":114,"1 1/2":125,"2":146}},
      "Strainer":{model:"D297",values:{"1/2":71,"3/4":86,"1":101,"1 1/4":134,"1 1/2":148,"2":176}},
      "NRV":{model:"D140",values:{"1/2":58,"3/4":66,"1":80,"1 1/4":89,"1 1/2":95,"2":108,"2 1/2":153,"3":188}}
    }
  };
  const DRAIN_BRANDS=["Terrain"];
  const DRAIN_SYSTEMS=["200 Solvent Waste","100 Solvent Soil"];
  const DRAIN_SIZE_BY_SYSTEM={
    "200 Solvent Waste":["1 1/4 in / 32 mm","1 1/2 in / 40 mm","2 in / 50 mm"],
    "100 Solvent Soil":["3 in / 82 mm","4 in / 110 mm","6 in / 160 mm"]
  };
  const DRAIN_SIZES=[...DRAIN_SIZE_BY_SYSTEM["200 Solvent Waste"],...DRAIN_SIZE_BY_SYSTEM["100 Solvent Soil"]];
  const DRAIN_FITTINGS=["","End of pipe","Swept bend","Branch","Double branch","Manual / other"];
  // Terrain solvent-weld catalogue Z dimensions (mm). The app keeps the catalogue
  // detail hidden and exposes only the fitting/leg needed to get the pipe cut.
  const DRAIN_CATALOGUE={
    "200 Solvent Waste":{
      "SWEEP91":{label:"Swept bend 91¼°",values:{"32":[34,34],"40":[38,38],"50":[45,45]}},
      "SWEEP135":{label:"Swept bend 135°",values:{"32":[10,10],"40":[11,11],"50":[14,14]}},
      "SWEEP165":{label:"Swept bend 165°",values:{"32":[5,5],"40":[5,5],"50":[6,6]}},
      "BRANCH91":{label:"Swept branch 91¼°",legLabels:["Main A","Main B","Side branch"],values:{"32":[30,30,19],"40":[32,35,22],"50":[43,43,29]}},
      "BRANCH135":{label:"Swept branch 135°",legLabels:["Main A","Main B","Side branch"],values:{"32":[8,48,48],"40":[10,57,57],"50":[13,71,71]}}
    },
    "100 Solvent Soil":{
      "SWEEP92":{label:"Swept bend 92½°",values:{"82":[102,98],"110":[75,83],"160":[178,184]}},
      "SWEEP135":{label:"Swept bend 135°",values:{"82":[25,25],"110":[21,30],"160":[44,44]}},
      "BRANCH92":{label:"Equal branch 92½°",legLabels:["Main A","Main B","Side branch"],values:{"82":[70,83,35],"110":[82,82,54],"160":[184,178,160]}},
      "BRANCH104":{label:"Equal branch 104°",legLabels:["Main A","Main B","Side branch"],values:{"110":[77,74,72]}},
      "BRANCH135":{label:"Equal branch 135°",legLabels:["Main A","Main B","Side branch"],values:{"82":[19,108,102],"110":[25,137,137]}},
      "DOUBLE92":{label:"Double branch 92½°",legLabels:["Main A","Main B","Branch A","Branch B"],values:{"110":[138,95,50,50]}}
    }
  };
  // Overall dimensions used to calculate the extra fitted length of an inserted component.
  // Union overall A: Crane female union. Close/barrel nipple lengths: BS EN 10241.
  const UNION_OVERALL={"1/2":49,"3/4":53,"1":58,"1 1/4":64,"1 1/2":68,"2":75,"2 1/2":84,"3":92,"4":107};
  const CLOSE_OVERALL={"1/2":37,"3/4":39,"1":46,"1 1/4":51,"1 1/2":51,"2":60,"2 1/2":69,"3":75,"4":87};
  const BARREL_LENGTHS={
    "1/2":[40,50,60,80,100,120,150,180,200,250,300,350,400,450,500],
    "3/4":[40,50,60,80,100,120,150,180,200,250,300,350,400,450,500],
    "1":[50,60,80,100,120,150,180,200,250,300,350,400,450,500],
    "1 1/4":[50,60,80,100,120,150,180,200,250,300,350,400,450,500],
    "1 1/2":[50,60,80,100,120,150,180,200,250,300,350,400,450,500],
    "2":[60,80,100,120,150,180,200,250,300,350,400,450,500],
    "2 1/2":[80,100,120,150,180,200,250,300,350,400,450,500],
    "3":[80,100,120,150,180,200,250,300,350,400,450,500],
    "4":[100,120,150,180,200,250,300,350,400,450,500]
  };
  const TEES={};

  function addTee(f,b,m,fc,bc,mc){
    if(!(f in THREAD)||!(b in THREAD)||!(m in THREAD)) return;
    TEES[f+"|"+b+"|"+m]={F:fc-THREAD[f],B:bc-THREAD[b],M:mc-THREAD[m]};
    if(f!==b) TEES[b+"|"+f+"|"+m]={F:bc-THREAD[b],B:fc-THREAD[f],M:mc-THREAD[m]};
  }
  Object.entries(EQTEE).forEach(([s,c])=>addTee(s,s,s,c,c,c));

  [
    ["3/4","1/2",30,31],["1","1/2",32,34],["1","3/4",35,36],
    ["1 1/4","1/2",34,38],["1 1/4","3/4",36,41],["1 1/4","1",40,42],
    ["1 1/2","1/2",36,42],["1 1/2","3/4",38,44],["1 1/2","1",42,46],["1 1/2","1 1/4",46,48],
    ["2","1/2",38,48],["2","3/4",40,50],["2","1",44,52],["2","1 1/4",48,54],["2","1 1/2",52,55],
    ["2 1/2","1/2",41,57],["2 1/2","3/4",44,59],["2 1/2","1",47,60],["2 1/2","1 1/4",52,62],["2 1/2","1 1/2",55,63],["2 1/2","2",61,66],
    ["3","1 1/4",55,70],["3","1 1/2",58,71],["3","2",64,73],["3","2 1/2",72,76],
    ["4","1",56,81],["4","1 1/4",61,83],["4","1 1/2",64,84],["4","2",70,86],["4","2 1/2",77,89],["4","3",84,92]
  ].forEach(([run,branch,rc,bc])=>addTee(run,run,branch,rc,rc,bc));

  [
    ["3/4","1/2","3/4",33,31,33],["1","1/2","1",38,34,38],["1","3/4","1",38,36,38],
    ["1 1/4","1/2","1 1/4",45,38,45],["1 1/4","3/4","1 1/4",45,41,45],["1 1/4","1","1 1/4",45,42,45],
    ["1 1/2","1/2","1 1/2",50,44,50],["1 1/2","3/4","1 1/2",50,44,50],["1 1/2","1","1 1/2",50,46,50],
    ["2","1/2","2",58,52,58],["2","3/4","2",58,52,58],["2","1","2",58,52,58],["2 1/2","1 1/2","2 1/2",69,64,69],["3","2","3",78,73,78],
    ["3/4","1/2","1/2",30,28,31],["1","3/4","1/2",32,30,34],["1","3/4","3/4",35,33,36],
    ["1 1/4","1","1/2",36,35,41],["1 1/4","1","3/4",36,35,41],["1 1/4","1","1",40,38,42],
    ["1 1/2","1","1",42,38,46],["1 1/2","1 1/4","1/2",37,33,43],["1 1/2","1 1/4","1",42,40,46],["1 1/2","1 1/4","1 1/4",46,45,48],
    ["2","1 1/2","1/2",44,41,51],["2","1 1/2","3/4",44,41,51],["2","1 1/2","1",44,41,51],["2","1 1/2","1 1/4",48,46,54],["2","1 1/2","1 1/2",52,50,55]
  ].forEach(v=>addTee(...v));

  function measure(mode,a,b){
    const x=Number(a);
    if(mode==="CX"){
      const y=Number(b);
      if(!Number.isFinite(x)||!Number.isFinite(y)||x<0||y<0) return null;
      return Math.abs(x-y);
    }
    if(!Number.isFinite(x)||x<=0) return null;
    return x;
  }

  function endResult(size,e){
    if(!e || !e.fit) return {state:"details",note:"SELECT END FITTING"};
    if(e.fit==="End of pipe") return {state:"ok",ded:0};
    if(!size || !(size in THREAD)) return {state:"details",note:"SELECT PIPE SIZE"};
    if(e.fit==="Face of fitting") return {state:"ok",ded:-THREAD[size]};
    if(e.fit==="Reducer") return {state:"assembly",note:"REDUCER — ENTER ITS FITTED LENGTH AS AN ADD-ON"};
    if(e.fit==="Elbow") return {state:"ok",ded:ELBOW[size]-THREAD[size]};
    if(e.fit==="Bend") return {state:"ok",ded:BEND[size]-THREAD[size]};
    if(e.fit==="Equal tee") return {state:"ok",ded:EQTEE[size]-THREAD[size]};
    if(e.fit==="Coupling") return {state:"ok",ded:SOCKET[size]/2-THREAD[size]};
    if(e.fit==="Tee"){
      if(!e.access||!e.F||!e.B||!e.M) return {state:"details",note:"COMPLETE TEE DETAILS"};
      const t=TEES[e.F+"|"+e.B+"|"+e.M];
      if(!t) return {state:"invalid",note:"TEE COMBINATION NOT LISTED"};
      const selected=e.access==="Front"?e.F:e.access==="Back"?e.B:e.M;
      if(selected!==size) return {state:"invalid",note:"SELECTED TEE LEG MUST MATCH PIPE SIZE"};
      return {state:"ok",ded:e.access==="Front"?t.F:e.access==="Back"?t.B:t.M};
    }
    return {state:"details",note:"SELECT END FITTING"};
  }

  function itemAllowance(size,item){
    if(!item || !item.type) return {state:"ok",ded:0};
    if(!size || !(size in THREAD)) return {state:"details",ded:0,note:"SELECT PIPE SIZE"};
    const t=THREAD[size];
    if(item.type==="Union") return {state:"ok",ded:UNION_OVERALL[size]-t,overall:UNION_OVERALL[size]};
    if(item.type==="Close taper nipple") return {state:"ok",ded:CLOSE_OVERALL[size]-t,overall:CLOSE_OVERALL[size]};
    if(item.type==="Barrel nipple"){
      if(item.length===null||item.length===undefined||String(item.length).trim()==="") return {state:"details",ded:0,note:"SELECT BARREL NIPPLE LENGTH"};
      const n=Number(item.length);
      if(!(BARREL_LENGTHS[size]||[]).includes(n)) return {state:"details",ded:0,note:"SELECT BARREL NIPPLE LENGTH"};
      return {state:"ok",ded:n-t,overall:n};
    }
    return {state:"details",ded:0,note:"SELECT ADD-ON"};
  }

  function componentCatalogue(brand,type,size){
    const item=COMPONENT_CATALOGUE[brand]&&COMPONENT_CATALOGUE[brand][type];
    if(!item||!item.values||item.values[size]===undefined) return null;
    return {brand,type,size,model:item.model,overall:item.values[size]};
  }

  function componentAllowance(size,component){
    if(!component || !component.type) return {state:"ok",ded:0};
    if(!size || !(size in THREAD)) return {state:"details",ded:0,note:"SELECT PIPE SIZE"};
    const brand=String(component.brand||"").trim();
    if(!brand) return {state:"details",ded:0,note:"SELECT COMPONENT BRAND"};
    const manual=Number(component.overall);
    const hasManual=Number.isFinite(manual)&&manual>0;
    const cat=componentCatalogue(brand,component.type,size);
    const overall=hasManual?manual:(cat?cat.overall:NaN);
    if(!Number.isFinite(overall)||overall<=0) return {state:"details",ded:0,note:"ENTER COMPONENT OVERALL LENGTH"};
    const engagement=THREAD[size];
    const ded=overall-(2*engagement);
    if(ded<0) return {state:"details",ded:0,note:"CHECK COMPONENT LENGTH"};
    return {state:"ok",ded,overall,engagement,type:component.type,brand,auto:!hasManual&&!!cat,model:cat?cat.model:""};
  }

  function fittedComponents(size,components){
    let total=0;
    const details=[];
    for(const component of (components||[])){
      if(!component || !component.type) continue;
      const r=componentAllowance(size,component);
      if(r.state!=="ok") return {state:"details",total:0,note:r.note,details};
      total+=r.ded;
      details.push(r);
    }
    return {state:"ok",total,details};
  }

  function fittedItems(size,items){
    let total=0;
    const details=[];
    for(const item of (items||[])){
      if(!item || !item.type) continue;
      const r=itemAllowance(size,item);
      if(r.state!=="ok") return {state:"details",total:0,note:r.note,details};
      total+=r.ded;
      details.push({type:item.type,ded:r.ded,overall:r.overall});
    }
    return {state:"ok",total,details};
  }

  function calculate(input){
    input=input||{};
    const base=measure(input.mode||"DIRECT",input.m1,input.m2);
    if(base===null) return {cut:"",base:"",note:"ENTER MEASUREMENT"};
    if(!input.size || !(input.size in THREAD)) return {cut:"",base,note:"SELECT PIPE SIZE"};

    const a=endResult(input.size,input.e1), b=endResult(input.size,input.e2);
    if(a.state==="invalid") return {cut:"",base,note:a.note};
    if(b.state==="invalid") return {cut:"",base,note:b.note};
    if(a.state==="assembly") return {cut:"",base,note:a.note};
    if(b.state==="assembly") return {cut:"",base,note:b.note};
    if(a.state!=="ok") return {cut:"",base,note:a.note||"COMPLETE END 1"};
    if(b.state!=="ok") return {cut:"",base,note:b.note||"COMPLETE END 2"};

    const extras=fittedItems(input.size,input.items);
    if(extras.state!=="ok") return {cut:"",base,note:extras.note};
    const components=fittedComponents(input.size,input.components);
    if(components.state!=="ok") return {cut:"",base,note:components.note};

    const cut=Math.round(base-a.ded-b.ded-extras.total-components.total);
    if(cut<0) return {cut:"",base,note:"TOO SHORT FOR FITTINGS / ADD-ONS"};
    return {cut,base,extras:extras.total,components:components.total,end1:a.ded,end2:b.ded,note:""};
  }

  function drainNominal(sizeLabel){
    const m=String(sizeLabel||"").match(/\/(?:\s*)?(\d+)\s*mm/i);
    if(m) return m[1];
    const n=String(sizeLabel||"").match(/(\d+)\s*mm/i);
    return n?n[1]:"";
  }

  function drainFittings(system,sizeLabel){
    const size=drainNominal(sizeLabel);
    const table=DRAIN_CATALOGUE[system]||{};
    const out=[{id:"END",label:"End of pipe"}];
    Object.entries(table).forEach(([id,d])=>{if(d.values&&d.values[size]) out.push({id,label:d.label})});
    out.push({id:"MANUAL",label:"Manual / other fitting"});
    return out;
  }

  function drainLegs(system,sizeLabel,fitId){
    if(fitId==="END"||fitId==="MANUAL"||!fitId) return [];
    const size=drainNominal(sizeLabel);
    const d=(DRAIN_CATALOGUE[system]||{})[fitId];
    if(!d||!d.values||!d.values[size]) return [];
    const vals=d.values[size];
    if(vals.length===1 || vals.every(v=>v===vals[0])) return [{id:"0",label:"Either end",takeoff:vals[0]}];
    const labels=d.legLabels||vals.map((v,i)=>"Side "+String.fromCharCode(65+i));
    return vals.map((takeoff,i)=>({id:String(i),label:labels[i]||("Side "+(i+1)),takeoff}));
  }

  function drainTakeoff(system,sizeLabel,fitId,legId,manualValue){
    if(!fitId) return {state:"details",note:"SELECT FITTING"};
    if(fitId==="END") return {state:"ok",takeoff:0,label:"End of pipe"};
    if(fitId==="MANUAL"){
      const n=Number(manualValue);
      if(!Number.isFinite(n)||n<0) return {state:"details",note:"ENTER FITTING TAKE-OFF"};
      return {state:"ok",takeoff:n,label:"Manual / other fitting"};
    }
    const legs=drainLegs(system,sizeLabel,fitId);
    if(!legs.length) return {state:"details",note:"FITTING NOT AVAILABLE FOR THIS SIZE"};
    if(legs.length===1) return {state:"ok",takeoff:legs[0].takeoff,label:legs[0].label};
    const leg=legs.find(x=>x.id===String(legId));
    if(!leg) return {state:"details",note:"SELECT WHICH FITTING LEG"};
    return {state:"ok",takeoff:leg.takeoff,label:leg.label};
  }

  function drainageAutoCut(input){
    input=input||{};
    const a=drainTakeoff(input.system,input.size,input.fit1,input.leg1,input.manual1);
    if(a.state!=="ok") return {state:"details",note:"UPSTREAM: "+a.note};
    const b=drainTakeoff(input.system,input.size,input.fit2,input.leg2,input.manual2);
    if(b.state!=="ok") return {state:"details",note:"DOWNSTREAM: "+b.note};
    const r=drainageCut({
      measureMode:input.measureMode,m1:input.m1,m2:input.m2,
      fallMode:input.fallMode,customMmPerM:input.customMmPerM,
      takeoff1:a.takeoff,takeoff2:b.takeoff
    });
    if(r.state!=="ok") return r;
    return {...r,upstreamTakeoff:a.takeoff,downstreamTakeoff:b.takeoff};
  }

  function drainageFall(input){
    input=input||{};
    const run=Number(input.run);
    if(!Number.isFinite(run)||run<=0) return {state:"details",note:"ENTER HORIZONTAL RUN"};
    const mode=String(input.mode||"OFF");
    let mmPerM=0;
    let ratio=null;
    if(mode==="OFF"){
      return {state:"ok",run,mmPerM:0,ratio:null,drop:0,trueLength:run,note:"FALL OFF — STACK / LEVEL REFERENCE"};
    }
    if(mode==="CUSTOM"){
      mmPerM=Number(input.customMmPerM);
      if(!Number.isFinite(mmPerM)||mmPerM<=0) return {state:"details",note:"ENTER mm PER METRE"};
      ratio=1000/mmPerM;
    }else{
      const n=Number(mode);
      if(![40,60,80,100].includes(n)) return {state:"details",note:"SELECT FALL"};
      ratio=n;
      mmPerM=1000/n;
    }
    const drop=(run/1000)*mmPerM;
    const trueLength=Math.sqrt(run*run+drop*drop);
    return {state:"ok",run,mmPerM,ratio,drop,trueLength,note:""};
  }

  function drainageCut(input){
    input=input||{};
    const horizontal=measure(input.measureMode||"DIRECT",input.m1,input.m2);
    if(horizontal===null) return {state:"details",note:"ENTER CENTRE MEASUREMENT"};
    const f=drainageFall({run:horizontal,mode:input.fallMode||"OFF",customMmPerM:input.customMmPerM});
    if(f.state!=="ok") return {state:"details",note:f.note};
    const t1=Number(input.takeoff1||0),t2=Number(input.takeoff2||0);
    if(!Number.isFinite(t1)||t1<0||!Number.isFinite(t2)||t2<0) return {state:"details",note:"CHECK FITTING TAKE-OFF"};
    const cut=f.trueLength-t1-t2;
    if(cut<0) return {state:"invalid",note:"TOO SHORT FOR FITTING TAKE-OFFS"};
    return {state:"ok",horizontal,trueCentre:f.trueLength,drop:f.drop,mmPerM:f.mmPerM,ratio:f.ratio,cut,takeoff1:t1,takeoff2:t2,note:""};
  }

  return {THREAD,ELBOW,BEND,SOCKET,EQTEE,SIZES,FITTINGS,ACCESS,ITEM_TYPES,COMPONENT_TYPES,COMPONENT_BRANDS,COMPONENT_CATALOGUE,DRAIN_BRANDS,DRAIN_SYSTEMS,DRAIN_SIZE_BY_SYSTEM,DRAIN_SIZES,DRAIN_FITTINGS,DRAIN_CATALOGUE,UNION_OVERALL,CLOSE_OVERALL,BARREL_LENGTHS,TEES,measure,endResult,itemAllowance,componentCatalogue,componentAllowance,fittedComponents,fittedItems,calculate,drainNominal,drainFittings,drainLegs,drainTakeoff,drainageFall,drainageCut,drainageAutoCut};
});
