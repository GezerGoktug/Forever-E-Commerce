# **Forever E-Commerce Shop**

This project is an e-commerce clothing platform developed using MERN Stack technologies. Users can browse products, apply filters, search,favourite, and view detailed product information. They can also add items to their cart, manage quantities, and complete purchases via Stripe or cash on delivery.The platform includes features like user authentication, order management, send email and an admin panel for managing products and viewing statistics. Also customers can ask to AI Chatbot what they wanna help about shop general info ,faqs or recommend product. This chatbot recommend products according user intent,preferences. Or it provide to help what shop general info,faqs,shop goals, cargo informations etc. according to shop info knowledge context.


### 🔑 **Features:**

- **Authentication:**
  - Strong and secure authentication.
  - Login with popular service providers.
  - Securely reset password functionality

- **Product Browsing and Management:**
  - View and filter clothing products by category, sub category, and sorting
  - Search for specific products.
  - View detailed product information and customer reviews.
  - Add products to cart in desired sizes.
  - Add products to favourites.
  - Add ,Edit or delete product reviews.

- **Shopping Cart and Orders:**
  - Manage cart items (increase quantity, remove items).
  - Checkout with payment via Stripe or cash on delivery.
  - View and track orders in the user profile.
  - Successfully payment emails
 
- **Customer Help Service with AI Chatbot**
  - Answers about Shop general information or faqs.
  - Recommend products according to user wants, intents or semantic preferences.

- **Admin Dashboard:**
  - Admin can add, update, delete, and list products.
  - Manage customer orders and view detailed order history.
  - Access sales and other statistics with charts and reports.





### 🔨 **Technologies Used:**

### 💻 **Frontend:**

### **Monorepo Architecture**
It is an approach that keeps multiple projects under a single repository (root directory), but also allows these projects to be managed independently. 
<br>
Advantages:
- Each application is developed independently,
- Code base complexity is avoided,
- Teams can work on their own applications without interfering with others.

The codebase started to grow for Admin and main application . For this reason this two application divided two app,two repo and two codebase within monorepo as admin and main.Pnpm was used for monorepo arch. Some frequently used structure transfered to libs folders. These folders can install and call inside apps same a npm package.

🔷 **Using General Libraries in Applications:**

- **React**: JavaScript library for building user interfaces .
- **Sass**: CSS preprocessor for cleaner, more efficient styling.
- **React Icons**: For user interface icons.
- **Tanstack React Query**: Data-fetching library for managing server state and caching.
- **React Hook Form** and **Zod**: Form validation and management.
- **Axios**: Promise-based HTTP client for API requests.
- **Framer Motion**: Animation library for smooth transitions in React.
- **Zustand**: Lightweight state management library for React.
- **React Router Dom**: Routing library for navigation in SPAs.
- **Recharts and React Google Charts**: Libraries for creating interactive data charts.
- **React Helmet**: Manages HTML head tags for better SEO.
- **React Hot Toast**: Switch between dark and light mode.
- **Day.js**: Lightweight library for date manipulation.
- **Clsx**: Utility for conditionally combining class names.
- **React Responsive**: Makes it easier to process breakpoints on react.
- **React Select**: Customizable select input component.
- **IMask**: Input masking for formatting user input.
- **Millify**: Formats large numbers for readability.

🔷 **Created Custom Util Libraries:**

- **@forever/api**: structured libs with axios for better api requests, interceptor management.
- **@forever/sass-utils**: sass utils kit about frequently using some mixins, color variables, utils css functions.
- **@forever/storage-kit**: helper library for local storage and session storage create read and delete operations with ttl time .
- **@forever/ui-kit**: ui component lib for frequently using atomic generic components at ui
- **@forever/hook-kit**: kit about some frequently using hooks.
- **@forever/speech**: hook, utils set usign Speech Recognition API
- **@forever/common-utils**: structures, tools, and components that are not related to the UI but may be frequently used.
- **@forever/theme-kit**: component function set about theme settings.
- **@forever/query-kit**: helper functions, hooks about better manage, create search params.

