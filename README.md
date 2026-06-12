# 🌱 Smart Tea Monitoring and Decision Support System

[![AWS Architecture](https://img.shields.io/badge/AWS-Production_Grade-FF9900?logo=amazonaws)](https://aws.amazon.com/)
[![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot-6DB33F?logo=spring)](https://spring.io/)
[![Python](https://img.shields.io/badge/ML_Engine-Python-3776AB?logo=python)](https://python.org/)
[![Docker](https://img.shields.io/badge/Containerization-Docker-2496ED?logo=docker)](https://docker.com/)

**Live Project URL:** [https://smartteamonitor.com](https://smartteamonitor.com) 

## 📌 Project Overview
The Smart Tea Monitoring and Decision Support System is a comprehensive, cloud-native agricultural technology platform. It integrates **NDVI satellite monitoring, machine learning-based yield prediction, and fertilizer analytics** to provide actionable insights for tea plantation management. 

Beyond its core analytical features, this project features a highly available, fault-tolerant, and cost-optimized infrastructure deployed entirely on Amazon Web Services (AWS), demonstrating strong DevOps and Cloud Engineering practices.

---

## 🚀 Key Features

### Agricultural Intelligence
* **NDVI Satellite Monitoring:** Analyzes satellite imagery to track crop health and vegetation indices.
* **Yield Prediction Engine:** Machine learning models forecast future tea yields based on historical data, weather patterns, and soil conditions.
* **Fertilizer Analytics:** Provides customized, data-driven fertilizer application recommendations to optimize growth and minimize waste.

### System Resiliency
* **Self-Healing Infrastructure:** Terminated or unhealthy instances are automatically detected and replaced by the Auto Scaling Group.
* **Automated Admin Notifications:** Real-time email alerts for high-stress system events.

---

## 💻 Tech Stack

* **Frontend:** React.js, HTML5, CSS3
* **Backend:** Java Spring Boot, RESTful APIs
* **Machine Learning:** Python, Scikit-Learn / TensorFlow, Pandas
* **Database:** supabase
* **DevOps & Cloud (AWS):** * Compute: EC2 (Spot Instances), Auto Scaling Groups (ASG), Lambda
  * Networking: VPC, Application Load Balancer (ALB)
  * Storage/Registry: S3, Elastic Container Registry (ECR)
  * Monitoring/Security: CloudWatch Alarms & Logs, SES, IAM, 
  * Containerization: Docker, Docker Compose
  * CI/CD: GitHub Actions



---
---

## 🏗️ Cloud Architecture & Infrastructure Highlights

This application is deployed using a robust, scalable  architecture designed for zero-downtime and cost efficiency.

* **Architected a AWS Cloud Infrastructure:** Designed and deployed a highly available, fault-tolerant system on AWS to host a machine learning-based agricultural monitoring platform.


<img width="927" height="872" alt="Screenshot 2026-05-01 at 10 00 52" src="https://github.com/user-attachments/assets/826b79dd-c9bc-45b7-a1ef-7683c7b338f1" />

---
(Note: AWS deployment configurations, including Launch Templates and IAM policies, are documented in the /aws-infrastructure directory)..

---
---

* **Continuous Integration/Continuous Deployment (CI/CD):** Fully automated deployment pipelines via GitHub Actions ensure that code commits automatically trigger builds, ECR image updates, and ASG instance refreshes for seamless delivery.

<img width="1145" height="860" alt="Screenshot 2026-05-25 at 21 22 21" src="https://github.com/user-attachments/assets/74ad0a81-0466-48a2-a79e-180688cba98e" />

---

* **Frontend Delivery & Automation:** Hosted the React.js frontend on Amazon S3 and utilized Amazon CloudFront (CDN) for low-latency global content delivery. Fully automated the deployment process using CI/CD pipelines.

---
  
* **Backend Orchestration & Auto Scaling:** Spring Boot backend services and Python ML models are containerized using Docker and stored in Amazon Elastic Container Registry (ECR). Deployments are managed by an **Auto Scaling Group (ASG)** behind an **Application Load Balancer (ALB)**, allowing the system to dynamically scale in/out based on real-time traffic variations.

  ---

* **Cost Optimization (Spot Instances and NAT Instances):** The ASG is configured to utilize 100% EC2 Spot Instances with a 'Price Capacity Optimized' allocation strategy and 'Capacity Rebalancing' enabled. Additionally, highly cost-effective NAT Instances were deployed in place of managed NAT Gateways. This combined architecture reduces overall compute and networking costs by ~70% while seamlessly rotating instances with zero downtime.

---
  
* **Proactive Monitoring & Automated Alerts:** Integrated **Amazon CloudWatch** alarms to monitor CPU utilization. If traffic spikes cause CPU usage to exceed 80%, an automated **AWS Lambda** function is triggered, dispatching a richly formatted HTML incident report to administrators via Amazon SES.

 <img width="1672" height="862" alt="Screenshot 2026-05-25 at 20 29 54" src="https://github.com/user-attachments/assets/d5ae52e0-d6ce-4e2b-ad6b-15b6c1b2fe8a" />

---
  
* **Centralized Logging:** Ephemeral Docker containers stream application and error logs directly to **CloudWatch Logs** via the `awslogs` driver, ensuring persistent, centralized debugging capabilities even after auto-scaling instance termination.

 <img width="1672" height="862" alt="Screenshot 2026-05-25 at 20 28 32" src="https://github.com/user-attachments/assets/a6a63426-e9b2-4ddb-b483-1e071c5785f1" />




---
---



## 🛠️ Getting Started (Local Development)

### Prerequisites
* Docker and Docker Compose installed
* Java 17+
* Node.js & npm
* Python 3.10+

### Installation Steps

1. **Clone the repository**
   ```bash
   [git clone [https://github.com/your-username/smart-tea-monitor.git](https://github.com/your-username/smart-tea-monitor.git)
   cd smart-tea-monitor](https://github.com/chenulBimsath/Smart-Tea-monitoring-and-decition-support-System.git)



---

👥 Contributors


* Chenul Bimsath -   Frontend Development / Backend Development /machine learing model]
* Nipun Akarshana - Frontend Development
* Dulina nethmal - Frontend Development
* Oshan Wijesinghe - Cloud Architecture, DevOps / Backend Development]
* Dumindu Ranathuga - Database Development
* yehan ayanja - Frontend Development

---

⚠️ Usage Notice: This system and its underlying code are intended strictly for educational purposes. Any form of commercial use, monetization, or distribution for profit is explicitly prohibited.


