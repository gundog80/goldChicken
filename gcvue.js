// 便當調度紀錄 2.0
const App=Vue.createApp({
    data(){
        return{
            page:"輸入頁面",
            select_menu:[],
            page_list:['輸入頁面','統計頁面','固定資料'],
            type:['到貨','調入','調出','剩餘'],
            selected_data:[],
            spot:"",
            id_5:"",
            renew:"",
            product:{
                折扣10元:  {name:"折扣10元",price:-10 },
                雞肉:  {name:"雞肉",price:90 },
                雞腿:  {name:"雞腿",price:100 },
                三杯雞:  {name:"三杯雞",price:100 },
                排骨:  {name:"排骨",price:100 },
                瓜仔肉:{name:"瓜仔肉",price:90},
                左宗棠雞丁:{name:"左宗棠雞丁",price:100},
                豬腳:{name:"豬腳",price:110},
                雙拼:{name:"雙拼",price:110},
                打拋豬:{name:"打拋豬",price:110},
                烤肉:{name:"烤肉",price:100},
                舒肥雞:{name:"舒肥雞",price:100},
                赤燒肉:{name:"赤燒肉",price:100},
                其它_90:{name:"其它_90",price:90},
                其它_100:{name:"其它_100",price:100},
                其它_110:{name:"其它_110",price:110},
                // 獅子頭:{name:"獅子頭",price:110},

            },
            // selected_data:{},
            input:{
                io:"到貨",
            },
            preset_quantity:3,
        };
    },
    methods:{
        reduceN(index){
            this.selected_data[index].quanity -= 1;
        },
        addN(index){
            this.selected_data[index].quanity += 1;
        },
        set_selected_quanity(i){
				for(let key in this.selected_data){
					this.selected_data[key].quanity=i;
				};
        },
        set_item_quanity(index){
            console.log(index);
				this.selected_data[index].quanity=this.preset_quantity;
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
                // if(Date(od.time)<Date(delTime)){
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
            let SbTq=0;
            newData.type=this.input.io;
            this.select_menu.forEach(pd=>{
                newData[pd]=this.selected_data[pd];
                subtotal+= newData[pd].price * newData[pd].quanity;
                SbTq+= Number(newData[pd].quanity);
            });
            newData.subtotal=subtotal;
            newData.SbTq=SbTq;
            let nowTime=new Date();
            
            newData.time=nowTime.toString();
            // App.$set(this,'saveData',this.getSaveData());
            this.saveData=this.getSaveData();
            this.saveData.push(newData);
            this.saveData=this.chkSaveData(this.saveData,nowTime);
            localStorage.convenientSchedule=JSON.stringify(this.saveData);
            this.select_menu=[];
				// this.cy(0);
        },
        ttonclick(){
            let nowTime=new Date();
            this.today= nowTime.getMonth()+1 +"/" + nowTime.getDate();
            this.load_person();
            this.showTotal="n";
            this.total=0;
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
        load_person(){
            if(localStorage.gc_person){
                let temp=JSON.parse(localStorage.gc_person);
                this.spot=temp[0];
                this.id_5=temp[1];
            }else{
                temp=["",""];
                this.spot=temp[0];
                this.id_5=temp[1];
            }
        },
        cat_total(){
            this.renew="更新中";
            this.total=0;
            this.total_price={};
            this.total_project={};
            // console.log(this.saveData);
            this.saveData.forEach(i=>{
                
                switch (i.type){
                    // case "調入"||"到貨":
                    case "調入":
                    case "到貨":
                        
                        this.total+=i.subtotal;
                        Object.entries(i).forEach(j=>{
                            if(['time','type','subtotal','SbTq'].includes(j[0])){}
                            else{
                                let k= '$' + j[1].price;
                                if(typeof this.total_price[k] === 'undefined'){
                                    this.total_price[k]=parseInt(j[1].quanity);
                                }else{
                                    this.total_price[k]+=parseInt(j[1].quanity);
                                };
                                let k2=j[1].name;
                                if(typeof this.total_project[k2] === 'undefined'){
                                    this.total_project[k2]=parseInt(j[1].quanity);
                                }else{
                                    this.total_project[k2]+=parseInt(j[1].quanity);
                                }
                            }
                        });
                        break;
                    case "調出":
                    case "剩餘":
                        console.log("hi total");
                        this.total-=i.subtotal;
                        Object.entries(i).forEach(j=>{
                            if(['time','type','subtotal','SbTq'].includes(j[0])){}
                            else{
                                let k='$'+j[1].price;
                                if(typeof this.total_price[k] === 'undefined'){
                                    this.total_price[k]=-j[1].quanity;
                                }else{
                                    this.total_price[k]-=j[1].quanity;
                                };
                                let k2=j[1].name;
                                if(typeof this.total_project[k2] === 'undefined'){
                                    this.total_project[k2]=-j[1].quanity;
                                }else{
                                    this.total_project[k2]+=-j[1].quanity;
                                }
                            }
                        });
                        // set_selected_quanit
                    break;
                    default :
                    break;
                };
					//  console.log(this.price);
            });
            // console.log(this.total);
            this.renew="";
            this.otherTotal=false;
            this.showTotal=1;
        },
        cat_other(){
            this.renew="更新中";
            this.total=0;
            this.total_other={};
            this.saveData.forEach(i=>{
                this.total+=parseInt(i.subtotal);
                switch (i.type){
                    // case "調入"||"到貨":
                    case "其它":
                        Object.entries(i).forEach(j=>{
                            if(['time','type','subtotal','SbTq'].includes(j[0])){}
                            else{
                                let k3=j[1].name;
                                if(typeof this.total_other[k3] === 'undefined'){
                                    this.total_other[k3]=parseInt(j[1].quanity);
                                }else{
                                    this.total_other[k3]+=parseInt(j[1].quanity);
                                }
                            }
                        });
                        break;
   
                    default :
                    break;
                };
					//  console.log(this.price);
            });
            // console.log(this.total);
            this.renew="";
            this.showTotal=false;
            this.otherTotal=1;
        },
        save_person(){
            let temp=[this.spot,this.id_5];
            localStorage.gc_person=JSON.stringify(temp);
        },

        getCopy(index){
            let temp=this.saveData[index];
            let copytext=this.spot + " " + temp.SbTq + "  ($" + temp.subtotal + ")";
            console.log(copytext);
            // let copArea=document.getElementById('copArea');
            // copArea.innerText=copytext;
            
            //選取 限定input
            // copArea.setAttribute('value',copytext);
            // copArea.focus();
            // copArea.select();

            // 選取 通用
            // let range, selection;
            // if (document.body.createTextRange) {    //僅ie
            //     range = document.body.createTextRange();
            //     range.moveToElementText(copArea);
            //     console.log('range');
            //     console.log(range);
            //     range.select();
            // } else if (window.getSelection) {   //可能只有windows 待測試
            //   selection = window.getSelection();
            //   range = document.createRange();
            //   range.selectNodeContents(copArea);
            //   selection.removeAllRanges();
            //   selection.addRange(range);
            // };
            // Document.execCommand('copy');

            if(navigator.clipboard && window.isSecureContext){
                navigator.clipboard.writeText(copytext)
                .then(function(){alert('複製文字: '+ copytext)},
                    function(){alert('複製失敗 拜託回報')})
            }
            // alert('複製文字: '+ copytext);
        }
    },
    watch:{
        "selected_data['雞腿']":function(){
            console.log(11);
        },
    },
    beforeMount(){
		this.selected_data=JSON.parse(JSON.stringify(this.product));
		this.set_selected_quanity(0);
    }
})

App.mount('#App')