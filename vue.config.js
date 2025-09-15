module.exports = {
	// 配置路径别名
	configureWebpack: {
		devServer: {
			// 调试时允许内网穿透，让外网的人访问到本地调试的H5页面
			disableHostCheck: true
		}
	},
	//productionSourceMap: false,
	// 修改build时生成的index.html的输出路径
	indexPath: 'index.html',
	// 修改静态资源的引用路径
	publicPath: '/m/uu'
}