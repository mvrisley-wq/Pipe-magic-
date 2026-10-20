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

    const cut=Math.round(base-a.ded-b.ded-extras.total);
    if(cut<0) return {cut:"",base,note:"TOO SHORT FOR FITTINGS / ADD-ONS"};
    return {cut,base,extras:extras.total,end1:a.ded,end2:b.ded,note:""};
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

  return {THREAD,ELBOW,BEND,SOCKET,EQTEE,SIZES,FITTINGS,ACCESS,ITEM_TYPES,UNION_OVERALL,CLOSE_OVERALL,BARREL_LENGTHS,TEES,measure,endResult,itemAllowance,fittedItems,calculate,drainageFall};
});
