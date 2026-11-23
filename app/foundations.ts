import type { Lesson } from './lessons';
import type { Translation } from './english';

type Bilingual = { en: string; zh: string };
const pair = (en: string, zh: string): Bilingual => ({ en, zh });

export const resources = {
  poe: {
    title: pair('Cisco · Troubleshoot PoE on Catalyst 9000 switches', 'Cisco · Catalyst 9000 交换机 PoE 排障'),
    description: pair('Read port power states and inspect the available power budget.', '阅读端口供电状态并检查整机剩余供电预算。'),
    url: 'https://www.cisco.com/c/en/us/support/docs/switches/catalyst-9200-series-switches/215636-troubleshooting-power-over-ethernet-poe.html',
  },
  sdwan: {
    title: pair('Cisco · SD-WAN control and data plane troubleshooting', 'Cisco · SD-WAN 控制平面与数据平面排障'),
    description: pair('Compare control-session evidence with tunnel and forwarding observations.', '对照控制会话、隧道和转发的不同证据。'),
    url: 'https://www.cisco.com/c/en/us/support/docs/routers/sd-wan/222302-troubleshoot-common-sd-wan-control-and-d.html',
  },
  upgrade: {
    title: pair('Cisco · Manage SD-WAN software upgrades', 'Cisco · SD-WAN 软件升级管理'),
    description: pair('Check software image roles and supported upgrade workflows for a device.', '查阅镜像角色及设备支持的升级流程。'),
    url: 'https://www.cisco.com/c/en/us/td/docs/routers/sdwan/configuration/Monitor-And-Maintain/monitor-maintain-book/m-maintenance.html',
  },
  ntp: {
    title: pair('Cisco IOS XE · Network Time Protocol', 'Cisco IOS XE · 网络时间协议'),
    description: pair('Look up clock sources, time zones and NTP verification.', '查阅时间源、时区与 NTP 同步验证。'),
    url: 'https://www.cisco.com/c/en/us/td/docs/routers/ios/config/17-x/syst-mgmt/b-system-management/m_bsm-time-calendar-set.html',
  },
  packetTracer: {
    title: pair('Cisco Networking Academy · Getting Started with Packet Tracer', 'Cisco 网络学院 · Packet Tracer 入门'),
    description: pair('Install the simulator and build a small network before attempting the guided labs.', '先安装模拟器并搭建一个小网络，再开始站内的引导实验。'),
    url: 'https://www.netacad.com/courses/getting-started-cisco-packet-tracer/1000',
  },
  throughput: {
    title: pair('RFC 6349 · TCP throughput testing', 'RFC 6349 · TCP 吞吐量测试'),
    description: pair('Read section 3.2 for round-trip time and bottleneck bandwidth.', '阅读第 3.2 节，了解往返时间和瓶颈带宽。'),
    url: 'https://datatracker.ietf.org/doc/html/rfc6349#section-3.2',
  },
  reliability: {
    title: pair('Google SRE Workbook · Implementing SLOs', 'Google SRE 工作手册 · 制定服务级别目标'),
    description: pair('Follow the worked examples of success ratios and error budgets.', '通过实例学习怎样计算成功率和错误预算。'),
    url: 'https://sre.google/workbook/implementing-slos/',
  },
  arp: {
    title: pair('RFC 826 · Address Resolution Protocol', 'RFC 826 · 地址解析协议'),
    description: pair('Read the packet format and see how ARP requests and replies are processed.', '查看报文格式，以及 ARP 请求和应答如何处理。'),
    url: 'https://www.rfc-editor.org/info/rfc826/',
  },
  wireshark: {
    title: pair('Wireshark · Display filter expressions', 'Wireshark · 显示过滤器表达式'),
    description: pair('Learn how to show selected protocols and fields in an existing capture.', '学习如何在现有抓包中筛选特定协议和字段。'),
    url: 'https://www.wireshark.org/docs/wsug_html_chunked/ChWorkBuildDisplayFilterSection.html',
  },
  tls: {
    title: pair('RFC 8446 · TLS 1.3', 'RFC 8446 · TLS 1.3 协议规范'),
    description: pair('Use the handshake overview after working through the HTTPS lesson.', '读完 HTTPS 课程后，可结合规范中的握手概览进一步学习。'),
    url: 'https://www.rfc-editor.org/info/rfc8446/',
  },
  ubuntu: {
    title: pair('Ubuntu Server · Networking documentation', 'Ubuntu Server · 网络配置文档'),
    description: pair('Look up network configuration and troubleshooting on an Ubuntu VM.', '在 Ubuntu 虚拟机实验中查阅网络配置和排障文档。'),
    url: 'https://ubuntu.com/server/docs/how-to/networking/',
  },
  microsoft: {
    title: pair('Microsoft Learn · Troubleshoot on-premises and hybrid networking', 'Microsoft Learn · 本地与混合网络排障'),
    description: pair('Practice diagnosing Windows Server DHCP, DNS, IP configuration and routes.', '练习诊断 Windows Server 的 DHCP、DNS、IP 配置和路由问题。'),
    url: 'https://learn.microsoft.com/en-us/training/modules/troubleshoot-premises-hybrid-networking/',
  },
};

type Foundation = Pick<Lesson, 'id' | 'track' | 'stage' | 'minutes'> & {
  after: string;
  title: Bilingual;
  summary: Bilingual;
  objective: Bilingual;
  sections: { heading: Bilingual; body: Bilingual }[];
  takeaway: Bilingual;
  resource: keyof typeof resources;
  lab: { title: Bilingual; environment: Bilingual; steps: Bilingual[]; command: string; verify: Bilingual };
  quiz: { question: Bilingual; options: Bilingual[]; correct: number; explanation: Bilingual };
};

