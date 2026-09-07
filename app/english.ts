export type Translation = {
 summary:string; objective:string; sections:{heading:string;body:string}[]; takeaway:string;
 lab:{title:string;environment:string;steps:string[];verify:string};
 quiz:{question:string;options:string[];explanation:string};
};
function lesson(summary:string,objective:string,sections:[string,string][],takeaway:string,title:string,environment:string,steps:string[],verify:string,question:string,options:string[],explanation:string):Translation{return {summary,objective,sections:sections.map(([heading,body])=>({heading,body})),takeaway,lab:{title,environment,steps,verify},quiz:{question,options,explanation}}}
export const english:Record<string,Translation>={
 n01:lesson(
 'Which devices does your data pass through when you open a web page? Use a familiar action to understand network layers and encapsulation.',
 'Distinguish a switch from a router and describe an HTTPS request using the TCP/IP layers.',
 [
 ['01 / Think of a packet as a letter','The application hands data to the transport layer, which adds information such as ports. The network layer adds IP addresses, and the link layer adds headers needed on the local link. Adding information at each layer is called encapsulation. The receiver reverses this process through decapsulation.'],
 ['02 / Each layer solves a different problem','The application layer defines message meaning, as in HTTP and DNS. The transport layer supports communication between processes, using protocols such as TCP and UDP. The network layer uses IP to forward packets across networks. The link layer handles frames on the current link. The seven-layer OSI model helps explain responsibilities; the TCP/IP model more closely reflects the protocol stack.'],
 ['03 / Switches and routers','A Layer 2 switch normally forwards frames within a VLAN using the destination MAC address. A router looks up the destination IP address in its routing table and forwards the packet to the next hop. Link-layer addresses are usually rewritten at a router. Without NAT or similar processing, the source and destination IP addresses normally remain unchanged.']
 ],'MAC addresses help data cross the current link; IP addresses help it cross multiple networks.',
 'Draw your first communication path','Your own computer and home network; no device configuration changes are required.',
 ['Check your IP address, subnet mask and default gateway. Draw the connection between your computer and the gateway.','Ping the gateway to see whether it responds. No reply does not necessarily mean the network is down; ICMP may be disabled.','Choose an accessible website and use tracert on Windows or traceroute on Linux to observe intermediate hops.'],
 'Identify the computer, default gateway and remote server on the path. Explain that asterisks may indicate timeouts or filtering.',
 'What information is primarily used to send a packet to another subnet?', ['The destination IP address and routing table','The display resolution','The title of the HTTP page'],
 'A router performs a route lookup using the destination IP address to select the next hop or outgoing interface.'),
 n02:lesson(
 'IP addresses are not arbitrary labels. The prefix determines which devices can communicate directly and which traffic must use a gateway.',
 'Calculate the range of a /26 subnet and distinguish network, host and broadcast addresses.',
 [
 ['01 / The prefix defines the network boundary','IPv4 addresses contain 32 bits. In 192.168.10.70/26, the first 26 bits identify the network and the remaining 6 bits identify hosts. The mask is 255.255.255.192, giving 64 addresses per subnet. This address belongs to 192.168.10.64/26.'],
 ['02 / Derive the usable address range','Here, .64 is the network address and .127 is the broadcast address. Hosts normally use .65 through .126, giving 62 usable addresses. For conventional subnets, usable hosts equal 2 raised to the number of host bits, minus 2. A /31 point-to-point link and a /32 host route are special cases.'],
 ['03 / Plan before assigning addresses','Variable Length Subnet Masking (VLSM) allows different prefix lengths. Allocate blocks for the largest requirements first, and document each purpose, gateway, DHCP range and reserved address. Private addressing is not a security boundary: traffic between private networks still needs routing and security policies.']
 ],'The subnet mask defines the local range; the default gateway provides a path to other networks.',
 'Split one /24 into four /26 subnets','Paper and pencil or Python; no network connection is required.',
 ['Write the four /26 network addresses within 192.168.10.0/24.','For each subnet, list the first host, last host and broadcast address.','Check your results with Python ipaddress and explain why .70 belongs to the second subnet.'],
 'Obtain networks ending in .0, .64, .128 and .192, each with 62 conventional usable host addresses.',
 'What is the network address of 192.168.10.70/26?', ['192.168.10.0','192.168.10.64','192.168.10.70'],
 'A /26 has a block size of 64. Address 70 falls within 64–127, so the network address ends in .64.'),
 n03:lesson(
 'Reaching an IP address but failing to resolve a domain name is different from having no connectivity at all.',
 'Explain the relationship between address assignment, name resolution and transport connections.',
 [
 ['01 / Obtain an address, then resolve a name','A common initial DHCPv4 exchange is Discover, Offer, Request and ACK. The client receives a leased address and options such as a gateway and DNS servers. DNS resolvers look up record types and cache answers: A maps to IPv4, AAAA to IPv6, and CNAME points to another name.'],
 ['02 / TCP and UDP','TCP provides an ordered byte stream, retransmission and flow control. Connection setup commonly uses SYN, SYN-ACK and ACK. UDP preserves datagram boundaries but does not provide built-in retransmission or ordering. Applications can implement reliable transport over UDP, as QUIC does; UDP does not automatically mean an unreliable application.'],
 ['03 / Verify each layer separately','Check local addressing and routes, query DNS, then test the destination port and application response. DNS can use UDP or TCP. HTTPS with HTTP/1.1 or HTTP/2 normally uses TCP, while HTTP/3 uses QUIC. A port identifies a service endpoint but does not by itself prove that the application works.']
 ],'Verify addressing, names, ports and application responses separately.',
 'Investigate a DNS lookup','Windows PowerShell or Linux with dig and curl installed.',
 ['Query the A and AAAA records for example.com.','Inspect the returned TTL and explain why a cached answer does not disappear immediately when a record changes.','Retrieve the HTTPS response headers and distinguish DNS errors from connection timeouts.'],
 'Record the DNS addresses, destination-port test result and HTTP status code, and explain each separately.',
 'The destination IP is accessible, but name resolution fails. What should you check first?', ['The switch fan','DNS configuration and query results','The browser window size'],
 'Verify the configured DNS server, requested record and response. IP reachability does not prove name resolution is correct.'),
 n04:lesson(
 'Devices connected to the same physical switch can still belong to different Layer 2 networks.',
 'Design two VLANs and explain the separate purposes of trunks and STP.',
 [
 ['01 / VLANs separate broadcast domains','VLANs divide a Layer 2 network into independent broadcast domains. An access port commonly connects an endpoint to one VLAN, while an 802.1Q trunk carries multiple VLANs on one link. The allowed VLAN lists and native VLAN configuration should agree at both ends.'],
 ['02 / Inter-VLAN traffic needs Layer 3 forwarding','Communication between 192.168.10.0/24 in VLAN 10 and 192.168.20.0/24 in VLAN 20 needs router subinterfaces or Layer 3 switch SVIs. VLANs provide Layer 2 segmentation; access control still requires ACLs or a firewall.'],
 ['03 / Prevent Layer 2 loops','Ethernet frames have no loop lifetime limit equivalent to an IP TTL. STP/RSTP elects a root bridge and calculates port roles so that some redundant paths do not forward traffic. Place the root bridge deliberately and apply suitable edge-port protection. Do not disable STP blindly to restore a link.']
 ],'A trunk carries multiple VLANs; STP prevents Layer 2 redundancy from becoming a forwarding loop.',
 'Test VLAN isolation and inter-VLAN routing','Packet Tracer or another isolated simulator with VLAN support.',
 ['Connect two hosts to VLAN 10 and another to VLAN 20; assign appropriate IP addresses.','Configure a trunk between two switches and verify same-subnet VLAN 10 connectivity across them.','Add a Layer 3 gateway and compare inter-VLAN connectivity before and after.'],
 'Hosts in the same VLAN communicate. Inter-VLAN communication works only after Layer 3 forwarding and permitting policies are ready.',
 'What is the main purpose of a trunk?', ['To carry multiple VLANs over one link','To replace DNS resolution','To encrypt all traffic'],
 'An 802.1Q trunk identifies and carries frames for different VLANs. It does not itself provide encryption.'),
 n05:lesson(
 'Move from asking “Who is the next hop?” to understanding how a network finds a new path after a topology change.',
 'Explain longest-prefix matching and verify OSPF neighbors and routes.',
 [
 ['01 / Forwarding uses the longest match','A forwarding lookup first chooses the longest prefix matching the destination: a /24 is more specific than a /16. The default route, 0.0.0.0/0, is used when no more specific route matches. When multiple sources offer the same prefix, devices use rules such as administrative distance or protocol preference to select a candidate.'],
 ['02 / OSPF exchanges topology information','OSPF is a link-state protocol. Routers form adjacencies, synchronize a link-state database and run SPF to calculate paths. When adjacency fails, check the area, timers, authentication, network type and MTU, rather than only whether the link is up.'],
 ['03 / Areas and redistribution','Multi-area designs normally use Area 0 as the backbone. ABRs connect areas, and ASBRs introduce external routes. Redistribution should control prefixes, metrics and route tags to avoid route feedback. IS-IS is also link-state and uses Level-1/Level-2 hierarchy. Start with the common troubleshooting pattern: adjacency, database and path calculation.']
 ],'A healthy neighbor, an installed route and actual data reachability are three separate checks.',
 'Observe route convergence','Three simulated routers in a triangle, each with a loopback interface.',
 ['Configure interface addresses and form OSPF adjacencies in one area.','Record the route, next hop and cost to a remote loopback.','Shut down one simulated link, record the new path and packet-loss duration, then restore it.'],
 'Explain how the next hop changes after the link fails, and use continuous ping to record the convergence impact.',
 'If both a /16 and a /24 match, which route does forwarding select first?', ['Always the /16','The /24','The interface name decides'],
 'Longest-prefix matching prefers the /24. Comparing protocol sources does not let a broader /16 override it.'),
 n06:lesson(
 'Break a fault into testable hypotheses instead of changing several settings at once.',
 'Distinguish NAT from access control and diagnose connectivity using evidence.',
 [
 ['01 / Permission versus translation','ACLs permit or deny traffic according to matching rules, usually evaluated in order. NAT translates addresses, and PAT also uses ports for multiplexing. NAT is not a complete firewall replacement. Stateful firewalls track connection state, and the return path must also be considered.'],
 ['02 / Investigate the wireless medium','Wireless problems may involve coverage, interference, channel utilization, roaming or authentication, not just IP. RSSI describes signal strength; SNR describes the signal relative to noise. Increasing transmit power does not necessarily improve two-way communication.'],
 ['03 / Follow a consistent troubleshooting order','Confirm the scope and timing of recent changes, then inspect physical state, VLANs, addresses, routes, DNS, ports and the application. For packet captures, confirm the observation point, time and filters. Test one hypothesis at a time, retain evidence and prepare a rollback before changing configuration.']
 ],'A successful ping proves a particular ICMP exchange succeeded, not that the business application works.',
 'Document a fault investigation','Your own lab network, or a written analysis of a fault scenario.',
 ['Record addressing, routes and port tests for a host with working HTTPS access.','Introduce an incorrect DNS setting only in the lab and compare it with the baseline.','Restore DNS and document the symptoms, evidence, root cause, fix and verification.'],
 'Prove that the fault is at the DNS layer without changing other variables, and verify the repair.',
 'Can NAT replace a complete access-control design?', ['Yes; address translation provides complete security','No; security policies need a separate design','Yes, as long as the addresses are private'],
 'NAT mainly handles address mappings. Authorization, connection state and segmentation still need independent design.'),
 n07:lesson(
 'BGP does more than find a short path: it lets networks express business and interconnection policies.',
 'Distinguish eBGP from iBGP and explain Local Preference, AS Path and route reflection.',
 [
 ['01 / Exchange reachability between autonomous systems','An autonomous system (AS) operates under a consistent routing policy. eBGP usually connects different ASes, while iBGP distributes BGP routes within one AS. Sessions run over TCP. An Established session does not prove that business prefixes have been received or installed.'],
 ['02 / Express intent with attributes','Local Preference usually expresses an AS-wide exit preference; higher values are preferred. AS Path records traversed ASes and supports loop detection and path selection. Communities label routes for policy matching. The exact selection order depends on the vendor implementation and configuration.'],
 ['03 / Scale and control the boundary','Route reflectors reduce the number of sessions required by an iBGP full mesh, but do not automatically become the data forwarding path. Use explicit inbound and outbound prefix policies, maximum-prefix limits and appropriate RPKI validation to reduce route-leak risk. Write the permitted advertisement list before configuring it.']
 ],'Learning a route in the control plane is not enough: verify next-hop reachability and actual forwarding.',
 'Change an exit preference','FRRouting or simulated BGP devices, using only private AS numbers 65001–65003.',
 ['Build a local router with two simulated upstream paths and advertise a lab prefix.','Compare the attributes of the two paths for that prefix.','Use an inbound policy to raise Local Preference on one path and verify the exit changes.'],
 'List the best path, Local Preference and next hop before and after the policy. Confirm no unintended prefixes are advertised.',
 'What problem does a route reflector mainly address?', ['The session count of an iBGP full mesh','Ethernet cables being too short','Too many DNS records'],
 'A route reflector reflects iBGP routes, reducing dependence on a full mesh. It does not require all data traffic to pass through it.'),
 n08:lesson(
 'Redundancy must account for failure domains. IPv6 needs independent validation rather than simply copying IPv4 habits.',
 'Identify single points of failure and explain IPv6 addressing, neighbor discovery and dual-stack risks.',
 [
 ['01 / Redundancy is not automatically high availability','Two links still share a failure domain if they depend on the same power supply or upstream device. LACP, first-hop redundancy, ECMP and BFD solve problems at different levels. A high-availability design must address detection, failover, recovery and spare capacity.'],
 ['02 / Key IPv6 differences','IPv6 addresses contain 128 bits and support compressed notation. Link-local addresses use fe80::/10. IPv6 has no broadcast; Neighbor Discovery (NDP) uses ICMPv6. SLAAC commonly uses router advertisements for configuration, so blocking all ICMPv6 is inappropriate.'],
 ['03 / Validate both protocol stacks','Working IPv4 does not prove working IPv6. Check AAAA records, routes, neighbors, ACLs, MTU and application listeners separately. IPv6 routers do not fragment forwarded packets; path MTU discovery depends on appropriate error feedback.']
 ],'Ask whether service survives a device failure, rather than simply counting redundant devices.',
 'Inspect dual-stack connectivity and failure domains','An IPv6-capable computer and lab network; use local checks if no IPv6 Internet access is available.',
 ['Inspect local IPv6 addresses and distinguish link-local addresses from others.','Inspect IPv6 routes and neighbors, and record the default-route source.','Draw a dual-uplink topology and identify shared devices, power supplies and upstream dependencies.'],
 'Explain why two links can still share a single point of failure and why ARP is not used to troubleshoot IPv6 neighbors.',
 'What does IPv6 primarily use for neighbor discovery?', ['ARP broadcasts','ICMPv6 / NDP','Only DHCPv4'],
 'NDP uses ICMPv6 messages for neighbor discovery and related functions. IPv6 does not use ARP.'),
 n09:lesson(
 'Different tenants may reuse addresses, provided their routes and policies remain isolated.',
 'Explain the boundaries of VRFs, VPNs and cloud connectivity.',
 [
 ['01 / Multiple independent routing tables','A VRF provides a logically isolated routing instance on a device. Two customers can each use 10.0.0.0/24 without conflict when traffic stays in separate instances. Communication between VRFs requires controlled route importing or a security gateway, rather than unrestricted connectivity.'],
 ['02 / Roles in MPLS L3VPN','In a typical MPLS L3VPN, the CE connects the customer network, the PE maintains customer VRFs and exchanges VPN routes, and P routers forward core labels. An RD distinguishes overlapping VPN prefixes; RTs control route import and export. MPLS label isolation is not data encryption.'],
 ['03 / Connect clouds and branches','Hybrid connectivity requires non-overlapping address planning, route propagation, DNS, encryption, bandwidth and redundancy. AWS Transit Gateway provides a central connectivity hub. Dedicated links such as Azure ExpressRoute and AWS Direct Connect still need separate encryption and backup-path planning. SD-WAN chooses underlying links through centralized policies but still depends on underlay reachability.']
 ],'Isolation, routing reachability and encryption are different properties and must be designed separately.',
 'Design connectivity for two tenants','Paper or a topology tool; this exercise requires no paid cloud resources.',
 ['Draw the office network, two tenant VRFs and one cloud network, and label address ranges.','List permitted imported prefixes and shared services for each routing domain.','Simulate a dedicated-link failure and describe backup-VPN route preference and capacity limits.'],
 'Show why overlapping tenants cannot be merged directly into one routing table, and document shared-service access policies.',
 'Does a dedicated link or MPLS isolation automatically provide end-to-end encryption?', ['Yes','No; verify encryption separately','Yes, if bandwidth is sufficient'],
 'Private connectivity and label isolation do not automatically provide end-to-end encryption. Deploy appropriate encryption where required.'),
 n10:lesson(
 'Separate the IP transport network from the overlay that carries tenant workloads.',
 'Distinguish the underlay, overlay, VTEP, VNI and EVPN control plane.',
 [
 ['01 / The underlay provides IP reachability','Leaf-spine is a common scalable data-center topology. The underlay makes VTEP IP addresses mutually reachable, often with ECMP. Verify routes and MTU before investigating the overlay. Tenant networking cannot work properly if its underlying transport is broken.'],
 ['02 / VXLAN encapsulates Layer 2 frames','A VTEP encapsulates Layer 2 frames in UDP/IP and uses a VNI to identify the virtual network. An L2 VNI represents a bridge domain; an L3 VNI is commonly associated with a tenant routing domain. Encapsulation adds overhead, so the MTU must accommodate the outer headers.'],
 ['03 / EVPN distributes reachability','BGP EVPN provides the control plane. Commonly, Route Type 2 advertises MAC/IP information, Type 3 carries membership information associated with multicast handling, and Type 5 advertises IP prefixes. Support depends on implementation and use case. IRB combines bridging and routing; multihoming also requires understanding ESI and DF election.']
 ],'First prove VTEP reachability, then verify EVPN routes, and finally check tenant traffic.',
 'Trace traffic between racks','An EVPN-capable virtual lab, or begin with a topology walkthrough on paper.',
 ['Draw two leaf switches and one spine, labeling VTEP loopbacks.','Assign an L2 VNI to two hosts in the same tenant and draw the inner frame and outer IP headers.','List a troubleshooting order for unreachable hosts: underlay, EVPN, VNI mappings and host neighbor tables.'],
 'Identify which forwarding uses outer VTEP IP addresses and which uses inner tenant MAC/IP addresses.',
 'Which VXLAN field identifies a virtual network?', ['TTL','VNI','TCP Window'],
 'The VNI is the VXLAN Network Identifier. VTEPs use it to distinguish overlay networks.'),
 n11:lesson(
 'Turn a correct manual operation into a repeatable, reviewable workflow.',
 'Design an automation workflow that collects state, makes a change and verifies the result.',
 [
 ['01 / Start with read-only automation','Build a trusted device inventory, then collect versions, interface states and configuration backups. Ansible organizes hosts in an inventory and describes tasks in playbooks. The appropriate network_cli or API connection depends on the platform and collection. Do not judge success only by a process exit code.'],
 ['02 / Data models are more stable than screen text','NETCONF is commonly used for structured configuration management, while YANG describes data models. gNMI can support configuration and streaming telemetry. Devices support different models and paths. Define authentication, permissions, timeouts, error handling and sensitive-data protection before automating.'],
 ['03 / Make verification part of the change','Save a baseline, review the diff, execute on a small scope, and verify protocol neighbors, business reachability and important metrics. Tools such as pyATS can help parse output and test behavior. For telemetry, consider sampling frequency, label cardinality and alert noise; collection volume is not the same as observability.']
 ],'Automation succeeds when the intended state and business behavior are verified, not merely when commands are sent.',
 'Write a read-only device audit','Ansible installed locally and a lab network device reachable by SSH; install the collection for its platform.',
 ['Create an inventory containing only lab devices and verify connection parameters and key permissions.','Use a version query as the first task and record success or failure for each device.','Record failures clearly. Do not make bulk changes until data collection works reliably.'],
 'Save output and errors for every device and confirm that device configuration has not changed.',
 'What should you do after a bulk configuration task reports success?', ['Finish immediately','Verify the intended state and business reachability','Delete all logs'],
 'Successful command execution does not prove healthy business services. Verify protocol state and critical traffic, and be ready to roll back.'),
 n12:lesson(
 'Bring protocol knowledge together in an explainable small-enterprise network design.',
 'Produce requirements, a topology, an addressing table, a policy matrix and a failure-test report.',
 [
 ['01 / Start with business constraints','Begin with users, application paths, availability, latency, budget and operational skills. Draw traffic paths, trust boundaries and failure domains, and identify mandatory requirements. Do not add unnecessary complexity simply to use a particular protocol.'],
 ['02 / Establish trust around resource access','Zero Trust does not automatically trust access based on an internal network location. Control resource access using identity, device posture, least privilege and ongoing evaluation. Network segmentation is one technique, not a complete Zero Trust implementation.'],
 ['03 / Prove the design through fault injection','In an isolated lab, test link failures, incorrect routes, DNS failures and congestion. Record the impact on services and recovery time. Reports should include initial state, a timeline, expected and actual results, and improvements. Deliver runbooks, rollback procedures and handover documentation as part of the project.']
 ],'A professional design explains why it was chosen and what happens when something fails.',
 'Build a small enterprise with two sites','A simulator and documentation tools, using synthetic business data.',
 ['Design headquarters and a branch with employee, guest and server networks. Define allowed traffic between them.','Implement dynamic routing, redundant uplinks and a controlled Internet exit; verify DNS and HTTPS.','Inject a link failure and an incorrect policy, and record diagnostic evidence and rollback results.'],
 'Another learner can reproduce your lab from the documentation and understand each design trade-off.',
 'Which statement correctly describes Zero Trust?', ['Internal users are always trusted','Installing a firewall is sufficient','Evaluate resource access using identity, device state and policy'],
 'Zero Trust does not grant implicit trust based on network location. Resource access requires explicit evaluation.'),
 s01:lesson(
 'The first step in systems engineering is to distinguish processes, services, logs and resource state.',
 'Inspect services, listening ports and logs, and establish a server baseline.',
 [
 ['01 / The operating system provides the runtime environment','The kernel manages the CPU, memory, devices and processes. A service provides functionality in the background; it may listen on a port or perform only local tasks. Windows uses service management, Event Viewer and PowerShell. Many Linux distributions use systemd to manage services.'],
 ['02 / Files, identities and permissions','Linux distinguishes users, groups and read, write and execute permissions. Execute permission on a directory affects traversal. Windows commonly grants access through NTFS ACLs. Use least privilege for everyday work and elevate separately for administration rather than running everything permanently as an administrator.'],
 ['03 / Establish a baseline before troubleshooting','Record the OS version, patches, disk space, time synchronization, critical services, listening ports and log locations. High CPU usage, memory pressure and slow storage have different causes. Inspect trends, processes and related events instead of treating a reboot as root-cause analysis. Server Core reduces dependence on a graphical interface and requires remote-management skills.']
 ],'A running service indicates process state; still verify its port and an actual request.',
 'Create a server health report','An Ubuntu lab VM or a Windows lab VM.',
 ['Record the OS version, CPU, memory, storage and IP configuration.','Choose an installed service and inspect its status, recent logs and listening ports.','Explain what separate evidence is needed for “running” and “usable by the business”.'],
 'Include a baseline, anomalies, log timestamps and a business-level test. Do not infer a root cause from a single metric.',
 'Does a service showing Running prove that users can access it?', ['Yes','No; verify the port and a business request','Yes, if CPU usage is low'],
 'The service may listen on the wrong address, be blocked by policy or have a failed dependency. Request-level verification is still needed.'),
 s02:lesson(
 'Centralized identity depends on stable name resolution and time services.',
 'Explain domain controllers, domain members and DNS, and verify core domain services.',
 [
 ['01 / AD DS is a directory service','AD DS stores objects such as users, computers and groups. Domain controllers provide directory and authentication-related services. A domain is one management boundary; a forest defines a broader directory structure. Domain membership enables centralized accounts and policies but does not automatically grant access to every resource.'],
 ['02 / DNS helps clients locate services','AD uses DNS SRV records to discover services such as domain controllers. Domain members should use DNS servers that resolve the AD zones correctly. Mixing public DNS directly into domain-client resolver lists can cause intermittent failures. Internal DNS servers can use forwarding for Internet queries.'],
 ['03 / DHCP and time synchronization','DHCP distributes addresses, gateways and DNS settings. Check scopes, exclusions, leases and authorization. Kerberos is sensitive to clock skew, so verify the domain time hierarchy. When troubleshooting domain logon, check DNS, time, domain-controller reachability and event logs together.']
 ],'AD faults often require DNS, time and network checks, rather than immediately recreating an account.',
 'Verify core services in a lab domain','An isolated virtual network with one domain controller and one Windows client; example domain: ad.example.test.',
 ['Install lab AD DS and DNS, and record the domain name and domain-controller IP. Do not offer DHCP on the production network.','Configure the client to use domain DNS, join the lab domain and sign in with a standard domain account.','Query SRV records, inspect time status and check domain-controller discovery.'],
 'The client discovers the correct domain controller and completes domain logon. DNS and time configuration match your records.',
 'Which service is essential when a domain client locates a domain controller?', ['DNS service records','The print queue','Public email services'],
 'AD clients locate domain services through records such as DNS SRV. Incorrect DNS can prevent domain-controller discovery.'),
 s03:lesson(
 'Being able to sign in does not guarantee access. Share permissions alone do not guarantee file-system permission.',
 'Grant access through groups and verify the effective scope of Group Policy.',
 [
 ['01 / Assign permissions through groups','Place users in business groups, then put those groups into resource-permission groups to reduce individual grants. Authentication establishes who someone is; authorization determines what they may do. Avoid shared administrator accounts that conceal weaknesses in permission design.'],
 ['02 / Share and NTFS permissions both apply','Remote SMB access must satisfy both share permissions and NTFS permissions. Effective access depends on user and group allows, denies, inheritance and other rules. Finding an Allow entry in one place does not prove access. Use effective-access analysis and a real test.'],
 ['03 / Understand GPO scope','GPOs can be linked to sites, domains and OUs, with further controls such as security filtering. Distinguish user settings from computer settings and understand inheritance, enforcement and blocked inheritance. Use gpresult to verify the outcome rather than only confirming that the policy exists.']
 ],'Verify permissions and policies using the actual target user and computer.',
 'Assign file access for two departments','A Windows lab domain, a file server and two standard test accounts.',
 ['Create Finance and IT groups and two test folders.','Assign the required permissions by group, then test reading and writing with each standard account.','Link a harmless GPO to a test OU and record the resulting applied policy.'],
 'Create a user-by-folder-by-operation matrix and confirm actual read/write results match the design.',
 'What normally must be true for a user to write a file over SMB?', ['Only share permissions must allow it','Only NTFS permissions must allow it','Both effective share and NTFS permissions must allow it'],
 'Remote access is constrained by both share and file-system permissions. Evaluate effective access across both.'),
 s04:lesson(
 'Virtual machines, RAID and snapshots serve different purposes and cannot replace one another.',
 'Explain virtual switches, storage types and the difference between a snapshot and a recoverable backup.',
 [
 ['01 / Virtualization shares physical resources','Hyper-V runs multiple virtual machines on one physical host. Plan vCPU, memory, disk performance and failure impact; resource overcommitment needs monitoring. External, internal and private virtual switches provide different connectivity. Before a lab, establish whether its VMs can reach the real network.'],
 ['02 / Understand the storage interface','NAS usually provides file protocols such as SMB/NFS; SAN usually provides block storage such as iSCSI/FC. RAID improves availability for certain disk failures, but does not cover every accidental deletion, malicious encryption event or site loss. Capacity, IOPS, throughput and latency are different measurements.'],
 ['03 / Design backups around recovery','Snapshots and checkpoints depend on the original storage and related chains, and are generally not independent backups. Use appropriate offline or immutable copies, and define retention, encryption and recovery permissions. RPO is the tolerable data-loss window; RTO is the target recovery time. Recovery exercises are needed to validate them.']
 ],'A successful backup job is only the starting point. Successful recovery and data verification are the goal.',
 'Restore a test file','Hyper-V or another lab virtualization platform; use test files only.',
 ['Create an isolated virtual switch and VM, and record resource allocation.','Create a test file, calculate its hash and make an independent backup copy.','Delete the test file, restore it from backup, compare hashes and record the elapsed time.'],
 'The restored file matches the original hash. Record recovery duration and the latest recoverable point in time.',
 'Why can RAID not replace backups?', ['It is always slower','Deletion or corruption may affect the array data too','It cannot store files'],
 'RAID primarily addresses some disk failures. Independent backups must also cover logical corruption, deletion and broader failure domains.'),
 s05:lesson(
 'Across multiple sites, identity services also need replication, administrative-credential management and certificate lifecycle control.',
 'Check replication health and identify the boundaries of trusts, administrator credentials and certificates.',
 [
 ['01 / Multiple domain controllers and sites','Sites and subnet mappings help clients locate services and organize replication. Do not judge replication only by whether one domain controller is online; inspect partners, failure times and backlogs. FSMO roles have distinct responsibilities. Transferring a role and seizing it after failure are different operations and require justification.'],
 ['02 / Control administrative credentials','Windows LAPS manages local administrator password rotation and retrieval permissions, reducing the risk of lateral movement with reused local passwords. Separate administrative and everyday accounts and limit privileged sign-in locations. A trust establishes an authentication path, not automatic resource authorization.'],
 ['03 / PKI manages chains of trust','Certificates bind an identity to a public key. Check validity dates, names, intended usage, chain validation and revocation status. AD CS certificate templates and enrollment permissions require careful control; overly permissive templates can enable identity abuse. Document issuance, renewal, revocation and CA backup procedures.']
 ],'A trust allows an authentication path; access to a resource still requires authorization.',
 'Check identity and certificate health','An isolated domain with two lab domain controllers; inspect a public-site certificate or a lab CA certificate.',
 ['Inspect replication summaries on lab domain controllers and record success and failure times.','Use a browser certificate viewer to inspect names, expiration and the issuer chain.','List which groups may retrieve local administrator passwords and enroll through certificate templates.'],
 'Distinguish four areas: replication health, authentication paths, authorization and certificate validation.',
 'Does establishing a domain trust automatically grant access to every file?', ['Yes','No; resources still need separate authorization','DNS alone decides'],
 'A trust creates a cross-boundary authentication path. Resource access remains subject to authorization policy.'),
 s06:lesson(
 'A single failed server and an unavailable site require different recovery strategies.',
 'Define high availability, RPO/RTO and recovery exercises using business requirements.',
 [
 ['01 / Clusters address some failure scenarios','A failover cluster coordinates nodes to take over supported workloads. Quorum determines which nodes may continue serving, helping prevent a split state. Include shared storage, networks and witness resources in failure analysis. A cluster cannot repair data that is already corrupted.'],
 ['02 / Recovery follows dependencies','Disaster recovery must restore dependencies in an appropriate order: networking, identity, DNS, storage, databases and applications. RPO measures acceptable data rollback; RTO is the target recovery duration. The business should set the objectives, then assess whether backups, replication and capacity can meet them.'],
 ['03 / Make exercises repeatable','Start services from a known recovery point in an isolated environment. Verify data consistency, account permissions and external dependencies. Record actual recovery time and compare it with the objective. Replication can propagate deletion or corruption, so HA, replication and historical backups should complement one another.']
 ],'High availability reduces downtime impact; backups and disaster recovery address broader failures and data recovery.',
 'Write and exercise a recovery runbook','Lab VMs, a test service and an independent backup of that service.',
 ['Set example objectives of a 24-hour RPO and a 2-hour RTO, and explain the business risk they imply.','List the recovery order, backup location, required permissions and verification requests.','Restore the test service from backup, time the process, check the data and record whether the objectives were met.'],
 'Complete a recovery independently and provide evidence. If objectives are missed, identify bottlenecks and improvements.',
 'What does RPO primarily measure?', ['The acceptable data-loss time window','CPU clock speed','The target time required to restore service'],
 'RPO concerns the data recovery point. RTO concerns the target recovery duration. Do not confuse them.'),
 s07:lesson(
 'Turn configuration into reviewable code so repeated operations produce consistent results.',
 'Distinguish scripting, configuration management and resource orchestration, and design controlled changes.',
 [
 ['01 / Handle inputs and errors in scripts','PowerShell centers on an object pipeline, while Bash often combines text-processing tools. Validate paths and inputs, handle nonzero exit codes and exceptions, and log enough detail without passwords. Remote execution needs explicit target lists, identities and permissions.'],
 ['02 / Declare state and understand idempotence','Ansible commonly describes the desired state of software, files and services. Repeated execution should avoid unnecessary changes. Arbitrary shell commands are not automatically idempotent. Git records reviewable changes: use a branch, compare differences and test on a small scope.'],
 ['03 / Terraform manages resource lifecycles','Terraform tracks resources through configuration and state. A plan shows expected operations; apply executes them. State may contain sensitive data and needs access controls, encryption and suitable locking. Understand replacement and deletion risks first. Configuration management and resource orchestration can work together. Tools such as Azure Arc can bring hybrid environments into centralized management, but permissions and connectivity still need planning.']
 ],'Automation should leave traceable evidence of the target, differences, execution and verification.',
 'Write a read-only service report','Your own Windows PowerShell lab environment; no cloud resources are created.',
 ['Read service information, filter stopped services and export a CSV.','Run it again and confirm it only refreshes the report without changing service state.','Track the script and usage instructions in Git. Inspect the diff and ensure no credentials are included.'],
 'The report is reproducible, the script does not modify services, and the repository contains no secrets.',
 'Why review a Terraform plan before apply?', ['To confirm what will be created, changed, replaced or deleted','Only to make execution take longer','A plan can replace backups'],
 'A plan shows expected resource changes. Pay particular attention to replacements and deletions, and confirm targets and impact.'),
 s08:lesson(
 'Move beyond “the machine is online” to checking whether users can complete their tasks.',
 'Combine metrics, logs and request tests to diagnose faults, and deliver an operable system.',
 [
 ['01 / Metrics, logs and traces','Metrics support trends and alerts. Logs record discrete events. Traces help explain requests across services. Prometheus collects time-series metrics, while Grafana is often used for visualization. Control label dimensions: do not use every user or request ID as an unbounded metric label.'],
 ['02 / Design alerts around the service','CPU usage is a clue, not the same as user impact. Relate availability, error rates, latency and saturation, and reduce noise with duration thresholds, routing and deduplication. Alerts should link to actionable runbooks stating who responds, how to confirm the issue and when to escalate.'],
 ['03 / Deliver a system someone else can operate','The capstone combines domain identity, Linux services, file permissions, virtualization, independent backups and monitoring. In an isolated lab, test detection and recovery with incorrect DNS, nearly full disks or stopped services. Record the timeline, hypotheses, evidence, root cause and prevention measures; do not stop at “a reboot fixed it”.']
 ],'Observability reduces uncertainty; recovery verification proves users can complete their tasks again.',
 'Build a small-enterprise systems lab','Two or three isolated VMs and monitoring tools, using synthetic test data only.',
 ['Configure basic identity and DNS, a Linux web service and a shared folder with group-based access.','Collect host and service metrics, configure an explainable availability alert and establish an independent backup.','Stop the lab web service, observe the alert, recover using the runbook and verify HTTP requests and data.'],
 'Deliver a topology, an account-permission matrix, monitoring screenshots or exported results, recovery timings and a fault report.',
 'Which check most directly shows whether a web service responds to user requests?', ['Only checking CPU usage','Sending an HTTP request and verifying the response','Only checking VM power state'],
 'An actual request is closer to the user experience. CPU and power state provide supporting evidence only.')
};
