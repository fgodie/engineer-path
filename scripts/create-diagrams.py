# -*- coding: utf-8 -*-
"""Generate original, editable bilingual teaching diagrams using SVG geometry."""
from pathlib import Path
from html import escape as e
OUT=Path(__file__).resolve().parent.parent/'public'/'diagrams'
OUT.mkdir(parents=True,exist_ok=True)
INK='#203e35'; MUTED='#567367'; GREEN='#087b5e'; BLUE='#236bb3'; AMBER='#9d5e13'
parts=[]
def text(x,y,t,size=17,fill=INK,anchor='start',weight=400):
 parts.append(f'<text x="{x}" y="{y}" fill="{fill}" font-size="{size}" text-anchor="{anchor}" font-weight="{weight}">{e(t)}</text>')
def rect(x,y,w,h,fill='#ffffff',stroke='#cbded4',rx=12):
 parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="1.5"/>')
def pair(x,y,en,zh,size=18,anchor='start',color=INK):
 text(x,y,en,size,color,anchor,600);text(x,y+25,zh,16,MUTED,anchor)
def box(x,y,w,h,en,zh,fill='#fff',stroke='#cbded4'):
 rect(x,y,w,h,fill,stroke);pair(x+w/2,y+h/2-6,en,zh,18,'middle')
def line(x1,y1,x2,y2,color=GREEN,dashed=False,arrow=True):
 dash=' stroke-dasharray="7 6"' if dashed else ''
 marker=' marker-end="url(#arrow)"' if arrow else ''
 parts.append(f'<path d="M{x1} {y1} L{x2} {y2}" fill="none" stroke="{color}" stroke-width="2.5"{dash}{marker}/>')
def start(name,title,zh,h,desc):
 global parts
 parts=[f'<svg xmlns="http://www.w3.org/2000/svg" width="920" height="{h}" viewBox="0 0 920 {h}" role="img" aria-labelledby="title desc">',f'<title id="title">{e(title)} / {e(zh)}</title><desc id="desc">{e(desc)}</desc>', '<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="#087b5e"/></marker></defs>', '<style>text{font-family:Arial,"PingFang SC","Microsoft YaHei",sans-serif}</style>',f'<rect width="920" height="{h}" fill="#f5faf7" rx="16"/>']
 text(32,38,'ENGINEER PATH  /  VISUAL GUIDE',13,GREEN,weight=600)
 pair(32,77,title,zh,25)
 return name

def save(name):
 parts.append('</svg>');(OUT/f'{name}.svg').write_text('\n'.join(parts),encoding='utf-8')

start('encapsulation','How data becomes a frame','数据如何封装成一帧',480,'Each layer adds information: application data, TCP header, IP header and Ethernet framing. 各层逐步添加信息：应用数据、TCP 头部、IP 头部与以太网帧结构。')
rows=[('Application','应用层',[(520,'Application data','应用数据','#e4f3e9')]),('Transport','传输层',[(145,'TCP header','TCP 头部','#dceaf9'),(375,'Data','数据','#e4f3e9')]),('Network','网络层',[(130,'IP header','IP 头部','#fff0d9'),(130,'TCP','TCP 头部','#dceaf9'),(260,'Data','数据','#e4f3e9')]),('Link','链路层',[(100,'Ethernet','帧头','#ece4f5'),(100,'IP','IP 头部','#fff0d9'),(100,'TCP','TCP 头部','#dceaf9'),(155,'Data','数据','#e4f3e9'),(65,'FCS','校验','#ece4f5')])]
for i,(en,zh,segments) in enumerate(rows):
 y=140+i*70;pair(34,y+20,en,zh,17);x=220
 for width,label,cn,color in segments:
  rect(x,y,width-3,57,color,rx=5);pair(x+(width-3)/2,y+23,label,cn,15,'middle');x+=width
 if i<3:line(785,y+22,785,y+77)
text(814,255,'SEND',14,GREEN,anchor='middle',weight=600);text(814,280,'发送',16,MUTED,anchor='middle')
text(32,449,'TCP over IPv4 over Ethernet example · Logical layout, not byte scale.',15,MUTED)
text(32,472,'以 TCP / IPv4 / Ethernet 为例；示意结构并非按字节比例绘制。',15,MUTED);save('encapsulation')

