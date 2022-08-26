## MongoDB (local)

### Installing MongoDB on Ubuntu (and WSL)

Installing MongoDB locally on Ubuntu (and WSL):

<https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/>

On WSL, also make sure to follow the section titled **Add the init script to start MongoDB as a service** here:

<https://docs.microsoft.com/en-us/windows/wsl/tutorials/wsl-database>

BUT, replace `mongodb` in the `curl` and `chmod` commands with `mongod`. So, from a terminal (ubuntu) window, run the following commands:

1. Download the init.d script for MongoDB:

  ```shell
  curl https://raw.githubusercontent.com/mongodb/mongo/master/debian/init.d | sudo tee /etc/init.d/mongod >/dev/null
  ```

2. Assign that script executable permissions:

  ```shell
  sudo chmod +x /etc/init.d/mongod
  ```

Once you have run those two commands, the following CLI commands should work for you without issue.

**NOTE:** This is not working. I gave up eventually. Wasted an entire evening on it. :(
          Planning to proceed with a MongoDB Atlas hosted database, and, if I set up anything locally going forward, I'll be using some sort of VM like vagrant, etc.

### MongoDB CLI Commands

- Issue the following command to start `mongod`:

  ```shell
  sudo service mongod start
  ```

- Verify that the `mongod` process has started successfully:

  ```shell
  sudo service mongod status
  ```

- You can also check the log file for the current status of the
`mongod` process, located at: `/var/log/mongodb/mongod.log` by default. A running `mongod` instance will indicate that it is ready for connections with the following line:

  `[initandlisten] waiting for connections on port 27017`

- Stop the `mongod` service by issuing the following command:

  ```shell
  sudo service mongod stop
  ```

- Issue the following command to restart the `mongod` service:

  ```shell
  sudo service mongod restart
  ```

- Start a `mongosh` session on the same host machine as the `mongod`. You can run `mongosh` without any command-line options to connect to a `mongod` that is running on your localhost with default port **27017**.

  ```shell
  mongosh
  ```

### Helpful MongoDB Links

MongoDB _Getting Started Guides_:

<https://www.mongodb.com/docs/manual/tutorial/getting-started/#std-label-getting-started>

`mongosh` documentation:

<https://www.mongodb.com/docs/mongodb-shell/>

MongoDB Developer API Docs:

<https://api.mongodb.com/>

### MongoDB log files

MongoDB log files are in structured JSON format. To easily pretty-print them, use the `jq` utility:

<https://stedolan.github.io/jq/>

<https://stedolan.github.io/jq/download/>

On macOS and WSL, use Homebrew to install it:

```shell
brew install jq
```

Once installed, you can use jq to pretty-print log entries as follows:

- Pretty-print the entire log file:

  ```shell
  sudo cat /var/log/mongodb/mongod.log | jq
  ```

- Pretty-print the most recent log entry:

  ```shell
  sudo cat /var/log/mongodb/mongod.log | tail -1 | jq
  ```

More examples of working with MongoDB structured logs are available in the
[Parsing Structured Log Messages](https://www.mongodb.com/docs/manual/reference/log-messages/#std-label-log-message-parsing) section.
