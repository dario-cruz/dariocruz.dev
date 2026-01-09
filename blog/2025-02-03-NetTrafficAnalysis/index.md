---
slug: NetTrafficAnalysis
title: "What I've Learned - Network Traffic Analysis"
description: Lessons learned from analyzing network traffic with Wireshark and tcpdump.
keywords: [network traffic analysis, Wireshark, tcpdump, detection, cybersecurity]
image: /img/itsmedario.webp
authors: [dcruz]
tags: [NetworkTrafficAnalysis, Detection, Wireshark, tcpdump]
enableComments: true # for Gisqus
---

![Network Traffic Detective](img/Net%20Traffic%20Detective.png)
I recently completed the Hack The Box module: [Intro to Network Traffic Analysis](https://academy.hackthebox.com/achievement/379578/229). I have to say I really enjoyed this module as we dived into the Analysis process. The whole module gave me the feeling of being a private investigator/detective, digging through tons of information to look for anomalies or patterns that indicate compromise or a security event. Lets dig into what I learned over the course of the module and how it can be applied in practice.

<!-- truncate -->

## Why is Network Traffic Analysis Important?

This is a good question to pose as we need to establish the intent and need for Network Traffic Analysis.

Network Traffic Analysis, can be defined as inspecting of network traffic patterns, analysis network protocol behavior, and analyzing network packets for abnormal behavior, or indicators of compromise.

When you think about it networks are the core of IT infrastructure. Without a network, computers and servers providing services can not communicate with one another. This need for communication is the very reason computers are interconnected in the first place. Threat actors know that communication is paramount to organizations and individuals and by association, the work that they do. Threat actors use this fact and exploit a given network for various reasons.

- To disrupt service and functionality
- To capture and exfiltrate data.
- To gain unauthorized access to a network or service.

Regular checking and investigation of network traffic is important as many times abnormal network communication is the first indicator that something malicious has or will take place.

Citing the NIST publication [Network Security Traffic Analysis Platform - Design and Validation](https://www.nist.gov/publications/network-security-traffic-analysis-platform-design-and-validation), it states:
> Real-time traffic management and control have become necessary in today's networks due to their complexity and cybersecurity risks. With the increase in internet use, threats are more present and require real-time detection and analysis to prevent intrusions. As the number of data flows increases, the number and the types of attacks increase, which makes detecting intrusions challenging. Over the last years, many researchers have focused on different ways to detect intrusions in different systems. In this work, we describe the design and evaluation of a network security traffic analysis platform (NSTAP) to collect, view, search and analyze traffic data in real-time. Through charts, tables, histograms and other visualization methods, we demonstrate its power and usefulness with results obtained with simple time analytics of large data volumes. This work is intended to be the foundation for machine learning based automation tools.

## What is the Process?

The process of analyzing network traffic is cyclical. The higher level process steps inform the bottom level steps and vise versa, information is echoed to each other until the full picture of the threat actors actions come into view.
![NTA Process](img/Network%20Traffic%20Analysis%20Process.svg)

### Steps of the Cycle

- **Monitoring** - The continuous capture of data from the network using tools like *Tcpdump*, *Wireshark*, or a *SIEM* platform.
- **Analysis** - Reviewing of data captured. Looking for anomalies, patterns, and threats.
- **Action** - Implementing changes in an effort to remediate the issue and harden the given network, servers/services, and hosts from future attack.
- **Documentation and Review** - Logtargetteds and Reports of given incidents are used to assess the current processes around responding to the incident. Things like what tools where used to investigate and also remediate the issue. Could this be streamlined further?
- **Adaptation and Improvement** - Lessons learned from the entire cycle, used to create refinements and efficiencies in analyzing and responding to found incidents or events. Drives improvement through out the entire cycle.

## Tools Used

The most commonly used tools for Network Traffic Analysis are as follows:

- **Wireshark** - GUI based network packet capture and analysis tool. Has a host of features that allow for granular filtering of captured traffic, plugins that include functions for displaying statistics about packets captured, rebuilding of protocol traffic flows, and exporting of transferred data, files, images, etc. *Makes use of BPF syntax for filtering*.
- **TShark** - Terminal based version of Wireshark that has many of the same features. Is accessed via the CLI and does not have a GUI. *Also uses BPF Syntax for filtering.*
- **Tcpdump** - Terminal based packet sniffer/capture and analysis tool for Unix based systems. Has a host of features that are accessed via `flags` that are used to define whether to read or write a packet capture file, and how to filter the file and display the output.

### BPF Syntax

Stands for [Berkeley Packet Filter Syntax](https://www.ibm.com/docs/en/qsip/7.4?topic=queries-berkeley-packet-filters) and was created by two individuals, Steven McCanne and Van Jacobson, while they were at Berkeley College's Lawrence Laboratory. [^1] The syntax is widely used in packet capture and filtering tools due to it's ability to quickly reduce packet captures to targeted results. [^2]

[^1]: [https://en.wikipedia.org/wiki/Berkeley_Packet_Filter](https://en.wikipedia.org/wiki/Berkeley_Packet_Filter)
[^2]: [https://www.ibm.com/docs/en/qsip/7.4?topic=queries-berkeley-packet-filters](https://www.ibm.com/docs/en/qsip/7.4?topic=queries-berkeley-packet-filters)

## Detection and Threat Hunting

Network Traffic Analysis and be used for detection of malicious activity on a given network but, in the case that their is no SIEM or IDS/IPS system running on the network. Network Traffic Analysis can be used to *hunt for threats*. Through the use of packet analysis, looking for odd connections to or from hosts, looking at large amounts of data being transferred over a network during non-work hours could be indicators of malicious activity.

## Wireshark File Extraction

Wireshark has the ability to follow traffic flows and rebuild data that has been transferred to completion, over a given network. This specific functionality is called the *dissector*, which will reassemble the data into the original file. This allows for complete files to be analyzed or read in isolated environments, providing more insight as to what is actually taking place.
[^3]
[^3]: [https://www.wireshark.org/docs/wsug_html_chunked/ChIOExportSection.html](https://www.wireshark.org/docs/wsug_html_chunked/ChIOExportSection.html)
