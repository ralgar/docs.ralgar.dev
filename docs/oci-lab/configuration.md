---
sidebar_position: 4
---

# Configuration

Now that the Initial Setup is complete, we are ready to begin configuring the
 cluster GitOps directory (`cluster/`) to use your domain, and deploy your
 personal website.

We will begin this process by cloning your forked repository with SSH.

```sh
git clone git@gitlab.com:your-namespace/oracle-cloud-lab.git
```

## External DNS

Firstly, we need to configure the **external-dns** operator so that it can set
 DNS records in your Cloudflare zone.

1. Set the external-dns `zone-id-filter` parameter to the unique ID of your
   Cloudflare zone.

   ```yaml title="cluster/system/external-dns/release.yaml"
   spec:
     # ...
     values:
       # ...
       extraArgs:
         - --zone-id-filter=<your-cloudflare-zone-id>
       # ...
   ```

1. Set the external-dns `hostname` annotation to your domain root.

   ```yaml title="cluster/system/ingress-nginx/release.yaml"
   spec:
     # ...
     values:
       controller:
         # ...
         service:
           annotations:
             # ...
             external-dns.alpha.kubernetes.io/hostname: <your-domain-root>
             # ...
   ```

## Cert Manager

Secondly, we need to configure the Cert Manager LetsEncrypt issuers so that
 they point to your Cloudflare DNS zones.

1. Set the `dnsZones` list for the production issuer to your domain root.

   ```yaml title="cluster/system/cert-manager/lets-encrypt.yaml"
   apiVersion: cert-manager.io/v1
   kind: ClusterIssuer
   metadata:
     name: letsencrypt-production
   spec:
     acme:
       # ...
       solvers:
         - dns01:
           # ...
           selector:
             dnsZones:
               - <your-domain-root>
   ```

1. Do the same for the staging issuer.

   ```yaml title="cluster/system/cert-manager/lets-encrypt.yaml"
   apiVersion: cert-manager.io/v1
   kind: ClusterIssuer
   metadata:
     name: letsencrypt-staging
   spec:
     acme:
       # ...
       solvers:
         - dns01:
           # ...
           selector:
             dnsZones:
               - <your-domain-root>
   ```

## Your website

Finally, we need to configure the deployment of your website. Again, we need
 to set the domain external-dns, and we also need to change the deployment's
 container image since you probably don't want to deploy my blog in your
 cluster.

1. Set the external-dns `hostname` annotation to your domain root, similar to
   the previous section.

   ```yaml title="cluster/apps/blog/ingress.yaml"
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: blog
  namespace: websites
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-production
    external-dns.alpha.kubernetes.io/hostname: &host <your-domain-root>
    # ...
   ```

1. Change the `blog` deployment's container image to your own.

   ```yaml title="cluster/apps/blog/deployment.yaml"
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: blog
     namespace: websites
   spec:
     # ...
     template:
       # ...
       spec:
         # ...
         containers:
           - name: blog
             image: <your-fully-qualified-image-name>:<your-image-tag>
   ```

   :::tip

   If you want to fork or look at the source code for my blog, you can find it
    [here](https://gitlab.com/ralgar/ralgar.dev). It's built using Docusaurus,
    NGINX, and GitLab CI.

   :::
