package ssh

import (
	"encoding/json"
	"fmt"
	"os"
)

type SSHInfo struct {
	// 节点 IP
	Address string `json:"address"`
	// 节点昵称
	Nickname string `json:"nickname"`
	//Port     int    `json:"port"`
	// 节点 SSH 登录用户名
	Username string `json:"username"`
	// 节点 SSH 登录密码
	Password string `json:"password"`
}

var SSHList []SSHInfo

func ReadList() {
	// 读取本地文件
	listFile, err := os.Open("./sshlist.json")
	if err != nil {
		fmt.Println("Open sshlist.json failed [Err:%s]", err.Error())
		return
	}
	defer listFile.Close()
	// 解码 JSON
	decoder := json.NewDecoder(listFile)
	err = decoder.Decode(&SSHList)
	if err != nil {
		fmt.Println("Decoder failed", err.Error())
		return
	}
}

func WriteList() {
	// 写 JSON ,暂时用不到
	listFile, err := os.Create("./sshlist.json")
	if err != nil {
		fmt.Println("Create list.json failed", err.Error())
		return
	}
	defer listFile.Close()
	encoder := json.NewEncoder(listFile)
	err = encoder.Encode(SSHList)
	if err != nil {
		fmt.Println("Encoder failed", err.Error())
		return
	}
	fmt.Println("Encoder success")
}
