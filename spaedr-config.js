const APP_NAME = "Spaedr Config";

function html() {
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${APP_NAME}</title>

<style>
*{box-sizing:border-box}
body{
margin:0;
background:#07090d;
color:#fff;
font-family:Arial,Tahoma,sans-serif
}
header{
height:65px;
background:#10141b;
border-bottom:1px solid #252b36;
display:flex;
align-items:center;
justify-content:space-between;
padding:0 20px
}
.logo{
font-size:21px;
font-weight:bold
}
.logo span{
color:#765cff
}
.layout{
display:flex;
min-height:calc(100vh - 65px)
}
aside{
width:230px;
background:#0d1016;
border-left:1px solid #252b36;
padding:15px
}
aside button{
width:100%;
border:0;
background:transparent;
color:#aab2c0;
padding:13px;
border-radius:10px;
text-align:right;
margin:3px 0;
cursor:pointer
}
aside button:hover,
aside button.active{
background:#1c1930;
color:#fff
}
main{
flex:1;
padding:25px;
max-width:1400px;
width:100%;
margin:auto
}
.grid{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:15px;
margin:20px 0
}
.card,
.box{
background:#10141b;
border:1px solid #252b36;
border-radius:17px;
padding:18px
}
.label{
color:#929baa;
font-size:13px
}
.number{
font-size:28px;
font-weight:bold;
margin-top:8px
}
input,select{
width:100%;
padding:12px;
margin-top:7px;
border-radius:10px;
border:1px solid #303744;
background:#080b10;
color:#fff;
outline:none
}
button.primary{
background:#765cff;
border:0;
color:#fff;
padding:11px 17px;
border-radius:10px;
font-weight:bold;
cursor:pointer
}
button.danger{
background:#a72d42;
border:0;
color:#fff;
padding:9px;
border-radius:8px;
cursor:pointer
}
.row{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:10px
}
.hidden{
display:none!important
}
.auth{
min-height:100vh;
display:grid;
place-items:center;
padding:20px
}
.authbox{
width:min(420px,100%);
background:#10141b;
border:1px solid #252b36;
border-radius:20px;
padding:25px
}
.authbox h1{
text-align:center
}
.muted{
color:#929baa
}
.ok{
color:#4ee49a
}
.err{
color:#ff7184
}
table{
width:100%;
border-collapse:collapse;
margin-top:15px
}
th,td{
padding:11px;
border-bottom:1px solid #252b36;
text-align:right;
font-size:13px
}
.tag{
padding:5px 9px;
border-radius:99px;
background:#163d2a;
color:#65e9a2
}
.tag.off{
background:#441b24;
color:#ff7184
}
.footer{
position:fixed;
bottom:8px;
left:12px;
display:flex;
gap:12px;
font-size:12px
}
.footer a{
color:#737c8b
}
@media(max-width:800px){
aside{width:65px}
aside button{
font-size:0;
text-align:center
}
.grid{
grid-template-columns:repeat(2,1fr)
}
.row{
grid-template-columns:1fr 1fr
}
}
@media(max-width:500px){
.grid,.row{
grid-template-columns:1fr
}
main{
padding:12px
}
}
</style>
</head>

<body>

<div id="root"></div>

<script>

const $=id=>document.getElementById(id);

async function api(url,options={}){
const response=await fetch(url,{
headers:{
"content-type":"application/json"
},
...options
});

const data=await response.json().catch(()=>({}));

if(!response.ok){
throw new Error(data.error||"خطا");
}

return data;
}

function escapeHTML(text){
return String(text).replace(/[&<>"']/g,char=>({
"&":"&amp;",
"<":"&lt;",
">":"&gt;",
'"':"&quot;",
"'":"&#39;"
}[char]));
}

function formatBytes(bytes){

bytes=Number(bytes);

if(bytes>=1073741824){
return (bytes/1073741824).toFixed(2)+" GB";
}

return (bytes/1048576).toFixed(1)+" MB";
}

function remainingDays(date){

return Math.max(
0,
Math.ceil((Number(date)-Date.now())/86400000)
);

}

