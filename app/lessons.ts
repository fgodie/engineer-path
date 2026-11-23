export type Lesson={id:string;track:'network'|'system';stage:string;title:string;en:string;minutes:number;summary:string;objective:string;sections:{heading:string;body:string}[];takeaway:string;source:{title:string;url:string};lab:{title:string;environment:string;steps:string[];command:string;verify:string};quiz:{question:string;options:string[];correct:number;explanation:string}};
export const stages=[{track:'network',key:'n1',name:'网络基础',en:'Fundamentals',description:'建立网络思维，读懂一次通信的完整过程。',weeks:'建议第 1–4 周'},{track:'network',key:'n2',name:'路由与交换',en:'Intermediate',description:'连接不同网段，构建可管理的企业网络。',weeks:'建议第 5–8 周'},{track:'network',key:'n3',name:'企业网络进阶',en:'Advanced',description:'理解策略、高可用与跨网络连接。',weeks:'建议第 9–14 周'},{track:'network',key:'n4',name:'架构与自动化',en:'Professional',description:'从配置设备，到设计、验证与持续改进。',weeks:'建议第 15–24 周'},{track:'system',key:'s1',name:'系统工程基础',en:'Fundamentals',description:'管理操作系统、身份与基础服务。',weeks:'建议第 1–8 周'},{track:'system',key:'s2',name:'系统工程进阶',en:'Advanced',description:'构建自动化、可恢复、可观测的基础设施。',weeks:'建议第 9–20 周'}];
export const lessons:Lesson[]=[{id:'n01',track:'network',stage:'n1',title:'网络如何连接彼此',en:'Networks & the TCP/IP model',minutes:15,summary:'打开一个网页时，数据会经过哪些设备？从一个熟悉的动作，理解网络的分层与封装。',objective:'区分交换机与路由器，按 TCP/IP 分层描述一次 HTTPS 请求。',sections:[{heading:'01 / 跟着一个打印任务走',body:'按下“打印”时，电脑要解决三个问题：交给哪个程序、送到哪台机器、在眼前这段链路上先交给谁。传输层写上端口，帮助对方找到打印服务；网络层写上目的 IP，标明最终要到的机器；链路层在最外面写上下一站的网卡地址（MAC）。这种逐层加上投递信息的做法叫封装。打印机收到后逐层取出里面的数据，就是解封装。'},{heading:'02 / 每一层解决一个问题',body:'应用层约定消息的含义，例如 HTTP 和 DNS；传输层负责进程之间的通信，例如 TCP 和 UDP；网络层使用 IP 跨网段转发；链路层处理当前链路上的帧。OSI 七层模型适合分析职责，TCP/IP 模型更贴近协议栈。'},{heading:'03 / 交换机和路由器',body:'二层交换机通常按目的 MAC 地址在 VLAN 内转发帧。路由器按目的 IP 查询路由表，把包送往下一跳。跨路由器时，链路层地址通常重写；没有 NAT 等处理时，源和目的 IP 通常不变。'}],takeaway:'MAC 帮数据走完当前一段链路，IP 帮数据跨越多个网络。',source:{title:'Cisco · Networking Basics',url:'https://www.cisco.com/site/us/en/learn/topics/small-business/networking-basics.html'},lab:{title:'画出你的第一条通信路径',environment:'自己的电脑与家庭网络；无需修改设备。',steps:['查看本机 IP、子网掩码和默认网关，画出电脑到网关的连接。','使用 ping 测试网关是否回应。没有回应不一定表示断网，也可能禁用了 ICMP。','选择一个可访问的网站，用 tracert（Windows）或 traceroute（Linux）观察中间跳点。'],command:'Windows: ipconfig /all\nWindows: tracert example.com\nLinux:   ip address\nLinux:   ip route\nLinux:   traceroute example.com',verify:'能指出本机、默认网关与远端服务器分别处于通信路径的哪一段，并解释星号可能表示超时或过滤。'},quiz:{question:'把数据包发往另一个子网，主要依赖哪项信息？',options:['目的 IP 与路由表','显示器分辨率','HTTP 页面的标题'],correct:0,explanation:'路由器根据目的 IP 做路由查询，决定下一跳或出接口。'}}];

