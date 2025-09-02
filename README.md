# Watch Hook

**Watch Hook** is a free, open-source, and extensible webhook solution for StatusPage.  
It allows you to monitor incidents and automate notifications or integrations with your own modules, without any cost or vendor lock-in.

**Repository:** [https://github.com/kaua-alves-queiros/watch-hook.git](https://github.com/kaua-alves-queiros/watch-hook.git)

## Highlights

- **Free & MIT Licensed:** Use, modify, and distribute with no restrictions.
- **Webhook for StatusPage:** Acts as a webhook to receive and process incident updates from StatusPage.
- **Highly Extensible:** Easily add your own modules to handle incident updates (e.g., send alerts, trigger scripts, integrate with other systems).
- **Configurable Logging:** Control verbosity with multiple log levels (`error`, `warn`, `info`, `verbose`, `debug`, `silly`).
- **No Affiliation:** Not affiliated with StatusPage or Atlassian.

## Features

- Periodically checks incidents from a StatusPage API.
- Detects changes and new incidents.
- Notifies custom modules about updates.
- Configurable logging levels via `.env`.
- Exponential backoff on errors for robust operation.
- Simple database storage for incident state.

## Usage

1. **Clone this repository:**
   ```bash
   git clone https://github.com/kaua-alves-queiros/watch-hook.git
   cd watch-hook
   ```
2. **Install dependencies:**  
   ```bash
   npm install
   ```
3. **Configure your `.env` file:**  
   Add your StatusPage credentials and desired log level.
   ```
   STATUS_PAGE_BASE_URL=https://api.statuspage.io/v1/pages/
   STATUS_PAGE_PAGE_ID=your_page_id
   STATUS_PAGE_API_KEY=your_api_key
   LOG_LEVEL=info
   ```
4. **Run the service:**  
   ```bash
   node index.js
   ```

## How It Works

- The service fetches incidents from your StatusPage at regular intervals.
- It compares the latest incidents with previously stored data.
- If a new incident or a change is detected, it triggers all loaded modules via their `notifyUpdate` method.
- You can create your own modules to handle updates in any way you want.

## Extending with Modules

To add custom behavior, create a module in the `modules` directory.  
Each module must export a `notifyUpdate(incident)` function, where `incident` is the complete incident object (no key, just the object).

Example module (`modules/zapbridge.js`):

```js
async function notifyUpdate(incident) {
  // Your custom logic here
  console.log(incident);
}

module.exports = {
  name: 'your module',
  notifyUpdate,
};
```

## Configuration

Set the following variables in your `.env` file:

```
STATUS_PAGE_BASE_URL=
STATUS_PAGE_PAGE_ID=
STATUS_PAGE_API_KEY=
LOG_LEVEL=info
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Disclaimer

This software is not affiliated with, endorsed by, or connected to StatusPage or its parent company.  
All trademarks and copyrights belong to their respective owners.

---

> **Watch Hook** is the world's best free webhook for StatusPage.  
> Fast, flexible, and open for your integrations.
