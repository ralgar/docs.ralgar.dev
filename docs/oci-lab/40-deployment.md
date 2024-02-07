---
sidebar_position: 5
---

# Deployment

Now that we've completed both the Initial Setup, and the Configuration, we are
 finally ready to deploy the cluster and its services.

## Triggering the CI pipeline

The CI pipeline is triggered automatically any time you push new commits to
 the GitLab repository. Since we made some modifications in the previous steps,
 all we need to do is commit and push the changes.

```sh
git add .
git commit -m "Configure cluster for my domain"
git push -u origin main
```

If you go to your project page in GitLab, then go to **Build >> Pipelines**,
 you can monitor the pipeline's progress. The first run will take a significant
 length of time to provision the cluster resources (around 20-25 minutes).

Once the pipeline is complete, you can click the download icon and select the
 `terraform:apply:archive` artifact. This archive will contain your
 `kube_config` file, which should be placed at `~/.kube/config` on your local
 system. This will enable you to manually interact with the cluster.

## Monitoring the cluster deployments

We don't need to do anything to deploy our applications to the cluster. Flux
 will handle application deployment automatically for us, as well as reconcile
 any drift in state, and deploy any future changes that we push to the repo.

To manually monitor the deployment process, you will need the kube config
 from the previous step. Then run the `kubectl` command against the cluster.

```sh
kubectl get pods -A
```

You can also use the Flux CLI to check the reconciliation state.

```sh
flux get all
```

Shortly after the cluster applications have finished deploying, you should
 receive your first watchdog notification from the monitoring system. If you
 don't receive the notification for some reason, then something is wrong. You
 can troubleshoot using `kubectl` and the Flux CLI.
