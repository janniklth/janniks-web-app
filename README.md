# Jannik's Web App

Welcome to Jannik's Web App! This web application provides various features, including News Search, Stock Dashboard, Wikisearch with Reader, Train Dashboard, and secure user authentication with Recaptcha and database connection for the watchlist.
The project was part of my Web Engineering course at the DHBW Stuttgart.


### Docker Installation

1. **Build the Docker Image:**
    ```bash
    docker build -t your-image-name .
    ```

2. **Run the Docker Container:**
    ```bash
    docker run -p 3000:3000 -d your-image-name
    ```

3. **Configure Environment Variables (if not set in Dockerfile):**
   If any environment variables are not set in the Dockerfile, create a `.env` file and configure them.

4. **Open in Browser:**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

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
- Customize your stock watchlist for personalized tracking.

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
- Watchlist is not updated in real-time, because of limited API calls per day.

### Bootstrap Buttons
- Bootstrap buttons are not displayed correctly sometimes
- The buttons resize on click for some reason
- I tried to fix it, but it was not reproducible on other projects

Feel free to explore and provide feedback. Happy browsing!

---

*Note: Update the URLs, keys, and other configurations as needed for your specific setup.*
