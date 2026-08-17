const eyeUrl = 'https://www.ien.edu.sa/?choice=2';
const arabicNums = n => String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const grades = ['الأول','الثاني','الثالث','الرابع','الخامس','السادس'];
const books = grades.flatMap((grade, i) => [1,2].map(semester => ({
  id:`g${i+1}s${semester}`,
  gradeNumber:i+1,
  grade,
  semester,
  title:`رياضيات ${grade} ابتدائي`,
  semesterLabel:`الفصل الدراسي ${semester===1?'الأول':'الثاني'}`,
  url: eyeUrl
})));

const grid = document.getElementById('grid');
const search = document.getElementById('search');
const countLabel = document.getElementById('countLabel');
const dialog = document.getElementById('detailsDialog');
const dialogContent = document.getElementById('dialogContent');
let semesterFilter='all';

function render(){
  const q = search.value.trim().toLowerCase();
  const filtered = books.filter(b => (semesterFilter==='all' || String(b.semester)===semesterFilter) &&
    (`${b.title} ${b.semesterLabel}`.toLowerCase().includes(q)));
  countLabel.textContent = `${arabicNums(filtered.length)} كتابًا`;
  grid.innerHTML = filtered.length ? filtered.map(b=>`
    <article class="book-card">
      <span class="grade-chip">الصف ${b.grade}</span>
      <h3>${b.title}</h3>
      <div class="semester">${b.semesterLabel}</div>
      <div class="meta"><span>📘 كتاب الطالب</span><span>🔗 المصدر: عين</span><span>🇸🇦 وزارة التعليم</span></div>
      <div class="card-actions">
        <a class="open-btn" href="${b.url}" target="_blank" rel="noopener">فتح من عين</a>
        <button class="info-btn" data-id="${b.id}">طريقة الوصول</button>
      </div>
    </article>`).join('') : `<div class="empty">لم نجد نتيجة مطابقة. جرّب صفًا أو فصلًا آخر.</div>`;
  document.querySelectorAll('.info-btn').forEach(btn=>btn.addEventListener('click',()=>showDetails(btn.dataset.id)));
}

function showDetails(id){
  const b=books.find(x=>x.id===id); if(!b) return;
  dialogContent.innerHTML=`
    <span class="grade-chip">${b.title}</span>
    <h3>${b.semesterLabel}</h3>
    <p>للوصول إلى الكتاب من المصدر الرسمي، افتح عين ثم اتبع المسار:</p>
    <div class="path">تعليم عام ← المرحلة الابتدائية ← الصف ${b.grade} ← ${b.semesterLabel} ← مادة الرياضيات</div>
    <div class="dialog-actions"><a class="primary" href="${b.url}" target="_blank" rel="noopener">فتح عين الإثرائية</a></div>`;
  dialog.showModal();
}

document.querySelectorAll('[data-semester]').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('[data-semester]').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active'); semesterFilter=btn.dataset.semester; render();
}));
search.addEventListener('input',render);
document.getElementById('startBtn').addEventListener('click',()=>document.getElementById('library').scrollIntoView({behavior:'smooth'}));
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
render();
