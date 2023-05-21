---
sidebar_position: 1
---

# Overview

By following the GitOps paradigm, I am able to completely automate the
 provisioning, deployment, and operation of my homelab.

## Project Features

### OpenStack Host Management

- [x] Builds a self-installing Rocky Linux ISO.
- [x] Provides Ansible roles for deploying a single-node OpenStack cloud.
- [x] Optional: Provides a GitLab Runner for infrastructure CI/CD jobs.

### Production Server

- [x] Media server platform, with requests and automated acquisitions.
- [x] Home automation platform, easily integrated with the media platform.
- [x] Automated infrastructure provisioning, and application deployment.
- [x] Leverages Podman containers, and SELinux, for isolation.
- [x] Automatic OS and application container updates.
- [x] Automatic, incremental backups.

### Kubernetes Cluster (in development)

- [x] Fully automated cluster provisioning, integrated with GitLab CI.
- [x] Continuous Deployment of applications, using
      [Flux](https://fluxcd.io/flux).
- [x] Monitoring system based on Prometheus and Grafana.
- [x] Optional: Highly available control plane.
- [ ] Coming soon: Automatic horizontal scaling.
- [ ] Coming soon: Automatic snapshots and backups.
