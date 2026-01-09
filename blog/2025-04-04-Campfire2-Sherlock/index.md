---
slug: Campfire2-Sherlock
title: Campfire 2 (HTB-Sherlock)
description: HTB Sherlock Campfire 2 investigation focused on AS-REP roasting and event logs.
keywords: [Hack The Box, Sherlock, Campfire, AS-REP roasting, Kerberos]
image: /img/itsmedario.webp
authors: [dcruz]
tags: [hackthebox, Log Analysis, AsRep, AsREP Roasting, Event Logs, Kerberoasting, Kerberos, Active Directory,]
enableComments: true
---

![Campfire2 - Main Title](img/Campfire%202%20_HTB-Sherlock_-1743777084051.webp)
On to the second part of the Campfire Sherlock from Hack the Box. Again, if you have not read my [previous write-up on Campfire 1](https://www.dariocruz.dev/blog/Campfire1-Sherlock), go check it out. The aim is to complete all Sherlocks in the *Detecting Active Directory Attacks* track on HTB labs. Time to investigate!

## The Scenario

*Forela's Network is constantly under attack. The security system raised an alert about an old admin account requesting a ticket from KDC on a domain controller. Inventory shows that this user account is not used as of now so you are tasked to take a look at this. This may be an AsREP roasting attack as anyone can request any user's ticket which has preauthentication disabled.*
<!-- truncate -->

## The Files

For this Sherlock scenario, we are given a single `.etwx` log file to analyze. We will be looking for AsREP roasting from the looks of things so we should be on the lookout for indicators of such.

## Task 1

**When did the ASREP Roasting attack occur, and when did the attacker request the Kerberos ticket for the vulnerable user?**

Okay, let's open up that log file that we were given and take a look at the logs. For AsREP roasting, we should be on the hunt for malicious entries of event code `4768`, which correlate to Kerberos Authentication TGT requests.

I went ahead and filtered the logs down to just event `4768` entries.
![Log Filtering Event Viewer](img/Campfire%202%20_HTB-Sherlock_-1743778210920.webp)

Looking through the now filtered results, see a suspicious request from a computer that we know is compromised. The user, `Arthur.Kyle`, had their computer compromised and used for a Kerberoasting attack. We know this from the previous investigation [Campfire 1](https://www.dariocruz.dev/blog/Campfire1-Sherlock). We also know that the IP address of the computer was `172.17.79.129`, from answering Task 3 of said investigation. Looks like *Kerberos pre-authentication* was not enabled for this user.
![Event 4768 ASREP](img/Campfire%202%20_HTB-Sherlock_-1743779064830.webp)

The time of the AsREP roasting was `5/29/2004 @ 2:36:40 AM` EST. Converting that into UTC time and the format requested we get the task flag.

**Task Flag:** `2024-05-29 06:36:40`
![Task 1 Flag](img/Campfire%202%20_HTB-Sherlock_-1743779174365.webp)

## Task 2

**Please confirm the User Account that was targeted by the attacker.**

In the previous task, we already stated that the user that was targeted for the attack was `arthur.kyle`, which you can see from the log of the initial AsREP attack.
![Task Log Username](img/Campfire%202%20_HTB-Sherlock_-1743779740125.webp)

**Task Flag:** `arthur.kyle`
![Task 2 Flag](img/Campfire%202%20_HTB-Sherlock_-1743779763383.webp)

## Task 3

**What was the SID of the account?**

Again, in the same event for the initial AsREP roasting attack. We have the SID of the targeted user account `arthur.kyle`, which is `S-1-5-21-3239415629-1862073780-2394361899-1601`
![Task Log SID Value](img/Campfire%202%20_HTB-Sherlock_-1743779902196.webp)

**Task Flag:** `S-1-5-21-3239415629-1862073780-2394361899-1601`
![Task 3 Flag](img/Campfire%202%20_HTB-Sherlock_-1743779957186.webp)

## Task 4

**It is crucial to identify the compromised user account and the workstation responsible for this attack. Please list the internal IP address of the compromised asset to assist our threat-hunting team.**

Yet again in the same event log, we can scroll down to the network details of the computer that made the request to the KDC. We can see that both the IPv6 & IPv4 addresses of the machine are present, as well as the port used. The IP address `172.17.79.129`.
![Task 4 Log Event IP](img/Campfire%202%20_HTB-Sherlock_-1743780301109.webp)

**Task Flag:** `172.17.79.129`
![Task 4 Flag](img/Campfire%202%20_HTB-Sherlock_-1743780344408.webp)

## Task 5

**We do not have any artifacts from the source machine yet. Using the same DC Security logs, can you confirm the user account used to perform the ASREP Roasting attack so we can contain the compromised account/s?**

Okay so looking through the log file in event viewer. I see two events that correlate with each other and give a picture of how the threat actor gained access to another account.

In the image below we can see that the user `arthur.klye`, and their computer, which we know are compromised, requested a Kerberos authentication ticket. *Note the IP address*
![Task 5 Event Log](img/Campfire%202%20_HTB-Sherlock_-1743780825164.webp)

The very next event logged is for *Kerberos Service Ticket Operations*, which allows for requesting service tickets for access to services on a given domain. This operation requires that a TGT be already issued for the requesting account. From the log information we can see that the username has changed. This potentially means that the threat actor used `arthur.kyle`'s computer to request a TGT for another account that had more access. Also note that the event came from the same IP of `arthur.kyle`'s machine.
![Task 5 Event Log Indicators](img/Campfire%202%20_HTB-Sherlock_-1743781208150.webp)

To further backup our hypothesis, after the service ticket was requested and granted for the user account `happy.grunwald`, there are two `5140` events logging that account accessing two shares, `\\*\IPC$` & `\\*\DC-Confidential`. The threat actor appears to be searching for sensitive data to exfiltrate.

**Task Flag:** `happy.grunwald`
![Task 5 Flag](img/Campfire%202%20_HTB-Sherlock_-1743782725773.webp)

## Investigation Complete

![Sherlock Complet](img/Campfire%202%20_HTB-Sherlock_-1743782863475.webp)

## Key Takeaways

- AsREP roasting allows for threat actors to request service tickets for accounts that do not have *Kerberos pre-authentication enabled*. This allows threat actors to gain access to any services/resources provisioned for the target user.
