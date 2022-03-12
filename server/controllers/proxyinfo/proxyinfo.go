package proxyinfo

import (
	"BrowserProxy/server/services/proxyinfo"
	"github.com/gin-gonic/gin"
	"net/http"
)

func PingPong(c *gin.Context) {
	var service proxyinfo.ProxyInfoService
	// 绑定GET请求参数
	if err := c.ShouldBindQuery(&service); err == nil {
		// 传入 service ,获取返回结果
		res := service.PingPong(c)
		// 无 error 则返回结果
		c.JSON(http.StatusOK, res)
	} else {
		// 有 error 则返回 err
		c.JSON(http.StatusOK, gin.H{"error": err.Error()})
	}
}

func GetList(c *gin.Context) {
	var service proxyinfo.ProxyInfoService
	if err := c.ShouldBindQuery(&service); err == nil {
		res := service.GetList(c)
		c.JSON(http.StatusOK, res)
	} else {
		c.JSON(http.StatusOK, gin.H{"error": err.Error()})
	}
}
