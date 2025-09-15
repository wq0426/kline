<template>
	<view>	
		<u-navbar title="在线客服" back-icon-color="white" title-color="black"></u-navbar>

        <view style="margin-top: 0rpx;">
            <view class="content" @touchstart="hideDrawer" style="margin-top: 0rpx;">
            	<scroll-view class="msg-list" scroll-y="true" :scroll-with-animation="scrollAnimation" :scroll-top="scrollTop" :scroll-into-view="scrollToView" @scrolltoupper="loadHistory" upper-threshold="50">
            		<view class="row" v-for="(row,index) in msgList" :key="index" :id="'msg'+row.msg.id">
            			<!-- 系统消息 -->
            			<block v-if="row.msg.type==0" >
            				<view class="system">
            					<!-- 文字消息 -->
            					<view v-if="row.msg.type=='text'" class="text">
            						{{row.msg.content.text}}
            					</view>
            					<!-- 领取红包消息 -->
            					<view v-if="row.msg.type=='redEnvelope'" class="red-envelope">
            						<image src="/static/img/red-envelope-chat.png"></image>
            						{{row.msg.content.text}}
            					</view>
            				</view>
            			</block>
            			<!-- 用户消息 -->
            			<block v-else>
            				<!-- 自己发出的消息 -->
            				<view class="my" v-if="row.from.uid==myuid">
            					<!-- 左-消息 -->
            					<view class="left">
            						<!-- 文字消息 -->
            						<view v-if="row.msg.type==1" class="bubble">
            							<rich-text :nodes="row.msg.content"></rich-text>
            						</view>
            						<!-- 图片消息 -->
            						<view v-if="row.msg.type==2" class="bubble img" @tap="showPic(staticRoot+row.msg.content)">
            							<image :src="staticRoot+row.msg.content"></image>
            						</view>
            					</view>
            					<!-- 右-头像 -->
            					<view class="right">
            						<img referrerpolicy="no-referrer" :src="row.from.headimg"></img>
            					</view>
            				</view>
            				<!-- 别人发出的消息 -->
            				<view class="other" v-if="row.from.uid!=myuid">
            					<!-- 左-头像 -->
            					<view class="left">
            						<img referrerpolicy="no-referrer" :src="row.from.headimg"></img>
            					</view>
            					<!-- 右-用户名称-时间-消息 -->
            					<view class="right">
            						<view class="username">
            							<view class="name">{{row.from.nickname}}</view> <view class="time">{{row.msg.time}}</view>
            						</view>
            						<!-- 文字消息 -->
            						<view v-if="row.msg.type==1" class="bubble">
            							<rich-text :nodes="row.msg.content"></rich-text>
            						</view>
            						<!-- 图片消息 -->
            						<view v-if="row.msg.type==2" class="bubble img" @tap="showPic(staticRoot+row.msg.content)">
            							<image :src="staticRoot+row.msg.content"></image>
            						</view>
            					</view>
            				</view>
            			</block>
            		</view>
            	</scroll-view>
            </view>
            <!-- 抽屉栏 -->
            <view class="popup-layer" :class="popupLayerClass" @touchmove.stop.prevent="discard">
            	<!-- 表情 --> 
            	<swiper class="emoji-swiper" :class="{hidden:hideEmoji}" indicator-dots="true" duration="150">
            		<swiper-item v-for="(page,pid) in emojiList" :key="pid">
            			<view v-for="(em,eid) in page" :key="eid" @tap="addEmoji(em)">
            				<image mode="widthFix" :src="'/static/img/emoji/'+em.url"></image>
            			</view>
            		</swiper-item>
            	</swiper>
            	<!-- 更多功能 相册-拍照-红包 -->
            	<view class="more-layer" :class="{hidden:hideMore}">
            		<view class="list">
            			<view class="box" @tap="chooseImage"><view class="icon tupian2"></view></view>
            		</view>
            	</view>
            </view>
            <!-- 底部输入栏 -->
            <view class="input-box" :class="popupLayerClass" @touchmove.stop.prevent="discard">
            	<!-- H5下不能录音，输入栏布局改动一下 -->
            	<!-- #ifndef H5 -->
            	<view class="voice">
            		<view class="icon" :class="isVoice?'jianpan':'yuyin'" @tap="switchVoice"></view>
            	</view>
            	<!-- #endif -->
            	<!-- #ifdef H5 -->
            	<view class="more" @tap="showMore">
            		<view class="icon add"></view>
            	</view>
            	<!-- #endif -->
            	<view class="textbox">
            		<view class="voice-mode" :class="[isVoice?'':'hidden',recording?'recording':'']" @touchstart="voiceBegin" @touchmove.stop.prevent="voiceIng" @touchend="voiceEnd" @touchcancel="voiceCancel">{{voiceTis}}</view>
            		<view class="text-mode"  :class="isVoice?'hidden':''">
            			<view class="box">
            				<textarea auto-height="true" v-model="textMsg" @focus="textareaFocus"/>
            			</view>
            			<view v-if="false" class="em" @tap="chooseEmoji">
            				<view class="icon biaoqing"></view>
            			</view>
            		</view>
            	</view>
            	<!-- #ifndef H5 -->
            	<view class="more" @tap="showMore">
            		<view class="icon add"></view>
            	</view>
            	<!-- #endif -->
            	<view class="send" :class="isVoice?'hidden':''" @click="sendText">
            		<view style="background-color: #245c8b;color: white;padding: 10rpx 15rpx;border-radius: 10rpx;">发送</view>
            	</view>
            </view>
            <!-- 录音UI效果 -->
            <view class="record" :class="recording?'':'hidden'">
            	<view class="ing" :class="willStop?'hidden':''"><view class="icon luyin2" ></view></view>
            	<view class="cancel" :class="willStop?'':'hidden'"><view class="icon chehui" ></view></view>
            	<view class="tis" :class="willStop?'change':''">{{recordTis}}</view>
            </view>
            <!-- 红包弹窗 -->
            <view class="windows" :class="windowsState">
            	<!-- 遮罩层 -->
            	<view class="mask" @touchmove.stop.prevent="discard" @tap="closeRedEnvelope"></view>
            	<view class="layer" @touchmove.stop.prevent="discard">
            		<view class="open-redenvelope">
            			<view class="top">
            				<view class="close-btn">
            					<view class="icon close" @tap="closeRedEnvelope"></view>
            				</view>
            				<image src="/static/img/im/face/face_1.jpg"></image>
            			</view>
            			<view class="from">来自{{redenvelopeData.from}}</view>
            			<view class="blessing">{{redenvelopeData.blessing}}</view>
            			<view class="money">{{redenvelopeData.money}}</view>
            			<view class="showDetails" @tap="toDetails(redenvelopeData.rid)">
            				查看领取详情 <view class="icon to"></view>
            			</view>
            		</view>
            	</view>
            </view>   
        </view>
    </view>
