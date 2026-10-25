export const products = [
  {id:'ethiopia',name:'埃塞 · 花与柑橘',flavor:'茉莉 · 柑橘 · 蜂蜜',category:'single',price:88,origin:'埃塞俄比亚',roast:'浅烘焙',photo:0},
  {id:'blend',name:'日常 · 醇厚拼配',flavor:'黑巧 · 坚果 · 焦糖',category:'blend',price:76,origin:'巴西 / 哥伦比亚',roast:'中深烘焙',photo:1},
  {id:'colombia',name:'哥伦比亚 · 红果',flavor:'莓果 · 可可',category:'single',price:92,origin:'哥伦比亚',roast:'中浅烘焙',photo:2},
  {id:'brazil',name:'巴西 · 暖阳',flavor:'榛果 · 奶油',category:'single',price:68,origin:'巴西',roast:'中烘焙',photo:3}
];
export const beanTypes={
  filter:{label:'手冲豆',weights:[50,100],grinds:['咖啡豆','手冲研磨']},
  espresso:{label:'意式豆',weights:[250,1000],grinds:['咖啡豆','意式研磨']}
};
export const weightLabel=weight=>weight===1000?'1kg':`${weight}g`;
export function defaultSku(id){const p=products.find(p=>p.id===id);const beanType=p?.category==='blend'?'espresso':'filter';return {beanType,weight:beanTypes[beanType].weights[0],grind:'咖啡豆'};}
export function validSku(sku){const type=beanTypes[sku?.beanType];return !!type&&type.weights.includes(sku.weight)&&type.grinds.includes(sku.grind);}
// Demo prices scale from the earlier 200g reference; replace with the merchant's SKU prices before launch.
export function unitPrice(id,sku){const p=products.find(p=>p.id===id);return p&&validSku(sku)?Math.round(p.price*100*sku.weight/200)/100:0;}
export const skuLabel=sku=>`${beanTypes[sku.beanType]?.label||'咖啡豆'} · ${weightLabel(sku.weight)} · ${sku.grind}`;
export const GROUP_DURATION_MS=10*24*60*60*1000;
export const validGroupTarget=weight=>Number.isInteger(weight)&&weight>=400&&weight<=1000&&weight%50===0;
export function groupStatus(group,now=Date.now()){
  if(group.paidWeight>=group.targetWeight)return 'formed';
  return now>=group.expiresAt?'expired':'open';
}
function normalizeGroup(group,now){
  group.id??='demo-group';group.productId??=products[0].id;group.initialMembers??=2;
  group.createdAt??=now;group.expiresAt??=group.createdAt+GROUP_DURATION_MS;
  group.participations??=[];return group;
}
export function createState(now=Date.now()){
  const group=normalizeGroup({paidWeight:200,targetWeight:400,joined:false,participations:[]},now);
  return {cart:[{id:'ethiopia',...defaultSku('ethiopia'),unitPrice:22,qty:1,selected:true},{id:'blend',...defaultSku('blend'),unitPrice:95,qty:1,selected:true}],orders:[],group,groups:[group],address:{name:'林先生',phone:'13800000000',detail:'上海市 静安区 示例路 18 号'},delivery:'快递配送'};
}
export function migrateState(saved){if(!saved?.state||![1,2,3].includes(saved.version))return createState();const s=saved.state;if(!Array.isArray(s.cart)||!Array.isArray(s.orders)||!s.group||!s.address)return createState();if(saved.version===1){s.cart=s.cart.filter(i=>products.some(p=>p.id===i.id)).map(i=>{const sku=defaultSku(i.id);if(beanTypes[sku.beanType].grinds.includes(i.grind))sku.grind=i.grind;return {...i,...sku,unitPrice:unitPrice(i.id,sku)};});s.orders=s.orders.map(o=>({...o,items:o.items.map(i=>({...i,weight:200,beanType:i.grind==='意式研磨'?'espresso':'filter',unitPrice:products.find(p=>p.id===i.id)?.price||0}))}));}const now=Date.now();s.groups=(Array.isArray(s.groups)&&s.groups.length?s.groups:[s.group]).map(g=>normalizeGroup(g,now));s.group=s.groups.find(g=>g.id===s.group.id)||s.groups[0];return s;}
const quantity=value=>Math.max(0,Math.min(99,Math.floor(Number(value)||0)));
export function addItem(state,id,sku,qty=1){if(!products.some(p=>p.id===id)||!validSku(sku)||!quantity(qty))return false;const found=state.cart.find(i=>i.id===id&&i.beanType===sku.beanType&&i.weight===sku.weight&&i.grind===sku.grind);if(found){found.qty=quantity(found.qty+quantity(qty));found.selected=true;}else state.cart.push({id,beanType:sku.beanType,weight:sku.weight,grind:sku.grind,unitPrice:unitPrice(id,sku),qty:quantity(qty),selected:true});return true;}
export function setQty(state,index,qty){if(!state.cart[index])return;const n=quantity(qty);if(!n)state.cart.splice(index,1);else state.cart[index].qty=n;}
export function toggleItem(state,index){if(state.cart[index])state.cart[index].selected=!state.cart[index].selected;}
export function toggleAll(state){const next=!state.cart.every(i=>i.selected);state.cart.forEach(i=>i.selected=next);}
export function cartTotals(state){const t=state.cart.reduce((t,i)=>{t.count+=i.qty;if(i.selected){t.selectedCount+=i.qty;t.cents+=Math.round(i.unitPrice*100)*i.qty;}return t;},{count:0,selectedCount:0,cents:0});return {count:t.count,selectedCount:t.selectedCount,subtotal:t.cents/100};}
export function checkout(state,delivery){if(!['快递配送','到店自提','同城配送'].includes(delivery))return null;const t=cartTotals(state);if(!t.selectedCount)return null;const order={id:`AD${Date.now()}${state.orders.length}`,items:state.cart.filter(i=>i.selected).map(i=>({...i})),subtotal:t.subtotal,delivery,status:'待发货',createdAt:new Date().toISOString()};state.orders.push(order);state.cart=state.cart.filter(i=>!i.selected);state.delivery=delivery;return order;}
export function createGroup(state,productId,targetWeight,sku,qty=1,now=Date.now()){
  if(!products.some(p=>p.id===productId)||!validGroupTarget(targetWeight)||!validSku(sku)||!Number.isInteger(qty)||qty<1||qty>99||sku.weight*qty>targetWeight)return null;
  const group={id:`group-${now}-${state.groups.length}`,productId,targetWeight,paidWeight:sku.weight*qty,joined:true,initialMembers:0,createdAt:now,expiresAt:now+GROUP_DURATION_MS,participations:[{id:productId,beanType:sku.beanType,weight:sku.weight,grind:sku.grind,qty,unitPrice:unitPrice(productId,sku)}]};
  state.groups.push(group);state.group=group;return group;
}
export function joinGroup(state,sku,qty=1,now=Date.now()){
  if(!validSku(sku)||!Number.isInteger(qty)||qty<1||qty>99||groupStatus(state.group,now)!=='open')return false;
  const weight=sku.weight*qty;if(state.group.paidWeight+weight>state.group.targetWeight)return false;
  state.group.paidWeight+=weight;state.group.joined=true;state.group.participations??=[];
  state.group.participations.push({id:state.group.productId,beanType:sku.beanType,weight:sku.weight,grind:sku.grind,qty,unitPrice:unitPrice(state.group.productId,sku)});return true;
}
export function refundOrder(state,id){const order=state.orders.find(o=>o.id===id);if(!order||order.status!=='待发货')return false;order.status='已退款';return true;}
