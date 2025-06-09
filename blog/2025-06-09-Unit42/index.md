---
slug: Unit42-Sherlock
title: Unit42 (HTB-Sherlock)
authors: [dcruz]
tags: [hackthebox, Sherlocks, Threat Detection, Sysmon, EvtxECmd, TimelineExplorer, LogAnalysis, EricZimmermanTools,]
enableComments: true
---
![Title Image - Unit42](img/Unit%2042%20_HTB-Sherlock_-1749482256043.webp)

Welcome back everyone. The following Sherlock is being completed in preparation for taking the HTB CDSA exam. I came across a medium blog post by the user, [Hammazahmed](https://medium.com/@hammazahmed40/mastering-cdsa-by-htb-f11e99403986). He provides some advice for learning and practicing skills before taking the exam. Specifically, he mentioned this Sherlock investigation, along with some others, [BFT](https://app.hackthebox.com/sherlocks/BFT), [Noted](https://app.hackthebox.com/sherlocks/Noted), RogueOne (Which I have completed, full writeup [here](https://www.dariocruz.dev/blog/RogueOne-HTB-Sherlocks)), and [Meerkat](https://app.hackthebox.com/sherlocks/BFT).
<!-- truncate -->

## Scenario

*In this Sherlock, you will familiarize yourself with Sysmon logs and various useful EventIDs for identifying and analyzing malicious activities on a Windows system. Palo Alto's Unit42 recently conducted research on an UltraVNC campaign, wherein attackers utilized a backdoored version of UltraVNC to maintain access to systems. This lab is inspired by that campaign and guides participants through the initial access stage of the campaign.*

## The Files

Inside the zip file for this investigation, we are provided with a single Windows log file, from the Sysmon Operational log provider.

![The Files](img/Unit%2042%20_HTB-Sherlock_-1749223199579.webp)

## Task 1

*How many Event logs were there with Event ID 11?*

For this I opted to make use of PowerShell, specifically the cmdlet `Get-WinEvent`. Referencing this amazing [PDF](https://wiki.sans.blue/Tools/pdfs/Get-WinEvent.pdf) created by the SANS institute, I was able to use the `-Path` argument to point the Cmdlet to the provided `.evtx` file.  I also applied filtering and counting of events via `| Group-Object id -NoElement | sort count`. The complete command I created is below, along with an explanation of each element.

```PowerShell
Get-WinEvent -Path 'C:\Sherlocks\Unit 42\Microsoft-Windows-Sysmon-Operational.evtx' | Group-Object id -NoElement | sort count
```

- `Get-WinEvent -Path`: Tells the Get-WinEvent cmdlet to target a specific event log file.
- `Group-Object`: Will display objects based on a the value of a property that is given as an argument, in this case the `id` property.
- `-NoElement`: Tells the Group-Object command not to include the objects in the output.
- `sort count`: Enables sorting via a value in this case the count of events.

And here is the output of the complete command.

![Task 1 - Image 1](img/Unit%2042%20_HTB-Sherlock_-1749224947067.webp)

As you can see from the output we have a list of event IDs and their counts in descending order, at the bottom the event id of 11 has a count of **56** events.

![Task 1 - Image 2](img/Unit%2042%20_HTB-Sherlock_-1749225151076.webp)

## Task 2

*Whenever a process is created in memory, an event with Event ID 1 is recorded with details such as command line, hashes, process path, parent process path, etc. This information is very useful for an analyst because it allows us to see all programs executed on a system, which means we can spot any malicious processes being executed. What is the malicious process that infected the victim's system?*

For this I will be parsing the provided `.evtx` file using EvtxECmd and converting it into a `.csv` file. After the parsing/conversion we will be able to view and filter the file in Timeline Explorer, providing a clearer view of the log data and more complete searching and filtering.

![Task 2 - Image 1](img/Unit%2042%20_HTB-Sherlock_-1749226871829.webp)

Above I ran EvtxECMD with the needed parameters and had it generate a `.csv` file from the provided log file.

![Task 2 - Image 2](img/Unit%2042%20_HTB-Sherlock_-1749231600250.webp)

I then opened the file in Timeline Explorer, displaying all the events contained in the log file, presented in groups sorted by event ID.

![Task 2 - Image 3](img/Unit%2042%20_HTB-Sherlock_-1749232799098.webp)

Looking at all of the 6 events pertaining to Event ID 1, we can see a suspicious process creation event invoked from the directory location and file, **C:\Users\CyberJunkie\Downloads\Preventivo24.02.14.exe.exe** which turns out to be the task flag and the malicious process that infected the system.

![Task 2 - Image 4](img/Unit%2042%20_HTB-Sherlock_-1749232910639.webp)

## Task 3

*Which Cloud drive was used to distribute the malware?*

Hmm, okay so we need to find either a directory or some sort of network communication to a cloud service to pin down the flag for this task. Lets take a look at all the events that are contained in the log, just so that we know what we have to work with. Below I have included details for all the Sysmon events contained in our log file and what data they contain.

![Task 3 Image 1](img/Unit%2042%20_HTB-Sherlock_-1749235246395.webp)

- *Sysmon Event ID 1*: We already know from the previous tasks that this event is logged on creation of a Windows processes.
- *Sysmon Event ID 2*: Changing of file creation time.
- *Sysmon Event ID 3*: Network connection made by process.
- *Sysmon Event ID 5*: Windows process termination.
- *Sysmon Event ID 7*: DLL loaded into a process.
- *Sysmon Event ID 10*: Process accessing another process.
- *Sysmon Event ID 11*: File creation/File Overwritten.
- *Sysmon Event ID 12*: Creation and deletion of registry events.
- *Sysmon Event ID 13*: Modification of registry values.
- *Sysmon Event ID 15*: creation of file stream and hash of file contents.
- *Sysmon Event ID 17*: Named Pipe created (interprocess communication).
- *Sysmon Event ID 22*: DNS Queries.
- *Sysmon Event ID 23*: File deletion and archiving.
- *Sysmon Event ID 26*: File deletion logged.

Now we know what event data we have contained in the logs, the task requires us to find what cloud drive was used. Usage of the cloud at all means communication over the internet, meaning that a DNS query should have been made to the cloud service for connection and communication. Lets take a look at *Sysmon Event ID 22*.

![Task 3 Image 2](img/Unit%2042%20_HTB-Sherlock_-1749236734814.webp)

Above we can see that we have 3 logs for Sysmon Event 22. All of the events were triggered by the same user account that launched the malware and all of the events took place around the same time.

![Task 3 Image 3](img/Unit%2042%20_HTB-Sherlock_-1749237333302.webp)

Looking at the payload data contained in the logs we have the Image/Process that initiated the DNS query and also the QueryName/Hostname value.

![Task 3 Image 4](img/Unit%2042%20_HTB-Sherlock_-1749237910904.webp)

I sorted the events by time and found that we had queries for `dl.dropboxusercontent.com` & `d.dropbox.com`. Directly after, we have a query from the malware process, attempting to resolve `www.example.com`. From this information, we can confirm that the cloud drive/service that was being used was **dropbox**.

![Task 3 Image 5](img/Unit%2042%20_HTB-Sherlock_-1749238805282.webp)

## Task 4

*For many of the files it wrote to disk, the initial malicious file used a defense evasion technique called Time Stomping, where the file creation date is changed to make it appear older and blend in with other files. What was the timestamp changed to for the PDF file?*

We know that the Sysmon Event 2 logs the file creation times. We should be able to look at these logs for a PDF file that looks to be older than it really is.

![Task 4 Image 1](img/Unit%2042%20_HTB-Sherlock_-1749477041249.webp)

Above I have filtered for all the Sysmon Event 2 logs, and we have a list of file creations. Looking at the file creations and their originating process, we can see that the malware created a host of files on the system. The most notable is the only PDF file that was created and logged which is found at `C:\Users\CyberJunkie\AppData\Roaming\Photo and Fax Vn\Photo and vn 1.1.2\install\F97891C\TempFolder\~.pdf`.

![Task 4 Image 2](img/Unit%2042%20_HTB-Sherlock_-1749477321545.webp)

And now looking at the creation time of the PDF file we can see that the creation time logged was **`2024-01-14 08:10:06`**.

![Task 4 Image 3](img/Unit%2042%20_HTB-Sherlock_-1749477402403.webp)

## Task 5

*The malicious file dropped a few files on disk. Where was "once.cmd" created on disk? Please answer with the full path along with the filename.*

In the previous task, we filtered for Sysmon Event 2 logs and we noticed that the malware created a few files on the affected host system. One of which was the PDF file we observed the creation time of, another was this file, `once.md`.

![Task 5 Image 1](img/Unit%2042%20_HTB-Sherlock_-1749477656697.webp)

Looking again at the filtered logs we have an entry for the file creation of `once.md` and we can see the full path in which the file was created. The complete file path is **`C:\Users\CyberJunkie\AppData\Roaming\Photo and Fax Vn\Photo and vn 1.1.2\install\F97891C\WindowsVolume\Games\once.cmd`**.

![Task 5 Image 2](img/Unit%2042%20_HTB-Sherlock_-1749477784992.webp)

## Task 6

*The malicious file attempted to reach a dummy domain, most likely to check the internet connection status. What domain name did it try to connect to?*

This one is simple, in Task 3, we were asked, what cloud service was used to distribute the malware. We observed a timeline of Sysmon Event 22 logs, in which the affected computer attempted to reach two Dropbox domains and also the domain **`www.example.com`**, of which I annotated in the image that it was potentially an attempt for the malware to check for internet connection before downloading more malicious files. I have included the image below.

![Task 6 Image 1](img/Unit%2042%20_HTB-Sherlock_-1749237910904.webp)

![Task 6 Image 2](img/Unit%2042%20_HTB-Sherlock_-1749478083738.webp)

## Task 7

*Which IP address did the malicious process try to reach out to?*

Referencing the Sysmon Event ID, present in the provided log file, we should be able to make use of Sysmon Event 3, which logs data pertaining to a process making a network connection.

![Task 7 Image 1](img/Unit%2042%20_HTB-Sherlock_-1749478469969.webp)

Filtering for Sysmon Event 3 there is only a single log entry, and it is related to the malicious file that was run and infected the host system.

![Task 7 Image 2](img/Unit%2042%20_HTB-Sherlock_-1749478792372.webp)

Scrolling to the payload data and executable info we confirm that the log was for the malicious file, and we also see that the destination IP address the malware was attempting to connect to was, **`93.184.216.34`**.

![Task 7 Image 3](img/Unit%2042%20_HTB-Sherlock_-1749478910040.webp)

## Task 8

*The malicious process terminated itself after infecting the PC with a backdoored variant of UltraVNC. When did the process terminate itself?*

Sysmon Event 5 correlates to the termination of processes. It is safe to assume that if we have any logs for this type of event, that there would be some useful information pertaining to the termination of the malware that infected the host.

![Task 8 Image 1](img/Unit%2042%20_HTB-Sherlock_-1749481917261.webp)

Filtering for Sysmon Event 5 we have a single log entry, of which the executable info for the log entry points to the malicious file from the previous tasks.

![Task 8 Image 2](img/Unit%2042%20_HTB-Sherlock_-1749482222681.webp)

![Task 8 Image 3](img/Unit%2042%20_HTB-Sherlock_-1749482189208.webp)

Now looking at the payload information for this log entry we find the time & date of the process termination, which is **`2024-02-14 03:41:58`**. Note that double clicking on a cell in Timeline Explorer will present the full contents of the cell.

![Task 8 Image 1](img/Unit%2042%20_HTB-Sherlock_-1749482299926.webp)

![Task 8 Image 2](img/Unit%2042%20_HTB-Sherlock_-1749482332059.webp)

## Timeline of Events

- `2024-02-14 03:41:25` - User on the soon-to-be-infected machine downloads malicious file from Dropbox cloud storage using Firefox web browser. Malicious file is named `Preventivo24.02.14.exe.exe`, and is downloaded to the users downloads folder.
- `2024-02-14 03:41:48` - User executes the malicious file. Malware attempts to access `www.example.com`, possibly to test internet connection.
- `2024-02-14 03:41:57` - Malware creates network connection to IP `93.184.216.34`.
- `2024-02-14 03:41:57` - `Preventivo24.02.14.exe.exe` process downloads malicious files and scripts to  `C:\Users\CyberJunkie\AppData\Roaming\Photo and Fax Vn\Photo and vn 1.1.2\install\F97891C\` creating sub-directories as well.
- `2024-02-14 03:41:57` - `Preventivo24.02.14.exe.exe` executes installer  file that was downloaded via the command, infecting the system:
  - `"C:\Windows\system32\msiexec.exe" /i "C:\Users\CyberJunkie\AppData\Roaming\Photo and Fax Vn\Photo and vn 1.1.2\install\F97891C\main1.msi" AI_SETUPEXEPATH=C:\Users\CyberJunkie\Downloads\Preventivo24.02.14.exe.exe SETUPEXEDIR=C:\Users\CyberJunkie\Downloads\ EXE_CMD_LINE="/exenoupdates  /forcecleanup  /wintime 1707880560  " AI_EUIMSI=""`
- `2024-02-14 03:41:58` - `Preventivo24.02.14.exe.exe` deletes all downloaded files, directories, and scripts downloaded from IP address.
- `2024-02-14 03:41:58` -  `Preventivo24.02.14.exe.exe` terminates its process after downloading malicious files from IP address.

## 🔑 Key Takeaways

- **Effective Use of Sysmon Logs**: Understanding Sysmon event IDs is critical for detecting suspicious behavior.
- **PowerShell for Log Analysis**: Leveraging `Get-WinEvent`, filtering of a given log file can be accomplished.
- **Timelining with EvtxECmd & Timeline Explorer**: Parsing `.evtx` files into `.csv` and analyzing them in Timeline Explorer provided a powerful method to sift through and correlate event data.
