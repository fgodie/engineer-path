export type Pair = { en: string; zh: string };
export type PacketTracerLab = {
  id: string;
  lessonId: string;
  minutes: number;
  title: Pair;
  question: Pair;
  principle: Pair;
  devices: Pair;
  links: { from: string; to: string }[];
  addresses: { device: string; ip: string; mask: string; gateway: string }[];
  steps: { title: Pair; detail: Pair }[];
  configs: { device: string; code: string }[];
  observe: Pair[];
  success: Pair[];
  troubleshoot: Pair[];
  challenge: Pair;
};

export const packetTracerLabs: PacketTracerLab[] = [
  {
    id: 'lan', lessonId: 'n01', minutes: 20,
    title: { en: '01 · Your first LAN', zh: '01 · 第一条局域网链路' },
    question: { en: 'How does one PC find another on the same subnet?', zh: '同一网段的两台电脑如何找到彼此？' },
    principle: { en: 'The sender uses ARP to learn the destination MAC address. The switch forwards the Ethernet frame within the same VLAN.', zh: '发送方先用 ARP 获取目标 MAC 地址，交换机再在同一 VLAN 内转发以太网帧。' },
    devices: { en: '2 × PC-PT, 1 × 2960 switch, 2 × copper straight-through cable', zh: '2 台 PC-PT、1 台 2960 交换机、2 根直通铜缆' },
    links: [{ from: 'PC-A FastEthernet0', to: 'S1 FastEthernet0/1' }, { from: 'PC-B FastEthernet0', to: 'S1 FastEthernet0/2' }],
    addresses: [
      { device: 'PC-A', ip: '192.168.10.10', mask: '255.255.255.0', gateway: '—' },
      { device: 'PC-B', ip: '192.168.10.11', mask: '255.255.255.0', gateway: '—' },
    ],
    steps: [
      { title: { en: 'Place and connect', zh: '放置并连线' }, detail: { en: 'In Logical view, place the two PCs and one switch. Connect the exact ports shown below. Wait until the link indicators turn green.', zh: '在 Logical 视图放置两台电脑和交换机，按下方端口表连线，等待链路指示灯变绿。' } },
      { title: { en: 'Set the PC addresses', zh: '配置电脑地址' }, detail: { en: 'On each PC, open Desktop → IP Configuration and enter its IP address and mask. Leave Default Gateway empty for this local-only lab.', zh: '在每台电脑的 Desktop → IP Configuration 填入地址和掩码。本实验只在本地网段通信，默认网关留空。' } },
      { title: { en: 'Watch, then ping', zh: '先观察，再测试' }, detail: { en: 'Before the first ping, use Simulation as described below to see ARP. Then open PC-A Desktop → Command Prompt and run ping 192.168.10.11. Repeat if the first attempt times out.', zh: '第一次 ping 前先按下方说明在 Simulation 观察 ARP，再在 PC-A 的 Desktop → Command Prompt 执行 ping 192.168.10.11。若首次超时，再执行一次。' } },
    ],
    configs: [{ device: 'PC-A · Command Prompt', code: 'ping 192.168.10.11\narp -a' }],
    observe: [
      { en: 'Before the first ping, switch to Simulation, filter for ARP and ICMP, then send a Simple PDU from PC-A to PC-B. Use Capture/Forward to step through the events.', zh: '第一次 ping 前切到 Simulation，筛选 ARP 和 ICMP，再从 PC-A 向 PC-B 发送 Simple PDU，用 Capture/Forward 逐步观察。' },
      { en: 'The ARP request is a broadcast; the ARP reply and following ICMP traffic target a learned MAC address.', zh: 'ARP 请求是广播；ARP 响应以及后续 ICMP 流量会发往已学到的 MAC 地址。' },
    ],
    success: [{ en: 'PC-A receives ping replies from 192.168.10.11, and arp -a shows an entry for PC-B.', zh: 'PC-A 收到 192.168.10.11 的 ping 响应，arp -a 能看到 PC-B 的记录。' }],
    troubleshoot: [{ en: 'Check green links, the selected ports, both /24 masks, and that the two IP addresses are different.', zh: '检查链路是否变绿、连接端口、两个 /24 掩码，以及 IP 地址是否重复。' }],
    challenge: { en: 'Change PC-B to 192.168.20.11/24 without adding a router. Predict the ping result and explain why.', zh: '不添加路由器，把 PC-B 改为 192.168.20.11/24。先预测 ping 结果，再解释原因。' },
  },
  {
    id: 'routing', lessonId: 'n02', minutes: 30,
    title: { en: '02 · Cross a subnet', zh: '02 · 跨越两个子网' },
    question: { en: 'What changes when the destination is outside the local subnet?', zh: '目标不在本地网段时，数据会怎样走？' },
    principle: { en: 'The PC sends the frame to its default gateway. The router forwards the IP packet to the other connected subnet and builds a new Ethernet frame.', zh: '电脑把帧交给默认网关；路由器把 IP 包转发到另一个直连网段，并重新构造以太网帧。' },
    devices: { en: '2 × PC-PT, 2 × 2960 switch, 1 × 2911 router, 4 × copper straight-through cable', zh: '2 台 PC-PT、2 台 2960 交换机、1 台 2911 路由器、4 根直通铜缆' },
    links: [
      { from: 'PC-A FastEthernet0', to: 'S1 FastEthernet0/1' },
      { from: 'S1 GigabitEthernet0/1', to: 'R1 GigabitEthernet0/0' },
      { from: 'R1 GigabitEthernet0/1', to: 'S2 GigabitEthernet0/1' },
      { from: 'S2 FastEthernet0/1', to: 'PC-B FastEthernet0' },
    ],
    addresses: [
      { device: 'PC-A', ip: '192.168.10.10', mask: '255.255.255.0', gateway: '192.168.10.1' },
      { device: 'R1 G0/0', ip: '192.168.10.1', mask: '255.255.255.0', gateway: '—' },
      { device: 'R1 G0/1', ip: '192.168.20.1', mask: '255.255.255.0', gateway: '—' },
      { device: 'PC-B', ip: '192.168.20.10', mask: '255.255.255.0', gateway: '192.168.20.1' },
    ],
    steps: [
      { title: { en: 'Build two LANs', zh: '搭建两个局域网' }, detail: { en: 'Place the devices and connect the listed ports. The switches keep the two PC links separate until the router forwards between them.', zh: '放置设备并按端口表连线。两侧交换机各承载一个网段，由路由器负责跨网段转发。' } },
      { title: { en: 'Address PCs and router', zh: '配置电脑与路由器' }, detail: { en: 'Enter the PC addresses in Desktop → IP Configuration. On R1, open CLI and apply the commands below. Interface names assume a 2911 router.', zh: '在 Desktop → IP Configuration 配置电脑地址；打开 R1 的 CLI 执行下方命令。接口名称以 2911 路由器为准。' } },
      { title: { en: 'Test one hop at a time', zh: '逐跳测试' }, detail: { en: 'Start Simulation before the first ping to watch ARP and ICMP. Ping each PC’s own gateway first, then ping from PC-A to PC-B. On R1, verify both connected networks.', zh: '第一次 ping 前打开 Simulation 观察 ARP 和 ICMP。先从每台电脑 ping 自己的网关，再从 PC-A ping PC-B；最后在 R1 核对两个直连网段。' } },
    ],
    configs: [{ device: 'R1 · CLI', code: 'enable\nconfigure terminal\ninterface gigabitEthernet 0/0\nip address 192.168.10.1 255.255.255.0\nno shutdown\nexit\ninterface gigabitEthernet 0/1\nip address 192.168.20.1 255.255.255.0\nno shutdown\nend\nshow ip interface brief\nshow ip route' }, { device: 'PC-A · Command Prompt', code: 'ping 192.168.10.1\nping 192.168.20.10' }],
    observe: [{ en: 'In Simulation, filter ARP and ICMP. PC-A resolves the gateway MAC, not PC-B’s MAC. The destination IP stays PC-B’s address across R1; the Ethernet source and destination change on the second link.', zh: '在 Simulation 筛选 ARP 和 ICMP。PC-A 解析的是网关 MAC，而不是 PC-B 的 MAC。跨过 R1 后目标 IP 仍是 PC-B，下一段链路的以太网源/目的地址会变化。' }],
    success: [{ en: 'Both router interfaces are up/up, each PC reaches its gateway, and PC-A receives replies from 192.168.20.10.', zh: '路由器两个接口均为 up/up，每台电脑能到自己的网关，PC-A 能收到 192.168.20.10 的响应。' }],
    troubleshoot: [{ en: 'If a gateway ping fails, check cabling, no shutdown, the PC mask and gateway. If only cross-subnet ping fails, check both PC gateways and R1’s connected routes.', zh: '若网关 ping 不通，检查连线、no shutdown、电脑掩码与网关；若只在跨网段失败，检查两台电脑的网关和 R1 的直连路由。' }],
    challenge: { en: 'Remove PC-B’s default gateway. Which direction of the ping exchange breaks, and why?', zh: '删除 PC-B 的默认网关。ping 的哪一段会失败？为什么？' },
  },
  {
    id: 'vlan', lessonId: 'n04', minutes: 35,
    title: { en: '03 · Separate and reconnect VLANs', zh: '03 · 隔离并连接 VLAN' },
    question: { en: 'How can one switch separate users and still let them communicate through a router?', zh: '一台交换机如何隔离用户，又让他们经路由器通信？' },
    principle: { en: 'Access ports place PCs in different VLANs. An 802.1Q trunk carries both VLANs to router subinterfaces, which provide their gateways.', zh: 'Access 端口把电脑划入不同 VLAN；802.1Q Trunk 把两个 VLAN 送往路由器子接口，由子接口担任网关。' },
    devices: { en: '2 × PC-PT, 1 × 2960 switch, 1 × 2911 router, 3 × copper straight-through cable', zh: '2 台 PC-PT、1 台 2960 交换机、1 台 2911 路由器、3 根直通铜缆' },
    links: [
      { from: 'PC-A FastEthernet0', to: 'S1 FastEthernet0/1 · VLAN 10' },
      { from: 'PC-B FastEthernet0', to: 'S1 FastEthernet0/2 · VLAN 20' },
      { from: 'S1 GigabitEthernet0/1 · trunk', to: 'R1 GigabitEthernet0/0' },
    ],
    addresses: [
      { device: 'PC-A · VLAN 10', ip: '192.168.10.10', mask: '255.255.255.0', gateway: '192.168.10.1' },
      { device: 'R1 G0/0.10', ip: '192.168.10.1', mask: '255.255.255.0', gateway: '—' },
      { device: 'PC-B · VLAN 20', ip: '192.168.20.10', mask: '255.255.255.0', gateway: '192.168.20.1' },
      { device: 'R1 G0/0.20', ip: '192.168.20.1', mask: '255.255.255.0', gateway: '—' },
    ],
    steps: [
      { title: { en: 'Place devices and set PC IPs', zh: '放置设备并配置电脑 IP' }, detail: { en: 'Connect the listed ports and enter each PC’s IP, /24 mask and gateway under Desktop → IP Configuration.', zh: '按端口表连线，然后在 Desktop → IP Configuration 填写每台电脑的 IP、/24 掩码和网关。' } },
      { title: { en: 'Create VLANs and a trunk', zh: '建立 VLAN 和 Trunk' }, detail: { en: 'On S1, create VLAN 10 and 20, assign the access ports, and make G0/1 a trunk carrying both VLANs. Verify with show vlan brief and show interfaces trunk.', zh: '在 S1 建立 VLAN 10、20，分配接入口，并让 G0/1 作为承载两个 VLAN 的 Trunk。用 show vlan brief 和 show interfaces trunk 验证。' } },
      { title: { en: 'Add inter-VLAN routing', zh: '加入 VLAN 间路由' }, detail: { en: 'Before configuring R1, predict whether cross-VLAN ping can work. Then apply the router subinterface commands and test again.', zh: '配置 R1 前先预测跨 VLAN ping 是否能通，再执行路由器子接口命令并重新测试。' } },
    ],
    configs: [
      { device: 'S1 · CLI', code: 'enable\nconfigure terminal\nvlan 10\nname USERS\nexit\nvlan 20\nname LAB\nexit\ninterface fastEthernet 0/1\nswitchport mode access\nswitchport access vlan 10\nexit\ninterface fastEthernet 0/2\nswitchport mode access\nswitchport access vlan 20\nexit\ninterface gigabitEthernet 0/1\nswitchport mode trunk\nswitchport trunk allowed vlan 10,20\nend\nshow vlan brief\nshow interfaces trunk' },
      { device: 'R1 · CLI', code: 'enable\nconfigure terminal\ninterface gigabitEthernet 0/0\nno shutdown\nexit\ninterface gigabitEthernet 0/0.10\nencapsulation dot1Q 10\nip address 192.168.10.1 255.255.255.0\nexit\ninterface gigabitEthernet 0/0.20\nencapsulation dot1Q 20\nip address 192.168.20.1 255.255.255.0\nend\nshow ip interface brief' },
      { device: 'PC-A · Command Prompt', code: 'ping 192.168.10.1\nping 192.168.20.10' },
    ],
    observe: [{ en: 'In Simulation, compare the failed cross-VLAN attempt before routing with the successful attempt after routing. Inspect the gateway ARP and the tagged trunk path.', zh: '在 Simulation 比较路由配置前失败、配置后成功的跨 VLAN 流量，观察网关 ARP 和 Trunk 上的 VLAN 标记。' }],
    success: [{ en: 'S1 lists F0/1 in VLAN 10 and F0/2 in VLAN 20; G0/1 is a trunk allowing both VLANs; PC-A reaches PC-B through R1.', zh: 'S1 显示 F0/1 属于 VLAN 10、F0/2 属于 VLAN 20；G0/1 是允许两个 VLAN 的 Trunk；PC-A 能经 R1 访问 PC-B。' }],
    troubleshoot: [{ en: 'Check the access VLANs, allowed VLAN list, router dot1Q numbers, physical G0/0 state, and both PC gateways. A trunk alone does not route.', zh: '检查接入口 VLAN、Trunk 允许列表、路由器 dot1Q 编号、物理 G0/0 状态和两台电脑的网关。只有 Trunk 不会实现路由。' }],
    challenge: { en: 'Temporarily remove VLAN 20 from the trunk allowed list. Predict which pings still work, then verify and restore the list.', zh: '暂时从 Trunk 允许列表移除 VLAN 20。预测哪些 ping 仍可成功，验证后恢复配置。' },
  },
];

export const packetTracerLabForLesson = (lessonId: string) => packetTracerLabs.find((lab) => lab.lessonId === lessonId);
