# News Aggregator API

A powerful Laravel 12 application that aggregates news from multiple sources including NewsAPI, The Guardian, and New York Times. This API provides endpoints to search, filter, and retrieve news articles from various sources in a unified format.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **PHP** >= 8.2
- **Composer** >= 2.0
- **MySQL** >= 8.0
- **Node.js** >= 18.x (for frontend assets)
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/allan-kirui57/news-aggregator-api.git
cd news-aggregator-api
```

### 2. Install Dependencies

```bash
composer install
```

### 3. Environment Configuration

Copy the environment example file:

```bash
cp .env.example .env
```

### 4. Generate Application Key

```bash
php artisan key:generate
```

### 5. Database Setup

Configure your database connection in the `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=news_aggregator
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 6. Run Migrations

```bash
php artisan migrate
```

### 7. Seed the Database

```bash
php artisan db:seed
```

## 🔑 API Keys Configuration

You need to create accounts and obtain API keys from the following news sources:

### Required API Accounts

| Provider | Website | Documentation |
|----------|---------|---------------|
| **NewsAPI.org** | [https://newsapi.org/](https://newsapi.org/) | [Docs](https://newsapi.org/docs) |
| **The Guardian** | [https://open-platform.theguardian.com/](https://open-platform.theguardian.com/) | [Docs](https://open-platform.theguardian.com/documentation/) |
| **New York Times** | [https://developer.nytimes.com/](https://developer.nytimes.com/) | [Docs](https://developer.nytimes.com/docs) |

### Environment Variables

Add the following API configurations to your `.env` file:

```env
# NewsAPI Configuration
NEWS_API_KEY=your_newsapi_key_here
NEWS_API_URL=https://newsapi.org/v2

# The Guardian API Configuration
GUARDIAN_API_KEY=your_guardian_api_key_here
GUARDIAN_BASE_URL=https://content.guardianapis.com

# New York Times API Configuration
NYT_API_KEY=your_nyt_api_key_here
NYT_API_URL=https://api.nytimes.com/svc
NYT_API_SECRET=your_nyt_api_secret_here
```

## 🔧 Configuration Steps

### 1. NewsAPI.org Setup
1. Visit [NewsAPI.org](https://newsapi.org/)
2. Sign up for a free account
3. Copy your API key from the dashboard
4. Add it to `NEWS_API_KEY` in your `.env` file

### 2. The Guardian API Setup
1. Go to [The Guardian Open Platform](https://open-platform.theguardian.com/)
2. Register for an API key
3. Add the key to `GUARDIAN_API_KEY` in your `.env` file

### 3. New York Times API Setup
1. Visit [NYT Developer Portal](https://developer.nytimes.com/)
2. Create an account and register an application
3. Subscribe to the APIs you want to use (Article Search API recommended)
4. Copy your API key and secret
5. Add them to `NYT_API_KEY` and `NYT_API_SECRET` in your `.env` file

## 🏃‍♂️ Running the Application

### Development Server

```bash
php artisan serve
```

The application will be available at `http://localhost:8000`

### Queue Workers (for background jobs - API Fetching)

```bash
php artisan queue:work
```

### Base URL
```
http://localhost:8000/api/v1
```

## 🔄 Data Synchronization

The application includes commands to fetch and sync data from news sources:

```bash
# Fetch articles from all sources
php artisan fetch:articles

# Fetch from specific source
php artisan fetch:articles --source=newsapi
php artisan fetch:articles --source=guardian
php artisan fetch:articles --source=nyt
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Links

- [Laravel Documentation](https://laravel.com/docs)
- [NewsAPI Documentation](https://newsapi.org/docs)
- [Guardian API Documentation](https://open-platform.theguardian.com/documentation/)
- [NYT API Documentation](https://developer.nytimes.com/docs)

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/allan-kirui57/news-aggregator-api/issues) page
2. Create a new issue with detailed information
3. Provide error logs and environment details

---

**Happy coding! 🚀**
