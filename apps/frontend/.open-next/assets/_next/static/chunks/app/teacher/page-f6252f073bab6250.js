(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[411],{28197:(e,t,s)=>{"use strict";s.d(t,{A:()=>r});let r=(0,s(71791).A)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]])},54763:(e,t,s)=>{Promise.resolve().then(s.bind(s,76416))},58424:(e,t,s)=>{"use strict";e.exports=s(69838)},60441:(e,t,s)=>{"use strict";s.d(t,{_:()=>r,y:()=>a});let r="teacher-1",a="school-1"},62178:(e,t,s)=>{"use strict";var r=s(62838);s.o(r,"useParams")&&s.d(t,{useParams:function(){return r.useParams}}),s.o(r,"usePathname")&&s.d(t,{usePathname:function(){return r.usePathname}}),s.o(r,"useRouter")&&s.d(t,{useRouter:function(){return r.useRouter}}),s.o(r,"useSearchParams")&&s.d(t,{useSearchParams:function(){return r.useSearchParams}}),s.o(r,"useSelectedLayoutSegments")&&s.d(t,{useSelectedLayoutSegments:function(){return r.useSelectedLayoutSegments}})},67149:(e,t,s)=>{"use strict";s.d(t,{A:()=>r});let r=(0,s(71791).A)("users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]])},69838:(e,t,s)=>{"use strict";var r=s(86012).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;t.c=function(e){return r.H.useMemoCache(e)}},71791:(e,t,s)=>{"use strict";s.d(t,{A:()=>n});var r=s(86012),a=s(90027);let d=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,s)=>s?s.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var i=s(89028);let n=(e,t)=>{let s=(0,r.forwardRef)(({className:s,...n},c)=>(0,r.createElement)(i.default,{ref:c,iconNode:t,className:(0,a.z)(`lucide-${d(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...n}));return s.displayName=d(e),s}},73590:(e,t,s)=>{"use strict";s.d(t,{GR:()=>n,SU:()=>d,Uo:()=>o,Ys:()=>i,g9:()=>c,lp:()=>u,pq:()=>a,xj:()=>l});var r=s(44406);let a=(0,r.J1)`
  query GetAllSubject {
    getAllSubject {
      id
      name
    }
  }
`,d=(0,r.J1)`
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
`,i=(0,r.J1)`
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
`,n=(0,r.J1)`
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
`,c=(0,r.J1)`
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
`,o=(0,r.J1)`
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
`,l=(0,r.J1)`
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
`,u=(0,r.J1)`
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
`;(0,r.J1)`
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
`,(0,r.J1)`
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
`},76416:(e,t,s)=>{"use strict";s.d(t,{default:()=>h});var r=s(83664),a=s(58424),d=s(62178),i=s(67149),n=s(28197),c=s(25722),o=s(73590),l=s(60441);function u(e){let t,s,d,l,u,h,m,x,p=(0,a.c)(18),{item:g,onOpen:I}=e;p[0]!==g.id?(t={variables:{classId:g.id}},p[0]=g.id,p[1]=t):t=p[1];let{data:f}=(0,c.I)(o.Ys,t),y=f?.getStudentByClassId?.length??0;return p[2]!==I?(s=e=>{("Enter"===e.key||" "===e.key)&&(e.preventDefault(),I())},p[2]=I,p[3]=s):s=p[3],p[4]===Symbol.for("react.memo_cache_sentinel")?(d=(0,r.jsx)("div",{className:"flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-[#1f2a44] transition group-hover:bg-[#EDF6FF] group-hover:text-[#1f2a44]",children:(0,r.jsx)(i.A,{className:"h-7 w-7","aria-hidden":!0})}),p[4]=d):d=p[4],p[5]!==g.grade||p[6]!==g.section?(l=(0,r.jsxs)("p",{className:"text-5 font-extrabold leading-snug text-[#1f2a44]",children:[g.grade,g.section]}),p[5]=g.grade,p[6]=g.section,p[7]=l):l=p[7],p[8]!==y?(u=(0,r.jsx)("p",{className:"mt-1 text-4 leading-normal text-[#64748b]",children:(0,r.jsxs)("span",{className:"font-medium text-[#4a5875]",children:[y," сурагч"]})}),p[8]=y,p[9]=u):u=p[9],p[10]!==l||p[11]!==u?(h=(0,r.jsxs)("div",{className:"min-w-0 flex-1",children:[l,u]}),p[10]=l,p[11]=u,p[12]=h):h=p[12],p[13]===Symbol.for("react.memo_cache_sentinel")?(m=(0,r.jsx)(n.A,{className:"h-6 w-6 shrink-0 text-[#b8c4d6] transition group-hover:translate-x-0.5 group-hover:text-[#1f2a44]","aria-hidden":!0}),p[13]=m):m=p[13],p[14]!==I||p[15]!==s||p[16]!==h?(x=(0,r.jsx)("li",{children:(0,r.jsxs)("article",{role:"button",tabIndex:0,onClick:I,onKeyDown:s,className:"group flex min-h-[5.5rem] cursor-pointer items-center gap-4 rounded-2xl border border-white p-5 text-left shadow-sm transition hover:border-[#7DC8FF] hover:bg-[#EDF6FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7DC8FF] focus-visible:ring-offset-2",children:[d,h,m]})}),p[14]=I,p[15]=s,p[16]=h,p[17]=x):x=p[17],x}function h(){let e,t,s,i,n,h,m,x,p=(0,a.c)(15),g=(0,d.useRouter)();p[0]===Symbol.for("react.memo_cache_sentinel")?(e={variables:{input:{teacherId:l._,schoolId:l.y}}},p[0]=e):e=p[0];let{data:I,loading:f}=(0,c.I)(o.SU,e);p[1]!==I?.getClassByTeacherAndSchoolId?(t=I?.getClassByTeacherAndSchoolId??[],p[1]=I?.getClassByTeacherAndSchoolId,p[2]=t):t=p[2];let y=t;p[3]===Symbol.for("react.memo_cache_sentinel")?(s=(0,r.jsx)("h2",{className:"text-[22px] font-extrabold tracking-tight text-[#1f2a44]",children:"Миний ангиуд"}),i=(0,r.jsx)("p",{className:"mt-2 max-w-2xl text-4 leading-relaxed text-[#4a5875]",children:"Анги дээр дарж сурагчид, шалгалтын статистик руу орно."}),p[3]=s,p[4]=i):(s=p[3],i=p[4]),p[5]===Symbol.for("react.memo_cache_sentinel")?(n=(0,r.jsx)("span",{className:"text-[#22c55e]",children:"●"}),p[5]=n):n=p[5];let b=f?"…":y.length;return p[6]!==b?(h=(0,r.jsxs)("header",{className:"mb-6 border-b border-[#eef2f6] pb-6",children:[s,i,(0,r.jsxs)("p",{className:"mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-3 font-semibold text-[#1f2a44]",children:[n,"Нийт"," ",(0,r.jsx)("span",{className:"font-extrabold text-[#1f2a44]",children:b})," ","анги"]})]}),p[6]=b,p[7]=h):h=p[7],p[8]!==y||p[9]!==f||p[10]!==g?(m=f?(0,r.jsx)("div",{className:"rounded-2xl border border-dashed border-white px-6 py-14 text-center",children:(0,r.jsx)("p",{className:"text-4 font-semibold text-[#475569]",children:"Ачааллаж байна…"})}):y&&0!==y.length?(0,r.jsx)("ul",{className:"grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5",children:y.map(e=>(0,r.jsx)(u,{item:e,onOpen:()=>g.push(`/teacher/class/${encodeURIComponent(e.id)}`)},e.id))}):(0,r.jsx)("div",{className:"rounded-2xl border border-dashed border-white px-6 py-14 text-center",children:(0,r.jsx)("p",{className:"text-4 font-semibold text-[#475569]",children:"Одоогоор танд харагдах анги алга."})}),p[8]=y,p[9]=f,p[10]=g,p[11]=m):m=p[11],p[12]!==h||p[13]!==m?(x=(0,r.jsx)("main",{className:"mx-auto w-full max-w-6xl space-y-6 px-4 py-8",children:(0,r.jsx)("section",{children:(0,r.jsxs)("article",{className:"rounded-2xl p-6 shadow-[0_2px_12px_rgba(31,42,68,0.06)] sm:p-8",children:[h,m]})})}),p[12]=h,p[13]=m,p[14]=x):x=p[14],x}},89028:(e,t,s)=>{"use strict";s.d(t,{default:()=>n});var r=s(86012),a={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"},d=s(90027);let i=(0,r.createContext)({}),n=(0,r.forwardRef)(({color:e,size:t,strokeWidth:s,absoluteStrokeWidth:n,className:c="",children:o,iconNode:l,...u},h)=>{let{size:m=24,strokeWidth:x=2,absoluteStrokeWidth:p=!1,color:g="currentColor",className:I=""}=(0,r.useContext)(i)??{},f=n??p?24*Number(s??x)/Number(t??m):s??x;return(0,r.createElement)("svg",{ref:h,...a,width:t??m??a.width,height:t??m??a.height,stroke:e??g,strokeWidth:f,className:(0,d.z)("lucide",I,c),...!o&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...l.map(([e,t])=>(0,r.createElement)(e,t)),...Array.isArray(o)?o:[o]])})},90027:(e,t,s)=>{"use strict";s.d(t,{z:()=>r});let r=(...e)=>e.filter((e,t,s)=>!!e&&""!==e.trim()&&s.indexOf(e)===t).join(" ").trim()}},e=>{e.O(0,[1571,4371,7014,658,7358],()=>e(e.s=54763)),_N_E=e.O()}]);