import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,addItem,setQty,toggleItem,toggleAll,cartTotals,checkout,joinGroup,refundOrder,beanTypes,defaultSku,validSku,unitPrice,migrateState,createGroup,groupStatus,GROUP_DURATION_MS,validGroupTarget} from './store.mjs';
const filter50={beanType:'filter',weight:50,grind:'咖啡豆'};
const filter100={beanType:'filter',weight:100,grind:'手冲研磨'};
const espresso1k={beanType:'espresso',weight:1000,grind:'意式研磨'};
test('only dependent weight and grind combinations are accepted',()=>{
 assert.deepEqual(beanTypes.filter.weights,[50,100]);assert.deepEqual(beanTypes.espresso.weights,[250,1000]);
 assert.equal(validSku(filter100),true);assert.equal(validSku(espresso1k),true);
 assert.equal(validSku({...filter50,weight:250}),false);assert.equal(validSku({...espresso1k,grind:'手冲研磨'}),false);
 assert.equal(validSku({...filter50,grind:'意式研磨'}),false);assert.equal(unitPrice('ethiopia',filter50),22);assert.equal(unitPrice('ethiopia',filter100),44);assert.equal(unitPrice('blend',espresso1k),380);
});
test('initial totals and selection do not alter group weight',()=>{const s=createState();assert.deepEqual(cartTotals(s),{count:2,selectedCount:2,subtotal:117});toggleItem(s,0);assert.equal(cartTotals(s).subtotal,95);toggleAll(s);assert.equal(cartTotals(s).subtotal,117);toggleAll(s);assert.equal(checkout(s,'快递配送'),null);assert.equal(s.group.paidWeight,200);});
test('same complete SKU merges; bean type, weight and grind remain distinct',()=>{const s=createState();addItem(s,'ethiopia',filter50,2);addItem(s,'ethiopia',filter100,1);addItem(s,'ethiopia',{...filter50,grind:'手冲研磨'},1);addItem(s,'ethiopia',{beanType:'espresso',weight:250,grind:'咖啡豆'},1);assert.equal(s.cart.length,5);assert.equal(s.cart[0].qty,3);assert.equal(cartTotals(s).subtotal,337);assert.equal(addItem(s,'unknown',filter50,1),false);assert.equal(addItem(s,'ethiopia',{...filter50,weight:250},1),false);});
test('quantity bounds and deletion',()=>{const s=createState();setQty(s,0,200);assert.equal(s.cart[0].qty,99);setQty(s,0,0);assert.equal(s.cart.length,1);setQty(s,20,2);assert.equal(cartTotals(s).subtotal,95);});
test('checkout snapshots selected SKU and price and leaves unselected cart',()=>{const s=createState();toggleItem(s,0);assert.equal(checkout(s,'invalid'),null);const o=checkout(s,'到店自提');assert.equal(o.subtotal,95);assert.equal(o.items[0].weight,250);assert.equal(o.items[0].beanType,'espresso');assert.equal(o.items[0].unitPrice,95);assert.equal(o.status,'待发货');assert.equal(s.cart[0].id,'ethiopia');assert.equal(s.group.paidWeight,200);assert.equal(checkout(s,'快递配送'),null);assert.equal(refundOrder(s,o.id),true);assert.equal(o.status,'已退款');assert.equal(refundOrder(s,o.id),false);});
test('group accumulates paid selected weights without consuming cart or overflowing',()=>{const s=createState(),before=JSON.stringify(s.cart);assert.equal(joinGroup(s,filter50,1),true);assert.equal(s.group.paidWeight,250);assert.equal(joinGroup(s,filter100,1),true);assert.equal(s.group.paidWeight,350);assert.equal(joinGroup(s,filter100,1),false);assert.equal(s.group.paidWeight,350);assert.equal(joinGroup(s,filter50,1),true);assert.equal(s.group.paidWeight,400);assert.equal(joinGroup(s,filter50,1),false);assert.equal(joinGroup(s,espresso1k,1),false);assert.equal(s.group.participations.length,3);assert.equal(JSON.stringify(s.cart),before);});
test('migrate previous demo cart to valid new specs but preserve historical order snapshots',()=>{const old={version:1,state:{...createState(),cart:[{id:'ethiopia',grind:'手冲研磨',qty:2,selected:true}],orders:[{id:'old',items:[{id:'ethiopia',grind:'咖啡豆',qty:1}],subtotal:88}]}};const s=migrateState(old);assert.equal(s.cart[0].weight,50);assert.equal(s.cart[0].grind,'手冲研磨');assert.equal(cartTotals(s).subtotal,44);assert.equal(s.orders[0].items[0].weight,200);assert.equal(s.orders[0].items[0].unitPrice,88);assert.equal(s.orders[0].subtotal,88);assert.equal(defaultSku('blend').weight,250);});

test('group goal accepts 400–1000g in 50g steps and never creates an invalid draft',()=>{
 const s=createState(),count=s.groups.length;
 for(const n of [400,450,700,1000])assert.equal(validGroupTarget(n),true);
 for(const n of [399,1001,425,NaN,'500'])assert.equal(validGroupTarget(n),false);
 assert.equal(createGroup(s,'ethiopia',425,filter50),null);assert.equal(createGroup(s,'missing',600,filter50),null);
 assert.equal(createGroup(s,'ethiopia',400,espresso1k),null);assert.equal(s.groups.length,count);
});
test('paid creation preserves previous group and starts an exact ten-day deadline',()=>{
 const now=1700000000000,s=createState(now),previous=s.group;
 const g=createGroup(s,'colombia',1000,filter100,2,now);
 assert.equal(g.productId,'colombia');assert.equal(g.targetWeight,1000);assert.equal(g.paidWeight,200);
 assert.equal(g.initialMembers,0);assert.equal(g.joined,true);assert.equal(g.expiresAt,now+864000000);
 assert.equal(GROUP_DURATION_MS,864000000);assert.equal(s.groups.length,2);assert.equal(s.groups[0],previous);assert.equal(s.group,g);
 assert.equal(previous.paidWeight,200);
});
test('expiry boundary rejects payment without mutating weight; formed groups stay formed',()=>{
 const now=1700000000000,s=createState(now);
 assert.equal(groupStatus(s.group,now),'open');assert.equal(joinGroup(s,filter50,1,now+GROUP_DURATION_MS-1),true);
 const before=JSON.stringify(s.group);assert.equal(groupStatus(s.group,now+GROUP_DURATION_MS),'expired');
 assert.equal(joinGroup(s,filter50,1,now+GROUP_DURATION_MS),false);assert.equal(JSON.stringify(s.group),before);
 s.group.paidWeight=s.group.targetWeight;assert.equal(groupStatus(s.group,now+GROUP_DURATION_MS),'formed');
});
test('reload keeps deadline, selected group identity, and a non-default target',()=>{
 const now=1700000000000,s=createState(now),g=createGroup(s,'brazil',700,filter50,1,now);
 const loaded=migrateState(JSON.parse(JSON.stringify({version:3,state:s})));
 assert.equal(loaded.group.id,g.id);assert.equal(loaded.group.targetWeight,700);assert.equal(loaded.group.expiresAt,now+864000000);
 assert.equal(loaded.group,loaded.groups[1]);assert.equal(groupStatus(loaded.group,now+864000000),'expired');
});
