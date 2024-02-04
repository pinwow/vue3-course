// import vue ES Module
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.3/vue.esm-browser.min.js';

//0. 取出 key=wingToken 的 cookie
const myToken = document.cookie.replace(/(?:(?:^|.*;\s*)wingToken\s*\=\s*([^;]*).*$)|^.*$/,"$1");
const token = {
  headers: {
    authorization:myToken
  }
}
const baseUrl = 'https://vue3-course-api.hexschool.io/v2';
const path =  'wingxox' ;

let productModal = ''; //建立新的產品 modal, 必須宣告在全域, 才可被 openModal() 取用
let delProductModal = '';

const structure = {
  data(){
    return {
      products: [],
      isAdd: false,     //是否為新增
      tempProduct: {},
    }
  },
  methods:{
    getAll(){
      axios.get(`${baseUrl}/api/${path}/admin/products`, token)
          .then(res=>{
            this.products = res.data.products;
          })
          .catch(error=>{
            console.log(error);
          })
    },
    openModal(status, item){
      console.log(status, item);
      
      if(status == 'add'){
        this.isAdd = true;
        this.tempProduct = {};
        productModal.show();
      }
      if(status == 'edit'){
        this.isAdd = false;
        // this.tempProduct = {...item}; // ?
        this.tempProduct = item; 
        productModal.show();
      }
      if(status == 'delete'){
        this.tempProduct = item; 
        delProductModal.show();
      }
    },
    save(){
      if(this.isAdd){ //create
        const url = `${baseUrl}/api/${path}/admin/product`;
        const param = {
          data: this.tempProduct
        }
        axios.post(url, param, token)
             .then(res => {
              alert(res.data.message); //已建立產品
              productModal.hide();
              this.getAll();
             })
             .catch(error => {
              console.log(error);
             })
        
      }else{ //edit
        const url = `${baseUrl}/api/${path}/admin/product/${this.tempProduct.id}`;
        // console.log(url);
        const param = {
          data: this.tempProduct
        }
        axios.put(url, param, token)
             .then(res =>{
              alert(res.data.message); //已更新產品
              productModal.hide();
              this.getAll();
             })
             .catch(error => {
              console.log(error);
             })
      }
    },
    remove(){
      const url = `${baseUrl}/api/${path}/admin/product/${this.tempProduct.id}`;
      axios.delete(url, token)
          .then(res =>{
            alert(res.data.message); //已刪除產品
            delProductModal.hide();
            this.getAll();
          })
          .catch(error => {
          console.log(error);
          });
    }
    
  },
  mounted(){
    //取得 modal DOM 元素 => new bootstrap modal instance => call show()
    productModal = new bootstrap.Modal(document.querySelector('#productModal'), {keyboard:false, backdrop: 'static'});
    delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'), {keyboard:false, backdrop: 'static'});

    //keyboard:false     => 禁止使用Esc關閉modal
    //backdrop: 'static' => 禁止點擊modal以外區域來關閉modal, 可避免輸入到一半資料遺失



    //1. 身份驗證
    // console.log(token);
    axios.post(`${baseUrl}/api/user/check`, null, token)
        .then(res => {
          //2. 顯示產品列表
          this.getAll();
        })
        .catch(error => {
          alert(error.data.message);
          // alert(`無訪問權限, 請改用其他組帳號密碼登入`);
          window.location = 'login.html'; //回到登入頁面
        });
    
    
  }
}

const vueInstance = createApp(structure);
vueInstance.mount('#app');