# Watch Hook

A Node.js service for monitoring incidents from a StatusPage and triggering custom module notifications.

## Features

- Periodically checks incidents from a StatusPage API.
- Detects changes and new incidents.
- Notifies custom modules about updates.
- Configurable logging levels via `.env`.

## Usage

1. Clone this repository.
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Configure your `.env` file with StatusPage credentials and desired log level.
4. Run the service:  
   ```bash
   node index.js
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
