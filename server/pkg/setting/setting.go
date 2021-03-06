package setting

import (
	"github.com/go-ini/ini"
	"log"
)

var cfg *ini.File

type Common struct {
	LogPath string
	LogName string
}

var CommonSetting = &Common{}

type Server struct {
	RunMode  string
	HttpPort int
}

var ServerSetting = &Server{}

// Setup initialize the configuration instance
func Setup() {
	var err error
	cfg, err = ini.Load("config.ini")
	if err != nil {
		log.Fatalf("setting.Setup, fail to parse 'conf/app.ini': %v", err)
	}
	mapTo("common", CommonSetting)
	mapTo("server", ServerSetting)
}

// mapTo map section
func mapTo(section string, v interface{}) {
	err := cfg.Section(section).MapTo(v)
	if err != nil {
		log.Fatalf("Cfg.MapTo %s err: %v", section, err)
	}
}
