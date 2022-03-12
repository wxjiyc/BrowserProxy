package routers

import (
	"BrowserProxy/server/controllers/proxyinfo"
	"BrowserProxy/server/middleware"
	"github.com/gin-gonic/gin"
)

func InitRouter() *gin.Engine {
	r := gin.Default()
	// 开启 CORS 中间件
	r.Use(middleware.CORS())
	// API 路由组
	api := r.Group("/api")
	{ //                                 注册的处理器
		api.GET("/pingpong", proxyinfo.PingPong)
		api.GET("/list", proxyinfo.GetList)
		// API 的 admin 路由组，目前不需要，未注册处理器
		admin := api.Group("/admin")
		{
			admin.GET("/addnode")
			admin.GET("/delnode")
			admin.GET("/servicestate")
			admin.GET("/changepasswd")
		}
	}
	return r
}
