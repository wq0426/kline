<template>
	<view style="display: flex; flex-direction: column">
		<u-navbar back-icon-color="white" title="持仓" title-color="black"></u-navbar>
		
		<u-tabs :list="tabs" :is-scroll="false" :current="tabIndex" @change="changeTag"></u-tabs>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tabIndex: 0,
			tabs: [
				{
					name: '持仓明细'
				},
				{
					name: '历史明细'
				}
			]
		};
	},
	methods: {
		changeTag(index) {
			this.tabIndex = index;
		}
	}
};
</script>

<style></style>
