---
layout: post
title: Passwordless OpenSSH on Windows 10 and Server 2019
date: 2020-04-16 12:00:56.000000000 -05:00
categories:
- IT
tags:
- authentication
- windows
- openssh
meta:
  _edit_last: '1'
  _yoast_wpseo_linkdex: '87'
  _yoast_wpseo_focuskw: openssh
  _yoast_wpseo_metadesc: Windows 10 version 1809 and Windows Server 2019 can both install OpenSSH as a supported feature, but there are some caveats
author: Dean Stamler
excerpt_separator: <!--more-->
---
Windows 10 version 1809 and Windows Server 2019 can both install OpenSSH as a [supported feature][install] using both PowerShell or the GUI.
<!--more-->

Of course there are some quirks. The first is that while most users would expect to have their `authorized_keys` in `C:\Users\%u\.ssh\authorized_keys`, this isn't the case for users in the Administrators group, including Domain Admins. For these users, the default `sshd_config` expects all admins to share an `authorized_keys` file called `administrators_authorized_keys` found in `C:\ProgramData\ssh\`. The rationale is explained [here][rationale] (and other places I'm sure). This causes unexpected behaviour in configuring Windows for OpenSSH management. Fixing this is easy. Simply edit `C:\ProgramData\ssh\sshd_config` and comment out the following lines:

```ascii
Match Group administrators
      AuthorizedKeysFile __PROGRAMDATA__/ssh/administrators_authorized_keys
```

Once those lines are commented and you've restarted the OpenSSH server, your keys will work. I recommend you read the above link, however, to ensure that you're familiar with why the decision was made in the default configuration. It's related to [UAC][uac].

There's one more thing though, and that's the permissions of the `.ssh` folder and the `authorized_keys` file in it. You must set them precisely as follows: `SYSTEM` and the user must have full permissions, with no other entries in the ACL. Just two entries for both the containing .ssh folder and all contents. That's it! Now you've got passwordless OpenSSH on Windows.

[install]:https://docs.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse
[rationale]:https://github.com/PowerShell/Win32-OpenSSH/issues/1324
[uac]:https://docs.microsoft.com/en-us/windows/security/identity-protection/user-account-control/how-user-account-control-works
