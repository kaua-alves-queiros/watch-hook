# Watch Hook

**Watch Hook** is a free, open-source, and extensible solution to monitor StatusPage incidents and automate notifications or integrations with your own modules.

## Key Advantages

- **Free and MIT Licensed:** No usage or distribution restrictions.
- **Webhook for StatusPage:** Receives and processes incident updates.
- **Extensible:** Easily add your own modules to handle incidents.
- **Configurable Logging:** Control log levels via the `.env` file.
- **Docker Ready:** Pre-built image for quick use and customization.
- **Automated Build and Publish on Docker Hub.**

## How to Use

### 1. Installation with Docker

The easiest way to use **Watch Hook** is via Docker. You can use the official image or build your own.

#### Using the official image

```bash
docker pull kauaalvesqueiros/watch-hook:latest
docker run -v /path/to/your/modules:/app/modules \
           -v /path/to/your/.env:/app/.env \
           kauaalvesqueiros/watch-hook:latest
````

#### Using Docker Compose

For simpler usage in production environments, you can use Docker Compose.
Create a file named `docker-compose.yml` and add the following content:

```yaml
services:
  watch-hook:
    container_name: dxn-watch-hook
    image: kauaalvesqueiros/watch-hook:v0.0.8
    restart: always # Optional: restart the container in case of failure
    volumes:
      - ./.env:/app/.env
      - ./database:/app/database
      - ./modules:/app/modules
```

This file configures the `watch-hook` service, ensuring the `.env`, database directory, and custom modules are mounted as volumes, allowing persistence and easy updates.

To start the service, run the following command in the same directory as the file:

```bash
docker-compose up -d
```

### 2. Configuration

Use the `.env.example` file as a template:

```bash
cp .env.example .env
```

Fill in your StatusPage credentials and choose the log level:

```env
STATUS_PAGE_BASE_URL=https://api.statuspage.io/v1/pages/
STATUS_PAGE_PAGE_ID=your_page_id
STATUS_PAGE_API_KEY=your_api_key

# Possible LOG_LEVEL values:
# error, warn, info, verbose, debug, silly
LOG_LEVEL=info

# Interval in milliseconds for checking incidents
LOOP_INTERVAL_MS=60000
```

**Available log levels:**
`error` `warn` `info` `verbose` `debug` `silly`

### 3. Extending with Modules

Create your own modules in the `modules/` directory.
Each module must export a function `notifyUpdate(incident)`.

Example (`modules/mymodule.js`):

```js
async function notifyUpdate(incident) {
  // Your custom logic
  console.log('New incident:', incident);
}

module.exports = {
  name: 'My Module',
  notifyUpdate,
};
```

### 4. Running without Docker (optional)

If you prefer to run locally:

```bash
npm install
node index.js
```

## License

MIT. See [LICENSE](./LICENSE).

## FAQ

* **How do I add my own modules?**
  Just create `.js` files inside `modules/` and ensure they export the `notifyUpdate` function.

* **How do I configure logging?**
  Set `LOG_LEVEL` in the `.env` file to your desired level.

* **Can I use it without Docker?**
  Yes, simply install the dependencies and run `node index.js`.

---

> ⚠️ **Disclaimer:** This project has no affiliation, partnership, endorsement, or connection with StatusPage or its owners (including Atlassian).
> It is an independent community-developed tool.

**Watch Hook**: fast, flexible, and open for your integrations!