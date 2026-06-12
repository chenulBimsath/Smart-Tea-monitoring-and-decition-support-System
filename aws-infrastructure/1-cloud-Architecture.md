<h1 align="center">☁️ AWS Cloud Architecture</h1>

<p align="center">
  <img src="https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS"/>
  <img src="https://img.shields.io/badge/Amazon_Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black" alt="Amazon Linux"/>
  <img src="https://img.shields.io/badge/Security-005571?style=for-the-badge&logo=cisco&logoColor=white" alt="Security"/>
  <img src="https://img.shields.io/badge/Status-Deployed-00e676?style=for-the-badge" alt="Status"/>
</p>

<p align="center">
  <i>This file demonstrates how I designed and deployed a custom, highly available, and secure AWS infrastructure.</i>
</p>

---

## 📑 Table of Contents
- [🚀 Phase 1: Establishing the Network Foundation](#-phase-1-establishing-the-network-foundation)
- [🌐 Phase 2: Internet Access via NAT Instances](#-phase-2-internet-access-via-nat-instances-cost-optimized-ha)
- [🔒 Phase 3: Configuring Security Groups](#-phase-3-configuring-security-groups-the-virtual-firewalls)

## 📑 Architecture diagram 

![alt text](<images/Screenshot 2026-05-07 at 21.02.29.png>)

---

## 🚀 Phase 1: Establishing the Network Foundation

### 🟢 Step 1: Creating the Virtual Private Cloud (VPC)
To ensure complete control over the network environment, a custom VPC was created rather than using the default AWS network.

> [!NOTE]
> **✅ Action:** Created a new VPC with the IPv4 CIDR block `10.0.0.0/16`.

**📸 VPC Creation**

![alt text](<images/Screenshot 2026-05-28 at 14.37.57.png>)

---


**📸 Subnet Configuration**

![alt text](<images/Screenshot 2026-05-28 at 15.17.36-1.png>)

---

### 🟡 Step 3: Setting up the Internet Gateway (IGW)
To allow resources inside the public subnets to communicate with the outside internet, an Internet Gateway was required.

> [!NOTE]
> **✅ Action:** Created an Internet Gateway and successfully attached it to the custom VPC.

**📸 Internet Gateway Setup**


![alt text](<images/Screenshot 2026-05-28 at 15.19.51-1.png>)

---

### 🟣 Step 4: Configuring the Public Route Table
By default, subnets cannot route traffic to the internet. A routing rule was needed to direct public traffic to the newly created Internet Gateway.

> [!NOTE]
> **✅ Action:** Created a custom Public Route Table. Added a new route directing all internet-bound traffic (`0.0.0.0/0`) to the Internet Gateway. Finally, explicitly associated the two Public Subnets with this Route Table.

**📸 Route Tables**
![alt text](<images/Screenshot 2026-05-28 at 15.24.42.png>)
![alt text](<images/Screenshot 2026-05-28 at 15.25.22.png>)

---

## 🌐 Phase 2: Internet Access via NAT Instances (Cost-Optimized HA)

To allow resources in our Private Subnets (like the backend or ML models) to safely access the internet (e.g., to connect to external databases like Supabase or download updates), we need a Network Address Translation (NAT) setup.

> [!TIP]
> 💡 **Architectural Decision:** Instead of using expensive AWS Managed NAT Gateways, we built custom DIY NAT Instances using Amazon Linux 2023. This strategy drastically reduces monthly cloud costs while still providing secure routing capabilities.

### 🟢 Step 1: Launching the EC2 NAT Instances
We launched two standard EC2 instances to act as our network routers, placing them in different Availability Zones (AZs) to ensure the system stays online even if one zone fails.

> [!NOTE]
> **✅ Action:** Launched two instances using the Amazon Linux 2023 AMI.
> * 🖧 **Instance Type:** `t3.micro` (Highly cost-effective).
> * 📍 **Network Configuration:**
>   * Instance 1 was placed in **Public Subnet A**.
>   * Instance 2 was placed in **Public Subnet B**.
> * 🌍 **Auto-assign Public IP** was enabled for both so they can communicate with the outside internet.

**📸 EC2 NAT Instances**

![alt text](<images/Screenshot 2026-06-02 at 14.40.20.png>)

---

### 🔵 Step 2: Configuring the NAT Routing 
To convert a standard Linux machine into a network router, we had to enable IP forwarding and configure IP tables to translate private IP addresses into public ones.

**📸 NAT Routing Configuration**

![alt text](<images/Screenshot 2026-05-28 at 15.54.56.png>)
![alt text](<images/Screenshot 2026-05-28 at 15.55.35.png>)



---

### 🔴 Step 3: Disabling Source/Destination Check (Crucial Step)
By default, AWS EC2 instances block any network traffic that is not directly addressed to them. Because our NAT instances need to receive traffic from private servers and forward it to the internet, we had to turn this security feature off.

> [!IMPORTANT]
> **✅ Action:** Selected both NAT instances in the EC2 dashboard, navigated to `Networking -> Change source/destination check`, and checked the **Stop** box.

**📸 Source/Destination Check**

![alt text](<images/source and dest.png>)

---

### 🟣 Step 4: Configuring the Private Route Tables
Finally, we had to tell our private network to send all its internet-bound traffic to these new NAT instances.

> [!NOTE]
> **✅ Action:** Created two separate Private Route Tables:
> * 🔶 **AZ-A Private Route Table:** Added a rule to send all `0.0.0.0/0` (Internet) traffic to the NAT EC2 Instance located in AZ-A. Associated this table with the AZ-A Private Subnet.
> * 🔷 **AZ-B Private Route Table:** Added a rule to send all `0.0.0.0/0` (Internet) traffic to the NAT EC2 Instance located in AZ-B. Associated this table with the AZ-B Private Subnet.

**📸 Private Route Tables**

![alt text](<images/Screenshot 2026-05-28 at 15.54.56.png>)

![alt text](<images/Screenshot 2026-05-28 at 15.55.35.png>)

---

## 🔒 Phase 3: Configuring Security Groups (The Virtual Firewalls)

This phase focuses on securing the infrastructure by creating "walls and gates" (Firewalls) for the entire system. By configuring these correctly, we ensure that malicious actors have absolutely no direct access to the core backend servers.

We created three specific Security Groups (SGs) to control inbound and outbound traffic at different layers of the architecture.

### 🛡️ Step 1: Application Load Balancer Security Group (ALB-SG)
This security group acts as the front door to the application. It allows users from anywhere on the internet to reach the Load Balancer to access the website.

| ⚙️ Config | 📋 Value |
|---|---|
| **Name** | `ALB-SG` |
| **VPC** | `smart-tea-vpc` |
| **Inbound Rules** | 🟢 HTTP \| Source: Anywhere-IPv4 (`0.0.0.0/0`)<br>🟢 HTTPS \| Source: Anywhere-IPv4 (`0.0.0.0/0`) |
| **Outbound Rules** | 🌍 All traffic allowed (`0.0.0.0/0`) |

**📸 ALB-SG Configuration**

![alt text](<images/Screenshot 2026-05-28 at 16.38.08.png>)

---

### 🛡️ Step 2: Application Servers Security Group (EC2-App-SG)
This is where AWS's security architecture shines. Instead of whitelisting static IP addresses, this security group only accepts traffic that originates from the Load Balancer's security group.

| ⚙️ Config | 📋 Value |
|---|---|
| **Name** | `EC2-App-SG` |
| **VPC** | `smart-tea-vpc` |
| **Security Logic** | 🔒 *"Only allow inbound traffic if it comes directly from the Application Load Balancer."* |
| **Outbound Rules** | 🌍 All traffic allowed (`0.0.0.0/0`) |

**📸 EC2-App-SG Configuration**

![alt text](<images/Screenshot 2026-06-08 at 00.53.47.png>)
---

### 🛡️ Step 3: NAT Instances Security Group (NAT-SG)
This security group acts as the gateway for the custom NAT Instances created in Phase 2. It securely allows resources inside the Private Subnets to send internet-bound traffic to the NAT instances.

| ⚙️ Config | 📋 Value |
|---|---|
| **Name** | `NAT-SG` |
| **VPC** | `smart-tea-vpc` |
| **Inbound Rules** | 🟢 All traffic \| Source: `10.0.0.0/16` (The entire custom VPC CIDR block) |
| **Outbound Rules** | 🌍 All traffic allowed (`0.0.0.0/0`) to route out to the internet. |

**📸 NAT-SG Configuration**

![alt text](<images/Screenshot 2026-06-02 at 14.55.13.png>)


---
<p align="center"><b>End of Documentation</b></p>
