<script>
export default {
	globalData: {
		serverRoot: '/h5',
		wsUrl: (document.location.protocol == 'http:' ? 'ws:' : 'wss:') + '//' + location.hostname + '/live',
		staticRoot:document.location.protocol+ '//' + location.hostname,
		serverRoot:'http://47.94.96.221/h5',
	    wsUrl: 'ws://47.94.96.221/live',   // 本地开发写死地址
		staticRoot:'http://47.94.96.221',
		//serverRoot:'http://127.0.0.1:8787/h5',
		//staticRoot:'http://127.0.0.1:8787',
		//wsUrl: 'ws://127.0.0.1:7272',   // 本地开发写死地址
		loginUser: {
			id:0
		},
		ws:null,
		sysConfig: {
			themeNight: false,
			passcode: '',
			theme: 'dj',
			theme_color: '#45B9EC' // 主题色
		},
		cacheConfig:{
			bgVoice:{
				on:false,
				volume:0.4
			}
		},
		systemInfo:{
			windowWidth:375,
			windowHeight:812
		}
	},
	onLaunch() {

		var that = this;
		
		//#########################################################   系统消息
		uni.getSystemInfo({
			success: function (res) {
				that.globalData.systemInfo=res
			}
		});

		//#########################################################   拦截器
		uni.addInterceptor('request', {
			invoke(args) {
				args.url = that.globalData.serverRoot + args.url;
			},
			success(res) {
				// 请求成功后，修改code值为1

				if (res.statusCode == 401) {
					
					uni.redirectTo({
						url: '/pages/sys/login'
					});
				}
			},
			fail(err) {},
			complete(res) {}
		});

		//##########################################################    缓存
		var a = uni.getStorageSync('loginUser');

		if (a) {
			this.globalData.loginUser = a;
		}

		//##########################################################    ws
		this.wsHeart()
		this.wsHeartState()

		this.getUserInfo()
	},
	methods: {
		getUserInfo() {

			var that = this

			uni.request({
				url: '/user/user/info',
				method: 'POST',
				success(res) {

					if (res.data.code == 200) {
						that.globalData.loginUser= res.data.data;
						that.wsReInit()
					}

				},
				fail() {
					
					uni.navigateTo({
						url:'/pages/sys/login'
					})
				}
			})
		},
		postLoginOut() {

			uni.request({
				url: '/user/user/loginOut',
				method: 'POST'
			})
		},
		clearStorage() {
			uni.removeStorageSync('loginUser');
		},
		reLogin() {
			this.wsLeaveBasic()
			this.postLoginOut()

			uni.redirectTo({
				url: '/pages/sys/login'
			});
		},
		copyText(text) {
			uni.setClipboardData({
				data: String(text),
				success() {
					uni.showToast({
						title: '已复制'
					});
				}
			});
		},
		wsReInit() {
			var that = this;

			if (this.globalData.ws == null) {
				this.wsInit();
			} else {
				this.globalData.ws.close();

				setTimeout(function () {
					that.wsInit();
				}, 500);
			}
		},
		wsInit() {
			var that = this;

			var ws = uni.connectSocket({
				url: that.globalData.wsUrl,
				success() {}
			});

			// #ifdef H5

			//#################   强制关闭浏览器时
			window.onbeforeunload = function () {
				ws.close();
			};

			// #endif

			ws.onOpen(function () {
				that.wsJoinBasic()
			});

			ws.onClose(function () {

			});

			ws.onError(function () {
				ws.close();
			});

			ws.onMessage(function (e) {
				
				var res = JSON.parse(e.data);

				//######  租户到期、修改安全码房间号、用户被冻结，退出登录
				if(res.type=='onUserFreeze' || res.on==true){
					that.reLogin()
				}
				
				//#####  广播事件
				uni.$emit('onWsMsg',res)
				
			});

			this.globalData.ws = ws;
		},
		wsJoinBasic(){

			this.wsSend({
				type: 'onJoinGroup',
				group: 'app-group'
			})
			
			this.wsSend({
				type: 'onJoinGroup',
				group: 'app-user-'+this.globalData.loginUser.id
			})

		},
		wsLeaveBasic(){

			this.wsSend({
				type: 'onLeaveGroup',
				group: 'app-room-kdata'
			})

		},
		wsSend(data){

			if (this.globalData.ws != null && this.globalData.ws.readyState == 1) {
				this.globalData.ws.send({
					data: JSON.stringify(data)
				});
			}
		},
		//###################################  40秒进行一次心跳
		wsHeart() {
			var that = this;

			setTimeout(function () {
				if (that.globalData.ws != null && that.globalData.ws.readyState == 1) {
					that.globalData.ws.send({
						data: JSON.stringify({
							type: 'ping'
						})
					});
				}

				that.wsHeart();
			}, 40000);
		},
		//###################################  3秒检查一次连接
		wsHeartState() {
			var that = this;

			setTimeout(function () {
				if (that.globalData.ws != null && that.globalData.ws.readyState != 1) {
					that.globalData.ws.close();
					that.wsInit();
				}

				that.wsHeartState();
			}, 3000);
		}
	}
};
</script>

<style lang="scss">
@import 'uview-ui/index.scss';
@import 'common/demo.scss';
</style>
