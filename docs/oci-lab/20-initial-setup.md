---
sidebar_position: 3
---

# Initial Setup

These instructions will guide you through everything you need to prepare for
 deployment of your free Kubernetes cluster in Oracle Cloud.

You will need to make note of a variety of credentials throughout this process,
 which we will use in the final step. I suggest storing them in a temporary
 text file, and then delete it when you are finished.

## Oracle Cloud

Oracle Cloud (OCI) will be our cloud infrastructure provider for this
 project. It boasts a very generous selection of **always free** services,
 which includes a Kubernetes control-plane, and enough ARM64 compute for two
 worker nodes.

As stated on the previous page, you will require an Oracle Cloud account on
 the Pay-as-you-Go (PAYG) tier. The reason we must use the PAYG tier is because
 it is extremely difficult to provision compute resources from the free tier,
 and because the Kubernetes control-plane is not available for provisioning
 from the free tier. Note that you shouldn't actually accrue any cloud bills,
 as we are only leveraging the always free resources for this project.

Once you have created your Oracle Cloud account, and upgraded to the PAYG tier,
 follow the instructions below to generate API credentials for deployment. You
 can also reference the [Oracle Cloud documentation](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/terraformproviderconfiguration.htm)
   for more information on this process.

1. Sign in to your account, and go to your **Profile**.

1. Go to **API Keys**, and select **Add API key**.
   - Select the default option **Generate API key pair**.
   - Select **Download API key**.
   - Select **Add**.
   - **Copy** the **configuration file preview**, and make note of it in your
     temporary file.
   - Select **Close**.

1. Optional: Using the configuration file snippet, and the path to the private
   key that you downloaded, create `~/.oci/config` to use with the OCI command
   line interface.

## Cloudflare

For this project we will use Cloudflare as our DNS provider. Cloudflare also
 offers a very generous selection of free services, and is supported by the
 **external-dns** operator that we will deploy in the cluster.

1. Sign into your Cloudflare account, go to your **Profile**, and then go to
   **API Tokens**.

1. Select **Create Token**, and then **Create Custom Token**.
   - For **Token name**, enter any name that you like.
   - For **Permissions**, select *Zone >> DNS >> Edit*.
   - For **Zone Resources**, select *Include >> Specific zone >> Your-Domain*.
   - Select **Continue to summary**, and then **Create Token**.
   - **Copy** your new API token, and make note of it in your temporary file.

## Pushover

Pushover is a cost-effective notification service that offers lifetime use of
 its API for as little as $5. We will be leveraging this service to reliably
 send alerts from our cluster's monitoring system directly to an Android or
 Apple device of our choosing.

1. Sign in to your Pushover account.

1. Copy your **User Key**, and make note of it in your temporary file.

1. Follow this [clone application](https://pushover.net/apps/clone/prometheus)
   link to automatically configure Prometheus in Pushover.
   - Check the box that says you have read the Terms of Service.
   - Select **Create Application**.
   - Copy the **API Token**, and make note of it in your temporary file.

:::info

If you prefer not to use Pushover, or you already already have another
 notifier such as Pushbullet, you will need to make some changes to the
 Alertmanager configuration and Terraform modules. However, doing so is beyond
 the scope of this documentation.

:::

## GitLab

GitLab is an excellent, all-in-one DevOps platform. We will be leveraging it
 to provide automated infrastructure deployment, as well as issue / alert /
 incident tracking.

1. Sign in to your GitLab account, and
   [fork](https://gitlab.com/ralgar/oracle-cloud-lab/-/forks/new) my
   repository.

1. Go to **Settings >> Monitor >> Alerts**, and select **Add new integration**.
   - Set the **integration type** to *Prometheus*.
   - Set the **Enable integration** toggle to *Active*.
   - Enter any placeholder URL for the deprecated **Prometheus API base URL**
     field.
   - Select **Save integration**.
   - On your new integration, select the gear icon under **Actions** and, under
     the **View credentials** tab, copy the **Webhook URL** and **Authorization
     key**, and temporarily store them somewhere safe.

1. Go to **Settings >> CI/CD >> Variables**, and configure the following
   variables using the values you recorded in the previous steps.

   :::caution Security Risk

   Many of these variables contain sensitive information. Be sure to *mask*
   them where appropriate, to ensure they are never displayed in your CI
   pipeline logs.

   :::

   :::tip

   The default region is `us-phoenix-1`. This region has multiple
   **Availability Domains**, which provides better fault tolerance. If you use
   a [custom region](https://docs.oracle.com/en-us/iaas/Content/General/Concepts/regions.htm)
   , it is strongly recommended that you choose one with multiple availability
   domains if possible.

   :::

   | Key                                  | Type    | Flags  | Optional |
   |--------------------------------------|---------|--------|----------|
   | TF_VAR_cloudflare_api_token          | ENV_VAR | Masked | No       |
   | TF_VAR_gitlab_prometheus_auth_key    | ENV_VAR | Masked | No       |
   | TF_VAR_gitlab_prometheus_webhook_url | ENV_VAR | Masked | No       |
   | TF_VAR_oci_fingerprint               | ENV_VAR | Masked | No       |
   | TF_VAR_oci_key_file                  | FILE    | N/A    | No       |
   | TF_VAR_oci_region                    | ENV_VAR | N/A    | Yes      |
   | TF_VAR_oci_tenant_id                 | ENV_VAR | Masked | No       |
   | TF_VAR_oci_user_id                   | ENV_VAR | Masked | No       |
   | TF_VAR_pushover_api_token            | ENV_VAR | Masked | No       |
   | TF_VAR_pushover_user_key             | ENV_VAR | Masked | No       |
