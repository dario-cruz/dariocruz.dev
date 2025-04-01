---
slug: Loggy-Sherlock
title: Loggy (HTB-Sherlock)
authors: [dcruz]
tags: [hackthebox, Malware Analysis, Ghidra, FlareVM, strings, grep, reverse engineering]
enableComments: true
---
![Loggy Main Image](img/Loggy%20_HTB-Sherlocks_-1742397926286.webp)
Hey all, it's been a while since my last Sherlock post but rest assured I am still out here studying and learning.🤓 Now let's dive into another investigation.

## Scenario

> Janice from accounting is beside herself! She was contacted by the SOC to tell her that her work credentials were found on the dark web by the threat intel team. We managed to recover some files from her machine and sent them to the our REM analyst.

<!-- truncate -->

## The Files

For this Sherlock we are provided with a zip file that contains some image files taken the users computer, the malicious file in a zip file, and a text file named, keylog.txt.

![File List](img/Loggy%20_HTB-Sherlocks_-1741804463466.webp)

The `danger.txt` file just has some warnings about the malicious windows executable in `danger.zip`. I went ahead and extracted the malicious file onto my Kali Linux VM and took a look at the first task in the Sherlock.

## Task 1

**What is the SHA-256 hash of this malware binary?**

Makes sense that the first objective would be to get the hash of the file. The SHA-256 hash can be used along with [VirusTotal](https://virustotal.com/) to check and see if the file matches with any other known malware samples.

I went ahead and obtained the SHA-256 hash via using the `sha256sum` cli utility, already preinstalled on the Kali Linux VM.

![FIle Hash](img/Loggy%20_HTB-Sherlocks_-1741804778740.webp)

As you can see from the screenshot above the SHA-256 hash of the malicious file, Loggy.exe is **`6acd8a362def62034cbd011e6632ba5120196e2011c83dc6045fcb28b590457c`**.

![Task 1 Flag](img/Loggy%20_HTB-Sherlocks_-1741957189991.webp)

## Task 2

**What programming language (and version) is this malware written in?**

Hmm, okay for this I attempted to use the `strings` utility. The output from running the strings command without any flags/options produced a large number of results. To target this a little more I decided to make use of the `-n` flag which tells `strings` to return only strings of a specific length. I ran the command `strings -n 6 loggy.exe` and took a look at the results.

![Task 2 String Output 01](img/Loggy%20_HTB-Sherlocks_-1741807341782.webp)

As you can see we have a string found in the file stating  `Go Build ID:....`. It looks like this piece of malware may have been written in Golang. I proceeded to run `strings` again, this time using `grep` to filter for `golang`. This also produced a large list of strings that had `golang` contained in them.

![Task 2 String Output 02](img/Loggy%20_HTB-Sherlocks_-1741812910090.webp)

The most notable string found was the one highlighted above. Looks like the malware has a dependency for Golang v0.11.0. I attempted to input this as the task flag but, it was not correct.

### Golang Research

At this point I started to research how Golang is installed on Windows environments. What are the folder paths where the current versions of Golang are installed? Would they be referenced by the malicious software and show up as a string? Only one way to find out. I found [this page](https://go.dev/doc/manage-install), which details how to manage multiple versions of Golang on a system.

I found this line interesting, `go install golang.org/dl/go1.10.7@latest`. It looks like Golang versions are referenced in the `go1.xx.xx` format. We can use this with grep to filter for strings that may contain the version information.

Running the strings utility with grep looking for `go1`, the results returned are of a smaller size and we now know the version of Golang used by the malware, **`go1.22.3`** and the flag of which being **Golang 1.22.3**.

![Task 2 String Ouptut 03](img/Loggy%20_HTB-Sherlocks_-1741813507088.webp)

![Task 2 Flag](img/Loggy%20_HTB-Sherlocks_-1741957162021.webp)

## Task 3

**There are multiple GitHub repos referenced in the static strings. Which GitHub repo would most likely suggest the ability of this malware to exfiltrate data?**

So, we need to look at the GitHub repos that are showing up as strings in our malware sample. While I was scrolling through the strings output during the first tasks, I did see a long list of repos that the malware had in its code. Most likely these are used either to download or upload data for malicious functions.

First command I used to filter for repos was the following.

```bash
strings loggy.exe | grep github
```

Looking at the results, I found some strings that included the url `github.com/jlaffaye/ftp` followed by `*(ServerConn)`, and in some strings `*(dialOptions)`.

![Task 3 Strings Ouptput 01](img/Loggy%20_HTB-Sherlocks_-1741956566130.webp)

I did a google search for the `golang *(ServerConn)` and got the following.
>In Go's `net/http` package, `*(ServerConn)` represents a pointer to the `ServerConn` type. This type is an unexported struct responsible for managing the state of a single client connection on the server-side. It handles tasks such as reading requests, writing responses, and managing the connection's lifecycle.

It's a function in one of the Golang packages that is able to establish and maintain connections. This coupled with the url **`github.com/jlaffaye/ftp`**, indicates that the malware is attempting connections to a remote location which facilitates *data exfiltration*.

![Task 3 Flag](img/Loggy%20_HTB-Sherlocks_-1741957044675.webp)

## Task 4

**What dependency, expressed as a GitHub repo, supports Janice’s assertion that she thought she downloaded something that can just take screenshots?**

The answer to this task, I actually saw in looking for the answer to task 3. There were some GitHub repo strings that referenced `github.com/kbinani/screenshot/internal/util.CreateImage`. Let's use a grep filter and search for strings that contain `screenshot` and take a look.

```bash
strings loggy.exe | grep github | grep screenshot
```

I got the following output confirming the usage of `github.com/kbinani/screenshot`.

![Task 4 String Output 01](img/Loggy%20_HTB-Sherlocks_-1741957606261.webp)

Looking at the Github repo website it explains that it hosts a library that provides *screenshot* functionality in Golang.

![Task 4 Github Repo](img/Loggy%20_HTB-Sherlocks_-1742478276466.webp)

![Task 4 Flag](img/Loggy%20_HTB-Sherlocks_-1741957661565.webp)

## Task 5

**Which function call suggests that the malware produces a file after execution?**

For this task I started off with doing some research on Golang and how it calls functions, leveraging the knowledge that the malware was written in Golang. In most programming languages the syntax for creating a file is normally `write` and may include the word `file`.  I filtered the strings output with the command below:

```bash
strings loggy.exe | grep -i write | grep -i file
```

![Task 5 Strings Output 01](img/Loggy%20_HTB-Sherlocks_-1741959647247.webp)

Looking at the tail end of the output, we can see a few function calls that have `WriteFile` as a part of them but, there is also a standalone string `WriteFile`, this looked to be the function call we are looking for. I entered it in the flag box and it was the answer.

![Task 5 Flag](img/Loggy%20_HTB-Sherlocks_-1741959977351.webp)

## Task 6

**You observe that the malware is exfiltrating data over FTP. What is the domain it is exfiltrating data to?**

The task is pretty straight forward, we need to find the hostname that the FTP function is connecting to and exfiltrating data/images to. I attempted to use grep to filter for a few keywords which included, hostname, IP, target, and address. I started to get the feeling that I was missing something. Looking at what the task asks of you for, we know that the malware is making use of the FTP protocol. The protocol uses the ports 21 and 20. Port 21 being for command/control and port 20 for data transfer. I proceeded to filter the output of the strings command, looking for both ports. Normally when a port is referenced along with an ip or hostname there is a `:`, between the address and the port like `192.168.1.189:21` or `192.168.1.189:20`. I ran the command below, looking for any strings containing `:21`and found the following:

```bash
strings Loggy.exe | grep :21
```

![Task 6 Strings Output](img/Loggy%20_HTB-Sherlocks_-1742241362516.webp)

We are returned a string that contains `gotthem.htb:21`. The domain being **`gotthem.htb`**.

![Task 6 Flag](img/Loggy%20_HTB-Sherlocks_-1742241541273.webp)

## Task 7

**What are the threat actor’s credentials?**

Okay so for this task I attempted to filter for keywords like username, password, pwd, user, usr, etc, but I did not find anything of note. For the next phase of analysis, I went ahead and moved to a Windows VM to use reverse engineering software to complete a deeper analysis.

The Windows VM that I am working in was setup using FlareVM, a really handy tool for creating a malware analysis/reverse engineering platform for investigations. If you want to read more about FlareVM and how to set it up proceed over [here](https://github.com/mandiant/flare-vm) to the official GitHub page.

Here we are in our FlareVM ready to go.

![Task 7 FlareVM](img/Loggy%20_HTB-Sherlocks_-1742313434776.webp)

Lets now check for the presence of credentials in the malware's assembly code. For this task I am making use of a tool called Ghidra, which was created and used by the NSA as a reverse engineering framework.

I proceeded to make a new project and import our malware sample `loggy.exe`. Taking a look a the symbol tree we can see a list of functions that have been auto-named by Ghidra. You can see a host of functions related to FTP functionality, which we know is how the malware is exfiltrating data.

Digging into the functions and their logic, I was able to find a function, `main.sendFilesViaFTP` that referenced the credentials that the malware was using for it's FTP communications, username:`NottaHacker` & password: `Cle@rtextP@ssword`.

![Task 7 Ghidra](img/Loggy%20_HTB-Sherlocks_-1742330029922.webp)

![Task 7 Flag](img/Loggy%20_HTB-Sherlocks_-1742330574338.webp)

## Task 8

**What file keeps getting written to disk?**

Pretty straight  forward question. Lets dive into the disassembled code to get a look at what the malware is writing to the disk. We should also note that the malware sample was provided along with some screenshots what looks to be a keylogger dump file named `keylog.txt`, so these filenames could be an easy entry point to confirm what files are constantly being written.

Diving back into Ghidra I started my search/investigation from the vantage point of the `keylog.txt` file. Looking at the contents of the file it looks like the malware is logging keycodes to this file. In theory, if the malware is indeed logging keystrokes as keycodes to this file, then the malware will have to constantly and continuously write to this file many times over.

![Task 8 Keylog Text](img/Loggy%20_HTB-Sherlocks_-1742390061413.webp)

With this hypothesis in mind I searched for defined strings that contained the filename of `keylog.txt` and got some hits.

![Task 8 Ghidra 01](img/Loggy%20_HTB-Sherlocks_-1742389970110.webp)

The above image shows that the auto named variable `s_keylog.txt_00650309` is storing the string value of `keylog.txt` the variable is also referenced by some functions as well. We can double-click on these functions and follow their execution to discern behavior/actions.

Following on and checking the top function, `main.main:005f325e`, I can see that the variable is accessed and it looks like an OS function is invoked for opening and accessing the file.

![Task 8 Ghidra 02](img/Loggy%20_HTB-Sherlocks_-1742390524507.webp)

Further down the function we can also see what looks to be some error handling logic, in case the malware can not access/write to the `keylog.txt` file. Looks like we might be on the correct path to the answer.

![Task 8 Ghidra 03](img/Loggy%20_HTB-Sherlocks_-1742390643440.webp)

Checking the other two functions `main.sendFilesViaFTP:005f3c64(*)` & `main.sendFilesViaFTP:005f3d91(*)`. They also reference the `keylog.txt` string, before invoking FTP functions, facilitating data exfiltration.

![Task 8 Ghidra 04](img/Loggy%20_HTB-Sherlocks_-1742391020772.webp)

![Task 8 Ghidra 05](img/Loggy%20_HTB-Sherlocks_-1742391054743.webp)

![Task 8 Ghidra 06](img/Loggy%20_HTB-Sherlocks_-1742391077761.webp)

So, with all of this collected data and insight, I went ahead and input `keylog.txt` as the answer to the flag, which was correct.

![Task 8 Flag](img/Loggy%20_HTB-Sherlocks_-1742391181533.webp)

## Task 9

**When Janice changed her password, this was captured in a file. What is Janice's username and password?**

Alright so from the previous task we know that the malware is logging keystrokes to the `keylog.txt` file. We also know that there are keycodes and characters present in the file as well.

I did some searching around for a tool to convert keycodes to characters but, could not find a tool that fit my needs. This is where I turned to ChatGPT to analyze the contents of the `keylog.txt` file and provide some insights/results.

![Task 9 ChatGPT](img/Loggy%20_HTB-Sherlocks_-1742391408637.webp)

ChatGPT provided a nice break down and explanation of the keycodes and their value. It also provided translations of the keycodes, providing text we can use to discern the password logged.

We know that the user's name is `Janice` but, there are a few options presented for her password, `PASSWORD`, `PAAAASASSASSSSSWWWWOOOOORRRRDDDD`, `PASSWORD123`, and `PASSWORD.TTTTTXXXXXTTTTT`. The correct combination being `janice:password123`.

![Task 9 Flag](img/Loggy%20_HTB-Sherlocks_-1742391749137.webp)

## Task 10

**What app did Janice have open the last time she ran the "screenshot app"?**

This task is straightforward. Included in the zip file for the sherlock is a series of 4 image files. Looking at the sequence of images we can see that the user had the `Solitaire` app open the last time she ran the malware.

![Task 10 Screenshot 01](img/Loggy%20_HTB-Sherlocks_-1742393597149.webp)

![Task 10 Screenshot 02](img/Loggy%20_HTB-Sherlocks_-1742393785045.webp)

![Task 10 Screenshot 03](img/Loggy%20_HTB-Sherlocks_-1742394045621.webp)

## Key Takeaways

- [FlareVM](https://github.com/mandiant/flare-vm) is a really good resource for setting up reverse engineering machines. With its comprehensive list of tools and utilities it makes the task of reverse engineering & malware analysis that much more easy.
- `strings` & `grep` can be useful in passive analysis of malware. When used in conjunction they allow for filtering and gathering information about said malware. This facilitates deeper investigation and understanding of malware behavior.
- [Ghidra](https://github.com/NationalSecurityAgency/ghidra) is a reverse engineering framework developed by the NSA. It provides much of the same functionality as another popular tool [IDA](https://hex-rays.com/) , decompiling of Windows Portable Executable files, the ability to see function logic and defined variables, etc. Ghidra is also open-source compared to IDA which is proprietary and has a pro version.
