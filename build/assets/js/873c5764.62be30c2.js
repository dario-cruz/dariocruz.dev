"use strict";(self.webpackChunkdariocruz_dev=self.webpackChunkdariocruz_dev||[]).push([[4696],{3924:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>o,default:()=>c,frontMatter:()=>s,metadata:()=>r,toc:()=>h});var i=n(4848),a=n(8453);const s={description:"Building a Cyber Home Lab"},o="Building The Home Lab",r={id:"HomeLab/Building The Home Lab",title:"Building The Home Lab",description:"Building a Cyber Home Lab",source:"@site/docs/02-HomeLab/01-Building The Home Lab.md",sourceDirName:"02-HomeLab",slug:"/HomeLab/Building The Home Lab",permalink:"/docs/HomeLab/Building The Home Lab",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{description:"Building a Cyber Home Lab"},sidebar:"tutorialSidebar",previous:{title:"Projects",permalink:"/docs/intro"}},d={},h=[{value:"Racking",id:"racking",level:2},{value:"Zimaboard Firewall",id:"zimaboard-firewall",level:2},{value:"Installing PFSense",id:"installing-pfsense",level:3},{value:"Tenda Switch",id:"tenda-switch",level:3},{value:"Proxmox Install",id:"proxmox-install",level:2},{value:"Proxmox Config &amp; Clustering",id:"proxmox-config--clustering",level:2},{value:"So What&#39;s Next?",id:"so-whats-next",level:2}];function l(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",img:"img",li:"li",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,a.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.header,{children:(0,i.jsx)(t.h1,{id:"building-the-home-lab",children:"Building The Home Lab"})}),"\n",(0,i.jsx)(t.p,{children:"Hello all,"}),"\n",(0,i.jsx)(t.p,{children:"While it's been fun studying Cybersecurity concepts and tools, the time has come to put this knowledge to use with hands on projects. The goal of this lab is to have a space where I can create specific environments, providing hands-on experience with investigating threats, remediation, detection, etc."}),"\n",(0,i.jsx)(t.p,{children:"So for this project I have gathered some hardware that I have purchased on eBay. A set of 3 Lenovo mini PC's. Two M70q Gen 3's and 1 model from a previous generation of this line of computers. I found a 3D printable 10' mini server rack and even a rack mount, specifically designed for the Lenovo mini desktops that I bought."}),"\n",(0,i.jsx)(t.p,{children:"The plan is to install Proxmox on all 3 computers and create a Proxmox cluster so that all the nodes/computers can interface and communicate with one another via the virtual network that I will build out for the lab. I might even look at the HA (High Availability) functionality in Proxmox, which allows for failover and transfer of live VMs to the other nodes, if one of them were to go down for some reason."}),"\n",(0,i.jsx)(t.h2,{id:"racking",children:"Racking"}),"\n",(0,i.jsx)(t.p,{children:"Here are the computers all racked up nice and tidy. I even installed a small patch panel to keep the ethernet cabling in order. I plan on putting a gigabit unmanaged network switch in the top rack slot."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(5030).A+"",width:"647",height:"862"})}),"\n",(0,i.jsx)(t.h2,{id:"zimaboard-firewall",children:"Zimaboard Firewall"}),"\n",(0,i.jsxs)(t.p,{children:["Proxmox and other bare metal hypervisor software have the ability to carry out SDN Wan to manage a virtualized network for all logical hosts. While this a convenient implementation to have, I would like to achieve a more real world configuration via the use of the PFsense firewall OS, provided and maintained by NetGate. The hardware that I am using for the firewall is a 1st generation ",(0,i.jsx)(t.a,{href:"https://shop.zimaboard.com/",children:"Zimaboard"}),"."]}),"\n",(0,i.jsx)(t.h3,{id:"installing-pfsense",children:"Installing PFSense"}),"\n",(0,i.jsx)(t.p,{children:"Installing PFSense was very straight forward, download the compressed image file, extract the image file, and image a USB flash drive via belina Etcher, or in this case, rufus. Hit F11 while the Zimaboard boots and select the flash drive as the intended boot device. Boot into the NetGate installer and configure your initial network settings. In my case, I have configured the router/firewall with these network settings:"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"Network"}),": ",(0,i.jsx)(t.code,{children:"10.1.1.1/24"})]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"Range Start"}),": ",(0,i.jsx)(t.code,{children:"10.1.1.10"})]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"Range End"}),": ",(0,i.jsx)(t.code,{children:"10.1.1.100"})]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"WAN Interface"}),": ",(0,i.jsx)(t.code,{children:"RE0"})]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"LAN Interface"}),": ",(0,i.jsx)(t.code,{children:"RE1"})]}),"\n"]}),"\n",(0,i.jsx)(t.p,{children:"For now I have not configured anything else on PFSense. No ACL's or Firewall rules. The goal is to get everything up and running and communicating, and then while fleshing out projects I will enable different settings to simulate different types of network environments."}),"\n",(0,i.jsx)(t.h3,{id:"tenda-switch",children:"Tenda Switch"}),"\n",(0,i.jsx)(t.p,{children:"For switching and interconnecting of physical and logical hosts, we will be using a basic 5 port Tenda switch. The switch is unmanaged and not VLAN aware, which will suit or needs for the time being."}),"\n",(0,i.jsxs)(t.p,{children:["I opted to create a simple rack mount for the switch using OnShape, a web based CAD software that's free for students and creators.\n",(0,i.jsx)(t.img,{alt:"Tenda - Basic 5 Port Switch",src:n(5358).A+"",width:"894",height:"371"})]}),"\n",(0,i.jsx)(t.h2,{id:"proxmox-install",children:"Proxmox Install"}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.img,{src:n(3134).A+"",width:"943",height:"453"}),"\nI went ahead and installed Proxmox on all 3 computers, configuring them with hostnames and IP addressing via my routers DHCP server and also documenting the hostnames and IP addresses for later use. I also installed ",(0,i.jsx)(t.a,{href:"https://tailscale.com/",children:"Tailscale"})," which is a VPN implementation that has a host of features that make it easy to connect to your home network via mesh VPN tunnels. It uses Wireguard under the hood to accomplish this, allowing me to access the lab from my personal computer, while I am on the guest WIFI network while I am at work. Below are all the node details, after network config and Tailscale install."]}),"\n",(0,i.jsxs)(t.table,{children:[(0,i.jsx)(t.thead,{children:(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.th,{children:"Hostname"}),(0,i.jsx)(t.th,{children:"IP Address"}),(0,i.jsx)(t.th,{children:"Tailnet Address"})]})}),(0,i.jsxs)(t.tbody,{children:[(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"lab01-pve.local"}),(0,i.jsx)(t.td,{children:"192.168.1.152"}),(0,i.jsx)(t.td,{children:"100.95.216.54"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"lab02-pve.local"}),(0,i.jsx)(t.td,{children:"192.168.1.42"}),(0,i.jsx)(t.td,{children:"100.64.68.17"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"lab03-pve.local"}),(0,i.jsx)(t.td,{children:"192.168.1.52"}),(0,i.jsx)(t.td,{children:"100.65.41.127"})]})]})]}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(7161).A+"",width:"1071",height:"271"})}),"\n",(0,i.jsx)(t.p,{children:"Great thing about Tailscale is the Magic DNS functionality which allows me to connect to the nodes via there hostname anywhere. So even if I am off-site, I can connect to tailscale and ssh or load the web interface of Proxmox via the hostname."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(4373).A+"",width:"659",height:"478"})}),"\n",(0,i.jsx)(t.h2,{id:"proxmox-config--clustering",children:"Proxmox Config & Clustering"}),"\n",(0,i.jsxs)(t.p,{children:["Now for the fun part, getting all of these nodes into a cluster. Looking at the Proxmox ",(0,i.jsx)(t.a,{href:"https://pve.proxmox.com/pve-docs/pve-admin-guide.html#chapter_pvecm",children:"documentation"})," the only requirement is that the nodes be running Proxmox and have their final hostname & IP address configurations. In the Proxmox GUI we need to navigate to ",(0,i.jsx)(t.code,{children:"Datacenter>Cluster"}),"."]}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(5224).A+"",width:"1080",height:"791"})}),"\n",(0,i.jsxs)(t.p,{children:["I gave the cluster super original name of ",(0,i.jsx)(t.code,{children:"Sec-Lab-Cluster"}),"\ud83d\ude1c, and proceeded on to the next step."]}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(7797).A+"",width:"799",height:"499"})}),"\n",(0,i.jsxs)(t.p,{children:["Okay so the cluster has been created. Not it's time to add the other nodes to the Proxmox Cluster and get them talking to one another and sharing resources. For that, we need to login to each other the other two clusters and join them to the cluster established on ",(0,i.jsx)(t.strong,{children:"Lab01-pve"})," but, first there is some info that we need handy. We need to login to ",(0,i.jsx)(t.strong,{children:"Lab01-pve"})," and get the cluster info to add to the other nodes. So, to do this we go to ",(0,i.jsx)(t.code,{children:"Datacenter>Cluster>Join Information"}),"."]}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(7092).A+"",width:"1077",height:"758"})}),"\n",(0,i.jsxs)(t.p,{children:["Then on the joining node we go to ",(0,i.jsx)(t.code,{children:"Datacater>Cluster>Join Cluster"})," and paste in the information. Pasting the info we copied from ",(0,i.jsx)(t.strong,{children:"Lab01-pve"})," brings up all the required info for joining the node, minus the root password. We input that and then join the node to the cluster. I did this again on the last and final node and here is the result:"]}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(5236).A+"",width:"1078",height:"824"})}),"\n",(0,i.jsx)(t.p,{children:"All 3 nodes in a single cluster. \ud83d\ude0e"}),"\n",(0,i.jsx)(t.h2,{id:"so-whats-next",children:"So What's Next?"}),"\n",(0,i.jsx)(t.p,{children:"That's a good question. So my plan is to follow all the the domains of the Security+ and also the SC-300 from Microsoft, both of which are certifications that I currently hold. Applying the learning I have done to hands on projects. I am specifically excited to tackle a PKI project as the topic interested me while I was studying for the Security+ SY0-701."})]})}function c(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},7092:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/195f3e190385fd59007cef7e1ac2bee6-00e9c2019ab6b923b1f2c2b1c036ffe8.png"},5236:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/53852baf5ef6b7bff47e744e1b37bae5-23bc04e47d097a346cd7d48fc2920246.png"},3134:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/5629a04db95d04845337d0b233d9243f-271eae3d795f814cde2e379eac3bb4f3.png"},5030:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/5743927c9d55dea7cbdeda8da0ae65ce-d5d7f249729976337f2759c832cadec5.png"},7797:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/58a5f5a094c107c012ec9308ddfb46fc-ad5439ff6cb76f7a6a1ff51b35a99081.png"},5224:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/64a20bad6babb4785713d4ee1c65d349-e025749963a4010b932b93500818b920.png"},7161:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/8b425a19f800f16119a885e56a6c0d97-92886a4b1db72171c41d2952ed3060d4.png"},4373:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/aee446c7cd8914aec6aca94545b87ce8-3afdbc60f27ca71775c9ffd1bcf396ac.png"},5358:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/tenda-switch-dcb1a0ee218c31e8353dfeebdeb090f6.jpg"},8453:(e,t,n)=>{n.d(t,{R:()=>o,x:()=>r});var i=n(6540);const a={},s=i.createContext(a);function o(e){const t=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),i.createElement(s.Provider,{value:t},e.children)}}}]);