async function setup(){

root.innerHTML=`

<div class="auth">

<div class="authbox">

<h1>
Spaedr <span style="color:#765cff">Config</span>
</h1>

<p class="muted">
برای اولین ورود یک رمز تعیین کنید
</p>

<input
id="password1"
type="password"
placeholder="رمز ورود"
>

<input
id="password2"
type="password"
placeholder="تکرار رمز"
>

<br><br>

<button
class="primary"
style="width:100%"
onclick="createPassword()"
>
تعیین رمز
</button>

<p id="message"></p>

</div>

</div>

`;

}

async function createPassword(){

const p1=$("password1").value;
const p2=$("password2").value;

if(p1.length<6){

$("message").textContent=
"رمز باید حداقل ۶ کاراکتر باشد";

return;

}

if(p1!==p2){

$("message").textContent=
"رمزها یکسان نیستند";

return;

}

try{

await api("/api/setup",{
method:"POST",
body:JSON.stringify({
password:p1
})
});

location.reload();

}catch(error){

$("message").textContent=error.message;

}

}

function loginPage(){

root.innerHTML=`

<div class="auth">

<div class="authbox">

<h1>
Spaedr <span style="color:#765cff">Config</span>
</h1>

<p class="muted">
ورود به پنل
</p>

<input
id="loginPassword"
type="password"
placeholder="رمز ورود"
>

<br><br>

<button
class="primary"
style="width:100%"
onclick="login()"
>
ورود
</button>

<p id="message"></p>

</div>

</div>

`;

}

async function login(){

try{

await api("/api/login",{
method:"POST",
body:JSON.stringify({
password:$("loginPassword").value
})
});

location.reload();

}catch(error){

$("message").textContent=error.message;

}

}

async function logout(){

await api("/api/logout",{
method:"POST"
});

location.reload();

}

function panel(){

root.innerHTML=`

<header>

<div class="logo">
Spaedr <span>Config</span>
</div>

<button
class="primary"
onclick="logout()"
>
خروج
</button>

</header>

<div class="layout">

<aside>

<button
class="active"
onclick="showPage('dashboard',this)"
>
📊 داشبورد
</button>

<button
onclick="showPage('customers',this)"
>
👥 مشتریان
</button>

<button
onclick="showPage('control',this)"
>
🎛️ کنترل مشتریان
</button>

<button
onclick="showPage('create',this)"
>
➕ ساخت مشتری
</button>

<button
onclick="showPage('cloudflare',this)"
>
☁️ Cloudflare
</button>

</aside>

<main>

<section id="dashboard">

<h1>داشبورد</h1>

<p class="muted">
مدیریت Spaedr Config
</p>

<div class="grid">

<div class="card">

<div class="label">
👥 مشتریان
</div>

<div
class="number"
id="totalCustomers"
>
0
</div>

</div>

<div class="card">

<div class="label">
🟢 فعال
</div>

<div
class="number"
id="activeCustomers"
>
0
</div>

</div>

<div class="card">

<div class="label">
🔴 خاموش
</div>

<div
class="number"
id="inactiveCustomers"
>
0
</div>

</div>

<div class="card">

<div class="label">
☁️ Cloudflare
</div>

<div
class="number"
id="cloudflareStatus"
>
-
</div>

</div>

</div>

</section>


<section
id="customers"
class="hidden"
>

<h1>
مشتریان
</h1>

<div
class="box"
id="customersList"
>
در حال دریافت...
</div>

</section>


<section
id="control"
class="hidden"
>

<h1>
کنترل مشتریان
</h1>

<div
class="box"
id="controlList"
>
در حال دریافت...
</div>

</section>


<section
id="create"
class="hidden"
>

<h1>
ساخت مشتری
</h1>

<div class="box">

<div class="row">

<label>
نام کاربر

<input
id="customerName"
placeholder="نام مشتری"
>

</label>

<label>
حجم

<input
id="customerAmount"
type="number"
placeholder="20"
>

</label>

<label>
واحد

<select id="customerUnit">

<option>GB</option>

<option>MB</option>

</select>

</label>

<label>
تعداد روز

<input
id="customerDays"
type="number"
placeholder="30"
>

</label>

</div>

<br>

<button
class="primary"
onclick="createCustomer()"
>
ساخت مشتری
</button>

<p id="createMessage"></p>

</div>

</section>


<section
id="cloudflare"
class="hidden"
>

<h1>
اتصال Cloudflare
</h1>

<div class="box">

<p class="muted">
API Token خود را وارد کنید.
</p>

<input
id="cloudflareToken"
type="password"
placeholder="Cloudflare API Token"
>

<br><br>

<button
class="primary"
onclick="connectCloudflare()"
>
بررسی و اتصال
</button>

<p id="cloudflareMessage"></p>

</div>

</section>

</main>

</div>

<div class="footer">

<a
href="https://www.youtube.com/@Spaedryoutube"
target="_blank"
>
YouTube
</a>

<a
href="https://www.tiktok.com/@spaedrtiktok"
target="_blank"
>
TikTok
</a>

</div>

`;

loadDashboard();

}