start('subnet','One /24, four /26 subnets','一个 /24，划分为四个 /26 子网',470,'192.168.10.0/24 splits into .0/26, .64/26, .128/26 and .192/26. Address .70 belongs to .64/26. 一个 /24 分成四个 /26，.70 属于 .64/26。')
box(32,132,856,62,'192.168.10.0/24 → 256 addresses','256 个地址，每个 /26 包含 64 个地址','#fff')
for i,n in enumerate([0,64,128,192]):
 x=32+i*218;fill='#dff2e7' if i==1 else '#fff'
 box(x,216,202,78,f'.{n}/26',f'.{n} – .{n+63}',fill,GREEN if i==1 else '#cbded4')
line(351,294,351,325)
rect(32,332,856,99,'#fff');pair(50,359,'192.168.10.64/26','子网掩码 / Mask: 255.255.255.192',17)
for x,en,zh in [(418,'.64','Network / 网络'),(583,'.65 – .126','Hosts / 主机'),(785,'.127','Broadcast / 广播')]:pair(x,359,en,zh,18,'middle')
text(32,455,'Example / 示例: 192.168.10.70 ∈ 192.168.10.64/26 · 62 usable hosts / 62 个可用主机地址',15,GREEN);save('subnet')

start('vlan','VLANs separate; routing connects','VLAN 做隔离，路由实现跨网段连接',540,'Hosts share a VLAN at Layer 2. Traffic between VLAN 10 and VLAN 20 goes through a Layer 3 gateway and permitted policy. 同 VLAN 二层通信，跨 VLAN 需三层网关和允许策略。')
for x,num,net,c in [(32,10,'192.168.10.0/24','#e5f2e9'),(486,20,'192.168.20.0/24','#e5effa')]:
 rect(x,135,402,215,c);pair(x+20,165,f'VLAN {num}',net,21)
 box(x+20,222,150,82,'Host A' if num==10 else 'Host C','终端 · .10')
 box(x+232,222,150,82,'Host B' if num==10 else 'Host D','终端 · .20')
 line(x+170,263,x+229,263)
line(233,350,233,400);line(687,350,687,400);line(233,400,330,400);line(687,400,590,400)
box(332,370,256,85,'Layer 3 gateway','三层网关 + 访问策略','#fff',GREEN)
text(32,480,'One physical switch can contain both VLANs. Inter-VLAN traffic requires routing.',16,INK)
text(32,507,'同一台物理交换机可承载两个 VLAN；跨 VLAN 通信需要路由并满足访问策略。',16,MUTED);save('vlan')

start('route-lookup','The most specific route wins','转发时优先选择最具体的匹配路由',476,'Destination 10.20.30.42 matches a default route, /16 and /24; /24 wins by longest-prefix matching. 目标同时匹配默认路由、/16 和 /24，按最长前缀选择 /24。')
box(32,135,290,90,'Destination / 目的地址','10.20.30.42','#e6f3ea');line(322,180,375,180)
headers=[('Prefix / 前缀',400),('Next hop / 下一跳',610),('Match / 匹配',790)]
for t,x in headers:text(x,148,t,16,weight=600)
for i,(prefix,hop,status) in enumerate([('0.0.0.0/0','192.0.2.1','Yes / 是'),('10.20.0.0/16','192.0.2.2','Yes / 是'),('10.20.30.0/24','192.0.2.3','BEST / 最优')]):
 y=167+i*65;rect(382,y,506,54,'#dff2e7' if i==2 else '#fff',GREEN if i==2 else '#cbded4',6)
 for t,x in [(prefix,400),(hop,610),(status,790)]:text(x,y+33,t,16,GREEN if i==2 else INK,weight=600 if i==2 else 400)
box(32,365,856,70,'/24 is longer than /16 and /0','/24 比 /16 和 /0 更具体，因此本次查表选择下一跳 192.0.2.3。','#fff')
text(32,459,'Forwarding lookup example; route-source preference is a separate decision. / 路由来源优选是另一项决策。',14,MUTED);save('route-lookup')

start('evpn','Underlay and overlay','底层网络与覆盖网络',560,'Spine connects two leaf VTEPs through routed IP links. A logical VXLAN tunnel connects tenant hosts in VNI 10010. Spine 通过 IP 链路连接两个 Leaf VTEP，逻辑 VXLAN 隧道承载同一 VNI 的租户流量。')
box(332,132,256,70,'Spine / Underlay IP','Spine · 底层 IP 转发','#fff')
line(355,202,242,273,arrow=False);line(565,202,678,273,arrow=False)
box(117,276,250,82,'Leaf 1 / VTEP 1','VTEP IP: 10.0.0.1','#e5f2e9')
box(553,276,250,82,'Leaf 2 / VTEP 2','VTEP IP: 10.0.0.2','#e5f2e9')
line(369,318,550,318,dashed=True);pair(460,246,'VXLAN overlay','逻辑隧道 · VNI 10010',17,'middle')
line(242,358,242,392,arrow=False);line(678,358,678,392,arrow=False)
box(117,395,250,73,'Tenant host A','租户主机 A · VLAN 10','#e5effa');box(553,395,250,73,'Tenant host B','租户主机 B · VLAN 10','#e5effa')
text(32,505,'Solid lines: physical IP links. Dashed line: logical VXLAN tunnel, not a direct cable.',16,INK)
text(32,530,'实线：物理 IP 链路。虚线：逻辑 VXLAN 隧道，并非直连网线。EVPN 分发可达信息。',16,MUTED);save('evpn')

