function admin() {
    const orderTablebasy=document.querySelector('orderTableBody');
    let order=[]
    let markup
    axios.get('/admin',{
        Headers:{
            "X-Requested-With":"XMLHttpRequest"
        }
    }).then(res=>{
        orders=res.data
        markup=generateMarkup(orders)
        orderTablebasy.innerHTML=markup
    }).catch(err=>{
        console.log(err)
    })

    

}
module.exports=admin;