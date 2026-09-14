const defaultProducts=[
{id:1,name:'التاجر الذكي AI',desc:'100 Prompt احترافي للتجارة والتسويق بالعربية',price:1490,cat:'prompts',icon:'🤖'},
{id:2,name:'Social Media Templates',desc:'قوالب جاهزة لمنشورات Instagram وFacebook',price:1990,cat:'templates',icon:'🎨'},
{id:3,name:'WhatsApp Sales Kit',desc:'رسائل وقوالب جاهزة لرفع المبيعات عبر واتساب',price:1790,cat:'kits',icon:'💬'},
{id:4,name:'Business Excel Kit',desc:'ملفات Excel لتنظيم المبيعات والمصاريف والأرباح',price:2490,cat:'tools',icon:'📊'},
{id:5,name:'Freelancer AI Kit',desc:'حزمة أدوات وPrompts للعمل الحر بذكاء',price:2990,cat:'kits',icon:'💼'},
{id:6,name:'Content Calendar',desc:'تقويم محتوى جاهز لمدة 30 يوماً',price:990,cat:'templates',icon:'📅'}
];
const products=JSON.parse(localStorage.getItem('dzd-products')||'null')||defaultProducts;
let cart=JSON.parse(localStorage.getItem('dzd-cart')||'[]');let active='all';
const grid=document.getElementById('productsGrid');
function money(n){return Number(n).toLocaleString('ar-DZ')+' دج'}
function render(){const list=active==='all'?products:products.filter(p=>p.cat===active);grid.innerHTML=list.map(p=>`<article class="product"><a href="product.html?id=${p.id}" class="product-link"><div class="thumb">${p.icon}</div><div class="product-body"><h3>${p.name}</h3><p>${p.desc}</p></div></a><div class="product-body"><div class="price"><strong>${money(p.price)}</strong><button class="add" onclick="addToCart(${p.id})">أضف للسلة</button></div></div></article>`).join('');document.getElementById('resultCount').textContent=`${list.length} منتجات`;document.getElementById('cartCount').textContent=cart.length}
function addToCart(id){const p=products.find(x=>x.id===id);if(p&&!cart.some(x=>x.id===id))cart.push(p);save();openCart()}
function removeItem(id){cart=cart.filter(x=>x.id!==id);save();renderCart()}
function save(){localStorage.setItem('dzd-cart',JSON.stringify(cart));render()}
function renderCart(){const box=document.getElementById('cartItems');if(!cart.length){box.innerHTML='<div class="empty">السلة فارغة حالياً 🛒</div>';document.getElementById('cartTotal').textContent='0 دج';return}box.innerHTML=cart.map(p=>`<div class="cart-row"><span>${p.icon} ${p.name}</span><span>${money(p.price)} <button class="remove" onclick="removeItem(${p.id})">حذف</button></span></div>`).join('');document.getElementById('cartTotal').textContent=money(cart.reduce((s,p)=>s+Number(p.price),0))}
function openCart(){document.getElementById('cartModal').classList.add('show');document.getElementById('cartModal').setAttribute('aria-hidden','false');renderCart()}
document.getElementById('cartBtn').onclick=openCart;document.getElementById('closeCart').onclick=()=>document.getElementById('cartModal').classList.remove('show');document.getElementById('checkout').onclick=()=>location.href='checkout.html';
document.querySelectorAll('.categories button').forEach(btn=>btn.onclick=()=>{document.querySelectorAll('.categories button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');active=btn.dataset.filter;render()});
render();