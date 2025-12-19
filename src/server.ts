import config from "./config";
import app from "./app";

const port = config.port;

app.listen(port, () => {
  console.log(`example app listening on port ${port}`);
})