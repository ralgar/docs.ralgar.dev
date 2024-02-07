---
sidebar_position: 1
---

# Overview

By following the DevOps and GitOps paradigms, I am able to completely
 automate the provisioning, deployment, and operation of this website by
 leveraging always free resources in Oracle Cloud.

Check out the [code repository](https://gitlab.com/ralgar/oracle-cloud-lab),
 and read on for setup instructions.

## Project Features

- [x] 2x 2vCPU / 12GB ARM64 worker nodes.
- [x] Fully automated cluster provisioning via Terraform and GitLab CI.
- [x] Continuous Deployment of cluster applications using
      [Flux](https://fluxcd.io/flux).
- [x] Monitoring system based on Prometheus and Grafana.
- [x] Alerting system integrated with [Pushover](https://pushover.net).
- [ ] Coming soon: GitLab runner with persistent object storage.
- [ ] Coming soon: Automatic snapshots and backups.
