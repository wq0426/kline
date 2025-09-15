<template>
	<view style="width: 100%;height: 100%;display: flex;flex-direction: column;align-items: center;justify-content: center;">
		<image style="width: 100%;margin-top: 30%;" src="/static/image/sys/loading9.gif" mode="widthFix"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onLoad(e) {
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
							
							getApp().globalData.loginUser=res.data.data
							
							getApp().wsReInit()
							
							uni.switchTab({
								url:'/pages/index/index'
							})

						}

					},
					fail() {
						uni.navigateTo({
							url:'/pages/sys/login'
						})
					}
				})
			}
		}
	}
</script>

<style>

page{
	background-color:#181E25;
}

</style>