---
layout: post
title: Canadian banks need open data
date: 2010-12-13 08:00:56.000000000 -05:00
categories:
- Personal Finance
tags:
- authentication
- banking
- Canada
- data
- oauth
- open
- token
meta:
  _edit_last: '1'
  _yoast_wpseo_linkdex: '87'
  _yoast_wpseo_focuskw: banks
  _yoast_wpseo_metadesc: Services like Mint.com allow you to consolidate all of your
    financial information together but there's a security issue and the banks won't
    protect you.
author: Dean Stamler
excerpt_separator: <!--more-->
---
Last week [Mint.com] announced availability in [Canada] and I signed up for an account. After using it for 6 hours, I deleted access to all my online banking accounts and changed all of my online banking passwords.  The banks don't want me to use Mint.
<!--more-->

Mint.com is a fantastic service.  It is intuitive and simple to use, gives you a remarkable bird's-eye view of your financial situation, and makes financial management feel like a strategy game where winning results in tangible real-world rewards.  But it is inherently insecure.  In order to function as advertised Mint.com needs to permanently store your online banking usernames (card numbers) and passwords, often in direct violation of your bank's terms of service.  Mint.com also indemnifies itself of any liability as a result of financial loss and, since you disclosed your online banking password, the banks and financial institutions you've connected do the same.

Fixing this problem is simple.  Banks, and specifically Canadian ones (since that's where I live!), need to open up your data in a secure way.  There is no reason why my bank shouldn't provide read-only, possibly [OAuth] or other token-authenticated, access to all of my account data.  Implementing parallel read-only access to online banking systems is a relatively simple process for the banks and since Mint.com already [scrapes] your data itself the banks don't even need to implement an [API].  Of course an API would be nice since it would make the information-transfer experience more streamlined and dependable, but this isn't immediately necessary to get things going.

In this manner, both Mint.com and the banks could maintain their existing indemnities and the account holders could continue to depend on the bank to be liable for security breaches since the user has not disclosed their password to a third party.

Making a business case for open data on the part of the banks is relatively trivial— users will flock to banks that deliver data.  Banks that have rich APIs to provide access to information (and maybe in the future even APIs for executing transactions) will be praised for their ease of use.  For example, imagine using a simple third-party app on your mobile phone that is token-authenticated to your bank for quick and easy transactions below a certain value.

Open data continues to move the world forward and this will be no different in banking.  I look forward to seeing open data come to Canadian banks.

[Mint.com]:http://www.mint.com/
[Canada]:  http://www.mint.com/canada/
[OAuth]:   http://en.wikipedia.org/wiki/Oauth
[scrapes]: http://en.wikipedia.org/wiki/Web_scraping
[API]:     http://en.wikipedia.org/wiki/Web_api
