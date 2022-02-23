function selectpay() {
    const paymode = document.getElementById('type-pay');
    const orderbtn=document.getElementById('orderbtn')
    if (paymode) {
        paymode.addEventListener('change', () => {
            if(paymode.value==='Online'){
                orderbtn.style.backgroundColor='orangered';
                orderbtn.innerText='Pay Now'
                return 'Online'
            }
            else{
                orderbtn.style.backgroundColor='orangered'
                orderbtn.innerText='Cash on delivery'
                return 'COD'
            }
            
        })
    }

}
export { selectpay };