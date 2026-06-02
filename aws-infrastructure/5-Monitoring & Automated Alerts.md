# 🚨 Automated Monitoring & Alerting (CloudWatch + Lambda + SES)

![AWS](https://img.shields.io/badge/AWS-Cloud-FF9900?logo=amazonaws&logoColor=white)
![CloudWatch](https://img.shields.io/badge/Amazon_CloudWatch-Monitoring-FF4F8B?logo=amazonaws&logoColor=white)
![Lambda](https://img.shields.io/badge/AWS_Lambda-Serverless-FF9900?logo=awslambda&logoColor=white)

> ✨ **Overview:** This document demonstrates the configuration of a highly proactive, automated monitoring system for the **Smart Tea Monitoring** infrastructure. It details how AWS CloudWatch, AWS Lambda, and Amazon SES were integrated to automatically dispatch rich HTML email alerts to administrators whenever backend CPU utilization exceeds critical thresholds (70%).

---

## 📑 Table of Contents
1. [🏗️ Architectural Decision: Bypassing SNS](#️-architectural-decision-bypassing-sns)
2. [✉️ Step 1: Configuring Amazon SES](#️-step-1-configuring-amazon-ses)
3. [⚡ Step 2: Creating the Serverless Lambda Function](#-step-2-creating-the-serverless-lambda-function)
4. [👁️ Step 3: Configuring the CloudWatch Alarm](#️-step-3-configuring-the-cloudwatch-alarm)


---

## 🏗️ Architectural Decision: Bypassing SNS

Initially, traditional AWS architectures routed CloudWatch alarms through Amazon SNS (Simple Notification Service) to trigger a Lambda function. However, utilizing modern AWS updates, we directly integrated CloudWatch with AWS Lambda. 

**Why bypass SNS?**
* **Reduced Latency:** Direct integration removes an unnecessary intermediary hop (SNS), ensuring alerts are processed milliseconds faster.
* **Cost Efficiency:** Reduces unnecessary SNS publishing costs.
* **Separation of Concerns:** The Auto Scaling Group (ASG) inherently manages the `70% CPU` Target Tracking Policy (creating/deleting instances). Our custom CloudWatch Alarm is strictly isolated to trigger at `80% CPU` solely for **administrative notification**, preventing logic conflicts.

---

## ✉️ Step 1: Configuring Amazon SES
To send rich HTML emails rather than default plain-text alerts, we configured Amazon Simple Email Service (SES).

* **Action:** Navigated to the SES Dashboard -> **Identities**.
* **Verification:** Added and verified the administrator email (`admin@smartteamonitor.com`) to authorize SES to send outbound emails on our behalf.

---

## ⚡ Step 2: Creating the Serverless Lambda Function
We deployed a Python-based serverless function to intercept the CloudWatch alert, format the data into a professional HTML template, and dispatch it via SES.

* **Action:** Created an AWS Lambda function named `Send-HTML-Alert-Email` using `Python 3.10`.
* **Permissions:** Attached the `AmazonSESFullAccess` IAM policy to the Lambda execution role.
![alt text](<images/Screenshot 2026-05-31 at 17.33.59.png>)

---


## 👁️ Step 3: Configuring the CloudWatch Alarm
We configured the explicit threshold that triggers the Lambda function.

**Action:** Created a new CloudWatch Alarm mapped to the App-ASG Auto Scaling Group.

**Metric:** CPUUtilization >= 70%.

Action Configuration: * Under the "Lambda action" section, mapped the trigger directly to the Send-HTML-Alert-Email function.

![alt text](<images/Screenshot 2026-05-31 at 17.40.45.png>)
Crucial: Ensured no Auto Scaling actions were added to this specific alarm to prevent conflicts with the ASG's internal 70% Target Tracking policy.