</template>
<script>
	export default {
		data() {
			return {
				sysConfig:getApp().globalData.sysConfig,
				staticRoot:getApp().globalData.staticRoot,
				kf:{
					qq:'',
					wechat:''
				},
				page_in:false,
				//文字消息
				textMsg:'',
				//消息列表
				imgUrlRoot:'',
				isHistoryLoading:false,
				scrollAnimation:false,
				scrollTop:0,
				scrollToView:'',
				msgList:[],
				msgImgList:[],
				myuid:0,
				userinfo:{
					cid:'',
					nickname:'',
					headimg:''
				},
				historyLog:{
					pageNum:1,
					emarkid:99999999999
				},
				//录音相关参数
				// #ifndef H5
				//H5不能录音
				RECORDER:uni.getRecorderManager(),
				// #endif
				isVoice:false,
				voiceTis:'按住 说话',
				recordTis:"手指上滑 取消发送",
				recording:false,
				willStop:false,
				initPoint:{identifier:0,Y:0},
				recordTimer:null,
				recordLength:0,
				//播放语音相关参数
				AUDIO:uni.createInnerAudioContext(),
				playMsgid:null,
				VoiceTimer:null,
				// 抽屉参数
				popupLayerClass:'',
				// more参数
				hideMore:true,
				//表情定义
				hideEmoji:true,
				emojiList:[],
				//表情图片图床名称 ，由于我上传的第三方图床名称会有改变，所以有此数据来做对应，您实际应用中应该不需要
				onlineEmoji:{"100.gif":"AbNQgA.gif","101.gif":"AbN3ut.gif","102.gif":"AbNM3d.gif","103.gif":"AbN8DP.gif","104.gif":"AbNljI.gif","105.gif":"AbNtUS.gif","106.gif":"AbNGHf.gif","107.gif":"AbNYE8.gif","108.gif":"AbNaCQ.gif","109.gif":"AbNN4g.gif","110.gif":"AbN0vn.gif","111.gif":"AbNd3j.gif","112.gif":"AbNsbV.gif","113.gif":"AbNwgs.gif","114.gif":"AbNrD0.gif","115.gif":"AbNDuq.gif","116.gif":"AbNg5F.gif","117.gif":"AbN6ET.gif","118.gif":"AbNcUU.gif","119.gif":"AbNRC4.gif","120.gif":"AbNhvR.gif","121.gif":"AbNf29.gif","122.gif":"AbNW8J.gif","123.gif":"AbNob6.gif","124.gif":"AbN5K1.gif","125.gif":"AbNHUO.gif","126.gif":"AbNIDx.gif","127.gif":"AbN7VK.gif","128.gif":"AbNb5D.gif","129.gif":"AbNX2d.gif","130.gif":"AbNLPe.gif","131.gif":"AbNjxA.gif","132.gif":"AbNO8H.gif","133.gif":"AbNxKI.gif","134.gif":"AbNzrt.gif","135.gif":"AbU9Vf.gif","136.gif":"AbUSqP.gif","137.gif":"AbUCa8.gif","138.gif":"AbUkGQ.gif","139.gif":"AbUFPg.gif","140.gif":"AbUPIS.gif","141.gif":"AbUZMn.gif","142.gif":"AbUExs.gif","143.gif":"AbUA2j.gif","144.gif":"AbUMIU.gif","145.gif":"AbUerq.gif","146.gif":"AbUKaT.gif","147.gif":"AbUmq0.gif","148.gif":"AbUuZV.gif","149.gif":"AbUliF.gif","150.gif":"AbU1G4.gif","151.gif":"AbU8z9.gif","152.gif":"AbU3RJ.gif","153.gif":"AbUYs1.gif","154.gif":"AbUJMR.gif","155.gif":"AbUadK.gif","156.gif":"AbUtqx.gif","157.gif":"AbUUZ6.gif","158.gif":"AbUBJe.gif","159.gif":"AbUdIO.gif","160.gif":"AbU0iD.gif","161.gif":"AbUrzd.gif","162.gif":"AbUDRH.gif","163.gif":"AbUyQA.gif","164.gif":"AbUWo8.gif","165.gif":"AbU6sI.gif","166.gif":"AbU2eP.gif","167.gif":"AbUcLt.gif","168.gif":"AbU4Jg.gif","169.gif":"AbURdf.gif","170.gif":"AbUhFS.gif","171.gif":"AbU5WQ.gif","172.gif":"AbULwV.gif","173.gif":"AbUIzj.gif","174.gif":"AbUTQs.gif","175.gif":"AbU7yn.gif","176.gif":"AbUqe0.gif","177.gif":"AbUHLq.gif","178.gif":"AbUOoT.gif","179.gif":"AbUvYF.gif","180.gif":"AbUjFU.gif","181.gif":"AbaSSJ.gif","182.gif":"AbUxW4.gif","183.gif":"AbaCO1.gif","184.gif":"Abapl9.gif","185.gif":"Aba9yR.gif","186.gif":"AbaFw6.gif","187.gif":"Abaiex.gif","188.gif":"AbakTK.gif","189.gif":"AbaZfe.png","190.gif":"AbaEFO.gif","191.gif":"AbaVYD.gif","192.gif":"AbamSH.gif","193.gif":"AbaKOI.gif","194.gif":"Abanld.gif","195.gif":"Abau6A.gif","196.gif":"AbaQmt.gif","197.gif":"Abal0P.gif","198.gif":"AbatpQ.gif","199.gif":"Aba1Tf.gif","200.png":"Aba8k8.png","201.png":"AbaGtS.png","202.png":"AbaJfg.png","203.png":"AbaNlj.png","204.png":"Abawmq.png","205.png":"AbaU6s.png","206.png":"AbaaXn.png","207.png":"Aba000.png","208.png":"AbarkT.png","209.png":"AbastU.png","210.png":"AbaB7V.png","211.png":"Abafn1.png","212.png":"Abacp4.png","213.png":"AbayhF.png","214.png":"Abag1J.png","215.png":"Aba2c9.png","216.png":"AbaRXR.png","217.png":"Aba476.png","218.png":"Abah0x.png","219.png":"Abdg58.png"},
				//红包相关参数
				windowsState:'',
				redenvelopeData:{
					rid:null,	//红包ID
					from:null,
					face:null,
					blessing:null,
					money:null
				}
			};
		},
		onLoad(option) {

			var that=this

			this.myuid = getApp().globalData.loginUser.id

			this.loadHistory()
			
			uni.$on('onWsMsg',function(res){
				that.onWsMessage(res)
			})

		},
		onUnload() {
			uni.$off('onWsMsg')
		},
		onShow(){
			this.scrollTop = 9999999;
			this.page_in=true
			
		},
		onHide() {
			this.page_in=false
		},
		onUnload() {
			this.page_in=false
		},
		methods:{
            toPageBack(){
                if (getCurrentPages().length == 1) {
                	uni.switchTab({
                		url: '../../index/index'
                	})
                } else {
                	uni.navigateBack({
                
                	})
                }
            },
			onWsMessage(res){

				if (res.type == 'onKfMsg') {
					this.historyLog.pageNum=1
					this.historyLog.emarkid=9999999999
					this.msgList=[]
					this.loadHistory()
				}
		
				this.toScrollRollBotm()
			},
			// 接受消息(筛选处理)
			screenMsg(msg){
				//从长连接处转发给这个方法，进行筛选处理
				if(msg.type=='system'){
					// 系统消息
					switch (msg.msg.type){
						case 'text':
							this.addSystemTextMsg(msg);
							break;
						case 'redEnvelope':
							this.addSystemRedEnvelopeMsg(msg);
							break;
					}
				}else if(msg.type=='user'){
					// 用户消息
					switch (msg.msg.type){
						case 'text':
							this.addTextMsg(msg);
							break;
						case 'voice':
							this.addVoiceMsg(msg);
							break;
						case 'img':
							this.addImgMsg(msg);
							break;
						case 'redEnvelope':
							this.addRedEnvelopeMsg(msg);
							break;
					}
					console.log('用户消息');
					//非自己的消息震动
					if(msg.msg.userinfo.uid!=this.myuid){
						console.log('振动');
						uni.vibrateLong();
					}
				}
				this.$nextTick(function() {
					// 滚动到底
					this.scrollToView = 'msg'+msg.msg.id
				});
			},	
			toScrollRollBotm() {
			
				if (this.stopScrollRoll == true) {
					return
				}
			
				this.scrollTop = this.scrollTop + 1
				this.$nextTick(function() {
					this.scrollTop = 9999999;
				});
			},
			// 加载初始页面消息
			getMsgList(){
				// 消息列表
				let list = []
				// 获取消息中的图片,并处理显示尺寸
				for(let i=0;i<list.length;i++){
					if(list[i].type=='user'&&list[i].msg.type=="img"){
						list[i].msg.content = this.setPicSize(list[i].msg.content);
						this.msgImgList.push(list[i].msg.content.url);
					}
				}
				this.msgList = list;
				// 滚动到底部
				this.$nextTick(function() {
					//进入页面滚动到底部
					this.scrollTop = 9999;
					this.$nextTick(function() {
						this.scrollAnimation = true;
					});
					
				});
			},
			//处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
			setPicSize(content){
				// 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
				let maxW = uni.upx2px(350);//350是定义消息图片最大宽度
				let maxH = uni.upx2px(350);//350是定义消息图片最大高度
				if(content.w>maxW||content.h>maxH){
					let scale = content.w/content.h;
					content.w = scale>1?maxW:maxH*scale;
					content.h = scale>1?maxW/scale:maxH;
				}
				return content;
			},
			
			//更多功能(点击+弹出) 
			showMore(){
				this.isVoice = false;
				this.hideEmoji = true;
				if(this.hideMore){
					this.hideMore = false;
					this.openDrawer();
				}else{
					this.hideDrawer();
				}
			},
			// 打开抽屉
			openDrawer(){
				this.popupLayerClass = 'showLayer';
			},
			// 隐藏抽屉
			hideDrawer(){
				this.popupLayerClass = '';
				setTimeout(()=>{
					this.hideMore = true;
					this.hideEmoji = true;
				},150);
			},
			// 选择图片发送
			chooseImage(){
				this.getImage('album');
			},
			//拍照发送
			camera(){
				this.getImage('camera');
			},
			//发红包
			handRedEnvelopes(){
				uni.navigateTo({
					url:'HM-hand/HM-hand'
				});
				this.hideDrawer();
			},
			//选照片 or 拍照
			getImage(type){
				
				var that=this
				
				this.hideDrawer();
				
				uni.chooseImage({
					count: 1,
					success(res) {
					
					    var files = res.tempFiles
					
					    for (var i = 0; i < files.length; i++) {
					
					        var filepath = files[i].path
					        
					        // 获取文件后缀，并以时间戳组合新名字
					        var filename = files[i].path
					        var filetype = files[i].name.substr(files[i].name.lastIndexOf('.') + 1)
					
					        filename = String(new Date().getTime() + i)
					        tmpUpload(files, i)
					
					        function tmpUpload(files, i) {
					
					            uni.uploadFile({
					                url: '/h5/user/kf/onUploadImg',
									//url: 'http://127.0.0.1:8787/h5/kf/onUploadImg',
					                filePath: filepath,
					                name: 'file',
					                formData: {
					                    'key': filename
					                },
					                success(res) {
										
										res=JSON.parse(res.data)

					                    if(res.code==200){
					                        
					                        that.sendImgMsg(res.data.name)
					                        
					                    }else{
					                        uni.showToast({
					                            title:'上传失败',
					                            icon:'none'
					                        })
					                    }
					
					                },
					                fail(res) {
					
					
					                }
					            });
					        }
					
					    }
					},
					fail(res) {
					
					}
				});
			},
			// 选择表情
			chooseEmoji(){
				this.hideMore = true;
				if(this.hideEmoji){
					this.hideEmoji = false;
					this.openDrawer();
				}else{
					this.hideDrawer();
				}
			},
			//添加表情
			addEmoji(em){
				this.textMsg+=em.alt;
			},
			
			//获取焦点，如果不是选表情ing,则关闭抽屉
			textareaFocus(){
				if(this.popupLayerClass=='showLayer' && this.hideMore == false){
					this.hideDrawer();
				}
			},
			//替换表情符号为图片
			replaceEmoji(str){
				let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g,(item, index)=>{
					console.log("item: " + item);
					for(let i=0;i<this.emojiList.length;i++){
						let row = this.emojiList[i];
						for(let j=0;j<row.length;j++){
							let EM = row[j];
							if(EM.alt==item){
								//在线表情路径，图文混排必须使用网络路径，请上传一份表情到你的服务器后再替换此路径 
								//比如你上传服务器后，你的100.gif路径为https://www.xxx.com/emoji/100.gif 则替换onlinePath填写为https://www.xxx.com/emoji/
								let onlinePath = 'https://s2.ax1x.com/2019/04/12/'
								let imgstr = '<img src="'+onlinePath+this.onlineEmoji[EM.url]+'">';
								console.log("imgstr: " + imgstr);
								return imgstr;
							}
						}
					}
				});
				return '<div style="display: flex;align-items: center;word-wrap:break-word;">'+replacedStr+'</div>';
			},
			
			// 发送消息
			sendMsg(content,type){
				//实际应用中，此处应该提交长连接，模板仅做本地处理。
				var nowDate = new Date();
				let lastid = this.msgList[this.msgList.length-1].msg.id;
				lastid++;
				let msg = {type:'user',msg:{id:lastid,time:nowDate.getHours()+":"+nowDate.getMinutes(),type:type,userinfo:{uid:0,username:"大黑哥",face:"/static/img/face.jpg"},content:content}}
				// 发送消息
				this.screenMsg(msg);
				// 定时器模拟对方回复,三秒
				setTimeout(()=>{
					lastid = this.msgList[this.msgList.length-1].msg.id;
					lastid++;
					msg = {type:'user',msg:{id:lastid,time:nowDate.getHours()+":"+nowDate.getMinutes(),type:type,userinfo:{uid:1,username:"售后客服008",face:"/static/img/im/face/face_2.jpg"},content:content}}
					// 本地模拟发送消息
					this.screenMsg(msg);
				},3000)
			},
			
			// 添加文字消息到列表
			addTextMsg(msg){
				this.msgList.push(msg);
			},
			// 添加语音消息到列表
			addVoiceMsg(msg){
				this.msgList.push(msg);
			},
			// 添加图片消息到列表
			addImgMsg(msg){
				msg.msg.content = this.setPicSize(msg.msg.content);
				this.msgImgList.push(msg.msg.content.url);
				this.msgList.push(msg);
			},
			addRedEnvelopeMsg(msg){
				this.msgList.push(msg);
			},
			// 添加系统文字消息到列表
			addSystemTextMsg(msg){
				this.msgList.push(msg);
			},
			// 添加系统红包消息到列表
			addSystemRedEnvelopeMsg(msg){
				this.msgList.push(msg);
			},
			// 打开红包
			openRedEnvelope(msg,index){
				let rid = msg.content.rid;
				uni.showLoading({
					title:'加载中...'
				});
				console.log("index: " + index);
				//模拟请求服务器效果
				setTimeout(()=>{
					//加载数据
					if(rid==0){
						this.redenvelopeData={
							rid:0,	//红包ID
							from:"大黑哥",
							face:"/static/img/im/face/face.jpg",
							blessing:"恭喜发财，大吉大利",
							money:"已领完"
						}
					}else{
						this.redenvelopeData={
							rid:1,	//红包ID
							from:"售后客服008",
							face:"/static/img/im/face/face_2.jpg",
							blessing:"恭喜发财",
							money:"0.01"
						}
						if(!msg.content.isReceived){
							// {type:"system",msg:{id:8,type:"redEnvelope",content:{text:"你领取了售后客服008的红包"}}},
							this.sendSystemMsg({text:"你领取了"+(msg.userinfo.uid==this.myuid?"自己":msg.userinfo.username)+"的红包"},'redEnvelope');
							console.log("this.msgList[index]: " + JSON.stringify(this.msgList[index]));
							this.msgList[index].msg.content.isReceived = true;
						}
					}
					uni.hideLoading();
					this.windowsState = 'show';
					
				},200)
				
			},
			// 关闭红包弹窗
			closeRedEnvelope(){
				this.windowsState = 'hide';
				setTimeout(()=>{
					this.windowsState = '';
				},200)
			},
			sendSystemMsg(content,type){
				let lastid = this.msgList[this.msgList.length-1].msg.id;
				lastid++;
				let row = {type:"system",msg:{id:lastid,type:type,content:content}};
				this.screenMsg(row)
			},
			//领取详情
			toDetails(rid){
				uni.navigateTo({
					url:'HM-details/HM-details?rid='+rid
				})
			},
			// 预览图片
			showPic(msg){
				uni.previewImage({
					indicator:"none",
					current:0,
					urls: [msg]
				});
			},
			// 播放语音
			playVoice(msg){
				this.playMsgid=msg.id;
				this.AUDIO.src = msg.content.url;
				this.$nextTick(function() {
					this.AUDIO.play();
				});
			},
			// 录音开始
			voiceBegin(e){
				if(e.touches.length>1){
					return ;
				}
				this.initPoint.Y = e.touches[0].clientY;
				this.initPoint.identifier = e.touches[0].identifier;
				this.RECORDER.start({format:"mp3"});//录音开始,
			},
			//录音开始UI效果
			recordBegin(e){
				this.recording = true;
				this.voiceTis='松开 结束';
				this.recordLength = 0;
				this.recordTimer = setInterval(()=>{
					this.recordLength++;
				},1000)
			},
			// 录音被打断
			voiceCancel(){
				this.recording = false;
				this.voiceTis='按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.willStop = true;//不发送录音
				this.RECORDER.stop();//录音结束
			},
			// 录音中(判断是否触发上滑取消发送)
			voiceIng(e){
				if(!this.recording){
					return;
				}
				let touche = e.touches[0];
				//上滑一个导航栏的高度触发上滑取消发送
				if(this.initPoint.Y - touche.clientY>=uni.upx2px(100)){
					this.willStop = true;
					this.recordTis = '松开手指 取消发送'
				}else{
					this.willStop = false;
					this.recordTis = '手指上滑 取消发送'
				}
			},
			// 结束录音
			voiceEnd(e){
				if(!this.recording){
					return;
				}
				this.recording = false;
				this.voiceTis='按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.RECORDER.stop();//录音结束
			},
			//录音结束(回调文件)
			recordEnd(e){
				clearInterval(this.recordTimer);
				if(!this.willStop){
					console.log("e: " + JSON.stringify(e));
					let msg = {
						length:0,
						url:e.tempFilePath
					}
					let min = parseInt(this.recordLength/60);
					let sec = this.recordLength%60;
					min = min<10?'0'+min:min;
					sec = sec<10?'0'+sec:sec;
					msg.length = min+':'+sec;
					this.sendMsg(msg,'voice');
				}else{
					console.log('取消发送录音');
				}
				this.willStop = false;
			},
			// 切换语音/文字输入
			switchVoice(){
				this.hideDrawer();
				this.isVoice = this.isVoice?false:true;
			},
			discard(){
				return;
			},
			copyText(text) {
				uni.setClipboardData({
					data:text,
					success() {
						uni.showToast({
							title:'已复制',
							icon:'none'
						})
					}
				})

			},
			// 发送文字消息
			sendText(){
				this.hideDrawer();//隐藏抽屉
				
				if(this.textMsg==''){
					return;
				}
				
				var that = this
				
				uni.request({
					url: '/user/kf/onMessage',
					method: 'POST',
					data: {
						type:1,
						content: this.textMsg
					},
					success(res) {
						that.historyLog.pageNum=1
						that.historyLog.emarkid=999999999999
						that.msgList=[]
						that.loadHistory()
						that.toScrollRollBotm()
					},
					fail(res) {}
				})
				
				that.textMsg = ''
			},
			// 发送图片消息
			sendImgMsg(url){
				
				if(!url){
					return;
				}
				
				var that = this
				
				uni.request({
					url: '/user/kf/onMessage',
					method: 'POST',
					data: {
						type:2,
						content: url
					},
					success(res) {
						that.historyLog.pageNum=1
						that.historyLog.emarkid=999999999999
						that.msgList=[]
						that.loadHistory()
						that.toScrollRollBotm()
					},
					fail(res) {}
				})
				
				that.textMsg = ''
			},
			//触发滑动到顶部(加载历史信息记录)
			loadHistory(e){
				var that=this
				
				if(this.isHistoryLoading){
					return ;
				}
				this.isHistoryLoading = true;//参数作为进入请求标识，防止重复请求
				this.scrollAnimation = false;//关闭滑动动画
				
				if(this.msgList.length>0){
					var Viewid = this.msgList[0].msg.id;//记住第一个信息ID
					
				}else{
					var Viewid = 99999;//记住第一个信息ID
				}
				
				uni.request({
					url: '/user/kf/getLog',
					method: 'POST',
					data: {
						pageNum: that.historyLog.pageNum,
						emarkid: that.historyLog.emarkid
					},
					success(res) {
				
						if (res.data.code == 200 && res.data.data.length>0) {
				
							var arr = res.data.data
				
							for (var i in arr) {
				
								var a = {
									from:{
										uid: arr[i].uid,
										nickname: arr[i].nickname,
										headimg: arr[i].headimg
									},
									msg:{
										id:arr[i].id,
										time:arr[i].time_creat,
										type:arr[i].content_type,
										content:arr[i].content
									}
								}
								
								that.msgList.unshift(a);
							}
							
							that.historyLog.pageNum++
			
							that.historyLog.emarkid=arr[arr.length-1].id
			
							that.$nextTick(function() {
								that.scrollToView = 'msg' + Viewid; //跳转上次的第一行信息位置
								that.$nextTick(function() {
									that.scrollAnimation = true; //恢复滚动动画
								});
				
							});
				
				
						}
					},
					fail(res) {
				
					},
					complete() {
						that.isHistoryLoading = false;
						that.scrollAnimation = true;
						
						that.toScrollRollBotm()
					}
				})
			}
		}
	}
</script>
<style lang="scss">
	@import "./style.scss";
	
	page{
		background-color: #e9edf4;
	}
	
</style>