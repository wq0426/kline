<template>
	<view style="display: flex;flex-direction: column;background-color: #ECF1F8;">
		<view style="width: 100%" :style="{ height: systemInfo.statusBarHeight + 'px' }"></view>
		<view
			style="display: flex;justify-content: space-between;background-color: #fff;padding: 30rpx;border-radius: 0rpx 0rpx 20rpx 20rpx;">
			<view style="display: flex;align-items: center;">
				<view class="" @click="goBack">
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

			<!-- K线图 -->
			<view style="position: relative;">
				<ucharts-kline 
					v-if="chartDataReady && !chartError"
					:chartData="chartData" 
					:opts="klineOpts"
					:canvasWidth="350"
					:canvasHeight="300"
					@loadMore="loadMoreData"
				/>
				<view v-else-if="chartError" style="height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #999; padding: 20px;">
					<text style="font-size: 16px; margin-bottom: 10px;">图表加载失败</text>
					<text style="font-size: 14px; color: #666;">当前价格: {{now.price}}</text>
					<text style="font-size: 14px; color: #666;">涨跌: {{now.up}} ({{now.percent}}%)</text>
				</view>
				<view v-else style="height: 300px; display: flex; align-items: center; justify-content: center; color: #999;">
					加载中...
				</view>
				
				<!-- 当前价格辅助线 -->
				<view v-if="showPriceLine" 
					:style="{
						position: 'absolute',
						top: priceLineY + 'px',
						left: '0px',
						right: '0px',
						height: '1px',
						backgroundColor: '#FF6B6B',
						zIndex: 1000,
						pointerEvents: 'none'
					}">
				</view>
			</view>

			<!-- MACD指标 -->
			<view style="width: 100%;height: 100px;">
				<ucharts-macd 
					v-if="chartData2 && chartData2.series && chartData2.series.length > 0"
					style="margin-top: 20rpx;" 
					:chartData="chartData2"
					:opts="opts2"
					:canvasWidth="350"
					:canvasHeight="100"
				/>
				<view v-else style="height: 100px; display: flex; align-items: center; justify-content: center; color: #999;">
					MACD加载中...
				</view>
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
	import UchartsKline from '@/components/ucharts-kline/ucharts-kline.vue'
	import UchartsMacd from '@/components/ucharts-macd/ucharts-macd.vue'
	
	export default {
		components: {
			UchartsKline,
			UchartsMacd
		},
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
				// 图表相关数据
				chartData: {},
				chartDataReady: false,
				chartError: false,
				// 价格辅助线相关
				showPriceLine: false,
				priceLineY: 0,
				// 触摸相关
				touchStartX: 0,
				touchStartY: 0,
				isScrolling: false,
				// 数据加载相关
				isLoadingMore: false,
				hasMoreData: true,
				// 实时数据模拟
				realtimeTimer: null,
				// 简化的K线图配置
				klineOpts: {
					background: '#FFFFFF',
					padding: [15, 15, 0, 15],
					animation: true,
					animationDuration: 1000,
					color: ['#1890FF', '#91CB74', '#FAC858', '#EE6666', '#73C0DE', '#3CA272', '#FC8452', '#9A60B4', '#ea7ccc'],
					dataLabel: false,
					dataPointShape: true,
					enableScroll: true,
					legend: {
						show: true,
						position: 'bottom',
						float: 'center',
						padding: 5,
						margin: 5,
						backgroundColor: 'rgba(0,0,0,0)',
						borderColor: 'rgba(0,0,0,0)',
						borderWidth: 0,
						fontSize: 13,
						fontColor: '#666666',
						lineHeight: 11,
						hiddenColor: '#CECECE',
						itemGap: 10
					},
					xAxis: {
						labelCount: 4,
						itemCount: 50,
						disableGrid: true,
						gridColor: '#CCCCCC',
						gridType: 'solid',
						dashLength: 4,
						scrollShow: true,
						scrollAlign: 'right',
						scrollColor: '#A6A6A6',
						scrollBackgroundColor: '#EFEBEF',
						disabled: false,
						axisLine: true,
						axisLineColor: '#CCCCCC',
						calibration: false,
						fontColor: '#666666',
						fontSize: 13,
						lineHeight: 20,
						marginTop: 0,
						rotateLabel: false,
						rotateAngle: 45,
						boundaryGap: 'center',
						splitNumber: 5,
						gridEval: 1,
						title: '',
						titleFontSize: 13,
						titleOffsetY: 0,
						titleOffsetX: 0,
						titleFontColor: '#666666',
						format: ''
					},
					yAxis: {
						disabled: false,
						disableGrid: false,
						splitNumber: 5,
						gridType: 'solid',
						dashLength: 8,
						gridColor: '#CCCCCC',
						padding: 10,
						showTitle: false,
						data: [{
							type: 'value',
							position: 'right',
							disabled: false,
							axisLine: true,
							axisLineColor: '#CCCCCC',
							calibration: false,
							fontColor: '#666666',
							fontSize: 13,
							textAlign: 'right',
							title: '',
							titleFontSize: 13,
							titleOffsetY: 0,
							titleOffsetX: 0,
							titleFontColor: '#666666',
							min: null,
							max: null,
							tofix: null,
							unit: '',
							format: ''
						}]
					},
					extra: {
						candle: {
							color: {
								upLine: '#f04864',
								upFill: '#f04864',
								downLine: '#2fc25b',
								downFill: '#2fc25b'
							},
							average: {
								show: true,
								name: ['MA5', 'MA10', 'MA30'],
								day: [5, 10, 30],
								color: ['#1890ff', '#2fc25b', '#facc14']
							}
						},
						markLine: {
							type: 'dash',
							dashLength: 5,
							data: [{
								value: 0,
								lineColor: '#f04864',
								showLabel: true,
								labelAlign: 'right',
								labelBgColor: '#C23531',
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
							borderColor: '#000000',
							borderOpacity: 0.7,
							bgColor: '#000000',
							bgOpacity: 0.7,
							gridType: 'solid',
							dashLength: 4,
							gridColor: '#CCCCCC',
							boxPadding: 3,
							fontSize: 13,
							lineHeight: 20,
							fontColor: '#FFFFFF',
							legendShow: true,
							legendShape: 'auto',
							splitLine: true,
							horizentalLine: false,
							xAxisLabel: false,
							yAxisLabel: false,
							labelBgColor: '#FFFFFF',
							labelBgOpacity: 0.7,
							labelFontColor: '#666666'
						}
					}
				},
				opts: {
					timing: "easeOut",
					duration: 1000,
					rotate: false,
					rotateLock: false,
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
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
						itemCount: 50,
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
								name: ["MA5", "MA10", "MA30"],
								day: [5, 10, 30],
								color: ["#1890ff", "#2fc25b", "#facc14"]
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
					background: '#FFFFFF',
					padding: [15, 15, 0, 15],
					animation: true,
					animationDuration: 1000,
					color: ['#1890FF', '#91CB74', '#FAC858', '#EE6666', '#73C0DE', '#3CA272', '#FC8452', '#9A60B4', '#ea7ccc'],
					dataLabel: false,
					dataPointShape: true,
					enableScroll: true,
					legend: {
						show: true,
						position: 'bottom',
						float: 'center',
						padding: 5,
						margin: 5,
						backgroundColor: 'rgba(0,0,0,0)',
						borderColor: 'rgba(0,0,0,0)',
						borderWidth: 0,
						fontSize: 13,
						fontColor: '#666666',
						lineHeight: 11,
						hiddenColor: '#CECECE',
						itemGap: 10
					},
					xAxis: {
						axisLabel: {
							show: false
						},
						disableGrid: true,
						disabled: true,
						axisLine: true,
						axisLineColor: '#CCCCCC',
						calibration: false,
						fontColor: '#666666',
						fontSize: 13,
						lineHeight: 20,
						marginTop: 0,
						rotateLabel: false,
						rotateAngle: 45,
						itemCount: 50,
						boundaryGap: 'center',
						splitNumber: 5,
						gridColor: '#CCCCCC',
						gridType: 'solid',
						dashLength: 4,
						gridEval: 1,
						scrollShow: true,
						scrollAlign: 'right',
						scrollColor: '#A6A6A6',
						scrollBackgroundColor: '#EFEBEF',
						title: '',
						titleFontSize: 13,
						titleOffsetY: 0,
						titleOffsetX: 0,
						titleFontColor: '#666666',
						format: ''
					},
					yAxis: {
						type: 'value',
						scale: true,
						splitNumber: 5,
						disabled: false,
						disableGrid: false,
						gridType: 'dash',
						dashLength: 4,
						gridColor: '#CCCCCC',
						padding: 10,
						showTitle: false,
						data: [{
							position: 'right',
							textAlign: 'left'
						}]
					},
					extra: {
						mix: {
							column: {
								width: 20,
								seriesGap: 2,
								barBorderCircle: false,
								linearType: 'none',
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
							borderColor: '#000000',
							borderOpacity: 0.7,
							bgColor: '#000000',
							bgOpacity: 0.7,
							gridType: 'solid',
							dashLength: 4,
							gridColor: '#CCCCCC',
							boxPadding: 3,
							fontSize: 13,
							lineHeight: 20,
							fontColor: '#FFFFFF',
							legendShow: true,
							legendShape: 'auto',
							splitLine: true,
							horizentalLine: false,
							xAxisLabel: false,
							yAxisLabel: false,
							labelBgColor: '#FFFFFF',
							labelBgOpacity: 0.7,
							labelFontColor: '#666666'
						},
						markLine: {
							type: 'solid',
							dashLength: 4,
							data: [{
								value: 0,
								lineColor: '#f04864',
								showLabel: true,
								labelAlign: 'right',
								labelBgColor: '#C23531',
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
			// 清除定时器
			if (this.realtimeTimer) {
				clearInterval(this.realtimeTimer)
			}
		},
		onReady() {
			// 延迟初始化，确保组件完全加载
			setTimeout(() => {
				try {
					// 初始化测试数据
					this.initTestData()
					this.getStockInfo()
					this.getStockKdata()
					this.getServerData2();
					// 启动实时数据模拟
					this.startRealtimeData();
				} catch (error) {
					console.error('页面初始化失败:', error)
					// 如果初始化失败，至少显示基本信息
					this.initTestData()
				}
			}, 500);
		},
		methods: {
			// 返回按钮
			goBack() {
				uni.navigateBack()
			},
			
			// 初始化测试数据
			initTestData() {
				// 初始化股票信息
				this.info = {
					name: '现货黄金',
					code: 'GOLD',
					open_price: 2650.50,
					yestoday_close_price: 2648.20,
					high_price: 2655.80,
					low_price: 2645.30
				}
				
				// 初始化当前价格
				this.now = {
					price: 2652.30,
					up: 4.10,
					percent: 0.15
				}
				
				// 初始化今日数据
				this.todayData = {
					open_price: '2650.50',
					high_price: '2655.80',
					low_price: '2645.30'
				}
				
				// 初始化昨日数据
				this.yestodayData = {
					open_price: '2648.20',
					high_price: '2652.10',
					low_price: '2643.50',
					close_price: '2648.20'
				}
				
				// 生成初始K线数据
				this.generateInitialKlineData()
			},
			
			// 生成初始K线数据
			generateInitialKlineData() {
				try {
					const categories = []
					const datas = []
					const basePrice = 2648.20
					
					// 生成30个K线数据点（减少数据量避免渲染问题）
					for (let i = 0; i < 30; i++) {
						const timeFormat = this.query.time_span <= 3600 ? 'HH:MM' : 'mm:dd'
						const time = new Date(Date.now() - (30 - i) * this.query.time_span * 1000)
						categories.push(utils.dateFormat(timeFormat, time))
						
						// 生成K线数据
						const changePercent = (Math.random() - 0.5) * 0.02 // ±1%的波动
						const openPrice = basePrice * (1 + changePercent)
						const volatility = basePrice * 0.01 // 1%的波动幅度
						
						const closePrice = openPrice * (1 + (Math.random() - 0.5) * 0.01)
						const highPrice = Math.max(openPrice, closePrice) + Math.random() * volatility
						const lowPrice = Math.min(openPrice, closePrice) - Math.random() * volatility
						
						// 确保数据格式正确，保留2位小数
						datas.push([
							parseFloat(openPrice.toFixed(2)),
							parseFloat(highPrice.toFixed(2)),
							parseFloat(lowPrice.toFixed(2)),
							parseFloat(closePrice.toFixed(2))
						])
					}
					
					// 确保数据结构正确
					this.chartData = {
						categories: categories,
						series: [{
							name: "现货黄金",
							data: datas
						}]
					}
					
					// 延迟设置数据准备状态
					setTimeout(() => {
						this.chartDataReady = true
						this.chartError = false
						console.log('K线数据已生成:', this.chartData)
					}, 200)
					
				} catch (error) {
					console.error('生成K线数据失败:', error)
					this.chartDataReady = false
					this.chartError = true
				}
			},
			
			// WebSocket消息处理
			onWsMessage(res) {
				if (res.type == 'onStockPrice') {
					if (this.query.id == res.data.id) {
						this.now.price = res.data.now
						this.now.up = res.data.up
						this.now.percent = res.data.percent

						// 更新当前K线数据
						if (this.chartData.series && this.chartData.series[0] && this.chartData.series[0].data.length > 0) {
							const lastIndex = this.chartData.series[0].data.length - 1
							this.chartData.series[0].data[lastIndex][1] = res.data.high
							this.chartData.series[0].data[lastIndex][2] = res.data.low
							this.chartData.series[0].data[lastIndex][3] = res.data.now
							
							// 更新价格辅助线
							this.updatePriceLine(res.data.now)
						}

						this.$forceUpdate()
					}
				} else if (res.type == 'onStockTerm') {
					this.getStockKdata()
				}
			},
			
			// 更新价格辅助线
			updatePriceLine(price) {
				if (this.chartData.series && this.chartData.series[0] && this.chartData.series[0].data.length > 0) {
					// 计算价格在图表中的Y坐标
					const data = this.chartData.series[0].data
					const prices = data.map(item => [item[1], item[2], item[3]]).flat()
					const minPrice = Math.min(...prices)
					const maxPrice = Math.max(...prices)
					const priceRange = maxPrice - minPrice
					
					if (priceRange > 0) {
						const chartHeight = 300 // 图表高度
						const priceRatio = (price - minPrice) / priceRange
						this.priceLineY = chartHeight * (1 - priceRatio) + 50 // 50是图表顶部偏移
						this.showPriceLine = true
					}
				}
			},
			
			// 图表触摸事件
			onChartTouchStart(e) {
				this.touchStartX = e.touches[0].clientX
				this.touchStartY = e.touches[0].clientY
				this.isScrolling = false
			},
			
			onChartTouchMove(e) {
				const deltaX = e.touches[0].clientX - this.touchStartX
				const deltaY = e.touches[0].clientY - this.touchStartY
				
				// 判断是否为水平滚动
				if (Math.abs(deltaX) > Math.abs(deltaY)) {
					this.isScrolling = true
					
					// 检查是否滚动到左边，触发加载更多数据
					if (deltaX > 50 && !this.isLoadingMore && this.hasMoreData) {
						this.loadMoreData()
					}
				}
			},
			
			onChartTouchEnd(e) {
				this.isScrolling = false
			},
			
			// 加载更多数据
			loadMoreData() {
				if (this.isLoadingMore || !this.hasMoreData) return
				
				this.isLoadingMore = true
				console.log('加载更多历史数据...')
				
				// 模拟加载延迟
				setTimeout(() => {
					this.generateMoreKlineData()
					this.isLoadingMore = false
				}, 1000)
			},
			
			// 启动实时数据模拟
			startRealtimeData() {
				this.realtimeTimer = setInterval(() => {
					this.simulateRealtimeData()
				}, 3000) // 每3秒更新一次
			},
			
			// 模拟实时数据
			simulateRealtimeData() {
				try {
					if (!this.chartDataReady || !this.chartData.series || !this.chartData.series[0] || this.chartData.series[0].data.length === 0) {
						return
					}
					
					const lastData = this.chartData.series[0].data[this.chartData.series[0].data.length - 1]
					const lastClose = lastData[3]
					
					// 生成随机价格波动
					const changePercent = (Math.random() - 0.5) * 0.02 // ±1%的波动
					const newPrice = lastClose * (1 + changePercent)
					const volatility = lastClose * 0.005 // 0.5%的波动幅度
					
					const newHigh = Math.max(lastData[1], newPrice + Math.random() * volatility)
					const newLow = Math.min(lastData[2], newPrice - Math.random() * volatility)
					
					// 更新当前价格
					this.now.price = newPrice.toFixed(2)
					this.now.up = (newPrice - lastClose).toFixed(2)
					this.now.percent = ((newPrice - lastClose) / lastClose * 100).toFixed(2)
					
					// 更新K线数据
					lastData[1] = parseFloat(newHigh.toFixed(2))
					lastData[2] = parseFloat(newLow.toFixed(2))
					lastData[3] = parseFloat(newPrice.toFixed(2))
					
					// 更新价格辅助线
					this.updatePriceLine(newPrice)
					
					// 强制更新图表
					this.$forceUpdate()
					
				} catch (error) {
					console.error('实时数据更新失败:', error)
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
						name: "现货黄金",
						data: datas
					}]
				};

				this.chartData = JSON.parse(JSON.stringify(res));
			},
			
			// 生成更多K线数据（用于测试）
			generateMoreKlineData() {
				if (!this.chartData.series || !this.chartData.series[0]) return
				
				const currentData = this.chartData.series[0].data
				const lastData = currentData[currentData.length - 1]
				const lastClose = lastData[3]
				
				// 生成20个新的K线数据点
				for (let i = 0; i < 20; i++) {
					const changePercent = (Math.random() - 0.5) * 0.03 // ±1.5%的波动
					const newClose = lastClose * (1 + changePercent)
					const volatility = lastClose * 0.01 // 1%的波动幅度
					
					const newOpen = lastClose
					const newHigh = Math.max(newOpen, newClose) + Math.random() * volatility
					const newLow = Math.min(newOpen, newClose) - Math.random() * volatility
					
					// 生成时间标签
					const timeFormat = this.query.time_span <= 3600 ? 'HH:MM' : 'mm:dd'
					const newTime = new Date(Date.now() - (20 - i) * this.query.time_span * 1000)
					const timeLabel = utils.dateFormat(timeFormat, newTime)
					
					currentData.unshift([newOpen, newHigh, newLow, newClose])
					this.chartData.categories.unshift(timeLabel)
				}
				
				// 限制数据点数量，保持性能
				if (currentData.length > 100) {
					currentData.splice(100)
					this.chartData.categories.splice(100)
				}
				
				this.$forceUpdate()
			},
			getServerData2() {
				//模拟从服务器获取数据时的延时
				setTimeout(() => {
					// 生成MACD数据
					this.generateMACDData();
				}, 500);
			},
			
			// 生成MACD数据
			generateMACDData() {
				// 生成50个数据点
				const categories = []
				const difData = []
				const deaData = []
				const macdData = []
				
				for (let i = 0; i < 50; i++) {
					const timeFormat = this.query.time_span <= 3600 ? 'HH:MM' : 'mm:dd'
					const time = new Date(Date.now() - (50 - i) * this.query.time_span * 1000)
					categories.push(utils.dateFormat(timeFormat, time))
					
					// 生成MACD指标数据（增大数据变化幅度）
					const baseValue = Math.sin(i * 0.2) * 2 // 使用正弦波作为基础
					const randomFactor = (Math.random() - 0.5) * 1.5 // 增加随机性
					const dif = baseValue + randomFactor
					const dea = dif * 0.7 + (Math.random() - 0.5) * 0.8
					const macd = (dif - dea) * 3 // 增大MACD柱状图的变化
					
					difData.push(parseFloat(dif.toFixed(4)))
					deaData.push(parseFloat(dea.toFixed(4)))
					macdData.push(parseFloat(macd.toFixed(4)))
				}
				
				const res = {
					categories: categories,
					series: [{
						name: "DIF",
						type: "line",
						style: "curve",
						color: "#FF669F",
						data: difData,
						labelShow: false,
						dataLabel: false
					},
					{
						name: "DEA",
						type: "line",
						style: "curve",
						color: "#40FFFF",
						data: deaData,
						labelShow: false,
						dataLabel: false
					},
					{
						name: "MACD",
						index: 1,
						type: "column",
						color: function(val) {
							return val >= 0 ? '#FF6B6B' : '#2FC25B'
						},
						data: macdData,
						labelShow: false,
						dataLabel: false
					}]
				};
				
				this.chartData2 = JSON.parse(JSON.stringify(res));
				console.log('MACD数据已生成:', this.chartData2)
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