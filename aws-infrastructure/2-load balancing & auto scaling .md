# ⚖️ Load Balancing & Auto Scaling Architecture 🚀

![AWS](https://img.shields.io/badge/AWS-Cloud-FF9900?logo=amazonaws&logoColor=white)
![EC2](https://img.shields.io/badge/Amazon_EC2-Compute-FF9900?logo=amazonec2&logoColor=white)
![Auto_Scaling](https://img.shields.io/badge/Auto_Scaling-Dynamic-232F3E?logo=amazonaws&logoColor=white)

> ✨ **Overview:** This document demonstrates the configuration and implementation of high availability and dynamic scaling for the **Smart Tea Monitoring** system using AWS Application Load Balancing (ALB) and Auto Scaling Groups (ASG).

---

## 📑 Table of Contents
1. [🌐 Phase 1: Load Balancing Configuration](#-phase-1-load-balancing-configuration)
  
2. [⚙️ Phase 2: Auto Scaling Group (ASG) & Dynamic Scaling](#️-phase-2-auto-scaling-group-asg--dynamic-scaling)
  

## 🌐 Phase 1: Load Balancing Configuration

### 🎯 Step 1: Creating the Target Group
A Target Group acts as a logical grouping of our EC2 instances. Instead of telling the Load Balancer exactly which individual servers to send traffic to, we instruct it to forward traffic to this specific Target Group.

* 🛠️ **Action:** Created a new Target Group via the EC2 Dashboard.

| ⚙️ Configuration | 📌 Value | 📝 Description |
| :--- | :--- | :--- |
| **Target Type** | 💻 `Instances` | Targets individual EC2 virtual machines. |
| **Name** | 🏷️ `App-Target-Group` | Unique identifier for the group. |
| **Protocol & Port** | 🔌 `HTTP` on Port `8000` | Matches the application/Docker port configured in the Security Groups. |
| **VPC** | ☁️ `smart-tea-vpc` | The custom virtual private cloud network. |
| **Health Checks** | 🩺 `HTTP` (Path: `/`) | The Load Balancer constantly pings this path to ensure servers are healthy before routing traffic. |
| **Register Targets** | ⏭️ *Skipped* | No instances were manually added here because the Auto Scaling Group handles this automatically. |


---

## ⚙️ Phase 2: Auto Scaling Group (ASG) & Dynamic Scaling

This phase represents the core of the cloud architecture's resilience and scalability. Instead of manually launching EC2 instances, we configured an AWS Auto Scaling Group (ASG) to **automatically provision, configure, and terminate** instances based on real-time traffic demand. 

To achieve this, we created a "blueprint" (Launch Template) and assigned a "manager" (Auto Scaling Group) to enforce scaling rules.

### 🔐 Step 1: IAM Role for ECR Access
Because the new EC2 instances need to automatically download our Docker images from the Elastic Container Registry (ECR) upon boot, they require specific permissions.

* 🛠️ **Action:** Created an IAM Role named `EC2-ECR-Access-Role`.
* 📜 **Policy Attached:** `AmazonEC2ContainerRegistryReadOnly`.
* ✅ **Result:** This grants the EC2 instances secure, read-only access to pull images from ECR without requiring hardcoded AWS credentials.

![alt text](<images/Screenshot 2026-05-29 at 20.26.10.png>)

---

### 📜 Step 2: Creating the Launch Template
The Launch Template defines the exact specifications and bootstrap commands required to build every new server.

* 🛠️ **Action:** Created a Launch Template named `App-Launch-Template`.

| ⚙️ Configuration | 📌 Value |
| :--- | :--- |
| **AMI** | 🐧 `Amazon Linux 2023` |
| **Instance Type** | 🖥️ `t3.micro` |
| **Network & Security** | 🛡️ Attached `EC2-App-SG` and assigned the `EC2-ECR-Access-Role` IAM profile. |

> **🚀 Automation (User Data):** Injected a Bash script that runs automatically when the server boots. This script updates the OS, installs Docker, logs into AWS ECR, pulls the latest Docker image, and runs the application container on port `8000`.

![alt text](<images/Screenshot 2026-05-29 at 20.28.05.png>)
![alt text](<images/Screenshot 2026-05-29 at 20.31.49.png>)

---
### 🚥 Step 2: Creating the Application Load Balancer (ALB)
Once the Target Group was ready, we created the actual Load Balancer to accept incoming web traffic.

* 🛠️ **Action:** Created a new Application Load Balancer from the EC2 Dashboard.

| ⚙️ Configuration | 📌 Value |
| :--- | :--- |
| **Name** | 🏷️ `App-ALB` |
| **Scheme** | 🌍 `Internet-facing` *(To accept public internet traffic).* |
| **IP Address Type** | 🌐 `IPv4` |
| **Network Mapping** | ☁️ Selected `smart-tea-vpc`.<br>✅ Selected both Availability Zones (`AZ-A` and `AZ-B`) to ensure high availability.<br><br>🚨 **Crucial Step:** Mapped the ALB specifically to the **Public Subnets** in both zones, allowing it to communicate with the outside world. |
| **Security Groups** | 🛡️ Removed the default security group and attached `ALB-SG` (Created in Phase 3) to allow open HTTP/HTTPS access. |
| **Listeners and Routing** | 🎧 Configured the ALB to listen on `HTTP` (Port 80) and set the default routing action to forward all traffic to `App-Target-Group`. |



![alt text](<images/Screenshot 2026-05-29 at 20.53.18.png>)
![alt text](<images/Screenshot 2026-05-29 at 20.53.56.png>)


---

### 🤖 Step 3: Configuring the Auto Scaling Group (The Manager)
With the blueprint ready, we configured the ASG to manage the lifecycle of the instances.

* 🛠️ **Action:** Created an Auto Scaling Group named `App-ASG`.
* 🌍 **Network Integration:** Placed the ASG exclusively within the **Private Subnets** (`AZ-A` and `AZ-B`) to ensure the servers remain isolated from direct public access.
* 🔗 **Load Balancer Integration:** Attached the ASG to the `App-Target-Group`. Enabled Elastic Load Balancing health checks to ensure the ASG automatically terminates and replaces any unresponsive instances *(Self-Healing)*.

**⚖️ Capacity Settings:**
* 🟢 **Desired Capacity:** `1` *(Maintains 1 active instance by default).*
* 🔽 **Minimum Capacity:** `1` *(Ensures at least 1 instance is always running).*
* 🔼 **Maximum Capacity:** `3` *(Allows scaling up to 3 instances during high traffic spikes).*

![alt text](<images/Screenshot 2026-05-29 at 20.34.23.png>)

---

### 📈 Step 4: Dynamic Scaling Policy (Target Tracking)
Initially, the ASG maintains a static number of instances. To make the system dynamically respond to traffic spikes, we implemented an automated scaling policy.

* 🛠️ **Action:** Created a "Target Tracking" scaling policy named `CPU-Tracking-Policy`.
* 📊 **Metric:** Average CPU utilization.
* 🎯 **Target Value:** `70%`.

> **🏆 Result:** AWS automatically creates backend CloudWatch Alarms. If the average CPU load across the instances exceeds **70%**, the ASG automatically provisions new instances (up to the maximum capacity of 3). When traffic subsides, it safely terminates unneeded instances to optimize cloud compute costs. 💸

![alt text](<images/Screenshot 2026-05-29 at 20.35.50.png>)