const foundations: Foundation[] = [
  {
    id: 'n16', after: 'n01', track: 'network', stage: 'n1', minutes: 12,
    title: pair('Bandwidth, delay & packet loss', '带宽、延迟与丢包'),
    summary: pair('Turn “the network is slow” into a measurement you can explain.', '把“网络很慢”变成你能解释清楚的一项测量结果。'),
    objective: pair('Distinguish capacity from actual throughput and calculate a transfer time and a probe loss rate.', '区分线路容量和实际吞吐量，算出传输所需时间与探测丢包率。'),
    sections: [
      { heading: pair('How much data fits in a second?', '一秒钟能传多少数据？'), body: pair('Bandwidth describes capacity. Throughput is the rate you actually observe. A byte contains eight bits, so a 10 MB file contains 80 megabits in decimal units. At a steady payload rate of 20 Mb/s it takes 80 ÷ 20 = 4 seconds to transfer.', '带宽表示线路的容量，吞吐量是实际测得的传输速率。一个字节有八个位。按十进制单位计算，10 MB 的文件有 80 兆位。如果有效数据的传输速率稳定在每秒 20 兆位，就需要 80 ÷ 20 = 4 秒。') },
      { heading: pair('How long does one exchange take?', '一次来回要等多久？'), body: pair('Round-trip time (RTT) measures the time from sending a probe to receiving its reply. If a tiny request waits 120 ms for a reply, a faster file-transfer rate alone cannot guarantee a faster reply. Queuing, distance and the remote endpoint can all affect the wait.', '往返时间（RTT）是从发出探测到收到应答的时间。如果一个小请求的应答要等 120 毫秒，单靠提高文件传输速率不能保证缩短这段等待。排队、距离、远端处理都可能影响结果。') },
      { heading: pair('Count what did not return', '数一数有多少次没有应答'), body: pair('If 98 out of 100 probes receive replies, the observed probe loss is 2%. Either direction of the path or the reply behaviour of the endpoint can affect this number. Record the endpoints, time and sample size before comparing tests.', '发出 100 次探测，收到 98 次应答，观测到的探测丢包率就是 2%。去程、回程以及终点是否响应都会影响结果。比较两次测试前，先记录两端位置、测试时间和样本数量。') },
    ],
    takeaway: pair('Report the unit with the number: Mb/s for rate, ms for time, and % for observed loss.', '汇报时带上单位：Mb/s 表示速率，ms 表示时间，% 表示观察到的丢包比例。'),
    resource: 'throughput',
    lab: {
      title: pair('Read a branch-office measurement', '读一份分公司测量记录'),
      environment: pair('The sample below and a calculator.', '使用下面的样例和计算器即可。'),
      steps: [pair('Convert the sample file size from megabytes to megabits.', '把样例文件大小从兆字节换算为兆位。'), pair('Divide by the measured payload rate. Record the result in seconds.', '用兆位数除以实际有效速率，以秒为单位记录结果。'), pair('Calculate the proportion of probes without replies. Record the RTT separately.', '计算未获应答的探测比例，另行记录 RTT。')],
      command: 'File / 文件   25 MB\nPayload rate / 有效速率   40 Mb/s\nProbes sent / 发出   50\nReplies / 应答   49\nMedian RTT / 往返时间中位数   35 ms',
      verify: pair('25 × 8 ÷ 40 = 5 seconds. One missing reply out of fifty gives 2% observed loss. The median round trip was 35 ms.', '25 × 8 ÷ 40 = 5 秒。50 次探测少了 1 次应答，观测丢包率为 2%，往返时间中位数是 35 毫秒。'),
    },
    quiz: { question: pair('A 5 MB file arrives in 2 seconds. What is the average payload rate?', '一个 5 MB 的文件在 2 秒内传完，平均有效速率是多少？'), options: [pair('2.5 Mb/s', '每秒 2.5 兆位'), pair('20 Mb/s', '每秒 20 兆位'), pair('40 Mb/s', '每秒 40 兆位')], correct: 1, explanation: pair('5 MB × 8 = 40 megabits. Divide by 2 seconds to get 20 Mb/s.', '5 兆字节乘以 8 是 40 兆位，再除以 2 秒，得到 20 Mb/s。') },
  },
  {
    id: 's11', after: 's07', track: 'system', stage: 's2', minutes: 15,
    title: pair('Service reliability & error budgets', '服务可靠性与错误预算'),
    summary: pair('Use checkout results to tell whether a service met its promise to users.', '用结算结果判断服务有没有达到向用户承诺的目标。'),
    objective: pair('Define a service level indicator (SLI), set a service level objective (SLO) and interpret the remaining error budget.', '定义服务级别指标（SLI）、设置服务级别目标（SLO），并解释剩余的错误预算。'),
    sections: [
      { heading: pair('Decide what counts as good', '先约定什么算成功'), body: pair('For this shop, an eligible checkout is a valid order attempt. A good attempt receives a confirmation within two seconds. Divide good attempts by eligible attempts to get the SLI. Count slow confirmations as failures for this indicator, even if the order eventually completes.', '这家商店约定，格式有效的下单尝试都纳入统计。两秒内收到订单确认才算成功。成功次数除以纳入统计的次数就是 SLI。即使最终下单成功，超过两秒也不计入这项指标的成功次数。') },
      { heading: pair('Set the target and window', '明确目标和统计窗口'), body: pair('Suppose the team agrees that at least 99% of eligible attempts should be good over a calendar month. That is an SLO. Report the window alongside the percentage, since a quiet hour and a busy month represent different evidence.', '假设团队约定每个自然月内，达标的下单尝试至少占 99%，这就是 SLO。汇报百分比时要附上统计窗口，清闲的一小时和忙碌的一个月反映的情况不同。') },
      { heading: pair('Use the budget to make a decision', '用剩余预算决定下一步'), body: pair('With 2,000 eligible attempts, a 99% target allows 20 to miss. If 18 missed, only two remain for that volume. Before the next release, compare the observed failures with the team’s agreed policy and decide whether to prioritise a fix.', '在 2,000 次有效尝试中，99% 的目标允许 20 次未达标。如果已有 18 次未达标，在这个请求量下就只剩两次余量。下一次发版前，把失败情况和团队事先约定的规则对照，决定是否应优先修复。') },
    ],
    resource: 'reliability',
    takeaway: pair('Agree on good events, eligible events, a target and a window before drawing a conclusion.', '先约定何为成功、哪些事件纳入统计、目标值和统计窗口，再判断是否达标。'),
    lab: {
      title: pair('Write a one-line reliability report', '写一条服务可靠性报告'),
      environment: pair('A completed reporting window and the sample counts below.', '使用下面一个已结束的统计窗口的样例数据。'),
      steps: [pair('Calculate the percentage of requests confirmed on time.', '计算按时确认的请求百分比。'), pair('Calculate the permitted number of misses and subtract actual misses.', '算出容许的失败次数，再减去实际失败次数。'), pair('Report the result together with the target and reporting period.', '把结果、目标和统计周期写进同一句报告。')],
      command: 'Period / 周期   April / 四月\nEligible / 有效请求   4,000\nOn time / 按时确认   3,964\nTarget / 目标   99%',
      verify: pair('In April, 3,964 of 4,000 attempts met the limit (99.1%). We met the 99% objective with four of forty permitted misses unused.', '四月共有 4,000 次尝试，3,964 次按时完成（99.1%），达到 99% 的目标。允许的 40 次失败中还有 4 次余量。'),
    },
    quiz: { question: pair('With 1,000 eligible requests and a 99% target, how many can miss while still meeting the target?', '1,000 次有效请求，目标为至少 99% 达标，最多允许几次未达标？'), options: [pair('One', '1 次'), pair('Ten', '10 次'), pair('One hundred', '100 次')], correct: 1, explanation: pair('990 of 1,000 must be good. Ten may miss. Eleven misses would reduce the indicator to 98.9%.', '1,000 次里至少 990 次要达标，可容许 10 次未达标。若有 11 次未达标，指标就会降至 98.9%。') },
  },
  {
    id: 'n13', after: 'n02', track: 'network', stage: 'n1', minutes: 15,
    title: pair('Ethernet, MAC addresses & ARP', '以太网、MAC 地址与 ARP'),
    summary: pair('Follow one IPv4 packet and find out whose MAC address goes on its Ethernet frame.', '跟踪一个 IPv4 数据包，判断以太网帧该填谁的 MAC 地址。'),
    objective: pair('Distinguish a switch’s MAC table from a host’s ARP cache, and predict the next-hop MAC.', '区分交换机的 MAC 地址表和主机的 ARP 缓存，并判断下一跳 MAC。'),
    sections: [
      { heading: pair('A switch learns from the sender', '交换机从发送方学习'), body: pair('A switch associates the source MAC address of an incoming frame with the receiving port and VLAN. It then uses the destination MAC to choose where to forward the frame. Broadcasts and unknown unicasts are normally flooded to other forwarding ports in that VLAN.', '交换机从入站帧的源 MAC 学习它所在的端口和 VLAN，再按目的 MAC 决定转发方向。广播帧和未知单播帧通常会从该 VLAN 内其他处于转发状态的端口发出。') },
      { heading: pair('ARP resolves the local next hop', 'ARP 解析本地下一跳'), body: pair('For communication over Ethernet, a host uses its routing table to choose the next hop. For an on-link IPv4 destination, that is the peer itself. Otherwise it is a router. If there is no cached mapping, the host broadcasts an ARP request for the next-hop IPv4 address. The owner normally replies directly with its MAC address.', '在以太网上通信时，主机先根据路由表选择下一跳。同链路上的 IPv4 目标直接作为下一跳，跨网段则选择路由器。如果缓存中没有对应关系，主机会广播 ARP 请求查询下一跳 IPv4 对应的 MAC。目标地址的持有者通常直接应答。') },
      { heading: pair('One IP destination, different Ethernet frames', '目的 IP 不变，以太网帧逐跳更换'), body: pair('A host sending to a remote server puts the gateway’s MAC on the first frame and the server’s IP on the packet. The router removes that Ethernet header and builds a new link-layer header for the next hop. IPv6 uses Neighbor Discovery instead of ARP.', '主机向远端服务器发送数据时，首个帧的目的 MAC 是网关，数据包的目的 IP 是远端服务器。路由器移除原以太网头，再为下一跳生成新的链路层头。IPv6 使用邻居发现协议处理这一类地址解析。') },
    ],
    takeaway: pair('The ARP cache maps IPv4 to MAC. A switch’s MAC table maps MAC to a port within a VLAN.', 'ARP 缓存将 IPv4 映射到 MAC。交换机的 MAC 地址表将 MAC 映射到 VLAN 内的端口。'),
    resource: 'arp',
    lab: {
      title: pair('Observe first contact on a LAN', '观察局域网内的首次通信'),
      environment: pair('Use the site’s first Packet Tracer LAN lab.', '使用本站第一套 Packet Tracer 局域网实验。'),
      steps: [
        pair('Open a fresh copy of the LAN lab. On PC-A, enter Simulation mode and display ARP and ICMP events.', '打开一份新的局域网实验。在 Simulation 模式中显示 ARP 和 ICMP 事件。'),
        pair('From PC-A, ping PC-B. Advance events and compare the destination of the ARP request with the destination of the reply.', '从 PC-A ping PC-B，逐步推进事件，比较 ARP 请求和应答各自的目的地址。'),
        pair('Compare the mapping in the PC’s ARP cache with the source MAC and port learned by the switch.', '对照电脑的 ARP 缓存，以及交换机学习到的源 MAC 与端口。'),
      ],
      command: 'PC-A> ping 192.168.10.11\nPC-A> arp -a\nS1# show mac address-table',
      verify: pair('Identify PC-B’s MAC in the ARP reply and record which switch port leads to PC-B.', '从 ARP 应答找出 PC-B 的 MAC，并记录交换机连接 PC-B 的端口。'),
    },
    quiz: {
      question: pair('What is the destination MAC on a host’s first frame to a remote subnet?', '主机向远端网段发送数据时，首个承载该 IP 包的帧使用哪个目的 MAC？'),
      options: [pair('The remote server’s MAC', '远端服务器的 MAC'), pair('The local next-hop router’s MAC', '本地下一跳路由器的 MAC'), pair('The sender’s own MAC', '发送端自己的 MAC')],
      correct: 1,
      explanation: pair('Ethernet delivers the frame on the local link. The IP header still names the remote server.', '以太网帧负责本地链路的交付，IP 头仍指向远端服务器。'),
    },
  },
  {
    id: 'n14', after: 'n03', track: 'network', stage: 'n1', minutes: 20,
    title: pair('Packet capture with Wireshark', '用 Wireshark 读懂抓包'),
    summary: pair('Read packet evidence in order and build a short timeline of a connection.', '按时间顺序读报文，用几条证据还原连接过程。'),
    objective: pair('Apply a display filter and identify the three steps of TCP connection setup.', '使用显示过滤器，识别 TCP 建立连接的三个步骤。'),
    sections: [
      { heading: pair('Capture scope and display filters', '抓包范围与显示过滤器'), body: pair('The capture interface determines what traffic you can observe. A capture filter limits what gets saved. A display filter such as tcp narrows the current view while keeping the underlying packets intact. Work with captures from a lab you control or with approved sample files.', '抓包接口决定你能看到哪一段流量。捕获过滤器决定哪些包会被保存。tcp 这样的显示过滤器只缩小当前显示范围，原有报文依然保留。请使用自己控制的实验环境或获准使用的样例。') },
      { heading: pair('Read flags and direction', '看标志位和通信方向'), body: pair('In an ordinary TCP handshake the client sends SYN, the server replies with SYN and ACK, and the client sends ACK. Check the source, destination and ports on each row. A single SYN at one capture point does not establish where a response was lost.', '普通 TCP 握手中，客户端发 SYN，服务端回 SYN 和 ACK，客户端再回 ACK。逐条核对源地址、目的地址和端口。若某个抓包点只有 SYN，还需要其他证据才能判断应答在哪一段丢失。') },
    ],
    takeaway: pair('Record the capture point, time, direction and observed packets before drawing conclusions.', '先记录抓包位置、时间、方向和实际看到的报文，再下结论。'),
    resource: 'wireshark',
    lab: {
      title: pair('Compare the shown packets', '练习筛选并对照报文'),
      environment: pair('Use the simulated packet table in this lesson. Optionally repeat with Wireshark on an approved lab capture.', '先使用本课中的模拟报文表，也可以用 Wireshark 打开获准使用的实验抓包复练。'),
      steps: [
        pair('Show all packets and identify the DNS response to the client.', '显示全部报文，找出发给客户端的 DNS 应答。'),
        pair('Choose TCP and identify the order of the flags and the client’s source port.', '选择 TCP，找出标志位顺序和客户端源端口。'),
        pair('Return to all packets and explain why the DNS rows reappear.', '恢复显示全部，解释为什么 DNS 报文又出现了。'),
      ],
      command: 'dns\ntcp\ntcp.flags.syn == 1\ntcp.port == 443',
      verify: pair('Identify SYN, SYN/ACK and ACK in order and explain what a display filter changes.', '依序指出 SYN、SYN/ACK 与 ACK，并说清显示过滤器改变了什么。'),
    },
    quiz: {
      question: pair('What happens to hidden packets when a Wireshark display filter is cleared?', '清除 Wireshark 显示过滤器后，原先被隐藏的报文会怎样？'),
      options: [pair('They are displayed again', '重新显示'), pair('A new packet capture starts', '自动开始重新抓包'), pair('They are recovered from the server', '从服务器重新取回')],
      correct: 0,
      explanation: pair('Display filters change the view. The original capture still contains the saved packets.', '显示过滤器只改变视图，抓包文件中的报文仍然保留。'),
    },
  },
  {
    id: 'n15', after: 'n14', track: 'network', stage: 'n1', minutes: 20,
    title: pair('HTTP, HTTPS & TLS certificates', 'HTTP、HTTPS 与 TLS 证书'),
    summary: pair('Separate a name resolution failure, a connection failure and a web response.', '区分域名解析失败、连接失败与网站返回的状态。'),
    objective: pair('Place a browser error in the right stage and explain what a certificate verifies.', '判断浏览器报错发生在哪个阶段，并解释证书验证了什么。'),
    sections: [
      { heading: pair('From name to response', '从域名到响应'), body: pair('For a new HTTP/1.1 or HTTP/2 connection over HTTPS, the client typically resolves a name, connects over TCP, negotiates TLS and sends an HTTP request. Reused connections can skip setup. HTTP/3 uses QUIC over UDP with TLS integrated into QUIC.', '新建基于 HTTPS 的 HTTP/1.1 或 HTTP/2 连接时，客户端通常先解析域名，再建立 TCP 连接、协商 TLS 并发出 HTTP 请求。复用连接时可跳过建连。HTTP/3 使用基于 UDP 的 QUIC，TLS 集成在 QUIC 中。') },
      { heading: pair('Check the server identity', '检查服务端身份'), body: pair('The client checks whether the server certificate matches the requested hostname, is within its validity period and leads to a trusted issuer. A name mismatch, an incomplete chain or an incorrect client clock can affect certificate validation.', '客户端检查服务端证书是否匹配访问的主机名、是否在有效期内，以及能否沿证书链验证到可信签发机构。名称不匹配、证书链不完整或客户端时钟错误，都可能影响验证。') },
      { heading: pair('An HTTP status is application evidence', 'HTTP 状态码是应用层证据'), body: pair('A 404 shows that an HTTP component answered but could not find the requested resource. A 503 indicates a service is currently unavailable. Identify who returned the response before deciding whether to check a web server, reverse proxy or backend.', '404 表示已有 HTTP 组件响应，但没找到请求的资源。503 表示服务当前不可用。先确认是哪一层返回响应，再决定排查 Web 服务器、反向代理还是后端。') },
    ],
    takeaway: pair('Report whether the failure happened at DNS, connection setup, TLS validation or HTTP.', '交接故障时，说明问题出在 DNS、连接建立、TLS 验证还是 HTTP 响应。'),
    resource: 'tls',
    lab: {
      title: pair('Read an HTTPS request from the terminal', '在终端观察一次 HTTPS 请求'),
      environment: pair('A terminal with curl and access to the example.com demonstration site. On Windows, use curl.exe.', '使用带 curl 的终端访问示例站点 example.com。Windows 可使用 curl.exe。'),
      steps: [
        pair('Run the command and find the host or address used for the connection.', '运行命令，找到连接使用的主机名或地址。'),
        pair('Locate the TLS negotiation and the HTTP response status. Look at your browser’s certificate viewer to check the name and validity dates.', '定位 TLS 协商和 HTTP 响应状态。再在浏览器的证书查看器中核对名称和有效期。'),
        pair('Write one sentence describing the last stage you verified.', '用一句话记录你已确认的最后一个阶段。'),
      ],
      command: 'curl -vI --max-time 10 https://example.com',
      verify: pair('Point to a connection message, TLS information and an HTTP status in the output.', '从输出中分别指出连接信息、TLS 信息和 HTTP 状态。'),
    },
    quiz: {
      question: pair('Which layer gave you a 404 status over HTTPS?', '通过 HTTPS 收到 404 时，哪一层返回了这个状态？'),
      options: [pair('Ethernet', '以太网'), pair('DNS', 'DNS'), pair('HTTP', 'HTTP')],
      correct: 2,
      explanation: pair('404 is an HTTP response. Investigate the requested URL and the component that answered.', '404 属于 HTTP 响应。应核对请求地址，并找出返回这个响应的组件。'),
    },
  },
  {
    id: 's09', after: 's01', track: 'system', stage: 's1', minutes: 20,
    title: pair('Linux services, sockets & logs', 'Linux 服务、监听端口与日志'),
    summary: pair('Turn “the service is down” into a sequence of observable checks.', '把“服务挂了”拆成一组可以观察和验证的检查。'),
    objective: pair('Check a systemd unit, read its recent logs, and distinguish a listening socket from a successful request.', '检查 systemd 单元和近期日志，区分端口监听和请求成功。'),
    sections: [
      { heading: pair('Start with the unit state', '先看服务单元状态'), body: pair('On a systemd host, systemctl status reports the unit’s state and recent messages. Active means the unit is active according to its type. For a web service, confirm the socket and send a request as separate checks.', '在使用 systemd 的主机上，systemctl status 会显示单元状态和近期消息。Active 表示单元按其类型处于活动状态。对 Web 服务还要单独确认端口监听和请求响应。') },
      { heading: pair('Read from the same time window', '按同一时间窗口读日志'), body: pair('Use journalctl -u to select a unit, then restrict the time window to the incident. Record the first relevant error. Check which addresses and ports the service listens on with ss. A service bound only to 127.0.0.1 can respond locally while remote clients cannot reach that socket.', '用 journalctl -u 选定单元，再把时间范围缩到故障窗口。记录首条相关错误，并用 ss 核对监听地址和端口。只绑定到 127.0.0.1 的服务可在本机响应，但远程客户端无法访问这个监听端口。') },
    ],
    takeaway: pair('Write down the unit state, listener address and request result as three separate observations.', '交接时分别记录单元状态、监听地址与请求结果。'),
    resource: 'ubuntu',
    lab: {
      title: pair('Check a known web service', '核对一项已知 Web 服务'),
      environment: pair('An isolated systemd-based Ubuntu VM with nginx already installed and running on port 80.', '仅需一台隔离的 Ubuntu 虚拟机，使用 systemd 并已在端口 80 运行 nginx。'),
      steps: [
        pair('Find the nginx unit’s active state and the most recent log messages. Some logs require authorized credentials.', '查看 nginx 单元的活动状态和最近日志。有些日志需要具备相应权限。'),
        pair('Find the listening port and decide whether it is bound to loopback or a non-loopback address.', '找到监听端口，判断它绑定在回环地址还是非回环地址。'),
        pair('Use a local HTTP request to record the response status independently of the unit state.', '发起本机 HTTP 请求，独立记录响应状态。'),
      ],
      command: "systemctl status nginx --no-pager\njournalctl -u nginx --since '15 minutes ago' --no-pager\nss -lnt\ncurl -I --max-time 5 http://127.0.0.1",
      verify: pair('Record the unit name, listener and HTTP status with a timestamp.', '记录单元名称、监听地址和 HTTP 状态，并附时间。'),
    },
    quiz: {
      question: pair('A service listens exclusively on 127.0.0.1:80. Which request can reach that socket directly?', '服务只监听 127.0.0.1:80。哪项请求能直接到达这个监听端口？'),
      options: [pair('A request from a different host to the VM’s LAN address', '另一台主机访问虚拟机的局域网地址'), pair('A local request to 127.0.0.1:80', '本机访问 127.0.0.1:80'), pair('Any request to the VM’s public name', '任何访问虚拟机公网域名的请求')],
      correct: 1,
      explanation: pair('127.0.0.1 is a loopback address. It belongs to the local host only.', '127.0.0.1 是回环地址，只在本机内可达。'),
    },
  },
  {
    id: 's10', after: 's02', track: 'system', stage: 's1', minutes: 20,
    title: pair('Windows network troubleshooting with PowerShell', '用 PowerShell 排查 Windows 网络'),
    summary: pair('Check IP settings, resolve a name and test a TCP port, then share the evidence.', '检查 IP 设置、解析域名、测试 TCP 端口，再整理证据交接。'),
    objective: pair('Distinguish a DNS problem from a TCP reachability problem using PowerShell.', '用 PowerShell 区分 DNS 解析问题与 TCP 端口连通问题。'),
    sections: [
      { heading: pair('Check the active interface', '检查正在使用的网卡'), body: pair('Get-NetIPConfiguration shows IP addresses, gateways and DNS servers. When Ethernet, Wi-Fi and VPN are active together, note the interface and source address selected for your connection before interpreting results.', 'Get-NetIPConfiguration 显示 IP 地址、网关和 DNS 服务器。有线、无线和 VPN 同时启用时，先记录这次连接选用的接口和源地址，再解读结果。') },
      { heading: pair('Separate name resolution from port reachability', '分开验证解析与端口连通'), body: pair('Resolve-DnsName queries a name. Test-NetConnection with -Port makes a TCP connectivity test. Check TcpTestSucceeded and RemoteAddress. If the name does not resolve but an approved test IP works on the same port, collect the DNS error, resolver and timestamp for follow-up.', 'Resolve-DnsName 查询域名。带 -Port 的 Test-NetConnection 测试 TCP 连通性。查看 TcpTestSucceeded 和 RemoteAddress。若名称解析失败，但获准测试的目标 IP 在同一端口可达，记录 DNS 报错、解析服务器和时间以便跟进。') },
    ],
    takeaway: pair('A successful TCP test supports reachability. Verify the actual service separately with an application request.', 'TCP 测试成功说明端口可达。再发起应用请求验证实际服务。'),
    resource: 'microsoft',
    lab: {
      title: pair('Compare DNS and TCP results', '对照 DNS 和 TCP 测试结果'),
      environment: pair('Use your Windows lab VM and the example.com demonstration site.', '使用自己的 Windows 实验虚拟机与 example.com 示例站点。'),
      steps: [
        pair('Record the active interface, default gateway and DNS server.', '记录正在使用的网卡、默认网关和 DNS 服务器。'),
        pair('Resolve example.com and test TCP port 443. Note the actual remote address in the TCP test.', '解析 example.com 并测试 TCP 443 端口。记录 TCP 测试实际使用的远端地址。'),
        pair('For practice, query a name under .invalid and compare the result with the successful lookup.', '尝试查询 .invalid 域下的名称，对比成功解析时的结果。'),
      ],
      command: 'Get-NetIPConfiguration\nResolve-DnsName example.com\nTest-NetConnection example.com -Port 443\nResolve-DnsName site.invalid',
      verify: pair('Report the resolver, resolved address, tested port and TCP result. Distinguish the intentional name failure.', '报告解析服务器、解析地址、所测端口以及 TCP 结果，并指出故意制造的解析失败。'),
    },
    quiz: {
      question: pair('Which result directly shows whether a TCP test to port 443 succeeded?', '哪个结果直接说明 TCP 443 端口测试是否成功？'),
      options: [pair('The DNS A record', 'DNS A 记录'), pair('The interface name', '网卡名称'), pair('TcpTestSucceeded', 'TcpTestSucceeded')],
      correct: 2,
      explanation: pair('TcpTestSucceeded is the result of the port test. A DNS answer only provides name resolution evidence.', 'TcpTestSucceeded 是端口测试结果，DNS 应答只提供名称解析的证据。'),
    },
  },
  {
    id: 'n17', after: 'n16', track: 'network', stage: 'n1', minutes: 12,
    title: pair('Offline cameras, Ethernet & PoE', '摄像头离线、网线与 PoE 供电'),
    summary: pair('Separate three questions about an offline camera. Does it have power, a working Ethernet link and a path to the recorder?', '把摄像头离线拆成三个问题：有没有电、以太网链路有没有建立、录像机能不能收到视频？'),
    objective: pair('Use power and link evidence to choose the next test before replacing a cable.', '看懂供电和链路证据，再决定下一步该测试哪一项。'),
    sections: [
      { heading: pair('One cable does two jobs', '一根线承担两份工作'), body: pair('Power over Ethernet (PoE) lets a compatible switch send power to a camera over Ethernet cabling. Power allocation, the negotiated data link and video delivery are three separate observations. A camera marked offline by its recorder tells you only that the video service is missing.', '以太网供电（PoE）让兼容的交换机通过网线给摄像头供电。端口获配电力、建立数据链路、传回视频，是三个可以分别观察的环节。录像机显示离线，只能说明它现在收不到视频。') },
      { heading: pair('Read the port and the power budget', '同时看端口与整机功率预算'), body: pair('First identify which port belongs to which camera. On a supported Catalyst switch, show power inline reports PoE state and allocation. A denied request plus insufficient available power points to the power budget. If power is granted, check the port link, error counters and video stream next.', '先确认每台摄像头对应哪个端口。支持 PoE 的 Catalyst 交换机上，show power inline 可以查看供电状态和分配情况。若出现供电请求被拒且剩余功率不足，先查功率预算。如果已供电，就继续检查链路、错误计数和视频流。') },
      { heading: pair('Change one thing per test', '每次只改变一项'), body: pair('In a spare lab setup, keep the camera and port fixed and compare two patch leads. Then keep the known-good lead and camera fixed to compare ports with the same settings. A higher cable category alone cannot confirm wiring quality, negotiated speed or available switch power.', '在备用实验设备上，先固定摄像头和端口，只更换跳线。再固定已知正常的跳线和摄像头，对比配置相同的端口。网线类别更高，也不能单凭标签判断端接质量、实际协商速率或交换机剩余功率。') },
    ],
    resource: 'poe',
    takeaway: pair('Ticket wording: “The recorder lost video. Port B was denied power. We are checking the switch allocation before replacing the cable.”', '工单表达：“录像机收不到视频，B 端口的供电请求被拒。我们正在核对交换机功率分配，再决定是否更换网线。”'),
    lab: { title: pair('Read a power allocation snapshot', '读一张供电分配记录'), environment: pair('Use the fictional readings below. No hardware is needed.', '直接使用以下虚构读数，无需设备。'),
      steps: [pair('Subtract allocated watts from the switch budget.', '用整机预算减去已分配功率。'), pair('Compare the result with the new request. Identify which camera has evidence of a power problem.', '把剩余功率与新请求对照，指出哪台摄像头有供电问题的证据。'), pair('Write one sentence separating the observed state of camera A from camera B.', '用一句话分别说明 A、B 两台摄像头的已知状态。')],
      command: 'Switch budget / 总预算     60 W\nAllocated / 已分配         52 W\nCamera A / 摄像头 A       powered · link up / 已供电，链路正常\nCamera B / 摄像头 B       requests 15 W · denied / 申请 15 W，被拒绝',
      verify: pair('8 W remain, below B’s 15 W request. A has power and link. Its video state still requires a recorder check.', '还剩 8 W，低于 B 请求的 15 W。A 有电且链路正常，视频是否正常还要在录像机上核实。') },
    quiz: { question: pair('A second cable gives the same offline alert. Which evidence best tests the power-budget hypothesis?', '换线后仍然离线。哪项证据最能检验“供电预算不足”这个猜想？'), options: [pair('Cable category printed on the jacket', '网线外皮上的类别'), pair('Remaining watts, requested watts and port PoE state', '剩余功率、请求功率和端口 PoE 状态'), pair('The camera’s name', '摄像头名称')], correct: 1, explanation: pair('These readings test whether the switch can grant that port the power requested.', '这三项读数可以直接判断交换机能否给该端口分配所需功率。') },
  },
  {
    id: 'n18', after: 'n09', track: 'network', stage: 'n3', minutes: 16,
    title: pair('Read an SD-WAN control-session timeline', '读懂 SD-WAN 控制连接日志'),
    summary: pair('Turn up and down messages into a timeline and a short English incident update.', '把 up 和 down 日志整理成时间线，再写成一句英文事件通报。'),
    objective: pair('Match events for the same peer and transport, calculate an observed outage and state which impact remains unknown.', '按对端和传输链路匹配事件，算出观察到的中断时长，并指出尚待核实的业务影响。'),
    sections: [
      { heading: pair('Name the connection that changed', '先找出变化的是哪条连接'), body: pair('An SD-WAN edge can maintain sessions to several peers. Cisco SD-WAN Manager (formerly vManage) handles management. SD-WAN Controller (formerly vSmart) exchanges control information such as routes. A message naming the Manager describes that peer session. It does not measure a user application.', '同一台边缘路由器可以与多个对端建立会话。Cisco SD-WAN Manager（旧称 vManage）负责管理；SD-WAN Controller（旧称 vSmart）交换路由等控制信息。日志点名 Manager，就先把结论限定为这条会话的状态。应用体验需要另外测量。') },
      { heading: pair('Pair a down with the matching up', '把同一条连接的中断和恢复配对'), body: pair('Keep the device, peer, transport and time zone with each event. Sort by time and match the next up for the same connection. If a log ends at down, record the last known state and check a newer sample. Another peer coming up does not close the interval.', '每行保留设备、对端、传输链路和时区。按时间排序，寻找同一条连接的下一次 up。如果日志在 down 处结束，就记录最后所见状态并索取更新样本。其他对端恢复不能作为这次中断的结束时间。') },
      { heading: pair('Check forwarding separately', '单独验证业务转发'), body: pair('A session table tells you the state at observation time. Session history helps reconstruct the earlier change. A tunnel-health reading and a timestamped application request from the affected branch provide different evidence. State the scope and time of each check in the ticket.', '当前会话表反映查看时的状态，历史记录用来还原先前的变化。隧道健康状态和受影响分支发起的带时间戳应用请求，是另外两份证据。写工单时把每项检查的范围和时间写清楚。') },
    ],
    resource: 'sdwan',
    takeaway: pair('Ticket wording: “The Manager session on WAN-A was down for 90 seconds. Application impact during that interval is unconfirmed.”', '工单表达：“WAN-A 上的 Manager 会话中断 90 秒，该时间段内的应用影响尚待核实。”'),
    lab: { title: pair('Reconstruct one session', '还原一条会话的时间线'), environment: pair('Read this fictional event summary. All times use UTC.', '阅读以下虚构事件摘要。所有时间均为 UTC。'),
      steps: [pair('Group events by peer and WAN link.', '按对端和 WAN 链路分组。'), pair('Find the two entries for Manager on WAN-A and calculate the interval.', '找出 WAN-A 上 Manager 的两条记录，计算间隔。'), pair('Write a status update and identify one missing piece of evidence.', '写一句状态通报，并指出还需要补充哪项证据。')],
      command: '09:00:00  Manager     WAN-A  DOWN / 中断\n09:00:20  Controller  WAN-B  UP   / 已连接\n09:01:30  Manager     WAN-A  UP   / 已连接',
      verify: pair('The matching recovery is at 09:01:30 UTC. The interval is 90 seconds. Request branch application measurements for that interval to assess user impact.', '对应的恢复发生在 UTC 09:01:30，间隔为 90 秒。要判断用户影响，还需核对分支应用在该时段的测量数据。') },
    quiz: { question: pair('The last Manager entry is down. A Controller entry then says up. What can you report?', 'Manager 最后一条记录是 down，之后 Controller 显示 up。可以报告什么？'), options: [pair('Every user lost service', '所有用户都断线'), pair('The Manager recovered', 'Manager 已恢复'), pair('The Controller came up. Manager recovery still needs evidence.', 'Controller 已连接，Manager 是否恢复仍需证据。')], correct: 2, explanation: pair('The two entries describe different peers. Look for the matching peer and transport.', '两行描述的是不同对端。要寻找同一对端、同一传输链路的记录。') },
  },
  {
    id: 'n19', after: 'n11', track: 'network', stage: 'n4', minutes: 14,
    title: pair('Preflight an upgrade with limited storage', '升级空间不足时的升级前检查'),
    summary: pair('Read image roles and free space before deciding whether an upgrade can proceed.', '读懂镜像角色与可用空间，判断这次升级的条件是否具备。'),
    objective: pair('Explain active and default image labels, calculate a capacity shortfall and prepare a support handoff.', '解释 active 与 default 标签，计算空间缺口，并整理可交给支持团队的资料。'),
    sections: [
      { heading: pair('Read the labels on each row', '先看清每一行的标签'), body: pair('In a Catalyst SD-WAN image inventory, active identifies the running version and default identifies the designated default version. One version can carry both labels. Count distinct versions before assuming an older image is available for cleanup.', '在 Catalyst SD-WAN 镜像清单中，active 标明当前运行的版本，default 标明被指定为默认的版本。同一版本可以同时带有两个标签。先数清不同版本，才能判断设备上是否真有旧镜像。') },
      { heading: pair('Check the actual staging requirement', '核对暂存位置真正需要的空间'), body: pair('Record the model, release, target version and filesystem used by this upgrade method. Compare free space there with the documented requirement for that platform and release. Staging or extraction may need more space than the download file alone.', '记录设备型号、当前版本、目标版本以及该升级方式使用的文件系统。把这个位置的可用空间与对应平台和版本的官方要求比较。暂存、解包所需空间可能超过下载文件的大小。') },
      { heading: pair('Make the next decision explicit', '写清下一步的判断依据'), body: pair('When the only image is active and default, the inventory has identified no obsolete image. Save the inventory, space report and exact error with their timestamps. Check the platform-specific upgrade and recovery procedure with the device owner or vendor before scheduling a change.', '如果唯一镜像同时是 active 和 default，那么这份清单里没有识别出可清理的旧镜像。保存带时间的镜像清单、空间报告和完整报错。与设备负责人或厂商确认适用的升级与恢复流程，再安排变更。') },
    ],
    resource: 'upgrade',
    takeaway: pair('Ticket wording: “The only listed image is active and default. Staging is short by 0.6 GiB. Please confirm the supported upgrade path for this model.”', '工单表达：“清单中唯一的镜像为当前及默认版本。暂存空间还差 0.6 GiB，请确认该型号支持的升级路径。”'),
    lab: { title: pair('Calculate the staging gap', '计算暂存空间缺口'), environment: pair('Fictional preflight report. The space requirement is specific to this exercise.', '以下为虚构的升级前检查报告。空间要求仅用于本题。'),
      steps: [pair('Count the distinct installed versions.', '数出已安装的不同版本数。'), pair('Subtract free space from required space, using the same units.', '使用相同单位，用所需空间减去可用空间。'), pair('State whether the capacity check passes and what to include when escalating.', '写明容量检查是否通过，以及升级支持工单要附上哪些资料。')],
      command: 'Image / 镜像   A   ACTIVE=yes   DEFAULT=yes\nOther images / 其他镜像   0\nStaging free / 暂存可用   1.4 GiB\nRequired for this example / 本题所需   2.0 GiB',
      verify: pair('One version is installed. 2.0 − 1.4 = 0.6 GiB short. Hold the upgrade and attach the inventory, storage report, platform and target version.', '仅安装了一个版本，空间缺口为 2.0 − 1.4 = 0.6 GiB。暂缓升级，附上镜像清单、空间报告、平台和目标版本。') },
    quiz: { question: pair('One inventory row is marked both active and default. How many obsolete images does that establish?', '清单仅有一行，同时标记 active 与 default。这能确认有几个旧镜像？'), options: [pair('None', '零个'), pair('One', '一个'), pair('Two', '两个')], correct: 0, explanation: pair('The labels describe two roles of the same version. They do not identify another installed image.', '两个标签描述同一个版本的两种角色，不能据此推断另有旧镜像。') },
  },
  {
    id: 's12', after: 's01', track: 'system', stage: 's1', minutes: 10,
    title: pair('Device clocks, time zones & NTP', '设备时钟、时区与 NTP 校时'),
    summary: pair('Compare a router timestamp with a server log and decide whether the clocks agree.', '把路由器时间与服务器日志对齐，判断两台设备的时钟是否一致。'),
    objective: pair('Convert a timestamp to UTC, distinguish the time zone from synchronisation, and report observed clock offset.', '把时间戳换算成 UTC，区分时区与同步状态，并写出观察到的时钟偏差。'),
    sections: [
      { heading: pair('One moment can have two labels', '同一时刻可以有两种时间写法'), body: pair('Singapore time (SGT) is UTC+8. To compare 16:05 SGT with a UTC log, subtract eight hours to get 08:05 UTC. Keep the date: 00:05 SGT on 12 June is 16:05 UTC on 11 June. A time zone changes how a moment is displayed.', '新加坡时间（SGT）为 UTC+8。要把 16:05 SGT 与 UTC 日志对照，就减八小时，得到 08:05 UTC。还要保留日期：6 月 12 日 00:05 SGT 对应 6 月 11 日 16:05 UTC。时区决定同一时刻如何显示。') },
      { heading: pair('Check the time source', '再查时间是怎么来的'), body: pair('Network Time Protocol (NTP) keeps a device clock aligned with a time source. On supported Cisco IOS XE devices, show clock detail displays the local clock and its source. Use show ntp status to check synchronisation. A manually entered clock value gives a point-in-time setting. It cannot establish ongoing synchronisation.', '网络时间协议（NTP）让设备时钟持续跟随时间源。在支持的 Cisco IOS XE 设备上，show clock detail 查看本地时间和来源，show ntp status 核实同步状态。手工设置时间只调整那一刻的读数，不能证明此后一直同步。') },
      { heading: pair('Compare the same event', '只比较同一个事件'), body: pair('Match an event identifier or compare clocks observed at the same instant. Keep original timestamps and add a UTC column. A collector’s receive time can include delivery delay, so use it carefully when estimating clock error.', '先匹配同一事件编号，或比较同一瞬间读取的时钟。保留原始时间，另列 UTC 时间。日志收集器的接收时间还可能包含传输延迟，据此估算时钟偏差时要区分两者。') },
    ],
    resource: 'ntp',
    takeaway: pair('Ticket wording: “After conversion to UTC, the device is 45 seconds ahead of the reference. NTP reports unsynchronised.”', '工单表达：“换算到 UTC 后，设备比参考时钟快 45 秒。NTP 状态显示未同步。”'),
    lab: { title: pair('Reconcile two clock readings', '对齐两份时钟读数'), environment: pair('Fictional readings taken at the same instant.', '以下虚构读数采集于同一瞬间。'),
      steps: [pair('Convert the router reading to UTC and keep the date.', '把路由器读数换算为 UTC，保留日期。'), pair('Compare it with the reference and calculate the offset direction.', '与参考时钟比较，计算偏差并说明快慢。'), pair('Record the reported NTP state along with the offset.', '把 NTP 状态和偏差一起记录下来。')],
      command: 'Router / 路由器   12 Jun 00:00:45 SGT\nReference / 参考   11 Jun 16:00:00 UTC\nNTP status / 同步状态   unsynchronised / 未同步',
      verify: pair('Router time is 11 June 16:00:45 UTC, 45 seconds ahead. The date change is due to the zone. The 45-second difference is the measured offset.', '路由器读数为 6 月 11 日 16:00:45 UTC，快 45 秒。日期变化源于时区，剩余 45 秒才是测出的偏差。') },
    quiz: { question: pair('At the same instant, one clock reads 18:30 SGT and another reads 10:30 UTC on the same date. What do these readings establish?', '同一瞬间，一台显示当天 18:30 SGT，另一台显示 10:30 UTC。这能说明什么？'), options: [pair('The first clock is eight hours fast', '第一台快八小时'), pair('The displayed times agree to the minute. The NTP state is still unknown.', '两者显示的时间精确到分钟一致，NTP 状态仍需另查。'), pair('Both devices use the same NTP server', '两台使用同一个 NTP 服务器')], correct: 1, explanation: pair('Converting 18:30 SGT gives 10:30 UTC. Matching displayed times alone do not reveal the clock source.', '18:30 SGT 就是 10:30 UTC。显示时间一致，仍不能从中看出使用的时间源。') },
  },
];

