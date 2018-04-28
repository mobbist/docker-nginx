# 使用SSH镜像来访问容器
一般我们是通过ssh服务来管理服务器的, 但是现在很多Docker镜像不带SSH服务. attach: docker虽然提供attach, 但是attach是同步的, 如果有多个用户一起去操作容器的话, 一个窗口锁定的话, 其他用户都用不了. 另外一个nsenter工具, 功能比attach强大, 但是都无法解决远程管理容器的问题,当我们需要远程管理容器的时候, 就需要用到ssh的支持了

## 使用commit命令创建支持ssh镜像
ubuntu 实例:
1. 先启动一个根镜像
```
docker  run --name myUbuntu --it nbuntu /bin/bash
root@931e1c5344de:/# 
```
2. 成功后提示进入容器,更新容器内的ubuntu
```
root@931e1c5344de:/# apt-get update
```
之后, 安装ssh
```
root@931e1c5344de:/# apt-get install openssh-server
```

3. 然后我们需要把SSH这个服务给运行起来
使用mkdir -p /var/run/sshd 创建目录, 然后运行/usr/sbin/sshd -D & 启动ssh服务,启动的时候,ssh需要这样的目录, 所以前面需要先创建一下
```
root@931e1c5344de:/# mkdir -p /var/run/sshd
root@931e1c5344de:/# /usr/sbin/sshd -D &
```
可以通过top命令 查看该程序是否有运行起来,  sshd默认的端口22, 可以使用netstat 查看端口, 在使用之前需要安装net-tools 网络工具包
```
root@931e1c5344de:/# apt-get install net-tools
...

root@931e1c5344de:/# netstat -lnp | grep 22
```

4. 生成和添加公钥
先去登录主机找到公钥
```
AirwallexdeMBP: cd ~/.ssh
AirwallexdeMBP: cat id_rsa.pub  //获得登录主机公钥
```
复制公钥, 然后到容器中到ssh目录下. 如果没有该目录, 则先生成容器中的公钥私钥(不是必须,但需要这个.ssh目录)
```
root@931e1c5344de:/# ssh-keygen -t rsa
```
一路回车生成公钥,然后进入.ssh目录, 创建 authorized_keys,并把登录公钥复制进去, 最后查看一下是否存入
```
root@931e1c5344de:/# cd ~/.ssh
root@931e1c5344de:~/.ssh# cat > authorized_keys
root@931e1c5344de:~/.ssh# cat authorized_keys
```

5. 制作ssh运行脚本
我们需要创建启动ssh服务的脚本run.sh. 并为其添加执行权限. 由于容器启动时只能运行一个命令, 所以一般要把启动的程序和服务都放在一个脚本中. 这样只要运行这个脚本就可以了, 目前,虽然只有一个ssh服务, 我们还是用统一的脚本来处理. 如下面的命令所示, 第一行通过vim命令编辑启动脚本(vi命令可能需要安装apt-get install vim), 第二行为刚才的脚本添加执行权限, 第三行为脚本的内容:
```
root@931e1c5344de:/ vim run.sh  //创建容器运行脚本
root@931e1c5344de:/ chmod 700   //修改权限, 使其可执行
root@931e1c5344de:/ cat run.sh  
#!/bin/bash         //启动程序
/usr/sbin/sshd -D   //启动ssh服务
```

6. 提交生成的镜像
退出容器, 回到宿主机, 使用docker commit命令将刚才的容器提交为一个新的镜像:
```
$ sudo docker commit myUbuntu ubuntu_ssh:v1.0
$ sudo docker images
```

7. 使用新生成镜像
使用上面的新镜像启动容器, 并用-p参数参加端口映射 22222:22 22是容器SSH服务监听的端口, 22222是映射到主机的端口:
```
$sudo docker run -d -p 22222:22 ubuntu_ssh:v1.0 /run.sh 
```

## 使用Docekrfile来创建支持ssh的镜像
先创建一个合适的目录, 然后在目录中创建Dockerfile,切记D大写
```
cd ~
mkdir ubuntu_dockerfile
cd ubuntu_dockerfile/
touch Dockerfile
```
然后在该目录下要创建一个run.sh, 要把这个run.sh传入到镜像中, 在容器启动的时候, 要指定运行的run.sh去启动容器里面的ssh服务
```
cat > run.sh
#!/bin/bash
/usr/sbin/sshd -D
cat run.sh

还需要在该目录下创建一个authorized_keys的文件

```
接下来就是定义Dockerfile了
```
FROM ubuntu                                     //根镜像
MAINTAINER bill      bill.zhu@airwallex.com     //维护者
RUN   apt-get update                            //容器中运行的命令, 更新ubuntu系统
RUN   apt-get install -y openssh-server         //安装SSH服务
RUN   mkdir  -p /var/run/sshd
RUN   mkdir  -p /root/.ssh
ADD   authorized_keys /root/.ssh/authorized_keys //将本地宿主机的authorized_keys, 拷贝到容器中的位置
ADD   run.sh /run.sh                             //将本地宿主机的run.sh, 拷贝到容器中的位置
RUN   chmod 700 /run.sh                          //修改run.sh的权限
EXPOSE 22                                        //开放端口
CMD   ["/run.sh"]                                //容器启动时所需要执行的命令
```

最终执行生成镜像命令
```
docker build  -t 
```
 
