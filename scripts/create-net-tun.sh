# credit to https://github.com/batlley
# found in issue https://github.com/haugene/docker-transmission-openvpn/issues/1542#issuecomment-753022809

#!/bin/sh

# Create the necessary file structure for /dev/net/tun
if ( [ ! -c /dev/net/tun ] ) then
  if ( [ ! -d /dev/net ] ) then
    mkdir -m 755 /dev/net
  fi
  mknod /dev/net/tun c 10 200
  chmod 0755 /dev/net/tun
fi

# Load the tun module if not already loaded
if ( !(lsmod | grep -q "^tun\s") ) then
  insmod /lib/modules/tun.ko
fi