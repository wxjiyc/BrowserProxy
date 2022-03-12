package middleware

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

func FreqLimit() gin.HandlerFunc {
	// 请求限频中间件
	// API 请求限频算法，未写完，暂不考虑加入
	return func(c *gin.Context) {
		c.ClientIP()
		if strings.LastIndex(c.GetHeader("Host"), "mysyno.xyz") == len(c.GetHeader("Host"))-len("mysyno.xyz") {

		} else {
			c.Status(http.StatusGatewayTimeout)
		}
	}
}
