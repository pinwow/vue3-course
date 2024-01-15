// import vue ES Module
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.3/vue.esm-browser.min.js';


const obj = {
  data(){
    return{
      url: 'https://vue3-course-api.hexschool.io/v2',
      path: 'wingxox',
      dessert:[],
      temp:{},
    }
  },
  methods:{
    check(){
      //5.取出 key=wingToken 的 cookie
      const myToken = document.cookie.replace(/(?:(?:^|.*;\s*)wingToken\s*\=\s*([^;]*).*$)|^.*$/,"$1");
      axios.post(`${this.url}/api/user/check`, null, {
        headers:{
          authorization:myToken
        }})
          .then(res => {
            //6.取得產品列表
            this.getProducts()
          })
          .catch(error => {
            // console.log(error);
            alert(error.response.data.message);
            history.back();//回到登入頁面
          });
    },
    getProducts(){
      const myToken = document.cookie.replace(/(?:(?:^|.*;\s*)wingToken\s*\=\s*([^;]*).*$)|^.*$/,"$1");
      axios.get(`${this.url}/api/${this.path}/admin/products`,{
        headers:{
          authorization:myToken
        }})
           .then(res => {
            console.log(res.data.products[0]);
            this.dessert = res.data.products;
            // console.log(this.products);
           })
           .catch(error => {
            console.log(error);
           });
    },
    
  },
  mounted(){
    //4.驗證使用者, 驗證是否有瀏覽(access)後台的權限
    this.check();
  }
}
const vueInstance = createApp(obj);
vueInstance.mount('#app');