lessons.push(...[
  {
    "id": "n02",
    "track": "network",
    "stage": "n1",
    "title": "IP 地址与子网划分",
    "en": "IPv4 addressing & subnetting",
    "minutes": 20,
    "summary": "IP 地址不是随意的编号。前缀决定哪些设备可以直接通信，哪些通信必须经过网关。",
    "objective": "计算 /26 子网的范围，并区分网络地址、主机地址与广播地址。",
    "sections": [
      {
        "heading": "01 / 前缀决定网络边界",
        "body": "IPv4 是 32 位地址。192.168.10.70/26 表示前 26 位是网络部分，剩下 6 位是主机部分。掩码为 255.255.255.192，每个子网包含 64 个地址。这个地址属于 192.168.10.64/26。"
      },
      {
        "heading": "02 / 从地址块推导可用范围",
        "body": "本例网络地址是 .64，广播地址是 .127，通常可分配给主机的是 .65 到 .126，共 62 个。常规子网使用 2 的主机位数次方减 2 计算可用主机数；/31 点对点与 /32 主机路由属于特殊情况。"
      },
      {
        "heading": "03 / 先规划，再分配",
        "body": "VLSM 允许不同子网使用不同前缀长度。为最大需求先分配地址块，记录用途、网关、DHCP 范围与预留地址。私网地址不等于安全边界；跨私网的访问仍需路由和安全策略。"
      }
    ],
    "takeaway": "子网掩码决定本地范围；默认网关负责通往其他网络。",
    "source": {
      "title": "IETF · IPv4 / RFC 791",
      "url": "https://www.rfc-editor.org/rfc/rfc791"
    },
    "lab": {
      "title": "把一个 /24 划成四个 /26",
      "environment": "纸笔或 Python；无需联网。",
      "steps": [
        "写出 192.168.10.0/24 的四个 /26 网络地址。",
        "为每个子网列出首个主机、最后主机和广播地址。",
        "用 Python ipaddress 核对结果，解释 .70 为什么位于第二个子网。"
      ],
      "command": "import ipaddress\nfor net in ipaddress.ip_network('192.168.10.0/24').subnets(new_prefix=26):\n    print(net, net[1], net[-2], net.broadcast_address)",
      "verify": "得到 .0、.64、.128、.192 四个网段，各有 62 个常规可用主机地址。"
    },
    "quiz": {
      "question": "192.168.10.70/26 的网络地址是？",
      "options": [
        "192.168.10.0",
        "192.168.10.64",
        "192.168.10.70"
      ],
      "correct": 1,
      "explanation": "/26 的地址块大小是 64，70 落在 64–127 范围内，因此网络地址为 .64。"
    }
  },
  {
    "id": "n03",
    "track": "network",
    "stage": "n1",
    "title": "DNS、DHCP 与传输协议",
    "en": "DNS, DHCP, TCP & UDP",
    "minutes": 20,
    "summary": "能连 IP 却打不开域名，和完全无法联网，是两类不同的问题。",
    "objective": "解释地址获取、域名解析与传输层连接之间的关系。",
    "sections": [
      {
        "heading": "01 / 先拿地址，再找名字",
        "body": "DHCPv4 的常见初始流程是 Discover、Offer、Request、ACK，客户端获得有租期的地址以及网关、DNS 等选项。DNS 解析器按记录类型寻找答案并缓存；A 对应 IPv4，AAAA 对应 IPv6，CNAME 指向另一个名字。"
      },
      {
        "heading": "02 / TCP 与 UDP 的区别",
        "body": "TCP 提供有序字节流、重传与流量控制；建立连接常见为 SYN、SYN-ACK、ACK。UDP 保留数据报边界，不内建重传和排序。应用可以在 UDP 上实现可靠传输，例如 QUIC；不能简单把 UDP 等同于不可靠应用。"
      },
      {
        "heading": "03 / 分开验证每一层",
        "body": "先检查本机地址与路由，再查询 DNS，随后验证目标端口和应用响应。DNS 可使用 UDP 或 TCP；HTTPS 的 HTTP/1.1 和 HTTP/2 通常使用 TCP，HTTP/3 使用 QUIC。端口号用于标识服务端点，并不能单独证明应用正常。"
      }
    ],
    "takeaway": "地址、名字、端口与应用响应，应该分别验证。",
    "source": {
      "title": "IETF · DNS / RFC 1034",
      "url": "https://www.rfc-editor.org/rfc/rfc1034"
    },
    "lab": {
      "title": "定位一次域名解析",
      "environment": "Windows PowerShell 或装有 dig、curl 的 Linux。",
      "steps": [
        "查询 example.com 的 A 与 AAAA 记录。",
        "查看返回的 TTL，理解缓存不会立刻随记录变更而消失。",
        "获取 HTTPS 响应头，并区分 DNS 错误与连接超时。"
      ],
      "command": "nslookup example.com\ncurl -I https://example.com\n# PowerShell\nTest-NetConnection example.com -Port 443",
      "verify": "记录 DNS 返回地址、目标端口测试结果与 HTTP 状态码，并分别解释其含义。"
    },
    "quiz": {
      "question": "能访问目标 IP，但域名解析失败，优先检查什么？",
      "options": [
        "交换机风扇",
        "DNS 配置和查询结果",
        "浏览器窗口大小"
      ],
      "correct": 1,
      "explanation": "先验证所用 DNS 服务器、查询记录和响应；IP 可达不能证明名字解析正确。"
    }
  },
  {
    "id": "n04",
    "track": "network",
    "stage": "n2",
    "title": "VLAN、Trunk 与生成树",
    "en": "VLAN, 802.1Q & STP",
    "minutes": 30,
    "summary": "同一台交换机上的设备，也可以位于不同的二层网络。",
    "objective": "设计两个 VLAN，并说明 Trunk 和 STP 各自解决什么问题。",
    "sections": [
      {
        "heading": "01 / 用 VLAN 划分广播域",
        "body": "VLAN 把二层网络分成独立广播域。Access 端口常用于接入单一 VLAN 的终端；802.1Q Trunk 在一条链路上传送多个 VLAN。两端允许 VLAN 列表和 Native VLAN 配置需要一致。"
      },
      {
        "heading": "02 / VLAN 之间需要三层转发",
        "body": "VLAN 10 的 192.168.10.0/24 与 VLAN 20 的 192.168.20.0/24 通信，需要路由器子接口或三层交换机 SVI。VLAN 本身只做二层分段，访问控制还需要 ACL 或防火墙。"
      },
      {
        "heading": "03 / 避免二层环路",
        "body": "以太网帧没有类似 IP TTL 的环路寿命限制。STP/RSTP 通过选举根桥、计算端口角色，让冗余拓扑中部分路径不转发。合理放置根桥，接入边缘端口按适用场景配置保护；不要为恢复一条链路盲目关闭 STP。"
      }
    ],
    "takeaway": "Trunk 承载多个 VLAN；STP 让二层冗余不形成转发环路。",
    "source": {
      "title": "Cisco · Networking Basics",
      "url": "https://www.cisco.com/site/us/en/learn/topics/small-business/networking-basics.html"
    },
    "lab": {
      "title": "两个 VLAN 的隔离与互通",
      "environment": "Packet Tracer 或其他支持 VLAN 的隔离模拟环境。",
      "steps": [
        "接入两台主机到 VLAN 10、另一台到 VLAN 20，并配置相应 IP。",
        "将两个交换机之间设为 Trunk，确认 VLAN 10 同网段跨交换机可通。",
        "添加三层网关后验证跨 VLAN 通信，对比添加前的结果。"
      ],
      "command": "! Cisco IOS 常见只读核对命令\nshow vlan brief\nshow interfaces trunk\nshow spanning-tree\nshow ip interface brief",
      "verify": "同 VLAN 可互通；跨 VLAN 只有在三层转发及允许策略就绪后才互通。"
    },
    "quiz": {
      "question": "Trunk 的主要用途是？",
      "options": [
        "让一条链路承载多个 VLAN",
        "代替 DNS 解析",
        "加密所有数据"
      ],
      "correct": 0,
      "explanation": "802.1Q Trunk 标识和承载不同 VLAN 的帧；它本身不提供加密。"
    }
  },
  {
    "id": "n05",
    "track": "network",
    "stage": "n2",
    "title": "静态路由与 OSPF",
    "en": "Routing tables & OSPF",
    "minutes": 30,
    "summary": "从“下一跳是谁”到“拓扑变化后如何重新找到路径”。",
    "objective": "读懂最长前缀匹配，验证 OSPF 邻居与路由。",
    "sections": [
      {
        "heading": "01 / 转发先看最长匹配",
        "body": "转发查找先选择与目的地址匹配的最长前缀，例如 /24 比 /16 更具体。默认路由 0.0.0.0/0 在没有更具体匹配时使用。同一前缀有多个来源时，设备按管理距离或协议优先级等规则选择候选路由。"
      },
      {
        "heading": "02 / OSPF 交换拓扑信息",
        "body": "OSPF 是链路状态协议。路由器建立邻接、同步链路状态数据库，然后用 SPF 计算路径。邻接失败要核对区域、计时器、认证、网络类型及 MTU 等，而不仅是链路是否 up。"
      },
      {
        "heading": "03 / 进阶：区域与重分发",
        "body": "多区域设计通常让 Area 0 作为骨干；ABR 连接区域，ASBR 引入外部路由。重分发应控制前缀、度量与路由标签，避免路由反馈。IS-IS 也是链路状态协议，使用 Level-1/Level-2 层次；先掌握邻接、数据库、计算路径的共同排障思路。"
      }
    ],
    "takeaway": "邻居正常、路由存在、数据实际可达，是三项不同的验证。",
    "source": {
      "title": "IETF · OSPFv2 / RFC 2328",
      "url": "https://www.rfc-editor.org/rfc/rfc2328"
    },
    "lab": {
      "title": "观察一次路由收敛",
      "environment": "三台模拟路由器组成三角形，每台带一个 Loopback。",
      "steps": [
        "配置各接口 IP，在单一区域建立 OSPF 邻居。",
        "记录到远端 Loopback 的路由、下一跳与 cost。",
        "在模拟器中关闭一条链路，记录切换路径与丢包时间，再恢复。"
      ],
      "command": "show ip ospf neighbor\nshow ip ospf database\nshow ip route\nshow ip route ospf",
      "verify": "能解释链路关闭前后的下一跳变化，并用持续 ping 记录收敛影响。"
    },
    "quiz": {
      "question": "同时匹配 /16 与 /24 路由时，转发先选择哪一个？",
      "options": [
        "总是 /16",
        "/24",
        "先看接口名称"
      ],
      "correct": 1,
      "explanation": "最长前缀匹配优先选择 /24；协议来源比较不能让更宽泛的 /16 覆盖它。"
    }
  },
  {
    "id": "n06",
    "track": "network",
    "stage": "n2",
    "title": "网络安全与基础排障",
    "en": "ACL, NAT, WLAN & troubleshooting",
    "minutes": 30,
    "summary": "把故障拆成可验证的假设，避免一次改动多个配置。",
    "objective": "区分 NAT 与访问控制，按证据定位连通性问题。",
    "sections": [
      {
        "heading": "01 / 允许什么，转换什么",
        "body": "ACL 按匹配规则允许或拒绝流量，通常按顺序匹配。NAT 转换地址，PAT 还使用端口复用。NAT 不是完整的防火墙替代品；状态防火墙会追踪连接状态，并需考虑返回路径。"
      },
      {
        "heading": "02 / 无线要看空口",
        "body": "无线故障不仅可能来自 IP，还可能来自覆盖、干扰、信道利用率、漫游与认证。RSSI 反映信号强度，SNR 反映信号相对噪声的水平；更多发射功率并不一定改善双向通信。"
      },
      {
        "heading": "03 / 固定一个排障顺序",
        "body": "先确认影响范围与变更时间，再看物理状态、VLAN、地址、路由、DNS、端口及应用。抓包时确认观察点、时间与过滤条件。每次只验证一个假设，保留证据，变更前准备回退。"
      }
    ],
    "takeaway": "ping 成功只证明特定 ICMP 交互成功，不等于业务可用。",
    "source": {
      "title": "Cisco · Networking Basics",
      "url": "https://www.cisco.com/site/us/en/learn/topics/small-business/networking-basics.html"
    },
    "lab": {
      "title": "故障定位记录",
      "environment": "自己的实验网，或用纸笔分析一个故障案例。",
      "steps": [
        "记录一台主机正常访问 HTTPS 的地址、路由与端口测试结果。",
        "只在实验环境中制造错误 DNS，再与正常结果对比。",
        "恢复 DNS，编写现象、证据、根因、修复、验证五段记录。"
      ],
      "command": "# Windows\nroute print\nnslookup example.com\nTest-NetConnection example.com -Port 443\n# Linux\nip route\nss -tn",
      "verify": "在不改动其他变量的情况下，证明故障发生在 DNS 层，并确认修复。"
    },
    "quiz": {
      "question": "NAT 能否替代完整的访问控制设计？",
      "options": [
        "能，地址转换等于完整安全",
        "不能，应独立设计安全策略",
        "只要地址是私网就能"
      ],
      "correct": 1,
      "explanation": "NAT 主要处理地址映射，授权、连接状态和分段策略仍需要独立设计。"
    }
  },
  {
    "id": "n07",
    "track": "network",
    "stage": "n3",
    "title": "BGP 策略与路由反射",
    "en": "BGP policy & route reflectors",
    "minutes": 30,
    "summary": "BGP 不只是寻找最短路径，它让网络表达业务与互联策略。",
    "objective": "区分 eBGP/iBGP，解释 Local Preference、AS Path 和路由反射。",
    "sections": [
      {
        "heading": "01 / AS 之间交换可达性",
        "body": "自治系统 AS 由一致的路由策略管理。eBGP 通常在不同 AS 之间建立，iBGP 用于同一 AS 内传播 BGP 路由。会话运行在 TCP 上，邻居 Established 不代表已收到或安装业务前缀。"
      },
      {
        "heading": "02 / 用属性表达意图",
        "body": "Local Preference 通常在 AS 内表达出口偏好，值高更优；AS Path 记录经过的 AS，并用于环路检测和路径选择。Community 用于给路由打标签，再由策略匹配。实际选路顺序受厂商实现及配置影响。"
      },
      {
        "heading": "03 / 规模与边界",
        "body": "Route Reflector 缓解 iBGP 全互联的会话规模问题，但不自动成为流量转发路径。对外应使用明确的进出口前缀策略、最大前缀限制及适用的 RPKI 验证，防止路由泄露。先写清允许通告的清单，再配置。"
      }
    ],
    "takeaway": "控制平面学到了路由，还要验证下一跳可达及实际转发。",
    "source": {
      "title": "IETF · BGP-4 / RFC 4271",
      "url": "https://www.rfc-editor.org/rfc/rfc4271"
    },
    "lab": {
      "title": "改变出口偏好",
      "environment": "FRRouting 或支持 BGP 的模拟设备；仅使用私有 AS 65001–65003。",
      "steps": [
        "搭建一台本地路由器与两条模拟上游路径，通告实验前缀。",
        "比较相同前缀的两条路径及其属性。",
        "通过入站策略提高其中一路的 Local Preference，验证出口变化。"
      ],
      "command": "# FRR vtysh 或支持相应语法的设备\nshow bgp summary\nshow bgp ipv4 unicast\nshow ip route",
      "verify": "列出策略前后的最佳路径、Local Preference 与下一跳，并确认未意外通告其他前缀。"
    },
    "quiz": {
      "question": "路由反射器主要缓解什么问题？",
      "options": [
        "iBGP 全互联的会话数量",
        "以太网线太短",
        "DNS 记录过多"
      ],
      "correct": 0,
      "explanation": "RR 反射 iBGP 路由，降低对全互联会话的依赖；不保证所有数据都经过 RR。"
    }
  },
  {
    "id": "n08",
    "track": "network",
    "stage": "n3",
    "title": "高可用与 IPv6",
    "en": "High availability & IPv6",
    "minutes": 30,
    "summary": "冗余必须覆盖故障域；IPv6 需要独立验证，不能只复制 IPv4 的习惯。",
    "objective": "识别单点故障，并解释 IPv6 地址、邻居发现与双栈风险。",
    "sections": [
      {
        "heading": "01 / 冗余不等于高可用",
        "body": "双链路如果经过同一电源或同一上游设备，仍共享故障域。LACP 聚合、首跳冗余、ECMP 和 BFD 分别解决不同层面的问题。高可用设计必须给出检测、切换、恢复和容量余量。"
      },
      {
        "heading": "02 / IPv6 的基本差异",
        "body": "IPv6 地址长 128 位，支持压缩表示。链路本地地址常以 fe80::/10 开头。IPv6 没有广播；邻居发现 NDP 使用 ICMPv6。SLAAC 通常结合路由通告获得配置，不能简单阻断所有 ICMPv6。"
      },
      {
        "heading": "03 / 双栈要做两套检查",
        "body": "IPv4 正常并不代表 IPv6 正常。分别检查 AAAA、路由、邻居、ACL、MTU 与应用监听。IPv6 路由器不为转发的数据包执行分片，路径 MTU 发现依赖正确的错误反馈。"
      }
    ],
    "takeaway": "把“坏掉一台设备后还能否工作”作为设计问题，而不只看设备数量。",
    "source": {
      "title": "IETF · IPv6 / RFC 8200",
      "url": "https://www.rfc-editor.org/rfc/rfc8200"
    },
    "lab": {
      "title": "双栈通信与故障域清单",
      "environment": "支持 IPv6 的本机与实验网络；无 IPv6 出口时做本地验证。",
      "steps": [
        "查看本机 IPv6 地址，区分链路本地与其他地址。",
        "观察 IPv6 路由和邻居表，记录默认路由来源。",
        "画出双上联拓扑，圈出仍然共用的设备、电源和上游。"
      ],
      "command": "# Linux\nip -6 address\nip -6 route\nip -6 neigh\n# Windows\nGet-NetIPAddress -AddressFamily IPv6",
      "verify": "能解释为什么双链路仍可能单点故障，以及 IPv6 不能靠 ARP 排障。"
    },
    "quiz": {
      "question": "IPv6 的邻居发现主要依赖什么？",
      "options": [
        "ARP 广播",
        "ICMPv6 / NDP",
        "只依赖 DHCPv4"
      ],
      "correct": 1,
      "explanation": "NDP 使用 ICMPv6 消息完成邻居发现等功能，IPv6 不使用 ARP。"
    }
  },
  {
    "id": "n09",
    "track": "network",
    "stage": "n3",
    "title": "VRF、MPLS 与混合云",
    "en": "Segmentation, VPN & hybrid cloud",
    "minutes": 30,
    "summary": "不同租户可以使用相同地址，但必须保持路由和策略的隔离。",
    "objective": "解释 VRF、VPN 与云网络连接的边界。",
    "sections": [
      {
        "heading": "01 / 多张独立路由表",
        "body": "VRF 在同一设备上提供逻辑隔离的路由实例。两个客户可以各自使用 10.0.0.0/24 而不冲突，前提是流量处于不同实例。跨 VRF 通信需要受控的路由导入或安全网关，不能随意互通。"
      },
      {
        "heading": "02 / MPLS L3VPN 的角色",
        "body": "典型 MPLS L3VPN 中，CE 连接客户网络，PE 维护客户 VRF 并交换 VPN 路由，P 转发核心标签。RD 区分重叠 VPN 前缀，RT 控制路由导入和导出。MPLS 标签隔离不等于数据加密。"
      },
      {
        "heading": "03 / 连接云与分支",
        "body": "混合云需规划地址不重叠、路由传播、DNS、加密、带宽与冗余。AWS Transit Gateway 提供集中互联枢纽；Azure ExpressRoute、AWS Direct Connect 等专线连接也要单独考虑加密与备援。SD-WAN 通过集中策略选择底层链路，仍依赖 underlay 的可达性。"
      }
    ],
    "takeaway": "隔离、路由可达与加密是不同属性，必须分别设计。",
    "source": {
      "title": "AWS · Transit Gateway",
      "url": "https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html"
    },
    "lab": {
      "title": "设计两租户互联",
      "environment": "纸笔或拓扑工具；此练习无需创建付费云资源。",
      "steps": [
        "画出办公网、两个租户 VRF 与一处云网络，标注地址段。",
        "写出每个路由域允许导入的前缀与共享服务。",
        "模拟专线中断，说明备份 VPN 的路由优先级与容量限制。"
      ],
      "command": "Tenant A: VRF-A / 10.10.0.0/16\nTenant B: VRF-B / 10.10.0.0/16\nShared services: 10.50.0.0/16\nCloud: 10.60.0.0/16",
      "verify": "明确指出重叠租户不能直接混入同一路由表，并记录共享服务的访问策略。"
    },
    "quiz": {
      "question": "专线或 MPLS 隔离是否自动代表端到端加密？",
      "options": [
        "是",
        "否，需要独立核对加密设计",
        "只要带宽足够就代表"
      ],
      "correct": 1,
      "explanation": "私有连接和标签隔离不自动提供端到端加密，应根据需求部署合适的加密机制。"
    }
  },
  {
    "id": "n10",
    "track": "network",
    "stage": "n4",
    "title": "EVPN-VXLAN 数据中心",
    "en": "EVPN-VXLAN fabrics",
    "minutes": 30,
    "summary": "把承载 IP 的底层网络，与承载租户业务的覆盖网络分开理解。",
    "objective": "区分 underlay、overlay、VTEP、VNI 与 EVPN 控制平面。",
    "sections": [
      {
        "heading": "01 / Underlay 提供 IP 可达",
        "body": "Leaf-Spine 常用于构建可扩展的数据中心网络。Underlay 的任务是让 VTEP IP 相互可达，通常配合 ECMP。先验证路由和 MTU，再排查 overlay；底层不通，上层租户网络无法正常工作。"
      },
      {
        "heading": "02 / VXLAN 封装二层帧",
        "body": "VTEP 把二层帧封装进 UDP/IP，通过 VNI 标识虚拟网络。L2 VNI 对应桥接域，L3 VNI 常用于租户路由域。额外封装占用 MTU，配置必须容纳外层头部。"
      },
      {
        "heading": "03 / EVPN 分发可达信息",
        "body": "VXLAN 隧道负责运送帧，BGP EVPN 则传播“往哪里送”的信息，这就是控制平面。先分清三种通告的用途：Type 2 告诉其他端点某个 MAC 位于哪里，也可以携带 IP；Type 3 帮助发现哪些端点应接收这个网段需要泛洪的流量，例如广播；Type 5 通告可路由的 IP 前缀。端点会按场景使用其中的路由类型。"
      }
    ],
    "takeaway": "先证明 VTEP 能互达，再证明 EVPN 路由正确，最后检查租户流量。",
    "source": {
      "title": "IETF · EVPN / RFC 7432",
      "url": "https://www.rfc-editor.org/rfc/rfc7432"
    },
    "lab": {
      "title": "拆解一条跨机架路径",
      "environment": "支持 EVPN 的虚拟实验环境，或先用拓扑纸面推演。",
      "steps": [
        "画出两台 Leaf 和一台 Spine，标明 VTEP Loopback。",
        "给同一租户两台主机分配 L2 VNI，画出内层帧与外层 IP。",
        "列出主机不可达时的检查顺序：underlay、EVPN、VNI 映射、主机邻居表。"
      ],
      "command": "# FRR，只读观察；需设备已配置 EVPN\nshow bgp l2vpn evpn summary\nshow bgp l2vpn evpn\nshow evpn vni",
      "verify": "可以指出哪一段是外层 VTEP IP 转发，哪一段是内层租户 MAC/IP 转发。"
    },
    "quiz": {
      "question": "VXLAN 中标识虚拟网络的字段是？",
      "options": [
        "TTL",
        "VNI",
        "TCP Window"
      ],
      "correct": 1,
      "explanation": "VNI 是 VXLAN 网络标识；VTEP 使用它区分覆盖网络。"
    }
  },
  {
    "id": "n11",
    "track": "network",
    "stage": "n4",
    "title": "网络自动化与遥测",
    "en": "Ansible, APIs & telemetry",
    "minutes": 30,
    "summary": "让一次正确的手工操作，变成可重复、可审查的工作流。",
    "objective": "设计先采集、再变更、最后验证的自动化流程。",
    "sections": [
      {
        "heading": "01 / 从只读自动化开始",
        "body": "先建立可信设备清单，批量采集版本、接口状态和配置备份。Ansible 使用 inventory 组织主机，playbook 描述任务；network_cli 或 API 连接方式取决于设备平台及集合。检查执行结果不能只看进程退出码。"
      },
      {
        "heading": "02 / 数据模型比屏幕文本稳定",
        "body": "NETCONF 常用于结构化配置管理，YANG 描述数据模型；gNMI 可用于配置和流式遥测。各设备支持的模型与路径不同。自动化前明确认证、权限、超时、错误处理及敏感数据保护。"
      },
      {
        "heading": "03 / 把验证放进变更",
        "body": "先保存基线、审查差异，再小范围执行，最后验证协议邻居、业务可达和关键指标。pyATS 等工具可辅助解析与测试。Telemetry 要关注采样频率、标签基数与告警噪声，不能把采集量等同于可观测性。"
      }
    ],
    "takeaway": "自动化的成功标准是期望状态和业务验证，而不是命令已发送。",
    "source": {
      "title": "Ansible · Network Getting Started",
      "url": "https://docs.ansible.com/projects/ansible/latest/network/getting_started/"
    },
    "lab": {
      "title": "编写一次只读巡检",
      "environment": "本机已安装 Ansible，且有一台可 SSH 的实验网络设备；集合需按平台安装。",
      "steps": [
        "创建只含实验设备的 inventory，确认连接参数与密钥权限。",
        "将版本查询作为首个任务，记录每台设备的成功与失败。",
        "为失败设置清晰记录；在能够可靠采集前不执行批量变更。"
      ],
      "command": "# IOS 示例，依赖 cisco.ios 集合\n- name: Read-only audit\n  hosts: lab\n  gather_facts: false\n  tasks:\n    - name: Read version\n      cisco.ios.ios_command:\n        commands: show version\n      register: result\n    - ansible.builtin.debug:\n        var: result.stdout",
      "verify": "保存每台设备的输出和错误，且设备配置没有发生改变。"
    },
    "quiz": {
      "question": "批量配置返回成功后，下一步应做什么？",
      "options": [
        "直接结束",
        "验证期望状态和业务可达",
        "删掉所有日志"
      ],
      "correct": 1,
      "explanation": "命令执行成功不代表最终业务正常，应验证协议状态和关键业务，并准备回退。"
    }
  },
  {
    "id": "n12",
    "track": "network",
    "stage": "n4",
    "title": "架构、安全与综合项目",
    "en": "Design, Zero Trust & capstone",
    "minutes": 30,
    "summary": "用一个小型企业网络项目，把协议知识串成可解释的设计。",
    "objective": "产出需求、拓扑、地址表、策略矩阵和故障验证报告。",
    "sections": [
      {
        "heading": "01 / 先问业务约束",
        "body": "设计从用户数、应用路径、可用性、延迟、预算与运维能力开始。画出流量路径、信任边界和故障域，明确哪些需求必须满足。不要为使用某个协议而增加不必要的复杂度。"
      },
      {
        "heading": "02 / 按资源访问建立信任",
        "body": "Zero Trust 不基于内网位置自动信任访问者。结合身份、设备状态、最小权限和持续评估来控制资源访问。网络分段是其中一个手段，不能单独代表完整 Zero Trust。"
      },
      {
        "heading": "03 / 故障注入证明设计",
        "body": "在隔离实验环境里测试链路中断、错误路由、DNS 失败与拥塞，记录业务影响和恢复时间。报告需包括前置状态、时间线、预期、实际与改进项。把运行手册、变更回退及交接材料作为交付的一部分。"
      }
    ],
    "takeaway": "专业设计必须说明为什么这样做，以及故障发生时会怎样。",
    "source": {
      "title": "NIST · Zero Trust Architecture",
      "url": "https://csrc.nist.gov/pubs/sp/800/207/final"
    },
    "lab": {
      "title": "小型企业双分支网络",
      "environment": "模拟器与文档工具，使用合成业务数据。",
      "steps": [
        "设计总部与分支，各有员工、访客、服务器网段；指定跨网段允许矩阵。",
        "实现动态路由、冗余上联及受控的互联网出口，验证 DNS 与 HTTPS。",
        "注入一处链路故障和一条错误策略，记录诊断证据与回退结果。"
      ],
      "command": "交付清单\n[ ] 需求与约束\n[ ] 物理 / 逻辑拓扑\n[ ] IP、VLAN、路由规划\n[ ] 访问策略矩阵\n[ ] 正常与故障测试记录\n[ ] 运维与回退手册",
      "verify": "另一位学习者能按你的文档复现实验，并理解每项设计取舍。"
    },
    "quiz": {
      "question": "Zero Trust 的正确理解是？",
      "options": [
        "内网用户始终可信",
        "只要安装防火墙即可",
        "访问资源时按身份、设备和策略评估"
      ],
      "correct": 2,
      "explanation": "Zero Trust 不因为网络位置就隐含授予信任，需要围绕资源访问做明确评估。"
    }
  },
  {
    "id": "s01",
    "track": "system",
    "stage": "s1",
    "title": "Windows 与 Linux 运维基础",
    "en": "Operating systems & services",
    "minutes": 20,
    "summary": "系统工程师的第一步，是分清进程、服务、日志与资源状态。",
    "objective": "查看系统服务、监听端口与日志，建立一份服务器基线。",
    "sections": [
      {
        "heading": "01 / 系统提供运行环境",
        "body": "内核管理 CPU、内存、设备与进程。服务是在后台提供能力的程序，可能监听端口，也可能只执行本地任务。Windows 使用服务管理器、事件查看器和 PowerShell；常见 Linux 发行版使用 systemd 管理服务。"
      },
      {
        "heading": "02 / 文件、身份与权限",
        "body": "Linux 区分用户、组及读写执行权限，目录上的执行权限关系到能否遍历。Windows 常通过 NTFS ACL 授权。日常运维使用最小权限，管理操作单独提权，不把所有任务长期放在管理员身份下。"
      },
      {
        "heading": "03 / 建立基线再排障",
        "body": "记录系统版本、补丁、磁盘空间、时间同步、关键服务、监听端口与日志位置。CPU 高、内存高和磁盘慢的原因不同；先观察趋势、进程和相关事件，避免将重启当作根因分析。Server Core 减少图形界面依赖，要求熟练使用远程管理。"
      }
    ],
    "takeaway": "服务正在运行，只能说明进程状态；还需验证端口与实际请求。",
    "source": {
      "title": "Ubuntu · Server Documentation",
      "url": "https://documentation.ubuntu.com/server/"
    },
    "lab": {
      "title": "建立一份服务器体检记录",
      "environment": "一台 Ubuntu 实验虚拟机或 Windows 实验虚拟机。",
      "steps": [
        "记录系统版本、CPU、内存、磁盘与 IP。",
        "选择一个已安装服务，查看状态、近期日志与监听端口。",
        "说明“运行中”与“业务可用”需要哪些不同证据。"
      ],
      "command": "# Ubuntu / systemd\ncat /etc/os-release\nfree -h\ndf -h\nsystemctl --failed\nss -lnt\njournalctl -p err -n 20\n# Windows PowerShell\nGet-Service\nGet-NetTCPConnection -State Listen",
      "verify": "输出包含基线、异常、日志时间与业务测试方式，且不以单一指标断言根因。"
    },
    "quiz": {
      "question": "服务显示 Running，是否能证明用户访问正常？",
      "options": [
        "能",
        "不能，还需验证端口和业务请求",
        "只要 CPU 低就能"
      ],
      "correct": 1,
      "explanation": "服务可能监听了错误地址、被策略阻挡或内部依赖故障，所以还需请求级验证。"
    }
  },
  {
    "id": "s02",
    "track": "system",
    "stage": "s1",
    "title": "AD、DNS 与 DHCP",
    "en": "Directory & infrastructure services",
    "minutes": 20,
    "summary": "集中身份依赖稳定的命名解析和时间服务。",
    "objective": "说明域控、域成员和 DNS 的关系，验证基础域服务。",
    "sections": [
      {
        "heading": "01 / AD DS 是目录服务",
        "body": "AD DS 存储用户、计算机和组等对象，域控制器提供目录与认证相关服务。域是管理边界之一，林定义更广的目录结构。域成员加入域后可以使用集中账号和策略；加入域不代表自动授予所有资源权限。"
      },
      {
        "heading": "02 / DNS 帮客户端找到服务",
        "body": "AD 使用 DNS SRV 记录发现域控等服务。域成员应使用能正确解析 AD 区域的 DNS。把公共 DNS 直接混入域客户端的解析列表可能导致间歇性故障；内部 DNS 可通过转发解决互联网查询。"
      },
      {
        "heading": "03 / DHCP 与时间同步",
        "body": "DHCP 分发地址、网关与 DNS 配置，注意作用域、排除范围、租约与授权。Kerberos 对时间偏差敏感，应检查域时间层级。排查域登录时同时查看 DNS、时间、域控可达性与事件日志。"
      }
    ],
    "takeaway": "AD 故障经常需要同时核对 DNS、时间与网络，而不是立即重建账号。",
    "source": {
      "title": "Microsoft Learn · AD DS Overview",
      "url": "https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview"
    },
    "lab": {
      "title": "验证实验域的基础服务",
      "environment": "隔离虚拟网络：一台域控和一台 Windows 客户端，示例域 ad.example.test。",
      "steps": [
        "安装实验 AD DS 与 DNS，记录域名和域控 IP；勿在生产网络中提供 DHCP。",
        "让客户端使用域内 DNS，加入实验域并用普通域账号登录。",
        "查询 SRV 记录、检查时间状态和域控发现结果。"
      ],
      "command": "Resolve-DnsName -Type SRV _ldap._tcp.dc._msdcs.ad.example.test\nnltest /dsgetdc:ad.example.test\nw32tm /query /status\nipconfig /all",
      "verify": "客户端能发现正确域控并完成域登录，DNS 和时间配置与记录一致。"
    },
    "quiz": {
      "question": "域客户端寻找域控时，关键依赖哪个服务？",
      "options": [
        "DNS 服务记录",
        "打印队列",
        "公网邮件服务"
      ],
      "correct": 0,
      "explanation": "AD 客户端利用 DNS SRV 等记录定位域服务；错误 DNS 会导致域控发现失败。"
    }
  },
  {
    "id": "s03",
    "track": "system",
    "stage": "s1",
    "title": "组策略与文件权限",
    "en": "GPO, NTFS & SMB permissions",
    "minutes": 20,
    "summary": "能登录不代表能访问，给了共享权限也不代表文件权限允许。",
    "objective": "通过组授权，并验证 GPO 实际生效范围。",
    "sections": [
      {
        "heading": "01 / 按组分配权限",
        "body": "把用户放入业务组，再把业务组纳入资源权限组，可减少逐人授权。区分认证 Authentication 与授权 Authorization：前者确认是谁，后者决定能做什么。避免使用共享管理员账号掩盖权限设计问题。"
      },
      {
        "heading": "02 / 共享与 NTFS 双重约束",
        "body": "远程 SMB 文件访问需同时满足共享权限与 NTFS 权限。有效权限由用户及组的允许、拒绝、继承等规则共同决定。不能只看到某处存在 Allow 就断言可访问；应使用有效访问分析并实际测试。"
      },
      {
        "heading": "03 / GPO 的作用范围",
        "body": "GPO 可链接到站点、域和 OU，再受安全筛选等影响。区分用户设置与计算机设置，理解继承、强制与阻止继承。用 gpresult 核实结果，而不是只确认策略已经创建。"
      }
    ],
    "takeaway": "权限和策略都必须以目标用户、目标计算机的实际结果验证。",
    "source": {
      "title": "Microsoft Learn · AD DS Overview",
      "url": "https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview"
    },
    "lab": {
      "title": "为两个部门分配文件访问",
      "environment": "Windows 实验域、文件服务器、两个普通测试账号。",
      "steps": [
        "创建 Finance 与 IT 组，以及两个测试文件夹。",
        "按组分配所需权限，以两个普通账号分别测试读取和写入。",
        "在测试 OU 链接一项无害 GPO，生成实际策略结果并记录。"
      ],
      "command": "gpresult /r\ngpresult /h report.html\n# 在实验文件服务器上读取共享配置\nGet-SmbShare\nGet-SmbShareAccess -Name Finance",
      "verify": "形成用户 × 文件夹 × 读写操作矩阵，实际结果与授权设计一致。"
    },
    "quiz": {
      "question": "用户能通过 SMB 写入文件，通常需满足什么？",
      "options": [
        "只满足共享权限",
        "只满足 NTFS 权限",
        "共享和 NTFS 的有效权限都允许"
      ],
      "correct": 2,
      "explanation": "远程访问同时受共享与文件系统权限约束，应综合计算有效权限。"
    }
  },
  {
    "id": "s04",
    "track": "system",
    "stage": "s1",
    "title": "虚拟化、存储与备份",
    "en": "Hyper-V, storage & backup",
    "minutes": 20,
    "summary": "虚拟机、RAID 和快照各有用途，但不能彼此替代。",
    "objective": "解释虚拟交换机、存储类型与可恢复备份的区别。",
    "sections": [
      {
        "heading": "01 / 虚拟化共享物理资源",
        "body": "Hyper-V 在同一物理主机上运行多个虚拟机。规划 vCPU、内存、磁盘性能与故障影响范围；资源超分需要监控。外部、内部、专用虚拟交换机连接范围不同，实验前明确虚拟机是否可接触真实网络。"
      },
      {
        "heading": "02 / 存储提供什么接口",
        "body": "NAS 通常提供文件协议如 SMB/NFS，SAN 通常提供块存储如 iSCSI/FC。RAID 提高某些磁盘故障下的可用性，不保护所有误删、恶意加密或站点损坏。容量、IOPS、吞吐和延迟是不同指标。"
      },
      {
        "heading": "03 / 备份以恢复为目标",
        "body": "快照或检查点依赖原有存储和链路，通常不是独立备份。采用适当的离线或不可变副本，明确保留期、加密和恢复权限。RPO 表示可容忍的数据丢失时间窗口，RTO 表示目标恢复时间；只有恢复演练才能验证。"
      }
    ],
    "takeaway": "备份任务成功只是起点，成功恢复并验证数据才是终点。",
    "source": {
      "title": "Microsoft Learn · Hyper-V",
      "url": "https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/"
    },
    "lab": {
      "title": "完成一次文件恢复",
      "environment": "Hyper-V 或其他实验虚拟化平台；只使用测试文件。",
      "steps": [
        "建立隔离虚拟交换机与虚拟机，记录资源分配。",
        "创建测试文件并计算哈希，制作独立备份副本。",
        "删除测试文件后从备份恢复，比较哈希并记录耗时。"
      ],
      "command": "# PowerShell\nGet-VM\nGet-VMSwitch\nGet-FileHash C:\\Lab\\sample.txt -Algorithm SHA256",
      "verify": "恢复文件内容与原始哈希一致，记录恢复耗时和最近可恢复时间点。"
    },
    "quiz": {
      "question": "RAID 为什么不能替代备份？",
      "options": [
        "它一定更慢",
        "误删和损坏可能同步影响阵列数据",
        "它不能存文件"
      ],
      "correct": 1,
      "explanation": "RAID 主要针对部分磁盘故障；独立备份还需覆盖逻辑损坏、误删与更大故障域。"
    }
  },
  {
    "id": "s05",
    "track": "system",
    "stage": "s2",
    "title": "高级 AD 与证书安全",
    "en": "Replication, LAPS & PKI",
    "minutes": 30,
    "summary": "当域跨越站点，身份服务还要面对复制、管理凭据与证书生命周期。",
    "objective": "检查复制健康，并识别信任、管理员凭据及证书的管理边界。",
    "sections": [
      {
        "heading": "01 / 多域控与多站点",
        "body": "Sites 和子网映射帮助客户端定位服务并组织复制拓扑。检查复制不能只看一台域控是否在线，还需看复制伙伴、失败时间与积压。FSMO 角色各有职责，角色转移与故障夺取是不同操作，不能无依据执行。"
      },
      {
        "heading": "02 / 控制管理凭据",
        "body": "Windows LAPS 管理本地管理员密码的轮换与检索权限，减少相同本地密码横向扩散风险。把管理账号与日常账号分离，限制高权限登录范围。Trust 建立认证路径，但不自动授权访问资源。"
      },
      {
        "heading": "03 / PKI 管理信任链",
        "body": "证书绑定身份与公钥，使用时检查有效期、名称、用途、链与吊销状态。AD CS 证书模板与注册权限需要严格管理；过宽模板可能导致身份滥用。记录签发、更新、吊销和 CA 备份流程。"
      }
    ],
    "takeaway": "信任关系解决“可以认证”，资源授权仍需单独决定。",
    "source": {
      "title": "Microsoft Learn · Active Directory Certificate Services",
      "url": "https://learn.microsoft.com/en-us/windows-server/identity/ad-cs/active-directory-certificate-services-overview"
    },
    "lab": {
      "title": "身份与证书健康检查",
      "environment": "具备两台实验域控的隔离域；证书分析使用公开网站或实验 CA。",
      "steps": [
        "在实验域控查看复制摘要，记录成功与失败时间。",
        "用浏览器证书查看器检查名称、到期时间与签发链。",
        "写出本地管理员密码检索和证书模板注册各允许哪些组。"
      ],
      "command": "# 在具备 AD 管理工具的实验环境\nrepadmin /replsummary\nrepadmin /showrepl\n# 读取本机证书\nGet-ChildItem Cert:\\LocalMachine\\My",
      "verify": "能够区分复制健康、认证路径、授权和证书校验四类问题。"
    },
    "quiz": {
      "question": "建立域信任后，是否自动获得所有文件访问权限？",
      "options": [
        "是",
        "否，资源还需单独授权",
        "仅由 DNS 决定"
      ],
      "correct": 1,
      "explanation": "信任提供跨边界的认证路径，访问资源仍受授权策略约束。"
    }
  },
  {
    "id": "s06",
    "track": "system",
    "stage": "s2",
    "title": "高可用与灾难恢复",
    "en": "Failover clusters & disaster recovery",
    "minutes": 30,
    "summary": "一台服务器故障与整个站点不可用，需要不同的恢复策略。",
    "objective": "用业务指标定义高可用、RPO/RTO 与恢复演练。",
    "sections": [
      {
        "heading": "01 / 集群解决部分故障",
        "body": "Failover Cluster 协调多个节点接管受支持的工作负载。Quorum 用于判断哪些节点有权继续服务，避免分裂状态。共享存储、网络和见证资源都要纳入故障分析；集群不能修复已经损坏的数据。"
      },
      {
        "heading": "02 / 恢复有顺序",
        "body": "灾难恢复需按依赖恢复网络、身份、DNS、存储、数据库和应用等服务。RPO 衡量可接受的数据回退窗口，RTO 衡量恢复耗时目标。目标应由业务决定，再评估备份、复制和容量能否达到。"
      },
      {
        "heading": "03 / 让演练可复现",
        "body": "在隔离环境中从已知恢复点启动服务，校验数据一致性、账号权限与外部依赖。记录实际恢复时间，比较目标差距。复制会传播误删或损坏，因此 HA、复制和历史备份应相互补充。"
      }
    ],
    "takeaway": "高可用降低停机影响，备份和灾难恢复解决更广的故障与数据恢复问题。",
    "source": {
      "title": "Microsoft Learn · Failover Clustering",
      "url": "https://learn.microsoft.com/en-us/windows-server/failover-clustering/failover-clustering-overview"
    },
    "lab": {
      "title": "编写并演练恢复手册",
      "environment": "实验虚拟机、测试服务与其独立备份。",
      "steps": [
        "设定示例 RPO 24 小时、RTO 2 小时，并说明对应业务风险。",
        "列出恢复顺序、备份位置、所需权限与验证请求。",
        "从备份恢复测试服务，计时并检查数据，记录目标是否达成。"
      ],
      "command": "恢复记录\n开始时间：\n恢复点时间：\n身份与 DNS 就绪：\n服务启动：\n数据与请求验证：\n实际 RPO / RTO：",
      "verify": "独立完成一次恢复并给出证据；如不满足目标，明确瓶颈和改进。"
    },
    "quiz": {
      "question": "RPO 主要衡量什么？",
      "options": [
        "允许丢失数据的时间窗口",
        "CPU 主频",
        "服务恢复所需目标时间"
      ],
      "correct": 0,
      "explanation": "RPO 对应数据恢复点，RTO 对应恢复所需时间目标，两者不能混用。"
    }
  },
  {
    "id": "s07",
    "track": "system",
    "stage": "s2",
    "title": "脚本、配置管理与 IaC",
    "en": "PowerShell, Bash, Ansible & Terraform",
    "minutes": 30,
    "summary": "把配置变成可审查的代码，让重复操作有一致结果。",
    "objective": "区分脚本、配置管理与资源编排，并设计受控变更。",
    "sections": [
      {
        "heading": "01 / 脚本先处理输入和错误",
        "body": "PowerShell 以对象管道为核心，Bash 常组合文本工具。对路径和输入做校验，处理非零退出状态与异常，记录足够日志但不写入密码。远程执行需要明确目标列表、身份与权限。"
      },
      {
        "heading": "02 / 声明状态与幂等",
        "body": "Ansible 常描述软件、文件和服务应处于的状态，重复执行不应产生无谓变化。幂等并非所有任意 shell 命令自动具备的属性。Git 记录可审查变更，先分支、比较差异，再在小范围实验。"
      },
      {
        "heading": "03 / Terraform 管理资源生命周期",
        "body": "Terraform 使用配置和 state 跟踪资源，plan 展示预期操作，apply 执行。state 可能包含敏感信息，需要访问控制、加密与合适的锁机制。先理解替换和删除风险；配置管理与资源编排可配合使用。Azure Arc 等工具还可把混合环境纳入集中管理，但仍需规划权限与连接。"
      }
    ],
    "takeaway": "自动化应把目标、差异、执行和验证都留下可追踪证据。",
    "source": {
      "title": "HashiCorp · Terraform Introduction",
      "url": "https://developer.hashicorp.com/terraform/intro"
    },
    "lab": {
      "title": "写一个只读服务报告",
      "environment": "自己的 Windows PowerShell 实验环境；不创建云资源。",
      "steps": [
        "读取服务并筛选停止状态，导出 CSV。",
        "再次运行，确认只是刷新报告，不改变服务状态。",
        "把脚本和使用说明纳入 Git，检查 diff，确保没有凭据。"
      ],
      "command": "Get-Service |\n  Where-Object Status -eq 'Stopped' |\n  Select-Object Name, DisplayName, Status |\n  Export-Csv ./services-report.csv -NoTypeInformation\n\ngit diff --stat",
      "verify": "报告可重复生成，脚本不修改服务，仓库中没有秘密信息。"
    },
    "quiz": {
      "question": "Terraform apply 之前为什么需要审查 plan？",
      "options": [
        "确认将创建、修改、替换或删除什么",
        "只为了增加运行时间",
        "plan 可以代替备份"
      ],
      "correct": 0,
      "explanation": "plan 展示预期资源变更；重点核对替换与删除，确认目标和影响范围。"
    }
  },
  {
    "id": "s08",
    "track": "system",
    "stage": "s2",
    "title": "监控、排障与综合项目",
    "en": "Observability & systems capstone",
    "minutes": 30,
    "summary": "从“机器在线”走向“用户真正能完成任务”。",
    "objective": "结合指标、日志与请求验证定位故障，并交付一套可运维系统。",
    "sections": [
      {
        "heading": "01 / 指标、日志与追踪",
        "body": "指标适合看趋势和告警，日志记录离散事件，追踪帮助理解跨服务请求。Prometheus 采集时间序列指标，Grafana 常用于可视化。标签维度要可控，避免把每个用户或请求 ID 作为无界指标标签。"
      },
      {
        "heading": "02 / 围绕业务设计告警",
        "body": "CPU 使用率是线索，不等于用户影响。把可用性、错误率、延迟与资源饱和度联系起来，使用持续时间、路由和去重降低噪声。告警应指向可执行的运行手册，说明谁响应、如何确认和何时升级。"
      },
      {
        "heading": "03 / 交付可以接手的系统",
        "body": "综合项目包含域身份、Linux 服务、文件权限、虚拟化、独立备份与监控。用错误 DNS、磁盘接近满或服务停止等隔离实验验证检测和恢复。记录时间线、假设、证据、根因及预防措施；不要只写“重启已解决”。"
      }
    ],
    "takeaway": "可观测性帮助缩小不确定性，恢复验证证明用户任务已经恢复。",
    "source": {
      "title": "Prometheus · Overview",
      "url": "https://prometheus.io/docs/introduction/overview/"
    },
    "lab": {
      "title": "搭建小型企业系统实验室",
      "environment": "两到三台隔离虚拟机与监控工具；仅合成测试数据。",
      "steps": [
        "配置基础身份与 DNS、一项 Linux Web 服务和按组授权的共享目录。",
        "采集主机与服务指标，设置可解释的可用性告警，并建立独立备份。",
        "停止实验 Web 服务，观察告警，按手册恢复并验证 HTTP 请求及数据。"
      ],
      "command": "# Linux 服务排查，服务名按实际安装修改\nsystemctl status nginx\njournalctl -u nginx --since '15 minutes ago'\nss -lnt\ncurl -I http://localhost\ndf -h",
      "verify": "完成拓扑、账号权限矩阵、监控截图或导出结果、恢复计时与故障报告。"
    },
    "quiz": {
      "question": "哪一种检查最能直接反映 Web 服务是否响应用户请求？",
      "options": [
        "只看 CPU 使用率",
        "发起 HTTP 请求并验证响应",
        "只看虚拟机电源状态"
      ],
      "correct": 1,
      "explanation": "实际请求更接近用户体验；CPU 与电源状态只能作为辅助证据。"
    }
  }
] as Lesson[]);
