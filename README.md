# Jannik's Web App

Welcome to Jannik's Web App! This web application provides various features, including News Search, Stock Dashboard, Wikisearch with Reader, Train Dashboard, and secure user authentication with Recaptcha and database connection for the watchlist.
The project was part of my Web Engineering course at the DHBW Stuttgart.


### Docker Installation

1. **Install and open docker desktop**


2. **Open the project folder in the terminal and run the following commands to build the docker image:**
    ```bash
    docker build -t your-image-name .
    ```
    You can choose any name for the image, but it is recommended to use a name that is related to the project.

3. **Run the Docker Container:**
    ```bash
    docker run -p 3000:3000 -d your-image-name
    ```

4. **Open in Browser:**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000).
---
5. **Stop the Docker Container:**
    ```bash
    docker stop your-container-id
    ```
   The container id is printed out when you run the container or you can get it with the following command:
    ```bash
    docker ps
    ```
   
6. **Remove the Docker Container:**
    ```bash
    docker rm your-container-id
    ```

### Standard Installation (If you want to code yourself)

1. **Clone the Repository:**
    ```bash
    git https://github.com/janniklth/janniks-web-app.git
    cd janniks-web-app
    ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and configure the necessary variables. Sample `.env` file:
    ```env
    PORT=3000
    NEWS_API_KEY=your-api-key
    FMP_API_KEY=your-api-key
    DB_CLIENT_ID=your-api-key
    DB_CLIENT_SECRET=your-api-key
    RECAPTCHA_SITE_KEY=your-api-key
    RECAPTCHA_SECRET_KEY=your-api-key
    ```

4. **Start the Application:**
    ```bash
    npm start
    ```

5. **Open in Browser:**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000).


## Features

### News Search
- Search for the latest news articles.
- Stay informed with up-to-date news from various sources.
- No RSS feed, but therefore i implemented a search function

### Stock Dashboard
- Track stock prices and view relevant financial information.
- Customize your stock watchlist for personalized tracking. (with dummy data due to limited API calls)
- Note: The demo watchlist (see below for credentials) is already filled with some stocks.
- Note: You can only search for exact american stock symbols (e.g. AAPL for Apple Inc. or MSFT for Microsoft Corporation)

### Wikisearch with Reader
- Search and explore information from Wikipedia.
- Listen to the article with the built-in reader.

### Train Dashboard
- View train timetables and departure information.
- Stay on top of train schedules for your preferred stations.

### Login with Recaptcha and Cookies
- Secure user authentication with Recaptcha verification.
- Persistent login using cookies.
- Personalized watchlist stored in the database.
- Create your own account and login to access your watchlist or use the test account with the following credentials:
    - Email: muster@mail.de
    - Password: 12345678

### Docker use
- The project can be run in a docker container.
- See above for installation instructions.

### Website Runs on Server
- Deployed version of the website is accessible at [janniks-web-app.de](https://janniks-web-app.onrender.com/).
- Maybe this could get an extra credit point? :)
- Note: The website is optimized for local deployment and viewing in Mozilla Firefox. Some features may not work as intended on the deployed s.

### (Weather Dashboard)
- should not be graded, because it is not fully functional
- did not delete it, because I might want to finish it in the future

### Error Handling
- Error handling for invalid routes and server errors.
- Error handling for invalid user input.
- Error handling for invalid API responses.

## Bugs

### Train API
- Very limited time range for train data.

### News API
- Occasional repetition of similar articles.

### Stock Dashboard
- Watchlist is not updated, because of limited API calls per day.
- It should only show the database connection

### Bootstrap Buttons
- Bootstrap buttons are not displayed correctly sometimes
- The buttons resize on click for some reason
- I tried to fix it, but it was not reproducible on other projects

## Functionality Overview:

The web application is designed with a combination of server-side and client-side JavaScript, utilizing various routes to manage different features. 
Most of the routes are structured in extra files, to have a clean function-related file structure. 
To mitigate Cross-Origin Resource Sharing (CORS) and keep API keys secure, most requests are routed through the server. 
This architecture ensures a secure and controlled environment for handling sensitive information and stores the api keys in a .env file, which is not uploaded to github.

- **Server-side JS and Routes:**
   - The server is implemented using JavaScript, handling routes for different features such as weather, news, stocks, wikisearch, and trains.
   - Each feature has dedicated server-side logic/routes for processing requests, interacting with APIs, and delivering data to the client.
   - There are some general routes for the login, logout, register, and the watchlist which are used on every page.

- **Client-side JS:**
   - Client-side JavaScript is responsible for rendering dynamic content, handling user interactions, and making requests to the server.
   - Each feature has dedicated client-side logic for a seperated file structure.
   - It enhances the user experience by enabling updates without need for page reloads.

- **User authentication**
  - The user authentication is implemented with Firebase and Firestore and secure by google recaptcha.
  - The user can create an account, login and logout.
  - The login status is saved in a cookie, so the user does not have to login every time he visits the website.
  - The login status is checked on every page, so you can on every page see if you are logged in or not (e.g. the navbar login/logout button changes)
  - On every registration, the user gets a unique id, which is used to create a watchlist in the database, which is connected to the user.
  - Even on a local installation, the watchlist is stored in the database and can be accessed from every device, as long as the user is logged in.

## Conclusion:

The development of this web application presented both challenges and learning opportunities. Here are some key takeaways in addition to the bugs and features mentioned above:

- **API Challenges:**
   - The train API posed challenges due to its limited time range, requiring creative solutions to fetch relevant data.
   - The third-party APIs used for news sometimes delivered redundant articles, necessitating additional logic for content filtering.

- **Firebase and Firestore:**
   - Implementing Firebase and Firestore for user authentication and data storage provided valuable insights into creating a secure and scalable web application.
   - The lack of comprehensive documentation for the Firestore database API in connection with NodeJS Server/Client app required extensive trial and error.

- **Bootstrap:**
   - Bootstrap played a crucial role in simplifying the design process, allowing focus on functionality over intricate styling.
   - The framework provided a responsive and visually appealing layout for the web application.

- **Continuous Learning:**
   - Developing this project offered a significant learning experience in structuring and organizing a web application.
   - It served as an opportunity to explore secure user authentication practices, database management, and handling complex API integrations as well as deepening my knowledge of JavaScript and NodeJS and clean code principles.

Overall, the project provided a platform for experimentation and growth.
I am looking forward to continuing this project and adding more features in the future.

Feel free to explore and provide feedback. Happy browsing!

---

*Note: Update the URLs, keys, and other configurations as needed for your specific setup.*

*Note: I used a translator to have a uniform language over the whole project.*
