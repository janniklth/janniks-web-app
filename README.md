# Jannik's Web App

Welcome to Jannik's Web App! This web application provides various features, including News Search, Stock Dashboard, Wikisearch with Reader, Train Dashboard, and secure user authentication with Recaptcha and database connection for the watchlist.

## Installation

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/your-username/your-repo.git
    cd your-repo
    ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and configure the necessary variables. Sample `.env` file:
    ```env
    REACT_APP_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
    REACT_APP_API_BASE_URL=http://localhost:3001  # Update the URL if your server runs on a different port or domain
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

### Stock Dashboard
- Track stock prices and view relevant financial information.
- Customize your stock watchlist for personalized tracking.

### Wikisearch with Reader
- Search and explore information from Wikipedia.
- Enjoy a reader-friendly interface for a better reading experience.

### Train Dashboard
- View train timetables and departure information.
- Stay on top of train schedules for your preferred stations.

### Login with Recaptcha and Cookies
- Secure user authentication with Recaptcha verification.
- Persistent login using cookies.
- Personalized watchlist stored in the database.

### Website Runs on Server
- Deployed version of the website is accessible at [your-domain.com](https://your-domain.com).
- Note: The website is optimized for local deployment and viewing in Mozilla Firefox. Some features may not work as intended on the deployed s.

## Bugs

### Train API
- Limited time range for train data.
- Some schedules may not be accurate due to API limitations.

### News API
- Occasional repetition of similar articles.

Feel free to explore and provide feedback. Happy browsing!

---

*Note: Update the URLs, keys, and other configurations as needed for your specific setup.*
