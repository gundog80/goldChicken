const App=Vue.createApp({
    data(){
        return{
            page:"輸入頁面",
            select_menu:[],
            type:['到貨','調入','調出','剩餘'],
            renew:"",
            product:{
                雞肉:  {name:"雞肉",price:90 },
                雞腿:  {name:"雞腿",price:100 },
                排骨:  {name:"排骨",price:100 },
                瓜仔肉:{name:"瓜仔肉",price:90},
                左宗棠雞丁:{name:"左宗棠雞丁",price:100},
                豬腳:{name:"豬腳",price:110},
                雙拼:{name:"雙拼",price:110},
                打拋豬:{name:"打拋豬",price:110},
                烤肉:{name:"烤肉",price:100},
                舒肥雞:{name:"舒肥雞",price:100},
                赤燒肉:{name:"赤燒肉",price:100},
            },
            // selected_data:{},
            input:{
                io:"調入",
            }
        };
    },
    methods:{
        set_selected_quanity(i){
				for(let key in this.selected_data){
					this.selected_data[key].quanity=i;
				};

        },
        getSaveData(){
            // let saveData=[];
            let saveData=[];
            if(localStorage.convenientSchedule){
                saveData=JSON.parse(localStorage.convenientSchedule);
            }
            return saveData;
        },
        chkSaveData(saveArr,nowTime){
            let delTime=new Date(nowTime.getFullYear(),nowTime.getMonth(),nowTime.getDate());
            // console.log(saveArr);
            let delArr=[]
            saveArr.forEach((od,i)=>{
                if(Date.parse(od.time)<Date.parse(delTime)){
                // if(Date.parse(od.time)<Date.parse('2022-06-09T15:33:22.223Z')){
                    delArr.push(i);
                }
            });
            console.log(delArr);
            let k=delArr.length;
            for(i=0;i<k;i++){
               let maxSite=Math.max(...delArr);
               saveArr.splice(maxSite,1);
               let t=delArr.indexOf(maxSite);
               delArr.splice(t,1)
           };
           return saveArr;
        },
        save(){
            let newData={};
            let subtotal=0;
            newData.type=this.input.io;
            this.select_menu.forEach(pd=>{
                newData[pd]=this.selected_data[pd];
                subtotal+= newData[pd].price * newData[pd].quanity;
            });
            newData.subtotal=subtotal;
            let nowTime=new Date();
            
            newData.time=nowTime;
            // App.$set(this,'saveData',this.getSaveData());
            this.saveData=this.getSaveData();
            this.saveData.push(newData);
            this.saveData=this.chkSaveData(this.saveData,nowTime);
            localStorage.convenientSchedule=JSON.stringify(this.saveData);
            this.select_menu=[];
				this.set_selected_quanity(1);
        },
        ttonclick(){
            let nowTime=new Date();
            this.saveData=this.getSaveData();
            console.log(this.saveData);
            this.saveData=this.chkSaveData(this.saveData,nowTime)
            localStorage.convenientSchedule=JSON.stringify(this.saveData);
            this.price={};
        },
        delSave(i){
            //刪除單筆資料
            this.renew="更新中";
            this.saveData.splice(i,1);
            this.saveData=this.saveData.splice(0,100);
            this.total="";
            this.renew="";
            localStorage.convenientSchedule=JSON.stringify(this.saveData);
        },
        cat_total(){
            this.total=0;
            // this.price=[];
				this.price={};
            this.saveData.forEach(i=>{
                switch (i.type){
                    // case "調入"||"到貨":
                    case "調入":
                    case "到貨":
                        this.total+=i.subtotal;
                        Object.entries(i).forEach(j=>{
                            if(['time','type','subtotal'].includes(j[0])){}
                            else{
                                let k='$'+j[1].price;
                                if(typeof this.price[k] === 'undefined'){
                                    this.price[k]=parseInt(j[1].quanity);
                                }else{
                                    this.price[k]+=parseInt(j[1].quanity);
                                }
                            }
                        });
                        break;
                    case "調出":
                    case "剩餘":
                        this.total-=i.subtotal;
                        Object.entries(i).forEach(j=>{
                            if(['time','type','subtotal'].includes(j[0])){}
                            else{
                                let k='$'+j[1].price;
                                if(typeof this.price[k] === 'undefined'){
                                    this.price[k]=-j[1].quanity;
                                }else{
                                    this.price[k]-=j[1].quanity;
                                }
                            }
                        });
                    break;
                    default :
                    break;
                }
					 console.log(this.price)
            });
            this.renew="更新中";
            console.log(this.total);
            this.renew="";
        },
    },
    beforeMount(){
		this.selected_data=JSON.parse(JSON.stringify(this.product));
		this.set_selected_quanity(1);
    }
})
// App.component('inputtype',{
// 	props:['type'],
// 	data(){
// 		return{}
// 	},
// 	template:`<input type='radio' class="btn-check" name="ioradio" id="ioradio-s"
// 	value="到貨" v-model="input.io">
// 	<label class="btn btn-outline-primary" for="ioradio-i">調入</label>`,
// });
App.mount('#App')