### 🌐 **Backend:**
- **Express.js**: Web framework for building Rest APIs in Node.js.
- **Helmet**: Adds security headers to Express apps.
- **Cors**: To manage CORS policies.
- **Express Async Handler**:  Middleware for handling async errors.
- **Stripe**: Payment processing for online transactions.
- **Swagger-jsdoc & Swagger-UI-Express**: Auto-generates API documentation.
- **Passport & Passport Google OAuth**: Authentication middleware with OAuth support.
- **Cookie Parser**: Parses cookies for session management.
- **JWT**: More secure session management with access token and refresh token.
- **MongoDB**: Database system.
- **Redis**: Database that we use to cache data for faster responses and request limiting.
- **Bcryptjs**: For hashing password with encryption algorithm.
- **Mongoose**: ODM for MongoDB.
- **Cloudinary & Multer**: Media hosting and file upload handling.
- **Dotenv**: Loads environment variables for secure app configuration.
- **Nodemailer**: For send mail.
- **ejs** and **juice**: Embedded javascript html templates and css file parse to inside html as inline.
- **winston** and **morgan**: Logs edit format and save to file library and http requests logger middleware 
- **Langchain**: Framework for building LLM-powered applications.
- **Langgraph**: Orchestration tools for building controllable agents. Or helper create workflow agentic workflows
- **Faiss Node**: Local Vector Database Library.

### 🛠 **Devops:**
- **Docker** : For application containerization
- **Nginx** : For web server and reverse proxy

### 🌐 **Deployment:**
- **Netlify** : Frontend Monorepo hosting
- **Render** : Backend Server hosting


### 🤖 **AI Customer Support Chatbot with Langchain and Langgraph**

A chatbot was created using Langchain and Langgraph to provide customer support. Two tools were defined in the system that the LLM  can use with Langchain and Langgraph: one for general questions and one for product recommendations.

Some conditional explanatory instructions were generated to determine which tool the LLM should use based on the customer's intent. The LLM analyzes the user's intent, sends the appropriate parameters to the appropriate tool, and waits for a response. Vector search was used for both general questions and product recommendations. 

For general information, the vector tools in Langchain break down the text in the PDF document containing the information content into parts, and then these data are converted into vectors. To avoid further conversion, this data is stored in a local vector database called faiss-node. Based on cosine similarities, the closest text fragments are found and sent to the LLM, which then generates a suitable response for the user. 

For product recommendations, vector versions of the semantic parts of the products are stored in a MongoDB database. Vector search support in MongoDB is used to perform vector searches and retrieve the most similar products. Sometimes the data requested by the user is not semantic, for example, the top 3 most priced products. Since this is more of a numerical ranking, it doesn't contain any semantic information, but in such cases, LLM instructions are provided to send filter values. Thus, support is provided for scenarios where the data is not semantic. 

The RAG architecture is used as the basis for this type of vector search scenario. Langgraph also assists LLM in running additional functions and conditional routing tools with the instructions given to LLM.

### Desktop View

<img width=500 src="https://github.com/user-attachments/assets/8a812032-a8cb-4325-9927-eecaeb8fbdc4" />
<img width=500 src="https://github.com/user-attachments/assets/afd6ee52-41da-43c6-8ddf-9f272e73c562" />
<img width=500 src="https://github.com/user-attachments/assets/c364511c-8120-46f4-91d7-21250e19fc5e" />
<img width=500 src="https://github.com/user-attachments/assets/cc3c078b-3cc0-41b1-bf7b-1c20d321ea80" />
<img width=500 src="https://github.com/user-attachments/assets/5da3ed0c-594d-4ee8-b1c4-85b00b6a8021" />
<img width=500 src="https://github.com/user-attachments/assets/edf67e8d-fe75-4fbf-bbbc-6134b8dcd769" />
<img width=500 src="https://github.com/user-attachments/assets/af349026-8916-4656-a4e3-b39f7b402125" />
<img width=500 src="https://github.com/user-attachments/assets/b882c8c1-011b-4865-8b3f-95e98f6e74d0" />
<img width=500 src="https://github.com/user-attachments/assets/f18d0e10-070f-4975-a2eb-8294160d0d76" />
<img width=500 src="https://github.com/user-attachments/assets/18a862ab-664a-4c67-9d45-978e0a8a7fa3" />
<img width=500 src="https://github.com/user-attachments/assets/0ecdd70a-4384-42fe-9724-d06b527002a3" />
<img width=500 src="https://github.com/user-attachments/assets/e0cb703c-33af-4932-9a2d-1a736dfb843d" />






### Mobile View


