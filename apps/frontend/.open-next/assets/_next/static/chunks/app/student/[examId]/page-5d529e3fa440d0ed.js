(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9157],{7415:(e,t,s)=>{Promise.resolve().then(s.bind(s,18533))},18533:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>l});var n=s(83664),d=s(58424),r=s(73590),a=s(25722),i=s(62178),c=s(86012);function l(){let e,t,s,l,h,g,y,j,I,N,w,v,E,S,_,A,$,C,B,k,q,T,G,L,O=(0,d.c)(69),P=(0,i.useParams)().examId,[U,J]=(0,c.useState)("info"),[R,M]=(0,c.useState)(1);O[0]===Symbol.for("react.memo_cache_sentinel")?(e={},O[0]=e):e=O[0];let[D,F]=(0,c.useState)(e);O[1]===Symbol.for("react.memo_cache_sentinel")?(t={},O[1]=t):t=O[1];let[H,K]=(0,c.useState)(t),[Y,Q]=(0,c.useState)(!1);O[2]!==P?(s={examId:P},O[2]=P,O[3]=s):s=O[3];let W=!P;O[4]!==s||O[5]!==W?(l={variables:s,skip:W},O[4]=s,O[5]=W,O[6]=l):l=O[6];let{data:z,loading:V}=(0,a.I)(r.xj,l),X=z?.getExamById;O[7]!==X?.testIds?(h=X?.testIds??[],O[7]=X?.testIds,O[8]=h):h=O[8];let Z=h;O[9]!==X?.openExerciseIds?(g=X?.openExerciseIds??[],O[9]=X?.openExerciseIds,O[10]=g):g=O[10];let ee=g;O[11]!==ee||O[12]!==Z?(y={testIds:Z,openExerciseIds:ee},O[11]=ee,O[12]=Z,O[13]=y):y=O[13];let et=!X;O[14]!==y||O[15]!==et?(j={variables:y,skip:et},O[14]=y,O[15]=et,O[16]=j):j=O[16];let{data:es,loading:en}=(0,a.I)(r.lp,j);e:{let e;if(!X||!es){let e;O[17]===Symbol.for("react.memo_cache_sentinel")?(e=[],O[17]=e):e=O[17],I=e;break e}if(O[18]!==X.openExerciseIds||O[19]!==X.testIds||O[20]!==es.getOpenExerciesByIds||O[21]!==es.getTestsByIds){let t=es.getTestsByIds??[],s=es.getOpenExerciesByIds??[],n=new Map(t.map(b)),d=new Map(s.map(p));for(let t of(e=[],X.testIds??[])){let s=n.get(t);if(!s)continue;let d=Array.isArray(s.answers)?s.answers.filter(f):[];0!==d.length&&e.push({kind:"mcq",sourceId:s.id,text:s.question,choices:d})}for(let t of X.openExerciseIds??[]){let s=d.get(t);if(!s)continue;let n=s.question&&s.question.trim()||s.title&&s.title.trim()||"Задгай асуулт";e.push({kind:"open",sourceId:s.id,title:s.title,text:n})}O[18]=X.openExerciseIds,O[19]=X.testIds,O[20]=es.getOpenExerciesByIds,O[21]=es.getTestsByIds,O[22]=e}else e=O[22];I=e}let ed=I,er=ed.length,ea=er>0?Math.min(Math.max(1,R),er):1;O[23]!==U?(N=()=>{if("exam"===U)return document.addEventListener("keydown",m,!0),document.addEventListener("contextmenu",u,!0),document.addEventListener("copy",x,!0),document.addEventListener("cut",x,!0),document.addEventListener("paste",x,!0),()=>{document.removeEventListener("keydown",m,!0),document.removeEventListener("contextmenu",u,!0),document.removeEventListener("copy",x,!0),document.removeEventListener("cut",x,!0),document.removeEventListener("paste",x,!0)}},w=[U],O[23]=U,O[24]=N,O[25]=w):(N=O[24],w=O[25]),(0,c.useEffect)(N,w);let ei=er>0?ed[ea-1]:void 0,ec=0;for(let e=1;e<=er;e++){let t=D[e];null!=t&&""!==String(t).trim()&&ec++}let el=ec;O[26]!==X?.title||O[27]!==X?.topic?(v=X?.title?.trim()||X?.topic?.trim()||"Шалгалт",O[26]=X?.title,O[27]=X?.topic,O[28]=v):v=O[28];let eo=v,ex=X?`${X.grade}-р анги${X.subjectId?` \xb7 ID: ${X.subjectId}`:""}`:"";O[29]!==eo?(E=(0,n.jsx)("p",{className:"text-xl font-semibold",children:eo}),O[29]=eo,O[30]=E):E=O[30];let eu=V?"Ачааллаж байна…":ex||"2025-2026 оны хичээлийн жил";return O[31]!==eu?(S=(0,n.jsx)("p",{className:"mt-1 text-sm text-[#6a7390]",children:eu}),O[31]=eu,O[32]=S):S=O[32],O[33]!==E||O[34]!==S?(_=(0,n.jsxs)("div",{children:[E,S]}),O[33]=E,O[34]=S,O[35]=_):_=O[35],O[36]===Symbol.for("react.memo_cache_sentinel")?(A=(0,n.jsxs)("div",{className:"flex items-center gap-2 rounded-full border border-[#e2e6ef] bg-[#f7f9fc] px-4 py-2 text-sm font-semibold text-[#39415c]",children:[(0,n.jsx)("span",{className:"inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f2e9e5] text-[#a35f45]",children:"⏱"}),(0,n.jsx)("span",{className:"text-xs font-medium text-[#7981a0]",children:"үлдсэн хугацаа"})]}),O[36]=A):A=O[36],O[37]!==_?($=(0,n.jsx)("section",{className:"rounded-2xl border border-[#e0e4ec] bg-white px-6 py-5 shadow-[0_10px_30px_rgba(20,30,60,0.08)]",children:(0,n.jsxs)("div",{className:"flex flex-wrap items-center justify-between gap-4",children:[_,A]})}),O[37]=_,O[38]=$):$=O[38],O[39]!==X||O[40]!==en?(C=en&&X&&(0,n.jsx)("p",{className:"text-center text-sm text-[#5c6786]",children:"Асуултуудыг ачааллаж байна…"}),O[39]=X,O[40]=en,O[41]=C):C=O[41],O[42]!==X||O[43]!==V||O[44]!==en||O[45]!==er?(B=!V&&X&&!en&&0===er&&(0,n.jsx)("section",{className:"rounded-2xl border border-[#e0e4ec] bg-white p-8 text-center text-[#5c6786]",children:"Энэ шалгалтад асуулт олдсонгүй. (testIds / openExerciseIds шалгаарай)"}),O[42]=X,O[43]=V,O[44]=en,O[45]=er,O[46]=B):B=O[46],O[47]!==ea||O[48]!==el||O[49]!==D||O[50]!==H||O[51]!==ei||O[52]!==ed||O[53]!==U||O[54]!==er?(k=ei&&"done"!==U&&(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("section",{className:"rounded-2xl border border-[#e0e4ec] bg-white p-6 shadow-[0_10px_30px_rgba(20,30,60,0.06)]",children:(0,n.jsxs)("div",{className:"flex flex-wrap items-center justify-between gap-3",children:[(0,n.jsxs)("p",{className:"text-sm font-semibold text-[#2f3a57]",children:["Явц: ",ea,"/",er," асуулт"]}),(0,n.jsxs)("p",{className:"text-xs text-[#5c6786]",children:["Progress:"," ",(0,n.jsx)("span",{className:"font-semibold text-[#2f3a57]",children:el}),"/",er," answered"]})]})}),(0,n.jsxs)("section",{className:"rounded-2xl border border-[#e0e4ec] bg-white p-6 shadow-[0_10px_30px_rgba(20,30,60,0.06)]",children:[(0,n.jsxs)("p",{className:"text-sm font-semibold text-[#6a7390]",children:["Асуулт ",ea,"open"===ei.kind?" (задгай)":""]}),(0,n.jsx)("h2",{className:"mt-2 text-lg font-semibold",children:ei.text}),"mcq"===ei.kind?(0,n.jsx)("div",{className:"mt-4 space-y-3",children:ei.choices.map((e,t)=>{let s="ABCDEFGHIJKLMNOPQRSTUVWXYZ"[t]??String(t+1),d=D[ea]===s;return(0,n.jsxs)("button",{className:`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${d?"border-[#7aa7ff] bg-[#f1f5ff] text-[#2f4c9a]":"border-[#e4e7ef] bg-white text-[#3a4564] hover:border-[#c9d4ea]"}`,type:"button",onClick:()=>F(e=>({...e,[ea]:s})),children:[(0,n.jsxs)("span",{className:"flex items-center gap-3",children:[(0,n.jsx)("span",{className:`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${d?"bg-[#2f5bd1] text-white":"bg-[#f2f4f8] text-[#4a5574]"}`,children:s}),e]}),d&&(0,n.jsx)("span",{className:"flex h-7 w-7 items-center justify-center rounded-full bg-[#2f5bd1] text-xs font-bold text-white",children:"✓"})]},`${ei.sourceId}-${s}`)})}):(0,n.jsx)("div",{className:"mt-4",children:(0,n.jsx)("textarea",{className:"min-h-[140px] w-full rounded-xl border border-[#e4e7ef] bg-white px-4 py-3 text-sm text-[#1f2a44] outline-none focus:border-[#7aa7ff]",placeholder:"Хариултаа энд бичнэ үү",value:D[ea]??"",onChange:e=>F(t=>({...t,[ea]:e.target.value}))})}),(0,n.jsxs)("div",{className:"mt-5 flex flex-wrap items-center justify-between gap-3",children:[(0,n.jsx)("button",{className:"rounded-lg border border-[#e2e6ef] bg-white px-4 py-2 text-sm font-semibold text-[#39415c] hover:bg-[#f7f9fc]",type:"button",onClick:()=>M(o),children:"← Өмнөх"}),(0,n.jsxs)("div",{className:"flex items-center gap-3",children:[(0,n.jsx)("button",{className:"rounded-lg border border-[#e2e6ef] bg-white px-4 py-2 text-sm font-semibold text-[#39415c] hover:bg-[#f7f9fc]",type:"button",onClick:()=>K(e=>({...e,[ea]:!e[ea]})),children:"Flag хийх"}),(0,n.jsx)("button",{className:"rounded-lg bg-[#1f4ed8] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1a42b6]",type:"button",onClick:()=>M(e=>Math.min(er,e+1)),children:"Дараах →"})]})]}),(0,n.jsx)("div",{className:"mt-5 flex items-center justify-end",children:(0,n.jsx)("button",{className:"rounded-lg bg-[#1f4ed8] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1a42b6]",type:"button",onClick:()=>Q(!0),children:"Дуусгах"})})]}),(0,n.jsxs)("section",{className:"rounded-2xl border border-[#e0e4ec] bg-white px-6 py-5 shadow-[0_10px_30px_rgba(20,30,60,0.06)]",children:[(0,n.jsxs)("div",{className:"flex flex-wrap items-center justify-between gap-4",children:[(0,n.jsx)("h3",{className:"text-sm font-semibold text-[#2f3a57]",children:"Асуултууд"}),(0,n.jsxs)("div",{className:"flex flex-wrap items-center gap-4 text-xs font-semibold text-[#5c6786]",children:[(0,n.jsxs)("span",{className:"flex items-center gap-2",children:[(0,n.jsx)("span",{className:"h-2 w-2 rounded-full bg-[#1f4ed8]"}),"Одоогийн"]}),(0,n.jsxs)("span",{className:"flex items-center gap-2",children:[(0,n.jsx)("span",{className:"h-2 w-2 rounded-full bg-[#22c55e]"}),"Хариулсан"]}),(0,n.jsxs)("span",{className:"flex items-center gap-2",children:[(0,n.jsx)("span",{className:"h-2 w-2 rounded-full bg-[#f59e0b]"}),"Flagged"]}),(0,n.jsxs)("span",{className:"flex items-center gap-2",children:[(0,n.jsx)("span",{className:"h-2 w-2 rounded-full bg-[#cbd5e1]"}),"Хариулаагүй"]})]})]}),(0,n.jsx)("div",{className:"mt-4 grid grid-cols-6 gap-4 sm:grid-cols-10",children:ed.map((e,t)=>{let s=t+1,d=s===ea,r=null!=D[s]&&""!==String(D[s]).trim(),a=H[s];return(0,n.jsx)("button",{type:"button",onClick:()=>M(s),className:`flex h-15 w-15 items-center justify-center rounded-lg border text-sm font-semibold ${d?"border-[#1f4ed8] bg-[#1f4ed8] text-white":a?"border-[#f59e0b] bg-[#fff7ed] text-[#b45309]":r?"border-[#22c55e] bg-[#ecfdf3] text-[#15803d]":"border-[#e2e6ef] bg-white text-[#55607d]"}`,children:s},`${e.kind}-${e.sourceId}`)})}),(0,n.jsxs)("div",{className:"mt-5 flex flex-wrap items-center justify-between gap-3",children:[(0,n.jsxs)("p",{className:"text-sm text-[#5c6786]",children:["Progress:"," ",(0,n.jsx)("span",{className:"font-semibold text-[#2f3a57]",children:el}),"/",er," answered"]}),(0,n.jsx)("button",{className:"rounded-lg bg-[#1f4ed8] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1a42b6]",type:"button",onClick:()=>Q(!0),children:"Finish exam"})]})]})]}),O[47]=ea,O[48]=el,O[49]=D,O[50]=H,O[51]=ei,O[52]=ed,O[53]=U,O[54]=er,O[55]=k):k=O[55],O[56]!==U?(q="done"===U&&(0,n.jsxs)("section",{className:"rounded-2xl border border-[#e0e4ec] bg-white px-6 py-10 text-center shadow-[0_10px_30px_rgba(20,30,60,0.08)]",children:[(0,n.jsx)("div",{className:"mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ecfdf3] text-xl font-bold text-[#16a34a]",children:"✓"}),(0,n.jsx)("h2",{className:"mt-3 text-2xl font-semibold",children:"Шалгалт амжилттай дууслаа"}),(0,n.jsx)("p",{className:"mt-2 text-sm text-[#5c6786]",children:"Таны хариултууд амжилттай илгээгдлээ."}),(0,n.jsx)("button",{className:"mt-6 rounded-lg bg-[#1f4ed8] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1a42b6]",type:"button",onClick:()=>J("info"),children:"Буцах"})]}),O[56]=U,O[57]=q):q=O[57],O[58]!==$||O[59]!==C||O[60]!==B||O[61]!==k||O[62]!==q?(T=(0,n.jsxs)("div",{className:"mx-auto w-full max-w-4xl space-y-5",children:[$,C,B,k,q]}),O[58]=$,O[59]=C,O[60]=B,O[61]=k,O[62]=q,O[63]=T):T=O[63],O[64]!==Y?(G=Y&&(0,n.jsx)("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4",children:(0,n.jsxs)("div",{className:"w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.25)]",children:[(0,n.jsxs)("div",{className:"flex items-start gap-3",children:[(0,n.jsx)("span",{className:"flex h-10 w-10 items-center justify-center rounded-full bg-[#eef2ff] text-[#1f4ed8]",children:"!"}),(0,n.jsxs)("div",{children:[(0,n.jsx)("h4",{className:"text-lg font-semibold",children:"Дуусгахад итгэлтэй?"}),(0,n.jsx)("p",{className:"mt-1 text-sm text-[#5c6786]",children:"Дуусгасны дараа хариултаа дахин засах боломжгүй."})]})]}),(0,n.jsxs)("div",{className:"mt-6 flex items-center justify-end gap-3",children:[(0,n.jsx)("button",{className:"rounded-lg border border-[#e2e6ef] bg-white px-4 py-2 text-sm font-semibold text-[#39415c] hover:bg-[#f7f9fc]",type:"button",onClick:()=>Q(!1),children:"Болих"}),(0,n.jsx)("button",{className:"rounded-lg bg-[#1f4ed8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1a42b6]",type:"button",onClick:()=>{Q(!1),J("done")},children:"Тийм, дуусгах"})]})]})}),O[64]=Y,O[65]=G):G=O[65],O[66]!==T||O[67]!==G?(L=(0,n.jsxs)("main",{className:"min-h-screen bg-[#f3f5f9] px-4 py-8 text-[#1f2a44]",children:[T,G]}),O[66]=T,O[67]=G,O[68]=L):L=O[68],L}function o(e){return Math.max(1,e-1)}function x(e){return e.preventDefault()}function u(e){return e.preventDefault()}function m(e){let t=e.key.toLowerCase();(e.ctrlKey||e.metaKey)&&["c","x","v"].includes(t)&&(e.preventDefault(),e.stopImmediatePropagation())}function f(e){return"string"==typeof e&&e.length>0}function p(e){return[e.id,e]}function b(e){return[e.id,e]}},58424:(e,t,s)=>{"use strict";e.exports=s(69838)},62178:(e,t,s)=>{"use strict";var n=s(62838);s.o(n,"useParams")&&s.d(t,{useParams:function(){return n.useParams}}),s.o(n,"usePathname")&&s.d(t,{usePathname:function(){return n.usePathname}}),s.o(n,"useRouter")&&s.d(t,{useRouter:function(){return n.useRouter}}),s.o(n,"useSearchParams")&&s.d(t,{useSearchParams:function(){return n.useSearchParams}}),s.o(n,"useSelectedLayoutSegments")&&s.d(t,{useSelectedLayoutSegments:function(){return n.useSelectedLayoutSegments}})},69838:(e,t,s)=>{"use strict";var n=s(86012).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;t.c=function(e){return n.H.useMemoCache(e)}},73590:(e,t,s)=>{"use strict";s.d(t,{GR:()=>i,SU:()=>r,Uo:()=>l,Ys:()=>a,g9:()=>c,lp:()=>x,pq:()=>d,xj:()=>o});var n=s(44406);let d=(0,n.J1)`
  query GetAllSubject {
    getAllSubject {
      id
      name
    }
  }
`,r=(0,n.J1)`
  query GetClassByTeacherAndSchoolId($input: ClassByTeacherAndSchoolIdInput!) {
    getClassByTeacherAndSchoolId(input: $input) {
      sectionTeacherId
      schoolId
      id
      grade
      section
      createdAt
      updatedAt
    }
  }
`,a=(0,n.J1)`
  query GetStudentByClassId($classId: String!) {
    getStudentByClassId(classId: $classId) {
      id
      email
      classId
      firstName
      lastName
      studentCode
      studentExamResultIds
      createdAt
      updatedAt
    }
  }
`,i=(0,n.J1)`
  query GetTestsBySybjectAndGrade($input: TestInput) {
    getTestsBySybjectAndGrade(input: $input) {
      id
      grade
      subjectId
      question
      answers
      rightAnswer
      imageUrl
      difficulty
      score
      usageCount
      notes
      teacherId
      createdAt
      updatedAt
    }
  }
`,c=(0,n.J1)`
  query GetOpenExerciesBySubjectAndGrade($input: OpenExerciesInput) {
    getOpenExerciesBySubjectAndGrade(input: $input) {
      id
      subjectId
      grade
      topic
      title
      question
      answer
      imageUrl
      difficulty
      score
      notes
      teacherId
      createdAt
      updatedAt
    }
  }
`,l=(0,n.J1)`
  query GetExamBySchoolId($schoolId: String!) {
    getExamBySchoolId(schoolId: $schoolId) {
      id
      grade
      subjectId
      topic
      title
      date
      location
      duration
      variation
      testIds
      openExerciseIds
      notes
      score
      usageCount
      isActive
      needpermission
      schoolId
      teacherId
      createdAt
      updatedAt
    }
  }
`,o=(0,n.J1)`
  query GetExamById($examId: String!) {
    getExamById(examId: $examId) {
      id
      grade
      subjectId
      topic
      title
      date
      location
      duration
      variation
      testIds
      openExerciseIds
      notes
      score
      usageCount
      isActive
      needpermission
      schoolId
      teacherId
      createdAt
      updatedAt
    }
  }
`,x=(0,n.J1)`
  query GetExamQuestionItems(
    $testIds: [String!]!
    $openExerciseIds: [String!]!
  ) {
    getTestsByIds(ids: $testIds) {
      id
      grade
      subjectId
      question
      answers
      rightAnswer
      imageUrl
      difficulty
      score
      usageCount
      notes
      teacherId
      createdAt
      updatedAt
    }
    getOpenExerciesByIds(ids: $openExerciseIds) {
      id
      subjectId
      grade
      topic
      title
      question
      answer
      imageUrl
      difficulty
      score
      notes
      teacherId
      createdAt
      updatedAt
    }
  }
`;(0,n.J1)`
  query GetTestById($testId: String!) {
    getTestById(testId: $testId) {
      id
      grade
      subjectId
      question
      answers
      rightAnswer
      imageUrl
      difficulty
      score
      usageCount
      notes
      teacherId
      createdAt
      updatedAt
    }
  }
`,(0,n.J1)`
  query GetOpenExerciesById($openExerciesId: String!) {
    getOpenExerciesById(openExerciesId: $openExerciesId) {
      id
      subjectId
      grade
      topic
      title
      question
      answer
      imageUrl
      difficulty
      score
      notes
      teacherId
      createdAt
      updatedAt
    }
  }
`}},e=>{e.O(0,[1571,4371,7014,658,7358],()=>e(e.s=7415)),_N_E=e.O()}]);