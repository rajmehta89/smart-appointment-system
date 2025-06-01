# Smart Appointment & Token Management System

A modern, scalable solution for managing appointments and virtual queues for local businesses like barbershops, clinics, and salons.

## 🌟 Features

### For Customers
- Secure authentication (OTP/email)
- Appointment booking and management
- Real-time token tracking
- Push notifications
- Integrated payment system

### For Business Owners
- Comprehensive admin dashboard
- Slot management
- Walk-in customer handling
- Customer notifications
- Analytics and reporting
- Multi-branch support

## 🏗 Architecture

### Tech Stack
- **Frontend (Admin)**: React.js + Tailwind CSS
- **Mobile App**: React Native + Expo
- **Backend Services**:
  - Auth Service: Java Spring Boot
  - Booking Service: Go
  - Payment Service: Java Spring Boot + Razorpay
  - Notification Service: Go + Firebase
- **Database**: PostgreSQL + Redis
- **DevOps**: Docker, Docker Compose, NGINX

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18+
- Java JDK 17
- Go 1.20+
- PostgreSQL 15+
- Redis 7+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/smart-appointment-system.git
cd smart-appointment-system
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the services:
```bash
docker-compose up
```

4. Access the applications:
- Admin Portal: http://localhost:3000
- API Documentation: http://localhost:8080/swagger-ui.html

## 📦 Project Structure

```
smart-appointment-system/
├── backend/
│   ├── auth-service/        # Spring Boot
│   ├── booking-service/     # Go
│   ├── payment-service/     # Spring Boot
│   ├── notification-service/# Go + Firebase
│   └── gateway/            # NGINX/API Gateway
├── frontend/
│   ├── admin-portal/       # React Web App
│   └── customer-app/       # React Native App
├── database/
│   ├── schema.sql
│   └── redis-init.conf
├── deployment/
│   ├── docker/
│   └── nginx/
└── docs/
    └── api-docs.yaml       # OpenAPI Spec
```

## 💡 API Documentation

The API documentation is available in OpenAPI (Swagger) format at `/docs/api-docs.yaml`

## 🔒 Security

- JWT-based authentication
- Role-based access control
- Data encryption at rest
- Secure payment processing
- Regular security audits

## 🌐 Scalability

- Microservices architecture
- Container orchestration
- Database sharding support
- Redis caching
- Multi-tenant support

## 💼 Business Model

### Pricing Tiers
1. **Free Tier**
   - Single branch
   - Basic features
   - Limited appointments/month

2. **Professional**
   - Multiple branches
   - Advanced analytics
   - Priority support
   - Custom branding

3. **Enterprise**
   - Custom solutions
   - API access
   - Dedicated support
   - SLA guarantees

## 📄 License
 
This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests. 