# Watch Hook

**Watch Hook** is a free, open-source, and extensible solution to monitor StatusPage incidents and automate notifications or integrations with your own modules.

## Main Advantages

- **Free & MIT Licensed:** No usage or distribution restrictions.
- **Webhook for StatusPage:** Receives and processes incident updates.
- **Extensible:** Easily add your own modules to handle incidents.
- **Configurable Logging:** Control log level via `.env`.
- **Docker Ready:** Image ready for use and customization.
- **Automated release and Docker Hub publishing.**

## How to Use

### 1. Docker Installation

The easiest way to use Watch Hook is via Docker.  
You can use the official image or build your own.

#### Using the official image

```bash
docker pull kauaalvesqueiros/watch-hook:latest
docker run -v /path/to/your/modules:/app/modules -v /path/to/your/.env:/app/.env kauaalvesqueiros/watch-hook:latest
```

#### Building your own image

Clone the repository and build the image:

```bash
git clone https://github.com/kaua-alves-queiros/watch-hook.git
cd watch-hook
docker build -t watch-hook .
```

By default, the Dockerfile copies the modules and `.env` into the image:

```dockerfile
FROM node:20
WORKDIR /app
COPY . .
COPY ./modules /app/modules
COPY .env /app/.env
RUN npm install
CMD ["node", "index.js"]
```

### 2. Configuration

Use the `.env.example` file as a template:

```bash
cp .env.example .env
```

Fill in your StatusPage credentials and choose the log level:

```
STATUS_PAGE_BASE_URL=https://api.statuspage.io/v1/pages/
STATUS_PAGE_PAGE_ID=your_page_id
STATUS_PAGE_API_KEY=your_api_key
LOG_LEVEL=info
```

**Available log levels:**  
`error` `warn` `info` `verbose` `debug` `silly`

### 3. Extending with Modules

Create your own modules in the `modules/` directory.  
Each module must export a `notifyUpdate(incident)` function.

Example (`modules/mymodule.js`):

```js
async function notifyUpdate(incident) {
  // Your custom logic
  console.log('New incident:', incident);
}

module.exports = {
  name: 'My module',
  notifyUpdate,
};
```

### 4. Running without Docker (optional)

If you prefer to run locally:

```bash
npm install
node index.js
```

## Automated Tests

Run all tests with:

```bash
npm test
```

## Release & Docker Workflow

When you create a new tag and push it to GitHub, the system will:

- Run all tests.
- Create an automatic release.
- Publish the image to Docker Hub.

Example:

```bash
git tag v1.0.0 -m "Stable release"
git push origin v1.0.0
```

## License

MIT. See [LICENSE](LICENSE).

## FAQ

- **How do I add my modules?**  
  Just create `.js` files in `modules/` and make sure they export `notifyUpdate`.

- **How do I configure logging?**  
  Set `LOG_LEVEL` in `.env` to your preferred level.

- **Can I use it without Docker?**  
  Yes, just install dependencies and run `node index.js`.

---

> **Notice:** This project has no relation, partnership, endorsement, or connection with StatusPage or its owners (including Atlassian).  
> It is an independent tool developed by the community.

> **Watch Hook**: fast, flexible, and open for your integrations!
