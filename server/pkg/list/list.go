package list

import (
	"BrowserProxy/server/pkg/ssh"
	"fmt"
	"net"
	"os/exec"
	"strconv"
	"syscall"
)

// 结构体，定义返回给客户端的数据
type NodeInfo struct {
	// 节点昵称
	Nickname string `json:"nickname"`
	// socks5 端口号
	Port int `json:"port"`
}

// 初始化全局节点列表
var NodeList []NodeInfo

func GenNodeList() {
	for i := 0; i < len(ssh.SSHList); i++ {
		// 获取返回的 socks5 端口
		port := CreateSSHSocks5Tunnel(ssh.SSHList[i].Address, ssh.SSHList[i].Username, ssh.SSHList[i].Password)
		if port != -1 {
			// 信息添加到全局节点列表
			newNodeInfo := NodeInfo{Nickname: ssh.SSHList[i].Nickname, Port: port}
			NodeList = append(NodeList, newNodeInfo)
		}
	}
}

func CreateSSHSocks5Tunnel(address, username, password string) int {
	// 获取本机可用端口
	port, err := GetAvailablePort()
	if port == -1 || err != nil {
		fmt.Println("No available port", err.Error())
		return -1
	}
	// 生成远程开启 socks5 通道的命令
	cmd := "sshpass -p '" + password + "' ssh -fND 0.0.0.0:" + strconv.Itoa(port) + " " + username + "@" + address + " -o StrictHostKeyChecking=no"
	// 执行
	c := exec.Command("bash", "-c", cmd)
	c.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	if err = c.Start(); err != nil {
		fmt.Println("Run ssh error", err.Error())
	}
	return port
}

// 获取本机可用端口的函数
func GetAvailablePort() (int, error) {
	address, err := net.ResolveTCPAddr("tcp", fmt.Sprintf("%s:0", "0.0.0.0"))
	if err != nil {
		return -1, err
	}
	listener, err := net.ListenTCP("tcp", address)
	if err != nil {
		return -1, err
	}
	defer listener.Close()
	return listener.Addr().(*net.TCPAddr).Port, nil
}
