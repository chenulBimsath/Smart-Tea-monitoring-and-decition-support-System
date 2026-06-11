# 📝 Centralized Docker Logging Architecture (AWS CloudWatch)

![AWS](https://img.shields.io/badge/AWS-Cloud-FF9900?logo=amazonaws&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containers-2496ED?logo=docker&logoColor=white)
![CloudWatch](https://img.shields.io/badge/Amazon_CloudWatch-Logging-FF4F8B?logo=amazonaws&logoColor=white)

> ✨ **Overview:** This document outlines the implementation of a centralized logging architecture for the **Smart Tea Monitoring** infrastructure. By integrating Docker's native `awslogs` driver with Amazon CloudWatch, we ensure that critical application logs survive the termination of ephemeral Auto Scaling EC2 instances, enabling seamless remote debugging.

---

## 📑 Table of Contents
1. [⚠️ The Problem: Ephemeral Instances & Data Loss](#️-the-problem-ephemeral-instances--data-loss)
2. [🔐 Step 1: Configuring IAM Permissions](#-step-1-configuring-iam-permissions)
3. [🗄️ Step 2: Creating the CloudWatch Log Group](#️-step-2-creating-the-cloudwatch-log-group)
4. [📜 Step 3: Updating the Launch Template (User Data)](#-step-3-updating-the-launch-template-user-data)


---

## ⚠️ The Problem: Ephemeral Instances & Data Loss

In an Auto Scaling environment, EC2 instances are **ephemeral** (temporary). If a Spring Boot backend or Python ML model encounters a fatal error and crashes, the Auto Scaling Group (ASG) immediately terminates the instance and provisions a new one. 

Because standard Docker logs are saved locally to the EC2 hard drive, **terminating the instance permanently deletes the crash logs**. Centralized logging solves this by streaming logs directly to a highly available AWS vault (CloudWatch) *before* the instance is destroyed.

![alt text](<Untitled Diagram (2).jpg>)

---

## 🔐 Step 1: Configuring IAM Permissions
To allow the EC2 instances to securely transmit log data to CloudWatch without hardcoded credentials, we expanded the existing IAM Instance Profile.

* 🛠️ **Action:** Navigated to the IAM Dashboard and modified the existing EC2 execution role.
* 🛡️ **Policy Attached:** `CloudWatchLogsFullAccess` (or `CloudWatchAgentServerPolicy`).
* ✅ **Result:** Grants the EC2 instances the required API permissions to create log streams and push log events directly to CloudWatch.

![alt text](<images/Screenshot 2026-06-01 at 14.46.28 copy.png>)

---

## 🗄️ Step 2: Creating the CloudWatch Log Group
We provisioned a central "vault" within CloudWatch to aggregate logs from all auto-scaling servers.

* 🛠️ **Action:** Created a new Log Group in the CloudWatch Console.

| ⚙️ Configuration | 📌 Value | 📝 Description |
| :--- | :--- | :--- |
| **Log Group Name** | `smart-tea-logs` | The master directory where all application logs will be stored. |
| **Retention Setting** | `14 Days` | Automatically deletes older logs to optimize AWS storage costs. |



![alt text](<images/Screenshot 2026-06-01 at 14.41.02.png>)

---

## 📜 Step 3: Updating the Launch Template (User Data)

We modified the ASG's Launch Template to instruct Docker to bypass local file storage and stream `stdout` and `stderr` directly to CloudWatch upon container startup.

* 🛠️ **Action:** Created a new Launch Template version with the updated Bash execution script.

![alt text](<images/Screenshot 2026-06-01 at 14.34.56.png>)


## 📜  result

![alt text](<images/Screenshot 2026-06-01 at 14.39.12 copy.png>)

---