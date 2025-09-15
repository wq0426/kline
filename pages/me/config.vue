<template>
	<view>
		<!--############################################  导航栏 -->
		<u-navbar :is-back="true" title="账号管理" title-color="#000000" back-icon-color="#000000" :custom-back="toPageBack"></u-navbar>

		<u-cell-group :title-style="{marginLeft:'40rpx'}">
			<u-cell-item title="修改头像" @click="postUploadHeadimg()">
				<view slot="right-icon">
					<img referrerpolicy="no-referrer" :src="userinfo.headimg" mode="widthFix"
						style="width: 100px;border-radius: 10rpx;"></img>
				</view>
			</u-cell-item>
			<u-cell-item style="color: #323232;" title="修改昵称" @click="toPage('./editNickname')">
				<view slot="right-icon">
					{{userinfo.nickname}}
				</view>
			</u-cell-item>
			<u-cell-item style="color: #323232;" title="修改密码" @click="toPage('./editPassword')"></u-cell-item>
		</u-cell-group>

	</view>
</template>

<script>
	import md5 from '../../utils/md5.js'

	export default {
		data() {
			return {
				sysConfig: getApp().globalData.sysConfig,
				userinfo: getApp().globalData.loginUser,
				myMoney: 0,
				showAccountChangeLog: false
			}
		},
		onLoad(e) {
			this.getIsShowAccountChangeLog()
		},
		onShow(e) {
			this.userinfo = getApp().globalData.loginUser
			this.$forceUpdate()
			this.getMyMoney()
		},
		methods: {
			toPageBack() {
				uni.navigateBack({

				})
			},
			toPage(url) {
				uni.navigateTo({
					url: url
				})
			},
			copyText(text) {
				uni.setClipboardData({
					data: String(text),
					success() {
						uni.showToast({
							title: '已复制'
						})
					}
				})
			},
			postUploadHeadimg() {
				
				var that = this;
			
				uni.chooseImage({
					count: 1,
					success(res) {
						var files = res.tempFiles;
			
						for (var i = 0; i < files.length; i++) {
							var filepath = files[i].path;
			
							// 获取文件后缀，并以时间戳组合新名字
							var filename = files[i].path;
							var filetype = files[i].name.substr(files[i].name.lastIndexOf('.') + 1);
			
							filename = String(new Date().getTime() + i);
							tmpUpload(files, i);
			
							function tmpUpload(files, i) {
								uni.uploadFile({
									url: '/h5/user/user/onUploadHeadimg',
									filePath: filepath,
									name: 'file',
									formData: {
										key: filename
									},
									success(res) {
										res = JSON.parse(res.data);
			
										if (res.code == 200) {
											
											getApp().globalData.loginUser.headimg=res.data.name
											
											that.userinfo.headimg=res.data.name
											
										} else {
											uni.showToast({
												title: '上传失败',
												icon: 'none'
											});
										}
									},
									fail(res) {}
								});
							}
						}
					},
					fail(res) {}
				});
			}
		}
	}
</script>

<style>
	page {
		background-color: #f1f1f1;
	}

	.top {
		width: 100%;
		height: 320rpx;
		background-size: cover;
		box-sizing: border-box;
	}
</style>
