type TextPair = readonly [en: string, zh: string];

type FieldCase = {
  question: TextPair;
  evidence: TextPair;
  reasoning: TextPair;
  review?: string;
};

export const fieldCases: Record<string, FieldCase> = {
  n01: {
    question: ['Who hands your message to the printer?', '电脑发出的打印任务，谁把它交给打印机？'],
    evidence: ['Your laptop and printer sit on the same office network. Both plug into a switch. The printer already has an IP address and your laptop knows it.', '办公室电脑和打印机在同一个网段，两根网线都接到交换机。打印机已有 IP 地址，电脑也知道这个地址。'],
    reasoning: ['The laptop puts the print data in a frame addressed to the printer’s network interface. The switch forwards that frame. To reach a printer on another subnet, the laptop would send the first frame to its router instead.', '电脑先把打印数据装进一个“帧”，在外面写上打印机网卡的地址。交换机负责转交。如果打印机在另一个网段，电脑就要把第一帧先交给路由器。'],
  },
  n16: {
    review: 'n01',
    question: ['Why can a video call lag on a fast line?', '明明网速很快，视频通话为什么还有延迟？'],
    evidence: ['A file download reaches 80 Mb/s. During a call, a small request still takes 180 ms to receive a reply.', '下载文件时能达到 80 Mb/s。但通话期间，一个很小的请求发出去，也要等 180 毫秒才收到回复。'],
    reasoning: ['The download measures how much data arrived each second. The request measures a round trip. A line can carry a lot of data while each exchange takes a long time.', '下载看的是一秒内能送到多少数据，小请求看的是来回一趟要多久。一条线路可以每秒传很多数据，同时每次来回都要等很久。'],
  },
  n02: {
    review: 'n01',
    question: ['Can .70 reach .130 directly?', '尾号 .70 的电脑能直接把数据交给 .130 吗？'],
    evidence: ['Two office PCs use 192.168.10.70/26 and 192.168.10.130/26. A /26 divides the last number into blocks of 64. The blocks begin at 0, 64, 128 and 192.', '两台电脑分别使用 192.168.10.70/26 和 192.168.10.130/26。/26 把最后一段号码每 64 个分为一组，各组从 0、64、128、192 开始。'],
    reasoning: ['70 falls in 64–127. 130 falls in 128–191. The PCs are in different IP subnets, so the sender needs a route through a gateway, even if both cables run to the same switch.', '70 落在 64～127，130 落在 128～191，两台电脑属于不同的 IP 子网。即使网线接在同一台交换机上，发送方也需要通过网关转发。'],
  },
  n13: {
    review: 'n02',
    question: ['Whose hardware address does the laptop look up?', '访问远端网站时，电脑先查谁的网卡地址？'],
    evidence: ['A laptop at 192.168.1.20/24 sends a packet to 203.0.113.8. Its default gateway is 192.168.1.1. Its table of local hardware addresses is empty.', '电脑地址是 192.168.1.20/24，目标网站是 203.0.113.8，默认网关是 192.168.1.1。本机还没有缓存邻居的网卡地址。'],
    reasoning: ['The gateway is the next device on this local link. ARP asks who owns 192.168.1.1. The laptop uses the reply to address its first frame, while the packet inside still names 203.0.113.8.', '本地链路上的下一站是网关。电脑用 ARP 询问“谁是 192.168.1.1”，再把应答中的网卡地址写在第一帧外面。帧里面的数据包仍写着网站地址 203.0.113.8。'],
  },
  n03: {
    review: 'n02',
    question: ['Your laptop has an address. Why can’t it find the intranet?', '电脑已经有 IP 地址，为什么还找不到内网站点？'],
    evidence: ['The laptop received an address from DHCP. A connection to the known server IP and port works. Looking up the intranet name on the configured DNS server returns “name not found”.', '电脑已通过 DHCP 领到地址，也能连上已知的服务器 IP 和端口。但向当前 DNS 服务器查询内网名称时，返回“找不到名称”。'],
    reasoning: ['DHCP supplied the laptop’s network settings. DNS has a different job: turning the site name into an address. Check the spelling, the selected DNS server and the record it serves.', 'DHCP 负责发放网络设置。DNS 负责把站点名称翻译成地址。现在已有端口可达的证据，下一步应核对名字拼写、正在使用的 DNS 服务器及其记录。'],
  },
  n14: {
    review: 'n03',
    question: ['Why did DNS disappear from the packet list?', '输入 tcp 后，为什么列表里的 DNS 报文消失了？'],
    evidence: ['A saved example contains a DNS query over UDP followed by a TCP handshake. Applying the tcp display filter leaves three handshake packets visible.', '一份已保存的示例先记录了通过 UDP 发出的 DNS 查询，随后记录了一次 TCP 握手。输入显示过滤器 tcp 后，只看到三条握手报文。'],
    reasoning: ['The filter selects which saved rows to display. Clear it to see the original query. Now read the three handshake rows by direction: laptop to server, server to laptop, then laptop to server.', '显示过滤器只是挑出哪些已保存的行要显示。清空它就能再看到原来的查询。再按方向读三条握手记录：电脑到服务器、服务器回电脑、电脑再回服务器。'],
  },
  n15: {
    review: 'n03',
    question: ['What has already worked if the browser shows 404?', '浏览器收到 404 时，哪些步骤已经成功了？'],
    evidence: ['Opening a new HTTPS connection to the course site shows a valid certificate. The home page loads. A link to yesterday’s worksheet returns HTTP 404.', '浏览器为课程站点新建了 HTTPS 连接，证书验证成功，首页也能打开。点昨天的练习链接，返回 HTTP 404。'],
    reasoning: ['An HTTP component received the request and sent a response over the secure connection. Compare the worksheet path with the published link and check whether the file moved.', '已有 HTTP 组件通过加密连接收到了请求并发回响应。先对照练习链接的路径和实际发布位置，看看文件是否已经移动。'],
  },
  n04: {
    review: 'n13',
    question: ['Why does Wi-Fi still work upstairs but the desk phones go offline?', '楼上无线网络正常，为什么同楼层的办公电话全断了？'],
    evidence: ['Two switches share one cable. The uplink is configured to carry VLAN 10 for access points. The new desk phones use VLAN 20, which is missing from the uplink’s allowed list.', '两台交换机共用一条上联线。上联允许无线接入点使用的 VLAN 10 通过，新电话使用的 VLAN 20 却没有列入允许清单。'],
    reasoning: ['Each VLAN is a separate local network. A trunk carries several of them on one link. Check that VLAN 20 exists, the phone ports use it and both ends of the uplink permit it.', '每个 VLAN 相当于一个独立的本地网络。Trunk 让多个 VLAN 共用一条线。沿途核对 VLAN 20 是否存在、电话端口是否归入它，以及上联两端是否都允许它通过。'],
  },
  n05: {
    review: 'n02',
    question: ['Which exit does a router choose?', '路由表里有两个可用出口，数据往哪边走？'],
    evidence: ['The table sends 10.0.0.0/8 to A and 10.2.0.0/16 to B. A packet is addressed to 10.2.3.4.', '路由表写着 10.0.0.0/8 走 A，10.2.0.0/16 走 B。现在要转发到 10.2.3.4。'],
    reasoning: ['Both routes cover the address. The /16 matches the first 16 bits and describes a smaller range, so the router uses B. OSPF is one way routers can learn entries for this table.', '两条都匹配，但 /16 匹配前 16 位，描述的范围更小，因此从 B 转发。OSPF 是路由器自动学习这些表项的一种方式。'],
  },
  n06: {
    review: 'n05',
    question: ['Who decides whether a guest may print?', '访客已经可以上网，谁决定他能不能用办公打印机？'],
    evidence: ['Guests share an Internet-facing address through NAT. Office policy lets them browse the web but denies access to the printer subnet.', '访客通过 NAT 共用一个对外地址。办公室的规则允许访客浏览网页，但禁止访问打印机网段。'],
    reasoning: ['Address translation maps addresses between networks. The access decision belongs to a firewall or access control list. Trace the guest-to-printer path and identify where that rule is enforced.', '地址转换负责改写地址。防火墙或访问控制列表负责判断是否放行。沿着“访客到打印机”的路径找出经过哪台设备，以及哪条规则在这里生效。'],
  },
  n07: {
    review: 'n05',
    question: ['Two providers offer the same destination. Which exit wins?', '两家运营商都能到同一个网段，公司优先走哪家？'],
    evidence: ['Two otherwise comparable BGP routes reach the same prefix. Inside the company, the fibre route has local preference 200 and the backup route has 100.', '两条 BGP 路由到达同一前缀，其他条件相当。公司内部把光纤线路的本地优先级设为 200，备用线路设为 100。'],
    reasoning: ['The higher local preference favours the fibre exit. BGP advertises reachability between routing domains. A route reflector can share the chosen route internally without every router talking to every other router.', '本地优先级较高，光纤出口优先。BGP 在不同路由管理域之间通告“哪里可达”。在公司内部，路由反射器可以转告路由，减少路由器两两建立会话的需要。'],
  },
  n08: {
    review: 'n03',
    question: ['Why do only some customers see the website time out?', '同一个网站，为什么只有部分用户一直等不到响应？'],
    evidence: ['The name publishes an A record for IPv4 and an AAAA record for IPv6. The IPv4 address responds. A test to the IPv6 address from the affected network times out.', '同一域名既公布 IPv4 地址（A 记录），也公布 IPv6 地址（AAAA 记录）。测试 IPv4 有响应，从受影响的网络测试 IPv6 却超时。'],
    reasoning: ['These are two paths that can fail independently. Follow the IPv6 path from the client’s gateway to the server, checking the route, filtering and whether the service listens on IPv6.', '这是两条可以分别出故障的路径。沿客户端网关到服务器的 IPv6 路径，逐段核对路由、过滤规则，以及服务是否监听 IPv6。'],
  },
  n09: {
    review: 'n05',
    question: ['How can two customers both use 10.0.0.8?', '两家客户都使用 10.0.0.8，路由器怎么分得清？'],
    evidence: ['A provider connects two customers to different interfaces. Each customer has a server with the same private IP address.', '运营商用两个接口连接两家客户。两家客户的服务器恰好使用相同的私有 IP。'],
    reasoning: ['Place the interfaces in separate routing instances, called VRFs. First identify the customer from the incoming interface, then look up 10.0.0.8 in that customer’s table. The same address can point to two different destinations.', '把接口分别归入独立的路由实例，也就是 VRF。先从入站接口判断是哪家客户，再去这家客户的表里查 10.0.0.8。同一个地址在两张表里可以指向不同目的地。'],
  },
  n10: {
    review: 'n04',
    question: ['How can one tenant network reach across two racks?', '两排机柜之间只有 IP 网络，同一租户的以太网帧怎么过去？'],
    evidence: ['At rack A a tunnel endpoint receives a frame for a tenant. Rack B hosts the destination. The two tunnel endpoints can already reach each other by IP.', '机柜 A 的隧道端点收到租户的帧，目标机器在机柜 B。两个端点之间已经可以通过 IP 通信。'],
    reasoning: ['VXLAN wraps the frame in an outer packet addressed to rack B’s endpoint. A virtual network identifier labels the tenant segment. Rack B removes the wrapper and forwards the inner frame. EVPN can advertise where tenant addresses live.', 'VXLAN 在帧外面再包一层，目的地址写机柜 B 的隧道端点，并用虚拟网络标识区分租户网段。B 拆掉外层再转发原来的帧。EVPN 可以告诉端点，租户地址位于哪里。'],
  },
  n11: {
    review: 'n06',
    question: ['Did all twelve switch ports come back?', '批量变更显示成功，十二个交换机端口都恢复了吗？'],
    evidence: ['An automation job reports twelve successful configuration replies. Before the change, twelve expected uplinks were operational. A fresh status report lists eleven up.', '自动化任务收到了十二个配置成功的回复。变更前预期工作的十二条上联都正常，变更后的状态报告只显示十一条正常。'],
    reasoning: ['The replies confirm the devices accepted the request. Compare the expected port list with the observed list to find the missing uplink, then verify its traffic before closing the change.', '回复说明设备接受了请求。把预期端口清单与实际状态逐项比对，定位少了哪条上联，再验证它能传送业务流量，才算完成验收。'],
  },
  n12: {
    review: 'n08',
    question: ['Does buying a second line keep the branch online?', '加买一条线路，就能让分公司在断网时继续工作吗？'],
    evidence: ['Both lines enter the building through one cabinet powered by one outlet. Staff need to reach the order system within five minutes of a failure.', '两条线都经过同一机柜，而且由同一个插座供电。业务要求发生故障后五分钟内可以重新打开订单系统。'],
    reasoning: ['One power failure can take both links down. Draw the shared dependencies, design an independent path, then time a lab failover all the way to a successful order lookup.', '一次断电就可能让两条线路一起中断。先画出共用的设备和供电，设计能独立工作的路径，再在实验里从故障发生开始计时，直到真正查到订单。'],
  },
  s01: {
    question: ['The server is on. Can a colleague actually use it?', '服务器电源亮着，同事就一定能打开网页吗？'],
    evidence: ['The operating system has booted. Its service manager lists the web program as running. A colleague still sees a connection error.', '操作系统已启动，服务管理器也说网页程序正在运行，但同事打开网页时仍看到连接错误。'],
    reasoning: ['A running process is one piece of evidence. Next check whether it is waiting for network requests on the expected port. Try a request locally and then from the colleague’s computer to narrow down where it fails.', '程序在运行只是第一条线索。再看它是否在预期的端口等待请求，然后分别在服务器本机和同事的电脑上访问一次。比较结果，就能缩小故障范围。'],
  },
  s09: {
    review: 's01',
    question: ['Why does the web page open only on the server?', '为什么只有在服务器自己身上才能打开网页？'],
    evidence: ['The web service is active. Its listening address is 127.0.0.1:8080. A browser on the server can open the page. A colleague on a different computer cannot.', '网页服务处于活动状态，监听地址是 127.0.0.1:8080。服务器本机的浏览器能打开页面，同事的电脑却打不开。'],
    reasoning: ['127.0.0.1 is the loopback address: it reaches only this computer. The listener accepts local requests. Check whether the intended design uses a reverse proxy or a listener on a network-facing address.', '127.0.0.1 是回环地址，只通向本机。这个监听端口接收的是本机请求。接下来核对设计，看应由反向代理接入，还是应在面向网络的地址上监听。'],
  },
  s02: {
    review: 'n03',
    question: ['Why can a PC browse the Internet but fail to find its domain?', '电脑能打开外网，却找不到公司的域，为什么？'],
    evidence: ['DHCP gave a new office PC a public DNS resolver. Public names resolve. The internal service record naming the domain controller is missing from that resolver.', '新电脑通过 DHCP 领到一个公共 DNS 服务器地址。公共域名都能解析，但这台 DNS 没有公司用来查找域控制器的内部服务记录。'],
    reasoning: ['A domain controller helps verify company accounts. The PC must discover it before logging in to the domain. Check the DNS settings supplied by DHCP and query the internal service record using the company resolver.', '域控制器负责帮助验证公司账号。电脑需要先找到它，才能进行域登录。核对 DHCP 下发的 DNS 设置，再用公司的解析服务器查询那条内部服务记录。'],
  },
  s10: {
    review: 'n03',
    question: ['Which line in PowerShell tells you the port answered?', 'PowerShell 输出里，哪一行说明端口连通了？'],
    evidence: ['A name resolves to the expected address. Test-NetConnection to port 443 reports TcpTestSucceeded = True, yet signing in to the site fails.', '域名解析出了预期地址。用 Test-NetConnection 测试 443 端口，结果是 TcpTestSucceeded = True，但登录网站失败。'],
    reasoning: ['The TCP connection to that address and port succeeded. Now inspect the HTTPS response and the sign-in error. Record the address and timestamp so another engineer can compare the right logs.', '这个结果证明能与该地址和端口建立 TCP 连接。下一步看 HTTPS 响应和登录报错，并记下地址与时间，方便同事对照相应日志。'],
  },
  s03: {
    review: 's02',
    question: ['Why can Mei open a shared file but not save it?', '小美能打开共享文件，为什么却保存不了？'],
    evidence: ['For Mei’s account the shared folder allows Read. The underlying NTFS folder allows Modify. She accesses it over the network. Assume there are no other applicable permissions.', '对小美的账号，共享权限允许读取，底层 NTFS 文件夹权限允许修改。她从网络访问这个共享，假设没有其他适用权限。'],
    reasoning: ['A network write must pass both permission checks. The share allows only reading, so saving fails. Check the effective share and file permissions for her group before changing access.', '从网络写入必须同时通过两道权限检查。共享这一层只允许读，所以保存失败。调整之前，先查她所在组在共享层和文件层的有效权限。'],
  },
  s04: {
    review: 's01',
    question: ['Can a mirrored disk recover yesterday’s deleted file?', '磁盘做了镜像，能找回昨天误删的文件吗？'],
    evidence: ['Two disks contain the same live data. An accidental deletion has already been mirrored to both. An independent backup from the previous night is available.', '两块磁盘保存同一份实时数据。误删操作已经同步到两块盘上，另有前一晚的独立备份。'],
    reasoning: ['Mirroring helps a system survive a disk failure. It also copies the deletion. Restore the previous version to a separate location and check its contents before returning it to the user.', '镜像可以帮助系统在一块盘损坏时继续工作，也会同步删除操作。把备份中的旧版本恢复到另一个位置，核对内容后再交还给用户。'],
  },
  s05: {
    review: 's02',
    question: ['A valid company login, but no access to the partner share?', '公司账号通过了验证，为什么打不开合作方的共享文件夹？'],
    evidence: ['Two domains trust each other. The partner domain can verify the employee’s identity. Its file server has no read permission assigned to that employee or their groups.', '两个域之间建立了信任。合作方能验证这位员工的身份，但其文件服务器没有给该员工或其所属组分配读取权限。'],
    reasoning: ['Trust provides an authentication path: it establishes who is asking. The file server separately checks authorization: what this identity may do. Examine the resource permissions for the intended group.', '域信任建立认证路径，用来确认“来的人是谁”。文件服务器还会单独检查授权，决定“这个人能做什么”。这时应核对目标组在该共享上的权限。'],
  },
  s06: {
    review: 's04',
    question: ['The application is back. Did recovery meet both targets?', '应用重新上线了，两项恢复目标都达到了吗？'],
    evidence: ['An outage starts at 10:00. The latest recoverable data is from 09:45. Users resume work at 10:40. The business allows 10 minutes of lost data and 60 minutes of downtime.', '10:00 发生故障，最近可恢复的数据停在 09:45，用户于 10:40 恢复工作。业务允许最多丢失 10 分钟的数据，最多中断 60 分钟。'],
    reasoning: ['Data rolled back 15 minutes, beyond the 10-minute recovery point objective (RPO). Service returned in 40 minutes, within the 60-minute recovery time objective (RTO). Report both results.', '数据回退了 15 分钟，超出 10 分钟的恢复点目标（RPO）。服务用了 40 分钟恢复，达到 60 分钟的恢复时间目标（RTO）。报告里要把这两个结果分别写清楚。'],
  },
  s07: {
    review: 's09',
    question: ['What should happen the second time you run a configuration?', '同一份配置连续执行两次，第二次应该发生什么？'],
    evidence: ['A configuration says the web service should be enabled at boot. On the first run the tool enables it. Nobody changes it before the second run.', '配置文件要求网页服务开机自启。工具第一次执行时已经启用了它，第二次执行前没有人改动。'],
    reasoning: ['On the second run, the desired state already matches the observed state. The tool should report no change for this setting. This property is called idempotence.', '第二次执行时，实际状态与期望状态已经一致。这项设置应报告“无需更改”。重复执行仍得到同一结果，这个性质叫幂等。'],
  },
  s11: {
    review: 's01',
    question: ['Are six failed checkouts too many?', '出现六次结算失败，算不算太多？'],
    evidence: ['During one agreed reporting window there were 10,000 eligible checkout attempts. The service target is at least 99.9% successful checkouts.', '在约定的统计窗口内，有 10,000 次纳入计算的结算尝试。服务目标是成功率至少达到 99.9%。'],
    reasoning: ['This window allows ten failures. Six failures leave four in the error budget. Another four would reach the boundary. A fifth additional failure would miss the target.', '这个窗口最多容许十次失败。已发生六次，还剩四次余量。再失败四次刚好踩线，再多一次就会低于目标。'],
  },
  s08: {
    review: 's11',
    question: ['CPU is quiet. Why did the checkout alert fire?', 'CPU 很空闲，为什么结算功能还会告警？'],
    evidence: ['Checkout success drops at 14:05. A request trace spends most of its time waiting for the database. The web server’s CPU chart stays flat.', '14:05 开始结算成功率下降。一次请求追踪显示大部分耗时都在等待数据库，网页服务器的 CPU 图却没有变化。'],
    reasoning: ['A waiting service can consume little CPU while users see errors. Use the success metric to measure impact, a trace to locate the slow step and logs from the same interval to investigate its cause.', '等待中的服务可能几乎不耗 CPU，用户却已遇到错误。用成功率衡量影响，用请求追踪定位慢在哪一步，再查看同一时段的日志调查原因。'],
  },
};
