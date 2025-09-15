<template>
	<view style="display: flex; flex-direction: column; padding: 20rpx; width: 100%">
		<view style="display: flex; flex-direction: column; background-color: #fff; padding: 30rpx; width: 100%">
			<view style="width: 100%" :style="{ height: systemInfo.statusBarHeight + 'px' }"></view>
			<view style="display: flex; justify-content: space-between">
				<view style="font-weight: 600; font-size: 32rpx">
					国泰
					<span style="color: #325ec8">海通</span>
				</view>
				<view @click="toPage('/pages/kf/kf')">
					<u-icon name="server-fill"></u-icon>
				</view>
			</view>
			<view style="margin-top: 20rpx">
				<u-swiper :list="swipers" @click="onClickSwiper"></u-swiper>
			</view>
			<view style="display: flex; flex-direction: column; margin-top: 40rpx">
				<view style="display: flex; justify-content: space-between">
					<view style="font-weight: 600; font-size: 32rpx">
						热门
						<span style="color: #325ec8">头条</span>
					</view>
					<view class="" @click="isShowHot = !isShowHot">
						<u-icon :name="isShowHot ? 'arrow-up' : 'arrow-down'"></u-icon>
					</view>
				</view>
				<view v-if="isShowHot" style="display: flex; flex-direction: column; margin-top: 10rpx">
					<view v-for="item in hots" :key="item.id" style="margin-top: 15rpx" @click="onClickNews(item)">
						<u-tag text="热门" type="error" size="mini" />
						<span style="margin-left: 20rpx; overflow: hidden">{{ item.title }}</span>
					</view>
				</view>
			</view>
			<view style="display: flex; flex-direction: column; margin-top: 60rpx; width: 100%">
				<view style="display: flex">
					<view style="font-weight: 600; font-size: 32rpx">
						热门
						<span style="color: #325ec8">产品</span>
					</view>
				</view>
				<view style="display: flex; flex-direction: column; width: 100%">
					<view style="display: flex; align-items: center; justify-content: space-between; color: #c8c8c8; margin-top: 20rpx; width: 100%">
						<view style="width: 30%">名称/代码</view>
						<view style="display: flex; align-items: center; width: 20%; justify-content: center">
							最新
							<u-image width="30rpx" height="30rpx" src="../../static/image/icon/ud.png"></u-image>
						</view>
						<view style="display: flex; align-items: center; width: 24%; justify-content: center;text-align: center;">
							涨跌
							<u-image width="30rpx" height="30rpx" src="../../static/image/icon/ud.png"></u-image>
						</view>
						<view style="display: flex; align-items: flex-end; width: 26%; justify-content: flex-end; margin-right: 10rpx">
							涨跌幅
							<u-image width="30rpx" height="30rpx" src="../../static/image/icon/ud.png"></u-image>
						</view>
					</view>
					<view
						v-for="item in stocks"
						:key="item.id"
						style="
							display: flex;
							align-items: center;
							justify-content: space-between;
							margin-top: 40rpx;
							border-bottom: 2rpx solid #f1f1f1;
							padding-bottom: 20rpx;
							width: 100%;
						"
						@click="toPage('/pages/mod/stockDetail?id='+item.id)"
					>
						<view style="display: flex; flex-direction: column; width: 30%">
							<span style="font-size: 27rpx; color: #000; font-weight: 600">{{ item.name }}</span>
							<view style="margin-top: 8rpx">
								<span style="font-size: 24rpx">{{ item.code }}</span>
								<u-tag type="error" size="mini" style="margin-left: 8rpx" text="交易" />
							</view>
						</view>
						<view style="width: 20%; display: flex; justify-content: center;font-size: 28rpx;">
							{{ item.price }}
						</view>
						<view style="width: 24%; display: flex; justify-content: center;font-size: 28rpx;">
							{{ item.up }}
						</view>
						<view style="width: 26%; align-items: flex-end; display: flex; justify-content: flex-end">
							<span v-if="item.percent"
								style="background-color: #ee0a24; color: #fff; width: 90%; text-align: center; border-radius: 8rpx; padding: 4rpx"
								:style="{ backgroundColor: item.percent > 0 ? '#EE0A24' : '#07C160' }"
							>
								{{ item.percent > 0 ? '+' : '' }}{{ item.percent }}%
							</span>
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
			systemInfo: getApp().globalData.systemInfo,
			userinfo: getApp().globalData.loginUser.userinfo,
			swipers: [],
			isShowHot: true,
			hots: [],
			stocks: {}
		};
	},
	onLoad() {
		var that = this;

		uni.$on('onWsMsg', function (res) {
			that.onWsMessage(res);
		});

		this.getNews();
		this.getSwipers();
		this.getStocks();
	},
	onUnload() {
		uni.$off('onWsMsg')
	},
	methods: {
		toPage(url) {
			
			var list=[
				'/pages/index/index',
				'/pages/order/order',
				'/pages/kf/kf',
				'/pages/me/me'
			];
			
			if(list.indexOf(url)>=0){
				
				uni.switchTab({
					url:url
				})
				
			}else{
				uni.navigateTo({
					url: url
				});
			}
			
		},
		onClickSwiper(i) {

			var url = this.swipers[i].path;
			
			var list=[
				'/pages/index/index',
				'/pages/order/order',
				'/pages/kf/kf',
				'/pages/me/me'
			];

			if(list.indexOf(url)>=0){
				
				uni.switchTab({
					url:url
				})

			}else{
				uni.navigateTo({
					url: url
				});
			}
			
		},
		onWsMessage(res) {
			
			if (res.type == 'onStockPrice') {
				
				if(this.stocks['s'+res.data.id]){
					this.stocks['s'+res.data.id].price=res.data.now
					this.stocks['s'+res.data.id].up=res.data.up
					this.stocks['s'+res.data.id].percent=res.data.percent
					this.$forceUpdate()
				}
			}
		},
		getStocks() {

			var that = this;

			uni.request({
				url: '/product/stock/list',
				method: 'POST',
				success(res) {
					if (res.data.code == 200) {
						
						var list=res.data.data
						
						for(var i in list){
							list[i].price=0
							list[i].up=0
							list[i].percent=0
						}
						
						that.stocks = list;
					}
				}
			});
		},
		getNews() {
			var that = this;

			uni.request({
				url: '/sup/sup/getNews',
				method: 'POST',
				success(res) {
					if (res.data.code == 200) {
						that.hots = res.data.data;
					}
				}
			});
		},
		getSwipers() {
			var that = this;

			uni.request({
				url: '/sup/sup/getSwipers',
				method: 'POST',
				success(res) {
					if (res.data.code == 200) {
						that.swipers = res.data.data;
					}
				}
			});
		},
		onClickNews(item){
			
			uni.navigateTo({
				url:'/pages/sys/viewHtml?id='+item.id
			})
			
		}
	}
};
</script>

<style scoped lang="scss">
page {
	background-color: #e9edf4;
}
</style>