function translate(item: Foundation, lang: keyof Bilingual): Translation {
  return {
    summary: item.summary[lang],
    objective: item.objective[lang],
    sections: item.sections.map(({ heading, body }) => ({ heading: heading[lang], body: body[lang] })),
    takeaway: item.takeaway[lang],
    lab: {
      title: item.lab.title[lang],
      environment: item.lab.environment[lang],
      steps: item.lab.steps.map(step => step[lang]),
      verify: item.lab.verify[lang],
    },
    quiz: {
      question: item.quiz.question[lang],
      options: item.quiz.options.map(option => option[lang]),
      explanation: item.quiz.explanation[lang],
    },
  };
}

export const foundationEnglish = Object.fromEntries(foundations.map(item => [item.id, translate(item, 'en')]));

export function addFoundations(existing: Lesson[]) {
  const result = [...existing];
  for (const item of foundations) {
    const zh = translate(item, 'zh');
    const resource = resources[item.resource];
    const lesson: Lesson = {
      ...zh,
      id: item.id,
      track: item.track,
      stage: item.stage,
      minutes: item.minutes,
      title: item.title.zh,
      en: item.title.en,
      source: { title: resource.title.en, url: resource.url },
      lab: { ...zh.lab, command: item.lab.command },
      quiz: { ...zh.quiz, correct: item.quiz.correct },
    };
    const position = result.findIndex(entry => entry.id === item.after);
    result.splice(position + 1, 0, lesson);
  }
  return result;
}
