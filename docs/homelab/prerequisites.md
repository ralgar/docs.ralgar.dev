---
sidebar_position: 2
---

# Prerequisites

If you want to deploy this project for yourself, there are a few things you'll
 need.

## Dependencies

- [Ansible](https://www.ansible.com/)
  - [python-netaddr](https://pypi.org/project/netaddr)
- [Terraform](https://www.terraform.io/)
- [Packer](https://www.packer.io/)
- [kubectl](https://kubernetes.io/docs/reference/kubectl/)

## Initial Setup

1. Install the required [dependencies](#dependencies) on your local system.

1. Sign in to your GitLab account, and
   [fork](https://gitlab.com/ralgar/homelab/-/forks/new) my repository.

1. Clone your fork to your local system, and change directory into it.

   ```sh
   git clone https://gitlab.com/<your-namespace>/homelab.git
   cd homelab
   ```

## Other requirements

- A reasonable understanding of the technologies used within this project.
- A dedicated physical host, with the following minimum requirements:

  | CPU        | Memory    | Storage                       | Network      |
  |------------|-----------|-------------------------------|--------------|
  | 24 threads | 64 GB RAM | 1x 1 TB NVMe + 1x HDD array   | 2x 1 GbE NIC |
