# Initial Architecture

                React Frontend
                       │
                API Gateway (NGINX)
                       │
      ┌────────────────┼────────────────┐
      │                │                │
   Auth Service    Product Service   Cart Service
      │                │                │
      ├────────────┬───┼────────────┬───┤
                   │                │
             Order Service    Payment Service
                   │
         Notification Service
                   │
            Analytics Service