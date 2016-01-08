---
layout: post
title: Install Vagrant on Debian
comments: true
tags: [vagrant]
---

Here is a few tips to make sure Virtualbox builds smoothly.

**Install linux headers for your system**

```
sudo apt-get install build-essential libssl-dev linux-headers-`uname -r`
```

**Install dkms module**

```
sudo apt-get install dkms
```

**Install Virtualbox**

Use their website download as the repo may be out of date

```
wget http://download.virtualbox.org/virtualbox/4.3.26/virtualbox-4.3_4.3.26-98988~Debian~wheezy_amd64.deb
dpkg -i virtualbox-4.3_4.3.26-98988~Debian~wheezy_amd64.deb
```

**Note:** If you get a dependency error, try running this then try installing
Virutalbox

```
sudo apt-get -f install
dpkg -i virtualbox-4.3_4.3.26-98988~Debian~wheezy_amd64.deb
```


