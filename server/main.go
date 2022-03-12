package main

import (
	"BrowserProxy/server/pkg/list"
	"BrowserProxy/server/pkg/setting"
	"BrowserProxy/server/pkg/ssh"
	"BrowserProxy/server/routers"
	"github.com/gin-gonic/gin"
	"strconv"
)

func init() {
	// 初始化全局设置
	setting.Setup()
	// 读取节点账号密码JSON文件
	ssh.ReadList()
	// 生成节点列表，供浏览器请求
	list.GenNodeList()
}

func main() {
	// 运行模式设定
	gin.SetMode(setting.ServerSetting.RunMode)
	// 初始化路由
	r := routers.InitRouter()
	// 运行
	r.Run(":" + strconv.Itoa(setting.ServerSetting.HttpPort))
}
