<template>
	<view style="display: flex; flex-direction: column">
		<img src="@/static/image/sys/login-bg.png" style="width: 100%; height: auto" />

		<view style="display: flex; flex-direction: column; margin: 40rpx; margin-top: -300rpx;margin-bottom: 80rpx;">
			<span style="font-size: 42rpx; font-weight: 600">账号登录</span>
			<span style="margin-top: 15rpx; color: #8a8a66">Welcome，欢迎您</span>
		</view>

		<view v-if="type==1" :class="'form '+(type == 1 ? 'login-box' : 'register-box')">
			<view style="display: flex;justify-content: space-between;padding: 0rpx 80rpx;">
				<view class="head">
					账号登录
				</view>
				<view class="head" style="border-bottom: none;" @click="type=2">
					账号注册
				</view>
			</view>

			<view class="title">账户</view>
			<view class="content-box">
				<u-icon name="email-fill" style="margin-right: 15rpx" color="#979797"></u-icon>
				<u-input v-model="login.username" placeholder="请输入账户" />
			</view>
			<view class="title">密码</view>
			<view class="content-box">
				<u-icon name="lock-fill" style="margin-right: 15rpx" color="#979797"></u-icon>
				<u-input type="password" v-model="login.password" placeholder="请输入密码" />
			</view>

			<view style="margin-top: 40rpx;margin-left: 20rpx;">
				<u-checkbox v-model="login.allowRule" shape="circle">
					<span style="font-size: 26rpx;font-weight: 600;">登录即代表同意《服务条款》《隐私协议》</span>
				</u-checkbox>
			</view>
			
			<view style="padding: 20rpx;">
				<u-button shape="circle" style="background-color: #003D92;color: #fff;" @click="postLogin">登录</u-button>
			</view>
			
			<view style="color: #003D92;display: flex;justify-content: space-between;padding: 10rpx 30rpx;font-weight: 600;">
				<span>立即开户></span>
				<span>忘记密码？</span>
			</view>
			
			<view style="align-items: center;margin-top: 50rpx;">
				<u-button style="width: 40%;" shape="circle">
					<view style="display: flex;align-items: center;font-weight: 600;">
						<u-icon name="server-fill" style="margin-right: 15rpx" color="#979797"></u-icon>
						<span>在线客服</span>
					</view>
				</u-button>
			</view>
		</view>
		
		<view v-if="type==2" :class="'form '+(type == 1 ? 'login-box' : 'register-box')">
			<view style="display: flex;justify-content: space-between;padding: 0rpx 80rpx;">
				<view class="head" style="border-bottom: none;" @click="type=1">
					账号登录
				</view>
				<view class="head">
					账号注册
				</view>
			</view>
		
			<view class="title">姓名</view>
			<view class="content-box">
				<u-icon name="email-fill" style="margin-right: 15rpx" color="#979797"></u-icon>
				<u-input v-model="register.nickname" placeholder="请输入姓名" />
			</view>
			<view class="title">用户名</view>
			<view class="content-box">
				<u-icon name="email-fill" style="margin-right: 15rpx" color="#979797"></u-icon>
				<u-input v-model="register.username" placeholder="请输入用户名" />
			</view>
			<view class="title">密码</view>
			<view class="content-box">
				<u-icon name="lock-fill" style="margin-right: 15rpx" color="#979797"></u-icon>
				<u-input type="password" v-model="register.password" placeholder="请输入密码" />
			</view>
			<view class="title">确认密码</view>
			<view class="content-box">
				<u-icon name="lock-fill" style="margin-right: 15rpx" color="#979797"></u-icon>
				<u-input type="password" v-model="register.password2" placeholder="请输入密码" />
			</view>
			<view class="title">提款密码</view>
			<view class="content-box">
				<u-icon name="lock-fill" style="margin-right: 15rpx" color="#979797"></u-icon>
				<u-input type="password" v-model="register.bankcode" placeholder="请输入提款密码" />
			</view>
		
			<view style="padding: 20rpx;margin-top: 20rpx;">
				<u-button shape="circle" style="background-color: #003D92;color: #fff;" @click="postRegister">注册</u-button>
			</view>

		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			type: 1,
			sysConfig: getApp().globalData.sysConfig,
			login: {
				username: '',
				password: '',
				allowRule:false
			},
			register:{
				nickname:'',
				username:'',
				password:'',
				password2:'',
				bankcode:''
			}
		};
	},
	methods: {
		postLogin() {
			
			var that = this;
			
			if(!that.login.allowRule){
				
				uni.showToast({
					title: '请同意协议！',
					icon: 'none'
				});
		
				return
			}
			
			if(!that.login.username || !that.login.password){
				
				uni.showToast({
					title: '请输入账号密码！',
					icon: 'none'
				});
					
				return
			}
		
			uni.request({
				url: '/user/user/login',
				method: 'POST',
				data: that.login,
				success(res) {
					if (res.data.code == 200) {
						
						getApp().globalData.loginUser=res.data.data
						
						uni.showToast({
							title: '登录成功！',
							icon: 'none'
						});
						
						setTimeout(function(){
							uni.switchTab({
								url:'/pages/index/index'
							})
						},500)
						
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						});
					}
				},
				fail() {
					uni.showToast({
						title: '提交失败',
						icon: 'none'
					});
				}
			});
		},
		postRegister() {
			
			var that = this;
			
			if(that.register.password!=that.register.password2){
				
				uni.showToast({
					title: '两次密码不一致！',
					icon: 'none'
				});

				return
			}

			uni.request({
				url: '/user/user/register',
				method: 'POST',
				data: that.register,
				success(res) {
					if (res.data.code == 200) {
						
						uni.showToast({
							title: '注册成功！',
							icon: 'none'
						});
						
						that.type=1
						
						
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						});
					}
				},
				fail() {
					uni.showToast({
						title: '提交失败',
						icon: 'none'
					});
				}
			});
		}
	}
};
</script>

<style scoped lang="scss">
page {
	background-color: #eff8ff;
}

.login-box {
	background-image: url('../../static/image/sys/login-1.png');
	background-size: cover;
}

.register-box {
	background-image: url('../../static/image/sys/login-2.png');
	background-size: cover;
}

.form{
	display: flex; 
	flex-direction: column; 
	padding: 40rpx;
	padding-bottom: 200rpx;

	.head{
		margin-top: 10rpx; 
		font-size: 34rpx; 
		font-weight: 600; 
		border-bottom: 8rpx solid #003d92; 
		width: 150rpx; 
		padding-bottom: 10rpx;
	}
	
	.title{
		margin-top: 40rpx; 
		font-weight: 600;
		color: #000;
	}
	.content-box{
		display: flex; 
		align-items: center; 
		background-color: #f2f2f2; 
		padding: 5rpx 20rpx; 
		border-radius: 10rpx; 
		margin-top: 12rpx
	}
}
</style>
