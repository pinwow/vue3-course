// import vue ES Module
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.3/vue.esm-browser.min.js';
    
const obj = {
  data(){
    return {
      url:'https://vue3-course-api.hexschool.io/v2',
      user:{
        username:'',
        password:'',
      }
    }
  },
  methods:{
    //1.登入
    login(){
      axios.post(`${this.url}/admin/signin`, this.user)
          .then(res => {
            // console.log(res);
            alert(res.data.message);
    
            const {token, expired} = res.data;
            console.log(token, expired);
    
            //2. 將Token、expired 儲存到Cookie(key-value)
            // 建立一個cookie 名稱叫做 wingToken, 其值是token, 並設定token有效日期
            document.cookie = `wingToken=${token}; expires=${new Date(expired)}`;
    
            //3.跳轉至product.html
            window.location = 'product.html';
          })
          .catch(error => {
            alert(error.data.error.message);
          })
    }
  },
  mounted(){
  }
}

const vueInstance = createApp(obj);
vueInstance.mount('#app');