<img width=300 src="https://github.com/user-attachments/assets/b5ba411b-010d-4bf3-92cd-5ad570576a16" />
<img width=300 src="https://github.com/user-attachments/assets/9212ad47-0a13-4aaf-80ce-9f5f24380e66" />
<img width=300 src="https://github.com/user-attachments/assets/9f0cee01-f0a2-48fd-ae3c-d1f475d06450" />
<img width=300 src="https://github.com/user-attachments/assets/4f71b39b-dccf-447f-b4f5-31f09dce432a" />
<img width=300 src="https://github.com/user-attachments/assets/7745a353-6a5d-42ba-88fc-2cc407a7b453" />
<img width=300 src="https://github.com/user-attachments/assets/9952920a-cff6-40eb-b3e1-baf81e4a58d2" />





## 🔧 **Setup**

1.**Download the repository**

```
git clone https://github.com/GezerGoktug/MERN-E-commerce.git
```

2.**Enter the project directory**

```
cd MERN-E-commerce
```

3.**Install Required Dependencies for Frontend**

```
cd frontend
pnpm install
```
4.**Create a mongo db on mongo db website if it doesn't exist** 
 
- Also create a redis db if it doesn't exist

- You can create your database by opening your account via Mongodb, choosing a free plan and authorizing your IP address to access it. 
- Also you can create serverless redis db at Vercel Storage tabs

5.**Create an .env file with the following content in the same directory**

```
VITE_REACT_API_URL = <YOUR_BACKEND_BASE_API_URL> ex: <your_base_url>/api 

VITE_REACT_STRIPE_PUBLISHABLE_KEY = <YOUR_STRIPE_ACCOUNT_PUBLISH_KEY>

```


6.**Go a up directory ,then enter backend directory**

```
cd ..
cd backend
```

7.**Install Required Dependencies for Backend**

```
npm install
```

8.**Create an .env file with the following content in the same directory**

```
MONGO_URI = <YOUR_MONGO_URI>
PORT= <YOUR_BACKEND_RUNNING_PORT>
NODE_ENV = <WORKING_ENVIRONMENT>

CLIENT_URL= <YOUR_FRONTEND_BASE_URL>
GOOGLE_API_KEY = <YOUR_GOOGLE_AI_STUDIO_API_KEY>

EMAIL_HOST= "smtp.gmail.com"
EMAIL_PORT= "587"
EMAIL_USER= <YOUR_EMAIL_ADDRESS>
EMAIL_PASS= <YOUR_GOOGLE_APP_PASSWORD>
EMAIL_FROM_NAME= "Forever E-Commerce"

REDIS_URL =  <YOUR_REDIS_DB_URL>

JWT_ACCESS_SECRET =  <YOUR_JWT_ACCESS_TOKEN_SECRET_KEY>
JWT_REFRESH_SECRET = <YOUR_JWT_REFRESH_TOKEN_SECRET_KEY>

GOOGLE_CLIENT_ID = <YOUR_GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET = <YOUR_GOOGLE_CLIENT_SECRET>



STRIPE_SECRET_KEY = <YOUR_STRIPE_ACCOUNT_SECRET_KEY>

CLOUDINARY_CLOUD_NAME = <YOUR_CLOUDINARY_CLOUD_NAME>
CLOUDINARY_API_KEY = <YOUR_CLOUDINARY_API_KEY>
CLOUDINARY_API_SECRET = <YOUR_CLOUDINARY_API_SECRET>

```

9.**Start the application backend directory**

```
npm run dev
```

9.**Then start the application frontend monorepo root directory**

```
pnpm run dev
```

11.**Show in browser**

Go to `http://localhost:3000` in your browser for frontend application.

## 🔧 **Setup with Docker**

**NOTE**: For this process, Docker must be installed on your computer.

1.**Update mongu_urı value your .env file in backend directory**

```
MONGO_URI = "mongodb://mongo-db/<YOUR_DATABASE_NAME>"
REDIS_URL = "redis://<REDIS_DB_HOST>:6379"
...
```
2.**Run docker command**

```
docker compose up -d
```

3.**Show in browser**

Go to `http://localhost:3000` in your browser.



## Contribute 🤝

- You can use the [Issues](https://github.com/GezerGoktug/MERN-E-commerce) tab for bug reports and suggestions.
- If you want to contribute to the project, create a fork and submit a pull request.

