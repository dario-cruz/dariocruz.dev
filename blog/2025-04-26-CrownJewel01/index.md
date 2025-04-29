---
slug: CrownJewel1-Sherlock
title: CrownJewel 1 (HTB-Sherlock)
authors: [dcruz]
tags: [hackthebox, Log Analysis, NTDS, VolumeShadowCopy, MFTAnalysis, Windows Forensics, Digital Forensics, Active Directory, EricZimmermanTools,]
enableComments: true
---

![CrownJewel 1 - Main Title](img/CrownJewel%201%20_HTB-Sherlock_-1745940963342.webp)

We are down to the last two Sherlock labs to complete the track **Detecting Active Directory Attacks**. Let's start the next investigation and continue our learning.
<!-- truncate -->

![Active Directory Path](img/CrownJewel%201%20_HTB-Sherlock_-1744036227329.webp)

## Scenario

*Forela's domain controller is under attack. The Domain Administrator account is believed to be compromised, and it is suspected that the threat actor dumped the NTDS.dit database on the DC. We just received an alert of vssadmin being used on the DC, since this is not part of the routine schedule we have good reason to believe that the attacker abused this LOLBIN utility to get the Domain environment's crown jewel. Perform some analysis on provided artifacts for a quick triage and if possible kick the attacker as early as possible.*

Okay so we have some key details from this scenario description of the incident. The domain admin account has been compromised and it is suspected that the threat actor dumped the NTDS.dit database.

