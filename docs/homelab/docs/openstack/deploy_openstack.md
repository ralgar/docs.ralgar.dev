---
sidebar_position: 1
---

# Deploying OpenStack

If you don't already have an OpenStack cloud available, you can use the
 included `metal/` module to deploy a single-node lab. For multi-node
 labs you will need to modify the included Ansible roles, or follow the
 [Kolla Ansible documentation](https://docs.openstack.org/kolla-ansible/zed/)
 to manually deploy your own.

## Initial Configuration

Before we begin deployment, we need to configure the variables files
 `globals.yml` and `main.yml` in `metal/vars/`.

:::tip

Be sure to set these correctly, otherwise the deployment will not work.

:::

1. Search for the following values in `globals.yml`, and make sure they
   are set correctly.

   ```yaml title="metal/vars/globals.yml"
   # The desired static IP address of the node.
   kolla_internal_vip_address: "192.168.1.11"

   # The network interface that is connected to your local network.
   network_interface: "eno1"

   # The other network interface.
   # This one should NOT have an IP address, and doesn't need a connection.
   neutron_external_interface: "eno2"
   ```

1. Make sure the highlighted values in `main.yml` are set correctly.

   ```yaml title="metal/vars/main.yml"
   ---
   common:
     # Name (path) of the venv, using the root user's home as the base.
     # Ex. A value of 'kolla-venv' will become '/root/kolla-venv'
     venv: kolla-venv

     # Target disk for the root filesystem.
     # highlight-next-line
     root_disk: nvme0n1

     # Path to your SSH pubkey file. This will be used to access the node.
     # highlight-next-line
     ssh_pubkey_file: ~/.ssh/id_ed25519.pub

   network:
     # The hostname to be assigned to the AIO OpenStack node.
     hostname: openstack.homelab.internal

     # A list of two public DNS resolvers to use for the network.
     public_dns_servers: ['1.1.1.1', '1.0.0.1']

     # Desired names (within OpenStack) of your 'public' network and subnet.
     # This network is attached to your LAN.
     public_network_name: public
     public_subnet_name: public

     # CIDR of your LAN subnet.
     # highlight-next-line
     public_subnet_cidr: 192.168.1.0/24

     # The IP address of your LAN gateway (your router).
     # highlight-next-line
     public_subnet_gateway_ip: 192.168.1.254

     # Range of the floating IP address pool for public OpenStack network.
     # This should be OUTSIDE of the DHCP range of your router, and should
     #  NOT include the IP address of your gateway or your OpenStack node.
     # highlight-next-line
     public_subnet_allocation_pool_start: 192.168.1.20
     # highlight-next-line
     public_subnet_allocation_pool_end: 192.168.1.100
   ```

## Installing the host OS

1. Run `00-make-kickstart-iso.yml` to generate an ISO file in `output/`.

   ```sh
   ansible-playbook 00-make-kickstart-iso.yml
   ```

1. Write the ISO file to a USB drive (or use PXE boot), and boot from it.

   ```sh
   dd if=<iso-file> of=/dev/<usb-drive> bs=4M conv=fsync oflag=direct status=progress
   ```

1. Wait for the automated installer to complete (the system will reboot).

1. SSH into your new node, and configure an additonal LVM Volume Group named
   `cinder-standard` on your disk or RAID array.

   ```sh title="Create Cinder volume group"
   # Partition a virtual device / physical disk.
   gdisk /dev/<path-to-vdev>

   # Create a Physical Volume on the partition.
   pvcreate /dev/<path-to-vdev>1

   # Create a Volume Group with the Physical Volume.
   vgcreate cinder-standard /dev/<path-to-vdev>1
   ```

## Deploying OpenStack

1. Run `10-deploy-openstack.yml` against your new node.

   ```sh
   ansible-playbook -i <node-ip-address>, 10-deploy-openstack.yml
   ```

1. Copy `clouds.yaml` to your OpenStack config directory.

   ```sh
   mkdir -p ~/.config/openstack
   cp output/clouds.yaml ~/.config/openstack/clouds.yaml
   ```

## GitLab Runner

This step will deploy a local GitLab Runner, in a Docker container, directly
 on the OpenStack host. This will be used to run CI/CD jobs within your
 network.

:::caution Security Risk

Using a self-hosted runner can potentially be dangerous. If a malicious actor
 were to open a Merge Request containing exploit code, they could potentially
 execute that code on your OpenStack host (and within your network). To counter
 this risk, you should adjust your repository settings so that untrusted users
 cannot run CI jobs without explicit approval.

:::

### Deployment

1. Create a new Runner in your GitLab repository settings, with the tag
   `openstack`, and set the token environment variable on your local system.

   ```sh
   export GITLAB_RUNNER_TOKEN=<your-gitlab-runner-token>
   ```

1. Go back to the *Runners* page, find the ID number of the runner, and set
   the ID environment variable on your local system.

   :::tip Tip

   The ID number will be in the format `#12345678`. Do NOT include the hash
   sign when setting the variable, only the digits.

   :::

   ```sh
   export GITLAB_RUNNER_ID=<your-gitlab-runner-id>
   ```

1. Run `99-gitlab-runner.yml` against your OpenStack host.

   ```sh
   ansible-playbook -i <node-ip-address>, 99-gitlab-runner.yml
   ```

1. Refresh the *Runners* page in GitLab, and make sure your new runner has
   connected.