start('ad-dns','Find the domain controller, then authenticate','先发现域控，再完成身份认证',535,'The client queries DNS SRV records to find a domain controller, then authenticates to the domain controller. File access still requires separate authorization. 客户端通过 DNS SRV 发现域控，再向域控认证；文件访问仍需单独授权。')
box(32,197,213,90,'Domain client','域客户端','#e5f2e9');box(660,135,228,86,'DNS server','DNS 服务器','#e5effa');box(660,312,228,86,'Domain controller','域控制器','#e5effa')
line(246,216,655,172);pair(448,147,'1. Query SRV records','查询服务记录',17,'middle')
line(660,211,248,258);pair(448,268,'2. Return DC location','返回域控位置',17,'middle')
line(246,283,655,355);pair(448,346,'3. Authenticate','身份认证',17,'middle')
rect(32,425,856,85,'#fff');pair(52,454,'Authentication ≠ authorization','身份认证 ≠ 资源授权；访问文件仍需检查共享权限与 NTFS 权限。',20)
save('ad-dns')

start('virtualization','Virtual machines share one host','虚拟机共享同一台物理主机',535,'Three independent virtual machines run on one hypervisor and share physical CPU, memory, storage and network resources. 三台虚拟机运行在同一虚拟化层之上，共享物理资源，也共享主机故障域。')
for i,(en,zh) in enumerate([('Windows VM','Windows 虚拟机'),('Linux VM','Linux 虚拟机'),('Lab VM','实验虚拟机')]):
 x=32+i*292;box(x,145,270,93,en,zh,'#e5effa');line(x+135,240,x+135,281)
box(32,285,856,70,'Hypervisor / Hyper-V','虚拟化层 · 隔离与分配资源','#dff2e7')
line(460,355,460,380)
box(32,385,856,75,'Physical host: CPU · RAM · Storage · Network','物理主机：处理器 · 内存 · 存储 · 网络','#fff')
text(32,489,'VM isolation does not remove a shared host failure domain.',16,INK)
text(32,515,'虚拟机相互隔离，并不消除共同的主机故障域；主机故障可能影响其上的全部虚拟机。',16,MUTED);save('virtualization')

start('recovery','RPO and RTO describe different gaps','RPO 与 RTO 衡量不同的时间间隔',505,'A restore point at 09:00, a failure at 10:00 and verified service recovery at 10:40 illustrate a one-hour data gap and forty-minute recovery duration. 09:00 恢复点、10:00 故障、10:40 验证恢复，示例数据回退一小时、恢复用时四十分钟。')
line(83,257,852,257)
for x,time,en,zh,color in [(125,'09:00','Restore point','可用恢复点',GREEN),(500,'10:00','Failure','故障发生','#ad4e35'),(812,'10:40','Service verified','服务验证通过',BLUE)]:
 parts.append(f'<circle cx="{x}" cy="257" r="7" fill="{color}"/>');text(x,220,time,26,color,'middle',600);pair(x,291,en,zh,17,'middle')
rect(125,151,375,40,'#fff0d9','#dcc18f',5);text(312,177,'Data gap / 数据回退: 1 h',17,AMBER,'middle',600)
rect(500,151,312,40,'#e5effa','#aac5e5',5);text(656,177,'Recovery / 恢复: 40 min',17,BLUE,'middle',600)
rect(32,365,856,114,'#fff')
text(52,393,'RPO: acceptable data-loss window. RTO: target recovery duration.',18,INK,weight=600)
text(52,422,'RPO：可容忍的数据丢失窗口。RTO：目标恢复时间。',17,MUTED)
text(52,452,'Compare this measured example with your business targets. / 将本例实际结果与业务目标比较。',15,MUTED)
save('recovery')
print('Created 8 bilingual SVG diagrams in',OUT)
