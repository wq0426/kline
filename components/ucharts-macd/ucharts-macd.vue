<template>
	<view class="ucharts-macd">
		<canvas 
			canvas-id="macdChart" 
			id="macdChart" 
			class="macd-canvas"
			:style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
		></canvas>
	</view>
</template>

<script>
// import uCharts from '@/uni_modules/qiun-data-charts/js_sdk/u-charts/u-charts.js'

export default {
	name: 'UchartsMacd',
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
			default: 160
		}
	},
	data() {
		return {
			chart: null
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
			const ctx = uni.createCanvasContext('macdChart', this)
			
			// 绘制背景
			ctx.setFillStyle('#FFFFFF')
			ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
			
			// 绘制网格线
			ctx.setStrokeStyle('#F0F0F0')
			ctx.setLineWidth(1)
			// 绘制水平网格线（减少网格线数量以适应更小的高度）
			for (let i = 0; i <= 2; i++) {
				const y = (this.canvasHeight / 2) * i
				ctx.beginPath()
				ctx.moveTo(0, y)
				ctx.lineTo(this.canvasWidth, y)
				ctx.stroke()
			}
			
			// 绘制零轴线（更粗更明显）
			ctx.setStrokeStyle('#CCCCCC')
			ctx.setLineWidth(2)
			ctx.beginPath()
			ctx.moveTo(0, this.canvasHeight / 2)
			ctx.lineTo(this.canvasWidth, this.canvasHeight / 2)
			ctx.stroke()
			
			// 绘制MACD数据
			if (this.chartData.series && this.chartData.series.length > 0) {
				// 计算数据范围用于动态缩放
				const allValues = []
				this.chartData.series.forEach(series => {
					if (series.data) {
						allValues.push(...series.data)
					}
				})
				
				const maxValue = Math.max(...allValues)
				const minValue = Math.min(...allValues)
				const valueRange = maxValue - minValue
				const scaleFactor = valueRange > 0 ? (this.canvasHeight * 0.8) / valueRange : 100
				
				// 绘制MACD柱状图（先绘制，作为背景）
				const macdSeries = this.chartData.series.find(s => s.name === 'MACD')
				if (macdSeries && macdSeries.data) {
					const dataLength = macdSeries.data.length
					const barWidth = this.canvasWidth / dataLength * 0.7
					const barGap = this.canvasWidth / dataLength * 0.3
					
					macdSeries.data.forEach((value, index) => {
						const x = index * (barWidth + barGap) + barGap / 2
						const height = Math.abs(value * scaleFactor)
						const y = value >= 0 ? this.canvasHeight / 2 - height : this.canvasHeight / 2
						
						// 使用更鲜明的颜色
						ctx.setFillStyle(value >= 0 ? '#FF4444' : '#00AA44')
						ctx.fillRect(x, y, barWidth, height)
					})
				}
				
				// 绘制DIF线（适应更小的高度）
				const difSeries = this.chartData.series.find(s => s.name === 'DIF')
				if (difSeries && difSeries.data) {
					ctx.setStrokeStyle('#FF0066')
					ctx.setLineWidth(2)
					ctx.beginPath()
					
					const dataLength = difSeries.data.length
					difSeries.data.forEach((value, index) => {
						const x = (index / (dataLength - 1)) * this.canvasWidth
						const y = this.canvasHeight / 2 - (value * scaleFactor)
						
						if (index === 0) {
							ctx.moveTo(x, y)
						} else {
							ctx.lineTo(x, y)
						}
					})
					ctx.stroke()
				}
				
				// 绘制DEA线（适应更小的高度）
				const deaSeries = this.chartData.series.find(s => s.name === 'DEA')
				if (deaSeries && deaSeries.data) {
					ctx.setStrokeStyle('#00AAFF')
					ctx.setLineWidth(2)
					ctx.beginPath()
					
					const dataLength = deaSeries.data.length
					deaSeries.data.forEach((value, index) => {
						const x = (index / (dataLength - 1)) * this.canvasWidth
						const y = this.canvasHeight / 2 - (value * scaleFactor)
						
						if (index === 0) {
							ctx.moveTo(x, y)
						} else {
							ctx.lineTo(x, y)
						}
					})
					ctx.stroke()
				}
			}
			
			ctx.draw()
		},
		
		updateChart() {
			// 重新绘制图表
			this.initChart()
		}
	}
}
</script>

<style scoped>
.ucharts-macd {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.macd-canvas {
	border-radius: 8px;
}
</style>
