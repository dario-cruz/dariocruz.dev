---
slug: Campfire1-Sherlock
title: Campfire 1 (HTB-Sherlock)
description: HTB Sherlock Campfire 1 investigation focused on Kerberoasting and log analysis.
keywords: [Hack The Box, Sherlock, Campfire, Kerberoasting, log analysis]
image: /img/itsmedario.webp
authors: [dcruz]
tags: [hackthebox, Log Analysis, PECmd, Prefetch, Event Logs, Kerberoasting, Kerberos, Active Directory,]
enableComments: true
---
![Campfire 1 Title Image](img/Camfire%201-MainTitle.webp)
Hack the Box recently created some learning tracks for their Sherlock labs. I recently enrolled in the *Detecting Active Directory* track as I have already completed two of the Sherlocks included, [Noxious](https://www.dariocruz.dev/blog/Noxious-HTB-Sherlocks) and [Reaper](https://www.dariocruz.dev/blog/Reaper-HTB-Sherlocks). Campfire 1 is the first in the series in this track and pairs up well with my article on [Kerberoasting](https://www.dariocruz.dev/blog/Kerberoasting-Explained) as this investigation deals with a Kerberoasting attack. Let's get started!

## The Scenario

*Alonzo Spotted Weird files on his computer and informed the newly assembled SOC Team. Assessing the situation it is believed a Kerberoasting attack may have occurred in the network. It is your job to confirm the findings by analyzing the provided evidence. You are provided with: 1- Security Logs from the Domain Controller 2- PowerShell-Operational Logs from the affected workstation 3- Prefetch Files from the affected workstation*
<!-- truncate -->

## The Files

I took a look at the file confirming what was stated in the scenario of the investigation. We have a folder named `Triage` with two folders inside named, `Domain Controler` & `Workstation`. The `Domain Controller` folder has a single `.evtx` file named `SECURITY-DC`. The `Workstation` folder contains another `.evtx` file named `PowerShellOperational` and a folder that contains all of the Windows prefetch files taken at the time of attack.

## Task 1

**Analyzing Domain Controller Security Logs, can you confirm the date & time when the Kerberoasting activity occurred?**

Let's take a look at the event log file that is present in the `Domain Controller` folder. Looking through the log file, and using information from my notes and also my [article on Kerberoasting](https://www.dariocruz.dev/blog/Kerberoasting-Explained), we should be looking for the event code `4769` which signifies a Kerberos ticket is being requested. We also need to take a look at the method of encryption that is used in this specific event as threat actors will attempt to downgrade the encryption standard used, in order to offline brute force the hash of the password.

In the logs I can see that there are a number of Kerberos ticket requests, most of which make use of `AES256_CTS_HMAC_SHA1_96`, which is standard for modern AD environments.

Looking further we can see a suspicious ticket request at `5/20/2024 11:18:09 PM` that stands out from the rest.

![Kerberoasting Event](img/Campfire%201%20_HTB-Sherlocks_-1743688910438.webp)
Here are the indicators:

- Time of ticket request is off hours from business operations. (How's burning the midnight oil?)
- Ticket request encryption type is `0x17` which is the value for `RC4_HMAC` which is commonly used by threat actors for Kerberoasting.
- The ticket being requested is for the MSSQL services, which if granted could lead to data exfiltration or ransomware attacks.

So now we have time time and date that the Kerberoasting attack happened, which is `5/20/2024 11:18:09 PM` but, there is one more step that we have to do. We need to convert the time the event occurred to UTC as Windows Event Viewer converts all log times to that machine's local time.

**Task Flag:** `2024-05-21 03:18:09`
![Task 1 Flag](img/Campfire%201%20_HTB-Sherlocks_-1743690011494.webp)

## Task 2

**What is the Service Name that was targeted?**

The flag for this task is present in the same event that we took a look at, detailing the start of the Kerberoasting attack.

![Task 2 Event Details](img/Campfire%201%20_HTB-Sherlocks_-1743690124562.webp)

**Task Flag:** `MSSQLService`
![Task 2 Flag](img/Campfire%201%20_HTB-Sherlocks_-1743690202430.webp)

## Task 3

**It is really important to identify the Workstation from which this activity occurred. What is the IP Address of the workstation?**

Looking again at the same event log, towards the top of the event details we can see network information for the machine that initiated the request. Windows logs both the IPv6 and IPv4 addresses separated by an `:`.

![Task 3 Event Details](img/Campfire%201%20_HTB-Sherlocks_-1743690384299.webp)

**Task Flag:** `172.17.79.129`
![Task 3 Flag](img/Campfire%201%20_HTB-Sherlocks_-1743690425875.webp)

## Task 4

**Now that we have identified the workstation, a triage including PowerShell logs and Prefetch files are provided to you for some deeper insights so we can understand how this activity occurred on the endpoint. What is the name of the file used to Enumerate Active directory objects and possibly find Kerberoastable accounts in the network?**

First step is to take a look at the PowerShell logs, we should be able to analyze and discern which file is being written to or accessed in order to carry out the enumeration of AD objects.

Looking at the contents of the PowerShell log file we can see numerous events that are classified as warnings with the event code of `4104` which pertains to *PowerShell script block logging*. Each of the events of this type have one thing in common, they are all invoked by the file `powerview.ps1`.
![Task 4 Event Details](img/Campfire%201%20_HTB-Sherlocks_-1743691683435.webp)

**Task Flag:** `powerview.ps1`
![Task 4 Flag](img/Campfire%201%20_HTB-Sherlocks_-1743691723646.webp)

## Task 5

**When was this script executed?**

The first instance of the `powerview.ps1` script being executed happened at `5/20/2024 11:16:32 PM` EST. We can discern this further and anticipate further executions via investigating the log details, which state at the top: `Creating Scriptblock text (1 of 20):`,. the event of which is followed by 19 more script block events.

Converting the time of the event to UTC and to the format requested for the flag we get: `2024-05-21 03:16:32`.

**Task Flag:** `2024-05-21 03:16:32`
![Task 5 Flag](img/Campfire%201%20_HTB-Sherlocks_-1743692232202.webp)

## Task 6

**What is the full path of the tool used to perform the actual kerberoasting attack?**

Okay so we know that the enumeration and Kerberoasting attack came from the same machine. We should look through the prefetch files and look at suspicious file names or common names of tools used to carry out Kerberoasting attacks.

Looks like we didn't have to look far, we have a file inside of the `\2024-05-21T033012_triage_asset\C\Windows\prefetch` directory named `Rubeus.exe`.
![](img/Campfire%201%20_HTB-Sherlocks_-1743692896710.webp)

We need to analyze the prefetch of this file for metadata that would allow us to determine when the file was first executed.

For this task I will make use of PECmd, which is a forensics tool created by [Eric Zimmerman](https://ericzimmerman.github.io/#!index.md) that allows for parsing of prefect files, displaying a wealth of metadata. I also read a guide on how to use the tool [here](https://bromiley.medium.com/tooling-thursday-pecmd-83d1d6d6346b). Thanks Matt B!

Using the guide and documentation I ran the tool using the `-f` flag specifying PECmd to scan the `RUBEUS.EXE-5873E24B.pf` file and got the following output.

```powershell
PS C:\Tools> .\PECmd.exe -f 'C:\Sherlocks\Campfire 1\Triage\Workstation\2024-05-21T033012_triage_asset\C\Windows\prefetch\RUBEUS.EXE-5873E24B.pf'
PECmd version 1.5.1.0

Author: Eric Zimmerman (saericzimmerman@gmail.com)
https://github.com/EricZimmerman/PECmd

Command line: -f C:\Sherlocks\Campfire 1\Triage\Workstation\2024-05-21T033012_triage_asset\C\Windows\prefetch\RUBEUS.EXE-5873E24B.pf

Keywords: temp, tmp

Processing C:\Sherlocks\Campfire 1\Triage\Workstation\2024-05-21T033012_triage_asset\C\Windows\prefetch\RUBEUS.EXE-5873E24B.pf

Created on: 2024-05-21 05:02:37
Modified on: 2024-05-21 03:18:09
Last accessed on: 2025-04-03 18:06:34

Executable name: RUBEUS.EXE
Hash: 5873E24B
File size (bytes): 86,612
Version: Windows 10 or Windows 11

Run count: 1
Last run: 2024-05-21 03:18:08

Volume information:

#0: Name: \VOLUME{01d951602330db46-52233816} Serial: 52233816 Created: 2023-03-08 01:48:53 Directories: 56 File references: 178

Directories referenced: 56

00: \VOLUME{01d951602330db46-52233816}\USERS
01: \VOLUME{01d951602330db46-52233816}\USERS\ALONZO.SPIRE
02: \VOLUME{01d951602330db46-52233816}\USERS\ALONZO.SPIRE\APPDATA
03: \VOLUME{01d951602330db46-52233816}\USERS\ALONZO.SPIRE\APPDATA\LOCAL
04: \VOLUME{01d951602330db46-52233816}\USERS\ALONZO.SPIRE\APPDATA\LOCAL\MICROSOFT
05: \VOLUME{01d951602330db46-52233816}\USERS\ALONZO.SPIRE\APPDATA\LOCAL\MICROSOFT\WINDOWS
06: \VOLUME{01d951602330db46-52233816}\USERS\ALONZO.SPIRE\APPDATA\LOCAL\MICROSOFT\WINDOWS\SCHCACHE
--SNIP--

Files referenced: 109

00: \VOLUME{01d951602330db46-52233816}\WINDOWS\SYSTEM32\NTDLL.DLL
01: \VOLUME{01d951602330db46-52233816}\USERS\ALONZO.SPIRE\DOWNLOADS\RUBEUS.EXE (Executable: True)
02: \VOLUME{01d951602330db46-52233816}\WINDOWS\SYSTEM32\MSCOREE.DLL
03: \VOLUME{01d951602330db46-52233816}\WINDOWS\SYSTEM32\KERNEL32.DLL
04: \VOLUME{01d951602330db46-52233816}\WINDOWS\SYSTEM32\KERNELBASE.DLL
05: \VOLUME{01d951602330db46-52233816}\WINDOWS\SYSTEM32\LOCALE.NLS
06: \VOLUME{01d951602330db46-52233816}\WINDOWS\SYSTEM32\APPHELP.DLL
07: \VOLUME{01d951602330db46-52233816}\WINDOWS\APPPATCH\SYSMAIN.SDB
08: \VOLUME{01d951602330db46-52233816}\WINDOWS\SYSTEM32\ADVAPI32.DLL
09: \VOLUME{01d951602330db46-52233816}\WINDOWS\SYSTEM32\MSVCRT.DLL
10: \VOLUME{01d951602330db46-52233816}\WINDOWS\SYSTEM32\SECHOST.DLL
11: \VOLUME{01d951602330db46-52233816}\WINDOWS\SYSTEM32\RPCRT4.DLL
12: \VOLUME{01d951602330db46-52233816}\WINDOWS\SYSTEM32\BCRYPT.DLL
13: \VOLUME{01d951602330db46-52233816}\WINDOWS\MICROSOFT.NET\FRAMEWORK64\V4.0.30319\MSCOREEI.DLL
--SNIP--
```

We can see that the tool provides a list of directories and files that were referenced. In the list of files referenced we can see an entry for `RUBEUS.EXE`, with the full path to the malicious file being `C:\users\alonzo.spire\downloads\rubeus.exe`.

**Task Flag:** `C:\Users\Alonzo.spire\Downloads\Rubeus.exe`
![Task 6 Flag](img/Campfire%201%20_HTB-Sherlocks_-1743704349168.webp)

## Task 7

**When was the tool executed to dump credentials?**

For the last and final task, the flag is in the output of the command used in the previous task. We run PECmd, on the target prefetch file, `RUBEUS.EXE-5873E24B.pf` and analyze the output.

The output displays a time value for the last time the executable was run, and lucky for us, the tool outputs the time in UTC.

```powershell
Executable name: RUBEUS.EXE
Hash: 5873E24B
File size (bytes): 86,612
Version: Windows 10 or Windows 11

Run count: 1
Last run: 2024-05-21 03:18:08
```

**Task Flag:** `2024-05-21 03:18:08`
![Task 7 Flag](img/Campfire%201%20_HTB-Sherlocks_-1743704648642.webp)

## Investigation Complete

![Investigation Complete](img/Campfire%201%20_HTB-Sherlocks_-1743708501487.webp)

## Key Takeaways

- Windows Prefetch files are useful in forensics as they provide useful information like executable name, file path, number of executions, lists of DLLs and files accessed.
- PECmd is a useful tool for examining the metadata of prefetch files, allowing for investigation of these files straight from the command line. PECmd also has the ability to output to `.csv` and `.json` file types for further analysis with other tools.
