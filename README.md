
# Table of contents

1. [General setup](#general-setup)
    * [Get SSH working](#get-ssh-working)
    * [Get the M2 NVME working as a storage pool](#get-the-m2-nvme-working-as-a-storage-pool)
    * [Get the USB drivers](#get-the-usb-drivers)
    * [Setting up Docker](#setting-up-docker)
2. [Setting up HASS project](#setting-up-hass-project)
    * [Setting up directories for the project](#setting-up-directories-for-the-project)
    * [**(Optional)** Getting OAuth key for Tailscale VPN](#optional-getting-oauth-key-for-tailscale-vpn)
    * [Setting up Mosquitto with authentication](#setting-up-mosquitto-with-authentication)
    * [Setting up Zigbee2MQTT](#setting-up-zigbee2mqtt)
    * [Setting up Home Assistant](#setting-up-home-assistant)
3. [Troubleshooting](#troubleshooting)
    * [Bind mount failed: '/dev/net/tun' does not exist*](#bind-mount-failed-devnettun-does-not-exist)
    * [Mosquitto: Unable to open pwfile](#mosquitto-unable-to-open-pwfile)

# General setup

## Get SSH working

1. Control Panel
2. Terminal & SNMP
3. Enable SSH
4. (Optional) Set port

## Get the M2 NVME working as a storage pool

1. Connect via SSH
2. Go to [https://github.com/007revad/Synology_M2_volume]
3. `mkdir` new directory anywhere to store downloaded files
4. `wget` newest release
5. Unpack `*.tar.gz` with `tar -xvzf <filename>`
6. Run the script
7. Everything else is explained on screen

## Get the USB drivers

USB drivers are needed for example for Zigbee2MQTT adapters to function and be discovered properly when connected to Synology NAS.

1. Look up CPU architecture your nas uses [https://kb.synology.com/en-uk/DSM/tutorial/What_kind_of_CPU_does_my_NAS_have]
2. Check your DSM version Control Panel => Info Center
3. Download modules for your CPU architecture and DSM version from [https://github.com/robertklep/dsm7-usb-serial-drivers] as described in README

## Setting up Docker

1. Package Center
2. Find and install Container Manager

# Setting up HASS project

This part of the guide refers to the [HASS docker-compose](https://github.com/marchewiczd/synology-docker-guides/blob/master/docker-compose-files/HASS_docker-compose.yaml) and [HASS with VPN docker-compose](https://github.com/marchewiczd/synology-docker-guides/blob/master/docker-compose-files/HASS_with_VPN_docker-compose.yaml)

## Setting up directories for the project

This step won't cover the whole setup, as it is the same for every single service.
Generally there are two types of situations: folders with dot at the beginning (`./tailscale/state`) or folders with slash at the beginning (`/dev/net/tun`). Folders with dot refer to the current directory - for example if you created your docker compose in `/volume1/docker/hass/` then it will refer to that path and keep going from there, so `./tailscale/state` becomes `/volume1/docker/hass/tailscale/state`. On the other hand `/dev/net/tun` goes exactly where it says.

Using Tailscale as an example:

1. `./tailscale/state` create folder `tailscale` and folder `state` inside `tailscale` starting from where your `docker-compose.yaml` is created, e.g. as shown above `/volume1/docker/hass/tailscale/state`
2. Same goes for `./tailscale/config`
3. `/dev/net/tun` should already exist and shouldn't be tampered with unless there's a problem, in that case go to [*Troubleshooting: Bind mount failed: '/dev/net/tun' does not exist*](#bind-mount-failed-devnettun-does-not-exist)

## **(Optional)** Getting OAuth key for Tailscale VPN

You can skip this step and remove Tailscale service from docker-compose if you do not want to use VPN.

1. First get tailscale OAuth key from your Tailscale account [https://login.tailscale.com/admin/settings/oauth]
2. Click Generate OAuth client to start creating the key
3. Select write for devices
4. Add tag:container for tags
5. Click generate client to create your OAuth key
6. Save auth key and replace it in docker compose - **!IMPORTANT!** this is your only chance to save this key if you lose it you will have to create a new one!

## Setting up Mosquitto with authentication

1. Create config file in `/mosquitto/config` named `mosquitto.conf` with below content:

``` persistence true
persistence_location /mosquitto/data/
log_dest file /mosquitto/log/mosquitto.log
log_type all
allow_anonymous true
listener 1883
```

2. Run just the mosquitto container
3. Enter container using `docker exec -it mosquitto-mqtt-broker /bin/sh`
4. Create password file with `mosquitto_passwd -c /mosquitto/config/password.txt <user>`
5. Stop container and update config file:

``` persistence true
persistence_location /mosquitto/data/
log_dest file /mosquitto/log/mosquitto.log
log_type all
allow_anonymous false
password_file /mosquitto/config/password.txt
listener 1883
```

## Setting up Zigbee2MQTT

1. Create config file in `./zigbee2mqtt/data/` named `configuration.yaml` with below content:

``` homeassistant: true
frontend: true
mqtt:
  base_topic: <topic_name>
  server: mqtt://<container_name/service_name>
  user: <mosquitto_user>
  password: <mosquitto_password>
serial:
  port: /dev/ttyACM0
advanced:
  homeassistant_legacy_entity_attributes: false
  legacy_api: false
  legacy_availability_payload: false
device_options:
  legacy: false
```

## Setting up Home Assistant

1. Start the container
2. Go to `http://<NAS_address>:8124`
3. Finish setup
4. Go to Integrations (Settings -> Devices & Services -> Integrations Tab)
5. Add MQTT integration (Add integration -> MQTT -> MQTT)
6. Broker: `mqtt`, port: `1883`, username: `<mosquitto_user>`, password: `<mosquitto_password>`
7. Everything should be able to communicate between each other

# Troubleshooting

## Bind mount failed: '/dev/net/tun' does not exist

Use `create-net-tun.sh` script. It creates `/dev/net` directory and `/dev/net/tun` file. At the end it does `insmod`. If there's a problem running it try converting line endings to UNIX. Remember to add it to startup so you don't have to run it every single time NAS is restarted.

## Mosquitto: Unable to open pwfile

Most likely access permissions are incorrect for the files and/or directories. Simply using `chmod` command on everything in `/mosquitto/config/password_file` should fix the problem.
