// import vue ES Module
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.3/vue.esm-browser.min.js';

const baseUrl = 'https://vue3-course-api.hexschool.io/v2';
const path =  'wingxox' ;

let modalEdit = '';    //新增編輯modal, 必須宣告在全域, 才可被 openModal() 取用
let modalDel = '';     //刪除modal

const structure = {
  data(){
    return {
      products: [],
      isAdd: false,      //是否為新增
      tempProduct: {},
    }
  },
  methods:{
    getAll(){
      //products 有分頁 ; products/all 沒分頁
      axios.get(`${baseUrl}/api/${path}/admin/products`)
          .then(res=>{
            this.products = res.data.products;
          })
          .catch(error=>{
            console.log(error);
          })
    },
    openModal(status, item){
      // console.log(status, item);
      
      if(status == 'add'){
        this.isAdd = true;
        this.tempProduct = {
          imgUrls: []
        };
        modalEdit.show();
      }
      if(status == 'edit'){
        this.isAdd = false;
        this.tempProduct = {...item}; 
        // 要淺拷貝，否則修改 modal 時，資料會直接存入原始資料中，按取消再重新點入，取消修改的資料都還會在😱
        // this.tempProduct = item; 

        //原本不一定有設置多張圖片
        if(!Array.isArray(this.tempProduct.imgUrls)){
          this.tempProduct.imgUrls = [];
        }

        modalEdit.show();
      }
      if(status == 'delete'){
        this.tempProduct = item; 
        modalDel.show();
      }
    },
    save(){
      if(this.isAdd){ //create
        const url = `${baseUrl}/api/${path}/admin/product`;
        const param = {
          data: this.tempProduct
        }
        axios.post(url, param)
             .then(res => {
                alert(res.data.message); //已建立產品
                modalEdit.hide();
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
        axios.put(url, param)
             .then(res =>{
                alert(res.data.message); //已更新產品
                modalEdit.hide();
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
            modalDel.hide();
            this.getAll();
          })
          .catch(error => {
          console.log(error);
          });
    },
    addImage(){}
  },
  mounted(){
    //0. 取出 key=wingToken 的 cookie, 並將token設定在global, 這樣就不用每次發請求都要撰寫 header
    const myToken = document.cookie.replace(/(?:(?:^|.*;\s*)wingToken\s*\=\s*([^;]*).*$)|^.*$/,"$1");
    axios.defaults.headers.common['Authorization'] = myToken;

    //1. 身份驗證
    // console.log(token);
    axios.post(`${baseUrl}/api/user/check`, null)
        .then(res => {
          //2. 顯示產品列表
          this.getAll();
        })
        .catch(error => {
          console.log(error);
          alert(error.data.message);
          // alert(`無訪問權限, 請改用其他組帳號密碼登入`);
          window.location = 'login.html'; //回到登入頁面
        });
    

    //取得 modal DOM 元素 => new bootstrap modal instance => call show()
    modalEdit = new bootstrap.Modal(document.querySelector('#productModal'), {keyboard:false, backdrop: 'static'});
    modalDel = new bootstrap.Modal(document.querySelector('#delProductModal'), {keyboard:false, backdrop: 'static'});

    //keyboard:false     => 禁止使用Esc關閉modal
    //backdrop: 'static' => 禁止點擊modal以外區域來關閉modal, 可避免輸入到一半資料遺失

    //refs 寫法
    // console.log(this.$refs); //輸出 ref="productModal" 及 ref="delProductModal"
    // modalEdit = new bootstrap.Modal(this.$refs.productModal, {keyboard:false, backdrop: 'static'});
    // modalDel = new bootstrap.Modal(this.$refs.delProductModal, {keyboard:false, backdrop: 'static'});

    //🔥 js中取用屬性/方法，可使用點.或中括號[]
    //下面兩個為同等寫法
    // axios.get('https://api.example.com/data');
    // axios['get']('https://api.example.com/data');

  }
}

const vueInstance = createApp(structure);
vueInstance.mount('#app');