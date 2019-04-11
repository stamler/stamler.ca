---
layout: post
title: AWS Storage Gateway and NTFS permissions for SMB sharing
date: 2018-09-01 11:49:00.000000000 -05:00
categories:
- IT
tags:
- aws
- ntfs
- permissions
- smb
- file sharing
meta:
  _wpas_done_all: '1'
  _jetpack_dont_email_post_to_subs: '1'
  _thumbnail_id: '457'
  _publicize_twitter_user: "@dstamler"
author: Dean Stamler
excerpt: AWS Storage Gateway can expose an S3 bucket as an SMB share, but permissions behaviour can be confusing. Here's an explanation. 
excerpt_separator: <!--more-->
---
TL;DR _RID portion of Windows SID + 66666 = POSIX ID assigned by Storage Gateway_

[AWS Storage Gateway](https://aws.amazon.com/storagegateway/) for Files is a front-end for [Amazon S3](https://aws.amazon.com/s3/), delivered as a VM appliance, that exposes either an NFS or an SMB file share. This exposed share is cached at the storage gateway (the VM) so that subsequent hits to the share pull cached data rather than S3, minimizing requests. It also invisibly uploads and files written to the share to blobs on S3. This is particularly useful for storing archival data, however S3 itself doesn't have any mechanism for storing granular user/group/everybody permissions. Each object in an S3 bucket can follow that bucket's permissions, but these are not exposed to the exported share. Instead, metadata attached to each S3 object is the definitive authority of permissions exported in the file share, whether NFS or SMB.

On write, the following metadata is added to each BLOB.

- x-amz-meta-file-group (posix-style gid)
- x-amz-meta-file-owner (posix-style uid)
- x-amz-meta-file-permissions (posix-style permissions correlating to uid, gid, and Everybody)

### Mapping SID to Posix for AWS Gateway

So how does the storage gateway assign these permissions to S3 blobs when the files are written to the gateway? To undertand the answer to this question, we look to the way that Windows [maps POSIX identifiers](https://docs.microsoft.com/en-us/windows/desktop/secmgmt/mapping-posix-identifiers).

Storage Gateway assigns group and user values by using the SID in a Windows environment added to an offset. After testing, I discovered that __Storage Gateway uses an offset of 66666__ to the RID part of the SID of an object to get a mapped POSIX ID which is stored as metadata on the S3 bucket.

For example, if a domain user has an SID of S-1-5-21-&lt;domainSID&gt;-513 this would map to 67179 as the POSIX ID.

Please note that not all Posix ID translations make use of a TrustedDomain object per the above article. The following table shows SIDs that are mapped using well-known offset values.

| Source | POSIX ID offset |
| --- | --- |
| SIDs from the built-in domain | 0x20000 |
| SIDs from the account domain | 0x30000 |
| SIDs from the primary domain (on Workstations only)| 0x40000 |
