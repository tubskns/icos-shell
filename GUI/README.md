Initial implementation of Icos-Web using [Next.js](https://nextjs.org/).

## Run
First we should run following proxyserver to handle the HTTPS requests.
(this is temporary and will be removed on final deployment.)

```bash
node .\proxyserver.js
```

Then, concurrently run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

