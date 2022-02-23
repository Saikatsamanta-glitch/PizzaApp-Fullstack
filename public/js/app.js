let addtoCart=document.querySelectorAll('.add-to-cart');
let count=document.querySelectorAll('.add');
let counter=document.querySelector('#cartcounter');
import {selectpay} from './selectpay.js';
selectpay()

// import {admin} from './admin';



function updatecart(pizza){
    // 
    axios.post('/update-cart',pizza).then((res)=>{
        // console.log(res)
        counter.innerText=res.data.totalQty;
    
    });
}
addtoCart.forEach((btn)=>{
   let store=[];
   let c=0
    btn.addEventListener('click',(e)=>{
        let pizza=JSON.parse(btn.dataset.pizza);
        
        
        let index=btn.dataset.index;
        // console.log(pizza);
        store.push(pizza._id);
        // Calculate number of occurance 
        const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
        let c=countOccurrences(store, pizza._id);     
        
        count[index].innerText=c;
        updatecart(pizza);
    })
});




// admin();
console.log('hi')
