<template>
	<view></view>
</template>
<script>

export default {
	props: {
		url:{
			type:String,
			default:'' // 音频路径
		},
		loop:{
			type:Boolean,
			default:true // 是否循环播放
		},
		volume:{
			type:Number,
			default:0.4
		}
	},
	data() {
		return {
			innerAudioContext:null,
			lastRecord:''
		};
	},
	created() {
		this.innerAudioContext = uni.createInnerAudioContext();
	},
	methods: {
		play() { // url即为音频路径
		
			var url = this.url
		
			if (!this.innerAudioContext.paused) {
				this.innerAudioContext.stop(); // 停止
			}
		
			this.lastRecord = url; // 将路径赋值给定义的变量好做判断
			this.innerAudioContext.src = url; // 配置音频播放路径
			this.innerAudioContext.volume=this.volume
			this.innerAudioContext.play(); // 播放
			this.innerAudioContext.loop = this.loop // 是否循环播放
		},
		stop() {
			
			if (this.innerAudioContext != 0) {
				this.innerAudioContext.stop()
			}
		},
		setVolume(val) {
			this.innerAudioContext.volume=val

		}
	}
};
</script>

<style>
	.sc-num {
		width: 22px;
		height: 22px;
		color: white;
		background-color: #000000;
		text-align: center;
		font-size: 18px;
		font-weight: 600;
		border-radius: 2px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 4px;
		box-sizing: border-box;
	}
</style>