I went ahead and looked up some details about NTDS.dit, and found TTP information related to the actions taken in this scenario on the MITRE ATT&CK website: [OS Credential Dumping: NTDS](https://attack.mitre.org/techniques/T1003/003/).

***Attack Details:***

- NTDS File location on domain controller: `%SystemRoot&\NTDS\Ntds.dit`
- NTDS File allows for exporting of AD data base, this allows credential access.
- Built in Windows tool , `ntdsutil.exe` can be used to access database contained in `Ntds.dit` file, as well as PowerShell commands and Python tools.

***Detection:***

- Command Execution on DC: Look for event IDs `4688` & `1(Sysmon)`. Investigate commands targeting `NTDS.dit` file and path.
- File Access: Events `4656` and `4663` (Microsoft Windows Security Auditing). Look for users requesting access to NTDS file or accessing file objects related to NTDS.dit.

Now we are armed with key information about indicators of this type of attack. Let's move on to the provided files.

## The Files

Extracting the provided zip file, we have 3 `.etwv` log files, all of which pertain to a different log provider, coming from the affected DC.

![Files 01](img/CrownJewel%201%20_HTB-Sherlock_-1745414751655.webp)

We also have what looks to be prefetch files taken at the time of attack. This includes the `$MFT` file, which includes all the file permissions and actions that have taken place on the system since Windows install.

![Files 02](img/CrownJewel%201%20_HTB-Sherlock_-1745414769147.webp)

We will probably be using Eric Zimmerman's tool suite, which includes tools like `MFTCmd` and `Timeline Explorer` to investigate changes to files on the system at the time of the incident.

## Task 1

*Attackers can abuse the vssadmin utility to create volume shadow snapshots and then extract sensitive files like NTDS.dit to bypass security mechanisms. Identify the time when the Volume Shadow Copy service entered a running state.*

### Volume Shadow Service

VSS or volume shadow service is a backup mechanism present in later versions of the Windows OS, it allows for automatic incremental backup of all files on a given disk or partition. It's common for organizations to enable the service as a way to mitigate the effects of Malware and Ransomware, providing a snapshot to restore a system to, in the event that an incident of this type takes place.

Threat actors have taken note of this behavior, so it is common for threat actors to target and attempt to delete volume shadow copies and disable the service entirely.
[^1]
[^1]: https://blogs.vmware.com/security/2022/09/threat-report-illuminating-volume-shadow-deletion.html
In this case the threat actors are taking advantage of the service to gain access to sensitive files. They have enabled the VSS service, so it is wise to look for events the pertain to the starting of the VSS service.

Doing some research as to the event IDs associated with the starting of services and also the starting of the VSS service specifically, I found the following:

- `7036` - Service has entered a state *(Starting, Stopping, Paused, Resumed)*
- `8224` - VSS Service shutdown due to timeout.
- `8225` - VSS Service shutdown due to Service Control Manager event.

### Log Analysis

First, I will open the `SYSTEM.evtx` file as service changes (Event 7036) are logged there. Looking at the logs we can see a lot of events pertaining to the changing of service statuses.

![Log Analysis 01](img/CrownJewel%201%20_HTB-Sherlock_-1745415461505.webp)

Scrolling through the logs, I found an entry for the VSS starting at `11:42 PM` on `May 13th 2024`. Take note that this timestamp is in my local time so for the flag and most HTB flags, the time and date need to be converted to UTC.

![Log Analysis 02](img/CrownJewel%201%20_HTB-Sherlock_-1745415561908.webp)

Converting the time and date to UTC I got the task flag, which is **`2024-05-14 03:42:16`**.

![Task 1 Flag](img/CrownJewel%201%20_HTB-Sherlock_-1745416559728.webp)

## Task 2

*When a volume shadow snapshot is created, the Volume shadow copy service validates the privileges using the Machine account and enumerates User groups. Find the two user groups the volume shadow copy process queries and the machine account that did it.*

Let's focus our attention to what events would be generated in this event. The shadow copy service should generate some sort of event for the action of a snapshot being created. After completing some research I found the following events to be of interest:

- `8226` - VSS successful creation of snapshot.
- `12289` - Detailed information about stages of the snapshot process.
- `12292` - Detailed Information about writer components used during snapshot creation.

I looked through the SYSTEM event logs but, did not find anything related to these event IDs. Looking at the SECURITY event logs provided did produce some insight. Around the same time that the Volume Shadow Copy service was started there are events pertaining to Event ID `4799`, which logs enumeration of members of a security-enabled group. Also, the log details state that the originating process is `VSSVC.exe`, which is the Volume Shadow Copy service.

![Task 2 VSS Logs](img/CrownJewel%201%20_HTB-Sherlock_-1745508093233.webp)

There are eight logs in total that are related to enumeration, coming from the Volume Shadow Copy process. They all make use of the account name **`DC01$`** and the user groups that were targeted were, **`Administrators`**, and **`Backup Operators`**.

![Task 2 Logs 02](img/CrownJewel%201%20_HTB-Sherlock_-1745508337417.webp)

Putting these groups in the order in which they were used and in the flags requested format, we get **`Administrators, Backup Operators, DC01$`**, which is confirmed to be the task flag.

![Task 2 Flag](img/CrownJewel%201%20_HTB-Sherlock_-1745508585553.webp)

## Task 3

*Identify the Process ID (in Decimal) of the volume shadow copy service process.*

This information can be gathered from the same set of logs from Task 2. In the log details the process ID of the Volume Shadow Copy service is **`0x1190`**.

![Task 3 Logs 01](img/CrownJewel%201%20_HTB-Sherlock_-1745508772402.webp)

The value is in Hexadecimal, so we have to convert it. Converting it to decimal we get a value of **`4496`**, which is the task flag.

![Task 3 Flag](img/CrownJewel%201%20_HTB-Sherlock_-1745509011047.webp)

## Task 4

*Find the assigned Volume ID/GUID value to the Shadow copy snapshot when it was mounted.*

For this task we should focus our attention on the NTFS log file provided. Events related to the mounting and unmounting of volumes should be logged there and provide the needed insight to obtain the task flag. Again the start of the Volume Shadow Copy process happened at *5/13/2024 11:42:16 PM EST* or *5/14/2024 03:42:16 AM UTC*, so we should look for mount events after this time.

Looking through the logs we can see and event 4 at 5/13/2023 11:44:22 PM EST, which signifies a volume mount operation. This took place a few minutes after the start of the shadow copy service.

The log details provide a `Volume correlation ID`, which is used by the service to track the creation of snapshots.  This is also the value that we are looking for.

![Task 4 Logs](img/CrownJewel%201%20_HTB-Sherlock_-1745511044770.webp)

The Volume correlation ID being: **`{06c4a997-cca8-11ed-a90f-000c295644f9}`**.

![Task 4](img/CrownJewel%201%20_HTB-Sherlock_-1745518969703.webp)

## Task 5

*Identify the full path of the dumped NTDS database on disk.*

In the very start of this lab, I detailed out the list of files that we where given as a part of the investigation. Inside of the Artifacts folder and further once more into the C folder, we can see that we have an `$MFT` file. This is the master file record, which is a database present on NTFS systems. It contains file attributes such as time of creation, time of last edit, etc, and is an invaluable artifact to have when investigating security incidents which would have involved some sort of file manipulation.

In order to read the MFT file and view the attributes, I will be making use of a popular tool created by Eric Zimmerman, called MFT Explorer. The tool has a well laid out interface so that we can navigate through all the file data/attributes stored. Below I have loaded the MFT file into the tool.

![MFT Explorer 01](img/CrownJewel%201%20_HTB-Sherlock_-1745519896111.webp)

In the above you can see that we have a similar file/folder structure to a normal windows explorer view but, we also have a hex view and a details pane. Where do we go from here? Where would the `ntds.dit` file be stored? Well, we have a few clues from the previous tasks. We know that the Administrators group was enumerated when VSS made a shadow copy. Looking at the users folder, the only user account of note is Administrator. Digging into the Administrator accounts user folder, I checked the desktop, downloads, and documents folder. The documents folder has an folder in it that had an interesting name, `backup_sync_dc`.

![MFT Explorer 02](img/CrownJewel%201%20_HTB-Sherlock_-1745520294560.webp)

Also, in the above image you can note that the time lines up with the timeline of events that we have observed so far. Timeline Explorer shows all times and dates in UTC. The time of folder creation was `05-14-2024 03:38:46`, which was a few minutes after the Volume Shadow Copy service was started.

Navigating into the folder, we can see an `ntds.dit` file. These files normally do not reside inside of user folders so, this file being here is abnormal. Also, just like the folder, the creation time is in line with the events that have been observed.

![MFT Explorer 03](img/CrownJewel%201%20_HTB-Sherlock_-1745520552812.webp)

The full path to the database/file being **`C:\Users\Administrator\Documents\backup_sync_dc\ntds.dit`**.

![Task 5 Flag](img/CrownJewel%201%20_HTB-Sherlock_-1745520637914.webp)

## Task 6

*When was newly dumped ntds.dit created on disk?*

Taking another look at the image below note the creation time of the file. The time and date are already in UTC time, so no need to convert it.

![Task 6 Log 01](img/CrownJewel%201%20_HTB-Sherlock_-1745520761151.webp)

Hack the box asks for the flag to be in YYYY-MM-DD HH:MM:SS format, so the complete flag is: **`2024-05-14 03:44:22`**.

![Task 6 Flag](img/CrownJewel%201%20_HTB-Sherlock_-1745520897735.webp)

## Task 7

*A registry hive was also dumped alongside the NTDS database. Which registry hive was dumped and what is its file size in bytes?*

In the same folder as the `ntds.dit` file there is also a file with no file extension, called `SYSTEM`. Inside of the MFTExplorer application there are no details about the size of this file. I opted to convert the MFT file into `.csv` format, using MFTCmd, also another of Eric Zimmerman's tools. I learned about Eric's suite of forensic tools while completing the module *Intro to Digital Forensics* as a part of my learning for the HTB-CDSA.

![Task 7 - PowerShell](img/CrownJewel%201%20_HTB-Sherlock_-1745848013959.webp)

After conversion I opened up the file with Time Line Explorer and filtered for the folder path that both files resided in.

![Task 7 - Logs](img/CrownJewel%201%20_HTB-Sherlock_-1745847983048.webp)

From the image above you can see that the `SYSTEM` file is found in the directory, also we can see that the file size information is present in bytes. The complete flag being **`SYSTEM, 17563648`**.

![Task 7 Flag](img/CrownJewel%201%20_HTB-Sherlock_-1745848309201.webp)
