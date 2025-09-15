<template>
	<view>
		<u-navbar back-text="返回" :title="title" :custom-back="toPageBack"></u-navbar>
		<view style="align-items: center;display: flex;flex-direction: column;justify-content: flex-start;">
			<view style="display: flex;flex-wrap: wrap;font-weight: 600;font-weight: 600;justify-content: flex-start;width: 100%;padding: 40rpx;font-size: 36rpx;">
				{{title}}
			</view>

			<view style="width: 90%;margin: auto;">
				<u-parse :html="content" :selectable="true"></u-parse>
			</view>

			<view style="height: 200rpx;">

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
				title: "",
				tips: "长按可复制文字，点击图片放大与保存",
				content: ""
			}
		},
		onLoad(e) {
			this.id = e.id
			this.getHtml()
		},
		methods: {
			getHtml() {

				var that = this

				uni.request({
					url: "/sup/sup/getNewsInfo",
					method: "POST",
					data: {
						id: that.id
					},
					success: function(res) {

						if (res.data.code == 200) {

							that.title = res.data.data.title
							
							uni.setNavigationBarTitle({
								title: that.title
							})

							that.content = res.data.data.content

						} else {
							uni.showToast({
								title: '获取失败',
							})
						}

					},
					fail: function(res) {
						uni.showToast({
							title: '获取失败',
						})
					}

				})
			},
			//#####################################################    返回
			toPageBack() {

				var pages = getCurrentPages()

				if (pages.length > 1) {
					uni.navigateBack({

					})
				} else {
					uni.navigateTo({
						url: '../index/index'
					})
				}

			},
			toCopy(text) {
				let textarea = document.createElement("textarea")
				textarea.value = text
				textarea.readOnly = "readOnly"
				document.body.appendChild(textarea)
				textarea.select() // 选中文本内容
				textarea.setSelectionRange(0, text.length)
				uni.showToast({ //提示
					title: '复制成功'
				})
				var result = document.execCommand("copy")
				textarea.remove()

			}
		},
		//##############################################################################   分享页面
		onShareAppMessage(res) {

			var that = this

			return {
				title: that.title,
				path: "/pages/sys/webHtml?id=" + that.id
			}
		}
	}
</script>

<style>
	.tips {
		position: fixed;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 72rpx;
		background-color: #F9E9E6;
		box-sizing: border-box;
	}
</style>
