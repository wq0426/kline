<template>
	<view style="padding: 40rpx;">
		<u-navbar back-icon-color="black" title="实名认证" :background="{ background: 'transparent' }" title-color="black" :border-bottom="false" />

		<view class="form">
			<view class="title" style="margin-top: 10rpx;">姓名</view>
			<view class="content-box">
				<u-icon name="email-fill" style="margin-right: 15rpx" color="#979797"></u-icon>
				<u-input v-model="param.realname" placeholder="请输入姓名" />
			</view>
			<view class="title">身份证号</view>
			<view class="content-box">
				<u-icon name="lock-fill" style="margin-right: 15rpx" color="#979797"></u-icon>
				<u-input v-model="param.idcard" placeholder="请输入身份证号" />
			</view>
			<view style="padding: 20rpx;margin-top: 50rpx;">
				<u-button shape="circle" style="background-color: #003D92;color: #fff;">提交</u-button>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userinfo: getApp().globalData.loginUser.userinfo,
				param:{
					realname:'',
					idcard:''
				}
			}
		},
		methods: {
			isWorkNickname(content) {
				var patrn = /^[\u4E00-\u9FA5A-Za-z0-9]{2,8}$/g;
				if (!patrn.exec(content)) return false
				return true
			},
			//##########################################  
			postEdit() {

				var that = this

				if (this.isWorkNickname(that.userinfo.nickname) == false) {
					uni.showToast({
						title: '2-8字母汉字',
						icon: 'none'
					})

					return
				}

				uni.request({
					url: '/user/user/setNickname',
					method: 'POST',
					data: {
						nickname: that.userinfo.nickname
					},
					success(res) {

						if (res.data.code == 200) {

							uni.showToast({
								title: '修改成功'
							})

							getApp().globalData.loginUser.userinfo.nickname = that.userinfo.nickname

							uni.setStorageSync('loginUser', getApp().globalData.loginUser)

						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}

					},
					fail() {
						uni.showToast({
							title: '提交失败',
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	page{
		background: linear-gradient(to right, #B7CFFE, #EFF8FF);
		width: 100vw;
		height: 100vh;
	}
	
	.form{
		display: flex; 
		flex-direction: column; 
		padding: 40rpx;
		padding-bottom: 200rpx;
		background-color: #fff;
		border-radius: 20rpx 20rpx 0rpx 0rpx;
	
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