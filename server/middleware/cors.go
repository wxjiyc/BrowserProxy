package middleware

import "github.com/gin-gonic/gin"

func CORS() gin.HandlerFunc {
	// CORS 中间件
	// 在响应头中加入 CORS 解决跨域问题
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
	}
}