function showPage(id,button){

document
.querySelectorAll("main section")
.forEach(section=>{
section.classList.add("hidden");
});

$(id).classList.remove("hidden");

document
.querySelectorAll("aside button")
.forEach(btn=>{
btn.classList.remove("active");
});

button.classList.add("active");

if(id==="customers"){
loadCustomers();
}

if(id==="control"){
loadCustomers();
}

if(id==="dashboard"){
loadDashboard();
}

}

async function loadDashboard(){

try{

const data=
await api("/api/status");

$("totalCustomers").textContent=
data.customers;

$("activeCustomers").textContent=
data.active;

$("inactiveCustomers").textContent=
data.customers-data.active;

$("cloudflareStatus").textContent=
data.cloudflare
?
"متصل"
:
"قطع";

}catch(error){

if(error.message==="unauthorized"){
location.reload();
}

}

}

async function loadCustomers(){

try{

const customers=
await api("/api/customers");

let html=`

<table>

<tr>

<th>نام</th>
<th>حجم کل</th>
<th>باقی‌مانده</th>
<th>روز باقی</th>
<th>وضعیت</th>
<th>عملیات</th>

</tr>

`;

for(const customer of customers){

const remaining=
Math.max(
0,
customer.total_bytes-
customer.used_bytes
);

html+=`

<tr>

<td>
${escapeHTML(customer.name)}
</td>

<td>
${formatBytes(customer.total_bytes)}
</td>

<td>
${formatBytes(remaining)}
</td>

<td>
${remainingDays(customer.expires_at)}
</td>

<td>

<span
class="tag ${customer.active?"":"off"}"
>

${customer.active?"فعال":"خاموش"}

</span>

</td>

<td>

<button
class="primary"
onclick="toggleCustomer(${customer.id})"
>
تغییر وضعیت
</button>

<button
class="danger"
onclick="deleteCustomer(${customer.id})"
>
حذف
</button>

</td>

</tr>

`;

}

html+=`

</table>

`;

if(customers.length===0){

html=
"<p class='muted'>هنوز مشتری‌ای ساخته نشده است.</p>";

}

$("customersList").innerHTML=html;

$("controlList").innerHTML=html;

}catch(error){

$("customersList").textContent=
error.message;

}

}

async function createCustomer(){

try{

await api("/api/customers",{

method:"POST",

body:JSON.stringify({

name:$("customerName").value,

amount:$("customerAmount").value,

unit:$("customerUnit").value,

days:$("customerDays").value

})

});

$("createMessage").innerHTML=
'<span class="ok">مشتری با موفقیت ساخته شد.</span>';

$("customerName").value="";
$("customerAmount").value="";
$("customerDays").value="";

loadDashboard();

}catch(error){

$("createMessage").innerHTML=
'<span class="err">'+
escapeHTML(error.message)+
'</span>';

}

}

async function toggleCustomer(id){

await api("/api/customers/"+id,{

method:"POST",

body:JSON.stringify({
action:"toggle"
})

});

loadCustomers();
loadDashboard();

}

async function deleteCustomer(id){

if(!confirm("این مشتری حذف شود؟")){
return;
}

await api("/api/customers/"+id,{

method:"POST",

body:JSON.stringify({
action:"delete"
})

});

loadCustomers();
loadDashboard();

}

