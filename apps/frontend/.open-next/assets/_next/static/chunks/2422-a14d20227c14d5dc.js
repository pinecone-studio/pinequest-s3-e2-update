"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2422],{462:(e,t,i)=>{function r(e){return e>=1&&e<=12?`${e}-р анги`:"9-р анги"}function s(e){let t=(e??"").toLowerCase();return"easy"===t||t.includes("хялбар")?"easy":"hard"===t||t.includes("хүнд")?"hard":"medium"}function a(e,t){return e.map(e=>{var i,a;let n,o=(e.answers??[]).filter(e=>"string"==typeof e),d=e.imageUrl?.trim()?"image_based":o.length>=2?"multiple_choice":"short_answer",c="multiple_choice"===d?(i=e.rightAnswer,n=["a","b","c","d","e","f","g","h"],o.map((e,t)=>({id:n[t]??`opt-${t}`,text:e,isCorrect:!!(i&&e.trim()===i.trim())}))):[],l=(a=e.subjectId,t?.get(a)??a),u=e.question?.trim()||"(Агуулга байхгүй)",p=e.notes?.trim()?.slice(0,120)||u.slice(0,80)||"Асуулт",m=e.notes?.trim()||p;return{id:e.id,title:p,questionType:d,source:"global",teacherId:e.teacherId??null,content:{prompt:u,guidance:"",explanation:e.notes??""},options:c,correctAnswer:"multiple_choice"===d?c.find(e=>e.isCorrect)?.text??e.rightAnswer??"":e.rightAnswer??"",rubric:"",formulaRaw:"",formulaPreview:"",imageUrl:e.imageUrl??"",fileUploadConfig:{acceptedFileTypes:[],instructions:"",maxFiles:0},grade:r(e.grade),subject:l,topic:m,difficulty:s(e.difficulty),points:e.score>0?e.score:1,status:"published",gradingType:"multiple_choice"===d?"auto":"hybrid",usageCount:e.usageCount??0,createdAt:e.createdAt,updatedAt:e.updatedAt}})}function n(e,t){return e.map(e=>{var i;let a=(i=e.subjectId,t?.get(i)??i),n=e.question?.trim()||"(Агуулга байхгүй)",o=e.title?.trim()?.slice(0,120)||e.notes?.trim()?.slice(0,120)||n.slice(0,80)||"Асуулт",d=e.topic?.trim()||e.notes?.trim()||o;return{id:e.id,title:o,questionType:"long_answer",source:"school",teacherId:e.teacherId??null,content:{prompt:n,guidance:"",explanation:e.notes??""},options:[],correctAnswer:e.answer??"",rubric:"",formulaRaw:"",formulaPreview:"",imageUrl:e.imageUrl??"",fileUploadConfig:{acceptedFileTypes:[],instructions:"",maxFiles:0},grade:r(e.grade),subject:a,topic:d,difficulty:s(e.difficulty),points:e.score>0?e.score:1,status:"published",gradingType:"hybrid",usageCount:0,createdAt:e.createdAt,updatedAt:e.updatedAt}})}i.d(t,{K:()=>a,P:()=>n})},1506:(e,t,i)=>{i.d(t,{O9:()=>n,gu:()=>s,hl:()=>a,jZ:()=>r});let r="teacher-exam-saved-exams",s="teacher-exam-pending-transfer",a=["6-р анги","7-р анги","8-р анги","9-р анги","10-р анги","11-р анги","12-р анги"],n={title:"",grade:"",subject:"",topic:"",durationInMinutes:40,requiresSchoolApproval:!1}},2718:(e,t,i)=>{i.d(t,{JR:()=>s,Tz:()=>a,f9:()=>n});var r=i(44406);let s=(0,r.J1)`
  mutation CreateTests($input: CreateTestsInput!) {
    createTests(input: $input) {
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
`,a=(0,r.J1)`
  mutation CreateOpenExercies($input: CreateOpenExerciesArgs!) {
    createOpenExercies(input: $input) {
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
`,n=(0,r.J1)`
  mutation CreateExam($input: CreateExamArgs!) {
    createExam(input: $input) {
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
`},61920:(e,t,i)=>{i.d(t,{cn:()=>a});var r=i(74205),s=i(96898);function a(...e){return(0,s.QP)((0,r.$)(e))}},62228:(e,t,i)=>{i.d(t,{$0:()=>u,E$:()=>r,My:()=>s,Ro:()=>m,Vt:()=>o,ZC:()=>l,Zt:()=>a,c0:()=>d,pr:()=>c,r2:()=>p});let r={multiple_choice:"Сонгох асуулт",short_answer:"Богино хариулт",long_answer:"Дэлгэрэнгүй хариулт",formula_input:"Томьёоны оролт",image_based:"Зурагт суурилсан",file_upload:"Файл хавсаргах"},s={easy:"Хялбар",medium:"Дунд",hard:"Хүнд"},a={draft:"Ноорог",published:"Нийтэлсэн"},n={acceptedFileTypes:[".pdf",".docx",".png"],instructions:"Бодолтоо PDF эсвэл зураг хэлбэрээр хавсаргана уу.",maxFiles:1};function o(e){return{id:`option-${e+1}`,text:"",isCorrect:0===e}}function d(e="multiple_choice"){return{title:"",questionType:e,prompt:"",guidance:"",explanation:"",options:[o(0),o(1),o(2),o(3)],correctAnswer:"",rubric:"",formulaRaw:"",imageUrl:"",fileUploadConfig:n,grade:"6-р анги",subject:"Математик",subtopic:"",topic:"",difficulty:"medium",points:5,status:"draft"}}function c(e){return e.trim()?e.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g,"($1)/($2)").replace(/\\sqrt\{([^}]*)\}/g,"sqrt($1)").replace(/\\times/g,"x").replace(/\\pi/g,"pi").replace(/\^\{([^}]*)\}/g,"^($1)").replace(/_\{([^}]*)\}/g,"_($1)"):"Томьёоны урьдчилсан харагдац энд гарна."}function l(e,t){return e.filter(e=>{let i;return!!(!(i=t.search.trim().toLowerCase())||[e.title,e.content.prompt,e.content.guidance,e.grade,e.subject,e.subtopic,e.topic,e.teacherName,r[e.questionType]].join(" ").toLowerCase().includes(i))&&("multiple_choice"!==t.questionType||"multiple_choice"===e.questionType)&&("long_answer"!==t.questionType||"multiple_choice"!==e.questionType)&&("all"===t.difficulty||e.difficulty===t.difficulty)&&("all"===t.subject||e.subject===t.subject)&&("all"===t.grade||e.grade===t.grade)&&("all"===t.topic||e.topic===t.topic||(e.subtopic??"")===t.topic)&&("all"===t.subtopic||(e.subtopic??"")===t.subtopic)&&("all"===t.status||e.status===t.status)&&!0}).sort((e,i)=>{switch(t.sortBy){case"oldest":return new Date(e.createdAt).getTime()-new Date(i.createdAt).getTime();case"most_used":return i.usageCount-e.usageCount;default:return new Date(i.createdAt).getTime()-new Date(e.createdAt).getTime()}})}function u(e){let t={};if(e.title.trim()||(t.title="Асуултын гарчиг оруулна уу."),e.prompt.trim()||(t.prompt="Сурагчид харагдах асуулгын текстийг оруулна уу."),e.grade.trim()||(t.grade="Анги сонгох эсвэл бичнэ үү."),e.subject.trim()||(t.subject="Хичээлийн төрлийг сонгох эсвэл бичнэ үү."),e.topic.trim()||(t.topic="Сэдэв оруулна уу."),(!Number.isFinite(e.points)||e.points<=0)&&(t.points="Оноо 0-ээс их байх ёстой."),"multiple_choice"===e.questionType){let i=e.options.filter(e=>e.text.trim()),r=i.some(e=>e.isCorrect);i.length<2&&(t.options="Дор хаяж хоёр сонголт оруулна уу."),r||(t.options="Нэг зөв хариултыг тэмдэглэнэ үү.")}return"short_answer"!==e.questionType||e.correctAnswer.trim()||(t.correctAnswer="Хүлээгдэж буй хариултыг оруулна уу."),"long_answer"!==e.questionType||e.rubric.trim()||(t.rubric="Гараар үнэлэх рубрик эсвэл тайлбар нэмнэ үү."),"formula_input"!==e.questionType||e.formulaRaw.trim()||(t.formulaRaw="Хүлээгдэж буй томьёог оруулна уу."),"image_based"!==e.questionType||e.imageUrl.trim()||(t.imageUrl="Зураг оруулах эсвэл хавсаргана уу."),"file_upload"===e.questionType&&(e.fileUploadConfig.instructions.trim()?0===e.fileUploadConfig.acceptedFileTypes.length&&(t.fileUploadConfig="Дор хаяж нэг зөвшөөрөгдөх файлын төрлийг оруулна уу."):t.fileUploadConfig="Файл хавсаргах заавар нэмнэ үү."),t}function p(e,t){let i=new Date().toISOString(),r=e.options.filter(e=>e.text.trim()).map(e=>({...e,text:e.text.trim()}));return{id:t?.id??`question-${Math.random().toString(36).slice(2,10)}`,title:e.title.trim(),questionType:e.questionType,source:t?.source??"school",teacherName:t?.teacherName,isLocalOnly:t?.isLocalOnly??!1,content:{prompt:e.prompt.trim(),guidance:e.guidance.trim(),explanation:e.explanation.trim()},options:r,correctAnswer:"multiple_choice"===e.questionType?r.find(e=>e.isCorrect)?.text??"":e.correctAnswer.trim(),rubric:e.rubric.trim(),formulaRaw:e.formulaRaw.trim(),formulaPreview:c(e.formulaRaw),imageUrl:e.imageUrl.trim(),fileUploadConfig:e.fileUploadConfig,grade:e.grade.trim(),subject:e.subject.trim(),subtopic:e.subtopic.trim()||void 0,topic:e.topic.trim(),difficulty:e.difficulty,points:e.points,status:e.status,gradingType:function(e){switch(e.questionType){case"multiple_choice":return"auto";case"short_answer":case"formula_input":return"hybrid";case"long_answer":case"image_based":case"file_upload":return"manual"}}(e),usageCount:t?.usageCount??0,createdAt:t?.createdAt??i,updatedAt:i}}function m(e){return{id:e.id,title:e.title,questionType:e.questionType,prompt:e.content.prompt,guidance:e.content.guidance??"",explanation:e.content.explanation??"",options:e.options.length>0?e.options:[o(0),o(1),o(2),o(3)],correctAnswer:e.correctAnswer,rubric:e.rubric,formulaRaw:e.formulaRaw,imageUrl:e.imageUrl,fileUploadConfig:e.fileUploadConfig,grade:e.grade,subject:e.subject,subtopic:e.subtopic??"",topic:e.topic,difficulty:e.difficulty,points:e.points,status:e.status}}},69227:(e,t,i)=>{i.d(t,{bq:()=>c,eb:()=>u,gC:()=>l,l6:()=>o,yv:()=>d});var r=i(83664),s=i(84061),a=i(86012),n=i(61920);let o=s.bL;s.YJ;let d=s.WT,c=a.forwardRef(({className:e,children:t,...i},a)=>(0,r.jsxs)(s.l9,{ref:a,className:(0,n.cn)("flex h-12 w-full items-center justify-between gap-2 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 shadow-sm ring-offset-white placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-black disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 [&>span]:line-clamp-1",e),...i,children:[t,(0,r.jsx)(s.In,{asChild:!0,children:(0,r.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"shrink-0 opacity-50","aria-hidden":!0,children:(0,r.jsx)("path",{d:"m6 9 6 6 6-6"})})})]}));c.displayName=s.l9.displayName;let l=a.forwardRef(({className:e,children:t,position:i="popper",...a},o)=>(0,r.jsx)(s.ZL,{children:(0,r.jsx)(s.UC,{ref:o,className:(0,n.cn)("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-900 shadow-md","popper"===i&&"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",e),position:i,...a,children:(0,r.jsx)(s.LM,{className:(0,n.cn)("p-1","popper"===i&&"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),children:t})})}));l.displayName=s.UC.displayName,a.forwardRef(({className:e,...t},i)=>(0,r.jsx)(s.JU,{ref:i,className:(0,n.cn)("py-1.5 pl-8 pr-2 text-sm font-semibold text-gray-500",e),...t})).displayName=s.JU.displayName;let u=a.forwardRef(({className:e,children:t,...i},a)=>(0,r.jsxs)(s.q7,{ref:a,className:(0,n.cn)("relative flex w-full cursor-default select-none items-center rounded-lg py-2 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",e),...i,children:[(0,r.jsx)("span",{className:"absolute left-2 flex h-3.5 w-3.5 items-center justify-center",children:(0,r.jsx)(s.VF,{children:(0,r.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:(0,r.jsx)("path",{d:"M20 6 9 17l-5-5"})})})}),(0,r.jsx)(s.p4,{children:t})]}));u.displayName=s.q7.displayName,a.forwardRef(({className:e,...t},i)=>(0,r.jsx)(s.wv,{ref:i,className:(0,n.cn)("-mx-1 my-1 h-px bg-gray-200",e),...t})).displayName=s.wv.displayName},73590:(e,t,i)=>{i.d(t,{GR:()=>o,SU:()=>a,Uo:()=>c,Ys:()=>n,g9:()=>d,lp:()=>u,pq:()=>s,xj:()=>l});var r=i(44406);let s=(0,r.J1)`
  query GetAllSubject {
    getAllSubject {
      id
      name
    }
  }
`,a=(0,r.J1)`
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
`,n=(0,r.J1)`
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
`,o=(0,r.J1)`
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
`,d=(0,r.J1)`
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
`,c=(0,r.J1)`
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
`}}]);