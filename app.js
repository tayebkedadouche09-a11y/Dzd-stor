const fallbackCategories=[
{id:1,slug:'ai',name_ar:'الذكاء الاصطناعي',name_fr:'Intelligence artificielle',name_en:'AI',icon:'🤖',sort_order:1},
{id:2,slug:'templates',name_ar:'القوالب الجاهزة',name_fr:'Modèles prêts à l’emploi',name_en:'Templates',icon:'🎨',sort_order:2},
{id:3,slug:'tools',name_ar:'الأدوات',name_fr:'Outils',name_en:'Tools',icon:'🛠️',sort_order:3},
{id:4,slug:'kits',name_ar:'الحزم',name_fr:'Packs',name_en:'Kits',icon:'📦',sort_order:4},
{id:5,slug:'business',name_ar:'الأعمال والتجارة',name_fr:'Business & Commerce',name_en:'Business',icon:'💼',sort_order:5},
{id:6,slug:'marketing',name_ar:'التسويق والمحتوى',name_fr:'Marketing & Contenu',name_en:'Marketing',icon:'📣',sort_order:6}
];
const defaultProducts=[
{id:1,name:'التاجر الذكي AI',desc:'100 Prompt احترافي للتجارة والتسويق بالعربية',price:1490,cat:'ai',icon:'🤖'},
{id:2,name:'Social Media Templates',desc:'قوالب جاهزة لمنشورات Instagram وFacebook',price:1990,cat:'templates',icon:'🎨'},
{id:3,name:'WhatsApp Sales Kit',desc:'رسائل وقوالب جاهزة لرفع المبيعات عبر واتساب',price:1790,cat:'kits',icon:'💬'},
{id:4,name:'Business Excel Kit',desc:'ملفات Excel لتنظيم المبيعات والمصاريف والأرباح',price:2490,cat:'tools',icon:'📊'},
{id:5,name:'Freelancer AI Kit',desc:'حزمة أدوات وPrompts للعمل الحر بذكاء',price:2990,cat:'kits',icon:'💼'},
{id:6,name:'Content Calendar',desc:'تقويم محتوى جاهز لمدة 30 يوماً',price:990,cat:'templates',icon:'📅'}
];
let products=JSON.parse(localStorage.getItem('dzd-products')||'null')||defaultProducts;
let categories=fallbackCategories;let cart=JSON.parse(localStorage.getItem('dzd-cart')||'[]');let active='all';
const grid=document.getElementById('productsGrid');
function money(n){return Number(n).toLocaleString('ar-DZ')+' دج'}
function renderCategories(){const box=document.getElementById('categoriesList');if(!box)return;box.innerHTML='<button data-filter="all" class="active">✨ الكل</button>'+categories.map(c=>`<button data-filter="${escapeHtml(c.slug)}">${escapeHtml(c.icon)} ${escapeHtml(c.name_ar)}</button>`).join('');box.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{box.querySelectorAll('button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');active=btn.dataset.filter;render()})}
function render(){if(!grid)return;const list=active==='all'?products:products.filter(p=>p.cat===active);grid.innerHTML=list.map(p=>`<article class="product"><a href="product.html?id=${p.id}" class="product-link"><div class="thumb">${escapeHtml(p.icon)}</div><div class="product-body"><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.desc)}</p></div></a><div class="product-body"><div class="price"><strong>${money(p.price)}</strong><button class="add" onclick="addToCart(${p.id})">أضف للسلة</button></div></div></article>`).join('');const count=document.getElementById('resultCount');if(count)count.textContent=`${list.length} منتجات`;const cc=document.getElementById('cartCount');if(cc)cc.textContent=cart.length}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function addToCart(id){const p=products.find(x=>x.id===id);if(p&&!cart.some(x=>x.id===id))cart.push({id:p.id,name:p.name,desc:p.desc,price:p.price,cat:p.cat,icon:p.icon});save();openCart()}
function removeItem(id){cart=cart.filter(x=>x.id!==id);save();renderCart()}
function save(){localStorage.setItem('dzd-cart',JSON.stringify(cart));render()}
function renderCart(){const box=document.getElementById('cartItems');if(!box)return;if(!cart.length){box.innerHTML='<div class="empty">السلة فارغة حالياً 🛒</div>';document.getElementById('cartTotal').textContent='0 دج';return}box.innerHTML=cart.map(p=>`<div class="cart-row"><span>${escapeHtml(p.icon)} ${escapeHtml(p.name)}</span><span>${money(p.price)} <button class="remove" onclick="removeItem(${p.id})">حذف</button></span></div>`).join('');document.getElementById('cartTotal').textContent=money(cart.reduce((s,p)=>s+Number(p.price),0))}
function openCart(){const modal=document.getElementById('cartModal');if(!modal)return;modal.classList.add('show');modal.setAttribute('aria-hidden','false');renderCart()}
async function loadCatalog(){try{const cfg=window.DZD_SUPABASE;if(!cfg)return;const cr=await fetch(`${cfg.url}/rest/v1/product_categories?select=id,slug,name_ar,name_fr,name_en,icon,sort_order&order=sort_order`,{headers:{apikey:cfg.key,Authorization:`Bearer ${cfg.key}`}});if(cr.ok){const rows=await cr.json();if(Array.isArray(rows)&&rows.length===6)categories=rows}renderCategories();const r=await fetch(`${cfg.url}/rest/v1/products?select=id,name,description,price_dzd,category,icon&active=eq.true&order=id`,{headers:{apikey:cfg.key,Authorization:`Bearer ${cfg.key}`}});if(!r.ok)throw new Error('catalog');const rows=await r.json();if(rows.length){products=rows.map(p=>({id:p.id,name:p.name,desc:p.description,price:p.price_dzd,cat:p.category,icon:p.icon}));render()}}catch(e){console.warn('Supabase catalog unavailable; using local catalog.',e)}}
const cartBtn=document.getElementById('cartBtn');if(cartBtn)cartBtn.onclick=openCart;
const closeCart=document.getElementById('closeCart');if(closeCart)closeCart.onclick=()=>{const m=document.getElementById('cartModal');m.classList.remove('show');m.setAttribute('aria-hidden','true')};
const checkout=document.getElementById('checkout');if(checkout)checkout.onclick=()=>location.href='checkout.html';
renderCategories();render();loadCatalog();
