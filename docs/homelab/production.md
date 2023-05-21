---
sidebar_position: 4
---

# Production Server

The Production environment is a single instance that runs on Fedora CoreOS.
 It's designed to be simple, secure, and low maintenance.

:::note

The production environment is currently difficult to deploy, and does not have
 full CI/CD integration. The reason for this is because local modifications
 must be made to the OpenStack Terraform provider until an upstream issue is
 fixed.

See the instructions below for patching the provider.

:::

## Deployment

### Patching the provider

This is a temporary workaround for an issue that needs to be fixed upstream.

1. Clone the OpenStack Terraform provider repository.

   ```sh
   git clone https://github.com/terraform-provider-openstack/terraform-provider-openstack
   ```

1. Create a patch file in the repository root with the following content.

   ```patch title="terraform-provider-openstack/microversion-fix.patch"
   From bbd9bed1bd91483233cbf8abe659aa9703d71ef1 Mon Sep 17 00:00:00 2001
   From: Ryan Algar <59636191+ralgar@users.noreply.github.com>
   Date: Sat, 20 May 2023 10:57:44 -0700
   Subject: [PATCH] Fix: Multiattach microversion error

   ---
    GNUmakefile                                         | 4 +++-
    openstack/resource_openstack_compute_instance_v2.go | 8 +-------
    2 files changed, 4 insertions(+), 8 deletions(-)

   diff --git a/GNUmakefile b/GNUmakefile
   index bf6306cd..d5bd2436 100644
   --- a/GNUmakefile
   +++ b/GNUmakefile
   @@ -7,6 +7,9 @@ default: build

    build: fmtcheck
       go install
   +	mkdir -p ~/.terraform.d/plugins/terraform.local/openstack/1.51.1-test/linux_amd64
   +	mv ~/go/bin/terraform-provider-openstack \
   +		~/.terraform.d/plugins/terraform.local/openstack/1.51.1-test/linux_amd64

    test: fmtcheck
       go test -i $(TEST) || exit 1
   @@ -57,4 +60,3 @@ endif
       @$(MAKE) -C $(GOPATH)/src/$(WEBSITE_REPO) website-provider-test PROVIDER_PATH=$(shell pwd) PROVIDER_NAME=$(PKG_NAME)

    .PHONY: build test testacc vet fmt fmtcheck errcheck test-compile website website-test
   -
   diff --git a/openstack/resource_openstack_compute_instance_v2.go b/openstack/resource_openstack_compute_instance_v2.go
   index 09ca7109..5cce050c 100644
   --- a/openstack/resource_openstack_compute_instance_v2.go
   +++ b/openstack/resource_openstack_compute_instance_v2.go
   @@ -554,13 +554,7 @@ func resourceComputeInstanceV2Create(ctx context.Context, d *schema.ResourceData
               return diag.FromErr(err)
           }

   -		// Check if VolumeType was set in any of the Block Devices.
   -		// If so, set the client's microversion appropriately.
   -		for _, bd := range blockDevices {
   -			if bd.VolumeType != "" {
   -				computeClient.Microversion = computeV2InstanceBlockDeviceVolumeTypeMicroversion
   -			}
   -		}
   +		computeClient.Microversion = computeV2InstanceBlockDeviceVolumeTypeMicroversion

           createOpts = &bootfromvolume.CreateOptsExt{
               CreateOptsBuilder: createOpts,
   --
   2.40.0
   ```

1. Checkout tag `v1.51.1`, and apply the patch against it.

   ```sh
   git checkout v1.51.1
   git apply microversion-fix.patch
   ```

1. Build the provider using the included `GNUmakefile`.

   ```sh
   make
   ```

1. Create a `~/.terraformrc` with the following content, allowing for the
      installation of local providers.

   ```hcl title="~/.terraformrc"
   // Allow for installation of local providers.
   // Ex. openstack = { source = "terraform.local/local/openstack }
   provider_installation {
     filesystem_mirror {
       path    = "/home/<your-user>/.terraform.d/plugins"
     }
     direct {
       exclude = ["terraform.local/*/*"]
     }
   }
   ```

### Deploying the server

1. Create a `terraform.tfvars` file in the `infra/envs/prod` directory.

   ```hcl title="infra/envs/prod/terraform.tfvars"
   restic_password = "<your-restic-repository-password>"

   // See https://rclone.org/drive for setup documentation.
   // NOTE: All double quotes within the token JSON string must be escaped.
   gdrive_oauth = {
     client_id = "<your-gdrive-client-id>"
     client_secret = "<your-gdrive-client-secret>"
     token = "<your-gdrive-oauth-token>"
     root_folder_id = "<your-gdrive-root-folder-id>"
   }
   ```

1. Use the included `Makefile` to provision the server.

   ```sh
   make prod
   ```

## Configure the services

After the initial deployment, you will need to manually configure each of the
 services.

1. SSH into the running production instance.

   ```sh
   ssh core@<server-ip-address>
   ```

2. Head to the `/srv` directory, where the configurations are stored.

   ```sh
   cd /srv
   ```

### Media Frontend

There are two services make up the frontend of the media server stack -
 **Jellyfin** and **Jellyseerr**.

#### Jellyfin

Excellent documentation on configuring Jellyfin can be found on the
 [Jellyfin Docs](https://jellyfin.org/docs) page.

#### Jellyseerr

Configuring Jellyseerr is fairly straightforward, just follow the interactive
 setup wizard.

### Media Backend

There are four services that make up the backend of the media server stack -
 **Prowlarr**, **Radarr**, **Sonarr**, and **NZBGet**. These services work
 in unison to search and acquire media from the internet sources that you
 configure.

Excellent documentation on **Prowlarr**, **Radarr**, and **Sonarr** can be
 found on the [Servarr Wiki](https://wiki.servarr.com).

Excellent documentation for **NZBGet** can be found on the
 [NZBGet Docs](https://nzbget.net/documentation) page.

### Home Automation

The home automation stack is comprised of **Home Assistant**, and
 **Mosquitto**. Both are relatively easy to configure.

#### Home Assistant

To configure **Home Assistant**, it is recommended that you visit the
 [Home Assistant docs](https://www.home-assistant.io/docs) page.

#### Mosquitto

To configure **Mosquitto**:

1. Generate a password file for the Mosquitto MQTT broker.

   ```sh
   printf "mqtt:$(openssl passwd -6)" > /srv/mosquitto/passwd
   ```

1. Create `/srv/mosquitto/mosquitto.conf` with the following content.

   ```sh title="/srv/mosquitto/mosquitto.conf"
   listener 1883
   password_file /mosquitto/config/passwd
   log_dest stdout
   ```
