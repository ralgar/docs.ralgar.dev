---
sidebar_position: 2
---

# Prerequisites

If you want to deploy this project for yourself, there are a few things you
 will need first.

:::info Note

This is an ARM64 compute cluster, so if you have any workloads that are x86_64
 only, you will need to either migrate them, or find another solution.

:::

## Dependencies

These are not strictly necessary for a successful deployment, but will be
 required if you want to administer the cluster or cloud resources from your
 local system.

- [Terraform](https://www.terraform.io/)
- [kubectl](https://kubernetes.io/docs/reference/kubectl/)
- [oci-cli](https://github.com/oracle/oci-cli)
- [Flux CLI](https://fluxcd.io/flux/cmd/)

## Other requirements

- An Oracle Cloud account. [^1]
- A Cloudflare account and domain name. [^2]
- A Pushover account.
- A GitLab account to host your repository, and leverage the CI/CD system.
- A reasonable understanding of the technologies used within this project.

[^1]: Despite the fact that we are only leveraging always free resources, your
 Oracle Cloud account still needs to be on the Pay-as-you-Go (PAYG) tier. The
 reasons for this are twofold. One, it is nearly impossible to provision the
 compute resources from the free tier resource pool. Two, the Kubernetes
 control-plane is not available on the free tier account.

[^2]: You can use another DNS provider if you prefer, but you will need to
 modify the **external-dns** operator's configuration more extensively.
