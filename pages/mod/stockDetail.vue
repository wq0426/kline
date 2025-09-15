<template>
	<view style="display: flex;flex-direction: column;background-color: #ECF1F8;">
		<view style="width: 100%" :style="{ height: systemInfo.statusBarHeight + 'px' }"></view>
		<view
			style="display: flex;justify-content: space-between;background-color: #fff;padding: 30rpx;border-radius: 0rpx 0rpx 20rpx 20rpx;">
			<view style="display: flex;align-items: center;">
				<view class="">
					<u-icon name="arrow-left" style="font-size: 42rpx;"></u-icon>
				</view>
				<view style="display: flex;flex-direction: column;margin-left: 20rpx;">
					<span style="font-weight: 600;font-size: 30rpx;">{{info.name}}</span>
					<view style="margin-top: 10rpx;display: flex;align-items: center;">
						<span style="font-size: 24rpx;">{{info.code}}</span>
						<u-tag size="mini" text="交易" type="error" style="margin-left: 10rpx;"></u-tag>
					</view>
				</view>
			</view>
		</view>

		<view
			style="display: flex;flex-direction: column;background-color: #fff;padding: 30rpx;border-radius: 20rpx;margin-top: 30rpx;">
			<view style="display: flex;align-items: center;font-weight: 600;"
				:style="{ color: now.up > 0 ? '#EE0A24' : '#07C160' }">
				<span style="">
					{{ now.price }}
				</span>
				<span style="margin-left: 20rpx;">
					{{now.up}}
				</span>
				<span style="margin-left: 20rpx;">
					{{now.percent}}%
				</span>
			</view>
			<view style="margin-top: 20rpx;display: flex;flex-direction: column;">
				<span style="display: flex;align-items: center;">
					<span style="color: #909090;margin-right: 20rpx;font-size: 26rpx;">今开</span>
					<span style="width: 160rpx;">{{todayData.open_price}}</span>
					<span style="color: #909090;margin-right: 20rpx;font-size: 26rpx;">最高</span>
					<span style="width: 160rpx;">{{todayData.high_price}}</span>
				</span>
				<span style="display: flex;align-items: center;">
					<span style="color: #909090;margin-right: 20rpx;font-size: 26rpx;">昨收</span>
					<span style="width: 160rpx;">{{yestodayData.close_price}}</span>
					<span style="color: #909090;margin-right: 20rpx;font-size: 26rpx;">最低</span>
					<span style="width: 160rpx;">{{todayData.low_price}}</span>
				</span>
			</view>
		</view>

		<view
			style="display: flex;flex-direction: column;background-color: #fff;padding: 10rpx;border-radius: 20rpx;margin-top: 30rpx;width: 100%;">

			<view style="display: flex;align-items: center;padding: 10rpx;">
				<span :class="query.time_span==60?'time-span time-span-selected':'time-span'"
					@click="query.time_span=60;getStockInfo();getStockKdata();">1M</span>
				<span :class="query.time_span==300?'time-span time-span-selected':'time-span'"
					@click="query.time_span=300;getStockInfo();getStockKdata();">5M</span>
				<span :class="query.time_span==900?'time-span time-span-selected':'time-span'"
					@click="query.time_span=900;getStockInfo();getStockKdata();">15M</span>
				<span :class="query.time_span==1800?'time-span time-span-selected':'time-span'"
					@click="query.time_span=1800;getStockInfo();getStockKdata();">30M</span>
				<span :class="query.time_span==3600?'time-span time-span-selected':'time-span'"
					@click="query.time_span=3600;getStockInfo();getStockKdata();">1H</span>
				<span :class="query.time_span==86400?'time-span time-span-selected':'time-span'"
					@click="query.time_span=86400;getStockInfo();getStockKdata();">1D</span>
			</view>

			<qiun-data-charts type="candle" :opts="opts" :chartData="chartData" :ontouch="true" />

			<view style="width: 100%;height: 160px;">
				<qiun-data-charts style="margin-top: 40rpx;" type="mix" :opts="opts2" :chartData="chartData2"
					:ontouch="true" />
			</view>

		</view>

		<view
			style="display: flex;justify-content: center;position: fixed;bottom:0rpx;background-color: #fff;width: 100%;padding: 20rpx 0rpx;border-radius: 30rpx 30rpx 0rpx 0rpx;">
			<u-image src="../../static/image/icon/buy-up.png" width="300" mode="widthFix"></u-image>
			<u-image src="../../static/image/icon/buy-down.png" width="300" mode="widthFix"></u-image>
		</view>
	</view>
