# Local Docker log collection

The optional ELK stack collects container logs from the local Docker host. It is disabled by default; start the normal application services with the `logging` profile when you need to inspect backend logs:

```sh
docker compose --profile logging up -d
```

The profile starts Elasticsearch on [http://localhost:9200](http://localhost:9200), Kibana on [http://localhost:5601](http://localhost:5601), and Filebeat. Elasticsearch is configured as a single node with a 512 MB Java heap (`-Xms512m -Xmx512m`). The stack also needs memory for the Elasticsearch process, Kibana, Filebeat, and the existing app services, so allow additional Docker memory beyond that heap.

Filebeat reads Docker's JSON container logs from `/var/lib/docker/containers/*/*.log` and enriches events with container metadata using the Docker socket. It sends the events to Elasticsearch, where the configured index pattern is `filebeat-*`. This setup expects a Linux Docker host that exposes those standard paths; Docker Desktop or a nonstandard container log location may need equivalent host paths configured.

After the services are healthy, install the 30-day Elasticsearch retention policy:

```sh
bash monitoring/setup-elk.sh
```

The script calls Elasticsearch at `localhost:9200`, so run it on the host after the profile is up. Then open Kibana, go to **Discover**, select the `filebeat-*` data view (create it with `@timestamp` as the time field if prompted), choose a time range, and filter for the backend container, for example `container.name : "stellarmarketpay-backend-1"`. Container names vary by Compose project; use the `container.name` field or inspect `docker compose ps` to identify the exact name. Search the `message` field for errors or other log text.

Stop the stack when finished:

```sh
docker compose --profile logging down
```

The `es_data` volume preserves Elasticsearch data across restarts. Remove it only when you intentionally want to delete the collected log data (`docker compose down -v`).
