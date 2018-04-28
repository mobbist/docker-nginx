# DLNNM
> D代表Docker
> L代表linux
> N代表Nginx
> N代表Node
> M代表Mongodb

    本章也是一个综合案例, 旨在将前面所学的内容应用到实际的开发中, 通过实例的操作,我们将综合学习和巩固Dockerfile构建, 容器连接, 跨主机容器连接和分发镜像等知识,以此达到对Docker在实际应用中拥有只管理解的目的

    案例部署结构其中包含3台主机和5个容器
    主机1: 运行着MongoDB服务和 Mongo代理容器, 
    主机2: 运行着Node.js服务和Mongo访问代理容器
    主机3: 运行着前端web服务容器nginx,其中代理容器并不是必须的, 但是拥有它, 架构会变得更灵活
    当然,我们也可以完全将这3个Docker主容器部署在同一台主机上,这由实际业务需求来决定, 根据实际的业务需求, 我们还可以在这套结构里添加多个MongoDB容器服务或者其他种类的容器服务(如redis, php等)

    本章包含以下内容:
    介绍Mongodb数据库系统, 并将其制作成镜像 
    介绍nodejs开发平台, 并以此开发node-web-api镜像
    使用代理容器连接MongoDB容器和nodejs容器
    基于Nginx服务器开发前端web页面, 并将其制作成镜像

## 构建mongodb镜像
    MongoDB是一款流行的开放源码的非关系型数据库系统(nosql), 常用大数据量, 高并发, 弱事务的互联网应用, MongoDB的官网是: http://wwww.mongodb.com/ 将MongoDB数据库系统容器化可以带来以下几个好处.
    更容易维护
    启动速度快
    方便与他人进行分享

    本节将讲解如何使用Doc0kerfile来构建mongodb镜像

### 编写镜像Dockerflie
    如果用户想要将MongoDB容器应用到自己的生产环境中, 可以选择在docker hub的mongodb官方镜像上进行二次开发,其网址是https://registry.hub.docker.com/u/dockerfile/mongodb/,但在本节中, 我们将手动编写Dockerfile文件来构建mongodb镜像.

1. 创建DockerFile文件, 并且在文件开始位置添加使用#注释的描述信息
    ```
    # 名称: 容器化的Mongodb
    # 用途: 用作后端数据持久化服务
    # 创建时间: 2018.1.22
    ```
    这些描述信息, 并不是必须的, 但我们推荐写上, 这样方便传播和后期维护

2. Dockerfile虽然很简单, 也很灵活, 不过仍有一些规则需要遵守, 比如开头一定是定义根镜像的命令, 这里使用ubuntu作为mongodb的根镜像:
    ```
    FROM ubuntu:latest
    ```
3. 声明维护者信息:
    ```
    MAINTAINER xiexie  xxhjfdk@qq.com
    ```
4. 即使Ubuntu系统中已经有MongoDB包索引, 但可能不最新版本, 为了使用官方最新的包进行安装, 我们需要为Ubuntu包管理器导入Mongodb公共的GPG秘钥
    ```
    RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7f0ceb10
    RUN echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | tee/etc/apt/sources.list.d/10gen.list
    ```
5. 更新包索引并安装 Mongodb:
    ```
    RUN apt-get update && app-get install -y mongodb-org
    ```
    如果有需要,我们还可以分别为Mongodb的各个组件指定特定的版本,如下
    ```
    RUN apt-get update && apt-get install -y mongodb-org=2.6.1 mongodb-org-server=2.6.1  mongodb-org-shell=2.6.1 mongodb-org-mongos=2.6.1 mongodb-rog-tools=2.6.1
    ```
6. Mongodb默认的服务端口是27017,所以还要使用EXPOSE命令将这个端口映射到主机: 
    ```
    EXPOSE 27017
    ```
7. 使用ENTRYPOINT命令告诉Docker在MongoDB容器启动时运行Mongod服务:
    ```
    ENTRYPOINT ["/usr/bin/mongod"]
    ```

### 构建和上传镜像
    有了Dockerfile之后, 进入Dockerfile文件所在的目录, 然后使用build命令来构建镜像:
    ```
    # docker build --tag xiexie/mongo-db:v1
    ```
    这里要说明的是, 我们通过tag标志位本镜像指定的命名空间是xiexie,仓库名为 mongo-db, tag标记为v1,这里的命名空间必须与需要推送到Docker Hub上的账号保持一致

    当build命令执行完毕时, 我们的镜像也就构建成功了, 接下来, 通过push命令将镜像推送到Docker Hub上, 如果还未在命令登录过Docker Hub, Docker系统会提示我们先登录,此时直接输入账号和密码即可

    至此, 本案例的数据持久mongodb镜像就已经建造好了, 并且可以从Docker Hub中自有拉取