</template>

<script>
	import utils from '@/utils/utils.js'
	export default {
		data() {
			return {
				systemInfo: getApp().globalData.systemInfo,
				query: {
					id: 1,
					time_span: 60
				},
				info: {
					name: '现货黄金',
					code: 'GOLD',
					open_price: 0,
					yestoday_close_price: 0,
					high_price: 0,
					low_price: 0
				},
				now: {
					price: 0,
					up: 0,
					percent: 0
				},
				todayData: {
					open_price: '',
					high_price: '',
					low_price: ''
				},
				yestodayData: {
					open_price: '',
					high_price: '',
					low_price: '',
					close_price: ''
				},
				chartData: {},
				opts: {
					timing: "easeOut",
					duration: 1000,
					rotate: false,
					rotateLock: false,
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: [15, 15, 0, 15],
					fontSize: 13,
					fontColor: "#666666",
					dataLabel: false,
					dataPointShape: true,
					dataPointShapeType: "solid",
					touchMoveLimit: 60,
					enableScroll: true,
					enableMarkLine: true,
					legend: {
						show: true,
						position: "bottom",
						float: "center",
						padding: 5,
						margin: 5,
						backgroundColor: "rgba(0,0,0,0)",
						borderColor: "rgba(0,0,0,0)",
						borderWidth: 0,
						fontSize: 13,
						fontColor: "#666666",
						lineHeight: 11,
						hiddenColor: "#CECECE",
						itemGap: 10
					},
					xAxis: {
						labelCount: 4,
						itemCount: 40,
						disableGrid: true,
						gridColor: "#CCCCCC",
						gridType: "solid",
						dashLength: 4,
						scrollShow: true,
						scrollAlign: "right",
						scrollColor: "#A6A6A6",
						scrollBackgroundColor: "#EFEBEF",
						disabled: false,
						axisLine: true,
						axisLineColor: "#CCCCCC",
						calibration: false,
						fontColor: "#666666",
						fontSize: 13,
						lineHeight: 20,
						marginTop: 0,
						rotateLabel: false,
						rotateAngle: 45,
						boundaryGap: "center",
						splitNumber: 5,
						gridEval: 1,
						title: "",
						titleFontSize: 13,
						titleOffsetY: 0,
						titleOffsetX: 0,
						titleFontColor: "#666666",
						format: ""
					},
					yAxis: {
						disabled: false,
						disableGrid: false,
						splitNumber: 5,
						gridType: "solid",
						dashLength: 8,
						gridColor: "#CCCCCC",
						padding: 10,
						showTitle: false,
						data: [{
							type: "value",
							position: "right",
							disabled: false,
							axisLine: true,
							axisLineColor: "#CCCCCC",
							calibration: false,
							fontColor: "#666666",
							fontSize: 13,
							textAlign: "right",
							title: "",
							titleFontSize: 13,
							titleOffsetY: 0,
							titleOffsetX: 0,
							titleFontColor: "#666666",
							min: null,
							max: null,
							tofix: null,
							unit: "",
							format: ""
						}]
					},
					extra: {
						candle: {
							color: {
								upLine: "#f04864",
								upFill: "#f04864",
								downLine: "#2fc25b",
								downFill: "#2fc25b"
							},
							average: {
								show: true,
								name: [
									"MA5",
									"MA10",
									"MA30"
								],
								day: [
									5,
									10,
									20
								],
								color: [
									"#1890ff",
									"#2fc25b",
									"#facc14"
								]
							}
						},
						markLine: {
							type: "dash",
							dashLength: 5,
							data: [{
								value: 0,
								lineColor: "#f04864",
								showLabel: true,
								labelAlign: 'right',
								labelBgColor: "#C23531",
								labelFontColor: '#fff',
								labelOffsetX: -40
							},{
								value: 0,
								lineColor: "#f04864",
								showLabel: true,
								labelAlign: 'right',
								labelBgColor: "#C23531",
								labelFontColor: '#fff',
								labelOffsetX: -40
							}]
						},
						tooltip: {
							showBox: true,
							showArrow: true,
							showCategory: false,
							borderWidth: 0,
							borderRadius: 0,
							borderColor: "#000000",
							borderOpacity: 0.7,
							bgColor: "#000000",
							bgOpacity: 0.7,
							gridType: "solid",
							dashLength: 4,
							gridColor: "#CCCCCC",
							boxPadding: 3,
							fontSize: 13,
							lineHeight: 20,
							fontColor: "#FFFFFF",
							legendShow: true,
							legendShape: "auto",
							splitLine: true,
							horizentalLine: false,
							xAxisLabel: false,
							yAxisLabel: false,
							labelBgColor: "#FFFFFF",
							labelBgOpacity: 0.7,
							labelFontColor: "#666666"
						}
					}
				},
				chartData2: {},
				opts2: {
					timing: "easeOut",
					duration: 1000,
					rotate: false,
					rotateLock: false,
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: [15, 15, 0, 15],
					fontSize: 13,
					fontColor: "#666666",
					dataLabel: true,
					dataPointShape: true,
					dataPointShapeType: "solid",
					touchMoveLimit: 60,
					enableScroll: false,
					enableMarkLine: false,
					legend: {
						show: false,
						position: "bottom",
						float: "center",
						padding: 5,
						margin: 5,
						backgroundColor: "rgba(0,0,0,0)",
						borderColor: "rgba(0,0,0,0)",
						borderWidth: 0,
						fontSize: 13,
						fontColor: "#666666",
						lineHeight: 11,
						hiddenColor: "#CECECE",
						itemGap: 10
					},
					xAxis: {
						axisLabel: {
							show: false
						},
						disableGrid: true,
						disabled: true,
						axisLine: true,
						axisLineColor: "#CCCCCC",
						calibration: false,
						fontColor: "#666666",
						fontSize: 13,
						lineHeight: 20,
						marginTop: 0,
						rotateLabel: false,
						rotateAngle: 45,
						itemCount: 5,
						boundaryGap: "center",
						splitNumber: 5,
						gridColor: "#CCCCCC",
						gridType: "solid",
						dashLength: 4,
						gridEval: 1,
						scrollShow: false,
						scrollAlign: "left",
						scrollColor: "#A6A6A6",
						scrollBackgroundColor: "#EFEBEF",
						title: "",
						titleFontSize: 13,
						titleOffsetY: 0,
						titleOffsetX: 0,
						titleFontColor: "#666666",
						format: ""
					},
					yAxis: {
						type: 'value',
						scale: true, // 自动适配正负值
						splitNumber: 5,
						disabled: false,
						disableGrid: false,
						splitNumber: 5,
						gridType: "dash",
						dashLength: 4,
						gridColor: "#CCCCCC",
						padding: 10,
						showTitle: false,
						data: [{
							position: "right",
							textAlign: "left"
						}]
					},
					extra: {
						mix: {
							column: {
								width: 20,
								seriesGap: 2,
								barBorderCircle: false,
								linearType: "none",
								linearOpacity: 1,
								colorStop: 0
							},
							line: {
								width: 2
							}
						},
						tooltip: {
							showBox: true,
							showArrow: true,
							showCategory: false,
							borderWidth: 0,
							borderRadius: 0,
							borderColor: "#000000",
							borderOpacity: 0.7,
							bgColor: "#000000",
							bgOpacity: 0.7,
							gridType: "solid",
							dashLength: 4,
							gridColor: "#CCCCCC",
							boxPadding: 3,
							fontSize: 13,
							lineHeight: 20,
							fontColor: "#FFFFFF",
							legendShow: true,
							legendShape: "auto",
							splitLine: true,
							horizentalLine: false,
							xAxisLabel: false,
							yAxisLabel: false,
							labelBgColor: "#FFFFFF",
							labelBgOpacity: 0.7,
							labelFontColor: "#666666"
						},
						markLine: {
							type: "solid",
							dashLength: 4,
							data: [{
								value: 0,
								lineColor: "#f04864",
								showLabel: true,
								labelAlign: 'right',
								labelBgColor: "#C23531",
								labelFontColor: '#fff',
								labelOffsetX: -40
							}]
						}
					}
				}
			}
		},
		onLoad(e) {

			var that = this;

			that.query.id = 1

			uni.$on('onWsMsg', function(res) {
				that.onWsMessage(res);
			});

		},
		onUnload() {
			uni.$off('onWsMsg')
		},
		onReady() {
			this.getStockInfo()
			this.getStockKdata()

			this.getServerData2();
		},
		methods: {
			onWsMessage(res) {

				if (res.type == 'onStockPrice') {
					if (this.query.id == res.data.id) {
						this.now.price = res.data.now
						this.now.up = res.data.up
						this.now.percent = res.data.percent

						this.chartData.series[0].data[this.chartData.series[0].data.length-1][1]=res.data.high
						this.chartData.series[0].data[this.chartData.series[0].data.length-1][2]=res.data.low
						this.chartData.series[0].data[this.chartData.series[0].data.length-1][3]=res.data.now
						
						console.log(this.chartData.series[0].data[this.chartData.series[0].data.length-1])


						this.$forceUpdate(this.opts.extra.markLine)
					}

				} else if (res.type == 'onStockTerm') {
					this.getStockKdata()
				}
			},
			getStockInfo() {

				var that = this;

				uni.request({
					url: '/product/stock/info',
					method: 'POST',
					data: this.query,
					success(res) {
						if (res.data.code == 200) {

							that.info = res.data.data.info

							if (res.data.data.todayData != null) {
								that.todayData = res.data.data.todayData
							}

							if (res.data.data.yestodayData) {
								that.yestodayData = res.data.data.yestodayData
							}
						}
					}
				});
			},
			getStockKdata() {

				var that = this;

				uni.request({
					url: '/product/stock/getKdata',
					method: 'POST',
					data: this.query,
					success(res) {
						if (res.data.code == 200) {
							that.buildKdata(res.data.data)
						}
					}
				});

			},
			buildKdata(list) {

				var x_times = [];
				var datas = [];

				if (this.query.time_span <= 3600) {
					var format = 'HH:MM'
				} else {
					var format = "mm:dd"
				}

				for (var i in list) {
					x_times.push(utils.dateFormat(format, new Date(list[i].close_time)))

					datas.push([list[i].open_price, list[i].high_price, list[i].low_price, list[i].close_price ?? list[i]
						.open_price
					])
				}

				var res = {
					categories: x_times,
					series: [{
						name: "上证指数",
						data: datas
					}]
				};

				this.chartData = JSON.parse(JSON.stringify(res));
			},
			getServerData2() {
				//模拟从服务器获取数据时的延时
				setTimeout(() => {
					//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
					let res = {
						categories: ["2018", "2019", "2020", "2021", "2022", "2023"],
						series: [{
								name: "曲线",
								type: "line",
								style: "curve",
								color: "#FF669F",
								disableLegend: true,
								data: [70, 50, 85, 130, -64, 88],
								labelShow: false
							},
							{
								name: "折线",
								type: "line",
								style: "curve",
								color: "#40FFFF",
								data: [120, 140, 105, 170, -95, 160]
							},
							{
								name: "柱1",
								index: 1,
								type: "column",
								color: '#D8F3F0',
								data: [40, 30, -55, 110, 24, 58],
							},
						]
					};
					this.chartData2 = JSON.parse(JSON.stringify(res));
				}, 500);
			}
		}
	}
</script>

<style>
	page {
		background-color: #e9edf4;
	}

	.time-span {
		padding: 0rpx 15rpx;
		color: #A6A6A6;
	}

	.time-span-selected {
		background-color: #B6D5FF;
		color: #0054DA;
		border-radius: 10rpx;
	}
</style>