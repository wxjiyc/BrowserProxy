package proxyinfo

import (
	"BrowserProxy/server/pkg/list"
	"BrowserProxy/server/pkg/serializer"
	"BrowserProxy/server/pkg/utils"
	"github.com/gin-gonic/gin"
)

type ProxyInfoService struct {
	ip string `form:"ip"`
}

func (service *ProxyInfoService) PingPong(c *gin.Context) serializer.Response {
	return serializer.Response{
		Code: 0,
		// 返回服务端 IP
		Data: map[string]interface{}{
			"ip": utils.GetIpv4(),
		},
		Msg: "browser proxy service is running",
	}
}

func (service *ProxyInfoService) GetList(c *gin.Context) serializer.Response {
	return serializer.Response{
		Code: 0,
		// 返回节点信息列表
		Data: map[string]interface{}{
			"list": list.NodeList,
		},
		Msg: "get list success",
	}
}