async function connectCloudflare(){

try{

await api("/api/cloudflare",{

method:"POST",

body:JSON.stringify({

token:
$("cloudflareToken").value

})

});

$("cloudflareMessage").innerHTML=
'<span class="ok">اتصال موفق بود.</span>';

loadDashboard();

}catch(error){

$("cloudflareMessage").innerHTML=
'<span class="err">'+
escapeHTML(error.message)+
'</span>';

}

}

async function start(){

try{

const setupStatus=
await api("/api/setup");

if(setupStatus.setup){

setup();

return;

}

try{

await api("/api/status");

panel();

}catch(error){

loginPage();

}

}catch(error){

document.body.innerHTML=
"<h2 style='padding:30px'>D1 با نام DB متصل نشده است.</h2>";

}

}

start();

</script>

</body>
</html>`;
}

async function sha256(text){

const data=
new TextEncoder().encode(text);

const hash=
await crypto.subtle.digest(
"SHA-256",
data
);

return [...new Uint8Array(hash)]
.map(x=>x.toString(16).padStart(2,"0"))
.join("");

}

async function initialize(db){

await db.batch([

db.prepare(`
CREATE TABLE IF NOT EXISTS settings(
key TEXT PRIMARY KEY,
value TEXT NOT NULL
)
`),

db.prepare(`
CREATE TABLE IF NOT EXISTS users(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
total_bytes INTEGER NOT NULL,
used_bytes INTEGER NOT NULL DEFAULT 0,
expires_at INTEGER NOT NULL,
active INTEGER NOT NULL DEFAULT 1,
created_at INTEGER NOT NULL
)
`),

db.prepare(`
CREATE TABLE IF NOT EXISTS sessions(
token_hash TEXT PRIMARY KEY,
expires_at INTEGER NOT NULL
)
`)

]);

}

function getToken(request){

const cookie=
request.headers.get("Cookie")||"";

const match=
cookie.match(/spaedr_session=([^;]+)/);

return match?match[1]:null;

}

async function authenticated(request,db){

const token=
getToken(request);

if(!token){
return false;
}

const hash=
await sha256(token);

const session=
await db
.prepare(`
SELECT expires_at
FROM sessions
WHERE token_hash=?
`)
.bind(hash)
.first();

return session &&
Number(session.expires_at)>Date.now();

}

async function api(request,env){

const db=env.DB;

await initialize(db);

const url=
new URL(request.url);

const path=
url.pathname;

let body={};

try{
body=await request.json();
}catch{}

if(path==="/api/setup" && request.method==="GET"){

const password=
await db
.prepare(`
SELECT value
FROM settings
WHERE key='password'
`)
.first();

return Response.json({
setup:!password
});

}

if(path==="/api/setup" && request.method==="POST"){

const password=
String(body.password||"");

if(password.length<6){

return Response.json(
{error:"رمز باید حداقل ۶ کاراکتر باشد"},
{status:400}
);

}

const exists=
await db
.prepare(`
SELECT value
FROM settings
WHERE key='password'
`)
.first();

if(exists){

return Response.json(
{error:"قبلاً راه‌اندازی شده"},
{status:409}
);

}

await db
.prepare(`
INSERT INTO settings(key,value)
VALUES('password',?)
`)
.bind(await sha256(password))
.run();

return Response.json({
ok:true
});

}

if(path==="/api/login" && request.method==="POST"){

const saved=
await db
.prepare(`
SELECT value
FROM settings
WHERE key='password'
`)
.first();

if(!saved){

return Response.json(
{error:"ابتدا رمز تعیین کنید"},
{status:400}
);

}

const passwordHash=
await sha256(
String(body.password||"")
);

if(passwordHash!==saved.value){

return Response.json(
{error:"رمز اشتباه است"},
{status:401}
);

}

const token=
crypto.randomUUID()+
"-"+
crypto.randomUUID();

await db
.prepare(`
INSERT INTO sessions(
token_hash,
expires_at
)
VALUES(?,?)
`)
.bind(
await sha256(token),
Date.now()+7*86400000
)
.run();

return new Response(
JSON.stringify({ok:true}),
{
headers:{
"content-type":
"application/json",
"Set-Cookie":
`spaedr_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`
}
}
);

}

if(path==="/api/logout"){

const token=
getToken(request);

if(token){

await db
.prepare(`
DELETE FROM sessions
WHERE token_hash=?
`)
.bind(await sha256(token))
.run();

}

return new Response(
JSON.stringify({ok:true}),
{
headers:{
"content-type":
"application/json",
"Set-Cookie":
"spaedr_session=; Path=/; Max-Age=0"
}
}
);

}

if(!await authenticated(request,db)){

return Response.json(
{error:"unauthorized"},
{status:401}
);

}

if(path==="/api/status"){

const result=
await db
.prepare(`
SELECT
COUNT(*) AS total,
SUM(active) AS active
FROM users
`)
.first();

const cloudflare=
await db
.prepare(`
SELECT value
FROM settings
WHERE key='cloudflare_token'
`)
.first();

return Response.json({

customers:
Number(result?.total||0),

active:
Number(result?.active||0),

cloudflare:
!!cloudflare

});

}

if(
path==="/api/customers" &&
request.method==="GET"
){

const result=
await db
.prepare(`
SELECT *
FROM users
ORDER BY id DESC
`)
.all();

return Response.json(
result.results||[]
);

}

if(
path==="/api/customers" &&
request.method==="POST"
){

const name=
String(body.name||"").trim();

const amount=
Number(body.amount);

const days=
Number(body.days);

const unit=
body.unit==="MB"
?
1048576
:
1073741824;

if(
!name||
!Number.isFinite(amount)||
amount<=0||
!Number.isFinite(days)||
days<=0
){

return Response.json(
{error:"اطلاعات مشتری کامل نیست"},
{status:400}
);

}

const now=
Date.now();

await db
.prepare(`
INSERT INTO users(
name,
total_bytes,
used_bytes,
expires_at,
active,
created_at
)
VALUES(?,?,?,?,1,?)
`)
.bind(
name,
Math.floor(amount*unit),
0,
now+Math.floor(days)*86400000,
now
)
.run();

return Response.json({
ok:true
});

}

if(
path.startsWith("/api/customers/") &&
request.method==="POST"
){

const id=
Number(
path.split("/")[3]
);

if(body.action==="toggle"){

await db
.prepare(`
UPDATE users
SET active=
CASE
WHEN active=1 THEN 0
ELSE 1
END
WHERE id=?
`)
.bind(id)
.run();

return Response.json({
ok:true
});

}

if(body.action==="delete"){

await db
.prepare(`
DELETE FROM users
WHERE id=?
`)
.bind(id)
.run();

return Response.json({
ok:true
});

}

}

if(
path==="/api/cloudflare" &&
request.method==="POST"
){

const token=
String(body.token||"").trim();

if(!token){

return Response.json(
{error:"API Token وارد نشده"},
{status:400}
);

}

const response=
await fetch(
"https://api.cloudflare.com/client/v4/user/tokens/verify",
{
headers:{
Authorization:
"Bearer "+token
}
}
);

const data=
await response.json();

if(!data.success){

return Response.json(
{error:"API Token معتبر نیست"},
{status:400}
);

}

await db
.prepare(`
INSERT INTO settings(key,value)
VALUES('cloudflare_token',?)
ON CONFLICT(key)
DO UPDATE SET value=excluded.value
`)
.bind(token)
.run();

return Response.json({
ok:true
});

}

return Response.json(
{error:"not_found"},
{status:404}
);

}

export default {

async fetch(request,env){

try{

if(!env.DB){

return new Response(
"D1 Binding با نام DB پیدا نشد.",
{
status:500
}
);

}

const url=
new URL(request.url);

if(
url.pathname.startsWith("/api/")
){

return api(request,env);

}

await initialize(env.DB);

return new Response(
html(),
{
headers:{
"content-type":
"text/html;charset=UTF-8"
}
}
);

}catch(error){

return new Response(
"Spaedr Config Error: "+
error.message,
{
status:500
}
);

}

}

};