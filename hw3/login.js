// import vue ES Module
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.3/vue.esm-browser.min.js';

const structure = {
  data(){
    return {
      url:'https://vue3-course-api.hexschool.io/v2',
      user:{
        username:'',
        password:'',
      },
      // msg: '',
      // showAlertModal: false,
    }
  },
  methods:{
    login(){
      console.log(this.user);
      axios.post(`${this.url}/admin/signin`, this.user)
          .then(res => {
            alert(res.data.message);//成功
            // this.msg = res.data.message;
            // this.showAlertModal = true;
            
            const {token, expired} = res.data;

            // 將Token、expired 儲存到Cookie(key-value)
            document.cookie = `wingToken=${token}; expires=${new Date(expired)}`;

            // 跳轉至product.html => 身份驗證, 驗證此人是否有access product.html的權限
            window.location = 'product.html';
            
          })
          .catch(error => {
            alert(error.data.error.message);
            // this.msg = error.data.error.message;
            // this.showAlertModal = true;
          })
    }
  },
  // mounted(){
  //   console.log('mounted');
  // }
}

const vueInstance = createApp(structure);
vueInstance.mount('#app');