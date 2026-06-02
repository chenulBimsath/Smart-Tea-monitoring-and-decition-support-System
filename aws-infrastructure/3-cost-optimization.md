## 💸 Phase 3: Advanced Cost Optimization (Spot Instances)

To make the infrastructure highly cost-effective without sacrificing reliability, the Auto Scaling Group was reconfigured to utilize **AWS Spot Instances**. Spot instances leverage spare AWS compute capacity, offering steep discounts (up to 90%) compared to standard On-Demand pricing. 

Because our ASG automatically handles instance replacements and the ALB safely routes traffic, we can safely use Spot instances with **zero downtime**, reducing our overall compute bill by ~70%.

---

### 🛠️ Step 1: Modifying ASG Purchase Options

We updated the existing Auto Scaling Group to shift entirely from On-Demand instances to Spot instances.

* ⚙️ **Action:** Edited the `App-ASG` configuration and selected **Combine purchase options and instance types**.

| ⚙️ Configuration | 📌 Value | 📝 Description |
| :--- | :--- | :--- |
| **Instance Types** | 🖥️ `t3.small`, `t3a.small` | Manually added multiple instance types to ensure high availability if one type runs out of Spot capacity. |
| **On-Demand Base** | 🔢 `0` | Ensured no expensive baseline instances are required. |
| **On-Demand % Above Base** | 📉 `0%` | Forces the ASG to use **100% Spot Instances** for all scaling activities. |
| **Allocation Strategy** | 🎯 `Price capacity optimized` | Instructs AWS to provision instances from the deepest, cheapest spare capacity pools to minimize the chance of interruptions. |

![ASG Purchase Options Configuration](<Screenshot 2026-05-30 at 16.50.04 copy.png>)

---

### 🔄 Step 2: Executing an Instance Refresh (Rolling Update)

To apply the new Spot pricing model to the currently running (expensive) instances without taking the application offline, we triggered an automated rolling update.

* ⚙️ **Action:** Navigated to the **Instance refresh** tab within the ASG and initiated a refresh.

> 🟢 **Minimum Healthy Percentage:** Set strictly to `50%`. This ensures the system gracefully deletes the old On-Demand instances one by one *only after* spinning up the new Spot instances, maintaining continuous availability.

![alt text](<images/Screenshot 2026-05-30 at 16.52.24.png>)
---