export const stageEnglish:Record<string,{description:string;weeks:string}>={
n1:{description:'Build a networking mindset and understand an end-to-end communication flow.',weeks:'Suggested: weeks 1–4'},
n2:{description:'Connect subnets and build manageable enterprise networks.',weeks:'Suggested: weeks 5–8'},
n3:{description:'Understand policy, high availability and connectivity across networks.',weeks:'Suggested: weeks 9–14'},
n4:{description:'Move from configuring devices to designing, validating and improving networks.',weeks:'Suggested: weeks 15–24'},
s1:{description:'Manage operating systems, identity and core services.',weeks:'Suggested: weeks 1–8'},
s2:{description:'Build automated, recoverable and observable infrastructure.',weeks:'Suggested: weeks 9–20'}
};
export const commandTranslations:Record<string,string>={
'! Cisco IOS 常见只读核对命令':'! Common Cisco IOS read-only checks',
'# FRR vtysh 或支持相应语法的设备':'# FRR vtysh or devices supporting this syntax',
'# FRR，只读观察；需设备已配置 EVPN':'# FRR read-only checks; EVPN must already be configured',
'# IOS 示例，依赖 cisco.ios 集合':'# IOS example; requires the cisco.ios collection',
'交付清单':'Deliverables',
'[ ] 需求与约束':'[ ] Requirements and constraints',
'[ ] 物理 / 逻辑拓扑':'[ ] Physical / logical topology',
'[ ] IP、VLAN、路由规划':'[ ] IP, VLAN and routing plan',
'[ ] 访问策略矩阵':'[ ] Access-policy matrix',
'[ ] 正常与故障测试记录':'[ ] Normal-operation and failure-test records',
'[ ] 运维与回退手册':'[ ] Operations and rollback runbooks',
'# 在实验文件服务器上读取共享配置':'# Read share configuration on the lab file server',
'# 在具备 AD 管理工具的实验环境':'# Run in a lab with AD administration tools',
'# 读取本机证书':'# Read local-machine certificates',
'恢复记录':'Recovery record',
'开始时间：':'Start time:',
'恢复点时间：':'Recovery point time:',
'身份与 DNS 就绪：':'Identity and DNS ready:',
'服务启动：':'Service started:',
'数据与请求验证：':'Data and request verification:',
'实际 RPO / RTO：':'Actual RPO / RTO:',
'# Linux 服务排查，服务名按实际安装修改':'# Linux service checks; use the actual installed service name'
};
export const stageNames:Record<string,string>={n1:'Networking fundamentals',n2:'Routing & switching',n3:'Advanced enterprise networking',n4:'Architecture & automation',s1:'Systems fundamentals',s2:'Advanced systems engineering'};
export const sourceChinese:Record<string,string>={
'Cisco · Networking Basics':'Cisco · 网络基础',
'IETF · IPv4 / RFC 791':'IETF · IPv4 协议规范 / RFC 791',
'IETF · DNS / RFC 1034':'IETF · 域名系统 / RFC 1034',
'IETF · OSPFv2 / RFC 2328':'IETF · OSPFv2 协议规范 / RFC 2328',
'IETF · BGP-4 / RFC 4271':'IETF · BGP-4 协议规范 / RFC 4271',
'IETF · IPv6 / RFC 8200':'IETF · IPv6 协议规范 / RFC 8200',
'AWS · Transit Gateway':'AWS · 中转网关',
'IETF · EVPN / RFC 7432':'IETF · 以太网虚拟专用网络 / RFC 7432',
'Ansible · Network Getting Started':'Ansible · 网络自动化入门',
'NIST · Zero Trust Architecture':'NIST · 零信任架构',
'Ubuntu · Server Documentation':'Ubuntu · 服务器文档',
'Microsoft Learn · AD DS Overview':'Microsoft Learn · AD DS 概述',
'Microsoft Learn · Hyper-V':'Microsoft Learn · Hyper-V 虚拟化',
'Microsoft Learn · Active Directory Certificate Services':'Microsoft Learn · Active Directory 证书服务',
'Microsoft Learn · Failover Clustering':'Microsoft Learn · 故障转移群集',
'HashiCorp · Terraform Introduction':'HashiCorp · Terraform 简介',
'Prometheus · Overview':'Prometheus · 概述'
};
