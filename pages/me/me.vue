<template>
	<view style="display: flex; flex-direction: column; padding: 30rpx">
		<u-navbar back-icon-color="white" title="个人中心" title-color="black"></u-navbar>
		<view class="my-info" style="display: flex; flex-direction: column; border-radius: 20rpx; padding: 20rpx; color: #fff">
			<view style="display: flex;justify-content: space-between;align-items: center;">
				<view style="display: flex; align-items: center">
					<u-image src="@/static/image/me/headimg.png" width="80" height="80"></u-image>
					<span style="margin-left: 20rpx; font-weight: 600; font-size: 32rpx">{{ userinfo.nickname }}</span>
					<u-tag text="已实名" size="mini" style="margin-left: 20rpx"></u-tag>
				</view>
				<view @click="toPage('/pages/me/config')">
					<u-icon name="edit-pen-fill"></u-icon>
				</view>
			</view>
			<view style="margin-top: 20rpx; font-size: 24rpx; color: #828aa2">
				<span>信誉分：{{ userinfo.credit_score }}</span>
				<span style="margin-left: 40rpx">
					UID：{{ userinfo.id }}
					<u-icon name="file-text" style="margin-left: 15rpx" @click="copyText(userinfo.id)"></u-icon>
				</span>
			</view>
		</view>

		<view style="margin-top: 40rpx; background-color: #fff; border-radius: 15rpx; display: flex; flex-direction: column; padding: 40rpx">
			<span style="color: #636363; display: flex; align-items: center">
				<span>我的资产</span>
				<view style="display: flex; align-items: center; background-color: #fff9ed; padding: 5rpx 30rpx; font-size: 24rpx; margin-left: 20rpx; color: #c0a585">
					<u-image src="@/static/image/me/safe.png" width="30" height="30"></u-image>
					<span style="margin-left: 15rpx">安全保障中</span>
				</view>
			</span>
			<view style="margin-top: 30rpx; display: flex; align-items: center">
				<span style="font-weight: 600; font-size: 52rpx">{{ userinfo.money }}</span>
				<span style="font-weight: 600; margin-left: 5rpx; margin-top: 15rpx">CNY</span>
			</view>
			<view style="display: flex; justify-content: space-between; align-items: center; margin-top: 40rpx">
				<view style="display: flex; flex-direction: column">
					<span style="color: #a7a7a7; font-size: 22rpx">昨日收益</span>
					<span style="margin-top: 15rpx; font-weight: 600">0.00</span>
				</view>
				<view style="width: 2rpx; height: 50rpx; background-color: #cccccc" />
				<view style="display: flex; flex-direction: column">
					<span style="color: #a7a7a7; font-size: 22rpx">最新收益</span>
					<span style="margin-top: 15rpx; font-weight: 600">0.00</span>
				</view>
				<view style="width: 2rpx; height: 50rpx; background-color: #cccccc" />
				<view style="display: flex; flex-direction: column">
					<span style="color: #a7a7a7; font-size: 22rpx">累计收益</span>
					<span style="margin-top: 15rpx; font-weight: 600; text-align: right">0.00</span>
				</view>
			</view>
			<view style="display: flex; justify-content: space-around; color: #fff; margin-top: 50rpx">
				<view style="border-radius: 50rpx; padding: 14rpx 90rpx; background-color: #002faf; font-weight: 600">入金</view>
				<view style="border-radius: 50rpx; padding: 14rpx 90rpx; background-color: #ef8539; font-weight: 600">取出</view>
			</view>
		</view>

		<view style="margin-top: 40rpx; background-color: #fff; border-radius: 15rpx; display: flex; flex-direction: column; padding: 10rpx">
			<u-grid :col="4" :border="false">
				<u-grid-item v-for="item in menus" :key="item.id">
					<u-icon :name="item.icon" :size="66"></u-icon>
					<view class="grid-text" style="margin-top: 8rpx; color: #8c8c8c">{{ item.title }}</view>
				</u-grid-item>
			</u-grid>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userinfo: getApp().globalData.loginUser,
			menus: [
				{
					id: 1,
					icon: require('../../static/image/me/end.png'),
					title: '查询平仓'
				},
				{
					id: 2,
					icon: require('../../static/image/me/me.png'),
					title: '个人明细'
				},
				{
					id: 3,
					icon: require('../../static/image/me/his-announcement.png'),
					title: '历史公告'
				},
				{
					id: 4,
					icon: require('../../static/image/me/out.png'),
					title: '取出卡包'
				},
				{
					id: 5,
					icon: require('../../static/image/me/order.png'),
					title: '持仓查询'
				},
				{
					id: 6,
					icon: require('../../static/image/me/way.png'),
					title: '定期收益'
				},
				{
					id: 7,
					icon: require('../../static/image/me/pay.png'),
					title: '国际支付'
				},
				{
					id: 8,
					icon: require('../../static/image/me/loginout.png'),
					title: '退出登录'
				}
			]
		};
	},
	onLoad(e) {},
	onShow(e) {
		this.getUserInfo();
	},
	methods: {
		toPageBack() {
			uni.navigateBack({});
		},
		toPage(url) {
			uni.navigateTo({
				url: url
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
		getUserInfo() {
			var that = this;

			uni.request({
				url: '/user/user/info',
				method: 'POST',
				success(res) {
					if (res.data.code == 200) {
						getApp().globalData.loginUser = res.data.data;
						that.userinfo = res.data.data;
					}
				}
			});
		},
		postLoginOut() {
			getApp().postLoginOut;
		}
	}
};
</script>

<style scoped lang="scss">
page {
	background-color: #e9eef5;
}

.my-info {
	background-image: url(@/static/image/me/me-bg.png);
	background-size: cover;
}
</style>
