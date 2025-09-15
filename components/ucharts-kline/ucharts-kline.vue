<template>
	<view class="ucharts-kline">
		<canvas 
			canvas-id="klineChart" 
			id="klineChart" 
			class="kline-canvas"
			:style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
			@touchstart="touchStart"
			@touchmove="touchMove"
			@touchend="touchEnd"
		></canvas>
	</view>
</template>

<script>
// import uCharts from '@/uni_modules/qiun-data-charts/js_sdk/u-charts/u-charts.js'

export default {
	name: 'UchartsKline',
	props: {
		chartData: {
			type: Object,
			default: () => ({})
		},
		opts: {
			type: Object,
			default: () => ({})
		},
		canvasWidth: {
			type: Number,
			default: 350
		},
		canvasHeight: {
			type: Number,
			default: 300
		}
	},
	data() {
		return {
			chart: null,
			touchStartX: 0,
			touchStartY: 0,
			isScrolling: false
		}
	},
	watch: {
		chartData: {
			handler(newVal) {
				if (newVal && newVal.series && newVal.series.length > 0) {
					this.updateChart()
				}
			},
			deep: true,
			immediate: true
		}
	},
	mounted() {
		this.initChart()
	},
	methods: {
		initChart() {
			if (!this.chartData || !this.chartData.series) return
			
			// 简单的Canvas绘制实现
			const ctx = uni.createCanvasContext('klineChart', this)
			
			// 绘制背景
			ctx.setFillStyle('#FFFFFF')
			ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
			
			// 绘制网格线
			ctx.setStrokeStyle('#CCCCCC')
			ctx.setLineWidth(1)
			
			// 绘制K线数据
			if (this.chartData.series && this.chartData.series[0] && this.chartData.series[0].data) {
				const data = this.chartData.series[0].data
				const categories = this.chartData.categories || []
				
				if (data.length > 0) {
					// 计算价格范围
					const prices = data.map(item => [item[1], item[2], item[3]]).flat()
					const minPrice = Math.min(...prices)
					const maxPrice = Math.max(...prices)
					const priceRange = maxPrice - minPrice
					
					// 绘制K线
					const barWidth = this.canvasWidth / data.length * 0.8
					const barGap = this.canvasWidth / data.length * 0.2
					
					// 计算均线数据
					const ma5Data = this.calculateMA(data, 5)
					const ma10Data = this.calculateMA(data, 10)
					const ma30Data = this.calculateMA(data, 30)
					
					// 绘制K线
					data.forEach((item, index) => {
						const [open, high, low, close] = item
						const x = index * (barWidth + barGap) + barGap / 2
						
						// 计算Y坐标
						const highY = ((maxPrice - high) / priceRange) * (this.canvasHeight - 40) + 20
						const lowY = ((maxPrice - low) / priceRange) * (this.canvasHeight - 40) + 20
						const openY = ((maxPrice - open) / priceRange) * (this.canvasHeight - 40) + 20
						const closeY = ((maxPrice - close) / priceRange) * (this.canvasHeight - 40) + 20
						
						// 设置颜色
						const isUp = close >= open
						ctx.setStrokeStyle(isUp ? '#f04864' : '#2fc25b')
						ctx.setFillStyle(isUp ? '#f04864' : '#2fc25b')
						
						// 绘制上下影线
						ctx.beginPath()
						ctx.moveTo(x + barWidth / 2, highY)
						ctx.lineTo(x + barWidth / 2, lowY)
						ctx.stroke()
						
						// 绘制实体
						const bodyTop = Math.min(openY, closeY)
						const bodyHeight = Math.abs(closeY - openY)
						
						if (bodyHeight > 0) {
							ctx.fillRect(x, bodyTop, barWidth, bodyHeight)
						} else {
							// 十字线
							ctx.beginPath()
							ctx.moveTo(x, openY)
							ctx.lineTo(x + barWidth, openY)
							ctx.stroke()
						}
					})
					
					// 绘制均线
					this.drawMALine(ctx, ma5Data, data, maxPrice, priceRange, '#1890ff', 2)
					this.drawMALine(ctx, ma10Data, data, maxPrice, priceRange, '#2fc25b', 2)
					this.drawMALine(ctx, ma30Data, data, maxPrice, priceRange, '#facc14', 2)
				}
			}
			
			ctx.draw()
		},
		
		updateChart() {
			// 重新绘制图表
			this.initChart()
		},
		
		touchStart(e) {
			this.touchStartX = e.touches[0].clientX
			this.touchStartY = e.touches[0].clientY
			this.isScrolling = false
		},
		
		touchMove(e) {
			const deltaX = e.touches[0].clientX - this.touchStartX
			const deltaY = e.touches[0].clientY - this.touchStartY
			
			if (Math.abs(deltaX) > Math.abs(deltaY)) {
				this.isScrolling = true
				
				// 检查是否滚动到左边，触发加载更多数据
				if (deltaX > 50) {
					this.$emit('loadMore')
				}
			}
		},
		
		touchEnd(e) {
			this.isScrolling = false
		},
		
		// 计算移动平均线
		calculateMA(data, period) {
			const maData = []
			for (let i = 0; i < data.length; i++) {
				if (i < period - 1) {
					maData.push(null)
				} else {
					let sum = 0
					for (let j = i - period + 1; j <= i; j++) {
						sum += data[j][3] // 使用收盘价
					}
					maData.push(sum / period)
				}
			}
			return maData
		},
		
		// 绘制均线
		drawMALine(ctx, maData, klineData, maxPrice, priceRange, color, lineWidth) {
			ctx.setStrokeStyle(color)
			ctx.setLineWidth(lineWidth)
			ctx.beginPath()
			
			const barWidth = this.canvasWidth / klineData.length * 0.8
			const barGap = this.canvasWidth / klineData.length * 0.2
			
			let firstPoint = true
			maData.forEach((maValue, index) => {
				if (maValue !== null) {
					const x = index * (barWidth + barGap) + barGap / 2 + barWidth / 2
					const y = ((maxPrice - maValue) / priceRange) * (this.canvasHeight - 40) + 20
					
					if (firstPoint) {
						ctx.moveTo(x, y)
						firstPoint = false
					} else {
						ctx.lineTo(x, y)
					}
				}
			})
			
			ctx.stroke()
		}
	}
}
</script>

<style scoped>
.ucharts-kline {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.kline-canvas {
	border-radius: 8px;
}
</style>
